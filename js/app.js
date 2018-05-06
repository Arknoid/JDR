var app = {

  player: [],
  enemyPool: [],
  numberEnemy: 10,
  currentEnemy: 0,
  

  init: function() {
    $('#btnEnter').on('click',function(){
      app.start();
      $(this).remove();
    });

  },
  //Demarage du jeu !
  start: function() {

    app.player[0] = app.createPlayer(data.players.player1);
    app.player[1] = app.createPlayer(data.players.player2);

    //Generation d'ennemies
    app.createEnemysPool(app.numberEnemy);
    app.enemyPool[app.currentEnemy].generateHtml();
    app.enemyPool[app.currentEnemy].autoAttack();
  },

  //Generateur de nombres aleatoire arondie
  randomNumber: function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },

  enemyManager: function() {
    if (app.enemyPool[app.currentEnemy].life <= 0) {

      if (app.currentEnemy === app.enemyPool.length - 1) {
        app.win();
      } else {
        app.currentEnemy++;
        app.enemyPool[app.currentEnemy].generateHtml();
        app.enemyPool[app.currentEnemy].autoAttack();
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
    this.name = obj.name;
    this.life = obj.life;
    this.mana = obj.mana;
    this.toHit = obj.toHit;
    this.block = obj.toBlock;
    this.damage = obj.damage;
    this.numberAttack = obj.numberAttack;
    this.skillsAttack = [],
    this.gold = obj.gold;
    this.shield = obj.shield;
    this.canBlock = false;

    // Attaque un enemie cible
    this.attack = function(target) {
      var dmg = app.randomNumber(1,this.damage);
      if (target.canBlock) {
        target.showBlock();
        target.canBlock = false;
      }
      else if (app.randomNumber(1,this.toHit) > app.randomNumber(1,target.block)) {
        target.life -= dmg;
        target.showHit(dmg);
        target.updateStats();
      }
      else {
        target.showBlock();
      }

    };
    this.useSkill = function(){
      var $skill = $(this)
      var disableTimer ;
      if ($skill.data('canUse') ) {

        switch ($skill.data('type')) {
          case  'attack':
            app.combatManager($skill.data('owner'));
            disableTimer = app.randomNumber(3,5)*1000;
            break;
          case 'shield':
            this.canBlock = true;
            disableTimer = app.randomNumber(15,20)*1000;
            break;
          default:
        }

        $skill.addClass('skill--disable').data('canUse',false);
        this.attack =  setTimeout(function() {
          $skill.removeClass('skill--disable');
          $skill.data('canUse',true);
        }, disableTimer);
      }
    };

    this.showBlock = function (damage){
      var blockDiv = $('<div>')
                  .addClass('card-block')
                  .text(damage)
                  .appendTo($(this.sectionId+' #'+this.id+ ' .card'))
                  .hide()
                  .fadeIn();
       setTimeout(function(){
        $(blockDiv).fadeOut('slow',function(){
          $(this).remove();
        });
      },1000);
    };


    this.showHit = function (damage) {

      var size;
      var fontSize;

      if (damage >= 6) {
        size = 100;
        fontSize = 2.2;
      }else if (damage >4) {
        size = 80;
        fontSize = 2.0;
      }else if (damage >2) {
        size = 60;
        fontSize = 1.6;
      }else {
        size = 50;
        fontSize = 1.4;
      }

     var hitDiv = $('<div>')
                 .addClass('card-hit')
                 .css({
                   'height' : size+'px',
                   'width'  : size+'px',
                   'fontSize' : fontSize+'rem',
                 })
                 .text(damage)
                 .appendTo($(this.sectionId+' #'+this.id+ ' .card'));
      setTimeout(function(){
       $(hitDiv).fadeOut(2000,function(){
        $(this).remove() ;
       });
     },500);
    }


    this.generateHtml = function() {

      var divItems = $('<div>').attr('id', 'card-items');
      var divName = $('<div>').text(this.name).addClass('card-name');
      var divMana = $('<div>').text(this.mana).addClass('card-mana');
      var divLife = $('<div>').text(this.life).addClass('card-life');
      var divToBlock = $('<div>').text(this.toHit+'/'+this.block).addClass('card-toHit');
      var divDamage = $('<div>').text(this.damage).addClass('card-damage');
      var divSkills = $('<div>').addClass('card-skills');
      var divId = $('<div>').attr('id', this.id);
      var divCard = $('<div>').addClass('card  card--size-' + this.cardSize + ' card--img-' + obj.face);

      //generate Attack skills
      for (var attack = 0; attack < this.numberAttack; attack++) {
        this.skillsAttack[attack] = $('<div>')
          .addClass('card-attack skill--img-attack')
          .data('owner', this.id)
          .data('canUse',true )
          .data('type','attack')
          .on('click', this.useSkill)
          .appendTo(divSkills);
      }
      if (this.shield) {
        var divShield =$('<div>')
          .addClass('card-shield skill--img-shield' )
          .data('owner', this.id)
          .data('canUse',true)
          .data('type','shield')
          .on('click',this.useSkill)
          .appendTo(divSkills);
      }

      divCard.append(divName, divLife, divMana, divToBlock, divDamage);
      divId.append(divItems, divCard, divSkills);
      $(this.sectionId).append(divId);
    };

    this.updateStats = function() {
      if (this.life <= 0) {
        this.isDie = true;
        $('#' + this.id + ' .card .card-life').text(0);
        $('#' + this.id).fadeOut('slow', function() {
          $(this).remove();
          if (this.id === 'player1' || this.id === 'player2') {
            app.playerManager();
          } else app.enemyManager();
        });
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

    if (obj.big) {
      this.cardSize = 'big'
    }else{
      this.cardSize = 'normal';
    }
    this.autoAttack = function(){
      this.skillsAttack.forEach(function(skill){
        setInterval(function(){
         $(skill).trigger('click');
       },app.randomNumber(20,30)*100);
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
    app.enemyPool.push(app.createEnemy(data.enemys.trollGiant))
  },

  win: function() {
    $('#playerSection').remove();
    $('<h2>').text('You win').appendTo('#enemySection');
    console.log('You win');
  },

  gameOver: function() {
    $('#enemySection').remove();
    $('<h2>').text('gameOver').appendTo('#playerSection');
    console.log('gameOver');
  },
};

$(app.init);
