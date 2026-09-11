/* =========================================================================
   Version PDF d'une proposition — pour les organisateurs qui ne peuvent pas
   ouvrir le lien (postes de mairie verrouillés, filtres de sécurité…).

   Le PDF reprend le contenu de la page de proposition et ajoute un encadré
   « Bon pour accord » à signer et à renvoyer par e-mail.

   Utilise RecuPDF (recu-pdf.js), qui doit être chargé avant ce fichier.
   Les données sont celles du lien : o organisateur, e événement, d date,
   h horaires, l lieu, m effectif, t tarif, f transport, x validité,
   i référence, n précisions.
   ========================================================================= */

(function (global) {
  'use strict';

  function euros(v) {
    var n = Number(v) || 0;
    return n.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' €';
  }

  function dateFr(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function blocs(d) {
    var tarif = Number(d.t) || 0;
    var frais = Number(d.f) || 0;
    var b = [];

    b.push({ style: 'titre',     texte: 'LE ROUE LIBRE BRASS' });
    b.push({ style: 'soustitre', texte: "Proposition d'animation musicale" });
    b.push({ style: 'espace', taille: 6 });
    b.push({ style: 'texte',     texte: 'Pour : ' + (d.o || '') });
    var ref = [];
    if (d.i) ref.push('Référence : ' + d.i);
    if (d.x) ref.push('Proposition valable jusqu’au ' + dateFr(d.x));
    if (ref.length) b.push({ style: 'petit', texte: ref.join('   ·   ') });
    b.push({ style: 'espace', taille: 4 });
    b.push({ style: 'ligne' });

    b.push({ style: 'soustitre', texte: 'LE GROUPE' });
    b.push({ style: 'texte', texte: 'Le Roue Libre Brass est une fanfare de rue et banda composée principalement de cuivres — trompettes, trombones, sousaphone et batterie (' + (d.m || '6 à 8') + ' musiciens).' });
    b.push({ style: 'texte', texte: 'Notre répertoire est volontairement varié : banda festive pour faire chanter, dance pour faire danser, et un registre plus feutré pour les apéritifs. Nous jouons par séquences de 30 minutes entrecoupées de pauses.' });
    b.push({ style: 'texte', texte: 'Nous tournons à 100 % à l’énergie humaine : ni sono, ni électricité, ni scène à prévoir.' });
    b.push({ style: 'petit', texte: 'Vidéos, photos et répertoire : rouelibrebrass.fr' });
    b.push({ style: 'espace', taille: 10 });

    b.push({ style: 'soustitre', texte: 'DÉTAIL DE LA PRESTATION' });
    b.push({ style: 'texte', texte: 'Événement : ' + (d.e || '') });
    b.push({ style: 'texte', texte: 'Date : ' + (d.d || '') });
    b.push({ style: 'texte', texte: 'Horaires : ' + (d.h || '') });
    b.push({ style: 'texte', texte: 'Lieu : ' + (d.l || '') });
    if (d.n) b.push({ style: 'texte', texte: 'Précisions : ' + d.n });
    b.push({ style: 'espace', taille: 10 });

    b.push({ style: 'soustitre', texte: 'TARIF' });
    b.push({ style: 'texte', texte: 'Prestation du groupe : ' + euros(tarif) });
    b.push({ style: 'texte', texte: 'Frais de transport : ' + (frais ? euros(frais) : 'inclus') });
    b.push({ style: 'soustitre', texte: 'TOTAL : ' + euros(tarif + frais) });
    b.push({ style: 'petit', texte: 'Association Roue Libre Production — prestation non soumise à TVA. Le repas et les boissons des musiciens sont à prévoir par l’organisateur.' });
    b.push({ style: 'espace', taille: 14 });

    b.push({ style: 'ligne' });
    b.push({ style: 'soustitre', texte: 'BON POUR ACCORD' });
    b.push({ style: 'texte', texte: 'Pour valider cette proposition, merci de compléter et de signer ce document, puis de nous le retourner par e-mail à contact@rouelibrebrass.fr. Nous vous adresserons ensuite la convention.' });
    b.push({ style: 'espace', taille: 10 });
    b.push({ style: 'texte', texte: 'Nom et prénom : ..........................................................................................' });
    b.push({ style: 'espace', taille: 6 });
    b.push({ style: 'texte', texte: 'Fonction : ..................................................................................................' });
    b.push({ style: 'espace', taille: 6 });
    b.push({ style: 'texte', texte: 'Structure : ................................................................................................' });
    b.push({ style: 'espace', taille: 6 });
    b.push({ style: 'texte', texte: 'Téléphone : ...............................................     Date : ...................................' });
    b.push({ style: 'espace', taille: 10 });
    b.push({ style: 'texte', texte: 'Signature, précédée de la mention « Bon pour accord » :' });
    b.push({ style: 'espace', taille: 56 });

    b.push({ style: 'ligne' });
    b.push({ style: 'petit', texte: 'Association Roue Libre Production · 330 chemin de Font-Côtes · 26600 Chanos-Curson' });
    b.push({ style: 'petit', texte: 'Pierre-Henri Guiral · 06 22 38 14 05 · contact@rouelibrebrass.fr · rouelibrebrass.fr' });

    return b;
  }

  function telecharger(d) {
    var nom = 'Proposition-Roue-Libre-Brass' + (d.i ? '-' + d.i : '') + '.pdf';
    RecuPDF.telecharger(RecuPDF.construire(blocs(d)), nom);
  }

  global.PropositionPDF = { telecharger: telecharger };
})(window);
