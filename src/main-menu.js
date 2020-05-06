import Phaser from "phaser";

var playButton;
var instructionButton;
var leaderboardButton;
var tncButton;
var payPoinButton;
var watchAdButton;
var soundButton;
var closeButton;
var preload;
var listButton = []

// var userPlayCount;
// var userStatus;
// var poinGame;
// var playLimit;
// var dailyLimit;
// var liniPoin;
var championData = {}
var userEmail;
var userDOB;
var userGender;
var userPhone;

var videoTimer;
var advideoTimer;
var videoTimerText;
var videoTimerEvent

let userHighScoreRankText;
let userHighScoreText;
let userCumHighScoreRankText;
let userCumHighScoreText;

var musicStatus;
var bgSound;
var soundClick;
var closeClick;

var urlParams = new URLSearchParams(window.location.search);
var userSession = urlParams.get('session');
var CryptoJS = require('crypto-js');

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

    var linipoin_logo = this.add.sprite(360, 70, 'logo').setScale(0.08);
    linipoin_logo.setOrigin(0.5, 0.5);

    // var light = this.add.sprite(360, 80, 'light_ornament').setScale(2.0);
    // light.setOrigin(0.5, 0.5);

    instructionButton = this.add.sprite(220, 790, 'instruction_button').setScale(0.2);
    instructionButton.setOrigin(0.5, 0.5);
    instructionButton.on('pointerdown', () => this.showInstruction());

    leaderboardButton = this.add.sprite(instructionButton.x, instructionButton.y + 85, 'leaderboard_button').setScale(0.2);
    leaderboardButton.setOrigin(0.5, 0.5);
    leaderboardButton.on('pointerdown', () => this.showLeaderboard());

    tncButton = this.add.sprite(instructionButton.x + 275, instructionButton.y, 'tnc_button').setScale(0.2);
    tncButton.setOrigin(0.5, 0.5);
    tncButton.on('pointerdown', () => this.showTnC());

    if(musicStatus == true){

      bgSound.play();
      soundButton = this.add.sprite(tncButton.x + 2, leaderboardButton.y, 'sound_on_button').setScale(0.2);
      soundButton.setOrigin(0.5, 0.5);
    }
    else {

      bgSound.resume();
      soundButton = this.add.sprite(tncButton.x + 2, leaderboardButton.y, 'sound_off_button').setScale(0.2);
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

  activateMainButton(buttonList){

    buttonList.forEach(button => {
      button.setInteractive()
    })
  }

  deactivateMainButton(buttonList){

    buttonList.forEach(button => {
      button.disableInteractive()
    })
  }

  playGame(){

    soundClick.play();

    if(championData.isHeWorth == true){

      this.showWarningBox('day_limit_warn_dialogbox', 0.3);
    }
    else {

      let startTime;
      playButton.disableInteractive();

      startTime = new Date();
      this.postDataOnStart(startTime, userSession, false);
    }
  }

  drawLife(){

    let startPos = 290;

    if(championData.freeWarmingUp != 0){

      for(let i = 1; i <= championData.freeWarmingUp; i++){

        if(i == 1){

          startPos -= 0;
        }
        else {

          startPos += 70;
        }

        let lifeRemaining = this.add.sprite(startPos, 700, 'life').setScale(.2);
        lifeRemaining.setOrigin(0.5, 0.5);
      }

      playButton = this.add.sprite(360, 520, 'play_button').setScale(0.15);
      playButton.setOrigin(0.5, 0.5);
      playButton.on('pointerdown', () => this.playGame());
    }

    else {

      if (championData.isHeWorth === false) {

        this.showPayOption(10);
      }
    }
  }

  showPayOption(poinRequired){

    payPoinButton = this.add.sprite(220, 550, 'pay_'+poinRequired+'_button').setScale(0.26)
    payPoinButton.setOrigin(0.5, 0.5);
    //payPoinButton.setInteractive();
    payPoinButton.on('pointerdown', () => {

      if (championData.goldPouch < poinRequired) {
        this.showWarningBox('no_poin_warn_dialogbox', 0.3);
      }
      else {
        this.showUserConfirmation('confirm_'+poinRequired+'_poin_dialogbox', 0.3);
      }
    })

    watchAdButton = this.add.sprite(500, payPoinButton.y, 'watch_ad_button').setScale(0.26);
    watchAdButton.setOrigin(0.5, 0.5);
    //watchAdButton.setInteractive();
    watchAdButton.on('pointerdown', () => {

      let adLoadingPanel
      let timeStart

      timeStart = new Date()

      adLoadingPanel = this.add.sprite(360, 640, 'ad_loading_panel').setScale(0.5)
      adLoadingPanel.setOrigin(0.5, 0.5);
      this.preloadAnimation(360, 680, 0.7, 8, 'preloader_game');

      this.getConnectionStatus();
      this.getAdSource(timeStart);
    })
  }

  showUserConfirmation(panel, size){

    this.deactivateMainButton(listButton);

    var confirmPanel = this.add.sprite(360, 640, panel).setScale(size);
    confirmPanel.setOrigin(0.5, 0.5);

    var agreeButton = this.add.sprite(220, 840, 'agree_button').setScale(0.15);
    agreeButton.setOrigin(0.5, 0.5);
    agreeButton.setInteractive();
    agreeButton.on('pointerdown', () => {

      let timeStart;

      soundClick.play();
      timeStart = new Date();
      this.preloadAnimation(360, 480, 0.5, 8, 'preloader_game');
      this.postDataOnStart(timeStart, userSession, false);
      agreeButton.disableInteractive();
    });

    var disagreeButton = this.add.sprite(500, 840, 'disagree_button').setScale(0.15);
    disagreeButton.setOrigin(0.5, 0.5);
    disagreeButton.setInteractive();
    disagreeButton.on('pointerdown', () => {

      closeClick.play();
      confirmPanel.destroy();
      agreeButton.destroy();
      disagreeButton.destroy();

      this.activateMainButton(listButton);
    });
  }

  showWarningBox(texture, size){

    this.deactivateMainButton(listButton);
    var noPoinWarnPanel = this.add.sprite(360, 640, texture).setScale(size);
    noPoinWarnPanel.setOrigin(0.5, 0.5);
    //noPoinWarnPanel.setDepth(1);

    var okButton = this.add.sprite(590, 500, 'close_button').setScale(0.16);
    okButton.setOrigin(0.5, 0.5);
    //okButton.setDepth(1);
    okButton.setInteractive();
    okButton.on('pointerdown', () => {

      closeClick.play();
      noPoinWarnPanel.destroy();
      okButton.destroy();
      this.activateMainButton(listButton);
    });
    //console.log("Poin tidak mencukupi");
  }

  showInstruction(){

    this.deactivateMainButton(listButton);
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

    var instructionPanel = this.add.sprite(360, 640, 'instruction_panel').setScale(0.3);
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
      this.activateMainButton(listButton);
    })
  }

  showLeaderboard(){

    let idTextArray = [];
    let scoreTextArray = [];
    let cumIdTextArray = [];
    let cumScoreTextArray = [];
    let startTextPos = 340;
    let startCumTextPos = 685;

    this.deactivateMainButton(listButton);
    soundClick.play();

    var leaderboardPanel = this.add.sprite(360, 660, 'leaderboard_panel').setScale(0.28, 0.27);
    leaderboardPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(leaderboardPanel.x + 225, leaderboardPanel.y - 465, 'close_button').setScale(0.15);
    closeButton.setOrigin(0.5, 0.5);

    this.getLeaderboardList(startTextPos, startCumTextPos, idTextArray, scoreTextArray, cumIdTextArray, cumScoreTextArray, closeButton);
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
      cumIdTextArray.forEach((cumId) => {

        cumId.destroy();
      });
      cumScoreTextArray.forEach((cumScore) => {

        cumScore.destroy();
      });
      // cumIdText.destroy();
      //lastScoreText.destroy();
      userHighScoreRankText.destroy();
      userCumHighScoreRankText.destroy();
      userHighScoreText.destroy();
      userCumHighScoreText.destroy();
      this.activateMainButton(listButton);
    })
  }

  showTnC(){

    this.deactivateMainButton(listButton);
    soundClick.play();
    let allText = [
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
      "        sebanyak 20 poin",
      "        dari LINIPOIN",
      "     - 10 kali per hari, maka",
      "        dikenakan pemotongan",
      "        sebanyak 50 poin",
      "        dari LINIPOIN",
      "     - 20 kali per hari, maka",
      "        dikenakan pemotongan",
      "        sebanyak 100 poin",
      "        dari LINIPOIN",
      "4. Pemenang LINIGAMES Periode",
      "    1 hanya diberikan  kesempatan",
      "    3 kali bermain setiap harinya",
      "5. Pemenang akan diambil",
      "    berdasarkan ketentuan",
      "    sebagai berikut:",
      "     - 3 orang dengan skor tertinggi",
      "          selama periode event",
      "     - 1 orang dengan akumulasi",
      "          skor tertinggi selama",
      "          periode event",
      "6. Pemain LINIGAME diwajibkan",
      "    untuk menggunakan NAMA ASLI",
      "    pada akun LINIPOIN",
      "7. Pemain yang sudah masuk ke",
      "    dalam jajaran high score,",
      "    tidak dapat masuk ke dalam",
      "    jajaran cumulative high score",
      "8. Poin yang didapatkan akan",
      "    langsung masuk ke dalam",
      "    LINIPOIN",
      "9. Pengumuman pemenang akan",
      "    diumumkan pada tanggal",
      "    15 Februari 2020",
      "10. Pemenang diwajibkan",
      "    menyertakan KTP atau kartu",
      "    identitas lainnya untuk",
      "    pengambilan hadiah",
      "11. Pemenang diluar",
      "      JABODETABEK wajib foto",
      "      selfie bersama KTP atau",
      "      kartu identitas lainnya",
      "12. LINIPOIN berhak membatalkan",
      "      seluruh poin dan hadiah jika",
      "      terbukti adanya indikasi",
      "      kecurangan dalam bentuk",
      "      apapun",
      "13. Semua hadiah berasal dan",
      "      ditanggung oleh PIHAK",
      "      LINIPOIN dan PIHAK",
      "      SPONSOR yang bekerja sama",
      "14. Event tidak berlaku untuk",
      "      seluruh karyawan",
      "      SURGE Group.",
      "15. LINIGAMES hanya terdapat",
      "      pada aplikasi android",
      "16. Jika ada pertanyaan lebih",
      "      lanjut silahkan ajukan ke",
      "      ‘Pusat Bantuan’, DM Via",
      "      Instagram @linipoin.id,",
      "      atau email info@linipoin.com",
    ]
    let tncText1 = [
      "1. Kesempatan bermain hanya ",
      "    diberikan gratis sebanyak",
      "    3 (tiga) kali per pengguna",
      "    per hari selama periode event",
      "2. Jika pengguna bermain lebih dari :",
      "    3 kali per hari, maka dikenakan",
      "    pemotongan sebanyak 10 poin",
      "    dari LINIPOIN",
      "3. Poin yang didapatkan akan",
      "    langsung masuk ke dalam",
      "    LINIPOIN",
      "4. LINIPOIN berhak membatalkan",
      "    seluruh poin jika terbukti",
      "    adanya indikasi kecurangan",
      "    dalam bentuk apapun",
      "5. Jika ada pertanyaan lebih lanjut",
      "    silahkan ajukan ke ‘Pusat",
      "    Bantuan’, DM Via Instagram",
      "    @linipoin.id, atau email",
      "    ke info@linipoin.com",
    ];
    // let tncText2 = [
    //   "4. Pemenang LINIGAMES Periode",
    //   "    1 hanya diberikan  kesempatan",
    //   "    3 kali bermain setiap harinya",
    //   "5. Pemenang akan diambil",
    //   "    berdasarkan ketentuan",
    //   "    sebagai berikut:",
    //   "     - 3 orang dengan skor tertinggi",
    //   "          selama periode event",
    //   "     - 1 orang dengan akumulasi",
    //   "          skor tertinggi selama",
    //   "          periode event",
    //   "6. Pemain LINIGAME diwajibkan",
    //   "    untuk menggunakan NAMA ASLI",
    //   "    pada akun LINIPOIN",
    //   "7. Pemain yang sudah masuk ke",
    //   "    dalam jajaran high score,",
    //   "    tidak dapat masuk ke dalam",
    //   "    jajaran cumulative high score",
    //   "8. Poin yang didapatkan akan",
    //   "    langsung masuk ke dalam",
    //   "    LINIPOIN",
    // ];
    // let tncText3 = [
    //   "9. Pengumuman pemenang akan",
    //   "    diumumkan pada tanggal",
    //   "    15 Februari 2020",
    //   "10. Pemenang diwajibkan",
    //   "    menyertakan KTP atau kartu",
    //   "    identitas lainnya untuk",
    //   "    pengambilan hadiah",
    //   "11. Pemenang diluar",
    //   "      JABODETABEK wajib foto",
    //   "      selfie bersama KTP atau",
    //   "      kartu identitas lainnya",
    //   "12. LINIPOIN berhak membatalkan",
    //   "      seluruh poin dan hadiah jika",
    //   "      terbukti adanya indikasi",
    //   "      kecurangan dalam bentuk",
    //   "      apapun",
    //   "13. Semua hadiah berasal dan",
    //   "      ditanggung oleh PIHAK",
    //   "      LINIPOIN dan PIHAK",
    //   "      SPONSOR yang bekerja sama",
    // ];
    // let tncText4 = [
    //   "14. Event tidak berlaku untuk",
    //   "      seluruh karyawan",
    //   "      SURGE Group.",
    //   "15. LINIGAMES hanya terdapat",
    //   "      pada aplikasi android",
    //   "16. Jika ada pertanyaan lebih",
    //   "      lanjut silahkan ajukan ke",
    //   "      ‘Pusat Bantuan’, DM Via",
    //   "      Instagram @linipoin.id,",
    //   "      atau email info@linipoin.com",
    // ];
    //let currentPage = 1;

    var tncPanel = this.add.sprite(360, 640, 'tnc_panel').setScale(0.3);
    tncPanel.setOrigin(0.5, 0.5);

    let graphics = this.make.graphics();

    graphics.fillStyle(0xffffff);
    graphics.fillRect(130, 350, 500, 600);

    let mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
    let textTnC = this.add.text(360, 340, tncText1, {
      font: '26px Arial',
      color: 'black',
      align: 'left',
      wordWrap: {
        width: 500
      }
    }).setOrigin(0.5, 0);
    textTnC.setMask(mask);

    let zone = this.add.zone(130, 350, 700, 800).setOrigin(0).setInteractive();

    zone.on('pointermove', function (pointer) {

        if (pointer.isDown){

          textTnC.y += (pointer.velocity.y / 7);

          textTnC.y = Phaser.Math.Clamp(textTnC.y, 220, 350);
        }
    });

    // var nextButton = this.add.sprite(430,1000, 'next_button').setScale(0.2);
    // nextButton.setOrigin(0.5, 0.5);
    // nextButton.setInteractive();
    // nextButton.on('pointerdown', () => {
    //
    //   if(currentPage == 1){
    //
    //     textTnC.text = tncText2;
    //     currentPage += 1;
    //   }
    //   else if (currentPage == 2) {
    //
    //     textTnC.text = tncText3;
    //     currentPage += 1;
    //   }
    //   else if (currentPage == 3) {
    //
    //     textTnC.text = tncText4;
    //     currentPage += 1;
    //   }
    //   else {
    //
    //     currentPage += 0
    //   }
    //
    // })

    // var prevButton = this.add.sprite(280,1000, 'prev_button').setScale(0.19);
    // prevButton.setOrigin(0.5, 0.5);
    // prevButton.setInteractive();
    // prevButton.on('pointerdown', () => {
    //
    //   if(currentPage == 4){
    //
    //     textTnC.text = tncText3;
    //     currentPage -= 1;
    //   }
    //   else if (currentPage == 3) {
    //
    //     textTnC.text = tncText2;
    //     currentPage -= 1;
    //   }
    //   else if (currentPage == 2) {
    //
    //     textTnC.text = tncText1;
    //     currentPage -= 1;
    //   }
    //   else {
    //
    //     currentPage -= 0
    //   }
    //
    // })

    closeButton = this.add.sprite(tncPanel.x + 235, tncPanel.y - 380, 'close_button').setScale(0.15);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();

    closeButton.on('pointerdown',() => {

      closeClick.play();
      textTnC.destroy();
      graphics.destroy();
      mask.destroy();
      zone.destroy();
      tncPanel.destroy();
      //nextButton.destroy();
      //prevButton.destroy();
      closeButton.destroy();
      this.activateMainButton(listButton);
    })
  }

  toggleSound(){

    soundClick.play();
    if(musicStatus == true){
      musicStatus = false;
      soundButton.setTexture('sound_off_button');
      soundButton.setScale(0.2);
      bgSound.pause();
    }
    else {
      musicStatus = true;
      soundButton.setTexture('sound_on_button');
      soundButton.setScale(0.2);
      bgSound.resume();
    }
  }

  preloadAnimation(xPos, yPos, size, maxFrame, assetKey){

    preload = this.add.sprite(xPos, yPos, assetKey).setOrigin(0.5 ,0.5);
    preload.setScale(size);
    preload.setDepth(1);

    this.anims.create({
      key: assetKey,
      frames: this.anims.generateFrameNumbers(assetKey, {
        start: 1,
        end: maxFrame
      }),
      frameRate: 20,
      repeat: -1
    });

    preload.anims.play(assetKey, true);
  }

  getDataOfUser(){

    this.preloadAnimation(360, 580, 0.8, 20, 'preloader_menu')

    let final = {

      datas: CryptoJS.AES.encrypt(JSON.stringify({
        session: userSession,
        linigame_platform_token: '891ff5abb0c27161fb683bcaeb1d73accf1c9c5e'
      }), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    }

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/check_user_limit/", {
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/check_user_limit/", {
    //fetch("https://9a94bd0b.ngrok.io/api/v1.0/leaderboard/check_user_limit/", {

      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(final)

    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);

      let phoneNumber = data.result.phone_number;
      userPhone = '0' + phoneNumber.substring(3);
      userEmail = data.result.email;
      userDOB = data.result.dob;

      if(data.result.gender === 'm'){
        userGender = 'male'
      }
      else {
        userGender = 'female'
      }

      if(data.result.isEmailVerif === false){

        let emailPanel = this.add.sprite(360, 640, 'email_verify').setScale(0.23);
        emailPanel.setOrigin(0.5, 0.5);
        preload.destroy()
      }
      else {

        championData.canDoThisAllDay = data.result.play_count
        championData.stageRule = data.result.gamePoin
        championData.isHeWorth = data.result.blocked
        championData.freeWarmingUp = data.result.lifePlay
        championData.goldPouch = data.result.userPoin
        //userPlayCount = data.result.play_count;
        //userStatus = data.result.blocked
        //poinGame = data.result.gamePoin;
        //playLimit = data.result.lifePlay;
        //dailyLimit = data.result.isLimit;
        //liniPoin = data.result.userPoin;


        preload.destroy();
        this.drawLife();

        if(data.result.lifePlay != 0){
          listButton = [playButton, instructionButton, leaderboardButton, tncButton, soundButton]
        }
        else {
          listButton = [payPoinButton, watchAdButton, instructionButton, leaderboardButton, tncButton, soundButton]
          //console.log(listButton);
        }
        this.activateMainButton(listButton);
      }

    }).catch(error => {

      //console.log(error);
      var errorPanel = this.add.sprite(360, 640, 'system_error').setScale(0.3);
      errorPanel.setOrigin(0.5, 0.5);
      preload.destroy();
    });
  }

  postDataOnStart(start, sessionUser, isWatchAd){

    let dataID;
    let requestID = CryptoJS.AES.encrypt('LG'+'+891ff5abb0c27161fb683bcaeb1d73accf1c9c5e+'+Date.now(), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    let final
    let data = {
      linigame_platform_token: '891ff5abb0c27161fb683bcaeb1d73accf1c9c5e',
      session: sessionUser,
      game_start: start,
      score: 0,
      user_highscore: 0,
      total_score: 0,
    }

    if (isWatchAd === true){
      data.play_video = 'full_played'
      final = {
        datas: CryptoJS.AES.encrypt(JSON.stringify(data), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
      }
    }
    else {
      data.play_video = 'not_played'
      final = {
        datas: CryptoJS.AES.encrypt(JSON.stringify(data), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
      }
    }

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/imlek_game/",{
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/imlek_game/",{
    //fetch("https://9a94bd0b.ngrok.io/api/v1.0/leaderboard/imlek_game/",{

      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'request-id': requestID
      },
      body: JSON.stringify(final),
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(res => {

      dataID = res.result.id;
      if(res.result.id >= 0){

        this.scene.start("PlayGame", {
          session: sessionUser,
          id: dataID,
          score: championData.stageRule,
          soundStatus: musicStatus,
        });
      }

    }).catch(error => {

      //console.log(error);
    });
  }

  getLeaderboardList(startPos, startCumPos, idTextArr, scoreTextArr, cumIdTextArr, scoreCumTextArr, button){

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e", {

      method: "GET",
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);
      if(data.result.highscore_leaderboard.length >= 0 && data.result.totalscore_leaderboard.length >= 0){

        button.setInteractive();
        //preload.destroy();
      }

      for(let i=0; i < data.result.highscore_leaderboard.length; i++){

        let shortname1 = '';
        let name1 = data.result.highscore_leaderboard[i]["user.name"] !== null ? data.result.highscore_leaderboard[i]["user.name"]: 'No Name';

        if (i == 0){

          startPos += 0;
        }
        else{

          startPos += 48;
        }

        if(name1.length > 16){

          shortname1 = name1.substring(0, 16)+"...";
        }
        else{
          shortname1 = name1;
        }

        idTextArr[i] = this.add.text(235, startPos, ''+shortname1, {
          font: 'bold 20px Arial',
          fill: 'black',
          align: 'left'
        });
        idTextArr[i].setOrigin(0, 0.5);

        scoreTextArr[i] = this.add.text(520, startPos, ''+data.result.highscore_leaderboard[i].user_highscore, {
          font: 'bold 26px Arial',
          fill: 'black',
          align: 'right'
        });
        scoreTextArr[i].setOrigin(1, 0.5);
      }

      for(let i=0; i < data.result.totalscore_leaderboard.length; i++){

        let shortname2 = '';
        let name2 = data.result.totalscore_leaderboard[i]["user.name"] !== null ? data.result.totalscore_leaderboard[i]["user.name"]: 'No Name';

        if (i == 0){

          startCumPos += 0;
        }
        else{

          startCumPos += 48;
        }

        if(name2.length > 16){

          shortname2 = name2.substring(0, 16)+"...";
        }
        else{

          shortname2 = name2;
        }

        cumIdTextArr[i] = this.add.text(235, startCumPos, ''+shortname2, {
          font: 'bold 20px Arial',
          fill: 'black',
          align: 'left'
        });
        cumIdTextArr[i].setOrigin(0, 0.5);

        scoreCumTextArr[i] = this.add.text(520, startCumPos, ''+data.result.totalscore_leaderboard[i].total_score, {
          font: 'bold 24px Arial',
          fill: 'black',
          align: 'right'
        });
        scoreCumTextArr[i].setOrigin(1, 0.5);
      }

    }).catch(error => {

      //console.log(error.result);
    });
  }

  getUserRank(button){

    this.preloadAnimation(360, 690, 0.8, 20, 'preloader_menu');

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/get_user_rank_imlek/?session="+userSession+"&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e&limit=5", {
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/get_user_rank_imlek/?session="+userSession+"&linigame_platform_token=891ff5abb0c27161fb683bcaeb1d73accf1c9c5e&limit=5", {

      method:"GET",
    }).then(response => {

      return response.json();
    }).then(data => {

      //console.log(data.result);
      // if(data.result.rank_high_score >= 0 || data.result.rank_total_score >= 0){
      //
      //   button.setInteractive();
      // }

      if(data.result.rank_high_score === 0){

        userHighScoreRankText = this.add.text(195, 1030, '-', {
          font: 'bold 32px Arial',
          fill: 'black'
        });
        userHighScoreRankText.setOrigin(0, 0.5);

        userHighScoreText = this.add.text(520, 1030, '0', {
          font: 'bold 22px Arial',
          fill: 'black',
          align: 'right'
        });
        userHighScoreText.setOrigin(1, 0.5);
      }

      else{

        userHighScoreRankText = this.add.text(190, 1030, '# '+data.result.rank_high_score.ranking, {
          font: 'bold 19px Arial',
          fill: 'black',
          align: 'left'
        });
        userHighScoreRankText.setOrigin(0, 0.5);

        userHighScoreText = this.add.text(520, 1030, ''+data.result.rank_high_score.user_highscore, {
          font: 'bold 22px Arial',
          fill: 'black',
          align: 'right'
        });
        userHighScoreText.setOrigin(1, 0.5);
      }

      if(data.result.rank_total_score === 0){

        userCumHighScoreRankText = this.add.text(195, 1085, '-', {
          font: 'bold 32px Arial',
          fill: 'black'
        })
        userCumHighScoreRankText.setOrigin(0, 0.5);

        userCumHighScoreText = this.add.text(520, 1085, '0', {
          font: 'bold 22px Arial',
          fill: 'black',
          align: 'right'
        });
        userCumHighScoreText.setOrigin(1, 0.5);
      }

      else {

        userCumHighScoreRankText = this.add.text(190, 1085, '# '+data.result.rank_total_score.ranking, {
          font: 'bold 19px Arial',
          fill: 'black',
          align: 'right'
        })
        userCumHighScoreRankText.setOrigin(0, 0.5);

        userCumHighScoreText = this.add.text(520, 1085, ''+data.result.rank_total_score.total_score, {
          font: 'bold 22px Arial',
          fill: 'black',
          align: 'right'
        });
        userCumHighScoreText.setOrigin(1, 0.5);

      }

      preload.destroy();
      button.setInteractive();
    })
  }

  getAdSource(startTime){

    this.deactivateMainButton(listButton);

    //fetch('https://captive.macroad.co.id/api/v2/linigames/advertisement?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {
    fetch('https://captive-dev.macroad.co.id/api/v2/linigames/advertisement?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {

      method: "GET",
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result);
      let video = document.createElement('video');
      let headerImage = document.createElement('img');
      let adVideo;
      let adHeader;
      let adHeaderImg;

      videoTimer = data.result.duration

      video.src = data.result.main_source;
      video.playsinline = true;
      video.width = 720;
      video.height = 1280;
      video.autoplay = true;

      headerImage.src = data.result.header_source;
      headerImage.width = 300;
      headerImage.height = 70;

      bgSound.stop();

      video.addEventListener('play', (event) => {

        adHeader = this.add.dom(360, 360, 'div', {
          'background-color' : data.result.header_bg_color,
          'width' : '720px',
          'height' : '170px'
        }).setDepth(1);

        advideoTimer = this.add.dom(680, 10, 'p', {
          'font-family' : 'Arial',
          'font-size' : '2.1em',
          //'font-weight' : '',
          'color' : 'white'
        }, '').setDepth(1);

        adHeaderImg = this.add.dom(360, 360, headerImage).setDepth(1);

        adVideo = this.add.dom(360, 640, video, {
          'background-color': 'black'
        });

        videoTimerEvent = this.time.addEvent({
          delay: 1000,
          callback: this.onPlay,
          loop: true
        })

      })

      video.addEventListener('ended', (event) => {

        this.postDataOnStart(startTime, userSession, true);
      })
    }).catch(error => {

      //console.log(error.result);
    })
  }

  getConnectionStatus(){

    //fetch('https://captive.macroad.co.id/api/v2/linigames/advertisement/connect/53?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {
    fetch('https://captive-dev.macroad.co.id/api/v2/linigames/advertisement/connect/53?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {

      method: 'GET',
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result.message);
    }).catch(error => {

      //console.log(error);
    })
  }

  onPlay(){

    videoTimer--
    advideoTimer.setText(videoTimer)

    if(videoTimer === 0){

      advideoTimer.destroy()
      videoTimerEvent.remove(false);
    }
  }
}
