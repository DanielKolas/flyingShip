import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
    constructor(config){
        super("PreloadScene");
    }

    preload(){
        this.load.image("background-sky", "assets/sky.png");
        this.load.image("bird", "assets/bird.png");
        this.load.image("pipe", "assets/pipe.png");
        this.load.image("pause", "assets/pause.png");
        this.load.image("back", "assets/back.png");
    }

    create(){
        this.scene.start("MenuScene");

    }
}

export default PreloadScene;