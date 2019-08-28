#!/usr/bin/env/python 

from quart import render_template, Blueprint

from . import getTemplateDictBase
from rules.creature import creature


character_page = Blueprint("character", __name__)

@character_page.route('/character.html')
async def character():
    """ character detail """
    test_char = creature(name="AEGON THE CONQUERERER", race="human")
    print(test_char.name)
    template_dict = getTemplateDictBase()
    template_dict.update({"test_char": test_char.toDict(),
                          "char_obj": test_char})
    return await render_template("character.html", **template_dict)
