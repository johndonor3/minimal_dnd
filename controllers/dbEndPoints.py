#!/usr/bin/env/python

from quart import Blueprint, request, jsonify

from dbTools import updateCharLoc, updateMonster

locationUpdate = Blueprint("locationUpdate", __name__)


@locationUpdate.route('/locUpdate/', methods=["POST"])
async def locUpdate():
    """ send updates for location changes """

    form = await request.form
    if "eid" in form:
        await updateCharLoc(form["id"], form["eid"], form["x"], form["y"])
    else:
        await updateMonster(form["id"], ["x", "y"], [form["x"], form["y"]])

    return jsonify([])
