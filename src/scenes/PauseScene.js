import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
    constructor(config){
        super("PauseScene", config);

        this.menu = [
            {scene: "PlayScene", text: "Continue"},
            {scene: "MenuScene", text: "Exit"},
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
            if(menuItem.scene && menuItem.text === "Continue") {
                this.scene.stop();
                this.scene.resume(menuItem.scene);
            } else {
                this.scene.stop("PlayScene");
                this.scene.start(menuItem.scene);
            }
        });
    }
}

export default PauseScene;