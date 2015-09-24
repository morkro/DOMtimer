'use strict';

/**
 * @name DOMtimer
 * @description A nonfancy time provider.
 * @param {Object|String} element
 * @param {Object} config
 */
export default class DOMtimer {
	constructor (element, {
		interval = 1000,
		timeFormat = '24h',
		showAbbreviation = false,
		showMilliseconds = false,
		wrapEach = false,
		addPrefix = false,
		addSuffix = false
    } = {}) {
		this.elem = this.returnElement(element);
		this.format = timeFormat;
		this.showAbbreviation = showAbbreviation;
		this.showMilliseconds = showMilliseconds;
		this.intervalFn = null;
		this.updateTime = interval;
		this.wrapEach = wrapEach;
		this.addPrefix = this.returnClassName(addPrefix);
		this.addSuffix = this.returnClassName(addSuffix);
		this.timeElements = false;
		this.validTimes = [
			'ms', 'millisecond',
			'sec', 'second',
			'min', 'minute',
			'h', 'hour'
		];
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

		return name;
	}

	/**
	 * @description Checks parameter and returns either an HTMLElement or null.
	 * @param {String|Object} element
	 * @return {HTMLElement|null}
	 */
	returnElement (element) {
		if (typeof element === 'string' && element.match(/^\./)) {
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
		return !!this.elem && this.elem instanceof HTMLElement;
	}

	/**
	 * @description Creates a string with current time in HH:MM:SS
	 * @return {String}
	 */
	getTime () {
		let date	= new Date();
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
		let milliseconds = date.getMilliseconds();
		let abbreviations = '';

		// If time format is set to 12h, use 12h-system.
		if (this.format === '12h') {
			if (this.showAbbreviation) {
				abbreviations = ` ${this.getAbbr(hours)}`;
			}
			hours = (hours % 12) ? hours % 12 : 12;
		}

		// Add '0' if below 10
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
	config ({
		element = this.returnElement(),
		interval = this.updateTime,
		timeFormat = this.format,
		showAbbreviation = this.showAbbreviation,
		showMilliseconds = this.showMilliseconds,
		wrapEach = this.wrapEach,
		addPrefix = this.addPrefix,
		addSuffix = this.addSuffix
	} = {}) {
		this.elem = this.returnElement(element);
		this.updateTime = this.returnIntervalTime(interval);
		this.format = timeFormat;
		this.showAbbreviation = showAbbreviation;
		this.showMilliseconds = showMilliseconds;
		this.wrapEach = wrapEach;
		this.addPrefix = this.returnClassName(addPrefix);
		this.addSuffix = this.returnClassName(addSuffix);
	}

	/**
	 * @description Inserts the current time in the HTML element.
	 */
	appendTimeString () {
		let time = this.getTime();
		let content = `${time.hours}:${time.minutes}:${time.seconds}${time.abbreviations}`;

		if (this.showMilliseconds) {
			content = `${time.hours}:${time.minutes}:${time.seconds}.${time.milliseconds}${time.abbreviations}`;
		}

		this.elem.textContent = content;
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

		this.elem.appendChild(hours);
		this.elem.appendChild(this.createTimeElement(':'));
		this.elem.appendChild(minutes);
		this.elem.appendChild(this.createTimeElement(':'));
		this.elem.appendChild(seconds);

		if (this.showMilliseconds) {
			this.elem.appendChild(this.createTimeElement('.'));
			this.elem.appendChild(milliseconds);
		}

		if (this.showAbbreviation) {
			this.elem.appendChild(ampm);
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

		if (this.showMilliseconds) {
			this.timeElements.milliseconds.textContent = time.milliseconds;
		}

		if (this.showAbbreviation) {
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

		if (className && (this.addPrefix || this.addSuffix)) {
			if (this.addPrefix) {
				className = `${this.addPrefix}${className}`;
			}
			if (this.addSuffix) {
				className = `${className}${this.addSuffix}`;
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
		let newInterval = this.updateTime;

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

		return newInterval;
	}

	/**
	 * @description Removes all childNodes of 'this.elem'.
	 */
	clearElementContent () {
		while (this.elem.lastChild) {
			this.elem.removeChild(this.elem.lastChild);
		}
	}

	/**
	 * @description Sets the element in which the time should be displayed.
	 * @param {String|Number} interval
	 */
	run (interval = this.updateTime) {
		if (typeof interval === 'string') {
			interval = this.returnIntervalTime(interval);
		}

		if (this.hasHTMLElement()) {
			this.clearElementContent();

			if (this.wrapEach) {
				this.appendTimeElements();
				this.intervalFn = setInterval(this.updateTimeElements.bind(this), interval);
			}
			else {
				this.appendTimeString();
				this.intervalFn = setInterval(this.appendTimeString.bind(this), interval);
			}
		}
		else {
			throw new Error(`You haven't passed a valid HTMLElement: "${this.elem}"!`);
		}
	}

	/**
	 * @description Stops the running interval.
	 */
	stop () {
		clearInterval(this.intervalFn);
	}
}