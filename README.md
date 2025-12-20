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
