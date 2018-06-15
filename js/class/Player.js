/**
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under the MIT License.
 *
 * @class Player
 */

  class Player extends Character {
    constructor (obj) {
      super(obj);
      this.id = obj.id;
      this.cardSize = 'tiny';
      this.sectionId = '#playerSection';
    }
  }
