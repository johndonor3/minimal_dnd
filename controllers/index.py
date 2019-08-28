#!/usr/bin/python

from quart import render_template, Blueprint

from . import getTemplateDictBase


index_page = Blueprint("index_page", __name__)

@index_page.route('/', methods=['GET'])
async def index():
    """ Index page. """
    return await render_template("index.html", **getTemplateDictBase())

# This will provide the favicon for the whole site. Can be overridden for
# a single page with something like this on the page:
#    <link rel="shortcut icon" href="static/images/favicon.ico">
#
#@app.route('/favicon.ico')
#def favicon():
#    return send_from_directory(directory=os.path.join(app.root_path, 'static', 'images'),
#                               filename='favicon.ico')#, mimetype='image/vnd.microsoft.icon')
