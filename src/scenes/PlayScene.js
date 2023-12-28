import Phaser from "phaser";

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
    this.bird = null;
    this.pipes = null;
    this.pipeOpeningRange = [150, 250];
    this.pipeHorizontalRange = [400, 450];
    this.initialBirdPosition = { x: config.width / 10, y: config.height / 2 };
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";
  }

  preload() {
    this.load.image("background-sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
  }

  create() {
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBG() {
    this.add.image(0, 0, "background-sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0);
    this.bird.body.gravity.y = 550;
    this.bird.setCollideWorldBounds(true);
  }

  createPause(){
    const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, "pause")
        .setOrigin(1)
        .setScale(3)
        .setInteractive();

    pauseButton.on("pointerdown", () => {
        this.physics.pause();
        this.scene.pause();
    })
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const pipeUpper = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);

      const pipeLower = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(pipeUpper, pipeLower);
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: "32px",
      color: "#000",
    });
    this.add.text(16, 60, `Best score: ${bestScore || 0}`, {
      fontSize: "32px",
      color: "#000",
    });
  }

  handleInputs() {
    // we must pass the context for event on actions
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }

  checkGameStatus() {
    if (
      this.bird.body.position.y >= this.config.height - this.bird.body.height ||
      this.bird.body.position.y <= 0
    ) {
      this.gameOver();
    }
  }

  placePipe(pipeUpper, pipeLower) {
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...this.pipeOpeningRange);
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - pipeVerticalDistance - 20
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalRange
    );

    pipeUpper.x = pipeHorizontalDistance + rightMostX;
    pipeUpper.y = pipeVerticalPosition;
    pipeLower.x = pipeUpper.x;
    pipeLower.y = pipeUpper.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore(); 
          this.saveBestScore();
        }
      }
    });
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }
  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
