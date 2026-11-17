(() => {
    "use strict";

    if (typeof Phaser === "undefined") {
        console.error("Phaser was not loaded!");
        return;
    }

    if (typeof GameSystems === "undefined") {
        console.error("GameSystems was not loaded!");
        return;
    }

    // สร้างระบบเกมทั้งหมด
    window.echoGameSystems = new GameSystems();

    // ตรวจสอบ Scene ที่จำเป็น
    const requiredScenes = [
        "LoginScene",
        "CharacterScene",
        "WorldScene"
    ];

    for (const sceneName of requiredScenes) {
        if (typeof window[sceneName] !== "function") {
            console.error(`Missing scene: ${sceneName}`);
            return;
        }
    }

    // ตั้งค่า Phaser
    const config = {
        type: Phaser.AUTO,

        parent: "game-container",

        width: 1280,
        height: 720,

        backgroundColor: "#17251b",

        pixelArt: true,
        antialias: false,
        roundPixels: true,

        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        },

        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },

        input: {
            activePointers: 3
        },

        scene: [
            LoginScene,
            CharacterScene,
            WorldScene
        ]
    };

    // สร้างเกมเพียงหนึ่งตัว
    window.echoGame = new Phaser.Game(config);

    console.log("ECHO ISLES RPG initialized!");
})();
