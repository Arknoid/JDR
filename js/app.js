var app = {

  player: [],
  enemyPool: [],
  numberEnemy: 10,
  currentEnemy: 0,

  init: function() {
    app.start();
  },
  //Demarage du jeu !
  start: function() {

    app.player[0] = app.createPlayer(data.players.player1);
    app.player[1] = app.createPlayer(data.players.player2);

    //Generation d'ennemies
    app.createEnemysPool(app.numberEnemy);
    app.enemyPool[app.currentEnemy].generateHtml();
  },

  //Generateur de nombres aleatoire arondie
  randomNumber: function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },

  enemyManger : function () {
    if (app.enemyPool[app.currentEnemy].life <= 0) {

      if (app.currentEnemy === app.enemyPool.length-1 ) {
        app.win();
      } else {
        app.currentEnemy++;
        app.enemyPool[app.currentEnemy].generateHtml();
      }

    }
  },

  playerManager : function (){

    if (app.player[0].die && app.player[1].die) {
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
  //Prototype de Base ! qui peu evoluer vers 'player' ou  'enemy' grace au systeme d'heritage;
  Character: function(obj) {
    this.die = false;
    this.name = obj.name;
    this.life = obj.life;
    this.mana = obj.mana;
    this.toHit = obj.toHit;
    this.dodge = obj.dodge;
    this.damage = obj.damage;
    this.numberAttack = obj.numberAttack;
    this.gold = obj.gold;

    // Attaque un enemie cible
    this.attack = function(target) {
      console.log(this.name + ' attack');
      target.life -= this.damage;
      target.updateStats();
    };

    this.generateHtml = function() {

      var divItems = $('<div>').attr('id', 'card-items');
      var divName = $('<div>').text(this.name).addClass('card-name');
      var divMana = $('<div>').text(this.mana).addClass('card-mana');
      var divLife = $('<div>').text(this.life).addClass('card-life');
      var divToHit = $('<div>').text(this.toHit).addClass('card-toHit');
      var divDamage = $('<div>').text(this.damage).addClass('card-damage');
      var divSkills = $('<div>').addClass('card-skills');
      var divId = $('<div>').attr('id', this.id);
      var divItems = $('<div>').attr('id', 'card-items');
      var divCard = $('<div>').addClass('card  --card-size-' + this.cardSize + ' card--img-' + obj.face);

      for (var i = 0; i < this.numberAttack; i++) {
        $('<div>')
          .addClass('card-attack skill--img-attack')
          .data('owner', this.id)
          .on('click', function() {
            app.combatManager($(this).data('owner'));
             $(this).addClass('skill--disable');
             setTimeout(function(){
               $(this).removeClass('skill--disable');
             }, 1000);
          })
          .appendTo(divSkills);
      }

      divCard.append(divName, divLife, divMana, divToHit, divDamage);
      divId.append(divItems, divCard, divSkills);
      $(this.sectionId).append(divId);
    };

    this.updateStats = function() {
      if (this.life <= 0) {
        this.die = true;
        $('#' + this.id + ' .card .card-life').text(0);
        $('#' + this.id).fadeOut('slow', function() {
          $(this).remove();
          if (this.id === 'player1' || this.id ==='player2') {
            app.playerManager();
          }else app.enemyManger();
        });
      }else {
        $('#' + this.id + ' .card .card-life').text(this.life);
        $('#' + this.id + ' .card .card-mana').text(this.mana);
      };

    };
  },

  //Prototype pour les ennemies
  Enemy: function(obj) {
    //appel du construceur de Character
    app.Character.call(this, obj);
    this.valueXp = obj.valueXp;
    this.id = 'enemy1';
    this.cardSize = 'normal'
    this.sectionId = '#enemySection';
  },

  //Prototype du joueur
  Player: function(obj) {
    //Apelle du construteur du Prototype de base 'Character'
    app.Character.call(this, obj);
    //Plus des proprietés spécifique
    this.xp = 0;
    this.id = obj.id;
    this.cardSize = 'tiny'
    this.sectionId = '#playerSection';
    // t
  },

  //Fonction pour crée le joueur basé sur le Prototype charactere -> player
  createPlayer: function(obj) {
    var player = new app.Player(obj);
    player.generateHtml();
    return player;
  },

  //Fonction pour crée un enemie  basé sur le Prototype charactere -> Enemy
  createEnemy: function(obj) {
    var enemy = new app.Enemy(obj);
    return enemy;

  },

  //Permet de definir le nombre d'ennemies en lice
  createEnemysPool: function(numberToAdd) {

    for (var index = 0; index < numberToAdd; index++) {
      var randNumber = app.randomNumber(1, 100);
      if (randNumber >= 50) {
        app.enemyPool.push(app.createEnemy(data.enemys.goblinShaman));
      } else if (randNumber >= 25) {
        app.enemyPool.push(app.createEnemy(data.enemys.orcWarrior));
      } else {
        app.enemyPool.push(app.createEnemy(data.enemys.orcShaman));
      }
    }
  },

  win: function() {
    $('<h2>').text('You win').appendTo('#enemySection');
    console.log('You win');
  },

  gameOver : function() {
    $('<h2>').text('gameOver').appendTo('#playerSection');
    console.log('gameOver');
  },
};

$(app.init);
