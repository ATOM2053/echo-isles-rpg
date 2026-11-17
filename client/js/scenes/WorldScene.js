// ==========================================
// ECHO ISLES RPG
// WORLD SCENE
// ==========================================

class WorldScene extends Phaser.Scene {

    constructor() {
        super({ key: 'WorldScene' });

        this.player = null;
        this.playerSpeed = 180;
        this.keys = {};
    }

    create() {

        const width = this.scale.width;
        const height = this.scale.height;

        // WORLD SETTINGS
        this.cameras.main.setBackgroundColor('#294b37');

        // Create world
        this.physics.world.setBounds(0, 0, 2400, 1800);

        // Draw grass ground
        this.createWorld();

        // Load character data
        const savedCharacter = localStorage.getItem(
            'echoIslesCharacter'
        );

        this.character = savedCharacter
            ? JSON.parse(savedCharacter)
            : {
                name: 'Adventurer',
                race: 'Human',
                job: 'Swordsman'
            };

        // Player placeholder
        // Replace with detailed pixel-art spritesheet later.
        this.player = this.physics.add.sprite(
            1200,
            900,
            'player'
        );

        this.player.setDepth(10);
        this.player.setCollideWorldBounds(true);

        // Camera follows player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5);

        // Keyboard controls
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            up2: 'UP',
            down2: 'DOWN',
            left2: 'LEFT',
            right2: 'RIGHT'
        });

        // UI
        this.createHUD();

        // Create NPC
        this.createNPC();

        // Mobile controls
        this.createMobileControls();

        // Resize support
        this.scale.on('resize', this.resizeGame, this);
    }

    createWorld() {

        const graphics = this.add.graphics();

        // Grass base
        graphics.fillStyle(0x355d3c, 1);
        graphics.fillRect(0, 0, 2400, 1800);

        // Grass details
        for (let i = 0; i < 700; i++) {

            const x = Phaser.Math.Between(0, 2400);
            const y = Phaser.Math.Between(0, 1800);

            graphics.fillStyle(
                Phaser.Math.RND.pick([
                    0x456d42,
                    0x527b48,
                    0x294b32,
                    0x66884b
                ]),
                1
            );

            graphics.fillRect(x, y, 3, 5);
        }

        // Main road
        graphics.fillStyle(0x8d7958, 1);
        graphics.fillRect(1080, 0, 240, 1800);

        graphics.fillStyle(0xa18b66, 1);
        graphics.fillRect(1090, 0, 220, 1800);

        // Road stones
        for (let i = 0; i < 100; i++) {

            const x = Phaser.Math.Between(1095, 1305);
            const y = Phaser.Math.Between(0, 1800);

            graphics.fillStyle(0xb4a17b, 0.7);
            graphics.fillRect(x, y, 8, 5);
        }

        // Trees
        for (let i = 0; i < 70; i++) {

            const x = Phaser.Math.Between(50, 2300);
            const y = Phaser.Math.Between(50, 1700);

            if (x > 1030 && x < 1370) continue;

            this.createTree(x, y);
        }

        graphics.setDepth(1);
    }

    createTree(x, y) {

        const tree = this.add.container(x, y);

        const shadow = this.add.ellipse(
            0, 15, 45, 18, 0x17291c, 0.4
        );

        const trunk = this.add.rectangle(
            0, 0, 14, 35, 0x68452c
        );

        const leaves = this.add.ellipse(
            0, -25, 55, 65, 0x245332
        );

        const leavesLight = this.add.ellipse(
            -10, -35, 30, 35, 0x467b40
        );

        tree.add([
            shadow,
            trunk,
            leaves,
            leavesLight
        ]);

        tree.setDepth(y);
    }

    createHUD() {

        const hud = this.add.container(15, 15);

        hud.setScrollFactor(0);
        hud.setDepth(100);

        const panel = this.add.rectangle(
            105, 65, 190, 100, 0x111827, 0.9
        );

        panel.setStrokeStyle(2, 0xc5a568);

        const name = this.add.text(
            25, 25,
            this.character.name,
            {
                fontSize: '15px',
                color: '#f3d28a',
                fontStyle: 'bold'
            }
        );

        const level = this.add.text(
            25, 48,
            'Level 1',
            {
                fontSize: '12px',
                color: '#ffffff'
            }
        );

        const hp = this.add.text(
            25, 70,
            'HP 100 / 100',
            {
                fontSize: '12px',
                color: '#80e69a'
            }
        );

        const mp = this.add.text(
            25, 88,
            'MP 50 / 50',
            {
                fontSize: '12px',
                color: '#80baff'
            }
        );

        hud.add([
            panel,
            name,
            level,
            hp,
            mp
        ]);
    }

    createNPC() {

        const npc = this.add.container(1200, 700);

        const body = this.add.rectangle(
            0, 0, 22, 35, 0x4169a1
        );

        const head = this.add.rectangle(
            0, -25, 18, 18, 0xe8bd91
        );

        const label = this.add.text(
            0, -55,
            'Village Guide',
            {
                fontSize: '12px',
                color: '#ffffff',
                backgroundColor: '#172033',
                padding: {
                    x: 5,
                    y: 3
                }
            }
        ).setOrigin(0.5);

        npc.add([body, head, label]);
        npc.setDepth(700);

        npc.setSize(25, 45);

        this.physics.add.existing(npc);

        npc.body.setImmovable(true);
    }

    createMobileControls() {

        const width = this.scale.width;
        const height = this.scale.height;

        if (!this.sys.game.device.input.touch) return;

        const controls = [
            { name: 'left', x: 65, y: height - 100 },
            { name: 'right', x: 165, y: height - 100 },
            { name: 'up', x: 115, y: height - 150 },
            { name: 'down', x: 115, y: height - 50 }
        ];

        controls.forEach(control => {

            const button = this.add.circle(
                control.x,
                control.y,
                27,
                0x172033,
                0.8
            );

            button.setStrokeStyle(2, 0xc5a568);
            button.setScrollFactor(0);
            button.setDepth(200);
            button.setInteractive();

            button.on('pointerdown', () => {
                this.mobileDirection = control.name;
            });

            button.on('pointerup', () => {
                this.mobileDirection = null;
            });

            button.on('pointerout', () => {
                this.mobileDirection = null;
            });

            this.add.text(
                control.x,
                control.y,
                control.name[0].toUpperCase(),
                {
                    fontSize: '18px',
                    color: '#ffffff'
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(201);
        });
    }

    resizeGame() {
        // Reserved for responsive UI updates.
    }

    update() {

        if (!this.player || !this.player.body) return;

        let velocityX = 0;
        let velocityY = 0;

        const keys = this.keys;

        if (keys.left.isDown || keys.left2.isDown) {
            velocityX = -1;
        }

        if (keys.right.isDown || keys.right2.isDown) {
            velocityX = 1;
        }

        if (keys.up.isDown || keys.up2.isDown) {
            velocityY = -1;
        }

        if (keys.down.isDown || keys.down2.isDown) {
            velocityY = 1;
        }

        if (this.mobileDirection) {

            if (this.mobileDirection === 'left') velocityX = -1;
            if (this.mobileDirection === 'right') velocityX = 1;
            if (this.mobileDirection === 'up') velocityY = -1;
            if (this.mobileDirection === 'down') velocityY = 1;
        }

        const direction = new Phaser.Math.Vector2(
            velocityX,
            velocityY
        );

        direction.normalize();

        this.player.setVelocity(
            direction.x * this.playerSpeed,
            direction.y * this.playerSpeed
        );
    }
          }
