/* 
 * Projet - RPG 
 * Created by Olivier Malige(Arknoid) 
 * Licensed under The MIT License.
 */

export default {

    players: {

      player1: {
        id: 'player1',
        name: 'arknoid',
        face: 'knight',
        leftHand: 'sword',
        rightHand: 'sword',
        shield : '',
        twoHands: '',
        life: 50,
        mana: 10,
        gold: 0,
        potionLife: 1,
        potionMana: 1,
        voice: [
          'hit3',
          'hit4',
          'hit5',
        ],
        soundMiss: ['sword1'],
        dieSound: ['die1'],
      },

      player2: {
        id: 'player2',
        name: 'darknoid',
        face: 'darkKnight',
        leftHand: 'sword',
        rightHand: '',
        shield : 'shield',
        twoHands: '',
        life: 50,
        mana: 10,
        gold: 0,
        damage: 6,
        potionLife: 2,
        voice: [
          'hit1',
          'hit2',
          'hit3',
        ],
        soundMiss: ['sword1'],
        dieSound: ['die1'],
      },
    },

    //NameSpace pour les ennemies
    enemys: {

      orcWarrior: {
        name: 'orc-warrior',
        face: 'orcWarrior',
        leftHand: 'axe',
        rightHand: 'axe',
        twoHands: '',
        shield : '',
        life: 20,
        mana: 2,
        gold: 10,
        valueXp: 10,
        voice: [
          'orc1',
          'orc2',
          'orc3',
        ],
        soundMiss: ['sword2'],
        dieSound: ['orcDie1'],
      },

      goblin: {
        name: 'goblin',
        face: 'goblin',
        leftHand: 'dagger',
        rightHand: 'dagger',
        twoHands: '',
        shield : '',
        life: 10,
        mana: 1,
        gold: 10,
        valueXp: 10,
        voice: [
          'goblin',
          'goblin1'
        ],

        soundMiss: ['sword3'],
        dieSound: ['goblinDie1'],
      },

      goblinShaman: {
        name: 'goblin-shaman',
        face: 'goblinShaman',
        leftHand: 'mace',
        rightHand: '',
        twoHands: '',
        shield : '',
        life: 5,
        mana: 10,
        gold: 10,
        valueXp: 10,
        voice: [
          'goblin',
          'goblin1'
        ],

        soundMiss: ['sword3'],
        dieSound: ['goblinDie1'],
      },

      goblinArcher: {
        name: 'Goblin-Archer',
        face: 'goblinArcher',
        leftHand: '',
        rightHand: '',
        twoHands: 'bow',
        shield : '',
        life: 10,
        mana: 10,
        gold: 10,
        valueXp: 10,
        voice: [
          'goblin',
          'goblin1'
        ],

        soundMiss: ['sword3'],
        dieSound: ['goblinDie1'],
      },

      lizardMan: {
        name: 'lizardMan',
        face: 'lizardMan',
        leftHand: '',
        rightHand: 'sword',
        twoHands: '',
        shield : 'shield',
        life: 10,
        mana: 10,
        gold: 10,
        valueXp: 10,
        voice: [
          'orc4',
          'orc5'
        ],

        soundMiss: ['sword3'],
        dieSound: ['orcDie1'],
      },

      lizardWarrior: {
        name: 'lizard-Warrior',
        face: 'lizardWarrior',
        leftHand: '',
        rightHand: '',
        twoHands: 'sword2Hands',
        shield : '',
        life: 20,
        mana: 10,
        gold: 10,
        valueXp: 10,
        voice: [
          'orc4',
          'orc5'
        ],

        soundMiss: ['sword3'],
        dieSound: ['orcDie1'],
      },

      orcShaman: {
        name: 'orc-shaman',
        face: 'orcShaman',
        leftHand: 'dagger',
        rightHand: '',
        twoHands: '',
        shield : '',
        life: 20,
        mana: 8,
        gold: 10,
        valueXp: 10,
        voice: [
          'orc4',
          'orc5',
          'orc6',
        ],
        soundMiss: ['sword2'],
        dieSound: ['orcDie1'],
      },

      trollGiant: {
        name: 'troll-giant',
        face: 'troll',
        leftHand: '',
        rightHand: '',
        twoHands: 'greatMace',
        shield : '',
        life: 80,
        mana: 8,
        gold: 10,
        valueXp: 10,
        big: true,
        voice: [
          'giant1',
          'giant2',
          'giant3',
          'giant4',
          'giant5',
        ],
        soundMiss: ['sword2'],
        dieSound: ['trollDie'],
      },

      swampElder: {
        name: 'swamp-Elder',
        face: 'swampElder',
        leftHand: 'greatMace',
        rightHand: '',
        shield : '',
        life: 60,
        mana: 8,
        gold: 10,
        valueXp: 10,
        big: true,
        voice: [
          'giant1',
          'giant2',
          'giant3',
          'giant4',
          'giant5',
        ],
        soundMiss: ['sword2'],
        dieSound: ['trollDie'],
      },
    },

    //Reference all sounds and musics for preload in soundsManager
    sounds: {

      characters: {

        type: 'sound',
        path: 'src/sounds/characters/',
        sounds: [
          'die1',
          'giant1',
          'giant2',
          'giant3',
          'giant4',
          'giant5',
          'goblin',
          'goblin1',
          'goblin2',
          'goblinDie',
          'goblinDie1',
          'hit1',
          'hit2',
          'hit3',
          'hit4',
          'hit5',
          'orc',
          'orc1',
          'orc2',
          'orc3',
          'orc4',
          'orc5',
          'orc6',
          'orcDie1',
          'trollDie',
        ],
      },

      combats: {
        type: 'sound',
        path: 'src/sounds/combats/',
        sounds: [
          'shieldBlock',
          'shieldUp',
          'sword',
          'sword1',
          'sword2',
          'sword3',
          'swordBlock',
          'swordBlock1',
          'swordBlock2',
          'swordBlock3',
          'swordBlock4',
        ],
      },
      musics: {
        type: 'music',
        path: 'src/sounds/musics/',
        sounds: [
          'swamp',
        ],
      }
    },

    items: {


      weapons: {

        shield: {
          name: 'Wood shield',
          toBlock: 2,
          damageBlock: 2,
          speed : 15
        },

        hand: {
          name: 'hand',
          toHit: 2,
          toParry: 1,
          damage: 2,
          speed: 2,
        },

        dagger: {
          name: 'dagger',
          toHit: 3,
          toParry: 2,
          damage: 4,
          speed: 1,
        },

        axe: {
          name: 'axe',
          toHit: 3,
          toParry: 2,
          damage: 8,
          speed: 2,
        },

        greatAxe: {
          name: 'great axe',
          toHit: 3,
          toParry: 3,
          damage: 20,
          speed: 4,
        },

        sword: {
          name: 'sword',
          toHit: 3,
          toParry: 2,
          damage: 8,
          speed: 2,
        },
        mace: {
          name: 'mace',
          toHit: 3,
          toParry: 2,
          damage: 8,
          speed: 2,
        },


        greatSword: {
          name: 'great sword',
          toHit: 3,
          toParry: 3,
          damage: 10,
          speed: 3,
        },

        greatMace: {
          name: 'great mace',
          toHit: 3,
          toParry: 2,
          damage: 10,
          speed: 3,
        },

        bow: {
          name: 'bow',
          toHit: 3,
          toParry: 2,
          damage: 6,
          speed: 3,
        },
      },
    },
  }
