#!/usr/bin/env/python 

import asyncio

class creature(object):
    """An object to encapsulate a creature
    """

    def __init__(self, name="moron", race=None, **kwargs):
        self.name = name
        self.race = race
        self.subrace = kwargs.get("subrace", None)
        self.hp = kwargs.get("hp", 10)
        self.ac = kwargs.get("ac", 10)
        self.initiative = kwargs.get("initiative", 1)
        self.speed = kwargs.get("speed", 30)
        self.proficiency = kwargs.get("proficiency", 30)
        self.inspiration = kwargs.get("inspiration", 30)
        self.abilities = kwargs.get("abilities", {})
        self.skills = kwargs.get("skills", {})
        self.saving_throws = kwargs.get("saving_throws", {})
        self.inventory = kwargs.get("inventory", {})
        self.weapons = kwargs.get("weapons", {})
        self.purse = kwargs.get("purse", {"cp": 0,
                                          "sp": 0,
                                          "ep": 0,
                                          "gp": 15,
                                          "pp": 0,})
        # ....
        # ....

    def toDict(self):
        """return dictionary summarizing attributes
        """
        return {"name": self.name,
                "race": self.race,
                "subrace": self.subrace,
                "hp": self.hp,
                "ac": self.ac,
                "initiative": self.initiative,
                "speed": self.speed,
                "proficiency": self.proficiency,
                "inspiration": self.inspiration,
                "abilities": self.abilities,
                "skills": self.skills,
                "saving_throws": self.saving_throws,
                "inventory": self.inventory,
                "weapons": self.weapons,
                "purse": self.purse}


class dwarf(creature):
    """a dwarf 
    """

    def __init__(self, **kwargs):
        super().__init__(race="dwarf", **kwargs)

# etc
