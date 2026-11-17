const express = require("express");
const jwt = require("jsonwebtoken");
const { query } = require("../database/db");

const router = express.Router();

const RACES = [
    "Human",
    "Elf",
    "Dwarf"
];

const CLASSES = [
    "Swordsman",
    "Knight",
    "Archer",
    "Mage",
    "Assassin",
    "Priest"
];

const GENDERS = [
    "Male",
    "Female"
];

// Authentication middleware
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "กรุณาเข้าสู่ระบบก่อน"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.accountId = decoded.accountId;

        next();

    } catch (error) {
        return res.status(401).json({
            error: "Token ไม่ถูกต้องหรือหมดอายุ"
        });
    }
}

// Create character
router.post("/create", authenticate, async (req, res) => {
    try {
        const {
            name,
            race,
            gender,
            class: characterClass
        } = req.body;

        if (!name || !race || !gender || !characterClass) {
            return res.status(400).json({
                error: "กรุณากรอกข้อมูลตัวละครให้ครบ"
            });
        }

        const characterName = String(name).trim();

        if (!/^[a-zA-Z0-9ก-๙_]{3,20}$/.test(characterName)) {
            return res.status(400).json({
                error: "ชื่อตัวละครต้องมี 3-20 ตัวอักษร"
            });
        }

        if (!RACES.includes(race)) {
            return res.status(400).json({
                error: "เผ่าพันธุ์ไม่ถูกต้อง"
            });
        }

        if (!GENDERS.includes(gender)) {
            return res.status(400).json({
                error: "เพศไม่ถูกต้อง"
            });
        }

        if (!CLASSES.includes(characterClass)) {
            return res.status(400).json({
                error: "อาชีพต่อสู้ไม่ถูกต้อง"
            });
        }

        const result = await query(
            `INSERT INTO characters
            (account_id, name, race, gender, class)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, race, gender, class,
            level, experience, gold`,
            [
                req.accountId,
                characterName,
                race,
                gender,
                characterClass
            ]
        );

        res.status(201).json({
            message: "สร้างตัวละครสำเร็จ",
            character: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                error: "ชื่อตัวละครนี้ถูกใช้งานแล้ว"
            });
        }

        console.error("Create character:", error.message);

        res.status(500).json({
            error: "ไม่สามารถสร้างตัวละครได้"
        });
    }
});

// Get all characters belonging to account
router.get("/", authenticate, async (req, res) => {
    try {
        const result = await query(
            `SELECT id, name, race, gender, class,
            level, experience, gold, created_at
            FROM characters
            WHERE account_id = $1
            ORDER BY created_at ASC`,
            [req.accountId]
        );

        res.json({
            characters: result.rows
        });

    } catch (error) {
        console.error("Get characters:", error.message);

        res.status(500).json({
            error: "ไม่สามารถโหลดตัวละครได้"
        });
    }
});

module.exports = router;
