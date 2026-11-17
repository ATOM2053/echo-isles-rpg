require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const authRoutes = require("./routes/auth");
const characterRoutes = require("./routes/characters");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

// เก็บผู้เล่นที่ออนไลน์
const players = new Map();

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "online",
        game: "ECHO ISLES RPG",
        players: players.size
    });
});

// Multiplayer Events
io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    // ผู้เล่นเข้าร่วมโลก
    socket.on("player:join", (data = {}) => {

        const player = {
            id: socket.id,
            name: String(data.name || "Adventurer").slice(0, 20),
            x: 400,
            y: 400,
            level: 1
        };

        players.set(socket.id, player);

        socket.emit("player:joined", player);

        io.emit(
            "world:players",
            Array.from(players.values())
        );
    });

    // เคลื่อนที่
    socket.on("player:move", (data = {}) => {

        const player = players.get(socket.id);

        if (!player) return;

        const x = Number(data.x);
        const y = Number(data.y);

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return;
        }

        player.x = Math.max(0, Math.min(x, 10000));
        player.y = Math.max(0, Math.min(y, 10000));

        socket.broadcast.emit("player:move", player);
    });

    // แชต
    socket.on("chat:send", (data = {}) => {

        const player = players.get(socket.id);

        if (!player) return;

        const message = String(data.message || "").trim();

        if (!message || message.length > 200) {
            return;
        }

        io.emit("chat:message", {
            playerId: socket.id,
            name: player.name,
            message,
            time: Date.now()
        });
    });

    // ผู้เล่นออกจากเกม
    socket.on("disconnect", () => {

        players.delete(socket.id);

        console.log("Player disconnected:", socket.id);

        io.emit("player:left", socket.id);

        io.emit(
            "world:players",
            Array.from(players.values())
        );
    });
});

// เริ่มเซิร์ฟเวอร์
server.listen(PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log(" ECHO ISLES RPG SERVER ONLINE ");
    console.log(` Port: ${PORT}`);
    console.log("--------------------------------");
});
