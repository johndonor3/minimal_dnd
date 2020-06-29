#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

import dbTools as db
from . import getTemplateDictBase


combat_page = Blueprint("combat", __name__)

@combat_page.route('/combat.html', methods=["GET", "POST"])
async def combat():
    """ character detail """

    encounters = await db.getEncounters()

    template_dict = getTemplateDictBase()
    template_dict.update({"encounters": encounters})

    return await render_template("combatTop.html", **template_dict)
