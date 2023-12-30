import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

// VARIABLES 
const WIDTH = 800 ;
const HEIGHT = 600 ;
const BIRD_POSITION = {x: WIDTH / 10, y: HEIGHT / 2};

const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    startPosition: BIRD_POSITION
}

const SCENES = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => SCENES.map(createScene)

// CONFIG 
const config = {
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: initScenes()
}

new Phaser.Game(config);