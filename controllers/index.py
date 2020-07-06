#!/usr/bin/python

import os
import yaml
from quart import render_template, Blueprint, request, flash, current_app

from . import getTemplateDictBase
import dbTools as db


async def loadFile(path):
    return yaml.load(open(str(path)))

index_page = Blueprint("index_page", __name__)

@index_page.route('/', methods=["GET", "POST"])
async def index():
    """ Index page. """

    loadNew = False
    if request.method == 'POST':
        # check if the post request has the file part
        files = await request.files
        if 'char' in files:
            file = files['char']
            cachedir = current_app.config["UPLOAD_FOLDER"]
            try:
                os.makedirs(cachedir)
            except:
                pass
            fullName = os.path.join(cachedir, file.filename)
            try:
                file.save(fullName)
                loadNew = True
            except:
                await flash("there was a problem with your file!")
        else:
            await flash('No file part')

    if loadNew:
        char = await loadFile(fullName)
        # await db.addCharacter(char["name"], char["base"], char["abilities"])
        await db.addCharacter(**char)
        # await db.addCharacter(name, hp=10)

    characters = await db.getCharacters()

    template = getTemplateDictBase()

    template.update({"characters": characters})

    return await render_template("index.html", **template)

