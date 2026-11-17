const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

const pool = databaseUrl
    ? new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false
    })
    : null;

// Execute database query
async function query(text, params = []) {
    if (!pool) {
        throw new Error("DATABASE_URL is not configured");
    }

    return pool.query(text, params);
}

// Check database connection
async function checkDatabase() {
    if (!pool) {
        return false;
    }

    try {
        await pool.query("SELECT NOW()");
        return true;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        return false;
    }
}

module.exports = {
    pool,
    query,
    checkDatabase
};
