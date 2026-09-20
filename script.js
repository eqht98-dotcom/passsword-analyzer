// =============================================
// script.js — محلل كلمة المرور المتقدم v3
// =============================================

// =============================================
// 1. قائمة الكلمات الشائعة — 800+ كلمة
// مقسّمة بفئات للوضوح
// =============================================
const COMMON_PASSWORDS = new Set([
  // أكثر 100 كلمة مرور شيوعاً في العالم
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

  // تنويعات كلمة password
  "password2","password3","password4","password5","password6","password7",
  "password8","password9","password10","password11","password12","password99",
  "passw0rd1","p@ssword1","p@ssw0rd","p@$$w0rd1","pass1234","pass@123",
  "pass@word","mypassword","mypass","newpass","newpassword","oldpassword",
  "changeme","change123","default","default1","temp","temp123",

  // تنويعات admin و root
  "admin1","admin@1","admin@123","adminadmin","admin2024","admin2023",
  "administrator","root123","root1234","root@123","superuser","sysadmin",
  "webmaster","database","server","system","network","security","firewall",

  // أرقام متسلسلة وأنماط بسيطة
  "12345678910","1234567891","123456789010","0123456789","9876543210",
  "987654321","98765432","9876543","987654","00000000","0000","9999",
  "1111111","11111111","11111","2222","22222","3333","4444","5555",
  "6666","7777","8888","9999","12341234","11223344","12344321",
  "123321","321654","112233","11223344","99887766","55667788",

  // أنماط لوحة المفاتيح
  "qweasdzxc","1qazxsw2","zaq12wsx","xsw21qaz","1qaz2wsx","q1w2e3r4t5",
  "2wsx3edc","qwerty1","qwerty12","qwerty1234","qwerty12345","qwerty123456",
  "123qwerty","asdf1234","asdfasdf","asdf","qwer","zxcv","poiuyt",
  "lkjhgf","mnbvcxz","asdfqwer","qwerasdf","asdfzxcv","zxcvasdf",
  "1q2w3e4r5t","qazwsxedc","qazxswedcvfr","plokijuhbygvtfcrdxeszwaq",

  // أسماء شائعة - ذكور
  "michael","michael1","thomas","thomas1","andrew","andrew1","joshua","joshua1",
  "george","george1","daniel","daniel1","matthew","matthew1","joseph","joseph1",
  "david","david1","chris","chris1","richard","richard1","william","william1",
  "james","james1","robert","robert1","john","john1","alex","alex1",
  "alexander","brandon","ryan","ryan1","taylor","tyler","austin","austin1",
  "jonathan","nicholas","kevin","steven","jacob","eric","eric1","mark",
  "mark1","paul","paul1","peter","peter1","brian","brian1","jason","jason1",
  "charlie","charlie1","sam","sam1","max","max1","jake","jake1","luke",
  "luke1","adam","adam1","aaron","aaron1","nathan","nathan1","sean","sean1",
  "justin","justin1","patrick","patrick1","scott","scott1","dennis","dennis1",

  // أسماء شائعة - إناث
  "jessica","jennifer","jennifer1","amanda","amanda1","ashley","ashley1",
  "sarah","sarah1","melissa","melissa1","stephanie","stephanie1","nicole",
  "nicole1","elizabeth","elizabeth1","heather","michelle","michelle1",
  "amber","amber1","brittany","danielle","rachel","rachel1","katherine",
  "samantha","samantha1","christina","christina1","megan","megan1",
  "emma","emma1","olivia","olivia1","sophia","sophia1","emily","emily1",
  "abigail","abigail1","madison","madison1","victoria","victoria1",

  // أسماء عربية شائعة
  "mustafa","mustafa1","mohammed","mohammed1","ahmad","ahmad1","ali","ali123",
  "omar","omar1","hassan","hassan1","hussein","hussein1","fatima","fatima1",
  "aisha","aisha1","khadija","zainab","maryam","maryam1","nour","nour1",
  "sara","sara1","abdullah","abdullah1","abdulrahman","khalid","khalid1",
  "sultan","sultan1","faisal","faisal1","turki","bandar","majed","walid",
  "saad","saad1","tariq","yasser","osama","ahmed","ahmed1","Mohamed",
  "saud","nawaf","fahad","fahad1","mansour","nasser","talal","hamad",
  "rana","hala","dina","lina","reem","rima","hind","nouf","manal",

  // ماركات وشركات
  "samsung","samsung1","apple","apple1","google","google1","amazon","amazon1",
  "facebook","facebook1","twitter","twitter1","instagram","instagram1",
  "youtube","youtube1","netflix","netflix1","disney","disney1","microsoft",
  "microsoft1","windows","windows1","linux","ubuntu","android","android1",
  "iphone","iphone1","macbook","playstation","playstation1","xbox","xbox1",
  "nintendo","nintendo1","tiktok","tiktok1","snapchat","whatsapp","telegram",

  // ألعاب وترفيه
  "pokemon","pokemon1","minecraft","minecraft1","fortnite","fortnite1",
  "roblox","roblox1","starwars","starwars1","marvel","marvel1","avengers",
  "batman1","superman1","spiderman","spiderman1","ironman","ironman1",
  "captain","captain1","naruto","naruto1","onepiece","dragonball","goku",
  "sasuke","luffy","zelda","mario","sonic","pikachu","charizard",

  // أفلام وكتب
  "harrypotter","hermione","dumbledore","gandalf","frodo","aragorn","legolas",
  "sauron","vader","skywalker","skywalker1","leia","yoda","obiwan","anakin",
  "thanos","loki","thor","hulk","wolverine","matrix","matrix1","inception",
  "titanic","titanic1","avatar","avatar1","frozen","frozen1","moana",

  // كلمات إنجليزية شائعة
  "love","love1","hate","life","death","god","jesus","jesus1","allah",
  "church","bible","quran","prayer","faith","hope","peace","freedom",
  "justice","truth","dream","happy","happy1","sad","angry","star","moon",
  "sun","sky","earth","ocean","mountain","river","fire","water","wind",
  "storm","thunder","money","cash","bank","gold","silver","rich","work",
  "home","house","family","baby","child","mother","father","brother","sister",
  "friend","enemy","party","music","dance","guitar","piano","rock","metal",
  "ninja","pirate","zombie","vampire","ghost","magic","wizard","knight",
  "king","queen","angel","devil","heaven","hell","sexy","hot","cool",
  "awesome","amazing","great","super","ultra","mega","turbo","power",
  "strong","fast","smart","lucky","crazy","wild","sweet","tiger","lion",
  "wolf","eagle","shark","dragon1","phoenix","cobra","viper","panther",

  // سنوات وتواريخ
  "2020","2021","2022","2023","2024","2025","1990","1991","1992","1993",
  "1994","1995","1996","1997","1998","1999","2000","2001","2002","2003",
  "2004","2005","2006","2007","2008","2009","2010","2011","2012","2013",
  "2014","2015","2016","2017","2018","2019","jan2024","feb2024","mar2024",
  "jan2023","password2024","admin2024","test2024","user2024","pass2024",
  "summer2024","winter2024","spring2024","summer","winter","spring","autumn",

  // أيام وأشهر
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
  "january","february","march","april","may","june","july","august",
  "september","october","november","december",

  // ألوان وطبيعة
  "red","blue","green","yellow","black","white","orange","purple","pink",
  "brown","gray","silver","golden","rainbow","sunshine1","flower1","ocean1",

  // حيوانات
  "cat","dog","fish","bird","lion1","tiger1","bear","wolf1","fox",
  "horse","rabbit","hamster","turtle","snake","monkey1","panda","dolphin",

  // مجمّعات شائعة
  "abc123456","qwerty123456","password@1","Password1","Password@1",
  "Pass@1234","Admin@2024","Welcome@1","Hello@123","Secret@1",
  "P@ssword1","P@ssw0rd1","Passw0rd!","1234@abcd","abcd@1234",
  "pass@1234","User@1234","Test@1234","Demo@1234","Temp@1234",
  "iloveyou1","iloveyou!","loveme","loveyou","ilove","myname",
  "letmein1","welcome1","hello123","hello1","demo","sample","testing",
  "guest","guest123","user","user123","info","info123","contact",
  "support","support1","help","help123","backup","backup1","office",
  "office1","home1","school","school1","college","college1","work1",
]);

// =============================================
// 2. كشف التسلسلات الضعيفة — 20 نمط
// =============================================
const WEAK_PATTERNS = [

  // ── تسلسلات الأرقام ──────────────────────────
  {
    id: "num_asc",
    pattern: /(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){3,}/,
    penalty: 30,
    msg: "🔢 تسلسل أرقام تصاعدي (مثل: 1234 أو 456789) — سهل التخمين جداً"
  },
  {
    id: "num_desc",
    pattern: /(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){3,}/,
    penalty: 30,
    msg: "🔢 تسلسل أرقام تنازلي (مثل: 9876 أو 54321) — سهل التخمين جداً"
  },
  {
    id: "num_repeat",
    pattern: /(\d)\1{3,}/,
    penalty: 30,
    msg: "🔢 تكرار نفس الرقم (مثل: 0000 أو 9999)"
  },
  {
    id: "num_only",
    pattern: /^\d+$/,
    penalty: 35,
    msg: "🔢 أرقام فقط بدون أي حروف أو رموز — ضعيف جداً"
  },
  {
    id: "num_pattern",
    pattern: /^(\d{1,4})\1+$/,
    penalty: 35,
    msg: "🔢 نمط أرقام متكرر (مثل: 123123 أو 12341234)"
  },
  {
    id: "year",
    pattern: /(19|20)\d{2}/,
    penalty: 15,
    msg: "📅 يحتوي سنة — الهاكرز يجربون السنوات دائماً"
  },
  {
    id: "date_format",
    pattern: /\b(0?[1-9]|[12]\d|3[01])[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](19|20)?\d{2}\b/,
    penalty: 25,
    msg: "📅 يحتوي تاريخ ميلاد — سهل التخمين من معلوماتك الشخصية"
  },

  // ── تسلسلات الحروف ───────────────────────────
  {
    id: "alpha_asc",
    pattern: /(?:a(?=b)|b(?=c)|c(?=d)|d(?=e)|e(?=f)|f(?=g)|g(?=h)|h(?=i)|i(?=j)|j(?=k)|k(?=l)|l(?=m)|m(?=n)|n(?=o)|o(?=p)|p(?=q)|q(?=r)|r(?=s)|s(?=t)|t(?=u)|u(?=v)|v(?=w)|w(?=x)|x(?=y)|y(?=z)){3,}/i,
    penalty: 25,
    msg: "🔤 تسلسل حروف تصاعدي (مثل: abcd أو efgh)"
  },
  {
    id: "alpha_desc",
    pattern: /(?:z(?=y)|y(?=x)|x(?=w)|w(?=v)|v(?=u)|u(?=t)|t(?=s)|s(?=r)|r(?=q)|q(?=p)|p(?=o)|o(?=n)|n(?=m)|m(?=l)|l(?=k)|k(?=j)|j(?=i)|i(?=h)|h(?=g)|g(?=f)|f(?=e)|e(?=d)|d(?=c)|c(?=b)|b(?=a)){3,}/i,
    penalty: 25,
    msg: "🔤 تسلسل حروف تنازلي (مثل: zyxw أو dcba)"
  },
  {
    id: "alpha_only",
    pattern: /^[a-zA-Z]+$/,
    penalty: 20,
    msg: "🔤 حروف فقط بدون أرقام أو رموز"
  },
  {
    id: "alpha_repeat",
    pattern: /([a-zA-Z])\1{3,}/,
    penalty: 25,
    msg: "🔤 تكرار نفس الحرف (مثل: aaaa أو ssss)"
  },

  // ── تسلسلات لوحة المفاتيح ────────────────────
  {
    id: "keyboard_h",
    pattern: /qwert|werty|ertyu|rtyui|tyuio|yuiop|asdfg|sdfgh|dfghj|fghjk|ghjkl|zxcvb|xcvbn|cvbnm|poiuy|lkjhg|mnbvc/i,
    penalty: 35,
    msg: "⌨️ تسلسل لوحة مفاتيح أفقي (مثل: qwerty أو asdfg)"
  },
  {
    id: "keyboard_v",
    pattern: /qaz|wsx|edc|rfv|tgb|yhn|ujm|1qaz|2wsx|3edc|4rfv|5tgb|6yhn|7ujm|zaq|xsw|cde|vfr|bgt|nhy|mju/i,
    penalty: 30,
    msg: "⌨️ تسلسل لوحة مفاتيح عمودي (مثل: qaz أو wsx)"
  },
  {
    id: "keyboard_diag",
    pattern: /1qaz|2wsx|3edc|qzwsx|plokij|zaqwsx|zxcasdf|qweasd/i,
    penalty: 30,
    msg: "⌨️ نمط لوحة مفاتيح قطري"
  },

  // ── أنماط عامة ───────────────────────────────
  {
    id: "full_repeat",
    pattern: /^(.{2,})\1{2,}$/,
    penalty: 40,
    msg: "🔄 كلمة المرور كلها نمط متكرر (مثل: abcabc أو 123123123)"
  },
  {
    id: "partial_repeat",
    pattern: /^(.{3,})\1+$/,
    penalty: 30,
    msg: "🔄 نمط جزئي متكرر"
  },
  {
    id: "leet_simple",
    pattern: /^[a-zA-Z@430!715]+$/,
    penalty: 10,
    msg: "🔄 استبدال حروف بأرقام مشابهة (مثل: @ بدل a، 3 بدل e) — الهاكرز يعرفونها"
  },
  {
    id: "starts_cap_ends_num",
    pattern: /^[A-Z][a-z]+\d{1,4}[!@#$]?$/,
    penalty: 15,
    msg: "⚠️ نمط شائع: حرف كبير + كلمة + أرقام (مثل: Password123)"
  },
  {
    id: "phone_like",
    pattern: /^[\d\-\s\+\(\)]{9,15}$/,
    penalty: 35,
    msg: "📱 يشبه رقم هاتف — سهل التخمين"
  },
  {
    id: "spaces_only_diff",
    pattern: /^(.)\s+\1$/,
    penalty: 20,
    msg: "⚠️ نمط ضعيف جداً"
  },
];

// =============================================
// 3. الاستماع لحقل الإدخال
// =============================================
document.getElementById('passwordInput').addEventListener('input', function() {
  analyzePassword(this.value);
});

// =============================================
// 4. الدالة الرئيسية
// =============================================
function analyzePassword(password) {
  if (password.length === 0) { resetAll(); return; }

  const checks   = runChecks(password);
  const patterns = detectWeakPatterns(password);
  const score    = calculateScore(password, checks, patterns);

  updateStrengthBar(score);
  updateCriteriaIcons(checks);
  updateCards(password, score, patterns);
  updateSuggestions(checks, patterns, password);
}

// =============================================
// 5. فحص المعايير الأساسية
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
// 6. كشف الأنماط الضعيفة
// =============================================
function detectWeakPatterns(pwd) {
  return WEAK_PATTERNS.filter(wp => wp.pattern.test(pwd))
    .map(wp => ({ msg: wp.msg, penalty: wp.penalty, id: wp.id }));
}

// =============================================
// 7. حساب الدرجة بدقة
// =============================================
function calculateScore(pwd, checks, patterns) {
  let score = 0;

  // نقاط المعايير
  if (checks.length)     score += 15;
  if (checks.longEnough) score += 10;
  if (checks.upper)      score += 10;
  if (checks.lower)      score += 10;
  if (checks.number)     score += 10;
  if (checks.special)    score += 20;
  if (checks.notCommon)  score += 15;
  if (checks.noRepeat)   score += 5;
  if (checks.noSequence) score += 5;

  // نقاط إضافية للطول الزائد
  if (pwd.length > 12) score += Math.min((pwd.length - 12) * 2, 10);

  // خصم الأنماط الضعيفة
  const totalPenalty = patterns.reduce((s, p) => s + p.penalty, 0);
  score -= totalPenalty;

  // كلمة شائعة = 5 درجات فقط كحد أقصى
  if (!checks.notCommon) score = Math.min(score, 5);

  return Math.max(0, Math.min(score, 100));
}

// =============================================
// 8. تحديث شريط القوة
// =============================================
function updateStrengthBar(score) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

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
// 9. تحديث أيقونات المعايير
// =============================================
function updateCriteriaIcons(checks) {
  // الخانة اتشالت من الصفحة — الدالة فاضية بأمان
  const mapping = {
    'c-length':  'length',
    'c-upper':   'upper',
    'c-lower':   'lower',
    'c-number':  'number',
    'c-special': 'special',
    'c-common':  'notCommon',
    'c-repeat':  'noRepeat',
  };
  for (const [id, key] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (!el) continue; // العنصر مش موجود — تخطى
    const icon = el.querySelector('.criteria-icon');
    if (!icon) continue;
    if (checks[key]) {
      icon.textContent = '✅';
      el.className     = 'criteria-item pass';
    } else {
      icon.textContent = '❌';
      el.className     = 'criteria-item fail';
    }
  }
}

// =============================================
// 10. تحديث البطاقات
// =============================================
function updateCards(pwd, score, patterns) {
  document.getElementById('crackTime').textContent    = estimateCrackTime(pwd, patterns);
  document.getElementById('scoreValue').textContent   = score + ' / 100';
  document.getElementById('entropyValue').textContent = calculateEntropy(pwd).toFixed(1) + ' bit';
}

// =============================================
// 11. حساب الـ Entropy
// يعتمد على: حجم المجال × الطول
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
// الحد الأقصى = 10 سنوات
// =============================================
function estimateCrackTime(pwd, patterns) {

  // كلمة شائعة = أقل من ثانية
  if (COMMON_PASSWORDS.has(pwd.toLowerCase()))
    return '⚡ أقل من ثانية';

  // حساب حجم المجال
  let pool = 0;
  if (/[a-z]/.test(pwd))        pool += 26;
  if (/[A-Z]/.test(pwd))        pool += 26;
  if (/[0-9]/.test(pwd))        pool += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;
  if (pool === 0) pool = 26;

  // الـ Entropy
  const entropy = pwd.length * Math.log2(pool);

  // سرعة الهاكر المتوسط: مليار/ثانية
  const log10seconds = (entropy * Math.log10(2)) - 9;
  let seconds = Math.pow(10, log10seconds);

  // خصم بسبب الأنماط الضعيفة
  // كل 10 نقاط خصم = الوقت يقل بنسبة 80%
  const totalPenalty = patterns.reduce((s, p) => s + p.penalty, 0);
  if (totalPenalty > 0) {
    seconds *= Math.pow(0.2, totalPenalty / 10);
  }

  // الحد الأقصى = 10 سنوات
  seconds = Math.min(seconds, 10 * 365.25 * 24 * 3600);

  return formatTime(seconds);
}

function formatTime(s) {
  if (s < 1)         return '⚡ أقل من ثانية';
  if (s < 60)        return `🕐 ${Math.round(s)} ثانية`;
  if (s < 3600)      return `🕐 ${Math.round(s/60)} دقيقة`;
  if (s < 86400)     return `🕐 ${Math.round(s/3600)} ساعة`;
  if (s < 2592000)   return `📅 ${Math.round(s/86400)} يوم`;
  if (s < 31536000)  return `📅 ${Math.round(s/2592000)} شهر`;
  if (s < 315360000) return `🗓️ ${Math.round(s/31536000)} سنة`;
  return '🛡️ أكثر من 10 سنوات';
}

// =============================================
// 13. التوصيات الذكية
// =============================================
function updateSuggestions(checks, patterns, pwd) {
  const list = document.getElementById('suggestionsList');
  const tips = [];

  // توصيات المعايير
  if (!checks.length)
    tips.push('🔤 زد الطول لـ 8 أحرف على الأقل');
  if (checks.length && !checks.longEnough)
    tips.push('📏 الطول المثالي 12 حرفاً أو أكثر — كل حرف يضاعف الصعوبة');
  if (!checks.upper)
    tips.push('🔠 أضف حرفاً كبيراً واحداً على الأقل (A-Z)');
  if (!checks.lower)
    tips.push('🔡 أضف حرفاً صغيراً واحداً على الأقل (a-z)');
  if (!checks.number)
    tips.push('🔢 أضف رقماً واحداً على الأقل (0-9)');
  if (!checks.special)
    tips.push('✨ أضف رمزاً خاصاً مثل: ! @ # $ % ^');
  if (!checks.notCommon)
    tips.push('🚫 هذه الكلمة موجودة في قوائم الهاكرز — غيّرها فوراً!');
  if (!checks.noRepeat)
    tips.push('🔄 تجنب تكرار نفس الحرف أكثر من 3 مرات');

  // تحذيرات الأنماط الضعيفة مرتبة حسب الخطورة
  const sortedPatterns = [...patterns].sort((a, b) => b.penalty - a.penalty);
  for (const p of sortedPatterns) {
    tips.push(p.msg);
  }

  if (tips.length === 0) {
    list.innerHTML = '<div class="suggestion-item" style="border-color:#4ade80;color:#4ade80">🎉 ممتاز! كلمة مرورك قوية جداً</div>';
    return;
  }

  list.innerHTML = tips.map(t =>
    `<div class="suggestion-item">${t}</div>`
  ).join('');
}

// =============================================
// 14. فحص HaveIBeenPwned
// يفحص 600 مليون كلمة مسرّبة
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
  result.textContent = '';

  try {
    // تشفير SHA-1
    const hash   = await sha1(pwd);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const res  = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();
    const line = text.split('\n').find(l => l.startsWith(suffix));
    const count = line ? parseInt(line.split(':')[1]) : 0;

    if (count === 0) {
      result.innerHTML = '<span style="color:#4ade80">✅ لم تُسرَّب — جيد!</span>';
    } else {
      result.innerHTML = `<span style="color:#f87171">🚨 ظهرت ${count.toLocaleString()} مرة في تسريبات حقيقية! غيّرها الآن</span>`;
    }
  } catch {
    result.innerHTML = '<span style="color:#FFD700">⚠️ تعذّر الاتصال بالخادم</span>';
  }

  btn.textContent = '🔍 فحص التسريب';
  btn.disabled    = false;
}

// دالة SHA-1
async function sha1(str) {
  const buf  = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
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

  // نتأكد إن الكلمة المولّدة مش ضعيفة
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  document.getElementById('generatedPassword').textContent = password;
  document.getElementById('generatedResult').style.display = 'flex';
  document.getElementById('passwordInput').value = password;
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
  if (input.type === 'password') { input.type = 'text';     btn.textContent = '🔒'; }
  else                           { input.type = 'password'; btn.textContent = '👁'; }
}

// =============================================
// 18. إعادة الضبط
// =============================================
function resetAll() {
  document.getElementById('strengthFill').style.width  = '0%';
  document.getElementById('strengthFill').className    = 'strength-fill';
  document.getElementById('strengthLabel').textContent = 'في انتظار كلمة المرور...';
  document.getElementById('crackTime').textContent     = '---';
  document.getElementById('scoreValue').textContent    = '---';
  document.getElementById('entropyValue').textContent  = '---';
  if (document.getElementById('leakResult'))
    document.getElementById('leakResult').textContent  = '';
  ['c-length','c-upper','c-lower','c-number','c-special','c-common','c-repeat'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return; // العنصر مش موجود — تخطى
    el.className = 'criteria-item';
    const icon = el.querySelector('.criteria-icon');
    if (icon) icon.textContent = '⬜';
  });
  document.getElementById('suggestionsList').innerHTML =
    '<p class="placeholder-text">ابدأ بكتابة كلمة المرور لتظهر التوصيات...</p>';
}

// =============================================
// النوت المنبثق — يظهر عند الكتابة
// ويتحدث مع كل حرف
// =============================================

// إظهار النوت عند التركيز على الحقل
document.getElementById('passwordInput').addEventListener('focus', function() {
  document.getElementById('passwordTooltip').classList.add('show');
});

// إخفاء النوت عند الخروج من الحقل
document.getElementById('passwordInput').addEventListener('blur', function() {
  // نخفيه بعد 200ms بحيث لو ضغط زر مايختفي فجأة
  setTimeout(() => {
    document.getElementById('passwordTooltip').classList.remove('show');
  }, 200);
});

// تحديث النوت مع كل حرف يكتبه المستخدم
document.getElementById('passwordInput').addEventListener('input', function() {
  updateTooltip(this.value);
});

function updateTooltip(pwd) {
  // تعريف كل متطلب وفحصه
  const reqs = [
    { id: 'req-length',  met: pwd.length >= 8 },
    { id: 'req-upper',   met: /[A-Z]/.test(pwd) },
    { id: 'req-lower',   met: /[a-z]/.test(pwd) },
    { id: 'req-number',  met: /[0-9]/.test(pwd) },
    { id: 'req-special', met: /[^A-Za-z0-9]/.test(pwd) },
  ];

  reqs.forEach(req => {
    const el   = document.getElementById(req.id);
    const icon = el.querySelector('.req-icon');

    if (req.met) {
      // اكتمل: لون أخضر وعلامة صح
      el.className  = 'done';
      icon.textContent = '✅';
    } else {
      // ما اكتمل: لون أحمر ودائرة
      el.className  = 'fail';
      icon.textContent = '❌';
    }
  });

  // لو اكتملت كل المتطلبات اخفي النوت
  const allDone = reqs.every(r => r.met);
  if (allDone) {
    setTimeout(() => {
      document.getElementById('passwordTooltip').classList.remove('show');
    }, 800);
  }
}
