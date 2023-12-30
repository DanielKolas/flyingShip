import Phaser from "phaser";
import PlayScene from "./PlayScene";
class MenuScene extends Phaser.Scene {
    constructor(config){
        super("MenuScene");
        this.config = config
    }

    create(){
        this.add.image(0, 0, "background-sky").setOrigin(0, 0);
        this.scene.start("PlayScene")
    }
}

export default MenuScene;