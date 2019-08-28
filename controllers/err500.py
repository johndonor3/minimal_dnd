#!/usr/bin/python
import quart
from quart import render_template

from . import getTemplateDictBase


err_page = quart.Blueprint("err_page", __name__)


@err_page.route('/500.html')
async def err_page():
    """ Err page. """
    return await render_template("500.html", **getTemplateDictBase())

