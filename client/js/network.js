// ======================================
// ECHO ISLES RPG
// MULTIPLAYER NETWORK SYSTEM
// ======================================

class EchoNetwork {

    constructor() {
        this.socket = null;
        this.connected = false;
        this.players = new Map();

        this.serverURL = "";
    }

    // เชื่อมต่อเซิร์ฟเวอร์
    connect(serverURL) {

        if (typeof io === "undefined") {
            console.error(
                "Socket.IO client has not been loaded!"
            );
            return false;
        }

        if (this.socket) {
            this.disconnect();
        }

        this.serverURL = serverURL;

        this.socket = io(serverURL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000
        });

        this.socket.on("connect", () => {
            this.connected = true;

            console.log(
                "Connected to ECHO ISLES server!"
            );
        });

        this.socket.on("disconnect", () => {
            this.connected = false;

            console.log(
                "Disconnected from server!"
            );
        });

        this.socket.on("player:joined", (player) => {
            this.players.set(player.id, player);
        });

        this.socket.on("player:left", (playerId) => {
            this.players.delete(playerId);
        });

        this.socket.on("world:players", (players) => {
            this.players.clear();

            players.forEach(player => {
                this.players.set(player.id, player);
            });
        });

        this.socket.on("connect_error", (error) => {
            console.error(
                "Connection error:",
                error.message
            );
        });

        return true;
    }

    // ส่งตำแหน่งผู้เล่น
    sendMovement(x, y, direction) {

        if (!this.connected) return;

        this.socket.emit("player:move", {
            x,
            y,
            direction
        });
    }

    // ส่งข้อความแชต
    sendChat(message) {

        if (!this.connected) return;

        if (!message || !message.trim()) return;

        this.socket.emit("chat:message", {
            message: message.trim()
        });
    }

    // รับข้อมูลผู้เล่น
    getPlayers() {
        return Array.from(this.players.values());
    }

    // ตรวจสอบสถานะ
    isConnected() {
        return this.connected;
    }

    // ตัดการเชื่อมต่อ
    disconnect() {

        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        this.connected = false;
        this.players.clear();
    }
}

// สร้างระบบออนไลน์
window.echoNetwork = new EchoNetwork();

console.log("ECHO Network System Loaded!");
