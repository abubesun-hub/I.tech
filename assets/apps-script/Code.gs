// I.TECH — Google Apps Script Web App for Tenders
// Fill these constants, then deploy as a Web App (execute as you, accessible to anyone).
const SHEET_ID = '1BQHnfvDajpaewzDFf6AAlrSFcReXyIyaSTf3xETqT4M';
const SHEET_NAME = 'Tenders'; // or the name of your sheet tab
const SECRET_KEY = '1985'; // optional; set '' to disable
// Basic login user (server-side check). Replace as needed.
const ADMIN_USER = 'Abubesun';
const ADMIN_PASS = 'Ahmed1985';

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

// --- Token helpers (HMAC-SHA256 signed, web-safe base64) ---
function signToken(user) {
  var expMs = (new Date()).getTime() + 2 * 60 * 60 * 1000; // 2 hours
  var payload = JSON.stringify({ u: user, exp: expMs });
  var sigBytes = Utilities.computeHmacSha256Signature(payload, SECRET_KEY || 'NO_SECRET');
  var sig = Utilities.base64EncodeWebSafe(sigBytes);
  var pay = Utilities.base64EncodeWebSafe(payload);
  return pay + '.' + sig;
}

function verifyToken(tok) {
  try {
    if (!tok) return false;
    var parts = String(tok).split('.');
    if (parts.length !== 2) return false;
    var payloadStr = Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString();
    var expSigBytes = Utilities.computeHmacSha256Signature(payloadStr, SECRET_KEY || 'NO_SECRET');
    var expSig = Utilities.base64EncodeWebSafe(expSigBytes);
    if (expSig !== parts[1]) return false;
    var obj = JSON.parse(payloadStr);
    if (!obj || !obj.exp || !obj.u) return false;
    if ((new Date()).getTime() > obj.exp) return false;
    return true;
  } catch (e) { return false; }
}

function hasAccess(e) {
  if (!SECRET_KEY) return true; // if no secret configured, allow
  var p = e && e.parameter || {};
  if (p.key && String(p.key) === SECRET_KEY) return true;
  return verifyToken(p.token);
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

function handleLogin(e) {
  var u = e && e.parameter && e.parameter.user ? String(e.parameter.user) : '';
  var p = e && e.parameter && e.parameter.pass ? String(e.parameter.pass) : '';
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    var token = signToken(u);
    return { ok: true, token: token, user: u, expiresIn: 2 * 60 * 60 }; // seconds
  }
  return { ok: false, error: 'bad_credentials' };
}

function handleAppend(e) {
  if (!hasAccess(e)) return { ok: false, error: 'unauthorized' };
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
  if (!hasAccess(e)) return { ok: false, error: 'unauthorized' };
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
    var resp = (action === 'append') ? handleAppend(e)
             : (action === 'login') ? handleLogin(e)
             : handleList(e);
    return asOutput(resp, e);
  } catch (err) {
    return asOutput({ ok: false, error: String(err) }, e);
  }
}

function doPost(e) {
  // Accept form posts with same parameters; reuse same handlers
  return doGet(e);
}
