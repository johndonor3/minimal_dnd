#!/usr/bin/python

from quart import render_template, Blueprint, g, request

from . import getTemplateDictBase

import dbTools as db
# from rules.creature import creature


index_page = Blueprint("index_page", __name__)

@index_page.route('/', methods=["GET", "POST"])
async def index():
    """ Index page. """

    form = await request.form
    
    if "character" in form:
        base = {"iniative": -1,
                "speed": 25,
                "proficiency": 3,
                "hp": 15}

        abilities = {"strength": 11,
                     "dexterity": 11,
                     "constitution": 11,
                     "intelligence": 11,
                     "wisdom": 11,
                     "charisma": 11}
        name = form["character"]
        await db.addCharacter(name, base, abilities)
        # await db.addCharacter(name, hp=10)

    characters = await db.getCharacters()

    template = getTemplateDictBase()

    template.update({"characters": characters})

    return await render_template("index.html", **template)

