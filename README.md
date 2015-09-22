<h1 align="center">
	<img src="https://cdn.rawgit.com/morkro/DOMtimer/master/media/domtimer-logo.svg" alt="DOMtimer">
</h1>
> An easy to `import` ES6 module timer for your DOM.

:loudspeaker: Ever wanted to show the current time in your interfaces? But not only that, a real-time display with handy configuration? Introducing **`DOMtimer`**—a customisable and simple timer for your DOM!


`DOMtimer` lets you choose between the **24-hour** or **12-hour** system. You can easily display AM/PM, turn additional milliseconds on or off and set your own update interval!


# Install
You can either install it via bower

```
bower install domtimer --save
```

or if you don't use a package manager, simply download [`domtimer.js`](https://github.com/morkro/DOMtimer/blob/master/domtimer.js) from here.


## Import the module

In order to use the module, you have to import it to your project.

```javascript
import DOMtimer from 'path/to/module/domtimer';
```

# :video_game: Usage
`DOMtimer` is easy to use with a short and simple API. Initialise a new timer, pass an `<element>` and you're ready to go!


## `DOMtimer(selector?, options?)`
The default will append a **24-hour clock** _(hh:mm:ss)_ to your element with an **1 second interval**. That's it.

You can either pass a selector string or a valid HTML element to the constructor. Passing none is fine, as long as you specify an element in `.config()` later on. Otherwise you will get an error.


```javascript
// Without anything
let timer = new DOMtimer();

// Passing a selector string
let timer = new DOMtimer('.foo-element');

// Passing an element
let fooElement = document.querySelector('.foo-element');
let timer = new DOMtimer(fooElement);

// Later in your code
timer.run();
```

You can either provide an `options` object to the constructor, or later in `.config()`. Here's an overview of the default options:

```javascript
DOMtimer(element, {
	interval: 1000,				// The timer updates the time every second,
	timeFormat: '24h',			// and uses the 24-hour system, but
	showMilliseconds: false,	// doesn't show the milliseconds.
	showAbbreviation: false,	// Displaying AM/PM works only with the 12-hour system.
	wrapEach: false,			// The output won't be wrapped in a <span>,
	addPrefix: false,			// hence needs no prefixed class,
	addSuffix: false			// or suffixed class.
});
```

As mentioned earlier, you can also omit the `element` and/or `options` in the constructor and call them later on with the `.config()` function.


## `.config(options)`
Here you can pass exactly the same options as in the constructor function, just with an additional **`element`** property.

```javascript
let timer = new DOMtimer();

timer.config({
	element: '.foo-element',
	interval: 'milliseconds',
	timeFormat: '12h',
	showMilliseconds: true,
	showAbbreviation: true,
	wrapEach: true,
	addPrefix: 'element__',
	addSuffix: false
});
timer.run();
```

### `options.element`
**Type**: `String|HTMLElement`<br>
**Default**: `null`

The element in which you want to have the time. You can either pass a valid selector string or DOM element.

### `options.interval`
**Type**: `String|Number`<br>
**Default**: `1000`

This options accepts a `String` or a `Number` as argument. The number will be interpreted as **milliseconds**, means `10` would be 10ms and `1000` is one second. But it's also possible to pass a string like `second` or `minute`.

Here is the list of all predefined strings:

* Milliseconds: `'ms'`, `'millisecond'`
* Seconds: `'sec'`, `'second'`
* Minute: `'min'`, `'minute'`
* Hour: `'h'`, `'hour'`


### `options.timeFormat`
**Type**: `String`<br>
**Default**: `24h`

You can choose between the **24-hour** (`24h`) or **12-hour** (`12h`) clock.

### `options.showMilliseconds`
**Type**: `Boolean`<br>
**Default**: `false`

The default is set to false. If you set this to true, the timer will also display the milliseconds (hh:mm:ss.msmsms). I recommend also setting `options.interval` to a millisecond then.

### `options.showAbbreviation`
**Type**: `Boolean`<br>
**Default**: `false`

Adds AM and PM to the time. This will only work and make sense if `options.timeFormat` is set to `'12h'`. If set to `true` you will get your time like `10:42:01 AM`.

### `options.wrapEach`
**Type**: `Boolean`<br>
**Default**: `false`

Setting this option to `true` will wrap each time in a `<span>`.

**Output**

```html
<div class="foo-element">
    <span>10</span><span>:</span><span>05</span><span>:</span><span>10</span><span>.</span><span>598</span>
</div>
```

### `options.addPrefix`
**Type**: `String`<br>
**Default**: `false`

Passing any string will prefix this to each `<span>` time element. You can only use valid CSS selector character. It is possible to use both `addPrefix` and `addSuffix` together.

`timer.config({ wrapEach: true, addPrefix: 'element__' })` will output:

```html
<div class="foo-element">
    <span class="element__hours">10</span><span>:</span><span class="element__minutes">05</span><span>:</span><span class="element__seconds">10</span><span>.</span><span class="element__milliseconds">598</span>
</div>
```


### `options.addSuffix`
**Type**: `String`<br>
**Default**: `false`

Passing any string will add this to each `<span>` element. You can only use valid CSS selector character. It is possible to use both `addPrefix` and `addSuffix` together.

`timer.config({ wrapEach: true, addSuffix: '--timer' })` will output:

```html
<div class="foo-element">
    <span class="hours--timer">10</span><span>:</span><span class="minutes--timer">05</span><span>:</span><span class="seconds--timer">10</span><span>.</span><span class="milliseconds--timer">598</span>
</div>
```



## `.run(input?)`
**Type**: `String`<br>
**Default**: [`options.interval`](#optionsinterval)

This function finally starts the timer. If you don't pass an argument, it will use either the interval from your preconfigured `options` object or default to `1000`.
It also takes the same list of strings as in `options.interval`.

Here is the list of all predefined strings:

* Milliseconds: `'ms'`, `'millisecond'`
* Seconds: `'sec'`, `'second'`
* Minute: `'min'`, `'minute'`
* Hour: `'h'`, `'hour'`

**Usage**

```javascript
let timer = new DOMtimer('.foo-element');

timer.run('minute');
```



## `.stop()`

Simply stops the timer.



# :bulb: What to keep in mind
### Babel.js and `Array.prototype.includes()`
If you compile your code with Babel.js, keep in mind that `DOMtimer` makes use of [`Array.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) which won't be polyfilled by Babel. If your code runs in an environment that doesn't support this feature yet, consider adding the respective plugin [**`babel-plugin-array-includes`**](https://github.com/stoeffel/babel-plugin-array-includes) to your compilation process.



# :copyright: License
The code is available under [MIT License](https://github.com/morkro/DOMtimer/blob/master/LICENSE).
