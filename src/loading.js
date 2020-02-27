import Phaser from "phaser";

var progressBar;
var progressBox;
var background_loading;
var title_loading;
var tapSign;

export class Loading extends Phaser.Scene{

  constructor(){
    super({
      key: 'Loading',
    });
  }

  preload(){
    //this.load.image('loading-background', "./src/assets/background-loading.jpg");
    this.cameras.main.setBackgroundColor('#890720');

    this.load.image('background_menu', './src/assets/background_menu.png');
    this.load.image('game_title', './src/assets/game_title.png');
    this.load.image('loading_title', './src/assets/loading_title.png');
    this.load.image('logo', './src/assets/logo.png');
    this.load.image('close_button', './src/assets/close_button.png');
    this.load.image('play_button', './src/assets/play_button.png');
    this.load.image('instruction_button', './src/assets/instruction_button.png');
    this.load.image('leaderboard_button', './src/assets/leaderboard_button.png');
    this.load.image('tnc_button', './src/assets/tnc_button.png');
    this.load.image('sound_on_button', './src/assets/sound_on_button.png');
    this.load.image('sound_off_button', './src/assets/sound_off_button.png');
    this.load.image('agree_button', './src/assets/agree_button.png');
    this.load.image('disagree_button', './src/assets/disagree_button.png');
    this.load.image('next_button', './src/assets/next_button.png');
    this.load.image('prev_button', './src/assets/previous_button.png');
    this.load.image('tnc_panel', './src/assets/tnc_panel.png');
    this.load.image('leaderboard_panel', './src/assets/leaderboard_panel.png');
    this.load.image('instruction_panel', './src/assets/instruction_panel.png');
    this.load.image('score_box', './src/assets/score_box.png');

    this.load.image('confirm_5_poin_dialogbox', './src/assets/confirm_5_poin.png');
    this.load.image('confirm_10_poin_dialogbox', './src/assets/confirm_10_poin.png');
    this.load.image('confirm_20_poin_dialogbox', './src/assets/confirm_20_poin.png');
    this.load.image('confirm_50_poin_dialogbox', './src/assets/confirm_50_poin.png');
    this.load.image('confirm_100_poin_dialogbox', './src/assets/confirm_100_poin.png');
    this.load.image('confirm_200_poin_dialogbox', './src/assets/confirm_200_poin.png');
    this.load.image('no_poin_warn_dialogbox', './src/assets/no_poin_warn.png');
    this.load.image('day_limit_warn_dialogbox', './src/assets/day_limit_warn.png');
    this.load.image('system_error', './src/assets/system_error.png');
    this.load.image('email_verify', './src/assets/email_verify.png');
    this.load.image('life', './src/assets/lives.png');

    this.load.image('rail', './src/assets/rail.png');
    this.load.image('train', './src/assets/train.png');
    this.load.image('platform', './src/assets/platform.png');
    this.load.image('powerbar', './src/assets/powerbar.png');
    this.load.image('background_game', './src/assets/background_game.png');
    this.load.image('chinatown', './src/assets/chinatown.png');
    this.load.image('gameover_dialogbox', './src/assets/gameover.png');
    this.load.image('exit_button', './src/assets/exit_button.png');
    this.load.image('road', './src/assets/road.png');
    this.load.image('bush', './src/assets/bush.png');
    // this.load.spritesheet('player', './src/assets/player.png', {
    //
    //   frameWidth: 777,
    //   frameHeight: 777,
    // });
    this.load.image('player', './src/assets/player.png');
    this.load.spritesheet('tap_sign', "./src/assets/tap_to_start.png", {
      frameWidth: 974,
      frameHeight: 210
    });

    this.load.audio('music_menu', "./src/assets/Audio/music.mp3");
    this.load.audio('jump', "./src/assets/Audio/jump.mp3");
    this.load.audio('step', "./src/assets/Audio/step.mp3");
    this.load.audio('button_click', "./src/assets/Audio/button_click.mp3");
    this.load.audio('close_click', "./src/assets/Audio/close_click.mp3");
    this.load.audio('dead', "./src/assets/Audio/dead.mp3");

    progressBar = this.add.graphics();
    progressBox = this.add.graphics();
    progressBox.fillStyle(0xffffff, 0.8);
    progressBox.fillRect(200, 640, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '36px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
    x: width / 2,
    y: height / 2 + 80,
    text: '0%',
    style: {
        font: '36px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 100,
    text: '',
    style: {
        font: '30px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      progressBar.clear();

      percentText.setText(parseInt(value * 100) + '%');
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(210, 650, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {

    });

    this.load.on('complete', () => {
      // this.sound.play('music_menu');
      loadingText.destroy();
      progressBox.setDepth(1);
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(210, 650, 300, 30).setDepth(1);

      var title_loading = this.add.sprite(370, 350, 'loading_title').setScale(.7);
      title_loading.setOrigin(0.5, 0.5);

      // this.sound.on('decoded',  ()=> {
      //   console.log('AUDIO BERHASIL DI LOAD CUX');
      // });
    });
  }

  create(){

    var tapSign = this.add.sprite(360, 900, 'tap_sign').setScale(.6);
    //var ad = this.add.sprite(360, 1150, 'ad_logo').setScale(0.25)
    //ad.setOrigin(0.5, 0.5);

    this.anims.create({
      key: 'blink',
      frames: this.anims.generateFrameNumbers('tap_sign', {
        start: 0,
        end: 1
      }),
      frameRate: 3,
      repeat: -1
    });

    tapSign.anims.play('blink', true);

    this.input.on("pointerdown", () => {

      this.scene.start("Menu");
    })
  }

}
