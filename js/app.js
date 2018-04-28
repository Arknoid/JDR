var app = {

  //tableau a remplir d'ennemies grace a createEnemysPool();
  enemyPool: [],
  numberEnemy: 10,
  currentEnemy: 0,

  init: function() {
    app.start();

  },

  //Demarage du jeu !
  start: function() {

    //Appel du constructeur des joueurs  avec un objet contenan  "nom,mana,life,toHit,toDodge,damage,attack ..."
    app.player1 = app.createPlayer(app.players.player1);
    app.player2 = app.createPlayer(app.players.player2);
    // app.enemy1 = app.createEnemy(app.enemys.goblinShaman, 'enemy1');


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

  combatManager: function(player) {

    switch (player) {
    case 'player1':
      app.player1.attack(app.enemyPool[app.currentEnemy]);
      app.enemyPool[app.currentEnemy].update();
      break;
    case 'player2':
      app.player2.attack(app.enemyPool[app.currentEnemy]);
      app.enemyPool[app.currentEnemy].update();
      break;
    case 'enemy1':
      app.enemyPool[app.currentEnemy].attack(app.player1);
      break;
    }

    if (app.enemyPool[app.currentEnemy].life <= 0) {
      $('#enemy1').fadeOut('slow',function(){
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
    this.attaque = obj.attaque;
    this.gold = obj.gold;

    // Attaque un enemie cible
    this.attack = function(target) {
      console.log(this.name + 'attaque');
      target.life -= this.damage;
    };

  },

  //Prototype pour les ennemies
  Enemy: function(obj) {
    //appel du construceur de Character
    app.Character.call(this, obj);
    this.valueXp = obj.valueXp;
    this.id = 'enemy1';
    this.generateHtml = function() {
      var divId = $('<div>', {
        id: 'enemy1',
      });

      var divItems = $('<div>', {
        id: 'enemy-items',
      });

      var divEnemy = $('<div>')
        .addClass('card --card-size-normmal enemy--img-' + obj.face);


      var divName = $('<div>')
        .text(this.name)
        .addClass('card-name');

      var divMana = $('<div>')
        .text(this.mana)
        .addClass('card-mana');

      var divLife = $('<div>')
        .text(this.life)
        .addClass('card-life');

      var divToHit = $('<div>')
        .text(this.toHit)
        .addClass('card-toHit');

      var divDamage = $('<div>')
        .text(this.damage)
        .addClass('card-damage');

      var divSkills = $('<div>')
        .addClass('card-skills');


      var skillAttack1 = $('<div>')
        .addClass('card-attack skill--img-attack');


      divEnemy.append(divName, divLife, divMana, divToHit, divDamage);
      divSkills.append(skillAttack1);
      divId.append(divItems, divEnemy, divSkills);
      $('#enemySection').append(divId);
    };
    this.update = function() {

      $('#' + this.id + ' .card .card-life').text(this.life);
      $('#' + this.id + ' .enemy .card-mana').text(this.mana);

    };

  },
  //Prototype du joueur
  Player: function(obj) {
    //Apelle du construteur du Prototype de base 'Charactere'
    app.Character.call(this, obj);
    //Plus des proprietés spécifique
    this.xp = 0;
    this.id = obj.id;
    this.generateHtml = function() {
      var divId = $('<div>', {
        id: this.id,
      });

      var divItems = $('<div>', {
        id: 'card-items',
      });

      var divPlayer = $('<div>')
        .addClass('card  --card--size-little player--img-' + obj.face);


      var divName = $('<div>')
        .text(this.name)
        .addClass('card-name');

      var divMana = $('<div>')
        .text(this.mana)
        .addClass('card-mana');

      var divLife = $('<div>')
        .text(this.life)
        .addClass('card-life');

      var divToHit = $('<div>')
        .text(this.toHit)
        .addClass('card-toHit');

      var divDamage = $('<div>')
        .text(this.damage)
        .addClass('card-damage');

      var divSkills = $('<div>')
        .addClass('card-skills');

      var skillAttack1 = $('<div>')
        .addClass('card-attack skill--img-attack')
        .data('player', this.id)
        .on('click', function() {
          app.combatManager($(this).data('player'));
        });

      var skillAttack2 = $('<div>')
        .addClass('card-attack skill--img-attack')
        .data('player', this.id)
        .on('click', function() {
          app.combatManager($(this).data('player'));
        });


      divPlayer.append(divName, divLife, divMana, divToHit, divDamage);
      divSkills.append(skillAttack1, skillAttack2);
      divId.append(divItems, divPlayer, divSkills);
      $('#playerSection').append(divId);

    }
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
    // enemy.generateHtml();
    return enemy;

  },

  //Permet de definir le nombre d'ennemies en lice
  createEnemysPool: function(numberToAdd) {
    for (var index = 0; index < numberToAdd; index++) {
      switch (app.randomNumber(1, 6)) {
      case 1:
      case 2:
        app.enemyPool.push(app.createEnemy(app.enemys.goblinShaman));
        break;
      case 3:
      case 4:
      case 5:
        app.enemyPool.push(app.createEnemy(app.enemys.orcWarrior));
        break;
      case 6:
        app.enemyPool.push(app.createEnemy(app.enemys.orcShaman));
        break;
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
      attaque: 1,
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
      potionLife: 2,
    },
  },

  //NameSpace pour les ennemies
  enemys: {
    //enemies de base pour les tests
    orcWarrior: {
      name: 'orc-warrior',
      face: 'orcWarrior',
      life: 20,
      mana: 2,
      toHit: 3,
      toDodge: 3,
      gold: 10,
      valueXp: 10,
      damage: 6,
      attaque: 2,
    },

    goblinShaman: {
      name: 'goblin-shaman',
      face: 'goblinShaman',
      life: 20,
      mana: 10,
      toHit: 4,
      toDodge: 2,
      gold: 10,
      valueXp: 10,
      damage: 6,
      attaque: 1,
    },


    orcShaman: {
      name: 'orc-shaman',
      face: 'orcShaman',
      life: 10,
      mana: 8,
      toHit: 3,
      toDodge: 3,
      gold: 10,
      valueXp: 10,
      damage: 6,
      attaque: 1,
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
