import { pool } from "../config/db.js";

export const NoteModel = {
    async findByYear(year) {
        const [rows] = await pool.query(
            "SELECT note_date, content FROM notes WHERE YEAR(note_date)=? ORDER BY note_date ASC",
            [year]
        );

        const map = {};
        for (const r of rows) {
            const iso = r.note_date.toISOString().slice(0, 10);
            map[iso] = r.content;
        }
        return map;
    },

    async findByDate(date) {
        const [rows] = await pool.query(
            "SELECT note_date, content FROM notes WHERE note_date=? LIMIT 1",
            [date]
        );
        if (rows.length === 0) return null;

        return {
            date: rows[0].note_date.toISOString().slice(0, 10),
            content: rows[0].content
        };
    },

    async upsert(date, content) {
        await pool.query(
            `INSERT INTO notes (note_date, content)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content=VALUES(content)`,
            [date, content]
        );
        return true;
    },

    async deleteByDate(date) {
        await pool.query("DELETE FROM notes WHERE note_date=?", [date]);
        return true;
    }
};
