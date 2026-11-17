class GuildSystem {
    constructor() {
        this.guilds = {};
        this.playerGuild = null;

        this.ranks = [
            "F", "E", "D", "C", "B",
            "A", "S", "SS", "SSS"
        ];

        this.memberRoles = [
            "Member",
            "Veteran",
            "Officer",
            "Vice Leader",
            "Guild Leader"
        ];
    }

    createGuild(name, playerId, playerName) {
        if (!name || !playerId) {
            return {
                success: false,
                message: "ข้อมูลกิลด์ไม่ครบ"
            };
        }

        if (this.playerGuild) {
            return {
                success: false,
                message: "คุณอยู่ในกิลด์แล้ว"
            };
        }

        if (Object.values(this.guilds).some(
            guild => guild.name.toLowerCase() === name.toLowerCase()
        )) {
            return {
                success: false,
                message: "ชื่อกิลด์นี้ถูกใช้แล้ว"
            };
        }

        const guildId = "guild_" + Date.now();

        this.guilds[guildId] = {
            id: guildId,
            name,
            leaderId: playerId,
            leaderName: playerName,
            rank: "F",
            level: 1,
            exp: 0,
            nextExp: 1000,
            gold: 0,
            members: [
                {
                    id: playerId,
                    name: playerName,
                    role: "Guild Leader",
                    joinedAt: Date.now()
                }
            ],
            applications: [],
            createdAt: Date.now()
        };

        this.playerGuild = guildId;

        return {
            success: true,
            message: "สร้างกิลด์สำเร็จ!",
            guild: this.guilds[guildId]
        };
    }

    applyToGuild(guildId, playerId, playerName) {
        const guild = this.guilds[guildId];

        if (!guild) {
            return {
                success: false,
                message: "ไม่พบกิลด์"
            };
        }

        if (this.playerGuild) {
            return {
                success: false,
                message: "คุณอยู่ในกิลด์แล้ว"
            };
        }

        const exists = guild.applications.some(
            app => app.id === playerId
        );

        if (exists) {
            return {
                success: false,
                message: "คุณสมัครกิลด์นี้แล้ว"
            };
        }

        guild.applications.push({
            id: playerId,
            name: playerName,
            appliedAt: Date.now()
        });

        return {
            success: true,
            message: "ส่งใบสมัครแล้ว"
        };
    }

    approveApplication(guildId, leaderId, applicantId) {
        const guild = this.guilds[guildId];

        if (!guild || guild.leaderId !== leaderId) {
            return false;
        }

        const index = guild.applications.findIndex(
            app => app.id === applicantId
        );

        if (index === -1) return false;

        const application = guild.applications[index];

        guild.members.push({
            id: application.id,
            name: application.name,
            role: "Member",
            joinedAt: Date.now()
        });

        guild.applications.splice(index, 1);

        return true;
    }

    leaveGuild(guildId, playerId) {
        const guild = this.guilds[guildId];

        if (!guild) return false;
        if (guild.leaderId === playerId) return false;

        guild.members = guild.members.filter(
            member => member.id !== playerId
        );

        this.playerGuild = null;

        return true;
    }

    changeRole(guildId, leaderId, memberId, newRole) {
        const guild = this.guilds[guildId];

        if (!guild || guild.leaderId !== leaderId) {
            return false;
        }

        if (!this.memberRoles.includes(newRole)) {
            return false;
        }

        const member = guild.members.find(
            item => item.id === memberId
        );

        if (!member || member.id === guild.leaderId) {
            return false;
        }

        member.role = newRole;

        return true;
    }

    addGuildExp(guildId, amount) {
        const guild = this.guilds[guildId];

        if (!guild || amount <= 0) return false;

        guild.exp += amount;

        while (guild.exp >= guild.nextExp) {
            guild.exp -= guild.nextExp;
            guild.level++;

            guild.nextExp = Math.floor(
                guild.nextExp * 1.5
            );
        }

        return true;
    }

    depositGold(guildId, amount) {
        const guild = this.guilds[guildId];

        if (!guild || amount <= 0) return false;

        guild.gold += amount;

        return true;
    }

    getGuild(guildId) {
        return this.guilds[guildId] || null;
    }

    getAllGuilds() {
        return Object.values(this.guilds);
    }

    save() {
        localStorage.setItem(
            "echo_guilds",
            JSON.stringify({
                guilds: this.guilds,
                playerGuild: this.playerGuild
            })
        );
    }

    load() {
        try {
            const saved = localStorage.getItem("echo_guilds");

            if (!saved) return;

            const data = JSON.parse(saved);

            this.guilds = data.guilds || {};
            this.playerGuild = data.playerGuild || null;
        } catch (error) {
            console.error("Guild loading error:", error);
        }
    }
}

window.GuildSystem = GuildSystem;
