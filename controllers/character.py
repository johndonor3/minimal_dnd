#!/usr/bin/env/python 

from quart import render_template, Blueprint, request

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


character_page = Blueprint("character", __name__)

@character_page.route('/character/<name>.html', methods=["GET", "POST"])
async def character(name):
    """ character detail """

    form = await request.form

    dbChar = await db.getCharacter(name)

    char = {k: dbChar[k] for k in dbChar.keys()}

    if "title" in form:
        await db.addNote(char["id"], form["title"], form["text"])
    
    if "hp" in form:
        curr = char["hp"]
        delta = int(form["hp"])
        # update is expecting 2 lists!
        await db.updateCharacter(name, ["hp"], [curr+delta])

        # then pull again
        dbChar = await db.getCharacter(name)
        char = {k: dbChar[k] for k in dbChar.keys()}

    abils = await db.getAbilty(char["id"])
    abils = {k: abils[k] for k in abils.keys()}
    mods = {k: toModifier(abils[k]) for k in abils.keys()}
    skills = await db.getSkills(char["id"])
    skills = {k: skills[k] for k in skills.keys()}
    purse = await db.getPurse(char["id"])
    purse = {k: purse[k] for k in purse.keys()}

    notes = await db.getNotes(char["id"])
    notes = {n["title"]: n["body"] for n in notes}

    template_dict = getTemplateDictBase()
    template_dict.update({"char": char, 
                          "abils": abils,
                          "mods": mods,
                          "skills": skills,
                          "purse": purse,
                          "notes": notes})
    return await render_template("character.html", **template_dict)


# @character_page.route('/character/updateHP')
# async def updateHP():
#     """ character detail """
#     test_char = creature(name="AEGON THE CONQUERERER", race="human")
    
#     template_dict = getTemplateDictBase()
#     template_dict.update({"test_char": test_char.toDict(),
#                           "char_obj": test_char})
#     return await render_template("character.html", **template_dict)
