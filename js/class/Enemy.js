/**
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under The MIT License.
 *
 * @class Enemy extend Character
 */
class Enemy extends Character {
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
    this.skillsAttack.forEach(function() {
      const inter = setInterval(function() {
        //Global timer
        if (self.canUseSkills && !app.paused) {
          app.combatManager('enemy1');
          self.canUseSkills = false;
          //init  Global Timer
          setTimeout(function() {
            self.canUseSkills = true;
          }, 1500);
        }
      }, app.randomNumber(30, 50) * 100);
      self.attackInterval.push(inter);
    });
  }
  clearAutoAttack() {
    this.attackInterval.forEach(function(inter) {
      clearInterval(inter);
    });
  }
}
