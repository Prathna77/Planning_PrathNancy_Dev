import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

// ✅ Render/Railway: MYSQL_URL
// ✅ Local: DB_HOST, DB_USER, ...
export const pool = process.env.MYSQL_URL
    ? mysql.createPool(process.env.MYSQL_URL)
    : mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT || 3306),
        waitForConnections: true,
        connectionLimit: 10,
    });

// (Optionnel) log utile pour vérifier en prod
if (isProd) {
    pool.getConnection()
        .then((conn) => {
            console.log("✅ MySQL connected (prod)");
            console.log("📦 Database:", conn.config.database);
            conn.release();
        })
        .catch((err) => {
            console.error("❌ MySQL connection failed:", err.message);
        });
}
