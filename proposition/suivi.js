/* =========================================================================
   Envoi discret des informations de suivi vers le tableur Google.

   Tant que l'adresse ci-dessous est vide, ce fichier ne fait rien du tout :
   ni le générateur ni la page de proposition ne s'en trouvent affectés.
   ========================================================================= */

(function (global) {
  'use strict';

  /* Adresse de l'application web Apps Script, à renseigner une fois pour
     toutes. Elle ressemble à :
     https://script.google.com/macros/s/AKfycb.../exec  */
  var ADRESSE_SUIVI = '';

  /* L'envoi est volontairement « sans retour » : on ne lit pas la réponse et
     on n'attend pas. Le suivi ne doit jamais ralentir ni bloquer un client. */
  function envoyer(charge) {
    if (!ADRESSE_SUIVI) return;

    var texte = JSON.stringify(charge);
    try {
      if (navigator.sendBeacon) {
        // Fonctionne même si la page se ferme juste après (envoi du formulaire).
        navigator.sendBeacon(
          ADRESSE_SUIVI,
          new Blob([texte], { type: 'text/plain;charset=UTF-8' })
        );
        return;
      }
      fetch(ADRESSE_SUIVI, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: texte
      });
    } catch (e) {
      /* Un suivi qui échoue ne doit avoir aucune conséquence visible. */
    }
  }

  function aujourdhui() {
    var n = new Date();
    return ('0' + n.getDate()).slice(-2) + '/' +
           ('0' + (n.getMonth() + 1)).slice(-2) + '/' +
           n.getFullYear();
  }

  function maintenant() {
    var n = new Date();
    return aujourdhui() + ' ' +
           ('0' + n.getHours()).slice(-2) + ':' +
           ('0' + n.getMinutes()).slice(-2);
  }

  global.Suivi = {
    envoyer: envoyer,
    aujourdhui: aujourdhui,
    maintenant: maintenant,
    actif: function () { return !!ADRESSE_SUIVI; }
  };
})(window);
