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
        image TEXT
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
        id TEXT PRIMARY KEY,
        creatorId TEXT NOT NULL,
        admins TEXT NOT NULL,
        title TEXT NOT NULL,
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
        notes TEXT
    )
`).run();

contentDb.prepare(`
    CREATE TABLE IF NOT EXISTS showings (
        eventId TEXT NOT NULL,
        dateTime TEXT NOT NULL,
        lookingForTeams INTEGER,
        lookingForPlayers INTEGER,
        lookingForDirectors INTEGER,
        lookingForMusician INTEGER,
        lookingForTech INTEGER,
        FOREIGN KEY (eventId) REFERENCES shows(id)
    )
`).run();

contentDb.prepare(`
    CREATE TABLE IF NOT EXISTS showing_cast (
        name TEXT NOT NULL,
        id TEXT,
        role TEXT NOT NULL,
        showId TEXT NOT NULL,
        dateTime TEXT NOT NULL
    )
`).run();

contentDb.prepare(`
    CREATE TABLE IF NOT EXISTS teams (
        id STRING PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        photoCredit TEXT,
        city TEXT,
        state TEXT,
        theatres TEXT,
        unconfirmedPlayers TEXT,
        lookingForPlayers INTEGER,
        unconfirmedCoach TEXT,
        lookingForCoach INTEGER,
        unconfirmedMusician TEXT,
        lookingForMusician INTEGER,
        description TEXT
    )
`).run();

contentDb.prepare(`
    CREATE TABLE IF NOT EXISTS team_members (
        team TEXT NOT NULL,
        name TEXT NOT NULL,
        id TEXT,
        role TEXT NOT NULL,
        dateAdded TEXT NOT NULL,
        addedBy TEXT NOT NULL,
        confirmed INTEGER,
        FOREIGN KEY (team) REFERENCES teams(id)
    )
`).run();

usersDb.prepare(`
    CREATE TABLE IF NOT EXISTS follows (
        userId TEXT NOT NULL,
        followId TEXT NOT NULL,
        type TEXT NOT NULL,
        following INTEGER NOT NULL
    )
`).run();