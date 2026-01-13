import { pool } from "../config/db.js";

export const BackgroundModel = {
    async list() {
        const [rows] = await pool.query(
            "SELECT id, filename, original_name, url, created_at FROM background_images ORDER BY created_at DESC"
        );
        return rows;
    },

    async create({ filename, original_name, url }) {
        const [result] = await pool.query(
            "INSERT INTO background_images (filename, original_name, url) VALUES (?, ?, ?)",
            [filename, original_name, url]
        );
        return { id: result.insertId, filename, original_name, url };
    },

    async findById(id) {
        const [rows] = await pool.query(
            "SELECT id, filename, original_name, url FROM background_images WHERE id=? LIMIT 1",
            [id]
        );
        return rows[0] || null;
    },

    async deleteById(id) {
        await pool.query("DELETE FROM background_images WHERE id=?", [id]);
        return true;
    }
};
