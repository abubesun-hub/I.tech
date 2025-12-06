// تفعيل قائمة الموبايل + مؤشرات بسيطة + إحصائيات محلية
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
  toggleBtn.setAttribute('aria-label', 'تبديل الوضع الليلي');
  toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'; // Moon icon
  
  const nav = document.querySelector('.nav');
  // burger is already defined above
  if (nav && burger) {
    nav.insertBefore(toggleBtn, burger); // Insert before burger
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
