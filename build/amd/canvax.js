define(function () { 'use strict';

var _ = {};
var breaker = {};
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
var toString         = ObjProto.toString;
var hasOwnProperty   = ObjProto.hasOwnProperty;

var nativeForEach      = ArrayProto.forEach;
var nativeFilter       = ArrayProto.filter;
var nativeIndexOf      = ArrayProto.indexOf;
var nativeIsArray      = Array.isArray;
var nativeKeys         = Object.keys;

_.values = function(obj) {
  var keys = _.keys(obj);
  var length = keys.length;
  var values = new Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys[i]];
  }
  return values;
};

_.keys = nativeKeys || function(obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];
  for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
};

_.has = function(obj, key) {
  return hasOwnProperty.call(obj, key);
};

var each = _.each = _.forEach = function(obj, iterator, context) {
  if (obj == null) return;
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
    }
  }
};

_.compact = function(array) {
  return _.filter(array, _.identity);
};

_.filter = _.select = function(obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
  each(obj, function(value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value);
  });
  return results;
};

each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
  _['is' + name] = function(obj) {
    return toString.call(obj) == '[object ' + name + ']';
  };
});

{
  _.isFunction = function(obj) {
    return typeof obj === 'function';
  };
}

_.isFinite = function(obj) {
  return isFinite(obj) && !isNaN(parseFloat(obj));
};

_.isNaN = function(obj) {
  return _.isNumber(obj) && obj != +obj;
};

_.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

_.isNull = function(obj) {
  return obj === null;
};

_.isEmpty = function(obj) {
  if (obj == null) return true;
  if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
  for (var key in obj) if (_.has(obj, key)) return false;
    return true;
};

_.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1);
};

_.isArray = nativeIsArray || function(obj) {
  return toString.call(obj) == '[object Array]';
};

_.isObject = function(obj) {
  return obj === Object(obj);
};

_.identity = function(value) {
  return value;
};

_.indexOf = function(array, item, isSorted) {
  if (array == null) return -1;
  var i = 0, length = array.length;
  if (isSorted) {
    if (typeof isSorted == 'number') {
      i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
    } else {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
  }
  if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
  for (; i < length; i++) if (array[i] === item) return i;
    return -1;
};

_.isWindow = function( obj ) { 
   return obj != null && obj == obj.window;
};
_.isPlainObject = function( obj ) {
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || typeof obj !== "object" || obj.nodeType || _.isWindow( obj ) ) {
        return false;
    }
    try {
        // Not own constructor property must be Object
        if ( obj.constructor &&
            !hasOwn.call(obj, "constructor") &&
            !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
            return false;
        }
    } catch ( e ) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
    }
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
};
_.extend = function() {  
  var options, name, src, copy, copyIsArray, clone,  
      target = arguments[0] || {},  
      i = 1,  
      length = arguments.length,  
      deep = false;  
  if ( typeof target === "boolean" ) {  
      deep = target;  
      target = arguments[1] || {};  
      i = 2;  
  }  
  if ( typeof target !== "object" && !_.isFunction(target) ) {  
      target = {};  
  }  
  if ( length === i ) {  
      target = this;  
      --i;  
  }  
  for ( ; i < length; i++ ) {  
      if ( (options = arguments[ i ]) != null ) {  
          for ( name in options ) {  
              src = target[ name ];  
              copy = options[ name ];  
              if ( target === copy ) {  
                  continue;  
              }  
              if ( deep && copy && ( _.isPlainObject(copy) || (copyIsArray = _.isArray(copy)) ) ) {  
                  if ( copyIsArray ) {  
                      copyIsArray = false;  
                      clone = src && _.isArray(src) ? src : [];  
                  } else {  
                      clone = src && _.isPlainObject(src) ? src : {};  
                  }  
                  target[ name ] = _.extend( deep, clone, copy );  
              } else if ( copy !== undefined ) {  
                  target[ name ] = copy;  
              }  
          }  
      }  
  }  
  return target;  
}; 
_.clone = function(obj) {
  if (!_.isObject(obj)) return obj;
  return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
*/
var Base = {
    mainFrameRate   : 60,//默认主帧率
    now : 0,
    /*像素检测专用*/
    _pixelCtx   : null,
    __emptyFunc : function(){},
    //retina 屏幕优化
    _devicePixelRatio : window.devicePixelRatio || 1,
    _UID  : 0, //该值为向上的自增长整数值
    getUID:function(){
        return this._UID++;
    },
    createId : function(name) {
        //if end with a digit, then append an undersBase before appending
        var charCode = name.charCodeAt(name.length - 1);
        if (charCode >= 48 && charCode <= 57) name += "_";
        return name + Base.getUID();
    },
    /**
     * 创建dom
     * @param {string} id dom id 待用
     * @param {string} type : dom type， such as canvas, div etc.
     */
    _createCanvas : function(id, _width , _height) {
        var newDom = document.createElement("canvas");

        newDom.style.position = 'absolute';
        newDom.style.width  = _width + 'px';
        newDom.style.height = _height + 'px';
        newDom.style.left   = 0;
        newDom.style.top    = 0;
        //newDom.setAttribute('width', _width );
        //newDom.setAttribute('height', _height );
        newDom.setAttribute('width', _width * this._devicePixelRatio);
        newDom.setAttribute('height', _height * this._devicePixelRatio);
        newDom.setAttribute('id', id);
        return newDom;
    },
    canvasSupport : function() {
        return !!document.createElement('canvas').getContext;
    },
    createObject : function( proto , constructor ) {
        var newProto;
        var ObjectCreate = Object.create;
        if (ObjectCreate) {
            newProto = ObjectCreate(proto);
        } else {
            Base.__emptyFunc.prototype = proto;
            newProto = new Base.__emptyFunc();
        }
        newProto.constructor = constructor;
        return newProto;
    },
    setContextStyle : function( ctx , style ){
        // 简单判断不做严格类型检测
        for(var p in style){
            if( p != "textBaseline" && ( p in ctx ) ){
                if ( style[p] || _.isNumber( style[p] ) ) {
                    if( p == "globalAlpha" ){
                        //透明度要从父节点继承
                        ctx[p] *= style[p];
                    } else {
                        ctx[p] = style[p];
                    }
                }
            }
        }
        return;
    },
    creatClass : function(r, s, px){
        if (!s || !r) {
            return r;
        }
        var sp = s.prototype, rp;
        // add prototype chain
        rp = Base.createObject(sp, r);
        r.prototype = _.extend(rp, r.prototype);
        r.superclass = Base.createObject(sp, s);
        // add prototype overrides
        if (px) {
            _.extend(rp, px);
        }
        return r;
    },
    initElement : function( canvas ){
        if( window.FlashCanvas && FlashCanvas.initElement){
            FlashCanvas.initElement( canvas );
        }
    },
    //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
    checkOpt    : function(opt){
        if( !opt ){
          return {
            context : {
            
            }
          }   
        } else if( opt && !opt.context ) {
          opt.context = {};
          return opt;
        } else {
          return opt;
        }
    },

    
    /**
     * 按照css的顺序，返回一个[上,右,下,左]
     */
    getCssOrderArr : function( r ){
        var r1; 
        var r2; 
        var r3; 
        var r4;

        if(typeof r === 'number') {
            r1 = r2 = r3 = r4 = r;
        }
        else if(r instanceof Array) {
            if (r.length === 1) {
                r1 = r2 = r3 = r4 = r[0];
            }
            else if(r.length === 2) {
                r1 = r3 = r[0];
                r2 = r4 = r[1];
            }
            else if(r.length === 3) {
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
        return [r1,r2,r3,r4];
    }
};

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

 var TWEEN = TWEEN || (function () {

 	var _tweens = [];

 	return {

 		getAll: function () {

 			return _tweens;

 		},

 		removeAll: function () {

 			_tweens = [];

 		},

 		add: function (tween) {

 			_tweens.push(tween);

 		},

 		remove: function (tween) {

			var i = _.indexOf( _tweens , tween );//_tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time, preserve) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

                /* old 
				if (_tweens[i].update(time) || preserve) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}
				*/

                //new code
                //in real world, tween.update has chance to remove itself, so we have to handle this situation.
                //in certain cases, onUpdateCallback will remove instances in _tweens, which make _tweens.splice(i, 1) fail
                //@litao.lt@alibaba-inc.com
                var _t = _tweens[i];
                var _updateRes = _t.update(time);

                if( !_tweens[i] ){
                	break;
                }
                if ( _t === _tweens[i] ) {
                	if ( _updateRes || preserve ) {
                		i++;
                	} else {
                		_tweens.splice(i, 1);
                	}
                }

            }

            return true;

        }
    };

})();


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


TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _repeatDelayTime;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	this.to = function (properties, duration) {

		_valuesEnd = properties;

		if (duration !== undefined) {
			_duration = duration;
		}

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object, _object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.end = function () {

		this.update(_startTime + _duration);
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.repeatDelay = function (amount) {

		_repeatDelayTime = amount;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object, _object);
			}

			_onStartCallbackFired = true;
		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

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
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				if (_repeatDelayTime !== undefined) {
					_startTime = time + _repeatDelayTime;
				} else {
					_startTime = time + _delayTime;
				}

				return true;

			} else {

				if (_onCompleteCallback !== null) {

					_onCompleteCallback.call(_object, _object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

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

/**
 * 设置 AnimationFrame begin
 */
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}

//管理所有图表的渲染任务
var _taskList = []; //[{ id : task: }...]
var _requestAid = null;

function enabledAnimationFrame(){
    if (!_requestAid) {
        _requestAid = requestAnimationFrame(function() {
            //console.log("frame__" + _taskList.length);
            //if ( Tween.getAll().length ) {
            TWEEN.update(); //tween自己会做length判断
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
function registFrame( $frame ) {
    if (!$frame) {
        return;
    }
    _taskList.push($frame);
    return enabledAnimationFrame();
}

/*
 *  @param task 要从渲染帧队列中删除的任务
 */
function destroyFrame( $frame ) {
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
    var opt = _.extend({
        from: null,
        to: null,
        duration: 500,
        onStart: function(){},
        onUpdate: function() {},
        onComplete: function() {},
        onStop: function(){},
        repeat: 0,
        delay: 0,
        easing: 'Linear.None',
        desc: '' //动画描述，方便查找bug
    }, options);

    var tween = {};
    var tid = "tween_" + Base.getUID();
    opt.id && ( tid = tid+"_"+opt.id );

    if (opt.from && opt.to) {
        tween = new TWEEN.Tween( opt.from )
        .to( opt.to, opt.duration )
        .onStart(function(){
            opt.onStart.apply( this );
        })
        .onUpdate( function(){
            opt.onUpdate.apply( this );
        } )
        .onComplete( function() {
            destroyFrame({
                id: tid
            });
            tween._isCompleteed = true;
            opt.onComplete.apply( this , [this] ); //执行用户的conComplete
        } )
        .onStop( function(){
            destroyFrame({
                id: tid
            });
            tween._isStoped = true;
            opt.onStop.apply( this , [this] );
        } )
        .repeat( opt.repeat )
        .delay( opt.delay )
        .easing( TWEEN.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]] );
        
        tween.id = tid;
        tween.start();

        function animate() {

            if ( tween._isCompleteed || tween._isStoped ) {
                tween = null;
                return;
            }
            registFrame({
                id: tid,
                task: animate,
                desc: opt.desc,
                tween: tween
            });
        }
        animate();

    }
    return tween;
}
/*
 * @param tween
 * @result void(0)
 */
function destroyTween(tween , msg) {
    tween.stop();
}

var AnimationFrame = {
    registFrame: registFrame,
    destroyFrame: destroyFrame,
    registTween: registTween,
    destroyTween: destroyTween
};

/**
 * Point
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 */
var Point = function(x,y){
    if(arguments.length==1 && typeof arguments[0] == 'object' ){
       var arg=arguments[0];
       if( "x" in arg && "y" in arg ){
          this.x = arg.x*1;
          this.y = arg.y*1;
       } else {
          var i=0;
          for (var p in arg){
              if(i==0){
                this.x = arg[p]*1;
              } else {
                this.y = arg[p]*1;
                break;
              }
              i++;
          }
       }
       return;
    }
    x || (x=0);
    y || (y=0);
    this.x = x*1;
    this.y = y*1;
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
var CanvaxEvent = function( evt , params ) {
	
	var eventType = "CanvaxEvent"; 
    if( _.isString( evt ) ){
    	eventType = evt;
    }
    if( _.isObject( evt ) && evt.type ){
    	eventType = evt.type;
    }

    this.target = null;
    this.currentTarget = null;	
    this.type   = eventType;
    this.point  = null;

    this._stopPropagation = false ; //默认不阻止事件冒泡
};
CanvaxEvent.prototype = {
    stopPropagation : function() {
        this._stopPropagation = true;
    }
};

var addOrRmoveEventHand = function( domHand , ieHand ){
    if( document[ domHand ] ){
        function eventDomFn( el , type , fn ){
            if( el.length ){
                for(var i=0 ; i < el.length ; i++){
                    eventDomFn( el[i] , type , fn );
                }
            } else {
                el[ domHand ]( type , fn , false );
            }
        }
        return eventDomFn
    } else {
        function eventFn( el , type , fn ){
            if( el.length ){
                for(var i=0 ; i < el.length ; i++){
                    eventFn( el[i],type,fn );
                }
            } else {
                el[ ieHand ]( "on"+type , function(){
                    return fn.call( el , window.event );
                });
            }
        }
        return eventFn
    }
};

var $ = {
    // dom操作相关代码
    query : function(el){
        if(_.isString(el)){
           return document.getElementById(el)
        }
        if(el.nodeType == 1){
           //则为一个element本身
           return el
        }
        if(el.length){
           return el[0]
        }
        return null;
    },
    offset : function(el){
        var box = el.getBoundingClientRect(), 
        doc = el.ownerDocument, 
        body = doc.body, 
        docElem = doc.documentElement, 

        // for ie  
        clientTop = docElem.clientTop || body.clientTop || 0, 
        clientLeft = docElem.clientLeft || body.clientLeft || 0, 

        // In Internet Explorer 7 getBoundingClientRect property is treated as physical, 
        // while others are logical. Make all logical, like in IE8. 
        zoom = 1; 
        if (body.getBoundingClientRect) { 
            var bound = body.getBoundingClientRect(); 
            zoom = (bound.right - bound.left)/body.clientWidth; 
        } 
        if (zoom > 1){ 
            clientTop = 0; 
            clientLeft = 0; 
        } 
        var top = box.top/zoom + (window.pageYOffset || docElem && docElem.scrollTop/zoom || body.scrollTop/zoom) - clientTop, 
            left = box.left/zoom + (window.pageXOffset|| docElem && docElem.scrollLeft/zoom || body.scrollLeft/zoom) - clientLeft; 

        return { 
            top: top, 
            left: left 
        }; 
    },
    addEvent : addOrRmoveEventHand( "addEventListener" , "attachEvent" ),
    removeEvent : addOrRmoveEventHand( "removeEventListener" , "detachEvent" ),
    pageX: function(e) {
        if (e.pageX) return e.pageX;
        else if (e.clientX)
            return e.clientX + (document.documentElement.scrollLeft ?
                    document.documentElement.scrollLeft : document.body.scrollLeft);
        else return null;
    },
    pageY: function(e) {
        if (e.pageY) return e.pageY;
        else if (e.clientY)
            return e.clientY + (document.documentElement.scrollTop ?
                    document.documentElement.scrollTop : document.body.scrollTop);
        else return null;
    }
    //dom相关代码结束
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
var _mouseEventTypes = ["click","dblclick","mousedown","mousemove","mouseup","mouseout"];
var _hammerEventTypes = [ 
    "pan","panstart","panmove","panend","pancancel","panleft","panright","panup","pandown",
    "press" , "pressup",
    "swipe" , "swipeleft" , "swiperight" , "swipeup" , "swipedown",
    "tap"
];

var EventHandler = function(canvax , opt) {
    this.canvax = canvax;

    this.curPoints = [new Point(0, 0)]; //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y
    //当前激活的点对应的obj，在touch下可以是个数组,和上面的 curPoints 对应
    this.curPointsTarget = [];

    this._touching = false;
    //正在拖动，前提是_touching=true
    this._draging = false;

    //当前的鼠标状态
    this._cursor = "default";

    this.target = this.canvax.el;
    this.types = [];

    //mouse体统中不需要配置drag,touch中会用到第三方的touch库，每个库的事件名称可能不一样，
    //就要这里配置，默认实现的是hammerjs的,所以默认可以在项目里引入hammerjs http://hammerjs.github.io/
    this.drag = {
        start : "panstart",
        move : "panmove",
        end : "panend"
    };

    _.extend( true , this , opt );

};

//这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。
var contains = document.compareDocumentPosition ? function (parent, child) {
    if( !child ){
        return false;
    }
    return !!(parent.compareDocumentPosition(child) & 16);
} : function (parent, child) {
    if( !child ){
        return false;
    }
    return child !== child && (parent.contains ? parent.contains(child) : true);
};

EventHandler.prototype = {
    init : function(){
        
        //依次添加上浏览器的自带事件侦听
        var me   = this;
        if( me.target.nodeType == undefined ){
            //如果target.nodeType没有的话， 说明该target为一个jQuery对象 or kissy 对象or hammer对象
            //即为第三方库，那么就要对接第三方库的事件系统。默认实现hammer的大部分事件系统
            if( !me.types || me.types.length == 0  ){
                me.types = _hammerEventTypes;
            }
        } else if( me.target.nodeType == 1 ){
            me.types = _mouseEventTypes;
        }

        _.each( me.types , function( type ){
            //不再关心浏览器环境是否 'ontouchstart' in window 
            //而是直接只管传给事件模块的是一个原生dom还是 jq对象 or hammer对象等
            if( me.target.nodeType == 1 ){
                $.addEvent( me.target , type , function( e ){
                    me.__mouseHandler( e );
                } );
            } else {
                me.target.on( type , function( e ){
                    me.__libHandler( e );
                });
            }
        } );
    },
    /*
    * 原生事件系统------------------------------------------------begin
    * 鼠标事件处理函数
    **/
    __mouseHandler : function(e) {
        var me = this;
        var root = me.canvax;

        root.updateRootOffset();
    
        me.curPoints = [ new Point( 
            $.pageX( e ) - root.rootOffset.left , 
            $.pageY( e ) - root.rootOffset.top
        )];

        //理论上来说，这里拿到point了后，就要计算这个point对应的target来push到curPointsTarget里，
        //但是因为在drag的时候其实是可以不用计算对应target的。
        //所以放在了下面的me.__getcurPointsTarget( e , curMousePoint );常规mousemove中执行

        var curMousePoint  = me.curPoints[0]; 
        var curMouseTarget = me.curPointsTarget[0];

        //模拟drag,mouseover,mouseout 部分代码 begin-------------------------------------------------

        //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了
        if( e.type == "mousedown" ){
           //如果curTarget 的数组为空或者第一个为false ，，，
           if( !curMouseTarget ){
             var obj = root.getObjectsUnderPoint( curMousePoint , 1)[0];
             if(obj){
               me.curPointsTarget = [ obj ];
             }
           }
           curMouseTarget = me.curPointsTarget[0];
           if ( curMouseTarget && curMouseTarget.dragEnabled ){
               //鼠标事件已经摸到了一个
               me._touching = true;
           }
        }

        if( e.type == "mouseup" || (e.type == "mouseout" && !contains(root.el , (e.toElement || e.relatedTarget) )) ){
            if(me._draging == true){
                //说明刚刚在拖动
                me._dragEnd( e , curMouseTarget , 0 );
                curMouseTarget.fire("dragend");
            }
            me._draging  = false;
            me._touching = false;
        }

        if( e.type == "mouseout" ){
            if( !contains(root.el , (e.toElement || e.relatedTarget) ) ){
                me.__getcurPointsTarget(e , curMousePoint);
            }
        } else if( e.type == "mousemove" ){  //|| e.type == "mousedown" ){
            //拖动过程中就不在做其他的mouseover检测，drag优先
            if(me._touching && e.type == "mousemove" && curMouseTarget){
                //说明正在拖动啊
                if(!me._draging){
                    //begin drag
                    curMouseTarget.fire("dragstart");
                    //先把本尊给隐藏了
                    curMouseTarget.context.globalAlpha = 0;
                    //然后克隆一个副本到activeStage
                    
                    var cloneObject = me._clone2hoverStage( curMouseTarget , 0 );
                    cloneObject.context.globalAlpha = curMouseTarget._globalAlpha;
                } else {
                    //drag move ing
                    me._dragMoveHander( e , curMouseTarget , 0 );
                }
                me._draging = true;
            } else {
                //常规mousemove检测
                //move事件中，需要不停的搜索target，这个开销挺大，
                //后续可以优化，加上和帧率相当的延迟处理
                me.__getcurPointsTarget( e , curMousePoint );
            }

        } else {
            //其他的事件就直接在target上面派发事件
            var child = curMouseTarget;
            if( !child ){
                child = root;
            }
            me.__dispatchEventInChilds( e , [ child ] );
            me._cursorHander( child );
        }

        if( root.preventDefault ) {
            //阻止默认浏览器动作(W3C) 
            if ( e && e.preventDefault ) {
                e.preventDefault(); 
            } else {
                window.event.returnValue = false;
            }
        } 
    },
    __getcurPointsTarget : function(e , point ) {
        var me     = this;
        var root   = me.canvax;
        var oldObj = me.curPointsTarget[0];

        if( oldObj && !oldObj.context ){
            oldObj = null;
        }

        var e = new CanvaxEvent( e );

        if( e.type=="mousemove"
            && oldObj && oldObj._hoverClass && oldObj.pointChkPriority
            && oldObj.getChildInPoint( point ) ){
            //小优化,鼠标move的时候。计算频率太大，所以。做此优化
            //如果有target存在，而且当前元素正在hoverStage中，而且当前鼠标还在target内,就没必要取检测整个displayList了
            //开发派发常规mousemove事件
            e.target = e.currentTarget = oldObj;
            e.point  = oldObj.globalToLocal( point );
            oldObj.dispatchEvent( e );
            return;
        }
        var obj = root.getObjectsUnderPoint( point , 1)[0];

        if(oldObj && oldObj != obj || e.type=="mouseout") {
            if( oldObj && oldObj.context ){
                me.curPointsTarget[0] = null;
                e.type     = "mouseout";
                e.toTarget = obj; 
                e.target   = e.currentTarget = oldObj;
                e.point    = oldObj.globalToLocal( point );
                oldObj.dispatchEvent( e );
            }
        }

        if( obj && oldObj != obj ){ //&& obj._hoverable 已经 干掉了
            me.curPointsTarget[0] = obj;
            e.type       = "mouseover";
            e.fromTarget = oldObj;
            e.target     = e.currentTarget = obj;
            e.point      = obj.globalToLocal( point );
            obj.dispatchEvent( e );
        }

        if( e.type == "mousemove" && obj ){
            e.target = e.currentTarget = oldObj;
            e.point  = oldObj.globalToLocal( point );
            oldObj.dispatchEvent( e );
        }
        me._cursorHander( obj , oldObj );
    },
    _cursorHander    : function( obj , oldObj ){
        if(!obj && !oldObj ){
            this._setCursor("default");
        }
        if(obj && oldObj != obj && obj.context){
            this._setCursor(obj.context.cursor);
        }
    },
    _setCursor : function(cursor) {
        if(this._cursor == cursor){
          //如果两次要设置的鼠标状态是一样的
          return;
        }
        this.canvax.el.style.cursor = cursor;
        this._cursor = cursor;
    },
    /*
    * 原生事件系统------------------------------------------------end
    */

    /*
     *第三方库的事件系统------------------------------------------------begin
     *触屏事件处理函数
     * */
    __libHandler : function( e ) {
        var me   = this;
        var root = me.canvax;
        root.updateRootOffset();
        // touch 下的 curPointsTarget 从touches中来
        //获取canvax坐标系统里面的坐标
        me.curPoints = me.__getCanvaxPointInTouchs( e );
        if( !me._draging ){
            //如果在draging的话，target已经是选中了的，可以不用 检测了
            me.curPointsTarget = me.__getChildInTouchs( me.curPoints );
        }
        if( me.curPointsTarget.length > 0 ){
            //drag开始
            if( e.type == me.drag.start){
                //dragstart的时候touch已经准备好了target， curPointsTarget 里面只要有一个是有效的
                //就认为drags开始
                _.each( me.curPointsTarget , function( child , i ){
                    if( child && child.dragEnabled ){
                       //只要有一个元素就认为正在准备drag了
                       me._draging = true;
                       //然后克隆一个副本到activeStage
                       me._clone2hoverStage( child , i );
                       //先把本尊给隐藏了
                       child.context.globalAlpha = 0;

                       child.fire("dragstart");

                       return false;
                    }
                } ); 
            }

            //dragIng
            if( e.type == me.drag.move){
                if( me._draging ){
                    _.each( me.curPointsTarget , function( child , i ){
                        if( child && child.dragEnabled) {
                           me._dragMoveHander( e , child , i);
                        }
                    } );
                }
            }

            //drag结束
            if( e.type == me.drag.end){
                if( me._draging ){
                    _.each( me.curPointsTarget , function( child , i ){
                        if( child && child.dragEnabled) {
                            me._dragEnd( e , child , 0 );
                            child.fire("dragend");
                        }
                    } );
                    me._draging = false;
                }
            }
            me.__dispatchEventInChilds( e , me.curPointsTarget );
        } else {
            //如果当前没有一个target，就把事件派发到canvax上面
            me.__dispatchEventInChilds( e , [ root ] );
        }
    },
    //从touchs中获取到对应touch , 在上面添加上canvax坐标系统的x，y
    __getCanvaxPointInTouchs : function( e ){
        var me        = this;
        var root      = me.canvax;
        var curTouchs = [];
        _.each( e.point , function( touch ){
           touch.x = touch.pageX - root.rootOffset.left , 
           touch.y = touch.pageY - root.rootOffset.top;
           curTouchs.push( touch );
        });
        return curTouchs;
    },
    __getChildInTouchs : function( touchs ){
        var me   = this;
        var root = me.canvax;
        var touchesTarget = [];
        _.each( touchs , function(touch){
            touchesTarget.push( root.getObjectsUnderPoint( touch , 1)[0] );
        } );
        return touchesTarget;
    },
    /*
    *第三方库的事件系统------------------------------------------------begin
    */


    /*
     *@param {array} childs 
     * */
    __dispatchEventInChilds: function(e, childs) {
        if (!childs && !("length" in childs)) {
            return false;
        }
        var me = this;
        var hasChild = false;
        _.each(childs, function(child, i) {
            if (child) {
                hasChild = true;
                var ce = new CanvaxEvent(e);
                ce.target = ce.currentTarget = child || this;
                ce.stagePoint = me.curPoints[i];
                ce.point = ce.target.globalToLocal(ce.stagePoint);
                child.dispatchEvent(ce);
            }
        });
        return hasChild;
    },
    //克隆一个元素到hover stage中去
    _clone2hoverStage: function(target, i) {
        var me = this;
        var root = me.canvax;
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        if (!_dragDuplicate) {
            _dragDuplicate = target.clone(true);
            _dragDuplicate._transform = target.getConcatenatedMatrix();

            /**
             *TODO: 因为后续可能会有手动添加的 元素到_bufferStage 里面来
             *比如tips
             *这类手动添加进来的肯定是因为需要显示在最外层的。在hover元素之上。
             *所有自动添加的hover元素都默认添加在_bufferStage的最底层
             **/
            root._bufferStage.addChildAt(_dragDuplicate, 0);
        }
        _dragDuplicate.context.globalAlpha = target._globalAlpha;
        target._dragPoint = target.globalToLocal(me.curPoints[i]);
        return _dragDuplicate;
    },
    //drag 中 的处理函数
    _dragMoveHander: function(e, target, i) {
        var me = this;
        var root = me.canvax;
        var _point = target.globalToLocal( me.curPoints[i] );

        //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化
        target._notWatch = true;
        var _moveStage = target.moveing;
        target.moveing = true;
        target.context.x += (_point.x - target._dragPoint.x);
        target.context.y += (_point.y - target._dragPoint.y);
        target.fire("dragmove");
        target.moveing = _moveStage;
        target._notWatch = false;
        //同步完毕本尊的位置

        //这里只能直接修改_transform 。 不能用下面的修改x，y的方式。
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        _dragDuplicate._transform = target.getConcatenatedMatrix();
        //以为直接修改的_transform不会出发心跳上报， 渲染引擎不制动这个stage需要绘制。
        //所以要手动出发心跳包
        _dragDuplicate.heartBeat();
    },
    //drag结束的处理函数
    _dragEnd: function(e, target, i) {
        var me = this;
        var root = me.canvax;

        //_dragDuplicate 复制在_bufferStage 中的副本
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        _dragDuplicate.destroy();

        target.context.globalAlpha = target._globalAlpha;
    }
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 事件管理类
 */
/**
 * 构造函数.
 * @name EventDispatcher
 * @class EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
 */
var EventManager = function() {
    //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
    this._eventMap = {};
};

EventManager.prototype = { 
    /*
     * 注册事件侦听器对象，以使侦听器能够接收事件通知。
     */
    _addEventListener : function(type, listener) {

        if( typeof listener != "function" ){
          //listener必须是个function呐亲
          return false;
        }
        var addResult = true;
        var self      = this;
        _.each( type.split(" ") , function(type){
            var map = self._eventMap[type];
            if(!map){
                map = self._eventMap[type] = [];
                map.push(listener);
                self._eventEnabled = true;
                return true;
            }

            if(_.indexOf(map ,listener) == -1) {
                map.push(listener);
                self._eventEnabled = true;
                return true;
            }

            addResult = false;
        });
        return addResult;
    },
    /**
     * 删除事件侦听器。
     */
    _removeEventListener : function(type, listener) {
        if(arguments.length == 1) return this.removeEventListenerByType(type);

        var map = this._eventMap[type];
        if(!map){
            return false;
        }

        for(var i = 0; i < map.length; i++) {
            var li = map[i];
            if(li === listener) {
                map.splice(i, 1);
                if(map.length    == 0) { 
                    delete this._eventMap[type];
                    //如果这个如果这个时候child没有任何事件侦听
                    if(_.isEmpty(this._eventMap)){
                        //那么该元素不再接受事件的检测
                        this._eventEnabled = false;
                    }
                }
                return true;
            }
        }
        
        return false;
    },
    /**
     * 删除指定类型的所有事件侦听器。
     */
    _removeEventListenerByType : function(type) {
        var map = this._eventMap[type];
        if(!map) {
            delete this._eventMap[type];

            //如果这个如果这个时候child没有任何事件侦听
            if(_.isEmpty(this._eventMap)){
                //那么该元素不再接受事件的检测
                this._eventEnabled = false;
            }

            return true;
        }
        return false;
    },
    /**
     * 删除所有事件侦听器。
     */
    _removeAllEventListeners : function() {	
        this._eventMap = {};
        this._eventEnabled = false;
    },
    /**
    * 派发事件，调用事件侦听器。
    */
    _dispatchEvent : function(e) {
        var map = this._eventMap[e.type];
        
        if( map ){
            if(!e.target) e.target = this;
            map = map.slice();

            for(var i = 0; i < map.length; i++) {
                var listener = map[i];
                if(typeof(listener) == "function") {
                    listener.call(this, e);
                }
            }
        }

        if( !e._stopPropagation ) {
            //向上冒泡
            if( this.parent ){
                e.currentTarget = this.parent;
                this.parent._dispatchEvent( e );
            }
        } 
        return true;
    },
    /**
       * 检查是否为指定事件类型注册了任何侦听器。
       */
    _hasEventListener : function(type) {
        var map = this._eventMap[type];
        return map != null && map.length > 0;
    }
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 事件派发类
 */
var EventDispatcher = function(){
    EventDispatcher.superclass.constructor.call(this, name);
};

Base.creatClass(EventDispatcher , EventManager , {
    on : function(type, listener){
        this._addEventListener( type, listener);
        return this;
    },
    addEventListener:function(type, listener){
        this._addEventListener( type, listener);
        return this;
    },
    un : function(type,listener){
        this._removeEventListener( type, listener);
        return this;
    },
    removeEventListener:function(type,listener){
        this._removeEventListener( type, listener);
        return this;
    },
    removeEventListenerByType:function(type){
        this._removeEventListenerByType( type);
        return this;
    },
    removeAllEventListeners:function(){
        this._removeAllEventListeners();
        return this;
    },

    //params 要传给evt的eventhandler处理函数的参数，会被merge到Canvax event中
    fire : function(eventType , params){
        var e = new CanvaxEvent( eventType );

        if( params ){
            for( var p in params ){
                if( p in e ){
                    //params中的数据不能覆盖event属性
                    console.log( p + "属性不能覆盖CanvaxEvent属性" );
                } else {
                    e[p] = params[p];
                }
            }
        }

        var me = this;
        _.each( eventType.split(" ") , function(eType){
            e.currentTarget = me;
            me.dispatchEvent( e );
        } );
        return this;
    },
    dispatchEvent:function(event){
        //this instanceof DisplayObjectContainer ==> this.children
        //TODO: 这里import DisplayObjectContainer 的话，在displayObject里面的import EventDispatcher from "../event/EventDispatcher";
        //会得到一个undefined，感觉是成了一个循环依赖的问题，所以这里换用简单的判断来判断自己是一个容易，拥有children
        if( this.children  && event.point ){
            var target = this.getObjectsUnderPoint( event.point , 1)[0];
            if( target ){
                target.dispatchEvent( event );
            }
            return;
        }
        
        if(this.context && event.type == "mouseover"){
            //记录dispatchEvent之前的心跳
            var preHeartBeat = this._heartBeatNum;
            var pregAlpha    = this.context.globalAlpha;
            this._dispatchEvent( event );
            if( preHeartBeat != this._heartBeatNum ){
                this._hoverClass = true;
                if( this.hoverClone ){
                    var canvax = this.getStage().parent;
                    //然后clone一份obj，添加到_bufferStage 中
                    var activShape = this.clone(true);                     
                    activShape._transform = this.getConcatenatedMatrix();
                    canvax._bufferStage.addChildAt( activShape , 0 ); 
                    //然后把自己隐藏了
                    this._globalAlpha = pregAlpha;
                    this.context.globalAlpha = 0;
                }
            }
            return;
        }

        this._dispatchEvent( event );

        if( this.context && event.type == "mouseout"){
            if(this._hoverClass){
                //说明刚刚over的时候有添加样式
                var canvax = this.getStage().parent;
                this._hoverClass = false;
                canvax._bufferStage.removeChildById(this.id);
                
                if( this._globalAlpha ){
                    this.context.globalAlpha = this._globalAlpha;
                    delete this._globalAlpha;
                }
            }
        }

        return this;
    },
    hasEvent:function(type){
        return this._hasEventListener(type);
    },
    hasEventListener:function(type){
        return this._hasEventListener(type);
    },
    hover : function( overFun , outFun ){
        this.on("mouseover" , overFun);
        this.on("mouseout"  , outFun );
        return this;
    },
    once : function(type, listener){
        var me = this;
        var onceHandle = function(){
            listener.apply(me , arguments);
            this.un(type , onceHandle);
        };
        this.on(type , onceHandle);
        return this;
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * Matrix 矩阵库 用于整个系统的几何变换计算
 * code from http://evanw.github.io/lightgl.js/docs/matrix.html
 */
var Matrix = function(a, b, c, d, tx, ty){
    this.a = a != undefined ? a : 1;
    this.b = b != undefined ? b : 0;
    this.c = c != undefined ? c : 0;
    this.d = d != undefined ? d : 1;
    this.tx = tx != undefined ? tx : 0;
    this.ty = ty != undefined ? ty : 0;
};

Base.creatClass( Matrix , function(){} , {
    concat : function(mtx){
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
    concatTransform : function(x, y, scaleX, scaleY, rotation){
        var cos = 1;
        var sin = 0;
        if(rotation%360){
            var r = rotation * Math.PI / 180;
            cos = Math.cos(r);
            sin = Math.sin(r);
        }

        this.concat(new Matrix(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y));
        return this;
    },
    rotate : function(angle){
        //目前已经提供对顺时针逆时针两个方向旋转的支持
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var a = this.a;
        var c = this.c;
        var tx = this.tx;

        if (angle>0){
            this.a = a * cos - this.b * sin;
            this.b = a * sin + this.b * cos;
            this.c = c * cos - this.d * sin;
            this.d = c * sin + this.d * cos;
            this.tx = tx * cos - this.ty * sin;
            this.ty = tx * sin + this.ty * cos;
        } else {
            var st = Math.sin(Math.abs(angle));
            var ct = Math.cos(Math.abs(angle));

            this.a = a*ct + this.b*st;
            this.b = -a*st + this.b*ct;
            this.c = c*ct + this.d*st;
            this.d = -c*st + ct*this.d;
            this.tx = ct*tx + st*this.ty;
            this.ty = ct*this.ty - st*tx;
        }
        return this;
    },
    scale : function(sx, sy){
        this.a *= sx;
        this.d *= sy;
        this.tx *= sx;
        this.ty *= sy;
        return this;
    },
    translate : function(dx, dy){
        this.tx += dx;
        this.ty += dy;
        return this;
    },
    identity : function(){
        //初始化
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    },
    invert : function(){
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
    clone : function(){
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    toArray : function(){
        return [ this.a , this.b , this.c , this.d , this.tx , this.ty ];
    },
    /**
     * 矩阵左乘向量
     */
    mulVector : function(v) {
        var aa = this.a, ac = this.c, atx = this.tx;
        var ab = this.b, ad = this.d, aty = this.ty;

        var out = [0,0];
        out[0] = v[0] * aa + v[1] * ac + atx;
        out[1] = v[0] * ab + v[1] * ad + aty;

        return out;
    }    
} );

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 数学 类
 *
 **/



var _cache = {
    sin : {},     //sin缓存
    cos : {}      //cos缓存
};
var _radians = Math.PI / 180;

/**
 * @param angle 弧度（角度）参数
 * @param isDegrees angle参数是否为角度计算，默认为false，angle为以弧度计量的角度
 */
function sin(angle, isDegrees) {
    angle = (isDegrees ? angle * _radians : angle).toFixed(4);
    if(typeof _cache.sin[angle] == 'undefined') {
        _cache.sin[angle] = Math.sin(angle);
    }
    return _cache.sin[angle];
}

/**
 * @param radians 弧度参数
 */
function cos(angle, isDegrees) {
    angle = (isDegrees ? angle * _radians : angle).toFixed(4);
    if(typeof _cache.cos[angle] == 'undefined') {
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
function degreeTo360( angle ) {
    var reAng = (360 +  angle  % 360) % 360;//Math.abs(360 + Math.ceil( angle ) % 360) % 360;
    if( reAng == 0 && angle !== 0 ){
        reAng = 360;
    }
    return reAng;
}

var myMath = {
    PI  : Math.PI  ,
    sin : sin      ,
    cos : cos      ,
    degreeToRadian : degreeToRadian,
    radianToDegree : radianToDegree,
    degreeTo360    : degreeTo360   
};

/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 * 点击检测 类
 * */
/**
 * 包含判断
 * shape : 图形
 * x : 横坐标
 * y : 纵坐标
 */
function isInside(shape, point) {
    var x = point.x;
    var y = point.y;
    if (!shape || !shape.type) {
        // 无参数或不支持类型
        return false;
    }
    //数学运算，主要是line，brokenLine
    return _pointInShape(shape, x, y);
}

function _pointInShape(shape, x, y) {
    // 在矩形内则部分图形需要进一步判断
    switch (shape.type) {
        case 'line':
            return _isInsideLine(shape.context, x, y);
        case 'brokenline':
            return _isInsideBrokenLine(shape, x, y);
        case 'text':
            return true;
        case 'rect':
            return true;
        case 'circle':
            return _isInsideCircle(shape, x, y);
        case 'ellipse':
            return _isPointInElipse(shape, x, y);
        case 'sector':
            return _isInsideSector(shape, x, y);
        case 'path':
        case 'droplet':
            return _isInsidePath(shape, x, y);
        case 'polygon':
        case 'isogon':
            return _isInsidePolygon_WindingNumber(shape, x, y);
            //return _isInsidePolygon_CrossingNumber(shape, x, y);
    }
}
/**
 * !isInside
 */
function isOutside(shape, x, y) {
    return !isInside(shape, x, y);
}

/**
 * 线段包含判断
 */
function _isInsideLine(context, x, y) {
    var x0 = context.xStart;
    var y0 = context.yStart;
    var x1 = context.xEnd;
    var y1 = context.yEnd;
    var _l = Math.max(context.lineWidth , 3);
    var _a = 0;
    var _b = x0;

    if(
        (y > y0 + _l && y > y1 + _l) 
        || (y < y0 - _l && y < y1 - _l) 
        || (x > x0 + _l && x > x1 + _l) 
        || (x < x0 - _l && x < x1 - _l) 
    ){
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
}

function _isInsideBrokenLine(shape, x, y) {
    var context = shape.context;
    var pointList = context.pointList;
    var lineArea;
    var insideCatch = false;
    for (var i = 0, l = pointList.length - 1; i < l; i++) {
        lineArea = {
            xStart: pointList[i][0],
            yStart: pointList[i][1],
            xEnd: pointList[i + 1][0],
            yEnd: pointList[i + 1][1],
            lineWidth: context.lineWidth
        };
        if (!_isInsideRectangle({
                    x: Math.min(lineArea.xStart, lineArea.xEnd) - lineArea.lineWidth,
                    y: Math.min(lineArea.yStart, lineArea.yEnd) - lineArea.lineWidth,
                    width: Math.abs(lineArea.xStart - lineArea.xEnd) + lineArea.lineWidth,
                    height: Math.abs(lineArea.yStart - lineArea.yEnd) + lineArea.lineWidth
                },
                x, y
            )) {
            // 不在矩形区内跳过
            continue;
        }
        insideCatch = _isInsideLine(lineArea, x, y);
        if (insideCatch) {
            break;
        }
    }
    return insideCatch;
}


/**
 * 矩形包含判断
 */
function _isInsideRectangle(shape, x, y) {
    if (x >= shape.x && x <= (shape.x + shape.width) && y >= shape.y && y <= (shape.y + shape.height)) {
        return true;
    }
    return false;
}

/**
 * 圆形包含判断
 */
function _isInsideCircle(shape, x, y, r) {
    var context = shape.context;
    !r && (r = context.r);
    return (x * x + y * y) < r * r;
}

/**
 * 扇形包含判断
 */
function _isInsideSector(shape, x, y) {
    var context = shape.context;
    if (!_isInsideCircle(shape, x, y) || (context.r0 > 0 && _isInsideCircle(shape, x, y, context.r0))) {
        // 大圆外或者小圆内直接false
        return false;
    } else {
        // 判断夹角
        var startAngle = myMath.degreeTo360(context.startAngle); // 起始角度[0,360)
        var endAngle = myMath.degreeTo360(context.endAngle); // 结束角度(0,360]

        //计算该点所在的角度
        var angle = myMath.degreeTo360((Math.atan2(y, x) / Math.PI * 180) % 360);

        var regIn = true; //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
        if ((startAngle > endAngle && !context.clockwise) || (startAngle < endAngle && context.clockwise)) {
            regIn = false; //out
        }
        //度的范围，从小到大
        var regAngle = [
            Math.min(startAngle, endAngle),
            Math.max(startAngle, endAngle)
        ];

        var inAngleReg = angle > regAngle[0] && angle < regAngle[1];
        return (inAngleReg && regIn) || (!inAngleReg && !regIn);
    }
}

/*
 *椭圆包含判断
 * */
function _isPointInElipse(shape, x, y) {
    var context = shape.context;
    var center = {
        x: 0,
        y: 0
    };
    //x半径
    var XRadius = context.hr;
    var YRadius = context.vr;

    var p = {
        x: x,
        y: y
    };

    var iRes;

    p.x -= center.x;
    p.y -= center.y;

    p.x *= p.x;
    p.y *= p.y;

    XRadius *= XRadius;
    YRadius *= YRadius;

    iRes = YRadius * p.x + XRadius * p.y - XRadius * YRadius;

    return (iRes < 0);
}

/**
 * 多边形包含判断 Nonzero Winding Number Rule
 */

function _isInsidePolygon_WindingNumber(shape, x, y) {
    var context = shape.context ? shape.context : shape;
    var poly = _.clone(context.pointList); //poly 多边形顶点，数组成员的格式同 p
    poly.push(poly[0]); //记得要闭合
    var wn = 0;
    for (var shiftP, shift = poly[0][1] > y, i = 1; i < poly.length; i++) {
        //先做线的检测，如果是在两点的线上，就肯定是在认为在图形上
        var inLine = _isInsideLine({
            xStart : poly[i-1][0],
            yStart : poly[i-1][1],
            xEnd   : poly[i][0],
            yEnd   : poly[i][1],
            lineWidth : (context.lineWidth || 1)
        } , x , y);
        if ( inLine ){
            return true;
        }
        //如果有fillStyle ， 那么肯定需要做面的检测
        if (context.fillStyle) {
            shiftP = shift;
            shift = poly[i][1] > y;
            if (shiftP != shift) {
                var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);
                if (n * ((poly[i - 1][0] - x) * (poly[i][1] - y) - (poly[i - 1][1] - y) * (poly[i][0] - x)) > 0) {
                    wn += n;
                }
            }
        }
    }
    return wn;
}

/**
 * 路径包含判断，依赖多边形判断
 */
function _isInsidePath(shape, x, y) {
    var context = shape.context;
    var pointList = context.pointList;
    var insideCatch = false;
    for (var i = 0, l = pointList.length; i < l; i++) {
        insideCatch = _isInsidePolygon_WindingNumber({
            pointList: pointList[i],
            lineWidth: context.lineWidth,
            fillStyle: context.fillStyle
        }, x, y);
        if (insideCatch) {
            break;
        }
    }
    return insideCatch;
}

var HitTestPoint = {
    isInside: isInside,
    isOutside: isOutside
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 属性工厂，ie下面用VBS提供支持
 * 来给整个引擎提供心跳包的触发机制
 */
//定义封装好的兼容大部分浏览器的defineProperties 的 属性工厂
var unwatchOne = {
    "$skipArray" : 0,
    "$watch"     : 1,
    "$fire"      : 2,//主要是get set 显性设置的 触发
    "$model"     : 3,
    "$accessor"  : 4,
    "$owner"     : 5,
    //"path"       : 6, //这个应该是唯一一个不用watch的不带$的成员了吧，因为地图等的path是在太大
    "$parent"    : 7  //用于建立数据的关系链
};

function PropertyFactory(scope, model, watchMore) {

    var stopRepeatAssign=true;

    var skipArray = scope.$skipArray, //要忽略监控的属性名列表
        pmodel = {}, //要返回的对象
        accessores = {}, //内部用于转换的对象
        VBPublics = _.keys( unwatchOne ); //用于IE6-8

        model = model || {};//这是pmodel上的$model属性
        watchMore = watchMore || {};//以$开头但要强制监听的属性
        skipArray = _.isArray(skipArray) ? skipArray.concat(VBPublics) : VBPublics;

    function loop(name, val) {
        if ( !unwatchOne[name] || (unwatchOne[name] && name.charAt(0) !== "$") ) {
            model[name] = val;
        }
        var valueType = typeof val;
        if (valueType === "function") {
            if(!unwatchOne[name]){
              VBPublics.push(name); //函数无需要转换
            }
        } else {
            if (_.indexOf(skipArray,name) !== -1 || (name.charAt(0) === "$" && !watchMore[name])) {
                return VBPublics.push(name)
            }
            var accessor = function(neo) { //创建监控属性或数组，自变量，由用户触发其改变
                var value = accessor.value, preValue = value, complexValue;
                
                if (arguments.length) {
                    //写操作
                    //set 的 值的 类型
                    var neoType = typeof neo;

                    if (stopRepeatAssign) {
                        return //阻止重复赋值
                    }
                    if (value !== neo) {
                        if( neo && neoType === "object" && 
                            !(neo instanceof Array) &&
                            !neo.addColorStop // neo instanceof CanvasGradient
                         ){
                            value = neo.$model ? neo : PropertyFactory(neo , neo);
                            complexValue = value.$model;
                        } else {//如果是其他数据类型
                            //if( neoType === "array" ){
                            //    value = _.clone(neo);
                            //} else {
                                value = neo;
                            //}
                        }
                        accessor.value = value;
                        model[name] = complexValue ? complexValue : value;//更新$model中的值
                        if (!complexValue) {
                            pmodel.$fire && pmodel.$fire(name, value, preValue);
                        }
                        if(valueType != neoType){
                            //如果set的值类型已经改变，
                            //那么也要把对应的valueType修改为对应的neoType
                            valueType = neoType;
                        }
                        var hasWatchModel = pmodel;
                        //所有的赋值都要触发watch的监听事件
                        if ( !pmodel.$watch ) {
                          while( hasWatchModel.$parent ){
                             hasWatchModel = hasWatchModel.$parent;
                          }
                        }
                        if ( hasWatchModel.$watch ) {
                          hasWatchModel.$watch.call(hasWatchModel , name, value, preValue);
                        }
                    }
                } else {
                    //读操作
                    //读的时候，发现value是个obj，而且还没有defineProperty
                    //那么就临时defineProperty一次
                    if ( value && (valueType === "object") 
                       && !(value instanceof Array) 
                       && !value.$model
                       && !value.addColorStop) {
                        //建立和父数据节点的关系
                        value.$parent = pmodel;
                        value = PropertyFactory(value , value);

                        //accessor.value 重新复制为defineProperty过后的对象
                        accessor.value = value;
                    }
                    return value;
                }
            };
            accessor.value = val;
            
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

    pmodel = defineProperties(pmodel, accessores, VBPublics);//生成一个空的ViewModel

    _.forEach(VBPublics,function(name) {
        if (scope[name]) {//先为函数等不被监控的属性赋值
            if(typeof scope[name] == "function" ){
               pmodel[name] = function(){
                  scope[name].apply(this , arguments);
               };
            } else {
               pmodel[name] = scope[name];
            }
        }
    });

    pmodel.$model = model;
    pmodel.$accessor = accessores;

    pmodel.hasOwnProperty = function(name) {
        return name in pmodel.$model
    };

    stopRepeatAssign = false;

    return pmodel
}
var defineProperty = Object.defineProperty;
    //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
    //标准浏览器使用__defineGetter__, __defineSetter__实现
    try {
        defineProperty({}, "_", {
            value: "x"
        });
        var defineProperties = Object.defineProperties;
    } catch (e) {
        if ("__defineGetter__" in Object) {
            defineProperty = function(obj, prop, desc) {
                if ('value' in desc) {
                    obj[prop] = desc.value;
                }
                if ('get' in desc) {
                    obj.__defineGetter__(prop, desc.get);
                }
                if ('set' in desc) {
                    obj.__defineSetter__(prop, desc.set);
                }
                return obj
            };
            defineProperties = function(obj, descs) {
                for (var prop in descs) {
                    if (descs.hasOwnProperty(prop)) {
                        defineProperty(obj, prop, descs[prop]);
                    }
                }
                return obj
            };
        }
    }
//IE6-8使用VBScript类的set get语句实现
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
    }
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
                owner[name] = true; //因为VBScript对象不能像JS那样随意增删属性
            buffer.push("\tPublic [" + name + "]"); //你可以预先放到skipArray中
            }
        });
        for (var name in description) {
            owner[name] = true;
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
                        "\tEnd Property");
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
    };
}
window.PropertyFactory = PropertyFactory;

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 的 现实对象基类
 */
var DisplayObject = function(opt){
    DisplayObject.superclass.constructor.apply(this, arguments);
    var self = this;

    //如果用户没有传入context设置，就默认为空的对象
    opt      = Base.checkOpt( opt );

    //设置默认属性
    self.id  = opt.id || null;

    //相对父级元素的矩阵
    self._transform      = null;

    //心跳次数
    self._heartBeatNum   = 0;

    //元素对应的stage元素
    self.stage           = null;

    //元素的父元素
    self.parent          = null;

    self._eventEnabled   = false;   //是否响应事件交互,在添加了事件侦听后会自动设置为true

    self.dragEnabled     = true ;//"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽

    self.xyToInt         = "xyToInt" in opt ? opt.xyToInt : true;    //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

    self.moveing = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

    //创建好context
    self._createContext( opt );

    var UID = Base.createId(self.type);

    //如果没有id 则 沿用uid
    if(self.id == null){
        self.id = UID ;
    }

    self.init.apply(self , arguments);

    //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform
    this._updateTransform();
};

/**
 * 简单的浅复制对象。
 * @param strict  当为true时只覆盖已有属性
 */
var copy = function(target, source, strict){ 
    if ( _.isEmpty(source) ){
        return target;
    }
    for(var key in source){
        if(!strict || target.hasOwnProperty(key) || target[key] !== undefined){
            target[key] = source[key];
        }
    }
    return target;
};

Base.creatClass( DisplayObject , EventDispatcher , {
    init : function(){},
    _createContext : function( opt ){
        var self = this;
        //所有显示对象，都有一个类似canvas.context类似的 context属性
        //用来存取改显示对象所有和显示有关的属性，坐标，样式等。
        //该对象为Coer.PropertyFactory()工厂函数生成
        self.context = null;

        //提供给Coer.PropertyFactory() 来 给 self.context 设置 propertys
        //这里不能用_.extend， 因为要保证_contextATTRS的纯粹，只覆盖下面已有的属性
        var _contextATTRS = copy( {
            width         : 0,
            height        : 0,
            x             : 0,
            y             : 0,
            scaleX        : 1,
            scaleY        : 1,
            scaleOrigin   : {
                x : 0,
                y : 0
            },
            rotation      : 0,
            rotateOrigin  :  {
                x : 0,
                y : 0
            },
            visible       : true,
            cursor        : "default",
            //canvas context 2d 的 系统样式。目前就知道这么多
            fillStyle     : null,//"#000000",
            lineCap       : null,
            lineJoin      : null,
            lineWidth     : null,
            miterLimit    : null,
            shadowBlur    : null,
            shadowColor   : null,
            shadowOffsetX : null,
            shadowOffsetY : null,
            strokeStyle   : null,
            globalAlpha   : 1,
            font          : null,
            textAlign     : "left",
            textBaseline  : "top", 
            arcScaleX_    : null,
            arcScaleY_    : null,
            lineScale_    : null,
            globalCompositeOperation : null
        } , opt.context , true );            

        //然后看继承者是否有提供_context 对象 需要 我 merge到_context2D_context中去的
        if (self._context) {
            _contextATTRS = _.extend(_contextATTRS , self._context );
        }

        //有些引擎内部设置context属性的时候是不用上报心跳的，比如做hitTestPoint热点检测的时候
        self._notWatch = false;

        _contextATTRS.$owner = self;
        _contextATTRS.$watch = function(name , value , preValue){

            //下面的这些属性变化，都会需要重新组织矩阵属性_transform 
            var transFormProps = [ "x" , "y" , "scaleX" , "scaleY" , "rotation" , "scaleOrigin" , "rotateOrigin, lineWidth" ];

            if( _.indexOf( transFormProps , name ) >= 0 ) {
                this.$owner._updateTransform();
            }

            if( this.$owner._notWatch ){
                return;
            }

            if( this.$owner.$watch ){
                this.$owner.$watch( name , value , preValue );
            }

            this.$owner.heartBeat( {
                convertType:"context",
                shape      : this.$owner,
                name       : name,
                value      : value,
                preValue   : preValue
            });
            
        };

        //执行init之前，应该就根据参数，把context组织好线
        self.context = PropertyFactory( _contextATTRS );
    },
    /* @myself 是否生成自己的镜像 
     * 克隆又两种，一种是镜像，另外一种是绝对意义上面的新个体
     * 默认为绝对意义上面的新个体，新对象id不能相同
     * 镜像基本上是框架内部在实现  镜像的id相同 主要用来把自己画到另外的stage里面，比如
     * mouseover和mouseout的时候调用*/
    clone : function( myself ){
        var conf   = {
            id      : this.id,
            context : _.clone(this.context.$model)
        };
        if( this.img ){
            conf.img = this.img;
        }
        var newObj;
        if( this.type == 'text' ){
            newObj = new this.constructor( this.text , conf );
        } else {
            newObj = new this.constructor( conf );
        }
        if( this.children ){
            newObj.children = this.children;
        }
        if (!myself){
            newObj.id       = Base.createId(newObj.type);
        }
        return newObj;
    },
    heartBeat : function(opt){
        //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
        //的属性，所以，通知到stage.displayAttrHasChange
        var stage = this.getStage();
        if( stage ){
            this._heartBeatNum ++;
            stage.heartBeat && stage.heartBeat( opt );
        }
    },
    getCurrentWidth : function(){
       return Math.abs(this.context.width * this.context.scaleX);
    },
    getCurrentHeight : function(){
       return Math.abs(this.context.height * this.context.scaleY);
    },
    getStage : function(){
        if( this.stage ) {
            return this.stage;
        }
        var p = this;
        if (p.type != "stage"){
          while(p.parent) {
            p = p.parent;
            if (p.type == "stage"){
              break;
            }
          }
          if (p.type !== "stage") {
            //如果得到的顶点display 的type不是Stage,也就是说不是stage元素
            //那么只能说明这个p所代表的顶端display 还没有添加到displayList中，也就是没有没添加到
            //stage舞台的childen队列中，不在引擎渲染范围内
            return false;
          }
        } 
        //一直回溯到顶层object， 即是stage， stage的parent为null
        this.stage = p;
        return p;
    },
    localToGlobal : function( point , container ){
        !point && ( point = new Point( 0 , 0 ) );
        var cm = this.getConcatenatedMatrix( container );

        if (cm == null) return Point( 0 , 0 );
        var m = new Matrix(1, 0, 0, 1, point.x , point.y);
        m.concat(cm);
        return new Point( m.tx , m.ty ); //{x:m.tx, y:m.ty};
    },
    globalToLocal : function( point , container) {
        !point && ( point = new Point( 0 , 0 ) );

        if( this.type == "stage" ){
            return point;
        }
        var cm = this.getConcatenatedMatrix( container );

        if (cm == null) return new Point( 0 , 0 ); //{x:0, y:0};
        cm.invert();
        var m = new Matrix(1, 0, 0, 1, point.x , point.y);
        m.concat(cm);
        return new Point( m.tx , m.ty ); //{x:m.tx, y:m.ty};
    },
    localToTarget : function( point , target){
        var p = localToGlobal( point );
        return target.globalToLocal( p );
    },
    getConcatenatedMatrix : function( container ){
        var cm = new Matrix();
        for (var o = this; o != null; o = o.parent) {
            cm.concat( o._transform );
            if( !o.parent || ( container && o.parent && o.parent == container ) || ( o.parent && o.parent.type=="stage" ) ) {
            //if( o.type == "stage" || (o.parent && container && o.parent.type == container.type ) ) {
                return cm;//break;
            }
        }
        return cm;
    },
    /*
     *设置元素的是否响应事件检测
     *@bool  Boolean 类型
     */
    setEventEnable : function( bool ){
        if(_.isBoolean(bool)){
            this._eventEnabled = bool;
            return true;
        }
        return false;
    },
    /*
     *查询自己在parent的队列中的位置
     */
    getIndex   : function(){
        if(!this.parent) {
          return;
        }
        return _.indexOf(this.parent.children , this)
    },
    /*
     *元素在z轴方向向下移动
     *@num 移动的层级
     */
    toBack : function( num ){
        if(!this.parent) {
          return;
        }
        var fromIndex = this.getIndex();
        var toIndex = 0;
        
        if(_.isNumber( num )){
          if( num == 0 ){
             //原地不动
             return;
          }
          toIndex = fromIndex - num;
        }
        var me = this.parent.children.splice( fromIndex , 1 )[0];
        if( toIndex < 0 ){
            toIndex = 0;
        }
        this.parent.addChildAt( me , toIndex );
    },
    /*
     *元素在z轴方向向上移动
     *@num 移动的层数量 默认到顶端
     */
    toFront : function( num ){
        if(!this.parent) {
          return;
        }
        var fromIndex = this.getIndex();
        var pcl = this.parent.children.length;
        var toIndex = pcl;
        
        if(_.isNumber( num )){
          if( num == 0 ){
             //原地不动
             return;
          }
          toIndex = fromIndex + num + 1;
        }
        var me = this.parent.children.splice( fromIndex , 1 )[0];
        if(toIndex > pcl){
            toIndex = pcl;
        }
        this.parent.addChildAt( me , toIndex-1 );
    },
    _transformHander : function( ctx ){
        var transForm = this._transform;
        if( !transForm ) {
            transForm = this._updateTransform();
        }
        //运用矩阵开始变形
        ctx.transform.apply( ctx , transForm.toArray() );
        //ctx.globalAlpha *= this.context.globalAlpha;
    },
    _updateTransform : function() {
        var _transform = new Matrix();
        _transform.identity();
        var ctx = this.context;
        //是否需要Transform
        if(ctx.scaleX !== 1 || ctx.scaleY !==1 ){
            //如果有缩放
            //缩放的原点坐标
            var origin = new Point(ctx.scaleOrigin);
            if( origin.x || origin.y ){
                _transform.translate( -origin.x , -origin.y );
            }
            _transform.scale( ctx.scaleX , ctx.scaleY );
            if( origin.x || origin.y ){
                _transform.translate( origin.x , origin.y );
            }
        }

        var rotation = ctx.rotation;
        if( rotation ){
            //如果有旋转
            //旋转的原点坐标
            var origin = new Point(ctx.rotateOrigin);
            if( origin.x || origin.y ){
                _transform.translate( -origin.x , -origin.y );
            }
            _transform.rotate( rotation % 360 * Math.PI/180 );
            if( origin.x || origin.y ){
                _transform.translate( origin.x , origin.y );
            }
        }

        //如果有位移
        var x,y;
        if( this.xyToInt && !this.moveing ){
            //当这个元素在做轨迹运动的时候，比如drag，animation如果实时的调整这个x ， y
            //那么该元素的轨迹会有跳跃的情况发生。所以加个条件过滤，
            var x = parseInt( ctx.x );//Math.round(ctx.x);
            var y = parseInt( ctx.y );//Math.round(ctx.y);

            if( parseInt(ctx.lineWidth , 10) % 2 == 1 && ctx.strokeStyle ){
                x += 0.5;
                y += 0.5;
            }
        } else {
            x = ctx.x;
            y = ctx.y;
        }

        if( x != 0 || y != 0 ){
            _transform.translate( x , y );
        }
        this._transform = _transform;
        //console.log(this.id+":tx_"+_transform.tx+":cx_"+this.context.x);

        return _transform;
    },
    //显示对象的选取检测处理函数
    getChildInPoint : function( point ){
        var result; //检测的结果

        //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
        if( this.type != "stage" && this.parent && this.parent.type != "stage" ) {
            point = this.parent.globalToLocal( point );
        }

        var x = point.x;
        var y = point.y;

        //这个时候如果有对context的set，告诉引擎不需要watch，因为这个是引擎触发的，不是用户
        //用户set context 才需要触发watch
        this._notWatch = true;
    
        //对鼠标的坐标也做相同的变换
        if( this._transform ){
            var inverseMatrix = this._transform.clone().invert();
            var originPos = [x, y];
            originPos = inverseMatrix.mulVector( originPos );

            x = originPos[0];
            y = originPos[1];
        }

        var _rect = this._rect = this.getRect(this.context);

        if(!_rect){
            return false;
        }
        if( !this.context.width && !!_rect.width ){
            this.context.width = _rect.width;
        }
        if( !this.context.height && !!_rect.height ){
            this.context.height = _rect.height;
        }
        if(!_rect.width || !_rect.height) {
            return false;
        }
        //正式开始第一步的矩形范围判断
        if ( x    >= _rect.x
            &&  x <= (_rect.x + _rect.width)
            &&  y >= _rect.y
            &&  y <= (_rect.y + _rect.height)
        ) {
           //那么就在这个元素的矩形范围内
           result = HitTestPoint.isInside( this , {
               x : x,
               y : y
           } );
        } else {
           //如果连矩形内都不是，那么肯定的，这个不是我们要找的shap
           result = false;
        }
        this._notWatch = false;
        return result;
    },
    /*
    * animate
    * @param toContent 要动画变形到的属性集合
    * @param options tween 动画参数
    */
    animate : function( toContent , options ){
        var to = toContent;
        var from = {};
        for( var p in to ){
            from[ p ] = this.context[p];
        }
        !options && (options = {});
        options.from = from;
        options.to = to;

        var self = this;
        var upFun = function(){};
        if( options.onUpdate ){
            upFun = options.onUpdate;
        }
        var tween;
        options.onUpdate = function(){
            //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
            if (!self.context && tween) {
                AnimationFrame.destroyTween(tween);
                tween = null;
                return;
            }
            for( var p in this ){
                self.context[p] = this[p];
            }
            upFun.apply(self , [this]);
        };
        var compFun = function(){};
        if( options.onComplete ){
            compFun = options.onComplete;
        }
        options.onComplete = function( opt ){
            compFun.apply(self , arguments);
        };
        tween = AnimationFrame.registTween( options );
        return tween;
    },
    _render : function( ctx ){	
        if( !this.context.visible || this.context.globalAlpha <= 0 ){
            return;
        }
        ctx.save();
        this._transformHander( ctx );

        //文本有自己的设置样式方式
        if( this.type != "text" ) {
            Base.setContextStyle( ctx , this.context.$model );
        }

        this.render( ctx );
        ctx.restore();
    },
    render : function( ctx ) {
        //基类不提供render的具体实现，由后续具体的派生类各自实现
    },
    //从树中删除
    remove : function(){
        if( this.parent ){
            this.parent.removeChild(this);
            this.parent = null;
        }
    },
    //元素的自我销毁
    destroy : function(){
        this.remove();
        this.fire("destroy");
        //把自己从父节点中删除了后做自我清除，释放内存
        this.context = null;
        delete this.context;
    }
} );

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3的DisplayList 中的容器类
 */
var DisplayObjectContainer = function(opt){
   var self = this;
   self.children = [];
   self.mouseChildren = [];
   DisplayObjectContainer.superclass.constructor.apply(this, arguments);

   //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
   //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
   //DisplayObjectContainer的 setEventEnable() 方法
   self._eventEnabled = true;
};

Base.creatClass( DisplayObjectContainer , DisplayObject , {
    addChild : function(child){
        if( !child ) {
            return;
        }
        if(this.getChildIndex(child) != -1) {
            child.parent = this;
            return child;
        }
        //如果他在别的子元素中，那么就从别人那里删除了
        if(child.parent) {
            child.parent.removeChild(child);
        }
        this.children.push( child );
        child.parent = this;
        if(this.heartBeat){
           this.heartBeat({
             convertType : "children",
             target      : child,
             src         : this
           });
        }

        if(this._afterAddChild){
           this._afterAddChild(child);
        }

        return child;
    },
    addChildAt : function(child, index) {
        if(this.getChildIndex(child) != -1) {
            child.parent = this;
            return child;
        }
        if(child.parent) {
            child.parent.removeChild(child);
        }
        this.children.splice(index, 0, child);
        child.parent = this;
        
        //上报children心跳
        if(this.heartBeat){
           this.heartBeat({
             convertType : "children",
             target       : child,
             src      : this
           });
        }
        
        if(this._afterAddChild){
           this._afterAddChild(child,index);
        }

        return child;
    },
    removeChild : function(child) {
        return this.removeChildAt(_.indexOf( this.children , child ));
    },
    removeChildAt : function(index) {
        if (index < 0 || index > this.children.length - 1) {
            return false;
        }
        var child = this.children[index];
        if (child != null) {
            child.parent = null;
        }
        this.children.splice(index, 1);
        
        if(this.heartBeat){
           this.heartBeat({
             convertType : "children",
             target       : child,
             src      : this
           });
        }
        
        if(this._afterDelChild){
           this._afterDelChild(child , index);
        }

        return child;
    },
    removeChildById : function( id ) {	
        for(var i = 0, len = this.children.length; i < len; i++) {
            if(this.children[i].id == id) {
                return this.removeChildAt(i);
            }
        }
        return false;
    },
    removeAllChildren : function() {
        while(this.children.length > 0) {
            this.removeChildAt(0);
        }
    },
    //集合类的自我销毁
    destroy : function(){
        if( this.parent ){
            this.parent.removeChild(this);
            this.parent = null;
        }
        this.fire("destroy");
        //依次销毁所有子元素
        for (var i=0,l=this.children.length ; i<l ; i++){
            this.getChildAt(i).destroy();
            i--;
            l--;
        }
    },
    /*
     *@id 元素的id
     *@boolen 是否深度查询，默认就在第一层子元素中查询
     **/
    getChildById : function(id , boolen){
        if(!boolen) {
            for(var i = 0, len = this.children.length; i < len; i++){
                if(this.children[i].id == id) {
                    return this.children[i];
                }
            }
        } else {
            //深度查询
            //TODO:暂时未实现
            return null
        }
        return null;
    },
    getChildAt : function(index) {
        if (index < 0 || index > this.children.length - 1) return null;
        return this.children[index];
    },
    getChildIndex : function(child) {
        return _.indexOf( this.children , child );
    },
    setChildIndex : function(child, index){
        if(child.parent != this) return;
        var oldIndex = _.indexOf( this.children , child );
        if(index == oldIndex) return;
        this.children.splice(oldIndex, 1);
        this.children.splice(index, 0, child);
    },
    getNumChildren : function() {
        return this.children.length;
    },
    //获取x,y点上的所有object  num 需要返回的obj数量
    getObjectsUnderPoint : function( point , num) {
        var result = [];
        
        for(var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];

            if( child == null ||
                (!child._eventEnabled && !child.dragEnabled) || 
                !child.context.visible 
            ) {
                continue;
            }
            if( child instanceof DisplayObjectContainer ) {
                //是集合
                if (child.mouseChildren && child.getNumChildren() > 0){
                   var objs = child.getObjectsUnderPoint( point );
                   if (objs.length > 0){
                      result = result.concat( objs );
                   }
                }		
            } else {
                //非集合，可以开始做getChildInPoint了
                if (child.getChildInPoint( point )) {
                    result.push(child);
                    if (num != undefined && !isNaN(num)){
                       if(result.length == num){
                          return result;
                       }
                    }
                }
            }
        }
        return result;
    },
    render : function( ctx ) {
        for(var i = 0, len = this.children.length; i < len; i++) {
            this.children[i]._render( ctx );
        }
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * stage 类， 再as3中，stage则代表整个舞台。是唯一的根节点
 * 但是再canvax中，因为分层设计的需要。stage 舞台 同样代表一个canvas元素，但是不是再整个引擎设计
 * 里面， 不是唯一的根节点。而是会交由canvax类来统一管理其层级
 */
var Stage = function( ){
    var self = this;
    self.type = "stage";
    self.context2D = null;
    //stage正在渲染中
    self.stageRending = false;
    self._isReady = false;
    Stage.superclass.constructor.apply(this, arguments);
};
Base.creatClass( Stage , DisplayObjectContainer , {
    init : function(){},
    //由canvax的afterAddChild 回调
    initStage : function( context2D , width , height ){
       var self = this;
       self.context2D = context2D;
       self.context.width  = width;
       self.context.height = height;
       self.context.scaleX = Base._devicePixelRatio;
       self.context.scaleY = Base._devicePixelRatio;
       self._isReady = true;
    },
    render : function( context ){
        this.stageRending = true;
        //TODO：
        //clear 看似 很合理，但是其实在无状态的cavnas绘图中，其实没必要执行一步多余的clear操作
        //反而增加无谓的开销，如果后续要做脏矩阵判断的话。在说
        this.clear();
        Stage.superclass.render.call( this, context );
        this.stageRending = false;
    },
    heartBeat : function( opt ){
        //shape , name , value , preValue 
        //displayList中某个属性改变了
        if (!this._isReady) {
           //在stage还没初始化完毕的情况下，无需做任何处理
           return;
        }
        opt || ( opt = {} ); //如果opt为空，说明就是无条件刷新
        opt.stage   = this;

        //TODO临时先这么处理
        this.parent && this.parent.heartBeat(opt);
    },
    clear : function(x, y, width, height) {
        if(arguments.length >= 4) {
            this.context2D.clearRect(x, y, width, height);
        } else {
            this.context2D.clearRect( 0, 0, this.parent.width , this.parent.height );
        }
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的sprite类，目前还只是个简单的容易。
 */
var Sprite = function(){
    this.type = "sprite";
    Sprite.superclass.constructor.apply(this, arguments);
};

Base.creatClass(Sprite , DisplayObjectContainer , {
    init : function(){
    
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
var Shape = function(opt){
    
    var self = this;
    //元素是否有hover事件 和 chick事件，由addEvenetLister和remiveEventLister来触发修改
    self._hoverable  = false;
    self._clickable  = false;

    //over的时候如果有修改样式，就为true
    self._hoverClass = false;
    self.hoverClone  = true;    //是否开启在hover的时候clone一份到active stage 中 
    self.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

    //拖拽drag的时候显示在activShape的副本
    self._dragDuplicate = null;

    //元素是否 开启 drag 拖动，这个有用户设置传入
    //self.draggable = opt.draggable || false;

    self.type = self.type || "shape" ;
    opt.draw && (self.draw=opt.draw);
    
    //处理所有的图形一些共有的属性配置
    self.initCompProperty(opt);

    Shape.superclass.constructor.apply(this , arguments);
    self._rect = null;
};

Base.creatClass(Shape , DisplayObject , {
   init : function(){
   },
   initCompProperty : function( opt ){
       for( var i in opt ){
           if( i != "id" && i != "context"){
               this[i] = opt[i];
           }
       }
   },
   /*
    *下面两个方法为提供给 具体的 图形类覆盖实现，本shape类不提供具体实现
    *draw() 绘制   and   setRect()获取该类的矩形边界
   */
   draw:function(){
   
   },
   drawEnd : function(ctx){
       if(this._hasFillAndStroke){
           //如果在子shape类里面已经实现stroke fill 等操作， 就不需要统一的d
           return;
       }

       //style 要从diaplayObject的 context上面去取
       var style = this.context;
 
       //fill stroke 之前， 就应该要closepath 否则线条转角口会有缺口。
       //drawTypeOnly 由继承shape的具体绘制类提供
       if ( this._drawTypeOnly != "stroke" && this.type != "path"){
           ctx.closePath();
       }

       if ( style.strokeStyle && style.lineWidth ){
           ctx.stroke();
       }
       //比如贝塞尔曲线画的线,drawTypeOnly==stroke，是不能使用fill的，后果很严重
       if (style.fillStyle && this._drawTypeOnly!="stroke"){
           ctx.fill();
       }
       
   },


   render : function(){
      var ctx  = this.getStage().context2D;
      
      if (this.context.type == "shape"){
          //type == shape的时候，自定义绘画
          //这个时候就可以使用self.graphics绘图接口了，该接口模拟的是as3的接口
          this.draw.apply( this );
      } else {
          //这个时候，说明该shape是调用已经绘制好的 shape 模块，这些模块全部在../shape目录下面
          if( this.draw ){
              ctx.beginPath();
              this.draw( ctx , this.context );
              this.drawEnd( ctx );
          }
      }
   }
   ,
   /*
    * 画虚线
    */
   dashedLineTo:function(ctx, x1, y1, x2, y2, dashLength) {
         dashLength = typeof dashLength == 'undefined'
                      ? 3 : dashLength;
         dashLength = Math.max( dashLength , this.context.lineWidth );
         var deltaX = x2 - x1;
         var deltaY = y2 - y1;
         var numDashes = Math.floor(
             Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength
         );
         for (var i = 0; i < numDashes; ++i) {
             var x = parseInt(x1 + (deltaX / numDashes) * i);
             var y = parseInt(y1 + (deltaY / numDashes) * i);
             ctx[i % 2 === 0 ? 'moveTo' : 'lineTo']( x , y );
             if( i == (numDashes-1) && i%2 === 0){
                 ctx.lineTo( x2 , y2 );
             }
         }
   },
   /*
    *从cpl节点中获取到4个方向的边界节点
    *@param  context 
    *
    **/
   getRectFormPointList : function( context ){
       var minX =  Number.MAX_VALUE;
       var maxX =  Number.MIN_VALUE;
       var minY =  Number.MAX_VALUE;
       var maxY =  Number.MIN_VALUE;

       var cpl = context.pointList; //this.getcpl();
       for(var i = 0, l = cpl.length; i < l; i++) {
           if (cpl[i][0] < minX) {
               minX = cpl[i][0];
           }
           if (cpl[i][0] > maxX) {
               maxX = cpl[i][0];
           }
           if (cpl[i][1] < minY) {
               minY = cpl[i][1];
           }
           if (cpl[i][1] > maxY) {
               maxY = cpl[i][1];
           }
       }

       var lineWidth;
       if (context.strokeStyle || context.fillStyle  ) {
           lineWidth = context.lineWidth || 1;
       } else {
           lineWidth = 0;
       }
       return {
           x      : Math.round(minX - lineWidth / 2),
           y      : Math.round(minY - lineWidth / 2),
           width  : maxX - minX + lineWidth,
           height : maxY - minY + lineWidth
       };
   }
});

/**
 * Canvax--Text
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 文本 类
 **/
var Text = function(text, opt) {
    var self = this;
    self.type = "text";
    self._reNewline = /\r?\n/;
    self.fontProperts = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"];

    //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
    opt = Base.checkOpt(opt);

    self._context = _.extend({
        fontSize: 13, //字体大小默认13
        fontWeight: "normal",
        fontFamily: "微软雅黑",
        textDecoration: null,
        fillStyle: 'blank',
        strokeStyle: null,
        lineWidth: 0,
        lineHeight: 1.2,
        backgroundColor: null,
        textBackgroundColor: null
    }, opt.context);

    self._context.font = self._getFontDeclaration();

    self.text = text.toString();

    Text.superclass.constructor.apply(this, [opt]);

};

Base.creatClass(Text, DisplayObject, {
    $watch: function(name, value, preValue) {
        //context属性有变化的监听函数
        if (_.indexOf(this.fontProperts, name) >= 0) {
            this._context[name] = value;
            //如果修改的是font的某个内容，就重新组装一遍font的值，
            //然后通知引擎这次对context的修改不需要上报心跳
            this._notWatch = false;
            this.context.font = this._getFontDeclaration();
            this.context.width = this.getTextWidth();
            this.context.height = this.getTextHeight();
        }
    },
    init: function(text, opt) {
        var self = this;
        var c = this.context;
        c.width = this.getTextWidth();
        c.height = this.getTextHeight();
    },
    render: function(ctx) {
        for (var p in this.context.$model) {
            if (p in ctx) {
                if (p != "textBaseline" && this.context.$model[p]) {
                    ctx[p] = this.context.$model[p];
                }
            }
        }
        this._renderText(ctx, this._getTextLines());
    },
    resetText: function(text) {
        this.text = text.toString();
        this.heartBeat();
    },
    getTextWidth: function() {
        var width = 0;
        Base._pixelCtx.save();
        Base._pixelCtx.font = this.context.font;
        width = this._getTextWidth(Base._pixelCtx, this._getTextLines());
        Base._pixelCtx.restore();
        return width;
    },
    getTextHeight: function() {
        return this._getTextHeight(Base._pixelCtx, this._getTextLines());
    },
    _getTextLines: function() {
        return this.text.split(this._reNewline);
    },
    _renderText: function(ctx, textLines) {
        ctx.save();
        this._renderTextStroke(ctx, textLines);
        this._renderTextFill(ctx, textLines);
        ctx.restore();
    },
    _getFontDeclaration: function() {
        var self = this;
        var fontArr = [];

        _.each(this.fontProperts, function(p) {
            var fontP = self._context[p];
            if (p == "fontSize") {
                fontP = parseFloat(fontP) + "px";
            }
            fontP && fontArr.push(fontP);
        });

        return fontArr.join(' ');

    },
    _renderTextFill: function(ctx, textLines) {
        if (!this.context.fillStyle) return;

        this._boundaries = [];
        var lineHeights = 0;
        
        for (var i = 0, len = textLines.length; i < len; i++) {
            var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
            lineHeights += heightOfLine;

            this._renderTextLine(
                'fillText',
                ctx,
                textLines[i],
                0, //this._getLeftOffset(),
                this._getTopOffset() + lineHeights,
                i
            );
        }
    },
    _renderTextStroke: function(ctx, textLines) {
        if (!this.context.strokeStyle || !this.context.lineWidth) return;

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

            this._renderTextLine(
                'strokeText',
                ctx,
                textLines[i],
                0, //this._getLeftOffset(),
                this._getTopOffset() + lineHeights,
                i
            );
        }
        ctx.closePath();
        ctx.restore();
    },
    _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
        top -= this._getHeightOfLine() / 4;
        if (this.context.textAlign !== 'justify') {
            this._renderChars(method, ctx, line, left, top, lineIndex);
            return;
        }
        var lineWidth = ctx.measureText(line).width;
        var totalWidth = this.context.width;

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
    },
    _renderChars: function(method, ctx, chars, left, top) {
        ctx[method](chars, 0, top);
    },
    _getHeightOfLine: function() {
        return this.context.fontSize * this.context.lineHeight;
    },
    _getTextWidth: function(ctx, textLines) {
        var maxWidth = ctx.measureText(textLines[0] || '|').width;
        for (var i = 1, len = textLines.length; i < len; i++) {
            var currentLineWidth = ctx.measureText(textLines[i]).width;
            if (currentLineWidth > maxWidth) {
                maxWidth = currentLineWidth;
            }
        }
        return maxWidth;
    },
    _getTextHeight: function(ctx, textLines) {
        return this.context.fontSize * textLines.length * this.context.lineHeight;
    },

    /**
     * @private
     * @return {Number} Top offset
     */
    _getTopOffset: function() {
        var t = 0;
        switch (this.context.textBaseline) {
            case "top":
                t = 0;
                break;
            case "middle":
                t = -this.context.height / 2;
                break;
            case "bottom":
                t = -this.context.height;
                break;
        }
        return t;
    },
    getRect: function() {
        var c = this.context;
        var x = 0;
        var y = 0;
        //更具textAlign 和 textBaseline 重新矫正 xy
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
        }
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的Bitmap类，目前还只是个简单的容易。
 */
var Bitmap = function(opt){
    var self = this;
    self.type = "bitmap";

    //TODO:这里不负责做img 的加载，所以这里的img是必须已经准备好了的img元素
    //如果img没准备好，会出现意想不到的错误，我不给你负责
    self.img  = opt.img || null; //bitmap的图片来源，可以是页面上面的img 也可以是某个canvas

    opt = Base.checkOpt( opt );
    self._context = {
        dx     : opt.context.dx, //图片切片的x位置
        dy     : opt.context.dy, //图片切片的y位置
        dWidth : opt.context.dWidth || 0, //切片的width
        dHeight: opt.context.dHeight|| 0  //切片的height
    };

    Bitmap.superclass.constructor.apply(this, arguments);

};

Base.creatClass( Bitmap , Shape , {
    draw : function(ctx, style) {
        if (!this.img) {
            //img都没有画个毛
            return;
        }
        var image = this.img;
        if(!style.width || !style.height ){
            ctx.drawImage(image, 0, 0);
        } else {
            if( style.dx == undefined || style.dy == undefined  ){
               ctx.drawImage(image, 0, 0, style.width, style.height);
            } else {
               !style.dWidth  && ( style.dWidth  = style.width  );
               !style.dHeight && ( style.dHeight = style.height );
               ctx.drawImage(image , style.dx , style.dy , style.dWidth , style.dHeight , 0 , 0 , style.width, style.height );
            }
        }
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的Movieclip类，目前还只是个简单的容易。
 */
var Movieclip = function( opt ){

    var self = this;
    opt = Base.checkOpt( opt );
    self.type = "movieclip";
    self.currentFrame  = 0;
    self.autoPlay      = opt.autoPlay   || false;//是否自动播放
    self.repeat        = opt.repeat     || 0;//是否循环播放,repeat为数字，则表示循环多少次，为true or !运算结果为true 的话表示永久循环

    self.overPlay      = opt.overPlay   || false; //是否覆盖播放，为false只播放currentFrame 当前帧,true则会播放当前帧 和 当前帧之前的所有叠加

    self._frameRate    = Base.mainFrameRate;
    self._speedTime    = parseInt(1000/self._frameRate);
    self._preRenderTime= 0;

    self._context = {
        //r : opt.context.r || 0   //{number},  // 必须，圆半径
    };
    Movieclip.superclass.constructor.apply(this, [ opt ] );
};

Base.creatClass(Movieclip , DisplayObjectContainer , {
    init : function(){
       
    },
    getStatus    : function(){
        //查询Movieclip的autoPlay状态
        return this.autoPlay;
    },
    getFrameRate : function(){
        return this._frameRate;
    },
    setFrameRate : function(frameRate) {
        
        var self = this;
        if(self._frameRate  == frameRate) {
            return;
        }
        self._frameRate  = frameRate;

        //根据最新的帧率，来计算最新的间隔刷新时间
        self._speedTime = parseInt( 1000/self._frameRate );
    }, 
    afterAddChild:function(child , index){
       if(this.children.length==1){
          return;
       }

       if( index != undefined && index <= this.currentFrame ){
          //插入当前frame的前面 
          this.currentFrame++;
       }
    },
    afterDelChild:function(child,index){
       //记录下当前帧
       var preFrame = this.currentFrame;

       //如果干掉的是当前帧前面的帧，当前帧的索引就往上走一个
       if(index < this.currentFrame){
          this.currentFrame--;
       }

       //如果干掉了元素后当前帧已经超过了length
       if((this.currentFrame >= this.children.length) && this.children.length>0){
          this.currentFrame = this.children.length-1;
       }
    },
    _goto:function(i){
       var len = this.children.length;
       if(i>= len){
          i = i%len;
       }
       if(i<0){
          i = this.children.length-1-Math.abs(i)%len;
       }
       this.currentFrame = i;
    },
    gotoAndStop:function(i){
       this._goto(i);
       if(!this.autoPlay){
         //再stop的状态下面跳帧，就要告诉stage去发心跳
         this._preRenderTime = 0;
         this.getStage().heartBeat();
         return;
       }
       this.autoPlay = false;
    },
    stop:function(){
       if(!this.autoPlay){
         return;
       }
       this.autoPlay = false;
    },
    gotoAndPlay:function(i){
       this._goto(i);
       this.play();
    },
    play:function(){
       if(this.autoPlay){
         return;
       }
       this.autoPlay = true;
       var canvax = this.getStage().parent;
       if(!canvax._heartBeat && canvax._taskList.length==0){
           //手动启动引擎
           canvax.__startEnter();
       }
       this._push2TaskList();
       
       this._preRenderTime = new Date().getTime();
    },
    _push2TaskList : function(){
       //把enterFrame push 到 引擎的任务列表
       if(!this._enterInCanvax){
         this.getStage().parent._taskList.push( this );
         this._enterInCanvax=true;
       }
    },
    //autoPlay为true 而且已经把__enterFrame push 到了引擎的任务队列，
    //则为true
    _enterInCanvax:false, 
    __enterFrame:function(){
       var self = this;
       if((Base.now-self._preRenderTime) >= self._speedTime ){
           //大于_speedTime，才算完成了一帧
           //上报心跳 无条件心跳吧。
           //后续可以加上对应的 Movieclip 跳帧 心跳
           self.getStage().heartBeat();
       }

    },
    next  :function(){
       var self = this;
       if(!self.autoPlay){
           //只有再非播放状态下才有效
           self.gotoAndStop(self._next());
       }
    },
    pre   :function(){
       var self = this;
       if(!self.autoPlay){
           //只有再非播放状态下才有效
           self.gotoAndStop(self._pre());
       }
    },
    _next : function(){
       var self = this;
       if(this.currentFrame >= this.children.length-1){
           this.currentFrame = 0;
       } else {
           this.currentFrame++;
       }
       return this.currentFrame;
    },

    _pre : function(){
       var self = this;
       if(this.currentFrame == 0){
           this.currentFrame = this.children.length-1;
       } else {
           this.currentFrame--;
       }
       return this.currentFrame;
    },
    render:function(ctx){
        //这里也还要做次过滤，如果不到speedTime，就略过

        //TODO：如果是改变moviclip的x or y 等 非帧动画 属性的时候加上这个就会 有漏帧现象，先注释掉
        /* 
        if( (Base.now-this._preRenderTime) < this._speedTime ){
           return;
        }
        */

        //因为如果children为空的话，Movieclip 会把自己设置为 visible:false，不会执行到这个render
        //所以这里可以不用做children.length==0 的判断。 大胆的搞吧。

        if( !this.overPlay ){
            this.getChildAt(this.currentFrame)._render(ctx);
        } else {
            for(var i=0 ; i <= this.currentFrame ; i++){
                this.getChildAt(i)._render(ctx);
            }
        }

        if(this.children.length == 1){
            this.autoPlay = false;
        }

        //如果不循环
        if( this.currentFrame == this.getNumChildren()-1 ){
            //那么，到了最后一帧就停止
            if(!this.repeat) {
                this.stop();
                if( this.hasEvent("end") ){
                    this.fire("end");
                }
            }
            //使用掉一次循环
            if( _.isNumber( this.repeat ) && this.repeat > 0 ) {
               this.repeat -- ;
            }
        }

        if(this.autoPlay){
            //如果要播放
            if( (Base.now-this._preRenderTime) >= this._speedTime ){
                //先把当前绘制的时间点记录
                this._preRenderTime = Base.now;
                this._next();
            }
            this._push2TaskList();
        } else {
            //暂停播放
            if(this._enterInCanvax){
                //如果这个时候 已经 添加到了canvax的任务列表
                this._enterInCanvax=false;
                var tList = this.getStage().parent._taskList;
                tList.splice( _.indexOf(tList , this) , 1 ); 
            }
        }

    } 
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 向量操作类
 * */
function Vector(x, y) {
    var vx = 0,vy = 0;
    if ( arguments.length == 1 && _.isObject( x ) ){
        var arg = arguments[0];
        if( _.isArray( arg ) ){
           vx = arg[0];
           vy = arg[1];
        } else if( arg.hasOwnProperty("x") && arg.hasOwnProperty("y") ) {
           vx = arg.x;
           vy = arg.y;
        }
    }
    this._axes = [vx, vy];
}
Vector.prototype = {
    distance: function (v) {
        var x = this._axes[0] - v._axes[0];
        var y = this._axes[1] - v._axes[1];

        return Math.sqrt((x * x) + (y * y));
    }
};

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
    return (2 * (p1 - p2) + v0 + v1) * t3 
           + (- 3 * (p1 - p2) - 2 * v0 - v1) * t2
           + v0 * t + p1;
}
/**
 * 多线段平滑曲线 
 * opt ==> points , isLoop
 */
var SmoothSpline = function ( opt ) {
    var points = opt.points;
    var isLoop = opt.isLoop;
    var smoothFilter = opt.smoothFilter;

    var len = points.length;
    if( len == 1 ){
        return points;
    }
    var ret = [];
    var distance  = 0;
    var preVertor = new Vector( points[0] );
    var iVtor     = null;
    for (var i = 1; i < len; i++) {
        iVtor = new Vector(points[i]);
        distance += preVertor.distance( iVtor );
        preVertor = iVtor;
    }

    preVertor = null;
    iVtor     = null;


    //基本上等于曲率
    var segs = distance / 6;

    segs = segs < len ? len : segs;
    for (var i = 0; i < segs; i++) {
        var pos = i / (segs-1) * (isLoop ? len : len - 1);
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
            p0 = points[(idx -1 + len) % len];
            p2 = points[(idx + 1) % len];
            p3 = points[(idx + 2) % len];
        }

        var w2 = w * w;
        var w3 = w * w2;

        var rp = [
                interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
                interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
                ];

        _.isFunction(smoothFilter) && smoothFilter( rp );

        ret.push( rp );
    }
    return ret;
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 折线 类
 *
 * 对应context的属性有
 * @pointList 各个顶角坐标
 **/
var BrokenLine = function(opt , atype) {
    var self = this;
    self.type = "brokenline";
    self._drawTypeOnly = "stroke";
    opt = Base.checkOpt(opt);
    if( atype !== "clone" ){
        self._initPointList(opt.context);
    }
    self._context = _.extend({
        lineType: null,
        smooth: false,
        pointList: [], //{Array}  // 必须，各个顶角坐标
        smoothFilter: null
    }, opt.context );

    BrokenLine.superclass.constructor.apply(this, arguments);
};

Base.creatClass(BrokenLine, Shape, {
    $watch: function(name, value, preValue) {
        if (name == "pointList") {
            this._initPointList(this.context, value, preValue);
        }
    },
    _initPointList: function(context, value, preValue) {
        var myC = context;
        if (myC.smooth) {
            //smoothFilter -- 比如在折线图中。会传一个smoothFilter过来做point的纠正。
            //让y不能超过底部的原点
            var obj = {
                points: myC.pointList
            };
            if (_.isFunction(myC.smoothFilter)) {
                obj.smoothFilter = myC.smoothFilter;
            }
            this._notWatch = true; //本次转换不出发心跳
            var currL = SmoothSpline(obj);

            if (value && value.length>0) {
                currL[currL.length - 1][0] = value[value.length - 1][0];
            }
            myC.pointList = currL;
            this._notWatch = false;
        }
    },
    //polygon需要覆盖draw方法，所以要把具体的绘制代码作为_draw抽离出来
    draw: function(ctx, context) {
        this._draw(ctx, context);
    },
    _draw: function(ctx, context) {
        var pointList = context.pointList;
        if (pointList.length < 2) {
            // 少于2个点就不画了~
            return;
        }
        if (!context.lineType || context.lineType == 'solid') {
            //默认为实线
            //TODO:目前如果 有设置smooth 的情况下是不支持虚线的
            ctx.moveTo(pointList[0][0], pointList[0][1]);
            for (var i = 1, l = pointList.length; i < l; i++) {
                ctx.lineTo(pointList[i][0], pointList[i][1]);
            }
        } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
            if (context.smooth) {
                for (var si = 0, sl = pointList.length; si < sl; si++) {
                    if (si == sl-1) {
                        break;
                    }
                    ctx.moveTo( pointList[si][0] , pointList[si][1] );
                    ctx.lineTo( pointList[si+1][0] , pointList[si+1][1] );
                    si+=1;
                }
            } else {
                //画虚线的方法  
                ctx.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 1, l = pointList.length; i < l; i++) {
                    var fromX = pointList[i - 1][0];
                    var toX = pointList[i][0];
                    var fromY = pointList[i - 1][1];
                    var toY = pointList[i][1];
                    this.dashedLineTo(ctx, fromX, fromY, toX, toY, 5);
                }
            }
        }
        return;
    },
    getRect: function(context) {
        var context = context ? context : this.context;
        return this.getRectFormPointList(context);
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 圆形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r 圆半径
 **/
var Circle = function(opt) {
    var self = this;
    self.type = "circle";

    opt = Base.checkOpt( opt );

    //默认情况下面，circle不需要把xy进行parentInt转换
    ( "xyToInt" in opt ) || ( opt.xyToInt = false );

    self._context = {
        r : opt.context.r || 0   //{number},  // 必须，圆半径
    };
    Circle.superclass.constructor.apply(this, arguments);
};

Base.creatClass(Circle , Shape , {
   /**
     * 创建圆形路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    draw : function(ctx, style) {
        if (!style) {
          return;
        }
        ctx.arc(0 , 0, style.r, 0, Math.PI * 2, true);
    },

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * @param {Object} style
     */
    getRect : function(style) {
        var lineWidth;
        var style = style ? style : this.context;
        if (style.fillStyle || style.strokeStyle ) {
            lineWidth = style.lineWidth || 1;
        } else {
            lineWidth = 0;
        }
        return {
            x : Math.round(0 - style.r - lineWidth / 2),
            y : Math.round(0 - style.r - lineWidth / 2),
            width : style.r * 2 + lineWidth,
            height : style.r * 2 + lineWidth
        };
    }
});

var Bezier = {
    /**
     * @param  {number} -- t {0, 1}
     * @return {Point}  -- return point at the given time in the bezier arc
     */
    getPointByTime: function(t , plist) {
        var it = 1 - t,
        it2 = it * it,
        it3 = it2 * it;
        var t2 = t * t,
        t3 = t2 * t;
        var xStart=plist[0],yStart=plist[1],cpX1=plist[2],cpY1=plist[3],cpX2=0,cpY2=0,xEnd=0,yEnd=0;
        if(plist.length>6){
            cpX2=plist[4];
            cpY2=plist[5];
            xEnd=plist[6];
            yEnd=plist[7];
            //三次贝塞尔
            return { 
                x : it3 * xStart + 3 * it2 * t * cpX1 + 3 * it * t2 * cpX2 + t3 * xEnd,
                y : it3 * yStart + 3 * it2 * t * cpY1 + 3 * it * t2 * cpY2 + t3 * yEnd
            }
        } else {
            //二次贝塞尔
            xEnd=plist[4];
            yEnd=plist[5];
            return {
                x : it2 * xStart + 2 * t * it * cpX1 + t2*xEnd,
                y : it2 * yStart + 2 * t * it * cpY1 + t2*yEnd
            }
        }
    }
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * Path 类
 *
 * 对应context的属性有
 * @path path串
 **/
var Path = function(opt) {
    var self = this;
    self.type = "path";
    opt = Base.checkOpt(opt);
    if ("drawTypeOnly" in opt) {
        self.drawTypeOnly = opt.drawTypeOnly;
    }
    self.__parsePathData = null;
    var _context = {
        pointList: [], //从下面的path中计算得到的边界点的集合
        path: opt.context.path || "" //字符串 必须，路径。例如:M 0 0 L 0 10 L 10 10 Z (一个三角形)
            //M = moveto
            //L = lineto
            //H = horizontal lineto
            //V = vertical lineto
            //C = curveto
            //S = smooth curveto
            //Q = quadratic Belzier curve
            //T = smooth quadratic Belzier curveto
            //Z = closepath
    };
    self._context = _.extend(_context, (self._context || {}));
    Path.superclass.constructor.apply(self, arguments);
};

Base.creatClass(Path, Shape, {
    $watch: function(name, value, preValue) {
        if (name == "path") { //如果path有变动，需要自动计算新的pointList
            this.__parsePathData = null;
            this.context.pointList = [];
        }
    },
    _parsePathData: function(data) {
        if (this.__parsePathData) {
            return this.__parsePathData;
        }
        if (!data) {
            return [];
        }
        //分拆子分组
        this.__parsePathData = [];
        var paths = _.compact(data.replace(/[Mm]/g, "\\r$&").split('\\r'));
        var me = this;
        _.each(paths, function(pathStr) {
            me.__parsePathData.push(me._parseChildPathData(pathStr));
        });
        return this.__parsePathData;
    },
    _parseChildPathData: function(data) {
        // command string
        var cs = data;
        // command chars
        var cc = [
            'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
            'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
        ];
        cs = cs.replace(/  /g, ' ');
        cs = cs.replace(/ /g, ',');
        //cs = cs.replace(/(.)-/g, "$1,-");
        cs = cs.replace(/(\d)-/g, '$1,-');
        cs = cs.replace(/,,/g, ',');
        var n;
        // create pipes so that we can split the data
        for (n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // create array
        var arr = cs.split('|');
        var ca = [];
        // init context point
        var cpx = 0;
        var cpy = 0;
        for (n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            str = str.replace(new RegExp('e,-', 'g'), 'e-');

            //有的时候，比如“22，-22” 数据可能会经常的被写成22-22，那么需要手动修改
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
                var y1 = cpy;

                // convert l, H, h, V, and v to L
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
                        points.push(
                            cpx + p.shift(), cpy + p.shift(),
                            cpx + p.shift(), cpy + p.shift()
                        );
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
                        points.push(
                            ctlPtx, ctlPty,
                            cpx + p.shift(), cpy + p.shift()
                        );
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
                        points = this._convertPoint(
                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                        );
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
                        points = this._convertPoint(
                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                        );
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
    },

    /*
     * @param x1 原点x
     * @param y1 原点y
     * @param x2 终点坐标 x
     * @param y2 终点坐标 y
     * @param fa 角度大小
     * @param fs 时针方向
     * @param rx x半径
     * @param ry y半径
     * @param psiDeg 旋转角度
     */
    _convertPoint: function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {

        var psi = psiDeg * (Math.PI / 180.0);
        var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

        if (fa === fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

        var vMag = function(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function(u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function(u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);

        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    },
    /*
     * 获取bezier上面的点列表
     * */
    _getBezierPoints: function(p) {
        var steps = Math.abs(Math.sqrt(Math.pow(p.slice(-1)[0] - p[1], 2) + Math.pow(p.slice(-2, -1)[0] - p[0], 2)));
        steps = Math.ceil(steps / 5);
        var parr = [];
        for (var i = 0; i <= steps; i++) {
            var t = i / steps;
            var tp = Bezier.getPointByTime(t, p);
            parr.push(tp.x);
            parr.push(tp.y);
        }
        return parr;
    },
    /*
     * 如果path中有A a ，要导出对应的points
     */
    _getArcPoints: function(p) {

        var cx = p[0];
        var cy = p[1];
        var rx = p[2];
        var ry = p[3];
        var theta = p[4];
        var dTheta = p[5];
        var psi = p[6];
        var fs = p[7];
        var r = (rx > ry) ? rx : ry;
        var scaleX = (rx > ry) ? 1 : rx / ry;
        var scaleY = (rx > ry) ? ry / rx : 1;

        var _transform = new Matrix();
        _transform.identity();
        _transform.scale(scaleX, scaleY);
        _transform.rotate(psi);
        _transform.translate(cx, cy);

        var cps = [];
        var steps = (360 - (!fs ? 1 : -1) * dTheta * 180 / Math.PI) % 360;

        steps = Math.ceil(Math.min(Math.abs(dTheta) * 180 / Math.PI, r * Math.abs(dTheta) / 8)); //间隔一个像素 所以 /2

        for (var i = 0; i <= steps; i++) {
            var point = [Math.cos(theta + dTheta / steps * i) * r, Math.sin(theta + dTheta / steps * i) * r];
            point = _transform.mulVector(point);
            cps.push(point[0]);
            cps.push(point[1]);
        }
        return cps;
    },

    draw: function(ctx, style) {
        this._draw(ctx, style);
    },
    /**
     *  ctx Canvas 2D上下文
     *  style 样式
     */
    _draw: function(ctx, style) {
        var path = style.path;
        var pathArray = this._parsePathData(path);
        this._setPointList(pathArray, style);
        for (var g = 0, gl = pathArray.length; g < gl; g++) {
            for (var i = 0, l = pathArray[g].length; i < l; i++) {
                var c = pathArray[g][i].command, p = pathArray[g][i].points;
                switch (c) {
                    case 'L':
                        ctx.lineTo(p[0], p[1]);
                        break;
                    case 'M':
                        ctx.moveTo(p[0], p[1]);
                        break;
                    case 'C':
                        ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                        break;
                    case 'A':
                        var cx = p[0];
                        var cy = p[1];
                        var rx = p[2];
                        var ry = p[3];
                        var theta = p[4];
                        var dTheta = p[5];
                        var psi = p[6];
                        var fs = p[7];
                        var r = (rx > ry) ? rx : ry;
                        var scaleX = (rx > ry) ? 1 : rx / ry;
                        var scaleY = (rx > ry) ? ry / rx : 1;
                        var _transform = new Matrix();
                        _transform.identity();
                        _transform.scale(scaleX, scaleY);
                        _transform.rotate(psi);
                        _transform.translate(cx, cy);
                        //运用矩阵开始变形
                        ctx.transform.apply(ctx, _transform.toArray());
                        ctx.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                        //_transform.invert();
                        ctx.transform.apply(ctx, _transform.invert().toArray());
                        break;
                    case 'z':
                        ctx.closePath();
                        break;
                }
            }
        }
        return this;
    },
    _setPointList: function(pathArray, style) {
        if (style.pointList.length > 0) {
            return;
        }

        // 记录边界点，用于判断inside
        var pointList = style.pointList = [];
        for (var g = 0, gl = pathArray.length; g < gl; g++) {

            var singlePointList = [];

            for (var i = 0, l = pathArray[g].length; i < l; i++) {
                var p = pathArray[g][i].points;
                var cmd = pathArray[g][i].command;

                if (cmd.toUpperCase() == 'A') {
                    p = this._getArcPoints(p);
                    //A命令的话，外接矩形的检测必须转换为_points
                    pathArray[g][i]._points = p;
                }

                if (cmd.toUpperCase() == "C" || cmd.toUpperCase() == "Q") {
                    var cStart = [0, 0];
                    if (singlePointList.length > 0) {
                        cStart = singlePointList.slice(-1)[0];
                    } else if (i > 0) {
                        var prePoints = (pathArray[g][i - 1]._points || pathArray[g][i - 1].points);
                        if (prePoints.length >= 2) {
                            cStart = prePoints.slice(-2);
                        }
                    }
                    p = this._getBezierPoints(cStart.concat(p));
                    pathArray[g][i]._points = p;
                }

                for (var j = 0, k = p.length; j < k; j += 2) {
                    var px = p[j];
                    var py = p[j + 1];
                    if ((!px && px!=0) || (!py && py!=0)) {
                        continue;
                    }
                    singlePointList.push([px, py]);
                }
            }
            singlePointList.length > 0 && pointList.push(singlePointList);
        }
    },
    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * style 样式
     */
    getRect: function(style) {
        
        var lineWidth;
        var style = style ? style : this.context;
        if (style.strokeStyle || style.fillStyle) {
            lineWidth = style.lineWidth || 1;
        } else {
            lineWidth = 0;
        }

        var minX = Number.MAX_VALUE;
        var maxX = -Number.MAX_VALUE;//Number.MIN_VALUE;

        var minY = Number.MAX_VALUE;
        var maxY = -Number.MAX_VALUE;//Number.MIN_VALUE;

        // 平移坐标
        var x = 0;
        var y = 0;

        var pathArray = this._parsePathData(style.path);
        this._setPointList(pathArray, style);

        for (var g = 0, gl = pathArray.length; g < gl; g++) {
            for (var i = 0; i < pathArray[g].length; i++) {
                var p = pathArray[g][i]._points || pathArray[g][i].points;

                for (var j = 0; j < p.length; j++) {
                    if (j % 2 === 0) {
                        if (p[j] + x < minX) {
                            minX = p[j] + x;
                        }
                        if (p[j] + x > maxX) {
                            maxX = p[j] + x;
                        }
                    } else {
                        if (p[j] + y < minY) {
                            minY = p[j] + y;
                        }
                        if (p[j] + y > maxY) {
                            maxY = p[j] + y;
                        }
                    }
                }
            }
        }

        var rect;
        if (minX === Number.MAX_VALUE || maxX === Number.MIN_VALUE || minY === Number.MAX_VALUE || maxY === Number.MIN_VALUE) {
            rect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        } else {
            rect = {
                x: Math.round(minX - lineWidth / 2),
                y: Math.round(minY - lineWidth / 2),
                width: maxX - minX + lineWidth,
                height: maxY - minY + lineWidth
            };
        }
        return rect;
    }

});

/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 水滴形 类
 * 派生自Path类
 *
 * 对应context的属性有
 * @hr 水滴横宽（中心到水平边缘最宽处距离）
 * @vr 水滴纵高（中心到尖端距离）
 **/
var Droplet = function(opt){
    var self = this;
    opt = Base.checkOpt( opt );
    self._context = {
        hr : opt.context.hr || 0 , //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
        vr : opt.context.vr || 0   //{number},  // 必须，水滴纵高（中心到尖端距离）
    };
    Droplet.superclass.constructor.apply(this, arguments);
    self.type = "droplet";
};
Base.creatClass( Droplet , Path , {
    draw : function(ctx, style) {
       var ps = "M 0 "+style.hr+" C "+style.hr+" "+style.hr+" "+( style.hr*3/2 ) +" "+(-style.hr/3)+" 0 "+(-style.vr);
       ps += " C "+(-style.hr * 3/ 2)+" "+(-style.hr / 3)+" "+(-style.hr)+" "+style.hr+" 0 "+ style.hr;
       this.context.path = ps;
       this._draw(ctx , style);
    }
} );

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 椭圆形 类
 *
 * 对应context的属性有 
 *
 * @hr 椭圆横轴半径
 * @vr 椭圆纵轴半径
 */
var Ellipse = function(opt){
    var self = this;
    self.type = "ellipse";

    opt = Base.checkOpt( opt );
    self._context = {
        //x             : 0 , //{number},  // 丢弃
        //y             : 0 , //{number},  // 丢弃，原因同circle
        hr : opt.context.hr || 0 , //{number},  // 必须，椭圆横轴半径
        vr : opt.context.vr || 0   //{number},  // 必须，椭圆纵轴半径
    };

    Ellipse.superclass.constructor.apply(this, arguments);
};

Base.creatClass(Ellipse , Shape , {
    draw :  function(ctx, style) {
        var r = (style.hr > style.vr) ? style.hr : style.vr;
        var ratioX = style.hr / r; //横轴缩放比率
        var ratioY = style.vr / r;
        
        ctx.scale(ratioX, ratioY);
        ctx.arc(
            0, 0, r, 0, Math.PI * 2, true
            );
        if ( document.createElement('canvas').getContext ){
           //ie下面要想绘制个椭圆出来，就不能执行这步了
           //算是excanvas 实现上面的一个bug吧
           ctx.scale(1/ratioX, 1/ratioY);

        }
        return;
    },
    getRect : function(style){
        var lineWidth;
        var style = style ? style : this.context;
        if (style.fillStyle || style.strokeStyle) {
            lineWidth = style.lineWidth || 1;
        }
        else {
            lineWidth = 0;
        }
        return {
              x : Math.round(0 - style.hr - lineWidth / 2),
              y : Math.round(0 - style.vr - lineWidth / 2),
              width : style.hr * 2 + lineWidth,
              height : style.vr * 2 + lineWidth
        };

    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 多边形 类  （不规则）
 *
 * 对应context的属性有
 * @pointList 多边形各个顶角坐标
 **/
var Polygon = function(opt , atype) {
    var self = this;
    opt = Base.checkOpt(opt);

    if(atype !== "clone"){
        var start = opt.context.pointList[0];
        var end   = opt.context.pointList[ opt.context.pointList.length - 1 ];
        if( opt.context.smooth ){
            opt.context.pointList.unshift( end );
        } else {
            opt.context.pointList.push( start );
        }
    }
    
    Polygon.superclass.constructor.apply(this, arguments);

    if(atype !== "clone" && opt.context.smooth && end){

    }

    self._drawTypeOnly = null;
    self.type = "polygon";
};
Base.creatClass(Polygon, BrokenLine, {
    draw: function(ctx, context) {
        if (context.fillStyle) {
            if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                var pointList = context.pointList;
                //特殊处理，虚线围不成path，实线再build一次
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 1, l = pointList.length; i < l; i++) {
                    ctx.lineTo(pointList[i][0], pointList[i][1]);
                }
                ctx.closePath();
                ctx.restore();
                ctx.fill();
                this._drawTypeOnly = "stroke";
            }
        }
        //如果下面不加save restore，canvas会把下面的path和上面的path一起算作一条path。就会绘制了一条实现边框和一虚线边框。
        ctx.save();
        ctx.beginPath();
        this._draw(ctx, context);
        ctx.closePath();
        ctx.restore();
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 正n边形（n>=3）
 *
 * 对应context的属性有 
 *
 * @r 正n边形外接圆半径
 * @r 指明正几边形
 *
 * @pointList 私有，从上面的r和n计算得到的边界值的集合
 */
var Isogon = function(opt) {
    var self = this;
    opt = Base.checkOpt(opt);
    self._context = _.extend({
        pointList: [], //从下面的r和n计算得到的边界值的集合
        r: 0, //{number},  // 必须，正n边形外接圆半径
        n: 0 //{number},  // 必须，指明正几边形
    } , opt.context);
    self.setPointList(self._context);
    opt.context = self._context;
    Isogon.superclass.constructor.apply(this, arguments);
    this.type = "isogon";
};
Base.creatClass(Isogon, Polygon, {
    $watch: function(name, value, preValue) {
        if (name == "r" || name == "n") { //如果path有变动，需要自动计算新的pointList
            this.setPointList( this.context );
        }
    },
    setPointList: function(style) {
        style.pointList.length = 0;
        var n = style.n, r = style.r;
        var dStep = 2 * Math.PI / n;
        var beginDeg = -Math.PI / 2;
        var deg = beginDeg;
        for (var i = 0, end = n; i < end; i++) {
            style.pointList.push([r * Math.cos(deg), r * Math.sin(deg)]);
            deg += dStep;
        }
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 线条 类
 *
 *
 * 对应context的属性有
 * @lineType  可选 虚线 实现 的 类型
 * @xStart    必须，起点横坐标
 * @yStart    必须，起点纵坐标
 * @xEnd      必须，终点横坐标
 * @yEnd      必须，终点纵坐标
 **/
var Line = function(opt) {
    var self = this;
    this.type = "line";
    this.drawTypeOnly = "stroke";
    opt = Base.checkOpt(opt);
    self._context = {
        lineType: opt.context.lineType || null, //可选 虚线 实现 的 类型
        xStart: opt.context.xStart || 0, //{number},  // 必须，起点横坐标
        yStart: opt.context.yStart || 0, //{number},  // 必须，起点纵坐标
        xEnd: opt.context.xEnd || 0, //{number},  // 必须，终点横坐标
        yEnd: opt.context.yEnd || 0, //{number},  // 必须，终点纵坐标
        dashLength: opt.context.dashLength
    };
    Line.superclass.constructor.apply(this, arguments);
};

Base.creatClass(Line, Shape, {
    /**
     * 创建线条路径
     * ctx Canvas 2D上下文
     * style 样式
     */
    draw: function(ctx, style) {
        if (!style.lineType || style.lineType == 'solid') {
            //默认为实线
            ctx.moveTo(parseInt(style.xStart), parseInt(style.yStart));
            ctx.lineTo(parseInt(style.xEnd), parseInt(style.yEnd));
        } else if (style.lineType == 'dashed' || style.lineType == 'dotted') {
            this.dashedLineTo(
                ctx,
                style.xStart, style.yStart,
                style.xEnd, style.yEnd,
                style.dashLength
            );
        }
    },

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * style
     */
    getRect: function(style) {
        var lineWidth = style.lineWidth || 1;
        var style = style ? style : this.context;
        return {
            x: Math.min(style.xStart, style.xEnd) - lineWidth,
            y: Math.min(style.yStart, style.yEnd) - lineWidth,
            width: Math.abs(style.xStart - style.xEnd) + lineWidth,
            height: Math.abs(style.yStart - style.yEnd) + lineWidth
        };
    }

});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 矩现 类  （不规则）
 *
 *
 * 对应context的属性有
 * @width 宽度
 * @height 高度
 * @radius 如果是圆角的，则为【上右下左】顺序的圆角半径数组
 **/
var Rect = function(opt){
    var self = this;
    self.type = "rect";

    opt = Base.checkOpt( opt );
    self._context = {
         width         : opt.context.width || 0,//{number},  // 必须，宽度
         height        : opt.context.height|| 0,//{number},  // 必须，高度
         radius        : opt.context.radius|| []     //{array},   // 默认为[0]，圆角 
    };
    Rect.superclass.constructor.apply(this, arguments);
};

Base.creatClass( Rect , Shape , {
    /**
     * 绘制圆角矩形
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    _buildRadiusPath: function(ctx, style) {
        //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
        //r缩写为1         相当于 [1, 1, 1, 1]
        //r缩写为[1]       相当于 [1, 1, 1, 1]
        //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
        //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
        var x = 0;
        var y = 0;
        var width = this.context.width;
        var height = this.context.height;
    
        var r = Base.getCssOrderArr(style.radius);
     
        ctx.moveTo( parseInt(x + r[0]), parseInt(y));
        ctx.lineTo( parseInt(x + width - r[1]), parseInt(y));
        r[1] !== 0 && ctx.quadraticCurveTo(
                x + width, y, x + width, y + r[1]
                );
        ctx.lineTo( parseInt(x + width), parseInt(y + height - r[2]));
        r[2] !== 0 && ctx.quadraticCurveTo(
                x + width, y + height, x + width - r[2], y + height
                );
        ctx.lineTo( parseInt(x + r[3]), parseInt(y + height));
        r[3] !== 0 && ctx.quadraticCurveTo(
                x, y + height, x, y + height - r[3]
                );
        ctx.lineTo( parseInt(x), parseInt(y + r[0]));
        r[0] !== 0 && ctx.quadraticCurveTo(x, y, x + r[0], y);
    },
    /**
     * 创建矩形路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    draw : function(ctx, style) {
        if(!style.$model.radius.length) {
            if(!!style.fillStyle){
               ctx.fillRect( 0 , 0 ,this.context.width,this.context.height);
            }
            if(!!style.lineWidth){
               ctx.strokeRect( 0 , 0 , this.context.width,this.context.height);
            }
        } else {
            this._buildRadiusPath(ctx, style);
        }
        return;
    },

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * @param {Object} style
     */
    getRect : function(style) {
            var lineWidth;
            var style = style ? style : this.context;
            if (style.fillStyle || style.strokeStyle) {
                lineWidth = style.lineWidth || 1;
            }
            else {
                lineWidth = 0;
            }
            return {
                  x : Math.round(0 - lineWidth / 2),
                  y : Math.round(0 - lineWidth / 2),
                  width : this.context.width + lineWidth,
                  height : this.context.height + lineWidth
            };
        }

} );

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 扇形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r0 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
 * @r  必须，外圆半径
 * @startAngle 起始角度(0, 360)
 * @endAngle   结束角度(0, 360)
 **/
var Sector = function(opt){
    var self  = this;
    self.type = "sector";
    self.regAngle  = [];
    self.isRing    = false;//是否为一个圆环

    opt = Base.checkOpt( opt );
    self._context  = {
        pointList  : [],//边界点的集合,私有，从下面的属性计算的来
        r0         : opt.context.r0         || 0,// 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
        r          : opt.context.r          || 0,//{number},  // 必须，外圆半径
        startAngle : opt.context.startAngle || 0,//{number},  // 必须，起始角度[0, 360)
        endAngle   : opt.context.endAngle   || 0, //{number},  // 必须，结束角度(0, 360]
        clockwise  : opt.context.clockwise  || false //是否顺时针，默认为false(顺时针)
    };
    Sector.superclass.constructor.apply(this , arguments);
};

Base.creatClass(Sector , Shape , {
    draw : function(ctx, context) {
        // 形内半径[0,r)
        var r0 = typeof context.r0 == 'undefined' ? 0 : context.r0;
        var r  = context.r;                            // 扇形外半径(0,r]
        var startAngle = myMath.degreeTo360(context.startAngle);          // 起始角度[0,360)
        var endAngle   = myMath.degreeTo360(context.endAngle);              // 结束角度(0,360]

        //var isRing     = false;                       //是否为圆环

        //if( startAngle != endAngle && Math.abs(startAngle - endAngle) % 360 == 0 ) {
        if( startAngle == endAngle && context.startAngle != context.endAngle ) {
            //如果两个角度相等，那么就认为是个圆环了
            this.isRing     = true;
            startAngle = 0 ;
            endAngle   = 360;
        }

        startAngle = myMath.degreeToRadian(startAngle);
        endAngle   = myMath.degreeToRadian(endAngle);
     
        //处理下极小夹角的情况
        if( endAngle - startAngle < 0.025 ){
            startAngle -= 0.003;
        }

        ctx.arc( 0 , 0 , r, startAngle, endAngle, this.context.clockwise);
        if (r0 !== 0) {
            if( this.isRing ){
                //加上这个isRing的逻辑是为了兼容flashcanvas下绘制圆环的的问题
                //不加这个逻辑flashcanvas会绘制一个大圆 ， 而不是圆环
                ctx.moveTo( r0 , 0 );
                ctx.arc( 0 , 0 , r0 , startAngle , endAngle , !this.context.clockwise);
            } else {
                ctx.arc( 0 , 0 , r0 , endAngle , startAngle , !this.context.clockwise);
            }
        } else {
            //TODO:在r0为0的时候，如果不加lineTo(0,0)来把路径闭合，会出现有搞笑的一个bug
            //整个圆会出现一个以每个扇形两端为节点的镂空，我可能描述不清楚，反正这个加上就好了
            ctx.lineTo(0,0);
        }
     },
     getRegAngle : function(){
         this.regIn      = true;  //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
         var c           = this.context;
         var startAngle = myMath.degreeTo360(c.startAngle);          // 起始角度[0,360)
         var endAngle   = myMath.degreeTo360(c.endAngle);            // 结束角度(0,360]

         if ( ( startAngle > endAngle && !c.clockwise ) || ( startAngle < endAngle && c.clockwise ) ) {
             this.regIn  = false; //out
         }
         //度的范围，从小到大
         this.regAngle   = [ 
             Math.min( startAngle , endAngle ) , 
             Math.max( startAngle , endAngle ) 
         ];
     },
     getRect : function(context){
         var context = context ? context : this.context;
         var r0 = typeof context.r0 == 'undefined'     // 形内半径[0,r)
             ? 0 : context.r0;
         var r = context.r;                            // 扇形外半径(0,r]
         
         this.getRegAngle();

         var startAngle = myMath.degreeTo360(context.startAngle);          // 起始角度[0,360)
         var endAngle   = myMath.degreeTo360(context.endAngle);            // 结束角度(0,360]

         /*
         var isCircle = false;
         if( Math.abs( startAngle - endAngle ) == 360 
                 || ( startAngle == endAngle && startAngle * endAngle != 0 ) ){
             isCircle = true;
         }
         */

         var pointList  = [];

         var p4Direction= {
             "90" : [ 0 , r ],
             "180": [ -r, 0 ],
             "270": [ 0 , -r],
             "360": [ r , 0 ] 
         };

         for ( var d in p4Direction ){
             var inAngleReg = parseInt(d) > this.regAngle[0] && parseInt(d) < this.regAngle[1];
             if( this.isRing || (inAngleReg && this.regIn) || (!inAngleReg && !this.regIn) ){
                 pointList.push( p4Direction[ d ] );
             }
         }

         if( !this.isRing ) {
             startAngle = myMath.degreeToRadian( startAngle );
             endAngle   = myMath.degreeToRadian( endAngle   );

             pointList.push([
                     myMath.cos(startAngle) * r0 , myMath.sin(startAngle) * r0
                     ]);

             pointList.push([
                     myMath.cos(startAngle) * r  , myMath.sin(startAngle) * r
                     ]);

             pointList.push([
                     myMath.cos(endAngle)   * r  ,  myMath.sin(endAngle)  * r
                     ]);

             pointList.push([
                     myMath.cos(endAngle)   * r0 ,  myMath.sin(endAngle)  * r0
                     ]);
         }

         context.pointList = pointList;
         return this.getRectFormPointList( context );
     }

});

/**
 * Canvax {{PKG_VERSION}}
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 主引擎 类
 *
 * 负责所有canvas的层级管理，和心跳机制的实现,捕获到心跳包后 
 * 分发到对应的stage(canvas)来绘制对应的改动
 * 然后 默认有实现了shape的 mouseover  mouseout  drag 事件
 *
 **/
//shapes
//utils
var Canvax = function( opt ){
    this.type = "canvax";
    this._cid = new Date().getTime() + "_" + Math.floor(Math.random()*100); 
    
    this._rootDom   = $.query(opt.el);
    if( !this._rootDom ){
        //如果宿主对象不存在,那么，我也懒的画了
        return;
    }
    this.width      = parseInt("width"  in opt || this._rootDom.offsetWidth  , 10); 
    this.height     = parseInt("height" in opt || this._rootDom.offsetHeight , 10); 

    //是否阻止浏览器默认事件的执行
    this.preventDefault = true;
    if( opt.preventDefault === false ){
        this.preventDefault = false;
    }

    //如果这个时候el里面已经有东西了。嗯，也许曾经这个el被canvax干过一次了。
    //那么要先清除这个el的所有内容。
    //默认的el是一个自己创建的div，因为要在这个div上面注册n多个事件 来 在整个canvax系统里面进行事件分发。
    //所以不能直接用配置传进来的el对象。因为可能会重复添加很多的事件在上面。导致很多内容无法释放。
    var htmlStr = "<div id='cc-"+this._cid+"' class='canvax-c' ";
        htmlStr+= "style='position:relative;width:" + this.width + "px;height:" + this.height +"px;'>";
        htmlStr+= "   <div id='cdc-"+this._cid+"' class='canvax-dom-container' ";
        htmlStr+= "   style='position:absolute;width:" + this.width + "px;height:" + this.height +"px;'>";
        htmlStr+= "   </div>";
        htmlStr+= "</div>";

    //var docfrag = document.createDocumentFragment();
    //docfrag.innerHTML = htmlStr

    this._rootDom.innerHTML = htmlStr;

    this.el = $.query("cc-"+this._cid);
    
    this.rootOffset      = $.offset(this.el); //this.el.offset();
    this.lastGetRO       = 0;//最后一次获取rootOffset的时间

    //每帧 由 心跳 上报的 需要重绘的stages 列表
    this.convertStages = {};

    this._heartBeat = false;//心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染
    
    //设置帧率
    this._preRenderTime = 0;

    //任务列表, 如果_taskList 不为空，那么主引擎就一直跑
    //为 含有__enterFrame 方法 DisplayObject 的对象列表
    //比如Movieclip的__enterFrame方法。
    this._taskList = [];
    
    this._bufferStage = null;
    
    this._isReady    = false;

    this.event = null;

    Canvax.superclass.constructor.apply(this, arguments);
};

Base.creatClass(Canvax , DisplayObjectContainer , {
    init : function(){
        this.context.width  = this.width;
        this.context.height = this.height; 

        //然后创建一个用于绘制激活shape的 stage到activation
        this._creatHoverStage();

        //创建一个如果要用像素检测的时候的容器
        this._createPixelContext();
        
        this._isReady = true;
    },
    registEvent : function(opt){
        //初始化事件委托到root元素上面
        this.event = new EventHandler( this , opt);
        this.event.init();
        return this.event;
    },
    resize : function( opt ){
        //重新设置坐标系统 高宽 等。
        this.width      = parseInt((opt && "width" in opt) || this._rootDom.offsetWidth  , 10); 
        this.height     = parseInt((opt && "height" in opt) || this._rootDom.offsetHeight , 10); 

        this.el.style.width  = this.width +"px";
        this.el.style.height = this.height+"px";

        this.rootOffset     = $.offset(this.el);
        this._notWatch      = true;
        this.context.width  = this.width;
        this.context.height = this.height;
        this._notWatch      = false;

        var me = this;
        var reSizeCanvas    = function(ctx){
            var canvas = ctx.canvas;
            canvas.style.width = me.width + "px";
            canvas.style.height= me.height+ "px";
            canvas.setAttribute("width"  , me.width * Base._devicePixelRatio);
            canvas.setAttribute("height" , me.height* Base._devicePixelRatio);

            //如果是swf的话就还要调用这个方法。
            if (ctx.resize) {
                ctx.resize(me.width , me.height);
            }
        }; 
        _.each(this.children , function(s , i){
            s._notWatch     = true;
            s.context.width = me.width;
            s.context.height= me.height;
            reSizeCanvas(s.context2D);
            s._notWatch     = false;
        });

        var canvaxDOMc = $.query("cdc-"+this._cid);
        canvaxDOMc.style.width  = this.width  + "px";
        canvaxDOMc.style.height = this.height + "px";

        this.heartBeat();

    },
    getDomContainer  : function(){
        return $.query("cdc-"+this._cid);
    },
    getHoverStage : function(){
        return this._bufferStage;
    },
    _creatHoverStage : function(){
        //TODO:创建stage的时候一定要传入width height  两个参数
        this._bufferStage = new Stage( {
            id : "activCanvas"+(new Date()).getTime(),
            context : {
                width : this.context.width,
                height: this.context.height
            }
        } );
        //该stage不参与事件检测
        this._bufferStage._eventEnabled = false;
        this.addChild( this._bufferStage );
    },
    /**
     * 用来检测文本width height 
     * @return {Object} 上下文
    */
    _createPixelContext : function() {
        var _pixelCanvas = $.query("_pixelCanvas");
        if(!_pixelCanvas){
            _pixelCanvas = Base._createCanvas("_pixelCanvas" , 0 , 0); 
        } else {
            //如果又的话 就不需要在创建了
            return;
        }
        document.body.appendChild( _pixelCanvas );
        Base.initElement( _pixelCanvas );
        if( Base.canvasSupport() ){
            //canvas的话，哪怕是display:none的页可以用来左像素检测和measureText文本width检测
            _pixelCanvas.style.display    = "none";
        } else {
            //flashCanvas 的话，swf如果display:none了。就做不了measureText 文本宽度 检测了
            _pixelCanvas.style.zIndex     = -1;
            _pixelCanvas.style.position   = "absolute";
            _pixelCanvas.style.left       = - this.context.width  + "px";
            _pixelCanvas.style.top        = - this.context.height + "px";
            _pixelCanvas.style.visibility = "hidden";
        }
        Base._pixelCtx = _pixelCanvas.getContext('2d');
    },
    updateRootOffset : function(){
        var now = new Date().getTime();
        if( now - this.lastGetRO > 1000 ){
            //alert( this.lastGetRO )
            this.rootOffset      = $.offset(this.el);
            this.lastGetRO       = now;
        }
    },
    //如果引擎处于静默状态的话，就会启动
    __startEnter : function(){
       var self = this;
       if( !self.requestAid ){
           self.requestAid = AnimationFrame.registFrame( {
               id : "enterFrame", //同时肯定只有一个enterFrame的task
               task : function(){
                    self.__enterFrame.apply(self);
               }
           } );
       }
    },
    __enterFrame : function(){
        var self = this;
        //不管怎么样，__enterFrame执行了就要把
        //requestAid null 掉
        self.requestAid = null;
        Base.now = new Date().getTime();
        if( self._heartBeat ){
            _.each(_.values( self.convertStages ) , function(convertStage){
               convertStage.stage._render( convertStage.stage.context2D );
            });
            self._heartBeat = false;
            self.convertStages = {};
            //渲染完了，打上最新时间挫
            self._preRenderTime = new Date().getTime();
        }
        //先跑任务队列,因为有可能再具体的hander中会把自己清除掉
        //所以跑任务和下面的length检测分开来
        if(self._taskList.length > 0){
           for(var i=0,l = self._taskList.length ; i < l ; i++ ){
              var obj = self._taskList[i];
              if(obj.__enterFrame){
                 obj.__enterFrame();
              } else {
                 self.__taskList.splice(i-- , 1);
              }
           }  
        }
        //如果依然还有任务。 就继续enterFrame.
        if(self._taskList.length > 0){
           self.__startEnter();
        }
    },
    _afterAddChild : function( stage , index ){
        var canvas;

        if(!stage.context2D){
            canvas = Base._createCanvas( stage.id , this.context.width , this.context.height );
        } else {
            canvas = stage.context2D.canvas;
        }

        var canvaxDOMc = $.query("cdc-"+this._cid);

        if(this.children.length == 1){
            //this.el.append( canvas );
            this.el.insertBefore( canvas , canvaxDOMc );
        } else if(this.children.length>1) {
            if( index == undefined ) {
                //如果没有指定位置，那么就放到_bufferStage的下面。
                this.el.insertBefore( canvas , this._bufferStage.context2D.canvas);
            } else {
                //如果有指定的位置，那么就指定的位置来
                if( index >= this.children.length-1 ){
                   //this.el.append( canvas );
                   this.el.insertBefore( canvas , canvaxDOMc );
                } else {
                   this.el.insertBefore( canvas , this.children[ index ].context2D.canvas );
                }
            }
        }

        Base.initElement( canvas );
        stage.initStage( canvas.getContext("2d") , this.context.width , this.context.height ); 
    },
    _afterDelChild : function(stage){
        this.el.removeChild( stage.context2D.canvas );
    },
    _convertCanvax : function(opt){
        _.each( this.children , function(stage){
            stage.context[opt.name] = opt.value; 
        } );  
    },
    heartBeat : function( opt ){
        //displayList中某个属性改变了
        var self = this;
        if( opt ){
            //心跳包有两种，一种是某元素的可视属性改变了。一种是children有变动
            //分别对应convertType  为 context  and children
            if (opt.convertType == "context"){
                var stage   = opt.stage;
                var shape   = opt.shape;
                var name    = opt.name;
                var value   = opt.value;
                var preValue= opt.preValue;

                if (!self._isReady) {
                    //在还没初始化完毕的情况下，无需做任何处理
                    return;
                }

                if( shape.type == "canvax" ){
                    self._convertCanvax(opt);
                } else {
                    if(!self.convertStages[stage.id]){
                        self.convertStages[stage.id]={
                            stage : stage,
                            convertShapes : {}
                        };
                    }
                    if(shape){
                        if (!self.convertStages[ stage.id ].convertShapes[ shape.id ]){
                            self.convertStages[ stage.id ].convertShapes[ shape.id ]={
                                shape : shape,
                                convertType : opt.convertType
                            };
                        } else {
                            //如果已经上报了该shape的心跳。
                            return;
                        }
                    }
                }
            }

            if (opt.convertType == "children"){
                //元素结构变化，比如addchild removeChild等
                var target = opt.target;
                var stage = opt.src.getStage();
                if( stage || (target.type=="stage") ){
                    //如果操作的目标元素是Stage
                    stage = stage || target;
                    if(!self.convertStages[stage.id]) {
                        self.convertStages[stage.id]={
                            stage : stage,
                            convertShapes : {}
                        };
                    }
                }
            }

            if(!opt.convertType){
                //无条件要求刷新
                var stage = opt.stage;
                if(!self.convertStages[stage.id]) {
                    self.convertStages[stage.id]={
                        stage : stage ,
                        convertShapes : {}
                    };
                }
            }
        } else {
            //无条件要求全部刷新，一般用在resize等。
            _.each( self.children , function( stage , i ){
                self.convertStages[ stage.id ] = {
                    stage : stage,
                    convertShapes : {}
                };
            } );
        }
        
        
        if (!self._heartBeat){
           //如果发现引擎在静默状态，那么就唤醒引擎
           self._heartBeat = true;
           self.__startEnter();
        } else {
           //否则智慧继续确认心跳
           self._heartBeat = true;
        }
    }
} );


Canvax.Display = {
    DisplayObject : DisplayObject,
    DisplayObjectContainer : DisplayObjectContainer,
    Stage  : Stage,
    Sprite : Sprite,
    Shape  : Shape,
    Point  : Point,
    Text   : Text,
    Movieclip : Movieclip,
    Bitmap : Bitmap
};

Canvax.Shapes = {
    BrokenLine : BrokenLine,
    Circle : Circle,
    Droplet : Droplet,
    Ellipse : Ellipse,
    Isogon : Isogon,
    Line : Line,
    Path : Path,
    Polygon : Polygon,
    Rect : Rect,
    Sector : Sector
};

Canvax.Event = {
    EventDispatcher : EventDispatcher,
    EventManager    : EventManager
};

return Canvax;

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmF4LmpzIiwic291cmNlcyI6WyIuLi8uLi9jYW52YXgvdXRpbHMvdW5kZXJzY29yZS5qcyIsIi4uLy4uL2NhbnZheC9jb3JlL0Jhc2UuanMiLCIuLi8uLi9jYW52YXgvYW5pbWF0aW9uL1R3ZWVuLmpzIiwiLi4vLi4vY2FudmF4L2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZS5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1BvaW50LmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0NhbnZheEV2ZW50LmpzIiwiLi4vLi4vY2FudmF4L3V0aWxzL2RvbS5qcyIsIi4uLy4uL2NhbnZheC9ldmVudC9FdmVudEhhbmRsZXIuanMiLCIuLi8uLi9jYW52YXgvZXZlbnQvRXZlbnRNYW5hZ2VyLmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdGguanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9IaXRUZXN0UG9pbnQuanMiLCIuLi8uLi9jYW52YXgvY29yZS9Qcm9wZXJ0eUZhY3RvcnkuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9EaXNwbGF5T2JqZWN0LmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lci5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1N0YWdlLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvU3ByaXRlLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvU2hhcGUuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9UZXh0LmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvQml0bWFwLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvTW92aWVjbGlwLmpzIiwiLi4vLi4vY2FudmF4L2dlb20vVmVjdG9yLmpzIiwiLi4vLi4vY2FudmF4L2dlb20vU21vb3RoU3BsaW5lLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0Jyb2tlbkxpbmUuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvQ2lyY2xlLmpzIiwiLi4vLi4vY2FudmF4L2dlb20vYmV6aWVyLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL1BhdGguanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvRHJvcGxldC5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9FbGxpcHNlLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL1BvbHlnb24uanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvSXNvZ29uLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0xpbmUuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvUmVjdC5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9TZWN0b3IuanMiLCIuLi8uLi9jYW52YXgvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF8gPSB7fVxudmFyIGJyZWFrZXIgPSB7fTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhclxudG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG52YXJcbm5hdGl2ZUZvckVhY2ggICAgICA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbm5hdGl2ZUZpbHRlciAgICAgICA9IEFycmF5UHJvdG8uZmlsdGVyLFxubmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxubmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbm5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzO1xuXG5fLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciB2YWx1ZXMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gdmFsdWVzO1xufTtcblxuXy5rZXlzID0gbmF0aXZlS2V5cyB8fCBmdW5jdGlvbihvYmopIHtcbiAgaWYgKG9iaiAhPT0gT2JqZWN0KG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIHJldHVybiBrZXlzO1xufTtcblxuXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG59O1xuXG52YXIgZWFjaCA9IF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm47XG4gIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgIH1cbiAgfVxufTtcblxuXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbn07XG5cbl8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gIHZhciByZXN1bHRzID0gW107XG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gIGlmIChuYXRpdmVGaWx0ZXIgJiYgb2JqLmZpbHRlciA9PT0gbmF0aXZlRmlsdGVyKSByZXR1cm4gb2JqLmZpbHRlcihpdGVyYXRvciwgY29udGV4dCk7XG4gIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gIH07XG59KTtcblxuaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbiAgfTtcbn07XG5cbl8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG59O1xuXG5fLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG59O1xuXG5fLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn07XG5cbl8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IG51bGw7XG59O1xuXG5fLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbl8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbn07XG5cbl8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbl8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59O1xuXG5fLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuXy5pbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlzU29ydGVkKSB7XG4gIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICBpZiAoaXNTb3J0ZWQpIHtcbiAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICBpID0gKGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGxlbmd0aCArIGlzU29ydGVkKSA6IGlzU29ydGVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgIH1cbiAgfVxuICBpZiAobmF0aXZlSW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtLCBpc1NvcnRlZCk7XG4gIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xufTtcblxuXy5pc1dpbmRvdyA9IGZ1bmN0aW9uKCBvYmogKSB7IFxuICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iaiA9PSBvYmoud2luZG93O1xufTtcbl8uaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgLy8gQmVjYXVzZSBvZiBJRSwgd2UgYWxzbyBoYXZlIHRvIGNoZWNrIHRoZSBwcmVzZW5jZSBvZiB0aGUgY29uc3RydWN0b3IgcHJvcGVydHkuXG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgRE9NIG5vZGVzIGFuZCB3aW5kb3cgb2JqZWN0cyBkb24ndCBwYXNzIHRocm91Z2gsIGFzIHdlbGxcbiAgICBpZiAoICFvYmogfHwgdHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIiB8fCBvYmoubm9kZVR5cGUgfHwgXy5pc1dpbmRvdyggb2JqICkgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICAgICAgICBpZiAoIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgICAgICAgICAgIWhhc093bi5jYWxsKG9iaiwgXCJjb25zdHJ1Y3RvclwiKSAmJlxuICAgICAgICAgICAgIWhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFwiaXNQcm90b3R5cGVPZlwiKSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAvLyBJRTgsOSBXaWxsIHRocm93IGV4Y2VwdGlvbnMgb24gY2VydGFpbiBob3N0IG9iamVjdHMgIzk4OTdcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcbiAgICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgICB2YXIga2V5O1xuICAgIGZvciAoIGtleSBpbiBvYmogKSB7fVxuXG4gICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKCBvYmosIGtleSApO1xufTtcbl8uZXh0ZW5kID0gZnVuY3Rpb24oKSB7ICBcbiAgdmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLCAgXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge30sICBcbiAgICAgIGkgPSAxLCAgXG4gICAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCAgXG4gICAgICBkZWVwID0gZmFsc2U7ICBcbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ID09PSBcImJvb2xlYW5cIiApIHsgIFxuICAgICAgZGVlcCA9IHRhcmdldDsgIFxuICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9OyAgXG4gICAgICBpID0gMjsgIFxuICB9OyAgXG4gIGlmICggdHlwZW9mIHRhcmdldCAhPT0gXCJvYmplY3RcIiAmJiAhXy5pc0Z1bmN0aW9uKHRhcmdldCkgKSB7ICBcbiAgICAgIHRhcmdldCA9IHt9OyAgXG4gIH07ICBcbiAgaWYgKCBsZW5ndGggPT09IGkgKSB7ICBcbiAgICAgIHRhcmdldCA9IHRoaXM7ICBcbiAgICAgIC0taTsgIFxuICB9OyAgXG4gIGZvciAoIDsgaSA8IGxlbmd0aDsgaSsrICkgeyAgXG4gICAgICBpZiAoIChvcHRpb25zID0gYXJndW1lbnRzWyBpIF0pICE9IG51bGwgKSB7ICBcbiAgICAgICAgICBmb3IgKCBuYW1lIGluIG9wdGlvbnMgKSB7ICBcbiAgICAgICAgICAgICAgc3JjID0gdGFyZ2V0WyBuYW1lIF07ICBcbiAgICAgICAgICAgICAgY29weSA9IG9wdGlvbnNbIG5hbWUgXTsgIFxuICAgICAgICAgICAgICBpZiAoIHRhcmdldCA9PT0gY29weSApIHsgIFxuICAgICAgICAgICAgICAgICAgY29udGludWU7ICBcbiAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgIGlmICggZGVlcCAmJiBjb3B5ICYmICggXy5pc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IF8uaXNBcnJheShjb3B5KSkgKSApIHsgIFxuICAgICAgICAgICAgICAgICAgaWYgKCBjb3B5SXNBcnJheSApIHsgIFxuICAgICAgICAgICAgICAgICAgICAgIGNvcHlJc0FycmF5ID0gZmFsc2U7ICBcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBfLmlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdOyAgXG4gICAgICAgICAgICAgICAgICB9IGVsc2UgeyAgXG4gICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgXy5pc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTsgIFxuICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICB0YXJnZXRbIG5hbWUgXSA9IF8uZXh0ZW5kKCBkZWVwLCBjbG9uZSwgY29weSApOyAgXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNvcHkgIT09IHVuZGVmaW5lZCApIHsgIFxuICAgICAgICAgICAgICAgICAgdGFyZ2V0WyBuYW1lIF0gPSBjb3B5OyAgXG4gICAgICAgICAgICAgIH0gIFxuICAgICAgICAgIH0gIFxuICAgICAgfSAgXG4gIH0gIFxuICByZXR1cm4gdGFyZ2V0OyAgXG59OyBcbl8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG59O1xuZXhwb3J0IGRlZmF1bHQgXzsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSBcbiovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG52YXIgQmFzZSA9IHtcbiAgICBtYWluRnJhbWVSYXRlICAgOiA2MCwvL+m7mOiupOS4u+W4p+eOh1xuICAgIG5vdyA6IDAsXG4gICAgLyrlg4/ntKDmo4DmtYvkuJPnlKgqL1xuICAgIF9waXhlbEN0eCAgIDogbnVsbCxcbiAgICBfX2VtcHR5RnVuYyA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL3JldGluYSDlsY/luZXkvJjljJZcbiAgICBfZGV2aWNlUGl4ZWxSYXRpbyA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgX1VJRCAgOiAwLCAvL+ivpeWAvOS4uuWQkeS4iueahOiHquWinumVv+aVtOaVsOWAvFxuICAgIGdldFVJRDpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fVUlEKys7XG4gICAgfSxcbiAgICBjcmVhdGVJZCA6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgLy9pZiBlbmQgd2l0aCBhIGRpZ2l0LCB0aGVuIGFwcGVuZCBhbiB1bmRlcnNCYXNlIGJlZm9yZSBhcHBlbmRpbmdcbiAgICAgICAgdmFyIGNoYXJDb2RlID0gbmFtZS5jaGFyQ29kZUF0KG5hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmIChjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1NykgbmFtZSArPSBcIl9cIjtcbiAgICAgICAgcmV0dXJuIG5hbWUgKyBCYXNlLmdldFVJRCgpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yib5bu6ZG9tXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIGRvbSBpZCDlvoXnlKhcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSA6IGRvbSB0eXBl77yMIHN1Y2ggYXMgY2FudmFzLCBkaXYgZXRjLlxuICAgICAqL1xuICAgIF9jcmVhdGVDYW52YXMgOiBmdW5jdGlvbihpZCwgX3dpZHRoICwgX2hlaWdodCkge1xuICAgICAgICB2YXIgbmV3RG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblxuICAgICAgICBuZXdEb20uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBuZXdEb20uc3R5bGUud2lkdGggID0gX3dpZHRoICsgJ3B4JztcbiAgICAgICAgbmV3RG9tLnN0eWxlLmhlaWdodCA9IF9oZWlnaHQgKyAncHgnO1xuICAgICAgICBuZXdEb20uc3R5bGUubGVmdCAgID0gMDtcbiAgICAgICAgbmV3RG9tLnN0eWxlLnRvcCAgICA9IDA7XG4gICAgICAgIC8vbmV3RG9tLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBfd2lkdGggKTtcbiAgICAgICAgLy9uZXdEb20uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBfaGVpZ2h0ICk7XG4gICAgICAgIG5ld0RvbS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgX3dpZHRoICogdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgIG5ld0RvbS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIF9oZWlnaHQgKiB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgbmV3RG9tLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgICAgIHJldHVybiBuZXdEb207XG4gICAgfSxcbiAgICBjYW52YXNTdXBwb3J0IDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQ7XG4gICAgfSxcbiAgICBjcmVhdGVPYmplY3QgOiBmdW5jdGlvbiggcHJvdG8gLCBjb25zdHJ1Y3RvciApIHtcbiAgICAgICAgdmFyIG5ld1Byb3RvO1xuICAgICAgICB2YXIgT2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbiAgICAgICAgaWYgKE9iamVjdENyZWF0ZSkge1xuICAgICAgICAgICAgbmV3UHJvdG8gPSBPYmplY3RDcmVhdGUocHJvdG8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgQmFzZS5fX2VtcHR5RnVuYy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgICAgICAgIG5ld1Byb3RvID0gbmV3IEJhc2UuX19lbXB0eUZ1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdQcm90by5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3UHJvdG87XG4gICAgfSxcbiAgICBzZXRDb250ZXh0U3R5bGUgOiBmdW5jdGlvbiggY3R4ICwgc3R5bGUgKXtcbiAgICAgICAgLy8g566A5Y2V5Yik5pat5LiN5YGa5Lil5qC857G75Z6L5qOA5rWLXG4gICAgICAgIGZvcih2YXIgcCBpbiBzdHlsZSl7XG4gICAgICAgICAgICBpZiggcCAhPSBcInRleHRCYXNlbGluZVwiICYmICggcCBpbiBjdHggKSApe1xuICAgICAgICAgICAgICAgIGlmICggc3R5bGVbcF0gfHwgXy5pc051bWJlciggc3R5bGVbcF0gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHAgPT0gXCJnbG9iYWxBbHBoYVwiICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mAj+aYjuW6puimgeS7jueItuiKgueCuee7p+aJv1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdICo9IHN0eWxlW3BdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gc3R5bGVbcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybjtcbiAgICB9LFxuICAgIGNyZWF0Q2xhc3MgOiBmdW5jdGlvbihyLCBzLCBweCl7XG4gICAgICAgIGlmICghcyB8fCAhcikge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNwID0gcy5wcm90b3R5cGUsIHJwO1xuICAgICAgICAvLyBhZGQgcHJvdG90eXBlIGNoYWluXG4gICAgICAgIHJwID0gQmFzZS5jcmVhdGVPYmplY3Qoc3AsIHIpO1xuICAgICAgICByLnByb3RvdHlwZSA9IF8uZXh0ZW5kKHJwLCByLnByb3RvdHlwZSk7XG4gICAgICAgIHIuc3VwZXJjbGFzcyA9IEJhc2UuY3JlYXRlT2JqZWN0KHNwLCBzKTtcbiAgICAgICAgLy8gYWRkIHByb3RvdHlwZSBvdmVycmlkZXNcbiAgICAgICAgaWYgKHB4KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChycCwgcHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG4gICAgaW5pdEVsZW1lbnQgOiBmdW5jdGlvbiggY2FudmFzICl7XG4gICAgICAgIGlmKCB3aW5kb3cuRmxhc2hDYW52YXMgJiYgRmxhc2hDYW52YXMuaW5pdEVsZW1lbnQpe1xuICAgICAgICAgICAgRmxhc2hDYW52YXMuaW5pdEVsZW1lbnQoIGNhbnZhcyApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+WBmuS4gOasoeeugOWNleeahG9wdOWPguaVsOagoemqjO+8jOS/neivgeWcqOeUqOaIt+S4jeS8oG9wdOeahOaXtuWAmSDmiJbogIXkvKDkuoZvcHTkvYbmmK/ph4zpnaLmsqHmnIljb250ZXh055qE5pe25YCZ5oql6ZSZXG4gICAgY2hlY2tPcHQgICAgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBpZiggIW9wdCApe1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZXh0IDoge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSAgIFxuICAgICAgICB9IGVsc2UgaWYoIG9wdCAmJiAhb3B0LmNvbnRleHQgKSB7XG4gICAgICAgICAgb3B0LmNvbnRleHQgPSB7fVxuICAgICAgICAgIHJldHVybiBvcHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9wdDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcbiAgICAvKipcbiAgICAgKiDmjInnhadjc3PnmoTpobrluo/vvIzov5Tlm57kuIDkuKpb5LiKLOWPsyzkuIss5bemXVxuICAgICAqL1xuICAgIGdldENzc09yZGVyQXJyIDogZnVuY3Rpb24oIHIgKXtcbiAgICAgICAgdmFyIHIxOyBcbiAgICAgICAgdmFyIHIyOyBcbiAgICAgICAgdmFyIHIzOyBcbiAgICAgICAgdmFyIHI0O1xuXG4gICAgICAgIGlmKHR5cGVvZiByID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSByO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYociBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBpZiAoci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IHJbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByMyA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByNCA9IHJbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gcjQgPSByWzFdO1xuICAgICAgICAgICAgICAgIHIzID0gclsyXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gclsxXTtcbiAgICAgICAgICAgICAgICByMyA9IHJbMl07XG4gICAgICAgICAgICAgICAgcjQgPSByWzNdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcjEscjIscjMscjRdO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2U7IiwiaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiBUd2Vlbi5qcyAtIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanMvZ3JhcGhzL2NvbnRyaWJ1dG9ycyBmb3IgdGhlIGZ1bGwgbGlzdCBvZiBjb250cmlidXRvcnMuXG4gKiBUaGFuayB5b3UgYWxsLCB5b3UncmUgYXdlc29tZSFcbiAqL1xuXG4gdmFyIFRXRUVOID0gVFdFRU4gfHwgKGZ1bmN0aW9uICgpIHtcblxuIFx0dmFyIF90d2VlbnMgPSBbXTtcblxuIFx0cmV0dXJuIHtcblxuIFx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblxuIFx0XHRcdHJldHVybiBfdHdlZW5zO1xuXG4gXHRcdH0sXG5cbiBcdFx0cmVtb3ZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cbiBcdFx0XHRfdHdlZW5zID0gW107XG5cbiBcdFx0fSxcblxuIFx0XHRhZGQ6IGZ1bmN0aW9uICh0d2Vlbikge1xuXG4gXHRcdFx0X3R3ZWVucy5wdXNoKHR3ZWVuKTtcblxuIFx0XHR9LFxuXG4gXHRcdHJlbW92ZTogZnVuY3Rpb24gKHR3ZWVuKSB7XG5cblx0XHRcdHZhciBpID0gXy5pbmRleE9mKCBfdHdlZW5zICwgdHdlZW4gKTsvL190d2VlbnMuaW5kZXhPZih0d2Vlbik7XG5cblx0XHRcdGlmIChpICE9PSAtMSkge1xuXHRcdFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uICh0aW1lLCBwcmVzZXJ2ZSkge1xuXG5cdFx0XHRpZiAoX3R3ZWVucy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdHRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogVFdFRU4ubm93KCk7XG5cblx0XHRcdHdoaWxlIChpIDwgX3R3ZWVucy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgIC8qIG9sZCBcblx0XHRcdFx0aWYgKF90d2VlbnNbaV0udXBkYXRlKHRpbWUpIHx8IHByZXNlcnZlKSB7XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCovXG5cbiAgICAgICAgICAgICAgICAvL25ldyBjb2RlXG4gICAgICAgICAgICAgICAgLy9pbiByZWFsIHdvcmxkLCB0d2Vlbi51cGRhdGUgaGFzIGNoYW5jZSB0byByZW1vdmUgaXRzZWxmLCBzbyB3ZSBoYXZlIHRvIGhhbmRsZSB0aGlzIHNpdHVhdGlvbi5cbiAgICAgICAgICAgICAgICAvL2luIGNlcnRhaW4gY2FzZXMsIG9uVXBkYXRlQ2FsbGJhY2sgd2lsbCByZW1vdmUgaW5zdGFuY2VzIGluIF90d2VlbnMsIHdoaWNoIG1ha2UgX3R3ZWVucy5zcGxpY2UoaSwgMSkgZmFpbFxuICAgICAgICAgICAgICAgIC8vQGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbVxuICAgICAgICAgICAgICAgIHZhciBfdCA9IF90d2VlbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIF91cGRhdGVSZXMgPSBfdC51cGRhdGUodGltZSk7XG5cbiAgICAgICAgICAgICAgICBpZiggIV90d2VlbnNbaV0gKXtcbiAgICAgICAgICAgICAgICBcdGJyZWFrO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKCBfdCA9PT0gX3R3ZWVuc1tpXSApIHtcbiAgICAgICAgICAgICAgICBcdGlmICggX3VwZGF0ZVJlcyB8fCBwcmVzZXJ2ZSApIHtcbiAgICAgICAgICAgICAgICBcdFx0aSsrO1xuICAgICAgICAgICAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgICAgICAgICBcdFx0X3R3ZWVucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgXHR9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG59KSgpO1xuXG5cbi8vIEluY2x1ZGUgYSBwZXJmb3JtYW5jZS5ub3cgcG9seWZpbGwuXG4vLyBJbiBub2RlLmpzLCB1c2UgcHJvY2Vzcy5ocnRpbWUuXG5pZiAodHlwZW9mICh3aW5kb3cpID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHByb2Nlc3MpICE9PSAndW5kZWZpbmVkJykge1xuXHRUV0VFTi5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHRpbWUgPSBwcm9jZXNzLmhydGltZSgpO1xuXG5cdFx0Ly8gQ29udmVydCBbc2Vjb25kcywgbmFub3NlY29uZHNdIHRvIG1pbGxpc2Vjb25kcy5cblx0XHRyZXR1cm4gdGltZVswXSAqIDEwMDAgKyB0aW1lWzFdIC8gMTAwMDAwMDtcblx0fTtcbn1cbi8vIEluIGEgYnJvd3NlciwgdXNlIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAodHlwZW9mICh3aW5kb3cpICE9PSAndW5kZWZpbmVkJyAmJlxuXHR3aW5kb3cucGVyZm9ybWFuY2UgIT09IHVuZGVmaW5lZCAmJlxuXHR3aW5kb3cucGVyZm9ybWFuY2Uubm93ICE9PSB1bmRlZmluZWQpIHtcblx0Ly8gVGhpcyBtdXN0IGJlIGJvdW5kLCBiZWNhdXNlIGRpcmVjdGx5IGFzc2lnbmluZyB0aGlzIGZ1bmN0aW9uXG5cdC8vIGxlYWRzIHRvIGFuIGludm9jYXRpb24gZXhjZXB0aW9uIGluIENocm9tZS5cblx0VFdFRU4ubm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdy5iaW5kKHdpbmRvdy5wZXJmb3JtYW5jZSk7XG59XG4vLyBVc2UgRGF0ZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAoRGF0ZS5ub3cgIT09IHVuZGVmaW5lZCkge1xuXHRUV0VFTi5ub3cgPSBEYXRlLm5vdztcbn1cbi8vIE90aGVyd2lzZSwgdXNlICduZXcgRGF0ZSgpLmdldFRpbWUoKScuXG5lbHNlIHtcblx0VFdFRU4ubm93ID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fTtcbn1cblxuXG5UV0VFTi5Ud2VlbiA9IGZ1bmN0aW9uIChvYmplY3QpIHtcblxuXHR2YXIgX29iamVjdCA9IG9iamVjdDtcblx0dmFyIF92YWx1ZXNTdGFydCA9IHt9O1xuXHR2YXIgX3ZhbHVlc0VuZCA9IHt9O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0UmVwZWF0ID0ge307XG5cdHZhciBfZHVyYXRpb24gPSAxMDAwO1xuXHR2YXIgX3JlcGVhdCA9IDA7XG5cdHZhciBfcmVwZWF0RGVsYXlUaW1lO1xuXHR2YXIgX3lveW8gPSBmYWxzZTtcblx0dmFyIF9pc1BsYXlpbmcgPSBmYWxzZTtcblx0dmFyIF9yZXZlcnNlZCA9IGZhbHNlO1xuXHR2YXIgX2RlbGF5VGltZSA9IDA7XG5cdHZhciBfc3RhcnRUaW1lID0gbnVsbDtcblx0dmFyIF9lYXNpbmdGdW5jdGlvbiA9IFRXRUVOLkVhc2luZy5MaW5lYXIuTm9uZTtcblx0dmFyIF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLkxpbmVhcjtcblx0dmFyIF9jaGFpbmVkVHdlZW5zID0gW107XG5cdHZhciBfb25TdGFydENhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXHR2YXIgX29uVXBkYXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uQ29tcGxldGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdG9wQ2FsbGJhY2sgPSBudWxsO1xuXG5cdHRoaXMudG8gPSBmdW5jdGlvbiAocHJvcGVydGllcywgZHVyYXRpb24pIHtcblxuXHRcdF92YWx1ZXNFbmQgPSBwcm9wZXJ0aWVzO1xuXG5cdFx0aWYgKGR1cmF0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdF9kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uICh0aW1lKSB7XG5cblx0XHRUV0VFTi5hZGQodGhpcyk7XG5cblx0XHRfaXNQbGF5aW5nID0gdHJ1ZTtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXG5cdFx0X3N0YXJ0VGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiBUV0VFTi5ub3coKTtcblx0XHRfc3RhcnRUaW1lICs9IF9kZWxheVRpbWU7XG5cblx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kKSB7XG5cblx0XHRcdC8vIENoZWNrIGlmIGFuIEFycmF5IHdhcyBwcm92aWRlZCBhcyBwcm9wZXJ0eSB2YWx1ZVxuXHRcdFx0aWYgKF92YWx1ZXNFbmRbcHJvcGVydHldIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuXHRcdFx0XHRpZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDcmVhdGUgYSBsb2NhbCBjb3B5IG9mIHRoZSBBcnJheSB3aXRoIHRoZSBzdGFydCB2YWx1ZSBhdCB0aGUgZnJvbnRcblx0XHRcdFx0X3ZhbHVlc0VuZFtwcm9wZXJ0eV0gPSBbX29iamVjdFtwcm9wZXJ0eV1dLmNvbmNhdChfdmFsdWVzRW5kW3Byb3BlcnR5XSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgYHRvKClgIHNwZWNpZmllcyBhIHByb3BlcnR5IHRoYXQgZG9lc24ndCBleGlzdCBpbiB0aGUgc291cmNlIG9iamVjdCxcblx0XHRcdC8vIHdlIHNob3VsZCBub3Qgc2V0IHRoYXQgcHJvcGVydHkgaW4gdGhlIG9iamVjdFxuXHRcdFx0aWYgKF9vYmplY3RbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNhdmUgdGhlIHN0YXJ0aW5nIHZhbHVlLlxuXHRcdFx0X3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9IF9vYmplY3RbcHJvcGVydHldO1xuXG5cdFx0XHRpZiAoKF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gKj0gMS4wOyAvLyBFbnN1cmVzIHdlJ3JlIHVzaW5nIG51bWJlcnMsIG5vdCBzdHJpbmdzXG5cdFx0XHR9XG5cblx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRbcHJvcGVydHldIHx8IDA7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICghX2lzUGxheWluZykge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0VFdFRU4ucmVtb3ZlKHRoaXMpO1xuXHRcdF9pc1BsYXlpbmcgPSBmYWxzZTtcblxuXHRcdGlmIChfb25TdG9wQ2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdF9vblN0b3BDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdH1cblxuXHRcdHRoaXMuc3RvcENoYWluZWRUd2VlbnMoKTtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuZW5kID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0dGhpcy51cGRhdGUoX3N0YXJ0VGltZSArIF9kdXJhdGlvbik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKyspIHtcblx0XHRcdF9jaGFpbmVkVHdlZW5zW2ldLnN0b3AoKTtcblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmRlbGF5ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuXG5cdFx0X2RlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMucmVwZWF0ID0gZnVuY3Rpb24gKHRpbWVzKSB7XG5cblx0XHRfcmVwZWF0ID0gdGltZXM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdERlbGF5ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuXG5cdFx0X3JlcGVhdERlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMueW95byA9IGZ1bmN0aW9uICh5b3lvKSB7XG5cblx0XHRfeW95byA9IHlveW87XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXG5cdHRoaXMuZWFzaW5nID0gZnVuY3Rpb24gKGVhc2luZykge1xuXG5cdFx0X2Vhc2luZ0Z1bmN0aW9uID0gZWFzaW5nO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5pbnRlcnBvbGF0aW9uID0gZnVuY3Rpb24gKGludGVycG9sYXRpb24pIHtcblxuXHRcdF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBpbnRlcnBvbGF0aW9uO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5jaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9jaGFpbmVkVHdlZW5zID0gYXJndW1lbnRzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0YXJ0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25TdGFydENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vbkNvbXBsZXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uU3RvcENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG5cblx0XHR2YXIgcHJvcGVydHk7XG5cdFx0dmFyIGVsYXBzZWQ7XG5cdFx0dmFyIHZhbHVlO1xuXG5cdFx0aWYgKHRpbWUgPCBfc3RhcnRUaW1lKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoX29uU3RhcnRDYWxsYmFja0ZpcmVkID09PSBmYWxzZSkge1xuXG5cdFx0XHRpZiAoX29uU3RhcnRDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0XHRfb25TdGFydENhbGxiYWNrLmNhbGwoX29iamVjdCwgX29iamVjdCk7XG5cdFx0XHR9XG5cblx0XHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZWxhcHNlZCA9ICh0aW1lIC0gX3N0YXJ0VGltZSkgLyBfZHVyYXRpb247XG5cdFx0ZWxhcHNlZCA9IGVsYXBzZWQgPiAxID8gMSA6IGVsYXBzZWQ7XG5cblx0XHR2YWx1ZSA9IF9lYXNpbmdGdW5jdGlvbihlbGFwc2VkKTtcblxuXHRcdGZvciAocHJvcGVydHkgaW4gX3ZhbHVlc0VuZCkge1xuXG5cdFx0XHQvLyBEb24ndCB1cGRhdGUgcHJvcGVydGllcyB0aGF0IGRvIG5vdCBleGlzdCBpbiB0aGUgc291cmNlIG9iamVjdFxuXHRcdFx0aWYgKF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHN0YXJ0ID0gX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xuXHRcdFx0dmFyIGVuZCA9IF92YWx1ZXNFbmRbcHJvcGVydHldO1xuXG5cdFx0XHRpZiAoZW5kIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuXHRcdFx0XHRfb2JqZWN0W3Byb3BlcnR5XSA9IF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24oZW5kLCB2YWx1ZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gUGFyc2VzIHJlbGF0aXZlIGVuZCB2YWx1ZXMgd2l0aCBzdGFydCBhcyBiYXNlIChlLmcuOiArMTAsIC0zKVxuXHRcdFx0XHRpZiAodHlwZW9mIChlbmQpID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdFx0aWYgKGVuZC5jaGFyQXQoMCkgPT09ICcrJyB8fCBlbmQuY2hhckF0KDApID09PSAnLScpIHtcblx0XHRcdFx0XHRcdGVuZCA9IHN0YXJ0ICsgcGFyc2VGbG9hdChlbmQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBwYXJzZUZsb2F0KGVuZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUHJvdGVjdCBhZ2FpbnN0IG5vbiBudW1lcmljIHByb3BlcnRpZXMuXG5cdFx0XHRcdGlmICh0eXBlb2YgKGVuZCkgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0X29iamVjdFtwcm9wZXJ0eV0gPSBzdGFydCArIChlbmQgLSBzdGFydCkgKiB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoX29uVXBkYXRlQ2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdF9vblVwZGF0ZUNhbGxiYWNrLmNhbGwoX29iamVjdCwgdmFsdWUpO1xuXHRcdH1cblxuXHRcdGlmIChlbGFwc2VkID09PSAxKSB7XG5cblx0XHRcdGlmIChfcmVwZWF0ID4gMCkge1xuXG5cdFx0XHRcdGlmIChpc0Zpbml0ZShfcmVwZWF0KSkge1xuXHRcdFx0XHRcdF9yZXBlYXQtLTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlYXNzaWduIHN0YXJ0aW5nIHZhbHVlcywgcmVzdGFydCBieSBtYWtpbmcgc3RhcnRUaW1lID0gbm93XG5cdFx0XHRcdGZvciAocHJvcGVydHkgaW4gX3ZhbHVlc1N0YXJ0UmVwZWF0KSB7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIChfdmFsdWVzRW5kW3Byb3BlcnR5XSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSArIHBhcnNlRmxvYXQoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV07XG5cblx0XHRcdFx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzRW5kW3Byb3BlcnR5XTtcblx0XHRcdFx0XHRcdF92YWx1ZXNFbmRbcHJvcGVydHldID0gdG1wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRfcmV2ZXJzZWQgPSAhX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF9yZXBlYXREZWxheVRpbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdF9zdGFydFRpbWUgPSB0aW1lICsgX3JlcGVhdERlbGF5VGltZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9kZWxheVRpbWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoX29uQ29tcGxldGVDYWxsYmFjayAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0X29uQ29tcGxldGVDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKyspIHtcblx0XHRcdFx0XHQvLyBNYWtlIHRoZSBjaGFpbmVkIHR3ZWVucyBzdGFydCBleGFjdGx5IGF0IHRoZSB0aW1lIHRoZXkgc2hvdWxkLFxuXHRcdFx0XHRcdC8vIGV2ZW4gaWYgdGhlIGB1cGRhdGUoKWAgbWV0aG9kIHdhcyBjYWxsZWQgd2F5IHBhc3QgdGhlIGR1cmF0aW9uIG9mIHRoZSB0d2VlblxuXHRcdFx0XHRcdF9jaGFpbmVkVHdlZW5zW2ldLnN0YXJ0KF9zdGFydFRpbWUgKyBfZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblxuXHR9O1xuXG59O1xuXG5cblRXRUVOLkVhc2luZyA9IHtcblxuXHRMaW5lYXI6IHtcblxuXHRcdE5vbmU6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhZHJhdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiAoMiAtIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0gMC41ICogKC0tayAqIChrIC0gMikgLSAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEN1YmljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFydGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtICgtLWsgKiBrICogayAqIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoKGsgLT0gMikgKiBrICogayAqIGsgLSAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1aW50aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrICogayArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0U2ludXNvaWRhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5jb3MoayAqIE1hdGguUEkgLyAyKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNpbihrICogTWF0aC5QSSAvIDIpO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMC41ICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogaykpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RXhwb25lbnRpYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMCA/IDAgOiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLSAxMCAqIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIE1hdGgucG93KDEwMjQsIGsgLSAxKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgtIE1hdGgucG93KDIsIC0gMTAgKiAoayAtIDEpKSArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q2lyY3VsYXI6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gayAqIGspO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gKC0tayAqIGspKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gLSAwLjUgKiAoTWF0aC5zcXJ0KDEgLSBrICogaykgLSAxKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtIChrIC09IDIpICogaykgKyAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEVsYXN0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtTWF0aC5wb3coMiwgMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIE1hdGgucG93KDIsIC0xMCAqIGspICogTWF0aC5zaW4oKGsgLSAwLjEpICogNSAqIE1hdGguUEkpICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRrICo9IDI7XG5cblx0XHRcdGlmIChrIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gLTAuNSAqIE1hdGgucG93KDIsIDEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAtMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKSArIDE7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCYWNrOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiAoKHMgKyAxKSAqIGsgLSBzKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiAoKHMgKyAxKSAqIGsgKyBzKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiAoayAqIGsgKiAoKHMgKyAxKSAqIGsgLSBzKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJvdW5jZToge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoMSAtIGspO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPCAoMSAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiBrICogaztcblx0XHRcdH0gZWxzZSBpZiAoayA8ICgyIC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgxLjUgLyAyLjc1KSkgKiBrICsgMC43NTtcblx0XHRcdH0gZWxzZSBpZiAoayA8ICgyLjUgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDIuMjUgLyAyLjc1KSkgKiBrICsgMC45Mzc1O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgyLjYyNSAvIDIuNzUpKSAqIGsgKyAwLjk4NDM3NTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPCAwLjUpIHtcblx0XHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuSW4oayAqIDIpICogMC41O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoayAqIDIgLSAxKSAqIDAuNSArIDAuNTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cblRXRUVOLkludGVycG9sYXRpb24gPSB7XG5cblx0TGluZWFyOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIGYgPSBtICogaztcblx0XHR2YXIgaSA9IE1hdGguZmxvb3IoZik7XG5cdFx0dmFyIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5MaW5lYXI7XG5cblx0XHRpZiAoayA8IDApIHtcblx0XHRcdHJldHVybiBmbih2WzBdLCB2WzFdLCBmKTtcblx0XHR9XG5cblx0XHRpZiAoayA+IDEpIHtcblx0XHRcdHJldHVybiBmbih2W21dLCB2W20gLSAxXSwgbSAtIGYpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmbih2W2ldLCB2W2kgKyAxID4gbSA/IG0gOiBpICsgMV0sIGYgLSBpKTtcblxuXHR9LFxuXG5cdEJlemllcjogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBiID0gMDtcblx0XHR2YXIgbiA9IHYubGVuZ3RoIC0gMTtcblx0XHR2YXIgcHcgPSBNYXRoLnBvdztcblx0XHR2YXIgYm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkJlcm5zdGVpbjtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IG47IGkrKykge1xuXHRcdFx0YiArPSBwdygxIC0gaywgbiAtIGkpICogcHcoaywgaSkgKiB2W2ldICogYm4obiwgaSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGI7XG5cblx0fSxcblxuXHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIGYgPSBtICogaztcblx0XHR2YXIgaSA9IE1hdGguZmxvb3IoZik7XG5cdFx0dmFyIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5DYXRtdWxsUm9tO1xuXG5cdFx0aWYgKHZbMF0gPT09IHZbbV0pIHtcblxuXHRcdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRcdGkgPSBNYXRoLmZsb29yKGYgPSBtICogKDEgKyBrKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbih2WyhpIC0gMSArIG0pICUgbV0sIHZbaV0sIHZbKGkgKyAxKSAlIG1dLCB2WyhpICsgMikgJSBtXSwgZiAtIGkpO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRcdHJldHVybiB2WzBdIC0gKGZuKHZbMF0sIHZbMF0sIHZbMV0sIHZbMV0sIC1mKSAtIHZbMF0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA+IDEpIHtcblx0XHRcdFx0cmV0dXJuIHZbbV0gLSAoZm4odlttXSwgdlttXSwgdlttIC0gMV0sIHZbbSAtIDFdLCBmIC0gbSkgLSB2W21dKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuKHZbaSA/IGkgLSAxIDogMF0sIHZbaV0sIHZbbSA8IGkgKyAxID8gbSA6IGkgKyAxXSwgdlttIDwgaSArIDIgPyBtIDogaSArIDJdLCBmIC0gaSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRVdGlsczoge1xuXG5cdFx0TGluZWFyOiBmdW5jdGlvbiAocDAsIHAxLCB0KSB7XG5cblx0XHRcdHJldHVybiAocDEgLSBwMCkgKiB0ICsgcDA7XG5cblx0XHR9LFxuXG5cdFx0QmVybnN0ZWluOiBmdW5jdGlvbiAobiwgaSkge1xuXG5cdFx0XHR2YXIgZmMgPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkZhY3RvcmlhbDtcblxuXHRcdFx0cmV0dXJuIGZjKG4pIC8gZmMoaSkgLyBmYyhuIC0gaSk7XG5cblx0XHR9LFxuXG5cdFx0RmFjdG9yaWFsOiAoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgYSA9IFsxXTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChuKSB7XG5cblx0XHRcdFx0dmFyIHMgPSAxO1xuXG5cdFx0XHRcdGlmIChhW25dKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFbbl07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKHZhciBpID0gbjsgaSA+IDE7IGktLSkge1xuXHRcdFx0XHRcdHMgKj0gaTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFbbl0gPSBzO1xuXHRcdFx0XHRyZXR1cm4gcztcblxuXHRcdFx0fTtcblxuXHRcdH0pKCksXG5cblx0XHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAocDAsIHAxLCBwMiwgcDMsIHQpIHtcblxuXHRcdFx0dmFyIHYwID0gKHAyIC0gcDApICogMC41O1xuXHRcdFx0dmFyIHYxID0gKHAzIC0gcDEpICogMC41O1xuXHRcdFx0dmFyIHQyID0gdCAqIHQ7XG5cdFx0XHR2YXIgdDMgPSB0ICogdDI7XG5cblx0XHRcdHJldHVybiAoMiAqIHAxIC0gMiAqIHAyICsgdjAgKyB2MSkgKiB0MyArICgtIDMgKiBwMSArIDMgKiBwMiAtIDIgKiB2MCAtIHYxKSAqIHQyICsgdjAgKiB0ICsgcDE7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBUV0VFTjtcbiIsImltcG9ydCBUd2VlbiBmcm9tIFwiLi9Ud2VlblwiO1xuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiDorr7nva4gQW5pbWF0aW9uRnJhbWUgYmVnaW5cbiAqL1xudmFyIGxhc3RUaW1lID0gMDtcbnZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbmZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xufTtcbmlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbn07XG5pZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgfTtcbn07XG5cbi8v566h55CG5omA5pyJ5Zu+6KGo55qE5riy5p+T5Lu75YqhXG52YXIgX3Rhc2tMaXN0ID0gW107IC8vW3sgaWQgOiB0YXNrOiB9Li4uXVxudmFyIF9yZXF1ZXN0QWlkID0gbnVsbDtcblxuZnVuY3Rpb24gZW5hYmxlZEFuaW1hdGlvbkZyYW1lKCl7XG4gICAgaWYgKCFfcmVxdWVzdEFpZCkge1xuICAgICAgICBfcmVxdWVzdEFpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJmcmFtZV9fXCIgKyBfdGFza0xpc3QubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vaWYgKCBUd2Vlbi5nZXRBbGwoKS5sZW5ndGggKSB7XG4gICAgICAgICAgICBUd2Vlbi51cGRhdGUoKTsgLy90d2VlbuiHquW3seS8muWBmmxlbmd0aOWIpOaWrVxuICAgICAgICAgICAgLy99O1xuICAgICAgICAgICAgdmFyIGN1cnJUYXNrTGlzdCA9IF90YXNrTGlzdDtcbiAgICAgICAgICAgIF90YXNrTGlzdCA9IFtdO1xuICAgICAgICAgICAgX3JlcXVlc3RBaWQgPSBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJUYXNrTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY3VyclRhc2tMaXN0LnNoaWZ0KCkudGFzaygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gX3JlcXVlc3RBaWQ7XG59OyBcblxuLypcbiAqIEBwYXJhbSB0YXNrIOimgeWKoOWFpeWIsOa4suafk+W4p+mYn+WIl+S4reeahOS7u+WKoVxuICogQHJlc3VsdCBmcmFtZWlkXG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdEZyYW1lKCAkZnJhbWUgKSB7XG4gICAgaWYgKCEkZnJhbWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG4gICAgX3Rhc2tMaXN0LnB1c2goJGZyYW1lKTtcbiAgICByZXR1cm4gZW5hYmxlZEFuaW1hdGlvbkZyYW1lKCk7XG59O1xuXG4vKlxuICogIEBwYXJhbSB0YXNrIOimgeS7jua4suafk+W4p+mYn+WIl+S4reWIoOmZpOeahOS7u+WKoVxuICovXG5mdW5jdGlvbiBkZXN0cm95RnJhbWUoICRmcmFtZSApIHtcbiAgICB2YXIgZF9yZXN1bHQgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IF90YXNrTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKF90YXNrTGlzdFtpXS5pZCA9PT0gJGZyYW1lLmlkKSB7XG4gICAgICAgICAgICBkX3Jlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICBfdGFza0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgbC0tO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgaWYgKF90YXNrTGlzdC5sZW5ndGggPT0gMCkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShfcmVxdWVzdEFpZCk7XG4gICAgICAgIF9yZXF1ZXN0QWlkID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBkX3Jlc3VsdDtcbn07XG5cblxuLyogXG4gKiBAcGFyYW0gb3B0IHtmcm9tICwgdG8gLCBvblVwZGF0ZSAsIG9uQ29tcGxldGUgLCAuLi4uLi59XG4gKiBAcmVzdWx0IHR3ZWVuXG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdFR3ZWVuKG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0ID0gXy5leHRlbmQoe1xuICAgICAgICBmcm9tOiBudWxsLFxuICAgICAgICB0bzogbnVsbCxcbiAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKXt9LFxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgb25TdG9wOiBmdW5jdGlvbigpe30sXG4gICAgICAgIHJlcGVhdDogMCxcbiAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgIGVhc2luZzogJ0xpbmVhci5Ob25lJyxcbiAgICAgICAgZGVzYzogJycgLy/liqjnlLvmj4/ov7DvvIzmlrnkvr/mn6Xmib5idWdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciB0d2VlbiA9IHt9O1xuICAgIHZhciB0aWQgPSBcInR3ZWVuX1wiICsgQmFzZS5nZXRVSUQoKTtcbiAgICBvcHQuaWQgJiYgKCB0aWQgPSB0aWQrXCJfXCIrb3B0LmlkICk7XG5cbiAgICBpZiAob3B0LmZyb20gJiYgb3B0LnRvKSB7XG4gICAgICAgIHR3ZWVuID0gbmV3IFR3ZWVuLlR3ZWVuKCBvcHQuZnJvbSApXG4gICAgICAgIC50byggb3B0LnRvLCBvcHQuZHVyYXRpb24gKVxuICAgICAgICAub25TdGFydChmdW5jdGlvbigpe1xuICAgICAgICAgICAgb3B0Lm9uU3RhcnQuYXBwbHkoIHRoaXMgKVxuICAgICAgICB9KVxuICAgICAgICAub25VcGRhdGUoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvcHQub25VcGRhdGUuYXBwbHkoIHRoaXMgKTtcbiAgICAgICAgfSApXG4gICAgICAgIC5vbkNvbXBsZXRlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlc3Ryb3lGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0d2Vlbi5faXNDb21wbGV0ZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9wdC5vbkNvbXBsZXRlLmFwcGx5KCB0aGlzICwgW3RoaXNdICk7IC8v5omn6KGM55So5oi355qEY29uQ29tcGxldGVcbiAgICAgICAgfSApXG4gICAgICAgIC5vblN0b3AoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBkZXN0cm95RnJhbWUoe1xuICAgICAgICAgICAgICAgIGlkOiB0aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHdlZW4uX2lzU3RvcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9wdC5vblN0b3AuYXBwbHkoIHRoaXMgLCBbdGhpc10gKTtcbiAgICAgICAgfSApXG4gICAgICAgIC5yZXBlYXQoIG9wdC5yZXBlYXQgKVxuICAgICAgICAuZGVsYXkoIG9wdC5kZWxheSApXG4gICAgICAgIC5lYXNpbmcoIFR3ZWVuLkVhc2luZ1tvcHQuZWFzaW5nLnNwbGl0KFwiLlwiKVswXV1bb3B0LmVhc2luZy5zcGxpdChcIi5cIilbMV1dIClcbiAgICAgICAgXG4gICAgICAgIHR3ZWVuLmlkID0gdGlkO1xuICAgICAgICB0d2Vlbi5zdGFydCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG5cbiAgICAgICAgICAgIGlmICggdHdlZW4uX2lzQ29tcGxldGVlZCB8fCB0d2Vlbi5faXNTdG9wZWQgKSB7XG4gICAgICAgICAgICAgICAgdHdlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWdpc3RGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZCxcbiAgICAgICAgICAgICAgICB0YXNrOiBhbmltYXRlLFxuICAgICAgICAgICAgICAgIGRlc2M6IG9wdC5kZXNjLFxuICAgICAgICAgICAgICAgIHR3ZWVuOiB0d2VlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGFuaW1hdGUoKTtcblxuICAgIH07XG4gICAgcmV0dXJuIHR3ZWVuO1xufTtcbi8qXG4gKiBAcGFyYW0gdHdlZW5cbiAqIEByZXN1bHQgdm9pZCgwKVxuICovXG5mdW5jdGlvbiBkZXN0cm95VHdlZW4odHdlZW4gLCBtc2cpIHtcbiAgICB0d2Vlbi5zdG9wKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVnaXN0RnJhbWU6IHJlZ2lzdEZyYW1lLFxuICAgIGRlc3Ryb3lGcmFtZTogZGVzdHJveUZyYW1lLFxuICAgIHJlZ2lzdFR3ZWVuOiByZWdpc3RUd2VlbixcbiAgICBkZXN0cm95VHdlZW46IGRlc3Ryb3lUd2VlblxufTsiLCIvKipcbiAqIFBvaW50XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LHkpe1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGg9PTEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PSAnb2JqZWN0JyApe1xuICAgICAgIHZhciBhcmc9YXJndW1lbnRzWzBdXG4gICAgICAgaWYoIFwieFwiIGluIGFyZyAmJiBcInlcIiBpbiBhcmcgKXtcbiAgICAgICAgICB0aGlzLnggPSBhcmcueCoxO1xuICAgICAgICAgIHRoaXMueSA9IGFyZy55KjE7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaT0wO1xuICAgICAgICAgIGZvciAodmFyIHAgaW4gYXJnKXtcbiAgICAgICAgICAgICAgaWYoaT09MCl7XG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJnW3BdKjE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy55ID0gYXJnW3BdKjE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB4IHx8ICh4PTApO1xuICAgIHkgfHwgKHk9MCk7XG4gICAgdGhpcy54ID0geCoxO1xuICAgIHRoaXMueSA9IHkqMTtcbn07XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIGNhbnZhcyDkuIrlp5TmiZjnmoTkuovku7bnrqHnkIZcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBCYXNlIGZyb20gXCIuLi9jb3JlL0Jhc2VcIjtcblxudmFyIENhbnZheEV2ZW50ID0gZnVuY3Rpb24oIGV2dCAsIHBhcmFtcyApIHtcblx0XG5cdHZhciBldmVudFR5cGUgPSBcIkNhbnZheEV2ZW50XCI7IFxuICAgIGlmKCBfLmlzU3RyaW5nKCBldnQgKSApe1xuICAgIFx0ZXZlbnRUeXBlID0gZXZ0O1xuICAgIH07XG4gICAgaWYoIF8uaXNPYmplY3QoIGV2dCApICYmIGV2dC50eXBlICl7XG4gICAgXHRldmVudFR5cGUgPSBldnQudHlwZTtcbiAgICB9O1xuXG4gICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XHRcbiAgICB0aGlzLnR5cGUgICA9IGV2ZW50VHlwZTtcbiAgICB0aGlzLnBvaW50ICA9IG51bGw7XG5cbiAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb24gPSBmYWxzZSA7IC8v6buY6K6k5LiN6Zi75q2i5LqL5Lu25YaS5rOhXG59XG5DYW52YXhFdmVudC5wcm90b3R5cGUgPSB7XG4gICAgc3RvcFByb3BhZ2F0aW9uIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ2FudmF4RXZlbnQ7IiwiaW1wb3J0IF8gZnJvbSBcIi4vdW5kZXJzY29yZVwiO1xuXG52YXIgYWRkT3JSbW92ZUV2ZW50SGFuZCA9IGZ1bmN0aW9uKCBkb21IYW5kICwgaWVIYW5kICl7XG4gICAgaWYoIGRvY3VtZW50WyBkb21IYW5kIF0gKXtcbiAgICAgICAgZnVuY3Rpb24gZXZlbnREb21GbiggZWwgLCB0eXBlICwgZm4gKXtcbiAgICAgICAgICAgIGlmKCBlbC5sZW5ndGggKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MCA7IGkgPCBlbC5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBldmVudERvbUZuKCBlbFtpXSAsIHR5cGUgLCBmbiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxbIGRvbUhhbmQgXSggdHlwZSAsIGZuICwgZmFsc2UgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGV2ZW50RG9tRm5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jdGlvbiBldmVudEZuKCBlbCAsIHR5cGUgLCBmbiApe1xuICAgICAgICAgICAgaWYoIGVsLmxlbmd0aCApe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wIDsgaSA8IGVsLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4oIGVsW2ldLHR5cGUsZm4gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsWyBpZUhhbmQgXSggXCJvblwiK3R5cGUgLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCggZWwgLCB3aW5kb3cuZXZlbnQgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGV2ZW50Rm5cbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gZG9t5pON5L2c55u45YWz5Luj56CBXG4gICAgcXVlcnkgOiBmdW5jdGlvbihlbCl7XG4gICAgICAgIGlmKF8uaXNTdHJpbmcoZWwpKXtcbiAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsKVxuICAgICAgICB9XG4gICAgICAgIGlmKGVsLm5vZGVUeXBlID09IDEpe1xuICAgICAgICAgICAvL+WImeS4uuS4gOS4qmVsZW1lbnTmnKzouqtcbiAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH1cbiAgICAgICAgaWYoZWwubGVuZ3RoKXtcbiAgICAgICAgICAgcmV0dXJuIGVsWzBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBvZmZzZXQgOiBmdW5jdGlvbihlbCl7XG4gICAgICAgIHZhciBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgXG4gICAgICAgIGRvYyA9IGVsLm93bmVyRG9jdW1lbnQsIFxuICAgICAgICBib2R5ID0gZG9jLmJvZHksIFxuICAgICAgICBkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudCwgXG5cbiAgICAgICAgLy8gZm9yIGllICBcbiAgICAgICAgY2xpZW50VG9wID0gZG9jRWxlbS5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMCwgXG4gICAgICAgIGNsaWVudExlZnQgPSBkb2NFbGVtLmNsaWVudExlZnQgfHwgYm9keS5jbGllbnRMZWZ0IHx8IDAsIFxuXG4gICAgICAgIC8vIEluIEludGVybmV0IEV4cGxvcmVyIDcgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHByb3BlcnR5IGlzIHRyZWF0ZWQgYXMgcGh5c2ljYWwsIFxuICAgICAgICAvLyB3aGlsZSBvdGhlcnMgYXJlIGxvZ2ljYWwuIE1ha2UgYWxsIGxvZ2ljYWwsIGxpa2UgaW4gSUU4LiBcbiAgICAgICAgem9vbSA9IDE7IFxuICAgICAgICBpZiAoYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHsgXG4gICAgICAgICAgICB2YXIgYm91bmQgPSBib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyBcbiAgICAgICAgICAgIHpvb20gPSAoYm91bmQucmlnaHQgLSBib3VuZC5sZWZ0KS9ib2R5LmNsaWVudFdpZHRoOyBcbiAgICAgICAgfSBcbiAgICAgICAgaWYgKHpvb20gPiAxKXsgXG4gICAgICAgICAgICBjbGllbnRUb3AgPSAwOyBcbiAgICAgICAgICAgIGNsaWVudExlZnQgPSAwOyBcbiAgICAgICAgfSBcbiAgICAgICAgdmFyIHRvcCA9IGJveC50b3Avem9vbSArICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jRWxlbSAmJiBkb2NFbGVtLnNjcm9sbFRvcC96b29tIHx8IGJvZHkuc2Nyb2xsVG9wL3pvb20pIC0gY2xpZW50VG9wLCBcbiAgICAgICAgICAgIGxlZnQgPSBib3gubGVmdC96b29tICsgKHdpbmRvdy5wYWdlWE9mZnNldHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5zY3JvbGxMZWZ0L3pvb20gfHwgYm9keS5zY3JvbGxMZWZ0L3pvb20pIC0gY2xpZW50TGVmdDsgXG5cbiAgICAgICAgcmV0dXJuIHsgXG4gICAgICAgICAgICB0b3A6IHRvcCwgXG4gICAgICAgICAgICBsZWZ0OiBsZWZ0IFxuICAgICAgICB9OyBcbiAgICB9LFxuICAgIGFkZEV2ZW50IDogYWRkT3JSbW92ZUV2ZW50SGFuZCggXCJhZGRFdmVudExpc3RlbmVyXCIgLCBcImF0dGFjaEV2ZW50XCIgKSxcbiAgICByZW1vdmVFdmVudCA6IGFkZE9yUm1vdmVFdmVudEhhbmQoIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiICwgXCJkZXRhY2hFdmVudFwiICksXG4gICAgcGFnZVg6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGFnZVgpIHJldHVybiBlLnBhZ2VYO1xuICAgICAgICBlbHNlIGlmIChlLmNsaWVudFgpXG4gICAgICAgICAgICByZXR1cm4gZS5jbGllbnRYICsgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0ID9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgOiBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpO1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcGFnZVk6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGFnZVkpIHJldHVybiBlLnBhZ2VZO1xuICAgICAgICBlbHNlIGlmIChlLmNsaWVudFkpXG4gICAgICAgICAgICByZXR1cm4gZS5jbGllbnRZICsgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgP1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIDogZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApO1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvL2RvbeebuOWFs+S7o+eggee7k+adn1xufTsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKi9cbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vZGlzcGxheS9Qb2ludFwiO1xuaW1wb3J0IENhbnZheEV2ZW50IGZyb20gXCIuL0NhbnZheEV2ZW50XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0ICQgZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuXG52YXIgX21vdXNlRXZlbnRUeXBlcyA9IFtcImNsaWNrXCIsXCJkYmxjbGlja1wiLFwibW91c2Vkb3duXCIsXCJtb3VzZW1vdmVcIixcIm1vdXNldXBcIixcIm1vdXNlb3V0XCJdO1xudmFyIF9oYW1tZXJFdmVudFR5cGVzID0gWyBcbiAgICBcInBhblwiLFwicGFuc3RhcnRcIixcInBhbm1vdmVcIixcInBhbmVuZFwiLFwicGFuY2FuY2VsXCIsXCJwYW5sZWZ0XCIsXCJwYW5yaWdodFwiLFwicGFudXBcIixcInBhbmRvd25cIixcbiAgICBcInByZXNzXCIgLCBcInByZXNzdXBcIixcbiAgICBcInN3aXBlXCIgLCBcInN3aXBlbGVmdFwiICwgXCJzd2lwZXJpZ2h0XCIgLCBcInN3aXBldXBcIiAsIFwic3dpcGVkb3duXCIsXG4gICAgXCJ0YXBcIlxuXTtcblxudmFyIEV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGNhbnZheCAsIG9wdCkge1xuICAgIHRoaXMuY2FudmF4ID0gY2FudmF4O1xuXG4gICAgdGhpcy5jdXJQb2ludHMgPSBbbmV3IFBvaW50KDAsIDApXSAvL1gsWSDnmoQgcG9pbnQg6ZuG5ZCILCDlnKh0b3VjaOS4i+mdouWImeS4uiB0b3VjaOeahOmbhuWQiO+8jOWPquaYr+i/meS4qnRvdWNo6KKr5re75Yqg5LqG5a+55bqU55qEeO+8jHlcbiAgICAvL+W9k+WJjea/gOa0u+eahOeCueWvueW6lOeahG9iau+8jOWcqHRvdWNo5LiL5Y+v5Lul5piv5Liq5pWw57uELOWSjOS4iumdoueahCBjdXJQb2ludHMg5a+55bqUXG4gICAgdGhpcy5jdXJQb2ludHNUYXJnZXQgPSBbXTtcblxuICAgIHRoaXMuX3RvdWNoaW5nID0gZmFsc2U7XG4gICAgLy/mraPlnKjmi5bliqjvvIzliY3mj5DmmK9fdG91Y2hpbmc9dHJ1ZVxuICAgIHRoaXMuX2RyYWdpbmcgPSBmYWxzZTtcblxuICAgIC8v5b2T5YmN55qE6byg5qCH54q25oCBXG4gICAgdGhpcy5fY3Vyc29yID0gXCJkZWZhdWx0XCI7XG5cbiAgICB0aGlzLnRhcmdldCA9IHRoaXMuY2FudmF4LmVsO1xuICAgIHRoaXMudHlwZXMgPSBbXTtcblxuICAgIC8vbW91c2XkvZPnu5/kuK3kuI3pnIDopoHphY3nva5kcmFnLHRvdWNo5Lit5Lya55So5Yiw56ys5LiJ5pa555qEdG91Y2jlupPvvIzmr4/kuKrlupPnmoTkuovku7blkI3np7Dlj6/og73kuI3kuIDmoLfvvIxcbiAgICAvL+Wwseimgei/memHjOmFjee9ru+8jOm7mOiupOWunueOsOeahOaYr2hhbW1lcmpz55qELOaJgOS7pem7mOiupOWPr+S7peWcqOmhueebrumHjOW8leWFpWhhbW1lcmpzIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gICAgdGhpcy5kcmFnID0ge1xuICAgICAgICBzdGFydCA6IFwicGFuc3RhcnRcIixcbiAgICAgICAgbW92ZSA6IFwicGFubW92ZVwiLFxuICAgICAgICBlbmQgOiBcInBhbmVuZFwiXG4gICAgfTtcblxuICAgIF8uZXh0ZW5kKCB0cnVlICwgdGhpcyAsIG9wdCApO1xuXG59O1xuXG4vL+i/meagt+eahOWlveWkhOaYr2RvY3VtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9u5Y+q5Lya5Zyo5a6a5LmJ55qE5pe25YCZ5omn6KGM5LiA5qyh44CCXG52YXIgY29udGFpbnMgPSBkb2N1bWVudC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiA/IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhIShwYXJlbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb24oY2hpbGQpICYgMTYpO1xufSA6IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZCAhPT0gY2hpbGQgJiYgKHBhcmVudC5jb250YWlucyA/IHBhcmVudC5jb250YWlucyhjaGlsZCkgOiB0cnVlKTtcbn07XG5cbkV2ZW50SGFuZGxlci5wcm90b3R5cGUgPSB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICAvL+S+neasoea3u+WKoOS4iua1j+iniOWZqOeahOiHquW4puS6i+S7tuS+puWQrFxuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAvL+WmguaenHRhcmdldC5ub2RlVHlwZeayoeacieeahOivne+8jCDor7TmmI7or6V0YXJnZXTkuLrkuIDkuKpqUXVlcnnlr7nosaEgb3Iga2lzc3kg5a+56LGhb3IgaGFtbWVy5a+56LGhXG4gICAgICAgICAgICAvL+WNs+S4uuesrOS4ieaWueW6k++8jOmCo+S5iOWwseimgeWvueaOpeesrOS4ieaWueW6k+eahOS6i+S7tuezu+e7n+OAgum7mOiupOWunueOsGhhbW1lcueahOWkp+mDqOWIhuS6i+S7tuezu+e7n1xuICAgICAgICAgICAgaWYoICFtZS50eXBlcyB8fCBtZS50eXBlcy5sZW5ndGggPT0gMCAgKXtcbiAgICAgICAgICAgICAgICBtZS50eXBlcyA9IF9oYW1tZXJFdmVudFR5cGVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gMSApe1xuICAgICAgICAgICAgbWUudHlwZXMgPSBfbW91c2VFdmVudFR5cGVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIF8uZWFjaCggbWUudHlwZXMgLCBmdW5jdGlvbiggdHlwZSApe1xuICAgICAgICAgICAgLy/kuI3lho3lhbPlv4PmtY/op4jlmajnjq/looPmmK/lkKYgJ29udG91Y2hzdGFydCcgaW4gd2luZG93IFxuICAgICAgICAgICAgLy/ogIzmmK/nm7TmjqXlj6rnrqHkvKDnu5nkuovku7bmqKHlnZfnmoTmmK/kuIDkuKrljp/nlJ9kb23ov5jmmK8ganHlr7nosaEgb3IgaGFtbWVy5a+56LGh562JXG4gICAgICAgICAgICBpZiggbWUudGFyZ2V0Lm5vZGVUeXBlID09IDEgKXtcbiAgICAgICAgICAgICAgICAkLmFkZEV2ZW50KCBtZS50YXJnZXQgLCB0eXBlICwgZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgbWUuX19tb3VzZUhhbmRsZXIoIGUgKTtcbiAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLnRhcmdldC5vbiggdHlwZSAsIGZ1bmN0aW9uKCBlICl7XG4gICAgICAgICAgICAgICAgICAgIG1lLl9fbGliSGFuZGxlciggZSApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSApO1xuICAgIH0sXG4gICAgLypcbiAgICAqIOWOn+eUn+S6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWJlZ2luXG4gICAgKiDpvKDmoIfkuovku7blpITnkIblh73mlbBcbiAgICAqKi9cbiAgICBfX21vdXNlSGFuZGxlciA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG5cbiAgICAgICAgcm9vdC51cGRhdGVSb290T2Zmc2V0KCk7XG4gICAgXG4gICAgICAgIG1lLmN1clBvaW50cyA9IFsgbmV3IFBvaW50KCBcbiAgICAgICAgICAgICQucGFnZVgoIGUgKSAtIHJvb3Qucm9vdE9mZnNldC5sZWZ0ICwgXG4gICAgICAgICAgICAkLnBhZ2VZKCBlICkgLSByb290LnJvb3RPZmZzZXQudG9wXG4gICAgICAgICldO1xuXG4gICAgICAgIC8v55CG6K665LiK5p2l6K+077yM6L+Z6YeM5ou/5YiwcG9pbnTkuoblkI7vvIzlsLHopoHorqHnrpfov5nkuKpwb2ludOWvueW6lOeahHRhcmdldOadpXB1c2jliLBjdXJQb2ludHNUYXJnZXTph4zvvIxcbiAgICAgICAgLy/kvYbmmK/lm6DkuLrlnKhkcmFn55qE5pe25YCZ5YW25a6e5piv5Y+v5Lul5LiN55So6K6h566X5a+55bqUdGFyZ2V055qE44CCXG4gICAgICAgIC8v5omA5Lul5pS+5Zyo5LqG5LiL6Z2i55qEbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoIGUgLCBjdXJNb3VzZVBvaW50ICk75bi46KeEbW91c2Vtb3Zl5Lit5omn6KGMXG5cbiAgICAgICAgdmFyIGN1ck1vdXNlUG9pbnQgID0gbWUuY3VyUG9pbnRzWzBdOyBcbiAgICAgICAgdmFyIGN1ck1vdXNlVGFyZ2V0ID0gbWUuY3VyUG9pbnRzVGFyZ2V0WzBdO1xuXG4gICAgICAgIC8v5qih5oufZHJhZyxtb3VzZW92ZXIsbW91c2VvdXQg6YOo5YiG5Luj56CBIGJlZ2luLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vbW91c2Vkb3du55qE5pe25YCZIOWmguaenCBjdXJNb3VzZVRhcmdldC5kcmFnRW5hYmxlZCDkuLp0cnVl44CC5bCx6KaB5byA5aeL5YeG5aSHZHJhZ+S6hlxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2Vkb3duXCIgKXtcbiAgICAgICAgICAgLy/lpoLmnpxjdXJUYXJnZXQg55qE5pWw57uE5Li656m65oiW6ICF56ys5LiA5Liq5Li6ZmFsc2Ug77yM77yM77yMXG4gICAgICAgICAgIGlmKCAhY3VyTW91c2VUYXJnZXQgKXtcbiAgICAgICAgICAgICB2YXIgb2JqID0gcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggY3VyTW91c2VQb2ludCAsIDEpWzBdO1xuICAgICAgICAgICAgIGlmKG9iail7XG4gICAgICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXQgPSBbIG9iaiBdO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfTtcbiAgICAgICAgICAgY3VyTW91c2VUYXJnZXQgPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG4gICAgICAgICAgIGlmICggY3VyTW91c2VUYXJnZXQgJiYgY3VyTW91c2VUYXJnZXQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgIC8v6byg5qCH5LqL5Lu25bey57uP5pG45Yiw5LqG5LiA5LiqXG4gICAgICAgICAgICAgICBtZS5fdG91Y2hpbmcgPSB0cnVlO1xuICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZXVwXCIgfHwgKGUudHlwZSA9PSBcIm1vdXNlb3V0XCIgJiYgIWNvbnRhaW5zKHJvb3QuZWwgLCAoZS50b0VsZW1lbnQgfHwgZS5yZWxhdGVkVGFyZ2V0KSApKSApe1xuICAgICAgICAgICAgaWYobWUuX2RyYWdpbmcgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgLy/or7TmmI7liJrliJrlnKjmi5bliqhcbiAgICAgICAgICAgICAgICBtZS5fZHJhZ0VuZCggZSAsIGN1ck1vdXNlVGFyZ2V0ICwgMCApO1xuICAgICAgICAgICAgICAgIGN1ck1vdXNlVGFyZ2V0LmZpcmUoXCJkcmFnZW5kXCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lLl9kcmFnaW5nICA9IGZhbHNlO1xuICAgICAgICAgICAgbWUuX3RvdWNoaW5nID0gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNlb3V0XCIgKXtcbiAgICAgICAgICAgIGlmKCAhY29udGFpbnMocm9vdC5lbCAsIChlLnRvRWxlbWVudCB8fCBlLnJlbGF0ZWRUYXJnZXQpICkgKXtcbiAgICAgICAgICAgICAgICBtZS5fX2dldGN1clBvaW50c1RhcmdldChlICwgY3VyTW91c2VQb2ludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggZS50eXBlID09IFwibW91c2Vtb3ZlXCIgKXsgIC8vfHwgZS50eXBlID09IFwibW91c2Vkb3duXCIgKXtcbiAgICAgICAgICAgIC8v5ouW5Yqo6L+H56iL5Lit5bCx5LiN5Zyo5YGa5YW25LuW55qEbW91c2VvdmVy5qOA5rWL77yMZHJhZ+S8mOWFiFxuICAgICAgICAgICAgaWYobWUuX3RvdWNoaW5nICYmIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICYmIGN1ck1vdXNlVGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuato+WcqOaLluWKqOWVilxuICAgICAgICAgICAgICAgIGlmKCFtZS5fZHJhZ2luZyl7XG4gICAgICAgICAgICAgICAgICAgIC8vYmVnaW4gZHJhZ1xuICAgICAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5maXJlKFwiZHJhZ3N0YXJ0XCIpO1xuICAgICAgICAgICAgICAgICAgICAvL+WFiOaKiuacrOWwiue7memakOiXj+S6hlxuICAgICAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5jb250ZXh0Lmdsb2JhbEFscGhhID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7lhYvpmobkuIDkuKrlia/mnKzliLBhY3RpdmVTdGFnZVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lT2JqZWN0ID0gbWUuX2Nsb25lMmhvdmVyU3RhZ2UoIGN1ck1vdXNlVGFyZ2V0ICwgMCApO1xuICAgICAgICAgICAgICAgICAgICBjbG9uZU9iamVjdC5jb250ZXh0Lmdsb2JhbEFscGhhID0gY3VyTW91c2VUYXJnZXQuX2dsb2JhbEFscGhhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZHJhZyBtb3ZlIGluZ1xuICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ01vdmVIYW5kZXIoIGUgLCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/luLjop4Rtb3VzZW1vdmXmo4DmtYtcbiAgICAgICAgICAgICAgICAvL21vdmXkuovku7bkuK3vvIzpnIDopoHkuI3lgZznmoTmkJzntKJ0YXJnZXTvvIzov5nkuKrlvIDplIDmjLrlpKfvvIxcbiAgICAgICAgICAgICAgICAvL+WQjue7reWPr+S7peS8mOWMlu+8jOWKoOS4iuWSjOW4p+eOh+ebuOW9k+eahOW7tui/n+WkhOeQhlxuICAgICAgICAgICAgICAgIG1lLl9fZ2V0Y3VyUG9pbnRzVGFyZ2V0KCBlICwgY3VyTW91c2VQb2ludCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WFtuS7lueahOS6i+S7tuWwseebtOaOpeWcqHRhcmdldOS4iumdoua0vuWPkeS6i+S7tlxuICAgICAgICAgICAgdmFyIGNoaWxkID0gY3VyTW91c2VUYXJnZXQ7XG4gICAgICAgICAgICBpZiggIWNoaWxkICl7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSByb290O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lLl9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzKCBlICwgWyBjaGlsZCBdICk7XG4gICAgICAgICAgICBtZS5fY3Vyc29ySGFuZGVyKCBjaGlsZCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCByb290LnByZXZlbnREZWZhdWx0ICkge1xuICAgICAgICAgICAgLy/pmLvmraLpu5jorqTmtY/op4jlmajliqjkvZwoVzNDKSBcbiAgICAgICAgICAgIGlmICggZSAmJiBlLnByZXZlbnREZWZhdWx0ICkge1xuICAgICAgICAgICAgICAgwqBlLnByZXZlbnREZWZhdWx0KCk7IFxuICAgICAgICAgICAgfcKgZWxzZSB7XG4gICAgICAgICAgICDCoMKgwqDCoHdpbmRvdy5ldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9OyBcbiAgICB9LFxuICAgIF9fZ2V0Y3VyUG9pbnRzVGFyZ2V0IDogZnVuY3Rpb24oZSAsIHBvaW50ICkge1xuICAgICAgICB2YXIgbWUgICAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgICA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIG9sZE9iaiA9IG1lLmN1clBvaW50c1RhcmdldFswXTtcblxuICAgICAgICBpZiggb2xkT2JqICYmICFvbGRPYmouY29udGV4dCApe1xuICAgICAgICAgICAgb2xkT2JqID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZSA9IG5ldyBDYW52YXhFdmVudCggZSApO1xuXG4gICAgICAgIGlmKCBlLnR5cGU9PVwibW91c2Vtb3ZlXCJcbiAgICAgICAgICAgICYmIG9sZE9iaiAmJiBvbGRPYmouX2hvdmVyQ2xhc3MgJiYgb2xkT2JqLnBvaW50Q2hrUHJpb3JpdHlcbiAgICAgICAgICAgICYmIG9sZE9iai5nZXRDaGlsZEluUG9pbnQoIHBvaW50ICkgKXtcbiAgICAgICAgICAgIC8v5bCP5LyY5YyWLOm8oOagh21vdmXnmoTml7blgJnjgILorqHnrpfpopHnjoflpKrlpKfvvIzmiYDku6XjgILlgZrmraTkvJjljJZcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJdGFyZ2V05a2Y5Zyo77yM6ICM5LiU5b2T5YmN5YWD57Sg5q2j5ZyoaG92ZXJTdGFnZeS4re+8jOiAjOS4lOW9k+WJjem8oOagh+i/mOWcqHRhcmdldOWGhSzlsLHmsqHlv4XopoHlj5bmo4DmtYvmlbTkuKpkaXNwbGF5TGlzdOS6hlxuICAgICAgICAgICAgLy/lvIDlj5HmtL7lj5HluLjop4Rtb3VzZW1vdmXkuovku7ZcbiAgICAgICAgICAgIGUudGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgZS5wb2ludCAgPSBvbGRPYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgIG9sZE9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvYmogPSByb290LmdldE9iamVjdHNVbmRlclBvaW50KCBwb2ludCAsIDEpWzBdO1xuXG4gICAgICAgIGlmKG9sZE9iaiAmJiBvbGRPYmogIT0gb2JqIHx8IGUudHlwZT09XCJtb3VzZW91dFwiKSB7XG4gICAgICAgICAgICBpZiggb2xkT2JqICYmIG9sZE9iai5jb250ZXh0ICl7XG4gICAgICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0WzBdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBlLnR5cGUgICAgID0gXCJtb3VzZW91dFwiO1xuICAgICAgICAgICAgICAgIGUudG9UYXJnZXQgPSBvYmo7IFxuICAgICAgICAgICAgICAgIGUudGFyZ2V0ICAgPSBlLmN1cnJlbnRUYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICAgICAgZS5wb2ludCAgICA9IG9sZE9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgICAgIG9sZE9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIG9iaiAmJiBvbGRPYmogIT0gb2JqICl7IC8vJiYgb2JqLl9ob3ZlcmFibGUg5bey57uPIOW5suaOieS6hlxuICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0WzBdID0gb2JqO1xuICAgICAgICAgICAgZS50eXBlICAgICAgID0gXCJtb3VzZW92ZXJcIjtcbiAgICAgICAgICAgIGUuZnJvbVRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUudGFyZ2V0ICAgICA9IGUuY3VycmVudFRhcmdldCA9IG9iajtcbiAgICAgICAgICAgIGUucG9pbnQgICAgICA9IG9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgb2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2Vtb3ZlXCIgJiYgb2JqICl7XG4gICAgICAgICAgICBlLnRhcmdldCA9IGUuY3VycmVudFRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUucG9pbnQgID0gb2xkT2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICB9O1xuICAgICAgICBtZS5fY3Vyc29ySGFuZGVyKCBvYmogLCBvbGRPYmogKTtcbiAgICB9LFxuICAgIF9jdXJzb3JIYW5kZXIgICAgOiBmdW5jdGlvbiggb2JqICwgb2xkT2JqICl7XG4gICAgICAgIGlmKCFvYmogJiYgIW9sZE9iaiApe1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmogJiYgb2xkT2JqICE9IG9iaiAmJiBvYmouY29udGV4dCl7XG4gICAgICAgICAgICB0aGlzLl9zZXRDdXJzb3Iob2JqLmNvbnRleHQuY3Vyc29yKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX3NldEN1cnNvciA6IGZ1bmN0aW9uKGN1cnNvcikge1xuICAgICAgICBpZih0aGlzLl9jdXJzb3IgPT0gY3Vyc29yKXtcbiAgICAgICAgICAvL+WmguaenOS4pOasoeimgeiuvue9rueahOm8oOagh+eKtuaAgeaYr+S4gOagt+eahFxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXguZWwuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xuICAgICAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgfSxcbiAgICAvKlxuICAgICog5Y6f55Sf5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZW5kXG4gICAgKi9cblxuICAgIC8qXG4gICAgICrnrKzkuInmlrnlupPnmoTkuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICAq6Kem5bGP5LqL5Lu25aSE55CG5Ye95pWwXG4gICAgICogKi9cbiAgICBfX2xpYkhhbmRsZXIgOiBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgdmFyIG1lICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgcm9vdC51cGRhdGVSb290T2Zmc2V0KCk7XG4gICAgICAgIC8vIHRvdWNoIOS4i+eahCBjdXJQb2ludHNUYXJnZXQg5LuOdG91Y2hlc+S4readpVxuICAgICAgICAvL+iOt+WPlmNhbnZheOWdkOagh+ezu+e7n+mHjOmdoueahOWdkOagh1xuICAgICAgICBtZS5jdXJQb2ludHMgPSBtZS5fX2dldENhbnZheFBvaW50SW5Ub3VjaHMoIGUgKTtcbiAgICAgICAgaWYoICFtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgLy/lpoLmnpzlnKhkcmFnaW5n55qE6K+d77yMdGFyZ2V05bey57uP5piv6YCJ5Lit5LqG55qE77yM5Y+v5Lul5LiN55SoIOajgOa1i+S6hlxuICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0ID0gbWUuX19nZXRDaGlsZEluVG91Y2hzKCBtZS5jdXJQb2ludHMgKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIG1lLmN1clBvaW50c1RhcmdldC5sZW5ndGggPiAwICl7XG4gICAgICAgICAgICAvL2RyYWflvIDlp4tcbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5zdGFydCl7XG4gICAgICAgICAgICAgICAgLy9kcmFnc3RhcnTnmoTml7blgJl0b3VjaOW3sue7j+WHhuWkh+WlveS6hnRhcmdldO+8jCBjdXJQb2ludHNUYXJnZXQg6YeM6Z2i5Y+q6KaB5pyJ5LiA5Liq5piv5pyJ5pWI55qEXG4gICAgICAgICAgICAgICAgLy/lsLHorqTkuLpkcmFnc+W8gOWni1xuICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQgJiYgY2hpbGQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/lj6ropoHmnInkuIDkuKrlhYPntKDlsLHorqTkuLrmraPlnKjlh4blpIdkcmFn5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7lhYvpmobkuIDkuKrlia/mnKzliLBhY3RpdmVTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgICBtZS5fY2xvbmUyaG92ZXJTdGFnZSggY2hpbGQgLCBpICk7XG4gICAgICAgICAgICAgICAgICAgICAgIC8v5YWI5oqK5pys5bCK57uZ6ZqQ6JeP5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmZpcmUoXCJkcmFnc3RhcnRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApIFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9kcmFnSW5nXG4gICAgICAgICAgICBpZiggZS50eXBlID09IG1lLmRyYWcubW92ZSl7XG4gICAgICAgICAgICAgICAgaWYoIG1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkICYmIGNoaWxkLmRyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ01vdmVIYW5kZXIoIGUgLCBjaGlsZCAsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2RyYWfnu5PmnZ9cbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5lbmQpe1xuICAgICAgICAgICAgICAgIGlmKCBtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goIG1lLmN1clBvaW50c1RhcmdldCAsIGZ1bmN0aW9uKCBjaGlsZCAsIGkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZCAmJiBjaGlsZC5kcmFnRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnRW5kKCBlICwgY2hpbGQgLCAwICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZmlyZShcImRyYWdlbmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMoIGUgLCBtZS5jdXJQb2ludHNUYXJnZXQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5b2T5YmN5rKh5pyJ5LiA5LiqdGFyZ2V077yM5bCx5oqK5LqL5Lu25rS+5Y+R5YiwY2FudmF45LiK6Z2iXG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIFsgcm9vdCBdICk7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvL+S7jnRvdWNoc+S4reiOt+WPluWIsOWvueW6lHRvdWNoICwg5Zyo5LiK6Z2i5re75Yqg5LiKY2FudmF45Z2Q5qCH57O757uf55qEeO+8jHlcbiAgICBfX2dldENhbnZheFBvaW50SW5Ub3VjaHMgOiBmdW5jdGlvbiggZSApe1xuICAgICAgICB2YXIgbWUgICAgICAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgICAgICA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIGN1clRvdWNocyA9IFtdO1xuICAgICAgICBfLmVhY2goIGUucG9pbnQgLCBmdW5jdGlvbiggdG91Y2ggKXtcbiAgICAgICAgICAgdG91Y2gueCA9IHRvdWNoLnBhZ2VYIC0gcm9vdC5yb290T2Zmc2V0LmxlZnQgLCBcbiAgICAgICAgICAgdG91Y2gueSA9IHRvdWNoLnBhZ2VZIC0gcm9vdC5yb290T2Zmc2V0LnRvcFxuICAgICAgICAgICBjdXJUb3VjaHMucHVzaCggdG91Y2ggKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjdXJUb3VjaHM7XG4gICAgfSxcbiAgICBfX2dldENoaWxkSW5Ub3VjaHMgOiBmdW5jdGlvbiggdG91Y2hzICl7XG4gICAgICAgIHZhciBtZSAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciB0b3VjaGVzVGFyZ2V0ID0gW107XG4gICAgICAgIF8uZWFjaCggdG91Y2hzICwgZnVuY3Rpb24odG91Y2gpe1xuICAgICAgICAgICAgdG91Y2hlc1RhcmdldC5wdXNoKCByb290LmdldE9iamVjdHNVbmRlclBvaW50KCB0b3VjaCAsIDEpWzBdICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuIHRvdWNoZXNUYXJnZXQ7XG4gICAgfSxcbiAgICAvKlxuICAgICrnrKzkuInmlrnlupPnmoTkuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICovXG5cblxuICAgIC8qXG4gICAgICpAcGFyYW0ge2FycmF5fSBjaGlsZHMgXG4gICAgICogKi9cbiAgICBfX2Rpc3BhdGNoRXZlbnRJbkNoaWxkczogZnVuY3Rpb24oZSwgY2hpbGRzKSB7XG4gICAgICAgIGlmICghY2hpbGRzICYmICEoXCJsZW5ndGhcIiBpbiBjaGlsZHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIGhhc0NoaWxkID0gZmFsc2U7XG4gICAgICAgIF8uZWFjaChjaGlsZHMsIGZ1bmN0aW9uKGNoaWxkLCBpKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBoYXNDaGlsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGNlID0gbmV3IENhbnZheEV2ZW50KGUpO1xuICAgICAgICAgICAgICAgIGNlLnRhcmdldCA9IGNlLmN1cnJlbnRUYXJnZXQgPSBjaGlsZCB8fCB0aGlzO1xuICAgICAgICAgICAgICAgIGNlLnN0YWdlUG9pbnQgPSBtZS5jdXJQb2ludHNbaV07XG4gICAgICAgICAgICAgICAgY2UucG9pbnQgPSBjZS50YXJnZXQuZ2xvYmFsVG9Mb2NhbChjZS5zdGFnZVBvaW50KTtcbiAgICAgICAgICAgICAgICBjaGlsZC5kaXNwYXRjaEV2ZW50KGNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBoYXNDaGlsZDtcbiAgICB9LFxuICAgIC8v5YWL6ZqG5LiA5Liq5YWD57Sg5YiwaG92ZXIgc3RhZ2XkuK3ljrtcbiAgICBfY2xvbmUyaG92ZXJTdGFnZTogZnVuY3Rpb24odGFyZ2V0LCBpKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgX2RyYWdEdXBsaWNhdGUgPSByb290Ll9idWZmZXJTdGFnZS5nZXRDaGlsZEJ5SWQodGFyZ2V0LmlkKTtcbiAgICAgICAgaWYgKCFfZHJhZ0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgX2RyYWdEdXBsaWNhdGUgPSB0YXJnZXQuY2xvbmUodHJ1ZSk7XG4gICAgICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5fdHJhbnNmb3JtID0gdGFyZ2V0LmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqVE9ETzog5Zug5Li65ZCO57ut5Y+v6IO95Lya5pyJ5omL5Yqo5re75Yqg55qEIOWFg+e0oOWIsF9idWZmZXJTdGFnZSDph4zpnaLmnaVcbiAgICAgICAgICAgICAq5q+U5aaCdGlwc1xuICAgICAgICAgICAgICrov5nnsbvmiYvliqjmt7vliqDov5vmnaXnmoTogq/lrprmmK/lm6DkuLrpnIDopoHmmL7npLrlnKjmnIDlpJblsYLnmoTjgILlnKhob3ZlcuWFg+e0oOS5i+S4iuOAglxuICAgICAgICAgICAgICrmiYDmnInoh6rliqjmt7vliqDnmoRob3ZlcuWFg+e0oOmDvem7mOiupOa3u+WKoOWcqF9idWZmZXJTdGFnZeeahOacgOW6leWxglxuICAgICAgICAgICAgICoqL1xuICAgICAgICAgICAgcm9vdC5fYnVmZmVyU3RhZ2UuYWRkQ2hpbGRBdChfZHJhZ0R1cGxpY2F0ZSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRhcmdldC5fZ2xvYmFsQWxwaGE7XG4gICAgICAgIHRhcmdldC5fZHJhZ1BvaW50ID0gdGFyZ2V0Lmdsb2JhbFRvTG9jYWwobWUuY3VyUG9pbnRzW2ldKTtcbiAgICAgICAgcmV0dXJuIF9kcmFnRHVwbGljYXRlO1xuICAgIH0sXG4gICAgLy9kcmFnIOS4rSDnmoTlpITnkIblh73mlbBcbiAgICBfZHJhZ01vdmVIYW5kZXI6IGZ1bmN0aW9uKGUsIHRhcmdldCwgaSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIF9wb2ludCA9IHRhcmdldC5nbG9iYWxUb0xvY2FsKCBtZS5jdXJQb2ludHNbaV0gKTtcblxuICAgICAgICAvL+imgeWvueW6lOeahOS/ruaUueacrOWwiueahOS9jee9ru+8jOS9huaYr+imgeWRiuivieW8leaTjuS4jeimgXdhdGNo6L+Z5Liq5pe25YCZ55qE5Y+Y5YyWXG4gICAgICAgIHRhcmdldC5fbm90V2F0Y2ggPSB0cnVlO1xuICAgICAgICB2YXIgX21vdmVTdGFnZSA9IHRhcmdldC5tb3ZlaW5nO1xuICAgICAgICB0YXJnZXQubW92ZWluZyA9IHRydWU7XG4gICAgICAgIHRhcmdldC5jb250ZXh0LnggKz0gKF9wb2ludC54IC0gdGFyZ2V0Ll9kcmFnUG9pbnQueCk7XG4gICAgICAgIHRhcmdldC5jb250ZXh0LnkgKz0gKF9wb2ludC55IC0gdGFyZ2V0Ll9kcmFnUG9pbnQueSk7XG4gICAgICAgIHRhcmdldC5maXJlKFwiZHJhZ21vdmVcIik7XG4gICAgICAgIHRhcmdldC5tb3ZlaW5nID0gX21vdmVTdGFnZTtcbiAgICAgICAgdGFyZ2V0Ll9ub3RXYXRjaCA9IGZhbHNlO1xuICAgICAgICAvL+WQjOatpeWujOavleacrOWwiueahOS9jee9rlxuXG4gICAgICAgIC8v6L+Z6YeM5Y+q6IO955u05o6l5L+u5pS5X3RyYW5zZm9ybSDjgIIg5LiN6IO955So5LiL6Z2i55qE5L+u5pS5eO+8jHnnmoTmlrnlvI/jgIJcbiAgICAgICAgdmFyIF9kcmFnRHVwbGljYXRlID0gcm9vdC5fYnVmZmVyU3RhZ2UuZ2V0Q2hpbGRCeUlkKHRhcmdldC5pZCk7XG4gICAgICAgIF9kcmFnRHVwbGljYXRlLl90cmFuc2Zvcm0gPSB0YXJnZXQuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCk7XG4gICAgICAgIC8v5Lul5Li655u05o6l5L+u5pS555qEX3RyYW5zZm9ybeS4jeS8muWHuuWPkeW/g+i3s+S4iuaKpe+8jCDmuLLmn5PlvJXmk47kuI3liLbliqjov5nkuKpzdGFnZemcgOimgee7mOWItuOAglxuICAgICAgICAvL+aJgOS7peimgeaJi+WKqOWHuuWPkeW/g+i3s+WMhVxuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5oZWFydEJlYXQoKTtcbiAgICB9LFxuICAgIC8vZHJhZ+e7k+adn+eahOWkhOeQhuWHveaVsFxuICAgIF9kcmFnRW5kOiBmdW5jdGlvbihlLCB0YXJnZXQsIGkpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG5cbiAgICAgICAgLy9fZHJhZ0R1cGxpY2F0ZSDlpI3liLblnKhfYnVmZmVyU3RhZ2Ug5Lit55qE5Ymv5pysXG4gICAgICAgIHZhciBfZHJhZ0R1cGxpY2F0ZSA9IHJvb3QuX2J1ZmZlclN0YWdlLmdldENoaWxkQnlJZCh0YXJnZXQuaWQpO1xuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5kZXN0cm95KCk7XG5cbiAgICAgICAgdGFyZ2V0LmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0YXJnZXQuX2dsb2JhbEFscGhhO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXI7IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5LqL5Lu2566h55CG57G7XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICog5p6E6YCg5Ye95pWwLlxuICogQG5hbWUgRXZlbnREaXNwYXRjaGVyXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVy57G75piv5Y+v6LCD5bqm5LqL5Lu255qE57G755qE5Z+657G777yM5a6D5YWB6K645pi+56S65YiX6KGo5LiK55qE5Lu75L2V5a+56LGh6YO95piv5LiA5Liq5LqL5Lu255uu5qCH44CCXG4gKi9cbnZhciBFdmVudE1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgICAvL+S6i+S7tuaYoOWwhOihqO+8jOagvOW8j+S4uu+8mnt0eXBlMTpbbGlzdGVuZXIxLCBsaXN0ZW5lcjJdLCB0eXBlMjpbbGlzdGVuZXIzLCBsaXN0ZW5lcjRdfVxuICAgIHRoaXMuX2V2ZW50TWFwID0ge307XG59O1xuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlID0geyBcbiAgICAvKlxuICAgICAqIOazqOWGjOS6i+S7tuS+puWQrOWZqOWvueixoe+8jOS7peS9v+S+puWQrOWZqOiDveWkn+aOpeaUtuS6i+S7tumAmuefpeOAglxuICAgICAqL1xuICAgIF9hZGRFdmVudExpc3RlbmVyIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcblxuICAgICAgICBpZiggdHlwZW9mIGxpc3RlbmVyICE9IFwiZnVuY3Rpb25cIiApe1xuICAgICAgICAgIC8vbGlzdGVuZXLlv4XpobvmmK/kuKpmdW5jdGlvbuWRkOS6slxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWRkUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHNlbGYgICAgICA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggdHlwZS5zcGxpdChcIiBcIikgLCBmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgICAgIHZhciBtYXAgPSBzZWxmLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgICAgIGlmKCFtYXApe1xuICAgICAgICAgICAgICAgIG1hcCA9IHNlbGYuX2V2ZW50TWFwW3R5cGVdID0gW107XG4gICAgICAgICAgICAgICAgbWFwLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50RW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKF8uaW5kZXhPZihtYXAgLGxpc3RlbmVyKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIG1hcC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZGRSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhZGRSZXN1bHQ7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliKDpmaTkuovku7bkvqblkKzlmajjgIJcbiAgICAgKi9cbiAgICBfcmVtb3ZlRXZlbnRMaXN0ZW5lciA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkgcmV0dXJuIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSh0eXBlKTtcblxuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIGlmKCFtYXApe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpID0gbWFwW2ldO1xuICAgICAgICAgICAgaWYobGkgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbWFwLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZihtYXAubGVuZ3RoICAgID09IDApIHsgXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrlpoLmnpzov5nkuKrml7blgJljaGlsZOayoeacieS7u+S9leS6i+S7tuS+puWQrFxuICAgICAgICAgICAgICAgICAgICBpZihfLmlzRW1wdHkodGhpcy5fZXZlbnRNYXApKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI6K+l5YWD57Sg5LiN5YaN5o6l5Y+X5LqL5Lu255qE5qOA5rWLXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5oyH5a6a57G75Z6L55qE5omA5pyJ5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUgOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgaWYoIW1hcCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuXG4gICAgICAgICAgICAvL+WmguaenOi/meS4quWmguaenOi/meS4quaXtuWAmWNoaWxk5rKh5pyJ5Lu75L2V5LqL5Lu25L6m5ZCsXG4gICAgICAgICAgICBpZihfLmlzRW1wdHkodGhpcy5fZXZlbnRNYXApKXtcbiAgICAgICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOS4jeWGjeaOpeWPl+S6i+S7tueahOajgOa1i1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliKDpmaTmiYDmnInkuovku7bkvqblkKzlmajjgIJcbiAgICAgKi9cbiAgICBfcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMgOiBmdW5jdGlvbigpIHtcdFxuICAgICAgICB0aGlzLl9ldmVudE1hcCA9IHt9O1xuICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICog5rS+5Y+R5LqL5Lu277yM6LCD55So5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgKi9cbiAgICBfZGlzcGF0Y2hFdmVudCA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW2UudHlwZV07XG4gICAgICAgIFxuICAgICAgICBpZiggbWFwICl7XG4gICAgICAgICAgICBpZighZS50YXJnZXQpIGUudGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIG1hcCA9IG1hcC5zbGljZSgpO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gbWFwW2ldO1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZihsaXN0ZW5lcikgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoICFlLl9zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgICAgICAgICAvL+WQkeS4iuWGkuazoVxuICAgICAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuX2Rpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvKipcbiAgICAgICAqIOajgOafpeaYr+WQpuS4uuaMh+WumuS6i+S7tuexu+Wei+azqOWGjOS6huS7u+S9leS+puWQrOWZqOOAglxuICAgICAgICovXG4gICAgX2hhc0V2ZW50TGlzdGVuZXIgOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgcmV0dXJuIG1hcCAhPSBudWxsICYmIG1hcC5sZW5ndGggPiAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRNYW5hZ2VyO1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5LqL5Lu25rS+5Y+R57G7XG4gKi9cbmltcG9ydCBCYXNlIGZyb20gXCIuLi9jb3JlL0Jhc2VcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vRXZlbnRNYW5hZ2VyXCI7XG5pbXBvcnQgQ2FudmF4RXZlbnQgZnJvbSBcIi4vQ2FudmF4RXZlbnRcIjtcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cblxudmFyIEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uKCl7XG4gICAgRXZlbnREaXNwYXRjaGVyLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBuYW1lKTtcbn07XG5cbkJhc2UuY3JlYXRDbGFzcyhFdmVudERpc3BhdGNoZXIgLCBFdmVudE1hbmFnZXIgLCB7XG4gICAgb24gOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhZGRFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHVuIDogZnVuY3Rpb24odHlwZSxsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZTpmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSggdHlwZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnM6ZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vcGFyYW1zIOimgeS8oOe7mWV2dOeahGV2ZW50aGFuZGxlcuWkhOeQhuWHveaVsOeahOWPguaVsO+8jOS8muiiq21lcmdl5YiwQ2FudmF4IGV2ZW505LitXG4gICAgZmlyZSA6IGZ1bmN0aW9uKGV2ZW50VHlwZSAsIHBhcmFtcyl7XG4gICAgICAgIHZhciBlID0gbmV3IENhbnZheEV2ZW50KCBldmVudFR5cGUgKTtcblxuICAgICAgICBpZiggcGFyYW1zICl7XG4gICAgICAgICAgICBmb3IoIHZhciBwIGluIHBhcmFtcyApe1xuICAgICAgICAgICAgICAgIGlmKCBwIGluIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgLy9wYXJhbXPkuK3nmoTmlbDmja7kuI3og73opobnm5ZldmVudOWxnuaAp1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcCArIFwi5bGe5oCn5LiN6IO96KaG55uWQ2FudmF4RXZlbnTlsZ7mgKdcIiApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZVtwXSA9IHBhcmFtc1twXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgXy5lYWNoKCBldmVudFR5cGUuc3BsaXQoXCIgXCIpICwgZnVuY3Rpb24oZVR5cGUpe1xuICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gbWU7XG4gICAgICAgICAgICBtZS5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBkaXNwYXRjaEV2ZW50OmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgLy90aGlzIGluc3RhbmNlb2YgRGlzcGxheU9iamVjdENvbnRhaW5lciA9PT4gdGhpcy5jaGlsZHJlblxuICAgICAgICAvL1RPRE86IOi/memHjGltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIOeahOivne+8jOWcqGRpc3BsYXlPYmplY3Tph4zpnaLnmoRpbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbiAgICAgICAgLy/kvJrlvpfliLDkuIDkuKp1bmRlZmluZWTvvIzmhJ/op4nmmK/miJDkuobkuIDkuKrlvqrnjq/kvp3otZbnmoTpl67popjvvIzmiYDku6Xov5nph4zmjaLnlKjnroDljZXnmoTliKTmlq3mnaXliKTmlq3oh6rlt7HmmK/kuIDkuKrlrrnmmJPvvIzmi6XmnIljaGlsZHJlblxuICAgICAgICBpZiggdGhpcy5jaGlsZHJlbiAgJiYgZXZlbnQucG9pbnQgKXtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLmdldE9iamVjdHNVbmRlclBvaW50KCBldmVudC5wb2ludCAsIDEpWzBdO1xuICAgICAgICAgICAgaWYoIHRhcmdldCApe1xuICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5jb250ZXh0ICYmIGV2ZW50LnR5cGUgPT0gXCJtb3VzZW92ZXJcIil7XG4gICAgICAgICAgICAvL+iusOW9lWRpc3BhdGNoRXZlbnTkuYvliY3nmoTlv4Pot7NcbiAgICAgICAgICAgIHZhciBwcmVIZWFydEJlYXQgPSB0aGlzLl9oZWFydEJlYXROdW07XG4gICAgICAgICAgICB2YXIgcHJlZ0FscGhhICAgID0gdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcbiAgICAgICAgICAgIGlmKCBwcmVIZWFydEJlYXQgIT0gdGhpcy5faGVhcnRCZWF0TnVtICl7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJDbGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuaG92ZXJDbG9uZSApe1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudmF4ID0gdGhpcy5nZXRTdGFnZSgpLnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI5jbG9uZeS4gOS7vW9iau+8jOa3u+WKoOWIsF9idWZmZXJTdGFnZSDkuK1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGl2U2hhcGUgPSB0aGlzLmNsb25lKHRydWUpOyAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBhY3RpdlNoYXBlLl90cmFuc2Zvcm0gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXguX2J1ZmZlclN0YWdlLmFkZENoaWxkQXQoIGFjdGl2U2hhcGUgLCAwICk7IFxuICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjuaKiuiHquW3semakOiXj+S6hlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nbG9iYWxBbHBoYSA9IHByZWdBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcblxuICAgICAgICBpZiggdGhpcy5jb250ZXh0ICYmIGV2ZW50LnR5cGUgPT0gXCJtb3VzZW91dFwiKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX2hvdmVyQ2xhc3Mpe1xuICAgICAgICAgICAgICAgIC8v6K+05piO5Yia5Yiab3ZlcueahOaXtuWAmeaciea3u+WKoOagt+W8j1xuICAgICAgICAgICAgICAgIHZhciBjYW52YXggPSB0aGlzLmdldFN0YWdlKCkucGFyZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2hvdmVyQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjYW52YXguX2J1ZmZlclN0YWdlLnJlbW92ZUNoaWxkQnlJZCh0aGlzLmlkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5fZ2xvYmFsQWxwaGEgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5fZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhhc0V2ZW50OmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzRXZlbnRMaXN0ZW5lcih0eXBlKTtcbiAgICB9LFxuICAgIGhhc0V2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgIH0sXG4gICAgaG92ZXIgOiBmdW5jdGlvbiggb3ZlckZ1biAsIG91dEZ1biApe1xuICAgICAgICB0aGlzLm9uKFwibW91c2VvdmVyXCIgLCBvdmVyRnVuKTtcbiAgICAgICAgdGhpcy5vbihcIm1vdXNlb3V0XCIgICwgb3V0RnVuICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgb25jZSA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIG9uY2VIYW5kbGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkobWUgLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy51bih0eXBlICwgb25jZUhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub24odHlwZSAsIG9uY2VIYW5kbGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnREaXNwYXRjaGVyO1xuIiwiXG4vKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiBNYXRyaXgg55+p6Zi15bqTIOeUqOS6juaVtOS4quezu+e7n+eahOWHoOS9leWPmOaNouiuoeeul1xuICogY29kZSBmcm9tIGh0dHA6Ly9ldmFudy5naXRodWIuaW8vbGlnaHRnbC5qcy9kb2NzL21hdHJpeC5odG1sXG4gKi9cbmltcG9ydCBCYXNlIGZyb20gXCIuLi9jb3JlL0Jhc2VcIjtcblxudmFyIE1hdHJpeCA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIHR4LCB0eSl7XG4gICAgdGhpcy5hID0gYSAhPSB1bmRlZmluZWQgPyBhIDogMTtcbiAgICB0aGlzLmIgPSBiICE9IHVuZGVmaW5lZCA/IGIgOiAwO1xuICAgIHRoaXMuYyA9IGMgIT0gdW5kZWZpbmVkID8gYyA6IDA7XG4gICAgdGhpcy5kID0gZCAhPSB1bmRlZmluZWQgPyBkIDogMTtcbiAgICB0aGlzLnR4ID0gdHggIT0gdW5kZWZpbmVkID8gdHggOiAwO1xuICAgIHRoaXMudHkgPSB0eSAhPSB1bmRlZmluZWQgPyB0eSA6IDA7XG59O1xuXG5CYXNlLmNyZWF0Q2xhc3MoIE1hdHJpeCAsIGZ1bmN0aW9uKCl7fSAsIHtcbiAgICBjb25jYXQgOiBmdW5jdGlvbihtdHgpe1xuICAgICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG5cbiAgICAgICAgdGhpcy5hID0gYSAqIG10eC5hICsgdGhpcy5iICogbXR4LmM7XG4gICAgICAgIHRoaXMuYiA9IGEgKiBtdHguYiArIHRoaXMuYiAqIG10eC5kO1xuICAgICAgICB0aGlzLmMgPSBjICogbXR4LmEgKyB0aGlzLmQgKiBtdHguYztcbiAgICAgICAgdGhpcy5kID0gYyAqIG10eC5iICsgdGhpcy5kICogbXR4LmQ7XG4gICAgICAgIHRoaXMudHggPSB0eCAqIG10eC5hICsgdGhpcy50eSAqIG10eC5jICsgbXR4LnR4O1xuICAgICAgICB0aGlzLnR5ID0gdHggKiBtdHguYiArIHRoaXMudHkgKiBtdHguZCArIG10eC50eTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25jYXRUcmFuc2Zvcm0gOiBmdW5jdGlvbih4LCB5LCBzY2FsZVgsIHNjYWxlWSwgcm90YXRpb24pe1xuICAgICAgICB2YXIgY29zID0gMTtcbiAgICAgICAgdmFyIHNpbiA9IDA7XG4gICAgICAgIGlmKHJvdGF0aW9uJTM2MCl7XG4gICAgICAgICAgICB2YXIgciA9IHJvdGF0aW9uICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgIGNvcyA9IE1hdGguY29zKHIpO1xuICAgICAgICAgICAgc2luID0gTWF0aC5zaW4ocik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmNhdChuZXcgTWF0cml4KGNvcypzY2FsZVgsIHNpbipzY2FsZVgsIC1zaW4qc2NhbGVZLCBjb3Mqc2NhbGVZLCB4LCB5KSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcm90YXRlIDogZnVuY3Rpb24oYW5nbGUpe1xuICAgICAgICAvL+ebruWJjeW3sue7j+aPkOS+m+WvuemhuuaXtumSiOmAhuaXtumSiOS4pOS4quaWueWQkeaXi+i9rOeahOaUr+aMgVxuICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIHR4ID0gdGhpcy50eDtcblxuICAgICAgICBpZiAoYW5nbGU+MCl7XG4gICAgICAgICAgICB0aGlzLmEgPSBhICogY29zIC0gdGhpcy5iICogc2luO1xuICAgICAgICAgICAgdGhpcy5iID0gYSAqIHNpbiArIHRoaXMuYiAqIGNvcztcbiAgICAgICAgICAgIHRoaXMuYyA9IGMgKiBjb3MgLSB0aGlzLmQgKiBzaW47XG4gICAgICAgICAgICB0aGlzLmQgPSBjICogc2luICsgdGhpcy5kICogY29zO1xuICAgICAgICAgICAgdGhpcy50eCA9IHR4ICogY29zIC0gdGhpcy50eSAqIHNpbjtcbiAgICAgICAgICAgIHRoaXMudHkgPSB0eCAqIHNpbiArIHRoaXMudHkgKiBjb3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3QgPSBNYXRoLnNpbihNYXRoLmFicyhhbmdsZSkpO1xuICAgICAgICAgICAgdmFyIGN0ID0gTWF0aC5jb3MoTWF0aC5hYnMoYW5nbGUpKTtcblxuICAgICAgICAgICAgdGhpcy5hID0gYSpjdCArIHRoaXMuYipzdDtcbiAgICAgICAgICAgIHRoaXMuYiA9IC1hKnN0ICsgdGhpcy5iKmN0O1xuICAgICAgICAgICAgdGhpcy5jID0gYypjdCArIHRoaXMuZCpzdDtcbiAgICAgICAgICAgIHRoaXMuZCA9IC1jKnN0ICsgY3QqdGhpcy5kO1xuICAgICAgICAgICAgdGhpcy50eCA9IGN0KnR4ICsgc3QqdGhpcy50eTtcbiAgICAgICAgICAgIHRoaXMudHkgPSBjdCp0aGlzLnR5IC0gc3QqdHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzY2FsZSA6IGZ1bmN0aW9uKHN4LCBzeSl7XG4gICAgICAgIHRoaXMuYSAqPSBzeDtcbiAgICAgICAgdGhpcy5kICo9IHN5O1xuICAgICAgICB0aGlzLnR4ICo9IHN4O1xuICAgICAgICB0aGlzLnR5ICo9IHN5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRyYW5zbGF0ZSA6IGZ1bmN0aW9uKGR4LCBkeSl7XG4gICAgICAgIHRoaXMudHggKz0gZHg7XG4gICAgICAgIHRoaXMudHkgKz0gZHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaWRlbnRpdHkgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICB0aGlzLmEgPSB0aGlzLmQgPSAxO1xuICAgICAgICB0aGlzLmIgPSB0aGlzLmMgPSB0aGlzLnR4ID0gdGhpcy50eSA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW52ZXJ0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy/pgIblkJHnn6npmLVcbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIHZhciBiID0gdGhpcy5iO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIGQgPSB0aGlzLmQ7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG4gICAgICAgIHZhciBpID0gYSAqIGQgLSBiICogYztcblxuICAgICAgICB0aGlzLmEgPSBkIC8gaTtcbiAgICAgICAgdGhpcy5iID0gLWIgLyBpO1xuICAgICAgICB0aGlzLmMgPSAtYyAvIGk7XG4gICAgICAgIHRoaXMuZCA9IGEgLyBpO1xuICAgICAgICB0aGlzLnR4ID0gKGMgKiB0aGlzLnR5IC0gZCAqIHR4KSAvIGk7XG4gICAgICAgIHRoaXMudHkgPSAtKGEgKiB0aGlzLnR5IC0gYiAqIHR4KSAvIGk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xvbmUgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCh0aGlzLmEsIHRoaXMuYiwgdGhpcy5jLCB0aGlzLmQsIHRoaXMudHgsIHRoaXMudHkpO1xuICAgIH0sXG4gICAgdG9BcnJheSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBbIHRoaXMuYSAsIHRoaXMuYiAsIHRoaXMuYyAsIHRoaXMuZCAsIHRoaXMudHggLCB0aGlzLnR5IF07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDnn6npmLXlt6bkuZjlkJHph49cbiAgICAgKi9cbiAgICBtdWxWZWN0b3IgOiBmdW5jdGlvbih2KSB7XG4gICAgICAgIHZhciBhYSA9IHRoaXMuYSwgYWMgPSB0aGlzLmMsIGF0eCA9IHRoaXMudHg7XG4gICAgICAgIHZhciBhYiA9IHRoaXMuYiwgYWQgPSB0aGlzLmQsIGF0eSA9IHRoaXMudHk7XG5cbiAgICAgICAgdmFyIG91dCA9IFswLDBdO1xuICAgICAgICBvdXRbMF0gPSB2WzBdICogYWEgKyB2WzFdICogYWMgKyBhdHg7XG4gICAgICAgIG91dFsxXSA9IHZbMF0gKiBhYiArIHZbMV0gKiBhZCArIGF0eTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0gICAgXG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IE1hdHJpeDtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaVsOWtpiDnsbtcbiAqXG4gKiovXG5cblxuXG52YXIgX2NhY2hlID0ge1xuICAgIHNpbiA6IHt9LCAgICAgLy9zaW7nvJPlrZhcbiAgICBjb3MgOiB7fSAgICAgIC8vY29z57yT5a2YXG59O1xudmFyIF9yYWRpYW5zID0gTWF0aC5QSSAvIDE4MDtcblxuLyoqXG4gKiBAcGFyYW0gYW5nbGUg5byn5bqm77yI6KeS5bqm77yJ5Y+C5pWwXG4gKiBAcGFyYW0gaXNEZWdyZWVzIGFuZ2xl5Y+C5pWw5piv5ZCm5Li66KeS5bqm6K6h566X77yM6buY6K6k5Li6ZmFsc2XvvIxhbmdsZeS4uuS7peW8p+W6puiuoemHj+eahOinkuW6plxuICovXG5mdW5jdGlvbiBzaW4oYW5nbGUsIGlzRGVncmVlcykge1xuICAgIGFuZ2xlID0gKGlzRGVncmVlcyA/IGFuZ2xlICogX3JhZGlhbnMgOiBhbmdsZSkudG9GaXhlZCg0KTtcbiAgICBpZih0eXBlb2YgX2NhY2hlLnNpblthbmdsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgX2NhY2hlLnNpblthbmdsZV0gPSBNYXRoLnNpbihhbmdsZSk7XG4gICAgfVxuICAgIHJldHVybiBfY2FjaGUuc2luW2FuZ2xlXTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gcmFkaWFucyDlvKfluqblj4LmlbBcbiAqL1xuZnVuY3Rpb24gY29zKGFuZ2xlLCBpc0RlZ3JlZXMpIHtcbiAgICBhbmdsZSA9IChpc0RlZ3JlZXMgPyBhbmdsZSAqIF9yYWRpYW5zIDogYW5nbGUpLnRvRml4ZWQoNCk7XG4gICAgaWYodHlwZW9mIF9jYWNoZS5jb3NbYW5nbGVdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9jYWNoZS5jb3NbYW5nbGVdID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gX2NhY2hlLmNvc1thbmdsZV07XG59XG5cbi8qKlxuICog6KeS5bqm6L2s5byn5bqmXG4gKiBAcGFyYW0ge09iamVjdH0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG9SYWRpYW4oYW5nbGUpIHtcbiAgICByZXR1cm4gYW5nbGUgKiBfcmFkaWFucztcbn1cblxuLyoqXG4gKiDlvKfluqbovazop5LluqZcbiAqIEBwYXJhbSB7T2JqZWN0fSBhbmdsZVxuICovXG5mdW5jdGlvbiByYWRpYW5Ub0RlZ3JlZShhbmdsZSkge1xuICAgIHJldHVybiBhbmdsZSAvIF9yYWRpYW5zO1xufVxuXG4vKlxuICog5qCh6aqM6KeS5bqm5YiwMzYw5bqm5YaFXG4gKiBAcGFyYW0ge2FuZ2xlfSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG8zNjAoIGFuZ2xlICkge1xuICAgIHZhciByZUFuZyA9ICgzNjAgKyAgYW5nbGUgICUgMzYwKSAlIDM2MDsvL01hdGguYWJzKDM2MCArIE1hdGguY2VpbCggYW5nbGUgKSAlIDM2MCkgJSAzNjA7XG4gICAgaWYoIHJlQW5nID09IDAgJiYgYW5nbGUgIT09IDAgKXtcbiAgICAgICAgcmVBbmcgPSAzNjBcbiAgICB9XG4gICAgcmV0dXJuIHJlQW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgUEkgIDogTWF0aC5QSSAgLFxuICAgIHNpbiA6IHNpbiAgICAgICxcbiAgICBjb3MgOiBjb3MgICAgICAsXG4gICAgZGVncmVlVG9SYWRpYW4gOiBkZWdyZWVUb1JhZGlhbixcbiAgICByYWRpYW5Ub0RlZ3JlZSA6IHJhZGlhblRvRGVncmVlLFxuICAgIGRlZ3JlZVRvMzYwICAgIDogZGVncmVlVG8zNjAgICBcbn07XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKiDngrnlh7vmo4DmtYsg57G7XG4gKiAqL1xuaW1wb3J0IG15TWF0aCBmcm9tIFwiLi9NYXRoXCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOWMheWQq+WIpOaWrVxuICogc2hhcGUgOiDlm77lvaJcbiAqIHggOiDmqKrlnZDmoIdcbiAqIHkgOiDnurXlnZDmoIdcbiAqL1xuZnVuY3Rpb24gaXNJbnNpZGUoc2hhcGUsIHBvaW50KSB7XG4gICAgdmFyIHggPSBwb2ludC54O1xuICAgIHZhciB5ID0gcG9pbnQueTtcbiAgICBpZiAoIXNoYXBlIHx8ICFzaGFwZS50eXBlKSB7XG4gICAgICAgIC8vIOaXoOWPguaVsOaIluS4jeaUr+aMgeexu+Wei1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvL+aVsOWtpui/kOeul++8jOS4u+imgeaYr2xpbmXvvIxicm9rZW5MaW5lXG4gICAgcmV0dXJuIF9wb2ludEluU2hhcGUoc2hhcGUsIHgsIHkpO1xufTtcblxuZnVuY3Rpb24gX3BvaW50SW5TaGFwZShzaGFwZSwgeCwgeSkge1xuICAgIC8vIOWcqOefqeW9ouWGheWImemDqOWIhuWbvuW9oumcgOimgei/m+S4gOatpeWIpOaWrVxuICAgIHN3aXRjaCAoc2hhcGUudHlwZSkge1xuICAgICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVMaW5lKHNoYXBlLmNvbnRleHQsIHgsIHkpO1xuICAgICAgICBjYXNlICdicm9rZW5saW5lJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVCcm9rZW5MaW5lKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAncmVjdCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdlbGxpcHNlJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNQb2ludEluRWxpcHNlKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAnc2VjdG9yJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVTZWN0b3Ioc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdwYXRoJzpcbiAgICAgICAgY2FzZSAnZHJvcGxldCc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlUGF0aChzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICBjYXNlICdpc29nb24nOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcihzaGFwZSwgeCwgeSk7XG4gICAgICAgICAgICAvL3JldHVybiBfaXNJbnNpZGVQb2x5Z29uX0Nyb3NzaW5nTnVtYmVyKHNoYXBlLCB4LCB5KTtcbiAgICB9XG59O1xuLyoqXG4gKiAhaXNJbnNpZGVcbiAqL1xuZnVuY3Rpb24gaXNPdXRzaWRlKHNoYXBlLCB4LCB5KSB7XG4gICAgcmV0dXJuICFpc0luc2lkZShzaGFwZSwgeCwgeSk7XG59O1xuXG4vKipcbiAqIOe6v+auteWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVMaW5lKGNvbnRleHQsIHgsIHkpIHtcbiAgICB2YXIgeDAgPSBjb250ZXh0LnhTdGFydDtcbiAgICB2YXIgeTAgPSBjb250ZXh0LnlTdGFydDtcbiAgICB2YXIgeDEgPSBjb250ZXh0LnhFbmQ7XG4gICAgdmFyIHkxID0gY29udGV4dC55RW5kO1xuICAgIHZhciBfbCA9IE1hdGgubWF4KGNvbnRleHQubGluZVdpZHRoICwgMyk7XG4gICAgdmFyIF9hID0gMDtcbiAgICB2YXIgX2IgPSB4MDtcblxuICAgIGlmKFxuICAgICAgICAoeSA+IHkwICsgX2wgJiYgeSA+IHkxICsgX2wpIFxuICAgICAgICB8fCAoeSA8IHkwIC0gX2wgJiYgeSA8IHkxIC0gX2wpIFxuICAgICAgICB8fCAoeCA+IHgwICsgX2wgJiYgeCA+IHgxICsgX2wpIFxuICAgICAgICB8fCAoeCA8IHgwIC0gX2wgJiYgeCA8IHgxIC0gX2wpIFxuICAgICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoeDAgIT09IHgxKSB7XG4gICAgICAgIF9hID0gKHkwIC0geTEpIC8gKHgwIC0geDEpO1xuICAgICAgICBfYiA9ICh4MCAqIHkxIC0geDEgKiB5MCkgLyAoeDAgLSB4MSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHggLSB4MCkgPD0gX2wgLyAyO1xuICAgIH1cblxuICAgIHZhciBfcyA9IChfYSAqIHggLSB5ICsgX2IpICogKF9hICogeCAtIHkgKyBfYikgLyAoX2EgKiBfYSArIDEpO1xuICAgIHJldHVybiBfcyA8PSBfbCAvIDIgKiBfbCAvIDI7XG59O1xuXG5mdW5jdGlvbiBfaXNJbnNpZGVCcm9rZW5MaW5lKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcbiAgICB2YXIgbGluZUFyZWE7XG4gICAgdmFyIGluc2lkZUNhdGNoID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwb2ludExpc3QubGVuZ3RoIC0gMTsgaSA8IGw7IGkrKykge1xuICAgICAgICBsaW5lQXJlYSA9IHtcbiAgICAgICAgICAgIHhTdGFydDogcG9pbnRMaXN0W2ldWzBdLFxuICAgICAgICAgICAgeVN0YXJ0OiBwb2ludExpc3RbaV1bMV0sXG4gICAgICAgICAgICB4RW5kOiBwb2ludExpc3RbaSArIDFdWzBdLFxuICAgICAgICAgICAgeUVuZDogcG9pbnRMaXN0W2kgKyAxXVsxXSxcbiAgICAgICAgICAgIGxpbmVXaWR0aDogY29udGV4dC5saW5lV2lkdGhcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFfaXNJbnNpZGVSZWN0YW5nbGUoe1xuICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLm1pbihsaW5lQXJlYS54U3RhcnQsIGxpbmVBcmVhLnhFbmQpIC0gbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLm1pbihsaW5lQXJlYS55U3RhcnQsIGxpbmVBcmVhLnlFbmQpIC0gbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogTWF0aC5hYnMobGluZUFyZWEueFN0YXJ0IC0gbGluZUFyZWEueEVuZCkgKyBsaW5lQXJlYS5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMobGluZUFyZWEueVN0YXJ0IC0gbGluZUFyZWEueUVuZCkgKyBsaW5lQXJlYS5saW5lV2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHgsIHlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgIC8vIOS4jeWcqOefqeW9ouWMuuWGhei3s+i/h1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5zaWRlQ2F0Y2ggPSBfaXNJbnNpZGVMaW5lKGxpbmVBcmVhLCB4LCB5KTtcbiAgICAgICAgaWYgKGluc2lkZUNhdGNoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zaWRlQ2F0Y2g7XG59O1xuXG5cbi8qKlxuICog55+p5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZVJlY3RhbmdsZShzaGFwZSwgeCwgeSkge1xuICAgIGlmICh4ID49IHNoYXBlLnggJiYgeCA8PSAoc2hhcGUueCArIHNoYXBlLndpZHRoKSAmJiB5ID49IHNoYXBlLnkgJiYgeSA8PSAoc2hhcGUueSArIHNoYXBlLmhlaWdodCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICog5ZyG5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZUNpcmNsZShzaGFwZSwgeCwgeSwgcikge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICAhciAmJiAociA9IGNvbnRleHQucik7XG4gICAgcmV0dXJuICh4ICogeCArIHkgKiB5KSA8IHIgKiByO1xufTtcblxuLyoqXG4gKiDmiYflvaLljIXlkKvliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlU2VjdG9yKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0XG4gICAgaWYgKCFfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHkpIHx8IChjb250ZXh0LnIwID4gMCAmJiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHksIGNvbnRleHQucjApKSkge1xuICAgICAgICAvLyDlpKflnIblpJbmiJbogIXlsI/lnIblhoXnm7TmjqVmYWxzZVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8g5Yik5pat5aS56KeSXG4gICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7IC8vIOi1t+Wni+inkuW6plswLDM2MClcbiAgICAgICAgdmFyIGVuZEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuZW5kQW5nbGUpOyAvLyDnu5PmnZ/op5LluqYoMCwzNjBdXG5cbiAgICAgICAgLy/orqHnrpfor6XngrnmiYDlnKjnmoTop5LluqZcbiAgICAgICAgdmFyIGFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKChNYXRoLmF0YW4yKHksIHgpIC8gTWF0aC5QSSAqIDE4MCkgJSAzNjApO1xuXG4gICAgICAgIHZhciByZWdJbiA9IHRydWU7IC8v5aaC5p6c5Zyoc3RhcnTlkoxlbmTnmoTmlbDlgLzkuK3vvIxlbmTlpKfkuo5zdGFydOiAjOS4lOaYr+mhuuaXtumSiOWImXJlZ0lu5Li6dHJ1ZVxuICAgICAgICBpZiAoKHN0YXJ0QW5nbGUgPiBlbmRBbmdsZSAmJiAhY29udGV4dC5jbG9ja3dpc2UpIHx8IChzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgY29udGV4dC5jbG9ja3dpc2UpKSB7XG4gICAgICAgICAgICByZWdJbiA9IGZhbHNlOyAvL291dFxuICAgICAgICB9XG4gICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXG4gICAgICAgIHZhciByZWdBbmdsZSA9IFtcbiAgICAgICAgICAgIE1hdGgubWluKHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKSxcbiAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBpbkFuZ2xlUmVnID0gYW5nbGUgPiByZWdBbmdsZVswXSAmJiBhbmdsZSA8IHJlZ0FuZ2xlWzFdO1xuICAgICAgICByZXR1cm4gKGluQW5nbGVSZWcgJiYgcmVnSW4pIHx8ICghaW5BbmdsZVJlZyAmJiAhcmVnSW4pO1xuICAgIH1cbn07XG5cbi8qXG4gKuakreWchuWMheWQq+WIpOaWrVxuICogKi9cbmZ1bmN0aW9uIF9pc1BvaW50SW5FbGlwc2Uoc2hhcGUsIHgsIHkpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQ7XG4gICAgdmFyIGNlbnRlciA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgIH07XG4gICAgLy945Y2K5b6EXG4gICAgdmFyIFhSYWRpdXMgPSBjb250ZXh0LmhyO1xuICAgIHZhciBZUmFkaXVzID0gY29udGV4dC52cjtcblxuICAgIHZhciBwID0ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgfTtcblxuICAgIHZhciBpUmVzO1xuXG4gICAgcC54IC09IGNlbnRlci54O1xuICAgIHAueSAtPSBjZW50ZXIueTtcblxuICAgIHAueCAqPSBwLng7XG4gICAgcC55ICo9IHAueTtcblxuICAgIFhSYWRpdXMgKj0gWFJhZGl1cztcbiAgICBZUmFkaXVzICo9IFlSYWRpdXM7XG5cbiAgICBpUmVzID0gWVJhZGl1cyAqIHAueCArIFhSYWRpdXMgKiBwLnkgLSBYUmFkaXVzICogWVJhZGl1cztcblxuICAgIHJldHVybiAoaVJlcyA8IDApO1xufTtcblxuLyoqXG4gKiDlpJrovrnlvaLljIXlkKvliKTmlq0gTm9uemVybyBXaW5kaW5nIE51bWJlciBSdWxlXG4gKi9cblxuZnVuY3Rpb24gX2lzSW5zaWRlUG9seWdvbl9XaW5kaW5nTnVtYmVyKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0ID8gc2hhcGUuY29udGV4dCA6IHNoYXBlO1xuICAgIHZhciBwb2x5ID0gXy5jbG9uZShjb250ZXh0LnBvaW50TGlzdCk7IC8vcG9seSDlpJrovrnlvaLpobbngrnvvIzmlbDnu4TmiJDlkZjnmoTmoLzlvI/lkIwgcFxuICAgIHBvbHkucHVzaChwb2x5WzBdKTsgLy/orrDlvpfopoHpl63lkIhcbiAgICB2YXIgd24gPSAwO1xuICAgIGZvciAodmFyIHNoaWZ0UCwgc2hpZnQgPSBwb2x5WzBdWzFdID4geSwgaSA9IDE7IGkgPCBwb2x5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8v5YWI5YGa57q/55qE5qOA5rWL77yM5aaC5p6c5piv5Zyo5Lik54K555qE57q/5LiK77yM5bCx6IKv5a6a5piv5Zyo6K6k5Li65Zyo5Zu+5b2i5LiKXG4gICAgICAgIHZhciBpbkxpbmUgPSBfaXNJbnNpZGVMaW5lKHtcbiAgICAgICAgICAgIHhTdGFydCA6IHBvbHlbaS0xXVswXSxcbiAgICAgICAgICAgIHlTdGFydCA6IHBvbHlbaS0xXVsxXSxcbiAgICAgICAgICAgIHhFbmQgICA6IHBvbHlbaV1bMF0sXG4gICAgICAgICAgICB5RW5kICAgOiBwb2x5W2ldWzFdLFxuICAgICAgICAgICAgbGluZVdpZHRoIDogKGNvbnRleHQubGluZVdpZHRoIHx8IDEpXG4gICAgICAgIH0gLCB4ICwgeSk7XG4gICAgICAgIGlmICggaW5MaW5lICl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/lpoLmnpzmnIlmaWxsU3R5bGUg77yMIOmCo+S5iOiCr+WumumcgOimgeWBmumdoueahOajgOa1i1xuICAgICAgICBpZiAoY29udGV4dC5maWxsU3R5bGUpIHtcbiAgICAgICAgICAgIHNoaWZ0UCA9IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgPSBwb2x5W2ldWzFdID4geTtcbiAgICAgICAgICAgIGlmIChzaGlmdFAgIT0gc2hpZnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IChzaGlmdFAgPyAxIDogMCkgLSAoc2hpZnQgPyAxIDogMCk7XG4gICAgICAgICAgICAgICAgaWYgKG4gKiAoKHBvbHlbaSAtIDFdWzBdIC0geCkgKiAocG9seVtpXVsxXSAtIHkpIC0gKHBvbHlbaSAtIDFdWzFdIC0geSkgKiAocG9seVtpXVswXSAtIHgpKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgd24gKz0gbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gd247XG59O1xuXG4vKipcbiAqIOi3r+W+hOWMheWQq+WIpOaWre+8jOS+nei1luWkmui+ueW9ouWIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVQYXRoKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcbiAgICB2YXIgaW5zaWRlQ2F0Y2ggPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaW5zaWRlQ2F0Y2ggPSBfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIoe1xuICAgICAgICAgICAgcG9pbnRMaXN0OiBwb2ludExpc3RbaV0sXG4gICAgICAgICAgICBsaW5lV2lkdGg6IGNvbnRleHQubGluZVdpZHRoLFxuICAgICAgICAgICAgZmlsbFN0eWxlOiBjb250ZXh0LmZpbGxTdHlsZVxuICAgICAgICB9LCB4LCB5KTtcbiAgICAgICAgaWYgKGluc2lkZUNhdGNoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zaWRlQ2F0Y2g7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaXNJbnNpZGU6IGlzSW5zaWRlLFxuICAgIGlzT3V0c2lkZTogaXNPdXRzaWRlXG59OyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOWxnuaAp+W3peWOgu+8jGll5LiL6Z2i55SoVkJT5o+Q5L6b5pSv5oyBXG4gKiDmnaXnu5nmlbTkuKrlvJXmk47mj5Dkvpvlv4Pot7PljIXnmoTop6blj5HmnLrliLZcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLy/lrprkuYnlsIHoo4Xlpb3nmoTlhbzlrrnlpKfpg6jliIbmtY/op4jlmajnmoRkZWZpbmVQcm9wZXJ0aWVzIOeahCDlsZ7mgKflt6XljoJcbnZhciB1bndhdGNoT25lID0ge1xuICAgIFwiJHNraXBBcnJheVwiIDogMCxcbiAgICBcIiR3YXRjaFwiICAgICA6IDEsXG4gICAgXCIkZmlyZVwiICAgICAgOiAyLC8v5Li76KaB5pivZ2V0IHNldCDmmL7mgKforr7nva7nmoQg6Kem5Y+RXG4gICAgXCIkbW9kZWxcIiAgICAgOiAzLFxuICAgIFwiJGFjY2Vzc29yXCIgIDogNCxcbiAgICBcIiRvd25lclwiICAgICA6IDUsXG4gICAgLy9cInBhdGhcIiAgICAgICA6IDYsIC8v6L+Z5Liq5bqU6K+l5piv5ZSv5LiA5LiA5Liq5LiN55Sod2F0Y2jnmoTkuI3luKYk55qE5oiQ5ZGY5LqG5ZCn77yM5Zug5Li65Zyw5Zu+562J55qEcGF0aOaYr+WcqOWkquWkp1xuICAgIFwiJHBhcmVudFwiICAgIDogNyAgLy/nlKjkuo7lu7rnq4vmlbDmja7nmoTlhbPns7vpk75cbn1cblxuZnVuY3Rpb24gUHJvcGVydHlGYWN0b3J5KHNjb3BlLCBtb2RlbCwgd2F0Y2hNb3JlKSB7XG5cbiAgICB2YXIgc3RvcFJlcGVhdEFzc2lnbj10cnVlO1xuXG4gICAgdmFyIHNraXBBcnJheSA9IHNjb3BlLiRza2lwQXJyYXksIC8v6KaB5b+955Wl55uR5o6n55qE5bGe5oCn5ZCN5YiX6KGoXG4gICAgICAgIHBtb2RlbCA9IHt9LCAvL+imgei/lOWbnueahOWvueixoVxuICAgICAgICBhY2Nlc3NvcmVzID0ge30sIC8v5YaF6YOo55So5LqO6L2s5o2i55qE5a+56LGhXG4gICAgICAgIFZCUHVibGljcyA9IF8ua2V5cyggdW53YXRjaE9uZSApOyAvL+eUqOS6jklFNi04XG5cbiAgICAgICAgbW9kZWwgPSBtb2RlbCB8fCB7fTsvL+i/meaYr3Btb2RlbOS4iueahCRtb2RlbOWxnuaAp1xuICAgICAgICB3YXRjaE1vcmUgPSB3YXRjaE1vcmUgfHwge307Ly/ku6Uk5byA5aS05L2G6KaB5by65Yi255uR5ZCs55qE5bGe5oCnXG4gICAgICAgIHNraXBBcnJheSA9IF8uaXNBcnJheShza2lwQXJyYXkpID8gc2tpcEFycmF5LmNvbmNhdChWQlB1YmxpY3MpIDogVkJQdWJsaWNzO1xuXG4gICAgZnVuY3Rpb24gbG9vcChuYW1lLCB2YWwpIHtcbiAgICAgICAgaWYgKCAhdW53YXRjaE9uZVtuYW1lXSB8fCAodW53YXRjaE9uZVtuYW1lXSAmJiBuYW1lLmNoYXJBdCgwKSAhPT0gXCIkXCIpICkge1xuICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSB2YWxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgICAgIGlmICh2YWx1ZVR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgaWYoIXVud2F0Y2hPbmVbbmFtZV0pe1xuICAgICAgICAgICAgICBWQlB1YmxpY3MucHVzaChuYW1lKSAvL+WHveaVsOaXoOmcgOimgei9rOaNolxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaW5kZXhPZihza2lwQXJyYXksbmFtZSkgIT09IC0xIHx8IChuYW1lLmNoYXJBdCgwKSA9PT0gXCIkXCIgJiYgIXdhdGNoTW9yZVtuYW1lXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVkJQdWJsaWNzLnB1c2gobmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhY2Nlc3NvciA9IGZ1bmN0aW9uKG5lbykgeyAvL+WIm+W7uuebkeaOp+WxnuaAp+aIluaVsOe7hO+8jOiHquWPmOmHj++8jOeUseeUqOaIt+inpuWPkeWFtuaUueWPmFxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFjY2Vzc29yLnZhbHVlLCBwcmVWYWx1ZSA9IHZhbHVlLCBjb21wbGV4VmFsdWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/lhpnmk43kvZxcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQg55qEIOWAvOeahCDnsbvlnotcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5lb1R5cGUgPSB0eXBlb2YgbmVvO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9wUmVwZWF0QXNzaWduKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLy/pmLvmraLph43lpI3otYvlgLxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG5lbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG5lbyAmJiBuZW9UeXBlID09PSBcIm9iamVjdFwiICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEobmVvIGluc3RhbmNlb2YgQXJyYXkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIW5lby5hZGRDb2xvclN0b3AgLy8gbmVvIGluc3RhbmNlb2YgQ2FudmFzR3JhZGllbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmVvLiRtb2RlbCA/IG5lbyA6IFByb3BlcnR5RmFjdG9yeShuZW8gLCBuZW8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhWYWx1ZSA9IHZhbHVlLiRtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7Ly/lpoLmnpzmmK/lhbbku5bmlbDmja7nsbvlnotcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmKCBuZW9UeXBlID09PSBcImFycmF5XCIgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB2YWx1ZSA9IF8uY2xvbmUobmVvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmVvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSBjb21wbGV4VmFsdWUgPyBjb21wbGV4VmFsdWUgOiB2YWx1ZTsvL+abtOaWsCRtb2RlbOS4reeahOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wbGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbW9kZWwuJGZpcmUgJiYgcG1vZGVsLiRmaXJlKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlVHlwZSAhPSBuZW9UeXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenHNldOeahOWAvOexu+Wei+W3sue7j+aUueWPmO+8jFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI5Lmf6KaB5oqK5a+55bqU55qEdmFsdWVUeXBl5L+u5pS55Li65a+55bqU55qEbmVvVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZSA9IG5lb1R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzV2F0Y2hNb2RlbCA9IHBtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5omA5pyJ55qE6LWL5YC86YO96KaB6Kem5Y+Rd2F0Y2jnmoTnm5HlkKzkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXBtb2RlbC4kd2F0Y2ggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlKCBoYXNXYXRjaE1vZGVsLiRwYXJlbnQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2F0Y2hNb2RlbCA9IGhhc1dhdGNoTW9kZWwuJHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBoYXNXYXRjaE1vZGVsLiR3YXRjaCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2F0Y2hNb2RlbC4kd2F0Y2guY2FsbChoYXNXYXRjaE1vZGVsICwgbmFtZSwgdmFsdWUsIHByZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6K+75pON5L2cXG4gICAgICAgICAgICAgICAgICAgIC8v6K+755qE5pe25YCZ77yM5Y+R546wdmFsdWXmmK/kuKpvYmrvvIzogIzkuJTov5jmsqHmnIlkZWZpbmVQcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOWwseS4tOaXtmRlZmluZVByb3BlcnR55LiA5qyhXG4gICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgJiYgKHZhbHVlVHlwZSA9PT0gXCJvYmplY3RcIikgXG4gICAgICAgICAgICAgICAgICAgICAgICYmICEodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkgXG4gICAgICAgICAgICAgICAgICAgICAgICYmICF2YWx1ZS4kbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgJiYgIXZhbHVlLmFkZENvbG9yU3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lu7rnq4vlkozniLbmlbDmja7oioLngrnnmoTlhbPns7tcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLiRwYXJlbnQgPSBwbW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFByb3BlcnR5RmFjdG9yeSh2YWx1ZSAsIHZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hY2Nlc3Nvci52YWx1ZSDph43mlrDlpI3liLbkuLpkZWZpbmVQcm9wZXJ0eei/h+WQjueahOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFjY2Vzc29yLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhY2Nlc3NvcmVzW25hbWVdID0ge1xuICAgICAgICAgICAgICAgIHNldDogYWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgZ2V0OiBhY2Nlc3NvcixcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGZvciAodmFyIGkgaW4gc2NvcGUpIHtcbiAgICAgICAgbG9vcChpLCBzY29wZVtpXSlcbiAgICB9O1xuXG4gICAgcG1vZGVsID0gZGVmaW5lUHJvcGVydGllcyhwbW9kZWwsIGFjY2Vzc29yZXMsIFZCUHVibGljcyk7Ly/nlJ/miJDkuIDkuKrnqbrnmoRWaWV3TW9kZWxcblxuICAgIF8uZm9yRWFjaChWQlB1YmxpY3MsZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBpZiAoc2NvcGVbbmFtZV0pIHsvL+WFiOS4uuWHveaVsOetieS4jeiiq+ebkeaOp+eahOWxnuaAp+i1i+WAvFxuICAgICAgICAgICAgaWYodHlwZW9mIHNjb3BlW25hbWVdID09IFwiZnVuY3Rpb25cIiApe1xuICAgICAgICAgICAgICAgcG1vZGVsW25hbWVdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgIHNjb3BlW25hbWVdLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIHBtb2RlbFtuYW1lXSA9IHNjb3BlW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwbW9kZWwuJG1vZGVsID0gbW9kZWw7XG4gICAgcG1vZGVsLiRhY2Nlc3NvciA9IGFjY2Vzc29yZXM7XG5cbiAgICBwbW9kZWwuaGFzT3duUHJvcGVydHkgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIHBtb2RlbC4kbW9kZWxcbiAgICB9O1xuXG4gICAgc3RvcFJlcGVhdEFzc2lnbiA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHBtb2RlbFxufVxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG4gICAgLy/lpoLmnpzmtY/op4jlmajkuI3mlK/mjIFlY21hMjYydjXnmoRPYmplY3QuZGVmaW5lUHJvcGVydGllc+aIluiAheWtmOWcqEJVR++8jOavlOWmgklFOFxuICAgIC8v5qCH5YeG5rWP6KeI5Zmo5L2/55SoX19kZWZpbmVHZXR0ZXJfXywgX19kZWZpbmVTZXR0ZXJfX+WunueOsFxuICAgIHRyeSB7XG4gICAgICAgIGRlZmluZVByb3BlcnR5KHt9LCBcIl9cIiwge1xuICAgICAgICAgICAgdmFsdWU6IFwieFwiXG4gICAgICAgIH0pXG4gICAgICAgIHZhciBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChcIl9fZGVmaW5lR2V0dGVyX19cIiBpbiBPYmplY3QpIHtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wLCBkZXNjKSB7XG4gICAgICAgICAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBkZXNjLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgnZ2V0JyBpbiBkZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5fX2RlZmluZUdldHRlcl9fKHByb3AsIGRlc2MuZ2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJ3NldCcgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmouX19kZWZpbmVTZXR0ZXJfXyhwcm9wLCBkZXNjLnNldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihvYmosIGRlc2NzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkZXNjcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3MuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzY3NbcHJvcF0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbi8vSUU2LTjkvb/nlKhWQlNjcmlwdOexu+eahHNldCBnZXTor63lj6Xlrp7njrBcbmlmICghZGVmaW5lUHJvcGVydGllcyAmJiB3aW5kb3cuVkJBcnJheSkge1xuICAgIHdpbmRvdy5leGVjU2NyaXB0KFtcbiAgICAgICAgICAgIFwiRnVuY3Rpb24gcGFyc2VWQihjb2RlKVwiLFxuICAgICAgICAgICAgXCJcXHRFeGVjdXRlR2xvYmFsKGNvZGUpXCIsXG4gICAgICAgICAgICBcIkVuZCBGdW5jdGlvblwiXG4gICAgICAgICAgICBdLmpvaW4oXCJcXG5cIiksIFwiVkJTY3JpcHRcIik7XG5cbiAgICBmdW5jdGlvbiBWQk1lZGlhdG9yKGRlc2NyaXB0aW9uLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZm4gPSBkZXNjcmlwdGlvbltuYW1lXSAmJiBkZXNjcmlwdGlvbltuYW1lXS5zZXQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBmbih2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKHB1YmxpY3MsIGRlc2NyaXB0aW9uLCBhcnJheSkge1xuICAgICAgICBwdWJsaWNzID0gYXJyYXkuc2xpY2UoMCk7XG4gICAgICAgIHB1YmxpY3MucHVzaChcImhhc093blByb3BlcnR5XCIpO1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJWQkNsYXNzXCIgKyBzZXRUaW1lb3V0KFwiMVwiKSwgb3duZXIgPSB7fSwgYnVmZmVyID0gW107XG4gICAgICAgIGJ1ZmZlci5wdXNoKFxuICAgICAgICAgICAgICAgIFwiQ2xhc3MgXCIgKyBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgXCJcXHRQcml2YXRlIFtfX2RhdGFfX10sIFtfX3Byb3h5X19dXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgRGVmYXVsdCBGdW5jdGlvbiBbX19jb25zdF9fXShkLCBwKVwiLFxuICAgICAgICAgICAgICAgIFwiXFx0XFx0U2V0IFtfX2RhdGFfX10gPSBkOiBzZXQgW19fcHJveHlfX10gPSBwXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRcXHRTZXQgW19fY29uc3RfX10gPSBNZVwiLCAvL+mTvuW8j+iwg+eUqFxuICAgICAgICAgICAgICAgIFwiXFx0RW5kIEZ1bmN0aW9uXCIpO1xuICAgICAgICBfLmZvckVhY2gocHVibGljcyxmdW5jdGlvbihuYW1lKSB7IC8v5re75Yqg5YWs5YWx5bGe5oCnLOWmguaenOatpOaXtuS4jeWKoOS7peWQjuWwseayoeacuuS8muS6hlxuICAgICAgICAgICAgaWYgKG93bmVyW25hbWVdICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgb3duZXJbbmFtZV0gPSB0cnVlIC8v5Zug5Li6VkJTY3JpcHTlr7nosaHkuI3og73lg49KU+mCo+agt+maj+aEj+WinuWIoOWxnuaAp1xuICAgICAgICAgICAgYnVmZmVyLnB1c2goXCJcXHRQdWJsaWMgW1wiICsgbmFtZSArIFwiXVwiKSAvL+S9oOWPr+S7pemihOWFiOaUvuWIsHNraXBBcnJheeS4rVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgb3duZXJbbmFtZV0gPSB0cnVlXG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+eUseS6juS4jeefpeWvueaWueS8muS8oOWFpeS7gOS5iCzlm6DmraRzZXQsIGxldOmDveeUqOS4ilxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgUHJvcGVydHkgTGV0IFtcIiArIG5hbWUgKyBcIl0odmFsKVwiLCAvL3NldHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRDYWxsIFtfX3Byb3h5X19dKFtfX2RhdGFfX10sIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIsIHZhbClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIFByb3BlcnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBQcm9wZXJ0eSBTZXQgW1wiICsgbmFtZSArIFwiXSh2YWwpXCIsIC8vc2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdENhbGwgW19fcHJveHlfX10oW19fZGF0YV9fXSwgXFxcIlwiICsgbmFtZSArIFwiXFxcIiwgdmFsKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgUHJvcGVydHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIFByb3BlcnR5IEdldCBbXCIgKyBuYW1lICsgXCJdXCIsIC8vZ2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdE9uIEVycm9yIFJlc3VtZSBOZXh0XCIsIC8v5b+F6aG75LyY5YWI5L2/55Soc2V06K+t5Y+lLOWQpuWImeWug+S8muivr+WwhuaVsOe7hOW9k+Wtl+espuS4sui/lOWbnlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRTZXRbXCIgKyBuYW1lICsgXCJdID0gW19fcHJveHlfX10oW19fZGF0YV9fXSxcXFwiXCIgKyBuYW1lICsgXCJcXFwiKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRJZiBFcnIuTnVtYmVyIDw+IDAgVGhlblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRbXCIgKyBuYW1lICsgXCJdID0gW19fcHJveHlfX10oW19fZGF0YV9fXSxcXFwiXCIgKyBuYW1lICsgXCJcXFwiKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgSWZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0T24gRXJyb3IgR290byAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBQcm9wZXJ0eVwiKVxuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5wdXNoKFwiRW5kIENsYXNzXCIpOyAvL+exu+WumuS5ieWujOavlVxuICAgICAgICBidWZmZXIucHVzaChcbiAgICAgICAgICAgICAgICBcIkZ1bmN0aW9uIFwiICsgY2xhc3NOYW1lICsgXCJGYWN0b3J5KGEsIGIpXCIsIC8v5Yib5bu65a6e5L6L5bm25Lyg5YWl5Lik5Liq5YWz6ZSu55qE5Y+C5pWwXG4gICAgICAgICAgICAgICAgXCJcXHREaW0gb1wiLFxuICAgICAgICAgICAgICAgIFwiXFx0U2V0IG8gPSAoTmV3IFwiICsgY2xhc3NOYW1lICsgXCIpKGEsIGIpXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRTZXQgXCIgKyBjbGFzc05hbWUgKyBcIkZhY3RvcnkgPSBvXCIsXG4gICAgICAgICAgICAgICAgXCJFbmQgRnVuY3Rpb25cIik7XG4gICAgICAgIHdpbmRvdy5wYXJzZVZCKGJ1ZmZlci5qb2luKFwiXFxyXFxuXCIpKTsvL+WFiOWIm+W7uuS4gOS4qlZC57G75bel5Y6CXG4gICAgICAgIHJldHVybiAgd2luZG93W2NsYXNzTmFtZSArIFwiRmFjdG9yeVwiXShkZXNjcmlwdGlvbiwgVkJNZWRpYXRvcik7Ly/lvpfliLDlhbbkuqflk4FcbiAgICB9XG59XG53aW5kb3cuUHJvcGVydHlGYWN0b3J5ID0gUHJvcGVydHlGYWN0b3J5O1xuZXhwb3J0IGRlZmF1bHQgUHJvcGVydHlGYWN0b3J5O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczMgRGlzcGxheUxpc3Qg55qEIOeOsOWunuWvueixoeWfuuexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi4vZXZlbnQvRXZlbnREaXNwYXRjaGVyXCI7XG5pbXBvcnQgTWF0cml4IGZyb20gXCIuLi9nZW9tL01hdHJpeFwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XG5pbXBvcnQgQmFzZSBmcm9tIFwiLi4vY29yZS9CYXNlXCI7XG5pbXBvcnQgSGl0VGVzdFBvaW50IGZyb20gXCIuLi9nZW9tL0hpdFRlc3RQb2ludFwiO1xuaW1wb3J0IEFuaW1hdGlvbkZyYW1lIGZyb20gXCIuLi9hbmltYXRpb24vQW5pbWF0aW9uRnJhbWVcIjtcbmltcG9ydCBQcm9wZXJ0eUZhY3RvcnkgZnJvbSBcIi4uL2NvcmUvUHJvcGVydHlGYWN0b3J5XCI7XG5cbnZhciBEaXNwbGF5T2JqZWN0ID0gZnVuY3Rpb24ob3B0KXtcbiAgICBEaXNwbGF5T2JqZWN0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvL+WmguaenOeUqOaIt+ayoeacieS8oOWFpWNvbnRleHTorr7nva7vvIzlsLHpu5jorqTkuLrnqbrnmoTlr7nosaFcbiAgICBvcHQgICAgICA9IEJhc2UuY2hlY2tPcHQoIG9wdCApO1xuXG4gICAgLy/orr7nva7pu5jorqTlsZ7mgKdcbiAgICBzZWxmLmlkICA9IG9wdC5pZCB8fCBudWxsO1xuXG4gICAgLy/nm7jlr7nniLbnuqflhYPntKDnmoTnn6npmLVcbiAgICBzZWxmLl90cmFuc2Zvcm0gICAgICA9IG51bGw7XG5cbiAgICAvL+W/g+i3s+asoeaVsFxuICAgIHNlbGYuX2hlYXJ0QmVhdE51bSAgID0gMDtcblxuICAgIC8v5YWD57Sg5a+55bqU55qEc3RhZ2XlhYPntKBcbiAgICBzZWxmLnN0YWdlICAgICAgICAgICA9IG51bGw7XG5cbiAgICAvL+WFg+e0oOeahOeItuWFg+e0oFxuICAgIHNlbGYucGFyZW50ICAgICAgICAgID0gbnVsbDtcblxuICAgIHNlbGYuX2V2ZW50RW5hYmxlZCAgID0gZmFsc2U7ICAgLy/mmK/lkKblk43lupTkuovku7bkuqTkupIs5Zyo5re75Yqg5LqG5LqL5Lu25L6m5ZCs5ZCO5Lya6Ieq5Yqo6K6+572u5Li6dHJ1ZVxuXG4gICAgc2VsZi5kcmFnRW5hYmxlZCAgICAgPSB0cnVlIDsvL1wiZHJhZ0VuYWJsZWRcIiBpbiBvcHQgPyBvcHQuZHJhZ0VuYWJsZWQgOiBmYWxzZTsgICAvL+aYr+WQpuWQr+eUqOWFg+e0oOeahOaLluaLvVxuXG4gICAgc2VsZi54eVRvSW50ICAgICAgICAgPSBcInh5VG9JbnRcIiBpbiBvcHQgPyBvcHQueHlUb0ludCA6IHRydWU7ICAgIC8v5piv5ZCm5a+5eHnlnZDmoIfnu5/kuIBpbnTlpITnkIbvvIzpu5jorqTkuLp0cnVl77yM5L2G5piv5pyJ55qE5pe25YCZ5Y+v5Lul55Sx5aSW55WM55So5oi35omL5Yqo5oyH5a6a5piv5ZCm6ZyA6KaB6K6h566X5Li6aW5077yM5Zug5Li65pyJ55qE5pe25YCZ5LiN6K6h566X5q+U6L6D5aW977yM5q+U5aaC77yM6L+b5bqm5Zu+6KGo5Lit77yM5YaNc2VjdG9y55qE5Lik56uv5re75Yqg5Lik5Liq5ZyG5p2l5YGa5ZyG6KeS55qE6L+b5bqm5p2h55qE5pe25YCZ77yM5ZyGY2lyY2xl5LiN5YGaaW506K6h566X77yM5omN6IO95ZKMc2VjdG9y5pu05aW955qE6KGU5o6lXG5cbiAgICBzZWxmLm1vdmVpbmcgPSBmYWxzZTsgLy/lpoLmnpzlhYPntKDlnKjmnIDovajpgZPov5DliqjkuK3nmoTml7blgJnvvIzmnIDlpb3miorov5nkuKrorr7nva7kuLp0cnVl77yM6L+Z5qC36IO95L+d6K+B6L2o6L+555qE5Lid5pCs6aG65ruR77yM5ZCm5YiZ5Zug5Li6eHlUb0ludOeahOWOn+WboO+8jOS8muaciei3s+i3g1xuXG4gICAgLy/liJvlu7rlpb1jb250ZXh0XG4gICAgc2VsZi5fY3JlYXRlQ29udGV4dCggb3B0ICk7XG5cbiAgICB2YXIgVUlEID0gQmFzZS5jcmVhdGVJZChzZWxmLnR5cGUpO1xuXG4gICAgLy/lpoLmnpzmsqHmnIlpZCDliJkg5rK/55SodWlkXG4gICAgaWYoc2VsZi5pZCA9PSBudWxsKXtcbiAgICAgICAgc2VsZi5pZCA9IFVJRCA7XG4gICAgfTtcblxuICAgIHNlbGYuaW5pdC5hcHBseShzZWxmICwgYXJndW1lbnRzKTtcblxuICAgIC8v5omA5pyJ5bGe5oCn5YeG5aSH5aW95LqG5ZCO77yM5YWI6KaB6K6h566X5LiA5qyhdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCnlvpfliLBfdGFuc2Zvcm1cbiAgICB0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKTtcbn07XG5cbi8qKlxuICog566A5Y2V55qE5rWF5aSN5Yi25a+56LGh44CCXG4gKiBAcGFyYW0gc3RyaWN0ICDlvZPkuLp0cnVl5pe25Y+q6KaG55uW5bey5pyJ5bGe5oCnXG4gKi9cbnZhciBjb3B5ID0gZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UsIHN0cmljdCl7IFxuICAgIGlmICggXy5pc0VtcHR5KHNvdXJjZSkgKXtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgZm9yKHZhciBrZXkgaW4gc291cmNlKXtcbiAgICAgICAgaWYoIXN0cmljdCB8fCB0YXJnZXQuaGFzT3duUHJvcGVydHkoa2V5KSB8fCB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cbkJhc2UuY3JlYXRDbGFzcyggRGlzcGxheU9iamVjdCAsIEV2ZW50RGlzcGF0Y2hlciAsIHtcbiAgICBpbml0IDogZnVuY3Rpb24oKXt9LFxuICAgIF9jcmVhdGVDb250ZXh0IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8v5omA5pyJ5pi+56S65a+56LGh77yM6YO95pyJ5LiA5Liq57G75Ly8Y2FudmFzLmNvbnRleHTnsbvkvLznmoQgY29udGV4dOWxnuaAp1xuICAgICAgICAvL+eUqOadpeWtmOWPluaUueaYvuekuuWvueixoeaJgOacieWSjOaYvuekuuacieWFs+eahOWxnuaAp++8jOWdkOagh++8jOagt+W8j+etieOAglxuICAgICAgICAvL+ivpeWvueixoeS4ukNvZXIuUHJvcGVydHlGYWN0b3J5KCnlt6XljoLlh73mlbDnlJ/miJBcbiAgICAgICAgc2VsZi5jb250ZXh0ID0gbnVsbDtcblxuICAgICAgICAvL+aPkOS+m+e7mUNvZXIuUHJvcGVydHlGYWN0b3J5KCkg5p2lIOe7mSBzZWxmLmNvbnRleHQg6K6+572uIHByb3BlcnR5c1xuICAgICAgICAvL+i/memHjOS4jeiDveeUqF8uZXh0ZW5k77yMIOWboOS4uuimgeS/neivgV9jb250ZXh0QVRUUlPnmoTnuq/nsrnvvIzlj6ropobnm5bkuIvpnaLlt7LmnInnmoTlsZ7mgKdcbiAgICAgICAgdmFyIF9jb250ZXh0QVRUUlMgPSBjb3B5KCB7XG4gICAgICAgICAgICB3aWR0aCAgICAgICAgIDogMCxcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgOiAwLFxuICAgICAgICAgICAgeCAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICB5ICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgIHNjYWxlWCAgICAgICAgOiAxLFxuICAgICAgICAgICAgc2NhbGVZICAgICAgICA6IDEsXG4gICAgICAgICAgICBzY2FsZU9yaWdpbiAgIDoge1xuICAgICAgICAgICAgICAgIHggOiAwLFxuICAgICAgICAgICAgICAgIHkgOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm90YXRpb24gICAgICA6IDAsXG4gICAgICAgICAgICByb3RhdGVPcmlnaW4gIDogIHtcbiAgICAgICAgICAgICAgICB4IDogMCxcbiAgICAgICAgICAgICAgICB5IDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGUgICAgICAgOiB0cnVlLFxuICAgICAgICAgICAgY3Vyc29yICAgICAgICA6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgLy9jYW52YXMgY29udGV4dCAyZCDnmoQg57O757uf5qC35byP44CC55uu5YmN5bCx55+l6YGT6L+Z5LmI5aSaXG4gICAgICAgICAgICBmaWxsU3R5bGUgICAgIDogbnVsbCwvL1wiIzAwMDAwMFwiLFxuICAgICAgICAgICAgbGluZUNhcCAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBsaW5lSm9pbiAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIGxpbmVXaWR0aCAgICAgOiBudWxsLFxuICAgICAgICAgICAgbWl0ZXJMaW1pdCAgICA6IG51bGwsXG4gICAgICAgICAgICBzaGFkb3dCbHVyICAgIDogbnVsbCxcbiAgICAgICAgICAgIHNoYWRvd0NvbG9yICAgOiBudWxsLFxuICAgICAgICAgICAgc2hhZG93T2Zmc2V0WCA6IG51bGwsXG4gICAgICAgICAgICBzaGFkb3dPZmZzZXRZIDogbnVsbCxcbiAgICAgICAgICAgIHN0cm9rZVN0eWxlICAgOiBudWxsLFxuICAgICAgICAgICAgZ2xvYmFsQWxwaGEgICA6IDEsXG4gICAgICAgICAgICBmb250ICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIHRleHRBbGlnbiAgICAgOiBcImxlZnRcIixcbiAgICAgICAgICAgIHRleHRCYXNlbGluZSAgOiBcInRvcFwiLCBcbiAgICAgICAgICAgIGFyY1NjYWxlWF8gICAgOiBudWxsLFxuICAgICAgICAgICAgYXJjU2NhbGVZXyAgICA6IG51bGwsXG4gICAgICAgICAgICBsaW5lU2NhbGVfICAgIDogbnVsbCxcbiAgICAgICAgICAgIGdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA6IG51bGxcbiAgICAgICAgfSAsIG9wdC5jb250ZXh0ICwgdHJ1ZSApOyAgICAgICAgICAgIFxuXG4gICAgICAgIC8v54S25ZCO55yL57un5om/6ICF5piv5ZCm5pyJ5o+Q5L6bX2NvbnRleHQg5a+56LGhIOmcgOimgSDmiJEgbWVyZ2XliLBfY29udGV4dDJEX2NvbnRleHTkuK3ljrvnmoRcbiAgICAgICAgaWYgKHNlbGYuX2NvbnRleHQpIHtcbiAgICAgICAgICAgIF9jb250ZXh0QVRUUlMgPSBfLmV4dGVuZChfY29udGV4dEFUVFJTICwgc2VsZi5fY29udGV4dCApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/mnInkupvlvJXmk47lhoXpg6jorr7nva5jb250ZXh05bGe5oCn55qE5pe25YCZ5piv5LiN55So5LiK5oql5b+D6Lez55qE77yM5q+U5aaC5YGaaGl0VGVzdFBvaW5054Ot54K55qOA5rWL55qE5pe25YCZXG4gICAgICAgIHNlbGYuX25vdFdhdGNoID0gZmFsc2U7XG5cbiAgICAgICAgX2NvbnRleHRBVFRSUy4kb3duZXIgPSBzZWxmO1xuICAgICAgICBfY29udGV4dEFUVFJTLiR3YXRjaCA9IGZ1bmN0aW9uKG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlKXtcblxuICAgICAgICAgICAgLy/kuIvpnaLnmoTov5nkupvlsZ7mgKflj5jljJbvvIzpg73kvJrpnIDopoHph43mlrDnu4Tnu4fnn6npmLXlsZ7mgKdfdHJhbnNmb3JtIFxuICAgICAgICAgICAgdmFyIHRyYW5zRm9ybVByb3BzID0gWyBcInhcIiAsIFwieVwiICwgXCJzY2FsZVhcIiAsIFwic2NhbGVZXCIgLCBcInJvdGF0aW9uXCIgLCBcInNjYWxlT3JpZ2luXCIgLCBcInJvdGF0ZU9yaWdpbiwgbGluZVdpZHRoXCIgXTtcblxuICAgICAgICAgICAgaWYoIF8uaW5kZXhPZiggdHJhbnNGb3JtUHJvcHMgLCBuYW1lICkgPj0gMCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRvd25lci5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiggdGhpcy4kb3duZXIuX25vdFdhdGNoICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMuJG93bmVyLiR3YXRjaCApe1xuICAgICAgICAgICAgICAgIHRoaXMuJG93bmVyLiR3YXRjaCggbmFtZSAsIHZhbHVlICwgcHJlVmFsdWUgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJG93bmVyLmhlYXJ0QmVhdCgge1xuICAgICAgICAgICAgICAgIGNvbnZlcnRUeXBlOlwiY29udGV4dFwiLFxuICAgICAgICAgICAgICAgIHNoYXBlICAgICAgOiB0aGlzLiRvd25lcixcbiAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogbmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZSAgICAgIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgcHJlVmFsdWUgICA6IHByZVZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5omn6KGMaW5pdOS5i+WJje+8jOW6lOivpeWwseagueaNruWPguaVsO+8jOaKimNvbnRleHTnu4Tnu4flpb3nur9cbiAgICAgICAgc2VsZi5jb250ZXh0ID0gUHJvcGVydHlGYWN0b3J5KCBfY29udGV4dEFUVFJTICk7XG4gICAgfSxcbiAgICAvKiBAbXlzZWxmIOaYr+WQpueUn+aIkOiHquW3seeahOmVnOWDjyBcbiAgICAgKiDlhYvpmoblj4jkuKTnp43vvIzkuIDnp43mmK/plZzlg4/vvIzlj6blpJbkuIDnp43mmK/nu53lr7nmhI/kuYnkuIrpnaLnmoTmlrDkuKrkvZNcbiAgICAgKiDpu5jorqTkuLrnu53lr7nmhI/kuYnkuIrpnaLnmoTmlrDkuKrkvZPvvIzmlrDlr7nosaFpZOS4jeiDveebuOWQjFxuICAgICAqIOmVnOWDj+WfuuacrOS4iuaYr+ahhuaetuWGhemDqOWcqOWunueOsCAg6ZWc5YOP55qEaWTnm7jlkIwg5Li76KaB55So5p2l5oqK6Ieq5bex55S75Yiw5Y+m5aSW55qEc3RhZ2Xph4zpnaLvvIzmr5TlpoJcbiAgICAgKiBtb3VzZW92ZXLlkoxtb3VzZW91dOeahOaXtuWAmeiwg+eUqCovXG4gICAgY2xvbmUgOiBmdW5jdGlvbiggbXlzZWxmICl7XG4gICAgICAgIHZhciBjb25mICAgPSB7XG4gICAgICAgICAgICBpZCAgICAgIDogdGhpcy5pZCxcbiAgICAgICAgICAgIGNvbnRleHQgOiBfLmNsb25lKHRoaXMuY29udGV4dC4kbW9kZWwpXG4gICAgICAgIH07XG4gICAgICAgIGlmKCB0aGlzLmltZyApe1xuICAgICAgICAgICAgY29uZi5pbWcgPSB0aGlzLmltZztcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG5ld09iajtcbiAgICAgICAgaWYoIHRoaXMudHlwZSA9PSAndGV4dCcgKXtcbiAgICAgICAgICAgIG5ld09iaiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKCB0aGlzLnRleHQgLCBjb25mICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdPYmogPSBuZXcgdGhpcy5jb25zdHJ1Y3RvciggY29uZiApO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmNoaWxkcmVuICl7XG4gICAgICAgICAgICBuZXdPYmouY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbXlzZWxmKXtcbiAgICAgICAgICAgIG5ld09iai5pZCAgICAgICA9IEJhc2UuY3JlYXRlSWQobmV3T2JqLnR5cGUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbmV3T2JqO1xuICAgIH0sXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgLy9zdGFnZeWtmOWcqO+8jOaJjeivtHNlbGbku6PooajnmoRkaXNwbGF55bey57uP6KKr5re75Yqg5Yiw5LqGZGlzcGxheUxpc3TkuK3vvIznu5jlm77lvJXmk47pnIDopoHnn6XpgZPlhbbmlLnlj5jlkI5cbiAgICAgICAgLy/nmoTlsZ7mgKfvvIzmiYDku6XvvIzpgJrnn6XliLBzdGFnZS5kaXNwbGF5QXR0ckhhc0NoYW5nZVxuICAgICAgICB2YXIgc3RhZ2UgPSB0aGlzLmdldFN0YWdlKCk7XG4gICAgICAgIGlmKCBzdGFnZSApe1xuICAgICAgICAgICAgdGhpcy5faGVhcnRCZWF0TnVtICsrO1xuICAgICAgICAgICAgc3RhZ2UuaGVhcnRCZWF0ICYmIHN0YWdlLmhlYXJ0QmVhdCggb3B0ICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldEN1cnJlbnRXaWR0aCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuY29udGV4dC53aWR0aCAqIHRoaXMuY29udGV4dC5zY2FsZVgpO1xuICAgIH0sXG4gICAgZ2V0Q3VycmVudEhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuY29udGV4dC5oZWlnaHQgKiB0aGlzLmNvbnRleHQuc2NhbGVZKTtcbiAgICB9LFxuICAgIGdldFN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMuc3RhZ2UgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFnZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHAgPSB0aGlzO1xuICAgICAgICBpZiAocC50eXBlICE9IFwic3RhZ2VcIil7XG4gICAgICAgICAgd2hpbGUocC5wYXJlbnQpIHtcbiAgICAgICAgICAgIHAgPSBwLnBhcmVudDtcbiAgICAgICAgICAgIGlmIChwLnR5cGUgPT0gXCJzdGFnZVwiKXtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAocC50eXBlICE9PSBcInN0YWdlXCIpIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5b6X5Yiw55qE6aG254K5ZGlzcGxheSDnmoR0eXBl5LiN5pivU3RhZ2Us5Lmf5bCx5piv6K+05LiN5pivc3RhZ2XlhYPntKBcbiAgICAgICAgICAgIC8v6YKj5LmI5Y+q6IO96K+05piO6L+Z5LiqcOaJgOS7o+ihqOeahOmhtuerr2Rpc3BsYXkg6L+Y5rKh5pyJ5re75Yqg5YiwZGlzcGxheUxpc3TkuK3vvIzkuZ/lsLHmmK/msqHmnInmsqHmt7vliqDliLBcbiAgICAgICAgICAgIC8vc3RhZ2XoiJ7lj7DnmoRjaGlsZGVu6Zif5YiX5Lit77yM5LiN5Zyo5byV5pOO5riy5p+T6IyD5Zu05YaFXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICAvL+S4gOebtOWbnua6r+WIsOmhtuWxgm9iamVjdO+8jCDljbPmmK9zdGFnZe+8jCBzdGFnZeeahHBhcmVudOS4um51bGxcbiAgICAgICAgdGhpcy5zdGFnZSA9IHA7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH0sXG4gICAgbG9jYWxUb0dsb2JhbCA6IGZ1bmN0aW9uKCBwb2ludCAsIGNvbnRhaW5lciApe1xuICAgICAgICAhcG9pbnQgJiYgKCBwb2ludCA9IG5ldyBQb2ludCggMCAsIDAgKSApO1xuICAgICAgICB2YXIgY20gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCggY29udGFpbmVyICk7XG5cbiAgICAgICAgaWYgKGNtID09IG51bGwpIHJldHVybiBQb2ludCggMCAsIDAgKTtcbiAgICAgICAgdmFyIG0gPSBuZXcgTWF0cml4KDEsIDAsIDAsIDEsIHBvaW50LnggLCBwb2ludC55KTtcbiAgICAgICAgbS5jb25jYXQoY20pO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCBtLnR4ICwgbS50eSApOyAvL3t4Om0udHgsIHk6bS50eX07XG4gICAgfSxcbiAgICBnbG9iYWxUb0xvY2FsIDogZnVuY3Rpb24oIHBvaW50ICwgY29udGFpbmVyKSB7XG4gICAgICAgICFwb2ludCAmJiAoIHBvaW50ID0gbmV3IFBvaW50KCAwICwgMCApICk7XG5cbiAgICAgICAgaWYoIHRoaXMudHlwZSA9PSBcInN0YWdlXCIgKXtcbiAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY20gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCggY29udGFpbmVyICk7XG5cbiAgICAgICAgaWYgKGNtID09IG51bGwpIHJldHVybiBuZXcgUG9pbnQoIDAgLCAwICk7IC8ve3g6MCwgeTowfTtcbiAgICAgICAgY20uaW52ZXJ0KCk7XG4gICAgICAgIHZhciBtID0gbmV3IE1hdHJpeCgxLCAwLCAwLCAxLCBwb2ludC54ICwgcG9pbnQueSk7XG4gICAgICAgIG0uY29uY2F0KGNtKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggbS50eCAsIG0udHkgKTsgLy97eDptLnR4LCB5Om0udHl9O1xuICAgIH0sXG4gICAgbG9jYWxUb1RhcmdldCA6IGZ1bmN0aW9uKCBwb2ludCAsIHRhcmdldCl7XG4gICAgICAgIHZhciBwID0gbG9jYWxUb0dsb2JhbCggcG9pbnQgKTtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5nbG9iYWxUb0xvY2FsKCBwICk7XG4gICAgfSxcbiAgICBnZXRDb25jYXRlbmF0ZWRNYXRyaXggOiBmdW5jdGlvbiggY29udGFpbmVyICl7XG4gICAgICAgIHZhciBjbSA9IG5ldyBNYXRyaXgoKTtcbiAgICAgICAgZm9yICh2YXIgbyA9IHRoaXM7IG8gIT0gbnVsbDsgbyA9IG8ucGFyZW50KSB7XG4gICAgICAgICAgICBjbS5jb25jYXQoIG8uX3RyYW5zZm9ybSApO1xuICAgICAgICAgICAgaWYoICFvLnBhcmVudCB8fCAoIGNvbnRhaW5lciAmJiBvLnBhcmVudCAmJiBvLnBhcmVudCA9PSBjb250YWluZXIgKSB8fCAoIG8ucGFyZW50ICYmIG8ucGFyZW50LnR5cGU9PVwic3RhZ2VcIiApICkge1xuICAgICAgICAgICAgLy9pZiggby50eXBlID09IFwic3RhZ2VcIiB8fCAoby5wYXJlbnQgJiYgY29udGFpbmVyICYmIG8ucGFyZW50LnR5cGUgPT0gY29udGFpbmVyLnR5cGUgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY207Ly9icmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY207XG4gICAgfSxcbiAgICAvKlxuICAgICAq6K6+572u5YWD57Sg55qE5piv5ZCm5ZON5bqU5LqL5Lu25qOA5rWLXG4gICAgICpAYm9vbCAgQm9vbGVhbiDnsbvlnotcbiAgICAgKi9cbiAgICBzZXRFdmVudEVuYWJsZSA6IGZ1bmN0aW9uKCBib29sICl7XG4gICAgICAgIGlmKF8uaXNCb29sZWFuKGJvb2wpKXtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGJvb2xcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvKlxuICAgICAq5p+l6K+i6Ieq5bex5ZyocGFyZW5055qE6Zif5YiX5Lit55qE5L2N572uXG4gICAgICovXG4gICAgZ2V0SW5kZXggICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF8uaW5kZXhPZih0aGlzLnBhcmVudC5jaGlsZHJlbiAsIHRoaXMpXG4gICAgfSxcbiAgICAvKlxuICAgICAq5YWD57Sg5Zyoeui9tOaWueWQkeWQkeS4i+enu+WKqFxuICAgICAqQG51bSDnp7vliqjnmoTlsYLnuqdcbiAgICAgKi9cbiAgICB0b0JhY2sgOiBmdW5jdGlvbiggbnVtICl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnJvbUluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xuICAgICAgICB2YXIgdG9JbmRleCA9IDA7XG4gICAgICAgIFxuICAgICAgICBpZihfLmlzTnVtYmVyKCBudW0gKSl7XG4gICAgICAgICAgaWYoIG51bSA9PSAwICl7XG4gICAgICAgICAgICAgLy/ljp/lnLDkuI3liqhcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0b0luZGV4ID0gZnJvbUluZGV4IC0gbnVtO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZSggZnJvbUluZGV4ICwgMSApWzBdO1xuICAgICAgICBpZiggdG9JbmRleCA8IDAgKXtcbiAgICAgICAgICAgIHRvSW5kZXggPSAwO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZEF0KCBtZSAsIHRvSW5kZXggKTtcbiAgICB9LFxuICAgIC8qXG4gICAgICrlhYPntKDlnKh66L205pa55ZCR5ZCR5LiK56e75YqoXG4gICAgICpAbnVtIOenu+WKqOeahOWxguaVsOmHjyDpu5jorqTliLDpobbnq69cbiAgICAgKi9cbiAgICB0b0Zyb250IDogZnVuY3Rpb24oIG51bSApe1xuICAgICAgICBpZighdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21JbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcbiAgICAgICAgdmFyIHBjbCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgdmFyIHRvSW5kZXggPSBwY2w7XG4gICAgICAgIFxuICAgICAgICBpZihfLmlzTnVtYmVyKCBudW0gKSl7XG4gICAgICAgICAgaWYoIG51bSA9PSAwICl7XG4gICAgICAgICAgICAgLy/ljp/lnLDkuI3liqhcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvSW5kZXggPSBmcm9tSW5kZXggKyBudW0gKyAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZSggZnJvbUluZGV4ICwgMSApWzBdO1xuICAgICAgICBpZih0b0luZGV4ID4gcGNsKXtcbiAgICAgICAgICAgIHRvSW5kZXggPSBwY2w7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGRBdCggbWUgLCB0b0luZGV4LTEgKTtcbiAgICB9LFxuICAgIF90cmFuc2Zvcm1IYW5kZXIgOiBmdW5jdGlvbiggY3R4ICl7XG4gICAgICAgIHZhciB0cmFuc0Zvcm0gPSB0aGlzLl90cmFuc2Zvcm07XG4gICAgICAgIGlmKCAhdHJhbnNGb3JtICkge1xuICAgICAgICAgICAgdHJhbnNGb3JtID0gdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8v6L+Q55So55+p6Zi15byA5aeL5Y+Y5b2iXG4gICAgICAgIGN0eC50cmFuc2Zvcm0uYXBwbHkoIGN0eCAsIHRyYW5zRm9ybS50b0FycmF5KCkgKTtcbiAgICAgICAgLy9jdHguZ2xvYmFsQWxwaGEgKj0gdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgIH0sXG4gICAgX3VwZGF0ZVRyYW5zZm9ybSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3RyYW5zZm9ybSA9IG5ldyBNYXRyaXgoKTtcbiAgICAgICAgX3RyYW5zZm9ybS5pZGVudGl0eSgpO1xuICAgICAgICB2YXIgY3R4ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICAvL+aYr+WQpumcgOimgVRyYW5zZm9ybVxuICAgICAgICBpZihjdHguc2NhbGVYICE9PSAxIHx8IGN0eC5zY2FsZVkgIT09MSApe1xuICAgICAgICAgICAgLy/lpoLmnpzmnInnvKnmlL5cbiAgICAgICAgICAgIC8v57yp5pS+55qE5Y6f54K55Z2Q5qCHXG4gICAgICAgICAgICB2YXIgb3JpZ2luID0gbmV3IFBvaW50KGN0eC5zY2FsZU9yaWdpbik7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggLW9yaWdpbi54ICwgLW9yaWdpbi55ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdHJhbnNmb3JtLnNjYWxlKCBjdHguc2NhbGVYICwgY3R4LnNjYWxlWSApO1xuICAgICAgICAgICAgaWYoIG9yaWdpbi54IHx8IG9yaWdpbi55ICl7XG4gICAgICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIG9yaWdpbi54ICwgb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHJvdGF0aW9uID0gY3R4LnJvdGF0aW9uO1xuICAgICAgICBpZiggcm90YXRpb24gKXtcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJ5peL6L2sXG4gICAgICAgICAgICAvL+aXi+i9rOeahOWOn+eCueWdkOagh1xuICAgICAgICAgICAgdmFyIG9yaWdpbiA9IG5ldyBQb2ludChjdHgucm90YXRlT3JpZ2luKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCAtb3JpZ2luLnggLCAtb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKCByb3RhdGlvbiAlIDM2MCAqIE1hdGguUEkvMTgwICk7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggb3JpZ2luLnggLCBvcmlnaW4ueSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5aaC5p6c5pyJ5L2N56e7XG4gICAgICAgIHZhciB4LHk7XG4gICAgICAgIGlmKCB0aGlzLnh5VG9JbnQgJiYgIXRoaXMubW92ZWluZyApe1xuICAgICAgICAgICAgLy/lvZPov5nkuKrlhYPntKDlnKjlgZrovajov7nov5DliqjnmoTml7blgJnvvIzmr5TlpoJkcmFn77yMYW5pbWF0aW9u5aaC5p6c5a6e5pe255qE6LCD5pW06L+Z5LiqeCDvvIwgeVxuICAgICAgICAgICAgLy/pgqPkuYjor6XlhYPntKDnmoTovajov7nkvJrmnInot7Pot4PnmoTmg4XlhrXlj5HnlJ/jgILmiYDku6XliqDkuKrmnaHku7bov4fmu6TvvIxcbiAgICAgICAgICAgIHZhciB4ID0gcGFyc2VJbnQoIGN0eC54ICk7Ly9NYXRoLnJvdW5kKGN0eC54KTtcbiAgICAgICAgICAgIHZhciB5ID0gcGFyc2VJbnQoIGN0eC55ICk7Ly9NYXRoLnJvdW5kKGN0eC55KTtcblxuICAgICAgICAgICAgaWYoIHBhcnNlSW50KGN0eC5saW5lV2lkdGggLCAxMCkgJSAyID09IDEgJiYgY3R4LnN0cm9rZVN0eWxlICl7XG4gICAgICAgICAgICAgICAgeCArPSAwLjU7XG4gICAgICAgICAgICAgICAgeSArPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ID0gY3R4Lng7XG4gICAgICAgICAgICB5ID0gY3R4Lnk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIHggIT0gMCB8fCB5ICE9IDAgKXtcbiAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCB4ICwgeSApO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm0gPSBfdHJhbnNmb3JtO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuaWQrXCI6dHhfXCIrX3RyYW5zZm9ybS50eCtcIjpjeF9cIit0aGlzLmNvbnRleHQueCk7XG5cbiAgICAgICAgcmV0dXJuIF90cmFuc2Zvcm07XG4gICAgfSxcbiAgICAvL+aYvuekuuWvueixoeeahOmAieWPluajgOa1i+WkhOeQhuWHveaVsFxuICAgIGdldENoaWxkSW5Qb2ludCA6IGZ1bmN0aW9uKCBwb2ludCApe1xuICAgICAgICB2YXIgcmVzdWx0OyAvL+ajgOa1i+eahOe7k+aenFxuXG4gICAgICAgIC8v56ys5LiA5q2l77yM5ZCnZ2xvYueahHBvaW506L2s5o2i5Yiw5a+55bqU55qEb2Jq55qE5bGC57qn5YaF55qE5Z2Q5qCH57O757ufXG4gICAgICAgIGlmKCB0aGlzLnR5cGUgIT0gXCJzdGFnZVwiICYmIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LnR5cGUgIT0gXCJzdGFnZVwiICkge1xuICAgICAgICAgICAgcG9pbnQgPSB0aGlzLnBhcmVudC5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB4ID0gcG9pbnQueDtcbiAgICAgICAgdmFyIHkgPSBwb2ludC55O1xuXG4gICAgICAgIC8v6L+Z5Liq5pe25YCZ5aaC5p6c5pyJ5a+5Y29udGV4dOeahHNldO+8jOWRiuivieW8leaTjuS4jemcgOimgXdhdGNo77yM5Zug5Li66L+Z5Liq5piv5byV5pOO6Kem5Y+R55qE77yM5LiN5piv55So5oi3XG4gICAgICAgIC8v55So5oi3c2V0IGNvbnRleHQg5omN6ZyA6KaB6Kem5Y+Rd2F0Y2hcbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSB0cnVlO1xuICAgIFxuICAgICAgICAvL+Wvuem8oOagh+eahOWdkOagh+S5n+WBmuebuOWQjOeahOWPmOaNolxuICAgICAgICBpZiggdGhpcy5fdHJhbnNmb3JtICl7XG4gICAgICAgICAgICB2YXIgaW52ZXJzZU1hdHJpeCA9IHRoaXMuX3RyYW5zZm9ybS5jbG9uZSgpLmludmVydCgpO1xuICAgICAgICAgICAgdmFyIG9yaWdpblBvcyA9IFt4LCB5XTtcbiAgICAgICAgICAgIG9yaWdpblBvcyA9IGludmVyc2VNYXRyaXgubXVsVmVjdG9yKCBvcmlnaW5Qb3MgKTtcblxuICAgICAgICAgICAgeCA9IG9yaWdpblBvc1swXTtcbiAgICAgICAgICAgIHkgPSBvcmlnaW5Qb3NbMV07XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9yZWN0ID0gdGhpcy5fcmVjdCA9IHRoaXMuZ2V0UmVjdCh0aGlzLmNvbnRleHQpO1xuXG4gICAgICAgIGlmKCFfcmVjdCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIGlmKCAhdGhpcy5jb250ZXh0LndpZHRoICYmICEhX3JlY3Qud2lkdGggKXtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC53aWR0aCA9IF9yZWN0LndpZHRoO1xuICAgICAgICB9O1xuICAgICAgICBpZiggIXRoaXMuY29udGV4dC5oZWlnaHQgJiYgISFfcmVjdC5oZWlnaHQgKXtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSBfcmVjdC5oZWlnaHQ7XG4gICAgICAgIH07XG4gICAgICAgIGlmKCFfcmVjdC53aWR0aCB8fCAhX3JlY3QuaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIC8v5q2j5byP5byA5aeL56ys5LiA5q2l55qE55+p5b2i6IyD5Zu05Yik5patXG4gICAgICAgIGlmICggeCAgICA+PSBfcmVjdC54XG4gICAgICAgICAgICAmJiAgeCA8PSAoX3JlY3QueCArIF9yZWN0LndpZHRoKVxuICAgICAgICAgICAgJiYgIHkgPj0gX3JlY3QueVxuICAgICAgICAgICAgJiYgIHkgPD0gKF9yZWN0LnkgKyBfcmVjdC5oZWlnaHQpXG4gICAgICAgICkge1xuICAgICAgICAgICAvL+mCo+S5iOWwseWcqOi/meS4quWFg+e0oOeahOefqeW9ouiMg+WbtOWGhVxuICAgICAgICAgICByZXN1bHQgPSBIaXRUZXN0UG9pbnQuaXNJbnNpZGUoIHRoaXMgLCB7XG4gICAgICAgICAgICAgICB4IDogeCxcbiAgICAgICAgICAgICAgIHkgOiB5XG4gICAgICAgICAgIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgLy/lpoLmnpzov57nn6nlvaLlhoXpg73kuI3mmK/vvIzpgqPkuYjogq/lrprnmoTvvIzov5nkuKrkuI3mmK/miJHku6zopoHmib7nmoRzaGFwXG4gICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICAvKlxuICAgICogYW5pbWF0ZVxuICAgICogQHBhcmFtIHRvQ29udGVudCDopoHliqjnlLvlj5jlvaLliLDnmoTlsZ7mgKfpm4blkIhcbiAgICAqIEBwYXJhbSBvcHRpb25zIHR3ZWVuIOWKqOeUu+WPguaVsFxuICAgICovXG4gICAgYW5pbWF0ZSA6IGZ1bmN0aW9uKCB0b0NvbnRlbnQgLCBvcHRpb25zICl7XG4gICAgICAgIHZhciB0byA9IHRvQ29udGVudDtcbiAgICAgICAgdmFyIGZyb20gPSB7fTtcbiAgICAgICAgZm9yKCB2YXIgcCBpbiB0byApe1xuICAgICAgICAgICAgZnJvbVsgcCBdID0gdGhpcy5jb250ZXh0W3BdO1xuICAgICAgICB9O1xuICAgICAgICAhb3B0aW9ucyAmJiAob3B0aW9ucyA9IHt9KTtcbiAgICAgICAgb3B0aW9ucy5mcm9tID0gZnJvbTtcbiAgICAgICAgb3B0aW9ucy50byA9IHRvO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHVwRnVuID0gZnVuY3Rpb24oKXt9O1xuICAgICAgICBpZiggb3B0aW9ucy5vblVwZGF0ZSApe1xuICAgICAgICAgICAgdXBGdW4gPSBvcHRpb25zLm9uVXBkYXRlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgdHdlZW47XG4gICAgICAgIG9wdGlvbnMub25VcGRhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy/lpoLmnpxjb250ZXh05LiN5a2Y5Zyo6K+05piO6K+lb2Jq5bey57uP6KKrZGVzdHJveeS6hu+8jOmCo+S5iOimgeaKiuS7lueahHR3ZWVu57uZZGVzdHJveVxuICAgICAgICAgICAgaWYgKCFzZWxmLmNvbnRleHQgJiYgdHdlZW4pIHtcbiAgICAgICAgICAgICAgICBBbmltYXRpb25GcmFtZS5kZXN0cm95VHdlZW4odHdlZW4pO1xuICAgICAgICAgICAgICAgIHR3ZWVuID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yKCB2YXIgcCBpbiB0aGlzICl7XG4gICAgICAgICAgICAgICAgc2VsZi5jb250ZXh0W3BdID0gdGhpc1twXTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB1cEZ1bi5hcHBseShzZWxmICwgW3RoaXNdKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGNvbXBGdW4gPSBmdW5jdGlvbigpe307XG4gICAgICAgIGlmKCBvcHRpb25zLm9uQ29tcGxldGUgKXtcbiAgICAgICAgICAgIGNvbXBGdW4gPSBvcHRpb25zLm9uQ29tcGxldGU7XG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMub25Db21wbGV0ZSA9IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgICAgIGNvbXBGdW4uYXBwbHkoc2VsZiAsIGFyZ3VtZW50cylcbiAgICAgICAgfTtcbiAgICAgICAgdHdlZW4gPSBBbmltYXRpb25GcmFtZS5yZWdpc3RUd2Vlbiggb3B0aW9ucyApO1xuICAgICAgICByZXR1cm4gdHdlZW47XG4gICAgfSxcbiAgICBfcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApe1x0XG4gICAgICAgIGlmKCAhdGhpcy5jb250ZXh0LnZpc2libGUgfHwgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhIDw9IDAgKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm1IYW5kZXIoIGN0eCApO1xuXG4gICAgICAgIC8v5paH5pys5pyJ6Ieq5bex55qE6K6+572u5qC35byP5pa55byPXG4gICAgICAgIGlmKCB0aGlzLnR5cGUgIT0gXCJ0ZXh0XCIgKSB7XG4gICAgICAgICAgICBCYXNlLnNldENvbnRleHRTdHlsZSggY3R4ICwgdGhpcy5jb250ZXh0LiRtb2RlbCApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoIGN0eCApO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0sXG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApIHtcbiAgICAgICAgLy/ln7rnsbvkuI3mj5DkvptyZW5kZXLnmoTlhbfkvZPlrp7njrDvvIznlLHlkI7nu63lhbfkvZPnmoTmtL7nlJ/nsbvlkIToh6rlrp7njrBcbiAgICB9LFxuICAgIC8v5LuO5qCR5Lit5Yig6ZmkXG4gICAgcmVtb3ZlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lhYPntKDnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/mioroh6rlt7Hku47niLboioLngrnkuK3liKDpmaTkuoblkI7lgZroh6rmiJHmuIXpmaTvvIzph4rmlL7lhoXlrZhcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dDtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BsYXlPYmplY3Q7XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzM+eahERpc3BsYXlMaXN0IOS4reeahOWuueWZqOexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XG5cbnZhciBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gZnVuY3Rpb24ob3B0KXtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuY2hpbGRyZW4gPSBbXTtcbiAgIHNlbGYubW91c2VDaGlsZHJlbiA9IFtdO1xuICAgRGlzcGxheU9iamVjdENvbnRhaW5lci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgIC8v5omA5pyJ55qE5a655Zmo6buY6K6k5pSv5oyBZXZlbnQg5qOA5rWL77yM5Zug5Li6IOWPr+iDveaciemHjOmdoueahHNoYXBl5pivZXZlbnRFbmFibGXmmK90cnVl55qEXG4gICAvL+WmguaenOeUqOaIt+acieW8uuWItueahOmcgOaxguiuqeWuueWZqOS4i+eahOaJgOacieWFg+e0oOmDvSDkuI3lj6/mo4DmtYvvvIzlj6/ku6XosIPnlKhcbiAgIC8vRGlzcGxheU9iamVjdENvbnRhaW5lcueahCBzZXRFdmVudEVuYWJsZSgpIOaWueazlVxuICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbn07XG5cbkJhc2UuY3JlYXRDbGFzcyggRGlzcGxheU9iamVjdENvbnRhaW5lciAsIERpc3BsYXlPYmplY3QgLCB7XG4gICAgYWRkQ2hpbGQgOiBmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgIGlmKCAhY2hpbGQgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIGlmKHRoaXMuZ2V0Q2hpbGRJbmRleChjaGlsZCkgIT0gLTEpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH07XG4gICAgICAgIC8v5aaC5p6c5LuW5Zyo5Yir55qE5a2Q5YWD57Sg5Lit77yM6YKj5LmI5bCx5LuO5Yir5Lq66YKj6YeM5Yig6Zmk5LqGXG4gICAgICAgIGlmKGNoaWxkLnBhcmVudCkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKCBjaGlsZCApO1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICA6IGNoaWxkLFxuICAgICAgICAgICAgIHNyYyAgICAgICAgIDogdGhpc1xuICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZih0aGlzLl9hZnRlckFkZENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJBZGRDaGlsZChjaGlsZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0sXG4gICAgYWRkQ2hpbGRBdCA6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCkge1xuICAgICAgICBpZih0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpICE9IC0xKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9O1xuICAgICAgICBpZihjaGlsZC5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAvL+S4iuaKpWNoaWxkcmVu5b+D6LezXG4gICAgICAgIGlmKHRoaXMuaGVhcnRCZWF0KXtcbiAgICAgICAgICAgdGhpcy5oZWFydEJlYXQoe1xuICAgICAgICAgICAgIGNvbnZlcnRUeXBlIDogXCJjaGlsZHJlblwiLFxuICAgICAgICAgICAgIHRhcmdldCAgICAgICA6IGNoaWxkLFxuICAgICAgICAgICAgIHNyYyAgICAgIDogdGhpc1xuICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuX2FmdGVyQWRkQ2hpbGQpe1xuICAgICAgICAgICB0aGlzLl9hZnRlckFkZENoaWxkKGNoaWxkLGluZGV4KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSxcbiAgICByZW1vdmVDaGlsZCA6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNoaWxkQXQoXy5pbmRleE9mKCB0aGlzLmNoaWxkcmVuICwgY2hpbGQgKSk7XG4gICAgfSxcbiAgICByZW1vdmVDaGlsZEF0IDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgaWYgKGNoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuaGVhcnRCZWF0KXtcbiAgICAgICAgICAgdGhpcy5oZWFydEJlYXQoe1xuICAgICAgICAgICAgIGNvbnZlcnRUeXBlIDogXCJjaGlsZHJlblwiLFxuICAgICAgICAgICAgIHRhcmdldCAgICAgICA6IGNoaWxkLFxuICAgICAgICAgICAgIHNyYyAgICAgIDogdGhpc1xuICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuX2FmdGVyRGVsQ2hpbGQpe1xuICAgICAgICAgICB0aGlzLl9hZnRlckRlbENoaWxkKGNoaWxkICwgaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGRCeUlkIDogZnVuY3Rpb24oIGlkICkge1x0XG4gICAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDaGlsZEF0KGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIHJlbW92ZUFsbENoaWxkcmVuIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoaWxlKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZEF0KDApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+mbhuWQiOexu+eahOiHquaIkemUgOavgVxuICAgIGRlc3Ryb3kgOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiggdGhpcy5wYXJlbnQgKXtcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZpcmUoXCJkZXN0cm95XCIpO1xuICAgICAgICAvL+S+neasoemUgOavgeaJgOacieWtkOWFg+e0oFxuICAgICAgICBmb3IgKHZhciBpPTAsbD10aGlzLmNoaWxkcmVuLmxlbmd0aCA7IGk8bCA7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmdldENoaWxkQXQoaSkuZGVzdHJveSgpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgbC0tO1xuICAgICAgICB9O1xuICAgIH0sXG4gICAgLypcbiAgICAgKkBpZCDlhYPntKDnmoRpZFxuICAgICAqQGJvb2xlbiDmmK/lkKbmt7Hluqbmn6Xor6LvvIzpu5jorqTlsLHlnKjnrKzkuIDlsYLlrZDlhYPntKDkuK3mn6Xor6JcbiAgICAgKiovXG4gICAgZ2V0Q2hpbGRCeUlkIDogZnVuY3Rpb24oaWQgLCBib29sZW4pe1xuICAgICAgICBpZighYm9vbGVuKSB7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5rex5bqm5p+l6K+iXG4gICAgICAgICAgICAvL1RPRE865pqC5pe25pyq5a6e546wXG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZ2V0Q2hpbGRBdCA6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgfSxcbiAgICBnZXRDaGlsZEluZGV4IDogZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICk7XG4gICAgfSxcbiAgICBzZXRDaGlsZEluZGV4IDogZnVuY3Rpb24oY2hpbGQsIGluZGV4KXtcbiAgICAgICAgaWYoY2hpbGQucGFyZW50ICE9IHRoaXMpIHJldHVybjtcbiAgICAgICAgdmFyIG9sZEluZGV4ID0gXy5pbmRleE9mKCB0aGlzLmNoaWxkcmVuICwgY2hpbGQgKTtcbiAgICAgICAgaWYoaW5kZXggPT0gb2xkSW5kZXgpIHJldHVybjtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2Uob2xkSW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICAgIH0sXG4gICAgZ2V0TnVtQ2hpbGRyZW4gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIH0sXG4gICAgLy/ojrflj5Z4LHnngrnkuIrnmoTmiYDmnIlvYmplY3QgIG51bSDpnIDopoHov5Tlm57nmoRvYmrmlbDph49cbiAgICBnZXRPYmplY3RzVW5kZXJQb2ludCA6IGZ1bmN0aW9uKCBwb2ludCAsIG51bSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIFxuICAgICAgICBmb3IodmFyIGkgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgICAgICBpZiggY2hpbGQgPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgICghY2hpbGQuX2V2ZW50RW5hYmxlZCAmJiAhY2hpbGQuZHJhZ0VuYWJsZWQpIHx8IFxuICAgICAgICAgICAgICAgICFjaGlsZC5jb250ZXh0LnZpc2libGUgXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBjaGlsZCBpbnN0YW5jZW9mIERpc3BsYXlPYmplY3RDb250YWluZXIgKSB7XG4gICAgICAgICAgICAgICAgLy/mmK/pm4blkIhcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQubW91c2VDaGlsZHJlbiAmJiBjaGlsZC5nZXROdW1DaGlsZHJlbigpID4gMCl7XG4gICAgICAgICAgICAgICAgICAgdmFyIG9ianMgPSBjaGlsZC5nZXRPYmplY3RzVW5kZXJQb2ludCggcG9pbnQgKTtcbiAgICAgICAgICAgICAgICAgICBpZiAob2Jqcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KCBvYmpzICk7XG4gICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cdFx0XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8v6Z2e6ZuG5ZCI77yM5Y+v5Lul5byA5aeL5YGaZ2V0Q2hpbGRJblBvaW505LqGXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmdldENoaWxkSW5Qb2ludCggcG9pbnQgKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChudW0gIT0gdW5kZWZpbmVkICYmICFpc05hTihudW0pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA9PSBudW0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIHJlbmRlciA6IGZ1bmN0aW9uKCBjdHggKSB7XG4gICAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5baV0uX3JlbmRlciggY3R4ICk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbmV4cG9ydCBkZWZhdWx0IERpc3BsYXlPYmplY3RDb250YWluZXI7XG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiBzdGFnZSDnsbvvvIwg5YaNYXMz5Lit77yMc3RhZ2XliJnku6PooajmlbTkuKroiJ7lj7DjgILmmK/llK/kuIDnmoTmoLnoioLngrlcbiAqIOS9huaYr+WGjWNhbnZheOS4re+8jOWboOS4uuWIhuWxguiuvuiuoeeahOmcgOimgeOAgnN0YWdlIOiInuWPsCDlkIzmoLfku6PooajkuIDkuKpjYW52YXPlhYPntKDvvIzkvYbmmK/kuI3mmK/lho3mlbTkuKrlvJXmk47orr7orqFcbiAqIOmHjOmdou+8jCDkuI3mmK/llK/kuIDnmoTmoLnoioLngrnjgILogIzmmK/kvJrkuqTnlLFjYW52YXjnsbvmnaXnu5/kuIDnrqHnkIblhbblsYLnuqdcbiAqL1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xuXG52YXIgU3RhZ2UgPSBmdW5jdGlvbiggKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi50eXBlID0gXCJzdGFnZVwiO1xuICAgIHNlbGYuY29udGV4dDJEID0gbnVsbDtcbiAgICAvL3N0YWdl5q2j5Zyo5riy5p+T5LitXG4gICAgc2VsZi5zdGFnZVJlbmRpbmcgPSBmYWxzZTtcbiAgICBzZWxmLl9pc1JlYWR5ID0gZmFsc2U7XG4gICAgU3RhZ2Uuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbkJhc2UuY3JlYXRDbGFzcyggU3RhZ2UgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe30sXG4gICAgLy/nlLFjYW52YXjnmoRhZnRlckFkZENoaWxkIOWbnuiwg1xuICAgIGluaXRTdGFnZSA6IGZ1bmN0aW9uKCBjb250ZXh0MkQgLCB3aWR0aCAsIGhlaWdodCApe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBzZWxmLmNvbnRleHQyRCA9IGNvbnRleHQyRDtcbiAgICAgICBzZWxmLmNvbnRleHQud2lkdGggID0gd2lkdGg7XG4gICAgICAgc2VsZi5jb250ZXh0LmhlaWdodCA9IGhlaWdodDtcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVYID0gQmFzZS5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVZID0gQmFzZS5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICBzZWxmLl9pc1JlYWR5ID0gdHJ1ZTtcbiAgICB9LFxuICAgIHJlbmRlciA6IGZ1bmN0aW9uKCBjb250ZXh0ICl7XG4gICAgICAgIHRoaXMuc3RhZ2VSZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgLy9UT0RP77yaXG4gICAgICAgIC8vY2xlYXIg55yL5Ly8IOW+iOWQiOeQhu+8jOS9huaYr+WFtuWunuWcqOaXoOeKtuaAgeeahGNhdm5hc+e7mOWbvuS4re+8jOWFtuWunuayoeW/heimgeaJp+ihjOS4gOatpeWkmuS9meeahGNsZWFy5pON5L2cXG4gICAgICAgIC8v5Y+N6ICM5aKe5Yqg5peg6LCT55qE5byA6ZSA77yM5aaC5p6c5ZCO57ut6KaB5YGa6ISP55+p6Zi15Yik5pat55qE6K+d44CC5Zyo6K+0XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgU3RhZ2Uuc3VwZXJjbGFzcy5yZW5kZXIuY2FsbCggdGhpcywgY29udGV4dCApO1xuICAgICAgICB0aGlzLnN0YWdlUmVuZGluZyA9IGZhbHNlO1xuICAgIH0sXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAvL3NoYXBlICwgbmFtZSAsIHZhbHVlICwgcHJlVmFsdWUgXG4gICAgICAgIC8vZGlzcGxheUxpc3TkuK3mn5DkuKrlsZ7mgKfmlLnlj5jkuoZcbiAgICAgICAgaWYgKCF0aGlzLl9pc1JlYWR5KSB7XG4gICAgICAgICAgIC8v5Zyoc3RhZ2Xov5jmsqHliJ3lp4vljJblrozmr5XnmoTmg4XlhrXkuIvvvIzml6DpnIDlgZrku7vkvZXlpITnkIZcbiAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBvcHQgfHwgKCBvcHQgPSB7fSApOyAvL+WmguaenG9wdOS4uuepuu+8jOivtOaYjuWwseaYr+aXoOadoeS7tuWIt+aWsFxuICAgICAgICBvcHQuc3RhZ2UgICA9IHRoaXM7XG5cbiAgICAgICAgLy9UT0RP5Li05pe25YWI6L+Z5LmI5aSE55CGXG4gICAgICAgIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmhlYXJ0QmVhdChvcHQpO1xuICAgIH0sXG4gICAgY2xlYXIgOiBmdW5jdGlvbih4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0MkQuY2xlYXJSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0MkQuY2xlYXJSZWN0KCAwLCAwLCB0aGlzLnBhcmVudC53aWR0aCAsIHRoaXMucGFyZW50LmhlaWdodCApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5leHBvcnQgZGVmYXVsdCBTdGFnZTsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczMg5LitIOeahHNwcml0Zeexu++8jOebruWJjei/mOWPquaYr+S4queugOWNleeahOWuueaYk+OAglxuICovXG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCI7XG5pbXBvcnQgQmFzZSBmcm9tIFwiLi4vY29yZS9CYXNlXCI7XG5cbnZhciBTcHJpdGUgPSBmdW5jdGlvbigpe1xuICAgIHRoaXMudHlwZSA9IFwic3ByaXRlXCI7XG4gICAgU3ByaXRlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbkJhc2UuY3JlYXRDbGFzcyhTcHJpdGUgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgIFxuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTcHJpdGU7XG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczMgRGlzcGxheUxpc3Qg5Lit55qEc2hhcGUg57G7XG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBCYXNlIGZyb20gXCIuLi9jb3JlL0Jhc2VcIjtcblxudmFyIFNoYXBlID0gZnVuY3Rpb24ob3B0KXtcbiAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy/lhYPntKDmmK/lkKbmnIlob3ZlcuS6i+S7tiDlkowgY2hpY2vkuovku7bvvIznlLFhZGRFdmVuZXRMaXN0ZXLlkoxyZW1pdmVFdmVudExpc3RlcuadpeinpuWPkeS/ruaUuVxuICAgIHNlbGYuX2hvdmVyYWJsZSAgPSBmYWxzZTtcbiAgICBzZWxmLl9jbGlja2FibGUgID0gZmFsc2U7XG5cbiAgICAvL292ZXLnmoTml7blgJnlpoLmnpzmnInkv67mlLnmoLflvI/vvIzlsLHkuLp0cnVlXG4gICAgc2VsZi5faG92ZXJDbGFzcyA9IGZhbHNlO1xuICAgIHNlbGYuaG92ZXJDbG9uZSAgPSB0cnVlOyAgICAvL+aYr+WQpuW8gOWQr+WcqGhvdmVy55qE5pe25YCZY2xvbmXkuIDku73liLBhY3RpdmUgc3RhZ2Ug5LitIFxuICAgIHNlbGYucG9pbnRDaGtQcmlvcml0eSA9IHRydWU7IC8v5Zyo6byg5qCHbW91c2VvdmVy5Yiw6K+l6IqC54K577yM54S25ZCObW91c2Vtb3Zl55qE5pe25YCZ77yM5piv5ZCm5LyY5YWI5qOA5rWL6K+l6IqC54K5XG5cbiAgICAvL+aLluaLvWRyYWfnmoTml7blgJnmmL7npLrlnKhhY3RpdlNoYXBl55qE5Ymv5pysXG4gICAgc2VsZi5fZHJhZ0R1cGxpY2F0ZSA9IG51bGw7XG5cbiAgICAvL+WFg+e0oOaYr+WQpiDlvIDlkK8gZHJhZyDmi5bliqjvvIzov5nkuKrmnInnlKjmiLforr7nva7kvKDlhaVcbiAgICAvL3NlbGYuZHJhZ2dhYmxlID0gb3B0LmRyYWdnYWJsZSB8fCBmYWxzZTtcblxuICAgIHNlbGYudHlwZSA9IHNlbGYudHlwZSB8fCBcInNoYXBlXCIgO1xuICAgIG9wdC5kcmF3ICYmIChzZWxmLmRyYXc9b3B0LmRyYXcpO1xuICAgIFxuICAgIC8v5aSE55CG5omA5pyJ55qE5Zu+5b2i5LiA5Lqb5YWx5pyJ55qE5bGe5oCn6YWN572uXG4gICAgc2VsZi5pbml0Q29tcFByb3BlcnR5KG9wdCk7XG5cbiAgICBTaGFwZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuICAgIHNlbGYuX3JlY3QgPSBudWxsO1xufTtcblxuQmFzZS5jcmVhdENsYXNzKFNoYXBlICwgRGlzcGxheU9iamVjdCAsIHtcbiAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgfSxcbiAgIGluaXRDb21wUHJvcGVydHkgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgZm9yKCB2YXIgaSBpbiBvcHQgKXtcbiAgICAgICAgICAgaWYoIGkgIT0gXCJpZFwiICYmIGkgIT0gXCJjb250ZXh0XCIpe1xuICAgICAgICAgICAgICAgdGhpc1tpXSA9IG9wdFtpXTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgIH0sXG4gICAvKlxuICAgICrkuIvpnaLkuKTkuKrmlrnms5XkuLrmj5Dkvpvnu5kg5YW35L2T55qEIOWbvuW9ouexu+imhuebluWunueOsO+8jOacrHNoYXBl57G75LiN5o+Q5L6b5YW35L2T5a6e546wXG4gICAgKmRyYXcoKSDnu5jliLYgICBhbmQgICBzZXRSZWN0KCnojrflj5bor6XnsbvnmoTnn6nlvaLovrnnlYxcbiAgICovXG4gICBkcmF3OmZ1bmN0aW9uKCl7XG4gICBcbiAgIH0sXG4gICBkcmF3RW5kIDogZnVuY3Rpb24oY3R4KXtcbiAgICAgICBpZih0aGlzLl9oYXNGaWxsQW5kU3Ryb2tlKXtcbiAgICAgICAgICAgLy/lpoLmnpzlnKjlrZBzaGFwZeexu+mHjOmdouW3sue7j+WunueOsHN0cm9rZSBmaWxsIOetieaTjeS9nO+8jCDlsLHkuI3pnIDopoHnu5/kuIDnmoRkXG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG5cbiAgICAgICAvL3N0eWxlIOimgeS7jmRpYXBsYXlPYmplY3TnmoQgY29udGV4dOS4iumdouWOu+WPllxuICAgICAgIHZhciBzdHlsZSA9IHRoaXMuY29udGV4dDtcbiBcbiAgICAgICAvL2ZpbGwgc3Ryb2tlIOS5i+WJje+8jCDlsLHlupTor6XopoFjbG9zZXBhdGgg5ZCm5YiZ57q/5p2h6L2s6KeS5Y+j5Lya5pyJ57y65Y+j44CCXG4gICAgICAgLy9kcmF3VHlwZU9ubHkg55Sx57un5om/c2hhcGXnmoTlhbfkvZPnu5jliLbnsbvmj5DkvptcbiAgICAgICBpZiAoIHRoaXMuX2RyYXdUeXBlT25seSAhPSBcInN0cm9rZVwiICYmIHRoaXMudHlwZSAhPSBcInBhdGhcIil7XG4gICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICB9XG5cbiAgICAgICBpZiAoIHN0eWxlLnN0cm9rZVN0eWxlICYmIHN0eWxlLmxpbmVXaWR0aCApe1xuICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgfVxuICAgICAgIC8v5q+U5aaC6LSd5aGe5bCU5puy57q/55S755qE57q/LGRyYXdUeXBlT25seT09c3Ryb2tl77yM5piv5LiN6IO95L2/55SoZmlsbOeahO+8jOWQjuaenOW+iOS4pemHjVxuICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgJiYgdGhpcy5fZHJhd1R5cGVPbmx5IT1cInN0cm9rZVwiKXtcbiAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICB9XG4gICAgICAgXG4gICB9LFxuXG5cbiAgIHJlbmRlciA6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgY3R4ICA9IHRoaXMuZ2V0U3RhZ2UoKS5jb250ZXh0MkQ7XG4gICAgICBcbiAgICAgIGlmICh0aGlzLmNvbnRleHQudHlwZSA9PSBcInNoYXBlXCIpe1xuICAgICAgICAgIC8vdHlwZSA9PSBzaGFwZeeahOaXtuWAme+8jOiHquWumuS5iee7mOeUu1xuICAgICAgICAgIC8v6L+Z5Liq5pe25YCZ5bCx5Y+v5Lul5L2/55Soc2VsZi5ncmFwaGljc+e7mOWbvuaOpeWPo+S6hu+8jOivpeaOpeWPo+aooeaLn+eahOaYr2FzM+eahOaOpeWPo1xuICAgICAgICAgIHRoaXMuZHJhdy5hcHBseSggdGhpcyApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL+i/meS4quaXtuWAme+8jOivtOaYjuivpXNoYXBl5piv6LCD55So5bey57uP57uY5Yi25aW955qEIHNoYXBlIOaooeWdl++8jOi/meS6m+aooeWdl+WFqOmDqOWcqC4uL3NoYXBl55uu5b2V5LiL6Z2iXG4gICAgICAgICAgaWYoIHRoaXMuZHJhdyApe1xuICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgIHRoaXMuZHJhdyggY3R4ICwgdGhpcy5jb250ZXh0ICk7XG4gICAgICAgICAgICAgIHRoaXMuZHJhd0VuZCggY3R4ICk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgfVxuICAgLFxuICAgLypcbiAgICAqIOeUu+iZmue6v1xuICAgICovXG4gICBkYXNoZWRMaW5lVG86ZnVuY3Rpb24oY3R4LCB4MSwgeTEsIHgyLCB5MiwgZGFzaExlbmd0aCkge1xuICAgICAgICAgZGFzaExlbmd0aCA9IHR5cGVvZiBkYXNoTGVuZ3RoID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgICAgICAgPyAzIDogZGFzaExlbmd0aDtcbiAgICAgICAgIGRhc2hMZW5ndGggPSBNYXRoLm1heCggZGFzaExlbmd0aCAsIHRoaXMuY29udGV4dC5saW5lV2lkdGggKTtcbiAgICAgICAgIHZhciBkZWx0YVggPSB4MiAtIHgxO1xuICAgICAgICAgdmFyIGRlbHRhWSA9IHkyIC0geTE7XG4gICAgICAgICB2YXIgbnVtRGFzaGVzID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICBNYXRoLnNxcnQoZGVsdGFYICogZGVsdGFYICsgZGVsdGFZICogZGVsdGFZKSAvIGRhc2hMZW5ndGhcbiAgICAgICAgICk7XG4gICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bURhc2hlczsgKytpKSB7XG4gICAgICAgICAgICAgdmFyIHggPSBwYXJzZUludCh4MSArIChkZWx0YVggLyBudW1EYXNoZXMpICogaSk7XG4gICAgICAgICAgICAgdmFyIHkgPSBwYXJzZUludCh5MSArIChkZWx0YVkgLyBudW1EYXNoZXMpICogaSk7XG4gICAgICAgICAgICAgY3R4W2kgJSAyID09PSAwID8gJ21vdmVUbycgOiAnbGluZVRvJ10oIHggLCB5ICk7XG4gICAgICAgICAgICAgaWYoIGkgPT0gKG51bURhc2hlcy0xKSAmJiBpJTIgPT09IDApe1xuICAgICAgICAgICAgICAgICBjdHgubGluZVRvKCB4MiAsIHkyICk7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgfSxcbiAgIC8qXG4gICAgKuS7jmNwbOiKgueCueS4reiOt+WPluWIsDTkuKrmlrnlkJHnmoTovrnnlYzoioLngrlcbiAgICAqQHBhcmFtICBjb250ZXh0IFxuICAgICpcbiAgICAqKi9cbiAgIGdldFJlY3RGb3JtUG9pbnRMaXN0IDogZnVuY3Rpb24oIGNvbnRleHQgKXtcbiAgICAgICB2YXIgbWluWCA9ICBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgIHZhciBtYXhYID0gIE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgdmFyIG1pblkgPSAgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICB2YXIgbWF4WSA9ICBOdW1iZXIuTUlOX1ZBTFVFO1xuXG4gICAgICAgdmFyIGNwbCA9IGNvbnRleHQucG9pbnRMaXN0OyAvL3RoaXMuZ2V0Y3BsKCk7XG4gICAgICAgZm9yKHZhciBpID0gMCwgbCA9IGNwbC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgaWYgKGNwbFtpXVswXSA8IG1pblgpIHtcbiAgICAgICAgICAgICAgIG1pblggPSBjcGxbaV1bMF07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVswXSA+IG1heFgpIHtcbiAgICAgICAgICAgICAgIG1heFggPSBjcGxbaV1bMF07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVsxXSA8IG1pblkpIHtcbiAgICAgICAgICAgICAgIG1pblkgPSBjcGxbaV1bMV07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVsxXSA+IG1heFkpIHtcbiAgICAgICAgICAgICAgIG1heFkgPSBjcGxbaV1bMV07XG4gICAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICB2YXIgbGluZVdpZHRoO1xuICAgICAgIGlmIChjb250ZXh0LnN0cm9rZVN0eWxlIHx8IGNvbnRleHQuZmlsbFN0eWxlICApIHtcbiAgICAgICAgICAgbGluZVdpZHRoID0gY29udGV4dC5saW5lV2lkdGggfHwgMTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4ge1xuICAgICAgICAgICB4ICAgICAgOiBNYXRoLnJvdW5kKG1pblggLSBsaW5lV2lkdGggLyAyKSxcbiAgICAgICAgICAgeSAgICAgIDogTWF0aC5yb3VuZChtaW5ZIC0gbGluZVdpZHRoIC8gMiksXG4gICAgICAgICAgIHdpZHRoICA6IG1heFggLSBtaW5YICsgbGluZVdpZHRoLFxuICAgICAgICAgICBoZWlnaHQgOiBtYXhZIC0gbWluWSArIGxpbmVXaWR0aFxuICAgICAgIH07XG4gICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcGU7XG4iLCIvKipcclxuICogQ2FudmF4LS1UZXh0XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5paH5pysIOexu1xyXG4gKiovXHJcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcclxuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFRleHQgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgc2VsZi5fcmVOZXdsaW5lID0gL1xccj9cXG4vO1xyXG4gICAgc2VsZi5mb250UHJvcGVydHMgPSBbXCJmb250U3R5bGVcIiwgXCJmb250VmFyaWFudFwiLCBcImZvbnRXZWlnaHRcIiwgXCJmb250U2l6ZVwiLCBcImZvbnRGYW1pbHlcIl07XHJcblxyXG4gICAgLy/lgZrkuIDmrKHnroDljZXnmoRvcHTlj4LmlbDmoKHpqozvvIzkv53or4HlnKjnlKjmiLfkuI3kvKBvcHTnmoTml7blgJkg5oiW6ICF5Lyg5LqGb3B05L2G5piv6YeM6Z2i5rKh5pyJY29udGV4dOeahOaXtuWAmeaKpemUmVxyXG4gICAgb3B0ID0gQmFzZS5jaGVja09wdChvcHQpO1xyXG5cclxuICAgIHNlbGYuX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgZm9udFNpemU6IDEzLCAvL+Wtl+S9k+Wkp+Wwj+m7mOiupDEzXHJcbiAgICAgICAgZm9udFdlaWdodDogXCJub3JtYWxcIixcclxuICAgICAgICBmb250RmFtaWx5OiBcIuW+rui9r+mbhem7kVwiLFxyXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiBudWxsLFxyXG4gICAgICAgIGZpbGxTdHlsZTogJ2JsYW5rJyxcclxuICAgICAgICBzdHJva2VTdHlsZTogbnVsbCxcclxuICAgICAgICBsaW5lV2lkdGg6IDAsXHJcbiAgICAgICAgbGluZUhlaWdodDogMS4yLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogbnVsbCxcclxuICAgICAgICB0ZXh0QmFja2dyb3VuZENvbG9yOiBudWxsXHJcbiAgICB9LCBvcHQuY29udGV4dCk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dC5mb250ID0gc2VsZi5fZ2V0Rm9udERlY2xhcmF0aW9uKCk7XHJcblxyXG4gICAgc2VsZi50ZXh0ID0gdGV4dC50b1N0cmluZygpO1xyXG5cclxuICAgIFRleHQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBbb3B0XSk7XHJcblxyXG59O1xyXG5cclxuQmFzZS5jcmVhdENsYXNzKFRleHQsIERpc3BsYXlPYmplY3QsIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgLy9jb250ZXh05bGe5oCn5pyJ5Y+Y5YyW55qE55uR5ZCs5Ye95pWwXHJcbiAgICAgICAgaWYgKF8uaW5kZXhPZih0aGlzLmZvbnRQcm9wZXJ0cywgbmFtZSkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0W25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5L+u5pS555qE5pivZm9udOeahOafkOS4quWGheWuue+8jOWwsemHjeaWsOe7hOijheS4gOmBjWZvbnTnmoTlgLzvvIxcclxuICAgICAgICAgICAgLy/nhLblkI7pgJrnn6XlvJXmk47ov5nmrKHlr7ljb250ZXh055qE5L+u5pS55LiN6ZyA6KaB5LiK5oql5b+D6LezXHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5fZ2V0Rm9udERlY2xhcmF0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC53aWR0aCA9IHRoaXMuZ2V0VGV4dFdpZHRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSB0aGlzLmdldFRleHRIZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgaW5pdDogZnVuY3Rpb24odGV4dCwgb3B0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGMud2lkdGggPSB0aGlzLmdldFRleHRXaWR0aCgpO1xyXG4gICAgICAgIGMuaGVpZ2h0ID0gdGhpcy5nZXRUZXh0SGVpZ2h0KCk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbihjdHgpIHtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHRoaXMuY29udGV4dC4kbW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHAgaW4gY3R4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocCAhPSBcInRleHRCYXNlbGluZVwiICYmIHRoaXMuY29udGV4dC4kbW9kZWxbcF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHhbcF0gPSB0aGlzLmNvbnRleHQuJG1vZGVsW3BdO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclRleHQoY3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICB9LFxyXG4gICAgcmVzZXRUZXh0OiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dC50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuaGVhcnRCZWF0KCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VGV4dFdpZHRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSAwO1xyXG4gICAgICAgIEJhc2UuX3BpeGVsQ3R4LnNhdmUoKTtcclxuICAgICAgICBCYXNlLl9waXhlbEN0eC5mb250ID0gdGhpcy5jb250ZXh0LmZvbnQ7XHJcbiAgICAgICAgd2lkdGggPSB0aGlzLl9nZXRUZXh0V2lkdGgoQmFzZS5fcGl4ZWxDdHgsIHRoaXMuX2dldFRleHRMaW5lcygpKTtcclxuICAgICAgICBCYXNlLl9waXhlbEN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIHdpZHRoO1xyXG4gICAgfSxcclxuICAgIGdldFRleHRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRUZXh0SGVpZ2h0KEJhc2UuX3BpeGVsQ3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRMaW5lczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5zcGxpdCh0aGlzLl9yZU5ld2xpbmUpO1xyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dFN0cm9rZShjdHgsIHRleHRMaW5lcyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dEZpbGwoY3R4LCB0ZXh0TGluZXMpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX2dldEZvbnREZWNsYXJhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBmb250QXJyID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaCh0aGlzLmZvbnRQcm9wZXJ0cywgZnVuY3Rpb24ocCkge1xyXG4gICAgICAgICAgICB2YXIgZm9udFAgPSBzZWxmLl9jb250ZXh0W3BdO1xyXG4gICAgICAgICAgICBpZiAocCA9PSBcImZvbnRTaXplXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvbnRQID0gcGFyc2VGbG9hdChmb250UCkgKyBcInB4XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb250UCAmJiBmb250QXJyLnB1c2goZm9udFApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9udEFyci5qb2luKCcgJyk7XHJcblxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0RmlsbDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5maWxsU3R5bGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcyA9IFtdO1xyXG4gICAgICAgIHZhciBsaW5lSGVpZ2h0cyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0T2ZMaW5lID0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKGN0eCwgaSwgdGV4dExpbmVzKTtcclxuICAgICAgICAgICAgbGluZUhlaWdodHMgKz0gaGVpZ2h0T2ZMaW5lO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyVGV4dExpbmUoXHJcbiAgICAgICAgICAgICAgICAnZmlsbFRleHQnLFxyXG4gICAgICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICAgICAgdGV4dExpbmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgMCwgLy90aGlzLl9nZXRMZWZ0T2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRUb3BPZmZzZXQoKSArIGxpbmVIZWlnaHRzLFxyXG4gICAgICAgICAgICAgICAgaVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dFN0cm9rZTogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5zdHJva2VTdHlsZSB8fCAhdGhpcy5jb250ZXh0LmxpbmVXaWR0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgbGluZUhlaWdodHMgPSAwO1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLnN0cm9rZURhc2hBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAoMSAmIHRoaXMuc3Ryb2tlRGFzaEFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHJva2VEYXNoQXJyYXkucHVzaC5hcHBseSh0aGlzLnN0cm9rZURhc2hBcnJheSwgdGhpcy5zdHJva2VEYXNoQXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cHBvcnRzTGluZURhc2ggJiYgY3R4LnNldExpbmVEYXNoKHRoaXMuc3Ryb2tlRGFzaEFycmF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHRPZkxpbmUgPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoY3R4LCBpLCB0ZXh0TGluZXMpO1xyXG4gICAgICAgICAgICBsaW5lSGVpZ2h0cyArPSBoZWlnaHRPZkxpbmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0TGluZShcclxuICAgICAgICAgICAgICAgICdzdHJva2VUZXh0JyxcclxuICAgICAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgICAgIHRleHRMaW5lc1tpXSxcclxuICAgICAgICAgICAgICAgIDAsIC8vdGhpcy5fZ2V0TGVmdE9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0VG9wT2Zmc2V0KCkgKyBsaW5lSGVpZ2h0cyxcclxuICAgICAgICAgICAgICAgIGlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHRMaW5lOiBmdW5jdGlvbihtZXRob2QsIGN0eCwgbGluZSwgbGVmdCwgdG9wLCBsaW5lSW5kZXgpIHtcclxuICAgICAgICB0b3AgLT0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKCkgLyA0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHQudGV4dEFsaWduICE9PSAnanVzdGlmeScpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIGxpbmUsIGxlZnQsIHRvcCwgbGluZUluZGV4KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lKS53aWR0aDtcclxuICAgICAgICB2YXIgdG90YWxXaWR0aCA9IHRoaXMuY29udGV4dC53aWR0aDtcclxuXHJcbiAgICAgICAgaWYgKHRvdGFsV2lkdGggPiBsaW5lV2lkdGgpIHtcclxuICAgICAgICAgICAgdmFyIHdvcmRzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICB2YXIgd29yZHNXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lLnJlcGxhY2UoL1xccysvZywgJycpKS53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHdpZHRoRGlmZiA9IHRvdGFsV2lkdGggLSB3b3Jkc1dpZHRoO1xyXG4gICAgICAgICAgICB2YXIgbnVtU3BhY2VzID0gd29yZHMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgdmFyIHNwYWNlV2lkdGggPSB3aWR0aERpZmYgLyBudW1TcGFjZXM7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVmdE9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB3b3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIHdvcmRzW2ldLCBsZWZ0ICsgbGVmdE9mZnNldCwgdG9wLCBsaW5lSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgbGVmdE9mZnNldCArPSBjdHgubWVhc3VyZVRleHQod29yZHNbaV0pLndpZHRoICsgc3BhY2VXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNoYXJzKG1ldGhvZCwgY3R4LCBsaW5lLCBsZWZ0LCB0b3AsIGxpbmVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJDaGFyczogZnVuY3Rpb24obWV0aG9kLCBjdHgsIGNoYXJzLCBsZWZ0LCB0b3ApIHtcclxuICAgICAgICBjdHhbbWV0aG9kXShjaGFycywgMCwgdG9wKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0SGVpZ2h0T2ZMaW5lOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmZvbnRTaXplICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRXaWR0aDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBjdHgubWVhc3VyZVRleHQodGV4dExpbmVzWzBdIHx8ICd8Jykud2lkdGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudExpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0TGluZXNbaV0pLndpZHRoO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudExpbmVXaWR0aCA+IG1heFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCA9IGN1cnJlbnRMaW5lV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfSxcclxuICAgIF9nZXRUZXh0SGVpZ2h0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZm9udFNpemUgKiB0ZXh0TGluZXMubGVuZ3RoICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVG9wIG9mZnNldFxyXG4gICAgICovXHJcbiAgICBfZ2V0VG9wT2Zmc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdCA9IDA7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtaWRkbGVcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAtdGhpcy5jb250ZXh0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IC10aGlzLmNvbnRleHQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHZhciB4ID0gMDtcclxuICAgICAgICB2YXIgeSA9IDA7XHJcbiAgICAgICAgLy/mm7Tlhbd0ZXh0QWxpZ24g5ZKMIHRleHRCYXNlbGluZSDph43mlrDnn6vmraMgeHlcclxuICAgICAgICBpZiAoYy50ZXh0QWxpZ24gPT0gXCJjZW50ZXJcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGggLyAyO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGMudGV4dEFsaWduID09IFwicmlnaHRcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYy50ZXh0QmFzZWxpbmUgPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICAgICAgICB5ID0gLWMuaGVpZ2h0IC8gMjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjLnRleHRCYXNlbGluZSA9PSBcImJvdHRvbVwiKSB7XHJcbiAgICAgICAgICAgIHkgPSAtYy5oZWlnaHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgd2lkdGg6IGMud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogYy5oZWlnaHRcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBUZXh0OyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyDkuK0g55qEQml0bWFw57G777yM55uu5YmN6L+Y5Y+q5piv5Liq566A5Y2V55qE5a655piT44CCXG4gKi9cbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9TaGFwZVwiO1xuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xuXG5cbnZhciBCaXRtYXAgPSBmdW5jdGlvbihvcHQpe1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnR5cGUgPSBcImJpdG1hcFwiO1xuXG4gICAgLy9UT0RPOui/memHjOS4jei0n+i0o+WBmmltZyDnmoTliqDovb3vvIzmiYDku6Xov5nph4znmoRpbWfmmK/lv4Xpobvlt7Lnu4/lh4blpIflpb3kuobnmoRpbWflhYPntKBcbiAgICAvL+WmguaenGltZ+ayoeWHhuWkh+Wlve+8jOS8muWHuueOsOaEj+aDs+S4jeWIsOeahOmUmeivr++8jOaIkeS4jee7meS9oOi0n+i0o1xuICAgIHNlbGYuaW1nICA9IG9wdC5pbWcgfHwgbnVsbDsgLy9iaXRtYXDnmoTlm77niYfmnaXmupDvvIzlj6/ku6XmmK/pobXpnaLkuIrpnaLnmoRpbWcg5Lmf5Y+v5Lul5piv5p+Q5LiqY2FudmFzXG5cbiAgICBvcHQgPSBCYXNlLmNoZWNrT3B0KCBvcHQgKTtcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xuICAgICAgICBkeCAgICAgOiBvcHQuY29udGV4dC5keCwgLy/lm77niYfliIfniYfnmoR45L2N572uXG4gICAgICAgIGR5ICAgICA6IG9wdC5jb250ZXh0LmR5LCAvL+WbvueJh+WIh+eJh+eahHnkvY3nva5cbiAgICAgICAgZFdpZHRoIDogb3B0LmNvbnRleHQuZFdpZHRoIHx8IDAsIC8v5YiH54mH55qEd2lkdGhcbiAgICAgICAgZEhlaWdodDogb3B0LmNvbnRleHQuZEhlaWdodHx8IDAgIC8v5YiH54mH55qEaGVpZ2h0XG4gICAgfVxuXG4gICAgQml0bWFwLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxufTtcblxuQmFzZS5jcmVhdENsYXNzKCBCaXRtYXAgLCBTaGFwZSAsIHtcbiAgICBkcmF3IDogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XG4gICAgICAgICAgICAvL2ltZ+mDveayoeacieeUu+S4quavm1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLmltZztcbiAgICAgICAgaWYoIXN0eWxlLndpZHRoIHx8ICFzdHlsZS5oZWlnaHQgKXtcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIHN0eWxlLmR4ID09IHVuZGVmaW5lZCB8fCBzdHlsZS5keSA9PSB1bmRlZmluZWQgICl7XG4gICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltYWdlLCAwLCAwLCBzdHlsZS53aWR0aCwgc3R5bGUuaGVpZ2h0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAhc3R5bGUuZFdpZHRoICAmJiAoIHN0eWxlLmRXaWR0aCAgPSBzdHlsZS53aWR0aCAgKTtcbiAgICAgICAgICAgICAgICFzdHlsZS5kSGVpZ2h0ICYmICggc3R5bGUuZEhlaWdodCA9IHN0eWxlLmhlaWdodCApO1xuICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWFnZSAsIHN0eWxlLmR4ICwgc3R5bGUuZHkgLCBzdHlsZS5kV2lkdGggLCBzdHlsZS5kSGVpZ2h0ICwgMCAsIDAgLCBzdHlsZS53aWR0aCwgc3R5bGUuaGVpZ2h0ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQml0bWFwO1xuXG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczMg5LitIOeahE1vdmllY2xpcOexu++8jOebruWJjei/mOWPquaYr+S4queugOWNleeahOWuueaYk+OAglxuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xuXG52YXIgTW92aWVjbGlwID0gZnVuY3Rpb24oIG9wdCApe1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIG9wdCA9IEJhc2UuY2hlY2tPcHQoIG9wdCApO1xuICAgIHNlbGYudHlwZSA9IFwibW92aWVjbGlwXCI7XG4gICAgc2VsZi5jdXJyZW50RnJhbWUgID0gMDtcbiAgICBzZWxmLmF1dG9QbGF5ICAgICAgPSBvcHQuYXV0b1BsYXkgICB8fCBmYWxzZTsvL+aYr+WQpuiHquWKqOaSreaUvlxuICAgIHNlbGYucmVwZWF0ICAgICAgICA9IG9wdC5yZXBlYXQgICAgIHx8IDA7Ly/mmK/lkKblvqrnjq/mkq3mlL4scmVwZWF05Li65pWw5a2X77yM5YiZ6KGo56S65b6q546v5aSa5bCR5qyh77yM5Li6dHJ1ZSBvciAh6L+Q566X57uT5p6c5Li6dHJ1ZSDnmoTor53ooajnpLrmsLjkuYXlvqrnjq9cblxuICAgIHNlbGYub3ZlclBsYXkgICAgICA9IG9wdC5vdmVyUGxheSAgIHx8IGZhbHNlOyAvL+aYr+WQpuimhuebluaSreaUvu+8jOS4umZhbHNl5Y+q5pKt5pS+Y3VycmVudEZyYW1lIOW9k+WJjeW4pyx0cnVl5YiZ5Lya5pKt5pS+5b2T5YmN5binIOWSjCDlvZPliY3luKfkuYvliY3nmoTmiYDmnInlj6DliqBcblxuICAgIHNlbGYuX2ZyYW1lUmF0ZSAgICA9IEJhc2UubWFpbkZyYW1lUmF0ZTtcbiAgICBzZWxmLl9zcGVlZFRpbWUgICAgPSBwYXJzZUludCgxMDAwL3NlbGYuX2ZyYW1lUmF0ZSk7XG4gICAgc2VsZi5fcHJlUmVuZGVyVGltZT0gMDtcblxuICAgIHNlbGYuX2NvbnRleHQgPSB7XG4gICAgICAgIC8vciA6IG9wdC5jb250ZXh0LnIgfHwgMCAgIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzlnIbljYrlvoRcbiAgICB9XG4gICAgTW92aWVjbGlwLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgWyBvcHQgXSApO1xufTtcblxuQmFzZS5jcmVhdENsYXNzKE1vdmllY2xpcCAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgXG4gICAgfSxcbiAgICBnZXRTdGF0dXMgICAgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL+afpeivok1vdmllY2xpcOeahGF1dG9QbGF554q25oCBXG4gICAgICAgIHJldHVybiB0aGlzLmF1dG9QbGF5O1xuICAgIH0sXG4gICAgZ2V0RnJhbWVSYXRlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZyYW1lUmF0ZTtcbiAgICB9LFxuICAgIHNldEZyYW1lUmF0ZSA6IGZ1bmN0aW9uKGZyYW1lUmF0ZSkge1xuICAgICAgICBcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZihzZWxmLl9mcmFtZVJhdGUgID09IGZyYW1lUmF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX2ZyYW1lUmF0ZSAgPSBmcmFtZVJhdGU7XG5cbiAgICAgICAgLy/moLnmja7mnIDmlrDnmoTluKfnjofvvIzmnaXorqHnrpfmnIDmlrDnmoTpl7TpmpTliLfmlrDml7bpl7RcbiAgICAgICAgc2VsZi5fc3BlZWRUaW1lID0gcGFyc2VJbnQoIDEwMDAvc2VsZi5fZnJhbWVSYXRlICk7XG4gICAgfSwgXG4gICAgYWZ0ZXJBZGRDaGlsZDpmdW5jdGlvbihjaGlsZCAsIGluZGV4KXtcbiAgICAgICBpZih0aGlzLmNoaWxkcmVuLmxlbmd0aD09MSl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgIH1cblxuICAgICAgIGlmKCBpbmRleCAhPSB1bmRlZmluZWQgJiYgaW5kZXggPD0gdGhpcy5jdXJyZW50RnJhbWUgKXtcbiAgICAgICAgICAvL+aPkuWFpeW9k+WJjWZyYW1l55qE5YmN6Z2iIFxuICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lKys7XG4gICAgICAgfVxuICAgIH0sXG4gICAgYWZ0ZXJEZWxDaGlsZDpmdW5jdGlvbihjaGlsZCxpbmRleCl7XG4gICAgICAgLy/orrDlvZXkuIvlvZPliY3luKdcbiAgICAgICB2YXIgcHJlRnJhbWUgPSB0aGlzLmN1cnJlbnRGcmFtZTtcblxuICAgICAgIC8v5aaC5p6c5bmy5o6J55qE5piv5b2T5YmN5bin5YmN6Z2i55qE5bin77yM5b2T5YmN5bin55qE57Si5byV5bCx5b6A5LiK6LWw5LiA5LiqXG4gICAgICAgaWYoaW5kZXggPCB0aGlzLmN1cnJlbnRGcmFtZSl7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUtLTtcbiAgICAgICB9XG5cbiAgICAgICAvL+WmguaenOW5suaOieS6huWFg+e0oOWQjuW9k+WJjeW4p+W3sue7j+i2hei/h+S6hmxlbmd0aFxuICAgICAgIGlmKCh0aGlzLmN1cnJlbnRGcmFtZSA+PSB0aGlzLmNoaWxkcmVuLmxlbmd0aCkgJiYgdGhpcy5jaGlsZHJlbi5sZW5ndGg+MCl7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xO1xuICAgICAgIH07XG4gICAgfSxcbiAgICBfZ290bzpmdW5jdGlvbihpKXtcbiAgICAgICB2YXIgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgaWYoaT49IGxlbil7XG4gICAgICAgICAgaSA9IGklbGVuO1xuICAgICAgIH1cbiAgICAgICBpZihpPDApe1xuICAgICAgICAgIGkgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xLU1hdGguYWJzKGkpJWxlbjtcbiAgICAgICB9XG4gICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSBpO1xuICAgIH0sXG4gICAgZ290b0FuZFN0b3A6ZnVuY3Rpb24oaSl7XG4gICAgICAgdGhpcy5fZ290byhpKTtcbiAgICAgICBpZighdGhpcy5hdXRvUGxheSl7XG4gICAgICAgICAvL+WGjXN0b3DnmoTnirbmgIHkuIvpnaLot7PluKfvvIzlsLHopoHlkYror4lzdGFnZeWOu+WPkeW/g+i3s1xuICAgICAgICAgdGhpcy5fcHJlUmVuZGVyVGltZSA9IDA7XG4gICAgICAgICB0aGlzLmdldFN0YWdlKCkuaGVhcnRCZWF0KCk7XG4gICAgICAgICByZXR1cm47XG4gICAgICAgfVxuICAgICAgIHRoaXMuYXV0b1BsYXkgPSBmYWxzZTtcbiAgICB9LFxuICAgIHN0b3A6ZnVuY3Rpb24oKXtcbiAgICAgICBpZighdGhpcy5hdXRvUGxheSl7XG4gICAgICAgICByZXR1cm47XG4gICAgICAgfVxuICAgICAgIHRoaXMuYXV0b1BsYXkgPSBmYWxzZTtcbiAgICB9LFxuICAgIGdvdG9BbmRQbGF5OmZ1bmN0aW9uKGkpe1xuICAgICAgIHRoaXMuX2dvdG8oaSk7XG4gICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfSxcbiAgICBwbGF5OmZ1bmN0aW9uKCl7XG4gICAgICAgaWYodGhpcy5hdXRvUGxheSl7XG4gICAgICAgICByZXR1cm47XG4gICAgICAgfVxuICAgICAgIHRoaXMuYXV0b1BsYXkgPSB0cnVlO1xuICAgICAgIHZhciBjYW52YXggPSB0aGlzLmdldFN0YWdlKCkucGFyZW50O1xuICAgICAgIGlmKCFjYW52YXguX2hlYXJ0QmVhdCAmJiBjYW52YXguX3Rhc2tMaXN0Lmxlbmd0aD09MCl7XG4gICAgICAgICAgIC8v5omL5Yqo5ZCv5Yqo5byV5pOOXG4gICAgICAgICAgIGNhbnZheC5fX3N0YXJ0RW50ZXIoKTtcbiAgICAgICB9XG4gICAgICAgdGhpcy5fcHVzaDJUYXNrTGlzdCgpO1xuICAgICAgIFxuICAgICAgIHRoaXMuX3ByZVJlbmRlclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9LFxuICAgIF9wdXNoMlRhc2tMaXN0IDogZnVuY3Rpb24oKXtcbiAgICAgICAvL+aKimVudGVyRnJhbWUgcHVzaCDliLAg5byV5pOO55qE5Lu75Yqh5YiX6KGoXG4gICAgICAgaWYoIXRoaXMuX2VudGVySW5DYW52YXgpe1xuICAgICAgICAgdGhpcy5nZXRTdGFnZSgpLnBhcmVudC5fdGFza0xpc3QucHVzaCggdGhpcyApO1xuICAgICAgICAgdGhpcy5fZW50ZXJJbkNhbnZheD10cnVlO1xuICAgICAgIH1cbiAgICB9LFxuICAgIC8vYXV0b1BsYXnkuLp0cnVlIOiAjOS4lOW3sue7j+aKil9fZW50ZXJGcmFtZSBwdXNoIOWIsOS6huW8leaTjueahOS7u+WKoemYn+WIl++8jFxuICAgIC8v5YiZ5Li6dHJ1ZVxuICAgIF9lbnRlckluQ2FudmF4OmZhbHNlLCBcbiAgICBfX2VudGVyRnJhbWU6ZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYoKEJhc2Uubm93LXNlbGYuX3ByZVJlbmRlclRpbWUpID49IHNlbGYuX3NwZWVkVGltZSApe1xuICAgICAgICAgICAvL+Wkp+S6jl9zcGVlZFRpbWXvvIzmiY3nrpflrozmiJDkuobkuIDluKdcbiAgICAgICAgICAgLy/kuIrmiqXlv4Pot7Mg5peg5p2h5Lu25b+D6Lez5ZCn44CCXG4gICAgICAgICAgIC8v5ZCO57ut5Y+v5Lul5Yqg5LiK5a+55bqU55qEIE1vdmllY2xpcCDot7PluKcg5b+D6LezXG4gICAgICAgICAgIHNlbGYuZ2V0U3RhZ2UoKS5oZWFydEJlYXQoKTtcbiAgICAgICB9XG5cbiAgICB9LFxuICAgIG5leHQgIDpmdW5jdGlvbigpe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBpZighc2VsZi5hdXRvUGxheSl7XG4gICAgICAgICAgIC8v5Y+q5pyJ5YaN6Z2e5pKt5pS+54q25oCB5LiL5omN5pyJ5pWIXG4gICAgICAgICAgIHNlbGYuZ290b0FuZFN0b3Aoc2VsZi5fbmV4dCgpKTtcbiAgICAgICB9XG4gICAgfSxcbiAgICBwcmUgICA6ZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYoIXNlbGYuYXV0b1BsYXkpe1xuICAgICAgICAgICAvL+WPquacieWGjemdnuaSreaUvueKtuaAgeS4i+aJjeacieaViFxuICAgICAgICAgICBzZWxmLmdvdG9BbmRTdG9wKHNlbGYuX3ByZSgpKTtcbiAgICAgICB9XG4gICAgfSxcbiAgICBfbmV4dCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKHRoaXMuY3VycmVudEZyYW1lID49IHRoaXMuY2hpbGRyZW4ubGVuZ3RoLTEpe1xuICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUrKztcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEZyYW1lO1xuICAgIH0sXG5cbiAgICBfcHJlIDogZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYodGhpcy5jdXJyZW50RnJhbWUgPT0gMCl7XG4gICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5jaGlsZHJlbi5sZW5ndGgtMTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZS0tO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50RnJhbWU7XG4gICAgfSxcbiAgICByZW5kZXI6ZnVuY3Rpb24oY3R4KXtcbiAgICAgICAgLy/ov5nph4zkuZ/ov5jopoHlgZrmrKHov4fmu6TvvIzlpoLmnpzkuI3liLBzcGVlZFRpbWXvvIzlsLHnlaXov4dcblxuICAgICAgICAvL1RPRE/vvJrlpoLmnpzmmK/mlLnlj5htb3ZpY2xpcOeahHggb3IgeSDnrYkg6Z2e5bin5Yqo55S7IOWxnuaAp+eahOaXtuWAmeWKoOS4iui/meS4quWwseS8miDmnInmvI/luKfnjrDosaHvvIzlhYjms6jph4rmjolcbiAgICAgICAgLyogXG4gICAgICAgIGlmKCAoQmFzZS5ub3ctdGhpcy5fcHJlUmVuZGVyVGltZSkgPCB0aGlzLl9zcGVlZFRpbWUgKXtcbiAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICovXG5cbiAgICAgICAgLy/lm6DkuLrlpoLmnpxjaGlsZHJlbuS4uuepuueahOivne+8jE1vdmllY2xpcCDkvJrmioroh6rlt7Horr7nva7kuLogdmlzaWJsZTpmYWxzZe+8jOS4jeS8muaJp+ihjOWIsOi/meS4qnJlbmRlclxuICAgICAgICAvL+aJgOS7pei/memHjOWPr+S7peS4jeeUqOWBmmNoaWxkcmVuLmxlbmd0aD09MCDnmoTliKTmlq3jgIIg5aSn6IOG55qE5pCe5ZCn44CCXG5cbiAgICAgICAgaWYoICF0aGlzLm92ZXJQbGF5ICl7XG4gICAgICAgICAgICB0aGlzLmdldENoaWxkQXQodGhpcy5jdXJyZW50RnJhbWUpLl9yZW5kZXIoY3R4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wIDsgaSA8PSB0aGlzLmN1cnJlbnRGcmFtZSA7IGkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDaGlsZEF0KGkpLl9yZW5kZXIoY3R4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgdGhpcy5hdXRvUGxheSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/lpoLmnpzkuI3lvqrnjq9cbiAgICAgICAgaWYoIHRoaXMuY3VycmVudEZyYW1lID09IHRoaXMuZ2V0TnVtQ2hpbGRyZW4oKS0xICl7XG4gICAgICAgICAgICAvL+mCo+S5iO+8jOWIsOS6huacgOWQjuS4gOW4p+WwseWBnOatolxuICAgICAgICAgICAgaWYoIXRoaXMucmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuaGFzRXZlbnQoXCJlbmRcIikgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJlKFwiZW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5L2/55So5o6J5LiA5qyh5b6q546vXG4gICAgICAgICAgICBpZiggXy5pc051bWJlciggdGhpcy5yZXBlYXQgKSAmJiB0aGlzLnJlcGVhdCA+IDAgKSB7XG4gICAgICAgICAgICAgICB0aGlzLnJlcGVhdCAtLSA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmF1dG9QbGF5KXtcbiAgICAgICAgICAgIC8v5aaC5p6c6KaB5pKt5pS+XG4gICAgICAgICAgICBpZiggKEJhc2Uubm93LXRoaXMuX3ByZVJlbmRlclRpbWUpID49IHRoaXMuX3NwZWVkVGltZSApe1xuICAgICAgICAgICAgICAgIC8v5YWI5oqK5b2T5YmN57uY5Yi255qE5pe26Ze054K56K6w5b2VXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlUmVuZGVyVGltZSA9IEJhc2Uubm93O1xuICAgICAgICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3B1c2gyVGFza0xpc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5pqC5YGc5pKt5pS+XG4gICAgICAgICAgICBpZih0aGlzLl9lbnRlckluQ2FudmF4KXtcbiAgICAgICAgICAgICAgICAvL+WmguaenOi/meS4quaXtuWAmSDlt7Lnu48g5re75Yqg5Yiw5LqGY2FudmF455qE5Lu75Yqh5YiX6KGoXG4gICAgICAgICAgICAgICAgdGhpcy5fZW50ZXJJbkNhbnZheD1mYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgdExpc3QgPSB0aGlzLmdldFN0YWdlKCkucGFyZW50Ll90YXNrTGlzdDtcbiAgICAgICAgICAgICAgICB0TGlzdC5zcGxpY2UoIF8uaW5kZXhPZih0TGlzdCAsIHRoaXMpICwgMSApOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSBcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNb3ZpZWNsaXA7IiwiXG4vKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDlkJHph4/mk43kvZznsbtcbiAqICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG5mdW5jdGlvbiBWZWN0b3IoeCwgeSkge1xuICAgIHZhciB2eCA9IDAsdnkgPSAwO1xuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIF8uaXNPYmplY3QoIHggKSApe1xuICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiggXy5pc0FycmF5KCBhcmcgKSApe1xuICAgICAgICAgICB2eCA9IGFyZ1swXTtcbiAgICAgICAgICAgdnkgPSBhcmdbMV07XG4gICAgICAgIH0gZWxzZSBpZiggYXJnLmhhc093blByb3BlcnR5KFwieFwiKSAmJiBhcmcuaGFzT3duUHJvcGVydHkoXCJ5XCIpICkge1xuICAgICAgICAgICB2eCA9IGFyZy54O1xuICAgICAgICAgICB2eSA9IGFyZy55O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2F4ZXMgPSBbdngsIHZ5XTtcbn07XG5WZWN0b3IucHJvdG90eXBlID0ge1xuICAgIGRpc3RhbmNlOiBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgeCA9IHRoaXMuX2F4ZXNbMF0gLSB2Ll9heGVzWzBdO1xuICAgICAgICB2YXIgeSA9IHRoaXMuX2F4ZXNbMV0gLSB2Ll9heGVzWzFdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHggKiB4KSArICh5ICogeSkpO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBWZWN0b3I7IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5aSE55CG5Li65bmz5ruR57q/5p2hXG4gKi9cbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIEBpbm5lclxuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZShwMCwgcDEsIHAyLCBwMywgdCwgdDIsIHQzKSB7XG4gICAgdmFyIHYwID0gKHAyIC0gcDApICogMC4yNTtcbiAgICB2YXIgdjEgPSAocDMgLSBwMSkgKiAwLjI1O1xuICAgIHJldHVybiAoMiAqIChwMSAtIHAyKSArIHYwICsgdjEpICogdDMgXG4gICAgICAgICAgICsgKC0gMyAqIChwMSAtIHAyKSAtIDIgKiB2MCAtIHYxKSAqIHQyXG4gICAgICAgICAgICsgdjAgKiB0ICsgcDE7XG59XG4vKipcbiAqIOWkmue6v+auteW5s+a7keabsue6vyBcbiAqIG9wdCA9PT4gcG9pbnRzICwgaXNMb29wXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICggb3B0ICkge1xuICAgIHZhciBwb2ludHMgPSBvcHQucG9pbnRzO1xuICAgIHZhciBpc0xvb3AgPSBvcHQuaXNMb29wO1xuICAgIHZhciBzbW9vdGhGaWx0ZXIgPSBvcHQuc21vb3RoRmlsdGVyO1xuXG4gICAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGg7XG4gICAgaWYoIGxlbiA9PSAxICl7XG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIHZhciByZXQgPSBbXTtcbiAgICB2YXIgZGlzdGFuY2UgID0gMDtcbiAgICB2YXIgcHJlVmVydG9yID0gbmV3IFZlY3RvciggcG9pbnRzWzBdICk7XG4gICAgdmFyIGlWdG9yICAgICA9IG51bGxcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlWdG9yID0gbmV3IFZlY3Rvcihwb2ludHNbaV0pO1xuICAgICAgICBkaXN0YW5jZSArPSBwcmVWZXJ0b3IuZGlzdGFuY2UoIGlWdG9yICk7XG4gICAgICAgIHByZVZlcnRvciA9IGlWdG9yO1xuICAgIH1cblxuICAgIHByZVZlcnRvciA9IG51bGw7XG4gICAgaVZ0b3IgICAgID0gbnVsbDtcblxuXG4gICAgLy/ln7rmnKzkuIrnrYnkuo7mm7LnjodcbiAgICB2YXIgc2VncyA9IGRpc3RhbmNlIC8gNjtcblxuICAgIHNlZ3MgPSBzZWdzIDwgbGVuID8gbGVuIDogc2VncztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ3M7IGkrKykge1xuICAgICAgICB2YXIgcG9zID0gaSAvIChzZWdzLTEpICogKGlzTG9vcCA/IGxlbiA6IGxlbiAtIDEpO1xuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcihwb3MpO1xuXG4gICAgICAgIHZhciB3ID0gcG9zIC0gaWR4O1xuXG4gICAgICAgIHZhciBwMDtcbiAgICAgICAgdmFyIHAxID0gcG9pbnRzW2lkeCAlIGxlbl07XG4gICAgICAgIHZhciBwMjtcbiAgICAgICAgdmFyIHAzO1xuICAgICAgICBpZiAoIWlzTG9vcCkge1xuICAgICAgICAgICAgcDAgPSBwb2ludHNbaWR4ID09PSAwID8gaWR4IDogaWR4IC0gMV07XG4gICAgICAgICAgICBwMiA9IHBvaW50c1tpZHggPiBsZW4gLSAyID8gbGVuIC0gMSA6IGlkeCArIDFdO1xuICAgICAgICAgICAgcDMgPSBwb2ludHNbaWR4ID4gbGVuIC0gMyA/IGxlbiAtIDEgOiBpZHggKyAyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAwID0gcG9pbnRzWyhpZHggLTEgKyBsZW4pICUgbGVuXTtcbiAgICAgICAgICAgIHAyID0gcG9pbnRzWyhpZHggKyAxKSAlIGxlbl07XG4gICAgICAgICAgICBwMyA9IHBvaW50c1soaWR4ICsgMikgJSBsZW5dO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHcyID0gdyAqIHc7XG4gICAgICAgIHZhciB3MyA9IHcgKiB3MjtcblxuICAgICAgICB2YXIgcnAgPSBbXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMF0sIHAxWzBdLCBwMlswXSwgcDNbMF0sIHcsIHcyLCB3MyksXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMV0sIHAxWzFdLCBwMlsxXSwgcDNbMV0sIHcsIHcyLCB3MylcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgIF8uaXNGdW5jdGlvbihzbW9vdGhGaWx0ZXIpICYmIHNtb290aEZpbHRlciggcnAgKTtcblxuICAgICAgICByZXQucHVzaCggcnAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn07IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaKmOe6vyDnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcG9pbnRMaXN0IOWQhOS4qumhtuinkuWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgQmFzZSBmcm9tIFwiLi4vY29yZS9CYXNlXCI7XHJcbmltcG9ydCBTbW9vdGhTcGxpbmUgZnJvbSBcIi4uL2dlb20vU21vb3RoU3BsaW5lXCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgQnJva2VuTGluZSA9IGZ1bmN0aW9uKG9wdCAsIGF0eXBlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcImJyb2tlbmxpbmVcIjtcclxuICAgIHNlbGYuX2RyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICBvcHQgPSBCYXNlLmNoZWNrT3B0KG9wdCk7XHJcbiAgICBpZiggYXR5cGUgIT09IFwiY2xvbmVcIiApe1xyXG4gICAgICAgIHNlbGYuX2luaXRQb2ludExpc3Qob3B0LmNvbnRleHQpO1xyXG4gICAgfTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgbGluZVR5cGU6IG51bGwsXHJcbiAgICAgICAgc21vb3RoOiBmYWxzZSxcclxuICAgICAgICBwb2ludExpc3Q6IFtdLCAvL3tBcnJheX0gIC8vIOW/hemhu++8jOWQhOS4qumhtuinkuWdkOagh1xyXG4gICAgICAgIHNtb290aEZpbHRlcjogbnVsbFxyXG4gICAgfSwgb3B0LmNvbnRleHQgKTtcclxuXHJcbiAgICBCcm9rZW5MaW5lLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbkJhc2UuY3JlYXRDbGFzcyhCcm9rZW5MaW5lLCBTaGFwZSwge1xyXG4gICAgJHdhdGNoOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICBpZiAobmFtZSA9PSBcInBvaW50TGlzdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRQb2ludExpc3QodGhpcy5jb250ZXh0LCB2YWx1ZSwgcHJlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfaW5pdFBvaW50TGlzdDogZnVuY3Rpb24oY29udGV4dCwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG15QyA9IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKG15Qy5zbW9vdGgpIHtcclxuICAgICAgICAgICAgLy9zbW9vdGhGaWx0ZXIgLS0g5q+U5aaC5Zyo5oqY57q/5Zu+5Lit44CC5Lya5Lyg5LiA5Liqc21vb3RoRmlsdGVy6L+H5p2l5YGacG9pbnTnmoTnuqDmraPjgIJcclxuICAgICAgICAgICAgLy/orql55LiN6IO96LaF6L+H5bqV6YOo55qE5Y6f54K5XHJcbiAgICAgICAgICAgIHZhciBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHM6IG15Qy5wb2ludExpc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKG15Qy5zbW9vdGhGaWx0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc21vb3RoRmlsdGVyID0gbXlDLnNtb290aEZpbHRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7IC8v5pys5qyh6L2s5o2i5LiN5Ye65Y+R5b+D6LezXHJcbiAgICAgICAgICAgIHZhciBjdXJyTCA9IFNtb290aFNwbGluZShvYmopO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyTFtjdXJyTC5sZW5ndGggLSAxXVswXSA9IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdWzBdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBteUMucG9pbnRMaXN0ID0gY3Vyckw7XHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICAvL3BvbHlnb27pnIDopoHopobnm5ZkcmF35pa55rOV77yM5omA5Lul6KaB5oqK5YW35L2T55qE57uY5Yi25Luj56CB5L2c5Li6X2RyYXfmir3nprvlh7rmnaVcclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgIH0sXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xyXG4gICAgICAgIGlmIChwb2ludExpc3QubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAvLyDlsJHkuo4y5Liq54K55bCx5LiN55S75LqGflxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWNvbnRleHQubGluZVR5cGUgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnc29saWQnKSB7XHJcbiAgICAgICAgICAgIC8v6buY6K6k5Li65a6e57q/XHJcbiAgICAgICAgICAgIC8vVE9ETzrnm67liY3lpoLmnpwg5pyJ6K6+572uc21vb3RoIOeahOaDheWGteS4i+aYr+S4jeaUr+aMgeiZmue6v+eahFxyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHBvaW50TGlzdFswXVswXSwgcG9pbnRMaXN0WzBdWzFdKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5zbW9vdGgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNpID0gMCwgc2wgPSBwb2ludExpc3QubGVuZ3RoOyBzaSA8IHNsOyBzaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpID09IHNsLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCBwb2ludExpc3Rbc2ldWzBdICwgcG9pbnRMaXN0W3NpXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oIHBvaW50TGlzdFtzaSsxXVswXSAsIHBvaW50TGlzdFtzaSsxXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpKz0xO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v55S76Jma57q/55qE5pa55rOVICBcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21YID0gcG9pbnRMaXN0W2kgLSAxXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9YID0gcG9pbnRMaXN0W2ldWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tWSA9IHBvaW50TGlzdFtpIC0gMV1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvWSA9IHBvaW50TGlzdFtpXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhjdHgsIGZyb21YLCBmcm9tWSwgdG9YLCB0b1ksIDUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IGNvbnRleHQgPyBjb250ZXh0IDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFJlY3RGb3JtUG9pbnRMaXN0KGNvbnRleHQpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgQnJva2VuTGluZTsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAciDlnIbljYrlvoRcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxuXHJcbnZhciBDaXJjbGUgPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwiY2lyY2xlXCI7XHJcblxyXG4gICAgb3B0ID0gQmFzZS5jaGVja09wdCggb3B0ICk7XHJcblxyXG4gICAgLy/pu5jorqTmg4XlhrXkuIvpnaLvvIxjaXJjbGXkuI3pnIDopoHmiop4eei/m+ihjHBhcmVudEludOi9rOaNolxyXG4gICAgKCBcInh5VG9JbnRcIiBpbiBvcHQgKSB8fCAoIG9wdC54eVRvSW50ID0gZmFsc2UgKTtcclxuXHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgIHIgOiBvcHQuY29udGV4dC5yIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5ZyG5Y2K5b6EXHJcbiAgICB9XHJcbiAgICBDaXJjbGUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5CYXNlLmNyZWF0Q2xhc3MoQ2lyY2xlICwgU2hhcGUgLCB7XHJcbiAgIC8qKlxyXG4gICAgICog5Yib5bu65ZyG5b2i6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0ge0NvbnRleHQyRH0gY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBkcmF3IDogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIGlmICghc3R5bGUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmFyYygwICwgMCwgc3R5bGUuciwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuefqeW9ouWMuuWfn++8jOeUqOS6juWxgOmDqOWIt+aWsOWSjOaWh+Wtl+WumuS9jVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlXHJcbiAgICAgKi9cclxuICAgIGdldFJlY3QgOiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIHZhciBsaW5lV2lkdGg7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICBpZiAoc3R5bGUuZmlsbFN0eWxlIHx8IHN0eWxlLnN0cm9rZVN0eWxlICkge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4IDogTWF0aC5yb3VuZCgwIC0gc3R5bGUuciAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICB5IDogTWF0aC5yb3VuZCgwIC0gc3R5bGUuciAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICB3aWR0aCA6IHN0eWxlLnIgKiAyICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQgOiBzdHlsZS5yICogMiArIGxpbmVXaWR0aFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2lyY2xlO1xyXG5cclxuXHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IC0tIHQgezAsIDF9XG4gICAgICogQHJldHVybiB7UG9pbnR9ICAtLSByZXR1cm4gcG9pbnQgYXQgdGhlIGdpdmVuIHRpbWUgaW4gdGhlIGJlemllciBhcmNcbiAgICAgKi9cbiAgICBnZXRQb2ludEJ5VGltZTogZnVuY3Rpb24odCAsIHBsaXN0KSB7XG4gICAgICAgIHZhciBpdCA9IDEgLSB0LFxuICAgICAgICBpdDIgPSBpdCAqIGl0LFxuICAgICAgICBpdDMgPSBpdDIgKiBpdDtcbiAgICAgICAgdmFyIHQyID0gdCAqIHQsXG4gICAgICAgIHQzID0gdDIgKiB0O1xuICAgICAgICB2YXIgeFN0YXJ0PXBsaXN0WzBdLHlTdGFydD1wbGlzdFsxXSxjcFgxPXBsaXN0WzJdLGNwWTE9cGxpc3RbM10sY3BYMj0wLGNwWTI9MCx4RW5kPTAseUVuZD0wO1xuICAgICAgICBpZihwbGlzdC5sZW5ndGg+Nil7XG4gICAgICAgICAgICBjcFgyPXBsaXN0WzRdO1xuICAgICAgICAgICAgY3BZMj1wbGlzdFs1XTtcbiAgICAgICAgICAgIHhFbmQ9cGxpc3RbNl07XG4gICAgICAgICAgICB5RW5kPXBsaXN0WzddO1xuICAgICAgICAgICAgLy/kuInmrKHotJ3loZ7lsJRcbiAgICAgICAgICAgIHJldHVybiB7IFxuICAgICAgICAgICAgICAgIHggOiBpdDMgKiB4U3RhcnQgKyAzICogaXQyICogdCAqIGNwWDEgKyAzICogaXQgKiB0MiAqIGNwWDIgKyB0MyAqIHhFbmQsXG4gICAgICAgICAgICAgICAgeSA6IGl0MyAqIHlTdGFydCArIDMgKiBpdDIgKiB0ICogY3BZMSArIDMgKiBpdCAqIHQyICogY3BZMiArIHQzICogeUVuZFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/kuozmrKHotJ3loZ7lsJRcbiAgICAgICAgICAgIHhFbmQ9cGxpc3RbNF07XG4gICAgICAgICAgICB5RW5kPXBsaXN0WzVdO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4IDogaXQyICogeFN0YXJ0ICsgMiAqIHQgKiBpdCAqIGNwWDEgKyB0Mip4RW5kLFxuICAgICAgICAgICAgICAgIHkgOiBpdDIgKiB5U3RhcnQgKyAyICogdCAqIGl0ICogY3BZMSArIHQyKnlFbmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICogUGF0aCDnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcGF0aCBwYXRo5LiyXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBCYXNlIGZyb20gXCIuLi9jb3JlL0Jhc2VcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuaW1wb3J0IE1hdHJpeCBmcm9tIFwiLi4vZ2VvbS9NYXRyaXhcIjtcclxuaW1wb3J0IEJlemllciBmcm9tIFwiLi4vZ2VvbS9iZXppZXJcIjtcclxuXHJcbnZhciBQYXRoID0gZnVuY3Rpb24ob3B0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInBhdGhcIjtcclxuICAgIG9wdCA9IEJhc2UuY2hlY2tPcHQob3B0KTtcclxuICAgIGlmIChcImRyYXdUeXBlT25seVwiIGluIG9wdCkge1xyXG4gICAgICAgIHNlbGYuZHJhd1R5cGVPbmx5ID0gb3B0LmRyYXdUeXBlT25seTtcclxuICAgIH07XHJcbiAgICBzZWxmLl9fcGFyc2VQYXRoRGF0YSA9IG51bGw7XHJcbiAgICB2YXIgX2NvbnRleHQgPSB7XHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy/ku47kuIvpnaLnmoRwYXRo5Lit6K6h566X5b6X5Yiw55qE6L6555WM54K555qE6ZuG5ZCIXHJcbiAgICAgICAgcGF0aDogb3B0LmNvbnRleHQucGF0aCB8fCBcIlwiIC8v5a2X56ym5LiyIOW/hemhu++8jOi3r+W+hOOAguS+i+WmgjpNIDAgMCBMIDAgMTAgTCAxMCAxMCBaICjkuIDkuKrkuInop5LlvaIpXHJcbiAgICAgICAgICAgIC8vTSA9IG1vdmV0b1xyXG4gICAgICAgICAgICAvL0wgPSBsaW5ldG9cclxuICAgICAgICAgICAgLy9IID0gaG9yaXpvbnRhbCBsaW5ldG9cclxuICAgICAgICAgICAgLy9WID0gdmVydGljYWwgbGluZXRvXHJcbiAgICAgICAgICAgIC8vQyA9IGN1cnZldG9cclxuICAgICAgICAgICAgLy9TID0gc21vb3RoIGN1cnZldG9cclxuICAgICAgICAgICAgLy9RID0gcXVhZHJhdGljIEJlbHppZXIgY3VydmVcclxuICAgICAgICAgICAgLy9UID0gc21vb3RoIHF1YWRyYXRpYyBCZWx6aWVyIGN1cnZldG9cclxuICAgICAgICAgICAgLy9aID0gY2xvc2VwYXRoXHJcbiAgICB9O1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKF9jb250ZXh0LCAoc2VsZi5fY29udGV4dCB8fCB7fSkpO1xyXG4gICAgUGF0aC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5CYXNlLmNyZWF0Q2xhc3MoUGF0aCwgU2hhcGUsIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJwYXRoXCIpIHsgLy/lpoLmnpxwYXRo5pyJ5Y+Y5Yqo77yM6ZyA6KaB6Ieq5Yqo6K6h566X5paw55qEcG9pbnRMaXN0XHJcbiAgICAgICAgICAgIHRoaXMuX19wYXJzZVBhdGhEYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnBvaW50TGlzdCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcGFyc2VQYXRoRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9fcGFyc2VQYXRoRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX3BhcnNlUGF0aERhdGE7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy/liIbmi4blrZDliIbnu4RcclxuICAgICAgICB0aGlzLl9fcGFyc2VQYXRoRGF0YSA9IFtdO1xyXG4gICAgICAgIHZhciBwYXRocyA9IF8uY29tcGFjdChkYXRhLnJlcGxhY2UoL1tNbV0vZywgXCJcXFxcciQmXCIpLnNwbGl0KCdcXFxccicpKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIF8uZWFjaChwYXRocywgZnVuY3Rpb24ocGF0aFN0cikge1xyXG4gICAgICAgICAgICBtZS5fX3BhcnNlUGF0aERhdGEucHVzaChtZS5fcGFyc2VDaGlsZFBhdGhEYXRhKHBhdGhTdHIpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fX3BhcnNlUGF0aERhdGE7XHJcbiAgICB9LFxyXG4gICAgX3BhcnNlQ2hpbGRQYXRoRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbW1hbmQgc3RyaW5nXHJcbiAgICAgICAgdmFyIGNzID0gZGF0YTtcclxuICAgICAgICAvLyBjb21tYW5kIGNoYXJzXHJcbiAgICAgICAgdmFyIGNjID0gW1xyXG4gICAgICAgICAgICAnbScsICdNJywgJ2wnLCAnTCcsICd2JywgJ1YnLCAnaCcsICdIJywgJ3onLCAnWicsXHJcbiAgICAgICAgICAgICdjJywgJ0MnLCAncScsICdRJywgJ3QnLCAnVCcsICdzJywgJ1MnLCAnYScsICdBJ1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8gIC9nLCAnICcpO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvIC9nLCAnLCcpO1xyXG4gICAgICAgIC8vY3MgPSBjcy5yZXBsYWNlKC8oLiktL2csIFwiJDEsLVwiKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLyhcXGQpLS9nLCAnJDEsLScpO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvLCwvZywgJywnKTtcclxuICAgICAgICB2YXIgbjtcclxuICAgICAgICAvLyBjcmVhdGUgcGlwZXMgc28gdGhhdCB3ZSBjYW4gc3BsaXQgdGhlIGRhdGFcclxuICAgICAgICBmb3IgKG4gPSAwOyBuIDwgY2MubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgY3MgPSBjcy5yZXBsYWNlKG5ldyBSZWdFeHAoY2Nbbl0sICdnJyksICd8JyArIGNjW25dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIGFycmF5XHJcbiAgICAgICAgdmFyIGFyciA9IGNzLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgdmFyIGNhID0gW107XHJcbiAgICAgICAgLy8gaW5pdCBjb250ZXh0IHBvaW50XHJcbiAgICAgICAgdmFyIGNweCA9IDA7XHJcbiAgICAgICAgdmFyIGNweSA9IDA7XHJcbiAgICAgICAgZm9yIChuID0gMTsgbiA8IGFyci5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gYXJyW25dO1xyXG4gICAgICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoMCk7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zbGljZSgxKTtcclxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCgnZSwtJywgJ2cnKSwgJ2UtJyk7XHJcblxyXG4gICAgICAgICAgICAvL+acieeahOaXtuWAme+8jOavlOWmguKAnDIy77yMLTIy4oCdIOaVsOaNruWPr+iDveS8mue7j+W4uOeahOiiq+WGmeaIkDIyLTIy77yM6YKj5LmI6ZyA6KaB5omL5Yqo5L+u5pS5XHJcbiAgICAgICAgICAgIC8vc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCgnLScsICdnJyksICcsLScpO1xyXG4gICAgICAgICAgICAvL3N0ciA9IHN0ci5yZXBsYWNlKC8oLiktL2csIFwiJDEsLVwiKVxyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzdHIuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA+IDAgJiYgcFswXSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwW2ldID0gcGFyc2VGbG9hdChwW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAocC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFswXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdGxQdHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RsUHR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZDbWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJ4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHJ5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBzaTtcclxuICAgICAgICAgICAgICAgIHZhciBmYTtcclxuICAgICAgICAgICAgICAgIHZhciBmcztcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgeDEgPSBjcHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgeTEgPSBjcHk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCBsLCBILCBoLCBWLCBhbmQgdiB0byBMXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnbCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ00nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdoJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0gnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1YnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdDJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gocC5zaGlmdCgpLCBwLnNoaWZ0KCksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q21kID0gY2FbY2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2Q21kLmNvbW1hbmQgPT09ICdDJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4ICsgKGNweCAtIHByZXZDbWQucG9pbnRzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweSArIChjcHkgLSBwcmV2Q21kLnBvaW50c1szXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3RsUHR4LCBjdGxQdHksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdDJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ0MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCwgY3RsUHR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwLnNoaWZ0KCksIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdRJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdUJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ1EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjdGxQdHgsIGN0bFB0eSwgY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnUSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGN0bFB0eCwgY3RsUHR5LCBjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTsgLy945Y2K5b6EXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ5ID0gcC5zaGlmdCgpOyAvL3nljYrlvoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHNpID0gcC5zaGlmdCgpOyAvL+aXi+i9rOinkuW6plxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYSA9IHAuc2hpZnQoKTsgLy/op5LluqblpKflsI8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpOyAvL+aXtumSiOaWueWQkVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCksIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMgPSB0aGlzLl9jb252ZXJ0UG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSwgeTEsIGNweCwgY3B5LCBmYSwgZnMsIHJ4LCByeSwgcHNpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBzaSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmEgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IHRoaXMuX2NvbnZlcnRQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxLCB5MSwgY3B4LCBjcHksIGZhLCBmcywgcngsIHJ5LCBwc2lcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNtZCB8fCBjLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50czogcG9pbnRzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGMgPT09ICd6JyB8fCBjID09PSAnWicpIHtcclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICd6JyxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHM6IFtdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNhO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKlxyXG4gICAgICogQHBhcmFtIHgxIOWOn+eCuXhcclxuICAgICAqIEBwYXJhbSB5MSDljp/ngrl5XHJcbiAgICAgKiBAcGFyYW0geDIg57uI54K55Z2Q5qCHIHhcclxuICAgICAqIEBwYXJhbSB5MiDnu4jngrnlnZDmoIcgeVxyXG4gICAgICogQHBhcmFtIGZhIOinkuW6puWkp+Wwj1xyXG4gICAgICogQHBhcmFtIGZzIOaXtumSiOaWueWQkVxyXG4gICAgICogQHBhcmFtIHJ4IHjljYrlvoRcclxuICAgICAqIEBwYXJhbSByeSB55Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0gcHNpRGVnIOaXi+i9rOinkuW6plxyXG4gICAgICovXHJcbiAgICBfY29udmVydFBvaW50OiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZmEsIGZzLCByeCwgcnksIHBzaURlZykge1xyXG5cclxuICAgICAgICB2YXIgcHNpID0gcHNpRGVnICogKE1hdGguUEkgLyAxODAuMCk7XHJcbiAgICAgICAgdmFyIHhwID0gTWF0aC5jb3MocHNpKSAqICh4MSAtIHgyKSAvIDIuMCArIE1hdGguc2luKHBzaSkgKiAoeTEgLSB5MikgLyAyLjA7XHJcbiAgICAgICAgdmFyIHlwID0gLTEgKiBNYXRoLnNpbihwc2kpICogKHgxIC0geDIpIC8gMi4wICsgTWF0aC5jb3MocHNpKSAqICh5MSAtIHkyKSAvIDIuMDtcclxuXHJcbiAgICAgICAgdmFyIGxhbWJkYSA9ICh4cCAqIHhwKSAvIChyeCAqIHJ4KSArICh5cCAqIHlwKSAvIChyeSAqIHJ5KTtcclxuXHJcbiAgICAgICAgaWYgKGxhbWJkYSA+IDEpIHtcclxuICAgICAgICAgICAgcnggKj0gTWF0aC5zcXJ0KGxhbWJkYSk7XHJcbiAgICAgICAgICAgIHJ5ICo9IE1hdGguc3FydChsYW1iZGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGYgPSBNYXRoLnNxcnQoKCgocnggKiByeCkgKiAocnkgKiByeSkpIC0gKChyeCAqIHJ4KSAqICh5cCAqIHlwKSkgLSAoKHJ5ICogcnkpICogKHhwICogeHApKSkgLyAoKHJ4ICogcngpICogKHlwICogeXApICsgKHJ5ICogcnkpICogKHhwICogeHApKSk7XHJcblxyXG4gICAgICAgIGlmIChmYSA9PT0gZnMpIHtcclxuICAgICAgICAgICAgZiAqPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTmFOKGYpKSB7XHJcbiAgICAgICAgICAgIGYgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGN4cCA9IGYgKiByeCAqIHlwIC8gcnk7XHJcbiAgICAgICAgdmFyIGN5cCA9IGYgKiAtcnkgKiB4cCAvIHJ4O1xyXG5cclxuICAgICAgICB2YXIgY3ggPSAoeDEgKyB4MikgLyAyLjAgKyBNYXRoLmNvcyhwc2kpICogY3hwIC0gTWF0aC5zaW4ocHNpKSAqIGN5cDtcclxuICAgICAgICB2YXIgY3kgPSAoeTEgKyB5MikgLyAyLjAgKyBNYXRoLnNpbihwc2kpICogY3hwICsgTWF0aC5jb3MocHNpKSAqIGN5cDtcclxuXHJcbiAgICAgICAgdmFyIHZNYWcgPSBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdlJhdGlvID0gZnVuY3Rpb24odSwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gKHVbMF0gKiB2WzBdICsgdVsxXSAqIHZbMV0pIC8gKHZNYWcodSkgKiB2TWFnKHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB2QW5nbGUgPSBmdW5jdGlvbih1LCB2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodVswXSAqIHZbMV0gPCB1WzFdICogdlswXSA/IC0xIDogMSkgKiBNYXRoLmFjb3ModlJhdGlvKHUsIHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHZBbmdsZShbMSwgMF0sIFsoeHAgLSBjeHApIC8gcngsICh5cCAtIGN5cCkgLyByeV0pO1xyXG4gICAgICAgIHZhciB1ID0gWyh4cCAtIGN4cCkgLyByeCwgKHlwIC0gY3lwKSAvIHJ5XTtcclxuICAgICAgICB2YXIgdiA9IFsoLTEgKiB4cCAtIGN4cCkgLyByeCwgKC0xICogeXAgLSBjeXApIC8gcnldO1xyXG4gICAgICAgIHZhciBkVGhldGEgPSB2QW5nbGUodSwgdik7XHJcblxyXG4gICAgICAgIGlmICh2UmF0aW8odSwgdikgPD0gLTEpIHtcclxuICAgICAgICAgICAgZFRoZXRhID0gTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZSYXRpbyh1LCB2KSA+PSAxKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmcyA9PT0gMCAmJiBkVGhldGEgPiAwKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IGRUaGV0YSAtIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZnMgPT09IDEgJiYgZFRoZXRhIDwgMCkge1xyXG4gICAgICAgICAgICBkVGhldGEgPSBkVGhldGEgKyAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtjeCwgY3ksIHJ4LCByeSwgdGhldGEsIGRUaGV0YSwgcHNpLCBmc107XHJcbiAgICB9LFxyXG4gICAgLypcclxuICAgICAqIOiOt+WPlmJlemllcuS4iumdoueahOeCueWIl+ihqFxyXG4gICAgICogKi9cclxuICAgIF9nZXRCZXppZXJQb2ludHM6IGZ1bmN0aW9uKHApIHtcclxuICAgICAgICB2YXIgc3RlcHMgPSBNYXRoLmFicyhNYXRoLnNxcnQoTWF0aC5wb3cocC5zbGljZSgtMSlbMF0gLSBwWzFdLCAyKSArIE1hdGgucG93KHAuc2xpY2UoLTIsIC0xKVswXSAtIHBbMF0sIDIpKSk7XHJcbiAgICAgICAgc3RlcHMgPSBNYXRoLmNlaWwoc3RlcHMgLyA1KTtcclxuICAgICAgICB2YXIgcGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHN0ZXBzOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHQgPSBpIC8gc3RlcHM7XHJcbiAgICAgICAgICAgIHZhciB0cCA9IEJlemllci5nZXRQb2ludEJ5VGltZSh0LCBwKTtcclxuICAgICAgICAgICAgcGFyci5wdXNoKHRwLngpO1xyXG4gICAgICAgICAgICBwYXJyLnB1c2godHAueSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcGFycjtcclxuICAgIH0sXHJcbiAgICAvKlxyXG4gICAgICog5aaC5p6ccGF0aOS4reaciUEgYSDvvIzopoHlr7zlh7rlr7nlupTnmoRwb2ludHNcclxuICAgICAqL1xyXG4gICAgX2dldEFyY1BvaW50czogZnVuY3Rpb24ocCkge1xyXG5cclxuICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgIHZhciBjeSA9IHBbMV07XHJcbiAgICAgICAgdmFyIHJ4ID0gcFsyXTtcclxuICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHBbNF07XHJcbiAgICAgICAgdmFyIGRUaGV0YSA9IHBbNV07XHJcbiAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgdmFyIGZzID0gcFs3XTtcclxuICAgICAgICB2YXIgciA9IChyeCA+IHJ5KSA/IHJ4IDogcnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSAocnggPiByeSkgPyByeSAvIHJ4IDogMTtcclxuXHJcbiAgICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgTWF0cml4KCk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS5pZGVudGl0eSgpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKHBzaSk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoY3gsIGN5KTtcclxuXHJcbiAgICAgICAgdmFyIGNwcyA9IFtdO1xyXG4gICAgICAgIHZhciBzdGVwcyA9ICgzNjAgLSAoIWZzID8gMSA6IC0xKSAqIGRUaGV0YSAqIDE4MCAvIE1hdGguUEkpICUgMzYwO1xyXG5cclxuICAgICAgICBzdGVwcyA9IE1hdGguY2VpbChNYXRoLm1pbihNYXRoLmFicyhkVGhldGEpICogMTgwIC8gTWF0aC5QSSwgciAqIE1hdGguYWJzKGRUaGV0YSkgLyA4KSk7IC8v6Ze06ZqU5LiA5Liq5YOP57SgIOaJgOS7pSAvMlxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludCA9IFtNYXRoLmNvcyh0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByLCBNYXRoLnNpbih0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByXTtcclxuICAgICAgICAgICAgcG9pbnQgPSBfdHJhbnNmb3JtLm11bFZlY3Rvcihwb2ludCk7XHJcbiAgICAgICAgICAgIGNwcy5wdXNoKHBvaW50WzBdKTtcclxuICAgICAgICAgICAgY3BzLnB1c2gocG9pbnRbMV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNwcztcclxuICAgIH0sXHJcblxyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBzdHlsZSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAgY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHZhciBwYXRoID0gc3R5bGUucGF0aDtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gdGhpcy5fcGFyc2VQYXRoRGF0YShwYXRoKTtcclxuICAgICAgICB0aGlzLl9zZXRQb2ludExpc3QocGF0aEFycmF5LCBzdHlsZSk7XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IDAsIGdsID0gcGF0aEFycmF5Lmxlbmd0aDsgZyA8IGdsOyBnKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoQXJyYXlbZ10ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHBhdGhBcnJheVtnXVtpXS5jb21tYW5kLCBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBbMF0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwWzBdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHBbMF0sIHBbMV0sIHBbMl0sIHBbM10sIHBbNF0sIHBbNV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdRJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8ocFswXSwgcFsxXSwgcFsyXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3kgPSBwWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnggPSBwWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhldGEgPSBwWzRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZFRoZXRhID0gcFs1XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcyA9IHBbN107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gKHJ4ID4gcnkpID8gcnggOiByeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVZID0gKHJ4ID4gcnkpID8gcnkgLyByeCA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnJvdGF0ZShwc2kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZShjeCwgY3kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+i/kOeUqOefqemYteW8gOWni+WPmOW9olxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYXJjKDAsIDAsIHIsIHRoZXRhLCB0aGV0YSArIGRUaGV0YSwgMSAtIGZzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9fdHJhbnNmb3JtLmludmVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS5pbnZlcnQoKS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd6JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgX3NldFBvaW50TGlzdDogZnVuY3Rpb24ocGF0aEFycmF5LCBzdHlsZSkge1xyXG4gICAgICAgIGlmIChzdHlsZS5wb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g6K6w5b2V6L6555WM54K577yM55So5LqO5Yik5pataW5zaWRlXHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IHN0eWxlLnBvaW50TGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGcgPSAwLCBnbCA9IHBhdGhBcnJheS5sZW5ndGg7IGcgPCBnbDsgZysrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2luZ2xlUG9pbnRMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBwYXRoQXJyYXlbZ11baV0uY29tbWFuZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gJ0EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHRoaXMuX2dldEFyY1BvaW50cyhwKTtcclxuICAgICAgICAgICAgICAgICAgICAvL0Hlkb3ku6TnmoTor53vvIzlpJbmjqXnn6nlvaLnmoTmo4DmtYvlv4XpobvovazmjaLkuLpfcG9pbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aEFycmF5W2ddW2ldLl9wb2ludHMgPSBwO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJDXCIgfHwgY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJRXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY1N0YXJ0ID0gWzAsIDBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBzaW5nbGVQb2ludExpc3Quc2xpY2UoLTEpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZVBvaW50cyA9IChwYXRoQXJyYXlbZ11baSAtIDFdLl9wb2ludHMgfHwgcGF0aEFycmF5W2ddW2kgLSAxXS5wb2ludHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJlUG9pbnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBwcmVQb2ludHMuc2xpY2UoLTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBwID0gdGhpcy5fZ2V0QmV6aWVyUG9pbnRzKGNTdGFydC5jb25jYXQocCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhBcnJheVtnXVtpXS5fcG9pbnRzID0gcDtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwLmxlbmd0aDsgaiA8IGs7IGogKz0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBweCA9IHBbal07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHB5ID0gcFtqICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCghcHggJiYgcHghPTApIHx8ICghcHkgJiYgcHkhPTApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlUG9pbnRMaXN0LnB1c2goW3B4LCBweV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCAmJiBwb2ludExpc3QucHVzaChzaW5nbGVQb2ludExpc3QpO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBnZXRSZWN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsaW5lV2lkdGg7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICBpZiAoc3R5bGUuc3Ryb2tlU3R5bGUgfHwgc3R5bGUuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWluWCA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIG1heFggPSAtTnVtYmVyLk1BWF9WQUxVRTsvL051bWJlci5NSU5fVkFMVUU7XHJcblxyXG4gICAgICAgIHZhciBtaW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICB2YXIgbWF4WSA9IC1OdW1iZXIuTUFYX1ZBTFVFOy8vTnVtYmVyLk1JTl9WQUxVRTtcclxuXHJcbiAgICAgICAgLy8g5bmz56e75Z2Q5qCHXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuXHJcbiAgICAgICAgdmFyIHBhdGhBcnJheSA9IHRoaXMuX3BhcnNlUGF0aERhdGEoc3R5bGUucGF0aCk7XHJcbiAgICAgICAgdGhpcy5fc2V0UG9pbnRMaXN0KHBhdGhBcnJheSwgc3R5bGUpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBnID0gMCwgZ2wgPSBwYXRoQXJyYXkubGVuZ3RoOyBnIDwgZ2w7IGcrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwYXRoQXJyYXlbZ11baV0uX3BvaW50cyB8fCBwYXRoQXJyYXlbZ11baV0ucG9pbnRzO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqICUgMiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocFtqXSArIHggPCBtaW5YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5YID0gcFtqXSArIHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB4ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4WCA9IHBbal0gKyB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB5IDwgbWluWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluWSA9IHBbal0gKyB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwW2pdICsgeSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFkgPSBwW2pdICsgeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciByZWN0O1xyXG4gICAgICAgIGlmIChtaW5YID09PSBOdW1iZXIuTUFYX1ZBTFVFIHx8IG1heFggPT09IE51bWJlci5NSU5fVkFMVUUgfHwgbWluWSA9PT0gTnVtYmVyLk1BWF9WQUxVRSB8fCBtYXhZID09PSBOdW1iZXIuTUlOX1ZBTFVFKSB7XHJcbiAgICAgICAgICAgIHJlY3QgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICAgICAgeTogMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVjdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IE1hdGgucm91bmQobWluWCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgeTogTWF0aC5yb3VuZChtaW5ZIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogbWF4WCAtIG1pblggKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG1heFkgLSBtaW5ZICsgbGluZVdpZHRoXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZWN0O1xyXG4gICAgfVxyXG5cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBhdGg7IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOawtOa7tOW9oiDnsbtcclxuICog5rS+55Sf6IeqUGF0aOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBociDmsLTmu7TmqKrlrr3vvIjkuK3lv4PliLDmsLTlubPovrnnvJjmnIDlrr3lpITot53nprvvvIlcclxuICogQHZyIOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gKiovXHJcbmltcG9ydCBQYXRoIGZyb20gXCIuL1BhdGhcIjtcclxuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIERyb3BsZXQgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gQmFzZS5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgIGhyIDogb3B0LmNvbnRleHQuaHIgfHwgMCAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmsLTmu7TmqKrlrr3vvIjkuK3lv4PliLDmsLTlubPovrnnvJjmnIDlrr3lpITot53nprvvvIlcclxuICAgICAgICB2ciA6IG9wdC5jb250ZXh0LnZyIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5rC05ru057q16auY77yI5Lit5b+D5Yiw5bCW56uv6Led56a777yJXHJcbiAgICB9O1xyXG4gICAgRHJvcGxldC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICBzZWxmLnR5cGUgPSBcImRyb3BsZXRcIjtcclxufTtcclxuQmFzZS5jcmVhdENsYXNzKCBEcm9wbGV0ICwgUGF0aCAsIHtcclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICB2YXIgcHMgPSBcIk0gMCBcIitzdHlsZS5ocitcIiBDIFwiK3N0eWxlLmhyK1wiIFwiK3N0eWxlLmhyK1wiIFwiKyggc3R5bGUuaHIqMy8yICkgK1wiIFwiKygtc3R5bGUuaHIvMykrXCIgMCBcIisoLXN0eWxlLnZyKTtcclxuICAgICAgIHBzICs9IFwiIEMgXCIrKC1zdHlsZS5ociAqIDMvIDIpK1wiIFwiKygtc3R5bGUuaHIgLyAzKStcIiBcIisoLXN0eWxlLmhyKStcIiBcIitzdHlsZS5ocitcIiAwIFwiKyBzdHlsZS5ocjtcclxuICAgICAgIHRoaXMuY29udGV4dC5wYXRoID0gcHM7XHJcbiAgICAgICB0aGlzLl9kcmF3KGN0eCAsIHN0eWxlKTtcclxuICAgIH1cclxufSApO1xyXG5leHBvcnQgZGVmYXVsdCBEcm9wbGV0O1xyXG4iLCJcclxuLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOakreWchuW9oiDnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciSBcclxuICpcclxuICogQGhyIOakreWchuaoqui9tOWNiuW+hFxyXG4gKiBAdnIg5qSt5ZyG57q16L205Y2K5b6EXHJcbiAqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG52YXIgRWxsaXBzZSA9IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcImVsbGlwc2VcIjtcclxuXHJcbiAgICBvcHQgPSBCYXNlLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgLy94ICAgICAgICAgICAgIDogMCAsIC8ve251bWJlcn0sICAvLyDkuKLlvINcclxuICAgICAgICAvL3kgICAgICAgICAgICAgOiAwICwgLy97bnVtYmVyfSwgIC8vIOS4ouW8g++8jOWOn+WboOWQjGNpcmNsZVxyXG4gICAgICAgIGhyIDogb3B0LmNvbnRleHQuaHIgfHwgMCAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmpK3lnIbmqKrovbTljYrlvoRcclxuICAgICAgICB2ciA6IG9wdC5jb250ZXh0LnZyIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5qSt5ZyG57q16L205Y2K5b6EXHJcbiAgICB9XHJcblxyXG4gICAgRWxsaXBzZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5CYXNlLmNyZWF0Q2xhc3MoRWxsaXBzZSAsIFNoYXBlICwge1xyXG4gICAgZHJhdyA6ICBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIHIgPSAoc3R5bGUuaHIgPiBzdHlsZS52cikgPyBzdHlsZS5ociA6IHN0eWxlLnZyO1xyXG4gICAgICAgIHZhciByYXRpb1ggPSBzdHlsZS5ociAvIHI7IC8v5qiq6L2057yp5pS+5q+U546HXHJcbiAgICAgICAgdmFyIHJhdGlvWSA9IHN0eWxlLnZyIC8gcjtcclxuICAgICAgICBcclxuICAgICAgICBjdHguc2NhbGUocmF0aW9YLCByYXRpb1kpO1xyXG4gICAgICAgIGN0eC5hcmMoXHJcbiAgICAgICAgICAgIDAsIDAsIHIsIDAsIE1hdGguUEkgKiAyLCB0cnVlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgaWYgKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0ICl7XHJcbiAgICAgICAgICAgLy9pZeS4i+mdouimgeaDs+e7mOWItuS4quakreWchuWHuuadpe+8jOWwseS4jeiDveaJp+ihjOi/meatpeS6hlxyXG4gICAgICAgICAgIC8v566X5pivZXhjYW52YXMg5a6e546w5LiK6Z2i55qE5LiA5LiqYnVn5ZCnXHJcbiAgICAgICAgICAgY3R4LnNjYWxlKDEvcmF0aW9YLCAxL3JhdGlvWSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9LFxyXG4gICAgZ2V0UmVjdCA6IGZ1bmN0aW9uKHN0eWxlKXtcclxuICAgICAgICB2YXIgbGluZVdpZHRoO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHN0eWxlID8gc3R5bGUgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZpbGxTdHlsZSB8fCBzdHlsZS5zdHJva2VTdHlsZSkge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgeCA6IE1hdGgucm91bmQoMCAtIHN0eWxlLmhyIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgeSA6IE1hdGgucm91bmQoMCAtIHN0eWxlLnZyIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgd2lkdGggOiBzdHlsZS5ociAqIDIgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgaGVpZ2h0IDogc3R5bGUudnIgKiAyICsgbGluZVdpZHRoXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRWxsaXBzZTtcclxuIiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOWkmui+ueW9oiDnsbsgIO+8iOS4jeinhOWIme+8iVxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBwb2ludExpc3Qg5aSa6L655b2i5ZCE5Liq6aG26KeS5Z2Q5qCHXHJcbiAqKi9cclxuaW1wb3J0IEJyb2tlbkxpbmUgZnJvbSBcIi4vQnJva2VuTGluZVwiO1xyXG5pbXBvcnQgQmFzZSBmcm9tIFwiLi4vY29yZS9CYXNlXCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgUG9seWdvbiA9IGZ1bmN0aW9uKG9wdCAsIGF0eXBlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBvcHQgPSBCYXNlLmNoZWNrT3B0KG9wdCk7XHJcblxyXG4gICAgaWYoYXR5cGUgIT09IFwiY2xvbmVcIil7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gb3B0LmNvbnRleHQucG9pbnRMaXN0WzBdO1xyXG4gICAgICAgIHZhciBlbmQgICA9IG9wdC5jb250ZXh0LnBvaW50TGlzdFsgb3B0LmNvbnRleHQucG9pbnRMaXN0Lmxlbmd0aCAtIDEgXTtcclxuICAgICAgICBpZiggb3B0LmNvbnRleHQuc21vb3RoICl7XHJcbiAgICAgICAgICAgIG9wdC5jb250ZXh0LnBvaW50TGlzdC51bnNoaWZ0KCBlbmQgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvcHQuY29udGV4dC5wb2ludExpc3QucHVzaCggc3RhcnQgKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBQb2x5Z29uLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZihhdHlwZSAhPT0gXCJjbG9uZVwiICYmIG9wdC5jb250ZXh0LnNtb290aCAmJiBlbmQpe1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5fZHJhd1R5cGVPbmx5ID0gbnVsbDtcclxuICAgIHNlbGYudHlwZSA9IFwicG9seWdvblwiO1xyXG59O1xyXG5CYXNlLmNyZWF0Q2xhc3MoUG9seWdvbiwgQnJva2VuTGluZSwge1xyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmxpbmVUeXBlID09ICdkYXNoZWQnIHx8IGNvbnRleHQubGluZVR5cGUgPT0gJ2RvdHRlZCcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcclxuICAgICAgICAgICAgICAgIC8v54m55q6K5aSE55CG77yM6Jma57q/5Zu05LiN5oiQcGF0aO+8jOWunue6v+WGjWJ1aWxk5LiA5qyhXHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwb2ludExpc3RbMF1bMF0sIHBvaW50TGlzdFswXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL+WmguaenOS4i+mdouS4jeWKoHNhdmUgcmVzdG9yZe+8jGNhbnZhc+S8muaKiuS4i+mdoueahHBhdGjlkozkuIrpnaLnmoRwYXRo5LiA6LW3566X5L2c5LiA5p2hcGF0aOOAguWwseS8mue7mOWItuS6huS4gOadoeWunueOsOi+ueahhuWSjOS4gOiZmue6v+i+ueahhuOAglxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBvbHlnb247IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOato27ovrnlvaLvvIhuPj0z77yJXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIkgXHJcbiAqXHJcbiAqIEByIOato27ovrnlvaLlpJbmjqXlnIbljYrlvoRcclxuICogQHIg5oyH5piO5q2j5Yeg6L655b2iXHJcbiAqXHJcbiAqIEBwb2ludExpc3Qg56eB5pyJ77yM5LuO5LiK6Z2i55qEcuWSjG7orqHnrpflvpfliLDnmoTovrnnlYzlgLznmoTpm4blkIhcclxuICovXHJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuL1BvbHlnb25cIjtcclxuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIElzb2dvbiA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gQmFzZS5jaGVja09wdChvcHQpO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBwb2ludExpc3Q6IFtdLCAvL+S7juS4i+mdoueahHLlkoxu6K6h566X5b6X5Yiw55qE6L6555WM5YC855qE6ZuG5ZCIXHJcbiAgICAgICAgcjogMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOato27ovrnlvaLlpJbmjqXlnIbljYrlvoRcclxuICAgICAgICBuOiAwIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmjIfmmI7mraPlh6DovrnlvaJcclxuICAgIH0gLCBvcHQuY29udGV4dCk7XHJcbiAgICBzZWxmLnNldFBvaW50TGlzdChzZWxmLl9jb250ZXh0KTtcclxuICAgIG9wdC5jb250ZXh0ID0gc2VsZi5fY29udGV4dDtcclxuICAgIElzb2dvbi5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnR5cGUgPSBcImlzb2dvblwiO1xyXG59O1xyXG5CYXNlLmNyZWF0Q2xhc3MoSXNvZ29uLCBQb2x5Z29uLCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwiclwiIHx8IG5hbWUgPT0gXCJuXCIpIHsgLy/lpoLmnpxwYXRo5pyJ5Y+Y5Yqo77yM6ZyA6KaB6Ieq5Yqo6K6h566X5paw55qEcG9pbnRMaXN0XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UG9pbnRMaXN0KCB0aGlzLmNvbnRleHQgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0UG9pbnRMaXN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIHN0eWxlLnBvaW50TGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHZhciBuID0gc3R5bGUubiwgciA9IHN0eWxlLnI7XHJcbiAgICAgICAgdmFyIGRTdGVwID0gMiAqIE1hdGguUEkgLyBuO1xyXG4gICAgICAgIHZhciBiZWdpbkRlZyA9IC1NYXRoLlBJIC8gMjtcclxuICAgICAgICB2YXIgZGVnID0gYmVnaW5EZWc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGVuZCA9IG47IGkgPCBlbmQ7IGkrKykge1xyXG4gICAgICAgICAgICBzdHlsZS5wb2ludExpc3QucHVzaChbciAqIE1hdGguY29zKGRlZyksIHIgKiBNYXRoLnNpbihkZWcpXSk7XHJcbiAgICAgICAgICAgIGRlZyArPSBkU3RlcDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgSXNvZ29uOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDnur/mnaEg57G7XHJcbiAqXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQGxpbmVUeXBlICDlj6/pgIkg6Jma57q/IOWunueOsCDnmoQg57G75Z6LXHJcbiAqIEB4U3RhcnQgICAg5b+F6aG777yM6LW354K55qiq5Z2Q5qCHXHJcbiAqIEB5U3RhcnQgICAg5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAqIEB4RW5kICAgICAg5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAqIEB5RW5kICAgICAg5b+F6aG777yM57uI54K557q15Z2Q5qCHXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBCYXNlIGZyb20gXCIuLi9jb3JlL0Jhc2VcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBMaW5lID0gZnVuY3Rpb24ob3B0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLnR5cGUgPSBcImxpbmVcIjtcclxuICAgIHRoaXMuZHJhd1R5cGVPbmx5ID0gXCJzdHJva2VcIjtcclxuICAgIG9wdCA9IEJhc2UuY2hlY2tPcHQob3B0KTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgbGluZVR5cGU6IG9wdC5jb250ZXh0LmxpbmVUeXBlIHx8IG51bGwsIC8v5Y+v6YCJIOiZmue6vyDlrp7njrAg55qEIOexu+Wei1xyXG4gICAgICAgIHhTdGFydDogb3B0LmNvbnRleHQueFN0YXJ0IHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzotbfngrnmqKrlnZDmoIdcclxuICAgICAgICB5U3RhcnQ6IG9wdC5jb250ZXh0LnlTdGFydCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAgICAgICAgeEVuZDogb3B0LmNvbnRleHQueEVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAgICAgICAgeUVuZDogb3B0LmNvbnRleHQueUVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K557q15Z2Q5qCHXHJcbiAgICAgICAgZGFzaExlbmd0aDogb3B0LmNvbnRleHQuZGFzaExlbmd0aFxyXG4gICAgfVxyXG4gICAgTGluZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5CYXNlLmNyZWF0Q2xhc3MoTGluZSwgU2hhcGUsIHtcclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu657q/5p2h6Lev5b6EXHJcbiAgICAgKiBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIGlmICghc3R5bGUubGluZVR5cGUgfHwgc3R5bGUubGluZVR5cGUgPT0gJ3NvbGlkJykge1xyXG4gICAgICAgICAgICAvL+m7mOiupOS4uuWunue6v1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHBhcnNlSW50KHN0eWxlLnhTdGFydCksIHBhcnNlSW50KHN0eWxlLnlTdGFydCkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHBhcnNlSW50KHN0eWxlLnhFbmQpLCBwYXJzZUludChzdHlsZS55RW5kKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5saW5lVHlwZSA9PSAnZGFzaGVkJyB8fCBzdHlsZS5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhcclxuICAgICAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgICAgIHN0eWxlLnhTdGFydCwgc3R5bGUueVN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgc3R5bGUueEVuZCwgc3R5bGUueUVuZCxcclxuICAgICAgICAgICAgICAgIHN0eWxlLmRhc2hMZW5ndGhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue55+p5b2i5Yy65Z+f77yM55So5LqO5bGA6YOo5Yi35paw5ZKM5paH5a2X5a6a5L2NXHJcbiAgICAgKiBzdHlsZVxyXG4gICAgICovXHJcbiAgICBnZXRSZWN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIHZhciBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IE1hdGgubWluKHN0eWxlLnhTdGFydCwgc3R5bGUueEVuZCkgLSBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIHk6IE1hdGgubWluKHN0eWxlLnlTdGFydCwgc3R5bGUueUVuZCkgLSBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIHdpZHRoOiBNYXRoLmFicyhzdHlsZS54U3RhcnQgLSBzdHlsZS54RW5kKSArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhzdHlsZS55U3RhcnQgLSBzdHlsZS55RW5kKSArIGxpbmVXaWR0aFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IExpbmU7IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOefqeeOsCDnsbsgIO+8iOS4jeinhOWIme+8iVxyXG4gKlxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEB3aWR0aCDlrr3luqZcclxuICogQGhlaWdodCDpq5jluqZcclxuICogQHJhZGl1cyDlpoLmnpzmmK/lnIbop5LnmoTvvIzliJnkuLrjgJDkuIrlj7PkuIvlt6bjgJHpobrluo/nmoTlnIbop5LljYrlvoTmlbDnu4RcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFJlY3QgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJyZWN0XCI7XHJcblxyXG4gICAgb3B0ID0gQmFzZS5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgICB3aWR0aCAgICAgICAgIDogb3B0LmNvbnRleHQud2lkdGggfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5a695bqmXHJcbiAgICAgICAgIGhlaWdodCAgICAgICAgOiBvcHQuY29udGV4dC5oZWlnaHR8fCAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzpq5jluqZcclxuICAgICAgICAgcmFkaXVzICAgICAgICA6IG9wdC5jb250ZXh0LnJhZGl1c3x8IFtdICAgICAvL3thcnJheX0sICAgLy8g6buY6K6k5Li6WzBd77yM5ZyG6KeSIFxyXG4gICAgfVxyXG4gICAgUmVjdC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5CYXNlLmNyZWF0Q2xhc3MoIFJlY3QgLCBTaGFwZSAsIHtcclxuICAgIC8qKlxyXG4gICAgICog57uY5Yi25ZyG6KeS55+p5b2iXHJcbiAgICAgKiBAcGFyYW0ge0NvbnRleHQyRH0gY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfYnVpbGRSYWRpdXNQYXRoOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgLy/lt6bkuIrjgIHlj7PkuIrjgIHlj7PkuIvjgIHlt6bkuIvop5LnmoTljYrlvoTkvp3mrKHkuLpyMeOAgXIy44CBcjPjgIFyNFxyXG4gICAgICAgIC8vcue8qeWGmeS4ujEgICAgICAgICDnm7jlvZPkuo4gWzEsIDEsIDEsIDFdXHJcbiAgICAgICAgLy9y57yp5YaZ5Li6WzFdICAgICAgIOebuOW9k+S6jiBbMSwgMSwgMSwgMV1cclxuICAgICAgICAvL3LnvKnlhpnkuLpbMSwgMl0gICAg55u45b2T5LqOIFsxLCAyLCAxLCAyXVxyXG4gICAgICAgIC8vcue8qeWGmeS4ulsxLCAyLCAzXSDnm7jlvZPkuo4gWzEsIDIsIDMsIDJdXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmNvbnRleHQud2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuY29udGV4dC5oZWlnaHQ7XHJcbiAgICBcclxuICAgICAgICB2YXIgciA9IEJhc2UuZ2V0Q3NzT3JkZXJBcnIoc3R5bGUucmFkaXVzKTtcclxuICAgICBcclxuICAgICAgICBjdHgubW92ZVRvKCBwYXJzZUludCh4ICsgclswXSksIHBhcnNlSW50KHkpKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4ICsgd2lkdGggLSByWzFdKSwgcGFyc2VJbnQoeSkpO1xyXG4gICAgICAgIHJbMV0gIT09IDAgJiYgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICB4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIHJbMV1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCArIHdpZHRoKSwgcGFyc2VJbnQoeSArIGhlaWdodCAtIHJbMl0pKTtcclxuICAgICAgICByWzJdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByWzJdLCB5ICsgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHBhcnNlSW50KHggKyByWzNdKSwgcGFyc2VJbnQoeSArIGhlaWdodCkpO1xyXG4gICAgICAgIHJbM10gIT09IDAgJiYgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICB4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gclszXVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4KSwgcGFyc2VJbnQoeSArIHJbMF0pKTtcclxuICAgICAgICByWzBdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByWzBdLCB5KTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuefqeW9oui3r+W+hFxyXG4gICAgICogQHBhcmFtIHtDb250ZXh0MkR9IGN0eCBDYW52YXMgMkTkuIrkuIvmlodcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICBpZighc3R5bGUuJG1vZGVsLnJhZGl1cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYoISFzdHlsZS5maWxsU3R5bGUpe1xyXG4gICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoIDAgLCAwICx0aGlzLmNvbnRleHQud2lkdGgsdGhpcy5jb250ZXh0LmhlaWdodClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighIXN0eWxlLmxpbmVXaWR0aCl7XHJcbiAgICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KCAwICwgMCAsIHRoaXMuY29udGV4dC53aWR0aCx0aGlzLmNvbnRleHQuaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1aWxkUmFkaXVzUGF0aChjdHgsIHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuefqeW9ouWMuuWfn++8jOeUqOS6juWxgOmDqOWIt+aWsOWSjOaWh+Wtl+WumuS9jVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlXHJcbiAgICAgKi9cclxuICAgIGdldFJlY3QgOiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgICAgICB2YXIgbGluZVdpZHRoO1xyXG4gICAgICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZmlsbFN0eWxlIHx8IHN0eWxlLnN0cm9rZVN0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgeCA6IE1hdGgucm91bmQoMCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICB5IDogTWF0aC5yb3VuZCgwIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIDogdGhpcy5jb250ZXh0LndpZHRoICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICBoZWlnaHQgOiB0aGlzLmNvbnRleHQuaGVpZ2h0ICsgbGluZVdpZHRoXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxufSApO1xyXG5leHBvcnQgZGVmYXVsdCBSZWN0OyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmiYflvaIg57G7XHJcbiAqXHJcbiAqIOWdkOagh+WOn+eCueWGjeWchuW/g1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEByMCDpu5jorqTkuLow77yM5YaF5ZyG5Y2K5b6E5oyH5a6a5ZCO5bCG5Ye6546w5YaF5byn77yM5ZCM5pe25omH6L656ZW/5bqmID0gciAtIHIwXHJcbiAqIEByICDlv4XpobvvvIzlpJblnIbljYrlvoRcclxuICogQHN0YXJ0QW5nbGUg6LW35aeL6KeS5bqmKDAsIDM2MClcclxuICogQGVuZEFuZ2xlICAg57uT5p2f6KeS5bqmKDAsIDM2MClcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IEJhc2UgZnJvbSBcIi4uL2NvcmUvQmFzZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgbXlNYXRoIGZyb20gXCIuLi9nZW9tL01hdGhcIjtcclxuXHJcbnZhciBTZWN0b3IgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwic2VjdG9yXCI7XHJcbiAgICBzZWxmLnJlZ0FuZ2xlICA9IFtdO1xyXG4gICAgc2VsZi5pc1JpbmcgICAgPSBmYWxzZTsvL+aYr+WQpuS4uuS4gOS4quWchueOr1xyXG5cclxuICAgIG9wdCA9IEJhc2UuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgc2VsZi5fY29udGV4dCAgPSB7XHJcbiAgICAgICAgcG9pbnRMaXN0ICA6IFtdLC8v6L6555WM54K555qE6ZuG5ZCILOengeacie+8jOS7juS4i+mdoueahOWxnuaAp+iuoeeul+eahOadpVxyXG4gICAgICAgIHIwICAgICAgICAgOiBvcHQuY29udGV4dC5yMCAgICAgICAgIHx8IDAsLy8g6buY6K6k5Li6MO+8jOWGheWchuWNiuW+hOaMh+WumuWQjuWwhuWHuueOsOWGheW8p++8jOWQjOaXtuaJh+i+uemVv+W6piA9IHIgLSByMFxyXG4gICAgICAgIHIgICAgICAgICAgOiBvcHQuY29udGV4dC5yICAgICAgICAgIHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOWkluWchuWNiuW+hFxyXG4gICAgICAgIHN0YXJ0QW5nbGUgOiBvcHQuY29udGV4dC5zdGFydEFuZ2xlIHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOi1t+Wni+inkuW6plswLCAzNjApXHJcbiAgICAgICAgZW5kQW5nbGUgICA6IG9wdC5jb250ZXh0LmVuZEFuZ2xlICAgfHwgMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOe7k+adn+inkuW6pigwLCAzNjBdXHJcbiAgICAgICAgY2xvY2t3aXNlICA6IG9wdC5jb250ZXh0LmNsb2Nrd2lzZSAgfHwgZmFsc2UgLy/mmK/lkKbpobrml7bpkojvvIzpu5jorqTkuLpmYWxzZSjpobrml7bpkogpXHJcbiAgICB9XHJcbiAgICBTZWN0b3Iuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzICwgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbkJhc2UuY3JlYXRDbGFzcyhTZWN0b3IgLCBTaGFwZSAsIHtcclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIGNvbnRleHQpIHtcclxuICAgICAgICAvLyDlvaLlhoXljYrlvoRbMCxyKVxyXG4gICAgICAgIHZhciByMCA9IHR5cGVvZiBjb250ZXh0LnIwID09ICd1bmRlZmluZWQnID8gMCA6IGNvbnRleHQucjA7XHJcbiAgICAgICAgdmFyIHIgID0gY29udGV4dC5yOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmiYflvaLlpJbljYrlvoQoMCxyXVxyXG4gICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICB2YXIgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LmVuZEFuZ2xlKTsgICAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgLy92YXIgaXNSaW5nICAgICA9IGZhbHNlOyAgICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKbkuLrlnIbnjq9cclxuXHJcbiAgICAgICAgLy9pZiggc3RhcnRBbmdsZSAhPSBlbmRBbmdsZSAmJiBNYXRoLmFicyhzdGFydEFuZ2xlIC0gZW5kQW5nbGUpICUgMzYwID09IDAgKSB7XHJcbiAgICAgICAgaWYoIHN0YXJ0QW5nbGUgPT0gZW5kQW5nbGUgJiYgY29udGV4dC5zdGFydEFuZ2xlICE9IGNvbnRleHQuZW5kQW5nbGUgKSB7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5Lik5Liq6KeS5bqm55u4562J77yM6YKj5LmI5bCx6K6k5Li65piv5Liq5ZyG546v5LqGXHJcbiAgICAgICAgICAgIHRoaXMuaXNSaW5nICAgICA9IHRydWU7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgPSAwIDtcclxuICAgICAgICAgICAgZW5kQW5nbGUgICA9IDM2MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSk7XHJcbiAgICAgICAgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUb1JhZGlhbihlbmRBbmdsZSk7XHJcbiAgICAgXHJcbiAgICAgICAgLy/lpITnkIbkuIvmnoHlsI/lpLnop5LnmoTmg4XlhrVcclxuICAgICAgICBpZiggZW5kQW5nbGUgLSBzdGFydEFuZ2xlIDwgMC4wMjUgKXtcclxuICAgICAgICAgICAgc3RhcnRBbmdsZSAtPSAwLjAwM1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmFyYyggMCAsIDAgLCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgaWYgKHIwICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmlzUmluZyApe1xyXG4gICAgICAgICAgICAgICAgLy/liqDkuIrov5nkuKppc1JpbmfnmoTpgLvovpHmmK/kuLrkuoblhbzlrrlmbGFzaGNhbnZhc+S4i+e7mOWItuWchueOr+eahOeahOmXrumimFxyXG4gICAgICAgICAgICAgICAgLy/kuI3liqDov5nkuKrpgLvovpFmbGFzaGNhbnZhc+S8mue7mOWItuS4gOS4quWkp+WchiDvvIwg6ICM5LiN5piv5ZyG546vXHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCByMCAsIDAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmMoIDAgLCAwICwgcjAgLCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgLCAhdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKCAwICwgMCAsIHIwICwgZW5kQW5nbGUgLCBzdGFydEFuZ2xlICwgIXRoaXMuY29udGV4dC5jbG9ja3dpc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9UT0RPOuWcqHIw5Li6MOeahOaXtuWAme+8jOWmguaenOS4jeWKoGxpbmVUbygwLDAp5p2l5oqK6Lev5b6E6Zet5ZCI77yM5Lya5Ye6546w5pyJ5pCe56yR55qE5LiA5LiqYnVnXHJcbiAgICAgICAgICAgIC8v5pW05Liq5ZyG5Lya5Ye6546w5LiA5Liq5Lul5q+P5Liq5omH5b2i5Lik56uv5Li66IqC54K555qE6ZWC56m677yM5oiR5Y+v6IO95o+P6L+w5LiN5riF5qWa77yM5Y+N5q2j6L+Z5Liq5Yqg5LiK5bCx5aW95LqGXHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oMCwwKTtcclxuICAgICAgICB9XHJcbiAgICAgfSxcclxuICAgICBnZXRSZWdBbmdsZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgIHRoaXMucmVnSW4gICAgICA9IHRydWU7ICAvL+WmguaenOWcqHN0YXJ05ZKMZW5k55qE5pWw5YC85Lit77yMZW5k5aSn5LqOc3RhcnTogIzkuJTmmK/pobrml7bpkojliJlyZWdJbuS4unRydWVcclxuICAgICAgICAgdmFyIGMgICAgICAgICAgID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjLnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGMuZW5kQW5nbGUpOyAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgIGlmICggKCBzdGFydEFuZ2xlID4gZW5kQW5nbGUgJiYgIWMuY2xvY2t3aXNlICkgfHwgKCBzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgYy5jbG9ja3dpc2UgKSApIHtcclxuICAgICAgICAgICAgIHRoaXMucmVnSW4gID0gZmFsc2U7IC8vb3V0XHJcbiAgICAgICAgIH07XHJcbiAgICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXHJcbiAgICAgICAgIHRoaXMucmVnQW5nbGUgICA9IFsgXHJcbiAgICAgICAgICAgICBNYXRoLm1pbiggc3RhcnRBbmdsZSAsIGVuZEFuZ2xlICkgLCBcclxuICAgICAgICAgICAgIE1hdGgubWF4KCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgKSBcclxuICAgICAgICAgXTtcclxuICAgICB9LFxyXG4gICAgIGdldFJlY3QgOiBmdW5jdGlvbihjb250ZXh0KXtcclxuICAgICAgICAgdmFyIGNvbnRleHQgPSBjb250ZXh0ID8gY29udGV4dCA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgdmFyIHIwID0gdHlwZW9mIGNvbnRleHQucjAgPT0gJ3VuZGVmaW5lZCcgICAgIC8vIOW9ouWGheWNiuW+hFswLHIpXHJcbiAgICAgICAgICAgICA/IDAgOiBjb250ZXh0LnIwO1xyXG4gICAgICAgICB2YXIgciA9IGNvbnRleHQucjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5omH5b2i5aSW5Y2K5b6EKDAscl1cclxuICAgICAgICAgXHJcbiAgICAgICAgIHRoaXMuZ2V0UmVnQW5nbGUoKTtcclxuXHJcbiAgICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICAgdmFyIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5lbmRBbmdsZSk7ICAgICAgICAgICAgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxyXG5cclxuICAgICAgICAgLypcclxuICAgICAgICAgdmFyIGlzQ2lyY2xlID0gZmFsc2U7XHJcbiAgICAgICAgIGlmKCBNYXRoLmFicyggc3RhcnRBbmdsZSAtIGVuZEFuZ2xlICkgPT0gMzYwIFxyXG4gICAgICAgICAgICAgICAgIHx8ICggc3RhcnRBbmdsZSA9PSBlbmRBbmdsZSAmJiBzdGFydEFuZ2xlICogZW5kQW5nbGUgIT0gMCApICl7XHJcbiAgICAgICAgICAgICBpc0NpcmNsZSA9IHRydWU7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgIHZhciBwb2ludExpc3QgID0gW107XHJcblxyXG4gICAgICAgICB2YXIgcDREaXJlY3Rpb249IHtcclxuICAgICAgICAgICAgIFwiOTBcIiA6IFsgMCAsIHIgXSxcclxuICAgICAgICAgICAgIFwiMTgwXCI6IFsgLXIsIDAgXSxcclxuICAgICAgICAgICAgIFwiMjcwXCI6IFsgMCAsIC1yXSxcclxuICAgICAgICAgICAgIFwiMzYwXCI6IFsgciAsIDAgXSBcclxuICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgIGZvciAoIHZhciBkIGluIHA0RGlyZWN0aW9uICl7XHJcbiAgICAgICAgICAgICB2YXIgaW5BbmdsZVJlZyA9IHBhcnNlSW50KGQpID4gdGhpcy5yZWdBbmdsZVswXSAmJiBwYXJzZUludChkKSA8IHRoaXMucmVnQW5nbGVbMV07XHJcbiAgICAgICAgICAgICBpZiggdGhpcy5pc1JpbmcgfHwgKGluQW5nbGVSZWcgJiYgdGhpcy5yZWdJbikgfHwgKCFpbkFuZ2xlUmVnICYmICF0aGlzLnJlZ0luKSApe1xyXG4gICAgICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKCBwNERpcmVjdGlvblsgZCBdICk7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmKCAhdGhpcy5pc1JpbmcgKSB7XHJcbiAgICAgICAgICAgICBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBzdGFydEFuZ2xlICk7XHJcbiAgICAgICAgICAgICBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBlbmRBbmdsZSAgICk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogcjAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogcjBcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogciAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogclxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3MoZW5kQW5nbGUpICAgKiByICAsICBteU1hdGguc2luKGVuZEFuZ2xlKSAgKiByXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhlbmRBbmdsZSkgICAqIHIwICwgIG15TWF0aC5zaW4oZW5kQW5nbGUpICAqIHIwXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBjb250ZXh0LnBvaW50TGlzdCA9IHBvaW50TGlzdDtcclxuICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjdEZvcm1Qb2ludExpc3QoIGNvbnRleHQgKTtcclxuICAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlY3RvcjsiLCIvKipcbiAqIENhbnZheCB7e1BLR19WRVJTSU9OfX1cbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5Li75byV5pOOIOexu1xuICpcbiAqIOi0n+i0o+aJgOaciWNhbnZhc+eahOWxgue6p+euoeeQhu+8jOWSjOW/g+i3s+acuuWItueahOWunueOsCzmjZXojrfliLDlv4Pot7PljIXlkI4gXG4gKiDliIblj5HliLDlr7nlupTnmoRzdGFnZShjYW52YXMp5p2l57uY5Yi25a+55bqU55qE5pS55YqoXG4gKiDnhLblkI4g6buY6K6k5pyJ5a6e546w5LqGc2hhcGXnmoQgbW91c2VvdmVyICBtb3VzZW91dCAgZHJhZyDkuovku7ZcbiAqXG4gKiovXG5pbXBvcnQgQmFzZSBmcm9tIFwiLi9jb3JlL0Jhc2VcIjtcbmltcG9ydCBBbmltYXRpb25GcmFtZSBmcm9tIFwiLi9hbmltYXRpb24vQW5pbWF0aW9uRnJhbWVcIjtcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi9ldmVudC9FdmVudE1hbmFnZXJcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL2Rpc3BsYXkvRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vZGlzcGxheS9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCI7XG5pbXBvcnQgU3RhZ2UgZnJvbSBcIi4vZGlzcGxheS9TdGFnZVwiO1xuaW1wb3J0IFNwcml0ZSBmcm9tIFwiLi9kaXNwbGF5L1Nwcml0ZVwiO1xuaW1wb3J0IFNoYXBlIGZyb20gXCIuL2Rpc3BsYXkvU2hhcGVcIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9kaXNwbGF5L1BvaW50XCI7XG5pbXBvcnQgVGV4dCBmcm9tIFwiLi9kaXNwbGF5L1RleHRcIjtcbmltcG9ydCBCaXRtYXAgZnJvbSBcIi4vZGlzcGxheS9CaXRtYXBcIjtcbmltcG9ydCBNb3ZpZWNsaXAgZnJvbSBcIi4vZGlzcGxheS9Nb3ZpZWNsaXBcIjtcblxuLy9zaGFwZXNcbmltcG9ydCBCcm9rZW5MaW5lIGZyb20gXCIuL3NoYXBlL0Jyb2tlbkxpbmVcIjtcbmltcG9ydCBDaXJjbGUgZnJvbSBcIi4vc2hhcGUvQ2lyY2xlXCI7XG5pbXBvcnQgRHJvcGxldCBmcm9tIFwiLi9zaGFwZS9Ecm9wbGV0XCI7XG5pbXBvcnQgRWxsaXBzZSBmcm9tIFwiLi9zaGFwZS9FbGxpcHNlXCI7XG5pbXBvcnQgSXNvZ29uIGZyb20gXCIuL3NoYXBlL0lzb2dvblwiO1xuaW1wb3J0IExpbmUgZnJvbSBcIi4vc2hhcGUvTGluZVwiO1xuaW1wb3J0IFBhdGggZnJvbSBcIi4vc2hhcGUvUGF0aFwiO1xuaW1wb3J0IFBvbHlnb24gZnJvbSBcIi4vc2hhcGUvUG9seWdvblwiO1xuaW1wb3J0IFJlY3QgZnJvbSBcIi4vc2hhcGUvUmVjdFwiO1xuaW1wb3J0IFNlY3RvciBmcm9tIFwiLi9zaGFwZS9TZWN0b3JcIjtcblxuLy91dGlsc1xuaW1wb3J0IF8gZnJvbSBcIi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0ICQgZnJvbSBcIi4vdXRpbHMvZG9tXCI7XG5cblxudmFyIENhbnZheCA9IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICB0aGlzLnR5cGUgPSBcImNhbnZheFwiO1xuICAgIHRoaXMuX2NpZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTAwKTsgXG4gICAgXG4gICAgdGhpcy5fcm9vdERvbSAgID0gJC5xdWVyeShvcHQuZWwpO1xuICAgIGlmKCAhdGhpcy5fcm9vdERvbSApe1xuICAgICAgICAvL+WmguaenOWuv+S4u+WvueixoeS4jeWtmOWcqCzpgqPkuYjvvIzmiJHkuZ/mh5LnmoTnlLvkuoZcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLndpZHRoICAgICAgPSBwYXJzZUludChcIndpZHRoXCIgIGluIG9wdCB8fCB0aGlzLl9yb290RG9tLm9mZnNldFdpZHRoICAsIDEwKTsgXG4gICAgdGhpcy5oZWlnaHQgICAgID0gcGFyc2VJbnQoXCJoZWlnaHRcIiBpbiBvcHQgfHwgdGhpcy5fcm9vdERvbS5vZmZzZXRIZWlnaHQgLCAxMCk7IFxuXG4gICAgLy/mmK/lkKbpmLvmraLmtY/op4jlmajpu5jorqTkuovku7bnmoTmiafooYxcbiAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICBpZiggb3B0LnByZXZlbnREZWZhdWx0ID09PSBmYWxzZSApe1xuICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gZmFsc2VcbiAgICB9O1xuXG4gICAgLy/lpoLmnpzov5nkuKrml7blgJllbOmHjOmdouW3sue7j+acieS4nOilv+S6huOAguWXr++8jOS5n+iuuOabvue7j+i/meS4qmVs6KKrY2FudmF45bmy6L+H5LiA5qyh5LqG44CCXG4gICAgLy/pgqPkuYjopoHlhYjmuIXpmaTov5nkuKplbOeahOaJgOacieWGheWuueOAglxuICAgIC8v6buY6K6k55qEZWzmmK/kuIDkuKroh6rlt7HliJvlu7rnmoRkaXbvvIzlm6DkuLropoHlnKjov5nkuKpkaXbkuIrpnaLms6jlhoxu5aSa5Liq5LqL5Lu2IOadpSDlnKjmlbTkuKpjYW52YXjns7vnu5/ph4zpnaLov5vooYzkuovku7bliIblj5HjgIJcbiAgICAvL+aJgOS7peS4jeiDveebtOaOpeeUqOmFjee9ruS8oOi/m+adpeeahGVs5a+56LGh44CC5Zug5Li65Y+v6IO95Lya6YeN5aSN5re75Yqg5b6I5aSa55qE5LqL5Lu25Zyo5LiK6Z2i44CC5a+86Ie05b6I5aSa5YaF5a655peg5rOV6YeK5pS+44CCXG4gICAgdmFyIGh0bWxTdHIgPSBcIjxkaXYgaWQ9J2NjLVwiK3RoaXMuX2NpZCtcIicgY2xhc3M9J2NhbnZheC1jJyBcIjtcbiAgICAgICAgaHRtbFN0cis9IFwic3R5bGU9J3Bvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOlwiICsgdGhpcy53aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgdGhpcy5oZWlnaHQgK1wicHg7Jz5cIjtcbiAgICAgICAgaHRtbFN0cis9IFwiICAgPGRpdiBpZD0nY2RjLVwiK3RoaXMuX2NpZCtcIicgY2xhc3M9J2NhbnZheC1kb20tY29udGFpbmVyJyBcIjtcbiAgICAgICAgaHRtbFN0cis9IFwiICAgc3R5bGU9J3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOlwiICsgdGhpcy53aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgdGhpcy5oZWlnaHQgK1wicHg7Jz5cIjtcbiAgICAgICAgaHRtbFN0cis9IFwiICAgPC9kaXY+XCI7XG4gICAgICAgIGh0bWxTdHIrPSBcIjwvZGl2PlwiO1xuXG4gICAgLy92YXIgZG9jZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAvL2RvY2ZyYWcuaW5uZXJIVE1MID0gaHRtbFN0clxuXG4gICAgdGhpcy5fcm9vdERvbS5pbm5lckhUTUwgPSBodG1sU3RyO1xuXG4gICAgdGhpcy5lbCA9ICQucXVlcnkoXCJjYy1cIit0aGlzLl9jaWQpO1xuICAgIFxuICAgIHRoaXMucm9vdE9mZnNldCAgICAgID0gJC5vZmZzZXQodGhpcy5lbCk7IC8vdGhpcy5lbC5vZmZzZXQoKTtcbiAgICB0aGlzLmxhc3RHZXRSTyAgICAgICA9IDA7Ly/mnIDlkI7kuIDmrKHojrflj5Zyb290T2Zmc2V055qE5pe26Ze0XG5cbiAgICAvL+avj+W4pyDnlLEg5b+D6LezIOS4iuaKpeeahCDpnIDopoHph43nu5jnmoRzdGFnZXMg5YiX6KGoXG4gICAgdGhpcy5jb252ZXJ0U3RhZ2VzID0ge307XG5cbiAgICB0aGlzLl9oZWFydEJlYXQgPSBmYWxzZTsvL+W/g+i3s++8jOm7mOiupOS4umZhbHNl77yM5Y2zZmFsc2XnmoTml7blgJnlvJXmk47lpITkuo7pnZnpu5jnirbmgIEgdHJ1ZeWImeWQr+WKqOa4suafk1xuICAgIFxuICAgIC8v6K6+572u5bin546HXG4gICAgdGhpcy5fcHJlUmVuZGVyVGltZSA9IDA7XG5cbiAgICAvL+S7u+WKoeWIl+ihqCwg5aaC5p6cX3Rhc2tMaXN0IOS4jeS4uuepuu+8jOmCo+S5iOS4u+W8leaTjuWwseS4gOebtOi3kVxuICAgIC8v5Li6IOWQq+aciV9fZW50ZXJGcmFtZSDmlrnms5UgRGlzcGxheU9iamVjdCDnmoTlr7nosaHliJfooahcbiAgICAvL+avlOWmgk1vdmllY2xpcOeahF9fZW50ZXJGcmFtZeaWueazleOAglxuICAgIHRoaXMuX3Rhc2tMaXN0ID0gW107XG4gICAgXG4gICAgdGhpcy5fYnVmZmVyU3RhZ2UgPSBudWxsO1xuICAgIFxuICAgIHRoaXMuX2lzUmVhZHkgICAgPSBmYWxzZTtcblxuICAgIHRoaXMuZXZlbnQgPSBudWxsO1xuXG4gICAgQ2FudmF4LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbkJhc2UuY3JlYXRDbGFzcyhDYW52YXggLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IHRoaXMuaGVpZ2h0OyBcblxuICAgICAgICAvL+eEtuWQjuWIm+W7uuS4gOS4queUqOS6jue7mOWItua/gOa0u3NoYXBl55qEIHN0YWdl5YiwYWN0aXZhdGlvblxuICAgICAgICB0aGlzLl9jcmVhdEhvdmVyU3RhZ2UoKTtcblxuICAgICAgICAvL+WIm+W7uuS4gOS4quWmguaenOimgeeUqOWDj+e0oOajgOa1i+eahOaXtuWAmeeahOWuueWZqFxuICAgICAgICB0aGlzLl9jcmVhdGVQaXhlbENvbnRleHQoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2lzUmVhZHkgPSB0cnVlO1xuICAgIH0sXG4gICAgcmVnaXN0RXZlbnQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICAvL+WIneWni+WMluS6i+S7tuWnlOaJmOWIsHJvb3TlhYPntKDkuIrpnaJcbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBFdmVudEhhbmRsZXIoIHRoaXMgLCBvcHQpOztcbiAgICAgICAgdGhpcy5ldmVudC5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50O1xuICAgIH0sXG4gICAgcmVzaXplIDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAvL+mHjeaWsOiuvue9ruWdkOagh+ezu+e7nyDpq5jlrr0g562J44CCXG4gICAgICAgIHRoaXMud2lkdGggICAgICA9IHBhcnNlSW50KChvcHQgJiYgXCJ3aWR0aFwiIGluIG9wdCkgfHwgdGhpcy5fcm9vdERvbS5vZmZzZXRXaWR0aCAgLCAxMCk7IFxuICAgICAgICB0aGlzLmhlaWdodCAgICAgPSBwYXJzZUludCgob3B0ICYmIFwiaGVpZ2h0XCIgaW4gb3B0KSB8fCB0aGlzLl9yb290RG9tLm9mZnNldEhlaWdodCAsIDEwKTsgXG5cbiAgICAgICAgdGhpcy5lbC5zdHlsZS53aWR0aCAgPSB0aGlzLndpZHRoICtcInB4XCI7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQrXCJweFwiO1xuXG4gICAgICAgIHRoaXMucm9vdE9mZnNldCAgICAgPSAkLm9mZnNldCh0aGlzLmVsKTtcbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggICAgICA9IHRydWU7XG4gICAgICAgIHRoaXMuY29udGV4dC53aWR0aCAgPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIHRoaXMuX25vdFdhdGNoICAgICAgPSBmYWxzZTtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcmVTaXplQ2FudmFzICAgID0gZnVuY3Rpb24oY3R4KXtcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBjdHguY2FudmFzO1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gbWUud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0PSBtZS5oZWlnaHQrIFwicHhcIjtcbiAgICAgICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiICAsIG1lLndpZHRoICogQmFzZS5fZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIgLCBtZS5oZWlnaHQqIEJhc2UuX2RldmljZVBpeGVsUmF0aW8pO1xuXG4gICAgICAgICAgICAvL+WmguaenOaYr3N3ZueahOivneWwsei/mOimgeiwg+eUqOi/meS4quaWueazleOAglxuICAgICAgICAgICAgaWYgKGN0eC5yZXNpemUpIHtcbiAgICAgICAgICAgICAgICBjdHgucmVzaXplKG1lLndpZHRoICwgbWUuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTsgXG4gICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuICwgZnVuY3Rpb24ocyAsIGkpe1xuICAgICAgICAgICAgcy5fbm90V2F0Y2ggICAgID0gdHJ1ZTtcbiAgICAgICAgICAgIHMuY29udGV4dC53aWR0aCA9IG1lLndpZHRoO1xuICAgICAgICAgICAgcy5jb250ZXh0LmhlaWdodD0gbWUuaGVpZ2h0O1xuICAgICAgICAgICAgcmVTaXplQ2FudmFzKHMuY29udGV4dDJEKTtcbiAgICAgICAgICAgIHMuX25vdFdhdGNoICAgICA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgY2FudmF4RE9NYyA9ICQucXVlcnkoXCJjZGMtXCIrdGhpcy5fY2lkKTtcbiAgICAgICAgY2FudmF4RE9NYy5zdHlsZS53aWR0aCAgPSB0aGlzLndpZHRoICArIFwicHhcIjtcbiAgICAgICAgY2FudmF4RE9NYy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcblxuICAgICAgICB0aGlzLmhlYXJ0QmVhdCgpO1xuXG4gICAgfSxcbiAgICBnZXREb21Db250YWluZXIgIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICQucXVlcnkoXCJjZGMtXCIrdGhpcy5fY2lkKTtcbiAgICB9LFxuICAgIGdldEhvdmVyU3RhZ2UgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyU3RhZ2U7XG4gICAgfSxcbiAgICBfY3JlYXRIb3ZlclN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9UT0RPOuWIm+W7unN0YWdl55qE5pe25YCZ5LiA5a6a6KaB5Lyg5YWld2lkdGggaGVpZ2h0ICDkuKTkuKrlj4LmlbBcbiAgICAgICAgdGhpcy5fYnVmZmVyU3RhZ2UgPSBuZXcgU3RhZ2UoIHtcbiAgICAgICAgICAgIGlkIDogXCJhY3RpdkNhbnZhc1wiKyhuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICBjb250ZXh0IDoge1xuICAgICAgICAgICAgICAgIHdpZHRoIDogdGhpcy5jb250ZXh0LndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb250ZXh0LmhlaWdodFxuICAgICAgICAgICAgfVxuICAgICAgICB9ICk7XG4gICAgICAgIC8v6K+lc3RhZ2XkuI3lj4LkuI7kuovku7bmo4DmtYtcbiAgICAgICAgdGhpcy5fYnVmZmVyU3RhZ2UuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFkZENoaWxkKCB0aGlzLl9idWZmZXJTdGFnZSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog55So5p2l5qOA5rWL5paH5pysd2lkdGggaGVpZ2h0IFxuICAgICAqIEByZXR1cm4ge09iamVjdH0g5LiK5LiL5paHXG4gICAgKi9cbiAgICBfY3JlYXRlUGl4ZWxDb250ZXh0IDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfcGl4ZWxDYW52YXMgPSAkLnF1ZXJ5KFwiX3BpeGVsQ2FudmFzXCIpO1xuICAgICAgICBpZighX3BpeGVsQ2FudmFzKXtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcyA9IEJhc2UuX2NyZWF0ZUNhbnZhcyhcIl9waXhlbENhbnZhc1wiICwgMCAsIDApOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5Y+I55qE6K+dIOWwseS4jemcgOimgeWcqOWIm+W7uuS6hlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBfcGl4ZWxDYW52YXMgKTtcbiAgICAgICAgQmFzZS5pbml0RWxlbWVudCggX3BpeGVsQ2FudmFzICk7XG4gICAgICAgIGlmKCBCYXNlLmNhbnZhc1N1cHBvcnQoKSApe1xuICAgICAgICAgICAgLy9jYW52YXPnmoTor53vvIzlk6rmgJXmmK9kaXNwbGF5Om5vbmXnmoTpobXlj6/ku6XnlKjmnaXlt6blg4/ntKDmo4DmtYvlkoxtZWFzdXJlVGV4dOaWh+acrHdpZHRo5qOA5rWLXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuZGlzcGxheSAgICA9IFwibm9uZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9mbGFzaENhbnZhcyDnmoTor53vvIxzd2blpoLmnpxkaXNwbGF5Om5vbmXkuobjgILlsLHlgZrkuI3kuoZtZWFzdXJlVGV4dCDmlofmnKzlrr3luqYg5qOA5rWL5LqGXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuekluZGV4ICAgICA9IC0xO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnBvc2l0aW9uICAgPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUubGVmdCAgICAgICA9IC0gdGhpcy5jb250ZXh0LndpZHRoICArIFwicHhcIjtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS50b3AgICAgICAgID0gLSB0aGlzLmNvbnRleHQuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG4gICAgICAgIEJhc2UuX3BpeGVsQ3R4ID0gX3BpeGVsQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgfSxcbiAgICB1cGRhdGVSb290T2Zmc2V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiggbm93IC0gdGhpcy5sYXN0R2V0Uk8gPiAxMDAwICl7XG4gICAgICAgICAgICAvL2FsZXJ0KCB0aGlzLmxhc3RHZXRSTyApXG4gICAgICAgICAgICB0aGlzLnJvb3RPZmZzZXQgICAgICA9ICQub2Zmc2V0KHRoaXMuZWwpO1xuICAgICAgICAgICAgdGhpcy5sYXN0R2V0Uk8gICAgICAgPSBub3c7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5aaC5p6c5byV5pOO5aSE5LqO6Z2Z6buY54q25oCB55qE6K+d77yM5bCx5Lya5ZCv5YqoXG4gICAgX19zdGFydEVudGVyIDogZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYoICFzZWxmLnJlcXVlc3RBaWQgKXtcbiAgICAgICAgICAgc2VsZi5yZXF1ZXN0QWlkID0gQW5pbWF0aW9uRnJhbWUucmVnaXN0RnJhbWUoIHtcbiAgICAgICAgICAgICAgIGlkIDogXCJlbnRlckZyYW1lXCIsIC8v5ZCM5pe26IKv5a6a5Y+q5pyJ5LiA5LiqZW50ZXJGcmFtZeeahHRhc2tcbiAgICAgICAgICAgICAgIHRhc2sgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9fZW50ZXJGcmFtZS5hcHBseShzZWxmKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfSApO1xuICAgICAgIH1cbiAgICB9LFxuICAgIF9fZW50ZXJGcmFtZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy/kuI3nrqHmgI7kuYjmoLfvvIxfX2VudGVyRnJhbWXmiafooYzkuoblsLHopoHmiopcbiAgICAgICAgLy9yZXF1ZXN0QWlkIG51bGwg5o6JXG4gICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IG51bGw7XG4gICAgICAgIEJhc2Uubm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGlmKCBzZWxmLl9oZWFydEJlYXQgKXtcbiAgICAgICAgICAgIF8uZWFjaChfLnZhbHVlcyggc2VsZi5jb252ZXJ0U3RhZ2VzICkgLCBmdW5jdGlvbihjb252ZXJ0U3RhZ2Upe1xuICAgICAgICAgICAgICAgY29udmVydFN0YWdlLnN0YWdlLl9yZW5kZXIoIGNvbnZlcnRTdGFnZS5zdGFnZS5jb250ZXh0MkQgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2VsZi5faGVhcnRCZWF0ID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmNvbnZlcnRTdGFnZXMgPSB7fTtcbiAgICAgICAgICAgIC8v5riy5p+T5a6M5LqG77yM5omT5LiK5pyA5paw5pe26Ze05oyrXG4gICAgICAgICAgICBzZWxmLl9wcmVSZW5kZXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8v5YWI6LeR5Lu75Yqh6Zif5YiXLOWboOS4uuacieWPr+iDveWGjeWFt+S9k+eahGhhbmRlcuS4reS8muaKiuiHquW3sea4hemZpOaOiVxuICAgICAgICAvL+aJgOS7pei3keS7u+WKoeWSjOS4i+mdoueahGxlbmd0aOajgOa1i+WIhuW8gOadpVxuICAgICAgICBpZihzZWxmLl90YXNrTGlzdC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgZm9yKHZhciBpPTAsbCA9IHNlbGYuX3Rhc2tMaXN0Lmxlbmd0aCA7IGkgPCBsIDsgaSsrICl7XG4gICAgICAgICAgICAgIHZhciBvYmogPSBzZWxmLl90YXNrTGlzdFtpXTtcbiAgICAgICAgICAgICAgaWYob2JqLl9fZW50ZXJGcmFtZSl7XG4gICAgICAgICAgICAgICAgIG9iai5fX2VudGVyRnJhbWUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgc2VsZi5fX3Rhc2tMaXN0LnNwbGljZShpLS0gLCAxKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICB9ICBcbiAgICAgICAgfTtcbiAgICAgICAgLy/lpoLmnpzkvp3nhLbov5jmnInku7vliqHjgIIg5bCx57un57utZW50ZXJGcmFtZS5cbiAgICAgICAgaWYoc2VsZi5fdGFza0xpc3QubGVuZ3RoID4gMCl7XG4gICAgICAgICAgIHNlbGYuX19zdGFydEVudGVyKCk7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICBfYWZ0ZXJBZGRDaGlsZCA6IGZ1bmN0aW9uKCBzdGFnZSAsIGluZGV4ICl7XG4gICAgICAgIHZhciBjYW52YXM7XG5cbiAgICAgICAgaWYoIXN0YWdlLmNvbnRleHQyRCl7XG4gICAgICAgICAgICBjYW52YXMgPSBCYXNlLl9jcmVhdGVDYW52YXMoIHN0YWdlLmlkICwgdGhpcy5jb250ZXh0LndpZHRoICwgdGhpcy5jb250ZXh0LmhlaWdodCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzID0gc3RhZ2UuY29udGV4dDJELmNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYW52YXhET01jID0gJC5xdWVyeShcImNkYy1cIit0aGlzLl9jaWQpO1xuXG4gICAgICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgLy90aGlzLmVsLmFwcGVuZCggY2FudmFzICk7XG4gICAgICAgICAgICB0aGlzLmVsLmluc2VydEJlZm9yZSggY2FudmFzICwgY2FudmF4RE9NYyApO1xuICAgICAgICB9IGVsc2UgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGg+MSkge1xuICAgICAgICAgICAgaWYoIGluZGV4ID09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAvL+WmguaenOayoeacieaMh+WumuS9jee9ru+8jOmCo+S5iOWwseaUvuWIsF9idWZmZXJTdGFnZeeahOS4i+mdouOAglxuICAgICAgICAgICAgICAgIHRoaXMuZWwuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLl9idWZmZXJTdGFnZS5jb250ZXh0MkQuY2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmnInmjIflrprnmoTkvY3nva7vvIzpgqPkuYjlsLHmjIflrprnmoTkvY3nva7mnaVcbiAgICAgICAgICAgICAgICBpZiggaW5kZXggPj0gdGhpcy5jaGlsZHJlbi5sZW5ndGgtMSApe1xuICAgICAgICAgICAgICAgICAgIC8vdGhpcy5lbC5hcHBlbmQoIGNhbnZhcyApO1xuICAgICAgICAgICAgICAgICAgIHRoaXMuZWwuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCBjYW52YXhET01jICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICB0aGlzLmVsLmluc2VydEJlZm9yZSggY2FudmFzICwgdGhpcy5jaGlsZHJlblsgaW5kZXggXS5jb250ZXh0MkQuY2FudmFzICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIEJhc2UuaW5pdEVsZW1lbnQoIGNhbnZhcyApO1xuICAgICAgICBzdGFnZS5pbml0U3RhZ2UoIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikgLCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0ICk7IFxuICAgIH0sXG4gICAgX2FmdGVyRGVsQ2hpbGQgOiBmdW5jdGlvbihzdGFnZSl7XG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQ2hpbGQoIHN0YWdlLmNvbnRleHQyRC5jYW52YXMgKTtcbiAgICB9LFxuICAgIF9jb252ZXJ0Q2FudmF4IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgXy5lYWNoKCB0aGlzLmNoaWxkcmVuICwgZnVuY3Rpb24oc3RhZ2Upe1xuICAgICAgICAgICAgc3RhZ2UuY29udGV4dFtvcHQubmFtZV0gPSBvcHQudmFsdWU7IFxuICAgICAgICB9ICk7ICBcbiAgICB9LFxuICAgIGhlYXJ0QmVhdCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgLy9kaXNwbGF5TGlzdOS4reafkOS4quWxnuaAp+aUueWPmOS6hlxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmKCBvcHQgKXtcbiAgICAgICAgICAgIC8v5b+D6Lez5YyF5pyJ5Lik56eN77yM5LiA56eN5piv5p+Q5YWD57Sg55qE5Y+v6KeG5bGe5oCn5pS55Y+Y5LqG44CC5LiA56eN5pivY2hpbGRyZW7mnInlj5jliqhcbiAgICAgICAgICAgIC8v5YiG5Yir5a+55bqUY29udmVydFR5cGUgIOS4uiBjb250ZXh0ICBhbmQgY2hpbGRyZW5cbiAgICAgICAgICAgIGlmIChvcHQuY29udmVydFR5cGUgPT0gXCJjb250ZXh0XCIpe1xuICAgICAgICAgICAgICAgIHZhciBzdGFnZSAgID0gb3B0LnN0YWdlO1xuICAgICAgICAgICAgICAgIHZhciBzaGFwZSAgID0gb3B0LnNoYXBlO1xuICAgICAgICAgICAgICAgIHZhciBuYW1lICAgID0gb3B0Lm5hbWU7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlICAgPSBvcHQudmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIHByZVZhbHVlPSBvcHQucHJlVmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuX2lzUmVhZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/lnKjov5jmsqHliJ3lp4vljJblrozmr5XnmoTmg4XlhrXkuIvvvIzml6DpnIDlgZrku7vkvZXlpITnkIZcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiggc2hhcGUudHlwZSA9PSBcImNhbnZheFwiICl7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2NvbnZlcnRDYW52YXgob3B0KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFzZWxmLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlIDogc3RhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmKHNoYXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5jb252ZXJ0U3RhZ2VzWyBzdGFnZS5pZCBdLmNvbnZlcnRTaGFwZXNbIHNoYXBlLmlkIF0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXS5jb252ZXJ0U2hhcGVzWyBzaGFwZS5pZCBdPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUgOiBzaGFwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydFR5cGUgOiBvcHQuY29udmVydFR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5bey57uP5LiK5oql5LqG6K+lc2hhcGXnmoTlv4Pot7PjgIJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKG9wdC5jb252ZXJ0VHlwZSA9PSBcImNoaWxkcmVuXCIpe1xuICAgICAgICAgICAgICAgIC8v5YWD57Sg57uT5p6E5Y+Y5YyW77yM5q+U5aaCYWRkY2hpbGQgcmVtb3ZlQ2hpbGTnrYlcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gb3B0LnRhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgPSBvcHQuc3JjLmdldFN0YWdlKCk7XG4gICAgICAgICAgICAgICAgaWYoIHN0YWdlIHx8ICh0YXJnZXQudHlwZT09XCJzdGFnZVwiKSApe1xuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaTjeS9nOeahOebruagh+WFg+e0oOaYr1N0YWdlXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlID0gc3RhZ2UgfHwgdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICBpZighc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIW9wdC5jb252ZXJ0VHlwZSl7XG4gICAgICAgICAgICAgICAgLy/ml6DmnaHku7bopoHmsYLliLfmlrBcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgPSBvcHQuc3RhZ2U7XG4gICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlICxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/ml6DmnaHku7bopoHmsYLlhajpg6jliLfmlrDvvIzkuIDoiKznlKjlnKhyZXNpemXnrYnjgIJcbiAgICAgICAgICAgIF8uZWFjaCggc2VsZi5jaGlsZHJlbiAsIGZ1bmN0aW9uKCBzdGFnZSAsIGkgKXtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnZlcnRTdGFnZXNbIHN0YWdlLmlkIF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWdlIDogc3RhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBpZiAoIXNlbGYuX2hlYXJ0QmVhdCl7XG4gICAgICAgICAgIC8v5aaC5p6c5Y+R546w5byV5pOO5Zyo6Z2Z6buY54q25oCB77yM6YKj5LmI5bCx5ZSk6YaS5byV5pOOXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgICAgIHNlbGYuX19zdGFydEVudGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIC8v5ZCm5YiZ5pm65oWn57un57ut56Gu6K6k5b+D6LezXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59ICk7XG5cblxuQ2FudmF4LkRpc3BsYXkgPSB7XG4gICAgRGlzcGxheU9iamVjdCA6IERpc3BsYXlPYmplY3QsXG4gICAgRGlzcGxheU9iamVjdENvbnRhaW5lciA6IERpc3BsYXlPYmplY3RDb250YWluZXIsXG4gICAgU3RhZ2UgIDogU3RhZ2UsXG4gICAgU3ByaXRlIDogU3ByaXRlLFxuICAgIFNoYXBlICA6IFNoYXBlLFxuICAgIFBvaW50ICA6IFBvaW50LFxuICAgIFRleHQgICA6IFRleHQsXG4gICAgTW92aWVjbGlwIDogTW92aWVjbGlwLFxuICAgIEJpdG1hcCA6IEJpdG1hcFxufVxuXG5DYW52YXguU2hhcGVzID0ge1xuICAgIEJyb2tlbkxpbmUgOiBCcm9rZW5MaW5lLFxuICAgIENpcmNsZSA6IENpcmNsZSxcbiAgICBEcm9wbGV0IDogRHJvcGxldCxcbiAgICBFbGxpcHNlIDogRWxsaXBzZSxcbiAgICBJc29nb24gOiBJc29nb24sXG4gICAgTGluZSA6IExpbmUsXG4gICAgUGF0aCA6IFBhdGgsXG4gICAgUG9seWdvbiA6IFBvbHlnb24sXG4gICAgUmVjdCA6IFJlY3QsXG4gICAgU2VjdG9yIDogU2VjdG9yXG59XG5cbkNhbnZheC5FdmVudCA9IHtcbiAgICBFdmVudERpc3BhdGNoZXIgOiBFdmVudERpc3BhdGNoZXIsXG4gICAgRXZlbnRNYW5hZ2VyICAgIDogRXZlbnRNYW5hZ2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbnZheDsiXSwibmFtZXMiOlsiVHdlZW4iXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ1YsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTO0lBQUUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQWlDO0FBQzlGLElBQ0EsUUFBUSxXQUFXLFFBQVEsQ0FBQyxRQUFRO0lBQ3BDLGNBQWMsS0FBSyxRQUFRLENBQUMsY0FBYyxDQUFDOztBQUUzQyxJQUNBLGFBQWEsUUFBUSxVQUFVLENBQUMsT0FBTztJQUN2QyxZQUFZLFNBQVMsVUFBVSxDQUFDLE1BQU07SUFDdEMsYUFBYSxRQUFRLFVBQVUsQ0FBQyxPQUFPO0lBQ3ZDLGFBQWEsUUFBUSxLQUFLLENBQUMsT0FBTztJQUNsQyxVQUFVLFdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQzs7QUFFakMs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RUFFOUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztHQUVsQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDVixDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDOztHQUVELE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztHQUUzRSxNQUFNOztHQUVOLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNWLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RDs7R0FFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMs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LElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNoQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQ25DLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztTQUN0QyxNQUFNO1lBQ0gsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBRW5DLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNoQztRQUNELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxLQUFLLEdBQUcsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELFNBQVMsR0FBRyxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxRQUFRLEdBQUcsVUFBVTs7UUFFakIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QyxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsTUFBTSxHQUFHLFVBQVU7O1FBRWYsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUV0QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELEtBQUssR0FBRyxVQUFVO1FBQ2QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZFO0lBQ0QsT0FBTyxHQUFHLFVBQVU7UUFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7S0FDcEU7Ozs7SUFJRCxTQUFTLEdBQUcsU0FBUyxDQUFDLEVBQUU7UUFDcEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFD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Q1YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3RCLENBQUMsR0FBRyxHQUFHLENBQUM7d0JBQ1IsTUFBTTtvQkFDVixLQUFLLEdBQUc7d0JBQ0osR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxHQUFHLEdBQUcsQ0FBQzt3QkFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsQ0FBQyxHQUFHLEdBQUcsQ0FBQzt3QkFDUixNQUFNOztvQkFFVixLQUFLLEdBQUc7d0JBQ0osR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDakIsR0FBRyxHQUFHLEdBQUcsQ0FBQzt3QkFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsTUFBTTtvQkFDVixLQUFLLEdBQUc7d0JBQ0osR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxHQUFHLEdBQUcsQ0FBQzt3QkFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsTUFBTTtvQkFDVixLQUFLLEdBQUc7d0JBQ0osR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDakIsR0FBRyxHQUFHLEdBQUcsQ0FBQzt3QkFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsTUFBTTtvQkFDVixLQUFLLEdBQUc7d0JBQ0osR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxHQUFHLEdBQUcsQ0FBQzt3QkFDVixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsTUFBTTtvQkFDVixLQUFL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LEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7O1FBRTNELElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNaLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCOztRQUVELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUVuSixJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDWCxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDWDtRQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNUOztRQUVELElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7UUFFNUIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FB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ZCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNyQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7O1FBRXJDLElBQUksVUFBVSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDOUIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RCLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7O1FBRTdCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7O1FBRWxFLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFN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
