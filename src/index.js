import Phaser from "phaser";
import {In_Game} from "./in-game.js"
import {Menu} from './main-menu.js';
import {Loading} from './loading.js'

window.onload = function(){

  var config = {

    type: Phaser.CANVAS,
    parent: 'game',
    physics:{
      default: 'arcade',
      arcade:{
        //debug: true,
        gravity :{
          y: 0,
        }
      },
    },
    scale:{
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 720,
      height: 1280,
    },
    scene: [Loading, Menu, In_Game],
    audio:{
      disableWebAudio:true,
    }
  };

  var game = new Phaser.Game(config);

  window.focus();
}
