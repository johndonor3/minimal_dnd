#!/usr/bin/env/python

from quart import Blueprint, send_from_directory, current_app

localSource = Blueprint("localSource", __name__)


@localSource.route('/uploads/<filename>', methods=["GET", "POST"])
async def local(filename):
    """ manage access to cached content """

    UPLOAD_FOLDER = current_app.config["UPLOAD_FOLDER"]
    return await send_from_directory(UPLOAD_FOLDER, filename)
