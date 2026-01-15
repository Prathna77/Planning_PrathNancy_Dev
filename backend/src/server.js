import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "node:fs";
import { fileURLToPath } from "url";
import apiRouter from "./router.js";

dotenv.config();

const app = express();

/**
 * CORS
 */
const allowedOrigins = [
    "http://localhost:5173",
    "http://192.168.1.242:5173",
    "http://192.168.1.152:5173",
    "https://prathna77.github.io",
    // optionnel si tu veux être ultra safe (souvent inutile, l'origin est sans le path)
    "https://prathna77.github.io/Planning_PrathNancy_Dev",
];

app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin) return cb(null, true); // Postman/curl
            if (allowedOrigins.includes(origin)) return cb(null, true);
            return cb(new Error(`CORS blocked for origin: ${origin}`));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Préflight OPTIONS (utile pour PUT/DELETE et certains uploads)
app.options("*", cors());

app.use(express.json({ limit: "1mb" }));

/**
 * Healthcheck
 */
app.get("/health", (req, res) => res.json({ ok: true }));

/**
 * Uploads (persistant si tu montes un disk Render)
 * - En local: ../uploads
 * - Sur Render: mettre UPLOADS_DIR=/var/data/uploads (ou ton mount path)
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR =
    process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");

// Crée les dossiers nécessaires (important sur Render)
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(path.join(UPLOADS_DIR, "backgrounds"), { recursive: true });

// Servir les fichiers uploadés
app.use("/uploads", express.static(UPLOADS_DIR));

/**
 * API routes
 */
app.use("/api", apiRouter);

/**
 * Erreurs upload (multer)
 */
app.use((err, req, res, next) => {
    if (err?.message === "Invalid file type") {
        return res
            .status(400)
            .json({ error: "Invalid file type. Use png/jpg/webp." });
    }

    if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large (max 5MB)." });
    }

    if (err?.name === "MulterError") {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }

    next(err);
});

/**
 * Start
 */
const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Backend running on port ${port}`));
