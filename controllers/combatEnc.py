#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

import dbTools as db
from . import getTemplateDictBase


combatEnc_page = Blueprint("combatEnc", __name__)

@combatEnc_page.route('/combat/<name>.html', methods=["GET", "POST"])
async def combat(name):
    """ character detail """

    dbEnc = await db.getEncounter(name)

    encounter = {k: dbEnc[k] for k in dbEnc.keys()}

    eid = encounter["id"]

    monsters = await db.getEncMonsters(eid)
    monsters = [{"id": m["id"], "name": m["name"], "hp": m["hp"]} for m in monsters]

    characters = await db.getCharacters()
    characters = [{"name": c["name"], "hp": c["hp"]} for c in characters]

    template = getTemplateDictBase()

    template.update({"characters": characters})
    template.update({"monsters": monsters})
    template.update({"encounter_name": name})

    return await render_template("combat.html", **template)
