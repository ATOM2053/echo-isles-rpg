// ==========================================
// ECHO ISLES RPG
// CHARACTER CREATION SYSTEM
// ==========================================

class CharacterScene extends Phaser.Scene {

    constructor() {
        super("CharacterScene");

        this.races = [
            "Human",
            "Elf",
            "Dwarf",
            "Beastkin"
        ];

        this.genders = [
            "Male",
            "Female"
        ];

        this.professions = [
            "Swordsman",
            "Knight",
            "Archer",
            "Mage",
            "Assassin",
            "Priest",
            "Blacksmith",
            "Alchemist",
            "Chef",
            "Fisher",
            "Miner",
            "Herbalist"
        ];

        this.raceIndex = 0;
        this.genderIndex = 0;
        this.professionIndex = 0;
        this.characterName = "Adventurer";
    }

    create() {

        const w = this.scale.width;
        const h = this.scale.height;

        this.cameras.main.setBackgroundColor("#101525");

        // Title
        this.add.text(
            w / 2, 35,
            "CREATE CHARACTER",
            {
                fontSize: "25px",
                color: "#e8bd62",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        this.add.text(
            w / 2, 68,
            "Choose your destiny",
            {
                fontSize: "14px",
                color: "#c3c8d4"
            }
        ).setOrigin(0.5);

        // Character preview
        this.add.rectangle(
            w / 2,
            h * 0.25,
            w - 40,
            150,
            0x202b40
        ).setStrokeStyle(2, 0xc49a52);

        this.add.text(
            w / 2,
            h * 0.20,
            "CHARACTER PREVIEW",
            {
                fontSize: "15px",
                color: "#e8bd62"
            }
        ).setOrigin(0.5);

        this.previewText = this.add.text(
            w / 2,
            h * 0.28,
            "Character Preview",
            {
                fontSize: "20px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // Race
        this.createSelector(
            "RACE",
            this.races,
            "race",
            h * 0.40,
            w
        );

        // Gender
        this.createSelector(
            "GENDER",
            this.genders,
            "gender",
            h * 0.51,
            w
        );

        // Profession
        this.createSelector(
            "PROFESSION",
            this.professions,
            "profession",
            h * 0.62,
            w
        );

        // Character name
        this.createButton(
            w / 2,
            h * 0.74,
            "SET CHARACTER NAME",
            () => {

                const name = prompt(
                    "Enter character name:"
                );

                if (name && name.trim()) {
                    this.characterName = name.trim();

                    this.nameText.setText(
                        "Name: " + this.characterName
                    );
                }

            }
        );

        this.nameText = this.add.text(
            w / 2,
            h * 0.80,
            "Name: Adventurer",
            {
                fontSize: "15px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // Create character
        this.createButton(
            w / 2,
            h * 0.90,
            "CREATE CHARACTER",
            () => {

                const character = {

                    name: this.characterName,

                    race: this.races[
                        this.raceIndex
                    ],

                    gender: this.genders[
                        this.genderIndex
                    ],

                    profession: this.professions[
                        this.professionIndex
                    ],

                    level: 1,
                    exp: 0,
                    hp: 100,
                    mp: 50

                };

                localStorage.setItem(
                    "echo_character",
                    JSON.stringify(character)
                );

                alert("Character created!");

                this.scene.start("WorldScene");

            }
        );

    }

    createSelector(title, list, type, y, w) {

        this.add.text(
            w / 2,
            y - 18,
            title,
            {
                fontSize: "13px",
                color: "#e8bd62",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const value = this.add.text(
            w / 2,
            y + 12,
            list[0],
            {
                fontSize: "16px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        const left = this.add.text(
            w / 2 - 110,
            y + 12,
            "<",
            {
                fontSize: "24px",
                color: "#ffffff",
                backgroundColor: "#34435e",
                padding: { x: 12, y: 3 }
            }
        ).setOrigin(0.5).setInteractive();

        const right = this.add.text(
            w / 2 + 110,
            y + 12,
            ">",
            {
                fontSize: "24px",
                color: "#ffffff",
                backgroundColor: "#34435e",
                padding: { x: 12, y: 3 }
            }
        ).setOrigin(0.5).setInteractive();

        const update = () => {

            let index = this[type + "Index"];

            value.setText(list[index]);

            this.previewText.setText(
                this.races[this.raceIndex] +
                " / " +
                this.genders[this.genderIndex] +
                "\n" +
                this.professions[this.professionIndex]
            );

        };

        left.on("pointerdown", () => {

            this[type + "Index"]--;

            if (this[type + "Index"] < 0) {
                this[type + "Index"] = list.length - 1;
            }

            update();

        });

        right.on("pointerdown", () => {

            this[type + "Index"]++;

            if (this[type + "Index"] >= list.length) {
                this[type + "Index"] = 0;
            }

            update();

        });

    }

    createButton(x, y, label, callback) {

        const button = this.add.rectangle(
            x,
            y,
            250,
            42,
            0x95652d
        ).setStrokeStyle(2, 0xe8bd62);

        button.setInteractive({
            useHandCursor: true
        });

        this.add.text(
            x,
            y,
            label,
            {
                fontSize: "13px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        button.on("pointerdown", callback);

        button.on("pointerover", () => {
            button.setFillStyle(0xb17c3d);
        });

        button.on("pointerout", () => {
            button.setFillStyle(0x95652d);
        });

    }

}

window.CharacterScene = CharacterScene;

console.log("CharacterScene loaded!");
