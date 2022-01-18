PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS character;
CREATE TABLE character (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL,
   hp INT NOT NULL,
   max_hp INT NOT NULL,
   ac INT NOT NULL,
   iniative INT NOT NULL,
   speed INT NOT NULL,
   proficiency INT NOT NULL,
   img TEXT
);

DROP TABLE IF EXISTS ability;
CREATE TABLE ability (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   name TEXT NOT NULL,
   score INT NOT NULL,
   proficient BOOLEAN NOT NULL,
   FOREIGN KEY(character_id) REFERENCES character(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS skill;
CREATE TABLE skill (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   character_id INT NOT NULL,
   name TEXT NOT NULL,
   score INT NOT NULL,
   proficient BOOLEAN NOT NULL,
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
   useMap TEXT NOT NULL,
   grid INT
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

DROP TABLE IF EXISTS terrain;
CREATE TABLE terrain (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   encounter_id INT NOT NULL,
   x INT NOT NULL,
   y INT NOT NULL,
   width INT NOT NULL,
   height INT NOT NULL,
   FOREIGN KEY(encounter_id) REFERENCES encounter(id) ON DELETE CASCADE
);
