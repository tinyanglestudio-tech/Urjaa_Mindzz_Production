// ═══════════════════════════════════════════════════════════
//  URJAA MINDZ — Google Apps Script Webhook
//  Paste this into Extensions → Apps Script in Google Sheets
// ═══════════════════════════════════════════════════════════

// ── CONFIGURATION ──────────────────────────────────────────
// Replace YOUR_API_KEY with the key CallMeBot sent you
var CALLMEBOT_API_KEY = 'YOUR_API_KEY';
var WHATSAPP_NUMBER = '919529190553';

// ── Handle POST requests from the website ──────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Write to Google Sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
      data.name || '',
      data.phone || '',
      data.country_code || '',
      data.source || ''
    ]);
    
    // Send WhatsApp notification via CallMeBot
    if (CALLMEBOT_API_KEY !== 'YOUR_API_KEY') {
      var message = '🌱 *New Urjaa Mindz Lead*\n\n' +
                    '👤 *Name:* ' + (data.name || 'N/A') + '\n' +
                    '📱 *Phone:* ' + (data.phone || 'N/A') + '\n' +
                    '📄 *Page:* ' + (data.source || 'N/A') + '\n' +
                    '🕐 *Time:* ' + new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
      
      var encodedMsg = encodeURIComponent(message);
      var url = 'https://api.callmebot.com/whatsapp.php?phone=' + WHATSAPP_NUMBER + 
                '&text=' + encodedMsg + '&apikey=' + CALLMEBOT_API_KEY;
      
      UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({status: 'success'})
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({status: 'error', message: error.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Handle GET requests (for testing) ──────────────────────
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({status: 'ok', message: 'Urjaa Mindz webhook is active'})
  ).setMimeType(ContentService.MimeType.JSON);
}
