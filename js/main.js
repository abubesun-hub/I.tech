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

  // 1.5 تحديث سنة الحقوق تلقائياً في التذييل
  try {
    const currentYear = new Date().getFullYear().toString();
    document.querySelectorAll('[data-current-year]').forEach(el => {
      el.textContent = currentYear;
    });
  } catch {}

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
  console.log('🚀 بدء دالة loadData...');
  
  const cfg = window.ITECH_TENDERS_CONFIG || {};
  console.log('⚙️ إعدادات التحميل:', cfg);
  
  // تحديد مصدر البيانات (محلي، خارجي، أو افتراضي)
  const dataSourceType = localStorage.getItem('itech_data_source_type');
  const customJsonUrl = localStorage.getItem('itech_json_url');
  
  console.log('📍 مصدر البيانات:', { type: dataSourceType, customUrl: customJsonUrl });
  
  // 1. جرب تحميل البيانات المحلية أولاً إذا كانت متوفرة
  const localKey = 'itech_tenders_local';
  try {
    const localData = localStorage.getItem(localKey);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('✅ تم تحميل البيانات من التخزين المحلي، عدد العناصر:', parsed.length);
        return parsed;
      }
    }
    console.log('ℹ️ لا توجد بيانات محلية أو البيانات المحلية فارغة');
  } catch (e) {
    console.warn('⚠️ تعذر تحميل البيانات المحلية:', e);
  }
  
  // 2. جرب تحميل البيانات مع الكاش
  try {
    const cacheKey = 'itech_tenders_cache';
    const ttlMs = 5 * 60 * 1000; // تقليل الكاش إلى 5 دقائق للبيانات الأونلاين
    const cache = (() => { 
      try { 
        const cached = localStorage.getItem(cacheKey);
        return cached ? JSON.parse(cached) : null;
      } catch { 
        return null; 
      } 
    })();
    
    if (cache && (Date.now() - cache.ts < ttlMs) && Array.isArray(cache.data)) {
      console.log('📦 تم تحميل البيانات من الكاش، عدد العناصر:', cache.data.length);
      console.log('⏰ تاريخ الكاش:', new Date(cache.ts).toLocaleString());
      return cache.data;
    }
    
    // تحديد الرابط المطلوب
    let url = customJsonUrl || cfg.jsonUrl || './assets/data/tenders.json';
    console.log('🔗 رابط التحميل:', url);
    
    // إعداد headers خاصة لكل نوع
    const headers = {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    };
    
    // إضافة headers خاصة بـ JSONBin إذا لزم الأمر
    if (dataSourceType === 'jsonbin' && url.includes('jsonbin.io')) {
      console.log('🔧 إعداد headers لـ JSONBin...');
      const apiKey = (() => {
        try {
          const settings = JSON.parse(localStorage.getItem('itech_jsonbin_settings') || '{}');
          return settings.key;
        } catch { return null; }
      })();
      
      if (apiKey) {
        headers['X-Master-Key'] = apiKey;
        console.log('🔑 تم إضافة API Key لـ JSONBin');
      } else {
        console.warn('⚠️ لا يوجد API Key لـ JSONBin');
      }
    }
    
    console.log('🌐 بدء الطلب إلى:', url);
    console.log('📋 Headers:', headers);
    
    const r = await fetch(url, { 
      cache: 'no-store',
      headers
    });
    
    console.log('📡 حالة الاستجابة:', r.status, r.statusText);
    console.log('📄 Content-Type:', r.headers.get('content-type'));
    
    if (!r.ok) {
      console.error('❌ فشل في تحميل البيانات، رمز الحالة:', r.status);
      const errorText = await r.text().catch(() => 'تعذر قراءة نص الخطأ');
      console.error('📝 تفاصيل الخطأ:', errorText);
      throw new Error(`HTTP ${r.status}: ${r.statusText}`);
    }
    
    let data;
    const jsonResponse = await r.json();
    console.log('📊 الاستجابة الخام:', jsonResponse);
    
    // معالجة استجابة JSONBin
    if (dataSourceType === 'jsonbin' && jsonResponse.record) {
      console.log('🔄 معالجة استجابة JSONBin...');
      data = jsonResponse.record;
    } else {
      data = jsonResponse;
    }
    
    if (!Array.isArray(data)) {
      console.error('❌ البيانات المستلمة ليست مصفوفة:', data);
      console.error('🔍 نوع البيانات:', typeof data);
      throw new Error('Invalid data format: expected array, got ' + typeof data);
    }
    
    console.log('✅ تم تحميل البيانات بنجاح!');
    console.log('📈 عدد المناقصات:', data.length);
    console.log('📄 عينة من البيانات:', data.slice(0, 2));
    
    // حفظ في الكاش
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
      console.log('💾 تم حفظ البيانات في الكاش');
    } catch (cacheError) {
      console.warn('⚠️ فشل حفظ الكاش:', cacheError);
    }
    
    return data;
    
  } catch (e) {
    console.error('💥 خطأ في تحميل البيانات:', e);
    console.error('📊 تفاصيل الخطأ:', e.stack);
    
    // محاولة أخيرة من الملف الافتراضي إذا فشل المصدر المخصص
    try {
      console.log('🔄 محاولة تحميل من الملف الافتراضي...');
      const fallbackUrl = './assets/data/tenders.json';
      const r = await fetch(fallbackUrl, { 
        cache: 'no-store',
        mode: 'same-origin',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 حالة المحاولة الأخيرة:', r.status);
      
      if (!r.ok) {
        console.error('❌ فشل في المحاولة الأخيرة، رمز الحالة:', r.status);
        return [];
      }
      
      const data = await r.json();
      console.log('✅ نجحت المحاولة الأخيرة، عدد المناقصات:', data.length);
      return Array.isArray(data) ? data : [];
    } catch (finalError) {
      console.error('💥 فشل نهائي في تحميل البيانات:', finalError);
      return [];
    }
  }
}

// --- برامج: تحميل بيانات البرامج من JSON مع كاش بسيط ---
async function loadProgramsData() {
  try {
    const cacheKey = 'itech_programs_cache';
    const ttlMs = 15 * 60 * 1000;
    const params = new URLSearchParams(location.search);
    const nocache = params.get('nocache');
    if (nocache === '1') { try { localStorage.removeItem(cacheKey); } catch {} }
    const overrideUrl = params.get('progjson') || params.get('json');
    const cache = (() => { try { return JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch { return null; } })();
    if (cache && (Date.now() - cache.ts < ttlMs) && Array.isArray(cache.data)) return cache.data;
    const r = await fetch(overrideUrl || './assets/data/programs.json', { cache: 'no-store' });
    const j = await r.json();
    localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: j }));
    return j;
  } catch (e) {
    return [];
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
    console.log('🎨 بدء عرض القائمة، عدد العناصر:', items ? items.length : 'null');
    
    list.innerHTML = '';
    if (!items || items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'muted';
      empty.innerHTML = `
        <div class="card" style="padding: 20px; text-align: center;">
          <h3>لا توجد مناقصات مطابقة</h3>
          <p>جرب تغيير معايير البحث أو الفلتر</p>
          <button onclick="location.reload()" class="btn">تحديث الصفحة</button>
        </div>
      `;
      list.appendChild(empty);
      console.log('📭 تم عرض رسالة "لا توجد مناقصات"');
      return;
    }
    
    console.log('📋 عرض المناقصات:');
    items.forEach((t, index) => {
      console.log(`📄 مناقصة ${index + 1}:`, { id: t.id, title: t.title, entity: t.entity });
      
      const card = document.createElement('div');
      card.className = 'card tender-card reveal active';
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
        <div class="title">${t.title || 'بدون عنوان'}</div>
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
    
    console.log('✅ تم عرض جميع المناقصات بنجاح');
  }

  function applyFilter() {
    const q = searchInput ? (searchInput.value || '').trim() : '';
    const cat = state.activeCat;
    const sort = sortSelect ? (sortSelect.value || 'deadline-asc') : 'deadline-asc';
    
    console.log('🔍 تطبيق الفلتر:', { query: q, category: cat, sort });
    console.log('📊 البيانات المتاحة:', state.data ? state.data.length : 'لا توجد');
    
    if (!Array.isArray(state.data) || state.data.length === 0) {
      console.warn('⚠️ لا توجد بيانات للفلترة');
      renderList([]);
      return;
    }
    
    let items = state.data.filter(t => {
      const favs = getFavs();
      const isFav = favs.includes(t.id);
      const matchesQ = q === '' || [t.title, t.entity, t.city, t.category, t.adNumber].some(v => (v || '').toLowerCase().includes(q.toLowerCase()));
      const matchesC = cat === 'all' || t.category === cat || (cat === 'favorites' && isFav);
      return matchesQ && matchesC;
    });
    
    console.log('🎯 عدد المناقصات بعد الفلتر:', items.length);
    
    items.sort((a, b) => {
      const da = new Date(a.deadline || '9999-12-31').getTime();
      const db = new Date(b.deadline || '9999-12-31').getTime();
      const pa = new Date(a.postedDate || '1900-01-01').getTime();
      const pb = new Date(b.postedDate || '1900-01-01').getTime();
      switch (sort) {
        case 'deadline-desc': return db - da;
        case 'posted-desc': return pb - pa;
        case 'posted-asc': return pa - pb;
        default: return da - db; // deadline-asc
      }
    });
    
    console.log('📋 ترتيب البيانات:', sort);
    console.log('📄 أول 3 مناقصات بعد الترتيب:', items.slice(0, 3).map(t => ({ id: t.id, title: t.title })));
    
    const params = new URLSearchParams(location.search);
    if (q) params.set('q', q); else params.delete('q');
    if (cat && cat !== 'all') params.set('cat', cat); else params.delete('cat');
    if (sort) params.set('sort', sort); else params.delete('sort');
    const newUrl = location.pathname + (params.toString() ? ('?' + params.toString()) : '');
    history.replaceState(null, '', newUrl);
    
    console.log('🔗 تحديث URL:', newUrl);
    
    renderList(items);
  }

  async function init() {
    // إظهار رسالة تحميل
    list.innerHTML = `
      <div class="card" style="padding: 20px; text-align: center;">
        <h3>جاري تحميل المناقصات...</h3>
        <p>يرجى الانتظار</p>
      </div>
    `;
    
    try {
      console.log('🔄 بدء تحميل بيانات المناقصات...');
      console.log('🌐 الموقع الحالي:', location.href);
      
      const data = await loadData();
      console.log('📊 تم تحميل البيانات:', data);
      console.log('📈 نوع البيانات:', typeof data, 'هل هو مصفوفة:', Array.isArray(data));
      console.log('📋 عدد العناصر:', Array.isArray(data) ? data.length : 'غير معروف');
      
      if (!Array.isArray(data)) {
        console.error('❌ البيانات ليست مصفوفة:', data);
        throw new Error('البيانات المستلمة ليست مصفوفة صحيحة');
      }
      
      if (data.length === 0) {
        console.warn('⚠️ المصفوفة فارغة - لا توجد مناقصات');
        list.innerHTML = `
          <div class="card" style="padding: 20px; text-align: center; border: 1px dashed #ddd;">
            <h3>لا توجد مناقصات حالياً</h3>
            <p>لم يتم العثور على مناقصات في ملف البيانات.</p>
            <div style="margin: 15px 0;">
              <a href="tender-admin-online.html" class="btn primary">نشر مناقصة أونلاين</a>
              <a href="tender-admin-simple.html" class="btn">إضافة محلياً</a>
            </div>
            <p><a href="github-setup-guide.html">دليل الإعداد للنشر الأونلاين</a></p>
            <p><small>مسار البيانات: assets/data/tenders.json</small></p>
          </div>
        `;
        return;
      }
      
      console.log('✅ البيانات صحيحة، بدء المعالجة...');
      console.log('📄 عينة من البيانات:', data.slice(0, 2));
      
      state.data = data;
      state.categories = new Set(state.data.map(d => d.category).filter(Boolean));
      
      console.log('🏷️ الفئات المتاحة:', Array.from(state.categories));
      
      renderChips();
      
      // restore state from URL
      const params = new URLSearchParams(location.search);
      const q0 = params.get('q') || '';
      const c0 = params.get('cat');
      const s0 = params.get('sort');
      
      console.log('🔗 معاملات URL:', { q: q0, cat: c0, sort: s0 });
      
      if (q0 && searchInput) searchInput.value = q0;
      if (c0) state.activeCat = c0;
      if (s0 && sortSelect) sortSelect.value = s0;
      
      applyFilter();
      console.log('🎯 تم تطبيق الفلتر وعرض البيانات');
      
    } catch (e) {
      console.error('💥 خطأ في تهيئة صفحة المناقصات:', e);
      console.error('📊 تفاصيل الخطأ:', e.stack);
      
      list.innerHTML = `
        <div class="card" style="padding: 20px; text-align: center; border: 1px solid #ff6b6b; background: #ffe0e0;">
          <h3 style="color: #d63031;">خطأ في تحميل المناقصات</h3>
          <p><strong>تفاصيل الخطأ:</strong> ${e.message}</p>
          <p>يرجى:</p>
          <ul style="text-align: right; display: inline-block;">
            <li>فتح Developer Tools (F12) ومراجعة Console</li>
            <li>التأكد من وجود ملف assets/data/tenders.json</li>
            <li>التأكد من الاتصال بالإنترنت</li>
            <li>تحديث الصفحة</li>
          </ul>
          <div style="margin: 15px 0;">
            <button onclick="location.reload()" class="btn primary">تحديث الصفحة</button>
            <button onclick="window.open('./assets/data/tenders.json', '_blank')" class="btn">فتح ملف JSON</button>
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
          <a class="btn" href="tenders-new.html">العودة إلى المناقصات</a>
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

// Image Modal Global Setup
window.ITECH_IMAGE_MODAL = (() => {
  const modal = document.createElement('div');
  modal.id = 'itech-image-modal';
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)" id="modal-bg">
      <div style="position:relative;max-width:90%;max-height:90%;">
        <img id="modal-img" src="" alt="صورة مكبرة" style="width:100%;height:auto;max-height:85vh;object-fit:contain;border-radius:8px;">
        <button id="modal-close" style="position:absolute;top:10px;right:10px;width:40px;height:40px;border:none;background:rgba(255,255,255,0.9);border-radius:50%;cursor:pointer;font-size:24px;display:flex;align-items:center;justify-content:center;color:#333;">✕</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const bg = modal.querySelector('#modal-bg');
  const img = modal.querySelector('#modal-img');
  const closeBtn = modal.querySelector('#modal-close');
  const show = (src) => {
    img.src = src;
    bg.style.display = 'flex';
  };
  const hide = () => { bg.style.display = 'none'; };
  closeBtn.addEventListener('click', hide);
  bg.addEventListener('click', (e) => { if (e.target === bg) hide(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && bg.style.display === 'flex') hide(); });
  return { show, hide };
})();

// Programs page: render from assets/data/programs.json if available
(function(){
  const grid = document.getElementById('programs');
  if (!grid) return;

  // تلخيص النصوص في بطاقات البرامج مع الاعتماد على تنسيق الموقع العام فقط
  const stripTags = (s) => (s || '').toString().replace(/<[^>]*>/g, '');
  const summarize = (s, max) => {
    const plain = stripTags(s).trim();
    if (plain.length <= max) return plain;
    return plain.slice(0, max).trim() + '…';
  };

  function render(items) {
    grid.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card program-card reveal active';
      const features = Array.isArray(p.features) ? p.features.slice(0, 3) : [];
      const images = Array.isArray(p.images)
        ? p.images
            .filter(u => typeof u === 'string' && u.trim().length > 0)
            .slice(0, 10)
        : [];
      const videos = Array.isArray(p.videos)
        ? p.videos
            .filter(u => typeof u === 'string' && /^https?:\/\//i.test(u.trim()))
            .slice(0, 2)
        : [];
      const fmtCur = (c) => (c==='USD' ? 'دولار' : c==='IQD' ? 'دينار' : (c||''));
      
      // تنسيق محسّن: السعر في سطر منفصل بدون badge
      const priceRow = (p.price!=null) ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-weight:600;color:var(--primary);">السعر: ${p.price} ${fmtCur(p.currency||'IQD')}</div>` : '';

      const gallery = images.length
        ? `<div class="files-list">${images.map(u=>`<img class="gallery-img" src="${u}" alt="صورة البرنامج" style="width:120px;height:90px;object-fit:cover;border-radius:8px;border:1px solid var(--border);cursor:pointer;transition:transform 0.2s" loading="lazy" onerror="this.remove()">`).join(' ')}</div>`
        : '';

      card.innerHTML = `
        ${p.image ? `<img src="${p.image}" alt="${p.name}" class="card-img gallery-img" style="cursor:pointer;" loading="lazy" onerror="this.remove()" />` : ''}
        <h2 style="margin-bottom:8px;">${p.logo ? `<img src="${p.logo}" alt="لوغو ${p.name}" style="width:32px;height:32px;object-fit:contain;margin-left:8px;vertical-align:middle">` : ''}${p.name||'برنامج'}</h2>
        ${p.shortDescription ? `<p class="tender-desc" style="margin-bottom:8px;color:var(--text-muted);">${p.shortDescription}</p>` : ''}
        ${priceRow}
        ${features.length ? `<ul style="margin-top:8px;">${features.map(f=>{
          let text = f;
          if (typeof f === 'object' && f.text) {
            text = f.text;
          }
          const summary = summarize(text, 50);
          return `<li style="padding:4px 0;white-space:pre-wrap;color:var(--text-main);font-size:0.95rem;">${summary}</li>`;
        }).join('')}</ul>` : ''}
        ${gallery}
        <div class="actions">
          <a class="btn link" href="program.html?id=${encodeURIComponent(p.id)}">تفاصيل المزيد</a>
        </div>
      `;
      grid.appendChild(card);
      
      // إضافة مستمعات الصور للـ modal
      const galleryImgs = card.querySelectorAll('.gallery-img');
      galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
          window.ITECH_IMAGE_MODAL.show(img.src);
        });
        img.addEventListener('mouseover', () => {
          img.style.transform = 'scale(1.05)';
        });
        img.addEventListener('mouseout', () => {
          img.style.transform = 'scale(1)';
        });
      });
    });
  }

  loadProgramsData()
    .then(arr => {
      if (!Array.isArray(arr) || arr.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'under-construction';
        msg.textContent = 'لا توجد برامج حالياً. سيتم إضافة المحتوى لاحقاً.';
        grid.parentElement.insertBefore(msg, grid);
        return;
      }
      render(arr);
    })
    .catch(() => {
      const msg = document.createElement('p');
      msg.className = 'under-construction';
      msg.textContent = 'تعذر تحميل بيانات البرامج.';
      grid.parentElement.insertBefore(msg, grid);
    });
})();

// Program details page with improved layout
(function(){
  const container = document.getElementById('programDetail');
  if (!container) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const fmtCur = (c) => (c==='USD' ? 'دولار' : c==='IQD' ? 'دينار' : (c||''));
  
  const makeVideoEmbed = (u) => {
    try {
      const url = new URL(u);
      const host = url.hostname.replace('www.', '');
      if (host === 'youtu.be') { const id = url.pathname.split('/').filter(Boolean)[0]; if (id) return `<iframe src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:360px;border:0;border-radius:8px"></iframe>`; }
      if (host === 'youtube.com' || host === 'm.youtube.com') { const id = url.searchParams.get('v'); if (id) return `<iframe src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:360px;border:0;border-radius:8px"></iframe>`; }
      if (host === 'vimeo.com') { const id = url.pathname.split('/').filter(Boolean)[0]; if (id) return `<iframe src="https://player.vimeo.com/video/${id}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:360px;border:0;border-radius:8px"></iframe>`; }
      return '';
    } catch { return ''; }
  };
  
  loadProgramsData()
    .then(arr => {
      const item = Array.isArray(arr) ? arr.find(x => String(x.id||'') === String(id||'')) : null;
      if (!item) { container.innerHTML = '<p class="under-construction">لم يتم العثور على البرنامج المطلوب.</p>'; return; }
      const images = Array.isArray(item.images) ? item.images.filter(u=>typeof u==='string'&&u.trim()).slice(0,20) : [];
      const videos = Array.isArray(item.videos) ? item.videos.filter(u=>typeof u==='string'&&/^https?:\/\//i.test(u.trim())).slice(0,5) : [];
      const priceBadge = (item.price!=null) ? `<div style="margin-top:12px;margin-bottom:12px;padding:12px;background:linear-gradient(135deg, #fff7ed 0%, #ffe4cc 100%);border:2px solid var(--primary);border-radius:8px;color:var(--primary);font-weight:700;font-size:18px;">💰 السعر: ${item.price} ${fmtCur(item.currency||'IQD')}</div>` : '';
      
      // معرض الصور بتنسيق محسّن
      const gallery = images.length ? `
        <section style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
          <h3>معرض الصور</h3>
          <div class="files-list" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:12px;">
            ${images.map(u=>`<img class="gallery-img" src="${u}" alt="صورة البرنامج" style="width:100%;height:150px;object-fit:cover;border-radius:8px;border:2px solid var(--border);cursor:pointer;transition:all 0.3s;box-shadow:0 2px 8px rgba(0,0,0,0.1)" loading="lazy" onerror="this.remove()">`).join('')}
          </div>
        </section>
      ` : '';
      
      const embeds = videos.map(makeVideoEmbed).filter(Boolean).join('');
      const videoSection = embeds ? `
        <section style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);">
          <h3>الفيديوهات التوضيحية</h3>
          <div>${embeds}</div>
        </section>
      ` : '';
      
      const features = Array.isArray(item.features) && item.features.length ? `
        <section style="margin-top:12px;">
          <h3>الميزات الرئيسية</h3>
          <ul style="display:flex;flex-direction:column;gap:8px;list-style:none;padding:0;margin:0;width:100%;">
            ${item.features.map(f=>{
              let text = f;
              let style = '';
              let link = null;
              if (typeof f === 'object' && f.text) {
                text = f.text;
                style = f.style || '';
                link = f.link;
              }
              const txt = (text || '').toString();
              const safeStyle = (style || '').replace(/color\s*:[^;]+;?/gi, '');
              const content = `<span style="${safeStyle};white-space:pre-wrap;color:inherit;">✓ ${txt}</span>`;
              return `<li style="padding:10px;background:var(--bg-hover);border-radius:6px;border-left:4px solid var(--primary);padding-left:12px;">${link ? `<a href="${link}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;">${content}</a>` : content}</li>`;
            }).join('')}
          </ul>
        </section>
      ` : '';
      
      container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;" class="responsive-detail">
          <div>
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="gallery-img" style="width:100%;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);cursor:pointer;" loading="lazy" onerror="this.remove()" />` : ''}
          </div>
          <div>
            <h1 style="margin-top:0;">${item.name||'برنامج'}</h1>
            ${item.logo ? `<img src="${item.logo}" alt="لوغو" style="width:60px;height:60px;object-fit:contain;margin-bottom:12px;">` : ''}
            ${item.shortDescription ? `<p style="font-size:18px;line-height:1.6;color:var(--text-muted);margin-bottom:12px;">${item.shortDescription}</p>` : ''}
            ${priceBadge}
          </div>
        </div>
        ${features}
        ${gallery}
        ${videoSection}
        <div class="actions" style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);">
          <a class="btn" href="programs.html">← العودة إلى البرامج</a>
        </div>
      `;
      
      // إضافة مستمعات الصور للـ modal
      const galleryImgs = container.querySelectorAll('.gallery-img');
      galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
          window.ITECH_IMAGE_MODAL.show(img.src);
        });
        img.addEventListener('mouseover', () => {
          img.style.transform = 'scale(1.05)';
        });
        img.addEventListener('mouseout', () => {
          img.style.transform = 'scale(1)';
        });
      });
      
      // إضافة responsive للتصميم
      if (window.innerWidth < 768) {
        const grid = container.querySelector('.responsive-detail');
        if (grid) grid.style.gridTemplateColumns = '1fr';
      }
    })
    .catch(()=>{ container.innerHTML = '<p class="under-construction">تعذر تحميل تفاصيل البرنامج.</p>'; });
})();
