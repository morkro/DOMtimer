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
		showMilliseconds = false
    } = {}) {
		this.elem = this.returnElement(element);
		this.format = timeFormat;
		this.abbreviations = showAbbreviation;
		this.showMilliseconds = showMilliseconds;
		this.intervalFn = null;
		this.updateTime = interval;
		this.validTimes = [
			'ms', 'millisecond',
			'sec', 'second',
			'min', 'minute',
			'h', 'hour'
		];
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
		let dateHours = date.getHours();
		let dateMinutes = date.getMinutes();
		let dateSeconds = date.getSeconds();
		let dateMilliseconds = date.getMilliseconds();
		let dateAbbr = '';
		let dateString = `${dateHours}:${dateMinutes}:${dateSeconds} ${dateAbbr}`;

		// If time format is set to 12h, use 12h-system.
		if (this.format === '12h') {
			if (this.abbreviations) {
				dateAbbr = this.getAbbr(dateHours);
			}
			dateHours = (dateHours % 12) ? dateHours % 12 : 12;
		}

		// Add '0' if below 10
		if (dateHours < 10) dateHours = `0${dateHours}`;
		if (dateMinutes < 10) dateMinutes = `0${dateMinutes}`;
		if (dateSeconds < 10) dateSeconds = `0${dateSeconds}`;
		if (dateMilliseconds < 100) dateMilliseconds = `0${dateMilliseconds}`;

		// If milliseconds should be shown as well
		if (this.showMilliseconds) {
			dateString = `${dateHours}:${dateMinutes}:${dateSeconds}.${dateMilliseconds} ${dateAbbr}`;
		}

		return dateString;
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
	 *	@description Sets all configuration values.
	 * @param {Object} config
	 */
	config ({
		element = this.returnElement(),
		interval = this.updateTime,
		timeFormat = this.format,
		showAbbreviation = this.abbreviations,
		showMilliseconds = this.showMilliseconds
	} = {}) {
		this.elem = this.returnElement(element);
		this.updateTime = this.returnIntervalTime(interval);
		this.format = timeFormat;
		this.abbreviations = showAbbreviation;
		this.showMilliseconds = showMilliseconds;
	}

	/**
	 * @description Inserts the current time in the HTML element.
	 */
	appendToDOM () {
		this.elem.textContent = this.getTime();
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
	 * @description Sets the element in which the time should be displayed.
	 * @param {String|Number} interval
	 */
	run (interval = this.updateTime) {
		if (typeof interval === 'string') {
			interval = this.returnIntervalTime(interval);
		}

		if (this.hasHTMLElement()) {
			this.appendToDOM();
			this.intervalFn = setInterval(this.appendToDOM.bind(this), interval);
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