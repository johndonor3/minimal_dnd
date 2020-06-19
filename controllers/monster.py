#!/usr/bin/env/python 

import re

from quart import render_template, Blueprint, request, flash

from . import getTemplateDictBase


monster_page = Blueprint("monster", __name__)

@monster_page.route('/monster.html', methods=["GET", "POST"])
async def monster():
    """ character detail """

    template = getTemplateDictBase()

    return await render_template("monster.html", **template)
