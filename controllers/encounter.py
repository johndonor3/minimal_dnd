#!/usr/bin/env/python 

import re
import os
import json

from quart import render_template, Blueprint, request, flash, current_app

from . import getTemplateDictBase
import dbTools as db
# from rules.creature import creature

encounter_page = Blueprint("encounter", __name__)

def convertSize(size):
    # relative to 5ft gridsize
    if size.lower() == "tiny":
        return 0.5
    elif size.lower() == "large":
        return 2
    elif size.lower() == "huge":
        return 3
    elif size.lower() == "gargantuan":
        return 4
    else:
        return 1

@encounter_page.route('/encounter/<name>.html', methods=["GET", "POST"])
async def encounter(name):
    """ character detail """

    form = await request.form

    dbEnc = await db.getEncounter(name)

    encounter = {k: dbEnc[k] for k in dbEnc.keys()}

    eid = encounter["id"]

    cachedir = current_app.config["UPLOAD_FOLDER"]
    try:
        os.makedirs(cachedir)
    except:
        pass

    loadNew = False
    if request.method == 'POST':
        files = await request.files
        if 'localMonster' in files:
            file = files['localMonster']

            fullName = os.path.join(cachedir, file.filename)
            try:
                file.save(fullName)
                loadNew = fullName
            except:
                await flash("there was a problem with your file!")

    if "hp" in form:
        delta = int(form["hp"])
        name = form["name"]

        dbChar = await db.getCharacter(name)
        char = {k: dbChar[k] for k in dbChar.keys()}
        curr = char["hp"]
        # update is expecting 2 lists!
        await db.updateCharacter(name, ["hp"], [curr+delta])

    if "monster_name" in form:
        name = form["monster_name"]
        hp = form["monster_hp"]
        size = convertSize(form["monster_size"])
        await db.addMonsterToEncounter(eid, name, hp, size, False)

    if loadNew:
        cachedMon = json.loads(open(loadNew).read())
        name = cachedMon["index"]
        hp = cachedMon["hit_points"]
        size = cachedMon["size"]
        await db.addMonsterToEncounter(eid, name, hp, size, True)

    if "hp_delta" in form:
        mid = int(form["monster_id"])
        delta = int(form["hp_delta"])

        monsters = await db.getEncMonsters(eid)
        monsters = [{"id": m["id"], "name": m["name"], "hp": m["hp"]} for m in monsters]

        hp = [m for m in monsters if m["id"] == mid][0]["hp"]

        await db.updateMonsterHP(mid, hp+delta)

    if "remove_monster" in form:
        mid = int(form["remove_monster"])
        await db.deleteMonster(mid)


    chars = await db.getCharacters()

    monsters = await db.getEncMonsters(eid)
    monsters = [{"id": m["id"], "name": m["name"], "hp": m["hp"], "local": m["useLocal"]} for m in monsters]

    characters = [{"name": c["name"], "hp": c["hp"]} for c in chars]

    template_dict = getTemplateDictBase()
    template_dict.update({"characters": characters})
    template_dict.update({"monsters": monsters})
    template_dict.update({"encounter_name": encounter["title"]})
    return await render_template("encounter.html", **template_dict)
