var app = {

  //tableau a remplir d'ennemies grace a createEnemysPool();
  enemyPool: [],
  numberEnemy : 50,


  init: function() {
    // //Apelle du constructeur du joueur  avec un objet contenan  "nom,points de vie,force,dexterité,inteligence,or"
    // app.player = app.createPlayer(app.arknoid);
    //
    // //Generation d'ennemies
    // app.createEnemysPool(5);

    app.start();

  },

  //Demarage du jeu !
  start: function() {

    //Apelle du constructeur du joueur  avec un objet contenan  "nom,points de vie,force,dexterité,inteligence,or"
    app.player = app.createPlayer(app.player.arknoid);

    //Generation d'ennemies
    app.createEnemysPool(app.numberEnemy);

    //Pour chaque enemies generer le joueur doit les combattres les uns apres les autres (pour le moment)
    app.enemyPool.forEach(function(enemy) {
      while (enemy.life > 0 && app.player.life > 0) {
        app.player.combat(enemy);
        app.player.showInventory();
      };
    });
    if (app.player.life > 0) {
      app.win();
    } else
    app.gameOver();
  },

  //Generateur de nombres aleatoire arondie
  randomNumber: function(min = 0, max = 0) {
    return Math.round(Math.random() * (max - min) + min);
  },

  //Prototype de Base ! qui peu evoluer vers 'player' ou  'enemy' grace au systeme d'heritage;
  Character: function(obj) {
    this.name = obj.name;
    this.life = obj.life;
    this.strength = obj.strength;
    this.dexterity = obj.dexterity;
    this.intelligence = obj.intelligence;
    this.gold = obj.gold;
    this.describ = function() {
      console.log("Je suis " + this.name + ' et j\'ai ' + this.life + ' de point de vies');
    };
    // Attaque un enemie cible
    this.attack = function(target) {
      if (this.life > 0) {
        //les degats sont calculer avec la force + un nombre aleatoir suivant la puissance min et max de l'arme du porteur
        var damage = this.strength + app.randomNumber(this.weapon.damageMin, this.weapon.damageMax);
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

  //Prototype pour les ennemies
  Enemy: function(obj) {
    app.Character.call(this, obj);
    this.valueXp = obj.valueXp;
    this.weapon = new app.items.weapons.Arms(obj.arms.name, obj.arms.damageMin, obj.arms.damageMax);
    //petite presentation pour debug
    this.describ = function() {
      console.log("je suis " + this.name + ', j\'ai ' + this.life + ' de vies  et ' + this.strength + ' de strength.');
    };
  },

  //Prototype de creation du joueur
  Player: function(obj) {
    //Apelle du construteur du Prototype de base 'Charactere'
    app.Character.call(this, obj);
    //Plus des proprietés spécifique
    this.xp = 0;
    this.key = 0;
    // Arme de base choisie dans le Namespace items.weapons
    this.weapon = new app.items.weapons.Arms(obj.arms.name, obj.arms.damageMin, obj.arms.damageMax);

    //Affiche inventaire pour debug
    this.showInventory = function() {
      console.warn('Inventory : ' + this.gold + " gold " + this.key + ' key ' + this.xp + ' experiences ' + this.life + ' lifes ' + 'arms : ' + this.weapon.name);
    };

    this.combat = function(opponent) {
      //Character.attack()
      this.attack(opponent);
      opponent.attack(this);
      if (opponent.life === 0) {
        console.log(this.name + " a tué " + opponent.name + " gagne " +
          opponent.valeur + " points d'expérience" + ' et  ' + opponent.gold + ' d\'or');
        this.xp += opponent.valueXp;
        this.gold += opponent.gold;
      }
    };
  },

  //Fonction pour crée le joueur basé sur le Prototype charactere -> player (!!!Voué a etre remplacer pour le DOM!! )
  createPlayer: function(obj) {
    var player = new app.Player(obj);
    return player;
  },

  //Fonction pour crée un enemie  basé sur le Prototype charactere -> Enemy (!!!Voué a etre remplacer dans le DOM!! )
  createEnemy: function(obj) {
    var ennemie = new app.Enemy(obj);
    return ennemie;
  },

  //Permet de definir le nombre d'ennemies en lice
  createEnemysPool: function(numberToAdd) {
    var randEnemy;
    for (var index = 0; index < numberToAdd; index++) {
      switch (randEnemy = app.randomNumber(1, 6)) {
        case 1:
        case 2:
          app.enemyPool.push(app.createEnemy(app.enemys.orc));
          break;
        case 3:
        case 4:
        case 5:
          app.enemyPool.push(app.createEnemy(app.enemys.goblins));
          break;
        case 6:
          app.enemyPool.push(app.createEnemy(app.enemys.troll));
          break;
      }

    }
  },

  gameOver: function() {
    console.error("You are Dead");
    console.error("Game Over");
  },
  win: function() {
  console.error("You win");
  },
  //NameSpace pour le joueur
  player: {
    arknoid: {
      name: 'arknoid',
      life: 2000,
      strength: 5,
      dexterity: 15,
      intelligence: 20,
      gold: 100,
      arms: {
        name: 'Sword',
        damageMin: 4,
        damageMax: 8,
      }
    },
  },

  //NameSpace pour les ennemies
  enemys: {
    //enemies de base pour les testes
    orc: {
      name: 'orc',
      life: 5,
      strength: 6,
      dexterity: 10,
      intelligence: 5,
      gold: 10,
      valueXp: 10,
      arms: {
        name: 'Axe',
        damageMin: 1,
        damageMax: 6,
      }
    },

    goblins: {
      name: 'goblins',
      life: 4,
      strength: 4,
      dexterity: 15,
      intelligence: 8,
      gold: 20,
      valueXp: 5,
      arms: {
        name: 'Rusty sword',
        damageMin: 1,
        damageMax: 3,
      }
    },

    troll: {
      name: 'troll',
      life: 10,
      strength: 10,
      dexterity: 5,
      intelligence: 2,
      gold: 100,
      valueXp: 20,
      arms: {
        name: 'Mace',
        damageMin: 5,
        damageMax: 15,
      }
    },
  },
  //NameSpace pour les items
  items: {
    weapons: {
      Arms: function(name, damageMin, damageMax) {
        this.name = name;
        this.damageMin = damageMin;
        this.damageMaw = damageMax;
        //this.speed =
      },

    },
    potions: {
      life: function() {
        this.name = 'Potion of life';
        this.powerMin = 10;
        this.powerMax = 50;
        //this.cooldown =
      },
    },
  }
};


document.addEventListener("DOMContentLoaded", app.init)
