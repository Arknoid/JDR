/**
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under The MIT License.
 */


const app = {

  player: [],
  enemyPool: [],
  numberEnemy: 10,
  currentEnemy: 0,
  paused : false,
  volume : 60,

  init: function() {
    soundsController.init();
    soundsController.setVolume(app.volume);
    app.initGameControls();
  },

  initGameControls : function() {
    $( "#slider" ).slider({
      range: "min",
      min: 0,
      max: 100,
      value: app.volume,
      slide: function( event, ui ) {
        if (!app.paused) {
          soundsController.setVolume(ui.value);
        }
        app.volume = ui.value;
      }
    });
    $('#gameControls .fa-pause').on('click', app.setPause);
    $('#gameControls .fa-play').on('click', app.setResume);
    $('#gameControls .fa-music').on('click', function(){
      $(this).toggleClass('disable');
      soundsController.toggleMuted('musics');
    });
    $('#gameControls .fa-volume-up').on('click', function(){
      $(this).toggleClass('disable');
      soundsController.toggleMuted('sounds');
    });
  },

  setPause : function(){
    $.each(app.player,function(index,element) {
      element.pausedTimers();
     
    });
    app.paused = true;
    $('#board-paused').toggle();
    soundsController.setVolume(0);
    $(this).hide();
      $('#gameControls .fa-play').show();
  },

  setResume : function(){
    $.each(app.player, function (index, element) {
      element.resumeTimers();
    });
    app.paused = false;
    $('#board-paused').toggle();
    soundsController.setVolume(app.volume);
    $(this).hide();
      $('#gameControls .fa-pause').show();
  },

  //Demarage du jeu !
  start: function() {
    //load music
    soundsController.playMusic('swamp');

    //createPlayer
    app.player[0] = app.createPlayer(data.players.player1);
    app.player[1] = app.createPlayer(data.players.player2);

    //Generation d'ennemies
    app.createEnemysPool(app.numberEnemy);
    app.enemyPool[app.currentEnemy].generateHtml();
    app.enemyPool[app.currentEnemy].setAutoAttack();
  },

  //Generateur de nombres aleatoire arondie
  randomNumber: function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },


  enemyManager: function() {
    if (app.enemyPool[app.currentEnemy].life <= 0) {
      app.currentEnemy++;
      if (app.currentEnemy === app.enemyPool.length) {
        app.win();

      } else {
        app.enemyPool[app.currentEnemy].generateHtml();
        app.enemyPool[app.currentEnemy].setAutoAttack();
      }
    }
  },

  playerManager: function() {

    if (app.player[0].isDie && app.player[1].isDie) {
      app.gameOver();
    }
  },

  combatManager: function(attacker) {

    switch (attacker) {
      case 'player1':
        app.player[0].attack(app.enemyPool[app.currentEnemy]);
        break;
      case 'player2':
        app.player[1].attack(app.enemyPool[app.currentEnemy]);
        break;
      case 'enemy1':
        //attaque au hasard un joueur
        var randPlayer = app.randomNumber(0, app.player.length - 1);
        app.enemyPool[app.currentEnemy].attack(app.player[randPlayer]);
        break;
    }
  },

  //Fonction pour crée le joueur basé sur le Prototype Character -> player
  createPlayer: function(obj) {
    const player = new Player(obj);
    player.generateHtml();
    return player;
  },

  //Fonction pour crée un enemie  basé sur le Prototype Character -> Enemy
  createEnemy: function(obj) {
    const enemy = new Enemy(obj);
    return enemy;
  },

  //Permet de definir le nombre d'ennemies en lice
  createEnemysPool: function(numberToAdd) {

    for (let index = 0; index < numberToAdd; index++) {
      var randNumber = app.randomNumber(1, 100);
      if (randNumber >= 50) {
        //Create goblins
        switch (app.randomNumber(1, 3)) {
          case 1:
            app.enemyPool.push(app.createEnemy(data.enemys.goblinShaman));
            break;
          case 2:
            app.enemyPool.push(app.createEnemy(data.enemys.goblin));
            break;
          case 3:
            app.enemyPool.push(app.createEnemy(data.enemys.goblinArcher));
            break;
        }
      } else if (randNumber >= 25) {
        switch (app.randomNumber(1, 2)) {
          case 1:
            app.enemyPool.push(app.createEnemy(data.enemys.lizardMan));
            break;
          case 2:
            app.enemyPool.push(app.createEnemy(data.enemys.orcShaman));
            break;
        }
      } else {
        switch (app.randomNumber(1, 2)) {
          case 1:
            app.enemyPool.push(app.createEnemy(data.enemys.orcWarrior));
            break;
          case 2:
            app.enemyPool.push(app.createEnemy(data.enemys.lizardWarrior));
            break;
        }
      }
    }
    switch (app.randomNumber(1, 2)) {
      case 1:
        app.enemyPool.push(app.createEnemy(data.enemys.trollGiant));
        break;
      case 2:
        app.enemyPool.push(app.createEnemy(data.enemys.swampElder));
        break;
    }
  },

  win: function() {
    app.enemyPool[app.currentEnemy].clearAutoAttack();
    delete app.enemyPool;
    delete app.player;
    $('#playerSection').remove();
    $('<h2>').text('You win').appendTo('#enemySection');
    console.log('You win');
  },

  gameOver: function() {
    app.enemyPool[app.currentEnemy].clearAutoAttack();
    delete app.enemyPool;
    delete app.player;
    $('#enemySection').remove();
    $('<h2>').text('gameOver').appendTo('#playerSection');
    console.log('gameOver');
  },
};

$(app.init);
