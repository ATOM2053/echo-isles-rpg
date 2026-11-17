require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

// Authentication API
app.use("/api/auth", authRoutes);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Connected players
const players = new Map();

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "online",
        game: "ECHO ISLES RPG",
        players: players.size
    });
});

// Game connection
io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    // Player joins world
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

        io.emit("world:players", Array.from(players.values()));
    });

    // Player movement
    socket.on("player:move", (data = {}) => {

        const player = players.get(socket.id);

        if (!player) return;

        const x = Number(data.x);
        const y = Number(data.y);

        if (!Number.isFinite(x) || !Number.isFinite(y)) return;

        player.x = Math.max(0, Math.min(x, 10000));
        player.y = Math.max(0, Math.min(y, 10000));

        socket.broadcast.emit("player:move", player);
    });

    // World chat
    socket.on("chat:send", (data = {}) => {

        const player = players.get(socket.id);

        if (!player) return;

        const message = String(data.message || "").trim();

        if (!message || message.length > 200) return;

        io.emit("chat:message", {
            playerId: socket.id,
            name: player.name,
            message,
            time: Date.now()
        });
    });

    // Player disconnects
    socket.on("disconnect", () => {

        players.delete(socket.id);

        console.log("Player disconnected:", socket.id);

        io.emit("player:left", socket.id);

        io.emit("world:players", Array.from(players.values()));
    });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log(" ECHO ISLES RPG SERVER ONLINE");
    console.log(" Port:", PORT);
    console.log("--------------------------------");
});
