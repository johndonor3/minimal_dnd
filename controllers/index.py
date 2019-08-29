#!/usr/bin/python

from quart import render_template, Blueprint, g, request

from . import getTemplateDictBase

import dbTools as db
# from rules.creature import creature


index_page = Blueprint("index_page", __name__)

@index_page.route('/', methods=["GET", "POST"])
async def index():
    """ Index page. """

    if request.method == 'POST':
        # check if the post request has the file part
        if 'char' in request.files:
            file = request.files['file']
            fullName = os.path.join("/var/www/dnd/", file.filename)
            try:
                await file.save(fullName)
                loadNew = True
            except:
                flash("there was a problem with your file!")
        else:
            flash('No file part')

    if loadNew:
        char = yaml.load(open(str(fullName)))
        await db.addCharacter(char["name"], char["base"], char["abilities"])
        # await db.addCharacter(name, hp=10)

    characters = await db.getCharacters()

    template = getTemplateDictBase()

    template.update({"characters": characters})

    return await render_template("index.html", **template)

