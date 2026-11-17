class QuestSystem {
    constructor(inventory, professions = null) {
        this.inventory = inventory;
        this.professions = professions;

        this.quests = {
            first_hunt: {
                id: "first_hunt",
                name: "First Hunt",
                description: "กำจัด Slime จำนวน 5 ตัว",
                type: "kill",
                target: "slime",
                required: 5,
                level: 1,
                rewards: {
                    exp: 100,
                    gold: 50
                }
            },

            gather_herbs: {
                id: "gather_herbs",
                name: "Herbalist Request",
                description: "เก็บสมุนไพร 5 ชิ้น",
                type: "collect",
                target: "red_herb",
                required: 5,
                level: 1,
                rewards: {
                    exp: 80,
                    gold: 30
                }
            },

            forest_explorer: {
                id: "forest_explorer",
                name: "Forest Explorer",
                description: "สำรวจ Emerald Forest",
                type: "explore",
                target: "emerald_forest",
                required: 1,
                level: 3,
                rewards: {
                    exp: 200,
                    gold: 100
                }
            }
        };

        this.activeQuests = {};
        this.completedQuests = [];
    }

    getAllQuests() {
        return this.quests;
    }

    getQuest(id) {
        return this.quests[id] || null;
    }

    acceptQuest(id, playerLevel = 1) {
        const quest = this.getQuest(id);

        if (!quest) {
            return {
                success: false,
                message: "ไม่พบภารกิจนี้"
            };
        }

        if (playerLevel < quest.level) {
            return {
                success: false,
                message: "เลเวลของคุณยังไม่ถึงกำหนด"
            };
        }

        if (this.activeQuests[id] ||
            this.completedQuests.includes(id)) {
            return {
                success: false,
                message: "คุณรับหรือทำภารกิจนี้ไปแล้ว"
            };
        }

        this.activeQuests[id] = {
            id,
            progress: 0,
            completed: false
        };

        return {
            success: true,
            message: `รับภารกิจ ${quest.name} แล้ว`
        };
    }

    updateProgress(type, target, amount = 1) {
        const updated = [];

        for (const id in this.activeQuests) {
            const quest = this.quests[id];
            const progress = this.activeQuests[id];

            if (
                quest.type !== type ||
                quest.target !== target ||
                progress.completed
            ) {
                continue;
            }

            progress.progress = Math.min(
                quest.required,
                progress.progress + amount
            );

            if (progress.progress >= quest.required) {
                progress.completed = true;
            }

            updated.push({
                id,
                progress: progress.progress,
                required: quest.required,
                completed: progress.completed
            });
        }

        return updated;
    }

    claimReward(id, player) {
        const quest = this.getQuest(id);
        const active = this.activeQuests[id];

        if (!quest || !active || !active.completed) {
            return {
                success: false,
                message: "ภารกิจยังไม่สำเร็จ"
            };
        }

        if (!player) {
            return {
                success: false,
                message: "ไม่พบข้อมูลตัวละคร"
            };
        }

        player.exp = (player.exp || 0) + quest.rewards.exp;
        player.gold = (player.gold || 0) + quest.rewards.gold;

        this.completedQuests.push(id);
        delete this.activeQuests[id];

        return {
            success: true,
            message: "รับรางวัลสำเร็จ!",
            rewards: quest.rewards
        };
    }

    getActiveQuests() {
        return this.activeQuests;
    }

    getCompletedQuests() {
        return this.completedQuests;
    }

    save() {
        localStorage.setItem(
            "echo_quests",
            JSON.stringify({
                activeQuests: this.activeQuests,
                completedQuests: this.completedQuests
            })
        );
    }

    load() {
        try {
            const saved = localStorage.getItem("echo_quests");

            if (!saved) return;

            const data = JSON.parse(saved);

            this.activeQuests = data.activeQuests || {};
            this.completedQuests = data.completedQuests || [];
        } catch (error) {
            console.error("Quest loading error:", error);
        }
    }
}

window.QuestSystem = QuestSystem;
