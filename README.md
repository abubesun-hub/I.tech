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

## مناقصات العراق — مصادر البيانات
تم إعداد صفحة "مناقصات العراق" لتقرأ البيانات من أحد المصادر التالية:

- JSON محلي: الافتراضي من `assets/data/tenders.json`.
- CSV محلي: من `assets/data/tenders.csv`.
- API خارجي: رابط REST يعيد JSON بنفس البنية.
  
### ربط Google Sheet عبر Web App (موصى به)
- استخدم السكربت الجاهز في: [assets/apps-script/Code.gs](assets/apps-script/Code.gs)
	1. انسخ المحتوى إلى مشروع Google Apps Script جديد.
	2. حدّد `SHEET_ID`, `SHEET_NAME`, ويمكن ضبط `SECRET_KEY` اختياريًا.
	3. من Deploy → New deployment → Web App:
		 - Execute the app as: Me
		 - Who has access: Anyone
		 - انسخ رابط الويب-آب (يُنتهي بـ `/exec`).
- للوصول للبيانات (list) عبر JSONP: أضف `?action=list&key=SECRET` إن استخدمت مفتاحًا.
- لإضافة صف (append) عبر JSONP: مرّر الأعمدة كـ Query Params مع `action=append` و`callback=...` كما تفعل صفحة الإدارة.

#### تسجيل دخول آمن (Token)
- السكربت يدعم `action=login` ويعيد `token` موقّعًا (HMAC) صالحًا لمدة ساعتين.
- صفحة الإدارة تطلب هذا `token` تلقائيًا عند إدخال المستخدم `Abubesun` وكلمة المرور `Ahmed1985` مع ضبط رابط الـ Web App.
- جميع عمليات القراءة/الإضافة تتطلب إما `token` أو `key` عند تفعيل `SECRET_KEY`.

### تفعيل المصدر من المتصفح دون تعديل الكود
- افتح صفحة الإدارة [tender-admin.html](tender-admin.html) وأدخل رابط الـ Web App ومفتاحك (اختياري)، ثم اضغط "تفعيل كمصدر للموقع".
- أو عبر الرابط مباشرة:
	- مثال عام مع مفتاح: `tenders.html?src=api&apiMode=jsonp&api=https://script.google.com/macros/s/XXXXX/exec?action=list&key=SECRET`
	- مثال مع رمز دخول: `tenders.html?src=api&apiMode=jsonp&api=https://script.google.com/macros/s/XXXXX/exec?action=list&token=YOUR_TOKEN`
## إضافة إعلان جديد

هناك عدة طرق:

- تعديل JSON يدويًا: افتح [assets/data/tenders.json](assets/data/tenders.json) وأضف عنصرًا جديدًا بنفس الحقول.
- تعديل CSV يدويًا: أضف سطرًا جديدًا في [assets/data/tenders.csv](assets/data/tenders.csv) وفق الأعمدة.
- استخدام صفحة مولّد: افتح [tender-admin.html](tender-admin.html)، املأ الحقول ثم استخدم الأزرار:
	- "توليد JSON/CSV" لاستعراض المخرجات.
	- "تنزيل ملف JSON مدمج" لإنزال نسخة تحتوي السجل الجديد مدموجًا مع البيانات الحالية (استبدل بها الملف الأصلي).
	- "تنزيل سطر CSV" لإضافته إلى ملف CSV.
	- "نشر إلى Google Sheet" لإرسال السجل إلى الجدول عبر Web App (JSONP)، يتطلب ضبط رابط ومفتاح اختياري.
	- "تفعيل كمصدر للموقع" لحفظ رابط القراءة في LocalStorage، وسيستخدمه [tenders.html](tenders.html) تلقائيًا. إذا كانت جلسة الدخول صالحة سيُحفظ `token` ضمن الرابط.
	- "نشر مباشر على صفحة المناقصات (GitHub)": يحدّث الملف [assets/data/tenders.json](assets/data/tenders.json) في مستودع GitHub عبر GitHub API دون الحاجة لBackend.

### النشر المباشر إلى GitHub (بدون Backend)
- من [tender-admin.html](tender-admin.html) املأ حقول GitHub: `Owner`, `Repo`, `Branch` (main)، و`Path` (افتراضي: `assets/data/tenders.json`).
- أنشئ Personal Access Token (يفضّل Fine-grained) بصلاحية "Contents: Read and write" على المستودع الهدف فقط.
- الصق الرمز في الحقل ثم اضغط "نشر مباشر على صفحة المناقصات (GitHub)".
- سيقوم السكربت بجلب الملف الحالي، دمج السجل الجديد، ثم إنشاء Commit. قد يستغرق تحديث GitHub Pages دقيقة تقريبًا.
- ملاحظة أمنية: لا تشارك الرمز علنًا. خيار "حفظ الرمز" يخزّنه في LocalStorage على هذا المتصفح فقط.

بعد التحديث، يمكنك ضبط المصدر من `js/main.js` عبر `window.ITECH_TENDERS_CONFIG.sourceType` إلى `json` أو `csv` أو `api`.

تبديل المصدر يتم من أعلى ملف `js/main.js` عبر الكائن التالي:

```
window.ITECH_TENDERS_CONFIG = {
	sourceType: 'json', // json | csv | api
	jsonUrl: './assets/data/tenders.json',
	csvUrl: './assets/data/tenders.csv',
	apiUrl: ''
};
```

عند اختيار `api` يجب أن يعيد السيرفر مصفوفة عناصر بهذه الحقول:

`id, title, entity, category, city, adNumber, deadline, postedDate, status, link, description, documentPrice, currency, pickupLocation, submissionPlace, submissionRequirements[], notes, contact{phone,email}, files[{label,url}]`

ملاحظات:
- في وضع CSV يتم تحويل عمود `submissionRequirements` إلى مصفوفة باستخدام الفاصل `;`.
- عند فشل جلب المصدر، يحدث رجوع تلقائي إلى JSON المحلي.
- يدعم الكود التواريخ بصيغة `dd/mm/yyyy` ويحوّلها تلقائيًا إلى `yyyy-mm-dd`.

## الأمان والوصول الخاص
- صفحة الإدارة غير مرتبطة في التصفح؛ يمكن فتحها عبر رابط مباشر: `/tender-admin.html`.
- استخدم `SECRET_KEY` في سكربت Google Apps Script لحماية عمليات الإضافة؛ أي طلب بدون المفتاح سيرفض.
- يدعم السكربت رمز دخول `token` عبر تسجيل الدخول؛ تحتفظ الصفحة به محليًا وتضيفه تلقائيًا للطلبات.

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
