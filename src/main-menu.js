import Phaser from "phaser";

var playButton;
var instructionButton;
var leaderboardButton;
var tncButton;
var soundButton;
var closeButton;

var userPlayCount;
var poinGame;
var playLimit;
var dailyLimit;
var liniPoin;

let userHighScoreRankText;
let userCumHighScoreRankText;
var cumIdText;
var cumScoreText;

var musicStatus;
var bgSound;
var soundClick;
var closeClick;

var urlParams = new URLSearchParams(window.location.search);
var userSession = urlParams.get('session');

export class Menu extends Phaser.Scene {

  constructor() {

    super("Menu");
  }


  preload(){


  }

  create(){

    this.getDataOfUser();

    bgSound = this.sound.add('music_menu');
    bgSound.loop = true;

    soundClick = this.sound.add('button_click');
    closeClick = this.sound.add('close_click');
    musicStatus = true;

    var menuBackground = this.add.sprite(360, 640, 'background_menu').setScale(0.32);
    menuBackground.setOrigin(0.5, 0.5);

    var game_title = this.add.sprite(360, 280, 'game_title').setScale(0.7);
    game_title.setOrigin(0.5, 0.5);

    var light = this.add.sprite(360, 80, 'light_ornament').setScale(2.0);
    light.setOrigin(0.5, 0.5);

    playButton = this.add.sprite(360, 520, 'play_button').setScale(0.15);
    playButton.setOrigin(0.5, 0.5);
    playButton.on('pointerdown', () => this.playGame());

    instructionButton = this.add.sprite(225, playButton.y + 270, 'instruction_button').setScale(0.23);
    instructionButton.setOrigin(0.5, 0.5);
    instructionButton.on('pointerdown', () => this.showInstruction());

    leaderboardButton = this.add.sprite(225, instructionButton.y + 85, 'leaderboard_button').setScale(0.23);
    leaderboardButton.setOrigin(0.5, 0.5);
    leaderboardButton.on('pointerdown', () => this.showLeaderboard());

    tncButton = this.add.sprite(instructionButton.x + 275, instructionButton.y, 'tnc_button').setScale(0.23);
    tncButton.setOrigin(0.5, 0.5);
    tncButton.on('pointerdown', () => this.showTnC());

    if(musicStatus == true){

      bgSound.play();
      soundButton = this.add.sprite(tncButton.x, leaderboardButton.y + 5, 'sound_on_button').setScale(0.23);
      soundButton.setOrigin(0.5, 0.5);
    }
    else {

      bgSound.resume();
      soundButton = this.add.sprite(tncButton.x, leaderboardButton.y + 5, 'sound_off_button').setScale(0.19);
      soundButton.setOrigin(0.5, 0.5);
    }

    this.game.events.on('hidden',function(){

      bgSound.setMute(true);
    },this);

    this.game.events.on('visible', function(){

      bgSound.setMute(false);
    });

    soundButton.on('pointerdown', () => this.toggleSound());
  }

  update(){


  }


  activateMainButton(){

    playButton.setInteractive();
    instructionButton.setInteractive();
    leaderboardButton.setInteractive();
    tncButton.setInteractive();
    soundButton.setInteractive();
  }

  deactivateMainButton(){

    playButton.disableInteractive();
    instructionButton.disableInteractive();
    leaderboardButton.disableInteractive();
    tncButton.disableInteractive();
    soundButton.disableInteractive();
  }

  playGame(){

    var confirmPanel;
    soundClick.play();

    if(playLimit == 0 && dailyLimit == false){

      if(userPlayCount >= 3 && userPlayCount < 10){

        if (liniPoin < 5) {

          this.showWarningBox();
        }
        else {

          confirmPanel = this.add.sprite(360, 640, 'confirm_5_poin_dialogbox').setScale(0.35);
          confirmPanel.setOrigin(0.5, 0.5);

          this.showUserConfirmation(confirmPanel);
        }
      }

      // else if(userPlayCount >= 200){
      //
      //   if (liniPoin < 10) {
      //
      //     this.showWarningBox();
      //   }
      //   else {
      //
      //     confirmPanel = this.add.sprite(360, 640, 'confirm_200_poin_dialogbox').setScale(0.75);
      //     confirmPanel.setOrigin(0.5, 0.5);
      //
      //     this.showUserConfirmation(confirmPanel);
      //   }
      // }

      else{

        if (liniPoin < 10) {

          this.showWarningBox();
        }
        else {

          confirmPanel = this.add.sprite(360, 640, 'confirm_10_poin_dialogbox').setScale(0.75);
          confirmPanel.setOrigin(0.5, 0.5);

          this.showUserConfirmation(confirmPanel);
        }
      }

    }
    else if(dailyLimit == true){

      // limitWarnPanel = this.add.sprite(360, 640, 'limit-warn-panel').setScale(.7);
      // limitWarnPanel.setOrigin(0.5, 0.5);
      // okButton = this.add.sprite(580, 510, 'close_button').setScale(.5);
      // okButton.setOrigin(0.5, 0.5);
      // okButton.setInteractive();
      // okButton.on('pointerdown', () => {
      //
      //   closeSFX.play()
      //   limitWarnPanel.destroy();
      //   okButton.destroy();
      //   this.enableMainButton();
      // });
      // console.log("Telah mencapai limit harian");
    }
    else {

      let startTime;
      playButton.disableInteractive();

      startTime = new Date();
      this.postDataOnStart(startTime, userSession);
    }
  }

  showUserConfirmation(panel){

    this.deactivateMainButton();

    var agreeButton = this.add.sprite(250, 800, 'agree_button').setScale(0.12);
    agreeButton.setOrigin(0.5, 0.5);
    agreeButton.setInteractive();
    agreeButton.on('pointerdown', () => {

      let timeStart;

      soundClick.play();
      timeStart = new Date();
      this.postDataOnStart(timeStart, userSession);
      agreeButton.disableInteractive();
    });

    var disagreeButton = this.add.sprite(470, 800, 'disagree_button').setScale(0.12);
    disagreeButton.setOrigin(0.5, 0.5);
    disagreeButton.setInteractive();
    disagreeButton.on('pointerdown', () => {

      closeClick.play();
      panel.destroy();
      agreeButton.destroy();
      disagreeButton.destroy();

      this.activateMainButton();
    });
  }

  showWarningBox(){

    this.deactivateMainButton();
    var noPoinWarnPanel = this.add.sprite(360, 640, 'no_poin_warn_dialogbox').setScale(0.75);
    noPoinWarnPanel.setOrigin(0.5, 0.5);

    var okButton = this.add.sprite(570, 520, 'close_button').setScale(0.16);
    okButton.setOrigin(0.5, 0.5);
    okButton.setInteractive();
    okButton.on('pointerdown', () => {

      closeClick.play();
      noPoinWarnPanel.destroy();
      okButton.destroy();
      this.activateMainButton();
    });
    console.log("Poin tidak mencukupi");
  }

  showInstruction(){

    this.deactivateMainButton();
    soundClick.play();

    let instruction1;
    let hint1 = [
      "Tekan dan tahan untuk mengatur,",
      " kekuatan lompatan kemudian",
      " lepaskan untuk membuat karakter",
      " berpindah dari tiang satu",
      " ke tiang lainnya",
    ];
    let instruction2;
    let hint2 = [
      "Apabila berhasil berpindah dari",
      " satu tiang ke tiang lainnya,",
      " user akan mendapatkan",
      " tambahan 2 poin untuk setiap",
      " tiang yang telah dilewati",
    ];

    var instructionPanel = this.add.sprite(360, 640, 'instruction_panel').setScale(0.65);
    instructionPanel.setOrigin(0.5, 0.5);

    instruction1 = this.add.text(360,470, hint1, {
      font: 'bold 24px Arial',
      fill: 'black',
      align: 'center',
    });
    instruction1.setOrigin(0.5, 0.5);

    instruction2 = this.add.text(360,810, hint2, {
      font: 'bold 24px Arial',
      fill: 'black',
      align: 'center',
    });
    instruction2.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(instructionPanel.x + 245, instructionPanel.y - 390, 'close_button').setScale(0.15);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();

    closeButton.on('pointerdown',() => {

      closeClick.play();
      instructionPanel.destroy();
      instruction1.destroy();
      instruction2.destroy();
      closeButton.destroy();
      this.activateMainButton();
    })
  }

  showLeaderboard(){

    let idTextArray = [];
    let scoreTextArray = [];
    let startTextPos = 405;

    this.deactivateMainButton();
    soundClick.play();

    var leaderboardPanel = this.add.sprite(360, 640, 'leaderboard_panel').setScale(0.65);
    leaderboardPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(leaderboardPanel.x + 245, leaderboardPanel.y - 390, 'close_button').setScale(0.15);
    closeButton.setOrigin(0.5, 0.5);

    this.getLeaderboardList(startTextPos, idTextArray, scoreTextArray, closeButton);
    this.getUserRank(closeButton);

    closeButton.on('pointerdown', () => {

      closeClick.play();
      leaderboardPanel.destroy();
      closeButton.destroy();

      idTextArray.forEach(idText => {

        idText.destroy();
      })
      scoreTextArray.forEach(scoreText => {

        scoreText.destroy();
      })

      cumIdText.destroy();
      cumScoreText.destroy();
      userHighScoreRankText.destroy();
      userCumHighScoreRankText.destroy();
      this.activateMainButton();
    })
  }

  showTnC(){

    this.deactivateMainButton();
    soundClick.play();
    let tncText = [
      "1. Periode event JUST HOP LAH",
      "    khusus Tahun Baru Imlek akan",
      "    berlangsung pada tanggal",
      "    23 Januari 2020 sampai ",
      "    10 Februari 2020",
      "2. Kesempatan bermain hanya ",
      "    diberikan gratis sebanyak",
      "    3 (tiga) kali per pengguna",
      "    per hari selama periode event",
      "3. Jika pengguna bermain lebih",
      "   dari :",
      "     - 3 kali per hari, maka",
      "        dikenakan pemotongan",
      "        sebanyak 5 poin",
      "        dari LINIPOIN",
      "     - 10 kali per hari, maka",
      "        dikenakan pemotongan",
      "        sebanyak 10 poin",
      "        dari LINIPOIN",
      "4. Pemenang akan diambil",
      "    berdasarkan ketentuan",
      "    sebagai berikut:",
      "     - 3 orang dengan skor tertinggi",
      "        selama periode event",
      "     - 1 orang dengan akumulasi",
      "        skor tertinggi selama",
      "        periode event",
      "5. Pemain yang sudah masuk ke",
      "    dalam jajaran high score,",
      "    tidak dapat masuk ke dalam",
      "    jajaran cummulative high score",
      "6. Poin yang didapatkan akan",
      "    langsung masuk ke dalam",
      "    LINIPOIN",
      "7. Pengumuman pemenang akan",
      "    diumumkan pada tanggal",
      "    15 Februari 2020",
      "8. LINIPOIN berhak membatalkan",
      "    seluruh poin jika terbukti",
      "    adanya indikasi kecurangan",
      "    dalam bentuk apapun",
      "9. Semua hadiah berasal dan",
      "    ditanggung oleh PIHAK",
      "    LINIPOIN dan PIHAK SPONSOR",
      "    yang bekerja sama",
      "10. Event tidak berlaku untuk",
      "    seluruh karyawan",
      "    SURGE Group.",
      "11. LINIGAMES hanya terdapat",
      "      pada aplikasi android",
      "12. Jika ada pertanyaan lebih",
      "      lanjut silahkan ajukan ke",
      "      ‘Pusat Bantuan’, DM Via",
      "      Instagram @linipoin.id,",
      "      atau email ke",
      "      info@linipoin.com",
    ];

    var tncPanel = this.add.sprite(360, 640, 'tnc_panel').setScale(0.65);
    tncPanel.setOrigin(0.5, 0.5);

    let graphics = this.make.graphics();

    graphics.fillStyle(0xffffff);
    graphics.fillRect(130, 350, 500, 580);

    let mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
    let text = this.add.text(170, 350, tncText, {
      font: '26px Arial',
      color: 'black',
      align: 'left',
      wordWrap: {
        width: 500 } }).setOrigin(0);
    text.setMask(mask);

    let zone = this.add.zone(130, 350, 700, 900).setOrigin(0).setInteractive();

    zone.on('pointermove', function (pointer) {

        if (pointer.isDown){

          text.y += (pointer.velocity.y / 6);

          text.y = Phaser.Math.Clamp(text.y, -610, 350);
        }
    });

    closeButton = this.add.sprite(tncPanel.x + 245, tncPanel.y - 390, 'close_button').setScale(0.15);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();

    closeButton.on('pointerdown',() => {

      closeClick.play();
      text.destroy();
      graphics.destroy();
      mask.destroy();
      zone.destroy();
      tncPanel.destroy();
      closeButton.destroy();
      this.activateMainButton();
    })
  }

  toggleSound(){

    soundClick.play();
    if(musicStatus == true){
      musicStatus = false;
      soundButton.setTexture('sound_off_button');
      soundButton.setScale(0.19);
      bgSound.pause();
    }
    else {
      musicStatus = true;
      soundButton.setTexture('sound_on_button');
      soundButton.setScale(0.23);
      bgSound.resume();
    }
  }

  drawLife(){

    let startPos = 290;

    if(playLimit != 0){

      for(let i = 1; i <= playLimit; i++){

        if(i == 1){

          startPos -= 0;
        }
        else {

          startPos += 70;
        }

        let lifeRemaining = this.add.sprite(startPos, 700, 'life').setScale(.2);
        lifeRemaining.setOrigin(0.5, 0.5);
      }
    }
  }

  getDataOfUser(){

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session="+userSession+"&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session="+userSession+"&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {

      method:"GET",

    }).then(response => {

      return response.json();
    }).then(data => {

      if(data.response == 200){

        //console.log(data.result);
        userPlayCount = data.result.play_count;
        poinGame = data.result.gamePoin;
        playLimit = data.result.lifePlay;
        dailyLimit = data.result.isLimit;
        liniPoin = data.result.userPoin;
        this.activateMainButton();
        this.drawLife();
      }

      else {

        var errorPanel = this.add.sprite(360, 640, 'system_error').setScale(.7);
        errorPanel.setOrigin(0.5, 0.5);
      }

    }).catch(error => {

      console.log(error);;
    });
  }

  postDataOnStart(start, sessionUser){

    let dataID;

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/imlek_game/",{
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/imlek_game/",{

      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        linigame_platform_token: '891ff5abb0c27161fb683bcaeb1d73accf1c9c5e',
        session: sessionUser,
        game_start: start,
        score: 0,
        user_highscore: 0,
        total_score: 0,
      }),
    }).then(response => response.json()).then(res => {

      dataID = res.result.id;
      if(res.result.id >= 0){

        this.scene.start("PlayGame", {
          session: sessionUser,
          id: dataID,
          score: poinGame,
          soundStatus: musicStatus,
        });
      }

    }).catch(error => {

      console.log(error);
    });
  }

  getLeaderboardList(startPos, idTextArr, scoreTextArr, button){

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=3&limit_total_score=1&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=3&limit_total_score=1&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {

      method: "GET",
    }).then(response => {

      return response.json();

    }).then(data => {

      if(data.result.highscore_leaderboard.length >= 0 && data.result.totalscore_leaderboard.length >= 0){

        button.setInteractive();
      }

      if(data.result.totalscore_leaderboard.length == 0){

        cumIdText = this.add.text(200, 722, '-', {
          font: 'bold 20px Arial',
          fill: 'black'
        });

        cumScoreText = this.add.text(490, 722, '-', {
          font: 'bold 26px Arial',
          fill: 'black',
          align: 'right'
        });
      }
      else {

        let shortname2 = '';
        let name2 = data.result.totalscore_leaderboard[0]["user.name"] !== null ? data.result.totalscore_leaderboard[0]["user.name"]: 'No Name';

        if(name2.length > 18){

          shortname2 = name2.substring(0, 18)+"...";
        }
        else{

          shortname2 = name2;
        }

        cumIdText = this.add.text(200, 722, ''+shortname2, {
          font: 'bold 20px Arial',
          fill: 'black'
        });

        cumScoreText = this.add.text(500, 722, ''+data.result.totalscore_leaderboard[0].total_score, {
          font: 'bold 26px Arial',
          fill: 'black',
          align: 'right'
        });
      }

      for(let i=0; i<3; i++){

        let shortname1 = '';
        let name1 = data.result.highscore_leaderboard[i]["user.name"] !== null ? data.result.highscore_leaderboard[i]["user.name"]: 'No Name';

        if (i == 0){

          startPos += 0;
        }
        else{

          startPos += 62;
        }

        if(name1.length > 18){

          shortname1 = name1.substring(0, 18)+"...";
        }
        else{
          shortname1 = name1;
        }

        idTextArr[i] = this.add.text(230, startPos, ''+shortname1, {
          font: 'bold 20px Arial',
          fill: 'black'
        });

        scoreTextArr[i] = this.add.text(490, startPos, ''+data.result.highscore_leaderboard[i].user_highscore, {
          font: 'bold 26px Arial',
          fill: 'black',
          align: 'right'
        });
      }

    }).catch(error => {

      console.log(error);
    });
  }

  getUserRank(button){

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/get_user_rank_imlek/?session="+userSession+"&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/get_user_rank_imlek/?session="+userSession+"&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {

      method:"GET",
    }).then(response => {

      return response.json();
    }).then(data => {

      //console.log(data.result);
      if(data.result.rank_high_score >= 0 || data.result.rank_total_score){

        button.setInteractive();
      }

      if(data.result.rank_high_score == 0){

        userHighScoreRankText = this.add.text(490,905, '-', {
          font: 'bold 32px Arial',
          fill: 'black'
        });
      }

      else{

        userHighScoreRankText = this.add.text(490,905, '# '+data.result.rank_high_score.ranking, {
          font: 'bold 32px Arial',
          fill: 'black'
        });
      }

      if(data.result.rank_total_score == 0){

        userCumHighScoreRankText = this.add.text(490, 965, '-', {
          font: 'bold 32px Arial',
          fill: 'black'
        })
      }

      else {

        userCumHighScoreRankText = this.add.text(490, 965, '# '+data.result.rank_total_score.ranking, {
          font: 'bold 32px Arial',
          fill: 'black'
        })
      }
    })
  }
}
