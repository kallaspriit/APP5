define(
['Bindable', 'Util', 'underscore'],
function(Bindable, util, _) {
	'use strict';

	/**
	 * Provides i18n functionality.
	 *
	 * Can fire the following events:
	 *
	 *	> LANGUAGE_CHANGED - fired when language is changed
	 *		newLanguage - new language name
	 *		previousLanguage - last language name
	 *
	 * @class Translator
	 * @extends Bindable
	 * @constructor
	 * @module Core
	 */
	var Translator = function() {
		this._language = null;
		this._translations = {};
	};

	Translator.prototype = new Bindable();

	/**
	 * Event types.
	 *
	 * @event
	 * @param {Object} Event
	 * @param {String} Event.LANGUAGE_CHANGED Triggered when language changes
	 */
	Translator.prototype.Event = {
		LANGUAGE_CHANGED: 'language-changed'
	};

	/**
	 * Initiates the component.
	 *
	 * @method init
	 * @param {Object} [translations] Translations to use
	 * @param {String} [language] Active language
	 * @return {Translator} Self
	 */
	Translator.prototype.init = function(translations, language) {
		if (util.isObject(translations)) {
			this.setTranslations(translations);
		}

		if (util.isString(language)) {
			this.setLanguage(language);
		}

		return this;
	};

	/**
	 * Sets translations to use.
	 *
	 * @method setTranslations
	 * @param {Object} translations Translations to use
	 * @return {Translator} Self
	 */
	Translator.prototype.setTranslations = function(translations) {
		this._translations = translations;

		return this;
	};

	/**
	 * Appends given translations to current.
	 *
	 * @method appendTranslations
	 * @param {Object} translations Translations to append
	 * @return {Translator} Self
	 */
	Translator.prototype.appendTranslations = function(translations) {
		util.extend(this._translations, translations);

		return this;
	};

	/**
	 * Adds a single translation.
	 *
	 * @method addTranslation
	 * @param {String} key Translation key to add
	 * @param {String} language Translation language code
	 * @param {String} translation The actual translation in given language
	 * @return {Translator} Self
	 */
	Translator.prototype.addTranslation = function(key, language, translation) {
		if (!util.isObject(this._translations[key])) {
			this._translations[key] = {};
		}

		this._translations[key][language] = translation;

		return this;
	};

	/**
	 * Sets active language.
	 *
	 * @method setLanguage
	 * @param {String} language Language to use
	 * @return {Translator} Self
	 */
	Translator.prototype.setLanguage = function(language) {
		var previousLanguage = this._language;

		this._language = language;

		this.fire({
			type: this.Event.LANGUAGE_CHANGED,
			newLanguage: language,
			previousLanguage: previousLanguage
		});

		return this;
	};

	/**
	 * Returns active language.
	 *
	 * @method getLanguage
	 * @return {String}
	 */
	Translator.prototype.getLanguage = function() {
		return this._language;
	};

	/**
	 * Returns available languages.
	 *
	 * If translated is set to true, creates an object and attempts to translate using language.KEY and resulting keys
	 * id, name.
	 *
	 * @method getLanguages
	 * @param {Boolean} [translated=false] Should the keys be translated
	 * @return {Array}
	 */
	Translator.prototype.getLanguages = function(translated) {
		translated = util.isBoolean(translated) ? translated : false;

		var languages = [],
			key,
			language;

		for (key in this._translations) {
			for (language in this._translations[key]) {
				if (translated) {
					languages.push({
						id: language,
						name: this.has('lang.' + language) ? this.translate('lang.' + language) : language
					});
				} else {
					languages.push(language);
				}
			}

			break;
		}

		return languages;
	};

	/**
	 * Returns whether the translator has given translation.
	 *
	 * @method has
	 * @param {String} key Translation key to check
	 * @return {Boolean}
	 */
	Translator.prototype.has = function(key) {
		if (
			!util.isString(key)
			|| !util.isObject(this._translations[key])
			|| !util.isString(this._translations[key][this._language])
		) {
			return false;
		}

		return true;
	};

	/**
	 * Translates given key.
	 *
	 * This method accepts any number of arguments that are replaced into the translation string using printf format.
	 *
	 * @method translate
	 * @param {String} key Key to translate
	 * @return {String}
	 */
	Translator.prototype.translate = function(key) {
		if (
			!util.isString(key)
			|| !util.isObject(this._translations[key])
			|| !util.isString(this._translations[key][this._language])
		) {
			return key;
		}

		var parameters = _.toArray(arguments);

		parameters[0] = this._translations[key][this._language];

		return util.sprintf.apply(util, parameters);
	};

	return new Translator();
});
