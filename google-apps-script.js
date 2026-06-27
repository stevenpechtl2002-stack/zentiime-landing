// ============================================
// ZENTIIME – Google Apps Script für Rückrufe
// ============================================
// SETUP (einmalig, dauert 3 Minuten):
//
// 1. Öffne: https://script.google.com
// 2. Klicke "Neues Projekt"
// 3. Lösche alles und füge diesen Code ein
// 4. Ersetze SPREADSHEET_ID mit deiner Google Sheets ID
//    (die ID findest du in der URL deiner Tabelle:
//     docs.google.com/spreadsheets/d/HIER_IST_DIE_ID/edit)
// 5. Klicke "Bereitstellen" → "Neue Bereitstellung"
// 6. Typ: Web-App | Zugriff: Jeder
// 7. Kopiere die Web-App-URL
// 8. Füge sie in index.html bei DEINE_APPS_SCRIPT_URL_HIER ein
// ============================================

const SPREADSHEET_ID = 'DEINE_SPREADSHEET_ID_HIER';
const SHEET_NAME = 'Rückrufe';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    let sheet = ss.getSheetByName(SHEET_NAME);

    // Tabelle + Header anlegen falls nicht vorhanden
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Datum', 'Vorname', 'Nachname', 'Telefon', 'Firma', 'Rückrufzeit', 'Status'
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Neue Zeile eintragen
    sheet.appendRow([
      data.datum,
      data.vorname,
      data.nachname,
      data.telefon,
      data.firma || '–',
      data.zeit,
      'Neu – Anrufen!'
    ]);

    // Letzte Zeile grün färben (= noch nicht angerufen)
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 7).setBackground('#d4edda').setFontColor('#155724');

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Für Browser-Tests
function doGet(e) {
  return ContentService.createTextOutput('Zentiime Script läuft ✓');
}
