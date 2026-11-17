const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../database/db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "กรุณากรอกข้อมูลให้ครบ"
            });
        }

        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({
                error: "ชื่อผู้ใช้ต้องมี 3-30 ตัวอักษร"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await query(
            `INSERT INTO accounts
            (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email`,
            [normalizedUsername, normalizedEmail, passwordHash]
        );

        res.status(201).json({
            message: "สมัครสมาชิกสำเร็จ",
            account: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                error: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว"
            });
        }

        console.error("Register error:", error.message);

        res.status(500).json({
            error: "เกิดข้อผิดพลาดในระบบ"
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "กรุณากรอกอีเมลและรหัสผ่าน"
            });
        }

        const result = await query(
            `SELECT id, username, email, password_hash
            FROM accounts
            WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            });
        }

        const account = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            account.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
            });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                error: "ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า"
            });
        }

        const token = jwt.sign(
            { accountId: account.id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "เข้าสู่ระบบสำเร็จ",
            token,
            account: {
                id: account.id,
                username: account.username,
                email: account.email
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            error: "เกิดข้อผิดพลาดในระบบ"
        });
    }
});

module.exports = router;
