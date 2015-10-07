import test from 'tape';
import DOMtimer from '../domtimer.js';

test('Default options are correct', t => {
	const timer = new DOMtimer();

	t.equal(timer.options.elem, null, 'timer.options.elem defaults to null');
	t.equal(timer.options.showAbbreviation, false, 'timer.options.showAbbreviation defaults to false');
	t.equal(timer.options.showAMPM, false, 'timer.options.showAMPM defaults to false');
	t.equal(timer.options.timeFormat, '24h', `timer.options.timeFormat defaults to '24h'`);
	t.equal(timer.intervalFn, null, 'timer.intervalFn defaults to null');
	t.equal(timer.options.updateTime, 1000, 'timer.options.updateTime defaults to 1000');
	t.equal(timer.options.wrapEach, false, 'timer.options.wrapEach defaults to false');
	t.equal(timer.options.addPrefix, false, 'timer.options.addPrefix defaults to false');
	t.equal(timer.options.addSuffix, false, 'timer.options.addSuffix defaults to false');

	t.end();
});