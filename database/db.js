require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// คำสั่ง SQL
async function query(text, params = []) {
    return pool.query(text, params);
}

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
async function checkDatabase() {
    try {
        const result = await pool.query(
            "SELECT NOW() AS current_time"
        );

        console.log(
            "PostgreSQL connected:",
            result.rows[0].current_time
        );

        return true;

    } catch (error) {
        console.error(
            "Database connection failed:",
            error.message
        );

        return false;
    }
}

// ปิดการเชื่อมต่อ
async function closeDatabase() {
    await pool.end();
}

module.exports = {
    pool,
    query,
    checkDatabase,
    closeDatabase
};
