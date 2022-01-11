#!/usr/bin/env/python

from quart import Blueprint, request, jsonify

from dbTools import updateCharLoc, updateMonster, updateCharacter

dbEndPoints = Blueprint("dbEndPoints", __name__)


@dbEndPoints.route('/db/locUpdate/', methods=["POST"])
async def locUpdate():
    """ send updates for location changes """

    form = await request.form
    if "eid" in form:
        await updateCharLoc(form["id"], form["eid"], form["x"], form["y"])
    else:
        await updateMonster(form["id"], ["x", "y"], [form["x"], form["y"]])

    return jsonify([])


@dbEndPoints.route('/db/charUpdate/', methods=["POST"])
async def charUpdate():
    """ send updates for location changes """

    form = await request.form
    await updateCharacter(form["id"], [form["attr"]], [form["val"]])

    return jsonify([])


@dbEndPoints.route('/db/monUpdate/', methods=["POST"])
async def monUpdate():
    """ send updates for location changes """

    form = await request.form
    await updateMonster(form["id"], [form["attr"]], [form["val"]])

    return jsonify([])
