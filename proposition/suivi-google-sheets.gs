/* =========================================================================
   SUIVI DES PROPOSITIONS — script à coller dans Google Apps Script

   Ce code ne vit PAS sur le site : il se colle dans le tableur Google, où il
   attend d'être appelé. Il remplit une ligne quand une proposition est créée,
   puis coche « Oui » quand le client la valide.

   Mode d'emploi complet dans la conversation. En résumé :
   Google Sheets > Extensions > Apps Script > coller ce code > Déployer >
   Nouveau déploiement > Application Web > Exécuter en tant que « moi » >
   Accès « Tout le monde » > copier l'adresse obtenue.
   ========================================================================= */

var NOM_FEUILLE = 'Suivi';

var ENTETES = [
  'Organisateur',
  'Date demandée',
  'Proposition envoyée',
  'Validée',
  'Référence',
  'Événement',
  'Lieu',
  'Montant',
  'Signataire',
  'Téléphone',
  'Validée le'
];

/* Colonnes utilisées lors de la validation (1 = A, 2 = B, …) */
var COL_VALIDEE    = 4;
var COL_REFERENCE  = 5;
var COL_SIGNATAIRE = 9;
var COL_TELEPHONE  = 10;
var COL_VALIDEE_LE = 11;

function doPost(e) {
  var verrou = LockService.getScriptLock();
  verrou.waitLock(20000);   // évite deux écritures simultanées

  try {
    var d = JSON.parse(e.postData.contents);
    var f = feuille();

    if (d.action === 'proposition') {
      f.appendRow([
        d.organisateur || '',
        d.dateDemandee || '',
        d.envoyeeLe || '',
        'En attente',
        d.reference || '',
        d.evenement || '',
        d.lieu || '',
        d.montant || '',
        '', '', ''
      ]);

    } else if (d.action === 'validation') {
      var derniere = f.getLastRow();
      if (derniere < 2) return sortie();

      var refs = f.getRange(2, COL_REFERENCE, derniere - 1, 1).getValues();
      for (var i = 0; i < refs.length; i++) {
        if (String(refs[i][0]) === String(d.reference)) {
          var ligne = i + 2;
          f.getRange(ligne, COL_VALIDEE).setValue('Oui');
          f.getRange(ligne, COL_SIGNATAIRE).setValue(d.signataire || '');
          f.getRange(ligne, COL_TELEPHONE).setValue(d.telephone || '');
          f.getRange(ligne, COL_VALIDEE_LE).setValue(d.valideeLe || '');
          break;
        }
      }
    }
  } catch (err) {
    // On n'interrompt jamais le visiteur pour un problème de suivi.
  } finally {
    verrou.releaseLock();
  }

  return sortie();
}

function sortie() {
  return ContentService.createTextOutput('ok');
}

/* Crée la feuille et ses en-têtes à la première utilisation. */
function feuille() {
  var classeur = SpreadsheetApp.getActiveSpreadsheet();
  var f = classeur.getSheetByName(NOM_FEUILLE);

  if (!f) f = classeur.insertSheet(NOM_FEUILLE);

  if (f.getLastRow() === 0) {
    f.appendRow(ENTETES);
    f.setFrozenRows(1);
    f.getRange(1, 1, 1, ENTETES.length).setFontWeight('bold');
    f.setColumnWidth(1, 220);
    f.setColumnWidth(6, 200);
  }
  return f;
}
