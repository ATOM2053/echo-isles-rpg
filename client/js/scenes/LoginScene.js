class LoginScene extends Phaser.Scene {
    constructor() {
        super("LoginScene");
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.cameras.main.setBackgroundColor("#101b20");

        // พื้นหลัง
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x152a27
        );

        // แสงตกแต่ง
        this.add.circle(
            width / 2,
            height / 2,
            180,
            0x32664b,
            0.15
        );

        // ชื่อเกม
        this.add.text(
            width / 2,
            height * 0.25,
            "ECHO ISLES",
            {
                fontSize: "48px",
                fontStyle: "bold",
                color: "#e8d29a",
                stroke: "#49351d",
                strokeThickness: 7
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            height * 0.25 + 55,
            "FANTASY MMORPG",
            {
                fontSize: "16px",
                color: "#a9c9a9",
                letterSpacing: 5
            }
        ).setOrigin(0.5);

        // ปุ่มเริ่มเกม
        this.createButton(
            width / 2,
            height * 0.58,
            "ENTER WORLD",
            () => {
                this.scene.start("CharacterScene");
            }
        );

        // ข้อความเวอร์ชัน
        this.add.text(
            width / 2,
            height - 30,
            "ECHO ISLES RPG | ALPHA VERSION",
            {
                fontSize: "11px",
                color: "#80918a"
            }
        ).setOrigin(0.5);
    }

    createButton(x, y, label, callback) {
        const button = this.add.rectangle(
            x,
            y,
            230,
            58,
            0x8c6735
        );

        button.setInteractive({
            useHandCursor: true
        });

        const text = this.add.text(x, y, label, {
            fontSize: "20px",
            color: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        button.on("pointerover", () => {
            button.setFillStyle(0xb58a4b);
        });

        button.on("pointerout", () => {
            button.setFillStyle(0x8c6735);
        });

        button.on("pointerdown", callback);
    }
}

window.LoginScene = LoginScene;
