/*
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under the MIT License.
 */

 /** 
 * 
 * @class Player
 */

import Character from 'src/js/class/Characters/Character';

 export class Player extends Character {
    constructor (obj) {
      super(obj);
      this.id = obj.id;
      this.cardSize = 'tiny';
      this.sectionId = '#playerSection';
  
    }
  }
  export default Player;