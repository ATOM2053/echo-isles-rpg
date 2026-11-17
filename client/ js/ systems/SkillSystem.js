class SkillSystem {
    constructor() {
        this.skills = {
            swordsman: [
                {
                    id: "power_slash",
                    name: "Power Slash",
                    type: "damage",
                    damage: 35,
                    mana: 10,
                    cooldown: 3000,
                    level: 1
                },
                {
                    id: "whirlwind",
                    name: "Whirlwind",
                    type: "aoe",
                    damage: 50,
                    mana: 25,
                    cooldown: 8000,
                    level: 5
                }
            ],

            knight: [
                {
                    id: "shield_bash",
                    name: "Shield Bash",
                    type: "damage",
                    damage: 25,
                    mana: 12,
                    cooldown: 4000,
                    level: 1
                },
                {
                    id: "fortress",
                    name: "Fortress",
                    type: "defense",
                    value: 40,
                    mana: 20,
                    cooldown: 10000,
                    level: 5
                }
            ],

            archer: [
                {
                    id: "rapid_shot",
                    name: "Rapid Shot",
                    type: "damage",
                    damage: 30,
                    mana: 8,
                    cooldown: 2500,
                    level: 1
                },
                {
                    id: "arrow_rain",
                    name: "Arrow Rain",
                    type: "aoe",
                    damage: 45,
                    mana: 25,
                    cooldown: 9000,
                    level: 5
                }
            ],

            mage: [
                {
                    id: "fireball",
                    name: "Fireball",
                    type: "damage",
                    damage: 45,
                    mana: 18,
                    cooldown: 4000,
                    level: 1
                },
                {
                    id: "ice_storm",
                    name: "Ice Storm",
                    type: "aoe",
                    damage: 60,
                    mana: 35,
                    cooldown: 10000,
                    level: 5
                }
            ],

            assassin: [
                {
                    id: "shadow_strike",
                    name: "Shadow Strike",
                    type: "damage",
                    damage: 40,
                    mana: 12,
                    cooldown: 3500,
                    level: 1
                },
                {
                    id: "shadow_step",
                    name: "Shadow Step",
                    type: "mobility",
                    value: 5,
                    mana: 15,
                    cooldown: 7000,
                    level: 5
                }
            ],

            priest: [
                {
                    id: "holy_light",
                    name: "Holy Light",
                    type: "heal",
                    value: 40,
                    mana: 15,
                    cooldown: 5000,
                    level: 1
                },
                {
                    id: "divine_blessing",
                    name: "Divine Blessing",
                    type: "heal",
                    value: 80,
                    mana: 30,
                    cooldown: 12000,
                    level: 5
                }
            ]
        };

        this.cooldowns = {};
    }

    getSkills(className) {
        return this.skills[className] || [];
    }

    getSkill(className, skillId) {
        return this.getSkills(className).find(
            skill => skill.id === skillId
        ) || null;
    }

    canUse(className, skillId, player) {
        const skill = this.getSkill(className, skillId);

        if (!skill || !player) return false;

        const cooldownEnd = this.cooldowns[skillId] || 0;

        if (Date.now() < cooldownEnd) return false;
        if ((player.mp || 0) < skill.mana) return false;
        if ((player.level || 1) < skill.level) return false;

        return true;
    }

    useSkill(className, skillId, player, target = null) {
        const skill = this.getSkill(className, skillId);

        if (!this.canUse(className, skillId, player)) {
            return {
                success: false,
                message: "Skill unavailable."
            };
        }

        player.mp -= skill.mana;

        this.cooldowns[skillId] =
            Date.now() + skill.cooldown;

        let result = {
            success: true,
            skill: skill.name,
            type: skill.type,
            value: skill.damage || skill.value || 0
        };

        if (skill.type === "damage" && target) {
            if (typeof target.takeDamage === "function") {
                target.takeDamage(skill.damage);
            }
        }

        if (skill.type === "heal") {
            player.hp = Math.min(
                player.maxHp || 100,
                player.hp + skill.value
            );
        }

        if (skill.type === "defense") {
            player.defenseBuff = {
                value: skill.value,
                expiresAt: Date.now() + 5000
            };
        }

        return result;
    }

    getRemainingCooldown(skillId) {
        const remaining =
            (this.cooldowns[skillId] || 0) - Date.now();

        return Math.max(0, remaining);
    }
}

window.SkillSystem = SkillSystem;
