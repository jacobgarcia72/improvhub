import sql from 'better-sqlite3';

export const usersDb = sql('users.db');
export const contentDb = sql('content.db');

usersDb.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        joinDate TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        pronouns TEXT,
        headline TEXT,
        bio TEXT,
        theatres TEXT,
        city TEXT,
        state TEXT,
        gender TEXT,
        orientation TEXT,
        ethnicity TEXT,
        website TEXT,
        experience TEXT,
        image TEXT,
        teams TEXT
    )
`).run();

usersDb.prepare(`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)`).run();

contentDb.prepare(`
    CREATE TABLE IF NOT EXISTS shows (
        id STRING PRIMARY KEY,
        creatorId TEXT NOT NULL,
        title TEXT NOT NULL,
        dateTimes TEXT,
        recurringDay TEXT,
        recurringTime TEXT,
        cadence TEXT,
        description TEXT,
        theatre TEXT,
        city TEXT,
        state TEXT,
        price NUMERIC,
        doorPrice NUMERIC,
        ticketsUrl TEXT,
        image TEXT,
        photoCredit TEXT,
        runtime TEXT,
        notes TEXT,
        teams TEXT,
        performers TEXT
    )
`).run();

contentDb.prepare(`
    CREATE TABLE IF NOT EXISTS teams (
        id STRING PRIMARY KEY,
        admins TEXT NOT NULL,
        name TEXT NOT NULL,
        image TEXT,
        photoCredit TEXT,
        city TEXT,
        state TEXT,
        theatres TEXT,
        players TEXT,
        unconfirmedPlayers TEXT,
        lookingForPlayers INTEGER,
        coach TEXT,
        unconfirmedCoach TEXT,
        lookingForCoach INTEGER,
        musician TEXT,
        unconfirmedMusician TEXT,
        lookingForMusician INTEGER,
        description TEXT
    )
`).run();