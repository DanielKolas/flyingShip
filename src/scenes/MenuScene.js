import Phaser from "phaser";

class MenuScene extends Phaser.Scene {
    constructor(config){
        super("MenuScene");
        this.config = config
    }

    preload(){
        this.load.image("background-sky", "assets/sky.png");
    }

    create(){
        this.add.image(0, 0, "background-sky").setOrigin(0, 0);

    }
}

export default MenuScene;