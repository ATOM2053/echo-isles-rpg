// ======================================
// ECHO ISLES RPG
// LOGIN SCENE
// ======================================

class LoginScene extends Phaser.Scene {

    constructor() {
        super("LoginScene");
    }

    create() {

        const width = this.scale.width;
        const height = this.scale.height;

        this.cameras.main.setBackgroundColor("#101525");

        // Background
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x101525
        );

        // Game title
        this.add.text(
            width / 2,
            height * 0.22,
            "ECHO ISLES",
            {
                fontSize: "42px",
                color: "#e8bd62",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            height * 0.29,
            "FANTASY MMORPG",
            {
                fontSize: "15px",
                color: "#ffffff",
                letterSpacing: 5
            }
        ).setOrigin(0.5);

        // Login panel
        this.add.rectangle(
            width / 2,
            height / 2,
            330,
            270,
            0x202b40
        ).setStrokeStyle(2, 0xc49a52);

        this.add.text(
            width / 2,
            height * 0.40,
            "WELCOME ADVENTURER",
            {
                fontSize: "18px",
                color: "#f5e8c9",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        // Guest button
        const guestButton = this.add.rectangle(
            width / 2,
            height * 0.53,
            220,
            48,
            0xa87932
        );

        guestButton.setInteractive({
            useHandCursor: true
        });

        this.add.text(
            width / 2,
            height * 0.53,
            "ENTER WORLD",
            {
                fontSize: "17px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        guestButton.on("pointerdown", () => {

            this.scene.start("WorldScene");

        });

        this.add.text(
            width / 2,
            height * 0.72,
            "Version 0.1.0",
            {
                fontSize: "12px",
                color: "#9ba6b8"
            }
        ).setOrigin(0.5);

    }
}

// Register scene
window.LoginScene = LoginScene;

console.log("Login Scene Loaded!");
