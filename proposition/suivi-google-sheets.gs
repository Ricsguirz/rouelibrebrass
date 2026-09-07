// Suivi des propositions — Le Roue Libre Brass
// A coller dans Google Sheets : Extensions > Apps Script

var NOM_FEUILLE = 'Suivi';

var ENTETES = ['Organisateur', 'Date demandee', 'Proposition envoyee', 'Validee',
               'Reference', 'Evenement', 'Lieu', 'Montant',
               'Signataire', 'Telephone', 'Validee le'];

function doPost(e) {
  var verrou = LockService.getScriptLock();
  verrou.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var f = feuille();

    if (d.action === 'proposition') {
      f.appendRow([d.organisateur || '', d.dateDemandee || '', d.envoyeeLe || '',
                   'En attente', d.reference || '', d.evenement || '',
                   d.lieu || '', d.montant || '', '', '', '']);
    }

    if (d.action === 'validation') {
      var derniere = f.getLastRow();
      if (derniere > 1) {
        var refs = f.getRange(2, 5, derniere - 1, 1).getValues();
        for (var i = 0; i < refs.length; i++) {
          if (String(refs[i][0]) === String(d.reference)) {
            var ligne = i + 2;
            f.getRange(ligne, 4).setValue('Oui');
            f.getRange(ligne, 9).setValue(d.signataire || '');
            f.getRange(ligne, 10).setValue(d.telephone || '');
            f.getRange(ligne, 11).setValue(d.valideeLe || '');
            break;
          }
        }
      }
    }
  } catch (err) {
    // Un probleme de suivi ne doit jamais bloquer le visiteur.
  } finally {
    verrou.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

// Cree la feuille et ses en-tetes a la premiere utilisation.
function feuille() {
  var classeur = SpreadsheetApp.getActiveSpreadsheet();
  var f = classeur.getSheetByName(NOM_FEUILLE);
  if (!f) { f = classeur.insertSheet(NOM_FEUILLE); }
  if (f.getLastRow() === 0) {
    f.appendRow(ENTETES);
    f.setFrozenRows(1);
    f.getRange(1, 1, 1, ENTETES.length).setFontWeight('bold');
    f.setColumnWidth(1, 220);
  }
  return f;
}
