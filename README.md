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
تعتمد الصفحة الآن على ملف JSON واحد داخل الموقع: [assets/data/tenders.json](assets/data/tenders.json).
أي نشر جديد يتم عبر تعديل هذا الملف مباشرة باستخدام GitHub API من خلال صفحة الإدارة.
## إضافة إعلان جديد

الطريقة الموصى بها:

- افتح صفحة الإدارة [tender-admin.html](tender-admin.html) واملأ الحقول المطلوبة.
- أدخل إعدادات GitHub للنشر: `Owner`, `Repo`, `Branch` و`Path` (افتراضي: `assets/data/tenders.json`).
- الصق رمز وصول (PAT) لديه صلاحية `contents:write` على المستودع.
- اضغط "نشر" ليتم إنشاء Commit يحدّث ملف `tenders.json`. خلال دقيقة يظهر التحديث في صفحة المناقصات.

### النشر إلى GitHub (بدون Backend)
- يتم الجلب والتحديث عبر GitHub REST API مباشرة من المتصفح.
- أنشئ PAT (يفضل Fine‑grained) بصلاحية "Contents: Read and write" على مستودع الموقع فقط.
- خيار "حفظ الرمز" يخزنه محليًا في المتصفح، لا يُنشر علنًا.

المخطط الحقول:

`id, title, entity, category, city, adNumber, deadline, postedDate, status, link, description, documentPrice, currency, pickupLocation, submissionPlace, submissionRequirements[], notes, contact{phone,email}, files[{label,url}]`

ملاحظات:
- عند فشل أي جلب، يرجع الكود للملف المحلي `assets/data/tenders.json`.
- يدعم الكود تواريخ بصيغة `dd/mm/yyyy` ويحوّلها تلقائيًا إلى `yyyy-mm-dd`.

## الأمان والوصول الخاص
- صفحة الإدارة غير مرتبطة في التصفح؛ يمكن فتحها مباشرة عبر: `/tender-admin.html`.

## القادم
- ربط نموذج التواصل بواجهة خلفية (Node/Express) وتخزين الإحصائيات في قاعدة بيانات.
- تحسينات الأداء ونسخ احتياطي تلقائي عند إضافة Backend.

## تحسين الأداء
- تحميل الخط مسبقاً وتأجيل السكربتات تم تطبيقهما.
- استخدام صور PNG/WebP مضغوطة بخلفية شفافة للشعار.
- تفعيل Lazy Loading للصور الكبيرة بإضافة `loading="lazy"`.

## الأمان والنسخ الاحتياطي (عند إضافة Backend)
- إخفاء الأسرار في `.env` واستخدام HTTPS.
- التحقق من الحقول وتطبيق حماية XSS/CSRF.
- جدولة نسخ احتياطي تلقائي كل ساعة.

## النشر
- نشر ثابت: Netlify أو GitHub Pages.
- Backend: Render أو VPS.
```powershell
# مثال نشر إلى Netlify باستخدام CLI
# netlify deploy --prod --dir "e:\test\web site"
```
