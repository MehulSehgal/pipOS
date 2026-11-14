(function () {
  const dictionaries = { hi: {
    'Skip to content': 'सामग्री पर जाएँ',
    'Sections': 'अनुभाग',
    'Work': 'काम',
    'Story': 'कहानी',
    'Wall': 'दीवार',
    'Turn sound on': 'आवाज़ चालू करें',
    'Turn sound off': 'आवाज़ बंद करें',
    'Switch to night': 'रात पर जाएँ',
    'Switch to day': 'दिन पर जाएँ',
    'Sound off': 'आवाज़ बंद',
    'Sound on': 'आवाज़ चालू',
    'Day': 'दिन',
    'Night': 'रात',
    'Language': 'भाषा',
    'English': 'अंग्रेज़ी',
    'Hindi': 'हिन्दी',
    'My Toys': 'मेरे खिलौने',
    'Nightmares': 'बुरे सपने',
    'I build the dreams you fall asleep inside.': 'मैं वे सपने बनाता हूँ जिनमें आप सो जाते हैं।',
    'Junior Dream Engineer at the Midnight Nursery. Lullabies, nightlights and rooftop deliveries, all finished before sunrise.': 'मिडनाइट नर्सरी में जूनियर ड्रीम इंजीनियर। लोरियाँ, रात की रोशनियाँ और छतों तक डिलीवरी, सब सूर्योदय से पहले।',
    'Say hi to Pip': 'पिप को नमस्ते कहें',
    'See what Pip made': 'देखें पिप ने क्या बनाया',
    "Pip's eyes follow you. Flip the sun and moon switch up top and see what happens.": 'पिप की आँखें आपका पीछा करती हैं। ऊपर सूरज-चाँद का स्विच बदलकर देखें।',
    "Hi! I'm Pip.": 'नमस्ते! मैं पिप हूँ।',
    'Midnight Nursery is open all night': 'मिडनाइट नर्सरी पूरी रात खुली है',
    'Please do not feed the nightlights': 'कृपया रात की रोशनियों को खाना न खिलाएँ',
    'Quiet hours are for humming': 'शांत समय गुनगुनाने के लिए है',
    'Lost one sock? Ask the cloud desk': 'एक मोज़ा खो गया? बादल डेस्क से पूछें',
    'What Pip is': 'पिप कैसा है',
    'Personality': 'व्यक्तित्व',
    'Quirks': 'खास आदतें',
    'Voice': 'आवाज़',
    'Giggles at everything': 'हर बात पर खिलखिलाता है',
    'Hates silence': 'खामोशी पसंद नहीं',
    'Naps mid-sentence': 'वाक्य के बीच में झपकी लेता है',
    'Collects spare stars': 'बचे हुए तारे जमा करता है',
    "Things Pip made": 'पिप ने जो बनाया',
    'Four projects from the Midnight Nursery workbench. Every one of them is playable.': 'मिडनाइट नर्सरी की कार्यशाला से चार प्रोजेक्ट। हर एक खेला जा सकता है।',
    'Wind the box': 'डिब्बा घुमाएँ',
    'Endless lullaby': 'अनंत लोरी',
    'Choose a lantern': 'लालटेन चुनें',
    'Moon': 'चाँद',
    'Honey': 'शहद',
    'Rose': 'गुलाब',
    'Mint': 'पुदीना',
    'dreams found': 'सपने मिले',
    'Drop block': 'ब्लॉक गिराएँ',
    'Fly the route': 'मार्ग पर उड़ें',
    'Pip\'s story': 'पिप की कहानी',
    'Jump to a scene': 'दृश्य पर जाएँ',
    'The wish wall': 'इच्छाओं की दीवार',
    'Leave Pip a wish. Pip reads every one, usually while yawning.': 'पिप के लिए एक इच्छा लिखें। पिप हर इच्छा पढ़ता है, अक्सर जम्हाई लेते हुए।',
    'Your name (optional)': 'आपका नाम (वैकल्पिक)',
    'Your wish': 'आपकी इच्छा',
    'Pin my wish': 'मेरी इच्छा लगाएँ',
    'Wishes are saved on this device only.': 'इच्छाएँ केवल इसी डिवाइस पर सेव होती हैं।',
    'Dreams delivered tonight': 'आज रात पहुँचाए गए सपने',
    "Pip's own tally, ticking up while you read.": 'पिप की गिनती, आपके पढ़ते समय बढ़ती रहती है।',
    'Credits': 'श्रेय',
    'Plain HTML, CSS, JS': 'सादा HTML, CSS, JS',
    'Best viewed at any size': 'हर आकार पर बेहतर दृश्य',
    'Made in 48 hours': '48 घंटे में बनाया गया'
  }, pa: {
    'Skip to content': 'ਸਮੱਗਰੀ ਤੇ ਜਾਓ', 'Sections': 'ਭਾਗ', 'Work': 'ਕੰਮ', 'Story': 'ਕਹਾਣੀ', 'Wall': 'ਦੀਵਾਰ',
    'Language': 'ਭਾਸ਼ਾ', 'English': 'ਅੰਗਰੇਜ਼ੀ', 'Hindi': 'ਹਿੰਦੀ', 'Say hi to Pip': 'ਪਿਪ ਨੂੰ ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਕਹੋ',
    'I build the dreams you fall asleep inside.': 'ਮੈਂ ਉਹ ਸੁਪਨੇ ਬਣਾਉਂਦਾ ਹਾਂ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਤੁਸੀਂ ਸੌਂ ਜਾਂਦੇ ਹੋ।',
    'Junior Dream Engineer at the Midnight Nursery. Lullabies, nightlights and rooftop deliveries, all finished before sunrise.': 'ਮਿਡਨਾਈਟ ਨਰਸਰੀ ਵਿੱਚ ਜੂਨੀਅਰ ਡ੍ਰੀਮ ਇੰਜੀਨੀਅਰ। ਲੋਰੀਆਂ, ਰਾਤ ਦੀਆਂ ਰੌਸ਼ਨੀਆਂ ਅਤੇ ਛੱਤਾਂ ਤੱਕ ਡਿਲੀਵਰੀ, ਸਭ ਸੂਰਜ ਚੜ੍ਹਨ ਤੋਂ ਪਹਿਲਾਂ।',
    'See what Pip made': 'ਦੇਖੋ ਪਿਪ ਨੇ ਕੀ ਬਣਾਇਆ', 'Things Pip made': 'ਪਿਪ ਨੇ ਬਣਾਈਆਂ ਚੀਜ਼ਾਂ',
    'Choose a lantern': 'ਲਾਲਟੈਨ ਚੁਣੋ', 'Moon': 'ਚੰਦ', 'Honey': 'ਸ਼ਹਿਦ', 'Rose': 'ਗੁਲਾਬ', 'Mint': 'ਪੁਦੀਨਾ',
    'Drop block': 'ਬਲਾਕ ਸੁੱਟੋ', 'Fly the route': 'ਰਸਤੇ ਤੇ ਉੱਡੋ', "Pip's story": 'ਪਿਪ ਦੀ ਕਹਾਣੀ',
    'The wish wall': 'ਇੱਛਾਵਾਂ ਦੀ ਦੀਵਾਰ', 'Your name (optional)': 'ਤੁਹਾਡਾ ਨਾਮ (ਵਿਕਲਪਿਕ)',
    'Your wish': 'ਤੁਹਾਡੀ ਇੱਛਾ', 'Pin my wish': 'ਮੇਰੀ ਇੱਛਾ ਲਗਾਓ', 'Credits': 'ਸਿਹਰਾ',
    'Plain HTML, CSS, JS': 'ਸਾਦਾ HTML, CSS, JS'
  }, kn: {
    'Skip to content': 'ವಿಷಯಕ್ಕೆ ಹೋಗಿ', 'Sections': 'ವಿಭಾಗಗಳು', 'Work': 'ಕೆಲಸ', 'Story': 'ಕಥೆ', 'Wall': 'ಗೋಡೆ',
    'Language': 'ಭಾಷೆ', 'English': 'ಇಂಗ್ಲಿಷ್', 'Hindi': 'ಹಿಂದಿ', 'Say hi to Pip': 'ಪಿಪ್‌ಗೆ ನಮಸ್ಕಾರ ಹೇಳಿ',
    'I build the dreams you fall asleep inside.': 'ನೀವು ನಿದ್ರಿಸುವ ಕನಸುಗಳನ್ನು ನಾನು ನಿರ್ಮಿಸುತ್ತೇನೆ.',
    'Junior Dream Engineer at the Midnight Nursery. Lullabies, nightlights and rooftop deliveries, all finished before sunrise.': 'ಮಿಡ್‌ನೈಟ್ ನರ್ಸರಿಯ ಜೂನಿಯರ್ ಡ್ರೀಮ್ ಎಂಜಿನಿಯರ್. ಲಾಲಿಹಾಡುಗಳು, ರಾತ್ರಿ ದೀಪಗಳು ಮತ್ತು ಛಾವಣಿ ವಿತರಣೆಗಳು ಸೂರ್ಯೋದಯದ ಮೊದಲು ಮುಗಿಯುತ್ತವೆ.',
    'See what Pip made': 'ಪಿಪ್ ಮಾಡಿದ್ದನ್ನು ನೋಡಿ', 'Things Pip made': 'ಪಿಪ್ ಮಾಡಿದ ವಸ್ತುಗಳು',
    'Choose a lantern': 'ಲ್ಯಾಂಟರ್ನ್ ಆಯ್ಕೆಮಾಡಿ', 'Moon': 'ಚಂದ್ರ', 'Honey': 'ಜೇನು', 'Rose': 'ಗುಲಾಬಿ', 'Mint': 'ಪುದೀನಾ',
    'Drop block': 'ಬ್ಲಾಕ್ ಬಿಡಿ', 'Fly the route': 'ಮಾರ್ಗದಲ್ಲಿ ಹಾರಿ', "Pip's story": 'ಪಿಪ್‌ನ ಕಥೆ',
    'The wish wall': 'ಇಷ್ಟಗಳ ಗೋಡೆ', 'Your name (optional)': 'ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)',
    'Your wish': 'ನಿಮ್ಮ ಇಚ್ಛೆ', 'Pin my wish': 'ನನ್ನ ಇಚ್ಛೆಯನ್ನು ಅಂಟಿಸಿ', 'Credits': 'ಕೀರ್ತಿ',
    'Plain HTML, CSS, JS': 'ಸರಳ HTML, CSS, JS'
  }, mr: {
    'Skip to content': 'सामग्रीकडे जा', 'Sections': 'विभाग', 'Work': 'काम', 'Story': 'कथा', 'Wall': 'भिंत',
    'Language': 'भाषा', 'English': 'इंग्रजी', 'Hindi': 'हिंदी', 'Say hi to Pip': 'पिपला नमस्कार करा',
    'I build the dreams you fall asleep inside.': 'तुम्ही ज्या स्वप्नांत झोपी जाता ती स्वप्ने मी बनवतो.',
    'Junior Dream Engineer at the Midnight Nursery. Lullabies, nightlights and rooftop deliveries, all finished before sunrise.': 'मिडनाईट नर्सरीमधील कनिष्ठ स्वप्न अभियंता. अंगाईगीते, रात्रीचे दिवे आणि छतावरील वितरणे सूर्योदयापूर्वी पूर्ण.',
    'See what Pip made': 'पिपने काय बनवले ते पहा', 'Things Pip made': 'पिपने बनवलेल्या गोष्टी',
    'Choose a lantern': 'कंदील निवडा', 'Moon': 'चंद्र', 'Honey': 'मध', 'Rose': 'गुलाब', 'Mint': 'पुदिना',
    'Drop block': 'ब्लॉक सोडा', 'Fly the route': 'मार्गावर उडा', "Pip's story": 'पिपची कथा',
    'The wish wall': 'इच्छांची भिंत', 'Your name (optional)': 'तुमचे नाव (ऐच्छिक)',
    'Your wish': 'तुमची इच्छा', 'Pin my wish': 'माझी इच्छा लावा', 'Credits': 'श्रेय',
    'Plain HTML, CSS, JS': 'साधे HTML, CSS, JS'
  }, ta: {
    'Skip to content': 'உள்ளடக்கத்திற்குச் செல்லவும்', 'Sections': 'பிரிவுகள்', 'Work': 'வேலை', 'Story': 'கதை', 'Wall': 'சுவர்',
    'Language': 'மொழி', 'English': 'ஆங்கிலம்', 'Hindi': 'இந்தி', 'Say hi to Pip': 'பிப்பை வரவேற்கவும்',
    'I build the dreams you fall asleep inside.': 'நீங்கள் தூங்கும் கனவுகளை நான் உருவாக்குகிறேன்.',
    'Junior Dream Engineer at the Midnight Nursery. Lullabies, nightlights and rooftop deliveries, all finished before sunrise.': 'மிட்நைட் நர்சரியின் இளநிலை கனவு பொறியாளர். தாலாட்டுகள், இரவு விளக்குகள் மற்றும் கூரை விநியோகங்கள் சூரிய உதயத்திற்கு முன் முடிக்கப்படும்.',
    'See what Pip made': 'பிப் உருவாக்கியதைப் பார்க்கவும்', 'Things Pip made': 'பிப் உருவாக்கியவை',
    'Choose a lantern': 'விளக்கைத் தேர்ந்தெடுக்கவும்', 'Moon': 'நிலா', 'Honey': 'தேன்', 'Rose': 'ரோஜா', 'Mint': 'புதினா',
    'Drop block': 'தொகுதியை விடவும்', 'Fly the route': 'வழியில் பறக்கவும்', "Pip's story": 'பிப்பின் கதை',
    'The wish wall': 'விருப்பச் சுவர்', 'Your name (optional)': 'உங்கள் பெயர் (விருப்பம்)',
    'Your wish': 'உங்கள் விருப்பம்', 'Pin my wish': 'என் விருப்பத்தைப் பதிக்கவும்', 'Credits': 'நன்றிகள்',
    'Plain HTML, CSS, JS': 'எளிய HTML, CSS, JS'
  }};

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const languageNames = { en: 'English', hi: 'हिन्दी', pa: 'ਪੰਜਾਬੀ', kn: 'ಕನ್ನಡ', mr: 'मराठी', ta: 'தமிழ்' };

  function translateText(root, language) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const source = originalText.get(node);
      node.nodeValue = language === 'en' ? source : ((dictionaries[language] || {})[source] || source);
    });
  }

  function translateAttributes(root, language) {
    root.querySelectorAll('[aria-label], [placeholder], [title]').forEach((element) => {
      if (!originalAttributes.has(element)) {
        originalAttributes.set(element, {
          'aria-label': element.getAttribute('aria-label'),
          placeholder: element.getAttribute('placeholder'),
          title: element.getAttribute('title')
        });
      }
      const source = originalAttributes.get(element);
      ['aria-label', 'placeholder', 'title'].forEach((attribute) => {
        if (source[attribute]) {
          element.setAttribute(attribute, language === 'en'
            ? source[attribute]
            : ((dictionaries[language] || {})[source[attribute]] || source[attribute]));
        }
      });
    });
  }

  function applyLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
    translateText(document.body, language);
    translateAttributes(document.body, language);
    document.querySelectorAll('[data-language-label]').forEach((element) => {
      element.textContent = languageNames[language];
    });
    localStorage.setItem('pip-language', language);
  }

  function init() {
    const selector = document.createElement('button');
    selector.type = 'button';
    selector.className = 'tb-btn language-btn';
    selector.setAttribute('aria-label', 'Language');
    selector.innerHTML = '<span aria-hidden="true">अ / A</span> <span class="language-name">Language: <span data-language-label>English</span></span>';
    selector.addEventListener('click', () => {
      const languages = ['en', 'hi', 'pa', 'kn', 'mr', 'ta'];
      const current = languages.indexOf(document.documentElement.lang);
      applyLanguage(languages[(current + 1) % languages.length]);
    });
    selector.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selector.click();
      }
    });
    document.querySelector('.task-right').prepend(selector);

    const observer = new MutationObserver((records) => {
      const language = document.documentElement.lang;
      if (language === 'en') return;
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          translateText(node, language);
          translateAttributes(node, language);
        }
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const saved = localStorage.getItem('pip-language');
    applyLanguage(['en', 'hi', 'pa', 'kn', 'mr', 'ta'].includes(saved) ? saved : 'en');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
