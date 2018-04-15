var app = {
  enemyPool: [],

  init: function() {
    app.start();
  },

  start: function() {
    app.player = app.createPlayer('arknoid', 100, 5, 10);
    app.player.describ();
    app.player.afficheInventaire();

    app.createEnemysPool(5);
    app.enemyPool.forEach(function(enemies) {
      while (enemies.life > 0) {
        app.player.combattre(enemies);
        app.player.afficheInventaire();
      };
    });
  },

  createEnemysPool : function (namebre) {
    for (var index = 0 ; index < namebre; index++) {
      app.enemyPool.push(app.createEnemy('ZogZog'+index, 6, 4, 'orc'));
    }
  },

  Enemy: function(name, life, strength, race) {
    app.Character.call(this, name, life, strength, race);
    this.race = race;
    this.describ = function() {
      console.log("je suis " + this.name + 'je suis un : ' + this.race + ' j\'ai ' + this.life + ' de life et ' + this.strength + ' de strength.');
    };

    //Definie la Valeur du nombre d 'experiences en cas d'élimination suivant la race
    if (this.race === 'orc') {
      this.valeur = 100;
      this.gold = 20;
    };
  },


  Character: function(name, life, strength) {
    this.name = name;
    this.life = life;
    this.strength = strength;
    this.describ = function() {
      console.log("je suis " + this.name + ' j\'ai ' + this.life + ' de life et ' + this.strength + ' de strength.');
    };
    // Attaque un Enemy cible
    this.attack = function(target) {
      if (this.life > 0) {
        var damage = this.strength;
        console.log(this.name + " attaque " + target.name + " et lui fait " + damage + " points de dégâts");
        target.life = target.life - damage;
        if (target.life > 0) {
          console.log(target.name + " a encore " + target.life + " points de vie");
        } else {
          target.life = 0;
          console.error(target.name + " est mort !");
        }
      }
    }
  },

  Player: function(name, life, strength, gold) {
    app.Character.call(this, name, life, strength);
    this.gold = gold;
    this.xp = 0;
    this.key = 0;
    this.afficheInventaire = function() {
      console.warn('Inventory : ' + this.gold + " gold " + this.key + ' key ' + this.xp + ' experiences ' + this.life + ' lifes');
    };
    this.combattre = function(opponent) {
      this.attack(opponent);
      opponent.attack(this);
      if (opponent.life === 0) {
        console.log(this.name + " a tué " + opponent.name + " gagne " +
          opponent.valeur + " points d'expérience" + ' et  ' + opponent.gold + ' d\'or');
        this.xp += opponent.valeur;
        this.gold += opponent.gold;
      }
    };
  },

  createPlayer: function(name, life, strength, gold) {
    var player = new app.Player(name, life, strength, gold);
    return player;
  },

  createEnemy: function(name, life, strength, race) {
    var ennemie = new app.Enemy(name, life, strength, race);
    return ennemie;
  }
};




document.addEventListener("DOMContentLoaded", app.init)
