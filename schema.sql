DROP TABLE IF EXISTS characters;
CREATE TABLE characters (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   hp INT NOT NULL,
   ac INT NOT NULL,
   iniative INT NOT NULL,
   speed INT NOT NULL,
   proficiency INT NOT NULL
);

DROP TABLE IF EXISTS abilities;
CREATE TABLE abilities (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   strength INT NOT NULL,
   dexterity INT NOT NULL,
   constitution INT NOT NULL,
   intelligence INT NOT NULL,
   wisdom INT NOT NULL,
   charisma INT NOT NULL
);

DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   animal_handling INT NOT NULL,
   arcana INT NOT NULL,
   athletics INT NOT NULL,
   deception INT NOT NULL,
   history INT NOT NULL,
   insight INT NOT NULL,
   intimidation INT NOT NULL,
   investigation INT NOT NULL,
   medicine INT NOT NULL,
   nature INT NOT NULL,
   perception INT NOT NULL,
   performance INT NOT NULL,
   sleight_of_hand INT NOT NULL,
   stealth INT NOT NULL,
   survival INT NOT NULL
);

DROP TABLE IF EXISTS purse;
CREATE TABLE purse (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   cp INT NOT NULL,
   sp INT NOT NULL,
   ep INT NOT NULL,
   gp INT NOT NULL,
   pp INT NOT NULL
);


DROP TABLE IF EXISTS notes;
CREATE TABLE notes (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   title TEXT NOT NULL,
   body TEXT NOT NULL
);

DROP TABLE IF EXISTS items;
CREATE TABLE items (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   item TEXT NOT NULL,
   weight REAL NOT NULL,
   description TEXT,
   weapon BOOLEAN NOT NULL,
   damage TEXT,
   count INT NOT NULL
);

