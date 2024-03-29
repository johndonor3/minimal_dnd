#!/usr/bin/env/python

import os

from pathlib import Path
from sqlite3 import dbapi2 as sqlite3
from logging import getLogger, ERROR

from quart import Quart, render_template, send_from_directory

app = Quart(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

getLogger('quart.serving').setLevel(ERROR)

UPLOAD_FOLDER = os.path.expanduser("~") + "/.cache/minimalDnD"

app.config.update({
    "UPLOAD_FOLDER": UPLOAD_FOLDER
    })

app.config.update({
   'DATABASE': app.root_path / 'char.db',
 })


def connect_db():
    engine = sqlite3.connect(app.config['DATABASE'])
    engine.row_factory = sqlite3.Row
    return engine


@app.cli.command('init_db')
def init_db():
    """Create an empty database."""
    db = connect_db()
    with open(Path(__file__).parent / 'schema.sql', mode='r') as file_:
        db.cursor().executescript(file_.read())
    db.commit()


from controllers.index import index_page
from controllers.character import character_page
from controllers.monster import monster_page
from controllers.encounter import encounter_page
from controllers.encounter_top import encounters_page
from controllers.combat import combat_page
from controllers.combatEnc import combatEnc_page
from controllers.local import localSource
from controllers.dbEndPoints import dbEndPoints

app.register_blueprint(index_page)
app.register_blueprint(character_page)
app.register_blueprint(monster_page)
app.register_blueprint(encounter_page)
app.register_blueprint(encounters_page)
app.register_blueprint(combat_page)
app.register_blueprint(combatEnc_page)
app.register_blueprint(localSource)
app.register_blueprint(dbEndPoints)
