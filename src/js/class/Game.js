/*
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under The MIT License.
 */

import Enemy from 'src/js/class/Characters/Enemy';
import Player from 'src/js/class/Characters/Player';
import SoundsController from 'src/js/class/SoundsController'
import data from 'src/js/data';
import {randomNumber} from 'src/js/utils';
// import $ from 'jquery';

class Game {
  constructor() {
    this.soundsController = new SoundsController;
    this.player = [];
    this.enemyPool = [];
    this.numberEnemy= 10;
    this.currentEnemy= 0;
    this.paused= false;
    this.volume= 60;
  }
  init() {
    this.soundsController.init();
    this.soundsController.setVolume(this.volume);
    this.initGameControls(); 
    console.log('Game init');
  };

  initGameControls() {
    let self = this;
    $( "#slider" ).slider({
      range: "min",
      min: 0,
      max: 100,
      value: self.volume,
      slide: function( event, ui ) {
        if (!this.paused) {
          self.soundsController.setVolume(ui.value);
        }
        self.volume = ui.value;
      }
    });
    $('#gameControls .fa-pause').on('click', ()=>(this.setPause()));
    $('#gameControls .fa-play').on('click', ()=>(this.setResume()));
    $('#gameControls .fa-music').on('click',(evt)=>{   
      $(evt.target).toggleClass('disable');
      self.soundsController.toggleMuted('musics');
    });
    $('#gameControls .fa-volume-up').on('click', function(){
      $(this).toggleClass('disable');
      self.soundsController.toggleMuted('sounds');
    });
  };

  setPause(){
    let self = this;
    $.each(self.player,function(index,element) {
      element.pausedTimers();
     
    });
    self.paused = true;
    $('#board-paused').toggle();
    self.soundsController.setVolume(0);
    $(this).hide();
      $('#gameControls .fa-play').show();
  };

  setResume(){
    let self = this;
    $.each(self.player, function (index, element) {
      element.resumeTimers();
    });
    this.paused = false;
    $('#board-paused').toggle();
   
    
    self.soundsController.setVolume(self.volume);
    $(this).hide();
      $('#gameControls .fa-pause').show();
  };

  //Demarage du jeu !
  start() {
    //load music
    this.soundsController.playMusic('swamp');

    //createPlayer
    this.player[0] = this.createPlayer(data.players.player1);
    this.player[1] = this.createPlayer(data.players.player2);

    //Generation d'ennemies
    this.createEnemysPool(this.numberEnemy);
    this.enemyPool[this.currentEnemy].generateHtml();
    this.enemyPool[this.currentEnemy].setAutoAttack();
  }

  enemyManager() {
    if (this.enemyPool[this.currentEnemy].life <= 0) {
      this.currentEnemy++;
      if (this.currentEnemy === this.enemyPool.length) {
        this.win();

      } else {
        this.enemyPool[this.currentEnemy].generateHtml();
        this.enemyPool[this.currentEnemy].setAutoAttack();
      }
    }
  }

  playerManager() {

    if (this.player[0].isDie && this.player[1].isDie) {
      this.gameOver();
    }
  }

  combatManager(attacker,handWeapon) {

    switch (attacker) {
      case 'player1':
        this.player[0].attack(this.enemyPool[this.currentEnemy],handWeapon);
        break;
      case 'player2':
        this.player[1].attack(this.enemyPool[this.currentEnemy],handWeapon);
        break;
      case 'enemy1':
        //attaque au hasard un joueur
        var randPlayer = randomNumber(0, this.player.length - 1);
        this.enemyPool[this.currentEnemy].attack(this.player[randPlayer],handWeapon);
        break;
    }
  }

  //Fonction pour crée le joueur basé sur le Prototype Character -> player
  createPlayer(obj) {
    const player = new Player(obj);
    player.generateHtml();
    return player;
  }

  //Fonction pour crée un enemie  basé sur le Prototype Character -> Enemy
  createEnemy(obj) {
    const enemy = new Enemy(obj);
    return enemy;
  }

  //Permet de definir le nombre d'ennemies en lice
  createEnemysPool(numberToAdd) {

    for (let index = 0; index < numberToAdd; index++) {
      var randNumber = randomNumber(1, 100);
      if (randNumber >= 50) {
        //Create goblins
        switch (randomNumber(1, 3)) {
          case 1:
            this.enemyPool.push(this.createEnemy(data.enemys.goblinShaman));
            break;
          case 2:
            this.enemyPool.push(this.createEnemy(data.enemys.goblin));
            break;
          case 3:
            this.enemyPool.push(this.createEnemy(data.enemys.goblinArcher));
            break;
        }
      } else if (randNumber >= 25) {
        switch (randomNumber(1, 2)) {
          case 1:
            this.enemyPool.push(this.createEnemy(data.enemys.lizardMan));
            break;
          case 2:
            this.enemyPool.push(this.createEnemy(data.enemys.orcShaman));
            break;
        }
      } else {
        switch (randomNumber(1, 2)) {
          case 1:
            this.enemyPool.push(this.createEnemy(data.enemys.orcWarrior));
            break;
          case 2:
            this.enemyPool.push(this.createEnemy(data.enemys.lizardWarrior));
            break;
        }
      }
    }
    switch (randomNumber(1, 2)) {
      case 1:
        this.enemyPool.push(this.createEnemy(data.enemys.trollGiant));
        break;
      case 2:
        this.enemyPool.push(this.createEnemy(data.enemys.swampElder));
        break;
    }
  };

  win() {
    this.enemyPool[this.currentEnemy].clearAutoAttack();
    delete this.enemyPool;
    delete this.player;
    $('#playerSection').remove();
    $('<h2>').text('You win').appendTo('#enemySection');
    console.log('You win');
  };

  gameOver() {
    this.enemyPool[this.currentEnemy].clearAutoAttack();
    delete this.enemyPool;
    delete this.player;
    $('#enemySection').remove();
    $('<h2>').text('gameOver').appendTo('#playerSection');
    console.log('gameOver');
  };

};

export default Game;