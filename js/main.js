// تفعيل قائمة الموبايل + مؤشرات بسيطة + إحصائيات محلية
// إعداد مصدر بيانات المناقصات (بدّل حسب الحاجة)
window.ITECH_TENDERS_CONFIG = window.ITECH_TENDERS_CONFIG || {
  sourceType: 'json',
  jsonUrl: './assets/data/tenders.json'
};
// السماح بالتهيئة عبر LocalStorage بدون تعديل الكود
try {
  const lsJson = localStorage.getItem('itech_json_url');
  if (lsJson) window.ITECH_TENDERS_CONFIG.jsonUrl = lsJson;
} catch {}
// السماح بالتهيئة عبر بارامترات الرابط بدون تعديل الكود
try {
  const params = new URLSearchParams(location.search);
  const json = params.get('json');
  const nocache = params.get('nocache');
  if (json) window.ITECH_TENDERS_CONFIG.jsonUrl = json;
  if (nocache === '1') {
    try { localStorage.removeItem('itech_tenders_cache'); } catch {}
    // أضف وسيط زمني لكسر الكاش على مستوى الشبكة أيضًا
    try {
      const u = new URL(window.ITECH_TENDERS_CONFIG.jsonUrl, location.href);
      u.searchParams.set('v', Date.now().toString());
      window.ITECH_TENDERS_CONFIG.jsonUrl = u.toString();
    } catch {}
  }
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
// CSV و Google Sheet تم إزالتهما؛ يعتمد الموقع على JSON فقط.

// Helpers لتطبيع استجابة الـ API ودعم إضافة action تلقائياً
function normalizeApiResponse(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  if (resp && resp.ok && Array.isArray(resp.data)) return resp.data;
  return [];
}

// لم يعد هناك API خارجي؛ نحمّل من ملف JSON فقط.

async function loadData() {
  const cfg = window.ITECH_TENDERS_CONFIG || {};
  
  // تحديد مصدر البيانات (محلي، خارجي، أو افتراضي)
  const dataSourceType = localStorage.getItem('itech_data_source_type');
  const customJsonUrl = localStorage.getItem('itech_json_url');
  
  // 1. جرب تحميل البيانات المحلية أولاً إذا كانت متوفرة
  const localKey = 'itech_tenders_local';
  try {
    const localData = localStorage.getItem(localKey);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('تم تحميل البيانات من التخزين المحلي');
        return parsed;
      }
    }
  } catch (e) {
    console.log('تعذر تحميل البيانات المحلية:', e);
  }
  
  // 2. جرب تحميل البيانات مع الكاش
  try {
    const cacheKey = 'itech_tenders_cache';
    const ttlMs = 5 * 60 * 1000; // تقليل الكاش إلى 5 دقائق للبيانات الأونلاين
    const cache = (() => { try { return JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch { return null; } })();
    if (cache && (Date.now() - cache.ts < ttlMs) && Array.isArray(cache.data)) {
      console.log('تم تحميل البيانات من الكاش');
      return cache.data;
    }
    
    // تحديد الرابط المطلوب
    let url = customJsonUrl || cfg.jsonUrl || './assets/data/tenders.json';
    
    // إعداد headers خاصة لكل نوع
    const headers = {
      'Accept': 'application/json'
    };
    
    // إضافة headers خاصة بـ JSONBin إذا لزم الأمر
    if (dataSourceType === 'jsonbin' && url.includes('jsonbin.io')) {
      const apiKey = (() => {
        try {
          const settings = JSON.parse(localStorage.getItem('itech_jsonbin_settings') || '{}');
          return settings.key;
        } catch { return null; }
      })();
      
      if (apiKey) {
        headers['X-Master-Key'] = apiKey;
      }
    }
    
    console.log('محاولة تحميل البيانات من:', url);
    const r = await fetch(url, { 
      cache: 'no-store',
      headers
    });
    
    if (!r.ok) {
      console.error('فشل في تحميل البيانات، رمز الحالة:', r.status);
      throw new Error('fetch_failed_' + r.status);
    }
    
    let data;
    const jsonResponse = await r.json();
    
    // معالجة استجابة JSONBin
    if (dataSourceType === 'jsonbin' && jsonResponse.record) {
      data = jsonResponse.record;
    } else {
      data = jsonResponse;
    }
    
    if (!Array.isArray(data)) {
      console.error('البيانات المستلمة ليست مصفوفة:', data);
      throw new Error('Invalid data format');
    }
    
    console.log('تم تحميل البيانات بنجاح، عدد المناقصات:', data.length);
    localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
    return data;
    
  } catch (e) {
    console.error('خطأ في تحميل البيانات:', e);
    
    // محاولة أخيرة من الملف الافتراضي إذا فشل المصدر المخصص
    try {
      console.log('محاولة تحميل من الملف الافتراضي...');
      const r = await fetch('./assets/data/tenders.json', { 
        cache: 'no-store',
        mode: 'same-origin'
      });
      if (!r.ok) {
        console.error('فشل في المحاولة الأخيرة، رمز الحالة:', r.status);
        return [];
      }
      const data = await r.json();
      console.log('تم تحميل البيانات في المحاولة الأخيرة، عدد المناقصات:', data.length);
      return data;
    } catch (finalError) {
      console.error('فشل نهائي في تحميل البيانات:', finalError);
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
    if (!items || items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'muted';
      empty.textContent = 'لا توجد مناقصات مطابقة حالياً.';
      list.appendChild(empty);
      return;
    }
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
      console.log('بدء تحميل بيانات المناقصات...');
      const data = await loadData();
      console.log('تم تحميل البيانات:', data);
      
      if (!Array.isArray(data) || data.length === 0) {
        console.log('لا توجد بيانات أو البيانات فارغة');
        list.innerHTML = `
          <div class="card" style="padding: 20px; text-align: center; border: 1px dashed #ddd;">
            <h3>لا توجد مناقصات حالياً</h3>
            <p>البيانات قيد التحميل أو لم يتم إضافة مناقصات بعد.</p>
            <div style="margin: 15px 0;">
              <a href="tender-admin-online.html" class="btn primary">نشر مناقصة أونلاين</a>
              <a href="tender-admin-simple.html" class="btn">إضافة محلياً</a>
            </div>
            <p><a href="github-setup-guide.html">دليل الإعداد للنشر الأونلاين</a></p>
            <p><small>للمطورين: تحقق من ملف assets/data/tenders.json أو console للتفاصيل</small></p>
          </div>
        `;
        return;
      }
      
      state.data = data;
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
      console.error('خطأ في تهيئة صفحة المناقصات:', e);
      list.innerHTML = `
        <div class="card" style="padding: 20px; text-align: center; border: 1px solid #ff6b6b; background: #ffe0e0;">
          <h3 style="color: #d63031;">خطأ في تحميل المناقصات</h3>
          <p>تعذر تحميل بيانات المناقصات. يرجى:</p>
          <ul style="text-align: right; display: inline-block;">
            <li>التأكد من الاتصال بالإنترنت</li>
            <li>تحديث الصفحة</li>
            <li>أو <a href="tender-admin-online.html">نشر مناقصات جديدة أونلاين</a></li>
            <li>أو استخدام <a href="tender-admin-simple.html">الإضافة المحلية</a></li>
          </ul>
          <div style="margin: 15px 0;">
            <button onclick="location.reload()" class="btn primary">تحديث الصفحة</button>
            <a href="github-setup-guide.html" class="btn">دليل الإعداد</a>
          </div>
        </div>
      `;
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
  loadData()
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
