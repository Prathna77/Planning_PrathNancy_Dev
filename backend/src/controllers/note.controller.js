import { NoteModel } from "../models/note.model.js";

function isValidYear(y) {
    return Number.isInteger(y) && y >= 1970 && y <= 3000;
}

export const NoteController = {
    async getByYear(req, res) {
        try {
            const year = Number(req.query.year);
            if (!isValidYear(year)) return res.status(400).json({ error: "Invalid year" });

            const notes = await NoteModel.findByYear(year);
            res.json(notes);
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    },

    async getByDate(req, res) {
        try {
            const date = req.params.date;
            const note = await NoteModel.findByDate(date);
            res.json({ date, content: note?.content ?? "" });
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    },

    async upsert(req, res) {
        try {
            const date = req.params.date;
            const content = String(req.body?.content ?? "").trim();

            if (content.length === 0) {
                await NoteModel.deleteByDate(date);
                return res.json({ ok: true, deleted: true });
            }

            await NoteModel.upsert(date, content);
            res.json({ ok: true });
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    },

    async delete(req, res) {
        try {
            const date = req.params.date;
            await NoteModel.deleteByDate(date);
            res.json({ ok: true });
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    }
};
