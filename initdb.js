import sql from 'better-sqlite3';
const usersdb = sql('users.db');
const contentdb = sql('content.db');

usersdb.prepare(`
   CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      pronouns TEXT,
      headline TEXT,
      bio TEXT,
      theatre TEXT,
      secondaryTheatre TEXT,
      gender TEXT,
      orientation TEXT,
      ethnicity TEXT,
      website TEXT,
      experience TEXT,
      image TEXT,
      teams: TEXT,
   )
`).run();

contentdb.prepare(`
   CREATE TABLE IF NOT EXISTS shows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      creator_id: INTEGER NOT NULL,
      theator_id: INTEGER,
      audition_id: INTEGER,
      title TEXT NOT NULL,
      date DATE,
      time TIME,
      description TEXT,
      theatre TEXT,
      zipcode TEXT,
      price DECIMAL,
      door_price DECIMAL,
      ticketsUrl TEXT,
      image TEXT,
   )
`).run();
