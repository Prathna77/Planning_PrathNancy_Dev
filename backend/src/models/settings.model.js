import { pool } from "../config/db.js";

export const SettingsModel = {
    async get() {
        const [rows] = await pool.query("SELECT * FROM settings WHERE id=1 LIMIT 1");
        return rows[0] || null;
    },

    async update({ weekA_color, weekB_color, background_type, background_value }) {
        await pool.query(
            `UPDATE settings
       SET weekA_color=?, weekB_color=?, background_type=?, background_value=?
       WHERE id=1`,
            [weekA_color, weekB_color, background_type, background_value]
        );
        return this.get();
    }
};
