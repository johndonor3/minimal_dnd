#!/usr/bin/env/python 

from quart import render_template, Blueprint, request, g

from . import getTemplateDictBase
import dbTools as db
# from rules.creature import creature


character_page = Blueprint("character", __name__)

@character_page.route('/character/<name>.html', methods=["GET", "POST"])
async def character(name):
    """ character detail """

    form = await request.form

    dbChar = await db.getCharacter(name)

    char = {k: dbChar[k] for k in dbChar.keys()}

    if "hp" in form:
        curr = char["hp"]
        delta = int(form["hp"])
        # update is expecting 2 lists!
        await db.updateCharacter(name, ["hp"], [curr+delta])

        # then pull again
        dbChar = await db.getCharacter(name)
        char = {k: dbChar[k] for k in dbChar.keys()}

    char["ac"] = 10
    char["initiative"] = -1
    char["speed"] = 30

    template_dict = getTemplateDictBase()
    template_dict.update(char)
    return await render_template("character.html", **template_dict)


# @character_page.route('/character/updateHP')
# async def updateHP():
#     """ character detail """
#     test_char = creature(name="AEGON THE CONQUERERER", race="human")
    
#     template_dict = getTemplateDictBase()
#     template_dict.update({"test_char": test_char.toDict(),
#                           "char_obj": test_char})
#     return await render_template("character.html", **template_dict)
