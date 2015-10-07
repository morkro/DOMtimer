'use strict';

/**
 * @name DOMtimer
 * @description A nonfancy time provider.
 * @param {Object|String} element
 * @param {Object} config
 * @example
 * let timer = new DOMtimer('.foo-element');
 * timer.run();
 */
export default class DOMtimer {
	constructor (element, options) {
		this.intervalFn = null;
		this.timeElements = false;
		this.validTimes = ['ms','millisecond','sec','second','min','minute','h','hour'];
		this.options = {};

		this.resolveConfig(element, options);
		this.setAMPMConfig();
	}

	/**
	 * @description Sets all configuration properties.
	 * @param  {Object} config
	 */
	resolveConfig (element, config = {}) {
		this.options.elem = this.returnElement(element ? element : config.element);
		this.options.timeFormat = config.timeFormat || '24h';
		this.options.showAMPM =  config.showAMPM || false;
		this.options.showAbbreviation = config.showAbbreviation || false;
		this.options.showMilliseconds = config.showMilliseconds || false;
		this.options.updateTime = config.interval || 1000;
		this.options.wrapEach = config.wrapEach || false;
		this.options.addPrefix = this.returnClassName(config.addPrefix);
		this.options.addSuffix = this.returnClassName(config.addSuffix);
		this.options.updateEvent = config.updateEvent || false;
	}

	/**
	 * @description Checks if class name is a string and trims it.
	 * @param {string|boolean} name
	 * @return {string|boolean}
	 */
	returnClassName (name) {
		if (typeof name === 'string') {
			name = name.replace(/[^-_a-zA-Z0-9]/g, '');
		}
		else {
			name = false;
		}

		return name;
	}

	/**
	 * @description Checks parameter and returns either an HTMLElement or null.
	 * @param {String|Object} element
	 * @return {HTMLElement|null}
	 */
	returnElement (element) {
		if (typeof element === 'string') {
			return document.querySelector(element);
		}
		else if (typeof element === 'object' && element instanceof HTMLElement) {
			return element;
		}
		else {
			return null;
		}
	}

	/**
	 * @description Checks if a valid HTMLElement was passed.
	 * @return {Boolean}
	 */
	hasHTMLElement () {
		return !!this.options.elem &&
			this.options.elem instanceof HTMLElement &&
			this.options.elem.hasOwnProperty('length');
	}

	/**
	 * @description Creates a string with current time in HH:MM:SS
	 * @return {String}
	 */
	getTime () {
		const date = new Date();
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
		let milliseconds = date.getMilliseconds();
		let abbreviations = '';

		// If time format is set to 12h, use 12h-system.
		if (this.options.timeFormat === '12h') {
			if (this.options.showAMPM) {
				abbreviations = ` ${this.getAbbr(hours)}`;
			}
			hours = (hours % 12) ? hours % 12 : 12;
		}

		// Add '0' if below 10 or 100
		if (hours < 10) hours = `0${hours}`;
		if (minutes < 10) minutes = `0${minutes}`;
		if (seconds < 10) seconds = `0${seconds}`;
		if (milliseconds < 100) milliseconds = `0${milliseconds}`;

		return { hours, minutes, seconds, milliseconds, abbreviations };
	}

	/**
	 * @description Validates number and returns either AM or PM.
	 * @param {Number|String} time
	 * @return {String}
	 */
	getAbbr (time) {
		if (typeof time !== 'number') {
			time = parseFloat(time);
		}

		return (time >= 12) ? 'PM' : 'AM';
	}

	/**
	 * @description Sets all configuration values.
	 * @param {Object} config
	 */
	config (options) {
		this.resolveConfig(options)
		this.setAMPMConfig();
	}

	/**
	 * @description Transition function as long as both options are available.
	 *              Should be removed once 'showAbbreviation' is removed.
	 */
	setAMPMConfig () {
		if (this.options.showAbbreviation) {
			this.options.showAMPM = this.options.showAbbreviation;
		}
	}

	/**
	 * @description Creates custom event and dispatches it.
	 * @param {String} eventName
	 * @param {Object} data
	 */
	dispatchCustomEvent (eventName, data) {
		const event = new CustomEvent(eventName, { detail: data ? data : {}, cancelable: true });
		this.elem.dispatchEvent(event);
	}

	/**
	 * @description Inserts the current time in the HTML element.
	 */
	appendTimeString () {
		let time = this.getTime();
		let content = `${time.hours}:${time.minutes}:${time.seconds}${time.abbreviations}`;

		if (this.options.showMilliseconds) {
			content = `${time.hours}:${time.minutes}:${time.seconds}.${time.milliseconds}${time.abbreviations}`;
		}

		this.options.elem.textContent = content;
	}

	/**
	 * @description Creates all <span> elements and appends them to DOM.
	 * @param  {Object} time
	 */
	appendTimeElements (time = this.getTime()) {
		let hours = this.createTimeElement(time.hours, 'hours');
		let minutes = this.createTimeElement(time.minutes, 'minutes');
		let seconds = this.createTimeElement(time.seconds, 'seconds');
		let milliseconds = this.createTimeElement(time.milliseconds, 'milliseconds');
		let ampm = this.createTimeElement(time.abbreviations, 'ampm');

		this.options.elem.appendChild(hours);
		this.options.elem.appendChild(this.createTimeElement(':'));
		this.options.elem.appendChild(minutes);
		this.options.elem.appendChild(this.createTimeElement(':'));
		this.options.elem.appendChild(seconds);

		if (this.options.showMilliseconds) {
			this.options.elem.appendChild(this.createTimeElement('.'));
			this.options.elem.appendChild(milliseconds);
		}

		if (this.options.showAMPM) {
			this.options.elem.appendChild(ampm);
		}

		this.timeElements = { hours, minutes, seconds, milliseconds, ampm };
	}

	/**
	 * @description Creates <span> elements, adds either prefix/suffix or both if configured.
	 */
	updateTimeElements (time = this.getTime()) {
		this.timeElements.hours.textContent = time.hours;
		this.timeElements.minutes.textContent = time.minutes;
		this.timeElements.seconds.textContent = time.seconds;

		if (this.options.showMilliseconds) {
			this.timeElements.milliseconds.textContent = time.milliseconds;
		}

		if (this.options.showAMPM) {
			this.timeElements.ampm.textContent = time.abbreviations;
		}
	}

	/**
	 * @description Creates a <span> element and returns it.
	 * @param  {string} content
	 * @return {HTMLElement}
	 */
	createTimeElement (content, className) {
		let span = document.createElement('span');

		if (className && (this.options.addPrefix || this.options.addSuffix)) {
			if (this.options.addPrefix) {
				className = `${this.options.addPrefix}${className}`;
			}
			if (this.options.addSuffix) {
				className = `${className}${this.options.addSuffix}`;
			}

			span.classList.add(className);
		}

		span.textContent = content;
		return span;
	}

	/**
	 * @description Checks if passed argument is a valid option and returns the interval time.
	 * @param {String} interval
	 * @return {Number}
	 */
	returnIntervalTime (interval) {
		let newInterval = this.options.updateTime;

		if (this.validTimes.includes(interval)) {
			if (interval.match(/^(ms|millisecond)$/)) {
				newInterval = newInterval / 100;
			}
			else if (interval.match(/^(sec|second)$/)) {
				newInterval = newInterval;
			}
			else if (interval.match(/^(min|minute)$/)) {
				newInterval = newInterval * 60;
			}
			else if (interval.match(/^(h|hour)$/)) {
				newInterval = newInterval * 60 * 60;
			}
		}
		else {
			throw new Error(`Unknown parameter! Use "ms", "sec", "min" or "h".`);
		}

		return newInterval;
	}

	/**
	 * @description Removes all childNodes of 'this.elem'.
	 */
	clearElementContent () {
		while (this.options.elem.lastChild) {
			this.options.elem.removeChild(this.options.elem.lastChild);
		}
	}

	/**
	 * @description Sets the element in which the time should be displayed.
	 * @param {String|Number} interval
	 */
	run (interval = this.options.updateTime) {
		if (typeof interval === 'string') {
			interval = this.returnIntervalTime(interval);
		}

		if (this.hasHTMLElement()) {
			this.clearElementContent();

			if (this.options.wrapEach) {
				this.appendTimeElements();
				this.intervalFn = setInterval(this.updateTimeElements.bind(this), interval);
			}
			else {
				this.appendTimeString();
				this.intervalFn = setInterval(this.appendTimeString.bind(this), interval);
			}
		}
		else {
			throw new Error(`Invalid target! Use a valid HTMLElement.`);
		}
	}

	/**
	 * @description Stops the running interval.
	 */
	stop () {
		clearInterval(this.intervalFn);
	}
}