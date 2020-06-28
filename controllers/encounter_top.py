#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

from . import getTemplateDictBase
import dbTools as db
# from rules.creature import creature

encounters_page = Blueprint("encounters", __name__)

@encounters_page.route('/encounters.html', methods=["GET", "POST"])
async def encounters():
    """ character detail """

    form = await request.form

    if "encounter" in form:
        new_name = form["encounter"]
        await db.addEncounter(new_name)

    encounters = await db.getEncounters()

    template_dict = getTemplateDictBase()
    template_dict.update({"encounters": encounters})
    return await render_template("encounters.html", **template_dict)
