#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

from . import getTemplateDictBase


combat_page = Blueprint("combat", __name__)

@combat_page.route('/combat.html', methods=["GET", "POST"])
async def combat():
    """ character detail """

    template = getTemplateDictBase()

    return await render_template("combat.html", **template)
