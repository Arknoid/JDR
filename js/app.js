var app = {

  player: [],
  enemyPool: [],
  numberEnemy: 10,
  currentEnemy: 0,

  music: new Audio(),

  init: function() {

    app.music.src = 'sounds/music/cave.ogg';

  },
  //Demarage du jeu !
  start: function() {
    //load music
    app.music.play();

    //createPlayer
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
  generateSounds: function(soundArray, location) {
    var sounds = [];
    for (var i = 0; i < soundArray.length; i++) {
      sounds[i] = new Audio();
      sounds[i].src = location + soundArray[i] + '.ogg';
    }
    return sounds;
  },

  //Generate and show  Card format for Player or ennemy objets
  generateHtml: function(cardObj) {

    var divItems = $('<div>').attr('id', 'card-items');
    var divName = $('<div>').text(cardObj.name)
      .addClass('card-name').attr("data-toggle", "tooltip")
      .attr("title", "Name");
    var divMana = $('<div>').text(cardObj.mana)
      .addClass('card-mana').attr("data-toggle", "tooltip")
      .attr("title", "Mana");
    var divLife = $('<div>').text(cardObj.life)
      .addClass('card-life').attr("data-toggle", "tooltip")
      .attr("title", "Health");
    var divToBlock = $('<div>').text(cardObj.toHit + '/' + cardObj.block)
      .addClass('card-toHit')
      .attr("data-toggle", "tooltip")
      .attr("title", "Chances to Block & Touch");
    var divDamage = $('<div>').text(cardObj.damage)
      .addClass('card-damage').attr("data-toggle", "tooltip")
      .attr("title", "Damages");
    var divSkills = $('<div>').addClass('card-skills');
    var divId = $('<div>').attr('id', cardObj.id);
    var divCard = $('<div>').addClass('card  card--size-' + cardObj.cardSize + ' card--img-' + cardObj.face);

    //generate Attack skills
    for (var attack = 0; attack < cardObj.numberAttack; attack++) {
      cardObj.skillsAttack[attack] = $('<div>')
        .addClass('card-attack skill skill--img-attack')
        .data('owner', cardObj.id)
        .data('canUse', true)
        .data('type', 'attack')
        .attr("data-toggle", "tooltip").attr("title", "Attack enemy")
        .on('click', cardObj.useSkill)
        .append('<div class = "globalCountdown">')
        .appendTo(divSkills);
    }
    //generate Shield skills
    if (cardObj.shield) {
      var divShield = $('<div>')
        .addClass('card-shield skill skill--img-shield')
        .data('owner', cardObj.id)
        .data('canUse', true)
        .data('type', 'shield')
        .on('click', cardObj.useSkill)
        .attr("data-toggle", "tooltip")
        .attr("title", "Block the next enemy attack ")
        .append('<div class = "globalCountdown">')
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
      if (app.currentEnemy === app.enemyPool.length) {
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
    //Gobal timer
    this.canUseSkills = true;
    this.gobalTimer = null;

    //use _this for this in nested function
    const _this = this;
    //Audio
    this.soundVoiceHit = app.generateSounds(obj.voice, 'sounds/characters/');
    this.soundMiss = app.generateSounds(obj.soundMiss, 'sounds/combat/');
    this.soundDie = app.generateSounds(obj.dieSound, 'sounds/characters/');
    this.soundBlock = new Audio();
    this.soundBlock.src = 'sounds/combat/swordBlock.ogg';

    //Attack target
    this.attack = function(target) {
      this.animateAttack();
      var dmg = app.randomNumber(1, this.damage);
      //Test if Shield Block
      if (target.shieldUp) {
        //Shield block sound
        var soundShieldUse = new Audio();
        soundShieldUse.src = 'sounds/combat/shieldBlock.ogg';
        soundShieldUse.play();
        target.showBlock();
        target.shieldUp = false;
        //Test if touch !
      } else if (app.randomNumber(1, this.toHit) > app.randomNumber(1, target.block)) {
        target.life -= dmg;
        target.scream();
        target.showHit(dmg);
        target.updateStats();
        //Attack missing or parrying
      } else if (app.randomNumber(1, 5) <= 4) {
        this.soundMiss[app.randomNumber(0, this.soundMiss.length - 1)].play();
        target.showBlock();
      } else {
        this.soundBlock.play();
        target.showBlock();
      }
    };

    this.setGlobalTimer = function() {
      const timer = 2000;
      _this.canUseSkills = false;
      $('#' + _this.id + ' .globalCountdown').each(function() {
        $(this).css({
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          })
          .transition({
            backgroundColor: "rgba(0, 0, 0, 0.2)"
          }, timer, 'easeInQuart', function() {

            //reset
            _this.canUseSkills = true;
          })
      });

    };
    this.animateAttack = function() {
        //Rotate players
        if (_this.id === 'player1' || this.id === 'player2') {
          let rotate = 10;
          $('#' + _this.id + ' .card')
            .transition({
              rotate: '+=' + rotate + 'deg'
            }, 200)
            .transition({
              rotate: '-=' + rotate + 'deg'
            }, 200)
        } else {
          //Translate to bottom ennemy
          let dir = 60;
          $('#' + _this.id + ' .card')
            .transition({
              y: '+=' + dir
            }, 200)
            .transition({
              y: '-=' + dir
            }, 200)
        }

      },

      //play a random sound form characters voice when hitting
      this.scream = function() {
        var rndSound = app.randomNumber(0, this.soundVoiceHit.length - 1)
        this.soundVoiceHit[rndSound].play();
      };
    this.useSkill = function() {
      if (_this.canUseSkills) {
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
          _this.setGlobalTimer();
        }

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
        size = 6;
        fontSize = 2.2;
      } else if (damage > 4) {
        size = 5;
        fontSize = 2.0;
      } else if (damage > 2) {
        size = 4;
        fontSize = 1.6;
      } else {
        size = 3;
        fontSize = 1.4;
      }

      var hitDiv = $('<div>')
        .addClass('card-hit')
        .css({
          'height': size + 'rem',
          'width': size + 'rem',
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
        $('#' + this.id).fadeOut('slow', function() {
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
    this.attackInterval = [];
    var _this = this;

    if (obj.big) {
      this.cardSize = 'big'
    } else {
      this.cardSize = 'normal';
    }
    this.setAutoAttack = function() {
      this.skillsAttack.forEach(function() {
        var inter = setInterval(function() {
          //Global timer
          if (_this.canUseSkills) {
            app.combatManager('enemy1');
            _this.canUseSkills = false;
          }
        }, app.randomNumber(30, 40) * 100);
        _this.attackInterval.push(inter);
      });
    }
    this.clearAutoAttack = function() {

      _this.attackInterval.forEach(function(inter) {
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

  //Fonction pour crée le joueur basé sur le Prototype Character -> player
  createPlayer: function(obj) {
    var player = new app.Player(obj);
    app.generateHtml(player);
    return player;
  },

  //Fonction pour crée un enemie  basé sur le Prototype Character -> Enemy
  createEnemy: function(obj) {
    var enemy = new app.Enemy(obj);
    return enemy;

  },

  //Permet de definir le nombre d'ennemies en lice
  createEnemysPool: function(numberToAdd) {

    for (var index = 0; index < numberToAdd; index++) {
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
