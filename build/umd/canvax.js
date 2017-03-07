(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Canvax = factory());
}(this, (function () { 'use strict';

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
  for (var key in obj) if (_$1.has(obj, key)) keys.push(key);
  return keys;
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
  for (var key in obj) if (_$1.has(obj, key)) return false;
  return true;
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
  for (; i < length; i++) if (array[i] === item) return i;
  return -1;
};

_$1.isWindow = function (obj) {
  return obj != null && obj == obj.window;
};
_$1.isPlainObject = function (obj) {
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if (!obj || typeof obj !== "object" || obj.nodeType || _$1.isWindow(obj)) {
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
  if (typeof target !== "object" && !_$1.isFunction(target)) {
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
    __emptyFunc: function () {},
    //retina 屏幕优化
    _devicePixelRatio: window.devicePixelRatio || 1,
    _UID: 0, //该值为向上的自增长整数值
    getUID: function () {
        return this._UID++;
    },
    createId: function (name) {
        //if end with a digit, then append an undersBase before appending
        var charCode = name.charCodeAt(name.length - 1);
        if (charCode >= 48 && charCode <= 57) name += "_";
        return name + Utils.getUID();
    },
    canvasSupport: function () {
        return !!document.createElement('canvas').getContext;
    },
    createObject: function (proto, constructor) {
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
    creatClass: function (r, s, px) {
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
    initElement: function (canvas) {
        if (window.FlashCanvas && FlashCanvas.initElement) {
            FlashCanvas.initElement(canvas);
        }
    },
    //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
    checkOpt: function (opt) {
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
     * 简单的浅复制对象。
     * @param strict  当为true时只覆盖已有属性
     */
    copy2context: function (target, source, strict) {
        if (_$1.isEmpty(source)) {
            return target;
        }
        for (var key in source) {
            if (!strict || target.hasOwnProperty(key) || target[key] !== undefined) {
                target[key] = source[key];
            }
        }
        return target;
    },

    /**
     * 按照css的顺序，返回一个[上,右,下,左]
     */
    getCssOrderArr: function (r) {
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
class Point {
    constructor(x = 0, y = 0) {
        if (arguments.length == 1 && typeof arguments[0] == 'object') {
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

    toArray() {
        return [this.x, this.y];
    }
}

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
var CanvaxEvent = function (evt, params) {

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
    stopPropagation: function () {
        this._stopPropagation = true;
    }
};

var settings = {
    //设备分辨率
    RESOLUTION: window.devicePixelRatio || 1,

    //渲染FPS
    FPS: 60
};

var addOrRmoveEventHand = function (domHand, ieHand) {
    if (document[domHand]) {
        function eventDomFn(el, type, fn) {
            if (el.length) {
                for (var i = 0; i < el.length; i++) {
                    eventDomFn(el[i], type, fn);
                }
            } else {
                el[domHand](type, fn, false);
            }
        }
        return eventDomFn;
    } else {
        function eventFn(el, type, fn) {
            if (el.length) {
                for (var i = 0; i < el.length; i++) {
                    eventFn(el[i], type, fn);
                }
            } else {
                el[ieHand]("on" + type, function () {
                    return fn.call(el, window.event);
                });
            }
        }
        return eventFn;
    }
};

var $ = {
    // dom操作相关代码
    query: function (el) {
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
    offset: function (el) {
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
    pageX: function (e) {
        if (e.pageX) return e.pageX;else if (e.clientX) return e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);else return null;
    },
    pageY: function (e) {
        if (e.pageY) return e.pageY;else if (e.clientY) return e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);else return null;
    },
    /**
     * 创建dom
     * @param {string} id dom id 待用
     * @param {string} type : dom type， such as canvas, div etc.
     */
    createCanvas: function (_width, _height, id) {
        var canvas = document.createElement("canvas");
        canvas.style.position = 'absolute';
        canvas.style.width = _width + 'px';
        canvas.style.height = _height + 'px';
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.setAttribute('width', _width * settings.RESOLUTION);
        canvas.setAttribute('height', _height * settings.RESOLUTION);
        canvas.setAttribute('id', id);
        return canvas;
    },
    createView: function (_width, _height, id) {
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

var EventHandler = function (canvax, opt) {
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
    init: function () {

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
    __mouseHandler: function (e) {
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
    __getcurPointsTarget: function (e, point) {
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
    _cursorHander: function (obj, oldObj) {
        if (!obj && !oldObj) {
            this._setCursor("default");
        }
        if (obj && oldObj != obj && obj.context) {
            this._setCursor(obj.context.cursor);
        }
    },
    _setCursor: function (cursor) {
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
    __libHandler: function (e) {
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
    __getCanvaxPointInTouchs: function (e) {
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
    __getChildInTouchs: function (touchs) {
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
    __dispatchEventInChilds: function (e, childs) {
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
    _clone2hoverStage: function (target, i) {
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
    _dragMoveHander: function (e, target, i) {
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
    _dragEnd: function (e, target, i) {
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
var EventManager = function () {
    //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
    this._eventMap = {};
};

EventManager.prototype = {
    /*
     * 注册事件侦听器对象，以使侦听器能够接收事件通知。
     */
    _addEventListener: function (type, listener) {

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
    _removeEventListener: function (type, listener) {
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
    _removeEventListenerByType: function (type) {
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
    _removeAllEventListeners: function () {
        this._eventMap = {};
        this._eventEnabled = false;
    },
    /**
    * 派发事件，调用事件侦听器。
    */
    _dispatchEvent: function (e) {
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
    _hasEventListener: function (type) {
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
var EventDispatcher = function () {
    EventDispatcher.superclass.constructor.call(this, name);
};

Utils.creatClass(EventDispatcher, EventManager, {
    on: function (type, listener) {
        this._addEventListener(type, listener);
        return this;
    },
    addEventListener: function (type, listener) {
        this._addEventListener(type, listener);
        return this;
    },
    un: function (type, listener) {
        this._removeEventListener(type, listener);
        return this;
    },
    removeEventListener: function (type, listener) {
        this._removeEventListener(type, listener);
        return this;
    },
    removeEventListenerByType: function (type) {
        this._removeEventListenerByType(type);
        return this;
    },
    removeAllEventListeners: function () {
        this._removeAllEventListeners();
        return this;
    },

    //params 要传给evt的eventhandler处理函数的参数，会被merge到Canvax event中
    fire: function (eventType, params) {
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
    dispatchEvent: function (event) {
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
    hasEvent: function (type) {
        return this._hasEventListener(type);
    },
    hasEventListener: function (type) {
        return this._hasEventListener(type);
    },
    hover: function (overFun, outFun) {
        this.on("mouseover", overFun);
        this.on("mouseout", outFun);
        return this;
    },
    once: function (type, listener) {
        var me = this;
        var onceHandle = function () {
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

var Matrix = function (a, b, c, d, tx, ty) {
    this.a = a != undefined ? a : 1;
    this.b = b != undefined ? b : 0;
    this.c = c != undefined ? c : 0;
    this.d = d != undefined ? d : 1;
    this.tx = tx != undefined ? tx : 0;
    this.ty = ty != undefined ? ty : 0;
};

Matrix.prototype = {
    concat: function (mtx) {
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
    concatTransform: function (x, y, scaleX, scaleY, rotation) {
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
    rotate: function (angle) {
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
    scale: function (sx, sy) {
        this.a *= sx;
        this.d *= sy;
        this.tx *= sx;
        this.ty *= sy;
        return this;
    },
    translate: function (dx, dy) {
        this.tx += dx;
        this.ty += dy;
        return this;
    },
    identity: function () {
        //初始化
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    },
    invert: function () {
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
    clone: function () {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    toArray: function () {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    },
    /**
     * 矩阵左乘向量
     */
    mulVector: function (v) {
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

var myMath = {
    PI: Math.PI,
    sin: sin,
    cos: cos,
    degreeToRadian: degreeToRadian,
    radianToDegree: radianToDegree,
    degreeTo360: degreeTo360
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
    var _l = Math.max(context.lineWidth, 3);
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
        }, x, y)) {
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
    if (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
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
    r += context.lineWidth;
    return x * x + y * y < r * r;
}

/**
 * 扇形包含判断
 */
function _isInsideSector(shape, x, y) {
    var context = shape.context;
    if (!_isInsideCircle(shape, x, y) || context.r0 > 0 && _isInsideCircle(shape, x, y, context.r0)) {
        // 大圆外或者小圆内直接false
        return false;
    } else {
        // 判断夹角
        var startAngle = myMath.degreeTo360(context.startAngle); // 起始角度[0,360)
        var endAngle = myMath.degreeTo360(context.endAngle); // 结束角度(0,360]

        //计算该点所在的角度
        var angle = myMath.degreeTo360(Math.atan2(y, x) / Math.PI * 180 % 360);

        var regIn = true; //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
        if (startAngle > endAngle && !context.clockwise || startAngle < endAngle && context.clockwise) {
            regIn = false; //out
        }
        //度的范围，从小到大
        var regAngle = [Math.min(startAngle, endAngle), Math.max(startAngle, endAngle)];

        var inAngleReg = angle > regAngle[0] && angle < regAngle[1];
        return inAngleReg && regIn || !inAngleReg && !regIn;
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

    return iRes < 0;
}

/**
 * 多边形包含判断 Nonzero Winding Number Rule
 */

function _isInsidePolygon_WindingNumber(shape, x, y) {
    var context = shape.context ? shape.context : shape;
    var poly = _$1.clone(context.pointList); //poly 多边形顶点，数组成员的格式同 p
    poly.push(poly[0]); //记得要闭合
    var wn = 0;
    for (var shiftP, shift = poly[0][1] > y, i = 1; i < poly.length; i++) {
        //先做线的检测，如果是在两点的线上，就肯定是在认为在图形上
        var inLine = _isInsideLine({
            xStart: poly[i - 1][0],
            yStart: poly[i - 1][1],
            xEnd: poly[i][0],
            yEnd: poly[i][1],
            lineWidth: context.lineWidth || 1
        }, x, y);
        if (inLine) {
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

			var i = _$1.indexOf(_tweens, tween); //_tweens.indexOf(tween);

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

			return -0.5 * (--k * (k - 2) - 1);
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

			return 1 - --k * k * k * k;
		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return -0.5 * ((k -= 2) * k * k * k - 2);
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

			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
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

			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);
		},

		Out: function (k) {

			return Math.sqrt(1 - --k * k);
		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - k * k) - 1);
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

		CatmullRom: function (p0, p1, p2, p3, t) {

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
        onStart: function () {},
        onUpdate: function () {},
        onComplete: function () {},
        onStop: function () {},
        repeat: 0,
        delay: 0,
        easing: 'Linear.None',
        desc: '' //动画描述，方便查找bug
    }, options);

    var tween = {};
    var tid = "tween_" + Utils.getUID();
    opt.id && (tid = tid + "_" + opt.id);

    if (opt.from && opt.to) {
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

        function animate() {

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
        }
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
        var valueType = typeof val;
        if (valueType === "function") {
            if (!unwatchOne[name]) {
                VBPublics.push(name); //函数无需要转换
            }
        } else {
            if (_$1.indexOf(skipArray, name) !== -1 || name.charAt(0) === "$" && !watchMore[name]) {
                return VBPublics.push(name);
            }
            var accessor = function (neo) {
                //创建监控属性或数组，自变量，由用户触发其改变
                var value = accessor.value,
                    preValue = value,
                    complexValue;

                if (arguments.length) {
                    //写操作
                    //set 的 值的 类型
                    var neoType = typeof neo;

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
        defineProperty = function (obj, prop, desc) {
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
        defineProperties = function (obj, descs) {
            for (var prop in descs) {
                if (descs.hasOwnProperty(prop)) {
                    defineProperty(obj, prop, descs[prop]);
                }
            }
            return obj;
        };
    }
}
//IE6-8使用VBScript类的set get语句实现
if (!defineProperties && window.VBArray) {
    window.execScript(["Function parseVB(code)", "\tExecuteGlobal(code)", "End Function"].join("\n"), "VBScript");

    function VBMediator(description, name, value) {
        var fn = description[name] && description[name].set;
        if (arguments.length === 3) {
            fn(value);
        } else {
            return fn();
        }
    }
    defineProperties = function (publics, description, array) {
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
}

const RENDERER_TYPE = {
    UNKNOWN: 0,
    WEBGL: 1,
    CANVAS: 2
};



const SHAPES = {
    POLY: 0,
    RECT: 1,
    CIRC: 2,
    ELIP: 3,
    RREC: 4
};

const CONTEXT_DEFAULT = {
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
    cursor: "default",
    //canvas context 2d 的 系统样式。目前就知道这么多
    fillStyle: null, //"#000000",
    lineCap: null,
    lineJoin: null,
    lineWidth: null,
    miterLimit: null,
    shadowBlur: null,
    shadowColor: null,
    shadowOffsetX: null,
    shadowOffsetY: null,
    strokeStyle: null,
    globalAlpha: 1,
    font: null,
    textAlign: "left",
    textBaseline: "top",
    arcScaleX_: null,
    arcScaleY_: null,
    lineScale_: null,
    globalCompositeOperation: null
};

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 的 现实对象基类
 */
var DisplayObject = function (opt) {
    DisplayObject.superclass.constructor.apply(this, arguments);
    var self = this;

    //如果用户没有传入context设置，就默认为空的对象
    opt = Utils.checkOpt(opt);

    //设置默认属性
    self.id = opt.id || null;

    //相对父级元素的矩阵
    self._transform = null;

    //心跳次数
    self._heartBeatNum = 0;

    //元素对应的stage元素
    self.stage = null;

    //元素的父元素
    self.parent = null;

    self._eventEnabled = false; //是否响应事件交互,在添加了事件侦听后会自动设置为true

    self.dragEnabled = true; //"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽

    self.xyToInt = "xyToInt" in opt ? opt.xyToInt : true; //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

    self.moveing = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

    //创建好context
    self._createContext(opt);

    var UID = Utils.createId(self.type);

    //如果没有id 则 沿用uid
    if (self.id == null) {
        self.id = UID;
    }

    self.init.apply(self, arguments);

    //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform
    this._updateTransform();
};

Utils.creatClass(DisplayObject, EventDispatcher, {
    init: function () {},
    _createContext: function (opt) {
        var self = this;
        //所有显示对象，都有一个类似canvas.context类似的 context属性
        //用来存取改显示对象所有和显示有关的属性，坐标，样式等。
        //该对象为Coer.Observe()工厂函数生成
        self.context = null;

        //提供给Coer.Observe() 来 给 self.context 设置 propertys
        //这里不能用_.extend， 因为要保证_contextATTRS的纯粹，只覆盖下面已有的属性
        var _contextATTRS = Utils.copy2context(_$1.clone(CONTEXT_DEFAULT), opt.context, true);

        //然后看继承者是否有提供_context 对象 需要 我 merge到_context2D_context中去的
        if (self._context) {
            _contextATTRS = _$1.extend(true, _contextATTRS, self._context);
        }

        //有些引擎内部设置context属性的时候是不用上报心跳的，比如做hitTestPoint热点检测的时候
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
    clone: function (myself) {
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

        if (this.children) {
            newObj.children = this.children;
        }

        if (!myself) {
            newObj.id = Utils.createId(newObj.type);
        }
        return newObj;
    },
    heartBeat: function (opt) {
        //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
        //的属性，所以，通知到stage.displayAttrHasChange
        var stage = this.getStage();
        if (stage) {
            this._heartBeatNum++;
            stage.heartBeat && stage.heartBeat(opt);
        }
    },
    getCurrentWidth: function () {
        return Math.abs(this.context.width * this.context.scaleX);
    },
    getCurrentHeight: function () {
        return Math.abs(this.context.height * this.context.scaleY);
    },
    getStage: function () {
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
    localToGlobal: function (point, container) {
        !point && (point = new Point(0, 0));
        var cm = this.getConcatenatedMatrix(container);

        if (cm == null) return Point(0, 0);
        var m = new Matrix(1, 0, 0, 1, point.x, point.y);
        m.concat(cm);
        return new Point(m.tx, m.ty); //{x:m.tx, y:m.ty};
    },
    globalToLocal: function (point, container) {
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
    localToTarget: function (point, target) {
        var p = localToGlobal(point);
        return target.globalToLocal(p);
    },
    getConcatenatedMatrix: function (container) {
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
    setEventEnable: function (bool) {
        if (_$1.isBoolean(bool)) {
            this._eventEnabled = bool;
            return true;
        }
        return false;
    },
    /*
     *查询自己在parent的队列中的位置
     */
    getIndex: function () {
        if (!this.parent) {
            return;
        }
        return _$1.indexOf(this.parent.children, this);
    },
    /*
     *元素在z轴方向向下移动
     *@num 移动的层级
     */
    toBack: function (num) {
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
    toFront: function (num) {
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
    _updateTransform: function () {
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
    getChildInPoint: function (point) {
        var result; //检测的结果

        //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
        if (this.type != "stage" && this.parent && this.parent.type != "stage") {
            point = this.parent.globalToLocal(point);
        }

        var x = point.x;
        var y = point.y;

        //这个时候如果有对context的set，告诉引擎不需要watch，因为这个是引擎触发的，不是用户
        //用户set context 才需要触发watch
        this._notWatch = true;

        //对鼠标的坐标也做相同的变换
        if (this._transform) {
            var inverseMatrix = this._transform.clone().invert();
            var originPos = [x, y];
            originPos = inverseMatrix.mulVector(originPos);

            x = originPos[0];
            y = originPos[1];
        }

        var _rect = this._rect = this.getRect(this.context);

        if (!_rect) {
            return false;
        }
        if (!this.context.width && !!_rect.width) {
            this.context.width = _rect.width;
        }
        if (!this.context.height && !!_rect.height) {
            this.context.height = _rect.height;
        }
        if (!_rect.width || !_rect.height) {
            return false;
        }
        //正式开始第一步的矩形范围判断
        if (x >= _rect.x && x <= _rect.x + _rect.width && y >= _rect.y && y <= _rect.y + _rect.height) {
            //那么就在这个元素的矩形范围内
            result = HitTestPoint.isInside(this, {
                x: x,
                y: y
            });
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
    animate: function (toContent, options) {
        var to = toContent;
        var from = {};
        for (var p in to) {
            from[p] = this.context[p];
        }
        !options && (options = {});
        options.from = from;
        options.to = to;

        var self = this;
        var upFun = function () {};
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
        var compFun = function () {};
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
    _render: function (ctx) {
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
    render: function (ctx) {
        //基类不提供render的具体实现，由后续具体的派生类各自实现
    },
    //从树中删除
    remove: function () {
        if (this.parent) {
            this.parent.removeChild(this);
            this.parent = null;
        }
    },
    //元素的自我销毁
    destroy: function () {
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
var DisplayObjectContainer = function (opt) {
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
    addChild: function (child) {
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
    addChildAt: function (child, index) {
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
    removeChild: function (child) {
        return this.removeChildAt(_$1.indexOf(this.children, child));
    },
    removeChildAt: function (index) {
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
    removeChildById: function (id) {
        for (var i = 0, len = this.children.length; i < len; i++) {
            if (this.children[i].id == id) {
                return this.removeChildAt(i);
            }
        }
        return false;
    },
    removeAllChildren: function () {
        while (this.children.length > 0) {
            this.removeChildAt(0);
        }
    },
    //集合类的自我销毁
    destroy: function () {
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
    getChildById: function (id, boolen) {
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
    getChildAt: function (index) {
        if (index < 0 || index > this.children.length - 1) return null;
        return this.children[index];
    },
    getChildIndex: function (child) {
        return _$1.indexOf(this.children, child);
    },
    setChildIndex: function (child, index) {
        if (child.parent != this) return;
        var oldIndex = _$1.indexOf(this.children, child);
        if (index == oldIndex) return;
        this.children.splice(oldIndex, 1);
        this.children.splice(index, 0, child);
    },
    getNumChildren: function () {
        return this.children.length;
    },
    //获取x,y点上的所有object  num 需要返回的obj数量
    getObjectsUnderPoint: function (point, num) {
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
    },

    //渲染相关，等下也会移到renderer中去
    render: function (ctx) {
        for (var i = 0, len = this.children.length; i < len; i++) {
            this.children[i]._render(ctx);
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
var Stage = function () {
    var self = this;
    self.type = "stage";
    self.context2D = null;
    //stage正在渲染中
    self.stageRending = false;
    self._isReady = false;
    Stage.superclass.constructor.apply(this, arguments);
};
Utils.creatClass(Stage, DisplayObjectContainer, {
    init: function () {},
    //由canvax的afterAddChild 回调
    initStage: function (context2D, width, height) {
        var self = this;
        self.context2D = context2D;
        self.context.width = width;
        self.context.height = height;
        self.context.scaleX = Utils._devicePixelRatio;
        self.context.scaleY = Utils._devicePixelRatio;
        self._isReady = true;
    },
    render: function (context) {
        this.stageRending = true;
        //TODO：
        //clear 看似 很合理，但是其实在无状态的cavnas绘图中，其实没必要执行一步多余的clear操作
        //反而增加无谓的开销，如果后续要做脏矩阵判断的话。在说
        this.clear();
        Stage.superclass.render.call(this, context);
        this.stageRending = false;
    },
    heartBeat: function (opt) {
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
    },
    clear: function (x, y, width, height) {
        if (arguments.length >= 4) {
            this.context2D.clearRect(x, y, width, height);
        } else {
            this.context2D.clearRect(0, 0, this.parent.width, this.parent.height);
        }
    }
});

class SystemRenderer {
    constructor(type = RENDERER_TYPE.UNKNOWN, app) {
        this.type = type; //2canvas,1webgl
        this.app = app;

        this.requestAid = null;

        //每帧由心跳上报的 需要重绘的stages 列表
        this.convertStages = {};

        this._heartBeat = false; //心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

        this._preRenderTime = 0;
    }

    //如果引擎处于静默状态的话，就会启动
    startEnter() {
        var self = this;
        if (!self.requestAid) {
            self.requestAid = AnimationFrame.registFrame({
                id: "enterFrame", //同时肯定只有一个enterFrame的task
                task: function () {
                    self.enterFrame.apply(self);
                }
            });
        }
    }

    enterFrame() {
        var self = this;
        //不管怎么样，enterFrame执行了就要把
        //requestAid null 掉
        self.requestAid = null;
        Utils.now = new Date().getTime();
        if (self._heartBeat) {
            _.each(_.values(self.convertStages), function (convertStage) {
                convertStage.stage._render(convertStage.stage.context2D);
            });
            self._heartBeat = false;
            self.convertStages = {};
            //渲染完了，打上最新时间挫
            self._preRenderTime = new Date().getTime();
        }
    }

    _convertCanvax(opt) {
        var me = this;
        _.each(me.app.children, function (stage) {
            stage.context[opt.name] = opt.value;
        });
    }

    heartBeat(opt) {
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
                    if (!self.convertStages[stage.id]) {
                        self.convertStages[stage.id] = {
                            stage: stage,
                            convertShapes: {}
                        };
                    }
                    if (shape) {
                        if (!self.convertStages[stage.id].convertShapes[shape.id]) {
                            self.convertStages[stage.id].convertShapes[shape.id] = {
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
                    if (!self.convertStages[stage.id]) {
                        self.convertStages[stage.id] = {
                            stage: stage,
                            convertShapes: {}
                        };
                    }
                }
            }

            if (!opt.convertType) {
                //无条件要求刷新
                var stage = opt.stage;
                if (!self.convertStages[stage.id]) {
                    self.convertStages[stage.id] = {
                        stage: stage,
                        convertShapes: {}
                    };
                }
            }
        } else {
            //无条件要求全部刷新，一般用在resize等。
            _.each(self.app.children, function (stage, i) {
                self.convertStages[stage.id] = {
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
}

class CanvasRenderer extends SystemRenderer {
    constructor(app) {
        super(RENDERER_TYPE.CANVAS, app);
    }
}

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
var Application = function (opt) {
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

    Application.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Application, DisplayObjectContainer, {
    init: function () {
        this.context.width = this.width;
        this.context.height = this.height;

        //然后创建一个用于绘制激活 shape 的 stage 到activation
        this._creatHoverStage();

        //创建一个如果要用像素检测的时候的容器
        this._createPixelContext();
    },
    registEvent: function (opt) {
        //初始化事件委托到root元素上面
        this.event = new EventHandler(this, opt);
        this.event.init();
        return this.event;
    },
    resize: function (opt) {
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
        var reSizeCanvas = function (ctx) {
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
            reSizeCanvas(s.context2D);
            s._notWatch = false;
        });

        this.dom_c.style.width = this.width + "px";
        this.dom_c.style.height = this.height + "px";

        this.heartBeat();
    },
    getHoverStage: function () {
        return this._bufferStage;
    },
    _creatHoverStage: function () {
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
    _createPixelContext: function () {
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

    updateViewOffset: function () {
        var now = new Date().getTime();
        if (now - this.lastGetRO > 1000) {
            this.viewOffset = $.offset(this.view);
            this.lastGetRO = now;
        }
    },

    _afterAddChild: function (stage, index) {
        var canvas;

        if (!stage.context2D) {
            canvas = $.createCanvas(this.context.width, this.context.height, stage.id);
        } else {
            canvas = stage.context2D.canvas;
        }

        if (this.children.length == 1) {
            this.stage_c.appendChild(canvas);
        } else if (this.children.length > 1) {
            if (index == undefined) {
                //如果没有指定位置，那么就放到_bufferStage的下面。
                this.stage_c.insertBefore(canvas, this._bufferStage.context2D.canvas);
            } else {
                //如果有指定的位置，那么就指定的位置来
                if (index >= this.children.length - 1) {
                    this.stage_c.appendChild(canvas);
                } else {
                    this.stage_c.insertBefore(canvas, this.children[index].context2D.canvas);
                }
            }
        }

        Utils.initElement(canvas);
        stage.initStage(canvas.getContext("2d"), this.context.width, this.context.height);
    },
    _afterDelChild: function (stage) {
        this.stage_c.removeChild(stage.context2D.canvas);
    },

    heartBeat: function (opt) {
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
var Sprite = function () {
    this.type = "sprite";
    Sprite.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Sprite, DisplayObjectContainer, {
    init: function () {}
});

class GraphicsData {
    constructor(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, shape) {
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this.lineAlpha = lineAlpha;
        this._lineTint = lineColor;
        this.fillColor = fillColor;
        this.fillAlpha = fillAlpha;
        this._fillTint = fillColor;
        this.fill = fill;
        this.holes = [];
        this.shape = shape;
        this.type = shape.type;
    }

    clone() {
        return new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.fill, this.shape);
    }

    addHole(shape) {
        this.holes.push(shape);
    }

    destroy() {
        this.shape = null;
        this.holes = null;
    }

}

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 *
 * @class
 * @memberof PIXI
 */
class Point$1 {
  /**
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(x = 0, y = 0) {
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
  clone() {
    return new Point$1(this.x, this.y);
  }

  /**
   * Copies x and y from the given point
   *
   * @param {PIXI.Point} p - The point to copy.
   */
  copy(p) {
    this.set(p.x, p.y);
  }

  /**
   * Returns true if the given point is equal to this point
   *
   * @param {PIXI.Point} p - The point to check
   * @returns {boolean} Whether the given point equal to this point
   */
  equals(p) {
    return p.x === this.x && p.y === this.y;
  }

  /**
   * Sets the point to a new x and y position.
   * If y is omitted, both x and y will be set to x.
   *
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  set(x, y) {
    this.x = x || 0;
    this.y = y || (y !== 0 ? this.x : 0);
  }

}

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
class Matrix$2 {
    /**
     *
     */
    constructor() {
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
    fromArray(array) {
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
    set(a, b, c, d, tx, ty) {
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
    toArray(transpose, out) {
        if (!this.array) {
            this.array = new Float32Array(9);
        }

        const array = out || this.array;

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
    apply(pos, newPos) {
        newPos = newPos || new Point$1();

        const x = pos.x;
        const y = pos.y;

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
    applyInverse(pos, newPos) {
        newPos = newPos || new Point$1();

        const id = 1 / (this.a * this.d + this.c * -this.b);

        const x = pos.x;
        const y = pos.y;

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
    translate(x, y) {
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
    scale(x, y) {
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
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const a1 = this.a;
        const c1 = this.c;
        const tx1 = this.tx;

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
    append(matrix) {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;

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
    setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
        const sr = Math.sin(rotation);
        const cr = Math.cos(rotation);
        const cy = Math.cos(skewY);
        const sy = Math.sin(skewY);
        const nsx = -Math.sin(skewX);
        const cx = Math.cos(skewX);

        const a = cr * scaleX;
        const b = sr * scaleX;
        const c = -sr * scaleY;
        const d = cr * scaleY;

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
    prepend(matrix) {
        const tx1 = this.tx;

        if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
            const a1 = this.a;
            const c1 = this.c;

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
    decompose(transform) {
        // sort out rotation / skew..
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

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
    invert() {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        const tx1 = this.tx;
        const n = a1 * d1 - b1 * c1;

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
    identity() {
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
    clone() {
        const matrix = new Matrix$2();

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
    copy(matrix) {
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
    static get IDENTITY() {
        return new Matrix$2();
    }

    /**
     * A temp matrix
     *
     * @static
     * @const
     */
    static get TEMP_MATRIX() {
        return new Matrix$2();
    }
}

// Your friendly neighbour https://en.wikipedia.org/wiki/Dihedral_group of order 16
const ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
const uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
const vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
const vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
const tempMatrices = [];

const mul = [];

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
    for (let i = 0; i < 16; i++) {
        const row = [];

        mul.push(row);

        for (let j = 0; j < 16; j++) {
            const _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
            const _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
            const _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
            const _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);

            for (let k = 0; k < 16; k++) {
                if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
                    row.push(k);
                    break;
                }
            }
        }
    }

    for (let i = 0; i < 16; i++) {
        const mat = new Matrix$2();

        mat.set(ux[i], uy[i], vx[i], vy[i], 0, 0);
        tempMatrices.push(mat);
    }
}

init();

/**
 * Rectangle object is an area defined by its position, as indicated by its top-left corner
 * point (x, y) and by its width and its height.
 *
 * @class
 * @memberof PIXI
 */
class Rectangle {
    /**
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
     * @param {number} [width=0] - The overall width of this rectangle
     * @param {number} [height=0] - The overall height of this rectangle
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
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
    get left() {
        return this.x;
    }

    /**
     * returns the right edge of the rectangle
     *
     * @member {number}
     */
    get right() {
        return this.x + this.width;
    }

    /**
     * returns the top edge of the rectangle
     *
     * @member {number}
     */
    get top() {
        return this.y;
    }

    /**
     * returns the bottom edge of the rectangle
     *
     * @member {number}
     */
    get bottom() {
        return this.y + this.height;
    }

    /**
     * A constant empty rectangle.
     *
     * @static
     * @constant
     */
    static get EMPTY() {
        return new Rectangle(0, 0, 0, 0);
    }

    /**
     * Creates a clone of this Rectangle
     *
     * @return {PIXI.Rectangle} a copy of the rectangle
     */
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * Copies another rectangle to this one.
     *
     * @param {PIXI.Rectangle} rectangle - The rectangle to copy.
     * @return {PIXI.Rectangle} Returns itself.
     */
    copy(rectangle) {
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
    contains(x, y) {
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
    pad(paddingX, paddingY) {
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
    fit(rectangle) {
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
    enlarge(rectangle) {
        const x1 = Math.min(this.x, rectangle.x);
        const x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
        const y1 = Math.min(this.y, rectangle.y);
        const y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);

        this.x = x1;
        this.width = x2 - x1;
        this.y = y1;
        this.height = y2 - y1;
    }
}

/**
 * The Circle object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */
class Circle {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [radius=0] - The radius of the circle
   */
  constructor(x = 0, y = 0, radius = 0) {
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
  }

  /**
   * Creates a clone of this Circle instance
   *
   * @return {PIXI.Circle} a copy of the Circle
   */
  clone() {
    return new Circle(this.x, this.y, this.radius);
  }

  /**
   * Checks whether the x and y coordinates given are contained within this circle
   *
   * @param {number} x - The X coordinate of the point to test
   * @param {number} y - The Y coordinate of the point to test
   * @return {boolean} Whether the x/y coordinates are within this Circle
   */
  contains(x, y) {
    if (this.radius <= 0) {
      return false;
    }

    const r2 = this.radius * this.radius;
    let dx = this.x - x;
    let dy = this.y - y;

    dx *= dx;
    dy *= dy;

    return dx + dy <= r2;
  }

  /**
  * Returns the framing rectangle of the circle as a Rectangle object
  *
  * @return {PIXI.Rectangle} the framing rectangle
  */
  getBounds() {
    return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
}

/**
 * The Ellipse object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */
class Ellipse {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [width=0] - The half width of this ellipse
   * @param {number} [height=0] - The half height of this ellipse
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
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
  }

  /**
   * Creates a clone of this Ellipse instance
   *
   * @return {PIXI.Ellipse} a copy of the ellipse
   */
  clone() {
    return new Ellipse(this.x, this.y, this.width, this.height);
  }

  /**
   * Checks whether the x and y coordinates given are contained within this ellipse
   *
   * @param {number} x - The X coordinate of the point to test
   * @param {number} y - The Y coordinate of the point to test
   * @return {boolean} Whether the x/y coords are within this ellipse
   */
  contains(x, y) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }

    // normalize the coords to an ellipse with center 0,0
    let normx = (x - this.x) / this.width;
    let normy = (y - this.y) / this.height;

    normx *= normx;
    normy *= normy;

    return normx + normy <= 1;
  }

  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   *
   * @return {PIXI.Rectangle} the framing rectangle
   */
  getBounds() {
    return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
  }
}

/**
 * @class
 * @memberof PIXI
 */
class Polygon {
    /**
     * @param {PIXI.Point[]|number[]} points - This can be an array of Points
     *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
     *  the arguments passed can be all the points of the polygon e.g.
     *  `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the arguments passed can be flat
     *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
     */
    constructor(...points) {
        if (Array.isArray(points[0])) {
            points = points[0];
        }

        // if this is an array of points, convert it to a flat array of numbers
        if (points[0] instanceof Point$1) {
            const p = [];

            for (let i = 0, il = points.length; i < il; i++) {
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
    clone() {
        return new Polygon(this.points.slice());
    }

    /**
     * Closes the polygon, adding points if necessary.
     *
     */
    close() {
        const points = this.points;

        // close the poly if the value is true!
        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
            points.push(points[0], points[1]);
        }
    }

    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this polygon
     */
    contains(x, y) {
        let inside = false;

        // use some raycasting to test hits
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        const length = this.points.length / 2;

        for (let i = 0, j = length - 1; i < length; j = i++) {
            const xi = this.points[i * 2];
            const yi = this.points[i * 2 + 1];
            const xj = this.points[j * 2];
            const yj = this.points[j * 2 + 1];
            const intersect = yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi;

            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    }
}

/**
 * The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
 * top-left corner point (x, y) and by its width and its height and its radius.
 *
 * @class
 * @memberof PIXI
 */
class RoundedRectangle {
    /**
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rounded rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rounded rectangle
     * @param {number} [width=0] - The overall width of this rounded rectangle
     * @param {number} [height=0] - The overall height of this rounded rectangle
     * @param {number} [radius=20] - Controls the radius of the rounded corners
     */
    constructor(x = 0, y = 0, width = 0, height = 0, radius = 20) {
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
         * @member {number}
         * @default 20
         */
        this.radius = radius;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readonly
         * @default PIXI.SHAPES.RREC
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.RREC;
    }

    /**
     * Creates a clone of this Rounded Rectangle
     *
     * @return {PIXI.RoundedRectangle} a copy of the rounded rectangle
     */
    clone() {
        return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
    }

    /**
     * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this Rounded Rectangle
     */
    contains(x, y) {
        if (this.width <= 0 || this.height <= 0) {
            return false;
        }
        if (x >= this.x && x <= this.x + this.width) {
            if (y >= this.y && y <= this.y + this.height) {
                if (y >= this.y + this.radius && y <= this.y + this.height - this.radius || x >= this.x + this.radius && x <= this.x + this.width - this.radius) {
                    return true;
                }
                let dx = x - (this.x + this.radius);
                let dy = y - (this.y + this.radius);
                const radius2 = this.radius * this.radius;

                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
                dx = x - (this.x + this.width - this.radius);
                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
                dy = y - (this.y + this.height - this.radius);
                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
                dx = x - (this.x + this.radius);
                if (dx * dx + dy * dy <= radius2) {
                    return true;
                }
            }
        }

        return false;
    }
}

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
function bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, path = []) {
    const n = 20;
    let dt = 0;
    let dt2 = 0;
    let dt3 = 0;
    let t2 = 0;
    let t3 = 0;

    path.push(fromX, fromY);

    for (let i = 1, j = 0; i <= n; ++i) {
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

const tempMatrix = new Matrix$2();
const tempPoint = new Point$1();
class Graphics {
    constructor() {
        this.fillAlpha = 1;
        this.lineWidth = 0;
        this.lineColor = 0;
        this.graphicsData = [];
        this.tint = 0xFFFFFF;
        this._prevTint = 0xFFFFFF;
        this.currentPath = null;

        this._webGL = {};

        this.dirty = 0;
        this.fastRectDirty = -1;
        this.clearDirty = 0;
        this.boundsDirty = -1;
        this.cachedSpriteDirty = false;

        this._spriteRect = null;
        this._fastRect = false;
    }

    clone() {
        const clone = new Graphics();

        clone.fillAlpha = this.fillAlpha;
        clone.lineWidth = this.lineWidth;
        clone.lineColor = this.lineColor;
        clone.tint = this.tint;
        clone.boundsPadding = this.boundsPadding;
        clone.dirty = 0;
        clone.cachedSpriteDirty = this.cachedSpriteDirty;

        // copy graphics data
        for (let i = 0; i < this.graphicsData.length; ++i) {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];

        clone.updateLocalBounds();

        return clone;
    }

    lineStyle(lineWidth = 0, color = 0, alpha = 1) {
        this.lineWidth = lineWidth;
        this.lineColor = color;
        this.lineAlpha = alpha;

        if (this.currentPath) {
            if (this.currentPath.shape.points.length) {
                // halfway through a line? start a new one!
                const shape = new Polygon(this.currentPath.shape.points.slice(-2));

                shape.closed = false;

                this.drawShape(shape);
            } else {
                // otherwise its empty so lets just set the line properties
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
            }
        }

        return this;
    }

    moveTo(x, y) {
        const shape = new Polygon([x, y]);

        shape.closed = false;
        this.drawShape(shape);

        return this;
    }

    /**
     * Draws a line using the current line style from the current drawing position to (x, y);
     * The current drawing position is then set to (x, y).
     *
     * @param {number} x - the X coordinate to draw to
     * @param {number} y - the Y coordinate to draw to
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    lineTo(x, y) {
        this.currentPath.shape.points.push(x, y);
        this.dirty++;

        return this;
    }

    /**
     * Calculate the points for a quadratic bezier curve and then draws it.
     * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
     *
     * @param {number} cpX - Control point x
     * @param {number} cpY - Control point y
     * @param {number} toX - Destination point x
     * @param {number} toY - Destination point y
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    quadraticCurveTo(cpX, cpY, toX, toY) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points = [0, 0];
            }
        } else {
            this.moveTo(0, 0);
        }

        const n = 20;
        const points = this.currentPath.shape.points;
        let xa = 0;
        let ya = 0;

        if (points.length === 0) {
            this.moveTo(0, 0);
        }

        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];

        for (let i = 1; i <= n; ++i) {
            const j = i / n;

            xa = fromX + (cpX - fromX) * j;
            ya = fromY + (cpY - fromY) * j;

            points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
        }

        this.dirty++;

        return this;
    }

    bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points = [0, 0];
            }
        } else {
            this.moveTo(0, 0);
        }

        const points = this.currentPath.shape.points;

        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];

        points.length -= 2;

        bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);

        this.dirty++;

        return this;
    }

    arcTo(x1, y1, x2, y2, radius) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points.push(x1, y1);
            }
        } else {
            this.moveTo(x1, y1);
        }

        const points = this.currentPath.shape.points;
        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];
        const a1 = fromY - y1;
        const b1 = fromX - x1;
        const a2 = y2 - y1;
        const b2 = x2 - x1;
        const mm = Math.abs(a1 * b2 - b1 * a2);

        if (mm < 1.0e-8 || radius === 0) {
            if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
                points.push(x1, y1);
            }
        } else {
            const dd = a1 * a1 + b1 * b1;
            const cc = a2 * a2 + b2 * b2;
            const tt = a1 * a2 + b1 * b2;
            const k1 = radius * Math.sqrt(dd) / mm;
            const k2 = radius * Math.sqrt(cc) / mm;
            const j1 = k1 * tt / dd;
            const j2 = k2 * tt / cc;
            const cx = k1 * b2 + k2 * b1;
            const cy = k1 * a2 + k2 * a1;
            const px = b1 * (k2 + j1);
            const py = a1 * (k2 + j1);
            const qx = b2 * (k1 + j2);
            const qy = a2 * (k1 + j2);
            const startAngle = Math.atan2(py - cy, px - cx);
            const endAngle = Math.atan2(qy - cy, qx - cx);

            this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
        }

        this.dirty++;

        return this;
    }

    arc(cx, cy, radius, startAngle, endAngle, anticlockwise = false) {
        if (startAngle === endAngle) {
            return this;
        }

        if (!anticlockwise && endAngle <= startAngle) {
            endAngle += Math.PI * 2;
        } else if (anticlockwise && startAngle <= endAngle) {
            startAngle += Math.PI * 2;
        }

        const sweep = endAngle - startAngle;
        const segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 40;

        if (sweep === 0) {
            return this;
        }

        const startX = cx + Math.cos(startAngle) * radius;
        const startY = cy + Math.sin(startAngle) * radius;

        // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.
        let points = this.currentPath ? this.currentPath.shape.points : null;

        if (points) {
            if (points[points.length - 2] !== startX || points[points.length - 1] !== startY) {
                points.push(startX, startY);
            }
        } else {
            this.moveTo(startX, startY);
            points = this.currentPath.shape.points;
        }

        const theta = sweep / (segs * 2);
        const theta2 = theta * 2;

        const cTheta = Math.cos(theta);
        const sTheta = Math.sin(theta);

        const segMinus = segs - 1;

        const remainder = segMinus % 1 / segMinus;

        for (let i = 0; i <= segMinus; ++i) {
            const real = i + remainder * i;

            const angle = theta + startAngle + theta2 * real;

            const c = Math.cos(angle);
            const s = -Math.sin(angle);

            points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
        }

        this.dirty++;

        return this;
    }

    beginFill(color = 0, alpha = 1) {
        this.filling = true;
        this.fillColor = color;
        this.fillAlpha = alpha;

        if (this.currentPath) {
            if (this.currentPath.shape.points.length <= 2) {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this.fillColor;
                this.currentPath.fillAlpha = this.fillAlpha;
            }
        }

        return this;
    }

    endFill() {
        this.filling = false;
        this.fillColor = null;
        this.fillAlpha = 1;

        return this;
    }

    drawRect(x, y, width, height) {
        this.drawShape(new Rectangle(x, y, width, height));
        return this;
    }

    drawRoundedRect(x, y, width, height, radius) {
        this.drawShape(new RoundedRectangle(x, y, width, height, radius));

        return this;
    }

    drawCircle(x, y, radius) {
        this.drawShape(new Circle(x, y, radius));

        return this;
    }

    drawEllipse(x, y, width, height) {
        this.drawShape(new Ellipse(x, y, width, height));

        return this;
    }

    drawPolygon(path) {
        // prevents an argument assignment deopt
        // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        let points = path;

        let closed = true;

        if (points instanceof Polygon) {
            closed = points.closed;
            points = points.points;
        }

        if (!Array.isArray(points)) {
            // prevents an argument leak deopt
            // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            points = new Array(arguments.length);

            for (let i = 0; i < points.length; ++i) {
                points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
            }
        }

        const shape = new Polygon(points);

        shape.closed = closed;

        this.drawShape(shape);

        return this;
    }

    clear() {
        if (this.lineWidth || this.filling || this.graphicsData.length > 0) {
            this.lineWidth = 0;
            this.filling = false;

            this.boundsDirty = -1;
            this.dirty++;
            this.clearDirty++;
            this.graphicsData.length = 0;
        }

        this.currentPath = null;
        this._spriteRect = null;

        return this;
    }

    /**
     * Renders the object using the WebGL renderer
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */
    _renderWebGL(renderer) {

        renderer.setObjectRenderer(renderer.plugins.graphics);
        renderer.plugins.graphics.render(this);
    }

    /**
     * Renders the object using the Canvas renderer
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */
    _renderCanvas(renderer) {
        renderer.plugins.graphics.render(this);
    }

    /**
     * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
     *
     * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
     * @return {PIXI.GraphicsData} The generated GraphicsData object.
     */
    drawShape(shape) {
        if (this.currentPath) {
            // check current path!
            if (this.currentPath.shape.points.length <= 2) {
                this.graphicsData.pop();
            }
        }

        this.currentPath = null;

        const data = new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, shape);

        this.graphicsData.push(data);

        if (data.type === SHAPES.POLY) {
            data.shape.closed = data.shape.closed || this.filling;
            this.currentPath = data;
        }

        this.dirty++;

        return data;
    }

    /**
     * Closes the current path.
     *
     * @return {PIXI.Graphics} Returns itself.
     */
    closePath() {
        // ok so close path assumes next one is a hole!
        const currentPath = this.currentPath;

        if (currentPath && currentPath.shape) {
            currentPath.shape.close();
        }

        return this;
    }

    destroy(options) {
        super.destroy(options);

        // destroy each of the GraphicsData objects
        for (let i = 0; i < this.graphicsData.length; ++i) {
            this.graphicsData[i].destroy();
        }

        // for each webgl data entry, destroy the WebGLGraphicsData
        for (const id in this._webgl) {
            for (let j = 0; j < this._webgl[id].data.length; ++j) {
                this._webgl[id].data[j].destroy();
            }
        }

        if (this._spriteRect) {
            this._spriteRect.destroy();
        }

        this.graphicsData = null;

        this.currentPath = null;
        this._webgl = null;
        this._localBounds = null;
    }

}

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
var Shape = function (opt) {

    var self = this;

    self.graphics = new Graphics();

    //元素是否有hover事件 和 chick事件，由addEvenetLister和remiveEventLister来触发修改
    self._hoverable = false;
    self._clickable = false;

    //over的时候如果有修改样式，就为true
    self._hoverClass = false;
    self.hoverClone = true; //是否开启在hover的时候clone一份到active stage 中 
    self.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

    //拖拽drag的时候显示在activShape的副本
    self._dragDuplicate = null;

    //元素是否 开启 drag 拖动，这个有用户设置传入
    //self.draggable = opt.draggable || false;

    self.type = self.type || "shape";
    opt.draw && (self.draw = opt.draw);

    //处理所有的图形一些共有的属性配置
    self.initCompProperty(opt);

    Shape.superclass.constructor.apply(this, arguments);
    self._rect = null;
};

Utils.creatClass(Shape, DisplayObject, {
    init: function () {},
    initCompProperty: function (opt) {
        for (var i in opt) {
            if (i != "id" && i != "context") {
                this[i] = opt[i];
            }
        }
    },
    /*
     *下面两个方法为提供给 具体的 图形类覆盖实现，本shape类不提供具体实现
     *draw() 绘制   and   setRect()获取该类的矩形边界
    */
    draw: function () {},
    drawEnd: function (ctx) {
        if (this._hasFillAndStroke) {
            //如果在子shape类里面已经实现stroke fill 等操作， 就不需要统一的d
            return;
        }

        //style 要从diaplayObject的 context上面去取
        var style = this.context;

        //fill stroke 之前， 就应该要closepath 否则线条转角口会有缺口。
        //drawTypeOnly 由继承shape的具体绘制类提供
        if (this._drawTypeOnly != "stroke" && this.type != "path") {
            ctx.closePath();
        }

        if (style.strokeStyle && style.lineWidth) {
            ctx.stroke();
        }
        //比如贝塞尔曲线画的线,drawTypeOnly==stroke，是不能使用fill的，后果很严重
        if (style.fillStyle && this._drawTypeOnly != "stroke") {
            ctx.fill();
        }
    },

    render: function () {
        var ctx = this.getStage().context2D;

        if (this.context.type == "shape") {
            //type == shape的时候，自定义绘画
            //这个时候就可以使用self.graphics绘图接口了，该接口模拟的是as3的接口
            this.draw.apply(this);
        } else {
            //这个时候，说明该shape是调用已经绘制好的 shape 模块，这些模块全部在../shape目录下面
            if (this.draw) {
                ctx.beginPath();
                this.draw(ctx, this.context);
                this.drawEnd(ctx);
            }
        }
    },

    /*
     * 画虚线
     */
    dashedLineTo: function (ctx, x1, y1, x2, y2, dashLength) {
        dashLength = typeof dashLength == 'undefined' ? 3 : dashLength;
        dashLength = Math.max(dashLength, this.context.lineWidth);
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
        for (var i = 0; i < numDashes; ++i) {
            var x = parseInt(x1 + deltaX / numDashes * i);
            var y = parseInt(y1 + deltaY / numDashes * i);
            ctx[i % 2 === 0 ? 'moveTo' : 'lineTo'](x, y);
            if (i == numDashes - 1 && i % 2 === 0) {
                ctx.lineTo(x2, y2);
            }
        }
    },
    /*
     *从cpl节点中获取到4个方向的边界节点
     *@param  context 
     *
     **/
    getRectFormPointList: function (context) {
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
});

/**
 * Canvax--Text
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 文本 类
 **/
var Text = function (text, opt) {
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
    $watch: function (name, value, preValue) {
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
    init: function (text, opt) {
        var self = this;
        var c = this.context;
        c.width = this.getTextWidth();
        c.height = this.getTextHeight();
    },
    render: function (ctx) {
        for (var p in this.context.$model) {
            if (p in ctx) {
                if (p != "textBaseline" && this.context.$model[p]) {
                    ctx[p] = this.context.$model[p];
                }
            }
        }
        this._renderText(ctx, this._getTextLines());
    },
    resetText: function (text) {
        this.text = text.toString();
        this.heartBeat();
    },
    getTextWidth: function () {
        var width = 0;
        Utils._pixelCtx.save();
        Utils._pixelCtx.font = this.context.font;
        width = this._getTextWidth(Utils._pixelCtx, this._getTextLines());
        Utils._pixelCtx.restore();
        return width;
    },
    getTextHeight: function () {
        return this._getTextHeight(Utils._pixelCtx, this._getTextLines());
    },
    _getTextLines: function () {
        return this.text.split(this._reNewline);
    },
    _renderText: function (ctx, textLines) {
        ctx.save();
        this._renderTextStroke(ctx, textLines);
        this._renderTextFill(ctx, textLines);
        ctx.restore();
    },
    _getFontDeclaration: function () {
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
    _renderTextFill: function (ctx, textLines) {
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
    _renderTextStroke: function (ctx, textLines) {
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
    _renderTextLine: function (method, ctx, line, left, top, lineIndex) {
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
    _renderChars: function (method, ctx, chars, left, top) {
        ctx[method](chars, 0, top);
    },
    _getHeightOfLine: function () {
        return this.context.fontSize * this.context.lineHeight;
    },
    _getTextWidth: function (ctx, textLines) {
        var maxWidth = ctx.measureText(textLines[0] || '|').width;
        for (var i = 1, len = textLines.length; i < len; i++) {
            var currentLineWidth = ctx.measureText(textLines[i]).width;
            if (currentLineWidth > maxWidth) {
                maxWidth = currentLineWidth;
            }
        }
        return maxWidth;
    },
    _getTextHeight: function (ctx, textLines) {
        return this.context.fontSize * textLines.length * this.context.lineHeight;
    },

    /**
     * @private
     * @return {Number} Top offset
     */
    _getTopOffset: function () {
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
    getRect: function () {
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
    distance: function (v) {
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
 * 折线 类
 *
 * 对应context的属性有
 * @pointList 各个顶角坐标
 **/
var BrokenLine = function (opt, atype) {
    var self = this;
    self.type = "brokenline";
    self._drawTypeOnly = "stroke";
    opt = Utils.checkOpt(opt);
    if (atype !== "clone") {
        self._initPointList(opt.context);
    }
    self._context = _$1.extend({
        lineType: null,
        smooth: false,
        pointList: [], //{Array}  // 必须，各个顶角坐标
        smoothFilter: null
    }, opt.context);

    BrokenLine.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(BrokenLine, Shape, {
    $watch: function (name, value, preValue) {
        if (name == "pointList") {
            this._initPointList(this.context, value, preValue);
        }
    },
    _initPointList: function (context, value, preValue) {
        var myC = context;
        if (myC.smooth) {
            //smoothFilter -- 比如在折线图中。会传一个smoothFilter过来做point的纠正。
            //让y不能超过底部的原点
            var obj = {
                points: myC.pointList
            };
            if (_$1.isFunction(myC.smoothFilter)) {
                obj.smoothFilter = myC.smoothFilter;
            }
            this._notWatch = true; //本次转换不出发心跳
            var currL = SmoothSpline(obj);

            if (value && value.length > 0) {
                currL[currL.length - 1][0] = value[value.length - 1][0];
            }
            myC.pointList = currL;
            this._notWatch = false;
        }
    },
    //polygon需要覆盖draw方法，所以要把具体的绘制代码作为_draw抽离出来
    draw: function (ctx, context) {
        this._draw(ctx, context);
    },
    _draw: function (ctx, context) {
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
                    if (si == sl - 1) {
                        break;
                    }
                    ctx.moveTo(pointList[si][0], pointList[si][1]);
                    ctx.lineTo(pointList[si + 1][0], pointList[si + 1][1]);
                    si += 1;
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
    getRect: function (context) {
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
var Circle$1 = function (opt) {
    var self = this;
    self.type = "circle";

    opt = Utils.checkOpt(opt);

    //默认情况下面，circle不需要把xy进行parentInt转换
    "xyToInt" in opt || (opt.xyToInt = false);

    self._context = {
        r: opt.context.r || 0 //{number},  // 必须，圆半径
    };
    Circle$1.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Circle$1, Shape, {
    /**
      * 创建圆形路径
      * @param {Context2D} ctx Canvas 2D上下文
      * @param {Object} style 样式
      */
    draw: function (ctx, style) {
        if (!style) {
            return;
        }
        ctx.arc(0, 0, style.r, 0, Math.PI * 2, true);
    },

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * @param {Object} style
     */
    getRect: function (style) {
        var lineWidth;
        var style = style ? style : this.context;
        if (style.fillStyle || style.strokeStyle) {
            lineWidth = style.lineWidth || 1;
        } else {
            lineWidth = 0;
        }
        return {
            x: Math.round(0 - style.r - lineWidth / 2),
            y: Math.round(0 - style.r - lineWidth / 2),
            width: style.r * 2 + lineWidth,
            height: style.r * 2 + lineWidth
        };
    }
});

var Bezier = {
    /**
     * @param  {number} -- t {0, 1}
     * @return {Point}  -- return point at the given time in the bezier arc
     */
    getPointByTime: function (t, plist) {
        var it = 1 - t,
            it2 = it * it,
            it3 = it2 * it;
        var t2 = t * t,
            t3 = t2 * t;
        var xStart = plist[0],
            yStart = plist[1],
            cpX1 = plist[2],
            cpY1 = plist[3],
            cpX2 = 0,
            cpY2 = 0,
            xEnd = 0,
            yEnd = 0;
        if (plist.length > 6) {
            cpX2 = plist[4];
            cpY2 = plist[5];
            xEnd = plist[6];
            yEnd = plist[7];
            //三次贝塞尔
            return {
                x: it3 * xStart + 3 * it2 * t * cpX1 + 3 * it * t2 * cpX2 + t3 * xEnd,
                y: it3 * yStart + 3 * it2 * t * cpY1 + 3 * it * t2 * cpY2 + t3 * yEnd
            };
        } else {
            //二次贝塞尔
            xEnd = plist[4];
            yEnd = plist[5];
            return {
                x: it2 * xStart + 2 * t * it * cpX1 + t2 * xEnd,
                y: it2 * yStart + 2 * t * it * cpY1 + t2 * yEnd
            };
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
var Path = function (opt) {
    var self = this;
    self.type = "path";
    opt = Utils.checkOpt(opt);
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
    self._context = _$1.extend(_context, self._context || {});
    Path.superclass.constructor.apply(self, arguments);
};

Utils.creatClass(Path, Shape, {
    $watch: function (name, value, preValue) {
        if (name == "path") {
            //如果path有变动，需要自动计算新的pointList
            this.__parsePathData = null;
            this.context.pointList = [];
        }
    },
    _parsePathData: function (data) {
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
    },
    _parseChildPathData: function (data) {
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
                        points = this._convertPoint(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
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
                        points = this._convertPoint(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
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
    _convertPoint: function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {

        var psi = psiDeg * (Math.PI / 180.0);
        var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);

        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp)));

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

        var vMag = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function (u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function (u, v) {
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
    _getBezierPoints: function (p) {
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
    _getArcPoints: function (p) {

        var cx = p[0];
        var cy = p[1];
        var rx = p[2];
        var ry = p[3];
        var theta = p[4];
        var dTheta = p[5];
        var psi = p[6];
        var fs = p[7];
        var r = rx > ry ? rx : ry;
        var scaleX = rx > ry ? 1 : rx / ry;
        var scaleY = rx > ry ? ry / rx : 1;

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

    draw: function (ctx, style) {
        this._draw(ctx, style);
    },
    /**
     *  ctx Canvas 2D上下文
     *  style 样式
     */
    _draw: function (ctx, style) {
        var path = style.path;
        var pathArray = this._parsePathData(path);
        this._setPointList(pathArray, style);
        for (var g = 0, gl = pathArray.length; g < gl; g++) {
            for (var i = 0, l = pathArray[g].length; i < l; i++) {
                var c = pathArray[g][i].command,
                    p = pathArray[g][i].points;
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
                        var r = rx > ry ? rx : ry;
                        var scaleX = rx > ry ? 1 : rx / ry;
                        var scaleY = rx > ry ? ry / rx : 1;
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
    _setPointList: function (pathArray, style) {
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
                        var prePoints = pathArray[g][i - 1]._points || pathArray[g][i - 1].points;
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
                    if (!px && px != 0 || !py && py != 0) {
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
    getRect: function (style) {

        var lineWidth;
        var style = style ? style : this.context;
        if (style.strokeStyle || style.fillStyle) {
            lineWidth = style.lineWidth || 1;
        } else {
            lineWidth = 0;
        }

        var minX = Number.MAX_VALUE;
        var maxX = -Number.MAX_VALUE; //Number.MIN_VALUE;

        var minY = Number.MAX_VALUE;
        var maxY = -Number.MAX_VALUE; //Number.MIN_VALUE;

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
var Droplet = function (opt) {
    var self = this;
    opt = Utils.checkOpt(opt);
    self._context = {
        hr: opt.context.hr || 0, //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
        vr: opt.context.vr || 0 //{number},  // 必须，水滴纵高（中心到尖端距离）
    };
    Droplet.superclass.constructor.apply(this, arguments);
    self.type = "droplet";
};
Utils.creatClass(Droplet, Path, {
    draw: function (ctx, style) {
        var ps = "M 0 " + style.hr + " C " + style.hr + " " + style.hr + " " + style.hr * 3 / 2 + " " + -style.hr / 3 + " 0 " + -style.vr;
        ps += " C " + -style.hr * 3 / 2 + " " + -style.hr / 3 + " " + -style.hr + " " + style.hr + " 0 " + style.hr;
        this.context.path = ps;
        this._draw(ctx, style);
    }
});

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
var Ellipse$1 = function (opt) {
    var self = this;
    self.type = "ellipse";

    opt = Utils.checkOpt(opt);
    self._context = {
        //x             : 0 , //{number},  // 丢弃
        //y             : 0 , //{number},  // 丢弃，原因同circle
        hr: opt.context.hr || 0, //{number},  // 必须，椭圆横轴半径
        vr: opt.context.vr || 0 //{number},  // 必须，椭圆纵轴半径
    };

    Ellipse$1.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Ellipse$1, Shape, {
    draw: function (ctx, style) {
        var r = style.hr > style.vr ? style.hr : style.vr;
        var ratioX = style.hr / r; //横轴缩放比率
        var ratioY = style.vr / r;

        ctx.scale(ratioX, ratioY);
        ctx.arc(0, 0, r, 0, Math.PI * 2, true);
        if (document.createElement('canvas').getContext) {
            //ie下面要想绘制个椭圆出来，就不能执行这步了
            //算是excanvas 实现上面的一个bug吧
            ctx.scale(1 / ratioX, 1 / ratioY);
        }
        return;
    },
    getRect: function (style) {
        var lineWidth;
        var style = style ? style : this.context;
        if (style.fillStyle || style.strokeStyle) {
            lineWidth = style.lineWidth || 1;
        } else {
            lineWidth = 0;
        }
        return {
            x: Math.round(0 - style.hr - lineWidth / 2),
            y: Math.round(0 - style.vr - lineWidth / 2),
            width: style.hr * 2 + lineWidth,
            height: style.vr * 2 + lineWidth
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
var Polygon$1 = function (opt, atype) {
    var self = this;
    opt = Utils.checkOpt(opt);

    if (atype !== "clone") {
        var start = opt.context.pointList[0];
        var end = opt.context.pointList[opt.context.pointList.length - 1];
        if (opt.context.smooth) {
            opt.context.pointList.unshift(end);
        } else {
            opt.context.pointList.push(start);
        }
    }

    Polygon$1.superclass.constructor.apply(this, arguments);

    if (atype !== "clone" && opt.context.smooth && end) {}

    self._drawTypeOnly = null;
    self.type = "polygon";
};
Utils.creatClass(Polygon$1, BrokenLine, {
    draw: function (ctx, context) {
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
var Isogon = function (opt) {
    var self = this;
    opt = Utils.checkOpt(opt);
    self._context = _$1.extend({
        pointList: [], //从下面的r和n计算得到的边界值的集合
        r: 0, //{number},  // 必须，正n边形外接圆半径
        n: 0 //{number},  // 必须，指明正几边形
    }, opt.context);
    self.setPointList(self._context);
    opt.context = self._context;
    Isogon.superclass.constructor.apply(this, arguments);
    this.type = "isogon";
};
Utils.creatClass(Isogon, Polygon$1, {
    $watch: function (name, value, preValue) {
        if (name == "r" || name == "n") {
            //如果path有变动，需要自动计算新的pointList
            this.setPointList(this.context);
        }
    },
    setPointList: function (style) {
        style.pointList.length = 0;
        var n = style.n,
            r = style.r;
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
var Line = function (opt) {
    var self = this;
    this.type = "line";
    this.drawTypeOnly = "stroke";
    opt = Utils.checkOpt(opt);
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

Utils.creatClass(Line, Shape, {
    /**
     * 创建线条路径
     * ctx Canvas 2D上下文
     * style 样式
     */
    draw: function (ctx, style) {
        if (!style.lineType || style.lineType == 'solid') {
            //默认为实线
            ctx.moveTo(parseInt(style.xStart), parseInt(style.yStart));
            ctx.lineTo(parseInt(style.xEnd), parseInt(style.yEnd));
        } else if (style.lineType == 'dashed' || style.lineType == 'dotted') {
            this.dashedLineTo(ctx, style.xStart, style.yStart, style.xEnd, style.yEnd, style.dashLength);
        }
    },

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * style
     */
    getRect: function (style) {
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
var Rect = function (opt) {
    var self = this;
    self.type = "rect";

    opt = Utils.checkOpt(opt);
    self._context = {
        width: opt.context.width || 0, //{number},  // 必须，宽度
        height: opt.context.height || 0, //{number},  // 必须，高度
        radius: opt.context.radius || [] //{array},   // 默认为[0]，圆角 
    };
    Rect.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Rect, Shape, {
    /**
     * 绘制圆角矩形
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    _buildRadiusPath: function (ctx, style) {
        //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
        //r缩写为1         相当于 [1, 1, 1, 1]
        //r缩写为[1]       相当于 [1, 1, 1, 1]
        //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
        //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
        var x = 0;
        var y = 0;
        var width = this.context.width;
        var height = this.context.height;

        var r = Utils.getCssOrderArr(style.radius);

        ctx.moveTo(parseInt(x + r[0]), parseInt(y));
        ctx.lineTo(parseInt(x + width - r[1]), parseInt(y));
        r[1] !== 0 && ctx.quadraticCurveTo(x + width, y, x + width, y + r[1]);
        ctx.lineTo(parseInt(x + width), parseInt(y + height - r[2]));
        r[2] !== 0 && ctx.quadraticCurveTo(x + width, y + height, x + width - r[2], y + height);
        ctx.lineTo(parseInt(x + r[3]), parseInt(y + height));
        r[3] !== 0 && ctx.quadraticCurveTo(x, y + height, x, y + height - r[3]);
        ctx.lineTo(parseInt(x), parseInt(y + r[0]));
        r[0] !== 0 && ctx.quadraticCurveTo(x, y, x + r[0], y);
    },
    /**
     * 创建矩形路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    draw: function (ctx, style) {
        if (!style.$model.radius.length) {
            if (!!style.fillStyle) {
                ctx.fillRect(0, 0, this.context.width, this.context.height);
            }
            if (!!style.lineWidth) {
                ctx.strokeRect(0, 0, this.context.width, this.context.height);
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
    getRect: function (style) {
        var lineWidth;
        var style = style ? style : this.context;
        if (style.fillStyle || style.strokeStyle) {
            lineWidth = style.lineWidth || 1;
        } else {
            lineWidth = 0;
        }
        return {
            x: Math.round(0 - lineWidth / 2),
            y: Math.round(0 - lineWidth / 2),
            width: this.context.width + lineWidth,
            height: this.context.height + lineWidth
        };
    }

});

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
var Sector = function (opt) {
    var self = this;
    self.type = "sector";
    self.regAngle = [];
    self.isRing = false; //是否为一个圆环

    opt = Utils.checkOpt(opt);
    self._context = {
        pointList: [], //边界点的集合,私有，从下面的属性计算的来
        r0: opt.context.r0 || 0, // 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
        r: opt.context.r || 0, //{number},  // 必须，外圆半径
        startAngle: opt.context.startAngle || 0, //{number},  // 必须，起始角度[0, 360)
        endAngle: opt.context.endAngle || 0, //{number},  // 必须，结束角度(0, 360]
        clockwise: opt.context.clockwise || false //是否顺时针，默认为false(顺时针)
    };
    Sector.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Sector, Shape, {
    draw: function (ctx, context) {
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

        ctx.arc(0, 0, r, startAngle, endAngle, this.context.clockwise);
        if (r0 !== 0) {
            if (this.isRing) {
                //加上这个isRing的逻辑是为了兼容flashcanvas下绘制圆环的的问题
                //不加这个逻辑flashcanvas会绘制一个大圆 ， 而不是圆环
                ctx.moveTo(r0, 0);
                ctx.arc(0, 0, r0, startAngle, endAngle, !this.context.clockwise);
            } else {
                ctx.arc(0, 0, r0, endAngle, startAngle, !this.context.clockwise);
            }
        } else {
            //TODO:在r0为0的时候，如果不加lineTo(0,0)来把路径闭合，会出现有搞笑的一个bug
            //整个圆会出现一个以每个扇形两端为节点的镂空，我可能描述不清楚，反正这个加上就好了
            ctx.lineTo(0, 0);
        }
    },
    getRegAngle: function () {
        this.regIn = true; //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
        var c = this.context;
        var startAngle = myMath.degreeTo360(c.startAngle); // 起始角度[0,360)
        var endAngle = myMath.degreeTo360(c.endAngle); // 结束角度(0,360]

        if (startAngle > endAngle && !c.clockwise || startAngle < endAngle && c.clockwise) {
            this.regIn = false; //out
        }
        //度的范围，从小到大
        this.regAngle = [Math.min(startAngle, endAngle), Math.max(startAngle, endAngle)];
    },
    getRect: function (context) {
        var context = context ? context : this.context;
        var r0 = typeof context.r0 == 'undefined' // 形内半径[0,r)
        ? 0 : context.r0;
        var r = context.r; // 扇形外半径(0,r]

        this.getRegAngle();

        var startAngle = myMath.degreeTo360(context.startAngle); // 起始角度[0,360)
        var endAngle = myMath.degreeTo360(context.endAngle); // 结束角度(0,360]

        /*
        var isCircle = false;
        if( Math.abs( startAngle - endAngle ) == 360 
                || ( startAngle == endAngle && startAngle * endAngle != 0 ) ){
            isCircle = true;
        }
        */

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

});

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
    Circle: Circle$1,
    Droplet: Droplet,
    Ellipse: Ellipse$1,
    Isogon: Isogon,
    Line: Line,
    Path: Path,
    Polygon: Polygon$1,
    Rect: Rect,
    Sector: Sector
};

Canvax.Event = {
    EventDispatcher: EventDispatcher,
    EventManager: EventManager
};

return Canvax;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmF4LmpzIiwic291cmNlcyI6WyIuLi8uLi9jYW52YXgvdXRpbHMvdW5kZXJzY29yZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9pbmRleC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1BvaW50LmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0NhbnZheEV2ZW50LmpzIiwiLi4vLi4vY2FudmF4L3NldHRpbmdzLmpzIiwiLi4vLi4vY2FudmF4L3V0aWxzL2RvbS5qcyIsIi4uLy4uL2NhbnZheC9ldmVudC9FdmVudEhhbmRsZXIuanMiLCIuLi8uLi9jYW52YXgvZXZlbnQvRXZlbnRNYW5hZ2VyLmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdGguanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9IaXRUZXN0UG9pbnQuanMiLCIuLi8uLi9jYW52YXgvYW5pbWF0aW9uL1R3ZWVuLmpzIiwiLi4vLi4vY2FudmF4L2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9vYnNlcnZlLmpzIiwiLi4vLi4vY2FudmF4L2NvbnN0LmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvRGlzcGxheU9iamVjdC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXIuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9TdGFnZS5qcyIsIi4uLy4uL2NhbnZheC9yZW5kZXJlcnMvU3lzdGVtUmVuZGVyZXIuanMiLCIuLi8uLi9jYW52YXgvcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlci5qcyIsIi4uLy4uL2NhbnZheC9BcHBsaWNhdGlvbi5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uLy4uL2NhbnZheC9ncmFwaGljcy9HcmFwaGljc0RhdGEuanMiLCIuLi8uLi9jYW52YXgvbWF0aC9Qb2ludC5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL0dyb3VwRDguanMiLCIuLi8uLi9jYW52YXgvbWF0aC9zaGFwZXMvUmVjdGFuZ2xlLmpzIiwiLi4vLi4vY2FudmF4L21hdGgvc2hhcGVzL0NpcmNsZS5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL3NoYXBlcy9FbGxpcHNlLmpzIiwiLi4vLi4vY2FudmF4L21hdGgvc2hhcGVzL1BvbHlnb24uanMiLCIuLi8uLi9jYW52YXgvbWF0aC9zaGFwZXMvUm91bmRlZFJlY3RhbmdsZS5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL2luZGV4LmpzIiwiLi4vLi4vY2FudmF4L2dyYXBoaWNzL3V0aWxzL2JlemllckN1cnZlVG8uanMiLCIuLi8uLi9jYW52YXgvZ3JhcGhpY3MvR3JhcGhpY3MuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9TaGFwZS5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1RleHQuanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9WZWN0b3IuanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9TbW9vdGhTcGxpbmUuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvQnJva2VuTGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9DaXJjbGUuanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9iZXppZXIuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvUGF0aC5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Ecm9wbGV0LmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0VsbGlwc2UuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvUG9seWdvbi5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Jc29nb24uanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvTGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9SZWN0LmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL1NlY3Rvci5qcyIsIi4uLy4uL2NhbnZheC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgXyA9IHt9XG52YXIgYnJlYWtlciA9IHt9O1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyXG50b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG5oYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbnZhclxubmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxubmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG5uYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG5uYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxubmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXM7XG5cbl8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG5fLmtleXMgPSBuYXRpdmVLZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqICE9PSBPYmplY3Qob2JqKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvYmplY3QnKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIGtleXM7XG59O1xuXG5fLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn07XG5cbnZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgfVxuICB9XG59O1xuXG5fLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xufTtcblxuXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgfTtcbn0pO1xuXG5pZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICB9O1xufTtcblxuXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbn07XG5cbl8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbn07XG5cbl8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxuXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbn07XG5cbl8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xufTtcblxuXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbl8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5fLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIGlmIChpc1NvcnRlZCkge1xuICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgfVxuICB9XG4gIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG59O1xuXG5fLmlzV2luZG93ID0gZnVuY3Rpb24oIG9iaiApIHsgXG4gICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09IG9iai53aW5kb3c7XG59O1xuXy5pc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24oIG9iaiApIHtcbiAgICAvLyBCZWNhdXNlIG9mIElFLCB3ZSBhbHNvIGhhdmUgdG8gY2hlY2sgdGhlIHByZXNlbmNlIG9mIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eS5cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBET00gbm9kZXMgYW5kIHdpbmRvdyBvYmplY3RzIGRvbid0IHBhc3MgdGhyb3VnaCwgYXMgd2VsbFxuICAgIGlmICggIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iai5ub2RlVHlwZSB8fCBfLmlzV2luZG93KCBvYmogKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gICAgICAgIGlmICggb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgXCJpc1Byb3RvdHlwZU9mXCIpICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIC8vIElFOCw5IFdpbGwgdGhyb3cgZXhjZXB0aW9ucyBvbiBjZXJ0YWluIGhvc3Qgb2JqZWN0cyAjOTg5N1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAgIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICAgIHZhciBrZXk7XG4gICAgZm9yICgga2V5IGluIG9iaiApIHt9XG5cbiAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwoIG9iaiwga2V5ICk7XG59O1xuXG4vKipcbipcbirlpoLmnpzmmK/mt7HluqZleHRlbmTvvIznrKzkuIDkuKrlj4LmlbDlsLHorr7nva7kuLp0cnVlXG4qL1xuXy5leHRlbmQgPSBmdW5jdGlvbigpIHsgIFxuICB2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsICBcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSwgIFxuICAgICAgaSA9IDEsICBcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsICBcbiAgICAgIGRlZXAgPSBmYWxzZTsgIFxuICBpZiAoIHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiICkgeyAgXG4gICAgICBkZWVwID0gdGFyZ2V0OyAgXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307ICBcbiAgICAgIGkgPSAyOyAgXG4gIH07ICBcbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICFfLmlzRnVuY3Rpb24odGFyZ2V0KSApIHsgIFxuICAgICAgdGFyZ2V0ID0ge307ICBcbiAgfTsgIFxuICBpZiAoIGxlbmd0aCA9PT0gaSApIHsgIFxuICAgICAgdGFyZ2V0ID0gdGhpczsgIFxuICAgICAgLS1pOyAgXG4gIH07ICBcbiAgZm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7ICBcbiAgICAgIGlmICggKG9wdGlvbnMgPSBhcmd1bWVudHNbIGkgXSkgIT0gbnVsbCApIHsgIFxuICAgICAgICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucyApIHsgIFxuICAgICAgICAgICAgICBzcmMgPSB0YXJnZXRbIG5hbWUgXTsgIFxuICAgICAgICAgICAgICBjb3B5ID0gb3B0aW9uc1sgbmFtZSBdOyAgXG4gICAgICAgICAgICAgIGlmICggdGFyZ2V0ID09PSBjb3B5ICkgeyAgXG4gICAgICAgICAgICAgICAgICBjb250aW51ZTsgIFxuICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgaWYgKCBkZWVwICYmIGNvcHkgJiYgKCBfLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gXy5pc0FycmF5KGNvcHkpKSApICkgeyAgXG4gICAgICAgICAgICAgICAgICBpZiAoIGNvcHlJc0FycmF5ICkgeyAgXG4gICAgICAgICAgICAgICAgICAgICAgY29weUlzQXJyYXkgPSBmYWxzZTsgIFxuICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIF8uaXNBcnJheShzcmMpID8gc3JjIDogW107ICBcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBfLmlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9OyAgXG4gICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gXy5leHRlbmQoIGRlZXAsIGNsb25lLCBjb3B5ICk7ICBcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkgeyAgXG4gICAgICAgICAgICAgICAgICB0YXJnZXRbIG5hbWUgXSA9IGNvcHk7ICBcbiAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgfSAgXG4gICAgICB9ICBcbiAgfSAgXG4gIHJldHVybiB0YXJnZXQ7ICBcbn07IFxuXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh0cnVlLCB7fSwgb2JqKTtcbn07XG5leHBvcnQgZGVmYXVsdCBfOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tIFxuKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbnZhciBVdGlscyA9IHtcbiAgICBtYWluRnJhbWVSYXRlICAgOiA2MCwvL+m7mOiupOS4u+W4p+eOh1xuICAgIG5vdyA6IDAsXG4gICAgLyrlg4/ntKDmo4DmtYvkuJPnlKgqL1xuICAgIF9waXhlbEN0eCAgIDogbnVsbCxcbiAgICBfX2VtcHR5RnVuYyA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL3JldGluYSDlsY/luZXkvJjljJZcbiAgICBfZGV2aWNlUGl4ZWxSYXRpbyA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgX1VJRCAgOiAwLCAvL+ivpeWAvOS4uuWQkeS4iueahOiHquWinumVv+aVtOaVsOWAvFxuICAgIGdldFVJRDpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fVUlEKys7XG4gICAgfSxcbiAgICBjcmVhdGVJZCA6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgLy9pZiBlbmQgd2l0aCBhIGRpZ2l0LCB0aGVuIGFwcGVuZCBhbiB1bmRlcnNCYXNlIGJlZm9yZSBhcHBlbmRpbmdcbiAgICAgICAgdmFyIGNoYXJDb2RlID0gbmFtZS5jaGFyQ29kZUF0KG5hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmIChjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1NykgbmFtZSArPSBcIl9cIjtcbiAgICAgICAgcmV0dXJuIG5hbWUgKyBVdGlscy5nZXRVSUQoKTtcbiAgICB9LFxuICAgIGNhbnZhc1N1cHBvcnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dDtcbiAgICB9LFxuICAgIGNyZWF0ZU9iamVjdCA6IGZ1bmN0aW9uKCBwcm90byAsIGNvbnN0cnVjdG9yICkge1xuICAgICAgICB2YXIgbmV3UHJvdG87XG4gICAgICAgIHZhciBPYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuICAgICAgICBpZiAoT2JqZWN0Q3JlYXRlKSB7XG4gICAgICAgICAgICBuZXdQcm90byA9IE9iamVjdENyZWF0ZShwcm90byk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBVdGlscy5fX2VtcHR5RnVuYy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgICAgICAgIG5ld1Byb3RvID0gbmV3IFV0aWxzLl9fZW1wdHlGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3UHJvdG8uY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ld1Byb3RvO1xuICAgIH0sXG4gICAgY3JlYXRDbGFzcyA6IGZ1bmN0aW9uKHIsIHMsIHB4KXtcbiAgICAgICAgaWYgKCFzIHx8ICFyKSB7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3AgPSBzLnByb3RvdHlwZSwgcnA7XG4gICAgICAgIC8vIGFkZCBwcm90b3R5cGUgY2hhaW5cbiAgICAgICAgcnAgPSBVdGlscy5jcmVhdGVPYmplY3Qoc3AsIHIpO1xuICAgICAgICByLnByb3RvdHlwZSA9IF8uZXh0ZW5kKHJwLCByLnByb3RvdHlwZSk7XG4gICAgICAgIHIuc3VwZXJjbGFzcyA9IFV0aWxzLmNyZWF0ZU9iamVjdChzcCwgcyk7XG4gICAgICAgIC8vIGFkZCBwcm90b3R5cGUgb3ZlcnJpZGVzXG4gICAgICAgIGlmIChweCkge1xuICAgICAgICAgICAgXy5leHRlbmQocnAsIHB4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9LFxuICAgIGluaXRFbGVtZW50IDogZnVuY3Rpb24oIGNhbnZhcyApe1xuICAgICAgICBpZiggd2luZG93LkZsYXNoQ2FudmFzICYmIEZsYXNoQ2FudmFzLmluaXRFbGVtZW50KXtcbiAgICAgICAgICAgIEZsYXNoQ2FudmFzLmluaXRFbGVtZW50KCBjYW52YXMgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lgZrkuIDmrKHnroDljZXnmoRvcHTlj4LmlbDmoKHpqozvvIzkv53or4HlnKjnlKjmiLfkuI3kvKBvcHTnmoTml7blgJkg5oiW6ICF5Lyg5LqGb3B05L2G5piv6YeM6Z2i5rKh5pyJY29udGV4dOeahOaXtuWAmeaKpemUmVxuICAgIGNoZWNrT3B0ICAgIDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgaWYoICFvcHQgKXtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGV4dCA6IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gICBcbiAgICAgICAgfSBlbHNlIGlmKCBvcHQgJiYgIW9wdC5jb250ZXh0ICkge1xuICAgICAgICAgIG9wdC5jb250ZXh0ID0ge31cbiAgICAgICAgICByZXR1cm4gb3B0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvcHQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOeugOWNleeahOa1heWkjeWItuWvueixoeOAglxuICAgICAqIEBwYXJhbSBzdHJpY3QgIOW9k+S4unRydWXml7blj6ropobnm5blt7LmnInlsZ7mgKdcbiAgICAgKi9cbiAgICBjb3B5MmNvbnRleHQgOiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSwgc3RyaWN0KXsgXG4gICAgICAgIGlmICggXy5pc0VtcHR5KHNvdXJjZSkgKXtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBrZXkgaW4gc291cmNlKXtcbiAgICAgICAgICAgIGlmKCFzdHJpY3QgfHwgdGFyZ2V0Lmhhc093blByb3BlcnR5KGtleSkgfHwgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0sXG5cbiAgICBcbiAgICAvKipcbiAgICAgKiDmjInnhadjc3PnmoTpobrluo/vvIzov5Tlm57kuIDkuKpb5LiKLOWPsyzkuIss5bemXVxuICAgICAqL1xuICAgIGdldENzc09yZGVyQXJyIDogZnVuY3Rpb24oIHIgKXtcbiAgICAgICAgdmFyIHIxOyBcbiAgICAgICAgdmFyIHIyOyBcbiAgICAgICAgdmFyIHIzOyBcbiAgICAgICAgdmFyIHI0O1xuXG4gICAgICAgIGlmKHR5cGVvZiByID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSByO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYociBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBpZiAoci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IHJbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByMyA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByNCA9IHJbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gcjQgPSByWzFdO1xuICAgICAgICAgICAgICAgIHIzID0gclsyXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gclsxXTtcbiAgICAgICAgICAgICAgICByMyA9IHJbMl07XG4gICAgICAgICAgICAgICAgcjQgPSByWzNdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcjEscjIscjMscjRdO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxzOyIsIi8qKlxuICogUG9pbnRcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50XG57XG4gICAgY29uc3RydWN0b3IoIHg9MCAsIHk9MCApXG4gICAge1xuICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aD09MSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09ICdvYmplY3QnICl7XG4gICAgICAgICAgICB2YXIgYXJnPWFyZ3VtZW50c1swXVxuICAgICAgICAgICAgaWYoIFwieFwiIGluIGFyZyAmJiBcInlcIiBpbiBhcmcgKXtcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmcueCoxO1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZy55KjE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpPTA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBhcmcpe1xuICAgICAgICAgICAgICAgICAgICBpZihpPT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ1twXSoxO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gYXJnW3BdKjE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0geCoxO1xuICAgICAgICAgICAgdGhpcy55ID0geSoxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9BcnJheSgpXG4gICAge1xuICAgICAgICByZXR1cm4gW3RoaXMueCAsIHRoaXMueV0gIFxuICAgIH1cbn07XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIGNhbnZhcyDkuIrlp5TmiZjnmoTkuovku7bnrqHnkIZcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIENhbnZheEV2ZW50ID0gZnVuY3Rpb24oIGV2dCAsIHBhcmFtcyApIHtcblx0XG5cdHZhciBldmVudFR5cGUgPSBcIkNhbnZheEV2ZW50XCI7IFxuICAgIGlmKCBfLmlzU3RyaW5nKCBldnQgKSApe1xuICAgIFx0ZXZlbnRUeXBlID0gZXZ0O1xuICAgIH07XG4gICAgaWYoIF8uaXNPYmplY3QoIGV2dCApICYmIGV2dC50eXBlICl7XG4gICAgXHRldmVudFR5cGUgPSBldnQudHlwZTtcbiAgICB9O1xuXG4gICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XHRcbiAgICB0aGlzLnR5cGUgICA9IGV2ZW50VHlwZTtcbiAgICB0aGlzLnBvaW50ICA9IG51bGw7XG5cbiAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb24gPSBmYWxzZSA7IC8v6buY6K6k5LiN6Zi75q2i5LqL5Lu25YaS5rOhXG59XG5DYW52YXhFdmVudC5wcm90b3R5cGUgPSB7XG4gICAgc3RvcFByb3BhZ2F0aW9uIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ2FudmF4RXZlbnQ7IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIC8v6K6+5aSH5YiG6L6o546HXG4gICAgUkVTT0xVVElPTjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcblxuICAgIC8v5riy5p+TRlBTXG4gICAgRlBTOiA2MFxufTtcbiIsImltcG9ydCBfIGZyb20gXCIuL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBzZXR0aW5ncyBmcm9tIFwiLi4vc2V0dGluZ3NcIlxuXG52YXIgYWRkT3JSbW92ZUV2ZW50SGFuZCA9IGZ1bmN0aW9uKCBkb21IYW5kICwgaWVIYW5kICl7XG4gICAgaWYoIGRvY3VtZW50WyBkb21IYW5kIF0gKXtcbiAgICAgICAgZnVuY3Rpb24gZXZlbnREb21GbiggZWwgLCB0eXBlICwgZm4gKXtcbiAgICAgICAgICAgIGlmKCBlbC5sZW5ndGggKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MCA7IGkgPCBlbC5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBldmVudERvbUZuKCBlbFtpXSAsIHR5cGUgLCBmbiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxbIGRvbUhhbmQgXSggdHlwZSAsIGZuICwgZmFsc2UgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGV2ZW50RG9tRm5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jdGlvbiBldmVudEZuKCBlbCAsIHR5cGUgLCBmbiApe1xuICAgICAgICAgICAgaWYoIGVsLmxlbmd0aCApe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wIDsgaSA8IGVsLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4oIGVsW2ldLHR5cGUsZm4gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsWyBpZUhhbmQgXSggXCJvblwiK3R5cGUgLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCggZWwgLCB3aW5kb3cuZXZlbnQgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGV2ZW50Rm5cbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gZG9t5pON5L2c55u45YWz5Luj56CBXG4gICAgcXVlcnkgOiBmdW5jdGlvbihlbCl7XG4gICAgICAgIGlmKF8uaXNTdHJpbmcoZWwpKXtcbiAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsKVxuICAgICAgICB9XG4gICAgICAgIGlmKGVsLm5vZGVUeXBlID09IDEpe1xuICAgICAgICAgICAvL+WImeS4uuS4gOS4qmVsZW1lbnTmnKzouqtcbiAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH1cbiAgICAgICAgaWYoZWwubGVuZ3RoKXtcbiAgICAgICAgICAgcmV0dXJuIGVsWzBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBvZmZzZXQgOiBmdW5jdGlvbihlbCl7XG4gICAgICAgIHZhciBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgXG4gICAgICAgIGRvYyA9IGVsLm93bmVyRG9jdW1lbnQsIFxuICAgICAgICBib2R5ID0gZG9jLmJvZHksIFxuICAgICAgICBkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudCwgXG5cbiAgICAgICAgLy8gZm9yIGllICBcbiAgICAgICAgY2xpZW50VG9wID0gZG9jRWxlbS5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMCwgXG4gICAgICAgIGNsaWVudExlZnQgPSBkb2NFbGVtLmNsaWVudExlZnQgfHwgYm9keS5jbGllbnRMZWZ0IHx8IDAsIFxuXG4gICAgICAgIC8vIEluIEludGVybmV0IEV4cGxvcmVyIDcgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHByb3BlcnR5IGlzIHRyZWF0ZWQgYXMgcGh5c2ljYWwsIFxuICAgICAgICAvLyB3aGlsZSBvdGhlcnMgYXJlIGxvZ2ljYWwuIE1ha2UgYWxsIGxvZ2ljYWwsIGxpa2UgaW4gSUU4LiBcbiAgICAgICAgem9vbSA9IDE7IFxuICAgICAgICBpZiAoYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHsgXG4gICAgICAgICAgICB2YXIgYm91bmQgPSBib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyBcbiAgICAgICAgICAgIHpvb20gPSAoYm91bmQucmlnaHQgLSBib3VuZC5sZWZ0KS9ib2R5LmNsaWVudFdpZHRoOyBcbiAgICAgICAgfSBcbiAgICAgICAgaWYgKHpvb20gPiAxKXsgXG4gICAgICAgICAgICBjbGllbnRUb3AgPSAwOyBcbiAgICAgICAgICAgIGNsaWVudExlZnQgPSAwOyBcbiAgICAgICAgfSBcbiAgICAgICAgdmFyIHRvcCA9IGJveC50b3Avem9vbSArICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jRWxlbSAmJiBkb2NFbGVtLnNjcm9sbFRvcC96b29tIHx8IGJvZHkuc2Nyb2xsVG9wL3pvb20pIC0gY2xpZW50VG9wLCBcbiAgICAgICAgICAgIGxlZnQgPSBib3gubGVmdC96b29tICsgKHdpbmRvdy5wYWdlWE9mZnNldHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5zY3JvbGxMZWZ0L3pvb20gfHwgYm9keS5zY3JvbGxMZWZ0L3pvb20pIC0gY2xpZW50TGVmdDsgXG5cbiAgICAgICAgcmV0dXJuIHsgXG4gICAgICAgICAgICB0b3A6IHRvcCwgXG4gICAgICAgICAgICBsZWZ0OiBsZWZ0IFxuICAgICAgICB9OyBcbiAgICB9LFxuICAgIGFkZEV2ZW50IDogYWRkT3JSbW92ZUV2ZW50SGFuZCggXCJhZGRFdmVudExpc3RlbmVyXCIgLCBcImF0dGFjaEV2ZW50XCIgKSxcbiAgICByZW1vdmVFdmVudCA6IGFkZE9yUm1vdmVFdmVudEhhbmQoIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiICwgXCJkZXRhY2hFdmVudFwiICksXG4gICAgcGFnZVg6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGFnZVgpIHJldHVybiBlLnBhZ2VYO1xuICAgICAgICBlbHNlIGlmIChlLmNsaWVudFgpXG4gICAgICAgICAgICByZXR1cm4gZS5jbGllbnRYICsgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0ID9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgOiBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpO1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcGFnZVk6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGFnZVkpIHJldHVybiBlLnBhZ2VZO1xuICAgICAgICBlbHNlIGlmIChlLmNsaWVudFkpXG4gICAgICAgICAgICByZXR1cm4gZS5jbGllbnRZICsgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgP1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIDogZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApO1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yib5bu6ZG9tXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIGRvbSBpZCDlvoXnlKhcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSA6IGRvbSB0eXBl77yMIHN1Y2ggYXMgY2FudmFzLCBkaXYgZXRjLlxuICAgICAqL1xuICAgIGNyZWF0ZUNhbnZhcyA6IGZ1bmN0aW9uKCBfd2lkdGggLCBfaGVpZ2h0ICwgaWQpIHtcbiAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSBfd2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gX2hlaWdodCArICdweCc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5sZWZ0ICAgPSAwO1xuICAgICAgICBjYW52YXMuc3R5bGUudG9wICAgID0gMDtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBfd2lkdGggKiBzZXR0aW5ncy5SRVNPTFVUSU9OKTtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgX2hlaWdodCAqIHNldHRpbmdzLlJFU09MVVRJT04pO1xuICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICB9LFxuICAgIGNyZWF0ZVZpZXc6IGZ1bmN0aW9uKF93aWR0aCAsIF9oZWlnaHQsIGlkKXtcbiAgICAgICAgdmFyIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2aWV3LmNsYXNzTmFtZSA9IFwiY2FudmF4LXZpZXdcIjtcbiAgICAgICAgdmlldy5zdHlsZS5jc3NUZXh0ICs9IFwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6XCIgKyBfd2lkdGggKyBcInB4O2hlaWdodDpcIiArIF9oZWlnaHQgK1wicHg7XCJcblxuICAgICAgICB2YXIgc3RhZ2VfYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOmFic29sdXRlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgLy/nlKjmnaXlrZjmlL7kuIDkuptkb23lhYPntKBcbiAgICAgICAgdmFyIGRvbV9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5zdHlsZS5jc3NUZXh0ICs9IFwicG9zaXRpb246YWJzb2x1dGU7d2lkdGg6XCIgKyBfd2lkdGggKyBcInB4O2hlaWdodDpcIiArIF9oZWlnaHQgK1wicHg7XCJcblxuICAgICAgICB2aWV3LmFwcGVuZENoaWxkKHN0YWdlX2MpO1xuICAgICAgICB2aWV3LmFwcGVuZENoaWxkKGRvbV9jKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2aWV3IDogdmlldyxcbiAgICAgICAgICAgIHN0YWdlX2M6IHN0YWdlX2MsXG4gICAgICAgICAgICBkb21fYzogZG9tX2NcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL2RvbeebuOWFs+S7o+eggee7k+adn1xufTsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKi9cbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vZGlzcGxheS9Qb2ludFwiO1xuaW1wb3J0IENhbnZheEV2ZW50IGZyb20gXCIuL0NhbnZheEV2ZW50XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0ICQgZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuXG52YXIgX21vdXNlRXZlbnRUeXBlcyA9IFtcImNsaWNrXCIsXCJkYmxjbGlja1wiLFwibW91c2Vkb3duXCIsXCJtb3VzZW1vdmVcIixcIm1vdXNldXBcIixcIm1vdXNlb3V0XCJdO1xudmFyIF9oYW1tZXJFdmVudFR5cGVzID0gWyBcbiAgICBcInBhblwiLFwicGFuc3RhcnRcIixcInBhbm1vdmVcIixcInBhbmVuZFwiLFwicGFuY2FuY2VsXCIsXCJwYW5sZWZ0XCIsXCJwYW5yaWdodFwiLFwicGFudXBcIixcInBhbmRvd25cIixcbiAgICBcInByZXNzXCIgLCBcInByZXNzdXBcIixcbiAgICBcInN3aXBlXCIgLCBcInN3aXBlbGVmdFwiICwgXCJzd2lwZXJpZ2h0XCIgLCBcInN3aXBldXBcIiAsIFwic3dpcGVkb3duXCIsXG4gICAgXCJ0YXBcIlxuXTtcblxudmFyIEV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGNhbnZheCAsIG9wdCkge1xuICAgIHRoaXMuY2FudmF4ID0gY2FudmF4O1xuXG4gICAgdGhpcy5jdXJQb2ludHMgPSBbbmV3IFBvaW50KDAsIDApXSAvL1gsWSDnmoQgcG9pbnQg6ZuG5ZCILCDlnKh0b3VjaOS4i+mdouWImeS4uiB0b3VjaOeahOmbhuWQiO+8jOWPquaYr+i/meS4qnRvdWNo6KKr5re75Yqg5LqG5a+55bqU55qEeO+8jHlcbiAgICAvL+W9k+WJjea/gOa0u+eahOeCueWvueW6lOeahG9iau+8jOWcqHRvdWNo5LiL5Y+v5Lul5piv5Liq5pWw57uELOWSjOS4iumdoueahCBjdXJQb2ludHMg5a+55bqUXG4gICAgdGhpcy5jdXJQb2ludHNUYXJnZXQgPSBbXTtcblxuICAgIHRoaXMuX3RvdWNoaW5nID0gZmFsc2U7XG4gICAgLy/mraPlnKjmi5bliqjvvIzliY3mj5DmmK9fdG91Y2hpbmc9dHJ1ZVxuICAgIHRoaXMuX2RyYWdpbmcgPSBmYWxzZTtcblxuICAgIC8v5b2T5YmN55qE6byg5qCH54q25oCBXG4gICAgdGhpcy5fY3Vyc29yID0gXCJkZWZhdWx0XCI7XG5cbiAgICB0aGlzLnRhcmdldCA9IHRoaXMuY2FudmF4LnZpZXc7XG4gICAgdGhpcy50eXBlcyA9IFtdO1xuXG4gICAgLy9tb3VzZeS9k+e7n+S4reS4jemcgOimgemFjee9rmRyYWcsdG91Y2jkuK3kvJrnlKjliLDnrKzkuInmlrnnmoR0b3VjaOW6k++8jOavj+S4quW6k+eahOS6i+S7tuWQjeensOWPr+iDveS4jeS4gOagt++8jFxuICAgIC8v5bCx6KaB6L+Z6YeM6YWN572u77yM6buY6K6k5a6e546w55qE5pivaGFtbWVyanPnmoQs5omA5Lul6buY6K6k5Y+v5Lul5Zyo6aG555uu6YeM5byV5YWlaGFtbWVyanMgaHR0cDovL2hhbW1lcmpzLmdpdGh1Yi5pby9cbiAgICB0aGlzLmRyYWcgPSB7XG4gICAgICAgIHN0YXJ0IDogXCJwYW5zdGFydFwiLFxuICAgICAgICBtb3ZlIDogXCJwYW5tb3ZlXCIsXG4gICAgICAgIGVuZCA6IFwicGFuZW5kXCJcbiAgICB9O1xuXG4gICAgXy5leHRlbmQoIHRydWUgLCB0aGlzICwgb3B0ICk7XG5cbn07XG5cbi8v6L+Z5qC355qE5aW95aSE5pivZG9jdW1lbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb27lj6rkvJrlnKjlrprkuYnnmoTml7blgJnmiafooYzkuIDmrKHjgIJcbnZhciBjb250YWlucyA9IGRvY3VtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICBpZiggIWNoaWxkICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICEhKHBhcmVudC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihjaGlsZCkgJiAxNik7XG59IDogZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICBpZiggIWNoaWxkICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkICE9PSBjaGlsZCAmJiAocGFyZW50LmNvbnRhaW5zID8gcGFyZW50LmNvbnRhaW5zKGNoaWxkKSA6IHRydWUpO1xufTtcblxuRXZlbnRIYW5kbGVyLnByb3RvdHlwZSA9IHtcbiAgICBpbml0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIC8v5L6d5qyh5re75Yqg5LiK5rWP6KeI5Zmo55qE6Ieq5bim5LqL5Lu25L6m5ZCsXG4gICAgICAgIHZhciBtZSAgID0gdGhpcztcbiAgICAgICAgaWYoIG1lLnRhcmdldC5ub2RlVHlwZSA9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIC8v5aaC5p6cdGFyZ2V0Lm5vZGVUeXBl5rKh5pyJ55qE6K+d77yMIOivtOaYjuivpXRhcmdldOS4uuS4gOS4qmpRdWVyeeWvueixoSBvciBraXNzeSDlr7nosaFvciBoYW1tZXLlr7nosaFcbiAgICAgICAgICAgIC8v5Y2z5Li656ys5LiJ5pa55bqT77yM6YKj5LmI5bCx6KaB5a+55o6l56ys5LiJ5pa55bqT55qE5LqL5Lu257O757uf44CC6buY6K6k5a6e546waGFtbWVy55qE5aSn6YOo5YiG5LqL5Lu257O757ufXG4gICAgICAgICAgICBpZiggIW1lLnR5cGVzIHx8IG1lLnR5cGVzLmxlbmd0aCA9PSAwICApe1xuICAgICAgICAgICAgICAgIG1lLnR5cGVzID0gX2hhbW1lckV2ZW50VHlwZXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYoIG1lLnRhcmdldC5ub2RlVHlwZSA9PSAxICl7XG4gICAgICAgICAgICBtZS50eXBlcyA9IF9tb3VzZUV2ZW50VHlwZXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgXy5lYWNoKCBtZS50eXBlcyAsIGZ1bmN0aW9uKCB0eXBlICl7XG4gICAgICAgICAgICAvL+S4jeWGjeWFs+W/g+a1j+iniOWZqOeOr+Wig+aYr+WQpiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgXG4gICAgICAgICAgICAvL+iAjOaYr+ebtOaOpeWPqueuoeS8oOe7meS6i+S7tuaooeWdl+eahOaYr+S4gOS4quWOn+eUn2Rvbei/mOaYryBqceWvueixoSBvciBoYW1tZXLlr7nosaHnrYlcbiAgICAgICAgICAgIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gMSApe1xuICAgICAgICAgICAgICAgICQuYWRkRXZlbnQoIG1lLnRhcmdldCAsIHR5cGUgLCBmdW5jdGlvbiggZSApe1xuICAgICAgICAgICAgICAgICAgICBtZS5fX21vdXNlSGFuZGxlciggZSApO1xuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWUudGFyZ2V0Lm9uKCB0eXBlICwgZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgbWUuX19saWJIYW5kbGVyKCBlICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9ICk7XG4gICAgfSxcbiAgICAvKlxuICAgICog5Y6f55Sf5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYmVnaW5cbiAgICAqIOm8oOagh+S6i+S7tuWkhOeQhuWHveaVsFxuICAgICoqL1xuICAgIF9fbW91c2VIYW5kbGVyIDogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcblxuICAgICAgICByb290LnVwZGF0ZVZpZXdPZmZzZXQoKTtcbiAgICBcbiAgICAgICAgbWUuY3VyUG9pbnRzID0gWyBuZXcgUG9pbnQoIFxuICAgICAgICAgICAgJC5wYWdlWCggZSApIC0gcm9vdC52aWV3T2Zmc2V0LmxlZnQgLCBcbiAgICAgICAgICAgICQucGFnZVkoIGUgKSAtIHJvb3Qudmlld09mZnNldC50b3BcbiAgICAgICAgKV07XG5cbiAgICAgICAgLy/nkIborrrkuIrmnaXor7TvvIzov5nph4zmi7/liLBwb2ludOS6huWQju+8jOWwseimgeiuoeeul+i/meS4qnBvaW505a+55bqU55qEdGFyZ2V05p2lcHVzaOWIsGN1clBvaW50c1RhcmdldOmHjO+8jFxuICAgICAgICAvL+S9huaYr+WboOS4uuWcqGRyYWfnmoTml7blgJnlhbblrp7mmK/lj6/ku6XkuI3nlKjorqHnrpflr7nlupR0YXJnZXTnmoTjgIJcbiAgICAgICAgLy/miYDku6XmlL7lnKjkuobkuIvpnaLnmoRtZS5fX2dldGN1clBvaW50c1RhcmdldCggZSAsIGN1ck1vdXNlUG9pbnQgKTvluLjop4Rtb3VzZW1vdmXkuK3miafooYxcblxuICAgICAgICB2YXIgY3VyTW91c2VQb2ludCAgPSBtZS5jdXJQb2ludHNbMF07IFxuICAgICAgICB2YXIgY3VyTW91c2VUYXJnZXQgPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG5cbiAgICAgICAgLy/mqKHmi59kcmFnLG1vdXNlb3Zlcixtb3VzZW91dCDpg6jliIbku6PnoIEgYmVnaW4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLy9tb3VzZWRvd27nmoTml7blgJkg5aaC5p6cIGN1ck1vdXNlVGFyZ2V0LmRyYWdFbmFibGVkIOS4unRydWXjgILlsLHopoHlvIDlp4vlh4blpIdkcmFn5LqGXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZWRvd25cIiApe1xuICAgICAgICAgICAvL+WmguaenGN1clRhcmdldCDnmoTmlbDnu4TkuLrnqbrmiJbogIXnrKzkuIDkuKrkuLpmYWxzZSDvvIzvvIzvvIxcbiAgICAgICAgICAgaWYoICFjdXJNb3VzZVRhcmdldCApe1xuICAgICAgICAgICAgIHZhciBvYmogPSByb290LmdldE9iamVjdHNVbmRlclBvaW50KCBjdXJNb3VzZVBvaW50ICwgMSlbMF07XG4gICAgICAgICAgICAgaWYob2JqKXtcbiAgICAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldCA9IFsgb2JqIF07XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICB9O1xuICAgICAgICAgICBjdXJNb3VzZVRhcmdldCA9IG1lLmN1clBvaW50c1RhcmdldFswXTtcbiAgICAgICAgICAgaWYgKCBjdXJNb3VzZVRhcmdldCAmJiBjdXJNb3VzZVRhcmdldC5kcmFnRW5hYmxlZCApe1xuICAgICAgICAgICAgICAgLy/pvKDmoIfkuovku7blt7Lnu4/mkbjliLDkuobkuIDkuKpcbiAgICAgICAgICAgICAgIG1lLl90b3VjaGluZyA9IHRydWU7XG4gICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNldXBcIiB8fCAoZS50eXBlID09IFwibW91c2VvdXRcIiAmJiAhY29udGFpbnMocm9vdC52aWV3ICwgKGUudG9FbGVtZW50IHx8IGUucmVsYXRlZFRhcmdldCkgKSkgKXtcbiAgICAgICAgICAgIGlmKG1lLl9kcmFnaW5nID09IHRydWUpe1xuICAgICAgICAgICAgICAgIC8v6K+05piO5Yia5Yia5Zyo5ouW5YqoXG4gICAgICAgICAgICAgICAgbWUuX2RyYWdFbmQoIGUgLCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5maXJlKFwiZHJhZ2VuZFwiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5fZHJhZ2luZyAgPSBmYWxzZTtcbiAgICAgICAgICAgIG1lLl90b3VjaGluZyA9IGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZW91dFwiICl7XG4gICAgICAgICAgICBpZiggIWNvbnRhaW5zKHJvb3QudmlldyAsIChlLnRvRWxlbWVudCB8fCBlLnJlbGF0ZWRUYXJnZXQpICkgKXtcbiAgICAgICAgICAgICAgICBtZS5fX2dldGN1clBvaW50c1RhcmdldChlICwgY3VyTW91c2VQb2ludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggZS50eXBlID09IFwibW91c2Vtb3ZlXCIgKXsgIC8vfHwgZS50eXBlID09IFwibW91c2Vkb3duXCIgKXtcbiAgICAgICAgICAgIC8v5ouW5Yqo6L+H56iL5Lit5bCx5LiN5Zyo5YGa5YW25LuW55qEbW91c2VvdmVy5qOA5rWL77yMZHJhZ+S8mOWFiFxuICAgICAgICAgICAgaWYobWUuX3RvdWNoaW5nICYmIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICYmIGN1ck1vdXNlVGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuato+WcqOaLluWKqOWVilxuICAgICAgICAgICAgICAgIGlmKCFtZS5fZHJhZ2luZyl7XG4gICAgICAgICAgICAgICAgICAgIC8vYmVnaW4gZHJhZ1xuICAgICAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5maXJlKFwiZHJhZ3N0YXJ0XCIpO1xuICAgICAgICAgICAgICAgICAgICAvL+WFiOaKiuacrOWwiue7memakOiXj+S6hlxuICAgICAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5jb250ZXh0Lmdsb2JhbEFscGhhID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7lhYvpmobkuIDkuKrlia/mnKzliLBhY3RpdmVTdGFnZVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lT2JqZWN0ID0gbWUuX2Nsb25lMmhvdmVyU3RhZ2UoIGN1ck1vdXNlVGFyZ2V0ICwgMCApO1xuICAgICAgICAgICAgICAgICAgICBjbG9uZU9iamVjdC5jb250ZXh0Lmdsb2JhbEFscGhhID0gY3VyTW91c2VUYXJnZXQuX2dsb2JhbEFscGhhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZHJhZyBtb3ZlIGluZ1xuICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ01vdmVIYW5kZXIoIGUgLCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/luLjop4Rtb3VzZW1vdmXmo4DmtYtcbiAgICAgICAgICAgICAgICAvL21vdmXkuovku7bkuK3vvIzpnIDopoHkuI3lgZznmoTmkJzntKJ0YXJnZXTvvIzov5nkuKrlvIDplIDmjLrlpKfvvIxcbiAgICAgICAgICAgICAgICAvL+WQjue7reWPr+S7peS8mOWMlu+8jOWKoOS4iuWSjOW4p+eOh+ebuOW9k+eahOW7tui/n+WkhOeQhlxuICAgICAgICAgICAgICAgIG1lLl9fZ2V0Y3VyUG9pbnRzVGFyZ2V0KCBlICwgY3VyTW91c2VQb2ludCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WFtuS7lueahOS6i+S7tuWwseebtOaOpeWcqHRhcmdldOS4iumdoua0vuWPkeS6i+S7tlxuICAgICAgICAgICAgdmFyIGNoaWxkID0gY3VyTW91c2VUYXJnZXQ7XG4gICAgICAgICAgICBpZiggIWNoaWxkICl7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSByb290O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lLl9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzKCBlICwgWyBjaGlsZCBdICk7XG4gICAgICAgICAgICBtZS5fY3Vyc29ySGFuZGVyKCBjaGlsZCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCByb290LnByZXZlbnREZWZhdWx0ICkge1xuICAgICAgICAgICAgLy/pmLvmraLpu5jorqTmtY/op4jlmajliqjkvZwoVzNDKSBcbiAgICAgICAgICAgIGlmICggZSAmJiBlLnByZXZlbnREZWZhdWx0ICkge1xuICAgICAgICAgICAgICAgwqBlLnByZXZlbnREZWZhdWx0KCk7IFxuICAgICAgICAgICAgfcKgZWxzZSB7XG4gICAgICAgICAgICDCoMKgwqDCoHdpbmRvdy5ldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9OyBcbiAgICB9LFxuICAgIF9fZ2V0Y3VyUG9pbnRzVGFyZ2V0IDogZnVuY3Rpb24oZSAsIHBvaW50ICkge1xuICAgICAgICB2YXIgbWUgICAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgICA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIG9sZE9iaiA9IG1lLmN1clBvaW50c1RhcmdldFswXTtcblxuICAgICAgICBpZiggb2xkT2JqICYmICFvbGRPYmouY29udGV4dCApe1xuICAgICAgICAgICAgb2xkT2JqID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZSA9IG5ldyBDYW52YXhFdmVudCggZSApO1xuXG4gICAgICAgIGlmKCBlLnR5cGU9PVwibW91c2Vtb3ZlXCJcbiAgICAgICAgICAgICYmIG9sZE9iaiAmJiBvbGRPYmouX2hvdmVyQ2xhc3MgJiYgb2xkT2JqLnBvaW50Q2hrUHJpb3JpdHlcbiAgICAgICAgICAgICYmIG9sZE9iai5nZXRDaGlsZEluUG9pbnQoIHBvaW50ICkgKXtcbiAgICAgICAgICAgIC8v5bCP5LyY5YyWLOm8oOagh21vdmXnmoTml7blgJnjgILorqHnrpfpopHnjoflpKrlpKfvvIzmiYDku6XjgILlgZrmraTkvJjljJZcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJdGFyZ2V05a2Y5Zyo77yM6ICM5LiU5b2T5YmN5YWD57Sg5q2j5ZyoaG92ZXJTdGFnZeS4re+8jOiAjOS4lOW9k+WJjem8oOagh+i/mOWcqHRhcmdldOWGhSzlsLHmsqHlv4XopoHlj5bmo4DmtYvmlbTkuKpkaXNwbGF5TGlzdOS6hlxuICAgICAgICAgICAgLy/lvIDlj5HmtL7lj5HluLjop4Rtb3VzZW1vdmXkuovku7ZcbiAgICAgICAgICAgIGUudGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgZS5wb2ludCAgPSBvbGRPYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgIG9sZE9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvYmogPSByb290LmdldE9iamVjdHNVbmRlclBvaW50KCBwb2ludCAsIDEpWzBdO1xuXG4gICAgICAgIGlmKG9sZE9iaiAmJiBvbGRPYmogIT0gb2JqIHx8IGUudHlwZT09XCJtb3VzZW91dFwiKSB7XG4gICAgICAgICAgICBpZiggb2xkT2JqICYmIG9sZE9iai5jb250ZXh0ICl7XG4gICAgICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0WzBdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBlLnR5cGUgICAgID0gXCJtb3VzZW91dFwiO1xuICAgICAgICAgICAgICAgIGUudG9UYXJnZXQgPSBvYmo7IFxuICAgICAgICAgICAgICAgIGUudGFyZ2V0ICAgPSBlLmN1cnJlbnRUYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICAgICAgZS5wb2ludCAgICA9IG9sZE9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgICAgIG9sZE9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIG9iaiAmJiBvbGRPYmogIT0gb2JqICl7IC8vJiYgb2JqLl9ob3ZlcmFibGUg5bey57uPIOW5suaOieS6hlxuICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0WzBdID0gb2JqO1xuICAgICAgICAgICAgZS50eXBlICAgICAgID0gXCJtb3VzZW92ZXJcIjtcbiAgICAgICAgICAgIGUuZnJvbVRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUudGFyZ2V0ICAgICA9IGUuY3VycmVudFRhcmdldCA9IG9iajtcbiAgICAgICAgICAgIGUucG9pbnQgICAgICA9IG9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgb2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2Vtb3ZlXCIgJiYgb2JqICl7XG4gICAgICAgICAgICBlLnRhcmdldCA9IGUuY3VycmVudFRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUucG9pbnQgID0gb2xkT2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICB9O1xuICAgICAgICBtZS5fY3Vyc29ySGFuZGVyKCBvYmogLCBvbGRPYmogKTtcbiAgICB9LFxuICAgIF9jdXJzb3JIYW5kZXIgICAgOiBmdW5jdGlvbiggb2JqICwgb2xkT2JqICl7XG4gICAgICAgIGlmKCFvYmogJiYgIW9sZE9iaiApe1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmogJiYgb2xkT2JqICE9IG9iaiAmJiBvYmouY29udGV4dCl7XG4gICAgICAgICAgICB0aGlzLl9zZXRDdXJzb3Iob2JqLmNvbnRleHQuY3Vyc29yKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX3NldEN1cnNvciA6IGZ1bmN0aW9uKGN1cnNvcikge1xuICAgICAgICBpZih0aGlzLl9jdXJzb3IgPT0gY3Vyc29yKXtcbiAgICAgICAgICAvL+WmguaenOS4pOasoeimgeiuvue9rueahOm8oOagh+eKtuaAgeaYr+S4gOagt+eahFxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXgudmlldy5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgICAgIHRoaXMuX2N1cnNvciA9IGN1cnNvcjtcbiAgICB9LFxuICAgIC8qXG4gICAgKiDljp/nlJ/kuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbmRcbiAgICAqL1xuXG4gICAgLypcbiAgICAgKuesrOS4ieaWueW6k+eahOS6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWJlZ2luXG4gICAgICrop6blsY/kuovku7blpITnkIblh73mlbBcbiAgICAgKiAqL1xuICAgIF9fbGliSGFuZGxlciA6IGZ1bmN0aW9uKCBlICkge1xuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICByb290LnVwZGF0ZVZpZXdPZmZzZXQoKTtcbiAgICAgICAgLy8gdG91Y2gg5LiL55qEIGN1clBvaW50c1RhcmdldCDku450b3VjaGVz5Lit5p2lXG4gICAgICAgIC8v6I635Y+WY2FudmF45Z2Q5qCH57O757uf6YeM6Z2i55qE5Z2Q5qCHXG4gICAgICAgIG1lLmN1clBvaW50cyA9IG1lLl9fZ2V0Q2FudmF4UG9pbnRJblRvdWNocyggZSApO1xuICAgICAgICBpZiggIW1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAvL+WmguaenOWcqGRyYWdpbmfnmoTor53vvIx0YXJnZXTlt7Lnu4/mmK/pgInkuK3kuobnmoTvvIzlj6/ku6XkuI3nlKgg5qOA5rWL5LqGXG4gICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXQgPSBtZS5fX2dldENoaWxkSW5Ub3VjaHMoIG1lLmN1clBvaW50cyApO1xuICAgICAgICB9O1xuICAgICAgICBpZiggbWUuY3VyUG9pbnRzVGFyZ2V0Lmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICAgIC8vZHJhZ+W8gOWni1xuICAgICAgICAgICAgaWYoIGUudHlwZSA9PSBtZS5kcmFnLnN0YXJ0KXtcbiAgICAgICAgICAgICAgICAvL2RyYWdzdGFydOeahOaXtuWAmXRvdWNo5bey57uP5YeG5aSH5aW95LqGdGFyZ2V077yMIGN1clBvaW50c1RhcmdldCDph4zpnaLlj6ropoHmnInkuIDkuKrmmK/mnInmlYjnmoRcbiAgICAgICAgICAgICAgICAvL+WwseiupOS4umRyYWdz5byA5aeLXG4gICAgICAgICAgICAgICAgXy5lYWNoKCBtZS5jdXJQb2ludHNUYXJnZXQgLCBmdW5jdGlvbiggY2hpbGQgLCBpICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZCAmJiBjaGlsZC5kcmFnRW5hYmxlZCApe1xuICAgICAgICAgICAgICAgICAgICAgICAvL+WPquimgeacieS4gOS4quWFg+e0oOWwseiupOS4uuato+WcqOWHhuWkh2RyYWfkuoZcbiAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjuWFi+mahuS4gOS4quWJr+acrOWIsGFjdGl2ZVN0YWdlXG4gICAgICAgICAgICAgICAgICAgICAgIG1lLl9jbG9uZTJob3ZlclN0YWdlKCBjaGlsZCAsIGkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/lhYjmiormnKzlsIrnu5npmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZmlyZShcImRyYWdzdGFydFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICkgXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2RyYWdJbmdcbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5tb3ZlKXtcbiAgICAgICAgICAgICAgICBpZiggbWUuX2RyYWdpbmcgKXtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKCBtZS5jdXJQb2ludHNUYXJnZXQgLCBmdW5jdGlvbiggY2hpbGQgLCBpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQgJiYgY2hpbGQuZHJhZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnTW92ZUhhbmRlciggZSAsIGNoaWxkICwgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vZHJhZ+e7k+adn1xuICAgICAgICAgICAgaWYoIGUudHlwZSA9PSBtZS5kcmFnLmVuZCl7XG4gICAgICAgICAgICAgICAgaWYoIG1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkICYmIGNoaWxkLmRyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdFbmQoIGUgLCBjaGlsZCAsIDAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5maXJlKFwiZHJhZ2VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIG1lLmN1clBvaW50c1RhcmdldCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/lpoLmnpzlvZPliY3msqHmnInkuIDkuKp0YXJnZXTvvIzlsLHmiorkuovku7bmtL7lj5HliLBjYW52YXjkuIrpnaJcbiAgICAgICAgICAgIG1lLl9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzKCBlICwgWyByb290IF0gKTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8v5LuOdG91Y2hz5Lit6I635Y+W5Yiw5a+55bqUdG91Y2ggLCDlnKjkuIrpnaLmt7vliqDkuIpjYW52YXjlnZDmoIfns7vnu5/nmoR477yMeVxuICAgIF9fZ2V0Q2FudmF4UG9pbnRJblRvdWNocyA6IGZ1bmN0aW9uKCBlICl7XG4gICAgICAgIHZhciBtZSAgICAgICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCAgICAgID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgY3VyVG91Y2hzID0gW107XG4gICAgICAgIF8uZWFjaCggZS5wb2ludCAsIGZ1bmN0aW9uKCB0b3VjaCApe1xuICAgICAgICAgICBjdXJUb3VjaHMucHVzaCgge1xuICAgICAgICAgICAgICAgeCA6IENhbnZheEV2ZW50LnBhZ2VYKCB0b3VjaCApIC0gcm9vdC52aWV3T2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICAgICB5IDogQ2FudmF4RXZlbnQucGFnZVkoIHRvdWNoICkgLSByb290LnZpZXdPZmZzZXQudG9wXG4gICAgICAgICAgIH0gKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjdXJUb3VjaHM7XG4gICAgfSxcbiAgICBfX2dldENoaWxkSW5Ub3VjaHMgOiBmdW5jdGlvbiggdG91Y2hzICl7XG4gICAgICAgIHZhciBtZSAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciB0b3VjaGVzVGFyZ2V0ID0gW107XG4gICAgICAgIF8uZWFjaCggdG91Y2hzICwgZnVuY3Rpb24odG91Y2gpe1xuICAgICAgICAgICAgdG91Y2hlc1RhcmdldC5wdXNoKCByb290LmdldE9iamVjdHNVbmRlclBvaW50KCB0b3VjaCAsIDEpWzBdICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuIHRvdWNoZXNUYXJnZXQ7XG4gICAgfSxcbiAgICAvKlxuICAgICrnrKzkuInmlrnlupPnmoTkuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICovXG5cblxuICAgIC8qXG4gICAgICpAcGFyYW0ge2FycmF5fSBjaGlsZHMgXG4gICAgICogKi9cbiAgICBfX2Rpc3BhdGNoRXZlbnRJbkNoaWxkczogZnVuY3Rpb24oZSwgY2hpbGRzKSB7XG4gICAgICAgIGlmICghY2hpbGRzICYmICEoXCJsZW5ndGhcIiBpbiBjaGlsZHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIGhhc0NoaWxkID0gZmFsc2U7XG4gICAgICAgIF8uZWFjaChjaGlsZHMsIGZ1bmN0aW9uKGNoaWxkLCBpKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBoYXNDaGlsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGNlID0gbmV3IENhbnZheEV2ZW50KGUpO1xuICAgICAgICAgICAgICAgIGNlLnRhcmdldCA9IGNlLmN1cnJlbnRUYXJnZXQgPSBjaGlsZCB8fCB0aGlzO1xuICAgICAgICAgICAgICAgIGNlLnN0YWdlUG9pbnQgPSBtZS5jdXJQb2ludHNbaV07XG4gICAgICAgICAgICAgICAgY2UucG9pbnQgPSBjZS50YXJnZXQuZ2xvYmFsVG9Mb2NhbChjZS5zdGFnZVBvaW50KTtcbiAgICAgICAgICAgICAgICBjaGlsZC5kaXNwYXRjaEV2ZW50KGNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBoYXNDaGlsZDtcbiAgICB9LFxuICAgIC8v5YWL6ZqG5LiA5Liq5YWD57Sg5YiwaG92ZXIgc3RhZ2XkuK3ljrtcbiAgICBfY2xvbmUyaG92ZXJTdGFnZTogZnVuY3Rpb24odGFyZ2V0LCBpKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgX2RyYWdEdXBsaWNhdGUgPSByb290Ll9idWZmZXJTdGFnZS5nZXRDaGlsZEJ5SWQodGFyZ2V0LmlkKTtcbiAgICAgICAgaWYgKCFfZHJhZ0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgX2RyYWdEdXBsaWNhdGUgPSB0YXJnZXQuY2xvbmUodHJ1ZSk7XG4gICAgICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5fdHJhbnNmb3JtID0gdGFyZ2V0LmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqVE9ETzog5Zug5Li65ZCO57ut5Y+v6IO95Lya5pyJ5omL5Yqo5re75Yqg55qEIOWFg+e0oOWIsF9idWZmZXJTdGFnZSDph4zpnaLmnaVcbiAgICAgICAgICAgICAq5q+U5aaCdGlwc1xuICAgICAgICAgICAgICrov5nnsbvmiYvliqjmt7vliqDov5vmnaXnmoTogq/lrprmmK/lm6DkuLrpnIDopoHmmL7npLrlnKjmnIDlpJblsYLnmoTjgILlnKhob3ZlcuWFg+e0oOS5i+S4iuOAglxuICAgICAgICAgICAgICrmiYDmnInoh6rliqjmt7vliqDnmoRob3ZlcuWFg+e0oOmDvem7mOiupOa3u+WKoOWcqF9idWZmZXJTdGFnZeeahOacgOW6leWxglxuICAgICAgICAgICAgICoqL1xuICAgICAgICAgICAgcm9vdC5fYnVmZmVyU3RhZ2UuYWRkQ2hpbGRBdChfZHJhZ0R1cGxpY2F0ZSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRhcmdldC5fZ2xvYmFsQWxwaGE7XG4gICAgICAgIHRhcmdldC5fZHJhZ1BvaW50ID0gdGFyZ2V0Lmdsb2JhbFRvTG9jYWwobWUuY3VyUG9pbnRzW2ldKTtcbiAgICAgICAgcmV0dXJuIF9kcmFnRHVwbGljYXRlO1xuICAgIH0sXG4gICAgLy9kcmFnIOS4rSDnmoTlpITnkIblh73mlbBcbiAgICBfZHJhZ01vdmVIYW5kZXI6IGZ1bmN0aW9uKGUsIHRhcmdldCwgaSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIF9wb2ludCA9IHRhcmdldC5nbG9iYWxUb0xvY2FsKCBtZS5jdXJQb2ludHNbaV0gKTtcblxuICAgICAgICAvL+imgeWvueW6lOeahOS/ruaUueacrOWwiueahOS9jee9ru+8jOS9huaYr+imgeWRiuivieW8leaTjuS4jeimgXdhdGNo6L+Z5Liq5pe25YCZ55qE5Y+Y5YyWXG4gICAgICAgIHRhcmdldC5fbm90V2F0Y2ggPSB0cnVlO1xuICAgICAgICB2YXIgX21vdmVTdGFnZSA9IHRhcmdldC5tb3ZlaW5nO1xuICAgICAgICB0YXJnZXQubW92ZWluZyA9IHRydWU7XG4gICAgICAgIHRhcmdldC5jb250ZXh0LnggKz0gKF9wb2ludC54IC0gdGFyZ2V0Ll9kcmFnUG9pbnQueCk7XG4gICAgICAgIHRhcmdldC5jb250ZXh0LnkgKz0gKF9wb2ludC55IC0gdGFyZ2V0Ll9kcmFnUG9pbnQueSk7XG4gICAgICAgIHRhcmdldC5maXJlKFwiZHJhZ21vdmVcIik7XG4gICAgICAgIHRhcmdldC5tb3ZlaW5nID0gX21vdmVTdGFnZTtcbiAgICAgICAgdGFyZ2V0Ll9ub3RXYXRjaCA9IGZhbHNlO1xuICAgICAgICAvL+WQjOatpeWujOavleacrOWwiueahOS9jee9rlxuXG4gICAgICAgIC8v6L+Z6YeM5Y+q6IO955u05o6l5L+u5pS5X3RyYW5zZm9ybSDjgIIg5LiN6IO955So5LiL6Z2i55qE5L+u5pS5eO+8jHnnmoTmlrnlvI/jgIJcbiAgICAgICAgdmFyIF9kcmFnRHVwbGljYXRlID0gcm9vdC5fYnVmZmVyU3RhZ2UuZ2V0Q2hpbGRCeUlkKHRhcmdldC5pZCk7XG4gICAgICAgIF9kcmFnRHVwbGljYXRlLl90cmFuc2Zvcm0gPSB0YXJnZXQuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCk7XG4gICAgICAgIC8v5Lul5Li655u05o6l5L+u5pS555qEX3RyYW5zZm9ybeS4jeS8muWHuuWPkeW/g+i3s+S4iuaKpe+8jCDmuLLmn5PlvJXmk47kuI3liLbliqjov5nkuKpzdGFnZemcgOimgee7mOWItuOAglxuICAgICAgICAvL+aJgOS7peimgeaJi+WKqOWHuuWPkeW/g+i3s+WMhVxuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5oZWFydEJlYXQoKTtcbiAgICB9LFxuICAgIC8vZHJhZ+e7k+adn+eahOWkhOeQhuWHveaVsFxuICAgIF9kcmFnRW5kOiBmdW5jdGlvbihlLCB0YXJnZXQsIGkpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG5cbiAgICAgICAgLy9fZHJhZ0R1cGxpY2F0ZSDlpI3liLblnKhfYnVmZmVyU3RhZ2Ug5Lit55qE5Ymv5pysXG4gICAgICAgIHZhciBfZHJhZ0R1cGxpY2F0ZSA9IHJvb3QuX2J1ZmZlclN0YWdlLmdldENoaWxkQnlJZCh0YXJnZXQuaWQpO1xuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5kZXN0cm95KCk7XG5cbiAgICAgICAgdGFyZ2V0LmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0YXJnZXQuX2dsb2JhbEFscGhhO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXI7IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5LqL5Lu2566h55CG57G7XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICog5p6E6YCg5Ye95pWwLlxuICogQG5hbWUgRXZlbnREaXNwYXRjaGVyXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVy57G75piv5Y+v6LCD5bqm5LqL5Lu255qE57G755qE5Z+657G777yM5a6D5YWB6K645pi+56S65YiX6KGo5LiK55qE5Lu75L2V5a+56LGh6YO95piv5LiA5Liq5LqL5Lu255uu5qCH44CCXG4gKi9cbnZhciBFdmVudE1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgICAvL+S6i+S7tuaYoOWwhOihqO+8jOagvOW8j+S4uu+8mnt0eXBlMTpbbGlzdGVuZXIxLCBsaXN0ZW5lcjJdLCB0eXBlMjpbbGlzdGVuZXIzLCBsaXN0ZW5lcjRdfVxuICAgIHRoaXMuX2V2ZW50TWFwID0ge307XG59O1xuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlID0geyBcbiAgICAvKlxuICAgICAqIOazqOWGjOS6i+S7tuS+puWQrOWZqOWvueixoe+8jOS7peS9v+S+puWQrOWZqOiDveWkn+aOpeaUtuS6i+S7tumAmuefpeOAglxuICAgICAqL1xuICAgIF9hZGRFdmVudExpc3RlbmVyIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcblxuICAgICAgICBpZiggdHlwZW9mIGxpc3RlbmVyICE9IFwiZnVuY3Rpb25cIiApe1xuICAgICAgICAgIC8vbGlzdGVuZXLlv4XpobvmmK/kuKpmdW5jdGlvbuWRkOS6slxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWRkUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHNlbGYgICAgICA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggdHlwZS5zcGxpdChcIiBcIikgLCBmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgICAgIHZhciBtYXAgPSBzZWxmLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgICAgIGlmKCFtYXApe1xuICAgICAgICAgICAgICAgIG1hcCA9IHNlbGYuX2V2ZW50TWFwW3R5cGVdID0gW107XG4gICAgICAgICAgICAgICAgbWFwLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50RW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKF8uaW5kZXhPZihtYXAgLGxpc3RlbmVyKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIG1hcC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZGRSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhZGRSZXN1bHQ7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliKDpmaTkuovku7bkvqblkKzlmajjgIJcbiAgICAgKi9cbiAgICBfcmVtb3ZlRXZlbnRMaXN0ZW5lciA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkgcmV0dXJuIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSh0eXBlKTtcblxuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIGlmKCFtYXApe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpID0gbWFwW2ldO1xuICAgICAgICAgICAgaWYobGkgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbWFwLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZihtYXAubGVuZ3RoICAgID09IDApIHsgXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrlpoLmnpzov5nkuKrml7blgJljaGlsZOayoeacieS7u+S9leS6i+S7tuS+puWQrFxuICAgICAgICAgICAgICAgICAgICBpZihfLmlzRW1wdHkodGhpcy5fZXZlbnRNYXApKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI6K+l5YWD57Sg5LiN5YaN5o6l5Y+X5LqL5Lu255qE5qOA5rWLXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5oyH5a6a57G75Z6L55qE5omA5pyJ5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUgOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgaWYoIW1hcCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuXG4gICAgICAgICAgICAvL+WmguaenOi/meS4quWmguaenOi/meS4quaXtuWAmWNoaWxk5rKh5pyJ5Lu75L2V5LqL5Lu25L6m5ZCsXG4gICAgICAgICAgICBpZihfLmlzRW1wdHkodGhpcy5fZXZlbnRNYXApKXtcbiAgICAgICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOS4jeWGjeaOpeWPl+S6i+S7tueahOajgOa1i1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliKDpmaTmiYDmnInkuovku7bkvqblkKzlmajjgIJcbiAgICAgKi9cbiAgICBfcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMgOiBmdW5jdGlvbigpIHtcdFxuICAgICAgICB0aGlzLl9ldmVudE1hcCA9IHt9O1xuICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICog5rS+5Y+R5LqL5Lu277yM6LCD55So5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgKi9cbiAgICBfZGlzcGF0Y2hFdmVudCA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW2UudHlwZV07XG4gICAgICAgIFxuICAgICAgICBpZiggbWFwICl7XG4gICAgICAgICAgICBpZighZS50YXJnZXQpIGUudGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIG1hcCA9IG1hcC5zbGljZSgpO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gbWFwW2ldO1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZihsaXN0ZW5lcikgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoICFlLl9zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgICAgICAgICAvL+WQkeS4iuWGkuazoVxuICAgICAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuX2Rpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvKipcbiAgICAgICAqIOajgOafpeaYr+WQpuS4uuaMh+WumuS6i+S7tuexu+Wei+azqOWGjOS6huS7u+S9leS+puWQrOWZqOOAglxuICAgICAgICovXG4gICAgX2hhc0V2ZW50TGlzdGVuZXIgOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgcmV0dXJuIG1hcCAhPSBudWxsICYmIG1hcC5sZW5ndGggPiAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRNYW5hZ2VyO1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5LqL5Lu25rS+5Y+R57G7XG4gKi9cbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vRXZlbnRNYW5hZ2VyXCI7XG5pbXBvcnQgQ2FudmF4RXZlbnQgZnJvbSBcIi4vQ2FudmF4RXZlbnRcIjtcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cblxudmFyIEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uKCl7XG4gICAgRXZlbnREaXNwYXRjaGVyLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBuYW1lKTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoRXZlbnREaXNwYXRjaGVyICwgRXZlbnRNYW5hZ2VyICwge1xuICAgIG9uIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYWRkRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB1biA6IGZ1bmN0aW9uKHR5cGUsbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGU6ZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUoIHR5cGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUFsbEV2ZW50TGlzdGVuZXJzOmZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3JlbW92ZUFsbEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvL3BhcmFtcyDopoHkvKDnu5lldnTnmoRldmVudGhhbmRsZXLlpITnkIblh73mlbDnmoTlj4LmlbDvvIzkvJrooqttZXJnZeWIsENhbnZheCBldmVudOS4rVxuICAgIGZpcmUgOiBmdW5jdGlvbihldmVudFR5cGUgLCBwYXJhbXMpe1xuICAgICAgICB2YXIgZSA9IG5ldyBDYW52YXhFdmVudCggZXZlbnRUeXBlICk7XG5cbiAgICAgICAgaWYoIHBhcmFtcyApe1xuICAgICAgICAgICAgZm9yKCB2YXIgcCBpbiBwYXJhbXMgKXtcbiAgICAgICAgICAgICAgICBpZiggcCBpbiBlICl7XG4gICAgICAgICAgICAgICAgICAgIC8vcGFyYW1z5Lit55qE5pWw5o2u5LiN6IO96KaG55uWZXZlbnTlsZ7mgKdcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHAgKyBcIuWxnuaAp+S4jeiDveimhueblkNhbnZheEV2ZW505bGe5oCnXCIgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVbcF0gPSBwYXJhbXNbcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggZXZlbnRUeXBlLnNwbGl0KFwiIFwiKSAsIGZ1bmN0aW9uKGVUeXBlKXtcbiAgICAgICAgICAgIGUuY3VycmVudFRhcmdldCA9IG1lO1xuICAgICAgICAgICAgbWUuZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZGlzcGF0Y2hFdmVudDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgIC8vdGhpcyBpbnN0YW5jZW9mIERpc3BsYXlPYmplY3RDb250YWluZXIgPT0+IHRoaXMuY2hpbGRyZW5cbiAgICAgICAgLy9UT0RPOiDov5nph4xpbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciDnmoTor53vvIzlnKhkaXNwbGF5T2JqZWN06YeM6Z2i55qEaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi4vZXZlbnQvRXZlbnREaXNwYXRjaGVyXCI7XG4gICAgICAgIC8v5Lya5b6X5Yiw5LiA5LiqdW5kZWZpbmVk77yM5oSf6KeJ5piv5oiQ5LqG5LiA5Liq5b6q546v5L6d6LWW55qE6Zeu6aKY77yM5omA5Lul6L+Z6YeM5o2i55So566A5Y2V55qE5Yik5pat5p2l5Yik5pat6Ieq5bex5piv5LiA5Liq5a655piT77yM5oul5pyJY2hpbGRyZW5cbiAgICAgICAgaWYoIHRoaXMuY2hpbGRyZW4gICYmIGV2ZW50LnBvaW50ICl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXRPYmplY3RzVW5kZXJQb2ludCggZXZlbnQucG9pbnQgLCAxKVswXTtcbiAgICAgICAgICAgIGlmKCB0YXJnZXQgKXtcbiAgICAgICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuY29udGV4dCAmJiBldmVudC50eXBlID09IFwibW91c2VvdmVyXCIpe1xuICAgICAgICAgICAgLy/orrDlvZVkaXNwYXRjaEV2ZW505LmL5YmN55qE5b+D6LezXG4gICAgICAgICAgICB2YXIgcHJlSGVhcnRCZWF0ID0gdGhpcy5faGVhcnRCZWF0TnVtO1xuICAgICAgICAgICAgdmFyIHByZWdBbHBoYSAgICA9IHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICAgICAgICBpZiggcHJlSGVhcnRCZWF0ICE9IHRoaXMuX2hlYXJ0QmVhdE51bSApe1xuICAgICAgICAgICAgICAgIHRoaXMuX2hvdmVyQ2xhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmhvdmVyQ2xvbmUgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnZheCA9IHRoaXMuZ2V0U3RhZ2UoKS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIC8v54S25ZCOY2xvbmXkuIDku71vYmrvvIzmt7vliqDliLBfYnVmZmVyU3RhZ2Ug5LitXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdlNoYXBlID0gdGhpcy5jbG9uZSh0cnVlKTsgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZTaGFwZS5fdHJhbnNmb3JtID0gdGhpcy5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FudmF4Ll9idWZmZXJTdGFnZS5hZGRDaGlsZEF0KCBhY3RpdlNoYXBlICwgMCApOyBcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7mioroh6rlt7HpmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2xvYmFsQWxwaGEgPSBwcmVnQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG5cbiAgICAgICAgaWYoIHRoaXMuY29udGV4dCAmJiBldmVudC50eXBlID09IFwibW91c2VvdXRcIil7XG4gICAgICAgICAgICBpZih0aGlzLl9ob3ZlckNsYXNzKXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuWImuWImm92ZXLnmoTml7blgJnmnInmt7vliqDmoLflvI9cbiAgICAgICAgICAgICAgICB2YXIgY2FudmF4ID0gdGhpcy5nZXRTdGFnZSgpLnBhcmVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3ZlckNsYXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY2FudmF4Ll9idWZmZXJTdGFnZS5yZW1vdmVDaGlsZEJ5SWQodGhpcy5pZCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuX2dsb2JhbEFscGhhICl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRoaXMuX2dsb2JhbEFscGhhO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBoYXNFdmVudDpmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc0V2ZW50TGlzdGVuZXIodHlwZSk7XG4gICAgfSxcbiAgICBoYXNFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzRXZlbnRMaXN0ZW5lcih0eXBlKTtcbiAgICB9LFxuICAgIGhvdmVyIDogZnVuY3Rpb24oIG92ZXJGdW4gLCBvdXRGdW4gKXtcbiAgICAgICAgdGhpcy5vbihcIm1vdXNlb3ZlclwiICwgb3ZlckZ1bik7XG4gICAgICAgIHRoaXMub24oXCJtb3VzZW91dFwiICAsIG91dEZ1biApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIG9uY2UgOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcil7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciBvbmNlSGFuZGxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KG1lICwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHRoaXMudW4odHlwZSAsIG9uY2VIYW5kbGUpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9uKHR5cGUgLCBvbmNlSGFuZGxlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RGlzcGF0Y2hlcjtcbiIsIlxuLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICogTWF0cml4IOefqemYteW6kyDnlKjkuo7mlbTkuKrns7vnu5/nmoTlh6DkvZXlj5jmjaLorqHnrpdcbiAqIGNvZGUgZnJvbSBodHRwOi8vZXZhbncuZ2l0aHViLmlvL2xpZ2h0Z2wuanMvZG9jcy9tYXRyaXguaHRtbFxuICovXG5cbnZhciBNYXRyaXggPSBmdW5jdGlvbihhLCBiLCBjLCBkLCB0eCwgdHkpe1xuICAgIHRoaXMuYSA9IGEgIT0gdW5kZWZpbmVkID8gYSA6IDE7XG4gICAgdGhpcy5iID0gYiAhPSB1bmRlZmluZWQgPyBiIDogMDtcbiAgICB0aGlzLmMgPSBjICE9IHVuZGVmaW5lZCA/IGMgOiAwO1xuICAgIHRoaXMuZCA9IGQgIT0gdW5kZWZpbmVkID8gZCA6IDE7XG4gICAgdGhpcy50eCA9IHR4ICE9IHVuZGVmaW5lZCA/IHR4IDogMDtcbiAgICB0aGlzLnR5ID0gdHkgIT0gdW5kZWZpbmVkID8gdHkgOiAwO1xufTtcblxuTWF0cml4LnByb3RvdHlwZSA9IHtcbiAgICBjb25jYXQgOiBmdW5jdGlvbihtdHgpe1xuICAgICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG5cbiAgICAgICAgdGhpcy5hID0gYSAqIG10eC5hICsgdGhpcy5iICogbXR4LmM7XG4gICAgICAgIHRoaXMuYiA9IGEgKiBtdHguYiArIHRoaXMuYiAqIG10eC5kO1xuICAgICAgICB0aGlzLmMgPSBjICogbXR4LmEgKyB0aGlzLmQgKiBtdHguYztcbiAgICAgICAgdGhpcy5kID0gYyAqIG10eC5iICsgdGhpcy5kICogbXR4LmQ7XG4gICAgICAgIHRoaXMudHggPSB0eCAqIG10eC5hICsgdGhpcy50eSAqIG10eC5jICsgbXR4LnR4O1xuICAgICAgICB0aGlzLnR5ID0gdHggKiBtdHguYiArIHRoaXMudHkgKiBtdHguZCArIG10eC50eTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25jYXRUcmFuc2Zvcm0gOiBmdW5jdGlvbih4LCB5LCBzY2FsZVgsIHNjYWxlWSwgcm90YXRpb24pe1xuICAgICAgICB2YXIgY29zID0gMTtcbiAgICAgICAgdmFyIHNpbiA9IDA7XG4gICAgICAgIGlmKHJvdGF0aW9uJTM2MCl7XG4gICAgICAgICAgICB2YXIgciA9IHJvdGF0aW9uICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgIGNvcyA9IE1hdGguY29zKHIpO1xuICAgICAgICAgICAgc2luID0gTWF0aC5zaW4ocik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmNhdChuZXcgTWF0cml4KGNvcypzY2FsZVgsIHNpbipzY2FsZVgsIC1zaW4qc2NhbGVZLCBjb3Mqc2NhbGVZLCB4LCB5KSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcm90YXRlIDogZnVuY3Rpb24oYW5nbGUpe1xuICAgICAgICAvL+ebruWJjeW3sue7j+aPkOS+m+WvuemhuuaXtumSiOmAhuaXtumSiOS4pOS4quaWueWQkeaXi+i9rOeahOaUr+aMgVxuICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIHR4ID0gdGhpcy50eDtcblxuICAgICAgICBpZiAoYW5nbGU+MCl7XG4gICAgICAgICAgICB0aGlzLmEgPSBhICogY29zIC0gdGhpcy5iICogc2luO1xuICAgICAgICAgICAgdGhpcy5iID0gYSAqIHNpbiArIHRoaXMuYiAqIGNvcztcbiAgICAgICAgICAgIHRoaXMuYyA9IGMgKiBjb3MgLSB0aGlzLmQgKiBzaW47XG4gICAgICAgICAgICB0aGlzLmQgPSBjICogc2luICsgdGhpcy5kICogY29zO1xuICAgICAgICAgICAgdGhpcy50eCA9IHR4ICogY29zIC0gdGhpcy50eSAqIHNpbjtcbiAgICAgICAgICAgIHRoaXMudHkgPSB0eCAqIHNpbiArIHRoaXMudHkgKiBjb3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3QgPSBNYXRoLnNpbihNYXRoLmFicyhhbmdsZSkpO1xuICAgICAgICAgICAgdmFyIGN0ID0gTWF0aC5jb3MoTWF0aC5hYnMoYW5nbGUpKTtcblxuICAgICAgICAgICAgdGhpcy5hID0gYSpjdCArIHRoaXMuYipzdDtcbiAgICAgICAgICAgIHRoaXMuYiA9IC1hKnN0ICsgdGhpcy5iKmN0O1xuICAgICAgICAgICAgdGhpcy5jID0gYypjdCArIHRoaXMuZCpzdDtcbiAgICAgICAgICAgIHRoaXMuZCA9IC1jKnN0ICsgY3QqdGhpcy5kO1xuICAgICAgICAgICAgdGhpcy50eCA9IGN0KnR4ICsgc3QqdGhpcy50eTtcbiAgICAgICAgICAgIHRoaXMudHkgPSBjdCp0aGlzLnR5IC0gc3QqdHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzY2FsZSA6IGZ1bmN0aW9uKHN4LCBzeSl7XG4gICAgICAgIHRoaXMuYSAqPSBzeDtcbiAgICAgICAgdGhpcy5kICo9IHN5O1xuICAgICAgICB0aGlzLnR4ICo9IHN4O1xuICAgICAgICB0aGlzLnR5ICo9IHN5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRyYW5zbGF0ZSA6IGZ1bmN0aW9uKGR4LCBkeSl7XG4gICAgICAgIHRoaXMudHggKz0gZHg7XG4gICAgICAgIHRoaXMudHkgKz0gZHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaWRlbnRpdHkgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICB0aGlzLmEgPSB0aGlzLmQgPSAxO1xuICAgICAgICB0aGlzLmIgPSB0aGlzLmMgPSB0aGlzLnR4ID0gdGhpcy50eSA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW52ZXJ0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy/pgIblkJHnn6npmLVcbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIHZhciBiID0gdGhpcy5iO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIGQgPSB0aGlzLmQ7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG4gICAgICAgIHZhciBpID0gYSAqIGQgLSBiICogYztcblxuICAgICAgICB0aGlzLmEgPSBkIC8gaTtcbiAgICAgICAgdGhpcy5iID0gLWIgLyBpO1xuICAgICAgICB0aGlzLmMgPSAtYyAvIGk7XG4gICAgICAgIHRoaXMuZCA9IGEgLyBpO1xuICAgICAgICB0aGlzLnR4ID0gKGMgKiB0aGlzLnR5IC0gZCAqIHR4KSAvIGk7XG4gICAgICAgIHRoaXMudHkgPSAtKGEgKiB0aGlzLnR5IC0gYiAqIHR4KSAvIGk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xvbmUgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCh0aGlzLmEsIHRoaXMuYiwgdGhpcy5jLCB0aGlzLmQsIHRoaXMudHgsIHRoaXMudHkpO1xuICAgIH0sXG4gICAgdG9BcnJheSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBbIHRoaXMuYSAsIHRoaXMuYiAsIHRoaXMuYyAsIHRoaXMuZCAsIHRoaXMudHggLCB0aGlzLnR5IF07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDnn6npmLXlt6bkuZjlkJHph49cbiAgICAgKi9cbiAgICBtdWxWZWN0b3IgOiBmdW5jdGlvbih2KSB7XG4gICAgICAgIHZhciBhYSA9IHRoaXMuYSwgYWMgPSB0aGlzLmMsIGF0eCA9IHRoaXMudHg7XG4gICAgICAgIHZhciBhYiA9IHRoaXMuYiwgYWQgPSB0aGlzLmQsIGF0eSA9IHRoaXMudHk7XG5cbiAgICAgICAgdmFyIG91dCA9IFswLDBdO1xuICAgICAgICBvdXRbMF0gPSB2WzBdICogYWEgKyB2WzFdICogYWMgKyBhdHg7XG4gICAgICAgIG91dFsxXSA9IHZbMF0gKiBhYiArIHZbMV0gKiBhZCArIGF0eTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0gICAgXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hdHJpeDtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaVsOWtpiDnsbtcbiAqXG4gKiovXG5cblxuXG52YXIgX2NhY2hlID0ge1xuICAgIHNpbiA6IHt9LCAgICAgLy9zaW7nvJPlrZhcbiAgICBjb3MgOiB7fSAgICAgIC8vY29z57yT5a2YXG59O1xudmFyIF9yYWRpYW5zID0gTWF0aC5QSSAvIDE4MDtcblxuLyoqXG4gKiBAcGFyYW0gYW5nbGUg5byn5bqm77yI6KeS5bqm77yJ5Y+C5pWwXG4gKiBAcGFyYW0gaXNEZWdyZWVzIGFuZ2xl5Y+C5pWw5piv5ZCm5Li66KeS5bqm6K6h566X77yM6buY6K6k5Li6ZmFsc2XvvIxhbmdsZeS4uuS7peW8p+W6puiuoemHj+eahOinkuW6plxuICovXG5mdW5jdGlvbiBzaW4oYW5nbGUsIGlzRGVncmVlcykge1xuICAgIGFuZ2xlID0gKGlzRGVncmVlcyA/IGFuZ2xlICogX3JhZGlhbnMgOiBhbmdsZSkudG9GaXhlZCg0KTtcbiAgICBpZih0eXBlb2YgX2NhY2hlLnNpblthbmdsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgX2NhY2hlLnNpblthbmdsZV0gPSBNYXRoLnNpbihhbmdsZSk7XG4gICAgfVxuICAgIHJldHVybiBfY2FjaGUuc2luW2FuZ2xlXTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gcmFkaWFucyDlvKfluqblj4LmlbBcbiAqL1xuZnVuY3Rpb24gY29zKGFuZ2xlLCBpc0RlZ3JlZXMpIHtcbiAgICBhbmdsZSA9IChpc0RlZ3JlZXMgPyBhbmdsZSAqIF9yYWRpYW5zIDogYW5nbGUpLnRvRml4ZWQoNCk7XG4gICAgaWYodHlwZW9mIF9jYWNoZS5jb3NbYW5nbGVdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9jYWNoZS5jb3NbYW5nbGVdID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gX2NhY2hlLmNvc1thbmdsZV07XG59XG5cbi8qKlxuICog6KeS5bqm6L2s5byn5bqmXG4gKiBAcGFyYW0ge09iamVjdH0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG9SYWRpYW4oYW5nbGUpIHtcbiAgICByZXR1cm4gYW5nbGUgKiBfcmFkaWFucztcbn1cblxuLyoqXG4gKiDlvKfluqbovazop5LluqZcbiAqIEBwYXJhbSB7T2JqZWN0fSBhbmdsZVxuICovXG5mdW5jdGlvbiByYWRpYW5Ub0RlZ3JlZShhbmdsZSkge1xuICAgIHJldHVybiBhbmdsZSAvIF9yYWRpYW5zO1xufVxuXG4vKlxuICog5qCh6aqM6KeS5bqm5YiwMzYw5bqm5YaFXG4gKiBAcGFyYW0ge2FuZ2xlfSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG8zNjAoIGFuZ2xlICkge1xuICAgIHZhciByZUFuZyA9ICgzNjAgKyAgYW5nbGUgICUgMzYwKSAlIDM2MDsvL01hdGguYWJzKDM2MCArIE1hdGguY2VpbCggYW5nbGUgKSAlIDM2MCkgJSAzNjA7XG4gICAgaWYoIHJlQW5nID09IDAgJiYgYW5nbGUgIT09IDAgKXtcbiAgICAgICAgcmVBbmcgPSAzNjBcbiAgICB9XG4gICAgcmV0dXJuIHJlQW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgUEkgIDogTWF0aC5QSSAgLFxuICAgIHNpbiA6IHNpbiAgICAgICxcbiAgICBjb3MgOiBjb3MgICAgICAsXG4gICAgZGVncmVlVG9SYWRpYW4gOiBkZWdyZWVUb1JhZGlhbixcbiAgICByYWRpYW5Ub0RlZ3JlZSA6IHJhZGlhblRvRGVncmVlLFxuICAgIGRlZ3JlZVRvMzYwICAgIDogZGVncmVlVG8zNjAgICBcbn07XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKiDngrnlh7vmo4DmtYsg57G7XG4gKiAqL1xuaW1wb3J0IG15TWF0aCBmcm9tIFwiLi9NYXRoXCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOWMheWQq+WIpOaWrVxuICogc2hhcGUgOiDlm77lvaJcbiAqIHggOiDmqKrlnZDmoIdcbiAqIHkgOiDnurXlnZDmoIdcbiAqL1xuZnVuY3Rpb24gaXNJbnNpZGUoc2hhcGUsIHBvaW50KSB7XG4gICAgdmFyIHggPSBwb2ludC54O1xuICAgIHZhciB5ID0gcG9pbnQueTtcbiAgICBpZiAoIXNoYXBlIHx8ICFzaGFwZS50eXBlKSB7XG4gICAgICAgIC8vIOaXoOWPguaVsOaIluS4jeaUr+aMgeexu+Wei1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvL+aVsOWtpui/kOeul++8jOS4u+imgeaYr2xpbmXvvIxicm9rZW5MaW5lXG4gICAgcmV0dXJuIF9wb2ludEluU2hhcGUoc2hhcGUsIHgsIHkpO1xufTtcblxuZnVuY3Rpb24gX3BvaW50SW5TaGFwZShzaGFwZSwgeCwgeSkge1xuICAgIC8vIOWcqOefqeW9ouWGheWImemDqOWIhuWbvuW9oumcgOimgei/m+S4gOatpeWIpOaWrVxuICAgIHN3aXRjaCAoc2hhcGUudHlwZSkge1xuICAgICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVMaW5lKHNoYXBlLmNvbnRleHQsIHgsIHkpO1xuICAgICAgICBjYXNlICdicm9rZW5saW5lJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVCcm9rZW5MaW5lKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAncmVjdCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdlbGxpcHNlJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNQb2ludEluRWxpcHNlKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAnc2VjdG9yJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVTZWN0b3Ioc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdwYXRoJzpcbiAgICAgICAgY2FzZSAnZHJvcGxldCc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlUGF0aChzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICBjYXNlICdpc29nb24nOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcihzaGFwZSwgeCwgeSk7XG4gICAgICAgICAgICAvL3JldHVybiBfaXNJbnNpZGVQb2x5Z29uX0Nyb3NzaW5nTnVtYmVyKHNoYXBlLCB4LCB5KTtcbiAgICB9XG59O1xuLyoqXG4gKiAhaXNJbnNpZGVcbiAqL1xuZnVuY3Rpb24gaXNPdXRzaWRlKHNoYXBlLCB4LCB5KSB7XG4gICAgcmV0dXJuICFpc0luc2lkZShzaGFwZSwgeCwgeSk7XG59O1xuXG4vKipcbiAqIOe6v+auteWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVMaW5lKGNvbnRleHQsIHgsIHkpIHtcbiAgICB2YXIgeDAgPSBjb250ZXh0LnhTdGFydDtcbiAgICB2YXIgeTAgPSBjb250ZXh0LnlTdGFydDtcbiAgICB2YXIgeDEgPSBjb250ZXh0LnhFbmQ7XG4gICAgdmFyIHkxID0gY29udGV4dC55RW5kO1xuICAgIHZhciBfbCA9IE1hdGgubWF4KGNvbnRleHQubGluZVdpZHRoICwgMyk7XG4gICAgdmFyIF9hID0gMDtcbiAgICB2YXIgX2IgPSB4MDtcblxuICAgIGlmKFxuICAgICAgICAoeSA+IHkwICsgX2wgJiYgeSA+IHkxICsgX2wpIFxuICAgICAgICB8fCAoeSA8IHkwIC0gX2wgJiYgeSA8IHkxIC0gX2wpIFxuICAgICAgICB8fCAoeCA+IHgwICsgX2wgJiYgeCA+IHgxICsgX2wpIFxuICAgICAgICB8fCAoeCA8IHgwIC0gX2wgJiYgeCA8IHgxIC0gX2wpIFxuICAgICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoeDAgIT09IHgxKSB7XG4gICAgICAgIF9hID0gKHkwIC0geTEpIC8gKHgwIC0geDEpO1xuICAgICAgICBfYiA9ICh4MCAqIHkxIC0geDEgKiB5MCkgLyAoeDAgLSB4MSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHggLSB4MCkgPD0gX2wgLyAyO1xuICAgIH1cblxuICAgIHZhciBfcyA9IChfYSAqIHggLSB5ICsgX2IpICogKF9hICogeCAtIHkgKyBfYikgLyAoX2EgKiBfYSArIDEpO1xuICAgIHJldHVybiBfcyA8PSBfbCAvIDIgKiBfbCAvIDI7XG59O1xuXG5mdW5jdGlvbiBfaXNJbnNpZGVCcm9rZW5MaW5lKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcbiAgICB2YXIgbGluZUFyZWE7XG4gICAgdmFyIGluc2lkZUNhdGNoID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwb2ludExpc3QubGVuZ3RoIC0gMTsgaSA8IGw7IGkrKykge1xuICAgICAgICBsaW5lQXJlYSA9IHtcbiAgICAgICAgICAgIHhTdGFydDogcG9pbnRMaXN0W2ldWzBdLFxuICAgICAgICAgICAgeVN0YXJ0OiBwb2ludExpc3RbaV1bMV0sXG4gICAgICAgICAgICB4RW5kOiBwb2ludExpc3RbaSArIDFdWzBdLFxuICAgICAgICAgICAgeUVuZDogcG9pbnRMaXN0W2kgKyAxXVsxXSxcbiAgICAgICAgICAgIGxpbmVXaWR0aDogY29udGV4dC5saW5lV2lkdGhcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFfaXNJbnNpZGVSZWN0YW5nbGUoe1xuICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLm1pbihsaW5lQXJlYS54U3RhcnQsIGxpbmVBcmVhLnhFbmQpIC0gbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLm1pbihsaW5lQXJlYS55U3RhcnQsIGxpbmVBcmVhLnlFbmQpIC0gbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogTWF0aC5hYnMobGluZUFyZWEueFN0YXJ0IC0gbGluZUFyZWEueEVuZCkgKyBsaW5lQXJlYS5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMobGluZUFyZWEueVN0YXJ0IC0gbGluZUFyZWEueUVuZCkgKyBsaW5lQXJlYS5saW5lV2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHgsIHlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgIC8vIOS4jeWcqOefqeW9ouWMuuWGhei3s+i/h1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5zaWRlQ2F0Y2ggPSBfaXNJbnNpZGVMaW5lKGxpbmVBcmVhLCB4LCB5KTtcbiAgICAgICAgaWYgKGluc2lkZUNhdGNoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zaWRlQ2F0Y2g7XG59O1xuXG5cbi8qKlxuICog55+p5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZVJlY3RhbmdsZShzaGFwZSwgeCwgeSkge1xuICAgIGlmICh4ID49IHNoYXBlLnggJiYgeCA8PSAoc2hhcGUueCArIHNoYXBlLndpZHRoKSAmJiB5ID49IHNoYXBlLnkgJiYgeSA8PSAoc2hhcGUueSArIHNoYXBlLmhlaWdodCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICog5ZyG5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZUNpcmNsZShzaGFwZSwgeCwgeSwgcikge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICAhciAmJiAociA9IGNvbnRleHQucik7XG4gICAgcis9Y29udGV4dC5saW5lV2lkdGg7XG4gICAgcmV0dXJuICh4ICogeCArIHkgKiB5KSA8IHIgKiByO1xufTtcblxuLyoqXG4gKiDmiYflvaLljIXlkKvliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlU2VjdG9yKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0XG4gICAgaWYgKCFfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHkpIHx8IChjb250ZXh0LnIwID4gMCAmJiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHksIGNvbnRleHQucjApKSkge1xuICAgICAgICAvLyDlpKflnIblpJbmiJbogIXlsI/lnIblhoXnm7TmjqVmYWxzZVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8g5Yik5pat5aS56KeSXG4gICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7IC8vIOi1t+Wni+inkuW6plswLDM2MClcbiAgICAgICAgdmFyIGVuZEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuZW5kQW5nbGUpOyAvLyDnu5PmnZ/op5LluqYoMCwzNjBdXG5cbiAgICAgICAgLy/orqHnrpfor6XngrnmiYDlnKjnmoTop5LluqZcbiAgICAgICAgdmFyIGFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKChNYXRoLmF0YW4yKHksIHgpIC8gTWF0aC5QSSAqIDE4MCkgJSAzNjApO1xuXG4gICAgICAgIHZhciByZWdJbiA9IHRydWU7IC8v5aaC5p6c5Zyoc3RhcnTlkoxlbmTnmoTmlbDlgLzkuK3vvIxlbmTlpKfkuo5zdGFydOiAjOS4lOaYr+mhuuaXtumSiOWImXJlZ0lu5Li6dHJ1ZVxuICAgICAgICBpZiAoKHN0YXJ0QW5nbGUgPiBlbmRBbmdsZSAmJiAhY29udGV4dC5jbG9ja3dpc2UpIHx8IChzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgY29udGV4dC5jbG9ja3dpc2UpKSB7XG4gICAgICAgICAgICByZWdJbiA9IGZhbHNlOyAvL291dFxuICAgICAgICB9XG4gICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXG4gICAgICAgIHZhciByZWdBbmdsZSA9IFtcbiAgICAgICAgICAgIE1hdGgubWluKHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKSxcbiAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBpbkFuZ2xlUmVnID0gYW5nbGUgPiByZWdBbmdsZVswXSAmJiBhbmdsZSA8IHJlZ0FuZ2xlWzFdO1xuICAgICAgICByZXR1cm4gKGluQW5nbGVSZWcgJiYgcmVnSW4pIHx8ICghaW5BbmdsZVJlZyAmJiAhcmVnSW4pO1xuICAgIH1cbn07XG5cbi8qXG4gKuakreWchuWMheWQq+WIpOaWrVxuICogKi9cbmZ1bmN0aW9uIF9pc1BvaW50SW5FbGlwc2Uoc2hhcGUsIHgsIHkpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQ7XG4gICAgdmFyIGNlbnRlciA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgIH07XG4gICAgLy945Y2K5b6EXG4gICAgdmFyIFhSYWRpdXMgPSBjb250ZXh0LmhyO1xuICAgIHZhciBZUmFkaXVzID0gY29udGV4dC52cjtcblxuICAgIHZhciBwID0ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgfTtcblxuICAgIHZhciBpUmVzO1xuXG4gICAgcC54IC09IGNlbnRlci54O1xuICAgIHAueSAtPSBjZW50ZXIueTtcblxuICAgIHAueCAqPSBwLng7XG4gICAgcC55ICo9IHAueTtcblxuICAgIFhSYWRpdXMgKj0gWFJhZGl1cztcbiAgICBZUmFkaXVzICo9IFlSYWRpdXM7XG5cbiAgICBpUmVzID0gWVJhZGl1cyAqIHAueCArIFhSYWRpdXMgKiBwLnkgLSBYUmFkaXVzICogWVJhZGl1cztcblxuICAgIHJldHVybiAoaVJlcyA8IDApO1xufTtcblxuLyoqXG4gKiDlpJrovrnlvaLljIXlkKvliKTmlq0gTm9uemVybyBXaW5kaW5nIE51bWJlciBSdWxlXG4gKi9cblxuZnVuY3Rpb24gX2lzSW5zaWRlUG9seWdvbl9XaW5kaW5nTnVtYmVyKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0ID8gc2hhcGUuY29udGV4dCA6IHNoYXBlO1xuICAgIHZhciBwb2x5ID0gXy5jbG9uZShjb250ZXh0LnBvaW50TGlzdCk7IC8vcG9seSDlpJrovrnlvaLpobbngrnvvIzmlbDnu4TmiJDlkZjnmoTmoLzlvI/lkIwgcFxuICAgIHBvbHkucHVzaChwb2x5WzBdKTsgLy/orrDlvpfopoHpl63lkIhcbiAgICB2YXIgd24gPSAwO1xuICAgIGZvciAodmFyIHNoaWZ0UCwgc2hpZnQgPSBwb2x5WzBdWzFdID4geSwgaSA9IDE7IGkgPCBwb2x5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8v5YWI5YGa57q/55qE5qOA5rWL77yM5aaC5p6c5piv5Zyo5Lik54K555qE57q/5LiK77yM5bCx6IKv5a6a5piv5Zyo6K6k5Li65Zyo5Zu+5b2i5LiKXG4gICAgICAgIHZhciBpbkxpbmUgPSBfaXNJbnNpZGVMaW5lKHtcbiAgICAgICAgICAgIHhTdGFydCA6IHBvbHlbaS0xXVswXSxcbiAgICAgICAgICAgIHlTdGFydCA6IHBvbHlbaS0xXVsxXSxcbiAgICAgICAgICAgIHhFbmQgICA6IHBvbHlbaV1bMF0sXG4gICAgICAgICAgICB5RW5kICAgOiBwb2x5W2ldWzFdLFxuICAgICAgICAgICAgbGluZVdpZHRoIDogKGNvbnRleHQubGluZVdpZHRoIHx8IDEpXG4gICAgICAgIH0gLCB4ICwgeSk7XG4gICAgICAgIGlmICggaW5MaW5lICl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/lpoLmnpzmnIlmaWxsU3R5bGUg77yMIOmCo+S5iOiCr+WumumcgOimgeWBmumdoueahOajgOa1i1xuICAgICAgICBpZiAoY29udGV4dC5maWxsU3R5bGUpIHtcbiAgICAgICAgICAgIHNoaWZ0UCA9IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgPSBwb2x5W2ldWzFdID4geTtcbiAgICAgICAgICAgIGlmIChzaGlmdFAgIT0gc2hpZnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IChzaGlmdFAgPyAxIDogMCkgLSAoc2hpZnQgPyAxIDogMCk7XG4gICAgICAgICAgICAgICAgaWYgKG4gKiAoKHBvbHlbaSAtIDFdWzBdIC0geCkgKiAocG9seVtpXVsxXSAtIHkpIC0gKHBvbHlbaSAtIDFdWzFdIC0geSkgKiAocG9seVtpXVswXSAtIHgpKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgd24gKz0gbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gd247XG59O1xuXG4vKipcbiAqIOi3r+W+hOWMheWQq+WIpOaWre+8jOS+nei1luWkmui+ueW9ouWIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVQYXRoKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcbiAgICB2YXIgaW5zaWRlQ2F0Y2ggPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaW5zaWRlQ2F0Y2ggPSBfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIoe1xuICAgICAgICAgICAgcG9pbnRMaXN0OiBwb2ludExpc3RbaV0sXG4gICAgICAgICAgICBsaW5lV2lkdGg6IGNvbnRleHQubGluZVdpZHRoLFxuICAgICAgICAgICAgZmlsbFN0eWxlOiBjb250ZXh0LmZpbGxTdHlsZVxuICAgICAgICB9LCB4LCB5KTtcbiAgICAgICAgaWYgKGluc2lkZUNhdGNoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zaWRlQ2F0Y2g7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaXNJbnNpZGU6IGlzSW5zaWRlLFxuICAgIGlzT3V0c2lkZTogaXNPdXRzaWRlXG59OyIsImltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICogVHdlZW4uanMgLSBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL2dyYXBocy9jb250cmlidXRvcnMgZm9yIHRoZSBmdWxsIGxpc3Qgb2YgY29udHJpYnV0b3JzLlxuICogVGhhbmsgeW91IGFsbCwgeW91J3JlIGF3ZXNvbWUhXG4gKi9cblxuIHZhciBUV0VFTiA9IFRXRUVOIHx8IChmdW5jdGlvbiAoKSB7XG5cbiBcdHZhciBfdHdlZW5zID0gW107XG5cbiBcdHJldHVybiB7XG5cbiBcdFx0Z2V0QWxsOiBmdW5jdGlvbiAoKSB7XG5cbiBcdFx0XHRyZXR1cm4gX3R3ZWVucztcblxuIFx0XHR9LFxuXG4gXHRcdHJlbW92ZUFsbDogZnVuY3Rpb24gKCkge1xuXG4gXHRcdFx0X3R3ZWVucyA9IFtdO1xuXG4gXHRcdH0sXG5cbiBcdFx0YWRkOiBmdW5jdGlvbiAodHdlZW4pIHtcblxuIFx0XHRcdF90d2VlbnMucHVzaCh0d2Vlbik7XG5cbiBcdFx0fSxcblxuIFx0XHRyZW1vdmU6IGZ1bmN0aW9uICh0d2Vlbikge1xuXG5cdFx0XHR2YXIgaSA9IF8uaW5kZXhPZiggX3R3ZWVucyAsIHR3ZWVuICk7Ly9fdHdlZW5zLmluZGV4T2YodHdlZW4pO1xuXG5cdFx0XHRpZiAoaSAhPT0gLTEpIHtcblx0XHRcdFx0X3R3ZWVucy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0dXBkYXRlOiBmdW5jdGlvbiAodGltZSwgcHJlc2VydmUpIHtcblxuXHRcdFx0aWYgKF90d2VlbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHR0aW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6IFRXRUVOLm5vdygpO1xuXG5cdFx0XHR3aGlsZSAoaSA8IF90d2VlbnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBvbGQgXG5cdFx0XHRcdGlmIChfdHdlZW5zW2ldLnVwZGF0ZSh0aW1lKSB8fCBwcmVzZXJ2ZSkge1xuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQqL1xuXG4gICAgICAgICAgICAgICAgLy9uZXcgY29kZVxuICAgICAgICAgICAgICAgIC8vaW4gcmVhbCB3b3JsZCwgdHdlZW4udXBkYXRlIGhhcyBjaGFuY2UgdG8gcmVtb3ZlIGl0c2VsZiwgc28gd2UgaGF2ZSB0byBoYW5kbGUgdGhpcyBzaXR1YXRpb24uXG4gICAgICAgICAgICAgICAgLy9pbiBjZXJ0YWluIGNhc2VzLCBvblVwZGF0ZUNhbGxiYWNrIHdpbGwgcmVtb3ZlIGluc3RhbmNlcyBpbiBfdHdlZW5zLCB3aGljaCBtYWtlIF90d2VlbnMuc3BsaWNlKGksIDEpIGZhaWxcbiAgICAgICAgICAgICAgICAvL0BsaXRhby5sdEBhbGliYWJhLWluYy5jb21cbiAgICAgICAgICAgICAgICB2YXIgX3QgPSBfdHdlZW5zW2ldO1xuICAgICAgICAgICAgICAgIHZhciBfdXBkYXRlUmVzID0gX3QudXBkYXRlKHRpbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYoICFfdHdlZW5zW2ldICl7XG4gICAgICAgICAgICAgICAgXHRicmVhaztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmICggX3QgPT09IF90d2VlbnNbaV0gKSB7XG4gICAgICAgICAgICAgICAgXHRpZiAoIF91cGRhdGVSZXMgfHwgcHJlc2VydmUgKSB7XG4gICAgICAgICAgICAgICAgXHRcdGkrKztcbiAgICAgICAgICAgICAgICBcdH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIFx0fVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfTtcblxufSkoKTtcblxuXG4vLyBJbmNsdWRlIGEgcGVyZm9ybWFuY2Uubm93IHBvbHlmaWxsLlxuLy8gSW4gbm9kZS5qcywgdXNlIHByb2Nlc3MuaHJ0aW1lLlxuaWYgKHR5cGVvZiAod2luZG93KSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIChwcm9jZXNzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0VFdFRU4ubm93ID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciB0aW1lID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuXHRcdC8vIENvbnZlcnQgW3NlY29uZHMsIG5hbm9zZWNvbmRzXSB0byBtaWxsaXNlY29uZHMuXG5cdFx0cmV0dXJuIHRpbWVbMF0gKiAxMDAwICsgdGltZVsxXSAvIDEwMDAwMDA7XG5cdH07XG59XG4vLyBJbiBhIGJyb3dzZXIsIHVzZSB3aW5kb3cucGVyZm9ybWFuY2Uubm93IGlmIGl0IGlzIGF2YWlsYWJsZS5cbmVsc2UgaWYgKHR5cGVvZiAod2luZG93KSAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0d2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiZcblx0d2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XG5cdC8vIFRoaXMgbXVzdCBiZSBib3VuZCwgYmVjYXVzZSBkaXJlY3RseSBhc3NpZ25pbmcgdGhpcyBmdW5jdGlvblxuXHQvLyBsZWFkcyB0byBhbiBpbnZvY2F0aW9uIGV4Y2VwdGlvbiBpbiBDaHJvbWUuXG5cdFRXRUVOLm5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cuYmluZCh3aW5kb3cucGVyZm9ybWFuY2UpO1xufVxuLy8gVXNlIERhdGUubm93IGlmIGl0IGlzIGF2YWlsYWJsZS5cbmVsc2UgaWYgKERhdGUubm93ICE9PSB1bmRlZmluZWQpIHtcblx0VFdFRU4ubm93ID0gRGF0ZS5ub3c7XG59XG4vLyBPdGhlcndpc2UsIHVzZSAnbmV3IERhdGUoKS5nZXRUaW1lKCknLlxuZWxzZSB7XG5cdFRXRUVOLm5vdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdH07XG59XG5cblxuVFdFRU4uVHdlZW4gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cblx0dmFyIF9vYmplY3QgPSBvYmplY3Q7XG5cdHZhciBfdmFsdWVzU3RhcnQgPSB7fTtcblx0dmFyIF92YWx1ZXNFbmQgPSB7fTtcblx0dmFyIF92YWx1ZXNTdGFydFJlcGVhdCA9IHt9O1xuXHR2YXIgX2R1cmF0aW9uID0gMTAwMDtcblx0dmFyIF9yZXBlYXQgPSAwO1xuXHR2YXIgX3JlcGVhdERlbGF5VGltZTtcblx0dmFyIF95b3lvID0gZmFsc2U7XG5cdHZhciBfaXNQbGF5aW5nID0gZmFsc2U7XG5cdHZhciBfcmV2ZXJzZWQgPSBmYWxzZTtcblx0dmFyIF9kZWxheVRpbWUgPSAwO1xuXHR2YXIgX3N0YXJ0VGltZSA9IG51bGw7XG5cdHZhciBfZWFzaW5nRnVuY3Rpb24gPSBUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmU7XG5cdHZhciBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5MaW5lYXI7XG5cdHZhciBfY2hhaW5lZFR3ZWVucyA9IFtdO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblx0dmFyIF9vblVwZGF0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RvcENhbGxiYWNrID0gbnVsbDtcblxuXHR0aGlzLnRvID0gZnVuY3Rpb24gKHByb3BlcnRpZXMsIGR1cmF0aW9uKSB7XG5cblx0XHRfdmFsdWVzRW5kID0gcHJvcGVydGllcztcblxuXHRcdGlmIChkdXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfZHVyYXRpb24gPSBkdXJhdGlvbjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0VFdFRU4uYWRkKHRoaXMpO1xuXG5cdFx0X2lzUGxheWluZyA9IHRydWU7XG5cblx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblxuXHRcdF9zdGFydFRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogVFdFRU4ubm93KCk7XG5cdFx0X3N0YXJ0VGltZSArPSBfZGVsYXlUaW1lO1xuXG5cdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCkge1xuXG5cdFx0XHQvLyBDaGVjayBpZiBhbiBBcnJheSB3YXMgcHJvdmlkZWQgYXMgcHJvcGVydHkgdmFsdWVcblx0XHRcdGlmIChfdmFsdWVzRW5kW3Byb3BlcnR5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0aWYgKF92YWx1ZXNFbmRbcHJvcGVydHldLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ3JlYXRlIGEgbG9jYWwgY29weSBvZiB0aGUgQXJyYXkgd2l0aCB0aGUgc3RhcnQgdmFsdWUgYXQgdGhlIGZyb250XG5cdFx0XHRcdF92YWx1ZXNFbmRbcHJvcGVydHldID0gW19vYmplY3RbcHJvcGVydHldXS5jb25jYXQoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGB0bygpYCBzcGVjaWZpZXMgYSBwcm9wZXJ0eSB0aGF0IGRvZXNuJ3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3QsXG5cdFx0XHQvLyB3ZSBzaG91bGQgbm90IHNldCB0aGF0IHByb3BlcnR5IGluIHRoZSBvYmplY3Rcblx0XHRcdGlmIChfb2JqZWN0W3Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTYXZlIHRoZSBzdGFydGluZyB2YWx1ZS5cblx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPSBfb2JqZWN0W3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKChfdmFsdWVzU3RhcnRbcHJvcGVydHldIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuXHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldICo9IDEuMDsgLy8gRW5zdXJlcyB3ZSdyZSB1c2luZyBudW1iZXJzLCBub3Qgc3RyaW5nc1xuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIV9pc1BsYXlpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFRXRUVOLnJlbW92ZSh0aGlzKTtcblx0XHRfaXNQbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiAoX29uU3RvcENhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25TdG9wQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHR9XG5cblx0XHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmVuZCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHRoaXMudXBkYXRlKF9zdGFydFRpbWUgKyBfZHVyYXRpb24pO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdG9wKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5kZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9kZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdCA9IGZ1bmN0aW9uICh0aW1lcykge1xuXG5cdFx0X3JlcGVhdCA9IHRpbWVzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXREZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9yZXBlYXREZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnlveW8gPSBmdW5jdGlvbiAoeW95bykge1xuXG5cdFx0X3lveW8gPSB5b3lvO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblxuXHR0aGlzLmVhc2luZyA9IGZ1bmN0aW9uIChlYXNpbmcpIHtcblxuXHRcdF9lYXNpbmdGdW5jdGlvbiA9IGVhc2luZztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuaW50ZXJwb2xhdGlvbiA9IGZ1bmN0aW9uIChpbnRlcnBvbGF0aW9uKSB7XG5cblx0XHRfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gaW50ZXJwb2xhdGlvbjtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfY2hhaW5lZFR3ZWVucyA9IGFyZ3VtZW50cztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdGFydCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uU3RhcnRDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25Db21wbGV0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0b3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblN0b3BDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0dmFyIHByb3BlcnR5O1xuXHRcdHZhciBlbGFwc2VkO1xuXHRcdHZhciB2YWx1ZTtcblxuXHRcdGlmICh0aW1lIDwgX3N0YXJ0VGltZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9PT0gZmFsc2UpIHtcblxuXHRcdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdFx0X29uU3RhcnRDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGVsYXBzZWQgPSAodGltZSAtIF9zdGFydFRpbWUpIC8gX2R1cmF0aW9uO1xuXHRcdGVsYXBzZWQgPSBlbGFwc2VkID4gMSA/IDEgOiBlbGFwc2VkO1xuXG5cdFx0dmFsdWUgPSBfZWFzaW5nRnVuY3Rpb24oZWxhcHNlZCk7XG5cblx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNFbmQpIHtcblxuXHRcdFx0Ly8gRG9uJ3QgdXBkYXRlIHByb3BlcnRpZXMgdGhhdCBkbyBub3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3Rcblx0XHRcdGlmIChfdmFsdWVzU3RhcnRbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzdGFydCA9IF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gfHwgMDtcblx0XHRcdHZhciBlbmQgPSBfdmFsdWVzRW5kW3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKGVuZCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0X29iamVjdFtwcm9wZXJ0eV0gPSBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uKGVuZCwgdmFsdWUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFBhcnNlcyByZWxhdGl2ZSBlbmQgdmFsdWVzIHdpdGggc3RhcnQgYXMgYmFzZSAoZS5nLjogKzEwLCAtMylcblx0XHRcdFx0aWYgKHR5cGVvZiAoZW5kKSA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdGlmIChlbmQuY2hhckF0KDApID09PSAnKycgfHwgZW5kLmNoYXJBdCgwKSA9PT0gJy0nKSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBzdGFydCArIHBhcnNlRmxvYXQoZW5kKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZW5kID0gcGFyc2VGbG9hdChlbmQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFByb3RlY3QgYWdhaW5zdCBub24gbnVtZXJpYyBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRpZiAodHlwZW9mIChlbmQpID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdF9vYmplY3RbcHJvcGVydHldID0gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYgKF9vblVwZGF0ZUNhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25VcGRhdGVDYWxsYmFjay5jYWxsKF9vYmplY3QsIHZhbHVlKTtcblx0XHR9XG5cblx0XHRpZiAoZWxhcHNlZCA9PT0gMSkge1xuXG5cdFx0XHRpZiAoX3JlcGVhdCA+IDApIHtcblxuXHRcdFx0XHRpZiAoaXNGaW5pdGUoX3JlcGVhdCkpIHtcblx0XHRcdFx0XHRfcmVwZWF0LS07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWFzc2lnbiBzdGFydGluZyB2YWx1ZXMsIHJlc3RhcnQgYnkgbWFraW5nIHN0YXJ0VGltZSA9IG5vd1xuXHRcdFx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNTdGFydFJlcGVhdCkge1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gKyBwYXJzZUZsb2F0KF92YWx1ZXNFbmRbcHJvcGVydHldKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldO1xuXG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc0VuZFtwcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHRfdmFsdWVzRW5kW3Byb3BlcnR5XSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0X3JldmVyc2VkID0gIV9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfcmVwZWF0RGVsYXlUaW1lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9yZXBlYXREZWxheVRpbWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfZGVsYXlUaW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKF9vbkNvbXBsZXRlQ2FsbGJhY2sgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRcdFx0Ly8gTWFrZSB0aGUgY2hhaW5lZCB0d2VlbnMgc3RhcnQgZXhhY3RseSBhdCB0aGUgdGltZSB0aGV5IHNob3VsZCxcblx0XHRcdFx0XHQvLyBldmVuIGlmIHRoZSBgdXBkYXRlKClgIG1ldGhvZCB3YXMgY2FsbGVkIHdheSBwYXN0IHRoZSBkdXJhdGlvbiBvZiB0aGUgdHdlZW5cblx0XHRcdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdGFydChfc3RhcnRUaW1lICsgX2R1cmF0aW9uKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fTtcblxufTtcblxuXG5UV0VFTi5FYXNpbmcgPSB7XG5cblx0TGluZWFyOiB7XG5cblx0XHROb25lOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gaztcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YWRyYXRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogKDIgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtIDAuNSAqICgtLWsgKiAoayAtIDIpIC0gMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDdWJpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogayArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhcnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSAoLS1rICogayAqIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrIC0gMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWludGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICogayAqIGsgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFNpbnVzb2lkYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguY29zKGsgKiBNYXRoLlBJIC8gMik7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zaW4oayAqIE1hdGguUEkgLyAyKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGspKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEV4cG9uZW50aWFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coMTAyNCwgayAtIDEpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KDIsIC0gMTAgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoLSBNYXRoLnBvdygyLCAtIDEwICogKGsgLSAxKSkgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdENpcmN1bGFyOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoMSAtIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtICgtLWsgKiBrKSk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0gMC41ICogKE1hdGguc3FydCgxIC0gayAqIGspIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAoayAtPSAyKSAqIGspICsgMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFbGFzdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLU1hdGgucG93KDIsIDEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBNYXRoLnBvdygyLCAtMTAgKiBrKSAqIE1hdGguc2luKChrIC0gMC4xKSAqIDUgKiBNYXRoLlBJKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0ayAqPSAyO1xuXG5cdFx0XHRpZiAoayA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiBNYXRoLnBvdygyLCAxMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogTWF0aC5wb3coMiwgLTEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSkgKyAxO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0QmFjazoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogKChzICsgMSkgKiBrIC0gcyk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTggKiAxLjUyNTtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogKGsgKiBrICogKChzICsgMSkgKiBrIC0gcykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqICgocyArIDEpICogayArIHMpICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCb3VuY2U6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KDEgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgKDEgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogayAqIGs7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMiAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMS41IC8gMi43NSkpICogayArIDAuNzU7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMi41IC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgyLjI1IC8gMi43NSkpICogayArIDAuOTM3NTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMi42MjUgLyAyLjc1KSkgKiBrICsgMC45ODQzNzU7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgMC41KSB7XG5cdFx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLkluKGsgKiAyKSAqIDAuNTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KGsgKiAyIC0gMSkgKiAwLjUgKyAwLjU7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5UV0VFTi5JbnRlcnBvbGF0aW9uID0ge1xuXG5cdExpbmVhcjogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuTGluZWFyO1xuXG5cdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRyZXR1cm4gZm4odlswXSwgdlsxXSwgZik7XG5cdFx0fVxuXG5cdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRyZXR1cm4gZm4odlttXSwgdlttIC0gMV0sIG0gLSBmKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZm4odltpXSwgdltpICsgMSA+IG0gPyBtIDogaSArIDFdLCBmIC0gaSk7XG5cblx0fSxcblxuXHRCZXppZXI6IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgYiA9IDA7XG5cdFx0dmFyIG4gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIHB3ID0gTWF0aC5wb3c7XG5cdFx0dmFyIGJuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5CZXJuc3RlaW47XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBuOyBpKyspIHtcblx0XHRcdGIgKz0gcHcoMSAtIGssIG4gLSBpKSAqIHB3KGssIGkpICogdltpXSAqIGJuKG4sIGkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBiO1xuXG5cdH0sXG5cblx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQ2F0bXVsbFJvbTtcblxuXHRcdGlmICh2WzBdID09PSB2W21dKSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRpID0gTWF0aC5mbG9vcihmID0gbSAqICgxICsgaykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm4odlsoaSAtIDEgKyBtKSAlIG1dLCB2W2ldLCB2WyhpICsgMSkgJSBtXSwgdlsoaSArIDIpICUgbV0sIGYgLSBpKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gdlswXSAtIChmbih2WzBdLCB2WzBdLCB2WzFdLCB2WzFdLCAtZikgLSB2WzBdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRcdHJldHVybiB2W21dIC0gKGZuKHZbbV0sIHZbbV0sIHZbbSAtIDFdLCB2W20gLSAxXSwgZiAtIG0pIC0gdlttXSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbih2W2kgPyBpIC0gMSA6IDBdLCB2W2ldLCB2W20gPCBpICsgMSA/IG0gOiBpICsgMV0sIHZbbSA8IGkgKyAyID8gbSA6IGkgKyAyXSwgZiAtIGkpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0VXRpbHM6IHtcblxuXHRcdExpbmVhcjogZnVuY3Rpb24gKHAwLCBwMSwgdCkge1xuXG5cdFx0XHRyZXR1cm4gKHAxIC0gcDApICogdCArIHAwO1xuXG5cdFx0fSxcblxuXHRcdEJlcm5zdGVpbjogZnVuY3Rpb24gKG4sIGkpIHtcblxuXHRcdFx0dmFyIGZjID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5GYWN0b3JpYWw7XG5cblx0XHRcdHJldHVybiBmYyhuKSAvIGZjKGkpIC8gZmMobiAtIGkpO1xuXG5cdFx0fSxcblxuXHRcdEZhY3RvcmlhbDogKGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0dmFyIGEgPSBbMV07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAobikge1xuXG5cdFx0XHRcdHZhciBzID0gMTtcblxuXHRcdFx0XHRpZiAoYVtuXSkge1xuXHRcdFx0XHRcdHJldHVybiBhW25dO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IG47IGkgPiAxOyBpLS0pIHtcblx0XHRcdFx0XHRzICo9IGk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhW25dID0gcztcblx0XHRcdFx0cmV0dXJuIHM7XG5cblx0XHRcdH07XG5cblx0XHR9KSgpLFxuXG5cdFx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHAwLCBwMSwgcDIsIHAzLCB0KSB7XG5cblx0XHRcdHZhciB2MCA9IChwMiAtIHAwKSAqIDAuNTtcblx0XHRcdHZhciB2MSA9IChwMyAtIHAxKSAqIDAuNTtcblx0XHRcdHZhciB0MiA9IHQgKiB0O1xuXHRcdFx0dmFyIHQzID0gdCAqIHQyO1xuXG5cdFx0XHRyZXR1cm4gKDIgKiBwMSAtIDIgKiBwMiArIHYwICsgdjEpICogdDMgKyAoLSAzICogcDEgKyAzICogcDIgLSAyICogdjAgLSB2MSkgKiB0MiArIHYwICogdCArIHAxO1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgVFdFRU47XG4iLCJpbXBvcnQgVHdlZW4gZnJvbSBcIi4vVHdlZW5cIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICog6K6+572uIEFuaW1hdGlvbkZyYW1lIGJlZ2luXG4gKi9cbnZhciBsYXN0VGltZSA9IDA7XG52YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG5mb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbn07XG5pZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG59O1xuaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG59O1xuXG4vL+euoeeQhuaJgOacieWbvuihqOeahOa4suafk+S7u+WKoVxudmFyIF90YXNrTGlzdCA9IFtdOyAvL1t7IGlkIDogdGFzazogfS4uLl1cbnZhciBfcmVxdWVzdEFpZCA9IG51bGw7XG5cbmZ1bmN0aW9uIGVuYWJsZWRBbmltYXRpb25GcmFtZSgpe1xuICAgIGlmICghX3JlcXVlc3RBaWQpIHtcbiAgICAgICAgX3JlcXVlc3RBaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZnJhbWVfX1wiICsgX3Rhc2tMaXN0Lmxlbmd0aCk7XG4gICAgICAgICAgICAvL2lmICggVHdlZW4uZ2V0QWxsKCkubGVuZ3RoICkge1xuICAgICAgICAgICAgVHdlZW4udXBkYXRlKCk7IC8vdHdlZW7oh6rlt7HkvJrlgZpsZW5ndGjliKTmlq1cbiAgICAgICAgICAgIC8vfTtcbiAgICAgICAgICAgIHZhciBjdXJyVGFza0xpc3QgPSBfdGFza0xpc3Q7XG4gICAgICAgICAgICBfdGFza0xpc3QgPSBbXTtcbiAgICAgICAgICAgIF9yZXF1ZXN0QWlkID0gbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChjdXJyVGFza0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGN1cnJUYXNrTGlzdC5zaGlmdCgpLnRhc2soKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIF9yZXF1ZXN0QWlkO1xufTsgXG5cbi8qXG4gKiBAcGFyYW0gdGFzayDopoHliqDlhaXliLDmuLLmn5PluKfpmJ/liJfkuK3nmoTku7vliqFcbiAqIEByZXN1bHQgZnJhbWVpZFxuICovXG5mdW5jdGlvbiByZWdpc3RGcmFtZSggJGZyYW1lICkge1xuICAgIGlmICghJGZyYW1lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9O1xuICAgIF90YXNrTGlzdC5wdXNoKCRmcmFtZSk7XG4gICAgcmV0dXJuIGVuYWJsZWRBbmltYXRpb25GcmFtZSgpO1xufTtcblxuLypcbiAqICBAcGFyYW0gdGFzayDopoHku47muLLmn5PluKfpmJ/liJfkuK3liKDpmaTnmoTku7vliqFcbiAqL1xuZnVuY3Rpb24gZGVzdHJveUZyYW1lKCAkZnJhbWUgKSB7XG4gICAgdmFyIGRfcmVzdWx0ID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBfdGFza0xpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChfdGFza0xpc3RbaV0uaWQgPT09ICRmcmFtZS5pZCkge1xuICAgICAgICAgICAgZF9yZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgX3Rhc2tMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGwtLTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGlmIChfdGFza0xpc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoX3JlcXVlc3RBaWQpO1xuICAgICAgICBfcmVxdWVzdEFpZCA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZF9yZXN1bHQ7XG59O1xuXG5cbi8qIFxuICogQHBhcmFtIG9wdCB7ZnJvbSAsIHRvICwgb25VcGRhdGUgLCBvbkNvbXBsZXRlICwgLi4uLi4ufVxuICogQHJlc3VsdCB0d2VlblxuICovXG5mdW5jdGlvbiByZWdpc3RUd2VlbihvcHRpb25zKSB7XG4gICAgdmFyIG9wdCA9IF8uZXh0ZW5kKHtcbiAgICAgICAgZnJvbTogbnVsbCxcbiAgICAgICAgdG86IG51bGwsXG4gICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgIG9uU3RvcDogZnVuY3Rpb24oKXt9LFxuICAgICAgICByZXBlYXQ6IDAsXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgICBlYXNpbmc6ICdMaW5lYXIuTm9uZScsXG4gICAgICAgIGRlc2M6ICcnIC8v5Yqo55S75o+P6L+w77yM5pa55L6/5p+l5om+YnVnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB2YXIgdHdlZW4gPSB7fTtcbiAgICB2YXIgdGlkID0gXCJ0d2Vlbl9cIiArIFV0aWxzLmdldFVJRCgpO1xuICAgIG9wdC5pZCAmJiAoIHRpZCA9IHRpZCtcIl9cIitvcHQuaWQgKTtcblxuICAgIGlmIChvcHQuZnJvbSAmJiBvcHQudG8pIHtcbiAgICAgICAgdHdlZW4gPSBuZXcgVHdlZW4uVHdlZW4oIG9wdC5mcm9tIClcbiAgICAgICAgLnRvKCBvcHQudG8sIG9wdC5kdXJhdGlvbiApXG4gICAgICAgIC5vblN0YXJ0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvcHQub25TdGFydC5hcHBseSggdGhpcyApXG4gICAgICAgIH0pXG4gICAgICAgIC5vblVwZGF0ZSggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG9wdC5vblVwZGF0ZS5hcHBseSggdGhpcyApO1xuICAgICAgICB9IClcbiAgICAgICAgLm9uQ29tcGxldGUoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVzdHJveUZyYW1lKHtcbiAgICAgICAgICAgICAgICBpZDogdGlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR3ZWVuLl9pc0NvbXBsZXRlZWQgPSB0cnVlO1xuICAgICAgICAgICAgb3B0Lm9uQ29tcGxldGUuYXBwbHkoIHRoaXMgLCBbdGhpc10gKTsgLy/miafooYznlKjmiLfnmoRjb25Db21wbGV0ZVxuICAgICAgICB9IClcbiAgICAgICAgLm9uU3RvcCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGRlc3Ryb3lGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0d2Vlbi5faXNTdG9wZWQgPSB0cnVlO1xuICAgICAgICAgICAgb3B0Lm9uU3RvcC5hcHBseSggdGhpcyAsIFt0aGlzXSApO1xuICAgICAgICB9IClcbiAgICAgICAgLnJlcGVhdCggb3B0LnJlcGVhdCApXG4gICAgICAgIC5kZWxheSggb3B0LmRlbGF5IClcbiAgICAgICAgLmVhc2luZyggVHdlZW4uRWFzaW5nW29wdC5lYXNpbmcuc3BsaXQoXCIuXCIpWzBdXVtvcHQuZWFzaW5nLnNwbGl0KFwiLlwiKVsxXV0gKVxuICAgICAgICBcbiAgICAgICAgdHdlZW4uaWQgPSB0aWQ7XG4gICAgICAgIHR3ZWVuLnN0YXJ0KCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcblxuICAgICAgICAgICAgaWYgKCB0d2Vlbi5faXNDb21wbGV0ZWVkIHx8IHR3ZWVuLl9pc1N0b3BlZCApIHtcbiAgICAgICAgICAgICAgICB0d2VlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlZ2lzdEZyYW1lKHtcbiAgICAgICAgICAgICAgICBpZDogdGlkLFxuICAgICAgICAgICAgICAgIHRhc2s6IGFuaW1hdGUsXG4gICAgICAgICAgICAgICAgZGVzYzogb3B0LmRlc2MsXG4gICAgICAgICAgICAgICAgdHdlZW46IHR3ZWVuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgYW5pbWF0ZSgpO1xuXG4gICAgfTtcbiAgICByZXR1cm4gdHdlZW47XG59O1xuLypcbiAqIEBwYXJhbSB0d2VlblxuICogQHJlc3VsdCB2b2lkKDApXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3lUd2Vlbih0d2VlbiAsIG1zZykge1xuICAgIHR3ZWVuLnN0b3AoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZWdpc3RGcmFtZTogcmVnaXN0RnJhbWUsXG4gICAgZGVzdHJveUZyYW1lOiBkZXN0cm95RnJhbWUsXG4gICAgcmVnaXN0VHdlZW46IHJlZ2lzdFR3ZWVuLFxuICAgIGRlc3Ryb3lUd2VlbjogZGVzdHJveVR3ZWVuXG59OyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOWxnuaAp+W3peWOgu+8jGll5LiL6Z2i55SoVkJT5o+Q5L6b5pSv5oyBXG4gKiDmnaXnu5nmlbTkuKrlvJXmk47mj5Dkvpvlv4Pot7PljIXnmoTop6blj5HmnLrliLZcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLy/lrprkuYnlsIHoo4Xlpb3nmoTlhbzlrrnlpKfpg6jliIbmtY/op4jlmajnmoRkZWZpbmVQcm9wZXJ0aWVzIOeahCDlsZ7mgKflt6XljoJcbnZhciB1bndhdGNoT25lID0ge1xuICAgIFwiJHNraXBBcnJheVwiIDogMCxcbiAgICBcIiR3YXRjaFwiICAgICA6IDEsXG4gICAgXCIkZmlyZVwiICAgICAgOiAyLC8v5Li76KaB5pivZ2V0IHNldCDmmL7mgKforr7nva7nmoQg6Kem5Y+RXG4gICAgXCIkbW9kZWxcIiAgICAgOiAzLFxuICAgIFwiJGFjY2Vzc29yXCIgIDogNCxcbiAgICBcIiRvd25lclwiICAgICA6IDUsXG4gICAgLy9cInBhdGhcIiAgICAgICA6IDYsIC8v6L+Z5Liq5bqU6K+l5piv5ZSv5LiA5LiA5Liq5LiN55Sod2F0Y2jnmoTkuI3luKYk55qE5oiQ5ZGY5LqG5ZCn77yM5Zug5Li65Zyw5Zu+562J55qEcGF0aOaYr+WcqOWkquWkp1xuICAgIFwiJHBhcmVudFwiICAgIDogNyAgLy/nlKjkuo7lu7rnq4vmlbDmja7nmoTlhbPns7vpk75cbn1cblxuZnVuY3Rpb24gT2JzZXJ2ZShzY29wZSwgbW9kZWwsIHdhdGNoTW9yZSkge1xuXG4gICAgdmFyIHN0b3BSZXBlYXRBc3NpZ249dHJ1ZTtcblxuICAgIHZhciBza2lwQXJyYXkgPSBzY29wZS4kc2tpcEFycmF5LCAvL+imgeW/veeVpeebkeaOp+eahOWxnuaAp+WQjeWIl+ihqFxuICAgICAgICBwbW9kZWwgPSB7fSwgLy/opoHov5Tlm57nmoTlr7nosaFcbiAgICAgICAgYWNjZXNzb3JlcyA9IHt9LCAvL+WGhemDqOeUqOS6jui9rOaNoueahOWvueixoVxuICAgICAgICBWQlB1YmxpY3MgPSBfLmtleXMoIHVud2F0Y2hPbmUgKTsgLy/nlKjkuo5JRTYtOFxuXG4gICAgICAgIG1vZGVsID0gbW9kZWwgfHwge307Ly/ov5nmmK9wbW9kZWzkuIrnmoQkbW9kZWzlsZ7mgKdcbiAgICAgICAgd2F0Y2hNb3JlID0gd2F0Y2hNb3JlIHx8IHt9Oy8v5LulJOW8gOWktOS9huimgeW8uuWItuebkeWQrOeahOWxnuaAp1xuICAgICAgICBza2lwQXJyYXkgPSBfLmlzQXJyYXkoc2tpcEFycmF5KSA/IHNraXBBcnJheS5jb25jYXQoVkJQdWJsaWNzKSA6IFZCUHVibGljcztcblxuICAgIGZ1bmN0aW9uIGxvb3AobmFtZSwgdmFsKSB7XG4gICAgICAgIGlmICggIXVud2F0Y2hPbmVbbmFtZV0gfHwgKHVud2F0Y2hPbmVbbmFtZV0gJiYgbmFtZS5jaGFyQXQoMCkgIT09IFwiJFwiKSApIHtcbiAgICAgICAgICAgIG1vZGVsW25hbWVdID0gdmFsXG4gICAgICAgIH07XG4gICAgICAgIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgdmFsO1xuICAgICAgICBpZiAodmFsdWVUeXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGlmKCF1bndhdGNoT25lW25hbWVdKXtcbiAgICAgICAgICAgICAgVkJQdWJsaWNzLnB1c2gobmFtZSkgLy/lh73mlbDml6DpnIDopoHovazmjaJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmluZGV4T2Yoc2tpcEFycmF5LG5hbWUpICE9PSAtMSB8fCAobmFtZS5jaGFyQXQoMCkgPT09IFwiJFwiICYmICF3YXRjaE1vcmVbbmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFZCUHVibGljcy5wdXNoKG5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWNjZXNzb3IgPSBmdW5jdGlvbihuZW8pIHsgLy/liJvlu7rnm5HmjqflsZ7mgKfmiJbmlbDnu4TvvIzoh6rlj5jph4/vvIznlLHnlKjmiLfop6blj5HlhbbmlLnlj5hcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhY2Nlc3Nvci52YWx1ZSwgcHJlVmFsdWUgPSB2YWx1ZSwgY29tcGxleFZhbHVlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8v5YaZ5pON5L2cXG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IOeahCDlgLznmoQg57G75Z6LXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZW9UeXBlID0gdHlwZW9mIG5lbztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RvcFJlcGVhdEFzc2lnbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC8v6Zi75q2i6YeN5aSN6LWL5YC8XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBuZW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBuZW8gJiYgbmVvVHlwZSA9PT0gXCJvYmplY3RcIiAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKG5lbyBpbnN0YW5jZW9mIEFycmF5KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFuZW8uYWRkQ29sb3JTdG9wIC8vIG5lbyBpbnN0YW5jZW9mIENhbnZhc0dyYWRpZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5lby4kbW9kZWwgPyBuZW8gOiBPYnNlcnZlKG5lbyAsIG5lbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxleFZhbHVlID0gdmFsdWUuJG1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsvL+WmguaenOaYr+WFtuS7luaVsOaNruexu+Wei1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYoIG5lb1R5cGUgPT09IFwiYXJyYXlcIiApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHZhbHVlID0gXy5jbG9uZShuZW8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBuZW9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbFtuYW1lXSA9IGNvbXBsZXhWYWx1ZSA/IGNvbXBsZXhWYWx1ZSA6IHZhbHVlOy8v5pu05pawJG1vZGVs5Lit55qE5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBsZXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBtb2RlbC4kZmlyZSAmJiBwbW9kZWwuJGZpcmUobmFtZSwgdmFsdWUsIHByZVZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodmFsdWVUeXBlICE9IG5lb1R5cGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6cc2V055qE5YC857G75Z6L5bey57uP5pS55Y+Y77yMXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgqPkuYjkuZ/opoHmiorlr7nlupTnmoR2YWx1ZVR5cGXkv67mlLnkuLrlr7nlupTnmoRuZW9UeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlID0gbmVvVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNXYXRjaE1vZGVsID0gcG1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miYDmnInnmoTotYvlgLzpg73opoHop6blj5F3YXRjaOeahOebkeWQrOS6i+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhcG1vZGVsLiR3YXRjaCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGhhc1dhdGNoTW9kZWwuJHBhcmVudCApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNXYXRjaE1vZGVsID0gaGFzV2F0Y2hNb2RlbC4kcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGhhc1dhdGNoTW9kZWwuJHdhdGNoICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNXYXRjaE1vZGVsLiR3YXRjaC5jYWxsKGhhc1dhdGNoTW9kZWwgLCBuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy/or7vmk43kvZxcbiAgICAgICAgICAgICAgICAgICAgLy/or7vnmoTml7blgJnvvIzlj5HnjrB2YWx1ZeaYr+S4qm9iau+8jOiAjOS4lOi/mOayoeaciWRlZmluZVByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI5bCx5Li05pe2ZGVmaW5lUHJvcGVydHnkuIDmrKFcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZSAmJiAodmFsdWVUeXBlID09PSBcIm9iamVjdFwiKSBcbiAgICAgICAgICAgICAgICAgICAgICAgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSBcbiAgICAgICAgICAgICAgICAgICAgICAgJiYgIXZhbHVlLiRtb2RlbFxuICAgICAgICAgICAgICAgICAgICAgICAmJiAhdmFsdWUuYWRkQ29sb3JTdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W7uueri+WSjOeItuaVsOaNruiKgueCueeahOWFs+ezu1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuJHBhcmVudCA9IHBtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gT2JzZXJ2ZSh2YWx1ZSAsIHZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hY2Nlc3Nvci52YWx1ZSDph43mlrDlpI3liLbkuLpkZWZpbmVQcm9wZXJ0eei/h+WQjueahOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFjY2Vzc29yLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhY2Nlc3NvcmVzW25hbWVdID0ge1xuICAgICAgICAgICAgICAgIHNldDogYWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgZ2V0OiBhY2Nlc3NvcixcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGZvciAodmFyIGkgaW4gc2NvcGUpIHtcbiAgICAgICAgbG9vcChpLCBzY29wZVtpXSlcbiAgICB9O1xuXG4gICAgcG1vZGVsID0gZGVmaW5lUHJvcGVydGllcyhwbW9kZWwsIGFjY2Vzc29yZXMsIFZCUHVibGljcyk7Ly/nlJ/miJDkuIDkuKrnqbrnmoRWaWV3TW9kZWxcblxuICAgIF8uZm9yRWFjaChWQlB1YmxpY3MsZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBpZiAoc2NvcGVbbmFtZV0pIHsvL+WFiOS4uuWHveaVsOetieS4jeiiq+ebkeaOp+eahOWxnuaAp+i1i+WAvFxuICAgICAgICAgICAgaWYodHlwZW9mIHNjb3BlW25hbWVdID09IFwiZnVuY3Rpb25cIiApe1xuICAgICAgICAgICAgICAgcG1vZGVsW25hbWVdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgIHNjb3BlW25hbWVdLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIHBtb2RlbFtuYW1lXSA9IHNjb3BlW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwbW9kZWwuJG1vZGVsID0gbW9kZWw7XG4gICAgcG1vZGVsLiRhY2Nlc3NvciA9IGFjY2Vzc29yZXM7XG5cbiAgICBwbW9kZWwuaGFzT3duUHJvcGVydHkgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIHBtb2RlbC4kbW9kZWxcbiAgICB9O1xuXG4gICAgc3RvcFJlcGVhdEFzc2lnbiA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHBtb2RlbFxufVxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG4gICAgLy/lpoLmnpzmtY/op4jlmajkuI3mlK/mjIFlY21hMjYydjXnmoRPYmplY3QuZGVmaW5lUHJvcGVydGllc+aIluiAheWtmOWcqEJVR++8jOavlOWmgklFOFxuICAgIC8v5qCH5YeG5rWP6KeI5Zmo5L2/55SoX19kZWZpbmVHZXR0ZXJfXywgX19kZWZpbmVTZXR0ZXJfX+WunueOsFxuICAgIHRyeSB7XG4gICAgICAgIGRlZmluZVByb3BlcnR5KHt9LCBcIl9cIiwge1xuICAgICAgICAgICAgdmFsdWU6IFwieFwiXG4gICAgICAgIH0pXG4gICAgICAgIHZhciBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChcIl9fZGVmaW5lR2V0dGVyX19cIiBpbiBPYmplY3QpIHtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wLCBkZXNjKSB7XG4gICAgICAgICAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBkZXNjLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgnZ2V0JyBpbiBkZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5fX2RlZmluZUdldHRlcl9fKHByb3AsIGRlc2MuZ2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJ3NldCcgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmouX19kZWZpbmVTZXR0ZXJfXyhwcm9wLCBkZXNjLnNldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihvYmosIGRlc2NzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkZXNjcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3MuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzY3NbcHJvcF0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbi8vSUU2LTjkvb/nlKhWQlNjcmlwdOexu+eahHNldCBnZXTor63lj6Xlrp7njrBcbmlmICghZGVmaW5lUHJvcGVydGllcyAmJiB3aW5kb3cuVkJBcnJheSkge1xuICAgIHdpbmRvdy5leGVjU2NyaXB0KFtcbiAgICAgICAgICAgIFwiRnVuY3Rpb24gcGFyc2VWQihjb2RlKVwiLFxuICAgICAgICAgICAgXCJcXHRFeGVjdXRlR2xvYmFsKGNvZGUpXCIsXG4gICAgICAgICAgICBcIkVuZCBGdW5jdGlvblwiXG4gICAgICAgICAgICBdLmpvaW4oXCJcXG5cIiksIFwiVkJTY3JpcHRcIik7XG5cbiAgICBmdW5jdGlvbiBWQk1lZGlhdG9yKGRlc2NyaXB0aW9uLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZm4gPSBkZXNjcmlwdGlvbltuYW1lXSAmJiBkZXNjcmlwdGlvbltuYW1lXS5zZXQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBmbih2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKHB1YmxpY3MsIGRlc2NyaXB0aW9uLCBhcnJheSkge1xuICAgICAgICBwdWJsaWNzID0gYXJyYXkuc2xpY2UoMCk7XG4gICAgICAgIHB1YmxpY3MucHVzaChcImhhc093blByb3BlcnR5XCIpO1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJWQkNsYXNzXCIgKyBzZXRUaW1lb3V0KFwiMVwiKSwgb3duZXIgPSB7fSwgYnVmZmVyID0gW107XG4gICAgICAgIGJ1ZmZlci5wdXNoKFxuICAgICAgICAgICAgICAgIFwiQ2xhc3MgXCIgKyBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgXCJcXHRQcml2YXRlIFtfX2RhdGFfX10sIFtfX3Byb3h5X19dXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgRGVmYXVsdCBGdW5jdGlvbiBbX19jb25zdF9fXShkLCBwKVwiLFxuICAgICAgICAgICAgICAgIFwiXFx0XFx0U2V0IFtfX2RhdGFfX10gPSBkOiBzZXQgW19fcHJveHlfX10gPSBwXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRcXHRTZXQgW19fY29uc3RfX10gPSBNZVwiLCAvL+mTvuW8j+iwg+eUqFxuICAgICAgICAgICAgICAgIFwiXFx0RW5kIEZ1bmN0aW9uXCIpO1xuICAgICAgICBfLmZvckVhY2gocHVibGljcyxmdW5jdGlvbihuYW1lKSB7IC8v5re75Yqg5YWs5YWx5bGe5oCnLOWmguaenOatpOaXtuS4jeWKoOS7peWQjuWwseayoeacuuS8muS6hlxuICAgICAgICAgICAgaWYgKG93bmVyW25hbWVdICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgb3duZXJbbmFtZV0gPSB0cnVlIC8v5Zug5Li6VkJTY3JpcHTlr7nosaHkuI3og73lg49KU+mCo+agt+maj+aEj+WinuWIoOWxnuaAp1xuICAgICAgICAgICAgYnVmZmVyLnB1c2goXCJcXHRQdWJsaWMgW1wiICsgbmFtZSArIFwiXVwiKSAvL+S9oOWPr+S7pemihOWFiOaUvuWIsHNraXBBcnJheeS4rVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgb3duZXJbbmFtZV0gPSB0cnVlXG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+eUseS6juS4jeefpeWvueaWueS8muS8oOWFpeS7gOS5iCzlm6DmraRzZXQsIGxldOmDveeUqOS4ilxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgUHJvcGVydHkgTGV0IFtcIiArIG5hbWUgKyBcIl0odmFsKVwiLCAvL3NldHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRDYWxsIFtfX3Byb3h5X19dKFtfX2RhdGFfX10sIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIsIHZhbClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIFByb3BlcnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBQcm9wZXJ0eSBTZXQgW1wiICsgbmFtZSArIFwiXSh2YWwpXCIsIC8vc2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdENhbGwgW19fcHJveHlfX10oW19fZGF0YV9fXSwgXFxcIlwiICsgbmFtZSArIFwiXFxcIiwgdmFsKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgUHJvcGVydHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIFByb3BlcnR5IEdldCBbXCIgKyBuYW1lICsgXCJdXCIsIC8vZ2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdE9uIEVycm9yIFJlc3VtZSBOZXh0XCIsIC8v5b+F6aG75LyY5YWI5L2/55Soc2V06K+t5Y+lLOWQpuWImeWug+S8muivr+WwhuaVsOe7hOW9k+Wtl+espuS4sui/lOWbnlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRTZXRbXCIgKyBuYW1lICsgXCJdID0gW19fcHJveHlfX10oW19fZGF0YV9fXSxcXFwiXCIgKyBuYW1lICsgXCJcXFwiKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRJZiBFcnIuTnVtYmVyIDw+IDAgVGhlblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRbXCIgKyBuYW1lICsgXCJdID0gW19fcHJveHlfX10oW19fZGF0YV9fXSxcXFwiXCIgKyBuYW1lICsgXCJcXFwiKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgSWZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0T24gRXJyb3IgR290byAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBQcm9wZXJ0eVwiKVxuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5wdXNoKFwiRW5kIENsYXNzXCIpOyAvL+exu+WumuS5ieWujOavlVxuICAgICAgICBidWZmZXIucHVzaChcbiAgICAgICAgICAgICAgICBcIkZ1bmN0aW9uIFwiICsgY2xhc3NOYW1lICsgXCJGYWN0b3J5KGEsIGIpXCIsIC8v5Yib5bu65a6e5L6L5bm25Lyg5YWl5Lik5Liq5YWz6ZSu55qE5Y+C5pWwXG4gICAgICAgICAgICAgICAgXCJcXHREaW0gb1wiLFxuICAgICAgICAgICAgICAgIFwiXFx0U2V0IG8gPSAoTmV3IFwiICsgY2xhc3NOYW1lICsgXCIpKGEsIGIpXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRTZXQgXCIgKyBjbGFzc05hbWUgKyBcIkZhY3RvcnkgPSBvXCIsXG4gICAgICAgICAgICAgICAgXCJFbmQgRnVuY3Rpb25cIik7XG4gICAgICAgIHdpbmRvdy5wYXJzZVZCKGJ1ZmZlci5qb2luKFwiXFxyXFxuXCIpKTsvL+WFiOWIm+W7uuS4gOS4qlZC57G75bel5Y6CXG4gICAgICAgIHJldHVybiAgd2luZG93W2NsYXNzTmFtZSArIFwiRmFjdG9yeVwiXShkZXNjcmlwdGlvbiwgVkJNZWRpYXRvcik7Ly/lvpfliLDlhbbkuqflk4FcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBPYnNlcnZlO1xuXG4iLCJcbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gX19WRVJTSU9OX187XG5cbmV4cG9ydCBjb25zdCBQSV8yID0gTWF0aC5QSSAqIDI7XG5cbmV4cG9ydCBjb25zdCBSQURfVE9fREVHID0gMTgwIC8gTWF0aC5QSTtcblxuZXhwb3J0IGNvbnN0IERFR19UT19SQUQgPSBNYXRoLlBJIC8gMTgwO1xuXG5leHBvcnQgY29uc3QgUkVOREVSRVJfVFlQRSA9IHtcbiAgICBVTktOT1dOOiAgICAwLFxuICAgIFdFQkdMOiAgICAgIDEsXG4gICAgQ0FOVkFTOiAgICAgMixcbn07XG5cbmV4cG9ydCBjb25zdCBEUkFXX01PREVTID0ge1xuICAgIFBPSU5UUzogICAgICAgICAwLFxuICAgIExJTkVTOiAgICAgICAgICAxLFxuICAgIExJTkVfTE9PUDogICAgICAyLFxuICAgIExJTkVfU1RSSVA6ICAgICAzLFxuICAgIFRSSUFOR0xFUzogICAgICA0LFxuICAgIFRSSUFOR0xFX1NUUklQOiA1LFxuICAgIFRSSUFOR0xFX0ZBTjogICA2LFxufTtcblxuZXhwb3J0IGNvbnN0IFNIQVBFUyA9IHtcbiAgICBQT0xZOiAwLFxuICAgIFJFQ1Q6IDEsXG4gICAgQ0lSQzogMixcbiAgICBFTElQOiAzLFxuICAgIFJSRUM6IDQsXG59O1xuXG5leHBvcnQgY29uc3QgQ09OVEVYVF9ERUZBVUxUID0ge1xuICAgIHdpZHRoICAgICAgICAgOiAwLFxuICAgIGhlaWdodCAgICAgICAgOiAwLFxuICAgIHggICAgICAgICAgICAgOiAwLFxuICAgIHkgICAgICAgICAgICAgOiAwLFxuICAgIHNjYWxlWCAgICAgICAgOiAxLFxuICAgIHNjYWxlWSAgICAgICAgOiAxLFxuICAgIHNjYWxlT3JpZ2luICAgOiB7XG4gICAgICAgIHggOiAwLFxuICAgICAgICB5IDogMFxuICAgIH0sXG4gICAgcm90YXRpb24gICAgICA6IDAsXG4gICAgcm90YXRlT3JpZ2luICA6ICB7XG4gICAgICAgIHggOiAwLFxuICAgICAgICB5IDogMFxuICAgIH0sXG4gICAgdmlzaWJsZSAgICAgICA6IHRydWUsXG4gICAgY3Vyc29yICAgICAgICA6IFwiZGVmYXVsdFwiLFxuICAgIC8vY2FudmFzIGNvbnRleHQgMmQg55qEIOezu+e7n+agt+W8j+OAguebruWJjeWwseefpemBk+i/meS5iOWkmlxuICAgIGZpbGxTdHlsZSAgICAgOiBudWxsLC8vXCIjMDAwMDAwXCIsXG4gICAgbGluZUNhcCAgICAgICA6IG51bGwsXG4gICAgbGluZUpvaW4gICAgICA6IG51bGwsXG4gICAgbGluZVdpZHRoICAgICA6IG51bGwsXG4gICAgbWl0ZXJMaW1pdCAgICA6IG51bGwsXG4gICAgc2hhZG93Qmx1ciAgICA6IG51bGwsXG4gICAgc2hhZG93Q29sb3IgICA6IG51bGwsXG4gICAgc2hhZG93T2Zmc2V0WCA6IG51bGwsXG4gICAgc2hhZG93T2Zmc2V0WSA6IG51bGwsXG4gICAgc3Ryb2tlU3R5bGUgICA6IG51bGwsXG4gICAgZ2xvYmFsQWxwaGEgICA6IDEsXG4gICAgZm9udCAgICAgICAgICA6IG51bGwsXG4gICAgdGV4dEFsaWduICAgICA6IFwibGVmdFwiLFxuICAgIHRleHRCYXNlbGluZSAgOiBcInRvcFwiLCBcbiAgICBhcmNTY2FsZVhfICAgIDogbnVsbCxcbiAgICBhcmNTY2FsZVlfICAgIDogbnVsbCxcbiAgICBsaW5lU2NhbGVfICAgIDogbnVsbCxcbiAgICBnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gOiBudWxsXG59O1xuXG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyBEaXNwbGF5TGlzdCDnmoQg546w5a6e5a+56LGh5Z+657G7XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbmltcG9ydCBNYXRyaXggZnJvbSBcIi4uL2dlb20vTWF0cml4XCI7XG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vUG9pbnRcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBIaXRUZXN0UG9pbnQgZnJvbSBcIi4uL2dlb20vSGl0VGVzdFBvaW50XCI7XG5pbXBvcnQgQW5pbWF0aW9uRnJhbWUgZnJvbSBcIi4uL2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZVwiO1xuaW1wb3J0IE9ic2VydmUgZnJvbSBcIi4uL3V0aWxzL29ic2VydmVcIjtcbmltcG9ydCB7Q09OVEVYVF9ERUZBVUxUfSBmcm9tIFwiLi4vY29uc3RcIlxuXG52YXIgRGlzcGxheU9iamVjdCA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgRGlzcGxheU9iamVjdC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy/lpoLmnpznlKjmiLfmsqHmnInkvKDlhaVjb250ZXh06K6+572u77yM5bCx6buY6K6k5Li656m655qE5a+56LGhXG4gICAgb3B0ICAgICAgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XG5cbiAgICAvL+iuvue9rum7mOiupOWxnuaAp1xuICAgIHNlbGYuaWQgID0gb3B0LmlkIHx8IG51bGw7XG5cbiAgICAvL+ebuOWvueeItue6p+WFg+e0oOeahOefqemYtVxuICAgIHNlbGYuX3RyYW5zZm9ybSAgICAgID0gbnVsbDtcblxuICAgIC8v5b+D6Lez5qyh5pWwXG4gICAgc2VsZi5faGVhcnRCZWF0TnVtICAgPSAwO1xuXG4gICAgLy/lhYPntKDlr7nlupTnmoRzdGFnZeWFg+e0oFxuICAgIHNlbGYuc3RhZ2UgICAgICAgICAgID0gbnVsbDtcblxuICAgIC8v5YWD57Sg55qE54i25YWD57SgXG4gICAgc2VsZi5wYXJlbnQgICAgICAgICAgPSBudWxsO1xuXG4gICAgc2VsZi5fZXZlbnRFbmFibGVkICAgPSBmYWxzZTsgICAvL+aYr+WQpuWTjeW6lOS6i+S7tuS6pOS6kizlnKjmt7vliqDkuobkuovku7bkvqblkKzlkI7kvJroh6rliqjorr7nva7kuLp0cnVlXG5cbiAgICBzZWxmLmRyYWdFbmFibGVkICAgICA9IHRydWUgOy8vXCJkcmFnRW5hYmxlZFwiIGluIG9wdCA/IG9wdC5kcmFnRW5hYmxlZCA6IGZhbHNlOyAgIC8v5piv5ZCm5ZCv55So5YWD57Sg55qE5ouW5ou9XG5cbiAgICBzZWxmLnh5VG9JbnQgICAgICAgICA9IFwieHlUb0ludFwiIGluIG9wdCA/IG9wdC54eVRvSW50IDogdHJ1ZTsgICAgLy/mmK/lkKblr7l4eeWdkOagh+e7n+S4gGludOWkhOeQhu+8jOm7mOiupOS4unRydWXvvIzkvYbmmK/mnInnmoTml7blgJnlj6/ku6XnlLHlpJbnlYznlKjmiLfmiYvliqjmjIflrprmmK/lkKbpnIDopoHorqHnrpfkuLppbnTvvIzlm6DkuLrmnInnmoTml7blgJnkuI3orqHnrpfmr5TovoPlpb3vvIzmr5TlpoLvvIzov5vluqblm77ooajkuK3vvIzlho1zZWN0b3LnmoTkuKTnq6/mt7vliqDkuKTkuKrlnIbmnaXlgZrlnIbop5LnmoTov5vluqbmnaHnmoTml7blgJnvvIzlnIZjaXJjbGXkuI3lgZppbnTorqHnrpfvvIzmiY3og73lkoxzZWN0b3Lmm7Tlpb3nmoTooZTmjqVcblxuICAgIHNlbGYubW92ZWluZyAgICAgICAgID0gZmFsc2U7IC8v5aaC5p6c5YWD57Sg5Zyo5pyA6L2o6YGT6L+Q5Yqo5Lit55qE5pe25YCZ77yM5pyA5aW95oqK6L+Z5Liq6K6+572u5Li6dHJ1Ze+8jOi/meagt+iDveS/neivgei9qOi/ueeahOS4neaQrOmhuua7ke+8jOWQpuWImeWboOS4unh5VG9JbnTnmoTljp/lm6DvvIzkvJrmnInot7Pot4NcblxuICAgIC8v5Yib5bu65aW9Y29udGV4dFxuICAgIHNlbGYuX2NyZWF0ZUNvbnRleHQoIG9wdCApO1xuXG4gICAgdmFyIFVJRCA9IFV0aWxzLmNyZWF0ZUlkKHNlbGYudHlwZSk7XG5cbiAgICAvL+WmguaenOayoeaciWlkIOWImSDmsr/nlKh1aWRcbiAgICBpZihzZWxmLmlkID09IG51bGwpe1xuICAgICAgICBzZWxmLmlkID0gVUlEIDtcbiAgICB9O1xuXG4gICAgc2VsZi5pbml0LmFwcGx5KHNlbGYgLCBhcmd1bWVudHMpO1xuXG4gICAgLy/miYDmnInlsZ7mgKflh4blpIflpb3kuoblkI7vvIzlhYjopoHorqHnrpfkuIDmrKF0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKeW+l+WIsF90YW5zZm9ybVxuICAgIHRoaXMuX3VwZGF0ZVRyYW5zZm9ybSgpO1xufTtcblxuXG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3QgLCBFdmVudERpc3BhdGNoZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7fSxcbiAgICBfY3JlYXRlQ29udGV4dCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+aJgOacieaYvuekuuWvueixoe+8jOmDveacieS4gOS4quexu+S8vGNhbnZhcy5jb250ZXh057G75Ly855qEIGNvbnRleHTlsZ7mgKdcbiAgICAgICAgLy/nlKjmnaXlrZjlj5bmlLnmmL7npLrlr7nosaHmiYDmnInlkozmmL7npLrmnInlhbPnmoTlsZ7mgKfvvIzlnZDmoIfvvIzmoLflvI/nrYnjgIJcbiAgICAgICAgLy/or6Xlr7nosaHkuLpDb2VyLk9ic2VydmUoKeW3peWOguWHveaVsOeUn+aIkFxuICAgICAgICBzZWxmLmNvbnRleHQgPSBudWxsO1xuXG4gICAgICAgIC8v5o+Q5L6b57uZQ29lci5PYnNlcnZlKCkg5p2lIOe7mSBzZWxmLmNvbnRleHQg6K6+572uIHByb3BlcnR5c1xuICAgICAgICAvL+i/memHjOS4jeiDveeUqF8uZXh0ZW5k77yMIOWboOS4uuimgeS/neivgV9jb250ZXh0QVRUUlPnmoTnuq/nsrnvvIzlj6ropobnm5bkuIvpnaLlt7LmnInnmoTlsZ7mgKdcbiAgICAgICAgdmFyIF9jb250ZXh0QVRUUlMgPSBVdGlscy5jb3B5MmNvbnRleHQoIF8uY2xvbmUoQ09OVEVYVF9ERUZBVUxUKSwgb3B0LmNvbnRleHQgLCB0cnVlICk7ICAgICAgICAgICAgXG5cbiAgICAgICAgLy/nhLblkI7nnIvnu6fmib/ogIXmmK/lkKbmnInmj5DkvptfY29udGV4dCDlr7nosaEg6ZyA6KaBIOaIkSBtZXJnZeWIsF9jb250ZXh0MkRfY29udGV4dOS4reWOu+eahFxuICAgICAgICBpZiAoc2VsZi5fY29udGV4dCkge1xuICAgICAgICAgICAgX2NvbnRleHRBVFRSUyA9IF8uZXh0ZW5kKHRydWUsIF9jb250ZXh0QVRUUlMsIHNlbGYuX2NvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/mnInkupvlvJXmk47lhoXpg6jorr7nva5jb250ZXh05bGe5oCn55qE5pe25YCZ5piv5LiN55So5LiK5oql5b+D6Lez55qE77yM5q+U5aaC5YGaaGl0VGVzdFBvaW5054Ot54K55qOA5rWL55qE5pe25YCZXG4gICAgICAgIHNlbGYuX25vdFdhdGNoID0gZmFsc2U7XG5cbiAgICAgICAgX2NvbnRleHRBVFRSUy4kb3duZXIgPSBzZWxmO1xuICAgICAgICBfY29udGV4dEFUVFJTLiR3YXRjaCA9IGZ1bmN0aW9uKG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlKXtcblxuICAgICAgICAgICAgLy/kuIvpnaLnmoTov5nkupvlsZ7mgKflj5jljJbvvIzpg73kvJrpnIDopoHph43mlrDnu4Tnu4fnn6npmLXlsZ7mgKcgX3RyYW5zZm9ybSBcbiAgICAgICAgICAgIHZhciB0cmFuc0Zvcm1Qcm9wcyA9IFsgXCJ4XCIgLCBcInlcIiAsIFwic2NhbGVYXCIgLCBcInNjYWxlWVwiICwgXCJyb3RhdGlvblwiICwgXCJzY2FsZU9yaWdpblwiICwgXCJyb3RhdGVPcmlnaW4sIGxpbmVXaWR0aFwiIF07XG5cbiAgICAgICAgICAgIGlmKCBfLmluZGV4T2YoIHRyYW5zRm9ybVByb3BzICwgbmFtZSApID49IDAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kb3duZXIuX3VwZGF0ZVRyYW5zZm9ybSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMuJG93bmVyLl9ub3RXYXRjaCApe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKCB0aGlzLiRvd25lci4kd2F0Y2ggKXtcbiAgICAgICAgICAgICAgICB0aGlzLiRvd25lci4kd2F0Y2goIG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLiRvd25lci5oZWFydEJlYXQoIHtcbiAgICAgICAgICAgICAgICBjb252ZXJ0VHlwZTpcImNvbnRleHRcIixcbiAgICAgICAgICAgICAgICBzaGFwZSAgICAgIDogdGhpcy4kb3duZXIsXG4gICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWUgICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHByZVZhbHVlICAgOiBwcmVWYWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcblxuICAgICAgICAvL+aJp+ihjGluaXTkuYvliY3vvIzlupTor6XlsLHmoLnmja7lj4LmlbDvvIzmiopjb250ZXh057uE57uH5aW957q/XG4gICAgICAgIHNlbGYuY29udGV4dCA9IE9ic2VydmUoIF9jb250ZXh0QVRUUlMgKTtcbiAgICB9LFxuICAgIC8qIEBteXNlbGYg5piv5ZCm55Sf5oiQ6Ieq5bex55qE6ZWc5YOPIFxuICAgICAqIOWFi+mahuWPiOS4pOenje+8jOS4gOenjeaYr+mVnOWDj++8jOWPpuWkluS4gOenjeaYr+e7neWvueaEj+S5ieS4iumdoueahOaWsOS4quS9k1xuICAgICAqIOm7mOiupOS4uue7neWvueaEj+S5ieS4iumdoueahOaWsOS4quS9k++8jOaWsOWvueixoWlk5LiN6IO955u45ZCMXG4gICAgICog6ZWc5YOP5Z+65pys5LiK5piv5qGG5p625YaF6YOo5Zyo5a6e546wICDplZzlg4/nmoRpZOebuOWQjCDkuLvopoHnlKjmnaXmioroh6rlt7HnlLvliLDlj6blpJbnmoRzdGFnZemHjOmdou+8jOavlOWmglxuICAgICAqIG1vdXNlb3ZlcuWSjG1vdXNlb3V055qE5pe25YCZ6LCD55SoKi9cbiAgICBjbG9uZSA6IGZ1bmN0aW9uKCBteXNlbGYgKXtcbiAgICAgICAgdmFyIGNvbmYgICA9IHtcbiAgICAgICAgICAgIGlkICAgICAgOiB0aGlzLmlkLFxuICAgICAgICAgICAgY29udGV4dCA6IF8uY2xvbmUodGhpcy5jb250ZXh0LiRtb2RlbClcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbmV3T2JqO1xuICAgICAgICBpZiggdGhpcy50eXBlID09ICd0ZXh0JyApe1xuICAgICAgICAgICAgbmV3T2JqID0gbmV3IHRoaXMuY29uc3RydWN0b3IoIHRoaXMudGV4dCAsIGNvbmYgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld09iaiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKCBjb25mICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5jaGlsZHJlbiApe1xuICAgICAgICAgICAgbmV3T2JqLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbXlzZWxmKXtcbiAgICAgICAgICAgIG5ld09iai5pZCAgICAgICA9IFV0aWxzLmNyZWF0ZUlkKG5ld09iai50eXBlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9LFxuICAgIGhlYXJ0QmVhdCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIC8vc3RhZ2XlrZjlnKjvvIzmiY3or7RzZWxm5Luj6KGo55qEZGlzcGxheeW3sue7j+iiq+a3u+WKoOWIsOS6hmRpc3BsYXlMaXN05Lit77yM57uY5Zu+5byV5pOO6ZyA6KaB55+l6YGT5YW25pS55Y+Y5ZCOXG4gICAgICAgIC8v55qE5bGe5oCn77yM5omA5Lul77yM6YCa55+l5Yiwc3RhZ2UuZGlzcGxheUF0dHJIYXNDaGFuZ2VcbiAgICAgICAgdmFyIHN0YWdlID0gdGhpcy5nZXRTdGFnZSgpO1xuICAgICAgICBpZiggc3RhZ2UgKXtcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0QmVhdE51bSArKztcbiAgICAgICAgICAgIHN0YWdlLmhlYXJ0QmVhdCAmJiBzdGFnZS5oZWFydEJlYXQoIG9wdCApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRDdXJyZW50V2lkdGggOiBmdW5jdGlvbigpe1xuICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLmNvbnRleHQud2lkdGggKiB0aGlzLmNvbnRleHQuc2NhbGVYKTtcbiAgICB9LFxuICAgIGdldEN1cnJlbnRIZWlnaHQgOiBmdW5jdGlvbigpe1xuICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLmNvbnRleHQuaGVpZ2h0ICogdGhpcy5jb250ZXh0LnNjYWxlWSk7XG4gICAgfSxcbiAgICBnZXRTdGFnZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLnN0YWdlICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBwID0gdGhpcztcbiAgICAgICAgaWYgKHAudHlwZSAhPSBcInN0YWdlXCIpe1xuICAgICAgICAgIHdoaWxlKHAucGFyZW50KSB7XG4gICAgICAgICAgICBwID0gcC5wYXJlbnQ7XG4gICAgICAgICAgICBpZiAocC50eXBlID09IFwic3RhZ2VcIil7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHAudHlwZSAhPT0gXCJzdGFnZVwiKSB7XG4gICAgICAgICAgICAvL+WmguaenOW+l+WIsOeahOmhtueCuWRpc3BsYXkg55qEdHlwZeS4jeaYr1N0YWdlLOS5n+WwseaYr+ivtOS4jeaYr3N0YWdl5YWD57SgXG4gICAgICAgICAgICAvL+mCo+S5iOWPquiDveivtOaYjui/meS4qnDmiYDku6PooajnmoTpobbnq69kaXNwbGF5IOi/mOayoeaciea3u+WKoOWIsGRpc3BsYXlMaXN05Lit77yM5Lmf5bCx5piv5rKh5pyJ5rKh5re75Yqg5YiwXG4gICAgICAgICAgICAvL3N0YWdl6Iie5Y+w55qEY2hpbGRlbumYn+WIl+S4re+8jOS4jeWcqOW8leaTjua4suafk+iMg+WbtOWGhVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgLy/kuIDnm7Tlm57muq/liLDpobblsYJvYmplY3TvvIwg5Y2z5pivc3RhZ2XvvIwgc3RhZ2XnmoRwYXJlbnTkuLpudWxsXG4gICAgICAgIHRoaXMuc3RhZ2UgPSBwO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9LFxuICAgIGxvY2FsVG9HbG9iYWwgOiBmdW5jdGlvbiggcG9pbnQgLCBjb250YWluZXIgKXtcbiAgICAgICAgIXBvaW50ICYmICggcG9pbnQgPSBuZXcgUG9pbnQoIDAgLCAwICkgKTtcbiAgICAgICAgdmFyIGNtID0gdGhpcy5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoIGNvbnRhaW5lciApO1xuXG4gICAgICAgIGlmIChjbSA9PSBudWxsKSByZXR1cm4gUG9pbnQoIDAgLCAwICk7XG4gICAgICAgIHZhciBtID0gbmV3IE1hdHJpeCgxLCAwLCAwLCAxLCBwb2ludC54ICwgcG9pbnQueSk7XG4gICAgICAgIG0uY29uY2F0KGNtKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggbS50eCAsIG0udHkgKTsgLy97eDptLnR4LCB5Om0udHl9O1xuICAgIH0sXG4gICAgZ2xvYmFsVG9Mb2NhbCA6IGZ1bmN0aW9uKCBwb2ludCAsIGNvbnRhaW5lcikge1xuICAgICAgICAhcG9pbnQgJiYgKCBwb2ludCA9IG5ldyBQb2ludCggMCAsIDAgKSApO1xuXG4gICAgICAgIGlmKCB0aGlzLnR5cGUgPT0gXCJzdGFnZVwiICl7XG4gICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNtID0gdGhpcy5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoIGNvbnRhaW5lciApO1xuXG4gICAgICAgIGlmIChjbSA9PSBudWxsKSByZXR1cm4gbmV3IFBvaW50KCAwICwgMCApOyAvL3t4OjAsIHk6MH07XG4gICAgICAgIGNtLmludmVydCgpO1xuICAgICAgICB2YXIgbSA9IG5ldyBNYXRyaXgoMSwgMCwgMCwgMSwgcG9pbnQueCAsIHBvaW50LnkpO1xuICAgICAgICBtLmNvbmNhdChjbSk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIG0udHggLCBtLnR5ICk7IC8ve3g6bS50eCwgeTptLnR5fTtcbiAgICB9LFxuICAgIGxvY2FsVG9UYXJnZXQgOiBmdW5jdGlvbiggcG9pbnQgLCB0YXJnZXQpe1xuICAgICAgICB2YXIgcCA9IGxvY2FsVG9HbG9iYWwoIHBvaW50ICk7XG4gICAgICAgIHJldHVybiB0YXJnZXQuZ2xvYmFsVG9Mb2NhbCggcCApO1xuICAgIH0sXG4gICAgZ2V0Q29uY2F0ZW5hdGVkTWF0cml4IDogZnVuY3Rpb24oIGNvbnRhaW5lciApe1xuICAgICAgICB2YXIgY20gPSBuZXcgTWF0cml4KCk7XG4gICAgICAgIGZvciAodmFyIG8gPSB0aGlzOyBvICE9IG51bGw7IG8gPSBvLnBhcmVudCkge1xuICAgICAgICAgICAgY20uY29uY2F0KCBvLl90cmFuc2Zvcm0gKTtcbiAgICAgICAgICAgIGlmKCAhby5wYXJlbnQgfHwgKCBjb250YWluZXIgJiYgby5wYXJlbnQgJiYgby5wYXJlbnQgPT0gY29udGFpbmVyICkgfHwgKCBvLnBhcmVudCAmJiBvLnBhcmVudC50eXBlPT1cInN0YWdlXCIgKSApIHtcbiAgICAgICAgICAgIC8vaWYoIG8udHlwZSA9PSBcInN0YWdlXCIgfHwgKG8ucGFyZW50ICYmIGNvbnRhaW5lciAmJiBvLnBhcmVudC50eXBlID09IGNvbnRhaW5lci50eXBlICkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNtOy8vYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNtO1xuICAgIH0sXG4gICAgLypcbiAgICAgKuiuvue9ruWFg+e0oOeahOaYr+WQpuWTjeW6lOS6i+S7tuajgOa1i1xuICAgICAqQGJvb2wgIEJvb2xlYW4g57G75Z6LXG4gICAgICovXG4gICAgc2V0RXZlbnRFbmFibGUgOiBmdW5jdGlvbiggYm9vbCApe1xuICAgICAgICBpZihfLmlzQm9vbGVhbihib29sKSl7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBib29sXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLypcbiAgICAgKuafpeivouiHquW3seWcqHBhcmVudOeahOmYn+WIl+S4reeahOS9jee9rlxuICAgICAqL1xuICAgIGdldEluZGV4ICAgOiBmdW5jdGlvbigpe1xuICAgICAgICBpZighdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfLmluZGV4T2YodGhpcy5wYXJlbnQuY2hpbGRyZW4gLCB0aGlzKVxuICAgIH0sXG4gICAgLypcbiAgICAgKuWFg+e0oOWcqHrovbTmlrnlkJHlkJHkuIvnp7vliqhcbiAgICAgKkBudW0g56e75Yqo55qE5bGC57qnXG4gICAgICovXG4gICAgdG9CYWNrIDogZnVuY3Rpb24oIG51bSApe1xuICAgICAgICBpZighdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21JbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcbiAgICAgICAgdmFyIHRvSW5kZXggPSAwO1xuICAgICAgICBcbiAgICAgICAgaWYoXy5pc051bWJlciggbnVtICkpe1xuICAgICAgICAgIGlmKCBudW0gPT0gMCApe1xuICAgICAgICAgICAgIC8v5Y6f5Zyw5LiN5YqoXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdG9JbmRleCA9IGZyb21JbmRleCAtIG51bTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWUgPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoIGZyb21JbmRleCAsIDEgKVswXTtcbiAgICAgICAgaWYoIHRvSW5kZXggPCAwICl7XG4gICAgICAgICAgICB0b0luZGV4ID0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGRBdCggbWUgLCB0b0luZGV4ICk7XG4gICAgfSxcbiAgICAvKlxuICAgICAq5YWD57Sg5Zyoeui9tOaWueWQkeWQkeS4iuenu+WKqFxuICAgICAqQG51bSDnp7vliqjnmoTlsYLmlbDph48g6buY6K6k5Yiw6aG256uvXG4gICAgICovXG4gICAgdG9Gcm9udCA6IGZ1bmN0aW9uKCBudW0gKXtcbiAgICAgICAgaWYoIXRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcm9tSW5kZXggPSB0aGlzLmdldEluZGV4KCk7XG4gICAgICAgIHZhciBwY2wgPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIHZhciB0b0luZGV4ID0gcGNsO1xuICAgICAgICBcbiAgICAgICAgaWYoXy5pc051bWJlciggbnVtICkpe1xuICAgICAgICAgIGlmKCBudW0gPT0gMCApe1xuICAgICAgICAgICAgIC8v5Y6f5Zyw5LiN5YqoXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b0luZGV4ID0gZnJvbUluZGV4ICsgbnVtICsgMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWUgPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoIGZyb21JbmRleCAsIDEgKVswXTtcbiAgICAgICAgaWYodG9JbmRleCA+IHBjbCl7XG4gICAgICAgICAgICB0b0luZGV4ID0gcGNsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkQXQoIG1lICwgdG9JbmRleC0xICk7XG4gICAgfSxcbiAgICBfdXBkYXRlVHJhbnNmb3JtIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xuICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICAvL+aYr+WQpumcgOimgVRyYW5zZm9ybVxuICAgICAgICBpZihjb250ZXh0LnNjYWxlWCAhPT0gMSB8fCBjb250ZXh0LnNjYWxlWSAhPT0xICl7XG4gICAgICAgICAgICAvL+WmguaenOaciee8qeaUvlxuICAgICAgICAgICAgLy/nvKnmlL7nmoTljp/ngrnlnZDmoIdcbiAgICAgICAgICAgIHZhciBvcmlnaW4gPSBuZXcgUG9pbnQoY29udGV4dC5zY2FsZU9yaWdpbik7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggLW9yaWdpbi54ICwgLW9yaWdpbi55ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdHJhbnNmb3JtLnNjYWxlKCBjb250ZXh0LnNjYWxlWCAsIGNvbnRleHQuc2NhbGVZICk7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggb3JpZ2luLnggLCBvcmlnaW4ueSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcm90YXRpb24gPSBjb250ZXh0LnJvdGF0aW9uO1xuICAgICAgICBpZiggcm90YXRpb24gKXtcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJ5peL6L2sXG4gICAgICAgICAgICAvL+aXi+i9rOeahOWOn+eCueWdkOagh1xuICAgICAgICAgICAgdmFyIG9yaWdpbiA9IG5ldyBQb2ludChjb250ZXh0LnJvdGF0ZU9yaWdpbik7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggLW9yaWdpbi54ICwgLW9yaWdpbi55ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdHJhbnNmb3JtLnJvdGF0ZSggcm90YXRpb24gJSAzNjAgKiBNYXRoLlBJLzE4MCApO1xuICAgICAgICAgICAgaWYoIG9yaWdpbi54IHx8IG9yaWdpbi55ICl7XG4gICAgICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIG9yaWdpbi54ICwgb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvL+WmguaenOacieS9jeenu1xuICAgICAgICB2YXIgeCx5O1xuICAgICAgICBpZiggdGhpcy54eVRvSW50ICYmICF0aGlzLm1vdmVpbmcgKXtcbiAgICAgICAgICAgIC8v5b2T6L+Z5Liq5YWD57Sg5Zyo5YGa6L2o6L+56L+Q5Yqo55qE5pe25YCZ77yM5q+U5aaCZHJhZ++8jGFuaW1hdGlvbuWmguaenOWunuaXtueahOiwg+aVtOi/meS4qngg77yMIHlcbiAgICAgICAgICAgIC8v6YKj5LmI6K+l5YWD57Sg55qE6L2o6L+55Lya5pyJ6Lez6LeD55qE5oOF5Ya15Y+R55Sf44CC5omA5Lul5Yqg5Liq5p2h5Lu26L+H5ruk77yMXG4gICAgICAgICAgICB2YXIgeCA9IHBhcnNlSW50KCBjb250ZXh0LnggKTtcbiAgICAgICAgICAgIHZhciB5ID0gcGFyc2VJbnQoIGNvbnRleHQueSApO1xuXG4gICAgICAgICAgICBpZiggcGFyc2VJbnQoY29udGV4dC5saW5lV2lkdGggLCAxMCkgJSAyID09IDEgJiYgY29udGV4dC5zdHJva2VTdHlsZSApe1xuICAgICAgICAgICAgICAgIHggKz0gMC41O1xuICAgICAgICAgICAgICAgIHkgKz0gMC41O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IGNvbnRleHQueDtcbiAgICAgICAgICAgIHkgPSBjb250ZXh0Lnk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIHggIT0gMCB8fCB5ICE9IDAgKXtcbiAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCB4ICwgeSApO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm0gPSBfdHJhbnNmb3JtO1xuICAgICAgICByZXR1cm4gX3RyYW5zZm9ybTtcbiAgICB9LFxuICAgIC8v5pi+56S65a+56LGh55qE6YCJ5Y+W5qOA5rWL5aSE55CG5Ye95pWwXG4gICAgZ2V0Q2hpbGRJblBvaW50IDogZnVuY3Rpb24oIHBvaW50ICl7XG4gICAgICAgIHZhciByZXN1bHQ7IC8v5qOA5rWL55qE57uT5p6cXG5cbiAgICAgICAgLy/nrKzkuIDmraXvvIzlkKdnbG9i55qEcG9pbnTovazmjaLliLDlr7nlupTnmoRvYmrnmoTlsYLnuqflhoXnmoTlnZDmoIfns7vnu59cbiAgICAgICAgaWYoIHRoaXMudHlwZSAhPSBcInN0YWdlXCIgJiYgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQudHlwZSAhPSBcInN0YWdlXCIgKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXMucGFyZW50Lmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHggPSBwb2ludC54O1xuICAgICAgICB2YXIgeSA9IHBvaW50Lnk7XG5cbiAgICAgICAgLy/ov5nkuKrml7blgJnlpoLmnpzmnInlr7ljb250ZXh055qEc2V077yM5ZGK6K+J5byV5pOO5LiN6ZyA6KaBd2F0Y2jvvIzlm6DkuLrov5nkuKrmmK/lvJXmk47op6blj5HnmoTvvIzkuI3mmK/nlKjmiLdcbiAgICAgICAgLy/nlKjmiLdzZXQgY29udGV4dCDmiY3pnIDopoHop6blj5F3YXRjaFxuICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7XG4gICAgXG4gICAgICAgIC8v5a+56byg5qCH55qE5Z2Q5qCH5Lmf5YGa55u45ZCM55qE5Y+Y5o2iXG4gICAgICAgIGlmKCB0aGlzLl90cmFuc2Zvcm0gKXtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlTWF0cml4ID0gdGhpcy5fdHJhbnNmb3JtLmNsb25lKCkuaW52ZXJ0KCk7XG4gICAgICAgICAgICB2YXIgb3JpZ2luUG9zID0gW3gsIHldO1xuICAgICAgICAgICAgb3JpZ2luUG9zID0gaW52ZXJzZU1hdHJpeC5tdWxWZWN0b3IoIG9yaWdpblBvcyApO1xuXG4gICAgICAgICAgICB4ID0gb3JpZ2luUG9zWzBdO1xuICAgICAgICAgICAgeSA9IG9yaWdpblBvc1sxXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3JlY3QgPSB0aGlzLl9yZWN0ID0gdGhpcy5nZXRSZWN0KHRoaXMuY29udGV4dCk7XG5cbiAgICAgICAgaWYoIV9yZWN0KXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQud2lkdGggJiYgISFfcmVjdC53aWR0aCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoID0gX3JlY3Qud2lkdGg7XG4gICAgICAgIH07XG4gICAgICAgIGlmKCAhdGhpcy5jb250ZXh0LmhlaWdodCAmJiAhIV9yZWN0LmhlaWdodCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IF9yZWN0LmhlaWdodDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIV9yZWN0LndpZHRoIHx8ICFfcmVjdC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/mraPlvI/lvIDlp4vnrKzkuIDmraXnmoTnn6nlvaLojIPlm7TliKTmlq1cbiAgICAgICAgaWYgKCB4ICAgID49IF9yZWN0LnhcbiAgICAgICAgICAgICYmICB4IDw9IChfcmVjdC54ICsgX3JlY3Qud2lkdGgpXG4gICAgICAgICAgICAmJiAgeSA+PSBfcmVjdC55XG4gICAgICAgICAgICAmJiAgeSA8PSAoX3JlY3QueSArIF9yZWN0LmhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgIC8v6YKj5LmI5bCx5Zyo6L+Z5Liq5YWD57Sg55qE55+p5b2i6IyD5Zu05YaFXG4gICAgICAgICAgIHJlc3VsdCA9IEhpdFRlc3RQb2ludC5pc0luc2lkZSggdGhpcyAsIHtcbiAgICAgICAgICAgICAgIHggOiB4LFxuICAgICAgICAgICAgICAgeSA6IHlcbiAgICAgICAgICAgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WmguaenOi/nuefqeW9ouWGhemDveS4jeaYr++8jOmCo+S5iOiCr+WumueahO+8jOi/meS4quS4jeaYr+aIkeS7rOimgeaJvueahHNoYXBcbiAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIC8qXG4gICAgKiBhbmltYXRlXG4gICAgKiBAcGFyYW0gdG9Db250ZW50IOimgeWKqOeUu+WPmOW9ouWIsOeahOWxnuaAp+mbhuWQiFxuICAgICogQHBhcmFtIG9wdGlvbnMgdHdlZW4g5Yqo55S75Y+C5pWwXG4gICAgKi9cbiAgICBhbmltYXRlIDogZnVuY3Rpb24oIHRvQ29udGVudCAsIG9wdGlvbnMgKXtcbiAgICAgICAgdmFyIHRvID0gdG9Db250ZW50O1xuICAgICAgICB2YXIgZnJvbSA9IHt9O1xuICAgICAgICBmb3IoIHZhciBwIGluIHRvICl7XG4gICAgICAgICAgICBmcm9tWyBwIF0gPSB0aGlzLmNvbnRleHRbcF07XG4gICAgICAgIH07XG4gICAgICAgICFvcHRpb25zICYmIChvcHRpb25zID0ge30pO1xuICAgICAgICBvcHRpb25zLmZyb20gPSBmcm9tO1xuICAgICAgICBvcHRpb25zLnRvID0gdG87XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdXBGdW4gPSBmdW5jdGlvbigpe307XG4gICAgICAgIGlmKCBvcHRpb25zLm9uVXBkYXRlICl7XG4gICAgICAgICAgICB1cEZ1biA9IG9wdGlvbnMub25VcGRhdGU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0d2VlbjtcbiAgICAgICAgb3B0aW9ucy5vblVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL+WmguaenGNvbnRleHTkuI3lrZjlnKjor7TmmI7or6VvYmrlt7Lnu4/ooqtkZXN0cm955LqG77yM6YKj5LmI6KaB5oqK5LuW55qEdHdlZW7nu5lkZXN0cm95XG4gICAgICAgICAgICBpZiAoIXNlbGYuY29udGV4dCAmJiB0d2Vlbikge1xuICAgICAgICAgICAgICAgIEFuaW1hdGlvbkZyYW1lLmRlc3Ryb3lUd2Vlbih0d2Vlbik7XG4gICAgICAgICAgICAgICAgdHdlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IoIHZhciBwIGluIHRoaXMgKXtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRleHRbcF0gPSB0aGlzW3BdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHVwRnVuLmFwcGx5KHNlbGYgLCBbdGhpc10pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgY29tcEZ1biA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgaWYoIG9wdGlvbnMub25Db21wbGV0ZSApe1xuICAgICAgICAgICAgY29tcEZ1biA9IG9wdGlvbnMub25Db21wbGV0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAgICAgY29tcEZ1bi5hcHBseShzZWxmICwgYXJndW1lbnRzKVxuICAgICAgICB9O1xuICAgICAgICB0d2VlbiA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdFR3ZWVuKCBvcHRpb25zICk7XG4gICAgICAgIHJldHVybiB0d2VlbjtcbiAgICB9LFxuXG5cbiAgICAvL+a4suafk+ebuOWFs+mDqOWIhu+8jOi/geenu+WIsHJlbmRlcmVyc+S4reWOu1xuICAgIF9yZW5kZXIgOiBmdW5jdGlvbiggY3R4ICl7XHRcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQudmlzaWJsZSB8fCB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPD0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIFxuXG4gICAgICAgIHZhciB0cmFuc0Zvcm0gPSB0aGlzLl90cmFuc2Zvcm07XG4gICAgICAgIGlmKCAhdHJhbnNGb3JtICkge1xuICAgICAgICAgICAgdHJhbnNGb3JtID0gdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8v6L+Q55So55+p6Zi15byA5aeL5Y+Y5b2iXG4gICAgICAgIGN0eC50cmFuc2Zvcm0uYXBwbHkoIGN0eCAsIHRyYW5zRm9ybS50b0FycmF5KCkgKTtcblxuICAgICAgICAvL+iuvue9ruagt+W8j++8jOaWh+acrOacieiHquW3seeahOiuvue9ruagt+W8j+aWueW8j1xuICAgICAgICBpZiggdGhpcy50eXBlICE9IFwidGV4dFwiICkge1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5jb250ZXh0LiRtb2RlbDtcbiAgICAgICAgICAgIGZvcih2YXIgcCBpbiBzdHlsZSl7XG4gICAgICAgICAgICAgICAgaWYoIHAgIT0gXCJ0ZXh0QmFzZWxpbmVcIiAmJiAoIHAgaW4gY3R4ICkgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzdHlsZVtwXSB8fCBfLmlzTnVtYmVyKCBzdHlsZVtwXSApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHAgPT0gXCJnbG9iYWxBbHBoYVwiICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgI/mmI7luqbopoHku47niLboioLngrnnu6fmib9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHhbcF0gKj0gc3R5bGVbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eFtwXSA9IHN0eWxlW3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyKCBjdHggKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9LFxuICAgIHJlbmRlciA6IGZ1bmN0aW9uKCBjdHggKSB7XG4gICAgICAgIC8v5Z+657G75LiN5o+Q5L6bcmVuZGVy55qE5YW35L2T5a6e546w77yM55Sx5ZCO57ut5YW35L2T55qE5rS+55Sf57G75ZCE6Ieq5a6e546wXG4gICAgfSxcbiAgICAvL+S7juagkeS4reWIoOmZpFxuICAgIHJlbW92ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLnBhcmVudCApe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5YWD57Sg55qE6Ieq5oiR6ZSA5q+BXG4gICAgZGVzdHJveSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuZmlyZShcImRlc3Ryb3lcIik7XG4gICAgICAgIC8v5oqK6Ieq5bex5LuO54i26IqC54K55Lit5Yig6Zmk5LqG5ZCO5YGa6Ieq5oiR5riF6Zmk77yM6YeK5pS+5YaF5a2YXG4gICAgICAgIHRoaXMuY29udGV4dCA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNvbnRleHQ7XG4gICAgfVxufSApO1xuXG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5T2JqZWN0O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczPnmoREaXNwbGF5TGlzdCDkuK3nmoTlrrnlmajnsbtcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xuXG52YXIgRGlzcGxheU9iamVjdENvbnRhaW5lciA9IGZ1bmN0aW9uKG9wdCl7XG4gICB2YXIgc2VsZiA9IHRoaXM7XG4gICBzZWxmLmNoaWxkcmVuID0gW107XG4gICBzZWxmLm1vdXNlQ2hpbGRyZW4gPSBbXTtcbiAgIERpc3BsYXlPYmplY3RDb250YWluZXIuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAvL+aJgOacieeahOWuueWZqOm7mOiupOaUr+aMgWV2ZW50IOajgOa1i++8jOWboOS4uiDlj6/og73mnInph4zpnaLnmoRzaGFwZeaYr2V2ZW50RW5hYmxl5pivdHJ1ZeeahFxuICAgLy/lpoLmnpznlKjmiLfmnInlvLrliLbnmoTpnIDmsYLorqnlrrnlmajkuIvnmoTmiYDmnInlhYPntKDpg70g5LiN5Y+v5qOA5rWL77yM5Y+v5Lul6LCD55SoXG4gICAvL0Rpc3BsYXlPYmplY3RDb250YWluZXLnmoQgc2V0RXZlbnRFbmFibGUoKSDmlrnms5VcbiAgIHNlbGYuX2V2ZW50RW5hYmxlZCA9IHRydWU7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwgRGlzcGxheU9iamVjdCAsIHtcbiAgICBhZGRDaGlsZCA6IGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgaWYoICFjaGlsZCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgaWYodGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMSkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgfTtcbiAgICAgICAgLy/lpoLmnpzku5blnKjliKvnmoTlrZDlhYPntKDkuK3vvIzpgqPkuYjlsLHku47liKvkurrpgqPph4zliKDpmaTkuoZcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGNoaWxkICk7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGlmKHRoaXMuaGVhcnRCZWF0KXtcbiAgICAgICAgICAgdGhpcy5oZWFydEJlYXQoe1xuICAgICAgICAgICAgIGNvbnZlcnRUeXBlIDogXCJjaGlsZHJlblwiLFxuICAgICAgICAgICAgIHRhcmdldCAgICAgIDogY2hpbGQsXG4gICAgICAgICAgICAgc3JjICAgICAgICAgOiB0aGlzXG4gICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKHRoaXMuX2FmdGVyQWRkQ2hpbGQpe1xuICAgICAgICAgICB0aGlzLl9hZnRlckFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSxcbiAgICBhZGRDaGlsZEF0IDogZnVuY3Rpb24oY2hpbGQsIGluZGV4KSB7XG4gICAgICAgIGlmKHRoaXMuZ2V0Q2hpbGRJbmRleChjaGlsZCkgIT0gLTEpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH07XG4gICAgICAgIGlmKGNoaWxkLnBhcmVudCkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKTtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIC8v5LiK5oqlY2hpbGRyZW7lv4Pot7NcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgIDogY2hpbGQsXG4gICAgICAgICAgICAgc3JjICAgICAgOiB0aGlzXG4gICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJBZGRDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyQWRkQ2hpbGQoY2hpbGQsaW5kZXgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkIDogZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2hpbGRBdChfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApKTtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkQXQgOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgIDogY2hpbGQsXG4gICAgICAgICAgICAgc3JjICAgICAgOiB0aGlzXG4gICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJEZWxDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyRGVsQ2hpbGQoY2hpbGQgLCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSxcbiAgICByZW1vdmVDaGlsZEJ5SWQgOiBmdW5jdGlvbiggaWQgKSB7XHRcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNoaWxkQXQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsQ2hpbGRyZW4gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hpbGUodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkQXQoMCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v6ZuG5ZCI57G755qE6Ieq5oiR6ZSA5q+BXG4gICAgZGVzdHJveSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLnBhcmVudCApe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmlyZShcImRlc3Ryb3lcIik7XG4gICAgICAgIC8v5L6d5qyh6ZSA5q+B5omA5pyJ5a2Q5YWD57SgXG4gICAgICAgIGZvciAodmFyIGk9MCxsPXRoaXMuY2hpbGRyZW4ubGVuZ3RoIDsgaTxsIDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRBdChpKS5kZXN0cm95KCk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBsLS07XG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvKlxuICAgICAqQGlkIOWFg+e0oOeahGlkXG4gICAgICpAYm9vbGVuIOaYr+WQpua3seW6puafpeivou+8jOm7mOiupOWwseWcqOesrOS4gOWxguWtkOWFg+e0oOS4reafpeivolxuICAgICAqKi9cbiAgICBnZXRDaGlsZEJ5SWQgOiBmdW5jdGlvbihpZCAsIGJvb2xlbil7XG4gICAgICAgIGlmKCFib29sZW4pIHtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/mt7Hluqbmn6Xor6JcbiAgICAgICAgICAgIC8vVE9ETzrmmoLml7bmnKrlrp7njrBcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRDaGlsZEF0IDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMSkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICB9LFxuICAgIGdldENoaWxkSW5kZXggOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKCB0aGlzLmNoaWxkcmVuICwgY2hpbGQgKTtcbiAgICB9LFxuICAgIHNldENoaWxkSW5kZXggOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgpe1xuICAgICAgICBpZihjaGlsZC5wYXJlbnQgIT0gdGhpcykgcmV0dXJuO1xuICAgICAgICB2YXIgb2xkSW5kZXggPSBfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApO1xuICAgICAgICBpZihpbmRleCA9PSBvbGRJbmRleCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShvbGRJbmRleCwgMSk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7XG4gICAgfSxcbiAgICBnZXROdW1DaGlsZHJlbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgfSxcbiAgICAvL+iOt+WPlngseeeCueS4iueahOaJgOaciW9iamVjdCAgbnVtIOmcgOimgei/lOWbnueahG9iauaVsOmHj1xuICAgIGdldE9iamVjdHNVbmRlclBvaW50IDogZnVuY3Rpb24oIHBvaW50ICwgbnVtKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGZvcih2YXIgaSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XG5cbiAgICAgICAgICAgIGlmKCBjaGlsZCA9PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgKCFjaGlsZC5fZXZlbnRFbmFibGVkICYmICFjaGlsZC5kcmFnRW5hYmxlZCkgfHwgXG4gICAgICAgICAgICAgICAgIWNoaWxkLmNvbnRleHQudmlzaWJsZSBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIGNoaWxkIGluc3RhbmNlb2YgRGlzcGxheU9iamVjdENvbnRhaW5lciApIHtcbiAgICAgICAgICAgICAgICAvL+aYr+mbhuWQiFxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5tb3VzZUNoaWxkcmVuICYmIGNoaWxkLmdldE51bUNoaWxkcmVuKCkgPiAwKXtcbiAgICAgICAgICAgICAgICAgICB2YXIgb2JqcyA9IGNoaWxkLmdldE9iamVjdHNVbmRlclBvaW50KCBwb2ludCApO1xuICAgICAgICAgICAgICAgICAgIGlmIChvYmpzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoIG9ianMgKTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVx0XHRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/pnZ7pm4blkIjvvIzlj6/ku6XlvIDlp4vlgZpnZXRDaGlsZEluUG9pbnTkuoZcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuZ2V0Q2hpbGRJblBvaW50KCBwb2ludCApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bSAhPSB1bmRlZmluZWQgJiYgIWlzTmFOKG51bSkpe1xuICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQubGVuZ3RoID09IG51bSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvL+a4suafk+ebuOWFs++8jOetieS4i+S5n+S8muenu+WIsHJlbmRlcmVy5Lit5Y67XG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApIHtcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fcmVuZGVyKCBjdHggKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgRGlzcGxheU9iamVjdENvbnRhaW5lcjtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIHN0YWdlIOexu++8jCDlho1hczPkuK3vvIxzdGFnZeWImeS7o+ihqOaVtOS4quiInuWPsOOAguaYr+WUr+S4gOeahOagueiKgueCuVxuICog5L2G5piv5YaNY2FudmF45Lit77yM5Zug5Li65YiG5bGC6K6+6K6h55qE6ZyA6KaB44CCc3RhZ2Ug6Iie5Y+wIOWQjOagt+S7o+ihqOS4gOS4qmNhbnZhc+WFg+e0oO+8jOS9huaYr+S4jeaYr+WGjeaVtOS4quW8leaTjuiuvuiuoVxuICog6YeM6Z2i77yMIOS4jeaYr+WUr+S4gOeahOagueiKgueCueOAguiAjOaYr+S8muS6pOeUsWNhbnZheOexu+adpee7n+S4gOeuoeeQhuWFtuWxgue6p1xuICovXG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbnZhciBTdGFnZSA9IGZ1bmN0aW9uKCApe1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnR5cGUgPSBcInN0YWdlXCI7XG4gICAgc2VsZi5jb250ZXh0MkQgPSBudWxsO1xuICAgIC8vc3RhZ2XmraPlnKjmuLLmn5PkuK1cbiAgICBzZWxmLnN0YWdlUmVuZGluZyA9IGZhbHNlO1xuICAgIHNlbGYuX2lzUmVhZHkgPSBmYWxzZTtcbiAgICBTdGFnZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuVXRpbHMuY3JlYXRDbGFzcyggU3RhZ2UgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe30sXG4gICAgLy/nlLFjYW52YXjnmoRhZnRlckFkZENoaWxkIOWbnuiwg1xuICAgIGluaXRTdGFnZSA6IGZ1bmN0aW9uKCBjb250ZXh0MkQgLCB3aWR0aCAsIGhlaWdodCApe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBzZWxmLmNvbnRleHQyRCA9IGNvbnRleHQyRDtcbiAgICAgICBzZWxmLmNvbnRleHQud2lkdGggID0gd2lkdGg7XG4gICAgICAgc2VsZi5jb250ZXh0LmhlaWdodCA9IGhlaWdodDtcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVYID0gVXRpbHMuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgc2VsZi5jb250ZXh0LnNjYWxlWSA9IFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgIHNlbGYuX2lzUmVhZHkgPSB0cnVlO1xuICAgIH0sXG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGNvbnRleHQgKXtcbiAgICAgICAgdGhpcy5zdGFnZVJlbmRpbmcgPSB0cnVlO1xuICAgICAgICAvL1RPRE/vvJpcbiAgICAgICAgLy9jbGVhciDnnIvkvLwg5b6I5ZCI55CG77yM5L2G5piv5YW25a6e5Zyo5peg54q25oCB55qEY2F2bmFz57uY5Zu+5Lit77yM5YW25a6e5rKh5b+F6KaB5omn6KGM5LiA5q2l5aSa5L2Z55qEY2xlYXLmk43kvZxcbiAgICAgICAgLy/lj43ogIzlop7liqDml6DosJPnmoTlvIDplIDvvIzlpoLmnpzlkI7nu63opoHlgZrohI/nn6npmLXliKTmlq3nmoTor53jgILlnKjor7RcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICBTdGFnZS5zdXBlcmNsYXNzLnJlbmRlci5jYWxsKCB0aGlzLCBjb250ZXh0ICk7XG4gICAgICAgIHRoaXMuc3RhZ2VSZW5kaW5nID0gZmFsc2U7XG4gICAgfSxcbiAgICBoZWFydEJlYXQgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgIC8vc2hhcGUgLCBuYW1lICwgdmFsdWUgLCBwcmVWYWx1ZSBcbiAgICAgICAgLy9kaXNwbGF5TGlzdOS4reafkOS4quWxnuaAp+aUueWPmOS6hlxuICAgICAgICBpZiAoIXRoaXMuX2lzUmVhZHkpIHtcbiAgICAgICAgICAgLy/lnKhzdGFnZei/mOayoeWIneWni+WMluWujOavleeahOaDheWGteS4i++8jOaXoOmcgOWBmuS7u+S9leWkhOeQhlxuICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIG9wdCB8fCAoIG9wdCA9IHt9ICk7IC8v5aaC5p6cb3B05Li656m677yM6K+05piO5bCx5piv5peg5p2h5Lu25Yi35pawXG4gICAgICAgIG9wdC5zdGFnZSAgID0gdGhpcztcblxuICAgICAgICAvL1RPRE/kuLTml7blhYjov5nkuYjlpITnkIZcbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuaGVhcnRCZWF0KG9wdCk7XG4gICAgfSxcbiAgICBjbGVhciA6IGZ1bmN0aW9uKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQyRC5jbGVhclJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQyRC5jbGVhclJlY3QoIDAsIDAsIHRoaXMucGFyZW50LndpZHRoICwgdGhpcy5wYXJlbnQuaGVpZ2h0ICk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbmV4cG9ydCBkZWZhdWx0IFN0YWdlOyIsImltcG9ydCB7IFJFTkRFUkVSX1RZUEUgfSBmcm9tICcuLi9jb25zdCc7XG5pbXBvcnQgQW5pbWF0aW9uRnJhbWUgZnJvbSBcIi4uL2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZVwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeXN0ZW1SZW5kZXJlciBcbntcbiAgICBjb25zdHJ1Y3RvciggdHlwZT1SRU5ERVJFUl9UWVBFLlVOS05PV04gLCBhcHAgKVxuICAgIHtcbiAgICBcdHRoaXMudHlwZSA9IHR5cGU7IC8vMmNhbnZhcywxd2ViZ2xcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0QWlkID0gbnVsbDtcblxuICAgICAgICAvL+avj+W4p+eUseW/g+i3s+S4iuaKpeeahCDpnIDopoHph43nu5jnmoRzdGFnZXMg5YiX6KGoXG5cdFx0dGhpcy5jb252ZXJ0U3RhZ2VzID0ge307XG5cblx0XHR0aGlzLl9oZWFydEJlYXQgPSBmYWxzZTsvL+W/g+i3s++8jOm7mOiupOS4umZhbHNl77yM5Y2zZmFsc2XnmoTml7blgJnlvJXmk47lpITkuo7pnZnpu5jnirbmgIEgdHJ1ZeWImeWQr+WKqOa4suafk1xuXG5cdFx0dGhpcy5fcHJlUmVuZGVyVGltZSA9IDA7XG4gICAgfVxuXG4gICAgLy/lpoLmnpzlvJXmk47lpITkuo7pnZnpu5jnirbmgIHnmoTor53vvIzlsLHkvJrlkK/liqhcbiAgICBzdGFydEVudGVyKClcbiAgICB7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKCAhc2VsZi5yZXF1ZXN0QWlkICl7XG4gICAgICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdEZyYW1lKCB7XG4gICAgICAgICAgICAgICBpZCA6IFwiZW50ZXJGcmFtZVwiLCAvL+WQjOaXtuiCr+WumuWPquacieS4gOS4qmVudGVyRnJhbWXnmoR0YXNrXG4gICAgICAgICAgICAgICB0YXNrIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbnRlckZyYW1lLmFwcGx5KHNlbGYpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICB9ICk7XG4gICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyRnJhbWUoKVxuICAgIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+S4jeeuoeaAjuS5iOagt++8jGVudGVyRnJhbWXmiafooYzkuoblsLHopoHmiopcbiAgICAgICAgLy9yZXF1ZXN0QWlkIG51bGwg5o6JXG4gICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IG51bGw7XG4gICAgICAgIFV0aWxzLm5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiggc2VsZi5faGVhcnRCZWF0ICl7XG4gICAgICAgICAgICBfLmVhY2goXy52YWx1ZXMoIHNlbGYuY29udmVydFN0YWdlcyApICwgZnVuY3Rpb24oY29udmVydFN0YWdlKXtcbiAgICAgICAgICAgICAgIGNvbnZlcnRTdGFnZS5zdGFnZS5fcmVuZGVyKCBjb252ZXJ0U3RhZ2Uuc3RhZ2UuY29udGV4dDJEICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzID0ge307XG4gICAgICAgICAgICAvL+a4suafk+WujOS6hu+8jOaJk+S4iuacgOaWsOaXtumXtOaMq1xuICAgICAgICAgICAgc2VsZi5fcHJlUmVuZGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9jb252ZXJ0Q2FudmF4KG9wdClcbiAgICB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggbWUuYXBwLmNoaWxkcmVuICwgZnVuY3Rpb24oc3RhZ2Upe1xuICAgICAgICAgICAgc3RhZ2UuY29udGV4dFtvcHQubmFtZV0gPSBvcHQudmFsdWU7IFxuICAgICAgICB9ICk7ICBcbiAgICB9XG5cbiAgICBoZWFydEJlYXQoIG9wdCApXG4gICAge1xuICAgICAgICAvL2Rpc3BsYXlMaXN05Lit5p+Q5Liq5bGe5oCn5pS55Y+Y5LqGXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYoIG9wdCApe1xuICAgICAgICAgICAgLy/lv4Pot7PljIXmnInkuKTnp43vvIzkuIDnp43mmK/mn5DlhYPntKDnmoTlj6/op4blsZ7mgKfmlLnlj5jkuobjgILkuIDnp43mmK9jaGlsZHJlbuacieWPmOWKqFxuICAgICAgICAgICAgLy/liIbliKvlr7nlupRjb252ZXJ0VHlwZSAg5Li6IGNvbnRleHQgIGFuZCBjaGlsZHJlblxuICAgICAgICAgICAgaWYgKG9wdC5jb252ZXJ0VHlwZSA9PSBcImNvbnRleHRcIil7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlICAgPSBvcHQuc3RhZ2U7XG4gICAgICAgICAgICAgICAgdmFyIHNoYXBlICAgPSBvcHQuc2hhcGU7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgICAgPSBvcHQubmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgICA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlVmFsdWU9IG9wdC5wcmVWYWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmKCBzaGFwZS50eXBlID09IFwiY2FudmF4XCIgKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fY29udmVydENhbnZheChvcHQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYoc2hhcGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmNvbnZlcnRTdGFnZXNbIHN0YWdlLmlkIF0uY29udmVydFNoYXBlc1sgc2hhcGUuaWQgXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzWyBzdGFnZS5pZCBdLmNvbnZlcnRTaGFwZXNbIHNoYXBlLmlkIF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFwZSA6IHNoYXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IG9wdC5jb252ZXJ0VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzlt7Lnu4/kuIrmiqXkuobor6Ugc2hhcGUg55qE5b+D6Lez44CCXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChvcHQuY29udmVydFR5cGUgPT0gXCJjaGlsZHJlblwiKXtcbiAgICAgICAgICAgICAgICAvL+WFg+e0oOe7k+aehOWPmOWMlu+8jOavlOWmgmFkZGNoaWxkIHJlbW92ZUNoaWxk562JXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IG9wdC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gb3B0LnNyYy5nZXRTdGFnZSgpO1xuICAgICAgICAgICAgICAgIGlmKCBzdGFnZSB8fCAodGFyZ2V0LnR5cGU9PVwic3RhZ2VcIikgKXtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmk43kvZznmoTnm67moIflhYPntKDmmK9TdGFnZVxuICAgICAgICAgICAgICAgICAgICBzdGFnZSA9IHN0YWdlIHx8IHRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlIDogc3RhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFvcHQuY29udmVydFR5cGUpe1xuICAgICAgICAgICAgICAgIC8v5peg5p2h5Lu26KaB5rGC5Yi35pawXG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gb3B0LnN0YWdlO1xuICAgICAgICAgICAgICAgIGlmKCFzZWxmLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5peg5p2h5Lu26KaB5rGC5YWo6YOo5Yi35paw77yM5LiA6Iis55So5ZyocmVzaXpl562J44CCXG4gICAgICAgICAgICBfLmVhY2goIHNlbGYuYXBwLmNoaWxkcmVuICwgZnVuY3Rpb24oIHN0YWdlICwgaSApe1xuICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIXNlbGYuX2hlYXJ0QmVhdCl7XG4gICAgICAgICAgIC8v5aaC5p6c5Y+R546w5byV5pOO5Zyo6Z2Z6buY54q25oCB77yM6YKj5LmI5bCx5ZSk6YaS5byV5pOOXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgICAgIHNlbGYuc3RhcnRFbnRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WQpuWImeaZuuaFp+e7p+e7reehruiupOW/g+i3s1xuICAgICAgICAgICBzZWxmLl9oZWFydEJlYXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IFN5c3RlbVJlbmRlcmVyIGZyb20gJy4uL1N5c3RlbVJlbmRlcmVyJztcbmltcG9ydCB7IFJFTkRFUkVSX1RZUEUgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1JlbmRlcmVyIGV4dGVuZHMgU3lzdGVtUmVuZGVyZXJcbntcbiAgICBjb25zdHJ1Y3RvcihhcHApXG4gICAge1xuICAgICAgICBzdXBlcihSRU5ERVJFUl9UWVBFLkNBTlZBUywgYXBwKTtcbiAgICB9XG59XG5cbiIsIi8qKlxuICogQXBwbGljYXRpb24ge3tQS0dfVkVSU0lPTn19XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS4u+W8leaTjiDnsbtcbiAqXG4gKiDotJ/otKPmiYDmnIljYW52YXPnmoTlsYLnuqfnrqHnkIbvvIzlkozlv4Pot7PmnLrliLbnmoTlrp7njrAs5o2V6I635Yiw5b+D6Lez5YyF5ZCOIFxuICog5YiG5Y+R5Yiw5a+55bqU55qEc3RhZ2UoY2FudmFzKeadpee7mOWItuWvueW6lOeahOaUueWKqFxuICog54S25ZCOIOm7mOiupOacieWunueOsOS6hnNoYXBl55qEIG1vdXNlb3ZlciAgbW91c2VvdXQgIGRyYWcg5LqL5Lu2XG4gKlxuICoqL1xuXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBTdGFnZSBmcm9tIFwiLi9kaXNwbGF5L1N0YWdlXCI7XG5pbXBvcnQgUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlclwiXG5cblxuLy91dGlsc1xuaW1wb3J0IF8gZnJvbSBcIi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0ICQgZnJvbSBcIi4vdXRpbHMvZG9tXCI7XG5cblxudmFyIEFwcGxpY2F0aW9uID0gZnVuY3Rpb24oIG9wdCApe1xuICAgIHRoaXMudHlwZSA9IFwiY2FudmF4XCI7XG4gICAgdGhpcy5fY2lkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyBcIl9cIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDApOyBcbiAgICBcbiAgICB0aGlzLmVsID0gJC5xdWVyeShvcHQuZWwpO1xuXG4gICAgdGhpcy53aWR0aCA9IHBhcnNlSW50KFwid2lkdGhcIiAgaW4gb3B0IHx8IHRoaXMuZWwub2Zmc2V0V2lkdGggICwgMTApOyBcbiAgICB0aGlzLmhlaWdodCA9IHBhcnNlSW50KFwiaGVpZ2h0XCIgaW4gb3B0IHx8IHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICwgMTApOyBcblxuICAgIHZhciB2aWV3T2JqID0gJC5jcmVhdGVWaWV3KHRoaXMud2lkdGggLCB0aGlzLmhlaWdodCwgdGhpcy5fY2lkKTtcbiAgICB0aGlzLnZpZXcgPSB2aWV3T2JqLnZpZXc7XG4gICAgdGhpcy5zdGFnZV9jID0gdmlld09iai5zdGFnZV9jO1xuICAgIHRoaXMuZG9tX2MgPSB2aWV3T2JqLmRvbV9jO1xuICAgIFxuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKCB0aGlzLnZpZXcgKTtcblxuICAgIHRoaXMudmlld09mZnNldCA9ICQub2Zmc2V0KHRoaXMudmlldyk7XG4gICAgdGhpcy5sYXN0R2V0Uk8gPSAwOy8v5pyA5ZCO5LiA5qyh6I635Y+WIHZpZXdPZmZzZXQg55qE5pe26Ze0XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKCB0aGlzICk7XG5cbiAgICB0aGlzLmV2ZW50ID0gbnVsbDtcblxuICAgIHRoaXMuX2J1ZmZlclN0YWdlID0gbnVsbDtcblxuICAgIC8v5piv5ZCm6Zi75q2i5rWP6KeI5Zmo6buY6K6k5LqL5Lu255qE5omn6KGMXG4gICAgdGhpcy5wcmV2ZW50RGVmYXVsdCA9IHRydWU7XG4gICAgaWYoIG9wdC5wcmV2ZW50RGVmYXVsdCA9PT0gZmFsc2UgKXtcbiAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdCA9IGZhbHNlXG4gICAgfTtcblxuICAgIEFwcGxpY2F0aW9uLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoQXBwbGljYXRpb24gLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IHRoaXMuaGVpZ2h0OyBcblxuICAgICAgICAvL+eEtuWQjuWIm+W7uuS4gOS4queUqOS6jue7mOWItua/gOa0uyBzaGFwZSDnmoQgc3RhZ2Ug5YiwYWN0aXZhdGlvblxuICAgICAgICB0aGlzLl9jcmVhdEhvdmVyU3RhZ2UoKTtcblxuICAgICAgICAvL+WIm+W7uuS4gOS4quWmguaenOimgeeUqOWDj+e0oOajgOa1i+eahOaXtuWAmeeahOWuueWZqFxuICAgICAgICB0aGlzLl9jcmVhdGVQaXhlbENvbnRleHQoKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICByZWdpc3RFdmVudCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIC8v5Yid5aeL5YyW5LqL5Lu25aeU5omY5Yiwcm9vdOWFg+e0oOS4iumdolxuICAgICAgICB0aGlzLmV2ZW50ID0gbmV3IEV2ZW50SGFuZGxlciggdGhpcyAsIG9wdCk7O1xuICAgICAgICB0aGlzLmV2ZW50LmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQ7XG4gICAgfSxcbiAgICByZXNpemUgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgIC8v6YeN5paw6K6+572u5Z2Q5qCH57O757ufIOmrmOWuvSDnrYnjgIJcbiAgICAgICAgdGhpcy53aWR0aCAgICAgID0gcGFyc2VJbnQoKG9wdCAmJiBcIndpZHRoXCIgaW4gb3B0KSB8fCB0aGlzLmVsLm9mZnNldFdpZHRoICAsIDEwKTsgXG4gICAgICAgIHRoaXMuaGVpZ2h0ICAgICA9IHBhcnNlSW50KChvcHQgJiYgXCJoZWlnaHRcIiBpbiBvcHQpIHx8IHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICwgMTApOyBcblxuICAgICAgICB0aGlzLnZpZXcuc3R5bGUud2lkdGggID0gdGhpcy53aWR0aCArXCJweFwiO1xuICAgICAgICB0aGlzLnZpZXcuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQrXCJweFwiO1xuXG4gICAgICAgIHRoaXMudmlld09mZnNldCAgICAgPSAkLm9mZnNldCh0aGlzLnZpZXcpO1xuICAgICAgICB0aGlzLl9ub3RXYXRjaCAgICAgID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoICA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggICAgICA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByZVNpemVDYW52YXMgICAgPSBmdW5jdGlvbihjdHgpe1xuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGN0eC5jYW52YXM7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBtZS53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQ9IG1lLmhlaWdodCsgXCJweFwiO1xuICAgICAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIgICwgbWUud2lkdGggKiBVdGlscy5fZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIgLCBtZS5oZWlnaHQqIFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvKTtcblxuICAgICAgICAgICAgLy/lpoLmnpzmmK9zd2bnmoTor53lsLHov5jopoHosIPnlKjov5nkuKrmlrnms5XjgIJcbiAgICAgICAgICAgIGlmIChjdHgucmVzaXplKSB7XG4gICAgICAgICAgICAgICAgY3R4LnJlc2l6ZShtZS53aWR0aCAsIG1lLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07IFxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiAsIGZ1bmN0aW9uKHMgLCBpKXtcbiAgICAgICAgICAgIHMuX25vdFdhdGNoICAgICA9IHRydWU7XG4gICAgICAgICAgICBzLmNvbnRleHQud2lkdGggPSBtZS53aWR0aDtcbiAgICAgICAgICAgIHMuY29udGV4dC5oZWlnaHQ9IG1lLmhlaWdodDtcbiAgICAgICAgICAgIHJlU2l6ZUNhbnZhcyhzLmNvbnRleHQyRCk7XG4gICAgICAgICAgICBzLl9ub3RXYXRjaCAgICAgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kb21fYy5zdHlsZS53aWR0aCAgPSB0aGlzLndpZHRoICArIFwicHhcIjtcbiAgICAgICAgdGhpcy5kb21fYy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcblxuICAgICAgICB0aGlzLmhlYXJ0QmVhdCgpO1xuXG4gICAgfSxcbiAgICBnZXRIb3ZlclN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlclN0YWdlO1xuICAgIH0sXG4gICAgX2NyZWF0SG92ZXJTdGFnZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vVE9ETzrliJvlu7pzdGFnZeeahOaXtuWAmeS4gOWumuimgeS8oOWFpXdpZHRoIGhlaWdodCAg5Lik5Liq5Y+C5pWwXG4gICAgICAgIHRoaXMuX2J1ZmZlclN0YWdlID0gbmV3IFN0YWdlKCB7XG4gICAgICAgICAgICBpZCA6IFwiYWN0aXZDYW52YXNcIisobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgY29udGV4dCA6IHtcbiAgICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMuY29udGV4dC53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29udGV4dC5oZWlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuICAgICAgICAvL+ivpXN0YWdl5LiN5Y+C5LiO5LqL5Lu25qOA5rWLXG4gICAgICAgIHRoaXMuX2J1ZmZlclN0YWdlLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCggdGhpcy5fYnVmZmVyU3RhZ2UgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOeUqOadpeajgOa1i+aWh+acrHdpZHRoIGhlaWdodCBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOS4iuS4i+aWh1xuICAgICovXG4gICAgX2NyZWF0ZVBpeGVsQ29udGV4dCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3BpeGVsQ2FudmFzID0gJC5xdWVyeShcIl9waXhlbENhbnZhc1wiKTtcbiAgICAgICAgaWYoIV9waXhlbENhbnZhcyl7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMgPSAkLmNyZWF0ZUNhbnZhcygwLCAwLCBcIl9waXhlbENhbnZhc1wiKTsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WmguaenOWPiOeahOivnSDlsLHkuI3pnIDopoHlnKjliJvlu7rkuoZcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggX3BpeGVsQ2FudmFzICk7XG4gICAgICAgIFV0aWxzLmluaXRFbGVtZW50KCBfcGl4ZWxDYW52YXMgKTtcbiAgICAgICAgaWYoIFV0aWxzLmNhbnZhc1N1cHBvcnQoKSApe1xuICAgICAgICAgICAgLy9jYW52YXPnmoTor53vvIzlk6rmgJXmmK9kaXNwbGF5Om5vbmXnmoTpobXlj6/ku6XnlKjmnaXlt6blg4/ntKDmo4DmtYvlkoxtZWFzdXJlVGV4dOaWh+acrHdpZHRo5qOA5rWLXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuZGlzcGxheSAgICA9IFwibm9uZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9mbGFzaENhbnZhcyDnmoTor53vvIxzd2blpoLmnpxkaXNwbGF5Om5vbmXkuobjgILlsLHlgZrkuI3kuoZtZWFzdXJlVGV4dCDmlofmnKzlrr3luqYg5qOA5rWL5LqGXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuekluZGV4ICAgICA9IC0xO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnBvc2l0aW9uICAgPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUubGVmdCAgICAgICA9IC10aGlzLmNvbnRleHQud2lkdGggICsgXCJweFwiO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnRvcCAgICAgICAgPSAtdGhpcy5jb250ZXh0LmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBVdGlscy5fcGl4ZWxDdHggPSBfcGl4ZWxDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlVmlld09mZnNldCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaWYoIG5vdyAtIHRoaXMubGFzdEdldFJPID4gMTAwMCApe1xuICAgICAgICAgICAgdGhpcy52aWV3T2Zmc2V0ICAgICAgPSAkLm9mZnNldCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgdGhpcy5sYXN0R2V0Uk8gICAgICAgPSBub3c7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIF9hZnRlckFkZENoaWxkIDogZnVuY3Rpb24oIHN0YWdlICwgaW5kZXggKXtcbiAgICAgICAgdmFyIGNhbnZhcztcblxuICAgICAgICBpZighc3RhZ2UuY29udGV4dDJEKXtcbiAgICAgICAgICAgIGNhbnZhcyA9ICQuY3JlYXRlQ2FudmFzKCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0LCBzdGFnZS5pZCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzID0gc3RhZ2UuY29udGV4dDJELmNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgdGhpcy5zdGFnZV9jLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoPjEpIHtcbiAgICAgICAgICAgIGlmKCBpbmRleCA9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmsqHmnInmjIflrprkvY3nva7vvIzpgqPkuYjlsLHmlL7liLBfYnVmZmVyU3RhZ2XnmoTkuIvpnaLjgIJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlX2MuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLl9idWZmZXJTdGFnZS5jb250ZXh0MkQuY2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmnInmjIflrprnmoTkvY3nva7vvIzpgqPkuYjlsLHmjIflrprnmoTkvY3nva7mnaVcbiAgICAgICAgICAgICAgICBpZiggaW5kZXggPj0gdGhpcy5jaGlsZHJlbi5sZW5ndGgtMSApe1xuICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5hcHBlbmRDaGlsZCggY2FudmFzICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWdlX2MuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLmNoaWxkcmVuWyBpbmRleCBdLmNvbnRleHQyRC5jYW52YXMgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgVXRpbHMuaW5pdEVsZW1lbnQoIGNhbnZhcyApO1xuICAgICAgICBzdGFnZS5pbml0U3RhZ2UoIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikgLCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0ICk7IFxuICAgIH0sXG4gICAgX2FmdGVyRGVsQ2hpbGQgOiBmdW5jdGlvbihzdGFnZSl7XG4gICAgICAgIHRoaXMuc3RhZ2VfYy5yZW1vdmVDaGlsZCggc3RhZ2UuY29udGV4dDJELmNhbnZhcyApO1xuICAgIH0sXG4gICAgXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5oZWFydEJlYXQob3B0KTtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyDkuK0g55qEc3ByaXRl57G777yM55uu5YmN6L+Y5Y+q5piv5Liq566A5Y2V55qE5a655piT44CCXG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFNwcml0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy50eXBlID0gXCJzcHJpdGVcIjtcbiAgICBTcHJpdGUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhTcHJpdGUgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgIFxuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTcHJpdGU7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljc0RhdGFcbntcbiAgICBjb25zdHJ1Y3RvcihsaW5lV2lkdGgsIGxpbmVDb2xvciwgbGluZUFscGhhLCBmaWxsQ29sb3IsIGZpbGxBbHBoYSwgZmlsbCwgc2hhcGUpXG4gICAge1xuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSBsaW5lQ29sb3I7XG4gICAgICAgIHRoaXMubGluZUFscGhhID0gbGluZUFscGhhO1xuICAgICAgICB0aGlzLl9saW5lVGludCA9IGxpbmVDb2xvcjtcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSBmaWxsQ29sb3I7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gZmlsbEFscGhhO1xuICAgICAgICB0aGlzLl9maWxsVGludCA9IGZpbGxDb2xvcjtcbiAgICAgICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICAgICAgdGhpcy5ob2xlcyA9IFtdO1xuICAgICAgICB0aGlzLnNoYXBlID0gc2hhcGU7XG4gICAgICAgIHRoaXMudHlwZSA9IHNoYXBlLnR5cGU7XG4gICAgfVxuXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBHcmFwaGljc0RhdGEoXG4gICAgICAgICAgICB0aGlzLmxpbmVXaWR0aCxcbiAgICAgICAgICAgIHRoaXMubGluZUNvbG9yLFxuICAgICAgICAgICAgdGhpcy5saW5lQWxwaGEsXG4gICAgICAgICAgICB0aGlzLmZpbGxDb2xvcixcbiAgICAgICAgICAgIHRoaXMuZmlsbEFscGhhLFxuICAgICAgICAgICAgdGhpcy5maWxsLFxuICAgICAgICAgICAgdGhpcy5zaGFwZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFkZEhvbGUoc2hhcGUpXG4gICAge1xuICAgICAgICB0aGlzLmhvbGVzLnB1c2goc2hhcGUpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgdGhpcy5zaGFwZSA9IG51bGw7XG4gICAgICAgIHRoaXMuaG9sZXMgPSBudWxsO1xuICAgIH1cbiAgICBcbn1cbiIsIi8qKlxuICogVGhlIFBvaW50IG9iamVjdCByZXByZXNlbnRzIGEgbG9jYXRpb24gaW4gYSB0d28tZGltZW5zaW9uYWwgY29vcmRpbmF0ZSBzeXN0ZW0sIHdoZXJlIHggcmVwcmVzZW50c1xuICogdGhlIGhvcml6b250YWwgYXhpcyBhbmQgeSByZXByZXNlbnRzIHRoZSB2ZXJ0aWNhbCBheGlzLlxuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnRcbntcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gLSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgeSBheGlzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIHBvaW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlBvaW50fSBhIGNvcHkgb2YgdGhlIHBvaW50XG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHggYW5kIHkgZnJvbSB0aGUgZ2l2ZW4gcG9pbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gcCAtIFRoZSBwb2ludCB0byBjb3B5LlxuICAgICAqL1xuICAgIGNvcHkocClcbiAgICB7XG4gICAgICAgIHRoaXMuc2V0KHAueCwgcC55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHBvaW50IGlzIGVxdWFsIHRvIHRoaXMgcG9pbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVja1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBnaXZlbiBwb2ludCBlcXVhbCB0byB0aGlzIHBvaW50XG4gICAgICovXG4gICAgZXF1YWxzKHApXG4gICAge1xuICAgICAgICByZXR1cm4gKHAueCA9PT0gdGhpcy54KSAmJiAocC55ID09PSB0aGlzLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHBvaW50IHRvIGEgbmV3IHggYW5kIHkgcG9zaXRpb24uXG4gICAgICogSWYgeSBpcyBvbWl0dGVkLCBib3RoIHggYW5kIHkgd2lsbCBiZSBzZXQgdG8geC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSAtIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgeCBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSB5IGF4aXNcbiAgICAgKi9cbiAgICBzZXQoeCwgeSlcbiAgICB7XG4gICAgICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICAgICAgdGhpcy55ID0geSB8fCAoKHkgIT09IDApID8gdGhpcy54IDogMCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgUG9pbnQgZnJvbSAnLi9Qb2ludCc7XG5cbi8qKlxuICogVGhlIHBpeGkgTWF0cml4IGNsYXNzIGFzIGFuIG9iamVjdCwgd2hpY2ggbWFrZXMgaXQgYSBsb3QgZmFzdGVyLFxuICogaGVyZSBpcyBhIHJlcHJlc2VudGF0aW9uIG9mIGl0IDpcbiAqIHwgYSB8IGIgfCB0eHxcbiAqIHwgYyB8IGQgfCB0eXxcbiAqIHwgMCB8IDAgfCAxIHxcbiAqXG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeFxue1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmIgPSAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYyA9IDA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR4ID0gMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5ID0gMDtcblxuICAgICAgICB0aGlzLmFycmF5ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgTWF0cml4IG9iamVjdCBiYXNlZCBvbiB0aGUgZ2l2ZW4gYXJyYXkuIFRoZSBFbGVtZW50IHRvIE1hdHJpeCBtYXBwaW5nIG9yZGVyIGlzIGFzIGZvbGxvd3M6XG4gICAgICpcbiAgICAgKiBhID0gYXJyYXlbMF1cbiAgICAgKiBiID0gYXJyYXlbMV1cbiAgICAgKiBjID0gYXJyYXlbM11cbiAgICAgKiBkID0gYXJyYXlbNF1cbiAgICAgKiB0eCA9IGFycmF5WzJdXG4gICAgICogdHkgPSBhcnJheVs1XVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gYXJyYXkgLSBUaGUgYXJyYXkgdGhhdCB0aGUgbWF0cml4IHdpbGwgYmUgcG9wdWxhdGVkIGZyb20uXG4gICAgICovXG4gICAgZnJvbUFycmF5KGFycmF5KVxuICAgIHtcbiAgICAgICAgdGhpcy5hID0gYXJyYXlbMF07XG4gICAgICAgIHRoaXMuYiA9IGFycmF5WzFdO1xuICAgICAgICB0aGlzLmMgPSBhcnJheVszXTtcbiAgICAgICAgdGhpcy5kID0gYXJyYXlbNF07XG4gICAgICAgIHRoaXMudHggPSBhcnJheVsyXTtcbiAgICAgICAgdGhpcy50eSA9IGFycmF5WzVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNldHMgdGhlIG1hdHJpeCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYSAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYiAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYyAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZCAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHggLSBNYXRyaXggY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR5IC0gTWF0cml4IGNvbXBvbmVudFxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgc2V0KGEsIGIsIGMsIGQsIHR4LCB0eSlcbiAgICB7XG4gICAgICAgIHRoaXMuYSA9IGE7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgICAgIHRoaXMuYyA9IGM7XG4gICAgICAgIHRoaXMuZCA9IGQ7XG4gICAgICAgIHRoaXMudHggPSB0eDtcbiAgICAgICAgdGhpcy50eSA9IHR5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgZnJvbSB0aGUgY3VycmVudCBNYXRyaXggb2JqZWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0cmFuc3Bvc2UgLSBXaGV0aGVyIHdlIG5lZWQgdG8gdHJhbnNwb3NlIHRoZSBtYXRyaXggb3Igbm90XG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IFtvdXQ9bmV3IEZsb2F0MzJBcnJheSg5KV0gLSBJZiBwcm92aWRlZCB0aGUgYXJyYXkgd2lsbCBiZSBhc3NpZ25lZCB0byBvdXRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX0gdGhlIG5ld2x5IGNyZWF0ZWQgYXJyYXkgd2hpY2ggY29udGFpbnMgdGhlIG1hdHJpeFxuICAgICAqL1xuICAgIHRvQXJyYXkodHJhbnNwb3NlLCBvdXQpXG4gICAge1xuICAgICAgICBpZiAoIXRoaXMuYXJyYXkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBvdXQgfHwgdGhpcy5hcnJheTtcblxuICAgICAgICBpZiAodHJhbnNwb3NlKVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnJheVswXSA9IHRoaXMuYTtcbiAgICAgICAgICAgIGFycmF5WzFdID0gdGhpcy5iO1xuICAgICAgICAgICAgYXJyYXlbMl0gPSAwO1xuICAgICAgICAgICAgYXJyYXlbM10gPSB0aGlzLmM7XG4gICAgICAgICAgICBhcnJheVs0XSA9IHRoaXMuZDtcbiAgICAgICAgICAgIGFycmF5WzVdID0gMDtcbiAgICAgICAgICAgIGFycmF5WzZdID0gdGhpcy50eDtcbiAgICAgICAgICAgIGFycmF5WzddID0gdGhpcy50eTtcbiAgICAgICAgICAgIGFycmF5WzhdID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFycmF5WzBdID0gdGhpcy5hO1xuICAgICAgICAgICAgYXJyYXlbMV0gPSB0aGlzLmM7XG4gICAgICAgICAgICBhcnJheVsyXSA9IHRoaXMudHg7XG4gICAgICAgICAgICBhcnJheVszXSA9IHRoaXMuYjtcbiAgICAgICAgICAgIGFycmF5WzRdID0gdGhpcy5kO1xuICAgICAgICAgICAgYXJyYXlbNV0gPSB0aGlzLnR5O1xuICAgICAgICAgICAgYXJyYXlbNl0gPSAwO1xuICAgICAgICAgICAgYXJyYXlbN10gPSAwO1xuICAgICAgICAgICAgYXJyYXlbOF0gPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIG5ldyBwb3NpdGlvbiB3aXRoIHRoZSBjdXJyZW50IHRyYW5zZm9ybWF0aW9uIGFwcGxpZWQuXG4gICAgICogQ2FuIGJlIHVzZWQgdG8gZ28gZnJvbSBhIGNoaWxkJ3MgY29vcmRpbmF0ZSBzcGFjZSB0byB0aGUgd29ybGQgY29vcmRpbmF0ZSBzcGFjZS4gKGUuZy4gcmVuZGVyaW5nKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBwb3MgLSBUaGUgb3JpZ2luXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBbbmV3UG9zXSAtIFRoZSBwb2ludCB0aGF0IHRoZSBuZXcgcG9zaXRpb24gaXMgYXNzaWduZWQgdG8gKGFsbG93ZWQgdG8gYmUgc2FtZSBhcyBpbnB1dClcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlBvaW50fSBUaGUgbmV3IHBvaW50LCB0cmFuc2Zvcm1lZCB0aHJvdWdoIHRoaXMgbWF0cml4XG4gICAgICovXG4gICAgYXBwbHkocG9zLCBuZXdQb3MpXG4gICAge1xuICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XG5cbiAgICAgICAgY29uc3QgeCA9IHBvcy54O1xuICAgICAgICBjb25zdCB5ID0gcG9zLnk7XG5cbiAgICAgICAgbmV3UG9zLnggPSAodGhpcy5hICogeCkgKyAodGhpcy5jICogeSkgKyB0aGlzLnR4O1xuICAgICAgICBuZXdQb3MueSA9ICh0aGlzLmIgKiB4KSArICh0aGlzLmQgKiB5KSArIHRoaXMudHk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1BvcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBuZXcgcG9zaXRpb24gd2l0aCB0aGUgaW52ZXJzZSBvZiB0aGUgY3VycmVudCB0cmFuc2Zvcm1hdGlvbiBhcHBsaWVkLlxuICAgICAqIENhbiBiZSB1c2VkIHRvIGdvIGZyb20gdGhlIHdvcmxkIGNvb3JkaW5hdGUgc3BhY2UgdG8gYSBjaGlsZCdzIGNvb3JkaW5hdGUgc3BhY2UuIChlLmcuIGlucHV0KVxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBwb3MgLSBUaGUgb3JpZ2luXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBbbmV3UG9zXSAtIFRoZSBwb2ludCB0aGF0IHRoZSBuZXcgcG9zaXRpb24gaXMgYXNzaWduZWQgdG8gKGFsbG93ZWQgdG8gYmUgc2FtZSBhcyBpbnB1dClcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlBvaW50fSBUaGUgbmV3IHBvaW50LCBpbnZlcnNlLXRyYW5zZm9ybWVkIHRocm91Z2ggdGhpcyBtYXRyaXhcbiAgICAgKi9cbiAgICBhcHBseUludmVyc2UocG9zLCBuZXdQb3MpXG4gICAge1xuICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XG5cbiAgICAgICAgY29uc3QgaWQgPSAxIC8gKCh0aGlzLmEgKiB0aGlzLmQpICsgKHRoaXMuYyAqIC10aGlzLmIpKTtcblxuICAgICAgICBjb25zdCB4ID0gcG9zLng7XG4gICAgICAgIGNvbnN0IHkgPSBwb3MueTtcblxuICAgICAgICBuZXdQb3MueCA9ICh0aGlzLmQgKiBpZCAqIHgpICsgKC10aGlzLmMgKiBpZCAqIHkpICsgKCgodGhpcy50eSAqIHRoaXMuYykgLSAodGhpcy50eCAqIHRoaXMuZCkpICogaWQpO1xuICAgICAgICBuZXdQb3MueSA9ICh0aGlzLmEgKiBpZCAqIHkpICsgKC10aGlzLmIgKiBpZCAqIHgpICsgKCgoLXRoaXMudHkgKiB0aGlzLmEpICsgKHRoaXMudHggKiB0aGlzLmIpKSAqIGlkKTtcblxuICAgICAgICByZXR1cm4gbmV3UG9zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIG1hdHJpeCBvbiB0aGUgeCBhbmQgeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IEhvdyBtdWNoIHRvIHRyYW5zbGF0ZSB4IGJ5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgSG93IG11Y2ggdG8gdHJhbnNsYXRlIHkgYnlcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICB0cmFuc2xhdGUoeCwgeSlcbiAgICB7XG4gICAgICAgIHRoaXMudHggKz0geDtcbiAgICAgICAgdGhpcy50eSArPSB5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgYSBzY2FsZSB0cmFuc2Zvcm1hdGlvbiB0byB0aGUgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIGFtb3VudCB0byBzY2FsZSBob3Jpem9udGFsbHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSBUaGUgYW1vdW50IHRvIHNjYWxlIHZlcnRpY2FsbHlcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBzY2FsZSh4LCB5KVxuICAgIHtcbiAgICAgICAgdGhpcy5hICo9IHg7XG4gICAgICAgIHRoaXMuZCAqPSB5O1xuICAgICAgICB0aGlzLmMgKj0geDtcbiAgICAgICAgdGhpcy5iICo9IHk7XG4gICAgICAgIHRoaXMudHggKj0geDtcbiAgICAgICAgdGhpcy50eSAqPSB5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgYSByb3RhdGlvbiB0cmFuc2Zvcm1hdGlvbiB0byB0aGUgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIGluIHJhZGlhbnMuXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgcm90YXRlKGFuZ2xlKVxuICAgIHtcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgICAgY29uc3QgYTEgPSB0aGlzLmE7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jO1xuICAgICAgICBjb25zdCB0eDEgPSB0aGlzLnR4O1xuXG4gICAgICAgIHRoaXMuYSA9IChhMSAqIGNvcykgLSAodGhpcy5iICogc2luKTtcbiAgICAgICAgdGhpcy5iID0gKGExICogc2luKSArICh0aGlzLmIgKiBjb3MpO1xuICAgICAgICB0aGlzLmMgPSAoYzEgKiBjb3MpIC0gKHRoaXMuZCAqIHNpbik7XG4gICAgICAgIHRoaXMuZCA9IChjMSAqIHNpbikgKyAodGhpcy5kICogY29zKTtcbiAgICAgICAgdGhpcy50eCA9ICh0eDEgKiBjb3MpIC0gKHRoaXMudHkgKiBzaW4pO1xuICAgICAgICB0aGlzLnR5ID0gKHR4MSAqIHNpbikgKyAodGhpcy50eSAqIGNvcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kcyB0aGUgZ2l2ZW4gTWF0cml4IHRvIHRoaXMgTWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLk1hdHJpeH0gbWF0cml4IC0gVGhlIG1hdHJpeCB0byBhcHBlbmQuXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgYXBwZW5kKG1hdHJpeClcbiAgICB7XG4gICAgICAgIGNvbnN0IGExID0gdGhpcy5hO1xuICAgICAgICBjb25zdCBiMSA9IHRoaXMuYjtcbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmM7XG4gICAgICAgIGNvbnN0IGQxID0gdGhpcy5kO1xuXG4gICAgICAgIHRoaXMuYSA9IChtYXRyaXguYSAqIGExKSArIChtYXRyaXguYiAqIGMxKTtcbiAgICAgICAgdGhpcy5iID0gKG1hdHJpeC5hICogYjEpICsgKG1hdHJpeC5iICogZDEpO1xuICAgICAgICB0aGlzLmMgPSAobWF0cml4LmMgKiBhMSkgKyAobWF0cml4LmQgKiBjMSk7XG4gICAgICAgIHRoaXMuZCA9IChtYXRyaXguYyAqIGIxKSArIChtYXRyaXguZCAqIGQxKTtcblxuICAgICAgICB0aGlzLnR4ID0gKG1hdHJpeC50eCAqIGExKSArIChtYXRyaXgudHkgKiBjMSkgKyB0aGlzLnR4O1xuICAgICAgICB0aGlzLnR5ID0gKG1hdHJpeC50eCAqIGIxKSArIChtYXRyaXgudHkgKiBkMSkgKyB0aGlzLnR5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG1hdHJpeCBiYXNlZCBvbiBhbGwgdGhlIGF2YWlsYWJsZSBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFBvc2l0aW9uIG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFBvc2l0aW9uIG9uIHRoZSB5IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGl2b3RYIC0gUGl2b3Qgb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwaXZvdFkgLSBQaXZvdCBvbiB0aGUgeSBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNjYWxlWCAtIFNjYWxlIG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2NhbGVZIC0gU2NhbGUgb24gdGhlIHkgYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3RhdGlvbiAtIFJvdGF0aW9uIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2tld1ggLSBTa2V3IG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2tld1kgLSBTa2V3IG9uIHRoZSB5IGF4aXNcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBzZXRUcmFuc2Zvcm0oeCwgeSwgcGl2b3RYLCBwaXZvdFksIHNjYWxlWCwgc2NhbGVZLCByb3RhdGlvbiwgc2tld1gsIHNrZXdZKVxuICAgIHtcbiAgICAgICAgY29uc3Qgc3IgPSBNYXRoLnNpbihyb3RhdGlvbik7XG4gICAgICAgIGNvbnN0IGNyID0gTWF0aC5jb3Mocm90YXRpb24pO1xuICAgICAgICBjb25zdCBjeSA9IE1hdGguY29zKHNrZXdZKTtcbiAgICAgICAgY29uc3Qgc3kgPSBNYXRoLnNpbihza2V3WSk7XG4gICAgICAgIGNvbnN0IG5zeCA9IC1NYXRoLnNpbihza2V3WCk7XG4gICAgICAgIGNvbnN0IGN4ID0gTWF0aC5jb3Moc2tld1gpO1xuXG4gICAgICAgIGNvbnN0IGEgPSBjciAqIHNjYWxlWDtcbiAgICAgICAgY29uc3QgYiA9IHNyICogc2NhbGVYO1xuICAgICAgICBjb25zdCBjID0gLXNyICogc2NhbGVZO1xuICAgICAgICBjb25zdCBkID0gY3IgKiBzY2FsZVk7XG5cbiAgICAgICAgdGhpcy5hID0gKGN5ICogYSkgKyAoc3kgKiBjKTtcbiAgICAgICAgdGhpcy5iID0gKGN5ICogYikgKyAoc3kgKiBkKTtcbiAgICAgICAgdGhpcy5jID0gKG5zeCAqIGEpICsgKGN4ICogYyk7XG4gICAgICAgIHRoaXMuZCA9IChuc3ggKiBiKSArIChjeCAqIGQpO1xuXG4gICAgICAgIHRoaXMudHggPSB4ICsgKChwaXZvdFggKiBhKSArIChwaXZvdFkgKiBjKSk7XG4gICAgICAgIHRoaXMudHkgPSB5ICsgKChwaXZvdFggKiBiKSArIChwaXZvdFkgKiBkKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJlcGVuZHMgdGhlIGdpdmVuIE1hdHJpeCB0byB0aGlzIE1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5NYXRyaXh9IG1hdHJpeCAtIFRoZSBtYXRyaXggdG8gcHJlcGVuZFxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIHByZXBlbmQobWF0cml4KVxuICAgIHtcbiAgICAgICAgY29uc3QgdHgxID0gdGhpcy50eDtcblxuICAgICAgICBpZiAobWF0cml4LmEgIT09IDEgfHwgbWF0cml4LmIgIT09IDAgfHwgbWF0cml4LmMgIT09IDAgfHwgbWF0cml4LmQgIT09IDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGExID0gdGhpcy5hO1xuICAgICAgICAgICAgY29uc3QgYzEgPSB0aGlzLmM7XG5cbiAgICAgICAgICAgIHRoaXMuYSA9IChhMSAqIG1hdHJpeC5hKSArICh0aGlzLmIgKiBtYXRyaXguYyk7XG4gICAgICAgICAgICB0aGlzLmIgPSAoYTEgKiBtYXRyaXguYikgKyAodGhpcy5iICogbWF0cml4LmQpO1xuICAgICAgICAgICAgdGhpcy5jID0gKGMxICogbWF0cml4LmEpICsgKHRoaXMuZCAqIG1hdHJpeC5jKTtcbiAgICAgICAgICAgIHRoaXMuZCA9IChjMSAqIG1hdHJpeC5iKSArICh0aGlzLmQgKiBtYXRyaXguZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnR4ID0gKHR4MSAqIG1hdHJpeC5hKSArICh0aGlzLnR5ICogbWF0cml4LmMpICsgbWF0cml4LnR4O1xuICAgICAgICB0aGlzLnR5ID0gKHR4MSAqIG1hdHJpeC5iKSArICh0aGlzLnR5ICogbWF0cml4LmQpICsgbWF0cml4LnR5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlY29tcG9zZXMgdGhlIG1hdHJpeCAoeCwgeSwgc2NhbGVYLCBzY2FsZVksIGFuZCByb3RhdGlvbikgYW5kIHNldHMgdGhlIHByb3BlcnRpZXMgb24gdG8gYSB0cmFuc2Zvcm0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuVHJhbnNmb3JtfFBJWEkuVHJhbnNmb3JtU3RhdGljfSB0cmFuc2Zvcm0gLSBUaGUgdHJhbnNmb3JtIHRvIGFwcGx5IHRoZSBwcm9wZXJ0aWVzIHRvLlxuICAgICAqIEByZXR1cm4ge1BJWEkuVHJhbnNmb3JtfFBJWEkuVHJhbnNmb3JtU3RhdGljfSBUaGUgdHJhbnNmb3JtIHdpdGggdGhlIG5ld2x5IGFwcGxpZWQgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGRlY29tcG9zZSh0cmFuc2Zvcm0pXG4gICAge1xuICAgICAgICAvLyBzb3J0IG91dCByb3RhdGlvbiAvIHNrZXcuLlxuICAgICAgICBjb25zdCBhID0gdGhpcy5hO1xuICAgICAgICBjb25zdCBiID0gdGhpcy5iO1xuICAgICAgICBjb25zdCBjID0gdGhpcy5jO1xuICAgICAgICBjb25zdCBkID0gdGhpcy5kO1xuXG4gICAgICAgIGNvbnN0IHNrZXdYID0gLU1hdGguYXRhbjIoLWMsIGQpO1xuICAgICAgICBjb25zdCBza2V3WSA9IE1hdGguYXRhbjIoYiwgYSk7XG5cbiAgICAgICAgY29uc3QgZGVsdGEgPSBNYXRoLmFicyhza2V3WCArIHNrZXdZKTtcblxuICAgICAgICBpZiAoZGVsdGEgPCAwLjAwMDAxKVxuICAgICAgICB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24gPSBza2V3WTtcblxuICAgICAgICAgICAgaWYgKGEgPCAwICYmIGQgPj0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24gKz0gKHRyYW5zZm9ybS5yb3RhdGlvbiA8PSAwKSA/IE1hdGguUEkgOiAtTWF0aC5QSTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJhbnNmb3JtLnNrZXcueCA9IHRyYW5zZm9ybS5za2V3LnkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdHJhbnNmb3JtLnNrZXcueCA9IHNrZXdYO1xuICAgICAgICAgICAgdHJhbnNmb3JtLnNrZXcueSA9IHNrZXdZO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbmV4dCBzZXQgc2NhbGVcbiAgICAgICAgdHJhbnNmb3JtLnNjYWxlLnggPSBNYXRoLnNxcnQoKGEgKiBhKSArIChiICogYikpO1xuICAgICAgICB0cmFuc2Zvcm0uc2NhbGUueSA9IE1hdGguc3FydCgoYyAqIGMpICsgKGQgKiBkKSk7XG5cbiAgICAgICAgLy8gbmV4dCBzZXQgcG9zaXRpb25cbiAgICAgICAgdHJhbnNmb3JtLnBvc2l0aW9uLnggPSB0aGlzLnR4O1xuICAgICAgICB0cmFuc2Zvcm0ucG9zaXRpb24ueSA9IHRoaXMudHk7XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZlcnRzIHRoaXMgbWF0cml4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBpbnZlcnQoKVxuICAgIHtcbiAgICAgICAgY29uc3QgYTEgPSB0aGlzLmE7XG4gICAgICAgIGNvbnN0IGIxID0gdGhpcy5iO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuYztcbiAgICAgICAgY29uc3QgZDEgPSB0aGlzLmQ7XG4gICAgICAgIGNvbnN0IHR4MSA9IHRoaXMudHg7XG4gICAgICAgIGNvbnN0IG4gPSAoYTEgKiBkMSkgLSAoYjEgKiBjMSk7XG5cbiAgICAgICAgdGhpcy5hID0gZDEgLyBuO1xuICAgICAgICB0aGlzLmIgPSAtYjEgLyBuO1xuICAgICAgICB0aGlzLmMgPSAtYzEgLyBuO1xuICAgICAgICB0aGlzLmQgPSBhMSAvIG47XG4gICAgICAgIHRoaXMudHggPSAoKGMxICogdGhpcy50eSkgLSAoZDEgKiB0eDEpKSAvIG47XG4gICAgICAgIHRoaXMudHkgPSAtKChhMSAqIHRoaXMudHkpIC0gKGIxICogdHgxKSkgLyBuO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGlzIE1hdGl4IHRvIGFuIGlkZW50aXR5IChkZWZhdWx0KSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBpZGVudGl0eSgpXG4gICAge1xuICAgICAgICB0aGlzLmEgPSAxO1xuICAgICAgICB0aGlzLmIgPSAwO1xuICAgICAgICB0aGlzLmMgPSAwO1xuICAgICAgICB0aGlzLmQgPSAxO1xuICAgICAgICB0aGlzLnR4ID0gMDtcbiAgICAgICAgdGhpcy50eSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBNYXRyaXggb2JqZWN0IHdpdGggdGhlIHNhbWUgdmFsdWVzIGFzIHRoaXMgb25lLlxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IEEgY29weSBvZiB0aGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoKTtcblxuICAgICAgICBtYXRyaXguYSA9IHRoaXMuYTtcbiAgICAgICAgbWF0cml4LmIgPSB0aGlzLmI7XG4gICAgICAgIG1hdHJpeC5jID0gdGhpcy5jO1xuICAgICAgICBtYXRyaXguZCA9IHRoaXMuZDtcbiAgICAgICAgbWF0cml4LnR4ID0gdGhpcy50eDtcbiAgICAgICAgbWF0cml4LnR5ID0gdGhpcy50eTtcblxuICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHZhbHVlcyBvZiB0aGUgZ2l2ZW4gbWF0cml4IHRvIGJlIHRoZSBzYW1lIGFzIHRoZSBvbmVzIGluIHRoaXMgbWF0cml4XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuTWF0cml4fSBtYXRyaXggLSBUaGUgbWF0cml4IHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhlIG1hdHJpeCBnaXZlbiBpbiBwYXJhbWV0ZXIgd2l0aCBpdHMgdmFsdWVzIHVwZGF0ZWQuXG4gICAgICovXG4gICAgY29weShtYXRyaXgpXG4gICAge1xuICAgICAgICBtYXRyaXguYSA9IHRoaXMuYTtcbiAgICAgICAgbWF0cml4LmIgPSB0aGlzLmI7XG4gICAgICAgIG1hdHJpeC5jID0gdGhpcy5jO1xuICAgICAgICBtYXRyaXguZCA9IHRoaXMuZDtcbiAgICAgICAgbWF0cml4LnR4ID0gdGhpcy50eDtcbiAgICAgICAgbWF0cml4LnR5ID0gdGhpcy50eTtcblxuICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZGVmYXVsdCAoaWRlbnRpdHkpIG1hdHJpeFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBjb25zdFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgSURFTlRJVFkoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIHRlbXAgbWF0cml4XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGNvbnN0XG4gICAgICovXG4gICAgc3RhdGljIGdldCBURU1QX01BVFJJWCgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCgpO1xuICAgIH1cbn1cbiIsIi8vIFlvdXIgZnJpZW5kbHkgbmVpZ2hib3VyIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0RpaGVkcmFsX2dyb3VwIG9mIG9yZGVyIDE2XG5pbXBvcnQgTWF0cml4IGZyb20gJy4vTWF0cml4JztcblxuY29uc3QgdXggPSBbMSwgMSwgMCwgLTEsIC0xLCAtMSwgMCwgMSwgMSwgMSwgMCwgLTEsIC0xLCAtMSwgMCwgMV07XG5jb25zdCB1eSA9IFswLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xXTtcbmNvbnN0IHZ4ID0gWzAsIC0xLCAtMSwgLTEsIDAsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDAsIC0xLCAtMSwgLTFdO1xuY29uc3QgdnkgPSBbMSwgMSwgMCwgLTEsIC0xLCAtMSwgMCwgMSwgLTEsIC0xLCAwLCAxLCAxLCAxLCAwLCAtMV07XG5jb25zdCB0ZW1wTWF0cmljZXMgPSBbXTtcblxuY29uc3QgbXVsID0gW107XG5cbmZ1bmN0aW9uIHNpZ251bSh4KVxue1xuICAgIGlmICh4IDwgMClcbiAgICB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgaWYgKHggPiAwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGluaXQoKVxue1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKylcbiAgICB7XG4gICAgICAgIGNvbnN0IHJvdyA9IFtdO1xuXG4gICAgICAgIG11bC5wdXNoKHJvdyk7XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxNjsgaisrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBfdXggPSBzaWdudW0oKHV4W2ldICogdXhbal0pICsgKHZ4W2ldICogdXlbal0pKTtcbiAgICAgICAgICAgIGNvbnN0IF91eSA9IHNpZ251bSgodXlbaV0gKiB1eFtqXSkgKyAodnlbaV0gKiB1eVtqXSkpO1xuICAgICAgICAgICAgY29uc3QgX3Z4ID0gc2lnbnVtKCh1eFtpXSAqIHZ4W2pdKSArICh2eFtpXSAqIHZ5W2pdKSk7XG4gICAgICAgICAgICBjb25zdCBfdnkgPSBzaWdudW0oKHV5W2ldICogdnhbal0pICsgKHZ5W2ldICogdnlbal0pKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCAxNjsgaysrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh1eFtrXSA9PT0gX3V4ICYmIHV5W2tdID09PSBfdXkgJiYgdnhba10gPT09IF92eCAmJiB2eVtrXSA9PT0gX3Z5KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goayk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKylcbiAgICB7XG4gICAgICAgIGNvbnN0IG1hdCA9IG5ldyBNYXRyaXgoKTtcblxuICAgICAgICBtYXQuc2V0KHV4W2ldLCB1eVtpXSwgdnhbaV0sIHZ5W2ldLCAwLCAwKTtcbiAgICAgICAgdGVtcE1hdHJpY2VzLnB1c2gobWF0KTtcbiAgICB9XG59XG5cbmluaXQoKTtcblxuLyoqXG4gKiBJbXBsZW1lbnRzIERpaGVkcmFsIEdyb3VwIERfOCwgc2VlIFtncm91cCBENF17QGxpbmsgaHR0cDovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9EaWhlZHJhbEdyb3VwRDQuaHRtbH0sXG4gKiBEOCBpcyB0aGUgc2FtZSBidXQgd2l0aCBkaWFnb25hbHMuIFVzZWQgZm9yIHRleHR1cmUgcm90YXRpb25zLlxuICpcbiAqIFZlY3RvciB4WChpKSwgeFkoaSkgaXMgVS1heGlzIG9mIHNwcml0ZSB3aXRoIHJvdGF0aW9uIGlcbiAqIFZlY3RvciB5WShpKSwgeVkoaSkgaXMgVi1heGlzIG9mIHNwcml0ZSB3aXRoIHJvdGF0aW9uIGlcbiAqIFJvdGF0aW9uczogMCBncmFkICgwKSwgOTAgZ3JhZCAoMiksIDE4MCBncmFkICg0KSwgMjcwIGdyYWQgKDYpXG4gKiBNaXJyb3JzOiB2ZXJ0aWNhbCAoOCksIG1haW4gZGlhZ29uYWwgKDEwKSwgaG9yaXpvbnRhbCAoMTIpLCByZXZlcnNlIGRpYWdvbmFsICgxNClcbiAqIFRoaXMgaXMgdGhlIHNtYWxsIHBhcnQgb2YgZ2FtZW9mYm9tYnMuY29tIHBvcnRhbCBzeXN0ZW0uIEl0IHdvcmtzLlxuICpcbiAqIEBhdXRob3IgSXZhbiBAaXZhbnBvcGVseXNoZXZcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuY29uc3QgR3JvdXBEOCA9IHtcbiAgICBFOiAwLFxuICAgIFNFOiAxLFxuICAgIFM6IDIsXG4gICAgU1c6IDMsXG4gICAgVzogNCxcbiAgICBOVzogNSxcbiAgICBOOiA2LFxuICAgIE5FOiA3LFxuICAgIE1JUlJPUl9WRVJUSUNBTDogOCxcbiAgICBNSVJST1JfSE9SSVpPTlRBTDogMTIsXG4gICAgdVg6IChpbmQpID0+IHV4W2luZF0sXG4gICAgdVk6IChpbmQpID0+IHV5W2luZF0sXG4gICAgdlg6IChpbmQpID0+IHZ4W2luZF0sXG4gICAgdlk6IChpbmQpID0+IHZ5W2luZF0sXG4gICAgaW52OiAocm90YXRpb24pID0+XG4gICAge1xuICAgICAgICBpZiAocm90YXRpb24gJiA4KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gcm90YXRpb24gJiAxNTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoLXJvdGF0aW9uKSAmIDc7XG4gICAgfSxcbiAgICBhZGQ6IChyb3RhdGlvblNlY29uZCwgcm90YXRpb25GaXJzdCkgPT4gbXVsW3JvdGF0aW9uU2Vjb25kXVtyb3RhdGlvbkZpcnN0XSxcbiAgICBzdWI6IChyb3RhdGlvblNlY29uZCwgcm90YXRpb25GaXJzdCkgPT4gbXVsW3JvdGF0aW9uU2Vjb25kXVtHcm91cEQ4Lmludihyb3RhdGlvbkZpcnN0KV0sXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIDE4MCBkZWdyZWVzIHRvIHJvdGF0aW9uLiBDb21tdXRhdGl2ZSBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgUElYSS5Hcm91cEQ4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdGF0aW9uIC0gVGhlIG51bWJlciB0byByb3RhdGUuXG4gICAgICogQHJldHVybnMge251bWJlcn0gcm90YXRlZCBudW1iZXJcbiAgICAgKi9cbiAgICByb3RhdGUxODA6IChyb3RhdGlvbikgPT4gcm90YXRpb24gXiA0LFxuXG4gICAgLyoqXG4gICAgICogSSBkb250IGtub3cgd2h5IHNvbWV0aW1lcyB3aWR0aCBhbmQgaGVpZ2h0cyBuZWVkcyB0byBiZSBzd2FwcGVkLiBXZSdsbCBmaXggaXQgbGF0ZXIuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgUElYSS5Hcm91cEQ4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdGF0aW9uIC0gVGhlIG51bWJlciB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHdpZHRoL2hlaWdodCBzaG91bGQgYmUgc3dhcHBlZC5cbiAgICAgKi9cbiAgICBpc1N3YXBXaWR0aEhlaWdodDogKHJvdGF0aW9uKSA9PiAocm90YXRpb24gJiAzKSA9PT0gMixcblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBQSVhJLkdyb3VwRDhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHggLSBUT0RPXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5IC0gVE9ET1xuICAgICAqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUT0RPXG4gICAgICovXG4gICAgYnlEaXJlY3Rpb246IChkeCwgZHkpID0+XG4gICAge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZHgpICogMiA8PSBNYXRoLmFicyhkeSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChkeSA+PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBHcm91cEQ4LlM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBHcm91cEQ4Lk47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoTWF0aC5hYnMoZHkpICogMiA8PSBNYXRoLmFicyhkeCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChkeCA+IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguVztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeSA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChkeCA+IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguU0U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBHcm91cEQ4LlNXO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR4ID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguTkU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gR3JvdXBEOC5OVztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGVscHMgc3ByaXRlIHRvIGNvbXBlbnNhdGUgdGV4dHVyZSBwYWNrZXIgcm90YXRpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgUElYSS5Hcm91cEQ4XG4gICAgICogQHBhcmFtIHtQSVhJLk1hdHJpeH0gbWF0cml4IC0gc3ByaXRlIHdvcmxkIG1hdHJpeFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3RhdGlvbiAtIFRoZSByb3RhdGlvbiBmYWN0b3IgdG8gdXNlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eCAtIHNwcml0ZSBhbmNob3JpbmdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHkgLSBzcHJpdGUgYW5jaG9yaW5nXG4gICAgICovXG4gICAgbWF0cml4QXBwZW5kUm90YXRpb25JbnY6IChtYXRyaXgsIHJvdGF0aW9uLCB0eCA9IDAsIHR5ID0gMCkgPT5cbiAgICB7XG4gICAgICAgIC8vIFBhY2tlciB1c2VkIFwicm90YXRpb25cIiwgd2UgdXNlIFwiaW52KHJvdGF0aW9uKVwiXG4gICAgICAgIGNvbnN0IG1hdCA9IHRlbXBNYXRyaWNlc1tHcm91cEQ4Lmludihyb3RhdGlvbildO1xuXG4gICAgICAgIG1hdC50eCA9IHR4O1xuICAgICAgICBtYXQudHkgPSB0eTtcbiAgICAgICAgbWF0cml4LmFwcGVuZChtYXQpO1xuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHcm91cEQ4O1xuIiwiaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vLi4vY29uc3QnO1xuXG4vKipcbiAqIFJlY3RhbmdsZSBvYmplY3QgaXMgYW4gYXJlYSBkZWZpbmVkIGJ5IGl0cyBwb3NpdGlvbiwgYXMgaW5kaWNhdGVkIGJ5IGl0cyB0b3AtbGVmdCBjb3JuZXJcbiAqIHBvaW50ICh4LCB5KSBhbmQgYnkgaXRzIHdpZHRoIGFuZCBpdHMgaGVpZ2h0LlxuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgdXBwZXItbGVmdCBjb3JuZXIgb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHVwcGVyLWxlZnQgY29ybmVyIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3dpZHRoPTBdIC0gVGhlIG92ZXJhbGwgd2lkdGggb2YgdGhpcyByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodD0wXSAtIFRoZSBvdmVyYWxsIGhlaWdodCBvZiB0aGlzIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5SRUNUXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5SRUNUO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGxlZnQgZWRnZSBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGxlZnQoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSByaWdodCBlZGdlIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgcmlnaHQoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgdG9wIGVkZ2Ugb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCB0b3AoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBib3R0b20gZWRnZSBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGJvdHRvbSgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBjb25zdGFudCBlbXB0eSByZWN0YW5nbGUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgc3RhdGljIGdldCBFTVBUWSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSgwLCAwLCAwLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBSZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuUmVjdGFuZ2xlfSBhIGNvcHkgb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIGFub3RoZXIgcmVjdGFuZ2xlIHRvIHRoaXMgb25lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlJlY3RhbmdsZX0gcmVjdGFuZ2xlIC0gVGhlIHJlY3RhbmdsZSB0byBjb3B5LlxuICAgICAqIEByZXR1cm4ge1BJWEkuUmVjdGFuZ2xlfSBSZXR1cm5zIGl0c2VsZi5cbiAgICAgKi9cbiAgICBjb3B5KHJlY3RhbmdsZSlcbiAgICB7XG4gICAgICAgIHRoaXMueCA9IHJlY3RhbmdsZS54O1xuICAgICAgICB0aGlzLnkgPSByZWN0YW5nbGUueTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHJlY3RhbmdsZS53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZWN0YW5nbGUuaGVpZ2h0O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgUmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSB4L3kgY29vcmRpbmF0ZXMgYXJlIHdpdGhpbiB0aGlzIFJlY3RhbmdsZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy53aWR0aCA8PSAwIHx8IHRoaXMuaGVpZ2h0IDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh4ID49IHRoaXMueCAmJiB4IDwgdGhpcy54ICsgdGhpcy53aWR0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHkgPj0gdGhpcy55ICYmIHkgPCB0aGlzLnkgKyB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYWRzIHRoZSByZWN0YW5nbGUgbWFraW5nIGl0IGdyb3cgaW4gYWxsIGRpcmVjdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZ1ggLSBUaGUgaG9yaXpvbnRhbCBwYWRkaW5nIGFtb3VudC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZ1kgLSBUaGUgdmVydGljYWwgcGFkZGluZyBhbW91bnQuXG4gICAgICovXG4gICAgcGFkKHBhZGRpbmdYLCBwYWRkaW5nWSlcbiAgICB7XG4gICAgICAgIHBhZGRpbmdYID0gcGFkZGluZ1ggfHwgMDtcbiAgICAgICAgcGFkZGluZ1kgPSBwYWRkaW5nWSB8fCAoKHBhZGRpbmdZICE9PSAwKSA/IHBhZGRpbmdYIDogMCk7XG5cbiAgICAgICAgdGhpcy54IC09IHBhZGRpbmdYO1xuICAgICAgICB0aGlzLnkgLT0gcGFkZGluZ1k7XG5cbiAgICAgICAgdGhpcy53aWR0aCArPSBwYWRkaW5nWCAqIDI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ICs9IHBhZGRpbmdZICogMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXRzIHRoaXMgcmVjdGFuZ2xlIGFyb3VuZCB0aGUgcGFzc2VkIG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5SZWN0YW5nbGV9IHJlY3RhbmdsZSAtIFRoZSByZWN0YW5nbGUgdG8gZml0LlxuICAgICAqL1xuICAgIGZpdChyZWN0YW5nbGUpXG4gICAge1xuICAgICAgICBpZiAodGhpcy54IDwgcmVjdGFuZ2xlLngpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMud2lkdGggKz0gdGhpcy54O1xuICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnggPSByZWN0YW5nbGUueDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnkgPCByZWN0YW5nbGUueSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKz0gdGhpcy55O1xuICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0IDwgMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnkgPSByZWN0YW5nbGUueTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnggKyB0aGlzLndpZHRoID4gcmVjdGFuZ2xlLnggKyByZWN0YW5nbGUud2lkdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSByZWN0YW5nbGUud2lkdGggLSB0aGlzLng7XG4gICAgICAgICAgICBpZiAodGhpcy53aWR0aCA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5oZWlnaHQgPiByZWN0YW5nbGUueSArIHJlY3RhbmdsZS5oZWlnaHQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVjdGFuZ2xlLmhlaWdodCAtIHRoaXMueTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5sYXJnZXMgdGhpcyByZWN0YW5nbGUgdG8gaW5jbHVkZSB0aGUgcGFzc2VkIHJlY3RhbmdsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5SZWN0YW5nbGV9IHJlY3RhbmdsZSAtIFRoZSByZWN0YW5nbGUgdG8gaW5jbHVkZS5cbiAgICAgKi9cbiAgICBlbmxhcmdlKHJlY3RhbmdsZSlcbiAgICB7XG4gICAgICAgIGNvbnN0IHgxID0gTWF0aC5taW4odGhpcy54LCByZWN0YW5nbGUueCk7XG4gICAgICAgIGNvbnN0IHgyID0gTWF0aC5tYXgodGhpcy54ICsgdGhpcy53aWR0aCwgcmVjdGFuZ2xlLnggKyByZWN0YW5nbGUud2lkdGgpO1xuICAgICAgICBjb25zdCB5MSA9IE1hdGgubWluKHRoaXMueSwgcmVjdGFuZ2xlLnkpO1xuICAgICAgICBjb25zdCB5MiA9IE1hdGgubWF4KHRoaXMueSArIHRoaXMuaGVpZ2h0LCByZWN0YW5nbGUueSArIHJlY3RhbmdsZS5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMueCA9IHgxO1xuICAgICAgICB0aGlzLndpZHRoID0geDIgLSB4MTtcbiAgICAgICAgdGhpcy55ID0geTE7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0geTIgLSB5MTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4vUmVjdGFuZ2xlJztcbmltcG9ydCB7IFNIQVBFUyB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuLyoqXG4gKiBUaGUgQ2lyY2xlIG9iamVjdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGEgaGl0IGFyZWEgZm9yIGRpc3BsYXlPYmplY3RzXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjbGVcbntcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBjZW50ZXIgb2YgdGhpcyBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBjZW50ZXIgb2YgdGhpcyBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3JhZGl1cz0wXSAtIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgcmFkaXVzID0gMClcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueCA9IHg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy55ID0geTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5DSVJDXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5DSVJDO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIENpcmNsZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5DaXJjbGV9IGEgY29weSBvZiB0aGUgQ2lyY2xlXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBnaXZlbiBhcmUgY29udGFpbmVkIHdpdGhpbiB0aGlzIGNpcmNsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkaW5hdGVzIGFyZSB3aXRoaW4gdGhpcyBDaXJjbGVcbiAgICAgKi9cbiAgICBjb250YWlucyh4LCB5KVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMucmFkaXVzIDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHIyID0gdGhpcy5yYWRpdXMgKiB0aGlzLnJhZGl1cztcbiAgICAgICAgbGV0IGR4ID0gKHRoaXMueCAtIHgpO1xuICAgICAgICBsZXQgZHkgPSAodGhpcy55IC0geSk7XG5cbiAgICAgICAgZHggKj0gZHg7XG4gICAgICAgIGR5ICo9IGR5O1xuXG4gICAgICAgIHJldHVybiAoZHggKyBkeSA8PSByMik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBSZXR1cm5zIHRoZSBmcmFtaW5nIHJlY3RhbmdsZSBvZiB0aGUgY2lyY2xlIGFzIGEgUmVjdGFuZ2xlIG9iamVjdFxuICAgICpcbiAgICAqIEByZXR1cm4ge1BJWEkuUmVjdGFuZ2xlfSB0aGUgZnJhbWluZyByZWN0YW5nbGVcbiAgICAqL1xuICAgIGdldEJvdW5kcygpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLnggLSB0aGlzLnJhZGl1cywgdGhpcy55IC0gdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzICogMiwgdGhpcy5yYWRpdXMgKiAyKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4vUmVjdGFuZ2xlJztcbmltcG9ydCB7IFNIQVBFUyB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuLyoqXG4gKiBUaGUgRWxsaXBzZSBvYmplY3QgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBhIGhpdCBhcmVhIGZvciBkaXNwbGF5T2JqZWN0c1xuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxsaXBzZVxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRlciBvZiB0aGlzIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRlciBvZiB0aGlzIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbd2lkdGg9MF0gLSBUaGUgaGFsZiB3aWR0aCBvZiB0aGlzIGVsbGlwc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodD0wXSAtIFRoZSBoYWxmIGhlaWdodCBvZiB0aGlzIGVsbGlwc2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMClcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueCA9IHg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy55ID0geTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QsIG1haW5seSB1c2VkIHRvIGF2b2lkIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgUElYSS5TSEFQRVMuRUxJUFxuICAgICAgICAgKiBAc2VlIFBJWEkuU0hBUEVTXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5cGUgPSBTSEFQRVMuRUxJUDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBFbGxpcHNlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkVsbGlwc2V9IGEgY29weSBvZiB0aGUgZWxsaXBzZVxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRWxsaXBzZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgZWxsaXBzZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkcyBhcmUgd2l0aGluIHRoaXMgZWxsaXBzZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy53aWR0aCA8PSAwIHx8IHRoaXMuaGVpZ2h0IDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vcm1hbGl6ZSB0aGUgY29vcmRzIHRvIGFuIGVsbGlwc2Ugd2l0aCBjZW50ZXIgMCwwXG4gICAgICAgIGxldCBub3JteCA9ICgoeCAtIHRoaXMueCkgLyB0aGlzLndpZHRoKTtcbiAgICAgICAgbGV0IG5vcm15ID0gKCh5IC0gdGhpcy55KSAvIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICBub3JteCAqPSBub3JteDtcbiAgICAgICAgbm9ybXkgKj0gbm9ybXk7XG5cbiAgICAgICAgcmV0dXJuIChub3JteCArIG5vcm15IDw9IDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGZyYW1pbmcgcmVjdGFuZ2xlIG9mIHRoZSBlbGxpcHNlIGFzIGEgUmVjdGFuZ2xlIG9iamVjdFxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5SZWN0YW5nbGV9IHRoZSBmcmFtaW5nIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIGdldEJvdW5kcygpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLnggLSB0aGlzLndpZHRoLCB0aGlzLnkgLSB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBQb2ludCBmcm9tICcuLi9Qb2ludCc7XG5pbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2x5Z29uXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50W118bnVtYmVyW119IHBvaW50cyAtIFRoaXMgY2FuIGJlIGFuIGFycmF5IG9mIFBvaW50c1xuICAgICAqICB0aGF0IGZvcm0gdGhlIHBvbHlnb24sIGEgZmxhdCBhcnJheSBvZiBudW1iZXJzIHRoYXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBbeCx5LCB4LHksIC4uLl0sIG9yXG4gICAgICogIHRoZSBhcmd1bWVudHMgcGFzc2VkIGNhbiBiZSBhbGwgdGhlIHBvaW50cyBvZiB0aGUgcG9seWdvbiBlLmcuXG4gICAgICogIGBuZXcgUElYSS5Qb2x5Z29uKG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIC4uLilgLCBvciB0aGUgYXJndW1lbnRzIHBhc3NlZCBjYW4gYmUgZmxhdFxuICAgICAqICB4LHkgdmFsdWVzIGUuZy4gYG5ldyBQb2x5Z29uKHgseSwgeCx5LCB4LHksIC4uLilgIHdoZXJlIGB4YCBhbmQgYHlgIGFyZSBOdW1iZXJzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLnBvaW50cylcbiAgICB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBvaW50c1swXSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50c1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgb2YgcG9pbnRzLCBjb252ZXJ0IGl0IHRvIGEgZmxhdCBhcnJheSBvZiBudW1iZXJzXG4gICAgICAgIGlmIChwb2ludHNbMF0gaW5zdGFuY2VvZiBQb2ludClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBwb2ludHMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwLnB1c2gocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9pbnRzID0gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gYXJyYXkgb2YgdGhlIHBvaW50cyBvZiB0aGlzIHBvbHlnb25cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyW119XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBvaW50cyA9IHBvaW50cztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5QT0xZXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5QT0xZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIHBvbHlnb25cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuUG9seWdvbn0gYSBjb3B5IG9mIHRoZSBwb2x5Z29uXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2x5Z29uKHRoaXMucG9pbnRzLnNsaWNlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb3NlcyB0aGUgcG9seWdvbiwgYWRkaW5nIHBvaW50cyBpZiBuZWNlc3NhcnkuXG4gICAgICpcbiAgICAgKi9cbiAgICBjbG9zZSgpXG4gICAge1xuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLnBvaW50cztcblxuICAgICAgICAvLyBjbG9zZSB0aGUgcG9seSBpZiB0aGUgdmFsdWUgaXMgdHJ1ZSFcbiAgICAgICAgaWYgKHBvaW50c1swXSAhPT0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXSB8fCBwb2ludHNbMV0gIT09IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSwgcG9pbnRzWzFdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgcG9seWdvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkaW5hdGVzIGFyZSB3aXRoaW4gdGhpcyBwb2x5Z29uXG4gICAgICovXG4gICAgY29udGFpbnMoeCwgeSlcbiAgICB7XG4gICAgICAgIGxldCBpbnNpZGUgPSBmYWxzZTtcblxuICAgICAgICAvLyB1c2Ugc29tZSByYXljYXN0aW5nIHRvIHRlc3QgaGl0c1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svcG9pbnQtaW4tcG9seWdvbi9ibG9iL21hc3Rlci9pbmRleC5qc1xuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnBvaW50cy5sZW5ndGggLyAyO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBqID0gbGVuZ3RoIC0gMTsgaSA8IGxlbmd0aDsgaiA9IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgeGkgPSB0aGlzLnBvaW50c1tpICogMl07XG4gICAgICAgICAgICBjb25zdCB5aSA9IHRoaXMucG9pbnRzWyhpICogMikgKyAxXTtcbiAgICAgICAgICAgIGNvbnN0IHhqID0gdGhpcy5wb2ludHNbaiAqIDJdO1xuICAgICAgICAgICAgY29uc3QgeWogPSB0aGlzLnBvaW50c1soaiAqIDIpICsgMV07XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3QgPSAoKHlpID4geSkgIT09ICh5aiA+IHkpKSAmJiAoeCA8ICgoeGogLSB4aSkgKiAoKHkgLSB5aSkgLyAoeWogLSB5aSkpKSArIHhpKTtcblxuICAgICAgICAgICAgaWYgKGludGVyc2VjdClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnNpZGUgPSAhaW5zaWRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc2lkZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbi8qKlxuICogVGhlIFJvdW5kZWQgUmVjdGFuZ2xlIG9iamVjdCBpcyBhbiBhcmVhIHRoYXQgaGFzIG5pY2Ugcm91bmRlZCBjb3JuZXJzLCBhcyBpbmRpY2F0ZWQgYnkgaXRzXG4gKiB0b3AtbGVmdCBjb3JuZXIgcG9pbnQgKHgsIHkpIGFuZCBieSBpdHMgd2lkdGggYW5kIGl0cyBoZWlnaHQgYW5kIGl0cyByYWRpdXMuXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3VuZGVkUmVjdGFuZ2xlXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgdXBwZXItbGVmdCBjb3JuZXIgb2YgdGhlIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgdXBwZXItbGVmdCBjb3JuZXIgb2YgdGhlIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aD0wXSAtIFRoZSBvdmVyYWxsIHdpZHRoIG9mIHRoaXMgcm91bmRlZCByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodD0wXSAtIFRoZSBvdmVyYWxsIGhlaWdodCBvZiB0aGlzIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtyYWRpdXM9MjBdIC0gQ29udHJvbHMgdGhlIHJhZGl1cyBvZiB0aGUgcm91bmRlZCBjb3JuZXJzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDAsIHJhZGl1cyA9IDIwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAyMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QsIG1haW5seSB1c2VkIHRvIGF2b2lkIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgUElYSS5TSEFQRVMuUlJFQ1xuICAgICAgICAgKiBAc2VlIFBJWEkuU0hBUEVTXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5cGUgPSBTSEFQRVMuUlJFQztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBSb3VuZGVkIFJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5Sb3VuZGVkUmVjdGFuZ2xlfSBhIGNvcHkgb2YgdGhlIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3VuZGVkUmVjdGFuZ2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5yYWRpdXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgUm91bmRlZCBSZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdG8gdGVzdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIHgveSBjb29yZGluYXRlcyBhcmUgd2l0aGluIHRoaXMgUm91bmRlZCBSZWN0YW5nbGVcbiAgICAgKi9cbiAgICBjb250YWlucyh4LCB5KVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPD0gMCB8fCB0aGlzLmhlaWdodCA8PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPj0gdGhpcy54ICYmIHggPD0gdGhpcy54ICsgdGhpcy53aWR0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHkgPj0gdGhpcy55ICYmIHkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCh5ID49IHRoaXMueSArIHRoaXMucmFkaXVzICYmIHkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQgLSB0aGlzLnJhZGl1cylcbiAgICAgICAgICAgICAgICB8fCAoeCA+PSB0aGlzLnggKyB0aGlzLnJhZGl1cyAmJiB4IDw9IHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLnJhZGl1cykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGR4ID0geCAtICh0aGlzLnggKyB0aGlzLnJhZGl1cyk7XG4gICAgICAgICAgICAgICAgbGV0IGR5ID0geSAtICh0aGlzLnkgKyB0aGlzLnJhZGl1cyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFkaXVzMiA9IHRoaXMucmFkaXVzICogdGhpcy5yYWRpdXM7XG5cbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHgpICsgKGR5ICogZHkpIDw9IHJhZGl1czIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHggPSB4IC0gKHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgICAgICAgICAgaWYgKChkeCAqIGR4KSArIChkeSAqIGR5KSA8PSByYWRpdXMyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGR5ID0geSAtICh0aGlzLnkgKyB0aGlzLmhlaWdodCAtIHRoaXMucmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHgpICsgKGR5ICogZHkpIDw9IHJhZGl1czIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHggPSB4IC0gKHRoaXMueCArIHRoaXMucmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHgpICsgKGR5ICogZHkpIDw9IHJhZGl1czIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBNYXRoIGNsYXNzZXMgYW5kIHV0aWxpdGllcyBtaXhlZCBpbnRvIFBJWEkgbmFtZXNwYWNlLlxuICpcbiAqIEBsZW5kcyBQSVhJXG4gKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4IH0gZnJvbSAnLi9NYXRyaXgnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHcm91cEQ4IH0gZnJvbSAnLi9Hcm91cEQ4JztcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaXJjbGUgfSBmcm9tICcuL3NoYXBlcy9DaXJjbGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFbGxpcHNlIH0gZnJvbSAnLi9zaGFwZXMvRWxsaXBzZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBvbHlnb24gfSBmcm9tICcuL3NoYXBlcy9Qb2x5Z29uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVjdGFuZ2xlIH0gZnJvbSAnLi9zaGFwZXMvUmVjdGFuZ2xlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUm91bmRlZFJlY3RhbmdsZSB9IGZyb20gJy4vc2hhcGVzL1JvdW5kZWRSZWN0YW5nbGUnO1xuIiwiLyoqXG4gKiBDYWxjdWxhdGUgdGhlIHBvaW50cyBmb3IgYSBiZXppZXIgY3VydmUgYW5kIHRoZW4gZHJhd3MgaXQuXG4gKlxuICogSWdub3JlZCBmcm9tIGRvY3Mgc2luY2UgaXQgaXMgbm90IGRpcmVjdGx5IGV4cG9zZWQuXG4gKlxuICogQGlnbm9yZVxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21YIC0gU3RhcnRpbmcgcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21ZIC0gU3RhcnRpbmcgcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IGNwWCAtIENvbnRyb2wgcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IGNwWSAtIENvbnRyb2wgcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IGNwWDIgLSBTZWNvbmQgQ29udHJvbCBwb2ludCB4XG4gKiBAcGFyYW0ge251bWJlcn0gY3BZMiAtIFNlY29uZCBDb250cm9sIHBvaW50IHlcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b1ggLSBEZXN0aW5hdGlvbiBwb2ludCB4XG4gKiBAcGFyYW0ge251bWJlcn0gdG9ZIC0gRGVzdGluYXRpb24gcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJbXX0gW3BhdGg9W11dIC0gUGF0aCBhcnJheSB0byBwdXNoIHBvaW50cyBpbnRvXG4gKiBAcmV0dXJuIHtudW1iZXJbXX0gQXJyYXkgb2YgcG9pbnRzIG9mIHRoZSBjdXJ2ZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiZXppZXJDdXJ2ZVRvKGZyb21YLCBmcm9tWSwgY3BYLCBjcFksIGNwWDIsIGNwWTIsIHRvWCwgdG9ZLCBwYXRoID0gW10pXG57XG4gICAgY29uc3QgbiA9IDIwO1xuICAgIGxldCBkdCA9IDA7XG4gICAgbGV0IGR0MiA9IDA7XG4gICAgbGV0IGR0MyA9IDA7XG4gICAgbGV0IHQyID0gMDtcbiAgICBsZXQgdDMgPSAwO1xuXG4gICAgcGF0aC5wdXNoKGZyb21YLCBmcm9tWSk7XG5cbiAgICBmb3IgKGxldCBpID0gMSwgaiA9IDA7IGkgPD0gbjsgKytpKVxuICAgIHtcbiAgICAgICAgaiA9IGkgLyBuO1xuXG4gICAgICAgIGR0ID0gKDEgLSBqKTtcbiAgICAgICAgZHQyID0gZHQgKiBkdDtcbiAgICAgICAgZHQzID0gZHQyICogZHQ7XG5cbiAgICAgICAgdDIgPSBqICogajtcbiAgICAgICAgdDMgPSB0MiAqIGo7XG5cbiAgICAgICAgcGF0aC5wdXNoKFxuICAgICAgICAgICAgKGR0MyAqIGZyb21YKSArICgzICogZHQyICogaiAqIGNwWCkgKyAoMyAqIGR0ICogdDIgKiBjcFgyKSArICh0MyAqIHRvWCksXG4gICAgICAgICAgICAoZHQzICogZnJvbVkpICsgKDMgKiBkdDIgKiBqICogY3BZKSArICgzICogZHQgKiB0MiAqIGNwWTIpICsgKHQzICogdG9ZKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoO1xufVxuIiwiaW1wb3J0IEdyYXBoaWNzRGF0YSBmcm9tICcuL0dyYXBoaWNzRGF0YSc7XG5pbXBvcnQgeyBNYXRyaXgsIFBvaW50LCBSZWN0YW5nbGUsIFJvdW5kZWRSZWN0YW5nbGUsIEVsbGlwc2UsIFBvbHlnb24sIENpcmNsZSB9IGZyb20gJy4uL21hdGgvaW5kZXgnO1xuaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vY29uc3QnO1xuaW1wb3J0IGJlemllckN1cnZlVG8gZnJvbSAnLi91dGlscy9iZXppZXJDdXJ2ZVRvJztcblxuY29uc3QgdGVtcE1hdHJpeCA9IG5ldyBNYXRyaXgoKTtcbmNvbnN0IHRlbXBQb2ludCA9IG5ldyBQb2ludCgpO1xuY29uc3QgdGVtcENvbG9yMSA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG5jb25zdCB0ZW1wQ29sb3IyID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpY3NcbntcbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICB0aGlzLmZpbGxBbHBoYSA9IDE7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gMDtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSAwO1xuICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YSA9IFtdO1xuICAgICAgICB0aGlzLnRpbnQgPSAweEZGRkZGRjtcbiAgICAgICAgdGhpcy5fcHJldlRpbnQgPSAweEZGRkZGRjtcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fd2ViR0wgPSB7fTtcblxuICAgICAgICB0aGlzLmRpcnR5ID0gMDtcbiAgICAgICAgdGhpcy5mYXN0UmVjdERpcnR5ID0gLTE7XG4gICAgICAgIHRoaXMuY2xlYXJEaXJ0eSA9IDA7XG4gICAgICAgIHRoaXMuYm91bmRzRGlydHkgPSAtMTtcbiAgICAgICAgdGhpcy5jYWNoZWRTcHJpdGVEaXJ0eSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX3Nwcml0ZVJlY3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9mYXN0UmVjdCA9IGZhbHNlO1xuICAgIH1cblxuXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgR3JhcGhpY3MoKTtcblxuICAgICAgICBjbG9uZS5maWxsQWxwaGEgPSB0aGlzLmZpbGxBbHBoYTtcbiAgICAgICAgY2xvbmUubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG4gICAgICAgIGNsb25lLmxpbmVDb2xvciA9IHRoaXMubGluZUNvbG9yO1xuICAgICAgICBjbG9uZS50aW50ID0gdGhpcy50aW50O1xuICAgICAgICBjbG9uZS5ib3VuZHNQYWRkaW5nID0gdGhpcy5ib3VuZHNQYWRkaW5nO1xuICAgICAgICBjbG9uZS5kaXJ0eSA9IDA7XG4gICAgICAgIGNsb25lLmNhY2hlZFNwcml0ZURpcnR5ID0gdGhpcy5jYWNoZWRTcHJpdGVEaXJ0eTtcblxuICAgICAgICAvLyBjb3B5IGdyYXBoaWNzIGRhdGFcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg7ICsraSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2xvbmUuZ3JhcGhpY3NEYXRhLnB1c2godGhpcy5ncmFwaGljc0RhdGFbaV0uY2xvbmUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbG9uZS5jdXJyZW50UGF0aCA9IGNsb25lLmdyYXBoaWNzRGF0YVtjbG9uZS5ncmFwaGljc0RhdGEubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgY2xvbmUudXBkYXRlTG9jYWxCb3VuZHMoKTtcblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuXG5cbiAgICBsaW5lU3R5bGUobGluZVdpZHRoID0gMCwgY29sb3IgPSAwLCBhbHBoYSA9IDEpXG4gICAge1xuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5saW5lQWxwaGEgPSBhbHBoYTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBoYWxmd2F5IHRocm91Z2ggYSBsaW5lPyBzdGFydCBhIG5ldyBvbmUhXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgUG9seWdvbih0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5zbGljZSgtMikpO1xuXG4gICAgICAgICAgICAgICAgc2hhcGUuY2xvc2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTaGFwZShzaGFwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGl0cyBlbXB0eSBzbyBsZXRzIGp1c3Qgc2V0IHRoZSBsaW5lIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGgubGluZUNvbG9yID0gdGhpcy5saW5lQ29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5saW5lQWxwaGEgPSB0aGlzLmxpbmVBbHBoYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG1vdmVUbyh4LCB5KVxuICAgIHtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgUG9seWdvbihbeCwgeV0pO1xuXG4gICAgICAgIHNoYXBlLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhd3MgYSBsaW5lIHVzaW5nIHRoZSBjdXJyZW50IGxpbmUgc3R5bGUgZnJvbSB0aGUgY3VycmVudCBkcmF3aW5nIHBvc2l0aW9uIHRvICh4LCB5KTtcbiAgICAgKiBUaGUgY3VycmVudCBkcmF3aW5nIHBvc2l0aW9uIGlzIHRoZW4gc2V0IHRvICh4LCB5KS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdGhlIFggY29vcmRpbmF0ZSB0byBkcmF3IHRvXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSB0aGUgWSBjb29yZGluYXRlIHRvIGRyYXcgdG9cbiAgICAgKiBAcmV0dXJuIHtQSVhJLkdyYXBoaWNzfSBUaGlzIEdyYXBoaWNzIG9iamVjdC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzXG4gICAgICovXG4gICAgbGluZVRvKHgsIHkpXG4gICAge1xuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5wdXNoKHgsIHkpO1xuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlIHRoZSBwb2ludHMgZm9yIGEgcXVhZHJhdGljIGJlemllciBjdXJ2ZSBhbmQgdGhlbiBkcmF3cyBpdC5cbiAgICAgKiBCYXNlZCBvbjogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzg1MDk3L2hvdy1kby1pLWltcGxlbWVudC1hLWJlemllci1jdXJ2ZS1pbi1jXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY3BYIC0gQ29udHJvbCBwb2ludCB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNwWSAtIENvbnRyb2wgcG9pbnQgeVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b1ggLSBEZXN0aW5hdGlvbiBwb2ludCB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvWSAtIERlc3RpbmF0aW9uIHBvaW50IHlcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkdyYXBoaWNzfSBUaGlzIEdyYXBoaWNzIG9iamVjdC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzXG4gICAgICovXG4gICAgcXVhZHJhdGljQ3VydmVUbyhjcFgsIGNwWSwgdG9YLCB0b1kpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cyA9IFswLCAwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKDAsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbiA9IDIwO1xuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcbiAgICAgICAgbGV0IHhhID0gMDtcbiAgICAgICAgbGV0IHlhID0gMDtcblxuICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oMCwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcm9tWCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGZyb21ZID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBuOyArK2kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBpIC8gbjtcblxuICAgICAgICAgICAgeGEgPSBmcm9tWCArICgoY3BYIC0gZnJvbVgpICogaik7XG4gICAgICAgICAgICB5YSA9IGZyb21ZICsgKChjcFkgLSBmcm9tWSkgKiBqKTtcblxuICAgICAgICAgICAgcG9pbnRzLnB1c2goeGEgKyAoKChjcFggKyAoKHRvWCAtIGNwWCkgKiBqKSkgLSB4YSkgKiBqKSxcbiAgICAgICAgICAgICAgICB5YSArICgoKGNwWSArICgodG9ZIC0gY3BZKSAqIGopKSAtIHlhKSAqIGopKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBiZXppZXJDdXJ2ZVRvKGNwWCwgY3BZLCBjcFgyLCBjcFkyLCB0b1gsIHRvWSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzID0gWzAsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oMCwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcblxuICAgICAgICBjb25zdCBmcm9tWCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGZyb21ZID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICBwb2ludHMubGVuZ3RoIC09IDI7XG5cbiAgICAgICAgYmV6aWVyQ3VydmVUbyhmcm9tWCwgZnJvbVksIGNwWCwgY3BZLCBjcFgyLCBjcFkyLCB0b1gsIHRvWSwgcG9pbnRzKTtcblxuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXJjVG8oeDEsIHkxLCB4MiwgeTIsIHJhZGl1cylcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLnB1c2goeDEsIHkxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKHgxLCB5MSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcbiAgICAgICAgY29uc3QgZnJvbVggPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDJdO1xuICAgICAgICBjb25zdCBmcm9tWSA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGExID0gZnJvbVkgLSB5MTtcbiAgICAgICAgY29uc3QgYjEgPSBmcm9tWCAtIHgxO1xuICAgICAgICBjb25zdCBhMiA9IHkyIC0geTE7XG4gICAgICAgIGNvbnN0IGIyID0geDIgLSB4MTtcbiAgICAgICAgY29uc3QgbW0gPSBNYXRoLmFicygoYTEgKiBiMikgLSAoYjEgKiBhMikpO1xuXG4gICAgICAgIGlmIChtbSA8IDEuMGUtOCB8fCByYWRpdXMgPT09IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDJdICE9PSB4MSB8fCBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdICE9PSB5MSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MSwgeTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgZGQgPSAoYTEgKiBhMSkgKyAoYjEgKiBiMSk7XG4gICAgICAgICAgICBjb25zdCBjYyA9IChhMiAqIGEyKSArIChiMiAqIGIyKTtcbiAgICAgICAgICAgIGNvbnN0IHR0ID0gKGExICogYTIpICsgKGIxICogYjIpO1xuICAgICAgICAgICAgY29uc3QgazEgPSByYWRpdXMgKiBNYXRoLnNxcnQoZGQpIC8gbW07XG4gICAgICAgICAgICBjb25zdCBrMiA9IHJhZGl1cyAqIE1hdGguc3FydChjYykgLyBtbTtcbiAgICAgICAgICAgIGNvbnN0IGoxID0gazEgKiB0dCAvIGRkO1xuICAgICAgICAgICAgY29uc3QgajIgPSBrMiAqIHR0IC8gY2M7XG4gICAgICAgICAgICBjb25zdCBjeCA9IChrMSAqIGIyKSArIChrMiAqIGIxKTtcbiAgICAgICAgICAgIGNvbnN0IGN5ID0gKGsxICogYTIpICsgKGsyICogYTEpO1xuICAgICAgICAgICAgY29uc3QgcHggPSBiMSAqIChrMiArIGoxKTtcbiAgICAgICAgICAgIGNvbnN0IHB5ID0gYTEgKiAoazIgKyBqMSk7XG4gICAgICAgICAgICBjb25zdCBxeCA9IGIyICogKGsxICsgajIpO1xuICAgICAgICAgICAgY29uc3QgcXkgPSBhMiAqIChrMSArIGoyKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSBNYXRoLmF0YW4yKHB5IC0gY3ksIHB4IC0gY3gpO1xuICAgICAgICAgICAgY29uc3QgZW5kQW5nbGUgPSBNYXRoLmF0YW4yKHF5IC0gY3ksIHF4IC0gY3gpO1xuXG4gICAgICAgICAgICB0aGlzLmFyYyhjeCArIHgxLCBjeSArIHkxLCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBiMSAqIGEyID4gYjIgKiBhMSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXJjKGN4LCBjeSwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgYW50aWNsb2Nrd2lzZSA9IGZhbHNlKVxuICAgIHtcbiAgICAgICAgaWYgKHN0YXJ0QW5nbGUgPT09IGVuZEFuZ2xlKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYW50aWNsb2Nrd2lzZSAmJiBlbmRBbmdsZSA8PSBzdGFydEFuZ2xlKVxuICAgICAgICB7XG4gICAgICAgICAgICBlbmRBbmdsZSArPSBNYXRoLlBJICogMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhbnRpY2xvY2t3aXNlICYmIHN0YXJ0QW5nbGUgPD0gZW5kQW5nbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gTWF0aC5QSSAqIDI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzd2VlcCA9IGVuZEFuZ2xlIC0gc3RhcnRBbmdsZTtcbiAgICAgICAgY29uc3Qgc2VncyA9IE1hdGguY2VpbChNYXRoLmFicyhzd2VlcCkgLyAoTWF0aC5QSSAqIDIpKSAqIDQwO1xuXG4gICAgICAgIGlmIChzd2VlcCA9PT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGFydFggPSBjeCArIChNYXRoLmNvcyhzdGFydEFuZ2xlKSAqIHJhZGl1cyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0WSA9IGN5ICsgKE1hdGguc2luKHN0YXJ0QW5nbGUpICogcmFkaXVzKTtcblxuICAgICAgICAvLyBJZiB0aGUgY3VycmVudFBhdGggZXhpc3RzLCB0YWtlIGl0cyBwb2ludHMuIE90aGVyd2lzZSBjYWxsIGBtb3ZlVG9gIHRvIHN0YXJ0IGEgcGF0aC5cbiAgICAgICAgbGV0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGggPyB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cyA6IG51bGw7XG5cbiAgICAgICAgaWYgKHBvaW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl0gIT09IHN0YXJ0WCB8fCBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdICE9PSBzdGFydFkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICAgcG9pbnRzID0gdGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aGV0YSA9IHN3ZWVwIC8gKHNlZ3MgKiAyKTtcbiAgICAgICAgY29uc3QgdGhldGEyID0gdGhldGEgKiAyO1xuXG4gICAgICAgIGNvbnN0IGNUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICAgICAgY29uc3Qgc1RoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuXG4gICAgICAgIGNvbnN0IHNlZ01pbnVzID0gc2VncyAtIDE7XG5cbiAgICAgICAgY29uc3QgcmVtYWluZGVyID0gKHNlZ01pbnVzICUgMSkgLyBzZWdNaW51cztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzZWdNaW51czsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCByZWFsID0gaSArIChyZW1haW5kZXIgKiBpKTtcblxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSAoKHRoZXRhKSArIHN0YXJ0QW5nbGUgKyAodGhldGEyICogcmVhbCkpO1xuXG4gICAgICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgICAgY29uc3QgcyA9IC1NYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFxuICAgICAgICAgICAgICAgICgoKGNUaGV0YSAqIGMpICsgKHNUaGV0YSAqIHMpKSAqIHJhZGl1cykgKyBjeCxcbiAgICAgICAgICAgICAgICAoKChjVGhldGEgKiAtcykgKyAoc1RoZXRhICogYykpICogcmFkaXVzKSArIGN5XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXJ0eSsrO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJlZ2luRmlsbChjb2xvciA9IDAsIGFscGhhID0gMSlcbiAgICB7XG4gICAgICAgIHRoaXMuZmlsbGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gYWxwaGE7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5sZW5ndGggPD0gMilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmZpbGwgPSB0aGlzLmZpbGxpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5maWxsQ29sb3IgPSB0aGlzLmZpbGxDb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmZpbGxBbHBoYSA9IHRoaXMuZmlsbEFscGhhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW5kRmlsbCgpXG4gICAge1xuICAgICAgICB0aGlzLmZpbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSBudWxsO1xuICAgICAgICB0aGlzLmZpbGxBbHBoYSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd1JlY3QoeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKG5ldyBSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3Um91bmRlZFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzKVxuICAgIHtcbiAgICAgICAgdGhpcy5kcmF3U2hhcGUobmV3IFJvdW5kZWRSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd0NpcmNsZSh4LCB5LCByYWRpdXMpXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShuZXcgQ2lyY2xlKHgsIHksIHJhZGl1cykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRyYXdFbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShuZXcgRWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd1BvbHlnb24ocGF0aClcbiAgICB7XG4gICAgICAgIC8vIHByZXZlbnRzIGFuIGFyZ3VtZW50IGFzc2lnbm1lbnQgZGVvcHRcbiAgICAgICAgLy8gc2VlIHNlY3Rpb24gMy4xOiBodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL3dpa2kvT3B0aW1pemF0aW9uLWtpbGxlcnMjMy1tYW5hZ2luZy1hcmd1bWVudHNcbiAgICAgICAgbGV0IHBvaW50cyA9IHBhdGg7XG5cbiAgICAgICAgbGV0IGNsb3NlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHBvaW50cyBpbnN0YW5jZW9mIFBvbHlnb24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsb3NlZCA9IHBvaW50cy5jbG9zZWQ7XG4gICAgICAgICAgICBwb2ludHMgPSBwb2ludHMucG9pbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHBvaW50cykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIGFuIGFyZ3VtZW50IGxlYWsgZGVvcHRcbiAgICAgICAgICAgIC8vIHNlZSBzZWN0aW9uIDMuMjogaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC93aWtpL09wdGltaXphdGlvbi1raWxsZXJzIzMtbWFuYWdpbmctYXJndW1lbnRzXG4gICAgICAgICAgICBwb2ludHMgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBvaW50c1tpXSA9IGFyZ3VtZW50c1tpXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBwcmVmZXItcmVzdC1wYXJhbXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IFBvbHlnb24ocG9pbnRzKTtcblxuICAgICAgICBzaGFwZS5jbG9zZWQgPSBjbG9zZWQ7XG5cbiAgICAgICAgdGhpcy5kcmF3U2hhcGUoc2hhcGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNsZWFyKClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmxpbmVXaWR0aCB8fCB0aGlzLmZpbGxpbmcgfHwgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5saW5lV2lkdGggPSAwO1xuICAgICAgICAgICAgdGhpcy5maWxsaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuYm91bmRzRGlydHkgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkrKztcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEaXJ0eSsrO1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuICAgICAgICB0aGlzLl9zcHJpdGVSZWN0ID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhlIG9iamVjdCB1c2luZyB0aGUgV2ViR0wgcmVuZGVyZXJcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtQSVhJLldlYkdMUmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyXG4gICAgICovXG4gICAgX3JlbmRlcldlYkdMKHJlbmRlcmVyKVxuICAgIHtcblxuICAgICAgICByZW5kZXJlci5zZXRPYmplY3RSZW5kZXJlcihyZW5kZXJlci5wbHVnaW5zLmdyYXBoaWNzKTtcbiAgICAgICAgcmVuZGVyZXIucGx1Z2lucy5ncmFwaGljcy5yZW5kZXIodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyB0aGUgb2JqZWN0IHVzaW5nIHRoZSBDYW52YXMgcmVuZGVyZXJcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtQSVhJLkNhbnZhc1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlclxuICAgICAqL1xuICAgIF9yZW5kZXJDYW52YXMocmVuZGVyZXIpXG4gICAge1xuICAgICAgICByZW5kZXJlci5wbHVnaW5zLmdyYXBoaWNzLnJlbmRlcih0aGlzKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIERyYXdzIHRoZSBnaXZlbiBzaGFwZSB0byB0aGlzIEdyYXBoaWNzIG9iamVjdC4gQ2FuIGJlIGFueSBvZiBDaXJjbGUsIFJlY3RhbmdsZSwgRWxsaXBzZSwgTGluZSBvciBQb2x5Z29uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLkNpcmNsZXxQSVhJLkVsbGlwc2V8UElYSS5Qb2x5Z29ufFBJWEkuUmVjdGFuZ2xlfFBJWEkuUm91bmRlZFJlY3RhbmdsZX0gc2hhcGUgLSBUaGUgc2hhcGUgb2JqZWN0IHRvIGRyYXcuXG4gICAgICogQHJldHVybiB7UElYSS5HcmFwaGljc0RhdGF9IFRoZSBnZW5lcmF0ZWQgR3JhcGhpY3NEYXRhIG9iamVjdC5cbiAgICAgKi9cbiAgICBkcmF3U2hhcGUoc2hhcGUpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gY2hlY2sgY3VycmVudCBwYXRoIVxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aCA8PSAyKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBHcmFwaGljc0RhdGEoXG4gICAgICAgICAgICB0aGlzLmxpbmVXaWR0aCxcbiAgICAgICAgICAgIHRoaXMubGluZUNvbG9yLFxuICAgICAgICAgICAgdGhpcy5saW5lQWxwaGEsXG4gICAgICAgICAgICB0aGlzLmZpbGxDb2xvcixcbiAgICAgICAgICAgIHRoaXMuZmlsbEFscGhhLFxuICAgICAgICAgICAgdGhpcy5maWxsaW5nLFxuICAgICAgICAgICAgc2hhcGVcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKGRhdGEpO1xuXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFNIQVBFUy5QT0xZKVxuICAgICAgICB7XG4gICAgICAgICAgICBkYXRhLnNoYXBlLmNsb3NlZCA9IGRhdGEuc2hhcGUuY2xvc2VkIHx8IHRoaXMuZmlsbGluZztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXJ0eSsrO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBjdXJyZW50IHBhdGguXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkdyYXBoaWNzfSBSZXR1cm5zIGl0c2VsZi5cbiAgICAgKi9cbiAgICBjbG9zZVBhdGgoKVxuICAgIHtcbiAgICAgICAgLy8gb2sgc28gY2xvc2UgcGF0aCBhc3N1bWVzIG5leHQgb25lIGlzIGEgaG9sZSFcbiAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSB0aGlzLmN1cnJlbnRQYXRoO1xuXG4gICAgICAgIGlmIChjdXJyZW50UGF0aCAmJiBjdXJyZW50UGF0aC5zaGFwZSlcbiAgICAgICAge1xuICAgICAgICAgICAgY3VycmVudFBhdGguc2hhcGUuY2xvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlc3Ryb3kob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3kob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gZGVzdHJveSBlYWNoIG9mIHRoZSBHcmFwaGljc0RhdGEgb2JqZWN0c1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YVtpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgZWFjaCB3ZWJnbCBkYXRhIGVudHJ5LCBkZXN0cm95IHRoZSBXZWJHTEdyYXBoaWNzRGF0YVxuICAgICAgICBmb3IgKGNvbnN0IGlkIGluIHRoaXMuX3dlYmdsKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX3dlYmdsW2lkXS5kYXRhLmxlbmd0aDsgKytqKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYmdsW2lkXS5kYXRhW2pdLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9zcHJpdGVSZWN0KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGVSZWN0LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhID0gbnVsbDtcblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5fd2ViZ2wgPSBudWxsO1xuICAgICAgICB0aGlzLl9sb2NhbEJvdW5kcyA9IG51bGw7XG4gICAgfVxuXG59IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIERpc3BsYXlMaXN0IOS4reeahHNoYXBlIOexu1xuICovXG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0XCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgR3JhcGhpY3MgZnJvbSBcIi4uL2dyYXBoaWNzL0dyYXBoaWNzXCI7XG5cbnZhciBTaGFwZSA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5ncmFwaGljcyA9IG5ldyBHcmFwaGljcygpO1xuXG4gICAgLy/lhYPntKDmmK/lkKbmnIlob3ZlcuS6i+S7tiDlkowgY2hpY2vkuovku7bvvIznlLFhZGRFdmVuZXRMaXN0ZXLlkoxyZW1pdmVFdmVudExpc3RlcuadpeinpuWPkeS/ruaUuVxuICAgIHNlbGYuX2hvdmVyYWJsZSAgPSBmYWxzZTtcbiAgICBzZWxmLl9jbGlja2FibGUgID0gZmFsc2U7XG5cbiAgICAvL292ZXLnmoTml7blgJnlpoLmnpzmnInkv67mlLnmoLflvI/vvIzlsLHkuLp0cnVlXG4gICAgc2VsZi5faG92ZXJDbGFzcyA9IGZhbHNlO1xuICAgIHNlbGYuaG92ZXJDbG9uZSAgPSB0cnVlOyAgICAvL+aYr+WQpuW8gOWQr+WcqGhvdmVy55qE5pe25YCZY2xvbmXkuIDku73liLBhY3RpdmUgc3RhZ2Ug5LitIFxuICAgIHNlbGYucG9pbnRDaGtQcmlvcml0eSA9IHRydWU7IC8v5Zyo6byg5qCHbW91c2VvdmVy5Yiw6K+l6IqC54K577yM54S25ZCObW91c2Vtb3Zl55qE5pe25YCZ77yM5piv5ZCm5LyY5YWI5qOA5rWL6K+l6IqC54K5XG5cbiAgICAvL+aLluaLvWRyYWfnmoTml7blgJnmmL7npLrlnKhhY3RpdlNoYXBl55qE5Ymv5pysXG4gICAgc2VsZi5fZHJhZ0R1cGxpY2F0ZSA9IG51bGw7XG5cbiAgICAvL+WFg+e0oOaYr+WQpiDlvIDlkK8gZHJhZyDmi5bliqjvvIzov5nkuKrmnInnlKjmiLforr7nva7kvKDlhaVcbiAgICAvL3NlbGYuZHJhZ2dhYmxlID0gb3B0LmRyYWdnYWJsZSB8fCBmYWxzZTtcblxuICAgIHNlbGYudHlwZSA9IHNlbGYudHlwZSB8fCBcInNoYXBlXCIgO1xuICAgIG9wdC5kcmF3ICYmIChzZWxmLmRyYXc9b3B0LmRyYXcpO1xuICAgIFxuICAgIC8v5aSE55CG5omA5pyJ55qE5Zu+5b2i5LiA5Lqb5YWx5pyJ55qE5bGe5oCn6YWN572uXG4gICAgc2VsZi5pbml0Q29tcFByb3BlcnR5KG9wdCk7XG5cbiAgICBTaGFwZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuICAgIHNlbGYuX3JlY3QgPSBudWxsO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhTaGFwZSAsIERpc3BsYXlPYmplY3QgLCB7XG4gICBpbml0IDogZnVuY3Rpb24oKXtcbiAgIH0sXG4gICBpbml0Q29tcFByb3BlcnR5IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgIGZvciggdmFyIGkgaW4gb3B0ICl7XG4gICAgICAgICAgIGlmKCBpICE9IFwiaWRcIiAmJiBpICE9IFwiY29udGV4dFwiKXtcbiAgICAgICAgICAgICAgIHRoaXNbaV0gPSBvcHRbaV07XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICB9LFxuICAgLypcbiAgICAq5LiL6Z2i5Lik5Liq5pa55rOV5Li65o+Q5L6b57uZIOWFt+S9k+eahCDlm77lvaLnsbvopobnm5blrp7njrDvvIzmnKxzaGFwZeexu+S4jeaPkOS+m+WFt+S9k+WunueOsFxuICAgICpkcmF3KCkg57uY5Yi2ICAgYW5kICAgc2V0UmVjdCgp6I635Y+W6K+l57G755qE55+p5b2i6L6555WMXG4gICAqL1xuICAgZHJhdzpmdW5jdGlvbigpe1xuICAgXG4gICB9LFxuICAgZHJhd0VuZCA6IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgaWYodGhpcy5faGFzRmlsbEFuZFN0cm9rZSl7XG4gICAgICAgICAgIC8v5aaC5p6c5Zyo5a2Qc2hhcGXnsbvph4zpnaLlt7Lnu4/lrp7njrBzdHJva2UgZmlsbCDnrYnmk43kvZzvvIwg5bCx5LiN6ZyA6KaB57uf5LiA55qEZFxuICAgICAgICAgICByZXR1cm47XG4gICAgICAgfVxuXG4gICAgICAgLy9zdHlsZSDopoHku45kaWFwbGF5T2JqZWN055qEIGNvbnRleHTkuIrpnaLljrvlj5ZcbiAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmNvbnRleHQ7XG4gXG4gICAgICAgLy9maWxsIHN0cm9rZSDkuYvliY3vvIwg5bCx5bqU6K+l6KaBY2xvc2VwYXRoIOWQpuWImee6v+adoei9rOinkuWPo+S8muaciee8uuWPo+OAglxuICAgICAgIC8vZHJhd1R5cGVPbmx5IOeUsee7p+aJv3NoYXBl55qE5YW35L2T57uY5Yi257G75o+Q5L6bXG4gICAgICAgaWYgKCB0aGlzLl9kcmF3VHlwZU9ubHkgIT0gXCJzdHJva2VcIiAmJiB0aGlzLnR5cGUgIT0gXCJwYXRoXCIpe1xuICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgfVxuXG4gICAgICAgaWYgKCBzdHlsZS5zdHJva2VTdHlsZSAmJiBzdHlsZS5saW5lV2lkdGggKXtcbiAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgIH1cbiAgICAgICAvL+avlOWmgui0neWhnuWwlOabsue6v+eUu+eahOe6vyxkcmF3VHlwZU9ubHk9PXN0cm9rZe+8jOaYr+S4jeiDveS9v+eUqGZpbGznmoTvvIzlkI7mnpzlvojkuKXph41cbiAgICAgICBpZiAoc3R5bGUuZmlsbFN0eWxlICYmIHRoaXMuX2RyYXdUeXBlT25seSE9XCJzdHJva2VcIil7XG4gICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgfVxuICAgICAgIFxuICAgfSxcblxuXG4gICByZW5kZXIgOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGN0eCAgPSB0aGlzLmdldFN0YWdlKCkuY29udGV4dDJEO1xuICAgICAgXG4gICAgICBpZiAodGhpcy5jb250ZXh0LnR5cGUgPT0gXCJzaGFwZVwiKXtcbiAgICAgICAgICAvL3R5cGUgPT0gc2hhcGXnmoTml7blgJnvvIzoh6rlrprkuYnnu5jnlLtcbiAgICAgICAgICAvL+i/meS4quaXtuWAmeWwseWPr+S7peS9v+eUqHNlbGYuZ3JhcGhpY3Pnu5jlm77mjqXlj6PkuobvvIzor6XmjqXlj6PmqKHmi5/nmoTmmK9hczPnmoTmjqXlj6NcbiAgICAgICAgICB0aGlzLmRyYXcuYXBwbHkoIHRoaXMgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy/ov5nkuKrml7blgJnvvIzor7TmmI7or6VzaGFwZeaYr+iwg+eUqOW3sue7j+e7mOWItuWlveeahCBzaGFwZSDmqKHlnZfvvIzov5nkupvmqKHlnZflhajpg6jlnKguLi9zaGFwZeebruW9leS4i+mdolxuICAgICAgICAgIGlmKCB0aGlzLmRyYXcgKXtcbiAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICB0aGlzLmRyYXcoIGN0eCAsIHRoaXMuY29udGV4dCApO1xuICAgICAgICAgICAgICB0aGlzLmRyYXdFbmQoIGN0eCApO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cbiAgICxcbiAgIC8qXG4gICAgKiDnlLvomZrnur9cbiAgICAqL1xuICAgZGFzaGVkTGluZVRvOmZ1bmN0aW9uKGN0eCwgeDEsIHkxLCB4MiwgeTIsIGRhc2hMZW5ndGgpIHtcbiAgICAgICAgIGRhc2hMZW5ndGggPSB0eXBlb2YgZGFzaExlbmd0aCA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgID8gMyA6IGRhc2hMZW5ndGg7XG4gICAgICAgICBkYXNoTGVuZ3RoID0gTWF0aC5tYXgoIGRhc2hMZW5ndGggLCB0aGlzLmNvbnRleHQubGluZVdpZHRoICk7XG4gICAgICAgICB2YXIgZGVsdGFYID0geDIgLSB4MTtcbiAgICAgICAgIHZhciBkZWx0YVkgPSB5MiAtIHkxO1xuICAgICAgICAgdmFyIG51bURhc2hlcyA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgTWF0aC5zcXJ0KGRlbHRhWCAqIGRlbHRhWCArIGRlbHRhWSAqIGRlbHRhWSkgLyBkYXNoTGVuZ3RoXG4gICAgICAgICApO1xuICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1EYXNoZXM7ICsraSkge1xuICAgICAgICAgICAgIHZhciB4ID0gcGFyc2VJbnQoeDEgKyAoZGVsdGFYIC8gbnVtRGFzaGVzKSAqIGkpO1xuICAgICAgICAgICAgIHZhciB5ID0gcGFyc2VJbnQoeTEgKyAoZGVsdGFZIC8gbnVtRGFzaGVzKSAqIGkpO1xuICAgICAgICAgICAgIGN0eFtpICUgMiA9PT0gMCA/ICdtb3ZlVG8nIDogJ2xpbmVUbyddKCB4ICwgeSApO1xuICAgICAgICAgICAgIGlmKCBpID09IChudW1EYXNoZXMtMSkgJiYgaSUyID09PSAwKXtcbiAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyggeDIgLCB5MiApO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgIH0sXG4gICAvKlxuICAgICrku45jcGzoioLngrnkuK3ojrflj5bliLA05Liq5pa55ZCR55qE6L6555WM6IqC54K5XG4gICAgKkBwYXJhbSAgY29udGV4dCBcbiAgICAqXG4gICAgKiovXG4gICBnZXRSZWN0Rm9ybVBvaW50TGlzdCA6IGZ1bmN0aW9uKCBjb250ZXh0ICl7XG4gICAgICAgdmFyIG1pblggPSAgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICB2YXIgbWF4WCA9ICBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgIHZhciBtaW5ZID0gIE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgdmFyIG1heFkgPSAgTnVtYmVyLk1JTl9WQUxVRTtcblxuICAgICAgIHZhciBjcGwgPSBjb250ZXh0LnBvaW50TGlzdDsgLy90aGlzLmdldGNwbCgpO1xuICAgICAgIGZvcih2YXIgaSA9IDAsIGwgPSBjcGwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgIGlmIChjcGxbaV1bMF0gPCBtaW5YKSB7XG4gICAgICAgICAgICAgICBtaW5YID0gY3BsW2ldWzBdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMF0gPiBtYXhYKSB7XG4gICAgICAgICAgICAgICBtYXhYID0gY3BsW2ldWzBdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMV0gPCBtaW5ZKSB7XG4gICAgICAgICAgICAgICBtaW5ZID0gY3BsW2ldWzFdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMV0gPiBtYXhZKSB7XG4gICAgICAgICAgICAgICBtYXhZID0gY3BsW2ldWzFdO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuXG4gICAgICAgdmFyIGxpbmVXaWR0aDtcbiAgICAgICBpZiAoY29udGV4dC5zdHJva2VTdHlsZSB8fCBjb250ZXh0LmZpbGxTdHlsZSAgKSB7XG4gICAgICAgICAgIGxpbmVXaWR0aCA9IGNvbnRleHQubGluZVdpZHRoIHx8IDE7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgbGluZVdpZHRoID0gMDtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgeCAgICAgIDogTWF0aC5yb3VuZChtaW5YIC0gbGluZVdpZHRoIC8gMiksXG4gICAgICAgICAgIHkgICAgICA6IE1hdGgucm91bmQobWluWSAtIGxpbmVXaWR0aCAvIDIpLFxuICAgICAgICAgICB3aWR0aCAgOiBtYXhYIC0gbWluWCArIGxpbmVXaWR0aCxcbiAgICAgICAgICAgaGVpZ2h0IDogbWF4WSAtIG1pblkgKyBsaW5lV2lkdGhcbiAgICAgICB9O1xuICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXBlO1xuIiwiLyoqXHJcbiAqIENhbnZheC0tVGV4dFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaWh+acrCDnsbtcclxuICoqL1xyXG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0XCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBUZXh0ID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInRleHRcIjtcclxuICAgIHNlbGYuX3JlTmV3bGluZSA9IC9cXHI/XFxuLztcclxuICAgIHNlbGYuZm9udFByb3BlcnRzID0gW1wiZm9udFN0eWxlXCIsIFwiZm9udFZhcmlhbnRcIiwgXCJmb250V2VpZ2h0XCIsIFwiZm9udFNpemVcIiwgXCJmb250RmFtaWx5XCJdO1xyXG5cclxuICAgIC8v5YGa5LiA5qyh566A5Y2V55qEb3B05Y+C5pWw5qCh6aqM77yM5L+d6K+B5Zyo55So5oi35LiN5Lygb3B055qE5pe25YCZIOaIluiAheS8oOS6hm9wdOS9huaYr+mHjOmdouayoeaciWNvbnRleHTnmoTml7blgJnmiqXplJlcclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBmb250U2l6ZTogMTMsIC8v5a2X5L2T5aSn5bCP6buY6K6kMTNcclxuICAgICAgICBmb250V2VpZ2h0OiBcIm5vcm1hbFwiLFxyXG4gICAgICAgIGZvbnRGYW1pbHk6IFwi5b6u6L2v6ZuF6buRLHNhbnMtc2VyaWZcIixcclxuICAgICAgICB0ZXh0RGVjb3JhdGlvbjogbnVsbCxcclxuICAgICAgICBmaWxsU3R5bGU6ICdibGFuaycsXHJcbiAgICAgICAgc3Ryb2tlU3R5bGU6IG51bGwsXHJcbiAgICAgICAgbGluZVdpZHRoOiAwLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDEuMixcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG51bGwsXHJcbiAgICAgICAgdGV4dEJhY2tncm91bmRDb2xvcjogbnVsbFxyXG4gICAgfSwgb3B0LmNvbnRleHQpO1xyXG5cclxuICAgIHNlbGYuX2NvbnRleHQuZm9udCA9IHNlbGYuX2dldEZvbnREZWNsYXJhdGlvbigpO1xyXG5cclxuICAgIHNlbGYudGV4dCA9IHRleHQudG9TdHJpbmcoKTtcclxuXHJcbiAgICBUZXh0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgW29wdF0pO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhUZXh0LCBEaXNwbGF5T2JqZWN0LCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIC8vY29udGV4dOWxnuaAp+acieWPmOWMlueahOebkeWQrOWHveaVsFxyXG4gICAgICAgIGlmIChfLmluZGV4T2YodGhpcy5mb250UHJvcGVydHMsIG5hbWUpID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGV4dFtuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAvL+WmguaenOS/ruaUueeahOaYr2ZvbnTnmoTmn5DkuKrlhoXlrrnvvIzlsLHph43mlrDnu4Too4XkuIDpgY1mb25055qE5YC877yMXHJcbiAgICAgICAgICAgIC8v54S25ZCO6YCa55+l5byV5pOO6L+Z5qyh5a+5Y29udGV4dOeahOS/ruaUueS4jemcgOimgeS4iuaKpeW/g+i3s1xyXG4gICAgICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuX2dldEZvbnREZWNsYXJhdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggPSB0aGlzLmdldFRleHRXaWR0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5nZXRUZXh0SGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGluaXQ6IGZ1bmN0aW9uKHRleHQsIG9wdCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBjLndpZHRoID0gdGhpcy5nZXRUZXh0V2lkdGgoKTtcclxuICAgICAgICBjLmhlaWdodCA9IHRoaXMuZ2V0VGV4dEhlaWdodCgpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oY3R4KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiB0aGlzLmNvbnRleHQuJG1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChwIGluIGN0eCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAgIT0gXCJ0ZXh0QmFzZWxpbmVcIiAmJiB0aGlzLmNvbnRleHQuJG1vZGVsW3BdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gdGhpcy5jb250ZXh0LiRtb2RlbFtwXTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0KGN0eCwgdGhpcy5fZ2V0VGV4dExpbmVzKCkpO1xyXG4gICAgfSxcclxuICAgIHJlc2V0VGV4dDogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLmhlYXJ0QmVhdCgpO1xyXG4gICAgfSxcclxuICAgIGdldFRleHRXaWR0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gMDtcclxuICAgICAgICBVdGlscy5fcGl4ZWxDdHguc2F2ZSgpO1xyXG4gICAgICAgIFV0aWxzLl9waXhlbEN0eC5mb250ID0gdGhpcy5jb250ZXh0LmZvbnQ7XHJcbiAgICAgICAgd2lkdGggPSB0aGlzLl9nZXRUZXh0V2lkdGgoVXRpbHMuX3BpeGVsQ3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gd2lkdGg7XHJcbiAgICB9LFxyXG4gICAgZ2V0VGV4dEhlaWdodDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRleHRIZWlnaHQoVXRpbHMuX3BpeGVsQ3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRMaW5lczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5zcGxpdCh0aGlzLl9yZU5ld2xpbmUpO1xyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dFN0cm9rZShjdHgsIHRleHRMaW5lcyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dEZpbGwoY3R4LCB0ZXh0TGluZXMpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX2dldEZvbnREZWNsYXJhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBmb250QXJyID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaCh0aGlzLmZvbnRQcm9wZXJ0cywgZnVuY3Rpb24ocCkge1xyXG4gICAgICAgICAgICB2YXIgZm9udFAgPSBzZWxmLl9jb250ZXh0W3BdO1xyXG4gICAgICAgICAgICBpZiAocCA9PSBcImZvbnRTaXplXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvbnRQID0gcGFyc2VGbG9hdChmb250UCkgKyBcInB4XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb250UCAmJiBmb250QXJyLnB1c2goZm9udFApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9udEFyci5qb2luKCcgJyk7XHJcblxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0RmlsbDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5maWxsU3R5bGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcyA9IFtdO1xyXG4gICAgICAgIHZhciBsaW5lSGVpZ2h0cyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0T2ZMaW5lID0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKGN0eCwgaSwgdGV4dExpbmVzKTtcclxuICAgICAgICAgICAgbGluZUhlaWdodHMgKz0gaGVpZ2h0T2ZMaW5lO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyVGV4dExpbmUoXHJcbiAgICAgICAgICAgICAgICAnZmlsbFRleHQnLFxyXG4gICAgICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICAgICAgdGV4dExpbmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgMCwgLy90aGlzLl9nZXRMZWZ0T2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRUb3BPZmZzZXQoKSArIGxpbmVIZWlnaHRzLFxyXG4gICAgICAgICAgICAgICAgaVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dFN0cm9rZTogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5zdHJva2VTdHlsZSB8fCAhdGhpcy5jb250ZXh0LmxpbmVXaWR0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgbGluZUhlaWdodHMgPSAwO1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLnN0cm9rZURhc2hBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAoMSAmIHRoaXMuc3Ryb2tlRGFzaEFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHJva2VEYXNoQXJyYXkucHVzaC5hcHBseSh0aGlzLnN0cm9rZURhc2hBcnJheSwgdGhpcy5zdHJva2VEYXNoQXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cHBvcnRzTGluZURhc2ggJiYgY3R4LnNldExpbmVEYXNoKHRoaXMuc3Ryb2tlRGFzaEFycmF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHRPZkxpbmUgPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoY3R4LCBpLCB0ZXh0TGluZXMpO1xyXG4gICAgICAgICAgICBsaW5lSGVpZ2h0cyArPSBoZWlnaHRPZkxpbmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0TGluZShcclxuICAgICAgICAgICAgICAgICdzdHJva2VUZXh0JyxcclxuICAgICAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgICAgIHRleHRMaW5lc1tpXSxcclxuICAgICAgICAgICAgICAgIDAsIC8vdGhpcy5fZ2V0TGVmdE9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0VG9wT2Zmc2V0KCkgKyBsaW5lSGVpZ2h0cyxcclxuICAgICAgICAgICAgICAgIGlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHRMaW5lOiBmdW5jdGlvbihtZXRob2QsIGN0eCwgbGluZSwgbGVmdCwgdG9wLCBsaW5lSW5kZXgpIHtcclxuICAgICAgICB0b3AgLT0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKCkgLyA0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHQudGV4dEFsaWduICE9PSAnanVzdGlmeScpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIGxpbmUsIGxlZnQsIHRvcCwgbGluZUluZGV4KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lKS53aWR0aDtcclxuICAgICAgICB2YXIgdG90YWxXaWR0aCA9IHRoaXMuY29udGV4dC53aWR0aDtcclxuXHJcbiAgICAgICAgaWYgKHRvdGFsV2lkdGggPiBsaW5lV2lkdGgpIHtcclxuICAgICAgICAgICAgdmFyIHdvcmRzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICB2YXIgd29yZHNXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lLnJlcGxhY2UoL1xccysvZywgJycpKS53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHdpZHRoRGlmZiA9IHRvdGFsV2lkdGggLSB3b3Jkc1dpZHRoO1xyXG4gICAgICAgICAgICB2YXIgbnVtU3BhY2VzID0gd29yZHMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgdmFyIHNwYWNlV2lkdGggPSB3aWR0aERpZmYgLyBudW1TcGFjZXM7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVmdE9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB3b3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIHdvcmRzW2ldLCBsZWZ0ICsgbGVmdE9mZnNldCwgdG9wLCBsaW5lSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgbGVmdE9mZnNldCArPSBjdHgubWVhc3VyZVRleHQod29yZHNbaV0pLndpZHRoICsgc3BhY2VXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNoYXJzKG1ldGhvZCwgY3R4LCBsaW5lLCBsZWZ0LCB0b3AsIGxpbmVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJDaGFyczogZnVuY3Rpb24obWV0aG9kLCBjdHgsIGNoYXJzLCBsZWZ0LCB0b3ApIHtcclxuICAgICAgICBjdHhbbWV0aG9kXShjaGFycywgMCwgdG9wKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0SGVpZ2h0T2ZMaW5lOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmZvbnRTaXplICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRXaWR0aDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBjdHgubWVhc3VyZVRleHQodGV4dExpbmVzWzBdIHx8ICd8Jykud2lkdGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudExpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0TGluZXNbaV0pLndpZHRoO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudExpbmVXaWR0aCA+IG1heFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCA9IGN1cnJlbnRMaW5lV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfSxcclxuICAgIF9nZXRUZXh0SGVpZ2h0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZm9udFNpemUgKiB0ZXh0TGluZXMubGVuZ3RoICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVG9wIG9mZnNldFxyXG4gICAgICovXHJcbiAgICBfZ2V0VG9wT2Zmc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdCA9IDA7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtaWRkbGVcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAtdGhpcy5jb250ZXh0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IC10aGlzLmNvbnRleHQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHZhciB4ID0gMDtcclxuICAgICAgICB2YXIgeSA9IDA7XHJcbiAgICAgICAgLy/mm7Tlhbd0ZXh0QWxpZ24g5ZKMIHRleHRCYXNlbGluZSDph43mlrDnn6vmraMgeHlcclxuICAgICAgICBpZiAoYy50ZXh0QWxpZ24gPT0gXCJjZW50ZXJcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGggLyAyO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGMudGV4dEFsaWduID09IFwicmlnaHRcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYy50ZXh0QmFzZWxpbmUgPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICAgICAgICB5ID0gLWMuaGVpZ2h0IC8gMjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjLnRleHRCYXNlbGluZSA9PSBcImJvdHRvbVwiKSB7XHJcbiAgICAgICAgICAgIHkgPSAtYy5oZWlnaHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgd2lkdGg6IGMud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogYy5oZWlnaHRcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBUZXh0OyIsIlxuLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5ZCR6YeP5pON5L2c57G7XG4gKiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICB2YXIgdnggPSAwLHZ5ID0gMDtcbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBfLmlzT2JqZWN0KCB4ICkgKXtcbiAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgaWYoIF8uaXNBcnJheSggYXJnICkgKXtcbiAgICAgICAgICAgdnggPSBhcmdbMF07XG4gICAgICAgICAgIHZ5ID0gYXJnWzFdO1xuICAgICAgICB9IGVsc2UgaWYoIGFyZy5oYXNPd25Qcm9wZXJ0eShcInhcIikgJiYgYXJnLmhhc093blByb3BlcnR5KFwieVwiKSApIHtcbiAgICAgICAgICAgdnggPSBhcmcueDtcbiAgICAgICAgICAgdnkgPSBhcmcueTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9heGVzID0gW3Z4LCB2eV07XG59O1xuVmVjdG9yLnByb3RvdHlwZSA9IHtcbiAgICBkaXN0YW5jZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLl9heGVzWzBdIC0gdi5fYXhlc1swXTtcbiAgICAgICAgdmFyIHkgPSB0aGlzLl9heGVzWzFdIC0gdi5fYXhlc1sxXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgVmVjdG9yOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOWkhOeQhuS4uuW5s+a7kee6v+adoVxuICovXG5pbXBvcnQgVmVjdG9yIGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiBAaW5uZXJcbiAqL1xuZnVuY3Rpb24gaW50ZXJwb2xhdGUocDAsIHAxLCBwMiwgcDMsIHQsIHQyLCB0Mykge1xuICAgIHZhciB2MCA9IChwMiAtIHAwKSAqIDAuMjU7XG4gICAgdmFyIHYxID0gKHAzIC0gcDEpICogMC4yNTtcbiAgICByZXR1cm4gKDIgKiAocDEgLSBwMikgKyB2MCArIHYxKSAqIHQzIFxuICAgICAgICAgICArICgtIDMgKiAocDEgLSBwMikgLSAyICogdjAgLSB2MSkgKiB0MlxuICAgICAgICAgICArIHYwICogdCArIHAxO1xufVxuLyoqXG4gKiDlpJrnur/mrrXlubPmu5Hmm7Lnur8gXG4gKiBvcHQgPT0+IHBvaW50cyAsIGlzTG9vcFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoIG9wdCApIHtcbiAgICB2YXIgcG9pbnRzID0gb3B0LnBvaW50cztcbiAgICB2YXIgaXNMb29wID0gb3B0LmlzTG9vcDtcbiAgICB2YXIgc21vb3RoRmlsdGVyID0gb3B0LnNtb290aEZpbHRlcjtcblxuICAgIHZhciBsZW4gPSBwb2ludHMubGVuZ3RoO1xuICAgIGlmKCBsZW4gPT0gMSApe1xuICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gW107XG4gICAgdmFyIGRpc3RhbmNlICA9IDA7XG4gICAgdmFyIHByZVZlcnRvciA9IG5ldyBWZWN0b3IoIHBvaW50c1swXSApO1xuICAgIHZhciBpVnRvciAgICAgPSBudWxsXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpVnRvciA9IG5ldyBWZWN0b3IocG9pbnRzW2ldKTtcbiAgICAgICAgZGlzdGFuY2UgKz0gcHJlVmVydG9yLmRpc3RhbmNlKCBpVnRvciApO1xuICAgICAgICBwcmVWZXJ0b3IgPSBpVnRvcjtcbiAgICB9XG5cbiAgICBwcmVWZXJ0b3IgPSBudWxsO1xuICAgIGlWdG9yICAgICA9IG51bGw7XG5cblxuICAgIC8v5Z+65pys5LiK562J5LqO5puy546HXG4gICAgdmFyIHNlZ3MgPSBkaXN0YW5jZSAvIDY7XG5cbiAgICBzZWdzID0gc2VncyA8IGxlbiA/IGxlbiA6IHNlZ3M7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdzOyBpKyspIHtcbiAgICAgICAgdmFyIHBvcyA9IGkgLyAoc2Vncy0xKSAqIChpc0xvb3AgPyBsZW4gOiBsZW4gLSAxKTtcbiAgICAgICAgdmFyIGlkeCA9IE1hdGguZmxvb3IocG9zKTtcblxuICAgICAgICB2YXIgdyA9IHBvcyAtIGlkeDtcblxuICAgICAgICB2YXIgcDA7XG4gICAgICAgIHZhciBwMSA9IHBvaW50c1tpZHggJSBsZW5dO1xuICAgICAgICB2YXIgcDI7XG4gICAgICAgIHZhciBwMztcbiAgICAgICAgaWYgKCFpc0xvb3ApIHtcbiAgICAgICAgICAgIHAwID0gcG9pbnRzW2lkeCA9PT0gMCA/IGlkeCA6IGlkeCAtIDFdO1xuICAgICAgICAgICAgcDIgPSBwb2ludHNbaWR4ID4gbGVuIC0gMiA/IGxlbiAtIDEgOiBpZHggKyAxXTtcbiAgICAgICAgICAgIHAzID0gcG9pbnRzW2lkeCA+IGxlbiAtIDMgPyBsZW4gLSAxIDogaWR4ICsgMl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwMCA9IHBvaW50c1soaWR4IC0xICsgbGVuKSAlIGxlbl07XG4gICAgICAgICAgICBwMiA9IHBvaW50c1soaWR4ICsgMSkgJSBsZW5dO1xuICAgICAgICAgICAgcDMgPSBwb2ludHNbKGlkeCArIDIpICUgbGVuXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3MiA9IHcgKiB3O1xuICAgICAgICB2YXIgdzMgPSB3ICogdzI7XG5cbiAgICAgICAgdmFyIHJwID0gW1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlKHAwWzBdLCBwMVswXSwgcDJbMF0sIHAzWzBdLCB3LCB3MiwgdzMpLFxuICAgICAgICAgICAgICAgIGludGVycG9sYXRlKHAwWzFdLCBwMVsxXSwgcDJbMV0sIHAzWzFdLCB3LCB3MiwgdzMpXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICBfLmlzRnVuY3Rpb24oc21vb3RoRmlsdGVyKSAmJiBzbW9vdGhGaWx0ZXIoIHJwICk7XG5cbiAgICAgICAgcmV0LnB1c2goIHJwICk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59OyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmipjnur8g57G7XHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHBvaW50TGlzdCDlkITkuKrpobbop5LlnZDmoIdcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgU21vb3RoU3BsaW5lIGZyb20gXCIuLi9nZW9tL1Ntb290aFNwbGluZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIEJyb2tlbkxpbmUgPSBmdW5jdGlvbihvcHQgLCBhdHlwZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJicm9rZW5saW5lXCI7XHJcbiAgICBzZWxmLl9kcmF3VHlwZU9ubHkgPSBcInN0cm9rZVwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIGlmKCBhdHlwZSAhPT0gXCJjbG9uZVwiICl7XHJcbiAgICAgICAgc2VsZi5faW5pdFBvaW50TGlzdChvcHQuY29udGV4dCk7XHJcbiAgICB9O1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBsaW5lVHlwZTogbnVsbCxcclxuICAgICAgICBzbW9vdGg6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50TGlzdDogW10sIC8ve0FycmF5fSAgLy8g5b+F6aG777yM5ZCE5Liq6aG26KeS5Z2Q5qCHXHJcbiAgICAgICAgc21vb3RoRmlsdGVyOiBudWxsXHJcbiAgICB9LCBvcHQuY29udGV4dCApO1xyXG5cclxuICAgIEJyb2tlbkxpbmUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhCcm9rZW5MaW5lLCBTaGFwZSwge1xyXG4gICAgJHdhdGNoOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICBpZiAobmFtZSA9PSBcInBvaW50TGlzdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRQb2ludExpc3QodGhpcy5jb250ZXh0LCB2YWx1ZSwgcHJlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfaW5pdFBvaW50TGlzdDogZnVuY3Rpb24oY29udGV4dCwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG15QyA9IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKG15Qy5zbW9vdGgpIHtcclxuICAgICAgICAgICAgLy9zbW9vdGhGaWx0ZXIgLS0g5q+U5aaC5Zyo5oqY57q/5Zu+5Lit44CC5Lya5Lyg5LiA5Liqc21vb3RoRmlsdGVy6L+H5p2l5YGacG9pbnTnmoTnuqDmraPjgIJcclxuICAgICAgICAgICAgLy/orql55LiN6IO96LaF6L+H5bqV6YOo55qE5Y6f54K5XHJcbiAgICAgICAgICAgIHZhciBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHM6IG15Qy5wb2ludExpc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKG15Qy5zbW9vdGhGaWx0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc21vb3RoRmlsdGVyID0gbXlDLnNtb290aEZpbHRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7IC8v5pys5qyh6L2s5o2i5LiN5Ye65Y+R5b+D6LezXHJcbiAgICAgICAgICAgIHZhciBjdXJyTCA9IFNtb290aFNwbGluZShvYmopO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyTFtjdXJyTC5sZW5ndGggLSAxXVswXSA9IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdWzBdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBteUMucG9pbnRMaXN0ID0gY3Vyckw7XHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICAvL3BvbHlnb27pnIDopoHopobnm5ZkcmF35pa55rOV77yM5omA5Lul6KaB5oqK5YW35L2T55qE57uY5Yi25Luj56CB5L2c5Li6X2RyYXfmir3nprvlh7rmnaVcclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgIH0sXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xyXG4gICAgICAgIGlmIChwb2ludExpc3QubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAvLyDlsJHkuo4y5Liq54K55bCx5LiN55S75LqGflxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWNvbnRleHQubGluZVR5cGUgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnc29saWQnKSB7XHJcbiAgICAgICAgICAgIC8v6buY6K6k5Li65a6e57q/XHJcbiAgICAgICAgICAgIC8vVE9ETzrnm67liY3lpoLmnpwg5pyJ6K6+572uc21vb3RoIOeahOaDheWGteS4i+aYr+S4jeaUr+aMgeiZmue6v+eahFxyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHBvaW50TGlzdFswXVswXSwgcG9pbnRMaXN0WzBdWzFdKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5zbW9vdGgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNpID0gMCwgc2wgPSBwb2ludExpc3QubGVuZ3RoOyBzaSA8IHNsOyBzaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpID09IHNsLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCBwb2ludExpc3Rbc2ldWzBdICwgcG9pbnRMaXN0W3NpXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oIHBvaW50TGlzdFtzaSsxXVswXSAsIHBvaW50TGlzdFtzaSsxXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpKz0xO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v55S76Jma57q/55qE5pa55rOVICBcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21YID0gcG9pbnRMaXN0W2kgLSAxXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9YID0gcG9pbnRMaXN0W2ldWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tWSA9IHBvaW50TGlzdFtpIC0gMV1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvWSA9IHBvaW50TGlzdFtpXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhjdHgsIGZyb21YLCBmcm9tWSwgdG9YLCB0b1ksIDUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IGNvbnRleHQgPyBjb250ZXh0IDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFJlY3RGb3JtUG9pbnRMaXN0KGNvbnRleHQpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgQnJva2VuTGluZTsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAciDlnIbljYrlvoRcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxuXHJcbnZhciBDaXJjbGUgPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwiY2lyY2xlXCI7XHJcblxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG5cclxuICAgIC8v6buY6K6k5oOF5Ya15LiL6Z2i77yMY2lyY2xl5LiN6ZyA6KaB5oqKeHnov5vooYxwYXJlbnRJbnTovazmjaJcclxuICAgICggXCJ4eVRvSW50XCIgaW4gb3B0ICkgfHwgKCBvcHQueHlUb0ludCA9IGZhbHNlICk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICByIDogb3B0LmNvbnRleHQuciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOWchuWNiuW+hFxyXG4gICAgfVxyXG4gICAgQ2lyY2xlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhDaXJjbGUgLCBTaGFwZSAsIHtcclxuICAgLyoqXHJcbiAgICAgKiDliJvlu7rlnIblvaLot6/lvoRcclxuICAgICAqIEBwYXJhbSB7Q29udGV4dDJEfSBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgaWYgKCFzdHlsZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguYXJjKDAgLCAwLCBzdHlsZS5yLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue55+p5b2i5Yy65Z+f77yM55So5LqO5bGA6YOo5Yi35paw5ZKM5paH5a2X5a6a5L2NXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGVcclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdCA6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgfHwgc3R5bGUuc3Ryb2tlU3R5bGUgKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5yIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgIHkgOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5yIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgIHdpZHRoIDogc3R5bGUuciAqIDIgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCA6IHN0eWxlLnIgKiAyICsgbGluZVdpZHRoXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaXJjbGU7XHJcblxyXG5cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gLS0gdCB7MCwgMX1cbiAgICAgKiBAcmV0dXJuIHtQb2ludH0gIC0tIHJldHVybiBwb2ludCBhdCB0aGUgZ2l2ZW4gdGltZSBpbiB0aGUgYmV6aWVyIGFyY1xuICAgICAqL1xuICAgIGdldFBvaW50QnlUaW1lOiBmdW5jdGlvbih0ICwgcGxpc3QpIHtcbiAgICAgICAgdmFyIGl0ID0gMSAtIHQsXG4gICAgICAgIGl0MiA9IGl0ICogaXQsXG4gICAgICAgIGl0MyA9IGl0MiAqIGl0O1xuICAgICAgICB2YXIgdDIgPSB0ICogdCxcbiAgICAgICAgdDMgPSB0MiAqIHQ7XG4gICAgICAgIHZhciB4U3RhcnQ9cGxpc3RbMF0seVN0YXJ0PXBsaXN0WzFdLGNwWDE9cGxpc3RbMl0sY3BZMT1wbGlzdFszXSxjcFgyPTAsY3BZMj0wLHhFbmQ9MCx5RW5kPTA7XG4gICAgICAgIGlmKHBsaXN0Lmxlbmd0aD42KXtcbiAgICAgICAgICAgIGNwWDI9cGxpc3RbNF07XG4gICAgICAgICAgICBjcFkyPXBsaXN0WzVdO1xuICAgICAgICAgICAgeEVuZD1wbGlzdFs2XTtcbiAgICAgICAgICAgIHlFbmQ9cGxpc3RbN107XG4gICAgICAgICAgICAvL+S4ieasoei0neWhnuWwlFxuICAgICAgICAgICAgcmV0dXJuIHsgXG4gICAgICAgICAgICAgICAgeCA6IGl0MyAqIHhTdGFydCArIDMgKiBpdDIgKiB0ICogY3BYMSArIDMgKiBpdCAqIHQyICogY3BYMiArIHQzICogeEVuZCxcbiAgICAgICAgICAgICAgICB5IDogaXQzICogeVN0YXJ0ICsgMyAqIGl0MiAqIHQgKiBjcFkxICsgMyAqIGl0ICogdDIgKiBjcFkyICsgdDMgKiB5RW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+S6jOasoei0neWhnuWwlFxuICAgICAgICAgICAgeEVuZD1wbGlzdFs0XTtcbiAgICAgICAgICAgIHlFbmQ9cGxpc3RbNV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHggOiBpdDIgKiB4U3RhcnQgKyAyICogdCAqIGl0ICogY3BYMSArIHQyKnhFbmQsXG4gICAgICAgICAgICAgICAgeSA6IGl0MiAqIHlTdGFydCArIDIgKiB0ICogaXQgKiBjcFkxICsgdDIqeUVuZFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiBQYXRoIOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBwYXRoIHBhdGjkuLJcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgTWF0cml4IGZyb20gXCIuLi9nZW9tL01hdHJpeFwiO1xyXG5pbXBvcnQgQmV6aWVyIGZyb20gXCIuLi9nZW9tL2JlemllclwiO1xyXG5cclxudmFyIFBhdGggPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwicGF0aFwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIGlmIChcImRyYXdUeXBlT25seVwiIGluIG9wdCkge1xyXG4gICAgICAgIHNlbGYuZHJhd1R5cGVPbmx5ID0gb3B0LmRyYXdUeXBlT25seTtcclxuICAgIH07XHJcbiAgICBzZWxmLl9fcGFyc2VQYXRoRGF0YSA9IG51bGw7XHJcbiAgICB2YXIgX2NvbnRleHQgPSB7XHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy/ku47kuIvpnaLnmoRwYXRo5Lit6K6h566X5b6X5Yiw55qE6L6555WM54K555qE6ZuG5ZCIXHJcbiAgICAgICAgcGF0aDogb3B0LmNvbnRleHQucGF0aCB8fCBcIlwiIC8v5a2X56ym5LiyIOW/hemhu++8jOi3r+W+hOOAguS+i+WmgjpNIDAgMCBMIDAgMTAgTCAxMCAxMCBaICjkuIDkuKrkuInop5LlvaIpXHJcbiAgICAgICAgICAgIC8vTSA9IG1vdmV0b1xyXG4gICAgICAgICAgICAvL0wgPSBsaW5ldG9cclxuICAgICAgICAgICAgLy9IID0gaG9yaXpvbnRhbCBsaW5ldG9cclxuICAgICAgICAgICAgLy9WID0gdmVydGljYWwgbGluZXRvXHJcbiAgICAgICAgICAgIC8vQyA9IGN1cnZldG9cclxuICAgICAgICAgICAgLy9TID0gc21vb3RoIGN1cnZldG9cclxuICAgICAgICAgICAgLy9RID0gcXVhZHJhdGljIEJlbHppZXIgY3VydmVcclxuICAgICAgICAgICAgLy9UID0gc21vb3RoIHF1YWRyYXRpYyBCZWx6aWVyIGN1cnZldG9cclxuICAgICAgICAgICAgLy9aID0gY2xvc2VwYXRoXHJcbiAgICB9O1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKF9jb250ZXh0LCAoc2VsZi5fY29udGV4dCB8fCB7fSkpO1xyXG4gICAgUGF0aC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKFBhdGgsIFNoYXBlLCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicGF0aFwiKSB7IC8v5aaC5p6ccGF0aOacieWPmOWKqO+8jOmcgOimgeiHquWKqOiuoeeul+aWsOeahHBvaW50TGlzdFxyXG4gICAgICAgICAgICB0aGlzLl9fcGFyc2VQYXRoRGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5wb2ludExpc3QgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgX3BhcnNlUGF0aERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fX3BhcnNlUGF0aERhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJzZVBhdGhEYXRhO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8v5YiG5ouG5a2Q5YiG57uEXHJcbiAgICAgICAgdGhpcy5fX3BhcnNlUGF0aERhdGEgPSBbXTtcclxuICAgICAgICB2YXIgcGF0aHMgPSBfLmNvbXBhY3QoZGF0YS5yZXBsYWNlKC9bTW1dL2csIFwiXFxcXHIkJlwiKS5zcGxpdCgnXFxcXHInKSk7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICBfLmVhY2gocGF0aHMsIGZ1bmN0aW9uKHBhdGhTdHIpIHtcclxuICAgICAgICAgICAgbWUuX19wYXJzZVBhdGhEYXRhLnB1c2gobWUuX3BhcnNlQ2hpbGRQYXRoRGF0YShwYXRoU3RyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJzZVBhdGhEYXRhO1xyXG4gICAgfSxcclxuICAgIF9wYXJzZUNoaWxkUGF0aERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAvLyBjb21tYW5kIHN0cmluZ1xyXG4gICAgICAgIHZhciBjcyA9IGRhdGE7XHJcbiAgICAgICAgLy8gY29tbWFuZCBjaGFyc1xyXG4gICAgICAgIHZhciBjYyA9IFtcclxuICAgICAgICAgICAgJ20nLCAnTScsICdsJywgJ0wnLCAndicsICdWJywgJ2gnLCAnSCcsICd6JywgJ1onLFxyXG4gICAgICAgICAgICAnYycsICdDJywgJ3EnLCAnUScsICd0JywgJ1QnLCAncycsICdTJywgJ2EnLCAnQSdcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvICAvZywgJyAnKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLyAvZywgJywnKTtcclxuICAgICAgICAvL2NzID0gY3MucmVwbGFjZSgvKC4pLS9nLCBcIiQxLC1cIik7XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8oXFxkKS0vZywgJyQxLC0nKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLywsL2csICcsJyk7XHJcbiAgICAgICAgdmFyIG47XHJcbiAgICAgICAgLy8gY3JlYXRlIHBpcGVzIHNvIHRoYXQgd2UgY2FuIHNwbGl0IHRoZSBkYXRhXHJcbiAgICAgICAgZm9yIChuID0gMDsgbiA8IGNjLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgIGNzID0gY3MucmVwbGFjZShuZXcgUmVnRXhwKGNjW25dLCAnZycpLCAnfCcgKyBjY1tuXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBhcnJheVxyXG4gICAgICAgIHZhciBhcnIgPSBjcy5zcGxpdCgnfCcpO1xyXG4gICAgICAgIHZhciBjYSA9IFtdO1xyXG4gICAgICAgIC8vIGluaXQgY29udGV4dCBwb2ludFxyXG4gICAgICAgIHZhciBjcHggPSAwO1xyXG4gICAgICAgIHZhciBjcHkgPSAwO1xyXG4gICAgICAgIGZvciAobiA9IDE7IG4gPCBhcnIubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgdmFyIHN0ciA9IGFycltuXTtcclxuICAgICAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KDApO1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJ2UsLScsICdnJyksICdlLScpO1xyXG5cclxuICAgICAgICAgICAgLy/mnInnmoTml7blgJnvvIzmr5TlpoLigJwyMu+8jC0yMuKAnSDmlbDmja7lj6/og73kvJrnu4/luLjnmoTooqvlhpnmiJAyMi0yMu+8jOmCo+S5iOmcgOimgeaJi+WKqOS/ruaUuVxyXG4gICAgICAgICAgICAvL3N0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJy0nLCAnZycpLCAnLC0nKTtcclxuICAgICAgICAgICAgLy9zdHIgPSBzdHIucmVwbGFjZSgvKC4pLS9nLCBcIiQxLC1cIilcclxuICAgICAgICAgICAgdmFyIHAgPSBzdHIuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA+IDAgJiYgcFswXSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwW2ldID0gcGFyc2VGbG9hdChwW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAocC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFswXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdGxQdHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RsUHR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZDbWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJ4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHJ5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBzaTtcclxuICAgICAgICAgICAgICAgIHZhciBmYTtcclxuICAgICAgICAgICAgICAgIHZhciBmcztcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgeDEgPSBjcHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgeTEgPSBjcHk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCBsLCBILCBoLCBWLCBhbmQgdiB0byBMXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnbCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ00nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdoJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0gnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1YnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdDJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gocC5zaGlmdCgpLCBwLnNoaWZ0KCksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q21kID0gY2FbY2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2Q21kLmNvbW1hbmQgPT09ICdDJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4ICsgKGNweCAtIHByZXZDbWQucG9pbnRzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweSArIChjcHkgLSBwcmV2Q21kLnBvaW50c1szXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3RsUHR4LCBjdGxQdHksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdDJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ0MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCwgY3RsUHR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwLnNoaWZ0KCksIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdRJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdUJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ1EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjdGxQdHgsIGN0bFB0eSwgY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnUSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGN0bFB0eCwgY3RsUHR5LCBjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTsgLy945Y2K5b6EXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ5ID0gcC5zaGlmdCgpOyAvL3nljYrlvoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHNpID0gcC5zaGlmdCgpOyAvL+aXi+i9rOinkuW6plxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYSA9IHAuc2hpZnQoKTsgLy/op5LluqblpKflsI8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpOyAvL+aXtumSiOaWueWQkVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCksIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMgPSB0aGlzLl9jb252ZXJ0UG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSwgeTEsIGNweCwgY3B5LCBmYSwgZnMsIHJ4LCByeSwgcHNpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBzaSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmEgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IHRoaXMuX2NvbnZlcnRQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxLCB5MSwgY3B4LCBjcHksIGZhLCBmcywgcngsIHJ5LCBwc2lcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNtZCB8fCBjLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50czogcG9pbnRzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGMgPT09ICd6JyB8fCBjID09PSAnWicpIHtcclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICd6JyxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHM6IFtdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNhO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKlxyXG4gICAgICogQHBhcmFtIHgxIOWOn+eCuXhcclxuICAgICAqIEBwYXJhbSB5MSDljp/ngrl5XHJcbiAgICAgKiBAcGFyYW0geDIg57uI54K55Z2Q5qCHIHhcclxuICAgICAqIEBwYXJhbSB5MiDnu4jngrnlnZDmoIcgeVxyXG4gICAgICogQHBhcmFtIGZhIOinkuW6puWkp+Wwj1xyXG4gICAgICogQHBhcmFtIGZzIOaXtumSiOaWueWQkVxyXG4gICAgICogQHBhcmFtIHJ4IHjljYrlvoRcclxuICAgICAqIEBwYXJhbSByeSB55Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0gcHNpRGVnIOaXi+i9rOinkuW6plxyXG4gICAgICovXHJcbiAgICBfY29udmVydFBvaW50OiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZmEsIGZzLCByeCwgcnksIHBzaURlZykge1xyXG5cclxuICAgICAgICB2YXIgcHNpID0gcHNpRGVnICogKE1hdGguUEkgLyAxODAuMCk7XHJcbiAgICAgICAgdmFyIHhwID0gTWF0aC5jb3MocHNpKSAqICh4MSAtIHgyKSAvIDIuMCArIE1hdGguc2luKHBzaSkgKiAoeTEgLSB5MikgLyAyLjA7XHJcbiAgICAgICAgdmFyIHlwID0gLTEgKiBNYXRoLnNpbihwc2kpICogKHgxIC0geDIpIC8gMi4wICsgTWF0aC5jb3MocHNpKSAqICh5MSAtIHkyKSAvIDIuMDtcclxuXHJcbiAgICAgICAgdmFyIGxhbWJkYSA9ICh4cCAqIHhwKSAvIChyeCAqIHJ4KSArICh5cCAqIHlwKSAvIChyeSAqIHJ5KTtcclxuXHJcbiAgICAgICAgaWYgKGxhbWJkYSA+IDEpIHtcclxuICAgICAgICAgICAgcnggKj0gTWF0aC5zcXJ0KGxhbWJkYSk7XHJcbiAgICAgICAgICAgIHJ5ICo9IE1hdGguc3FydChsYW1iZGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGYgPSBNYXRoLnNxcnQoKCgocnggKiByeCkgKiAocnkgKiByeSkpIC0gKChyeCAqIHJ4KSAqICh5cCAqIHlwKSkgLSAoKHJ5ICogcnkpICogKHhwICogeHApKSkgLyAoKHJ4ICogcngpICogKHlwICogeXApICsgKHJ5ICogcnkpICogKHhwICogeHApKSk7XHJcblxyXG4gICAgICAgIGlmIChmYSA9PT0gZnMpIHtcclxuICAgICAgICAgICAgZiAqPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTmFOKGYpKSB7XHJcbiAgICAgICAgICAgIGYgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGN4cCA9IGYgKiByeCAqIHlwIC8gcnk7XHJcbiAgICAgICAgdmFyIGN5cCA9IGYgKiAtcnkgKiB4cCAvIHJ4O1xyXG5cclxuICAgICAgICB2YXIgY3ggPSAoeDEgKyB4MikgLyAyLjAgKyBNYXRoLmNvcyhwc2kpICogY3hwIC0gTWF0aC5zaW4ocHNpKSAqIGN5cDtcclxuICAgICAgICB2YXIgY3kgPSAoeTEgKyB5MikgLyAyLjAgKyBNYXRoLnNpbihwc2kpICogY3hwICsgTWF0aC5jb3MocHNpKSAqIGN5cDtcclxuXHJcbiAgICAgICAgdmFyIHZNYWcgPSBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdlJhdGlvID0gZnVuY3Rpb24odSwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gKHVbMF0gKiB2WzBdICsgdVsxXSAqIHZbMV0pIC8gKHZNYWcodSkgKiB2TWFnKHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB2QW5nbGUgPSBmdW5jdGlvbih1LCB2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodVswXSAqIHZbMV0gPCB1WzFdICogdlswXSA/IC0xIDogMSkgKiBNYXRoLmFjb3ModlJhdGlvKHUsIHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHZBbmdsZShbMSwgMF0sIFsoeHAgLSBjeHApIC8gcngsICh5cCAtIGN5cCkgLyByeV0pO1xyXG4gICAgICAgIHZhciB1ID0gWyh4cCAtIGN4cCkgLyByeCwgKHlwIC0gY3lwKSAvIHJ5XTtcclxuICAgICAgICB2YXIgdiA9IFsoLTEgKiB4cCAtIGN4cCkgLyByeCwgKC0xICogeXAgLSBjeXApIC8gcnldO1xyXG4gICAgICAgIHZhciBkVGhldGEgPSB2QW5nbGUodSwgdik7XHJcblxyXG4gICAgICAgIGlmICh2UmF0aW8odSwgdikgPD0gLTEpIHtcclxuICAgICAgICAgICAgZFRoZXRhID0gTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZSYXRpbyh1LCB2KSA+PSAxKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmcyA9PT0gMCAmJiBkVGhldGEgPiAwKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IGRUaGV0YSAtIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZnMgPT09IDEgJiYgZFRoZXRhIDwgMCkge1xyXG4gICAgICAgICAgICBkVGhldGEgPSBkVGhldGEgKyAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtjeCwgY3ksIHJ4LCByeSwgdGhldGEsIGRUaGV0YSwgcHNpLCBmc107XHJcbiAgICB9LFxyXG4gICAgLypcclxuICAgICAqIOiOt+WPlmJlemllcuS4iumdoueahOeCueWIl+ihqFxyXG4gICAgICogKi9cclxuICAgIF9nZXRCZXppZXJQb2ludHM6IGZ1bmN0aW9uKHApIHtcclxuICAgICAgICB2YXIgc3RlcHMgPSBNYXRoLmFicyhNYXRoLnNxcnQoTWF0aC5wb3cocC5zbGljZSgtMSlbMF0gLSBwWzFdLCAyKSArIE1hdGgucG93KHAuc2xpY2UoLTIsIC0xKVswXSAtIHBbMF0sIDIpKSk7XHJcbiAgICAgICAgc3RlcHMgPSBNYXRoLmNlaWwoc3RlcHMgLyA1KTtcclxuICAgICAgICB2YXIgcGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHN0ZXBzOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHQgPSBpIC8gc3RlcHM7XHJcbiAgICAgICAgICAgIHZhciB0cCA9IEJlemllci5nZXRQb2ludEJ5VGltZSh0LCBwKTtcclxuICAgICAgICAgICAgcGFyci5wdXNoKHRwLngpO1xyXG4gICAgICAgICAgICBwYXJyLnB1c2godHAueSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcGFycjtcclxuICAgIH0sXHJcbiAgICAvKlxyXG4gICAgICog5aaC5p6ccGF0aOS4reaciUEgYSDvvIzopoHlr7zlh7rlr7nlupTnmoRwb2ludHNcclxuICAgICAqL1xyXG4gICAgX2dldEFyY1BvaW50czogZnVuY3Rpb24ocCkge1xyXG5cclxuICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgIHZhciBjeSA9IHBbMV07XHJcbiAgICAgICAgdmFyIHJ4ID0gcFsyXTtcclxuICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHBbNF07XHJcbiAgICAgICAgdmFyIGRUaGV0YSA9IHBbNV07XHJcbiAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgdmFyIGZzID0gcFs3XTtcclxuICAgICAgICB2YXIgciA9IChyeCA+IHJ5KSA/IHJ4IDogcnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSAocnggPiByeSkgPyByeSAvIHJ4IDogMTtcclxuXHJcbiAgICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgTWF0cml4KCk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS5pZGVudGl0eSgpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKHBzaSk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoY3gsIGN5KTtcclxuXHJcbiAgICAgICAgdmFyIGNwcyA9IFtdO1xyXG4gICAgICAgIHZhciBzdGVwcyA9ICgzNjAgLSAoIWZzID8gMSA6IC0xKSAqIGRUaGV0YSAqIDE4MCAvIE1hdGguUEkpICUgMzYwO1xyXG5cclxuICAgICAgICBzdGVwcyA9IE1hdGguY2VpbChNYXRoLm1pbihNYXRoLmFicyhkVGhldGEpICogMTgwIC8gTWF0aC5QSSwgciAqIE1hdGguYWJzKGRUaGV0YSkgLyA4KSk7IC8v6Ze06ZqU5LiA5Liq5YOP57SgIOaJgOS7pSAvMlxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludCA9IFtNYXRoLmNvcyh0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByLCBNYXRoLnNpbih0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByXTtcclxuICAgICAgICAgICAgcG9pbnQgPSBfdHJhbnNmb3JtLm11bFZlY3Rvcihwb2ludCk7XHJcbiAgICAgICAgICAgIGNwcy5wdXNoKHBvaW50WzBdKTtcclxuICAgICAgICAgICAgY3BzLnB1c2gocG9pbnRbMV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNwcztcclxuICAgIH0sXHJcblxyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBzdHlsZSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAgY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHZhciBwYXRoID0gc3R5bGUucGF0aDtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gdGhpcy5fcGFyc2VQYXRoRGF0YShwYXRoKTtcclxuICAgICAgICB0aGlzLl9zZXRQb2ludExpc3QocGF0aEFycmF5LCBzdHlsZSk7XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IDAsIGdsID0gcGF0aEFycmF5Lmxlbmd0aDsgZyA8IGdsOyBnKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoQXJyYXlbZ10ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHBhdGhBcnJheVtnXVtpXS5jb21tYW5kLCBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBbMF0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwWzBdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHBbMF0sIHBbMV0sIHBbMl0sIHBbM10sIHBbNF0sIHBbNV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdRJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8ocFswXSwgcFsxXSwgcFsyXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3kgPSBwWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnggPSBwWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhldGEgPSBwWzRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZFRoZXRhID0gcFs1XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcyA9IHBbN107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gKHJ4ID4gcnkpID8gcnggOiByeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVZID0gKHJ4ID4gcnkpID8gcnkgLyByeCA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnJvdGF0ZShwc2kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZShjeCwgY3kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+i/kOeUqOefqemYteW8gOWni+WPmOW9olxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYXJjKDAsIDAsIHIsIHRoZXRhLCB0aGV0YSArIGRUaGV0YSwgMSAtIGZzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9fdHJhbnNmb3JtLmludmVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS5pbnZlcnQoKS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd6JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgX3NldFBvaW50TGlzdDogZnVuY3Rpb24ocGF0aEFycmF5LCBzdHlsZSkge1xyXG4gICAgICAgIGlmIChzdHlsZS5wb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g6K6w5b2V6L6555WM54K577yM55So5LqO5Yik5pataW5zaWRlXHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IHN0eWxlLnBvaW50TGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGcgPSAwLCBnbCA9IHBhdGhBcnJheS5sZW5ndGg7IGcgPCBnbDsgZysrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2luZ2xlUG9pbnRMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBwYXRoQXJyYXlbZ11baV0uY29tbWFuZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gJ0EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHRoaXMuX2dldEFyY1BvaW50cyhwKTtcclxuICAgICAgICAgICAgICAgICAgICAvL0Hlkb3ku6TnmoTor53vvIzlpJbmjqXnn6nlvaLnmoTmo4DmtYvlv4XpobvovazmjaLkuLpfcG9pbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aEFycmF5W2ddW2ldLl9wb2ludHMgPSBwO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJDXCIgfHwgY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJRXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY1N0YXJ0ID0gWzAsIDBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBzaW5nbGVQb2ludExpc3Quc2xpY2UoLTEpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZVBvaW50cyA9IChwYXRoQXJyYXlbZ11baSAtIDFdLl9wb2ludHMgfHwgcGF0aEFycmF5W2ddW2kgLSAxXS5wb2ludHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJlUG9pbnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBwcmVQb2ludHMuc2xpY2UoLTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBwID0gdGhpcy5fZ2V0QmV6aWVyUG9pbnRzKGNTdGFydC5jb25jYXQocCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhBcnJheVtnXVtpXS5fcG9pbnRzID0gcDtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwLmxlbmd0aDsgaiA8IGs7IGogKz0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBweCA9IHBbal07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHB5ID0gcFtqICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCghcHggJiYgcHghPTApIHx8ICghcHkgJiYgcHkhPTApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlUG9pbnRMaXN0LnB1c2goW3B4LCBweV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCAmJiBwb2ludExpc3QucHVzaChzaW5nbGVQb2ludExpc3QpO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBnZXRSZWN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsaW5lV2lkdGg7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICBpZiAoc3R5bGUuc3Ryb2tlU3R5bGUgfHwgc3R5bGUuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWluWCA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIG1heFggPSAtTnVtYmVyLk1BWF9WQUxVRTsvL051bWJlci5NSU5fVkFMVUU7XHJcblxyXG4gICAgICAgIHZhciBtaW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICB2YXIgbWF4WSA9IC1OdW1iZXIuTUFYX1ZBTFVFOy8vTnVtYmVyLk1JTl9WQUxVRTtcclxuXHJcbiAgICAgICAgLy8g5bmz56e75Z2Q5qCHXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuXHJcbiAgICAgICAgdmFyIHBhdGhBcnJheSA9IHRoaXMuX3BhcnNlUGF0aERhdGEoc3R5bGUucGF0aCk7XHJcbiAgICAgICAgdGhpcy5fc2V0UG9pbnRMaXN0KHBhdGhBcnJheSwgc3R5bGUpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBnID0gMCwgZ2wgPSBwYXRoQXJyYXkubGVuZ3RoOyBnIDwgZ2w7IGcrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwYXRoQXJyYXlbZ11baV0uX3BvaW50cyB8fCBwYXRoQXJyYXlbZ11baV0ucG9pbnRzO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqICUgMiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocFtqXSArIHggPCBtaW5YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5YID0gcFtqXSArIHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB4ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4WCA9IHBbal0gKyB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB5IDwgbWluWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluWSA9IHBbal0gKyB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwW2pdICsgeSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFkgPSBwW2pdICsgeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciByZWN0O1xyXG4gICAgICAgIGlmIChtaW5YID09PSBOdW1iZXIuTUFYX1ZBTFVFIHx8IG1heFggPT09IE51bWJlci5NSU5fVkFMVUUgfHwgbWluWSA9PT0gTnVtYmVyLk1BWF9WQUxVRSB8fCBtYXhZID09PSBOdW1iZXIuTUlOX1ZBTFVFKSB7XHJcbiAgICAgICAgICAgIHJlY3QgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICAgICAgeTogMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVjdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IE1hdGgucm91bmQobWluWCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgeTogTWF0aC5yb3VuZChtaW5ZIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogbWF4WCAtIG1pblggKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG1heFkgLSBtaW5ZICsgbGluZVdpZHRoXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZWN0O1xyXG4gICAgfVxyXG5cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBhdGg7IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOawtOa7tOW9oiDnsbtcclxuICog5rS+55Sf6IeqUGF0aOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBociDmsLTmu7TmqKrlrr3vvIjkuK3lv4PliLDmsLTlubPovrnnvJjmnIDlrr3lpITot53nprvvvIlcclxuICogQHZyIOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gKiovXHJcbmltcG9ydCBQYXRoIGZyb20gXCIuL1BhdGhcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIERyb3BsZXQgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICBociA6IG9wdC5jb250ZXh0LmhyIHx8IDAgLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5rC05ru05qiq5a6977yI5Lit5b+D5Yiw5rC05bmz6L6557yY5pyA5a695aSE6Led56a777yJXHJcbiAgICAgICAgdnIgOiBvcHQuY29udGV4dC52ciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gICAgfTtcclxuICAgIERyb3BsZXQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgc2VsZi50eXBlID0gXCJkcm9wbGV0XCI7XHJcbn07XHJcblV0aWxzLmNyZWF0Q2xhc3MoIERyb3BsZXQgLCBQYXRoICwge1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgIHZhciBwcyA9IFwiTSAwIFwiK3N0eWxlLmhyK1wiIEMgXCIrc3R5bGUuaHIrXCIgXCIrc3R5bGUuaHIrXCIgXCIrKCBzdHlsZS5ociozLzIgKSArXCIgXCIrKC1zdHlsZS5oci8zKStcIiAwIFwiKygtc3R5bGUudnIpO1xyXG4gICAgICAgcHMgKz0gXCIgQyBcIisoLXN0eWxlLmhyICogMy8gMikrXCIgXCIrKC1zdHlsZS5ociAvIDMpK1wiIFwiKygtc3R5bGUuaHIpK1wiIFwiK3N0eWxlLmhyK1wiIDAgXCIrIHN0eWxlLmhyO1xyXG4gICAgICAgdGhpcy5jb250ZXh0LnBhdGggPSBwcztcclxuICAgICAgIHRoaXMuX2RyYXcoY3R4ICwgc3R5bGUpO1xyXG4gICAgfVxyXG59ICk7XHJcbmV4cG9ydCBkZWZhdWx0IERyb3BsZXQ7XHJcbiIsIlxyXG4vKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5qSt5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJIFxyXG4gKlxyXG4gKiBAaHIg5qSt5ZyG5qiq6L205Y2K5b6EXHJcbiAqIEB2ciDmpK3lnIbnurXovbTljYrlvoRcclxuICovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbnZhciBFbGxpcHNlID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwiZWxsaXBzZVwiO1xyXG5cclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgLy94ICAgICAgICAgICAgIDogMCAsIC8ve251bWJlcn0sICAvLyDkuKLlvINcclxuICAgICAgICAvL3kgICAgICAgICAgICAgOiAwICwgLy97bnVtYmVyfSwgIC8vIOS4ouW8g++8jOWOn+WboOWQjGNpcmNsZVxyXG4gICAgICAgIGhyIDogb3B0LmNvbnRleHQuaHIgfHwgMCAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmpK3lnIbmqKrovbTljYrlvoRcclxuICAgICAgICB2ciA6IG9wdC5jb250ZXh0LnZyIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5qSt5ZyG57q16L205Y2K5b6EXHJcbiAgICB9XHJcblxyXG4gICAgRWxsaXBzZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKEVsbGlwc2UgLCBTaGFwZSAsIHtcclxuICAgIGRyYXcgOiAgZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHZhciByID0gKHN0eWxlLmhyID4gc3R5bGUudnIpID8gc3R5bGUuaHIgOiBzdHlsZS52cjtcclxuICAgICAgICB2YXIgcmF0aW9YID0gc3R5bGUuaHIgLyByOyAvL+aoqui9tOe8qeaUvuavlOeOh1xyXG4gICAgICAgIHZhciByYXRpb1kgPSBzdHlsZS52ciAvIHI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnNjYWxlKHJhdGlvWCwgcmF0aW9ZKTtcclxuICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICAwLCAwLCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGlmICggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCApe1xyXG4gICAgICAgICAgIC8vaWXkuIvpnaLopoHmg7Pnu5jliLbkuKrmpK3lnIblh7rmnaXvvIzlsLHkuI3og73miafooYzov5nmraXkuoZcclxuICAgICAgICAgICAvL+eul+aYr2V4Y2FudmFzIOWunueOsOS4iumdoueahOS4gOS4qmJ1Z+WQp1xyXG4gICAgICAgICAgIGN0eC5zY2FsZSgxL3JhdGlvWCwgMS9yYXRpb1kpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGdldFJlY3QgOiBmdW5jdGlvbihzdHlsZSl7XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgfHwgc3R5bGUuc3Ryb2tlU3R5bGUpIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5ociAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgIHkgOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS52ciAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgIHdpZHRoIDogc3R5bGUuaHIgKiAyICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICAgIGhlaWdodCA6IHN0eWxlLnZyICogMiArIGxpbmVXaWR0aFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVsbGlwc2U7XHJcbiIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDlpJrovrnlvaIg57G7ICDvvIjkuI3op4TliJnvvIlcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcG9pbnRMaXN0IOWkmui+ueW9ouWQhOS4qumhtuinkuWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBCcm9rZW5MaW5lIGZyb20gXCIuL0Jyb2tlbkxpbmVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFBvbHlnb24gPSBmdW5jdGlvbihvcHQgLCBhdHlwZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuXHJcbiAgICBpZihhdHlwZSAhPT0gXCJjbG9uZVwiKXtcclxuICAgICAgICB2YXIgc3RhcnQgPSBvcHQuY29udGV4dC5wb2ludExpc3RbMF07XHJcbiAgICAgICAgdmFyIGVuZCAgID0gb3B0LmNvbnRleHQucG9pbnRMaXN0WyBvcHQuY29udGV4dC5wb2ludExpc3QubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgIGlmKCBvcHQuY29udGV4dC5zbW9vdGggKXtcclxuICAgICAgICAgICAgb3B0LmNvbnRleHQucG9pbnRMaXN0LnVuc2hpZnQoIGVuZCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9wdC5jb250ZXh0LnBvaW50TGlzdC5wdXNoKCBzdGFydCApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIFBvbHlnb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIGlmKGF0eXBlICE9PSBcImNsb25lXCIgJiYgb3B0LmNvbnRleHQuc21vb3RoICYmIGVuZCl7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLl9kcmF3VHlwZU9ubHkgPSBudWxsO1xyXG4gICAgc2VsZi50eXBlID0gXCJwb2x5Z29uXCI7XHJcbn07XHJcblV0aWxzLmNyZWF0Q2xhc3MoUG9seWdvbiwgQnJva2VuTGluZSwge1xyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmxpbmVUeXBlID09ICdkYXNoZWQnIHx8IGNvbnRleHQubGluZVR5cGUgPT0gJ2RvdHRlZCcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcclxuICAgICAgICAgICAgICAgIC8v54m55q6K5aSE55CG77yM6Jma57q/5Zu05LiN5oiQcGF0aO+8jOWunue6v+WGjWJ1aWxk5LiA5qyhXHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwb2ludExpc3RbMF1bMF0sIHBvaW50TGlzdFswXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL+WmguaenOS4i+mdouS4jeWKoHNhdmUgcmVzdG9yZe+8jGNhbnZhc+S8muaKiuS4i+mdoueahHBhdGjlkozkuIrpnaLnmoRwYXRo5LiA6LW3566X5L2c5LiA5p2hcGF0aOOAguWwseS8mue7mOWItuS6huS4gOadoeWunueOsOi+ueahhuWSjOS4gOiZmue6v+i+ueahhuOAglxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBvbHlnb247IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOato27ovrnlvaLvvIhuPj0z77yJXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIkgXHJcbiAqXHJcbiAqIEByIOato27ovrnlvaLlpJbmjqXlnIbljYrlvoRcclxuICogQHIg5oyH5piO5q2j5Yeg6L655b2iXHJcbiAqXHJcbiAqIEBwb2ludExpc3Qg56eB5pyJ77yM5LuO5LiK6Z2i55qEcuWSjG7orqHnrpflvpfliLDnmoTovrnnlYzlgLznmoTpm4blkIhcclxuICovXHJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuL1BvbHlnb25cIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIElzb2dvbiA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy/ku47kuIvpnaLnmoRy5ZKMbuiuoeeul+W+l+WIsOeahOi+ueeVjOWAvOeahOmbhuWQiFxyXG4gICAgICAgIHI6IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmraNu6L655b2i5aSW5o6l5ZyG5Y2K5b6EXHJcbiAgICAgICAgbjogMCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5oyH5piO5q2j5Yeg6L655b2iXHJcbiAgICB9ICwgb3B0LmNvbnRleHQpO1xyXG4gICAgc2VsZi5zZXRQb2ludExpc3Qoc2VsZi5fY29udGV4dCk7XHJcbiAgICBvcHQuY29udGV4dCA9IHNlbGYuX2NvbnRleHQ7XHJcbiAgICBJc29nb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy50eXBlID0gXCJpc29nb25cIjtcclxufTtcclxuVXRpbHMuY3JlYXRDbGFzcyhJc29nb24sIFBvbHlnb24sIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJyXCIgfHwgbmFtZSA9PSBcIm5cIikgeyAvL+WmguaenHBhdGjmnInlj5jliqjvvIzpnIDopoHoh6rliqjorqHnrpfmlrDnmoRwb2ludExpc3RcclxuICAgICAgICAgICAgdGhpcy5zZXRQb2ludExpc3QoIHRoaXMuY29udGV4dCApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXRQb2ludExpc3Q6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgc3R5bGUucG9pbnRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIG4gPSBzdHlsZS5uLCByID0gc3R5bGUucjtcclxuICAgICAgICB2YXIgZFN0ZXAgPSAyICogTWF0aC5QSSAvIG47XHJcbiAgICAgICAgdmFyIGJlZ2luRGVnID0gLU1hdGguUEkgLyAyO1xyXG4gICAgICAgIHZhciBkZWcgPSBiZWdpbkRlZztcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgZW5kID0gbjsgaSA8IGVuZDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0eWxlLnBvaW50TGlzdC5wdXNoKFtyICogTWF0aC5jb3MoZGVnKSwgciAqIE1hdGguc2luKGRlZyldKTtcclxuICAgICAgICAgICAgZGVnICs9IGRTdGVwO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBJc29nb247IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOe6v+adoSDnsbtcclxuICpcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAbGluZVR5cGUgIOWPr+mAiSDomZrnur8g5a6e546wIOeahCDnsbvlnotcclxuICogQHhTdGFydCAgICDlv4XpobvvvIzotbfngrnmqKrlnZDmoIdcclxuICogQHlTdGFydCAgICDlv4XpobvvvIzotbfngrnnurXlnZDmoIdcclxuICogQHhFbmQgICAgICDlv4XpobvvvIznu4jngrnmqKrlnZDmoIdcclxuICogQHlFbmQgICAgICDlv4XpobvvvIznu4jngrnnurXlnZDmoIdcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIExpbmUgPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMudHlwZSA9IFwibGluZVwiO1xyXG4gICAgdGhpcy5kcmF3VHlwZU9ubHkgPSBcInN0cm9rZVwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgbGluZVR5cGU6IG9wdC5jb250ZXh0LmxpbmVUeXBlIHx8IG51bGwsIC8v5Y+v6YCJIOiZmue6vyDlrp7njrAg55qEIOexu+Wei1xyXG4gICAgICAgIHhTdGFydDogb3B0LmNvbnRleHQueFN0YXJ0IHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzotbfngrnmqKrlnZDmoIdcclxuICAgICAgICB5U3RhcnQ6IG9wdC5jb250ZXh0LnlTdGFydCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAgICAgICAgeEVuZDogb3B0LmNvbnRleHQueEVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAgICAgICAgeUVuZDogb3B0LmNvbnRleHQueUVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K557q15Z2Q5qCHXHJcbiAgICAgICAgZGFzaExlbmd0aDogb3B0LmNvbnRleHQuZGFzaExlbmd0aFxyXG4gICAgfVxyXG4gICAgTGluZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKExpbmUsIFNoYXBlLCB7XHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uue6v+adoei3r+W+hFxyXG4gICAgICogY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICBpZiAoIXN0eWxlLmxpbmVUeXBlIHx8IHN0eWxlLmxpbmVUeXBlID09ICdzb2xpZCcpIHtcclxuICAgICAgICAgICAgLy/pu5jorqTkuLrlrp7nur9cclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhwYXJzZUludChzdHlsZS54U3RhcnQpLCBwYXJzZUludChzdHlsZS55U3RhcnQpKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhwYXJzZUludChzdHlsZS54RW5kKSwgcGFyc2VJbnQoc3R5bGUueUVuZCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3R5bGUubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgc3R5bGUubGluZVR5cGUgPT0gJ2RvdHRlZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXNoZWRMaW5lVG8oXHJcbiAgICAgICAgICAgICAgICBjdHgsXHJcbiAgICAgICAgICAgICAgICBzdHlsZS54U3RhcnQsIHN0eWxlLnlTdGFydCxcclxuICAgICAgICAgICAgICAgIHN0eWxlLnhFbmQsIHN0eWxlLnlFbmQsXHJcbiAgICAgICAgICAgICAgICBzdHlsZS5kYXNoTGVuZ3RoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuefqeW9ouWMuuWfn++8jOeUqOS6juWxgOmDqOWIt+aWsOWSjOaWh+Wtl+WumuS9jVxyXG4gICAgICogc3R5bGVcclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICB2YXIgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBNYXRoLm1pbihzdHlsZS54U3RhcnQsIHN0eWxlLnhFbmQpIC0gbGluZVdpZHRoLFxyXG4gICAgICAgICAgICB5OiBNYXRoLm1pbihzdHlsZS55U3RhcnQsIHN0eWxlLnlFbmQpIC0gbGluZVdpZHRoLFxyXG4gICAgICAgICAgICB3aWR0aDogTWF0aC5hYnMoc3R5bGUueFN0YXJ0IC0gc3R5bGUueEVuZCkgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoc3R5bGUueVN0YXJ0IC0gc3R5bGUueUVuZCkgKyBsaW5lV2lkdGhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMaW5lOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDnn6nnjrAg57G7ICDvvIjkuI3op4TliJnvvIlcclxuICpcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAd2lkdGgg5a695bqmXHJcbiAqIEBoZWlnaHQg6auY5bqmXHJcbiAqIEByYWRpdXMg5aaC5p6c5piv5ZyG6KeS55qE77yM5YiZ5Li644CQ5LiK5Y+z5LiL5bem44CR6aG65bqP55qE5ZyG6KeS5Y2K5b6E5pWw57uEXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBSZWN0ID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwicmVjdFwiO1xyXG5cclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgIHdpZHRoICAgICAgICAgOiBvcHQuY29udGV4dC53aWR0aCB8fCAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzlrr3luqZcclxuICAgICAgICAgaGVpZ2h0ICAgICAgICA6IG9wdC5jb250ZXh0LmhlaWdodHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOmrmOW6plxyXG4gICAgICAgICByYWRpdXMgICAgICAgIDogb3B0LmNvbnRleHQucmFkaXVzfHwgW10gICAgIC8ve2FycmF5fSwgICAvLyDpu5jorqTkuLpbMF3vvIzlnIbop5IgXHJcbiAgICB9XHJcbiAgICBSZWN0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoIFJlY3QgLCBTaGFwZSAsIHtcclxuICAgIC8qKlxyXG4gICAgICog57uY5Yi25ZyG6KeS55+p5b2iXHJcbiAgICAgKiBAcGFyYW0ge0NvbnRleHQyRH0gY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfYnVpbGRSYWRpdXNQYXRoOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgLy/lt6bkuIrjgIHlj7PkuIrjgIHlj7PkuIvjgIHlt6bkuIvop5LnmoTljYrlvoTkvp3mrKHkuLpyMeOAgXIy44CBcjPjgIFyNFxyXG4gICAgICAgIC8vcue8qeWGmeS4ujEgICAgICAgICDnm7jlvZPkuo4gWzEsIDEsIDEsIDFdXHJcbiAgICAgICAgLy9y57yp5YaZ5Li6WzFdICAgICAgIOebuOW9k+S6jiBbMSwgMSwgMSwgMV1cclxuICAgICAgICAvL3LnvKnlhpnkuLpbMSwgMl0gICAg55u45b2T5LqOIFsxLCAyLCAxLCAyXVxyXG4gICAgICAgIC8vcue8qeWGmeS4ulsxLCAyLCAzXSDnm7jlvZPkuo4gWzEsIDIsIDMsIDJdXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmNvbnRleHQud2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuY29udGV4dC5oZWlnaHQ7XHJcbiAgICBcclxuICAgICAgICB2YXIgciA9IFV0aWxzLmdldENzc09yZGVyQXJyKHN0eWxlLnJhZGl1cyk7XHJcbiAgICAgXHJcbiAgICAgICAgY3R4Lm1vdmVUbyggcGFyc2VJbnQoeCArIHJbMF0pLCBwYXJzZUludCh5KSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCArIHdpZHRoIC0gclsxXSksIHBhcnNlSW50KHkpKTtcclxuICAgICAgICByWzFdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByWzFdXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHBhcnNlSW50KHggKyB3aWR0aCksIHBhcnNlSW50KHkgKyBoZWlnaHQgLSByWzJdKSk7XHJcbiAgICAgICAgclsyXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgICAgIHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gclsyXSwgeSArIGhlaWdodFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4ICsgclszXSksIHBhcnNlSW50KHkgKyBoZWlnaHQpKTtcclxuICAgICAgICByWzNdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJbM11cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCksIHBhcnNlSW50KHkgKyByWzBdKSk7XHJcbiAgICAgICAgclswXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgclswXSwgeSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rnn6nlvaLot6/lvoRcclxuICAgICAqIEBwYXJhbSB7Q29udGV4dDJEfSBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgaWYoIXN0eWxlLiRtb2RlbC5yYWRpdXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmKCEhc3R5bGUuZmlsbFN0eWxlKXtcclxuICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KCAwICwgMCAsdGhpcy5jb250ZXh0LndpZHRoLHRoaXMuY29udGV4dC5oZWlnaHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoISFzdHlsZS5saW5lV2lkdGgpe1xyXG4gICAgICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCggMCAsIDAgLCB0aGlzLmNvbnRleHQud2lkdGgsdGhpcy5jb250ZXh0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9idWlsZFJhZGl1c1BhdGgoY3R4LCBzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxyXG4gICAgICovXHJcbiAgICBnZXRSZWN0IDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZpbGxTdHlsZSB8fCBzdHlsZS5zdHJva2VTdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICAgICAgeSA6IE1hdGgucm91bmQoMCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMuY29udGV4dC53aWR0aCArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogdGhpcy5jb250ZXh0LmhlaWdodCArIGxpbmVXaWR0aFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbn0gKTtcclxuZXhwb3J0IGRlZmF1bHQgUmVjdDsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5omH5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcjAg6buY6K6k5Li6MO+8jOWGheWchuWNiuW+hOaMh+WumuWQjuWwhuWHuueOsOWGheW8p++8jOWQjOaXtuaJh+i+uemVv+W6piA9IHIgLSByMFxyXG4gKiBAciAg5b+F6aG777yM5aSW5ZyG5Y2K5b6EXHJcbiAqIEBzdGFydEFuZ2xlIOi1t+Wni+inkuW6pigwLCAzNjApXHJcbiAqIEBlbmRBbmdsZSAgIOe7k+adn+inkuW6pigwLCAzNjApXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuaW1wb3J0IG15TWF0aCBmcm9tIFwiLi4vZ2VvbS9NYXRoXCI7XHJcblxyXG52YXIgU2VjdG9yID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmICA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInNlY3RvclwiO1xyXG4gICAgc2VsZi5yZWdBbmdsZSAgPSBbXTtcclxuICAgIHNlbGYuaXNSaW5nICAgID0gZmFsc2U7Ly/mmK/lkKbkuLrkuIDkuKrlnIbnjq9cclxuXHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ICA9IHtcclxuICAgICAgICBwb2ludExpc3QgIDogW10sLy/ovrnnlYzngrnnmoTpm4blkIgs56eB5pyJ77yM5LuO5LiL6Z2i55qE5bGe5oCn6K6h566X55qE5p2lXHJcbiAgICAgICAgcjAgICAgICAgICA6IG9wdC5jb250ZXh0LnIwICAgICAgICAgfHwgMCwvLyDpu5jorqTkuLow77yM5YaF5ZyG5Y2K5b6E5oyH5a6a5ZCO5bCG5Ye6546w5YaF5byn77yM5ZCM5pe25omH6L656ZW/5bqmID0gciAtIHIwXHJcbiAgICAgICAgciAgICAgICAgICA6IG9wdC5jb250ZXh0LnIgICAgICAgICAgfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5aSW5ZyG5Y2K5b6EXHJcbiAgICAgICAgc3RhcnRBbmdsZSA6IG9wdC5jb250ZXh0LnN0YXJ0QW5nbGUgfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW35aeL6KeS5bqmWzAsIDM2MClcclxuICAgICAgICBlbmRBbmdsZSAgIDogb3B0LmNvbnRleHQuZW5kQW5nbGUgICB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uT5p2f6KeS5bqmKDAsIDM2MF1cclxuICAgICAgICBjbG9ja3dpc2UgIDogb3B0LmNvbnRleHQuY2xvY2t3aXNlICB8fCBmYWxzZSAvL+aYr+WQpumhuuaXtumSiO+8jOm7mOiupOS4umZhbHNlKOmhuuaXtumSiClcclxuICAgIH1cclxuICAgIFNlY3Rvci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhTZWN0b3IgLCBTaGFwZSAsIHtcclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIGNvbnRleHQpIHtcclxuICAgICAgICAvLyDlvaLlhoXljYrlvoRbMCxyKVxyXG4gICAgICAgIHZhciByMCA9IHR5cGVvZiBjb250ZXh0LnIwID09ICd1bmRlZmluZWQnID8gMCA6IGNvbnRleHQucjA7XHJcbiAgICAgICAgdmFyIHIgID0gY29udGV4dC5yOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmiYflvaLlpJbljYrlvoQoMCxyXVxyXG4gICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICB2YXIgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LmVuZEFuZ2xlKTsgICAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgLy92YXIgaXNSaW5nICAgICA9IGZhbHNlOyAgICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKbkuLrlnIbnjq9cclxuXHJcbiAgICAgICAgLy9pZiggc3RhcnRBbmdsZSAhPSBlbmRBbmdsZSAmJiBNYXRoLmFicyhzdGFydEFuZ2xlIC0gZW5kQW5nbGUpICUgMzYwID09IDAgKSB7XHJcbiAgICAgICAgaWYoIHN0YXJ0QW5nbGUgPT0gZW5kQW5nbGUgJiYgY29udGV4dC5zdGFydEFuZ2xlICE9IGNvbnRleHQuZW5kQW5nbGUgKSB7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5Lik5Liq6KeS5bqm55u4562J77yM6YKj5LmI5bCx6K6k5Li65piv5Liq5ZyG546v5LqGXHJcbiAgICAgICAgICAgIHRoaXMuaXNSaW5nICAgICA9IHRydWU7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgPSAwIDtcclxuICAgICAgICAgICAgZW5kQW5nbGUgICA9IDM2MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSk7XHJcbiAgICAgICAgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUb1JhZGlhbihlbmRBbmdsZSk7XHJcbiAgICAgXHJcbiAgICAgICAgLy/lpITnkIbkuIvmnoHlsI/lpLnop5LnmoTmg4XlhrVcclxuICAgICAgICBpZiggZW5kQW5nbGUgLSBzdGFydEFuZ2xlIDwgMC4wMjUgKXtcclxuICAgICAgICAgICAgc3RhcnRBbmdsZSAtPSAwLjAwM1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmFyYyggMCAsIDAgLCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgaWYgKHIwICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmlzUmluZyApe1xyXG4gICAgICAgICAgICAgICAgLy/liqDkuIrov5nkuKppc1JpbmfnmoTpgLvovpHmmK/kuLrkuoblhbzlrrlmbGFzaGNhbnZhc+S4i+e7mOWItuWchueOr+eahOeahOmXrumimFxyXG4gICAgICAgICAgICAgICAgLy/kuI3liqDov5nkuKrpgLvovpFmbGFzaGNhbnZhc+S8mue7mOWItuS4gOS4quWkp+WchiDvvIwg6ICM5LiN5piv5ZyG546vXHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCByMCAsIDAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmMoIDAgLCAwICwgcjAgLCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgLCAhdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKCAwICwgMCAsIHIwICwgZW5kQW5nbGUgLCBzdGFydEFuZ2xlICwgIXRoaXMuY29udGV4dC5jbG9ja3dpc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9UT0RPOuWcqHIw5Li6MOeahOaXtuWAme+8jOWmguaenOS4jeWKoGxpbmVUbygwLDAp5p2l5oqK6Lev5b6E6Zet5ZCI77yM5Lya5Ye6546w5pyJ5pCe56yR55qE5LiA5LiqYnVnXHJcbiAgICAgICAgICAgIC8v5pW05Liq5ZyG5Lya5Ye6546w5LiA5Liq5Lul5q+P5Liq5omH5b2i5Lik56uv5Li66IqC54K555qE6ZWC56m677yM5oiR5Y+v6IO95o+P6L+w5LiN5riF5qWa77yM5Y+N5q2j6L+Z5Liq5Yqg5LiK5bCx5aW95LqGXHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oMCwwKTtcclxuICAgICAgICB9XHJcbiAgICAgfSxcclxuICAgICBnZXRSZWdBbmdsZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgIHRoaXMucmVnSW4gICAgICA9IHRydWU7ICAvL+WmguaenOWcqHN0YXJ05ZKMZW5k55qE5pWw5YC85Lit77yMZW5k5aSn5LqOc3RhcnTogIzkuJTmmK/pobrml7bpkojliJlyZWdJbuS4unRydWVcclxuICAgICAgICAgdmFyIGMgICAgICAgICAgID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjLnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGMuZW5kQW5nbGUpOyAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgIGlmICggKCBzdGFydEFuZ2xlID4gZW5kQW5nbGUgJiYgIWMuY2xvY2t3aXNlICkgfHwgKCBzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgYy5jbG9ja3dpc2UgKSApIHtcclxuICAgICAgICAgICAgIHRoaXMucmVnSW4gID0gZmFsc2U7IC8vb3V0XHJcbiAgICAgICAgIH07XHJcbiAgICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXHJcbiAgICAgICAgIHRoaXMucmVnQW5nbGUgICA9IFsgXHJcbiAgICAgICAgICAgICBNYXRoLm1pbiggc3RhcnRBbmdsZSAsIGVuZEFuZ2xlICkgLCBcclxuICAgICAgICAgICAgIE1hdGgubWF4KCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgKSBcclxuICAgICAgICAgXTtcclxuICAgICB9LFxyXG4gICAgIGdldFJlY3QgOiBmdW5jdGlvbihjb250ZXh0KXtcclxuICAgICAgICAgdmFyIGNvbnRleHQgPSBjb250ZXh0ID8gY29udGV4dCA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgdmFyIHIwID0gdHlwZW9mIGNvbnRleHQucjAgPT0gJ3VuZGVmaW5lZCcgICAgIC8vIOW9ouWGheWNiuW+hFswLHIpXHJcbiAgICAgICAgICAgICA/IDAgOiBjb250ZXh0LnIwO1xyXG4gICAgICAgICB2YXIgciA9IGNvbnRleHQucjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5omH5b2i5aSW5Y2K5b6EKDAscl1cclxuICAgICAgICAgXHJcbiAgICAgICAgIHRoaXMuZ2V0UmVnQW5nbGUoKTtcclxuXHJcbiAgICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICAgdmFyIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5lbmRBbmdsZSk7ICAgICAgICAgICAgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxyXG5cclxuICAgICAgICAgLypcclxuICAgICAgICAgdmFyIGlzQ2lyY2xlID0gZmFsc2U7XHJcbiAgICAgICAgIGlmKCBNYXRoLmFicyggc3RhcnRBbmdsZSAtIGVuZEFuZ2xlICkgPT0gMzYwIFxyXG4gICAgICAgICAgICAgICAgIHx8ICggc3RhcnRBbmdsZSA9PSBlbmRBbmdsZSAmJiBzdGFydEFuZ2xlICogZW5kQW5nbGUgIT0gMCApICl7XHJcbiAgICAgICAgICAgICBpc0NpcmNsZSA9IHRydWU7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgIHZhciBwb2ludExpc3QgID0gW107XHJcblxyXG4gICAgICAgICB2YXIgcDREaXJlY3Rpb249IHtcclxuICAgICAgICAgICAgIFwiOTBcIiA6IFsgMCAsIHIgXSxcclxuICAgICAgICAgICAgIFwiMTgwXCI6IFsgLXIsIDAgXSxcclxuICAgICAgICAgICAgIFwiMjcwXCI6IFsgMCAsIC1yXSxcclxuICAgICAgICAgICAgIFwiMzYwXCI6IFsgciAsIDAgXSBcclxuICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgIGZvciAoIHZhciBkIGluIHA0RGlyZWN0aW9uICl7XHJcbiAgICAgICAgICAgICB2YXIgaW5BbmdsZVJlZyA9IHBhcnNlSW50KGQpID4gdGhpcy5yZWdBbmdsZVswXSAmJiBwYXJzZUludChkKSA8IHRoaXMucmVnQW5nbGVbMV07XHJcbiAgICAgICAgICAgICBpZiggdGhpcy5pc1JpbmcgfHwgKGluQW5nbGVSZWcgJiYgdGhpcy5yZWdJbikgfHwgKCFpbkFuZ2xlUmVnICYmICF0aGlzLnJlZ0luKSApe1xyXG4gICAgICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKCBwNERpcmVjdGlvblsgZCBdICk7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmKCAhdGhpcy5pc1JpbmcgKSB7XHJcbiAgICAgICAgICAgICBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBzdGFydEFuZ2xlICk7XHJcbiAgICAgICAgICAgICBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBlbmRBbmdsZSAgICk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogcjAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogcjBcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogciAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogclxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3MoZW5kQW5nbGUpICAgKiByICAsICBteU1hdGguc2luKGVuZEFuZ2xlKSAgKiByXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhlbmRBbmdsZSkgICAqIHIwICwgIG15TWF0aC5zaW4oZW5kQW5nbGUpICAqIHIwXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBjb250ZXh0LnBvaW50TGlzdCA9IHBvaW50TGlzdDtcclxuICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjdEZvcm1Qb2ludExpc3QoIGNvbnRleHQgKTtcclxuICAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlY3RvcjsiLCJcbmltcG9ydCBBcHBsaWNhdGlvbiBmcm9tIFwiLi9BcHBsaWNhdGlvblwiO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnRNYW5hZ2VyXCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFN0YWdlIGZyb20gXCIuL2Rpc3BsYXkvU3RhZ2VcIjtcbmltcG9ydCBTcHJpdGUgZnJvbSBcIi4vZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9kaXNwbGF5L1NoYXBlXCI7XG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vZGlzcGxheS9Qb2ludFwiO1xuaW1wb3J0IFRleHQgZnJvbSBcIi4vZGlzcGxheS9UZXh0XCI7XG5cbi8vc2hhcGVzXG5pbXBvcnQgQnJva2VuTGluZSBmcm9tIFwiLi9zaGFwZS9Ccm9rZW5MaW5lXCI7XG5pbXBvcnQgQ2lyY2xlIGZyb20gXCIuL3NoYXBlL0NpcmNsZVwiO1xuaW1wb3J0IERyb3BsZXQgZnJvbSBcIi4vc2hhcGUvRHJvcGxldFwiO1xuaW1wb3J0IEVsbGlwc2UgZnJvbSBcIi4vc2hhcGUvRWxsaXBzZVwiO1xuaW1wb3J0IElzb2dvbiBmcm9tIFwiLi9zaGFwZS9Jc29nb25cIjtcbmltcG9ydCBMaW5lIGZyb20gXCIuL3NoYXBlL0xpbmVcIjtcbmltcG9ydCBQYXRoIGZyb20gXCIuL3NoYXBlL1BhdGhcIjtcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuL3NoYXBlL1BvbHlnb25cIjtcbmltcG9ydCBSZWN0IGZyb20gXCIuL3NoYXBlL1JlY3RcIjtcbmltcG9ydCBTZWN0b3IgZnJvbSBcIi4vc2hhcGUvU2VjdG9yXCI7XG5cbnZhciBDYW52YXggPSB7XG4gICAgQXBwOiBBcHBsaWNhdGlvblxufTtcblxuQ2FudmF4LkRpc3BsYXkgPSB7XG4gICAgRGlzcGxheU9iamVjdCA6IERpc3BsYXlPYmplY3QsXG4gICAgRGlzcGxheU9iamVjdENvbnRhaW5lciA6IERpc3BsYXlPYmplY3RDb250YWluZXIsXG4gICAgU3RhZ2UgIDogU3RhZ2UsXG4gICAgU3ByaXRlIDogU3ByaXRlLFxuICAgIFNoYXBlICA6IFNoYXBlLFxuICAgIFBvaW50ICA6IFBvaW50LFxuICAgIFRleHQgICA6IFRleHRcbn1cblxuQ2FudmF4LlNoYXBlcyA9IHtcbiAgICBCcm9rZW5MaW5lIDogQnJva2VuTGluZSxcbiAgICBDaXJjbGUgOiBDaXJjbGUsXG4gICAgRHJvcGxldCA6IERyb3BsZXQsXG4gICAgRWxsaXBzZSA6IEVsbGlwc2UsXG4gICAgSXNvZ29uIDogSXNvZ29uLFxuICAgIExpbmUgOiBMaW5lLFxuICAgIFBhdGggOiBQYXRoLFxuICAgIFBvbHlnb24gOiBQb2x5Z29uLFxuICAgIFJlY3QgOiBSZWN0LFxuICAgIFNlY3RvciA6IFNlY3RvclxufVxuXG5DYW52YXguRXZlbnQgPSB7XG4gICAgRXZlbnREaXNwYXRjaGVyIDogRXZlbnREaXNwYXRjaGVyLFxuICAgIEV2ZW50TWFuYWdlciAgICA6IEV2ZW50TWFuYWdlclxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW52YXg7Il0sIm5hbWVzIjpbIl8iLCJicmVha2VyIiwiQXJyYXlQcm90byIsIkFycmF5IiwicHJvdG90eXBlIiwiT2JqUHJvdG8iLCJPYmplY3QiLCJ0b1N0cmluZyIsImhhc093blByb3BlcnR5IiwibmF0aXZlRm9yRWFjaCIsImZvckVhY2giLCJuYXRpdmVGaWx0ZXIiLCJmaWx0ZXIiLCJuYXRpdmVJbmRleE9mIiwiaW5kZXhPZiIsIm5hdGl2ZUlzQXJyYXkiLCJpc0FycmF5IiwibmF0aXZlS2V5cyIsImtleXMiLCJ2YWx1ZXMiLCJvYmoiLCJsZW5ndGgiLCJpIiwiVHlwZUVycm9yIiwia2V5IiwiaGFzIiwicHVzaCIsImNhbGwiLCJlYWNoIiwiaXRlcmF0b3IiLCJjb250ZXh0IiwiY29tcGFjdCIsImFycmF5IiwiaWRlbnRpdHkiLCJzZWxlY3QiLCJyZXN1bHRzIiwidmFsdWUiLCJpbmRleCIsImxpc3QiLCJuYW1lIiwiaXNGdW5jdGlvbiIsImlzRmluaXRlIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc051bGwiLCJpc0VtcHR5IiwiaXNTdHJpbmciLCJpc0VsZW1lbnQiLCJub2RlVHlwZSIsImlzT2JqZWN0IiwiaXRlbSIsImlzU29ydGVkIiwiTWF0aCIsIm1heCIsInNvcnRlZEluZGV4IiwiaXNXaW5kb3ciLCJ3aW5kb3ciLCJpc1BsYWluT2JqZWN0IiwiY29uc3RydWN0b3IiLCJoYXNPd24iLCJlIiwidW5kZWZpbmVkIiwiZXh0ZW5kIiwib3B0aW9ucyIsInNyYyIsImNvcHkiLCJjb3B5SXNBcnJheSIsImNsb25lIiwidGFyZ2V0IiwiYXJndW1lbnRzIiwiZGVlcCIsInNsaWNlIiwiVXRpbHMiLCJkZXZpY2VQaXhlbFJhdGlvIiwiX1VJRCIsImNoYXJDb2RlIiwiY2hhckNvZGVBdCIsImdldFVJRCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImdldENvbnRleHQiLCJwcm90byIsIm5ld1Byb3RvIiwiT2JqZWN0Q3JlYXRlIiwiY3JlYXRlIiwiX19lbXB0eUZ1bmMiLCJyIiwicyIsInB4Iiwic3AiLCJycCIsImNyZWF0ZU9iamVjdCIsInN1cGVyY2xhc3MiLCJjYW52YXMiLCJGbGFzaENhbnZhcyIsImluaXRFbGVtZW50Iiwib3B0Iiwic291cmNlIiwic3RyaWN0IiwicjEiLCJyMiIsInIzIiwicjQiLCJQb2ludCIsIngiLCJ5IiwiYXJnIiwicCIsIkNhbnZheEV2ZW50IiwiZXZ0IiwicGFyYW1zIiwiZXZlbnRUeXBlIiwidHlwZSIsImN1cnJlbnRUYXJnZXQiLCJwb2ludCIsIl9zdG9wUHJvcGFnYXRpb24iLCJhZGRPclJtb3ZlRXZlbnRIYW5kIiwiZG9tSGFuZCIsImllSGFuZCIsImV2ZW50RG9tRm4iLCJlbCIsImZuIiwiZXZlbnRGbiIsImV2ZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJib3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkb2MiLCJvd25lckRvY3VtZW50IiwiYm9keSIsImRvY0VsZW0iLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRUb3AiLCJjbGllbnRMZWZ0IiwiYm91bmQiLCJyaWdodCIsImxlZnQiLCJjbGllbnRXaWR0aCIsInpvb20iLCJ0b3AiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInBhZ2VYT2Zmc2V0Iiwic2Nyb2xsTGVmdCIsInBhZ2VYIiwiY2xpZW50WCIsInBhZ2VZIiwiY2xpZW50WSIsIl93aWR0aCIsIl9oZWlnaHQiLCJpZCIsInN0eWxlIiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInNldEF0dHJpYnV0ZSIsInNldHRpbmdzIiwiUkVTT0xVVElPTiIsInZpZXciLCJjbGFzc05hbWUiLCJjc3NUZXh0Iiwic3RhZ2VfYyIsImRvbV9jIiwiYXBwZW5kQ2hpbGQiLCJfbW91c2VFdmVudFR5cGVzIiwiX2hhbW1lckV2ZW50VHlwZXMiLCJFdmVudEhhbmRsZXIiLCJjYW52YXgiLCJjdXJQb2ludHMiLCJjdXJQb2ludHNUYXJnZXQiLCJfdG91Y2hpbmciLCJfZHJhZ2luZyIsIl9jdXJzb3IiLCJ0eXBlcyIsImRyYWciLCJjb250YWlucyIsImNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIiwicGFyZW50IiwiY2hpbGQiLCJtZSIsImFkZEV2ZW50IiwiX19tb3VzZUhhbmRsZXIiLCJvbiIsIl9fbGliSGFuZGxlciIsInJvb3QiLCJ1cGRhdGVWaWV3T2Zmc2V0IiwiJCIsInZpZXdPZmZzZXQiLCJjdXJNb3VzZVBvaW50IiwiY3VyTW91c2VUYXJnZXQiLCJnZXRPYmplY3RzVW5kZXJQb2ludCIsImRyYWdFbmFibGVkIiwidG9FbGVtZW50IiwicmVsYXRlZFRhcmdldCIsIl9kcmFnRW5kIiwiZmlyZSIsIl9fZ2V0Y3VyUG9pbnRzVGFyZ2V0IiwiZ2xvYmFsQWxwaGEiLCJjbG9uZU9iamVjdCIsIl9jbG9uZTJob3ZlclN0YWdlIiwiX2dsb2JhbEFscGhhIiwiX2RyYWdNb3ZlSGFuZGVyIiwiX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMiLCJfY3Vyc29ySGFuZGVyIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsIm9sZE9iaiIsIl9ob3ZlckNsYXNzIiwicG9pbnRDaGtQcmlvcml0eSIsImdldENoaWxkSW5Qb2ludCIsImdsb2JhbFRvTG9jYWwiLCJkaXNwYXRjaEV2ZW50IiwidG9UYXJnZXQiLCJmcm9tVGFyZ2V0IiwiX3NldEN1cnNvciIsImN1cnNvciIsIl9fZ2V0Q2FudmF4UG9pbnRJblRvdWNocyIsIl9fZ2V0Q2hpbGRJblRvdWNocyIsInN0YXJ0IiwibW92ZSIsImVuZCIsImN1clRvdWNocyIsInRvdWNoIiwidG91Y2hzIiwidG91Y2hlc1RhcmdldCIsImNoaWxkcyIsImhhc0NoaWxkIiwiY2UiLCJzdGFnZVBvaW50IiwiX2RyYWdEdXBsaWNhdGUiLCJfYnVmZmVyU3RhZ2UiLCJnZXRDaGlsZEJ5SWQiLCJfdHJhbnNmb3JtIiwiZ2V0Q29uY2F0ZW5hdGVkTWF0cml4IiwiYWRkQ2hpbGRBdCIsIl9kcmFnUG9pbnQiLCJfcG9pbnQiLCJfbm90V2F0Y2giLCJfbW92ZVN0YWdlIiwibW92ZWluZyIsImhlYXJ0QmVhdCIsImRlc3Ryb3kiLCJFdmVudE1hbmFnZXIiLCJfZXZlbnRNYXAiLCJsaXN0ZW5lciIsImFkZFJlc3VsdCIsInNlbGYiLCJzcGxpdCIsIm1hcCIsIl9ldmVudEVuYWJsZWQiLCJyZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlIiwibGkiLCJzcGxpY2UiLCJfZGlzcGF0Y2hFdmVudCIsIkV2ZW50RGlzcGF0Y2hlciIsImNyZWF0Q2xhc3MiLCJfYWRkRXZlbnRMaXN0ZW5lciIsIl9yZW1vdmVFdmVudExpc3RlbmVyIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUiLCJfcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMiLCJsb2ciLCJlVHlwZSIsImNoaWxkcmVuIiwicHJlSGVhcnRCZWF0IiwiX2hlYXJ0QmVhdE51bSIsInByZWdBbHBoYSIsImhvdmVyQ2xvbmUiLCJnZXRTdGFnZSIsImFjdGl2U2hhcGUiLCJyZW1vdmVDaGlsZEJ5SWQiLCJfaGFzRXZlbnRMaXN0ZW5lciIsIm92ZXJGdW4iLCJvdXRGdW4iLCJvbmNlSGFuZGxlIiwiYXBwbHkiLCJ1biIsIk1hdHJpeCIsImEiLCJiIiwiYyIsImQiLCJ0eCIsInR5IiwibXR4Iiwic2NhbGVYIiwic2NhbGVZIiwicm90YXRpb24iLCJjb3MiLCJzaW4iLCJQSSIsImNvbmNhdCIsImFuZ2xlIiwic3QiLCJhYnMiLCJjdCIsInN4Iiwic3kiLCJkeCIsImR5IiwidiIsImFhIiwiYWMiLCJhdHgiLCJhYiIsImFkIiwiYXR5Iiwib3V0IiwiX2NhY2hlIiwiX3JhZGlhbnMiLCJpc0RlZ3JlZXMiLCJ0b0ZpeGVkIiwiZGVncmVlVG9SYWRpYW4iLCJyYWRpYW5Ub0RlZ3JlZSIsImRlZ3JlZVRvMzYwIiwicmVBbmciLCJpc0luc2lkZSIsInNoYXBlIiwiX3BvaW50SW5TaGFwZSIsIl9pc0luc2lkZUxpbmUiLCJfaXNJbnNpZGVCcm9rZW5MaW5lIiwiX2lzSW5zaWRlQ2lyY2xlIiwiX2lzUG9pbnRJbkVsaXBzZSIsIl9pc0luc2lkZVNlY3RvciIsIl9pc0luc2lkZVBhdGgiLCJfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIiLCJpc091dHNpZGUiLCJ4MCIsInhTdGFydCIsInkwIiwieVN0YXJ0IiwieDEiLCJ4RW5kIiwieTEiLCJ5RW5kIiwiX2wiLCJsaW5lV2lkdGgiLCJfYSIsIl9iIiwiX3MiLCJwb2ludExpc3QiLCJsaW5lQXJlYSIsImluc2lkZUNhdGNoIiwibCIsIl9pc0luc2lkZVJlY3RhbmdsZSIsIm1pbiIsInIwIiwic3RhcnRBbmdsZSIsIm15TWF0aCIsImVuZEFuZ2xlIiwiYXRhbjIiLCJyZWdJbiIsImNsb2Nrd2lzZSIsInJlZ0FuZ2xlIiwiaW5BbmdsZVJlZyIsImNlbnRlciIsIlhSYWRpdXMiLCJociIsIllSYWRpdXMiLCJ2ciIsImlSZXMiLCJwb2x5Iiwid24iLCJzaGlmdFAiLCJzaGlmdCIsImluTGluZSIsImZpbGxTdHlsZSIsIm4iLCJUV0VFTiIsIl90d2VlbnMiLCJ0d2VlbiIsInRpbWUiLCJwcmVzZXJ2ZSIsIm5vdyIsIl90IiwiX3VwZGF0ZVJlcyIsInVwZGF0ZSIsInByb2Nlc3MiLCJocnRpbWUiLCJwZXJmb3JtYW5jZSIsImJpbmQiLCJEYXRlIiwiZ2V0VGltZSIsIlR3ZWVuIiwib2JqZWN0IiwiX29iamVjdCIsIl92YWx1ZXNTdGFydCIsIl92YWx1ZXNFbmQiLCJfdmFsdWVzU3RhcnRSZXBlYXQiLCJfZHVyYXRpb24iLCJfcmVwZWF0IiwiX3JlcGVhdERlbGF5VGltZSIsIl95b3lvIiwiX2lzUGxheWluZyIsIl9yZXZlcnNlZCIsIl9kZWxheVRpbWUiLCJfc3RhcnRUaW1lIiwiX2Vhc2luZ0Z1bmN0aW9uIiwiRWFzaW5nIiwiTGluZWFyIiwiTm9uZSIsIl9pbnRlcnBvbGF0aW9uRnVuY3Rpb24iLCJJbnRlcnBvbGF0aW9uIiwiX2NoYWluZWRUd2VlbnMiLCJfb25TdGFydENhbGxiYWNrIiwiX29uU3RhcnRDYWxsYmFja0ZpcmVkIiwiX29uVXBkYXRlQ2FsbGJhY2siLCJfb25Db21wbGV0ZUNhbGxiYWNrIiwiX29uU3RvcENhbGxiYWNrIiwidG8iLCJwcm9wZXJ0aWVzIiwiZHVyYXRpb24iLCJhZGQiLCJwcm9wZXJ0eSIsInN0b3AiLCJyZW1vdmUiLCJzdG9wQ2hhaW5lZFR3ZWVucyIsIm51bUNoYWluZWRUd2VlbnMiLCJkZWxheSIsImFtb3VudCIsInJlcGVhdCIsInRpbWVzIiwicmVwZWF0RGVsYXkiLCJ5b3lvIiwiZWFzaW5nIiwiaW50ZXJwb2xhdGlvbiIsImNoYWluIiwib25TdGFydCIsImNhbGxiYWNrIiwib25VcGRhdGUiLCJvbkNvbXBsZXRlIiwib25TdG9wIiwiZWxhcHNlZCIsImNoYXJBdCIsInRtcCIsImsiLCJwb3ciLCJzcXJ0IiwiQm91bmNlIiwiT3V0IiwiSW4iLCJtIiwiZiIsImZsb29yIiwicHciLCJibiIsIkJlcm5zdGVpbiIsIkNhdG11bGxSb20iLCJwMCIsInAxIiwidCIsImZjIiwiRmFjdG9yaWFsIiwicDIiLCJwMyIsInYwIiwidjEiLCJ0MiIsInQzIiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJlbGVtZW50IiwiY3VyclRpbWUiLCJ0aW1lVG9DYWxsIiwic2V0VGltZW91dCIsIl90YXNrTGlzdCIsIl9yZXF1ZXN0QWlkIiwiZW5hYmxlZEFuaW1hdGlvbkZyYW1lIiwiY3VyclRhc2tMaXN0IiwidGFzayIsInJlZ2lzdEZyYW1lIiwiJGZyYW1lIiwiZGVzdHJveUZyYW1lIiwiZF9yZXN1bHQiLCJyZWdpc3RUd2VlbiIsInRpZCIsImZyb20iLCJfaXNDb21wbGV0ZWVkIiwiX2lzU3RvcGVkIiwiYW5pbWF0ZSIsImRlc2MiLCJkZXN0cm95VHdlZW4iLCJtc2ciLCJ1bndhdGNoT25lIiwiT2JzZXJ2ZSIsInNjb3BlIiwibW9kZWwiLCJ3YXRjaE1vcmUiLCJzdG9wUmVwZWF0QXNzaWduIiwic2tpcEFycmF5IiwiJHNraXBBcnJheSIsIlZCUHVibGljcyIsImxvb3AiLCJ2YWwiLCJ2YWx1ZVR5cGUiLCJhY2Nlc3NvciIsIm5lbyIsInByZVZhbHVlIiwiY29tcGxleFZhbHVlIiwibmVvVHlwZSIsImFkZENvbG9yU3RvcCIsIiRtb2RlbCIsIiRmaXJlIiwicG1vZGVsIiwiaGFzV2F0Y2hNb2RlbCIsIiR3YXRjaCIsIiRwYXJlbnQiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWNjZXNzb3JlcyIsIiRhY2Nlc3NvciIsImRlZmluZVByb3BlcnR5IiwicHJvcCIsIl9fZGVmaW5lR2V0dGVyX18iLCJnZXQiLCJfX2RlZmluZVNldHRlcl9fIiwic2V0IiwiZGVzY3MiLCJWQkFycmF5IiwiZXhlY1NjcmlwdCIsImpvaW4iLCJWQk1lZGlhdG9yIiwiZGVzY3JpcHRpb24iLCJwdWJsaWNzIiwib3duZXIiLCJidWZmZXIiLCJwYXJzZVZCIiwiUkVOREVSRVJfVFlQRSIsIlNIQVBFUyIsIkNPTlRFWFRfREVGQVVMVCIsIkRpc3BsYXlPYmplY3QiLCJjaGVja09wdCIsInN0YWdlIiwieHlUb0ludCIsIl9jcmVhdGVDb250ZXh0IiwiVUlEIiwiY3JlYXRlSWQiLCJpbml0IiwiX3VwZGF0ZVRyYW5zZm9ybSIsIl9jb250ZXh0QVRUUlMiLCJjb3B5MmNvbnRleHQiLCJfY29udGV4dCIsIiRvd25lciIsInRyYW5zRm9ybVByb3BzIiwibXlzZWxmIiwiY29uZiIsIm5ld09iaiIsInRleHQiLCJjb250YWluZXIiLCJjbSIsImludmVydCIsImxvY2FsVG9HbG9iYWwiLCJvIiwiYm9vbCIsIm51bSIsImZyb21JbmRleCIsImdldEluZGV4IiwidG9JbmRleCIsInBjbCIsIm9yaWdpbiIsInNjYWxlT3JpZ2luIiwidHJhbnNsYXRlIiwic2NhbGUiLCJyb3RhdGVPcmlnaW4iLCJyb3RhdGUiLCJwYXJzZUludCIsInN0cm9rZVN0eWxlIiwicmVzdWx0IiwiaW52ZXJzZU1hdHJpeCIsIm9yaWdpblBvcyIsIm11bFZlY3RvciIsIl9yZWN0IiwiZ2V0UmVjdCIsIkhpdFRlc3RQb2ludCIsInRvQ29udGVudCIsInVwRnVuIiwiY29tcEZ1biIsIkFuaW1hdGlvbkZyYW1lIiwiY3R4IiwidmlzaWJsZSIsInNhdmUiLCJ0cmFuc0Zvcm0iLCJ0cmFuc2Zvcm0iLCJ0b0FycmF5IiwicmVuZGVyIiwicmVzdG9yZSIsInJlbW92ZUNoaWxkIiwiRGlzcGxheU9iamVjdENvbnRhaW5lciIsIm1vdXNlQ2hpbGRyZW4iLCJnZXRDaGlsZEluZGV4IiwiX2FmdGVyQWRkQ2hpbGQiLCJyZW1vdmVDaGlsZEF0IiwiX2FmdGVyRGVsQ2hpbGQiLCJsZW4iLCJnZXRDaGlsZEF0IiwiYm9vbGVuIiwib2xkSW5kZXgiLCJnZXROdW1DaGlsZHJlbiIsIm9ianMiLCJfcmVuZGVyIiwiU3RhZ2UiLCJjb250ZXh0MkQiLCJzdGFnZVJlbmRpbmciLCJfaXNSZWFkeSIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiY2xlYXIiLCJjbGVhclJlY3QiLCJTeXN0ZW1SZW5kZXJlciIsIlVOS05PV04iLCJhcHAiLCJyZXF1ZXN0QWlkIiwiY29udmVydFN0YWdlcyIsIl9oZWFydEJlYXQiLCJfcHJlUmVuZGVyVGltZSIsImVudGVyRnJhbWUiLCJjb252ZXJ0U3RhZ2UiLCJjb252ZXJ0VHlwZSIsIl9jb252ZXJ0Q2FudmF4IiwiY29udmVydFNoYXBlcyIsInN0YXJ0RW50ZXIiLCJDYW52YXNSZW5kZXJlciIsIkNBTlZBUyIsIkFwcGxpY2F0aW9uIiwiX2NpZCIsInJhbmRvbSIsInF1ZXJ5Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJ2aWV3T2JqIiwiY3JlYXRlVmlldyIsImlubmVySFRNTCIsIm9mZnNldCIsImxhc3RHZXRSTyIsInJlbmRlcmVyIiwiUmVuZGVyZXIiLCJfY3JlYXRIb3ZlclN0YWdlIiwiX2NyZWF0ZVBpeGVsQ29udGV4dCIsInJlU2l6ZUNhbnZhcyIsInJlc2l6ZSIsImFkZENoaWxkIiwiX3BpeGVsQ2FudmFzIiwiY3JlYXRlQ2FudmFzIiwiY2FudmFzU3VwcG9ydCIsImRpc3BsYXkiLCJ6SW5kZXgiLCJ2aXNpYmlsaXR5IiwiX3BpeGVsQ3R4IiwiaW5zZXJ0QmVmb3JlIiwiaW5pdFN0YWdlIiwiU3ByaXRlIiwiR3JhcGhpY3NEYXRhIiwibGluZUNvbG9yIiwibGluZUFscGhhIiwiZmlsbENvbG9yIiwiZmlsbEFscGhhIiwiZmlsbCIsIl9saW5lVGludCIsIl9maWxsVGludCIsImhvbGVzIiwidHJhbnNwb3NlIiwiRmxvYXQzMkFycmF5IiwicG9zIiwibmV3UG9zIiwiYTEiLCJjMSIsInR4MSIsIm1hdHJpeCIsImIxIiwiZDEiLCJwaXZvdFgiLCJwaXZvdFkiLCJza2V3WCIsInNrZXdZIiwic3IiLCJjciIsImN5IiwibnN4IiwiY3giLCJkZWx0YSIsInNrZXciLCJJREVOVElUWSIsIlRFTVBfTUFUUklYIiwidXgiLCJ1eSIsInZ4IiwidnkiLCJ0ZW1wTWF0cmljZXMiLCJtdWwiLCJzaWdudW0iLCJyb3ciLCJqIiwiX3V4IiwiX3V5IiwiX3Z4IiwiX3Z5IiwibWF0IiwiUmVjdGFuZ2xlIiwiUkVDVCIsImJvdHRvbSIsIkVNUFRZIiwicmVjdGFuZ2xlIiwicGFkZGluZ1giLCJwYWRkaW5nWSIsIngyIiwieTIiLCJDaXJjbGUiLCJyYWRpdXMiLCJDSVJDIiwiRWxsaXBzZSIsIkVMSVAiLCJub3JteCIsIm5vcm15IiwiUG9seWdvbiIsInBvaW50cyIsImlsIiwiY2xvc2VkIiwiUE9MWSIsImluc2lkZSIsInhpIiwieWkiLCJ4aiIsInlqIiwiaW50ZXJzZWN0IiwiUm91bmRlZFJlY3RhbmdsZSIsIlJSRUMiLCJyYWRpdXMyIiwiYmV6aWVyQ3VydmVUbyIsImZyb21YIiwiZnJvbVkiLCJjcFgiLCJjcFkiLCJjcFgyIiwiY3BZMiIsInRvWCIsInRvWSIsInBhdGgiLCJkdCIsImR0MiIsImR0MyIsInRlbXBNYXRyaXgiLCJ0ZW1wUG9pbnQiLCJHcmFwaGljcyIsImdyYXBoaWNzRGF0YSIsInRpbnQiLCJfcHJldlRpbnQiLCJjdXJyZW50UGF0aCIsIl93ZWJHTCIsImRpcnR5IiwiZmFzdFJlY3REaXJ0eSIsImNsZWFyRGlydHkiLCJib3VuZHNEaXJ0eSIsImNhY2hlZFNwcml0ZURpcnR5IiwiX3Nwcml0ZVJlY3QiLCJfZmFzdFJlY3QiLCJib3VuZHNQYWRkaW5nIiwidXBkYXRlTG9jYWxCb3VuZHMiLCJjb2xvciIsImFscGhhIiwiZHJhd1NoYXBlIiwibW92ZVRvIiwieGEiLCJ5YSIsImEyIiwiYjIiLCJtbSIsImRkIiwiY2MiLCJ0dCIsImsxIiwiazIiLCJqMSIsImoyIiwicHkiLCJxeCIsInF5IiwiYXJjIiwiYW50aWNsb2Nrd2lzZSIsInN3ZWVwIiwic2VncyIsImNlaWwiLCJzdGFydFgiLCJzdGFydFkiLCJ0aGV0YSIsInRoZXRhMiIsImNUaGV0YSIsInNUaGV0YSIsInNlZ01pbnVzIiwicmVtYWluZGVyIiwicmVhbCIsImZpbGxpbmciLCJzZXRPYmplY3RSZW5kZXJlciIsInBsdWdpbnMiLCJncmFwaGljcyIsInBvcCIsImRhdGEiLCJjbG9zZSIsIl93ZWJnbCIsIl9sb2NhbEJvdW5kcyIsIlNoYXBlIiwiX2hvdmVyYWJsZSIsIl9jbGlja2FibGUiLCJkcmF3IiwiaW5pdENvbXBQcm9wZXJ0eSIsIl9oYXNGaWxsQW5kU3Ryb2tlIiwiX2RyYXdUeXBlT25seSIsImNsb3NlUGF0aCIsInN0cm9rZSIsImJlZ2luUGF0aCIsImRyYXdFbmQiLCJkYXNoTGVuZ3RoIiwiZGVsdGFYIiwiZGVsdGFZIiwibnVtRGFzaGVzIiwibGluZVRvIiwibWluWCIsIk51bWJlciIsIk1BWF9WQUxVRSIsIm1heFgiLCJNSU5fVkFMVUUiLCJtaW5ZIiwibWF4WSIsImNwbCIsInJvdW5kIiwiVGV4dCIsIl9yZU5ld2xpbmUiLCJmb250UHJvcGVydHMiLCJmb250IiwiX2dldEZvbnREZWNsYXJhdGlvbiIsImdldFRleHRXaWR0aCIsImdldFRleHRIZWlnaHQiLCJfcmVuZGVyVGV4dCIsIl9nZXRUZXh0TGluZXMiLCJfZ2V0VGV4dFdpZHRoIiwiX2dldFRleHRIZWlnaHQiLCJ0ZXh0TGluZXMiLCJfcmVuZGVyVGV4dFN0cm9rZSIsIl9yZW5kZXJUZXh0RmlsbCIsImZvbnRBcnIiLCJmb250UCIsIl9ib3VuZGFyaWVzIiwibGluZUhlaWdodHMiLCJoZWlnaHRPZkxpbmUiLCJfZ2V0SGVpZ2h0T2ZMaW5lIiwiX3JlbmRlclRleHRMaW5lIiwiX2dldFRvcE9mZnNldCIsInN0cm9rZURhc2hBcnJheSIsInNldExpbmVEYXNoIiwibWV0aG9kIiwibGluZSIsImxpbmVJbmRleCIsInRleHRBbGlnbiIsIl9yZW5kZXJDaGFycyIsIm1lYXN1cmVUZXh0IiwidG90YWxXaWR0aCIsIndvcmRzIiwid29yZHNXaWR0aCIsInJlcGxhY2UiLCJ3aWR0aERpZmYiLCJudW1TcGFjZXMiLCJzcGFjZVdpZHRoIiwibGVmdE9mZnNldCIsImNoYXJzIiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwibWF4V2lkdGgiLCJjdXJyZW50TGluZVdpZHRoIiwidGV4dEJhc2VsaW5lIiwiVmVjdG9yIiwiX2F4ZXMiLCJpbnRlcnBvbGF0ZSIsImlzTG9vcCIsInNtb290aEZpbHRlciIsInJldCIsImRpc3RhbmNlIiwicHJlVmVydG9yIiwiaVZ0b3IiLCJpZHgiLCJ3IiwidzIiLCJ3MyIsIkJyb2tlbkxpbmUiLCJhdHlwZSIsIl9pbml0UG9pbnRMaXN0IiwibXlDIiwic21vb3RoIiwiY3VyckwiLCJTbW9vdGhTcGxpbmUiLCJfZHJhdyIsImxpbmVUeXBlIiwic2kiLCJzbCIsImRhc2hlZExpbmVUbyIsImdldFJlY3RGb3JtUG9pbnRMaXN0IiwicGxpc3QiLCJpdCIsIml0MiIsIml0MyIsImNwWDEiLCJjcFkxIiwiUGF0aCIsImRyYXdUeXBlT25seSIsIl9fcGFyc2VQYXRoRGF0YSIsInBhdGhzIiwicGF0aFN0ciIsIl9wYXJzZUNoaWxkUGF0aERhdGEiLCJjcyIsIlJlZ0V4cCIsImFyciIsImNhIiwiY3B4IiwiY3B5Iiwic3RyIiwiY21kIiwiY3RsUHR4IiwiY3RsUHR5IiwicHJldkNtZCIsInJ4IiwicnkiLCJwc2kiLCJmYSIsImZzIiwiY29tbWFuZCIsIl9jb252ZXJ0UG9pbnQiLCJwc2lEZWciLCJ4cCIsInlwIiwibGFtYmRhIiwiY3hwIiwiY3lwIiwidk1hZyIsInZSYXRpbyIsInUiLCJ2QW5nbGUiLCJhY29zIiwiZFRoZXRhIiwic3RlcHMiLCJwYXJyIiwidHAiLCJCZXppZXIiLCJnZXRQb2ludEJ5VGltZSIsImNwcyIsInBhdGhBcnJheSIsIl9wYXJzZVBhdGhEYXRhIiwiX3NldFBvaW50TGlzdCIsImciLCJnbCIsInF1YWRyYXRpY0N1cnZlVG8iLCJzaW5nbGVQb2ludExpc3QiLCJ0b1VwcGVyQ2FzZSIsIl9nZXRBcmNQb2ludHMiLCJfcG9pbnRzIiwiY1N0YXJ0IiwicHJlUG9pbnRzIiwiX2dldEJlemllclBvaW50cyIsInJlY3QiLCJEcm9wbGV0IiwicHMiLCJyYXRpb1giLCJyYXRpb1kiLCJ1bnNoaWZ0IiwiSXNvZ29uIiwic2V0UG9pbnRMaXN0IiwiZFN0ZXAiLCJiZWdpbkRlZyIsImRlZyIsIkxpbmUiLCJSZWN0IiwiZ2V0Q3NzT3JkZXJBcnIiLCJmaWxsUmVjdCIsInN0cm9rZVJlY3QiLCJfYnVpbGRSYWRpdXNQYXRoIiwiU2VjdG9yIiwiaXNSaW5nIiwiZ2V0UmVnQW5nbGUiLCJwNERpcmVjdGlvbiIsIkNhbnZheCIsIkRpc3BsYXkiLCJTaGFwZXMiLCJFdmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsTUFBSSxFQUFSO0FBQ0EsSUFBSUMsVUFBVSxFQUFkO0FBQ0EsSUFBSUMsYUFBYUMsTUFBTUMsU0FBdkI7SUFBa0NDLFdBQVdDLE9BQU9GLFNBQXBEO0FBQ0EsSUFDQUcsV0FBbUJGLFNBQVNFLFFBRDVCO0lBRUFDLGlCQUFtQkgsU0FBU0csY0FGNUI7O0FBSUEsSUFDQUMsZ0JBQXFCUCxXQUFXUSxPQURoQztJQUVBQyxlQUFxQlQsV0FBV1UsTUFGaEM7SUFHQUMsZ0JBQXFCWCxXQUFXWSxPQUhoQztJQUlBQyxnQkFBcUJaLE1BQU1hLE9BSjNCO0lBS0FDLGFBQXFCWCxPQUFPWSxJQUw1Qjs7QUFPQWxCLElBQUVtQixNQUFGLEdBQVcsVUFBU0MsR0FBVCxFQUFjO01BQ25CRixPQUFPbEIsSUFBRWtCLElBQUYsQ0FBT0UsR0FBUCxDQUFYO01BQ0lDLFNBQVNILEtBQUtHLE1BQWxCO01BQ0lGLFNBQVMsSUFBSWhCLEtBQUosQ0FBVWtCLE1BQVYsQ0FBYjtPQUNLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsTUFBcEIsRUFBNEJDLEdBQTVCLEVBQWlDO1dBQ3hCQSxDQUFQLElBQVlGLElBQUlGLEtBQUtJLENBQUwsQ0FBSixDQUFaOztTQUVLSCxNQUFQO0NBUEY7O0FBVUFuQixJQUFFa0IsSUFBRixHQUFTRCxjQUFjLFVBQVNHLEdBQVQsRUFBYztNQUMvQkEsUUFBUWQsT0FBT2MsR0FBUCxDQUFaLEVBQXlCLE1BQU0sSUFBSUcsU0FBSixDQUFjLGdCQUFkLENBQU47TUFDckJMLE9BQU8sRUFBWDtPQUNLLElBQUlNLEdBQVQsSUFBZ0JKLEdBQWhCLEVBQXFCLElBQUlwQixJQUFFeUIsR0FBRixDQUFNTCxHQUFOLEVBQVdJLEdBQVgsQ0FBSixFQUFxQk4sS0FBS1EsSUFBTCxDQUFVRixHQUFWO1NBQ2pDTixJQUFQO0NBSko7O0FBT0FsQixJQUFFeUIsR0FBRixHQUFRLFVBQVNMLEdBQVQsRUFBY0ksR0FBZCxFQUFtQjtTQUNsQmhCLGVBQWVtQixJQUFmLENBQW9CUCxHQUFwQixFQUF5QkksR0FBekIsQ0FBUDtDQURGOztBQUlBLElBQUlJLE9BQU81QixJQUFFNEIsSUFBRixHQUFTNUIsSUFBRVUsT0FBRixHQUFZLFVBQVNVLEdBQVQsRUFBY1MsUUFBZCxFQUF3QkMsT0FBeEIsRUFBaUM7TUFDM0RWLE9BQU8sSUFBWCxFQUFpQjtNQUNiWCxpQkFBaUJXLElBQUlWLE9BQUosS0FBZ0JELGFBQXJDLEVBQW9EO1FBQzlDQyxPQUFKLENBQVltQixRQUFaLEVBQXNCQyxPQUF0QjtHQURGLE1BRU8sSUFBSVYsSUFBSUMsTUFBSixLQUFlLENBQUNELElBQUlDLE1BQXhCLEVBQWdDO1NBQ2hDLElBQUlDLElBQUksQ0FBUixFQUFXRCxTQUFTRCxJQUFJQyxNQUE3QixFQUFxQ0MsSUFBSUQsTUFBekMsRUFBaURDLEdBQWpELEVBQXNEO1VBQ2hETyxTQUFTRixJQUFULENBQWNHLE9BQWQsRUFBdUJWLElBQUlFLENBQUosQ0FBdkIsRUFBK0JBLENBQS9CLEVBQWtDRixHQUFsQyxNQUEyQ25CLE9BQS9DLEVBQXdEOztHQUZyRCxNQUlBO1FBQ0RpQixPQUFPbEIsSUFBRWtCLElBQUYsQ0FBT0UsR0FBUCxDQUFYO1NBQ0ssSUFBSUUsSUFBSSxDQUFSLEVBQVdELFNBQVNILEtBQUtHLE1BQTlCLEVBQXNDQyxJQUFJRCxNQUExQyxFQUFrREMsR0FBbEQsRUFBdUQ7VUFDakRPLFNBQVNGLElBQVQsQ0FBY0csT0FBZCxFQUF1QlYsSUFBSUYsS0FBS0ksQ0FBTCxDQUFKLENBQXZCLEVBQXFDSixLQUFLSSxDQUFMLENBQXJDLEVBQThDRixHQUE5QyxNQUF1RG5CLE9BQTNELEVBQW9FOzs7Q0FYMUU7O0FBZ0JBRCxJQUFFK0IsT0FBRixHQUFZLFVBQVNDLEtBQVQsRUFBZ0I7U0FDbkJoQyxJQUFFWSxNQUFGLENBQVNvQixLQUFULEVBQWdCaEMsSUFBRWlDLFFBQWxCLENBQVA7Q0FERjs7QUFJQWpDLElBQUVZLE1BQUYsR0FBV1osSUFBRWtDLE1BQUYsR0FBVyxVQUFTZCxHQUFULEVBQWNTLFFBQWQsRUFBd0JDLE9BQXhCLEVBQWlDO01BQ2pESyxVQUFVLEVBQWQ7TUFDSWYsT0FBTyxJQUFYLEVBQWlCLE9BQU9lLE9BQVA7TUFDYnhCLGdCQUFnQlMsSUFBSVIsTUFBSixLQUFlRCxZQUFuQyxFQUFpRCxPQUFPUyxJQUFJUixNQUFKLENBQVdpQixRQUFYLEVBQXFCQyxPQUFyQixDQUFQO09BQzVDVixHQUFMLEVBQVUsVUFBU2dCLEtBQVQsRUFBZ0JDLEtBQWhCLEVBQXVCQyxJQUF2QixFQUE2QjtRQUNqQ1QsU0FBU0YsSUFBVCxDQUFjRyxPQUFkLEVBQXVCTSxLQUF2QixFQUE4QkMsS0FBOUIsRUFBcUNDLElBQXJDLENBQUosRUFBZ0RILFFBQVFULElBQVIsQ0FBYVUsS0FBYjtHQURsRDtTQUdPRCxPQUFQO0NBUEY7O0FBVUFQLEtBQUssQ0FBQyxXQUFELEVBQWMsVUFBZCxFQUEwQixRQUExQixFQUFvQyxRQUFwQyxFQUE4QyxNQUE5QyxFQUFzRCxRQUF0RCxDQUFMLEVBQXNFLFVBQVNXLElBQVQsRUFBZTtNQUNqRixPQUFPQSxJQUFULElBQWlCLFVBQVNuQixHQUFULEVBQWM7V0FDdEJiLFNBQVNvQixJQUFULENBQWNQLEdBQWQsS0FBc0IsYUFBYW1CLElBQWIsR0FBb0IsR0FBakQ7R0FERjtDQURGOztBQU1BLEFBQUksQUFBSixBQUFpQztNQUM3QkMsVUFBRixHQUFlLFVBQVNwQixHQUFULEVBQWM7V0FDcEIsT0FBT0EsR0FBUCxLQUFlLFVBQXRCO0dBREY7OztBQUtGcEIsSUFBRXlDLFFBQUYsR0FBYSxVQUFTckIsR0FBVCxFQUFjO1NBQ2xCcUIsU0FBU3JCLEdBQVQsS0FBaUIsQ0FBQ3NCLE1BQU1DLFdBQVd2QixHQUFYLENBQU4sQ0FBekI7Q0FERjs7QUFJQXBCLElBQUUwQyxLQUFGLEdBQVUsVUFBU3RCLEdBQVQsRUFBYztTQUNmcEIsSUFBRTRDLFFBQUYsQ0FBV3hCLEdBQVgsS0FBbUJBLE9BQU8sQ0FBQ0EsR0FBbEM7Q0FERjs7QUFJQXBCLElBQUU2QyxTQUFGLEdBQWMsVUFBU3pCLEdBQVQsRUFBYztTQUNuQkEsUUFBUSxJQUFSLElBQWdCQSxRQUFRLEtBQXhCLElBQWlDYixTQUFTb0IsSUFBVCxDQUFjUCxHQUFkLEtBQXNCLGtCQUE5RDtDQURGOztBQUlBcEIsSUFBRThDLE1BQUYsR0FBVyxVQUFTMUIsR0FBVCxFQUFjO1NBQ2hCQSxRQUFRLElBQWY7Q0FERjs7QUFJQXBCLElBQUUrQyxPQUFGLEdBQVksVUFBUzNCLEdBQVQsRUFBYztNQUNwQkEsT0FBTyxJQUFYLEVBQWlCLE9BQU8sSUFBUDtNQUNicEIsSUFBRWdCLE9BQUYsQ0FBVUksR0FBVixLQUFrQnBCLElBQUVnRCxRQUFGLENBQVc1QixHQUFYLENBQXRCLEVBQXVDLE9BQU9BLElBQUlDLE1BQUosS0FBZSxDQUF0QjtPQUNsQyxJQUFJRyxHQUFULElBQWdCSixHQUFoQixFQUFxQixJQUFJcEIsSUFBRXlCLEdBQUYsQ0FBTUwsR0FBTixFQUFXSSxHQUFYLENBQUosRUFBcUIsT0FBTyxLQUFQO1NBQ2pDLElBQVA7Q0FKSjs7QUFPQXhCLElBQUVpRCxTQUFGLEdBQWMsVUFBUzdCLEdBQVQsRUFBYztTQUNuQixDQUFDLEVBQUVBLE9BQU9BLElBQUk4QixRQUFKLEtBQWlCLENBQTFCLENBQVI7Q0FERjs7QUFJQWxELElBQUVnQixPQUFGLEdBQVlELGlCQUFpQixVQUFTSyxHQUFULEVBQWM7U0FDbENiLFNBQVNvQixJQUFULENBQWNQLEdBQWQsS0FBc0IsZ0JBQTdCO0NBREY7O0FBSUFwQixJQUFFbUQsUUFBRixHQUFhLFVBQVMvQixHQUFULEVBQWM7U0FDbEJBLFFBQVFkLE9BQU9jLEdBQVAsQ0FBZjtDQURGOztBQUlBcEIsSUFBRWlDLFFBQUYsR0FBYSxVQUFTRyxLQUFULEVBQWdCO1NBQ3BCQSxLQUFQO0NBREY7O0FBSUFwQyxJQUFFYyxPQUFGLEdBQVksVUFBU2tCLEtBQVQsRUFBZ0JvQixJQUFoQixFQUFzQkMsUUFBdEIsRUFBZ0M7TUFDdENyQixTQUFTLElBQWIsRUFBbUIsT0FBTyxDQUFDLENBQVI7TUFDZlYsSUFBSSxDQUFSO01BQVdELFNBQVNXLE1BQU1YLE1BQTFCO01BQ0lnQyxRQUFKLEVBQWM7UUFDUixPQUFPQSxRQUFQLElBQW1CLFFBQXZCLEVBQWlDO1VBQzFCQSxXQUFXLENBQVgsR0FBZUMsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWWxDLFNBQVNnQyxRQUFyQixDQUFmLEdBQWdEQSxRQUFyRDtLQURGLE1BRU87VUFDRHJELElBQUV3RCxXQUFGLENBQWN4QixLQUFkLEVBQXFCb0IsSUFBckIsQ0FBSjthQUNPcEIsTUFBTVYsQ0FBTixNQUFhOEIsSUFBYixHQUFvQjlCLENBQXBCLEdBQXdCLENBQUMsQ0FBaEM7OztNQUdBVCxpQkFBaUJtQixNQUFNbEIsT0FBTixLQUFrQkQsYUFBdkMsRUFBc0QsT0FBT21CLE1BQU1sQixPQUFOLENBQWNzQyxJQUFkLEVBQW9CQyxRQUFwQixDQUFQO1NBQy9DL0IsSUFBSUQsTUFBWCxFQUFtQkMsR0FBbkIsRUFBd0IsSUFBSVUsTUFBTVYsQ0FBTixNQUFhOEIsSUFBakIsRUFBdUIsT0FBTzlCLENBQVA7U0FDdEMsQ0FBQyxDQUFSO0NBYko7O0FBZ0JBdEIsSUFBRXlELFFBQUYsR0FBYSxVQUFVckMsR0FBVixFQUFnQjtTQUNuQkEsT0FBTyxJQUFQLElBQWVBLE9BQU9BLElBQUlzQyxNQUFqQztDQURIO0FBR0ExRCxJQUFFMkQsYUFBRixHQUFrQixVQUFVdkMsR0FBVixFQUFnQjs7O01BR3pCLENBQUNBLEdBQUQsSUFBUSxPQUFPQSxHQUFQLEtBQWUsUUFBdkIsSUFBbUNBLElBQUk4QixRQUF2QyxJQUFtRGxELElBQUV5RCxRQUFGLENBQVlyQyxHQUFaLENBQXhELEVBQTRFO1dBQ2pFLEtBQVA7O01BRUE7O1FBRUtBLElBQUl3QyxXQUFKLElBQ0QsQ0FBQ0MsT0FBT2xDLElBQVAsQ0FBWVAsR0FBWixFQUFpQixhQUFqQixDQURBLElBRUQsQ0FBQ3lDLE9BQU9sQyxJQUFQLENBQVlQLElBQUl3QyxXQUFKLENBQWdCeEQsU0FBNUIsRUFBdUMsZUFBdkMsQ0FGTCxFQUUrRDthQUNwRCxLQUFQOztHQUxSLENBT0UsT0FBUTBELENBQVIsRUFBWTs7V0FFSCxLQUFQOzs7O01BSUF0QyxHQUFKO09BQ01BLEdBQU4sSUFBYUosR0FBYixFQUFtQjs7U0FFWkksUUFBUXVDLFNBQVIsSUFBcUJGLE9BQU9sQyxJQUFQLENBQWFQLEdBQWIsRUFBa0JJLEdBQWxCLENBQTVCO0NBdEJKOzs7Ozs7QUE2QkF4QixJQUFFZ0UsTUFBRixHQUFXLFlBQVc7TUFDaEJDLE9BQUo7TUFBYTFCLElBQWI7TUFBbUIyQixHQUFuQjtNQUF3QkMsSUFBeEI7TUFBOEJDLFdBQTlCO01BQTJDQyxLQUEzQztNQUNJQyxTQUFTQyxVQUFVLENBQVYsS0FBZ0IsRUFEN0I7TUFFSWpELElBQUksQ0FGUjtNQUdJRCxTQUFTa0QsVUFBVWxELE1BSHZCO01BSUltRCxPQUFPLEtBSlg7TUFLSyxPQUFPRixNQUFQLEtBQWtCLFNBQXZCLEVBQW1DO1dBQ3hCQSxNQUFQO2FBQ1NDLFVBQVUsQ0FBVixLQUFnQixFQUF6QjtRQUNJLENBQUo7O01BRUMsT0FBT0QsTUFBUCxLQUFrQixRQUFsQixJQUE4QixDQUFDdEUsSUFBRXdDLFVBQUYsQ0FBYThCLE1BQWIsQ0FBcEMsRUFBMkQ7YUFDOUMsRUFBVDs7TUFFQ2pELFdBQVdDLENBQWhCLEVBQW9CO2FBQ1AsSUFBVDtNQUNFQSxDQUFGOztTQUVJQSxJQUFJRCxNQUFaLEVBQW9CQyxHQUFwQixFQUEwQjtRQUNqQixDQUFDMkMsVUFBVU0sVUFBV2pELENBQVgsQ0FBWCxLQUE4QixJQUFuQyxFQUEwQztXQUNoQ2lCLElBQU4sSUFBYzBCLE9BQWQsRUFBd0I7Y0FDZEssT0FBUS9CLElBQVIsQ0FBTjtlQUNPMEIsUUFBUzFCLElBQVQsQ0FBUDtZQUNLK0IsV0FBV0gsSUFBaEIsRUFBdUI7OztZQUdsQkssUUFBUUwsSUFBUixLQUFrQm5FLElBQUUyRCxhQUFGLENBQWdCUSxJQUFoQixNQUEwQkMsY0FBY3BFLElBQUVnQixPQUFGLENBQVVtRCxJQUFWLENBQXhDLENBQWxCLENBQUwsRUFBb0Y7Y0FDM0VDLFdBQUwsRUFBbUI7MEJBQ0QsS0FBZDtvQkFDUUYsT0FBT2xFLElBQUVnQixPQUFGLENBQVVrRCxHQUFWLENBQVAsR0FBd0JBLEdBQXhCLEdBQThCLEVBQXRDO1dBRkosTUFHTztvQkFDS0EsT0FBT2xFLElBQUUyRCxhQUFGLENBQWdCTyxHQUFoQixDQUFQLEdBQThCQSxHQUE5QixHQUFvQyxFQUE1Qzs7aUJBRUkzQixJQUFSLElBQWlCdkMsSUFBRWdFLE1BQUYsQ0FBVVEsSUFBVixFQUFnQkgsS0FBaEIsRUFBdUJGLElBQXZCLENBQWpCO1NBUEosTUFRTyxJQUFLQSxTQUFTSixTQUFkLEVBQTBCO2lCQUNyQnhCLElBQVIsSUFBaUI0QixJQUFqQjs7Ozs7U0FLVEcsTUFBUDtDQXhDRjtBQTBDQXRFLElBQUVxRSxLQUFGLEdBQVUsVUFBU2pELEdBQVQsRUFBYztNQUNsQixDQUFDcEIsSUFBRW1ELFFBQUYsQ0FBVy9CLEdBQVgsQ0FBTCxFQUFzQixPQUFPQSxHQUFQO1NBQ2ZwQixJQUFFZ0IsT0FBRixDQUFVSSxHQUFWLElBQWlCQSxJQUFJcUQsS0FBSixFQUFqQixHQUErQnpFLElBQUVnRSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUI1QyxHQUFuQixDQUF0QztDQUZGLENBSUE7O0FDbE5BOzs7OztBQUtBLEFBRUEsSUFBSXNELFFBQVE7bUJBQ1UsRUFEVjtTQUVGLENBRkU7O2VBSU0sSUFKTjtpQkFLTSxZQUFVLEVBTGhCOzt1QkFPWWhCLE9BQU9pQixnQkFBUCxJQUEyQixDQVB2QztVQVFBLENBUkE7WUFTRCxZQUFVO2VBQ04sS0FBS0MsSUFBTCxFQUFQO0tBVkk7Y0FZRyxVQUFTckMsSUFBVCxFQUFlOztZQUVsQnNDLFdBQVd0QyxLQUFLdUMsVUFBTCxDQUFnQnZDLEtBQUtsQixNQUFMLEdBQWMsQ0FBOUIsQ0FBZjtZQUNJd0QsWUFBWSxFQUFaLElBQWtCQSxZQUFZLEVBQWxDLEVBQXNDdEMsUUFBUSxHQUFSO2VBQy9CQSxPQUFPbUMsTUFBTUssTUFBTixFQUFkO0tBaEJJO21CQWtCUSxZQUFXO2VBQ2hCLENBQUMsQ0FBQ0MsU0FBU0MsYUFBVCxDQUF1QixRQUF2QixFQUFpQ0MsVUFBMUM7S0FuQkk7a0JBcUJPLFVBQVVDLEtBQVYsRUFBa0J2QixXQUFsQixFQUFnQztZQUN2Q3dCLFFBQUo7WUFDSUMsZUFBZS9FLE9BQU9nRixNQUExQjtZQUNJRCxZQUFKLEVBQWtCO3VCQUNIQSxhQUFhRixLQUFiLENBQVg7U0FESixNQUVPO2tCQUNHSSxXQUFOLENBQWtCbkYsU0FBbEIsR0FBOEIrRSxLQUE5Qjt1QkFDVyxJQUFJVCxNQUFNYSxXQUFWLEVBQVg7O2lCQUVLM0IsV0FBVCxHQUF1QkEsV0FBdkI7ZUFDT3dCLFFBQVA7S0EvQkk7Z0JBaUNLLFVBQVNJLENBQVQsRUFBWUMsQ0FBWixFQUFlQyxFQUFmLEVBQWtCO1lBQ3ZCLENBQUNELENBQUQsSUFBTSxDQUFDRCxDQUFYLEVBQWM7bUJBQ0hBLENBQVA7O1lBRUFHLEtBQUtGLEVBQUVyRixTQUFYO1lBQXNCd0YsRUFBdEI7O2FBRUtsQixNQUFNbUIsWUFBTixDQUFtQkYsRUFBbkIsRUFBdUJILENBQXZCLENBQUw7VUFDRXBGLFNBQUYsR0FBY0osSUFBRWdFLE1BQUYsQ0FBUzRCLEVBQVQsRUFBYUosRUFBRXBGLFNBQWYsQ0FBZDtVQUNFMEYsVUFBRixHQUFlcEIsTUFBTW1CLFlBQU4sQ0FBbUJGLEVBQW5CLEVBQXVCRixDQUF2QixDQUFmOztZQUVJQyxFQUFKLEVBQVE7Z0JBQ0YxQixNQUFGLENBQVM0QixFQUFULEVBQWFGLEVBQWI7O2VBRUdGLENBQVA7S0E5Q0k7aUJBZ0RNLFVBQVVPLE1BQVYsRUFBa0I7WUFDeEJyQyxPQUFPc0MsV0FBUCxJQUFzQkEsWUFBWUMsV0FBdEMsRUFBa0Q7d0JBQ2xDQSxXQUFaLENBQXlCRixNQUF6Qjs7S0FsREE7O2NBc0RNLFVBQVNHLEdBQVQsRUFBYTtZQUNuQixDQUFDQSxHQUFMLEVBQVU7bUJBQ0Q7eUJBQ0s7YUFEWjtTQURGLE1BTU8sSUFBSUEsT0FBTyxDQUFDQSxJQUFJcEUsT0FBaEIsRUFBMEI7Z0JBQzNCQSxPQUFKLEdBQWMsRUFBZDttQkFDT29FLEdBQVA7U0FGSyxNQUdBO21CQUNFQSxHQUFQOztLQWpFRTs7Ozs7a0JBd0VPLFVBQVM1QixNQUFULEVBQWlCNkIsTUFBakIsRUFBeUJDLE1BQXpCLEVBQWdDO1lBQ3RDcEcsSUFBRStDLE9BQUYsQ0FBVW9ELE1BQVYsQ0FBTCxFQUF3QjttQkFDYjdCLE1BQVA7O2FBRUEsSUFBSTlDLEdBQVIsSUFBZTJFLE1BQWYsRUFBc0I7Z0JBQ2YsQ0FBQ0MsTUFBRCxJQUFXOUIsT0FBTzlELGNBQVAsQ0FBc0JnQixHQUF0QixDQUFYLElBQXlDOEMsT0FBTzlDLEdBQVAsTUFBZ0J1QyxTQUE1RCxFQUFzRTt1QkFDM0R2QyxHQUFQLElBQWMyRSxPQUFPM0UsR0FBUCxDQUFkOzs7ZUFHRDhDLE1BQVA7S0FqRkk7Ozs7O29CQXdGUyxVQUFVa0IsQ0FBVixFQUFhO1lBQ3RCYSxFQUFKO1lBQ0lDLEVBQUo7WUFDSUMsRUFBSjtZQUNJQyxFQUFKOztZQUVHLE9BQU9oQixDQUFQLEtBQWEsUUFBaEIsRUFBMEI7aUJBQ2pCYyxLQUFLQyxLQUFLQyxLQUFLaEIsQ0FBcEI7U0FESixNQUdLLElBQUdBLGFBQWFyRixLQUFoQixFQUF1QjtnQkFDcEJxRixFQUFFbkUsTUFBRixLQUFhLENBQWpCLEVBQW9CO3FCQUNYaUYsS0FBS0MsS0FBS0MsS0FBS2hCLEVBQUUsQ0FBRixDQUFwQjthQURKLE1BR0ssSUFBR0EsRUFBRW5FLE1BQUYsS0FBYSxDQUFoQixFQUFtQjtxQkFDZmtGLEtBQUtmLEVBQUUsQ0FBRixDQUFWO3FCQUNLZ0IsS0FBS2hCLEVBQUUsQ0FBRixDQUFWO2FBRkMsTUFJQSxJQUFHQSxFQUFFbkUsTUFBRixLQUFhLENBQWhCLEVBQW1CO3FCQUNmbUUsRUFBRSxDQUFGLENBQUw7cUJBQ0tnQixLQUFLaEIsRUFBRSxDQUFGLENBQVY7cUJBQ0tBLEVBQUUsQ0FBRixDQUFMO2FBSEMsTUFJRTtxQkFDRUEsRUFBRSxDQUFGLENBQUw7cUJBQ0tBLEVBQUUsQ0FBRixDQUFMO3FCQUNLQSxFQUFFLENBQUYsQ0FBTDtxQkFDS0EsRUFBRSxDQUFGLENBQUw7O1NBaEJILE1Ba0JFO2lCQUNFYyxLQUFLQyxLQUFLQyxLQUFLLENBQXBCOztlQUVHLENBQUNILEVBQUQsRUFBSUMsRUFBSixFQUFPQyxFQUFQLEVBQVVDLEVBQVYsQ0FBUDs7Q0F0SFIsQ0EwSEE7O0FDaklBOzs7OztBQUtBLEFBQWUsTUFBTUMsS0FBTixDQUNmO2dCQUNpQkMsSUFBRSxDQUFmLEVBQW1CQyxJQUFFLENBQXJCLEVBQ0E7WUFDUXBDLFVBQVVsRCxNQUFWLElBQWtCLENBQWxCLElBQXVCLE9BQU9rRCxVQUFVLENBQVYsQ0FBUCxJQUF1QixRQUFsRCxFQUE0RDtnQkFDcERxQyxNQUFJckMsVUFBVSxDQUFWLENBQVI7Z0JBQ0ksT0FBT3FDLEdBQVAsSUFBYyxPQUFPQSxHQUF6QixFQUE4QjtxQkFDckJGLENBQUwsR0FBU0UsSUFBSUYsQ0FBSixHQUFNLENBQWY7cUJBQ0tDLENBQUwsR0FBU0MsSUFBSUQsQ0FBSixHQUFNLENBQWY7YUFGSixNQUdPO29CQUNDckYsSUFBRSxDQUFOO3FCQUNLLElBQUl1RixDQUFULElBQWNELEdBQWQsRUFBa0I7d0JBQ1h0RixLQUFHLENBQU4sRUFBUTs2QkFDQ29GLENBQUwsR0FBU0UsSUFBSUMsQ0FBSixJQUFPLENBQWhCO3FCQURKLE1BRU87NkJBQ0VGLENBQUwsR0FBU0MsSUFBSUMsQ0FBSixJQUFPLENBQWhCOzs7Ozs7U0FYaEIsTUFpQk87aUJBQ0VILENBQUwsR0FBU0EsSUFBRSxDQUFYO2lCQUNLQyxDQUFMLEdBQVNBLElBQUUsQ0FBWDs7OztjQUtSO2VBQ1csQ0FBQyxLQUFLRCxDQUFOLEVBQVUsS0FBS0MsQ0FBZixDQUFQOztDQUVQOztBQ3BDRDs7Ozs7OztBQU9BLEFBQ0EsQUFFQSxJQUFJRyxjQUFjLFVBQVVDLEdBQVYsRUFBZ0JDLE1BQWhCLEVBQXlCOztRQUV0Q0MsWUFBWSxhQUFoQjtRQUNPakgsSUFBRWdELFFBQUYsQ0FBWStELEdBQVosQ0FBSixFQUF1QjtvQkFDVkEsR0FBWjs7UUFFRy9HLElBQUVtRCxRQUFGLENBQVk0RCxHQUFaLEtBQXFCQSxJQUFJRyxJQUE3QixFQUFtQztvQkFDdEJILElBQUlHLElBQWhCOzs7U0FHSTVDLE1BQUwsR0FBYyxJQUFkO1NBQ0s2QyxhQUFMLEdBQXFCLElBQXJCO1NBQ0tELElBQUwsR0FBY0QsU0FBZDtTQUNLRyxLQUFMLEdBQWMsSUFBZDs7U0FFS0MsZ0JBQUwsR0FBd0IsS0FBeEIsQ0FmdUM7Q0FBM0M7QUFpQkFQLFlBQVkxRyxTQUFaLEdBQXdCO3FCQUNGLFlBQVc7YUFDcEJpSCxnQkFBTCxHQUF3QixJQUF4Qjs7Q0FGUixDQUtBOztBQ2hDQSxlQUFlOztnQkFFQzNELE9BQU9pQixnQkFBUCxJQUEyQixDQUY1Qjs7O1NBS047Q0FMVDs7QUNHQSxJQUFJMkMsc0JBQXNCLFVBQVVDLE9BQVYsRUFBb0JDLE1BQXBCLEVBQTRCO1FBQzlDeEMsU0FBVXVDLE9BQVYsQ0FBSixFQUF5QjtpQkFDWkUsVUFBVCxDQUFxQkMsRUFBckIsRUFBMEJSLElBQTFCLEVBQWlDUyxFQUFqQyxFQUFxQztnQkFDN0JELEdBQUdyRyxNQUFQLEVBQWU7cUJBQ1AsSUFBSUMsSUFBRSxDQUFWLEVBQWNBLElBQUlvRyxHQUFHckcsTUFBckIsRUFBOEJDLEdBQTlCLEVBQWtDOytCQUNsQm9HLEdBQUdwRyxDQUFILENBQVosRUFBb0I0RixJQUFwQixFQUEyQlMsRUFBM0I7O2FBRlIsTUFJTzttQkFDQ0osT0FBSixFQUFlTCxJQUFmLEVBQXNCUyxFQUF0QixFQUEyQixLQUEzQjs7O2VBR0RGLFVBQVA7S0FWSixNQVdPO2lCQUNNRyxPQUFULENBQWtCRixFQUFsQixFQUF1QlIsSUFBdkIsRUFBOEJTLEVBQTlCLEVBQWtDO2dCQUMxQkQsR0FBR3JHLE1BQVAsRUFBZTtxQkFDUCxJQUFJQyxJQUFFLENBQVYsRUFBY0EsSUFBSW9HLEdBQUdyRyxNQUFyQixFQUE4QkMsR0FBOUIsRUFBa0M7NEJBQ3JCb0csR0FBR3BHLENBQUgsQ0FBVCxFQUFlNEYsSUFBZixFQUFvQlMsRUFBcEI7O2FBRlIsTUFJTzttQkFDQ0gsTUFBSixFQUFjLE9BQUtOLElBQW5CLEVBQTBCLFlBQVU7MkJBQ3pCUyxHQUFHaEcsSUFBSCxDQUFTK0YsRUFBVCxFQUFjaEUsT0FBT21FLEtBQXJCLENBQVA7aUJBREo7OztlQUtERCxPQUFQOztDQXhCUjs7QUE0QkEsUUFBZTs7V0FFSCxVQUFTRixFQUFULEVBQVk7WUFDYjFILElBQUVnRCxRQUFGLENBQVcwRSxFQUFYLENBQUgsRUFBa0I7bUJBQ1IxQyxTQUFTOEMsY0FBVCxDQUF3QkosRUFBeEIsQ0FBUDs7WUFFQUEsR0FBR3hFLFFBQUgsSUFBZSxDQUFsQixFQUFvQjs7bUJBRVZ3RSxFQUFQOztZQUVBQSxHQUFHckcsTUFBTixFQUFhO21CQUNIcUcsR0FBRyxDQUFILENBQVA7O2VBRUksSUFBUDtLQWJPO1lBZUYsVUFBU0EsRUFBVCxFQUFZO1lBQ2JLLE1BQU1MLEdBQUdNLHFCQUFILEVBQVY7WUFDQUMsTUFBTVAsR0FBR1EsYUFEVDtZQUVBQyxPQUFPRixJQUFJRSxJQUZYO1lBR0FDLFVBQVVILElBQUlJLGVBSGQ7Ozs7b0JBTVlELFFBQVFFLFNBQVIsSUFBcUJILEtBQUtHLFNBQTFCLElBQXVDLENBTm5EO1lBT0FDLGFBQWFILFFBQVFHLFVBQVIsSUFBc0JKLEtBQUtJLFVBQTNCLElBQXlDLENBUHREOzs7OztlQVdPLENBWFA7WUFZSUosS0FBS0gscUJBQVQsRUFBZ0M7Z0JBQ3hCUSxRQUFRTCxLQUFLSCxxQkFBTCxFQUFaO21CQUNPLENBQUNRLE1BQU1DLEtBQU4sR0FBY0QsTUFBTUUsSUFBckIsSUFBMkJQLEtBQUtRLFdBQXZDOztZQUVBQyxPQUFPLENBQVgsRUFBYTt3QkFDRyxDQUFaO3lCQUNhLENBQWI7O1lBRUFDLE1BQU1kLElBQUljLEdBQUosR0FBUUQsSUFBUixJQUFnQmxGLE9BQU9vRixXQUFQLElBQXNCVixXQUFXQSxRQUFRVyxTQUFSLEdBQWtCSCxJQUFuRCxJQUEyRFQsS0FBS1ksU0FBTCxHQUFlSCxJQUExRixJQUFrR04sU0FBNUc7WUFDSUksT0FBT1gsSUFBSVcsSUFBSixHQUFTRSxJQUFULElBQWlCbEYsT0FBT3NGLFdBQVAsSUFBcUJaLFdBQVdBLFFBQVFhLFVBQVIsR0FBbUJMLElBQW5ELElBQTJEVCxLQUFLYyxVQUFMLEdBQWdCTCxJQUE1RixJQUFvR0wsVUFEL0c7O2VBR087aUJBQ0VNLEdBREY7a0JBRUdIO1NBRlY7S0F2Q087Y0E0Q0FwQixvQkFBcUIsa0JBQXJCLEVBQTBDLGFBQTFDLENBNUNBO2lCQTZDR0Esb0JBQXFCLHFCQUFyQixFQUE2QyxhQUE3QyxDQTdDSDtXQThDSixVQUFTeEQsQ0FBVCxFQUFZO1lBQ1hBLEVBQUVvRixLQUFOLEVBQWEsT0FBT3BGLEVBQUVvRixLQUFULENBQWIsS0FDSyxJQUFJcEYsRUFBRXFGLE9BQU4sRUFDRCxPQUFPckYsRUFBRXFGLE9BQUYsSUFBYW5FLFNBQVNxRCxlQUFULENBQXlCWSxVQUF6QixHQUNaakUsU0FBU3FELGVBQVQsQ0FBeUJZLFVBRGIsR0FDMEJqRSxTQUFTbUQsSUFBVCxDQUFjYyxVQURyRCxDQUFQLENBREMsS0FHQSxPQUFPLElBQVA7S0FuREU7V0FxREosVUFBU25GLENBQVQsRUFBWTtZQUNYQSxFQUFFc0YsS0FBTixFQUFhLE9BQU90RixFQUFFc0YsS0FBVCxDQUFiLEtBQ0ssSUFBSXRGLEVBQUV1RixPQUFOLEVBQ0QsT0FBT3ZGLEVBQUV1RixPQUFGLElBQWFyRSxTQUFTcUQsZUFBVCxDQUF5QlUsU0FBekIsR0FDWi9ELFNBQVNxRCxlQUFULENBQXlCVSxTQURiLEdBQ3lCL0QsU0FBU21ELElBQVQsQ0FBY1ksU0FEcEQsQ0FBUCxDQURDLEtBR0EsT0FBTyxJQUFQO0tBMURFOzs7Ozs7a0JBaUVJLFVBQVVPLE1BQVYsRUFBbUJDLE9BQW5CLEVBQTZCQyxFQUE3QixFQUFpQztZQUN4Q3pELFNBQVNmLFNBQVNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBYjtlQUNPd0UsS0FBUCxDQUFhQyxRQUFiLEdBQXdCLFVBQXhCO2VBQ09ELEtBQVAsQ0FBYUUsS0FBYixHQUFzQkwsU0FBUyxJQUEvQjtlQUNPRyxLQUFQLENBQWFHLE1BQWIsR0FBc0JMLFVBQVUsSUFBaEM7ZUFDT0UsS0FBUCxDQUFhZixJQUFiLEdBQXNCLENBQXRCO2VBQ09lLEtBQVAsQ0FBYVosR0FBYixHQUFzQixDQUF0QjtlQUNPZ0IsWUFBUCxDQUFvQixPQUFwQixFQUE2QlAsU0FBU1EsU0FBU0MsVUFBL0M7ZUFDT0YsWUFBUCxDQUFvQixRQUFwQixFQUE4Qk4sVUFBVU8sU0FBU0MsVUFBakQ7ZUFDT0YsWUFBUCxDQUFvQixJQUFwQixFQUEwQkwsRUFBMUI7ZUFDT3pELE1BQVA7S0EzRU87Z0JBNkVDLFVBQVN1RCxNQUFULEVBQWtCQyxPQUFsQixFQUEyQkMsRUFBM0IsRUFBOEI7WUFDbENRLE9BQU9oRixTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQVg7YUFDS2dGLFNBQUwsR0FBaUIsYUFBakI7YUFDS1IsS0FBTCxDQUFXUyxPQUFYLElBQXNCLDZCQUE2QlosTUFBN0IsR0FBc0MsWUFBdEMsR0FBcURDLE9BQXJELEdBQThELEtBQXBGOztZQUVJWSxVQUFVbkYsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFkO2FBQ0t3RSxLQUFMLENBQVdTLE9BQVgsSUFBc0IsNkJBQTZCWixNQUE3QixHQUFzQyxZQUF0QyxHQUFxREMsT0FBckQsR0FBOEQsS0FBcEY7OztZQUdJYSxRQUFRcEYsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFaO2FBQ0t3RSxLQUFMLENBQVdTLE9BQVgsSUFBc0IsNkJBQTZCWixNQUE3QixHQUFzQyxZQUF0QyxHQUFxREMsT0FBckQsR0FBOEQsS0FBcEY7O2FBRUtjLFdBQUwsQ0FBaUJGLE9BQWpCO2FBQ0tFLFdBQUwsQ0FBaUJELEtBQWpCOztlQUVPO2tCQUNJSixJQURKO3FCQUVNRyxPQUZOO21CQUdJQztTQUhYOzs7Q0E1RlI7O0FDL0JBOzs7Ozs7QUFNQSxBQUNBLEFBQ0EsQUFDQSxBQUVBLElBQUlFLG1CQUFtQixDQUFDLE9BQUQsRUFBUyxVQUFULEVBQW9CLFdBQXBCLEVBQWdDLFdBQWhDLEVBQTRDLFNBQTVDLEVBQXNELFVBQXRELENBQXZCO0FBQ0EsSUFBSUMsb0JBQW9CLENBQ3BCLEtBRG9CLEVBQ2QsVUFEYyxFQUNILFNBREcsRUFDTyxRQURQLEVBQ2dCLFdBRGhCLEVBQzRCLFNBRDVCLEVBQ3NDLFVBRHRDLEVBQ2lELE9BRGpELEVBQ3lELFNBRHpELEVBRXBCLE9BRm9CLEVBRVYsU0FGVSxFQUdwQixPQUhvQixFQUdWLFdBSFUsRUFHSSxZQUhKLEVBR21CLFNBSG5CLEVBRytCLFdBSC9CLEVBSXBCLEtBSm9CLENBQXhCOztBQU9BLElBQUlDLGVBQWUsVUFBU0MsTUFBVCxFQUFrQnZFLEdBQWxCLEVBQXVCO1NBQ2pDdUUsTUFBTCxHQUFjQSxNQUFkOztTQUVLQyxTQUFMLEdBQWlCLENBQUMsSUFBSWpFLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUFELENBQWpCLENBSHNDOztTQUtqQ2tFLGVBQUwsR0FBdUIsRUFBdkI7O1NBRUtDLFNBQUwsR0FBaUIsS0FBakI7O1NBRUtDLFFBQUwsR0FBZ0IsS0FBaEI7OztTQUdLQyxPQUFMLEdBQWUsU0FBZjs7U0FFS3hHLE1BQUwsR0FBYyxLQUFLbUcsTUFBTCxDQUFZVCxJQUExQjtTQUNLZSxLQUFMLEdBQWEsRUFBYjs7OztTQUlLQyxJQUFMLEdBQVk7ZUFDQSxVQURBO2NBRUQsU0FGQzthQUdGO0tBSFY7O1FBTUVoSCxNQUFGLENBQVUsSUFBVixFQUFpQixJQUFqQixFQUF3QmtDLEdBQXhCO0NBekJKOzs7QUE4QkEsSUFBSStFLFdBQVdqRyxTQUFTa0csdUJBQVQsR0FBbUMsVUFBVUMsTUFBVixFQUFrQkMsS0FBbEIsRUFBeUI7UUFDbkUsQ0FBQ0EsS0FBTCxFQUFZO2VBQ0QsS0FBUDs7V0FFRyxDQUFDLEVBQUVELE9BQU9ELHVCQUFQLENBQStCRSxLQUEvQixJQUF3QyxFQUExQyxDQUFSO0NBSlcsR0FLWCxVQUFVRCxNQUFWLEVBQWtCQyxLQUFsQixFQUF5QjtRQUNyQixDQUFDQSxLQUFMLEVBQVk7ZUFDRCxLQUFQOztXQUVHQSxVQUFVQSxLQUFWLEtBQW9CRCxPQUFPRixRQUFQLEdBQWtCRSxPQUFPRixRQUFQLENBQWdCRyxLQUFoQixDQUFsQixHQUEyQyxJQUEvRCxDQUFQO0NBVEo7O0FBWUFaLGFBQWFwSyxTQUFiLEdBQXlCO1VBQ2QsWUFBVTs7O1lBR1RpTCxLQUFPLElBQVg7WUFDSUEsR0FBRy9HLE1BQUgsQ0FBVXBCLFFBQVYsSUFBc0JhLFNBQTFCLEVBQXFDOzs7Z0JBRzdCLENBQUNzSCxHQUFHTixLQUFKLElBQWFNLEdBQUdOLEtBQUgsQ0FBUzFKLE1BQVQsSUFBbUIsQ0FBcEMsRUFBd0M7bUJBQ2pDMEosS0FBSCxHQUFXUixpQkFBWDs7U0FKUixNQU1PLElBQUljLEdBQUcvRyxNQUFILENBQVVwQixRQUFWLElBQXNCLENBQTFCLEVBQTZCO2VBQzdCNkgsS0FBSCxHQUFXVCxnQkFBWDs7O1lBR0YxSSxJQUFGLENBQVF5SixHQUFHTixLQUFYLEVBQW1CLFVBQVU3RCxJQUFWLEVBQWdCOzs7Z0JBRzNCbUUsR0FBRy9HLE1BQUgsQ0FBVXBCLFFBQVYsSUFBc0IsQ0FBMUIsRUFBNkI7a0JBQ3ZCb0ksUUFBRixDQUFZRCxHQUFHL0csTUFBZixFQUF3QjRDLElBQXhCLEVBQStCLFVBQVVwRCxDQUFWLEVBQWE7dUJBQ3JDeUgsY0FBSCxDQUFtQnpILENBQW5CO2lCQURKO2FBREosTUFJTzttQkFDQVEsTUFBSCxDQUFVa0gsRUFBVixDQUFjdEUsSUFBZCxFQUFxQixVQUFVcEQsQ0FBVixFQUFhO3VCQUMzQjJILFlBQUgsQ0FBaUIzSCxDQUFqQjtpQkFESjs7U0FSUjtLQWZpQjs7Ozs7b0JBaUNKLFVBQVNBLENBQVQsRUFBWTtZQUNyQnVILEtBQUssSUFBVDtZQUNJSyxPQUFPTCxHQUFHWixNQUFkOzthQUVLa0IsZ0JBQUw7O1dBRUdqQixTQUFILEdBQWUsQ0FBRSxJQUFJakUsS0FBSixDQUNibUYsRUFBRTFDLEtBQUYsQ0FBU3BGLENBQVQsSUFBZTRILEtBQUtHLFVBQUwsQ0FBZ0JuRCxJQURsQixFQUVia0QsRUFBRXhDLEtBQUYsQ0FBU3RGLENBQVQsSUFBZTRILEtBQUtHLFVBQUwsQ0FBZ0JoRCxHQUZsQixDQUFGLENBQWY7Ozs7OztZQVNJaUQsZ0JBQWlCVCxHQUFHWCxTQUFILENBQWEsQ0FBYixDQUFyQjtZQUNJcUIsaUJBQWlCVixHQUFHVixlQUFILENBQW1CLENBQW5CLENBQXJCOzs7OztZQUtJN0csRUFBRW9ELElBQUYsSUFBVSxXQUFkLEVBQTJCOztnQkFFcEIsQ0FBQzZFLGNBQUwsRUFBcUI7b0JBQ2YzSyxNQUFNc0ssS0FBS00sb0JBQUwsQ0FBMkJGLGFBQTNCLEVBQTJDLENBQTNDLEVBQThDLENBQTlDLENBQVY7b0JBQ0cxSyxHQUFILEVBQU87dUJBQ0Z1SixlQUFILEdBQXFCLENBQUV2SixHQUFGLENBQXJCOzs7NkJBR2FpSyxHQUFHVixlQUFILENBQW1CLENBQW5CLENBQWpCO2dCQUNLb0Isa0JBQWtCQSxlQUFlRSxXQUF0QyxFQUFtRDs7bUJBRTVDckIsU0FBSCxHQUFlLElBQWY7Ozs7WUFJSDlHLEVBQUVvRCxJQUFGLElBQVUsU0FBVixJQUF3QnBELEVBQUVvRCxJQUFGLElBQVUsVUFBVixJQUF3QixDQUFDK0QsU0FBU1MsS0FBSzFCLElBQWQsRUFBc0JsRyxFQUFFb0ksU0FBRixJQUFlcEksRUFBRXFJLGFBQXZDLENBQXJELEVBQStHO2dCQUN4R2QsR0FBR1IsUUFBSCxJQUFlLElBQWxCLEVBQXVCOzttQkFFaEJ1QixRQUFILENBQWF0SSxDQUFiLEVBQWlCaUksY0FBakIsRUFBa0MsQ0FBbEM7K0JBQ2VNLElBQWYsQ0FBb0IsU0FBcEI7O2VBRUR4QixRQUFILEdBQWUsS0FBZjtlQUNHRCxTQUFILEdBQWUsS0FBZjs7O1lBR0E5RyxFQUFFb0QsSUFBRixJQUFVLFVBQWQsRUFBMEI7Z0JBQ2xCLENBQUMrRCxTQUFTUyxLQUFLMUIsSUFBZCxFQUFzQmxHLEVBQUVvSSxTQUFGLElBQWVwSSxFQUFFcUksYUFBdkMsQ0FBTCxFQUE4RDttQkFDdkRHLG9CQUFILENBQXdCeEksQ0FBeEIsRUFBNEJnSSxhQUE1Qjs7U0FGUixNQUlPLElBQUloSSxFQUFFb0QsSUFBRixJQUFVLFdBQWQsRUFBMkI7OztnQkFFM0JtRSxHQUFHVCxTQUFILElBQWdCOUcsRUFBRW9ELElBQUYsSUFBVSxXQUExQixJQUF5QzZFLGNBQTVDLEVBQTJEOztvQkFFcEQsQ0FBQ1YsR0FBR1IsUUFBUCxFQUFnQjs7bUNBRUd3QixJQUFmLENBQW9CLFdBQXBCOzttQ0FFZXZLLE9BQWYsQ0FBdUJ5SyxXQUF2QixHQUFxQyxDQUFyQzs7O3dCQUdJQyxjQUFjbkIsR0FBR29CLGlCQUFILENBQXNCVixjQUF0QixFQUF1QyxDQUF2QyxDQUFsQjtnQ0FDWWpLLE9BQVosQ0FBb0J5SyxXQUFwQixHQUFrQ1IsZUFBZVcsWUFBakQ7aUJBUkosTUFTTzs7dUJBRUFDLGVBQUgsQ0FBb0I3SSxDQUFwQixFQUF3QmlJLGNBQXhCLEVBQXlDLENBQXpDOzttQkFFRGxCLFFBQUgsR0FBYyxJQUFkO2FBZkosTUFnQk87Ozs7bUJBSUF5QixvQkFBSCxDQUF5QnhJLENBQXpCLEVBQTZCZ0ksYUFBN0I7O1NBdEJELE1BeUJBOztnQkFFQ1YsUUFBUVcsY0FBWjtnQkFDSSxDQUFDWCxLQUFMLEVBQVk7d0JBQ0FNLElBQVI7O2VBRURrQix1QkFBSCxDQUE0QjlJLENBQTVCLEVBQWdDLENBQUVzSCxLQUFGLENBQWhDO2VBQ0d5QixhQUFILENBQWtCekIsS0FBbEI7OztZQUdBTSxLQUFLb0IsY0FBVCxFQUEwQjs7Z0JBRWpCaEosS0FBS0EsRUFBRWdKLGNBQVosRUFBNkI7a0JBQ3ZCQSxjQUFGO2FBREosTUFFTzt1QkFDSWpGLEtBQVAsQ0FBYWtGLFdBQWIsR0FBMkIsS0FBM0I7OztLQTNIUzswQkErSEUsVUFBU2pKLENBQVQsRUFBYXNELEtBQWIsRUFBcUI7WUFDcENpRSxLQUFTLElBQWI7WUFDSUssT0FBU0wsR0FBR1osTUFBaEI7WUFDSXVDLFNBQVMzQixHQUFHVixlQUFILENBQW1CLENBQW5CLENBQWI7O1lBRUlxQyxVQUFVLENBQUNBLE9BQU9sTCxPQUF0QixFQUErQjtxQkFDbEIsSUFBVDs7O1lBR0FnQyxJQUFJLElBQUlnRCxXQUFKLENBQWlCaEQsQ0FBakIsQ0FBUjs7WUFFSUEsRUFBRW9ELElBQUYsSUFBUSxXQUFSLElBQ0c4RixNQURILElBQ2FBLE9BQU9DLFdBRHBCLElBQ21DRCxPQUFPRSxnQkFEMUMsSUFFR0YsT0FBT0csZUFBUCxDQUF3Qi9GLEtBQXhCLENBRlAsRUFFd0M7Ozs7Y0FJbEM5QyxNQUFGLEdBQVdSLEVBQUVxRCxhQUFGLEdBQWtCNkYsTUFBN0I7Y0FDRTVGLEtBQUYsR0FBVzRGLE9BQU9JLGFBQVAsQ0FBc0JoRyxLQUF0QixDQUFYO21CQUNPaUcsYUFBUCxDQUFzQnZKLENBQXRCOzs7WUFHQTFDLE1BQU1zSyxLQUFLTSxvQkFBTCxDQUEyQjVFLEtBQTNCLEVBQW1DLENBQW5DLEVBQXNDLENBQXRDLENBQVY7O1lBRUc0RixVQUFVQSxVQUFVNUwsR0FBcEIsSUFBMkIwQyxFQUFFb0QsSUFBRixJQUFRLFVBQXRDLEVBQWtEO2dCQUMxQzhGLFVBQVVBLE9BQU9sTCxPQUFyQixFQUE4QjttQkFDdkI2SSxlQUFILENBQW1CLENBQW5CLElBQXdCLElBQXhCO2tCQUNFekQsSUFBRixHQUFhLFVBQWI7a0JBQ0VvRyxRQUFGLEdBQWFsTSxHQUFiO2tCQUNFa0QsTUFBRixHQUFhUixFQUFFcUQsYUFBRixHQUFrQjZGLE1BQS9CO2tCQUNFNUYsS0FBRixHQUFhNEYsT0FBT0ksYUFBUCxDQUFzQmhHLEtBQXRCLENBQWI7dUJBQ09pRyxhQUFQLENBQXNCdkosQ0FBdEI7Ozs7WUFJSjFDLE9BQU80TCxVQUFVNUwsR0FBckIsRUFBMEI7O2VBQ25CdUosZUFBSCxDQUFtQixDQUFuQixJQUF3QnZKLEdBQXhCO2NBQ0U4RixJQUFGLEdBQWUsV0FBZjtjQUNFcUcsVUFBRixHQUFlUCxNQUFmO2NBQ0UxSSxNQUFGLEdBQWVSLEVBQUVxRCxhQUFGLEdBQWtCL0YsR0FBakM7Y0FDRWdHLEtBQUYsR0FBZWhHLElBQUlnTSxhQUFKLENBQW1CaEcsS0FBbkIsQ0FBZjtnQkFDSWlHLGFBQUosQ0FBbUJ2SixDQUFuQjs7O1lBR0FBLEVBQUVvRCxJQUFGLElBQVUsV0FBVixJQUF5QjlGLEdBQTdCLEVBQWtDO2NBQzVCa0QsTUFBRixHQUFXUixFQUFFcUQsYUFBRixHQUFrQjZGLE1BQTdCO2NBQ0U1RixLQUFGLEdBQVc0RixPQUFPSSxhQUFQLENBQXNCaEcsS0FBdEIsQ0FBWDttQkFDT2lHLGFBQVAsQ0FBc0J2SixDQUF0Qjs7V0FFRCtJLGFBQUgsQ0FBa0J6TCxHQUFsQixFQUF3QjRMLE1BQXhCO0tBaExpQjttQkFrTEYsVUFBVTVMLEdBQVYsRUFBZ0I0TCxNQUFoQixFQUF3QjtZQUNwQyxDQUFDNUwsR0FBRCxJQUFRLENBQUM0TCxNQUFaLEVBQW9CO2lCQUNYUSxVQUFMLENBQWdCLFNBQWhCOztZQUVEcE0sT0FBTzRMLFVBQVU1TCxHQUFqQixJQUF3QkEsSUFBSVUsT0FBL0IsRUFBdUM7aUJBQzlCMEwsVUFBTCxDQUFnQnBNLElBQUlVLE9BQUosQ0FBWTJMLE1BQTVCOztLQXZMYTtnQkEwTFIsVUFBU0EsTUFBVCxFQUFpQjtZQUN2QixLQUFLM0MsT0FBTCxJQUFnQjJDLE1BQW5CLEVBQTBCOzs7O2FBSXJCaEQsTUFBTCxDQUFZVCxJQUFaLENBQWlCUCxLQUFqQixDQUF1QmdFLE1BQXZCLEdBQWdDQSxNQUFoQzthQUNLM0MsT0FBTCxHQUFlMkMsTUFBZjtLQWhNaUI7Ozs7Ozs7OztrQkEwTU4sVUFBVTNKLENBQVYsRUFBYztZQUNyQnVILEtBQU8sSUFBWDtZQUNJSyxPQUFPTCxHQUFHWixNQUFkO2FBQ0trQixnQkFBTDs7O1dBR0dqQixTQUFILEdBQWVXLEdBQUdxQyx3QkFBSCxDQUE2QjVKLENBQTdCLENBQWY7WUFDSSxDQUFDdUgsR0FBR1IsUUFBUixFQUFrQjs7ZUFFWEYsZUFBSCxHQUFxQlUsR0FBR3NDLGtCQUFILENBQXVCdEMsR0FBR1gsU0FBMUIsQ0FBckI7O1lBRUFXLEdBQUdWLGVBQUgsQ0FBbUJ0SixNQUFuQixHQUE0QixDQUFoQyxFQUFtQzs7Z0JBRTNCeUMsRUFBRW9ELElBQUYsSUFBVW1FLEdBQUdMLElBQUgsQ0FBUTRDLEtBQXRCLEVBQTRCOzs7b0JBR3RCaE0sSUFBRixDQUFReUosR0FBR1YsZUFBWCxFQUE2QixVQUFVUyxLQUFWLEVBQWtCOUosQ0FBbEIsRUFBcUI7d0JBQzFDOEosU0FBU0EsTUFBTWEsV0FBbkIsRUFBZ0M7OzJCQUUxQnBCLFFBQUgsR0FBYyxJQUFkOzsyQkFFRzRCLGlCQUFILENBQXNCckIsS0FBdEIsRUFBOEI5SixDQUE5Qjs7OEJBRU1RLE9BQU4sQ0FBY3lLLFdBQWQsR0FBNEIsQ0FBNUI7OzhCQUVNRixJQUFOLENBQVcsV0FBWDs7K0JBRU8sS0FBUDs7aUJBWFA7Ozs7Z0JBaUJBdkksRUFBRW9ELElBQUYsSUFBVW1FLEdBQUdMLElBQUgsQ0FBUTZDLElBQXRCLEVBQTJCO29CQUNuQnhDLEdBQUdSLFFBQVAsRUFBaUI7d0JBQ1hqSixJQUFGLENBQVF5SixHQUFHVixlQUFYLEVBQTZCLFVBQVVTLEtBQVYsRUFBa0I5SixDQUFsQixFQUFxQjs0QkFDMUM4SixTQUFTQSxNQUFNYSxXQUFuQixFQUFnQzsrQkFDMUJVLGVBQUgsQ0FBb0I3SSxDQUFwQixFQUF3QnNILEtBQXhCLEVBQWdDOUosQ0FBaEM7O3FCQUZQOzs7OztnQkFTSndDLEVBQUVvRCxJQUFGLElBQVVtRSxHQUFHTCxJQUFILENBQVE4QyxHQUF0QixFQUEwQjtvQkFDbEJ6QyxHQUFHUixRQUFQLEVBQWlCO3dCQUNYakosSUFBRixDQUFReUosR0FBR1YsZUFBWCxFQUE2QixVQUFVUyxLQUFWLEVBQWtCOUosQ0FBbEIsRUFBcUI7NEJBQzFDOEosU0FBU0EsTUFBTWEsV0FBbkIsRUFBZ0M7K0JBQ3pCRyxRQUFILENBQWF0SSxDQUFiLEVBQWlCc0gsS0FBakIsRUFBeUIsQ0FBekI7a0NBQ01pQixJQUFOLENBQVcsU0FBWDs7cUJBSFI7dUJBTUd4QixRQUFILEdBQWMsS0FBZDs7O2VBR0wrQix1QkFBSCxDQUE0QjlJLENBQTVCLEVBQWdDdUgsR0FBR1YsZUFBbkM7U0E1Q0osTUE2Q087O2VBRUFpQyx1QkFBSCxDQUE0QjlJLENBQTVCLEVBQWdDLENBQUU0SCxJQUFGLENBQWhDOztLQXBRYTs7OEJBd1FNLFVBQVU1SCxDQUFWLEVBQWE7WUFDaEN1SCxLQUFZLElBQWhCO1lBQ0lLLE9BQVlMLEdBQUdaLE1BQW5CO1lBQ0lzRCxZQUFZLEVBQWhCO1lBQ0VuTSxJQUFGLENBQVFrQyxFQUFFc0QsS0FBVixFQUFrQixVQUFVNEcsS0FBVixFQUFpQjtzQkFDdEJ0TSxJQUFWLENBQWdCO21CQUNSb0YsWUFBWW9DLEtBQVosQ0FBbUI4RSxLQUFuQixJQUE2QnRDLEtBQUtHLFVBQUwsQ0FBZ0JuRCxJQURyQzttQkFFUjVCLFlBQVlzQyxLQUFaLENBQW1CNEUsS0FBbkIsSUFBNkJ0QyxLQUFLRyxVQUFMLENBQWdCaEQ7YUFGckQ7U0FESDtlQU1Pa0YsU0FBUDtLQWxSaUI7d0JBb1JBLFVBQVVFLE1BQVYsRUFBa0I7WUFDL0I1QyxLQUFPLElBQVg7WUFDSUssT0FBT0wsR0FBR1osTUFBZDtZQUNJeUQsZ0JBQWdCLEVBQXBCO1lBQ0V0TSxJQUFGLENBQVFxTSxNQUFSLEVBQWlCLFVBQVNELEtBQVQsRUFBZTswQkFDZHRNLElBQWQsQ0FBb0JnSyxLQUFLTSxvQkFBTCxDQUEyQmdDLEtBQTNCLEVBQW1DLENBQW5DLEVBQXNDLENBQXRDLENBQXBCO1NBREo7ZUFHT0UsYUFBUDtLQTNSaUI7Ozs7Ozs7OzZCQXFTSSxVQUFTcEssQ0FBVCxFQUFZcUssTUFBWixFQUFvQjtZQUNyQyxDQUFDQSxNQUFELElBQVcsRUFBRSxZQUFZQSxNQUFkLENBQWYsRUFBc0M7bUJBQzNCLEtBQVA7O1lBRUE5QyxLQUFLLElBQVQ7WUFDSStDLFdBQVcsS0FBZjtZQUNFeE0sSUFBRixDQUFPdU0sTUFBUCxFQUFlLFVBQVMvQyxLQUFULEVBQWdCOUosQ0FBaEIsRUFBbUI7Z0JBQzFCOEosS0FBSixFQUFXOzJCQUNJLElBQVg7b0JBQ0lpRCxLQUFLLElBQUl2SCxXQUFKLENBQWdCaEQsQ0FBaEIsQ0FBVDttQkFDR1EsTUFBSCxHQUFZK0osR0FBR2xILGFBQUgsR0FBbUJpRSxTQUFTLElBQXhDO21CQUNHa0QsVUFBSCxHQUFnQmpELEdBQUdYLFNBQUgsQ0FBYXBKLENBQWIsQ0FBaEI7bUJBQ0c4RixLQUFILEdBQVdpSCxHQUFHL0osTUFBSCxDQUFVOEksYUFBVixDQUF3QmlCLEdBQUdDLFVBQTNCLENBQVg7c0JBQ01qQixhQUFOLENBQW9CZ0IsRUFBcEI7O1NBUFI7ZUFVT0QsUUFBUDtLQXJUaUI7O3VCQXdURixVQUFTOUosTUFBVCxFQUFpQmhELENBQWpCLEVBQW9CO1lBQy9CK0osS0FBSyxJQUFUO1lBQ0lLLE9BQU9MLEdBQUdaLE1BQWQ7WUFDSThELGlCQUFpQjdDLEtBQUs4QyxZQUFMLENBQWtCQyxZQUFsQixDQUErQm5LLE9BQU9rRixFQUF0QyxDQUFyQjtZQUNJLENBQUMrRSxjQUFMLEVBQXFCOzZCQUNBakssT0FBT0QsS0FBUCxDQUFhLElBQWIsQ0FBakI7MkJBQ2VxSyxVQUFmLEdBQTRCcEssT0FBT3FLLHFCQUFQLEVBQTVCOzs7Ozs7OztpQkFRS0gsWUFBTCxDQUFrQkksVUFBbEIsQ0FBNkJMLGNBQTdCLEVBQTZDLENBQTdDOzt1QkFFV3pNLE9BQWYsQ0FBdUJ5SyxXQUF2QixHQUFxQ2pJLE9BQU9vSSxZQUE1QztlQUNPbUMsVUFBUCxHQUFvQnZLLE9BQU84SSxhQUFQLENBQXFCL0IsR0FBR1gsU0FBSCxDQUFhcEosQ0FBYixDQUFyQixDQUFwQjtlQUNPaU4sY0FBUDtLQTFVaUI7O3FCQTZVSixVQUFTekssQ0FBVCxFQUFZUSxNQUFaLEVBQW9CaEQsQ0FBcEIsRUFBdUI7WUFDaEMrSixLQUFLLElBQVQ7WUFDSUssT0FBT0wsR0FBR1osTUFBZDtZQUNJcUUsU0FBU3hLLE9BQU84SSxhQUFQLENBQXNCL0IsR0FBR1gsU0FBSCxDQUFhcEosQ0FBYixDQUF0QixDQUFiOzs7ZUFHT3lOLFNBQVAsR0FBbUIsSUFBbkI7WUFDSUMsYUFBYTFLLE9BQU8ySyxPQUF4QjtlQUNPQSxPQUFQLEdBQWlCLElBQWpCO2VBQ09uTixPQUFQLENBQWU0RSxDQUFmLElBQXFCb0ksT0FBT3BJLENBQVAsR0FBV3BDLE9BQU91SyxVQUFQLENBQWtCbkksQ0FBbEQ7ZUFDTzVFLE9BQVAsQ0FBZTZFLENBQWYsSUFBcUJtSSxPQUFPbkksQ0FBUCxHQUFXckMsT0FBT3VLLFVBQVAsQ0FBa0JsSSxDQUFsRDtlQUNPMEYsSUFBUCxDQUFZLFVBQVo7ZUFDTzRDLE9BQVAsR0FBaUJELFVBQWpCO2VBQ09ELFNBQVAsR0FBbUIsS0FBbkI7Ozs7WUFJSVIsaUJBQWlCN0MsS0FBSzhDLFlBQUwsQ0FBa0JDLFlBQWxCLENBQStCbkssT0FBT2tGLEVBQXRDLENBQXJCO3VCQUNla0YsVUFBZixHQUE0QnBLLE9BQU9xSyxxQkFBUCxFQUE1Qjs7O3VCQUdlTyxTQUFmO0tBbFdpQjs7Y0FxV1gsVUFBU3BMLENBQVQsRUFBWVEsTUFBWixFQUFvQmhELENBQXBCLEVBQXVCO1lBQ3pCK0osS0FBSyxJQUFUO1lBQ0lLLE9BQU9MLEdBQUdaLE1BQWQ7OztZQUdJOEQsaUJBQWlCN0MsS0FBSzhDLFlBQUwsQ0FBa0JDLFlBQWxCLENBQStCbkssT0FBT2tGLEVBQXRDLENBQXJCO3VCQUNlMkYsT0FBZjs7ZUFFT3JOLE9BQVAsQ0FBZXlLLFdBQWYsR0FBNkJqSSxPQUFPb0ksWUFBcEM7O0NBN1dSLENBZ1hBOztBQzdhQTs7Ozs7OztBQU9BLEFBRUE7Ozs7O0FBS0EsSUFBSTBDLGVBQWUsWUFBVzs7U0FFckJDLFNBQUwsR0FBaUIsRUFBakI7Q0FGSjs7QUFLQUQsYUFBYWhQLFNBQWIsR0FBeUI7Ozs7dUJBSUQsVUFBUzhHLElBQVQsRUFBZW9JLFFBQWYsRUFBeUI7O1lBRXJDLE9BQU9BLFFBQVAsSUFBbUIsVUFBdkIsRUFBbUM7O21CQUUxQixLQUFQOztZQUVFQyxZQUFZLElBQWhCO1lBQ0lDLE9BQVksSUFBaEI7WUFDRTVOLElBQUYsQ0FBUXNGLEtBQUt1SSxLQUFMLENBQVcsR0FBWCxDQUFSLEVBQTBCLFVBQVN2SSxJQUFULEVBQWM7Z0JBQ2hDd0ksTUFBTUYsS0FBS0gsU0FBTCxDQUFlbkksSUFBZixDQUFWO2dCQUNHLENBQUN3SSxHQUFKLEVBQVE7c0JBQ0VGLEtBQUtILFNBQUwsQ0FBZW5JLElBQWYsSUFBdUIsRUFBN0I7b0JBQ0l4RixJQUFKLENBQVM0TixRQUFUO3FCQUNLSyxhQUFMLEdBQXFCLElBQXJCO3VCQUNPLElBQVA7OztnQkFHRDNQLElBQUVjLE9BQUYsQ0FBVTRPLEdBQVYsRUFBZUosUUFBZixLQUE0QixDQUFDLENBQWhDLEVBQW1DO29CQUMzQjVOLElBQUosQ0FBUzROLFFBQVQ7cUJBQ0tLLGFBQUwsR0FBcUIsSUFBckI7dUJBQ08sSUFBUDs7O3dCQUdRLEtBQVo7U0FmSjtlQWlCT0osU0FBUDtLQTdCaUI7Ozs7MEJBa0NFLFVBQVNySSxJQUFULEVBQWVvSSxRQUFmLEVBQXlCO1lBQ3pDL0ssVUFBVWxELE1BQVYsSUFBb0IsQ0FBdkIsRUFBMEIsT0FBTyxLQUFLdU8seUJBQUwsQ0FBK0IxSSxJQUEvQixDQUFQOztZQUV0QndJLE1BQU0sS0FBS0wsU0FBTCxDQUFlbkksSUFBZixDQUFWO1lBQ0csQ0FBQ3dJLEdBQUosRUFBUTttQkFDRyxLQUFQOzs7YUFHQSxJQUFJcE8sSUFBSSxDQUFaLEVBQWVBLElBQUlvTyxJQUFJck8sTUFBdkIsRUFBK0JDLEdBQS9CLEVBQW9DO2dCQUM1QnVPLEtBQUtILElBQUlwTyxDQUFKLENBQVQ7Z0JBQ0d1TyxPQUFPUCxRQUFWLEVBQW9CO29CQUNaUSxNQUFKLENBQVd4TyxDQUFYLEVBQWMsQ0FBZDtvQkFDR29PLElBQUlyTyxNQUFKLElBQWlCLENBQXBCLEVBQXVCOzJCQUNaLEtBQUtnTyxTQUFMLENBQWVuSSxJQUFmLENBQVA7O3dCQUVHbEgsSUFBRStDLE9BQUYsQ0FBVSxLQUFLc00sU0FBZixDQUFILEVBQTZCOzs2QkFFcEJNLGFBQUwsR0FBcUIsS0FBckI7Ozt1QkFHRCxJQUFQOzs7O2VBSUQsS0FBUDtLQTFEaUI7Ozs7Z0NBK0RRLFVBQVN6SSxJQUFULEVBQWU7WUFDcEN3SSxNQUFNLEtBQUtMLFNBQUwsQ0FBZW5JLElBQWYsQ0FBVjtZQUNHLENBQUN3SSxHQUFKLEVBQVM7bUJBQ0UsS0FBS0wsU0FBTCxDQUFlbkksSUFBZixDQUFQOzs7Z0JBR0dsSCxJQUFFK0MsT0FBRixDQUFVLEtBQUtzTSxTQUFmLENBQUgsRUFBNkI7O3FCQUVwQk0sYUFBTCxHQUFxQixLQUFyQjs7O21CQUdHLElBQVA7O2VBRUcsS0FBUDtLQTVFaUI7Ozs7OEJBaUZNLFlBQVc7YUFDN0JOLFNBQUwsR0FBaUIsRUFBakI7YUFDS00sYUFBTCxHQUFxQixLQUFyQjtLQW5GaUI7Ozs7b0JBd0ZKLFVBQVM3TCxDQUFULEVBQVk7WUFDckI0TCxNQUFNLEtBQUtMLFNBQUwsQ0FBZXZMLEVBQUVvRCxJQUFqQixDQUFWOztZQUVJd0ksR0FBSixFQUFTO2dCQUNGLENBQUM1TCxFQUFFUSxNQUFOLEVBQWNSLEVBQUVRLE1BQUYsR0FBVyxJQUFYO2tCQUNSb0wsSUFBSWpMLEtBQUosRUFBTjs7aUJBRUksSUFBSW5ELElBQUksQ0FBWixFQUFlQSxJQUFJb08sSUFBSXJPLE1BQXZCLEVBQStCQyxHQUEvQixFQUFvQztvQkFDNUJnTyxXQUFXSSxJQUFJcE8sQ0FBSixDQUFmO29CQUNHLE9BQU9nTyxRQUFQLElBQW9CLFVBQXZCLEVBQW1DOzZCQUN0QjNOLElBQVQsQ0FBYyxJQUFkLEVBQW9CbUMsQ0FBcEI7Ozs7O1lBS1IsQ0FBQ0EsRUFBRXVELGdCQUFQLEVBQTBCOztnQkFFbEIsS0FBSzhELE1BQVQsRUFBaUI7a0JBQ1hoRSxhQUFGLEdBQWtCLEtBQUtnRSxNQUF2QjtxQkFDS0EsTUFBTCxDQUFZNEUsY0FBWixDQUE0QmpNLENBQTVCOzs7ZUFHRCxJQUFQO0tBOUdpQjs7Ozt1QkFtSEQsVUFBU29ELElBQVQsRUFBZTtZQUMzQndJLE1BQU0sS0FBS0wsU0FBTCxDQUFlbkksSUFBZixDQUFWO2VBQ093SSxPQUFPLElBQVAsSUFBZUEsSUFBSXJPLE1BQUosR0FBYSxDQUFuQzs7Q0FySFIsQ0F5SEE7O0FDNUlBOzs7Ozs7O0FBT0EsQUFDQSxBQUNBLEFBQ0EsQUFHQSxJQUFJMk8sa0JBQWtCLFlBQVU7b0JBQ1psSyxVQUFoQixDQUEyQmxDLFdBQTNCLENBQXVDakMsSUFBdkMsQ0FBNEMsSUFBNUMsRUFBa0RZLElBQWxEO0NBREo7O0FBSUFtQyxNQUFNdUwsVUFBTixDQUFpQkQsZUFBakIsRUFBbUNaLFlBQW5DLEVBQWtEO1FBQ3pDLFVBQVNsSSxJQUFULEVBQWVvSSxRQUFmLEVBQXdCO2FBQ3BCWSxpQkFBTCxDQUF3QmhKLElBQXhCLEVBQThCb0ksUUFBOUI7ZUFDTyxJQUFQO0tBSDBDO3NCQUs3QixVQUFTcEksSUFBVCxFQUFlb0ksUUFBZixFQUF3QjthQUNoQ1ksaUJBQUwsQ0FBd0JoSixJQUF4QixFQUE4Qm9JLFFBQTlCO2VBQ08sSUFBUDtLQVAwQztRQVN6QyxVQUFTcEksSUFBVCxFQUFjb0ksUUFBZCxFQUF1QjthQUNuQmEsb0JBQUwsQ0FBMkJqSixJQUEzQixFQUFpQ29JLFFBQWpDO2VBQ08sSUFBUDtLQVgwQzt5QkFhMUIsVUFBU3BJLElBQVQsRUFBY29JLFFBQWQsRUFBdUI7YUFDbENhLG9CQUFMLENBQTJCakosSUFBM0IsRUFBaUNvSSxRQUFqQztlQUNPLElBQVA7S0FmMEM7K0JBaUJwQixVQUFTcEksSUFBVCxFQUFjO2FBQy9Ca0osMEJBQUwsQ0FBaUNsSixJQUFqQztlQUNPLElBQVA7S0FuQjBDOzZCQXFCdEIsWUFBVTthQUN6Qm1KLHdCQUFMO2VBQ08sSUFBUDtLQXZCMEM7OztVQTJCdkMsVUFBU3BKLFNBQVQsRUFBcUJELE1BQXJCLEVBQTRCO1lBQzNCbEQsSUFBSSxJQUFJZ0QsV0FBSixDQUFpQkcsU0FBakIsQ0FBUjs7WUFFSUQsTUFBSixFQUFZO2lCQUNILElBQUlILENBQVQsSUFBY0csTUFBZCxFQUFzQjtvQkFDZEgsS0FBSy9DLENBQVQsRUFBWTs7NEJBRUF3TSxHQUFSLENBQWF6SixJQUFJLHFCQUFqQjtpQkFGSixNQUdPO3NCQUNEQSxDQUFGLElBQU9HLE9BQU9ILENBQVAsQ0FBUDs7Ozs7WUFLUndFLEtBQUssSUFBVDtZQUNFekosSUFBRixDQUFRcUYsVUFBVXdJLEtBQVYsQ0FBZ0IsR0FBaEIsQ0FBUixFQUErQixVQUFTYyxLQUFULEVBQWU7Y0FDeENwSixhQUFGLEdBQWtCa0UsRUFBbEI7ZUFDR2dDLGFBQUgsQ0FBa0J2SixDQUFsQjtTQUZKO2VBSU8sSUFBUDtLQTlDMEM7bUJBZ0RoQyxVQUFTK0QsS0FBVCxFQUFlOzs7O1lBSXJCLEtBQUsySSxRQUFMLElBQWtCM0ksTUFBTVQsS0FBNUIsRUFBbUM7Z0JBQzNCOUMsU0FBUyxLQUFLMEgsb0JBQUwsQ0FBMkJuRSxNQUFNVCxLQUFqQyxFQUF5QyxDQUF6QyxFQUE0QyxDQUE1QyxDQUFiO2dCQUNJOUMsTUFBSixFQUFZO3VCQUNEK0ksYUFBUCxDQUFzQnhGLEtBQXRCOzs7OztZQUtMLEtBQUsvRixPQUFMLElBQWdCK0YsTUFBTVgsSUFBTixJQUFjLFdBQWpDLEVBQTZDOztnQkFFckN1SixlQUFlLEtBQUtDLGFBQXhCO2dCQUNJQyxZQUFlLEtBQUs3TyxPQUFMLENBQWF5SyxXQUFoQztpQkFDS3dELGNBQUwsQ0FBcUJsSSxLQUFyQjtnQkFDSTRJLGdCQUFnQixLQUFLQyxhQUF6QixFQUF3QztxQkFDL0J6RCxXQUFMLEdBQW1CLElBQW5CO29CQUNJLEtBQUsyRCxVQUFULEVBQXFCO3dCQUNibkcsU0FBUyxLQUFLb0csUUFBTCxHQUFnQjFGLE1BQTdCOzt3QkFFSTJGLGFBQWEsS0FBS3pNLEtBQUwsQ0FBVyxJQUFYLENBQWpCOytCQUNXcUssVUFBWCxHQUF3QixLQUFLQyxxQkFBTCxFQUF4QjsyQkFDT0gsWUFBUCxDQUFvQkksVUFBcEIsQ0FBZ0NrQyxVQUFoQyxFQUE2QyxDQUE3Qzs7eUJBRUtwRSxZQUFMLEdBQW9CaUUsU0FBcEI7eUJBQ0s3TyxPQUFMLENBQWF5SyxXQUFiLEdBQTJCLENBQTNCOzs7Ozs7YUFNUHdELGNBQUwsQ0FBcUJsSSxLQUFyQjs7WUFFSSxLQUFLL0YsT0FBTCxJQUFnQitGLE1BQU1YLElBQU4sSUFBYyxVQUFsQyxFQUE2QztnQkFDdEMsS0FBSytGLFdBQVIsRUFBb0I7O29CQUVaeEMsU0FBUyxLQUFLb0csUUFBTCxHQUFnQjFGLE1BQTdCO3FCQUNLOEIsV0FBTCxHQUFtQixLQUFuQjt1QkFDT3VCLFlBQVAsQ0FBb0J1QyxlQUFwQixDQUFvQyxLQUFLdkgsRUFBekM7O29CQUVJLEtBQUtrRCxZQUFULEVBQXVCO3lCQUNkNUssT0FBTCxDQUFheUssV0FBYixHQUEyQixLQUFLRyxZQUFoQzsyQkFDTyxLQUFLQSxZQUFaOzs7OztlQUtMLElBQVA7S0FqRzBDO2NBbUdyQyxVQUFTeEYsSUFBVCxFQUFjO2VBQ1osS0FBSzhKLGlCQUFMLENBQXVCOUosSUFBdkIsQ0FBUDtLQXBHMEM7c0JBc0c3QixVQUFTQSxJQUFULEVBQWM7ZUFDcEIsS0FBSzhKLGlCQUFMLENBQXVCOUosSUFBdkIsQ0FBUDtLQXZHMEM7V0F5R3RDLFVBQVUrSixPQUFWLEVBQW9CQyxNQUFwQixFQUE0QjthQUMzQjFGLEVBQUwsQ0FBUSxXQUFSLEVBQXNCeUYsT0FBdEI7YUFDS3pGLEVBQUwsQ0FBUSxVQUFSLEVBQXNCMEYsTUFBdEI7ZUFDTyxJQUFQO0tBNUcwQztVQThHdkMsVUFBU2hLLElBQVQsRUFBZW9JLFFBQWYsRUFBd0I7WUFDdkJqRSxLQUFLLElBQVQ7WUFDSThGLGFBQWEsWUFBVTtxQkFDZEMsS0FBVCxDQUFlL0YsRUFBZixFQUFvQjlHLFNBQXBCO2lCQUNLOE0sRUFBTCxDQUFRbkssSUFBUixFQUFlaUssVUFBZjtTQUZKO2FBSUszRixFQUFMLENBQVF0RSxJQUFSLEVBQWVpSyxVQUFmO2VBQ08sSUFBUDs7Q0FySFIsRUF5SEE7O0FDeklBOzs7Ozs7Ozs7QUFTQSxJQUFJRyxTQUFTLFVBQVNDLENBQVQsRUFBWUMsQ0FBWixFQUFlQyxDQUFmLEVBQWtCQyxDQUFsQixFQUFxQkMsRUFBckIsRUFBeUJDLEVBQXpCLEVBQTRCO1NBQ2hDTCxDQUFMLEdBQVNBLEtBQUt4TixTQUFMLEdBQWlCd04sQ0FBakIsR0FBcUIsQ0FBOUI7U0FDS0MsQ0FBTCxHQUFTQSxLQUFLek4sU0FBTCxHQUFpQnlOLENBQWpCLEdBQXFCLENBQTlCO1NBQ0tDLENBQUwsR0FBU0EsS0FBSzFOLFNBQUwsR0FBaUIwTixDQUFqQixHQUFxQixDQUE5QjtTQUNLQyxDQUFMLEdBQVNBLEtBQUszTixTQUFMLEdBQWlCMk4sQ0FBakIsR0FBcUIsQ0FBOUI7U0FDS0MsRUFBTCxHQUFVQSxNQUFNNU4sU0FBTixHQUFrQjROLEVBQWxCLEdBQXVCLENBQWpDO1NBQ0tDLEVBQUwsR0FBVUEsTUFBTTdOLFNBQU4sR0FBa0I2TixFQUFsQixHQUF1QixDQUFqQztDQU5KOztBQVNBTixPQUFPbFIsU0FBUCxHQUFtQjtZQUNOLFVBQVN5UixHQUFULEVBQWE7WUFDZE4sSUFBSSxLQUFLQSxDQUFiO1lBQ0lFLElBQUksS0FBS0EsQ0FBYjtZQUNJRSxLQUFLLEtBQUtBLEVBQWQ7O2FBRUtKLENBQUwsR0FBU0EsSUFBSU0sSUFBSU4sQ0FBUixHQUFZLEtBQUtDLENBQUwsR0FBU0ssSUFBSUosQ0FBbEM7YUFDS0QsQ0FBTCxHQUFTRCxJQUFJTSxJQUFJTCxDQUFSLEdBQVksS0FBS0EsQ0FBTCxHQUFTSyxJQUFJSCxDQUFsQzthQUNLRCxDQUFMLEdBQVNBLElBQUlJLElBQUlOLENBQVIsR0FBWSxLQUFLRyxDQUFMLEdBQVNHLElBQUlKLENBQWxDO2FBQ0tDLENBQUwsR0FBU0QsSUFBSUksSUFBSUwsQ0FBUixHQUFZLEtBQUtFLENBQUwsR0FBU0csSUFBSUgsQ0FBbEM7YUFDS0MsRUFBTCxHQUFVQSxLQUFLRSxJQUFJTixDQUFULEdBQWEsS0FBS0ssRUFBTCxHQUFVQyxJQUFJSixDQUEzQixHQUErQkksSUFBSUYsRUFBN0M7YUFDS0MsRUFBTCxHQUFVRCxLQUFLRSxJQUFJTCxDQUFULEdBQWEsS0FBS0ksRUFBTCxHQUFVQyxJQUFJSCxDQUEzQixHQUErQkcsSUFBSUQsRUFBN0M7ZUFDTyxJQUFQO0tBWlc7cUJBY0csVUFBU2xMLENBQVQsRUFBWUMsQ0FBWixFQUFlbUwsTUFBZixFQUF1QkMsTUFBdkIsRUFBK0JDLFFBQS9CLEVBQXdDO1lBQ2xEQyxNQUFNLENBQVY7WUFDSUMsTUFBTSxDQUFWO1lBQ0dGLFdBQVMsR0FBWixFQUFnQjtnQkFDUnhNLElBQUl3TSxXQUFXMU8sS0FBSzZPLEVBQWhCLEdBQXFCLEdBQTdCO2tCQUNNN08sS0FBSzJPLEdBQUwsQ0FBU3pNLENBQVQsQ0FBTjtrQkFDTWxDLEtBQUs0TyxHQUFMLENBQVMxTSxDQUFULENBQU47OzthQUdDNE0sTUFBTCxDQUFZLElBQUlkLE1BQUosQ0FBV1csTUFBSUgsTUFBZixFQUF1QkksTUFBSUosTUFBM0IsRUFBbUMsQ0FBQ0ksR0FBRCxHQUFLSCxNQUF4QyxFQUFnREUsTUFBSUYsTUFBcEQsRUFBNERyTCxDQUE1RCxFQUErREMsQ0FBL0QsQ0FBWjtlQUNPLElBQVA7S0F4Qlc7WUEwQk4sVUFBUzBMLEtBQVQsRUFBZTs7WUFFaEJKLE1BQU0zTyxLQUFLMk8sR0FBTCxDQUFTSSxLQUFULENBQVY7WUFDSUgsTUFBTTVPLEtBQUs0TyxHQUFMLENBQVNHLEtBQVQsQ0FBVjs7WUFFSWQsSUFBSSxLQUFLQSxDQUFiO1lBQ0lFLElBQUksS0FBS0EsQ0FBYjtZQUNJRSxLQUFLLEtBQUtBLEVBQWQ7O1lBRUlVLFFBQU0sQ0FBVixFQUFZO2lCQUNIZCxDQUFMLEdBQVNBLElBQUlVLEdBQUosR0FBVSxLQUFLVCxDQUFMLEdBQVNVLEdBQTVCO2lCQUNLVixDQUFMLEdBQVNELElBQUlXLEdBQUosR0FBVSxLQUFLVixDQUFMLEdBQVNTLEdBQTVCO2lCQUNLUixDQUFMLEdBQVNBLElBQUlRLEdBQUosR0FBVSxLQUFLUCxDQUFMLEdBQVNRLEdBQTVCO2lCQUNLUixDQUFMLEdBQVNELElBQUlTLEdBQUosR0FBVSxLQUFLUixDQUFMLEdBQVNPLEdBQTVCO2lCQUNLTixFQUFMLEdBQVVBLEtBQUtNLEdBQUwsR0FBVyxLQUFLTCxFQUFMLEdBQVVNLEdBQS9CO2lCQUNLTixFQUFMLEdBQVVELEtBQUtPLEdBQUwsR0FBVyxLQUFLTixFQUFMLEdBQVVLLEdBQS9CO1NBTkosTUFPTztnQkFDQ0ssS0FBS2hQLEtBQUs0TyxHQUFMLENBQVM1TyxLQUFLaVAsR0FBTCxDQUFTRixLQUFULENBQVQsQ0FBVDtnQkFDSUcsS0FBS2xQLEtBQUsyTyxHQUFMLENBQVMzTyxLQUFLaVAsR0FBTCxDQUFTRixLQUFULENBQVQsQ0FBVDs7aUJBRUtkLENBQUwsR0FBU0EsSUFBRWlCLEVBQUYsR0FBTyxLQUFLaEIsQ0FBTCxHQUFPYyxFQUF2QjtpQkFDS2QsQ0FBTCxHQUFTLENBQUNELENBQUQsR0FBR2UsRUFBSCxHQUFRLEtBQUtkLENBQUwsR0FBT2dCLEVBQXhCO2lCQUNLZixDQUFMLEdBQVNBLElBQUVlLEVBQUYsR0FBTyxLQUFLZCxDQUFMLEdBQU9ZLEVBQXZCO2lCQUNLWixDQUFMLEdBQVMsQ0FBQ0QsQ0FBRCxHQUFHYSxFQUFILEdBQVFFLEtBQUcsS0FBS2QsQ0FBekI7aUJBQ0tDLEVBQUwsR0FBVWEsS0FBR2IsRUFBSCxHQUFRVyxLQUFHLEtBQUtWLEVBQTFCO2lCQUNLQSxFQUFMLEdBQVVZLEtBQUcsS0FBS1osRUFBUixHQUFhVSxLQUFHWCxFQUExQjs7ZUFFRyxJQUFQO0tBckRXO1dBdURQLFVBQVNjLEVBQVQsRUFBYUMsRUFBYixFQUFnQjthQUNmbkIsQ0FBTCxJQUFVa0IsRUFBVjthQUNLZixDQUFMLElBQVVnQixFQUFWO2FBQ0tmLEVBQUwsSUFBV2MsRUFBWDthQUNLYixFQUFMLElBQVdjLEVBQVg7ZUFDTyxJQUFQO0tBNURXO2VBOERILFVBQVNDLEVBQVQsRUFBYUMsRUFBYixFQUFnQjthQUNuQmpCLEVBQUwsSUFBV2dCLEVBQVg7YUFDS2YsRUFBTCxJQUFXZ0IsRUFBWDtlQUNPLElBQVA7S0FqRVc7Y0FtRUosWUFBVTs7YUFFWnJCLENBQUwsR0FBUyxLQUFLRyxDQUFMLEdBQVMsQ0FBbEI7YUFDS0YsQ0FBTCxHQUFTLEtBQUtDLENBQUwsR0FBUyxLQUFLRSxFQUFMLEdBQVUsS0FBS0MsRUFBTCxHQUFVLENBQXRDO2VBQ08sSUFBUDtLQXZFVztZQXlFTixZQUFVOztZQUVYTCxJQUFJLEtBQUtBLENBQWI7WUFDSUMsSUFBSSxLQUFLQSxDQUFiO1lBQ0lDLElBQUksS0FBS0EsQ0FBYjtZQUNJQyxJQUFJLEtBQUtBLENBQWI7WUFDSUMsS0FBSyxLQUFLQSxFQUFkO1lBQ0lyUSxJQUFJaVEsSUFBSUcsQ0FBSixHQUFRRixJQUFJQyxDQUFwQjs7YUFFS0YsQ0FBTCxHQUFTRyxJQUFJcFEsQ0FBYjthQUNLa1EsQ0FBTCxHQUFTLENBQUNBLENBQUQsR0FBS2xRLENBQWQ7YUFDS21RLENBQUwsR0FBUyxDQUFDQSxDQUFELEdBQUtuUSxDQUFkO2FBQ0tvUSxDQUFMLEdBQVNILElBQUlqUSxDQUFiO2FBQ0txUSxFQUFMLEdBQVUsQ0FBQ0YsSUFBSSxLQUFLRyxFQUFULEdBQWNGLElBQUlDLEVBQW5CLElBQXlCclEsQ0FBbkM7YUFDS3NRLEVBQUwsR0FBVSxFQUFFTCxJQUFJLEtBQUtLLEVBQVQsR0FBY0osSUFBSUcsRUFBcEIsSUFBMEJyUSxDQUFwQztlQUNPLElBQVA7S0F4Rlc7V0EwRlAsWUFBVTtlQUNQLElBQUlnUSxNQUFKLENBQVcsS0FBS0MsQ0FBaEIsRUFBbUIsS0FBS0MsQ0FBeEIsRUFBMkIsS0FBS0MsQ0FBaEMsRUFBbUMsS0FBS0MsQ0FBeEMsRUFBMkMsS0FBS0MsRUFBaEQsRUFBb0QsS0FBS0MsRUFBekQsQ0FBUDtLQTNGVzthQTZGTCxZQUFVO2VBQ1QsQ0FBRSxLQUFLTCxDQUFQLEVBQVcsS0FBS0MsQ0FBaEIsRUFBb0IsS0FBS0MsQ0FBekIsRUFBNkIsS0FBS0MsQ0FBbEMsRUFBc0MsS0FBS0MsRUFBM0MsRUFBZ0QsS0FBS0MsRUFBckQsQ0FBUDtLQTlGVzs7OztlQW1HSCxVQUFTaUIsQ0FBVCxFQUFZO1lBQ2hCQyxLQUFLLEtBQUt2QixDQUFkO1lBQWlCd0IsS0FBSyxLQUFLdEIsQ0FBM0I7WUFBOEJ1QixNQUFNLEtBQUtyQixFQUF6QztZQUNJc0IsS0FBSyxLQUFLekIsQ0FBZDtZQUFpQjBCLEtBQUssS0FBS3hCLENBQTNCO1lBQThCeUIsTUFBTSxLQUFLdkIsRUFBekM7O1lBRUl3QixNQUFNLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBVjtZQUNJLENBQUosSUFBU1AsRUFBRSxDQUFGLElBQU9DLEVBQVAsR0FBWUQsRUFBRSxDQUFGLElBQU9FLEVBQW5CLEdBQXdCQyxHQUFqQztZQUNJLENBQUosSUFBU0gsRUFBRSxDQUFGLElBQU9JLEVBQVAsR0FBWUosRUFBRSxDQUFGLElBQU9LLEVBQW5CLEdBQXdCQyxHQUFqQzs7ZUFFT0MsR0FBUDs7Q0EzR1IsQ0ErR0E7O0FDbElBOzs7Ozs7Ozs7QUFXQSxJQUFJQyxTQUFTO1NBQ0gsRUFERztTQUVILEVBRkc7Q0FBYjtBQUlBLElBQUlDLFdBQVdoUSxLQUFLNk8sRUFBTCxHQUFVLEdBQXpCOzs7Ozs7QUFNQSxTQUFTRCxHQUFULENBQWFHLEtBQWIsRUFBb0JrQixTQUFwQixFQUErQjtZQUNuQixDQUFDQSxZQUFZbEIsUUFBUWlCLFFBQXBCLEdBQStCakIsS0FBaEMsRUFBdUNtQixPQUF2QyxDQUErQyxDQUEvQyxDQUFSO1FBQ0csT0FBT0gsT0FBT25CLEdBQVAsQ0FBV0csS0FBWCxDQUFQLElBQTRCLFdBQS9CLEVBQTRDO2VBQ2pDSCxHQUFQLENBQVdHLEtBQVgsSUFBb0IvTyxLQUFLNE8sR0FBTCxDQUFTRyxLQUFULENBQXBCOztXQUVHZ0IsT0FBT25CLEdBQVAsQ0FBV0csS0FBWCxDQUFQOzs7Ozs7QUFNSixTQUFTSixHQUFULENBQWFJLEtBQWIsRUFBb0JrQixTQUFwQixFQUErQjtZQUNuQixDQUFDQSxZQUFZbEIsUUFBUWlCLFFBQXBCLEdBQStCakIsS0FBaEMsRUFBdUNtQixPQUF2QyxDQUErQyxDQUEvQyxDQUFSO1FBQ0csT0FBT0gsT0FBT3BCLEdBQVAsQ0FBV0ksS0FBWCxDQUFQLElBQTRCLFdBQS9CLEVBQTRDO2VBQ2pDSixHQUFQLENBQVdJLEtBQVgsSUFBb0IvTyxLQUFLMk8sR0FBTCxDQUFTSSxLQUFULENBQXBCOztXQUVHZ0IsT0FBT3BCLEdBQVAsQ0FBV0ksS0FBWCxDQUFQOzs7Ozs7O0FBT0osU0FBU29CLGNBQVQsQ0FBd0JwQixLQUF4QixFQUErQjtXQUNwQkEsUUFBUWlCLFFBQWY7Ozs7Ozs7QUFPSixTQUFTSSxjQUFULENBQXdCckIsS0FBeEIsRUFBK0I7V0FDcEJBLFFBQVFpQixRQUFmOzs7Ozs7O0FBT0osU0FBU0ssV0FBVCxDQUFzQnRCLEtBQXRCLEVBQThCO1FBQ3RCdUIsUUFBUSxDQUFDLE1BQU92QixRQUFTLEdBQWpCLElBQXdCLEdBQXBDLENBRDBCO1FBRXRCdUIsU0FBUyxDQUFULElBQWN2QixVQUFVLENBQTVCLEVBQStCO2dCQUNuQixHQUFSOztXQUVHdUIsS0FBUDs7O0FBR0osYUFBZTtRQUNMdFEsS0FBSzZPLEVBREE7U0FFTEQsR0FGSztTQUdMRCxHQUhLO29CQUlNd0IsY0FKTjtvQkFLTUMsY0FMTjtpQkFNTUM7Q0FOckI7O0FDcEVBOzs7OztBQUtBLEFBQ0EsQUFFQTs7Ozs7O0FBTUEsU0FBU0UsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUIxTSxLQUF6QixFQUFnQztRQUN4QlYsSUFBSVUsTUFBTVYsQ0FBZDtRQUNJQyxJQUFJUyxNQUFNVCxDQUFkO1FBQ0ksQ0FBQ21OLEtBQUQsSUFBVSxDQUFDQSxNQUFNNU0sSUFBckIsRUFBMkI7O2VBRWhCLEtBQVA7OztXQUdHNk0sY0FBY0QsS0FBZCxFQUFxQnBOLENBQXJCLEVBQXdCQyxDQUF4QixDQUFQOzs7QUFHSixTQUFTb04sYUFBVCxDQUF1QkQsS0FBdkIsRUFBOEJwTixDQUE5QixFQUFpQ0MsQ0FBakMsRUFBb0M7O1lBRXhCbU4sTUFBTTVNLElBQWQ7YUFDUyxNQUFMO21CQUNXOE0sY0FBY0YsTUFBTWhTLE9BQXBCLEVBQTZCNEUsQ0FBN0IsRUFBZ0NDLENBQWhDLENBQVA7YUFDQyxZQUFMO21CQUNXc04sb0JBQW9CSCxLQUFwQixFQUEyQnBOLENBQTNCLEVBQThCQyxDQUE5QixDQUFQO2FBQ0MsTUFBTDttQkFDVyxJQUFQO2FBQ0MsTUFBTDttQkFDVyxJQUFQO2FBQ0MsUUFBTDttQkFDV3VOLGdCQUFnQkosS0FBaEIsRUFBdUJwTixDQUF2QixFQUEwQkMsQ0FBMUIsQ0FBUDthQUNDLFNBQUw7bUJBQ1d3TixpQkFBaUJMLEtBQWpCLEVBQXdCcE4sQ0FBeEIsRUFBMkJDLENBQTNCLENBQVA7YUFDQyxRQUFMO21CQUNXeU4sZ0JBQWdCTixLQUFoQixFQUF1QnBOLENBQXZCLEVBQTBCQyxDQUExQixDQUFQO2FBQ0MsTUFBTDthQUNLLFNBQUw7bUJBQ1cwTixjQUFjUCxLQUFkLEVBQXFCcE4sQ0FBckIsRUFBd0JDLENBQXhCLENBQVA7YUFDQyxTQUFMO2FBQ0ssUUFBTDttQkFDVzJOLCtCQUErQlIsS0FBL0IsRUFBc0NwTixDQUF0QyxFQUF5Q0MsQ0FBekMsQ0FBUDs7Ozs7OztBQU9aLFNBQVM0TixTQUFULENBQW1CVCxLQUFuQixFQUEwQnBOLENBQTFCLEVBQTZCQyxDQUE3QixFQUFnQztXQUNyQixDQUFDa04sU0FBU0MsS0FBVCxFQUFnQnBOLENBQWhCLEVBQW1CQyxDQUFuQixDQUFSOzs7Ozs7QUFNSixTQUFTcU4sYUFBVCxDQUF1QmxTLE9BQXZCLEVBQWdDNEUsQ0FBaEMsRUFBbUNDLENBQW5DLEVBQXNDO1FBQzlCNk4sS0FBSzFTLFFBQVEyUyxNQUFqQjtRQUNJQyxLQUFLNVMsUUFBUTZTLE1BQWpCO1FBQ0lDLEtBQUs5UyxRQUFRK1MsSUFBakI7UUFDSUMsS0FBS2hULFFBQVFpVCxJQUFqQjtRQUNJQyxLQUFLMVIsS0FBS0MsR0FBTCxDQUFTekIsUUFBUW1ULFNBQWpCLEVBQTZCLENBQTdCLENBQVQ7UUFDSUMsS0FBSyxDQUFUO1FBQ0lDLEtBQUtYLEVBQVQ7O1FBR0s3TixJQUFJK04sS0FBS00sRUFBVCxJQUFlck8sSUFBSW1PLEtBQUtFLEVBQXpCLElBQ0lyTyxJQUFJK04sS0FBS00sRUFBVCxJQUFlck8sSUFBSW1PLEtBQUtFLEVBRDVCLElBRUl0TyxJQUFJOE4sS0FBS1EsRUFBVCxJQUFldE8sSUFBSWtPLEtBQUtJLEVBRjVCLElBR0l0TyxJQUFJOE4sS0FBS1EsRUFBVCxJQUFldE8sSUFBSWtPLEtBQUtJLEVBSmhDLEVBS0M7ZUFDVSxLQUFQOzs7UUFHQVIsT0FBT0ksRUFBWCxFQUFlO2FBQ04sQ0FBQ0YsS0FBS0ksRUFBTixLQUFhTixLQUFLSSxFQUFsQixDQUFMO2FBQ0ssQ0FBQ0osS0FBS00sRUFBTCxHQUFVRixLQUFLRixFQUFoQixLQUF1QkYsS0FBS0ksRUFBNUIsQ0FBTDtLQUZKLE1BR087ZUFDSXRSLEtBQUtpUCxHQUFMLENBQVM3TCxJQUFJOE4sRUFBYixLQUFvQlEsS0FBSyxDQUFoQzs7O1FBR0FJLEtBQUssQ0FBQ0YsS0FBS3hPLENBQUwsR0FBU0MsQ0FBVCxHQUFhd08sRUFBZCxLQUFxQkQsS0FBS3hPLENBQUwsR0FBU0MsQ0FBVCxHQUFhd08sRUFBbEMsS0FBeUNELEtBQUtBLEVBQUwsR0FBVSxDQUFuRCxDQUFUO1dBQ09FLE1BQU1KLEtBQUssQ0FBTCxHQUFTQSxFQUFULEdBQWMsQ0FBM0I7OztBQUdKLFNBQVNmLG1CQUFULENBQTZCSCxLQUE3QixFQUFvQ3BOLENBQXBDLEVBQXVDQyxDQUF2QyxFQUEwQztRQUNsQzdFLFVBQVVnUyxNQUFNaFMsT0FBcEI7UUFDSXVULFlBQVl2VCxRQUFRdVQsU0FBeEI7UUFDSUMsUUFBSjtRQUNJQyxjQUFjLEtBQWxCO1NBQ0ssSUFBSWpVLElBQUksQ0FBUixFQUFXa1UsSUFBSUgsVUFBVWhVLE1BQVYsR0FBbUIsQ0FBdkMsRUFBMENDLElBQUlrVSxDQUE5QyxFQUFpRGxVLEdBQWpELEVBQXNEO21CQUN2QztvQkFDQytULFVBQVUvVCxDQUFWLEVBQWEsQ0FBYixDQUREO29CQUVDK1QsVUFBVS9ULENBQVYsRUFBYSxDQUFiLENBRkQ7a0JBR0QrVCxVQUFVL1QsSUFBSSxDQUFkLEVBQWlCLENBQWpCLENBSEM7a0JBSUQrVCxVQUFVL1QsSUFBSSxDQUFkLEVBQWlCLENBQWpCLENBSkM7dUJBS0lRLFFBQVFtVDtTQUx2QjtZQU9JLENBQUNRLG1CQUFtQjtlQUNUblMsS0FBS29TLEdBQUwsQ0FBU0osU0FBU2IsTUFBbEIsRUFBMEJhLFNBQVNULElBQW5DLElBQTJDUyxTQUFTTCxTQUQzQztlQUVUM1IsS0FBS29TLEdBQUwsQ0FBU0osU0FBU1gsTUFBbEIsRUFBMEJXLFNBQVNQLElBQW5DLElBQTJDTyxTQUFTTCxTQUYzQzttQkFHTDNSLEtBQUtpUCxHQUFMLENBQVMrQyxTQUFTYixNQUFULEdBQWtCYSxTQUFTVCxJQUFwQyxJQUE0Q1MsU0FBU0wsU0FIaEQ7b0JBSUozUixLQUFLaVAsR0FBTCxDQUFTK0MsU0FBU1gsTUFBVCxHQUFrQlcsU0FBU1AsSUFBcEMsSUFBNENPLFNBQVNMO1NBSnBFLEVBTUd2TyxDQU5ILEVBTU1DLENBTk4sQ0FBTCxFQU9POzs7O3NCQUlPcU4sY0FBY3NCLFFBQWQsRUFBd0I1TyxDQUF4QixFQUEyQkMsQ0FBM0IsQ0FBZDtZQUNJNE8sV0FBSixFQUFpQjs7OztXQUlkQSxXQUFQOzs7Ozs7QUFPSixTQUFTRSxrQkFBVCxDQUE0QjNCLEtBQTVCLEVBQW1DcE4sQ0FBbkMsRUFBc0NDLENBQXRDLEVBQXlDO1FBQ2pDRCxLQUFLb04sTUFBTXBOLENBQVgsSUFBZ0JBLEtBQU1vTixNQUFNcE4sQ0FBTixHQUFVb04sTUFBTW5LLEtBQXRDLElBQWdEaEQsS0FBS21OLE1BQU1uTixDQUEzRCxJQUFnRUEsS0FBTW1OLE1BQU1uTixDQUFOLEdBQVVtTixNQUFNbEssTUFBMUYsRUFBbUc7ZUFDeEYsSUFBUDs7V0FFRyxLQUFQOzs7Ozs7QUFNSixTQUFTc0ssZUFBVCxDQUF5QkosS0FBekIsRUFBZ0NwTixDQUFoQyxFQUFtQ0MsQ0FBbkMsRUFBc0NuQixDQUF0QyxFQUF5QztRQUNqQzFELFVBQVVnUyxNQUFNaFMsT0FBcEI7S0FDQzBELENBQUQsS0FBT0EsSUFBSTFELFFBQVEwRCxDQUFuQjtTQUNHMUQsUUFBUW1ULFNBQVg7V0FDUXZPLElBQUlBLENBQUosR0FBUUMsSUFBSUEsQ0FBYixHQUFrQm5CLElBQUlBLENBQTdCOzs7Ozs7QUFNSixTQUFTNE8sZUFBVCxDQUF5Qk4sS0FBekIsRUFBZ0NwTixDQUFoQyxFQUFtQ0MsQ0FBbkMsRUFBc0M7UUFDOUI3RSxVQUFVZ1MsTUFBTWhTLE9BQXBCO1FBQ0ksQ0FBQ29TLGdCQUFnQkosS0FBaEIsRUFBdUJwTixDQUF2QixFQUEwQkMsQ0FBMUIsQ0FBRCxJQUFrQzdFLFFBQVE2VCxFQUFSLEdBQWEsQ0FBYixJQUFrQnpCLGdCQUFnQkosS0FBaEIsRUFBdUJwTixDQUF2QixFQUEwQkMsQ0FBMUIsRUFBNkI3RSxRQUFRNlQsRUFBckMsQ0FBeEQsRUFBbUc7O2VBRXhGLEtBQVA7S0FGSixNQUdPOztZQUVDQyxhQUFhQyxPQUFPbEMsV0FBUCxDQUFtQjdSLFFBQVE4VCxVQUEzQixDQUFqQixDQUZHO1lBR0NFLFdBQVdELE9BQU9sQyxXQUFQLENBQW1CN1IsUUFBUWdVLFFBQTNCLENBQWYsQ0FIRzs7O1lBTUN6RCxRQUFRd0QsT0FBT2xDLFdBQVAsQ0FBb0JyUSxLQUFLeVMsS0FBTCxDQUFXcFAsQ0FBWCxFQUFjRCxDQUFkLElBQW1CcEQsS0FBSzZPLEVBQXhCLEdBQTZCLEdBQTlCLEdBQXFDLEdBQXhELENBQVo7O1lBRUk2RCxRQUFRLElBQVosQ0FSRztZQVNFSixhQUFhRSxRQUFiLElBQXlCLENBQUNoVSxRQUFRbVUsU0FBbkMsSUFBa0RMLGFBQWFFLFFBQWIsSUFBeUJoVSxRQUFRbVUsU0FBdkYsRUFBbUc7b0JBQ3ZGLEtBQVIsQ0FEK0Y7OztZQUkvRkMsV0FBVyxDQUNYNVMsS0FBS29TLEdBQUwsQ0FBU0UsVUFBVCxFQUFxQkUsUUFBckIsQ0FEVyxFQUVYeFMsS0FBS0MsR0FBTCxDQUFTcVMsVUFBVCxFQUFxQkUsUUFBckIsQ0FGVyxDQUFmOztZQUtJSyxhQUFhOUQsUUFBUTZELFNBQVMsQ0FBVCxDQUFSLElBQXVCN0QsUUFBUTZELFNBQVMsQ0FBVCxDQUFoRDtlQUNRQyxjQUFjSCxLQUFmLElBQTBCLENBQUNHLFVBQUQsSUFBZSxDQUFDSCxLQUFqRDs7Ozs7OztBQU9SLFNBQVM3QixnQkFBVCxDQUEwQkwsS0FBMUIsRUFBaUNwTixDQUFqQyxFQUFvQ0MsQ0FBcEMsRUFBdUM7UUFDL0I3RSxVQUFVZ1MsTUFBTWhTLE9BQXBCO1FBQ0lzVSxTQUFTO1dBQ04sQ0FETTtXQUVOO0tBRlA7O1FBS0lDLFVBQVV2VSxRQUFRd1UsRUFBdEI7UUFDSUMsVUFBVXpVLFFBQVEwVSxFQUF0Qjs7UUFFSTNQLElBQUk7V0FDREgsQ0FEQztXQUVEQztLQUZQOztRQUtJOFAsSUFBSjs7TUFFRS9QLENBQUYsSUFBTzBQLE9BQU8xUCxDQUFkO01BQ0VDLENBQUYsSUFBT3lQLE9BQU96UCxDQUFkOztNQUVFRCxDQUFGLElBQU9HLEVBQUVILENBQVQ7TUFDRUMsQ0FBRixJQUFPRSxFQUFFRixDQUFUOztlQUVXMFAsT0FBWDtlQUNXRSxPQUFYOztXQUVPQSxVQUFVMVAsRUFBRUgsQ0FBWixHQUFnQjJQLFVBQVV4UCxFQUFFRixDQUE1QixHQUFnQzBQLFVBQVVFLE9BQWpEOztXQUVRRSxPQUFPLENBQWY7Ozs7Ozs7QUFPSixTQUFTbkMsOEJBQVQsQ0FBd0NSLEtBQXhDLEVBQStDcE4sQ0FBL0MsRUFBa0RDLENBQWxELEVBQXFEO1FBQzdDN0UsVUFBVWdTLE1BQU1oUyxPQUFOLEdBQWdCZ1MsTUFBTWhTLE9BQXRCLEdBQWdDZ1MsS0FBOUM7UUFDSTRDLE9BQU8xVyxJQUFFcUUsS0FBRixDQUFRdkMsUUFBUXVULFNBQWhCLENBQVgsQ0FGaUQ7U0FHNUMzVCxJQUFMLENBQVVnVixLQUFLLENBQUwsQ0FBVixFQUhpRDtRQUk3Q0MsS0FBSyxDQUFUO1NBQ0ssSUFBSUMsTUFBSixFQUFZQyxRQUFRSCxLQUFLLENBQUwsRUFBUSxDQUFSLElBQWEvUCxDQUFqQyxFQUFvQ3JGLElBQUksQ0FBN0MsRUFBZ0RBLElBQUlvVixLQUFLclYsTUFBekQsRUFBaUVDLEdBQWpFLEVBQXNFOztZQUU5RHdWLFNBQVM5QyxjQUFjO29CQUNkMEMsS0FBS3BWLElBQUUsQ0FBUCxFQUFVLENBQVYsQ0FEYztvQkFFZG9WLEtBQUtwVixJQUFFLENBQVAsRUFBVSxDQUFWLENBRmM7a0JBR2RvVixLQUFLcFYsQ0FBTCxFQUFRLENBQVIsQ0FIYztrQkFJZG9WLEtBQUtwVixDQUFMLEVBQVEsQ0FBUixDQUpjO3VCQUtWUSxRQUFRbVQsU0FBUixJQUFxQjtTQUx6QixFQU1Udk8sQ0FOUyxFQU1MQyxDQU5LLENBQWI7WUFPS21RLE1BQUwsRUFBYTttQkFDRixJQUFQOzs7WUFHQWhWLFFBQVFpVixTQUFaLEVBQXVCO3FCQUNWRixLQUFUO29CQUNRSCxLQUFLcFYsQ0FBTCxFQUFRLENBQVIsSUFBYXFGLENBQXJCO2dCQUNJaVEsVUFBVUMsS0FBZCxFQUFxQjtvQkFDYkcsSUFBSSxDQUFDSixTQUFTLENBQVQsR0FBYSxDQUFkLEtBQW9CQyxRQUFRLENBQVIsR0FBWSxDQUFoQyxDQUFSO29CQUNJRyxLQUFLLENBQUNOLEtBQUtwVixJQUFJLENBQVQsRUFBWSxDQUFaLElBQWlCb0YsQ0FBbEIsS0FBd0JnUSxLQUFLcFYsQ0FBTCxFQUFRLENBQVIsSUFBYXFGLENBQXJDLElBQTBDLENBQUMrUCxLQUFLcFYsSUFBSSxDQUFULEVBQVksQ0FBWixJQUFpQnFGLENBQWxCLEtBQXdCK1AsS0FBS3BWLENBQUwsRUFBUSxDQUFSLElBQWFvRixDQUFyQyxDQUEvQyxJQUEwRixDQUE5RixFQUFpRzswQkFDdkZzUSxDQUFOOzs7OztXQUtUTCxFQUFQOzs7Ozs7QUFNSixTQUFTdEMsYUFBVCxDQUF1QlAsS0FBdkIsRUFBOEJwTixDQUE5QixFQUFpQ0MsQ0FBakMsRUFBb0M7UUFDNUI3RSxVQUFVZ1MsTUFBTWhTLE9BQXBCO1FBQ0l1VCxZQUFZdlQsUUFBUXVULFNBQXhCO1FBQ0lFLGNBQWMsS0FBbEI7U0FDSyxJQUFJalUsSUFBSSxDQUFSLEVBQVdrVSxJQUFJSCxVQUFVaFUsTUFBOUIsRUFBc0NDLElBQUlrVSxDQUExQyxFQUE2Q2xVLEdBQTdDLEVBQWtEO3NCQUNoQ2dULCtCQUErQjt1QkFDOUJlLFVBQVUvVCxDQUFWLENBRDhCO3VCQUU5QlEsUUFBUW1ULFNBRnNCO3VCQUc5Qm5ULFFBQVFpVjtTQUhULEVBSVhyUSxDQUpXLEVBSVJDLENBSlEsQ0FBZDtZQUtJNE8sV0FBSixFQUFpQjs7OztXQUlkQSxXQUFQOzs7QUFHSixtQkFBZTtjQUNEMUIsUUFEQztlQUVBVTtDQUZmOztBQ3RRQTs7Ozs7Ozs7O0FBU0MsSUFBSTBDLFFBQVFBLFNBQVUsWUFBWTs7S0FFN0JDLFVBQVUsRUFBZDs7UUFFTzs7VUFFRSxZQUFZOztVQUVaQSxPQUFQO0dBSks7O2FBUUssWUFBWTs7YUFFWixFQUFWO0dBVks7O09BY0QsVUFBVUMsS0FBVixFQUFpQjs7V0FFYnpWLElBQVIsQ0FBYXlWLEtBQWI7R0FoQks7O1VBb0JFLFVBQVVBLEtBQVYsRUFBaUI7O09BRXJCN1YsSUFBSXRCLElBQUVjLE9BQUYsQ0FBV29XLE9BQVgsRUFBcUJDLEtBQXJCLENBQVIsQ0FGeUI7O09BSXJCN1YsTUFBTSxDQUFDLENBQVgsRUFBYztZQUNMd08sTUFBUixDQUFleE8sQ0FBZixFQUFrQixDQUFsQjs7R0F6Qks7O1VBOEJDLFVBQVU4VixJQUFWLEVBQWdCQyxRQUFoQixFQUEwQjs7T0FFN0JILFFBQVE3VixNQUFSLEtBQW1CLENBQXZCLEVBQTBCO1dBQ2xCLEtBQVA7OztPQUdHQyxJQUFJLENBQVI7O1VBRU84VixTQUFTclQsU0FBVCxHQUFxQnFULElBQXJCLEdBQTRCSCxNQUFNSyxHQUFOLEVBQW5DOztVQUVPaFcsSUFBSTRWLFFBQVE3VixNQUFuQixFQUEyQjs7Ozs7Ozs7Ozs7Ozs7UUFjVmtXLEtBQUtMLFFBQVE1VixDQUFSLENBQVQ7UUFDSWtXLGFBQWFELEdBQUdFLE1BQUgsQ0FBVUwsSUFBVixDQUFqQjs7UUFFSSxDQUFDRixRQUFRNVYsQ0FBUixDQUFMLEVBQWlCOzs7UUFHWmlXLE9BQU9MLFFBQVE1VixDQUFSLENBQVosRUFBeUI7U0FDbkJrVyxjQUFjSCxRQUFuQixFQUE4Qjs7TUFBOUIsTUFFTztjQUNFdkgsTUFBUixDQUFleE8sQ0FBZixFQUFrQixDQUFsQjs7Ozs7VUFNQyxJQUFQOztFQXRFVjtDQUpvQixFQUFyQjs7OztBQW9GRCxJQUFJLE9BQVFvQyxNQUFSLEtBQW9CLFdBQXBCLElBQW1DLE9BQVFnVSxPQUFSLEtBQXFCLFdBQTVELEVBQXlFO09BQ2xFSixHQUFOLEdBQVksWUFBWTtNQUNuQkYsT0FBT00sUUFBUUMsTUFBUixFQUFYOzs7U0FHT1AsS0FBSyxDQUFMLElBQVUsSUFBVixHQUFpQkEsS0FBSyxDQUFMLElBQVUsT0FBbEM7RUFKRDs7O0tBUUksSUFBSSxPQUFRMVQsTUFBUixLQUFvQixXQUFwQixJQUNSQSxPQUFPa1UsV0FBUCxLQUF1QjdULFNBRGYsSUFFUkwsT0FBT2tVLFdBQVAsQ0FBbUJOLEdBQW5CLEtBQTJCdlQsU0FGdkIsRUFFa0M7OztRQUdoQ3VULEdBQU4sR0FBWTVULE9BQU9rVSxXQUFQLENBQW1CTixHQUFuQixDQUF1Qk8sSUFBdkIsQ0FBNEJuVSxPQUFPa1UsV0FBbkMsQ0FBWjs7O01BR0ksSUFBSUUsS0FBS1IsR0FBTCxLQUFhdlQsU0FBakIsRUFBNEI7U0FDMUJ1VCxHQUFOLEdBQVlRLEtBQUtSLEdBQWpCOzs7T0FHSTtVQUNFQSxHQUFOLEdBQVksWUFBWTtZQUNoQixJQUFJUSxJQUFKLEdBQVdDLE9BQVgsRUFBUDtLQUREOzs7QUFNRGQsTUFBTWUsS0FBTixHQUFjLFVBQVVDLE1BQVYsRUFBa0I7O0tBRTNCQyxVQUFVRCxNQUFkO0tBQ0lFLGVBQWUsRUFBbkI7S0FDSUMsYUFBYSxFQUFqQjtLQUNJQyxxQkFBcUIsRUFBekI7S0FDSUMsWUFBWSxJQUFoQjtLQUNJQyxVQUFVLENBQWQ7S0FDSUMsZ0JBQUo7S0FDSUMsUUFBUSxLQUFaO0tBQ0lDLGFBQWEsS0FBakI7S0FDSUMsWUFBWSxLQUFoQjtLQUNJQyxhQUFhLENBQWpCO0tBQ0lDLGFBQWEsSUFBakI7S0FDSUMsa0JBQWtCN0IsTUFBTThCLE1BQU4sQ0FBYUMsTUFBYixDQUFvQkMsSUFBMUM7S0FDSUMseUJBQXlCakMsTUFBTWtDLGFBQU4sQ0FBb0JILE1BQWpEO0tBQ0lJLGlCQUFpQixFQUFyQjtLQUNJQyxtQkFBbUIsSUFBdkI7S0FDSUMsd0JBQXdCLEtBQTVCO0tBQ0lDLG9CQUFvQixJQUF4QjtLQUNJQyxzQkFBc0IsSUFBMUI7S0FDSUMsa0JBQWtCLElBQXRCOztNQUVLQyxFQUFMLEdBQVUsVUFBVUMsVUFBVixFQUFzQkMsUUFBdEIsRUFBZ0M7O2VBRTVCRCxVQUFiOztNQUVJQyxhQUFhN1YsU0FBakIsRUFBNEI7ZUFDZjZWLFFBQVo7OztTQUdNLElBQVA7RUFSRDs7TUFZS2hNLEtBQUwsR0FBYSxVQUFVd0osSUFBVixFQUFnQjs7UUFFdEJ5QyxHQUFOLENBQVUsSUFBVjs7ZUFFYSxJQUFiOzswQkFFd0IsS0FBeEI7O2VBRWF6QyxTQUFTclQsU0FBVCxHQUFxQnFULElBQXJCLEdBQTRCSCxNQUFNSyxHQUFOLEVBQXpDO2dCQUNjc0IsVUFBZDs7T0FFSyxJQUFJa0IsUUFBVCxJQUFxQjFCLFVBQXJCLEVBQWlDOzs7T0FHNUJBLFdBQVcwQixRQUFYLGFBQWdDM1osS0FBcEMsRUFBMkM7O1FBRXRDaVksV0FBVzBCLFFBQVgsRUFBcUJ6WSxNQUFyQixLQUFnQyxDQUFwQyxFQUF1Qzs7Ozs7ZUFLNUJ5WSxRQUFYLElBQXVCLENBQUM1QixRQUFRNEIsUUFBUixDQUFELEVBQW9CMUgsTUFBcEIsQ0FBMkJnRyxXQUFXMEIsUUFBWCxDQUEzQixDQUF2Qjs7Ozs7T0FNRzVCLFFBQVE0QixRQUFSLE1BQXNCL1YsU0FBMUIsRUFBcUM7Ozs7O2dCQUt4QitWLFFBQWIsSUFBeUI1QixRQUFRNEIsUUFBUixDQUF6Qjs7T0FFSzNCLGFBQWEyQixRQUFiLGFBQWtDM1osS0FBbkMsS0FBOEMsS0FBbEQsRUFBeUQ7aUJBQzNDMlosUUFBYixLQUEwQixHQUExQixDQUR3RDs7O3NCQUl0Q0EsUUFBbkIsSUFBK0IzQixhQUFhMkIsUUFBYixLQUEwQixDQUF6RDs7O1NBSU0sSUFBUDtFQTFDRDs7TUE4Q0tDLElBQUwsR0FBWSxZQUFZOztNQUVuQixDQUFDckIsVUFBTCxFQUFpQjtVQUNULElBQVA7OztRQUdLc0IsTUFBTixDQUFhLElBQWI7ZUFDYSxLQUFiOztNQUVJUCxvQkFBb0IsSUFBeEIsRUFBOEI7bUJBQ2I5WCxJQUFoQixDQUFxQnVXLE9BQXJCLEVBQThCQSxPQUE5Qjs7O09BR0krQixpQkFBTDtTQUNPLElBQVA7RUFkRDs7TUFrQktuTSxHQUFMLEdBQVcsWUFBWTs7T0FFakIySixNQUFMLENBQVlvQixhQUFhUCxTQUF6QjtTQUNPLElBQVA7RUFIRDs7TUFPSzJCLGlCQUFMLEdBQXlCLFlBQVk7O09BRS9CLElBQUkzWSxJQUFJLENBQVIsRUFBVzRZLG1CQUFtQmQsZUFBZS9YLE1BQWxELEVBQTBEQyxJQUFJNFksZ0JBQTlELEVBQWdGNVksR0FBaEYsRUFBcUY7a0JBQ3JFQSxDQUFmLEVBQWtCeVksSUFBbEI7O0VBSEY7O01BUUtJLEtBQUwsR0FBYSxVQUFVQyxNQUFWLEVBQWtCOztlQUVqQkEsTUFBYjtTQUNPLElBQVA7RUFIRDs7TUFPS0MsTUFBTCxHQUFjLFVBQVVDLEtBQVYsRUFBaUI7O1lBRXBCQSxLQUFWO1NBQ08sSUFBUDtFQUhEOztNQU9LQyxXQUFMLEdBQW1CLFVBQVVILE1BQVYsRUFBa0I7O3FCQUVqQkEsTUFBbkI7U0FDTyxJQUFQO0VBSEQ7O01BT0tJLElBQUwsR0FBWSxVQUFVQSxJQUFWLEVBQWdCOztVQUVuQkEsSUFBUjtTQUNPLElBQVA7RUFIRDs7TUFRS0MsTUFBTCxHQUFjLFVBQVVBLE1BQVYsRUFBa0I7O29CQUViQSxNQUFsQjtTQUNPLElBQVA7RUFIRDs7TUFPS0MsYUFBTCxHQUFxQixVQUFVQSxhQUFWLEVBQXlCOzsyQkFFcEJBLGFBQXpCO1NBQ08sSUFBUDtFQUhEOztNQU9LQyxLQUFMLEdBQWEsWUFBWTs7bUJBRVBwVyxTQUFqQjtTQUNPLElBQVA7RUFIRDs7TUFPS3FXLE9BQUwsR0FBZSxVQUFVQyxRQUFWLEVBQW9COztxQkFFZkEsUUFBbkI7U0FDTyxJQUFQO0VBSEQ7O01BT0tDLFFBQUwsR0FBZ0IsVUFBVUQsUUFBVixFQUFvQjs7c0JBRWZBLFFBQXBCO1NBQ08sSUFBUDtFQUhEOztNQU9LRSxVQUFMLEdBQWtCLFVBQVVGLFFBQVYsRUFBb0I7O3dCQUVmQSxRQUF0QjtTQUNPLElBQVA7RUFIRDs7TUFPS0csTUFBTCxHQUFjLFVBQVVILFFBQVYsRUFBb0I7O29CQUVmQSxRQUFsQjtTQUNPLElBQVA7RUFIRDs7TUFPS3BELE1BQUwsR0FBYyxVQUFVTCxJQUFWLEVBQWdCOztNQUV6QjBDLFFBQUo7TUFDSW1CLE9BQUo7TUFDSTdZLEtBQUo7O01BRUlnVixPQUFPeUIsVUFBWCxFQUF1QjtVQUNmLElBQVA7OztNQUdHUywwQkFBMEIsS0FBOUIsRUFBcUM7O09BRWhDRCxxQkFBcUIsSUFBekIsRUFBK0I7cUJBQ2IxWCxJQUFqQixDQUFzQnVXLE9BQXRCLEVBQStCQSxPQUEvQjs7OzJCQUd1QixJQUF4Qjs7O1lBR1MsQ0FBQ2QsT0FBT3lCLFVBQVIsSUFBc0JQLFNBQWhDO1lBQ1UyQyxVQUFVLENBQVYsR0FBYyxDQUFkLEdBQWtCQSxPQUE1Qjs7VUFFUW5DLGdCQUFnQm1DLE9BQWhCLENBQVI7O09BRUtuQixRQUFMLElBQWlCMUIsVUFBakIsRUFBNkI7OztPQUd4QkQsYUFBYTJCLFFBQWIsTUFBMkIvVixTQUEvQixFQUEwQzs7OztPQUl0QzZKLFFBQVF1SyxhQUFhMkIsUUFBYixLQUEwQixDQUF0QztPQUNJaE0sTUFBTXNLLFdBQVcwQixRQUFYLENBQVY7O09BRUloTSxlQUFlM04sS0FBbkIsRUFBMEI7O1lBRWpCMlosUUFBUixJQUFvQlosdUJBQXVCcEwsR0FBdkIsRUFBNEIxTCxLQUE1QixDQUFwQjtJQUZELE1BSU87OztRQUdGLE9BQVEwTCxHQUFSLEtBQWlCLFFBQXJCLEVBQStCOztTQUUxQkEsSUFBSW9OLE1BQUosQ0FBVyxDQUFYLE1BQWtCLEdBQWxCLElBQXlCcE4sSUFBSW9OLE1BQUosQ0FBVyxDQUFYLE1BQWtCLEdBQS9DLEVBQW9EO1lBQzdDdE4sUUFBUWpMLFdBQVdtTCxHQUFYLENBQWQ7TUFERCxNQUVPO1lBQ0FuTCxXQUFXbUwsR0FBWCxDQUFOOzs7OztRQUtFLE9BQVFBLEdBQVIsS0FBaUIsUUFBckIsRUFBK0I7YUFDdEJnTSxRQUFSLElBQW9CbE0sUUFBUSxDQUFDRSxNQUFNRixLQUFQLElBQWdCeEwsS0FBNUM7Ozs7O01BT0NtWCxzQkFBc0IsSUFBMUIsRUFBZ0M7cUJBQ2I1WCxJQUFsQixDQUF1QnVXLE9BQXZCLEVBQWdDOVYsS0FBaEM7OztNQUdHNlksWUFBWSxDQUFoQixFQUFtQjs7T0FFZDFDLFVBQVUsQ0FBZCxFQUFpQjs7UUFFWjlWLFNBQVM4VixPQUFULENBQUosRUFBdUI7Ozs7O1NBS2xCdUIsUUFBTCxJQUFpQnpCLGtCQUFqQixFQUFxQzs7U0FFaEMsT0FBUUQsV0FBVzBCLFFBQVgsQ0FBUixLQUFrQyxRQUF0QyxFQUFnRDt5QkFDNUJBLFFBQW5CLElBQStCekIsbUJBQW1CeUIsUUFBbkIsSUFBK0JuWCxXQUFXeVYsV0FBVzBCLFFBQVgsQ0FBWCxDQUE5RDs7O1NBR0dyQixLQUFKLEVBQVc7VUFDTjBDLE1BQU05QyxtQkFBbUJ5QixRQUFuQixDQUFWOzt5QkFFbUJBLFFBQW5CLElBQStCMUIsV0FBVzBCLFFBQVgsQ0FBL0I7aUJBQ1dBLFFBQVgsSUFBdUJxQixHQUF2Qjs7O2tCQUdZckIsUUFBYixJQUF5QnpCLG1CQUFtQnlCLFFBQW5CLENBQXpCOzs7UUFJR3JCLEtBQUosRUFBVztpQkFDRSxDQUFDRSxTQUFiOzs7UUFHR0gscUJBQXFCelUsU0FBekIsRUFBb0M7a0JBQ3RCcVQsT0FBT29CLGdCQUFwQjtLQURELE1BRU87a0JBQ09wQixPQUFPd0IsVUFBcEI7OztXQUdNLElBQVA7SUFsQ0QsTUFvQ087O1FBRUZZLHdCQUF3QixJQUE1QixFQUFrQzs7eUJBRWI3WCxJQUFwQixDQUF5QnVXLE9BQXpCLEVBQWtDQSxPQUFsQzs7O1NBR0ksSUFBSTVXLElBQUksQ0FBUixFQUFXNFksbUJBQW1CZCxlQUFlL1gsTUFBbEQsRUFBMERDLElBQUk0WSxnQkFBOUQsRUFBZ0Y1WSxHQUFoRixFQUFxRjs7O29CQUdyRUEsQ0FBZixFQUFrQnNNLEtBQWxCLENBQXdCaUwsYUFBYVAsU0FBckM7OztXQUdNLEtBQVA7Ozs7U0FNSyxJQUFQO0VBeEhEO0NBaE1EOztBQStUQXJCLE1BQU04QixNQUFOLEdBQWU7O1NBRU47O1FBRUQsVUFBVXFDLENBQVYsRUFBYTs7VUFFWEEsQ0FBUDs7O0VBTlk7O1lBWUg7O01BRU4sVUFBVUEsQ0FBVixFQUFhOztVQUVUQSxJQUFJQSxDQUFYO0dBSlM7O09BUUwsVUFBVUEsQ0FBVixFQUFhOztVQUVWQSxLQUFLLElBQUlBLENBQVQsQ0FBUDtHQVZTOztTQWNILFVBQVVBLENBQVYsRUFBYTs7T0FFZixDQUFDQSxLQUFLLENBQU4sSUFBVyxDQUFmLEVBQWtCO1dBQ1YsTUFBTUEsQ0FBTixHQUFVQSxDQUFqQjs7O1VBR00sQ0FBRSxHQUFGLElBQVMsRUFBRUEsQ0FBRixJQUFPQSxJQUFJLENBQVgsSUFBZ0IsQ0FBekIsQ0FBUDs7O0VBaENZOztRQXNDUDs7TUFFRixVQUFVQSxDQUFWLEVBQWE7O1VBRVRBLElBQUlBLENBQUosR0FBUUEsQ0FBZjtHQUpLOztPQVFELFVBQVVBLENBQVYsRUFBYTs7VUFFVixFQUFFQSxDQUFGLEdBQU1BLENBQU4sR0FBVUEsQ0FBVixHQUFjLENBQXJCO0dBVks7O1NBY0MsVUFBVUEsQ0FBVixFQUFhOztPQUVmLENBQUNBLEtBQUssQ0FBTixJQUFXLENBQWYsRUFBa0I7V0FDVixNQUFNQSxDQUFOLEdBQVVBLENBQVYsR0FBY0EsQ0FBckI7OztVQUdNLE9BQU8sQ0FBQ0EsS0FBSyxDQUFOLElBQVdBLENBQVgsR0FBZUEsQ0FBZixHQUFtQixDQUExQixDQUFQOzs7RUExRFk7O1VBZ0VMOztNQUVKLFVBQVVBLENBQVYsRUFBYTs7VUFFVEEsSUFBSUEsQ0FBSixHQUFRQSxDQUFSLEdBQVlBLENBQW5CO0dBSk87O09BUUgsVUFBVUEsQ0FBVixFQUFhOztVQUVWLElBQUssRUFBRUEsQ0FBRixHQUFNQSxDQUFOLEdBQVVBLENBQVYsR0FBY0EsQ0FBMUI7R0FWTzs7U0FjRCxVQUFVQSxDQUFWLEVBQWE7O09BRWYsQ0FBQ0EsS0FBSyxDQUFOLElBQVcsQ0FBZixFQUFrQjtXQUNWLE1BQU1BLENBQU4sR0FBVUEsQ0FBVixHQUFjQSxDQUFkLEdBQWtCQSxDQUF6Qjs7O1VBR00sQ0FBRSxHQUFGLElBQVMsQ0FBQ0EsS0FBSyxDQUFOLElBQVdBLENBQVgsR0FBZUEsQ0FBZixHQUFtQkEsQ0FBbkIsR0FBdUIsQ0FBaEMsQ0FBUDs7O0VBcEZZOztVQTBGTDs7TUFFSixVQUFVQSxDQUFWLEVBQWE7O1VBRVRBLElBQUlBLENBQUosR0FBUUEsQ0FBUixHQUFZQSxDQUFaLEdBQWdCQSxDQUF2QjtHQUpPOztPQVFILFVBQVVBLENBQVYsRUFBYTs7VUFFVixFQUFFQSxDQUFGLEdBQU1BLENBQU4sR0FBVUEsQ0FBVixHQUFjQSxDQUFkLEdBQWtCQSxDQUFsQixHQUFzQixDQUE3QjtHQVZPOztTQWNELFVBQVVBLENBQVYsRUFBYTs7T0FFZixDQUFDQSxLQUFLLENBQU4sSUFBVyxDQUFmLEVBQWtCO1dBQ1YsTUFBTUEsQ0FBTixHQUFVQSxDQUFWLEdBQWNBLENBQWQsR0FBa0JBLENBQWxCLEdBQXNCQSxDQUE3Qjs7O1VBR00sT0FBTyxDQUFDQSxLQUFLLENBQU4sSUFBV0EsQ0FBWCxHQUFlQSxDQUFmLEdBQW1CQSxDQUFuQixHQUF1QkEsQ0FBdkIsR0FBMkIsQ0FBbEMsQ0FBUDs7O0VBOUdZOzthQW9IRjs7TUFFUCxVQUFVQSxDQUFWLEVBQWE7O1VBRVQsSUFBSTlYLEtBQUsyTyxHQUFMLENBQVNtSixJQUFJOVgsS0FBSzZPLEVBQVQsR0FBYyxDQUF2QixDQUFYO0dBSlU7O09BUU4sVUFBVWlKLENBQVYsRUFBYTs7VUFFVjlYLEtBQUs0TyxHQUFMLENBQVNrSixJQUFJOVgsS0FBSzZPLEVBQVQsR0FBYyxDQUF2QixDQUFQO0dBVlU7O1NBY0osVUFBVWlKLENBQVYsRUFBYTs7VUFFWixPQUFPLElBQUk5WCxLQUFLMk8sR0FBTCxDQUFTM08sS0FBSzZPLEVBQUwsR0FBVWlKLENBQW5CLENBQVgsQ0FBUDs7O0VBcElZOztjQTBJRDs7TUFFUixVQUFVQSxDQUFWLEVBQWE7O1VBRVRBLE1BQU0sQ0FBTixHQUFVLENBQVYsR0FBYzlYLEtBQUsrWCxHQUFMLENBQVMsSUFBVCxFQUFlRCxJQUFJLENBQW5CLENBQXJCO0dBSlc7O09BUVAsVUFBVUEsQ0FBVixFQUFhOztVQUVWQSxNQUFNLENBQU4sR0FBVSxDQUFWLEdBQWMsSUFBSTlYLEtBQUsrWCxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUUsRUFBRixHQUFPRCxDQUFuQixDQUF6QjtHQVZXOztTQWNMLFVBQVVBLENBQVYsRUFBYTs7T0FFZkEsTUFBTSxDQUFWLEVBQWE7V0FDTCxDQUFQOzs7T0FHR0EsTUFBTSxDQUFWLEVBQWE7V0FDTCxDQUFQOzs7T0FHRyxDQUFDQSxLQUFLLENBQU4sSUFBVyxDQUFmLEVBQWtCO1dBQ1YsTUFBTTlYLEtBQUsrWCxHQUFMLENBQVMsSUFBVCxFQUFlRCxJQUFJLENBQW5CLENBQWI7OztVQUdNLE9BQU8sQ0FBRTlYLEtBQUsrWCxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUUsRUFBRixJQUFRRCxJQUFJLENBQVosQ0FBWixDQUFGLEdBQWdDLENBQXZDLENBQVA7OztFQXRLWTs7V0E0S0o7O01BRUwsVUFBVUEsQ0FBVixFQUFhOztVQUVULElBQUk5WCxLQUFLZ1ksSUFBTCxDQUFVLElBQUlGLElBQUlBLENBQWxCLENBQVg7R0FKUTs7T0FRSixVQUFVQSxDQUFWLEVBQWE7O1VBRVY5WCxLQUFLZ1ksSUFBTCxDQUFVLElBQUssRUFBRUYsQ0FBRixHQUFNQSxDQUFyQixDQUFQO0dBVlE7O1NBY0YsVUFBVUEsQ0FBVixFQUFhOztPQUVmLENBQUNBLEtBQUssQ0FBTixJQUFXLENBQWYsRUFBa0I7V0FDVixDQUFFLEdBQUYsSUFBUzlYLEtBQUtnWSxJQUFMLENBQVUsSUFBSUYsSUFBSUEsQ0FBbEIsSUFBdUIsQ0FBaEMsQ0FBUDs7O1VBR00sT0FBTzlYLEtBQUtnWSxJQUFMLENBQVUsSUFBSSxDQUFDRixLQUFLLENBQU4sSUFBV0EsQ0FBekIsSUFBOEIsQ0FBckMsQ0FBUDs7O0VBaE1ZOztVQXNNTDs7TUFFSixVQUFVQSxDQUFWLEVBQWE7O09BRVpBLE1BQU0sQ0FBVixFQUFhO1dBQ0wsQ0FBUDs7O09BR0dBLE1BQU0sQ0FBVixFQUFhO1dBQ0wsQ0FBUDs7O1VBR00sQ0FBQzlYLEtBQUsrWCxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU1ELElBQUksQ0FBVixDQUFaLENBQUQsR0FBNkI5WCxLQUFLNE8sR0FBTCxDQUFTLENBQUNrSixJQUFJLEdBQUwsSUFBWSxDQUFaLEdBQWdCOVgsS0FBSzZPLEVBQTlCLENBQXBDO0dBWk87O09BZ0JILFVBQVVpSixDQUFWLEVBQWE7O09BRWJBLE1BQU0sQ0FBVixFQUFhO1dBQ0wsQ0FBUDs7O09BR0dBLE1BQU0sQ0FBVixFQUFhO1dBQ0wsQ0FBUDs7O1VBR005WCxLQUFLK1gsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFDLEVBQUQsR0FBTUQsQ0FBbEIsSUFBdUI5WCxLQUFLNE8sR0FBTCxDQUFTLENBQUNrSixJQUFJLEdBQUwsSUFBWSxDQUFaLEdBQWdCOVgsS0FBSzZPLEVBQTlCLENBQXZCLEdBQTJELENBQWxFO0dBMUJPOztTQThCRCxVQUFVaUosQ0FBVixFQUFhOztPQUVmQSxNQUFNLENBQVYsRUFBYTtXQUNMLENBQVA7OztPQUdHQSxNQUFNLENBQVYsRUFBYTtXQUNMLENBQVA7OztRQUdJLENBQUw7O09BRUlBLElBQUksQ0FBUixFQUFXO1dBQ0gsQ0FBQyxHQUFELEdBQU85WCxLQUFLK1gsR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNRCxJQUFJLENBQVYsQ0FBWixDQUFQLEdBQW1DOVgsS0FBSzRPLEdBQUwsQ0FBUyxDQUFDa0osSUFBSSxHQUFMLElBQVksQ0FBWixHQUFnQjlYLEtBQUs2TyxFQUE5QixDQUExQzs7O1VBR00sTUFBTTdPLEtBQUsrWCxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMsRUFBRCxJQUFPRCxJQUFJLENBQVgsQ0FBWixDQUFOLEdBQW1DOVgsS0FBSzRPLEdBQUwsQ0FBUyxDQUFDa0osSUFBSSxHQUFMLElBQVksQ0FBWixHQUFnQjlYLEtBQUs2TyxFQUE5QixDQUFuQyxHQUF1RSxDQUE5RTs7O0VBcFBZOztPQTBQUjs7TUFFRCxVQUFVaUosQ0FBVixFQUFhOztPQUVaM1YsSUFBSSxPQUFSOztVQUVPMlYsSUFBSUEsQ0FBSixJQUFTLENBQUMzVixJQUFJLENBQUwsSUFBVTJWLENBQVYsR0FBYzNWLENBQXZCLENBQVA7R0FOSTs7T0FVQSxVQUFVMlYsQ0FBVixFQUFhOztPQUViM1YsSUFBSSxPQUFSOztVQUVPLEVBQUUyVixDQUFGLEdBQU1BLENBQU4sSUFBVyxDQUFDM1YsSUFBSSxDQUFMLElBQVUyVixDQUFWLEdBQWMzVixDQUF6QixJQUE4QixDQUFyQztHQWRJOztTQWtCRSxVQUFVMlYsQ0FBVixFQUFhOztPQUVmM1YsSUFBSSxVQUFVLEtBQWxCOztPQUVJLENBQUMyVixLQUFLLENBQU4sSUFBVyxDQUFmLEVBQWtCO1dBQ1YsT0FBT0EsSUFBSUEsQ0FBSixJQUFTLENBQUMzVixJQUFJLENBQUwsSUFBVTJWLENBQVYsR0FBYzNWLENBQXZCLENBQVAsQ0FBUDs7O1VBR00sT0FBTyxDQUFDMlYsS0FBSyxDQUFOLElBQVdBLENBQVgsSUFBZ0IsQ0FBQzNWLElBQUksQ0FBTCxJQUFVMlYsQ0FBVixHQUFjM1YsQ0FBOUIsSUFBbUMsQ0FBMUMsQ0FBUDs7O0VBcFJZOztTQTBSTjs7TUFFSCxVQUFVMlYsQ0FBVixFQUFhOztVQUVULElBQUluRSxNQUFNOEIsTUFBTixDQUFhd0MsTUFBYixDQUFvQkMsR0FBcEIsQ0FBd0IsSUFBSUosQ0FBNUIsQ0FBWDtHQUpNOztPQVFGLFVBQVVBLENBQVYsRUFBYTs7T0FFYkEsSUFBSyxJQUFJLElBQWIsRUFBb0I7V0FDWixTQUFTQSxDQUFULEdBQWFBLENBQXBCO0lBREQsTUFFTyxJQUFJQSxJQUFLLElBQUksSUFBYixFQUFvQjtXQUNuQixVQUFVQSxLQUFNLE1BQU0sSUFBdEIsSUFBK0JBLENBQS9CLEdBQW1DLElBQTFDO0lBRE0sTUFFQSxJQUFJQSxJQUFLLE1BQU0sSUFBZixFQUFzQjtXQUNyQixVQUFVQSxLQUFNLE9BQU8sSUFBdkIsSUFBZ0NBLENBQWhDLEdBQW9DLE1BQTNDO0lBRE0sTUFFQTtXQUNDLFVBQVVBLEtBQU0sUUFBUSxJQUF4QixJQUFpQ0EsQ0FBakMsR0FBcUMsUUFBNUM7O0dBakJLOztTQXNCQSxVQUFVQSxDQUFWLEVBQWE7O09BRWZBLElBQUksR0FBUixFQUFhO1dBQ0xuRSxNQUFNOEIsTUFBTixDQUFhd0MsTUFBYixDQUFvQkUsRUFBcEIsQ0FBdUJMLElBQUksQ0FBM0IsSUFBZ0MsR0FBdkM7OztVQUdNbkUsTUFBTThCLE1BQU4sQ0FBYXdDLE1BQWIsQ0FBb0JDLEdBQXBCLENBQXdCSixJQUFJLENBQUosR0FBUSxDQUFoQyxJQUFxQyxHQUFyQyxHQUEyQyxHQUFsRDs7Ozs7Q0F0VEg7O0FBOFRBbkUsTUFBTWtDLGFBQU4sR0FBc0I7O1NBRWIsVUFBVXRHLENBQVYsRUFBYXVJLENBQWIsRUFBZ0I7O01BRW5CTSxJQUFJN0ksRUFBRXhSLE1BQUYsR0FBVyxDQUFuQjtNQUNJc2EsSUFBSUQsSUFBSU4sQ0FBWjtNQUNJOVosSUFBSWdDLEtBQUtzWSxLQUFMLENBQVdELENBQVgsQ0FBUjtNQUNJaFUsS0FBS3NQLE1BQU1rQyxhQUFOLENBQW9CelUsS0FBcEIsQ0FBMEJzVSxNQUFuQzs7TUFFSW9DLElBQUksQ0FBUixFQUFXO1VBQ0h6VCxHQUFHa0wsRUFBRSxDQUFGLENBQUgsRUFBU0EsRUFBRSxDQUFGLENBQVQsRUFBZThJLENBQWYsQ0FBUDs7O01BR0dQLElBQUksQ0FBUixFQUFXO1VBQ0h6VCxHQUFHa0wsRUFBRTZJLENBQUYsQ0FBSCxFQUFTN0ksRUFBRTZJLElBQUksQ0FBTixDQUFULEVBQW1CQSxJQUFJQyxDQUF2QixDQUFQOzs7U0FHTWhVLEdBQUdrTCxFQUFFdlIsQ0FBRixDQUFILEVBQVN1UixFQUFFdlIsSUFBSSxDQUFKLEdBQVFvYSxDQUFSLEdBQVlBLENBQVosR0FBZ0JwYSxJQUFJLENBQXRCLENBQVQsRUFBbUNxYSxJQUFJcmEsQ0FBdkMsQ0FBUDtFQWpCb0I7O1NBcUJiLFVBQVV1UixDQUFWLEVBQWF1SSxDQUFiLEVBQWdCOztNQUVuQjVKLElBQUksQ0FBUjtNQUNJd0YsSUFBSW5FLEVBQUV4UixNQUFGLEdBQVcsQ0FBbkI7TUFDSXdhLEtBQUt2WSxLQUFLK1gsR0FBZDtNQUNJUyxLQUFLN0UsTUFBTWtDLGFBQU4sQ0FBb0J6VSxLQUFwQixDQUEwQnFYLFNBQW5DOztPQUVLLElBQUl6YSxJQUFJLENBQWIsRUFBZ0JBLEtBQUswVixDQUFyQixFQUF3QjFWLEdBQXhCLEVBQTZCO1FBQ3ZCdWEsR0FBRyxJQUFJVCxDQUFQLEVBQVVwRSxJQUFJMVYsQ0FBZCxJQUFtQnVhLEdBQUdULENBQUgsRUFBTTlaLENBQU4sQ0FBbkIsR0FBOEJ1UixFQUFFdlIsQ0FBRixDQUE5QixHQUFxQ3dhLEdBQUc5RSxDQUFILEVBQU0xVixDQUFOLENBQTFDOzs7U0FHTWtRLENBQVA7RUFoQ29COzthQW9DVCxVQUFVcUIsQ0FBVixFQUFhdUksQ0FBYixFQUFnQjs7TUFFdkJNLElBQUk3SSxFQUFFeFIsTUFBRixHQUFXLENBQW5CO01BQ0lzYSxJQUFJRCxJQUFJTixDQUFaO01BQ0k5WixJQUFJZ0MsS0FBS3NZLEtBQUwsQ0FBV0QsQ0FBWCxDQUFSO01BQ0loVSxLQUFLc1AsTUFBTWtDLGFBQU4sQ0FBb0J6VSxLQUFwQixDQUEwQnNYLFVBQW5DOztNQUVJbkosRUFBRSxDQUFGLE1BQVNBLEVBQUU2SSxDQUFGLENBQWIsRUFBbUI7O09BRWROLElBQUksQ0FBUixFQUFXO1FBQ045WCxLQUFLc1ksS0FBTCxDQUFXRCxJQUFJRCxLQUFLLElBQUlOLENBQVQsQ0FBZixDQUFKOzs7VUFHTXpULEdBQUdrTCxFQUFFLENBQUN2UixJQUFJLENBQUosR0FBUW9hLENBQVQsSUFBY0EsQ0FBaEIsQ0FBSCxFQUF1QjdJLEVBQUV2UixDQUFGLENBQXZCLEVBQTZCdVIsRUFBRSxDQUFDdlIsSUFBSSxDQUFMLElBQVVvYSxDQUFaLENBQTdCLEVBQTZDN0ksRUFBRSxDQUFDdlIsSUFBSSxDQUFMLElBQVVvYSxDQUFaLENBQTdDLEVBQTZEQyxJQUFJcmEsQ0FBakUsQ0FBUDtHQU5ELE1BUU87O09BRUY4WixJQUFJLENBQVIsRUFBVztXQUNIdkksRUFBRSxDQUFGLEtBQVFsTCxHQUFHa0wsRUFBRSxDQUFGLENBQUgsRUFBU0EsRUFBRSxDQUFGLENBQVQsRUFBZUEsRUFBRSxDQUFGLENBQWYsRUFBcUJBLEVBQUUsQ0FBRixDQUFyQixFQUEyQixDQUFDOEksQ0FBNUIsSUFBaUM5SSxFQUFFLENBQUYsQ0FBekMsQ0FBUDs7O09BR0d1SSxJQUFJLENBQVIsRUFBVztXQUNIdkksRUFBRTZJLENBQUYsS0FBUS9ULEdBQUdrTCxFQUFFNkksQ0FBRixDQUFILEVBQVM3SSxFQUFFNkksQ0FBRixDQUFULEVBQWU3SSxFQUFFNkksSUFBSSxDQUFOLENBQWYsRUFBeUI3SSxFQUFFNkksSUFBSSxDQUFOLENBQXpCLEVBQW1DQyxJQUFJRCxDQUF2QyxJQUE0QzdJLEVBQUU2SSxDQUFGLENBQXBELENBQVA7OztVQUdNL1QsR0FBR2tMLEVBQUV2UixJQUFJQSxJQUFJLENBQVIsR0FBWSxDQUFkLENBQUgsRUFBcUJ1UixFQUFFdlIsQ0FBRixDQUFyQixFQUEyQnVSLEVBQUU2SSxJQUFJcGEsSUFBSSxDQUFSLEdBQVlvYSxDQUFaLEdBQWdCcGEsSUFBSSxDQUF0QixDQUEzQixFQUFxRHVSLEVBQUU2SSxJQUFJcGEsSUFBSSxDQUFSLEdBQVlvYSxDQUFaLEdBQWdCcGEsSUFBSSxDQUF0QixDQUFyRCxFQUErRXFhLElBQUlyYSxDQUFuRixDQUFQOztFQTdEbUI7O1FBbUVkOztVQUVFLFVBQVUyYSxFQUFWLEVBQWNDLEVBQWQsRUFBa0JDLENBQWxCLEVBQXFCOztVQUVyQixDQUFDRCxLQUFLRCxFQUFOLElBQVlFLENBQVosR0FBZ0JGLEVBQXZCO0dBSks7O2FBUUssVUFBVWpGLENBQVYsRUFBYTFWLENBQWIsRUFBZ0I7O09BRXRCOGEsS0FBS25GLE1BQU1rQyxhQUFOLENBQW9CelUsS0FBcEIsQ0FBMEIyWCxTQUFuQzs7VUFFT0QsR0FBR3BGLENBQUgsSUFBUW9GLEdBQUc5YSxDQUFILENBQVIsR0FBZ0I4YSxHQUFHcEYsSUFBSTFWLENBQVAsQ0FBdkI7R0FaSzs7YUFnQk0sWUFBWTs7T0FFbkJpUSxJQUFJLENBQUMsQ0FBRCxDQUFSOztVQUVPLFVBQVV5RixDQUFWLEVBQWE7O1FBRWZ2UixJQUFJLENBQVI7O1FBRUk4TCxFQUFFeUYsQ0FBRixDQUFKLEVBQVU7WUFDRnpGLEVBQUV5RixDQUFGLENBQVA7OztTQUdJLElBQUkxVixJQUFJMFYsQ0FBYixFQUFnQjFWLElBQUksQ0FBcEIsRUFBdUJBLEdBQXZCLEVBQTRCO1VBQ3RCQSxDQUFMOzs7TUFHQzBWLENBQUYsSUFBT3ZSLENBQVA7V0FDT0EsQ0FBUDtJQWJEO0dBSlUsRUFoQkw7O2NBdUNNLFVBQVV3VyxFQUFWLEVBQWNDLEVBQWQsRUFBa0JJLEVBQWxCLEVBQXNCQyxFQUF0QixFQUEwQkosQ0FBMUIsRUFBNkI7O09BRXBDSyxLQUFLLENBQUNGLEtBQUtMLEVBQU4sSUFBWSxHQUFyQjtPQUNJUSxLQUFLLENBQUNGLEtBQUtMLEVBQU4sSUFBWSxHQUFyQjtPQUNJUSxLQUFLUCxJQUFJQSxDQUFiO09BQ0lRLEtBQUtSLElBQUlPLEVBQWI7O1VBRU8sQ0FBQyxJQUFJUixFQUFKLEdBQVMsSUFBSUksRUFBYixHQUFrQkUsRUFBbEIsR0FBdUJDLEVBQXhCLElBQThCRSxFQUE5QixHQUFtQyxDQUFDLENBQUUsQ0FBRixHQUFNVCxFQUFOLEdBQVcsSUFBSUksRUFBZixHQUFvQixJQUFJRSxFQUF4QixHQUE2QkMsRUFBOUIsSUFBb0NDLEVBQXZFLEdBQTRFRixLQUFLTCxDQUFqRixHQUFxRkQsRUFBNUY7Ozs7O0NBakhILENBeUhBOztBQzcyQkE7OztBQUdBLElBQUlVLFdBQVcsQ0FBZjtBQUNBLElBQUlDLFVBQVUsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLFFBQWQsRUFBd0IsR0FBeEIsQ0FBZDtBQUNBLEtBQUssSUFBSW5XLElBQUksQ0FBYixFQUFnQkEsSUFBSW1XLFFBQVF4YixNQUFaLElBQXNCLENBQUNxQyxPQUFPb1oscUJBQTlDLEVBQXFFLEVBQUVwVyxDQUF2RSxFQUEwRTtXQUMvRG9XLHFCQUFQLEdBQStCcFosT0FBT21aLFFBQVFuVyxDQUFSLElBQWEsdUJBQXBCLENBQS9CO1dBQ09xVyxvQkFBUCxHQUE4QnJaLE9BQU9tWixRQUFRblcsQ0FBUixJQUFhLHNCQUFwQixLQUErQ2hELE9BQU9tWixRQUFRblcsQ0FBUixJQUFhLDZCQUFwQixDQUE3RTs7QUFFSixJQUFJLENBQUNoRCxPQUFPb1oscUJBQVosRUFBbUM7V0FDeEJBLHFCQUFQLEdBQStCLFVBQVNqQyxRQUFULEVBQW1CbUMsT0FBbkIsRUFBNEI7WUFDbkRDLFdBQVcsSUFBSW5GLElBQUosR0FBV0MsT0FBWCxFQUFmO1lBQ0ltRixhQUFhNVosS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNMFosV0FBV0wsUUFBakIsQ0FBWixDQUFqQjtZQUNJcFQsS0FBSzlGLE9BQU95WixVQUFQLENBQWtCLFlBQVc7cUJBQ3JCRixXQUFXQyxVQUFwQjtTQURDLEVBR0xBLFVBSEssQ0FBVDttQkFJV0QsV0FBV0MsVUFBdEI7ZUFDTzFULEVBQVA7S0FSSjs7QUFXSixJQUFJLENBQUM5RixPQUFPcVosb0JBQVosRUFBa0M7V0FDdkJBLG9CQUFQLEdBQThCLFVBQVN2VCxFQUFULEVBQWE7cUJBQzFCQSxFQUFiO0tBREo7Ozs7QUFNSixJQUFJNFQsWUFBWSxFQUFoQjtBQUNBLElBQUlDLGNBQWMsSUFBbEI7O0FBRUEsU0FBU0MscUJBQVQsR0FBZ0M7UUFDeEIsQ0FBQ0QsV0FBTCxFQUFrQjtzQkFDQVAsc0JBQXNCLFlBQVc7OztrQkFHckNyRixNQUFOLEdBSDJDOztnQkFLdkM4RixlQUFlSCxTQUFuQjt3QkFDWSxFQUFaOzBCQUNjLElBQWQ7bUJBQ09HLGFBQWFsYyxNQUFiLEdBQXNCLENBQTdCLEVBQWdDOzZCQUNmd1YsS0FBYixHQUFxQjJHLElBQXJCOztTQVRNLENBQWQ7O1dBYUdILFdBQVA7Ozs7Ozs7QUFPSixTQUFTSSxXQUFULENBQXNCQyxNQUF0QixFQUErQjtRQUN2QixDQUFDQSxNQUFMLEVBQWE7OztjQUdIaGMsSUFBVixDQUFlZ2MsTUFBZjtXQUNPSix1QkFBUDs7Ozs7O0FBTUosU0FBU0ssWUFBVCxDQUF1QkQsTUFBdkIsRUFBZ0M7UUFDeEJFLFdBQVcsS0FBZjtTQUNLLElBQUl0YyxJQUFJLENBQVIsRUFBV2tVLElBQUk0SCxVQUFVL2IsTUFBOUIsRUFBc0NDLElBQUlrVSxDQUExQyxFQUE2Q2xVLEdBQTdDLEVBQWtEO1lBQzFDOGIsVUFBVTliLENBQVYsRUFBYWtJLEVBQWIsS0FBb0JrVSxPQUFPbFUsRUFBL0IsRUFBbUM7dUJBQ3BCLElBQVg7c0JBQ1VzRyxNQUFWLENBQWlCeE8sQ0FBakIsRUFBb0IsQ0FBcEI7Ozs7O1FBS0o4YixVQUFVL2IsTUFBVixJQUFvQixDQUF4QixFQUEyQjs2QkFDRmdjLFdBQXJCO3NCQUNjLElBQWQ7O1dBRUdPLFFBQVA7Ozs7Ozs7QUFRSixTQUFTQyxXQUFULENBQXFCNVosT0FBckIsRUFBOEI7UUFDdEJpQyxNQUFNbEcsSUFBRWdFLE1BQUYsQ0FBUztjQUNULElBRFM7WUFFWCxJQUZXO2tCQUdMLEdBSEs7aUJBSU4sWUFBVSxFQUpKO2tCQUtMLFlBQVcsRUFMTjtvQkFNSCxZQUFXLEVBTlI7Z0JBT1AsWUFBVSxFQVBIO2dCQVFQLENBUk87ZUFTUixDQVRRO2dCQVVQLGFBVk87Y0FXVCxFQVhTO0tBQVQsRUFZUEMsT0FaTyxDQUFWOztRQWNJa1QsUUFBUSxFQUFaO1FBQ0kyRyxNQUFNLFdBQVdwWixNQUFNSyxNQUFOLEVBQXJCO1FBQ0l5RSxFQUFKLEtBQVlzVSxNQUFNQSxNQUFJLEdBQUosR0FBUTVYLElBQUlzRCxFQUE5Qjs7UUFFSXRELElBQUk2WCxJQUFKLElBQVk3WCxJQUFJd1QsRUFBcEIsRUFBd0I7Z0JBQ1osSUFBSTFCLE1BQU1BLEtBQVYsQ0FBaUI5UixJQUFJNlgsSUFBckIsRUFDUHJFLEVBRE8sQ0FDSHhULElBQUl3VCxFQURELEVBQ0t4VCxJQUFJMFQsUUFEVCxFQUVQZ0IsT0FGTyxDQUVDLFlBQVU7Z0JBQ1hBLE9BQUosQ0FBWXhKLEtBQVosQ0FBbUIsSUFBbkI7U0FISSxFQUtQMEosUUFMTyxDQUtHLFlBQVU7Z0JBQ2JBLFFBQUosQ0FBYTFKLEtBQWIsQ0FBb0IsSUFBcEI7U0FOSSxFQVFQMkosVUFSTyxDQVFLLFlBQVc7eUJBQ1A7b0JBQ0wrQzthQURSO2tCQUdNRSxhQUFOLEdBQXNCLElBQXRCO2dCQUNJakQsVUFBSixDQUFlM0osS0FBZixDQUFzQixJQUF0QixFQUE2QixDQUFDLElBQUQsQ0FBN0IsRUFMb0I7U0FSaEIsRUFlUDRKLE1BZk8sQ0FlQyxZQUFVO3lCQUNGO29CQUNMOEM7YUFEUjtrQkFHTUcsU0FBTixHQUFrQixJQUFsQjtnQkFDSWpELE1BQUosQ0FBVzVKLEtBQVgsQ0FBa0IsSUFBbEIsRUFBeUIsQ0FBQyxJQUFELENBQXpCO1NBcEJJLEVBc0JQaUosTUF0Qk8sQ0FzQkNuVSxJQUFJbVUsTUF0QkwsRUF1QlBGLEtBdkJPLENBdUJBalUsSUFBSWlVLEtBdkJKLEVBd0JQTSxNQXhCTyxDQXdCQ3pDLE1BQU1lLE1BQU4sQ0FBYTdTLElBQUl1VSxNQUFKLENBQVdoTCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLENBQXRCLENBQWIsRUFBdUN2SixJQUFJdVUsTUFBSixDQUFXaEwsS0FBWCxDQUFpQixHQUFqQixFQUFzQixDQUF0QixDQUF2QyxDQXhCRCxDQUFSOztjQTBCTWpHLEVBQU4sR0FBV3NVLEdBQVg7Y0FDTWxRLEtBQU47O2lCQUVTc1EsT0FBVCxHQUFtQjs7Z0JBRVYvRyxNQUFNNkcsYUFBTixJQUF1QjdHLE1BQU04RyxTQUFsQyxFQUE4Qzt3QkFDbEMsSUFBUjs7O3dCQUdRO29CQUNKSCxHQURJO3NCQUVGSSxPQUZFO3NCQUdGaFksSUFBSWlZLElBSEY7dUJBSURoSDthQUpYOzs7O1dBVURBLEtBQVA7Ozs7OztBQU1KLFNBQVNpSCxZQUFULENBQXNCakgsS0FBdEIsRUFBOEJrSCxHQUE5QixFQUFtQztVQUN6QnRFLElBQU47OztBQUdKLHFCQUFlO2lCQUNFMEQsV0FERjtrQkFFR0UsWUFGSDtpQkFHRUUsV0FIRjtrQkFJR087Q0FKbEI7O0FDcktBOzs7Ozs7OztBQVFBLEFBRUE7QUFDQSxJQUFJRSxhQUFhO2tCQUNFLENBREY7Y0FFRSxDQUZGO2FBR0UsQ0FIRjtjQUlFLENBSkY7aUJBS0UsQ0FMRjtjQU1FLENBTkY7O2VBUUUsQ0FSRjtDQUFqQjs7QUFXQSxTQUFTQyxPQUFULENBQWlCQyxLQUFqQixFQUF3QkMsS0FBeEIsRUFBK0JDLFNBQS9CLEVBQTBDOztRQUVsQ0MsbUJBQWlCLElBQXJCOztRQUVJQyxZQUFZSixNQUFNSyxVQUF0Qjs7YUFDYSxFQURiOztpQkFFaUIsRUFGakI7O2dCQUdnQjdlLElBQUVrQixJQUFGLENBQVFvZCxVQUFSLENBSGhCLENBSnNDOztZQVMxQkcsU0FBUyxFQUFqQixDQVRrQztnQkFVdEJDLGFBQWEsRUFBekIsQ0FWa0M7Z0JBV3RCMWUsSUFBRWdCLE9BQUYsQ0FBVTRkLFNBQVYsSUFBdUJBLFVBQVV4TSxNQUFWLENBQWlCME0sU0FBakIsQ0FBdkIsR0FBcURBLFNBQWpFOzthQUVLQyxJQUFULENBQWN4YyxJQUFkLEVBQW9CeWMsR0FBcEIsRUFBeUI7WUFDaEIsQ0FBQ1YsV0FBVy9iLElBQVgsQ0FBRCxJQUFzQitiLFdBQVcvYixJQUFYLEtBQW9CQSxLQUFLMlksTUFBTCxDQUFZLENBQVosTUFBbUIsR0FBbEUsRUFBeUU7a0JBQy9EM1ksSUFBTixJQUFjeWMsR0FBZDs7WUFFQUMsWUFBWSxPQUFPRCxHQUF2QjtZQUNJQyxjQUFjLFVBQWxCLEVBQThCO2dCQUN2QixDQUFDWCxXQUFXL2IsSUFBWCxDQUFKLEVBQXFCOzBCQUNUYixJQUFWLENBQWVhLElBQWYsRUFEbUI7O1NBRHpCLE1BSU87Z0JBQ0N2QyxJQUFFYyxPQUFGLENBQVU4ZCxTQUFWLEVBQW9CcmMsSUFBcEIsTUFBOEIsQ0FBQyxDQUEvQixJQUFxQ0EsS0FBSzJZLE1BQUwsQ0FBWSxDQUFaLE1BQW1CLEdBQW5CLElBQTBCLENBQUN3RCxVQUFVbmMsSUFBVixDQUFwRSxFQUFzRjt1QkFDM0V1YyxVQUFVcGQsSUFBVixDQUFlYSxJQUFmLENBQVA7O2dCQUVBMmMsV0FBVyxVQUFTQyxHQUFULEVBQWM7O29CQUNyQi9jLFFBQVE4YyxTQUFTOWMsS0FBckI7b0JBQTRCZ2QsV0FBV2hkLEtBQXZDO29CQUE4Q2lkLFlBQTlDOztvQkFFSTlhLFVBQVVsRCxNQUFkLEVBQXNCOzs7d0JBR2RpZSxVQUFVLE9BQU9ILEdBQXJCOzt3QkFFSVIsZ0JBQUosRUFBc0I7K0JBQUE7O3dCQUdsQnZjLFVBQVUrYyxHQUFkLEVBQW1COzRCQUNYQSxPQUFPRyxZQUFZLFFBQW5CLElBQ0EsRUFBRUgsZUFBZWhmLEtBQWpCLENBREEsSUFFQSxDQUFDZ2YsSUFBSUksWUFGVDswQkFHRTt3Q0FDVUosSUFBSUssTUFBSixHQUFhTCxHQUFiLEdBQW1CWixRQUFRWSxHQUFSLEVBQWNBLEdBQWQsQ0FBM0I7K0NBQ2UvYyxNQUFNb2QsTUFBckI7NkJBTEosTUFNTzs7Ozs7b0NBSVNMLEdBQVI7OztpQ0FHQy9jLEtBQVQsR0FBaUJBLEtBQWpCOzhCQUNNRyxJQUFOLElBQWM4YyxlQUFlQSxZQUFmLEdBQThCamQsS0FBNUMsQ0FmZTs0QkFnQlgsQ0FBQ2lkLFlBQUwsRUFBbUI7bUNBQ1JJLEtBQVAsSUFBZ0JDLE9BQU9ELEtBQVAsQ0FBYWxkLElBQWIsRUFBbUJILEtBQW5CLEVBQTBCZ2QsUUFBMUIsQ0FBaEI7OzRCQUVESCxhQUFhSyxPQUFoQixFQUF3Qjs7O3dDQUdSQSxPQUFaOzs0QkFFQUssZ0JBQWdCRCxNQUFwQjs7NEJBRUssQ0FBQ0EsT0FBT0UsTUFBYixFQUFzQjttQ0FDYkQsY0FBY0UsT0FBckIsRUFBOEI7Z0RBQ1hGLGNBQWNFLE9BQTlCOzs7NEJBR0FGLGNBQWNDLE1BQW5CLEVBQTRCOzBDQUNaQSxNQUFkLENBQXFCamUsSUFBckIsQ0FBMEJnZSxhQUExQixFQUEwQ3BkLElBQTFDLEVBQWdESCxLQUFoRCxFQUF1RGdkLFFBQXZEOzs7aUJBeENWLE1BMkNPOzs7O3dCQUlFaGQsU0FBVTZjLGNBQWMsUUFBeEIsSUFDQyxFQUFFN2MsaUJBQWlCakMsS0FBbkIsQ0FERCxJQUVDLENBQUNpQyxNQUFNb2QsTUFGUixJQUdDLENBQUNwZCxNQUFNbWQsWUFIYixFQUcyQjs7OEJBRWpCTSxPQUFOLEdBQWdCSCxNQUFoQjtnQ0FDUW5CLFFBQVFuYyxLQUFSLEVBQWdCQSxLQUFoQixDQUFSOzs7aUNBR1NBLEtBQVQsR0FBaUJBLEtBQWpCOzsyQkFFR0EsS0FBUDs7YUE3RFI7cUJBZ0VTQSxLQUFULEdBQWlCNGMsR0FBakI7O3VCQUVXemMsSUFBWCxJQUFtQjtxQkFDVjJjLFFBRFU7cUJBRVZBLFFBRlU7NEJBR0g7YUFIaEI7Ozs7U0FRSCxJQUFJNWQsQ0FBVCxJQUFja2QsS0FBZCxFQUFxQjthQUNabGQsQ0FBTCxFQUFRa2QsTUFBTWxkLENBQU4sQ0FBUjs7O2FBR0t3ZSxpQkFBaUJKLE1BQWpCLEVBQXlCSyxVQUF6QixFQUFxQ2pCLFNBQXJDLENBQVQsQ0F4R3NDOztRQTBHcENwZSxPQUFGLENBQVVvZSxTQUFWLEVBQW9CLFVBQVN2YyxJQUFULEVBQWU7WUFDM0JpYyxNQUFNamMsSUFBTixDQUFKLEVBQWlCOztnQkFDVixPQUFPaWMsTUFBTWpjLElBQU4sQ0FBUCxJQUFzQixVQUF6QixFQUFxQzt1QkFDM0JBLElBQVAsSUFBZSxZQUFVOzBCQUNoQkEsSUFBTixFQUFZNk8sS0FBWixDQUFrQixJQUFsQixFQUF5QjdNLFNBQXpCO2lCQURIO2FBREgsTUFJTzt1QkFDR2hDLElBQVAsSUFBZWljLE1BQU1qYyxJQUFOLENBQWY7OztLQVBYOztXQVlPaWQsTUFBUCxHQUFnQmYsS0FBaEI7V0FDT3VCLFNBQVAsR0FBbUJELFVBQW5COztXQUVPdmYsY0FBUCxHQUF3QixVQUFTK0IsSUFBVCxFQUFlO2VBQzVCQSxRQUFRbWQsT0FBT0YsTUFBdEI7S0FESjs7dUJBSW1CLEtBQW5COztXQUVPRSxNQUFQOztBQUVKLElBQUlPLGlCQUFpQjNmLE9BQU8yZixjQUE1Qjs7O0FBR0ksSUFBSTttQkFDZSxFQUFmLEVBQW1CLEdBQW5CLEVBQXdCO2VBQ2I7S0FEWDtRQUdJSCxtQkFBbUJ4ZixPQUFPd2YsZ0JBQTlCO0NBSkosQ0FLRSxPQUFPaGMsQ0FBUCxFQUFVO1FBQ0osc0JBQXNCeEQsTUFBMUIsRUFBa0M7eUJBQ2IsVUFBU2MsR0FBVCxFQUFjOGUsSUFBZCxFQUFvQi9CLElBQXBCLEVBQTBCO2dCQUNuQyxXQUFXQSxJQUFmLEVBQXFCO29CQUNiK0IsSUFBSixJQUFZL0IsS0FBSy9iLEtBQWpCOztnQkFFQSxTQUFTK2IsSUFBYixFQUFtQjtvQkFDWGdDLGdCQUFKLENBQXFCRCxJQUFyQixFQUEyQi9CLEtBQUtpQyxHQUFoQzs7Z0JBRUEsU0FBU2pDLElBQWIsRUFBbUI7b0JBQ1hrQyxnQkFBSixDQUFxQkgsSUFBckIsRUFBMkIvQixLQUFLbUMsR0FBaEM7O21CQUVHbGYsR0FBUDtTQVZKOzJCQVltQixVQUFTQSxHQUFULEVBQWNtZixLQUFkLEVBQXFCO2lCQUMvQixJQUFJTCxJQUFULElBQWlCSyxLQUFqQixFQUF3QjtvQkFDaEJBLE1BQU0vZixjQUFOLENBQXFCMGYsSUFBckIsQ0FBSixFQUFnQzttQ0FDYjllLEdBQWYsRUFBb0I4ZSxJQUFwQixFQUEwQkssTUFBTUwsSUFBTixDQUExQjs7O21CQUdEOWUsR0FBUDtTQU5KOzs7O0FBV1osSUFBSSxDQUFDMGUsZ0JBQUQsSUFBcUJwYyxPQUFPOGMsT0FBaEMsRUFBeUM7V0FDOUJDLFVBQVAsQ0FBa0IsQ0FDVix3QkFEVSxFQUVWLHVCQUZVLEVBR1YsY0FIVSxFQUlSQyxJQUpRLENBSUgsSUFKRyxDQUFsQixFQUlzQixVQUp0Qjs7YUFNU0MsVUFBVCxDQUFvQkMsV0FBcEIsRUFBaUNyZSxJQUFqQyxFQUF1Q0gsS0FBdkMsRUFBOEM7WUFDdEN1RixLQUFLaVosWUFBWXJlLElBQVosS0FBcUJxZSxZQUFZcmUsSUFBWixFQUFrQitkLEdBQWhEO1lBQ0kvYixVQUFVbEQsTUFBVixLQUFxQixDQUF6QixFQUE0QjtlQUNyQmUsS0FBSDtTQURKLE1BRU87bUJBQ0l1RixJQUFQOzs7dUJBR1csVUFBU2taLE9BQVQsRUFBa0JELFdBQWxCLEVBQStCNWUsS0FBL0IsRUFBc0M7a0JBQzNDQSxNQUFNeUMsS0FBTixDQUFZLENBQVosQ0FBVjtnQkFDUS9DLElBQVIsQ0FBYSxnQkFBYjtZQUNJdUksWUFBWSxZQUFZa1QsV0FBVyxHQUFYLENBQTVCO1lBQTZDMkQsUUFBUSxFQUFyRDtZQUF5REMsU0FBUyxFQUFsRTtlQUNPcmYsSUFBUCxDQUNRLFdBQVd1SSxTQURuQixFQUVRLG1DQUZSLEVBR1EsNkNBSFIsRUFJUSw2Q0FKUixFQUtRLDBCQUxSO3dCQUFBO1lBT0V2SixPQUFGLENBQVVtZ0IsT0FBVixFQUFrQixVQUFTdGUsSUFBVCxFQUFlOztnQkFDekJ1ZSxNQUFNdmUsSUFBTixNQUFnQixJQUFwQixFQUEwQjtzQkFDaEJBLElBQU4sSUFBYyxJQUFkLENBRHNCO3VCQUVuQmIsSUFBUCxDQUFZLGVBQWVhLElBQWYsR0FBc0IsR0FBbEMsRUFGMEI7O1NBRDlCO2FBTUssSUFBSUEsSUFBVCxJQUFpQnFlLFdBQWpCLEVBQThCO2tCQUNwQnJlLElBQU4sSUFBYyxJQUFkO21CQUNXYixJQUFQOzt3Q0FFb0NhLElBQTVCLEdBQW1DLFFBRjNDO29EQUdnREEsSUFBeEMsR0FBK0MsVUFIdkQsRUFJUSxnQkFKUixFQUtRLDRCQUE0QkEsSUFBNUIsR0FBbUMsUUFMM0M7b0RBTWdEQSxJQUF4QyxHQUErQyxVQU52RCxFQU9RLGdCQVBSLEVBUVEsNEJBQTRCQSxJQUE1QixHQUFtQyxHQVIzQztvQ0FBQTt5QkFVcUJBLElBQWIsR0FBb0IsK0JBQXBCLEdBQXNEQSxJQUF0RCxHQUE2RCxLQVZyRSxFQVdRLDJCQVhSLEVBWVEsVUFBVUEsSUFBVixHQUFpQiwrQkFBakIsR0FBbURBLElBQW5ELEdBQTBELEtBWmxFLEVBYVEsVUFiUixFQWNRLG1CQWRSLEVBZVEsZ0JBZlI7O2VBaUJEYixJQUFQLENBQVksV0FBWixFQXBDcUQ7ZUFxQzlDQSxJQUFQLENBQ1EsY0FBY3VJLFNBQWQsR0FBMEIsZUFEbEM7aUJBQUEsRUFHUSxvQkFBb0JBLFNBQXBCLEdBQWdDLFNBSHhDLEVBSVEsV0FBV0EsU0FBWCxHQUF1QixhQUovQixFQUtRLGNBTFI7ZUFNTytXLE9BQVAsQ0FBZUQsT0FBT0wsSUFBUCxDQUFZLE1BQVosQ0FBZixFQTNDcUQ7ZUE0QzdDaGQsT0FBT3VHLFlBQVksU0FBbkIsRUFBOEIyVyxXQUE5QixFQUEyQ0QsVUFBM0MsQ0FBUixDQTVDcUQ7S0FBekQ7Q0ErQ0o7O0FDN09PLE1BQU1NLGdCQUFnQjthQUNiLENBRGE7V0FFYixDQUZhO1lBR2I7Q0FIVDs7QUFNUCxBQUFPOztBQVVQLEFBQU8sTUFBTUMsU0FBUztVQUNaLENBRFk7VUFFWixDQUZZO1VBR1osQ0FIWTtVQUlaLENBSlk7VUFLWjtDQUxIOztBQVFQLEFBQU8sTUFBTUMsa0JBQWtCO1dBQ1gsQ0FEVztZQUVYLENBRlc7T0FHWCxDQUhXO09BSVgsQ0FKVztZQUtYLENBTFc7WUFNWCxDQU5XO2lCQU9YO1dBQ1IsQ0FEUTtXQUVSO0tBVG1CO2NBV1gsQ0FYVztrQkFZVjtXQUNULENBRFM7V0FFVDtLQWRtQjthQWdCWCxJQWhCVztZQWlCWCxTQWpCVzs7ZUFtQlgsSUFuQlc7YUFvQlgsSUFwQlc7Y0FxQlgsSUFyQlc7ZUFzQlgsSUF0Qlc7Z0JBdUJYLElBdkJXO2dCQXdCWCxJQXhCVztpQkF5QlgsSUF6Qlc7bUJBMEJYLElBMUJXO21CQTJCWCxJQTNCVztpQkE0QlgsSUE1Qlc7aUJBNkJYLENBN0JXO1VBOEJYLElBOUJXO2VBK0JYLE1BL0JXO2tCQWdDWCxLQWhDVztnQkFpQ1gsSUFqQ1c7Z0JBa0NYLElBbENXO2dCQW1DWCxJQW5DVzs4QkFvQ0E7Q0FwQ3hCOztBQ2pDUDs7Ozs7OztBQU9BLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUVBLElBQUlDLGdCQUFnQixVQUFTbGIsR0FBVCxFQUFhO2tCQUNmSixVQUFkLENBQXlCbEMsV0FBekIsQ0FBcUN3TixLQUFyQyxDQUEyQyxJQUEzQyxFQUFpRDdNLFNBQWpEO1FBQ0lpTCxPQUFPLElBQVg7OztVQUdXOUssTUFBTTJjLFFBQU4sQ0FBZ0JuYixHQUFoQixDQUFYOzs7U0FHS3NELEVBQUwsR0FBV3RELElBQUlzRCxFQUFKLElBQVUsSUFBckI7OztTQUdLa0YsVUFBTCxHQUF1QixJQUF2Qjs7O1NBR0tnQyxhQUFMLEdBQXVCLENBQXZCOzs7U0FHSzRRLEtBQUwsR0FBdUIsSUFBdkI7OztTQUdLblcsTUFBTCxHQUF1QixJQUF2Qjs7U0FFS3dFLGFBQUwsR0FBdUIsS0FBdkIsQ0F0QjZCOztTQXdCeEIxRCxXQUFMLEdBQXVCLElBQXZCLENBeEI2Qjs7U0EwQnhCc1YsT0FBTCxHQUF1QixhQUFhcmIsR0FBYixHQUFtQkEsSUFBSXFiLE9BQXZCLEdBQWlDLElBQXhELENBMUI2Qjs7U0E0QnhCdFMsT0FBTCxHQUF1QixLQUF2QixDQTVCNkI7OztTQStCeEJ1UyxjQUFMLENBQXFCdGIsR0FBckI7O1FBRUl1YixNQUFNL2MsTUFBTWdkLFFBQU4sQ0FBZWxTLEtBQUt0SSxJQUFwQixDQUFWOzs7UUFHR3NJLEtBQUtoRyxFQUFMLElBQVcsSUFBZCxFQUFtQjthQUNWQSxFQUFMLEdBQVVpWSxHQUFWOzs7U0FHQ0UsSUFBTCxDQUFVdlEsS0FBVixDQUFnQjVCLElBQWhCLEVBQXVCakwsU0FBdkI7OztTQUdLcWQsZ0JBQUw7Q0EzQ0o7O0FBZ0RBbGQsTUFBTXVMLFVBQU4sQ0FBa0JtUixhQUFsQixFQUFrQ3BSLGVBQWxDLEVBQW9EO1VBQ3pDLFlBQVUsRUFEK0I7b0JBRS9CLFVBQVU5SixHQUFWLEVBQWU7WUFDeEJzSixPQUFPLElBQVg7Ozs7YUFJSzFOLE9BQUwsR0FBZSxJQUFmOzs7O1lBSUkrZixnQkFBZ0JuZCxNQUFNb2QsWUFBTixDQUFvQjloQixJQUFFcUUsS0FBRixDQUFROGMsZUFBUixDQUFwQixFQUE4Q2piLElBQUlwRSxPQUFsRCxFQUE0RCxJQUE1RCxDQUFwQjs7O1lBR0kwTixLQUFLdVMsUUFBVCxFQUFtQjs0QkFDQy9oQixJQUFFZ0UsTUFBRixDQUFTLElBQVQsRUFBZTZkLGFBQWYsRUFBOEJyUyxLQUFLdVMsUUFBbkMsQ0FBaEI7Ozs7YUFJQ2hULFNBQUwsR0FBaUIsS0FBakI7O3NCQUVjaVQsTUFBZCxHQUF1QnhTLElBQXZCO3NCQUNjb1EsTUFBZCxHQUF1QixVQUFTcmQsSUFBVCxFQUFnQkgsS0FBaEIsRUFBd0JnZCxRQUF4QixFQUFpQzs7O2dCQUdoRDZDLGlCQUFpQixDQUFFLEdBQUYsRUFBUSxHQUFSLEVBQWMsUUFBZCxFQUF5QixRQUF6QixFQUFvQyxVQUFwQyxFQUFpRCxhQUFqRCxFQUFpRSx5QkFBakUsQ0FBckI7O2dCQUVJamlCLElBQUVjLE9BQUYsQ0FBV21oQixjQUFYLEVBQTRCMWYsSUFBNUIsS0FBc0MsQ0FBMUMsRUFBOEM7cUJBQ3JDeWYsTUFBTCxDQUFZSixnQkFBWjs7O2dCQUdBLEtBQUtJLE1BQUwsQ0FBWWpULFNBQWhCLEVBQTJCOzs7O2dCQUl2QixLQUFLaVQsTUFBTCxDQUFZcEMsTUFBaEIsRUFBd0I7cUJBQ2ZvQyxNQUFMLENBQVlwQyxNQUFaLENBQW9CcmQsSUFBcEIsRUFBMkJILEtBQTNCLEVBQW1DZ2QsUUFBbkM7OztpQkFHQzRDLE1BQUwsQ0FBWTlTLFNBQVosQ0FBdUI7NkJBQ1AsU0FETzt1QkFFTixLQUFLOFMsTUFGQztzQkFHTnpmLElBSE07dUJBSU5ILEtBSk07MEJBS05nZDthQUxqQjtTQWpCSjs7O2FBNEJLdGQsT0FBTCxHQUFleWMsUUFBU3NELGFBQVQsQ0FBZjtLQWxENEM7Ozs7OztXQXlEeEMsVUFBVUssTUFBVixFQUFrQjtZQUNsQkMsT0FBUztnQkFDQyxLQUFLM1ksRUFETjtxQkFFQ3hKLElBQUVxRSxLQUFGLENBQVEsS0FBS3ZDLE9BQUwsQ0FBYTBkLE1BQXJCO1NBRmQ7O1lBS0k0QyxNQUFKO1lBQ0ksS0FBS2xiLElBQUwsSUFBYSxNQUFqQixFQUF5QjtxQkFDWixJQUFJLEtBQUt0RCxXQUFULENBQXNCLEtBQUt5ZSxJQUEzQixFQUFrQ0YsSUFBbEMsQ0FBVDtTQURKLE1BRU87cUJBQ00sSUFBSSxLQUFLdmUsV0FBVCxDQUFzQnVlLElBQXRCLENBQVQ7OztZQUdBLEtBQUszUixRQUFULEVBQW1CO21CQUNSQSxRQUFQLEdBQWtCLEtBQUtBLFFBQXZCOzs7WUFHQSxDQUFDMFIsTUFBTCxFQUFZO21CQUNEMVksRUFBUCxHQUFrQjlFLE1BQU1nZCxRQUFOLENBQWVVLE9BQU9sYixJQUF0QixDQUFsQjs7ZUFFR2tiLE1BQVA7S0E3RTRDO2VBK0VwQyxVQUFTbGMsR0FBVCxFQUFhOzs7WUFHakJvYixRQUFRLEtBQUt6USxRQUFMLEVBQVo7WUFDSXlRLEtBQUosRUFBVztpQkFDRjVRLGFBQUw7a0JBQ014QixTQUFOLElBQW1Cb1MsTUFBTXBTLFNBQU4sQ0FBaUJoSixHQUFqQixDQUFuQjs7S0FyRndDO3FCQXdGOUIsWUFBVTtlQUNsQjVDLEtBQUtpUCxHQUFMLENBQVMsS0FBS3pRLE9BQUwsQ0FBYTZILEtBQWIsR0FBcUIsS0FBSzdILE9BQUwsQ0FBYWdRLE1BQTNDLENBQVA7S0F6RjZDO3NCQTJGN0IsWUFBVTtlQUNuQnhPLEtBQUtpUCxHQUFMLENBQVMsS0FBS3pRLE9BQUwsQ0FBYThILE1BQWIsR0FBc0IsS0FBSzlILE9BQUwsQ0FBYWlRLE1BQTVDLENBQVA7S0E1RjZDO2NBOEZyQyxZQUFVO1lBQ2IsS0FBS3VQLEtBQVQsRUFBaUI7bUJBQ04sS0FBS0EsS0FBWjs7WUFFQXphLElBQUksSUFBUjtZQUNJQSxFQUFFSyxJQUFGLElBQVUsT0FBZCxFQUFzQjttQkFDZEwsRUFBRXNFLE1BQVIsRUFBZ0I7b0JBQ1Z0RSxFQUFFc0UsTUFBTjtvQkFDSXRFLEVBQUVLLElBQUYsSUFBVSxPQUFkLEVBQXNCOzs7O2dCQUlwQkwsRUFBRUssSUFBRixLQUFXLE9BQWYsRUFBd0I7Ozs7dUJBSWYsS0FBUDs7OzthQUlDb2EsS0FBTCxHQUFhemEsQ0FBYjtlQUNPQSxDQUFQO0tBbkg0QzttQkFxSGhDLFVBQVVPLEtBQVYsRUFBa0JrYixTQUFsQixFQUE2QjtTQUN4Q2xiLEtBQUQsS0FBWUEsUUFBUSxJQUFJWCxLQUFKLENBQVcsQ0FBWCxFQUFlLENBQWYsQ0FBcEI7WUFDSThiLEtBQUssS0FBSzVULHFCQUFMLENBQTRCMlQsU0FBNUIsQ0FBVDs7WUFFSUMsTUFBTSxJQUFWLEVBQWdCLE9BQU85YixNQUFPLENBQVAsRUFBVyxDQUFYLENBQVA7WUFDWmlWLElBQUksSUFBSXBLLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QmxLLE1BQU1WLENBQTdCLEVBQWlDVSxNQUFNVCxDQUF2QyxDQUFSO1VBQ0V5TCxNQUFGLENBQVNtUSxFQUFUO2VBQ08sSUFBSTliLEtBQUosQ0FBV2lWLEVBQUUvSixFQUFiLEVBQWtCK0osRUFBRTlKLEVBQXBCLENBQVAsQ0FQeUM7S0FySEc7bUJBOEhoQyxVQUFVeEssS0FBVixFQUFrQmtiLFNBQWxCLEVBQTZCO1NBQ3hDbGIsS0FBRCxLQUFZQSxRQUFRLElBQUlYLEtBQUosQ0FBVyxDQUFYLEVBQWUsQ0FBZixDQUFwQjs7WUFFSSxLQUFLUyxJQUFMLElBQWEsT0FBakIsRUFBMEI7bUJBQ2ZFLEtBQVA7O1lBRUFtYixLQUFLLEtBQUs1VCxxQkFBTCxDQUE0QjJULFNBQTVCLENBQVQ7O1lBRUlDLE1BQU0sSUFBVixFQUFnQixPQUFPLElBQUk5YixLQUFKLENBQVcsQ0FBWCxFQUFlLENBQWYsQ0FBUCxDQVJ5QjtXQVN0QytiLE1BQUg7WUFDSTlHLElBQUksSUFBSXBLLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QmxLLE1BQU1WLENBQTdCLEVBQWlDVSxNQUFNVCxDQUF2QyxDQUFSO1VBQ0V5TCxNQUFGLENBQVNtUSxFQUFUO2VBQ08sSUFBSTliLEtBQUosQ0FBV2lWLEVBQUUvSixFQUFiLEVBQWtCK0osRUFBRTlKLEVBQXBCLENBQVAsQ0FaeUM7S0E5SEc7bUJBNEloQyxVQUFVeEssS0FBVixFQUFrQjlDLE1BQWxCLEVBQXlCO1lBQ2pDdUMsSUFBSTRiLGNBQWVyYixLQUFmLENBQVI7ZUFDTzlDLE9BQU84SSxhQUFQLENBQXNCdkcsQ0FBdEIsQ0FBUDtLQTlJNEM7MkJBZ0p4QixVQUFVeWIsU0FBVixFQUFxQjtZQUNyQ0MsS0FBSyxJQUFJalIsTUFBSixFQUFUO2FBQ0ssSUFBSW9SLElBQUksSUFBYixFQUFtQkEsS0FBSyxJQUF4QixFQUE4QkEsSUFBSUEsRUFBRXZYLE1BQXBDLEVBQTRDO2VBQ3JDaUgsTUFBSCxDQUFXc1EsRUFBRWhVLFVBQWI7Z0JBQ0ksQ0FBQ2dVLEVBQUV2WCxNQUFILElBQWVtWCxhQUFhSSxFQUFFdlgsTUFBZixJQUF5QnVYLEVBQUV2WCxNQUFGLElBQVltWCxTQUFwRCxJQUFxRUksRUFBRXZYLE1BQUYsSUFBWXVYLEVBQUV2WCxNQUFGLENBQVNqRSxJQUFULElBQWUsT0FBcEcsRUFBZ0g7O3VCQUVyR3FiLEVBQVAsQ0FGNEc7OztlQUs3R0EsRUFBUDtLQXpKNEM7Ozs7O29CQStKL0IsVUFBVUksSUFBVixFQUFnQjtZQUMxQjNpQixJQUFFNkMsU0FBRixDQUFZOGYsSUFBWixDQUFILEVBQXFCO2lCQUNaaFQsYUFBTCxHQUFxQmdULElBQXJCO21CQUNPLElBQVA7O2VBRUcsS0FBUDtLQXBLNEM7Ozs7Y0F5S25DLFlBQVU7WUFDaEIsQ0FBQyxLQUFLeFgsTUFBVCxFQUFpQjs7O2VBR1ZuTCxJQUFFYyxPQUFGLENBQVUsS0FBS3FLLE1BQUwsQ0FBWXFGLFFBQXRCLEVBQWlDLElBQWpDLENBQVA7S0E3SzRDOzs7OztZQW1MdkMsVUFBVW9TLEdBQVYsRUFBZTtZQUNqQixDQUFDLEtBQUt6WCxNQUFULEVBQWlCOzs7WUFHYjBYLFlBQVksS0FBS0MsUUFBTCxFQUFoQjtZQUNJQyxVQUFVLENBQWQ7O1lBRUcvaUIsSUFBRTRDLFFBQUYsQ0FBWWdnQixHQUFaLENBQUgsRUFBcUI7Z0JBQ2ZBLE9BQU8sQ0FBWCxFQUFjOzs7O3NCQUlKQyxZQUFZRCxHQUF0Qjs7WUFFRXZYLEtBQUssS0FBS0YsTUFBTCxDQUFZcUYsUUFBWixDQUFxQlYsTUFBckIsQ0FBNkIrUyxTQUE3QixFQUF5QyxDQUF6QyxFQUE2QyxDQUE3QyxDQUFUO1lBQ0lFLFVBQVUsQ0FBZCxFQUFpQjtzQkFDSCxDQUFWOzthQUVDNVgsTUFBTCxDQUFZeUQsVUFBWixDQUF3QnZELEVBQXhCLEVBQTZCMFgsT0FBN0I7S0FyTTRDOzs7OzthQTJNdEMsVUFBVUgsR0FBVixFQUFlO1lBQ2xCLENBQUMsS0FBS3pYLE1BQVQsRUFBaUI7OztZQUdiMFgsWUFBWSxLQUFLQyxRQUFMLEVBQWhCO1lBQ0lFLE1BQU0sS0FBSzdYLE1BQUwsQ0FBWXFGLFFBQVosQ0FBcUJuUCxNQUEvQjtZQUNJMGhCLFVBQVVDLEdBQWQ7O1lBRUdoakIsSUFBRTRDLFFBQUYsQ0FBWWdnQixHQUFaLENBQUgsRUFBcUI7Z0JBQ2ZBLE9BQU8sQ0FBWCxFQUFjOzs7O3NCQUlKQyxZQUFZRCxHQUFaLEdBQWtCLENBQTVCOztZQUVFdlgsS0FBSyxLQUFLRixNQUFMLENBQVlxRixRQUFaLENBQXFCVixNQUFyQixDQUE2QitTLFNBQTdCLEVBQXlDLENBQXpDLEVBQTZDLENBQTdDLENBQVQ7WUFDR0UsVUFBVUMsR0FBYixFQUFpQjtzQkFDSEEsR0FBVjs7YUFFQzdYLE1BQUwsQ0FBWXlELFVBQVosQ0FBd0J2RCxFQUF4QixFQUE2QjBYLFVBQVEsQ0FBckM7S0E5TjRDO3NCQWdPN0IsWUFBVztZQUN0QnJVLGFBQWEsSUFBSTRDLE1BQUosRUFBakI7bUJBQ1dyUCxRQUFYO1lBQ0lILFVBQVUsS0FBS0EsT0FBbkI7O1lBRUdBLFFBQVFnUSxNQUFSLEtBQW1CLENBQW5CLElBQXdCaFEsUUFBUWlRLE1BQVIsS0FBa0IsQ0FBN0MsRUFBZ0Q7OztnQkFHeENrUixTQUFTLElBQUl4YyxLQUFKLENBQVUzRSxRQUFRb2hCLFdBQWxCLENBQWI7Z0JBQ0lELE9BQU92YyxDQUFQLElBQVl1YyxPQUFPdGMsQ0FBdkIsRUFBMEI7MkJBQ1h3YyxTQUFYLENBQXNCLENBQUNGLE9BQU92YyxDQUE5QixFQUFrQyxDQUFDdWMsT0FBT3RjLENBQTFDOzt1QkFFT3ljLEtBQVgsQ0FBa0J0aEIsUUFBUWdRLE1BQTFCLEVBQW1DaFEsUUFBUWlRLE1BQTNDO2dCQUNJa1IsT0FBT3ZjLENBQVAsSUFBWXVjLE9BQU90YyxDQUF2QixFQUEwQjsyQkFDWHdjLFNBQVgsQ0FBc0JGLE9BQU92YyxDQUE3QixFQUFpQ3VjLE9BQU90YyxDQUF4Qzs7OztZQUlKcUwsV0FBV2xRLFFBQVFrUSxRQUF2QjtZQUNJQSxRQUFKLEVBQWM7OztnQkFHTmlSLFNBQVMsSUFBSXhjLEtBQUosQ0FBVTNFLFFBQVF1aEIsWUFBbEIsQ0FBYjtnQkFDSUosT0FBT3ZjLENBQVAsSUFBWXVjLE9BQU90YyxDQUF2QixFQUEwQjsyQkFDWHdjLFNBQVgsQ0FBc0IsQ0FBQ0YsT0FBT3ZjLENBQTlCLEVBQWtDLENBQUN1YyxPQUFPdGMsQ0FBMUM7O3VCQUVPMmMsTUFBWCxDQUFtQnRSLFdBQVcsR0FBWCxHQUFpQjFPLEtBQUs2TyxFQUF0QixHQUF5QixHQUE1QztnQkFDSThRLE9BQU92YyxDQUFQLElBQVl1YyxPQUFPdGMsQ0FBdkIsRUFBMEI7MkJBQ1h3YyxTQUFYLENBQXNCRixPQUFPdmMsQ0FBN0IsRUFBaUN1YyxPQUFPdGMsQ0FBeEM7Ozs7O1lBS0pELENBQUosRUFBTUMsQ0FBTjtZQUNJLEtBQUs0YSxPQUFMLElBQWdCLENBQUMsS0FBS3RTLE9BQTFCLEVBQW1DOzs7Z0JBRzNCdkksSUFBSTZjLFNBQVV6aEIsUUFBUTRFLENBQWxCLENBQVI7Z0JBQ0lDLElBQUk0YyxTQUFVemhCLFFBQVE2RSxDQUFsQixDQUFSOztnQkFFSTRjLFNBQVN6aEIsUUFBUW1ULFNBQWpCLEVBQTZCLEVBQTdCLElBQW1DLENBQW5DLElBQXdDLENBQXhDLElBQTZDblQsUUFBUTBoQixXQUF6RCxFQUFzRTtxQkFDN0QsR0FBTDtxQkFDSyxHQUFMOztTQVJSLE1BVU87Z0JBQ0MxaEIsUUFBUTRFLENBQVo7Z0JBQ0k1RSxRQUFRNkUsQ0FBWjs7O1lBR0FELEtBQUssQ0FBTCxJQUFVQyxLQUFLLENBQW5CLEVBQXNCO3VCQUNQd2MsU0FBWCxDQUFzQnpjLENBQXRCLEVBQTBCQyxDQUExQjs7YUFFQytILFVBQUwsR0FBa0JBLFVBQWxCO2VBQ09BLFVBQVA7S0FyUjRDOztxQkF3UjlCLFVBQVV0SCxLQUFWLEVBQWlCO1lBQzNCcWMsTUFBSixDQUQrQjs7O1lBSTNCLEtBQUt2YyxJQUFMLElBQWEsT0FBYixJQUF3QixLQUFLaUUsTUFBN0IsSUFBdUMsS0FBS0EsTUFBTCxDQUFZakUsSUFBWixJQUFvQixPQUEvRCxFQUF5RTtvQkFDN0QsS0FBS2lFLE1BQUwsQ0FBWWlDLGFBQVosQ0FBMkJoRyxLQUEzQixDQUFSOzs7WUFHQVYsSUFBSVUsTUFBTVYsQ0FBZDtZQUNJQyxJQUFJUyxNQUFNVCxDQUFkOzs7O2FBSUtvSSxTQUFMLEdBQWlCLElBQWpCOzs7WUFHSSxLQUFLTCxVQUFULEVBQXFCO2dCQUNiZ1YsZ0JBQWdCLEtBQUtoVixVQUFMLENBQWdCckssS0FBaEIsR0FBd0JtZSxNQUF4QixFQUFwQjtnQkFDSW1CLFlBQVksQ0FBQ2pkLENBQUQsRUFBSUMsQ0FBSixDQUFoQjt3QkFDWStjLGNBQWNFLFNBQWQsQ0FBeUJELFNBQXpCLENBQVo7O2dCQUVJQSxVQUFVLENBQVYsQ0FBSjtnQkFDSUEsVUFBVSxDQUFWLENBQUo7OztZQUdBRSxRQUFRLEtBQUtBLEtBQUwsR0FBYSxLQUFLQyxPQUFMLENBQWEsS0FBS2hpQixPQUFsQixDQUF6Qjs7WUFFRyxDQUFDK2hCLEtBQUosRUFBVTttQkFDQyxLQUFQOztZQUVBLENBQUMsS0FBSy9oQixPQUFMLENBQWE2SCxLQUFkLElBQXVCLENBQUMsQ0FBQ2thLE1BQU1sYSxLQUFuQyxFQUEwQztpQkFDakM3SCxPQUFMLENBQWE2SCxLQUFiLEdBQXFCa2EsTUFBTWxhLEtBQTNCOztZQUVBLENBQUMsS0FBSzdILE9BQUwsQ0FBYThILE1BQWQsSUFBd0IsQ0FBQyxDQUFDaWEsTUFBTWphLE1BQXBDLEVBQTRDO2lCQUNuQzlILE9BQUwsQ0FBYThILE1BQWIsR0FBc0JpYSxNQUFNamEsTUFBNUI7O1lBRUQsQ0FBQ2lhLE1BQU1sYSxLQUFQLElBQWdCLENBQUNrYSxNQUFNamEsTUFBMUIsRUFBa0M7bUJBQ3ZCLEtBQVA7OztZQUdDbEQsS0FBUW1kLE1BQU1uZCxDQUFkLElBQ0dBLEtBQU1tZCxNQUFNbmQsQ0FBTixHQUFVbWQsTUFBTWxhLEtBRHpCLElBRUdoRCxLQUFLa2QsTUFBTWxkLENBRmQsSUFHR0EsS0FBTWtkLE1BQU1sZCxDQUFOLEdBQVVrZCxNQUFNamEsTUFIOUIsRUFJRTs7cUJBRVVtYSxhQUFhbFEsUUFBYixDQUF1QixJQUF2QixFQUE4QjttQkFDL0JuTixDQUQrQjttQkFFL0JDO2FBRkMsQ0FBVDtTQU5ILE1BVU87O3FCQUVLLEtBQVQ7O2FBRUVvSSxTQUFMLEdBQWlCLEtBQWpCO2VBQ08wVSxNQUFQO0tBL1U0Qzs7Ozs7O2FBc1Z0QyxVQUFVTyxTQUFWLEVBQXNCL2YsT0FBdEIsRUFBK0I7WUFDakN5VixLQUFLc0ssU0FBVDtZQUNJakcsT0FBTyxFQUFYO2FBQ0ssSUFBSWxYLENBQVQsSUFBYzZTLEVBQWQsRUFBa0I7aUJBQ1I3UyxDQUFOLElBQVksS0FBSy9FLE9BQUwsQ0FBYStFLENBQWIsQ0FBWjs7U0FFSDVDLE9BQUQsS0FBYUEsVUFBVSxFQUF2QjtnQkFDUThaLElBQVIsR0FBZUEsSUFBZjtnQkFDUXJFLEVBQVIsR0FBYUEsRUFBYjs7WUFFSWxLLE9BQU8sSUFBWDtZQUNJeVUsUUFBUSxZQUFVLEVBQXRCO1lBQ0loZ0IsUUFBUTZXLFFBQVosRUFBc0I7b0JBQ1Y3VyxRQUFRNlcsUUFBaEI7O1lBRUEzRCxLQUFKO2dCQUNRMkQsUUFBUixHQUFtQixZQUFVOztnQkFFckIsQ0FBQ3RMLEtBQUsxTixPQUFOLElBQWlCcVYsS0FBckIsRUFBNEI7K0JBQ1RpSCxZQUFmLENBQTRCakgsS0FBNUI7d0JBQ1EsSUFBUjs7O2lCQUdDLElBQUl0USxDQUFULElBQWMsSUFBZCxFQUFvQjtxQkFDWC9FLE9BQUwsQ0FBYStFLENBQWIsSUFBa0IsS0FBS0EsQ0FBTCxDQUFsQjs7a0JBRUV1SyxLQUFOLENBQVk1QixJQUFaLEVBQW1CLENBQUMsSUFBRCxDQUFuQjtTQVZKO1lBWUkwVSxVQUFVLFlBQVUsRUFBeEI7WUFDSWpnQixRQUFROFcsVUFBWixFQUF3QjtzQkFDVjlXLFFBQVE4VyxVQUFsQjs7Z0JBRUlBLFVBQVIsR0FBcUIsVUFBVTdVLEdBQVYsRUFBZTtvQkFDeEJrTCxLQUFSLENBQWM1QixJQUFkLEVBQXFCakwsU0FBckI7U0FESjtnQkFHUTRmLGVBQWV0RyxXQUFmLENBQTRCNVosT0FBNUIsQ0FBUjtlQUNPa1QsS0FBUDtLQTFYNEM7OzthQStYdEMsVUFBVWlOLEdBQVYsRUFBZTtZQUNqQixDQUFDLEtBQUt0aUIsT0FBTCxDQUFhdWlCLE9BQWQsSUFBeUIsS0FBS3ZpQixPQUFMLENBQWF5SyxXQUFiLElBQTRCLENBQXpELEVBQTREOzs7WUFHeEQrWCxJQUFKOztZQUdJQyxZQUFZLEtBQUs3VixVQUFyQjtZQUNJLENBQUM2VixTQUFMLEVBQWlCO3dCQUNELEtBQUszQyxnQkFBTCxFQUFaOzs7WUFHQTRDLFNBQUosQ0FBY3BULEtBQWQsQ0FBcUJnVCxHQUFyQixFQUEyQkcsVUFBVUUsT0FBVixFQUEzQjs7O1lBR0ksS0FBS3ZkLElBQUwsSUFBYSxNQUFqQixFQUEwQjtnQkFDbEJ1QyxRQUFRLEtBQUszSCxPQUFMLENBQWEwZCxNQUF6QjtpQkFDSSxJQUFJM1ksQ0FBUixJQUFhNEMsS0FBYixFQUFtQjtvQkFDWDVDLEtBQUssY0FBTCxJQUF5QkEsS0FBS3VkLEdBQWxDLEVBQXlDO3dCQUNoQzNhLE1BQU01QyxDQUFOLEtBQVk3RyxJQUFFNEMsUUFBRixDQUFZNkcsTUFBTTVDLENBQU4sQ0FBWixDQUFqQixFQUEwQzs0QkFDbENBLEtBQUssYUFBVCxFQUF3Qjs7Z0NBRWhCQSxDQUFKLEtBQVU0QyxNQUFNNUMsQ0FBTixDQUFWO3lCQUZKLE1BR087Z0NBQ0NBLENBQUosSUFBUzRDLE1BQU01QyxDQUFOLENBQVQ7Ozs7Ozs7YUFPZjZkLE1BQUwsQ0FBYU4sR0FBYjtZQUNJTyxPQUFKO0tBL1o0QztZQWlhdkMsVUFBVVAsR0FBVixFQUFnQjs7S0FqYXVCOztZQXFhdkMsWUFBVTtZQUNYLEtBQUtqWixNQUFULEVBQWlCO2lCQUNSQSxNQUFMLENBQVl5WixXQUFaLENBQXdCLElBQXhCO2lCQUNLelosTUFBTCxHQUFjLElBQWQ7O0tBeGF3Qzs7YUE0YXRDLFlBQVU7YUFDWDZPLE1BQUw7YUFDSzNOLElBQUwsQ0FBVSxTQUFWOzthQUVLdkssT0FBTCxHQUFlLElBQWY7ZUFDTyxLQUFLQSxPQUFaOztDQWpiUixFQXFiQTs7QUN0ZkE7Ozs7Ozs7QUFPQSxBQUNBLEFBQ0EsQUFDQSxBQUVBLElBQUkraUIseUJBQXlCLFVBQVMzZSxHQUFULEVBQWE7UUFDbkNzSixPQUFPLElBQVg7U0FDS2dCLFFBQUwsR0FBZ0IsRUFBaEI7U0FDS3NVLGFBQUwsR0FBcUIsRUFBckI7MkJBQ3VCaGYsVUFBdkIsQ0FBa0NsQyxXQUFsQyxDQUE4Q3dOLEtBQTlDLENBQW9ELElBQXBELEVBQTBEN00sU0FBMUQ7Ozs7O1NBS0tvTCxhQUFMLEdBQXFCLElBQXJCO0NBVEg7O0FBWUFqTCxNQUFNdUwsVUFBTixDQUFrQjRVLHNCQUFsQixFQUEyQ3pELGFBQTNDLEVBQTJEO2NBQzVDLFVBQVNoVyxLQUFULEVBQWU7WUFDbEIsQ0FBQ0EsS0FBTCxFQUFhOzs7WUFHVixLQUFLMlosYUFBTCxDQUFtQjNaLEtBQW5CLEtBQTZCLENBQUMsQ0FBakMsRUFBb0M7a0JBQzFCRCxNQUFOLEdBQWUsSUFBZjttQkFDT0MsS0FBUDs7O1lBR0RBLE1BQU1ELE1BQVQsRUFBaUI7a0JBQ1BBLE1BQU4sQ0FBYXlaLFdBQWIsQ0FBeUJ4WixLQUF6Qjs7YUFFQ29GLFFBQUwsQ0FBYzlPLElBQWQsQ0FBb0IwSixLQUFwQjtjQUNNRCxNQUFOLEdBQWUsSUFBZjtZQUNHLEtBQUsrRCxTQUFSLEVBQWtCO2lCQUNWQSxTQUFMLENBQWU7NkJBQ0MsVUFERDt3QkFFQzlELEtBRkQ7cUJBR0M7YUFIaEI7OztZQU9BLEtBQUs0WixjQUFSLEVBQXVCO2lCQUNmQSxjQUFMLENBQW9CNVosS0FBcEI7OztlQUdJQSxLQUFQO0tBM0JtRDtnQkE2QjFDLFVBQVNBLEtBQVQsRUFBZ0IvSSxLQUFoQixFQUF1QjtZQUM3QixLQUFLMGlCLGFBQUwsQ0FBbUIzWixLQUFuQixLQUE2QixDQUFDLENBQWpDLEVBQW9DO2tCQUMxQkQsTUFBTixHQUFlLElBQWY7bUJBQ09DLEtBQVA7O1lBRURBLE1BQU1ELE1BQVQsRUFBaUI7a0JBQ1BBLE1BQU4sQ0FBYXlaLFdBQWIsQ0FBeUJ4WixLQUF6Qjs7YUFFQ29GLFFBQUwsQ0FBY1YsTUFBZCxDQUFxQnpOLEtBQXJCLEVBQTRCLENBQTVCLEVBQStCK0ksS0FBL0I7Y0FDTUQsTUFBTixHQUFlLElBQWY7OztZQUdHLEtBQUsrRCxTQUFSLEVBQWtCO2lCQUNWQSxTQUFMLENBQWU7NkJBQ0MsVUFERDt3QkFFRTlELEtBRkY7cUJBR0Y7YUFIYjs7O1lBT0EsS0FBSzRaLGNBQVIsRUFBdUI7aUJBQ2ZBLGNBQUwsQ0FBb0I1WixLQUFwQixFQUEwQi9JLEtBQTFCOzs7ZUFHSStJLEtBQVA7S0FyRG1EO2lCQXVEekMsVUFBU0EsS0FBVCxFQUFnQjtlQUNuQixLQUFLNlosYUFBTCxDQUFtQmpsQixJQUFFYyxPQUFGLENBQVcsS0FBSzBQLFFBQWhCLEVBQTJCcEYsS0FBM0IsQ0FBbkIsQ0FBUDtLQXhEbUQ7bUJBMER2QyxVQUFTL0ksS0FBVCxFQUFnQjtZQUN4QkEsUUFBUSxDQUFSLElBQWFBLFFBQVEsS0FBS21PLFFBQUwsQ0FBY25QLE1BQWQsR0FBdUIsQ0FBaEQsRUFBbUQ7bUJBQ3hDLEtBQVA7O1lBRUErSixRQUFRLEtBQUtvRixRQUFMLENBQWNuTyxLQUFkLENBQVo7WUFDSStJLFNBQVMsSUFBYixFQUFtQjtrQkFDVEQsTUFBTixHQUFlLElBQWY7O2FBRUNxRixRQUFMLENBQWNWLE1BQWQsQ0FBcUJ6TixLQUFyQixFQUE0QixDQUE1Qjs7WUFFRyxLQUFLNk0sU0FBUixFQUFrQjtpQkFDVkEsU0FBTCxDQUFlOzZCQUNDLFVBREQ7d0JBRUU5RCxLQUZGO3FCQUdGO2FBSGI7OztZQU9BLEtBQUs4WixjQUFSLEVBQXVCO2lCQUNmQSxjQUFMLENBQW9COVosS0FBcEIsRUFBNEIvSSxLQUE1Qjs7O2VBR0krSSxLQUFQO0tBaEZtRDtxQkFrRnJDLFVBQVU1QixFQUFWLEVBQWU7YUFDekIsSUFBSWxJLElBQUksQ0FBUixFQUFXNmpCLE1BQU0sS0FBSzNVLFFBQUwsQ0FBY25QLE1BQW5DLEVBQTJDQyxJQUFJNmpCLEdBQS9DLEVBQW9EN2pCLEdBQXBELEVBQXlEO2dCQUNsRCxLQUFLa1AsUUFBTCxDQUFjbFAsQ0FBZCxFQUFpQmtJLEVBQWpCLElBQXVCQSxFQUExQixFQUE4Qjt1QkFDbkIsS0FBS3liLGFBQUwsQ0FBbUIzakIsQ0FBbkIsQ0FBUDs7O2VBR0QsS0FBUDtLQXhGbUQ7dUJBMEZuQyxZQUFXO2VBQ3JCLEtBQUtrUCxRQUFMLENBQWNuUCxNQUFkLEdBQXVCLENBQTdCLEVBQWdDO2lCQUN2QjRqQixhQUFMLENBQW1CLENBQW5COztLQTVGK0M7O2FBZ0c3QyxZQUFVO1lBQ1osS0FBSzlaLE1BQVQsRUFBaUI7aUJBQ1JBLE1BQUwsQ0FBWXlaLFdBQVosQ0FBd0IsSUFBeEI7aUJBQ0t6WixNQUFMLEdBQWMsSUFBZDs7YUFFQ2tCLElBQUwsQ0FBVSxTQUFWOzthQUVLLElBQUkvSyxJQUFFLENBQU4sRUFBUWtVLElBQUUsS0FBS2hGLFFBQUwsQ0FBY25QLE1BQTdCLEVBQXNDQyxJQUFFa1UsQ0FBeEMsRUFBNENsVSxHQUE1QyxFQUFnRDtpQkFDdkM4akIsVUFBTCxDQUFnQjlqQixDQUFoQixFQUFtQjZOLE9BQW5COzs7O0tBeEcrQzs7Ozs7a0JBaUh4QyxVQUFTM0YsRUFBVCxFQUFjNmIsTUFBZCxFQUFxQjtZQUM3QixDQUFDQSxNQUFKLEVBQVk7aUJBQ0osSUFBSS9qQixJQUFJLENBQVIsRUFBVzZqQixNQUFNLEtBQUszVSxRQUFMLENBQWNuUCxNQUFuQyxFQUEyQ0MsSUFBSTZqQixHQUEvQyxFQUFvRDdqQixHQUFwRCxFQUF3RDtvQkFDakQsS0FBS2tQLFFBQUwsQ0FBY2xQLENBQWQsRUFBaUJrSSxFQUFqQixJQUF1QkEsRUFBMUIsRUFBOEI7MkJBQ25CLEtBQUtnSCxRQUFMLENBQWNsUCxDQUFkLENBQVA7OztTQUhaLE1BTU87OzttQkFHSSxJQUFQOztlQUVHLElBQVA7S0E3SG1EO2dCQStIMUMsVUFBU2UsS0FBVCxFQUFnQjtZQUNyQkEsUUFBUSxDQUFSLElBQWFBLFFBQVEsS0FBS21PLFFBQUwsQ0FBY25QLE1BQWQsR0FBdUIsQ0FBaEQsRUFBbUQsT0FBTyxJQUFQO2VBQzVDLEtBQUttUCxRQUFMLENBQWNuTyxLQUFkLENBQVA7S0FqSW1EO21CQW1JdkMsVUFBUytJLEtBQVQsRUFBZ0I7ZUFDckJwTCxJQUFFYyxPQUFGLENBQVcsS0FBSzBQLFFBQWhCLEVBQTJCcEYsS0FBM0IsQ0FBUDtLQXBJbUQ7bUJBc0l2QyxVQUFTQSxLQUFULEVBQWdCL0ksS0FBaEIsRUFBc0I7WUFDL0IrSSxNQUFNRCxNQUFOLElBQWdCLElBQW5CLEVBQXlCO1lBQ3JCbWEsV0FBV3RsQixJQUFFYyxPQUFGLENBQVcsS0FBSzBQLFFBQWhCLEVBQTJCcEYsS0FBM0IsQ0FBZjtZQUNHL0ksU0FBU2lqQixRQUFaLEVBQXNCO2FBQ2pCOVUsUUFBTCxDQUFjVixNQUFkLENBQXFCd1YsUUFBckIsRUFBK0IsQ0FBL0I7YUFDSzlVLFFBQUwsQ0FBY1YsTUFBZCxDQUFxQnpOLEtBQXJCLEVBQTRCLENBQTVCLEVBQStCK0ksS0FBL0I7S0EzSW1EO29CQTZJdEMsWUFBVztlQUNqQixLQUFLb0YsUUFBTCxDQUFjblAsTUFBckI7S0E5SW1EOzswQkFpSmhDLFVBQVUrRixLQUFWLEVBQWtCd2IsR0FBbEIsRUFBdUI7WUFDdENhLFNBQVMsRUFBYjs7YUFFSSxJQUFJbmlCLElBQUksS0FBS2tQLFFBQUwsQ0FBY25QLE1BQWQsR0FBdUIsQ0FBbkMsRUFBc0NDLEtBQUssQ0FBM0MsRUFBOENBLEdBQTlDLEVBQW1EO2dCQUMzQzhKLFFBQVEsS0FBS29GLFFBQUwsQ0FBY2xQLENBQWQsQ0FBWjs7Z0JBRUk4SixTQUFTLElBQVQsSUFDQyxDQUFDQSxNQUFNdUUsYUFBUCxJQUF3QixDQUFDdkUsTUFBTWEsV0FEaEMsSUFFQSxDQUFDYixNQUFNdEosT0FBTixDQUFjdWlCLE9BRm5CLEVBR0U7OztnQkFHRWpaLGlCQUFpQnlaLHNCQUFyQixFQUE4Qzs7b0JBRXRDelosTUFBTTBaLGFBQU4sSUFBdUIxWixNQUFNbWEsY0FBTixLQUF5QixDQUFwRCxFQUFzRDt3QkFDL0NDLE9BQU9wYSxNQUFNWSxvQkFBTixDQUE0QjVFLEtBQTVCLENBQVg7d0JBQ0lvZSxLQUFLbmtCLE1BQUwsR0FBYyxDQUFsQixFQUFvQjtpQ0FDUm9pQixPQUFPclIsTUFBUCxDQUFlb1QsSUFBZixDQUFUOzs7YUFMVixNQVFPOztvQkFFQ3BhLE1BQU0rQixlQUFOLENBQXVCL0YsS0FBdkIsQ0FBSixFQUFvQzsyQkFDekIxRixJQUFQLENBQVkwSixLQUFaO3dCQUNJd1gsT0FBTzdlLFNBQVAsSUFBb0IsQ0FBQ3JCLE1BQU1rZ0IsR0FBTixDQUF6QixFQUFvQzs0QkFDOUJhLE9BQU9waUIsTUFBUCxJQUFpQnVoQixHQUFwQixFQUF3QjttQ0FDZGEsTUFBUDs7Ozs7O2VBTVhBLE1BQVA7S0FqTG1EOzs7WUFxTDlDLFVBQVVXLEdBQVYsRUFBZ0I7YUFDakIsSUFBSTlpQixJQUFJLENBQVIsRUFBVzZqQixNQUFNLEtBQUszVSxRQUFMLENBQWNuUCxNQUFuQyxFQUEyQ0MsSUFBSTZqQixHQUEvQyxFQUFvRDdqQixHQUFwRCxFQUF5RDtpQkFDaERrUCxRQUFMLENBQWNsUCxDQUFkLEVBQWlCbWtCLE9BQWpCLENBQTBCckIsR0FBMUI7OztDQXZMWixFQTJMQTs7QUNuTkE7Ozs7Ozs7OztBQVNBLEFBQ0EsQUFFQSxJQUFJc0IsUUFBUSxZQUFXO1FBQ2ZsVyxPQUFPLElBQVg7U0FDS3RJLElBQUwsR0FBWSxPQUFaO1NBQ0t5ZSxTQUFMLEdBQWlCLElBQWpCOztTQUVLQyxZQUFMLEdBQW9CLEtBQXBCO1NBQ0tDLFFBQUwsR0FBZ0IsS0FBaEI7VUFDTS9mLFVBQU4sQ0FBaUJsQyxXQUFqQixDQUE2QndOLEtBQTdCLENBQW1DLElBQW5DLEVBQXlDN00sU0FBekM7Q0FQSjtBQVNBRyxNQUFNdUwsVUFBTixDQUFrQnlWLEtBQWxCLEVBQTBCYixzQkFBMUIsRUFBbUQ7VUFDeEMsWUFBVSxFQUQ4Qjs7ZUFHbkMsVUFBVWMsU0FBVixFQUFzQmhjLEtBQXRCLEVBQThCQyxNQUE5QixFQUFzQztZQUMzQzRGLE9BQU8sSUFBWDthQUNLbVcsU0FBTCxHQUFpQkEsU0FBakI7YUFDSzdqQixPQUFMLENBQWE2SCxLQUFiLEdBQXNCQSxLQUF0QjthQUNLN0gsT0FBTCxDQUFhOEgsTUFBYixHQUFzQkEsTUFBdEI7YUFDSzlILE9BQUwsQ0FBYWdRLE1BQWIsR0FBc0JwTixNQUFNb2hCLGlCQUE1QjthQUNLaGtCLE9BQUwsQ0FBYWlRLE1BQWIsR0FBc0JyTixNQUFNb2hCLGlCQUE1QjthQUNLRCxRQUFMLEdBQWdCLElBQWhCO0tBVjRDO1lBWXRDLFVBQVUvakIsT0FBVixFQUFtQjthQUNuQjhqQixZQUFMLEdBQW9CLElBQXBCOzs7O2FBSUtHLEtBQUw7Y0FDTWpnQixVQUFOLENBQWlCNGUsTUFBakIsQ0FBd0IvaUIsSUFBeEIsQ0FBOEIsSUFBOUIsRUFBb0NHLE9BQXBDO2FBQ0s4akIsWUFBTCxHQUFvQixLQUFwQjtLQW5CMkM7ZUFxQm5DLFVBQVUxZixHQUFWLEVBQWU7OztZQUduQixDQUFDLEtBQUsyZixRQUFWLEVBQW9COzs7O2dCQUlYM2YsTUFBTSxFQUFmLEVBUHVCO1lBUW5Cb2IsS0FBSixHQUFjLElBQWQ7OzthQUdLblcsTUFBTCxJQUFlLEtBQUtBLE1BQUwsQ0FBWStELFNBQVosQ0FBc0JoSixHQUF0QixDQUFmO0tBaEMyQztXQWtDdkMsVUFBU1EsQ0FBVCxFQUFZQyxDQUFaLEVBQWVnRCxLQUFmLEVBQXNCQyxNQUF0QixFQUE4QjtZQUMvQnJGLFVBQVVsRCxNQUFWLElBQW9CLENBQXZCLEVBQTBCO2lCQUNqQnNrQixTQUFMLENBQWVLLFNBQWYsQ0FBeUJ0ZixDQUF6QixFQUE0QkMsQ0FBNUIsRUFBK0JnRCxLQUEvQixFQUFzQ0MsTUFBdEM7U0FESixNQUVPO2lCQUNFK2IsU0FBTCxDQUFlSyxTQUFmLENBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDLEtBQUs3YSxNQUFMLENBQVl4QixLQUE1QyxFQUFvRCxLQUFLd0IsTUFBTCxDQUFZdkIsTUFBaEU7OztDQXRDWixFQTBDQTs7QUMzRGUsTUFBTXFjLGNBQU4sQ0FDZjtnQkFDaUIvZSxPQUFLK1osY0FBY2lGLE9BQWhDLEVBQTBDQyxHQUExQyxFQUNBO2FBQ01qZixJQUFMLEdBQVlBLElBQVosQ0FERDthQUVTaWYsR0FBTCxHQUFXQSxHQUFYOzthQUVLQyxVQUFMLEdBQWtCLElBQWxCOzs7YUFHREMsYUFBTCxHQUFxQixFQUFyQjs7YUFFS0MsVUFBTCxHQUFrQixLQUFsQixDQVRFOzthQVdHQyxjQUFMLEdBQXNCLENBQXRCOzs7O2lCQUtFO1lBQ08vVyxPQUFPLElBQVg7WUFDSSxDQUFDQSxLQUFLNFcsVUFBVixFQUFzQjtpQkFDYkEsVUFBTCxHQUFrQmpDLGVBQWUxRyxXQUFmLENBQTRCO29CQUNyQyxZQURxQztzQkFFbkMsWUFBVTt5QkFDUCtJLFVBQUwsQ0FBZ0JwVixLQUFoQixDQUFzQjVCLElBQXRCOzthQUhTLENBQWxCOzs7O2lCQVVQO1lBQ1FBLE9BQU8sSUFBWDs7O2FBR0s0VyxVQUFMLEdBQWtCLElBQWxCO2NBQ005TyxHQUFOLEdBQVksSUFBSVEsSUFBSixHQUFXQyxPQUFYLEVBQVo7WUFDSXZJLEtBQUs4VyxVQUFULEVBQXFCO2NBQ2Yxa0IsSUFBRixDQUFPNUIsRUFBRW1CLE1BQUYsQ0FBVXFPLEtBQUs2VyxhQUFmLENBQVAsRUFBd0MsVUFBU0ksWUFBVCxFQUFzQjs2QkFDOUNuRixLQUFiLENBQW1CbUUsT0FBbkIsQ0FBNEJnQixhQUFhbkYsS0FBYixDQUFtQnFFLFNBQS9DO2FBREg7aUJBR0tXLFVBQUwsR0FBa0IsS0FBbEI7aUJBQ0tELGFBQUwsR0FBcUIsRUFBckI7O2lCQUVLRSxjQUFMLEdBQXNCLElBQUl6TyxJQUFKLEdBQVdDLE9BQVgsRUFBdEI7Ozs7bUJBSU83UixHQUFmLEVBQ0E7WUFDUW1GLEtBQUssSUFBVDtVQUNFekosSUFBRixDQUFReUosR0FBRzhhLEdBQUgsQ0FBTzNWLFFBQWYsRUFBMEIsVUFBUzhRLEtBQVQsRUFBZTtrQkFDL0J4ZixPQUFOLENBQWNvRSxJQUFJM0QsSUFBbEIsSUFBMEIyRCxJQUFJOUQsS0FBOUI7U0FESjs7O2NBS084RCxHQUFYLEVBQ0E7O1lBRVFzSixPQUFPLElBQVg7WUFDSXRKLEdBQUosRUFBUzs7O2dCQUdEQSxJQUFJd2dCLFdBQUosSUFBbUIsU0FBdkIsRUFBaUM7b0JBQ3pCcEYsUUFBVXBiLElBQUlvYixLQUFsQjtvQkFDSXhOLFFBQVU1TixJQUFJNE4sS0FBbEI7b0JBQ0l2UixPQUFVMkQsSUFBSTNELElBQWxCO29CQUNJSCxRQUFVOEQsSUFBSTlELEtBQWxCO29CQUNJZ2QsV0FBVWxaLElBQUlrWixRQUFsQjs7b0JBRUl0TCxNQUFNNU0sSUFBTixJQUFjLFFBQWxCLEVBQTRCO3lCQUNuQnlmLGNBQUwsQ0FBb0J6Z0IsR0FBcEI7aUJBREosTUFFTzt3QkFDQSxDQUFDc0osS0FBSzZXLGFBQUwsQ0FBbUIvRSxNQUFNOVgsRUFBekIsQ0FBSixFQUFpQzs2QkFDeEI2YyxhQUFMLENBQW1CL0UsTUFBTTlYLEVBQXpCLElBQTZCO21DQUNqQjhYLEtBRGlCOzJDQUVUO3lCQUZwQjs7d0JBS0R4TixLQUFILEVBQVM7NEJBQ0QsQ0FBQ3RFLEtBQUs2VyxhQUFMLENBQW9CL0UsTUFBTTlYLEVBQTFCLEVBQStCb2QsYUFBL0IsQ0FBOEM5UyxNQUFNdEssRUFBcEQsQ0FBTCxFQUE4RDtpQ0FDckQ2YyxhQUFMLENBQW9CL0UsTUFBTTlYLEVBQTFCLEVBQStCb2QsYUFBL0IsQ0FBOEM5UyxNQUFNdEssRUFBcEQsSUFBeUQ7dUNBQzdDc0ssS0FENkM7NkNBRXZDNU4sSUFBSXdnQjs2QkFGdEI7eUJBREosTUFLTzs7Ozs7Ozs7Z0JBUWZ4Z0IsSUFBSXdnQixXQUFKLElBQW1CLFVBQXZCLEVBQWtDOztvQkFFMUJwaUIsU0FBUzRCLElBQUk1QixNQUFqQjtvQkFDSWdkLFFBQVFwYixJQUFJaEMsR0FBSixDQUFRMk0sUUFBUixFQUFaO29CQUNJeVEsU0FBVWhkLE9BQU80QyxJQUFQLElBQWEsT0FBM0IsRUFBcUM7OzRCQUV6Qm9hLFNBQVNoZCxNQUFqQjt3QkFDRyxDQUFDa0wsS0FBSzZXLGFBQUwsQ0FBbUIvRSxNQUFNOVgsRUFBekIsQ0FBSixFQUFrQzs2QkFDekI2YyxhQUFMLENBQW1CL0UsTUFBTTlYLEVBQXpCLElBQTZCO21DQUNqQjhYLEtBRGlCOzJDQUVUO3lCQUZwQjs7Ozs7Z0JBUVQsQ0FBQ3BiLElBQUl3Z0IsV0FBUixFQUFvQjs7b0JBRVpwRixRQUFRcGIsSUFBSW9iLEtBQWhCO29CQUNHLENBQUM5UixLQUFLNlcsYUFBTCxDQUFtQi9FLE1BQU05WCxFQUF6QixDQUFKLEVBQWtDO3lCQUN6QjZjLGFBQUwsQ0FBbUIvRSxNQUFNOVgsRUFBekIsSUFBNkI7K0JBQ2pCOFgsS0FEaUI7dUNBRVQ7cUJBRnBCOzs7U0FyRFosTUEyRE87O2NBRUQxZixJQUFGLENBQVE0TixLQUFLMlcsR0FBTCxDQUFTM1YsUUFBakIsRUFBNEIsVUFBVThRLEtBQVYsRUFBa0JoZ0IsQ0FBbEIsRUFBcUI7cUJBQ3hDK2tCLGFBQUwsQ0FBb0IvRSxNQUFNOVgsRUFBMUIsSUFBaUM7MkJBQ3JCOFgsS0FEcUI7bUNBRWI7aUJBRnBCO2FBREo7O1lBT0EsQ0FBQzlSLEtBQUs4VyxVQUFWLEVBQXFCOztpQkFFYkEsVUFBTCxHQUFrQixJQUFsQjtpQkFDS08sVUFBTDtTQUhILE1BSU87O2lCQUVDUCxVQUFMLEdBQWtCLElBQWxCOzs7OztBQ3hJSSxNQUFNUSxjQUFOLFNBQTZCYixjQUE3QixDQUNmO2dCQUNnQkUsR0FBWixFQUNBO2NBQ1VsRixjQUFjOEYsTUFBcEIsRUFBNEJaLEdBQTVCOzs7O0FDUFI7Ozs7Ozs7Ozs7Ozs7QUFhQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBR0E7QUFDQSxBQUNBLEFBR0EsSUFBSWEsY0FBYyxVQUFVOWdCLEdBQVYsRUFBZTtTQUN4QmdCLElBQUwsR0FBWSxRQUFaO1NBQ0srZixJQUFMLEdBQVksSUFBSW5QLElBQUosR0FBV0MsT0FBWCxLQUF1QixHQUF2QixHQUE2QnpVLEtBQUtzWSxLQUFMLENBQVd0WSxLQUFLNGpCLE1BQUwsS0FBYyxHQUF6QixDQUF6Qzs7U0FFS3hmLEVBQUwsR0FBVWtFLEVBQUV1YixLQUFGLENBQVFqaEIsSUFBSXdCLEVBQVosQ0FBVjs7U0FFS2lDLEtBQUwsR0FBYTRaLFNBQVMsV0FBWXJkLEdBQVosSUFBbUIsS0FBS3dCLEVBQUwsQ0FBUTBmLFdBQXBDLEVBQW1ELEVBQW5ELENBQWI7U0FDS3hkLE1BQUwsR0FBYzJaLFNBQVMsWUFBWXJkLEdBQVosSUFBbUIsS0FBS3dCLEVBQUwsQ0FBUTJmLFlBQXBDLEVBQW1ELEVBQW5ELENBQWQ7O1FBRUlDLFVBQVUxYixFQUFFMmIsVUFBRixDQUFhLEtBQUs1ZCxLQUFsQixFQUEwQixLQUFLQyxNQUEvQixFQUF1QyxLQUFLcWQsSUFBNUMsQ0FBZDtTQUNLamQsSUFBTCxHQUFZc2QsUUFBUXRkLElBQXBCO1NBQ0tHLE9BQUwsR0FBZW1kLFFBQVFuZCxPQUF2QjtTQUNLQyxLQUFMLEdBQWFrZCxRQUFRbGQsS0FBckI7O1NBRUsxQyxFQUFMLENBQVE4ZixTQUFSLEdBQW9CLEVBQXBCO1NBQ0s5ZixFQUFMLENBQVEyQyxXQUFSLENBQXFCLEtBQUtMLElBQTFCOztTQUVLNkIsVUFBTCxHQUFrQkQsRUFBRTZiLE1BQUYsQ0FBUyxLQUFLemQsSUFBZCxDQUFsQjtTQUNLMGQsU0FBTCxHQUFpQixDQUFqQixDQWxCNkI7O1NBb0J4QkMsUUFBTCxHQUFnQixJQUFJQyxjQUFKLENBQWMsSUFBZCxDQUFoQjs7U0FFSy9mLEtBQUwsR0FBYSxJQUFiOztTQUVLMkcsWUFBTCxHQUFvQixJQUFwQjs7O1NBR0sxQixjQUFMLEdBQXNCLElBQXRCO1FBQ0k1RyxJQUFJNEcsY0FBSixLQUF1QixLQUEzQixFQUFrQzthQUN6QkEsY0FBTCxHQUFzQixLQUF0Qjs7O2dCQUdRaEgsVUFBWixDQUF1QmxDLFdBQXZCLENBQW1Dd04sS0FBbkMsQ0FBeUMsSUFBekMsRUFBK0M3TSxTQUEvQztDQWhDSjs7QUFtQ0FHLE1BQU11TCxVQUFOLENBQWlCK1csV0FBakIsRUFBK0JuQyxzQkFBL0IsRUFBd0Q7VUFDN0MsWUFBVTthQUNSL2lCLE9BQUwsQ0FBYTZILEtBQWIsR0FBc0IsS0FBS0EsS0FBM0I7YUFDSzdILE9BQUwsQ0FBYThILE1BQWIsR0FBc0IsS0FBS0EsTUFBM0I7OzthQUdLaWUsZ0JBQUw7OzthQUdLQyxtQkFBTDtLQVRnRDtpQkFZdEMsVUFBUzVoQixHQUFULEVBQWE7O2FBRWxCMkIsS0FBTCxHQUFhLElBQUkyQyxZQUFKLENBQWtCLElBQWxCLEVBQXlCdEUsR0FBekIsQ0FBYixDQUEyQzthQUN0QzJCLEtBQUwsQ0FBVzhaLElBQVg7ZUFDTyxLQUFLOVosS0FBWjtLQWhCZ0Q7WUFrQjNDLFVBQVUzQixHQUFWLEVBQWU7O2FBRWZ5RCxLQUFMLEdBQWtCNFosU0FBVXJkLE9BQU8sV0FBV0EsR0FBbkIsSUFBMkIsS0FBS3dCLEVBQUwsQ0FBUTBmLFdBQTVDLEVBQTJELEVBQTNELENBQWxCO2FBQ0t4ZCxNQUFMLEdBQWtCMlosU0FBVXJkLE9BQU8sWUFBWUEsR0FBcEIsSUFBNEIsS0FBS3dCLEVBQUwsQ0FBUTJmLFlBQTdDLEVBQTRELEVBQTVELENBQWxCOzthQUVLcmQsSUFBTCxDQUFVUCxLQUFWLENBQWdCRSxLQUFoQixHQUF5QixLQUFLQSxLQUFMLEdBQVksSUFBckM7YUFDS0ssSUFBTCxDQUFVUCxLQUFWLENBQWdCRyxNQUFoQixHQUF5QixLQUFLQSxNQUFMLEdBQVksSUFBckM7O2FBRUtpQyxVQUFMLEdBQXNCRCxFQUFFNmIsTUFBRixDQUFTLEtBQUt6ZCxJQUFkLENBQXRCO2FBQ0srRSxTQUFMLEdBQXNCLElBQXRCO2FBQ0tqTixPQUFMLENBQWE2SCxLQUFiLEdBQXNCLEtBQUtBLEtBQTNCO2FBQ0s3SCxPQUFMLENBQWE4SCxNQUFiLEdBQXNCLEtBQUtBLE1BQTNCO2FBQ0ttRixTQUFMLEdBQXNCLEtBQXRCOztZQUVJMUQsS0FBSyxJQUFUO1lBQ0kwYyxlQUFrQixVQUFTM0QsR0FBVCxFQUFhO2dCQUMzQnJlLFNBQVNxZSxJQUFJcmUsTUFBakI7bUJBQ08wRCxLQUFQLENBQWFFLEtBQWIsR0FBcUIwQixHQUFHMUIsS0FBSCxHQUFXLElBQWhDO21CQUNPRixLQUFQLENBQWFHLE1BQWIsR0FBcUJ5QixHQUFHekIsTUFBSCxHQUFXLElBQWhDO21CQUNPQyxZQUFQLENBQW9CLE9BQXBCLEVBQStCd0IsR0FBRzFCLEtBQUgsR0FBV2pGLE1BQU1vaEIsaUJBQWhEO21CQUNPamMsWUFBUCxDQUFvQixRQUFwQixFQUErQndCLEdBQUd6QixNQUFILEdBQVdsRixNQUFNb2hCLGlCQUFoRDs7O2dCQUdJMUIsSUFBSTRELE1BQVIsRUFBZ0I7b0JBQ1JBLE1BQUosQ0FBVzNjLEdBQUcxQixLQUFkLEVBQXNCMEIsR0FBR3pCLE1BQXpCOztTQVRSO1lBWUVoSSxJQUFGLENBQU8sS0FBSzRPLFFBQVosRUFBdUIsVUFBUy9LLENBQVQsRUFBYW5FLENBQWIsRUFBZTtjQUNoQ3lOLFNBQUYsR0FBa0IsSUFBbEI7Y0FDRWpOLE9BQUYsQ0FBVTZILEtBQVYsR0FBa0IwQixHQUFHMUIsS0FBckI7Y0FDRTdILE9BQUYsQ0FBVThILE1BQVYsR0FBa0J5QixHQUFHekIsTUFBckI7eUJBQ2FuRSxFQUFFa2dCLFNBQWY7Y0FDRTVXLFNBQUYsR0FBa0IsS0FBbEI7U0FMSjs7YUFRSzNFLEtBQUwsQ0FBV1gsS0FBWCxDQUFpQkUsS0FBakIsR0FBMEIsS0FBS0EsS0FBTCxHQUFjLElBQXhDO2FBQ0tTLEtBQUwsQ0FBV1gsS0FBWCxDQUFpQkcsTUFBakIsR0FBMEIsS0FBS0EsTUFBTCxHQUFjLElBQXhDOzthQUVLc0YsU0FBTDtLQXhEZ0Q7bUJBMkRwQyxZQUFVO2VBQ2YsS0FBS1YsWUFBWjtLQTVEZ0Q7c0JBOERqQyxZQUFVOzthQUVwQkEsWUFBTCxHQUFvQixJQUFJa1gsS0FBSixDQUFXO2dCQUN0QixnQkFBZSxJQUFJNU4sSUFBSixFQUFELENBQWFDLE9BQWIsRUFEUTtxQkFFakI7dUJBQ0UsS0FBS2pXLE9BQUwsQ0FBYTZILEtBRGY7d0JBRUUsS0FBSzdILE9BQUwsQ0FBYThIOztTQUpULENBQXBCOzthQVFLNEUsWUFBTCxDQUFrQm1CLGFBQWxCLEdBQWtDLEtBQWxDO2FBQ0tzWSxRQUFMLENBQWUsS0FBS3paLFlBQXBCO0tBekVnRDs7Ozs7eUJBK0U5QixZQUFXO1lBQ3pCMFosZUFBZXRjLEVBQUV1YixLQUFGLENBQVEsY0FBUixDQUFuQjtZQUNHLENBQUNlLFlBQUosRUFBaUI7MkJBQ0V0YyxFQUFFdWMsWUFBRixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsY0FBckIsQ0FBZjtTQURKLE1BRU87Ozs7aUJBSUVoZ0IsSUFBVCxDQUFja0MsV0FBZCxDQUEyQjZkLFlBQTNCO2NBQ01qaUIsV0FBTixDQUFtQmlpQixZQUFuQjtZQUNJeGpCLE1BQU0wakIsYUFBTixFQUFKLEVBQTJCOzt5QkFFVjNlLEtBQWIsQ0FBbUI0ZSxPQUFuQixHQUFnQyxNQUFoQztTQUZKLE1BR087O3lCQUVVNWUsS0FBYixDQUFtQjZlLE1BQW5CLEdBQWdDLENBQUMsQ0FBakM7eUJBQ2E3ZSxLQUFiLENBQW1CQyxRQUFuQixHQUFnQyxVQUFoQzt5QkFDYUQsS0FBYixDQUFtQmYsSUFBbkIsR0FBZ0MsQ0FBQyxLQUFLNUcsT0FBTCxDQUFhNkgsS0FBZCxHQUF1QixJQUF2RDt5QkFDYUYsS0FBYixDQUFtQlosR0FBbkIsR0FBZ0MsQ0FBQyxLQUFLL0csT0FBTCxDQUFhOEgsTUFBZCxHQUF1QixJQUF2RDt5QkFDYUgsS0FBYixDQUFtQjhlLFVBQW5CLEdBQWdDLFFBQWhDOztjQUVFQyxTQUFOLEdBQWtCTixhQUFhaGpCLFVBQWIsQ0FBd0IsSUFBeEIsQ0FBbEI7S0FwR2dEOztzQkF1R2pDLFlBQVU7WUFDckJvUyxNQUFNLElBQUlRLElBQUosR0FBV0MsT0FBWCxFQUFWO1lBQ0lULE1BQU0sS0FBS29RLFNBQVgsR0FBdUIsSUFBM0IsRUFBaUM7aUJBQ3hCN2IsVUFBTCxHQUF1QkQsRUFBRTZiLE1BQUYsQ0FBUyxLQUFLemQsSUFBZCxDQUF2QjtpQkFDSzBkLFNBQUwsR0FBdUJwUSxHQUF2Qjs7S0EzRzRDOztvQkErR25DLFVBQVVnSyxLQUFWLEVBQWtCamYsS0FBbEIsRUFBeUI7WUFDbEMwRCxNQUFKOztZQUVHLENBQUN1YixNQUFNcUUsU0FBVixFQUFvQjtxQkFDUC9aLEVBQUV1YyxZQUFGLENBQWdCLEtBQUtybUIsT0FBTCxDQUFhNkgsS0FBN0IsRUFBcUMsS0FBSzdILE9BQUwsQ0FBYThILE1BQWxELEVBQTBEMFgsTUFBTTlYLEVBQWhFLENBQVQ7U0FESixNQUVPO3FCQUNNOFgsTUFBTXFFLFNBQU4sQ0FBZ0I1ZixNQUF6Qjs7O1lBR0QsS0FBS3lLLFFBQUwsQ0FBY25QLE1BQWQsSUFBd0IsQ0FBM0IsRUFBNkI7aUJBQ3BCOEksT0FBTCxDQUFhRSxXQUFiLENBQTBCdEUsTUFBMUI7U0FESixNQUVPLElBQUcsS0FBS3lLLFFBQUwsQ0FBY25QLE1BQWQsR0FBcUIsQ0FBeEIsRUFBMkI7Z0JBQzFCZ0IsU0FBUzBCLFNBQWIsRUFBeUI7O3FCQUVoQm9HLE9BQUwsQ0FBYXNlLFlBQWIsQ0FBMkIxaUIsTUFBM0IsRUFBb0MsS0FBS3lJLFlBQUwsQ0FBa0JtWCxTQUFsQixDQUE0QjVmLE1BQWhFO2FBRkosTUFHTzs7b0JBRUMxRCxTQUFTLEtBQUttTyxRQUFMLENBQWNuUCxNQUFkLEdBQXFCLENBQWxDLEVBQXFDO3lCQUM3QjhJLE9BQUwsQ0FBYUUsV0FBYixDQUEwQnRFLE1BQTFCO2lCQURILE1BRU87eUJBQ0NvRSxPQUFMLENBQWFzZSxZQUFiLENBQTJCMWlCLE1BQTNCLEVBQW9DLEtBQUt5SyxRQUFMLENBQWVuTyxLQUFmLEVBQXVCc2pCLFNBQXZCLENBQWlDNWYsTUFBckU7Ozs7O2NBS0xFLFdBQU4sQ0FBbUJGLE1BQW5CO2NBQ00yaUIsU0FBTixDQUFpQjNpQixPQUFPYixVQUFQLENBQWtCLElBQWxCLENBQWpCLEVBQTJDLEtBQUtwRCxPQUFMLENBQWE2SCxLQUF4RCxFQUFnRSxLQUFLN0gsT0FBTCxDQUFhOEgsTUFBN0U7S0F6SWdEO29CQTJJbkMsVUFBUzBYLEtBQVQsRUFBZTthQUN2Qm5YLE9BQUwsQ0FBYXlhLFdBQWIsQ0FBMEJ0RCxNQUFNcUUsU0FBTixDQUFnQjVmLE1BQTFDO0tBNUlnRDs7ZUErSXhDLFVBQVNHLEdBQVQsRUFBYTthQUNoQnloQixRQUFMLENBQWN6WSxTQUFkLENBQXdCaEosR0FBeEI7O0NBaEpSLEVBb0pBOztBQ2hOQTs7Ozs7OztBQU9BLEFBQ0EsQUFFQSxJQUFJeWlCLFNBQVMsWUFBVTtTQUNkemhCLElBQUwsR0FBWSxRQUFaO1dBQ09wQixVQUFQLENBQWtCbEMsV0FBbEIsQ0FBOEJ3TixLQUE5QixDQUFvQyxJQUFwQyxFQUEwQzdNLFNBQTFDO0NBRko7O0FBS0FHLE1BQU11TCxVQUFOLENBQWlCMFksTUFBakIsRUFBMEI5RCxzQkFBMUIsRUFBbUQ7VUFDeEMsWUFBVTtDQURyQixFQU1BOztBQ3JCZSxNQUFNK0QsWUFBTixDQUNmO2dCQUNnQjNULFNBQVosRUFBdUI0VCxTQUF2QixFQUFrQ0MsU0FBbEMsRUFBNkNDLFNBQTdDLEVBQXdEQyxTQUF4RCxFQUFtRUMsSUFBbkUsRUFBeUVuVixLQUF6RSxFQUNBO2FBQ1NtQixTQUFMLEdBQWlCQSxTQUFqQjthQUNLNFQsU0FBTCxHQUFpQkEsU0FBakI7YUFDS0MsU0FBTCxHQUFpQkEsU0FBakI7YUFDS0ksU0FBTCxHQUFpQkwsU0FBakI7YUFDS0UsU0FBTCxHQUFpQkEsU0FBakI7YUFDS0MsU0FBTCxHQUFpQkEsU0FBakI7YUFDS0csU0FBTCxHQUFpQkosU0FBakI7YUFDS0UsSUFBTCxHQUFZQSxJQUFaO2FBQ0tHLEtBQUwsR0FBYSxFQUFiO2FBQ0t0VixLQUFMLEdBQWFBLEtBQWI7YUFDSzVNLElBQUwsR0FBWTRNLE1BQU01TSxJQUFsQjs7O1lBSUo7ZUFDVyxJQUFJMGhCLFlBQUosQ0FDSCxLQUFLM1QsU0FERixFQUVILEtBQUs0VCxTQUZGLEVBR0gsS0FBS0MsU0FIRixFQUlILEtBQUtDLFNBSkYsRUFLSCxLQUFLQyxTQUxGLEVBTUgsS0FBS0MsSUFORixFQU9ILEtBQUtuVixLQVBGLENBQVA7OztZQVdJQSxLQUFSLEVBQ0E7YUFDU3NWLEtBQUwsQ0FBVzFuQixJQUFYLENBQWdCb1MsS0FBaEI7OztjQUlKO2FBQ1NBLEtBQUwsR0FBYSxJQUFiO2FBQ0tzVixLQUFMLEdBQWEsSUFBYjs7Ozs7QUN0Q1I7Ozs7Ozs7QUFPQSxBQUFlLE1BQU0zaUIsT0FBTixDQUNmOzs7OztjQUtnQkMsSUFBSSxDQUFoQixFQUFtQkMsSUFBSSxDQUF2QixFQUNBOzs7OztTQUtTRCxDQUFMLEdBQVNBLENBQVQ7Ozs7OztTQU1LQyxDQUFMLEdBQVNBLENBQVQ7Ozs7Ozs7O1VBU0o7V0FDVyxJQUFJRixPQUFKLENBQVUsS0FBS0MsQ0FBZixFQUFrQixLQUFLQyxDQUF2QixDQUFQOzs7Ozs7OztPQVFDRSxDQUFMLEVBQ0E7U0FDU3laLEdBQUwsQ0FBU3paLEVBQUVILENBQVgsRUFBY0csRUFBRUYsQ0FBaEI7Ozs7Ozs7OztTQVNHRSxDQUFQLEVBQ0E7V0FDWUEsRUFBRUgsQ0FBRixLQUFRLEtBQUtBLENBQWQsSUFBcUJHLEVBQUVGLENBQUYsS0FBUSxLQUFLQSxDQUF6Qzs7Ozs7Ozs7OztNQVVBRCxDQUFKLEVBQU9DLENBQVAsRUFDQTtTQUNTRCxDQUFMLEdBQVNBLEtBQUssQ0FBZDtTQUNLQyxDQUFMLEdBQVNBLE1BQU9BLE1BQU0sQ0FBUCxHQUFZLEtBQUtELENBQWpCLEdBQXFCLENBQTNCLENBQVQ7Ozs7O0FDbkVSOzs7Ozs7Ozs7O0FBVUEsQUFBZSxNQUFNNEssUUFBTixDQUNmOzs7O2tCQUtJOzs7OzthQUtTQyxDQUFMLEdBQVMsQ0FBVDs7Ozs7O2FBTUtDLENBQUwsR0FBUyxDQUFUOzs7Ozs7YUFNS0MsQ0FBTCxHQUFTLENBQVQ7Ozs7OzthQU1LQyxDQUFMLEdBQVMsQ0FBVDs7Ozs7O2FBTUtDLEVBQUwsR0FBVSxDQUFWOzs7Ozs7YUFNS0MsRUFBTCxHQUFVLENBQVY7O2FBRUs1UCxLQUFMLEdBQWEsSUFBYjs7Ozs7Ozs7Ozs7Ozs7O2NBZU1BLEtBQVYsRUFDQTthQUNTdVAsQ0FBTCxHQUFTdlAsTUFBTSxDQUFOLENBQVQ7YUFDS3dQLENBQUwsR0FBU3hQLE1BQU0sQ0FBTixDQUFUO2FBQ0t5UCxDQUFMLEdBQVN6UCxNQUFNLENBQU4sQ0FBVDthQUNLMFAsQ0FBTCxHQUFTMVAsTUFBTSxDQUFOLENBQVQ7YUFDSzJQLEVBQUwsR0FBVTNQLE1BQU0sQ0FBTixDQUFWO2FBQ0s0UCxFQUFMLEdBQVU1UCxNQUFNLENBQU4sQ0FBVjs7Ozs7Ozs7Ozs7Ozs7O1FBZUF1UCxDQUFKLEVBQU9DLENBQVAsRUFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWdCQyxFQUFoQixFQUFvQkMsRUFBcEIsRUFDQTthQUNTTCxDQUFMLEdBQVNBLENBQVQ7YUFDS0MsQ0FBTCxHQUFTQSxDQUFUO2FBQ0tDLENBQUwsR0FBU0EsQ0FBVDthQUNLQyxDQUFMLEdBQVNBLENBQVQ7YUFDS0MsRUFBTCxHQUFVQSxFQUFWO2FBQ0tDLEVBQUwsR0FBVUEsRUFBVjs7ZUFFTyxJQUFQOzs7Ozs7Ozs7O1lBVUl5WCxTQUFSLEVBQW1CalcsR0FBbkIsRUFDQTtZQUNRLENBQUMsS0FBS3BSLEtBQVYsRUFDQTtpQkFDU0EsS0FBTCxHQUFhLElBQUlzbkIsWUFBSixDQUFpQixDQUFqQixDQUFiOzs7Y0FHRXRuQixRQUFRb1IsT0FBTyxLQUFLcFIsS0FBMUI7O1lBRUlxbkIsU0FBSixFQUNBO2tCQUNVLENBQU4sSUFBVyxLQUFLOVgsQ0FBaEI7a0JBQ00sQ0FBTixJQUFXLEtBQUtDLENBQWhCO2tCQUNNLENBQU4sSUFBVyxDQUFYO2tCQUNNLENBQU4sSUFBVyxLQUFLQyxDQUFoQjtrQkFDTSxDQUFOLElBQVcsS0FBS0MsQ0FBaEI7a0JBQ00sQ0FBTixJQUFXLENBQVg7a0JBQ00sQ0FBTixJQUFXLEtBQUtDLEVBQWhCO2tCQUNNLENBQU4sSUFBVyxLQUFLQyxFQUFoQjtrQkFDTSxDQUFOLElBQVcsQ0FBWDtTQVZKLE1BYUE7a0JBQ1UsQ0FBTixJQUFXLEtBQUtMLENBQWhCO2tCQUNNLENBQU4sSUFBVyxLQUFLRSxDQUFoQjtrQkFDTSxDQUFOLElBQVcsS0FBS0UsRUFBaEI7a0JBQ00sQ0FBTixJQUFXLEtBQUtILENBQWhCO2tCQUNNLENBQU4sSUFBVyxLQUFLRSxDQUFoQjtrQkFDTSxDQUFOLElBQVcsS0FBS0UsRUFBaEI7a0JBQ00sQ0FBTixJQUFXLENBQVg7a0JBQ00sQ0FBTixJQUFXLENBQVg7a0JBQ00sQ0FBTixJQUFXLENBQVg7OztlQUdHNVAsS0FBUDs7Ozs7Ozs7Ozs7VUFXRXVuQixHQUFOLEVBQVdDLE1BQVgsRUFDQTtpQkFDYUEsVUFBVSxJQUFJL2lCLE9BQUosRUFBbkI7O2NBRU1DLElBQUk2aUIsSUFBSTdpQixDQUFkO2NBQ01DLElBQUk0aUIsSUFBSTVpQixDQUFkOztlQUVPRCxDQUFQLEdBQVksS0FBSzZLLENBQUwsR0FBUzdLLENBQVYsR0FBZ0IsS0FBSytLLENBQUwsR0FBUzlLLENBQXpCLEdBQThCLEtBQUtnTCxFQUE5QztlQUNPaEwsQ0FBUCxHQUFZLEtBQUs2SyxDQUFMLEdBQVM5SyxDQUFWLEdBQWdCLEtBQUtnTCxDQUFMLEdBQVMvSyxDQUF6QixHQUE4QixLQUFLaUwsRUFBOUM7O2VBRU80WCxNQUFQOzs7Ozs7Ozs7OztpQkFXU0QsR0FBYixFQUFrQkMsTUFBbEIsRUFDQTtpQkFDYUEsVUFBVSxJQUFJL2lCLE9BQUosRUFBbkI7O2NBRU0rQyxLQUFLLEtBQU0sS0FBSytILENBQUwsR0FBUyxLQUFLRyxDQUFmLEdBQXFCLEtBQUtELENBQUwsR0FBUyxDQUFDLEtBQUtELENBQXpDLENBQVg7O2NBRU05SyxJQUFJNmlCLElBQUk3aUIsQ0FBZDtjQUNNQyxJQUFJNGlCLElBQUk1aUIsQ0FBZDs7ZUFFT0QsQ0FBUCxHQUFZLEtBQUtnTCxDQUFMLEdBQVNsSSxFQUFULEdBQWM5QyxDQUFmLEdBQXFCLENBQUMsS0FBSytLLENBQU4sR0FBVWpJLEVBQVYsR0FBZTdDLENBQXBDLEdBQTBDLENBQUUsS0FBS2lMLEVBQUwsR0FBVSxLQUFLSCxDQUFoQixHQUFzQixLQUFLRSxFQUFMLEdBQVUsS0FBS0QsQ0FBdEMsSUFBNENsSSxFQUFqRztlQUNPN0MsQ0FBUCxHQUFZLEtBQUs0SyxDQUFMLEdBQVMvSCxFQUFULEdBQWM3QyxDQUFmLEdBQXFCLENBQUMsS0FBSzZLLENBQU4sR0FBVWhJLEVBQVYsR0FBZTlDLENBQXBDLEdBQTBDLENBQUUsQ0FBQyxLQUFLa0wsRUFBTixHQUFXLEtBQUtMLENBQWpCLEdBQXVCLEtBQUtJLEVBQUwsR0FBVSxLQUFLSCxDQUF2QyxJQUE2Q2hJLEVBQWxHOztlQUVPZ2dCLE1BQVA7Ozs7Ozs7Ozs7Y0FVTTlpQixDQUFWLEVBQWFDLENBQWIsRUFDQTthQUNTZ0wsRUFBTCxJQUFXakwsQ0FBWDthQUNLa0wsRUFBTCxJQUFXakwsQ0FBWDs7ZUFFTyxJQUFQOzs7Ozs7Ozs7O1VBVUVELENBQU4sRUFBU0MsQ0FBVCxFQUNBO2FBQ1M0SyxDQUFMLElBQVU3SyxDQUFWO2FBQ0tnTCxDQUFMLElBQVUvSyxDQUFWO2FBQ0s4SyxDQUFMLElBQVUvSyxDQUFWO2FBQ0s4SyxDQUFMLElBQVU3SyxDQUFWO2FBQ0tnTCxFQUFMLElBQVdqTCxDQUFYO2FBQ0trTCxFQUFMLElBQVdqTCxDQUFYOztlQUVPLElBQVA7Ozs7Ozs7OztXQVNHMEwsS0FBUCxFQUNBO2NBQ1VKLE1BQU0zTyxLQUFLMk8sR0FBTCxDQUFTSSxLQUFULENBQVo7Y0FDTUgsTUFBTTVPLEtBQUs0TyxHQUFMLENBQVNHLEtBQVQsQ0FBWjs7Y0FFTW9YLEtBQUssS0FBS2xZLENBQWhCO2NBQ01tWSxLQUFLLEtBQUtqWSxDQUFoQjtjQUNNa1ksTUFBTSxLQUFLaFksRUFBakI7O2FBRUtKLENBQUwsR0FBVWtZLEtBQUt4WCxHQUFOLEdBQWMsS0FBS1QsQ0FBTCxHQUFTVSxHQUFoQzthQUNLVixDQUFMLEdBQVVpWSxLQUFLdlgsR0FBTixHQUFjLEtBQUtWLENBQUwsR0FBU1MsR0FBaEM7YUFDS1IsQ0FBTCxHQUFVaVksS0FBS3pYLEdBQU4sR0FBYyxLQUFLUCxDQUFMLEdBQVNRLEdBQWhDO2FBQ0tSLENBQUwsR0FBVWdZLEtBQUt4WCxHQUFOLEdBQWMsS0FBS1IsQ0FBTCxHQUFTTyxHQUFoQzthQUNLTixFQUFMLEdBQVdnWSxNQUFNMVgsR0FBUCxHQUFlLEtBQUtMLEVBQUwsR0FBVU0sR0FBbkM7YUFDS04sRUFBTCxHQUFXK1gsTUFBTXpYLEdBQVAsR0FBZSxLQUFLTixFQUFMLEdBQVVLLEdBQW5DOztlQUVPLElBQVA7Ozs7Ozs7OztXQVNHMlgsTUFBUCxFQUNBO2NBQ1VILEtBQUssS0FBS2xZLENBQWhCO2NBQ01zWSxLQUFLLEtBQUtyWSxDQUFoQjtjQUNNa1ksS0FBSyxLQUFLalksQ0FBaEI7Y0FDTXFZLEtBQUssS0FBS3BZLENBQWhCOzthQUVLSCxDQUFMLEdBQVVxWSxPQUFPclksQ0FBUCxHQUFXa1ksRUFBWixHQUFtQkcsT0FBT3BZLENBQVAsR0FBV2tZLEVBQXZDO2FBQ0tsWSxDQUFMLEdBQVVvWSxPQUFPclksQ0FBUCxHQUFXc1ksRUFBWixHQUFtQkQsT0FBT3BZLENBQVAsR0FBV3NZLEVBQXZDO2FBQ0tyWSxDQUFMLEdBQVVtWSxPQUFPblksQ0FBUCxHQUFXZ1ksRUFBWixHQUFtQkcsT0FBT2xZLENBQVAsR0FBV2dZLEVBQXZDO2FBQ0toWSxDQUFMLEdBQVVrWSxPQUFPblksQ0FBUCxHQUFXb1ksRUFBWixHQUFtQkQsT0FBT2xZLENBQVAsR0FBV29ZLEVBQXZDOzthQUVLblksRUFBTCxHQUFXaVksT0FBT2pZLEVBQVAsR0FBWThYLEVBQWIsR0FBb0JHLE9BQU9oWSxFQUFQLEdBQVk4WCxFQUFoQyxHQUFzQyxLQUFLL1gsRUFBckQ7YUFDS0MsRUFBTCxHQUFXZ1ksT0FBT2pZLEVBQVAsR0FBWWtZLEVBQWIsR0FBb0JELE9BQU9oWSxFQUFQLEdBQVlrWSxFQUFoQyxHQUFzQyxLQUFLbFksRUFBckQ7O2VBRU8sSUFBUDs7Ozs7Ozs7Ozs7Ozs7Ozs7aUJBaUJTbEwsQ0FBYixFQUFnQkMsQ0FBaEIsRUFBbUJvakIsTUFBbkIsRUFBMkJDLE1BQTNCLEVBQW1DbFksTUFBbkMsRUFBMkNDLE1BQTNDLEVBQW1EQyxRQUFuRCxFQUE2RGlZLEtBQTdELEVBQW9FQyxLQUFwRSxFQUNBO2NBQ1VDLEtBQUs3bUIsS0FBSzRPLEdBQUwsQ0FBU0YsUUFBVCxDQUFYO2NBQ01vWSxLQUFLOW1CLEtBQUsyTyxHQUFMLENBQVNELFFBQVQsQ0FBWDtjQUNNcVksS0FBSy9tQixLQUFLMk8sR0FBTCxDQUFTaVksS0FBVCxDQUFYO2NBQ014WCxLQUFLcFAsS0FBSzRPLEdBQUwsQ0FBU2dZLEtBQVQsQ0FBWDtjQUNNSSxNQUFNLENBQUNobkIsS0FBSzRPLEdBQUwsQ0FBUytYLEtBQVQsQ0FBYjtjQUNNTSxLQUFLam5CLEtBQUsyTyxHQUFMLENBQVNnWSxLQUFULENBQVg7O2NBRU0xWSxJQUFJNlksS0FBS3RZLE1BQWY7Y0FDTU4sSUFBSTJZLEtBQUtyWSxNQUFmO2NBQ01MLElBQUksQ0FBQzBZLEVBQUQsR0FBTXBZLE1BQWhCO2NBQ01MLElBQUkwWSxLQUFLclksTUFBZjs7YUFFS1IsQ0FBTCxHQUFVOFksS0FBSzlZLENBQU4sR0FBWW1CLEtBQUtqQixDQUExQjthQUNLRCxDQUFMLEdBQVU2WSxLQUFLN1ksQ0FBTixHQUFZa0IsS0FBS2hCLENBQTFCO2FBQ0tELENBQUwsR0FBVTZZLE1BQU0vWSxDQUFQLEdBQWFnWixLQUFLOVksQ0FBM0I7YUFDS0MsQ0FBTCxHQUFVNFksTUFBTTlZLENBQVAsR0FBYStZLEtBQUs3WSxDQUEzQjs7YUFFS0MsRUFBTCxHQUFVakwsS0FBTXFqQixTQUFTeFksQ0FBVixHQUFnQnlZLFNBQVN2WSxDQUE5QixDQUFWO2FBQ0tHLEVBQUwsR0FBVWpMLEtBQU1vakIsU0FBU3ZZLENBQVYsR0FBZ0J3WSxTQUFTdFksQ0FBOUIsQ0FBVjs7ZUFFTyxJQUFQOzs7Ozs7Ozs7WUFTSWtZLE1BQVIsRUFDQTtjQUNVRCxNQUFNLEtBQUtoWSxFQUFqQjs7WUFFSWlZLE9BQU9yWSxDQUFQLEtBQWEsQ0FBYixJQUFrQnFZLE9BQU9wWSxDQUFQLEtBQWEsQ0FBL0IsSUFBb0NvWSxPQUFPblksQ0FBUCxLQUFhLENBQWpELElBQXNEbVksT0FBT2xZLENBQVAsS0FBYSxDQUF2RSxFQUNBO2tCQUNVK1gsS0FBSyxLQUFLbFksQ0FBaEI7a0JBQ01tWSxLQUFLLEtBQUtqWSxDQUFoQjs7aUJBRUtGLENBQUwsR0FBVWtZLEtBQUtHLE9BQU9yWSxDQUFiLEdBQW1CLEtBQUtDLENBQUwsR0FBU29ZLE9BQU9uWSxDQUE1QztpQkFDS0QsQ0FBTCxHQUFVaVksS0FBS0csT0FBT3BZLENBQWIsR0FBbUIsS0FBS0EsQ0FBTCxHQUFTb1ksT0FBT2xZLENBQTVDO2lCQUNLRCxDQUFMLEdBQVVpWSxLQUFLRSxPQUFPclksQ0FBYixHQUFtQixLQUFLRyxDQUFMLEdBQVNrWSxPQUFPblksQ0FBNUM7aUJBQ0tDLENBQUwsR0FBVWdZLEtBQUtFLE9BQU9wWSxDQUFiLEdBQW1CLEtBQUtFLENBQUwsR0FBU2tZLE9BQU9sWSxDQUE1Qzs7O2FBR0NDLEVBQUwsR0FBV2dZLE1BQU1DLE9BQU9yWSxDQUFkLEdBQW9CLEtBQUtLLEVBQUwsR0FBVWdZLE9BQU9uWSxDQUFyQyxHQUEwQ21ZLE9BQU9qWSxFQUEzRDthQUNLQyxFQUFMLEdBQVcrWCxNQUFNQyxPQUFPcFksQ0FBZCxHQUFvQixLQUFLSSxFQUFMLEdBQVVnWSxPQUFPbFksQ0FBckMsR0FBMENrWSxPQUFPaFksRUFBM0Q7O2VBRU8sSUFBUDs7Ozs7Ozs7O2NBU000UyxTQUFWLEVBQ0E7O2NBRVVqVCxJQUFJLEtBQUtBLENBQWY7Y0FDTUMsSUFBSSxLQUFLQSxDQUFmO2NBQ01DLElBQUksS0FBS0EsQ0FBZjtjQUNNQyxJQUFJLEtBQUtBLENBQWY7O2NBRU11WSxRQUFRLENBQUMzbUIsS0FBS3lTLEtBQUwsQ0FBVyxDQUFDdEUsQ0FBWixFQUFlQyxDQUFmLENBQWY7Y0FDTXdZLFFBQVE1bUIsS0FBS3lTLEtBQUwsQ0FBV3ZFLENBQVgsRUFBY0QsQ0FBZCxDQUFkOztjQUVNaVosUUFBUWxuQixLQUFLaVAsR0FBTCxDQUFTMFgsUUFBUUMsS0FBakIsQ0FBZDs7WUFFSU0sUUFBUSxPQUFaLEVBQ0E7c0JBQ2N4WSxRQUFWLEdBQXFCa1ksS0FBckI7O2dCQUVJM1ksSUFBSSxDQUFKLElBQVNHLEtBQUssQ0FBbEIsRUFDQTswQkFDY00sUUFBVixJQUF1QndTLFVBQVV4UyxRQUFWLElBQXNCLENBQXZCLEdBQTRCMU8sS0FBSzZPLEVBQWpDLEdBQXNDLENBQUM3TyxLQUFLNk8sRUFBbEU7OztzQkFHTXNZLElBQVYsQ0FBZS9qQixDQUFmLEdBQW1COGQsVUFBVWlHLElBQVYsQ0FBZTlqQixDQUFmLEdBQW1CLENBQXRDO1NBVEosTUFZQTtzQkFDYzhqQixJQUFWLENBQWUvakIsQ0FBZixHQUFtQnVqQixLQUFuQjtzQkFDVVEsSUFBVixDQUFlOWpCLENBQWYsR0FBbUJ1akIsS0FBbkI7Ozs7a0JBSU05RyxLQUFWLENBQWdCMWMsQ0FBaEIsR0FBb0JwRCxLQUFLZ1ksSUFBTCxDQUFXL0osSUFBSUEsQ0FBTCxHQUFXQyxJQUFJQSxDQUF6QixDQUFwQjtrQkFDVTRSLEtBQVYsQ0FBZ0J6YyxDQUFoQixHQUFvQnJELEtBQUtnWSxJQUFMLENBQVc3SixJQUFJQSxDQUFMLEdBQVdDLElBQUlBLENBQXpCLENBQXBCOzs7a0JBR1VoSSxRQUFWLENBQW1CaEQsQ0FBbkIsR0FBdUIsS0FBS2lMLEVBQTVCO2tCQUNVakksUUFBVixDQUFtQi9DLENBQW5CLEdBQXVCLEtBQUtpTCxFQUE1Qjs7ZUFFTzRTLFNBQVA7Ozs7Ozs7O2FBU0o7Y0FDVWlGLEtBQUssS0FBS2xZLENBQWhCO2NBQ01zWSxLQUFLLEtBQUtyWSxDQUFoQjtjQUNNa1ksS0FBSyxLQUFLalksQ0FBaEI7Y0FDTXFZLEtBQUssS0FBS3BZLENBQWhCO2NBQ01pWSxNQUFNLEtBQUtoWSxFQUFqQjtjQUNNcUYsSUFBS3lTLEtBQUtLLEVBQU4sR0FBYUQsS0FBS0gsRUFBNUI7O2FBRUtuWSxDQUFMLEdBQVN1WSxLQUFLOVMsQ0FBZDthQUNLeEYsQ0FBTCxHQUFTLENBQUNxWSxFQUFELEdBQU03UyxDQUFmO2FBQ0t2RixDQUFMLEdBQVMsQ0FBQ2lZLEVBQUQsR0FBTTFTLENBQWY7YUFDS3RGLENBQUwsR0FBUytYLEtBQUt6UyxDQUFkO2FBQ0tyRixFQUFMLEdBQVUsQ0FBRStYLEtBQUssS0FBSzlYLEVBQVgsR0FBa0JrWSxLQUFLSCxHQUF4QixJQUFnQzNTLENBQTFDO2FBQ0twRixFQUFMLEdBQVUsRUFBRzZYLEtBQUssS0FBSzdYLEVBQVgsR0FBa0JpWSxLQUFLRixHQUF6QixJQUFpQzNTLENBQTNDOztlQUVPLElBQVA7Ozs7Ozs7O2VBU0o7YUFDU3pGLENBQUwsR0FBUyxDQUFUO2FBQ0tDLENBQUwsR0FBUyxDQUFUO2FBQ0tDLENBQUwsR0FBUyxDQUFUO2FBQ0tDLENBQUwsR0FBUyxDQUFUO2FBQ0tDLEVBQUwsR0FBVSxDQUFWO2FBQ0tDLEVBQUwsR0FBVSxDQUFWOztlQUVPLElBQVA7Ozs7Ozs7O1lBU0o7Y0FDVWdZLFNBQVMsSUFBSXRZLFFBQUosRUFBZjs7ZUFFT0MsQ0FBUCxHQUFXLEtBQUtBLENBQWhCO2VBQ09DLENBQVAsR0FBVyxLQUFLQSxDQUFoQjtlQUNPQyxDQUFQLEdBQVcsS0FBS0EsQ0FBaEI7ZUFDT0MsQ0FBUCxHQUFXLEtBQUtBLENBQWhCO2VBQ09DLEVBQVAsR0FBWSxLQUFLQSxFQUFqQjtlQUNPQyxFQUFQLEdBQVksS0FBS0EsRUFBakI7O2VBRU9nWSxNQUFQOzs7Ozs7Ozs7U0FTQ0EsTUFBTCxFQUNBO2VBQ1dyWSxDQUFQLEdBQVcsS0FBS0EsQ0FBaEI7ZUFDT0MsQ0FBUCxHQUFXLEtBQUtBLENBQWhCO2VBQ09DLENBQVAsR0FBVyxLQUFLQSxDQUFoQjtlQUNPQyxDQUFQLEdBQVcsS0FBS0EsQ0FBaEI7ZUFDT0MsRUFBUCxHQUFZLEtBQUtBLEVBQWpCO2VBQ09DLEVBQVAsR0FBWSxLQUFLQSxFQUFqQjs7ZUFFT2dZLE1BQVA7Ozs7Ozs7OztlQVNPYyxRQUFYLEdBQ0E7ZUFDVyxJQUFJcFosUUFBSixFQUFQOzs7Ozs7Ozs7ZUFTT3FaLFdBQVgsR0FDQTtlQUNXLElBQUlyWixRQUFKLEVBQVA7Ozs7QUNyZVI7QUFDQSxBQUVBLE1BQU1zWixLQUFLLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBQyxDQUFYLEVBQWMsQ0FBQyxDQUFmLEVBQWtCLENBQUMsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsRUFBcUMsQ0FBQyxDQUF0QyxFQUF5QyxDQUFDLENBQTFDLEVBQTZDLENBQUMsQ0FBOUMsRUFBaUQsQ0FBakQsRUFBb0QsQ0FBcEQsQ0FBWDtBQUNBLE1BQU1DLEtBQUssQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFDLENBQWpCLEVBQW9CLENBQUMsQ0FBckIsRUFBd0IsQ0FBQyxDQUF6QixFQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxFQUEyQyxDQUFDLENBQTVDLEVBQStDLENBQUMsQ0FBaEQsRUFBbUQsQ0FBQyxDQUFwRCxDQUFYO0FBQ0EsTUFBTUMsS0FBSyxDQUFDLENBQUQsRUFBSSxDQUFDLENBQUwsRUFBUSxDQUFDLENBQVQsRUFBWSxDQUFDLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBQyxDQUE1QyxFQUErQyxDQUFDLENBQWhELEVBQW1ELENBQUMsQ0FBcEQsQ0FBWDtBQUNBLE1BQU1DLEtBQUssQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFDLENBQVgsRUFBYyxDQUFDLENBQWYsRUFBa0IsQ0FBQyxDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixDQUFDLENBQTdCLEVBQWdDLENBQUMsQ0FBakMsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBMUMsRUFBNkMsQ0FBN0MsRUFBZ0QsQ0FBaEQsRUFBbUQsQ0FBQyxDQUFwRCxDQUFYO0FBQ0EsTUFBTUMsZUFBZSxFQUFyQjs7QUFFQSxNQUFNQyxNQUFNLEVBQVo7O0FBRUEsU0FBU0MsTUFBVCxDQUFnQnhrQixDQUFoQixFQUNBO1FBQ1FBLElBQUksQ0FBUixFQUNBO2VBQ1csQ0FBQyxDQUFSOztRQUVBQSxJQUFJLENBQVIsRUFDQTtlQUNXLENBQVA7OztXQUdHLENBQVA7OztBQUdKLFNBQVNpYixJQUFULEdBQ0E7U0FDUyxJQUFJcmdCLElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QkEsR0FBeEIsRUFDQTtjQUNVNnBCLE1BQU0sRUFBWjs7WUFFSXpwQixJQUFKLENBQVN5cEIsR0FBVDs7YUFFSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUksRUFBcEIsRUFBd0JBLEdBQXhCLEVBQ0E7a0JBQ1VDLE1BQU1ILE9BQVFOLEdBQUd0cEIsQ0FBSCxJQUFRc3BCLEdBQUdRLENBQUgsQ0FBVCxHQUFtQk4sR0FBR3hwQixDQUFILElBQVF1cEIsR0FBR08sQ0FBSCxDQUFsQyxDQUFaO2tCQUNNRSxNQUFNSixPQUFRTCxHQUFHdnBCLENBQUgsSUFBUXNwQixHQUFHUSxDQUFILENBQVQsR0FBbUJMLEdBQUd6cEIsQ0FBSCxJQUFRdXBCLEdBQUdPLENBQUgsQ0FBbEMsQ0FBWjtrQkFDTUcsTUFBTUwsT0FBUU4sR0FBR3RwQixDQUFILElBQVF3cEIsR0FBR00sQ0FBSCxDQUFULEdBQW1CTixHQUFHeHBCLENBQUgsSUFBUXlwQixHQUFHSyxDQUFILENBQWxDLENBQVo7a0JBQ01JLE1BQU1OLE9BQVFMLEdBQUd2cEIsQ0FBSCxJQUFRd3BCLEdBQUdNLENBQUgsQ0FBVCxHQUFtQkwsR0FBR3pwQixDQUFILElBQVF5cEIsR0FBR0ssQ0FBSCxDQUFsQyxDQUFaOztpQkFFSyxJQUFJaFEsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEVBQXBCLEVBQXdCQSxHQUF4QixFQUNBO29CQUNRd1AsR0FBR3hQLENBQUgsTUFBVWlRLEdBQVYsSUFBaUJSLEdBQUd6UCxDQUFILE1BQVVrUSxHQUEzQixJQUFrQ1IsR0FBRzFQLENBQUgsTUFBVW1RLEdBQTVDLElBQW1EUixHQUFHM1AsQ0FBSCxNQUFVb1EsR0FBakUsRUFDQTt3QkFDUTlwQixJQUFKLENBQVMwWixDQUFUOzs7Ozs7O1NBT1gsSUFBSTlaLElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QkEsR0FBeEIsRUFDQTtjQUNVbXFCLE1BQU0sSUFBSW5hLFFBQUosRUFBWjs7WUFFSWdQLEdBQUosQ0FBUXNLLEdBQUd0cEIsQ0FBSCxDQUFSLEVBQWV1cEIsR0FBR3ZwQixDQUFILENBQWYsRUFBc0J3cEIsR0FBR3hwQixDQUFILENBQXRCLEVBQTZCeXBCLEdBQUd6cEIsQ0FBSCxDQUE3QixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QztxQkFDYUksSUFBYixDQUFrQitwQixHQUFsQjs7OztBQUlSOUosT0FFQSxBQTJIQTs7QUN2TEE7Ozs7Ozs7QUFPQSxBQUFlLE1BQU0rSixTQUFOLENBQ2Y7Ozs7Ozs7Z0JBT2dCaGxCLElBQUksQ0FBaEIsRUFBbUJDLElBQUksQ0FBdkIsRUFBMEJnRCxRQUFRLENBQWxDLEVBQXFDQyxTQUFTLENBQTlDLEVBQ0E7Ozs7O2FBS1NsRCxDQUFMLEdBQVNBLENBQVQ7Ozs7OzthQU1LQyxDQUFMLEdBQVNBLENBQVQ7Ozs7OzthQU1LZ0QsS0FBTCxHQUFhQSxLQUFiOzs7Ozs7YUFNS0MsTUFBTCxHQUFjQSxNQUFkOzs7Ozs7Ozs7O2FBVUsxQyxJQUFMLEdBQVlnYSxPQUFPeUssSUFBbkI7Ozs7Ozs7O1FBUUFqakIsSUFBSixHQUNBO2VBQ1csS0FBS2hDLENBQVo7Ozs7Ozs7O1FBUUErQixLQUFKLEdBQ0E7ZUFDVyxLQUFLL0IsQ0FBTCxHQUFTLEtBQUtpRCxLQUFyQjs7Ozs7Ozs7UUFRQWQsR0FBSixHQUNBO2VBQ1csS0FBS2xDLENBQVo7Ozs7Ozs7O1FBUUFpbEIsTUFBSixHQUNBO2VBQ1csS0FBS2psQixDQUFMLEdBQVMsS0FBS2lELE1BQXJCOzs7Ozs7Ozs7ZUFTT2lpQixLQUFYLEdBQ0E7ZUFDVyxJQUFJSCxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFQOzs7Ozs7OztZQVNKO2VBQ1csSUFBSUEsU0FBSixDQUFjLEtBQUtobEIsQ0FBbkIsRUFBc0IsS0FBS0MsQ0FBM0IsRUFBOEIsS0FBS2dELEtBQW5DLEVBQTBDLEtBQUtDLE1BQS9DLENBQVA7Ozs7Ozs7OztTQVNDa2lCLFNBQUwsRUFDQTthQUNTcGxCLENBQUwsR0FBU29sQixVQUFVcGxCLENBQW5CO2FBQ0tDLENBQUwsR0FBU21sQixVQUFVbmxCLENBQW5CO2FBQ0tnRCxLQUFMLEdBQWFtaUIsVUFBVW5pQixLQUF2QjthQUNLQyxNQUFMLEdBQWNraUIsVUFBVWxpQixNQUF4Qjs7ZUFFTyxJQUFQOzs7Ozs7Ozs7O2FBVUtsRCxDQUFULEVBQVlDLENBQVosRUFDQTtZQUNRLEtBQUtnRCxLQUFMLElBQWMsQ0FBZCxJQUFtQixLQUFLQyxNQUFMLElBQWUsQ0FBdEMsRUFDQTttQkFDVyxLQUFQOzs7WUFHQWxELEtBQUssS0FBS0EsQ0FBVixJQUFlQSxJQUFJLEtBQUtBLENBQUwsR0FBUyxLQUFLaUQsS0FBckMsRUFDQTtnQkFDUWhELEtBQUssS0FBS0EsQ0FBVixJQUFlQSxJQUFJLEtBQUtBLENBQUwsR0FBUyxLQUFLaUQsTUFBckMsRUFDQTt1QkFDVyxJQUFQOzs7O2VBSUQsS0FBUDs7Ozs7Ozs7O1FBU0FtaUIsUUFBSixFQUFjQyxRQUFkLEVBQ0E7bUJBQ2VELFlBQVksQ0FBdkI7bUJBQ1dDLGFBQWNBLGFBQWEsQ0FBZCxHQUFtQkQsUUFBbkIsR0FBOEIsQ0FBM0MsQ0FBWDs7YUFFS3JsQixDQUFMLElBQVVxbEIsUUFBVjthQUNLcGxCLENBQUwsSUFBVXFsQixRQUFWOzthQUVLcmlCLEtBQUwsSUFBY29pQixXQUFXLENBQXpCO2FBQ0tuaUIsTUFBTCxJQUFlb2lCLFdBQVcsQ0FBMUI7Ozs7Ozs7O1FBUUFGLFNBQUosRUFDQTtZQUNRLEtBQUtwbEIsQ0FBTCxHQUFTb2xCLFVBQVVwbEIsQ0FBdkIsRUFDQTtpQkFDU2lELEtBQUwsSUFBYyxLQUFLakQsQ0FBbkI7Z0JBQ0ksS0FBS2lELEtBQUwsR0FBYSxDQUFqQixFQUNBO3FCQUNTQSxLQUFMLEdBQWEsQ0FBYjs7O2lCQUdDakQsQ0FBTCxHQUFTb2xCLFVBQVVwbEIsQ0FBbkI7OztZQUdBLEtBQUtDLENBQUwsR0FBU21sQixVQUFVbmxCLENBQXZCLEVBQ0E7aUJBQ1NpRCxNQUFMLElBQWUsS0FBS2pELENBQXBCO2dCQUNJLEtBQUtpRCxNQUFMLEdBQWMsQ0FBbEIsRUFDQTtxQkFDU0EsTUFBTCxHQUFjLENBQWQ7O2lCQUVDakQsQ0FBTCxHQUFTbWxCLFVBQVVubEIsQ0FBbkI7OztZQUdBLEtBQUtELENBQUwsR0FBUyxLQUFLaUQsS0FBZCxHQUFzQm1pQixVQUFVcGxCLENBQVYsR0FBY29sQixVQUFVbmlCLEtBQWxELEVBQ0E7aUJBQ1NBLEtBQUwsR0FBYW1pQixVQUFVbmlCLEtBQVYsR0FBa0IsS0FBS2pELENBQXBDO2dCQUNJLEtBQUtpRCxLQUFMLEdBQWEsQ0FBakIsRUFDQTtxQkFDU0EsS0FBTCxHQUFhLENBQWI7Ozs7WUFJSixLQUFLaEQsQ0FBTCxHQUFTLEtBQUtpRCxNQUFkLEdBQXVCa2lCLFVBQVVubEIsQ0FBVixHQUFjbWxCLFVBQVVsaUIsTUFBbkQsRUFDQTtpQkFDU0EsTUFBTCxHQUFja2lCLFVBQVVsaUIsTUFBVixHQUFtQixLQUFLakQsQ0FBdEM7Z0JBQ0ksS0FBS2lELE1BQUwsR0FBYyxDQUFsQixFQUNBO3FCQUNTQSxNQUFMLEdBQWMsQ0FBZDs7Ozs7Ozs7OztZQVVKa2lCLFNBQVIsRUFDQTtjQUNVbFgsS0FBS3RSLEtBQUtvUyxHQUFMLENBQVMsS0FBS2hQLENBQWQsRUFBaUJvbEIsVUFBVXBsQixDQUEzQixDQUFYO2NBQ011bEIsS0FBSzNvQixLQUFLQyxHQUFMLENBQVMsS0FBS21ELENBQUwsR0FBUyxLQUFLaUQsS0FBdkIsRUFBOEJtaUIsVUFBVXBsQixDQUFWLEdBQWNvbEIsVUFBVW5pQixLQUF0RCxDQUFYO2NBQ01tTCxLQUFLeFIsS0FBS29TLEdBQUwsQ0FBUyxLQUFLL08sQ0FBZCxFQUFpQm1sQixVQUFVbmxCLENBQTNCLENBQVg7Y0FDTXVsQixLQUFLNW9CLEtBQUtDLEdBQUwsQ0FBUyxLQUFLb0QsQ0FBTCxHQUFTLEtBQUtpRCxNQUF2QixFQUErQmtpQixVQUFVbmxCLENBQVYsR0FBY21sQixVQUFVbGlCLE1BQXZELENBQVg7O2FBRUtsRCxDQUFMLEdBQVNrTyxFQUFUO2FBQ0tqTCxLQUFMLEdBQWFzaUIsS0FBS3JYLEVBQWxCO2FBQ0tqTyxDQUFMLEdBQVNtTyxFQUFUO2FBQ0tsTCxNQUFMLEdBQWNzaUIsS0FBS3BYLEVBQW5COzs7O0FDek9SOzs7Ozs7QUFNQSxBQUFlLE1BQU1xWCxNQUFOLENBQ2Y7Ozs7OztjQU1nQnpsQixJQUFJLENBQWhCLEVBQW1CQyxJQUFJLENBQXZCLEVBQTBCeWxCLFNBQVMsQ0FBbkMsRUFDQTs7Ozs7U0FLUzFsQixDQUFMLEdBQVNBLENBQVQ7Ozs7OztTQU1LQyxDQUFMLEdBQVNBLENBQVQ7Ozs7OztTQU1LeWxCLE1BQUwsR0FBY0EsTUFBZDs7Ozs7Ozs7OztTQVVLbGxCLElBQUwsR0FBWWdhLE9BQU9tTCxJQUFuQjs7Ozs7Ozs7VUFTSjtXQUNXLElBQUlGLE1BQUosQ0FBVyxLQUFLemxCLENBQWhCLEVBQW1CLEtBQUtDLENBQXhCLEVBQTJCLEtBQUt5bEIsTUFBaEMsQ0FBUDs7Ozs7Ozs7OztXQVVLMWxCLENBQVQsRUFBWUMsQ0FBWixFQUNBO1FBQ1EsS0FBS3lsQixNQUFMLElBQWUsQ0FBbkIsRUFDQTthQUNXLEtBQVA7OztVQUdFOWxCLEtBQUssS0FBSzhsQixNQUFMLEdBQWMsS0FBS0EsTUFBOUI7UUFDSXpaLEtBQU0sS0FBS2pNLENBQUwsR0FBU0EsQ0FBbkI7UUFDSWtNLEtBQU0sS0FBS2pNLENBQUwsR0FBU0EsQ0FBbkI7O1VBRU1nTSxFQUFOO1VBQ01DLEVBQU47O1dBRVFELEtBQUtDLEVBQUwsSUFBV3RNLEVBQW5COzs7Ozs7OztjQVNKO1dBQ1csSUFBSW9sQixTQUFKLENBQWMsS0FBS2hsQixDQUFMLEdBQVMsS0FBSzBsQixNQUE1QixFQUFvQyxLQUFLemxCLENBQUwsR0FBUyxLQUFLeWxCLE1BQWxELEVBQTBELEtBQUtBLE1BQUwsR0FBYyxDQUF4RSxFQUEyRSxLQUFLQSxNQUFMLEdBQWMsQ0FBekYsQ0FBUDs7OztBQ3JGUjs7Ozs7O0FBTUEsQUFBZSxNQUFNRSxPQUFOLENBQ2Y7Ozs7Ozs7Y0FPZ0I1bEIsSUFBSSxDQUFoQixFQUFtQkMsSUFBSSxDQUF2QixFQUEwQmdELFFBQVEsQ0FBbEMsRUFBcUNDLFNBQVMsQ0FBOUMsRUFDQTs7Ozs7U0FLU2xELENBQUwsR0FBU0EsQ0FBVDs7Ozs7O1NBTUtDLENBQUwsR0FBU0EsQ0FBVDs7Ozs7O1NBTUtnRCxLQUFMLEdBQWFBLEtBQWI7Ozs7OztTQU1LQyxNQUFMLEdBQWNBLE1BQWQ7Ozs7Ozs7Ozs7U0FVSzFDLElBQUwsR0FBWWdhLE9BQU9xTCxJQUFuQjs7Ozs7Ozs7VUFTSjtXQUNXLElBQUlELE9BQUosQ0FBWSxLQUFLNWxCLENBQWpCLEVBQW9CLEtBQUtDLENBQXpCLEVBQTRCLEtBQUtnRCxLQUFqQyxFQUF3QyxLQUFLQyxNQUE3QyxDQUFQOzs7Ozs7Ozs7O1dBVUtsRCxDQUFULEVBQVlDLENBQVosRUFDQTtRQUNRLEtBQUtnRCxLQUFMLElBQWMsQ0FBZCxJQUFtQixLQUFLQyxNQUFMLElBQWUsQ0FBdEMsRUFDQTthQUNXLEtBQVA7Ozs7UUFJQTRpQixRQUFTLENBQUM5bEIsSUFBSSxLQUFLQSxDQUFWLElBQWUsS0FBS2lELEtBQWpDO1FBQ0k4aUIsUUFBUyxDQUFDOWxCLElBQUksS0FBS0EsQ0FBVixJQUFlLEtBQUtpRCxNQUFqQzs7YUFFUzRpQixLQUFUO2FBQ1NDLEtBQVQ7O1dBRVFELFFBQVFDLEtBQVIsSUFBaUIsQ0FBekI7Ozs7Ozs7O2NBU0o7V0FDVyxJQUFJZixTQUFKLENBQWMsS0FBS2hsQixDQUFMLEdBQVMsS0FBS2lELEtBQTVCLEVBQW1DLEtBQUtoRCxDQUFMLEdBQVMsS0FBS2lELE1BQWpELEVBQXlELEtBQUtELEtBQTlELEVBQXFFLEtBQUtDLE1BQTFFLENBQVA7Ozs7QUM1RlI7Ozs7QUFJQSxBQUFlLE1BQU04aUIsT0FBTixDQUNmOzs7Ozs7OztnQkFRZ0IsR0FBR0MsTUFBZixFQUNBO1lBQ1F4c0IsTUFBTWEsT0FBTixDQUFjMnJCLE9BQU8sQ0FBUCxDQUFkLENBQUosRUFDQTtxQkFDYUEsT0FBTyxDQUFQLENBQVQ7Ozs7WUFJQUEsT0FBTyxDQUFQLGFBQXFCbG1CLE9BQXpCLEVBQ0E7a0JBQ1VJLElBQUksRUFBVjs7aUJBRUssSUFBSXZGLElBQUksQ0FBUixFQUFXc3JCLEtBQUtELE9BQU90ckIsTUFBNUIsRUFBb0NDLElBQUlzckIsRUFBeEMsRUFBNEN0ckIsR0FBNUMsRUFDQTtrQkFDTUksSUFBRixDQUFPaXJCLE9BQU9yckIsQ0FBUCxFQUFVb0YsQ0FBakIsRUFBb0JpbUIsT0FBT3JyQixDQUFQLEVBQVVxRixDQUE5Qjs7O3FCQUdLRSxDQUFUOzs7YUFHQ2dtQixNQUFMLEdBQWMsSUFBZDs7Ozs7OzthQU9LRixNQUFMLEdBQWNBLE1BQWQ7Ozs7Ozs7Ozs7YUFVS3psQixJQUFMLEdBQVlnYSxPQUFPNEwsSUFBbkI7Ozs7Ozs7O1lBU0o7ZUFDVyxJQUFJSixPQUFKLENBQVksS0FBS0MsTUFBTCxDQUFZbG9CLEtBQVosRUFBWixDQUFQOzs7Ozs7O1lBUUo7Y0FDVWtvQixTQUFTLEtBQUtBLE1BQXBCOzs7WUFHSUEsT0FBTyxDQUFQLE1BQWNBLE9BQU9BLE9BQU90ckIsTUFBUCxHQUFnQixDQUF2QixDQUFkLElBQTJDc3JCLE9BQU8sQ0FBUCxNQUFjQSxPQUFPQSxPQUFPdHJCLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBN0QsRUFDQTttQkFDV0ssSUFBUCxDQUFZaXJCLE9BQU8sQ0FBUCxDQUFaLEVBQXVCQSxPQUFPLENBQVAsQ0FBdkI7Ozs7Ozs7Ozs7O2FBV0NqbUIsQ0FBVCxFQUFZQyxDQUFaLEVBQ0E7WUFDUW9tQixTQUFTLEtBQWI7Ozs7Y0FJTTFyQixTQUFTLEtBQUtzckIsTUFBTCxDQUFZdHJCLE1BQVosR0FBcUIsQ0FBcEM7O2FBRUssSUFBSUMsSUFBSSxDQUFSLEVBQVc4cEIsSUFBSS9wQixTQUFTLENBQTdCLEVBQWdDQyxJQUFJRCxNQUFwQyxFQUE0QytwQixJQUFJOXBCLEdBQWhELEVBQ0E7a0JBQ1UwckIsS0FBSyxLQUFLTCxNQUFMLENBQVlyckIsSUFBSSxDQUFoQixDQUFYO2tCQUNNMnJCLEtBQUssS0FBS04sTUFBTCxDQUFhcnJCLElBQUksQ0FBTCxHQUFVLENBQXRCLENBQVg7a0JBQ000ckIsS0FBSyxLQUFLUCxNQUFMLENBQVl2QixJQUFJLENBQWhCLENBQVg7a0JBQ00rQixLQUFLLEtBQUtSLE1BQUwsQ0FBYXZCLElBQUksQ0FBTCxHQUFVLENBQXRCLENBQVg7a0JBQ01nQyxZQUFjSCxLQUFLdG1CLENBQU4sS0FBY3dtQixLQUFLeG1CLENBQXBCLElBQTRCRCxJQUFLLENBQUN3bUIsS0FBS0YsRUFBTixLQUFhLENBQUNybUIsSUFBSXNtQixFQUFMLEtBQVlFLEtBQUtGLEVBQWpCLENBQWIsQ0FBRCxHQUF1Q0QsRUFBekY7O2dCQUVJSSxTQUFKLEVBQ0E7eUJBQ2EsQ0FBQ0wsTUFBVjs7OztlQUlEQSxNQUFQOzs7O0FDNUdSOzs7Ozs7O0FBT0EsQUFBZSxNQUFNTSxnQkFBTixDQUNmOzs7Ozs7OztnQkFRZ0IzbUIsSUFBSSxDQUFoQixFQUFtQkMsSUFBSSxDQUF2QixFQUEwQmdELFFBQVEsQ0FBbEMsRUFBcUNDLFNBQVMsQ0FBOUMsRUFBaUR3aUIsU0FBUyxFQUExRCxFQUNBOzs7OzthQUtTMWxCLENBQUwsR0FBU0EsQ0FBVDs7Ozs7O2FBTUtDLENBQUwsR0FBU0EsQ0FBVDs7Ozs7O2FBTUtnRCxLQUFMLEdBQWFBLEtBQWI7Ozs7OzthQU1LQyxNQUFMLEdBQWNBLE1BQWQ7Ozs7OzthQU1Ld2lCLE1BQUwsR0FBY0EsTUFBZDs7Ozs7Ozs7OzthQVVLbGxCLElBQUwsR0FBWWdhLE9BQU9vTSxJQUFuQjs7Ozs7Ozs7WUFTSjtlQUNXLElBQUlELGdCQUFKLENBQXFCLEtBQUszbUIsQ0FBMUIsRUFBNkIsS0FBS0MsQ0FBbEMsRUFBcUMsS0FBS2dELEtBQTFDLEVBQWlELEtBQUtDLE1BQXRELEVBQThELEtBQUt3aUIsTUFBbkUsQ0FBUDs7Ozs7Ozs7OzthQVVLMWxCLENBQVQsRUFBWUMsQ0FBWixFQUNBO1lBQ1EsS0FBS2dELEtBQUwsSUFBYyxDQUFkLElBQW1CLEtBQUtDLE1BQUwsSUFBZSxDQUF0QyxFQUNBO21CQUNXLEtBQVA7O1lBRUFsRCxLQUFLLEtBQUtBLENBQVYsSUFBZUEsS0FBSyxLQUFLQSxDQUFMLEdBQVMsS0FBS2lELEtBQXRDLEVBQ0E7Z0JBQ1FoRCxLQUFLLEtBQUtBLENBQVYsSUFBZUEsS0FBSyxLQUFLQSxDQUFMLEdBQVMsS0FBS2lELE1BQXRDLEVBQ0E7b0JBQ1NqRCxLQUFLLEtBQUtBLENBQUwsR0FBUyxLQUFLeWxCLE1BQW5CLElBQTZCemxCLEtBQUssS0FBS0EsQ0FBTCxHQUFTLEtBQUtpRCxNQUFkLEdBQXVCLEtBQUt3aUIsTUFBL0QsSUFDQTFsQixLQUFLLEtBQUtBLENBQUwsR0FBUyxLQUFLMGxCLE1BQW5CLElBQTZCMWxCLEtBQUssS0FBS0EsQ0FBTCxHQUFTLEtBQUtpRCxLQUFkLEdBQXNCLEtBQUt5aUIsTUFEakUsRUFFQTsyQkFDVyxJQUFQOztvQkFFQXpaLEtBQUtqTSxLQUFLLEtBQUtBLENBQUwsR0FBUyxLQUFLMGxCLE1BQW5CLENBQVQ7b0JBQ0l4WixLQUFLak0sS0FBSyxLQUFLQSxDQUFMLEdBQVMsS0FBS3lsQixNQUFuQixDQUFUO3NCQUNNbUIsVUFBVSxLQUFLbkIsTUFBTCxHQUFjLEtBQUtBLE1BQW5DOztvQkFFS3paLEtBQUtBLEVBQU4sR0FBYUMsS0FBS0EsRUFBbEIsSUFBeUIyYSxPQUE3QixFQUNBOzJCQUNXLElBQVA7O3FCQUVDN21CLEtBQUssS0FBS0EsQ0FBTCxHQUFTLEtBQUtpRCxLQUFkLEdBQXNCLEtBQUt5aUIsTUFBaEMsQ0FBTDtvQkFDS3paLEtBQUtBLEVBQU4sR0FBYUMsS0FBS0EsRUFBbEIsSUFBeUIyYSxPQUE3QixFQUNBOzJCQUNXLElBQVA7O3FCQUVDNW1CLEtBQUssS0FBS0EsQ0FBTCxHQUFTLEtBQUtpRCxNQUFkLEdBQXVCLEtBQUt3aUIsTUFBakMsQ0FBTDtvQkFDS3paLEtBQUtBLEVBQU4sR0FBYUMsS0FBS0EsRUFBbEIsSUFBeUIyYSxPQUE3QixFQUNBOzJCQUNXLElBQVA7O3FCQUVDN21CLEtBQUssS0FBS0EsQ0FBTCxHQUFTLEtBQUswbEIsTUFBbkIsQ0FBTDtvQkFDS3paLEtBQUtBLEVBQU4sR0FBYUMsS0FBS0EsRUFBbEIsSUFBeUIyYSxPQUE3QixFQUNBOzJCQUNXLElBQVA7Ozs7O2VBS0wsS0FBUDs7OztBQ3ZIUjs7OztHQUtBLEFBQ0EsQUFDQSxBQUVBLEFBQ0EsQUFDQSxBQUNBLEFBQ0E7O0FDYkE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLEFBQWUsU0FBU0MsYUFBVCxDQUF1QkMsS0FBdkIsRUFBOEJDLEtBQTlCLEVBQXFDQyxHQUFyQyxFQUEwQ0MsR0FBMUMsRUFBK0NDLElBQS9DLEVBQXFEQyxJQUFyRCxFQUEyREMsR0FBM0QsRUFBZ0VDLEdBQWhFLEVBQXFFQyxPQUFPLEVBQTVFLEVBQ2Y7VUFDVWpYLElBQUksRUFBVjtRQUNJa1gsS0FBSyxDQUFUO1FBQ0lDLE1BQU0sQ0FBVjtRQUNJQyxNQUFNLENBQVY7UUFDSTFSLEtBQUssQ0FBVDtRQUNJQyxLQUFLLENBQVQ7O1NBRUtqYixJQUFMLENBQVUrckIsS0FBVixFQUFpQkMsS0FBakI7O1NBRUssSUFBSXBzQixJQUFJLENBQVIsRUFBVzhwQixJQUFJLENBQXBCLEVBQXVCOXBCLEtBQUswVixDQUE1QixFQUErQixFQUFFMVYsQ0FBakMsRUFDQTtZQUNRQSxJQUFJMFYsQ0FBUjs7YUFFTSxJQUFJb1UsQ0FBVjtjQUNNOEMsS0FBS0EsRUFBWDtjQUNNQyxNQUFNRCxFQUFaOzthQUVLOUMsSUFBSUEsQ0FBVDthQUNLMU8sS0FBSzBPLENBQVY7O2FBRUsxcEIsSUFBTCxDQUNLMHNCLE1BQU1YLEtBQVAsR0FBaUIsSUFBSVUsR0FBSixHQUFVL0MsQ0FBVixHQUFjdUMsR0FBL0IsR0FBdUMsSUFBSU8sRUFBSixHQUFTeFIsRUFBVCxHQUFjbVIsSUFBckQsR0FBOERsUixLQUFLb1IsR0FEdkUsRUFFS0ssTUFBTVYsS0FBUCxHQUFpQixJQUFJUyxHQUFKLEdBQVUvQyxDQUFWLEdBQWN3QyxHQUEvQixHQUF1QyxJQUFJTSxFQUFKLEdBQVN4UixFQUFULEdBQWNvUixJQUFyRCxHQUE4RG5SLEtBQUtxUixHQUZ2RTs7O1dBTUdDLElBQVA7OztBQ3hDSixNQUFNSSxhQUFhLElBQUkvYyxRQUFKLEVBQW5CO0FBQ0EsTUFBTWdkLFlBQVksSUFBSTduQixPQUFKLEVBQWxCO0FBQ0EsQUFDQSxBQUVBLEFBQWUsTUFBTThuQixRQUFOLENBQ2Y7a0JBRUk7YUFDU3ZGLFNBQUwsR0FBaUIsQ0FBakI7YUFDSy9ULFNBQUwsR0FBaUIsQ0FBakI7YUFDSzRULFNBQUwsR0FBaUIsQ0FBakI7YUFDSzJGLFlBQUwsR0FBb0IsRUFBcEI7YUFDS0MsSUFBTCxHQUFZLFFBQVo7YUFDS0MsU0FBTCxHQUFpQixRQUFqQjthQUNLQyxXQUFMLEdBQW1CLElBQW5COzthQUVLQyxNQUFMLEdBQWMsRUFBZDs7YUFFS0MsS0FBTCxHQUFhLENBQWI7YUFDS0MsYUFBTCxHQUFxQixDQUFDLENBQXRCO2FBQ0tDLFVBQUwsR0FBa0IsQ0FBbEI7YUFDS0MsV0FBTCxHQUFtQixDQUFDLENBQXBCO2FBQ0tDLGlCQUFMLEdBQXlCLEtBQXpCOzthQUVLQyxXQUFMLEdBQW1CLElBQW5CO2FBQ0tDLFNBQUwsR0FBaUIsS0FBakI7OztZQUtKO2NBQ1U5cUIsUUFBUSxJQUFJa3FCLFFBQUosRUFBZDs7Y0FFTXZGLFNBQU4sR0FBa0IsS0FBS0EsU0FBdkI7Y0FDTS9ULFNBQU4sR0FBa0IsS0FBS0EsU0FBdkI7Y0FDTTRULFNBQU4sR0FBa0IsS0FBS0EsU0FBdkI7Y0FDTTRGLElBQU4sR0FBYSxLQUFLQSxJQUFsQjtjQUNNVyxhQUFOLEdBQXNCLEtBQUtBLGFBQTNCO2NBQ01QLEtBQU4sR0FBYyxDQUFkO2NBQ01JLGlCQUFOLEdBQTBCLEtBQUtBLGlCQUEvQjs7O2FBR0ssSUFBSTN0QixJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS2t0QixZQUFMLENBQWtCbnRCLE1BQXRDLEVBQThDLEVBQUVDLENBQWhELEVBQ0E7a0JBQ1VrdEIsWUFBTixDQUFtQjlzQixJQUFuQixDQUF3QixLQUFLOHNCLFlBQUwsQ0FBa0JsdEIsQ0FBbEIsRUFBcUIrQyxLQUFyQixFQUF4Qjs7O2NBR0VzcUIsV0FBTixHQUFvQnRxQixNQUFNbXFCLFlBQU4sQ0FBbUJucUIsTUFBTW1xQixZQUFOLENBQW1CbnRCLE1BQW5CLEdBQTRCLENBQS9DLENBQXBCOztjQUVNZ3VCLGlCQUFOOztlQUVPaHJCLEtBQVA7OztjQUlNNFEsWUFBWSxDQUF0QixFQUF5QnFhLFFBQVEsQ0FBakMsRUFBb0NDLFFBQVEsQ0FBNUMsRUFDQTthQUNTdGEsU0FBTCxHQUFpQkEsU0FBakI7YUFDSzRULFNBQUwsR0FBaUJ5RyxLQUFqQjthQUNLeEcsU0FBTCxHQUFpQnlHLEtBQWpCOztZQUVJLEtBQUtaLFdBQVQsRUFDQTtnQkFDUSxLQUFLQSxXQUFMLENBQWlCN2EsS0FBakIsQ0FBdUI2WSxNQUF2QixDQUE4QnRyQixNQUFsQyxFQUNBOztzQkFFVXlTLFFBQVEsSUFBSTRZLE9BQUosQ0FBWSxLQUFLaUMsV0FBTCxDQUFpQjdhLEtBQWpCLENBQXVCNlksTUFBdkIsQ0FBOEJsb0IsS0FBOUIsQ0FBb0MsQ0FBQyxDQUFyQyxDQUFaLENBQWQ7O3NCQUVNb29CLE1BQU4sR0FBZSxLQUFmOztxQkFFSzJDLFNBQUwsQ0FBZTFiLEtBQWY7YUFQSixNQVVBOztxQkFFUzZhLFdBQUwsQ0FBaUIxWixTQUFqQixHQUE2QixLQUFLQSxTQUFsQztxQkFDSzBaLFdBQUwsQ0FBaUI5RixTQUFqQixHQUE2QixLQUFLQSxTQUFsQztxQkFDSzhGLFdBQUwsQ0FBaUI3RixTQUFqQixHQUE2QixLQUFLQSxTQUFsQzs7OztlQUlELElBQVA7OztXQUdHcGlCLENBQVAsRUFBVUMsQ0FBVixFQUNBO2NBQ1VtTixRQUFRLElBQUk0WSxPQUFKLENBQVksQ0FBQ2htQixDQUFELEVBQUlDLENBQUosQ0FBWixDQUFkOztjQUVNa21CLE1BQU4sR0FBZSxLQUFmO2FBQ0syQyxTQUFMLENBQWUxYixLQUFmOztlQUVPLElBQVA7Ozs7Ozs7Ozs7O1dBV0dwTixDQUFQLEVBQVVDLENBQVYsRUFDQTthQUNTZ29CLFdBQUwsQ0FBaUI3YSxLQUFqQixDQUF1QjZZLE1BQXZCLENBQThCanJCLElBQTlCLENBQW1DZ0YsQ0FBbkMsRUFBc0NDLENBQXRDO2FBQ0trb0IsS0FBTDs7ZUFFTyxJQUFQOzs7Ozs7Ozs7Ozs7O3FCQWFhbEIsR0FBakIsRUFBc0JDLEdBQXRCLEVBQTJCRyxHQUEzQixFQUFnQ0MsR0FBaEMsRUFDQTtZQUNRLEtBQUtXLFdBQVQsRUFDQTtnQkFDUSxLQUFLQSxXQUFMLENBQWlCN2EsS0FBakIsQ0FBdUI2WSxNQUF2QixDQUE4QnRyQixNQUE5QixLQUF5QyxDQUE3QyxFQUNBO3FCQUNTc3RCLFdBQUwsQ0FBaUI3YSxLQUFqQixDQUF1QjZZLE1BQXZCLEdBQWdDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBaEM7O1NBSlIsTUFRQTtpQkFDUzhDLE1BQUwsQ0FBWSxDQUFaLEVBQWUsQ0FBZjs7O2NBR0V6WSxJQUFJLEVBQVY7Y0FDTTJWLFNBQVMsS0FBS2dDLFdBQUwsQ0FBaUI3YSxLQUFqQixDQUF1QjZZLE1BQXRDO1lBQ0krQyxLQUFLLENBQVQ7WUFDSUMsS0FBSyxDQUFUOztZQUVJaEQsT0FBT3RyQixNQUFQLEtBQWtCLENBQXRCLEVBQ0E7aUJBQ1NvdUIsTUFBTCxDQUFZLENBQVosRUFBZSxDQUFmOzs7Y0FHRWhDLFFBQVFkLE9BQU9BLE9BQU90ckIsTUFBUCxHQUFnQixDQUF2QixDQUFkO2NBQ01xc0IsUUFBUWYsT0FBT0EsT0FBT3RyQixNQUFQLEdBQWdCLENBQXZCLENBQWQ7O2FBRUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxLQUFLMFYsQ0FBckIsRUFBd0IsRUFBRTFWLENBQTFCLEVBQ0E7a0JBQ1U4cEIsSUFBSTlwQixJQUFJMFYsQ0FBZDs7aUJBRUt5VyxRQUFTLENBQUNFLE1BQU1GLEtBQVAsSUFBZ0JyQyxDQUE5QjtpQkFDS3NDLFFBQVMsQ0FBQ0UsTUFBTUYsS0FBUCxJQUFnQnRDLENBQTlCOzttQkFFTzFwQixJQUFQLENBQVlndUIsS0FBTSxDQUFFL0IsTUFBTyxDQUFDSSxNQUFNSixHQUFQLElBQWN2QyxDQUF0QixHQUE0QnNFLEVBQTdCLElBQW1DdEUsQ0FBckQsRUFDSXVFLEtBQU0sQ0FBRS9CLE1BQU8sQ0FBQ0ksTUFBTUosR0FBUCxJQUFjeEMsQ0FBdEIsR0FBNEJ1RSxFQUE3QixJQUFtQ3ZFLENBRDdDOzs7YUFJQ3lELEtBQUw7O2VBRU8sSUFBUDs7O2tCQUdVbEIsR0FBZCxFQUFtQkMsR0FBbkIsRUFBd0JDLElBQXhCLEVBQThCQyxJQUE5QixFQUFvQ0MsR0FBcEMsRUFBeUNDLEdBQXpDLEVBQ0E7WUFDUSxLQUFLVyxXQUFULEVBQ0E7Z0JBQ1EsS0FBS0EsV0FBTCxDQUFpQjdhLEtBQWpCLENBQXVCNlksTUFBdkIsQ0FBOEJ0ckIsTUFBOUIsS0FBeUMsQ0FBN0MsRUFDQTtxQkFDU3N0QixXQUFMLENBQWlCN2EsS0FBakIsQ0FBdUI2WSxNQUF2QixHQUFnQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWhDOztTQUpSLE1BUUE7aUJBQ1M4QyxNQUFMLENBQVksQ0FBWixFQUFlLENBQWY7OztjQUdFOUMsU0FBUyxLQUFLZ0MsV0FBTCxDQUFpQjdhLEtBQWpCLENBQXVCNlksTUFBdEM7O2NBRU1jLFFBQVFkLE9BQU9BLE9BQU90ckIsTUFBUCxHQUFnQixDQUF2QixDQUFkO2NBQ01xc0IsUUFBUWYsT0FBT0EsT0FBT3RyQixNQUFQLEdBQWdCLENBQXZCLENBQWQ7O2VBRU9BLE1BQVAsSUFBaUIsQ0FBakI7O3NCQUVjb3NCLEtBQWQsRUFBcUJDLEtBQXJCLEVBQTRCQyxHQUE1QixFQUFpQ0MsR0FBakMsRUFBc0NDLElBQXRDLEVBQTRDQyxJQUE1QyxFQUFrREMsR0FBbEQsRUFBdURDLEdBQXZELEVBQTREckIsTUFBNUQ7O2FBRUtrQyxLQUFMOztlQUVPLElBQVA7OztVQUdFamEsRUFBTixFQUFVRSxFQUFWLEVBQWNtWCxFQUFkLEVBQWtCQyxFQUFsQixFQUFzQkUsTUFBdEIsRUFDQTtZQUNRLEtBQUt1QyxXQUFULEVBQ0E7Z0JBQ1EsS0FBS0EsV0FBTCxDQUFpQjdhLEtBQWpCLENBQXVCNlksTUFBdkIsQ0FBOEJ0ckIsTUFBOUIsS0FBeUMsQ0FBN0MsRUFDQTtxQkFDU3N0QixXQUFMLENBQWlCN2EsS0FBakIsQ0FBdUI2WSxNQUF2QixDQUE4QmpyQixJQUE5QixDQUFtQ2tULEVBQW5DLEVBQXVDRSxFQUF2Qzs7U0FKUixNQVFBO2lCQUNTMmEsTUFBTCxDQUFZN2EsRUFBWixFQUFnQkUsRUFBaEI7OztjQUdFNlgsU0FBUyxLQUFLZ0MsV0FBTCxDQUFpQjdhLEtBQWpCLENBQXVCNlksTUFBdEM7Y0FDTWMsUUFBUWQsT0FBT0EsT0FBT3RyQixNQUFQLEdBQWdCLENBQXZCLENBQWQ7Y0FDTXFzQixRQUFRZixPQUFPQSxPQUFPdHJCLE1BQVAsR0FBZ0IsQ0FBdkIsQ0FBZDtjQUNNb29CLEtBQUtpRSxRQUFRNVksRUFBbkI7Y0FDTStVLEtBQUs0RCxRQUFRN1ksRUFBbkI7Y0FDTWdiLEtBQUsxRCxLQUFLcFgsRUFBaEI7Y0FDTSthLEtBQUs1RCxLQUFLclgsRUFBaEI7Y0FDTWtiLEtBQUt4c0IsS0FBS2lQLEdBQUwsQ0FBVWtYLEtBQUtvRyxFQUFOLEdBQWFoRyxLQUFLK0YsRUFBM0IsQ0FBWDs7WUFFSUUsS0FBSyxNQUFMLElBQWUxRCxXQUFXLENBQTlCLEVBQ0E7Z0JBQ1FPLE9BQU9BLE9BQU90ckIsTUFBUCxHQUFnQixDQUF2QixNQUE4QnVULEVBQTlCLElBQW9DK1gsT0FBT0EsT0FBT3RyQixNQUFQLEdBQWdCLENBQXZCLE1BQThCeVQsRUFBdEUsRUFDQTt1QkFDV3BULElBQVAsQ0FBWWtULEVBQVosRUFBZ0JFLEVBQWhCOztTQUpSLE1BUUE7a0JBQ1VpYixLQUFNdEcsS0FBS0EsRUFBTixHQUFhSSxLQUFLQSxFQUE3QjtrQkFDTW1HLEtBQU1KLEtBQUtBLEVBQU4sR0FBYUMsS0FBS0EsRUFBN0I7a0JBQ01JLEtBQU14RyxLQUFLbUcsRUFBTixHQUFhL0YsS0FBS2dHLEVBQTdCO2tCQUNNSyxLQUFLOUQsU0FBUzlvQixLQUFLZ1ksSUFBTCxDQUFVeVUsRUFBVixDQUFULEdBQXlCRCxFQUFwQztrQkFDTUssS0FBSy9ELFNBQVM5b0IsS0FBS2dZLElBQUwsQ0FBVTBVLEVBQVYsQ0FBVCxHQUF5QkYsRUFBcEM7a0JBQ01NLEtBQUtGLEtBQUtELEVBQUwsR0FBVUYsRUFBckI7a0JBQ01NLEtBQUtGLEtBQUtGLEVBQUwsR0FBVUQsRUFBckI7a0JBQ016RixLQUFNMkYsS0FBS0wsRUFBTixHQUFhTSxLQUFLdEcsRUFBN0I7a0JBQ01RLEtBQU02RixLQUFLTixFQUFOLEdBQWFPLEtBQUsxRyxFQUE3QjtrQkFDTS9qQixLQUFLbWtCLE1BQU1zRyxLQUFLQyxFQUFYLENBQVg7a0JBQ01FLEtBQUs3RyxNQUFNMEcsS0FBS0MsRUFBWCxDQUFYO2tCQUNNRyxLQUFLVixNQUFNSyxLQUFLRyxFQUFYLENBQVg7a0JBQ01HLEtBQUtaLE1BQU1NLEtBQUtHLEVBQVgsQ0FBWDtrQkFDTXphLGFBQWF0UyxLQUFLeVMsS0FBTCxDQUFXdWEsS0FBS2pHLEVBQWhCLEVBQW9CM2tCLEtBQUs2a0IsRUFBekIsQ0FBbkI7a0JBQ016VSxXQUFXeFMsS0FBS3lTLEtBQUwsQ0FBV3lhLEtBQUtuRyxFQUFoQixFQUFvQmtHLEtBQUtoRyxFQUF6QixDQUFqQjs7aUJBRUtrRyxHQUFMLENBQVNsRyxLQUFLM1YsRUFBZCxFQUFrQnlWLEtBQUt2VixFQUF2QixFQUEyQnNYLE1BQTNCLEVBQW1DeFcsVUFBbkMsRUFBK0NFLFFBQS9DLEVBQXlEK1QsS0FBSytGLEVBQUwsR0FBVUMsS0FBS3BHLEVBQXhFOzs7YUFHQ29GLEtBQUw7O2VBRU8sSUFBUDs7O1FBR0F0RSxFQUFKLEVBQVFGLEVBQVIsRUFBWStCLE1BQVosRUFBb0J4VyxVQUFwQixFQUFnQ0UsUUFBaEMsRUFBMEM0YSxnQkFBZ0IsS0FBMUQsRUFDQTtZQUNROWEsZUFBZUUsUUFBbkIsRUFDQTttQkFDVyxJQUFQOzs7WUFHQSxDQUFDNGEsYUFBRCxJQUFrQjVhLFlBQVlGLFVBQWxDLEVBQ0E7d0JBQ2dCdFMsS0FBSzZPLEVBQUwsR0FBVSxDQUF0QjtTQUZKLE1BSUssSUFBSXVlLGlCQUFpQjlhLGNBQWNFLFFBQW5DLEVBQ0w7MEJBQ2tCeFMsS0FBSzZPLEVBQUwsR0FBVSxDQUF4Qjs7O2NBR0V3ZSxRQUFRN2EsV0FBV0YsVUFBekI7Y0FDTWdiLE9BQU90dEIsS0FBS3V0QixJQUFMLENBQVV2dEIsS0FBS2lQLEdBQUwsQ0FBU29lLEtBQVQsS0FBbUJydEIsS0FBSzZPLEVBQUwsR0FBVSxDQUE3QixDQUFWLElBQTZDLEVBQTFEOztZQUVJd2UsVUFBVSxDQUFkLEVBQ0E7bUJBQ1csSUFBUDs7O2NBR0VHLFNBQVN2RyxLQUFNam5CLEtBQUsyTyxHQUFMLENBQVMyRCxVQUFULElBQXVCd1csTUFBNUM7Y0FDTTJFLFNBQVMxRyxLQUFNL21CLEtBQUs0TyxHQUFMLENBQVMwRCxVQUFULElBQXVCd1csTUFBNUM7OztZQUdJTyxTQUFTLEtBQUtnQyxXQUFMLEdBQW1CLEtBQUtBLFdBQUwsQ0FBaUI3YSxLQUFqQixDQUF1QjZZLE1BQTFDLEdBQW1ELElBQWhFOztZQUVJQSxNQUFKLEVBQ0E7Z0JBQ1FBLE9BQU9BLE9BQU90ckIsTUFBUCxHQUFnQixDQUF2QixNQUE4Qnl2QixNQUE5QixJQUF3Q25FLE9BQU9BLE9BQU90ckIsTUFBUCxHQUFnQixDQUF2QixNQUE4QjB2QixNQUExRSxFQUNBO3VCQUNXcnZCLElBQVAsQ0FBWW92QixNQUFaLEVBQW9CQyxNQUFwQjs7U0FKUixNQVFBO2lCQUNTdEIsTUFBTCxDQUFZcUIsTUFBWixFQUFvQkMsTUFBcEI7cUJBQ1MsS0FBS3BDLFdBQUwsQ0FBaUI3YSxLQUFqQixDQUF1QjZZLE1BQWhDOzs7Y0FHRXFFLFFBQVFMLFNBQVNDLE9BQU8sQ0FBaEIsQ0FBZDtjQUNNSyxTQUFTRCxRQUFRLENBQXZCOztjQUVNRSxTQUFTNXRCLEtBQUsyTyxHQUFMLENBQVMrZSxLQUFULENBQWY7Y0FDTUcsU0FBUzd0QixLQUFLNE8sR0FBTCxDQUFTOGUsS0FBVCxDQUFmOztjQUVNSSxXQUFXUixPQUFPLENBQXhCOztjQUVNUyxZQUFhRCxXQUFXLENBQVosR0FBaUJBLFFBQW5DOzthQUVLLElBQUk5dkIsSUFBSSxDQUFiLEVBQWdCQSxLQUFLOHZCLFFBQXJCLEVBQStCLEVBQUU5dkIsQ0FBakMsRUFDQTtrQkFDVWd3QixPQUFPaHdCLElBQUsrdkIsWUFBWS92QixDQUE5Qjs7a0JBRU0rUSxRQUFVMmUsS0FBRCxHQUFVcGIsVUFBVixHQUF3QnFiLFNBQVNLLElBQWhEOztrQkFFTTdmLElBQUluTyxLQUFLMk8sR0FBTCxDQUFTSSxLQUFULENBQVY7a0JBQ001TSxJQUFJLENBQUNuQyxLQUFLNE8sR0FBTCxDQUFTRyxLQUFULENBQVg7O21CQUVPM1EsSUFBUCxDQUNLLENBQUV3dkIsU0FBU3pmLENBQVYsR0FBZ0IwZixTQUFTMXJCLENBQTFCLElBQWdDMm1CLE1BQWpDLEdBQTJDN0IsRUFEL0MsRUFFSyxDQUFFMkcsU0FBUyxDQUFDenJCLENBQVgsR0FBaUIwckIsU0FBUzFmLENBQTNCLElBQWlDMmEsTUFBbEMsR0FBNEMvQixFQUZoRDs7O2FBTUN3RSxLQUFMOztlQUVPLElBQVA7OztjQUdNUyxRQUFRLENBQWxCLEVBQXFCQyxRQUFRLENBQTdCLEVBQ0E7YUFDU2dDLE9BQUwsR0FBZSxJQUFmO2FBQ0t4SSxTQUFMLEdBQWlCdUcsS0FBakI7YUFDS3RHLFNBQUwsR0FBaUJ1RyxLQUFqQjs7WUFFSSxLQUFLWixXQUFULEVBQ0E7Z0JBQ1EsS0FBS0EsV0FBTCxDQUFpQjdhLEtBQWpCLENBQXVCNlksTUFBdkIsQ0FBOEJ0ckIsTUFBOUIsSUFBd0MsQ0FBNUMsRUFDQTtxQkFDU3N0QixXQUFMLENBQWlCMUYsSUFBakIsR0FBd0IsS0FBS3NJLE9BQTdCO3FCQUNLNUMsV0FBTCxDQUFpQjVGLFNBQWpCLEdBQTZCLEtBQUtBLFNBQWxDO3FCQUNLNEYsV0FBTCxDQUFpQjNGLFNBQWpCLEdBQTZCLEtBQUtBLFNBQWxDOzs7O2VBSUQsSUFBUDs7O2NBSUo7YUFDU3VJLE9BQUwsR0FBZSxLQUFmO2FBQ0t4SSxTQUFMLEdBQWlCLElBQWpCO2FBQ0tDLFNBQUwsR0FBaUIsQ0FBakI7O2VBRU8sSUFBUDs7O2FBR0t0aUIsQ0FBVCxFQUFZQyxDQUFaLEVBQWVnRCxLQUFmLEVBQXNCQyxNQUF0QixFQUNBO2FBQ1M0bEIsU0FBTCxDQUFlLElBQUk5RCxTQUFKLENBQWNobEIsQ0FBZCxFQUFpQkMsQ0FBakIsRUFBb0JnRCxLQUFwQixFQUEyQkMsTUFBM0IsQ0FBZjtlQUNPLElBQVA7OztvQkFHWWxELENBQWhCLEVBQW1CQyxDQUFuQixFQUFzQmdELEtBQXRCLEVBQTZCQyxNQUE3QixFQUFxQ3dpQixNQUFyQyxFQUNBO2FBQ1NvRCxTQUFMLENBQWUsSUFBSW5DLGdCQUFKLENBQXFCM21CLENBQXJCLEVBQXdCQyxDQUF4QixFQUEyQmdELEtBQTNCLEVBQWtDQyxNQUFsQyxFQUEwQ3dpQixNQUExQyxDQUFmOztlQUVPLElBQVA7OztlQUdPMWxCLENBQVgsRUFBY0MsQ0FBZCxFQUFpQnlsQixNQUFqQixFQUNBO2FBQ1NvRCxTQUFMLENBQWUsSUFBSXJELE1BQUosQ0FBV3psQixDQUFYLEVBQWNDLENBQWQsRUFBaUJ5bEIsTUFBakIsQ0FBZjs7ZUFFTyxJQUFQOzs7Z0JBR1ExbEIsQ0FBWixFQUFlQyxDQUFmLEVBQWtCZ0QsS0FBbEIsRUFBeUJDLE1BQXpCLEVBQ0E7YUFDUzRsQixTQUFMLENBQWUsSUFBSWxELE9BQUosQ0FBWTVsQixDQUFaLEVBQWVDLENBQWYsRUFBa0JnRCxLQUFsQixFQUF5QkMsTUFBekIsQ0FBZjs7ZUFFTyxJQUFQOzs7Z0JBR1Fxa0IsSUFBWixFQUNBOzs7WUFHUXRCLFNBQVNzQixJQUFiOztZQUVJcEIsU0FBUyxJQUFiOztZQUVJRixrQkFBa0JELE9BQXRCLEVBQ0E7cUJBQ2FDLE9BQU9FLE1BQWhCO3FCQUNTRixPQUFPQSxNQUFoQjs7O1lBR0EsQ0FBQ3hzQixNQUFNYSxPQUFOLENBQWMyckIsTUFBZCxDQUFMLEVBQ0E7OztxQkFHYSxJQUFJeHNCLEtBQUosQ0FBVW9FLFVBQVVsRCxNQUFwQixDQUFUOztpQkFFSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlxckIsT0FBT3RyQixNQUEzQixFQUFtQyxFQUFFQyxDQUFyQyxFQUNBO3VCQUNXQSxDQUFQLElBQVlpRCxVQUFVakQsQ0FBVixDQUFaLENBREo7Ozs7Y0FLRXdTLFFBQVEsSUFBSTRZLE9BQUosQ0FBWUMsTUFBWixDQUFkOztjQUVNRSxNQUFOLEdBQWVBLE1BQWY7O2FBRUsyQyxTQUFMLENBQWUxYixLQUFmOztlQUVPLElBQVA7OztZQUlKO1lBQ1EsS0FBS21CLFNBQUwsSUFBa0IsS0FBS3NjLE9BQXZCLElBQWtDLEtBQUsvQyxZQUFMLENBQWtCbnRCLE1BQWxCLEdBQTJCLENBQWpFLEVBQ0E7aUJBQ1M0VCxTQUFMLEdBQWlCLENBQWpCO2lCQUNLc2MsT0FBTCxHQUFlLEtBQWY7O2lCQUVLdkMsV0FBTCxHQUFtQixDQUFDLENBQXBCO2lCQUNLSCxLQUFMO2lCQUNLRSxVQUFMO2lCQUNLUCxZQUFMLENBQWtCbnRCLE1BQWxCLEdBQTJCLENBQTNCOzs7YUFHQ3N0QixXQUFMLEdBQW1CLElBQW5CO2FBQ0tPLFdBQUwsR0FBbUIsSUFBbkI7O2VBRU8sSUFBUDs7Ozs7Ozs7O2lCQVVTdkgsUUFBYixFQUNBOztpQkFFYTZKLGlCQUFULENBQTJCN0osU0FBUzhKLE9BQVQsQ0FBaUJDLFFBQTVDO2lCQUNTRCxPQUFULENBQWlCQyxRQUFqQixDQUEwQmhOLE1BQTFCLENBQWlDLElBQWpDOzs7Ozs7Ozs7a0JBU1VpRCxRQUFkLEVBQ0E7aUJBQ2E4SixPQUFULENBQWlCQyxRQUFqQixDQUEwQmhOLE1BQTFCLENBQWlDLElBQWpDOzs7Ozs7Ozs7Y0FVTTVRLEtBQVYsRUFDQTtZQUNRLEtBQUs2YSxXQUFULEVBQ0E7O2dCQUVRLEtBQUtBLFdBQUwsQ0FBaUI3YSxLQUFqQixDQUF1QjZZLE1BQXZCLENBQThCdHJCLE1BQTlCLElBQXdDLENBQTVDLEVBQ0E7cUJBQ1NtdEIsWUFBTCxDQUFrQm1ELEdBQWxCOzs7O2FBSUhoRCxXQUFMLEdBQW1CLElBQW5COztjQUVNaUQsT0FBTyxJQUFJaEosWUFBSixDQUNULEtBQUszVCxTQURJLEVBRVQsS0FBSzRULFNBRkksRUFHVCxLQUFLQyxTQUhJLEVBSVQsS0FBS0MsU0FKSSxFQUtULEtBQUtDLFNBTEksRUFNVCxLQUFLdUksT0FOSSxFQU9UemQsS0FQUyxDQUFiOzthQVVLMGEsWUFBTCxDQUFrQjlzQixJQUFsQixDQUF1Qmt3QixJQUF2Qjs7WUFFSUEsS0FBSzFxQixJQUFMLEtBQWNnYSxPQUFPNEwsSUFBekIsRUFDQTtpQkFDU2haLEtBQUwsQ0FBVytZLE1BQVgsR0FBb0IrRSxLQUFLOWQsS0FBTCxDQUFXK1ksTUFBWCxJQUFxQixLQUFLMEUsT0FBOUM7aUJBQ0s1QyxXQUFMLEdBQW1CaUQsSUFBbkI7OzthQUdDL0MsS0FBTDs7ZUFFTytDLElBQVA7Ozs7Ozs7O2dCQVVKOztjQUVVakQsY0FBYyxLQUFLQSxXQUF6Qjs7WUFFSUEsZUFBZUEsWUFBWTdhLEtBQS9CLEVBQ0E7d0JBQ2dCQSxLQUFaLENBQWtCK2QsS0FBbEI7OztlQUdHLElBQVA7OztZQUdJNXRCLE9BQVIsRUFDQTtjQUNVa0wsT0FBTixDQUFjbEwsT0FBZDs7O2FBR0ssSUFBSTNDLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLa3RCLFlBQUwsQ0FBa0JudEIsTUFBdEMsRUFBOEMsRUFBRUMsQ0FBaEQsRUFDQTtpQkFDU2t0QixZQUFMLENBQWtCbHRCLENBQWxCLEVBQXFCNk4sT0FBckI7Ozs7YUFJQyxNQUFNM0YsRUFBWCxJQUFpQixLQUFLc29CLE1BQXRCLEVBQ0E7aUJBQ1MsSUFBSTFHLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLMEcsTUFBTCxDQUFZdG9CLEVBQVosRUFBZ0Jvb0IsSUFBaEIsQ0FBcUJ2d0IsTUFBekMsRUFBaUQsRUFBRStwQixDQUFuRCxFQUNBO3FCQUNTMEcsTUFBTCxDQUFZdG9CLEVBQVosRUFBZ0Jvb0IsSUFBaEIsQ0FBcUJ4RyxDQUFyQixFQUF3QmpjLE9BQXhCOzs7O1lBSUosS0FBSytmLFdBQVQsRUFDQTtpQkFDU0EsV0FBTCxDQUFpQi9mLE9BQWpCOzs7YUFHQ3FmLFlBQUwsR0FBb0IsSUFBcEI7O2FBRUtHLFdBQUwsR0FBbUIsSUFBbkI7YUFDS21ELE1BQUwsR0FBYyxJQUFkO2FBQ0tDLFlBQUwsR0FBb0IsSUFBcEI7Ozs7O0FDdGlCUjs7Ozs7OztBQU9BLEFBQ0EsQUFDQSxBQUVBLElBQUlDLFFBQVEsVUFBUzlyQixHQUFULEVBQWE7O1FBRWpCc0osT0FBTyxJQUFYOztTQUVLa2lCLFFBQUwsR0FBZ0IsSUFBSW5ELFFBQUosRUFBaEI7OztTQUdLMEQsVUFBTCxHQUFtQixLQUFuQjtTQUNLQyxVQUFMLEdBQW1CLEtBQW5COzs7U0FHS2psQixXQUFMLEdBQW1CLEtBQW5CO1NBQ0syRCxVQUFMLEdBQW1CLElBQW5CLENBWnFCO1NBYWhCMUQsZ0JBQUwsR0FBd0IsSUFBeEIsQ0FicUI7OztTQWdCaEJxQixjQUFMLEdBQXNCLElBQXRCOzs7OztTQUtLckgsSUFBTCxHQUFZc0ksS0FBS3RJLElBQUwsSUFBYSxPQUF6QjtRQUNJaXJCLElBQUosS0FBYTNpQixLQUFLMmlCLElBQUwsR0FBVWpzQixJQUFJaXNCLElBQTNCOzs7U0FHS0MsZ0JBQUwsQ0FBc0Jsc0IsR0FBdEI7O1VBRU1KLFVBQU4sQ0FBaUJsQyxXQUFqQixDQUE2QndOLEtBQTdCLENBQW1DLElBQW5DLEVBQTBDN00sU0FBMUM7U0FDS3NmLEtBQUwsR0FBYSxJQUFiO0NBNUJKOztBQStCQW5mLE1BQU11TCxVQUFOLENBQWlCK2hCLEtBQWpCLEVBQXlCNVEsYUFBekIsRUFBeUM7VUFDL0IsWUFBVSxFQURxQjtzQkFHbkIsVUFBVWxiLEdBQVYsRUFBZTthQUN6QixJQUFJNUUsQ0FBVCxJQUFjNEUsR0FBZCxFQUFtQjtnQkFDWDVFLEtBQUssSUFBTCxJQUFhQSxLQUFLLFNBQXRCLEVBQWdDO3FCQUN2QkEsQ0FBTCxJQUFVNEUsSUFBSTVFLENBQUosQ0FBVjs7O0tBTjBCOzs7OztVQWNqQyxZQUFVLEVBZHVCO2FBaUI1QixVQUFTOGlCLEdBQVQsRUFBYTtZQUNoQixLQUFLaU8saUJBQVIsRUFBMEI7Ozs7OztZQU10QjVvQixRQUFRLEtBQUszSCxPQUFqQjs7OztZQUlLLEtBQUt3d0IsYUFBTCxJQUFzQixRQUF0QixJQUFrQyxLQUFLcHJCLElBQUwsSUFBYSxNQUFwRCxFQUEyRDtnQkFDbkRxckIsU0FBSjs7O1lBR0M5b0IsTUFBTStaLFdBQU4sSUFBcUIvWixNQUFNd0wsU0FBaEMsRUFBMkM7Z0JBQ25DdWQsTUFBSjs7O1lBR0Evb0IsTUFBTXNOLFNBQU4sSUFBbUIsS0FBS3ViLGFBQUwsSUFBb0IsUUFBM0MsRUFBb0Q7Z0JBQzVDckosSUFBSjs7S0FyQzhCOztZQTJDN0IsWUFBVTtZQUNaN0UsTUFBTyxLQUFLdlQsUUFBTCxHQUFnQjhVLFNBQTNCOztZQUVJLEtBQUs3akIsT0FBTCxDQUFhb0YsSUFBYixJQUFxQixPQUF6QixFQUFpQzs7O2lCQUd4QmlyQixJQUFMLENBQVUvZ0IsS0FBVixDQUFpQixJQUFqQjtTQUhKLE1BSU87O2dCQUVDLEtBQUsrZ0IsSUFBVCxFQUFlO29CQUNQTSxTQUFKO3FCQUNLTixJQUFMLENBQVcvTixHQUFYLEVBQWlCLEtBQUt0aUIsT0FBdEI7cUJBQ0s0d0IsT0FBTCxDQUFjdE8sR0FBZDs7O0tBdkQyQjs7Ozs7a0JBK0R6QixVQUFTQSxHQUFULEVBQWN4UCxFQUFkLEVBQWtCRSxFQUFsQixFQUFzQm1YLEVBQXRCLEVBQTBCQyxFQUExQixFQUE4QnlHLFVBQTlCLEVBQTBDO3FCQUNwQyxPQUFPQSxVQUFQLElBQXFCLFdBQXJCLEdBQ0UsQ0FERixHQUNNQSxVQURuQjtxQkFFYXJ2QixLQUFLQyxHQUFMLENBQVVvdkIsVUFBVixFQUF1QixLQUFLN3dCLE9BQUwsQ0FBYW1ULFNBQXBDLENBQWI7WUFDSTJkLFNBQVMzRyxLQUFLclgsRUFBbEI7WUFDSWllLFNBQVMzRyxLQUFLcFgsRUFBbEI7WUFDSWdlLFlBQVl4dkIsS0FBS3NZLEtBQUwsQ0FDWnRZLEtBQUtnWSxJQUFMLENBQVVzWCxTQUFTQSxNQUFULEdBQWtCQyxTQUFTQSxNQUFyQyxJQUErQ0YsVUFEbkMsQ0FBaEI7YUFHSyxJQUFJcnhCLElBQUksQ0FBYixFQUFnQkEsSUFBSXd4QixTQUFwQixFQUErQixFQUFFeHhCLENBQWpDLEVBQW9DO2dCQUM1Qm9GLElBQUk2YyxTQUFTM08sS0FBTWdlLFNBQVNFLFNBQVYsR0FBdUJ4eEIsQ0FBckMsQ0FBUjtnQkFDSXFGLElBQUk0YyxTQUFTek8sS0FBTStkLFNBQVNDLFNBQVYsR0FBdUJ4eEIsQ0FBckMsQ0FBUjtnQkFDSUEsSUFBSSxDQUFKLEtBQVUsQ0FBVixHQUFjLFFBQWQsR0FBeUIsUUFBN0IsRUFBd0NvRixDQUF4QyxFQUE0Q0MsQ0FBNUM7Z0JBQ0lyRixLQUFNd3hCLFlBQVUsQ0FBaEIsSUFBc0J4eEIsSUFBRSxDQUFGLEtBQVEsQ0FBbEMsRUFBb0M7b0JBQzVCeXhCLE1BQUosQ0FBWTlHLEVBQVosRUFBaUJDLEVBQWpCOzs7S0E3RXdCOzs7Ozs7MEJBc0ZmLFVBQVVwcUIsT0FBVixFQUFtQjtZQUNsQ2t4QixPQUFRQyxPQUFPQyxTQUFuQjtZQUNJQyxPQUFRRixPQUFPRyxTQUFuQjtZQUNJQyxPQUFRSixPQUFPQyxTQUFuQjtZQUNJSSxPQUFRTCxPQUFPRyxTQUFuQjs7WUFFSUcsTUFBTXp4QixRQUFRdVQsU0FBbEIsQ0FOc0M7YUFPbEMsSUFBSS9ULElBQUksQ0FBUixFQUFXa1UsSUFBSStkLElBQUlseUIsTUFBdkIsRUFBK0JDLElBQUlrVSxDQUFuQyxFQUFzQ2xVLEdBQXRDLEVBQTJDO2dCQUNuQ2l5QixJQUFJanlCLENBQUosRUFBTyxDQUFQLElBQVkweEIsSUFBaEIsRUFBc0I7dUJBQ1hPLElBQUlqeUIsQ0FBSixFQUFPLENBQVAsQ0FBUDs7Z0JBRUFpeUIsSUFBSWp5QixDQUFKLEVBQU8sQ0FBUCxJQUFZNnhCLElBQWhCLEVBQXNCO3VCQUNYSSxJQUFJanlCLENBQUosRUFBTyxDQUFQLENBQVA7O2dCQUVBaXlCLElBQUlqeUIsQ0FBSixFQUFPLENBQVAsSUFBWSt4QixJQUFoQixFQUFzQjt1QkFDWEUsSUFBSWp5QixDQUFKLEVBQU8sQ0FBUCxDQUFQOztnQkFFQWl5QixJQUFJanlCLENBQUosRUFBTyxDQUFQLElBQVlneUIsSUFBaEIsRUFBc0I7dUJBQ1hDLElBQUlqeUIsQ0FBSixFQUFPLENBQVAsQ0FBUDs7OztZQUlKMlQsU0FBSjtZQUNJblQsUUFBUTBoQixXQUFSLElBQXVCMWhCLFFBQVFpVixTQUFuQyxFQUFnRDt3QkFDaENqVixRQUFRbVQsU0FBUixJQUFxQixDQUFqQztTQURKLE1BRU87d0JBQ1MsQ0FBWjs7ZUFFRztlQUNNM1IsS0FBS2t3QixLQUFMLENBQVdSLE9BQU8vZCxZQUFZLENBQTlCLENBRE47ZUFFTTNSLEtBQUtrd0IsS0FBTCxDQUFXSCxPQUFPcGUsWUFBWSxDQUE5QixDQUZOO21CQUdNa2UsT0FBT0gsSUFBUCxHQUFjL2QsU0FIcEI7b0JBSU1xZSxPQUFPRCxJQUFQLEdBQWNwZTtTQUozQjs7Q0FsSFAsRUEySEE7O0FDcktBOzs7Ozs7O0FBT0EsQUFDQSxBQUNBLEFBRUEsSUFBSXdlLE9BQU8sVUFBU3BSLElBQVQsRUFBZW5jLEdBQWYsRUFBb0I7UUFDdkJzSixPQUFPLElBQVg7U0FDS3RJLElBQUwsR0FBWSxNQUFaO1NBQ0t3c0IsVUFBTCxHQUFrQixPQUFsQjtTQUNLQyxZQUFMLEdBQW9CLENBQUMsV0FBRCxFQUFjLGFBQWQsRUFBNkIsWUFBN0IsRUFBMkMsVUFBM0MsRUFBdUQsWUFBdkQsQ0FBcEI7OztVQUdNanZCLE1BQU0yYyxRQUFOLENBQWVuYixHQUFmLENBQU47O1NBRUs2YixRQUFMLEdBQWdCL2hCLElBQUVnRSxNQUFGLENBQVM7a0JBQ1gsRUFEVztvQkFFVCxRQUZTO29CQUdULGlCQUhTO3dCQUlMLElBSks7bUJBS1YsT0FMVTtxQkFNUixJQU5RO21CQU9WLENBUFU7b0JBUVQsR0FSUzt5QkFTSixJQVRJOzZCQVVBO0tBVlQsRUFXYmtDLElBQUlwRSxPQVhTLENBQWhCOztTQWFLaWdCLFFBQUwsQ0FBYzZSLElBQWQsR0FBcUJwa0IsS0FBS3FrQixtQkFBTCxFQUFyQjs7U0FFS3hSLElBQUwsR0FBWUEsS0FBSzloQixRQUFMLEVBQVo7O1NBRUt1RixVQUFMLENBQWdCbEMsV0FBaEIsQ0FBNEJ3TixLQUE1QixDQUFrQyxJQUFsQyxFQUF3QyxDQUFDbEwsR0FBRCxDQUF4QztDQTFCSjs7QUE2QkF4QixNQUFNdUwsVUFBTixDQUFpQndqQixJQUFqQixFQUF1QnJTLGFBQXZCLEVBQXNDO1lBQzFCLFVBQVM3ZSxJQUFULEVBQWVILEtBQWYsRUFBc0JnZCxRQUF0QixFQUFnQzs7WUFFaENwZixJQUFFYyxPQUFGLENBQVUsS0FBSzZ5QixZQUFmLEVBQTZCcHhCLElBQTdCLEtBQXNDLENBQTFDLEVBQTZDO2lCQUNwQ3dmLFFBQUwsQ0FBY3hmLElBQWQsSUFBc0JILEtBQXRCOzs7aUJBR0syTSxTQUFMLEdBQWlCLEtBQWpCO2lCQUNLak4sT0FBTCxDQUFhOHhCLElBQWIsR0FBb0IsS0FBS0MsbUJBQUwsRUFBcEI7aUJBQ0sveEIsT0FBTCxDQUFhNkgsS0FBYixHQUFxQixLQUFLbXFCLFlBQUwsRUFBckI7aUJBQ0toeUIsT0FBTCxDQUFhOEgsTUFBYixHQUFzQixLQUFLbXFCLGFBQUwsRUFBdEI7O0tBVjBCO1VBYTVCLFVBQVMxUixJQUFULEVBQWVuYyxHQUFmLEVBQW9CO1lBQ2xCc0osT0FBTyxJQUFYO1lBQ0lpQyxJQUFJLEtBQUszUCxPQUFiO1VBQ0U2SCxLQUFGLEdBQVUsS0FBS21xQixZQUFMLEVBQVY7VUFDRWxxQixNQUFGLEdBQVcsS0FBS21xQixhQUFMLEVBQVg7S0FqQjhCO1lBbUIxQixVQUFTM1AsR0FBVCxFQUFjO2FBQ2IsSUFBSXZkLENBQVQsSUFBYyxLQUFLL0UsT0FBTCxDQUFhMGQsTUFBM0IsRUFBbUM7Z0JBQzNCM1ksS0FBS3VkLEdBQVQsRUFBYztvQkFDTnZkLEtBQUssY0FBTCxJQUF1QixLQUFLL0UsT0FBTCxDQUFhMGQsTUFBYixDQUFvQjNZLENBQXBCLENBQTNCLEVBQW1EO3dCQUMzQ0EsQ0FBSixJQUFTLEtBQUsvRSxPQUFMLENBQWEwZCxNQUFiLENBQW9CM1ksQ0FBcEIsQ0FBVDs7OzthQUlQbXRCLFdBQUwsQ0FBaUI1UCxHQUFqQixFQUFzQixLQUFLNlAsYUFBTCxFQUF0QjtLQTNCOEI7ZUE2QnZCLFVBQVM1UixJQUFULEVBQWU7YUFDakJBLElBQUwsR0FBWUEsS0FBSzloQixRQUFMLEVBQVo7YUFDSzJPLFNBQUw7S0EvQjhCO2tCQWlDcEIsWUFBVztZQUNqQnZGLFFBQVEsQ0FBWjtjQUNNNmUsU0FBTixDQUFnQmxFLElBQWhCO2NBQ01rRSxTQUFOLENBQWdCb0wsSUFBaEIsR0FBdUIsS0FBSzl4QixPQUFMLENBQWE4eEIsSUFBcEM7Z0JBQ1EsS0FBS00sYUFBTCxDQUFtQnh2QixNQUFNOGpCLFNBQXpCLEVBQW9DLEtBQUt5TCxhQUFMLEVBQXBDLENBQVI7Y0FDTXpMLFNBQU4sQ0FBZ0I3RCxPQUFoQjtlQUNPaGIsS0FBUDtLQXZDOEI7bUJBeUNuQixZQUFXO2VBQ2YsS0FBS3dxQixjQUFMLENBQW9CenZCLE1BQU04akIsU0FBMUIsRUFBcUMsS0FBS3lMLGFBQUwsRUFBckMsQ0FBUDtLQTFDOEI7bUJBNENuQixZQUFXO2VBQ2YsS0FBSzVSLElBQUwsQ0FBVTVTLEtBQVYsQ0FBZ0IsS0FBS2lrQixVQUFyQixDQUFQO0tBN0M4QjtpQkErQ3JCLFVBQVN0UCxHQUFULEVBQWNnUSxTQUFkLEVBQXlCO1lBQzlCOVAsSUFBSjthQUNLK1AsaUJBQUwsQ0FBdUJqUSxHQUF2QixFQUE0QmdRLFNBQTVCO2FBQ0tFLGVBQUwsQ0FBcUJsUSxHQUFyQixFQUEwQmdRLFNBQTFCO1lBQ0l6UCxPQUFKO0tBbkQ4Qjt5QkFxRGIsWUFBVztZQUN4Qm5WLE9BQU8sSUFBWDtZQUNJK2tCLFVBQVUsRUFBZDs7WUFFRTN5QixJQUFGLENBQU8sS0FBSyt4QixZQUFaLEVBQTBCLFVBQVM5c0IsQ0FBVCxFQUFZO2dCQUM5QjJ0QixRQUFRaGxCLEtBQUt1UyxRQUFMLENBQWNsYixDQUFkLENBQVo7Z0JBQ0lBLEtBQUssVUFBVCxFQUFxQjt3QkFDVGxFLFdBQVc2eEIsS0FBWCxJQUFvQixJQUE1Qjs7cUJBRUtELFFBQVE3eUIsSUFBUixDQUFhOHlCLEtBQWIsQ0FBVDtTQUxKOztlQVFPRCxRQUFRN1QsSUFBUixDQUFhLEdBQWIsQ0FBUDtLQWpFOEI7cUJBb0VqQixVQUFTMEQsR0FBVCxFQUFjZ1EsU0FBZCxFQUF5QjtZQUNsQyxDQUFDLEtBQUt0eUIsT0FBTCxDQUFhaVYsU0FBbEIsRUFBNkI7O2FBRXhCMGQsV0FBTCxHQUFtQixFQUFuQjtZQUNJQyxjQUFjLENBQWxCOzthQUVLLElBQUlwekIsSUFBSSxDQUFSLEVBQVc2akIsTUFBTWlQLFVBQVUveUIsTUFBaEMsRUFBd0NDLElBQUk2akIsR0FBNUMsRUFBaUQ3akIsR0FBakQsRUFBc0Q7Z0JBQzlDcXpCLGVBQWUsS0FBS0MsZ0JBQUwsQ0FBc0J4USxHQUF0QixFQUEyQjlpQixDQUEzQixFQUE4Qjh5QixTQUE5QixDQUFuQjsyQkFDZU8sWUFBZjs7aUJBRUtFLGVBQUwsQ0FDSSxVQURKLEVBRUl6USxHQUZKLEVBR0lnUSxVQUFVOXlCLENBQVYsQ0FISixFQUlJLENBSko7aUJBS1N3ekIsYUFBTCxLQUF1QkosV0FMM0IsRUFNSXB6QixDQU5KOztLQTlFMEI7dUJBd0ZmLFVBQVM4aUIsR0FBVCxFQUFjZ1EsU0FBZCxFQUF5QjtZQUNwQyxDQUFDLEtBQUt0eUIsT0FBTCxDQUFhMGhCLFdBQWQsSUFBNkIsQ0FBQyxLQUFLMWhCLE9BQUwsQ0FBYW1ULFNBQS9DLEVBQTBEOztZQUV0RHlmLGNBQWMsQ0FBbEI7O1lBRUlwUSxJQUFKO1lBQ0ksS0FBS3lRLGVBQVQsRUFBMEI7Z0JBQ2xCLElBQUksS0FBS0EsZUFBTCxDQUFxQjF6QixNQUE3QixFQUFxQztxQkFDNUIwekIsZUFBTCxDQUFxQnJ6QixJQUFyQixDQUEwQjBQLEtBQTFCLENBQWdDLEtBQUsyakIsZUFBckMsRUFBc0QsS0FBS0EsZUFBM0Q7O2dDQUVnQjNRLElBQUk0USxXQUFKLENBQWdCLEtBQUtELGVBQXJCLENBQXBCOzs7WUFHQXRDLFNBQUo7YUFDSyxJQUFJbnhCLElBQUksQ0FBUixFQUFXNmpCLE1BQU1pUCxVQUFVL3lCLE1BQWhDLEVBQXdDQyxJQUFJNmpCLEdBQTVDLEVBQWlEN2pCLEdBQWpELEVBQXNEO2dCQUM5Q3F6QixlQUFlLEtBQUtDLGdCQUFMLENBQXNCeFEsR0FBdEIsRUFBMkI5aUIsQ0FBM0IsRUFBOEI4eUIsU0FBOUIsQ0FBbkI7MkJBQ2VPLFlBQWY7O2lCQUVLRSxlQUFMLENBQ0ksWUFESixFQUVJelEsR0FGSixFQUdJZ1EsVUFBVTl5QixDQUFWLENBSEosRUFJSSxDQUpKO2lCQUtTd3pCLGFBQUwsS0FBdUJKLFdBTDNCLEVBTUlwekIsQ0FOSjs7WUFTQWl4QixTQUFKO1lBQ0k1TixPQUFKO0tBcEg4QjtxQkFzSGpCLFVBQVNzUSxNQUFULEVBQWlCN1EsR0FBakIsRUFBc0I4USxJQUF0QixFQUE0QnhzQixJQUE1QixFQUFrQ0csR0FBbEMsRUFBdUNzc0IsU0FBdkMsRUFBa0Q7ZUFDeEQsS0FBS1AsZ0JBQUwsS0FBMEIsQ0FBakM7WUFDSSxLQUFLOXlCLE9BQUwsQ0FBYXN6QixTQUFiLEtBQTJCLFNBQS9CLEVBQTBDO2lCQUNqQ0MsWUFBTCxDQUFrQkosTUFBbEIsRUFBMEI3USxHQUExQixFQUErQjhRLElBQS9CLEVBQXFDeHNCLElBQXJDLEVBQTJDRyxHQUEzQyxFQUFnRHNzQixTQUFoRDs7O1lBR0FsZ0IsWUFBWW1QLElBQUlrUixXQUFKLENBQWdCSixJQUFoQixFQUFzQnZyQixLQUF0QztZQUNJNHJCLGFBQWEsS0FBS3p6QixPQUFMLENBQWE2SCxLQUE5Qjs7WUFFSTRyQixhQUFhdGdCLFNBQWpCLEVBQTRCO2dCQUNwQnVnQixRQUFRTixLQUFLemxCLEtBQUwsQ0FBVyxLQUFYLENBQVo7Z0JBQ0lnbUIsYUFBYXJSLElBQUlrUixXQUFKLENBQWdCSixLQUFLUSxPQUFMLENBQWEsTUFBYixFQUFxQixFQUFyQixDQUFoQixFQUEwQy9yQixLQUEzRDtnQkFDSWdzQixZQUFZSixhQUFhRSxVQUE3QjtnQkFDSUcsWUFBWUosTUFBTW4wQixNQUFOLEdBQWUsQ0FBL0I7Z0JBQ0l3MEIsYUFBYUYsWUFBWUMsU0FBN0I7O2dCQUVJRSxhQUFhLENBQWpCO2lCQUNLLElBQUl4MEIsSUFBSSxDQUFSLEVBQVc2akIsTUFBTXFRLE1BQU1uMEIsTUFBNUIsRUFBb0NDLElBQUk2akIsR0FBeEMsRUFBNkM3akIsR0FBN0MsRUFBa0Q7cUJBQ3pDK3pCLFlBQUwsQ0FBa0JKLE1BQWxCLEVBQTBCN1EsR0FBMUIsRUFBK0JvUixNQUFNbDBCLENBQU4sQ0FBL0IsRUFBeUNvSCxPQUFPb3RCLFVBQWhELEVBQTREanRCLEdBQTVELEVBQWlFc3NCLFNBQWpFOzhCQUNjL1EsSUFBSWtSLFdBQUosQ0FBZ0JFLE1BQU1sMEIsQ0FBTixDQUFoQixFQUEwQnFJLEtBQTFCLEdBQWtDa3NCLFVBQWhEOztTQVZSLE1BWU87aUJBQ0VSLFlBQUwsQ0FBa0JKLE1BQWxCLEVBQTBCN1EsR0FBMUIsRUFBK0I4USxJQUEvQixFQUFxQ3hzQixJQUFyQyxFQUEyQ0csR0FBM0MsRUFBZ0Rzc0IsU0FBaEQ7O0tBNUkwQjtrQkErSXBCLFVBQVNGLE1BQVQsRUFBaUI3USxHQUFqQixFQUFzQjJSLEtBQXRCLEVBQTZCcnRCLElBQTdCLEVBQW1DRyxHQUFuQyxFQUF3QztZQUM5Q29zQixNQUFKLEVBQVljLEtBQVosRUFBbUIsQ0FBbkIsRUFBc0JsdEIsR0FBdEI7S0FoSjhCO3NCQWtKaEIsWUFBVztlQUNsQixLQUFLL0csT0FBTCxDQUFhazBCLFFBQWIsR0FBd0IsS0FBS2wwQixPQUFMLENBQWFtMEIsVUFBNUM7S0FuSjhCO21CQXFKbkIsVUFBUzdSLEdBQVQsRUFBY2dRLFNBQWQsRUFBeUI7WUFDaEM4QixXQUFXOVIsSUFBSWtSLFdBQUosQ0FBZ0JsQixVQUFVLENBQVYsS0FBZ0IsR0FBaEMsRUFBcUN6cUIsS0FBcEQ7YUFDSyxJQUFJckksSUFBSSxDQUFSLEVBQVc2akIsTUFBTWlQLFVBQVUveUIsTUFBaEMsRUFBd0NDLElBQUk2akIsR0FBNUMsRUFBaUQ3akIsR0FBakQsRUFBc0Q7Z0JBQzlDNjBCLG1CQUFtQi9SLElBQUlrUixXQUFKLENBQWdCbEIsVUFBVTl5QixDQUFWLENBQWhCLEVBQThCcUksS0FBckQ7Z0JBQ0l3c0IsbUJBQW1CRCxRQUF2QixFQUFpQzsyQkFDbEJDLGdCQUFYOzs7ZUFHREQsUUFBUDtLQTdKOEI7b0JBK0psQixVQUFTOVIsR0FBVCxFQUFjZ1EsU0FBZCxFQUF5QjtlQUM5QixLQUFLdHlCLE9BQUwsQ0FBYWswQixRQUFiLEdBQXdCNUIsVUFBVS95QixNQUFsQyxHQUEyQyxLQUFLUyxPQUFMLENBQWFtMEIsVUFBL0Q7S0FoSzhCOzs7Ozs7bUJBdUtuQixZQUFXO1lBQ2xCOVosSUFBSSxDQUFSO2dCQUNRLEtBQUtyYSxPQUFMLENBQWFzMEIsWUFBckI7aUJBQ1MsS0FBTDtvQkFDUSxDQUFKOztpQkFFQyxRQUFMO29CQUNRLENBQUMsS0FBS3QwQixPQUFMLENBQWE4SCxNQUFkLEdBQXVCLENBQTNCOztpQkFFQyxRQUFMO29CQUNRLENBQUMsS0FBSzlILE9BQUwsQ0FBYThILE1BQWxCOzs7ZUFHRHVTLENBQVA7S0FwTDhCO2FBc0x6QixZQUFXO1lBQ1oxSyxJQUFJLEtBQUszUCxPQUFiO1lBQ0k0RSxJQUFJLENBQVI7WUFDSUMsSUFBSSxDQUFSOztZQUVJOEssRUFBRTJqQixTQUFGLElBQWUsUUFBbkIsRUFBNkI7Z0JBQ3JCLENBQUMzakIsRUFBRTlILEtBQUgsR0FBVyxDQUFmOztZQUVBOEgsRUFBRTJqQixTQUFGLElBQWUsT0FBbkIsRUFBNEI7Z0JBQ3BCLENBQUMzakIsRUFBRTlILEtBQVA7O1lBRUE4SCxFQUFFMmtCLFlBQUYsSUFBa0IsUUFBdEIsRUFBZ0M7Z0JBQ3hCLENBQUMza0IsRUFBRTdILE1BQUgsR0FBWSxDQUFoQjs7WUFFQTZILEVBQUUya0IsWUFBRixJQUFrQixRQUF0QixFQUFnQztnQkFDeEIsQ0FBQzNrQixFQUFFN0gsTUFBUDs7O2VBR0c7ZUFDQWxELENBREE7ZUFFQUMsQ0FGQTttQkFHSThLLEVBQUU5SCxLQUhOO29CQUlLOEgsRUFBRTdIO1NBSmQ7O0NBeE1SLEVBZ05BOztBQ3ZQQTs7Ozs7OztBQU9BLEFBRUEsU0FBU3lzQixNQUFULENBQWdCM3ZCLENBQWhCLEVBQW1CQyxDQUFuQixFQUFzQjtRQUNkbWtCLEtBQUssQ0FBVDtRQUFXQyxLQUFLLENBQWhCO1FBQ0t4bUIsVUFBVWxELE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUJyQixJQUFFbUQsUUFBRixDQUFZdUQsQ0FBWixDQUE5QixFQUErQztZQUN2Q0UsTUFBTXJDLFVBQVUsQ0FBVixDQUFWO1lBQ0l2RSxJQUFFZ0IsT0FBRixDQUFXNEYsR0FBWCxDQUFKLEVBQXNCO2lCQUNkQSxJQUFJLENBQUosQ0FBTDtpQkFDS0EsSUFBSSxDQUFKLENBQUw7U0FGSCxNQUdPLElBQUlBLElBQUlwRyxjQUFKLENBQW1CLEdBQW5CLEtBQTJCb0csSUFBSXBHLGNBQUosQ0FBbUIsR0FBbkIsQ0FBL0IsRUFBeUQ7aUJBQ3hEb0csSUFBSUYsQ0FBVDtpQkFDS0UsSUFBSUQsQ0FBVDs7O1NBR0YydkIsS0FBTCxHQUFhLENBQUN4TCxFQUFELEVBQUtDLEVBQUwsQ0FBYjs7QUFFSnNMLE9BQU9qMkIsU0FBUCxHQUFtQjtjQUNMLFVBQVV5UyxDQUFWLEVBQWE7WUFDZm5NLElBQUksS0FBSzR2QixLQUFMLENBQVcsQ0FBWCxJQUFnQnpqQixFQUFFeWpCLEtBQUYsQ0FBUSxDQUFSLENBQXhCO1lBQ0kzdkIsSUFBSSxLQUFLMnZCLEtBQUwsQ0FBVyxDQUFYLElBQWdCempCLEVBQUV5akIsS0FBRixDQUFRLENBQVIsQ0FBeEI7O2VBRU9oekIsS0FBS2dZLElBQUwsQ0FBVzVVLElBQUlBLENBQUwsR0FBV0MsSUFBSUEsQ0FBekIsQ0FBUDs7Q0FMUixDQVFBOztBQ2hDQTs7Ozs7OztBQU9BLEFBQ0EsQUFFQTs7O0FBR0EsU0FBUzR2QixXQUFULENBQXFCdGEsRUFBckIsRUFBeUJDLEVBQXpCLEVBQTZCSSxFQUE3QixFQUFpQ0MsRUFBakMsRUFBcUNKLENBQXJDLEVBQXdDTyxFQUF4QyxFQUE0Q0MsRUFBNUMsRUFBZ0Q7UUFDeENILEtBQUssQ0FBQ0YsS0FBS0wsRUFBTixJQUFZLElBQXJCO1FBQ0lRLEtBQUssQ0FBQ0YsS0FBS0wsRUFBTixJQUFZLElBQXJCO1dBQ08sQ0FBQyxLQUFLQSxLQUFLSSxFQUFWLElBQWdCRSxFQUFoQixHQUFxQkMsRUFBdEIsSUFBNEJFLEVBQTVCLEdBQ0UsQ0FBQyxDQUFFLENBQUYsSUFBT1QsS0FBS0ksRUFBWixJQUFrQixJQUFJRSxFQUF0QixHQUEyQkMsRUFBNUIsSUFBa0NDLEVBRHBDLEdBRUVGLEtBQUtMLENBRlAsR0FFV0QsRUFGbEI7Ozs7OztBQVFKLG1CQUFlLFVBQVdoVyxHQUFYLEVBQWlCO1FBQ3hCeW1CLFNBQVN6bUIsSUFBSXltQixNQUFqQjtRQUNJNkosU0FBU3R3QixJQUFJc3dCLE1BQWpCO1FBQ0lDLGVBQWV2d0IsSUFBSXV3QixZQUF2Qjs7UUFFSXRSLE1BQU13SCxPQUFPdHJCLE1BQWpCO1FBQ0k4akIsT0FBTyxDQUFYLEVBQWM7ZUFDSHdILE1BQVA7O1FBRUErSixNQUFNLEVBQVY7UUFDSUMsV0FBWSxDQUFoQjtRQUNJQyxZQUFZLElBQUlQLE1BQUosQ0FBWTFKLE9BQU8sQ0FBUCxDQUFaLENBQWhCO1FBQ0lrSyxRQUFZLElBQWhCO1NBQ0ssSUFBSXYxQixJQUFJLENBQWIsRUFBZ0JBLElBQUk2akIsR0FBcEIsRUFBeUI3akIsR0FBekIsRUFBOEI7Z0JBQ2xCLElBQUkrMEIsTUFBSixDQUFXMUosT0FBT3JyQixDQUFQLENBQVgsQ0FBUjtvQkFDWXMxQixVQUFVRCxRQUFWLENBQW9CRSxLQUFwQixDQUFaO29CQUNZQSxLQUFaOzs7Z0JBR1EsSUFBWjtZQUNZLElBQVo7OztRQUlJakcsT0FBTytGLFdBQVcsQ0FBdEI7O1dBRU8vRixPQUFPekwsR0FBUCxHQUFhQSxHQUFiLEdBQW1CeUwsSUFBMUI7U0FDSyxJQUFJdHZCLElBQUksQ0FBYixFQUFnQkEsSUFBSXN2QixJQUFwQixFQUEwQnR2QixHQUExQixFQUErQjtZQUN2QmlvQixNQUFNam9CLEtBQUtzdkIsT0FBSyxDQUFWLEtBQWdCNEYsU0FBU3JSLEdBQVQsR0FBZUEsTUFBTSxDQUFyQyxDQUFWO1lBQ0kyUixNQUFNeHpCLEtBQUtzWSxLQUFMLENBQVcyTixHQUFYLENBQVY7O1lBRUl3TixJQUFJeE4sTUFBTXVOLEdBQWQ7O1lBRUk3YSxFQUFKO1lBQ0lDLEtBQUt5USxPQUFPbUssTUFBTTNSLEdBQWIsQ0FBVDtZQUNJN0ksRUFBSjtZQUNJQyxFQUFKO1lBQ0ksQ0FBQ2lhLE1BQUwsRUFBYTtpQkFDSjdKLE9BQU9tSyxRQUFRLENBQVIsR0FBWUEsR0FBWixHQUFrQkEsTUFBTSxDQUEvQixDQUFMO2lCQUNLbkssT0FBT21LLE1BQU0zUixNQUFNLENBQVosR0FBZ0JBLE1BQU0sQ0FBdEIsR0FBMEIyUixNQUFNLENBQXZDLENBQUw7aUJBQ0tuSyxPQUFPbUssTUFBTTNSLE1BQU0sQ0FBWixHQUFnQkEsTUFBTSxDQUF0QixHQUEwQjJSLE1BQU0sQ0FBdkMsQ0FBTDtTQUhKLE1BSU87aUJBQ0VuSyxPQUFPLENBQUNtSyxNQUFLLENBQUwsR0FBUzNSLEdBQVYsSUFBaUJBLEdBQXhCLENBQUw7aUJBQ0t3SCxPQUFPLENBQUNtSyxNQUFNLENBQVAsSUFBWTNSLEdBQW5CLENBQUw7aUJBQ0t3SCxPQUFPLENBQUNtSyxNQUFNLENBQVAsSUFBWTNSLEdBQW5CLENBQUw7OztZQUdBNlIsS0FBS0QsSUFBSUEsQ0FBYjtZQUNJRSxLQUFLRixJQUFJQyxFQUFiOztZQUVJcHhCLEtBQUssQ0FDRDJ3QixZQUFZdGEsR0FBRyxDQUFILENBQVosRUFBbUJDLEdBQUcsQ0FBSCxDQUFuQixFQUEwQkksR0FBRyxDQUFILENBQTFCLEVBQWlDQyxHQUFHLENBQUgsQ0FBakMsRUFBd0N3YSxDQUF4QyxFQUEyQ0MsRUFBM0MsRUFBK0NDLEVBQS9DLENBREMsRUFFRFYsWUFBWXRhLEdBQUcsQ0FBSCxDQUFaLEVBQW1CQyxHQUFHLENBQUgsQ0FBbkIsRUFBMEJJLEdBQUcsQ0FBSCxDQUExQixFQUFpQ0MsR0FBRyxDQUFILENBQWpDLEVBQXdDd2EsQ0FBeEMsRUFBMkNDLEVBQTNDLEVBQStDQyxFQUEvQyxDQUZDLENBQVQ7O1lBS0V6MEIsVUFBRixDQUFhaTBCLFlBQWIsS0FBOEJBLGFBQWM3d0IsRUFBZCxDQUE5Qjs7WUFFSWxFLElBQUosQ0FBVWtFLEVBQVY7O1dBRUc4d0IsR0FBUDs7O0FDbkZKOzs7Ozs7Ozs7O0FBVUEsQUFDQSxBQUNBLEFBQ0EsQUFFQSxJQUFJUSxhQUFhLFVBQVNoeEIsR0FBVCxFQUFlaXhCLEtBQWYsRUFBc0I7UUFDL0IzbkIsT0FBTyxJQUFYO1NBQ0t0SSxJQUFMLEdBQVksWUFBWjtTQUNLb3JCLGFBQUwsR0FBcUIsUUFBckI7VUFDTTV0QixNQUFNMmMsUUFBTixDQUFlbmIsR0FBZixDQUFOO1FBQ0lpeEIsVUFBVSxPQUFkLEVBQXVCO2FBQ2RDLGNBQUwsQ0FBb0JseEIsSUFBSXBFLE9BQXhCOztTQUVDaWdCLFFBQUwsR0FBZ0IvaEIsSUFBRWdFLE1BQUYsQ0FBUztrQkFDWCxJQURXO2dCQUViLEtBRmE7bUJBR1YsRUFIVTtzQkFJUDtLQUpGLEVBS2JrQyxJQUFJcEUsT0FMUyxDQUFoQjs7ZUFPV2dFLFVBQVgsQ0FBc0JsQyxXQUF0QixDQUFrQ3dOLEtBQWxDLENBQXdDLElBQXhDLEVBQThDN00sU0FBOUM7Q0FmSjs7QUFrQkFHLE1BQU11TCxVQUFOLENBQWlCaW5CLFVBQWpCLEVBQTZCbEYsS0FBN0IsRUFBb0M7WUFDeEIsVUFBU3p2QixJQUFULEVBQWVILEtBQWYsRUFBc0JnZCxRQUF0QixFQUFnQztZQUNoQzdjLFFBQVEsV0FBWixFQUF5QjtpQkFDaEI2MEIsY0FBTCxDQUFvQixLQUFLdDFCLE9BQXpCLEVBQWtDTSxLQUFsQyxFQUF5Q2dkLFFBQXpDOztLQUh3QjtvQkFNaEIsVUFBU3RkLE9BQVQsRUFBa0JNLEtBQWxCLEVBQXlCZ2QsUUFBekIsRUFBbUM7WUFDM0NpWSxNQUFNdjFCLE9BQVY7WUFDSXUxQixJQUFJQyxNQUFSLEVBQWdCOzs7Z0JBR1JsMkIsTUFBTTt3QkFDRWkyQixJQUFJaGlCO2FBRGhCO2dCQUdJclYsSUFBRXdDLFVBQUYsQ0FBYTYwQixJQUFJWixZQUFqQixDQUFKLEVBQW9DO29CQUM1QkEsWUFBSixHQUFtQlksSUFBSVosWUFBdkI7O2lCQUVDMW5CLFNBQUwsR0FBaUIsSUFBakIsQ0FUWTtnQkFVUndvQixRQUFRQyxhQUFhcDJCLEdBQWIsQ0FBWjs7Z0JBRUlnQixTQUFTQSxNQUFNZixNQUFOLEdBQWEsQ0FBMUIsRUFBNkI7c0JBQ25CazJCLE1BQU1sMkIsTUFBTixHQUFlLENBQXJCLEVBQXdCLENBQXhCLElBQTZCZSxNQUFNQSxNQUFNZixNQUFOLEdBQWUsQ0FBckIsRUFBd0IsQ0FBeEIsQ0FBN0I7O2dCQUVBZ1UsU0FBSixHQUFnQmtpQixLQUFoQjtpQkFDS3hvQixTQUFMLEdBQWlCLEtBQWpCOztLQXhCd0I7O1VBNEIxQixVQUFTcVYsR0FBVCxFQUFjdGlCLE9BQWQsRUFBdUI7YUFDcEIyMUIsS0FBTCxDQUFXclQsR0FBWCxFQUFnQnRpQixPQUFoQjtLQTdCNEI7V0ErQnpCLFVBQVNzaUIsR0FBVCxFQUFjdGlCLE9BQWQsRUFBdUI7WUFDdEJ1VCxZQUFZdlQsUUFBUXVULFNBQXhCO1lBQ0lBLFVBQVVoVSxNQUFWLEdBQW1CLENBQXZCLEVBQTBCOzs7O1lBSXRCLENBQUNTLFFBQVE0MUIsUUFBVCxJQUFxQjUxQixRQUFRNDFCLFFBQVIsSUFBb0IsT0FBN0MsRUFBc0Q7OztnQkFHOUNqSSxNQUFKLENBQVdwYSxVQUFVLENBQVYsRUFBYSxDQUFiLENBQVgsRUFBNEJBLFVBQVUsQ0FBVixFQUFhLENBQWIsQ0FBNUI7aUJBQ0ssSUFBSS9ULElBQUksQ0FBUixFQUFXa1UsSUFBSUgsVUFBVWhVLE1BQTlCLEVBQXNDQyxJQUFJa1UsQ0FBMUMsRUFBNkNsVSxHQUE3QyxFQUFrRDtvQkFDMUN5eEIsTUFBSixDQUFXMWQsVUFBVS9ULENBQVYsRUFBYSxDQUFiLENBQVgsRUFBNEIrVCxVQUFVL1QsQ0FBVixFQUFhLENBQWIsQ0FBNUI7O1NBTFIsTUFPTyxJQUFJUSxRQUFRNDFCLFFBQVIsSUFBb0IsUUFBcEIsSUFBZ0M1MUIsUUFBUTQxQixRQUFSLElBQW9CLFFBQXhELEVBQWtFO2dCQUNqRTUxQixRQUFRdzFCLE1BQVosRUFBb0I7cUJBQ1gsSUFBSUssS0FBSyxDQUFULEVBQVlDLEtBQUt2aUIsVUFBVWhVLE1BQWhDLEVBQXdDczJCLEtBQUtDLEVBQTdDLEVBQWlERCxJQUFqRCxFQUF1RDt3QkFDL0NBLE1BQU1DLEtBQUcsQ0FBYixFQUFnQjs7O3dCQUdabkksTUFBSixDQUFZcGEsVUFBVXNpQixFQUFWLEVBQWMsQ0FBZCxDQUFaLEVBQStCdGlCLFVBQVVzaUIsRUFBVixFQUFjLENBQWQsQ0FBL0I7d0JBQ0k1RSxNQUFKLENBQVkxZCxVQUFVc2lCLEtBQUcsQ0FBYixFQUFnQixDQUFoQixDQUFaLEVBQWlDdGlCLFVBQVVzaUIsS0FBRyxDQUFiLEVBQWdCLENBQWhCLENBQWpDOzBCQUNJLENBQUo7O2FBUFIsTUFTTzs7b0JBRUNsSSxNQUFKLENBQVdwYSxVQUFVLENBQVYsRUFBYSxDQUFiLENBQVgsRUFBNEJBLFVBQVUsQ0FBVixFQUFhLENBQWIsQ0FBNUI7cUJBQ0ssSUFBSS9ULElBQUksQ0FBUixFQUFXa1UsSUFBSUgsVUFBVWhVLE1BQTlCLEVBQXNDQyxJQUFJa1UsQ0FBMUMsRUFBNkNsVSxHQUE3QyxFQUFrRDt3QkFDMUNtc0IsUUFBUXBZLFVBQVUvVCxJQUFJLENBQWQsRUFBaUIsQ0FBakIsQ0FBWjt3QkFDSXlzQixNQUFNMVksVUFBVS9ULENBQVYsRUFBYSxDQUFiLENBQVY7d0JBQ0lvc0IsUUFBUXJZLFVBQVUvVCxJQUFJLENBQWQsRUFBaUIsQ0FBakIsQ0FBWjt3QkFDSTBzQixNQUFNM1ksVUFBVS9ULENBQVYsRUFBYSxDQUFiLENBQVY7eUJBQ0t1MkIsWUFBTCxDQUFrQnpULEdBQWxCLEVBQXVCcUosS0FBdkIsRUFBOEJDLEtBQTlCLEVBQXFDSyxHQUFyQyxFQUEwQ0MsR0FBMUMsRUFBK0MsQ0FBL0M7Ozs7O0tBOURnQjthQW9FdkIsVUFBU2xzQixPQUFULEVBQWtCO1lBQ25CQSxVQUFVQSxVQUFVQSxPQUFWLEdBQW9CLEtBQUtBLE9BQXZDO2VBQ08sS0FBS2cyQixvQkFBTCxDQUEwQmgyQixPQUExQixDQUFQOztDQXRFUixFQXlFQTs7QUMxR0E7Ozs7Ozs7Ozs7OztBQVlBLEFBQ0EsQUFDQSxBQUdBLElBQUlxcUIsV0FBUyxVQUFTam1CLEdBQVQsRUFBYztRQUNuQnNKLE9BQU8sSUFBWDtTQUNLdEksSUFBTCxHQUFZLFFBQVo7O1VBRU14QyxNQUFNMmMsUUFBTixDQUFnQm5iLEdBQWhCLENBQU47OztpQkFHZUEsR0FBZixLQUEwQkEsSUFBSXFiLE9BQUosR0FBYyxLQUF4Qzs7U0FFS1EsUUFBTCxHQUFnQjtXQUNSN2IsSUFBSXBFLE9BQUosQ0FBWTBELENBQVosSUFBaUIsQ0FEVDtLQUFoQjthQUdPTSxVQUFQLENBQWtCbEMsV0FBbEIsQ0FBOEJ3TixLQUE5QixDQUFvQyxJQUFwQyxFQUEwQzdNLFNBQTFDO0NBWko7O0FBZUFHLE1BQU11TCxVQUFOLENBQWlCa2MsUUFBakIsRUFBMEI2RixLQUExQixFQUFrQzs7Ozs7O1VBTXZCLFVBQVM1TixHQUFULEVBQWMzYSxLQUFkLEVBQXFCO1lBQ3BCLENBQUNBLEtBQUwsRUFBWTs7O1lBR1JnbkIsR0FBSixDQUFRLENBQVIsRUFBWSxDQUFaLEVBQWVobkIsTUFBTWpFLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCbEMsS0FBSzZPLEVBQUwsR0FBVSxDQUFyQyxFQUF3QyxJQUF4QztLQVYwQjs7Ozs7O2FBaUJwQixVQUFTMUksS0FBVCxFQUFnQjtZQUNsQndMLFNBQUo7WUFDSXhMLFFBQVFBLFFBQVFBLEtBQVIsR0FBZ0IsS0FBSzNILE9BQWpDO1lBQ0kySCxNQUFNc04sU0FBTixJQUFtQnROLE1BQU0rWixXQUE3QixFQUEyQzt3QkFDM0IvWixNQUFNd0wsU0FBTixJQUFtQixDQUEvQjtTQURKLE1BRU87d0JBQ1MsQ0FBWjs7ZUFFRztlQUNDM1IsS0FBS2t3QixLQUFMLENBQVcsSUFBSS9wQixNQUFNakUsQ0FBVixHQUFjeVAsWUFBWSxDQUFyQyxDQUREO2VBRUMzUixLQUFLa3dCLEtBQUwsQ0FBVyxJQUFJL3BCLE1BQU1qRSxDQUFWLEdBQWN5UCxZQUFZLENBQXJDLENBRkQ7bUJBR0t4TCxNQUFNakUsQ0FBTixHQUFVLENBQVYsR0FBY3lQLFNBSG5CO29CQUlNeEwsTUFBTWpFLENBQU4sR0FBVSxDQUFWLEdBQWN5UDtTQUozQjs7Q0F6QlIsRUFrQ0E7O0FDbEVBLGFBQWU7Ozs7O29CQUtLLFVBQVNrSCxDQUFULEVBQWE0YixLQUFiLEVBQW9CO1lBQzVCQyxLQUFLLElBQUk3YixDQUFiO1lBQ0E4YixNQUFNRCxLQUFLQSxFQURYO1lBRUFFLE1BQU1ELE1BQU1ELEVBRlo7WUFHSXRiLEtBQUtQLElBQUlBLENBQWI7WUFDQVEsS0FBS0QsS0FBS1AsQ0FEVjtZQUVJMUgsU0FBT3NqQixNQUFNLENBQU4sQ0FBWDtZQUFvQnBqQixTQUFPb2pCLE1BQU0sQ0FBTixDQUEzQjtZQUFvQ0ksT0FBS0osTUFBTSxDQUFOLENBQXpDO1lBQWtESyxPQUFLTCxNQUFNLENBQU4sQ0FBdkQ7WUFBZ0VsSyxPQUFLLENBQXJFO1lBQXVFQyxPQUFLLENBQTVFO1lBQThFalosT0FBSyxDQUFuRjtZQUFxRkUsT0FBSyxDQUExRjtZQUNHZ2pCLE1BQU0xMkIsTUFBTixHQUFhLENBQWhCLEVBQWtCO21CQUNUMDJCLE1BQU0sQ0FBTixDQUFMO21CQUNLQSxNQUFNLENBQU4sQ0FBTDttQkFDS0EsTUFBTSxDQUFOLENBQUw7bUJBQ0tBLE1BQU0sQ0FBTixDQUFMOzttQkFFTzttQkFDQ0csTUFBTXpqQixNQUFOLEdBQWUsSUFBSXdqQixHQUFKLEdBQVU5YixDQUFWLEdBQWNnYyxJQUE3QixHQUFvQyxJQUFJSCxFQUFKLEdBQVN0YixFQUFULEdBQWNtUixJQUFsRCxHQUF5RGxSLEtBQUs5SCxJQUQvRDttQkFFQ3FqQixNQUFNdmpCLE1BQU4sR0FBZSxJQUFJc2pCLEdBQUosR0FBVTliLENBQVYsR0FBY2ljLElBQTdCLEdBQW9DLElBQUlKLEVBQUosR0FBU3RiLEVBQVQsR0FBY29SLElBQWxELEdBQXlEblIsS0FBSzVIO2FBRnRFO1NBTkosTUFVTzs7bUJBRUVnakIsTUFBTSxDQUFOLENBQUw7bUJBQ0tBLE1BQU0sQ0FBTixDQUFMO21CQUNPO21CQUNDRSxNQUFNeGpCLE1BQU4sR0FBZSxJQUFJMEgsQ0FBSixHQUFRNmIsRUFBUixHQUFhRyxJQUE1QixHQUFtQ3piLEtBQUc3SCxJQUR2QzttQkFFQ29qQixNQUFNdGpCLE1BQU4sR0FBZSxJQUFJd0gsQ0FBSixHQUFRNmIsRUFBUixHQUFhSSxJQUE1QixHQUFtQzFiLEtBQUczSDthQUY5Qzs7O0NBMUJaOztBQ0FBOzs7Ozs7Ozs7O0FBVUEsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUVBLElBQUlzakIsT0FBTyxVQUFTbnlCLEdBQVQsRUFBYztRQUNqQnNKLE9BQU8sSUFBWDtTQUNLdEksSUFBTCxHQUFZLE1BQVo7VUFDTXhDLE1BQU0yYyxRQUFOLENBQWVuYixHQUFmLENBQU47UUFDSSxrQkFBa0JBLEdBQXRCLEVBQTJCO2FBQ2xCb3lCLFlBQUwsR0FBb0JweUIsSUFBSW95QixZQUF4Qjs7U0FFQ0MsZUFBTCxHQUF1QixJQUF2QjtRQUNJeFcsV0FBVzttQkFDQSxFQURBO2NBRUw3YixJQUFJcEUsT0FBSixDQUFZbXNCLElBQVosSUFBb0IsRUFGZjs7Ozs7Ozs7OztLQUFmO1NBYUtsTSxRQUFMLEdBQWdCL2hCLElBQUVnRSxNQUFGLENBQVMrZCxRQUFULEVBQW9CdlMsS0FBS3VTLFFBQUwsSUFBaUIsRUFBckMsQ0FBaEI7U0FDS2pjLFVBQUwsQ0FBZ0JsQyxXQUFoQixDQUE0QndOLEtBQTVCLENBQWtDNUIsSUFBbEMsRUFBd0NqTCxTQUF4QztDQXRCSjs7QUF5QkFHLE1BQU11TCxVQUFOLENBQWlCb29CLElBQWpCLEVBQXVCckcsS0FBdkIsRUFBOEI7WUFDbEIsVUFBU3p2QixJQUFULEVBQWVILEtBQWYsRUFBc0JnZCxRQUF0QixFQUFnQztZQUNoQzdjLFFBQVEsTUFBWixFQUFvQjs7aUJBQ1hnMkIsZUFBTCxHQUF1QixJQUF2QjtpQkFDS3oyQixPQUFMLENBQWF1VCxTQUFiLEdBQXlCLEVBQXpCOztLQUprQjtvQkFPVixVQUFTdWMsSUFBVCxFQUFlO1lBQ3ZCLEtBQUsyRyxlQUFULEVBQTBCO21CQUNmLEtBQUtBLGVBQVo7O1lBRUEsQ0FBQzNHLElBQUwsRUFBVzttQkFDQSxFQUFQOzs7YUFHQzJHLGVBQUwsR0FBdUIsRUFBdkI7WUFDSUMsUUFBUXg0QixJQUFFK0IsT0FBRixDQUFVNnZCLEtBQUs4RCxPQUFMLENBQWEsT0FBYixFQUFzQixPQUF0QixFQUErQmptQixLQUEvQixDQUFxQyxLQUFyQyxDQUFWLENBQVo7WUFDSXBFLEtBQUssSUFBVDtZQUNFekosSUFBRixDQUFPNDJCLEtBQVAsRUFBYyxVQUFTQyxPQUFULEVBQWtCO2VBQ3pCRixlQUFILENBQW1CNzJCLElBQW5CLENBQXdCMkosR0FBR3F0QixtQkFBSCxDQUF1QkQsT0FBdkIsQ0FBeEI7U0FESjtlQUdPLEtBQUtGLGVBQVo7S0FyQnNCO3lCQXVCTCxVQUFTM0csSUFBVCxFQUFlOztZQUU1QitHLEtBQUsvRyxJQUFUOztZQUVJNUIsS0FBSyxDQUNMLEdBREssRUFDQSxHQURBLEVBQ0ssR0FETCxFQUNVLEdBRFYsRUFDZSxHQURmLEVBQ29CLEdBRHBCLEVBQ3lCLEdBRHpCLEVBQzhCLEdBRDlCLEVBQ21DLEdBRG5DLEVBQ3dDLEdBRHhDLEVBRUwsR0FGSyxFQUVBLEdBRkEsRUFFSyxHQUZMLEVBRVUsR0FGVixFQUVlLEdBRmYsRUFFb0IsR0FGcEIsRUFFeUIsR0FGekIsRUFFOEIsR0FGOUIsRUFFbUMsR0FGbkMsRUFFd0MsR0FGeEMsQ0FBVDthQUlLMkksR0FBR2pELE9BQUgsQ0FBVyxLQUFYLEVBQWtCLEdBQWxCLENBQUw7YUFDS2lELEdBQUdqRCxPQUFILENBQVcsSUFBWCxFQUFpQixHQUFqQixDQUFMOzthQUVLaUQsR0FBR2pELE9BQUgsQ0FBVyxRQUFYLEVBQXFCLE1BQXJCLENBQUw7YUFDS2lELEdBQUdqRCxPQUFILENBQVcsS0FBWCxFQUFrQixHQUFsQixDQUFMO1lBQ0kxZSxDQUFKOzthQUVLQSxJQUFJLENBQVQsRUFBWUEsSUFBSWdaLEdBQUczdUIsTUFBbkIsRUFBMkIyVixHQUEzQixFQUFnQztpQkFDdkIyaEIsR0FBR2pELE9BQUgsQ0FBVyxJQUFJa0QsTUFBSixDQUFXNUksR0FBR2haLENBQUgsQ0FBWCxFQUFrQixHQUFsQixDQUFYLEVBQW1DLE1BQU1nWixHQUFHaFosQ0FBSCxDQUF6QyxDQUFMOzs7WUFHQTZoQixNQUFNRixHQUFHbHBCLEtBQUgsQ0FBUyxHQUFULENBQVY7WUFDSXFwQixLQUFLLEVBQVQ7O1lBRUlDLE1BQU0sQ0FBVjtZQUNJQyxNQUFNLENBQVY7YUFDS2hpQixJQUFJLENBQVQsRUFBWUEsSUFBSTZoQixJQUFJeDNCLE1BQXBCLEVBQTRCMlYsR0FBNUIsRUFBaUM7Z0JBQ3pCaWlCLE1BQU1KLElBQUk3aEIsQ0FBSixDQUFWO2dCQUNJdkYsSUFBSXduQixJQUFJL2QsTUFBSixDQUFXLENBQVgsQ0FBUjtrQkFDTStkLElBQUl4MEIsS0FBSixDQUFVLENBQVYsQ0FBTjtrQkFDTXcwQixJQUFJdkQsT0FBSixDQUFZLElBQUlrRCxNQUFKLENBQVcsS0FBWCxFQUFrQixHQUFsQixDQUFaLEVBQW9DLElBQXBDLENBQU47Ozs7O2dCQUtJL3hCLElBQUlveUIsSUFBSXhwQixLQUFKLENBQVUsR0FBVixDQUFSOztnQkFFSTVJLEVBQUV4RixNQUFGLEdBQVcsQ0FBWCxJQUFnQndGLEVBQUUsQ0FBRixNQUFTLEVBQTdCLEVBQWlDO2tCQUMzQmdRLEtBQUY7OztpQkFHQyxJQUFJdlYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJdUYsRUFBRXhGLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQztrQkFDN0JBLENBQUYsSUFBT3FCLFdBQVdrRSxFQUFFdkYsQ0FBRixDQUFYLENBQVA7O21CQUVHdUYsRUFBRXhGLE1BQUYsR0FBVyxDQUFsQixFQUFxQjtvQkFDYnFCLE1BQU1tRSxFQUFFLENBQUYsQ0FBTixDQUFKLEVBQWlCOzs7b0JBR2JxeUIsTUFBTSxJQUFWO29CQUNJdk0sU0FBUyxFQUFiOztvQkFFSXdNLE1BQUo7b0JBQ0lDLE1BQUo7b0JBQ0lDLE9BQUo7O29CQUVJQyxFQUFKO29CQUNJQyxFQUFKO29CQUNJQyxHQUFKO29CQUNJQyxFQUFKO29CQUNJQyxFQUFKOztvQkFFSTlrQixLQUFLbWtCLEdBQVQ7b0JBQ0lqa0IsS0FBS2trQixHQUFUOzs7d0JBR1F2bkIsQ0FBUjt5QkFDUyxHQUFMOytCQUNXNUssRUFBRWdRLEtBQUYsRUFBUDsrQkFDT2hRLEVBQUVnUSxLQUFGLEVBQVA7OEJBQ00sR0FBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs7eUJBRUMsR0FBTDs4QkFDVW55QixFQUFFZ1EsS0FBRixFQUFOOzhCQUNNaFEsRUFBRWdRLEtBQUYsRUFBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs7eUJBRUMsR0FBTDsrQkFDV255QixFQUFFZ1EsS0FBRixFQUFQOytCQUNPaFEsRUFBRWdRLEtBQUYsRUFBUDs4QkFDTSxHQUFOOytCQUNPblYsSUFBUCxDQUFZcTNCLEdBQVosRUFBaUJDLEdBQWpCOzRCQUNJLEdBQUo7O3lCQUVDLEdBQUw7OEJBQ1VueUIsRUFBRWdRLEtBQUYsRUFBTjs4QkFDTWhRLEVBQUVnUSxLQUFGLEVBQU47OEJBQ00sR0FBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs0QkFDSSxHQUFKOzs7eUJBR0MsR0FBTDsrQkFDV255QixFQUFFZ1EsS0FBRixFQUFQOzhCQUNNLEdBQU47K0JBQ09uVixJQUFQLENBQVlxM0IsR0FBWixFQUFpQkMsR0FBakI7O3lCQUVDLEdBQUw7OEJBQ1VueUIsRUFBRWdRLEtBQUYsRUFBTjs4QkFDTSxHQUFOOytCQUNPblYsSUFBUCxDQUFZcTNCLEdBQVosRUFBaUJDLEdBQWpCOzt5QkFFQyxHQUFMOytCQUNXbnlCLEVBQUVnUSxLQUFGLEVBQVA7OEJBQ00sR0FBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs7eUJBRUMsR0FBTDs4QkFDVW55QixFQUFFZ1EsS0FBRixFQUFOOzhCQUNNLEdBQU47K0JBQ09uVixJQUFQLENBQVlxM0IsR0FBWixFQUFpQkMsR0FBakI7O3lCQUVDLEdBQUw7K0JBQ1d0M0IsSUFBUCxDQUFZbUYsRUFBRWdRLEtBQUYsRUFBWixFQUF1QmhRLEVBQUVnUSxLQUFGLEVBQXZCLEVBQWtDaFEsRUFBRWdRLEtBQUYsRUFBbEMsRUFBNkNoUSxFQUFFZ1EsS0FBRixFQUE3Qzs4QkFDTWhRLEVBQUVnUSxLQUFGLEVBQU47OEJBQ01oUSxFQUFFZ1EsS0FBRixFQUFOOytCQUNPblYsSUFBUCxDQUFZcTNCLEdBQVosRUFBaUJDLEdBQWpCOzt5QkFFQyxHQUFMOytCQUNXdDNCLElBQVAsQ0FDSXEzQixNQUFNbHlCLEVBQUVnUSxLQUFGLEVBRFYsRUFDcUJtaUIsTUFBTW55QixFQUFFZ1EsS0FBRixFQUQzQixFQUVJa2lCLE1BQU1seUIsRUFBRWdRLEtBQUYsRUFGVixFQUVxQm1pQixNQUFNbnlCLEVBQUVnUSxLQUFGLEVBRjNCOytCQUlPaFEsRUFBRWdRLEtBQUYsRUFBUDsrQkFDT2hRLEVBQUVnUSxLQUFGLEVBQVA7OEJBQ00sR0FBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs7eUJBRUMsR0FBTDtpQ0FDYUQsR0FBVDtpQ0FDU0MsR0FBVDtrQ0FDVUYsR0FBR0EsR0FBR3ozQixNQUFILEdBQVksQ0FBZixDQUFWOzRCQUNJZzRCLFFBQVFNLE9BQVIsS0FBb0IsR0FBeEIsRUFBNkI7cUNBQ2hCWixPQUFPQSxNQUFNTSxRQUFRMU0sTUFBUixDQUFlLENBQWYsQ0FBYixDQUFUO3FDQUNTcU0sT0FBT0EsTUFBTUssUUFBUTFNLE1BQVIsQ0FBZSxDQUFmLENBQWIsQ0FBVDs7K0JBRUdqckIsSUFBUCxDQUFZeTNCLE1BQVosRUFBb0JDLE1BQXBCLEVBQTRCdnlCLEVBQUVnUSxLQUFGLEVBQTVCLEVBQXVDaFEsRUFBRWdRLEtBQUYsRUFBdkM7OEJBQ01oUSxFQUFFZ1EsS0FBRixFQUFOOzhCQUNNaFEsRUFBRWdRLEtBQUYsRUFBTjs4QkFDTSxHQUFOOytCQUNPblYsSUFBUCxDQUFZcTNCLEdBQVosRUFBaUJDLEdBQWpCOzt5QkFFQyxHQUFMO2lDQUNhRCxHQUFULEVBQWNLLFNBQVNKLEdBQXZCO2tDQUNVRixHQUFHQSxHQUFHejNCLE1BQUgsR0FBWSxDQUFmLENBQVY7NEJBQ0lnNEIsUUFBUU0sT0FBUixLQUFvQixHQUF4QixFQUE2QjtxQ0FDaEJaLE9BQU9BLE1BQU1NLFFBQVExTSxNQUFSLENBQWUsQ0FBZixDQUFiLENBQVQ7cUNBQ1NxTSxPQUFPQSxNQUFNSyxRQUFRMU0sTUFBUixDQUFlLENBQWYsQ0FBYixDQUFUOzsrQkFFR2pyQixJQUFQLENBQ0l5M0IsTUFESixFQUNZQyxNQURaLEVBRUlMLE1BQU1seUIsRUFBRWdRLEtBQUYsRUFGVixFQUVxQm1pQixNQUFNbnlCLEVBQUVnUSxLQUFGLEVBRjNCOytCQUlPaFEsRUFBRWdRLEtBQUYsRUFBUDsrQkFDT2hRLEVBQUVnUSxLQUFGLEVBQVA7OEJBQ00sR0FBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs7eUJBRUMsR0FBTDsrQkFDV3QzQixJQUFQLENBQVltRixFQUFFZ1EsS0FBRixFQUFaLEVBQXVCaFEsRUFBRWdRLEtBQUYsRUFBdkI7OEJBQ01oUSxFQUFFZ1EsS0FBRixFQUFOOzhCQUNNaFEsRUFBRWdRLEtBQUYsRUFBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs7eUJBRUMsR0FBTDsrQkFDV3QzQixJQUFQLENBQVlxM0IsTUFBTWx5QixFQUFFZ1EsS0FBRixFQUFsQixFQUE2Qm1pQixNQUFNbnlCLEVBQUVnUSxLQUFGLEVBQW5DOytCQUNPaFEsRUFBRWdRLEtBQUYsRUFBUDsrQkFDT2hRLEVBQUVnUSxLQUFGLEVBQVA7OEJBQ00sR0FBTjsrQkFDT25WLElBQVAsQ0FBWXEzQixHQUFaLEVBQWlCQyxHQUFqQjs7eUJBRUMsR0FBTDtpQ0FDYUQsR0FBVCxFQUFjSyxTQUFTSixHQUF2QjtrQ0FDVUYsR0FBR0EsR0FBR3ozQixNQUFILEdBQVksQ0FBZixDQUFWOzRCQUNJZzRCLFFBQVFNLE9BQVIsS0FBb0IsR0FBeEIsRUFBNkI7cUNBQ2hCWixPQUFPQSxNQUFNTSxRQUFRMU0sTUFBUixDQUFlLENBQWYsQ0FBYixDQUFUO3FDQUNTcU0sT0FBT0EsTUFBTUssUUFBUTFNLE1BQVIsQ0FBZSxDQUFmLENBQWIsQ0FBVDs7OEJBRUU5bEIsRUFBRWdRLEtBQUYsRUFBTjs4QkFDTWhRLEVBQUVnUSxLQUFGLEVBQU47OEJBQ00sR0FBTjsrQkFDT25WLElBQVAsQ0FBWXkzQixNQUFaLEVBQW9CQyxNQUFwQixFQUE0QkwsR0FBNUIsRUFBaUNDLEdBQWpDOzt5QkFFQyxHQUFMO2lDQUNhRCxHQUFULEVBQWNLLFNBQVNKLEdBQXZCO2tDQUNVRixHQUFHQSxHQUFHejNCLE1BQUgsR0FBWSxDQUFmLENBQVY7NEJBQ0lnNEIsUUFBUU0sT0FBUixLQUFvQixHQUF4QixFQUE2QjtxQ0FDaEJaLE9BQU9BLE1BQU1NLFFBQVExTSxNQUFSLENBQWUsQ0FBZixDQUFiLENBQVQ7cUNBQ1NxTSxPQUFPQSxNQUFNSyxRQUFRMU0sTUFBUixDQUFlLENBQWYsQ0FBYixDQUFUOzsrQkFFRzlsQixFQUFFZ1EsS0FBRixFQUFQOytCQUNPaFEsRUFBRWdRLEtBQUYsRUFBUDs4QkFDTSxHQUFOOytCQUNPblYsSUFBUCxDQUFZeTNCLE1BQVosRUFBb0JDLE1BQXBCLEVBQTRCTCxHQUE1QixFQUFpQ0MsR0FBakM7O3lCQUVDLEdBQUw7NkJBQ1NueUIsRUFBRWdRLEtBQUYsRUFBTCxDQURKOzZCQUVTaFEsRUFBRWdRLEtBQUYsRUFBTCxDQUZKOzhCQUdVaFEsRUFBRWdRLEtBQUYsRUFBTixDQUhKOzZCQUlTaFEsRUFBRWdRLEtBQUYsRUFBTCxDQUpKOzZCQUtTaFEsRUFBRWdRLEtBQUYsRUFBTCxDQUxKOzs2QkFPU2tpQixHQUFMLEVBQVVqa0IsS0FBS2trQixHQUFmOzhCQUNNbnlCLEVBQUVnUSxLQUFGLEVBQU4sRUFBaUJtaUIsTUFBTW55QixFQUFFZ1EsS0FBRixFQUF2Qjs4QkFDTSxHQUFOO2lDQUNTLEtBQUsraUIsYUFBTCxDQUNMaGxCLEVBREssRUFDREUsRUFEQyxFQUNHaWtCLEdBREgsRUFDUUMsR0FEUixFQUNhUyxFQURiLEVBQ2lCQyxFQURqQixFQUNxQkosRUFEckIsRUFDeUJDLEVBRHpCLEVBQzZCQyxHQUQ3QixDQUFUOzt5QkFJQyxHQUFMOzZCQUNTM3lCLEVBQUVnUSxLQUFGLEVBQUw7NkJBQ0toUSxFQUFFZ1EsS0FBRixFQUFMOzhCQUNNaFEsRUFBRWdRLEtBQUYsRUFBTjs2QkFDS2hRLEVBQUVnUSxLQUFGLEVBQUw7NkJBQ0toUSxFQUFFZ1EsS0FBRixFQUFMOzs2QkFFS2tpQixHQUFMLEVBQVVqa0IsS0FBS2trQixHQUFmOytCQUNPbnlCLEVBQUVnUSxLQUFGLEVBQVA7K0JBQ09oUSxFQUFFZ1EsS0FBRixFQUFQOzhCQUNNLEdBQU47aUNBQ1MsS0FBSytpQixhQUFMLENBQ0xobEIsRUFESyxFQUNERSxFQURDLEVBQ0dpa0IsR0FESCxFQUNRQyxHQURSLEVBQ2FTLEVBRGIsRUFDaUJDLEVBRGpCLEVBQ3FCSixFQURyQixFQUN5QkMsRUFEekIsRUFDNkJDLEdBRDdCLENBQVQ7Ozs7O21CQU9MOTNCLElBQUgsQ0FBUTs2QkFDS3czQixPQUFPem5CLENBRFo7NEJBRUlrYjtpQkFGWjs7O2dCQU1BbGIsTUFBTSxHQUFOLElBQWFBLE1BQU0sR0FBdkIsRUFBNEI7bUJBQ3JCL1AsSUFBSCxDQUFROzZCQUNLLEdBREw7NEJBRUk7aUJBRlo7OztlQU1EbzNCLEVBQVA7S0FyUXNCOzs7Ozs7Ozs7Ozs7O21CQW1SWCxVQUFTbGtCLEVBQVQsRUFBYUUsRUFBYixFQUFpQm1YLEVBQWpCLEVBQXFCQyxFQUFyQixFQUF5QnVOLEVBQXpCLEVBQTZCQyxFQUE3QixFQUFpQ0osRUFBakMsRUFBcUNDLEVBQXJDLEVBQXlDTSxNQUF6QyxFQUFpRDs7WUFFeERMLE1BQU1LLFVBQVV2MkIsS0FBSzZPLEVBQUwsR0FBVSxLQUFwQixDQUFWO1lBQ0kybkIsS0FBS3gyQixLQUFLMk8sR0FBTCxDQUFTdW5CLEdBQVQsS0FBaUI1a0IsS0FBS3FYLEVBQXRCLElBQTRCLEdBQTVCLEdBQWtDM29CLEtBQUs0TyxHQUFMLENBQVNzbkIsR0FBVCxLQUFpQjFrQixLQUFLb1gsRUFBdEIsSUFBNEIsR0FBdkU7WUFDSTZOLEtBQUssQ0FBQyxDQUFELEdBQUt6MkIsS0FBSzRPLEdBQUwsQ0FBU3NuQixHQUFULENBQUwsSUFBc0I1a0IsS0FBS3FYLEVBQTNCLElBQWlDLEdBQWpDLEdBQXVDM29CLEtBQUsyTyxHQUFMLENBQVN1bkIsR0FBVCxLQUFpQjFrQixLQUFLb1gsRUFBdEIsSUFBNEIsR0FBNUU7O1lBRUk4TixTQUFVRixLQUFLQSxFQUFOLElBQWFSLEtBQUtBLEVBQWxCLElBQXlCUyxLQUFLQSxFQUFOLElBQWFSLEtBQUtBLEVBQWxCLENBQXJDOztZQUVJUyxTQUFTLENBQWIsRUFBZ0I7a0JBQ04xMkIsS0FBS2dZLElBQUwsQ0FBVTBlLE1BQVYsQ0FBTjtrQkFDTTEyQixLQUFLZ1ksSUFBTCxDQUFVMGUsTUFBVixDQUFOOzs7WUFHQXJlLElBQUlyWSxLQUFLZ1ksSUFBTCxDQUFVLENBQUdnZSxLQUFLQSxFQUFOLElBQWFDLEtBQUtBLEVBQWxCLENBQUQsR0FBNEJELEtBQUtBLEVBQU4sSUFBYVMsS0FBS0EsRUFBbEIsQ0FBM0IsR0FBc0RSLEtBQUtBLEVBQU4sSUFBYU8sS0FBS0EsRUFBbEIsQ0FBdEQsS0FBa0ZSLEtBQUtBLEVBQU4sSUFBYVMsS0FBS0EsRUFBbEIsSUFBeUJSLEtBQUtBLEVBQU4sSUFBYU8sS0FBS0EsRUFBbEIsQ0FBekcsQ0FBVixDQUFSOztZQUVJTCxPQUFPQyxFQUFYLEVBQWU7aUJBQ04sQ0FBQyxDQUFOOztZQUVBaDNCLE1BQU1pWixDQUFOLENBQUosRUFBYztnQkFDTixDQUFKOzs7WUFHQXNlLE1BQU10ZSxJQUFJMmQsRUFBSixHQUFTUyxFQUFULEdBQWNSLEVBQXhCO1lBQ0lXLE1BQU12ZSxJQUFJLENBQUM0ZCxFQUFMLEdBQVVPLEVBQVYsR0FBZVIsRUFBekI7O1lBRUkvTyxLQUFLLENBQUMzVixLQUFLcVgsRUFBTixJQUFZLEdBQVosR0FBa0Izb0IsS0FBSzJPLEdBQUwsQ0FBU3VuQixHQUFULElBQWdCUyxHQUFsQyxHQUF3QzMyQixLQUFLNE8sR0FBTCxDQUFTc25CLEdBQVQsSUFBZ0JVLEdBQWpFO1lBQ0k3UCxLQUFLLENBQUN2VixLQUFLb1gsRUFBTixJQUFZLEdBQVosR0FBa0I1b0IsS0FBSzRPLEdBQUwsQ0FBU3NuQixHQUFULElBQWdCUyxHQUFsQyxHQUF3QzMyQixLQUFLMk8sR0FBTCxDQUFTdW5CLEdBQVQsSUFBZ0JVLEdBQWpFOztZQUVJQyxPQUFPLFVBQVN0bkIsQ0FBVCxFQUFZO21CQUNadlAsS0FBS2dZLElBQUwsQ0FBVXpJLEVBQUUsQ0FBRixJQUFPQSxFQUFFLENBQUYsQ0FBUCxHQUFjQSxFQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLENBQS9CLENBQVA7U0FESjtZQUdJdW5CLFNBQVMsVUFBU0MsQ0FBVCxFQUFZeG5CLENBQVosRUFBZTttQkFDakIsQ0FBQ3duQixFQUFFLENBQUYsSUFBT3huQixFQUFFLENBQUYsQ0FBUCxHQUFjd25CLEVBQUUsQ0FBRixJQUFPeG5CLEVBQUUsQ0FBRixDQUF0QixLQUErQnNuQixLQUFLRSxDQUFMLElBQVVGLEtBQUt0bkIsQ0FBTCxDQUF6QyxDQUFQO1NBREo7WUFHSXluQixTQUFTLFVBQVNELENBQVQsRUFBWXhuQixDQUFaLEVBQWU7bUJBQ2pCLENBQUN3bkIsRUFBRSxDQUFGLElBQU94bkIsRUFBRSxDQUFGLENBQVAsR0FBY3duQixFQUFFLENBQUYsSUFBT3huQixFQUFFLENBQUYsQ0FBckIsR0FBNEIsQ0FBQyxDQUE3QixHQUFpQyxDQUFsQyxJQUF1Q3ZQLEtBQUtpM0IsSUFBTCxDQUFVSCxPQUFPQyxDQUFQLEVBQVV4bkIsQ0FBVixDQUFWLENBQTlDO1NBREo7WUFHSW1lLFFBQVFzSixPQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBUCxFQUFlLENBQUMsQ0FBQ1IsS0FBS0csR0FBTixJQUFhWCxFQUFkLEVBQWtCLENBQUNTLEtBQUtHLEdBQU4sSUFBYVgsRUFBL0IsQ0FBZixDQUFaO1lBQ0ljLElBQUksQ0FBQyxDQUFDUCxLQUFLRyxHQUFOLElBQWFYLEVBQWQsRUFBa0IsQ0FBQ1MsS0FBS0csR0FBTixJQUFhWCxFQUEvQixDQUFSO1lBQ0kxbUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFELEdBQUtpbkIsRUFBTCxHQUFVRyxHQUFYLElBQWtCWCxFQUFuQixFQUF1QixDQUFDLENBQUMsQ0FBRCxHQUFLUyxFQUFMLEdBQVVHLEdBQVgsSUFBa0JYLEVBQXpDLENBQVI7WUFDSWlCLFNBQVNGLE9BQU9ELENBQVAsRUFBVXhuQixDQUFWLENBQWI7O1lBRUl1bkIsT0FBT0MsQ0FBUCxFQUFVeG5CLENBQVYsS0FBZ0IsQ0FBQyxDQUFyQixFQUF3QjtxQkFDWHZQLEtBQUs2TyxFQUFkOztZQUVBaW9CLE9BQU9DLENBQVAsRUFBVXhuQixDQUFWLEtBQWdCLENBQXBCLEVBQXVCO3FCQUNWLENBQVQ7O1lBRUE2bUIsT0FBTyxDQUFQLElBQVljLFNBQVMsQ0FBekIsRUFBNEI7cUJBQ2ZBLFNBQVMsSUFBSWwzQixLQUFLNk8sRUFBM0I7O1lBRUF1bkIsT0FBTyxDQUFQLElBQVljLFNBQVMsQ0FBekIsRUFBNEI7cUJBQ2ZBLFNBQVMsSUFBSWwzQixLQUFLNk8sRUFBM0I7O2VBRUcsQ0FBQ29ZLEVBQUQsRUFBS0YsRUFBTCxFQUFTaVAsRUFBVCxFQUFhQyxFQUFiLEVBQWlCdkksS0FBakIsRUFBd0J3SixNQUF4QixFQUFnQ2hCLEdBQWhDLEVBQXFDRSxFQUFyQyxDQUFQO0tBelVzQjs7OztzQkE4VVIsVUFBUzd5QixDQUFULEVBQVk7WUFDdEI0ekIsUUFBUW4zQixLQUFLaVAsR0FBTCxDQUFTalAsS0FBS2dZLElBQUwsQ0FBVWhZLEtBQUsrWCxHQUFMLENBQVN4VSxFQUFFcEMsS0FBRixDQUFRLENBQUMsQ0FBVCxFQUFZLENBQVosSUFBaUJvQyxFQUFFLENBQUYsQ0FBMUIsRUFBZ0MsQ0FBaEMsSUFBcUN2RCxLQUFLK1gsR0FBTCxDQUFTeFUsRUFBRXBDLEtBQUYsQ0FBUSxDQUFDLENBQVQsRUFBWSxDQUFDLENBQWIsRUFBZ0IsQ0FBaEIsSUFBcUJvQyxFQUFFLENBQUYsQ0FBOUIsRUFBb0MsQ0FBcEMsQ0FBL0MsQ0FBVCxDQUFaO2dCQUNRdkQsS0FBS3V0QixJQUFMLENBQVU0SixRQUFRLENBQWxCLENBQVI7WUFDSUMsT0FBTyxFQUFYO2FBQ0ssSUFBSXA1QixJQUFJLENBQWIsRUFBZ0JBLEtBQUttNUIsS0FBckIsRUFBNEJuNUIsR0FBNUIsRUFBaUM7Z0JBQ3pCNmEsSUFBSTdhLElBQUltNUIsS0FBWjtnQkFDSUUsS0FBS0MsT0FBT0MsY0FBUCxDQUFzQjFlLENBQXRCLEVBQXlCdFYsQ0FBekIsQ0FBVDtpQkFDS25GLElBQUwsQ0FBVWk1QixHQUFHajBCLENBQWI7aUJBQ0toRixJQUFMLENBQVVpNUIsR0FBR2gwQixDQUFiOztlQUVHK3pCLElBQVA7S0F4VnNCOzs7O21CQTZWWCxVQUFTN3pCLENBQVQsRUFBWTs7WUFFbkIwakIsS0FBSzFqQixFQUFFLENBQUYsQ0FBVDtZQUNJd2pCLEtBQUt4akIsRUFBRSxDQUFGLENBQVQ7WUFDSXl5QixLQUFLenlCLEVBQUUsQ0FBRixDQUFUO1lBQ0kweUIsS0FBSzF5QixFQUFFLENBQUYsQ0FBVDtZQUNJbXFCLFFBQVFucUIsRUFBRSxDQUFGLENBQVo7WUFDSTJ6QixTQUFTM3pCLEVBQUUsQ0FBRixDQUFiO1lBQ0kyeUIsTUFBTTN5QixFQUFFLENBQUYsQ0FBVjtZQUNJNnlCLEtBQUs3eUIsRUFBRSxDQUFGLENBQVQ7WUFDSXJCLElBQUs4ekIsS0FBS0MsRUFBTixHQUFZRCxFQUFaLEdBQWlCQyxFQUF6QjtZQUNJem5CLFNBQVV3bkIsS0FBS0MsRUFBTixHQUFZLENBQVosR0FBZ0JELEtBQUtDLEVBQWxDO1lBQ0l4bkIsU0FBVXVuQixLQUFLQyxFQUFOLEdBQVlBLEtBQUtELEVBQWpCLEdBQXNCLENBQW5DOztZQUVJNXFCLGFBQWEsSUFBSTRDLE1BQUosRUFBakI7bUJBQ1dyUCxRQUFYO21CQUNXbWhCLEtBQVgsQ0FBaUJ0UixNQUFqQixFQUF5QkMsTUFBekI7bUJBQ1d1UixNQUFYLENBQWtCa1csR0FBbEI7bUJBQ1dyVyxTQUFYLENBQXFCb0gsRUFBckIsRUFBeUJGLEVBQXpCOztZQUVJeVEsTUFBTSxFQUFWO1lBQ0lMLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQ2YsRUFBRCxHQUFNLENBQU4sR0FBVSxDQUFDLENBQVosSUFBaUJjLE1BQWpCLEdBQTBCLEdBQTFCLEdBQWdDbDNCLEtBQUs2TyxFQUE1QyxJQUFrRCxHQUE5RDs7Z0JBRVE3TyxLQUFLdXRCLElBQUwsQ0FBVXZ0QixLQUFLb1MsR0FBTCxDQUFTcFMsS0FBS2lQLEdBQUwsQ0FBU2lvQixNQUFULElBQW1CLEdBQW5CLEdBQXlCbDNCLEtBQUs2TyxFQUF2QyxFQUEyQzNNLElBQUlsQyxLQUFLaVAsR0FBTCxDQUFTaW9CLE1BQVQsQ0FBSixHQUF1QixDQUFsRSxDQUFWLENBQVIsQ0F2QnVCOzthQXlCbEIsSUFBSWw1QixJQUFJLENBQWIsRUFBZ0JBLEtBQUttNUIsS0FBckIsRUFBNEJuNUIsR0FBNUIsRUFBaUM7Z0JBQ3pCOEYsUUFBUSxDQUFDOUQsS0FBSzJPLEdBQUwsQ0FBUytlLFFBQVF3SixTQUFTQyxLQUFULEdBQWlCbjVCLENBQWxDLElBQXVDa0UsQ0FBeEMsRUFBMkNsQyxLQUFLNE8sR0FBTCxDQUFTOGUsUUFBUXdKLFNBQVNDLEtBQVQsR0FBaUJuNUIsQ0FBbEMsSUFBdUNrRSxDQUFsRixDQUFaO29CQUNRa0osV0FBV2tWLFNBQVgsQ0FBcUJ4YyxLQUFyQixDQUFSO2dCQUNJMUYsSUFBSixDQUFTMEYsTUFBTSxDQUFOLENBQVQ7Z0JBQ0kxRixJQUFKLENBQVMwRixNQUFNLENBQU4sQ0FBVDs7ZUFFRzB6QixHQUFQO0tBNVhzQjs7VUErWHBCLFVBQVMxVyxHQUFULEVBQWMzYSxLQUFkLEVBQXFCO2FBQ2xCZ3VCLEtBQUwsQ0FBV3JULEdBQVgsRUFBZ0IzYSxLQUFoQjtLQWhZc0I7Ozs7O1dBc1luQixVQUFTMmEsR0FBVCxFQUFjM2EsS0FBZCxFQUFxQjtZQUNwQndrQixPQUFPeGtCLE1BQU13a0IsSUFBakI7WUFDSThNLFlBQVksS0FBS0MsY0FBTCxDQUFvQi9NLElBQXBCLENBQWhCO2FBQ0tnTixhQUFMLENBQW1CRixTQUFuQixFQUE4QnR4QixLQUE5QjthQUNLLElBQUl5eEIsSUFBSSxDQUFSLEVBQVdDLEtBQUtKLFVBQVUxNUIsTUFBL0IsRUFBdUM2NUIsSUFBSUMsRUFBM0MsRUFBK0NELEdBQS9DLEVBQW9EO2lCQUMzQyxJQUFJNTVCLElBQUksQ0FBUixFQUFXa1UsSUFBSXVsQixVQUFVRyxDQUFWLEVBQWE3NUIsTUFBakMsRUFBeUNDLElBQUlrVSxDQUE3QyxFQUFnRGxVLEdBQWhELEVBQXFEO29CQUM3Q21RLElBQUlzcEIsVUFBVUcsQ0FBVixFQUFhNTVCLENBQWIsRUFBZ0JxNEIsT0FBeEI7b0JBQWlDOXlCLElBQUlrMEIsVUFBVUcsQ0FBVixFQUFhNTVCLENBQWIsRUFBZ0JxckIsTUFBckQ7d0JBQ1FsYixDQUFSO3lCQUNTLEdBQUw7NEJBQ1FzaEIsTUFBSixDQUFXbHNCLEVBQUUsQ0FBRixDQUFYLEVBQWlCQSxFQUFFLENBQUYsQ0FBakI7O3lCQUVDLEdBQUw7NEJBQ1E0b0IsTUFBSixDQUFXNW9CLEVBQUUsQ0FBRixDQUFYLEVBQWlCQSxFQUFFLENBQUYsQ0FBakI7O3lCQUVDLEdBQUw7NEJBQ1EybUIsYUFBSixDQUFrQjNtQixFQUFFLENBQUYsQ0FBbEIsRUFBd0JBLEVBQUUsQ0FBRixDQUF4QixFQUE4QkEsRUFBRSxDQUFGLENBQTlCLEVBQW9DQSxFQUFFLENBQUYsQ0FBcEMsRUFBMENBLEVBQUUsQ0FBRixDQUExQyxFQUFnREEsRUFBRSxDQUFGLENBQWhEOzt5QkFFQyxHQUFMOzRCQUNRdTBCLGdCQUFKLENBQXFCdjBCLEVBQUUsQ0FBRixDQUFyQixFQUEyQkEsRUFBRSxDQUFGLENBQTNCLEVBQWlDQSxFQUFFLENBQUYsQ0FBakMsRUFBdUNBLEVBQUUsQ0FBRixDQUF2Qzs7eUJBRUMsR0FBTDs0QkFDUTBqQixLQUFLMWpCLEVBQUUsQ0FBRixDQUFUOzRCQUNJd2pCLEtBQUt4akIsRUFBRSxDQUFGLENBQVQ7NEJBQ0l5eUIsS0FBS3p5QixFQUFFLENBQUYsQ0FBVDs0QkFDSTB5QixLQUFLMXlCLEVBQUUsQ0FBRixDQUFUOzRCQUNJbXFCLFFBQVFucUIsRUFBRSxDQUFGLENBQVo7NEJBQ0kyekIsU0FBUzN6QixFQUFFLENBQUYsQ0FBYjs0QkFDSTJ5QixNQUFNM3lCLEVBQUUsQ0FBRixDQUFWOzRCQUNJNnlCLEtBQUs3eUIsRUFBRSxDQUFGLENBQVQ7NEJBQ0lyQixJQUFLOHpCLEtBQUtDLEVBQU4sR0FBWUQsRUFBWixHQUFpQkMsRUFBekI7NEJBQ0l6bkIsU0FBVXduQixLQUFLQyxFQUFOLEdBQVksQ0FBWixHQUFnQkQsS0FBS0MsRUFBbEM7NEJBQ0l4bkIsU0FBVXVuQixLQUFLQyxFQUFOLEdBQVlBLEtBQUtELEVBQWpCLEdBQXNCLENBQW5DOzRCQUNJNXFCLGFBQWEsSUFBSTRDLE1BQUosRUFBakI7bUNBQ1dyUCxRQUFYO21DQUNXbWhCLEtBQVgsQ0FBaUJ0UixNQUFqQixFQUF5QkMsTUFBekI7bUNBQ1d1UixNQUFYLENBQWtCa1csR0FBbEI7bUNBQ1dyVyxTQUFYLENBQXFCb0gsRUFBckIsRUFBeUJGLEVBQXpCOzs0QkFFSTdGLFNBQUosQ0FBY3BULEtBQWQsQ0FBb0JnVCxHQUFwQixFQUF5QjFWLFdBQVcrVixPQUFYLEVBQXpCOzRCQUNJZ00sR0FBSixDQUFRLENBQVIsRUFBVyxDQUFYLEVBQWNqckIsQ0FBZCxFQUFpQndyQixLQUFqQixFQUF3QkEsUUFBUXdKLE1BQWhDLEVBQXdDLElBQUlkLEVBQTVDOzs0QkFFSWxWLFNBQUosQ0FBY3BULEtBQWQsQ0FBb0JnVCxHQUFwQixFQUF5QjFWLFdBQVc4VCxNQUFYLEdBQW9CaUMsT0FBcEIsRUFBekI7O3lCQUVDLEdBQUw7NEJBQ1E4TixTQUFKOzs7OztlQUtULElBQVA7S0F2YnNCO21CQXliWCxVQUFTd0ksU0FBVCxFQUFvQnR4QixLQUFwQixFQUEyQjtZQUNsQ0EsTUFBTTRMLFNBQU4sQ0FBZ0JoVSxNQUFoQixHQUF5QixDQUE3QixFQUFnQzs7Ozs7WUFLNUJnVSxZQUFZNUwsTUFBTTRMLFNBQU4sR0FBa0IsRUFBbEM7YUFDSyxJQUFJNmxCLElBQUksQ0FBUixFQUFXQyxLQUFLSixVQUFVMTVCLE1BQS9CLEVBQXVDNjVCLElBQUlDLEVBQTNDLEVBQStDRCxHQUEvQyxFQUFvRDs7Z0JBRTVDRyxrQkFBa0IsRUFBdEI7O2lCQUVLLElBQUkvNUIsSUFBSSxDQUFSLEVBQVdrVSxJQUFJdWxCLFVBQVVHLENBQVYsRUFBYTc1QixNQUFqQyxFQUF5Q0MsSUFBSWtVLENBQTdDLEVBQWdEbFUsR0FBaEQsRUFBcUQ7b0JBQzdDdUYsSUFBSWswQixVQUFVRyxDQUFWLEVBQWE1NUIsQ0FBYixFQUFnQnFyQixNQUF4QjtvQkFDSXVNLE1BQU02QixVQUFVRyxDQUFWLEVBQWE1NUIsQ0FBYixFQUFnQnE0QixPQUExQjs7b0JBRUlULElBQUlvQyxXQUFKLE1BQXFCLEdBQXpCLEVBQThCO3dCQUN0QixLQUFLQyxhQUFMLENBQW1CMTBCLENBQW5CLENBQUo7OzhCQUVVcTBCLENBQVYsRUFBYTU1QixDQUFiLEVBQWdCazZCLE9BQWhCLEdBQTBCMzBCLENBQTFCOzs7b0JBR0FxeUIsSUFBSW9DLFdBQUosTUFBcUIsR0FBckIsSUFBNEJwQyxJQUFJb0MsV0FBSixNQUFxQixHQUFyRCxFQUEwRDt3QkFDbERHLFNBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFiO3dCQUNJSixnQkFBZ0JoNkIsTUFBaEIsR0FBeUIsQ0FBN0IsRUFBZ0M7aUNBQ25CZzZCLGdCQUFnQjUyQixLQUFoQixDQUFzQixDQUFDLENBQXZCLEVBQTBCLENBQTFCLENBQVQ7cUJBREosTUFFTyxJQUFJbkQsSUFBSSxDQUFSLEVBQVc7NEJBQ1ZvNkIsWUFBYVgsVUFBVUcsQ0FBVixFQUFhNTVCLElBQUksQ0FBakIsRUFBb0JrNkIsT0FBcEIsSUFBK0JULFVBQVVHLENBQVYsRUFBYTU1QixJQUFJLENBQWpCLEVBQW9CcXJCLE1BQXBFOzRCQUNJK08sVUFBVXI2QixNQUFWLElBQW9CLENBQXhCLEVBQTJCO3FDQUNkcTZCLFVBQVVqM0IsS0FBVixDQUFnQixDQUFDLENBQWpCLENBQVQ7Ozt3QkFHSixLQUFLazNCLGdCQUFMLENBQXNCRixPQUFPcnBCLE1BQVAsQ0FBY3ZMLENBQWQsQ0FBdEIsQ0FBSjs4QkFDVXEwQixDQUFWLEVBQWE1NUIsQ0FBYixFQUFnQms2QixPQUFoQixHQUEwQjMwQixDQUExQjs7O3FCQUdDLElBQUl1a0IsSUFBSSxDQUFSLEVBQVdoUSxJQUFJdlUsRUFBRXhGLE1BQXRCLEVBQThCK3BCLElBQUloUSxDQUFsQyxFQUFxQ2dRLEtBQUssQ0FBMUMsRUFBNkM7d0JBQ3JDMWxCLEtBQUttQixFQUFFdWtCLENBQUYsQ0FBVDt3QkFDSWtGLEtBQUt6cEIsRUFBRXVrQixJQUFJLENBQU4sQ0FBVDt3QkFDSyxDQUFDMWxCLEVBQUQsSUFBT0EsTUFBSSxDQUFaLElBQW1CLENBQUM0cUIsRUFBRCxJQUFPQSxNQUFJLENBQWxDLEVBQXNDOzs7b0NBR3RCNXVCLElBQWhCLENBQXFCLENBQUNnRSxFQUFELEVBQUs0cUIsRUFBTCxDQUFyQjs7OzRCQUdRanZCLE1BQWhCLEdBQXlCLENBQXpCLElBQThCZ1UsVUFBVTNULElBQVYsQ0FBZTI1QixlQUFmLENBQTlCOztLQXJla0I7Ozs7O2FBNGVqQixVQUFTNXhCLEtBQVQsRUFBZ0I7O1lBRWpCd0wsU0FBSjtZQUNJeEwsUUFBUUEsUUFBUUEsS0FBUixHQUFnQixLQUFLM0gsT0FBakM7WUFDSTJILE1BQU0rWixXQUFOLElBQXFCL1osTUFBTXNOLFNBQS9CLEVBQTBDO3dCQUMxQnROLE1BQU13TCxTQUFOLElBQW1CLENBQS9CO1NBREosTUFFTzt3QkFDUyxDQUFaOzs7WUFHQStkLE9BQU9DLE9BQU9DLFNBQWxCO1lBQ0lDLE9BQU8sQ0FBQ0YsT0FBT0MsU0FBbkIsQ0FYcUI7O1lBYWpCRyxPQUFPSixPQUFPQyxTQUFsQjtZQUNJSSxPQUFPLENBQUNMLE9BQU9DLFNBQW5CLENBZHFCOzs7WUFpQmpCeHNCLElBQUksQ0FBUjtZQUNJQyxJQUFJLENBQVI7O1lBRUlvMEIsWUFBWSxLQUFLQyxjQUFMLENBQW9CdnhCLE1BQU13a0IsSUFBMUIsQ0FBaEI7YUFDS2dOLGFBQUwsQ0FBbUJGLFNBQW5CLEVBQThCdHhCLEtBQTlCOzthQUVLLElBQUl5eEIsSUFBSSxDQUFSLEVBQVdDLEtBQUtKLFVBQVUxNUIsTUFBL0IsRUFBdUM2NUIsSUFBSUMsRUFBM0MsRUFBK0NELEdBQS9DLEVBQW9EO2lCQUMzQyxJQUFJNTVCLElBQUksQ0FBYixFQUFnQkEsSUFBSXk1QixVQUFVRyxDQUFWLEVBQWE3NUIsTUFBakMsRUFBeUNDLEdBQXpDLEVBQThDO29CQUN0Q3VGLElBQUlrMEIsVUFBVUcsQ0FBVixFQUFhNTVCLENBQWIsRUFBZ0JrNkIsT0FBaEIsSUFBMkJULFVBQVVHLENBQVYsRUFBYTU1QixDQUFiLEVBQWdCcXJCLE1BQW5EOztxQkFFSyxJQUFJdkIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJdmtCLEVBQUV4RixNQUF0QixFQUE4QitwQixHQUE5QixFQUFtQzt3QkFDM0JBLElBQUksQ0FBSixLQUFVLENBQWQsRUFBaUI7NEJBQ1R2a0IsRUFBRXVrQixDQUFGLElBQU8xa0IsQ0FBUCxHQUFXc3NCLElBQWYsRUFBcUI7bUNBQ1Zuc0IsRUFBRXVrQixDQUFGLElBQU8xa0IsQ0FBZDs7NEJBRUFHLEVBQUV1a0IsQ0FBRixJQUFPMWtCLENBQVAsR0FBV3lzQixJQUFmLEVBQXFCO21DQUNWdHNCLEVBQUV1a0IsQ0FBRixJQUFPMWtCLENBQWQ7O3FCQUxSLE1BT087NEJBQ0NHLEVBQUV1a0IsQ0FBRixJQUFPemtCLENBQVAsR0FBVzBzQixJQUFmLEVBQXFCO21DQUNWeHNCLEVBQUV1a0IsQ0FBRixJQUFPemtCLENBQWQ7OzRCQUVBRSxFQUFFdWtCLENBQUYsSUFBT3prQixDQUFQLEdBQVcyc0IsSUFBZixFQUFxQjttQ0FDVnpzQixFQUFFdWtCLENBQUYsSUFBT3prQixDQUFkOzs7Ozs7O1lBT2hCaTFCLElBQUo7WUFDSTVJLFNBQVNDLE9BQU9DLFNBQWhCLElBQTZCQyxTQUFTRixPQUFPRyxTQUE3QyxJQUEwREMsU0FBU0osT0FBT0MsU0FBMUUsSUFBdUZJLFNBQVNMLE9BQU9HLFNBQTNHLEVBQXNIO21CQUMzRzttQkFDQSxDQURBO21CQUVBLENBRkE7dUJBR0ksQ0FISjt3QkFJSzthQUpaO1NBREosTUFPTzttQkFDSTttQkFDQTl2QixLQUFLa3dCLEtBQUwsQ0FBV1IsT0FBTy9kLFlBQVksQ0FBOUIsQ0FEQTttQkFFQTNSLEtBQUtrd0IsS0FBTCxDQUFXSCxPQUFPcGUsWUFBWSxDQUE5QixDQUZBO3VCQUdJa2UsT0FBT0gsSUFBUCxHQUFjL2QsU0FIbEI7d0JBSUtxZSxPQUFPRCxJQUFQLEdBQWNwZTthQUoxQjs7ZUFPRzJtQixJQUFQOzs7Q0EzaUJSLEVBK2lCQTs7QUN4bEJBOzs7Ozs7Ozs7OztBQVdBLEFBQ0EsQUFDQSxBQUVBLElBQUlDLFVBQVUsVUFBUzMxQixHQUFULEVBQWE7UUFDbkJzSixPQUFPLElBQVg7VUFDTTlLLE1BQU0yYyxRQUFOLENBQWdCbmIsR0FBaEIsQ0FBTjtTQUNLNmIsUUFBTCxHQUFnQjtZQUNQN2IsSUFBSXBFLE9BQUosQ0FBWXdVLEVBQVosSUFBa0IsQ0FEWDtZQUVQcFEsSUFBSXBFLE9BQUosQ0FBWTBVLEVBQVosSUFBa0IsQ0FGWDtLQUFoQjtZQUlRMVEsVUFBUixDQUFtQmxDLFdBQW5CLENBQStCd04sS0FBL0IsQ0FBcUMsSUFBckMsRUFBMkM3TSxTQUEzQztTQUNLMkMsSUFBTCxHQUFZLFNBQVo7Q0FSSjtBQVVBeEMsTUFBTXVMLFVBQU4sQ0FBa0I0ckIsT0FBbEIsRUFBNEJ4RCxJQUE1QixFQUFtQztVQUN4QixVQUFTalUsR0FBVCxFQUFjM2EsS0FBZCxFQUFxQjtZQUNyQnF5QixLQUFLLFNBQU9yeUIsTUFBTTZNLEVBQWIsR0FBZ0IsS0FBaEIsR0FBc0I3TSxNQUFNNk0sRUFBNUIsR0FBK0IsR0FBL0IsR0FBbUM3TSxNQUFNNk0sRUFBekMsR0FBNEMsR0FBNUMsR0FBa0Q3TSxNQUFNNk0sRUFBTixHQUFTLENBQVQsR0FBVyxDQUE3RCxHQUFrRSxHQUFsRSxHQUF1RSxDQUFDN00sTUFBTTZNLEVBQVAsR0FBVSxDQUFqRixHQUFvRixLQUFwRixHQUEyRixDQUFDN00sTUFBTStNLEVBQTNHO2NBQ00sUUFBTyxDQUFDL00sTUFBTTZNLEVBQVAsR0FBWSxDQUFaLEdBQWUsQ0FBdEIsR0FBeUIsR0FBekIsR0FBOEIsQ0FBQzdNLE1BQU02TSxFQUFQLEdBQVksQ0FBMUMsR0FBNkMsR0FBN0MsR0FBa0QsQ0FBQzdNLE1BQU02TSxFQUF6RCxHQUE2RCxHQUE3RCxHQUFpRTdNLE1BQU02TSxFQUF2RSxHQUEwRSxLQUExRSxHQUFpRjdNLE1BQU02TSxFQUE3RjthQUNLeFUsT0FBTCxDQUFhbXNCLElBQWIsR0FBb0I2TixFQUFwQjthQUNLckUsS0FBTCxDQUFXclQsR0FBWCxFQUFpQjNhLEtBQWpCOztDQUxQLEVBUUE7O0FDaENBOzs7Ozs7Ozs7Ozs7QUFZQSxBQUNBLEFBQ0EsQUFDQSxJQUFJNmlCLFlBQVUsVUFBU3BtQixHQUFULEVBQWE7UUFDbkJzSixPQUFPLElBQVg7U0FDS3RJLElBQUwsR0FBWSxTQUFaOztVQUVNeEMsTUFBTTJjLFFBQU4sQ0FBZ0JuYixHQUFoQixDQUFOO1NBQ0s2YixRQUFMLEdBQWdCOzs7WUFHUDdiLElBQUlwRSxPQUFKLENBQVl3VSxFQUFaLElBQWtCLENBSFg7WUFJUHBRLElBQUlwRSxPQUFKLENBQVkwVSxFQUFaLElBQWtCLENBSlg7S0FBaEI7O2NBT1ExUSxVQUFSLENBQW1CbEMsV0FBbkIsQ0FBK0J3TixLQUEvQixDQUFxQyxJQUFyQyxFQUEyQzdNLFNBQTNDO0NBWko7O0FBZUFHLE1BQU11TCxVQUFOLENBQWlCcWMsU0FBakIsRUFBMkIwRixLQUEzQixFQUFtQztVQUN2QixVQUFTNU4sR0FBVCxFQUFjM2EsS0FBZCxFQUFxQjtZQUNyQmpFLElBQUtpRSxNQUFNNk0sRUFBTixHQUFXN00sTUFBTStNLEVBQWxCLEdBQXdCL00sTUFBTTZNLEVBQTlCLEdBQW1DN00sTUFBTStNLEVBQWpEO1lBQ0l1bEIsU0FBU3R5QixNQUFNNk0sRUFBTixHQUFXOVEsQ0FBeEIsQ0FGeUI7WUFHckJ3MkIsU0FBU3Z5QixNQUFNK00sRUFBTixHQUFXaFIsQ0FBeEI7O1lBRUk0ZCxLQUFKLENBQVUyWSxNQUFWLEVBQWtCQyxNQUFsQjtZQUNJdkwsR0FBSixDQUNJLENBREosRUFDTyxDQURQLEVBQ1VqckIsQ0FEVixFQUNhLENBRGIsRUFDZ0JsQyxLQUFLNk8sRUFBTCxHQUFVLENBRDFCLEVBQzZCLElBRDdCO1lBR0tuTixTQUFTQyxhQUFULENBQXVCLFFBQXZCLEVBQWlDQyxVQUF0QyxFQUFrRDs7O2dCQUczQ2tlLEtBQUosQ0FBVSxJQUFFMlksTUFBWixFQUFvQixJQUFFQyxNQUF0Qjs7O0tBYndCO2FBa0JyQixVQUFTdnlCLEtBQVQsRUFBZTtZQUNqQndMLFNBQUo7WUFDSXhMLFFBQVFBLFFBQVFBLEtBQVIsR0FBZ0IsS0FBSzNILE9BQWpDO1lBQ0kySCxNQUFNc04sU0FBTixJQUFtQnROLE1BQU0rWixXQUE3QixFQUEwQzt3QkFDMUIvWixNQUFNd0wsU0FBTixJQUFtQixDQUEvQjtTQURKLE1BR0s7d0JBQ1csQ0FBWjs7ZUFFRztlQUNHM1IsS0FBS2t3QixLQUFMLENBQVcsSUFBSS9wQixNQUFNNk0sRUFBVixHQUFlckIsWUFBWSxDQUF0QyxDQURIO2VBRUczUixLQUFLa3dCLEtBQUwsQ0FBVyxJQUFJL3BCLE1BQU0rTSxFQUFWLEdBQWV2QixZQUFZLENBQXRDLENBRkg7bUJBR094TCxNQUFNNk0sRUFBTixHQUFXLENBQVgsR0FBZXJCLFNBSHRCO29CQUlReEwsTUFBTStNLEVBQU4sR0FBVyxDQUFYLEdBQWV2QjtTQUo5Qjs7Q0EzQlIsRUFxQ0E7O0FDcEVBOzs7Ozs7Ozs7O0FBVUEsQUFDQSxBQUNBLEFBRUEsSUFBSXlYLFlBQVUsVUFBU3htQixHQUFULEVBQWVpeEIsS0FBZixFQUFzQjtRQUM1QjNuQixPQUFPLElBQVg7VUFDTTlLLE1BQU0yYyxRQUFOLENBQWVuYixHQUFmLENBQU47O1FBRUdpeEIsVUFBVSxPQUFiLEVBQXFCO1lBQ2J2cEIsUUFBUTFILElBQUlwRSxPQUFKLENBQVl1VCxTQUFaLENBQXNCLENBQXRCLENBQVo7WUFDSXZILE1BQVE1SCxJQUFJcEUsT0FBSixDQUFZdVQsU0FBWixDQUF1Qm5QLElBQUlwRSxPQUFKLENBQVl1VCxTQUFaLENBQXNCaFUsTUFBdEIsR0FBK0IsQ0FBdEQsQ0FBWjtZQUNJNkUsSUFBSXBFLE9BQUosQ0FBWXcxQixNQUFoQixFQUF3QjtnQkFDaEJ4MUIsT0FBSixDQUFZdVQsU0FBWixDQUFzQjRtQixPQUF0QixDQUErQm51QixHQUEvQjtTQURKLE1BRU87Z0JBQ0NoTSxPQUFKLENBQVl1VCxTQUFaLENBQXNCM1QsSUFBdEIsQ0FBNEJrTSxLQUE1Qjs7OztjQUlBOUgsVUFBUixDQUFtQmxDLFdBQW5CLENBQStCd04sS0FBL0IsQ0FBcUMsSUFBckMsRUFBMkM3TSxTQUEzQzs7UUFFRzR5QixVQUFVLE9BQVYsSUFBcUJqeEIsSUFBSXBFLE9BQUosQ0FBWXcxQixNQUFqQyxJQUEyQ3hwQixHQUE5QyxFQUFrRDs7U0FJN0N3a0IsYUFBTCxHQUFxQixJQUFyQjtTQUNLcHJCLElBQUwsR0FBWSxTQUFaO0NBckJKO0FBdUJBeEMsTUFBTXVMLFVBQU4sQ0FBaUJ5YyxTQUFqQixFQUEwQndLLFVBQTFCLEVBQXNDO1VBQzVCLFVBQVM5UyxHQUFULEVBQWN0aUIsT0FBZCxFQUF1QjtZQUNyQkEsUUFBUWlWLFNBQVosRUFBdUI7Z0JBQ2ZqVixRQUFRNDFCLFFBQVIsSUFBb0IsUUFBcEIsSUFBZ0M1MUIsUUFBUTQxQixRQUFSLElBQW9CLFFBQXhELEVBQWtFO29CQUMxRHJpQixZQUFZdlQsUUFBUXVULFNBQXhCOztvQkFFSWlQLElBQUo7b0JBQ0ltTyxTQUFKO29CQUNJaEQsTUFBSixDQUFXcGEsVUFBVSxDQUFWLEVBQWEsQ0FBYixDQUFYLEVBQTRCQSxVQUFVLENBQVYsRUFBYSxDQUFiLENBQTVCO3FCQUNLLElBQUkvVCxJQUFJLENBQVIsRUFBV2tVLElBQUlILFVBQVVoVSxNQUE5QixFQUFzQ0MsSUFBSWtVLENBQTFDLEVBQTZDbFUsR0FBN0MsRUFBa0Q7d0JBQzFDeXhCLE1BQUosQ0FBVzFkLFVBQVUvVCxDQUFWLEVBQWEsQ0FBYixDQUFYLEVBQTRCK1QsVUFBVS9ULENBQVYsRUFBYSxDQUFiLENBQTVCOztvQkFFQWl4QixTQUFKO29CQUNJNU4sT0FBSjtvQkFDSXNFLElBQUo7cUJBQ0txSixhQUFMLEdBQXFCLFFBQXJCOzs7O1lBSUpoTyxJQUFKO1lBQ0ltTyxTQUFKO2FBQ0tnRixLQUFMLENBQVdyVCxHQUFYLEVBQWdCdGlCLE9BQWhCO1lBQ0l5d0IsU0FBSjtZQUNJNU4sT0FBSjs7Q0F2QlIsRUEwQkE7O0FDL0RBOzs7Ozs7Ozs7Ozs7OztBQWNBLEFBQ0EsQUFDQSxBQUVBLElBQUl1WCxTQUFTLFVBQVNoMkIsR0FBVCxFQUFjO1FBQ25Cc0osT0FBTyxJQUFYO1VBQ005SyxNQUFNMmMsUUFBTixDQUFlbmIsR0FBZixDQUFOO1NBQ0s2YixRQUFMLEdBQWdCL2hCLElBQUVnRSxNQUFGLENBQVM7bUJBQ1YsRUFEVTtXQUVsQixDQUZrQjtXQUdsQixDQUhrQjtLQUFULEVBSVprQyxJQUFJcEUsT0FKUSxDQUFoQjtTQUtLcTZCLFlBQUwsQ0FBa0Izc0IsS0FBS3VTLFFBQXZCO1FBQ0lqZ0IsT0FBSixHQUFjME4sS0FBS3VTLFFBQW5CO1dBQ09qYyxVQUFQLENBQWtCbEMsV0FBbEIsQ0FBOEJ3TixLQUE5QixDQUFvQyxJQUFwQyxFQUEwQzdNLFNBQTFDO1NBQ0syQyxJQUFMLEdBQVksUUFBWjtDQVhKO0FBYUF4QyxNQUFNdUwsVUFBTixDQUFpQmlzQixNQUFqQixFQUF5QnhQLFNBQXpCLEVBQWtDO1lBQ3RCLFVBQVNucUIsSUFBVCxFQUFlSCxLQUFmLEVBQXNCZ2QsUUFBdEIsRUFBZ0M7WUFDaEM3YyxRQUFRLEdBQVIsSUFBZUEsUUFBUSxHQUEzQixFQUFnQzs7aUJBQ3ZCNDVCLFlBQUwsQ0FBbUIsS0FBS3I2QixPQUF4Qjs7S0FIc0I7a0JBTWhCLFVBQVMySCxLQUFULEVBQWdCO2NBQ3BCNEwsU0FBTixDQUFnQmhVLE1BQWhCLEdBQXlCLENBQXpCO1lBQ0kyVixJQUFJdk4sTUFBTXVOLENBQWQ7WUFBaUJ4UixJQUFJaUUsTUFBTWpFLENBQTNCO1lBQ0k0MkIsUUFBUSxJQUFJOTRCLEtBQUs2TyxFQUFULEdBQWM2RSxDQUExQjtZQUNJcWxCLFdBQVcsQ0FBQy80QixLQUFLNk8sRUFBTixHQUFXLENBQTFCO1lBQ0ltcUIsTUFBTUQsUUFBVjthQUNLLElBQUkvNkIsSUFBSSxDQUFSLEVBQVd3TSxNQUFNa0osQ0FBdEIsRUFBeUIxVixJQUFJd00sR0FBN0IsRUFBa0N4TSxHQUFsQyxFQUF1QztrQkFDN0IrVCxTQUFOLENBQWdCM1QsSUFBaEIsQ0FBcUIsQ0FBQzhELElBQUlsQyxLQUFLMk8sR0FBTCxDQUFTcXFCLEdBQVQsQ0FBTCxFQUFvQjkyQixJQUFJbEMsS0FBSzRPLEdBQUwsQ0FBU29xQixHQUFULENBQXhCLENBQXJCO21CQUNPRixLQUFQOzs7Q0FkWixFQWtCQTs7QUNqREE7Ozs7Ozs7Ozs7Ozs7OztBQWVBLEFBQ0EsQUFDQSxBQUVBLElBQUlHLE9BQU8sVUFBU3IyQixHQUFULEVBQWM7UUFDakJzSixPQUFPLElBQVg7U0FDS3RJLElBQUwsR0FBWSxNQUFaO1NBQ0tveEIsWUFBTCxHQUFvQixRQUFwQjtVQUNNNXpCLE1BQU0yYyxRQUFOLENBQWVuYixHQUFmLENBQU47U0FDSzZiLFFBQUwsR0FBZ0I7a0JBQ0Y3YixJQUFJcEUsT0FBSixDQUFZNDFCLFFBQVosSUFBd0IsSUFEdEI7Z0JBRUp4eEIsSUFBSXBFLE9BQUosQ0FBWTJTLE1BQVosSUFBc0IsQ0FGbEI7Z0JBR0p2TyxJQUFJcEUsT0FBSixDQUFZNlMsTUFBWixJQUFzQixDQUhsQjtjQUlOek8sSUFBSXBFLE9BQUosQ0FBWStTLElBQVosSUFBb0IsQ0FKZDtjQUtOM08sSUFBSXBFLE9BQUosQ0FBWWlULElBQVosSUFBb0IsQ0FMZDtvQkFNQTdPLElBQUlwRSxPQUFKLENBQVk2d0I7S0FONUI7U0FRSzdzQixVQUFMLENBQWdCbEMsV0FBaEIsQ0FBNEJ3TixLQUE1QixDQUFrQyxJQUFsQyxFQUF3QzdNLFNBQXhDO0NBYko7O0FBZ0JBRyxNQUFNdUwsVUFBTixDQUFpQnNzQixJQUFqQixFQUF1QnZLLEtBQXZCLEVBQThCOzs7Ozs7VUFNcEIsVUFBUzVOLEdBQVQsRUFBYzNhLEtBQWQsRUFBcUI7WUFDbkIsQ0FBQ0EsTUFBTWl1QixRQUFQLElBQW1CanVCLE1BQU1pdUIsUUFBTixJQUFrQixPQUF6QyxFQUFrRDs7Z0JBRTFDakksTUFBSixDQUFXbE0sU0FBUzlaLE1BQU1nTCxNQUFmLENBQVgsRUFBbUM4TyxTQUFTOVosTUFBTWtMLE1BQWYsQ0FBbkM7Z0JBQ0lvZSxNQUFKLENBQVd4UCxTQUFTOVosTUFBTW9MLElBQWYsQ0FBWCxFQUFpQzBPLFNBQVM5WixNQUFNc0wsSUFBZixDQUFqQztTQUhKLE1BSU8sSUFBSXRMLE1BQU1pdUIsUUFBTixJQUFrQixRQUFsQixJQUE4Qmp1QixNQUFNaXVCLFFBQU4sSUFBa0IsUUFBcEQsRUFBOEQ7aUJBQzVERyxZQUFMLENBQ0l6VCxHQURKLEVBRUkzYSxNQUFNZ0wsTUFGVixFQUVrQmhMLE1BQU1rTCxNQUZ4QixFQUdJbEwsTUFBTW9MLElBSFYsRUFHZ0JwTCxNQUFNc0wsSUFIdEIsRUFJSXRMLE1BQU1rcEIsVUFKVjs7S0Faa0I7Ozs7OzthQXlCakIsVUFBU2xwQixLQUFULEVBQWdCO1lBQ2pCd0wsWUFBWXhMLE1BQU13TCxTQUFOLElBQW1CLENBQW5DO1lBQ0l4TCxRQUFRQSxRQUFRQSxLQUFSLEdBQWdCLEtBQUszSCxPQUFqQztlQUNPO2VBQ0F3QixLQUFLb1MsR0FBTCxDQUFTak0sTUFBTWdMLE1BQWYsRUFBdUJoTCxNQUFNb0wsSUFBN0IsSUFBcUNJLFNBRHJDO2VBRUEzUixLQUFLb1MsR0FBTCxDQUFTak0sTUFBTWtMLE1BQWYsRUFBdUJsTCxNQUFNc0wsSUFBN0IsSUFBcUNFLFNBRnJDO21CQUdJM1IsS0FBS2lQLEdBQUwsQ0FBUzlJLE1BQU1nTCxNQUFOLEdBQWVoTCxNQUFNb0wsSUFBOUIsSUFBc0NJLFNBSDFDO29CQUlLM1IsS0FBS2lQLEdBQUwsQ0FBUzlJLE1BQU1rTCxNQUFOLEdBQWVsTCxNQUFNc0wsSUFBOUIsSUFBc0NFO1NBSmxEOzs7Q0E1QlIsRUFzQ0E7O0FDekVBOzs7Ozs7Ozs7Ozs7O0FBYUEsQUFDQSxBQUNBLEFBRUEsSUFBSXVuQixPQUFPLFVBQVN0MkIsR0FBVCxFQUFhO1FBQ2hCc0osT0FBTyxJQUFYO1NBQ0t0SSxJQUFMLEdBQVksTUFBWjs7VUFFTXhDLE1BQU0yYyxRQUFOLENBQWdCbmIsR0FBaEIsQ0FBTjtTQUNLNmIsUUFBTCxHQUFnQjtlQUNLN2IsSUFBSXBFLE9BQUosQ0FBWTZILEtBQVosSUFBcUIsQ0FEMUI7Z0JBRUt6RCxJQUFJcEUsT0FBSixDQUFZOEgsTUFBWixJQUFxQixDQUYxQjtnQkFHSzFELElBQUlwRSxPQUFKLENBQVlzcUIsTUFBWixJQUFxQixFQUgxQjtLQUFoQjtTQUtLdG1CLFVBQUwsQ0FBZ0JsQyxXQUFoQixDQUE0QndOLEtBQTVCLENBQWtDLElBQWxDLEVBQXdDN00sU0FBeEM7Q0FWSjs7QUFhQUcsTUFBTXVMLFVBQU4sQ0FBa0J1c0IsSUFBbEIsRUFBeUJ4SyxLQUF6QixFQUFpQzs7Ozs7O3NCQU1YLFVBQVM1TixHQUFULEVBQWMzYSxLQUFkLEVBQXFCOzs7Ozs7WUFNL0IvQyxJQUFJLENBQVI7WUFDSUMsSUFBSSxDQUFSO1lBQ0lnRCxRQUFRLEtBQUs3SCxPQUFMLENBQWE2SCxLQUF6QjtZQUNJQyxTQUFTLEtBQUs5SCxPQUFMLENBQWE4SCxNQUExQjs7WUFFSXBFLElBQUlkLE1BQU0rM0IsY0FBTixDQUFxQmh6QixNQUFNMmlCLE1BQTNCLENBQVI7O1lBRUlxRCxNQUFKLENBQVlsTSxTQUFTN2MsSUFBSWxCLEVBQUUsQ0FBRixDQUFiLENBQVosRUFBZ0MrZCxTQUFTNWMsQ0FBVCxDQUFoQztZQUNJb3NCLE1BQUosQ0FBWXhQLFNBQVM3YyxJQUFJaUQsS0FBSixHQUFZbkUsRUFBRSxDQUFGLENBQXJCLENBQVosRUFBd0MrZCxTQUFTNWMsQ0FBVCxDQUF4QztVQUNFLENBQUYsTUFBUyxDQUFULElBQWN5ZCxJQUFJZ1gsZ0JBQUosQ0FDTjEwQixJQUFJaUQsS0FERSxFQUNLaEQsQ0FETCxFQUNRRCxJQUFJaUQsS0FEWixFQUNtQmhELElBQUluQixFQUFFLENBQUYsQ0FEdkIsQ0FBZDtZQUdJdXRCLE1BQUosQ0FBWXhQLFNBQVM3YyxJQUFJaUQsS0FBYixDQUFaLEVBQWlDNFosU0FBUzVjLElBQUlpRCxNQUFKLEdBQWFwRSxFQUFFLENBQUYsQ0FBdEIsQ0FBakM7VUFDRSxDQUFGLE1BQVMsQ0FBVCxJQUFjNGUsSUFBSWdYLGdCQUFKLENBQ04xMEIsSUFBSWlELEtBREUsRUFDS2hELElBQUlpRCxNQURULEVBQ2lCbEQsSUFBSWlELEtBQUosR0FBWW5FLEVBQUUsQ0FBRixDQUQ3QixFQUNtQ21CLElBQUlpRCxNQUR2QyxDQUFkO1lBR0ltcEIsTUFBSixDQUFZeFAsU0FBUzdjLElBQUlsQixFQUFFLENBQUYsQ0FBYixDQUFaLEVBQWdDK2QsU0FBUzVjLElBQUlpRCxNQUFiLENBQWhDO1VBQ0UsQ0FBRixNQUFTLENBQVQsSUFBY3dhLElBQUlnWCxnQkFBSixDQUNOMTBCLENBRE0sRUFDSEMsSUFBSWlELE1BREQsRUFDU2xELENBRFQsRUFDWUMsSUFBSWlELE1BQUosR0FBYXBFLEVBQUUsQ0FBRixDQUR6QixDQUFkO1lBR0l1dEIsTUFBSixDQUFZeFAsU0FBUzdjLENBQVQsQ0FBWixFQUF5QjZjLFNBQVM1YyxJQUFJbkIsRUFBRSxDQUFGLENBQWIsQ0FBekI7VUFDRSxDQUFGLE1BQVMsQ0FBVCxJQUFjNGUsSUFBSWdYLGdCQUFKLENBQXFCMTBCLENBQXJCLEVBQXdCQyxDQUF4QixFQUEyQkQsSUFBSWxCLEVBQUUsQ0FBRixDQUEvQixFQUFxQ21CLENBQXJDLENBQWQ7S0FqQ3lCOzs7Ozs7VUF3Q3RCLFVBQVN5ZCxHQUFULEVBQWMzYSxLQUFkLEVBQXFCO1lBQ3JCLENBQUNBLE1BQU0rVixNQUFOLENBQWE0TSxNQUFiLENBQW9CL3FCLE1BQXhCLEVBQWdDO2dCQUN6QixDQUFDLENBQUNvSSxNQUFNc04sU0FBWCxFQUFxQjtvQkFDZDJsQixRQUFKLENBQWMsQ0FBZCxFQUFrQixDQUFsQixFQUFxQixLQUFLNTZCLE9BQUwsQ0FBYTZILEtBQWxDLEVBQXdDLEtBQUs3SCxPQUFMLENBQWE4SCxNQUFyRDs7Z0JBRUEsQ0FBQyxDQUFDSCxNQUFNd0wsU0FBWCxFQUFxQjtvQkFDZDBuQixVQUFKLENBQWdCLENBQWhCLEVBQW9CLENBQXBCLEVBQXdCLEtBQUs3NkIsT0FBTCxDQUFhNkgsS0FBckMsRUFBMkMsS0FBSzdILE9BQUwsQ0FBYThILE1BQXhEOztTQUxQLE1BT087aUJBQ0VnekIsZ0JBQUwsQ0FBc0J4WSxHQUF0QixFQUEyQjNhLEtBQTNCOzs7S0FqRHFCOzs7Ozs7YUEwRG5CLFVBQVNBLEtBQVQsRUFBZ0I7WUFDZHdMLFNBQUo7WUFDSXhMLFFBQVFBLFFBQVFBLEtBQVIsR0FBZ0IsS0FBSzNILE9BQWpDO1lBQ0kySCxNQUFNc04sU0FBTixJQUFtQnROLE1BQU0rWixXQUE3QixFQUEwQzt3QkFDMUIvWixNQUFNd0wsU0FBTixJQUFtQixDQUEvQjtTQURKLE1BR0s7d0JBQ1csQ0FBWjs7ZUFFRztlQUNHM1IsS0FBS2t3QixLQUFMLENBQVcsSUFBSXZlLFlBQVksQ0FBM0IsQ0FESDtlQUVHM1IsS0FBS2t3QixLQUFMLENBQVcsSUFBSXZlLFlBQVksQ0FBM0IsQ0FGSDttQkFHTyxLQUFLblQsT0FBTCxDQUFhNkgsS0FBYixHQUFxQnNMLFNBSDVCO29CQUlRLEtBQUtuVCxPQUFMLENBQWE4SCxNQUFiLEdBQXNCcUw7U0FKckM7OztDQW5FWixFQTRFQTs7QUMxR0E7Ozs7Ozs7Ozs7Ozs7OztBQWVBLEFBQ0EsQUFDQSxBQUNBLEFBRUEsSUFBSTRuQixTQUFTLFVBQVMzMkIsR0FBVCxFQUFhO1FBQ2xCc0osT0FBUSxJQUFaO1NBQ0t0SSxJQUFMLEdBQVksUUFBWjtTQUNLZ1AsUUFBTCxHQUFpQixFQUFqQjtTQUNLNG1CLE1BQUwsR0FBaUIsS0FBakIsQ0FKc0I7O1VBTWhCcDRCLE1BQU0yYyxRQUFOLENBQWdCbmIsR0FBaEIsQ0FBTjtTQUNLNmIsUUFBTCxHQUFpQjttQkFDQSxFQURBO1lBRUE3YixJQUFJcEUsT0FBSixDQUFZNlQsRUFBWixJQUEwQixDQUYxQjtXQUdBelAsSUFBSXBFLE9BQUosQ0FBWTBELENBQVosSUFBMEIsQ0FIMUI7b0JBSUFVLElBQUlwRSxPQUFKLENBQVk4VCxVQUFaLElBQTBCLENBSjFCO2tCQUtBMVAsSUFBSXBFLE9BQUosQ0FBWWdVLFFBQVosSUFBMEIsQ0FMMUI7bUJBTUE1UCxJQUFJcEUsT0FBSixDQUFZbVUsU0FBWixJQUEwQixLQU4xQjtLQUFqQjtXQVFPblEsVUFBUCxDQUFrQmxDLFdBQWxCLENBQThCd04sS0FBOUIsQ0FBb0MsSUFBcEMsRUFBMkM3TSxTQUEzQztDQWZKOztBQWtCQUcsTUFBTXVMLFVBQU4sQ0FBaUI0c0IsTUFBakIsRUFBMEI3SyxLQUExQixFQUFrQztVQUN2QixVQUFTNU4sR0FBVCxFQUFjdGlCLE9BQWQsRUFBdUI7O1lBRXRCNlQsS0FBSyxPQUFPN1QsUUFBUTZULEVBQWYsSUFBcUIsV0FBckIsR0FBbUMsQ0FBbkMsR0FBdUM3VCxRQUFRNlQsRUFBeEQ7WUFDSW5RLElBQUsxRCxRQUFRMEQsQ0FBakIsQ0FIMEI7WUFJdEJvUSxhQUFhQyxPQUFPbEMsV0FBUCxDQUFtQjdSLFFBQVE4VCxVQUEzQixDQUFqQixDQUowQjtZQUt0QkUsV0FBYUQsT0FBT2xDLFdBQVAsQ0FBbUI3UixRQUFRZ1UsUUFBM0IsQ0FBakIsQ0FMMEI7Ozs7O1lBVXRCRixjQUFjRSxRQUFkLElBQTBCaFUsUUFBUThULFVBQVIsSUFBc0I5VCxRQUFRZ1UsUUFBNUQsRUFBdUU7O2lCQUU5RGduQixNQUFMLEdBQWtCLElBQWxCO3lCQUNhLENBQWI7dUJBQ2EsR0FBYjs7O3FCQUdTam5CLE9BQU9wQyxjQUFQLENBQXNCbUMsVUFBdEIsQ0FBYjttQkFDYUMsT0FBT3BDLGNBQVAsQ0FBc0JxQyxRQUF0QixDQUFiOzs7WUFHSUEsV0FBV0YsVUFBWCxHQUF3QixLQUE1QixFQUFtQzswQkFDakIsS0FBZDs7O1lBR0E2YSxHQUFKLENBQVMsQ0FBVCxFQUFhLENBQWIsRUFBaUJqckIsQ0FBakIsRUFBb0JvUSxVQUFwQixFQUFnQ0UsUUFBaEMsRUFBMEMsS0FBS2hVLE9BQUwsQ0FBYW1VLFNBQXZEO1lBQ0lOLE9BQU8sQ0FBWCxFQUFjO2dCQUNOLEtBQUttbkIsTUFBVCxFQUFpQjs7O29CQUdUck4sTUFBSixDQUFZOVosRUFBWixFQUFpQixDQUFqQjtvQkFDSThhLEdBQUosQ0FBUyxDQUFULEVBQWEsQ0FBYixFQUFpQjlhLEVBQWpCLEVBQXNCQyxVQUF0QixFQUFtQ0UsUUFBbkMsRUFBOEMsQ0FBQyxLQUFLaFUsT0FBTCxDQUFhbVUsU0FBNUQ7YUFKSixNQUtPO29CQUNDd2EsR0FBSixDQUFTLENBQVQsRUFBYSxDQUFiLEVBQWlCOWEsRUFBakIsRUFBc0JHLFFBQXRCLEVBQWlDRixVQUFqQyxFQUE4QyxDQUFDLEtBQUs5VCxPQUFMLENBQWFtVSxTQUE1RDs7U0FQUixNQVNPOzs7Z0JBR0M4YyxNQUFKLENBQVcsQ0FBWCxFQUFhLENBQWI7O0tBdkNzQjtpQkEwQ2YsWUFBVTthQUNmL2MsS0FBTCxHQUFrQixJQUFsQixDQURvQjtZQUVoQnZFLElBQWMsS0FBSzNQLE9BQXZCO1lBQ0k4VCxhQUFhQyxPQUFPbEMsV0FBUCxDQUFtQmxDLEVBQUVtRSxVQUFyQixDQUFqQixDQUhvQjtZQUloQkUsV0FBYUQsT0FBT2xDLFdBQVAsQ0FBbUJsQyxFQUFFcUUsUUFBckIsQ0FBakIsQ0FKb0I7O1lBTWJGLGFBQWFFLFFBQWIsSUFBeUIsQ0FBQ3JFLEVBQUV3RSxTQUE5QixJQUErQ0wsYUFBYUUsUUFBYixJQUF5QnJFLEVBQUV3RSxTQUEvRSxFQUE2RjtpQkFDcEZELEtBQUwsR0FBYyxLQUFkLENBRHlGOzs7YUFJeEZFLFFBQUwsR0FBa0IsQ0FDZDVTLEtBQUtvUyxHQUFMLENBQVVFLFVBQVYsRUFBdUJFLFFBQXZCLENBRGMsRUFFZHhTLEtBQUtDLEdBQUwsQ0FBVXFTLFVBQVYsRUFBdUJFLFFBQXZCLENBRmMsQ0FBbEI7S0FwRHlCO2FBeURuQixVQUFTaFUsT0FBVCxFQUFpQjtZQUNuQkEsVUFBVUEsVUFBVUEsT0FBVixHQUFvQixLQUFLQSxPQUF2QztZQUNJNlQsS0FBSyxPQUFPN1QsUUFBUTZULEVBQWYsSUFBcUIsV0FBckI7VUFDSCxDQURHLEdBQ0M3VCxRQUFRNlQsRUFEbEI7WUFFSW5RLElBQUkxRCxRQUFRMEQsQ0FBaEIsQ0FKdUI7O2FBTWxCdTNCLFdBQUw7O1lBRUlubkIsYUFBYUMsT0FBT2xDLFdBQVAsQ0FBbUI3UixRQUFROFQsVUFBM0IsQ0FBakIsQ0FSdUI7WUFTbkJFLFdBQWFELE9BQU9sQyxXQUFQLENBQW1CN1IsUUFBUWdVLFFBQTNCLENBQWpCLENBVHVCOzs7Ozs7Ozs7O1lBbUJuQlQsWUFBYSxFQUFqQjs7WUFFSTJuQixjQUFhO2tCQUNOLENBQUUsQ0FBRixFQUFNeDNCLENBQU4sQ0FETTttQkFFTixDQUFFLENBQUNBLENBQUgsRUFBTSxDQUFOLENBRk07bUJBR04sQ0FBRSxDQUFGLEVBQU0sQ0FBQ0EsQ0FBUCxDQUhNO21CQUlOLENBQUVBLENBQUYsRUFBTSxDQUFOO1NBSlg7O2FBT00sSUFBSWtNLENBQVYsSUFBZXNyQixXQUFmLEVBQTRCO2dCQUNwQjdtQixhQUFhb04sU0FBUzdSLENBQVQsSUFBYyxLQUFLd0UsUUFBTCxDQUFjLENBQWQsQ0FBZCxJQUFrQ3FOLFNBQVM3UixDQUFULElBQWMsS0FBS3dFLFFBQUwsQ0FBYyxDQUFkLENBQWpFO2dCQUNJLEtBQUs0bUIsTUFBTCxJQUFnQjNtQixjQUFjLEtBQUtILEtBQW5DLElBQThDLENBQUNHLFVBQUQsSUFBZSxDQUFDLEtBQUtILEtBQXZFLEVBQStFOzBCQUNqRXRVLElBQVYsQ0FBZ0JzN0IsWUFBYXRyQixDQUFiLENBQWhCOzs7O1lBSUosQ0FBQyxLQUFLb3JCLE1BQVYsRUFBbUI7eUJBQ0ZqbkIsT0FBT3BDLGNBQVAsQ0FBdUJtQyxVQUF2QixDQUFiO3VCQUNhQyxPQUFPcEMsY0FBUCxDQUF1QnFDLFFBQXZCLENBQWI7O3NCQUVVcFUsSUFBVixDQUFlLENBQ1BtVSxPQUFPNUQsR0FBUCxDQUFXMkQsVUFBWCxJQUF5QkQsRUFEbEIsRUFDdUJFLE9BQU8zRCxHQUFQLENBQVcwRCxVQUFYLElBQXlCRCxFQURoRCxDQUFmOztzQkFJVWpVLElBQVYsQ0FBZSxDQUNQbVUsT0FBTzVELEdBQVAsQ0FBVzJELFVBQVgsSUFBeUJwUSxDQURsQixFQUN1QnFRLE9BQU8zRCxHQUFQLENBQVcwRCxVQUFYLElBQXlCcFEsQ0FEaEQsQ0FBZjs7c0JBSVU5RCxJQUFWLENBQWUsQ0FDUG1VLE9BQU81RCxHQUFQLENBQVc2RCxRQUFYLElBQXlCdFEsQ0FEbEIsRUFDd0JxUSxPQUFPM0QsR0FBUCxDQUFXNEQsUUFBWCxJQUF3QnRRLENBRGhELENBQWY7O3NCQUlVOUQsSUFBVixDQUFlLENBQ1BtVSxPQUFPNUQsR0FBUCxDQUFXNkQsUUFBWCxJQUF5QkgsRUFEbEIsRUFDd0JFLE9BQU8zRCxHQUFQLENBQVc0RCxRQUFYLElBQXdCSCxFQURoRCxDQUFmOzs7Z0JBS0lOLFNBQVIsR0FBb0JBLFNBQXBCO2VBQ08sS0FBS3lpQixvQkFBTCxDQUEyQmgyQixPQUEzQixDQUFQOzs7Q0FsSFQsRUF1SEE7O0FDakpBO0FBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBQ0EsQUFFQSxJQUFJbTdCLFNBQVM7U0FDSmpXO0NBRFQ7O0FBSUFpVyxPQUFPQyxPQUFQLEdBQWlCO21CQUNHOWIsYUFESDs0QkFFWXlELHNCQUZaO1dBR0phLEtBSEk7WUFJSmlELE1BSkk7V0FLSnFKLEtBTEk7V0FNSnZyQixLQU5JO1VBT0pndEI7Q0FQYjs7QUFVQXdKLE9BQU9FLE1BQVAsR0FBZ0I7Z0JBQ0NqRyxVQUREO1lBRUgvSyxRQUZHO2FBR0YwUCxPQUhFO2FBSUZ2UCxTQUpFO1lBS0g0UCxNQUxHO1VBTUxLLElBTks7VUFPTGxFLElBUEs7YUFRRjNMLFNBUkU7VUFTTDhQLElBVEs7WUFVSEs7Q0FWYjs7QUFhQUksT0FBT0csS0FBUCxHQUFlO3FCQUNPcHRCLGVBRFA7a0JBRU9aO0NBRnRCLENBS0E7Ozs7In0=
