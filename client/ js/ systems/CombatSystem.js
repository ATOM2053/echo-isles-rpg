// ==========================================
// ECHO ISLES RPG
// COMBAT SYSTEM
// ==========================================

class CombatSystem {

    constructor(scene) {
        this.scene = scene;

        this.playerStats = {
            level: 1,
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            attack: 15,
            defense: 5,
            critical: 5
        };

        this.cooldowns = {};
    }

    // Player basic attack
    attack(target) {

        if (!target || !target.active) return;

        const damage = this.calculateDamage();

        target.takeDamage(damage);

        this.showDamage(
            target.x,
            target.y,
            damage
        );

        return damage;
    }

    // Calculate damage
    calculateDamage() {

        let damage = this.playerStats.attack;

        const critical =
            Math.random() * 100 <
            this.playerStats.critical;

        if (critical) {
            damage *= 2;
        }

        return Math.floor(damage);
    }

    // Use skill
    useSkill(skillName, target) {

        const skills = {
            fireball: {
                damage: 35,
                mana: 15,
                cooldown: 3000
            },

            swordSlash: {
                damage: 25,
                mana: 5,
                cooldown: 1500
            },

            healing: {
                damage: 0,
                healing: 40,
                mana: 20,
                cooldown: 5000
            }
        };

        const skill = skills[skillName];

        if (!skill) return false;

        if (this.cooldowns[skillName] > Date.now()) {
            return false;
        }

        if (this.playerStats.mp < skill.mana) {
            return false;
        }

        this.playerStats.mp -= skill.mana;

        this.cooldowns[skillName] =
            Date.now() + skill.cooldown;

        if (skill.healing) {

            this.heal(skill.healing);

        } else if (target && target.active) {

            target.takeDamage(skill.damage);

            this.showDamage(
                target.x,
                target.y,
                skill.damage
            );

        }

        return true;
    }

    // Player takes damage
    takeDamage(amount) {

        const reduction =
            this.playerStats.defense;

        const finalDamage = Math.max(
            1,
            amount - reduction
        );

        this.playerStats.hp = Math.max(
            0,
            this.playerStats.hp - finalDamage
        );

        if (this.playerStats.hp <= 0) {
            this.onPlayerDefeated();
        }

        return finalDamage;
    }

    // Healing
    heal(amount) {

        this.playerStats.hp = Math.min(
            this.playerStats.maxHp,
            this.playerStats.hp + amount
        );
    }

    // Restore mana
    restoreMana(amount) {

        this.playerStats.mp = Math.min(
            this.playerStats.maxMp,
            this.playerStats.mp + amount
        );
    }

    // Damage number effect
    showDamage(x, y, amount) {

        const text = this.scene.add.text(
            x,
            y - 35,
            String(amount),
            {
                fontSize: '20px',
                color: '#ff6464',
                fontStyle: 'bold',
                stroke: '#321010',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: y - 85,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });
    }

    onPlayerDefeated() {

        this.scene.physics.pause();

        this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'YOU HAVE BEEN DEFEATED',
            {
                fontSize: '25px',
                color: '#ff7777',
                backgroundColor: '#101525',
                padding: 15
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);
    }

    getStats() {
        return { ...this.playerStats };
    }
}

window.CombatSystem = CombatSystem;

console.log('Combat System Loaded!');
