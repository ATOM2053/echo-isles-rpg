class WorldScene extends Phaser.Scene {
    constructor() {
        super("WorldScene");

        this.playerSpeed = 180;
        this.playerStats = {
            level: 1,
            hp: 100,
            maxHp: 100,
            mp: 100,
            maxMp: 100,
            exp: 0,
            maxExp: 100
        };
    }

    create() {
        this.createTextures();
        this.createWorld();
        this.createPlayer();
        this.createCamera();
        this.createControls();
        this.createHUD();

        this.systems = window.echoGameSystems;

        console.log("World Scene Started!");
    }

    createTextures() {
        const graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        // ตัวละคร Pixel Art เริ่มต้น
        graphics.fillStyle(0x202030);
        graphics.fillRect(10, 20, 20, 22);

        graphics.fillStyle(0xe8b58c);
        graphics.fillRect(12, 3, 16, 17);

        graphics.fillStyle(0x49301f);
        graphics.fillRect(10, 1, 20, 7);

        graphics.fillStyle(0x3975bd);
        graphics.fillRect(11, 23, 18, 13);

        graphics.fillStyle(0xffffff);
        graphics.fillRect(14, 10, 3, 3);
        graphics.fillRect(22, 10, 3, 3);

        graphics.generateTexture("player", 40, 40);
        graphics.destroy();

        // ต้นไม้
        const tree = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        tree.fillStyle(0x604329);
        tree.fillRect(13, 20, 10, 22);

        tree.fillStyle(0x245b38);
        tree.fillCircle(18, 15, 16);

        tree.fillStyle(0x347d49);
        tree.fillCircle(13, 12, 10);

        tree.generateTexture("tree", 36, 44);
        tree.destroy();

        // พุ่มหญ้า
        const grass = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        grass.fillStyle(0x83b75c);
        grass.fillRect(3, 5, 4, 7);
        grass.fillRect(9, 1, 4, 11);
        grass.fillRect(15, 5, 4, 7);

        grass.generateTexture("grass", 22, 14);
        grass.destroy();
    }

    createWorld() {
        const worldWidth = 3000;
        const worldHeight = 3000;

        this.physics.world.setBounds(
            0,
            0,
            worldWidth,
            worldHeight
        );

        // พื้นหญ้า
        this.add.rectangle(
            worldWidth / 2,
            worldHeight / 2,
            worldWidth,
            worldHeight,
            0x477d43
        );

        // เส้นทางเดิน
        this.add.rectangle(
            1500,
            1500,
            2600,
            170,
            0xb89a68
        );

        this.add.rectangle(
            1500,
            1500,
            170,
            2600,
            0xb89a68
        );

        // สุ่มต้นไม้ตกแต่ง
        for (let i = 0; i < 180; i++) {
            const x = Phaser.Math.Between(100, 2900);
            const y = Phaser.Math.Between(100, 2900);

            const nearRoad =
                Math.abs(x - 1500) < 180 ||
                Math.abs(y - 1500) < 180;

            if (!nearRoad) {
                this.add.image(x, y, "tree")
                    .setDepth(y)
                    .setScale(Phaser.Math.FloatBetween(0.8, 1.3));
            }
        }

        for (let i = 0; i < 250; i++) {
            this.add.image(
                Phaser.Math.Between(50, 2950),
                Phaser.Math.Between(50, 2950),
                "grass"
            ).setDepth(1);
        }

        // ชื่อพื้นที่
        this.add.text(1500, 1250, "EMERALD FOREST", {
            fontSize: "32px",
            color: "#ffffff",
            fontStyle: "bold",
            stroke: "#25452a",
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(5);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(
            1500,
            1500,
            "player"
        );

        this.player.setCollideWorldBounds(true);
        this.player.setDepth(1500);
        this.player.body.setSize(20, 16);
        this.player.body.setOffset(10, 22);
    }

    createCamera() {
        this.cameras.main.setBounds(
            0,
            0,
            3000,
            3000
        );

        this.cameras.main.startFollow(
            this.player,
            true,
            0.1,
            0.1
        );

        this.cameras.main.setZoom(1.5);
    }

    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.keys = this.input.keyboard.addKeys(
            "W,A,S,D"
        );

        this.joystick = {
            x: 0,
            y: 0
        };

        this.createMobileButtons();
    }

    createMobileButtons() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.joyBase = this.add.circle(
            90,
            height - 100,
            55,
            0x111111,
            0.45
        ).setScrollFactor(0).setDepth(1000);

        this.joyThumb = this.add.circle(
            90,
            height - 100,
            25,
            0xffffff,
            0.75
        ).setScrollFactor(0).setDepth(1001);

        this.joyCenter = {
            x: 90,
            y: height - 100
        };

        this.input.on("pointerdown", pointer => {
            if (
                pointer.x < 180 &&
                pointer.y > height - 190
            ) {
                this.joystickActive = true;
                this.updateJoystick(pointer);
            }
        });

        this.input.on("pointermove", pointer => {
            if (
                this.joystickActive &&
                pointer.isDown
            ) {
                this.updateJoystick(pointer);
            }
        });

        this.input.on("pointerup", () => {
            this.joystickActive = false;

            this.joystick.x = 0;
            this.joystick.y = 0;

            this.joyThumb.setPosition(
                this.joyCenter.x,
                this.joyCenter.y
            );
        });

        this.attackButton = this.add.circle(
            width - 85,
            height - 100,
            42,
            0x9b3838,
            0.85
        ).setScrollFactor(0).setDepth(1000);

        this.add.text(
            width - 85,
            height - 100,
            "ATK",
            {
                fontSize: "17px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setOrigin(0.5)
         .setScrollFactor(0)
         .setDepth(1001);
    }

    updateJoystick(pointer) {
        const dx = pointer.x - this.joyCenter.x;
        const dy = pointer.y - this.joyCenter.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 40;

        const scale = Math.min(
            1,
            maxDistance / Math.max(distance, 1)
        );

        this.joystick.x = (dx / maxDistance) * scale;
        this.joystick.y = (dy / maxDistance) * scale;

        this.joyThumb.setPosition(
            this.joyCenter.x + dx * scale,
            this.joyCenter.y + dy * scale
        );
    }

    createHUD() {
        this.add.rectangle(
            130,
            35,
            230,
            65,
            0x101820,
            0.85
        ).setScrollFactor(0).setDepth(2000);

        this.levelText = this.add.text(
            25,
            10,
            "LV. 1",
            {
                fontSize: "17px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        ).setScrollFactor(0).setDepth(2001);

        this.hpBar = this.add.rectangle(
            120,
            38,
            180,
            10,
            0xd94a4a
        ).setOrigin(0, 0.5)
         .setScrollFactor(0)
         .setDepth(2001);

        this.mpBar = this.add.rectangle(
            120,
            55,
            180,
            8,
            0x3989dc
        ).setOrigin(0, 0.5)
         .setScrollFactor(0)
         .setDepth(2001);

        this.expText = this.add.text(
            25,
            72,
            "EXP: 0 / 100",
            {
                fontSize: "13px",
                color: "#ffffff"
            }
        ).setScrollFactor(0).setDepth(2001);
    }

    update() {
        if (!this.player || !this.player.body) return;

        let x = 0;
        let y = 0;

        if (this.keys.A.isDown || this.cursors.left.isDown) {
            x = -1;
        }

        if (this.keys.D.isDown || this.cursors.right.isDown) {
            x = 1;
        }

        if (this.keys.W.isDown || this.cursors.up.isDown) {
            y = -1;
        }

        if (this.keys.S.isDown || this.cursors.down.isDown) {
            y = 1;
        }

        x += this.joystick.x;
        y += this.joystick.y;

        const length = Math.sqrt(x * x + y * y);

        if (length > 1) {
            x /= length;
            y /= length;
        }

        this.player.setVelocity(
            x * this.playerSpeed,
            y * this.playerSpeed
        );

        this.player.setDepth(this.player.y);

        this.updateHUD();
    }

    updateHUD() {
        const stats = this.playerStats;

        this.levelText.setText(
            `LV. ${stats.level}`
        );

        this.hpBar.width =
            180 * (stats.hp / stats.maxHp);

        this.mpBar.width =
            180 * (stats.mp / stats.maxMp);

        this.expText.setText(
            `EXP: ${stats.exp} / ${stats.maxExp}`
        );
    }
}

window.WorldScene = WorldScene;
