var canvax = (function (mmvis) {
	'use strict';

	mmvis = mmvis && mmvis.hasOwnProperty('default') ? mmvis['default'] : mmvis;

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var utils = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, mmvis);
	  }
	})(void 0, function (exports, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  /**
	   * Canvax
	   *
	   * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
	  */
	  var Utils = {
	    mainFrameRate: 60,
	    //默认主帧率
	    now: 0,

	    /*给文本检测高宽专用*/
	    _pixelCtx: null,
	    __emptyFunc: function __emptyFunc() {},
	    //retina 屏幕优化
	    _devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
	    _UID: 0,
	    //该值为向上的自增长整数值
	    getUID: function getUID() {
	      return this._UID++;
	    },
	    createId: function createId(name) {
	      //if end with a digit, then append an undersBase before appending
	      var charCode = name.charCodeAt(name.length - 1);
	      if (charCode >= 48 && charCode <= 57) name += "_";
	      return name + Utils.getUID();
	    },
	    canvasSupport: function canvasSupport() {
	      return !!document.createElement('canvas').getContext;
	    },
	    initElement: function initElement(canvas) {
	      if (window.FlashCanvas && FlashCanvas.initElement) {
	        FlashCanvas.initElement(canvas);
	      }
	      return canvas;
	    },

	    /**
	     * 按照css的顺序，返回一个[上,右,下,左]
	     */
	    getCssOrderArr: function getCssOrderArr(r) {
	      var r1;
	      var r2;
	      var r3;
	      var r4;

	      if (typeof r === 'number') {
	        r1 = r2 = r3 = r4 = r;
	      } else if (r instanceof Array) {
	        if (r.length === 1) {
	          r1 = r2 = r3 = r4 = r[0];
	        } else if (r.length === 2) {
	          r1 = r3 = r[0];
	          r2 = r4 = r[1];
	        } else if (r.length === 3) {
	          r1 = r[0];
	          r2 = r4 = r[1];
	          r3 = r[2];
	        } else {
	          r1 = r[0];
	          r2 = r[1];
	          r3 = r[2];
	          r4 = r[3];
	        }
	      } else {
	        r1 = r2 = r3 = r4 = 0;
	      }

	      return [r1, r2, r3, r4];
	    },
	    isWebGLSupported: function isWebGLSupported() {
	      var contextOptions = {
	        stencil: true
	      };

	      try {
	        if (!window.WebGLRenderingContext) //不存在直接return
	          {
	            return false;
	          }

	        var canvas = document.createElement('canvas'),
	            gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
	        return !!(gl && gl.getContextAttributes().stencil); //还要确实检测是否支持webGL模式
	      } catch (e) {
	        return false;
	      }
	    },
	    checkOpt: function checkOpt(opt) {
	      if (!opt) {
	        opt = {
	          context: {}
	        };
	      } else {
	        if (!opt.context) {
	          opt.context = {};
	        }
	      }

	      return opt;
	    }
	  };
	  Utils._pixelCtx = Utils.initElement(_mmvis.$.createCanvas(1, 1, "_pixelCanvas")).getContext('2d');
	  exports["default"] = Utils;
	});
	});

	unwrapExports(utils);

	var Matrix = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  /**
	   * Canvax
	   *
	   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
	   *
	   * | a | c | tx|
	   * | b | d | ty|
	   * | 0 | 0 | 1 |
	   *
	   * @class
	   * @memberof PIXI
	   *
	   *
	   * Matrix 矩阵库 用于整个系统的几何变换计算
	   */
	  var Matrix = function Matrix(a, b, c, d, tx, ty) {
	    this.a = a != undefined ? a : 1;
	    this.b = b != undefined ? b : 0;
	    this.c = c != undefined ? c : 0;
	    this.d = d != undefined ? d : 1;
	    this.tx = tx != undefined ? tx : 0;
	    this.ty = ty != undefined ? ty : 0;
	    this.array = null;
	  };

	  Matrix.prototype = {
	    concat: function concat(mtx) {
	      var a = this.a;
	      var c = this.c;
	      var tx = this.tx;
	      this.a = a * mtx.a + this.b * mtx.c;
	      this.b = a * mtx.b + this.b * mtx.d;
	      this.c = c * mtx.a + this.d * mtx.c;
	      this.d = c * mtx.b + this.d * mtx.d;
	      this.tx = tx * mtx.a + this.ty * mtx.c + mtx.tx;
	      this.ty = tx * mtx.b + this.ty * mtx.d + mtx.ty;
	      return this;
	    },
	    concatTransform: function concatTransform(x, y, scaleX, scaleY, rotation) {
	      var cos = 1;
	      var sin = 0;

	      if (rotation % 360) {
	        var r = rotation * Math.PI / 180;
	        cos = Math.cos(r);
	        sin = Math.sin(r);
	      }

	      this.concat(new Matrix(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y));
	      return this;
	    },
	    rotate: function rotate(angle) {
	      //目前已经提供对顺时针逆时针两个方向旋转的支持
	      var cos = Math.cos(angle);
	      var sin = Math.sin(angle);
	      var a = this.a;
	      var c = this.c;
	      var tx = this.tx;

	      if (angle > 0) {
	        this.a = a * cos - this.b * sin;
	        this.b = a * sin + this.b * cos;
	        this.c = c * cos - this.d * sin;
	        this.d = c * sin + this.d * cos;
	        this.tx = tx * cos - this.ty * sin;
	        this.ty = tx * sin + this.ty * cos;
	      } else {
	        var st = Math.sin(Math.abs(angle));
	        var ct = Math.cos(Math.abs(angle));
	        this.a = a * ct + this.b * st;
	        this.b = -a * st + this.b * ct;
	        this.c = c * ct + this.d * st;
	        this.d = -c * st + ct * this.d;
	        this.tx = ct * tx + st * this.ty;
	        this.ty = ct * this.ty - st * tx;
	      }

	      return this;
	    },
	    scale: function scale(sx, sy) {
	      this.a *= sx;
	      this.d *= sy;
	      this.tx *= sx;
	      this.ty *= sy;
	      return this;
	    },
	    translate: function translate(dx, dy) {
	      this.tx += dx;
	      this.ty += dy;
	      return this;
	    },
	    identity: function identity() {
	      //初始化
	      this.a = this.d = 1;
	      this.b = this.c = this.tx = this.ty = 0;
	      return this;
	    },
	    invert: function invert() {
	      //逆向矩阵
	      var a = this.a;
	      var b = this.b;
	      var c = this.c;
	      var d = this.d;
	      var tx = this.tx;
	      var i = a * d - b * c;
	      this.a = d / i;
	      this.b = -b / i;
	      this.c = -c / i;
	      this.d = a / i;
	      this.tx = (c * this.ty - d * tx) / i;
	      this.ty = -(a * this.ty - b * tx) / i;
	      return this;
	    },
	    clone: function clone() {
	      return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
	    },
	    toArray: function toArray(transpose, out) {
	      if (arguments.length == 0) {
	        //canvas2d 中不会有任何的参数传入
	        if (isNaN(this.a) || isNaN(this.b) || isNaN(this.c) || isNaN(this.d) || isNaN(this.tx) || isNaN(this.ty)) {
	          //不是一个合格的矩阵
	          return null;
	        }
	        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
	      } //webgl的glsl需要用的时候，需要传入transpose 来转换为一个3*3完整矩阵


	      if (!this.array) {
	        this.array = new Float32Array(9);
	      }

	      var array = out || this.array;

	      if (transpose) {
	        array[0] = this.a;
	        array[1] = this.b;
	        array[2] = 0;
	        array[3] = this.c;
	        array[4] = this.d;
	        array[5] = 0;
	        array[6] = this.tx;
	        array[7] = this.ty;
	        array[8] = 1;
	      } else {
	        array[0] = this.a;
	        array[1] = this.c;
	        array[2] = this.tx;
	        array[3] = this.b;
	        array[4] = this.d;
	        array[5] = this.ty;
	        array[6] = 0;
	        array[7] = 0;
	        array[8] = 1;
	      }

	      return array;
	    },

	    /**
	     * 矩阵左乘向量
	     */
	    mulVector: function mulVector(v) {
	      var aa = this.a,
	          ac = this.c,
	          atx = this.tx;
	      var ab = this.b,
	          ad = this.d,
	          aty = this.ty;
	      var out = [0, 0];
	      out[0] = v[0] * aa + v[1] * ac + atx;
	      out[1] = v[0] * ab + v[1] * ad + aty;
	      return out;
	    }
	  };
	  exports["default"] = Matrix;
	});
	});

	unwrapExports(Matrix);

	var Point = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var Point = function () {
	    function Point() {
	      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	      _classCallCheck(this, Point);

	      if (arguments.length == 1 && _typeof(arguments[0]) == 'object') {
	        var arg = arguments[0];

	        if ("x" in arg && "y" in arg) {
	          this.x = arg.x * 1;
	          this.y = arg.y * 1;
	        } else {
	          var i = 0;

	          for (var p in arg) {
	            if (i == 0) {
	              this.x = arg[p] * 1;
	            } else {
	              this.y = arg[p] * 1;
	              break;
	            }

	            i++;
	          }
	        }
	      } else {
	        this.x = x * 1;
	        this.y = y * 1;
	      }
	    }

	    _createClass(Point, [{
	      key: "toArray",
	      value: function toArray() {
	        return [this.x, this.y];
	      }
	    }]);

	    return Point;
	  }();

	  exports.default = Point;
	});
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

	(function (global, factory) {
	  {
	    factory(exports, Tween, utils, mmvis);
	  }
	})(void 0, function (exports, _tween, _index, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _tween2 = _interopRequireDefault(_tween);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  //import Tween from "./Tween"

	  /**
	   * 设置 AnimationFrame begin
	   */
	  var lastTime = 0;
	  var requestAnimationFrame, cancelAnimationFrame;

	  if (typeof window !== 'undefined') {
	    requestAnimationFrame = window.requestAnimationFrame;
	    cancelAnimationFrame = window.cancelAnimationFrame;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];

	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	      requestAnimationFrame = window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	      cancelAnimationFrame = window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }
	  }

	  if (!requestAnimationFrame) {
	    requestAnimationFrame = function requestAnimationFrame(callback, element) {
	      var currTime = new Date().getTime();
	      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	      var id = setTimeout(function () {
	        callback(currTime + timeToCall);
	      }, timeToCall);
	      lastTime = currTime + timeToCall;
	      return id;
	    };
	  }

	  if (!cancelAnimationFrame) {
	    cancelAnimationFrame = function cancelAnimationFrame(id) {
	      clearTimeout(id);
	    };
	  }

	  var _taskList = []; //[{ id : task: }...]

	  var _requestAid = null;

	  function enabledAnimationFrame() {
	    if (!_requestAid) {
	      _requestAid = requestAnimationFrame(function () {
	        //console.log("frame__" + _taskList.length);
	        //if ( Tween.getAll().length ) {
	        _tween2["default"].update(); //tween自己会做length判断
	        //};


	        var currTaskList = _taskList;
	        _taskList = [];
	        _requestAid = null;

	        while (currTaskList.length > 0) {
	          currTaskList.shift().task();
	        }
	      });
	    }
	    return _requestAid;
	  }
	  /*
	   * @param task 要加入到渲染帧队列中的任务
	   * @result frameid
	   */

	  function registFrame($frame) {
	    if (!$frame) {
	      return;
	    }

	    _taskList.push($frame);

	    return enabledAnimationFrame();
	  }
	  /*
	   *  @param task 要从渲染帧队列中删除的任务
	   */

	  function destroyFrame($frame) {
	    var d_result = false;

	    for (var i = 0, l = _taskList.length; i < l; i++) {
	      if (_taskList[i].id === $frame.id) {
	        d_result = true;

	        _taskList.splice(i, 1);

	        i--;
	        l--;
	      }
	    }

	    if (_taskList.length == 0) {
	      cancelAnimationFrame(_requestAid);
	      _requestAid = null;
	    }
	    return d_result;
	  }
	  /* 
	   * @param opt {from , to , onUpdate , onComplete , ......}
	   * @result tween
	   */

	  function registTween(options) {
	    var opt = _mmvis._.extend({
	      from: null,
	      to: null,
	      duration: 500,
	      onStart: function onStart() {},
	      onUpdate: function onUpdate() {},
	      onComplete: function onComplete() {},
	      onStop: function onStop() {},
	      repeat: 0,
	      delay: 0,
	      easing: 'Linear.None',
	      desc: '' //动画描述，方便查找bug

	    }, options);

	    if (!_mmvis.global.getAnimationEnabled()) {
	      //如果全局动画被禁用，那么下面两项强制设置为0
	      //TODO:其实应该直接执行回调函数的
	      opt.duration = 0;
	      opt.delay = 0;
	    }
	    var tween = {};

	    var tid = "tween_" + _index2["default"].getUID();

	    opt.id && (tid = tid + "_" + opt.id);

	    if (opt.from && opt.to) {
	      var animate = function animate() {
	        if (tween._isCompleteed || tween._isStoped) {
	          tween = null;
	          return;
	        }
	        registFrame({
	          id: tid,
	          task: animate,
	          desc: opt.desc,
	          tween: tween
	        });
	      };

	      tween = new _tween2["default"].Tween(opt.from).to(opt.to, opt.duration).onStart(function () {
	        //opt.onStart.apply( this )
	        opt.onStart(opt.from);
	      }).onUpdate(function () {
	        //opt.onUpdate.apply( this );
	        opt.onUpdate(opt.from);
	      }).onComplete(function () {
	        destroyFrame({
	          id: tid
	        });
	        tween._isCompleteed = true; //opt.onComplete.apply( this , [this] ); //执行用户的conComplete

	        opt.onComplete(opt.from);
	      }).onStop(function () {
	        destroyFrame({
	          id: tid
	        });
	        tween._isStoped = true; //opt.onStop.apply( this , [this] );

	        opt.onStop(opt.from);
	      }).repeat(opt.repeat).delay(opt.delay).easing(_tween2["default"].Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]]);
	      tween.id = tid;
	      tween.start();
	      animate();
	    }
	    return tween;
	  }
	  /*
	   * @param tween
	   * @result void(0)
	   */

	  function destroyTween(tween, msg) {
	    tween.stop();
	  }
	  exports["default"] = {
	    registFrame: registFrame,
	    destroyFrame: destroyFrame,
	    registTween: registTween,
	    destroyTween: destroyTween,
	    Tween: _tween2["default"],
	    taskList: _taskList
	  };
	});
	});

	unwrapExports(AnimationFrame);

	var observe = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, mmvis);
	  }
	})(void 0, function (exports, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function Observe(scope) {
	    var stopRepeatAssign = true;
	    var pmodel = {},
	        //要返回的对象
	    accessores = {},
	        //内部用于转换的对象
	    _Publics = ["$watch", "$model"],
	        //公共属性，不需要get set 化的
	    model = {}; //这是pmodel上的$model属性

	    var Publics = _Publics;

	    function loop(name, val) {
	      if (_mmvis._.indexOf(_Publics, name) === -1) {
	        //非 _Publics 中的值，都要先设置好对应的val到model上
	        model[name] = val;
	      }

	      var valueType = _typeof(val);

	      if (_mmvis._.indexOf(Publics, name) > -1) {
	        return;
	      }

	      if (valueType === "function") {
	        Publics.push(name); //函数无需要转换，也可以做为公共属性存在
	      } else {
	        var accessor = function accessor(neo) {
	          //创建监控属性或数组，自变量，由用户触发其改变
	          var value = model[name],
	              preValue = value,
	              complexValue;

	          if (arguments.length) {
	            //写操作
	            //set 的 值的 类型
	            var neoType = _typeof(neo);

	            if (stopRepeatAssign) {
	              return; //阻止重复赋值
	            }

	            if (value !== neo) {
	              if (neo && neoType === "object" && !(neo instanceof Array) && !neo.addColorStop // neo instanceof CanvasGradient
	              ) {
	                  value = neo.$model ? neo : Observe(neo);
	                  complexValue = value.$model;
	                } else {
	                //如果是其他数据类型
	                value = neo;
	              }

	              model[name] = complexValue ? complexValue : value; //更新$model中的值

	              if (valueType != neoType) {
	                //如果set的值类型已经改变，
	                //那么也要把对应的valueType修改为对应的neoType
	                valueType = neoType;
	              }

	              if (pmodel.$watch) {
	                pmodel.$watch.call(pmodel, name, value, preValue);
	              }
	            }
	          } else {
	            //读操作
	            //读的时候，发现value是个obj，而且还没有defineProperty
	            //那么就临时defineProperty一次
	            if (value && valueType === "object" && !(value instanceof Array) && !value.$model && !value.addColorStop) {
	              value = Observe(value);
	              value.$watch = pmodel.$watch; //accessor.value = value;

	              model[name] = value;
	            }
	            return value;
	          }
	        }; //accessor.value = val;


	        accessores[name] = {
	          set: accessor,
	          get: accessor,
	          enumerable: true
	        };
	      }
	    }

	    for (var i in scope) {
	      loop(i, scope[i]);
	    }
	    pmodel = defineProperties(pmodel, accessores, Publics); //生成一个空的ViewModel

	    _mmvis._.forEach(Publics, function (name) {
	      if (scope[name]) {
	        //然后为函数等不被监控的属性赋值
	        if (typeof scope[name] == "function") {
	          pmodel[name] = function () {
	            scope[name].apply(this, arguments);
	          };
	        } else {
	          pmodel[name] = scope[name];
	        }
	      }
	    });

	    pmodel.$model = model;

	    pmodel.hasOwnProperty = function (name) {
	      return name in pmodel.$model;
	    };

	    stopRepeatAssign = false;
	    return pmodel;
	  }
	  var defineProperty = Object.defineProperty; //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
	  //标准浏览器使用__defineGetter__, __defineSetter__实现

	  try {
	    defineProperty({}, "_", {
	      value: "x"
	    });
	    var defineProperties = Object.defineProperties;
	  } catch (e) {
	    if ("__defineGetter__" in Object) {
	      defineProperty = function defineProperty(obj, prop, desc) {
	        if ('value' in desc) {
	          obj[prop] = desc.value;
	        }

	        if ('get' in desc) {
	          obj.__defineGetter__(prop, desc.get);
	        }

	        if ('set' in desc) {
	          obj.__defineSetter__(prop, desc.set);
	        }

	        return obj;
	      };

	      defineProperties = function defineProperties(obj, descs) {
	        for (var prop in descs) {
	          if (descs.hasOwnProperty(prop)) {
	            defineProperty(obj, prop, descs[prop]);
	          }
	        }

	        return obj;
	      };
	    }
	  }

	  /*  因为flash不被支持的策略，所以对应的vbs 实现get set的上古代码也不再支持
	  if (!defineProperties && window.VBArray) {
	      window.execScript([
	              "Function parseVB(code)",
	              "\tExecuteGlobal(code)",
	              "End Function"
	              ].join("\n"), "VBScript");
	  
	      function VBMediator(description, name, value) {
	          var fn = description[name] && description[name].set;
	          if (arguments.length === 3) {
	              fn(value);
	          } else {
	              return fn();
	          }
	      };
	      defineProperties = function(publics, description, array) {
	          publics = array.slice(0);
	          publics.push("hasOwnProperty");
	          var className = "VBClass" + setTimeout("1"), owner = {}, buffer = [];
	          buffer.push(
	                  "Class " + className,
	                  "\tPrivate [__data__], [__proxy__]",
	                  "\tPublic Default Function [__const__](d, p)",
	                  "\t\tSet [__data__] = d: set [__proxy__] = p",
	                  "\t\tSet [__const__] = Me", //链式调用
	                  "\tEnd Function");
	          _.forEach(publics,function(name) { //添加公共属性,如果此时不加以后就没机会了
	              if (owner[name] !== true) {
	                  owner[name] = true //因为VBScript对象不能像JS那样随意增删属性
	              buffer.push("\tPublic [" + name + "]") //你可以预先放到  skipArray 中
	              }
	          });
	          for (var name in description) {
	              owner[name] = true
	                  buffer.push(
	                          //由于不知对方会传入什么,因此set, let都用上
	                          "\tPublic Property Let [" + name + "](val)", //setter
	                          "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)",
	                          "\tEnd Property",
	                          "\tPublic Property Set [" + name + "](val)", //setter
	                          "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)",
	                          "\tEnd Property",
	                          "\tPublic Property Get [" + name + "]", //getter
	                          "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
	                          "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
	                          "\tIf Err.Number <> 0 Then",
	                          "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")",
	                          "\tEnd If",
	                          "\tOn Error Goto 0",
	                          "\tEnd Property")
	          }
	          buffer.push("End Class"); //类定义完毕
	          buffer.push(
	                  "Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
	                  "\tDim o",
	                  "\tSet o = (New " + className + ")(a, b)",
	                  "\tSet " + className + "Factory = o",
	                  "End Function");
	          window.parseVB(buffer.join("\r\n"));//先创建一个VB类工厂
	          return  window[className + "Factory"](description, VBMediator);//得到其产品
	      }
	  }
	  */

	  exports["default"] = Observe;
	});
	});

	unwrapExports(observe);

	var _const = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  var VERSION = exports.VERSION = __VERSION__;
	  var PI_2 = exports.PI_2 = Math.PI * 2;
	  var RAD_TO_DEG = exports.RAD_TO_DEG = 180 / Math.PI;
	  var DEG_TO_RAD = exports.DEG_TO_RAD = Math.PI / 180;
	  var RENDERER_TYPE = exports.RENDERER_TYPE = {
	    UNKNOWN: 0,
	    WEBGL: 1,
	    CANVAS: 2
	  };
	  var DRAW_MODES = exports.DRAW_MODES = {
	    POINTS: 0,
	    LINES: 1,
	    LINE_LOOP: 2,
	    LINE_STRIP: 3,
	    TRIANGLES: 4,
	    TRIANGLE_STRIP: 5,
	    TRIANGLE_FAN: 6
	  };
	  var SHAPES = exports.SHAPES = {
	    POLY: 0,
	    RECT: 1,
	    CIRC: 2,
	    ELIP: 3
	  };
	  var SCALE_MODES = exports.SCALE_MODES = {
	    LINEAR: 0,
	    NEAREST: 1
	  };
	  var CONTEXT_DEFAULT = exports.CONTEXT_DEFAULT = {
	    width: 0,
	    height: 0,
	    x: 0,
	    y: 0,
	    scaleX: 1,
	    scaleY: 1,
	    scaleOrigin: {
	      x: 0,
	      y: 0
	    },
	    rotation: 0,
	    rotateOrigin: {
	      x: 0,
	      y: 0
	    },
	    visible: true,
	    globalAlpha: 1
	  };
	  var SHAPE_CONTEXT_DEFAULT = exports.SHAPE_CONTEXT_DEFAULT = {
	    cursor: "default",
	    fillAlpha: 1,
	    //context2d里没有，自定义
	    fillStyle: null,
	    //"#000000",
	    lineCap: null,
	    //默认都是直角
	    lineJoin: null,
	    //这两个目前webgl里面没实现
	    miterLimit: null,
	    //miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。
	    strokeAlpha: 1,
	    //context2d里没有，自定义
	    strokeStyle: null,
	    lineType: "solid",
	    //context2d里没有，自定义线条的type，默认为实线
	    lineWidth: null
	  }; //会影响到transform改变的context属性

	  var TRANSFORM_PROPS = exports.TRANSFORM_PROPS = ["x", "y", "scaleX", "scaleY", "rotation", "scaleOrigin", "rotateOrigin"]; //所有和样式相关的属性
	  //appha 有 自己的 处理方式

	  var STYLE_PROPS = exports.STYLE_PROPS = ["lineWidth", "strokeAlpha", "strokeStyle", "fillStyle", "fillAlpha", "globalAlpha"];
	});
	});

	unwrapExports(_const);

	var InsideLine = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = insideLine;

	  /**
	   * 线段包含判断
	   * @points [0,0,0,0]
	   */
	  var _isInsideLine = function _isInsideLine(points, x, y, lineWidth) {
	    var x0 = points[0];
	    var y0 = points[1];
	    var x1 = points[2];
	    var y1 = points[3];

	    var _l = Math.max(lineWidth, 3);

	    var _a = 0;
	    var _b = x0;

	    if (y > y0 + _l && y > y1 + _l || y < y0 - _l && y < y1 - _l || x > x0 + _l && x > x1 + _l || x < x0 - _l && x < x1 - _l) {
	      return false;
	    }

	    if (x0 !== x1) {
	      _a = (y0 - y1) / (x0 - x1);
	      _b = (x0 * y1 - x1 * y0) / (x0 - x1);
	    } else {
	      return Math.abs(x - x0) <= _l / 2;
	    }

	    var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);

	    return _s <= _l / 2 * _l / 2;
	  };

	  function insideLine(data, x, y, line) {
	    var points = data.shape.points;
	    var lineWidth = data.lineWidth;
	    var insideCatch = false;

	    for (var i = 0; i < points.length; ++i) {
	      insideCatch = _isInsideLine(points.slice(i, i + 4), x, y, lineWidth);

	      if (insideCatch) {
	        break;
	      }
	      i += 1;
	    }
	    return insideCatch;
	  }
	});
	});

	unwrapExports(InsideLine);

	var settings = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports["default"] = {
	    //设备分辨率
	    RESOLUTION: typeof window !== 'undefined' ? window.devicePixelRatio : 1,

	    /**
	     * Target frames per millisecond.
	     */
	    TARGET_FPMS: 0.06,

	    /**
	     * If set to true WebGL will attempt make textures mimpaped by default.
	     * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
	     */
	    MIPMAP_TEXTURES: true,

	    /**
	     * Default filter resolution.
	     */
	    FILTER_RESOLUTION: 1,
	    // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
	    // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

	    /**
	     * The default sprite batch size.
	     *
	     * The default aims to balance desktop and mobile devices.
	     */
	    SPRITE_BATCH_SIZE: 4096,

	    /**
	     * The prefix that denotes a URL is for a retina asset.
	     */
	    RETINA_PREFIX: /@(.+)x/,
	    RENDER_OPTIONS: {
	      view: null,
	      antialias: true,
	      forceFXAA: false,
	      autoResize: false,
	      transparent: true,
	      backgroundColor: 0x000000,
	      clearBeforeRender: true,
	      preserveDrawingBuffer: false,
	      roundPixels: false
	    },
	    TRANSFORM_MODE: 0,
	    GC_MODE: 0,
	    GC_MAX_IDLE: 60 * 60,
	    GC_MAX_CHECK_COUNT: 60 * 10,
	    WRAP_MODE: 0,
	    SCALE_MODE: 0,
	    PRECISION: 'mediump'
	  };
	});
	});

	unwrapExports(settings);

	var DisplayObject = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, mmvis, Matrix, Point, utils, AnimationFrame, observe, _const, InsideLine, settings);
	  }
	})(void 0, function (exports, _mmvis, _Matrix, _Point, _index, _AnimationFrame, _observe, _const, _InsideLine, _settings) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Matrix2 = _interopRequireDefault(_Matrix);

	  var _Point2 = _interopRequireDefault(_Point);

	  var _index2 = _interopRequireDefault(_index);

	  var _AnimationFrame2 = _interopRequireDefault(_AnimationFrame);

	  var _observe2 = _interopRequireDefault(_observe);

	  var _InsideLine2 = _interopRequireDefault(_InsideLine);

	  var _settings2 = _interopRequireDefault(_settings);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var DisplayObject = function (_event$Dispatcher) {
	    _inherits(DisplayObject, _event$Dispatcher);

	    function DisplayObject(opt) {
	      var _this;

	      _classCallCheck(this, DisplayObject);

	      _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayObject).call(this, opt)); //相对父级元素的矩阵

	      _this._transform = null;
	      _this.worldTransform = null; //_transform如果有修改，则_transformChange为true，renderer的时候worldTransform

	      _this._transformChange = false; //心跳次数

	      _this._heartBeatNum = 0; //元素对应的stage元素

	      _this.stage = null; //元素的父元素

	      _this.parent = null;
	      _this.xyToInt = "xyToInt" in opt ? opt.xyToInt : true; //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

	      _this.moveing = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

	      _this.clip = null; //裁剪的图形对象
	      //创建好context

	      _this.context = _this._createContext(opt);
	      _this.type = opt.type || "DisplayObject";
	      _this.id = opt.id || _index2["default"].createId(_this.type);
	      _this._trackList = []; //一个元素可以追踪另外元素的变动

	      _this.init.apply(_assertThisInitialized(_this), arguments); //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform


	      _this._updateTransform();

	      _this._tweens = [];

	      var me = _assertThisInitialized(_this);

	      _this.on("destroy", function () {
	        me.cleanAnimates();
	      });

	      return _this;
	    }

	    _createClass(DisplayObject, [{
	      key: "init",
	      value: function init() {}
	    }, {
	      key: "clipTo",
	      value: function clipTo(node) {
	        this.clip = node;
	        node.isClip = true;
	      }
	    }, {
	      key: "_createContext",
	      value: function _createContext(opt) {
	        var self = this;
	        var optCtx = opt.context || {};
	        var _contextATTRS = {
	          width: optCtx.width || 0,
	          height: optCtx.height || 0,
	          x: optCtx.x || 0,
	          y: optCtx.y || 0,
	          scaleX: optCtx.scaleX || 1,
	          scaleY: optCtx.scaleY || 1,
	          scaleOrigin: optCtx.scaleOrigin || {
	            x: 0,
	            y: 0
	          },
	          rotation: optCtx.rotation || 0,
	          rotateOrigin: optCtx.rotateOrigin || {
	            x: 0,
	            y: 0
	          },
	          visible: optCtx.visible || true,
	          globalAlpha: optCtx.globalAlpha || 1 //样式部分迁移到shape中

	        }; //平凡的clone数据非常的耗时，还是走回原来的路
	        //var _contextATTRS = _.extend( true , _.clone(CONTEXT_DEFAULT), opt.context );

	        _mmvis._.extend(true, _contextATTRS, opt.context); //有些引擎内部设置context属性的时候是不用上报心跳的，比如做热点检测的时候


	        self._notWatch = false; //不需要发心跳信息

	        self._noHeart = false; //_contextATTRS.$owner = self;

	        _contextATTRS.$watch = function (name, value, preValue) {
	          //下面的这些属性变化，都会需要重新组织矩阵属性 _transform 
	          var obj = self; //this.$owner;

	          if (!obj.context) {
	            //如果这个obj的context已经不存在了，那么就什么都不处理，
	            //TODO:后续还要把自己给destroy 并且要把在 动画队列里面的动画也干掉
	            return;
	          }

	          if (name == "globalGalpha") {
	            obj._globalAlphaChange = true;
	          }

	          if (_mmvis._.indexOf(_const.TRANSFORM_PROPS, name) > -1) {
	            obj._updateTransform();

	            obj._transformChange = true;
	          }

	          if (obj._notWatch) {
	            return;
	          }

	          if (obj.$watch) {
	            //执行的内部$watch的时候必须把_notWatch 设置为true，否则会死循环调用
	            obj._notWatch = true;
	            obj.$watch(name, value, preValue);
	            obj._notWatch = false;
	          }

	          if (obj._noHeart) {
	            return;
	          }
	          obj.heartBeat({
	            convertType: "context",
	            shape: obj,
	            name: name,
	            value: value,
	            preValue: preValue
	          });
	        }; //执行init之前，应该就根据参数，把context组织好线


	        return (0, _observe2["default"])(_contextATTRS);
	      }
	    }, {
	      key: "track",
	      value: function track(el) {
	        if (_mmvis._.indexOf(this._trackList, el) == -1) {
	          this._trackList.push(el);
	        }
	      }
	    }, {
	      key: "untrack",
	      value: function untrack(el) {
	        var ind = _mmvis._.indexOf(this._trackList, el);

	        if (ind > -1) {
	          this._trackList.splice(ind, 1);
	        }
	      }
	    }, {
	      key: "clone",
	      value: function clone(myself) {
	        var conf = {
	          id: this.id,
	          context: _mmvis._.clone(this.context.$model),
	          isClone: true
	        };
	        var newObj;

	        if (this.type == 'text') {
	          newObj = new this.constructor(this.text, conf);
	        } else {
	          newObj = new this.constructor(conf);
	        }

	        newObj.id = conf.id;

	        if (this.children) {
	          newObj.children = this.children;
	        }

	        if (this.graphics) {
	          newObj.graphics = this.graphics.clone();
	        }

	        if (!myself) {
	          newObj.id = _index2["default"].createId(newObj.type);
	        }
	        return newObj;
	      }
	    }, {
	      key: "heartBeat",
	      value: function heartBeat(opt) {
	        //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
	        //的属性，所以，通知到stage.displayAttrHasChange
	        var stage = this.getStage();

	        if (stage) {
	          this._heartBeatNum++;
	          stage.heartBeat && stage.heartBeat(opt);
	        }
	      }
	    }, {
	      key: "getCurrentWidth",
	      value: function getCurrentWidth() {
	        return Math.abs(this.context.$model.width * this.context.$model.scaleX);
	      }
	    }, {
	      key: "getCurrentHeight",
	      value: function getCurrentHeight() {
	        return Math.abs(this.context.$model.height * this.context.$model.scaleY);
	      }
	    }, {
	      key: "getStage",
	      value: function getStage() {
	        if (this.stage) {
	          return this.stage;
	        }
	        var p = this;

	        if (p.type != "stage") {
	          while (p.parent) {
	            p = p.parent;

	            if (p.type == "stage") {
	              break;
	            }
	          }

	          if (p.type !== "stage") {
	            //如果得到的顶点display 的type不是Stage,也就是说不是stage元素
	            //那么只能说明这个p所代表的顶端display 还没有添加到displayList中，也就是没有没添加到
	            //stage舞台的childen队列中，不在引擎渲染范围内
	            return false;
	          }
	        } //一直回溯到顶层object， 即是stage， stage的parent为null


	        this.stage = p;
	        return p;
	      }
	    }, {
	      key: "localToGlobal",
	      value: function localToGlobal(point, container) {
	        !point && (point = new _Point2["default"](0, 0));
	        var cm = this.getConcatenatedMatrix(container);
	        if (cm == null) return (0, _Point2["default"])(0, 0);
	        var m = new _Matrix2["default"](1, 0, 0, 1, point.x, point.y);
	        m.concat(cm);
	        return new _Point2["default"](m.tx, m.ty); //{x:m.tx, y:m.ty};
	      }
	    }, {
	      key: "globalToLocal",
	      value: function globalToLocal(point, container) {
	        !point && (point = new _Point2["default"](0, 0));

	        if (this.type == "stage") {
	          return point;
	        }

	        var cm = this.getConcatenatedMatrix(container);
	        if (cm == null) return new _Point2["default"](0, 0); //{x:0, y:0};

	        cm.invert();
	        var m = new _Matrix2["default"](1, 0, 0, 1, point.x, point.y);
	        m.concat(cm);
	        return new _Point2["default"](m.tx, m.ty); //{x:m.tx, y:m.ty};
	      }
	    }, {
	      key: "localToTarget",
	      value: function localToTarget(point, target) {
	        var p = localToGlobal(point);
	        return target.globalToLocal(p);
	      }
	    }, {
	      key: "getConcatenatedMatrix",
	      value: function getConcatenatedMatrix(container) {
	        var cm = new _Matrix2["default"]();

	        for (var o = this; o != null; o = o.parent) {
	          cm.concat(o._transform);

	          if (!o.parent || container && o.parent && o.parent == container || o.parent && o.parent.type == "stage") {
	            //if( o.type == "stage" || (o.parent && container && o.parent.type == container.type ) ) {
	            return cm; //break;
	          }
	        }

	        return cm;
	      }
	    }, {
	      key: "setEventEnable",
	      value: function setEventEnable(bool) {
	        if (_mmvis._.isBoolean(bool)) {
	          this._eventEnabled = bool;
	          return true;
	        }
	        return false;
	      }
	    }, {
	      key: "getIndex",
	      value: function getIndex() {
	        if (!this.parent) {
	          return;
	        }
	        return _mmvis._.indexOf(this.parent.children, this);
	      }
	    }, {
	      key: "toBack",
	      value: function toBack(num) {
	        if (!this.parent) {
	          return;
	        }

	        var fromIndex = this.getIndex();
	        var toIndex = 0;

	        if (_mmvis._.isNumber(num)) {
	          if (num == 0) {
	            //原地不动
	            return;
	          }
	          toIndex = fromIndex - num;
	        }

	        var me = this.parent.children.splice(fromIndex, 1)[0];

	        if (toIndex < 0) {
	          toIndex = 0;
	        }
	        this.parent.addChildAt(me, toIndex);
	      }
	    }, {
	      key: "toFront",
	      value: function toFront(num) {
	        if (!this.parent) {
	          return;
	        }

	        var fromIndex = this.getIndex();
	        var pcl = this.parent.children.length;
	        var toIndex = pcl;

	        if (_mmvis._.isNumber(num)) {
	          if (num == 0) {
	            //原地不动
	            return;
	          }

	          toIndex = fromIndex + num + 1;
	        }

	        var me = this.parent.children.splice(fromIndex, 1)[0];

	        if (toIndex > pcl) {
	          toIndex = pcl;
	        }

	        this.parent.addChildAt(me, toIndex - 1);
	      }
	    }, {
	      key: "_updateTransform",
	      value: function _updateTransform() {
	        var _transform = new _Matrix2["default"]();

	        _transform.identity();

	        var context = this.context; //是否需要scale

	        if (context.scaleX !== 1 || context.scaleY !== 1) {
	          //如果有缩放
	          //缩放的原点坐标
	          var origin = new _Point2["default"](context.scaleOrigin);

	          _transform.translate(-origin.x, -origin.y);

	          _transform.scale(context.scaleX, context.scaleY);

	          _transform.translate(origin.x, origin.y);
	        }
	        var rotation = context.rotation;

	        if (rotation) {
	          //如果有旋转
	          //旋转的原点坐标
	          var origin = new _Point2["default"](context.rotateOrigin);

	          _transform.translate(-origin.x, -origin.y);

	          _transform.rotate(rotation % 360 * Math.PI / 180);

	          _transform.translate(origin.x, origin.y);
	        }

	        var x, y;

	        if (this.xyToInt && !this.moveing) {
	          //当这个元素在做轨迹运动的时候，比如drag，animation如果实时的调整这个x ， y
	          //那么该元素的轨迹会有跳跃的情况发生。所以加个条件过滤，
	          var x = parseInt(context.x);
	          var y = parseInt(context.y);

	          if (parseInt(context.lineWidth, 10) % 2 == 1 && context.strokeStyle) {
	            x += 0.5;
	            y += 0.5;
	          }
	        } else {
	          x = context.x;
	          y = context.y;
	        }

	        if (x != 0 || y != 0) {
	          _transform.translate(x, y);
	        }
	        this._transform = _transform;
	        return _transform;
	      }
	    }, {
	      key: "setWorldTransform",
	      value: function setWorldTransform() {
	        var cm = new _Matrix2["default"]();
	        cm.concat(this._transform);
	        this.parent && cm.concat(this.parent.worldTransform);
	        this.worldTransform = cm;
	        return this.worldTransform;
	      }
	    }, {
	      key: "getChildInPoint",
	      value: function getChildInPoint(point) {
	        var result = false; //检测的结果
	        //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
	        //if( this.type != "stage" && this.parent && this.parent.type != "stage" ) {
	        //    point = this.parent.globalToLocal( point );
	        //};
	        //var m = new Matrix( Settings.RESOLUTION, 0, 0, Settings.RESOLUTION, point.x , point.y);
	        //m.concat( this.worldTransform );

	        var x = point.x;
	        var y = point.y; //对鼠标的坐标也做相同的变换

	        if (this.worldTransform) {
	          var inverseMatrix = this.worldTransform.clone().invert();
	          var originPos = [x * _settings2["default"].RESOLUTION, y * _settings2["default"].RESOLUTION];
	          originPos = inverseMatrix.mulVector(originPos);
	          x = originPos[0];
	          y = originPos[1];
	        }

	        if (this.graphics) {
	          result = this.containsPoint({
	            x: x,
	            y: y
	          });
	        }

	        if (this.type == "text") {
	          //文本框的先单独处理
	          var _rect = this.getRect();

	          if (!_rect.width || !_rect.height) {
	            return false;
	          }

	          if (x >= _rect.x && x <= _rect.x + _rect.width && (_rect.height >= 0 && y >= _rect.y && y <= _rect.y + _rect.height || _rect.height < 0 && y <= _rect.y && y >= _rect.y + _rect.height)) {
	            //那么就在这个元素的矩形范围内
	            result = true;
	          } else {
	            //如果连矩形内都不是，那么肯定的，这个不是我们要找的shap
	            result = false;
	          }
	          return result;
	        }
	        return result;
	      }
	    }, {
	      key: "containsPoint",
	      value: function containsPoint(point) {
	        var inside = false;

	        for (var i = 0; i < this.graphics.graphicsData.length; ++i) {
	          var data = this.graphics.graphicsData[i];

	          if (data.shape) {
	            //先检测fill， fill的检测概率大些。
	            //像circle,ellipse这样的shape 就直接把lineWidth算在fill里面计算就好了，所以他们是没有insideLine的
	            if (data.hasFill() && data.shape.contains(point.x, point.y)) {
	              inside = true;

	              if (inside) {
	                break;
	              }
	            } //circle,ellipse等就没有points


	            if (data.hasLine() && data.shape.points) {
	              //然后检测是否和描边碰撞
	              inside = (0, _InsideLine2["default"])(data, point.x, point.y);

	              if (inside) {
	                break;
	              }
	            }
	          }
	        }

	        return inside;
	      }
	    }, {
	      key: "animate",
	      value: function animate(toContent, options, context) {
	        if (!context) {
	          context = this.context;
	        }

	        if (!context) {
	          //这个时候如果还是找不到context说明这个 el 已经被destroy了
	          return;
	        }
	        var to = toContent;
	        var from = null;

	        for (var p in to) {
	          if (_mmvis._.isObject(to[p])) {
	            //options必须传递一份copy出去，比如到下一个animate
	            this.animate(to[p], _mmvis._.extend({}, options), context[p]); //如果是个object

	            continue;
	          }

	          if (isNaN(to[p]) && to[p] !== '' && to[p] !== null) {
	            //undefined已经被isNaN过滤了
	            //只有number才能继续走下去执行tween，而非number则直接赋值完事，
	            //TODO:不能用_.isNumber 因为 '1212' 这样的其实可以计算
	            context[p] = to[p];
	            delete to[p];
	            continue;
	          }

	          if (!from) {
	            from = {};
	          }
	          from[p] = context[p];
	        }

	        if (!from) {
	          //这里很重要，不能删除。 
	          //比如line.animate({start:{x:0,y:0}} , {duration:500});
	          //那么递归到start的时候  from 的值依然为null
	          //如果这个时候继续执行的话，会有很严重的bug
	          //line.context.start 会 被赋值了 line对象上的所有属性，严重的bug
	          return;
	        }
	        !options && (options = {});
	        options.from = from;
	        options.to = to;
	        var self = this;

	        var upFun = function upFun() {};

	        if (options.onUpdate) {
	          upFun = options.onUpdate;
	        }
	        var tween;

	        options.onUpdate = function (status) {
	          //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
	          if (!context && tween) {
	            _AnimationFrame2["default"].destroyTween(tween);

	            tween = null;
	            return;
	          }

	          for (var p in status) {
	            context[p] = status[p];
	          }
	          upFun.apply(self, [status]);
	        };

	        var compFun = function compFun() {};

	        if (options.onComplete) {
	          compFun = options.onComplete;
	        }

	        options.onComplete = function (status) {
	          compFun.apply(self, arguments);

	          self._removeTween(tween);
	        };

	        options.onStop = function () {
	          self._removeTween(tween);
	        };

	        options.desc = "tweenType:DisplayObject.animate__id:" + this.id + "__objectType:" + this.type;
	        tween = _AnimationFrame2["default"].registTween(options);

	        this._tweens.push(tween);

	        return tween;
	      }
	    }, {
	      key: "_removeTween",
	      value: function _removeTween(tween) {
	        for (var i = 0; i < this._tweens.length; i++) {
	          if (tween == this._tweens[i]) {
	            this._tweens.splice(i, 1);

	            break;
	          }
	        }
	      }
	    }, {
	      key: "removeAnimate",
	      value: function removeAnimate(animate) {
	        animate.stop();

	        this._removeTween(animate);
	      }
	    }, {
	      key: "cleanAnimates",
	      value: function cleanAnimates() {
	        this._cleanAnimates();
	      }
	    }, {
	      key: "_cleanAnimates",
	      value: function _cleanAnimates() {
	        while (this._tweens.length) {
	          this._tweens.shift().stop();
	        }
	      }
	    }, {
	      key: "remove",
	      value: function remove() {
	        if (this.parent) {
	          this.parent.removeChild(this);
	          this.parent = null;
	        }
	      }
	    }, {
	      key: "destroy",
	      value: function destroy() {
	        this._destroy();
	      }
	    }, {
	      key: "_destroy",
	      value: function _destroy() {
	        this.remove();
	        this.fire("destroy"); //把自己从父节点中删除了后做自我清除，释放内存

	        this.context = null;
	        delete this.context;
	      }
	    }]);

	    return DisplayObject;
	  }(_mmvis.event.Dispatcher);

	  exports.default = DisplayObject;
	});
	});

	unwrapExports(DisplayObject);

	var DisplayObjectContainer = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, mmvis, DisplayObject);
	  }
	})(void 0, function (exports, _mmvis, _DisplayObject2) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var DisplayObjectContainer = function (_DisplayObject) {
	    _inherits(DisplayObjectContainer, _DisplayObject);

	    function DisplayObjectContainer(opt) {
	      var _this;

	      _classCallCheck(this, DisplayObjectContainer);

	      _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayObjectContainer).call(this, opt));
	      _this.children = [];
	      _this.mouseChildren = []; //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
	      //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
	      //DisplayObjectContainer的 setEventEnable() 方法

	      _this._eventEnabled = true;
	      return _this;
	    }

	    _createClass(DisplayObjectContainer, [{
	      key: "addChild",
	      value: function addChild(child, index) {
	        if (!child) {
	          return;
	        }

	        if (this.getChildIndex(child) != -1) {
	          child.parent = this;
	          return child;
	        }

	        if (child.parent) {
	          child.parent.removeChild(child);
	        }

	        if (index === undefined) {
	          index = this.children.length;
	        }
	        this.children.splice(index, 0, child);
	        child.parent = this;

	        if (this.heartBeat) {
	          this.heartBeat({
	            convertType: "children",
	            target: child,
	            src: this
	          });
	        }

	        if (this._afterAddChild) {
	          this._afterAddChild(child);
	        }
	        return child;
	      }
	    }, {
	      key: "addChildAt",
	      value: function addChildAt(child, index) {
	        return this.addChild(child, index);
	      }
	    }, {
	      key: "removeChild",
	      value: function removeChild(child) {
	        return this.removeChildAt(_mmvis._.indexOf(this.children, child));
	      }
	    }, {
	      key: "removeChildAt",
	      value: function removeChildAt(index) {
	        if (index < 0 || index > this.children.length - 1) {
	          return false;
	        }
	        var child = this.children[index];

	        if (child != null) {
	          child.parent = null;
	        }
	        this.children.splice(index, 1);

	        if (this.heartBeat) {
	          this.heartBeat({
	            convertType: "children",
	            target: child,
	            src: this
	          });
	        }

	        if (this._afterDelChild) {
	          this._afterDelChild(child, index);
	        }

	        return child;
	      }
	    }, {
	      key: "removeChildById",
	      value: function removeChildById(id) {
	        for (var i = 0, len = this.children.length; i < len; i++) {
	          if (this.children[i].id == id) {
	            return this.removeChildAt(i);
	          }
	        }

	        return false;
	      }
	    }, {
	      key: "removeAllChildren",
	      value: function removeAllChildren() {
	        while (this.children.length > 0) {
	          this.removeChildAt(0);
	        }
	      }
	    }, {
	      key: "destroy",
	      value: function destroy() {
	        /*
	        if( this.parent ){
	            this.parent.removeChild(this);
	            this.parent = null;
	        };
	        this.fire("destroy");
	        */
	        //依次销毁所有子元素
	        for (var i = 0, l = this.children.length; i < l; i++) {
	          this.getChildAt(i).destroy();
	          i--;
	          l--;
	        }

	        this._destroy();
	      }
	    }, {
	      key: "cleanAnimates",
	      value: function cleanAnimates() {
	        //依次销毁所有子元素
	        for (var i = 0, l = this.children.length; i < l; i++) {
	          this.getChildAt(i).cleanAnimates();
	        }

	        this._cleanAnimates();
	      }
	    }, {
	      key: "getChildById",
	      value: function getChildById(id, boolen) {
	        if (!boolen) {
	          for (var i = 0, len = this.children.length; i < len; i++) {
	            if (this.children[i].id == id) {
	              return this.children[i];
	            }
	          }
	        } else {
	          //深度查询
	          //TODO:暂时未实现
	          return null;
	        }

	        return null;
	      }
	    }, {
	      key: "getChildAt",
	      value: function getChildAt(index) {
	        if (index < 0 || index > this.children.length - 1) return null;
	        return this.children[index];
	      }
	    }, {
	      key: "getChildIndex",
	      value: function getChildIndex(child) {
	        return _mmvis._.indexOf(this.children, child);
	      }
	    }, {
	      key: "setChildIndex",
	      value: function setChildIndex(child, index) {
	        if (child.parent != this) return;

	        var oldIndex = _mmvis._.indexOf(this.children, child);

	        if (index == oldIndex) return;
	        this.children.splice(oldIndex, 1);
	        this.children.splice(index, 0, child);
	      }
	    }, {
	      key: "getNumChildren",
	      value: function getNumChildren() {
	        return this.children.length;
	      }
	    }, {
	      key: "getObjectsUnderPoint",
	      value: function getObjectsUnderPoint(point, num) {
	        var result = [];

	        for (var i = this.children.length - 1; i >= 0; i--) {
	          var child = this.children[i];

	          if (child == null || !child.context.$model.visible) {
	            //不管是集合还是非集合，如果不显示的都不接受点击检测
	            continue;
	          }

	          if (child instanceof DisplayObjectContainer) {
	            if (!child._eventEnabled) {
	              //容易一般默认 _eventEnabled == true; 但是如果被设置成了false
	              //如果容器设置了不接受事件检测，那么下面所有的元素都不接受事件检测
	              continue;
	            }

	            if (child.mouseChildren && child.getNumChildren() > 0) {
	              var objs = child.getObjectsUnderPoint(point);

	              if (objs.length > 0) {
	                result = result.concat(objs);
	              }
	            }
	          } else {
	            if (!child._eventEnabled && !child.dragEnabled) {
	              continue;
	            }

	            if (child.getChildInPoint(point)) {
	              result.push(child);

	              if (num != undefined && !isNaN(num)) {
	                if (result.length == num) {
	                  return result;
	                }
	              }
	            }
	          }
	        }

	        return result;
	      }
	    }]);

	    return DisplayObjectContainer;
	  }(_DisplayObject3["default"]);

	  exports.default = DisplayObjectContainer;
	});
	});

	unwrapExports(DisplayObjectContainer);

	var Stage = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, DisplayObjectContainer, utils);
	  }
	})(void 0, function (exports, _DisplayObjectContainer, _index) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Stage = function (_DisplayObjectContain) {
	    _inherits(Stage, _DisplayObjectContain);

	    function Stage(opt) {
	      var _this;

	      _classCallCheck(this, Stage);

	      opt.type = "stage";
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Stage).call(this, opt));
	      _this.canvas = null;
	      _this.ctx = null; //渲染的时候由renderer决定,这里不做初始值
	      //stage正在渲染中

	      _this.stageRending = false;
	      _this._isReady = false;
	      return _this;
	    } //由canvax的afterAddChild 回调


	    _createClass(Stage, [{
	      key: "initStage",
	      value: function initStage(canvas, width, height) {
	        var self = this;
	        self.canvas = canvas;
	        var model = self.context;
	        model.width = width;
	        model.height = height;
	        model.scaleX = _index2["default"]._devicePixelRatio;
	        model.scaleY = _index2["default"]._devicePixelRatio;
	        self._isReady = true;
	      }
	    }, {
	      key: "heartBeat",
	      value: function heartBeat(opt) {
	        //shape , name , value , preValue 
	        //displayList中某个属性改变了
	        if (!this._isReady) {
	          //在stage还没初始化完毕的情况下，无需做任何处理
	          return;
	        }
	        opt || (opt = {}); //如果opt为空，说明就是无条件刷新

	        opt.stage = this; //TODO临时先这么处理

	        this.parent && this.parent.heartBeat(opt);
	      }
	    }]);

	    return Stage;
	  }(_DisplayObjectContainer2["default"]);

	  exports.default = Stage;
	});
	});

	unwrapExports(Stage);

	var SystemRenderer = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, _const, settings, AnimationFrame, utils, mmvis);
	  }
	})(void 0, function (exports, _const, _settings, _AnimationFrame, _index, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _settings2 = _interopRequireDefault(_settings);

	  var _AnimationFrame2 = _interopRequireDefault(_AnimationFrame);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var SystemRenderer = function () {
	    function SystemRenderer() {
	      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _const.RENDERER_TYPE.UNKNOWN;
	      var app = arguments.length > 1 ? arguments[1] : undefined;
	      var options = arguments.length > 2 ? arguments[2] : undefined;

	      _classCallCheck(this, SystemRenderer);

	      this.type = type; //2canvas,1webgl

	      this.app = app;

	      if (options) {
	        for (var i in _settings2["default"].RENDER_OPTIONS) {
	          if (typeof options[i] === 'undefined') {
	            options[i] = _settings2["default"].RENDER_OPTIONS[i];
	          }
	        }
	      } else {
	        options = _settings2["default"].RENDER_OPTIONS;
	      }

	      this.options = options;
	      this.requestAid = null;
	      this._heartBeat = false; //心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

	      this._preRenderTime = 0;
	    } //如果引擎处于静默状态的话，就会启动


	    _createClass(SystemRenderer, [{
	      key: "startEnter",
	      value: function startEnter() {
	        var self = this;

	        if (!self.requestAid) {
	          self.requestAid = _AnimationFrame2["default"].registFrame({
	            id: "enterFrame",
	            //同时肯定只有一个enterFrame的task
	            task: function task() {
	              self.enterFrame.apply(self);
	            }
	          });
	        }
	      }
	    }, {
	      key: "enterFrame",
	      value: function enterFrame() {
	        var self = this; //不管怎么样，enterFrame执行了就要把
	        //requestAid null 掉

	        self.requestAid = null;
	        _index2["default"].now = new Date().getTime();

	        if (self._heartBeat) {
	          //var _begin = new Date().getTime();
	          this.app.children.length && self.render(this.app); //var _end = new Date().getTime();
	          //$(document.body).append( "<br />render："+ (_end - _begin) );

	          self._heartBeat = false; //渲染完了，打上最新时间挫

	          self._preRenderTime = new Date().getTime();
	        }
	      }
	    }, {
	      key: "_convertCanvax",
	      value: function _convertCanvax(opt) {
	        var me = this;

	        _mmvis._.each(me.app.children, function (stage) {
	          stage.context[opt.name] = opt.value;
	        });
	      }
	    }, {
	      key: "heartBeat",
	      value: function heartBeat(opt) {
	        //displayList中某个属性改变了
	        var self = this;

	        if (opt) {
	          //心跳包有两种，一种是某元素的可视属性改变了。一种是children有变动
	          //分别对应convertType  为 context  and children
	          if (opt.convertType == "context") {
	            var stage = opt.stage;
	            var shape = opt.shape;
	            var name = opt.name;
	            var value = opt.value;
	            var preValue = opt.preValue;

	            if (shape.type == "canvax") {
	              self._convertCanvax(opt);
	            } else {
	              if (!self.app.convertStages[stage.id]) {
	                self.app.convertStages[stage.id] = {
	                  stage: stage,
	                  convertShapes: {}
	                };
	              }

	              if (shape) {
	                if (!self.app.convertStages[stage.id].convertShapes[shape.id]) {
	                  self.app.convertStages[stage.id].convertShapes[shape.id] = {
	                    shape: shape,
	                    convertType: opt.convertType
	                  };
	                } else {
	                  //如果已经上报了该 shape 的心跳。
	                  return;
	                }
	              }
	            }
	          }

	          if (opt.convertType == "children") {
	            //元素结构变化，比如addchild removeChild等
	            var target = opt.target;
	            var stage = opt.src.getStage();

	            if (stage || target.type == "stage") {
	              //如果操作的目标元素是Stage
	              stage = stage || target;

	              if (!self.app.convertStages[stage.id]) {
	                self.app.convertStages[stage.id] = {
	                  stage: stage,
	                  convertShapes: {}
	                };
	              }
	            }
	          }

	          if (!opt.convertType) {
	            //无条件要求刷新
	            var stage = opt.stage;

	            if (!self.app.convertStages[stage.id]) {
	              self.app.convertStages[stage.id] = {
	                stage: stage,
	                convertShapes: {}
	              };
	            }
	          }
	        } else {
	          //无条件要求全部刷新，一般用在resize等。
	          _mmvis._.each(self.app.children, function (stage, i) {
	            self.app.convertStages[stage.id] = {
	              stage: stage,
	              convertShapes: {}
	            };
	          });
	        }

	        if (!self._heartBeat) {
	          //如果发现引擎在静默状态，那么就唤醒引擎
	          self._heartBeat = true;
	          self.startEnter();
	        } else {
	          //否则智慧继续确认心跳
	          self._heartBeat = true;
	        }
	      }
	    }]);

	    return SystemRenderer;
	  }();

	  exports.default = SystemRenderer;
	});
	});

	unwrapExports(SystemRenderer);

	var GraphicsRenderer = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, _const);
	  }
	})(void 0, function (exports, _const) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var CanvasGraphicsRenderer = function () {
	    function CanvasGraphicsRenderer(renderer) {
	      _classCallCheck(this, CanvasGraphicsRenderer);

	      this.renderer = renderer;
	    }
	    /**
	    * @param displayObject
	    * @stage 也可以displayObject.getStage()获取。
	    */


	    _createClass(CanvasGraphicsRenderer, [{
	      key: "render",
	      value: function render(displayObject, stage, globalAlpha, isClip) {
	        var renderer = this.renderer;
	        var graphicsData = displayObject.graphics.graphicsData;
	        var ctx = stage.ctx;

	        for (var i = 0; i < graphicsData.length; i++) {
	          var data = graphicsData[i];
	          var shape = data.shape;
	          var fillStyle = data.fillStyle;
	          var strokeStyle = data.strokeStyle;
	          var fill = data.hasFill() && data.fillAlpha && !isClip;
	          var line = data.hasLine() && data.strokeAlpha && !isClip;
	          ctx.lineWidth = data.lineWidth;

	          if (data.type === _const.SHAPES.POLY) {
	            //只第一次需要beginPath()
	            ctx.beginPath();
	            this.renderPolygon(shape.points, shape.closed, ctx, isClip);

	            if (fill) {
	              ctx.globalAlpha = data.fillAlpha * globalAlpha;
	              ctx.fillStyle = fillStyle;
	              ctx.fill();
	            }

	            if (line) {
	              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
	              ctx.strokeStyle = strokeStyle;
	              ctx.stroke();
	            }
	          } else if (data.type === _const.SHAPES.RECT) {
	            if (isClip) {
	              //ctx.beginPath();
	              //rect本身已经是个close的path
	              ctx.rect(shape.x, shape.y, shape.width, shape.height); //ctx.closePath();
	            }

	            if (fill) {
	              ctx.globalAlpha = data.fillAlpha * globalAlpha;
	              ctx.fillStyle = fillStyle;
	              ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
	            }

	            if (line) {
	              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
	              ctx.strokeStyle = strokeStyle;
	              ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
	            }
	          } else if (data.type === _const.SHAPES.CIRC) {
	            // TODO - 这里应该可以不需要走graphics，而直接设置好radius
	            ctx.beginPath();
	            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
	            ctx.closePath();

	            if (fill) {
	              ctx.globalAlpha = data.fillAlpha * globalAlpha;
	              ctx.fillStyle = fillStyle;
	              ctx.fill();
	            }

	            if (line) {
	              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
	              ctx.strokeStyle = strokeStyle;
	              ctx.stroke();
	            }
	          } else if (data.type === _const.SHAPES.ELIP) {
	            var w = shape.width * 2;
	            var h = shape.height * 2;
	            var x = shape.x - w / 2;
	            var y = shape.y - h / 2;
	            ctx.beginPath();
	            var kappa = 0.5522848;
	            var ox = w / 2 * kappa; // control point offset horizontal

	            var oy = h / 2 * kappa; // control point offset vertical

	            var xe = x + w; // x-end

	            var ye = y + h; // y-end

	            var xm = x + w / 2; // x-middle

	            var ym = y + h / 2; // y-middle

	            ctx.moveTo(x, ym);
	            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	            ctx.closePath();

	            if (fill) {
	              ctx.globalAlpha = data.fillAlpha * globalAlpha;
	              ctx.fillStyle = fillStyle;
	              ctx.fill();
	            }

	            if (line) {
	              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
	              ctx.strokeStyle = strokeStyle;
	              ctx.stroke();
	            }
	          }
	        }
	      }
	    }, {
	      key: "renderPolygon",
	      value: function renderPolygon(points, close, ctx, isClip) {
	        ctx.moveTo(points[0], points[1]);

	        for (var j = 1; j < points.length / 2; ++j) {
	          ctx.lineTo(points[j * 2], points[j * 2 + 1]);
	        }

	        if (close || isClip) {
	          ctx.closePath();
	        }
	      }
	    }]);

	    return CanvasGraphicsRenderer;
	  }();

	  exports.default = CanvasGraphicsRenderer;
	});
	});

	unwrapExports(GraphicsRenderer);

	var CanvasRenderer = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, SystemRenderer, _const, GraphicsRenderer, mmvis);
	  }
	})(void 0, function (exports, _SystemRenderer2, _const, _GraphicsRenderer, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _SystemRenderer3 = _interopRequireDefault(_SystemRenderer2);

	  var _GraphicsRenderer2 = _interopRequireDefault(_GraphicsRenderer);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var CanvasRenderer = function (_SystemRenderer) {
	    _inherits(CanvasRenderer, _SystemRenderer);

	    function CanvasRenderer(app) {
	      var _this;

	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      _classCallCheck(this, CanvasRenderer);

	      _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasRenderer).call(this, _const.RENDERER_TYPE.CANVAS, app, options));
	      _this.CGR = new _GraphicsRenderer2["default"](_assertThisInitialized(_this));
	      return _this;
	    }

	    _createClass(CanvasRenderer, [{
	      key: "render",
	      value: function render(app) {
	        var me = this;
	        me.app = app;

	        _mmvis._.each(_mmvis._.values(app.convertStages), function (convertStage) {
	          me.renderStage(convertStage.stage);
	        });

	        app.convertStages = {};
	      }
	    }, {
	      key: "renderStage",
	      value: function renderStage(stage) {
	        if (!stage.ctx) {
	          stage.ctx = stage.canvas.getContext("2d");
	        }

	        stage.stageRending = true;
	        stage.setWorldTransform();

	        this._clear(stage);

	        this._render(stage, stage, stage.context.globalAlpha);

	        stage.stageRending = false;
	      }
	    }, {
	      key: "_render",
	      value: function _render(stage, displayObject, globalAlpha) {
	        var ctx = stage.ctx;

	        if (!ctx) {
	          return;
	        }
	        var $MC = displayObject.context.$model;

	        if (!displayObject.worldTransform) {
	          //第一次在舞台中渲染
	          displayObject.fire("render");
	        }

	        if (!displayObject.worldTransform || displayObject._transformChange || displayObject.parent && displayObject.parent._transformChange) {
	          displayObject.setWorldTransform();
	          displayObject.fire("transform");
	          displayObject._transformChange = true;
	        }
	        globalAlpha *= $MC.globalAlpha;

	        if (!$MC.visible || displayObject.isClip) {
	          return;
	        }
	        var worldMatrixArr = displayObject.worldTransform.toArray();

	        if (worldMatrixArr) {
	          ctx.setTransform.apply(ctx, worldMatrixArr);
	        } else {
	          //如果这个displayObject的世界矩阵有问题，那么就不绘制了
	          return;
	        }
	        var isClipSave = false;

	        if (displayObject.clip && displayObject.clip.graphics) {
	          //如果这个对象有一个裁剪路径对象，那么就绘制这个裁剪路径
	          var _clip = displayObject.clip;
	          ctx.save();
	          isClipSave = true;

	          if (!_clip.worldTransform || _clip._transformChange || _clip.parent._transformChange) {
	            _clip.setWorldTransform();

	            _clip._transformChange = true;
	          }
	          ctx.setTransform.apply(ctx, _clip.worldTransform.toArray()); //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据

	          if (!_clip.graphics.graphicsData.length) {
	            //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
	            _clip._draw(_clip.graphics); //_draw会完成绘制准备好 graphicsData

	          }
	          this.CGR.render(_clip, stage, globalAlpha, isClipSave);
	          _clip._transformChange = false;
	          ctx.clip();
	        }

	        if (displayObject.graphics) {
	          //如果 graphicsData.length==0 的情况下才需要执行_draw来组织 graphics 数据
	          if (!displayObject.graphics.graphicsData.length) {
	            //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
	            displayObject._draw(displayObject.graphics); //_draw会完成绘制准备好 graphicsData

	          }
	          //事件检测的时候需要用到graphics.graphicsData

	          if (!!globalAlpha) {
	            //默认要设置为实线
	            ctx.setLineDash([]); //然后如果发现这个描边非实线的话，就设置为虚线

	            if ($MC.lineType && $MC.lineType != 'solid') {
	              ctx.setLineDash($MC.lineDash);
	            }
	            this.CGR.render(displayObject, stage, globalAlpha);
	          }
	        }

	        if (displayObject.type == "text") {
	          //如果是文本
	          displayObject.render(ctx, globalAlpha);
	        }

	        if (displayObject.children) {
	          for (var i = 0, len = displayObject.children.length; i < len; i++) {
	            this._render(stage, displayObject.children[i], globalAlpha);
	          }
	        }
	        displayObject._transformChange = false;

	        if (isClipSave) {
	          //如果这个对象有裁剪对象， 则要恢复，裁剪之前的环境
	          ctx.restore();
	        }
	      }
	    }, {
	      key: "_clear",
	      value: function _clear(stage) {
	        var ctx = stage.ctx;
	        ctx.setTransform.apply(ctx, stage.worldTransform.toArray());
	        ctx.clearRect(0, 0, this.app.width, this.app.height);
	      }
	    }]);

	    return CanvasRenderer;
	  }(_SystemRenderer3["default"]);

	  exports.default = CanvasRenderer;
	});
	});

	unwrapExports(CanvasRenderer);

	var autoRenderer = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, CanvasRenderer);
	  }
	})(void 0, function (exports, _CanvasRenderer) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = autoRenderer;

	  var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  //import WebGLRenderer from './webgl/WebGLRenderer';
	  function autoRenderer(app, options) {
	    return new _CanvasRenderer2["default"](app, options);
	    /*
	       if (app.webGL && utils.isWebGLSupported())
	       {
	           return new WebGLRenderer( app , options);
	       };
	       return new CanvasRenderer( app , options);
	       */
	  }
	});
	});

	unwrapExports(autoRenderer);

	var Application = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, utils, DisplayObjectContainer, Stage, autoRenderer, Matrix, mmvis);
	  }
	})(void 0, function (exports, _index, _DisplayObjectContainer, _Stage, _autoRenderer, _Matrix, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _index2 = _interopRequireDefault(_index);

	  var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

	  var _Stage2 = _interopRequireDefault(_Stage);

	  var _autoRenderer2 = _interopRequireDefault(_autoRenderer);

	  var _Matrix2 = _interopRequireDefault(_Matrix);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Application = function (_DisplayObjectContain) {
	    _inherits(Application, _DisplayObjectContain);

	    function Application(opt) {
	      var _this;

	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      _classCallCheck(this, Application);

	      opt.type = "canvax";
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Application).call(this, opt));
	      _this._cid = new Date().getTime() + "_" + Math.floor(Math.random() * 100);
	      _this.el = _mmvis.$.query(opt.el);
	      _this.width = parseInt("width" in opt || _this.el.offsetWidth, 10);
	      _this.height = parseInt("height" in opt || _this.el.offsetHeight, 10);

	      var viewObj = _mmvis.$.createView(_this.width, _this.height, _this._cid);

	      _this.view = viewObj.view;
	      _this.stageView = viewObj.stageView;
	      _this.domView = viewObj.domView;
	      _this.el.innerHTML = "";

	      _this.el.appendChild(_this.view);

	      _this.viewOffset = _mmvis.$.offset(_this.view);
	      _this.lastGetRO = 0; //最后一次获取 viewOffset 的时间

	      _this.webGL = opt.webGL;
	      _this.renderer = (0, _autoRenderer2["default"])(_assertThisInitialized(_this), options);
	      _this.event = null; //该属性在systenRender里面操作，每帧由心跳上报的 需要重绘的stages 列表

	      _this.convertStages = {};
	      _this.context.$model.width = _this.width;
	      _this.context.$model.height = _this.height; //然后创建一个用于绘制激活 shape 的 stage 到activation

	      _this._bufferStage = null;

	      _this._creatHoverStage(); //设置一个默认的matrix做为app的世界根节点坐标


	      _this.worldTransform = new _Matrix2["default"]().identity();
	      return _this;
	    }

	    _createClass(Application, [{
	      key: "registEvent",
	      value: function registEvent(opt) {
	        //初始化事件委托到root元素上面
	        this.event = new _mmvis.event.Handler(this, opt);
	        this.event.init();
	        return this.event;
	      }
	    }, {
	      key: "destroy",
	      value: function destroy() {
	        for (var i = 0, l = this.children.length; i < l; i++) {
	          var stage = this.children[i];
	          stage.destroy();
	          stage.canvas = null;
	          stage.ctx = null;
	          stage = null;
	          i--, l--;
	        }

	        try {
	          this.view.removeChild(this.stageView);
	          this.view.removeChild(this.domView);
	          this.el.removeChild(this.view);
	        } catch (e) {}
	        this.el.innerHTML = "";
	        this.event = null;
	        this._bufferStage = null;
	      }
	    }, {
	      key: "resize",
	      value: function resize(opt) {
	        //重新设置坐标系统 高宽 等。
	        this.width = parseInt(opt && "width" in opt || this.el.offsetWidth, 10);
	        this.height = parseInt(opt && "height" in opt || this.el.offsetHeight, 10); //this.view  width height都一直设置为100%
	        //this.view.style.width  = this.width +"px";
	        //this.view.style.height = this.height+"px";

	        this.viewOffset = _mmvis.$.offset(this.view);
	        this.context.$model.width = this.width;
	        this.context.$model.height = this.height;
	        var me = this;

	        var reSizeCanvas = function reSizeCanvas(canvas) {
	          canvas.style.width = me.width + "px";
	          canvas.style.height = me.height + "px";
	          canvas.setAttribute("width", me.width * _index2["default"]._devicePixelRatio);
	          canvas.setAttribute("height", me.height * _index2["default"]._devicePixelRatio);
	        };

	        _mmvis._.each(this.children, function (s, i) {
	          s.context.$model.width = me.width;
	          s.context.$model.height = me.height;
	          reSizeCanvas(s.canvas);
	        });

	        this.stageView.style.width = this.width + "px";
	        this.stageView.style.height = this.height + "px";
	        this.domView.style.width = this.width + "px";
	        this.domView.style.height = this.height + "px";
	        this.heartBeat();
	      }
	    }, {
	      key: "getHoverStage",
	      value: function getHoverStage() {
	        return this._bufferStage;
	      }
	    }, {
	      key: "_creatHoverStage",
	      value: function _creatHoverStage() {
	        //TODO:创建stage的时候一定要传入width height  两个参数
	        this._bufferStage = new _Stage2["default"]({
	          id: "activCanvas" + new Date().getTime(),
	          context: {
	            width: this.context.$model.width,
	            height: this.context.$model.height
	          }
	        }); //该stage不参与事件检测

	        this._bufferStage._eventEnabled = false;
	        this.addChild(this._bufferStage);
	      }
	    }, {
	      key: "updateViewOffset",
	      value: function updateViewOffset() {
	        var now = new Date().getTime();

	        if (now - this.lastGetRO > 1000) {
	          this.viewOffset = _mmvis.$.offset(this.view);
	          this.lastGetRO = now;
	        }
	      }
	    }, {
	      key: "_afterAddChild",
	      value: function _afterAddChild(stage, index) {
	        var canvas;

	        if (!stage.canvas) {
	          canvas = _mmvis.$.createCanvas(this.context.$model.width, this.context.$model.height, stage.id);
	        } else {
	          canvas = stage.canvas;
	        }

	        if (this.children.length == 1) {
	          this.stageView.appendChild(canvas);
	        } else if (this.children.length > 1) {
	          if (index === undefined) {
	            //如果没有指定位置，那么就放到 _bufferStage 的下面。
	            this.stageView.insertBefore(canvas, this._bufferStage.canvas);
	          } else {
	            //如果有指定的位置，那么就指定的位置来
	            if (index >= this.children.length - 1) {
	              this.stageView.appendChild(canvas);
	            } else {
	              this.stageView.insertBefore(canvas, this.children[index].canvas);
	            }
	          }
	        }

	        _index2["default"].initElement(canvas);

	        stage.initStage(canvas, this.context.$model.width, this.context.$model.height);
	      }
	    }, {
	      key: "_afterDelChild",
	      value: function _afterDelChild(stage) {
	        try {
	          this.stageView.removeChild(stage.canvas);
	        } catch (error) {}
	      }
	    }, {
	      key: "heartBeat",
	      value: function heartBeat(opt) {
	        if (this.children.length > 0) {
	          this.renderer.heartBeat(opt);
	        }
	      }
	    }, {
	      key: "toDataURL",
	      value: function toDataURL() {
	        var canvas = _mmvis.$.createCanvas(this.width, this.height, "curr_base64_canvas");

	        var ctx = canvas.getContext("2d");

	        _mmvis._.each(this.children, function (stage) {
	          ctx.drawImage(stage.canvas, 0, 0);
	        });

	        return canvas.toDataURL();
	      }
	    }]);

	    return Application;
	  }(_DisplayObjectContainer2["default"]);

	  exports.default = Application;
	});
	});

	unwrapExports(Application);

	var Sprite = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, DisplayObjectContainer, utils);
	  }
	})(void 0, function (exports, _DisplayObjectContainer, _index) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Sprite = function (_DisplayObjectContain) {
	    _inherits(Sprite, _DisplayObjectContain);

	    function Sprite(opt) {
	      _classCallCheck(this, Sprite);

	      opt = _index2["default"].checkOpt(opt);
	      opt.type = "sprite";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Sprite).call(this, opt));
	    }

	    return Sprite;
	  }(_DisplayObjectContainer2["default"]);

	  exports.default = Sprite;
	});
	});

	unwrapExports(Sprite);

	var GraphicsData = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var GraphicsData = function () {
	    function GraphicsData(lineWidth, strokeStyle, strokeAlpha, fillStyle, fillAlpha, shape) {
	      _classCallCheck(this, GraphicsData);

	      this.lineWidth = lineWidth;
	      this.strokeStyle = strokeStyle;
	      this.strokeAlpha = strokeAlpha;
	      this.fillStyle = fillStyle;
	      this.fillAlpha = fillAlpha;
	      this.shape = shape;
	      this.type = shape.type;
	      this.holes = []; //这两个可以被后续修改， 具有一票否决权
	      //比如polygon的 虚线描边。必须在fill的poly上面设置line为false

	      this.fill = true;
	      this.line = true;
	    }

	    _createClass(GraphicsData, [{
	      key: "clone",
	      value: function clone() {
	        var cloneGraphicsData = new GraphicsData(this.lineWidth, this.strokeStyle, this.strokeAlpha, this.fillStyle, this.fillAlpha, this.shape);
	        cloneGraphicsData.fill = this.fill;
	        cloneGraphicsData.line = this.line;
	        return cloneGraphicsData;
	      }
	    }, {
	      key: "addHole",
	      value: function addHole(shape) {
	        this.holes.push(shape);
	      }
	    }, {
	      key: "synsStyle",
	      value: function synsStyle(style) {
	        //console.log("line:"+this.line+"__fill:"+this.fill)
	        //从shape中把绘图需要的style属性同步过来
	        if (this.line) {
	          this.lineWidth = style.lineWidth;
	          this.strokeStyle = style.strokeStyle;
	          this.strokeAlpha = style.strokeAlpha;
	        }

	        if (this.fill) {
	          this.fillStyle = style.fillStyle;
	          this.fillAlpha = style.fillAlpha;
	        }
	      }
	    }, {
	      key: "hasFill",
	      value: function hasFill() {
	        return this.fillStyle && this.fill && this.shape.closed !== undefined && this.shape.closed;
	      }
	    }, {
	      key: "hasLine",
	      value: function hasLine() {
	        return this.strokeStyle && this.lineWidth && this.line;
	      }
	    }, {
	      key: "destroy",
	      value: function destroy() {
	        this.shape = null;
	        this.holes = null;
	      }
	    }]);

	    return GraphicsData;
	  }();

	  exports.default = GraphicsData;
	});
	});

	unwrapExports(GraphicsData);

	var Arc = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  var arcToSegmentsCache = {},
	      segmentToBezierCache = {},
	      boundsOfCurveCache = {},
	      _join = Array.prototype.join;
	  /* Adapted from http://dxr.mozilla.org/mozilla-central/source/content/svg/content/src/nsSVGPathDataParser.cpp
	   * by Andrea Bogazzi code is under MPL. if you don't have a copy of the license you can take it here
	   * http://mozilla.org/MPL/2.0/
	   */

	  function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
	    var argsString = _join.call(arguments);

	    if (arcToSegmentsCache[argsString]) {
	      return arcToSegmentsCache[argsString];
	    }

	    var PI = Math.PI,
	        th = rotateX * PI / 180,
	        sinTh = Math.sin(th),
	        cosTh = Math.cos(th),
	        fromX = 0,
	        fromY = 0;
	    rx = Math.abs(rx);
	    ry = Math.abs(ry);
	    var px = -cosTh * toX * 0.5 - sinTh * toY * 0.5,
	        py = -cosTh * toY * 0.5 + sinTh * toX * 0.5,
	        rx2 = rx * rx,
	        ry2 = ry * ry,
	        py2 = py * py,
	        px2 = px * px,
	        pl = rx2 * ry2 - rx2 * py2 - ry2 * px2,
	        root = 0;

	    if (pl < 0) {
	      var s = Math.sqrt(1 - pl / (rx2 * ry2));
	      rx *= s;
	      ry *= s;
	    } else {
	      root = (large === sweep ? -1.0 : 1.0) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
	    }

	    var cx = root * rx * py / ry,
	        cy = -root * ry * px / rx,
	        cx1 = cosTh * cx - sinTh * cy + toX * 0.5,
	        cy1 = sinTh * cx + cosTh * cy + toY * 0.5,
	        mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry),
	        dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);

	    if (sweep === 0 && dtheta > 0) {
	      dtheta -= 2 * PI;
	    } else if (sweep === 1 && dtheta < 0) {
	      dtheta += 2 * PI;
	    } // Convert into cubic bezier segments <= 90deg


	    var segments = Math.ceil(Math.abs(dtheta / PI * 2)),
	        result = [],
	        mDelta = dtheta / segments,
	        mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2),
	        th3 = mTheta + mDelta;

	    for (var i = 0; i < segments; i++) {
	      result[i] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
	      fromX = result[i][4];
	      fromY = result[i][5];
	      mTheta = th3;
	      th3 += mDelta;
	    }

	    arcToSegmentsCache[argsString] = result;
	    return result;
	  }

	  function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
	    var argsString2 = _join.call(arguments);

	    if (segmentToBezierCache[argsString2]) {
	      return segmentToBezierCache[argsString2];
	    }

	    var costh2 = Math.cos(th2),
	        sinth2 = Math.sin(th2),
	        costh3 = Math.cos(th3),
	        sinth3 = Math.sin(th3),
	        toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1,
	        toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1,
	        cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2),
	        cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2),
	        cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3),
	        cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);
	    segmentToBezierCache[argsString2] = [cp1X, cp1Y, cp2X, cp2Y, toX, toY];
	    return segmentToBezierCache[argsString2];
	  }
	  /*
	   * Private
	   */


	  function calcVectorAngle(ux, uy, vx, vy) {
	    var ta = Math.atan2(uy, ux),
	        tb = Math.atan2(vy, vx);

	    if (tb >= ta) {
	      return tb - ta;
	    } else {
	      return 2 * Math.PI - (ta - tb);
	    }
	  }
	  /**
	   * Draws arc
	   * @param {graphics} graphics
	   * @param {Number} fx
	   * @param {Number} fy
	   * @param {Array} coords
	   */


	  var drawArc = function drawArc(graphics, fx, fy, coords) {
	    var rx = coords[0],
	        ry = coords[1],
	        rot = coords[2],
	        large = coords[3],
	        sweep = coords[4],
	        tx = coords[5],
	        ty = coords[6],
	        segs = [[], [], [], []],
	        segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

	    for (var i = 0, len = segsNorm.length; i < len; i++) {
	      segs[i][0] = segsNorm[i][0] + fx;
	      segs[i][1] = segsNorm[i][1] + fy;
	      segs[i][2] = segsNorm[i][2] + fx;
	      segs[i][3] = segsNorm[i][3] + fy;
	      segs[i][4] = segsNorm[i][4] + fx;
	      segs[i][5] = segsNorm[i][5] + fy;
	      graphics.bezierCurveTo.apply(graphics, segs[i]);
	    }
	  };
	  /**
	   * Calculate bounding box of a elliptic-arc
	   * @param {Number} fx start point of arc
	   * @param {Number} fy
	   * @param {Number} rx horizontal radius
	   * @param {Number} ry vertical radius
	   * @param {Number} rot angle of horizontal axe
	   * @param {Number} large 1 or 0, whatever the arc is the big or the small on the 2 points
	   * @param {Number} sweep 1 or 0, 1 clockwise or counterclockwise direction
	   * @param {Number} tx end point of arc
	   * @param {Number} ty
	   */


	  var getBoundsOfArc = function getBoundsOfArc(fx, fy, rx, ry, rot, large, sweep, tx, ty) {
	    var fromX = 0,
	        fromY = 0,
	        bound,
	        bounds = [],
	        segs = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

	    for (var i = 0, len = segs.length; i < len; i++) {
	      bound = getBoundsOfCurve(fromX, fromY, segs[i][0], segs[i][1], segs[i][2], segs[i][3], segs[i][4], segs[i][5]);
	      bounds.push({
	        x: bound[0].x + fx,
	        y: bound[0].y + fy
	      });
	      bounds.push({
	        x: bound[1].x + fx,
	        y: bound[1].y + fy
	      });
	      fromX = segs[i][4];
	      fromY = segs[i][5];
	    }

	    return bounds;
	  };
	  /**
	   * Calculate bounding box of a beziercurve
	   * @param {Number} x0 starting point
	   * @param {Number} y0
	   * @param {Number} x1 first control point
	   * @param {Number} y1
	   * @param {Number} x2 secondo control point
	   * @param {Number} y2
	   * @param {Number} x3 end of beizer
	   * @param {Number} y3
	   */
	  // taken from http://jsbin.com/ivomiq/56/edit  no credits available for that.


	  function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
	    var argsString = _join.call(arguments);

	    if (boundsOfCurveCache[argsString]) {
	      return boundsOfCurveCache[argsString];
	    }

	    var sqrt = Math.sqrt,
	        min = Math.min,
	        max = Math.max,
	        abs = Math.abs,
	        tvalues = [],
	        bounds = [[], []],
	        a,
	        b,
	        c,
	        t,
	        t1,
	        t2,
	        b2ac,
	        sqrtb2ac;
	    b = 6 * x0 - 12 * x1 + 6 * x2;
	    a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
	    c = 3 * x1 - 3 * x0;

	    for (var i = 0; i < 2; ++i) {
	      if (i > 0) {
	        b = 6 * y0 - 12 * y1 + 6 * y2;
	        a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
	        c = 3 * y1 - 3 * y0;
	      }

	      if (abs(a) < 1e-12) {
	        if (abs(b) < 1e-12) {
	          continue;
	        }

	        t = -c / b;

	        if (0 < t && t < 1) {
	          tvalues.push(t);
	        }

	        continue;
	      }

	      b2ac = b * b - 4 * c * a;

	      if (b2ac < 0) {
	        continue;
	      }

	      sqrtb2ac = sqrt(b2ac);
	      t1 = (-b + sqrtb2ac) / (2 * a);

	      if (0 < t1 && t1 < 1) {
	        tvalues.push(t1);
	      }

	      t2 = (-b - sqrtb2ac) / (2 * a);

	      if (0 < t2 && t2 < 1) {
	        tvalues.push(t2);
	      }
	    }

	    var x,
	        y,
	        j = tvalues.length,
	        jlen = j,
	        mt;

	    while (j--) {
	      t = tvalues[j];
	      mt = 1 - t;
	      x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
	      bounds[0][j] = x;
	      y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
	      bounds[1][j] = y;
	    }

	    bounds[0][jlen] = x0;
	    bounds[1][jlen] = y0;
	    bounds[0][jlen + 1] = x3;
	    bounds[1][jlen + 1] = y3;
	    var result = [{
	      x: min.apply(null, bounds[0]),
	      y: min.apply(null, bounds[1])
	    }, {
	      x: max.apply(null, bounds[0]),
	      y: max.apply(null, bounds[1])
	    }];
	    boundsOfCurveCache[argsString] = result;
	    return result;
	  }

	  exports["default"] = {
	    drawArc: drawArc,
	    getBoundsOfCurve: getBoundsOfCurve,
	    getBoundsOfArc: getBoundsOfArc
	  };
	});
	});

	unwrapExports(Arc);

	var Rectangle = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, _const);
	  }
	})(void 0, function (exports, _const) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var Rectangle = function () {
	    function Rectangle() {
	      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	      _classCallCheck(this, Rectangle);

	      this.x = x;
	      this.y = y;
	      this.width = width;
	      this.height = height;
	      this.type = _const.SHAPES.RECT;
	      this.closed = true;
	    }

	    _createClass(Rectangle, [{
	      key: "clone",
	      value: function clone() {
	        return new Rectangle(this.x, this.y, this.width, this.height);
	      }
	    }, {
	      key: "copy",
	      value: function copy(rectangle) {
	        this.x = rectangle.x;
	        this.y = rectangle.y;
	        this.width = rectangle.width;
	        this.height = rectangle.height;
	        return this;
	      }
	    }, {
	      key: "contains",
	      value: function contains(x, y) {
	        /*
	        if (this.width <= 0 || this.height <= 0)
	        {
	            return false;
	        }
	        */
	        if (this.height * y < 0 || this.width * x < 0) {
	          return false;
	        }

	        if (x >= this.x && x <= this.x + this.width && (this.height >= 0 && y >= this.y && y <= this.y + this.height || this.height < 0 && y <= this.y && y >= this.y + this.height)) {
	          return true;
	        }

	        return false; //当x和 width , y和height都 为正或者都未负数的情况下，才可能在范围内
	      }
	    }]);

	    return Rectangle;
	  }();

	  exports.default = Rectangle;
	});
	});

	unwrapExports(Rectangle);

	var Circle = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Rectangle, _const);
	  }
	})(void 0, function (exports, _Rectangle, _const) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Rectangle2 = _interopRequireDefault(_Rectangle);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var Circle = function () {
	    function Circle() {
	      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	      _classCallCheck(this, Circle);

	      this.x = x;
	      this.y = y;
	      this.radius = radius;
	      this.type = _const.SHAPES.CIRC;
	      this.closed = true;
	    }

	    _createClass(Circle, [{
	      key: "clone",
	      value: function clone() {
	        return new Circle(this.x, this.y, this.radius);
	      }
	    }, {
	      key: "contains",
	      value: function contains(x, y) {
	        if (this.radius <= 0) {
	          return false;
	        }

	        var r2 = this.radius * this.radius;
	        var dx = this.x - x;
	        var dy = this.y - y;
	        dx *= dx;
	        dy *= dy;
	        return dx + dy <= r2;
	      }
	    }, {
	      key: "getBounds",
	      value: function getBounds() {
	        return new _Rectangle2["default"](this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
	      }
	    }]);

	    return Circle;
	  }();

	  exports.default = Circle;
	});
	});

	unwrapExports(Circle);

	var Ellipse = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Rectangle, _const);
	  }
	})(void 0, function (exports, _Rectangle, _const) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Rectangle2 = _interopRequireDefault(_Rectangle);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var Ellipse = function () {
	    function Ellipse() {
	      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	      _classCallCheck(this, Ellipse);

	      this.x = x;
	      this.y = y;
	      this.width = width;
	      this.height = height;
	      this.type = _const.SHAPES.ELIP;
	      this.closed = true;
	    }

	    _createClass(Ellipse, [{
	      key: "clone",
	      value: function clone() {
	        return new Ellipse(this.x, this.y, this.width, this.height);
	      }
	    }, {
	      key: "contains",
	      value: function contains(x, y) {
	        if (this.width <= 0 || this.height <= 0) {
	          return false;
	        }

	        var normx = (x - this.x) / this.width;
	        var normy = (y - this.y) / this.height;
	        normx *= normx;
	        normy *= normy;
	        return normx + normy <= 1;
	      }
	    }, {
	      key: "getBounds",
	      value: function getBounds() {
	        return new _Rectangle2["default"](this.x - this.width, this.y - this.height, this.width, this.height);
	      }
	    }]);

	    return Ellipse;
	  }();

	  exports.default = Ellipse;
	});
	});

	unwrapExports(Ellipse);

	var Polygon = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, _const);
	  }
	})(void 0, function (exports, _const) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var Polygon = function () {
	    function Polygon() {
	      for (var _len = arguments.length, points = new Array(_len), _key = 0; _key < _len; _key++) {
	        points[_key] = arguments[_key];
	      }

	      _classCallCheck(this, Polygon);

	      var point_0 = points[0];

	      if (Array.isArray(point_0)) {
	        points = point_0;
	      }

	      if (point_0 && "x" in point_0 && "y" in point_0) {
	        var p = [];

	        for (var i = 0, il = points.length; i < il; i++) {
	          p.push(points[i].x, points[i].y);
	        }

	        points = p;
	      }

	      this.closed = true;
	      this.points = points;
	      this.type = _const.SHAPES.POLY;
	    }

	    _createClass(Polygon, [{
	      key: "clone",
	      value: function clone() {
	        return new Polygon(this.points.slice());
	      }
	    }, {
	      key: "close",
	      value: function close() {
	        var points = this.points;

	        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
	          points.push(points[0], points[1]);
	        }

	        this.closed = true;
	      }
	    }, {
	      key: "contains",
	      value: function contains(x, y) {
	        return this._isInsidePolygon_WindingNumber(x, y);
	      }
	    }, {
	      key: "_isInsidePolygon_WindingNumber",
	      value: function _isInsidePolygon_WindingNumber(x, y) {
	        var points = this.points;
	        var wn = 0;

	        for (var shiftP, shift = points[1] > y, i = 3; i < points.length; i += 2) {
	          shiftP = shift;
	          shift = points[i] > y;

	          if (shiftP != shift) {
	            var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);

	            if (n * ((points[i - 3] - x) * (points[i - 0] - y) - (points[i - 2] - y) * (points[i - 1] - x)) > 0) {
	              wn += n;
	            }
	          }
	        }
	        return wn;
	      }
	    }]);

	    return Polygon;
	  }();

	  exports.default = Polygon;
	});
	});

	unwrapExports(Polygon);

	var math = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Arc, Circle, Ellipse, Polygon, Rectangle);
	  }
	})(void 0, function (exports, _Arc, _Circle, _Ellipse, _Polygon, _Rectangle) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  Object.defineProperty(exports, "Arc", {
	    enumerable: true,
	    get: function () {
	      return _interopRequireDefault(_Arc).default;
	    }
	  });
	  Object.defineProperty(exports, "Circle", {
	    enumerable: true,
	    get: function () {
	      return _interopRequireDefault(_Circle).default;
	    }
	  });
	  Object.defineProperty(exports, "Ellipse", {
	    enumerable: true,
	    get: function () {
	      return _interopRequireDefault(_Ellipse).default;
	    }
	  });
	  Object.defineProperty(exports, "Polygon", {
	    enumerable: true,
	    get: function () {
	      return _interopRequireDefault(_Polygon).default;
	    }
	  });
	  Object.defineProperty(exports, "Rectangle", {
	    enumerable: true,
	    get: function () {
	      return _interopRequireDefault(_Rectangle).default;
	    }
	  });

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }
	});
	});

	unwrapExports(math);

	var bezierCurveTo = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(void 0, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = bezierCurveTo;

	  function bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
	    var path = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
	    var n = 20;
	    var dt = 0;
	    var dt2 = 0;
	    var dt3 = 0;
	    var t2 = 0;
	    var t3 = 0;
	    path.push(fromX, fromY);

	    for (var i = 1, j = 0; i <= n; ++i) {
	      j = i / n;
	      dt = 1 - j;
	      dt2 = dt * dt;
	      dt3 = dt2 * dt;
	      t2 = j * j;
	      t3 = t2 * j;
	      path.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
	    }

	    return path;
	  }
	});
	});

	unwrapExports(bezierCurveTo);

	var Graphics = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, GraphicsData, math, _const, bezierCurveTo, mmvis);
	  }
	})(void 0, function (exports, _GraphicsData, _index, _const, _bezierCurveTo2, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _GraphicsData2 = _interopRequireDefault(_GraphicsData);

	  var _bezierCurveTo3 = _interopRequireDefault(_bezierCurveTo2);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  var Graphics = function () {
	    function Graphics(shape) {
	      _classCallCheck(this, Graphics);

	      this.lineWidth = 1;
	      this.strokeStyle = null;
	      this.strokeAlpha = 1;
	      this.fillStyle = null;
	      this.fillAlpha = 1; //比如path m 0 0 l 0 0 m 1 1 l 1 1
	      //就会有两条graphicsData数据产生

	      this.graphicsData = [];
	      this.currentPath = null;
	      this.dirty = 0; //用于检测图形对象是否已更改。 如果这是设置为true，那么图形对象将被重新计算。

	      this.clearDirty = 0; //用于检测我们是否清除了图形webGL数据

	      this._webGL = {};
	      this.worldAlpha = 1;
	      this.tint = 0xFFFFFF; //目标对象附加颜色

	      this.Bound = {
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	      };
	    }

	    _createClass(Graphics, [{
	      key: "setStyle",
	      value: function setStyle(context) {
	        //从 shape 中把绘图需要的style属性同步过来
	        var model = context.$model;
	        this.lineWidth = model.lineWidth;
	        this.strokeStyle = model.strokeStyle;
	        this.strokeAlpha = model.strokeAlpha * model.globalAlpha;
	        this.fillStyle = model.fillStyle;
	        this.fillAlpha = model.fillAlpha * model.globalAlpha;
	        var g = this; //一般都是先设置好style的，所以 ， 当后面再次设置新的style的时候
	        //会把所有的data都修改
	        //TODO: 后面需要修改, 能精准的确定是修改 graphicsData 中的哪个data

	        if (this.graphicsData.length) {
	          _mmvis._.each(this.graphicsData, function (gd, i) {
	            gd.synsStyle(g);
	          });
	        }
	      }
	    }, {
	      key: "clone",
	      value: function clone() {
	        var clone = new Graphics();
	        clone.dirty = 0; // copy graphics data

	        for (var i = 0; i < this.graphicsData.length; ++i) {
	          clone.graphicsData.push(this.graphicsData[i].clone());
	        }

	        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];
	        return clone;
	      }
	    }, {
	      key: "moveTo",
	      value: function moveTo(x, y) {
	        var shape = new _index.Polygon([x, y]);
	        shape.closed = false;
	        this.drawShape(shape);
	        return this;
	      }
	    }, {
	      key: "lineTo",
	      value: function lineTo(x, y) {
	        if (this.currentPath) {
	          this.currentPath.shape.points.push(x, y);
	          this.dirty++;
	        } else {
	          this.moveTo(0, 0);
	        }

	        return this;
	      }
	    }, {
	      key: "quadraticCurveTo",
	      value: function quadraticCurveTo(cpX, cpY, toX, toY) {
	        if (this.currentPath) {
	          if (this.currentPath.shape.points.length === 0) {
	            this.currentPath.shape.points = [0, 0];
	          }
	        } else {
	          this.moveTo(0, 0);
	        }

	        var n = 20;
	        var points = this.currentPath.shape.points;
	        var xa = 0;
	        var ya = 0;

	        if (points.length === 0) {
	          this.moveTo(0, 0);
	        }

	        var fromX = points[points.length - 2];
	        var fromY = points[points.length - 1];

	        for (var i = 1; i <= n; ++i) {
	          var j = i / n;
	          xa = fromX + (cpX - fromX) * j;
	          ya = fromY + (cpY - fromY) * j;
	          points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
	        }

	        this.dirty++;
	        return this;
	      }
	    }, {
	      key: "bezierCurveTo",
	      value: function bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
	        if (this.currentPath) {
	          if (this.currentPath.shape.points.length === 0) {
	            this.currentPath.shape.points = [0, 0];
	          }
	        } else {
	          this.moveTo(0, 0);
	        }

	        var points = this.currentPath.shape.points;
	        var fromX = points[points.length - 2];
	        var fromY = points[points.length - 1];
	        points.length -= 2;
	        (0, _bezierCurveTo3["default"])(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);
	        this.dirty++;
	        return this;
	      }
	    }, {
	      key: "arcTo",
	      value: function arcTo(x1, y1, x2, y2, radius) {
	        if (this.currentPath) {
	          if (this.currentPath.shape.points.length === 0) {
	            this.currentPath.shape.points.push(x1, y1);
	          }
	        } else {
	          this.moveTo(x1, y1);
	        }

	        var points = this.currentPath.shape.points;
	        var fromX = points[points.length - 2];
	        var fromY = points[points.length - 1];
	        var a1 = fromY - y1;
	        var b1 = fromX - x1;
	        var a2 = y2 - y1;
	        var b2 = x2 - x1;
	        var mm = Math.abs(a1 * b2 - b1 * a2);

	        if (mm < 1.0e-8 || radius === 0) {
	          if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
	            points.push(x1, y1);
	          }
	        } else {
	          var dd = a1 * a1 + b1 * b1;
	          var cc = a2 * a2 + b2 * b2;
	          var tt = a1 * a2 + b1 * b2;
	          var k1 = radius * Math.sqrt(dd) / mm;
	          var k2 = radius * Math.sqrt(cc) / mm;
	          var j1 = k1 * tt / dd;
	          var j2 = k2 * tt / cc;
	          var cx = k1 * b2 + k2 * b1;
	          var cy = k1 * a2 + k2 * a1;
	          var px = b1 * (k2 + j1);
	          var py = a1 * (k2 + j1);
	          var qx = b2 * (k1 + j2);
	          var qy = a2 * (k1 + j2);
	          var startAngle = Math.atan2(py - cy, px - cx);
	          var endAngle = Math.atan2(qy - cy, qx - cx);
	          this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
	        }

	        this.dirty++;
	        return this;
	      }
	    }, {
	      key: "arc",
	      value: function arc(cx, cy, radius, startAngle, endAngle) {
	        var anticlockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	        if (startAngle === endAngle) {
	          return this;
	        }

	        if (!anticlockwise && endAngle <= startAngle) {
	          endAngle += Math.PI * 2;
	        } else if (anticlockwise && startAngle <= endAngle) {
	          startAngle += Math.PI * 2;
	        }

	        var sweep = endAngle - startAngle;
	        var segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 48;

	        if (sweep === 0) {
	          return this;
	        }

	        var startX = cx + Math.cos(startAngle) * radius;
	        var startY = cy + Math.sin(startAngle) * radius; // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.

	        var points = this.currentPath ? this.currentPath.shape.points : null;

	        if (points) {
	          if (points[points.length - 2] !== startX || points[points.length - 1] !== startY) {
	            points.push(startX, startY);
	          }
	        } else {
	          this.moveTo(startX, startY);
	          points = this.currentPath.shape.points;
	        }

	        var theta = sweep / (segs * 2);
	        var theta2 = theta * 2;
	        var cTheta = Math.cos(theta);
	        var sTheta = Math.sin(theta);
	        var segMinus = segs - 1;
	        var remainder = segMinus % 1 / segMinus;

	        for (var i = 0; i <= segMinus; ++i) {
	          var real = i + remainder * i;
	          var angle = theta + startAngle + theta2 * real;
	          var c = Math.cos(angle);
	          var s = -Math.sin(angle);
	          points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
	        }

	        this.dirty++;
	        return this;
	      }
	    }, {
	      key: "drawRect",
	      value: function drawRect(x, y, width, height) {
	        this.drawShape(new _index.Rectangle(x, y, width, height));
	        return this;
	      }
	    }, {
	      key: "drawCircle",
	      value: function drawCircle(x, y, radius) {
	        this.drawShape(new _index.Circle(x, y, radius));
	        return this;
	      }
	    }, {
	      key: "drawEllipse",
	      value: function drawEllipse(x, y, width, height) {
	        this.drawShape(new _index.Ellipse(x, y, width, height));
	        return this;
	      }
	    }, {
	      key: "drawPolygon",
	      value: function drawPolygon(path) {
	        // prevents an argument assignment deopt
	        // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
	        var points = path;
	        var closed = true;

	        if (points instanceof _index.Polygon) {
	          closed = points.closed;
	          points = points.points;
	        }

	        if (!Array.isArray(points)) {
	          // prevents an argument leak deopt
	          // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
	          points = new Array(arguments.length);

	          for (var i = 0; i < points.length; ++i) {
	            points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
	          }
	        }

	        var shape = new _index.Polygon(points);
	        shape.closed = closed;
	        this.drawShape(shape);
	        return this;
	      }
	    }, {
	      key: "clear",
	      value: function clear() {
	        if (this.graphicsData.length > 0) {
	          this.dirty++;
	          this.clearDirty++;
	          this.graphicsData.length = 0;
	        }

	        this.currentPath = null;
	        return this;
	      }
	    }, {
	      key: "drawShape",
	      value: function drawShape(shape) {
	        if (this.currentPath) {
	          if (this.currentPath.shape.points.length <= 2) {
	            this.graphicsData.pop();
	          }
	        } //this.currentPath = null;


	        this.beginPath();
	        var data = new _GraphicsData2["default"](this.lineWidth, this.strokeStyle, this.strokeAlpha, this.fillStyle, this.fillAlpha, shape);
	        this.graphicsData.push(data);

	        if (data.type === _const.SHAPES.POLY) {
	          data.shape.closed = data.shape.closed;
	          this.currentPath = data;
	        }

	        this.dirty++;
	        return data;
	      }
	    }, {
	      key: "beginPath",
	      value: function beginPath() {
	        this.currentPath = null;
	      }
	    }, {
	      key: "closePath",
	      value: function closePath() {
	        var currentPath = this.currentPath;

	        if (currentPath && currentPath.shape) {
	          currentPath.shape.close();
	        }

	        return this;
	      }
	    }, {
	      key: "updateLocalBounds",
	      value: function updateLocalBounds() {
	        var minX = Infinity;
	        var maxX = -Infinity;
	        var minY = Infinity;
	        var maxY = -Infinity;

	        if (this.graphicsData.length) {
	          var shape = 0;
	          var x = 0;
	          var y = 0;
	          var w = 0;
	          var h = 0;

	          for (var i = 0; i < this.graphicsData.length; i++) {
	            var data = this.graphicsData[i];
	            var type = data.type;
	            var lineWidth = data.lineWidth;
	            shape = data.shape;

	            if (type === _const.SHAPES.RECT || type === _const.SHAPES.RREC) {
	              x = shape.x - lineWidth / 2;
	              y = shape.y - lineWidth / 2;
	              w = shape.width + lineWidth;
	              h = shape.height + lineWidth;
	              minX = x < minX ? x : minX;
	              maxX = x + w > maxX ? x + w : maxX;
	              minY = y < minY ? y : minY;
	              maxY = y + h > maxY ? y + h : maxY;
	            } else if (type === _const.SHAPES.CIRC) {
	              x = shape.x;
	              y = shape.y;
	              w = shape.radius + lineWidth / 2;
	              h = shape.radius + lineWidth / 2;
	              minX = x - w < minX ? x - w : minX;
	              maxX = x + w > maxX ? x + w : maxX;
	              minY = y - h < minY ? y - h : minY;
	              maxY = y + h > maxY ? y + h : maxY;
	            } else if (type === _const.SHAPES.ELIP) {
	              x = shape.x;
	              y = shape.y;
	              w = shape.width + lineWidth / 2;
	              h = shape.height + lineWidth / 2;
	              minX = x - w < minX ? x - w : minX;
	              maxX = x + w > maxX ? x + w : maxX;
	              minY = y - h < minY ? y - h : minY;
	              maxY = y + h > maxY ? y + h : maxY;
	            } else {
	              // POLY
	              var points = shape.points;
	              var x2 = 0;
	              var y2 = 0;
	              var dx = 0;
	              var dy = 0;
	              var rw = 0;
	              var rh = 0;
	              var cx = 0;
	              var cy = 0;

	              for (var j = 0; j + 2 < points.length; j += 2) {
	                x = points[j];
	                y = points[j + 1];
	                x2 = points[j + 2];
	                y2 = points[j + 3];
	                dx = Math.abs(x2 - x);
	                dy = Math.abs(y2 - y);
	                h = lineWidth;
	                w = Math.sqrt(dx * dx + dy * dy);

	                if (w < 1e-9) {
	                  continue;
	                }

	                rw = (h / w * dy + dx) / 2;
	                rh = (h / w * dx + dy) / 2;
	                cx = (x2 + x) / 2;
	                cy = (y2 + y) / 2;
	                minX = cx - rw < minX ? cx - rw : minX;
	                maxX = cx + rw > maxX ? cx + rw : maxX;
	                minY = cy - rh < minY ? cy - rh : minY;
	                maxY = cy + rh > maxY ? cy + rh : maxY;
	              }
	            }
	          }
	        } else {
	          minX = 0;
	          maxX = 0;
	          minY = 0;
	          maxY = 0;
	        }

	        this.Bound = {
	          x: minX,
	          y: minY,
	          width: maxX - minX,
	          height: maxY - minY
	        };
	        return this;
	      }
	    }, {
	      key: "getBound",
	      value: function getBound() {
	        return this.updateLocalBounds().Bound;
	      }
	    }, {
	      key: "destroy",
	      value: function destroy(options) {
	        for (var i = 0; i < this.graphicsData.length; ++i) {
	          this.graphicsData[i].destroy();
	        }

	        for (var id in this._webGL) {
	          for (var j = 0; j < this._webGL[id].data.length; ++j) {
	            this._webGL[id].data[j].destroy();
	          }
	        }

	        this.graphicsData = null;
	        this.currentPath = null;
	        this._webGL = null;
	      }
	    }]);

	    return Graphics;
	  }();

	  exports.default = Graphics;
	});
	});

	unwrapExports(Graphics);

	var Shape = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, DisplayObject, utils, mmvis, _const, Graphics);
	  }
	})(void 0, function (exports, _DisplayObject2, _index, _mmvis, _const, _Graphics) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

	  var _index2 = _interopRequireDefault(_index);

	  var _Graphics2 = _interopRequireDefault(_Graphics);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Shape = function (_DisplayObject) {
	    _inherits(Shape, _DisplayObject);

	    function Shape(opt) {
	      var _this;

	      _classCallCheck(this, Shape);

	      opt = _index2["default"].checkOpt(opt);
	      var styleContext = {
	        cursor: opt.context.cursor || "default",
	        fillAlpha: opt.context.fillAlpha || 1,
	        //context2d里没有，自定义
	        fillStyle: opt.context.fillStyle || null,
	        //"#000000",
	        lineCap: opt.context.lineCap || "round",
	        //默认都是直角
	        lineJoin: opt.context.lineJoin || "round",
	        //这两个目前webgl里面没实现
	        miterLimit: opt.context.miterLimit || null,
	        //miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。
	        strokeAlpha: opt.context.strokeAlpha || 1,
	        //context2d里没有，自定义
	        strokeStyle: opt.context.strokeStyle || null,
	        lineType: opt.context.lineType || "solid",
	        //context2d里没有，自定义线条的type，默认为实线
	        lineDash: opt.context.lineDash || [6, 3],
	        lineWidth: opt.context.lineWidth || null
	      };

	      var _context = _mmvis._.extend(true, styleContext, opt.context);

	      opt.context = _context;

	      if (opt.id === undefined && opt.type !== undefined) {
	        opt.id = _index2["default"].createId(opt.type);
	      }
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Shape).call(this, opt)); //over的时候如果有修改样式，就为true

	      _this._hoverClass = false;
	      _this.hoverClone = true; //是否开启在hover的时候clone一份到active stage 中 

	      _this.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

	      _this._eventEnabled = false; //是否响应事件交互,在添加了事件侦听后会自动设置为true

	      _this.dragEnabled = opt.dragEnabled || false; //"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽
	      //拖拽drag的时候显示在activShape的副本

	      _this._dragDuplicate = null;
	      _this.type = _this.type || "shape"; //处理所有的图形一些共有的属性配置,把除开id,context之外的所有属性，全部挂载到this上面

	      _this.initCompProperty(opt); //如果该元素是clone而来，则不需要绘制


	      if (!_this.isClone) {
	        //如果是clone对象的话就直接
	        _this.graphics = new _Graphics2["default"]();

	        _this._draw(_this.graphics);
	      } else {
	        _this.graphics = null;
	      }

	      return _this;
	    }

	    _createClass(Shape, [{
	      key: "_draw",
	      value: function _draw(graphics) {
	        if (graphics.graphicsData.length == 0) {
	          //先设置好当前graphics的style
	          graphics.setStyle(this.context);
	          this.draw(graphics);
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw() {}
	    }, {
	      key: "clearGraphicsData",
	      value: function clearGraphicsData() {
	        this.graphics.clear();
	      }
	    }, {
	      key: "$watch",
	      value: function $watch(name, value, preValue) {
	        if (_mmvis._.indexOf(_const.STYLE_PROPS, name) > -1) {
	          this.graphics.setStyle(this.context);
	        }

	        this.watch(name, value, preValue);
	      }
	    }, {
	      key: "initCompProperty",
	      value: function initCompProperty(opt) {
	        for (var i in opt) {
	          if (i != "id" && i != "context") {
	            this[i] = opt[i];
	          }
	        }
	      }
	    }, {
	      key: "getBound",
	      value: function getBound() {
	        return this.graphics.updateLocalBounds().Bound;
	      }
	    }]);

	    return Shape;
	  }(_DisplayObject3["default"]);

	  exports.default = Shape;
	});
	});

	unwrapExports(Shape);

	var Text = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, DisplayObject, utils, mmvis);
	  }
	})(void 0, function (exports, _DisplayObject2, _index, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Text = function (_DisplayObject) {
	    _inherits(Text, _DisplayObject);

	    function Text(text, opt) {
	      var _this;

	      _classCallCheck(this, Text);

	      opt.type = "text";

	      if (text === null || text === undefined) {
	        text = "";
	      }
	      opt.context = _mmvis._.extend({
	        font: "",
	        fontSize: 13,
	        //字体大小默认13
	        fontWeight: "normal",
	        fontFamily: "微软雅黑,sans-serif",
	        textBaseline: "top",
	        textAlign: "left",
	        textDecoration: null,
	        fillStyle: 'blank',
	        strokeStyle: null,
	        lineWidth: 0,
	        lineHeight: 1.2,
	        backgroundColor: null,
	        textBackgroundColor: null
	      }, opt.context);
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, opt));
	      _this._reNewline = /\r?\n/;
	      _this.fontProperts = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"];
	      _this.context.font = _this._getFontDeclaration();
	      _this.text = text.toString();
	      _this.context.width = _this.getTextWidth();
	      _this.context.height = _this.getTextHeight();
	      return _this;
	    }

	    _createClass(Text, [{
	      key: "$watch",
	      value: function $watch(name, value, preValue) {
	        //context属性有变化的监听函数
	        if (_mmvis._.indexOf(this.fontProperts, name) >= 0) {
	          this.context[name] = value; //如果修改的是font的某个内容，就重新组装一遍font的值，
	          //然后通知引擎这次对context的修改上报心跳

	          this.context.font = this._getFontDeclaration();
	          this.context.width = this.getTextWidth();
	          this.context.height = this.getTextHeight();
	        }
	      }
	    }, {
	      key: "_setContextStyle",
	      value: function _setContextStyle(ctx, style, globalAlpha) {
	        // 简单判断不做严格类型检测
	        for (var p in style) {
	          if (p != "textBaseline" && p in ctx) {
	            if (style[p] || _mmvis._.isNumber(style[p])) {
	              if (p == "globalAlpha") {
	                //透明度要从父节点继承
	                //ctx[p] = style[p] * globalAlpha; //render里面已经做过相乘了，不需要重新*
	                ctx.globalAlpha = globalAlpha;
	              } else {
	                ctx[p] = style[p];
	              }
	            }
	          }
	        }
	        return;
	      }
	    }, {
	      key: "render",
	      value: function render(ctx, globalAlpha) {
	        this._renderText(ctx, this._getTextLines(), globalAlpha);
	      }
	    }, {
	      key: "resetText",
	      value: function resetText(text) {
	        this.text = text.toString();
	        this.heartBeat();
	      }
	    }, {
	      key: "getTextWidth",
	      value: function getTextWidth() {
	        var width = 0;

	        if (_index2["default"]._pixelCtx) {
	          _index2["default"]._pixelCtx.save();

	          _index2["default"]._pixelCtx.font = this.context.$model.font;
	          width = this._getTextWidth(_index2["default"]._pixelCtx, this._getTextLines());

	          _index2["default"]._pixelCtx.restore();
	        }
	        return width;
	      }
	    }, {
	      key: "getTextHeight",
	      value: function getTextHeight() {
	        return this._getTextHeight(_index2["default"]._pixelCtx, this._getTextLines());
	      }
	    }, {
	      key: "_getTextLines",
	      value: function _getTextLines() {
	        return this.text.split(this._reNewline);
	      }
	    }, {
	      key: "_renderText",
	      value: function _renderText(ctx, textLines, globalAlpha) {
	        if (!ctx) return;
	        ctx.save();

	        this._setContextStyle(ctx, this.context.$model, globalAlpha);

	        this._renderTextStroke(ctx, textLines);

	        this._renderTextFill(ctx, textLines);

	        ctx.restore();
	      }
	    }, {
	      key: "_getFontDeclaration",
	      value: function _getFontDeclaration() {
	        var self = this;
	        var fontArr = [];

	        _mmvis._.each(this.fontProperts, function (p) {
	          var fontP = self.context[p];

	          if (p == "fontSize") {
	            fontP = parseFloat(fontP) + "px";
	          }

	          fontP && fontArr.push(fontP);
	        });

	        return fontArr.join(' ');
	      }
	    }, {
	      key: "_renderTextFill",
	      value: function _renderTextFill(ctx, textLines) {
	        if (!this.context.$model.fillStyle) return;
	        this._boundaries = [];
	        var lineHeights = 0;

	        for (var i = 0, len = textLines.length; i < len; i++) {
	          var heightOfLine = this._getHeightOfLine(ctx, i, textLines);

	          lineHeights += heightOfLine;

	          this._renderTextLine('fillText', ctx, textLines[i], 0, //this._getLeftOffset(),
	          this._getTopOffset() + lineHeights, i);
	        }
	      }
	    }, {
	      key: "_renderTextStroke",
	      value: function _renderTextStroke(ctx, textLines) {
	        if (!ctx) return;
	        if (!this.context.$model.strokeStyle || !this.context.$model.lineWidth) return;
	        var lineHeights = 0;
	        ctx.save();

	        if (this.strokeDashArray) {
	          if (1 & this.strokeDashArray.length) {
	            this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
	          }

	          supportsLineDash && ctx.setLineDash(this.strokeDashArray);
	        }

	        ctx.beginPath();

	        for (var i = 0, len = textLines.length; i < len; i++) {
	          var heightOfLine = this._getHeightOfLine(ctx, i, textLines);

	          lineHeights += heightOfLine;

	          this._renderTextLine('strokeText', ctx, textLines[i], 0, //this._getLeftOffset(),
	          this._getTopOffset() + lineHeights, i);
	        }

	        ctx.closePath();
	        ctx.restore();
	      }
	    }, {
	      key: "_renderTextLine",
	      value: function _renderTextLine(method, ctx, line, left, top, lineIndex) {
	        top -= this._getHeightOfLine() / 4;

	        if (this.context.$model.textAlign !== 'justify') {
	          this._renderChars(method, ctx, line, left, top, lineIndex);

	          return;
	        }
	        var lineWidth = ctx.measureText(line).width;
	        var totalWidth = this.context.$model.width;

	        if (totalWidth > lineWidth) {
	          var words = line.split(/\s+/);
	          var wordsWidth = ctx.measureText(line.replace(/\s+/g, '')).width;
	          var widthDiff = totalWidth - wordsWidth;
	          var numSpaces = words.length - 1;
	          var spaceWidth = widthDiff / numSpaces;
	          var leftOffset = 0;

	          for (var i = 0, len = words.length; i < len; i++) {
	            this._renderChars(method, ctx, words[i], left + leftOffset, top, lineIndex);

	            leftOffset += ctx.measureText(words[i]).width + spaceWidth;
	          }
	        } else {
	          this._renderChars(method, ctx, line, left, top, lineIndex);
	        }
	      }
	    }, {
	      key: "_renderChars",
	      value: function _renderChars(method, ctx, chars, left, top) {
	        ctx[method](chars, 0, top);
	      }
	    }, {
	      key: "_getHeightOfLine",
	      value: function _getHeightOfLine() {
	        return this.context.$model.fontSize * this.context.$model.lineHeight;
	      }
	    }, {
	      key: "_getTextWidth",
	      value: function _getTextWidth(ctx, textLines) {
	        var maxWidth = ctx.measureText(textLines[0] || '|').width;

	        for (var i = 1, len = textLines.length; i < len; i++) {
	          var currentLineWidth = ctx.measureText(textLines[i]).width;

	          if (currentLineWidth > maxWidth) {
	            maxWidth = currentLineWidth;
	          }
	        }

	        return maxWidth;
	      }
	    }, {
	      key: "_getTextHeight",
	      value: function _getTextHeight(ctx, textLines) {
	        return this.context.$model.fontSize * textLines.length * this.context.$model.lineHeight;
	      }
	    }, {
	      key: "_getTopOffset",
	      value: function _getTopOffset() {
	        var t = 0;

	        switch (this.context.$model.textBaseline) {
	          case "top":
	            t = 0;
	            break;

	          case "middle":
	            t = -this.context.$model.height / 2;
	            break;

	          case "bottom":
	            t = -this.context.$model.height;
	            break;
	        }

	        return t;
	      }
	    }, {
	      key: "getRect",
	      value: function getRect() {
	        var c = this.context;
	        var x = 0;
	        var y = 0; //更具textAlign 和 textBaseline 重新矫正 xy

	        if (c.textAlign == "center") {
	          x = -c.width / 2;
	        }

	        if (c.textAlign == "right") {
	          x = -c.width;
	        }

	        if (c.textBaseline == "middle") {
	          y = -c.height / 2;
	        }

	        if (c.textBaseline == "bottom") {
	          y = -c.height;
	        }
	        return {
	          x: x,
	          y: y,
	          width: c.width,
	          height: c.height
	        };
	      }
	    }]);

	    return Text;
	  }(_DisplayObject3["default"]);

	  exports.default = Text;
	});
	});

	unwrapExports(Text);

	var Vector = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, mmvis);
	  }
	})(void 0, function (exports, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  /**
	   * Canvax
	   *
	   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
	   *
	   * 向量操作类
	   * */
	  function Vector(x, y) {
	    var vx = 0,
	        vy = 0;

	    if (arguments.length == 1 && _mmvis._.isObject(x)) {
	      var arg = arguments[0];

	      if (_mmvis._.isArray(arg)) {
	        vx = arg[0];
	        vy = arg[1];
	      } else if (arg.hasOwnProperty("x") && arg.hasOwnProperty("y")) {
	        vx = arg.x;
	        vy = arg.y;
	      }
	    }

	    this._axes = [vx, vy];
	  }
	  Vector.prototype = {
	    distance: function distance(v) {
	      var x = this._axes[0] - v._axes[0];
	      var y = this._axes[1] - v._axes[1];
	      return Math.sqrt(x * x + y * y);
	    }
	  };
	  exports["default"] = Vector;
	});
	});

	unwrapExports(Vector);

	var SmoothSpline = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Vector, mmvis);
	  }
	})(void 0, function (exports, _Vector, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  exports.default = function (opt) {
	    var points = opt.points;
	    var isLoop = opt.isLoop;
	    var smoothFilter = opt.smoothFilter;
	    var len = points.length;

	    if (len == 1) {
	      return points;
	    }

	    var ret = [];
	    var distance = 0;
	    var preVertor = new _Vector2["default"](points[0]);
	    var iVtor = null;

	    for (var i = 1; i < len; i++) {
	      iVtor = new _Vector2["default"](points[i]);
	      distance += preVertor.distance(iVtor);
	      preVertor = iVtor;
	    }

	    preVertor = null;
	    iVtor = null; //基本上等于曲率

	    var segs = distance / 6;
	    segs = segs < len ? len : segs;

	    for (var i = 0; i < segs; i++) {
	      var pos = i / (segs - 1) * (isLoop ? len : len - 1);
	      var idx = Math.floor(pos);
	      var w = pos - idx;
	      var p0;
	      var p1 = points[idx % len];
	      var p2;
	      var p3;

	      if (!isLoop) {
	        p0 = points[idx === 0 ? idx : idx - 1];
	        p2 = points[idx > len - 2 ? len - 1 : idx + 1];
	        p3 = points[idx > len - 3 ? len - 1 : idx + 2];
	      } else {
	        p0 = points[(idx - 1 + len) % len];
	        p2 = points[(idx + 1) % len];
	        p3 = points[(idx + 2) % len];
	      }

	      var w2 = w * w;
	      var w3 = w * w2;
	      var rp = [interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3), interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)];
	      _mmvis._.isFunction(smoothFilter) && smoothFilter(rp);
	      ret.push(rp);
	    }

	    return ret;
	  };

	  var _Vector2 = _interopRequireDefault(_Vector);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  /**
	   * Canvax
	   *
	   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
	   *
	   * 处理为平滑线条
	   */

	  /**
	   * @inner
	   */
	  function interpolate(p0, p1, p2, p3, t, t2, t3) {
	    var v0 = (p2 - p0) * 0.25;
	    var v1 = (p3 - p1) * 0.25;
	    return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
	  }
	});
	});

	unwrapExports(SmoothSpline);

	var _Math = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, SmoothSpline, mmvis);
	  }
	})(void 0, function (exports, _SmoothSpline, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _SmoothSpline2 = _interopRequireDefault(_SmoothSpline);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  /**
	   * Canvax
	   *
	   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
	   *
	   * 数学 类
	   *
	   **/
	  var _cache = {
	    sin: {},
	    //sin缓存
	    cos: {} //cos缓存

	  };

	  var _radians = Math.PI / 180;
	  /**
	   * @param angle 弧度（角度）参数
	   * @param isDegrees angle参数是否为角度计算，默认为false，angle为以弧度计量的角度
	   */


	  function sin(angle, isDegrees) {
	    angle = (isDegrees ? angle * _radians : angle).toFixed(4);

	    if (typeof _cache.sin[angle] == 'undefined') {
	      _cache.sin[angle] = Math.sin(angle);
	    }

	    return _cache.sin[angle];
	  }
	  /**
	   * @param radians 弧度参数
	   */


	  function cos(angle, isDegrees) {
	    angle = (isDegrees ? angle * _radians : angle).toFixed(4);

	    if (typeof _cache.cos[angle] == 'undefined') {
	      _cache.cos[angle] = Math.cos(angle);
	    }

	    return _cache.cos[angle];
	  }
	  /**
	   * 角度转弧度
	   * @param {Object} angle
	   */


	  function degreeToRadian(angle) {
	    return angle * _radians;
	  }
	  /**
	   * 弧度转角度
	   * @param {Object} angle
	   */


	  function radianToDegree(angle) {
	    return angle / _radians;
	  }
	  /*
	   * 校验角度到360度内
	   * @param {angle} number
	   */


	  function degreeTo360(angle) {
	    var reAng = (360 + angle % 360) % 360; //Math.abs(360 + Math.ceil( angle ) % 360) % 360;

	    if (reAng == 0 && angle !== 0) {
	      reAng = 360;
	    }

	    return reAng;
	  }

	  function getIsgonPointList(n, r) {
	    var pointList = [];
	    var dStep = 2 * Math.PI / n;
	    var beginDeg = -Math.PI / 2;
	    var deg = beginDeg;

	    for (var i = 0, end = n; i < end; i++) {
	      pointList.push([r * Math.cos(deg), r * Math.sin(deg)]);
	      deg += dStep;
	    }
	    return pointList;
	  }

	  function getSmoothPointList(pList, smoothFilter) {
	    //smoothFilter -- 比如在折线图中。会传一个smoothFilter过来做point的纠正。
	    //让y不能超过底部的原点
	    var List = [];
	    var Len = pList.length;
	    var _currList = [];

	    _mmvis._.each(pList, function (point, i) {
	      if (isNotValibPoint(point)) {
	        //undefined , [ number, null] 等结构
	        if (_currList.length) {
	          List = List.concat(_getSmoothGroupPointList(_currList, smoothFilter));
	          _currList = [];
	        }

	        List.push(point);
	      } else {
	        //有效的point 都push 进_currList 准备做曲线设置
	        _currList.push(point);
	      }

	      if (i == Len - 1) {
	        if (_currList.length) {
	          List = List.concat(_getSmoothGroupPointList(_currList, smoothFilter));
	          _currList = [];
	        }
	      }
	    });

	    return List;
	  }

	  function _getSmoothGroupPointList(pList, smoothFilter) {
	    var obj = {
	      points: pList
	    };

	    if (_mmvis._.isFunction(smoothFilter)) {
	      obj.smoothFilter = smoothFilter;
	    }

	    var currL = (0, _SmoothSpline2["default"])(obj);

	    if (pList && pList.length > 0) {
	      currL.push(pList[pList.length - 1]);
	    }
	    return currL;
	  }

	  function isNotValibPoint(point) {
	    var res = !point || _mmvis._.isArray(point) && point.length >= 2 && (!_mmvis._.isNumber(point[0]) || !_mmvis._.isNumber(point[1])) || "x" in point && !_mmvis._.isNumber(point.x) || "y" in point && !_mmvis._.isNumber(point.y);
	    return res;
	  }

	  function isValibPoint(point) {
	    return !isNotValibPoint(point);
	  }

	  exports["default"] = {
	    PI: Math.PI,
	    sin: sin,
	    cos: cos,
	    degreeToRadian: degreeToRadian,
	    radianToDegree: radianToDegree,
	    degreeTo360: degreeTo360,
	    getIsgonPointList: getIsgonPointList,
	    getSmoothPointList: getSmoothPointList,
	    isNotValibPoint: isNotValibPoint,
	    isValibPoint: isValibPoint
	  };
	});
	});

	unwrapExports(_Math);

	var BrokenLine = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, utils, mmvis, _Math);
	  }
	})(void 0, function (exports, _Shape2, _index, _mmvis, _Math2) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  var _index2 = _interopRequireDefault(_index);

	  var _Math3 = _interopRequireDefault(_Math2);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var BrokenLine = function (_Shape) {
	    _inherits(BrokenLine, _Shape);

	    function BrokenLine(opt) {
	      var _this;

	      _classCallCheck(this, BrokenLine);

	      opt = _index2["default"].checkOpt(opt);

	      var _context = _mmvis._.extend(true, {
	        lineType: null,
	        smooth: false,
	        pointList: [],
	        //{Array}  // 必须，各个顶角坐标
	        smoothFilter: _index2["default"].__emptyFunc
	      }, opt.context);

	      if (!opt.isClone && _context.smooth) {
	        _context.pointList = _Math3["default"].getSmoothPointList(_context.pointList, _context.smoothFilter);
	      }
	      opt.context = _context;
	      opt.type = "brokenline";
	      _this = _possibleConstructorReturn(this, _getPrototypeOf(BrokenLine).call(this, opt)); //保存好原始值

	      _this._pointList = _context.pointList;
	      return _this;
	    }

	    _createClass(BrokenLine, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "pointList" || name == "smooth" || name == "lineType") {
	          if (name == "pointList" && this.context.smooth) {
	            this.context.pointList = _Math3["default"].getSmoothPointList(value, this.context.smoothFilter);
	            this._pointList = value;
	          }

	          if (name == "smooth") {
	            //如果是smooth的切换
	            if (value) {
	              //从原始中拿数据重新生成
	              this.context.pointList = _Math3["default"].getSmoothPointList(this._pointList, this.context.smoothFilter);
	            } else {
	              this.context.pointList = this._pointList;
	            }
	          }
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        var context = this.context;
	        var pointList = context.pointList;
	        var beginPath = false;

	        for (var i = 0, l = pointList.length; i < l; i++) {
	          var point = pointList[i];

	          if (_Math3["default"].isValibPoint(point)) {
	            if (!beginPath) {
	              graphics.moveTo(point[0], point[1]);
	            } else {
	              graphics.lineTo(point[0], point[1]);
	            }
	            beginPath = true;
	          } else {
	            beginPath = false;
	          }
	        }

	        return this;
	      }
	    }]);

	    return BrokenLine;
	  }(_Shape3["default"]);

	  exports.default = BrokenLine;
	});
	});

	unwrapExports(BrokenLine);

	var Circle$1 = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, utils, mmvis);
	  }
	})(void 0, function (exports, _Shape2, _index, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Circle = function (_Shape) {
	    _inherits(Circle, _Shape);

	    function Circle(opt) {
	      _classCallCheck(this, Circle);

	      opt = _mmvis._.extend(true, {
	        type: "circle",
	        xyToInt: false,
	        context: {
	          r: 0
	        }
	      }, _index2["default"].checkOpt(opt));
	      return _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, opt));
	    }

	    _createClass(Circle, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "r") {
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        var r = this.context.$model.r;

	        if (r < 0) {
	          r = 0;
	        }
	        graphics.drawCircle(0, 0, r);
	      }
	    }]);

	    return Circle;
	  }(_Shape3["default"]);

	  exports.default = Circle;
	});
	});

	unwrapExports(Circle$1);

	var Path = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, utils, mmvis, Matrix, math);
	  }
	})(void 0, function (exports, _Shape2, _index, _mmvis, _Matrix, _index3) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  var _index2 = _interopRequireDefault(_index);

	  var _Matrix2 = _interopRequireDefault(_Matrix);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Path = function (_Shape) {
	    _inherits(Path, _Shape);

	    function Path(opt) {
	      _classCallCheck(this, Path);

	      var _context = _mmvis._.extend(true, {
	        pointList: [],
	        //从下面的path中计算得到的边界点的集合
	        path: "" //字符串 必须，路径。例如:M 0 0 L 0 10 L 10 10 Z (一个三角形)
	        //M = moveto
	        //L = lineto
	        //H = horizontal lineto
	        //V = vertical lineto
	        //C = curveto
	        //S = smooth curveto
	        //Q = quadratic Belzier curve
	        //T = smooth quadratic Belzier curveto
	        //Z = closepath

	      }, opt.context);

	      opt.context = _context;
	      opt.__parsePathData = null;
	      opt.type = "path";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Path).call(this, opt));
	    }

	    _createClass(Path, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "path") {
	          //如果path有变动，需要自动计算新的pointList
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "_parsePathData",
	      value: function _parsePathData(data) {
	        if (this.__parsePathData) {
	          return this.__parsePathData;
	        }

	        if (!data) {
	          return [];
	        }

	        this.__parsePathData = [];

	        var paths = _mmvis._.compact(data.replace(/[Mm]/g, "\\r$&").split('\\r'));

	        var me = this;

	        _mmvis._.each(paths, function (pathStr) {
	          me.__parsePathData.push(me._parseChildPathData(pathStr));
	        });

	        return this.__parsePathData;
	      }
	    }, {
	      key: "_parseChildPathData",
	      value: function _parseChildPathData(data) {
	        // command string
	        var cs = data; // command chars

	        var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
	        cs = cs.replace(/  /g, ' ');
	        cs = cs.replace(/ /g, ','); //cs = cs.replace(/(.)-/g, "$1,-");

	        cs = cs.replace(/(\d)-/g, '$1,-');
	        cs = cs.replace(/,,/g, ',');
	        var n; // create pipes so that we can split the data

	        for (n = 0; n < cc.length; n++) {
	          cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
	        } // create array


	        var arr = cs.split('|');
	        var ca = []; // init context point

	        var cpx = 0;
	        var cpy = 0;

	        for (n = 1; n < arr.length; n++) {
	          var str = arr[n];
	          var c = str.charAt(0);
	          str = str.slice(1);
	          str = str.replace(new RegExp('e,-', 'g'), 'e-'); //有的时候，比如“22，-22” 数据可能会经常的被写成22-22，那么需要手动修改
	          //str = str.replace(new RegExp('-', 'g'), ',-');
	          //str = str.replace(/(.)-/g, "$1,-")

	          var p = str.split(',');

	          if (p.length > 0 && p[0] === '') {
	            p.shift();
	          }

	          for (var i = 0; i < p.length; i++) {
	            p[i] = parseFloat(p[i]);
	          }

	          while (p.length > 0) {
	            if (isNaN(p[0])) {
	              break;
	            }

	            var cmd = null;
	            var points = [];
	            var ctlPtx;
	            var ctlPty;
	            var prevCmd;
	            var rx;
	            var ry;
	            var psi;
	            var fa;
	            var fs;
	            var x1 = cpx;
	            var y1 = cpy; // convert l, H, h, V, and v to L

	            switch (c) {
	              case 'l':
	                cpx += p.shift();
	                cpy += p.shift();
	                cmd = 'L';
	                points.push(cpx, cpy);
	                break;

	              case 'L':
	                cpx = p.shift();
	                cpy = p.shift();
	                points.push(cpx, cpy);
	                break;

	              case 'm':
	                cpx += p.shift();
	                cpy += p.shift();
	                cmd = 'M';
	                points.push(cpx, cpy);
	                c = 'l';
	                break;

	              case 'M':
	                cpx = p.shift();
	                cpy = p.shift();
	                cmd = 'M';
	                points.push(cpx, cpy);
	                c = 'L';
	                break;

	              case 'h':
	                cpx += p.shift();
	                cmd = 'L';
	                points.push(cpx, cpy);
	                break;

	              case 'H':
	                cpx = p.shift();
	                cmd = 'L';
	                points.push(cpx, cpy);
	                break;

	              case 'v':
	                cpy += p.shift();
	                cmd = 'L';
	                points.push(cpx, cpy);
	                break;

	              case 'V':
	                cpy = p.shift();
	                cmd = 'L';
	                points.push(cpx, cpy);
	                break;

	              case 'C':
	                points.push(p.shift(), p.shift(), p.shift(), p.shift());
	                cpx = p.shift();
	                cpy = p.shift();
	                points.push(cpx, cpy);
	                break;

	              case 'c':
	                points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
	                cpx += p.shift();
	                cpy += p.shift();
	                cmd = 'C';
	                points.push(cpx, cpy);
	                break;

	              case 'S':
	                ctlPtx = cpx;
	                ctlPty = cpy;
	                prevCmd = ca[ca.length - 1];

	                if (prevCmd.command === 'C') {
	                  ctlPtx = cpx + (cpx - prevCmd.points[2]);
	                  ctlPty = cpy + (cpy - prevCmd.points[3]);
	                }

	                points.push(ctlPtx, ctlPty, p.shift(), p.shift());
	                cpx = p.shift();
	                cpy = p.shift();
	                cmd = 'C';
	                points.push(cpx, cpy);
	                break;

	              case 's':
	                ctlPtx = cpx, ctlPty = cpy;
	                prevCmd = ca[ca.length - 1];

	                if (prevCmd.command === 'C') {
	                  ctlPtx = cpx + (cpx - prevCmd.points[2]);
	                  ctlPty = cpy + (cpy - prevCmd.points[3]);
	                }

	                points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
	                cpx += p.shift();
	                cpy += p.shift();
	                cmd = 'C';
	                points.push(cpx, cpy);
	                break;

	              case 'Q':
	                points.push(p.shift(), p.shift());
	                cpx = p.shift();
	                cpy = p.shift();
	                points.push(cpx, cpy);
	                break;

	              case 'q':
	                points.push(cpx + p.shift(), cpy + p.shift());
	                cpx += p.shift();
	                cpy += p.shift();
	                cmd = 'Q';
	                points.push(cpx, cpy);
	                break;

	              case 'T':
	                ctlPtx = cpx, ctlPty = cpy;
	                prevCmd = ca[ca.length - 1];

	                if (prevCmd.command === 'Q') {
	                  ctlPtx = cpx + (cpx - prevCmd.points[0]);
	                  ctlPty = cpy + (cpy - prevCmd.points[1]);
	                }

	                cpx = p.shift();
	                cpy = p.shift();
	                cmd = 'Q';
	                points.push(ctlPtx, ctlPty, cpx, cpy);
	                break;

	              case 't':
	                ctlPtx = cpx, ctlPty = cpy;
	                prevCmd = ca[ca.length - 1];

	                if (prevCmd.command === 'Q') {
	                  ctlPtx = cpx + (cpx - prevCmd.points[0]);
	                  ctlPty = cpy + (cpy - prevCmd.points[1]);
	                }

	                cpx += p.shift();
	                cpy += p.shift();
	                cmd = 'Q';
	                points.push(ctlPtx, ctlPty, cpx, cpy);
	                break;

	              case 'A':
	                rx = p.shift(); //x半径

	                ry = p.shift(); //y半径

	                psi = p.shift(); //旋转角度

	                fa = p.shift(); //角度大小 

	                fs = p.shift(); //时针方向

	                x1 = cpx, y1 = cpy;
	                cpx = p.shift(), cpy = p.shift();
	                cmd = 'A';
	                points = [rx, ry, psi, fa, fs, cpx, cpy, x1, y1];
	                break;

	              case 'a':
	                rx = p.shift();
	                ry = p.shift();
	                psi = p.shift();
	                fa = p.shift();
	                fs = p.shift();
	                x1 = cpx, y1 = cpy;
	                cpx += p.shift();
	                cpy += p.shift();
	                cmd = 'A';
	                points = [rx, ry, psi, fa, fs, cpx, cpy, x1, y1];
	                break;
	            }

	            ca.push({
	              command: cmd || c,
	              points: points
	            });
	          }

	          if (c === 'z' || c === 'Z') {
	            ca.push({
	              command: 'z',
	              points: []
	            });
	          }
	        }
	        return ca;
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        //graphics.beginPath();
	        this.__parsePathData = null;
	        this.context.$model.pointList = [];

	        var pathArray = this._parsePathData(this.context.$model.path);

	        for (var g = 0, gl = pathArray.length; g < gl; g++) {
	          for (var i = 0, l = pathArray[g].length; i < l; i++) {
	            var c = pathArray[g][i].command,
	                p = pathArray[g][i].points;

	            switch (c) {
	              case 'L':
	                graphics.lineTo(p[0], p[1]);
	                break;

	              case 'M':
	                graphics.moveTo(p[0], p[1]);
	                break;

	              case 'C':
	                graphics.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
	                break;

	              case 'Q':
	                graphics.quadraticCurveTo(p[0], p[1], p[2], p[3]);
	                break;

	              case 'A':
	                //前面6个元素用来放path的A 6个参数，path A命令详见
	                _index3.Arc.drawArc(graphics, p[7], p[8], p);

	                break;

	              case 'z':
	                graphics.closePath();
	                break;
	            }
	          }
	        }
	        return this;
	      }
	    }]);

	    return Path;
	  }(_Shape3["default"]);

	  exports.default = Path;
	});
	});

	unwrapExports(Path);

	var Droplet = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Path, utils, mmvis);
	  }
	})(void 0, function (exports, _Path2, _index, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Path3 = _interopRequireDefault(_Path2);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Droplet = function (_Path) {
	    _inherits(Droplet, _Path);

	    function Droplet(opt) {
	      var _this;

	      _classCallCheck(this, Droplet);

	      opt = _mmvis._.extend(true, {
	        type: "droplet",
	        context: {
	          hr: 0,
	          //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
	          vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）

	        }
	      }, _index2["default"].checkOpt(opt));

	      var my = _this = _possibleConstructorReturn(this, _getPrototypeOf(Droplet).call(this, opt));

	      _this.context.$model.path = _this.createPath();
	      return _this;
	    }

	    _createClass(Droplet, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "hr" || name == "vr") {
	          this.context.$model.path = this.createPath();
	        }
	      }
	    }, {
	      key: "createPath",
	      value: function createPath() {
	        var model = this.context.$model;
	        var ps = "M 0 " + model.hr + " C " + model.hr + " " + model.hr + " " + model.hr * 3 / 2 + " " + -model.hr / 3 + " 0 " + -model.vr;
	        ps += " C " + -model.hr * 3 / 2 + " " + -model.hr / 3 + " " + -model.hr + " " + model.hr + " 0 " + model.hr + "z";
	        return ps;
	      }
	    }]);

	    return Droplet;
	  }(_Path3["default"]);

	  exports.default = Droplet;
	});
	});

	unwrapExports(Droplet);

	var Ellipse$1 = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, utils, mmvis);
	  }
	})(void 0, function (exports, _Shape2, _index, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Ellipse = function (_Shape) {
	    _inherits(Ellipse, _Shape);

	    function Ellipse(opt) {
	      _classCallCheck(this, Ellipse);

	      opt = _mmvis._.extend(true, {
	        type: "ellipse",
	        context: {
	          hr: 0,
	          //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
	          vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）

	        }
	      }, _index2["default"].checkOpt(opt));
	      return _possibleConstructorReturn(this, _getPrototypeOf(Ellipse).call(this, opt));
	    }

	    _createClass(Ellipse, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "hr" || name == "vr") {
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        graphics.drawEllipse(0, 0, this.context.$model.hr * 2, this.context.$model.vr * 2);
	      }
	    }]);

	    return Ellipse;
	  }(_Shape3["default"]);

	  exports.default = Ellipse;
	});
	});

	unwrapExports(Ellipse$1);

	var Polygon$1 = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, utils, mmvis, _Math);
	  }
	})(void 0, function (exports, _Shape2, _index, _mmvis, _Math2) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  var _index2 = _interopRequireDefault(_index);

	  var _Math3 = _interopRequireDefault(_Math2);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Polygon = function (_Shape) {
	    _inherits(Polygon, _Shape);

	    function Polygon(opt) {
	      _classCallCheck(this, Polygon);

	      var _context = _mmvis._.extend(true, {
	        lineType: null,
	        smooth: false,
	        pointList: [],
	        //{Array}  // 必须，各个顶角坐标
	        smoothFilter: _index2["default"].__emptyFunc
	      }, opt.context);

	      if (!opt.isClone) {
	        var start = _context.pointList[0];

	        var end = _context.pointList.slice(-1)[0];

	        if (_context.smooth) {
	          _context.pointList.unshift(end);

	          _context.pointList = _Math3["default"].getSmoothPointList(_context.pointList);
	        }
	      }
	      opt.context = _context;
	      opt.type = "polygon";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Polygon).call(this, opt));
	    }

	    _createClass(Polygon, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        //调用parent的setGraphics
	        if (name == "pointList" || name == "smooth" || name == "lineType") {
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        //graphics.beginPath();
	        var context = this.context;
	        var pointList = context.pointList;

	        if (pointList.length < 2) {
	          //少于2个点就不画了~
	          return;
	        }
	        graphics.moveTo(pointList[0][0], pointList[0][1]);

	        for (var i = 1, l = pointList.length; i < l; i++) {
	          graphics.lineTo(pointList[i][0], pointList[i][1]);
	        }
	        graphics.closePath();
	        return;
	      }
	    }]);

	    return Polygon;
	  }(_Shape3["default"]);

	  exports.default = Polygon;
	});
	});

	unwrapExports(Polygon$1);

	var Isogon = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Polygon$1, utils, mmvis, _Math);
	  }
	})(void 0, function (exports, _Polygon2, _index, _mmvis, _Math2) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Polygon3 = _interopRequireDefault(_Polygon2);

	  var _index2 = _interopRequireDefault(_index);

	  var _Math3 = _interopRequireDefault(_Math2);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Isogon = function (_Polygon) {
	    _inherits(Isogon, _Polygon);

	    function Isogon(opt) {
	      _classCallCheck(this, Isogon);

	      var _context = _mmvis._.extend(true, {
	        pointList: [],
	        //从下面的r和n计算得到的边界值的集合
	        r: 0,
	        //{number},  // 必须，正n边形外接圆半径
	        n: 0 //{number},  // 必须，指明正几边形

	      }, opt.context);

	      _context.pointList = _Math3["default"].getIsgonPointList(_context.n, _context.r);
	      opt.context = _context;
	      opt.type = "isogon";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Isogon).call(this, opt));
	    }

	    _createClass(Isogon, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "r" || name == "n") {
	          //如果path有变动，需要自动计算新的pointList
	          this.context.$model.pointList = _Math3["default"].getIsgonPointList(this.context.$model.n, this.context.$model.r);
	        }

	        if (name == "pointList" || name == "smooth" || name == "lineType") {
	          this.graphics.clear();
	        }
	      }
	    }]);

	    return Isogon;
	  }(_Polygon3["default"]);

	  exports.default = Isogon;
	});
	});

	unwrapExports(Isogon);

	var Line = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, mmvis);
	  }
	})(void 0, function (exports, _Shape2, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Line = function (_Shape) {
	    _inherits(Line, _Shape);

	    function Line(opt) {
	      _classCallCheck(this, Line);

	      var _context = _mmvis._.extend(true, {
	        start: {
	          x: 0,
	          // 必须，起点横坐标
	          y: 0 // 必须，起点纵坐标

	        },
	        end: {
	          x: 0,
	          // 必须，终点横坐标
	          y: 0 // 必须，终点纵坐标

	        }
	      }, opt.context);

	      opt.context = _context;
	      opt.type = "line";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, opt));
	    }

	    _createClass(Line, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        //并不清楚是start.x 还是end.x， 当然，这并不重要
	        if (name == "x" || name == "y") {
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        var model = this.context.$model;
	        graphics.moveTo(model.start.x, model.start.y);
	        graphics.lineTo(model.end.x, model.end.y);
	        return this;
	      }
	    }]);

	    return Line;
	  }(_Shape3["default"]);

	  exports.default = Line;
	});
	});

	unwrapExports(Line);

	var Rect = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, utils, mmvis);
	  }
	})(void 0, function (exports, _Shape2, _index, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Rect = function (_Shape) {
	    _inherits(Rect, _Shape);

	    function Rect(opt) {
	      _classCallCheck(this, Rect);

	      var _context = _mmvis._.extend(true, {
	        width: 0,
	        height: 0,
	        radius: []
	      }, opt.context);

	      opt.context = _context;
	      opt.type = "rect";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, opt));
	    }

	    _createClass(Rect, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "width" || name == "height" || name == "radius") {
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "_buildRadiusPath",
	      value: function _buildRadiusPath(graphics) {
	        var model = this.context.$model; //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
	        //r缩写为1         相当于 [1, 1, 1, 1]
	        //r缩写为[1]       相当于 [1, 1, 1, 1]
	        //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
	        //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]

	        var x = 0;
	        var y = 0;
	        var width = model.width;
	        var height = model.height;

	        var r = _index2["default"].getCssOrderArr(model.radius);

	        var G = graphics;
	        var sy = 1;

	        if (height >= 0) {
	          sy = -1;
	        }

	        G.moveTo(parseInt(x + r[0]), parseInt(height));
	        G.lineTo(parseInt(x + width - r[1]), parseInt(height));
	        r[1] !== 0 && G.quadraticCurveTo(x + width, height, parseInt(x + width), parseInt(height + r[1] * sy));
	        G.lineTo(parseInt(x + width), parseInt(y - r[2] * sy));
	        r[2] !== 0 && G.quadraticCurveTo(x + width, y, parseInt(x + width - r[2]), parseInt(y));
	        G.lineTo(parseInt(x + r[3]), parseInt(y));
	        r[3] !== 0 && G.quadraticCurveTo(x, y, parseInt(x), parseInt(y - r[3] * sy));
	        G.lineTo(parseInt(x), parseInt(y + height + r[0] * sy));
	        r[0] !== 0 && G.quadraticCurveTo(x, y + height, parseInt(x + r[0]), parseInt(y + height));
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        var model = this.context.$model;

	        if (!model.radius.length) {
	          graphics.drawRect(0, 0, model.width, model.height);
	        } else {
	          this._buildRadiusPath(graphics);
	        }

	        graphics.closePath();
	        return;
	      }
	    }]);

	    return Rect;
	  }(_Shape3["default"]);

	  exports.default = Rect;
	});
	});

	unwrapExports(Rect);

	var Sector = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, utils, mmvis, _Math);
	  }
	})(void 0, function (exports, _Shape2, _index, _mmvis, _Math) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  var _index2 = _interopRequireDefault(_index);

	  var _Math2 = _interopRequireDefault(_Math);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Sector = function (_Shape) {
	    _inherits(Sector, _Shape);

	    function Sector(opt) {
	      _classCallCheck(this, Sector);

	      var _context = _mmvis._.extend(true, {
	        pointList: [],
	        //边界点的集合,私有，从下面的属性计算的来
	        r0: 0,
	        // 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
	        r: 0,
	        //{number},  // 必须，外圆半径
	        startAngle: 0,
	        //{number},  // 必须，起始角度[0, 360)
	        endAngle: 0,
	        //{number},  // 必须，结束角度(0, 360]
	        clockwise: false //是否顺时针，默认为false(顺时针)

	      }, opt.context);

	      opt.context = _context;
	      opt.regAngle = [];
	      opt.isRing = false; //是否为一个圆环

	      opt.type = "sector";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Sector).call(this, opt));
	    }

	    _createClass(Sector, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        if (name == "r0" || name == "r" || name == "startAngle" || name == "endAngle" || name == "clockwise") {
	          //因为这里的graphs不一样。
	          this.isRing = false; //是否为一个圆环，这里也要开始初始化一下

	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        var model = this.context.$model; // 形内半径[0,r)

	        var r0 = typeof model.r0 == 'undefined' ? 0 : model.r0;
	        var r = model.r; // 扇形外半径(0,r]

	        var startAngle = _Math2["default"].degreeTo360(model.startAngle); // 起始角度[0,360)


	        var endAngle = _Math2["default"].degreeTo360(model.endAngle); // 结束角度(0,360]


	        if (model.startAngle != model.endAngle && Math.abs(model.startAngle - model.endAngle) % 360 == 0) {
	          //if( startAngle == endAngle && model.startAngle != model.endAngle ) {
	          //如果两个角度相等，那么就认为是个圆环了
	          this.isRing = true;
	          startAngle = 0;
	          endAngle = 360;
	        }

	        startAngle = _Math2["default"].degreeToRadian(startAngle);
	        endAngle = _Math2["default"].degreeToRadian(endAngle); //处理下极小夹角的情况
	        //if( endAngle - startAngle < 0.025 ){
	        //    startAngle -= 0.003
	        //}

	        var G = graphics; //G.beginPath();

	        if (this.isRing) {
	          if (model.r0 == 0) {
	            //圆
	            G.drawCircle(0, 0, model.r);
	          } else {
	            //圆环
	            if (model.fillStyle && model.fillAlpha) {
	              G.beginPath();
	              G.arc(0, 0, r, startAngle, endAngle, model.clockwise);

	              if (model.r0 == 0) {
	                G.lineTo(0, 0);
	              } else {
	                G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
	              }

	              G.closePath();
	              G.currentPath.lineWidth = 0;
	              G.currentPath.strokeStyle = null;
	              G.currentPath.strokeAlpha = 0;
	              G.currentPath.line = false;
	            }

	            if (model.lineWidth && model.strokeStyle && model.strokeAlpha) {
	              G.beginPath();
	              G.arc(0, 0, r, startAngle, endAngle, model.clockwise);
	              G.closePath();
	              G.currentPath.fillStyle = null;
	              G.currentPath.fill = false;
	              G.beginPath();
	              G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
	              G.closePath();
	              G.currentPath.fillStyle = null;
	              G.currentPath.fill = false;
	            }
	          }
	        } else {
	          //正常的扇形状
	          G.beginPath();
	          G.arc(0, 0, r, startAngle, endAngle, model.clockwise);

	          if (model.r0 == 0) {
	            G.lineTo(0, 0);
	          } else {
	            G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
	          }

	          G.closePath();
	        } //G.closePath();

	      }
	    }]);

	    return Sector;
	  }(_Shape3["default"]);

	  exports.default = Sector;
	});
	});

	unwrapExports(Sector);

	var arrow = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Shape, mmvis);
	  }
	})(void 0, function (exports, _Shape2, _mmvis) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.default = undefined;

	  var _Shape3 = _interopRequireDefault(_Shape2);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  function _typeof(obj) {
	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	      _typeof = function _typeof(obj) {
	        return typeof obj;
	      };
	    } else {
	      _typeof = function _typeof(obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	      };
	    }

	    return _typeof(obj);
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  function _defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    return Constructor;
	  }

	  function _possibleConstructorReturn(self, call) {
	    if (call && (_typeof(call) === "object" || typeof call === "function")) {
	      return call;
	    }

	    return _assertThisInitialized(self);
	  }

	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return self;
	  }

	  function _getPrototypeOf(o) {
	    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	      return o.__proto__ || Object.getPrototypeOf(o);
	    };
	    return _getPrototypeOf(o);
	  }

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) _setPrototypeOf(subClass, superClass);
	  }

	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    return _setPrototypeOf(o, p);
	  }

	  var Line = function (_Shape) {
	    _inherits(Line, _Shape);

	    function Line(opt) {
	      _classCallCheck(this, Line);

	      var _context = _mmvis._.extend(true, {
	        control: {
	          x: 0,
	          // 必须，起点横坐标
	          y: 0 // 必须，起点纵坐标

	        },
	        point: {
	          x: 0,
	          // 必须，终点横坐标
	          y: 0 // 必须，终点纵坐标

	        },
	        angle: null,
	        // control的存在，也就是为了计算出来这个angle
	        theta: 30,
	        // 箭头夹角
	        headlen: 6,
	        // 斜边长度
	        lineWidth: 1,
	        strokeStyle: '#666',
	        fillStyle: null
	      }, opt.context);

	      opt.context = _context;
	      opt.type = "arrow";
	      return _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, opt));
	    }

	    _createClass(Line, [{
	      key: "watch",
	      value: function watch(name, value, preValue) {
	        //并不清楚是start.x 还是end.x， 当然，这并不重要
	        if (name == "x" || name == "y" || name == "theta" || name == "headlen" || name == "angle") {
	          this.graphics.clear();
	        }
	      }
	    }, {
	      key: "draw",
	      value: function draw(graphics) {
	        var model = this.context.$model;
	        var fromX = model.control.x;
	        var fromY = model.control.y;
	        var toX = model.point.x;
	        var toY = model.point.y; // 计算各角度和对应的P2,P3坐标 

	        var angle = model.angle != null ? model.angle - 180 : Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
	            angle1 = (angle + model.theta) * Math.PI / 180,
	            angle2 = (angle - model.theta) * Math.PI / 180,
	            topX = model.headlen * Math.cos(angle1),
	            topY = model.headlen * Math.sin(angle1),
	            botX = model.headlen * Math.cos(angle2),
	            botY = model.headlen * Math.sin(angle2);
	        var arrowX = toX + topX;
	        var arrowY = toY + topY;
	        graphics.moveTo(arrowX, arrowY);
	        graphics.lineTo(toX, toY);
	        graphics.lineTo(toX + botX, toY + botY);

	        if (model.fillStyle) {
	          graphics.lineTo(arrowX, arrowY);
	          graphics.closePath();
	        }
	        return this;
	      }
	    }]);

	    return Line;
	  }(_Shape3["default"]);

	  exports.default = Line;
	});
	});

	unwrapExports(arrow);

	var dist = createCommonjsModule(function (module, exports) {

	(function (global, factory) {
	  {
	    factory(exports, Application, DisplayObject, DisplayObjectContainer, Stage, Sprite, Shape, Point, Text, BrokenLine, Circle$1, Droplet, Ellipse$1, Isogon, Line, Path, Polygon$1, Rect, Sector, arrow, AnimationFrame, utils);
	  }
	})(void 0, function (exports, _Application, _DisplayObject, _DisplayObjectContainer, _Stage, _Sprite, _Shape, _Point, _Text, _BrokenLine, _Circle, _Droplet, _Ellipse, _Isogon, _Line, _Path, _Polygon, _Rect, _Sector, _arrow, _AnimationFrame, _index) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var _Application2 = _interopRequireDefault(_Application);

	  var _DisplayObject2 = _interopRequireDefault(_DisplayObject);

	  var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

	  var _Stage2 = _interopRequireDefault(_Stage);

	  var _Sprite2 = _interopRequireDefault(_Sprite);

	  var _Shape2 = _interopRequireDefault(_Shape);

	  var _Point2 = _interopRequireDefault(_Point);

	  var _Text2 = _interopRequireDefault(_Text);

	  var _BrokenLine2 = _interopRequireDefault(_BrokenLine);

	  var _Circle2 = _interopRequireDefault(_Circle);

	  var _Droplet2 = _interopRequireDefault(_Droplet);

	  var _Ellipse2 = _interopRequireDefault(_Ellipse);

	  var _Isogon2 = _interopRequireDefault(_Isogon);

	  var _Line2 = _interopRequireDefault(_Line);

	  var _Path2 = _interopRequireDefault(_Path);

	  var _Polygon2 = _interopRequireDefault(_Polygon);

	  var _Rect2 = _interopRequireDefault(_Rect);

	  var _Sector2 = _interopRequireDefault(_Sector);

	  var _arrow2 = _interopRequireDefault(_arrow);

	  var _AnimationFrame2 = _interopRequireDefault(_AnimationFrame);

	  var _index2 = _interopRequireDefault(_index);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  //shapes
	  var Canvax = {
	    App: _Application2["default"]
	  };
	  Canvax.Display = {
	    DisplayObject: _DisplayObject2["default"],
	    DisplayObjectContainer: _DisplayObjectContainer2["default"],
	    Stage: _Stage2["default"],
	    Sprite: _Sprite2["default"],
	    Shape: _Shape2["default"],
	    Point: _Point2["default"],
	    Text: _Text2["default"]
	  };
	  Canvax.Shapes = {
	    BrokenLine: _BrokenLine2["default"],
	    Circle: _Circle2["default"],
	    Droplet: _Droplet2["default"],
	    Ellipse: _Ellipse2["default"],
	    Isogon: _Isogon2["default"],
	    Line: _Line2["default"],
	    Path: _Path2["default"],
	    Polygon: _Polygon2["default"],
	    Rect: _Rect2["default"],
	    Sector: _Sector2["default"],
	    Arrow: _arrow2["default"]
	  };
	  Canvax.AnimationFrame = _AnimationFrame2["default"];
	  Canvax.utils = _index2["default"];
	  exports["default"] = Canvax;
	});
	});

	var index = unwrapExports(dist);

	return index;

}(mmvis));
