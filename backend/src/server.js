import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./router.js";

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://prathna77.github.io",
];

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // Postman/curl
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ ok: true }));

// Servir les images uploadées
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", apiRouter);

// Erreurs upload (multer)
app.use((err, req, res, next) => {
    if (err?.message === "Invalid file type") {
        return res.status(400).json({ error: "Invalid file type. Use png/jpg/webp." });
    }

    // multer file size
    if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large (max 5MB)." });
    }

    // multer other errors
    if (err?.name === "MulterError") {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }

    next(err);
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
