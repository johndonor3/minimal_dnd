#!/usr/bin/env/python 

from pathlib import Path
from sqlite3 import dbapi2 as sqlite3


from quart import Quart, render_template

app = Quart(__name__)

app.config.update({
   'DATABASE': app.root_path / 'char.db',
 })

def connect_db():
    engine = sqlite3.connect(app.config['DATABASE'])
    engine.row_factory = sqlite3.Row
    return engine

@app.cli.command()
def init_db():
    """Create an empty database."""
    db = connect_db()
    with open(Path(__file__).parent / 'schema.sql', mode='r') as file_:
        db.cursor().executescript(file_.read())
    db.commit()


from controllers.index import index_page
from controllers.character import character_page

app.register_blueprint(index_page)
app.register_blueprint(character_page)
