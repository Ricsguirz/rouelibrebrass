/* =========================================================================
   Fabrique un vrai fichier PDF directement dans le navigateur, sans aucune
   bibliothèque extérieure ni connexion. Le fichier part dans le dossier
   Téléchargements en un clic, sans passer par la boîte de dialogue
   d'impression.

   Un PDF est un fichier texte structuré : on écrit les objets à la suite,
   puis une table qui indique la position de chacun. C'est ce que fait ce
   fichier, avec la police Helvetica intégrée aux lecteurs PDF.
   ========================================================================= */

(function (global) {
  'use strict';

  /* Les polices PDF de base parlent le WinAnsi, pas l'Unicode : on traduit
     les caractères typographiques français qui n'y figurent pas tels quels. */
  function versWinAnsi(texte) {
    var t = String(texte)
      .replace(/…/g, '\x85')            // …
      .replace(/€/g, '\x80')            // €
      .replace(/[‘’]/g, "'")       // ' '
      .replace(/[“”]/g, '"')       // " "
      .replace(/—/g, '\x97')            // —
      .replace(/–/g, '\x96')            // –
      .replace(/[   ]/g, ' ') // espaces insécables
      .replace(/•/g, '\x95');           // •
    var sortie = '';
    for (var i = 0; i < t.length; i++) {
      var c = t.charCodeAt(i);
      sortie += (c <= 255) ? t[i] : '?';
    }
    return sortie;
  }

  function echapper(t) {
    return t.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  /* Coupe une ligne trop longue pour la largeur de page. */
  function couper(ligne, maxi) {
    if (ligne.length <= maxi) return [ligne];
    var mots = ligne.split(' ');
    var lignes = [];
    var courante = '';
    for (var i = 0; i < mots.length; i++) {
      var essai = courante ? courante + ' ' + mots[i] : mots[i];
      if (essai.length > maxi && courante) {
        lignes.push(courante);
        courante = mots[i];
      } else {
        courante = essai;
      }
    }
    if (courante) lignes.push(courante);
    return lignes;
  }

  /* blocs = [{ style: 'titre' | 'soustitre' | 'texte' | 'espace', texte: '…' }] */
  function construirePdf(blocs) {
    var LARGEUR = 595, HAUTEUR = 842;   // A4 en points
    var MARGE = 56;
    var y = HAUTEUR - MARGE;
    var flux = '';

    blocs.forEach(function (b) {
      if (b.style === 'espace') { y -= (b.taille || 10); return; }

      var police = (b.style === 'titre' || b.style === 'soustitre') ? '/F2' : '/F1';
      var corps  = b.style === 'titre' ? 17 : (b.style === 'soustitre' ? 10 : 10);
      var interligne = b.style === 'titre' ? 22 : 15;
      var maxi = b.style === 'titre' ? 40 : 82;

      couper(versWinAnsi(b.texte), maxi).forEach(function (ligne) {
        flux += 'BT ' + police + ' ' + corps + ' Tf ' +
                MARGE + ' ' + y + ' Td (' + echapper(ligne) + ') Tj ET\n';
        y -= interligne;
      });
    });

    var objets = [
      '<</Type/Catalog/Pages 2 0 R>>',
      '<</Type/Pages/Kids[3 0 R]/Count 1>>',
      '<</Type/Page/Parent 2 0 R/MediaBox[0 0 ' + LARGEUR + ' ' + HAUTEUR + ']' +
        '/Resources<</Font<</F1 5 0 R/F2 6 0 R>>>>/Contents 4 0 R>>',
      '<</Length ' + flux.length + '>>\nstream\n' + flux + 'endstream',
      '<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>',
      '<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>'
    ];

    var pdf = '%PDF-1.4\n';
    var positions = [];
    objets.forEach(function (o, i) {
      positions.push(pdf.length);
      pdf += (i + 1) + ' 0 obj\n' + o + '\nendobj\n';
    });

    var debutTable = pdf.length;
    pdf += 'xref\n0 ' + (objets.length + 1) + '\n0000000000 65535 f \n';
    positions.forEach(function (p) {
      pdf += ('0000000000' + p).slice(-10) + ' 00000 n \n';
    });
    pdf += 'trailer\n<</Size ' + (objets.length + 1) + '/Root 1 0 R>>\n' +
           'startxref\n' + debutTable + '\n%%EOF';

    var octets = new Uint8Array(pdf.length);
    for (var i = 0; i < pdf.length; i++) octets[i] = pdf.charCodeAt(i) & 0xff;
    return new Blob([octets], { type: 'application/pdf' });
  }

  function telecharger(blob, nomFichier) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  global.RecuPDF = { construire: construirePdf, telecharger: telecharger };
})(window);
