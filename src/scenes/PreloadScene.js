import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(){
        super("PreloadScene");
    }

    preload(){
        this.load.image("background-sky", "assets/background.png");
        this.load.image("background-sky-2", "assets/background2.png");
        this.load.spritesheet("bird", "assets/birdAnimation.png", {
            frameWidth: 30, frameHeight: 28
        });
        this.load.image("pipe", "assets/pipe.png");
        this.load.image("pause", "assets/stopButton.png");
        this.load.image("back", "assets/backButton.png");
    }

    create(){
        this.scene.start("MenuScene");
    }
}

export default PreloadScene;