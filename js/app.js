var app = {

  //tableau a remplir d'ennemies grace a createEnemysPool();
  enemyPool: [],
  numberEnemy: 5,


  init: function() {
    app.start();

  },

  //Demarage du jeu !
  start: function() {
    // debugger;
    //Apelle du constructeur du joueur  avec un objet contenan  "nom,points de vie,force,dexterité,inteligence,or"
    app.player = app.createPlayer(app.player.arknoid);

    //Generation d'ennemies
    app.createEnemysPool(app.numberEnemy);

    //Pour chaques enemies generer le joueur doit les combattres les uns apres les autres
    app.enemyPool.forEach(function(enemy) {
      while (enemy.life > 0 && app.player.life > 0) {
        app.player.combat(enemy);
      };
    });
    if (app.player.life > 0) {
      app.win();
      app.player.showInventory();
    } else
      app.gameOver();
  },

  //Generateur de nombres aleatoire arondie
  randomNumber: function(min = 0, max = 0) {
    return Math.round(Math.random() * (max - min) + min);
  },
  setPercentage: function(number, percentage) {
    return Math.round(number * percentage / 100);
  },
  //Prototype de Base ! qui peu evoluer vers 'player' ou  'enemy' grace au systeme d'heritage;
  Character: function(obj) {
    this.name = obj.name;
    this.life = obj.life;
    this.strength = obj.strength;
    this.dexterity = obj.dexterity;
    this.intelligence = obj.intelligence;
    this.gold = obj.gold;
    //Calcules de compétence secondaire
    this.attackBonus = app.setPercentage(this.strength, 20);
    this.dodge = app.setPercentage(this.dexterity, 50);


    this.describ = function() {
      console.log("Je suis " + this.name + ' et j\'ai ' + this.life + ' de point de vies');
    };

    // Attaque un enemie cible
    this.attack = function(target) {
      if (app.randomNumber(1,6) > this.weapon.toHit ) {

        var damage = this.attackBonus + app.randomNumber(this.weapon.damageMin, this.weapon.damageMax);

        console.log(this.name + " attaque " + target.name + " et lui fait " + damage + " points de dégâts");
        target.life = target.life - damage;

        if (target.life > 0) {
          console.log(target.name + " a encore " + target.life + " points de vie");
        } else {
          target.life = 0;
          console.error(target.name + " est mort !");
        }
      }else {
        console.warn(this.name +" loupe son attaque");
      }
    }
  },

  //Prototype pour les ennemies
  Enemy: function(obj) {
    //appel du construceur de Character
    app.Character.call(this, obj);
    this.valueXp = obj.valueXp;
    this.weapon = new app.weapons.Arms(obj.arms.name, obj.arms.damageMin, obj.arms.damageMax ,obj.arms.toHit);
    //petite presentation pour debug
    this.describ = function() {
      console.log("je suis " + this.name + ', j\'ai ' + this.life + ' de vies  et ' + this.strength + ' de strength.');
    };
  },

  //Prototype du joueur
  Player: function(obj) {
    //Apelle du construteur du Prototype de base 'Charactere'
    app.Character.call(this, obj);
    //Plus des proprietés spécifique
    this.xp = 0;

    // Arme de base choisie dans le Namespace items.weapons
    this.weapon = new app.weapons.Arms(obj.arms.name, obj.arms.damageMin, obj.arms.damageMax, obj.arms.toHit);

    //Affiche inventaire pour debug
    this.showInventory = function() {
      console.warn('Inventory : ' + this.gold + " gold "  + this.xp + ' experiences ' + this.life + ' lifes ' + 'arms : ' + this.weapon.name);
    };

    this.combat = function(opponent) {
      //Character.attack()
      this.attack(opponent);
      opponent.attack(this);
      if (opponent.life === 0) {
        this.xp += opponent.valueXp;
        this.gold += opponent.gold;
        console.warn(this.name + " a tué " + opponent.name + " et a gagné : " + opponent.valueXp + 'Xp et ' + opponent.gold + ' Or ');
      }
    };
  },

  //Fonction pour crée le joueur basé sur le Prototype charactere -> player (!!!Voué a etre remplacer pour le DOM!! )
  createPlayer: function(obj) {
    var player = new app.Player(obj);
    return player;
  },

  //Fonction pour crée un enemie  basé sur le Prototype charactere -> Enemy
  createEnemy: function(obj) {
    var enemy = new app.Enemy(obj);
    return enemy;
  },

  //Permet de definir le nombre d'ennemies en lice
  createEnemysPool: function(numberToAdd) {
    var randEnemy;
    for (var index = 0; index < numberToAdd; index++) {
      switch (randEnemy = app.randomNumber(1, 6)) {
        case 1:
        case 2:
          app.enemyPool.push(app.createEnemy(app.enemys.goblins));
          break;
        case 3:
        case 4:
        case 5:
          app.enemyPool.push(app.createEnemy(app.enemys.orc));
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
      life: 50,
      strength: 20,
      dexterity: 15,
      intelligence: 20,
      gold: 100,
      arms: {
        name: 'Sword',
        damageMin: 4,
        damageMax: 8,
        toHit : 3,
      }
    },
  },

  //NameSpace pour les ennemies
  enemys: {
    //enemies de base pour les tests
    orc: {
      name: 'orc',
      life: 10,
      strength: 16,
      dexterity: 10,
      intelligence: 5,
      gold: 10,
      valueXp: 10,
      arms: {
        name: 'Axe',
        damageMin: 1,
        damageMax: 6,
        toHit: 3,
      },
    },

    goblins: {
      name: 'goblin',
      life: 6,
      strength: 10,
      dexterity: 15,
      intelligence: 8,
      gold: 20,
      valueXp: 5,
      arms: {
        name: 'Rusty sword',
        damageMin: 1,
        damageMax: 3,
        toHit: 2,
      },
    },

    troll: {
      name: 'troll',
      life: 20,
      strength: 25,
      dexterity: 5,
      intelligence: 2,
      gold: 100,
      valueXp: 20,
      arms: {
        name: 'Mace',
        damageMin: 10,
        damageMax: 15,
        toHit: 5,
      },
    },
  },
  weapons: {
    //Constructeur
    Arms: function(name, damageMin, damageMax, toHit) {
      this.name = name;
      this.damageMin = damageMin;
      this.damageMaw = damageMax;
      this.toHit = toHit
      //this.speed =
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


document.addEventListener("DOMContentLoaded", app.init)
