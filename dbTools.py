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


async def getSkills(cid):
    db = await get_db()
    cur = await db.execute(
    """SELECT animal_handling, arcana, athletics, deception, history,
              insight, intimidation, investigation, medicine, nature,
              perception, performance, sleight_of_hand, stealth, survival
          FROM skills
      WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchone()


async def getPurse(cid):
    db = await get_db()
    cur = await db.execute(
    """SELECT cp, sp, ep, gp, pp
          FROM purse
      WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchone()


async def getNotes(cid):
    db = await get_db()
    cur = await db.execute(
    """SELECT *
          FROM notes
      WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchall()

async def addCharacter(name="moron", base={}, abilities={}, skills={}, purse={}):
    loaded = await getCharacters()
    names = [l["name"] for l in loaded]
    db = await get_db()
    if name in names:
        await db.execute("DELETE FROM characters WHERE name == '{}'".format(name))
    iniative = base.get("iniative", 0)
    speed = base.get("speed", 30)
    proficiency = base.get("proficiency", 2)
    hp = base.get("hp", 10)
    ac = base.get("ac", 10)
    
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

    animal_handling = skills.get("animal_handling", -1)
    arcana = skills.get("arcana", -1)
    athletics = skills.get("athletics", -1)
    deception = skills.get("deception", -1)
    history = skills.get("history", -1)
    insight = skills.get("insight", -1)
    intimidation = skills.get("intimidation", -1)
    investigation = skills.get("investigation", -1)
    medicine = skills.get("medicine", -1)
    nature = skills.get("nature", -1)
    perception = skills.get("perception", -1)
    performance = skills.get("performance", -1)
    sleight_of_hand = skills.get("sleight_of_hand", -1)
    stealth = skills.get("stealth", -1)
    survival = skills.get("survival", -1)
    
    await db.execute(
         """INSERT INTO skills (character_id, animal_handling, arcana, athletics, deception, history,
                            insight, intimidation, investigation, medicine, nature,
                            perception, performance, sleight_of_hand, stealth, survival) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
         [character_id, animal_handling, arcana, athletics, deception, history,
          insight, intimidation, investigation, medicine, nature,
          perception, performance, sleight_of_hand, stealth, survival],
    )
    await db.commit()

    character_id = newChar["id"]
    cp = purse.get("cp", 0)
    sp = purse.get("sp", 0)
    ep = purse.get("ep", 0)
    gp = purse.get("gp", 0)
    pp = purse.get("pp", 0)
    cp, sp, ep, gp, pp 
    await db.execute(
         """INSERT INTO purse (character_id, cp, sp, ep, gp, pp) 
                VALUES (?, ?, ?, ?, ?, ?)""",
         [character_id, cp, sp, ep, gp, pp],
    )
    await db.commit()


async def addNote(cid, title, body):
    db = await get_db()
    
    await db.execute(
         """INSERT INTO notes (character_id, title, body) 
                VALUES (?, ?, ?)""",
         [cid, title, body],
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