#!/usr/bin/env/python

from quart import Blueprint, request, jsonify

from dbTools import (updateCharLoc, updateMonster, updateCharacter,
                     updatePurse, changeItemCnt, updateTerrain, addTerrain,
                     encTerrain)

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


@dbEndPoints.route('/db/purseUpdate/', methods=["POST"])
async def purseUpdate():
    """ send updates for location changes """
    form = await request.form
    cid = int(form["cid"])
    nom = form["nom"]
    val = int(form["val"])
    await updatePurse(cid, nom, val)

    return jsonify([])


@dbEndPoints.route('/db/itemUpdate/', methods=["POST"])
async def itemUpdate():
    """ send updates for location changes """
    form = await request.form
    cid = int(form["cid"])
    item = form["item"]
    cnt = int(form["cnt"])
    await changeItemCnt(cid, item, cnt)

    return jsonify([])


@dbEndPoints.route('/db/terrainUpdate/', methods=["POST"])
async def terrainUpdate():
    """ send updates for location changes """
    form = await request.form
    eid = int(form["eid"])
    x = int(form["x"])
    y = int(form["y"])
    print(form)
    if "tid" in form:
        tid = int(form["tid"])
        await updateTerrain(tid, eid, x, y)
    else:
        width = int(form["width"])
        height = int(form["height"])
        await addTerrain(eid, x, y, width, height)

    return jsonify([])


@dbEndPoints.route('/db/getTerrain/<int:eid>', methods=["GET"])
async def getTerrain(eid):
    """ get all terrain """
    terrain = await encTerrain(eid)

    terrain = [{k: t[k] for k in t.keys()} for t in terrain]

    return jsonify(terrain)
