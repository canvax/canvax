import mmvis from 'mmvis';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var utils = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,mmvis);}(void 0,function(e,t){Object.defineProperty(e,"__esModule",{value:!0});var n={mainFrameRate:60,now:0,_pixelCtx:null,__emptyFunc:function(){},_devicePixelRatio:"undefined"!=typeof window?window.devicePixelRatio:1,_UID:0,getUID:function(){return this._UID++},createId:function(e){var t=e.charCodeAt(e.length-1);return 48<=t&&t<=57&&(e+="_"),e+n.getUID()},canvasSupport:function(){return !!document.createElement("canvas").getContext},initElement:function(e){return window.FlashCanvas&&FlashCanvas.initElement&&FlashCanvas.initElement(e),e},getCssOrderArr:function(e){var t,n,i,r;return "number"==typeof e?t=n=i=r=e:e instanceof Array?1===e.length?t=n=i=r=e[0]:2===e.length?(t=i=e[0],n=r=e[1]):3===e.length?(t=e[0],n=r=e[1],i=e[2]):(t=e[0],n=e[1],i=e[2],r=e[3]):t=n=i=r=0,[t,n,i,r]},isWebGLSupported:function(){var e={stencil:!0};try{if(!window.WebGLRenderingContext)return !1;var t=document.createElement("canvas"),n=t.getContext("webgl",e)||t.getContext("experimental-webgl",e);return !(!n||!n.getContextAttributes().stencil)}catch(e){return !1}},checkOpt:function(e){return e?e.context||(e.context={}):e={context:{}},e}};n._pixelCtx=n.initElement(t.$.createCanvas(1,1,"_pixelCanvas")).getContext("2d"),e.default=n;});
});

unwrapExports(utils);

var Matrix = createCommonjsModule(function (module, exports) {
!function(t,i){i(exports);}(0,function(t){Object.defineProperty(t,"__esModule",{value:!0});function c(t,i,s,h,n,a){this.a=null!=t?t:1,this.b=null!=i?i:0,this.c=null!=s?s:0,this.d=null!=h?h:1,this.tx=null!=n?n:0,this.ty=null!=a?a:0,this.array=null;}c.prototype={concat:function(t){var i=this.a,s=this.c,h=this.tx;return this.a=i*t.a+this.b*t.c,this.b=i*t.b+this.b*t.d,this.c=s*t.a+this.d*t.c,this.d=s*t.b+this.d*t.d,this.tx=h*t.a+this.ty*t.c+t.tx,this.ty=h*t.b+this.ty*t.d+t.ty,this},concatTransform:function(t,i,s,h,n){var a=1,r=0;if(n%360){var e=n*Math.PI/180;a=Math.cos(e),r=Math.sin(e);}return this.concat(new c(a*s,r*s,-r*h,a*h,t,i)),this},rotate:function(t){var i=Math.cos(t),s=Math.sin(t),h=this.a,n=this.c,a=this.tx;if(0<t)this.a=h*i-this.b*s,this.b=h*s+this.b*i,this.c=n*i-this.d*s,this.d=n*s+this.d*i,this.tx=a*i-this.ty*s,this.ty=a*s+this.ty*i;else{var r=Math.sin(Math.abs(t)),e=Math.cos(Math.abs(t));this.a=h*e+this.b*r,this.b=-h*r+this.b*e,this.c=n*e+this.d*r,this.d=-n*r+e*this.d,this.tx=e*a+r*this.ty,this.ty=e*this.ty-r*a;}return this},scale:function(t,i){return this.a*=t,this.d*=i,this.tx*=t,this.ty*=i,this},translate:function(t,i){return this.tx+=t,this.ty+=i,this},identity:function(){return this.a=this.d=1,this.b=this.c=this.tx=this.ty=0,this},invert:function(){var t=this.a,i=this.b,s=this.c,h=this.d,n=this.tx,a=t*h-i*s;return this.a=h/a,this.b=-i/a,this.c=-s/a,this.d=t/a,this.tx=(s*this.ty-h*n)/a,this.ty=-(t*this.ty-i*n)/a,this},clone:function(){return new c(this.a,this.b,this.c,this.d,this.tx,this.ty)},toArray:function(t,i){if(0==arguments.length)return isNaN(this.a)||isNaN(this.b)||isNaN(this.c)||isNaN(this.d)||isNaN(this.tx)||isNaN(this.ty)?null:[this.a,this.b,this.c,this.d,this.tx,this.ty];this.array||(this.array=new Float32Array(9));var s=i||this.array;return t?(s[0]=this.a,s[1]=this.b,s[2]=0,s[3]=this.c,s[4]=this.d,s[5]=0,s[6]=this.tx,s[7]=this.ty):(s[0]=this.a,s[1]=this.c,s[2]=this.tx,s[3]=this.b,s[4]=this.d,s[5]=this.ty,s[6]=0,s[7]=0),s[8]=1,s},mulVector:function(t){var i=this.a,s=this.c,h=this.tx,n=this.b,a=this.d,r=this.ty,e=[0,0];return e[0]=t[0]*i+t[1]*s+h,e[1]=t[0]*n+t[1]*a+r,e}},t.default=c;});
});

unwrapExports(Matrix);

var Point = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports);}(0,function(e){function r(e){return (r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function t(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o);}}Object.defineProperty(e,"__esModule",{value:!0});var n,o,f=(n=u,(o=[{key:"toArray",value:function(){return [this.x,this.y]}}])&&t(n.prototype,o),u);function u(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;if(!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),1==arguments.length&&"object"==r(arguments[0])){var n=arguments[0];if("x"in n&&"y"in n)this.x=1*n.x,this.y=1*n.y;else{var o=0;for(var i in n){if(0!=o){this.y=1*n[i];break}this.x=1*n[i],o++;}}}else this.x=1*e,this.y=1*t;}e.default=f;});
});

unwrapExports(Point);

var Tween = createCommonjsModule(function (module, exports) {
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */


var _Group = function () {
	this._tweens = {};
	this._tweensAddedDuringUpdate = {};
};

_Group.prototype = {
	getAll: function () {

		return Object.keys(this._tweens).map(function (tweenId) {
			return this._tweens[tweenId];
		}.bind(this));

	},

	removeAll: function () {

		this._tweens = {};

	},

	add: function (tween) {

		this._tweens[tween.getId()] = tween;
		this._tweensAddedDuringUpdate[tween.getId()] = tween;

	},

	remove: function (tween) {

		delete this._tweens[tween.getId()];
		delete this._tweensAddedDuringUpdate[tween.getId()];

	},

	update: function (time, preserve) {

		var tweenIds = Object.keys(this._tweens);

		if (tweenIds.length === 0) {
			return false;
		}

		time = time !== undefined ? time : TWEEN.now();

		// Tweens are updated in "batches". If you add a new tween during an update, then the
		// new tween will be updated in the next batch.
		// If you remove a tween during an update, it may or may not be updated. However,
		// if the removed tween was added during the current batch, then it will not be updated.
		while (tweenIds.length > 0) {
			this._tweensAddedDuringUpdate = {};

			for (var i = 0; i < tweenIds.length; i++) {

				var tween = this._tweens[tweenIds[i]];

				if (tween && tween.update(time) === false) {
					tween._isPlaying = false;

					if (!preserve) {
						delete this._tweens[tweenIds[i]];
					}
				}
			}

			tweenIds = Object.keys(this._tweensAddedDuringUpdate);
		}

		return true;

	}
};

var TWEEN = new _Group();

TWEEN.Group = _Group;
TWEEN._nextId = 0;
TWEEN.nextId = function () {
	return TWEEN._nextId++;
};


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
		 window.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	TWEEN.now = function () {
		return new Date().getTime();
	};
}


TWEEN.Tween = function (object, group) {
	this._object = object;
	this._valuesStart = {};
	this._valuesEnd = {};
	this._valuesStartRepeat = {};
	this._duration = 1000;
	this._repeat = 0;
	this._repeatDelayTime = undefined;
	this._yoyo = false;
	this._isPlaying = false;
	this._reversed = false;
	this._delayTime = 0;
	this._startTime = null;
	this._easingFunction = TWEEN.Easing.Linear.None;
	this._interpolationFunction = TWEEN.Interpolation.Linear;
	this._chainedTweens = [];
	this._onStartCallback = null;
	this._onStartCallbackFired = false;
	this._onUpdateCallback = null;
	this._onCompleteCallback = null;
	this._onStopCallback = null;
	this._group = group || TWEEN;
	this._id = TWEEN.nextId();

};

TWEEN.Tween.prototype = {
	getId: function getId() {
		return this._id;
	},

	isPlaying: function isPlaying() {
		return this._isPlaying;
	},

	to: function to(properties, duration) {

		this._valuesEnd = properties;

		if (duration !== undefined) {
			this._duration = duration;
		}

		return this;

	},

	start: function start(time) {

		this._group.add(this);

		this._isPlaying = true;

		this._onStartCallbackFired = false;

		this._startTime = time !== undefined ? typeof time === 'string' ? TWEEN.now() + parseFloat(time) : time : TWEEN.now();
		this._startTime += this._delayTime;

		for (var property in this._valuesEnd) {

			// Check if an Array was provided as property value
			if (this._valuesEnd[property] instanceof Array) {

				if (this._valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (this._object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			this._valuesStart[property] = this._object[property];

			if ((this._valuesStart[property] instanceof Array) === false) {
				this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			this._valuesStartRepeat[property] = this._valuesStart[property] || 0;

		}

		return this;

	},

	stop: function stop() {

		if (!this._isPlaying) {
			return this;
		}

		this._group.remove(this);
		this._isPlaying = false;

		if (this._onStopCallback !== null) {
			this._onStopCallback(this._object);
		}

		this.stopChainedTweens();
		return this;

	},

	end: function end() {

		this.update(this._startTime + this._duration);
		return this;

	},

	stopChainedTweens: function stopChainedTweens() {

		for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].stop();
		}

	},

	group: function group(group) {
		this._group = group;
		return this;
	},

	delay: function delay(amount) {

		this._delayTime = amount;
		return this;

	},

	repeat: function repeat(times) {

		this._repeat = times;
		return this;

	},

	repeatDelay: function repeatDelay(amount) {

		this._repeatDelayTime = amount;
		return this;

	},

	yoyo: function yoyo(yy) {

		this._yoyo = yy;
		return this;

	},

	easing: function easing(eas) {

		this._easingFunction = eas;
		return this;

	},

	interpolation: function interpolation(inter) {

		this._interpolationFunction = inter;
		return this;

	},

	chain: function chain() {

		this._chainedTweens = arguments;
		return this;

	},

	onStart: function onStart(callback) {

		this._onStartCallback = callback;
		return this;

	},

	onUpdate: function onUpdate(callback) {

		this._onUpdateCallback = callback;
		return this;

	},

	onComplete: function onComplete(callback) {

		this._onCompleteCallback = callback;
		return this;

	},

	onStop: function onStop(callback) {

		this._onStopCallback = callback;
		return this;

	},

	update: function update(time) {

		var property;
		var elapsed;
		var value;

		if (time < this._startTime) {
			return true;
		}

		if (this._onStartCallbackFired === false) {

			if (this._onStartCallback !== null) {
				this._onStartCallback(this._object);
			}

			this._onStartCallbackFired = true;
		}

		elapsed = (time - this._startTime) / this._duration;
		elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

		value = this._easingFunction(elapsed);

		for (property in this._valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (this._valuesStart[property] === undefined) {
				continue;
			}

			var start = this._valuesStart[property] || 0;
			var end = this._valuesEnd[property];

			if (end instanceof Array) {

				this._object[property] = this._interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					this._object[property] = start + (end - start) * value;
				}

			}

		}

		if (this._onUpdateCallback !== null) {
			this._onUpdateCallback(this._object);
		}

		if (elapsed === 1) {

			if (this._repeat > 0) {

				if (isFinite(this._repeat)) {
					this._repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in this._valuesStartRepeat) {

					if (typeof (this._valuesEnd[property]) === 'string') {
						this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
					}

					if (this._yoyo) {
						var tmp = this._valuesStartRepeat[property];

						this._valuesStartRepeat[property] = this._valuesEnd[property];
						this._valuesEnd[property] = tmp;
					}

					this._valuesStart[property] = this._valuesStartRepeat[property];

				}

				if (this._yoyo) {
					this._reversed = !this._reversed;
				}

				if (this._repeatDelayTime !== undefined) {
					this._startTime = time + this._repeatDelayTime;
				} else {
					this._startTime = time + this._delayTime;
				}

				return true;

			} else {

				if (this._onCompleteCallback !== null) {

					this._onCompleteCallback(this._object);
				}

				for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					this._chainedTweens[i].start(this._startTime + this._duration);
				}

				return false;

			}

		}

		return true;

	}
};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	{

		// Node.js
		module.exports = TWEEN;

	}

})();
});

var AnimationFrame = createCommonjsModule(function (module, exports) {
!function(e,n){n(exports,Tween,utils,mmvis);}(void 0,function(e,n,t,o){Object.defineProperty(e,"__esModule",{value:!0});var a=i(n),r=i(t);function i(e){return e&&e.__esModule?e:{default:e}}var d,u,f=0;if("undefined"!=typeof window){d=window.requestAnimationFrame,u=window.cancelAnimationFrame;for(var s=["ms","moz","webkit","o"],l=0;l<s.length&&!window.requestAnimationFrame;++l)d=window.requestAnimationFrame=window[s[l]+"RequestAnimationFrame"],u=window.cancelAnimationFrame=window[s[l]+"CancelAnimationFrame"]||window[s[l]+"CancelRequestAnimationFrame"];}d=d||function(e){var n=(new Date).getTime(),t=Math.max(0,16-(n-f)),i=setTimeout(function(){e(n+t);},t);return f=n+t,i},u=u||function(e){clearTimeout(e);};var m=[],c=null;function w(e){if(e)return m.push(e),c=c||d(function(){a.default.update();var e=m;for(m=[],c=null;0<e.length;)e.shift().task();})}function p(e){for(var n=!1,t=0,i=m.length;t<i;t++)m[t].id===e.id&&(n=!0,m.splice(t,1),t--,i--);return 0==m.length&&(u(c),c=null),n}e.default={registFrame:w,destroyFrame:p,registTween:function(e){var n=o._.extend({from:null,to:null,duration:500,onStart:function(){},onUpdate:function(){},onComplete:function(){},onStop:function(){},repeat:0,delay:0,easing:"Linear.None",desc:""},e);o.global.getAnimationEnabled()||(n.duration=0,n.delay=0);var t={},i="tween_"+r.default.getUID();if(n.id&&(i=i+"_"+n.id),n.from&&n.to){(t=new a.default.Tween(n.from).to(n.to,n.duration).onStart(function(){n.onStart(n.from);}).onUpdate(function(){n.onUpdate(n.from);}).onComplete(function(){p({id:i}),t._isCompleteed=!0,n.onComplete(n.from);}).onStop(function(){p({id:i}),t._isStoped=!0,n.onStop(n.from);}).repeat(n.repeat).delay(n.delay).easing(a.default.Easing[n.easing.split(".")[0]][n.easing.split(".")[1]])).id=i,t.start(),function e(){t._isCompleteed||t._isStoped?t=null:w({id:i,task:e,desc:n.desc,tween:t});}();}return t},destroyTween:function(e,n){e.stop();},Tween:a.default,taskList:m};});
});

unwrapExports(AnimationFrame);

var observe = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,mmvis);}(void 0,function(e,l){function s(e){return (s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(e,"__esModule",{value:!0});var o=Object.defineProperty;try{o({},"_",{value:"x"});var f=Object.defineProperties;}catch(e){"__defineGetter__"in Object&&(o=function(e,t,n){return "value"in n&&(e[t]=n.value),"get"in n&&e.__defineGetter__(t,n.get),"set"in n&&e.__defineSetter__(t,n.set),e},f=function(e,t){for(var n in t)t.hasOwnProperty(n)&&o(e,n,t[n]);return e});}e.default=function u(t){var c=!0,a={},n={},o=["$watch","$model"],d={},r=o;function e(i,e){-1===l._.indexOf(o,i)&&(d[i]=e);var f=s(e);if(!(-1<l._.indexOf(r,i)))if("function"===f)r.push(i);else{var t=function(e){var t,n=d[i],o=n;if(!arguments.length)return !n||"object"!==f||n instanceof Array||n.$model||n.addColorStop||((n=u(n)).$watch=a.$watch,d[i]=n),n;var r=s(e);c||n!==e&&(!e||"object"!==r||e instanceof Array||e.addColorStop?n=e:t=(n=e.$model?e:u(e)).$model,d[i]=t||n,f!=r&&(f=r),a.$watch&&a.$watch.call(a,i,n,o));};n[i]={set:t,get:t,enumerable:!0};}}for(var i in t)e(i,t[i]);return a=f(a,n,r),l._.forEach(r,function(e){t[e]&&("function"==typeof t[e]?a[e]=function(){t[e].apply(this,arguments);}:a[e]=t[e]);}),a.$model=d,a.hasOwnProperty=function(e){return e in a.$model},c=!1,a};});
});

unwrapExports(observe);

var _const = createCommonjsModule(function (module, exports) {
!function(e,l){l(exports);}(0,function(e){Object.defineProperty(e,"__esModule",{value:!0});e.VERSION=__VERSION__,e.PI_2=2*Math.PI,e.RAD_TO_DEG=180/Math.PI,e.DEG_TO_RAD=Math.PI/180,e.RENDERER_TYPE={UNKNOWN:0,WEBGL:1,CANVAS:2},e.DRAW_MODES={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},e.SHAPES={POLY:0,RECT:1,CIRC:2,ELIP:3},e.SCALE_MODES={LINEAR:0,NEAREST:1},e.CONTEXT_DEFAULT={width:0,height:0,x:0,y:0,scaleX:1,scaleY:1,scaleOrigin:{x:0,y:0},rotation:0,rotateOrigin:{x:0,y:0},visible:!0,globalAlpha:1},e.SHAPE_CONTEXT_DEFAULT={cursor:"default",fillAlpha:1,fillStyle:null,lineCap:null,lineJoin:null,miterLimit:null,strokeAlpha:1,strokeStyle:null,lineType:"solid",lineWidth:null},e.TRANSFORM_PROPS=["x","y","scaleX","scaleY","rotation","scaleOrigin","rotateOrigin"],e.STYLE_PROPS=["lineWidth","strokeAlpha","strokeStyle","fillStyle","fillAlpha","globalAlpha"];});
});

unwrapExports(_const);

var InsideLine = createCommonjsModule(function (module, exports) {
!function(e,n){n(exports);}(0,function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,n,t,i){for(var f=e.shape.points,o=e.lineWidth,r=!1,d=0;d<f.length&&!(r=u(f.slice(d,d+4),n,t,o));++d)d+=1;return r};var u=function(e,n,t,i){var f=e[0],o=e[1],r=e[2],d=e[3],u=Math.max(i,3),a=0,s=f;return !(o+u<t&&d+u<t||t<o-u&&t<d-u||f+u<n&&r+u<n||n<f-u&&n<r-u)&&(f===r?Math.abs(n-f)<=u/2:((a=(o-d)/(f-r))*n-t+(s=(f*d-r*o)/(f-r)))*(a*n-t+s)/(a*a+1)<=u/2*u/2)};});
});

unwrapExports(InsideLine);

var settings = createCommonjsModule(function (module, exports) {
!function(e,i){i(exports);}(0,function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default={RESOLUTION:"undefined"!=typeof window?window.devicePixelRatio:1,TARGET_FPMS:.06,MIPMAP_TEXTURES:!0,FILTER_RESOLUTION:1,SPRITE_BATCH_SIZE:4096,RETINA_PREFIX:/@(.+)x/,RENDER_OPTIONS:{view:null,antialias:!0,forceFXAA:!1,autoResize:!1,transparent:!0,backgroundColor:0,clearBeforeRender:!0,preserveDrawingBuffer:!1,roundPixels:!1},TRANSFORM_MODE:0,GC_MODE:0,GC_MAX_IDLE:3600,GC_MAX_CHECK_COUNT:600,WRAP_MODE:0,SCALE_MODE:0,PRECISION:"mediump"};});
});

unwrapExports(settings);

var DisplayObject = createCommonjsModule(function (module, exports) {
!function(t,e){e(exports,mmvis,Matrix,Point,utils,AnimationFrame,observe,_const,InsideLine,settings);}(void 0,function(t,c,e,n,i,r,a,o,s,l){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u=m(e),h=m(n),f=m(i),d=m(r),p=m(a),y=m(s),v=m(l);function m(t){return t&&t.__esModule?t:{default:t}}function g(t){return (g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}function x(t){return (x=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function b(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function w(t,e){return (w=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var k,T,C=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&w(t,e);}(I,c.event.Dispatcher),k=I,(T=[{key:"init",value:function(){}},{key:"clipTo",value:function(t){(this.clip=t).isClip=!0;}},{key:"_createContext",value:function(t){var r=this,e=t.context||{},n={width:e.width||0,height:e.height||0,x:e.x||0,y:e.y||0,scaleX:e.scaleX||1,scaleY:e.scaleY||1,scaleOrigin:e.scaleOrigin||{x:0,y:0},rotation:e.rotation||0,rotateOrigin:e.rotateOrigin||{x:0,y:0},visible:e.visible||!0,globalAlpha:e.globalAlpha||1};return c._.extend(!0,n,t.context),r._notWatch=!1,r._noHeart=!1,n.$watch=function(t,e,n){var i=r;i.context&&("globalGalpha"==t&&(i._globalAlphaChange=!0),-1<c._.indexOf(o.TRANSFORM_PROPS,t)&&(i._updateTransform(),i._transformChange=!0),i._notWatch||(i.$watch&&(i._notWatch=!0,i.$watch(t,e,n),i._notWatch=!1),i._noHeart||i.heartBeat({convertType:"context",shape:i,name:t,value:e,preValue:n})));},(0, p.default)(n)}},{key:"track",value:function(t){-1==c._.indexOf(this._trackList,t)&&this._trackList.push(t);}},{key:"untrack",value:function(t){var e=c._.indexOf(this._trackList,t);-1<e&&this._trackList.splice(e,1);}},{key:"clone",value:function(t){var e,n={id:this.id,context:c._.clone(this.context.$model),isClone:!0};return (e="text"==this.type?new this.constructor(this.text,n):new this.constructor(n)).id=n.id,this.children&&(e.children=this.children),this.graphics&&(e.graphics=this.graphics.clone()),t||(e.id=f.default.createId(e.type)),e}},{key:"heartBeat",value:function(t){var e=this.getStage();e&&(this._heartBeatNum++,e.heartBeat&&e.heartBeat(t));}},{key:"getCurrentWidth",value:function(){return Math.abs(this.context.$model.width*this.context.$model.scaleX)}},{key:"getCurrentHeight",value:function(){return Math.abs(this.context.$model.height*this.context.$model.scaleY)}},{key:"getStage",value:function(){if(this.stage)return this.stage;var t=this;if("stage"!=t.type){for(;t.parent&&"stage"!=(t=t.parent).type;);if("stage"!==t.type)return !1}return this.stage=t}},{key:"localToGlobal",value:function(t,e){t=t||new h.default(0,0);var n=this.getConcatenatedMatrix(e);if(null==n)return (0, h.default)(0,0);var i=new u.default(1,0,0,1,t.x,t.y);return i.concat(n),new h.default(i.tx,i.ty)}},{key:"globalToLocal",value:function(t,e){if(t=t||new h.default(0,0),"stage"==this.type)return t;var n=this.getConcatenatedMatrix(e);if(null==n)return new h.default(0,0);n.invert();var i=new u.default(1,0,0,1,t.x,t.y);return i.concat(n),new h.default(i.tx,i.ty)}},{key:"localToTarget",value:function(t,e){var n=localToGlobal(t);return e.globalToLocal(n)}},{key:"getConcatenatedMatrix",value:function(t){for(var e=new u.default,n=this;null!=n;n=n.parent)if(e.concat(n._transform),!n.parent||t&&n.parent&&n.parent==t||n.parent&&"stage"==n.parent.type)return e;return e}},{key:"setEventEnable",value:function(t){return !!c._.isBoolean(t)&&(this._eventEnabled=t,!0)}},{key:"getIndex",value:function(){if(this.parent)return c._.indexOf(this.parent.children,this)}},{key:"toBack",value:function(t){if(this.parent){var e=this.getIndex(),n=0;if(c._.isNumber(t)){if(0==t)return;n=e-t;}var i=this.parent.children.splice(e,1)[0];n<0&&(n=0),this.parent.addChildAt(i,n);}}},{key:"toFront",value:function(t){if(this.parent){var e=this.getIndex(),n=this.parent.children.length,i=n;if(c._.isNumber(t)){if(0==t)return;i=e+t+1;}var r=this.parent.children.splice(e,1)[0];n<i&&(i=n),this.parent.addChildAt(r,i-1);}}},{key:"_updateTransform",value:function(){var t=new u.default;t.identity();var e=this.context;if(1!==e.scaleX||1!==e.scaleY){var n=new h.default(e.scaleOrigin);t.translate(-n.x,-n.y),t.scale(e.scaleX,e.scaleY),t.translate(n.x,n.y);}var i=e.rotation;if(i&&(n=new h.default(e.rotateOrigin),t.translate(-n.x,-n.y),t.rotate(i%360*Math.PI/180),t.translate(n.x,n.y)),this.xyToInt&&!this.moveing){var r=parseInt(e.x),a=parseInt(e.y);parseInt(e.lineWidth,10)%2==1&&e.strokeStyle&&(r+=.5,a+=.5);}else r=e.x,a=e.y;return 0==r&&0==a||t.translate(r,a),this._transform=t}},{key:"setWorldTransform",value:function(){var t=new u.default;return t.concat(this._transform),this.parent&&t.concat(this.parent.worldTransform),this.worldTransform=t,this.worldTransform}},{key:"getChildInPoint",value:function(t){var e=!1,n=t.x,i=t.y;if(this.worldTransform){var r=this.worldTransform.clone().invert(),a=[n*v.default.RESOLUTION,i*v.default.RESOLUTION];n=(a=r.mulVector(a))[0],i=a[1];}if(this.graphics&&(e=this.containsPoint({x:n,y:i})),"text"!=this.type)return e;var o=this.getRect();return !(!o.width||!o.height)&&(e=n>=o.x&&n<=o.x+o.width&&(0<=o.height&&i>=o.y&&i<=o.y+o.height||o.height<0&&i<=o.y&&i>=o.y+o.height))}},{key:"containsPoint",value:function(t){for(var e=!1,n=0;n<this.graphics.graphicsData.length;++n){var i=this.graphics.graphicsData[n];if(i.shape){if(i.hasFill()&&i.shape.contains(t.x,t.y)&&(e=!0))break;if(i.hasLine()&&i.shape.points&&(e=(0, y.default)(i,t.x,t.y)))break}}return e}},{key:"animate",value:function(t,e,n){if(n=n||this.context){var i=t,r=null;for(var a in i)c._.isObject(i[a])?this.animate(i[a],c._.extend({},e),n[a]):isNaN(i[a])&&""!==i[a]&&null!==i[a]?(n[a]=i[a],delete i[a]):(r=r||{})[a]=n[a];if(r){(e=e||{}).from=r,e.to=i;var o,s=this,l=function(){};e.onUpdate&&(l=e.onUpdate),e.onUpdate=function(t){if(!n&&o)return d.default.destroyTween(o),void(o=null);for(var e in t)n[e]=t[e];l.apply(s,[t]);};var u=function(){};return e.onComplete&&(u=e.onComplete),e.onComplete=function(t){u.apply(s,arguments),s._removeTween(o);},e.onStop=function(){s._removeTween(o);},e.desc="tweenType:DisplayObject.animate__id:"+this.id+"__objectType:"+this.type,o=d.default.registTween(e),this._tweens.push(o),o}}}},{key:"_removeTween",value:function(t){for(var e=0;e<this._tweens.length;e++)if(t==this._tweens[e]){this._tweens.splice(e,1);break}}},{key:"removeAnimate",value:function(t){t.stop(),this._removeTween(t);}},{key:"cleanAnimates",value:function(){this._cleanAnimates();}},{key:"_cleanAnimates",value:function(){for(;this._tweens.length;)this._tweens.shift().stop();}},{key:"remove",value:function(){this.parent&&(this.parent.removeChild(this),this.parent=null);}},{key:"destroy",value:function(){this._destroy();}},{key:"_destroy",value:function(){this.remove(),this.fire("destroy"),this.context=null,delete this.context;}}])&&_(k.prototype,T),I);function I(t){var e;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,I),(e=function(t,e){return !e||"object"!==g(e)&&"function"!=typeof e?b(t):e}(this,x(I).call(this,t)))._transform=null,e.worldTransform=null,e._transformChange=!1,e._heartBeatNum=0,e.stage=null,e.parent=null,e.xyToInt=!("xyToInt"in t)||t.xyToInt,e.moveing=!1,e.clip=null,e.context=e._createContext(t),e.type=t.type||"DisplayObject",e.id=t.id||f.default.createId(e.type),e._trackList=[],e.init.apply(b(e),arguments),e._updateTransform(),e._tweens=[];var n=b(e);return e.on("destroy",function(){n.cleanAnimates();}),e}t.default=C;});
});

unwrapExports(DisplayObject);

var DisplayObjectContainer = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,mmvis,DisplayObject);}(void 0,function(e,i,t){var n;function r(e){return (r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i);}}function o(e,t){return !t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function h(e){return (h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return (u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var d,c,a=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t);}(f,((n=t)&&n.__esModule?n:{default:n}).default),d=f,(c=[{key:"addChild",value:function(e,t){if(e)return -1!=this.getChildIndex(e)?e.parent=this:(e.parent&&e.parent.removeChild(e),void 0===t&&(t=this.children.length),this.children.splice(t,0,e),(e.parent=this).heartBeat&&this.heartBeat({convertType:"children",target:e,src:this}),this._afterAddChild&&this._afterAddChild(e)),e}},{key:"addChildAt",value:function(e,t){return this.addChild(e,t)}},{key:"removeChild",value:function(e){return this.removeChildAt(i._.indexOf(this.children,e))}},{key:"removeChildAt",value:function(e){if(e<0||e>this.children.length-1)return !1;var t=this.children[e];return null!=t&&(t.parent=null),this.children.splice(e,1),this.heartBeat&&this.heartBeat({convertType:"children",target:t,src:this}),this._afterDelChild&&this._afterDelChild(t,e),t}},{key:"removeChildById",value:function(e){for(var t=0,n=this.children.length;t<n;t++)if(this.children[t].id==e)return this.removeChildAt(t);return !1}},{key:"removeAllChildren",value:function(){for(;0<this.children.length;)this.removeChildAt(0);}},{key:"destroy",value:function(){for(var e=0,t=this.children.length;e<t;e++)this.getChildAt(e).destroy(),e--,t--;this._destroy();}},{key:"cleanAnimates",value:function(){for(var e=0,t=this.children.length;e<t;e++)this.getChildAt(e).cleanAnimates();this._cleanAnimates();}},{key:"getChildById",value:function(e,t){if(t)return null;for(var n=0,i=this.children.length;n<i;n++)if(this.children[n].id==e)return this.children[n];return null}},{key:"getChildAt",value:function(e){return e<0||e>this.children.length-1?null:this.children[e]}},{key:"getChildIndex",value:function(e){return i._.indexOf(this.children,e)}},{key:"setChildIndex",value:function(e,t){if(e.parent==this){var n=i._.indexOf(this.children,e);t!=n&&(this.children.splice(n,1),this.children.splice(t,0,e));}}},{key:"getNumChildren",value:function(){return this.children.length}},{key:"getObjectsUnderPoint",value:function(e,t){for(var n=[],i=this.children.length-1;0<=i;i--){var r=this.children[i];if(null!=r&&r.context.$model.visible)if(r instanceof f){if(!r._eventEnabled)continue;if(r.mouseChildren&&0<r.getNumChildren()){var l=r.getObjectsUnderPoint(e);0<l.length&&(n=n.concat(l));}}else{if(!r._eventEnabled&&!r.dragEnabled)continue;if(r.getChildInPoint(e)&&(n.push(r),null!=t&&!isNaN(t)&&n.length==t))return n}}return n}}])&&l(d.prototype,c),f);function f(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),(t=o(this,h(f).call(this,e))).children=[],t.mouseChildren=[],t._eventEnabled=!0,t}e.default=a;});
});

unwrapExports(DisplayObjectContainer);

var Stage = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,DisplayObjectContainer,utils);}(void 0,function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=r(t),i=r(n);function r(e){return e&&e.__esModule?e:{default:e}}function u(e){return (u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o);}}function f(e,t){return !t||"object"!==u(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function c(e){return (c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){return (l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var s,p,d=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t);}(b,o.default),s=b,(p=[{key:"initStage",value:function(e,t,n){this.canvas=e;var o=this.context;o.width=t,o.height=n,o.scaleX=i.default._devicePixelRatio,o.scaleY=i.default._devicePixelRatio,this._isReady=!0;}},{key:"heartBeat",value:function(e){this._isReady&&((e=e||{}).stage=this).parent&&this.parent.heartBeat(e);}}])&&a(s.prototype,p),b);function b(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,b),e.type="stage",(t=f(this,c(b).call(this,e))).canvas=null,t.ctx=null,t.stageRending=!1,t._isReady=!1,t}e.default=d;});
});

unwrapExports(Stage);

var SystemRenderer = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,_const,settings,AnimationFrame,utils,mmvis);}(void 0,function(e,i,t,a,n,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var s=c(t),o=c(a),p=c(n);function c(e){return e&&e.__esModule?e:{default:e}}function u(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}var v,d,f=(v=h,(d=[{key:"startEnter",value:function(){var e=this;e.requestAid||(e.requestAid=o.default.registFrame({id:"enterFrame",task:function(){e.enterFrame.apply(e);}}));}},{key:"enterFrame",value:function(){var e=this;e.requestAid=null,p.default.now=(new Date).getTime(),e._heartBeat&&(this.app.children.length&&e.render(this.app),e._heartBeat=!1,e._preRenderTime=(new Date).getTime());}},{key:"_convertCanvax",value:function(t){r._.each(this.app.children,function(e){e.context[t.name]=t.value;});}},{key:"heartBeat",value:function(e){var a=this;if(e){if("context"==e.convertType){var t=e.stage,n=e.shape;if(e.name,e.value,e.preValue,"canvax"==n.type)a._convertCanvax(e);else if(a.app.convertStages[t.id]||(a.app.convertStages[t.id]={stage:t,convertShapes:{}}),n){if(a.app.convertStages[t.id].convertShapes[n.id])return;a.app.convertStages[t.id].convertShapes[n.id]={shape:n,convertType:e.convertType};}}if("children"==e.convertType){var i=e.target;!(t=e.src.getStage())&&"stage"!=i.type||(t=t||i,a.app.convertStages[t.id]||(a.app.convertStages[t.id]={stage:t,convertShapes:{}}));}e.convertType||(t=e.stage,a.app.convertStages[t.id]||(a.app.convertStages[t.id]={stage:t,convertShapes:{}}));}else r._.each(a.app.children,function(e,t){a.app.convertStages[e.id]={stage:e,convertShapes:{}};});a._heartBeat?a._heartBeat=!0:(a._heartBeat=!0,a.startEnter());}}])&&u(v.prototype,d),h);function h(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:i.RENDERER_TYPE.UNKNOWN,t=1<arguments.length?arguments[1]:void 0,a=2<arguments.length?arguments[2]:void 0;if(!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),this.type=e,this.app=t,a)for(var n in s.default.RENDER_OPTIONS)void 0===a[n]&&(a[n]=s.default.RENDER_OPTIONS[n]);else a=s.default.RENDER_OPTIONS;this.options=a,this.requestAid=null,this._heartBeat=!1,this._preRenderTime=0;}e.default=f;});
});

unwrapExports(SystemRenderer);

var GraphicsRenderer = createCommonjsModule(function (module, exports) {
!function(e,l){l(exports,_const);}(void 0,function(e,T){function l(e,l){for(var t=0;t<l.length;t++){var i=l[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i);}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t,i,r=(t=a,(i=[{key:"render",value:function(e,l,t,i){this.renderer;for(var o=e.graphics.graphicsData,r=l.ctx,a=0;a<o.length;a++){var n=o[a],h=n.shape,s=n.fillStyle,f=n.strokeStyle,p=n.hasFill()&&n.fillAlpha&&!i,c=n.hasLine()&&n.strokeAlpha&&!i;if(r.lineWidth=n.lineWidth,n.type===T.SHAPES.POLY)r.beginPath(),this.renderPolygon(h.points,h.closed,r,i),p&&(r.globalAlpha=n.fillAlpha*t,r.fillStyle=s,r.fill()),c&&(r.globalAlpha=n.strokeAlpha*t,r.strokeStyle=f,r.stroke());else if(n.type===T.SHAPES.RECT)i&&r.rect(h.x,h.y,h.width,h.height),p&&(r.globalAlpha=n.fillAlpha*t,r.fillStyle=s,r.fillRect(h.x,h.y,h.width,h.height)),c&&(r.globalAlpha=n.strokeAlpha*t,r.strokeStyle=f,r.strokeRect(h.x,h.y,h.width,h.height));else if(n.type===T.SHAPES.CIRC)r.beginPath(),r.arc(h.x,h.y,h.radius,0,2*Math.PI),r.closePath(),p&&(r.globalAlpha=n.fillAlpha*t,r.fillStyle=s,r.fill()),c&&(r.globalAlpha=n.strokeAlpha*t,r.strokeStyle=f,r.stroke());else if(n.type===T.SHAPES.ELIP){var y=2*h.width,d=2*h.height,u=h.x-y/2,g=h.y-d/2;r.beginPath();var v=.5522848,A=y/2*v,b=d/2*v,S=u+y,k=g+d,P=u+y/2,x=g+d/2;r.moveTo(u,x),r.bezierCurveTo(u,x-b,P-A,g,P,g),r.bezierCurveTo(P+A,g,S,x-b,S,x),r.bezierCurveTo(S,x+b,P+A,k,P,k),r.bezierCurveTo(P-A,k,u,x+b,u,x),r.closePath(),p&&(r.globalAlpha=n.fillAlpha*t,r.fillStyle=s,r.fill()),c&&(r.globalAlpha=n.strokeAlpha*t,r.strokeStyle=f,r.stroke());}}}},{key:"renderPolygon",value:function(e,l,t,i){t.moveTo(e[0],e[1]);for(var o=1;o<e.length/2;++o)t.lineTo(e[2*o],e[2*o+1]);(l||i)&&t.closePath();}}])&&l(t.prototype,i),a);function a(e){!function(e,l){if(!(e instanceof l))throw new TypeError("Cannot call a class as a function")}(this,a),this.renderer=e;}e.default=r;});
});

unwrapExports(GraphicsRenderer);

var CanvasRenderer = createCommonjsModule(function (module, exports) {
!function(e,r){r(exports,SystemRenderer,_const,GraphicsRenderer,mmvis);}(void 0,function(e,r,n,t,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=s(r),i=s(t);function s(e){return e&&e.__esModule?e:{default:e}}function f(e){return (f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function l(e){return (l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e,r){return (p=Object.setPrototypeOf||function(e,r){return e.__proto__=r,e})(e,r)}var d,h,m=(function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),r&&p(e,r);}(g,a.default),d=g,(h=[{key:"render",value:function(e){var r=this;r.app=e,o._.each(o._.values(e.convertStages),function(e){r.renderStage(e.stage);}),e.convertStages={};}},{key:"renderStage",value:function(e){e.ctx||(e.ctx=e.canvas.getContext("2d")),e.stageRending=!0,e.setWorldTransform(),this._clear(e),this._render(e,e,e.context.globalAlpha),e.stageRending=!1;}},{key:"_render",value:function(e,r,t){var n=e.ctx;if(n){var o=r.context.$model;if(r.worldTransform||r.fire("render"),(!r.worldTransform||r._transformChange||r.parent&&r.parent._transformChange)&&(r.setWorldTransform(),r.fire("transform"),r._transformChange=!0),t*=o.globalAlpha,o.visible&&!r.isClip){var a=r.worldTransform.toArray();if(a){n.setTransform.apply(n,a);var i=!1;if(r.clip&&r.clip.graphics){var s=r.clip;n.save(),i=!0,s.worldTransform&&!s._transformChange&&!s.parent._transformChange||(s.setWorldTransform(),s._transformChange=!0),n.setTransform.apply(n,s.worldTransform.toArray()),s.graphics.graphicsData.length||s._draw(s.graphics),this.CGR.render(s,e,t,i),s._transformChange=!1,n.clip();}if(r.graphics&&(r.graphics.graphicsData.length||r._draw(r.graphics),t&&(n.setLineDash([]),o.lineType&&"solid"!=o.lineType&&n.setLineDash(o.lineDash),this.CGR.render(r,e,t))),"text"==r.type&&r.render(n,t),r.children)for(var f=0,c=r.children.length;f<c;f++)this._render(e,r.children[f],t);r._transformChange=!1,i&&n.restore();}}}}},{key:"_clear",value:function(e){var r=e.ctx;r.setTransform.apply(r,e.worldTransform.toArray()),r.clearRect(0,0,this.app.width,this.app.height);}}])&&c(d.prototype,h),g);function g(e){var r,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,g),(r=function(e,r){return !r||"object"!==f(r)&&"function"!=typeof r?u(e):r}(this,l(g).call(this,n.RENDERER_TYPE.CANVAS,e,t))).CGR=new i.default(u(r)),r}e.default=m;});
});

unwrapExports(CanvasRenderer);

var autoRenderer = createCommonjsModule(function (module, exports) {
!function(e,n){n(exports,CanvasRenderer);}(void 0,function(e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,n){return new r.default(e,n)};var d,r=(d=n)&&d.__esModule?d:{default:d};});
});

unwrapExports(autoRenderer);

var Application = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,utils,DisplayObjectContainer,Stage,autoRenderer,Matrix,mmvis);}(void 0,function(e,t,i,n,r,h,a){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=u(t),s=u(i),l=u(n),d=u(r),f=u(h);function u(e){return e&&e.__esModule?e:{default:e}}function c(e){return (c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function g(e){return (g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function y(e,t){return (y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var p,m,x=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t);}(_,s.default),p=_,(m=[{key:"registEvent",value:function(e){return this.event=new a.event.Handler(this,e),this.event.init(),this.event}},{key:"destroy",value:function(){for(var e=0,t=this.children.length;e<t;e++){var i=this.children[e];i.destroy(),i.canvas=null,i.ctx=null,i=null,e--,t--;}try{this.view.removeChild(this.stageView),this.view.removeChild(this.domView),this.el.removeChild(this.view);}catch(e){}this.el.innerHTML="",this.event=null,this._bufferStage=null;}},{key:"resize",value:function(e){this.width=parseInt(e&&"width"in e||this.el.offsetWidth,10),this.height=parseInt(e&&"height"in e||this.el.offsetHeight,10),this.viewOffset=a.$.offset(this.view),this.context.$model.width=this.width,this.context.$model.height=this.height;var i=this;a._.each(this.children,function(e,t){e.context.$model.width=i.width,e.context.$model.height=i.height,function(e){e.style.width=i.width+"px",e.style.height=i.height+"px",e.setAttribute("width",i.width*o.default._devicePixelRatio),e.setAttribute("height",i.height*o.default._devicePixelRatio);}(e.canvas);}),this.stageView.style.width=this.width+"px",this.stageView.style.height=this.height+"px",this.domView.style.width=this.width+"px",this.domView.style.height=this.height+"px",this.heartBeat();}},{key:"getHoverStage",value:function(){return this._bufferStage}},{key:"_creatHoverStage",value:function(){this._bufferStage=new l.default({id:"activCanvas"+(new Date).getTime(),context:{width:this.context.$model.width,height:this.context.$model.height}}),this._bufferStage._eventEnabled=!1,this.addChild(this._bufferStage);}},{key:"updateViewOffset",value:function(){var e=(new Date).getTime();1e3<e-this.lastGetRO&&(this.viewOffset=a.$.offset(this.view),this.lastGetRO=e);}},{key:"_afterAddChild",value:function(e,t){var i;i=e.canvas?e.canvas:a.$.createCanvas(this.context.$model.width,this.context.$model.height,e.id),1==this.children.length?this.stageView.appendChild(i):1<this.children.length&&(void 0===t?this.stageView.insertBefore(i,this._bufferStage.canvas):t>=this.children.length-1?this.stageView.appendChild(i):this.stageView.insertBefore(i,this.children[t].canvas)),o.default.initElement(i),e.initStage(i,this.context.$model.width,this.context.$model.height);}},{key:"_afterDelChild",value:function(e){try{this.stageView.removeChild(e.canvas);}catch(e){}}},{key:"heartBeat",value:function(e){0<this.children.length&&this.renderer.heartBeat(e);}},{key:"toDataURL",value:function(){var e=a.$.createCanvas(this.width,this.height,"curr_base64_canvas"),t=e.getContext("2d");return a._.each(this.children,function(e){t.drawImage(e.canvas,0,0);}),e.toDataURL()}}])&&v(p.prototype,m),_);function _(e){var t,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,_),e.type="canvax",(t=function(e,t){return !t||"object"!==c(t)&&"function"!=typeof t?w(e):t}(this,g(_).call(this,e)))._cid=(new Date).getTime()+"_"+Math.floor(100*Math.random()),t.el=a.$.query(e.el),t.width=parseInt("width"in e||t.el.offsetWidth,10),t.height=parseInt("height"in e||t.el.offsetHeight,10);var n=a.$.createView(t.width,t.height,t._cid);return t.view=n.view,t.stageView=n.stageView,t.domView=n.domView,t.el.innerHTML="",t.el.appendChild(t.view),t.viewOffset=a.$.offset(t.view),t.lastGetRO=0,t.webGL=e.webGL,t.renderer=(0, d.default)(w(t),i),t.event=null,t.convertStages={},t.context.$model.width=t.width,t.context.$model.height=t.height,t._bufferStage=null,t._creatHoverStage(),t.worldTransform=(new f.default).identity(),t}e.default=x;});
});

unwrapExports(Application);

var Sprite = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,DisplayObjectContainer,utils);}(void 0,function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(t),r=i(n);function i(e){return e&&e.__esModule?e:{default:e}}function u(e){return (u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){return !t||"object"!==u(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function c(e){return (c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){return (l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var p=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t);}(s,o.default),s);function s(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),(e=r.default.checkOpt(e)).type="sprite",f(this,c(s).call(this,e))}e.default=p;});
});

unwrapExports(Sprite);

var GraphicsData = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports);}(0,function(e){function t(e,t){for(var i=0;i<t.length;i++){var l=t[i];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l);}}Object.defineProperty(e,"__esModule",{value:!0});var i,l,n=(i=h,(l=[{key:"clone",value:function(){var e=new h(this.lineWidth,this.strokeStyle,this.strokeAlpha,this.fillStyle,this.fillAlpha,this.shape);return e.fill=this.fill,e.line=this.line,e}},{key:"addHole",value:function(e){this.holes.push(e);}},{key:"synsStyle",value:function(e){this.line&&(this.lineWidth=e.lineWidth,this.strokeStyle=e.strokeStyle,this.strokeAlpha=e.strokeAlpha),this.fill&&(this.fillStyle=e.fillStyle,this.fillAlpha=e.fillAlpha);}},{key:"hasFill",value:function(){return this.fillStyle&&this.fill&&void 0!==this.shape.closed&&this.shape.closed}},{key:"hasLine",value:function(){return this.strokeStyle&&this.lineWidth&&this.line}},{key:"destroy",value:function(){this.shape=null,this.holes=null;}}])&&t(i.prototype,l),h);function h(e,t,i,l,s,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),this.lineWidth=e,this.strokeStyle=t,this.strokeAlpha=i,this.fillStyle=l,this.fillAlpha=s,this.shape=n,this.type=n.type,this.holes=[],this.fill=!0,this.line=!0;}e.default=n;});
});

unwrapExports(GraphicsData);

var Arc = createCommonjsModule(function (module, exports) {
!function(t,a){a(exports);}(0,function(t){Object.defineProperty(t,"__esModule",{value:!0});var D={},q={},_={},E=Array.prototype.join;function y(t,a,r,n,e,u,i){var f=E.call(arguments);if(D[f])return D[f];var s=Math.PI,o=i*s/180,h=Math.sin(o),l=Math.cos(o),M=0,p=0,c=-l*t*.5-h*a*.5,v=-l*a*.5+h*t*.5,y=(r=Math.abs(r))*r,d=(n=Math.abs(n))*n,x=v*v,b=c*c,g=y*d-y*x-d*b,m=0;if(g<0){var q=Math.sqrt(1-g/(y*d));r*=q,n*=q;}else m=(e===u?-1:1)*Math.sqrt(g/(y*x+d*b));var A=m*r*v/n,O=-m*n*c/r,P=l*A-h*O+.5*t,j=h*A+l*O+.5*a,B=G(1,0,(c-A)/r,(v-O)/n),C=G((c-A)/r,(v-O)/n,(-c-A)/r,(-v-O)/n);0===u&&0<C?C-=2*s:1===u&&C<0&&(C+=2*s);for(var I=Math.ceil(Math.abs(C/s*2)),_=[],w=C/I,z=8/3*Math.sin(w/4)*Math.sin(w/4)/Math.sin(w/2),T=B+w,k=0;k<I;k++)_[k]=F(B,T,l,h,r,n,P,j,z,M,p),M=_[k][4],p=_[k][5],B=T,T+=w;return D[f]=_}function F(t,a,r,n,e,u,i,f,s,o,h){var l=E.call(arguments);if(q[l])return q[l];var M=Math.cos(t),p=Math.sin(t),c=Math.cos(a),v=Math.sin(a),y=r*e*c-n*u*v+i,d=n*e*c+r*u*v+f,x=o+s*(-r*e*p-n*u*M),b=h+s*(-n*e*p+r*u*M),g=y+s*(r*e*v+n*u*c),m=d+s*(n*e*v-r*u*c);return q[l]=[x,b,g,m,y,d],q[l]}function G(t,a,r,n){var e=Math.atan2(a,t),u=Math.atan2(n,r);return e<=u?u-e:2*Math.PI-(e-u)}function d(t,a,r,n,e,u,i,f){var s=E.call(arguments);if(_[s])return _[s];var o,h,l,M,p,c,v,y,d=Math.sqrt,x=Math.min,b=Math.max,g=Math.abs,m=[],q=[[],[]];h=6*t-12*r+6*e,o=-3*t+9*r-9*e+3*i,l=3*r-3*t;for(var A=0;A<2;++A)if(0<A&&(h=6*a-12*n+6*u,o=-3*a+9*n-9*u+3*f,l=3*n-3*a),g(o)<1e-12){if(g(h)<1e-12)continue;0<(M=-l/h)&&M<1&&m.push(M);}else(v=h*h-4*l*o)<0||(0<(p=(-h+(y=d(v)))/(2*o))&&p<1&&m.push(p),0<(c=(-h-y)/(2*o))&&c<1&&m.push(c));for(var O,P,j,B=m.length,C=B;B--;)O=(j=1-(M=m[B]))*j*j*t+3*j*j*M*r+3*j*M*M*e+M*M*M*i,q[0][B]=O,P=j*j*j*a+3*j*j*M*n+3*j*M*M*u+M*M*M*f,q[1][B]=P;q[0][C]=t,q[1][C]=a,q[0][C+1]=i,q[1][C+1]=f;var I=[{x:x.apply(null,q[0]),y:x.apply(null,q[1])},{x:b.apply(null,q[0]),y:b.apply(null,q[1])}];return _[s]=I}t.default={drawArc:function(t,a,r,n){for(var e=n[0],u=n[1],i=n[2],f=n[3],s=n[4],o=[[],[],[],[]],h=y(n[5]-a,n[6]-r,e,u,f,s,i),l=0,M=h.length;l<M;l++)o[l][0]=h[l][0]+a,o[l][1]=h[l][1]+r,o[l][2]=h[l][2]+a,o[l][3]=h[l][3]+r,o[l][4]=h[l][4]+a,o[l][5]=h[l][5]+r,t.bezierCurveTo.apply(t,o[l]);},getBoundsOfCurve:d,getBoundsOfArc:function(t,a,r,n,e,u,i,f,s){for(var o,h=0,l=0,M=[],p=y(f-t,s-a,r,n,u,i,e),c=0,v=p.length;c<v;c++)o=d(h,l,p[c][0],p[c][1],p[c][2],p[c][3],p[c][4],p[c][5]),M.push({x:o[0].x+t,y:o[0].y+a}),M.push({x:o[1].x+t,y:o[1].y+a}),h=p[c][4],l=p[c][5];return M}};});
});

unwrapExports(Arc);

var Rectangle = createCommonjsModule(function (module, exports) {
!function(t,i){i(exports,_const);}(void 0,function(t,n){function i(t,i){for(var e=0;e<i.length;e++){var h=i[e];h.enumerable=h.enumerable||!1,h.configurable=!0,"value"in h&&(h.writable=!0),Object.defineProperty(t,h.key,h);}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e,h,o=(e=r,(h=[{key:"clone",value:function(){return new r(this.x,this.y,this.width,this.height)}},{key:"copy",value:function(t){return this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this}},{key:"contains",value:function(t,i){return !(this.height*i<0||this.width*t<0)&&t>=this.x&&t<=this.x+this.width&&(0<=this.height&&i>=this.y&&i<=this.y+this.height||this.height<0&&i<=this.y&&i>=this.y+this.height)}}])&&i(e.prototype,h),r);function r(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,h=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,r),this.x=t,this.y=i,this.width=e,this.height=h,this.type=n.SHAPES.RECT,this.closed=!0;}t.default=o;});
});

unwrapExports(Rectangle);

var Circle = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Rectangle,_const);}(void 0,function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i,s=(i=t)&&i.__esModule?i:{default:i};function r(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}var u,a,d=(u=f,(a=[{key:"clone",value:function(){return new f(this.x,this.y,this.radius)}},{key:"contains",value:function(e,t){if(this.radius<=0)return !1;var i=this.radius*this.radius,n=this.x-e,s=this.y-t;return (n*=n)+(s*=s)<=i}},{key:"getBounds",value:function(){return new s.default(this.x-this.radius,this.y-this.radius,2*this.radius,2*this.radius)}}])&&r(u.prototype,a),f);function f(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),this.x=e,this.y=t,this.radius=i,this.type=n.SHAPES.CIRC,this.closed=!0;}e.default=d;});
});

unwrapExports(Circle);

var Ellipse = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Rectangle,_const);}(void 0,function(e,t,h){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i,n=(i=t)&&i.__esModule?i:{default:i};function s(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}var o,r,a=(o=d,(r=[{key:"clone",value:function(){return new d(this.x,this.y,this.width,this.height)}},{key:"contains",value:function(e,t){if(this.width<=0||this.height<=0)return !1;var i=(e-this.x)/this.width,n=(t-this.y)/this.height;return (i*=i)+(n*=n)<=1}},{key:"getBounds",value:function(){return new n.default(this.x-this.width,this.y-this.height,this.width,this.height)}}])&&s(o.prototype,r),d);function d(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,d),this.x=e,this.y=t,this.width=i,this.height=n,this.type=h.SHAPES.ELIP,this.closed=!0;}e.default=a;});
});

unwrapExports(Ellipse);

var Polygon = createCommonjsModule(function (module, exports) {
!function(e,n){n(exports,_const);}(void 0,function(e,a){function n(e,n){for(var i=0;i<n.length;i++){var t=n[i];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t);}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i,t,r=(i=u,(t=[{key:"clone",value:function(){return new u(this.points.slice())}},{key:"close",value:function(){var e=this.points;e[0]===e[e.length-2]&&e[1]===e[e.length-1]||e.push(e[0],e[1]),this.closed=!0;}},{key:"contains",value:function(e,n){return this._isInsidePolygon_WindingNumber(e,n)}},{key:"_isInsidePolygon_WindingNumber",value:function(e,n){for(var i,t=this.points,o=0,r=t[1]>n,s=3;s<t.length;s+=2)if((i=r)!=(r=t[s]>n)){var a=(i?1:0)-(r?1:0);0<a*((t[s-3]-e)*(t[s-0]-n)-(t[s-2]-n)*(t[s-1]-e))&&(o+=a);}return o}}])&&n(i.prototype,t),u);function u(){for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,u);var t=n[0];if(Array.isArray(t)&&(n=t),t&&"x"in t&&"y"in t){for(var o=[],r=0,s=n.length;r<s;r++)o.push(n[r].x,n[r].y);n=o;}this.closed=!0,this.points=n,this.type=a.SHAPES.POLY;}e.default=r;});
});

unwrapExports(Polygon);

var math = createCommonjsModule(function (module, exports) {
!function(e,r){r(exports,Arc,Circle,Ellipse,Polygon,Rectangle);}(void 0,function(e,r,n,t,i,u){function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"Arc",{enumerable:!0,get:function(){return l(r).default}}),Object.defineProperty(e,"Circle",{enumerable:!0,get:function(){return l(n).default}}),Object.defineProperty(e,"Ellipse",{enumerable:!0,get:function(){return l(t).default}}),Object.defineProperty(e,"Polygon",{enumerable:!0,get:function(){return l(i).default}}),Object.defineProperty(e,"Rectangle",{enumerable:!0,get:function(){return l(u).default}});});
});

unwrapExports(math);

var bezierCurveTo = createCommonjsModule(function (module, exports) {
!function(e,n){n(exports);}(0,function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,n,f,t,i,o,d,u){var r=8<arguments.length&&void 0!==arguments[8]?arguments[8]:[],s=0,p=0,a=0,c=0,l=0;r.push(e,n);for(var v=1,h=0;v<=20;++v)a=(p=(s=1-(h=v/20))*s)*s,l=(c=h*h)*h,r.push(a*e+3*p*h*f+3*s*c*i+l*d,a*n+3*p*h*t+3*s*c*o+l*u);return r};});
});

unwrapExports(bezierCurveTo);

var Graphics = createCommonjsModule(function (module, exports) {
!function(t,e){e(exports,GraphicsData,math,_const,bezierCurveTo,mmvis);}(void 0,function(t,e,r,D,h,i){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=s(e),u=s(h);function s(t){return t&&t.__esModule?t:{default:t}}function n(t,e){for(var h=0;h<e.length;h++){var i=e[h];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}var l,o,p=(l=d,(o=[{key:"setStyle",value:function(t){var e=t.$model;this.lineWidth=e.lineWidth,this.strokeStyle=e.strokeStyle,this.strokeAlpha=e.strokeAlpha*e.globalAlpha,this.fillStyle=e.fillStyle,this.fillAlpha=e.fillAlpha*e.globalAlpha;var h=this;this.graphicsData.length&&i._.each(this.graphicsData,function(t,e){t.synsStyle(h);});}},{key:"clone",value:function(){for(var t=new d,e=t.dirty=0;e<this.graphicsData.length;++e)t.graphicsData.push(this.graphicsData[e].clone());return t.currentPath=t.graphicsData[t.graphicsData.length-1],t}},{key:"moveTo",value:function(t,e){var h=new r.Polygon([t,e]);return h.closed=!1,this.drawShape(h),this}},{key:"lineTo",value:function(t,e){return this.currentPath?(this.currentPath.shape.points.push(t,e),this.dirty++):this.moveTo(0,0),this}},{key:"quadraticCurveTo",value:function(t,e,h,i){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var a=this.currentPath.shape.points,r=0,s=0;0===a.length&&this.moveTo(0,0);for(var n=a[a.length-2],l=a[a.length-1],u=1;u<=20;++u){var o=u/20;r=n+(t-n)*o,s=l+(e-l)*o,a.push(r+(t+(h-t)*o-r)*o,s+(e+(i-e)*o-s)*o);}return this.dirty++,this}},{key:"bezierCurveTo",value:function(t,e,h,i,a,r){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var s=this.currentPath.shape.points,n=s[s.length-2],l=s[s.length-1];return s.length-=2,(0, u.default)(n,l,t,e,h,i,a,r,s),this.dirty++,this}},{key:"arcTo",value:function(t,e,h,i,a){this.currentPath?0===this.currentPath.shape.points.length&&this.currentPath.shape.points.push(t,e):this.moveTo(t,e);var r=this.currentPath.shape.points,s=r[r.length-2],n=r[r.length-1]-e,l=s-t,u=i-e,o=h-t,c=Math.abs(n*o-l*u);if(c<1e-8||0===a)r[r.length-2]===t&&r[r.length-1]===e||r.push(t,e);else{var p=n*n+l*l,d=u*u+o*o,f=n*u+l*o,v=a*Math.sqrt(p)/c,y=a*Math.sqrt(d)/c,g=v*f/p,P=y*f/d,w=v*o+y*l,k=v*u+y*n,S=l*(y+g),b=n*(y+g),D=o*(v+P),M=u*(v+P),m=Math.atan2(b-k,S-w),A=Math.atan2(M-k,D-w);this.arc(w+t,k+e,a,m,A,o*n<l*u);}return this.dirty++,this}},{key:"arc",value:function(t,e,h,i,a,r){var s=5<arguments.length&&void 0!==r&&r;if(i===a)return this;!s&&a<=i?a+=2*Math.PI:s&&i<=a&&(i+=2*Math.PI);var n=a-i,l=48*Math.ceil(Math.abs(n)/(2*Math.PI));if(0==n)return this;var u=t+Math.cos(i)*h,o=e+Math.sin(i)*h,c=this.currentPath?this.currentPath.shape.points:null;c?c[c.length-2]===u&&c[c.length-1]===o||c.push(u,o):(this.moveTo(u,o),c=this.currentPath.shape.points);for(var p=n/(2*l),d=2*p,f=Math.cos(p),v=Math.sin(p),y=l-1,g=y%1/y,P=0;P<=y;++P){var w=p+i+d*(P+g*P),k=Math.cos(w),S=-Math.sin(w);c.push((f*k+v*S)*h+t,(f*-S+v*k)*h+e);}return this.dirty++,this}},{key:"drawRect",value:function(t,e,h,i){return this.drawShape(new r.Rectangle(t,e,h,i)),this}},{key:"drawCircle",value:function(t,e,h){return this.drawShape(new r.Circle(t,e,h)),this}},{key:"drawEllipse",value:function(t,e,h,i){return this.drawShape(new r.Ellipse(t,e,h,i)),this}},{key:"drawPolygon",value:function(t){var e=t,h=!0;if(e instanceof r.Polygon&&(h=e.closed,e=e.points),!Array.isArray(e)){e=new Array(arguments.length);for(var i=0;i<e.length;++i)e[i]=arguments[i];}var a=new r.Polygon(e);return a.closed=h,this.drawShape(a),this}},{key:"clear",value:function(){return 0<this.graphicsData.length&&(this.dirty++,this.clearDirty++,this.graphicsData.length=0),this.currentPath=null,this}},{key:"drawShape",value:function(t){this.currentPath&&this.currentPath.shape.points.length<=2&&this.graphicsData.pop(),this.beginPath();var e=new a.default(this.lineWidth,this.strokeStyle,this.strokeAlpha,this.fillStyle,this.fillAlpha,t);return this.graphicsData.push(e),e.type===D.SHAPES.POLY&&(e.shape.closed=e.shape.closed,this.currentPath=e),this.dirty++,e}},{key:"beginPath",value:function(){this.currentPath=null;}},{key:"closePath",value:function(){var t=this.currentPath;return t&&t.shape&&t.shape.close(),this}},{key:"updateLocalBounds",value:function(){var t=1/0,e=-1/0,h=1/0,i=-1/0;if(this.graphicsData.length)for(var a=0,r=0,s=0,n=0,l=0,u=0;u<this.graphicsData.length;u++){var o=this.graphicsData[u],c=o.type,p=o.lineWidth;if(a=o.shape,c===D.SHAPES.RECT||c===D.SHAPES.RREC)r=a.x-p/2,s=a.y-p/2,t=r<t?r:t,e=e<r+(n=a.width+p)?r+n:e,h=s<h?s:h,i=i<s+(l=a.height+p)?s+l:i;else if(c===D.SHAPES.CIRC)r=a.x,s=a.y,t=r-(n=a.radius+p/2)<t?r-n:t,e=e<r+n?r+n:e,h=s-(l=a.radius+p/2)<h?s-l:h,i=i<s+l?s+l:i;else if(c===D.SHAPES.ELIP)r=a.x,s=a.y,t=r-(n=a.width+p/2)<t?r-n:t,e=e<r+n?r+n:e,h=s-(l=a.height+p/2)<h?s-l:h,i=i<s+l?s+l:i;else for(var d=a.points,f=0,v=0,y=0,g=0,P=0,w=0,k=0,S=0,b=0;b+2<d.length;b+=2)r=d[b],s=d[b+1],f=d[b+2],v=d[b+3],y=Math.abs(f-r),g=Math.abs(v-s),l=p,(n=Math.sqrt(y*y+g*g))<1e-9||(t=(k=(f+r)/2)-(P=(l/n*g+y)/2)<t?k-P:t,e=e<k+P?k+P:e,h=(S=(v+s)/2)-(w=(l/n*y+g)/2)<h?S-w:h,i=i<S+w?S+w:i);}else i=h=e=t=0;return this.Bound={x:t,y:h,width:e-t,height:i-h},this}},{key:"getBound",value:function(){return this.updateLocalBounds().Bound}},{key:"destroy",value:function(){for(var t=0;t<this.graphicsData.length;++t)this.graphicsData[t].destroy();for(var e in this._webGL)for(var h=0;h<this._webGL[e].data.length;++h)this._webGL[e].data[h].destroy();this.graphicsData=null,this.currentPath=null,this._webGL=null;}}])&&n(l.prototype,o),d);function d(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,d),this.lineWidth=1,this.strokeStyle=null,this.strokeAlpha=1,this.fillStyle=null,this.fillAlpha=1,this.graphicsData=[],this.currentPath=null,this.dirty=0,this.clearDirty=0,this._webGL={},this.worldAlpha=1,this.tint=16777215,this.Bound={x:0,y:0,width:0,height:0};}t.default=p;});
});

unwrapExports(Graphics);

var Shape = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,DisplayObject,utils,mmvis,_const,Graphics);}(void 0,function(e,t,n,i,o,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var l=a(t),c=a(n),u=a(r);function a(e){return e&&e.__esModule?e:{default:e}}function s(e){return (s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o);}}function p(e,t){return !t||"object"!==s(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function d(e){return (d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e,t){return (y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var h,b,x=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t);}(m,l.default),h=m,(b=[{key:"_draw",value:function(e){0==e.graphicsData.length&&(e.setStyle(this.context),this.draw(e));}},{key:"draw",value:function(){}},{key:"clearGraphicsData",value:function(){this.graphics.clear();}},{key:"$watch",value:function(e,t,n){-1<i._.indexOf(o.STYLE_PROPS,e)&&this.graphics.setStyle(this.context),this.watch(e,t,n);}},{key:"initCompProperty",value:function(e){for(var t in e)"id"!=t&&"context"!=t&&(this[t]=e[t]);}},{key:"getBound",value:function(){return this.graphics.updateLocalBounds().Bound}}])&&f(h.prototype,b),m);function m(e){var t;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m);var n={cursor:(e=c.default.checkOpt(e)).context.cursor||"default",fillAlpha:e.context.fillAlpha||1,fillStyle:e.context.fillStyle||null,lineCap:e.context.lineCap||"round",lineJoin:e.context.lineJoin||"round",miterLimit:e.context.miterLimit||null,strokeAlpha:e.context.strokeAlpha||1,strokeStyle:e.context.strokeStyle||null,lineType:e.context.lineType||"solid",lineDash:e.context.lineDash||[6,3],lineWidth:e.context.lineWidth||null},o=i._.extend(!0,n,e.context);return e.context=o,void 0===e.id&&void 0!==e.type&&(e.id=c.default.createId(e.type)),(t=p(this,d(m).call(this,e)))._hoverClass=!1,t.hoverClone=!0,t.pointChkPriority=!0,t._eventEnabled=!1,t.dragEnabled=e.dragEnabled||!1,t._dragDuplicate=null,t.type=t.type||"shape",t.initCompProperty(e),t.isClone?t.graphics=null:(t.graphics=new u.default,t._draw(t.graphics)),t}e.default=x;});
});

unwrapExports(Shape);

var Text = createCommonjsModule(function (module, exports) {
!function(t,e){e(exports,DisplayObject,utils,mmvis);}(void 0,function(t,e,n,o){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=s(e),r=s(n);function s(t){return t&&t.__esModule?t:{default:t}}function l(t){return (l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}function a(t,e){return !e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function u(t){return (u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,e){return (f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var c,x,g=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e);}(y,i.default),c=y,(x=[{key:"$watch",value:function(t,e){0<=o._.indexOf(this.fontProperts,t)&&(this.context[t]=e,this.context.font=this._getFontDeclaration(),this.context.width=this.getTextWidth(),this.context.height=this.getTextHeight());}},{key:"_setContextStyle",value:function(t,e,n){for(var i in e)"textBaseline"!=i&&i in t&&(e[i]||o._.isNumber(e[i]))&&("globalAlpha"==i?t.globalAlpha=n:t[i]=e[i]);}},{key:"render",value:function(t,e){this._renderText(t,this._getTextLines(),e);}},{key:"resetText",value:function(t){this.text=t.toString(),this.heartBeat();}},{key:"getTextWidth",value:function(){var t=0;return r.default._pixelCtx&&(r.default._pixelCtx.save(),r.default._pixelCtx.font=this.context.$model.font,t=this._getTextWidth(r.default._pixelCtx,this._getTextLines()),r.default._pixelCtx.restore()),t}},{key:"getTextHeight",value:function(){return this._getTextHeight(r.default._pixelCtx,this._getTextLines())}},{key:"_getTextLines",value:function(){return this.text.split(this._reNewline)}},{key:"_renderText",value:function(t,e,n){t&&(t.save(),this._setContextStyle(t,this.context.$model,n),this._renderTextStroke(t,e),this._renderTextFill(t,e),t.restore());}},{key:"_getFontDeclaration",value:function(){var n=this,i=[];return o._.each(this.fontProperts,function(t){var e=n.context[t];"fontSize"==t&&(e=parseFloat(e)+"px"),e&&i.push(e);}),i.join(" ")}},{key:"_renderTextFill",value:function(t,e){if(this.context.$model.fillStyle){this._boundaries=[];for(var n=0,i=0,o=e.length;i<o;i++)n+=this._getHeightOfLine(t,i,e),this._renderTextLine("fillText",t,e[i],0,this._getTopOffset()+n,i);}}},{key:"_renderTextStroke",value:function(t,e){if(t&&this.context.$model.strokeStyle&&this.context.$model.lineWidth){var n=0;t.save(),this.strokeDashArray&&(1&this.strokeDashArray.length&&this.strokeDashArray.push.apply(this.strokeDashArray,this.strokeDashArray),supportsLineDash&&t.setLineDash(this.strokeDashArray)),t.beginPath();for(var i=0,o=e.length;i<o;i++)n+=this._getHeightOfLine(t,i,e),this._renderTextLine("strokeText",t,e[i],0,this._getTopOffset()+n,i);t.closePath(),t.restore();}}},{key:"_renderTextLine",value:function(t,e,n,i,o,r){if(o-=this._getHeightOfLine()/4,"justify"===this.context.$model.textAlign){var s=e.measureText(n).width,l=this.context.$model.width;if(s<l)for(var h=n.split(/\s+/),a=(l-e.measureText(n.replace(/\s+/g,"")).width)/(h.length-1),u=0,f=0,c=h.length;f<c;f++)this._renderChars(t,e,h[f],i+u,o,r),u+=e.measureText(h[f]).width+a;else this._renderChars(t,e,n,i,o,r);}else this._renderChars(t,e,n,i,o,r);}},{key:"_renderChars",value:function(t,e,n,i,o){e[t](n,0,o);}},{key:"_getHeightOfLine",value:function(){return this.context.$model.fontSize*this.context.$model.lineHeight}},{key:"_getTextWidth",value:function(t,e){for(var n=t.measureText(e[0]||"|").width,i=1,o=e.length;i<o;i++){var r=t.measureText(e[i]).width;n<r&&(n=r);}return n}},{key:"_getTextHeight",value:function(t,e){return this.context.$model.fontSize*e.length*this.context.$model.lineHeight}},{key:"_getTopOffset",value:function(){var t=0;switch(this.context.$model.textBaseline){case"top":t=0;break;case"middle":t=-this.context.$model.height/2;break;case"bottom":t=-this.context.$model.height;}return t}},{key:"getRect",value:function(){var t=this.context,e=0,n=0;return "center"==t.textAlign&&(e=-t.width/2),"right"==t.textAlign&&(e=-t.width),"middle"==t.textBaseline&&(n=-t.height/2),"bottom"==t.textBaseline&&(n=-t.height),{x:e,y:n,width:t.width,height:t.height}}}])&&h(c.prototype,x),y);function y(t,e){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,y),e.type="text",null==t&&(t=""),e.context=o._.extend({font:"",fontSize:13,fontWeight:"normal",fontFamily:"微软雅黑,sans-serif",textBaseline:"top",textAlign:"left",textDecoration:null,fillStyle:"blank",strokeStyle:null,lineWidth:0,lineHeight:1.2,backgroundColor:null,textBackgroundColor:null},e.context),(n=a(this,u(y).call(this,e)))._reNewline=/\r?\n/,n.fontProperts=["fontStyle","fontVariant","fontWeight","fontSize","fontFamily"],n.context.font=n._getFontDeclaration(),n.text=t.toString(),n.context.width=n.getTextWidth(),n.context.height=n.getTextHeight(),n}t.default=g;});
});

unwrapExports(Text);

var Vector = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,mmvis);}(void 0,function(e,r){function t(e,t){var i=0,s=0;if(1==arguments.length&&r._.isObject(e)){var n=e;r._.isArray(n)?(i=n[0],s=n[1]):n.hasOwnProperty("x")&&n.hasOwnProperty("y")&&(i=n.x,s=n.y);}this._axes=[i,s];}Object.defineProperty(e,"__esModule",{value:!0}),t.prototype={distance:function(e){var t=this._axes[0]-e._axes[0],i=this._axes[1]-e._axes[1];return Math.sqrt(t*t+i*i)}},e.default=t;});
});

unwrapExports(Vector);

var SmoothSpline = createCommonjsModule(function (module, exports) {
!function(e,r){r(exports,Vector,mmvis);}(void 0,function(e,r,V){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e){var r=e.points,t=e.isLoop,n=e.smoothFilter,i=r.length;if(1==i)return r;for(var o=[],u=0,f=new q.default(r[0]),s=null,d=1;d<i;d++)s=new q.default(r[d]),u+=f.distance(s),f=s;s=f=null;var a=u/6;a=a<i?i:a;for(d=0;d<a;d++){var l,v,c,p=d/(a-1)*(t?i:i-1),m=Math.floor(p),_=p-m,h=r[m%i];c=t?(l=r[(m-1+i)%i],v=r[(m+1)%i],r[(m+2)%i]):(l=r[0===m?m:m-1],v=r[i-2<m?i-1:m+1],r[i-3<m?i-1:m+2]);var x=_*_,y=_*x,M=[w(l[0],h[0],v[0],c[0],_,x,y),w(l[1],h[1],v[1],c[1],_,x,y)];V._.isFunction(n)&&n(M),o.push(M);}return o};var t,q=(t=r)&&t.__esModule?t:{default:t};function w(e,r,t,n,i,o,u){var f=.25*(t-e),s=.25*(n-r);return (2*(r-t)+f+s)*u+(-3*(r-t)-2*f-s)*o+f*i+r}});
});

unwrapExports(SmoothSpline);

var _Math = createCommonjsModule(function (module, exports) {
!function(e,n){n(exports,SmoothSpline,mmvis);}(void 0,function(e,n,u){Object.defineProperty(e,"__esModule",{value:!0});var t,o=(t=n)&&t.__esModule?t:{default:t};var i={sin:{},cos:{}},r=Math.PI/180;function s(e,n){var t={points:e};u._.isFunction(n)&&(t.smoothFilter=n);var i=(0, o.default)(t);return e&&0<e.length&&i.push(e[e.length-1]),i}function a(e){return !e||u._.isArray(e)&&2<=e.length&&(!u._.isNumber(e[0])||!u._.isNumber(e[1]))||"x"in e&&!u._.isNumber(e.x)||"y"in e&&!u._.isNumber(e.y)}e.default={PI:Math.PI,sin:function(e,n){return e=(n?e*r:e).toFixed(4),void 0===i.sin[e]&&(i.sin[e]=Math.sin(e)),i.sin[e]},cos:function(e,n){return e=(n?e*r:e).toFixed(4),void 0===i.cos[e]&&(i.cos[e]=Math.cos(e)),i.cos[e]},degreeToRadian:function(e){return e*r},radianToDegree:function(e){return e/r},degreeTo360:function(e){var n=(360+e%360)%360;return 0==n&&0!==e&&(n=360),n},getIsgonPointList:function(e,n){for(var t=[],i=2*Math.PI/e,o=-Math.PI/2,r=0,u=e;r<u;r++)t.push([n*Math.cos(o),n*Math.sin(o)]),o+=i;return t},getSmoothPointList:function(e,t){var i=[],o=e.length,r=[];return u._.each(e,function(e,n){a(e)?(r.length&&(i=i.concat(s(r,t)),r=[]),i.push(e)):r.push(e),n==o-1&&r.length&&(i=i.concat(s(r,t)),r=[]);}),i},isNotValibPoint:a,isValibPoint:function(e){return !a(e)}};});
});

unwrapExports(_Math);

var BrokenLine = createCommonjsModule(function (module, exports) {
!function(t,e){e(exports,Shape,utils,mmvis,_Math);}(void 0,function(t,e,o,n,i){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=f(e),s=f(o),u=f(i);function f(t){return t&&t.__esModule?t:{default:t}}function l(t){return (l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function c(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}function a(t,e){return !e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function p(t){return (p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return (h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y,d,b=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e);}(v,r.default),y=v,(d=[{key:"watch",value:function(t,e){"pointList"!=t&&"smooth"!=t&&"lineType"!=t||("pointList"==t&&this.context.smooth&&(this.context.pointList=u.default.getSmoothPointList(e,this.context.smoothFilter),this._pointList=e),"smooth"==t&&(this.context.pointList=e?u.default.getSmoothPointList(this._pointList,this.context.smoothFilter):this._pointList),this.graphics.clear());}},{key:"draw",value:function(t){for(var e=this.context.pointList,o=!1,n=0,i=e.length;n<i;n++){var r=e[n];o=!!u.default.isValibPoint(r)&&(o?t.lineTo(r[0],r[1]):t.moveTo(r[0],r[1]),!0);}return this}}])&&c(y.prototype,d),v);function v(t){var e;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,v),t=s.default.checkOpt(t);var o=n._.extend(!0,{lineType:null,smooth:!1,pointList:[],smoothFilter:s.default.__emptyFunc},t.context);return !t.isClone&&o.smooth&&(o.pointList=u.default.getSmoothPointList(o.pointList,o.smoothFilter)),t.context=o,t.type="brokenline",(e=a(this,p(v).call(this,t)))._pointList=o.pointList,e}t.default=b;});
});

unwrapExports(BrokenLine);

var Circle$1 = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Shape,utils,mmvis);}(void 0,function(e,t,n,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=u(t),i=u(n);function u(e){return e&&e.__esModule?e:{default:e}}function f(e){return (f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o);}}function a(e,t){return !t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function l(e){return (l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return (p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var s,y,b=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t);}(h,r.default),s=h,(y=[{key:"watch",value:function(e){"r"==e&&this.graphics.clear();}},{key:"draw",value:function(e){var t=this.context.$model.r;t<0&&(t=0),e.drawCircle(0,0,t);}}])&&c(s.prototype,y),h);function h(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),e=o._.extend(!0,{type:"circle",xyToInt:!1,context:{r:0}},i.default.checkOpt(e)),a(this,l(h).call(this,e))}e.default=b;});
});

unwrapExports(Circle$1);

var Path = createCommonjsModule(function (module, exports) {
!function(t,e){e(exports,Shape,utils,mmvis,Matrix,math);}(void 0,function(t,e,s,i,a,o){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(e);n(s),n(a);function n(t){return t&&t.__esModule?t:{default:t}}function h(t){return (h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function f(t,e){for(var s=0;s<e.length;s++){var i=e[s];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}function u(t,e){return !e||"object"!==h(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function c(t){return (c=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){return (p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var l,b,m=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e);}(y,r.default),l=y,(b=[{key:"watch",value:function(t){"path"==t&&this.graphics.clear();}},{key:"_parsePathData",value:function(t){if(this.__parsePathData)return this.__parsePathData;if(!t)return [];this.__parsePathData=[];var e=i._.compact(t.replace(/[Mm]/g,"\\r$&").split("\\r")),s=this;return i._.each(e,function(t){s.__parsePathData.push(s._parseChildPathData(t));}),this.__parsePathData}},{key:"_parseChildPathData",value:function(t){var e,s=t,i=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"];for(s=(s=(s=(s=s.replace(/  /g," ")).replace(/ /g,",")).replace(/(\d)-/g,"$1,-")).replace(/,,/g,","),e=0;e<i.length;e++)s=s.replace(new RegExp(i[e],"g"),"|"+i[e]);var a=s.split("|"),r=[],n=0,h=0;for(e=1;e<a.length;e++){var o=a[e],f=o.charAt(0),u=(o=(o=o.slice(1)).replace(new RegExp("e,-","g"),"e-")).split(",");0<u.length&&""===u[0]&&u.shift();for(var c=0;c<u.length;c++)u[c]=parseFloat(u[c]);for(;0<u.length&&!isNaN(u[0]);){var p,l,b,d=null,m=[],y=n,v=h;switch(f){case"l":n+=u.shift(),h+=u.shift(),d="L",m.push(n,h);break;case"L":n=u.shift(),h=u.shift(),m.push(n,h);break;case"m":n+=u.shift(),h+=u.shift(),d="M",m.push(n,h),f="l";break;case"M":n=u.shift(),h=u.shift(),d="M",m.push(n,h),f="L";break;case"h":n+=u.shift(),d="L",m.push(n,h);break;case"H":n=u.shift(),d="L",m.push(n,h);break;case"v":h+=u.shift(),d="L",m.push(n,h);break;case"V":h=u.shift(),d="L",m.push(n,h);break;case"C":m.push(u.shift(),u.shift(),u.shift(),u.shift()),n=u.shift(),h=u.shift(),m.push(n,h);break;case"c":m.push(n+u.shift(),h+u.shift(),n+u.shift(),h+u.shift()),n+=u.shift(),h+=u.shift(),d="C",m.push(n,h);break;case"S":p=n,l=h,"C"===(b=r[r.length-1]).command&&(p=n+(n-b.points[2]),l=h+(h-b.points[3])),m.push(p,l,u.shift(),u.shift()),n=u.shift(),h=u.shift(),d="C",m.push(n,h);break;case"s":p=n,l=h,"C"===(b=r[r.length-1]).command&&(p=n+(n-b.points[2]),l=h+(h-b.points[3])),m.push(p,l,n+u.shift(),h+u.shift()),n+=u.shift(),h+=u.shift(),d="C",m.push(n,h);break;case"Q":m.push(u.shift(),u.shift()),n=u.shift(),h=u.shift(),m.push(n,h);break;case"q":m.push(n+u.shift(),h+u.shift()),n+=u.shift(),h+=u.shift(),d="Q",m.push(n,h);break;case"T":p=n,l=h,"Q"===(b=r[r.length-1]).command&&(p=n+(n-b.points[0]),l=h+(h-b.points[1])),n=u.shift(),h=u.shift(),d="Q",m.push(p,l,n,h);break;case"t":p=n,l=h,"Q"===(b=r[r.length-1]).command&&(p=n+(n-b.points[0]),l=h+(h-b.points[1])),n+=u.shift(),h+=u.shift(),d="Q",m.push(p,l,n,h);break;case"A":y=n,v=h,d="A",m=[u.shift(),u.shift(),u.shift(),u.shift(),u.shift(),n=u.shift(),h=u.shift(),y,v];break;case"a":y=n,v=h,d="A",m=[u.shift(),u.shift(),u.shift(),u.shift(),u.shift(),n+=u.shift(),h+=u.shift(),y,v];}r.push({command:d||f,points:m});}"z"!==f&&"Z"!==f||r.push({command:"z",points:[]});}return r}},{key:"draw",value:function(t){this.__parsePathData=null,this.context.$model.pointList=[];for(var e=this._parsePathData(this.context.$model.path),s=0,i=e.length;s<i;s++)for(var a=0,r=e[s].length;a<r;a++){var n=e[s][a].command,h=e[s][a].points;switch(n){case"L":t.lineTo(h[0],h[1]);break;case"M":t.moveTo(h[0],h[1]);break;case"C":t.bezierCurveTo(h[0],h[1],h[2],h[3],h[4],h[5]);break;case"Q":t.quadraticCurveTo(h[0],h[1],h[2],h[3]);break;case"A":o.Arc.drawArc(t,h[7],h[8],h);break;case"z":t.closePath();}}return this}}])&&f(l.prototype,b),y);function y(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,y);var e=i._.extend(!0,{pointList:[],path:""},t.context);return t.context=e,t.__parsePathData=null,t.type="path",u(this,c(y).call(this,t))}t.default=m;});
});

unwrapExports(Path);

var Droplet = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Path,utils,mmvis);}(void 0,function(e,t,r,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=u(t),i=u(r);function u(e){return e&&e.__esModule?e:{default:e}}function f(e){return (f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function a(e,t){return !t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function l(e){return (l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return (p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var s,h,d=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t);}(b,o.default),s=b,(h=[{key:"watch",value:function(e){"hr"!=e&&"vr"!=e||(this.context.$model.path=this.createPath());}},{key:"createPath",value:function(){var e=this.context.$model,t="M 0 "+e.hr+" C "+e.hr+" "+e.hr+" "+3*e.hr/2+" "+-e.hr/3+" 0 "+-e.vr;return t+=" C "+3*-e.hr/2+" "+-e.hr/3+" "+-e.hr+" "+e.hr+" 0 "+e.hr+"z"}}])&&c(s.prototype,h),b);function b(e){var t;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,b),e=n._.extend(!0,{type:"droplet",context:{hr:0,vr:0}},i.default.checkOpt(e));t=a(this,l(b).call(this,e));return t.context.$model.path=t.createPath(),t}e.default=d;});
});

unwrapExports(Droplet);

var Ellipse$1 = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Shape,utils,mmvis);}(void 0,function(e,t,n,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=u(t),i=u(n);function u(e){return e&&e.__esModule?e:{default:e}}function f(e){return (f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o);}}function l(e,t){return !t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function a(e){return (a=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return (p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var s,y,b=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t);}(h,r.default),s=h,(y=[{key:"watch",value:function(e){"hr"!=e&&"vr"!=e||this.graphics.clear();}},{key:"draw",value:function(e){e.drawEllipse(0,0,2*this.context.$model.hr,2*this.context.$model.vr);}}])&&c(s.prototype,y),h);function h(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),e=o._.extend(!0,{type:"ellipse",context:{hr:0,vr:0}},i.default.checkOpt(e)),l(this,a(h).call(this,e))}e.default=b;});
});

unwrapExports(Ellipse$1);

var Polygon$1 = createCommonjsModule(function (module, exports) {
!function(t,e){e(exports,Shape,utils,mmvis,_Math);}(void 0,function(t,e,o,n,i){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=l(e),u=l(o),f=l(i);function l(t){return t&&t.__esModule?t:{default:t}}function s(t){return (s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function c(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}function a(t,e){return !e||"object"!==s(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function p(t){return (p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function y(t,e){return (y=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var d,h,b=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&y(t,e);}(v,r.default),d=v,(h=[{key:"watch",value:function(t){"pointList"!=t&&"smooth"!=t&&"lineType"!=t||this.graphics.clear();}},{key:"draw",value:function(t){var e=this.context.pointList;if(!(e.length<2)){t.moveTo(e[0][0],e[0][1]);for(var o=1,n=e.length;o<n;o++)t.lineTo(e[o][0],e[o][1]);t.closePath();}}}])&&c(d.prototype,h),v);function v(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,v);var e=n._.extend(!0,{lineType:null,smooth:!1,pointList:[],smoothFilter:u.default.__emptyFunc},t.context);if(!t.isClone){e.pointList[0];var o=e.pointList.slice(-1)[0];e.smooth&&(e.pointList.unshift(o),e.pointList=f.default.getSmoothPointList(e.pointList));}return t.context=e,t.type="polygon",a(this,p(v).call(this,t))}t.default=b;});
});

unwrapExports(Polygon$1);

var Isogon = createCommonjsModule(function (module, exports) {
!function(t,e){e(exports,Polygon$1,utils,mmvis,_Math);}(void 0,function(t,e,n,o,r){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=f(e),u=(f(n),f(r));function f(t){return t&&t.__esModule?t:{default:t}}function c(t){return (c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o);}}function s(t,e){return !e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function a(t){return (a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function p(t,e){return (p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y,d,m=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e);}(h,i.default),y=h,(d=[{key:"watch",value:function(t){"r"!=t&&"n"!=t||(this.context.$model.pointList=u.default.getIsgonPointList(this.context.$model.n,this.context.$model.r)),"pointList"!=t&&"smooth"!=t&&"lineType"!=t||this.graphics.clear();}}])&&l(y.prototype,d),h);function h(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,h);var e=o._.extend(!0,{pointList:[],r:0,n:0},t.context);return e.pointList=u.default.getIsgonPointList(e.n,e.r),t.context=e,t.type="isogon",s(this,a(h).call(this,t))}t.default=m;});
});

unwrapExports(Isogon);

var Line = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Shape,mmvis);}(void 0,function(e,t,n){var o;function r(e){return (r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o);}}function u(e,t){return !t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function f(e){return (f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function c(e,t){return (c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a,l,p=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t);}(y,((o=t)&&o.__esModule?o:{default:o}).default),a=y,(l=[{key:"watch",value:function(e){"x"!=e&&"y"!=e||this.graphics.clear();}},{key:"draw",value:function(e){var t=this.context.$model;return e.moveTo(t.start.x,t.start.y),e.lineTo(t.end.x,t.end.y),this}}])&&i(a.prototype,l),y);function y(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,y);var t=n._.extend(!0,{start:{x:0,y:0},end:{x:0,y:0}},e.context);return e.context=t,e.type="line",u(this,f(y).call(this,e))}e.default=p;});
});

unwrapExports(Line);

var Rect = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Shape,utils,mmvis);}(void 0,function(e,t,n,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(t),u=i(n);function i(e){return e&&e.__esModule?e:{default:e}}function a(e){return (a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function c(e,t){return !t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function f(e){return (f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return (p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var l,d,y=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t);}(b,o.default),l=b,(d=[{key:"watch",value:function(e){"width"!=e&&"height"!=e&&"radius"!=e||this.graphics.clear();}},{key:"_buildRadiusPath",value:function(e){var t=this.context.$model,n=t.width,r=t.height,o=u.default.getCssOrderArr(t.radius),i=e,a=1;0<=r&&(a=-1),i.moveTo(parseInt(0+o[0]),parseInt(r)),i.lineTo(parseInt(0+n-o[1]),parseInt(r)),0!==o[1]&&i.quadraticCurveTo(0+n,r,parseInt(0+n),parseInt(r+o[1]*a)),i.lineTo(parseInt(0+n),parseInt(0-o[2]*a)),0!==o[2]&&i.quadraticCurveTo(0+n,0,parseInt(0+n-o[2]),parseInt(0)),i.lineTo(parseInt(0+o[3]),parseInt(0)),0!==o[3]&&i.quadraticCurveTo(0,0,parseInt(0),parseInt(0-o[3]*a)),i.lineTo(parseInt(0),parseInt(0+r+o[0]*a)),0!==o[0]&&i.quadraticCurveTo(0,0+r,parseInt(0+o[0]),parseInt(0+r));}},{key:"draw",value:function(e){var t=this.context.$model;t.radius.length?this._buildRadiusPath(e):e.drawRect(0,0,t.width,t.height),e.closePath();}}])&&s(l.prototype,d),b);function b(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,b);var t=r._.extend(!0,{width:0,height:0,radius:[]},e.context);return e.context=t,e.type="rect",c(this,f(b).call(this,e))}e.default=y;});
});

unwrapExports(Rect);

var Sector = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Shape,utils,mmvis,_Math);}(void 0,function(e,t,n,r,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=l(t),a=(l(n),l(o));function l(e){return e&&e.__esModule?e:{default:e}}function c(e){return (c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r);}}function s(e,t){return !t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function f(e){return (f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){return (d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var h,p,g=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t);}(b,i.default),h=b,(p=[{key:"watch",value:function(e){"r0"!=e&&"r"!=e&&"startAngle"!=e&&"endAngle"!=e&&"clockwise"!=e||(this.isRing=!1,this.graphics.clear());}},{key:"draw",value:function(e){var t=this.context.$model,n=void 0===t.r0?0:t.r0,r=t.r,o=a.default.degreeTo360(t.startAngle),i=a.default.degreeTo360(t.endAngle);t.startAngle!=t.endAngle&&Math.abs(t.startAngle-t.endAngle)%360==0&&(this.isRing=!0,o=0,i=360),o=a.default.degreeToRadian(o),i=a.default.degreeToRadian(i);var l=e;this.isRing?0==t.r0?l.drawCircle(0,0,t.r):(t.fillStyle&&t.fillAlpha&&(l.beginPath(),l.arc(0,0,r,o,i,t.clockwise),0==t.r0?l.lineTo(0,0):l.arc(0,0,n,i,o,!t.clockwise),l.closePath(),l.currentPath.lineWidth=0,l.currentPath.strokeStyle=null,l.currentPath.strokeAlpha=0,l.currentPath.line=!1),t.lineWidth&&t.strokeStyle&&t.strokeAlpha&&(l.beginPath(),l.arc(0,0,r,o,i,t.clockwise),l.closePath(),l.currentPath.fillStyle=null,l.currentPath.fill=!1,l.beginPath(),l.arc(0,0,n,i,o,!t.clockwise),l.closePath(),l.currentPath.fillStyle=null,l.currentPath.fill=!1)):(l.beginPath(),l.arc(0,0,r,o,i,t.clockwise),0==t.r0?l.lineTo(0,0):l.arc(0,0,n,i,o,!t.clockwise),l.closePath());}}])&&u(h.prototype,p),b);function b(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,b);var t=r._.extend(!0,{pointList:[],r0:0,r:0,startAngle:0,endAngle:0,clockwise:!1},e.context);return e.context=t,e.regAngle=[],e.isRing=!1,e.type="sector",s(this,f(b).call(this,e))}e.default=g;});
});

unwrapExports(Sector);

var arrow = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports,Shape,mmvis);}(void 0,function(e,t,n){var o;function r(e){return (r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o);}}function l(e,t){return !t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function a(e){return (a=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return (u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var f,c,p=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t);}(y,((o=t)&&o.__esModule?o:{default:o}).default),f=y,(c=[{key:"watch",value:function(e){"x"!=e&&"y"!=e&&"theta"!=e&&"headlen"!=e&&"angle"!=e||this.graphics.clear();}},{key:"draw",value:function(e){var t=this.context.$model,n=t.control.x,o=t.control.y,r=t.point.x,i=t.point.y,l=null!=t.angle?t.angle-180:180*Math.atan2(o-i,n-r)/Math.PI,a=(l+t.theta)*Math.PI/180,u=(l-t.theta)*Math.PI/180,f=t.headlen*Math.cos(a),c=t.headlen*Math.sin(a),s=t.headlen*Math.cos(u),p=t.headlen*Math.sin(u),y=r+f,h=i+c;return e.moveTo(y,h),e.lineTo(r,i),e.lineTo(r+s,i+p),t.fillStyle&&(e.lineTo(y,h),e.closePath()),this}}])&&i(f.prototype,c),y);function y(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,y);var t=n._.extend(!0,{control:{x:0,y:0},point:{x:0,y:0},angle:null,theta:30,headlen:6,lineWidth:1,strokeStyle:"#666",fillStyle:null},e.context);return e.context=t,e.type="arrow",l(this,a(y).call(this,e))}e.default=p;});
});

unwrapExports(arrow);

var dist = createCommonjsModule(function (module, exports) {
!function(e,i){i(exports,Application,DisplayObject,DisplayObjectContainer,Stage,Sprite,Shape,Point,Text,BrokenLine,Circle$1,Droplet,Ellipse$1,Isogon,Line,Path,Polygon$1,Rect,Sector,arrow,AnimationFrame,utils);}(void 0,function(e,i,a,t,r,l,p,n,s,o,u,d,f,h,y,c,q,S,D,P,g,m){Object.defineProperty(e,"__esModule",{value:!0});var x=J(i),b=J(a),j=J(t),A=J(r),O=J(l),C=J(p),L=J(n),v=J(s),k=J(o),w=J(u),B=J(d),E=J(f),F=J(h),I=J(y),R=J(c),T=J(q),_=J(S),M=J(D),z=J(P),G=J(g),H=J(m);function J(e){return e&&e.__esModule?e:{default:e}}var K={App:x.default};K.Display={DisplayObject:b.default,DisplayObjectContainer:j.default,Stage:A.default,Sprite:O.default,Shape:C.default,Point:L.default,Text:v.default},K.Shapes={BrokenLine:k.default,Circle:w.default,Droplet:B.default,Ellipse:E.default,Isogon:F.default,Line:I.default,Path:R.default,Polygon:T.default,Rect:_.default,Sector:M.default,Arrow:z.default},K.AnimationFrame=G.default,K.utils=H.default,e.default=K;});
});

var index = unwrapExports(dist);

export default index;
