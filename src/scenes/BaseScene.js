import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
    constructor(key, config){
        super(key);
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];
        this.fontSize = 40;
        this.lineHeight = 50;
        this.fontOptions = {fontSize: `${this.fontSize}px`, fill: "#FFF"}
    }

    create(){
        if(this.config.canGoBack){
            const backButton = this.add.image(this.config.width - 10, this.config.height - 10, "back")
            .setOrigin(1)
            .setScale(2)
            .setInteractive()

            backButton.on("pointerup", () =>{
                this.scene.start("MenuScene");
            })
        }
    }
    createStaticBG(){
        this.add.image(0, 0, "background-sky").setOrigin(0, 0);
    }

    createMenu(menu, setUpMenuEvents){
        let lastMenuPositionY = 0;
    
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
            menuItem.textGameObject = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1) ;
            lastMenuPositionY += this.lineHeight;
            setUpMenuEvents(menuItem);
        });
    }
}

export default BaseScene;