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
