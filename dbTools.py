#!/usr/bin/python

import aiosqlite

from quart import g
from quart import current_app as app

async def connect_db():
    engine = await aiosqlite.connect(app.config['DATABASE'])
    engine.row_factory = aiosqlite.Row
    return engine


async def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = await connect_db()
    return g.sqlite_db


async def getCharacters():
    """grab everything
    """
    db = await get_db()
    cur = await db.execute(
    """SELECT *
          FROM characters
      ORDER BY id DESC""",
    )
    return await cur.fetchall()


async def getCharacter(name):
    db = await get_db()
    cur = await db.execute(
    """SELECT *
          FROM characters
      WHERE name == '{}' """.format(name),
    )
    return await cur.fetchone()


async def getAbilty(cid):
    db = await get_db()
    cur = await db.execute(
    """SELECT strength, dexterity, constitution, intelligence, wisdom, charisma
          FROM abilities
      WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchone()


async def addCharacter(name, base, abilities):
    iniative = base.get("iniative", 0)
    speed = base.get("speed", 30)
    proficiency = base.get("proficiency", 2)
    hp = base.get("hp", 10)
    ac = base.get("ac", 10)
    db = await get_db()
    await db.execute(
         """INSERT INTO characters (name, hp, ac, iniative, speed, proficiency) 
                VALUES (?, ?, ?, ?, ?, ?)""",
         [name, hp, ac, iniative, speed, proficiency],
    )
    await db.commit()

    newChar = await getCharacter(name)
    character_id = newChar["id"]
    strength = abilities.get("strength", 10)
    dexterity = abilities.get("dexterity", 10)
    constitution = abilities.get("constitution", 10)
    intelligence = abilities.get("intelligence", 10)
    wisdom = abilities.get("wisdom", 10)
    charisma = abilities.get("charisma", 10)
    await db.execute(
         """INSERT INTO abilities (character_id, strength, dexterity, constitution, 
                                   intelligence, wisdom, charisma) 
                VALUES (?, ?, ?, ?, ?, ?, ?)""",
         [character_id, strength, dexterity, constitution, intelligence, wisdom, charisma],
    )
    await db.commit()

    


async def updateCharacter(name, attr, value):
    assert len(attr) == len(value), "mis-matched update!"
    db = await get_db()
    update = "SET"
    for a, v in zip(attr, value):
        update += " {a} = {v},".format(a=a, v=v)
    update = update[:-1]  # strip the last comma
    await db.execute(
         "UPDATE characters {} WHERE name == '{}'".format(update, name),
    )
    await db.commit()