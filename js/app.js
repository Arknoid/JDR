var app = {
  init: function() {
    app.joueur = app.creationJoueur('arknoid', 100, 5, 10);
    app.joueur.description();
    app.joueur.showOr();
    app.orc = app.creationEnemmie('ZogZog', 30 , 4 , 'orc');
    app.orc.description();

  },
  Ennemie: function(nom, sante, force, race) {
    app.Personnage.call(this, nom, sante, force, race);
    this.race = race;
    this.description = function() {
      console.log("je suis " + this.nom + 'je suis un : '+this.race+' j\'ai ' + this.sante + ' de sante et ' + this.force + ' de force.');
    };
  },

  Personnage: function(nom, sante, force) {
    this.nom = nom;
    this.sante = sante;
    this.force = force;
    this.description = function() {
      console.log("je suis " + this.nom + ' j\'ai ' + this.sante + ' de sante et ' + this.force + ' de force.');
    };
  },

  Joueur: function(nom, sante, force, or) {
    app.Personnage.call(this, nom, sante, force);
    this.or = or;
    this.showOr = function() {
      console.log(this.or + " or");
    };
  },

  creationJoueur: function(nom, sante, force, or) {
    var joueur = new app.Joueur(nom, sante, force, or);
    return joueur;
  },

  creationEnemmie: function(nom, sante, force, race) {
     var ennemie = new app.Ennemie(nom ,sante , force , race);
     return ennemie;
  }
};




document.addEventListener("DOMContentLoaded", app.init)
