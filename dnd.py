#!/usr/bin/env/python 

from quart import Quart, render_template

app = Quart(__name__)


from controllers.index import index_page
from controllers.character import character_page

app.register_blueprint(index_page)
app.register_blueprint(character_page)
