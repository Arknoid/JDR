var app = {
  ennemiesPool: [],

  init: function() {
    app.start();
  },

  start: function() {
    app.joueur = app.creationJoueur('arknoid', 100, 5, 10);
    app.joueur.description();
    app.joueur.afficheInventaire();

    app.createEnnemiesPool(5);
    app.ennemiesPool.forEach(function(enemies) {
      while (enemies.sante > 0) {
        app.joueur.combattre(enemies);
        app.joueur.afficheInventaire();
      };
    });
  },

  createEnnemiesPool : function (nombre) {
    for (var index = 0 ; index < nombre; index++) {
      app.ennemiesPool.push(app.creationEnemmie('ZogZog'+index, 6, 4, 'orc'));
    }
  },

  Ennemie: function(nom, sante, force, race) {
    app.Personnage.call(this, nom, sante, force, race);
    this.race = race;
    this.description = function() {
      console.log("je suis " + this.nom + 'je suis un : ' + this.race + ' j\'ai ' + this.sante + ' de sante et ' + this.force + ' de force.');
    };

    //Definie la Valeur du nombre d 'experiences en cas d'élimination suivant la race
    if (this.race === 'orc') {
      this.valeur = 100;
      this.or = 20;
    };
  },


  Personnage: function(nom, sante, force) {
    this.nom = nom;
    this.sante = sante;
    this.force = force;
    this.description = function() {
      console.log("je suis " + this.nom + ' j\'ai ' + this.sante + ' de sante et ' + this.force + ' de force.');
    };
    // Attaque un Ennemie cible
    this.attaquer = function(cible) {
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
        ennemiesPool = [],
          console.log(this.nom + " ne peut pas attaquer : il est mort...");
      }
    }
  },

  Joueur: function(nom, sante, force, or) {
    app.Personnage.call(this, nom, sante, force);
    this.or = or;
    this.xp = 0;
    this.clef = 0;
    this.afficheInventaire = function() {
      console.log('Inventaire : ' + this.or + " or " + this.clef + ' clef ' + this.xp + ' experiences ' + this.sante + ' points de vies');
    };
    this.combattre = function(adversaire) {
      this.attaquer(adversaire);
      adversaire.attaquer(this);
      if (adversaire.sante === 0) {
        console.log(this.nom + " a tué " + adversaire.nom + " gagne " +
          adversaire.valeur + " points d'expérience" + ' et  ' + adversaire.or + ' d\'or');
        this.xp += adversaire.valeur;
        this.or += adversaire.or;
      }
    };
  },

  creationJoueur: function(nom, sante, force, or) {
    var joueur = new app.Joueur(nom, sante, force, or);
    return joueur;
  },

  creationEnemmie: function(nom, sante, force, race) {
    var ennemie = new app.Ennemie(nom, sante, force, race);
    return ennemie;
  }
};




document.addEventListener("DOMContentLoaded", app.init)
