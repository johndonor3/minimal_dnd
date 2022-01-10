#!/usr/bin/env/python 

import re
import os
import asyncio

from quart import render_template, Blueprint, request, flash, current_app

import dbTools as db
from . import getTemplateDictBase


def syncList():
    """sync call for os, ugh..."""
    dirName = os.path.abspath(__file__)
    parent = dirName.split("controllers")[0]
    maps = os.listdir(os.path.join(parent, "static/images"))
    return maps


def listImages(path):
    """sync call for os, ugh..."""
    images = os.listdir(path)
    acceptable = ["jpg", "png", "gif", "jpeg"]
    return [i for i in images if i.split(".")[-1] in acceptable]


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

    imgdir = current_app.config["UPLOAD_FOLDER"]
    try:
        os.makedirs(imgdir)
    except:
        pass

    if request.method == 'POST':
        files = await request.files
        if 'monImage' in files:
            file = files['monImage']

            fullName = os.path.join(imgdir, file.filename)
            try:
                file.save(fullName)
                loadNew = True
            except:
                await flash("there was a problem with your file!")

    imgs = listImages(imgdir)
    imgs.sort()

    chars = await db.getEncChars(eid)

    monsters = await db.getEncMonsters(eid)
    monsters = [{"id": m["id"], "name": m["name"], "hp": m["hp"],
                 "local": m["useLocal"], "x": m["x"], "y": m["y"],
                 "size": m["size"]}
                for m in monsters]

    characters = [{"id": c["id"], "name": c["name"], "hp": c["hp"],
                   "x": c["x"], "y": c["y"], "img": c["img"]} for c in chars]

    maps = syncList()

    template = getTemplateDictBase()

    template.update({"characters": characters})
    template.update({"monsters": monsters})
    template.update({"encounter_name": name})
    template.update({"map": useMap})
    template.update({"mapList": maps})
    template.update({"monImages": imgs})
    template.update({"eid": eid})

    return await render_template("combat.html", **template)
