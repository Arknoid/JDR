var app = {

  player: [],
  enemyPool: [],
  numberEnemy: 10,
  currentEnemy: 0,

  music: new Audio(),

  init: function() {
    //load music
    $('.carousel').carousel()
    app.music.src = 'sounds/music/cave.ogg';
    $('#btnEnter').on('click', function() {
      app.music.play();
      app.start();
      $(this).remove();;
    });

  },
  //Demarage du je u !
  start: function() {

    app.player[0] = app.createPlayer(data.players.player1);
    app.player[1] = app.createPlayer(data.players.player2);

    //Generation d'ennemies
    app.createEnemysPool(app.numberEnemy);
    app.generateHtml(app.enemyPool[app.currentEnemy]);
    app.enemyPool[app.currentEnemy].setAutoAttack();
  },

  //Generateur de nombres aleatoire arondie
  randomNumber: function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },

  //Allows from a ArrayList to generate the appropriate sounds
  generateSounds : function(soundArray, location) {
    var sounds = [];
    for (var i = 0; i < soundArray.length; i++) {
      sounds[i] = new Audio();
      sounds[i].src = location + soundArray[i] + '.ogg';
    }
    return sounds;
  },

  //Generate and show  Card format for Player or ennemy objets
  generateHtml : function (cardObj) {

    var divItems = $('<div>').attr('id', 'card-items');
    var divName = $('<div>').text(cardObj.name).addClass('card-name');
    var divMana = $('<div>').text(cardObj.mana).addClass('card-mana');
    var divLife = $('<div>').text(cardObj.life).addClass('card-life');
    var divToBlock = $('<div>').text(cardObj.toHit + '/' + cardObj.block).addClass('card-toHit');
    var divDamage = $('<div>').text(cardObj.damage).addClass('card-damage');
    var divSkills = $('<div>').addClass('card-skills');
    var divId = $('<div>').attr('id', cardObj.id);
    var divCard = $('<div>').addClass('card  card--size-' + cardObj.cardSize + ' card--img-' + cardObj.face);

    //generate Attack skills
    for (var attack = 0; attack < cardObj.numberAttack; attack++) {
      cardObj.skillsAttack[attack] = $('<div>')
        .addClass('card-attack skill--img-attack')
        .data('owner', cardObj.id)
        .data('canUse', true)
        .data('type', 'attack')
        .on('click', cardObj.useSkill)
        .appendTo(divSkills);
    }
    //generate Shield skills
    if (cardObj.shield) {
      var divShield = $('<div>')
        .addClass('card-shield skill--img-shield')
        .data('owner', cardObj.id)
        .data('canUse', true)
        .data('type', 'shield')
        .on('click', cardObj.useSkill)
        .appendTo(divSkills);
    }

    divCard.append(divName, divLife, divMana, divToBlock, divDamage);
    if (cardObj.id === 'player1' || cardObj.id === 'player2') {
      divId.append(divSkills);
    }
    divId.append(divItems, divCard);
    $(cardObj.sectionId).append(divId);
  },

  enemyManager: function() {
    if (app.enemyPool[app.currentEnemy].life <= 0) {
        app.currentEnemy++;
      if (app.currentEnemy === app.enemyPool.length ) {
        app.win();

      } else {
        app.generateHtml(app.enemyPool[app.currentEnemy]);
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

  //Prototype de Base ! qui peu evoluer vers 'player' ou  'enemy' grace au systeme d'heritage;
  Character: function(obj) {

    this.isDie = false;
    this.face = obj.face;
    this.name = obj.name;
    this.life = obj.life;
    this.mana = obj.mana;
    this.toHit = obj.toHit;
    this.block = obj.toBlock;
    this.damage = obj.damage;
    this.numberAttack = obj.numberAttack;
    this.skillsAttack = [];
    this.gold = obj.gold;
    this.shield = obj.shield;
    this.shieldUp = false;

    //use _this for this in nested function
    var _this = this;
    //Audio
    this.soundVoiceHit = app.generateSounds(obj.voice, 'sounds/characters/');
    this.soundMiss =  app.generateSounds(obj.soundMiss, 'sounds/combat/');
    this.soundDie = app.generateSounds(obj.dieSound, 'sounds/characters/');


    this.soundBlock = new Audio();
    this.soundBlock.src = 'sounds/combat/swordBlock.ogg';



    // Attaque un enemie cible
    this.attack = function(target) {
      var dmg = app.randomNumber(1, this.damage);
      if (target.shieldUp) {
        var soundShieldUse = new Audio();
        soundShieldUse.src = 'sounds/combat/shieldBlock.ogg';
        soundShieldUse.play();
        target.showBlock();
        target.shieldUp = false;

      } else if (app.randomNumber(1, this.toHit) > app.randomNumber(1, target.block)) {
        target.life -= dmg;
        target.scream();
        target.showHit(dmg);
        target.updateStats();
      } else {
        if (app.randomNumber(1, 5) <= 4) {
          this.soundMiss[app.randomNumber(0, this.soundMiss.length - 1)].play();
        } else {
          this.soundBlock.play();
        }
        target.showBlock();
      }

    };

    //play a random sound form characters voice when hitting
    this.scream = function() {
      var rndSound = app.randomNumber(0, this.soundVoiceHit.length - 1)
      this.soundVoiceHit[rndSound].play();
    };
    this.useSkill = function() {
      var $skill = $(this)
      var disableTimer;
      if ($skill.data('canUse')) {
        switch ($skill.data('type')) {
          case 'attack':
            app.combatManager($skill.data('owner'));
            disableTimer = app.randomNumber(3, 5) * 1000;
            break;
          case 'shield':
            _this.shieldUp = true;
            var soundShieldUp = new Audio();
            soundShieldUp.src = 'sounds/combat/shieldUp.ogg';
            soundShieldUp.play();
            disableTimer = app.randomNumber(15, 20) * 1000;
            break;
          default:
        }

        $skill.addClass('skill--disable').data('canUse', false);
        this.attack = setTimeout(function() {
          $skill.removeClass('skill--disable');
          $skill.data('canUse', true);
        }, disableTimer);
      }
    };

    this.showBlock = function(damage) {
      var blockDiv = $('<div>')
        .addClass('card-block')
        .text(damage)
        .appendTo($(this.sectionId + ' #' + this.id + ' .card'))
        .hide()
        .fadeIn();
      setTimeout(function() {
        $(blockDiv).fadeOut('slow', function() {
          $(this).remove();
        });
      }, 1000);
    };


    this.showHit = function(damage) {

      var size;
      var fontSize;

      if (damage >= 6) {
        size = 100;
        fontSize = 2.2;
      } else if (damage > 4) {
        size = 80;
        fontSize = 2.0;
      } else if (damage > 2) {
        size = 60;
        fontSize = 1.6;
      } else {
        size = 50;
        fontSize = 1.4;
      }

      var hitDiv = $('<div>')
        .addClass('card-hit')
        .css({
          'height': size + 'px',
          'width': size + 'px',
          'fontSize': fontSize + 'rem',
        })
        .text(damage)
        .appendTo($(this.sectionId + ' #' + this.id + ' .card'));
      setTimeout(function() {
        $(hitDiv).fadeOut(2000, function() {
          $(this).remove();
        });
      }, 500);
    };



    this.dies = function() {
    this.isDie = true;
    this.soundDie[app.randomNumber(0, this.soundDie.length - 1)].play();
    $('#' + this.id).fadeOut('slow', function () {
      $(this).remove();
      if (_this.id === 'player1' || _this.id === 'player2') {
        app.playerManager();
      } else {

        _this.clearAutoAttack();
        app.enemyManager();
      }
    });
    },
    this.updateStats = function() {
      if (this.life <= 0) {
        this.dies();
      } else {
        $('#' + this.id + ' .card .card-life').text(this.life);
        $('#' + this.id + ' .card .card-mana').text(this.mana);
      }

    };
  },

  //Prototype pour les ennemies
  Enemy: function(obj) {
    //appel du construceur de Character
    app.Character.call(this, obj);
    this.valueXp = obj.valueXp;
    this.id = 'enemy1';
    this.sectionId = '#enemySection';
    this.attackInterval = [] ;
    var _this = this;

    if (obj.big) {
      this.cardSize = 'big'
    } else {
      this.cardSize = 'normal';
    }
    this.setAutoAttack = function() {
      this.skillsAttack.forEach(function () {
        var inter = setInterval(function () {
          app.combatManager('enemy1');
        }, app.randomNumber(20, 30) * 100 );
        _this.attackInterval.push(inter);
      });
    }
    this.clearAutoAttack = function () {

      _this.attackInterval.forEach(function (inter) {
          clearInterval(inter);
      });
    }
  },

  //Prototype du joueur
  Player: function(obj) {
    //Apelle du construteur du Prototype de base 'Character'
    app.Character.call(this, obj);
    //Plus des proprietés spécifique
    this.xp = 0;
    this.id = obj.id;
    this.cardSize = 'tiny';
    this.sectionId = '#playerSection';
  },

  //Fonction pour crée le joueur basé sur le Prototype charactere -> player
  createPlayer: function(obj) {
    var player = new app.Player(obj);
    app.generateHtml(player);
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
    app.enemyPool.push(app.createEnemy(data.enemys.trollGiant))
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
