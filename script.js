// =============================================
// script.js — محلل كلمة المرور
// نسخة نظيفة بدون تكرار
// =============================================

// =============================================
// 1. قائمة الكلمات الشائعة
// =============================================
const COMMON_PASSWORDS = new Set([
  "123456","password","123456789","12345678","12345","1234567","1234567890",
  "qwerty","abc123","111111","123123","admin","letmein","welcome","monkey",
  "dragon","master","pass","hello","login","sunshine","princess","shadow",
  "michael","superman","iloveyou","trustno1","batman","654321","access",
  "flower","jessica","696969","football","baseball","soccer","hockey",
  "harley","ranger","donald","tigger","jordan","test","1q2w3e","qwertyuiop",
  "password1","password123","admin123","root","toor","pass123","p@ssword",
  "passw0rd","pa$$word","p@$$w0rd","password!","1234","000000","11111111",
  "1111","777777","1234qwer","qwerty123","q1w2e3r4","aaaaaa","abcdef",
  "abc","a1b2c3","qazwsx","zxcvbn","asdfgh","zxcvbnm","asdfghjkl",
  "qwertyui","1q2w3e4r","1qaz2wsx","q1w2e3","hunter2","hunter","secret",
  "samsung","apple","google","amazon","facebook","twitter","instagram",
  "youtube","netflix","disney","microsoft","windows","linux","ubuntu",
  "android","iphone","macbook","playstation","xbox","nintendo","tiktok",
  "pokemon","minecraft","fortnite","roblox","naruto","goku","dragon1",
  "2020","2021","2022","2023","2024","2025","1990","1991","1992","1993",
  "1994","1995","1996","1997","1998","1999","2000","2001","2002","2003",
  "2004","2005","2006","2007","2008","2009","2010","2011","2012","2013",
  "2014","2015","2016","2017","2018","2019","summer","winter","spring",
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
  "january","february","march","april","may","june","july","august",
  "september","october","november","december","mustafa","mohammed","ahmad",
  "ali","omar","hassan","hussein","fatima","aisha","khadija","zainab",
  "maryam","nour","sara","abdullah","abdulrahman","khalid","sultan",
  "faisal","ahmed","Pass@1","Pass123","Admin@1","Admin@123","User@1",
  "password2","password3","mypassword","mypass","newpassword","changeme",
  "default","temp","guest","user","info","support","backup","office",
  "iloveyou1","loveme","letmein1","welcome1","hello123","demo","testing",
]);

// =============================================
// 2. أنماط التسلسل الضعيفة
// =============================================
const WEAK_PATTERNS = [
  { pattern: /(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){3,}/, penalty: 30, msg: "🔢 تسلسل أرقام تصاعدي (مثل: 1234)" },
  { pattern: /(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)){3,}/, penalty: 30, msg: "🔢 تسلسل أرقام تنازلي (مثل: 9876)" },
  { pattern: /(\d)\1{3,}/, penalty: 30, msg: "🔢 تكرار نفس الرقم (مثل: 0000)" },
  { pattern: /^\d+$/, penalty: 35, msg: "🔢 أرقام فقط — ضعيف جداً" },
  { pattern: /^(\d{2,4})\1+$/, penalty: 35, msg: "🔢 نمط أرقام متكرر (مثل: 123123)" },
  { pattern: /(19|20)\d{2}/, penalty: 15, msg: "📅 يحتوي سنة — سهلة التخمين" },
  { pattern: /(?:a(?=b)|b(?=c)|c(?=d)|d(?=e)|e(?=f)|f(?=g)|g(?=h)|h(?=i)|i(?=j)|j(?=k)|k(?=l)|l(?=m)|m(?=n)|n(?=o)|o(?=p)|p(?=q)|q(?=r)|r(?=s)|s(?=t)|t(?=u)|u(?=v)|v(?=w)|w(?=x)|x(?=y)|y(?=z)){3,}/i, penalty: 25, msg: "🔤 تسلسل حروف (مثل: abcd)" },
  { pattern: /^[a-zA-Z]+$/, penalty: 20, msg: "🔤 حروف فقط بدون أرقام أو رموز" },
  { pattern: /([a-zA-Z])\1{3,}/, penalty: 25, msg: "🔤 تكرار نفس الحرف (مثل: aaaa)" },
  { pattern: /qwert|werty|ertyu|asdfg|sdfgh|zxcvb|xcvbn|poiuy|lkjhg|mnbvc/i, penalty: 35, msg: "⌨️ تسلسل لوحة مفاتيح (مثل: qwerty)" },
  { pattern: /qaz|wsx|edc|rfv|tgb|yhn|ujm/i, penalty: 30, msg: "⌨️ نمط لوحة مفاتيح عمودي" },
  { pattern: /^(.{2,})\1{2,}$/, penalty: 40, msg: "🔄 نمط متكرر كامل (مثل: abcabc)" },
  { pattern: /^[A-Z][a-z]+\d{1,4}[!@#$]?$/, penalty: 15, msg: "⚠️ نمط شائع: كلمة + أرقام (مثل: Password123)" },
];

// =============================================
// 3. ربط الأحداث — مرة واحدة فقط
// =============================================
const passwordInput = document.getElementById('passwordInput');
const tooltip       = document.getElementById('passwordTooltip');

// حدث الكتابة — يحلل ويحدث النوت معاً
passwordInput.addEventListener('input', function() {
  const pwd = this.value;
  updateTooltip(pwd);
  analyzePassword(pwd);
});

// إظهار النوت عند التركيز
passwordInput.addEventListener('focus', function() {
  if (tooltip) tooltip.classList.add('show');
});

// إخفاء النوت عند الخروج
passwordInput.addEventListener('blur', function() {
  setTimeout(() => {
    if (tooltip) tooltip.classList.remove('show');
  }, 200);
});

// =============================================
// 4. تحديث النوت المنبثق
// =============================================
function updateTooltip(pwd) {
  if (!tooltip) return;

  const reqs = [
    { id: 'req-length',  met: pwd.length >= 8 },
    { id: 'req-upper',   met: /[A-Z]/.test(pwd) },
    { id: 'req-lower',   met: /[a-z]/.test(pwd) },
    { id: 'req-number',  met: /[0-9]/.test(pwd) },
    { id: 'req-special', met: /[^A-Za-z0-9]/.test(pwd) },
  ];

  reqs.forEach(req => {
    const el = document.getElementById(req.id);
    if (!el) return;
    const icon = el.querySelector('.req-icon');
    if (!icon) return;
    if (req.met) {
      el.className     = 'done';
      icon.textContent = '✅';
    } else {
      el.className     = 'fail';
      icon.textContent = '❌';
    }
  });

  // إخفاء النوت لو اكتملت كل المتطلبات
  if (reqs.every(r => r.met)) {
    setTimeout(() => {
      if (tooltip) tooltip.classList.remove('show');
    }, 800);
  }
}

// =============================================
// 5. الدالة الرئيسية للتحليل
// =============================================
function analyzePassword(password) {
  if (password.length === 0) {
    resetAll();
    return;
  }

  const checks   = runChecks(password);
  const patterns = detectWeakPatterns(password);
  const score    = calculateScore(password, checks, patterns);

  updateStrengthBar(score);
  updateCards(password, score, patterns);
  updateSuggestions(checks, patterns, password);
}

// =============================================
// 6. فحص المعايير
// =============================================
function runChecks(pwd) {
  return {
    length:     pwd.length >= 8,
    longEnough: pwd.length >= 12,
    upper:      /[A-Z]/.test(pwd),
    lower:      /[a-z]/.test(pwd),
    number:     /[0-9]/.test(pwd),
    special:    /[^A-Za-z0-9]/.test(pwd),
    notCommon:  !COMMON_PASSWORDS.has(pwd.toLowerCase()),
    noRepeat:   !/(.)\1{3,}/.test(pwd),
    noSequence: !WEAK_PATTERNS.slice(0,3).some(p => p.pattern.test(pwd)),
  };
}

// =============================================
// 7. كشف الأنماط الضعيفة
// =============================================
function detectWeakPatterns(pwd) {
  return WEAK_PATTERNS
    .filter(wp => wp.pattern.test(pwd))
    .map(wp => ({ msg: wp.msg, penalty: wp.penalty }));
}

// =============================================
// 8. حساب الدرجة
// =============================================
function calculateScore(pwd, checks, patterns) {
  let score = 0;

  if (checks.length)     score += 15;
  if (checks.longEnough) score += 10;
  if (checks.upper)      score += 10;
  if (checks.lower)      score += 10;
  if (checks.number)     score += 10;
  if (checks.special)    score += 20;
  if (checks.notCommon)  score += 15;
  if (checks.noRepeat)   score += 5;
  if (checks.noSequence) score += 5;

  if (pwd.length > 12) score += Math.min((pwd.length - 12) * 2, 10);

  const totalPenalty = patterns.reduce((s, p) => s + p.penalty, 0);
  score -= totalPenalty;

  if (!checks.notCommon) score = Math.min(score, 5);

  return Math.max(0, Math.min(score, 100));
}

// =============================================
// 9. تحديث شريط القوة
// =============================================
function updateStrengthBar(score) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  let text, colorClass;
  if      (score < 20) { text = '😰 ضعيفة جداً';  colorClass = 'fill-weak';   }
  else if (score < 40) { text = '😟 ضعيفة';        colorClass = 'fill-weak';   }
  else if (score < 55) { text = '😐 مقبولة';       colorClass = 'fill-fair';   }
  else if (score < 70) { text = '🙂 جيدة';         colorClass = 'fill-good';   }
  else if (score < 85) { text = '😊 قوية';         colorClass = 'fill-strong'; }
  else                 { text = '🔥 ممتازة!';       colorClass = 'fill-great';  }

  fill.style.width  = score + '%';
  fill.className    = 'strength-fill ' + colorClass;
  label.textContent = text;
}

// =============================================
// 10. تحديث البطاقات
// =============================================
function updateCards(pwd, score, patterns) {
  const crack   = document.getElementById('crackTime');
  const scorEl  = document.getElementById('scoreValue');
  const entropy = document.getElementById('entropyValue');

  if (crack)   crack.textContent   = estimateCrackTime(pwd, patterns);
  if (scorEl)  scorEl.textContent  = score + ' / 100';
  if (entropy) entropy.textContent = calculateEntropy(pwd).toFixed(1) + ' bit';
}

// =============================================
// 11. حساب الـ Entropy
// =============================================
function calculateEntropy(pwd) {
  let pool = 0;
  if (/[a-z]/.test(pwd))        pool += 26;
  if (/[A-Z]/.test(pwd))        pool += 26;
  if (/[0-9]/.test(pwd))        pool += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;
  if (pool === 0) return 0;
  return pwd.length * Math.log2(pool);
}

// =============================================
// 12. تقدير وقت الاختراق
// =============================================
function estimateCrackTime(pwd, patterns) {
  if (COMMON_PASSWORDS.has(pwd.toLowerCase())) return '⚡ أقل من ثانية';

  let pool = 0;
  if (/[a-z]/.test(pwd))        pool += 26;
  if (/[A-Z]/.test(pwd))        pool += 26;
  if (/[0-9]/.test(pwd))        pool += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;
  if (pool === 0) pool = 26;

  const entropy       = pwd.length * Math.log2(pool);
  const log10seconds  = (entropy * Math.log10(2)) - 9;
  let seconds         = Math.pow(10, log10seconds);

  const totalPenalty = patterns.reduce((s, p) => s + p.penalty, 0);
  if (totalPenalty > 0) seconds *= Math.pow(0.2, totalPenalty / 10);

  seconds = Math.min(seconds, 10 * 365.25 * 24 * 3600);

  if (seconds < 1)         return '⚡ أقل من ثانية';
  if (seconds < 60)        return `🕐 ${Math.round(seconds)} ثانية`;
  if (seconds < 3600)      return `🕐 ${Math.round(seconds/60)} دقيقة`;
  if (seconds < 86400)     return `🕐 ${Math.round(seconds/3600)} ساعة`;
  if (seconds < 2592000)   return `📅 ${Math.round(seconds/86400)} يوم`;
  if (seconds < 31536000)  return `📅 ${Math.round(seconds/2592000)} شهر`;
  if (seconds < 315360000) return `🗓️ ${Math.round(seconds/31536000)} سنة`;
  return '🛡️ أكثر من 10 سنوات';
}

// =============================================
// 13. التوصيات
// =============================================
function updateSuggestions(checks, patterns, pwd) {
  const list = document.getElementById('suggestionsList');
  if (!list) return;

  const tips = [];

  if (!checks.length)                    tips.push('🔤 زد الطول لـ 8 أحرف على الأقل');
  if (checks.length && !checks.longEnough) tips.push('📏 الطول المثالي 12 حرفاً أو أكثر');
  if (!checks.upper)                     tips.push('🔠 أضف حرفاً كبيراً (A-Z)');
  if (!checks.lower)                     tips.push('🔡 أضف حرفاً صغيراً (a-z)');
  if (!checks.number)                    tips.push('🔢 أضف رقماً (0-9)');
  if (!checks.special)                   tips.push('✨ أضف رمزاً خاصاً مثل: ! @ # $');
  if (!checks.notCommon)                 tips.push('🚫 هذه الكلمة شائعة جداً — غيّرها فوراً!');
  if (!checks.noRepeat)                  tips.push('🔄 تجنب تكرار نفس الحرف أكثر من 3 مرات');

  const sorted = [...patterns].sort((a, b) => b.penalty - a.penalty);
  for (const p of sorted) tips.push(p.msg);

  if (tips.length === 0) {
    list.innerHTML = '<div class="suggestion-item" style="border-color:#4ade80;color:#4ade80">🎉 ممتاز! كلمة مرورك قوية جداً</div>';
    return;
  }

  list.innerHTML = tips.map(t => `<div class="suggestion-item">${t}</div>`).join('');
}

// =============================================
// 14. فحص HaveIBeenPwned
// =============================================
async function checkLeaked() {
  const pwd    = document.getElementById('passwordInput').value;
  const btn    = document.getElementById('checkLeakBtn');
  const result = document.getElementById('leakResult');

  if (!pwd) {
    result.innerHTML = '<span style="color:#FFD700">⚠️ اكتب كلمة مرور أولاً</span>';
    return;
  }

  btn.textContent = '⏳ جاري الفحص...';
  btn.disabled    = true;

  try {
    const hash   = await sha1(pwd);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const res    = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text   = await res.text();
    const line   = text.split('\n').find(l => l.startsWith(suffix));
    const count  = line ? parseInt(line.split(':')[1]) : 0;

    if (count === 0) {
      result.innerHTML = '<span style="color:#4ade80">✅ لم تُسرَّب — جيد!</span>';
    } else {
      result.innerHTML = `<span style="color:#f87171">🚨 ظهرت ${count.toLocaleString()} مرة في تسريبات! غيّرها الآن</span>`;
    }
  } catch {
    result.innerHTML = '<span style="color:#FFD700">⚠️ تعذّر الاتصال</span>';
  }

  btn.textContent = '🔍 فحص إذا كانت مسرّبة';
  btn.disabled    = false;
}

async function sha1(str) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('').toUpperCase();
}

// =============================================
// 15. مولّد كلمة المرور
// =============================================
function generatePassword() {
  const useUpper   = document.getElementById('gen-upper').checked;
  const useLower   = document.getElementById('gen-lower').checked;
  const useNumbers = document.getElementById('gen-numbers').checked;
  const useSpecial = document.getElementById('gen-special').checked;
  const length     = parseInt(document.getElementById('lengthSlider').value);

  let charset = '';
  if (useUpper)   charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower)   charset += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) charset += '0123456789';
  if (useSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!charset)   charset  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  document.getElementById('generatedPassword').textContent = password;
  document.getElementById('generatedResult').style.display = 'flex';
  document.getElementById('passwordInput').value = password;
  updateTooltip(password);
  analyzePassword(password);
}

// =============================================
// 16. نسخ كلمة المرور
// =============================================
function copyPassword() {
  const pwd = document.getElementById('generatedPassword').textContent;
  navigator.clipboard.writeText(pwd).then(() => {
    const btn = document.querySelector('.copy-btn');
    const orig = btn.textContent;
    btn.textContent = '✅ تم النسخ!';
    setTimeout(() => btn.textContent = orig, 2000);
  }).catch(() => alert('انسخ يدوياً'));
}

// =============================================
// 17. إظهار/إخفاء كلمة المرور
// =============================================
function togglePassword() {
  const input = document.getElementById('passwordInput');
  const btn   = document.getElementById('toggleBtn');
  if (input.type === 'password') {
    input.type      = 'text';
    btn.textContent = '🔒';
  } else {
    input.type      = 'password';
    btn.textContent = '👁';
  }
}

// =============================================
// 18. إعادة الضبط
// =============================================
function resetAll() {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  const crack = document.getElementById('crackTime');
  const score = document.getElementById('scoreValue');
  const entr  = document.getElementById('entropyValue');
  const leak  = document.getElementById('leakResult');
  const sugg  = document.getElementById('suggestionsList');

  if (fill)  { fill.style.width = '0%'; fill.className = 'strength-fill'; }
  if (label) label.textContent = 'في انتظار كلمة المرور...';
  if (crack) crack.textContent = '---';
  if (score) score.textContent = '---';
  if (entr)  entr.textContent  = '---';
  if (leak)  leak.textContent  = '';
  if (sugg)  sugg.innerHTML    = '<p class="placeholder-text">ابدأ بكتابة كلمة المرور لتظهر التوصيات...</p>';
}
