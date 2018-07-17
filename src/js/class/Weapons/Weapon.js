/*
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under the MIT License.
 */

 /**
 * @class Weapon
 */

class Weapon {

  constructor (obj) {
    this.name = obj.name;
    this.toHit = obj.toHit;
    this.toParry = obj.toParry;
    this.damage = obj.damage;
    this.speed = obj.speed;
  }

}
export default Weapon;