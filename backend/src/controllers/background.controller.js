import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BackgroundModel } from "../models/background.model.js";
import { SettingsModel } from "../models/settings.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../uploads/backgrounds");

function ensureUploadDir() {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const DEFAULT_BG = "linear-gradient(135deg, #0f172a, #111827)";

export const BackgroundController = {
    async list(req, res) {
        try {
            const images = await BackgroundModel.list();
            res.json(images);
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    },

    async upload(req, res) {
        try {
            if (!req.file) return res.status(400).json({ error: "No file uploaded" });

            const filename = req.file.filename;
            const original_name = req.file.originalname;
            const url = `/uploads/backgrounds/${filename}`;

            const created = await BackgroundModel.create({ filename, original_name, url });
            res.status(201).json(created);
        } catch (e) {
            res.status(500).json({ error: "Server error" });
        }
    },

    async remove(req, res) {
        try {
            ensureUploadDir();

            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const img = await BackgroundModel.findById(id);
            if (!img) return res.status(404).json({ error: "Not found" });

            // Si l'image est utilisée en settings, on repasse en gradient par défaut
            const current = await SettingsModel.get();
            if (current?.background_type === "image" && current?.background_value === img.url) {
                await SettingsModel.update({
                    weekA_color: current.weekA_color,
                    weekB_color: current.weekB_color,
                    background_type: "gradient",
                    background_value: DEFAULT_BG
                });
            }

            const filePath = path.join(UPLOAD_DIR, img.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            await BackgroundModel.deleteById(id);

            res.json({ ok: true });
        } catch {
            res.status(500).json({ error: "Server error" });
        }
    }
};
