//colors
const RED = 'rgba(229, 57, 53, 1)';
const GREEN = 'rgba(67, 160, 71, 1)';
const BLUE = 'rgba(25, 118, 210, 1)';

const MAIN_COLORS = [RED, GREEN, BLUE];
const RED_FOCUS = 'rgba(229, 57, 53, 0.3)';
const GREEN_FOCUS = 'rgba(67, 160, 71, 0.3)';
const BLUE_FOCUS = 'rgba(25, 118, 210, 0.3)';
const GREY = '#eceff1';

const STEPS = 255; // N, N > 0

window.onload = function () {

	setTimeout(() => document.getElementById('loading').remove(), 500);

	class Slider {
		constructor(
			elem,
			steps = 5,
			colorActive,
			colorFocus,
			colorBase) {
			this.colors = {
				active: colorActive,
				focus: colorFocus,
				base: colorBase
			};

			this.elem = elem;
			this.steps = steps;

			//keep "this" for handlers
			this.onMouseDown = this.onMouseDown.bind(this);
			this.onMouseMove = this.onMouseMove.bind(this);
			this.onMouseUp = this.onMouseUp.bind(this);


			this.createSlider(this.elem);

			this.counter = Math.floor(Math.random() * (steps + 1));
		}

		/**
		 * create slider line
		 * @param parent element (root for slider object)
		 */
		createSlider(parent) {
			this.slider = document.createElement('div');
			this.slider.style.width = parent.offsetWidth;
			this.slider.style.height = '5px';
			this.slider.classList.add('slider');
			parent.append(this.slider);
			this.createThumb(this.slider);
		}

		/**
		 * create thumb element
		 * @param parent element (slider line)
		 */
		createThumb(parent) {
			this.thumb = document.createElement('div');
			this.thumb.classList.add('thumb');
			this.thumb.style.width = '25px';
			this.thumb.style.height = '25px';
			parent.append(this.thumb);
			this.defaultBoxShadow(this.thumb);
			this.rightLimiter = parent.offsetWidth - this.thumb.offsetWidth;
			this.setTopThumb();
			this.setLeftPositionThumb();
			this.setBackgroundThumb();
			this.thumb.ondragstart = function () {
				return false;
			};
			this.thumb.addEventListener('mousedown', this.onMouseDown);
			this.thumb.addEventListener('touchstart', this.onMouseDown);
		}

		/**
		 * get counter value
		 * @returns {*} counter value
		 */
		get counter() {
			return this._counter;
		}

		/**
		 * set counter value
		 * @param counter
		 */
		set counter(counter) {
			this._counter = counter;
			this.setBackgroundSlider();
			this.setLeftPositionThumb();
			this.elem.dispatchEvent(this.event);
		}

		/**
		 * set background to slider
		 */
		setBackgroundSlider() {
			this.slider.style.background = `linear-gradient(to right, 
			${this.colors.active} 0%, 
			${this.colors.active} 
			${(this.counter * 100) / this.steps}%, 
			${this.colors.base} 
			${(this.counter * 100) / this.steps}%, 
			${this.colors.base} 100%)`;
		}

		/**
		 * set background to thumb
		 */
		setBackgroundThumb() {
			this.thumb.style.background = this.colors.active;
		}

		/**
		 * set top position to thumb
		 */
		setTopThumb() {
			this.thumb.style.top = this.slider.offsetHeight / 2 - this.thumb.offsetHeight / 2 + "px";
		}

		/**
		 * set left position to thumb
		 */
		setLeftPositionThumb() {
			this.thumb.style.left =
				Math.round(this.counter * (this.rightLimiter / this.steps)) + "px";
		}

		/**
		 * increase box shadow
		 * @param elem target element
		 * @param spread value
		 */
		increaseBoxShadow(elem, spread) {
			elem.style.boxShadow = `0 0 0 ${spread}px ${this.colors.focus}`;
		}

		/**
		 * set default value to element
		 * @param elem target element
		 */
		defaultBoxShadow(elem) {
			elem.style.boxShadow = `0 0 0 0 ${this.colors.focus}`;
		}

		/**
		 * add event listeners to follow user's actions (mousemove/touchmove, mouseup, touchend)
		 * @param event current event
		 */
		onMouseDown(event) {
			this.increaseBoxShadow(this.thumb, 10);

			//prevent default browser's action - highlighting
			event.preventDefault();

			//mouse action or touch action
			let clientX = event.clientX || event.touches[0].clientX;

			this.shiftX = clientX - this.thumb.getBoundingClientRect().left;

			document.addEventListener('mousemove', this.onMouseMove);
			document.addEventListener('mouseup', this.onMouseUp);

			//support mobile devices
			document.addEventListener('touchmove', this.onMouseMove);
			document.addEventListener('touchend', this.onMouseUp);
		}

		/**
		 * set new position to counter, set new background to slider; set new left position to thumb
		 * @param event current event
		 */
		onMouseMove(event) {
			//mouse action or touch action
			let clientX = event.clientX || event.touches[0].clientX;
			let newPositionX =
				clientX - this.shiftX - this.slider.getBoundingClientRect().left;

			// check for bounds
			if (newPositionX < 0) {
				newPositionX = 0;
			}

			if (newPositionX > this.rightLimiter) {
				newPositionX = this.rightLimiter;
			}

			//getter that change counter, slider background, thumb left position
			this.counter = Math.floor((this.steps * newPositionX) / this.rightLimiter);
		}

		/**
		 * remove event listeners when mouse up
		 */
		onMouseUp() {
			this.defaultBoxShadow(this.thumb);
			document.removeEventListener('mouseup', this.onMouseUp);
			document.removeEventListener('mousemove', this.onMouseMove);

			//support mobile devices
			document.removeEventListener('touchend', this.onMouseUp);
			document.removeEventListener('touchmove', this.onMouseMove);
		}
	}

	//create event to follow counter changes
	Slider.prototype.event = new Event('counterChange', {bubbles: true});


	//red slider
	let red = new Slider(
		document.getElementById('sliderRed'),
		STEPS,
		RED,
		RED_FOCUS,
		GREY
	);

	//green slider
	let green = new Slider(
		document.getElementById('sliderGreen'),
		STEPS,
		GREEN,
		GREEN_FOCUS,
		GREY
	);

//blue slider
	let blue = new Slider(
		document.getElementById('sliderBlue'),
		STEPS,
		BLUE,
		BLUE_FOCUS,
		GREY
	);

	let sliders = {
		'red': red,
		'green': green,
		'blue': blue
	};
	/*============CREATE COLORED WINDOW WITH RGB/HEX CODE ============*/

	/**
	 * visual representation of color code
	 * @type {{window: HTMLElement, randomButton: HTMLElement}}
	 */
	let coloredWindowElement = {
		window: document.getElementById('coloredWindow'),
		randomButton: document.getElementById('getRandom')
	};

	coloredWindowElement.randomButton.addEventListener('click', setRandomColor);

	/**
	 * code (hex/rgb) representation of color
	 * @type {{container: HTMLElement, hex: Element[], rgb: Element[]}}
	 */
	let colorCodeElement = {
		'container': document.getElementById('text'),
		'hex': Array.from(document.getElementById('hex').children).slice(1),
		'rgb': Array.from(document.getElementById('rgb').children).slice(1)
	};

	function setColorsToInputs(arr){
		arr.forEach((child, i) => {
			child.style.background = MAIN_COLORS[i];
			child.classList.add('inputCodeStyle');
		});
	}

	setColorsToInputs(colorCodeElement.rgb);
	setColorsToInputs(colorCodeElement.hex);


	document.addEventListener('counterChange', handleCounterChange);

	//trigger related elements after all sliders were establish their counters
	document.dispatchEvent(Slider.prototype.event);

	/**
	 * set random color for colored window
	 */
	function setRandomColor() {
		[sliders.red.counter, sliders.green.counter, sliders.blue.counter] = [getRandom(255), getRandom(255), getRandom(255)];
	}

	/**
	 * ger random value
	 * @param max
	 * @returns {number}
	 */
	function getRandom(max) {
		return Math.floor(Math.random() * (max + 1));
	}

	/**
	 * translate rgb code to corresponding hex code
	 * @param r red code [0..255]
	 * @param g green code [0..255]
	 * @param b blue code [0..255]
	 * @returns {string[]} array of hex codes of red, green and blue
	 */
	function rgbToHex(r, g, b) {
		let inRange = (n) => (n > 255 ? 255 : n < 0 ? 0 : +n);
		let hex = [inRange(r), inRange(g), inRange(b)];
		return hex
			.map((item) => ("0" + item.toString(16).toUpperCase()).slice(-2));
	}

	/**
	 * handle counter changes: set new color for window, set new hex values, set new rgb values
	 */
	function handleCounterChange() {
		setColorWindow();
		setValueHEX();
		setValueRGB();
	}

	/**
	 * set new color for colored window
	 */
	function setColorWindow() {
		coloredWindowElement.window.style.background = `rgb(
															${sliders.red.counter}, 
															${sliders.green.counter}, 
															${sliders.blue.counter})`;
	}

	/**
	 * set new rgb values
	 */
	function setValueRGB() {
		let colors = ['red', 'green', 'blue'];
		colorCodeElement.rgb.forEach((child, i) => child.value = sliders[colors[i]].counter);
	}

	/**
	 * set new hex values
	 */
	function setValueHEX() {
		let colors = ['red', 'green', 'blue'];

		let hexCode = rgbToHex(
			sliders[colors[0]].counter,
			sliders[colors[1]].counter,
			sliders[colors[2]].counter
		);

		colorCodeElement.hex.forEach((child, i) => child.value = hexCode[i]);
	}

	colorCodeElement.container.addEventListener('click', onMouseClick);
	colorCodeElement.container.addEventListener('change', onValueChange);

	/**
	 * copy to clipBoard rgb or hex values
	 * @param event current event
	 */
	function onMouseClick(event) {
		if (!event.target.closest('.copy')) return;
		let target = event.target.closest('#rgb') || event.target.closest('#hex');

		let temp = document.createElement('textarea');

		document.body.append(temp);

		let value = colorCodeElement[target.getAttribute('id')]
			.reduce((res, current) => res + current.value + " ", "")
			.trim();
		value = (target.getAttribute('id') === 'hex') ?
			`#${value.split(' ').join('')}` :
			`rgb(${value.split(' ').join(', ')})`;

		temp.value = value;

		temp.select();
		temp.setSelectionRange(0, 99999); /*For mobile devices*/

		document.execCommand('copy');
		temp.remove();

		createNotification(target, 'copied');
	}

	/**
	 * create notification that rgb or hex values are copied
	 * @param target element whose value was copied
	 * @param text corresponding notification text
	 */
	function createNotification(target, text) {
		let copied = document.createElement('div');
		copied.classList.add('copied');
		copied.textContent = text;
		target.append(copied);
		setTimeout(() => copied.remove(), 500);
	}

	/**
	 * handle direct user's rgb or hex values change in input field
	 * @param event current event
	 */
	function onValueChange(event) {
		let id = event.target.getAttribute('id');
		let type = event.target.getAttribute('id').slice(0, 3);
		let value = event.target.value;
		let color = id.slice(3)[0].toLowerCase() + id.slice(4);

		switch (type) {
			case 'rgb':
				value = value.match(/\d{1,3}/);
				value = (value) ? +value[0] : 0;
				value = (value > 255) ? 255 : (value < 0) ? 0 : value;
				sliders[color].counter = value;
				break;
			case 'hex':
				value = value.match(/[\da-f]{2}/i);
				value = (value) ? value[0] : 'FF';

				sliders[color].counter = parseInt(value, 16);
				break;
		}
	}
}
