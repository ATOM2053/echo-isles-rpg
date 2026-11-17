// ==================================
// ECHO ISLES RPG
// GAME CONFIGURATION
// ==================================

window.ECHO_CONFIG = {

    title: "ECHO ISLES RPG",

    version: "0.1.0",

    width: 1280,

    height: 720,

    backgroundColor: "#101525",

    pixelArt: true,

    roundPixels: true,

    physics: {
        default: "arcade",

        arcade: {
            debug: false
        }
    },

    scale: {
        mode: Phaser.Scale.RESIZE,

        autoCenter: Phaser.Scale.CENTER_BOTH,

        width: "100%",

        height: "100%"
    }

};

console.log("ECHO ISLES RPG Config Loaded!");
