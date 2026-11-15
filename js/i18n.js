/* i18n.js: zero-dependency localization engine for pipOS.
   Supports English ('en') and Hindi ('hi').
   Hangs off window.PIP.i18n. */
(function () {
  'use strict';
  var hasWindow = typeof window !== 'undefined';
  var PIP = hasWindow ? (window.PIP = window.PIP || {}) : {};
  var store = PIP.store || { get: function (k, f) { return f; }, set: function () {} };

  var TRANSLATIONS = {
    en: {
      nav_pip: 'Pip',
      nav_work: 'Work',
      nav_story: 'Story',
      nav_wall: 'Wall',
      hero_title: 'I build the dreams you fall asleep inside.',
      hero_lede: 'Junior Dream Engineer at the Midnight Nursery. Lullabies, nightlights and rooftop deliveries, all finished before sunrise.',
      hero_say_hi: 'Say hi to Pip',
      hero_see_work: 'See what Pip made',
      hero_fine: "Pip's eyes follow you. Flip the sun and moon switch up top and see what happens.",
      hero_greeting: "Hi! I'm Pip.",
      work_title: 'Things Pip made',
      work_desc: 'Five projects from the Midnight Nursery workbench. Every one of them is playable.',
      lab_desc: 'A music box Pip wound the wrong way. Press a key, or use 1 to 8 on your keyboard.',
      lab_wind: 'Wind the box',
      lab_endless: 'Endless lullaby',
      lights_desc: 'Pick a lantern, then sweep it across the dark nursery. Five small dreams are hiding in there.',
      blocks_desc: "Stack the blocks as high as Pip's bedtime. Tap, click or press Space to drop.",
      blocks_btn: 'Drop block',
      route_desc: 'Scroll to fly Pip across the rooftops, or press the button and watch.',
      route_btn: 'Fly the route',
      story_h1: 'The hiccup',
      story_p1: 'Nobody knows exactly where Pip came from. The night nurse found a laundry basket on the nursery step, a nightcap two sizes too big, and one very loud hiccup. Inside the basket: Pip, giggling at the moon.',
      story_h2: 'No silence allowed',
      story_p2: 'The Midnight Nursery had one rule: every little ghost falls asleep to something. Humming, rain, a rusty fan. Pip took one look at all that waiting quiet and decided silence was a problem to be engineered.',
      story_h3: 'The first lullaby',
      story_p3: "Pip wound a dusty music box and turned the key the wrong way. Out came five notes, slightly crooked, just like Pip's smile. Eleven ghosts yawned at once. Nobody has stayed up past midnight since.",
      story_h4: 'The night shift',
      story_p4: "Now Pip is a Junior Dream Engineer: lullabies in the lab, nightlights on the shelf, dreams delivered by cloud before sunrise. Tonight's route has seven stops. Leave your window open a crack.",
      wall_title: 'The wish wall',
      wall_desc: 'Leave Pip a wish. Pip reads every one, usually while yawning.',
      wall_name_label: 'Your name',
      wall_wish_label: 'Your wish',
      wall_submit: 'Pin my wish',
      wall_fine: 'Wishes are saved on this device only.',
      odo_title: 'Dreams delivered tonight',
      odo_fine: "Pip's own tally, ticking up while you read."
    },
    hi: {
      nav_pip: 'पिप',
      nav_work: 'रचनाएं',
      nav_story: 'कहानी',
      nav_wall: 'विश वॉल',
      hero_title: 'मैं वो सपने बनाता हूँ जिनके अंदर आप सोते हैं।',
      hero_lede: 'मिडनाइट नर्सरी में जूनियर ड्रीम इंजीनियर। लोरियाँ, नाइटलाइट्स और छतों पर सपनों की डिलीवरी, सब सूर्योदय से पहले तैयार।',
      hero_say_hi: 'पिप को नमस्ते कहें',
      hero_see_work: 'पिप की रचनाएं देखें',
      hero_fine: 'पिप की आँखें आपके साथ घूमती हैं। ऊपर सूरज और चाँद का बटन दबाकर देखें।',
      hero_greeting: 'नमस्ते! मैं पिप हूँ।',
      work_title: 'पिप की बनाई चीजें',
      work_desc: 'मिडनाइट नर्सरी वर्कबेंच से पाँच खिलौने। हर एक के साथ आप खेल सकते हैं।',
      lab_desc: 'एक म्यूज़िक बॉक्स जिसे पिप ने उलटा घुमाया। कोई की दबाएं या कीबोर्ड पर 1 से 8 दबाएं।',
      lab_wind: 'बॉक्स घुमाएं',
      lab_endless: 'अनंत लोरी',
      lights_desc: 'एक लालटेन चुनें, फिर अँधेरी नर्सरी में घुमाएं। पाँच छोटे सपने वहाँ छिपे हैं।',
      blocks_desc: 'पिप के सोने के समय जितनी ऊँची मीनार बनाएं। गिराने के लिए टैप करें या स्पेस दबाएं।',
      blocks_btn: 'ब्लॉक गिराएं',
      route_desc: 'पिप को छतों पर उड़ाने के लिए स्क्रॉल करें, या बटन दबाकर देखें।',
      route_btn: 'सफर शुरू करें',
      story_h1: 'हिचकी',
      story_p1: 'किसी को नहीं पता कि पिप कहाँ से आया। नर्स को नर्सरी की सीढ़ी पर कपड़ों की टोकरी, बहुत बड़ी नाइट-कैप, और एक तेज़ हिचकी मिली। टोकरी के अंदर: पिप, चाँद को देखकर मुस्कुराता हुआ।',
      story_h2: 'सन्नाटा मना है',
      story_p2: 'मिडनाइट नर्सरी का एक ही नियम था: हर छोटे भूत को किसी आवाज़ के साथ सोना है। गुनगुनाहट, बारिश, या पंखा। पिप ने सन्नाटा देखा और तय किया कि इसे ठीक करना है।',
      story_h3: 'पहली लोरी',
      story_p3: 'पिप ने एक पुराना म्यूज़िक बॉक्स उठाया और चाबी उलटी घुमाई। निकले पाँच सुर, थोड़े टेढ़े, बिल्कुल पिप की मुस्कान जैसे। ग्यारह भूतों ने एक साथ उबासी ली। उसके बाद कोई नहीं जागा।',
      story_h4: 'नाइट शिफ्ट',
      story_p4: 'अब पिप एक जूनियर ड्रीम इंजीनियर है: लैब में लोरियाँ, शेल्फ पर लालटेन, बादलों से सपनों की डिलीवरी। आज सात घर जाना है। अपनी खिड़की थोड़ी खुली रखना।',
      wall_title: 'सपनों की दीवार',
      wall_desc: 'पिप के लिए एक ख्वाहिश छोड़ें। पिप हर ख्वाहिश पढ़ता है, उबासी लेते हुए।',
      wall_name_label: 'आपका नाम',
      wall_wish_label: 'आपकी ख्वाहिश',
      wall_submit: 'ख्वाहिश जोड़ें',
      wall_fine: 'ख्वाहिशें केवल इसी डिवाइस पर सुरक्षित हैं।',
      odo_title: 'आज रात पहुँचाए गए सपने',
      odo_fine: 'पिप की अपनी गिनती, जो पढ़ते-पढ़ते बढ़ती जाती है।'
    }
  };

  var curLang = store.get('lang', 'en');
  if (curLang !== 'en' && curLang !== 'hi') curLang = 'en';

  function apply(lang) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    curLang = lang;
    store.set('lang', lang);

    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('lang', lang);

    var dict = TRANSLATIONS[lang];
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    }

    var btn = document.getElementById('langBtn');
    var label = document.getElementById('langLabel');
    if (btn) {
      btn.setAttribute('aria-label', lang === 'hi' ? 'भाषा: हिन्दी, Switch to English' : 'Language: English, हिन्दी में बदलें');
    }
    if (label) {
      label.textContent = lang === 'hi' ? 'हिन्दी' : 'EN';
    }
  }

  function toggle() {
    apply(curLang === 'hi' ? 'en' : 'hi');
  }

  function init() {
    if (typeof document === 'undefined') return;
    var btn = document.getElementById('langBtn');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
    apply(curLang);
  }

  var i18nModule = {
    init: init,
    apply: apply,
    toggle: toggle,
    getLang: function () { return curLang; },
    TRANSLATIONS: TRANSLATIONS
  };

  if (hasWindow) {
    window.PIP = window.PIP || {};
    window.PIP.i18n = i18nModule;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18nModule;
  }
})();
