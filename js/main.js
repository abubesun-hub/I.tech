// تفعيل قائمة الموبايل + مؤشرات بسيطة + إحصائيات محلية
// إعداد مصدر بيانات المناقصات (بدّل حسب الحاجة)
window.ITECH_TENDERS_CONFIG = window.ITECH_TENDERS_CONFIG || {
  sourceType: 'json', // json هو المصدر الافتراضي الآن
  jsonUrl: './assets/data/tenders.json',
  csvUrl: './assets/data/tenders.csv',
  apiUrl: '',
  apiMode: 'fetch',
  googleSheet: {
    sheetId: '',
    sheetName: 'Tenders',
    gid: '0'
  }
};
// السماح بالتهيئة عبر LocalStorage بدون تعديل الكود
try {
  const lsUrl = localStorage.getItem('itech_api_url');
  const lsMode = localStorage.getItem('itech_api_mode');
  const lsSrc = localStorage.getItem('itech_source_type');
  const lsGId = localStorage.getItem('itech_gsheet_id');
  const lsGName = localStorage.getItem('itech_gsheet_name');
  const lsCsv = localStorage.getItem('itech_csv_url');
  const lsJson = localStorage.getItem('itech_json_url');
  if (lsUrl) window.ITECH_TENDERS_CONFIG.apiUrl = lsUrl;
  if (lsMode) window.ITECH_TENDERS_CONFIG.apiMode = lsMode;
  if (lsSrc) window.ITECH_TENDERS_CONFIG.sourceType = lsSrc;
  if (lsGId) window.ITECH_TENDERS_CONFIG.googleSheet.sheetId = lsGId;
  if (lsGName) window.ITECH_TENDERS_CONFIG.googleSheet.sheetName = lsGName;
  if (lsCsv) window.ITECH_TENDERS_CONFIG.csvUrl = lsCsv;
  if (lsJson) window.ITECH_TENDERS_CONFIG.jsonUrl = lsJson;
} catch {}
// السماح بالتهيئة عبر بارامترات الرابط بدون تعديل الكود
try {
  const params = new URLSearchParams(location.search);
  const src = params.get('src');
  const csv = params.get('csv');
  const json = params.get('json');
  const api = params.get('api');
  const apiMode = params.get('apiMode');
  const gsheetId = params.get('gsheetId');
  const gsheetName = params.get('gsheetName');
  if (src) window.ITECH_TENDERS_CONFIG.sourceType = src;
  if (csv) window.ITECH_TENDERS_CONFIG.csvUrl = csv;
  if (json) window.ITECH_TENDERS_CONFIG.jsonUrl = json;
  if (api) window.ITECH_TENDERS_CONFIG.apiUrl = api;
  if (apiMode) window.ITECH_TENDERS_CONFIG.apiMode = apiMode;
  if (gsheetId) window.ITECH_TENDERS_CONFIG.googleSheet.sheetId = gsheetId;
  if (gsheetName) window.ITECH_TENDERS_CONFIG.googleSheet.sheetName = gsheetName;
} catch {}
(function(){
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      menu.classList.toggle('open');
      const open = menu.classList.contains('open');
      burger.setAttribute('aria-expanded', open.toString());
    });
  }

  // --- Dark Mode ---
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.type = 'button';
  toggleBtn.setAttribute('aria-label', 'تبديل الوضع الليلي');
  toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'; // Moon icon
  
  const nav = document.querySelector('.nav');
  // ضع الزر في كل الصفحات، قبل زر البرغر إن وُجد
  if (nav) {
    if (!nav.querySelector('.theme-toggle')) {
      try {
        const burgerBtn = nav.querySelector('.burger');
        if (burgerBtn) {
          nav.insertBefore(toggleBtn, burgerBtn);
        } else {
          nav.appendChild(toggleBtn);
        }
      } catch (e) {
        nav.appendChild(toggleBtn);
      }
    }
  }

  const theme = localStorage.getItem('itech_theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'; // Sun icon
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('itech_theme', 'light');
      toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('itech_theme', 'dark');
      toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    }
  });

  // إحصائيات محلية بسيطة
  const todayKey = 'itech_visits_today_' + new Date().toISOString().slice(0,10);
  const totalKey = 'itech_visits_total';
  const contactsKey = 'itech_contacts_total';

  const inc = (k) => localStorage.setItem(k, (parseInt(localStorage.getItem(k)||'0',10)+1).toString());
  const get = (k) => parseInt(localStorage.getItem(k)||'0',10);

  // زيادة زيارة عند فتح أي صفحة
  inc(todayKey); inc(totalKey);

  // عرض الأرقام في لوحة التحكم إن وجدت العناصر
  const vt = document.getElementById('visitsToday');
  const vtt = document.getElementById('visitsTotal');
  const ct = document.getElementById('contacts');
  if (vt) vt.textContent = get(todayKey).toString();
  if (vtt) vtt.textContent = get(totalKey).toString();
  if (ct) ct.textContent = get(contactsKey).toString();

  // نموذج التواصل: إرسال حقيقي باستخدام Formspree
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name');
      
      // إذا لم يقم المستخدم بتحديث الرابط، نظهر رسالة تنبيه
      if (form.action.includes('YOUR_FORM_ID')) {
        if (status) status.textContent = 'عذراً، يجب إعداد خدمة البريد أولاً (Formspree).';
        status.style.color = 'red';
        return;
      }

      if (status) {
        status.textContent = 'جاري الإرسال...';
        status.style.color = 'var(--text-muted)';
      }

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: fd,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          inc(contactsKey);
          if (status) {
            status.textContent = 'تم إرسال رسالتك بنجاح. شكراً يا ' + name + '!';
            status.style.color = 'green';
          }
          form.reset();
        } else {
          if (status) {
            status.textContent = 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.';
            status.style.color = 'red';
          }
        }
      } catch (error) {
        if (status) {
          status.textContent = 'حدث خطأ في الاتصال.';
          status.style.color = 'red';
        }
      }
    });
  }

  // --- تحسينات إضافية ---

  // 1. زر الصعود للأعلى
  const btnTop = document.createElement('button');
  btnTop.className = 'back-to-top';
  btnTop.innerHTML = '↑';
  btnTop.setAttribute('aria-label', 'العودة للأعلى');
  document.body.appendChild(btnTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) btnTop.classList.add('show');
    else btnTop.classList.remove('show');
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. أنيميشن الظهور عند التمرير (Scroll Reveal)
  // إضافة كلاس reveal للعناصر الرئيسية تلقائياً
  const sections = document.querySelectorAll('section, .card, .hero-content, .hero-image');
  sections.forEach(sec => sec.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // تشغيل مرة واحدة فقط
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(sec => observer.observe(sec));

})();

// --- Shared helpers for tenders data (used by multiple pages) ---
function normalizeDate(str) {
  const s = (str||'').trim();
  if (!s) return s;
  // إذا كانت الصيغة dd/mm/yyyy أو dd-mm-yyyy → نحولها إلى yyyy-mm-dd
  const m = s.match(/^([0-3]?\d)[\/-]([0-1]?\d)[\/-](\d{4})$/);
  if (m) {
    const d = m[1].padStart(2,'0');
    const mo = m[2].padStart(2,'0');
    const y = m[3];
    return `${y}-${mo}-${d}`;
  }
  return s; // نفترض أنها ISO أو مفهومة من المتصفح
}
function csvToJson(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cols = [];
    let cur = '', inQ = false;
    for (let ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { cols.push(cur); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur);
    const obj = {};
    headers.forEach((h, idx) => obj[h] = (cols[idx] || '').trim());
    rows.push(obj);
  }
  function parseFiles(s) {
    const str = s || '';
    if (!str) return [];
    return str.split(';').map(part => {
      const [label, url] = part.split('|');
      return { label: (label||'ملف').trim(), url: (url||'').trim() };
    }).filter(f => f.url);
  }
  function parseContact(obj) {
    const cp = obj.contactPhone, ce = obj.contactEmail;
    if (cp || ce) return { phone: (cp||'').trim(), email: (ce||'').trim() };
    const c = obj.contact || '';
    if (!c) return undefined;
    const parts = c.includes('|') ? c.split('|') : c.split(';');
    const phone = (parts[0]||'').trim();
    const email = (parts[1]||'').trim();
    return (phone || email) ? { phone, email } : undefined;
  }
  return rows.map(obj => ({
    id: obj.id,
    title: obj.title,
    entity: obj.entity,
    category: obj.category,
    city: obj.city,
    adNumber: obj.adNumber,
    deadline: normalizeDate(obj.deadline),
    postedDate: normalizeDate(obj.postedDate),
    status: obj.status,
    link: obj.link,
    description: obj.description,
    documentPrice: (obj.documentPrice ? parseInt(obj.documentPrice, 10) : (obj.documentPric ? parseInt(obj.documentPric, 10) : undefined)),
    currency: obj.currency || 'IQD',
    pickupLocation: obj.pickupLocation,
    submissionPlace: obj.submissionPlace,
    submissionRequirements: (obj.submissionRequirements || '').split(';').map(s => s.trim()).filter(Boolean),
    notes: obj.notes,
    files: parseFiles(obj.files),
    contact: parseContact(obj)
  }));
}

// --- Google Sheet (GViz) إلى JSON قياسي ---
async function fetchGoogleSheetGViz(sheetId, sheetName) {
  if (!sheetId) return [];
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName||'')}`;
  const res = await fetch(url);
  const txt = await res.text();
  const jsonStr = txt.replace(/^.*setResponse\(/, '').replace(/\);\s*$/, '');
  let payload;
  try { payload = JSON.parse(jsonStr); } catch { return []; }
  const table = (payload && payload.table) ? payload.table : null;
  if (!table || !Array.isArray(table.rows)) return [];
  const headers = (table.cols||[]).map(c => (c && (c.label||c.id||'')).trim());
  const rows = table.rows.map(r => {
    const obj = {};
    headers.forEach((h, idx) => {
      const cell = (r.c||[])[idx];
      const v = cell && (cell.v!=null ? cell.v : cell.f);
      obj[h] = (v==null ? '' : v);
    });
    return obj;
  });
  // تطبيع الأعمدة وفق الحقول المقترحة
  return rows.map(o => {
    const reqs = String(o.submissionRequirements||'').split(';').map(s=>s.trim()).filter(Boolean);
    const filesStr = String(o.files||'').trim();
    const files = filesStr ? filesStr.split(';').map(s=>{
      const [label, url] = s.split('|');
      return { label: (label||'ملف').trim(), url: (url||'').trim() };
    }).filter(f=>f.url) : [];
    const contactStr = String(o.contact||'');
    const [phone, email] = contactStr.includes('|') ? contactStr.split('|') : contactStr.split(';');
    return {
      id: String(o.id||'').trim(),
      title: String(o.title||'').trim(),
      entity: String(o.entity||'').trim() || undefined,
      category: String(o.category||'').trim() || undefined,
      city: String(o.city||'').trim() || undefined,
      adNumber: String(o.adNumber||'').trim() || undefined,
      deadline: normalizeDate(String(o.deadline||'').trim()) || undefined,
      postedDate: normalizeDate(String(o.postedDate||'').trim()) || undefined,
      status: String(o.status||'').trim() || undefined,
      link: String(o.link||'').trim() || undefined,
      description: String(o.description||'').trim() || undefined,
      documentPrice: (o.documentPrice!=null && o.documentPrice!=='') ? parseInt(String(o.documentPrice),10) : undefined,
      currency: String(o.currency||'IQD').trim(),
      pickupLocation: String(o.pickupLocation||'').trim() || undefined,
      submissionPlace: String(o.submissionPlace||'').trim() || undefined,
      submissionRequirements: reqs,
      notes: String(o.notes||'').trim() || undefined,
      files,
      contact: (phone||email) ? { phone: (phone||'').trim(), email: (email||'').trim() } : undefined
    };
  });
}

// Helpers لتطبيع استجابة الـ API ودعم إضافة action تلقائياً
function normalizeApiResponse(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  if (resp && resp.ok && Array.isArray(resp.data)) return resp.data;
  return [];
}

function ensureActionParam(url) {
  if (!url) return url;
  return /[?&]action=/.test(url) ? url : (url + (url.includes('?') ? '&' : '?') + 'action=list');
}

async function loadData() {
  const cfg = window.ITECH_TENDERS_CONFIG || {};
  try {
    const cacheKey = 'itech_tenders_cache';
    const ttlMs = 15 * 60 * 1000; // 15 minutes
    const cache = (() => { try { return JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch { return null; } })();
    if (cache && (Date.now() - cache.ts < ttlMs) && Array.isArray(cache.data)) {
      return cache.data;
    }

      if (cfg.sourceType === 'api' && cfg.apiUrl) {
        const baseUrl = ensureActionParam(cfg.apiUrl);
        if (cfg.apiMode === 'jsonp') {
          // تحميل عبر JSONP: يتطلب أن يدعم الـ API بارامتر callback
          const cbName = '__itech_jsonp_cb_' + Math.random().toString(36).slice(2);
          const url = baseUrl + (baseUrl.includes('?') ? '&' : '?') + 'callback=' + cbName;
          const payload = await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = url; s.async = true;
            window[cbName] = function(p){ try { resolve(p); } finally { delete window[cbName]; document.body.removeChild(s); } };
            s.onerror = () => { delete window[cbName]; reject(new Error('JSONP failed')); };
            document.body.appendChild(s);
          });
          const data = normalizeApiResponse(payload);
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
          return data;
        } else {
          const r = await fetch(baseUrl);
          const j = await r.json();
          const data = normalizeApiResponse(j);
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
          return data;
        }
      }
    if (cfg.sourceType === 'csv' && cfg.csvUrl) {
      const r = await fetch(cfg.csvUrl);
      const t = await r.text();
      const j = csvToJson(t);
      if (!Array.isArray(j) || j.length === 0) {
        // في حال كان الجدول فارغًا أو غير منشور، نرجع للـ JSON المحلي
        const r2 = await fetch(cfg.jsonUrl || './assets/data/tenders.json');
        const j2 = await r2.json();
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: j2 }));
        return j2;
      }
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: j }));
      return j;
    }
    // Google Sheet (GViz)
    if (cfg.sourceType === 'gsheet' && cfg.googleSheet && cfg.googleSheet.sheetId) {
      const j = await fetchGoogleSheetGViz(cfg.googleSheet.sheetId, cfg.googleSheet.sheetName);
      if (!Array.isArray(j) || j.length === 0) {
        const r2 = await fetch(cfg.jsonUrl || './assets/data/tenders.json');
        const j2 = await r2.json();
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: j2 }));
        return j2;
      }
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: j }));
      return j;
    }
    const r = await fetch(cfg.jsonUrl || './assets/data/tenders.json');
    const j = await r.json();
    localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: j }));
    return j;
  } catch (e) {
    try {
      const r = await fetch('./assets/data/tenders.json');
      return await r.json();
    } catch {
      return [];
    }
  }
}

// Tenders page basic interactions
(function(){
  const list = document.getElementById('tendersList');
  const filtersWrap = document.getElementById('tenderFilters');
  if (!list) return;

  const searchInput = document.getElementById('tenderSearch');
  const searchBtn = document.getElementById('searchBtn');
  const sortSelect = document.getElementById('sortSelect');
  const state = { data: [], categories: new Set(), activeCat: 'all' };

  const formatDate = (iso) => {
    try { const d = new Date(iso); return d.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return iso; }
  };
  const daysLeft = (iso) => {
    const d = new Date(iso).getTime();
    const now = Date.now();
    return Math.ceil((d - now) / (1000*60*60*24));
  };

  const favKey = 'itech_tenders_favorites';
  const getFavs = () => { try { return JSON.parse(localStorage.getItem(favKey) || '[]'); } catch { return []; } };
  const setFavs = (arr) => localStorage.setItem(favKey, JSON.stringify(arr));

  function renderChips() {
    filtersWrap.innerHTML = '';
    const make = (label, value, active = false) => {
      const b = document.createElement('button');
      b.className = 'chip' + (active ? ' active' : '');
      b.setAttribute('data-filter', value);
      b.textContent = label;
      b.addEventListener('click', () => {
        document.querySelectorAll('#tenderFilters .chip').forEach(c => c.classList.remove('active'));
        b.classList.add('active');
        state.activeCat = value;
        applyFilter();
      });
      return b;
    };
    filtersWrap.appendChild(make('الكل', 'all', state.activeCat === 'all'));
    filtersWrap.appendChild(make('المفضلة', 'favorites', state.activeCat === 'favorites'));
    Array.from(state.categories).sort().forEach(cat => filtersWrap.appendChild(make(cat, cat, state.activeCat === cat)));
  }

  function renderList(items) {
    list.innerHTML = '';
    items.forEach(t => {
      const card = document.createElement('div');
      card.className = 'card tender-card reveal';
      const dleft = t.deadline ? daysLeft(t.deadline) : NaN;
      const deadlineBadge = isNaN(dleft) ? '' : (dleft < 0 ? '<span class="badge expired">منتهي</span>' : `<span class="badge deadline">متبقٍ ${dleft} يوم</span>`);
      const favs = getFavs();
      const isFav = favs.includes(t.id);
      const metaParts = [];
      if (t.entity) metaParts.push('الجهة: ' + t.entity);
      if (t.category) metaParts.push('التصنيف: ' + t.category);
      if (t.city) metaParts.push('المدينة: ' + t.city);
      if (t.deadline) metaParts.push('الموعد النهائي: ' + formatDate(t.deadline));
      if (t.adNumber) metaParts.push('رقم الإعلان: ' + t.adNumber);
      const metaStr = metaParts.join(' · ');
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          ${deadlineBadge}
          <button class="star-btn ${isFav ? 'active' : ''}" aria-label="إضافة إلى المفضلة" data-id="${t.id}">★</button>
        </div>
        <div class="title">${t.title}</div>
        ${metaStr ? `<div class="meta">${metaStr}</div>` : ''}
        <div class="actions" style="margin-top:12px;">
          <a class="btn link" href="tender.html?id=${encodeURIComponent(t.id)}">عرض التفاصيل</a>
        </div>
      `;
      const star = card.querySelector('.star-btn');
      star.addEventListener('click', () => {
        const arr = getFavs();
        const i = arr.indexOf(t.id);
        if (i === -1) arr.push(t.id); else arr.splice(i, 1);
        setFavs(arr);
        star.classList.toggle('active');
      });
      list.appendChild(card);
    });
  }

  function applyFilter() {
    const q = searchInput ? (searchInput.value || '').trim() : '';
    const cat = state.activeCat;
    const sort = sortSelect ? (sortSelect.value || 'deadline-asc') : 'deadline-asc';
    let items = state.data.filter(t => {
      const favs = getFavs();
      const isFav = favs.includes(t.id);
      const matchesQ = q === '' || [t.title, t.entity, t.city, t.category, t.adNumber].some(v => (v || '').includes(q));
      const matchesC = cat === 'all' || t.category === cat || (cat === 'favorites' && isFav);
      return matchesQ && matchesC;
    });
    items.sort((a, b) => {
      const da = new Date(a.deadline).getTime();
      const db = new Date(b.deadline).getTime();
      const pa = new Date(a.postedDate).getTime();
      const pb = new Date(b.postedDate).getTime();
      switch (sort) {
        case 'deadline-desc': return db - da;
        case 'posted-desc': return pb - pa;
        case 'posted-asc': return pa - pb;
        default: return da - db; // deadline-asc
      }
    });
    const params = new URLSearchParams(location.search);
    if (q) params.set('q', q); else params.delete('q');
    if (cat && cat !== 'all') params.set('cat', cat); else params.delete('cat');
    if (sort) params.set('sort', sort); else params.delete('sort');
    const newUrl = location.pathname + (params.toString() ? ('?' + params.toString()) : '');
    history.replaceState(null, '', newUrl);
    renderList(items);
  }

  async function init() {
    try {
      const data = await loadData();
      state.data = Array.isArray(data) ? data : [];
      state.categories = new Set(state.data.map(d => d.category).filter(Boolean));
      renderChips();
      // restore state from URL
      const params = new URLSearchParams(location.search);
      const q0 = params.get('q') || '';
      const c0 = params.get('cat');
      const s0 = params.get('sort');
      if (q0 && searchInput) searchInput.value = q0;
      if (c0) state.activeCat = c0;
      if (s0 && sortSelect) sortSelect.value = s0;
      applyFilter();
    } catch (e) {
      list.innerHTML = '<p class="under-construction">تعذر تحميل البيانات. سيتم ربط مصدر حقيقي لاحقًا.</p>';
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', applyFilter);
  let tmr;
  if (searchInput) searchInput.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(applyFilter, 300); });
  if (searchInput) searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilter(); });
  if (sortSelect) sortSelect.addEventListener('change', applyFilter);

  init();
})();

// Tender details page
(function(){
  const container = document.getElementById('tenderDetail');
  if (!container) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const formatDate = (iso) => { try { const d = new Date(iso); return d.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return iso; } };
  const daysLeft = (iso) => { const d = new Date(iso).getTime(); const now = Date.now(); return Math.ceil((d - now) / (1000*60*60*24)); };
  (function(){ var cfg = window.ITECH_TENDERS_CONFIG || {}; return (cfg.sourceType === 'csv' ? fetch(cfg.csvUrl).then(r=>r.text()).then(csvToJson) : loadData()); })()
    .then(arr => {
      const item = Array.isArray(arr) ? arr.find(x => x.id === id) : null;
      if (!item) {
        container.innerHTML = '<p class="under-construction">لم يتم العثور على المناقصة المطلوبة.</p>';
        return;
      }
      const dleft = item.deadline ? daysLeft(item.deadline) : NaN;
      const deadlineBadge = isNaN(dleft) ? '' : (dleft < 0 ? '<span class="badge expired">منتهي</span>' : `<span class="badge deadline">متبقٍ ${dleft} يوم</span>`);
      const priceBadge = (item.documentPrice!=null) ? `<span class="badge" style="background:#fff7ed;border:1px solid #fed7aa;color:var(--primary)">سعر الكراس: ${item.documentPrice} ${item.currency||'IQD'}</span>` : '';
      const files = Array.isArray(item.files) && item.files.length ? (`<div class="files-list">${item.files.map(f=>`<a class="btn" href="${f.url}" target="_blank" rel="noopener">${f.label||'ملف'}</a>`).join(' ')}</div>`) : '';
      const reqs = Array.isArray(item.submissionRequirements) && item.submissionRequirements.length ? (`<ul class="details-list">${item.submissionRequirements.map(r=>`<li>${r}</li>`).join('')}</ul>`) : '';
      const contact = item.contact ? `<div><strong>الاتصال:</strong> ${[item.contact.phone,item.contact.email].filter(Boolean).join(' · ')}</div>` : '';
      const metaItems = [];
      if (item.entity) metaItems.push(`<div><strong>الجهة:</strong> ${item.entity}</div>`);
      if (item.category) metaItems.push(`<div><strong>التصنيف:</strong> ${item.category}</div>`);
      if (item.city) metaItems.push(`<div><strong>المدينة:</strong> ${item.city}</div>`);
      if (item.adNumber) metaItems.push(`<div><strong>رقم الإعلان:</strong> ${item.adNumber}</div>`);
      if (item.postedDate) metaItems.push(`<div><strong>نشر في:</strong> ${formatDate(item.postedDate)}</div>`);
      if (item.deadline) metaItems.push(`<div><strong>الموعد النهائي:</strong> ${formatDate(item.deadline)} ${deadlineBadge}</div>`);
      if (item.pickupLocation) metaItems.push(`<div><strong>مكان استلام الكراس:</strong> ${item.pickupLocation}</div>`);
      if (item.submissionPlace) metaItems.push(`<div><strong>مكان التقديم:</strong> ${item.submissionPlace}</div>`);
      if (contact) metaItems.push(contact);
      container.innerHTML = `
        <h1>${item.title}</h1>
        ${metaItems.length ? `<div class="meta-grid">${metaItems.join('')}</div>` : ''}
        ${item.description ? `<p class="tender-desc">${item.description}</p>` : ''}
        ${priceBadge}
        ${reqs ? `<h2>شروط ومتطلبات التقديم</h2>${reqs}` : ''}
        ${files}
        ${item.notes ? `<p class="tender-desc"><strong>ملاحظات:</strong> ${item.notes}</p>` : ''}
        <div class="actions">
          <a class="btn primary" href="${item.link||'#'}" target="_blank" rel="noopener">المصدر / التفاصيل</a>
          <a class="btn" href="tenders.html">العودة إلى المناقصات</a>
        </div>
      `;

      // Favorite toggle
      const favKey = 'itech_tenders_favorites';
      const favBtn = document.getElementById('favToggle');
      const getFavs = () => { try { return JSON.parse(localStorage.getItem(favKey)||'[]'); } catch { return []; } };
      const setFavs = (arr) => localStorage.setItem(favKey, JSON.stringify(arr));
      const favs = getFavs();
      const isFav = favs.includes(item.id);
      if (favBtn) {
        favBtn.textContent = isFav ? 'إزالة من المفضلة ★' : 'إضافة إلى المفضلة ★';
        favBtn.addEventListener('click', () => {
          const arr = getFavs();
          const i = arr.indexOf(item.id);
          if (i === -1) arr.push(item.id); else arr.splice(i,1);
          setFavs(arr);
          favBtn.textContent = arr.includes(item.id) ? 'إزالة من المفضلة ★' : 'إضافة إلى المفضلة ★';
        });
      }

      // Calendar link (Google Calendar all-day event)
      const cal = document.getElementById('calendarLink');
      if (cal) {
        const d = new Date(item.deadline);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth()+1).padStart(2,'0');
        const day = String(d.getUTCDate()).padStart(2,'0');
        const dateStr = `${y}${m}${day}`;
        const title = encodeURIComponent(`موعد مناقصة: ${item.title}`);
        const details = encodeURIComponent(`${item.entity} · ${item.city} · رقم الإعلان: ${item.adNumber}`);
        const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
        cal.href = url;
      }
    })
    .catch(() => { container.innerHTML = '<p class="under-construction">تعذر تحميل التفاصيل.</p>'; });
})();
