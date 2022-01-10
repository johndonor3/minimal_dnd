PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS character;
CREATE TABLE character (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   hp INT NOT NULL,
   ac INT NOT NULL,
   iniative INT NOT NULL,
   speed INT NOT NULL,
   proficiency INT NOT NULL,
   img TEXT
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
   charisma INT NOT NULL,
   FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   acrobatics INT NOT NULL,
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
   persuasion INT NOT NULL,
   religion INT NOT NULL,
   sleight_of_hand INT NOT NULL,
   stealth INT NOT NULL,
   survival INT NOT NULL,
   FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS purse;
CREATE TABLE purse (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   cp INT NOT NULL,
   sp INT NOT NULL,
   ep INT NOT NULL,
   gp INT NOT NULL,
   pp INT NOT NULL,
   FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS note;
CREATE TABLE note (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   title TEXT NOT NULL,
   body TEXT NOT NULL,
   FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS item;
CREATE TABLE item (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   name TEXT NOT NULL,
   weight REAL NOT NULL,
   description TEXT,
   weapon BOOLEAN NOT NULL,
   damage TEXT,
   count INT NOT NULL,
   FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS encounter;
CREATE TABLE encounter (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   title TEXT NOT NULL,
   useMap TEXT NOT NULL
);

DROP TABLE IF EXISTS encounter_monster;
CREATE TABLE encounter_monster (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   encounter_id INT NOT NULL,
   name TEXT NOT NULL,
   size INT NOT NULL,
   hp INT NOT NULL,
   x INT NOT NULL,
   y INT NOT NULL,
   useLocal BOOLEAN Not NULL,
   FOREIGN KEY(encounter_id) REFERENCES encounter(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS location;
CREATE TABLE location (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   encounter_id INT NOT NULL,
   character_id INT NOT NULL,
   x INT NOT NULL,
   y INT NOT NULL,
   FOREIGN KEY(encounter_id) REFERENCES encounter(id) ON DELETE CASCADE,
   FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE
);
