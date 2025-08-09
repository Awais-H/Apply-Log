import { DatabaseSync } from 'node:sqlite'
const db = new DatabaseSync(':memory:')

//Execute SQL statements from strings 
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
`)

db.exec(`
    CREATE TABLE applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER,
        position TEXT,
        employment TEXT CHECK(employment IN('full-time','part-time','intern')),
        company TEXT,
        salary INTEGER,
        location TEXT,
        status TEXT CHECK(status IN('applied','interview','offer','rejected')),
        date TEXT, --YYYY-MM-DD
        FOREIGN KEY(userID) REFERENCES users(id)
    )
`)

export default db