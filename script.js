// =============================================
// ملف المنطق - script.js
// كل دالة معلّق عليها شرح مفصل
// =============================================


// =============================================
// 1. قائمة كلمات المرور الشائعة
// هذي قاعدة بيانات مصغّرة بأكثر كلمات المرور
// استخداماً في العالم — نفحص إذا كلمة المرور
// موجودة فيها
// =============================================
const COMMON_PASSWORDS = [
  "123456","password","123456789","12345678","12345",
  "1234567","1234567890","qwerty","abc123","111111",
  "123123","admin","letmein","welcome","monkey",
  "dragon","master","pass","hello","login",
  "sunshine","princess","shadow","michael","superman",
  "iloveyou","trustno1","batman","654321","superman",
  "access","flower","jessica","696969","football",
  "baseball","soccer","hockey","harley","ranger",
  "donald","tigger","jordan","test","1q2w3e",
  "qwertyuiop","password1","password123","admin123","root"
];


// =============================================
// 2. الاستماع لحقل كلمة المرور
// "addEventListener" = ينتظر حدثاً معيناً
// "input" = كل مرة يكتب المستخدم حرفاً
// =============================================
document.getElementById('passwordInput').addEventListener('input', function() {
  // "this.value" = القيمة الحالية في الحقل
  analyzePassword(this.value);
});


// =============================================
// 3. الدالة الرئيسية: تحليل كلمة المرور
// تُستدعى كل مرة يكتب المستخدم حرفاً جديداً
// =============================================
function analyzePassword(password) {

  // إذا الحقل فاضي، إعادة ضبط كل شيء
  if (password.length === 0) {
    resetAll();
    return; // توقف هنا، لا تكمل
  }

  // --- تشغيل كل الفحوصات ---
  const checks = runChecks(password);

  // --- حساب الدرجة (من 100) ---
  const score = calculateScore(password, checks);

  // --- تحديث الواجهة ---
  updateStrengthBar(score);
  updateCriteriaIcons(checks);
  updateCards(password, score);
  updateSuggestions(checks, password);
}


// =============================================
// 4. دالة الفحوصات
// تفحص كل معيار وترجع true أو false
// =============================================
function runChecks(pwd) {

  // test() = دالة في JavaScript تفحص نمطاً (Regex)
  // الـ Regex هو لغة لوصف أنماط النصوص

  return {
    // هل الطول 8 أو أكثر؟
    length:   pwd.length >= 8,

    // هل فيه حرف كبير؟ [A-Z] = أي حرف من A لـ Z
    upper:    /[A-Z]/.test(pwd),

    // هل فيه حرف صغير؟ [a-z] = أي حرف من a لـ z
    lower:    /[a-z]/.test(pwd),

    // هل فيه رقم؟ [0-9] = أي رقم من 0 لـ 9
    number:   /[0-9]/.test(pwd),

    // هل فيه رمز خاص؟ [^...] = أي شيء غير الحروف والأرقام
    special:  /[^A-Za-z0-9]/.test(pwd),

    // هل هي ليست من الكلمات الشائعة؟
    // toLowerCase() = تحويل للحروف الصغيرة للمقارنة
    // includes() = هل القائمة تحتوي على هذه الكلمة؟
    notCommon: !COMMON_PASSWORDS.includes(pwd.toLowerCase()),

    // هل لا يحتوي تكرار؟ مثل: "aaaaaa" أو "123123"
    // \1 = يشير لنفس الحرف السابق
    // {3,} = 3 مرات أو أكثر
    noRepeat:  !/(.)\1{3,}/.test(pwd)
  };
}


// =============================================
// 5. حساب الدرجة (من 100)
// كل معيار له وزن مختلف حسب أهميته
// =============================================
function calculateScore(pwd, checks) {
  let score = 0;

  // --- نقاط المعايير الأساسية ---
  if (checks.length)    score += 20; // الطول مهم جداً
  if (checks.upper)     score += 10;
  if (checks.lower)     score += 10;
  if (checks.number)    score += 15;
  if (checks.special)   score += 20; // الرموز تزيد القوة كثيراً
  if (checks.notCommon) score += 15;
  if (checks.noRepeat)  score += 10;

  // --- نقاط إضافية للطول الزائد ---
  // كل حرف إضافي بعد 8 = نقطة إضافية، بحد أقصى 10 نقاط
  if (pwd.length > 8) {
    score += Math.min(pwd.length - 8, 10);
  }

  // التأكد أن الدرجة لا تتجاوز 100
  return Math.min(score, 100);
}


// =============================================
// 6. تحديث شريط القوة
// يغير العرض واللون حسب الدرجة
// =============================================
function updateStrengthBar(score) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

  // تحديد المستوى والنص واللون
  let level, text, colorClass;

  if (score < 20) {
    level = 'ضعيفة جداً'; text = '😰 ضعيفة جداً'; colorClass = 'fill-weak';
  } else if (score < 40) {
    level = 'ضعيفة';      text = '😟 ضعيفة';      colorClass = 'fill-weak';
  } else if (score < 60) {
    level = 'مقبولة';     text = '😐 مقبولة';     colorClass = 'fill-fair';
  } else if (score < 75) {
    level = 'جيدة';       text = '🙂 جيدة';       colorClass = 'fill-good';
  } else if (score < 90) {
    level = 'قوية';       text = '😊 قوية';       colorClass = 'fill-strong';
  } else {
    level = 'ممتازة';     text = '🔥 ممتازة!';    colorClass = 'fill-great';
  }

  // تحديث العرض (CSS width)
  fill.style.width = score + '%';

  // إزالة كل الكلاسات القديمة وإضافة الجديدة
  fill.className = 'strength-fill ' + colorClass;

  // تحديث النص
  label.textContent = text;
}


// =============================================
// 7. تحديث أيقونات المعايير ✅ أو ❌
// =============================================
function updateCriteriaIcons(checks) {

  // خريطة: ID العنصر ← اسم الفحص
  const mapping = {
    'c-length':  'length',
    'c-upper':   'upper',
    'c-lower':   'lower',
    'c-number':  'number',
    'c-special': 'special',
    'c-common':  'notCommon',
    'c-repeat':  'noRepeat'
  };

  // نمر على كل معيار ونحدثه
  for (const [id, checkName] of Object.entries(mapping)) {
    const element = document.getElementById(id);
    const icon    = element.querySelector('.criteria-icon');
    const passed  = checks[checkName];

    if (passed) {
      // اجتاز: أيقونة خضراء وكلاس pass
      icon.textContent = '✅';
      element.className = 'criteria-item pass';
    } else {
      // فشل: أيقونة حمراء وكلاس fail
      icon.textContent = '❌';
      element.className = 'criteria-item fail';
    }
  }
}


// =============================================
// 8. تحديث البطاقات الثلاث
// (وقت الاختراق - الدرجة - التعقيد)
// =============================================
function updateCards(pwd, score) {

  // --- وقت الاختراق ---
  document.getElementById('crackTime').textContent = estimateCrackTime(pwd);

  // --- درجة القوة ---
  document.getElementById('scoreValue').textContent = score + ' / 100';

  // --- مستوى التعقيد (Entropy) ---
  // الـ Entropy = مقياس عشوائية كلمة المرور بالبت
  const entropy = calculateEntropy(pwd);
  document.getElementById('entropyValue').textContent = entropy.toFixed(1) + ' bit';
}


// =============================================
// 9. حساب الـ Entropy (التعقيد)
// الفكرة: كلما كان المجال أكبر والطول أطول = أصعب
// المعادلة: Entropy = طول × log2(حجم المجال)
// =============================================
function calculateEntropy(pwd) {
  let pool = 0;

  if (/[a-z]/.test(pwd))         pool += 26;  // 26 حرف صغير
  if (/[A-Z]/.test(pwd))         pool += 26;  // 26 حرف كبير
  if (/[0-9]/.test(pwd))         pool += 10;  // 10 أرقام
  if (/[^A-Za-z0-9]/.test(pwd))  pool += 32;  // 32 رمز خاص تقريباً

  if (pool === 0) return 0;

  // Math.log2 = اللوغاريتم الثنائي
  return pwd.length * Math.log2(pool);
}


// =============================================
// 10. تقدير وقت الاختراق — منطقي وواقعي
//
// نستخدم 3 سيناريوهات حسب نوع الهاكر:
//
// 🟢 هاكر عادي   = 1 مليون محاولة/ثانية
//    (جهاز شخصي عادي يخمن كلمات المرور)
//
// 🟡 هاكر متوسط  = 1 مليار محاولة/ثانية
//    (GPU قوي أو خادم متخصص)
//
// 🔴 هاكر متقدم  = 100 مليار محاولة/ثانية
//    (مزرعة سيرفرات أو ASIC chips)
//
// نعرض السيناريو المتوسط للمستخدم
// لكن نحسب كل الثلاثة داخلياً
// =============================================
function estimateCrackTime(pwd) {

  // --- الخطوة 1: تحديد حجم المجال (pool) ---
  // كلما كان المجال أكبر = أصعب التخمين
  let pool = 0;
  if (/[a-z]/.test(pwd))        pool += 26;  // أحرف صغيرة
  if (/[A-Z]/.test(pwd))        pool += 26;  // أحرف كبيرة
  if (/[0-9]/.test(pwd))        pool += 10;  // أرقام
  if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;  // رموز خاصة
  if (pool === 0) pool = 26;

  // --- الخطوة 2: حساب الـ Entropy بالبت ---
  // Entropy = طول × log2(pool)
  // كلما زاد = أصعب
  const entropy = pwd.length * Math.log2(pool);

  // --- الخطوة 3: حساب الاحتمالات ---
  // عدد الاحتمالات = 2 ^ entropy
  // نستخدم entropy بدل Math.pow مباشرة
  // لأن الأرقام الكبيرة جداً تسبب مشكلة في JS
  // Math.pow(2, entropy) = نفس النتيجة لكن أدق

  // سرعة الهاكر المتوسط = مليار محاولة في الثانية
  const SPEEDS = {
    weak:    1_000_000,       // هاكر عادي
    medium:  1_000_000_000,   // هاكر متوسط ← نعرض هذا
    strong:  100_000_000_000  // هاكر متقدم
  };

  // --- الخطوة 4: تعديل الوقت حسب الأنماط ---
  // إذا كانت الكلمة شائعة أو بسيطة نخفض الوقت
  let multiplier = 1;

  // كلمة شائعة = تُكسر فوراً من قواميس الهاكرز
  if (COMMON_PASSWORDS.includes(pwd.toLowerCase())) {
    multiplier = 0.000001; // أقل من ثانية دائماً
  }
  // تكرار واضح مثل "aaaaaa" يسهّل التخمين
  else if (/(.)\1{3,}/.test(pwd)) {
    multiplier = 0.001;
  }
  // نمط متسلسل مثل "123456" أو "abcdef"
  else if (/^[0-9]+$/.test(pwd) || /^[a-z]+$/.test(pwd) || /^[A-Z]+$/.test(pwd)) {
    multiplier = 0.01;
  }

  // --- الخطوة 5: حساب الثواني ---
  // نستخدم logarithm لتجنب overflow في الأرقام الكبيرة
  // log10(احتمالات) - log10(سرعة) = log10(ثواني)
  const log10combinations = entropy * Math.log10(2);
  const log10speed        = Math.log10(SPEEDS.medium);
  const log10seconds      = log10combinations - log10speed + Math.log10(multiplier);
  const seconds           = Math.pow(10, log10seconds);

  // --- الخطوة 6: تحديد الحد الأقصى 10 سنوات ---
  // أي كلمة مرور تتجاوز 10 سنوات = ممتازة
  const TEN_YEARS = 10 * 365 * 24 * 3600; // 10 سنوات بالثواني
  const capped    = Math.min(seconds, TEN_YEARS);

  return formatTime(capped);
}

// دالة مساعدة: تحوّل الثواني لنص واضح
// الحد الأقصى = 10 سنوات
function formatTime(seconds) {

  // أقل من ثانية
  if (seconds < 1)
    return '⚡ أقل من ثانية';

  // ثواني (1 - 59)
  if (seconds < 60)
    return `🕐 ${Math.round(seconds)} ثانية`;

  // دقائق (1 - 59 دقيقة)
  if (seconds < 3600) {
    const mins = Math.round(seconds / 60);
    return `🕐 ${mins} دقيقة`;
  }

  // ساعات (1 - 23 ساعة)
  if (seconds < 86400) {
    const hrs = Math.round(seconds / 3600);
    return `🕐 ${hrs} ساعة`;
  }

  // أيام (1 - 30 يوم)
  if (seconds < 2592000) {
    const days = Math.round(seconds / 86400);
    return `📅 ${days} يوم`;
  }

  // أشهر (1 - 11 شهر)
  if (seconds < 31536000) {
    const months = Math.round(seconds / 2592000);
    return `📅 ${months} شهر`;
  }

  // سنوات (1 - 10 سنوات)
  if (seconds < 315360000) {
    const years = Math.round(seconds / 31536000);
    return `🗓️ ${years} سنة`;
  }

  // الحد الأقصى = 10 سنوات
  return '🛡️ أكثر من 10 سنوات';
}


// =============================================
// 11. التوصيات
// تولّد قائمة نصائح حسب ما ينقص كلمة المرور
// =============================================
function updateSuggestions(checks, pwd) {
  const list = document.getElementById('suggestionsList');
  const suggestions = [];

  // نضيف توصية لكل معيار فشل
  if (!checks.length)
    suggestions.push('🔤 زد الطول لـ 8 أحرف على الأقل — كلما طالت كانت أقوى');

  if (!checks.upper)
    suggestions.push('🔠 أضف أحرفاً كبيرة مثل: A B C D');

  if (!checks.lower)
    suggestions.push('🔡 أضف أحرفاً صغيرة مثل: a b c d');

  if (!checks.number)
    suggestions.push('🔢 أضف أرقاماً مثل: 3 7 9 1');

  if (!checks.special)
    suggestions.push('✨ أضف رموزاً خاصة مثل: ! @ # $ % ^');

  if (!checks.notCommon)
    suggestions.push('🚫 هذه الكلمة شائعة جداً وسهلة التخمين — غيّرها فوراً!');

  if (!checks.noRepeat)
    suggestions.push('🔄 تجنب تكرار نفس الحرف كثيراً مثل: "aaaaaa"');

  if (pwd.length > 0 && pwd.length < 12)
    suggestions.push('📏 الطول المثالي هو 12 حرفاً أو أكثر');

  // إذا ما في توصيات = كلمة مرور ممتازة
  if (suggestions.length === 0) {
    list.innerHTML = '<div class="suggestion-item">🎉 ممتاز! كلمة مرورك قوية جداً</div>';
    return;
  }

  // بناء HTML للتوصيات
  list.innerHTML = suggestions
    .map(s => `<div class="suggestion-item">${s}</div>`)
    .join('');
}


// =============================================
// 12. مولّد كلمة المرور القوية
// يولّد كلمة مرور عشوائية حسب الخيارات
// =============================================
function generatePassword() {

  // قراءة الخيارات من الـ checkboxes
  const useUpper   = document.getElementById('gen-upper').checked;
  const useLower   = document.getElementById('gen-lower').checked;
  const useNumbers = document.getElementById('gen-numbers').checked;
  const useSpecial = document.getElementById('gen-special').checked;
  const length     = parseInt(document.getElementById('lengthSlider').value);

  // بناء مجموعة الحروف المسموح بها
  let charset = '';
  if (useUpper)   charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower)   charset += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) charset += '0123456789';
  if (useSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // إذا ما اختار شيء، استخدم الكل
  if (charset === '') {
    charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  }

  // توليد الكلمة حرفاً حرفاً
  let password = '';
  for (let i = 0; i < length; i++) {
    // Math.random() = رقم عشوائي من 0 لـ 1
    // Math.floor() = تقريب للأسفل
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // عرض النتيجة
  document.getElementById('generatedPassword').textContent = password;
  document.getElementById('generatedResult').style.display = 'flex';

  // تحليلها تلقائياً
  const input = document.getElementById('passwordInput');
  input.value = password;
  analyzePassword(password);
}


// =============================================
// 13. نسخ كلمة المرور المولّدة
// =============================================
function copyPassword() {
  const pwd = document.getElementById('generatedPassword').textContent;

  // navigator.clipboard = API المتصفح للنسخ
  navigator.clipboard.writeText(pwd).then(() => {
    const btn = document.querySelector('.copy-btn');
    const original = btn.textContent;
    btn.textContent = '✅ تم النسخ!';
    // إعادة النص الأصلي بعد ثانيتين
    setTimeout(() => btn.textContent = original, 2000);
  }).catch(() => {
    // في حال فشل الـ clipboard
    alert('تعذّر النسخ التلقائي، انسخ يدوياً');
  });
}


// =============================================
// 14. إظهار/إخفاء كلمة المرور
// =============================================
function togglePassword() {
  const input = document.getElementById('passwordInput');
  const btn   = document.getElementById('toggleBtn');

  if (input.type === 'password') {
    input.type = 'text';   // إظهار
    btn.textContent = '🙈';
  } else {
    input.type = 'password'; // إخفاء
    btn.textContent = '👁️';
  }
}


// =============================================
// 15. إعادة ضبط كل شيء
// تُستدعى عند مسح الحقل
// =============================================
function resetAll() {
  // شريط القوة
  document.getElementById('strengthFill').style.width = '0%';
  document.getElementById('strengthFill').className = 'strength-fill';
  document.getElementById('strengthLabel').textContent = 'في انتظار كلمة المرور...';

  // البطاقات
  document.getElementById('crackTime').textContent   = '---';
  document.getElementById('scoreValue').textContent  = '---';
  document.getElementById('entropyValue').textContent = '---';

  // المعايير
  const ids = ['c-length','c-upper','c-lower','c-number','c-special','c-common','c-repeat'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    el.className = 'criteria-item';
    el.querySelector('.criteria-icon').textContent = '⬜';
  });

  // التوصيات
  document.getElementById('suggestionsList').innerHTML =
    '<p class="placeholder-text">ابدأ بكتابة كلمة المرور لتظهر التوصيات...</p>';
}
