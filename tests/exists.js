import test from 'tape';
import DOMtimer from '../domtimer.js';

test('DOMtimer exists', t => {
	t.ok(DOMtimer, 'DOMtimer correctly imported');
	t.equal(typeof DOMtimer, 'function', 'DOMtimer is a function');
	t.end();
});