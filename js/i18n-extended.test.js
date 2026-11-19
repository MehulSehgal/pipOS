'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');

const i18n = require('./i18n.js');

describe('Extended Multilingual Localization (es, fr, ja)', () => {
  test('SUPPORTED array includes 5 diverse languages', () => {
    assert.deepStrictEqual(i18n.SUPPORTED, ['en', 'hi', 'es', 'fr', 'ja']);
  });

  test('all supported languages maintain 100% key parity with English', () => {
    const enKeys = Object.keys(i18n.TRANSLATIONS.en).sort();
    assert.ok(enKeys.length >= 40, 'English dictionary must have complete key set');

    i18n.SUPPORTED.forEach((lang) => {
      const dict = i18n.TRANSLATIONS[lang];
      assert.ok(dict, `Dictionary for ${lang} must exist`);
      const langKeys = Object.keys(dict).sort();

      const missingKeys = enKeys.filter(k => !(k in dict));
      assert.deepStrictEqual(
        missingKeys,
        [],
        `Language "${lang}" is missing keys: ${missingKeys.join(', ')}`
      );
    });
  });

  test('story scenes are under 150 words across Spanish, French, and Japanese', () => {
    ['es', 'fr', 'ja'].forEach((lang) => {
      const dict = i18n.TRANSLATIONS[lang];
      ['story_p1', 'story_p2', 'story_p3', 'story_p4'].forEach((storyKey) => {
        const text = dict[storyKey];
        assert.ok(text && text.length > 0, `${lang}.${storyKey} must not be empty`);
        const words = text.trim().split(/\s+/).length;
        assert.ok(words < 150, `${lang}.${storyKey} has ${words} words, must be < 150 words`);
      });
    });
  });

  test('t() supports parameter replacement {count}, {name}', () => {
    i18n.apply('en');
    const custom = i18n.t('Dreams: {count}', { count: 12 });
    assert.strictEqual(custom, 'Dreams: 12');

    const multiple = i18n.t('Hello {name}, you have {count} wishes', { name: 'Pip', count: 3 });
    assert.strictEqual(multiple, 'Hello Pip, you have 3 wishes');
  });

  test('toggle() cycles sequentially through all 5 languages', () => {
    i18n.apply('en');
    assert.strictEqual(i18n.getLang(), 'en');

    i18n.toggle();
    assert.strictEqual(i18n.getLang(), 'hi');

    i18n.toggle();
    assert.strictEqual(i18n.getLang(), 'es');

    i18n.toggle();
    assert.strictEqual(i18n.getLang(), 'fr');

    i18n.toggle();
    assert.strictEqual(i18n.getLang(), 'ja');

    i18n.toggle();
    assert.strictEqual(i18n.getLang(), 'en');
  });
});
