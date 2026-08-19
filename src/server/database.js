import Database from "better-sqlite3";

const db = new Database("data/attendance.db");

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subteam TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attendance (
        primary_key INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        date TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT absent,
        synced INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY (student_id) REFERENCES students(id)
    );
`);

export function markAttendance(studentId, status = "present") {
    const statement = db.prepare(`
        INSERT INTO attendance
            (student_id, date, timestamp, status)
        VALUES
            (?, date('now'), datetime('now'), ?)
    `);

    statement.run(studentId, status);
}

export function createStudent(studentId, name, subteam) {
    const statement = db.prepare(`
        INSERT INTO students
            (id, name, subteam)
        VALUES
            (?, ?, ?)   
    `);

    statement.run(studentId, name, subteam);
}

export default db;