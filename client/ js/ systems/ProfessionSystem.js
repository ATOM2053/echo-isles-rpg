class ProfessionSystem {
    constructor() {
        this.professions = {
            blacksmith: {
                name: "Blacksmith",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            },
            alchemist: {
                name: "Alchemist",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            },
            chef: {
                name: "Chef",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            },
            tailor: {
                name: "Tailor",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            },
            miner: {
                name: "Miner",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            },
            fisher: {
                name: "Fisher",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            },
            herbalist: {
                name: "Herbalist",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            },
            woodcutter: {
                name: "Woodcutter",
                level: 1,
                exp: 0,
                nextExp: 100,
                mastery: 0
            }
        };
    }

    getProfession(id) {
        return this.professions[id] || null;
    }

    gainExp(id, amount) {
        const profession = this.getProfession(id);

        if (!profession || amount <= 0) return false;

        profession.exp += amount;

        while (profession.exp >= profession.nextExp) {
            profession.exp -= profession.nextExp;
            profession.level++;

            profession.nextExp = Math.floor(
                profession.nextExp * 1.25
            );

            profession.mastery += 1;

            console.log(
                `${profession.name} Level Up! Level ${profession.level}`
            );
        }

        return true;
    }

    getAllProfessions() {
        return this.professions;
    }

    getLevel(id) {
        const profession = this.getProfession(id);
        return profession ? profession.level : 0;
    }

    getMastery(id) {
        const profession = this.getProfession(id);
        return profession ? profession.mastery : 0;
    }

    canCraft(id, requiredLevel) {
        return this.getLevel(id) >= requiredLevel;
    }

    save() {
        localStorage.setItem(
            "echo_professions",
            JSON.stringify(this.professions)
        );
    }

    load() {
        const saved = localStorage.getItem("echo_professions");

        if (saved) {
            try {
                const data = JSON.parse(saved);

                for (const id in this.professions) {
                    if (data[id]) {
                        this.professions[id] = {
                            ...this.professions[id],
                            ...data[id]
                        };
                    }
                }
            } catch (error) {
                console.error("Cannot load professions:", error);
            }
        }
    }
}

window.ProfessionSystem = ProfessionSystem;
