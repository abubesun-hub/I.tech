// I.TECH — Google Apps Script Web App for Tenders
// Fill these constants, then deploy as a Web App (execute as you, accessible to anyone).
const SHEET_ID = 'PUT_YOUR_SHEET_ID';
const SHEET_NAME = 'Tenders'; // or the name of your sheet tab
const SECRET_KEY = 'YOUR_SECRET_KEY'; // optional; set '' to disable

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function normalizeDate(str) {
  if (!str) return '';
  str = String(str).trim();
  const m = str.match(/^([0-3]?\d)[\/-]([0-1]?\d)[\/-](\d{4})$/);
  if (m) {
    var d = ('00' + m[1]).slice(-2);
    var mo = ('00' + m[2]).slice(-2);
    var y = m[3];
    return y + '-' + mo + '-' + d;
  }
  return str;
}

function readHeaders(sh) {
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
  return headers;
}

function asOutput(obj, e) {
  var cb = e && e.parameter && e.parameter.callback ? String(e.parameter.callback) : '';
  var text = JSON.stringify(obj);
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + text + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAppend(e) {
  if (SECRET_KEY && String(e.parameter.key || '') !== SECRET_KEY) {
    return { ok: false, error: 'invalid_key' };
  }
  var sh = getSheet();
  var headers = readHeaders(sh);
  var row = headers.map(function (h) {
    var v = e.parameter[h] != null ? String(e.parameter[h]) : '';
    if (h === 'deadline' || h === 'postedDate') v = normalizeDate(v);
    if (h === 'documentPrice') v = String(parseInt(v || '0', 10));
    if (h === 'submissionRequirements') v = String(v).replace(/\s*;\s*/g, '; ');
    return v;
  });
  sh.appendRow(row);
  return { ok: true };
}

function handleList(e) {
  var sh = getSheet();
  var lastRow = sh.getLastRow();
  var headers = readHeaders(sh);
  if (lastRow < 2) return { ok: true, data: [] };
  var values = sh.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var data = values.map(function (r) {
    var o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    // Transform fields
    o.documentPrice = o.documentPrice ? Number(o.documentPrice) : undefined;
    o.currency = o.currency || 'IQD';
    if (o.submissionRequirements) {
      o.submissionRequirements = String(o.submissionRequirements).split(';').map(function (s) { return s.trim(); }).filter(Boolean);
    } else {
      o.submissionRequirements = [];
    }
    if (o.contactPhone || o.contactEmail) {
      o.contact = { phone: String(o.contactPhone || '').trim(), email: String(o.contactEmail || '').trim() };
    }
    return o;
  });
  return { ok: true, data: data };
}

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action).toLowerCase() : 'list';
    var resp = (action === 'append') ? handleAppend(e) : handleList(e);
    return asOutput(resp, e);
  } catch (err) {
    return asOutput({ ok: false, error: String(err) }, e);
  }
}

function doPost(e) {
  // Accept form posts with same parameters; reuse same handlers
  return doGet(e);
}
