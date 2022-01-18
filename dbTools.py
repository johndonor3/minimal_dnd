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
              FROM character
          ORDER BY id DESC""",
    )
    return await cur.fetchall()


async def getCharacter(name):
    db = await get_db()
    cur = await db.execute(
        """SELECT *
              FROM character
          WHERE name == '{}' """.format(name),
    )
    return await cur.fetchone()


async def getAbilty(cid):
    db = await get_db()
    cur = await db.execute(
        """SELECT name, score, proficient
              FROM ability
          WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchall()


async def getSkills(cid):
    db = await get_db()
    cur = await db.execute(
        """SELECT name, score, proficient
              FROM skill
          WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchall()


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
              FROM note
          WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchall()


async def getItems(cid):
    db = await get_db()
    cur = await db.execute(
        """SELECT *
              FROM item
          WHERE character_id == '{}' """.format(cid),
    )
    return await cur.fetchall()


async def getEncounters():
    db = await get_db()
    cur = await db.execute(
        """SELECT *
              FROM encounter
          ORDER BY id DESC""",
    )
    return await cur.fetchall()


async def getEncounter(name):
    db = await get_db()
    cur = await db.execute(
        """SELECT *
              FROM encounter
          WHERE title == '{}' """.format(name),
        )
    return await cur.fetchone()


async def getEncMonsters(eid):
    db = await get_db()
    cur = await db.execute(
        """SELECT *
              FROM encounter_monster
          WHERE encounter_id == '{}' """.format(eid),
    )
    return await cur.fetchall()


async def getEncChars(eid):
    db = await get_db()
    cur = await db.execute(
        """SELECT c.id, c.name, c.hp, c.img, l.x, l.y
              FROM character AS c
              JOIN location AS l ON c.id = l.character_id
          WHERE l.encounter_id == '{}' """.format(eid),
    )
    return await cur.fetchall()


async def addCharacter(name="moron", base={}, abilities={}, skills={},
                       purse={}, proficient=[]):
    loaded = await getCharacters()
    names = [l["name"] for l in loaded]
    db = await get_db()
    if name in names:
        await db.execute("DELETE FROM character WHERE name == '{}'".format(name))
    iniative = base.get("iniative", 0)
    speed = base.get("speed", 30)
    proficiency = base.get("proficiency", 2)
    hp = base.get("hp", 10)
    ac = base.get("ac", 10)

    await db.execute(
         """INSERT INTO character (name, hp, max_hp, ac, iniative, speed, proficiency)
                VALUES (?, ?, ?, ?, ?, ?, ?)""",
         [name, hp, hp, ac, iniative, speed, proficiency],
    )
    await db.commit()

    newChar = await getCharacter(name)
    character_id = newChar["id"]

    for n, s in abilities.items():
        p = False
        if n in proficient:
            p = True
        await db.execute(
             """INSERT INTO ability (character_id, name, score, proficient)
                    VALUES (?, ?, ?, ?)""",
             [character_id, n, s, p],
        )
        await db.commit()

    for n, s in skills.items():
        p = False
        if n in proficient:
            p = True
        await db.execute(
             """INSERT INTO skill (character_id, name, score, proficient)
                    VALUES (?, ?, ?, ?)""",
             [character_id, n, s, p],
        )
        await db.commit()

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


async def updateCharacter(cid, attr, value):
    assert len(attr) == len(value), "mis-matched update!"
    db = await get_db()
    update = "SET"
    for a, v in zip(attr, value):
        update += " {a} = {v},".format(a=a, v=v)
    update = update[:-1]  # strip the last comma
    await db.execute(
         "UPDATE character {} WHERE id == '{}'".format(update, cid),
    )
    await db.commit()


async def updatePurse(cid, nom, val):
    db = await get_db()
    update = "SET {n} = {v}".format(n=nom, v=val)
    await db.execute(
         "UPDATE purse {} WHERE character_id == '{}'".format(update, cid),
    )
    await db.commit()


async def addNote(cid, title, body):
    db = await get_db()

    await db.execute(
         """INSERT INTO note (character_id, title, body)
                VALUES (?, ?, ?)""",
         [cid, title, body],
    )
    await db.commit()


async def addItem(cid, name, weight, description, weapon=False,
                  damage=None, count=1):
    db = await get_db()

    cur = await db.execute(
        """SELECT count
              FROM item WHERE name == '{}' """.format(name),
        )
    dbCount = await cur.fetchone()

    if dbCount is not None:
        dbCount = int(dbCount[0])
        count = count + dbCount
        await db.execute(
            f"UPDATE item SET count = {count} WHERE name == '{name}'"
        )
    else:
        await db.execute(
             """INSERT INTO item (character_id, name, weight, description,
                                   weapon, damage, count)
                    VALUES (?, ?, ?, ?, ?, ?, ?)""",
             [cid, name, weight, description, weapon, damage, count],
        )
    await db.commit()


async def addEncounter(title, mapName):
    db = await get_db()

    await db.execute(
         """INSERT INTO encounter (title, useMap)
                VALUES (?, ?)""",
         [title, mapName],
    )
    await db.commit()

    characters = await getCharacters()
    encounter = await getEncounter(title)
    eid = encounter["id"]
    x = 0
    for c in characters:
        await db.execute(
            """INSERT INTO location (encounter_id, character_id, x, y)
                  VALUES (?, ?, ?, ?)""",
            [eid, c["id"], x, 0]
        )
        await db.commit()
        x += 20


async def updateEncounterMap(eid, mapName):
    db = await get_db()

    await db.execute(
         "UPDATE encounter SET useMap = '{v}' WHERE id == '{i}'".format(v=mapName, i=eid),
    )
    await db.commit()


async def addMonsterToEncounter(eid, name, hp, size, local):
    db = await get_db()

    await db.execute(
         """INSERT INTO encounter_monster (encounter_id, name, hp, size, x, y, useLocal)
                VALUES (?, ?, ?, ?, ?, ?, ?)""",
         [eid, name, hp, size, 50, 50, local],
    )
    await db.commit()


async def updateMonster(mid, attr, val):
    if not type(val) == list:
        attr = [attr]
        val = [val]
    assert len(attr) == len(val), "mis-matched update!"
    db = await get_db()
    update = "SET"
    for a, v in zip(attr, val):
        update += " {a} = {v},".format(a=a, v=v)
    update = update[:-1]  # strip the last comma
    await db.execute(
         f"UPDATE encounter_monster {update} WHERE id == '{mid}'",
    )
    await db.commit()


async def updateMonsterHP(mid, val):
    await updateMonster(mid, "hp", val)


async def updateCharLoc(cid, eid, x, y):
    db = await get_db()
    await db.execute(
         f"""UPDATE location SET x = {x}, y = {y}
             WHERE encounter_id == '{eid}' AND character_id == '{cid}'""",
    )
    await db.commit()


async def deleteCharacterByID(cid):
    db = await get_db()
    await db.execute("DELETE FROM character WHERE id == '{}'".format(cid))
    await db.commit()


async def deleteCharacterByName(name):
    db = await get_db()
    await db.execute("DELETE FROM character WHERE name == '{}'".format(name))
    await db.commit()


async def changeItemCnt(cid, item, count):
    db = await get_db()
    if count < 1:
        await db.execute(
            f"DELETE FROM item WHERE name == '{item}' and character_id == '{cid}'"
            )
    else:
        await db.execute(
         f"""UPDATE item SET count = {count}
             WHERE name == '{item}' and character_id == '{cid}'""",
        )
    await db.commit()


async def deleteMonster(mid):
    db = await get_db()
    await db.execute("DELETE FROM encounter_monster WHERE id == '{}'".format(mid))
    await db.commit()


async def deleteEncounter(eid):
    db = await get_db()
    await db.execute("DELETE FROM encounter WHERE id == '{}'".format(eid))
    await db.execute("DELETE FROM encounter_monster WHERE encounter_id == '{}'".format(eid))
    await db.commit()


async def addTerrain(eid, x, y, width, height):
    db = await get_db()

    await db.execute(
         """INSERT INTO terrain (encounter_id, x, y, width, height)
                VALUES (?, ?, ?, ?, ?)""",
         [eid, x, y, width, height],
    )
    await db.commit()


async def updateTerrain(tid, eid, x, y):
    db = await get_db()
    if x < 0 or y < 0:
        await db.execute(f"DELETE FROM terrain WHERE id == '{tid}'")
    else:
        await db.execute(
         f"UPDATE terrain SET x = {x}, y = {y} WHERE id == '{tid}'",
        )
    await db.commit()


async def encTerrain(eid):
    db = await get_db()
    cur = await db.execute(
        f"SELECT id, x, y, width, height FROM terrain WHERE encounter_id == '{eid}' "
    )
    return await cur.fetchall()
