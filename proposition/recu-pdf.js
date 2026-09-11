/* =========================================================================
   Fabrique un vrai fichier PDF directement dans le navigateur, sans aucune
   bibliothèque extérieure ni connexion. Le fichier part dans le dossier
   Téléchargements en un clic.

   Un PDF est un fichier texte structuré : on écrit les objets à la suite,
   puis une table qui indique la position de chacun. C'est ce que fait ce
   fichier, avec les polices Helvetica intégrées à tous les lecteurs PDF.

   Les pages s'enchaînent automatiquement quand le texte dépasse le bas
   de la feuille.
   ========================================================================= */

(function (global) {
  'use strict';

  /* Les polices PDF de base parlent le WinAnsi, pas l'Unicode : on traduit
     les caractères typographiques français qui n'y figurent pas tels quels. */
  function versWinAnsi(texte) {
    var t = String(texte)
      .replace(/…/g, '\x85')
      .replace(/€/g, '\x80')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/—/g, '\x97')
      .replace(/–/g, '\x96')
      .replace(/[   ]/g, ' ')
      .replace(/•/g, '\x95');
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

  /* blocs = [{ style: 'titre' | 'soustitre' | 'texte' | 'petit' | 'espace' | 'ligne' | 'saut', texte, taille }] */
  function construirePdf(blocs) {
    var LARGEUR = 595, HAUTEUR = 842;   // A4 en points
    var MARGE = 56, BAS = 56;

    var pages = [];
    var flux = '';
    var y = HAUTEUR - MARGE;

    function nouvellePage() {
      pages.push(flux);
      flux = '';
      y = HAUTEUR - MARGE;
    }
    function reserver(hauteur) {
      if (y - hauteur < BAS) nouvellePage();
    }

    var STYLES = {
      titre:     { police: '/F2', corps: 18, interligne: 23, maxi: 44 },
      soustitre: { police: '/F2', corps: 11, interligne: 17, maxi: 80 },
      texte:     { police: '/F1', corps: 10, interligne: 14, maxi: 92 },
      petit:     { police: '/F1', corps: 8.5, interligne: 12, maxi: 108 }
    };

    blocs.forEach(function (b) {
      if (b.style === 'espace') {
        y -= (b.taille || 10);
        if (y < BAS) nouvellePage();
        return;
      }
      if (b.style === 'saut') { nouvellePage(); return; }
      if (b.style === 'ligne') {
        reserver(14);
        flux += '0.6 w ' + MARGE + ' ' + y + ' m ' + (LARGEUR - MARGE) + ' ' + y + ' l S\n';
        y -= 14;
        return;
      }

      var s = STYLES[b.style] || STYLES.texte;
      couper(versWinAnsi(b.texte), s.maxi).forEach(function (ligne) {
        reserver(s.interligne);
        flux += 'BT ' + s.police + ' ' + s.corps + ' Tf ' +
                MARGE + ' ' + y + ' Td (' + echapper(ligne) + ') Tj ET\n';
        y -= s.interligne;
      });
    });
    pages.push(flux);

    /* Objets : 1 catalogue, 2 liste des pages, 3 et 4 polices,
       puis une paire « page + contenu » par page. */
    var objets = [];
    objets[1] = '<</Type/Catalog/Pages 2 0 R>>';
    objets[3] = '<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>';
    objets[4] = '<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>';

    var enfants = [];
    var numero = 5;
    pages.forEach(function (contenu) {
      var idPage = numero, idContenu = numero + 1;
      numero += 2;
      enfants.push(idPage + ' 0 R');
      objets[idPage] = '<</Type/Page/Parent 2 0 R/MediaBox[0 0 ' + LARGEUR + ' ' + HAUTEUR + ']' +
                       '/Resources<</Font<</F1 3 0 R/F2 4 0 R>>>>/Contents ' + idContenu + ' 0 R>>';
      objets[idContenu] = '<</Length ' + contenu.length + '>>\nstream\n' + contenu + 'endstream';
    });
    objets[2] = '<</Type/Pages/Kids[' + enfants.join(' ') + ']/Count ' + pages.length + '>>';

    var pdf = '%PDF-1.4\n';
    var positions = [];
    for (var i = 1; i < objets.length; i++) {
      positions[i] = pdf.length;
      pdf += i + ' 0 obj\n' + objets[i] + '\nendobj\n';
    }

    var debutTable = pdf.length;
    pdf += 'xref\n0 ' + objets.length + '\n0000000000 65535 f \n';
    for (var j = 1; j < objets.length; j++) {
      pdf += ('0000000000' + positions[j]).slice(-10) + ' 00000 n \n';
    }
    pdf += 'trailer\n<</Size ' + objets.length + '/Root 1 0 R>>\n' +
           'startxref\n' + debutTable + '\n%%EOF';

    var octets = new Uint8Array(pdf.length);
    for (var k = 0; k < pdf.length; k++) octets[k] = pdf.charCodeAt(k) & 0xff;
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
