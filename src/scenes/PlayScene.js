import BaseScene from "./BaseScene";

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);
    this.bird = null;
    this.dynamicBG = null;
    this.pipes = null;
    this.isPaused = false;
    this.initialBirdPosition = { x: config.width / 10, y: config.height / 2 };
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";

    this.currentDifficulty = "easy";
    this.difficulties = {
      "easy" :{
        pipeOpeningRange: [150, 250 ],
        pipeHorizontalRange: [400, 450]
      },
      "normal" :{
        pipeOpeningRange: [150, 200],
        pipeHorizontalRange: [350, 400]
      },
      "hard" :{
        pipeOpeningRange: [120, 170],
        pipeHorizontalRange: [250, 300]
      }
    }
  }

  create() {
    this.currentDifficulty = 'easy';
    super.create();
    this.createDynamicBG();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();
    
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", {start: 0, end: 7}),
      // default frameRate is 24 fps 
      frameRate: 8,
      repeat: -1
    });
    this.bird.play("fly");
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
    this.recycleBG();
  }

  listenToEvents(){
    if(this.pauseEvent) {return;}

    this.pauseEvent = this.events.on("resume", () => {
    this.initalTime= 3;
    this.countDownText = this.add.text(...this.screenCenter, "Fly in: " + this.initalTime, this.fontOptions).setOrigin(0.5);
    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.countDown,
      callbackScope: this,
      loop: true
    })
    })
  }

countDown(){
  this.initalTime--;
  this.countDownText.setText("Fly in: "+ this.initalTime);
  if(this.initalTime <= 0){
    this.isPaused = false;
    this.countDownText.setText("");
    this.physics.resume();
    this.timedEvent.remove();
  }
}

createDynamicBG(){
  this.dynamicBG = this.physics.add
  .sprite(0, 0, "background-sky")
  .setOrigin(0)
  this.dynamicBG.body.velocity.x = -15
}

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0)
      .setScale(2)
      .setFlipX(true)

    this.bird.setBodySize(this.bird.width-1, this.bird.height-15).setOffset(0, 5);
    this.bird.body.gravity.y = 550;
    this.bird.setCollideWorldBounds(true);
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

  createPause(){
    this.isPaused = false;
    const pauseButton = this.add.image(this.config.width - 10, this.config.height - 7, "pause")
        .setOrigin(1)
        .setScale(3)
        .setInteractive();

    pauseButton.on("pointerdown", () => {
      this.isPaused = true;
        this.physics.pause();
        this.scene.pause();
        this.scene.launch("PauseScene");
    })
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
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeOpeningRange);
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - pipeVerticalDistance - 20
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalRange
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
          this.increaseDifficulty();
        }
      }
    });
  }

  recycleBG(){
    if(this.dynamicBG.getBounds().right <= 805){
      this.dynamicBG.setTexture("background-sky-2")
      this.dynamicBG.body.position.x = 0;
    }


  }
  increaseDifficulty(){
    if(this.score === 20){
    this.currentDifficulty = "normal"
    }
    if(this.score === 40){
      this.currentDifficulty = "hard"
      }
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
    if( this.isPaused) {return;}
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
