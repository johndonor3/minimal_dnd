#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

from . import getTemplateDictBase
import dbTools as db
# from rules.creature import creature


def toModifier(score):
    m = int((score-10)/2)
    if m < 0:
        return str(m)
    elif m > 0:
        return "+" + str(m)
    else:
        return "0"


def isDamage(s):
    return re.match("\dd\d{1,2}\s*\+?\s*\d*", s)


async def addItem(cid, form):
    weapon = isDamage(form["damage"]) is not None
    if weapon:
        damage = form["damage"]
    else:
        damage = None
    try:
        weight = float(form["weight"])
        count = int(form["count"])
    except:
        await flash("there was a problem with your item!")
        return None
    await db.addItem(cid, form["item"], weight, form["description"],
                     weapon=weapon, damage=damage, count=count)


character_page = Blueprint("character", __name__)

@character_page.route('/character/<name>.html', methods=["GET", "POST"])
async def character(name):
    """ character detail """

    form = await request.form

    dbChar = await db.getCharacter(name)

    char = {k: dbChar[k] for k in dbChar.keys()}

    if "title" in form:
        await db.addNote(char["id"], form["title"], form["text"])
    
    if "item" in form:
        await addItem(char["id"], form)

    if "hp" in form:
        curr = char["hp"]
        delta = int(form["hp"])
        # update is expecting 2 lists!
        await db.updateCharacter(char["id"], ["hp"], [curr+delta])

        # then pull again
        dbChar = await db.getCharacter(name)
        char = {k: dbChar[k] for k in dbChar.keys()}

    if "nom" in form:
        nom = form["nom"]
        val = int(form["val"])
        # update is expecting 2 lists!
        await db.updatePurse(char["id"], nom, val)

        # then pull again
        dbChar = await db.getCharacter(name)
        char = {k: dbChar[k] for k in dbChar.keys()}

    abils = await db.getAbilty(char["id"])
    # abils = {k: abils[k] for k in abils.keys()}
    char["strength"] = abils["strength"] 
    mods = {k: toModifier(abils[k]) for k in abils.keys()}

    abils = [{"abil": k, "score": abils[k], "mod": toModifier(abils[k])} for k in abils.keys()]
    
    skills = await db.getSkills(char["id"])
    skills = {k: skills[k] for k in skills.keys()}
    purse = await db.getPurse(char["id"])
    # purse = {k: purse[k] for k in purse.keys()}
    purse = [{"coin": k, "val": purse[k]} for k in purse.keys()]

    notes = await db.getNotes(char["id"])
    notes = {n["title"]: n["body"] for n in notes}

    items = await db.getItems(char["id"])
    weapons = [i for i in items if i["weapon"]]

    gear_lbs = sum([i["weight"] for i in items])

    char["gear_lbs"] = gear_lbs
    char["atk_mod"] = int(mods["strength"]) + int(char["proficiency"])

    template_dict = getTemplateDictBase()
    template_dict.update({"char": char, 
                          "abils": abils,
                          # "mods": mods,
                          "skills": skills,
                          "purse": purse,
                          "notes": notes,
                          "items": items,
                          "weapons": weapons})
    return await render_template("character.html", **template_dict)


# @character_page.route('/character/updateHP')
# async def updateHP():
#     """ character detail """
#     test_char = creature(name="AEGON THE CONQUERERER", race="human")
    
#     template_dict = getTemplateDictBase()
#     template_dict.update({"test_char": test_char.toDict(),
#                           "char_obj": test_char})
#     return await render_template("character.html", **template_dict)
