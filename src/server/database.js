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
        sign_in TEXT,
        sign_out TEXT,
        status TEXT NOT NULL DEFAULT absent,
        synced INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY (student_id) REFERENCES students(id)
        UNIQUE(student_id, date)
    );


`);

export function initializeAttendance() {
    const statement = db.prepare(`
        INSERT INTO attendance (student_id, date, sign_in, sign_out, status)
        SELECT id, date('now'), NULL, NULL, 'absent'
        FROM students
        WHERE NOT EXISTS (
            SELECT 1
            FROM attendance
            WHERE attendance.student_id = students.id
            AND attendance.date = date('now')
        )
    `);

    statement.run();
}

export function signIn(studentId, status = "present") {
    const student = getStudent(studentId);

    if (!student.studentExists) {
        throw new Error("Couldn't find student in database");
    }

    const statement = db.prepare(`
        UPDATE attendance
        SET status = ?,
            sign_in = time('now', 'localtime')
        WHERE student_id = ?
    `);

    statement.run(status, studentId);
}

export function signOut(studentId, date) {
    const student = getStudent(studentId);

    if (!student.studentExists) {
        throw new Error("Couldn't find student in database");
    }

    const record = getAttendance(studentId, date);

    if (!record.sign_in) {
        throw new Error("User must sign out before they Sign In!")
    }

    const statement = db.prepare(`
        UPDATE attendance
        SET sign_out = time('now', 'localtime')
        WHERE student_id = ?
    `);

    statement.run(studentId);
}

export function createStudent(studentId, name, subteam, status = "present") {
    const statement = db.prepare(`
        INSERT INTO students
            (id, name, subteam)
        VALUES
            (?, ?, ?)   
    `);

    statement.run(studentId, name, subteam);

    const statement2 = db.prepare(`
        INSERT INTO attendance
            (student_id, date, sign_in, status)
        VALUES
            (?, date('now'), datetime('now'), ?)
    `)

    statement2.run(studentId, status)
}

export function getStudent(studentId) {
    const statement = db.prepare(`
        SELECT name, subteam
        FROM students
        WHERE id = ?
    `);

    const student = statement.get(studentId);

    if (student) {
        return {
            studentExists: true,
            name: student.name,
            subteam: student.subteam
        };
    }

    return {
        studentExists: false
    };
}

export function isPresent(studentId, date) {
    const statement = db.prepare(`
        SELECT 1
        FROM attendance
        WHERE student_id = ? AND date = ? AND status IS 'present'
        `)

    const result = statement.get(studentId, date);
    return result !== undefined;
}

export function getAttendance(studentId, date) {
    const statement = db.prepare(`
        SELECT *
        FROM attendance
        WHERE student_id = ? AND date = ?
        `)

    const result = statement.get(studentId, date);

    return {
        sign_in: result.sign_in,
        sign_out: result.sign_out,
        status: result.status
    };
}

export default db;