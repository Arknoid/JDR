var data = {
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
      numberAttack: 2,
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

}
