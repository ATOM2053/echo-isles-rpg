// ======================================
// ECHO ISLES RPG
// MAIN GAME ENGINE
// ======================================

class EchoIslesGame extends Phaser.Scene {

    constructor() {
        super("WorldScene");

        this.player = null;
        this.cursors = null;
        this.speed = 180;
    }

    create() {

        const width = this.scale.width;
        const height = this.scale.height;

        // Background
        this.cameras.main.setBackgroundColor("#263b32");

        // World ground
        const graphics = this.add.graphics();

        graphics.fillStyle(0x355c43, 1);
        graphics.fillRect(0, 0, 3000, 3000);

        // Grass details
        graphics.fillStyle(0x527b4c, 1);

        for (let i = 0; i < 250; i++) {
            const x = Phaser.Math.Between(0, 3000);
            const y = Phaser.Math.Between(0, 3000);

            graphics.fillRect(x, y, 4, 4);
        }

        // Player placeholder
        this.player = this.add.container(
            width / 2,
            height / 2
        );

        const body = this.add.graphics();

        body.fillStyle(0x263d91, 1);
        body.fillRect(-12, -18, 24, 30);

        body.fillStyle(0xf0c39b, 1);
        body.fillRect(-9, -34, 18, 16);

        body.fillStyle(0x302016, 1);
        body.fillRect(-10, -37, 20, 7);

        this.player.add(body);

        // Camera
        this.cameras.main.setBounds(0, 0, 3000, 3000);
        this.cameras.main.startFollow(this.player);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Game title
        this.add.text(20, 20, "ECHO ISLES RPG", {
            fontSize: "22px",
            color: "#f5d58b",
            fontStyle: "bold"
        }).setScrollFactor(0);

        // Welcome message
        this.add.text(
            20,
            55,
            "Welcome to Moonlight Kingdom",
            {
                fontSize: "13px",
                color: "#ffffff"
            }
        ).setScrollFactor(0);

    }

    update() {

        if (!this.player) return;

        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown || this.keys.A.isDown) {
            velocityX = -1;
        }

        if (this.cursors.right.isDown || this.keys.D.isDown) {
            velocityX = 1;
        }

        if (this.cursors.up.isDown || this.keys.W.isDown) {
            velocityY = -1;
        }

        if (this.cursors.down.isDown || this.keys.S.isDown) {
            velocityY = 1;
        }

        const length = Math.sqrt(
            velocityX * velocityX +
           
