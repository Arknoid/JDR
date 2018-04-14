var app = {
  init : function() {
    console.log("init");
    var Personnage = {
        // Initialise le personnage
        initPerso: function (nom, sante, force) {
            this.nom = nom;
            this.sante = sante;
            this.force = force;
            this.or = 0;
            this.clef = 0;
        },
        // Attaque un personnage cible
        attaquer: function (cible) {
            if (this.sante > 0) {
                var degats = this.force;
                console.log(this.nom + " attaque " + cible.nom + " et lui fait " + degats + " points de dégâts");
                cible.sante = cible.sante - degats;
                if (cible.sante > 0) {
                    console.log(cible.nom + " a encore " + cible.sante + " points de vie");
                } else {
                    cible.sante = 0;
                    console.log(cible.nom + " est mort !");
                }
            } else {
                console.log(this.nom + " ne peut pas attaquer : il est mort...");
            }
        }
    };


  },
  createPlayer:function() {

  },



};

document.addEventListener("DOMContentLoaded", app.init )
