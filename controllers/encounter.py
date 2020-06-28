#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

from . import getTemplateDictBase
import dbTools as db
# from rules.creature import creature

encounter_page = Blueprint("encounter", __name__)

@encounter_page.route('/encounter/<name>.html', methods=["GET", "POST"])
async def encounter(name):
    """ character detail """

    form = await request.form

    dbEnc = await db.getEncounter(name)

    encounter = {k: dbEnc[k] for k in dbEnc.keys()}

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
