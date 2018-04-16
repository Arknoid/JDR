var app = {

  //tableau a remplir d'ennemie grace a createEnemysPool();
  enemyPool: [],

  // obj pour cree le joueur (temporaire)
  arknoid: {
    name: 'arknoid',
    life: 100,
    strength: 5,
    dexterity: 15,
    intelligence: 20,
    gold: 100
  },

  //enemie de base pour les testes
  orc: {
    name: 'zogzog',
    life: 20,
    strength: 10,
    dexterity: 10,
    inteligence: 5,
    race: 'orc'
  },


  init: function() {
    // debugger;
    app.start();

  },

  //Demarage du jeu !
  start: function() {

    //Apelle du constructeur du joueur  avec un objet contenan  "nom,points de vie,force,dexterité,inteligence,or"
    app.player = app.createPlayer(app.arknoid);

    //debug
    app.player.showInventory();

    //Generation d'ennemies
    app.createEnemysPool(5);


    //Pour chaque enemies generer le joueur doit les combattres les uns apres les autres (pour le moment)
    app.enemyPool.forEach(function(enemy) {
      while (enemy.life > 0 && app.player.life > 0) {
        app.player.combat(enemy);
        //debug
        app.player.showInventory();
      };
    });

    app.gameOver();
  },

  //Generateur de nombres aleatoir arondie
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
    this.describ = function() {
      console.log("Je suis " + this.name + ' et j\'ai ' + this.life + ' de vies avec ' + this.strength + ' de strength ');
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
    this.race = obj.race;
    this.weapon = new app.items.weapons.Arms('Rusty sword', 1, 4);
    //petite presentation pour debug
    this.describ = function() {
      console.log("je suis " + this.name + 'de race : ' + this.race + ', j\'ai ' + this.life + ' de vies  et ' + this.strength + ' de strength.');
    };

    //Definie la Valeur du nombre d 'experiences recus en cas d'élimination suivant la race
    if (this.race === 'orc') {
      this.valeur = 100;
      this.gold = 20;
    };
  },


  //Prototype de creation du joueur
  Player: function(obj) {
    //Apelle du construteur du Prototype de base 'Charactere'
    app.Character.call(this, obj);
    //Plus des proprietés spécifique
    this.gold = obj.gold;
    this.xp = 0;
    this.key = 0;
    // Arme de base choisie dans le Namespace items.weapons
    this.weapon = new app.items.weapons.Arms('Axe', 4, 6);

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
        this.xp += opponent.valeur;
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
    for (var index = 0; index < numberToAdd; index++) {
      app.enemyPool.push(app.createEnemy(app.orc));
    }
  },

  gameOver: function() {
    console.error("You are Dead");
    console.error("Game Over");
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
