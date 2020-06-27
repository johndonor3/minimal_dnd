#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

from . import getTemplateDictBase
import dbTools as db
# from rules.creature import creature

encounter_page = Blueprint("encounter", __name__)

@encounter_page.route('/encounter.html', methods=["GET", "POST"])
async def encounter():
    """ character detail """

    form = await request.form

    if "hp" in form:
        delta = int(form["hp"])
        name = form["name"]

        dbChar = await db.getCharacter(name)
        char = {k: dbChar[k] for k in dbChar.keys()}
        curr = char["hp"]
        # update is expecting 2 lists!
        await db.updateCharacter(name, ["hp"], [curr+delta])

    chars = await db.getCharacters()

    # chars = {k: dbChar[k] for k in dbChar.keys()}

    characters = [{"name": c["name"], "hp": c["hp"]} for c in chars]

    template_dict = getTemplateDictBase()
    template_dict.update({"characters": characters})
    return await render_template("encounter.html", **template_dict)


# @character_page.route('/character/updateHP')
# async def updateHP():
#     """ character detail """
#     test_char = creature(name="AEGON THE CONQUERERER", race="human")
    
#     template_dict = getTemplateDictBase()
#     template_dict.update({"test_char": test_char.toDict(),
#                           "char_obj": test_char})
#     return await render_template("character.html", **template_dict)
