/*
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under the MIT License.
 */

 /** 
 * @class Enemy extend Character
 */

import Character from 'src/js/class/Characters/Character';
import {randomNumber} from 'src/js/utils';
import app from 'src/app';


export class Enemy extends Character {
  constructor(obj) {
    super(obj);
    this.valueXp = obj.valueXp;
    this.id = 'enemy1';
    this.sectionId = '#enemySection';
    this.attackInterval = [];
    if (obj.big) {
      this.cardSize = 'big'
    } else {
      this.cardSize = 'normal';
    }
    
  }

  setAutoAttack() {
    let self = this;

      if (self.twoHandedWeapon === false) {
        //left Hand
        let inter = setInterval(() => {
          //Global timer
          if (self.canUseSkills && !app.game.paused) {
            app.game.combatManager('enemy1','leftHand');
            self.canUseSkills = false;
            //init  Global Timer
            setTimeout(function() {
              self.canUseSkills = true;
            }, self.leftHand.speed );
          }
        },randomNumber(30, 50) * 100);
        self.attackInterval.push(inter);

        //right Hand
        inter = setInterval(() => {
          //Global timer
          if (self.canUseSkills && !app.game.paused) {
            app.game.combatManager('enemy1','rightHand');
            self.canUseSkills = false;
            //init  Global Timer
            setTimeout(function() {
              self.canUseSkills = true;
            }, self.rightHand.speed );
          }
        },randomNumber(30, 50) * 100);
        self.attackInterval.push(inter);
      }
      
  }
  clearAutoAttack() {
    this.attackInterval.forEach(function(inter) {
      clearInterval(inter);
    });
  }
}
export default Enemy;