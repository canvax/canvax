define(function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _$1 = {};
var breaker = {};
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;

var nativeForEach = ArrayProto.forEach;
var nativeFilter = ArrayProto.filter;
var nativeIndexOf = ArrayProto.indexOf;
var nativeIsArray = Array.isArray;
var nativeKeys = Object.keys;

_$1.values = function (obj) {
  var keys = _$1.keys(obj);
  var length = keys.length;
  var values = new Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys[i]];
  }
  return values;
};

_$1.keys = nativeKeys || function (obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object');
  var keys = [];
  for (var key in obj) {
    if (_$1.has(obj, key)) keys.push(key);
  }return keys;
};

_$1.has = function (obj, key) {
  return hasOwnProperty.call(obj, key);
};

var each = _$1.each = _$1.forEach = function (obj, iterator, context) {
  if (obj == null) return;
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    var keys = _$1.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
    }
  }
};

_$1.compact = function (array) {
  return _$1.filter(array, _$1.identity);
};

_$1.filter = _$1.select = function (obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
  each(obj, function (value, index, list) {
    if (iterator.call(context, value, index, list)) results.push(value);
  });
  return results;
};

each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
  _$1['is' + name] = function (obj) {
    return toString.call(obj) == '[object ' + name + ']';
  };
});

{
  _$1.isFunction = function (obj) {
    return typeof obj === 'function';
  };
}

_$1.isFinite = function (obj) {
  return isFinite(obj) && !isNaN(parseFloat(obj));
};

_$1.isNaN = function (obj) {
  return _$1.isNumber(obj) && obj != +obj;
};

_$1.isBoolean = function (obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

_$1.isNull = function (obj) {
  return obj === null;
};

_$1.isEmpty = function (obj) {
  if (obj == null) return true;
  if (_$1.isArray(obj) || _$1.isString(obj)) return obj.length === 0;
  for (var key in obj) {
    if (_$1.has(obj, key)) return false;
  }return true;
};

_$1.isElement = function (obj) {
  return !!(obj && obj.nodeType === 1);
};

_$1.isArray = nativeIsArray || function (obj) {
  return toString.call(obj) == '[object Array]';
};

_$1.isObject = function (obj) {
  return obj === Object(obj);
};

_$1.identity = function (value) {
  return value;
};

_$1.indexOf = function (array, item, isSorted) {
  if (array == null) return -1;
  var i = 0,
      length = array.length;
  if (isSorted) {
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else {
      i = _$1.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
  }
  if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
  for (; i < length; i++) {
    if (array[i] === item) return i;
  }return -1;
};

_$1.isWindow = function (obj) {
  return obj != null && obj == obj.window;
};
_$1.isPlainObject = function (obj) {
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== "object" || obj.nodeType || _$1.isWindow(obj)) {
    return false;
  }
  try {
    // Not own constructor property must be Object
    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
      return false;
    }
  } catch (e) {
    // IE8,9 Will throw exceptions on certain host objects #9897
    return false;
  }
  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  var key;
  for (key in obj) {}

  return key === undefined || hasOwn.call(obj, key);
};

/**
*
*如果是深度extend，第一个参数就设置为true
*/
_$1.extend = function () {
  var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }
  if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== "object" && !_$1.isFunction(target)) {
    target = {};
  }
  if (length === i) {
    target = this;
    --i;
  }
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) {
          continue;
        }
        if (deep && copy && (_$1.isPlainObject(copy) || (copyIsArray = _$1.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && _$1.isArray(src) ? src : [];
          } else {
            clone = src && _$1.isPlainObject(src) ? src : {};
          }
          target[name] = _$1.extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
};
_$1.clone = function (obj) {
  if (!_$1.isObject(obj)) return obj;
  return _$1.isArray(obj) ? obj.slice() : _$1.extend(true, {}, obj);
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
*/
var Utils = {
    mainFrameRate: 60, //默认主帧率
    now: 0,
    /*像素检测专用*/
    _pixelCtx: null,
    __emptyFunc: function __emptyFunc() {},
    //retina 屏幕优化
    _devicePixelRatio: window.devicePixelRatio || 1,
    _UID: 0, //该值为向上的自增长整数值
    getUID: function getUID() {
        return this._UID++;
    },
    createId: function createId(name) {
        if (!name) {
            debugger;
        }
        //if end with a digit, then append an undersBase before appending
        var charCode = name.charCodeAt(name.length - 1);
        if (charCode >= 48 && charCode <= 57) name += "_";
        return name + Utils.getUID();
    },
    canvasSupport: function canvasSupport() {
        return !!document.createElement('canvas').getContext;
    },
    createObject: function createObject(proto, constructor) {
        var newProto;
        var ObjectCreate = Object.create;
        if (ObjectCreate) {
            newProto = ObjectCreate(proto);
        } else {
            Utils.__emptyFunc.prototype = proto;
            newProto = new Utils.__emptyFunc();
        }
        newProto.constructor = constructor;
        return newProto;
    },
    creatClass: function creatClass(r, s, px) {
        if (!s || !r) {
            return r;
        }
        var sp = s.prototype,
            rp;
        // add prototype chain
        rp = Utils.createObject(sp, r);
        r.prototype = _$1.extend(rp, r.prototype);
        r.superclass = Utils.createObject(sp, s);
        // add prototype overrides
        if (px) {
            _$1.extend(rp, px);
        }
        return r;
    },
    initElement: function initElement(canvas) {
        if (window.FlashCanvas && FlashCanvas.initElement) {
            FlashCanvas.initElement(canvas);
        }
    },
    //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
    checkOpt: function checkOpt(opt) {
        if (!opt) {
            return {
                context: {}
            };
        } else if (opt && !opt.context) {
            opt.context = {};
            return opt;
        } else {
            return opt;
        }
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
    }
};

/**
 * Point
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 */
var Point = function () {
    function Point() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        classCallCheck(this, Point);

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

    createClass(Point, [{
        key: "toArray",
        value: function toArray$$1() {
            return [this.x, this.y];
        }
    }]);
    return Point;
}();

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
var CanvaxEvent = function CanvaxEvent(evt, params) {

    var eventType = "CanvaxEvent";
    if (_$1.isString(evt)) {
        eventType = evt;
    }
    if (_$1.isObject(evt) && evt.type) {
        eventType = evt.type;
    }

    this.target = null;
    this.currentTarget = null;
    this.type = eventType;
    this.point = null;

    this._stopPropagation = false; //默认不阻止事件冒泡
};
CanvaxEvent.prototype = {
    stopPropagation: function stopPropagation() {
        this._stopPropagation = true;
    }
};

var Settings = {
    //设备分辨率
    RESOLUTION: window.devicePixelRatio || 1,

    //渲染FPS
    FPS: 60
};

var addOrRmoveEventHand = function addOrRmoveEventHand(domHand, ieHand) {
    if (document[domHand]) {
        var _ret = function () {
            var eventDomFn = function eventDomFn(el, type, fn) {
                if (el.length) {
                    for (var i = 0; i < el.length; i++) {
                        eventDomFn(el[i], type, fn);
                    }
                } else {
                    el[domHand](type, fn, false);
                }
            };

            
            return {
                v: eventDomFn
            };
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    } else {
        var _ret2 = function () {
            var eventFn = function eventFn(el, type, fn) {
                if (el.length) {
                    for (var i = 0; i < el.length; i++) {
                        eventFn(el[i], type, fn);
                    }
                } else {
                    el[ieHand]("on" + type, function () {
                        return fn.call(el, window.event);
                    });
                }
            };

            
            return {
                v: eventFn
            };
        }();

        if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
    }
};

var $ = {
    // dom操作相关代码
    query: function query(el) {
        if (_$1.isString(el)) {
            return document.getElementById(el);
        }
        if (el.nodeType == 1) {
            //则为一个element本身
            return el;
        }
        if (el.length) {
            return el[0];
        }
        return null;
    },
    offset: function offset(el) {
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
            zoom = (bound.right - bound.left) / body.clientWidth;
        }
        if (zoom > 1) {
            clientTop = 0;
            clientLeft = 0;
        }
        var top = box.top / zoom + (window.pageYOffset || docElem && docElem.scrollTop / zoom || body.scrollTop / zoom) - clientTop,
            left = box.left / zoom + (window.pageXOffset || docElem && docElem.scrollLeft / zoom || body.scrollLeft / zoom) - clientLeft;

        return {
            top: top,
            left: left
        };
    },
    addEvent: addOrRmoveEventHand("addEventListener", "attachEvent"),
    removeEvent: addOrRmoveEventHand("removeEventListener", "detachEvent"),
    pageX: function pageX(e) {
        if (e.pageX) return e.pageX;else if (e.clientX) return e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);else return null;
    },
    pageY: function pageY(e) {
        if (e.pageY) return e.pageY;else if (e.clientY) return e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);else return null;
    },
    /**
     * 创建dom
     * @param {string} id dom id 待用
     * @param {string} type : dom type， such as canvas, div etc.
     */
    createCanvas: function createCanvas(_width, _height, id) {
        var canvas = document.createElement("canvas");
        canvas.style.position = 'absolute';
        canvas.style.width = _width + 'px';
        canvas.style.height = _height + 'px';
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.setAttribute('width', _width * Settings.RESOLUTION);
        canvas.setAttribute('height', _height * Settings.RESOLUTION);
        canvas.setAttribute('id', id);
        return canvas;
    },
    createView: function createView(_width, _height, id) {
        var view = document.createElement("div");
        view.className = "canvax-view";
        view.style.cssText += "position:relative;width:" + _width + "px;height:" + _height + "px;";

        var stage_c = document.createElement("div");
        view.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;";

        //用来存放一些dom元素
        var dom_c = document.createElement("div");
        view.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height + "px;";

        view.appendChild(stage_c);
        view.appendChild(dom_c);

        return {
            view: view,
            stage_c: stage_c,
            dom_c: dom_c
        };
    }
    //dom相关代码结束
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
var _mouseEventTypes = ["click", "dblclick", "mousedown", "mousemove", "mouseup", "mouseout"];
var _hammerEventTypes = ["pan", "panstart", "panmove", "panend", "pancancel", "panleft", "panright", "panup", "pandown", "press", "pressup", "swipe", "swipeleft", "swiperight", "swipeup", "swipedown", "tap"];

var EventHandler = function EventHandler(canvax, opt) {
    this.canvax = canvax;

    this.curPoints = [new Point(0, 0)]; //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y
    //当前激活的点对应的obj，在touch下可以是个数组,和上面的 curPoints 对应
    this.curPointsTarget = [];

    this._touching = false;
    //正在拖动，前提是_touching=true
    this._draging = false;

    //当前的鼠标状态
    this._cursor = "default";

    this.target = this.canvax.view;
    this.types = [];

    //mouse体统中不需要配置drag,touch中会用到第三方的touch库，每个库的事件名称可能不一样，
    //就要这里配置，默认实现的是hammerjs的,所以默认可以在项目里引入hammerjs http://hammerjs.github.io/
    this.drag = {
        start: "panstart",
        move: "panmove",
        end: "panend"
    };

    _$1.extend(true, this, opt);
};

//这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。
var contains = document.compareDocumentPosition ? function (parent, child) {
    if (!child) {
        return false;
    }
    return !!(parent.compareDocumentPosition(child) & 16);
} : function (parent, child) {
    if (!child) {
        return false;
    }
    return child !== child && (parent.contains ? parent.contains(child) : true);
};

EventHandler.prototype = {
    init: function init() {

        //依次添加上浏览器的自带事件侦听
        var me = this;
        if (me.target.nodeType == undefined) {
            //如果target.nodeType没有的话， 说明该target为一个jQuery对象 or kissy 对象or hammer对象
            //即为第三方库，那么就要对接第三方库的事件系统。默认实现hammer的大部分事件系统
            if (!me.types || me.types.length == 0) {
                me.types = _hammerEventTypes;
            }
        } else if (me.target.nodeType == 1) {
            me.types = _mouseEventTypes;
        }

        _$1.each(me.types, function (type) {
            //不再关心浏览器环境是否 'ontouchstart' in window 
            //而是直接只管传给事件模块的是一个原生dom还是 jq对象 or hammer对象等
            if (me.target.nodeType == 1) {
                $.addEvent(me.target, type, function (e) {
                    me.__mouseHandler(e);
                });
            } else {
                me.target.on(type, function (e) {
                    me.__libHandler(e);
                });
            }
        });
    },
    /*
    * 原生事件系统------------------------------------------------begin
    * 鼠标事件处理函数
    **/
    __mouseHandler: function __mouseHandler(e) {
        var me = this;
        var root = me.canvax;

        root.updateViewOffset();

        me.curPoints = [new Point($.pageX(e) - root.viewOffset.left, $.pageY(e) - root.viewOffset.top)];

        //理论上来说，这里拿到point了后，就要计算这个point对应的target来push到curPointsTarget里，
        //但是因为在drag的时候其实是可以不用计算对应target的。
        //所以放在了下面的me.__getcurPointsTarget( e , curMousePoint );常规mousemove中执行

        var curMousePoint = me.curPoints[0];
        var curMouseTarget = me.curPointsTarget[0];

        //模拟drag,mouseover,mouseout 部分代码 begin-------------------------------------------------

        //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了
        if (e.type == "mousedown") {
            //如果curTarget 的数组为空或者第一个为false ，，，
            if (!curMouseTarget) {
                var obj = root.getObjectsUnderPoint(curMousePoint, 1)[0];
                if (obj) {
                    me.curPointsTarget = [obj];
                }
            }
            curMouseTarget = me.curPointsTarget[0];
            if (curMouseTarget && curMouseTarget.dragEnabled) {
                //鼠标事件已经摸到了一个
                me._touching = true;
            }
        }

        if (e.type == "mouseup" || e.type == "mouseout" && !contains(root.view, e.toElement || e.relatedTarget)) {
            if (me._draging == true) {
                //说明刚刚在拖动
                me._dragEnd(e, curMouseTarget, 0);
                curMouseTarget.fire("dragend");
            }
            me._draging = false;
            me._touching = false;
        }

        if (e.type == "mouseout") {
            if (!contains(root.view, e.toElement || e.relatedTarget)) {
                me.__getcurPointsTarget(e, curMousePoint);
            }
        } else if (e.type == "mousemove") {
            //|| e.type == "mousedown" ){
            //拖动过程中就不在做其他的mouseover检测，drag优先
            if (me._touching && e.type == "mousemove" && curMouseTarget) {
                //说明正在拖动啊
                if (!me._draging) {
                    //begin drag
                    curMouseTarget.fire("dragstart");
                    //先把本尊给隐藏了
                    curMouseTarget.context.globalAlpha = 0;
                    //然后克隆一个副本到activeStage

                    var cloneObject = me._clone2hoverStage(curMouseTarget, 0);
                    cloneObject.context.globalAlpha = curMouseTarget._globalAlpha;
                } else {
                    //drag move ing
                    me._dragMoveHander(e, curMouseTarget, 0);
                }
                me._draging = true;
            } else {
                //常规mousemove检测
                //move事件中，需要不停的搜索target，这个开销挺大，
                //后续可以优化，加上和帧率相当的延迟处理
                me.__getcurPointsTarget(e, curMousePoint);
            }
        } else {
            //其他的事件就直接在target上面派发事件
            var child = curMouseTarget;
            if (!child) {
                child = root;
            }
            me.__dispatchEventInChilds(e, [child]);
            me._cursorHander(child);
        }

        if (root.preventDefault) {
            //阻止默认浏览器动作(W3C) 
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                window.event.returnValue = false;
            }
        }
    },
    __getcurPointsTarget: function __getcurPointsTarget(e, point) {
        var me = this;
        var root = me.canvax;
        var oldObj = me.curPointsTarget[0];

        if (oldObj && !oldObj.context) {
            oldObj = null;
        }

        var e = new CanvaxEvent(e);

        if (e.type == "mousemove" && oldObj && oldObj._hoverClass && oldObj.pointChkPriority && oldObj.getChildInPoint(point)) {
            //小优化,鼠标move的时候。计算频率太大，所以。做此优化
            //如果有target存在，而且当前元素正在hoverStage中，而且当前鼠标还在target内,就没必要取检测整个displayList了
            //开发派发常规mousemove事件
            e.target = e.currentTarget = oldObj;
            e.point = oldObj.globalToLocal(point);
            oldObj.dispatchEvent(e);
            return;
        }
        var obj = root.getObjectsUnderPoint(point, 1)[0];

        if (oldObj && oldObj != obj || e.type == "mouseout") {
            if (oldObj && oldObj.context) {
                me.curPointsTarget[0] = null;
                e.type = "mouseout";
                e.toTarget = obj;
                e.target = e.currentTarget = oldObj;
                e.point = oldObj.globalToLocal(point);
                oldObj.dispatchEvent(e);
            }
        }

        if (obj && oldObj != obj) {
            //&& obj._hoverable 已经 干掉了
            me.curPointsTarget[0] = obj;
            e.type = "mouseover";
            e.fromTarget = oldObj;
            e.target = e.currentTarget = obj;
            e.point = obj.globalToLocal(point);
            obj.dispatchEvent(e);
        }

        if (e.type == "mousemove" && obj) {
            e.target = e.currentTarget = oldObj;
            e.point = oldObj.globalToLocal(point);
            oldObj.dispatchEvent(e);
        }
        me._cursorHander(obj, oldObj);
    },
    _cursorHander: function _cursorHander(obj, oldObj) {
        if (!obj && !oldObj) {
            this._setCursor("default");
        }
        if (obj && oldObj != obj && obj.context) {
            this._setCursor(obj.context.cursor);
        }
    },
    _setCursor: function _setCursor(cursor) {
        if (this._cursor == cursor) {
            //如果两次要设置的鼠标状态是一样的
            return;
        }
        this.canvax.view.style.cursor = cursor;
        this._cursor = cursor;
    },
    /*
    * 原生事件系统------------------------------------------------end
    */

    /*
     *第三方库的事件系统------------------------------------------------begin
     *触屏事件处理函数
     * */
    __libHandler: function __libHandler(e) {
        var me = this;
        var root = me.canvax;
        root.updateViewOffset();
        // touch 下的 curPointsTarget 从touches中来
        //获取canvax坐标系统里面的坐标
        me.curPoints = me.__getCanvaxPointInTouchs(e);
        if (!me._draging) {
            //如果在draging的话，target已经是选中了的，可以不用 检测了
            me.curPointsTarget = me.__getChildInTouchs(me.curPoints);
        }
        if (me.curPointsTarget.length > 0) {
            //drag开始
            if (e.type == me.drag.start) {
                //dragstart的时候touch已经准备好了target， curPointsTarget 里面只要有一个是有效的
                //就认为drags开始
                _$1.each(me.curPointsTarget, function (child, i) {
                    if (child && child.dragEnabled) {
                        //只要有一个元素就认为正在准备drag了
                        me._draging = true;
                        //然后克隆一个副本到activeStage
                        me._clone2hoverStage(child, i);
                        //先把本尊给隐藏了
                        child.context.globalAlpha = 0;

                        child.fire("dragstart");

                        return false;
                    }
                });
            }

            //dragIng
            if (e.type == me.drag.move) {
                if (me._draging) {
                    _$1.each(me.curPointsTarget, function (child, i) {
                        if (child && child.dragEnabled) {
                            me._dragMoveHander(e, child, i);
                        }
                    });
                }
            }

            //drag结束
            if (e.type == me.drag.end) {
                if (me._draging) {
                    _$1.each(me.curPointsTarget, function (child, i) {
                        if (child && child.dragEnabled) {
                            me._dragEnd(e, child, 0);
                            child.fire("dragend");
                        }
                    });
                    me._draging = false;
                }
            }
            me.__dispatchEventInChilds(e, me.curPointsTarget);
        } else {
            //如果当前没有一个target，就把事件派发到canvax上面
            me.__dispatchEventInChilds(e, [root]);
        }
    },
    //从touchs中获取到对应touch , 在上面添加上canvax坐标系统的x，y
    __getCanvaxPointInTouchs: function __getCanvaxPointInTouchs(e) {
        var me = this;
        var root = me.canvax;
        var curTouchs = [];
        _$1.each(e.point, function (touch) {
            curTouchs.push({
                x: CanvaxEvent.pageX(touch) - root.viewOffset.left,
                y: CanvaxEvent.pageY(touch) - root.viewOffset.top
            });
        });
        return curTouchs;
    },
    __getChildInTouchs: function __getChildInTouchs(touchs) {
        var me = this;
        var root = me.canvax;
        var touchesTarget = [];
        _$1.each(touchs, function (touch) {
            touchesTarget.push(root.getObjectsUnderPoint(touch, 1)[0]);
        });
        return touchesTarget;
    },
    /*
    *第三方库的事件系统------------------------------------------------begin
    */

    /*
     *@param {array} childs 
     * */
    __dispatchEventInChilds: function __dispatchEventInChilds(e, childs) {
        if (!childs && !("length" in childs)) {
            return false;
        }
        var me = this;
        var hasChild = false;
        _$1.each(childs, function (child, i) {
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
    _clone2hoverStage: function _clone2hoverStage(target, i) {
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
    _dragMoveHander: function _dragMoveHander(e, target, i) {
        var me = this;
        var root = me.canvax;
        var _point = target.globalToLocal(me.curPoints[i]);

        //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化
        target._notWatch = true;
        var _moveStage = target.moveing;
        target.moveing = true;
        target.context.x += _point.x - target._dragPoint.x;
        target.context.y += _point.y - target._dragPoint.y;
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
    _dragEnd: function _dragEnd(e, target, i) {
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
var EventManager = function EventManager() {
    //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
    this._eventMap = {};
};

EventManager.prototype = {
    /*
     * 注册事件侦听器对象，以使侦听器能够接收事件通知。
     */
    _addEventListener: function _addEventListener(type, listener) {

        if (typeof listener != "function") {
            //listener必须是个function呐亲
            return false;
        }
        var addResult = true;
        var self = this;
        _$1.each(type.split(" "), function (type) {
            var map = self._eventMap[type];
            if (!map) {
                map = self._eventMap[type] = [];
                map.push(listener);
                self._eventEnabled = true;
                return true;
            }

            if (_$1.indexOf(map, listener) == -1) {
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
    _removeEventListener: function _removeEventListener(type, listener) {
        if (arguments.length == 1) return this.removeEventListenerByType(type);

        var map = this._eventMap[type];
        if (!map) {
            return false;
        }

        for (var i = 0; i < map.length; i++) {
            var li = map[i];
            if (li === listener) {
                map.splice(i, 1);
                if (map.length == 0) {
                    delete this._eventMap[type];
                    //如果这个如果这个时候child没有任何事件侦听
                    if (_$1.isEmpty(this._eventMap)) {
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
    _removeEventListenerByType: function _removeEventListenerByType(type) {
        var map = this._eventMap[type];
        if (!map) {
            delete this._eventMap[type];

            //如果这个如果这个时候child没有任何事件侦听
            if (_$1.isEmpty(this._eventMap)) {
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
    _removeAllEventListeners: function _removeAllEventListeners() {
        this._eventMap = {};
        this._eventEnabled = false;
    },
    /**
    * 派发事件，调用事件侦听器。
    */
    _dispatchEvent: function _dispatchEvent(e) {
        var map = this._eventMap[e.type];

        if (map) {
            if (!e.target) e.target = this;
            map = map.slice();

            for (var i = 0; i < map.length; i++) {
                var listener = map[i];
                if (typeof listener == "function") {
                    listener.call(this, e);
                }
            }
        }

        if (!e._stopPropagation) {
            //向上冒泡
            if (this.parent) {
                e.currentTarget = this.parent;
                this.parent._dispatchEvent(e);
            }
        }
        return true;
    },
    /**
       * 检查是否为指定事件类型注册了任何侦听器。
       */
    _hasEventListener: function _hasEventListener(type) {
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
var EventDispatcher = function EventDispatcher() {
    EventDispatcher.superclass.constructor.call(this, name);
};

Utils.creatClass(EventDispatcher, EventManager, {
    on: function on(type, listener) {
        this._addEventListener(type, listener);
        return this;
    },
    addEventListener: function addEventListener(type, listener) {
        this._addEventListener(type, listener);
        return this;
    },
    un: function un(type, listener) {
        this._removeEventListener(type, listener);
        return this;
    },
    removeEventListener: function removeEventListener(type, listener) {
        this._removeEventListener(type, listener);
        return this;
    },
    removeEventListenerByType: function removeEventListenerByType(type) {
        this._removeEventListenerByType(type);
        return this;
    },
    removeAllEventListeners: function removeAllEventListeners() {
        this._removeAllEventListeners();
        return this;
    },

    //params 要传给evt的eventhandler处理函数的参数，会被merge到Canvax event中
    fire: function fire(eventType, params) {
        var e = new CanvaxEvent(eventType);

        if (params) {
            for (var p in params) {
                if (p in e) {
                    //params中的数据不能覆盖event属性
                    console.log(p + "属性不能覆盖CanvaxEvent属性");
                } else {
                    e[p] = params[p];
                }
            }
        }

        var me = this;
        _$1.each(eventType.split(" "), function (eType) {
            e.currentTarget = me;
            me.dispatchEvent(e);
        });
        return this;
    },
    dispatchEvent: function dispatchEvent(event) {
        //this instanceof DisplayObjectContainer ==> this.children
        //TODO: 这里import DisplayObjectContainer 的话，在displayObject里面的import EventDispatcher from "../event/EventDispatcher";
        //会得到一个undefined，感觉是成了一个循环依赖的问题，所以这里换用简单的判断来判断自己是一个容易，拥有children
        if (this.children && event.point) {
            var target = this.getObjectsUnderPoint(event.point, 1)[0];
            if (target) {
                target.dispatchEvent(event);
            }
            return;
        }

        if (this.context && event.type == "mouseover") {
            //记录dispatchEvent之前的心跳
            var preHeartBeat = this._heartBeatNum;
            var pregAlpha = this.context.globalAlpha;
            this._dispatchEvent(event);
            if (preHeartBeat != this._heartBeatNum) {
                this._hoverClass = true;
                if (this.hoverClone) {
                    var canvax = this.getStage().parent;
                    //然后clone一份obj，添加到_bufferStage 中
                    var activShape = this.clone(true);
                    activShape._transform = this.getConcatenatedMatrix();
                    canvax._bufferStage.addChildAt(activShape, 0);
                    //然后把自己隐藏了
                    this._globalAlpha = pregAlpha;
                    this.context.globalAlpha = 0;
                }
            }
            return;
        }

        this._dispatchEvent(event);

        if (this.context && event.type == "mouseout") {
            if (this._hoverClass) {
                //说明刚刚over的时候有添加样式
                var canvax = this.getStage().parent;
                this._hoverClass = false;

                canvax._bufferStage.removeChildById(this.id);

                if (this._globalAlpha) {
                    this.context.globalAlpha = this._globalAlpha;
                    delete this._globalAlpha;
                }
            }
        }

        return this;
    },
    hasEvent: function hasEvent(type) {
        return this._hasEventListener(type);
    },
    hasEventListener: function hasEventListener(type) {
        return this._hasEventListener(type);
    },
    hover: function hover(overFun, outFun) {
        this.on("mouseover", overFun);
        this.on("mouseout", outFun);
        return this;
    },
    once: function once(type, listener) {
        var me = this;
        var onceHandle = function onceHandle() {
            listener.apply(me, arguments);
            this.un(type, onceHandle);
        };
        this.on(type, onceHandle);
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

var Matrix = function Matrix(a, b, c, d, tx, ty) {
    this.a = a != undefined ? a : 1;
    this.b = b != undefined ? b : 0;
    this.c = c != undefined ? c : 0;
    this.d = d != undefined ? d : 1;
    this.tx = tx != undefined ? tx : 0;
    this.ty = ty != undefined ? ty : 0;
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
    toArray: function toArray() {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
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

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || function () {

	var _tweens = [];

	return {

		getAll: function getAll() {

			return _tweens;
		},

		removeAll: function removeAll() {

			_tweens = [];
		},

		add: function add(tween) {

			_tweens.push(tween);
		},

		remove: function remove(tween) {

			var i = _$1.indexOf(_tweens, tween); //_tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}
		},

		update: function update(time, preserve) {

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

				if (!_tweens[i]) {
					break;
				}
				if (_t === _tweens[i]) {
					if (_updateRes || preserve) {
						i++;
					} else {
						_tweens.splice(i, 1);
					}
				}
			}

			return true;
		}
	};
}();

// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof window === 'undefined' && typeof process !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined) {
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

			if (_valuesStart[property] instanceof Array === false) {
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
				if (typeof end === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof end === 'number') {
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

					if (typeof _valuesEnd[property] === 'string') {
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

		None: function None(k) {

			return k;
		}

	},

	Quadratic: {

		In: function In(k) {

			return k * k;
		},

		Out: function Out(k) {

			return k * (2 - k);
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return -0.5 * (--k * (k - 2) - 1);
		}

	},

	Cubic: {

		In: function In(k) {

			return k * k * k;
		},

		Out: function Out(k) {

			return --k * k * k + 1;
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);
		}

	},

	Quartic: {

		In: function In(k) {

			return k * k * k * k;
		},

		Out: function Out(k) {

			return 1 - --k * k * k * k;
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return -0.5 * ((k -= 2) * k * k * k - 2);
		}

	},

	Quintic: {

		In: function In(k) {

			return k * k * k * k * k;
		},

		Out: function Out(k) {

			return --k * k * k * k * k + 1;
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}

	},

	Sinusoidal: {

		In: function In(k) {

			return 1 - Math.cos(k * Math.PI / 2);
		},

		Out: function Out(k) {

			return Math.sin(k * Math.PI / 2);
		},

		InOut: function InOut(k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));
		}

	},

	Exponential: {

		In: function In(k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},

		Out: function Out(k) {

			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
		},

		InOut: function InOut(k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}

	},

	Circular: {

		In: function In(k) {

			return 1 - Math.sqrt(1 - k * k);
		},

		Out: function Out(k) {

			return Math.sqrt(1 - --k * k);
		},

		InOut: function InOut(k) {

			if ((k *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}

	},

	Elastic: {

		In: function In(k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
		},

		Out: function Out(k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
		},

		InOut: function InOut(k) {

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

		In: function In(k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);
		},

		Out: function Out(k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;
		},

		InOut: function InOut(k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}

	},

	Bounce: {

		In: function In(k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);
		},

		Out: function Out(k) {

			if (k < 1 / 2.75) {
				return 7.5625 * k * k;
			} else if (k < 2 / 2.75) {
				return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
			} else if (k < 2.5 / 2.75) {
				return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
			} else {
				return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
			}
		},

		InOut: function InOut(k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}

	}

};

TWEEN.Interpolation = {

	Linear: function Linear(v, k) {

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

	Bezier: function Bezier(v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;
	},

	CatmullRom: function CatmullRom(v, k) {

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

		Linear: function Linear(p0, p1, t) {

			return (p1 - p0) * t + p0;
		},

		Bernstein: function Bernstein(n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);
		},

		Factorial: function () {

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
		}(),

		CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
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
    window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}

//管理所有图表的渲染任务
var _taskList = []; //[{ id : task: }...]
var _requestAid = null;

function enabledAnimationFrame() {
    if (!_requestAid) {
        _requestAid = requestAnimationFrame(function () {
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
    var opt = _$1.extend({
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

    var tween = {};
    var tid = "tween_" + Utils.getUID();
    opt.id && (tid = tid + "_" + opt.id);

    if (opt.from && opt.to) {
        (function () {
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

            tween = new TWEEN.Tween(opt.from).to(opt.to, opt.duration).onStart(function () {
                opt.onStart.apply(this);
            }).onUpdate(function () {
                opt.onUpdate.apply(this);
            }).onComplete(function () {
                destroyFrame({
                    id: tid
                });
                tween._isCompleteed = true;
                opt.onComplete.apply(this, [this]); //执行用户的conComplete
            }).onStop(function () {
                destroyFrame({
                    id: tid
                });
                tween._isStoped = true;
                opt.onStop.apply(this, [this]);
            }).repeat(opt.repeat).delay(opt.delay).easing(TWEEN.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]]);

            tween.id = tid;
            tween.start();

            
            animate();
        })();
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

var AnimationFrame = {
    registFrame: registFrame,
    destroyFrame: destroyFrame,
    registTween: registTween,
    destroyTween: destroyTween
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
    "$skipArray": 0,
    "$watch": 1,
    "$fire": 2, //主要是get set 显性设置的 触发
    "$model": 3,
    "$accessor": 4,
    "$owner": 5,
    //"path"       : 6, //这个应该是唯一一个不用watch的不带$的成员了吧，因为地图等的path是在太大
    "$parent": 7 //用于建立数据的关系链
};

function Observe(scope, model, watchMore) {

    var stopRepeatAssign = true;

    var skipArray = scope.$skipArray,
        //要忽略监控的属性名列表
    pmodel = {},
        //要返回的对象
    accessores = {},
        //内部用于转换的对象
    VBPublics = _$1.keys(unwatchOne); //用于IE6-8

    model = model || {}; //这是pmodel上的$model属性
    watchMore = watchMore || {}; //以$开头但要强制监听的属性
    skipArray = _$1.isArray(skipArray) ? skipArray.concat(VBPublics) : VBPublics;

    function loop(name, val) {
        if (!unwatchOne[name] || unwatchOne[name] && name.charAt(0) !== "$") {
            model[name] = val;
        }
        var valueType = typeof val === "undefined" ? "undefined" : _typeof(val);
        if (valueType === "function") {
            if (!unwatchOne[name]) {
                VBPublics.push(name); //函数无需要转换
            }
        } else {
            if (_$1.indexOf(skipArray, name) !== -1 || name.charAt(0) === "$" && !watchMore[name]) {
                return VBPublics.push(name);
            }
            var accessor = function accessor(neo) {
                //创建监控属性或数组，自变量，由用户触发其改变
                var value = accessor.value,
                    preValue = value,
                    complexValue;

                if (arguments.length) {
                    //写操作
                    //set 的 值的 类型
                    var neoType = typeof neo === "undefined" ? "undefined" : _typeof(neo);

                    if (stopRepeatAssign) {
                        return; //阻止重复赋值
                    }
                    if (value !== neo) {
                        if (neo && neoType === "object" && !(neo instanceof Array) && !neo.addColorStop // neo instanceof CanvasGradient
                        ) {
                                value = neo.$model ? neo : Observe(neo, neo);
                                complexValue = value.$model;
                            } else {
                            //如果是其他数据类型
                            //if( neoType === "array" ){
                            //    value = _.clone(neo);
                            //} else {
                            value = neo;
                            //}
                        }
                        accessor.value = value;
                        model[name] = complexValue ? complexValue : value; //更新$model中的值
                        if (!complexValue) {
                            pmodel.$fire && pmodel.$fire(name, value, preValue);
                        }
                        if (valueType != neoType) {
                            //如果set的值类型已经改变，
                            //那么也要把对应的valueType修改为对应的neoType
                            valueType = neoType;
                        }
                        var hasWatchModel = pmodel;
                        //所有的赋值都要触发watch的监听事件
                        if (!pmodel.$watch) {
                            while (hasWatchModel.$parent) {
                                hasWatchModel = hasWatchModel.$parent;
                            }
                        }
                        if (hasWatchModel.$watch) {
                            hasWatchModel.$watch.call(hasWatchModel, name, value, preValue);
                        }
                    }
                } else {
                    //读操作
                    //读的时候，发现value是个obj，而且还没有defineProperty
                    //那么就临时defineProperty一次
                    if (value && valueType === "object" && !(value instanceof Array) && !value.$model && !value.addColorStop) {
                        //建立和父数据节点的关系
                        value.$parent = pmodel;
                        value = Observe(value, value);

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

    pmodel = defineProperties(pmodel, accessores, VBPublics); //生成一个空的ViewModel

    _$1.forEach(VBPublics, function (name) {
        if (scope[name]) {
            //先为函数等不被监控的属性赋值
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
    pmodel.$accessor = accessores;

    pmodel.hasOwnProperty = function (name) {
        return name in pmodel.$model;
    };

    stopRepeatAssign = false;

    return pmodel;
}
var defineProperty$1 = Object.defineProperty;
//如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
//标准浏览器使用__defineGetter__, __defineSetter__实现
try {
    defineProperty$1({}, "_", {
        value: "x"
    });
    var defineProperties = Object.defineProperties;
} catch (e) {
    if ("__defineGetter__" in Object) {
        defineProperty$1 = function defineProperty$$1(obj, prop, desc) {
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
                    defineProperty$1(obj, prop, descs[prop]);
                }
            }
            return obj;
        };
    }
}
//IE6-8使用VBScript类的set get语句实现
if (!defineProperties && window.VBArray) {
    (function () {
        var VBMediator = function VBMediator(description, name, value) {
            var fn = description[name] && description[name].set;
            if (arguments.length === 3) {
                fn(value);
            } else {
                return fn();
            }
        };

        window.execScript(["Function parseVB(code)", "\tExecuteGlobal(code)", "End Function"].join("\n"), "VBScript");

        
        defineProperties = function defineProperties(publics, description, array) {
            publics = array.slice(0);
            publics.push("hasOwnProperty");
            var className = "VBClass" + setTimeout("1"),
                owner = {},
                buffer = [];
            buffer.push("Class " + className, "\tPrivate [__data__], [__proxy__]", "\tPublic Default Function [__const__](d, p)", "\t\tSet [__data__] = d: set [__proxy__] = p", "\t\tSet [__const__] = Me", //链式调用
            "\tEnd Function");
            _$1.forEach(publics, function (name) {
                //添加公共属性,如果此时不加以后就没机会了
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
                "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)", "\tEnd Property", "\tPublic Property Set [" + name + "](val)", //setter
                "\t\tCall [__proxy__]([__data__], \"" + name + "\", val)", "\tEnd Property", "\tPublic Property Get [" + name + "]", //getter
                "\tOn Error Resume Next", //必须优先使用set语句,否则它会误将数组当字符串返回
                "\t\tSet[" + name + "] = [__proxy__]([__data__],\"" + name + "\")", "\tIf Err.Number <> 0 Then", "\t\t[" + name + "] = [__proxy__]([__data__],\"" + name + "\")", "\tEnd If", "\tOn Error Goto 0", "\tEnd Property");
            }
            buffer.push("End Class"); //类定义完毕
            buffer.push("Function " + className + "Factory(a, b)", //创建实例并传入两个关键的参数
            "\tDim o", "\tSet o = (New " + className + ")(a, b)", "\tSet " + className + "Factory = o", "End Function");
            window.parseVB(buffer.join("\r\n")); //先创建一个VB类工厂
            return window[className + "Factory"](description, VBMediator); //得到其产品
        };
    })();
}

var RENDERER_TYPE = {
    UNKNOWN: 0,
    WEBGL: 1,
    CANVAS: 2
};



var SHAPES = {
    POLY: 0,
    RECT: 1,
    CIRC: 2,
    ELIP: 3,
    RREC: 4
};

var CONTEXT_DEFAULT = {
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
var SHAPE_CONTEXT_DEFAULT = {
    cursor: "default",

    fillAlpha: 1, //context2d里没有，自定义
    fillStyle: null, //"#000000",

    lineCap: null, //默认都是直角
    lineJoin: null, //这两个目前webgl里面没实现
    miterLimit: null, //miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

    lineAlpha: 1, //context2d里没有，自定义
    strokeStyle: null,
    lineType: "solid", //context2d里没有，自定义线条的type，默认为实线
    lineWidth: null
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 的 现实对象基类
 */
var DisplayObject = function DisplayObject(opt) {
    DisplayObject.superclass.constructor.apply(this, arguments);

    //如果用户没有传入context设置，就默认为空的对象
    opt = Utils.checkOpt(opt);

    //相对父级元素的矩阵
    this._transform = null;

    //心跳次数
    this._heartBeatNum = 0;

    //元素对应的stage元素
    this.stage = null;

    //元素的父元素
    this.parent = null;

    this._eventEnabled = false; //是否响应事件交互,在添加了事件侦听后会自动设置为true

    this.dragEnabled = true; //"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽

    this.xyToInt = "xyToInt" in opt ? opt.xyToInt : true; //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

    this.moveing = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

    //创建好context
    this._createContext(opt);

    this.id = Utils.createId(this.type || "displayObject");

    this.init.apply(this, arguments);

    //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform
    this._updateTransform();
};

Utils.creatClass(DisplayObject, EventDispatcher, {
    init: function init() {},
    _createContext: function _createContext(opt) {
        var self = this;
        //所有显示对象，都有一个类似canvas.context类似的 context属性
        //用来存取改显示对象所有和显示有关的属性，坐标，样式等。
        //该对象为Coer.Observe()工厂函数生成
        self.context = null;

        //提供给Coer.Observe() 来 给 self.context 设置 propertys
        //这里不能用_.extend， 因为要保证_contextATTRS的纯粹，只覆盖下面已有的属性
        var _contextATTRS = _$1.extend(_$1.clone(CONTEXT_DEFAULT), opt.context, true);

        //有些引擎内部设置context属性的时候是不用上报心跳的，比如做热点检测的时候
        self._notWatch = false;

        _contextATTRS.$owner = self;
        _contextATTRS.$watch = function (name, value, preValue) {

            //下面的这些属性变化，都会需要重新组织矩阵属性 _transform 
            var transFormProps = ["x", "y", "scaleX", "scaleY", "rotation", "scaleOrigin", "rotateOrigin, lineWidth"];

            if (_$1.indexOf(transFormProps, name) >= 0) {
                this.$owner._updateTransform();
            }

            if (this.$owner._notWatch) {
                return;
            }

            if (this.$owner.$watch) {
                this.$owner.$watch(name, value, preValue);
            }

            this.$owner.heartBeat({
                convertType: "context",
                shape: this.$owner,
                name: name,
                value: value,
                preValue: preValue
            });
        };

        //执行init之前，应该就根据参数，把context组织好线
        self.context = Observe(_contextATTRS);
    },
    /* @myself 是否生成自己的镜像 
     * 克隆又两种，一种是镜像，另外一种是绝对意义上面的新个体
     * 默认为绝对意义上面的新个体，新对象id不能相同
     * 镜像基本上是框架内部在实现  镜像的id相同 主要用来把自己画到另外的stage里面，比如
     * mouseover和mouseout的时候调用*/
    clone: function clone(myself) {
        var conf = {
            id: this.id,
            context: _$1.clone(this.context.$model)
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

        if (!myself) {
            newObj.id = Utils.createId(newObj.type);
        }
        return newObj;
    },
    heartBeat: function heartBeat(opt) {
        //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
        //的属性，所以，通知到stage.displayAttrHasChange
        var stage = this.getStage();
        if (stage) {
            this._heartBeatNum++;
            stage.heartBeat && stage.heartBeat(opt);
        }
    },
    getCurrentWidth: function getCurrentWidth() {
        return Math.abs(this.context.width * this.context.scaleX);
    },
    getCurrentHeight: function getCurrentHeight() {
        return Math.abs(this.context.height * this.context.scaleY);
    },
    getStage: function getStage() {
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
        }
        //一直回溯到顶层object， 即是stage， stage的parent为null
        this.stage = p;
        return p;
    },
    localToGlobal: function localToGlobal(point, container) {
        !point && (point = new Point(0, 0));
        var cm = this.getConcatenatedMatrix(container);

        if (cm == null) return Point(0, 0);
        var m = new Matrix(1, 0, 0, 1, point.x, point.y);
        m.concat(cm);
        return new Point(m.tx, m.ty); //{x:m.tx, y:m.ty};
    },
    globalToLocal: function globalToLocal(point, container) {
        !point && (point = new Point(0, 0));

        if (this.type == "stage") {
            return point;
        }
        var cm = this.getConcatenatedMatrix(container);

        if (cm == null) return new Point(0, 0); //{x:0, y:0};
        cm.invert();
        var m = new Matrix(1, 0, 0, 1, point.x, point.y);
        m.concat(cm);
        return new Point(m.tx, m.ty); //{x:m.tx, y:m.ty};
    },
    localToTarget: function localToTarget(point, target) {
        var p = localToGlobal(point);
        return target.globalToLocal(p);
    },
    getConcatenatedMatrix: function getConcatenatedMatrix(container) {
        var cm = new Matrix();
        for (var o = this; o != null; o = o.parent) {
            cm.concat(o._transform);
            if (!o.parent || container && o.parent && o.parent == container || o.parent && o.parent.type == "stage") {
                //if( o.type == "stage" || (o.parent && container && o.parent.type == container.type ) ) {
                return cm; //break;
            }
        }
        return cm;
    },
    /*
     *设置元素的是否响应事件检测
     *@bool  Boolean 类型
     */
    setEventEnable: function setEventEnable(bool) {
        if (_$1.isBoolean(bool)) {
            this._eventEnabled = bool;
            return true;
        }
        return false;
    },
    /*
     *查询自己在parent的队列中的位置
     */
    getIndex: function getIndex() {
        if (!this.parent) {
            return;
        }
        return _$1.indexOf(this.parent.children, this);
    },
    /*
     *元素在z轴方向向下移动
     *@num 移动的层级
     */
    toBack: function toBack(num) {
        if (!this.parent) {
            return;
        }
        var fromIndex = this.getIndex();
        var toIndex = 0;

        if (_$1.isNumber(num)) {
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
    },
    /*
     *元素在z轴方向向上移动
     *@num 移动的层数量 默认到顶端
     */
    toFront: function toFront(num) {
        if (!this.parent) {
            return;
        }
        var fromIndex = this.getIndex();
        var pcl = this.parent.children.length;
        var toIndex = pcl;

        if (_$1.isNumber(num)) {
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
    },
    _updateTransform: function _updateTransform() {
        var _transform = new Matrix();
        _transform.identity();
        var context = this.context;
        //是否需要Transform
        if (context.scaleX !== 1 || context.scaleY !== 1) {
            //如果有缩放
            //缩放的原点坐标
            var origin = new Point(context.scaleOrigin);
            if (origin.x || origin.y) {
                _transform.translate(-origin.x, -origin.y);
            }
            _transform.scale(context.scaleX, context.scaleY);
            if (origin.x || origin.y) {
                _transform.translate(origin.x, origin.y);
            }
        }

        var rotation = context.rotation;
        if (rotation) {
            //如果有旋转
            //旋转的原点坐标
            var origin = new Point(context.rotateOrigin);
            if (origin.x || origin.y) {
                _transform.translate(-origin.x, -origin.y);
            }
            _transform.rotate(rotation % 360 * Math.PI / 180);
            if (origin.x || origin.y) {
                _transform.translate(origin.x, origin.y);
            }
        }

        //如果有位移
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
    },
    //显示对象的选取检测处理函数
    getChildInPoint: function getChildInPoint(point) {

        var result = false; //检测的结果

        //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
        if (this.type != "stage" && this.parent && this.parent.type != "stage") {
            point = this.parent.globalToLocal(point);
        }

        var x = point.x;
        var y = point.y;

        //对鼠标的坐标也做相同的变换
        if (this._transform) {
            var inverseMatrix = this._transform.clone().invert();
            var originPos = [x, y];
            originPos = inverseMatrix.mulVector(originPos);

            x = originPos[0];
            y = originPos[1];
        }

        if (this.graphics) {
            result = this.graphics.containsPoint({ x: x, y: y });
        }

        return result;
    },
    /*
    * animate
    * @param toContent 要动画变形到的属性集合
    * @param options tween 动画参数
    */
    animate: function animate(toContent, options) {
        var to = toContent;
        var from = {};
        for (var p in to) {
            from[p] = this.context[p];
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
        options.onUpdate = function () {
            //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
            if (!self.context && tween) {
                AnimationFrame.destroyTween(tween);
                tween = null;
                return;
            }
            for (var p in this) {
                self.context[p] = this[p];
            }
            upFun.apply(self, [this]);
        };
        var compFun = function compFun() {};
        if (options.onComplete) {
            compFun = options.onComplete;
        }
        options.onComplete = function (opt) {
            compFun.apply(self, arguments);
        };
        tween = AnimationFrame.registTween(options);
        return tween;
    },

    //渲染相关部分，迁移到renderers中去
    _render: function _render(ctx) {
        if (!this.context.visible || this.context.globalAlpha <= 0) {
            return;
        }
        ctx.save();

        var transForm = this._transform;
        if (!transForm) {
            transForm = this._updateTransform();
        }
        //运用矩阵开始变形
        ctx.transform.apply(ctx, transForm.toArray());

        //设置样式，文本有自己的设置样式方式
        if (this.type != "text") {
            var style = this.context.$model;
            for (var p in style) {
                if (p != "textBaseline" && p in ctx) {
                    if (style[p] || _$1.isNumber(style[p])) {
                        if (p == "globalAlpha") {
                            //透明度要从父节点继承
                            ctx[p] *= style[p];
                        } else {
                            ctx[p] = style[p];
                        }
                    }
                }
            }
        }

        this.render(ctx);
        ctx.restore();
    },
    render: function render(ctx) {
        //基类不提供render的具体实现，由后续具体的派生类各自实现
    },
    //从树中删除
    remove: function remove() {
        if (this.parent) {
            this.parent.removeChild(this);
            this.parent = null;
        }
    },
    //元素的自我销毁
    destroy: function destroy() {
        this.remove();
        this.fire("destroy");
        //把自己从父节点中删除了后做自我清除，释放内存
        this.context = null;
        delete this.context;
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3的DisplayList 中的容器类
 */
var DisplayObjectContainer = function DisplayObjectContainer(opt) {
    var self = this;
    self.children = [];
    self.mouseChildren = [];
    DisplayObjectContainer.superclass.constructor.apply(this, arguments);

    //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
    //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
    //DisplayObjectContainer的 setEventEnable() 方法
    self._eventEnabled = true;
};

Utils.creatClass(DisplayObjectContainer, DisplayObject, {
    addChild: function addChild(child) {
        if (!child) {
            return;
        }
        if (this.getChildIndex(child) != -1) {
            child.parent = this;
            return child;
        }
        //如果他在别的子元素中，那么就从别人那里删除了
        if (child.parent) {
            child.parent.removeChild(child);
        }
        this.children.push(child);
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
    },
    addChildAt: function addChildAt(child, index) {
        if (this.getChildIndex(child) != -1) {
            child.parent = this;
            return child;
        }
        if (child.parent) {
            child.parent.removeChild(child);
        }
        this.children.splice(index, 0, child);
        child.parent = this;

        //上报children心跳
        if (this.heartBeat) {
            this.heartBeat({
                convertType: "children",
                target: child,
                src: this
            });
        }

        if (this._afterAddChild) {
            this._afterAddChild(child, index);
        }

        return child;
    },
    removeChild: function removeChild(child) {
        return this.removeChildAt(_$1.indexOf(this.children, child));
    },
    removeChildAt: function removeChildAt(index) {
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
    },
    removeChildById: function removeChildById(id) {
        for (var i = 0, len = this.children.length; i < len; i++) {
            if (this.children[i].id == id) {
                return this.removeChildAt(i);
            }
        }
        return false;
    },
    removeAllChildren: function removeAllChildren() {
        while (this.children.length > 0) {
            this.removeChildAt(0);
        }
    },
    //集合类的自我销毁
    destroy: function destroy() {
        if (this.parent) {
            this.parent.removeChild(this);
            this.parent = null;
        }
        this.fire("destroy");
        //依次销毁所有子元素
        for (var i = 0, l = this.children.length; i < l; i++) {
            this.getChildAt(i).destroy();
            i--;
            l--;
        }
    },
    /*
     *@id 元素的id
     *@boolen 是否深度查询，默认就在第一层子元素中查询
     **/
    getChildById: function getChildById(id, boolen) {
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
    },
    getChildAt: function getChildAt(index) {
        if (index < 0 || index > this.children.length - 1) return null;
        return this.children[index];
    },
    getChildIndex: function getChildIndex(child) {
        return _$1.indexOf(this.children, child);
    },
    setChildIndex: function setChildIndex(child, index) {
        if (child.parent != this) return;
        var oldIndex = _$1.indexOf(this.children, child);
        if (index == oldIndex) return;
        this.children.splice(oldIndex, 1);
        this.children.splice(index, 0, child);
    },
    getNumChildren: function getNumChildren() {
        return this.children.length;
    },
    //获取x,y点上的所有object  num 需要返回的obj数量
    getObjectsUnderPoint: function getObjectsUnderPoint(point, num) {
        var result = [];

        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];

            if (child == null || !child._eventEnabled && !child.dragEnabled || !child.context.visible) {
                continue;
            }
            if (child instanceof DisplayObjectContainer) {
                //是集合
                if (child.mouseChildren && child.getNumChildren() > 0) {
                    var objs = child.getObjectsUnderPoint(point);
                    if (objs.length > 0) {
                        result = result.concat(objs);
                    }
                }
            } else {
                //非集合，可以开始做getChildInPoint了
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
var Stage = function Stage() {
    var self = this;
    self.type = "stage";
    self.canvas = null;
    self.ctx = null; //渲染的时候由renderer决定,这里不做初始值
    //stage正在渲染中
    self.stageRending = false;
    self._isReady = false;
    Stage.superclass.constructor.apply(this, arguments);
};
Utils.creatClass(Stage, DisplayObjectContainer, {
    init: function init() {},
    //由canvax的afterAddChild 回调
    initStage: function initStage(canvas, width, height) {
        var self = this;
        self.canvas = canvas;
        self.context.width = width;
        self.context.height = height;
        self.context.scaleX = Utils._devicePixelRatio;
        self.context.scaleY = Utils._devicePixelRatio;
        self._isReady = true;
    },
    heartBeat: function heartBeat(opt) {
        //shape , name , value , preValue 
        //displayList中某个属性改变了
        if (!this._isReady) {
            //在stage还没初始化完毕的情况下，无需做任何处理
            return;
        }
        opt || (opt = {}); //如果opt为空，说明就是无条件刷新
        opt.stage = this;

        //TODO临时先这么处理
        this.parent && this.parent.heartBeat(opt);
    }
});

var SystemRenderer = function () {
    function SystemRenderer() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RENDERER_TYPE.UNKNOWN;
        var app = arguments[1];
        classCallCheck(this, SystemRenderer);

        this.type = type; //2canvas,1webgl
        this.app = app;

        this.requestAid = null;

        this._heartBeat = false; //心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

        this._preRenderTime = 0;
    }

    //如果引擎处于静默状态的话，就会启动


    createClass(SystemRenderer, [{
        key: "startEnter",
        value: function startEnter() {
            var self = this;
            if (!self.requestAid) {
                self.requestAid = AnimationFrame.registFrame({
                    id: "enterFrame", //同时肯定只有一个enterFrame的task
                    task: function task() {
                        self.enterFrame.apply(self);
                    }
                });
            }
        }
    }, {
        key: "enterFrame",
        value: function enterFrame() {
            var self = this;
            //不管怎么样，enterFrame执行了就要把
            //requestAid null 掉
            self.requestAid = null;
            Utils.now = new Date().getTime();
            if (self._heartBeat) {

                self.render(this.app);

                self._heartBeat = false;
                //渲染完了，打上最新时间挫
                self._preRenderTime = new Date().getTime();
            }
        }
    }, {
        key: "_convertCanvax",
        value: function _convertCanvax(opt) {
            var me = this;
            _.each(me.app.children, function (stage) {
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
                _.each(self.app.children, function (stage, i) {
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

var CanvasGraphicsRenderer = function () {
    function CanvasGraphicsRenderer(renderer) {
        classCallCheck(this, CanvasGraphicsRenderer);

        this.renderer = renderer;
    }

    /**
    * @param displayObject
    * @stage 也可以displayObject.getStage()获取。
    */


    createClass(CanvasGraphicsRenderer, [{
        key: 'render',
        value: function render(displayObject, stage) {

            var graphics = displayObject.graphics;
            var renderer = this.renderer;
            var ctx = stage.ctx;
            var context = displayObject.context;

            if (displayObject.parent) {
                context.globalAlpha *= displayObject.parent.context.globalAlpha;
            }

            for (var i = 0; i < graphics.graphicsData.length; i++) {
                var data = graphics.graphicsData[i];
                var shape = data.shape;

                var fillStyle = data.fillStyle;
                var strokeStyle = data.strokeStyle;

                ctx.lineWidth = data.lineWidth;

                if (data.type === SHAPES.POLY) {
                    ctx.beginPath();

                    this.renderPolygon(shape.points, shape.closed, ctx);

                    if (data.hasFill()) {
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (data.hasLine()) {
                        ctx.globalAlpha = data.lineAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                } else if (data.type === SHAPES.RECT) {
                    if (data.hasFill()) {
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                    }
                    if (data.hasLine()) {
                        ctx.globalAlpha = data.lineAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    }
                } else if (data.type === SHAPES.CIRC) {

                    // TODO - need to be Undefined!
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                    ctx.closePath();

                    if (data.hasFill()) {
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (data.hasLine()) {
                        ctx.globalAlpha = data.lineAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                } else if (data.type === SHAPES.ELIP) {
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

                    if (data.hasFill()) {
                        ctx.globalAlpha = data.fillAlpha;
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (data.hasLine()) {
                        ctx.globalAlpha = data.lineAlpha;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                }
            }
        }
    }, {
        key: 'renderPolygon',
        value: function renderPolygon(points, close, ctx) {
            ctx.moveTo(points[0], points[1]);

            for (var j = 1; j < points.length / 2; ++j) {
                ctx.lineTo(points[j * 2], points[j * 2 + 1]);
            }

            if (close) {
                ctx.closePath();
            }
        }
    }]);
    return CanvasGraphicsRenderer;
}();

var CanvasRenderer = function (_SystemRenderer) {
    inherits(CanvasRenderer, _SystemRenderer);

    function CanvasRenderer(app) {
        classCallCheck(this, CanvasRenderer);

        var _this = possibleConstructorReturn(this, (CanvasRenderer.__proto__ || Object.getPrototypeOf(CanvasRenderer)).call(this, RENDERER_TYPE.CANVAS, app));

        _this.CGR = new CanvasGraphicsRenderer(_this);
        return _this;
    }

    createClass(CanvasRenderer, [{
        key: 'render',
        value: function render(app) {
            var me = this;
            _.each(_.values(app.convertStages), function (convertStage) {
                me.renderStage(convertStage.stage);
            });
            app.convertStages = {};
        }
    }, {
        key: 'renderStage',
        value: function renderStage(stage) {
            stage.stageRending = true;
            stage.ctx = stage.canvas.getContext("2d");
            this._clear(stage);
            this._render(stage);
            stage.stageRending = false;
        }
    }, {
        key: '_render',
        value: function _render(stage, displayObject) {
            if (!displayObject) {
                displayObject = stage;
            }

            if (!displayObject.context.visible || displayObject.context.globalAlpha <= 0) {
                return;
            }

            var ctx = stage.ctx;

            ctx.save();

            var transForm = displayObject._transform;
            if (!transForm) {
                transForm = displayObject._updateTransform();
            }
            //运用矩阵开始变形
            ctx.transform.apply(ctx, transForm.toArray());

            if (displayObject.graphics) {
                this.CGR.render(displayObject, stage);
            }

            if (displayObject.children) {
                for (var i = 0, len = displayObject.children.length; i < len; i++) {
                    this._render(stage, displayObject.children[i]);
                }
            }

            ctx.restore();
        }
    }, {
        key: '_clear',
        value: function _clear(stage) {
            //TODO:这里有点 奇怪， 之前的版本clearRect的时候，不需要 *RESOLUTION（分辨率）
            stage.ctx.clearRect(0, 0, this.app.width * Settings.RESOLUTION, this.app.height * Settings.RESOLUTION);
        }
    }]);
    return CanvasRenderer;
}(SystemRenderer);

/**
 * Application {{PKG_VERSION}}
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

//utils
var Application = function Application(opt) {
    this.type = "canvax";
    this._cid = new Date().getTime() + "_" + Math.floor(Math.random() * 100);

    this.el = $.query(opt.el);

    this.width = parseInt("width" in opt || this.el.offsetWidth, 10);
    this.height = parseInt("height" in opt || this.el.offsetHeight, 10);

    var viewObj = $.createView(this.width, this.height, this._cid);
    this.view = viewObj.view;
    this.stage_c = viewObj.stage_c;
    this.dom_c = viewObj.dom_c;

    this.el.innerHTML = "";
    this.el.appendChild(this.view);

    this.viewOffset = $.offset(this.view);
    this.lastGetRO = 0; //最后一次获取 viewOffset 的时间

    this.renderer = new CanvasRenderer(this);

    this.event = null;

    this._bufferStage = null;

    //是否阻止浏览器默认事件的执行
    this.preventDefault = true;
    if (opt.preventDefault === false) {
        this.preventDefault = false;
    }

    //该属性在systenRender里面操作，每帧由心跳上报的 需要重绘的stages 列表
    this.convertStages = {};

    Application.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Application, DisplayObjectContainer, {
    init: function init() {
        this.context.width = this.width;
        this.context.height = this.height;

        //然后创建一个用于绘制激活 shape 的 stage 到activation
        this._creatHoverStage();

        //创建一个如果要用像素检测的时候的容器
        this._createPixelContext();
    },
    registEvent: function registEvent(opt) {
        //初始化事件委托到root元素上面
        this.event = new EventHandler(this, opt);
        this.event.init();
        return this.event;
    },
    resize: function resize(opt) {
        //重新设置坐标系统 高宽 等。
        this.width = parseInt(opt && "width" in opt || this.el.offsetWidth, 10);
        this.height = parseInt(opt && "height" in opt || this.el.offsetHeight, 10);

        this.view.style.width = this.width + "px";
        this.view.style.height = this.height + "px";

        this.viewOffset = $.offset(this.view);
        this._notWatch = true;
        this.context.width = this.width;
        this.context.height = this.height;
        this._notWatch = false;

        var me = this;
        var reSizeCanvas = function reSizeCanvas(ctx) {
            var canvas = ctx.canvas;
            canvas.style.width = me.width + "px";
            canvas.style.height = me.height + "px";
            canvas.setAttribute("width", me.width * Utils._devicePixelRatio);
            canvas.setAttribute("height", me.height * Utils._devicePixelRatio);

            //如果是swf的话就还要调用这个方法。
            if (ctx.resize) {
                ctx.resize(me.width, me.height);
            }
        };
        _$1.each(this.children, function (s, i) {
            s._notWatch = true;
            s.context.width = me.width;
            s.context.height = me.height;
            reSizeCanvas(s.canvas);
            s._notWatch = false;
        });

        this.dom_c.style.width = this.width + "px";
        this.dom_c.style.height = this.height + "px";

        this.heartBeat();
    },
    getHoverStage: function getHoverStage() {
        return this._bufferStage;
    },
    _creatHoverStage: function _creatHoverStage() {
        //TODO:创建stage的时候一定要传入width height  两个参数
        this._bufferStage = new Stage({
            id: "activCanvas" + new Date().getTime(),
            context: {
                width: this.context.width,
                height: this.context.height
            }
        });
        //该stage不参与事件检测
        this._bufferStage._eventEnabled = false;
        this.addChild(this._bufferStage);
    },
    /**
     * 用来检测文本width height 
     * @return {Object} 上下文
    */
    _createPixelContext: function _createPixelContext() {
        var _pixelCanvas = $.query("_pixelCanvas");
        if (!_pixelCanvas) {
            _pixelCanvas = $.createCanvas(0, 0, "_pixelCanvas");
        } else {
            //如果又的话 就不需要在创建了
            return;
        }
        document.body.appendChild(_pixelCanvas);
        Utils.initElement(_pixelCanvas);
        if (Utils.canvasSupport()) {
            //canvas的话，哪怕是display:none的页可以用来左像素检测和measureText文本width检测
            _pixelCanvas.style.display = "none";
        } else {
            //flashCanvas 的话，swf如果display:none了。就做不了measureText 文本宽度 检测了
            _pixelCanvas.style.zIndex = -1;
            _pixelCanvas.style.position = "absolute";
            _pixelCanvas.style.left = -this.context.width + "px";
            _pixelCanvas.style.top = -this.context.height + "px";
            _pixelCanvas.style.visibility = "hidden";
        }
        Utils._pixelCtx = _pixelCanvas.getContext('2d');
    },

    updateViewOffset: function updateViewOffset() {
        var now = new Date().getTime();
        if (now - this.lastGetRO > 1000) {
            this.viewOffset = $.offset(this.view);
            this.lastGetRO = now;
        }
    },

    _afterAddChild: function _afterAddChild(stage, index) {
        var canvas;

        if (!stage.canvas) {
            canvas = $.createCanvas(this.context.width, this.context.height, stage.id);
        } else {
            canvas = stage.canvas;
        }

        if (this.children.length == 1) {
            this.stage_c.appendChild(canvas);
        } else if (this.children.length > 1) {
            if (index == undefined) {
                //如果没有指定位置，那么就放到_bufferStage的下面。
                this.stage_c.insertBefore(canvas, this._bufferStage.canvas);
            } else {
                //如果有指定的位置，那么就指定的位置来
                if (index >= this.children.length - 1) {
                    this.stage_c.appendChild(canvas);
                } else {
                    this.stage_c.insertBefore(canvas, this.children[index].canvas);
                }
            }
        }

        Utils.initElement(canvas);
        stage.initStage(canvas, this.context.width, this.context.height);
    },
    _afterDelChild: function _afterDelChild(stage) {
        this.stage_c.removeChild(stage.canvas);
    },

    heartBeat: function heartBeat(opt) {
        this.renderer.heartBeat(opt);
    }
});

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的sprite类，目前还只是个简单的容易。
 */
var Sprite = function Sprite() {
    this.type = "sprite";
    Sprite.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Sprite, DisplayObjectContainer, {
    init: function init() {}
});

var GraphicsData = function () {
    function GraphicsData(lineWidth, strokeStyle, lineAlpha, fillStyle, fillAlpha, shape) {
        classCallCheck(this, GraphicsData);

        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        this.lineAlpha = lineAlpha;

        this.fillStyle = fillStyle;
        this.fillAlpha = fillAlpha;

        this.shape = shape;
        this.type = shape.type;

        //这两个可以被后续修改， 具有一票否决权
        //比如polygon的 虚线描边。必须在fill的poly上面设置line为false
        this.fill = true;
        this.line = true;
    }

    createClass(GraphicsData, [{
        key: "clone",
        value: function clone() {
            return new GraphicsData(this.lineWidth, this.strokeStyle, this.lineAlpha, this.fillStyle, this.fillAlpha, this.shape);
        }

        //从宿主graphics中同步最新的style属性

    }, {
        key: "synsStyle",
        value: function synsStyle(graphics) {
            //从shape中把绘图需要的style属性同步过来
            this.lineWidth = graphics.lineWidth;
            this.strokeStyle = graphics.strokeStyle;
            this.lineAlpha = graphics.lineAlpha;

            this.fillStyle = graphics.fillStyle;
            this.fillAlpha = graphics.fillAlpha;
        }
    }, {
        key: "hasFill",
        value: function hasFill() {
            return this.fillStyle && this.fill && this.shape.closed !== undefined && this.shape.closed && this.fillAlpha;
        }
    }, {
        key: "hasLine",
        value: function hasLine() {
            return this.strokeStyle && this.lineWidth && this.lineAlpha && this.line;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.shape = null;
        }
    }]);
    return GraphicsData;
}();

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 *
 * @class
 * @memberof PIXI
 */
var Point$2 = function () {
  /**
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  function Point() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    classCallCheck(this, Point);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;
  }

  /**
   * Creates a clone of this point
   *
   * @return {PIXI.Point} a copy of the point
   */


  createClass(Point, [{
    key: "clone",
    value: function clone() {
      return new Point(this.x, this.y);
    }

    /**
     * Copies x and y from the given point
     *
     * @param {PIXI.Point} p - The point to copy.
     */

  }, {
    key: "copy",
    value: function copy(p) {
      this.set(p.x, p.y);
    }

    /**
     * Returns true if the given point is equal to this point
     *
     * @param {PIXI.Point} p - The point to check
     * @returns {boolean} Whether the given point equal to this point
     */

  }, {
    key: "equals",
    value: function equals(p) {
      return p.x === this.x && p.y === this.y;
    }

    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */

  }, {
    key: "set",
    value: function set$$1(x, y) {
      this.x = x || 0;
      this.y = y || (y !== 0 ? this.x : 0);
    }
  }]);
  return Point;
}();

/**
 * The pixi Matrix class as an object, which makes it a lot faster,
 * here is a representation of it :
 * | a | b | tx|
 * | c | d | ty|
 * | 0 | 0 | 1 |
 *
 * @class
 * @memberof PIXI
 */

var Matrix$2 = function () {
    /**
     *
     */
    function Matrix() {
        classCallCheck(this, Matrix);

        /**
         * @member {number}
         * @default 1
         */
        this.a = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.b = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.c = 0;

        /**
         * @member {number}
         * @default 1
         */
        this.d = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.tx = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.ty = 0;

        this.array = null;
    }

    /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
     *
     * a = array[0]
     * b = array[1]
     * c = array[3]
     * d = array[4]
     * tx = array[2]
     * ty = array[5]
     *
     * @param {number[]} array - The array that the matrix will be populated from.
     */


    createClass(Matrix, [{
        key: 'fromArray',
        value: function fromArray(array) {
            this.a = array[0];
            this.b = array[1];
            this.c = array[3];
            this.d = array[4];
            this.tx = array[2];
            this.ty = array[5];
        }

        /**
         * sets the matrix properties
         *
         * @param {number} a - Matrix component
         * @param {number} b - Matrix component
         * @param {number} c - Matrix component
         * @param {number} d - Matrix component
         * @param {number} tx - Matrix component
         * @param {number} ty - Matrix component
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'set',
        value: function set$$1(a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;

            return this;
        }

        /**
         * Creates an array from the current Matrix object.
         *
         * @param {boolean} transpose - Whether we need to transpose the matrix or not
         * @param {Float32Array} [out=new Float32Array(9)] - If provided the array will be assigned to out
         * @return {number[]} the newly created array which contains the matrix
         */

    }, {
        key: 'toArray',
        value: function toArray$$1(transpose, out) {
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
        }

        /**
         * Get a new position with the current transformation applied.
         * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
         *
         * @param {PIXI.Point} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, transformed through this matrix
         */

    }, {
        key: 'apply',
        value: function apply(pos, newPos) {
            newPos = newPos || new Point$2();

            var x = pos.x;
            var y = pos.y;

            newPos.x = this.a * x + this.c * y + this.tx;
            newPos.y = this.b * x + this.d * y + this.ty;

            return newPos;
        }

        /**
         * Get a new position with the inverse of the current transformation applied.
         * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
         *
         * @param {PIXI.Point} pos - The origin
         * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
         * @return {PIXI.Point} The new point, inverse-transformed through this matrix
         */

    }, {
        key: 'applyInverse',
        value: function applyInverse(pos, newPos) {
            newPos = newPos || new Point$2();

            var id = 1 / (this.a * this.d + this.c * -this.b);

            var x = pos.x;
            var y = pos.y;

            newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
            newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

            return newPos;
        }

        /**
         * Translates the matrix on the x and y.
         *
         * @param {number} x How much to translate x by
         * @param {number} y How much to translate y by
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'translate',
        value: function translate(x, y) {
            this.tx += x;
            this.ty += y;

            return this;
        }

        /**
         * Applies a scale transformation to the matrix.
         *
         * @param {number} x The amount to scale horizontally
         * @param {number} y The amount to scale vertically
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'scale',
        value: function scale(x, y) {
            this.a *= x;
            this.d *= y;
            this.c *= x;
            this.b *= y;
            this.tx *= x;
            this.ty *= y;

            return this;
        }

        /**
         * Applies a rotation transformation to the matrix.
         *
         * @param {number} angle - The angle in radians.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'rotate',
        value: function rotate(angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;

            this.a = a1 * cos - this.b * sin;
            this.b = a1 * sin + this.b * cos;
            this.c = c1 * cos - this.d * sin;
            this.d = c1 * sin + this.d * cos;
            this.tx = tx1 * cos - this.ty * sin;
            this.ty = tx1 * sin + this.ty * cos;

            return this;
        }

        /**
         * Appends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to append.
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'append',
        value: function append(matrix) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;

            this.a = matrix.a * a1 + matrix.b * c1;
            this.b = matrix.a * b1 + matrix.b * d1;
            this.c = matrix.c * a1 + matrix.d * c1;
            this.d = matrix.c * b1 + matrix.d * d1;

            this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
            this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;

            return this;
        }

        /**
         * Sets the matrix based on all the available properties
         *
         * @param {number} x - Position on the x axis
         * @param {number} y - Position on the y axis
         * @param {number} pivotX - Pivot on the x axis
         * @param {number} pivotY - Pivot on the y axis
         * @param {number} scaleX - Scale on the x axis
         * @param {number} scaleY - Scale on the y axis
         * @param {number} rotation - Rotation in radians
         * @param {number} skewX - Skew on the x axis
         * @param {number} skewY - Skew on the y axis
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'setTransform',
        value: function setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
            var sr = Math.sin(rotation);
            var cr = Math.cos(rotation);
            var cy = Math.cos(skewY);
            var sy = Math.sin(skewY);
            var nsx = -Math.sin(skewX);
            var cx = Math.cos(skewX);

            var a = cr * scaleX;
            var b = sr * scaleX;
            var c = -sr * scaleY;
            var d = cr * scaleY;

            this.a = cy * a + sy * c;
            this.b = cy * b + sy * d;
            this.c = nsx * a + cx * c;
            this.d = nsx * b + cx * d;

            this.tx = x + (pivotX * a + pivotY * c);
            this.ty = y + (pivotX * b + pivotY * d);

            return this;
        }

        /**
         * Prepends the given Matrix to this Matrix.
         *
         * @param {PIXI.Matrix} matrix - The matrix to prepend
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'prepend',
        value: function prepend(matrix) {
            var tx1 = this.tx;

            if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
                var a1 = this.a;
                var c1 = this.c;

                this.a = a1 * matrix.a + this.b * matrix.c;
                this.b = a1 * matrix.b + this.b * matrix.d;
                this.c = c1 * matrix.a + this.d * matrix.c;
                this.d = c1 * matrix.b + this.d * matrix.d;
            }

            this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
            this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;

            return this;
        }

        /**
         * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
         *
         * @param {PIXI.Transform|PIXI.TransformStatic} transform - The transform to apply the properties to.
         * @return {PIXI.Transform|PIXI.TransformStatic} The transform with the newly applied properties
         */

    }, {
        key: 'decompose',
        value: function decompose(transform) {
            // sort out rotation / skew..
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;

            var skewX = -Math.atan2(-c, d);
            var skewY = Math.atan2(b, a);

            var delta = Math.abs(skewX + skewY);

            if (delta < 0.00001) {
                transform.rotation = skewY;

                if (a < 0 && d >= 0) {
                    transform.rotation += transform.rotation <= 0 ? Math.PI : -Math.PI;
                }

                transform.skew.x = transform.skew.y = 0;
            } else {
                transform.skew.x = skewX;
                transform.skew.y = skewY;
            }

            // next set scale
            transform.scale.x = Math.sqrt(a * a + b * b);
            transform.scale.y = Math.sqrt(c * c + d * d);

            // next set position
            transform.position.x = this.tx;
            transform.position.y = this.ty;

            return transform;
        }

        /**
         * Inverts this matrix
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'invert',
        value: function invert() {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = a1 * d1 - b1 * c1;

            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;

            return this;
        }

        /**
         * Resets this Matix to an identity (default) matrix.
         *
         * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
         */

    }, {
        key: 'identity',
        value: function identity() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;

            return this;
        }

        /**
         * Creates a new Matrix object with the same values as this one.
         *
         * @return {PIXI.Matrix} A copy of this matrix. Good for chaining method calls.
         */

    }, {
        key: 'clone',
        value: function clone() {
            var matrix = new Matrix();

            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;

            return matrix;
        }

        /**
         * Changes the values of the given matrix to be the same as the ones in this matrix
         *
         * @param {PIXI.Matrix} matrix - The matrix to copy from.
         * @return {PIXI.Matrix} The matrix given in parameter with its values updated.
         */

    }, {
        key: 'copy',
        value: function copy(matrix) {
            matrix.a = this.a;
            matrix.b = this.b;
            matrix.c = this.c;
            matrix.d = this.d;
            matrix.tx = this.tx;
            matrix.ty = this.ty;

            return matrix;
        }

        /**
         * A default (identity) matrix
         *
         * @static
         * @const
         */

    }], [{
        key: 'IDENTITY',
        get: function get$$1() {
            return new Matrix();
        }

        /**
         * A temp matrix
         *
         * @static
         * @const
         */

    }, {
        key: 'TEMP_MATRIX',
        get: function get$$1() {
            return new Matrix();
        }
    }]);
    return Matrix;
}();

// Your friendly neighbour https://en.wikipedia.org/wiki/Dihedral_group of order 16
var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
var tempMatrices = [];

var mul = [];

function signum(x) {
    if (x < 0) {
        return -1;
    }
    if (x > 0) {
        return 1;
    }

    return 0;
}

function init() {
    for (var i = 0; i < 16; i++) {
        var row = [];

        mul.push(row);

        for (var j = 0; j < 16; j++) {
            var _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
            var _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
            var _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
            var _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);

            for (var k = 0; k < 16; k++) {
                if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
                    row.push(k);
                    break;
                }
            }
        }
    }

    for (var _i = 0; _i < 16; _i++) {
        var mat = new Matrix$2();

        mat.set(ux[_i], uy[_i], vx[_i], vy[_i], 0, 0);
        tempMatrices.push(mat);
    }
}

init();

var arcToSegmentsCache = {};
var segmentToBezierCache = {};
var boundsOfCurveCache = {};
var _join = Array.prototype.join;

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
  }

  // Convert into cubic bezier segments <= 90deg
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
    bounds.push({ x: bound[0].x + fx, y: bound[0].y + fy });
    bounds.push({ x: bound[1].x + fx, y: bound[1].y + fy });
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

var Arc = {
  drawArc: drawArc,
  getBoundsOfCurve: getBoundsOfCurve,
  getBoundsOfArc: getBoundsOfArc
};

/**
 * Rectangle object is an area defined by its position, as indicated by its top-left corner
 * point (x, y) and by its width and its height.
 *
 * @class
 * @memberof PIXI
 */

var Rectangle = function () {
    /**
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
     * @param {number} [width=0] - The overall width of this rectangle
     * @param {number} [height=0] - The overall height of this rectangle
     */
    function Rectangle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        classCallCheck(this, Rectangle);

        /**
         * @member {number}
         * @default 0
         */
        this.x = x;

        /**
         * @member {number}
         * @default 0
         */
        this.y = y;

        /**
         * @member {number}
         * @default 0
         */
        this.width = width;

        /**
         * @member {number}
         * @default 0
         */
        this.height = height;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.RECT
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.RECT;
    }

    /**
     * returns the left edge of the rectangle
     *
     * @member {number}
     */


    createClass(Rectangle, [{
        key: 'clone',


        /**
         * Creates a clone of this Rectangle
         *
         * @return {PIXI.Rectangle} a copy of the rectangle
         */
        value: function clone() {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        /**
         * Copies another rectangle to this one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to copy.
         * @return {PIXI.Rectangle} Returns itself.
         */

    }, {
        key: 'copy',
        value: function copy(rectangle) {
            this.x = rectangle.x;
            this.y = rectangle.y;
            this.width = rectangle.width;
            this.height = rectangle.height;

            return this;
        }

        /**
         * Checks whether the x and y coordinates given are contained within this Rectangle
         *
         * @param {number} x - The X coordinate of the point to test
         * @param {number} y - The Y coordinate of the point to test
         * @return {boolean} Whether the x/y coordinates are within this Rectangle
         */

    }, {
        key: 'contains',
        value: function contains(x, y) {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }

            if (x >= this.x && x < this.x + this.width) {
                if (y >= this.y && y < this.y + this.height) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Pads the rectangle making it grow in all directions.
         *
         * @param {number} paddingX - The horizontal padding amount.
         * @param {number} paddingY - The vertical padding amount.
         */

    }, {
        key: 'pad',
        value: function pad(paddingX, paddingY) {
            paddingX = paddingX || 0;
            paddingY = paddingY || (paddingY !== 0 ? paddingX : 0);

            this.x -= paddingX;
            this.y -= paddingY;

            this.width += paddingX * 2;
            this.height += paddingY * 2;
        }

        /**
         * Fits this rectangle around the passed one.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to fit.
         */

    }, {
        key: 'fit',
        value: function fit(rectangle) {
            if (this.x < rectangle.x) {
                this.width += this.x;
                if (this.width < 0) {
                    this.width = 0;
                }

                this.x = rectangle.x;
            }

            if (this.y < rectangle.y) {
                this.height += this.y;
                if (this.height < 0) {
                    this.height = 0;
                }
                this.y = rectangle.y;
            }

            if (this.x + this.width > rectangle.x + rectangle.width) {
                this.width = rectangle.width - this.x;
                if (this.width < 0) {
                    this.width = 0;
                }
            }

            if (this.y + this.height > rectangle.y + rectangle.height) {
                this.height = rectangle.height - this.y;
                if (this.height < 0) {
                    this.height = 0;
                }
            }
        }

        /**
         * Enlarges this rectangle to include the passed rectangle.
         *
         * @param {PIXI.Rectangle} rectangle - The rectangle to include.
         */

    }, {
        key: 'enlarge',
        value: function enlarge(rectangle) {
            var x1 = Math.min(this.x, rectangle.x);
            var x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
            var y1 = Math.min(this.y, rectangle.y);
            var y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);

            this.x = x1;
            this.width = x2 - x1;
            this.y = y1;
            this.height = y2 - y1;
        }
    }, {
        key: 'left',
        get: function get$$1() {
            return this.x;
        }

        /**
         * returns the right edge of the rectangle
         *
         * @member {number}
         */

    }, {
        key: 'right',
        get: function get$$1() {
            return this.x + this.width;
        }

        /**
         * returns the top edge of the rectangle
         *
         * @member {number}
         */

    }, {
        key: 'top',
        get: function get$$1() {
            return this.y;
        }

        /**
         * returns the bottom edge of the rectangle
         *
         * @member {number}
         */

    }, {
        key: 'bottom',
        get: function get$$1() {
            return this.y + this.height;
        }

        /**
         * A constant empty rectangle.
         *
         * @static
         * @constant
         */

    }], [{
        key: 'EMPTY',
        get: function get$$1() {
            return new Rectangle(0, 0, 0, 0);
        }
    }]);
    return Rectangle;
}();

/**
 * The Circle object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */

var Circle = function () {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [radius=0] - The radius of the circle
   */
  function Circle() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    classCallCheck(this, Circle);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;

    /**
     * @member {number}
     * @default 0
     */
    this.radius = radius;

    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     *
     * @member {number}
     * @readOnly
     * @default PIXI.SHAPES.CIRC
     * @see PIXI.SHAPES
     */
    this.type = SHAPES.CIRC;

    this.closed = true;
  }

  /**
   * Creates a clone of this Circle instance
   *
   * @return {PIXI.Circle} a copy of the Circle
   */


  createClass(Circle, [{
    key: 'clone',
    value: function clone() {
      return new Circle(this.x, this.y, this.radius);
    }

    /**
     * Checks whether the x and y coordinates given are contained within this circle
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this Circle
     */

  }, {
    key: 'contains',
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

    /**
    * Returns the framing rectangle of the circle as a Rectangle object
    *
    * @return {PIXI.Rectangle} the framing rectangle
    */

  }, {
    key: 'getBounds',
    value: function getBounds() {
      return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }]);
  return Circle;
}();

/**
 * The Ellipse object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */

var Ellipse = function () {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [width=0] - The half width of this ellipse
   * @param {number} [height=0] - The half height of this ellipse
   */
  function Ellipse() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    classCallCheck(this, Ellipse);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;

    /**
     * @member {number}
     * @default 0
     */
    this.width = width;

    /**
     * @member {number}
     * @default 0
     */
    this.height = height;

    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     *
     * @member {number}
     * @readOnly
     * @default PIXI.SHAPES.ELIP
     * @see PIXI.SHAPES
     */
    this.type = SHAPES.ELIP;

    this.closed = true;
  }

  /**
   * Creates a clone of this Ellipse instance
   *
   * @return {PIXI.Ellipse} a copy of the ellipse
   */


  createClass(Ellipse, [{
    key: 'clone',
    value: function clone() {
      return new Ellipse(this.x, this.y, this.width, this.height);
    }

    /**
     * Checks whether the x and y coordinates given are contained within this ellipse
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coords are within this ellipse
     */

  }, {
    key: 'contains',
    value: function contains(x, y) {
      if (this.width <= 0 || this.height <= 0) {
        return false;
      }

      // normalize the coords to an ellipse with center 0,0
      var normx = (x - this.x) / this.width;
      var normy = (y - this.y) / this.height;

      normx *= normx;
      normy *= normy;

      return normx + normy <= 1;
    }

    /**
     * Returns the framing rectangle of the ellipse as a Rectangle object
     *
     * @return {PIXI.Rectangle} the framing rectangle
     */

  }, {
    key: 'getBounds',
    value: function getBounds() {
      return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    }
  }]);
  return Ellipse;
}();

/**
 * @class
 * @memberof PIXI
 */

var Polygon = function () {
    /**
     * @param {PIXI.Point[]|number[]} points - This can be an array of Points
     *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
     *  the arguments passed can be all the points of the polygon e.g.
     *  `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the arguments passed can be flat
     *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
     */
    function Polygon() {
        for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
            points[_key] = arguments[_key];
        }

        classCallCheck(this, Polygon);

        if (Array.isArray(points[0])) {
            points = points[0];
        }

        // if this is an array of points, convert it to a flat array of numbers
        if (points[0] instanceof Point$2) {
            var p = [];

            for (var i = 0, il = points.length; i < il; i++) {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        this.closed = true;

        /**
         * An array of the points of this polygon
         *
         * @member {number[]}
         */
        this.points = points;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.POLY
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.POLY;
    }

    /**
     * Creates a clone of this polygon
     *
     * @return {PIXI.Polygon} a copy of the polygon
     */


    createClass(Polygon, [{
        key: 'clone',
        value: function clone() {
            return new Polygon(this.points.slice());
        }

        /**
         * Closes the polygon, adding points if necessary.
         *
         */

    }, {
        key: 'close',
        value: function close() {
            var points = this.points;
            if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
                points.push(points[0], points[1]);
            }
            this.closed = true;
        }
    }, {
        key: 'contains',
        value: function contains(x, y) {
            return this._isInsidePolygon_WindingNumber(x, y);
        }

        /**
         * 多边形包含判断 Nonzero Winding Number Rule
         */

    }, {
        key: '_isInsidePolygon_WindingNumber',
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

/**
 * Math classes and utilities mixed into PIXI namespace.
 *
 * @lends PIXI
 */

/**
 * Calculate the points for a bezier curve and then draws it.
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @param {number} fromX - Starting point x
 * @param {number} fromY - Starting point y
 * @param {number} cpX - Control point x
 * @param {number} cpY - Control point y
 * @param {number} cpX2 - Second Control point x
 * @param {number} cpY2 - Second Control point y
 * @param {number} toX - Destination point x
 * @param {number} toY - Destination point y
 * @param {number[]} [path=[]] - Path array to push points into
 * @return {number[]} Array of points of the curve
 */
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

/*
* Graphics绘图法则
* 单个grahics实例里的fill line 样式属性，都从对应shape.context中获取
* 
*/

var Graphics = function () {
    function Graphics(shape) {
        classCallCheck(this, Graphics);

        this.shape = shape;

        this.lineWidth = 1;
        this.strokeStyle = null;
        this.lineAlpha = 1;
        this.fillStyle = null;
        this.fillAlpha = 1;

        this.graphicsData = [];
        this.currentPath = null;

        this.synsStyle();

        this.dirty = 0; //脏数据
    }

    createClass(Graphics, [{
        key: 'synsStyle',
        value: function synsStyle() {
            //从shape中把绘图需要的style属性同步过来
            var sctx = this.shape.context;
            this.lineWidth = sctx.lineWidth;
            this.strokeStyle = sctx.strokeStyle;
            this.lineAlpha = sctx.lineAlpha * sctx.globalAlpha;

            this.fillStyle = sctx.fillStyle;
            this.fillAlpha = sctx.fillAlpha * sctx.globalAlpha;

            //如果graphicsData有多分组的情况下，如果以为shape的 style 属性改变调用的synsStyle
            //则会覆盖全部的 graphicsData 元素
            for (var i = 0; i < this.graphicsData.length; ++i) {
                this.graphicsData[i].synsStyle(this);
            }
        }
    }, {
        key: 'clone',
        value: function clone() {
            var clone = new Graphics();

            clone.dirty = 0;

            // copy graphics data
            for (var i = 0; i < this.graphicsData.length; ++i) {
                clone.graphicsData.push(this.graphicsData[i].clone());
            }

            clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];
            return clone;
        }
    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            var shape = new Polygon([x, y]);

            shape.closed = false;
            this.drawShape(shape);

            return this;
        }
    }, {
        key: 'lineTo',
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
        key: 'quadraticCurveTo',
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
        key: 'bezierCurveTo',
        value: function bezierCurveTo$$1(cpX, cpY, cpX2, cpY2, toX, toY) {
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

            bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);

            this.dirty++;

            return this;
        }
    }, {
        key: 'arcTo',
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
        key: 'arc',
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
            var segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 40;

            if (sweep === 0) {
                return this;
            }

            var startX = cx + Math.cos(startAngle) * radius;
            var startY = cy + Math.sin(startAngle) * radius;

            // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.
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
        key: 'drawRect',
        value: function drawRect(x, y, width, height) {
            this.drawShape(new Rectangle(x, y, width, height));
            return this;
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle(x, y, radius) {
            this.drawShape(new Circle(x, y, radius));

            return this;
        }
    }, {
        key: 'drawEllipse',
        value: function drawEllipse(x, y, width, height) {
            this.drawShape(new Ellipse(x, y, width, height));

            return this;
        }
    }, {
        key: 'drawPolygon',
        value: function drawPolygon(path) {
            // prevents an argument assignment deopt
            // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            var points = path;

            var closed = true;

            if (points instanceof Polygon) {
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

            var shape = new Polygon(points);

            shape.closed = closed;

            this.drawShape(shape);

            return this;
        }
    }, {
        key: 'clear',
        value: function clear() {
            if (this.graphicsData.length > 0) {
                this.dirty++;
                this.graphicsData.length = 0;
            }

            this.currentPath = null;

            return this;
        }
    }, {
        key: 'drawShape',
        value: function drawShape(shape) {
            if (this.currentPath) {
                if (this.currentPath.shape.points.length <= 2) {
                    this.graphicsData.pop();
                }
            }

            this.currentPath = null;

            var data = new GraphicsData(this.lineWidth, this.strokeStyle, this.lineAlpha, this.fillStyle, this.fillAlpha, shape);

            this.graphicsData.push(data);

            if (data.type === SHAPES.POLY) {
                data.shape.closed = data.shape.closed;
                this.currentPath = data;
            }

            this.dirty++;

            return data;
        }
    }, {
        key: 'closePath',
        value: function closePath() {
            var currentPath = this.currentPath;

            if (currentPath && currentPath.shape) {
                currentPath.shape.close();
            }

            return this;
        }

        /**
         * Tests if a point is inside this graphics object
         *
         * @param {PIXI.Point} point - the point to test
         * @return {boolean} the result of the test
         */

    }, {
        key: 'containsPoint',
        value: function containsPoint(point) {
            var graphicsData = this.graphicsData;
            var inside = false;
            for (var i = 0; i < graphicsData.length; ++i) {
                var data = graphicsData[i];
                if (data.shape) {
                    //先检测fill， fill的检测概率大些。
                    //像circle,ellipse这样的shape 就直接把lineWidth算在fill里面计算就好了，所以他们是没有insideLine的
                    if (data.hasFill() && data.shape.contains(point.x, point.y)) {
                        inside = true;
                        if (inside) {
                            break;
                        }
                    }

                    //circle,ellipse等就没有points
                    if (data.hasLine() && data.shape.points) {
                        //然后检测是否和描边碰撞
                        inside = insideLine(data, point.x, point.y);
                        if (inside) {
                            break;
                        }
                    }
                }
            }

            return inside;
        }

        /**
        * Update the bounds of the object
        *
        */

    }, {
        key: 'updateLocalBounds',
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

                    if (type === SHAPES.RECT || type === SHAPES.RREC) {
                        x = shape.x - lineWidth / 2;
                        y = shape.y - lineWidth / 2;
                        w = shape.width + lineWidth;
                        h = shape.height + lineWidth;

                        minX = x < minX ? x : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y < minY ? y : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else if (type === SHAPES.CIRC) {
                        x = shape.x;
                        y = shape.y;
                        w = shape.radius + lineWidth / 2;
                        h = shape.radius + lineWidth / 2;

                        minX = x - w < minX ? x - w : minX;
                        maxX = x + w > maxX ? x + w : maxX;

                        minY = y - h < minY ? y - h : minY;
                        maxY = y + h > maxY ? y + h : maxY;
                    } else if (type === SHAPES.ELIP) {
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

            this.Bound.minX = minX;
            this.Bound.maxX = maxX;

            this.Bound.minY = minY;
            this.Bound.maxY = maxY;
        }
    }, {
        key: 'destroy',
        value: function destroy(options) {
            get(Graphics.prototype.__proto__ || Object.getPrototypeOf(Graphics.prototype), 'destroy', this).call(this, options);

            for (var i = 0; i < this.graphicsData.length; ++i) {
                this.graphicsData[i].destroy();
            }

            this.graphicsData = null;
            this.currentPath = null;
        }
    }]);
    return Graphics;
}();

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
var Shape = function (_DisplayObject) {
    inherits(Shape, _DisplayObject);

    function Shape(opt) {
        classCallCheck(this, Shape);


        opt = Utils.checkOpt(opt);
        var _context = _$1.extend(_$1.clone(SHAPE_CONTEXT_DEFAULT), opt.context);
        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Shape.__proto__ || Object.getPrototypeOf(Shape)).call(this, opt));

        _this.graphics = new Graphics(_this);

        //元素是否有hover事件 和 chick事件，由addEvenetLister和remiveEventLister来触发修改
        _this._hoverable = false;
        _this._clickable = false;

        //over的时候如果有修改样式，就为true
        _this._hoverClass = false;
        _this.hoverClone = true; //是否开启在hover的时候clone一份到active stage 中 
        _this.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

        //拖拽drag的时候显示在activShape的副本
        _this._dragDuplicate = null;

        //元素是否 开启 drag 拖动，这个有用户设置传入
        //self.draggable = opt.draggable || false;

        _this.type = _this.type || "shape";
        opt.draw && (_this.draw = opt.draw);

        //处理所有的图形一些共有的属性配置,把除开id,context之外的所有属性，全部挂载到this上面
        _this.initCompProperty(opt);

        _this._rect = null;
        return _this;
    }

    createClass(Shape, [{
        key: "init",
        value: function init() {}
    }, {
        key: "draw",
        value: function draw() {}
    }, {
        key: "initCompProperty",
        value: function initCompProperty(opt) {
            for (var i in opt) {
                if (i != "id" && i != "context") {
                    this[i] = opt[i];
                }
            }
        }

        /*
         * 画虚线
         */

    }, {
        key: "dashedLineTo",
        value: function dashedLineTo(x1, y1, x2, y2, dashLength) {
            dashLength = typeof dashLength == 'undefined' ? 3 : dashLength;
            dashLength = Math.max(dashLength, this.context.lineWidth);
            var deltaX = x2 - x1;
            var deltaY = y2 - y1;
            var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
            for (var i = 0; i < numDashes; ++i) {
                var x = parseInt(x1 + deltaX / numDashes * i);
                var y = parseInt(y1 + deltaY / numDashes * i);
                this.graphics[i % 2 === 0 ? 'moveTo' : 'lineTo'](x, y);
                if (i == numDashes - 1 && i % 2 === 0) {
                    this.graphics.lineTo(x2, y2);
                }
            }
        }

        /*
         *从cpl节点中获取到4个方向的边界节点
         *@param  context 
         *
         **/

    }, {
        key: "getRectFormPointList",
        value: function getRectFormPointList(context) {
            var minX = Number.MAX_VALUE;
            var maxX = Number.MIN_VALUE;
            var minY = Number.MAX_VALUE;
            var maxY = Number.MIN_VALUE;

            var cpl = context.pointList; //this.getcpl();
            for (var i = 0, l = cpl.length; i < l; i++) {
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
            if (context.strokeStyle || context.fillStyle) {
                lineWidth = context.lineWidth || 1;
            } else {
                lineWidth = 0;
            }
            return {
                x: Math.round(minX - lineWidth / 2),
                y: Math.round(minY - lineWidth / 2),
                width: maxX - minX + lineWidth,
                height: maxY - minY + lineWidth
            };
        }
    }]);
    return Shape;
}(DisplayObject);

/**
 * Canvax--Text
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 文本 类
 **/
var Text = function Text(text, opt) {
    var self = this;
    self.type = "text";
    self._reNewline = /\r?\n/;
    self.fontProperts = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"];

    //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
    opt = Utils.checkOpt(opt);

    self._context = _$1.extend({
        fontSize: 13, //字体大小默认13
        fontWeight: "normal",
        fontFamily: "微软雅黑,sans-serif",
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

Utils.creatClass(Text, DisplayObject, {
    $watch: function $watch(name, value, preValue) {
        //context属性有变化的监听函数
        if (_$1.indexOf(this.fontProperts, name) >= 0) {
            this._context[name] = value;
            //如果修改的是font的某个内容，就重新组装一遍font的值，
            //然后通知引擎这次对context的修改不需要上报心跳
            this._notWatch = false;
            this.context.font = this._getFontDeclaration();
            this.context.width = this.getTextWidth();
            this.context.height = this.getTextHeight();
        }
    },
    init: function init(text, opt) {
        var self = this;
        var c = this.context;
        c.width = this.getTextWidth();
        c.height = this.getTextHeight();
    },
    render: function render(ctx) {
        for (var p in this.context.$model) {
            if (p in ctx) {
                if (p != "textBaseline" && this.context.$model[p]) {
                    ctx[p] = this.context.$model[p];
                }
            }
        }
        this._renderText(ctx, this._getTextLines());
    },
    resetText: function resetText(text) {
        this.text = text.toString();
        this.heartBeat();
    },
    getTextWidth: function getTextWidth() {
        var width = 0;
        Utils._pixelCtx.save();
        Utils._pixelCtx.font = this.context.font;
        width = this._getTextWidth(Utils._pixelCtx, this._getTextLines());
        Utils._pixelCtx.restore();
        return width;
    },
    getTextHeight: function getTextHeight() {
        return this._getTextHeight(Utils._pixelCtx, this._getTextLines());
    },
    _getTextLines: function _getTextLines() {
        return this.text.split(this._reNewline);
    },
    _renderText: function _renderText(ctx, textLines) {
        ctx.save();
        this._renderTextStroke(ctx, textLines);
        this._renderTextFill(ctx, textLines);
        ctx.restore();
    },
    _getFontDeclaration: function _getFontDeclaration() {
        var self = this;
        var fontArr = [];

        _$1.each(this.fontProperts, function (p) {
            var fontP = self._context[p];
            if (p == "fontSize") {
                fontP = parseFloat(fontP) + "px";
            }
            fontP && fontArr.push(fontP);
        });

        return fontArr.join(' ');
    },
    _renderTextFill: function _renderTextFill(ctx, textLines) {
        if (!this.context.fillStyle) return;

        this._boundaries = [];
        var lineHeights = 0;

        for (var i = 0, len = textLines.length; i < len; i++) {
            var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
            lineHeights += heightOfLine;

            this._renderTextLine('fillText', ctx, textLines[i], 0, //this._getLeftOffset(),
            this._getTopOffset() + lineHeights, i);
        }
    },
    _renderTextStroke: function _renderTextStroke(ctx, textLines) {
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

            this._renderTextLine('strokeText', ctx, textLines[i], 0, //this._getLeftOffset(),
            this._getTopOffset() + lineHeights, i);
        }
        ctx.closePath();
        ctx.restore();
    },
    _renderTextLine: function _renderTextLine(method, ctx, line, left, top, lineIndex) {
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
    _renderChars: function _renderChars(method, ctx, chars, left, top) {
        ctx[method](chars, 0, top);
    },
    _getHeightOfLine: function _getHeightOfLine() {
        return this.context.fontSize * this.context.lineHeight;
    },
    _getTextWidth: function _getTextWidth(ctx, textLines) {
        var maxWidth = ctx.measureText(textLines[0] || '|').width;
        for (var i = 1, len = textLines.length; i < len; i++) {
            var currentLineWidth = ctx.measureText(textLines[i]).width;
            if (currentLineWidth > maxWidth) {
                maxWidth = currentLineWidth;
            }
        }
        return maxWidth;
    },
    _getTextHeight: function _getTextHeight(ctx, textLines) {
        return this.context.fontSize * textLines.length * this.context.lineHeight;
    },

    /**
     * @private
     * @return {Number} Top offset
     */
    _getTopOffset: function _getTopOffset() {
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
    getRect: function getRect() {
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
        };
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
    var vx = 0,
        vy = 0;
    if (arguments.length == 1 && _$1.isObject(x)) {
        var arg = arguments[0];
        if (_$1.isArray(arg)) {
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
/**
 * 多线段平滑曲线 
 * opt ==> points , isLoop
 */
var SmoothSpline = function (opt) {
    var points = opt.points;
    var isLoop = opt.isLoop;
    var smoothFilter = opt.smoothFilter;

    var len = points.length;
    if (len == 1) {
        return points;
    }
    var ret = [];
    var distance = 0;
    var preVertor = new Vector(points[0]);
    var iVtor = null;
    for (var i = 1; i < len; i++) {
        iVtor = new Vector(points[i]);
        distance += preVertor.distance(iVtor);
        preVertor = iVtor;
    }

    preVertor = null;
    iVtor = null;

    //基本上等于曲率
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

        _$1.isFunction(smoothFilter) && smoothFilter(rp);

        ret.push(rp);
    }
    return ret;
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 数学 类
 *
 **/

var _cache = {
    sin: {}, //sin缓存
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
    var obj = {
        points: pList
    };
    if (_.isFunction(smoothFilter)) {
        obj.smoothFilter = smoothFilter;
    }

    var currL = SmoothSpline(obj);
    if (pList && pList.length > 0) {
        currL.push(pList[pList.length - 1]);
    }

    return currL;
}

var myMath = {
    PI: Math.PI,
    sin: sin,
    cos: cos,
    degreeToRadian: degreeToRadian,
    radianToDegree: radianToDegree,
    degreeTo360: degreeTo360,
    getIsgonPointList: getIsgonPointList,
    getSmoothPointList: getSmoothPointList
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
var BrokenLine = function (_Shape) {
    inherits(BrokenLine, _Shape);

    function BrokenLine(opt, atype) {
        classCallCheck(this, BrokenLine);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context);

        if (atype !== "clone" && _context.smooth) {
            _context.pointList = myMath.getSmoothPointList(_context.pointList);
        }

        opt.context = _context;

        var _this = possibleConstructorReturn(this, (BrokenLine.__proto__ || Object.getPrototypeOf(BrokenLine)).call(this, opt));

        _this.type = "brokenline";
        _this.id = Utils.createId(_this.type);

        _this.setGraphics();
        return _this;
    }

    createClass(BrokenLine, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "pointList" || name == "smooth" || name == "lineType") {
                this.setGraphics();
            }
        }
    }, {
        key: "setGraphics",
        value: function setGraphics() {
            this.graphics.clear();

            var context = this.context;
            var pointList = context.pointList;
            if (pointList.length < 2) {
                //少于2个点就不画了~
                return this;
            }
            if (!context.lineType || context.lineType == 'solid') {
                //默认为实线
                //TODO:目前如果 有设置smooth 的情况下是不支持虚线的
                this.graphics.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 1, l = pointList.length; i < l; i++) {
                    this.graphics.lineTo(pointList[i][0], pointList[i][1]);
                }
            } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                if (context.smooth) {
                    for (var si = 0, sl = pointList.length; si < sl; si++) {
                        if (si == sl - 1) {
                            break;
                        }
                        this.graphics.moveTo(pointList[si][0], pointList[si][1]);
                        this.graphics.lineTo(pointList[si + 1][0], pointList[si + 1][1]);
                        si += 1;
                    }
                } else {
                    //画虚线的方法  
                    this.graphics.moveTo(pointList[0][0], pointList[0][1]);
                    for (var i = 1, l = pointList.length; i < l; i++) {
                        var fromX = pointList[i - 1][0];
                        var toX = pointList[i][0];
                        var fromY = pointList[i - 1][1];
                        var toY = pointList[i][1];
                        this.dashedLineTo(fromX, fromY, toX, toY, 5);
                    }
                }
            }
            return this;
        }
    }]);
    return BrokenLine;
}(Shape);

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
var Circle$2 = function (_Shape) {
    inherits(Circle, _Shape);

    function Circle(opt) {
        classCallCheck(this, Circle);

        opt = Utils.checkOpt(opt);
        //默认情况下面，circle不需要把xy进行parentInt转换
        "xyToInt" in opt || (opt.xyToInt = false);
        var _context = _$1.extend({
            r: 0 //{number},  // 必须，圆半径
        }, opt.context);

        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, opt));

        _this.type = "circle";
        _this.id = Utils.createId(_this.type);

        _this.setGraphics();
        return _this;
    }

    createClass(Circle, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "r") {
                this.setGraphics();
            }
        }
    }, {
        key: "setGraphics",
        value: function setGraphics() {
            this.graphics.clear();
            //this.graphics.arc(0 , 0, this.context.r, 0, Math.PI * 2, true);
            this.graphics.drawCircle(0, 0, this.context.r);
        }
    }]);
    return Circle;
}(Shape);

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * Path 类，Path主要用于把svgpath 字符串转换为pointList，然后构建graphicsData
 *
 * 对应context的属性有
 * @path path串
 **/
var Path = function (_Shape) {
    inherits(Path, _Shape);

    function Path(opt) {
        classCallCheck(this, Path);


        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            pointList: [], //从下面的path中计算得到的边界点的集合
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

        var _this = possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).call(this, opt));

        if ("drawTypeOnly" in opt) {
            _this.drawTypeOnly = opt.drawTypeOnly;
        }

        _this.__parsePathData = null;

        _this.type = "path";
        _this.id = Utils.createId(_this.type);

        _this.setGraphics();

        return _this;
    }

    createClass(Path, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "path") {
                //如果path有变动，需要自动计算新的pointList
                this.setGraphics();
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
            //分拆子分组
            this.__parsePathData = [];
            var paths = _$1.compact(data.replace(/[Mm]/g, "\\r$&").split('\\r'));
            var me = this;
            _$1.each(paths, function (pathStr) {
                me.__parsePathData.push(me._parseChildPathData(pathStr));
            });
            return this.__parsePathData;
        }
    }, {
        key: "_parseChildPathData",
        value: function _parseChildPathData(data) {
            // command string
            var cs = data;
            // command chars
            var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
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

        //重新根的path绘制graphics

    }, {
        key: "setGraphics",
        value: function setGraphics() {

            this.graphics.clear();
            this.__parsePathData = null;
            this.context.pointList = [];

            var pathArray = this._parsePathData(this.context.path);

            for (var g = 0, gl = pathArray.length; g < gl; g++) {
                for (var i = 0, l = pathArray[g].length; i < l; i++) {
                    var c = pathArray[g][i].command,
                        p = pathArray[g][i].points;
                    switch (c) {
                        case 'L':
                            this.graphics.lineTo(p[0], p[1]);
                            break;
                        case 'M':
                            this.graphics.moveTo(p[0], p[1]);
                            break;
                        case 'C':
                            this.graphics.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                            break;
                        case 'Q':
                            this.graphics.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                            break;
                        case 'A':
                            //前面6个元素用来放path的A 6个参数，path A命令详见
                            Arc.drawArc(this.graphics, p[7], p[8], p);
                            break;
                        case 'z':
                            this.graphics.closePath();
                            break;
                    }
                }
            }
            return this;
        }
    }]);
    return Path;
}(Shape);

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
var Droplet = function (_Path) {
    inherits(Droplet, _Path);

    function Droplet(opt) {
        var _this;

        classCallCheck(this, Droplet);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            hr: 0, //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
            vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）
        }, opt.context);

        opt.context = _context;

        var my = (_this = possibleConstructorReturn(this, (Droplet.__proto__ || Object.getPrototypeOf(Droplet)).call(this, opt)), _this);

        _this.type = "droplet";
        _this.id = Utils.createId(_this.type);

        _this.context.path = _this._createPath();
        return _this;
    }

    createClass(Droplet, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "hr" || name == "vr") {
                this.context.path = this._createPath();
            }

            if (name == "path") {
                this.setGraphics();
            }
        }
    }, {
        key: "_createPath",
        value: function _createPath() {
            var context = this.context;
            var ps = "M 0 " + context.hr + " C " + context.hr + " " + context.hr + " " + context.hr * 3 / 2 + " " + -context.hr / 3 + " 0 " + -context.vr;
            ps += " C " + -context.hr * 3 / 2 + " " + -context.hr / 3 + " " + -context.hr + " " + context.hr + " 0 " + context.hr + "z";
            return ps;
        }
    }]);
    return Droplet;
}(Path);

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
var Ellipse$2 = function (_Shape) {
    inherits(Ellipse, _Shape);

    function Ellipse(opt) {
        classCallCheck(this, Ellipse);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            //x             : 0 , //{number},  // 丢弃
            //y             : 0 , //{number},  // 丢弃，原因同circle
            hr: 0, //{number},  // 必须，椭圆横轴半径
            vr: 0 //{number},  // 必须，椭圆纵轴半径
        }, opt.context);

        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Ellipse.__proto__ || Object.getPrototypeOf(Ellipse)).call(this, opt));

        _this.type = "ellipse";
        _this.id = Utils.createId(_this.type);

        _this.setGraphics();
        return _this;
    }

    createClass(Ellipse, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "hr" || name == "vr") {
                this.setGraphics();
            }
        }
    }, {
        key: "setGraphics",
        value: function setGraphics() {
            this.graphics.clear();
            this.graphics.drawEllipse(0, 0, this.context.hr * 2, this.context.vr * 2);
        }
    }]);
    return Ellipse;
}(Shape);

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
var Polygon$2 = function (_Shape) {
    inherits(Polygon, _Shape);

    function Polygon(opt, atype) {
        classCallCheck(this, Polygon);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context);

        if (atype !== "clone") {
            var start = _context.pointList[0];
            var end = _context.pointList.slice(-1)[0];
            if (_context.smooth) {
                _context.pointList.unshift(end);
                _context.pointList = myMath.getSmoothPointList(_context.pointList);
            }
            //else {
            //    _context.pointList.push( start );
            //}
        }

        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, opt, atype));

        _this._drawTypeOnly = null;
        _this.type = "polygon";
        _this.id = Utils.createId(_this.type);

        _this.setGraphics();
        return _this;
    }

    createClass(Polygon, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            //调用parent的setGraphics
            if (name == "pointList" || name == "smooth" || name == "lineType") {
                this.setGraphics();
            }
        }
    }, {
        key: "setGraphics",
        value: function setGraphics() {
            this.graphics.clear();

            var context = this.context;
            var pointList = context.pointList;
            if (pointList.length < 2) {
                //少于2个点就不画了~
                return;
            }

            this.graphics.moveTo(pointList[0][0], pointList[0][1]);
            for (var i = 1, l = pointList.length; i < l; i++) {
                this.graphics.lineTo(pointList[i][0], pointList[i][1]);
            }
            this.graphics.closePath();

            //如果为虚线
            if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                //首先把前面的draphicsData设置为fill only
                //也就是把line强制设置为false，这点很重要，否则你虚线画不出来，会和这个实现重叠了
                this.graphics.currentPath.line = false;

                if (context.smooth) {
                    //如果是smooth，本身已经被用曲率打散过了，不需要采用间隔法
                    for (var si = 0, sl = pointList.length; si < sl; si++) {
                        if (si == sl - 1) {
                            break;
                        }
                        this.graphics.moveTo(pointList[si][0], pointList[si][1]);
                        this.graphics.lineTo(pointList[si + 1][0], pointList[si + 1][1]);
                        si += 1;
                    }
                } else {
                    //画虚线的方法  
                    this.graphics.moveTo(pointList[0][0], pointList[0][1]);
                    for (var i = 1, l = pointList.length; i < l; i++) {
                        var fromX = pointList[i - 1][0];
                        var toX = pointList[i][0];
                        var fromY = pointList[i - 1][1];
                        var toY = pointList[i][1];
                        this.dashedLineTo(fromX, fromY, toX, toY, 5);
                    }
                }
            }
            return;
        }
    }]);
    return Polygon;
}(Shape);

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
var Isogon = function (_Polygon) {
    inherits(Isogon, _Polygon);

    function Isogon(opt) {
        classCallCheck(this, Isogon);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            pointList: [], //从下面的r和n计算得到的边界值的集合
            r: 0, //{number},  // 必须，正n边形外接圆半径
            n: 0 //{number},  // 必须，指明正几边形
        }, opt.context);
        _context.pointList = myMath.getIsgonPointList(_context.n, _context.r);

        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Isogon.__proto__ || Object.getPrototypeOf(Isogon)).call(this, opt));

        _this.type = "isogon";
        _this.id = Utils.createId(_this.type);
        return _this;
    }

    createClass(Isogon, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "r" || name == "n") {
                //如果path有变动，需要自动计算新的pointList
                this.context.pointList = myMath.getIsgonPointList(style.n, style.r);
            }

            if (name == "pointList" || name == "smooth" || name == "lineType") {
                this.setGraphics();
                this.graphics.closePath();
            }
        }
    }]);
    return Isogon;
}(Polygon$2);

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
var Line = function (_Shape) {
    inherits(Line, _Shape);

    function Line(opt) {
        classCallCheck(this, Line);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            lineType: null, //可选 虚线 实现 的 类型
            start: {
                x: 0, // 必须，起点横坐标
                y: 0 // 必须，起点纵坐标
            },
            end: {
                x: 0, // 必须，终点横坐标
                y: 0 // 必须，终点纵坐标
            },
            dashLength: 3 // 虚线间隔
        }, opt.context);
        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, opt));

        _this.setGraphics();

        _this.type = "line";
        _this.id = Utils.createId(_this.type);
        return _this;
    }

    createClass(Line, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            //并不清楚是start.x 还是end.x， 当然，这并不重要
            if (name == "x" || name == "y") {
                this.setGraphics();
            }
        }
    }, {
        key: "setGraphics",
        value: function setGraphics() {
            this.graphics.clear();
            var context = this.context;
            if (!context.lineType || context.lineType == 'solid') {
                this.graphics.moveTo(context.start.x, context.start.y);
                this.graphics.lineTo(context.end.x, context.end.y);
            } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                this.dashedLineTo(context.start.x, context.start.y, context.end.x, context.end.y, this.context.dashLength);
            }
            return this;
        }
    }]);
    return Line;
}(Shape);

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
var Rect = function (_Shape) {
    inherits(Rect, _Shape);

    function Rect(opt) {
        classCallCheck(this, Rect);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            width: 0,
            height: 0,
            radius: []
        }, opt.context);
        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, opt));

        _this.type = "rect";
        _this.id = Utils.createId(_this.type);

        _this.setGraphics();
        return _this;
    }

    createClass(Rect, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "width" || name == "height" || name == "radius") {
                this.setGraphics();
            }
        }

        /**
         * 绘制圆角矩形
         */

    }, {
        key: "_buildRadiusPath",
        value: function _buildRadiusPath() {
            var context = this.context;
            //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
            //r缩写为1         相当于 [1, 1, 1, 1]
            //r缩写为[1]       相当于 [1, 1, 1, 1]
            //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
            //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
            var x = 0;
            var y = 0;
            var width = this.context.width;
            var height = this.context.height;

            var r = Utils.getCssOrderArr(context.radius);
            var G = this.graphics;

            G.moveTo(parseInt(x + r[0]), parseInt(y));
            G.lineTo(parseInt(x + width - r[1]), parseInt(y));
            r[1] !== 0 && G.quadraticCurveTo(x + width, y, x + width, y + r[1]);
            G.lineTo(parseInt(x + width), parseInt(y + height - r[2]));
            r[2] !== 0 && G.quadraticCurveTo(x + width, y + height, x + width - r[2], y + height);
            G.lineTo(parseInt(x + r[3]), parseInt(y + height));
            r[3] !== 0 && G.quadraticCurveTo(x, y + height, x, y + height - r[3]);
            G.lineTo(parseInt(x), parseInt(y + r[0]));
            r[0] !== 0 && G.quadraticCurveTo(x, y, x + r[0], y);
        }
        /**
         * 创建矩形路径
         * @param {Context2D} ctx Canvas 2D上下文
         * @param {Object} context 样式
         */

    }, {
        key: "setGraphics",
        value: function setGraphics() {
            this.graphics.clear();
            if (!this.context.radius.length) {
                this.graphics.drawRect(0, 0, this.context.width, this.context.height);
            } else {
                this._buildRadiusPath();
            }
            this.graphics.closePath();
            return;
        }
    }]);
    return Rect;
}(Shape);

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
var Sector = function (_Shape) {
    inherits(Sector, _Shape);

    function Sector(opt) {
        classCallCheck(this, Sector);

        opt = Utils.checkOpt(opt);
        var _context = _$1.extend({
            pointList: [], //边界点的集合,私有，从下面的属性计算的来
            r0: 0, // 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
            r: 0, //{number},  // 必须，外圆半径
            startAngle: 0, //{number},  // 必须，起始角度[0, 360)
            endAngle: 0, //{number},  // 必须，结束角度(0, 360]
            clockwise: false //是否顺时针，默认为false(顺时针)
        }, opt.context);

        opt.context = _context;

        var _this = possibleConstructorReturn(this, (Sector.__proto__ || Object.getPrototypeOf(Sector)).call(this, opt));

        _this.regAngle = [];
        _this.isRing = false; //是否为一个圆环
        _this.type = "sector";
        _this.id = Utils.createId(_this.type);

        _this.setGraphics();
        return _this;
    }

    createClass(Sector, [{
        key: "$watch",
        value: function $watch(name, value, preValue) {
            if (name == "r0" || name == "r" || name == "startAngle" || name == "endAngle" || name == "clockwise") {
                this.setGraphics();
            }
        }
    }, {
        key: "setGraphics",
        value: function setGraphics() {
            var context = this.context;
            // 形内半径[0,r)
            var r0 = typeof context.r0 == 'undefined' ? 0 : context.r0;
            var r = context.r; // 扇形外半径(0,r]
            var startAngle = myMath.degreeTo360(context.startAngle); // 起始角度[0,360)
            var endAngle = myMath.degreeTo360(context.endAngle); // 结束角度(0,360]

            //var isRing     = false;                       //是否为圆环

            //if( startAngle != endAngle && Math.abs(startAngle - endAngle) % 360 == 0 ) {
            if (startAngle == endAngle && context.startAngle != context.endAngle) {
                //如果两个角度相等，那么就认为是个圆环了
                this.isRing = true;
                startAngle = 0;
                endAngle = 360;
            }

            startAngle = myMath.degreeToRadian(startAngle);
            endAngle = myMath.degreeToRadian(endAngle);

            //处理下极小夹角的情况
            if (endAngle - startAngle < 0.025) {
                startAngle -= 0.003;
            }

            var G = this.graphics;

            G.arc(0, 0, r, startAngle, endAngle, this.context.clockwise);
            if (r0 !== 0) {
                if (this.isRing) {
                    //加上这个isRing的逻辑是为了兼容flashcanvas下绘制圆环的的问题
                    //不加这个逻辑flashcanvas会绘制一个大圆 ， 而不是圆环
                    G.moveTo(r0, 0);
                    G.arc(0, 0, r0, startAngle, endAngle, !this.context.clockwise);
                } else {
                    G.arc(0, 0, r0, endAngle, startAngle, !this.context.clockwise);
                }
            } else {
                //TODO:在r0为0的时候，如果不加lineTo(0,0)来把路径闭合，会出现有搞笑的一个bug
                //整个圆会出现一个以每个扇形两端为节点的镂空，我可能描述不清楚，反正这个加上就好了
                G.lineTo(0, 0);
            }

            G.closePath();
        }
    }, {
        key: "getRegAngle",
        value: function getRegAngle() {
            this.regIn = true; //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
            var c = this.context;
            var startAngle = myMath.degreeTo360(c.startAngle); // 起始角度[0,360)
            var endAngle = myMath.degreeTo360(c.endAngle); // 结束角度(0,360]

            if (startAngle > endAngle && !c.clockwise || startAngle < endAngle && c.clockwise) {
                this.regIn = false; //out
            }
            //度的范围，从小到大
            this.regAngle = [Math.min(startAngle, endAngle), Math.max(startAngle, endAngle)];
        }
    }, {
        key: "getRect",
        value: function getRect(context) {
            var context = context ? context : this.context;
            var r0 = typeof context.r0 == 'undefined' // 形内半径[0,r)
            ? 0 : context.r0;
            var r = context.r; // 扇形外半径(0,r]

            this.getRegAngle();

            var startAngle = myMath.degreeTo360(context.startAngle); // 起始角度[0,360)
            var endAngle = myMath.degreeTo360(context.endAngle); // 结束角度(0,360]

            var pointList = [];

            var p4Direction = {
                "90": [0, r],
                "180": [-r, 0],
                "270": [0, -r],
                "360": [r, 0]
            };

            for (var d in p4Direction) {
                var inAngleReg = parseInt(d) > this.regAngle[0] && parseInt(d) < this.regAngle[1];
                if (this.isRing || inAngleReg && this.regIn || !inAngleReg && !this.regIn) {
                    pointList.push(p4Direction[d]);
                }
            }

            if (!this.isRing) {
                startAngle = myMath.degreeToRadian(startAngle);
                endAngle = myMath.degreeToRadian(endAngle);

                pointList.push([myMath.cos(startAngle) * r0, myMath.sin(startAngle) * r0]);

                pointList.push([myMath.cos(startAngle) * r, myMath.sin(startAngle) * r]);

                pointList.push([myMath.cos(endAngle) * r, myMath.sin(endAngle) * r]);

                pointList.push([myMath.cos(endAngle) * r0, myMath.sin(endAngle) * r0]);
            }

            context.pointList = pointList;
            return this.getRectFormPointList(context);
        }
    }]);
    return Sector;
}(Shape);

//shapes
var Canvax = {
    App: Application
};

Canvax.Display = {
    DisplayObject: DisplayObject,
    DisplayObjectContainer: DisplayObjectContainer,
    Stage: Stage,
    Sprite: Sprite,
    Shape: Shape,
    Point: Point,
    Text: Text
};

Canvax.Shapes = {
    BrokenLine: BrokenLine,
    Circle: Circle$2,
    Droplet: Droplet,
    Ellipse: Ellipse$2,
    Isogon: Isogon,
    Line: Line,
    Path: Path,
    Polygon: Polygon$2,
    Rect: Rect,
    Sector: Sector
};

Canvax.Event = {
    EventDispatcher: EventDispatcher,
    EventManager: EventManager
};

return Canvax;

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmF4LmpzIiwic291cmNlcyI6WyIuLi8uLi9jYW52YXgvdXRpbHMvdW5kZXJzY29yZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9pbmRleC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1BvaW50LmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0NhbnZheEV2ZW50LmpzIiwiLi4vLi4vY2FudmF4L3NldHRpbmdzLmpzIiwiLi4vLi4vY2FudmF4L3V0aWxzL2RvbS5qcyIsIi4uLy4uL2NhbnZheC9ldmVudC9FdmVudEhhbmRsZXIuanMiLCIuLi8uLi9jYW52YXgvZXZlbnQvRXZlbnRNYW5hZ2VyLmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9hbmltYXRpb24vVHdlZW4uanMiLCIuLi8uLi9jYW52YXgvYW5pbWF0aW9uL0FuaW1hdGlvbkZyYW1lLmpzIiwiLi4vLi4vY2FudmF4L3V0aWxzL29ic2VydmUuanMiLCIuLi8uLi9jYW52YXgvY29uc3QuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9EaXNwbGF5T2JqZWN0LmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lci5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1N0YWdlLmpzIiwiLi4vLi4vY2FudmF4L3JlbmRlcmVycy9TeXN0ZW1SZW5kZXJlci5qcyIsIi4uLy4uL2NhbnZheC9yZW5kZXJlcnMvY2FudmFzL0NhbnZhc0dyYXBoaWNzUmVuZGVyZXIuanMiLCIuLi8uLi9jYW52YXgvcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlci5qcyIsIi4uLy4uL2NhbnZheC9BcHBsaWNhdGlvbi5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uLy4uL2NhbnZheC9ncmFwaGljcy9HcmFwaGljc0RhdGEuanMiLCIuLi8uLi9jYW52YXgvbWF0aC9Qb2ludC5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL0dyb3VwRDguanMiLCIuLi8uLi9jYW52YXgvbWF0aC9BcmMuanMiLCIuLi8uLi9jYW52YXgvbWF0aC9zaGFwZXMvUmVjdGFuZ2xlLmpzIiwiLi4vLi4vY2FudmF4L21hdGgvc2hhcGVzL0NpcmNsZS5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL3NoYXBlcy9FbGxpcHNlLmpzIiwiLi4vLi4vY2FudmF4L21hdGgvc2hhcGVzL1BvbHlnb24uanMiLCIuLi8uLi9jYW52YXgvbWF0aC9pbmRleC5qcyIsIi4uLy4uL2NhbnZheC9ncmFwaGljcy91dGlscy9iZXppZXJDdXJ2ZVRvLmpzIiwiLi4vLi4vY2FudmF4L2dlb20vSW5zaWRlTGluZS5qcyIsIi4uLy4uL2NhbnZheC9ncmFwaGljcy9HcmFwaGljcy5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1NoYXBlLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvVGV4dC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL1ZlY3Rvci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL1Ntb290aFNwbGluZS5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdGguanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvQnJva2VuTGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9DaXJjbGUuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvUGF0aC5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Ecm9wbGV0LmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0VsbGlwc2UuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvUG9seWdvbi5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Jc29nb24uanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvTGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9SZWN0LmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL1NlY3Rvci5qcyIsIi4uLy4uL2NhbnZheC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgXyA9IHt9XG52YXIgYnJlYWtlciA9IHt9O1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyXG50b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG5oYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbnZhclxubmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxubmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG5uYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG5uYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxubmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXM7XG5cbl8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG5fLmtleXMgPSBuYXRpdmVLZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqICE9PSBPYmplY3Qob2JqKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvYmplY3QnKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIGtleXM7XG59O1xuXG5fLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn07XG5cbnZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgfVxuICB9XG59O1xuXG5fLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xufTtcblxuXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgfTtcbn0pO1xuXG5pZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICB9O1xufTtcblxuXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbn07XG5cbl8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbn07XG5cbl8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxuXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbn07XG5cbl8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xufTtcblxuXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbl8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5fLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIGlmIChpc1NvcnRlZCkge1xuICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgfVxuICB9XG4gIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG59O1xuXG5fLmlzV2luZG93ID0gZnVuY3Rpb24oIG9iaiApIHsgXG4gICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09IG9iai53aW5kb3c7XG59O1xuXy5pc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24oIG9iaiApIHtcbiAgICAvLyBCZWNhdXNlIG9mIElFLCB3ZSBhbHNvIGhhdmUgdG8gY2hlY2sgdGhlIHByZXNlbmNlIG9mIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eS5cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBET00gbm9kZXMgYW5kIHdpbmRvdyBvYmplY3RzIGRvbid0IHBhc3MgdGhyb3VnaCwgYXMgd2VsbFxuICAgIGlmICggIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iai5ub2RlVHlwZSB8fCBfLmlzV2luZG93KCBvYmogKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gICAgICAgIGlmICggb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgXCJpc1Byb3RvdHlwZU9mXCIpICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIC8vIElFOCw5IFdpbGwgdGhyb3cgZXhjZXB0aW9ucyBvbiBjZXJ0YWluIGhvc3Qgb2JqZWN0cyAjOTg5N1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAgIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICAgIHZhciBrZXk7XG4gICAgZm9yICgga2V5IGluIG9iaiApIHt9XG5cbiAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwoIG9iaiwga2V5ICk7XG59O1xuXG4vKipcbipcbirlpoLmnpzmmK/mt7HluqZleHRlbmTvvIznrKzkuIDkuKrlj4LmlbDlsLHorr7nva7kuLp0cnVlXG4qL1xuXy5leHRlbmQgPSBmdW5jdGlvbigpIHsgIFxuICB2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsICBcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSwgIFxuICAgICAgaSA9IDEsICBcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsICBcbiAgICAgIGRlZXAgPSBmYWxzZTsgIFxuICBpZiAoIHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiICkgeyAgXG4gICAgICBkZWVwID0gdGFyZ2V0OyAgXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307ICBcbiAgICAgIGkgPSAyOyAgXG4gIH07ICBcbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICFfLmlzRnVuY3Rpb24odGFyZ2V0KSApIHsgIFxuICAgICAgdGFyZ2V0ID0ge307ICBcbiAgfTsgIFxuICBpZiAoIGxlbmd0aCA9PT0gaSApIHsgIFxuICAgICAgdGFyZ2V0ID0gdGhpczsgIFxuICAgICAgLS1pOyAgXG4gIH07ICBcbiAgZm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7ICBcbiAgICAgIGlmICggKG9wdGlvbnMgPSBhcmd1bWVudHNbIGkgXSkgIT0gbnVsbCApIHsgIFxuICAgICAgICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucyApIHsgIFxuICAgICAgICAgICAgICBzcmMgPSB0YXJnZXRbIG5hbWUgXTsgIFxuICAgICAgICAgICAgICBjb3B5ID0gb3B0aW9uc1sgbmFtZSBdOyAgXG4gICAgICAgICAgICAgIGlmICggdGFyZ2V0ID09PSBjb3B5ICkgeyAgXG4gICAgICAgICAgICAgICAgICBjb250aW51ZTsgIFxuICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgaWYgKCBkZWVwICYmIGNvcHkgJiYgKCBfLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gXy5pc0FycmF5KGNvcHkpKSApICkgeyAgXG4gICAgICAgICAgICAgICAgICBpZiAoIGNvcHlJc0FycmF5ICkgeyAgXG4gICAgICAgICAgICAgICAgICAgICAgY29weUlzQXJyYXkgPSBmYWxzZTsgIFxuICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIF8uaXNBcnJheShzcmMpID8gc3JjIDogW107ICBcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBfLmlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9OyAgXG4gICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gXy5leHRlbmQoIGRlZXAsIGNsb25lLCBjb3B5ICk7ICBcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkgeyAgXG4gICAgICAgICAgICAgICAgICB0YXJnZXRbIG5hbWUgXSA9IGNvcHk7ICBcbiAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgfSAgXG4gICAgICB9ICBcbiAgfSAgXG4gIHJldHVybiB0YXJnZXQ7ICBcbn07IFxuXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh0cnVlLCB7fSwgb2JqKTtcbn07XG5leHBvcnQgZGVmYXVsdCBfOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tIFxuKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbnZhciBVdGlscyA9IHtcbiAgICBtYWluRnJhbWVSYXRlICAgOiA2MCwvL+m7mOiupOS4u+W4p+eOh1xuICAgIG5vdyA6IDAsXG4gICAgLyrlg4/ntKDmo4DmtYvkuJPnlKgqL1xuICAgIF9waXhlbEN0eCAgIDogbnVsbCxcbiAgICBfX2VtcHR5RnVuYyA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL3JldGluYSDlsY/luZXkvJjljJZcbiAgICBfZGV2aWNlUGl4ZWxSYXRpbyA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgX1VJRCAgOiAwLCAvL+ivpeWAvOS4uuWQkeS4iueahOiHquWinumVv+aVtOaVsOWAvFxuICAgIGdldFVJRDpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fVUlEKys7XG4gICAgfSxcbiAgICBjcmVhdGVJZCA6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYoIW5hbWUpe1xuICAgICAgICAgICAgZGVidWdnZXJcbiAgICAgICAgfVxuICAgICAgICAvL2lmIGVuZCB3aXRoIGEgZGlnaXQsIHRoZW4gYXBwZW5kIGFuIHVuZGVyc0Jhc2UgYmVmb3JlIGFwcGVuZGluZ1xuICAgICAgICB2YXIgY2hhckNvZGUgPSBuYW1lLmNoYXJDb2RlQXQobmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKGNoYXJDb2RlID49IDQ4ICYmIGNoYXJDb2RlIDw9IDU3KSBuYW1lICs9IFwiX1wiO1xuICAgICAgICByZXR1cm4gbmFtZSArIFV0aWxzLmdldFVJRCgpO1xuICAgIH0sXG4gICAgY2FudmFzU3VwcG9ydCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0O1xuICAgIH0sXG4gICAgY3JlYXRlT2JqZWN0IDogZnVuY3Rpb24oIHByb3RvICwgY29uc3RydWN0b3IgKSB7XG4gICAgICAgIHZhciBuZXdQcm90bztcbiAgICAgICAgdmFyIE9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG4gICAgICAgIGlmIChPYmplY3RDcmVhdGUpIHtcbiAgICAgICAgICAgIG5ld1Byb3RvID0gT2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFV0aWxzLl9fZW1wdHlGdW5jLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgICAgICAgbmV3UHJvdG8gPSBuZXcgVXRpbHMuX19lbXB0eUZ1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdQcm90by5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3UHJvdG87XG4gICAgfSxcbiAgICBjcmVhdENsYXNzIDogZnVuY3Rpb24ociwgcywgcHgpe1xuICAgICAgICBpZiAoIXMgfHwgIXIpIHtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzcCA9IHMucHJvdG90eXBlLCBycDtcbiAgICAgICAgLy8gYWRkIHByb3RvdHlwZSBjaGFpblxuICAgICAgICBycCA9IFV0aWxzLmNyZWF0ZU9iamVjdChzcCwgcik7XG4gICAgICAgIHIucHJvdG90eXBlID0gXy5leHRlbmQocnAsIHIucHJvdG90eXBlKTtcbiAgICAgICAgci5zdXBlcmNsYXNzID0gVXRpbHMuY3JlYXRlT2JqZWN0KHNwLCBzKTtcbiAgICAgICAgLy8gYWRkIHByb3RvdHlwZSBvdmVycmlkZXNcbiAgICAgICAgaWYgKHB4KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChycCwgcHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG4gICAgaW5pdEVsZW1lbnQgOiBmdW5jdGlvbiggY2FudmFzICl7XG4gICAgICAgIGlmKCB3aW5kb3cuRmxhc2hDYW52YXMgJiYgRmxhc2hDYW52YXMuaW5pdEVsZW1lbnQpe1xuICAgICAgICAgICAgRmxhc2hDYW52YXMuaW5pdEVsZW1lbnQoIGNhbnZhcyApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+WBmuS4gOasoeeugOWNleeahG9wdOWPguaVsOagoemqjO+8jOS/neivgeWcqOeUqOaIt+S4jeS8oG9wdOeahOaXtuWAmSDmiJbogIXkvKDkuoZvcHTkvYbmmK/ph4zpnaLmsqHmnIljb250ZXh055qE5pe25YCZ5oql6ZSZXG4gICAgY2hlY2tPcHQgICAgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICBpZiggIW9wdCApe1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZXh0IDoge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSAgIFxuICAgICAgICB9IGVsc2UgaWYoIG9wdCAmJiAhb3B0LmNvbnRleHQgKSB7XG4gICAgICAgICAgb3B0LmNvbnRleHQgPSB7fVxuICAgICAgICAgIHJldHVybiBvcHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9wdDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICog5oyJ54WnY3Nz55qE6aG65bqP77yM6L+U5Zue5LiA5LiqW+S4iizlj7Ms5LiLLOW3pl1cbiAgICAgKi9cbiAgICBnZXRDc3NPcmRlckFyciA6IGZ1bmN0aW9uKCByICl7XG4gICAgICAgIHZhciByMTsgXG4gICAgICAgIHZhciByMjsgXG4gICAgICAgIHZhciByMzsgXG4gICAgICAgIHZhciByNDtcblxuICAgICAgICBpZih0eXBlb2YgciA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHIxID0gcjIgPSByMyA9IHI0ID0gcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHIgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgaWYgKHIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSByWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihyLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHIxID0gcjMgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gcjQgPSByWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihyLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIHIxID0gclswXTtcbiAgICAgICAgICAgICAgICByMiA9IHI0ID0gclsxXTtcbiAgICAgICAgICAgICAgICByMyA9IHJbMl07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHIxID0gclswXTtcbiAgICAgICAgICAgICAgICByMiA9IHJbMV07XG4gICAgICAgICAgICAgICAgcjMgPSByWzJdO1xuICAgICAgICAgICAgICAgIHI0ID0gclszXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHIxID0gcjIgPSByMyA9IHI0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3IxLHIyLHIzLHI0XTtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBVdGlsczsiLCIvKipcbiAqIFBvaW50XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2ludFxue1xuICAgIGNvbnN0cnVjdG9yKCB4PTAgLCB5PTAgKVxuICAgIHtcbiAgICAgICAgaWYoIGFyZ3VtZW50cy5sZW5ndGg9PTEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PSAnb2JqZWN0JyApe1xuICAgICAgICAgICAgdmFyIGFyZz1hcmd1bWVudHNbMF1cbiAgICAgICAgICAgIGlmKCBcInhcIiBpbiBhcmcgJiYgXCJ5XCIgaW4gYXJnICl7XG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYXJnLngqMTtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmcueSoxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaT0wO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHAgaW4gYXJnKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoaT09MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmdbcF0qMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ1twXSoxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHgqMTtcbiAgICAgICAgICAgIHRoaXMueSA9IHkqMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvQXJyYXkoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLnggLCB0aGlzLnldICBcbiAgICB9XG59O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiBjYW52YXMg5LiK5aeU5omY55qE5LqL5Lu2566h55CGXG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbnZhciBDYW52YXhFdmVudCA9IGZ1bmN0aW9uKCBldnQgLCBwYXJhbXMgKSB7XG5cdFxuXHR2YXIgZXZlbnRUeXBlID0gXCJDYW52YXhFdmVudFwiOyBcbiAgICBpZiggXy5pc1N0cmluZyggZXZ0ICkgKXtcbiAgICBcdGV2ZW50VHlwZSA9IGV2dDtcbiAgICB9O1xuICAgIGlmKCBfLmlzT2JqZWN0KCBldnQgKSAmJiBldnQudHlwZSApe1xuICAgIFx0ZXZlbnRUeXBlID0gZXZ0LnR5cGU7XG4gICAgfTtcblxuICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1x0XG4gICAgdGhpcy50eXBlICAgPSBldmVudFR5cGU7XG4gICAgdGhpcy5wb2ludCAgPSBudWxsO1xuXG4gICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uID0gZmFsc2UgOyAvL+m7mOiupOS4jemYu+atouS6i+S7tuWGkuazoVxufVxuQ2FudmF4RXZlbnQucHJvdG90eXBlID0ge1xuICAgIHN0b3BQcm9wYWdhdGlvbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IENhbnZheEV2ZW50OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICAvL+iuvuWkh+WIhui+qOeOh1xuICAgIFJFU09MVVRJT046IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG5cbiAgICAvL+a4suafk0ZQU1xuICAgIEZQUzogNjBcbn07XG4iLCJpbXBvcnQgXyBmcm9tIFwiLi91bmRlcnNjb3JlXCI7XG5pbXBvcnQgc2V0dGluZ3MgZnJvbSBcIi4uL3NldHRpbmdzXCJcblxudmFyIGFkZE9yUm1vdmVFdmVudEhhbmQgPSBmdW5jdGlvbiggZG9tSGFuZCAsIGllSGFuZCApe1xuICAgIGlmKCBkb2N1bWVudFsgZG9tSGFuZCBdICl7XG4gICAgICAgIGZ1bmN0aW9uIGV2ZW50RG9tRm4oIGVsICwgdHlwZSAsIGZuICl7XG4gICAgICAgICAgICBpZiggZWwubGVuZ3RoICl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTAgOyBpIDwgZWwubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnREb21GbiggZWxbaV0gLCB0eXBlICwgZm4gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsWyBkb21IYW5kIF0oIHR5cGUgLCBmbiAsIGZhbHNlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBldmVudERvbUZuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnVuY3Rpb24gZXZlbnRGbiggZWwgLCB0eXBlICwgZm4gKXtcbiAgICAgICAgICAgIGlmKCBlbC5sZW5ndGggKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MCA7IGkgPCBlbC5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBldmVudEZuKCBlbFtpXSx0eXBlLGZuICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbFsgaWVIYW5kIF0oIFwib25cIit0eXBlICwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwoIGVsICwgd2luZG93LmV2ZW50ICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBldmVudEZuXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8vIGRvbeaTjeS9nOebuOWFs+S7o+eggVxuICAgIHF1ZXJ5IDogZnVuY3Rpb24oZWwpe1xuICAgICAgICBpZihfLmlzU3RyaW5nKGVsKSl7XG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbClcbiAgICAgICAgfVxuICAgICAgICBpZihlbC5ub2RlVHlwZSA9PSAxKXtcbiAgICAgICAgICAgLy/liJnkuLrkuIDkuKplbGVtZW505pys6LqrXG4gICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9XG4gICAgICAgIGlmKGVsLmxlbmd0aCl7XG4gICAgICAgICAgIHJldHVybiBlbFswXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgb2Zmc2V0IDogZnVuY3Rpb24oZWwpe1xuICAgICAgICB2YXIgYm94ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIFxuICAgICAgICBkb2MgPSBlbC5vd25lckRvY3VtZW50LCBcbiAgICAgICAgYm9keSA9IGRvYy5ib2R5LCBcbiAgICAgICAgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQsIFxuXG4gICAgICAgIC8vIGZvciBpZSAgXG4gICAgICAgIGNsaWVudFRvcCA9IGRvY0VsZW0uY2xpZW50VG9wIHx8IGJvZHkuY2xpZW50VG9wIHx8IDAsIFxuICAgICAgICBjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwLCBcblxuICAgICAgICAvLyBJbiBJbnRlcm5ldCBFeHBsb3JlciA3IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBwcm9wZXJ0eSBpcyB0cmVhdGVkIGFzIHBoeXNpY2FsLCBcbiAgICAgICAgLy8gd2hpbGUgb3RoZXJzIGFyZSBsb2dpY2FsLiBNYWtlIGFsbCBsb2dpY2FsLCBsaWtlIGluIElFOC4gXG4gICAgICAgIHpvb20gPSAxOyBcbiAgICAgICAgaWYgKGJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7IFxuICAgICAgICAgICAgdmFyIGJvdW5kID0gYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgXG4gICAgICAgICAgICB6b29tID0gKGJvdW5kLnJpZ2h0IC0gYm91bmQubGVmdCkvYm9keS5jbGllbnRXaWR0aDsgXG4gICAgICAgIH0gXG4gICAgICAgIGlmICh6b29tID4gMSl7IFxuICAgICAgICAgICAgY2xpZW50VG9wID0gMDsgXG4gICAgICAgICAgICBjbGllbnRMZWZ0ID0gMDsgXG4gICAgICAgIH0gXG4gICAgICAgIHZhciB0b3AgPSBib3gudG9wL3pvb20gKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5zY3JvbGxUb3Avem9vbSB8fCBib2R5LnNjcm9sbFRvcC96b29tKSAtIGNsaWVudFRvcCwgXG4gICAgICAgICAgICBsZWZ0ID0gYm94LmxlZnQvem9vbSArICh3aW5kb3cucGFnZVhPZmZzZXR8fCBkb2NFbGVtICYmIGRvY0VsZW0uc2Nyb2xsTGVmdC96b29tIHx8IGJvZHkuc2Nyb2xsTGVmdC96b29tKSAtIGNsaWVudExlZnQ7IFxuXG4gICAgICAgIHJldHVybiB7IFxuICAgICAgICAgICAgdG9wOiB0b3AsIFxuICAgICAgICAgICAgbGVmdDogbGVmdCBcbiAgICAgICAgfTsgXG4gICAgfSxcbiAgICBhZGRFdmVudCA6IGFkZE9yUm1vdmVFdmVudEhhbmQoIFwiYWRkRXZlbnRMaXN0ZW5lclwiICwgXCJhdHRhY2hFdmVudFwiICksXG4gICAgcmVtb3ZlRXZlbnQgOiBhZGRPclJtb3ZlRXZlbnRIYW5kKCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiAsIFwiZGV0YWNoRXZlbnRcIiApLFxuICAgIHBhZ2VYOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnBhZ2VYKSByZXR1cm4gZS5wYWdlWDtcbiAgICAgICAgZWxzZSBpZiAoZS5jbGllbnRYKVxuICAgICAgICAgICAgcmV0dXJuIGUuY2xpZW50WCArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCA/XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IDogZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0KTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHBhZ2VZOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnBhZ2VZKSByZXR1cm4gZS5wYWdlWTtcbiAgICAgICAgZWxzZSBpZiAoZS5jbGllbnRZKVxuICAgICAgICAgICAgcmV0dXJuIGUuY2xpZW50WSArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA6IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIm+W7umRvbVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBkb20gaWQg5b6F55SoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgOiBkb20gdHlwZe+8jCBzdWNoIGFzIGNhbnZhcywgZGl2IGV0Yy5cbiAgICAgKi9cbiAgICBjcmVhdGVDYW52YXMgOiBmdW5jdGlvbiggX3dpZHRoICwgX2hlaWdodCAsIGlkKSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggID0gX3dpZHRoICsgJ3B4JztcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IF9oZWlnaHQgKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUubGVmdCAgID0gMDtcbiAgICAgICAgY2FudmFzLnN0eWxlLnRvcCAgICA9IDA7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgX3dpZHRoICogc2V0dGluZ3MuUkVTT0xVVElPTik7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIF9oZWlnaHQgKiBzZXR0aW5ncy5SRVNPTFVUSU9OKTtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfSxcbiAgICBjcmVhdGVWaWV3OiBmdW5jdGlvbihfd2lkdGggLCBfaGVpZ2h0LCBpZCl7XG4gICAgICAgIHZhciB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5jbGFzc05hbWUgPSBcImNhbnZheC12aWV3XCI7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgdmFyIHN0YWdlX2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2aWV3LnN0eWxlLmNzc1RleHQgKz0gXCJwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpcIiArIF93aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgX2hlaWdodCArXCJweDtcIlxuXG4gICAgICAgIC8v55So5p2l5a2Y5pS+5LiA5LqbZG9t5YWD57SgXG4gICAgICAgIHZhciBkb21fYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOmFic29sdXRlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZChzdGFnZV9jKTtcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZChkb21fYyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmlldyA6IHZpZXcsXG4gICAgICAgICAgICBzdGFnZV9jOiBzdGFnZV9jLFxuICAgICAgICAgICAgZG9tX2M6IGRvbV9jXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy9kb23nm7jlhbPku6PnoIHnu5PmnZ9cbn07IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICovXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL2Rpc3BsYXkvUG9pbnRcIjtcbmltcG9ydCBDYW52YXhFdmVudCBmcm9tIFwiLi9DYW52YXhFdmVudFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCAkIGZyb20gXCIuLi91dGlscy9kb21cIjtcblxudmFyIF9tb3VzZUV2ZW50VHlwZXMgPSBbXCJjbGlja1wiLFwiZGJsY2xpY2tcIixcIm1vdXNlZG93blwiLFwibW91c2Vtb3ZlXCIsXCJtb3VzZXVwXCIsXCJtb3VzZW91dFwiXTtcbnZhciBfaGFtbWVyRXZlbnRUeXBlcyA9IFsgXG4gICAgXCJwYW5cIixcInBhbnN0YXJ0XCIsXCJwYW5tb3ZlXCIsXCJwYW5lbmRcIixcInBhbmNhbmNlbFwiLFwicGFubGVmdFwiLFwicGFucmlnaHRcIixcInBhbnVwXCIsXCJwYW5kb3duXCIsXG4gICAgXCJwcmVzc1wiICwgXCJwcmVzc3VwXCIsXG4gICAgXCJzd2lwZVwiICwgXCJzd2lwZWxlZnRcIiAsIFwic3dpcGVyaWdodFwiICwgXCJzd2lwZXVwXCIgLCBcInN3aXBlZG93blwiLFxuICAgIFwidGFwXCJcbl07XG5cbnZhciBFdmVudEhhbmRsZXIgPSBmdW5jdGlvbihjYW52YXggLCBvcHQpIHtcbiAgICB0aGlzLmNhbnZheCA9IGNhbnZheDtcblxuICAgIHRoaXMuY3VyUG9pbnRzID0gW25ldyBQb2ludCgwLCAwKV0gLy9YLFkg55qEIHBvaW50IOmbhuWQiCwg5ZyodG91Y2jkuIvpnaLliJnkuLogdG91Y2jnmoTpm4blkIjvvIzlj6rmmK/ov5nkuKp0b3VjaOiiq+a3u+WKoOS6huWvueW6lOeahHjvvIx5XG4gICAgLy/lvZPliY3mv4DmtLvnmoTngrnlr7nlupTnmoRvYmrvvIzlnKh0b3VjaOS4i+WPr+S7peaYr+S4quaVsOe7hCzlkozkuIrpnaLnmoQgY3VyUG9pbnRzIOWvueW6lFxuICAgIHRoaXMuY3VyUG9pbnRzVGFyZ2V0ID0gW107XG5cbiAgICB0aGlzLl90b3VjaGluZyA9IGZhbHNlO1xuICAgIC8v5q2j5Zyo5ouW5Yqo77yM5YmN5o+Q5pivX3RvdWNoaW5nPXRydWVcbiAgICB0aGlzLl9kcmFnaW5nID0gZmFsc2U7XG5cbiAgICAvL+W9k+WJjeeahOm8oOagh+eKtuaAgVxuICAgIHRoaXMuX2N1cnNvciA9IFwiZGVmYXVsdFwiO1xuXG4gICAgdGhpcy50YXJnZXQgPSB0aGlzLmNhbnZheC52aWV3O1xuICAgIHRoaXMudHlwZXMgPSBbXTtcblxuICAgIC8vbW91c2XkvZPnu5/kuK3kuI3pnIDopoHphY3nva5kcmFnLHRvdWNo5Lit5Lya55So5Yiw56ys5LiJ5pa555qEdG91Y2jlupPvvIzmr4/kuKrlupPnmoTkuovku7blkI3np7Dlj6/og73kuI3kuIDmoLfvvIxcbiAgICAvL+Wwseimgei/memHjOmFjee9ru+8jOm7mOiupOWunueOsOeahOaYr2hhbW1lcmpz55qELOaJgOS7pem7mOiupOWPr+S7peWcqOmhueebrumHjOW8leWFpWhhbW1lcmpzIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gICAgdGhpcy5kcmFnID0ge1xuICAgICAgICBzdGFydCA6IFwicGFuc3RhcnRcIixcbiAgICAgICAgbW92ZSA6IFwicGFubW92ZVwiLFxuICAgICAgICBlbmQgOiBcInBhbmVuZFwiXG4gICAgfTtcblxuICAgIF8uZXh0ZW5kKCB0cnVlICwgdGhpcyAsIG9wdCApO1xuXG59O1xuXG4vL+i/meagt+eahOWlveWkhOaYr2RvY3VtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9u5Y+q5Lya5Zyo5a6a5LmJ55qE5pe25YCZ5omn6KGM5LiA5qyh44CCXG52YXIgY29udGFpbnMgPSBkb2N1bWVudC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiA/IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhIShwYXJlbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb24oY2hpbGQpICYgMTYpO1xufSA6IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZCAhPT0gY2hpbGQgJiYgKHBhcmVudC5jb250YWlucyA/IHBhcmVudC5jb250YWlucyhjaGlsZCkgOiB0cnVlKTtcbn07XG5cbkV2ZW50SGFuZGxlci5wcm90b3R5cGUgPSB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICAvL+S+neasoea3u+WKoOS4iua1j+iniOWZqOeahOiHquW4puS6i+S7tuS+puWQrFxuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAvL+WmguaenHRhcmdldC5ub2RlVHlwZeayoeacieeahOivne+8jCDor7TmmI7or6V0YXJnZXTkuLrkuIDkuKpqUXVlcnnlr7nosaEgb3Iga2lzc3kg5a+56LGhb3IgaGFtbWVy5a+56LGhXG4gICAgICAgICAgICAvL+WNs+S4uuesrOS4ieaWueW6k++8jOmCo+S5iOWwseimgeWvueaOpeesrOS4ieaWueW6k+eahOS6i+S7tuezu+e7n+OAgum7mOiupOWunueOsGhhbW1lcueahOWkp+mDqOWIhuS6i+S7tuezu+e7n1xuICAgICAgICAgICAgaWYoICFtZS50eXBlcyB8fCBtZS50eXBlcy5sZW5ndGggPT0gMCAgKXtcbiAgICAgICAgICAgICAgICBtZS50eXBlcyA9IF9oYW1tZXJFdmVudFR5cGVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gMSApe1xuICAgICAgICAgICAgbWUudHlwZXMgPSBfbW91c2VFdmVudFR5cGVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIF8uZWFjaCggbWUudHlwZXMgLCBmdW5jdGlvbiggdHlwZSApe1xuICAgICAgICAgICAgLy/kuI3lho3lhbPlv4PmtY/op4jlmajnjq/looPmmK/lkKYgJ29udG91Y2hzdGFydCcgaW4gd2luZG93IFxuICAgICAgICAgICAgLy/ogIzmmK/nm7TmjqXlj6rnrqHkvKDnu5nkuovku7bmqKHlnZfnmoTmmK/kuIDkuKrljp/nlJ9kb23ov5jmmK8ganHlr7nosaEgb3IgaGFtbWVy5a+56LGh562JXG4gICAgICAgICAgICBpZiggbWUudGFyZ2V0Lm5vZGVUeXBlID09IDEgKXtcbiAgICAgICAgICAgICAgICAkLmFkZEV2ZW50KCBtZS50YXJnZXQgLCB0eXBlICwgZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgbWUuX19tb3VzZUhhbmRsZXIoIGUgKTtcbiAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLnRhcmdldC5vbiggdHlwZSAsIGZ1bmN0aW9uKCBlICl7XG4gICAgICAgICAgICAgICAgICAgIG1lLl9fbGliSGFuZGxlciggZSApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSApO1xuICAgIH0sXG4gICAgLypcbiAgICAqIOWOn+eUn+S6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWJlZ2luXG4gICAgKiDpvKDmoIfkuovku7blpITnkIblh73mlbBcbiAgICAqKi9cbiAgICBfX21vdXNlSGFuZGxlciA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG5cbiAgICAgICAgcm9vdC51cGRhdGVWaWV3T2Zmc2V0KCk7XG4gICAgXG4gICAgICAgIG1lLmN1clBvaW50cyA9IFsgbmV3IFBvaW50KCBcbiAgICAgICAgICAgICQucGFnZVgoIGUgKSAtIHJvb3Qudmlld09mZnNldC5sZWZ0ICwgXG4gICAgICAgICAgICAkLnBhZ2VZKCBlICkgLSByb290LnZpZXdPZmZzZXQudG9wXG4gICAgICAgICldO1xuXG4gICAgICAgIC8v55CG6K665LiK5p2l6K+077yM6L+Z6YeM5ou/5YiwcG9pbnTkuoblkI7vvIzlsLHopoHorqHnrpfov5nkuKpwb2ludOWvueW6lOeahHRhcmdldOadpXB1c2jliLBjdXJQb2ludHNUYXJnZXTph4zvvIxcbiAgICAgICAgLy/kvYbmmK/lm6DkuLrlnKhkcmFn55qE5pe25YCZ5YW25a6e5piv5Y+v5Lul5LiN55So6K6h566X5a+55bqUdGFyZ2V055qE44CCXG4gICAgICAgIC8v5omA5Lul5pS+5Zyo5LqG5LiL6Z2i55qEbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoIGUgLCBjdXJNb3VzZVBvaW50ICk75bi46KeEbW91c2Vtb3Zl5Lit5omn6KGMXG5cbiAgICAgICAgdmFyIGN1ck1vdXNlUG9pbnQgID0gbWUuY3VyUG9pbnRzWzBdOyBcbiAgICAgICAgdmFyIGN1ck1vdXNlVGFyZ2V0ID0gbWUuY3VyUG9pbnRzVGFyZ2V0WzBdO1xuXG4gICAgICAgIC8v5qih5oufZHJhZyxtb3VzZW92ZXIsbW91c2VvdXQg6YOo5YiG5Luj56CBIGJlZ2luLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vbW91c2Vkb3du55qE5pe25YCZIOWmguaenCBjdXJNb3VzZVRhcmdldC5kcmFnRW5hYmxlZCDkuLp0cnVl44CC5bCx6KaB5byA5aeL5YeG5aSHZHJhZ+S6hlxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2Vkb3duXCIgKXtcbiAgICAgICAgICAgLy/lpoLmnpxjdXJUYXJnZXQg55qE5pWw57uE5Li656m65oiW6ICF56ys5LiA5Liq5Li6ZmFsc2Ug77yM77yM77yMXG4gICAgICAgICAgIGlmKCAhY3VyTW91c2VUYXJnZXQgKXtcbiAgICAgICAgICAgICB2YXIgb2JqID0gcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggY3VyTW91c2VQb2ludCAsIDEpWzBdO1xuICAgICAgICAgICAgIGlmKG9iail7XG4gICAgICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXQgPSBbIG9iaiBdO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfTtcbiAgICAgICAgICAgY3VyTW91c2VUYXJnZXQgPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG4gICAgICAgICAgIGlmICggY3VyTW91c2VUYXJnZXQgJiYgY3VyTW91c2VUYXJnZXQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgIC8v6byg5qCH5LqL5Lu25bey57uP5pG45Yiw5LqG5LiA5LiqXG4gICAgICAgICAgICAgICBtZS5fdG91Y2hpbmcgPSB0cnVlO1xuICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZXVwXCIgfHwgKGUudHlwZSA9PSBcIm1vdXNlb3V0XCIgJiYgIWNvbnRhaW5zKHJvb3QudmlldyAsIChlLnRvRWxlbWVudCB8fCBlLnJlbGF0ZWRUYXJnZXQpICkpICl7XG4gICAgICAgICAgICBpZihtZS5fZHJhZ2luZyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuWImuWImuWcqOaLluWKqFxuICAgICAgICAgICAgICAgIG1lLl9kcmFnRW5kKCBlICwgY3VyTW91c2VUYXJnZXQgLCAwICk7XG4gICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuZmlyZShcImRyYWdlbmRcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX2RyYWdpbmcgID0gZmFsc2U7XG4gICAgICAgICAgICBtZS5fdG91Y2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2VvdXRcIiApe1xuICAgICAgICAgICAgaWYoICFjb250YWlucyhyb290LnZpZXcgLCAoZS50b0VsZW1lbnQgfHwgZS5yZWxhdGVkVGFyZ2V0KSApICl7XG4gICAgICAgICAgICAgICAgbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoZSAsIGN1ck1vdXNlUG9pbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICl7ICAvL3x8IGUudHlwZSA9PSBcIm1vdXNlZG93blwiICl7XG4gICAgICAgICAgICAvL+aLluWKqOi/h+eoi+S4reWwseS4jeWcqOWBmuWFtuS7lueahG1vdXNlb3ZlcuajgOa1i++8jGRyYWfkvJjlhYhcbiAgICAgICAgICAgIGlmKG1lLl90b3VjaGluZyAmJiBlLnR5cGUgPT0gXCJtb3VzZW1vdmVcIiAmJiBjdXJNb3VzZVRhcmdldCl7XG4gICAgICAgICAgICAgICAgLy/or7TmmI7mraPlnKjmi5bliqjllYpcbiAgICAgICAgICAgICAgICBpZighbWUuX2RyYWdpbmcpe1xuICAgICAgICAgICAgICAgICAgICAvL2JlZ2luIGRyYWdcbiAgICAgICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuZmlyZShcImRyYWdzdGFydFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lhYjmiormnKzlsIrnu5npmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIC8v54S25ZCO5YWL6ZqG5LiA5Liq5Ymv5pys5YiwYWN0aXZlU3RhZ2VcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9uZU9iamVjdCA9IG1lLl9jbG9uZTJob3ZlclN0YWdlKCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVPYmplY3QuY29udGV4dC5nbG9iYWxBbHBoYSA9IGN1ck1vdXNlVGFyZ2V0Ll9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2RyYWcgbW92ZSBpbmdcbiAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdNb3ZlSGFuZGVyKCBlICwgY3VyTW91c2VUYXJnZXQgLCAwICk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtZS5fZHJhZ2luZyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8v5bi46KeEbW91c2Vtb3Zl5qOA5rWLXG4gICAgICAgICAgICAgICAgLy9tb3Zl5LqL5Lu25Lit77yM6ZyA6KaB5LiN5YGc55qE5pCc57SidGFyZ2V077yM6L+Z5Liq5byA6ZSA5oy65aSn77yMXG4gICAgICAgICAgICAgICAgLy/lkI7nu63lj6/ku6XkvJjljJbvvIzliqDkuIrlkozluKfnjofnm7jlvZPnmoTlu7bov5/lpITnkIZcbiAgICAgICAgICAgICAgICBtZS5fX2dldGN1clBvaW50c1RhcmdldCggZSAsIGN1ck1vdXNlUG9pbnQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/lhbbku5bnmoTkuovku7blsLHnm7TmjqXlnKh0YXJnZXTkuIrpnaLmtL7lj5Hkuovku7ZcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGN1ck1vdXNlVGFyZ2V0O1xuICAgICAgICAgICAgaWYoICFjaGlsZCApe1xuICAgICAgICAgICAgICAgIGNoaWxkID0gcm9vdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIFsgY2hpbGQgXSApO1xuICAgICAgICAgICAgbWUuX2N1cnNvckhhbmRlciggY2hpbGQgKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggcm9vdC5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgICAgIC8v6Zi75q2i6buY6K6k5rWP6KeI5Zmo5Yqo5L2cKFczQykgXG4gICAgICAgICAgICBpZiAoIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgICAgICAgIMKgZS5wcmV2ZW50RGVmYXVsdCgpOyBcbiAgICAgICAgICAgIH3CoGVsc2Uge1xuICAgICAgICAgICAgwqDCoMKgwqB3aW5kb3cuZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTsgXG4gICAgfSxcbiAgICBfX2dldGN1clBvaW50c1RhcmdldCA6IGZ1bmN0aW9uKGUgLCBwb2ludCApIHtcbiAgICAgICAgdmFyIG1lICAgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ICAgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBvbGRPYmogPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG5cbiAgICAgICAgaWYoIG9sZE9iaiAmJiAhb2xkT2JqLmNvbnRleHQgKXtcbiAgICAgICAgICAgIG9sZE9iaiA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGUgPSBuZXcgQ2FudmF4RXZlbnQoIGUgKTtcblxuICAgICAgICBpZiggZS50eXBlPT1cIm1vdXNlbW92ZVwiXG4gICAgICAgICAgICAmJiBvbGRPYmogJiYgb2xkT2JqLl9ob3ZlckNsYXNzICYmIG9sZE9iai5wb2ludENoa1ByaW9yaXR5XG4gICAgICAgICAgICAmJiBvbGRPYmouZ2V0Q2hpbGRJblBvaW50KCBwb2ludCApICl7XG4gICAgICAgICAgICAvL+Wwj+S8mOWMlizpvKDmoIdtb3Zl55qE5pe25YCZ44CC6K6h566X6aKR546H5aSq5aSn77yM5omA5Lul44CC5YGa5q2k5LyY5YyWXG4gICAgICAgICAgICAvL+WmguaenOaciXRhcmdldOWtmOWcqO+8jOiAjOS4lOW9k+WJjeWFg+e0oOato+WcqGhvdmVyU3RhZ2XkuK3vvIzogIzkuJTlvZPliY3pvKDmoIfov5jlnKh0YXJnZXTlhoUs5bCx5rKh5b+F6KaB5Y+W5qOA5rWL5pW05LiqZGlzcGxheUxpc3TkuoZcbiAgICAgICAgICAgIC8v5byA5Y+R5rS+5Y+R5bi46KeEbW91c2Vtb3Zl5LqL5Lu2XG4gICAgICAgICAgICBlLnRhcmdldCA9IGUuY3VycmVudFRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUucG9pbnQgID0gb2xkT2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb2JqID0gcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggcG9pbnQgLCAxKVswXTtcblxuICAgICAgICBpZihvbGRPYmogJiYgb2xkT2JqICE9IG9iaiB8fCBlLnR5cGU9PVwibW91c2VvdXRcIikge1xuICAgICAgICAgICAgaWYoIG9sZE9iaiAmJiBvbGRPYmouY29udGV4dCApe1xuICAgICAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldFswXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZS50eXBlICAgICA9IFwibW91c2VvdXRcIjtcbiAgICAgICAgICAgICAgICBlLnRvVGFyZ2V0ID0gb2JqOyBcbiAgICAgICAgICAgICAgICBlLnRhcmdldCAgID0gZS5jdXJyZW50VGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgICAgIGUucG9pbnQgICAgPSBvbGRPYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBvYmogJiYgb2xkT2JqICE9IG9iaiApeyAvLyYmIG9iai5faG92ZXJhYmxlIOW3sue7jyDlubLmjonkuoZcbiAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldFswXSA9IG9iajtcbiAgICAgICAgICAgIGUudHlwZSAgICAgICA9IFwibW91c2VvdmVyXCI7XG4gICAgICAgICAgICBlLmZyb21UYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICBlLnRhcmdldCAgICAgPSBlLmN1cnJlbnRUYXJnZXQgPSBvYmo7XG4gICAgICAgICAgICBlLnBvaW50ICAgICAgPSBvYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICYmIG9iaiApe1xuICAgICAgICAgICAgZS50YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICBlLnBvaW50ICA9IG9sZE9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgb2xkT2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWUuX2N1cnNvckhhbmRlciggb2JqICwgb2xkT2JqICk7XG4gICAgfSxcbiAgICBfY3Vyc29ySGFuZGVyICAgIDogZnVuY3Rpb24oIG9iaiAsIG9sZE9iaiApe1xuICAgICAgICBpZighb2JqICYmICFvbGRPYmogKXtcbiAgICAgICAgICAgIHRoaXMuX3NldEN1cnNvcihcImRlZmF1bHRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYob2JqICYmIG9sZE9iaiAhPSBvYmogJiYgb2JqLmNvbnRleHQpe1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yKG9iai5jb250ZXh0LmN1cnNvcik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9zZXRDdXJzb3IgOiBmdW5jdGlvbihjdXJzb3IpIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yID09IGN1cnNvcil7XG4gICAgICAgICAgLy/lpoLmnpzkuKTmrKHopoHorr7nva7nmoTpvKDmoIfnirbmgIHmmK/kuIDmoLfnmoRcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmF4LnZpZXcuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xuICAgICAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgfSxcbiAgICAvKlxuICAgICog5Y6f55Sf5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZW5kXG4gICAgKi9cblxuICAgIC8qXG4gICAgICrnrKzkuInmlrnlupPnmoTkuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICAq6Kem5bGP5LqL5Lu25aSE55CG5Ye95pWwXG4gICAgICogKi9cbiAgICBfX2xpYkhhbmRsZXIgOiBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgdmFyIG1lICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgcm9vdC51cGRhdGVWaWV3T2Zmc2V0KCk7XG4gICAgICAgIC8vIHRvdWNoIOS4i+eahCBjdXJQb2ludHNUYXJnZXQg5LuOdG91Y2hlc+S4readpVxuICAgICAgICAvL+iOt+WPlmNhbnZheOWdkOagh+ezu+e7n+mHjOmdoueahOWdkOagh1xuICAgICAgICBtZS5jdXJQb2ludHMgPSBtZS5fX2dldENhbnZheFBvaW50SW5Ub3VjaHMoIGUgKTtcbiAgICAgICAgaWYoICFtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgLy/lpoLmnpzlnKhkcmFnaW5n55qE6K+d77yMdGFyZ2V05bey57uP5piv6YCJ5Lit5LqG55qE77yM5Y+v5Lul5LiN55SoIOajgOa1i+S6hlxuICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0ID0gbWUuX19nZXRDaGlsZEluVG91Y2hzKCBtZS5jdXJQb2ludHMgKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIG1lLmN1clBvaW50c1RhcmdldC5sZW5ndGggPiAwICl7XG4gICAgICAgICAgICAvL2RyYWflvIDlp4tcbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5zdGFydCl7XG4gICAgICAgICAgICAgICAgLy9kcmFnc3RhcnTnmoTml7blgJl0b3VjaOW3sue7j+WHhuWkh+WlveS6hnRhcmdldO+8jCBjdXJQb2ludHNUYXJnZXQg6YeM6Z2i5Y+q6KaB5pyJ5LiA5Liq5piv5pyJ5pWI55qEXG4gICAgICAgICAgICAgICAgLy/lsLHorqTkuLpkcmFnc+W8gOWni1xuICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQgJiYgY2hpbGQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/lj6ropoHmnInkuIDkuKrlhYPntKDlsLHorqTkuLrmraPlnKjlh4blpIdkcmFn5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7lhYvpmobkuIDkuKrlia/mnKzliLBhY3RpdmVTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgICBtZS5fY2xvbmUyaG92ZXJTdGFnZSggY2hpbGQgLCBpICk7XG4gICAgICAgICAgICAgICAgICAgICAgIC8v5YWI5oqK5pys5bCK57uZ6ZqQ6JeP5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmZpcmUoXCJkcmFnc3RhcnRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApIFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9kcmFnSW5nXG4gICAgICAgICAgICBpZiggZS50eXBlID09IG1lLmRyYWcubW92ZSl7XG4gICAgICAgICAgICAgICAgaWYoIG1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkICYmIGNoaWxkLmRyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ01vdmVIYW5kZXIoIGUgLCBjaGlsZCAsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2RyYWfnu5PmnZ9cbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5lbmQpe1xuICAgICAgICAgICAgICAgIGlmKCBtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goIG1lLmN1clBvaW50c1RhcmdldCAsIGZ1bmN0aW9uKCBjaGlsZCAsIGkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZCAmJiBjaGlsZC5kcmFnRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnRW5kKCBlICwgY2hpbGQgLCAwICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZmlyZShcImRyYWdlbmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMoIGUgLCBtZS5jdXJQb2ludHNUYXJnZXQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5b2T5YmN5rKh5pyJ5LiA5LiqdGFyZ2V077yM5bCx5oqK5LqL5Lu25rS+5Y+R5YiwY2FudmF45LiK6Z2iXG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIFsgcm9vdCBdICk7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvL+S7jnRvdWNoc+S4reiOt+WPluWIsOWvueW6lHRvdWNoICwg5Zyo5LiK6Z2i5re75Yqg5LiKY2FudmF45Z2Q5qCH57O757uf55qEeO+8jHlcbiAgICBfX2dldENhbnZheFBvaW50SW5Ub3VjaHMgOiBmdW5jdGlvbiggZSApe1xuICAgICAgICB2YXIgbWUgICAgICAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgICAgICA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIGN1clRvdWNocyA9IFtdO1xuICAgICAgICBfLmVhY2goIGUucG9pbnQgLCBmdW5jdGlvbiggdG91Y2ggKXtcbiAgICAgICAgICAgY3VyVG91Y2hzLnB1c2goIHtcbiAgICAgICAgICAgICAgIHggOiBDYW52YXhFdmVudC5wYWdlWCggdG91Y2ggKSAtIHJvb3Qudmlld09mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgeSA6IENhbnZheEV2ZW50LnBhZ2VZKCB0b3VjaCApIC0gcm9vdC52aWV3T2Zmc2V0LnRvcFxuICAgICAgICAgICB9ICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY3VyVG91Y2hzO1xuICAgIH0sXG4gICAgX19nZXRDaGlsZEluVG91Y2hzIDogZnVuY3Rpb24oIHRvdWNocyApe1xuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgdG91Y2hlc1RhcmdldCA9IFtdO1xuICAgICAgICBfLmVhY2goIHRvdWNocyAsIGZ1bmN0aW9uKHRvdWNoKXtcbiAgICAgICAgICAgIHRvdWNoZXNUYXJnZXQucHVzaCggcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggdG91Y2ggLCAxKVswXSApO1xuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybiB0b3VjaGVzVGFyZ2V0O1xuICAgIH0sXG4gICAgLypcbiAgICAq56ys5LiJ5pa55bqT55qE5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYmVnaW5cbiAgICAqL1xuXG5cbiAgICAvKlxuICAgICAqQHBhcmFtIHthcnJheX0gY2hpbGRzIFxuICAgICAqICovXG4gICAgX19kaXNwYXRjaEV2ZW50SW5DaGlsZHM6IGZ1bmN0aW9uKGUsIGNoaWxkcykge1xuICAgICAgICBpZiAoIWNoaWxkcyAmJiAhKFwibGVuZ3RoXCIgaW4gY2hpbGRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciBoYXNDaGlsZCA9IGZhbHNlO1xuICAgICAgICBfLmVhY2goY2hpbGRzLCBmdW5jdGlvbihjaGlsZCwgaSkge1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgaGFzQ2hpbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBjZSA9IG5ldyBDYW52YXhFdmVudChlKTtcbiAgICAgICAgICAgICAgICBjZS50YXJnZXQgPSBjZS5jdXJyZW50VGFyZ2V0ID0gY2hpbGQgfHwgdGhpcztcbiAgICAgICAgICAgICAgICBjZS5zdGFnZVBvaW50ID0gbWUuY3VyUG9pbnRzW2ldO1xuICAgICAgICAgICAgICAgIGNlLnBvaW50ID0gY2UudGFyZ2V0Lmdsb2JhbFRvTG9jYWwoY2Uuc3RhZ2VQb2ludCk7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGlzcGF0Y2hFdmVudChjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaGFzQ2hpbGQ7XG4gICAgfSxcbiAgICAvL+WFi+mahuS4gOS4quWFg+e0oOWIsGhvdmVyIHN0YWdl5Lit5Y67XG4gICAgX2Nsb25lMmhvdmVyU3RhZ2U6IGZ1bmN0aW9uKHRhcmdldCwgaSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIF9kcmFnRHVwbGljYXRlID0gcm9vdC5fYnVmZmVyU3RhZ2UuZ2V0Q2hpbGRCeUlkKHRhcmdldC5pZCk7XG4gICAgICAgIGlmICghX2RyYWdEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgIF9kcmFnRHVwbGljYXRlID0gdGFyZ2V0LmNsb25lKHRydWUpO1xuICAgICAgICAgICAgX2RyYWdEdXBsaWNhdGUuX3RyYW5zZm9ybSA9IHRhcmdldC5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlRPRE86IOWboOS4uuWQjue7reWPr+iDveS8muacieaJi+WKqOa3u+WKoOeahCDlhYPntKDliLBfYnVmZmVyU3RhZ2Ug6YeM6Z2i5p2lXG4gICAgICAgICAgICAgKuavlOWmgnRpcHNcbiAgICAgICAgICAgICAq6L+Z57G75omL5Yqo5re75Yqg6L+b5p2l55qE6IKv5a6a5piv5Zug5Li66ZyA6KaB5pi+56S65Zyo5pyA5aSW5bGC55qE44CC5ZyoaG92ZXLlhYPntKDkuYvkuIrjgIJcbiAgICAgICAgICAgICAq5omA5pyJ6Ieq5Yqo5re75Yqg55qEaG92ZXLlhYPntKDpg73pu5jorqTmt7vliqDlnKhfYnVmZmVyU3RhZ2XnmoTmnIDlupXlsYJcbiAgICAgICAgICAgICAqKi9cbiAgICAgICAgICAgIHJvb3QuX2J1ZmZlclN0YWdlLmFkZENoaWxkQXQoX2RyYWdEdXBsaWNhdGUsIDApO1xuICAgICAgICB9XG4gICAgICAgIF9kcmFnRHVwbGljYXRlLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0YXJnZXQuX2dsb2JhbEFscGhhO1xuICAgICAgICB0YXJnZXQuX2RyYWdQb2ludCA9IHRhcmdldC5nbG9iYWxUb0xvY2FsKG1lLmN1clBvaW50c1tpXSk7XG4gICAgICAgIHJldHVybiBfZHJhZ0R1cGxpY2F0ZTtcbiAgICB9LFxuICAgIC8vZHJhZyDkuK0g55qE5aSE55CG5Ye95pWwXG4gICAgX2RyYWdNb3ZlSGFuZGVyOiBmdW5jdGlvbihlLCB0YXJnZXQsIGkpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBfcG9pbnQgPSB0YXJnZXQuZ2xvYmFsVG9Mb2NhbCggbWUuY3VyUG9pbnRzW2ldICk7XG5cbiAgICAgICAgLy/opoHlr7nlupTnmoTkv67mlLnmnKzlsIrnmoTkvY3nva7vvIzkvYbmmK/opoHlkYror4nlvJXmk47kuI3opoF3YXRjaOi/meS4quaXtuWAmeeahOWPmOWMllxuICAgICAgICB0YXJnZXQuX25vdFdhdGNoID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9tb3ZlU3RhZ2UgPSB0YXJnZXQubW92ZWluZztcbiAgICAgICAgdGFyZ2V0Lm1vdmVpbmcgPSB0cnVlO1xuICAgICAgICB0YXJnZXQuY29udGV4dC54ICs9IChfcG9pbnQueCAtIHRhcmdldC5fZHJhZ1BvaW50LngpO1xuICAgICAgICB0YXJnZXQuY29udGV4dC55ICs9IChfcG9pbnQueSAtIHRhcmdldC5fZHJhZ1BvaW50LnkpO1xuICAgICAgICB0YXJnZXQuZmlyZShcImRyYWdtb3ZlXCIpO1xuICAgICAgICB0YXJnZXQubW92ZWluZyA9IF9tb3ZlU3RhZ2U7XG4gICAgICAgIHRhcmdldC5fbm90V2F0Y2ggPSBmYWxzZTtcbiAgICAgICAgLy/lkIzmraXlrozmr5XmnKzlsIrnmoTkvY3nva5cblxuICAgICAgICAvL+i/memHjOWPquiDveebtOaOpeS/ruaUuV90cmFuc2Zvcm0g44CCIOS4jeiDveeUqOS4i+mdoueahOS/ruaUuXjvvIx555qE5pa55byP44CCXG4gICAgICAgIHZhciBfZHJhZ0R1cGxpY2F0ZSA9IHJvb3QuX2J1ZmZlclN0YWdlLmdldENoaWxkQnlJZCh0YXJnZXQuaWQpO1xuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5fdHJhbnNmb3JtID0gdGFyZ2V0LmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuICAgICAgICAvL+S7peS4uuebtOaOpeS/ruaUueeahF90cmFuc2Zvcm3kuI3kvJrlh7rlj5Hlv4Pot7PkuIrmiqXvvIwg5riy5p+T5byV5pOO5LiN5Yi25Yqo6L+Z5Liqc3RhZ2XpnIDopoHnu5jliLbjgIJcbiAgICAgICAgLy/miYDku6XopoHmiYvliqjlh7rlj5Hlv4Pot7PljIVcbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuaGVhcnRCZWF0KCk7XG4gICAgfSxcbiAgICAvL2RyYWfnu5PmnZ/nmoTlpITnkIblh73mlbBcbiAgICBfZHJhZ0VuZDogZnVuY3Rpb24oZSwgdGFyZ2V0LCBpKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuXG4gICAgICAgIC8vX2RyYWdEdXBsaWNhdGUg5aSN5Yi25ZyoX2J1ZmZlclN0YWdlIOS4reeahOWJr+acrFxuICAgICAgICB2YXIgX2RyYWdEdXBsaWNhdGUgPSByb290Ll9idWZmZXJTdGFnZS5nZXRDaGlsZEJ5SWQodGFyZ2V0LmlkKTtcbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuZGVzdHJveSgpO1xuXG4gICAgICAgIHRhcmdldC5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGFyZ2V0Ll9nbG9iYWxBbHBoYTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS6i+S7tueuoeeQhuexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOaehOmAoOWHveaVsC5cbiAqIEBuYW1lIEV2ZW50RGlzcGF0Y2hlclxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlcuexu+aYr+WPr+iwg+W6puS6i+S7tueahOexu+eahOWfuuexu++8jOWug+WFgeiuuOaYvuekuuWIl+ihqOS4iueahOS7u+S9leWvueixoemDveaYr+S4gOS4quS6i+S7tuebruagh+OAglxuICovXG52YXIgRXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgLy/kuovku7bmmKDlsITooajvvIzmoLzlvI/kuLrvvJp7dHlwZTE6W2xpc3RlbmVyMSwgbGlzdGVuZXIyXSwgdHlwZTI6W2xpc3RlbmVyMywgbGlzdGVuZXI0XX1cbiAgICB0aGlzLl9ldmVudE1hcCA9IHt9O1xufTtcblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZSA9IHsgXG4gICAgLypcbiAgICAgKiDms6jlhozkuovku7bkvqblkKzlmajlr7nosaHvvIzku6Xkvb/kvqblkKzlmajog73lpJ/mjqXmlLbkuovku7bpgJrnn6XjgIJcbiAgICAgKi9cbiAgICBfYWRkRXZlbnRMaXN0ZW5lciA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG5cbiAgICAgICAgaWYoIHR5cGVvZiBsaXN0ZW5lciAhPSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgICAgICAvL2xpc3RlbmVy5b+F6aG75piv5LiqZnVuY3Rpb27lkZDkurJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFkZFJlc3VsdCA9IHRydWU7XG4gICAgICAgIHZhciBzZWxmICAgICAgPSB0aGlzO1xuICAgICAgICBfLmVhY2goIHR5cGUuc3BsaXQoXCIgXCIpICwgZnVuY3Rpb24odHlwZSl7XG4gICAgICAgICAgICB2YXIgbWFwID0gc2VsZi5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgICAgICBpZighbWFwKXtcbiAgICAgICAgICAgICAgICBtYXAgPSBzZWxmLl9ldmVudE1hcFt0eXBlXSA9IFtdO1xuICAgICAgICAgICAgICAgIG1hcC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfLmluZGV4T2YobWFwICxsaXN0ZW5lcikgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBtYXAucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWRkUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYWRkUmVzdWx0O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXIgOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpIHJldHVybiB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUodHlwZSk7XG5cbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuICAgICAgICBpZighbWFwKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaSA9IG1hcFtpXTtcbiAgICAgICAgICAgIGlmKGxpID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIG1hcC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYobWFwLmxlbmd0aCAgICA9PSAwKSB7IFxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c6L+Z5Liq5aaC5p6c6L+Z5Liq5pe25YCZY2hpbGTmsqHmnInku7vkvZXkuovku7bkvqblkKxcbiAgICAgICAgICAgICAgICAgICAgaWYoXy5pc0VtcHR5KHRoaXMuX2V2ZW50TWFwKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOS4jeWGjeaOpeWPl+S6i+S7tueahOajgOa1i1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIoOmZpOaMh+Wumuexu+Wei+eahOaJgOacieS6i+S7tuS+puWQrOWZqOOAglxuICAgICAqL1xuICAgIF9yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlIDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIGlmKCFtYXApIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcblxuICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrlpoLmnpzov5nkuKrml7blgJljaGlsZOayoeacieS7u+S9leS6i+S7tuS+puWQrFxuICAgICAgICAgICAgaWYoXy5pc0VtcHR5KHRoaXMuX2V2ZW50TWFwKSl7XG4gICAgICAgICAgICAgICAgLy/pgqPkuYjor6XlhYPntKDkuI3lho3mjqXlj5fkuovku7bnmoTmo4DmtYtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5omA5pyJ5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUFsbEV2ZW50TGlzdGVuZXJzIDogZnVuY3Rpb24oKSB7XHRcbiAgICAgICAgdGhpcy5fZXZlbnRNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAqIOa0vuWPkeS6i+S7tu+8jOiwg+eUqOS6i+S7tuS+puWQrOWZqOOAglxuICAgICovXG4gICAgX2Rpc3BhdGNoRXZlbnQgOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFtlLnR5cGVdO1xuICAgICAgICBcbiAgICAgICAgaWYoIG1hcCApe1xuICAgICAgICAgICAgaWYoIWUudGFyZ2V0KSBlLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBtYXAgPSBtYXAuc2xpY2UoKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IG1hcFtpXTtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YobGlzdGVuZXIpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCAhZS5fc3RvcFByb3BhZ2F0aW9uICkge1xuICAgICAgICAgICAgLy/lkJHkuIrlhpLms6FcbiAgICAgICAgICAgIGlmKCB0aGlzLnBhcmVudCApe1xuICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldCA9IHRoaXMucGFyZW50O1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Ll9kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICAgKiDmo4Dmn6XmmK/lkKbkuLrmjIflrprkuovku7bnsbvlnovms6jlhozkuobku7vkvZXkvqblkKzlmajjgIJcbiAgICAgICAqL1xuICAgIF9oYXNFdmVudExpc3RlbmVyIDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIHJldHVybiBtYXAgIT0gbnVsbCAmJiBtYXAubGVuZ3RoID4gMDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50TWFuYWdlcjtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS6i+S7tua0vuWPkeexu1xuICovXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuL0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IENhbnZheEV2ZW50IGZyb20gXCIuL0NhbnZheEV2ZW50XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG5cbnZhciBFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbigpe1xuICAgIEV2ZW50RGlzcGF0Y2hlci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbmFtZSk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKEV2ZW50RGlzcGF0Y2hlciAsIEV2ZW50TWFuYWdlciAsIHtcbiAgICBvbiA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFkZEV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdW4gOiBmdW5jdGlvbih0eXBlLGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlOmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlKCB0eXBlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVBbGxFdmVudExpc3RlbmVyczpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9yZW1vdmVBbGxFdmVudExpc3RlbmVycygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy9wYXJhbXMg6KaB5Lyg57uZZXZ055qEZXZlbnRoYW5kbGVy5aSE55CG5Ye95pWw55qE5Y+C5pWw77yM5Lya6KKrbWVyZ2XliLBDYW52YXggZXZlbnTkuK1cbiAgICBmaXJlIDogZnVuY3Rpb24oZXZlbnRUeXBlICwgcGFyYW1zKXtcbiAgICAgICAgdmFyIGUgPSBuZXcgQ2FudmF4RXZlbnQoIGV2ZW50VHlwZSApO1xuXG4gICAgICAgIGlmKCBwYXJhbXMgKXtcbiAgICAgICAgICAgIGZvciggdmFyIHAgaW4gcGFyYW1zICl7XG4gICAgICAgICAgICAgICAgaWYoIHAgaW4gZSApe1xuICAgICAgICAgICAgICAgICAgICAvL3BhcmFtc+S4reeahOaVsOaNruS4jeiDveimhueblmV2ZW505bGe5oCnXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBwICsgXCLlsZ7mgKfkuI3og73opobnm5ZDYW52YXhFdmVudOWxnuaAp1wiIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlW3BdID0gcGFyYW1zW3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICBfLmVhY2goIGV2ZW50VHlwZS5zcGxpdChcIiBcIikgLCBmdW5jdGlvbihlVHlwZSl7XG4gICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQgPSBtZTtcbiAgICAgICAgICAgIG1lLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfSApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGRpc3BhdGNoRXZlbnQ6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAvL3RoaXMgaW5zdGFuY2VvZiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID09PiB0aGlzLmNoaWxkcmVuXG4gICAgICAgIC8vVE9ETzog6L+Z6YeMaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIg55qE6K+d77yM5ZyoZGlzcGxheU9iamVjdOmHjOmdoueahGltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4uL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuICAgICAgICAvL+S8muW+l+WIsOS4gOS4qnVuZGVmaW5lZO+8jOaEn+inieaYr+aIkOS6huS4gOS4quW+queOr+S+nei1lueahOmXrumimO+8jOaJgOS7pei/memHjOaNoueUqOeugOWNleeahOWIpOaWreadpeWIpOaWreiHquW3seaYr+S4gOS4quWuueaYk++8jOaLpeaciWNoaWxkcmVuXG4gICAgICAgIGlmKCB0aGlzLmNoaWxkcmVuICAmJiBldmVudC5wb2ludCApe1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIGV2ZW50LnBvaW50ICwgMSlbMF07XG4gICAgICAgICAgICBpZiggdGFyZ2V0ICl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmNvbnRleHQgJiYgZXZlbnQudHlwZSA9PSBcIm1vdXNlb3ZlclwiKXtcbiAgICAgICAgICAgIC8v6K6w5b2VZGlzcGF0Y2hFdmVudOS5i+WJjeeahOW/g+i3s1xuICAgICAgICAgICAgdmFyIHByZUhlYXJ0QmVhdCA9IHRoaXMuX2hlYXJ0QmVhdE51bTtcbiAgICAgICAgICAgIHZhciBwcmVnQWxwaGEgICAgPSB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgICAgICAgICAgaWYoIHByZUhlYXJ0QmVhdCAhPSB0aGlzLl9oZWFydEJlYXROdW0gKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3ZlckNsYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5ob3ZlckNsb25lICl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW52YXggPSB0aGlzLmdldFN0YWdlKCkucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjmNsb25l5LiA5Lu9b2Jq77yM5re75Yqg5YiwX2J1ZmZlclN0YWdlIOS4rVxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZTaGFwZSA9IHRoaXMuY2xvbmUodHJ1ZSk7ICBcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZTaGFwZS5fdHJhbnNmb3JtID0gdGhpcy5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FudmF4Ll9idWZmZXJTdGFnZS5hZGRDaGlsZEF0KCBhY3RpdlNoYXBlICwgMCApOyBcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7mioroh6rlt7HpmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2xvYmFsQWxwaGEgPSBwcmVnQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG5cbiAgICAgICAgaWYoIHRoaXMuY29udGV4dCAmJiBldmVudC50eXBlID09IFwibW91c2VvdXRcIil7XG4gICAgICAgICAgICBpZih0aGlzLl9ob3ZlckNsYXNzKXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuWImuWImm92ZXLnmoTml7blgJnmnInmt7vliqDmoLflvI9cbiAgICAgICAgICAgICAgICB2YXIgY2FudmF4ID0gdGhpcy5nZXRTdGFnZSgpLnBhcmVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3ZlckNsYXNzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBjYW52YXguX2J1ZmZlclN0YWdlLnJlbW92ZUNoaWxkQnlJZCh0aGlzLmlkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5fZ2xvYmFsQWxwaGEgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5fZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhhc0V2ZW50OmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzRXZlbnRMaXN0ZW5lcih0eXBlKTtcbiAgICB9LFxuICAgIGhhc0V2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgIH0sXG4gICAgaG92ZXIgOiBmdW5jdGlvbiggb3ZlckZ1biAsIG91dEZ1biApe1xuICAgICAgICB0aGlzLm9uKFwibW91c2VvdmVyXCIgLCBvdmVyRnVuKTtcbiAgICAgICAgdGhpcy5vbihcIm1vdXNlb3V0XCIgICwgb3V0RnVuICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgb25jZSA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIG9uY2VIYW5kbGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkobWUgLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy51bih0eXBlICwgb25jZUhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub24odHlwZSAsIG9uY2VIYW5kbGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnREaXNwYXRjaGVyO1xuIiwiXG4vKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiBNYXRyaXgg55+p6Zi15bqTIOeUqOS6juaVtOS4quezu+e7n+eahOWHoOS9leWPmOaNouiuoeeul1xuICogY29kZSBmcm9tIGh0dHA6Ly9ldmFudy5naXRodWIuaW8vbGlnaHRnbC5qcy9kb2NzL21hdHJpeC5odG1sXG4gKi9cblxudmFyIE1hdHJpeCA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIHR4LCB0eSl7XG4gICAgdGhpcy5hID0gYSAhPSB1bmRlZmluZWQgPyBhIDogMTtcbiAgICB0aGlzLmIgPSBiICE9IHVuZGVmaW5lZCA/IGIgOiAwO1xuICAgIHRoaXMuYyA9IGMgIT0gdW5kZWZpbmVkID8gYyA6IDA7XG4gICAgdGhpcy5kID0gZCAhPSB1bmRlZmluZWQgPyBkIDogMTtcbiAgICB0aGlzLnR4ID0gdHggIT0gdW5kZWZpbmVkID8gdHggOiAwO1xuICAgIHRoaXMudHkgPSB0eSAhPSB1bmRlZmluZWQgPyB0eSA6IDA7XG59O1xuXG5NYXRyaXgucHJvdG90eXBlID0ge1xuICAgIGNvbmNhdCA6IGZ1bmN0aW9uKG10eCl7XG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIHR4ID0gdGhpcy50eDtcblxuICAgICAgICB0aGlzLmEgPSBhICogbXR4LmEgKyB0aGlzLmIgKiBtdHguYztcbiAgICAgICAgdGhpcy5iID0gYSAqIG10eC5iICsgdGhpcy5iICogbXR4LmQ7XG4gICAgICAgIHRoaXMuYyA9IGMgKiBtdHguYSArIHRoaXMuZCAqIG10eC5jO1xuICAgICAgICB0aGlzLmQgPSBjICogbXR4LmIgKyB0aGlzLmQgKiBtdHguZDtcbiAgICAgICAgdGhpcy50eCA9IHR4ICogbXR4LmEgKyB0aGlzLnR5ICogbXR4LmMgKyBtdHgudHg7XG4gICAgICAgIHRoaXMudHkgPSB0eCAqIG10eC5iICsgdGhpcy50eSAqIG10eC5kICsgbXR4LnR5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmNhdFRyYW5zZm9ybSA6IGZ1bmN0aW9uKHgsIHksIHNjYWxlWCwgc2NhbGVZLCByb3RhdGlvbil7XG4gICAgICAgIHZhciBjb3MgPSAxO1xuICAgICAgICB2YXIgc2luID0gMDtcbiAgICAgICAgaWYocm90YXRpb24lMzYwKXtcbiAgICAgICAgICAgIHZhciByID0gcm90YXRpb24gKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgICAgICAgY29zID0gTWF0aC5jb3Mocik7XG4gICAgICAgICAgICBzaW4gPSBNYXRoLnNpbihyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uY2F0KG5ldyBNYXRyaXgoY29zKnNjYWxlWCwgc2luKnNjYWxlWCwgLXNpbipzY2FsZVksIGNvcypzY2FsZVksIHgsIHkpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByb3RhdGUgOiBmdW5jdGlvbihhbmdsZSl7XG4gICAgICAgIC8v55uu5YmN5bey57uP5o+Q5L6b5a+56aG65pe26ZKI6YCG5pe26ZKI5Lik5Liq5pa55ZCR5peL6L2s55qE5pSv5oyBXG4gICAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIHZhciBjID0gdGhpcy5jO1xuICAgICAgICB2YXIgdHggPSB0aGlzLnR4O1xuXG4gICAgICAgIGlmIChhbmdsZT4wKXtcbiAgICAgICAgICAgIHRoaXMuYSA9IGEgKiBjb3MgLSB0aGlzLmIgKiBzaW47XG4gICAgICAgICAgICB0aGlzLmIgPSBhICogc2luICsgdGhpcy5iICogY29zO1xuICAgICAgICAgICAgdGhpcy5jID0gYyAqIGNvcyAtIHRoaXMuZCAqIHNpbjtcbiAgICAgICAgICAgIHRoaXMuZCA9IGMgKiBzaW4gKyB0aGlzLmQgKiBjb3M7XG4gICAgICAgICAgICB0aGlzLnR4ID0gdHggKiBjb3MgLSB0aGlzLnR5ICogc2luO1xuICAgICAgICAgICAgdGhpcy50eSA9IHR4ICogc2luICsgdGhpcy50eSAqIGNvcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBzdCA9IE1hdGguc2luKE1hdGguYWJzKGFuZ2xlKSk7XG4gICAgICAgICAgICB2YXIgY3QgPSBNYXRoLmNvcyhNYXRoLmFicyhhbmdsZSkpO1xuXG4gICAgICAgICAgICB0aGlzLmEgPSBhKmN0ICsgdGhpcy5iKnN0O1xuICAgICAgICAgICAgdGhpcy5iID0gLWEqc3QgKyB0aGlzLmIqY3Q7XG4gICAgICAgICAgICB0aGlzLmMgPSBjKmN0ICsgdGhpcy5kKnN0O1xuICAgICAgICAgICAgdGhpcy5kID0gLWMqc3QgKyBjdCp0aGlzLmQ7XG4gICAgICAgICAgICB0aGlzLnR4ID0gY3QqdHggKyBzdCp0aGlzLnR5O1xuICAgICAgICAgICAgdGhpcy50eSA9IGN0KnRoaXMudHkgLSBzdCp0eDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNjYWxlIDogZnVuY3Rpb24oc3gsIHN5KXtcbiAgICAgICAgdGhpcy5hICo9IHN4O1xuICAgICAgICB0aGlzLmQgKj0gc3k7XG4gICAgICAgIHRoaXMudHggKj0gc3g7XG4gICAgICAgIHRoaXMudHkgKj0gc3k7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdHJhbnNsYXRlIDogZnVuY3Rpb24oZHgsIGR5KXtcbiAgICAgICAgdGhpcy50eCArPSBkeDtcbiAgICAgICAgdGhpcy50eSArPSBkeTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpZGVudGl0eSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8v5Yid5aeL5YyWXG4gICAgICAgIHRoaXMuYSA9IHRoaXMuZCA9IDE7XG4gICAgICAgIHRoaXMuYiA9IHRoaXMuYyA9IHRoaXMudHggPSB0aGlzLnR5ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbnZlcnQgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL+mAhuWQkeefqemYtVxuICAgICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgICAgdmFyIGIgPSB0aGlzLmI7XG4gICAgICAgIHZhciBjID0gdGhpcy5jO1xuICAgICAgICB2YXIgZCA9IHRoaXMuZDtcbiAgICAgICAgdmFyIHR4ID0gdGhpcy50eDtcbiAgICAgICAgdmFyIGkgPSBhICogZCAtIGIgKiBjO1xuXG4gICAgICAgIHRoaXMuYSA9IGQgLyBpO1xuICAgICAgICB0aGlzLmIgPSAtYiAvIGk7XG4gICAgICAgIHRoaXMuYyA9IC1jIC8gaTtcbiAgICAgICAgdGhpcy5kID0gYSAvIGk7XG4gICAgICAgIHRoaXMudHggPSAoYyAqIHRoaXMudHkgLSBkICogdHgpIC8gaTtcbiAgICAgICAgdGhpcy50eSA9IC0oYSAqIHRoaXMudHkgLSBiICogdHgpIC8gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9uZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHRoaXMuYSwgdGhpcy5iLCB0aGlzLmMsIHRoaXMuZCwgdGhpcy50eCwgdGhpcy50eSk7XG4gICAgfSxcbiAgICB0b0FycmF5IDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIFsgdGhpcy5hICwgdGhpcy5iICwgdGhpcy5jICwgdGhpcy5kICwgdGhpcy50eCAsIHRoaXMudHkgXTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOefqemYteW3puS5mOWQkemHj1xuICAgICAqL1xuICAgIG11bFZlY3RvciA6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgdmFyIGFhID0gdGhpcy5hLCBhYyA9IHRoaXMuYywgYXR4ID0gdGhpcy50eDtcbiAgICAgICAgdmFyIGFiID0gdGhpcy5iLCBhZCA9IHRoaXMuZCwgYXR5ID0gdGhpcy50eTtcblxuICAgICAgICB2YXIgb3V0ID0gWzAsMF07XG4gICAgICAgIG91dFswXSA9IHZbMF0gKiBhYSArIHZbMV0gKiBhYyArIGF0eDtcbiAgICAgICAgb3V0WzFdID0gdlswXSAqIGFiICsgdlsxXSAqIGFkICsgYXR5O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSAgICBcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWF0cml4O1xuIiwiaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiBUd2Vlbi5qcyAtIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanMvZ3JhcGhzL2NvbnRyaWJ1dG9ycyBmb3IgdGhlIGZ1bGwgbGlzdCBvZiBjb250cmlidXRvcnMuXG4gKiBUaGFuayB5b3UgYWxsLCB5b3UncmUgYXdlc29tZSFcbiAqL1xuXG4gdmFyIFRXRUVOID0gVFdFRU4gfHwgKGZ1bmN0aW9uICgpIHtcblxuIFx0dmFyIF90d2VlbnMgPSBbXTtcblxuIFx0cmV0dXJuIHtcblxuIFx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblxuIFx0XHRcdHJldHVybiBfdHdlZW5zO1xuXG4gXHRcdH0sXG5cbiBcdFx0cmVtb3ZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cbiBcdFx0XHRfdHdlZW5zID0gW107XG5cbiBcdFx0fSxcblxuIFx0XHRhZGQ6IGZ1bmN0aW9uICh0d2Vlbikge1xuXG4gXHRcdFx0X3R3ZWVucy5wdXNoKHR3ZWVuKTtcblxuIFx0XHR9LFxuXG4gXHRcdHJlbW92ZTogZnVuY3Rpb24gKHR3ZWVuKSB7XG5cblx0XHRcdHZhciBpID0gXy5pbmRleE9mKCBfdHdlZW5zICwgdHdlZW4gKTsvL190d2VlbnMuaW5kZXhPZih0d2Vlbik7XG5cblx0XHRcdGlmIChpICE9PSAtMSkge1xuXHRcdFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uICh0aW1lLCBwcmVzZXJ2ZSkge1xuXG5cdFx0XHRpZiAoX3R3ZWVucy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdHRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogVFdFRU4ubm93KCk7XG5cblx0XHRcdHdoaWxlIChpIDwgX3R3ZWVucy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgIC8qIG9sZCBcblx0XHRcdFx0aWYgKF90d2VlbnNbaV0udXBkYXRlKHRpbWUpIHx8IHByZXNlcnZlKSB7XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCovXG5cbiAgICAgICAgICAgICAgICAvL25ldyBjb2RlXG4gICAgICAgICAgICAgICAgLy9pbiByZWFsIHdvcmxkLCB0d2Vlbi51cGRhdGUgaGFzIGNoYW5jZSB0byByZW1vdmUgaXRzZWxmLCBzbyB3ZSBoYXZlIHRvIGhhbmRsZSB0aGlzIHNpdHVhdGlvbi5cbiAgICAgICAgICAgICAgICAvL2luIGNlcnRhaW4gY2FzZXMsIG9uVXBkYXRlQ2FsbGJhY2sgd2lsbCByZW1vdmUgaW5zdGFuY2VzIGluIF90d2VlbnMsIHdoaWNoIG1ha2UgX3R3ZWVucy5zcGxpY2UoaSwgMSkgZmFpbFxuICAgICAgICAgICAgICAgIC8vQGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbVxuICAgICAgICAgICAgICAgIHZhciBfdCA9IF90d2VlbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIF91cGRhdGVSZXMgPSBfdC51cGRhdGUodGltZSk7XG5cbiAgICAgICAgICAgICAgICBpZiggIV90d2VlbnNbaV0gKXtcbiAgICAgICAgICAgICAgICBcdGJyZWFrO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKCBfdCA9PT0gX3R3ZWVuc1tpXSApIHtcbiAgICAgICAgICAgICAgICBcdGlmICggX3VwZGF0ZVJlcyB8fCBwcmVzZXJ2ZSApIHtcbiAgICAgICAgICAgICAgICBcdFx0aSsrO1xuICAgICAgICAgICAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgICAgICAgICBcdFx0X3R3ZWVucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgXHR9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG59KSgpO1xuXG5cbi8vIEluY2x1ZGUgYSBwZXJmb3JtYW5jZS5ub3cgcG9seWZpbGwuXG4vLyBJbiBub2RlLmpzLCB1c2UgcHJvY2Vzcy5ocnRpbWUuXG5pZiAodHlwZW9mICh3aW5kb3cpID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHByb2Nlc3MpICE9PSAndW5kZWZpbmVkJykge1xuXHRUV0VFTi5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHRpbWUgPSBwcm9jZXNzLmhydGltZSgpO1xuXG5cdFx0Ly8gQ29udmVydCBbc2Vjb25kcywgbmFub3NlY29uZHNdIHRvIG1pbGxpc2Vjb25kcy5cblx0XHRyZXR1cm4gdGltZVswXSAqIDEwMDAgKyB0aW1lWzFdIC8gMTAwMDAwMDtcblx0fTtcbn1cbi8vIEluIGEgYnJvd3NlciwgdXNlIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAodHlwZW9mICh3aW5kb3cpICE9PSAndW5kZWZpbmVkJyAmJlxuXHR3aW5kb3cucGVyZm9ybWFuY2UgIT09IHVuZGVmaW5lZCAmJlxuXHR3aW5kb3cucGVyZm9ybWFuY2Uubm93ICE9PSB1bmRlZmluZWQpIHtcblx0Ly8gVGhpcyBtdXN0IGJlIGJvdW5kLCBiZWNhdXNlIGRpcmVjdGx5IGFzc2lnbmluZyB0aGlzIGZ1bmN0aW9uXG5cdC8vIGxlYWRzIHRvIGFuIGludm9jYXRpb24gZXhjZXB0aW9uIGluIENocm9tZS5cblx0VFdFRU4ubm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdy5iaW5kKHdpbmRvdy5wZXJmb3JtYW5jZSk7XG59XG4vLyBVc2UgRGF0ZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAoRGF0ZS5ub3cgIT09IHVuZGVmaW5lZCkge1xuXHRUV0VFTi5ub3cgPSBEYXRlLm5vdztcbn1cbi8vIE90aGVyd2lzZSwgdXNlICduZXcgRGF0ZSgpLmdldFRpbWUoKScuXG5lbHNlIHtcblx0VFdFRU4ubm93ID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fTtcbn1cblxuXG5UV0VFTi5Ud2VlbiA9IGZ1bmN0aW9uIChvYmplY3QpIHtcblxuXHR2YXIgX29iamVjdCA9IG9iamVjdDtcblx0dmFyIF92YWx1ZXNTdGFydCA9IHt9O1xuXHR2YXIgX3ZhbHVlc0VuZCA9IHt9O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0UmVwZWF0ID0ge307XG5cdHZhciBfZHVyYXRpb24gPSAxMDAwO1xuXHR2YXIgX3JlcGVhdCA9IDA7XG5cdHZhciBfcmVwZWF0RGVsYXlUaW1lO1xuXHR2YXIgX3lveW8gPSBmYWxzZTtcblx0dmFyIF9pc1BsYXlpbmcgPSBmYWxzZTtcblx0dmFyIF9yZXZlcnNlZCA9IGZhbHNlO1xuXHR2YXIgX2RlbGF5VGltZSA9IDA7XG5cdHZhciBfc3RhcnRUaW1lID0gbnVsbDtcblx0dmFyIF9lYXNpbmdGdW5jdGlvbiA9IFRXRUVOLkVhc2luZy5MaW5lYXIuTm9uZTtcblx0dmFyIF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLkxpbmVhcjtcblx0dmFyIF9jaGFpbmVkVHdlZW5zID0gW107XG5cdHZhciBfb25TdGFydENhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXHR2YXIgX29uVXBkYXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uQ29tcGxldGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdG9wQ2FsbGJhY2sgPSBudWxsO1xuXG5cdHRoaXMudG8gPSBmdW5jdGlvbiAocHJvcGVydGllcywgZHVyYXRpb24pIHtcblxuXHRcdF92YWx1ZXNFbmQgPSBwcm9wZXJ0aWVzO1xuXG5cdFx0aWYgKGR1cmF0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdF9kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uICh0aW1lKSB7XG5cblx0XHRUV0VFTi5hZGQodGhpcyk7XG5cblx0XHRfaXNQbGF5aW5nID0gdHJ1ZTtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXG5cdFx0X3N0YXJ0VGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiBUV0VFTi5ub3coKTtcblx0XHRfc3RhcnRUaW1lICs9IF9kZWxheVRpbWU7XG5cblx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kKSB7XG5cblx0XHRcdC8vIENoZWNrIGlmIGFuIEFycmF5IHdhcyBwcm92aWRlZCBhcyBwcm9wZXJ0eSB2YWx1ZVxuXHRcdFx0aWYgKF92YWx1ZXNFbmRbcHJvcGVydHldIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuXHRcdFx0XHRpZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDcmVhdGUgYSBsb2NhbCBjb3B5IG9mIHRoZSBBcnJheSB3aXRoIHRoZSBzdGFydCB2YWx1ZSBhdCB0aGUgZnJvbnRcblx0XHRcdFx0X3ZhbHVlc0VuZFtwcm9wZXJ0eV0gPSBbX29iamVjdFtwcm9wZXJ0eV1dLmNvbmNhdChfdmFsdWVzRW5kW3Byb3BlcnR5XSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgYHRvKClgIHNwZWNpZmllcyBhIHByb3BlcnR5IHRoYXQgZG9lc24ndCBleGlzdCBpbiB0aGUgc291cmNlIG9iamVjdCxcblx0XHRcdC8vIHdlIHNob3VsZCBub3Qgc2V0IHRoYXQgcHJvcGVydHkgaW4gdGhlIG9iamVjdFxuXHRcdFx0aWYgKF9vYmplY3RbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNhdmUgdGhlIHN0YXJ0aW5nIHZhbHVlLlxuXHRcdFx0X3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9IF9vYmplY3RbcHJvcGVydHldO1xuXG5cdFx0XHRpZiAoKF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gKj0gMS4wOyAvLyBFbnN1cmVzIHdlJ3JlIHVzaW5nIG51bWJlcnMsIG5vdCBzdHJpbmdzXG5cdFx0XHR9XG5cblx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRbcHJvcGVydHldIHx8IDA7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICghX2lzUGxheWluZykge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0VFdFRU4ucmVtb3ZlKHRoaXMpO1xuXHRcdF9pc1BsYXlpbmcgPSBmYWxzZTtcblxuXHRcdGlmIChfb25TdG9wQ2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdF9vblN0b3BDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdH1cblxuXHRcdHRoaXMuc3RvcENoYWluZWRUd2VlbnMoKTtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuZW5kID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0dGhpcy51cGRhdGUoX3N0YXJ0VGltZSArIF9kdXJhdGlvbik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKyspIHtcblx0XHRcdF9jaGFpbmVkVHdlZW5zW2ldLnN0b3AoKTtcblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmRlbGF5ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuXG5cdFx0X2RlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMucmVwZWF0ID0gZnVuY3Rpb24gKHRpbWVzKSB7XG5cblx0XHRfcmVwZWF0ID0gdGltZXM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdERlbGF5ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuXG5cdFx0X3JlcGVhdERlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMueW95byA9IGZ1bmN0aW9uICh5b3lvKSB7XG5cblx0XHRfeW95byA9IHlveW87XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXG5cdHRoaXMuZWFzaW5nID0gZnVuY3Rpb24gKGVhc2luZykge1xuXG5cdFx0X2Vhc2luZ0Z1bmN0aW9uID0gZWFzaW5nO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5pbnRlcnBvbGF0aW9uID0gZnVuY3Rpb24gKGludGVycG9sYXRpb24pIHtcblxuXHRcdF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBpbnRlcnBvbGF0aW9uO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5jaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9jaGFpbmVkVHdlZW5zID0gYXJndW1lbnRzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0YXJ0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25TdGFydENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vbkNvbXBsZXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uU3RvcENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG5cblx0XHR2YXIgcHJvcGVydHk7XG5cdFx0dmFyIGVsYXBzZWQ7XG5cdFx0dmFyIHZhbHVlO1xuXG5cdFx0aWYgKHRpbWUgPCBfc3RhcnRUaW1lKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoX29uU3RhcnRDYWxsYmFja0ZpcmVkID09PSBmYWxzZSkge1xuXG5cdFx0XHRpZiAoX29uU3RhcnRDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0XHRfb25TdGFydENhbGxiYWNrLmNhbGwoX29iamVjdCwgX29iamVjdCk7XG5cdFx0XHR9XG5cblx0XHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZWxhcHNlZCA9ICh0aW1lIC0gX3N0YXJ0VGltZSkgLyBfZHVyYXRpb247XG5cdFx0ZWxhcHNlZCA9IGVsYXBzZWQgPiAxID8gMSA6IGVsYXBzZWQ7XG5cblx0XHR2YWx1ZSA9IF9lYXNpbmdGdW5jdGlvbihlbGFwc2VkKTtcblxuXHRcdGZvciAocHJvcGVydHkgaW4gX3ZhbHVlc0VuZCkge1xuXG5cdFx0XHQvLyBEb24ndCB1cGRhdGUgcHJvcGVydGllcyB0aGF0IGRvIG5vdCBleGlzdCBpbiB0aGUgc291cmNlIG9iamVjdFxuXHRcdFx0aWYgKF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHN0YXJ0ID0gX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xuXHRcdFx0dmFyIGVuZCA9IF92YWx1ZXNFbmRbcHJvcGVydHldO1xuXG5cdFx0XHRpZiAoZW5kIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuXHRcdFx0XHRfb2JqZWN0W3Byb3BlcnR5XSA9IF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24oZW5kLCB2YWx1ZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gUGFyc2VzIHJlbGF0aXZlIGVuZCB2YWx1ZXMgd2l0aCBzdGFydCBhcyBiYXNlIChlLmcuOiArMTAsIC0zKVxuXHRcdFx0XHRpZiAodHlwZW9mIChlbmQpID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdFx0aWYgKGVuZC5jaGFyQXQoMCkgPT09ICcrJyB8fCBlbmQuY2hhckF0KDApID09PSAnLScpIHtcblx0XHRcdFx0XHRcdGVuZCA9IHN0YXJ0ICsgcGFyc2VGbG9hdChlbmQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBwYXJzZUZsb2F0KGVuZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUHJvdGVjdCBhZ2FpbnN0IG5vbiBudW1lcmljIHByb3BlcnRpZXMuXG5cdFx0XHRcdGlmICh0eXBlb2YgKGVuZCkgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0X29iamVjdFtwcm9wZXJ0eV0gPSBzdGFydCArIChlbmQgLSBzdGFydCkgKiB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoX29uVXBkYXRlQ2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdF9vblVwZGF0ZUNhbGxiYWNrLmNhbGwoX29iamVjdCwgdmFsdWUpO1xuXHRcdH1cblxuXHRcdGlmIChlbGFwc2VkID09PSAxKSB7XG5cblx0XHRcdGlmIChfcmVwZWF0ID4gMCkge1xuXG5cdFx0XHRcdGlmIChpc0Zpbml0ZShfcmVwZWF0KSkge1xuXHRcdFx0XHRcdF9yZXBlYXQtLTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlYXNzaWduIHN0YXJ0aW5nIHZhbHVlcywgcmVzdGFydCBieSBtYWtpbmcgc3RhcnRUaW1lID0gbm93XG5cdFx0XHRcdGZvciAocHJvcGVydHkgaW4gX3ZhbHVlc1N0YXJ0UmVwZWF0KSB7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIChfdmFsdWVzRW5kW3Byb3BlcnR5XSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSArIHBhcnNlRmxvYXQoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV07XG5cblx0XHRcdFx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzRW5kW3Byb3BlcnR5XTtcblx0XHRcdFx0XHRcdF92YWx1ZXNFbmRbcHJvcGVydHldID0gdG1wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRfcmV2ZXJzZWQgPSAhX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF9yZXBlYXREZWxheVRpbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdF9zdGFydFRpbWUgPSB0aW1lICsgX3JlcGVhdERlbGF5VGltZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9kZWxheVRpbWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoX29uQ29tcGxldGVDYWxsYmFjayAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0X29uQ29tcGxldGVDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKyspIHtcblx0XHRcdFx0XHQvLyBNYWtlIHRoZSBjaGFpbmVkIHR3ZWVucyBzdGFydCBleGFjdGx5IGF0IHRoZSB0aW1lIHRoZXkgc2hvdWxkLFxuXHRcdFx0XHRcdC8vIGV2ZW4gaWYgdGhlIGB1cGRhdGUoKWAgbWV0aG9kIHdhcyBjYWxsZWQgd2F5IHBhc3QgdGhlIGR1cmF0aW9uIG9mIHRoZSB0d2VlblxuXHRcdFx0XHRcdF9jaGFpbmVkVHdlZW5zW2ldLnN0YXJ0KF9zdGFydFRpbWUgKyBfZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblxuXHR9O1xuXG59O1xuXG5cblRXRUVOLkVhc2luZyA9IHtcblxuXHRMaW5lYXI6IHtcblxuXHRcdE5vbmU6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhZHJhdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiAoMiAtIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0gMC41ICogKC0tayAqIChrIC0gMikgLSAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEN1YmljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFydGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtICgtLWsgKiBrICogayAqIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoKGsgLT0gMikgKiBrICogayAqIGsgLSAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1aW50aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrICogayArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0U2ludXNvaWRhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5jb3MoayAqIE1hdGguUEkgLyAyKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNpbihrICogTWF0aC5QSSAvIDIpO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMC41ICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogaykpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RXhwb25lbnRpYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMCA/IDAgOiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLSAxMCAqIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIE1hdGgucG93KDEwMjQsIGsgLSAxKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgtIE1hdGgucG93KDIsIC0gMTAgKiAoayAtIDEpKSArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q2lyY3VsYXI6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gayAqIGspO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gKC0tayAqIGspKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gLSAwLjUgKiAoTWF0aC5zcXJ0KDEgLSBrICogaykgLSAxKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtIChrIC09IDIpICogaykgKyAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEVsYXN0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtTWF0aC5wb3coMiwgMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIE1hdGgucG93KDIsIC0xMCAqIGspICogTWF0aC5zaW4oKGsgLSAwLjEpICogNSAqIE1hdGguUEkpICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRrICo9IDI7XG5cblx0XHRcdGlmIChrIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gLTAuNSAqIE1hdGgucG93KDIsIDEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAtMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKSArIDE7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCYWNrOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiAoKHMgKyAxKSAqIGsgLSBzKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiAoKHMgKyAxKSAqIGsgKyBzKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiAoayAqIGsgKiAoKHMgKyAxKSAqIGsgLSBzKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJvdW5jZToge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoMSAtIGspO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPCAoMSAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiBrICogaztcblx0XHRcdH0gZWxzZSBpZiAoayA8ICgyIC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgxLjUgLyAyLjc1KSkgKiBrICsgMC43NTtcblx0XHRcdH0gZWxzZSBpZiAoayA8ICgyLjUgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDIuMjUgLyAyLjc1KSkgKiBrICsgMC45Mzc1O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgyLjYyNSAvIDIuNzUpKSAqIGsgKyAwLjk4NDM3NTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPCAwLjUpIHtcblx0XHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuSW4oayAqIDIpICogMC41O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoayAqIDIgLSAxKSAqIDAuNSArIDAuNTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cblRXRUVOLkludGVycG9sYXRpb24gPSB7XG5cblx0TGluZWFyOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIGYgPSBtICogaztcblx0XHR2YXIgaSA9IE1hdGguZmxvb3IoZik7XG5cdFx0dmFyIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5MaW5lYXI7XG5cblx0XHRpZiAoayA8IDApIHtcblx0XHRcdHJldHVybiBmbih2WzBdLCB2WzFdLCBmKTtcblx0XHR9XG5cblx0XHRpZiAoayA+IDEpIHtcblx0XHRcdHJldHVybiBmbih2W21dLCB2W20gLSAxXSwgbSAtIGYpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmbih2W2ldLCB2W2kgKyAxID4gbSA/IG0gOiBpICsgMV0sIGYgLSBpKTtcblxuXHR9LFxuXG5cdEJlemllcjogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBiID0gMDtcblx0XHR2YXIgbiA9IHYubGVuZ3RoIC0gMTtcblx0XHR2YXIgcHcgPSBNYXRoLnBvdztcblx0XHR2YXIgYm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkJlcm5zdGVpbjtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IG47IGkrKykge1xuXHRcdFx0YiArPSBwdygxIC0gaywgbiAtIGkpICogcHcoaywgaSkgKiB2W2ldICogYm4obiwgaSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGI7XG5cblx0fSxcblxuXHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIGYgPSBtICogaztcblx0XHR2YXIgaSA9IE1hdGguZmxvb3IoZik7XG5cdFx0dmFyIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5DYXRtdWxsUm9tO1xuXG5cdFx0aWYgKHZbMF0gPT09IHZbbV0pIHtcblxuXHRcdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRcdGkgPSBNYXRoLmZsb29yKGYgPSBtICogKDEgKyBrKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbih2WyhpIC0gMSArIG0pICUgbV0sIHZbaV0sIHZbKGkgKyAxKSAlIG1dLCB2WyhpICsgMikgJSBtXSwgZiAtIGkpO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRcdHJldHVybiB2WzBdIC0gKGZuKHZbMF0sIHZbMF0sIHZbMV0sIHZbMV0sIC1mKSAtIHZbMF0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA+IDEpIHtcblx0XHRcdFx0cmV0dXJuIHZbbV0gLSAoZm4odlttXSwgdlttXSwgdlttIC0gMV0sIHZbbSAtIDFdLCBmIC0gbSkgLSB2W21dKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuKHZbaSA/IGkgLSAxIDogMF0sIHZbaV0sIHZbbSA8IGkgKyAxID8gbSA6IGkgKyAxXSwgdlttIDwgaSArIDIgPyBtIDogaSArIDJdLCBmIC0gaSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRVdGlsczoge1xuXG5cdFx0TGluZWFyOiBmdW5jdGlvbiAocDAsIHAxLCB0KSB7XG5cblx0XHRcdHJldHVybiAocDEgLSBwMCkgKiB0ICsgcDA7XG5cblx0XHR9LFxuXG5cdFx0QmVybnN0ZWluOiBmdW5jdGlvbiAobiwgaSkge1xuXG5cdFx0XHR2YXIgZmMgPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkZhY3RvcmlhbDtcblxuXHRcdFx0cmV0dXJuIGZjKG4pIC8gZmMoaSkgLyBmYyhuIC0gaSk7XG5cblx0XHR9LFxuXG5cdFx0RmFjdG9yaWFsOiAoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgYSA9IFsxXTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChuKSB7XG5cblx0XHRcdFx0dmFyIHMgPSAxO1xuXG5cdFx0XHRcdGlmIChhW25dKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFbbl07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKHZhciBpID0gbjsgaSA+IDE7IGktLSkge1xuXHRcdFx0XHRcdHMgKj0gaTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFbbl0gPSBzO1xuXHRcdFx0XHRyZXR1cm4gcztcblxuXHRcdFx0fTtcblxuXHRcdH0pKCksXG5cblx0XHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAocDAsIHAxLCBwMiwgcDMsIHQpIHtcblxuXHRcdFx0dmFyIHYwID0gKHAyIC0gcDApICogMC41O1xuXHRcdFx0dmFyIHYxID0gKHAzIC0gcDEpICogMC41O1xuXHRcdFx0dmFyIHQyID0gdCAqIHQ7XG5cdFx0XHR2YXIgdDMgPSB0ICogdDI7XG5cblx0XHRcdHJldHVybiAoMiAqIHAxIC0gMiAqIHAyICsgdjAgKyB2MSkgKiB0MyArICgtIDMgKiBwMSArIDMgKiBwMiAtIDIgKiB2MCAtIHYxKSAqIHQyICsgdjAgKiB0ICsgcDE7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBUV0VFTjtcbiIsImltcG9ydCBUd2VlbiBmcm9tIFwiLi9Ud2VlblwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiDorr7nva4gQW5pbWF0aW9uRnJhbWUgYmVnaW5cbiAqL1xudmFyIGxhc3RUaW1lID0gMDtcbnZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbmZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xufTtcbmlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbn07XG5pZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgfTtcbn07XG5cbi8v566h55CG5omA5pyJ5Zu+6KGo55qE5riy5p+T5Lu75YqhXG52YXIgX3Rhc2tMaXN0ID0gW107IC8vW3sgaWQgOiB0YXNrOiB9Li4uXVxudmFyIF9yZXF1ZXN0QWlkID0gbnVsbDtcblxuZnVuY3Rpb24gZW5hYmxlZEFuaW1hdGlvbkZyYW1lKCl7XG4gICAgaWYgKCFfcmVxdWVzdEFpZCkge1xuICAgICAgICBfcmVxdWVzdEFpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJmcmFtZV9fXCIgKyBfdGFza0xpc3QubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vaWYgKCBUd2Vlbi5nZXRBbGwoKS5sZW5ndGggKSB7XG4gICAgICAgICAgICBUd2Vlbi51cGRhdGUoKTsgLy90d2VlbuiHquW3seS8muWBmmxlbmd0aOWIpOaWrVxuICAgICAgICAgICAgLy99O1xuICAgICAgICAgICAgdmFyIGN1cnJUYXNrTGlzdCA9IF90YXNrTGlzdDtcbiAgICAgICAgICAgIF90YXNrTGlzdCA9IFtdO1xuICAgICAgICAgICAgX3JlcXVlc3RBaWQgPSBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJUYXNrTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY3VyclRhc2tMaXN0LnNoaWZ0KCkudGFzaygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gX3JlcXVlc3RBaWQ7XG59OyBcblxuLypcbiAqIEBwYXJhbSB0YXNrIOimgeWKoOWFpeWIsOa4suafk+W4p+mYn+WIl+S4reeahOS7u+WKoVxuICogQHJlc3VsdCBmcmFtZWlkXG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdEZyYW1lKCAkZnJhbWUgKSB7XG4gICAgaWYgKCEkZnJhbWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG4gICAgX3Rhc2tMaXN0LnB1c2goJGZyYW1lKTtcbiAgICByZXR1cm4gZW5hYmxlZEFuaW1hdGlvbkZyYW1lKCk7XG59O1xuXG4vKlxuICogIEBwYXJhbSB0YXNrIOimgeS7jua4suafk+W4p+mYn+WIl+S4reWIoOmZpOeahOS7u+WKoVxuICovXG5mdW5jdGlvbiBkZXN0cm95RnJhbWUoICRmcmFtZSApIHtcbiAgICB2YXIgZF9yZXN1bHQgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IF90YXNrTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKF90YXNrTGlzdFtpXS5pZCA9PT0gJGZyYW1lLmlkKSB7XG4gICAgICAgICAgICBkX3Jlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICBfdGFza0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgbC0tO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgaWYgKF90YXNrTGlzdC5sZW5ndGggPT0gMCkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShfcmVxdWVzdEFpZCk7XG4gICAgICAgIF9yZXF1ZXN0QWlkID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBkX3Jlc3VsdDtcbn07XG5cblxuLyogXG4gKiBAcGFyYW0gb3B0IHtmcm9tICwgdG8gLCBvblVwZGF0ZSAsIG9uQ29tcGxldGUgLCAuLi4uLi59XG4gKiBAcmVzdWx0IHR3ZWVuXG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdFR3ZWVuKG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0ID0gXy5leHRlbmQoe1xuICAgICAgICBmcm9tOiBudWxsLFxuICAgICAgICB0bzogbnVsbCxcbiAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKXt9LFxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgb25TdG9wOiBmdW5jdGlvbigpe30sXG4gICAgICAgIHJlcGVhdDogMCxcbiAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgIGVhc2luZzogJ0xpbmVhci5Ob25lJyxcbiAgICAgICAgZGVzYzogJycgLy/liqjnlLvmj4/ov7DvvIzmlrnkvr/mn6Xmib5idWdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciB0d2VlbiA9IHt9O1xuICAgIHZhciB0aWQgPSBcInR3ZWVuX1wiICsgVXRpbHMuZ2V0VUlEKCk7XG4gICAgb3B0LmlkICYmICggdGlkID0gdGlkK1wiX1wiK29wdC5pZCApO1xuXG4gICAgaWYgKG9wdC5mcm9tICYmIG9wdC50bykge1xuICAgICAgICB0d2VlbiA9IG5ldyBUd2Vlbi5Ud2Vlbiggb3B0LmZyb20gKVxuICAgICAgICAudG8oIG9wdC50bywgb3B0LmR1cmF0aW9uIClcbiAgICAgICAgLm9uU3RhcnQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG9wdC5vblN0YXJ0LmFwcGx5KCB0aGlzIClcbiAgICAgICAgfSlcbiAgICAgICAgLm9uVXBkYXRlKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgb3B0Lm9uVXBkYXRlLmFwcGx5KCB0aGlzICk7XG4gICAgICAgIH0gKVxuICAgICAgICAub25Db21wbGV0ZSggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZXN0cm95RnJhbWUoe1xuICAgICAgICAgICAgICAgIGlkOiB0aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHdlZW4uX2lzQ29tcGxldGVlZCA9IHRydWU7XG4gICAgICAgICAgICBvcHQub25Db21wbGV0ZS5hcHBseSggdGhpcyAsIFt0aGlzXSApOyAvL+aJp+ihjOeUqOaIt+eahGNvbkNvbXBsZXRlXG4gICAgICAgIH0gKVxuICAgICAgICAub25TdG9wKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZGVzdHJveUZyYW1lKHtcbiAgICAgICAgICAgICAgICBpZDogdGlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR3ZWVuLl9pc1N0b3BlZCA9IHRydWU7XG4gICAgICAgICAgICBvcHQub25TdG9wLmFwcGx5KCB0aGlzICwgW3RoaXNdICk7XG4gICAgICAgIH0gKVxuICAgICAgICAucmVwZWF0KCBvcHQucmVwZWF0IClcbiAgICAgICAgLmRlbGF5KCBvcHQuZGVsYXkgKVxuICAgICAgICAuZWFzaW5nKCBUd2Vlbi5FYXNpbmdbb3B0LmVhc2luZy5zcGxpdChcIi5cIilbMF1dW29wdC5lYXNpbmcuc3BsaXQoXCIuXCIpWzFdXSApXG4gICAgICAgIFxuICAgICAgICB0d2Vlbi5pZCA9IHRpZDtcbiAgICAgICAgdHdlZW4uc3RhcnQoKTtcblxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xuXG4gICAgICAgICAgICBpZiAoIHR3ZWVuLl9pc0NvbXBsZXRlZWQgfHwgdHdlZW4uX2lzU3RvcGVkICkge1xuICAgICAgICAgICAgICAgIHR3ZWVuID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVnaXN0RnJhbWUoe1xuICAgICAgICAgICAgICAgIGlkOiB0aWQsXG4gICAgICAgICAgICAgICAgdGFzazogYW5pbWF0ZSxcbiAgICAgICAgICAgICAgICBkZXNjOiBvcHQuZGVzYyxcbiAgICAgICAgICAgICAgICB0d2VlbjogdHdlZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBhbmltYXRlKCk7XG5cbiAgICB9O1xuICAgIHJldHVybiB0d2Vlbjtcbn07XG4vKlxuICogQHBhcmFtIHR3ZWVuXG4gKiBAcmVzdWx0IHZvaWQoMClcbiAqL1xuZnVuY3Rpb24gZGVzdHJveVR3ZWVuKHR3ZWVuICwgbXNnKSB7XG4gICAgdHdlZW4uc3RvcCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlZ2lzdEZyYW1lOiByZWdpc3RGcmFtZSxcbiAgICBkZXN0cm95RnJhbWU6IGRlc3Ryb3lGcmFtZSxcbiAgICByZWdpc3RUd2VlbjogcmVnaXN0VHdlZW4sXG4gICAgZGVzdHJveVR3ZWVuOiBkZXN0cm95VHdlZW5cbn07IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5bGe5oCn5bel5Y6C77yMaWXkuIvpnaLnlKhWQlPmj5DkvpvmlK/mjIFcbiAqIOadpee7meaVtOS4quW8leaTjuaPkOS+m+W/g+i3s+WMheeahOinpuWPkeacuuWItlxuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vL+WumuS5ieWwgeijheWlveeahOWFvOWuueWkp+mDqOWIhua1j+iniOWZqOeahGRlZmluZVByb3BlcnRpZXMg55qEIOWxnuaAp+W3peWOglxudmFyIHVud2F0Y2hPbmUgPSB7XG4gICAgXCIkc2tpcEFycmF5XCIgOiAwLFxuICAgIFwiJHdhdGNoXCIgICAgIDogMSxcbiAgICBcIiRmaXJlXCIgICAgICA6IDIsLy/kuLvopoHmmK9nZXQgc2V0IOaYvuaAp+iuvue9rueahCDop6blj5FcbiAgICBcIiRtb2RlbFwiICAgICA6IDMsXG4gICAgXCIkYWNjZXNzb3JcIiAgOiA0LFxuICAgIFwiJG93bmVyXCIgICAgIDogNSxcbiAgICAvL1wicGF0aFwiICAgICAgIDogNiwgLy/ov5nkuKrlupTor6XmmK/llK/kuIDkuIDkuKrkuI3nlKh3YXRjaOeahOS4jeW4piTnmoTmiJDlkZjkuoblkKfvvIzlm6DkuLrlnLDlm77nrYnnmoRwYXRo5piv5Zyo5aSq5aSnXG4gICAgXCIkcGFyZW50XCIgICAgOiA3ICAvL+eUqOS6juW7uueri+aVsOaNrueahOWFs+ezu+mTvlxufVxuXG5mdW5jdGlvbiBPYnNlcnZlKHNjb3BlLCBtb2RlbCwgd2F0Y2hNb3JlKSB7XG5cbiAgICB2YXIgc3RvcFJlcGVhdEFzc2lnbj10cnVlO1xuXG4gICAgdmFyIHNraXBBcnJheSA9IHNjb3BlLiRza2lwQXJyYXksIC8v6KaB5b+955Wl55uR5o6n55qE5bGe5oCn5ZCN5YiX6KGoXG4gICAgICAgIHBtb2RlbCA9IHt9LCAvL+imgei/lOWbnueahOWvueixoVxuICAgICAgICBhY2Nlc3NvcmVzID0ge30sIC8v5YaF6YOo55So5LqO6L2s5o2i55qE5a+56LGhXG4gICAgICAgIFZCUHVibGljcyA9IF8ua2V5cyggdW53YXRjaE9uZSApOyAvL+eUqOS6jklFNi04XG5cbiAgICAgICAgbW9kZWwgPSBtb2RlbCB8fCB7fTsvL+i/meaYr3Btb2RlbOS4iueahCRtb2RlbOWxnuaAp1xuICAgICAgICB3YXRjaE1vcmUgPSB3YXRjaE1vcmUgfHwge307Ly/ku6Uk5byA5aS05L2G6KaB5by65Yi255uR5ZCs55qE5bGe5oCnXG4gICAgICAgIHNraXBBcnJheSA9IF8uaXNBcnJheShza2lwQXJyYXkpID8gc2tpcEFycmF5LmNvbmNhdChWQlB1YmxpY3MpIDogVkJQdWJsaWNzO1xuXG4gICAgZnVuY3Rpb24gbG9vcChuYW1lLCB2YWwpIHtcbiAgICAgICAgaWYgKCAhdW53YXRjaE9uZVtuYW1lXSB8fCAodW53YXRjaE9uZVtuYW1lXSAmJiBuYW1lLmNoYXJBdCgwKSAhPT0gXCIkXCIpICkge1xuICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSB2YWxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgICAgIGlmICh2YWx1ZVR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgaWYoIXVud2F0Y2hPbmVbbmFtZV0pe1xuICAgICAgICAgICAgICBWQlB1YmxpY3MucHVzaChuYW1lKSAvL+WHveaVsOaXoOmcgOimgei9rOaNolxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaW5kZXhPZihza2lwQXJyYXksbmFtZSkgIT09IC0xIHx8IChuYW1lLmNoYXJBdCgwKSA9PT0gXCIkXCIgJiYgIXdhdGNoTW9yZVtuYW1lXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVkJQdWJsaWNzLnB1c2gobmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhY2Nlc3NvciA9IGZ1bmN0aW9uKG5lbykgeyAvL+WIm+W7uuebkeaOp+WxnuaAp+aIluaVsOe7hO+8jOiHquWPmOmHj++8jOeUseeUqOaIt+inpuWPkeWFtuaUueWPmFxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFjY2Vzc29yLnZhbHVlLCBwcmVWYWx1ZSA9IHZhbHVlLCBjb21wbGV4VmFsdWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/lhpnmk43kvZxcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQg55qEIOWAvOeahCDnsbvlnotcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5lb1R5cGUgPSB0eXBlb2YgbmVvO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9wUmVwZWF0QXNzaWduKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLy/pmLvmraLph43lpI3otYvlgLxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG5lbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG5lbyAmJiBuZW9UeXBlID09PSBcIm9iamVjdFwiICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEobmVvIGluc3RhbmNlb2YgQXJyYXkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIW5lby5hZGRDb2xvclN0b3AgLy8gbmVvIGluc3RhbmNlb2YgQ2FudmFzR3JhZGllbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmVvLiRtb2RlbCA/IG5lbyA6IE9ic2VydmUobmVvICwgbmVvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV4VmFsdWUgPSB2YWx1ZS4kbW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugey8v5aaC5p6c5piv5YW25LuW5pWw5o2u57G75Z6LXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiggbmVvVHlwZSA9PT0gXCJhcnJheVwiICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgdmFsdWUgPSBfLmNsb25lKG5lbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5lb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsW25hbWVdID0gY29tcGxleFZhbHVlID8gY29tcGxleFZhbHVlIDogdmFsdWU7Ly/mm7TmlrAkbW9kZWzkuK3nmoTlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29tcGxleFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG1vZGVsLiRmaXJlICYmIHBtb2RlbC4kZmlyZShuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZVR5cGUgIT0gbmVvVHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpxzZXTnmoTlgLznsbvlnovlt7Lnu4/mlLnlj5jvvIxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOS5n+imgeaKiuWvueW6lOeahHZhbHVlVHlwZeS/ruaUueS4uuWvueW6lOeahG5lb1R5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGUgPSBuZW9UeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1dhdGNoTW9kZWwgPSBwbW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aJgOacieeahOi1i+WAvOmDveimgeinpuWPkXdhdGNo55qE55uR5ZCs5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFwbW9kZWwuJHdhdGNoICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSggaGFzV2F0Y2hNb2RlbC4kcGFyZW50ICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhdGNoTW9kZWwgPSBoYXNXYXRjaE1vZGVsLiRwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggaGFzV2F0Y2hNb2RlbC4kd2F0Y2ggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhdGNoTW9kZWwuJHdhdGNoLmNhbGwoaGFzV2F0Y2hNb2RlbCAsIG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL+ivu+aTjeS9nFxuICAgICAgICAgICAgICAgICAgICAvL+ivu+eahOaXtuWAme+8jOWPkeeOsHZhbHVl5piv5Liqb2Jq77yM6ICM5LiU6L+Y5rKh5pyJZGVmaW5lUHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgLy/pgqPkuYjlsLHkuLTml7ZkZWZpbmVQcm9wZXJ0eeS4gOasoVxuICAgICAgICAgICAgICAgICAgICBpZiAoIHZhbHVlICYmICh2YWx1ZVR5cGUgPT09IFwib2JqZWN0XCIpIFxuICAgICAgICAgICAgICAgICAgICAgICAmJiAhKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIFxuICAgICAgICAgICAgICAgICAgICAgICAmJiAhdmFsdWUuJG1vZGVsXG4gICAgICAgICAgICAgICAgICAgICAgICYmICF2YWx1ZS5hZGRDb2xvclN0b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5bu656uL5ZKM54i25pWw5o2u6IqC54K555qE5YWz57O7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS4kcGFyZW50ID0gcG1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBPYnNlcnZlKHZhbHVlICwgdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FjY2Vzc29yLnZhbHVlIOmHjeaWsOWkjeWItuS4umRlZmluZVByb3BlcnR56L+H5ZCO55qE5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWNjZXNzb3IudmFsdWUgPSB2YWw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFjY2Vzc29yZXNbbmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgc2V0OiBhY2Nlc3NvcixcbiAgICAgICAgICAgICAgICBnZXQ6IGFjY2Vzc29yLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgZm9yICh2YXIgaSBpbiBzY29wZSkge1xuICAgICAgICBsb29wKGksIHNjb3BlW2ldKVxuICAgIH07XG5cbiAgICBwbW9kZWwgPSBkZWZpbmVQcm9wZXJ0aWVzKHBtb2RlbCwgYWNjZXNzb3JlcywgVkJQdWJsaWNzKTsvL+eUn+aIkOS4gOS4quepuueahFZpZXdNb2RlbFxuXG4gICAgXy5mb3JFYWNoKFZCUHVibGljcyxmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGlmIChzY29wZVtuYW1lXSkgey8v5YWI5Li65Ye95pWw562J5LiN6KKr55uR5o6n55qE5bGe5oCn6LWL5YC8XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2NvcGVbbmFtZV0gPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICAgICAgICAgICBwbW9kZWxbbmFtZV0gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgc2NvcGVbbmFtZV0uYXBwbHkodGhpcyAsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgcG1vZGVsW25hbWVdID0gc2NvcGVbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBtb2RlbC4kbW9kZWwgPSBtb2RlbDtcbiAgICBwbW9kZWwuJGFjY2Vzc29yID0gYWNjZXNzb3JlcztcblxuICAgIHBtb2RlbC5oYXNPd25Qcm9wZXJ0eSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gcG1vZGVsLiRtb2RlbFxuICAgIH07XG5cbiAgICBzdG9wUmVwZWF0QXNzaWduID0gZmFsc2U7XG5cbiAgICByZXR1cm4gcG1vZGVsXG59XG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcbiAgICAvL+WmguaenOa1j+iniOWZqOS4jeaUr+aMgWVjbWEyNjJ2NeeahE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVz5oiW6ICF5a2Y5ZyoQlVH77yM5q+U5aaCSUU4XG4gICAgLy/moIflh4bmtY/op4jlmajkvb/nlKhfX2RlZmluZUdldHRlcl9fLCBfX2RlZmluZVNldHRlcl9f5a6e546wXG4gICAgdHJ5IHtcbiAgICAgICAgZGVmaW5lUHJvcGVydHkoe30sIFwiX1wiLCB7XG4gICAgICAgICAgICB2YWx1ZTogXCJ4XCJcbiAgICAgICAgfSlcbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllc1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKFwiX19kZWZpbmVHZXR0ZXJfX1wiIGluIE9iamVjdCkge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbihvYmosIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IGRlc2MudmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCdnZXQnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9fZGVmaW5lR2V0dGVyX18ocHJvcCwgZGVzYy5nZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgnc2V0JyBpbiBkZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5fX2RlZmluZVNldHRlcl9fKHByb3AsIGRlc2Muc2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKG9iaiwgZGVzY3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGRlc2NzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjc1twcm9wXSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuLy9JRTYtOOS9v+eUqFZCU2NyaXB057G755qEc2V0IGdldOivreWPpeWunueOsFxuaWYgKCFkZWZpbmVQcm9wZXJ0aWVzICYmIHdpbmRvdy5WQkFycmF5KSB7XG4gICAgd2luZG93LmV4ZWNTY3JpcHQoW1xuICAgICAgICAgICAgXCJGdW5jdGlvbiBwYXJzZVZCKGNvZGUpXCIsXG4gICAgICAgICAgICBcIlxcdEV4ZWN1dGVHbG9iYWwoY29kZSlcIixcbiAgICAgICAgICAgIFwiRW5kIEZ1bmN0aW9uXCJcbiAgICAgICAgICAgIF0uam9pbihcIlxcblwiKSwgXCJWQlNjcmlwdFwiKTtcblxuICAgIGZ1bmN0aW9uIFZCTWVkaWF0b3IoZGVzY3JpcHRpb24sIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBmbiA9IGRlc2NyaXB0aW9uW25hbWVdICYmIGRlc2NyaXB0aW9uW25hbWVdLnNldDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIGZuKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmbigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24ocHVibGljcywgZGVzY3JpcHRpb24sIGFycmF5KSB7XG4gICAgICAgIHB1YmxpY3MgPSBhcnJheS5zbGljZSgwKTtcbiAgICAgICAgcHVibGljcy5wdXNoKFwiaGFzT3duUHJvcGVydHlcIik7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBcIlZCQ2xhc3NcIiArIHNldFRpbWVvdXQoXCIxXCIpLCBvd25lciA9IHt9LCBidWZmZXIgPSBbXTtcbiAgICAgICAgYnVmZmVyLnB1c2goXG4gICAgICAgICAgICAgICAgXCJDbGFzcyBcIiArIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICBcIlxcdFByaXZhdGUgW19fZGF0YV9fXSwgW19fcHJveHlfX11cIixcbiAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBEZWZhdWx0IEZ1bmN0aW9uIFtfX2NvbnN0X19dKGQsIHApXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRcXHRTZXQgW19fZGF0YV9fXSA9IGQ6IHNldCBbX19wcm94eV9fXSA9IHBcIixcbiAgICAgICAgICAgICAgICBcIlxcdFxcdFNldCBbX19jb25zdF9fXSA9IE1lXCIsIC8v6ZO+5byP6LCD55SoXG4gICAgICAgICAgICAgICAgXCJcXHRFbmQgRnVuY3Rpb25cIik7XG4gICAgICAgIF8uZm9yRWFjaChwdWJsaWNzLGZ1bmN0aW9uKG5hbWUpIHsgLy/mt7vliqDlhazlhbHlsZ7mgKcs5aaC5p6c5q2k5pe25LiN5Yqg5Lul5ZCO5bCx5rKh5py65Lya5LqGXG4gICAgICAgICAgICBpZiAob3duZXJbbmFtZV0gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBvd25lcltuYW1lXSA9IHRydWUgLy/lm6DkuLpWQlNjcmlwdOWvueixoeS4jeiDveWDj0pT6YKj5qC36ZqP5oSP5aKe5Yig5bGe5oCnXG4gICAgICAgICAgICBidWZmZXIucHVzaChcIlxcdFB1YmxpYyBbXCIgKyBuYW1lICsgXCJdXCIpIC8v5L2g5Y+v5Lul6aKE5YWI5pS+5Yiwc2tpcEFycmF55LitXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBvd25lcltuYW1lXSA9IHRydWVcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sx5LqO5LiN55+l5a+55pa55Lya5Lyg5YWl5LuA5LmILOWboOatpHNldCwgbGV06YO955So5LiKXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBQcm9wZXJ0eSBMZXQgW1wiICsgbmFtZSArIFwiXSh2YWwpXCIsIC8vc2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdENhbGwgW19fcHJveHlfX10oW19fZGF0YV9fXSwgXFxcIlwiICsgbmFtZSArIFwiXFxcIiwgdmFsKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgUHJvcGVydHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIFByb3BlcnR5IFNldCBbXCIgKyBuYW1lICsgXCJdKHZhbClcIiwgLy9zZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0Q2FsbCBbX19wcm94eV9fXShbX19kYXRhX19dLCBcXFwiXCIgKyBuYW1lICsgXCJcXFwiLCB2YWwpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBQcm9wZXJ0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgUHJvcGVydHkgR2V0IFtcIiArIG5hbWUgKyBcIl1cIiwgLy9nZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0T24gRXJyb3IgUmVzdW1lIE5leHRcIiwgLy/lv4XpobvkvJjlhYjkvb/nlKhzZXTor63lj6Us5ZCm5YiZ5a6D5Lya6K+v5bCG5pWw57uE5b2T5a2X56ym5Liy6L+U5ZueXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdFNldFtcIiArIG5hbWUgKyBcIl0gPSBbX19wcm94eV9fXShbX19kYXRhX19dLFxcXCJcIiArIG5hbWUgKyBcIlxcXCIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdElmIEVyci5OdW1iZXIgPD4gMCBUaGVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdFtcIiArIG5hbWUgKyBcIl0gPSBbX19wcm94eV9fXShbX19kYXRhX19dLFxcXCJcIiArIG5hbWUgKyBcIlxcXCIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBJZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRPbiBFcnJvciBHb3RvIDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIFByb3BlcnR5XCIpXG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyLnB1c2goXCJFbmQgQ2xhc3NcIik7IC8v57G75a6a5LmJ5a6M5q+VXG4gICAgICAgIGJ1ZmZlci5wdXNoKFxuICAgICAgICAgICAgICAgIFwiRnVuY3Rpb24gXCIgKyBjbGFzc05hbWUgKyBcIkZhY3RvcnkoYSwgYilcIiwgLy/liJvlu7rlrp7kvovlubbkvKDlhaXkuKTkuKrlhbPplK7nmoTlj4LmlbBcbiAgICAgICAgICAgICAgICBcIlxcdERpbSBvXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRTZXQgbyA9IChOZXcgXCIgKyBjbGFzc05hbWUgKyBcIikoYSwgYilcIixcbiAgICAgICAgICAgICAgICBcIlxcdFNldCBcIiArIGNsYXNzTmFtZSArIFwiRmFjdG9yeSA9IG9cIixcbiAgICAgICAgICAgICAgICBcIkVuZCBGdW5jdGlvblwiKTtcbiAgICAgICAgd2luZG93LnBhcnNlVkIoYnVmZmVyLmpvaW4oXCJcXHJcXG5cIikpOy8v5YWI5Yib5bu65LiA5LiqVkLnsbvlt6XljoJcbiAgICAgICAgcmV0dXJuICB3aW5kb3dbY2xhc3NOYW1lICsgXCJGYWN0b3J5XCJdKGRlc2NyaXB0aW9uLCBWQk1lZGlhdG9yKTsvL+W+l+WIsOWFtuS6p+WTgVxuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IE9ic2VydmU7XG5cbiIsIlxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBfX1ZFUlNJT05fXztcblxuZXhwb3J0IGNvbnN0IFBJXzIgPSBNYXRoLlBJICogMjtcblxuZXhwb3J0IGNvbnN0IFJBRF9UT19ERUcgPSAxODAgLyBNYXRoLlBJO1xuXG5leHBvcnQgY29uc3QgREVHX1RPX1JBRCA9IE1hdGguUEkgLyAxODA7XG5cbmV4cG9ydCBjb25zdCBSRU5ERVJFUl9UWVBFID0ge1xuICAgIFVOS05PV046ICAgIDAsXG4gICAgV0VCR0w6ICAgICAgMSxcbiAgICBDQU5WQVM6ICAgICAyLFxufTtcblxuZXhwb3J0IGNvbnN0IERSQVdfTU9ERVMgPSB7XG4gICAgUE9JTlRTOiAgICAgICAgIDAsXG4gICAgTElORVM6ICAgICAgICAgIDEsXG4gICAgTElORV9MT09QOiAgICAgIDIsXG4gICAgTElORV9TVFJJUDogICAgIDMsXG4gICAgVFJJQU5HTEVTOiAgICAgIDQsXG4gICAgVFJJQU5HTEVfU1RSSVA6IDUsXG4gICAgVFJJQU5HTEVfRkFOOiAgIDYsXG59O1xuXG5leHBvcnQgY29uc3QgU0hBUEVTID0ge1xuICAgIFBPTFk6IDAsXG4gICAgUkVDVDogMSxcbiAgICBDSVJDOiAyLFxuICAgIEVMSVA6IDMsXG4gICAgUlJFQzogNCxcbn07XG5cbmV4cG9ydCBjb25zdCBDT05URVhUX0RFRkFVTFQgPSB7XG4gICAgd2lkdGggICAgICAgICA6IDAsXG4gICAgaGVpZ2h0ICAgICAgICA6IDAsXG4gICAgeCAgICAgICAgICAgICA6IDAsXG4gICAgeSAgICAgICAgICAgICA6IDAsXG4gICAgc2NhbGVYICAgICAgICA6IDEsXG4gICAgc2NhbGVZICAgICAgICA6IDEsXG4gICAgc2NhbGVPcmlnaW4gICA6IHtcbiAgICAgICAgeCA6IDAsXG4gICAgICAgIHkgOiAwXG4gICAgfSxcbiAgICByb3RhdGlvbiAgICAgIDogMCxcbiAgICByb3RhdGVPcmlnaW4gIDogIHtcbiAgICAgICAgeCA6IDAsXG4gICAgICAgIHkgOiAwXG4gICAgfSxcbiAgICB2aXNpYmxlICAgICAgIDogdHJ1ZSxcbiAgICBnbG9iYWxBbHBoYSAgIDogMSxcblxuICAgIC8vc2hhcGUg5omN6ZyA6KaB55So5Yiw77yMIOW3sue7j+i/geenu+WIsHNoYXBl5Lit5Y675LqG77yM6L+Z6YeM5YWI5rOo6YeK5o6JXG4gICAgLypcbiAgICBjdXJzb3IgICAgICAgIDogXCJkZWZhdWx0XCIsXG5cbiAgICBmaWxsQWxwaGEgICAgIDogMSwvL2NvbnRleHQyZOmHjOayoeacie+8jOiHquWumuS5iVxuICAgIGZpbGxTdHlsZSAgICAgOiBudWxsLC8vXCIjMDAwMDAwXCIsXG5cbiAgICBsaW5lQ2FwICAgICAgIDogbnVsbCwvL+m7mOiupOmDveaYr+ebtOinklxuICAgIGxpbmVKb2luICAgICAgOiBudWxsLC8v6L+Z5Lik5Liq55uu5YmNd2ViZ2zph4zpnaLmsqHlrp7njrBcbiAgICBtaXRlckxpbWl0ICAgIDogbnVsbCwvL21pdGVyTGltaXQg5bGe5oCn6K6+572u5oiW6L+U5Zue5pyA5aSn5pac5o6l6ZW/5bqmLOWPquacieW9kyBsaW5lSm9pbiDlsZ7mgKfkuLogXCJtaXRlclwiIOaXtu+8jG1pdGVyTGltaXQg5omN5pyJ5pWI44CCXG5cbiAgICBsaW5lQWxwaGEgICAgIDogMSwvL2NvbnRleHQyZOmHjOayoeacie+8jOiHquWumuS5iVxuICAgIHN0cm9rZVN0eWxlICAgOiBudWxsLFxuICAgIGxpbmVUeXBlICAgICAgOiBcInNvbGlkXCIsIC8vY29udGV4dDJk6YeM5rKh5pyJ77yM6Ieq5a6a5LmJ57q/5p2h55qEdHlwZe+8jOm7mOiupOS4uuWunue6v1xuICAgIGxpbmVXaWR0aCAgICAgOiBudWxsLFxuICAgICovXG4gICAgXG4gICAgXG4gICAgLy/msqHnlKjliLDnmoTmmoLml7bkuI3nlKhcbiAgICAvL3NoYWRvd0JsdXIgICAgOiBudWxsLFxuICAgIC8vc2hhZG93Q29sb3IgICA6IG51bGwsXG4gICAgLy9zaGFkb3dPZmZzZXRYIDogbnVsbCxcbiAgICAvL3NoYWRvd09mZnNldFkgOiBudWxsLFxuICAgIFxuICAgIC8vZm9udCAgICAgICAgICA6IG51bGwsXG4gICAgLy90ZXh0QWxpZ24gICAgIDogXCJsZWZ0XCIsXG4gICAgLy90ZXh0QmFzZWxpbmUgIDogXCJ0b3BcIiwgXG4gICAgLy9hcmNTY2FsZVhfICAgIDogbnVsbCxcbiAgICAvL2FyY1NjYWxlWV8gICAgOiBudWxsLFxuICAgIC8vbGluZVNjYWxlXyAgICA6IG51bGwsXG4gICAgXG4gICAgLy9nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gOiBudWxsXG5cbn07XG5leHBvcnQgY29uc3QgU0hBUEVfQ09OVEVYVF9ERUZBVUxUID0ge1xuICAgIGN1cnNvciAgICAgICAgOiBcImRlZmF1bHRcIixcblxuICAgIGZpbGxBbHBoYSAgICAgOiAxLC8vY29udGV4dDJk6YeM5rKh5pyJ77yM6Ieq5a6a5LmJXG4gICAgZmlsbFN0eWxlICAgICA6IG51bGwsLy9cIiMwMDAwMDBcIixcblxuICAgIGxpbmVDYXAgICAgICAgOiBudWxsLC8v6buY6K6k6YO95piv55u06KeSXG4gICAgbGluZUpvaW4gICAgICA6IG51bGwsLy/ov5nkuKTkuKrnm67liY13ZWJnbOmHjOmdouayoeWunueOsFxuICAgIG1pdGVyTGltaXQgICAgOiBudWxsLC8vbWl0ZXJMaW1pdCDlsZ7mgKforr7nva7miJbov5Tlm57mnIDlpKfmlpzmjqXplb/luqYs5Y+q5pyJ5b2TIGxpbmVKb2luIOWxnuaAp+S4uiBcIm1pdGVyXCIg5pe277yMbWl0ZXJMaW1pdCDmiY3mnInmlYjjgIJcblxuICAgIGxpbmVBbHBoYSAgICAgOiAxLC8vY29udGV4dDJk6YeM5rKh5pyJ77yM6Ieq5a6a5LmJXG4gICAgc3Ryb2tlU3R5bGUgICA6IG51bGwsXG4gICAgbGluZVR5cGUgICAgICA6IFwic29saWRcIiwgLy9jb250ZXh0MmTph4zmsqHmnInvvIzoh6rlrprkuYnnur/mnaHnmoR0eXBl77yM6buY6K6k5Li65a6e57q/XG4gICAgbGluZVdpZHRoICAgICA6IG51bGxcbn1cblxuXG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyBEaXNwbGF5TGlzdCDnmoQg546w5a6e5a+56LGh5Z+657G7XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbmltcG9ydCBNYXRyaXggZnJvbSBcIi4uL2dlb20vTWF0cml4XCI7XG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vUG9pbnRcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBBbmltYXRpb25GcmFtZSBmcm9tIFwiLi4vYW5pbWF0aW9uL0FuaW1hdGlvbkZyYW1lXCI7XG5pbXBvcnQgT2JzZXJ2ZSBmcm9tIFwiLi4vdXRpbHMvb2JzZXJ2ZVwiO1xuaW1wb3J0IHtDT05URVhUX0RFRkFVTFR9IGZyb20gXCIuLi9jb25zdFwiXG5cbnZhciBEaXNwbGF5T2JqZWN0ID0gZnVuY3Rpb24ob3B0KXtcbiAgICBEaXNwbGF5T2JqZWN0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIC8v5aaC5p6c55So5oi35rKh5pyJ5Lyg5YWlY29udGV4dOiuvue9ru+8jOWwsem7mOiupOS4uuepuueahOWvueixoVxuICAgIG9wdCAgICAgID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xuXG4gICAgLy/nm7jlr7nniLbnuqflhYPntKDnmoTnn6npmLVcbiAgICB0aGlzLl90cmFuc2Zvcm0gICAgICA9IG51bGw7XG5cbiAgICAvL+W/g+i3s+asoeaVsFxuICAgIHRoaXMuX2hlYXJ0QmVhdE51bSAgID0gMDtcblxuICAgIC8v5YWD57Sg5a+55bqU55qEc3RhZ2XlhYPntKBcbiAgICB0aGlzLnN0YWdlICAgICAgICAgICA9IG51bGw7XG5cbiAgICAvL+WFg+e0oOeahOeItuWFg+e0oFxuICAgIHRoaXMucGFyZW50ICAgICAgICAgID0gbnVsbDtcblxuICAgIHRoaXMuX2V2ZW50RW5hYmxlZCAgID0gZmFsc2U7ICAgLy/mmK/lkKblk43lupTkuovku7bkuqTkupIs5Zyo5re75Yqg5LqG5LqL5Lu25L6m5ZCs5ZCO5Lya6Ieq5Yqo6K6+572u5Li6dHJ1ZVxuXG4gICAgdGhpcy5kcmFnRW5hYmxlZCAgICAgPSB0cnVlIDsvL1wiZHJhZ0VuYWJsZWRcIiBpbiBvcHQgPyBvcHQuZHJhZ0VuYWJsZWQgOiBmYWxzZTsgICAvL+aYr+WQpuWQr+eUqOWFg+e0oOeahOaLluaLvVxuXG4gICAgdGhpcy54eVRvSW50ICAgICAgICAgPSBcInh5VG9JbnRcIiBpbiBvcHQgPyBvcHQueHlUb0ludCA6IHRydWU7ICAgIC8v5piv5ZCm5a+5eHnlnZDmoIfnu5/kuIBpbnTlpITnkIbvvIzpu5jorqTkuLp0cnVl77yM5L2G5piv5pyJ55qE5pe25YCZ5Y+v5Lul55Sx5aSW55WM55So5oi35omL5Yqo5oyH5a6a5piv5ZCm6ZyA6KaB6K6h566X5Li6aW5077yM5Zug5Li65pyJ55qE5pe25YCZ5LiN6K6h566X5q+U6L6D5aW977yM5q+U5aaC77yM6L+b5bqm5Zu+6KGo5Lit77yM5YaNc2VjdG9y55qE5Lik56uv5re75Yqg5Lik5Liq5ZyG5p2l5YGa5ZyG6KeS55qE6L+b5bqm5p2h55qE5pe25YCZ77yM5ZyGY2lyY2xl5LiN5YGaaW506K6h566X77yM5omN6IO95ZKMc2VjdG9y5pu05aW955qE6KGU5o6lXG5cbiAgICB0aGlzLm1vdmVpbmcgICAgICAgICA9IGZhbHNlOyAvL+WmguaenOWFg+e0oOWcqOacgOi9qOmBk+i/kOWKqOS4reeahOaXtuWAme+8jOacgOWlveaKiui/meS4quiuvue9ruS4unRydWXvvIzov5nmoLfog73kv53or4Hovajov7nnmoTkuJ3mkKzpobrmu5HvvIzlkKbliJnlm6DkuLp4eVRvSW5055qE5Y6f5Zug77yM5Lya5pyJ6Lez6LeDXG5cbiAgICAvL+WIm+W7uuWlvWNvbnRleHRcbiAgICB0aGlzLl9jcmVhdGVDb250ZXh0KCBvcHQgKTtcblxuICAgIHRoaXMuaWQgPSBVdGlscy5jcmVhdGVJZCh0aGlzLnR5cGUgfHwgXCJkaXNwbGF5T2JqZWN0XCIpO1xuXG4gICAgdGhpcy5pbml0LmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuXG4gICAgLy/miYDmnInlsZ7mgKflh4blpIflpb3kuoblkI7vvIzlhYjopoHorqHnrpfkuIDmrKF0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKeW+l+WIsF90YW5zZm9ybVxuICAgIHRoaXMuX3VwZGF0ZVRyYW5zZm9ybSgpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyggRGlzcGxheU9iamVjdCAsIEV2ZW50RGlzcGF0Y2hlciAsIHtcbiAgICBpbml0IDogZnVuY3Rpb24oKXt9LFxuICAgIF9jcmVhdGVDb250ZXh0IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8v5omA5pyJ5pi+56S65a+56LGh77yM6YO95pyJ5LiA5Liq57G75Ly8Y2FudmFzLmNvbnRleHTnsbvkvLznmoQgY29udGV4dOWxnuaAp1xuICAgICAgICAvL+eUqOadpeWtmOWPluaUueaYvuekuuWvueixoeaJgOacieWSjOaYvuekuuacieWFs+eahOWxnuaAp++8jOWdkOagh++8jOagt+W8j+etieOAglxuICAgICAgICAvL+ivpeWvueixoeS4ukNvZXIuT2JzZXJ2ZSgp5bel5Y6C5Ye95pWw55Sf5oiQXG4gICAgICAgIHNlbGYuY29udGV4dCA9IG51bGw7XG5cbiAgICAgICAgLy/mj5Dkvpvnu5lDb2VyLk9ic2VydmUoKSDmnaUg57uZIHNlbGYuY29udGV4dCDorr7nva4gcHJvcGVydHlzXG4gICAgICAgIC8v6L+Z6YeM5LiN6IO955SoXy5leHRlbmTvvIwg5Zug5Li66KaB5L+d6K+BX2NvbnRleHRBVFRSU+eahOe6r+eyue+8jOWPquimhuebluS4i+mdouW3suacieeahOWxnuaAp1xuICAgICAgICB2YXIgX2NvbnRleHRBVFRSUyA9IF8uZXh0ZW5kKCBfLmNsb25lKENPTlRFWFRfREVGQVVMVCksIG9wdC5jb250ZXh0ICwgdHJ1ZSk7XG5cbiAgICAgICAgLy/mnInkupvlvJXmk47lhoXpg6jorr7nva5jb250ZXh05bGe5oCn55qE5pe25YCZ5piv5LiN55So5LiK5oql5b+D6Lez55qE77yM5q+U5aaC5YGa54Ot54K55qOA5rWL55qE5pe25YCZXG4gICAgICAgIHNlbGYuX25vdFdhdGNoID0gZmFsc2U7XG5cbiAgICAgICAgX2NvbnRleHRBVFRSUy4kb3duZXIgPSBzZWxmO1xuICAgICAgICBfY29udGV4dEFUVFJTLiR3YXRjaCA9IGZ1bmN0aW9uKG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlKXtcblxuICAgICAgICAgICAgLy/kuIvpnaLnmoTov5nkupvlsZ7mgKflj5jljJbvvIzpg73kvJrpnIDopoHph43mlrDnu4Tnu4fnn6npmLXlsZ7mgKcgX3RyYW5zZm9ybSBcbiAgICAgICAgICAgIHZhciB0cmFuc0Zvcm1Qcm9wcyA9IFsgXCJ4XCIgLCBcInlcIiAsIFwic2NhbGVYXCIgLCBcInNjYWxlWVwiICwgXCJyb3RhdGlvblwiICwgXCJzY2FsZU9yaWdpblwiICwgXCJyb3RhdGVPcmlnaW4sIGxpbmVXaWR0aFwiIF07XG5cbiAgICAgICAgICAgIGlmKCBfLmluZGV4T2YoIHRyYW5zRm9ybVByb3BzICwgbmFtZSApID49IDAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kb3duZXIuX3VwZGF0ZVRyYW5zZm9ybSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMuJG93bmVyLl9ub3RXYXRjaCApe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKCB0aGlzLiRvd25lci4kd2F0Y2ggKXtcbiAgICAgICAgICAgICAgICB0aGlzLiRvd25lci4kd2F0Y2goIG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLiRvd25lci5oZWFydEJlYXQoIHtcbiAgICAgICAgICAgICAgICBjb252ZXJ0VHlwZTpcImNvbnRleHRcIixcbiAgICAgICAgICAgICAgICBzaGFwZSAgICAgIDogdGhpcy4kb3duZXIsXG4gICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWUgICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHByZVZhbHVlICAgOiBwcmVWYWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcblxuICAgICAgICAvL+aJp+ihjGluaXTkuYvliY3vvIzlupTor6XlsLHmoLnmja7lj4LmlbDvvIzmiopjb250ZXh057uE57uH5aW957q/XG4gICAgICAgIHNlbGYuY29udGV4dCA9IE9ic2VydmUoIF9jb250ZXh0QVRUUlMgKTtcbiAgICB9LFxuICAgIC8qIEBteXNlbGYg5piv5ZCm55Sf5oiQ6Ieq5bex55qE6ZWc5YOPIFxuICAgICAqIOWFi+mahuWPiOS4pOenje+8jOS4gOenjeaYr+mVnOWDj++8jOWPpuWkluS4gOenjeaYr+e7neWvueaEj+S5ieS4iumdoueahOaWsOS4quS9k1xuICAgICAqIOm7mOiupOS4uue7neWvueaEj+S5ieS4iumdoueahOaWsOS4quS9k++8jOaWsOWvueixoWlk5LiN6IO955u45ZCMXG4gICAgICog6ZWc5YOP5Z+65pys5LiK5piv5qGG5p625YaF6YOo5Zyo5a6e546wICDplZzlg4/nmoRpZOebuOWQjCDkuLvopoHnlKjmnaXmioroh6rlt7HnlLvliLDlj6blpJbnmoRzdGFnZemHjOmdou+8jOavlOWmglxuICAgICAqIG1vdXNlb3ZlcuWSjG1vdXNlb3V055qE5pe25YCZ6LCD55SoKi9cbiAgICBjbG9uZSA6IGZ1bmN0aW9uKCBteXNlbGYgKXtcbiAgICAgICAgdmFyIGNvbmYgICA9IHtcbiAgICAgICAgICAgIGlkICAgICAgOiB0aGlzLmlkLFxuICAgICAgICAgICAgY29udGV4dCA6IF8uY2xvbmUodGhpcy5jb250ZXh0LiRtb2RlbClcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbmV3T2JqO1xuICAgICAgICBpZiggdGhpcy50eXBlID09ICd0ZXh0JyApe1xuICAgICAgICAgICAgbmV3T2JqID0gbmV3IHRoaXMuY29uc3RydWN0b3IoIHRoaXMudGV4dCAsIGNvbmYgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld09iaiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKCBjb25mICk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdPYmouaWQgPSBjb25mLmlkO1xuXG4gICAgICAgIGlmKCB0aGlzLmNoaWxkcmVuICl7XG4gICAgICAgICAgICBuZXdPYmouY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFteXNlbGYpe1xuICAgICAgICAgICAgbmV3T2JqLmlkID0gVXRpbHMuY3JlYXRlSWQobmV3T2JqLnR5cGUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbmV3T2JqO1xuICAgIH0sXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgLy9zdGFnZeWtmOWcqO+8jOaJjeivtHNlbGbku6PooajnmoRkaXNwbGF55bey57uP6KKr5re75Yqg5Yiw5LqGZGlzcGxheUxpc3TkuK3vvIznu5jlm77lvJXmk47pnIDopoHnn6XpgZPlhbbmlLnlj5jlkI5cbiAgICAgICAgLy/nmoTlsZ7mgKfvvIzmiYDku6XvvIzpgJrnn6XliLBzdGFnZS5kaXNwbGF5QXR0ckhhc0NoYW5nZVxuICAgICAgICB2YXIgc3RhZ2UgPSB0aGlzLmdldFN0YWdlKCk7XG4gICAgICAgIGlmKCBzdGFnZSApe1xuICAgICAgICAgICAgdGhpcy5faGVhcnRCZWF0TnVtICsrO1xuICAgICAgICAgICAgc3RhZ2UuaGVhcnRCZWF0ICYmIHN0YWdlLmhlYXJ0QmVhdCggb3B0ICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldEN1cnJlbnRXaWR0aCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuY29udGV4dC53aWR0aCAqIHRoaXMuY29udGV4dC5zY2FsZVgpO1xuICAgIH0sXG4gICAgZ2V0Q3VycmVudEhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuY29udGV4dC5oZWlnaHQgKiB0aGlzLmNvbnRleHQuc2NhbGVZKTtcbiAgICB9LFxuICAgIGdldFN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMuc3RhZ2UgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFnZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHAgPSB0aGlzO1xuICAgICAgICBpZiAocC50eXBlICE9IFwic3RhZ2VcIil7XG4gICAgICAgICAgd2hpbGUocC5wYXJlbnQpIHtcbiAgICAgICAgICAgIHAgPSBwLnBhcmVudDtcbiAgICAgICAgICAgIGlmIChwLnR5cGUgPT0gXCJzdGFnZVwiKXtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAocC50eXBlICE9PSBcInN0YWdlXCIpIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5b6X5Yiw55qE6aG254K5ZGlzcGxheSDnmoR0eXBl5LiN5pivU3RhZ2Us5Lmf5bCx5piv6K+05LiN5pivc3RhZ2XlhYPntKBcbiAgICAgICAgICAgIC8v6YKj5LmI5Y+q6IO96K+05piO6L+Z5LiqcOaJgOS7o+ihqOeahOmhtuerr2Rpc3BsYXkg6L+Y5rKh5pyJ5re75Yqg5YiwZGlzcGxheUxpc3TkuK3vvIzkuZ/lsLHmmK/msqHmnInmsqHmt7vliqDliLBcbiAgICAgICAgICAgIC8vc3RhZ2XoiJ7lj7DnmoRjaGlsZGVu6Zif5YiX5Lit77yM5LiN5Zyo5byV5pOO5riy5p+T6IyD5Zu05YaFXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICAvL+S4gOebtOWbnua6r+WIsOmhtuWxgm9iamVjdO+8jCDljbPmmK9zdGFnZe+8jCBzdGFnZeeahHBhcmVudOS4um51bGxcbiAgICAgICAgdGhpcy5zdGFnZSA9IHA7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH0sXG4gICAgbG9jYWxUb0dsb2JhbCA6IGZ1bmN0aW9uKCBwb2ludCAsIGNvbnRhaW5lciApe1xuICAgICAgICAhcG9pbnQgJiYgKCBwb2ludCA9IG5ldyBQb2ludCggMCAsIDAgKSApO1xuICAgICAgICB2YXIgY20gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCggY29udGFpbmVyICk7XG5cbiAgICAgICAgaWYgKGNtID09IG51bGwpIHJldHVybiBQb2ludCggMCAsIDAgKTtcbiAgICAgICAgdmFyIG0gPSBuZXcgTWF0cml4KDEsIDAsIDAsIDEsIHBvaW50LnggLCBwb2ludC55KTtcbiAgICAgICAgbS5jb25jYXQoY20pO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCBtLnR4ICwgbS50eSApOyAvL3t4Om0udHgsIHk6bS50eX07XG4gICAgfSxcbiAgICBnbG9iYWxUb0xvY2FsIDogZnVuY3Rpb24oIHBvaW50ICwgY29udGFpbmVyKSB7XG4gICAgICAgICFwb2ludCAmJiAoIHBvaW50ID0gbmV3IFBvaW50KCAwICwgMCApICk7XG5cbiAgICAgICAgaWYoIHRoaXMudHlwZSA9PSBcInN0YWdlXCIgKXtcbiAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY20gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCggY29udGFpbmVyICk7XG5cbiAgICAgICAgaWYgKGNtID09IG51bGwpIHJldHVybiBuZXcgUG9pbnQoIDAgLCAwICk7IC8ve3g6MCwgeTowfTtcbiAgICAgICAgY20uaW52ZXJ0KCk7XG4gICAgICAgIHZhciBtID0gbmV3IE1hdHJpeCgxLCAwLCAwLCAxLCBwb2ludC54ICwgcG9pbnQueSk7XG4gICAgICAgIG0uY29uY2F0KGNtKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggbS50eCAsIG0udHkgKTsgLy97eDptLnR4LCB5Om0udHl9O1xuICAgIH0sXG4gICAgbG9jYWxUb1RhcmdldCA6IGZ1bmN0aW9uKCBwb2ludCAsIHRhcmdldCl7XG4gICAgICAgIHZhciBwID0gbG9jYWxUb0dsb2JhbCggcG9pbnQgKTtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5nbG9iYWxUb0xvY2FsKCBwICk7XG4gICAgfSxcbiAgICBnZXRDb25jYXRlbmF0ZWRNYXRyaXggOiBmdW5jdGlvbiggY29udGFpbmVyICl7XG4gICAgICAgIHZhciBjbSA9IG5ldyBNYXRyaXgoKTtcbiAgICAgICAgZm9yICh2YXIgbyA9IHRoaXM7IG8gIT0gbnVsbDsgbyA9IG8ucGFyZW50KSB7XG4gICAgICAgICAgICBjbS5jb25jYXQoIG8uX3RyYW5zZm9ybSApO1xuICAgICAgICAgICAgaWYoICFvLnBhcmVudCB8fCAoIGNvbnRhaW5lciAmJiBvLnBhcmVudCAmJiBvLnBhcmVudCA9PSBjb250YWluZXIgKSB8fCAoIG8ucGFyZW50ICYmIG8ucGFyZW50LnR5cGU9PVwic3RhZ2VcIiApICkge1xuICAgICAgICAgICAgLy9pZiggby50eXBlID09IFwic3RhZ2VcIiB8fCAoby5wYXJlbnQgJiYgY29udGFpbmVyICYmIG8ucGFyZW50LnR5cGUgPT0gY29udGFpbmVyLnR5cGUgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY207Ly9icmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY207XG4gICAgfSxcbiAgICAvKlxuICAgICAq6K6+572u5YWD57Sg55qE5piv5ZCm5ZON5bqU5LqL5Lu25qOA5rWLXG4gICAgICpAYm9vbCAgQm9vbGVhbiDnsbvlnotcbiAgICAgKi9cbiAgICBzZXRFdmVudEVuYWJsZSA6IGZ1bmN0aW9uKCBib29sICl7XG4gICAgICAgIGlmKF8uaXNCb29sZWFuKGJvb2wpKXtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGJvb2xcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvKlxuICAgICAq5p+l6K+i6Ieq5bex5ZyocGFyZW5055qE6Zif5YiX5Lit55qE5L2N572uXG4gICAgICovXG4gICAgZ2V0SW5kZXggICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF8uaW5kZXhPZih0aGlzLnBhcmVudC5jaGlsZHJlbiAsIHRoaXMpXG4gICAgfSxcbiAgICAvKlxuICAgICAq5YWD57Sg5Zyoeui9tOaWueWQkeWQkeS4i+enu+WKqFxuICAgICAqQG51bSDnp7vliqjnmoTlsYLnuqdcbiAgICAgKi9cbiAgICB0b0JhY2sgOiBmdW5jdGlvbiggbnVtICl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnJvbUluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xuICAgICAgICB2YXIgdG9JbmRleCA9IDA7XG4gICAgICAgIFxuICAgICAgICBpZihfLmlzTnVtYmVyKCBudW0gKSl7XG4gICAgICAgICAgaWYoIG51bSA9PSAwICl7XG4gICAgICAgICAgICAgLy/ljp/lnLDkuI3liqhcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0b0luZGV4ID0gZnJvbUluZGV4IC0gbnVtO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZSggZnJvbUluZGV4ICwgMSApWzBdO1xuICAgICAgICBpZiggdG9JbmRleCA8IDAgKXtcbiAgICAgICAgICAgIHRvSW5kZXggPSAwO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZEF0KCBtZSAsIHRvSW5kZXggKTtcbiAgICB9LFxuICAgIC8qXG4gICAgICrlhYPntKDlnKh66L205pa55ZCR5ZCR5LiK56e75YqoXG4gICAgICpAbnVtIOenu+WKqOeahOWxguaVsOmHjyDpu5jorqTliLDpobbnq69cbiAgICAgKi9cbiAgICB0b0Zyb250IDogZnVuY3Rpb24oIG51bSApe1xuICAgICAgICBpZighdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21JbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcbiAgICAgICAgdmFyIHBjbCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgdmFyIHRvSW5kZXggPSBwY2w7XG4gICAgICAgIFxuICAgICAgICBpZihfLmlzTnVtYmVyKCBudW0gKSl7XG4gICAgICAgICAgaWYoIG51bSA9PSAwICl7XG4gICAgICAgICAgICAgLy/ljp/lnLDkuI3liqhcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvSW5kZXggPSBmcm9tSW5kZXggKyBudW0gKyAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZSggZnJvbUluZGV4ICwgMSApWzBdO1xuICAgICAgICBpZih0b0luZGV4ID4gcGNsKXtcbiAgICAgICAgICAgIHRvSW5kZXggPSBwY2w7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGRBdCggbWUgLCB0b0luZGV4LTEgKTtcbiAgICB9LFxuICAgIF91cGRhdGVUcmFuc2Zvcm0gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgTWF0cml4KCk7XG4gICAgICAgIF90cmFuc2Zvcm0uaWRlbnRpdHkoKTtcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIC8v5piv5ZCm6ZyA6KaBVHJhbnNmb3JtXG4gICAgICAgIGlmKGNvbnRleHQuc2NhbGVYICE9PSAxIHx8IGNvbnRleHQuc2NhbGVZICE9PTEgKXtcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJ57yp5pS+XG4gICAgICAgICAgICAvL+e8qeaUvueahOWOn+eCueWdkOagh1xuICAgICAgICAgICAgdmFyIG9yaWdpbiA9IG5ldyBQb2ludChjb250ZXh0LnNjYWxlT3JpZ2luKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCAtb3JpZ2luLnggLCAtb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoIGNvbnRleHQuc2NhbGVYICwgY29udGV4dC5zY2FsZVkgKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCBvcmlnaW4ueCAsIG9yaWdpbi55ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciByb3RhdGlvbiA9IGNvbnRleHQucm90YXRpb247XG4gICAgICAgIGlmKCByb3RhdGlvbiApe1xuICAgICAgICAgICAgLy/lpoLmnpzmnInml4vovaxcbiAgICAgICAgICAgIC8v5peL6L2s55qE5Y6f54K55Z2Q5qCHXG4gICAgICAgICAgICB2YXIgb3JpZ2luID0gbmV3IFBvaW50KGNvbnRleHQucm90YXRlT3JpZ2luKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCAtb3JpZ2luLnggLCAtb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKCByb3RhdGlvbiAlIDM2MCAqIE1hdGguUEkvMTgwICk7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggb3JpZ2luLnggLCBvcmlnaW4ueSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5aaC5p6c5pyJ5L2N56e7XG4gICAgICAgIHZhciB4LHk7XG4gICAgICAgIGlmKCB0aGlzLnh5VG9JbnQgJiYgIXRoaXMubW92ZWluZyApe1xuICAgICAgICAgICAgLy/lvZPov5nkuKrlhYPntKDlnKjlgZrovajov7nov5DliqjnmoTml7blgJnvvIzmr5TlpoJkcmFn77yMYW5pbWF0aW9u5aaC5p6c5a6e5pe255qE6LCD5pW06L+Z5LiqeCDvvIwgeVxuICAgICAgICAgICAgLy/pgqPkuYjor6XlhYPntKDnmoTovajov7nkvJrmnInot7Pot4PnmoTmg4XlhrXlj5HnlJ/jgILmiYDku6XliqDkuKrmnaHku7bov4fmu6TvvIxcbiAgICAgICAgICAgIHZhciB4ID0gcGFyc2VJbnQoIGNvbnRleHQueCApO1xuICAgICAgICAgICAgdmFyIHkgPSBwYXJzZUludCggY29udGV4dC55ICk7XG5cbiAgICAgICAgICAgIGlmKCBwYXJzZUludChjb250ZXh0LmxpbmVXaWR0aCAsIDEwKSAlIDIgPT0gMSAmJiBjb250ZXh0LnN0cm9rZVN0eWxlICl7XG4gICAgICAgICAgICAgICAgeCArPSAwLjU7XG4gICAgICAgICAgICAgICAgeSArPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ID0gY29udGV4dC54O1xuICAgICAgICAgICAgeSA9IGNvbnRleHQueTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggeCAhPSAwIHx8IHkgIT0gMCApe1xuICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIHggLCB5ICk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybSA9IF90cmFuc2Zvcm07XG4gICAgICAgIHJldHVybiBfdHJhbnNmb3JtO1xuICAgIH0sXG4gICAgLy/mmL7npLrlr7nosaHnmoTpgInlj5bmo4DmtYvlpITnkIblh73mlbBcbiAgICBnZXRDaGlsZEluUG9pbnQgOiBmdW5jdGlvbiggcG9pbnQgKXtcblxuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7IC8v5qOA5rWL55qE57uT5p6cXG5cbiAgICAgICAgLy/nrKzkuIDmraXvvIzlkKdnbG9i55qEcG9pbnTovazmjaLliLDlr7nlupTnmoRvYmrnmoTlsYLnuqflhoXnmoTlnZDmoIfns7vnu59cbiAgICAgICAgaWYoIHRoaXMudHlwZSAhPSBcInN0YWdlXCIgJiYgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQudHlwZSAhPSBcInN0YWdlXCIgKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXMucGFyZW50Lmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHggPSBwb2ludC54O1xuICAgICAgICB2YXIgeSA9IHBvaW50Lnk7XG4gICAgXG4gICAgICAgIC8v5a+56byg5qCH55qE5Z2Q5qCH5Lmf5YGa55u45ZCM55qE5Y+Y5o2iXG4gICAgICAgIGlmKCB0aGlzLl90cmFuc2Zvcm0gKXtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlTWF0cml4ID0gdGhpcy5fdHJhbnNmb3JtLmNsb25lKCkuaW52ZXJ0KCk7XG4gICAgICAgICAgICB2YXIgb3JpZ2luUG9zID0gW3gsIHldO1xuICAgICAgICAgICAgb3JpZ2luUG9zID0gaW52ZXJzZU1hdHJpeC5tdWxWZWN0b3IoIG9yaWdpblBvcyApO1xuXG4gICAgICAgICAgICB4ID0gb3JpZ2luUG9zWzBdO1xuICAgICAgICAgICAgeSA9IG9yaWdpblBvc1sxXTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggdGhpcy5ncmFwaGljcyApe1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5ncmFwaGljcy5jb250YWluc1BvaW50KCB7eDogeCAsIHk6IHl9ICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgLypcbiAgICAqIGFuaW1hdGVcbiAgICAqIEBwYXJhbSB0b0NvbnRlbnQg6KaB5Yqo55S75Y+Y5b2i5Yiw55qE5bGe5oCn6ZuG5ZCIXG4gICAgKiBAcGFyYW0gb3B0aW9ucyB0d2VlbiDliqjnlLvlj4LmlbBcbiAgICAqL1xuICAgIGFuaW1hdGUgOiBmdW5jdGlvbiggdG9Db250ZW50ICwgb3B0aW9ucyApe1xuICAgICAgICB2YXIgdG8gPSB0b0NvbnRlbnQ7XG4gICAgICAgIHZhciBmcm9tID0ge307XG4gICAgICAgIGZvciggdmFyIHAgaW4gdG8gKXtcbiAgICAgICAgICAgIGZyb21bIHAgXSA9IHRoaXMuY29udGV4dFtwXTtcbiAgICAgICAgfTtcbiAgICAgICAgIW9wdGlvbnMgJiYgKG9wdGlvbnMgPSB7fSk7XG4gICAgICAgIG9wdGlvbnMuZnJvbSA9IGZyb207XG4gICAgICAgIG9wdGlvbnMudG8gPSB0bztcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciB1cEZ1biA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgaWYoIG9wdGlvbnMub25VcGRhdGUgKXtcbiAgICAgICAgICAgIHVwRnVuID0gb3B0aW9ucy5vblVwZGF0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHR3ZWVuO1xuICAgICAgICBvcHRpb25zLm9uVXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8v5aaC5p6cY29udGV4dOS4jeWtmOWcqOivtOaYjuivpW9iauW3sue7j+iiq2Rlc3Ryb3nkuobvvIzpgqPkuYjopoHmiorku5bnmoR0d2Vlbue7mWRlc3Ryb3lcbiAgICAgICAgICAgIGlmICghc2VsZi5jb250ZXh0ICYmIHR3ZWVuKSB7XG4gICAgICAgICAgICAgICAgQW5pbWF0aW9uRnJhbWUuZGVzdHJveVR3ZWVuKHR3ZWVuKTtcbiAgICAgICAgICAgICAgICB0d2VlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvciggdmFyIHAgaW4gdGhpcyApe1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGV4dFtwXSA9IHRoaXNbcF07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXBGdW4uYXBwbHkoc2VsZiAsIFt0aGlzXSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBjb21wRnVuID0gZnVuY3Rpb24oKXt9O1xuICAgICAgICBpZiggb3B0aW9ucy5vbkNvbXBsZXRlICl7XG4gICAgICAgICAgICBjb21wRnVuID0gb3B0aW9ucy5vbkNvbXBsZXRlO1xuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zLm9uQ29tcGxldGUgPSBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgICAgICBjb21wRnVuLmFwcGx5KHNlbGYgLCBhcmd1bWVudHMpXG4gICAgICAgIH07XG4gICAgICAgIHR3ZWVuID0gQW5pbWF0aW9uRnJhbWUucmVnaXN0VHdlZW4oIG9wdGlvbnMgKTtcbiAgICAgICAgcmV0dXJuIHR3ZWVuO1xuICAgIH0sXG5cblxuICAgIC8v5riy5p+T55u45YWz6YOo5YiG77yM6L+B56e75YiwcmVuZGVyZXJz5Lit5Y67XG4gICAgX3JlbmRlciA6IGZ1bmN0aW9uKCBjdHggKXtcdFxuICAgICAgICBpZiggIXRoaXMuY29udGV4dC52aXNpYmxlIHx8IHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA8PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgXG5cbiAgICAgICAgdmFyIHRyYW5zRm9ybSA9IHRoaXMuX3RyYW5zZm9ybTtcbiAgICAgICAgaWYoICF0cmFuc0Zvcm0gKSB7XG4gICAgICAgICAgICB0cmFuc0Zvcm0gPSB0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/ov5DnlKjnn6npmLXlvIDlp4vlj5jlvaJcbiAgICAgICAgY3R4LnRyYW5zZm9ybS5hcHBseSggY3R4ICwgdHJhbnNGb3JtLnRvQXJyYXkoKSApO1xuXG4gICAgICAgIC8v6K6+572u5qC35byP77yM5paH5pys5pyJ6Ieq5bex55qE6K6+572u5qC35byP5pa55byPXG4gICAgICAgIGlmKCB0aGlzLnR5cGUgIT0gXCJ0ZXh0XCIgKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmNvbnRleHQuJG1vZGVsO1xuICAgICAgICAgICAgZm9yKHZhciBwIGluIHN0eWxlKXtcbiAgICAgICAgICAgICAgICBpZiggcCAhPSBcInRleHRCYXNlbGluZVwiICYmICggcCBpbiBjdHggKSApe1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHN0eWxlW3BdIHx8IF8uaXNOdW1iZXIoIHN0eWxlW3BdICkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggcCA9PSBcImdsb2JhbEFscGhhXCIgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mAj+aYjuW6puimgeS7jueItuiKgueCuee7p+aJv1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eFtwXSAqPSBzdHlsZVtwXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gc3R5bGVbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoIGN0eCApO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0sXG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApIHtcbiAgICAgICAgLy/ln7rnsbvkuI3mj5DkvptyZW5kZXLnmoTlhbfkvZPlrp7njrDvvIznlLHlkI7nu63lhbfkvZPnmoTmtL7nlJ/nsbvlkIToh6rlrp7njrBcbiAgICB9LFxuICAgIC8v5LuO5qCR5Lit5Yig6ZmkXG4gICAgcmVtb3ZlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lhYPntKDnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/mioroh6rlt7Hku47niLboioLngrnkuK3liKDpmaTkuoblkI7lgZroh6rmiJHmuIXpmaTvvIzph4rmlL7lhoXlrZhcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dDtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BsYXlPYmplY3Q7XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzM+eahERpc3BsYXlMaXN0IOS4reeahOWuueWZqOexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XG5cbnZhciBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gZnVuY3Rpb24ob3B0KXtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuY2hpbGRyZW4gPSBbXTtcbiAgIHNlbGYubW91c2VDaGlsZHJlbiA9IFtdO1xuICAgRGlzcGxheU9iamVjdENvbnRhaW5lci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgIC8v5omA5pyJ55qE5a655Zmo6buY6K6k5pSv5oyBZXZlbnQg5qOA5rWL77yM5Zug5Li6IOWPr+iDveaciemHjOmdoueahHNoYXBl5pivZXZlbnRFbmFibGXmmK90cnVl55qEXG4gICAvL+WmguaenOeUqOaIt+acieW8uuWItueahOmcgOaxguiuqeWuueWZqOS4i+eahOaJgOacieWFg+e0oOmDvSDkuI3lj6/mo4DmtYvvvIzlj6/ku6XosIPnlKhcbiAgIC8vRGlzcGxheU9iamVjdENvbnRhaW5lcueahCBzZXRFdmVudEVuYWJsZSgpIOaWueazlVxuICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3RDb250YWluZXIgLCBEaXNwbGF5T2JqZWN0ICwge1xuICAgIGFkZENoaWxkIDogZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICBpZiggIWNoaWxkICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBpZih0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpICE9IC0xKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9O1xuICAgICAgICAvL+WmguaenOS7luWcqOWIq+eahOWtkOWFg+e0oOS4re+8jOmCo+S5iOWwseS7juWIq+S6uumCo+mHjOWIoOmZpOS6hlxuICAgICAgICBpZihjaGlsZC5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaCggY2hpbGQgKTtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJBZGRDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyQWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIGFkZENoaWxkQXQgOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgaWYodGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMSkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy/kuIrmiqVjaGlsZHJlbuW/g+i3s1xuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckFkZENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJBZGRDaGlsZChjaGlsZCxpbmRleCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGQgOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDaGlsZEF0KF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICkpO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGRBdCA6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckRlbENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJEZWxDaGlsZChjaGlsZCAsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkQnlJZCA6IGZ1bmN0aW9uKCBpZCApIHtcdFxuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2hpbGRBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICByZW1vdmVBbGxDaGlsZHJlbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGlsZSh0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRBdCgwKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/pm4blkIjnsbvnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/kvp3mrKHplIDmr4HmiYDmnInlrZDlhYPntKBcbiAgICAgICAgZm9yICh2YXIgaT0wLGw9dGhpcy5jaGlsZHJlbi5sZW5ndGggOyBpPGwgOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZEF0KGkpLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGwtLTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8qXG4gICAgICpAaWQg5YWD57Sg55qEaWRcbiAgICAgKkBib29sZW4g5piv5ZCm5rex5bqm5p+l6K+i77yM6buY6K6k5bCx5Zyo56ys5LiA5bGC5a2Q5YWD57Sg5Lit5p+l6K+iXG4gICAgICoqL1xuICAgIGdldENoaWxkQnlJZCA6IGZ1bmN0aW9uKGlkICwgYm9vbGVuKXtcbiAgICAgICAgaWYoIWJvb2xlbikge1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+a3seW6puafpeivolxuICAgICAgICAgICAgLy9UT0RPOuaaguaXtuacquWunueOsFxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldENoaWxkQXQgOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgIH0sXG4gICAgZ2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApO1xuICAgIH0sXG4gICAgc2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCl7XG4gICAgICAgIGlmKGNoaWxkLnBhcmVudCAhPSB0aGlzKSByZXR1cm47XG4gICAgICAgIHZhciBvbGRJbmRleCA9IF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICk7XG4gICAgICAgIGlmKGluZGV4ID09IG9sZEluZGV4KSByZXR1cm47XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKG9sZEluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKTtcbiAgICB9LFxuICAgIGdldE51bUNoaWxkcmVuIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB9LFxuICAgIC8v6I635Y+WeCx554K55LiK55qE5omA5pyJb2JqZWN0ICBudW0g6ZyA6KaB6L+U5Zue55qEb2Jq5pWw6YePXG4gICAgZ2V0T2JqZWN0c1VuZGVyUG9pbnQgOiBmdW5jdGlvbiggcG9pbnQgLCBudW0pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yKHZhciBpID0gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgaWYoIGNoaWxkID09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAoIWNoaWxkLl9ldmVudEVuYWJsZWQgJiYgIWNoaWxkLmRyYWdFbmFibGVkKSB8fCBcbiAgICAgICAgICAgICAgICAhY2hpbGQuY29udGV4dC52aXNpYmxlIFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggY2hpbGQgaW5zdGFuY2VvZiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICkge1xuICAgICAgICAgICAgICAgIC8v5piv6ZuG5ZCIXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm1vdXNlQ2hpbGRyZW4gJiYgY2hpbGQuZ2V0TnVtQ2hpbGRyZW4oKSA+IDApe1xuICAgICAgICAgICAgICAgICAgIHZhciBvYmpzID0gY2hpbGQuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIHBvaW50ICk7XG4gICAgICAgICAgICAgICAgICAgaWYgKG9ianMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCggb2JqcyApO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XHRcdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+mdnumbhuWQiO+8jOWPr+S7peW8gOWni+WBmmdldENoaWxkSW5Qb2ludOS6hlxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5nZXRDaGlsZEluUG9pbnQoIHBvaW50ICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobnVtICE9IHVuZGVmaW5lZCAmJiAhaXNOYU4obnVtKSl7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdC5sZW5ndGggPT0gbnVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufSk7XG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICogc3RhZ2Ug57G777yMIOWGjWFzM+S4re+8jHN0YWdl5YiZ5Luj6KGo5pW05Liq6Iie5Y+w44CC5piv5ZSv5LiA55qE5qC56IqC54K5XG4gKiDkvYbmmK/lho1jYW52YXjkuK3vvIzlm6DkuLrliIblsYLorr7orqHnmoTpnIDopoHjgIJzdGFnZSDoiJ7lj7Ag5ZCM5qC35Luj6KGo5LiA5LiqY2FudmFz5YWD57Sg77yM5L2G5piv5LiN5piv5YaN5pW05Liq5byV5pOO6K6+6K6hXG4gKiDph4zpnaLvvIwg5LiN5piv5ZSv5LiA55qE5qC56IqC54K544CC6ICM5piv5Lya5Lqk55SxY2FudmF457G75p2l57uf5LiA566h55CG5YW25bGC57qnXG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFN0YWdlID0gZnVuY3Rpb24oICl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudHlwZSA9IFwic3RhZ2VcIjtcbiAgICBzZWxmLmNhbnZhcyA9IG51bGw7XG4gICAgc2VsZi5jdHggPSBudWxsOyAvL+a4suafk+eahOaXtuWAmeeUsXJlbmRlcmVy5Yaz5a6aLOi/memHjOS4jeWBmuWIneWni+WAvFxuICAgIC8vc3RhZ2XmraPlnKjmuLLmn5PkuK1cbiAgICBzZWxmLnN0YWdlUmVuZGluZyA9IGZhbHNlO1xuICAgIHNlbGYuX2lzUmVhZHkgPSBmYWxzZTtcbiAgICBTdGFnZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuVXRpbHMuY3JlYXRDbGFzcyggU3RhZ2UgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe30sXG4gICAgLy/nlLFjYW52YXjnmoRhZnRlckFkZENoaWxkIOWbnuiwg1xuICAgIGluaXRTdGFnZSA6IGZ1bmN0aW9uKCBjYW52YXMgLCB3aWR0aCAsIGhlaWdodCApe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBzZWxmLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICBzZWxmLmNvbnRleHQud2lkdGggID0gd2lkdGg7XG4gICAgICAgc2VsZi5jb250ZXh0LmhlaWdodCA9IGhlaWdodDtcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVYID0gVXRpbHMuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgc2VsZi5jb250ZXh0LnNjYWxlWSA9IFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgIHNlbGYuX2lzUmVhZHkgPSB0cnVlO1xuICAgIH0sXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAvL3NoYXBlICwgbmFtZSAsIHZhbHVlICwgcHJlVmFsdWUgXG4gICAgICAgIC8vZGlzcGxheUxpc3TkuK3mn5DkuKrlsZ7mgKfmlLnlj5jkuoZcbiAgICAgICAgaWYgKCF0aGlzLl9pc1JlYWR5KSB7XG4gICAgICAgICAgIC8v5Zyoc3RhZ2Xov5jmsqHliJ3lp4vljJblrozmr5XnmoTmg4XlhrXkuIvvvIzml6DpnIDlgZrku7vkvZXlpITnkIZcbiAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBvcHQgfHwgKCBvcHQgPSB7fSApOyAvL+WmguaenG9wdOS4uuepuu+8jOivtOaYjuWwseaYr+aXoOadoeS7tuWIt+aWsFxuICAgICAgICBvcHQuc3RhZ2UgICA9IHRoaXM7XG5cbiAgICAgICAgLy9UT0RP5Li05pe25YWI6L+Z5LmI5aSE55CGXG4gICAgICAgIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmhlYXJ0QmVhdChvcHQpO1xuICAgIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgU3RhZ2U7IiwiaW1wb3J0IHsgUkVOREVSRVJfVFlQRSB9IGZyb20gJy4uL2NvbnN0JztcbmltcG9ydCBBbmltYXRpb25GcmFtZSBmcm9tIFwiLi4vYW5pbWF0aW9uL0FuaW1hdGlvbkZyYW1lXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5c3RlbVJlbmRlcmVyIFxue1xuICAgIGNvbnN0cnVjdG9yKCB0eXBlPVJFTkRFUkVSX1RZUEUuVU5LTk9XTiAsIGFwcCApXG4gICAge1xuICAgIFx0dGhpcy50eXBlID0gdHlwZTsgLy8yY2FudmFzLDF3ZWJnbFxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcblxuICAgICAgICB0aGlzLnJlcXVlc3RBaWQgPSBudWxsO1xuXG5cdFx0dGhpcy5faGVhcnRCZWF0ID0gZmFsc2U7Ly/lv4Pot7PvvIzpu5jorqTkuLpmYWxzZe+8jOWNs2ZhbHNl55qE5pe25YCZ5byV5pOO5aSE5LqO6Z2Z6buY54q25oCBIHRydWXliJnlkK/liqjmuLLmn5NcblxuXHRcdHRoaXMuX3ByZVJlbmRlclRpbWUgPSAwO1xuICAgIH1cblxuICAgIC8v5aaC5p6c5byV5pOO5aSE5LqO6Z2Z6buY54q25oCB55qE6K+d77yM5bCx5Lya5ZCv5YqoXG4gICAgc3RhcnRFbnRlcigpXG4gICAge1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBpZiggIXNlbGYucmVxdWVzdEFpZCApe1xuICAgICAgICAgICBzZWxmLnJlcXVlc3RBaWQgPSBBbmltYXRpb25GcmFtZS5yZWdpc3RGcmFtZSgge1xuICAgICAgICAgICAgICAgaWQgOiBcImVudGVyRnJhbWVcIiwgLy/lkIzml7bogq/lrprlj6rmnInkuIDkuKplbnRlckZyYW1l55qEdGFza1xuICAgICAgICAgICAgICAgdGFzayA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZW50ZXJGcmFtZS5hcHBseShzZWxmKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfSApO1xuICAgICAgIH1cbiAgICB9XG5cbiAgICBlbnRlckZyYW1lKClcbiAgICB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy/kuI3nrqHmgI7kuYjmoLfvvIxlbnRlckZyYW1l5omn6KGM5LqG5bCx6KaB5oqKXG4gICAgICAgIC8vcmVxdWVzdEFpZCBudWxsIOaOiVxuICAgICAgICBzZWxmLnJlcXVlc3RBaWQgPSBudWxsO1xuICAgICAgICBVdGlscy5ub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaWYoIHNlbGYuX2hlYXJ0QmVhdCApe1xuXG4gICAgICAgICAgICBzZWxmLnJlbmRlciggdGhpcy5hcHAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VsZi5faGVhcnRCZWF0ID0gZmFsc2U7XG4gICAgICAgICAgICAvL+a4suafk+WujOS6hu+8jOaJk+S4iuacgOaWsOaXtumXtOaMq1xuICAgICAgICAgICAgc2VsZi5fcHJlUmVuZGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9jb252ZXJ0Q2FudmF4KG9wdClcbiAgICB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggbWUuYXBwLmNoaWxkcmVuICwgZnVuY3Rpb24oc3RhZ2Upe1xuICAgICAgICAgICAgc3RhZ2UuY29udGV4dFtvcHQubmFtZV0gPSBvcHQudmFsdWU7IFxuICAgICAgICB9ICk7ICBcbiAgICB9XG5cbiAgICBoZWFydEJlYXQoIG9wdCApXG4gICAge1xuICAgICAgICAvL2Rpc3BsYXlMaXN05Lit5p+Q5Liq5bGe5oCn5pS55Y+Y5LqGXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYoIG9wdCApe1xuICAgICAgICAgICAgLy/lv4Pot7PljIXmnInkuKTnp43vvIzkuIDnp43mmK/mn5DlhYPntKDnmoTlj6/op4blsZ7mgKfmlLnlj5jkuobjgILkuIDnp43mmK9jaGlsZHJlbuacieWPmOWKqFxuICAgICAgICAgICAgLy/liIbliKvlr7nlupRjb252ZXJ0VHlwZSAg5Li6IGNvbnRleHQgIGFuZCBjaGlsZHJlblxuICAgICAgICAgICAgaWYgKG9wdC5jb252ZXJ0VHlwZSA9PSBcImNvbnRleHRcIil7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlICAgPSBvcHQuc3RhZ2U7XG4gICAgICAgICAgICAgICAgdmFyIHNoYXBlICAgPSBvcHQuc2hhcGU7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgICAgPSBvcHQubmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgICA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlVmFsdWU9IG9wdC5wcmVWYWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmKCBzaGFwZS50eXBlID09IFwiY2FudmF4XCIgKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fY29udmVydENhbnZheChvcHQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuYXBwLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYXBwLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZihzaGFwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuYXBwLmNvbnZlcnRTdGFnZXNbIHN0YWdlLmlkIF0uY29udmVydFNoYXBlc1sgc2hhcGUuaWQgXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHAuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXS5jb252ZXJ0U2hhcGVzWyBzaGFwZS5pZCBdPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUgOiBzaGFwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydFR5cGUgOiBvcHQuY29udmVydFR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5bey57uP5LiK5oql5LqG6K+lIHNoYXBlIOeahOW/g+i3s+OAglxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAob3B0LmNvbnZlcnRUeXBlID09IFwiY2hpbGRyZW5cIil7XG4gICAgICAgICAgICAgICAgLy/lhYPntKDnu5PmnoTlj5jljJbvvIzmr5TlpoJhZGRjaGlsZCByZW1vdmVDaGlsZOetiVxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBvcHQudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHZhciBzdGFnZSA9IG9wdC5zcmMuZ2V0U3RhZ2UoKTtcbiAgICAgICAgICAgICAgICBpZiggc3RhZ2UgfHwgKHRhcmdldC50eXBlPT1cInN0YWdlXCIpICl7XG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c5pON5L2c55qE55uu5qCH5YWD57Sg5pivU3RhZ2VcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2UgPSBzdGFnZSB8fCB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFzZWxmLmFwcC5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHAuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlIDogc3RhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFvcHQuY29udmVydFR5cGUpe1xuICAgICAgICAgICAgICAgIC8v5peg5p2h5Lu26KaB5rGC5Yi35pawXG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gb3B0LnN0YWdlO1xuICAgICAgICAgICAgICAgIGlmKCFzZWxmLmFwcC5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFwcC5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlICxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/ml6DmnaHku7bopoHmsYLlhajpg6jliLfmlrDvvIzkuIDoiKznlKjlnKhyZXNpemXnrYnjgIJcbiAgICAgICAgICAgIF8uZWFjaCggc2VsZi5hcHAuY2hpbGRyZW4gLCBmdW5jdGlvbiggc3RhZ2UgLCBpICl7XG4gICAgICAgICAgICAgICAgc2VsZi5hcHAuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIXNlbGYuX2hlYXJ0QmVhdCl7XG4gICAgICAgICAgIC8v5aaC5p6c5Y+R546w5byV5pOO5Zyo6Z2Z6buY54q25oCB77yM6YKj5LmI5bCx5ZSk6YaS5byV5pOOXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgICAgIHNlbGYuc3RhcnRFbnRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WQpuWImeaZuuaFp+e7p+e7reehruiupOW/g+i3s1xuICAgICAgICAgICBzZWxmLl9oZWFydEJlYXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vLi4vY29uc3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNHcmFwaGljc1JlbmRlcmVyXG57XG4gICBcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcilcbiAgICB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICB9XG4gICAgXG4gICAgIC8qKlxuICAgICAqIEBwYXJhbSBkaXNwbGF5T2JqZWN0XG4gICAgICogQHN0YWdlIOS5n+WPr+S7pWRpc3BsYXlPYmplY3QuZ2V0U3RhZ2UoKeiOt+WPluOAglxuICAgICAqL1xuICAgIHJlbmRlcihkaXNwbGF5T2JqZWN0ICwgc3RhZ2UpXG4gICAge1xuXG4gICAgICAgIGNvbnN0IGdyYXBoaWNzID0gZGlzcGxheU9iamVjdC5ncmFwaGljcztcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyO1xuICAgICAgICBjb25zdCBjdHggPSBzdGFnZS5jdHg7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBkaXNwbGF5T2JqZWN0LmNvbnRleHQ7XG5cbiAgICAgICAgaWYoIGRpc3BsYXlPYmplY3QucGFyZW50ICl7XG4gICAgICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhICo9IGRpc3BsYXlPYmplY3QucGFyZW50LmNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmFwaGljcy5ncmFwaGljc0RhdGEubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBncmFwaGljcy5ncmFwaGljc0RhdGFbaV07XG4gICAgICAgICAgICBjb25zdCBzaGFwZSA9IGRhdGEuc2hhcGU7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpbGxTdHlsZSA9IGRhdGEuZmlsbFN0eWxlO1xuICAgICAgICAgICAgY29uc3Qgc3Ryb2tlU3R5bGUgPSBkYXRhLnN0cm9rZVN0eWxlO1xuXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gZGF0YS5saW5lV2lkdGg7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFNIQVBFUy5QT0xZKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyUG9seWdvbihzaGFwZS5wb2ludHMsIHNoYXBlLmNsb3NlZCwgY3R4KTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc0ZpbGwoKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IGRhdGEuZmlsbEFscGhhO1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNMaW5lKCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSBkYXRhLmxpbmVBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09IFNIQVBFUy5SRUNUKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICggZGF0YS5oYXNGaWxsKCkgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gZGF0YS5maWxsQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmaWxsU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdChzaGFwZS54LCBzaGFwZS55LCBzaGFwZS53aWR0aCwgc2hhcGUuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzTGluZSgpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gZGF0YS5saW5lQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlUmVjdChzaGFwZS54LCBzaGFwZS55LCBzaGFwZS53aWR0aCwgc2hhcGUuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09IFNIQVBFUy5DSVJDKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgLy8gVE9ETyAtIG5lZWQgdG8gYmUgVW5kZWZpbmVkIVxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjdHguYXJjKHNoYXBlLngsIHNoYXBlLnksIHNoYXBlLnJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc0ZpbGwoKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IGRhdGEuZmlsbEFscGhhO1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNMaW5lKCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSBkYXRhLmxpbmVBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09IFNIQVBFUy5FTElQKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IHcgPSBzaGFwZS53aWR0aCAqIDI7XG4gICAgICAgICAgICAgICAgY29uc3QgaCA9IHNoYXBlLmhlaWdodCAqIDI7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gc2hhcGUueCAtICh3IC8gMik7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IHNoYXBlLnkgLSAoaCAvIDIpO1xuXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qga2FwcGEgPSAwLjU1MjI4NDg7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3ggPSAodyAvIDIpICoga2FwcGE7IC8vIGNvbnRyb2wgcG9pbnQgb2Zmc2V0IGhvcml6b250YWxcbiAgICAgICAgICAgICAgICBjb25zdCBveSA9IChoIC8gMikgKiBrYXBwYTsgLy8gY29udHJvbCBwb2ludCBvZmZzZXQgdmVydGljYWxcbiAgICAgICAgICAgICAgICBjb25zdCB4ZSA9IHggKyB3OyAgICAgICAgICAgLy8geC1lbmRcbiAgICAgICAgICAgICAgICBjb25zdCB5ZSA9IHkgKyBoOyAgICAgICAgICAgLy8geS1lbmRcbiAgICAgICAgICAgICAgICBjb25zdCB4bSA9IHggKyAodyAvIDIpOyAgICAgICAvLyB4LW1pZGRsZVxuICAgICAgICAgICAgICAgIGNvbnN0IHltID0geSArIChoIC8gMik7ICAgICAgIC8vIHktbWlkZGxlXG5cbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHgsIHltKTtcbiAgICAgICAgICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyh4LCB5bSAtIG95LCB4bSAtIG94LCB5LCB4bSwgeSk7XG4gICAgICAgICAgICAgICAgY3R4LmJlemllckN1cnZlVG8oeG0gKyBveCwgeSwgeGUsIHltIC0gb3ksIHhlLCB5bSk7XG4gICAgICAgICAgICAgICAgY3R4LmJlemllckN1cnZlVG8oeGUsIHltICsgb3ksIHhtICsgb3gsIHllLCB4bSwgeWUpO1xuICAgICAgICAgICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHhtIC0gb3gsIHllLCB4LCB5bSArIG95LCB4LCB5bSk7XG5cbiAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNGaWxsKCkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSBkYXRhLmZpbGxBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzTGluZSgpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gZGF0YS5saW5lQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyUG9seWdvbihwb2ludHMsIGNsb3NlLCBjdHgpXG4gICAge1xuICAgICAgICBjdHgubW92ZVRvKHBvaW50c1swXSwgcG9pbnRzWzFdKTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IHBvaW50cy5sZW5ndGggLyAyOyArK2opXG4gICAgICAgIHtcbiAgICAgICAgICAgIGN0eC5saW5lVG8ocG9pbnRzW2ogKiAyXSwgcG9pbnRzWyhqICogMikgKyAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xvc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCBTeXN0ZW1SZW5kZXJlciBmcm9tICcuLi9TeXN0ZW1SZW5kZXJlcic7XG5pbXBvcnQgeyBSRU5ERVJFUl9UWVBFIH0gZnJvbSAnLi4vLi4vY29uc3QnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4uLy4uL3NldHRpbmdzJztcbmltcG9ydCBDR1IgZnJvbSBcIi4vQ2FudmFzR3JhcGhpY3NSZW5kZXJlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNSZW5kZXJlciBleHRlbmRzIFN5c3RlbVJlbmRlcmVyXG57XG4gICAgY29uc3RydWN0b3IoYXBwKVxuICAgIHtcbiAgICAgICAgc3VwZXIoUkVOREVSRVJfVFlQRS5DQU5WQVMsIGFwcCk7XG4gICAgICAgIHRoaXMuQ0dSID0gbmV3IENHUih0aGlzKTtcbiAgICB9XG5cbiAgICByZW5kZXIoIGFwcCApXG4gICAge1xuICAgIFx0dmFyIG1lID0gdGhpcztcbiAgICBcdF8uZWFjaChfLnZhbHVlcyggYXBwLmNvbnZlcnRTdGFnZXMgKSAsIGZ1bmN0aW9uKGNvbnZlcnRTdGFnZSl7XG4gICAgICAgICAgICBtZS5yZW5kZXJTdGFnZSggY29udmVydFN0YWdlLnN0YWdlICk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAuY29udmVydFN0YWdlcyA9IHt9O1xuICAgIH1cblxuICAgIHJlbmRlclN0YWdlKCBzdGFnZSApXG4gICAge1xuICAgICAgICBzdGFnZS5zdGFnZVJlbmRpbmcgPSB0cnVlO1xuICAgICAgICBzdGFnZS5jdHggPSBzdGFnZS5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICB0aGlzLl9jbGVhciggc3RhZ2UgKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyKCBzdGFnZSApO1xuICAgICAgICBzdGFnZS5zdGFnZVJlbmRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKCBzdGFnZSAsIGRpc3BsYXlPYmplY3QgKVxuICAgIHtcbiAgICAgICAgaWYoICFkaXNwbGF5T2JqZWN0ICl7XG4gICAgICAgICAgICBkaXNwbGF5T2JqZWN0ID0gc3RhZ2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoICFkaXNwbGF5T2JqZWN0LmNvbnRleHQudmlzaWJsZSB8fCBkaXNwbGF5T2JqZWN0LmNvbnRleHQuZ2xvYmFsQWxwaGEgPD0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjdHggPSBzdGFnZS5jdHg7XG5cbiAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0cmFuc0Zvcm0gPSBkaXNwbGF5T2JqZWN0Ll90cmFuc2Zvcm07XG4gICAgICAgIGlmKCAhdHJhbnNGb3JtICkge1xuICAgICAgICAgICAgdHJhbnNGb3JtID0gZGlzcGxheU9iamVjdC5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8v6L+Q55So55+p6Zi15byA5aeL5Y+Y5b2iXG4gICAgICAgIGN0eC50cmFuc2Zvcm0uYXBwbHkoIGN0eCAsIHRyYW5zRm9ybS50b0FycmF5KCkgKTtcblxuXG4gICAgICAgIGlmKCBkaXNwbGF5T2JqZWN0LmdyYXBoaWNzICl7XG4gICAgICAgICAgICB0aGlzLkNHUi5yZW5kZXIoIGRpc3BsYXlPYmplY3QgLCBzdGFnZSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBkaXNwbGF5T2JqZWN0LmNoaWxkcmVuICl7XG5cdCAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gZGlzcGxheU9iamVjdC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHQgICAgICAgIFx0dGhpcy5fcmVuZGVyKCBzdGFnZSAsIGRpc3BsYXlPYmplY3QuY2hpbGRyZW5baV0gKTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgX2NsZWFyKCBzdGFnZSApXG4gICAge1xuICAgICAgICAvL1RPRE866L+Z6YeM5pyJ54K5IOWlh+aAqu+8jCDkuYvliY3nmoTniYjmnKxjbGVhclJlY3TnmoTml7blgJnvvIzkuI3pnIDopoEgKlJFU09MVVRJT07vvIjliIbovqjnjofvvIlcbiAgICAgICAgc3RhZ2UuY3R4LmNsZWFyUmVjdCggMCwgMCwgdGhpcy5hcHAud2lkdGgqU2V0dGluZ3MuUkVTT0xVVElPTiAsIHRoaXMuYXBwLmhlaWdodCpTZXR0aW5ncy5SRVNPTFVUSU9OICk7XG4gICAgfVxufVxuXG4iLCIvKipcbiAqIEFwcGxpY2F0aW9uIHt7UEtHX1ZFUlNJT059fVxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDkuLvlvJXmk44g57G7XG4gKlxuICog6LSf6LSj5omA5pyJY2FudmFz55qE5bGC57qn566h55CG77yM5ZKM5b+D6Lez5py65Yi255qE5a6e546wLOaNleiOt+WIsOW/g+i3s+WMheWQjiBcbiAqIOWIhuWPkeWIsOWvueW6lOeahHN0YWdlKGNhbnZhcynmnaXnu5jliLblr7nlupTnmoTmlLnliqhcbiAqIOeEtuWQjiDpu5jorqTmnInlrp7njrDkuoZzaGFwZeeahCBtb3VzZW92ZXIgIG1vdXNlb3V0ICBkcmFnIOS6i+S7tlxuICpcbiAqKi9cblxuaW1wb3J0IFV0aWxzIGZyb20gXCIuL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gXCIuL2V2ZW50L0V2ZW50SGFuZGxlclwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vZGlzcGxheS9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCI7XG5pbXBvcnQgU3RhZ2UgZnJvbSBcIi4vZGlzcGxheS9TdGFnZVwiO1xuaW1wb3J0IFJlbmRlcmVyIGZyb20gXCIuL3JlbmRlcmVycy9jYW52YXMvQ2FudmFzUmVuZGVyZXJcIlxuXG5cbi8vdXRpbHNcbmltcG9ydCBfIGZyb20gXCIuL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCAkIGZyb20gXCIuL3V0aWxzL2RvbVwiO1xuXG5cbnZhciBBcHBsaWNhdGlvbiA9IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICB0aGlzLnR5cGUgPSBcImNhbnZheFwiO1xuICAgIHRoaXMuX2NpZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTAwKTsgXG4gICAgXG4gICAgdGhpcy5lbCA9ICQucXVlcnkob3B0LmVsKTtcblxuICAgIHRoaXMud2lkdGggPSBwYXJzZUludChcIndpZHRoXCIgIGluIG9wdCB8fCB0aGlzLmVsLm9mZnNldFdpZHRoICAsIDEwKTsgXG4gICAgdGhpcy5oZWlnaHQgPSBwYXJzZUludChcImhlaWdodFwiIGluIG9wdCB8fCB0aGlzLmVsLm9mZnNldEhlaWdodCAsIDEwKTsgXG5cbiAgICB2YXIgdmlld09iaiA9ICQuY3JlYXRlVmlldyh0aGlzLndpZHRoICwgdGhpcy5oZWlnaHQsIHRoaXMuX2NpZCk7XG4gICAgdGhpcy52aWV3ID0gdmlld09iai52aWV3O1xuICAgIHRoaXMuc3RhZ2VfYyA9IHZpZXdPYmouc3RhZ2VfYztcbiAgICB0aGlzLmRvbV9jID0gdmlld09iai5kb21fYztcbiAgICBcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZCggdGhpcy52aWV3ICk7XG5cbiAgICB0aGlzLnZpZXdPZmZzZXQgPSAkLm9mZnNldCh0aGlzLnZpZXcpO1xuICAgIHRoaXMubGFzdEdldFJPID0gMDsvL+acgOWQjuS4gOasoeiOt+WPliB2aWV3T2Zmc2V0IOeahOaXtumXtFxuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlciggdGhpcyApO1xuXG4gICAgdGhpcy5ldmVudCA9IG51bGw7XG5cbiAgICB0aGlzLl9idWZmZXJTdGFnZSA9IG51bGw7XG5cbiAgICAvL+aYr+WQpumYu+atoua1j+iniOWZqOm7mOiupOS6i+S7tueahOaJp+ihjFxuICAgIHRoaXMucHJldmVudERlZmF1bHQgPSB0cnVlO1xuICAgIGlmKCBvcHQucHJldmVudERlZmF1bHQgPT09IGZhbHNlICl7XG4gICAgICAgIHRoaXMucHJldmVudERlZmF1bHQgPSBmYWxzZVxuICAgIH07XG5cbiAgICAvL+ivpeWxnuaAp+WcqHN5c3RlblJlbmRlcumHjOmdouaTjeS9nO+8jOavj+W4p+eUseW/g+i3s+S4iuaKpeeahCDpnIDopoHph43nu5jnmoRzdGFnZXMg5YiX6KGoXG4gICAgdGhpcy5jb252ZXJ0U3RhZ2VzID0ge307XG5cbiAgICBBcHBsaWNhdGlvbi5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKEFwcGxpY2F0aW9uICwgRGlzcGxheU9iamVjdENvbnRhaW5lciAsIHtcbiAgICBpbml0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoICA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSB0aGlzLmhlaWdodDsgXG5cbiAgICAgICAgLy/nhLblkI7liJvlu7rkuIDkuKrnlKjkuo7nu5jliLbmv4DmtLsgc2hhcGUg55qEIHN0YWdlIOWIsGFjdGl2YXRpb25cbiAgICAgICAgdGhpcy5fY3JlYXRIb3ZlclN0YWdlKCk7XG5cbiAgICAgICAgLy/liJvlu7rkuIDkuKrlpoLmnpzopoHnlKjlg4/ntKDmo4DmtYvnmoTml7blgJnnmoTlrrnlmahcbiAgICAgICAgdGhpcy5fY3JlYXRlUGl4ZWxDb250ZXh0KCk7XG4gICAgICAgIFxuICAgIH0sXG4gICAgcmVnaXN0RXZlbnQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICAvL+WIneWni+WMluS6i+S7tuWnlOaJmOWIsHJvb3TlhYPntKDkuIrpnaJcbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBFdmVudEhhbmRsZXIoIHRoaXMgLCBvcHQpOztcbiAgICAgICAgdGhpcy5ldmVudC5pbml0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50O1xuICAgIH0sXG4gICAgcmVzaXplIDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAvL+mHjeaWsOiuvue9ruWdkOagh+ezu+e7nyDpq5jlrr0g562J44CCXG4gICAgICAgIHRoaXMud2lkdGggICAgICA9IHBhcnNlSW50KChvcHQgJiYgXCJ3aWR0aFwiIGluIG9wdCkgfHwgdGhpcy5lbC5vZmZzZXRXaWR0aCAgLCAxMCk7IFxuICAgICAgICB0aGlzLmhlaWdodCAgICAgPSBwYXJzZUludCgob3B0ICYmIFwiaGVpZ2h0XCIgaW4gb3B0KSB8fCB0aGlzLmVsLm9mZnNldEhlaWdodCAsIDEwKTsgXG5cbiAgICAgICAgdGhpcy52aWV3LnN0eWxlLndpZHRoICA9IHRoaXMud2lkdGggK1wicHhcIjtcbiAgICAgICAgdGhpcy52aWV3LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0K1wicHhcIjtcblxuICAgICAgICB0aGlzLnZpZXdPZmZzZXQgICAgID0gJC5vZmZzZXQodGhpcy52aWV3KTtcbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggICAgICA9IHRydWU7XG4gICAgICAgIHRoaXMuY29udGV4dC53aWR0aCAgPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIHRoaXMuX25vdFdhdGNoICAgICAgPSBmYWxzZTtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcmVTaXplQ2FudmFzICAgID0gZnVuY3Rpb24oY3R4KXtcbiAgICAgICAgICAgIHZhciBjYW52YXMgPSBjdHguY2FudmFzO1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gbWUud2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0PSBtZS5oZWlnaHQrIFwicHhcIjtcbiAgICAgICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiICAsIG1lLndpZHRoICogVXRpbHMuX2RldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiICwgbWUuaGVpZ2h0KiBVdGlscy5fZGV2aWNlUGl4ZWxSYXRpbyk7XG5cbiAgICAgICAgICAgIC8v5aaC5p6c5pivc3dm55qE6K+d5bCx6L+Y6KaB6LCD55So6L+Z5Liq5pa55rOV44CCXG4gICAgICAgICAgICBpZiAoY3R4LnJlc2l6ZSkge1xuICAgICAgICAgICAgICAgIGN0eC5yZXNpemUobWUud2lkdGggLCBtZS5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9OyBcbiAgICAgICAgXy5lYWNoKHRoaXMuY2hpbGRyZW4gLCBmdW5jdGlvbihzICwgaSl7XG4gICAgICAgICAgICBzLl9ub3RXYXRjaCAgICAgPSB0cnVlO1xuICAgICAgICAgICAgcy5jb250ZXh0LndpZHRoID0gbWUud2lkdGg7XG4gICAgICAgICAgICBzLmNvbnRleHQuaGVpZ2h0PSBtZS5oZWlnaHQ7XG4gICAgICAgICAgICByZVNpemVDYW52YXMocy5jYW52YXMpO1xuICAgICAgICAgICAgcy5fbm90V2F0Y2ggICAgID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZG9tX2Muc3R5bGUud2lkdGggID0gdGhpcy53aWR0aCAgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZG9tX2Muc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgdGhpcy5oZWFydEJlYXQoKTtcblxuICAgIH0sXG4gICAgZ2V0SG92ZXJTdGFnZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9idWZmZXJTdGFnZTtcbiAgICB9LFxuICAgIF9jcmVhdEhvdmVyU3RhZ2UgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL1RPRE865Yib5bu6c3RhZ2XnmoTml7blgJnkuIDlrpropoHkvKDlhaV3aWR0aCBoZWlnaHQgIOS4pOS4quWPguaVsFxuICAgICAgICB0aGlzLl9idWZmZXJTdGFnZSA9IG5ldyBTdGFnZSgge1xuICAgICAgICAgICAgaWQgOiBcImFjdGl2Q2FudmFzXCIrKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcbiAgICAgICAgICAgIGNvbnRleHQgOiB7XG4gICAgICAgICAgICAgICAgd2lkdGggOiB0aGlzLmNvbnRleHQud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmNvbnRleHQuaGVpZ2h0XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKTtcbiAgICAgICAgLy/or6VzdGFnZeS4jeWPguS4juS6i+S7tuajgOa1i1xuICAgICAgICB0aGlzLl9idWZmZXJTdGFnZS5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoIHRoaXMuX2J1ZmZlclN0YWdlICk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDnlKjmnaXmo4DmtYvmlofmnKx3aWR0aCBoZWlnaHQgXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDkuIrkuIvmlodcbiAgICAqL1xuICAgIF9jcmVhdGVQaXhlbENvbnRleHQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9waXhlbENhbnZhcyA9ICQucXVlcnkoXCJfcGl4ZWxDYW52YXNcIik7XG4gICAgICAgIGlmKCFfcGl4ZWxDYW52YXMpe1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzID0gJC5jcmVhdGVDYW52YXMoMCwgMCwgXCJfcGl4ZWxDYW52YXNcIik7IFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/lpoLmnpzlj4jnmoTor50g5bCx5LiN6ZyA6KaB5Zyo5Yib5bu65LqGXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIF9waXhlbENhbnZhcyApO1xuICAgICAgICBVdGlscy5pbml0RWxlbWVudCggX3BpeGVsQ2FudmFzICk7XG4gICAgICAgIGlmKCBVdGlscy5jYW52YXNTdXBwb3J0KCkgKXtcbiAgICAgICAgICAgIC8vY2FudmFz55qE6K+d77yM5ZOq5oCV5pivZGlzcGxheTpub25l55qE6aG15Y+v5Lul55So5p2l5bem5YOP57Sg5qOA5rWL5ZKMbWVhc3VyZVRleHTmlofmnKx3aWR0aOajgOa1i1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLmRpc3BsYXkgICAgPSBcIm5vbmVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vZmxhc2hDYW52YXMg55qE6K+d77yMc3dm5aaC5p6cZGlzcGxheTpub25l5LqG44CC5bCx5YGa5LiN5LqGbWVhc3VyZVRleHQg5paH5pys5a695bqmIOajgOa1i+S6hlxuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnpJbmRleCAgICAgPSAtMTtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS5wb3NpdGlvbiAgID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLmxlZnQgICAgICAgPSAtdGhpcy5jb250ZXh0LndpZHRoICArIFwicHhcIjtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS50b3AgICAgICAgID0gLXRoaXMuY29udGV4dC5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4ID0gX3BpeGVsQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgfSxcblxuICAgIHVwZGF0ZVZpZXdPZmZzZXQgOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGlmKCBub3cgLSB0aGlzLmxhc3RHZXRSTyA+IDEwMDAgKXtcbiAgICAgICAgICAgIHRoaXMudmlld09mZnNldCAgICAgID0gJC5vZmZzZXQodGhpcy52aWV3KTtcbiAgICAgICAgICAgIHRoaXMubGFzdEdldFJPICAgICAgID0gbm93O1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBfYWZ0ZXJBZGRDaGlsZCA6IGZ1bmN0aW9uKCBzdGFnZSAsIGluZGV4ICl7XG4gICAgICAgIHZhciBjYW52YXM7XG5cbiAgICAgICAgaWYoIXN0YWdlLmNhbnZhcyl7XG4gICAgICAgICAgICBjYW52YXMgPSAkLmNyZWF0ZUNhbnZhcyggdGhpcy5jb250ZXh0LndpZHRoICwgdGhpcy5jb250ZXh0LmhlaWdodCwgc3RhZ2UuaWQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcyA9IHN0YWdlLmNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgdGhpcy5zdGFnZV9jLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoPjEpIHtcbiAgICAgICAgICAgIGlmKCBpbmRleCA9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmsqHmnInmjIflrprkvY3nva7vvIzpgqPkuYjlsLHmlL7liLBfYnVmZmVyU3RhZ2XnmoTkuIvpnaLjgIJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlX2MuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLl9idWZmZXJTdGFnZS5jYW52YXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+WmguaenOacieaMh+WumueahOS9jee9ru+8jOmCo+S5iOWwseaMh+WumueahOS9jee9ruadpVxuICAgICAgICAgICAgICAgIGlmKCBpbmRleCA+PSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xICl7XG4gICAgICAgICAgICAgICAgICAgdGhpcy5zdGFnZV9jLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5pbnNlcnRCZWZvcmUoIGNhbnZhcyAsIHRoaXMuY2hpbGRyZW5bIGluZGV4IF0uY2FudmFzICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIFV0aWxzLmluaXRFbGVtZW50KCBjYW52YXMgKTtcbiAgICAgICAgc3RhZ2UuaW5pdFN0YWdlKCBjYW52YXMgLCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0ICk7IFxuICAgIH0sXG4gICAgX2FmdGVyRGVsQ2hpbGQgOiBmdW5jdGlvbihzdGFnZSl7XG4gICAgICAgIHRoaXMuc3RhZ2VfYy5yZW1vdmVDaGlsZCggc3RhZ2UuY2FudmFzICk7XG4gICAgfSxcbiAgICBcbiAgICBoZWFydEJlYXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmhlYXJ0QmVhdChvcHQpO1xuICAgIH1cbn0gKTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb247IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIOS4rSDnmoRzcHJpdGXnsbvvvIznm67liY3ov5jlj6rmmK/kuKrnroDljZXnmoTlrrnmmJPjgIJcbiAqL1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG52YXIgU3ByaXRlID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLnR5cGUgPSBcInNwcml0ZVwiO1xuICAgIFNwcml0ZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKFNwcml0ZSAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNwcml0ZTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWNzRGF0YVxue1xuICAgIGNvbnN0cnVjdG9yKGxpbmVXaWR0aCwgc3Ryb2tlU3R5bGUsIGxpbmVBbHBoYSwgZmlsbFN0eWxlLCBmaWxsQWxwaGEsIHNoYXBlKVxuICAgIHtcbiAgICAgICAgdGhpcy5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICAgIHRoaXMuc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZTtcbiAgICAgICAgdGhpcy5saW5lQWxwaGEgPSBsaW5lQWxwaGE7XG5cbiAgICAgICAgdGhpcy5maWxsU3R5bGUgPSBmaWxsU3R5bGU7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gZmlsbEFscGhhO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zaGFwZSA9IHNoYXBlO1xuICAgICAgICB0aGlzLnR5cGUgPSBzaGFwZS50eXBlO1xuXG4gICAgICAgIC8v6L+Z5Lik5Liq5Y+v5Lul6KKr5ZCO57ut5L+u5pS577yMIOWFt+acieS4gOelqOWQpuWGs+adg1xuICAgICAgICAvL+avlOWmgnBvbHlnb27nmoQg6Jma57q/5o+P6L6544CC5b+F6aG75ZyoZmlsbOeahHBvbHnkuIrpnaLorr7nva5saW5l5Li6ZmFsc2VcbiAgICAgICAgdGhpcy5maWxsID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gdHJ1ZTtcblxuICAgIH1cblxuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgR3JhcGhpY3NEYXRhKFxuICAgICAgICAgICAgdGhpcy5saW5lV2lkdGgsXG4gICAgICAgICAgICB0aGlzLnN0cm9rZVN0eWxlLFxuICAgICAgICAgICAgdGhpcy5saW5lQWxwaGEsXG4gICAgICAgICAgICB0aGlzLmZpbGxTdHlsZSxcbiAgICAgICAgICAgIHRoaXMuZmlsbEFscGhhLFxuICAgICAgICAgICAgdGhpcy5zaGFwZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8v5LuO5a6/5Li7Z3JhcGhpY3PkuK3lkIzmraXmnIDmlrDnmoRzdHlsZeWxnuaAp1xuICAgIHN5bnNTdHlsZSggZ3JhcGhpY3MgKVxuICAgIHtcbiAgICAgICAgLy/ku45zaGFwZeS4reaKiue7mOWbvumcgOimgeeahHN0eWxl5bGe5oCn5ZCM5q2l6L+H5p2lXG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gZ3JhcGhpY3MubGluZVdpZHRoO1xuICAgICAgICB0aGlzLnN0cm9rZVN0eWxlID0gZ3JhcGhpY3Muc3Ryb2tlU3R5bGU7XG4gICAgICAgIHRoaXMubGluZUFscGhhID0gZ3JhcGhpY3MubGluZUFscGhhO1xuXG4gICAgICAgIHRoaXMuZmlsbFN0eWxlID0gZ3JhcGhpY3MuZmlsbFN0eWxlO1xuICAgICAgICB0aGlzLmZpbGxBbHBoYSA9IGdyYXBoaWNzLmZpbGxBbHBoYTtcblxuICAgIH1cblxuICAgIGhhc0ZpbGwoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsbFN0eWxlICYmXG4gICAgICAgICAgICAgICB0aGlzLmZpbGwgJiYgXG4gICAgICAgICAgICAgICAoIHRoaXMuc2hhcGUuY2xvc2VkICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zaGFwZS5jbG9zZWQgKSAmJiBcbiAgICAgICAgICAgICAgIHRoaXMuZmlsbEFscGhhO1xuICAgIH1cblxuICAgIGhhc0xpbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Ryb2tlU3R5bGUgJiYgdGhpcy5saW5lV2lkdGggJiYgdGhpcy5saW5lQWxwaGEgJiYgdGhpcy5saW5lXG4gICAgfVxuXG4gICAgZGVzdHJveSgpXG4gICAge1xuICAgICAgICB0aGlzLnNoYXBlID0gbnVsbDtcbiAgICB9XG4gICAgXG59XG4iLCIvKipcbiAqIFRoZSBQb2ludCBvYmplY3QgcmVwcmVzZW50cyBhIGxvY2F0aW9uIGluIGEgdHdvLWRpbWVuc2lvbmFsIGNvb3JkaW5hdGUgc3lzdGVtLCB3aGVyZSB4IHJlcHJlc2VudHNcbiAqIHRoZSBob3Jpem9udGFsIGF4aXMgYW5kIHkgcmVwcmVzZW50cyB0aGUgdmVydGljYWwgYXhpcy5cbiAqXG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50XG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gLSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIHkgYXhpc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMClcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueCA9IHg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBwb2ludFxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5Qb2ludH0gYSBjb3B5IG9mIHRoZSBwb2ludFxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvcGllcyB4IGFuZCB5IGZyb20gdGhlIGdpdmVuIHBvaW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IHAgLSBUaGUgcG9pbnQgdG8gY29weS5cbiAgICAgKi9cbiAgICBjb3B5KHApXG4gICAge1xuICAgICAgICB0aGlzLnNldChwLngsIHAueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBwb2ludCBpcyBlcXVhbCB0byB0aGlzIHBvaW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IHAgLSBUaGUgcG9pbnQgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgZ2l2ZW4gcG9pbnQgZXF1YWwgdG8gdGhpcyBwb2ludFxuICAgICAqL1xuICAgIGVxdWFscyhwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIChwLnggPT09IHRoaXMueCkgJiYgKHAueSA9PT0gdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBwb2ludCB0byBhIG5ldyB4IGFuZCB5IHBvc2l0aW9uLlxuICAgICAqIElmIHkgaXMgb21pdHRlZCwgYm90aCB4IGFuZCB5IHdpbGwgYmUgc2V0IHRvIHguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gLSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgeSBheGlzXG4gICAgICovXG4gICAgc2V0KHgsIHkpXG4gICAge1xuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XG4gICAgICAgIHRoaXMueSA9IHkgfHwgKCh5ICE9PSAwKSA/IHRoaXMueCA6IDApO1xuICAgIH1cblxufVxuIiwiaW1wb3J0IFBvaW50IGZyb20gJy4vUG9pbnQnO1xuXG4vKipcbiAqIFRoZSBwaXhpIE1hdHJpeCBjbGFzcyBhcyBhbiBvYmplY3QsIHdoaWNoIG1ha2VzIGl0IGEgbG90IGZhc3RlcixcbiAqIGhlcmUgaXMgYSByZXByZXNlbnRhdGlvbiBvZiBpdCA6XG4gKiB8IGEgfCBiIHwgdHh8XG4gKiB8IGMgfCBkIHwgdHl8XG4gKiB8IDAgfCAwIHwgMSB8XG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRyaXhcbntcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYSA9IDE7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5iID0gMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmMgPSAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDFcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZCA9IDE7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eCA9IDA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eSA9IDA7XG5cbiAgICAgICAgdGhpcy5hcnJheSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIE1hdHJpeCBvYmplY3QgYmFzZWQgb24gdGhlIGdpdmVuIGFycmF5LiBUaGUgRWxlbWVudCB0byBNYXRyaXggbWFwcGluZyBvcmRlciBpcyBhcyBmb2xsb3dzOlxuICAgICAqXG4gICAgICogYSA9IGFycmF5WzBdXG4gICAgICogYiA9IGFycmF5WzFdXG4gICAgICogYyA9IGFycmF5WzNdXG4gICAgICogZCA9IGFycmF5WzRdXG4gICAgICogdHggPSBhcnJheVsyXVxuICAgICAqIHR5ID0gYXJyYXlbNV1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5IC0gVGhlIGFycmF5IHRoYXQgdGhlIG1hdHJpeCB3aWxsIGJlIHBvcHVsYXRlZCBmcm9tLlxuICAgICAqL1xuICAgIGZyb21BcnJheShhcnJheSlcbiAgICB7XG4gICAgICAgIHRoaXMuYSA9IGFycmF5WzBdO1xuICAgICAgICB0aGlzLmIgPSBhcnJheVsxXTtcbiAgICAgICAgdGhpcy5jID0gYXJyYXlbM107XG4gICAgICAgIHRoaXMuZCA9IGFycmF5WzRdO1xuICAgICAgICB0aGlzLnR4ID0gYXJyYXlbMl07XG4gICAgICAgIHRoaXMudHkgPSBhcnJheVs1XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXRzIHRoZSBtYXRyaXggcHJvcGVydGllc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGEgLSBNYXRyaXggY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGIgLSBNYXRyaXggY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGMgLSBNYXRyaXggY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGQgLSBNYXRyaXggY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR4IC0gTWF0cml4IGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eSAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIHNldChhLCBiLCBjLCBkLCB0eCwgdHkpXG4gICAge1xuICAgICAgICB0aGlzLmEgPSBhO1xuICAgICAgICB0aGlzLmIgPSBiO1xuICAgICAgICB0aGlzLmMgPSBjO1xuICAgICAgICB0aGlzLmQgPSBkO1xuICAgICAgICB0aGlzLnR4ID0gdHg7XG4gICAgICAgIHRoaXMudHkgPSB0eTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IGZyb20gdGhlIGN1cnJlbnQgTWF0cml4IG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJhbnNwb3NlIC0gV2hldGhlciB3ZSBuZWVkIHRvIHRyYW5zcG9zZSB0aGUgbWF0cml4IG9yIG5vdFxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fSBbb3V0PW5ldyBGbG9hdDMyQXJyYXkoOSldIC0gSWYgcHJvdmlkZWQgdGhlIGFycmF5IHdpbGwgYmUgYXNzaWduZWQgdG8gb3V0XG4gICAgICogQHJldHVybiB7bnVtYmVyW119IHRoZSBuZXdseSBjcmVhdGVkIGFycmF5IHdoaWNoIGNvbnRhaW5zIHRoZSBtYXRyaXhcbiAgICAgKi9cbiAgICB0b0FycmF5KHRyYW5zcG9zZSwgb3V0KVxuICAgIHtcbiAgICAgICAgaWYgKCF0aGlzLmFycmF5KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSg5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFycmF5ID0gb3V0IHx8IHRoaXMuYXJyYXk7XG5cbiAgICAgICAgaWYgKHRyYW5zcG9zZSlcbiAgICAgICAge1xuICAgICAgICAgICAgYXJyYXlbMF0gPSB0aGlzLmE7XG4gICAgICAgICAgICBhcnJheVsxXSA9IHRoaXMuYjtcbiAgICAgICAgICAgIGFycmF5WzJdID0gMDtcbiAgICAgICAgICAgIGFycmF5WzNdID0gdGhpcy5jO1xuICAgICAgICAgICAgYXJyYXlbNF0gPSB0aGlzLmQ7XG4gICAgICAgICAgICBhcnJheVs1XSA9IDA7XG4gICAgICAgICAgICBhcnJheVs2XSA9IHRoaXMudHg7XG4gICAgICAgICAgICBhcnJheVs3XSA9IHRoaXMudHk7XG4gICAgICAgICAgICBhcnJheVs4XSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnJheVswXSA9IHRoaXMuYTtcbiAgICAgICAgICAgIGFycmF5WzFdID0gdGhpcy5jO1xuICAgICAgICAgICAgYXJyYXlbMl0gPSB0aGlzLnR4O1xuICAgICAgICAgICAgYXJyYXlbM10gPSB0aGlzLmI7XG4gICAgICAgICAgICBhcnJheVs0XSA9IHRoaXMuZDtcbiAgICAgICAgICAgIGFycmF5WzVdID0gdGhpcy50eTtcbiAgICAgICAgICAgIGFycmF5WzZdID0gMDtcbiAgICAgICAgICAgIGFycmF5WzddID0gMDtcbiAgICAgICAgICAgIGFycmF5WzhdID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBuZXcgcG9zaXRpb24gd2l0aCB0aGUgY3VycmVudCB0cmFuc2Zvcm1hdGlvbiBhcHBsaWVkLlxuICAgICAqIENhbiBiZSB1c2VkIHRvIGdvIGZyb20gYSBjaGlsZCdzIGNvb3JkaW5hdGUgc3BhY2UgdG8gdGhlIHdvcmxkIGNvb3JkaW5hdGUgc3BhY2UuIChlLmcuIHJlbmRlcmluZylcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gcG9zIC0gVGhlIG9yaWdpblxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gW25ld1Bvc10gLSBUaGUgcG9pbnQgdGhhdCB0aGUgbmV3IHBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIChhbGxvd2VkIHRvIGJlIHNhbWUgYXMgaW5wdXQpXG4gICAgICogQHJldHVybiB7UElYSS5Qb2ludH0gVGhlIG5ldyBwb2ludCwgdHJhbnNmb3JtZWQgdGhyb3VnaCB0aGlzIG1hdHJpeFxuICAgICAqL1xuICAgIGFwcGx5KHBvcywgbmV3UG9zKVxuICAgIHtcbiAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQb2ludCgpO1xuXG4gICAgICAgIGNvbnN0IHggPSBwb3MueDtcbiAgICAgICAgY29uc3QgeSA9IHBvcy55O1xuXG4gICAgICAgIG5ld1Bvcy54ID0gKHRoaXMuYSAqIHgpICsgKHRoaXMuYyAqIHkpICsgdGhpcy50eDtcbiAgICAgICAgbmV3UG9zLnkgPSAodGhpcy5iICogeCkgKyAodGhpcy5kICogeSkgKyB0aGlzLnR5O1xuXG4gICAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgbmV3IHBvc2l0aW9uIHdpdGggdGhlIGludmVyc2Ugb2YgdGhlIGN1cnJlbnQgdHJhbnNmb3JtYXRpb24gYXBwbGllZC5cbiAgICAgKiBDYW4gYmUgdXNlZCB0byBnbyBmcm9tIHRoZSB3b3JsZCBjb29yZGluYXRlIHNwYWNlIHRvIGEgY2hpbGQncyBjb29yZGluYXRlIHNwYWNlLiAoZS5nLiBpbnB1dClcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gcG9zIC0gVGhlIG9yaWdpblxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gW25ld1Bvc10gLSBUaGUgcG9pbnQgdGhhdCB0aGUgbmV3IHBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIChhbGxvd2VkIHRvIGJlIHNhbWUgYXMgaW5wdXQpXG4gICAgICogQHJldHVybiB7UElYSS5Qb2ludH0gVGhlIG5ldyBwb2ludCwgaW52ZXJzZS10cmFuc2Zvcm1lZCB0aHJvdWdoIHRoaXMgbWF0cml4XG4gICAgICovXG4gICAgYXBwbHlJbnZlcnNlKHBvcywgbmV3UG9zKVxuICAgIHtcbiAgICAgICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQb2ludCgpO1xuXG4gICAgICAgIGNvbnN0IGlkID0gMSAvICgodGhpcy5hICogdGhpcy5kKSArICh0aGlzLmMgKiAtdGhpcy5iKSk7XG5cbiAgICAgICAgY29uc3QgeCA9IHBvcy54O1xuICAgICAgICBjb25zdCB5ID0gcG9zLnk7XG5cbiAgICAgICAgbmV3UG9zLnggPSAodGhpcy5kICogaWQgKiB4KSArICgtdGhpcy5jICogaWQgKiB5KSArICgoKHRoaXMudHkgKiB0aGlzLmMpIC0gKHRoaXMudHggKiB0aGlzLmQpKSAqIGlkKTtcbiAgICAgICAgbmV3UG9zLnkgPSAodGhpcy5hICogaWQgKiB5KSArICgtdGhpcy5iICogaWQgKiB4KSArICgoKC10aGlzLnR5ICogdGhpcy5hKSArICh0aGlzLnR4ICogdGhpcy5iKSkgKiBpZCk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1BvcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2xhdGVzIHRoZSBtYXRyaXggb24gdGhlIHggYW5kIHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBIb3cgbXVjaCB0byB0cmFuc2xhdGUgeCBieVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IEhvdyBtdWNoIHRvIHRyYW5zbGF0ZSB5IGJ5XG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgdHJhbnNsYXRlKHgsIHkpXG4gICAge1xuICAgICAgICB0aGlzLnR4ICs9IHg7XG4gICAgICAgIHRoaXMudHkgKz0geTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIGEgc2NhbGUgdHJhbnNmb3JtYXRpb24gdG8gdGhlIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSBhbW91bnQgdG8gc2NhbGUgaG9yaXpvbnRhbGx5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgVGhlIGFtb3VudCB0byBzY2FsZSB2ZXJ0aWNhbGx5XG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgc2NhbGUoeCwgeSlcbiAgICB7XG4gICAgICAgIHRoaXMuYSAqPSB4O1xuICAgICAgICB0aGlzLmQgKj0geTtcbiAgICAgICAgdGhpcy5jICo9IHg7XG4gICAgICAgIHRoaXMuYiAqPSB5O1xuICAgICAgICB0aGlzLnR4ICo9IHg7XG4gICAgICAgIHRoaXMudHkgKj0geTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIGEgcm90YXRpb24gdHJhbnNmb3JtYXRpb24gdG8gdGhlIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBpbiByYWRpYW5zLlxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIHJvdGF0ZShhbmdsZSlcbiAgICB7XG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgICAgIGNvbnN0IGExID0gdGhpcy5hO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuYztcbiAgICAgICAgY29uc3QgdHgxID0gdGhpcy50eDtcblxuICAgICAgICB0aGlzLmEgPSAoYTEgKiBjb3MpIC0gKHRoaXMuYiAqIHNpbik7XG4gICAgICAgIHRoaXMuYiA9IChhMSAqIHNpbikgKyAodGhpcy5iICogY29zKTtcbiAgICAgICAgdGhpcy5jID0gKGMxICogY29zKSAtICh0aGlzLmQgKiBzaW4pO1xuICAgICAgICB0aGlzLmQgPSAoYzEgKiBzaW4pICsgKHRoaXMuZCAqIGNvcyk7XG4gICAgICAgIHRoaXMudHggPSAodHgxICogY29zKSAtICh0aGlzLnR5ICogc2luKTtcbiAgICAgICAgdGhpcy50eSA9ICh0eDEgKiBzaW4pICsgKHRoaXMudHkgKiBjb3MpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGVuZHMgdGhlIGdpdmVuIE1hdHJpeCB0byB0aGlzIE1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5NYXRyaXh9IG1hdHJpeCAtIFRoZSBtYXRyaXggdG8gYXBwZW5kLlxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIGFwcGVuZChtYXRyaXgpXG4gICAge1xuICAgICAgICBjb25zdCBhMSA9IHRoaXMuYTtcbiAgICAgICAgY29uc3QgYjEgPSB0aGlzLmI7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jO1xuICAgICAgICBjb25zdCBkMSA9IHRoaXMuZDtcblxuICAgICAgICB0aGlzLmEgPSAobWF0cml4LmEgKiBhMSkgKyAobWF0cml4LmIgKiBjMSk7XG4gICAgICAgIHRoaXMuYiA9IChtYXRyaXguYSAqIGIxKSArIChtYXRyaXguYiAqIGQxKTtcbiAgICAgICAgdGhpcy5jID0gKG1hdHJpeC5jICogYTEpICsgKG1hdHJpeC5kICogYzEpO1xuICAgICAgICB0aGlzLmQgPSAobWF0cml4LmMgKiBiMSkgKyAobWF0cml4LmQgKiBkMSk7XG5cbiAgICAgICAgdGhpcy50eCA9IChtYXRyaXgudHggKiBhMSkgKyAobWF0cml4LnR5ICogYzEpICsgdGhpcy50eDtcbiAgICAgICAgdGhpcy50eSA9IChtYXRyaXgudHggKiBiMSkgKyAobWF0cml4LnR5ICogZDEpICsgdGhpcy50eTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBtYXRyaXggYmFzZWQgb24gYWxsIHRoZSBhdmFpbGFibGUgcHJvcGVydGllc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBQb3NpdGlvbiBvbiB0aGUgeCBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBQb3NpdGlvbiBvbiB0aGUgeSBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBpdm90WCAtIFBpdm90IG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGl2b3RZIC0gUGl2b3Qgb24gdGhlIHkgYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY2FsZVggLSBTY2FsZSBvbiB0aGUgeCBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNjYWxlWSAtIFNjYWxlIG9uIHRoZSB5IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm90YXRpb24gLSBSb3RhdGlvbiBpbiByYWRpYW5zXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNrZXdYIC0gU2tldyBvbiB0aGUgeCBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNrZXdZIC0gU2tldyBvbiB0aGUgeSBheGlzXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgc2V0VHJhbnNmb3JtKHgsIHksIHBpdm90WCwgcGl2b3RZLCBzY2FsZVgsIHNjYWxlWSwgcm90YXRpb24sIHNrZXdYLCBza2V3WSlcbiAgICB7XG4gICAgICAgIGNvbnN0IHNyID0gTWF0aC5zaW4ocm90YXRpb24pO1xuICAgICAgICBjb25zdCBjciA9IE1hdGguY29zKHJvdGF0aW9uKTtcbiAgICAgICAgY29uc3QgY3kgPSBNYXRoLmNvcyhza2V3WSk7XG4gICAgICAgIGNvbnN0IHN5ID0gTWF0aC5zaW4oc2tld1kpO1xuICAgICAgICBjb25zdCBuc3ggPSAtTWF0aC5zaW4oc2tld1gpO1xuICAgICAgICBjb25zdCBjeCA9IE1hdGguY29zKHNrZXdYKTtcblxuICAgICAgICBjb25zdCBhID0gY3IgKiBzY2FsZVg7XG4gICAgICAgIGNvbnN0IGIgPSBzciAqIHNjYWxlWDtcbiAgICAgICAgY29uc3QgYyA9IC1zciAqIHNjYWxlWTtcbiAgICAgICAgY29uc3QgZCA9IGNyICogc2NhbGVZO1xuXG4gICAgICAgIHRoaXMuYSA9IChjeSAqIGEpICsgKHN5ICogYyk7XG4gICAgICAgIHRoaXMuYiA9IChjeSAqIGIpICsgKHN5ICogZCk7XG4gICAgICAgIHRoaXMuYyA9IChuc3ggKiBhKSArIChjeCAqIGMpO1xuICAgICAgICB0aGlzLmQgPSAobnN4ICogYikgKyAoY3ggKiBkKTtcblxuICAgICAgICB0aGlzLnR4ID0geCArICgocGl2b3RYICogYSkgKyAocGl2b3RZICogYykpO1xuICAgICAgICB0aGlzLnR5ID0geSArICgocGl2b3RYICogYikgKyAocGl2b3RZICogZCkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByZXBlbmRzIHRoZSBnaXZlbiBNYXRyaXggdG8gdGhpcyBNYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuTWF0cml4fSBtYXRyaXggLSBUaGUgbWF0cml4IHRvIHByZXBlbmRcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBwcmVwZW5kKG1hdHJpeClcbiAgICB7XG4gICAgICAgIGNvbnN0IHR4MSA9IHRoaXMudHg7XG5cbiAgICAgICAgaWYgKG1hdHJpeC5hICE9PSAxIHx8IG1hdHJpeC5iICE9PSAwIHx8IG1hdHJpeC5jICE9PSAwIHx8IG1hdHJpeC5kICE9PSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBhMSA9IHRoaXMuYTtcbiAgICAgICAgICAgIGNvbnN0IGMxID0gdGhpcy5jO1xuXG4gICAgICAgICAgICB0aGlzLmEgPSAoYTEgKiBtYXRyaXguYSkgKyAodGhpcy5iICogbWF0cml4LmMpO1xuICAgICAgICAgICAgdGhpcy5iID0gKGExICogbWF0cml4LmIpICsgKHRoaXMuYiAqIG1hdHJpeC5kKTtcbiAgICAgICAgICAgIHRoaXMuYyA9IChjMSAqIG1hdHJpeC5hKSArICh0aGlzLmQgKiBtYXRyaXguYyk7XG4gICAgICAgICAgICB0aGlzLmQgPSAoYzEgKiBtYXRyaXguYikgKyAodGhpcy5kICogbWF0cml4LmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50eCA9ICh0eDEgKiBtYXRyaXguYSkgKyAodGhpcy50eSAqIG1hdHJpeC5jKSArIG1hdHJpeC50eDtcbiAgICAgICAgdGhpcy50eSA9ICh0eDEgKiBtYXRyaXguYikgKyAodGhpcy50eSAqIG1hdHJpeC5kKSArIG1hdHJpeC50eTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWNvbXBvc2VzIHRoZSBtYXRyaXggKHgsIHksIHNjYWxlWCwgc2NhbGVZLCBhbmQgcm90YXRpb24pIGFuZCBzZXRzIHRoZSBwcm9wZXJ0aWVzIG9uIHRvIGEgdHJhbnNmb3JtLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlRyYW5zZm9ybXxQSVhJLlRyYW5zZm9ybVN0YXRpY30gdHJhbnNmb3JtIC0gVGhlIHRyYW5zZm9ybSB0byBhcHBseSB0aGUgcHJvcGVydGllcyB0by5cbiAgICAgKiBAcmV0dXJuIHtQSVhJLlRyYW5zZm9ybXxQSVhJLlRyYW5zZm9ybVN0YXRpY30gVGhlIHRyYW5zZm9ybSB3aXRoIHRoZSBuZXdseSBhcHBsaWVkIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBkZWNvbXBvc2UodHJhbnNmb3JtKVxuICAgIHtcbiAgICAgICAgLy8gc29ydCBvdXQgcm90YXRpb24gLyBza2V3Li5cbiAgICAgICAgY29uc3QgYSA9IHRoaXMuYTtcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuYjtcbiAgICAgICAgY29uc3QgYyA9IHRoaXMuYztcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuZDtcblxuICAgICAgICBjb25zdCBza2V3WCA9IC1NYXRoLmF0YW4yKC1jLCBkKTtcbiAgICAgICAgY29uc3Qgc2tld1kgPSBNYXRoLmF0YW4yKGIsIGEpO1xuXG4gICAgICAgIGNvbnN0IGRlbHRhID0gTWF0aC5hYnMoc2tld1ggKyBza2V3WSk7XG5cbiAgICAgICAgaWYgKGRlbHRhIDwgMC4wMDAwMSlcbiAgICAgICAge1xuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uID0gc2tld1k7XG5cbiAgICAgICAgICAgIGlmIChhIDwgMCAmJiBkID49IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uICs9ICh0cmFuc2Zvcm0ucm90YXRpb24gPD0gMCkgPyBNYXRoLlBJIDogLU1hdGguUEk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyYW5zZm9ybS5za2V3LnggPSB0cmFuc2Zvcm0uc2tldy55ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5za2V3LnggPSBza2V3WDtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5za2V3LnkgPSBza2V3WTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5leHQgc2V0IHNjYWxlXG4gICAgICAgIHRyYW5zZm9ybS5zY2FsZS54ID0gTWF0aC5zcXJ0KChhICogYSkgKyAoYiAqIGIpKTtcbiAgICAgICAgdHJhbnNmb3JtLnNjYWxlLnkgPSBNYXRoLnNxcnQoKGMgKiBjKSArIChkICogZCkpO1xuXG4gICAgICAgIC8vIG5leHQgc2V0IHBvc2l0aW9uXG4gICAgICAgIHRyYW5zZm9ybS5wb3NpdGlvbi54ID0gdGhpcy50eDtcbiAgICAgICAgdHJhbnNmb3JtLnBvc2l0aW9uLnkgPSB0aGlzLnR5O1xuXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52ZXJ0cyB0aGlzIG1hdHJpeFxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgaW52ZXJ0KClcbiAgICB7XG4gICAgICAgIGNvbnN0IGExID0gdGhpcy5hO1xuICAgICAgICBjb25zdCBiMSA9IHRoaXMuYjtcbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmM7XG4gICAgICAgIGNvbnN0IGQxID0gdGhpcy5kO1xuICAgICAgICBjb25zdCB0eDEgPSB0aGlzLnR4O1xuICAgICAgICBjb25zdCBuID0gKGExICogZDEpIC0gKGIxICogYzEpO1xuXG4gICAgICAgIHRoaXMuYSA9IGQxIC8gbjtcbiAgICAgICAgdGhpcy5iID0gLWIxIC8gbjtcbiAgICAgICAgdGhpcy5jID0gLWMxIC8gbjtcbiAgICAgICAgdGhpcy5kID0gYTEgLyBuO1xuICAgICAgICB0aGlzLnR4ID0gKChjMSAqIHRoaXMudHkpIC0gKGQxICogdHgxKSkgLyBuO1xuICAgICAgICB0aGlzLnR5ID0gLSgoYTEgKiB0aGlzLnR5KSAtIChiMSAqIHR4MSkpIC8gbjtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhpcyBNYXRpeCB0byBhbiBpZGVudGl0eSAoZGVmYXVsdCkgbWF0cml4LlxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgaWRlbnRpdHkoKVxuICAgIHtcbiAgICAgICAgdGhpcy5hID0gMTtcbiAgICAgICAgdGhpcy5iID0gMDtcbiAgICAgICAgdGhpcy5jID0gMDtcbiAgICAgICAgdGhpcy5kID0gMTtcbiAgICAgICAgdGhpcy50eCA9IDA7XG4gICAgICAgIHRoaXMudHkgPSAwO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgTWF0cml4IG9iamVjdCB3aXRoIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGlzIG9uZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBBIGNvcHkgb2YgdGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KCk7XG5cbiAgICAgICAgbWF0cml4LmEgPSB0aGlzLmE7XG4gICAgICAgIG1hdHJpeC5iID0gdGhpcy5iO1xuICAgICAgICBtYXRyaXguYyA9IHRoaXMuYztcbiAgICAgICAgbWF0cml4LmQgPSB0aGlzLmQ7XG4gICAgICAgIG1hdHJpeC50eCA9IHRoaXMudHg7XG4gICAgICAgIG1hdHJpeC50eSA9IHRoaXMudHk7XG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSB2YWx1ZXMgb2YgdGhlIGdpdmVuIG1hdHJpeCB0byBiZSB0aGUgc2FtZSBhcyB0aGUgb25lcyBpbiB0aGlzIG1hdHJpeFxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLk1hdHJpeH0gbWF0cml4IC0gVGhlIG1hdHJpeCB0byBjb3B5IGZyb20uXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoZSBtYXRyaXggZ2l2ZW4gaW4gcGFyYW1ldGVyIHdpdGggaXRzIHZhbHVlcyB1cGRhdGVkLlxuICAgICAqL1xuICAgIGNvcHkobWF0cml4KVxuICAgIHtcbiAgICAgICAgbWF0cml4LmEgPSB0aGlzLmE7XG4gICAgICAgIG1hdHJpeC5iID0gdGhpcy5iO1xuICAgICAgICBtYXRyaXguYyA9IHRoaXMuYztcbiAgICAgICAgbWF0cml4LmQgPSB0aGlzLmQ7XG4gICAgICAgIG1hdHJpeC50eCA9IHRoaXMudHg7XG4gICAgICAgIG1hdHJpeC50eSA9IHRoaXMudHk7XG5cbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGRlZmF1bHQgKGlkZW50aXR5KSBtYXRyaXhcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAY29uc3RcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IElERU5USVRZKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSB0ZW1wIG1hdHJpeFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBjb25zdFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgVEVNUF9NQVRSSVgoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoKTtcbiAgICB9XG59XG4iLCIvLyBZb3VyIGZyaWVuZGx5IG5laWdoYm91ciBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EaWhlZHJhbF9ncm91cCBvZiBvcmRlciAxNlxuaW1wb3J0IE1hdHJpeCBmcm9tICcuL01hdHJpeCc7XG5cbmNvbnN0IHV4ID0gWzEsIDEsIDAsIC0xLCAtMSwgLTEsIDAsIDEsIDEsIDEsIDAsIC0xLCAtMSwgLTEsIDAsIDFdO1xuY29uc3QgdXkgPSBbMCwgMSwgMSwgMSwgMCwgLTEsIC0xLCAtMSwgMCwgMSwgMSwgMSwgMCwgLTEsIC0xLCAtMV07XG5jb25zdCB2eCA9IFswLCAtMSwgLTEsIC0xLCAwLCAxLCAxLCAxLCAwLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xXTtcbmNvbnN0IHZ5ID0gWzEsIDEsIDAsIC0xLCAtMSwgLTEsIDAsIDEsIC0xLCAtMSwgMCwgMSwgMSwgMSwgMCwgLTFdO1xuY29uc3QgdGVtcE1hdHJpY2VzID0gW107XG5cbmNvbnN0IG11bCA9IFtdO1xuXG5mdW5jdGlvbiBzaWdudW0oeClcbntcbiAgICBpZiAoeCA8IDApXG4gICAge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGlmICh4ID4gMClcbiAgICB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBpbml0KClcbntcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspXG4gICAge1xuICAgICAgICBjb25zdCByb3cgPSBbXTtcblxuICAgICAgICBtdWwucHVzaChyb3cpO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTY7IGorKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgX3V4ID0gc2lnbnVtKCh1eFtpXSAqIHV4W2pdKSArICh2eFtpXSAqIHV5W2pdKSk7XG4gICAgICAgICAgICBjb25zdCBfdXkgPSBzaWdudW0oKHV5W2ldICogdXhbal0pICsgKHZ5W2ldICogdXlbal0pKTtcbiAgICAgICAgICAgIGNvbnN0IF92eCA9IHNpZ251bSgodXhbaV0gKiB2eFtqXSkgKyAodnhbaV0gKiB2eVtqXSkpO1xuICAgICAgICAgICAgY29uc3QgX3Z5ID0gc2lnbnVtKCh1eVtpXSAqIHZ4W2pdKSArICh2eVtpXSAqIHZ5W2pdKSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgMTY7IGsrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAodXhba10gPT09IF91eCAmJiB1eVtrXSA9PT0gX3V5ICYmIHZ4W2tdID09PSBfdnggJiYgdnlba10gPT09IF92eSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5wdXNoKGspO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspXG4gICAge1xuICAgICAgICBjb25zdCBtYXQgPSBuZXcgTWF0cml4KCk7XG5cbiAgICAgICAgbWF0LnNldCh1eFtpXSwgdXlbaV0sIHZ4W2ldLCB2eVtpXSwgMCwgMCk7XG4gICAgICAgIHRlbXBNYXRyaWNlcy5wdXNoKG1hdCk7XG4gICAgfVxufVxuXG5pbml0KCk7XG5cbi8qKlxuICogSW1wbGVtZW50cyBEaWhlZHJhbCBHcm91cCBEXzgsIHNlZSBbZ3JvdXAgRDRde0BsaW5rIGh0dHA6Ly9tYXRod29ybGQud29sZnJhbS5jb20vRGloZWRyYWxHcm91cEQ0Lmh0bWx9LFxuICogRDggaXMgdGhlIHNhbWUgYnV0IHdpdGggZGlhZ29uYWxzLiBVc2VkIGZvciB0ZXh0dXJlIHJvdGF0aW9ucy5cbiAqXG4gKiBWZWN0b3IgeFgoaSksIHhZKGkpIGlzIFUtYXhpcyBvZiBzcHJpdGUgd2l0aCByb3RhdGlvbiBpXG4gKiBWZWN0b3IgeVkoaSksIHlZKGkpIGlzIFYtYXhpcyBvZiBzcHJpdGUgd2l0aCByb3RhdGlvbiBpXG4gKiBSb3RhdGlvbnM6IDAgZ3JhZCAoMCksIDkwIGdyYWQgKDIpLCAxODAgZ3JhZCAoNCksIDI3MCBncmFkICg2KVxuICogTWlycm9yczogdmVydGljYWwgKDgpLCBtYWluIGRpYWdvbmFsICgxMCksIGhvcml6b250YWwgKDEyKSwgcmV2ZXJzZSBkaWFnb25hbCAoMTQpXG4gKiBUaGlzIGlzIHRoZSBzbWFsbCBwYXJ0IG9mIGdhbWVvZmJvbWJzLmNvbSBwb3J0YWwgc3lzdGVtLiBJdCB3b3Jrcy5cbiAqXG4gKiBAYXV0aG9yIEl2YW4gQGl2YW5wb3BlbHlzaGV2XG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmNvbnN0IEdyb3VwRDggPSB7XG4gICAgRTogMCxcbiAgICBTRTogMSxcbiAgICBTOiAyLFxuICAgIFNXOiAzLFxuICAgIFc6IDQsXG4gICAgTlc6IDUsXG4gICAgTjogNixcbiAgICBORTogNyxcbiAgICBNSVJST1JfVkVSVElDQUw6IDgsXG4gICAgTUlSUk9SX0hPUklaT05UQUw6IDEyLFxuICAgIHVYOiAoaW5kKSA9PiB1eFtpbmRdLFxuICAgIHVZOiAoaW5kKSA9PiB1eVtpbmRdLFxuICAgIHZYOiAoaW5kKSA9PiB2eFtpbmRdLFxuICAgIHZZOiAoaW5kKSA9PiB2eVtpbmRdLFxuICAgIGludjogKHJvdGF0aW9uKSA9PlxuICAgIHtcbiAgICAgICAgaWYgKHJvdGF0aW9uICYgOClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHJvdGF0aW9uICYgMTU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKC1yb3RhdGlvbikgJiA3O1xuICAgIH0sXG4gICAgYWRkOiAocm90YXRpb25TZWNvbmQsIHJvdGF0aW9uRmlyc3QpID0+IG11bFtyb3RhdGlvblNlY29uZF1bcm90YXRpb25GaXJzdF0sXG4gICAgc3ViOiAocm90YXRpb25TZWNvbmQsIHJvdGF0aW9uRmlyc3QpID0+IG11bFtyb3RhdGlvblNlY29uZF1bR3JvdXBEOC5pbnYocm90YXRpb25GaXJzdCldLFxuXG4gICAgLyoqXG4gICAgICogQWRkcyAxODAgZGVncmVlcyB0byByb3RhdGlvbi4gQ29tbXV0YXRpdmUgb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIFBJWEkuR3JvdXBEOFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3RhdGlvbiAtIFRoZSBudW1iZXIgdG8gcm90YXRlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJvdGF0ZWQgbnVtYmVyXG4gICAgICovXG4gICAgcm90YXRlMTgwOiAocm90YXRpb24pID0+IHJvdGF0aW9uIF4gNCxcblxuICAgIC8qKlxuICAgICAqIEkgZG9udCBrbm93IHdoeSBzb21ldGltZXMgd2lkdGggYW5kIGhlaWdodHMgbmVlZHMgdG8gYmUgc3dhcHBlZC4gV2UnbGwgZml4IGl0IGxhdGVyLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIFBJWEkuR3JvdXBEOFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3RhdGlvbiAtIFRoZSBudW1iZXIgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB3aWR0aC9oZWlnaHQgc2hvdWxkIGJlIHN3YXBwZWQuXG4gICAgICovXG4gICAgaXNTd2FwV2lkdGhIZWlnaHQ6IChyb3RhdGlvbikgPT4gKHJvdGF0aW9uICYgMykgPT09IDIsXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgUElYSS5Hcm91cEQ4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR4IC0gVE9ET1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeSAtIFRPRE9cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVE9ET1xuICAgICAqL1xuICAgIGJ5RGlyZWN0aW9uOiAoZHgsIGR5KSA9PlxuICAgIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSAqIDIgPD0gTWF0aC5hYnMoZHkpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoZHkgPj0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR3JvdXBEOC5TO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gR3JvdXBEOC5OO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKGR5KSAqIDIgPD0gTWF0aC5hYnMoZHgpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoZHggPiAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBHcm91cEQ4LkU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBHcm91cEQ4Llc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHkgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoZHggPiAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBHcm91cEQ4LlNFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gR3JvdXBEOC5TVztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeCA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBHcm91cEQ4Lk5FO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEdyb3VwRDguTlc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhlbHBzIHNwcml0ZSB0byBjb21wZW5zYXRlIHRleHR1cmUgcGFja2VyIHJvdGF0aW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlcm9mIFBJWEkuR3JvdXBEOFxuICAgICAqIEBwYXJhbSB7UElYSS5NYXRyaXh9IG1hdHJpeCAtIHNwcml0ZSB3b3JsZCBtYXRyaXhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm90YXRpb24gLSBUaGUgcm90YXRpb24gZmFjdG9yIHRvIHVzZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHggLSBzcHJpdGUgYW5jaG9yaW5nXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR5IC0gc3ByaXRlIGFuY2hvcmluZ1xuICAgICAqL1xuICAgIG1hdHJpeEFwcGVuZFJvdGF0aW9uSW52OiAobWF0cml4LCByb3RhdGlvbiwgdHggPSAwLCB0eSA9IDApID0+XG4gICAge1xuICAgICAgICAvLyBQYWNrZXIgdXNlZCBcInJvdGF0aW9uXCIsIHdlIHVzZSBcImludihyb3RhdGlvbilcIlxuICAgICAgICBjb25zdCBtYXQgPSB0ZW1wTWF0cmljZXNbR3JvdXBEOC5pbnYocm90YXRpb24pXTtcblxuICAgICAgICBtYXQudHggPSB0eDtcbiAgICAgICAgbWF0LnR5ID0gdHk7XG4gICAgICAgIG1hdHJpeC5hcHBlbmQobWF0KTtcbiAgICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgR3JvdXBEODtcbiIsIlxudmFyIGFyY1RvU2VnbWVudHNDYWNoZSA9IHsgfSxcbiAgICBzZWdtZW50VG9CZXppZXJDYWNoZSA9IHsgfSxcbiAgICBib3VuZHNPZkN1cnZlQ2FjaGUgPSB7IH0sXG4gICAgX2pvaW4gPSBBcnJheS5wcm90b3R5cGUuam9pbjtcblxuLyogQWRhcHRlZCBmcm9tIGh0dHA6Ly9keHIubW96aWxsYS5vcmcvbW96aWxsYS1jZW50cmFsL3NvdXJjZS9jb250ZW50L3N2Zy9jb250ZW50L3NyYy9uc1NWR1BhdGhEYXRhUGFyc2VyLmNwcFxuICogYnkgQW5kcmVhIEJvZ2F6emkgY29kZSBpcyB1bmRlciBNUEwuIGlmIHlvdSBkb24ndCBoYXZlIGEgY29weSBvZiB0aGUgbGljZW5zZSB5b3UgY2FuIHRha2UgaXQgaGVyZVxuICogaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvXG4gKi9cbmZ1bmN0aW9uIGFyY1RvU2VnbWVudHModG9YLCB0b1ksIHJ4LCByeSwgbGFyZ2UsIHN3ZWVwLCByb3RhdGVYKSB7XG4gIHZhciBhcmdzU3RyaW5nID0gX2pvaW4uY2FsbChhcmd1bWVudHMpO1xuICBpZiAoYXJjVG9TZWdtZW50c0NhY2hlW2FyZ3NTdHJpbmddKSB7XG4gICAgcmV0dXJuIGFyY1RvU2VnbWVudHNDYWNoZVthcmdzU3RyaW5nXTtcbiAgfVxuXG4gIHZhciBQSSA9IE1hdGguUEksIHRoID0gcm90YXRlWCAqIFBJIC8gMTgwLFxuICAgICAgc2luVGggPSBNYXRoLnNpbih0aCksXG4gICAgICBjb3NUaCA9IE1hdGguY29zKHRoKSxcbiAgICAgIGZyb21YID0gMCwgZnJvbVkgPSAwO1xuXG4gIHJ4ID0gTWF0aC5hYnMocngpO1xuICByeSA9IE1hdGguYWJzKHJ5KTtcblxuICB2YXIgcHggPSAtY29zVGggKiB0b1ggKiAwLjUgLSBzaW5UaCAqIHRvWSAqIDAuNSxcbiAgICAgIHB5ID0gLWNvc1RoICogdG9ZICogMC41ICsgc2luVGggKiB0b1ggKiAwLjUsXG4gICAgICByeDIgPSByeCAqIHJ4LCByeTIgPSByeSAqIHJ5LCBweTIgPSBweSAqIHB5LCBweDIgPSBweCAqIHB4LFxuICAgICAgcGwgPSByeDIgKiByeTIgLSByeDIgKiBweTIgLSByeTIgKiBweDIsXG4gICAgICByb290ID0gMDtcblxuICBpZiAocGwgPCAwKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNxcnQoMSAtIHBsIC8gKHJ4MiAqIHJ5MikpO1xuICAgIHJ4ICo9IHM7XG4gICAgcnkgKj0gcztcbiAgfVxuICBlbHNlIHtcbiAgICByb290ID0gKGxhcmdlID09PSBzd2VlcCA/IC0xLjAgOiAxLjApICpcbiAgICAgICAgICAgIE1hdGguc3FydCggcGwgLyAocngyICogcHkyICsgcnkyICogcHgyKSk7XG4gIH1cblxuICB2YXIgY3ggPSByb290ICogcnggKiBweSAvIHJ5LFxuICAgICAgY3kgPSAtcm9vdCAqIHJ5ICogcHggLyByeCxcbiAgICAgIGN4MSA9IGNvc1RoICogY3ggLSBzaW5UaCAqIGN5ICsgdG9YICogMC41LFxuICAgICAgY3kxID0gc2luVGggKiBjeCArIGNvc1RoICogY3kgKyB0b1kgKiAwLjUsXG4gICAgICBtVGhldGEgPSBjYWxjVmVjdG9yQW5nbGUoMSwgMCwgKHB4IC0gY3gpIC8gcngsIChweSAtIGN5KSAvIHJ5KSxcbiAgICAgIGR0aGV0YSA9IGNhbGNWZWN0b3JBbmdsZSgocHggLSBjeCkgLyByeCwgKHB5IC0gY3kpIC8gcnksICgtcHggLSBjeCkgLyByeCwgKC1weSAtIGN5KSAvIHJ5KTtcblxuICBpZiAoc3dlZXAgPT09IDAgJiYgZHRoZXRhID4gMCkge1xuICAgIGR0aGV0YSAtPSAyICogUEk7XG4gIH1cbiAgZWxzZSBpZiAoc3dlZXAgPT09IDEgJiYgZHRoZXRhIDwgMCkge1xuICAgIGR0aGV0YSArPSAyICogUEk7XG4gIH1cblxuICAvLyBDb252ZXJ0IGludG8gY3ViaWMgYmV6aWVyIHNlZ21lbnRzIDw9IDkwZGVnXG4gIHZhciBzZWdtZW50cyA9IE1hdGguY2VpbChNYXRoLmFicyhkdGhldGEgLyBQSSAqIDIpKSxcbiAgICAgIHJlc3VsdCA9IFtdLCBtRGVsdGEgPSBkdGhldGEgLyBzZWdtZW50cyxcbiAgICAgIG1UID0gOCAvIDMgKiBNYXRoLnNpbihtRGVsdGEgLyA0KSAqIE1hdGguc2luKG1EZWx0YSAvIDQpIC8gTWF0aC5zaW4obURlbHRhIC8gMiksXG4gICAgICB0aDMgPSBtVGhldGEgKyBtRGVsdGE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50czsgaSsrKSB7XG4gICAgcmVzdWx0W2ldID0gc2VnbWVudFRvQmV6aWVyKG1UaGV0YSwgdGgzLCBjb3NUaCwgc2luVGgsIHJ4LCByeSwgY3gxLCBjeTEsIG1ULCBmcm9tWCwgZnJvbVkpO1xuICAgIGZyb21YID0gcmVzdWx0W2ldWzRdO1xuICAgIGZyb21ZID0gcmVzdWx0W2ldWzVdO1xuICAgIG1UaGV0YSA9IHRoMztcbiAgICB0aDMgKz0gbURlbHRhO1xuICB9XG4gIGFyY1RvU2VnbWVudHNDYWNoZVthcmdzU3RyaW5nXSA9IHJlc3VsdDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2VnbWVudFRvQmV6aWVyKHRoMiwgdGgzLCBjb3NUaCwgc2luVGgsIHJ4LCByeSwgY3gxLCBjeTEsIG1ULCBmcm9tWCwgZnJvbVkpIHtcbiAgdmFyIGFyZ3NTdHJpbmcyID0gX2pvaW4uY2FsbChhcmd1bWVudHMpO1xuICBpZiAoc2VnbWVudFRvQmV6aWVyQ2FjaGVbYXJnc1N0cmluZzJdKSB7XG4gICAgcmV0dXJuIHNlZ21lbnRUb0JlemllckNhY2hlW2FyZ3NTdHJpbmcyXTtcbiAgfVxuXG4gIHZhciBjb3N0aDIgPSBNYXRoLmNvcyh0aDIpLFxuICAgICAgc2ludGgyID0gTWF0aC5zaW4odGgyKSxcbiAgICAgIGNvc3RoMyA9IE1hdGguY29zKHRoMyksXG4gICAgICBzaW50aDMgPSBNYXRoLnNpbih0aDMpLFxuICAgICAgdG9YID0gY29zVGggKiByeCAqIGNvc3RoMyAtIHNpblRoICogcnkgKiBzaW50aDMgKyBjeDEsXG4gICAgICB0b1kgPSBzaW5UaCAqIHJ4ICogY29zdGgzICsgY29zVGggKiByeSAqIHNpbnRoMyArIGN5MSxcbiAgICAgIGNwMVggPSBmcm9tWCArIG1UICogKCAtY29zVGggKiByeCAqIHNpbnRoMiAtIHNpblRoICogcnkgKiBjb3N0aDIpLFxuICAgICAgY3AxWSA9IGZyb21ZICsgbVQgKiAoIC1zaW5UaCAqIHJ4ICogc2ludGgyICsgY29zVGggKiByeSAqIGNvc3RoMiksXG4gICAgICBjcDJYID0gdG9YICsgbVQgKiAoIGNvc1RoICogcnggKiBzaW50aDMgKyBzaW5UaCAqIHJ5ICogY29zdGgzKSxcbiAgICAgIGNwMlkgPSB0b1kgKyBtVCAqICggc2luVGggKiByeCAqIHNpbnRoMyAtIGNvc1RoICogcnkgKiBjb3N0aDMpO1xuXG4gIHNlZ21lbnRUb0JlemllckNhY2hlW2FyZ3NTdHJpbmcyXSA9IFtcbiAgICBjcDFYLCBjcDFZLFxuICAgIGNwMlgsIGNwMlksXG4gICAgdG9YLCB0b1lcbiAgXTtcbiAgcmV0dXJuIHNlZ21lbnRUb0JlemllckNhY2hlW2FyZ3NTdHJpbmcyXTtcbn1cblxuLypcbiAqIFByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2FsY1ZlY3RvckFuZ2xlKHV4LCB1eSwgdngsIHZ5KSB7XG4gIHZhciB0YSA9IE1hdGguYXRhbjIodXksIHV4KSxcbiAgICAgIHRiID0gTWF0aC5hdGFuMih2eSwgdngpO1xuICBpZiAodGIgPj0gdGEpIHtcbiAgICByZXR1cm4gdGIgLSB0YTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gMiAqIE1hdGguUEkgLSAodGEgLSB0Yik7XG4gIH1cbn1cblxuLyoqXG4gKiBEcmF3cyBhcmNcbiAqIEBwYXJhbSB7Z3JhcGhpY3N9IGdyYXBoaWNzXG4gKiBAcGFyYW0ge051bWJlcn0gZnhcbiAqIEBwYXJhbSB7TnVtYmVyfSBmeVxuICogQHBhcmFtIHtBcnJheX0gY29vcmRzXG4gKi9cbnZhciBkcmF3QXJjID0gZnVuY3Rpb24oZ3JhcGhpY3MgLCBmeCwgZnksIGNvb3Jkcykge1xuICB2YXIgcnggPSBjb29yZHNbMF0sXG4gICAgICByeSA9IGNvb3Jkc1sxXSxcbiAgICAgIHJvdCA9IGNvb3Jkc1syXSxcbiAgICAgIGxhcmdlID0gY29vcmRzWzNdLFxuICAgICAgc3dlZXAgPSBjb29yZHNbNF0sXG4gICAgICB0eCA9IGNvb3Jkc1s1XSxcbiAgICAgIHR5ID0gY29vcmRzWzZdLFxuICAgICAgc2VncyA9IFtbXSwgW10sIFtdLCBbXV0sXG4gICAgICBzZWdzTm9ybSA9IGFyY1RvU2VnbWVudHModHggLSBmeCwgdHkgLSBmeSwgcngsIHJ5LCBsYXJnZSwgc3dlZXAsIHJvdCk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlZ3NOb3JtLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgc2Vnc1tpXVswXSA9IHNlZ3NOb3JtW2ldWzBdICsgZng7XG4gICAgc2Vnc1tpXVsxXSA9IHNlZ3NOb3JtW2ldWzFdICsgZnk7XG4gICAgc2Vnc1tpXVsyXSA9IHNlZ3NOb3JtW2ldWzJdICsgZng7XG4gICAgc2Vnc1tpXVszXSA9IHNlZ3NOb3JtW2ldWzNdICsgZnk7XG4gICAgc2Vnc1tpXVs0XSA9IHNlZ3NOb3JtW2ldWzRdICsgZng7XG4gICAgc2Vnc1tpXVs1XSA9IHNlZ3NOb3JtW2ldWzVdICsgZnk7XG4gICAgZ3JhcGhpY3MuYmV6aWVyQ3VydmVUby5hcHBseShncmFwaGljcywgc2Vnc1tpXSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlIGJvdW5kaW5nIGJveCBvZiBhIGVsbGlwdGljLWFyY1xuICogQHBhcmFtIHtOdW1iZXJ9IGZ4IHN0YXJ0IHBvaW50IG9mIGFyY1xuICogQHBhcmFtIHtOdW1iZXJ9IGZ5XG4gKiBAcGFyYW0ge051bWJlcn0gcnggaG9yaXpvbnRhbCByYWRpdXNcbiAqIEBwYXJhbSB7TnVtYmVyfSByeSB2ZXJ0aWNhbCByYWRpdXNcbiAqIEBwYXJhbSB7TnVtYmVyfSByb3QgYW5nbGUgb2YgaG9yaXpvbnRhbCBheGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBsYXJnZSAxIG9yIDAsIHdoYXRldmVyIHRoZSBhcmMgaXMgdGhlIGJpZyBvciB0aGUgc21hbGwgb24gdGhlIDIgcG9pbnRzXG4gKiBAcGFyYW0ge051bWJlcn0gc3dlZXAgMSBvciAwLCAxIGNsb2Nrd2lzZSBvciBjb3VudGVyY2xvY2t3aXNlIGRpcmVjdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IHR4IGVuZCBwb2ludCBvZiBhcmNcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eVxuICovXG52YXIgZ2V0Qm91bmRzT2ZBcmMgPSBmdW5jdGlvbihmeCwgZnksIHJ4LCByeSwgcm90LCBsYXJnZSwgc3dlZXAsIHR4LCB0eSkge1xuXG4gIHZhciBmcm9tWCA9IDAsIGZyb21ZID0gMCwgYm91bmQsIGJvdW5kcyA9IFtdLFxuICAgICAgc2VncyA9IGFyY1RvU2VnbWVudHModHggLSBmeCwgdHkgLSBmeSwgcngsIHJ5LCBsYXJnZSwgc3dlZXAsIHJvdCk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBib3VuZCA9IGdldEJvdW5kc09mQ3VydmUoZnJvbVgsIGZyb21ZLCBzZWdzW2ldWzBdLCBzZWdzW2ldWzFdLCBzZWdzW2ldWzJdLCBzZWdzW2ldWzNdLCBzZWdzW2ldWzRdLCBzZWdzW2ldWzVdKTtcbiAgICBib3VuZHMucHVzaCh7IHg6IGJvdW5kWzBdLnggKyBmeCwgeTogYm91bmRbMF0ueSArIGZ5IH0pO1xuICAgIGJvdW5kcy5wdXNoKHsgeDogYm91bmRbMV0ueCArIGZ4LCB5OiBib3VuZFsxXS55ICsgZnkgfSk7XG4gICAgZnJvbVggPSBzZWdzW2ldWzRdO1xuICAgIGZyb21ZID0gc2Vnc1tpXVs1XTtcbiAgfVxuICByZXR1cm4gYm91bmRzO1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGUgYm91bmRpbmcgYm94IG9mIGEgYmV6aWVyY3VydmVcbiAqIEBwYXJhbSB7TnVtYmVyfSB4MCBzdGFydGluZyBwb2ludFxuICogQHBhcmFtIHtOdW1iZXJ9IHkwXG4gKiBAcGFyYW0ge051bWJlcn0geDEgZmlyc3QgY29udHJvbCBwb2ludFxuICogQHBhcmFtIHtOdW1iZXJ9IHkxXG4gKiBAcGFyYW0ge051bWJlcn0geDIgc2Vjb25kbyBjb250cm9sIHBvaW50XG4gKiBAcGFyYW0ge051bWJlcn0geTJcbiAqIEBwYXJhbSB7TnVtYmVyfSB4MyBlbmQgb2YgYmVpemVyXG4gKiBAcGFyYW0ge051bWJlcn0geTNcbiAqL1xuLy8gdGFrZW4gZnJvbSBodHRwOi8vanNiaW4uY29tL2l2b21pcS81Ni9lZGl0ICBubyBjcmVkaXRzIGF2YWlsYWJsZSBmb3IgdGhhdC5cbmZ1bmN0aW9uIGdldEJvdW5kc09mQ3VydmUoeDAsIHkwLCB4MSwgeTEsIHgyLCB5MiwgeDMsIHkzKSB7XG4gIHZhciBhcmdzU3RyaW5nID0gX2pvaW4uY2FsbChhcmd1bWVudHMpO1xuICBpZiAoYm91bmRzT2ZDdXJ2ZUNhY2hlW2FyZ3NTdHJpbmddKSB7XG4gICAgcmV0dXJuIGJvdW5kc09mQ3VydmVDYWNoZVthcmdzU3RyaW5nXTtcbiAgfVxuXG4gIHZhciBzcXJ0ID0gTWF0aC5zcXJ0LFxuICAgICAgbWluID0gTWF0aC5taW4sIG1heCA9IE1hdGgubWF4LFxuICAgICAgYWJzID0gTWF0aC5hYnMsIHR2YWx1ZXMgPSBbXSxcbiAgICAgIGJvdW5kcyA9IFtbXSwgW11dLFxuICAgICAgYSwgYiwgYywgdCwgdDEsIHQyLCBiMmFjLCBzcXJ0YjJhYztcblxuICBiID0gNiAqIHgwIC0gMTIgKiB4MSArIDYgKiB4MjtcbiAgYSA9IC0zICogeDAgKyA5ICogeDEgLSA5ICogeDIgKyAzICogeDM7XG4gIGMgPSAzICogeDEgLSAzICogeDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyArK2kpIHtcbiAgICBpZiAoaSA+IDApIHtcbiAgICAgIGIgPSA2ICogeTAgLSAxMiAqIHkxICsgNiAqIHkyO1xuICAgICAgYSA9IC0zICogeTAgKyA5ICogeTEgLSA5ICogeTIgKyAzICogeTM7XG4gICAgICBjID0gMyAqIHkxIC0gMyAqIHkwO1xuICAgIH1cblxuICAgIGlmIChhYnMoYSkgPCAxZS0xMikge1xuICAgICAgaWYgKGFicyhiKSA8IDFlLTEyKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdCA9IC1jIC8gYjtcbiAgICAgIGlmICgwIDwgdCAmJiB0IDwgMSkge1xuICAgICAgICB0dmFsdWVzLnB1c2godCk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgYjJhYyA9IGIgKiBiIC0gNCAqIGMgKiBhO1xuICAgIGlmIChiMmFjIDwgMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHNxcnRiMmFjID0gc3FydChiMmFjKTtcbiAgICB0MSA9ICgtYiArIHNxcnRiMmFjKSAvICgyICogYSk7XG4gICAgaWYgKDAgPCB0MSAmJiB0MSA8IDEpIHtcbiAgICAgIHR2YWx1ZXMucHVzaCh0MSk7XG4gICAgfVxuICAgIHQyID0gKC1iIC0gc3FydGIyYWMpIC8gKDIgKiBhKTtcbiAgICBpZiAoMCA8IHQyICYmIHQyIDwgMSkge1xuICAgICAgdHZhbHVlcy5wdXNoKHQyKTtcbiAgICB9XG4gIH1cblxuICB2YXIgeCwgeSwgaiA9IHR2YWx1ZXMubGVuZ3RoLCBqbGVuID0gaiwgbXQ7XG4gIHdoaWxlIChqLS0pIHtcbiAgICB0ID0gdHZhbHVlc1tqXTtcbiAgICBtdCA9IDEgLSB0O1xuICAgIHggPSAobXQgKiBtdCAqIG10ICogeDApICsgKDMgKiBtdCAqIG10ICogdCAqIHgxKSArICgzICogbXQgKiB0ICogdCAqIHgyKSArICh0ICogdCAqIHQgKiB4Myk7XG4gICAgYm91bmRzWzBdW2pdID0geDtcblxuICAgIHkgPSAobXQgKiBtdCAqIG10ICogeTApICsgKDMgKiBtdCAqIG10ICogdCAqIHkxKSArICgzICogbXQgKiB0ICogdCAqIHkyKSArICh0ICogdCAqIHQgKiB5Myk7XG4gICAgYm91bmRzWzFdW2pdID0geTtcbiAgfVxuXG4gIGJvdW5kc1swXVtqbGVuXSA9IHgwO1xuICBib3VuZHNbMV1bamxlbl0gPSB5MDtcbiAgYm91bmRzWzBdW2psZW4gKyAxXSA9IHgzO1xuICBib3VuZHNbMV1bamxlbiArIDFdID0geTM7XG4gIHZhciByZXN1bHQgPSBbXG4gICAge1xuICAgICAgeDogbWluLmFwcGx5KG51bGwsIGJvdW5kc1swXSksXG4gICAgICB5OiBtaW4uYXBwbHkobnVsbCwgYm91bmRzWzFdKVxuICAgIH0sXG4gICAge1xuICAgICAgeDogbWF4LmFwcGx5KG51bGwsIGJvdW5kc1swXSksXG4gICAgICB5OiBtYXguYXBwbHkobnVsbCwgYm91bmRzWzFdKVxuICAgIH1cbiAgXTtcbiAgYm91bmRzT2ZDdXJ2ZUNhY2hlW2FyZ3NTdHJpbmddID0gcmVzdWx0O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBkcmF3QXJjOiBkcmF3QXJjLFxuICAgIGdldEJvdW5kc09mQ3VydmU6IGdldEJvdW5kc09mQ3VydmUsXG4gICAgZ2V0Qm91bmRzT2ZBcmM6IGdldEJvdW5kc09mQXJjXG59XG5cbiIsImltcG9ydCB7IFNIQVBFUyB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuLyoqXG4gKiBSZWN0YW5nbGUgb2JqZWN0IGlzIGFuIGFyZWEgZGVmaW5lZCBieSBpdHMgcG9zaXRpb24sIGFzIGluZGljYXRlZCBieSBpdHMgdG9wLWxlZnQgY29ybmVyXG4gKiBwb2ludCAoeCwgeSkgYW5kIGJ5IGl0cyB3aWR0aCBhbmQgaXRzIGhlaWdodC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZVxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHVwcGVyLWxlZnQgY29ybmVyIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSB1cHBlci1sZWZ0IGNvcm5lciBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aD0wXSAtIFRoZSBvdmVyYWxsIHdpZHRoIG9mIHRoaXMgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtoZWlnaHQ9MF0gLSBUaGUgb3ZlcmFsbCBoZWlnaHQgb2YgdGhpcyByZWN0YW5nbGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMClcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueCA9IHg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy55ID0geTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QsIG1haW5seSB1c2VkIHRvIGF2b2lkIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgUElYSS5TSEFQRVMuUkVDVFxuICAgICAgICAgKiBAc2VlIFBJWEkuU0hBUEVTXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5cGUgPSBTSEFQRVMuUkVDVDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBsZWZ0KClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHJpZ2h0KClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIHRvcCBlZGdlIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgdG9wKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgYm90dG9tIGVkZ2Ugb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBib3R0b20oKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgY29uc3RhbnQgZW1wdHkgcmVjdGFuZ2xlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBjb25zdGFudFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgRU1QVFkoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUoMCwgMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoaXMgUmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlJlY3RhbmdsZX0gYSBjb3B5IG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKi9cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvcGllcyBhbm90aGVyIHJlY3RhbmdsZSB0byB0aGlzIG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5SZWN0YW5nbGV9IHJlY3RhbmdsZSAtIFRoZSByZWN0YW5nbGUgdG8gY29weS5cbiAgICAgKiBAcmV0dXJuIHtQSVhJLlJlY3RhbmdsZX0gUmV0dXJucyBpdHNlbGYuXG4gICAgICovXG4gICAgY29weShyZWN0YW5nbGUpXG4gICAge1xuICAgICAgICB0aGlzLnggPSByZWN0YW5nbGUueDtcbiAgICAgICAgdGhpcy55ID0gcmVjdGFuZ2xlLnk7XG4gICAgICAgIHRoaXMud2lkdGggPSByZWN0YW5nbGUud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVjdGFuZ2xlLmhlaWdodDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBnaXZlbiBhcmUgY29udGFpbmVkIHdpdGhpbiB0aGlzIFJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkaW5hdGVzIGFyZSB3aXRoaW4gdGhpcyBSZWN0YW5nbGVcbiAgICAgKi9cbiAgICBjb250YWlucyh4LCB5KVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPD0gMCB8fCB0aGlzLmhlaWdodCA8PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoeCA+PSB0aGlzLnggJiYgeCA8IHRoaXMueCArIHRoaXMud2lkdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh5ID49IHRoaXMueSAmJiB5IDwgdGhpcy55ICsgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFkcyB0aGUgcmVjdGFuZ2xlIG1ha2luZyBpdCBncm93IGluIGFsbCBkaXJlY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmdYIC0gVGhlIGhvcml6b250YWwgcGFkZGluZyBhbW91bnQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmdZIC0gVGhlIHZlcnRpY2FsIHBhZGRpbmcgYW1vdW50LlxuICAgICAqL1xuICAgIHBhZChwYWRkaW5nWCwgcGFkZGluZ1kpXG4gICAge1xuICAgICAgICBwYWRkaW5nWCA9IHBhZGRpbmdYIHx8IDA7XG4gICAgICAgIHBhZGRpbmdZID0gcGFkZGluZ1kgfHwgKChwYWRkaW5nWSAhPT0gMCkgPyBwYWRkaW5nWCA6IDApO1xuXG4gICAgICAgIHRoaXMueCAtPSBwYWRkaW5nWDtcbiAgICAgICAgdGhpcy55IC09IHBhZGRpbmdZO1xuXG4gICAgICAgIHRoaXMud2lkdGggKz0gcGFkZGluZ1ggKiAyO1xuICAgICAgICB0aGlzLmhlaWdodCArPSBwYWRkaW5nWSAqIDI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRml0cyB0aGlzIHJlY3RhbmdsZSBhcm91bmQgdGhlIHBhc3NlZCBvbmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuUmVjdGFuZ2xlfSByZWN0YW5nbGUgLSBUaGUgcmVjdGFuZ2xlIHRvIGZpdC5cbiAgICAgKi9cbiAgICBmaXQocmVjdGFuZ2xlKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMueCA8IHJlY3RhbmdsZS54KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLndpZHRoICs9IHRoaXMueDtcbiAgICAgICAgICAgIGlmICh0aGlzLndpZHRoIDwgMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy54ID0gcmVjdGFuZ2xlLng7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy55IDwgcmVjdGFuZ2xlLnkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ICs9IHRoaXMueTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy55ID0gcmVjdGFuZ2xlLnk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy54ICsgdGhpcy53aWR0aCA+IHJlY3RhbmdsZS54ICsgcmVjdGFuZ2xlLndpZHRoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLndpZHRoID0gcmVjdGFuZ2xlLndpZHRoIC0gdGhpcy54O1xuICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gcmVjdGFuZ2xlLnkgKyByZWN0YW5nbGUuaGVpZ2h0KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IHJlY3RhbmdsZS5oZWlnaHQgLSB0aGlzLnk7XG4gICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVubGFyZ2VzIHRoaXMgcmVjdGFuZ2xlIHRvIGluY2x1ZGUgdGhlIHBhc3NlZCByZWN0YW5nbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuUmVjdGFuZ2xlfSByZWN0YW5nbGUgLSBUaGUgcmVjdGFuZ2xlIHRvIGluY2x1ZGUuXG4gICAgICovXG4gICAgZW5sYXJnZShyZWN0YW5nbGUpXG4gICAge1xuICAgICAgICBjb25zdCB4MSA9IE1hdGgubWluKHRoaXMueCwgcmVjdGFuZ2xlLngpO1xuICAgICAgICBjb25zdCB4MiA9IE1hdGgubWF4KHRoaXMueCArIHRoaXMud2lkdGgsIHJlY3RhbmdsZS54ICsgcmVjdGFuZ2xlLndpZHRoKTtcbiAgICAgICAgY29uc3QgeTEgPSBNYXRoLm1pbih0aGlzLnksIHJlY3RhbmdsZS55KTtcbiAgICAgICAgY29uc3QgeTIgPSBNYXRoLm1heCh0aGlzLnkgKyB0aGlzLmhlaWdodCwgcmVjdGFuZ2xlLnkgKyByZWN0YW5nbGUuaGVpZ2h0KTtcblxuICAgICAgICB0aGlzLnggPSB4MTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHgyIC0geDE7XG4gICAgICAgIHRoaXMueSA9IHkxO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHkyIC0geTE7XG4gICAgfVxufVxuIiwiaW1wb3J0IFJlY3RhbmdsZSBmcm9tICcuL1JlY3RhbmdsZSc7XG5pbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbi8qKlxuICogVGhlIENpcmNsZSBvYmplY3QgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBhIGhpdCBhcmVhIGZvciBkaXNwbGF5T2JqZWN0c1xuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2lyY2xlXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgY2VudGVyIG9mIHRoaXMgY2lyY2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgY2VudGVyIG9mIHRoaXMgY2lyY2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtyYWRpdXM9MF0gLSBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHJhZGl1cyA9IDApXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnggPSB4O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QsIG1haW5seSB1c2VkIHRvIGF2b2lkIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgUElYSS5TSEFQRVMuQ0lSQ1xuICAgICAgICAgKiBAc2VlIFBJWEkuU0hBUEVTXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5cGUgPSBTSEFQRVMuQ0lSQztcblxuICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoaXMgQ2lyY2xlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkNpcmNsZX0gYSBjb3B5IG9mIHRoZSBDaXJjbGVcbiAgICAgKi9cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IENpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgY2lyY2xlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSB4L3kgY29vcmRpbmF0ZXMgYXJlIHdpdGhpbiB0aGlzIENpcmNsZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5yYWRpdXMgPD0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcjIgPSB0aGlzLnJhZGl1cyAqIHRoaXMucmFkaXVzO1xuICAgICAgICBsZXQgZHggPSAodGhpcy54IC0geCk7XG4gICAgICAgIGxldCBkeSA9ICh0aGlzLnkgLSB5KTtcblxuICAgICAgICBkeCAqPSBkeDtcbiAgICAgICAgZHkgKj0gZHk7XG5cbiAgICAgICAgcmV0dXJuIChkeCArIGR5IDw9IHIyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJldHVybnMgdGhlIGZyYW1pbmcgcmVjdGFuZ2xlIG9mIHRoZSBjaXJjbGUgYXMgYSBSZWN0YW5nbGUgb2JqZWN0XG4gICAgKlxuICAgICogQHJldHVybiB7UElYSS5SZWN0YW5nbGV9IHRoZSBmcmFtaW5nIHJlY3RhbmdsZVxuICAgICovXG4gICAgZ2V0Qm91bmRzKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMueCAtIHRoaXMucmFkaXVzLCB0aGlzLnkgLSB0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXMgKiAyLCB0aGlzLnJhZGl1cyAqIDIpO1xuICAgIH1cbn1cbiIsImltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi9SZWN0YW5nbGUnO1xuaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vLi4vY29uc3QnO1xuXG4vKipcbiAqIFRoZSBFbGxpcHNlIG9iamVjdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGEgaGl0IGFyZWEgZm9yIGRpc3BsYXlPYmplY3RzXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGxpcHNlXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgY2VudGVyIG9mIHRoaXMgY2lyY2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgY2VudGVyIG9mIHRoaXMgY2lyY2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aD0wXSAtIFRoZSBoYWxmIHdpZHRoIG9mIHRoaXMgZWxsaXBzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbaGVpZ2h0PTBdIC0gVGhlIGhhbGYgaGVpZ2h0IG9mIHRoaXMgZWxsaXBzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5FTElQXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5FTElQO1xuXG4gICAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBFbGxpcHNlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkVsbGlwc2V9IGEgY29weSBvZiB0aGUgZWxsaXBzZVxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRWxsaXBzZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgZWxsaXBzZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkcyBhcmUgd2l0aGluIHRoaXMgZWxsaXBzZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy53aWR0aCA8PSAwIHx8IHRoaXMuaGVpZ2h0IDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vcm1hbGl6ZSB0aGUgY29vcmRzIHRvIGFuIGVsbGlwc2Ugd2l0aCBjZW50ZXIgMCwwXG4gICAgICAgIGxldCBub3JteCA9ICgoeCAtIHRoaXMueCkgLyB0aGlzLndpZHRoKTtcbiAgICAgICAgbGV0IG5vcm15ID0gKCh5IC0gdGhpcy55KSAvIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICBub3JteCAqPSBub3JteDtcbiAgICAgICAgbm9ybXkgKj0gbm9ybXk7XG5cbiAgICAgICAgcmV0dXJuIChub3JteCArIG5vcm15IDw9IDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGZyYW1pbmcgcmVjdGFuZ2xlIG9mIHRoZSBlbGxpcHNlIGFzIGEgUmVjdGFuZ2xlIG9iamVjdFxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5SZWN0YW5nbGV9IHRoZSBmcmFtaW5nIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIGdldEJvdW5kcygpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLnggLSB0aGlzLndpZHRoLCB0aGlzLnkgLSB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBQb2ludCBmcm9tICcuLi9Qb2ludCc7XG5pbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2x5Z29uXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50W118bnVtYmVyW119IHBvaW50cyAtIFRoaXMgY2FuIGJlIGFuIGFycmF5IG9mIFBvaW50c1xuICAgICAqICB0aGF0IGZvcm0gdGhlIHBvbHlnb24sIGEgZmxhdCBhcnJheSBvZiBudW1iZXJzIHRoYXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBbeCx5LCB4LHksIC4uLl0sIG9yXG4gICAgICogIHRoZSBhcmd1bWVudHMgcGFzc2VkIGNhbiBiZSBhbGwgdGhlIHBvaW50cyBvZiB0aGUgcG9seWdvbiBlLmcuXG4gICAgICogIGBuZXcgUElYSS5Qb2x5Z29uKG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIC4uLilgLCBvciB0aGUgYXJndW1lbnRzIHBhc3NlZCBjYW4gYmUgZmxhdFxuICAgICAqICB4LHkgdmFsdWVzIGUuZy4gYG5ldyBQb2x5Z29uKHgseSwgeCx5LCB4LHksIC4uLilgIHdoZXJlIGB4YCBhbmQgYHlgIGFyZSBOdW1iZXJzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLnBvaW50cylcbiAgICB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBvaW50c1swXSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50c1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgb2YgcG9pbnRzLCBjb252ZXJ0IGl0IHRvIGEgZmxhdCBhcnJheSBvZiBudW1iZXJzXG4gICAgICAgIGlmIChwb2ludHNbMF0gaW5zdGFuY2VvZiBQb2ludClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBwb2ludHMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwLnB1c2gocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9pbnRzID0gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gYXJyYXkgb2YgdGhlIHBvaW50cyBvZiB0aGlzIHBvbHlnb25cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyW119XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBvaW50cyA9IHBvaW50cztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5QT0xZXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5QT0xZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIHBvbHlnb25cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuUG9seWdvbn0gYSBjb3B5IG9mIHRoZSBwb2x5Z29uXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2x5Z29uKHRoaXMucG9pbnRzLnNsaWNlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb3NlcyB0aGUgcG9seWdvbiwgYWRkaW5nIHBvaW50cyBpZiBuZWNlc3NhcnkuXG4gICAgICpcbiAgICAgKi9cbiAgICBjbG9zZSgpXG4gICAge1xuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLnBvaW50cztcbiAgICAgICAgaWYgKHBvaW50c1swXSAhPT0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXSB8fCBwb2ludHNbMV0gIT09IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSwgcG9pbnRzWzFdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29udGFpbnMoeCwgeSlcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcih4LHkpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog5aSa6L655b2i5YyF5ZCr5Yik5patIE5vbnplcm8gV2luZGluZyBOdW1iZXIgUnVsZVxuICAgICAqL1xuICAgIF9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcih4LCB5KSBcbiAgICB7XG4gICAgICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50cztcbiAgICAgICAgdmFyIHduID0gMDtcbiAgICAgICAgZm9yICh2YXIgc2hpZnRQLCBzaGlmdCA9IHBvaW50c1sxXSA+IHksIGkgPSAzOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICBzaGlmdFAgPSBzaGlmdDtcbiAgICAgICAgICAgIHNoaWZ0ID0gcG9pbnRzW2ldID4geTtcbiAgICAgICAgICAgIGlmIChzaGlmdFAgIT0gc2hpZnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IChzaGlmdFAgPyAxIDogMCkgLSAoc2hpZnQgPyAxIDogMCk7XG4gICAgICAgICAgICAgICAgaWYgKG4gKiAoKHBvaW50c1tpIC0gM10gLSB4KSAqIChwb2ludHNbaSAtIDBdIC0geSkgLSAocG9pbnRzW2kgLSAyXSAtIHkpICogKHBvaW50c1tpIC0gMV0gLSB4KSkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHduICs9IG47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHduXG4gICAgfVxufVxuIiwiLyoqXG4gKiBNYXRoIGNsYXNzZXMgYW5kIHV0aWxpdGllcyBtaXhlZCBpbnRvIFBJWEkgbmFtZXNwYWNlLlxuICpcbiAqIEBsZW5kcyBQSVhJXG4gKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4IH0gZnJvbSAnLi9NYXRyaXgnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHcm91cEQ4IH0gZnJvbSAnLi9Hcm91cEQ4JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQXJjIH0gZnJvbSAnLi9BcmMnO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIENpcmNsZSB9IGZyb20gJy4vc2hhcGVzL0NpcmNsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVsbGlwc2UgfSBmcm9tICcuL3NoYXBlcy9FbGxpcHNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUG9seWdvbiB9IGZyb20gJy4vc2hhcGVzL1BvbHlnb24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZWN0YW5nbGUgfSBmcm9tICcuL3NoYXBlcy9SZWN0YW5nbGUnO1xuXG5cbiIsIi8qKlxuICogQ2FsY3VsYXRlIHRoZSBwb2ludHMgZm9yIGEgYmV6aWVyIGN1cnZlIGFuZCB0aGVuIGRyYXdzIGl0LlxuICpcbiAqIElnbm9yZWQgZnJvbSBkb2NzIHNpbmNlIGl0IGlzIG5vdCBkaXJlY3RseSBleHBvc2VkLlxuICpcbiAqIEBpZ25vcmVcbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tWCAtIFN0YXJ0aW5nIHBvaW50IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tWSAtIFN0YXJ0aW5nIHBvaW50IHlcbiAqIEBwYXJhbSB7bnVtYmVyfSBjcFggLSBDb250cm9sIHBvaW50IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSBjcFkgLSBDb250cm9sIHBvaW50IHlcbiAqIEBwYXJhbSB7bnVtYmVyfSBjcFgyIC0gU2Vjb25kIENvbnRyb2wgcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IGNwWTIgLSBTZWNvbmQgQ29udHJvbCBwb2ludCB5XG4gKiBAcGFyYW0ge251bWJlcn0gdG9YIC0gRGVzdGluYXRpb24gcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IHRvWSAtIERlc3RpbmF0aW9uIHBvaW50IHlcbiAqIEBwYXJhbSB7bnVtYmVyW119IFtwYXRoPVtdXSAtIFBhdGggYXJyYXkgdG8gcHVzaCBwb2ludHMgaW50b1xuICogQHJldHVybiB7bnVtYmVyW119IEFycmF5IG9mIHBvaW50cyBvZiB0aGUgY3VydmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmV6aWVyQ3VydmVUbyhmcm9tWCwgZnJvbVksIGNwWCwgY3BZLCBjcFgyLCBjcFkyLCB0b1gsIHRvWSwgcGF0aCA9IFtdKVxue1xuICAgIGNvbnN0IG4gPSAyMDtcbiAgICBsZXQgZHQgPSAwO1xuICAgIGxldCBkdDIgPSAwO1xuICAgIGxldCBkdDMgPSAwO1xuICAgIGxldCB0MiA9IDA7XG4gICAgbGV0IHQzID0gMDtcblxuICAgIHBhdGgucHVzaChmcm9tWCwgZnJvbVkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDEsIGogPSAwOyBpIDw9IG47ICsraSlcbiAgICB7XG4gICAgICAgIGogPSBpIC8gbjtcblxuICAgICAgICBkdCA9ICgxIC0gaik7XG4gICAgICAgIGR0MiA9IGR0ICogZHQ7XG4gICAgICAgIGR0MyA9IGR0MiAqIGR0O1xuXG4gICAgICAgIHQyID0gaiAqIGo7XG4gICAgICAgIHQzID0gdDIgKiBqO1xuXG4gICAgICAgIHBhdGgucHVzaChcbiAgICAgICAgICAgIChkdDMgKiBmcm9tWCkgKyAoMyAqIGR0MiAqIGogKiBjcFgpICsgKDMgKiBkdCAqIHQyICogY3BYMikgKyAodDMgKiB0b1gpLFxuICAgICAgICAgICAgKGR0MyAqIGZyb21ZKSArICgzICogZHQyICogaiAqIGNwWSkgKyAoMyAqIGR0ICogdDIgKiBjcFkyKSArICh0MyAqIHRvWSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aDtcbn1cbiIsIlxuXG4vKipcbiAqIOe6v+auteWMheWQq+WIpOaWrVxuICogQHBvaW50cyBbMCwwLDAsMF1cbiAqL1xudmFyIF9pc0luc2lkZUxpbmUgPSBmdW5jdGlvbiggcG9pbnRzLCB4LCB5LCBsaW5lV2lkdGggKSBcbntcbiAgICB2YXIgeDAgPSBwb2ludHNbMF07XG4gICAgdmFyIHkwID0gcG9pbnRzWzFdO1xuICAgIHZhciB4MSA9IHBvaW50c1syXTtcbiAgICB2YXIgeTEgPSBwb2ludHNbM107XG4gICAgdmFyIF9sID0gTWF0aC5tYXgobGluZVdpZHRoICwgMyk7XG4gICAgdmFyIF9hID0gMDtcbiAgICB2YXIgX2IgPSB4MDtcblxuICAgIGlmKFxuICAgICAgICAoeSA+IHkwICsgX2wgJiYgeSA+IHkxICsgX2wpIFxuICAgICAgICB8fCAoeSA8IHkwIC0gX2wgJiYgeSA8IHkxIC0gX2wpIFxuICAgICAgICB8fCAoeCA+IHgwICsgX2wgJiYgeCA+IHgxICsgX2wpIFxuICAgICAgICB8fCAoeCA8IHgwIC0gX2wgJiYgeCA8IHgxIC0gX2wpIFxuICAgICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoeDAgIT09IHgxKSB7XG4gICAgICAgIF9hID0gKHkwIC0geTEpIC8gKHgwIC0geDEpO1xuICAgICAgICBfYiA9ICh4MCAqIHkxIC0geDEgKiB5MCkgLyAoeDAgLSB4MSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHggLSB4MCkgPD0gX2wgLyAyO1xuICAgIH1cblxuICAgIHZhciBfcyA9IChfYSAqIHggLSB5ICsgX2IpICogKF9hICogeCAtIHkgKyBfYikgLyAoX2EgKiBfYSArIDEpO1xuICAgIHJldHVybiBfcyA8PSBfbCAvIDIgKiBfbCAvIDI7XG59IFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbnNpZGVMaW5lKGRhdGEsIHgsIHksIGxpbmUpIFxueyAgIFxuICAgIHZhciBwb2ludHMgPSBkYXRhLnNoYXBlLnBvaW50cztcbiAgICB2YXIgbGluZVdpZHRoID0gZGF0YS5saW5lV2lkdGg7XG4gICAgdmFyIGluc2lkZUNhdGNoID0gZmFsc2U7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7ICsraSl7XG4gICAgICAgIGluc2lkZUNhdGNoID0gX2lzSW5zaWRlTGluZSggcG9pbnRzLnNsaWNlKGkgLCBpKzQpICwgeCAsIHkgLCBsaW5lV2lkdGggKTtcbiAgICAgICAgaWYoIGluc2lkZUNhdGNoICl7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfTtcbiAgICAgICAgaSArPSAxXG4gICAgfTtcbiAgICByZXR1cm4gaW5zaWRlQ2F0Y2g7XG59IiwiLypcbiogR3JhcGhpY3Pnu5jlm77ms5XliJlcbiog5Y2V5LiqZ3JhaGljc+WunuS+i+mHjOeahGZpbGwgbGluZSDmoLflvI/lsZ7mgKfvvIzpg73ku47lr7nlupRzaGFwZS5jb250ZXh05Lit6I635Y+WXG4qIFxuKi9cblxuaW1wb3J0IEdyYXBoaWNzRGF0YSBmcm9tICcuL0dyYXBoaWNzRGF0YSc7XG5pbXBvcnQgeyBSZWN0YW5nbGUsIEVsbGlwc2UsIFBvbHlnb24sIENpcmNsZSB9IGZyb20gJy4uL21hdGgvaW5kZXgnO1xuaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vY29uc3QnO1xuaW1wb3J0IGJlemllckN1cnZlVG8gZnJvbSAnLi91dGlscy9iZXppZXJDdXJ2ZVRvJztcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgSW5zaWRlTGluZSBmcm9tICcuLi9nZW9tL0luc2lkZUxpbmUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWNzIFxue1xuICAgIGNvbnN0cnVjdG9yKCBzaGFwZSApXG4gICAge1xuICAgICAgICB0aGlzLnNoYXBlID0gc2hhcGU7XG5cbiAgICAgICAgdGhpcy5saW5lV2lkdGggPSAxO1xuICAgICAgICB0aGlzLnN0cm9rZVN0eWxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5saW5lQWxwaGEgPSAxO1xuICAgICAgICB0aGlzLmZpbGxTdHlsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gMTtcblxuICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcblxuICAgICAgICB0aGlzLnN5bnNTdHlsZSgpO1xuXG4gICAgICAgIHRoaXMuZGlydHkgPSAwOyAvL+iEj+aVsOaNrlxuICAgIH1cblxuICAgIHN5bnNTdHlsZSgpXG4gICAge1xuICAgICAgICAvL+S7jnNoYXBl5Lit5oqK57uY5Zu+6ZyA6KaB55qEc3R5bGXlsZ7mgKflkIzmraXov4fmnaVcbiAgICAgICAgdmFyIHNjdHggPSB0aGlzLnNoYXBlLmNvbnRleHQ7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gc2N0eC5saW5lV2lkdGg7XG4gICAgICAgIHRoaXMuc3Ryb2tlU3R5bGUgPSBzY3R4LnN0cm9rZVN0eWxlO1xuICAgICAgICB0aGlzLmxpbmVBbHBoYSA9IHNjdHgubGluZUFscGhhICogc2N0eC5nbG9iYWxBbHBoYTtcblxuICAgICAgICB0aGlzLmZpbGxTdHlsZSA9IHNjdHguZmlsbFN0eWxlO1xuICAgICAgICB0aGlzLmZpbGxBbHBoYSA9IHNjdHguZmlsbEFscGhhICogc2N0eC5nbG9iYWxBbHBoYTtcblxuXG4gICAgICAgIC8v5aaC5p6cZ3JhcGhpY3NEYXRh5pyJ5aSa5YiG57uE55qE5oOF5Ya15LiL77yM5aaC5p6c5Lul5Li6c2hhcGXnmoQgc3R5bGUg5bGe5oCn5pS55Y+Y6LCD55So55qEc3luc1N0eWxlXG4gICAgICAgIC8v5YiZ5Lya6KaG55uW5YWo6YOo55qEIGdyYXBoaWNzRGF0YSDlhYPntKBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg7ICsraSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljc0RhdGFbaV0uc3luc1N0eWxlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgR3JhcGhpY3MoKTtcblxuICAgICAgICBjbG9uZS5kaXJ0eSA9IDA7XG5cbiAgICAgICAgLy8gY29weSBncmFwaGljcyBkYXRhXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoOyArK2kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsb25lLmdyYXBoaWNzRGF0YS5wdXNoKHRoaXMuZ3JhcGhpY3NEYXRhW2ldLmNsb25lKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvbmUuY3VycmVudFBhdGggPSBjbG9uZS5ncmFwaGljc0RhdGFbY2xvbmUuZ3JhcGhpY3NEYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuXG5cbiAgICBtb3ZlVG8oeCwgeSlcbiAgICB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IFBvbHlnb24oW3gsIHldKTtcblxuICAgICAgICBzaGFwZS5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kcmF3U2hhcGUoc2hhcGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBcbiAgICBsaW5lVG8oeCwgeSlcbiAgICB7XG4gICAgICAgIGlmKCB0aGlzLmN1cnJlbnRQYXRoICl7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5wdXNoKHgsIHkpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oMCwwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBxdWFkcmF0aWNDdXJ2ZVRvKGNwWCwgY3BZLCB0b1gsIHRvWSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzID0gWzAsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oMCwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuID0gMjA7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzO1xuICAgICAgICBsZXQgeGEgPSAwO1xuICAgICAgICBsZXQgeWEgPSAwO1xuXG4gICAgICAgIGlmIChwb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbygwLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyb21YID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXTtcbiAgICAgICAgY29uc3QgZnJvbVkgPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG47ICsraSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgaiA9IGkgLyBuO1xuXG4gICAgICAgICAgICB4YSA9IGZyb21YICsgKChjcFggLSBmcm9tWCkgKiBqKTtcbiAgICAgICAgICAgIHlhID0gZnJvbVkgKyAoKGNwWSAtIGZyb21ZKSAqIGopO1xuXG4gICAgICAgICAgICBwb2ludHMucHVzaCh4YSArICgoKGNwWCArICgodG9YIC0gY3BYKSAqIGopKSAtIHhhKSAqIGopLFxuICAgICAgICAgICAgICAgIHlhICsgKCgoY3BZICsgKCh0b1kgLSBjcFkpICogaikpIC0geWEpICogaikpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXJ0eSsrO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJlemllckN1cnZlVG8oY3BYLCBjcFksIGNwWDIsIGNwWTIsIHRvWCwgdG9ZKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMgPSBbMCwgMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbygwLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzO1xuXG4gICAgICAgIGNvbnN0IGZyb21YID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXTtcbiAgICAgICAgY29uc3QgZnJvbVkgPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHBvaW50cy5sZW5ndGggLT0gMjtcblxuICAgICAgICBiZXppZXJDdXJ2ZVRvKGZyb21YLCBmcm9tWSwgY3BYLCBjcFksIGNwWDIsIGNwWTIsIHRvWCwgdG9ZLCBwb2ludHMpO1xuXG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcmNUbyh4MSwgeTEsIHgyLCB5MiwgcmFkaXVzKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMucHVzaCh4MSwgeTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oeDEsIHkxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzO1xuICAgICAgICBjb25zdCBmcm9tWCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGZyb21ZID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgYTEgPSBmcm9tWSAtIHkxO1xuICAgICAgICBjb25zdCBiMSA9IGZyb21YIC0geDE7XG4gICAgICAgIGNvbnN0IGEyID0geTIgLSB5MTtcbiAgICAgICAgY29uc3QgYjIgPSB4MiAtIHgxO1xuICAgICAgICBjb25zdCBtbSA9IE1hdGguYWJzKChhMSAqIGIyKSAtIChiMSAqIGEyKSk7XG5cbiAgICAgICAgaWYgKG1tIDwgMS4wZS04IHx8IHJhZGl1cyA9PT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl0gIT09IHgxIHx8IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0gIT09IHkxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHgxLCB5MSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBkZCA9IChhMSAqIGExKSArIChiMSAqIGIxKTtcbiAgICAgICAgICAgIGNvbnN0IGNjID0gKGEyICogYTIpICsgKGIyICogYjIpO1xuICAgICAgICAgICAgY29uc3QgdHQgPSAoYTEgKiBhMikgKyAoYjEgKiBiMik7XG4gICAgICAgICAgICBjb25zdCBrMSA9IHJhZGl1cyAqIE1hdGguc3FydChkZCkgLyBtbTtcbiAgICAgICAgICAgIGNvbnN0IGsyID0gcmFkaXVzICogTWF0aC5zcXJ0KGNjKSAvIG1tO1xuICAgICAgICAgICAgY29uc3QgajEgPSBrMSAqIHR0IC8gZGQ7XG4gICAgICAgICAgICBjb25zdCBqMiA9IGsyICogdHQgLyBjYztcbiAgICAgICAgICAgIGNvbnN0IGN4ID0gKGsxICogYjIpICsgKGsyICogYjEpO1xuICAgICAgICAgICAgY29uc3QgY3kgPSAoazEgKiBhMikgKyAoazIgKiBhMSk7XG4gICAgICAgICAgICBjb25zdCBweCA9IGIxICogKGsyICsgajEpO1xuICAgICAgICAgICAgY29uc3QgcHkgPSBhMSAqIChrMiArIGoxKTtcbiAgICAgICAgICAgIGNvbnN0IHF4ID0gYjIgKiAoazEgKyBqMik7XG4gICAgICAgICAgICBjb25zdCBxeSA9IGEyICogKGsxICsgajIpO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRBbmdsZSA9IE1hdGguYXRhbjIocHkgLSBjeSwgcHggLSBjeCk7XG4gICAgICAgICAgICBjb25zdCBlbmRBbmdsZSA9IE1hdGguYXRhbjIocXkgLSBjeSwgcXggLSBjeCk7XG5cbiAgICAgICAgICAgIHRoaXMuYXJjKGN4ICsgeDEsIGN5ICsgeTEsIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGIxICogYTIgPiBiMiAqIGExKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcmMoY3gsIGN5LCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBhbnRpY2xvY2t3aXNlID0gZmFsc2UpXG4gICAge1xuICAgICAgICBpZiAoc3RhcnRBbmdsZSA9PT0gZW5kQW5nbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhbnRpY2xvY2t3aXNlICYmIGVuZEFuZ2xlIDw9IHN0YXJ0QW5nbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVuZEFuZ2xlICs9IE1hdGguUEkgKiAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFudGljbG9ja3dpc2UgJiYgc3RhcnRBbmdsZSA8PSBlbmRBbmdsZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc3RhcnRBbmdsZSArPSBNYXRoLlBJICogMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN3ZWVwID0gZW5kQW5nbGUgLSBzdGFydEFuZ2xlO1xuICAgICAgICBjb25zdCBzZWdzID0gTWF0aC5jZWlsKE1hdGguYWJzKHN3ZWVwKSAvIChNYXRoLlBJICogMikpICogNDA7XG5cbiAgICAgICAgaWYgKHN3ZWVwID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXJ0WCA9IGN4ICsgKE1hdGguY29zKHN0YXJ0QW5nbGUpICogcmFkaXVzKTtcbiAgICAgICAgY29uc3Qgc3RhcnRZID0gY3kgKyAoTWF0aC5zaW4oc3RhcnRBbmdsZSkgKiByYWRpdXMpO1xuXG4gICAgICAgIC8vIElmIHRoZSBjdXJyZW50UGF0aCBleGlzdHMsIHRha2UgaXRzIHBvaW50cy4gT3RoZXJ3aXNlIGNhbGwgYG1vdmVUb2AgdG8gc3RhcnQgYSBwYXRoLlxuICAgICAgICBsZXQgcG9pbnRzID0gdGhpcy5jdXJyZW50UGF0aCA/IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzIDogbnVsbDtcblxuICAgICAgICBpZiAocG9pbnRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXSAhPT0gc3RhcnRYIHx8IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0gIT09IHN0YXJ0WSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgICBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRoZXRhID0gc3dlZXAgLyAoc2VncyAqIDIpO1xuICAgICAgICBjb25zdCB0aGV0YTIgPSB0aGV0YSAqIDI7XG5cbiAgICAgICAgY29uc3QgY1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgICAgICBjb25zdCBzVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG5cbiAgICAgICAgY29uc3Qgc2VnTWludXMgPSBzZWdzIC0gMTtcblxuICAgICAgICBjb25zdCByZW1haW5kZXIgPSAoc2VnTWludXMgJSAxKSAvIHNlZ01pbnVzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHNlZ01pbnVzOyArK2kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHJlYWwgPSBpICsgKHJlbWFpbmRlciAqIGkpO1xuXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9ICgodGhldGEpICsgc3RhcnRBbmdsZSArICh0aGV0YTIgKiByZWFsKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgICAgICBjb25zdCBzID0gLU1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICAgICAgcG9pbnRzLnB1c2goXG4gICAgICAgICAgICAgICAgKCgoY1RoZXRhICogYykgKyAoc1RoZXRhICogcykpICogcmFkaXVzKSArIGN4LFxuICAgICAgICAgICAgICAgICgoKGNUaGV0YSAqIC1zKSArIChzVGhldGEgKiBjKSkgKiByYWRpdXMpICsgY3lcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd1JlY3QoeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKG5ldyBSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3Q2lyY2xlKHgsIHksIHJhZGl1cylcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKG5ldyBDaXJjbGUoeCwgeSwgcmFkaXVzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd0VsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKG5ldyBFbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3UG9seWdvbihwYXRoKVxuICAgIHtcbiAgICAgICAgLy8gcHJldmVudHMgYW4gYXJndW1lbnQgYXNzaWdubWVudCBkZW9wdFxuICAgICAgICAvLyBzZWUgc2VjdGlvbiAzLjE6IGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvd2lraS9PcHRpbWl6YXRpb24ta2lsbGVycyMzLW1hbmFnaW5nLWFyZ3VtZW50c1xuICAgICAgICBsZXQgcG9pbnRzID0gcGF0aDtcblxuICAgICAgICBsZXQgY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICBpZiAocG9pbnRzIGluc3RhbmNlb2YgUG9seWdvbilcbiAgICAgICAge1xuICAgICAgICAgICAgY2xvc2VkID0gcG9pbnRzLmNsb3NlZDtcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50cy5wb2ludHM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocG9pbnRzKSlcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gcHJldmVudHMgYW4gYXJndW1lbnQgbGVhayBkZW9wdFxuICAgICAgICAgICAgLy8gc2VlIHNlY3Rpb24gMy4yOiBodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL3dpa2kvT3B0aW1pemF0aW9uLWtpbGxlcnMjMy1tYW5hZ2luZy1hcmd1bWVudHNcbiAgICAgICAgICAgIHBvaW50cyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcG9pbnRzW2ldID0gYXJndW1lbnRzW2ldOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHByZWZlci1yZXN0LXBhcmFtc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgUG9seWdvbihwb2ludHMpO1xuXG4gICAgICAgIHNoYXBlLmNsb3NlZCA9IGNsb3NlZDtcblxuICAgICAgICB0aGlzLmRyYXdTaGFwZShzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2xlYXIoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aCA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHkrKztcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3U2hhcGUoc2hhcGUpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aCA8PSAyKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBHcmFwaGljc0RhdGEoXG4gICAgICAgICAgICB0aGlzLmxpbmVXaWR0aCxcbiAgICAgICAgICAgIHRoaXMuc3Ryb2tlU3R5bGUsXG4gICAgICAgICAgICB0aGlzLmxpbmVBbHBoYSxcbiAgICAgICAgICAgIHRoaXMuZmlsbFN0eWxlLFxuICAgICAgICAgICAgdGhpcy5maWxsQWxwaGEsXG4gICAgICAgICAgICBzaGFwZVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhLnB1c2goZGF0YSk7XG5cbiAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gU0hBUEVTLlBPTFkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRhdGEuc2hhcGUuY2xvc2VkID0gZGF0YS5zaGFwZS5jbG9zZWQ7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cblxuICAgIGNsb3NlUGF0aCgpXG4gICAge1xuICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHRoaXMuY3VycmVudFBhdGg7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRQYXRoICYmIGN1cnJlbnRQYXRoLnNoYXBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBjdXJyZW50UGF0aC5zaGFwZS5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgYSBwb2ludCBpcyBpbnNpZGUgdGhpcyBncmFwaGljcyBvYmplY3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gcG9pbnQgLSB0aGUgcG9pbnQgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHQgb2YgdGhlIHRlc3RcbiAgICAgKi9cbiAgICBjb250YWluc1BvaW50KHBvaW50KVxuICAgIHtcbiAgICAgICAgY29uc3QgZ3JhcGhpY3NEYXRhID0gdGhpcy5ncmFwaGljc0RhdGE7XG4gICAgICAgIGxldCBpbnNpZGUgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmFwaGljc0RhdGEubGVuZ3RoOyArK2kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBncmFwaGljc0RhdGFbaV07XG4gICAgICAgICAgICBpZiAoZGF0YS5zaGFwZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvL+WFiOajgOa1i2ZpbGzvvIwgZmlsbOeahOajgOa1i+amgueOh+Wkp+S6m+OAglxuICAgICAgICAgICAgICAgIC8v5YOPY2lyY2xlLGVsbGlwc2Xov5nmoLfnmoRzaGFwZSDlsLHnm7TmjqXmiopsaW5lV2lkdGjnrpflnKhmaWxs6YeM6Z2i6K6h566X5bCx5aW95LqG77yM5omA5Lul5LuW5Lus5piv5rKh5pyJaW5zaWRlTGluZeeahFxuICAgICAgICAgICAgICAgIGlmICggZGF0YS5oYXNGaWxsKCkgJiYgZGF0YS5zaGFwZS5jb250YWlucyhwb2ludC54LCBwb2ludC55KSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbnNpZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiggaW5zaWRlICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vY2lyY2xlLGVsbGlwc2XnrYnlsLHmsqHmnIlwb2ludHNcbiAgICAgICAgICAgICAgICBpZiggZGF0YS5oYXNMaW5lKCkgJiYgZGF0YS5zaGFwZS5wb2ludHMgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7mo4DmtYvmmK/lkKblkozmj4/ovrnnorDmkp5cbiAgICAgICAgICAgICAgICAgICAgaW5zaWRlID0gSW5zaWRlTGluZSggZGF0YSAsIHBvaW50LnggLCBwb2ludC55ICk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBpbnNpZGUgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5zaWRlO1xuICAgIH1cblxuICAgIFxuXG4gICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgYm91bmRzIG9mIHRoZSBvYmplY3RcbiAgICAgKlxuICAgICAqL1xuICAgIHVwZGF0ZUxvY2FsQm91bmRzKClcbiAgICB7XG4gICAgICAgIGxldCBtaW5YID0gSW5maW5pdHk7XG4gICAgICAgIGxldCBtYXhYID0gLUluZmluaXR5O1xuXG4gICAgICAgIGxldCBtaW5ZID0gSW5maW5pdHk7XG4gICAgICAgIGxldCBtYXhZID0gLUluZmluaXR5O1xuXG4gICAgICAgIGlmICh0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCBzaGFwZSA9IDA7XG4gICAgICAgICAgICBsZXQgeCA9IDA7XG4gICAgICAgICAgICBsZXQgeSA9IDA7XG4gICAgICAgICAgICBsZXQgdyA9IDA7XG4gICAgICAgICAgICBsZXQgaCA9IDA7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ3JhcGhpY3NEYXRhW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBkYXRhLnR5cGU7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZVdpZHRoID0gZGF0YS5saW5lV2lkdGg7XG5cbiAgICAgICAgICAgICAgICBzaGFwZSA9IGRhdGEuc2hhcGU7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gU0hBUEVTLlJFQ1QgfHwgdHlwZSA9PT0gU0hBUEVTLlJSRUMpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB4ID0gc2hhcGUueCAtIChsaW5lV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgeSA9IHNoYXBlLnkgLSAobGluZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIHcgPSBzaGFwZS53aWR0aCArIGxpbmVXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaCA9IHNoYXBlLmhlaWdodCArIGxpbmVXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICBtaW5YID0geCA8IG1pblggPyB4IDogbWluWDtcbiAgICAgICAgICAgICAgICAgICAgbWF4WCA9IHggKyB3ID4gbWF4WCA/IHggKyB3IDogbWF4WDtcblxuICAgICAgICAgICAgICAgICAgICBtaW5ZID0geSA8IG1pblkgPyB5IDogbWluWTtcbiAgICAgICAgICAgICAgICAgICAgbWF4WSA9IHkgKyBoID4gbWF4WSA/IHkgKyBoIDogbWF4WTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gU0hBUEVTLkNJUkMpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB4ID0gc2hhcGUueDtcbiAgICAgICAgICAgICAgICAgICAgeSA9IHNoYXBlLnk7XG4gICAgICAgICAgICAgICAgICAgIHcgPSBzaGFwZS5yYWRpdXMgKyAobGluZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIGggPSBzaGFwZS5yYWRpdXMgKyAobGluZVdpZHRoIC8gMik7XG5cbiAgICAgICAgICAgICAgICAgICAgbWluWCA9IHggLSB3IDwgbWluWCA/IHggLSB3IDogbWluWDtcbiAgICAgICAgICAgICAgICAgICAgbWF4WCA9IHggKyB3ID4gbWF4WCA/IHggKyB3IDogbWF4WDtcblxuICAgICAgICAgICAgICAgICAgICBtaW5ZID0geSAtIGggPCBtaW5ZID8geSAtIGggOiBtaW5ZO1xuICAgICAgICAgICAgICAgICAgICBtYXhZID0geSArIGggPiBtYXhZID8geSArIGggOiBtYXhZO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBTSEFQRVMuRUxJUClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHggPSBzaGFwZS54O1xuICAgICAgICAgICAgICAgICAgICB5ID0gc2hhcGUueTtcbiAgICAgICAgICAgICAgICAgICAgdyA9IHNoYXBlLndpZHRoICsgKGxpbmVXaWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICBoID0gc2hhcGUuaGVpZ2h0ICsgKGxpbmVXaWR0aCAvIDIpO1xuXG4gICAgICAgICAgICAgICAgICAgIG1pblggPSB4IC0gdyA8IG1pblggPyB4IC0gdyA6IG1pblg7XG4gICAgICAgICAgICAgICAgICAgIG1heFggPSB4ICsgdyA+IG1heFggPyB4ICsgdyA6IG1heFg7XG5cbiAgICAgICAgICAgICAgICAgICAgbWluWSA9IHkgLSBoIDwgbWluWSA/IHkgLSBoIDogbWluWTtcbiAgICAgICAgICAgICAgICAgICAgbWF4WSA9IHkgKyBoID4gbWF4WSA/IHkgKyBoIDogbWF4WTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUE9MWVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludHMgPSBzaGFwZS5wb2ludHM7XG4gICAgICAgICAgICAgICAgICAgIGxldCB4MiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCB5MiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBydyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCByaCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjeSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogKyAyIDwgcG9pbnRzLmxlbmd0aDsgaiArPSAyKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gcG9pbnRzW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IHBvaW50c1tqICsgMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IHBvaW50c1tqICsgMl07XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IHBvaW50c1tqICsgM107XG4gICAgICAgICAgICAgICAgICAgICAgICBkeCA9IE1hdGguYWJzKHgyIC0geCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkeSA9IE1hdGguYWJzKHkyIC0geSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gbGluZVdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdyA9IE1hdGguc3FydCgoZHggKiBkeCkgKyAoZHkgKiBkeSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodyA8IDFlLTkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ3ID0gKChoIC8gdyAqIGR5KSArIGR4KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICByaCA9ICgoaCAvIHcgKiBkeCkgKyBkeSkgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3ggPSAoeDIgKyB4KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeSA9ICh5MiArIHkpIC8gMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbWluWCA9IGN4IC0gcncgPCBtaW5YID8gY3ggLSBydyA6IG1pblg7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhYID0gY3ggKyBydyA+IG1heFggPyBjeCArIHJ3IDogbWF4WDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbWluWSA9IGN5IC0gcmggPCBtaW5ZID8gY3kgLSByaCA6IG1pblk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhZID0gY3kgKyByaCA+IG1heFkgPyBjeSArIHJoIDogbWF4WTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1pblggPSAwO1xuICAgICAgICAgICAgbWF4WCA9IDA7XG4gICAgICAgICAgICBtaW5ZID0gMDtcbiAgICAgICAgICAgIG1heFkgPSAwO1xuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLkJvdW5kLm1pblggPSBtaW5YIFxuICAgICAgICB0aGlzLkJvdW5kLm1heFggPSBtYXhYO1xuXG4gICAgICAgIHRoaXMuQm91bmQubWluWSA9IG1pblk7XG4gICAgICAgIHRoaXMuQm91bmQubWF4WSA9IG1heFk7XG4gICAgfVxuXG4gICAgZGVzdHJveShvcHRpb25zKVxuICAgIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveShvcHRpb25zKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YVtpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuICAgIH1cblxufSIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyBEaXNwbGF5TGlzdCDkuK3nmoRzaGFwZSDnsbtcbiAqL1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IEdyYXBoaWNzIGZyb20gXCIuLi9ncmFwaGljcy9HcmFwaGljc1wiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCB7U0hBUEVfQ09OVEVYVF9ERUZBVUxUfSBmcm9tIFwiLi4vY29uc3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaGFwZSBleHRlbmRzIERpc3BsYXlPYmplY3RcbntcbiAgICBjb25zdHJ1Y3RvcihvcHQpe1xuXG4gICAgICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XG4gICAgICAgIHZhciBfY29udGV4dCA9IF8uZXh0ZW5kKCBfLmNsb25lKFNIQVBFX0NPTlRFWFRfREVGQVVMVCkgLCBvcHQuY29udGV4dCApO1xuICAgICAgICBvcHQuY29udGV4dCA9IF9jb250ZXh0O1xuXG4gICAgICAgIHN1cGVyKCBvcHQgKTtcblxuICAgICAgICB0aGlzLmdyYXBoaWNzID0gbmV3IEdyYXBoaWNzKCB0aGlzICk7XG5cbiAgICAgICAgLy/lhYPntKDmmK/lkKbmnIlob3ZlcuS6i+S7tiDlkowgY2hpY2vkuovku7bvvIznlLFhZGRFdmVuZXRMaXN0ZXLlkoxyZW1pdmVFdmVudExpc3RlcuadpeinpuWPkeS/ruaUuVxuICAgICAgICB0aGlzLl9ob3ZlcmFibGUgID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2NsaWNrYWJsZSAgPSBmYWxzZTtcblxuICAgICAgICAvL292ZXLnmoTml7blgJnlpoLmnpzmnInkv67mlLnmoLflvI/vvIzlsLHkuLp0cnVlXG4gICAgICAgIHRoaXMuX2hvdmVyQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ob3ZlckNsb25lICA9IHRydWU7ICAgIC8v5piv5ZCm5byA5ZCv5ZyoaG92ZXLnmoTml7blgJljbG9uZeS4gOS7veWIsGFjdGl2ZSBzdGFnZSDkuK0gXG4gICAgICAgIHRoaXMucG9pbnRDaGtQcmlvcml0eSA9IHRydWU7IC8v5Zyo6byg5qCHbW91c2VvdmVy5Yiw6K+l6IqC54K577yM54S25ZCObW91c2Vtb3Zl55qE5pe25YCZ77yM5piv5ZCm5LyY5YWI5qOA5rWL6K+l6IqC54K5XG5cbiAgICAgICAgLy/mi5bmi71kcmFn55qE5pe25YCZ5pi+56S65ZyoYWN0aXZTaGFwZeeahOWJr+acrFxuICAgICAgICB0aGlzLl9kcmFnRHVwbGljYXRlID0gbnVsbDtcblxuICAgICAgICAvL+WFg+e0oOaYr+WQpiDlvIDlkK8gZHJhZyDmi5bliqjvvIzov5nkuKrmnInnlKjmiLforr7nva7kvKDlhaVcbiAgICAgICAgLy9zZWxmLmRyYWdnYWJsZSA9IG9wdC5kcmFnZ2FibGUgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy50eXBlID0gdGhpcy50eXBlIHx8IFwic2hhcGVcIiA7XG4gICAgICAgIG9wdC5kcmF3ICYmICh0aGlzLmRyYXc9b3B0LmRyYXcpO1xuICAgICAgICBcbiAgICAgICAgLy/lpITnkIbmiYDmnInnmoTlm77lvaLkuIDkupvlhbHmnInnmoTlsZ7mgKfphY3nva4s5oqK6Zmk5byAaWQsY29udGV4dOS5i+WklueahOaJgOacieWxnuaAp++8jOWFqOmDqOaMgui9veWIsHRoaXPkuIrpnaJcbiAgICAgICAgdGhpcy5pbml0Q29tcFByb3BlcnR5KG9wdCk7XG5cbiAgICAgICAgdGhpcy5fcmVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5pdCgpXG4gICAge31cblxuICAgIGRyYXcoKVxuICAgIHt9XG5cbiAgICBpbml0Q29tcFByb3BlcnR5KG9wdClcbiAgICB7XG4gICAgICAgIGZvciggdmFyIGkgaW4gb3B0ICl7XG4gICAgICAgICAgIGlmKCBpICE9IFwiaWRcIiAmJiBpICE9IFwiY29udGV4dFwiKXtcbiAgICAgICAgICAgICAgIHRoaXNbaV0gPSBvcHRbaV07XG4gICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgLypcbiAgICAqIOeUu+iZmue6v1xuICAgICovXG4gICBkYXNoZWRMaW5lVG8oIHgxLCB5MSwgeDIsIHkyLCBkYXNoTGVuZ3RoICkgXG4gICB7XG4gICAgICAgICBkYXNoTGVuZ3RoID0gdHlwZW9mIGRhc2hMZW5ndGggPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgICA/IDMgOiBkYXNoTGVuZ3RoO1xuICAgICAgICAgZGFzaExlbmd0aCA9IE1hdGgubWF4KCBkYXNoTGVuZ3RoICwgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCApO1xuICAgICAgICAgdmFyIGRlbHRhWCA9IHgyIC0geDE7XG4gICAgICAgICB2YXIgZGVsdGFZID0geTIgLSB5MTtcbiAgICAgICAgIHZhciBudW1EYXNoZXMgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgIE1hdGguc3FydChkZWx0YVggKiBkZWx0YVggKyBkZWx0YVkgKiBkZWx0YVkpIC8gZGFzaExlbmd0aFxuICAgICAgICAgKTtcbiAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtRGFzaGVzOyArK2kpIHtcbiAgICAgICAgICAgICB2YXIgeCA9IHBhcnNlSW50KHgxICsgKGRlbHRhWCAvIG51bURhc2hlcykgKiBpKTtcbiAgICAgICAgICAgICB2YXIgeSA9IHBhcnNlSW50KHkxICsgKGRlbHRhWSAvIG51bURhc2hlcykgKiBpKTtcbiAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzW2kgJSAyID09PSAwID8gJ21vdmVUbycgOiAnbGluZVRvJ10oIHggLCB5ICk7XG4gICAgICAgICAgICAgaWYoIGkgPT0gKG51bURhc2hlcy0xKSAmJiBpJTIgPT09IDApe1xuICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzLmxpbmVUbyggeDIgLCB5MiApO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgIH1cblxuICAgLypcbiAgICAq5LuOY3Bs6IqC54K55Lit6I635Y+W5YiwNOS4quaWueWQkeeahOi+ueeVjOiKgueCuVxuICAgICpAcGFyYW0gIGNvbnRleHQgXG4gICAgKlxuICAgICoqL1xuICAgZ2V0UmVjdEZvcm1Qb2ludExpc3QoIGNvbnRleHQgKVxuICAge1xuICAgICAgIHZhciBtaW5YID0gIE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgdmFyIG1heFggPSAgTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgICB2YXIgbWluWSA9ICBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgIHZhciBtYXhZID0gIE51bWJlci5NSU5fVkFMVUU7XG5cbiAgICAgICB2YXIgY3BsID0gY29udGV4dC5wb2ludExpc3Q7IC8vdGhpcy5nZXRjcGwoKTtcbiAgICAgICBmb3IodmFyIGkgPSAwLCBsID0gY3BsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICBpZiAoY3BsW2ldWzBdIDwgbWluWCkge1xuICAgICAgICAgICAgICAgbWluWCA9IGNwbFtpXVswXTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBpZiAoY3BsW2ldWzBdID4gbWF4WCkge1xuICAgICAgICAgICAgICAgbWF4WCA9IGNwbFtpXVswXTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBpZiAoY3BsW2ldWzFdIDwgbWluWSkge1xuICAgICAgICAgICAgICAgbWluWSA9IGNwbFtpXVsxXTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBpZiAoY3BsW2ldWzFdID4gbWF4WSkge1xuICAgICAgICAgICAgICAgbWF4WSA9IGNwbFtpXVsxXTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cblxuICAgICAgIHZhciBsaW5lV2lkdGg7XG4gICAgICAgaWYgKGNvbnRleHQuc3Ryb2tlU3R5bGUgfHwgY29udGV4dC5maWxsU3R5bGUgICkge1xuICAgICAgICAgICBsaW5lV2lkdGggPSBjb250ZXh0LmxpbmVXaWR0aCB8fCAxO1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XG4gICAgICAgfVxuICAgICAgIHJldHVybiB7XG4gICAgICAgICAgIHggICAgICA6IE1hdGgucm91bmQobWluWCAtIGxpbmVXaWR0aCAvIDIpLFxuICAgICAgICAgICB5ICAgICAgOiBNYXRoLnJvdW5kKG1pblkgLSBsaW5lV2lkdGggLyAyKSxcbiAgICAgICAgICAgd2lkdGggIDogbWF4WCAtIG1pblggKyBsaW5lV2lkdGgsXG4gICAgICAgICAgIGhlaWdodCA6IG1heFkgLSBtaW5ZICsgbGluZVdpZHRoXG4gICAgICAgfTtcbiAgIH1cbn0iLCIvKipcclxuICogQ2FudmF4LS1UZXh0XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5paH5pysIOexu1xyXG4gKiovXHJcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFRleHQgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgc2VsZi5fcmVOZXdsaW5lID0gL1xccj9cXG4vO1xyXG4gICAgc2VsZi5mb250UHJvcGVydHMgPSBbXCJmb250U3R5bGVcIiwgXCJmb250VmFyaWFudFwiLCBcImZvbnRXZWlnaHRcIiwgXCJmb250U2l6ZVwiLCBcImZvbnRGYW1pbHlcIl07XHJcblxyXG4gICAgLy/lgZrkuIDmrKHnroDljZXnmoRvcHTlj4LmlbDmoKHpqozvvIzkv53or4HlnKjnlKjmiLfkuI3kvKBvcHTnmoTml7blgJkg5oiW6ICF5Lyg5LqGb3B05L2G5piv6YeM6Z2i5rKh5pyJY29udGV4dOeahOaXtuWAmeaKpemUmVxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuXHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgIGZvbnRTaXplOiAxMywgLy/lrZfkvZPlpKflsI/pu5jorqQxM1xyXG4gICAgICAgIGZvbnRXZWlnaHQ6IFwibm9ybWFsXCIsXHJcbiAgICAgICAgZm9udEZhbWlseTogXCLlvq7ova/pm4Xpu5Esc2Fucy1zZXJpZlwiLFxyXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiBudWxsLFxyXG4gICAgICAgIGZpbGxTdHlsZTogJ2JsYW5rJyxcclxuICAgICAgICBzdHJva2VTdHlsZTogbnVsbCxcclxuICAgICAgICBsaW5lV2lkdGg6IDAsXHJcbiAgICAgICAgbGluZUhlaWdodDogMS4yLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogbnVsbCxcclxuICAgICAgICB0ZXh0QmFja2dyb3VuZENvbG9yOiBudWxsXHJcbiAgICB9LCBvcHQuY29udGV4dCk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dC5mb250ID0gc2VsZi5fZ2V0Rm9udERlY2xhcmF0aW9uKCk7XHJcblxyXG4gICAgc2VsZi50ZXh0ID0gdGV4dC50b1N0cmluZygpO1xyXG5cclxuICAgIFRleHQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBbb3B0XSk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKFRleHQsIERpc3BsYXlPYmplY3QsIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgLy9jb250ZXh05bGe5oCn5pyJ5Y+Y5YyW55qE55uR5ZCs5Ye95pWwXHJcbiAgICAgICAgaWYgKF8uaW5kZXhPZih0aGlzLmZvbnRQcm9wZXJ0cywgbmFtZSkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0W25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5L+u5pS555qE5pivZm9udOeahOafkOS4quWGheWuue+8jOWwsemHjeaWsOe7hOijheS4gOmBjWZvbnTnmoTlgLzvvIxcclxuICAgICAgICAgICAgLy/nhLblkI7pgJrnn6XlvJXmk47ov5nmrKHlr7ljb250ZXh055qE5L+u5pS55LiN6ZyA6KaB5LiK5oql5b+D6LezXHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5fZ2V0Rm9udERlY2xhcmF0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC53aWR0aCA9IHRoaXMuZ2V0VGV4dFdpZHRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSB0aGlzLmdldFRleHRIZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgaW5pdDogZnVuY3Rpb24odGV4dCwgb3B0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGMud2lkdGggPSB0aGlzLmdldFRleHRXaWR0aCgpO1xyXG4gICAgICAgIGMuaGVpZ2h0ID0gdGhpcy5nZXRUZXh0SGVpZ2h0KCk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbihjdHgpIHtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHRoaXMuY29udGV4dC4kbW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHAgaW4gY3R4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocCAhPSBcInRleHRCYXNlbGluZVwiICYmIHRoaXMuY29udGV4dC4kbW9kZWxbcF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHhbcF0gPSB0aGlzLmNvbnRleHQuJG1vZGVsW3BdO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclRleHQoY3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICB9LFxyXG4gICAgcmVzZXRUZXh0OiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dC50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuaGVhcnRCZWF0KCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VGV4dFdpZHRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSAwO1xyXG4gICAgICAgIFV0aWxzLl9waXhlbEN0eC5zYXZlKCk7XHJcbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4LmZvbnQgPSB0aGlzLmNvbnRleHQuZm9udDtcclxuICAgICAgICB3aWR0aCA9IHRoaXMuX2dldFRleHRXaWR0aChVdGlscy5fcGl4ZWxDdHgsIHRoaXMuX2dldFRleHRMaW5lcygpKTtcclxuICAgICAgICBVdGlscy5fcGl4ZWxDdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiB3aWR0aDtcclxuICAgIH0sXHJcbiAgICBnZXRUZXh0SGVpZ2h0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGV4dEhlaWdodChVdGlscy5fcGl4ZWxDdHgsIHRoaXMuX2dldFRleHRMaW5lcygpKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0VGV4dExpbmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0LnNwbGl0KHRoaXMuX3JlTmV3bGluZSk7XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHQ6IGZ1bmN0aW9uKGN0eCwgdGV4dExpbmVzKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0U3Ryb2tlKGN0eCwgdGV4dExpbmVzKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0RmlsbChjdHgsIHRleHRMaW5lcyk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0Rm9udERlY2xhcmF0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGZvbnRBcnIgPSBbXTtcclxuXHJcbiAgICAgICAgXy5lYWNoKHRoaXMuZm9udFByb3BlcnRzLCBmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgICAgIHZhciBmb250UCA9IHNlbGYuX2NvbnRleHRbcF07XHJcbiAgICAgICAgICAgIGlmIChwID09IFwiZm9udFNpemVcIikge1xyXG4gICAgICAgICAgICAgICAgZm9udFAgPSBwYXJzZUZsb2F0KGZvbnRQKSArIFwicHhcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvbnRQICYmIGZvbnRBcnIucHVzaChmb250UCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmb250QXJyLmpvaW4oJyAnKTtcclxuXHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHRGaWxsOiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250ZXh0LmZpbGxTdHlsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLl9ib3VuZGFyaWVzID0gW107XHJcbiAgICAgICAgdmFyIGxpbmVIZWlnaHRzID0gMDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHRPZkxpbmUgPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoY3R4LCBpLCB0ZXh0TGluZXMpO1xyXG4gICAgICAgICAgICBsaW5lSGVpZ2h0cyArPSBoZWlnaHRPZkxpbmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0TGluZShcclxuICAgICAgICAgICAgICAgICdmaWxsVGV4dCcsXHJcbiAgICAgICAgICAgICAgICBjdHgsXHJcbiAgICAgICAgICAgICAgICB0ZXh0TGluZXNbaV0sXHJcbiAgICAgICAgICAgICAgICAwLCAvL3RoaXMuX2dldExlZnRPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dldFRvcE9mZnNldCgpICsgbGluZUhlaWdodHMsXHJcbiAgICAgICAgICAgICAgICBpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0U3Ryb2tlOiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlIHx8ICF0aGlzLmNvbnRleHQubGluZVdpZHRoKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBsaW5lSGVpZ2h0cyA9IDA7XHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3Ryb2tlRGFzaEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmICgxICYgdGhpcy5zdHJva2VEYXNoQXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0cm9rZURhc2hBcnJheS5wdXNoLmFwcGx5KHRoaXMuc3Ryb2tlRGFzaEFycmF5LCB0aGlzLnN0cm9rZURhc2hBcnJheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3VwcG9ydHNMaW5lRGFzaCAmJiBjdHguc2V0TGluZURhc2godGhpcy5zdHJva2VEYXNoQXJyYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0ZXh0TGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGhlaWdodE9mTGluZSA9IHRoaXMuX2dldEhlaWdodE9mTGluZShjdHgsIGksIHRleHRMaW5lcyk7XHJcbiAgICAgICAgICAgIGxpbmVIZWlnaHRzICs9IGhlaWdodE9mTGluZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclRleHRMaW5lKFxyXG4gICAgICAgICAgICAgICAgJ3N0cm9rZVRleHQnLFxyXG4gICAgICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICAgICAgdGV4dExpbmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgMCwgLy90aGlzLl9nZXRMZWZ0T2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRUb3BPZmZzZXQoKSArIGxpbmVIZWlnaHRzLFxyXG4gICAgICAgICAgICAgICAgaVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dExpbmU6IGZ1bmN0aW9uKG1ldGhvZCwgY3R4LCBsaW5lLCBsZWZ0LCB0b3AsIGxpbmVJbmRleCkge1xyXG4gICAgICAgIHRvcCAtPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoKSAvIDQ7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dC50ZXh0QWxpZ24gIT09ICdqdXN0aWZ5Jykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJDaGFycyhtZXRob2QsIGN0eCwgbGluZSwgbGVmdCwgdG9wLCBsaW5lSW5kZXgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgbGluZVdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KGxpbmUpLndpZHRoO1xyXG4gICAgICAgIHZhciB0b3RhbFdpZHRoID0gdGhpcy5jb250ZXh0LndpZHRoO1xyXG5cclxuICAgICAgICBpZiAodG90YWxXaWR0aCA+IGxpbmVXaWR0aCkge1xyXG4gICAgICAgICAgICB2YXIgd29yZHMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIHZhciB3b3Jkc1dpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KGxpbmUucmVwbGFjZSgvXFxzKy9nLCAnJykpLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgd2lkdGhEaWZmID0gdG90YWxXaWR0aCAtIHdvcmRzV2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBudW1TcGFjZXMgPSB3b3Jkcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB2YXIgc3BhY2VXaWR0aCA9IHdpZHRoRGlmZiAvIG51bVNwYWNlcztcclxuXHJcbiAgICAgICAgICAgIHZhciBsZWZ0T2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHdvcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJDaGFycyhtZXRob2QsIGN0eCwgd29yZHNbaV0sIGxlZnQgKyBsZWZ0T2Zmc2V0LCB0b3AsIGxpbmVJbmRleCk7XHJcbiAgICAgICAgICAgICAgICBsZWZ0T2Zmc2V0ICs9IGN0eC5tZWFzdXJlVGV4dCh3b3Jkc1tpXSkud2lkdGggKyBzcGFjZVdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIGxpbmUsIGxlZnQsIHRvcCwgbGluZUluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlckNoYXJzOiBmdW5jdGlvbihtZXRob2QsIGN0eCwgY2hhcnMsIGxlZnQsIHRvcCkge1xyXG4gICAgICAgIGN0eFttZXRob2RdKGNoYXJzLCAwLCB0b3ApO1xyXG4gICAgfSxcclxuICAgIF9nZXRIZWlnaHRPZkxpbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZm9udFNpemUgKiB0aGlzLmNvbnRleHQubGluZUhlaWdodDtcclxuICAgIH0sXHJcbiAgICBfZ2V0VGV4dFdpZHRoOiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0TGluZXNbMF0gfHwgJ3wnKS53aWR0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TGluZVdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRleHRMaW5lc1tpXSkud2lkdGg7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50TGluZVdpZHRoID4gbWF4V2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoID0gY3VycmVudExpbmVXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRIZWlnaHQ6IGZ1bmN0aW9uKGN0eCwgdGV4dExpbmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5mb250U2l6ZSAqIHRleHRMaW5lcy5sZW5ndGggKiB0aGlzLmNvbnRleHQubGluZUhlaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUb3Agb2Zmc2V0XHJcbiAgICAgKi9cclxuICAgIF9nZXRUb3BPZmZzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ID0gMDtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1pZGRsZVwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IC10aGlzLmNvbnRleHQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XHJcbiAgICAgICAgICAgICAgICB0ID0gLXRoaXMuY29udGV4dC5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuICAgICAgICAvL+abtOWFt3RleHRBbGlnbiDlkowgdGV4dEJhc2VsaW5lIOmHjeaWsOefq+atoyB4eVxyXG4gICAgICAgIGlmIChjLnRleHRBbGlnbiA9PSBcImNlbnRlclwiKSB7XHJcbiAgICAgICAgICAgIHggPSAtYy53aWR0aCAvIDI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYy50ZXh0QWxpZ24gPT0gXCJyaWdodFwiKSB7XHJcbiAgICAgICAgICAgIHggPSAtYy53aWR0aDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjLnRleHRCYXNlbGluZSA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgICAgICAgIHkgPSAtYy5oZWlnaHQgLyAyO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGMudGV4dEJhc2VsaW5lID09IFwiYm90dG9tXCIpIHtcclxuICAgICAgICAgICAgeSA9IC1jLmhlaWdodDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICB3aWR0aDogYy53aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFRleHQ7IiwiXG4vKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDlkJHph4/mk43kvZznsbtcbiAqICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG5mdW5jdGlvbiBWZWN0b3IoeCwgeSkge1xuICAgIHZhciB2eCA9IDAsdnkgPSAwO1xuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIF8uaXNPYmplY3QoIHggKSApe1xuICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiggXy5pc0FycmF5KCBhcmcgKSApe1xuICAgICAgICAgICB2eCA9IGFyZ1swXTtcbiAgICAgICAgICAgdnkgPSBhcmdbMV07XG4gICAgICAgIH0gZWxzZSBpZiggYXJnLmhhc093blByb3BlcnR5KFwieFwiKSAmJiBhcmcuaGFzT3duUHJvcGVydHkoXCJ5XCIpICkge1xuICAgICAgICAgICB2eCA9IGFyZy54O1xuICAgICAgICAgICB2eSA9IGFyZy55O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2F4ZXMgPSBbdngsIHZ5XTtcbn07XG5WZWN0b3IucHJvdG90eXBlID0ge1xuICAgIGRpc3RhbmNlOiBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgeCA9IHRoaXMuX2F4ZXNbMF0gLSB2Ll9heGVzWzBdO1xuICAgICAgICB2YXIgeSA9IHRoaXMuX2F4ZXNbMV0gLSB2Ll9heGVzWzFdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHggKiB4KSArICh5ICogeSkpO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBWZWN0b3I7IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5aSE55CG5Li65bmz5ruR57q/5p2hXG4gKi9cbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIEBpbm5lclxuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZShwMCwgcDEsIHAyLCBwMywgdCwgdDIsIHQzKSB7XG4gICAgdmFyIHYwID0gKHAyIC0gcDApICogMC4yNTtcbiAgICB2YXIgdjEgPSAocDMgLSBwMSkgKiAwLjI1O1xuICAgIHJldHVybiAoMiAqIChwMSAtIHAyKSArIHYwICsgdjEpICogdDMgXG4gICAgICAgICAgICsgKC0gMyAqIChwMSAtIHAyKSAtIDIgKiB2MCAtIHYxKSAqIHQyXG4gICAgICAgICAgICsgdjAgKiB0ICsgcDE7XG59XG4vKipcbiAqIOWkmue6v+auteW5s+a7keabsue6vyBcbiAqIG9wdCA9PT4gcG9pbnRzICwgaXNMb29wXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICggb3B0ICkge1xuICAgIHZhciBwb2ludHMgPSBvcHQucG9pbnRzO1xuICAgIHZhciBpc0xvb3AgPSBvcHQuaXNMb29wO1xuICAgIHZhciBzbW9vdGhGaWx0ZXIgPSBvcHQuc21vb3RoRmlsdGVyO1xuXG4gICAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGg7XG4gICAgaWYoIGxlbiA9PSAxICl7XG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIHZhciByZXQgPSBbXTtcbiAgICB2YXIgZGlzdGFuY2UgID0gMDtcbiAgICB2YXIgcHJlVmVydG9yID0gbmV3IFZlY3RvciggcG9pbnRzWzBdICk7XG4gICAgdmFyIGlWdG9yICAgICA9IG51bGxcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlWdG9yID0gbmV3IFZlY3Rvcihwb2ludHNbaV0pO1xuICAgICAgICBkaXN0YW5jZSArPSBwcmVWZXJ0b3IuZGlzdGFuY2UoIGlWdG9yICk7XG4gICAgICAgIHByZVZlcnRvciA9IGlWdG9yO1xuICAgIH1cblxuICAgIHByZVZlcnRvciA9IG51bGw7XG4gICAgaVZ0b3IgICAgID0gbnVsbDtcblxuXG4gICAgLy/ln7rmnKzkuIrnrYnkuo7mm7LnjodcbiAgICB2YXIgc2VncyA9IGRpc3RhbmNlIC8gNjtcblxuICAgIHNlZ3MgPSBzZWdzIDwgbGVuID8gbGVuIDogc2VncztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ3M7IGkrKykge1xuICAgICAgICB2YXIgcG9zID0gaSAvIChzZWdzLTEpICogKGlzTG9vcCA/IGxlbiA6IGxlbiAtIDEpO1xuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcihwb3MpO1xuXG4gICAgICAgIHZhciB3ID0gcG9zIC0gaWR4O1xuXG4gICAgICAgIHZhciBwMDtcbiAgICAgICAgdmFyIHAxID0gcG9pbnRzW2lkeCAlIGxlbl07XG4gICAgICAgIHZhciBwMjtcbiAgICAgICAgdmFyIHAzO1xuICAgICAgICBpZiAoIWlzTG9vcCkge1xuICAgICAgICAgICAgcDAgPSBwb2ludHNbaWR4ID09PSAwID8gaWR4IDogaWR4IC0gMV07XG4gICAgICAgICAgICBwMiA9IHBvaW50c1tpZHggPiBsZW4gLSAyID8gbGVuIC0gMSA6IGlkeCArIDFdO1xuICAgICAgICAgICAgcDMgPSBwb2ludHNbaWR4ID4gbGVuIC0gMyA/IGxlbiAtIDEgOiBpZHggKyAyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAwID0gcG9pbnRzWyhpZHggLTEgKyBsZW4pICUgbGVuXTtcbiAgICAgICAgICAgIHAyID0gcG9pbnRzWyhpZHggKyAxKSAlIGxlbl07XG4gICAgICAgICAgICBwMyA9IHBvaW50c1soaWR4ICsgMikgJSBsZW5dO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHcyID0gdyAqIHc7XG4gICAgICAgIHZhciB3MyA9IHcgKiB3MjtcblxuICAgICAgICB2YXIgcnAgPSBbXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMF0sIHAxWzBdLCBwMlswXSwgcDNbMF0sIHcsIHcyLCB3MyksXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMV0sIHAxWzFdLCBwMlsxXSwgcDNbMV0sIHcsIHcyLCB3MylcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgIF8uaXNGdW5jdGlvbihzbW9vdGhGaWx0ZXIpICYmIHNtb290aEZpbHRlciggcnAgKTtcblxuICAgICAgICByZXQucHVzaCggcnAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn07IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5pWw5a2mIOexu1xuICpcbiAqKi9cblxuaW1wb3J0IFNtb290aFNwbGluZSBmcm9tIFwiLi4vZ2VvbS9TbW9vdGhTcGxpbmVcIjtcblxuXG52YXIgX2NhY2hlID0ge1xuICAgIHNpbiA6IHt9LCAgICAgLy9zaW7nvJPlrZhcbiAgICBjb3MgOiB7fSAgICAgIC8vY29z57yT5a2YXG59O1xudmFyIF9yYWRpYW5zID0gTWF0aC5QSSAvIDE4MDtcblxuLyoqXG4gKiBAcGFyYW0gYW5nbGUg5byn5bqm77yI6KeS5bqm77yJ5Y+C5pWwXG4gKiBAcGFyYW0gaXNEZWdyZWVzIGFuZ2xl5Y+C5pWw5piv5ZCm5Li66KeS5bqm6K6h566X77yM6buY6K6k5Li6ZmFsc2XvvIxhbmdsZeS4uuS7peW8p+W6puiuoemHj+eahOinkuW6plxuICovXG5mdW5jdGlvbiBzaW4oYW5nbGUsIGlzRGVncmVlcykge1xuICAgIGFuZ2xlID0gKGlzRGVncmVlcyA/IGFuZ2xlICogX3JhZGlhbnMgOiBhbmdsZSkudG9GaXhlZCg0KTtcbiAgICBpZih0eXBlb2YgX2NhY2hlLnNpblthbmdsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgX2NhY2hlLnNpblthbmdsZV0gPSBNYXRoLnNpbihhbmdsZSk7XG4gICAgfVxuICAgIHJldHVybiBfY2FjaGUuc2luW2FuZ2xlXTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gcmFkaWFucyDlvKfluqblj4LmlbBcbiAqL1xuZnVuY3Rpb24gY29zKGFuZ2xlLCBpc0RlZ3JlZXMpIHtcbiAgICBhbmdsZSA9IChpc0RlZ3JlZXMgPyBhbmdsZSAqIF9yYWRpYW5zIDogYW5nbGUpLnRvRml4ZWQoNCk7XG4gICAgaWYodHlwZW9mIF9jYWNoZS5jb3NbYW5nbGVdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9jYWNoZS5jb3NbYW5nbGVdID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gX2NhY2hlLmNvc1thbmdsZV07XG59XG5cbi8qKlxuICog6KeS5bqm6L2s5byn5bqmXG4gKiBAcGFyYW0ge09iamVjdH0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG9SYWRpYW4oYW5nbGUpIHtcbiAgICByZXR1cm4gYW5nbGUgKiBfcmFkaWFucztcbn1cblxuLyoqXG4gKiDlvKfluqbovazop5LluqZcbiAqIEBwYXJhbSB7T2JqZWN0fSBhbmdsZVxuICovXG5mdW5jdGlvbiByYWRpYW5Ub0RlZ3JlZShhbmdsZSkge1xuICAgIHJldHVybiBhbmdsZSAvIF9yYWRpYW5zO1xufVxuXG4vKlxuICog5qCh6aqM6KeS5bqm5YiwMzYw5bqm5YaFXG4gKiBAcGFyYW0ge2FuZ2xlfSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG8zNjAoIGFuZ2xlICkge1xuICAgIHZhciByZUFuZyA9ICgzNjAgKyAgYW5nbGUgICUgMzYwKSAlIDM2MDsvL01hdGguYWJzKDM2MCArIE1hdGguY2VpbCggYW5nbGUgKSAlIDM2MCkgJSAzNjA7XG4gICAgaWYoIHJlQW5nID09IDAgJiYgYW5nbGUgIT09IDAgKXtcbiAgICAgICAgcmVBbmcgPSAzNjBcbiAgICB9XG4gICAgcmV0dXJuIHJlQW5nO1xufVxuXG5mdW5jdGlvbiBnZXRJc2dvblBvaW50TGlzdCggbiAsIHIgKXtcbiAgICB2YXIgcG9pbnRMaXN0ID0gW107XG4gICAgdmFyIGRTdGVwID0gMiAqIE1hdGguUEkgLyBuO1xuICAgIHZhciBiZWdpbkRlZyA9IC1NYXRoLlBJIC8gMjtcbiAgICB2YXIgZGVnID0gYmVnaW5EZWc7XG4gICAgZm9yICh2YXIgaSA9IDAsIGVuZCA9IG47IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICBwb2ludExpc3QucHVzaChbciAqIE1hdGguY29zKGRlZyksIHIgKiBNYXRoLnNpbihkZWcpXSk7XG4gICAgICAgIGRlZyArPSBkU3RlcDtcbiAgICB9O1xuICAgIHJldHVybiBwb2ludExpc3Q7XG59XG5cbmZ1bmN0aW9uIGdldFNtb290aFBvaW50TGlzdCggcExpc3QsIHNtb290aEZpbHRlciApe1xuICAgIC8vc21vb3RoRmlsdGVyIC0tIOavlOWmguWcqOaKmOe6v+WbvuS4reOAguS8muS8oOS4gOS4qnNtb290aEZpbHRlcui/h+adpeWBmnBvaW5055qE57qg5q2j44CCXG4gICAgLy/orql55LiN6IO96LaF6L+H5bqV6YOo55qE5Y6f54K5XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgICAgcG9pbnRzOiBwTGlzdFxuICAgIH1cbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHNtb290aEZpbHRlcikpIHtcbiAgICAgICAgb2JqLnNtb290aEZpbHRlciA9IHNtb290aEZpbHRlcjtcbiAgICB9XG5cbiAgICB2YXIgY3VyckwgPSBTbW9vdGhTcGxpbmUob2JqKTtcbiAgICBpZiAocExpc3QgJiYgcExpc3QubGVuZ3RoPjApIHtcbiAgICAgICAgY3VyckwucHVzaCggcExpc3RbcExpc3QubGVuZ3RoIC0gMV0gKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGN1cnJMO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgUEkgIDogTWF0aC5QSSAgLFxuICAgIHNpbiA6IHNpbiAgICAgICxcbiAgICBjb3MgOiBjb3MgICAgICAsXG4gICAgZGVncmVlVG9SYWRpYW4gOiBkZWdyZWVUb1JhZGlhbixcbiAgICByYWRpYW5Ub0RlZ3JlZSA6IHJhZGlhblRvRGVncmVlLFxuICAgIGRlZ3JlZVRvMzYwICAgIDogZGVncmVlVG8zNjAsXG4gICAgZ2V0SXNnb25Qb2ludExpc3QgOiBnZXRJc2dvblBvaW50TGlzdCxcbiAgICBnZXRTbW9vdGhQb2ludExpc3Q6IGdldFNtb290aFBvaW50TGlzdCAgIFxufTtcblxuIiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaKmOe6vyDnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcG9pbnRMaXN0IOWQhOS4qumhtuinkuWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbmltcG9ydCBfTWF0aCBmcm9tIFwiLi4vZ2VvbS9NYXRoXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyb2tlbkxpbmUgZXh0ZW5kcyBTaGFwZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihvcHQgLCBhdHlwZSl7XHJcbiAgICAgICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgICAgICB2YXIgX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIGxpbmVUeXBlOiBudWxsLFxyXG4gICAgICAgICAgICBzbW9vdGg6IGZhbHNlLFxyXG4gICAgICAgICAgICBwb2ludExpc3Q6IFtdLCAvL3tBcnJheX0gIC8vIOW/hemhu++8jOWQhOS4qumhtuinkuWdkOagh1xyXG4gICAgICAgICAgICBzbW9vdGhGaWx0ZXI6IFV0aWxzLl9fZW1wdHlGdW5jXHJcbiAgICAgICAgfSwgb3B0LmNvbnRleHQgKTtcclxuXHJcbiAgICAgICAgaWYoIGF0eXBlICE9PSBcImNsb25lXCIgJiYgX2NvbnRleHQuc21vb3RoICl7XHJcbiAgICAgICAgICAgIF9jb250ZXh0LnBvaW50TGlzdCA9IF9NYXRoLmdldFNtb290aFBvaW50TGlzdCggX2NvbnRleHQucG9pbnRMaXN0ICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb3B0LmNvbnRleHQgPSBfY29udGV4dDtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlcihvcHQpO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSBcImJyb2tlbmxpbmVcIjtcclxuICAgICAgICB0aGlzLmlkID0gVXRpbHMuY3JlYXRlSWQodGhpcy50eXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG4gICAgfVxyXG5cclxuICAgICR3YXRjaChuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicG9pbnRMaXN0XCIgfHwgbmFtZSA9PSBcInNtb290aFwiIHx8IG5hbWUgPT0gXCJsaW5lVHlwZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0R3JhcGhpY3MoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldEdyYXBoaWNzKCkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5jbGVhcigpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGNvbnN0IHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xyXG4gICAgICAgIGlmIChwb2ludExpc3QubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAvL+WwkeS6jjLkuKrngrnlsLHkuI3nlLvkuoZ+XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFjb250ZXh0LmxpbmVUeXBlIHx8IGNvbnRleHQubGluZVR5cGUgPT0gJ3NvbGlkJykge1xyXG4gICAgICAgICAgICAvL+m7mOiupOS4uuWunue6v1xyXG4gICAgICAgICAgICAvL1RPRE8655uu5YmN5aaC5p6cIOacieiuvue9rnNtb290aCDnmoTmg4XlhrXkuIvmmK/kuI3mlK/mjIHomZrnur/nmoRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5zbW9vdGgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNpID0gMCwgc2wgPSBwb2ludExpc3QubGVuZ3RoOyBzaSA8IHNsOyBzaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpID09IHNsLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzLm1vdmVUbyggcG9pbnRMaXN0W3NpXVswXSAsIHBvaW50TGlzdFtzaV1bMV0gKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzLmxpbmVUbyggcG9pbnRMaXN0W3NpKzFdWzBdICwgcG9pbnRMaXN0W3NpKzFdWzFdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2krPTE7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/nlLvomZrnur/nmoTmlrnms5UgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21YID0gcG9pbnRMaXN0W2kgLSAxXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9YID0gcG9pbnRMaXN0W2ldWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tWSA9IHBvaW50TGlzdFtpIC0gMV1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvWSA9IHBvaW50TGlzdFtpXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhmcm9tWCwgZnJvbVksIHRvWCwgdG9ZLCA1KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxufSIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDlnIblvaIg57G7XHJcbiAqXHJcbiAqIOWdkOagh+WOn+eCueWGjeWchuW/g1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEByIOWchuWNiuW+hFxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjbGUgZXh0ZW5kcyBTaGFwZVxyXG57XHJcbiAgICBjb25zdHJ1Y3Rvciggb3B0IClcclxuICAgIHtcclxuICAgICAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcbiAgICAgICAgLy/pu5jorqTmg4XlhrXkuIvpnaLvvIxjaXJjbGXkuI3pnIDopoHmiop4eei/m+ihjHBhcmVudEludOi9rOaNolxyXG4gICAgICAgICggXCJ4eVRvSW50XCIgaW4gb3B0ICkgfHwgKCBvcHQueHlUb0ludCA9IGZhbHNlICk7XHJcbiAgICAgICAgdmFyIF9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgICAgICByIDogMCAgIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzlnIbljYrlvoRcclxuICAgICAgICB9ICwgb3B0LmNvbnRleHQpO1xyXG5cclxuICAgICAgICBvcHQuY29udGV4dCA9IF9jb250ZXh0O1xyXG5cclxuICAgICAgICBzdXBlciggb3B0ICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50eXBlID0gXCJjaXJjbGVcIjtcclxuICAgICAgICB0aGlzLmlkID0gVXRpbHMuY3JlYXRlSWQodGhpcy50eXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAkd2F0Y2gobmFtZSwgdmFsdWUsIHByZVZhbHVlKSBcclxuICAgIHtcclxuICAgICAgICBpZiAoIG5hbWUgPT0gXCJyXCIgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0R3JhcGhpY3MoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0R3JhcGhpY3MoKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmNsZWFyKCk7XHJcbiAgICAgICAgLy90aGlzLmdyYXBoaWNzLmFyYygwICwgMCwgdGhpcy5jb250ZXh0LnIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmRyYXdDaXJjbGUoMCwgMCwgdGhpcy5jb250ZXh0LnIpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIFBhdGgg57G777yMUGF0aOS4u+imgeeUqOS6juaKinN2Z3BhdGgg5a2X56ym5Liy6L2s5o2i5Li6cG9pbnRMaXN077yM54S25ZCO5p6E5bu6Z3JhcGhpY3NEYXRhXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHBhdGggcGF0aOS4slxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbmltcG9ydCBNYXRyaXggZnJvbSBcIi4uL2dlb20vTWF0cml4XCI7XHJcbmltcG9ydCBCZXppZXIgZnJvbSBcIi4uL2dlb20vYmV6aWVyXCI7XHJcbmltcG9ydCB7IEFyYyB9IGZyb20gJy4uL21hdGgvaW5kZXgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0aCBleHRlbmRzIFNoYXBlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yKG9wdCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgICAgICB2YXIgX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIHBvaW50TGlzdDogW10sIC8v5LuO5LiL6Z2i55qEcGF0aOS4reiuoeeul+W+l+WIsOeahOi+ueeVjOeCueeahOmbhuWQiFxyXG4gICAgICAgICAgICBwYXRoOiBcIlwiIC8v5a2X56ym5LiyIOW/hemhu++8jOi3r+W+hOOAguS+i+WmgjpNIDAgMCBMIDAgMTAgTCAxMCAxMCBaICjkuIDkuKrkuInop5LlvaIpXHJcbiAgICAgICAgICAgICAgICAvL00gPSBtb3ZldG9cclxuICAgICAgICAgICAgICAgIC8vTCA9IGxpbmV0b1xyXG4gICAgICAgICAgICAgICAgLy9IID0gaG9yaXpvbnRhbCBsaW5ldG9cclxuICAgICAgICAgICAgICAgIC8vViA9IHZlcnRpY2FsIGxpbmV0b1xyXG4gICAgICAgICAgICAgICAgLy9DID0gY3VydmV0b1xyXG4gICAgICAgICAgICAgICAgLy9TID0gc21vb3RoIGN1cnZldG9cclxuICAgICAgICAgICAgICAgIC8vUSA9IHF1YWRyYXRpYyBCZWx6aWVyIGN1cnZlXHJcbiAgICAgICAgICAgICAgICAvL1QgPSBzbW9vdGggcXVhZHJhdGljIEJlbHppZXIgY3VydmV0b1xyXG4gICAgICAgICAgICAgICAgLy9aID0gY2xvc2VwYXRoXHJcbiAgICAgICAgfSAsIG9wdC5jb250ZXh0KTtcclxuICAgICAgICBvcHQuY29udGV4dCA9IF9jb250ZXh0O1xyXG5cclxuICAgICAgICBzdXBlciggb3B0ICk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChcImRyYXdUeXBlT25seVwiIGluIG9wdCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdUeXBlT25seSA9IG9wdC5kcmF3VHlwZU9ubHk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fX3BhcnNlUGF0aERhdGEgPSBudWxsO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSBcInBhdGhcIjtcclxuICAgICAgICB0aGlzLmlkID0gVXRpbHMuY3JlYXRlSWQodGhpcy50eXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgICR3YXRjaChuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicGF0aFwiKSB7IC8v5aaC5p6ccGF0aOacieWPmOWKqO+8jOmcgOimgeiHquWKqOiuoeeul+aWsOeahHBvaW50TGlzdFxyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoaWNzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgX3BhcnNlUGF0aERhdGEoZGF0YSkgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuX19wYXJzZVBhdGhEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fcGFyc2VQYXRoRGF0YTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL+WIhuaLhuWtkOWIhue7hFxyXG4gICAgICAgIHRoaXMuX19wYXJzZVBhdGhEYXRhID0gW107XHJcbiAgICAgICAgdmFyIHBhdGhzID0gXy5jb21wYWN0KGRhdGEucmVwbGFjZSgvW01tXS9nLCBcIlxcXFxyJCZcIikuc3BsaXQoJ1xcXFxyJykpO1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgXy5lYWNoKHBhdGhzLCBmdW5jdGlvbihwYXRoU3RyKSB7XHJcbiAgICAgICAgICAgIG1lLl9fcGFyc2VQYXRoRGF0YS5wdXNoKG1lLl9wYXJzZUNoaWxkUGF0aERhdGEocGF0aFN0cikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9fcGFyc2VQYXRoRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBfcGFyc2VDaGlsZFBhdGhEYXRhKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gY29tbWFuZCBzdHJpbmdcclxuICAgICAgICB2YXIgY3MgPSBkYXRhO1xyXG4gICAgICAgIC8vIGNvbW1hbmQgY2hhcnNcclxuICAgICAgICB2YXIgY2MgPSBbXHJcbiAgICAgICAgICAgICdtJywgJ00nLCAnbCcsICdMJywgJ3YnLCAnVicsICdoJywgJ0gnLCAneicsICdaJyxcclxuICAgICAgICAgICAgJ2MnLCAnQycsICdxJywgJ1EnLCAndCcsICdUJywgJ3MnLCAnUycsICdhJywgJ0EnXHJcbiAgICAgICAgXTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLyAgL2csICcgJyk7XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8gL2csICcsJyk7XHJcbiAgICAgICAgLy9jcyA9IGNzLnJlcGxhY2UoLyguKS0vZywgXCIkMSwtXCIpO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvKFxcZCktL2csICckMSwtJyk7XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8sLC9nLCAnLCcpO1xyXG4gICAgICAgIHZhciBuO1xyXG4gICAgICAgIC8vIGNyZWF0ZSBwaXBlcyBzbyB0aGF0IHdlIGNhbiBzcGxpdCB0aGUgZGF0YVxyXG4gICAgICAgIGZvciAobiA9IDA7IG4gPCBjYy5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgICBjcyA9IGNzLnJlcGxhY2UobmV3IFJlZ0V4cChjY1tuXSwgJ2cnKSwgJ3wnICsgY2Nbbl0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYXJyYXlcclxuICAgICAgICB2YXIgYXJyID0gY3Muc3BsaXQoJ3wnKTtcclxuICAgICAgICB2YXIgY2EgPSBbXTtcclxuICAgICAgICAvLyBpbml0IGNvbnRleHQgcG9pbnRcclxuICAgICAgICB2YXIgY3B4ID0gMDtcclxuICAgICAgICB2YXIgY3B5ID0gMDtcclxuICAgICAgICBmb3IgKG4gPSAxOyBuIDwgYXJyLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBhcnJbbl07XHJcbiAgICAgICAgICAgIHZhciBjID0gc3RyLmNoYXJBdCgwKTtcclxuICAgICAgICAgICAgc3RyID0gc3RyLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCdlLC0nLCAnZycpLCAnZS0nKTtcclxuXHJcbiAgICAgICAgICAgIC8v5pyJ55qE5pe25YCZ77yM5q+U5aaC4oCcMjLvvIwtMjLigJ0g5pWw5o2u5Y+v6IO95Lya57uP5bi455qE6KKr5YaZ5oiQMjItMjLvvIzpgqPkuYjpnIDopoHmiYvliqjkv67mlLlcclxuICAgICAgICAgICAgLy9zdHIgPSBzdHIucmVwbGFjZShuZXcgUmVnRXhwKCctJywgJ2cnKSwgJywtJyk7XHJcbiAgICAgICAgICAgIC8vc3RyID0gc3RyLnJlcGxhY2UoLyguKS0vZywgXCIkMSwtXCIpXHJcbiAgICAgICAgICAgIHZhciBwID0gc3RyLnNwbGl0KCcsJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocC5sZW5ndGggPiAwICYmIHBbMF0gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBbaV0gPSBwYXJzZUZsb2F0KHBbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChwLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGNtZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGN0bFB0eDtcclxuICAgICAgICAgICAgICAgIHZhciBjdGxQdHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldkNtZDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcng7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHNpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZzO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB4MSA9IGNweDtcclxuICAgICAgICAgICAgICAgIHZhciB5MSA9IGNweTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IGwsIEgsIGgsIFYsIGFuZCB2IHRvIExcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICdsJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2gnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnSCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwLnNoaWZ0KCksIHAuc2hpZnQoKSwgcC5zaGlmdCgpLCBwLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdjJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNweCArIHAuc2hpZnQoKSwgY3B5ICsgcC5zaGlmdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdDJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdTJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ0MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjdGxQdHgsIGN0bFB0eSwgcC5zaGlmdCgpLCBwLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHgsIGN0bFB0eSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNtZCA9IGNhW2NhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNtZC5jb21tYW5kID09PSAnQycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCArIChjcHggLSBwcmV2Q21kLnBvaW50c1syXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHkgKyAoY3B5IC0gcHJldkNtZC5wb2ludHNbM10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4LCBjdGxQdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCArIHAuc2hpZnQoKSwgY3B5ICsgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ1EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHgsIGN0bFB0eSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNtZCA9IGNhW2NhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNtZC5jb21tYW5kID09PSAnUScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCArIChjcHggLSBwcmV2Q21kLnBvaW50c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHkgKyAoY3B5IC0gcHJldkNtZC5wb2ludHNbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnUSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGN0bFB0eCwgY3RsUHR5LCBjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHgsIGN0bFB0eSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNtZCA9IGNhW2NhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNtZC5jb21tYW5kID09PSAnUScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCArIChjcHggLSBwcmV2Q21kLnBvaW50c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHkgKyAoY3B5IC0gcHJldkNtZC5wb2ludHNbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdRJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3RsUHR4LCBjdGxQdHksIGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ4ID0gcC5zaGlmdCgpOyAvL3jljYrlvoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnkgPSBwLnNoaWZ0KCk7IC8veeWNiuW+hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwc2kgPSBwLnNoaWZ0KCk7IC8v5peL6L2s6KeS5bqmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhID0gcC5zaGlmdCgpOyAvL+inkuW6puWkp+WwjyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMgPSBwLnNoaWZ0KCk7IC8v5pe26ZKI5pa55ZCRXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGNweCwgeTEgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKSwgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IFsgcnggLCByeSAscHNpICwgZmEgLGZzICxjcHggLCBjcHkgLCB4MSAsIHkxIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByeSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHNpID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMgPSBwLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGNweCwgeTEgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdBJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzID0gWyByeCAsIHJ5ICxwc2kgLCBmYSAsZnMgLGNweCAsIGNweSAsIHgxICwgeTEgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2EucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogY21kIHx8IGMsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiBwb2ludHNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ3onIHx8IGMgPT09ICdaJykge1xyXG4gICAgICAgICAgICAgICAgY2EucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ3onLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50czogW11cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gY2E7XHJcbiAgICB9XHJcblxyXG4gICAgLy/ph43mlrDmoLnnmoRwYXRo57uY5Yi2Z3JhcGhpY3NcclxuICAgIHNldEdyYXBoaWNzKClcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5fX3BhcnNlUGF0aERhdGEgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5wb2ludExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgdmFyIHBhdGhBcnJheSA9IHRoaXMuX3BhcnNlUGF0aERhdGEodGhpcy5jb250ZXh0LnBhdGgpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBnID0gMCwgZ2wgPSBwYXRoQXJyYXkubGVuZ3RoOyBnIDwgZ2w7IGcrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gcGF0aEFycmF5W2ddW2ldLmNvbW1hbmQsIHAgPSBwYXRoQXJyYXlbZ11baV0ucG9pbnRzO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MubGluZVRvKHBbMF0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5tb3ZlVG8ocFswXSwgcFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzLmJlemllckN1cnZlVG8ocFswXSwgcFsxXSwgcFsyXSwgcFszXSwgcFs0XSwgcFs1XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzLnF1YWRyYXRpY0N1cnZlVG8ocFswXSwgcFsxXSwgcFsyXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WJjemdojbkuKrlhYPntKDnlKjmnaXmlL5wYXRo55qEQSA25Liq5Y+C5pWw77yMcGF0aCBB5ZG95Luk6K+m6KeBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFyYy5kcmF3QXJjKCB0aGlzLmdyYXBoaWNzICwgcFs3XSAsIHBbOF0gLCBwICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3onOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG59IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOawtOa7tOW9oiDnsbtcclxuICog5rS+55Sf6IeqUGF0aOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBociDmsLTmu7TmqKrlrr3vvIjkuK3lv4PliLDmsLTlubPovrnnvJjmnIDlrr3lpITot53nprvvvIlcclxuICogQHZyIOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gKiovXHJcbmltcG9ydCBQYXRoIGZyb20gXCIuL1BhdGhcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJvcGxldCBleHRlbmRzIFBhdGhcclxue1xyXG4gICAgY29uc3RydWN0b3Iob3B0KVxyXG4gICAge1xyXG4gICAgICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgICAgICB2YXIgX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIGhyIDogMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOawtOa7tOaoquWuve+8iOS4reW/g+WIsOawtOW5s+i+uee8mOacgOWuveWkhOi3neemu++8iVxyXG4gICAgICAgICAgICB2ciA6IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5rC05ru057q16auY77yI5Lit5b+D5Yiw5bCW56uv6Led56a777yJXHJcbiAgICAgICAgfSAsIG9wdC5jb250ZXh0KTtcclxuXHJcbiAgICAgICAgb3B0LmNvbnRleHQgPSBfY29udGV4dDtcclxuXHJcbiAgICAgICAgdmFyIG15ID0gc3VwZXIob3B0KTtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gXCJkcm9wbGV0XCI7XHJcbiAgICAgICAgdGhpcy5pZCA9IFV0aWxzLmNyZWF0ZUlkKHRoaXMudHlwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGV4dC5wYXRoID0gdGhpcy5fY3JlYXRlUGF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgICR3YXRjaChuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIFxyXG4gICAge1xyXG4gICAgICAgIGlmICggbmFtZSA9PSBcImhyXCIgfHwgbmFtZSA9PSBcInZyXCIgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5wYXRoID0gdGhpcy5fY3JlYXRlUGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJwYXRoXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgX2NyZWF0ZVBhdGgoKSBcclxuICAgIHtcclxuICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgdmFyIHBzID0gXCJNIDAgXCIrY29udGV4dC5ocitcIiBDIFwiK2NvbnRleHQuaHIrXCIgXCIrY29udGV4dC5ocitcIiBcIisoIGNvbnRleHQuaHIqMy8yICkgK1wiIFwiKygtY29udGV4dC5oci8zKStcIiAwIFwiKygtY29udGV4dC52cik7XHJcbiAgICAgICBwcyArPSBcIiBDIFwiKygtY29udGV4dC5ociAqIDMvIDIpK1wiIFwiKygtY29udGV4dC5ociAvIDMpK1wiIFwiKygtY29udGV4dC5ocikrXCIgXCIrY29udGV4dC5ocitcIiAwIFwiKyBjb250ZXh0LmhyKyBcInpcIjtcclxuICAgICAgIHJldHVybiBwcztcclxuICAgIH1cclxufSIsIlxyXG4vKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5qSt5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJIFxyXG4gKlxyXG4gKiBAaHIg5qSt5ZyG5qiq6L205Y2K5b6EXHJcbiAqIEB2ciDmpK3lnIbnurXovbTljYrlvoRcclxuICovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGxpcHNlIGV4dGVuZHMgU2hhcGVcclxue1xyXG4gICAgY29uc3RydWN0b3Iob3B0KVxyXG4gICAge1xyXG4gICAgICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgICAgICB2YXIgX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIC8veCAgICAgICAgICAgICA6IDAgLCAvL3tudW1iZXJ9LCAgLy8g5Lii5byDXHJcbiAgICAgICAgICAgIC8veSAgICAgICAgICAgICA6IDAgLCAvL3tudW1iZXJ9LCAgLy8g5Lii5byD77yM5Y6f5Zug5ZCMY2lyY2xlXHJcbiAgICAgICAgICAgIGhyIDogMCwgIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmpK3lnIbmqKrovbTljYrlvoRcclxuICAgICAgICAgICAgdnIgOiAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOakreWchue6tei9tOWNiuW+hFxyXG4gICAgICAgIH0gLCBvcHQuY29udGV4dCk7XHJcblxyXG4gICAgICAgIG9wdC5jb250ZXh0ID0gX2NvbnRleHQ7XHJcblxyXG4gICAgICAgIHN1cGVyKCBvcHQgKTtcclxuXHJcbiAgICAgICAgdGhpcy50eXBlID0gXCJlbGxpcHNlXCI7XHJcbiAgICAgICAgdGhpcy5pZCA9IFV0aWxzLmNyZWF0ZUlkKHRoaXMudHlwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JhcGhpY3MoKTtcclxuICAgIH1cclxuXHJcbiAgICAkd2F0Y2gobmFtZSwgdmFsdWUsIHByZVZhbHVlKSBcclxuICAgIHtcclxuICAgICAgICBpZiAoIG5hbWUgPT0gXCJoclwiIHx8IG5hbWUgPT0gXCJ2clwiICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoaWNzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEdyYXBoaWNzKClcclxuICAgIHsgICAgXHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3MuZHJhd0VsbGlwc2UoMCwwLCB0aGlzLmNvbnRleHQuaHIqMiAsIHRoaXMuY29udGV4dC52cioyKTtcclxuICAgIH1cclxufTtcclxuIiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOWkmui+ueW9oiDnsbsgIO+8iOS4jeinhOWIme+8iVxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBwb2ludExpc3Qg5aSa6L655b2i5ZCE5Liq6aG26KeS5Z2Q5qCHXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuaW1wb3J0IF9NYXRoIGZyb20gXCIuLi9nZW9tL01hdGhcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9seWdvbiBleHRlbmRzIFNoYXBlIFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihvcHQsIGF0eXBlKVxyXG4gICAge1xyXG4gICAgICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XHJcbiAgICAgICAgdmFyIF9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgICAgICBsaW5lVHlwZTogbnVsbCxcclxuICAgICAgICAgICAgc21vb3RoOiBmYWxzZSxcclxuICAgICAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy97QXJyYXl9ICAvLyDlv4XpobvvvIzlkITkuKrpobbop5LlnZDmoIdcclxuICAgICAgICAgICAgc21vb3RoRmlsdGVyOiBVdGlscy5fX2VtcHR5RnVuY1xyXG4gICAgICAgIH0sIG9wdC5jb250ZXh0ICk7XHJcblxyXG4gICAgICAgIGlmKGF0eXBlICE9PSBcImNsb25lXCIpe1xyXG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBfY29udGV4dC5wb2ludExpc3RbMF07XHJcbiAgICAgICAgICAgIHZhciBlbmQgICA9IF9jb250ZXh0LnBvaW50TGlzdC5zbGljZSggLSAxIClbMF07XHJcbiAgICAgICAgICAgIGlmKCBfY29udGV4dC5zbW9vdGggKXtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LnBvaW50TGlzdC51bnNoaWZ0KCBlbmQgKTtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LnBvaW50TGlzdCA9IF9NYXRoLmdldFNtb290aFBvaW50TGlzdCggX2NvbnRleHQucG9pbnRMaXN0ICk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIC8vZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgIF9jb250ZXh0LnBvaW50TGlzdC5wdXNoKCBzdGFydCApO1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBvcHQuY29udGV4dCA9IF9jb250ZXh0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyKG9wdCwgYXR5cGUpO1xyXG5cclxuICAgICAgICB0aGlzLl9kcmF3VHlwZU9ubHkgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IFwicG9seWdvblwiO1xyXG4gICAgICAgIHRoaXMuaWQgPSBVdGlscy5jcmVhdGVJZCh0aGlzLnR5cGUpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdyYXBoaWNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHdhdGNoKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkgXHJcbiAgICB7XHJcbiAgICAgICAgLy/osIPnlKhwYXJlbnTnmoRzZXRHcmFwaGljc1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicG9pbnRMaXN0XCIgfHwgbmFtZSA9PSBcInNtb290aFwiIHx8IG5hbWUgPT0gXCJsaW5lVHlwZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0R3JhcGhpY3MoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0R3JhcGhpY3MoKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgY29uc3QgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XHJcbiAgICAgICAgaWYgKHBvaW50TGlzdC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIC8v5bCR5LqOMuS4queCueWwseS4jeeUu+S6hn5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3MubW92ZVRvKHBvaW50TGlzdFswXVswXSwgcG9pbnRMaXN0WzBdWzFdKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5saW5lVG8ocG9pbnRMaXN0W2ldWzBdLCBwb2ludExpc3RbaV1bMV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgLy/lpoLmnpzkuLromZrnur9cclxuICAgICAgICBpZiAoY29udGV4dC5saW5lVHlwZSA9PSAnZGFzaGVkJyB8fCBjb250ZXh0LmxpbmVUeXBlID09ICdkb3R0ZWQnKSB7XHJcbiAgICAgICAgICAgIC8v6aaW5YWI5oqK5YmN6Z2i55qEZHJhcGhpY3NEYXRh6K6+572u5Li6ZmlsbCBvbmx5XHJcbiAgICAgICAgICAgIC8v5Lmf5bCx5piv5oqKbGluZeW8uuWItuiuvue9ruS4umZhbHNl77yM6L+Z54K55b6I6YeN6KaB77yM5ZCm5YiZ5L2g6Jma57q/55S75LiN5Ye65p2l77yM5Lya5ZKM6L+Z5Liq5a6e546w6YeN5Y+g5LqGXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MuY3VycmVudFBhdGgubGluZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuc21vb3RoKSB7XHJcbiAgICAgICAgICAgICAgICAvL+WmguaenOaYr3Ntb290aO+8jOacrOi6q+W3sue7j+iiq+eUqOabsueOh+aJk+aVo+i/h+S6hu+8jOS4jemcgOimgemHh+eUqOmXtOmalOazlVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgc2kgPSAwLCBzbCA9IHBvaW50TGlzdC5sZW5ndGg7IHNpIDwgc2w7IHNpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2kgPT0gc2wtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MubW92ZVRvKCBwb2ludExpc3Rbc2ldWzBdICwgcG9pbnRMaXN0W3NpXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MubGluZVRvKCBwb2ludExpc3Rbc2krMV1bMF0gLCBwb2ludExpc3Rbc2krMV1bMV0gKTtcclxuICAgICAgICAgICAgICAgICAgICBzaSs9MTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL+eUu+iZmue6v+eahOaWueazlSAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoaWNzLm1vdmVUbyhwb2ludExpc3RbMF1bMF0sIHBvaW50TGlzdFswXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVggPSBwb2ludExpc3RbaSAtIDFdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b1ggPSBwb2ludExpc3RbaV1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21ZID0gcG9pbnRMaXN0W2kgLSAxXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9ZID0gcG9pbnRMaXN0W2ldWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGFzaGVkTGluZVRvKGZyb21YLCBmcm9tWSwgdG9YLCB0b1ksIDUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59OyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmraNu6L655b2i77yIbj49M++8iVxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJIFxyXG4gKlxyXG4gKiBAciDmraNu6L655b2i5aSW5o6l5ZyG5Y2K5b6EXHJcbiAqIEByIOaMh+aYjuato+WHoOi+ueW9olxyXG4gKlxyXG4gKiBAcG9pbnRMaXN0IOengeacie+8jOS7juS4iumdoueahHLlkoxu6K6h566X5b6X5Yiw55qE6L6555WM5YC855qE6ZuG5ZCIXHJcbiAqL1xyXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi9Qb2x5Z29uXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuaW1wb3J0IF9NYXRoIGZyb20gXCIuLi9nZW9tL01hdGhcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNvZ29uIGV4dGVuZHMgUG9seWdvblxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihvcHQpXHJcbiAgICB7XHJcbiAgICAgICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgICAgICB2YXIgX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIHBvaW50TGlzdDogW10sIC8v5LuO5LiL6Z2i55qEcuWSjG7orqHnrpflvpfliLDnmoTovrnnlYzlgLznmoTpm4blkIhcclxuICAgICAgICAgICAgcjogMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOato27ovrnlvaLlpJbmjqXlnIbljYrlvoRcclxuICAgICAgICAgICAgbjogMCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5oyH5piO5q2j5Yeg6L655b2iXHJcbiAgICAgICAgfSAsIG9wdC5jb250ZXh0KTtcclxuICAgICAgICBfY29udGV4dC5wb2ludExpc3QgPSBfTWF0aC5nZXRJc2dvblBvaW50TGlzdCggX2NvbnRleHQubiAsIF9jb250ZXh0LnIgKTtcclxuXHJcbiAgICAgICAgb3B0LmNvbnRleHQgPSBfY29udGV4dDtcclxuXHJcbiAgICAgICAgc3VwZXIoIG9wdCApO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSBcImlzb2dvblwiO1xyXG4gICAgICAgIHRoaXMuaWQgPSBVdGlscy5jcmVhdGVJZCh0aGlzLnR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgICR3YXRjaChuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJyXCIgfHwgbmFtZSA9PSBcIm5cIil7IC8v5aaC5p6ccGF0aOacieWPmOWKqO+8jOmcgOimgeiHquWKqOiuoeeul+aWsOeahHBvaW50TGlzdFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQucG9pbnRMaXN0ID0gX01hdGguZ2V0SXNnb25Qb2ludExpc3QoIHN0eWxlLm4gLCBzdHlsZS5yICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmFtZSA9PSBcInBvaW50TGlzdFwiIHx8IG5hbWUgPT0gXCJzbW9vdGhcIiB8fCBuYW1lID09IFwibGluZVR5cGVcIikge1xyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoaWNzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3MuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDnur/mnaEg57G7XHJcbiAqXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQGxpbmVUeXBlICDlj6/pgIkg6Jma57q/IOWunueOsCDnmoQg57G75Z6LXHJcbiAqIEB4U3RhcnQgICAg5b+F6aG777yM6LW354K55qiq5Z2Q5qCHXHJcbiAqIEB5U3RhcnQgICAg5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAqIEB4RW5kICAgICAg5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAqIEB5RW5kICAgICAg5b+F6aG777yM57uI54K557q15Z2Q5qCHXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihvcHQpXHJcbiAgICB7XHJcbiAgICAgICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgICAgICB2YXIgX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIGxpbmVUeXBlOiBudWxsLCAvL+WPr+mAiSDomZrnur8g5a6e546wIOeahCDnsbvlnotcclxuICAgICAgICAgICAgc3RhcnQ6IHtcclxuICAgICAgICAgICAgICAgIHggOiAwLCAgICAgIC8vIOW/hemhu++8jOi1t+eCueaoquWdkOagh1xyXG4gICAgICAgICAgICAgICAgeSA6IDAgICAgICAgLy8g5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuZDoge1xyXG4gICAgICAgICAgICAgICAgeCA6IDAsICAgICAgLy8g5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAgICAgICAgICAgICAgICB5IDogMCAgICAgICAvLyDlv4XpobvvvIznu4jngrnnurXlnZDmoIdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGFzaExlbmd0aDogMyAgICAvLyDomZrnur/pl7TpmpRcclxuICAgICAgICB9ICwgb3B0LmNvbnRleHQpO1xyXG4gICAgICAgIG9wdC5jb250ZXh0ID0gX2NvbnRleHQ7XHJcblxyXG4gICAgICAgIHN1cGVyKCBvcHQgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSBcImxpbmVcIjtcclxuICAgICAgICB0aGlzLmlkID0gVXRpbHMuY3JlYXRlSWQodGhpcy50eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAkd2F0Y2gobmFtZSwgdmFsdWUsIHByZVZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIC8v5bm25LiN5riF5qWa5pivc3RhcnQueCDov5jmmK9lbmQueO+8jCDlvZPnhLbvvIzov5nlubbkuI3ph43opoFcclxuICAgICAgICBpZiAobmFtZSA9PSBcInhcIiB8fCBuYW1lID09IFwieVwiKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRHcmFwaGljcygpIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3MuY2xlYXIoKTtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmICghY29udGV4dC5saW5lVHlwZSB8fCBjb250ZXh0LmxpbmVUeXBlID09ICdzb2xpZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5tb3ZlVG8oIGNvbnRleHQuc3RhcnQueCAsIGNvbnRleHQuc3RhcnQueSApOyBcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5saW5lVG8oIGNvbnRleHQuZW5kLnggICAsIGNvbnRleHQuZW5kLnkgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc3RhcnQueCwgY29udGV4dC5zdGFydC55LFxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5lbmQueCAgLCBjb250ZXh0LmVuZC55LCBcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5kYXNoTGVuZ3RoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiBcclxufTsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog55+p546wIOexuyAg77yI5LiN6KeE5YiZ77yJXHJcbiAqXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHdpZHRoIOWuveW6plxyXG4gKiBAaGVpZ2h0IOmrmOW6plxyXG4gKiBAcmFkaXVzIOWmguaenOaYr+WchuinkueahO+8jOWImeS4uuOAkOS4iuWPs+S4i+W3puOAkemhuuW6j+eahOWchuinkuWNiuW+hOaVsOe7hFxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0IGV4dGVuZHMgU2hhcGVcclxue1xyXG4gICAgY29uc3RydWN0b3Iob3B0KVxyXG4gICAge1xyXG4gICAgICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgICAgICB2YXIgX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgICAgIHdpZHRoIDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgICByYWRpdXM6IFtdLFxyXG4gICAgICAgIH0gLCBvcHQuY29udGV4dCk7XHJcbiAgICAgICAgb3B0LmNvbnRleHQgPSBfY29udGV4dDtcclxuXHJcbiAgICAgICAgc3VwZXIoIG9wdCApO1xyXG5cclxuICAgICAgICB0aGlzLnR5cGUgPSBcInJlY3RcIjtcclxuICAgICAgICB0aGlzLmlkID0gVXRpbHMuY3JlYXRlSWQodGhpcy50eXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG4gICAgfVxyXG5cclxuICAgICR3YXRjaChuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIFxyXG4gICAge1xyXG4gICAgICAgIGlmICggbmFtZSA9PSBcIndpZHRoXCIgfHwgbmFtZSA9PSBcImhlaWdodFwiIHx8IG5hbWUgPT0gXCJyYWRpdXNcIiApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRHcmFwaGljcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe7mOWItuWchuinkuefqeW9olxyXG4gICAgICovXHJcbiAgICBfYnVpbGRSYWRpdXNQYXRoKClcclxuICAgIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICAvL+W3puS4iuOAgeWPs+S4iuOAgeWPs+S4i+OAgeW3puS4i+inkueahOWNiuW+hOS+neasoeS4unIx44CBcjLjgIFyM+OAgXI0XHJcbiAgICAgICAgLy9y57yp5YaZ5Li6MSAgICAgICAgIOebuOW9k+S6jiBbMSwgMSwgMSwgMV1cclxuICAgICAgICAvL3LnvKnlhpnkuLpbMV0gICAgICAg55u45b2T5LqOIFsxLCAxLCAxLCAxXVxyXG4gICAgICAgIC8vcue8qeWGmeS4ulsxLCAyXSAgICDnm7jlvZPkuo4gWzEsIDIsIDEsIDJdXHJcbiAgICAgICAgLy9y57yp5YaZ5Li6WzEsIDIsIDNdIOebuOW9k+S6jiBbMSwgMiwgMywgMl1cclxuICAgICAgICB2YXIgeCA9IDA7XHJcbiAgICAgICAgdmFyIHkgPSAwO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMuY29udGV4dC53aWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5jb250ZXh0LmhlaWdodDtcclxuICAgIFxyXG4gICAgICAgIHZhciByID0gVXRpbHMuZ2V0Q3NzT3JkZXJBcnIoY29udGV4dC5yYWRpdXMpO1xyXG4gICAgICAgIHZhciBHID0gdGhpcy5ncmFwaGljcztcclxuICAgICBcclxuICAgICAgICBHLm1vdmVUbyggcGFyc2VJbnQoeCArIHJbMF0pLCBwYXJzZUludCh5KSk7XHJcbiAgICAgICAgRy5saW5lVG8oIHBhcnNlSW50KHggKyB3aWR0aCAtIHJbMV0pLCBwYXJzZUludCh5KSk7XHJcbiAgICAgICAgclsxXSAhPT0gMCAmJiBHLnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICB4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIHJbMV1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgRy5saW5lVG8oIHBhcnNlSW50KHggKyB3aWR0aCksIHBhcnNlSW50KHkgKyBoZWlnaHQgLSByWzJdKSk7XHJcbiAgICAgICAgclsyXSAhPT0gMCAmJiBHLnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICB4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJbMl0sIHkgKyBoZWlnaHRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgRy5saW5lVG8oIHBhcnNlSW50KHggKyByWzNdKSwgcGFyc2VJbnQoeSArIGhlaWdodCkpO1xyXG4gICAgICAgIHJbM10gIT09IDAgJiYgRy5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJbM11cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgRy5saW5lVG8oIHBhcnNlSW50KHgpLCBwYXJzZUludCh5ICsgclswXSkpO1xyXG4gICAgICAgIHJbMF0gIT09IDAgJiYgRy5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByWzBdLCB5KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu655+p5b2i6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0ge0NvbnRleHQyRH0gY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQg5qC35byPXHJcbiAgICAgKi9cclxuICAgIHNldEdyYXBoaWNzKCkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5jbGVhcigpO1xyXG4gICAgICAgIGlmKCF0aGlzLmNvbnRleHQucmFkaXVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzLmRyYXdSZWN0KDAsMCx0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9idWlsZFJhZGl1c1BhdGgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncmFwaGljcy5jbG9zZVBhdGgoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5omH5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcjAg6buY6K6k5Li6MO+8jOWGheWchuWNiuW+hOaMh+WumuWQjuWwhuWHuueOsOWGheW8p++8jOWQjOaXtuaJh+i+uemVv+W6piA9IHIgLSByMFxyXG4gKiBAciAg5b+F6aG777yM5aSW5ZyG5Y2K5b6EXHJcbiAqIEBzdGFydEFuZ2xlIOi1t+Wni+inkuW6pigwLCAzNjApXHJcbiAqIEBlbmRBbmdsZSAgIOe7k+adn+inkuW6pigwLCAzNjApXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuaW1wb3J0IG15TWF0aCBmcm9tIFwiLi4vZ2VvbS9NYXRoXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWN0b3IgZXh0ZW5kcyBTaGFwZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihvcHQpXHJcbiAgICB7XHJcbiAgICAgICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgICAgIHZhciBfY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICAgICAgcG9pbnRMaXN0ICA6IFtdLC8v6L6555WM54K555qE6ZuG5ZCILOengeacie+8jOS7juS4i+mdoueahOWxnuaAp+iuoeeul+eahOadpVxyXG4gICAgICAgICAgICByMCAgICAgICAgIDogMCwvLyDpu5jorqTkuLow77yM5YaF5ZyG5Y2K5b6E5oyH5a6a5ZCO5bCG5Ye6546w5YaF5byn77yM5ZCM5pe25omH6L656ZW/5bqmID0gciAtIHIwXHJcbiAgICAgICAgICAgIHIgICAgICAgICAgOiAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzlpJblnIbljYrlvoRcclxuICAgICAgICAgICAgc3RhcnRBbmdsZSA6IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOi1t+Wni+inkuW6plswLCAzNjApXHJcbiAgICAgICAgICAgIGVuZEFuZ2xlICAgOiAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uT5p2f6KeS5bqmKDAsIDM2MF1cclxuICAgICAgICAgICAgY2xvY2t3aXNlICA6IGZhbHNlIC8v5piv5ZCm6aG65pe26ZKI77yM6buY6K6k5Li6ZmFsc2Uo6aG65pe26ZKIKVxyXG4gICAgICAgIH0gLCBvcHQuY29udGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgb3B0LmNvbnRleHQgPSBfY29udGV4dDtcclxuXHJcbiAgICAgICAgc3VwZXIob3B0KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVnQW5nbGUgID0gW107XHJcbiAgICAgICAgdGhpcy5pc1JpbmcgICAgPSBmYWxzZTsvL+aYr+WQpuS4uuS4gOS4quWchueOr1xyXG4gICAgICAgIHRoaXMudHlwZSA9IFwic2VjdG9yXCI7XHJcbiAgICAgICAgdGhpcy5pZCA9IFV0aWxzLmNyZWF0ZUlkKHRoaXMudHlwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R3JhcGhpY3MoKTtcclxuICAgIH1cclxuXHJcbiAgICAkd2F0Y2gobmFtZSwgdmFsdWUsIHByZVZhbHVlKSBcclxuICAgIHtcclxuICAgICAgICBpZiAoIG5hbWUgPT0gXCJyMFwiIHx8IG5hbWUgPT0gXCJyXCIgfHwgbmFtZSA9PSBcInN0YXJ0QW5nbGVcIiB8fCBuYW1lID09XCJlbmRBbmdsZVwiIHx8IG5hbWUgPT1cImNsb2Nrd2lzZVwiICkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEdyYXBoaWNzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEdyYXBoaWNzKCkgXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgLy8g5b2i5YaF5Y2K5b6EWzAscilcclxuICAgICAgICB2YXIgcjAgPSB0eXBlb2YgY29udGV4dC5yMCA9PSAndW5kZWZpbmVkJyA/IDAgOiBjb250ZXh0LnIwO1xyXG4gICAgICAgIHZhciByICA9IGNvbnRleHQucjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5omH5b2i5aSW5Y2K5b6EKDAscl1cclxuICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgdmFyIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5lbmRBbmdsZSk7ICAgICAgICAgICAgICAvLyDnu5PmnZ/op5LluqYoMCwzNjBdXHJcblxyXG4gICAgICAgIC8vdmFyIGlzUmluZyAgICAgPSBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5piv5ZCm5Li65ZyG546vXHJcblxyXG4gICAgICAgIC8vaWYoIHN0YXJ0QW5nbGUgIT0gZW5kQW5nbGUgJiYgTWF0aC5hYnMoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSAlIDM2MCA9PSAwICkge1xyXG4gICAgICAgIGlmKCBzdGFydEFuZ2xlID09IGVuZEFuZ2xlICYmIGNvbnRleHQuc3RhcnRBbmdsZSAhPSBjb250ZXh0LmVuZEFuZ2xlICkge1xyXG4gICAgICAgICAgICAvL+WmguaenOS4pOS4quinkuW6puebuOetie+8jOmCo+S5iOWwseiupOS4uuaYr+S4quWchueOr+S6hlxyXG4gICAgICAgICAgICB0aGlzLmlzUmluZyAgICAgPSB0cnVlO1xyXG4gICAgICAgICAgICBzdGFydEFuZ2xlID0gMCA7XHJcbiAgICAgICAgICAgIGVuZEFuZ2xlICAgPSAzNjA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpO1xyXG4gICAgICAgIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oZW5kQW5nbGUpO1xyXG4gICAgIFxyXG4gICAgICAgIC8v5aSE55CG5LiL5p6B5bCP5aS56KeS55qE5oOF5Ya1XHJcbiAgICAgICAgaWYoIGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSA8IDAuMDI1ICl7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgLT0gMC4wMDNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBHID0gdGhpcy5ncmFwaGljcztcclxuXHJcbiAgICAgICAgRy5hcmMoIDAgLCAwICwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIHRoaXMuY29udGV4dC5jbG9ja3dpc2UpO1xyXG4gICAgICAgIGlmIChyMCAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZiggdGhpcy5pc1JpbmcgKXtcclxuICAgICAgICAgICAgICAgIC8v5Yqg5LiK6L+Z5LiqaXNSaW5n55qE6YC76L6R5piv5Li65LqG5YW85a65Zmxhc2hjYW52YXPkuIvnu5jliLblnIbnjq/nmoTnmoTpl67pophcclxuICAgICAgICAgICAgICAgIC8v5LiN5Yqg6L+Z5Liq6YC76L6RZmxhc2hjYW52YXPkvJrnu5jliLbkuIDkuKrlpKflnIYg77yMIOiAjOS4jeaYr+WchueOr1xyXG4gICAgICAgICAgICAgICAgRy5tb3ZlVG8oIHIwICwgMCApO1xyXG4gICAgICAgICAgICAgICAgRy5hcmMoIDAgLCAwICwgcjAgLCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgLCAhdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBHLmFyYyggMCAsIDAgLCByMCAsIGVuZEFuZ2xlICwgc3RhcnRBbmdsZSAsICF0aGlzLmNvbnRleHQuY2xvY2t3aXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzrlnKhyMOS4ujDnmoTml7blgJnvvIzlpoLmnpzkuI3liqBsaW5lVG8oMCwwKeadpeaKiui3r+W+hOmXreWQiO+8jOS8muWHuueOsOacieaQnueskeeahOS4gOS4qmJ1Z1xyXG4gICAgICAgICAgICAvL+aVtOS4quWchuS8muWHuueOsOS4gOS4quS7peavj+S4quaJh+W9ouS4pOerr+S4uuiKgueCueeahOmVguepuu+8jOaIkeWPr+iDveaPj+i/sOS4jea4healmu+8jOWPjeato+i/meS4quWKoOS4iuWwseWlveS6hlxyXG4gICAgICAgICAgICBHLmxpbmVUbygwLDApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgRy5jbG9zZVBhdGgoKTtcclxuICAgICB9XHJcblxyXG4gICAgIGdldFJlZ0FuZ2xlKClcclxuICAgICB7XHJcbiAgICAgICAgIHRoaXMucmVnSW4gICAgICA9IHRydWU7ICAvL+WmguaenOWcqHN0YXJ05ZKMZW5k55qE5pWw5YC85Lit77yMZW5k5aSn5LqOc3RhcnTogIzkuJTmmK/pobrml7bpkojliJlyZWdJbuS4unRydWVcclxuICAgICAgICAgdmFyIGMgICAgICAgICAgID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjLnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGMuZW5kQW5nbGUpOyAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgIGlmICggKCBzdGFydEFuZ2xlID4gZW5kQW5nbGUgJiYgIWMuY2xvY2t3aXNlICkgfHwgKCBzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgYy5jbG9ja3dpc2UgKSApIHtcclxuICAgICAgICAgICAgIHRoaXMucmVnSW4gID0gZmFsc2U7IC8vb3V0XHJcbiAgICAgICAgIH07XHJcbiAgICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXHJcbiAgICAgICAgIHRoaXMucmVnQW5nbGUgICA9IFsgXHJcbiAgICAgICAgICAgICBNYXRoLm1pbiggc3RhcnRBbmdsZSAsIGVuZEFuZ2xlICkgLCBcclxuICAgICAgICAgICAgIE1hdGgubWF4KCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgKSBcclxuICAgICAgICAgXTtcclxuICAgICB9XHJcblxyXG4gICAgIGdldFJlY3QoY29udGV4dClcclxuICAgICB7XHJcbiAgICAgICAgIHZhciBjb250ZXh0ID0gY29udGV4dCA/IGNvbnRleHQgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgIHZhciByMCA9IHR5cGVvZiBjb250ZXh0LnIwID09ICd1bmRlZmluZWQnICAgICAvLyDlvaLlhoXljYrlvoRbMCxyKVxyXG4gICAgICAgICAgICAgPyAwIDogY29udGV4dC5yMDtcclxuICAgICAgICAgdmFyIHIgPSBjb250ZXh0LnI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaJh+W9ouWkluWNiuW+hCgwLHJdXHJcbiAgICAgICAgIFxyXG4gICAgICAgICB0aGlzLmdldFJlZ0FuZ2xlKCk7XHJcblxyXG4gICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuZW5kQW5nbGUpOyAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgIHZhciBwb2ludExpc3QgID0gW107XHJcblxyXG4gICAgICAgICB2YXIgcDREaXJlY3Rpb249IHtcclxuICAgICAgICAgICAgIFwiOTBcIiA6IFsgMCAsIHIgXSxcclxuICAgICAgICAgICAgIFwiMTgwXCI6IFsgLXIsIDAgXSxcclxuICAgICAgICAgICAgIFwiMjcwXCI6IFsgMCAsIC1yXSxcclxuICAgICAgICAgICAgIFwiMzYwXCI6IFsgciAsIDAgXSBcclxuICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgIGZvciAoIHZhciBkIGluIHA0RGlyZWN0aW9uICl7XHJcbiAgICAgICAgICAgICB2YXIgaW5BbmdsZVJlZyA9IHBhcnNlSW50KGQpID4gdGhpcy5yZWdBbmdsZVswXSAmJiBwYXJzZUludChkKSA8IHRoaXMucmVnQW5nbGVbMV07XHJcbiAgICAgICAgICAgICBpZiggdGhpcy5pc1JpbmcgfHwgKGluQW5nbGVSZWcgJiYgdGhpcy5yZWdJbikgfHwgKCFpbkFuZ2xlUmVnICYmICF0aGlzLnJlZ0luKSApe1xyXG4gICAgICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKCBwNERpcmVjdGlvblsgZCBdICk7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmKCAhdGhpcy5pc1JpbmcgKSB7XHJcbiAgICAgICAgICAgICBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBzdGFydEFuZ2xlICk7XHJcbiAgICAgICAgICAgICBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBlbmRBbmdsZSAgICk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogcjAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogcjBcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogciAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogclxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3MoZW5kQW5nbGUpICAgKiByICAsICBteU1hdGguc2luKGVuZEFuZ2xlKSAgKiByXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhlbmRBbmdsZSkgICAqIHIwICwgIG15TWF0aC5zaW4oZW5kQW5nbGUpICAqIHIwXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBjb250ZXh0LnBvaW50TGlzdCA9IHBvaW50TGlzdDtcclxuICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjdEZvcm1Qb2ludExpc3QoIGNvbnRleHQgKTtcclxuICAgICB9XHJcbn1cclxuIiwiXG5pbXBvcnQgQXBwbGljYXRpb24gZnJvbSBcIi4vQXBwbGljYXRpb25cIjtcbmltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnREaXNwYXRjaGVyXCI7XG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuL2V2ZW50L0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vZGlzcGxheS9EaXNwbGF5T2JqZWN0XCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBTdGFnZSBmcm9tIFwiLi9kaXNwbGF5L1N0YWdlXCI7XG5pbXBvcnQgU3ByaXRlIGZyb20gXCIuL2Rpc3BsYXkvU3ByaXRlXCI7XG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4vZGlzcGxheS9TaGFwZVwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL2Rpc3BsYXkvUG9pbnRcIjtcbmltcG9ydCBUZXh0IGZyb20gXCIuL2Rpc3BsYXkvVGV4dFwiO1xuXG4vL3NoYXBlc1xuaW1wb3J0IEJyb2tlbkxpbmUgZnJvbSBcIi4vc2hhcGUvQnJva2VuTGluZVwiO1xuaW1wb3J0IENpcmNsZSBmcm9tIFwiLi9zaGFwZS9DaXJjbGVcIjtcbmltcG9ydCBEcm9wbGV0IGZyb20gXCIuL3NoYXBlL0Ryb3BsZXRcIjtcbmltcG9ydCBFbGxpcHNlIGZyb20gXCIuL3NoYXBlL0VsbGlwc2VcIjtcbmltcG9ydCBJc29nb24gZnJvbSBcIi4vc2hhcGUvSXNvZ29uXCI7XG5pbXBvcnQgTGluZSBmcm9tIFwiLi9zaGFwZS9MaW5lXCI7XG5pbXBvcnQgUGF0aCBmcm9tIFwiLi9zaGFwZS9QYXRoXCI7XG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi9zaGFwZS9Qb2x5Z29uXCI7XG5pbXBvcnQgUmVjdCBmcm9tIFwiLi9zaGFwZS9SZWN0XCI7XG5pbXBvcnQgU2VjdG9yIGZyb20gXCIuL3NoYXBlL1NlY3RvclwiO1xuXG52YXIgQ2FudmF4ID0ge1xuICAgIEFwcDogQXBwbGljYXRpb25cbn07XG5cbkNhbnZheC5EaXNwbGF5ID0ge1xuICAgIERpc3BsYXlPYmplY3QgOiBEaXNwbGF5T2JqZWN0LFxuICAgIERpc3BsYXlPYmplY3RDb250YWluZXIgOiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyLFxuICAgIFN0YWdlICA6IFN0YWdlLFxuICAgIFNwcml0ZSA6IFNwcml0ZSxcbiAgICBTaGFwZSAgOiBTaGFwZSxcbiAgICBQb2ludCAgOiBQb2ludCxcbiAgICBUZXh0ICAgOiBUZXh0XG59XG5cbkNhbnZheC5TaGFwZXMgPSB7XG4gICAgQnJva2VuTGluZSA6IEJyb2tlbkxpbmUsXG4gICAgQ2lyY2xlIDogQ2lyY2xlLFxuICAgIERyb3BsZXQgOiBEcm9wbGV0LFxuICAgIEVsbGlwc2UgOiBFbGxpcHNlLFxuICAgIElzb2dvbiA6IElzb2dvbixcbiAgICBMaW5lIDogTGluZSxcbiAgICBQYXRoIDogUGF0aCxcbiAgICBQb2x5Z29uIDogUG9seWdvbixcbiAgICBSZWN0IDogUmVjdCxcbiAgICBTZWN0b3IgOiBTZWN0b3Jcbn1cblxuQ2FudmF4LkV2ZW50ID0ge1xuICAgIEV2ZW50RGlzcGF0Y2hlciA6IEV2ZW50RGlzcGF0Y2hlcixcbiAgICBFdmVudE1hbmFnZXIgICAgOiBFdmVudE1hbmFnZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FudmF4OyJdLCJuYW1lcyI6WyJfIiwiYnJlYWtlciIsIkFycmF5UHJvdG8iLCJBcnJheSIsInByb3RvdHlwZSIsIk9ialByb3RvIiwiT2JqZWN0IiwidG9TdHJpbmciLCJoYXNPd25Qcm9wZXJ0eSIsIm5hdGl2ZUZvckVhY2giLCJmb3JFYWNoIiwibmF0aXZlRmlsdGVyIiwiZmlsdGVyIiwibmF0aXZlSW5kZXhPZiIsImluZGV4T2YiLCJuYXRpdmVJc0FycmF5IiwiaXNBcnJheSIsIm5hdGl2ZUtleXMiLCJrZXlzIiwidmFsdWVzIiwib2JqIiwibGVuZ3RoIiwiaSIsIlR5cGVFcnJvciIsImtleSIsImhhcyIsInB1c2giLCJjYWxsIiwiZWFjaCIsIml0ZXJhdG9yIiwiY29udGV4dCIsImNvbXBhY3QiLCJhcnJheSIsImlkZW50aXR5Iiwic2VsZWN0IiwicmVzdWx0cyIsInZhbHVlIiwiaW5kZXgiLCJsaXN0IiwibmFtZSIsImlzRnVuY3Rpb24iLCJpc0Zpbml0ZSIsImlzTmFOIiwicGFyc2VGbG9hdCIsImlzTnVtYmVyIiwiaXNCb29sZWFuIiwiaXNOdWxsIiwiaXNFbXB0eSIsImlzU3RyaW5nIiwiaXNFbGVtZW50Iiwibm9kZVR5cGUiLCJpc09iamVjdCIsIml0ZW0iLCJpc1NvcnRlZCIsIk1hdGgiLCJtYXgiLCJzb3J0ZWRJbmRleCIsImlzV2luZG93Iiwid2luZG93IiwiaXNQbGFpbk9iamVjdCIsImNvbnN0cnVjdG9yIiwiaGFzT3duIiwiZSIsInVuZGVmaW5lZCIsImV4dGVuZCIsIm9wdGlvbnMiLCJzcmMiLCJjb3B5IiwiY29weUlzQXJyYXkiLCJjbG9uZSIsInRhcmdldCIsImFyZ3VtZW50cyIsImRlZXAiLCJzbGljZSIsIlV0aWxzIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIl9VSUQiLCJjaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJnZXRVSUQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJnZXRDb250ZXh0IiwicHJvdG8iLCJuZXdQcm90byIsIk9iamVjdENyZWF0ZSIsImNyZWF0ZSIsIl9fZW1wdHlGdW5jIiwiciIsInMiLCJweCIsInNwIiwicnAiLCJjcmVhdGVPYmplY3QiLCJzdXBlcmNsYXNzIiwiY2FudmFzIiwiRmxhc2hDYW52YXMiLCJpbml0RWxlbWVudCIsIm9wdCIsInIxIiwicjIiLCJyMyIsInI0IiwiUG9pbnQiLCJ4IiwieSIsImJhYmVsSGVscGVycy50eXBlb2YiLCJhcmciLCJwIiwiQ2FudmF4RXZlbnQiLCJldnQiLCJwYXJhbXMiLCJldmVudFR5cGUiLCJ0eXBlIiwiY3VycmVudFRhcmdldCIsInBvaW50IiwiX3N0b3BQcm9wYWdhdGlvbiIsImFkZE9yUm1vdmVFdmVudEhhbmQiLCJkb21IYW5kIiwiaWVIYW5kIiwiZXZlbnREb21GbiIsImVsIiwiZm4iLCJldmVudEZuIiwiZXZlbnQiLCJnZXRFbGVtZW50QnlJZCIsImJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRvYyIsIm93bmVyRG9jdW1lbnQiLCJib2R5IiwiZG9jRWxlbSIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudFRvcCIsImNsaWVudExlZnQiLCJib3VuZCIsInJpZ2h0IiwibGVmdCIsImNsaWVudFdpZHRoIiwiem9vbSIsInRvcCIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsVG9wIiwicGFnZVhPZmZzZXQiLCJzY3JvbGxMZWZ0IiwicGFnZVgiLCJjbGllbnRYIiwicGFnZVkiLCJjbGllbnRZIiwiX3dpZHRoIiwiX2hlaWdodCIsImlkIiwic3R5bGUiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0Iiwic2V0QXR0cmlidXRlIiwic2V0dGluZ3MiLCJSRVNPTFVUSU9OIiwidmlldyIsImNsYXNzTmFtZSIsImNzc1RleHQiLCJzdGFnZV9jIiwiZG9tX2MiLCJhcHBlbmRDaGlsZCIsIl9tb3VzZUV2ZW50VHlwZXMiLCJfaGFtbWVyRXZlbnRUeXBlcyIsIkV2ZW50SGFuZGxlciIsImNhbnZheCIsImN1clBvaW50cyIsImN1clBvaW50c1RhcmdldCIsIl90b3VjaGluZyIsIl9kcmFnaW5nIiwiX2N1cnNvciIsInR5cGVzIiwiZHJhZyIsImNvbnRhaW5zIiwiY29tcGFyZURvY3VtZW50UG9zaXRpb24iLCJwYXJlbnQiLCJjaGlsZCIsIm1lIiwiYWRkRXZlbnQiLCJfX21vdXNlSGFuZGxlciIsIm9uIiwiX19saWJIYW5kbGVyIiwicm9vdCIsInVwZGF0ZVZpZXdPZmZzZXQiLCIkIiwidmlld09mZnNldCIsImN1ck1vdXNlUG9pbnQiLCJjdXJNb3VzZVRhcmdldCIsImdldE9iamVjdHNVbmRlclBvaW50IiwiZHJhZ0VuYWJsZWQiLCJ0b0VsZW1lbnQiLCJyZWxhdGVkVGFyZ2V0IiwiX2RyYWdFbmQiLCJmaXJlIiwiX19nZXRjdXJQb2ludHNUYXJnZXQiLCJnbG9iYWxBbHBoYSIsImNsb25lT2JqZWN0IiwiX2Nsb25lMmhvdmVyU3RhZ2UiLCJfZ2xvYmFsQWxwaGEiLCJfZHJhZ01vdmVIYW5kZXIiLCJfX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyIsIl9jdXJzb3JIYW5kZXIiLCJwcmV2ZW50RGVmYXVsdCIsInJldHVyblZhbHVlIiwib2xkT2JqIiwiX2hvdmVyQ2xhc3MiLCJwb2ludENoa1ByaW9yaXR5IiwiZ2V0Q2hpbGRJblBvaW50IiwiZ2xvYmFsVG9Mb2NhbCIsImRpc3BhdGNoRXZlbnQiLCJ0b1RhcmdldCIsImZyb21UYXJnZXQiLCJfc2V0Q3Vyc29yIiwiY3Vyc29yIiwiX19nZXRDYW52YXhQb2ludEluVG91Y2hzIiwiX19nZXRDaGlsZEluVG91Y2hzIiwic3RhcnQiLCJtb3ZlIiwiZW5kIiwiY3VyVG91Y2hzIiwidG91Y2giLCJ0b3VjaHMiLCJ0b3VjaGVzVGFyZ2V0IiwiY2hpbGRzIiwiaGFzQ2hpbGQiLCJjZSIsInN0YWdlUG9pbnQiLCJfZHJhZ0R1cGxpY2F0ZSIsIl9idWZmZXJTdGFnZSIsImdldENoaWxkQnlJZCIsIl90cmFuc2Zvcm0iLCJnZXRDb25jYXRlbmF0ZWRNYXRyaXgiLCJhZGRDaGlsZEF0IiwiX2RyYWdQb2ludCIsIl9wb2ludCIsIl9ub3RXYXRjaCIsIl9tb3ZlU3RhZ2UiLCJtb3ZlaW5nIiwiaGVhcnRCZWF0IiwiZGVzdHJveSIsIkV2ZW50TWFuYWdlciIsIl9ldmVudE1hcCIsImxpc3RlbmVyIiwiYWRkUmVzdWx0Iiwic2VsZiIsInNwbGl0IiwibWFwIiwiX2V2ZW50RW5hYmxlZCIsInJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUiLCJsaSIsInNwbGljZSIsIl9kaXNwYXRjaEV2ZW50IiwiRXZlbnREaXNwYXRjaGVyIiwiY3JlYXRDbGFzcyIsIl9hZGRFdmVudExpc3RlbmVyIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXIiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSIsIl9yZW1vdmVBbGxFdmVudExpc3RlbmVycyIsImxvZyIsImVUeXBlIiwiY2hpbGRyZW4iLCJwcmVIZWFydEJlYXQiLCJfaGVhcnRCZWF0TnVtIiwicHJlZ0FscGhhIiwiaG92ZXJDbG9uZSIsImdldFN0YWdlIiwiYWN0aXZTaGFwZSIsInJlbW92ZUNoaWxkQnlJZCIsIl9oYXNFdmVudExpc3RlbmVyIiwib3ZlckZ1biIsIm91dEZ1biIsIm9uY2VIYW5kbGUiLCJhcHBseSIsInVuIiwiTWF0cml4IiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJtdHgiLCJzY2FsZVgiLCJzY2FsZVkiLCJyb3RhdGlvbiIsImNvcyIsInNpbiIsIlBJIiwiY29uY2F0IiwiYW5nbGUiLCJzdCIsImFicyIsImN0Iiwic3giLCJzeSIsImR4IiwiZHkiLCJ2IiwiYWEiLCJhYyIsImF0eCIsImFiIiwiYWQiLCJhdHkiLCJvdXQiLCJUV0VFTiIsIl90d2VlbnMiLCJ0d2VlbiIsInRpbWUiLCJwcmVzZXJ2ZSIsIm5vdyIsIl90IiwiX3VwZGF0ZVJlcyIsInVwZGF0ZSIsInByb2Nlc3MiLCJocnRpbWUiLCJwZXJmb3JtYW5jZSIsImJpbmQiLCJEYXRlIiwiZ2V0VGltZSIsIlR3ZWVuIiwib2JqZWN0IiwiX29iamVjdCIsIl92YWx1ZXNTdGFydCIsIl92YWx1ZXNFbmQiLCJfdmFsdWVzU3RhcnRSZXBlYXQiLCJfZHVyYXRpb24iLCJfcmVwZWF0IiwiX3JlcGVhdERlbGF5VGltZSIsIl95b3lvIiwiX2lzUGxheWluZyIsIl9yZXZlcnNlZCIsIl9kZWxheVRpbWUiLCJfc3RhcnRUaW1lIiwiX2Vhc2luZ0Z1bmN0aW9uIiwiRWFzaW5nIiwiTGluZWFyIiwiTm9uZSIsIl9pbnRlcnBvbGF0aW9uRnVuY3Rpb24iLCJJbnRlcnBvbGF0aW9uIiwiX2NoYWluZWRUd2VlbnMiLCJfb25TdGFydENhbGxiYWNrIiwiX29uU3RhcnRDYWxsYmFja0ZpcmVkIiwiX29uVXBkYXRlQ2FsbGJhY2siLCJfb25Db21wbGV0ZUNhbGxiYWNrIiwiX29uU3RvcENhbGxiYWNrIiwidG8iLCJwcm9wZXJ0aWVzIiwiZHVyYXRpb24iLCJhZGQiLCJwcm9wZXJ0eSIsInN0b3AiLCJyZW1vdmUiLCJzdG9wQ2hhaW5lZFR3ZWVucyIsIm51bUNoYWluZWRUd2VlbnMiLCJkZWxheSIsImFtb3VudCIsInJlcGVhdCIsInRpbWVzIiwicmVwZWF0RGVsYXkiLCJ5b3lvIiwiZWFzaW5nIiwiaW50ZXJwb2xhdGlvbiIsImNoYWluIiwib25TdGFydCIsImNhbGxiYWNrIiwib25VcGRhdGUiLCJvbkNvbXBsZXRlIiwib25TdG9wIiwiZWxhcHNlZCIsImNoYXJBdCIsInRtcCIsImsiLCJwb3ciLCJzcXJ0IiwiQm91bmNlIiwiT3V0IiwiSW4iLCJtIiwiZiIsImZsb29yIiwibiIsInB3IiwiYm4iLCJCZXJuc3RlaW4iLCJDYXRtdWxsUm9tIiwicDAiLCJwMSIsInQiLCJmYyIsIkZhY3RvcmlhbCIsInAyIiwicDMiLCJ2MCIsInYxIiwidDIiLCJ0MyIsImxhc3RUaW1lIiwidmVuZG9ycyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZWxlbWVudCIsImN1cnJUaW1lIiwidGltZVRvQ2FsbCIsInNldFRpbWVvdXQiLCJfdGFza0xpc3QiLCJfcmVxdWVzdEFpZCIsImVuYWJsZWRBbmltYXRpb25GcmFtZSIsImN1cnJUYXNrTGlzdCIsInNoaWZ0IiwidGFzayIsInJlZ2lzdEZyYW1lIiwiJGZyYW1lIiwiZGVzdHJveUZyYW1lIiwiZF9yZXN1bHQiLCJsIiwicmVnaXN0VHdlZW4iLCJ0aWQiLCJmcm9tIiwiYW5pbWF0ZSIsIl9pc0NvbXBsZXRlZWQiLCJfaXNTdG9wZWQiLCJkZXNjIiwiZGVzdHJveVR3ZWVuIiwibXNnIiwidW53YXRjaE9uZSIsIk9ic2VydmUiLCJzY29wZSIsIm1vZGVsIiwid2F0Y2hNb3JlIiwic3RvcFJlcGVhdEFzc2lnbiIsInNraXBBcnJheSIsIiRza2lwQXJyYXkiLCJWQlB1YmxpY3MiLCJsb29wIiwidmFsIiwidmFsdWVUeXBlIiwiYWNjZXNzb3IiLCJuZW8iLCJwcmVWYWx1ZSIsImNvbXBsZXhWYWx1ZSIsIm5lb1R5cGUiLCJhZGRDb2xvclN0b3AiLCIkbW9kZWwiLCIkZmlyZSIsInBtb2RlbCIsImhhc1dhdGNoTW9kZWwiLCIkd2F0Y2giLCIkcGFyZW50IiwiZGVmaW5lUHJvcGVydGllcyIsImFjY2Vzc29yZXMiLCIkYWNjZXNzb3IiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3AiLCJfX2RlZmluZUdldHRlcl9fIiwiZ2V0IiwiX19kZWZpbmVTZXR0ZXJfXyIsInNldCIsImRlc2NzIiwiVkJBcnJheSIsIlZCTWVkaWF0b3IiLCJkZXNjcmlwdGlvbiIsImV4ZWNTY3JpcHQiLCJqb2luIiwicHVibGljcyIsIm93bmVyIiwiYnVmZmVyIiwicGFyc2VWQiIsIlJFTkRFUkVSX1RZUEUiLCJTSEFQRVMiLCJDT05URVhUX0RFRkFVTFQiLCJTSEFQRV9DT05URVhUX0RFRkFVTFQiLCJEaXNwbGF5T2JqZWN0IiwiY2hlY2tPcHQiLCJzdGFnZSIsInh5VG9JbnQiLCJfY3JlYXRlQ29udGV4dCIsImNyZWF0ZUlkIiwiaW5pdCIsIl91cGRhdGVUcmFuc2Zvcm0iLCJfY29udGV4dEFUVFJTIiwiJG93bmVyIiwidHJhbnNGb3JtUHJvcHMiLCJteXNlbGYiLCJjb25mIiwibmV3T2JqIiwidGV4dCIsImNvbnRhaW5lciIsImNtIiwiaW52ZXJ0IiwibG9jYWxUb0dsb2JhbCIsIm8iLCJib29sIiwibnVtIiwiZnJvbUluZGV4IiwiZ2V0SW5kZXgiLCJ0b0luZGV4IiwicGNsIiwib3JpZ2luIiwic2NhbGVPcmlnaW4iLCJ0cmFuc2xhdGUiLCJzY2FsZSIsInJvdGF0ZU9yaWdpbiIsInJvdGF0ZSIsInBhcnNlSW50IiwibGluZVdpZHRoIiwic3Ryb2tlU3R5bGUiLCJyZXN1bHQiLCJpbnZlcnNlTWF0cml4Iiwib3JpZ2luUG9zIiwibXVsVmVjdG9yIiwiZ3JhcGhpY3MiLCJjb250YWluc1BvaW50IiwidG9Db250ZW50IiwidXBGdW4iLCJjb21wRnVuIiwiQW5pbWF0aW9uRnJhbWUiLCJjdHgiLCJ2aXNpYmxlIiwic2F2ZSIsInRyYW5zRm9ybSIsInRyYW5zZm9ybSIsInRvQXJyYXkiLCJyZW5kZXIiLCJyZXN0b3JlIiwicmVtb3ZlQ2hpbGQiLCJEaXNwbGF5T2JqZWN0Q29udGFpbmVyIiwibW91c2VDaGlsZHJlbiIsImdldENoaWxkSW5kZXgiLCJfYWZ0ZXJBZGRDaGlsZCIsInJlbW92ZUNoaWxkQXQiLCJfYWZ0ZXJEZWxDaGlsZCIsImxlbiIsImdldENoaWxkQXQiLCJib29sZW4iLCJvbGRJbmRleCIsImdldE51bUNoaWxkcmVuIiwib2JqcyIsIlN0YWdlIiwic3RhZ2VSZW5kaW5nIiwiX2lzUmVhZHkiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsIlN5c3RlbVJlbmRlcmVyIiwiVU5LTk9XTiIsImFwcCIsInJlcXVlc3RBaWQiLCJfaGVhcnRCZWF0IiwiX3ByZVJlbmRlclRpbWUiLCJlbnRlckZyYW1lIiwiY29udmVydFR5cGUiLCJzaGFwZSIsIl9jb252ZXJ0Q2FudmF4IiwiY29udmVydFN0YWdlcyIsImNvbnZlcnRTaGFwZXMiLCJzdGFydEVudGVyIiwiQ2FudmFzR3JhcGhpY3NSZW5kZXJlciIsInJlbmRlcmVyIiwiZGlzcGxheU9iamVjdCIsImdyYXBoaWNzRGF0YSIsImRhdGEiLCJmaWxsU3R5bGUiLCJQT0xZIiwiYmVnaW5QYXRoIiwicmVuZGVyUG9seWdvbiIsInBvaW50cyIsImNsb3NlZCIsImhhc0ZpbGwiLCJmaWxsQWxwaGEiLCJmaWxsIiwiaGFzTGluZSIsImxpbmVBbHBoYSIsInN0cm9rZSIsIlJFQ1QiLCJmaWxsUmVjdCIsInN0cm9rZVJlY3QiLCJDSVJDIiwiYXJjIiwicmFkaXVzIiwiY2xvc2VQYXRoIiwiRUxJUCIsInciLCJoIiwia2FwcGEiLCJveCIsIm95IiwieGUiLCJ5ZSIsInhtIiwieW0iLCJtb3ZlVG8iLCJiZXppZXJDdXJ2ZVRvIiwiY2xvc2UiLCJqIiwibGluZVRvIiwiQ2FudmFzUmVuZGVyZXIiLCJDQU5WQVMiLCJDR1IiLCJjb252ZXJ0U3RhZ2UiLCJyZW5kZXJTdGFnZSIsIl9jbGVhciIsIl9yZW5kZXIiLCJjbGVhclJlY3QiLCJTZXR0aW5ncyIsIkFwcGxpY2F0aW9uIiwiX2NpZCIsInJhbmRvbSIsInF1ZXJ5Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJ2aWV3T2JqIiwiY3JlYXRlVmlldyIsImlubmVySFRNTCIsIm9mZnNldCIsImxhc3RHZXRSTyIsIlJlbmRlcmVyIiwiX2NyZWF0SG92ZXJTdGFnZSIsIl9jcmVhdGVQaXhlbENvbnRleHQiLCJyZVNpemVDYW52YXMiLCJyZXNpemUiLCJhZGRDaGlsZCIsIl9waXhlbENhbnZhcyIsImNyZWF0ZUNhbnZhcyIsImNhbnZhc1N1cHBvcnQiLCJkaXNwbGF5IiwiekluZGV4IiwidmlzaWJpbGl0eSIsIl9waXhlbEN0eCIsImluc2VydEJlZm9yZSIsImluaXRTdGFnZSIsIlNwcml0ZSIsIkdyYXBoaWNzRGF0YSIsImxpbmUiLCJ0cmFuc3Bvc2UiLCJGbG9hdDMyQXJyYXkiLCJwb3MiLCJuZXdQb3MiLCJhMSIsImMxIiwidHgxIiwibWF0cml4IiwiYjEiLCJkMSIsInBpdm90WCIsInBpdm90WSIsInNrZXdYIiwic2tld1kiLCJzciIsImNyIiwiY3kiLCJuc3giLCJjeCIsImF0YW4yIiwiZGVsdGEiLCJza2V3IiwidXgiLCJ1eSIsInZ4IiwidnkiLCJ0ZW1wTWF0cmljZXMiLCJtdWwiLCJzaWdudW0iLCJyb3ciLCJfdXgiLCJfdXkiLCJfdngiLCJfdnkiLCJtYXQiLCJhcmNUb1NlZ21lbnRzQ2FjaGUiLCJzZWdtZW50VG9CZXppZXJDYWNoZSIsImJvdW5kc09mQ3VydmVDYWNoZSIsIl9qb2luIiwiYXJjVG9TZWdtZW50cyIsInRvWCIsInRvWSIsInJ4IiwicnkiLCJsYXJnZSIsInN3ZWVwIiwicm90YXRlWCIsImFyZ3NTdHJpbmciLCJ0aCIsInNpblRoIiwiY29zVGgiLCJmcm9tWCIsImZyb21ZIiwicHkiLCJyeDIiLCJyeTIiLCJweTIiLCJweDIiLCJwbCIsImN4MSIsImN5MSIsIm1UaGV0YSIsImNhbGNWZWN0b3JBbmdsZSIsImR0aGV0YSIsInNlZ21lbnRzIiwiY2VpbCIsIm1EZWx0YSIsIm1UIiwidGgzIiwic2VnbWVudFRvQmV6aWVyIiwidGgyIiwiYXJnc1N0cmluZzIiLCJjb3N0aDIiLCJzaW50aDIiLCJjb3N0aDMiLCJzaW50aDMiLCJjcDFYIiwiY3AxWSIsImNwMlgiLCJjcDJZIiwidGEiLCJ0YiIsImRyYXdBcmMiLCJmeCIsImZ5IiwiY29vcmRzIiwicm90Iiwic2VncyIsInNlZ3NOb3JtIiwiZ2V0Qm91bmRzT2ZBcmMiLCJib3VuZHMiLCJnZXRCb3VuZHNPZkN1cnZlIiwieDAiLCJ5MCIsIngxIiwieTEiLCJ4MiIsInkyIiwieDMiLCJ5MyIsIm1pbiIsInR2YWx1ZXMiLCJ0MSIsImIyYWMiLCJzcXJ0YjJhYyIsImpsZW4iLCJtdCIsIlJlY3RhbmdsZSIsInJlY3RhbmdsZSIsInBhZGRpbmdYIiwicGFkZGluZ1kiLCJDaXJjbGUiLCJFbGxpcHNlIiwibm9ybXgiLCJub3JteSIsIlBvbHlnb24iLCJpbCIsIl9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlciIsInduIiwic2hpZnRQIiwiY3BYIiwiY3BZIiwiY3BYMiIsImNwWTIiLCJwYXRoIiwiZHQiLCJkdDIiLCJkdDMiLCJfaXNJbnNpZGVMaW5lIiwiX2wiLCJfYSIsIl9iIiwiX3MiLCJpbnNpZGVMaW5lIiwiaW5zaWRlQ2F0Y2giLCJHcmFwaGljcyIsImN1cnJlbnRQYXRoIiwic3luc1N0eWxlIiwiZGlydHkiLCJzY3R4IiwiZHJhd1NoYXBlIiwieGEiLCJ5YSIsImEyIiwiYjIiLCJtbSIsImRkIiwiY2MiLCJ0dCIsImsxIiwiazIiLCJqMSIsImoyIiwicXgiLCJxeSIsInN0YXJ0QW5nbGUiLCJlbmRBbmdsZSIsImFudGljbG9ja3dpc2UiLCJzdGFydFgiLCJzdGFydFkiLCJ0aGV0YSIsInRoZXRhMiIsImNUaGV0YSIsInNUaGV0YSIsInNlZ01pbnVzIiwicmVtYWluZGVyIiwicmVhbCIsInBvcCIsImluc2lkZSIsIkluc2lkZUxpbmUiLCJtaW5YIiwiSW5maW5pdHkiLCJtYXhYIiwibWluWSIsIm1heFkiLCJSUkVDIiwicnciLCJyaCIsIkJvdW5kIiwiU2hhcGUiLCJfY29udGV4dCIsIl9ob3ZlcmFibGUiLCJfY2xpY2thYmxlIiwiZHJhdyIsImluaXRDb21wUHJvcGVydHkiLCJfcmVjdCIsImRhc2hMZW5ndGgiLCJkZWx0YVgiLCJkZWx0YVkiLCJudW1EYXNoZXMiLCJOdW1iZXIiLCJNQVhfVkFMVUUiLCJNSU5fVkFMVUUiLCJjcGwiLCJwb2ludExpc3QiLCJyb3VuZCIsIlRleHQiLCJfcmVOZXdsaW5lIiwiZm9udFByb3BlcnRzIiwiZm9udCIsIl9nZXRGb250RGVjbGFyYXRpb24iLCJnZXRUZXh0V2lkdGgiLCJnZXRUZXh0SGVpZ2h0IiwiX3JlbmRlclRleHQiLCJfZ2V0VGV4dExpbmVzIiwiX2dldFRleHRXaWR0aCIsIl9nZXRUZXh0SGVpZ2h0IiwidGV4dExpbmVzIiwiX3JlbmRlclRleHRTdHJva2UiLCJfcmVuZGVyVGV4dEZpbGwiLCJmb250QXJyIiwiZm9udFAiLCJfYm91bmRhcmllcyIsImxpbmVIZWlnaHRzIiwiaGVpZ2h0T2ZMaW5lIiwiX2dldEhlaWdodE9mTGluZSIsIl9yZW5kZXJUZXh0TGluZSIsIl9nZXRUb3BPZmZzZXQiLCJzdHJva2VEYXNoQXJyYXkiLCJzZXRMaW5lRGFzaCIsIm1ldGhvZCIsImxpbmVJbmRleCIsInRleHRBbGlnbiIsIl9yZW5kZXJDaGFycyIsIm1lYXN1cmVUZXh0IiwidG90YWxXaWR0aCIsIndvcmRzIiwid29yZHNXaWR0aCIsInJlcGxhY2UiLCJ3aWR0aERpZmYiLCJudW1TcGFjZXMiLCJzcGFjZVdpZHRoIiwibGVmdE9mZnNldCIsImNoYXJzIiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwibWF4V2lkdGgiLCJjdXJyZW50TGluZVdpZHRoIiwidGV4dEJhc2VsaW5lIiwiVmVjdG9yIiwiX2F4ZXMiLCJpbnRlcnBvbGF0ZSIsImlzTG9vcCIsInNtb290aEZpbHRlciIsInJldCIsImRpc3RhbmNlIiwicHJlVmVydG9yIiwiaVZ0b3IiLCJpZHgiLCJ3MiIsInczIiwiX2NhY2hlIiwiX3JhZGlhbnMiLCJpc0RlZ3JlZXMiLCJ0b0ZpeGVkIiwiZGVncmVlVG9SYWRpYW4iLCJyYWRpYW5Ub0RlZ3JlZSIsImRlZ3JlZVRvMzYwIiwicmVBbmciLCJnZXRJc2dvblBvaW50TGlzdCIsImRTdGVwIiwiYmVnaW5EZWciLCJkZWciLCJnZXRTbW9vdGhQb2ludExpc3QiLCJwTGlzdCIsImN1cnJMIiwiU21vb3RoU3BsaW5lIiwiQnJva2VuTGluZSIsImF0eXBlIiwic21vb3RoIiwiX01hdGgiLCJzZXRHcmFwaGljcyIsImNsZWFyIiwibGluZVR5cGUiLCJzaSIsInNsIiwiZGFzaGVkTGluZVRvIiwiZHJhd0NpcmNsZSIsIlBhdGgiLCJkcmF3VHlwZU9ubHkiLCJfX3BhcnNlUGF0aERhdGEiLCJwYXRocyIsInBhdGhTdHIiLCJfcGFyc2VDaGlsZFBhdGhEYXRhIiwiY3MiLCJSZWdFeHAiLCJhcnIiLCJjYSIsImNweCIsImNweSIsInN0ciIsImNtZCIsImN0bFB0eCIsImN0bFB0eSIsInByZXZDbWQiLCJwc2kiLCJmYSIsImZzIiwiY29tbWFuZCIsInBhdGhBcnJheSIsIl9wYXJzZVBhdGhEYXRhIiwiZyIsImdsIiwicXVhZHJhdGljQ3VydmVUbyIsIkRyb3BsZXQiLCJteSIsIl9jcmVhdGVQYXRoIiwicHMiLCJociIsInZyIiwiZHJhd0VsbGlwc2UiLCJ1bnNoaWZ0IiwiX2RyYXdUeXBlT25seSIsIklzb2dvbiIsIkxpbmUiLCJSZWN0IiwiZ2V0Q3NzT3JkZXJBcnIiLCJHIiwiZHJhd1JlY3QiLCJfYnVpbGRSYWRpdXNQYXRoIiwiU2VjdG9yIiwicmVnQW5nbGUiLCJpc1JpbmciLCJyMCIsIm15TWF0aCIsImNsb2Nrd2lzZSIsInJlZ0luIiwiZ2V0UmVnQW5nbGUiLCJwNERpcmVjdGlvbiIsImluQW5nbGVSZWciLCJnZXRSZWN0Rm9ybVBvaW50TGlzdCIsIkNhbnZheCIsIkRpc3BsYXkiLCJTaGFwZXMiLCJFdmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxN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
