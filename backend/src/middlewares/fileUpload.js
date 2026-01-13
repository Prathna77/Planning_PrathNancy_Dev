import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier: backend/uploads/backgrounds
const UPLOAD_DIR = path.join(__dirname, "../../uploads/backgrounds");

function ensureUploadDir() {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureUploadDir();
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = [".png", ".jpg", ".jpeg", ".webp"].includes(ext) ? ext : ".png";
        cb(null, `bg_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`);
    }
});

export const uploadBackgroundImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const ok = ["image/png", "image/jpeg", "image/webp"].includes(file.mimetype);
        if (!ok) return cb(new Error("Invalid file type"));
        cb(null, true);
    }
});
