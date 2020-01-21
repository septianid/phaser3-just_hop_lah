import Phaser from "phaser";

var player;
var power;
var platform;
var background_game;
var light_ornament;
var chinatown;
var peoples;
var scoreBox;
var plane;

var powerTween;

var platformGroup;
var placedPlatform = 0;
var nextPlatformPos;

var userScore;
var scoreText;
var platformDiff = 0;
var lastTotalPlatform;
var totalPlatform;
var initTotalPlatform;

var spawnPlane;
var planeEvent;
var waitToSpawn;

var jumpPower;
var jumpEvent;
var jumpTimer = 0;
var isJump;
var isDead;

var jumpSFX;
var stepSFX;
var deadSFX;

var userLog = [];
var sessionData;
var idData;
var scoreData;
var soundState;

export class In_Game extends Phaser.Scene {

  constructor(){

    super("PlayGame")
  }

  init(gameData){

    sessionData = gameData.session;
    idData = gameData.id;
    scoreData = gameData.score;
    soundState = gameData.soundStatus;
  }

  preload(){


  }

  create(){

    // this.anims.create({
    //   key: 'crowd',
    //   frames: this.anims.generateFrameNumbers('peoples_with_flag', {
    //     start: 0,
    //     end: 3
    //   }),
    //   frameRate: 10,
    //   repeat: -1
    // });

    this.anims.create({
      key: 'mouse',
      frames: this.anims.generateFrameNames('player', {
        start: 1,
        end: 15
      }),
      frameRate: 20,
      repeat: -1
    });

    background_game = this.add.sprite(360, 640, 'background_game').setScale(0.32);
    background_game.setOrigin(0.5, 0.5);

    light_ornament = this.add.tileSprite(360, 105, 500, 96, 'light_ornament').setScale(2.5);
    light_ornament.setOrigin(0.5, 0.5);

    chinatown = this.add.tileSprite(360, 950, 1052, 236, 'chinatown').setScale(2.0);
    chinatown.setOrigin(0.5, 0.5);

    scoreBox = this.add.sprite(610, 80, 'score_box').setScale(.7);
    scoreBox.setOrigin(0.5, 0.5);

    plane = this.add.sprite(-400, 350, 'plane').setScale(0.2);
    plane.setOrigin(0.5, 0.5);

    //peoples = this.add.tileSprite(360, 950, 1000, 400, 'peoples').setScale(1.7);
    peoples = this.add.tileSprite(360, 770, 1039, 616, 'peoples').setScale(1.7);
    peoples.setOrigin(0.5, 0.5);
    peoples.setDepth(1);

    player = this.physics.add.sprite(100, 500, 'player').setScale(0.16);
    player.setOrigin(0.5, 0.5);
    player.setSize(250, 670);
    player.setOffset(300, 10);
    player.body.gravity.y = 500;

    power = this.add.sprite(0, 0, 'powerbar');
    power.setOrigin(0, 0.5);
    power.scaleX = 0;
    power.scaleY = 1;
    power.visible = false;

    platformGroup = this.add.group();

    this.add.text(610, 50, 'SCORE', {
      font: 'bold 32px Arial',
      fill: 'white',
      align: 'center',
    }).setOrigin(0.5, 0.5);

    scoreText = this.add.text(610, 100, '0', {
      font: 'bold 56px Arial',
      fill: 'white',
      align: 'center',
    }).setOrigin(0.5, 0.5);

    this.physics.add.collider(player, platformGroup, this.checkLanding, null);

    //peoples.anims.play('crowd', true);

    this.addPlatform(100);
    userScore = 0;
    spawnPlane = true;

    jumpSFX = this.sound.add('jump');
    stepSFX = this.sound.add('step');
    deadSFX = this.sound.add('dead');

    this.input.on('pointerup', () => {

      if(isDead == false && isJump == false){

        if(power.scaleX >= 0.3){

          console.log(power.scaleX);
          if(userScore >= 0 && userScore < 30){

            jumpPower = power.scaleX * 400;
            player.body.gravity.y = -jumpPower * 60;
          }
          else if(userScore >= 30 && userScore < 60) {

            jumpPower = power.scaleX * 400;
            player.body.gravity.y = -jumpPower * 70;
          }
          else if(userScore >= 60 && userScore < 90) {

            jumpPower = power.scaleX * 500;
            player.body.gravity.y = -jumpPower * 60;
          }
          else if(userScore >= 90 && userScore < 120) {

            jumpPower = power.scaleX * 400;
            player.body.gravity.y = -jumpPower * 80;
          }
          else if(userScore >= 120) {

            jumpPower = power.scaleX * 400;
            player.body.gravity.y = -jumpPower * 85;
          }

          isJump = true;
          jumpSFX.play();

          platformGroup.getChildren().forEach((item) => {

            item.body.velocity.x = -jumpPower;
          });

          jumpEvent = this.time.addEvent({
            delay : 1,
            callback: this.onJump,
            loop: true,
          })

          power.scaleX = 0;
          power.visible = false;
        }
        else {

          power.scaleX = 0;
          power.visible = false;
        }

      }

      else {

      }
    })

    totalPlatform = platformGroup.getLength();
    //console.log(totalPlatform);
  }

  update(){

    //plane.x += 5;
    if(spawnPlane == true){

      plane.x += 2;
      if (plane.x >= 720 * 2){

        console.log("Destroy");
        plane.destroy();

        // planeEvent = this.time.addEvent({
        //
        //   delay: 1,
        //   repeat: 2,
        //   callback: this.onSpawnPlane,
        // })
        spawnPlane = false;
      }
    }

    if(isJump == true){

      //player.anims.pause()
      light_ornament.tilePositionX += 2;
      chinatown.tilePositionX += 0.5;
      peoples.tilePositionX += 5;
      platformGroup.getChildren().forEach((item) => {

        if(item.x < -20){

          item.destroy();
        }
      })

      if(player.y > 1280){

        this.gameOver();
        player.destroy();
        isDead = true;
      }

      if(isDead == false){

        platformDiff = totalPlatform - platformGroup.getLength();
      }
      else {

        platformDiff = 0;
      }
    }

    if(isJump == false && this.game.input.activePointer.isDown){

      power.x = player.x-50;
      power.y = player.y-70
      power.visible = true;

      power.scaleX += 0.02;

      if(power.scaleX >= 1.0){

        power.scaleX = 1.0
      }
    }
  }

  onJump(){

    //console.log("Jump");
    jumpTimer++;

    if(jumpTimer === 3){

      player.body.gravity.y = 1000;
      jumpTimer = 0;
      jumpEvent.remove(false);
    }
  }

  onSpawnPlane(){

    if(planeEvent.repeatCount == 0){

      console.log("Spawn");
      plane = this.add.sprite(-720, 350, 'plane').setScale(0.2);
      plane.setOrigin(0.5, 0.5);
      spawnPlane = true;
      planeEvent.remove(false);
    }
  }

  checkLanding(user, pole){

    if(user.body.touching.down){

      let date = new Date();

      //let last = pole.getLast(true, true, 'platform');

      // console.log(lastTotalPlatform);

      // if(lastTotalPlatform < initTotalPlatform){
      //
      //   this.addPlatform(last.x);
      // }
      user.anims.play('mouse', true);
      stepSFX.play();

      lastTotalPlatform = platformGroup.getLength();
      user.x = 100;

      userScore = userScore + (platformDiff * scoreData);
      scoreText.text = "" +userScore;

      platformDiff = 0;
      totalPlatform = lastTotalPlatform;

      user.body.gravity.y = 0;
      platformGroup.getChildren().forEach((item) => {

        item.body.velocity.x = 0;
        isJump = false;
        isDead = false;
      })
      userLog.push({

        time: date,
        score: userScore,
      })
    }

    else{

      userScore = userScore + (0 * scoreData);
    }

  }

  gameOver(){

    console.log('Dead');
    let endTime
    let lastScorePanel
    let exitButton
    let userLastScore

    deadSFX.play();
    endTime = new Date();

    platformGroup.getChildren().forEach((item) => {

      item.body.velocity.x = 0;
    })

    lastScorePanel = this.add.sprite(360, 640, 'gameover_dialogbox').setScale(.6);
    lastScorePanel.setOrigin(0.5, 0.5);

    exitButton = this.add.sprite(360, 810, 'exit_button').setScale(0.15);
    exitButton.setOrigin(0.5, 0.5);
    exitButton.setInteractive();

    userLastScore = this.add.text(360, 550, ''+userScore, {
      font: 'bold 62px Arial',
      fill: 'white',
      align: 'center'
    });
    userLastScore.setOrigin(0.5, 0.5);

    exitButton.on('pointerdown', () => {

      this.scene.start("Menu");
      userLastScore.destroy();
      userScore = 0;
    })

    this.postDataOnFinish(endTime, sessionData);
    isJump = false;
  }

  addPlatform(posX){

    if(posX < this.game.config.width * 200){

      placedPlatform += 1;
      platform = this.physics.add.image(posX, Phaser.Math.Between(900, 1200), 'platform').setScale(0.6);
      platform.setImmovable();
      platform.setOrigin(0.5, 0.5);
      platform.body.setAllowGravity(false);
      nextPlatformPos = posX + Phaser.Math.Between(300, 400);
      platformGroup.add(platform);

      this.addPlatform(nextPlatformPos);
    }

  }

  addNewPlatform(){
    var maxPlatformX = 0;

    platformGroup.getChildren().forEach((item) => {

      //console.log('A : '+ item.x);
      //console.log('B : '+ maxPlatformX);
      maxPlatformX = Math.max(item.x, maxPlatformX);
    })
    //console.log('MAX : '+  maxPlatformX);

    nextPlatformPos = maxPlatformX + Phaser.Math.Between(200, 400);
    //console.log(nextPlatformPos);
    this.addPlatform(nextPlatformPos);
  }

  postDataOnFinish(finish, userSession){

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/score/imlek_game/",{
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/score/imlek_game/",{

      method:"PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

        session: userSession,
        linigame_platform_token: "891ff5abb0c27161fb683bcaeb1d73accf1c9c5e",
        game_end: finish,
        score: userScore,
        id: idData,
        log: userLog,
      }),
    }).then(response => response.json()).then(res => {

      let userHighScore = this.add.text(360, 710, ''+res.result.user_highscore, {
        font: 'bold 62px Arial',
        fill: 'white',
        align: 'center'
      });
      userHighScore.setOrigin(0.5, 0.5);
      // }

    }).catch(error => {

      console.log(error);
    });
  }
}
