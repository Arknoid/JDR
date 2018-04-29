var app = {

  player : [],
  enemyPool: [],
  numberEnemy: 50,
  currentEnemy: 0,

  init: function() {
    app.start();
  },
  //Demarage du jeu !
  start: function() {

    app.player [0] = app.createPlayer(app.players.player1);
    app.player [1] = app.createPlayer(app.players.player2);
    app.player [2] = app.createPlayer(app.players.player2);
    app.player [3] = app.createPlayer(app.players.player1);

    //Generation d'ennemies
    app.createEnemysPool(app.numberEnemy);
    app.enemyPool[app.currentEnemy].generateHtml();
  },

  //Generateur de nombres aleatoire arondie
  randomNumber: function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },

  setPercentage: function(number, percentage) {
    return Math.round(number * percentage / 100);
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
        var randPlayer = app.randomNumber(0,app.player.length-1);
        app.enemyPool[app.currentEnemy].attack(app.player[randPlayer]);
        break;
    }

    if (app.enemyPool[app.currentEnemy].life <= 0) {
      $('#enemy1').fadeOut('slow', function() {
        $(this).remove();
        app.currentEnemy++;
        app.enemyPool[app.currentEnemy].generateHtml();
      });
    }
  },
  //Prototype de Base ! qui peu evoluer vers 'player' ou  'enemy' grace au systeme d'heritage;
  Character: function(obj) {

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

      var divItems = $('<div>').attr('id','card-items');
      var divName = $('<div>').text(this.name).addClass('card-name');
      var divMana = $('<div>').text(this.mana).addClass('card-mana');
      var divLife = $('<div>').text(this.life).addClass('card-life');
      var divToHit = $('<div>').text(this.toHit).addClass('card-toHit');
      var divDamage = $('<div>').text(this.damage).addClass('card-damage');
      var divSkills = $('<div>').addClass('card-skills');
      var divId = $('<div>').attr('id',this.id);
      var divItems = $('<div>').attr('id','card-items');
      var divCard = $('<div>').addClass('card  --card-size-'+this.cardSize+' card--img-' + obj.face);

      for (var i = 0; i < this.numberAttack; i++) {
          $('<div>')
          .addClass('card-attack skill--img-attack')
          .data('owner', this.id)
          .on('click', function() {
            app.combatManager($(this).data('owner'));
          })
          .appendTo(divSkills);
      }

      divCard.append(divName, divLife, divMana, divToHit, divDamage);
      divId.append(divItems, divCard, divSkills);
      $(this.sectionId).append(divId);
    };

    this.updateStats = function() {
      $('#' + this.id + ' .card .card-life').text(this.life);
      $('#' + this.id + ' .card .card-mana').text(this.mana);
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
        app.enemyPool.push(app.createEnemy(app.enemys.goblinShaman));
      }else if (randNumber >= 25) {
        app.enemyPool.push(app.createEnemy(app.enemys.orcWarrior));
      }else {
         app.enemyPool.push(app.createEnemy(app.enemys.orcShaman));
      }
    }
  },

  gameOver: function() {
    console.error('You are Dead');
    console.error('Game Over');
  },
  win: function() {
    console.error('You win');
  },
  //NameSpace pour le joueur
  players: {
    player1: {
      id: 'player1',
      name: 'arknoid',
      face: 'knight',
      life: 50,
      mana: 10,
      toHit: 3,
      toDodge: 3,
      gold: 0,
      damage: 6,
      numberAttack: 1,
      potionLife: 1,
      potionMana: 1,

    },
    player2: {
      id: 'player2',
      name: 'darknoid',
      face: 'darkKnight',
      life: 50,
      mana: 10,
      toHit: 3,
      toDodge: 3,
      gold: 0,
      damage: 6,
      numberAttack : 2,
      potionLife: 2,
    },
  },

  //NameSpace pour les ennemies
  enemys: {
    //enemies de base pour les tests
    orcWarrior: {
      name: 'orc-warrior',
      face: 'orcWarrior',
      life: 40,
      mana: 2,
      toHit: 3,
      toDodge: 3,
      gold: 10,
      valueXp: 10,
      damage: 6,
      numberAttack: 2,
    },

    goblinShaman: {
      name: 'goblin-shaman',
      face: 'goblinShaman',
      life: 10,
      mana: 10,
      toHit: 4,
      toDodge: 2,
      gold: 10,
      valueXp: 10,
      damage: 6,
      numberAttack: 1,
    },

    orcShaman: {
      name: 'orc-shaman',
      face: 'orcShaman',
      life: 20,
      mana: 8,
      toHit: 3,
      toDodge: 3,
      gold: 10,
      valueXp: 10,
      damage: 6,
      numberAttack: 1,
    },
  },

  items: {
    potions: {
      life: function() {
        this.name = 'Potion of life';
        this.powerMin = 10;
        this.powerMax = 50;
        //this.cooldown =
      },
    },
  },

};

$(app.init);
