import test from 'tape';
import DOMtimer from '../domtimer.js';

test('Default options are correct', (t) => {
	const timer = new DOMtimer();

	t.equal(timer.elem, null, 'timer.element defaults to null');
	t.equal(timer.abbreviations, false, 'timer.abbreviations defaults to false');
	t.equal(timer.format, '24h', `timer.format defaults to '24h'`);
	t.equal(timer.intervalFn, null, 'timer.intervalFn defaults to null');
	t.equal(timer.updateTime, 1000, 'timer.updateTime defaults to 1000');

	t.end();
});