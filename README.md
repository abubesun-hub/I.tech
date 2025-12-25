# موقع I.TECH (نسخة ثابتة)

موقع عربي RTL بتصميم نيومورفيك، صفحات: الرئيسية، من نحن، الخدمات، تواصل معنا، ولوحة تحكم تجريبية للإحصائيات.

## التشغيل محلياً
- افتح `index.html` مباشرة في المتصفح، أو استخدم خادم محلي بسيط.

### عبر PowerShell (Windows)
```powershell
# تشغيل خادم بسيط عبر Python إن كان مثبتاً
python -m http.server 8080 -d "e:\test\web site"
# ثم افتح المتصفح تلقائياً:
Start-Process "http://localhost:8080/index.html"
```

## التخصيص
- الألوان والتدرجات في `css/main.css`.
- السلوكيات في `js/main.js`.
- المحتوى في صفحات `.html`.

## مناقصات العراق — مصدر البيانات
تعتمد الصفحة الآن على ملف JSON داخل الموقع: [assets/data/tenders.json](assets/data/tenders.json). يتم تحميله مباشرة بدون أي Backend.

## إضافة إعلان جديد (بدون Backend)
- افتح صفحة الإدارة: [tender-admin.html](tender-admin.html).
- املأ كافة الحقول المطلوبة.
- املأ إعدادات GitHub:
  - Owner: اسم الحساب/المنظمة.
  - Repo: اسم المستودع (مثال: I.tech).
  - Branch: الفرع (main).
  - Path: المسار داخل المستودع (افتراضي: assets/data/tenders.json).
- أدخل Personal Access Token (PAT) بصلاحية "Contents: Read and write" على هذا المستودع.
- اضغط "نشر مباشر على صفحة المناقصات (GitHub)".

سيقوم السكربت بجلب الملف الحالي، دمج السجل الجديد أو استبداله إن كان نفس `id` موجودًا، ثم إنشاء Commit عبر GitHub API. يظهر التحديث مباشرة، وقد يحتاج GitHub Pages دقيقة للتحديث الكامل.

ملاحظة أمنية: لا تضع الرمز داخل الكود. يتم حفظه اختياريًا في LocalStorage على هذا المتصفح فقط إذا اخترت ذلك.

## ضبط المصدر
الإعداد الافتراضي في [js/main.js](js/main.js) هو القراءة من JSON (`sourceType: 'json'`). يمكن تغيير المسار عبر تهيئة `window.ITECH_TENDERS_CONFIG.jsonUrl` إذا لزم.

## تنسيق البيانات
كل عنصر في JSON يحتوي الحقول التالية:
`id, title, entity, category, city, adNumber, deadline, postedDate, status, link, description, documentPrice, currency, pickupLocation, submissionPlace, submissionRequirements[], notes, contact{phone,email}, files[{label,url}]`

## الأمان
- صفحة الإدارة غير مربوطة في قائمة التصفح العامة ويمكن الوصول إليها مباشرة عبر الرابط.
- استخدام PAT يكون من طرف العميل فقط لهذا الغرض؛ يُنصح بإنشاء Token مخصص محدود على هذا المستودع.

## القادم
- تحسين واجهة الإدارة والتحقق من المدخلات.
- إضافة عرض مرفقات وروابط تفصيلية لكل مناقصة.

## تحسين الأداء
- تحميل الخط مسبقاً وتأجيل السكربتات تم تطبيقهما.
- استخدام صور PNG/WebP مضغوطة بخلفية شفافة للشعار.
- تفعيل Lazy Loading للصور الكبيرة بإضافة `loading="lazy"`.

## الأمان والنسخ الاحتياطي
- في حال إضافة Backend مستقبلًا: إخفاء الأسرار في `.env`, استخدام HTTPS, حماية XSS/CSRF, وجدولة نسخ احتياطي.

## النشر
- نشر ثابت: Netlify أو GitHub Pages.
- Backend: Render أو VPS.
```powershell
# مثال نشر إلى Netlify باستخدام CLI
# netlify deploy --prod --dir "e:\test\web site"
```
