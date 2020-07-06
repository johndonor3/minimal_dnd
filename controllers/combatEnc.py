#!/usr/bin/env/python 

import re
import os
import asyncio

from quart import render_template, Blueprint, request, flash

import dbTools as db
from . import getTemplateDictBase

def syncList():
    """sync call for os, ugh..."""
    dirName = os.path.abspath(__file__)
    parent = dirName.split("controllers")[0]
    maps = os.listdir(os.path.join(parent, "static/images"))
    return maps


combatEnc_page = Blueprint("combatEnc", __name__)

@combatEnc_page.route('/combat/<name>.html', methods=["GET", "POST"])
async def combat(name):
    """ character detail """

    form = await request.form

    dbEnc = await db.getEncounter(name)

    encounter = {k: dbEnc[k] for k in dbEnc.keys()}

    eid = encounter["id"]
    useMap = encounter["useMap"]

    if "map" in form:
        new_name = form["map"]
        test = "butts_map"
        await db.updateEncounterMap(eid, new_name)
        useMap = new_name

    monsters = await db.getEncMonsters(eid)
    monsters = [{"id": m["id"], "name": m["name"], "hp": m["hp"],
                 "size": m["size"]} for m in monsters]

    characters = await db.getCharacters()
    characters = [{"name": c["name"], "hp": c["hp"]} for c in characters]

    maps = syncList()

    template = getTemplateDictBase()

    template.update({"characters": characters})
    template.update({"monsters": monsters})
    template.update({"encounter_name": name})
    template.update({"map": useMap})
    template.update({"mapList": maps})

    return await render_template("combat.html", **template)
