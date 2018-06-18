/**
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under The MIT License.
 *
 * @class Character
 */

class Character {
  constructor(obj) {
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
    this.shield = obj.shield;
    this.shieldUp = false;
    //Gobal timer
    this.canUseSkills = true;
    this.gobalTimer = null;
    this.skillsTimers = [];

    //Audio
    this.soundVoiceHit = obj.voice;
    this.soundMiss = obj.soundMiss;
    this.soundDie = obj.dieSound;
  }

  //Disable timer when the game is paused
  pausedTimers() {
    $.each(this.skillsTimers, function (index, element) {
      element.pause();
      
    })
  }

  //Resume timer when the game is resume
  resumeTimers() {
    $.each(this.skillsTimers, function (index, element) {
      element.start();

    })
  }
  //Attack target
  attack(target) {
    this.animateAttack();
    const rndDamage = app.randomNumber(1, this.damage);
    //Test if Shield Block
    if (target.shieldUp) {
      //Shield block sound
      soundsController.play('shieldBlock')
      target.showBlock();
      target.shieldUp = false;
      //Test if touch !
    } else if (app.randomNumber(1, this.toHit) > app.randomNumber(1, target.block)) {
      target.life -= rndDamage;
      target.scream();
      target.showHit(rndDamage);
      target.updateStats();
      //Attack missing or parrying
    } else if (app.randomNumber(1, 5) <= 4) {
      soundsController.play(this.soundMiss[app.randomNumber(0, this.soundMiss.length - 1)]);
      target.showBlock();
    } else {
      //play parry sound
      soundsController.play('swordBlock')
      target.showBlock();
    }
  };

  setGlobalTimer() {
    const self = this;
    const timer = 2000;
    self.canUseSkills = false;
    $('#' + self.id + ' .globalCountdown').each(function() {
      $(this).css({
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        })
        .transition({
          backgroundColor: "rgba(0, 0, 0, 0.2)"
        }, timer, 'easeInQuart', function() {

          //reset
          self.canUseSkills = true;
        })
    });

  };
  animateAttack() {
    const self = this;
    //Rotate players
    if (self.id === 'player1' || this.id === 'player2') {
      let rotate = 10;
      $('#' + self.id + ' .card')
        .transition({
          rotate: '+=' + rotate + 'deg'
        }, 200)
        .transition({
          rotate: '-=' + rotate + 'deg'
        }, 200)
    } else {
      //Translate to bottom ennemy
      let dir = 60;
      $('#' + self.id + ' .card')
        .transition({
          y: '+=' + dir
        }, 200)
        .transition({
          y: '-=' + dir
        }, 200)
    }
  }
  //Play a random sound form Charactes when hitting
  scream() {
    const rndSound = app.randomNumber(0, this.soundVoiceHit.length - 1)
    soundsController.play(this.soundVoiceHit[rndSound]);
  }
  useSkill(evt) {
    //evt.data.self == this class
    if (evt.data.self.canUseSkills && !app.paused) {
      const skill = $(this);
      let disableTimer;
      if (skill.data('canUse')) {
        switch (skill.data('type')) {
          case 'attack':
            app.combatManager(skill.data('owner'));
            disableTimer = app.randomNumber(3, 5);
            break;
          case 'shield':
            self.shieldUp = true;
            soundsController.play('shieldUp');
            disableTimer = app.randomNumber(15, 20);
            break;
          default:
        }

        //Create new Timer objet for the game pause
        let timer = new Timer ({
            tick: 1,
            onend: function () {
              skill.removeClass('skill--disable');
              skill.data('canUse', true);
            }
          });
          evt.data.self.setGlobalTimer();
          skill.addClass('skill--disable').data('canUse', false);
          timer.start(disableTimer);
          //add this timer to all character timers
          evt.data.self.skillsTimers.push(timer);
      }
    }

  }

  showBlock(damage) {
    const blockDiv = $('<div>')
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
  }


  showHit(damage) {

    let size;
    let fontSize;

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

    const hitDiv = $('<div>')
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
  }

  dies() {
    const self = this;
    this.isDie = true;
    soundsController.play(this.soundDie[app.randomNumber(0, this.soundDie.length - 1)]);
    $('#' + this.id).fadeOut('slow', function() {
      $(this).remove();
      if (self.id === 'player1' || self.id === 'player2') {
        app.playerManager();
      } else {

        self.clearAutoAttack();
        app.enemyManager();
      }
    });
  }
  updateStats() {
    if (this.life <= 0) {
      this.dies();
    } else {
      $('#' + this.id + ' .card .card-life').text(this.life);
      $('#' + this.id + ' .card .card-mana').text(this.mana);
    }

  };

  //Generate and added to DOM :  Card format for Player or ennemy objets
  generateHtml() {
    const self = this;
    const divItems = $('<div>').attr('id', 'card-items');
    const divName = $('<div>').text(this.name)
      .addClass('card-name').attr("data-toggle", "tooltip")
      .attr("title", "Name");
    const divMana = $('<div>').text(this.mana)
      .addClass('card-mana').attr("data-toggle", "tooltip")
      .attr("title", "Mana");
    const divLife = $('<div>').text(this.life)
      .addClass('card-life').attr("data-toggle", "tooltip")
      .attr("title", "Health");
    const divToBlock = $('<div>').text(this.toHit + '/' + this.block)
      .addClass('card-toHit')
      .attr("data-toggle", "tooltip")
      .attr("title", "Chances to Block & Touch");
    const divDamage = $('<div>').text(this.damage)
      .addClass('card-damage').attr("data-toggle", "tooltip")
      .attr("title", "Damages");
    const divSkills = $('<div>').addClass('card-skills');
    const divId = $('<div>').attr('id', this.id);
    const divCard = $('<div>').addClass('card  card--size-' + this.cardSize + ' card--img-' + this.face);

    //generate Attack skills
    for (let attack = 0; attack < this.numberAttack; attack++) {
      this.skillsAttack[attack] = $('<div>')
        .addClass('card-attack skill skill--img-attack')
        .data('owner', this.id)
        .data('canUse', true)
        .data('type', 'attack')
        .attr("data-toggle", "tooltip").attr("title", "Attack enemy")
        .on('click',{self:self},self.useSkill)
        .append('<div class = "globalCountdown">')
        .appendTo(divSkills);
    }
    //generate Shield skills
    if (this.shield) {
      const divShield = $('<div>')
        .addClass('card-shield skill skill--img-shield')
        .data('owner', this.id)
        .data('canUse', true)
        .data('type', 'shield')
        .on('click',{self:self},self.useSkill)
        .attr("data-toggle", "tooltip")
        .attr("title", "Block the next enemy attack ")
        .append('<div class = "globalCountdown">')
        .appendTo(divSkills);
    }

    divCard.append(divName, divLife, divMana, divToBlock, divDamage);
    if (this.id === 'player1' || this.id === 'player2') {
      divId.append(divSkills);
    }
    divId.append(divItems, divCard);
    $(this.sectionId).append(divId);
  }

}
