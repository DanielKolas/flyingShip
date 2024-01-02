import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
    constructor(config){
        super("MenuScene", config);

        this.menu = [
            {scene: "PlayScene", text: "Play"},
            {scene: "ScoreScene", text: "Scores"},
            {scene: null, text: "Exit"}
        ]
    }

    create(){
        super.create();
        this.createStaticBG();
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    }

    setupMenuEvents(menuItem){
        const textGameObject = menuItem.textGameObject;
        textGameObject.setInteractive().on("pointerover", () => {
            textGameObject.setStyle({fill: "#b31a25"});
        });
        textGameObject.on("pointerout", () => {
            textGameObject.setStyle({fill: "#fff"});
        });
        textGameObject.on("pointerup", () => {
            menuItem.scene && this.scene.start(menuItem.scene);

            if(menuItem.text === "Exit"){
                this.game.destroy(true);
            }
        });
    }
}

export default MenuScene;