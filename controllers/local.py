#!/usr/bin/env/python 

from quart import render_template, Blueprint, request, send_from_directory, g, current_app

import dbTools as db
from . import getTemplateDictBase


localSource = Blueprint("localSource", __name__)

@localSource.route('/uploads/<filename>', methods=["GET", "POST"])
async def local(filename):
    """ manage access to cached content """

    UPLOAD_FOLDER = current_app.config["UPLOAD_FOLDER"]
    return await send_from_directory(UPLOAD_FOLDER, filename)
