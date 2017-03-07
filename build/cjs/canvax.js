'use strict';

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

module.exports = Canvax;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmF4LmpzIiwic291cmNlcyI6WyIuLi8uLi9jYW52YXgvdXRpbHMvdW5kZXJzY29yZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9pbmRleC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1BvaW50LmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0NhbnZheEV2ZW50LmpzIiwiLi4vLi4vY2FudmF4L3NldHRpbmdzLmpzIiwiLi4vLi4vY2FudmF4L3V0aWxzL2RvbS5qcyIsIi4uLy4uL2NhbnZheC9ldmVudC9FdmVudEhhbmRsZXIuanMiLCIuLi8uLi9jYW52YXgvZXZlbnQvRXZlbnRNYW5hZ2VyLmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdGguanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9IaXRUZXN0UG9pbnQuanMiLCIuLi8uLi9jYW52YXgvYW5pbWF0aW9uL1R3ZWVuLmpzIiwiLi4vLi4vY2FudmF4L2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9vYnNlcnZlLmpzIiwiLi4vLi4vY2FudmF4L2NvbnN0LmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvRGlzcGxheU9iamVjdC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXIuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9TdGFnZS5qcyIsIi4uLy4uL2NhbnZheC9yZW5kZXJlcnMvU3lzdGVtUmVuZGVyZXIuanMiLCIuLi8uLi9jYW52YXgvcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlci5qcyIsIi4uLy4uL2NhbnZheC9BcHBsaWNhdGlvbi5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uLy4uL2NhbnZheC9ncmFwaGljcy9HcmFwaGljc0RhdGEuanMiLCIuLi8uLi9jYW52YXgvbWF0aC9Qb2ludC5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL0dyb3VwRDguanMiLCIuLi8uLi9jYW52YXgvbWF0aC9zaGFwZXMvUmVjdGFuZ2xlLmpzIiwiLi4vLi4vY2FudmF4L21hdGgvc2hhcGVzL0NpcmNsZS5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL3NoYXBlcy9FbGxpcHNlLmpzIiwiLi4vLi4vY2FudmF4L21hdGgvc2hhcGVzL1BvbHlnb24uanMiLCIuLi8uLi9jYW52YXgvbWF0aC9zaGFwZXMvUm91bmRlZFJlY3RhbmdsZS5qcyIsIi4uLy4uL2NhbnZheC9tYXRoL2luZGV4LmpzIiwiLi4vLi4vY2FudmF4L2dyYXBoaWNzL3V0aWxzL2JlemllckN1cnZlVG8uanMiLCIuLi8uLi9jYW52YXgvZ3JhcGhpY3MvR3JhcGhpY3MuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9TaGFwZS5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1RleHQuanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9WZWN0b3IuanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9TbW9vdGhTcGxpbmUuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvQnJva2VuTGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9DaXJjbGUuanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9iZXppZXIuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvUGF0aC5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Ecm9wbGV0LmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0VsbGlwc2UuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvUG9seWdvbi5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Jc29nb24uanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvTGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9SZWN0LmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL1NlY3Rvci5qcyIsIi4uLy4uL2NhbnZheC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgXyA9IHt9XG52YXIgYnJlYWtlciA9IHt9O1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyXG50b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG5oYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbnZhclxubmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxubmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG5uYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG5uYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxubmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXM7XG5cbl8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG5fLmtleXMgPSBuYXRpdmVLZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqICE9PSBPYmplY3Qob2JqKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvYmplY3QnKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIGtleXM7XG59O1xuXG5fLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn07XG5cbnZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgfVxuICB9XG59O1xuXG5fLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xufTtcblxuXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgfTtcbn0pO1xuXG5pZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICB9O1xufTtcblxuXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbn07XG5cbl8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbn07XG5cbl8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxuXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbn07XG5cbl8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xufTtcblxuXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbl8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5fLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIGlmIChpc1NvcnRlZCkge1xuICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgfVxuICB9XG4gIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG59O1xuXG5fLmlzV2luZG93ID0gZnVuY3Rpb24oIG9iaiApIHsgXG4gICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09IG9iai53aW5kb3c7XG59O1xuXy5pc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24oIG9iaiApIHtcbiAgICAvLyBCZWNhdXNlIG9mIElFLCB3ZSBhbHNvIGhhdmUgdG8gY2hlY2sgdGhlIHByZXNlbmNlIG9mIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eS5cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBET00gbm9kZXMgYW5kIHdpbmRvdyBvYmplY3RzIGRvbid0IHBhc3MgdGhyb3VnaCwgYXMgd2VsbFxuICAgIGlmICggIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iai5ub2RlVHlwZSB8fCBfLmlzV2luZG93KCBvYmogKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gICAgICAgIGlmICggb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgXCJpc1Byb3RvdHlwZU9mXCIpICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIC8vIElFOCw5IFdpbGwgdGhyb3cgZXhjZXB0aW9ucyBvbiBjZXJ0YWluIGhvc3Qgb2JqZWN0cyAjOTg5N1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAgIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICAgIHZhciBrZXk7XG4gICAgZm9yICgga2V5IGluIG9iaiApIHt9XG5cbiAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwoIG9iaiwga2V5ICk7XG59O1xuXG4vKipcbipcbirlpoLmnpzmmK/mt7HluqZleHRlbmTvvIznrKzkuIDkuKrlj4LmlbDlsLHorr7nva7kuLp0cnVlXG4qL1xuXy5leHRlbmQgPSBmdW5jdGlvbigpIHsgIFxuICB2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsICBcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSwgIFxuICAgICAgaSA9IDEsICBcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsICBcbiAgICAgIGRlZXAgPSBmYWxzZTsgIFxuICBpZiAoIHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiICkgeyAgXG4gICAgICBkZWVwID0gdGFyZ2V0OyAgXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307ICBcbiAgICAgIGkgPSAyOyAgXG4gIH07ICBcbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICFfLmlzRnVuY3Rpb24odGFyZ2V0KSApIHsgIFxuICAgICAgdGFyZ2V0ID0ge307ICBcbiAgfTsgIFxuICBpZiAoIGxlbmd0aCA9PT0gaSApIHsgIFxuICAgICAgdGFyZ2V0ID0gdGhpczsgIFxuICAgICAgLS1pOyAgXG4gIH07ICBcbiAgZm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7ICBcbiAgICAgIGlmICggKG9wdGlvbnMgPSBhcmd1bWVudHNbIGkgXSkgIT0gbnVsbCApIHsgIFxuICAgICAgICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucyApIHsgIFxuICAgICAgICAgICAgICBzcmMgPSB0YXJnZXRbIG5hbWUgXTsgIFxuICAgICAgICAgICAgICBjb3B5ID0gb3B0aW9uc1sgbmFtZSBdOyAgXG4gICAgICAgICAgICAgIGlmICggdGFyZ2V0ID09PSBjb3B5ICkgeyAgXG4gICAgICAgICAgICAgICAgICBjb250aW51ZTsgIFxuICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgaWYgKCBkZWVwICYmIGNvcHkgJiYgKCBfLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gXy5pc0FycmF5KGNvcHkpKSApICkgeyAgXG4gICAgICAgICAgICAgICAgICBpZiAoIGNvcHlJc0FycmF5ICkgeyAgXG4gICAgICAgICAgICAgICAgICAgICAgY29weUlzQXJyYXkgPSBmYWxzZTsgIFxuICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIF8uaXNBcnJheShzcmMpID8gc3JjIDogW107ICBcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBfLmlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9OyAgXG4gICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gXy5leHRlbmQoIGRlZXAsIGNsb25lLCBjb3B5ICk7ICBcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkgeyAgXG4gICAgICAgICAgICAgICAgICB0YXJnZXRbIG5hbWUgXSA9IGNvcHk7ICBcbiAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgfSAgXG4gICAgICB9ICBcbiAgfSAgXG4gIHJldHVybiB0YXJnZXQ7ICBcbn07IFxuXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh0cnVlLCB7fSwgb2JqKTtcbn07XG5leHBvcnQgZGVmYXVsdCBfOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tIFxuKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbnZhciBVdGlscyA9IHtcbiAgICBtYWluRnJhbWVSYXRlICAgOiA2MCwvL+m7mOiupOS4u+W4p+eOh1xuICAgIG5vdyA6IDAsXG4gICAgLyrlg4/ntKDmo4DmtYvkuJPnlKgqL1xuICAgIF9waXhlbEN0eCAgIDogbnVsbCxcbiAgICBfX2VtcHR5RnVuYyA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL3JldGluYSDlsY/luZXkvJjljJZcbiAgICBfZGV2aWNlUGl4ZWxSYXRpbyA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgX1VJRCAgOiAwLCAvL+ivpeWAvOS4uuWQkeS4iueahOiHquWinumVv+aVtOaVsOWAvFxuICAgIGdldFVJRDpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fVUlEKys7XG4gICAgfSxcbiAgICBjcmVhdGVJZCA6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgLy9pZiBlbmQgd2l0aCBhIGRpZ2l0LCB0aGVuIGFwcGVuZCBhbiB1bmRlcnNCYXNlIGJlZm9yZSBhcHBlbmRpbmdcbiAgICAgICAgdmFyIGNoYXJDb2RlID0gbmFtZS5jaGFyQ29kZUF0KG5hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmIChjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1NykgbmFtZSArPSBcIl9cIjtcbiAgICAgICAgcmV0dXJuIG5hbWUgKyBVdGlscy5nZXRVSUQoKTtcbiAgICB9LFxuICAgIGNhbnZhc1N1cHBvcnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dDtcbiAgICB9LFxuICAgIGNyZWF0ZU9iamVjdCA6IGZ1bmN0aW9uKCBwcm90byAsIGNvbnN0cnVjdG9yICkge1xuICAgICAgICB2YXIgbmV3UHJvdG87XG4gICAgICAgIHZhciBPYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuICAgICAgICBpZiAoT2JqZWN0Q3JlYXRlKSB7XG4gICAgICAgICAgICBuZXdQcm90byA9IE9iamVjdENyZWF0ZShwcm90byk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBVdGlscy5fX2VtcHR5RnVuYy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgICAgICAgIG5ld1Byb3RvID0gbmV3IFV0aWxzLl9fZW1wdHlGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3UHJvdG8uY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ld1Byb3RvO1xuICAgIH0sXG4gICAgY3JlYXRDbGFzcyA6IGZ1bmN0aW9uKHIsIHMsIHB4KXtcbiAgICAgICAgaWYgKCFzIHx8ICFyKSB7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3AgPSBzLnByb3RvdHlwZSwgcnA7XG4gICAgICAgIC8vIGFkZCBwcm90b3R5cGUgY2hhaW5cbiAgICAgICAgcnAgPSBVdGlscy5jcmVhdGVPYmplY3Qoc3AsIHIpO1xuICAgICAgICByLnByb3RvdHlwZSA9IF8uZXh0ZW5kKHJwLCByLnByb3RvdHlwZSk7XG4gICAgICAgIHIuc3VwZXJjbGFzcyA9IFV0aWxzLmNyZWF0ZU9iamVjdChzcCwgcyk7XG4gICAgICAgIC8vIGFkZCBwcm90b3R5cGUgb3ZlcnJpZGVzXG4gICAgICAgIGlmIChweCkge1xuICAgICAgICAgICAgXy5leHRlbmQocnAsIHB4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9LFxuICAgIGluaXRFbGVtZW50IDogZnVuY3Rpb24oIGNhbnZhcyApe1xuICAgICAgICBpZiggd2luZG93LkZsYXNoQ2FudmFzICYmIEZsYXNoQ2FudmFzLmluaXRFbGVtZW50KXtcbiAgICAgICAgICAgIEZsYXNoQ2FudmFzLmluaXRFbGVtZW50KCBjYW52YXMgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lgZrkuIDmrKHnroDljZXnmoRvcHTlj4LmlbDmoKHpqozvvIzkv53or4HlnKjnlKjmiLfkuI3kvKBvcHTnmoTml7blgJkg5oiW6ICF5Lyg5LqGb3B05L2G5piv6YeM6Z2i5rKh5pyJY29udGV4dOeahOaXtuWAmeaKpemUmVxuICAgIGNoZWNrT3B0ICAgIDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgaWYoICFvcHQgKXtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGV4dCA6IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gICBcbiAgICAgICAgfSBlbHNlIGlmKCBvcHQgJiYgIW9wdC5jb250ZXh0ICkge1xuICAgICAgICAgIG9wdC5jb250ZXh0ID0ge31cbiAgICAgICAgICByZXR1cm4gb3B0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvcHQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOeugOWNleeahOa1heWkjeWItuWvueixoeOAglxuICAgICAqIEBwYXJhbSBzdHJpY3QgIOW9k+S4unRydWXml7blj6ropobnm5blt7LmnInlsZ7mgKdcbiAgICAgKi9cbiAgICBjb3B5MmNvbnRleHQgOiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSwgc3RyaWN0KXsgXG4gICAgICAgIGlmICggXy5pc0VtcHR5KHNvdXJjZSkgKXtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBrZXkgaW4gc291cmNlKXtcbiAgICAgICAgICAgIGlmKCFzdHJpY3QgfHwgdGFyZ2V0Lmhhc093blByb3BlcnR5KGtleSkgfHwgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0sXG5cbiAgICBcbiAgICAvKipcbiAgICAgKiDmjInnhadjc3PnmoTpobrluo/vvIzov5Tlm57kuIDkuKpb5LiKLOWPsyzkuIss5bemXVxuICAgICAqL1xuICAgIGdldENzc09yZGVyQXJyIDogZnVuY3Rpb24oIHIgKXtcbiAgICAgICAgdmFyIHIxOyBcbiAgICAgICAgdmFyIHIyOyBcbiAgICAgICAgdmFyIHIzOyBcbiAgICAgICAgdmFyIHI0O1xuXG4gICAgICAgIGlmKHR5cGVvZiByID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSByO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYociBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBpZiAoci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IHJbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByMyA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByNCA9IHJbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gcjQgPSByWzFdO1xuICAgICAgICAgICAgICAgIHIzID0gclsyXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gclsxXTtcbiAgICAgICAgICAgICAgICByMyA9IHJbMl07XG4gICAgICAgICAgICAgICAgcjQgPSByWzNdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcjEscjIscjMscjRdO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxzOyIsIi8qKlxuICogUG9pbnRcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50XG57XG4gICAgY29uc3RydWN0b3IoIHg9MCAsIHk9MCApXG4gICAge1xuICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aD09MSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09ICdvYmplY3QnICl7XG4gICAgICAgICAgICB2YXIgYXJnPWFyZ3VtZW50c1swXVxuICAgICAgICAgICAgaWYoIFwieFwiIGluIGFyZyAmJiBcInlcIiBpbiBhcmcgKXtcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmcueCoxO1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZy55KjE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpPTA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBhcmcpe1xuICAgICAgICAgICAgICAgICAgICBpZihpPT0wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ1twXSoxO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gYXJnW3BdKjE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0geCoxO1xuICAgICAgICAgICAgdGhpcy55ID0geSoxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9BcnJheSgpXG4gICAge1xuICAgICAgICByZXR1cm4gW3RoaXMueCAsIHRoaXMueV0gIFxuICAgIH1cbn07XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIGNhbnZhcyDkuIrlp5TmiZjnmoTkuovku7bnrqHnkIZcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIENhbnZheEV2ZW50ID0gZnVuY3Rpb24oIGV2dCAsIHBhcmFtcyApIHtcblx0XG5cdHZhciBldmVudFR5cGUgPSBcIkNhbnZheEV2ZW50XCI7IFxuICAgIGlmKCBfLmlzU3RyaW5nKCBldnQgKSApe1xuICAgIFx0ZXZlbnRUeXBlID0gZXZ0O1xuICAgIH07XG4gICAgaWYoIF8uaXNPYmplY3QoIGV2dCApICYmIGV2dC50eXBlICl7XG4gICAgXHRldmVudFR5cGUgPSBldnQudHlwZTtcbiAgICB9O1xuXG4gICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XHRcbiAgICB0aGlzLnR5cGUgICA9IGV2ZW50VHlwZTtcbiAgICB0aGlzLnBvaW50ICA9IG51bGw7XG5cbiAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb24gPSBmYWxzZSA7IC8v6buY6K6k5LiN6Zi75q2i5LqL5Lu25YaS5rOhXG59XG5DYW52YXhFdmVudC5wcm90b3R5cGUgPSB7XG4gICAgc3RvcFByb3BhZ2F0aW9uIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ2FudmF4RXZlbnQ7IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIC8v6K6+5aSH5YiG6L6o546HXG4gICAgUkVTT0xVVElPTjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcblxuICAgIC8v5riy5p+TRlBTXG4gICAgRlBTOiA2MFxufTtcbiIsImltcG9ydCBfIGZyb20gXCIuL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBzZXR0aW5ncyBmcm9tIFwiLi4vc2V0dGluZ3NcIlxuXG52YXIgYWRkT3JSbW92ZUV2ZW50SGFuZCA9IGZ1bmN0aW9uKCBkb21IYW5kICwgaWVIYW5kICl7XG4gICAgaWYoIGRvY3VtZW50WyBkb21IYW5kIF0gKXtcbiAgICAgICAgZnVuY3Rpb24gZXZlbnREb21GbiggZWwgLCB0eXBlICwgZm4gKXtcbiAgICAgICAgICAgIGlmKCBlbC5sZW5ndGggKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MCA7IGkgPCBlbC5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBldmVudERvbUZuKCBlbFtpXSAsIHR5cGUgLCBmbiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxbIGRvbUhhbmQgXSggdHlwZSAsIGZuICwgZmFsc2UgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGV2ZW50RG9tRm5cbiAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jdGlvbiBldmVudEZuKCBlbCAsIHR5cGUgLCBmbiApe1xuICAgICAgICAgICAgaWYoIGVsLmxlbmd0aCApe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wIDsgaSA8IGVsLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Rm4oIGVsW2ldLHR5cGUsZm4gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsWyBpZUhhbmQgXSggXCJvblwiK3R5cGUgLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCggZWwgLCB3aW5kb3cuZXZlbnQgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGV2ZW50Rm5cbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gZG9t5pON5L2c55u45YWz5Luj56CBXG4gICAgcXVlcnkgOiBmdW5jdGlvbihlbCl7XG4gICAgICAgIGlmKF8uaXNTdHJpbmcoZWwpKXtcbiAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsKVxuICAgICAgICB9XG4gICAgICAgIGlmKGVsLm5vZGVUeXBlID09IDEpe1xuICAgICAgICAgICAvL+WImeS4uuS4gOS4qmVsZW1lbnTmnKzouqtcbiAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH1cbiAgICAgICAgaWYoZWwubGVuZ3RoKXtcbiAgICAgICAgICAgcmV0dXJuIGVsWzBdXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBvZmZzZXQgOiBmdW5jdGlvbihlbCl7XG4gICAgICAgIHZhciBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgXG4gICAgICAgIGRvYyA9IGVsLm93bmVyRG9jdW1lbnQsIFxuICAgICAgICBib2R5ID0gZG9jLmJvZHksIFxuICAgICAgICBkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudCwgXG5cbiAgICAgICAgLy8gZm9yIGllICBcbiAgICAgICAgY2xpZW50VG9wID0gZG9jRWxlbS5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMCwgXG4gICAgICAgIGNsaWVudExlZnQgPSBkb2NFbGVtLmNsaWVudExlZnQgfHwgYm9keS5jbGllbnRMZWZ0IHx8IDAsIFxuXG4gICAgICAgIC8vIEluIEludGVybmV0IEV4cGxvcmVyIDcgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IHByb3BlcnR5IGlzIHRyZWF0ZWQgYXMgcGh5c2ljYWwsIFxuICAgICAgICAvLyB3aGlsZSBvdGhlcnMgYXJlIGxvZ2ljYWwuIE1ha2UgYWxsIGxvZ2ljYWwsIGxpa2UgaW4gSUU4LiBcbiAgICAgICAgem9vbSA9IDE7IFxuICAgICAgICBpZiAoYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHsgXG4gICAgICAgICAgICB2YXIgYm91bmQgPSBib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyBcbiAgICAgICAgICAgIHpvb20gPSAoYm91bmQucmlnaHQgLSBib3VuZC5sZWZ0KS9ib2R5LmNsaWVudFdpZHRoOyBcbiAgICAgICAgfSBcbiAgICAgICAgaWYgKHpvb20gPiAxKXsgXG4gICAgICAgICAgICBjbGllbnRUb3AgPSAwOyBcbiAgICAgICAgICAgIGNsaWVudExlZnQgPSAwOyBcbiAgICAgICAgfSBcbiAgICAgICAgdmFyIHRvcCA9IGJveC50b3Avem9vbSArICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jRWxlbSAmJiBkb2NFbGVtLnNjcm9sbFRvcC96b29tIHx8IGJvZHkuc2Nyb2xsVG9wL3pvb20pIC0gY2xpZW50VG9wLCBcbiAgICAgICAgICAgIGxlZnQgPSBib3gubGVmdC96b29tICsgKHdpbmRvdy5wYWdlWE9mZnNldHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5zY3JvbGxMZWZ0L3pvb20gfHwgYm9keS5zY3JvbGxMZWZ0L3pvb20pIC0gY2xpZW50TGVmdDsgXG5cbiAgICAgICAgcmV0dXJuIHsgXG4gICAgICAgICAgICB0b3A6IHRvcCwgXG4gICAgICAgICAgICBsZWZ0OiBsZWZ0IFxuICAgICAgICB9OyBcbiAgICB9LFxuICAgIGFkZEV2ZW50IDogYWRkT3JSbW92ZUV2ZW50SGFuZCggXCJhZGRFdmVudExpc3RlbmVyXCIgLCBcImF0dGFjaEV2ZW50XCIgKSxcbiAgICByZW1vdmVFdmVudCA6IGFkZE9yUm1vdmVFdmVudEhhbmQoIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiICwgXCJkZXRhY2hFdmVudFwiICksXG4gICAgcGFnZVg6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGFnZVgpIHJldHVybiBlLnBhZ2VYO1xuICAgICAgICBlbHNlIGlmIChlLmNsaWVudFgpXG4gICAgICAgICAgICByZXR1cm4gZS5jbGllbnRYICsgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0ID9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgOiBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpO1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcGFnZVk6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGFnZVkpIHJldHVybiBlLnBhZ2VZO1xuICAgICAgICBlbHNlIGlmIChlLmNsaWVudFkpXG4gICAgICAgICAgICByZXR1cm4gZS5jbGllbnRZICsgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgP1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIDogZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApO1xuICAgICAgICBlbHNlIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yib5bu6ZG9tXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIGRvbSBpZCDlvoXnlKhcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSA6IGRvbSB0eXBl77yMIHN1Y2ggYXMgY2FudmFzLCBkaXYgZXRjLlxuICAgICAqL1xuICAgIGNyZWF0ZUNhbnZhcyA6IGZ1bmN0aW9uKCBfd2lkdGggLCBfaGVpZ2h0ICwgaWQpIHtcbiAgICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCAgPSBfd2lkdGggKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gX2hlaWdodCArICdweCc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5sZWZ0ICAgPSAwO1xuICAgICAgICBjYW52YXMuc3R5bGUudG9wICAgID0gMDtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBfd2lkdGggKiBzZXR0aW5ncy5SRVNPTFVUSU9OKTtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgX2hlaWdodCAqIHNldHRpbmdzLlJFU09MVVRJT04pO1xuICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcbiAgICB9LFxuICAgIGNyZWF0ZVZpZXc6IGZ1bmN0aW9uKF93aWR0aCAsIF9oZWlnaHQsIGlkKXtcbiAgICAgICAgdmFyIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2aWV3LmNsYXNzTmFtZSA9IFwiY2FudmF4LXZpZXdcIjtcbiAgICAgICAgdmlldy5zdHlsZS5jc3NUZXh0ICs9IFwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6XCIgKyBfd2lkdGggKyBcInB4O2hlaWdodDpcIiArIF9oZWlnaHQgK1wicHg7XCJcblxuICAgICAgICB2YXIgc3RhZ2VfYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOmFic29sdXRlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgLy/nlKjmnaXlrZjmlL7kuIDkuptkb23lhYPntKBcbiAgICAgICAgdmFyIGRvbV9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5zdHlsZS5jc3NUZXh0ICs9IFwicG9zaXRpb246YWJzb2x1dGU7d2lkdGg6XCIgKyBfd2lkdGggKyBcInB4O2hlaWdodDpcIiArIF9oZWlnaHQgK1wicHg7XCJcblxuICAgICAgICB2aWV3LmFwcGVuZENoaWxkKHN0YWdlX2MpO1xuICAgICAgICB2aWV3LmFwcGVuZENoaWxkKGRvbV9jKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2aWV3IDogdmlldyxcbiAgICAgICAgICAgIHN0YWdlX2M6IHN0YWdlX2MsXG4gICAgICAgICAgICBkb21fYzogZG9tX2NcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL2RvbeebuOWFs+S7o+eggee7k+adn1xufTsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKi9cbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vZGlzcGxheS9Qb2ludFwiO1xuaW1wb3J0IENhbnZheEV2ZW50IGZyb20gXCIuL0NhbnZheEV2ZW50XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0ICQgZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuXG52YXIgX21vdXNlRXZlbnRUeXBlcyA9IFtcImNsaWNrXCIsXCJkYmxjbGlja1wiLFwibW91c2Vkb3duXCIsXCJtb3VzZW1vdmVcIixcIm1vdXNldXBcIixcIm1vdXNlb3V0XCJdO1xudmFyIF9oYW1tZXJFdmVudFR5cGVzID0gWyBcbiAgICBcInBhblwiLFwicGFuc3RhcnRcIixcInBhbm1vdmVcIixcInBhbmVuZFwiLFwicGFuY2FuY2VsXCIsXCJwYW5sZWZ0XCIsXCJwYW5yaWdodFwiLFwicGFudXBcIixcInBhbmRvd25cIixcbiAgICBcInByZXNzXCIgLCBcInByZXNzdXBcIixcbiAgICBcInN3aXBlXCIgLCBcInN3aXBlbGVmdFwiICwgXCJzd2lwZXJpZ2h0XCIgLCBcInN3aXBldXBcIiAsIFwic3dpcGVkb3duXCIsXG4gICAgXCJ0YXBcIlxuXTtcblxudmFyIEV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGNhbnZheCAsIG9wdCkge1xuICAgIHRoaXMuY2FudmF4ID0gY2FudmF4O1xuXG4gICAgdGhpcy5jdXJQb2ludHMgPSBbbmV3IFBvaW50KDAsIDApXSAvL1gsWSDnmoQgcG9pbnQg6ZuG5ZCILCDlnKh0b3VjaOS4i+mdouWImeS4uiB0b3VjaOeahOmbhuWQiO+8jOWPquaYr+i/meS4qnRvdWNo6KKr5re75Yqg5LqG5a+55bqU55qEeO+8jHlcbiAgICAvL+W9k+WJjea/gOa0u+eahOeCueWvueW6lOeahG9iau+8jOWcqHRvdWNo5LiL5Y+v5Lul5piv5Liq5pWw57uELOWSjOS4iumdoueahCBjdXJQb2ludHMg5a+55bqUXG4gICAgdGhpcy5jdXJQb2ludHNUYXJnZXQgPSBbXTtcblxuICAgIHRoaXMuX3RvdWNoaW5nID0gZmFsc2U7XG4gICAgLy/mraPlnKjmi5bliqjvvIzliY3mj5DmmK9fdG91Y2hpbmc9dHJ1ZVxuICAgIHRoaXMuX2RyYWdpbmcgPSBmYWxzZTtcblxuICAgIC8v5b2T5YmN55qE6byg5qCH54q25oCBXG4gICAgdGhpcy5fY3Vyc29yID0gXCJkZWZhdWx0XCI7XG5cbiAgICB0aGlzLnRhcmdldCA9IHRoaXMuY2FudmF4LnZpZXc7XG4gICAgdGhpcy50eXBlcyA9IFtdO1xuXG4gICAgLy9tb3VzZeS9k+e7n+S4reS4jemcgOimgemFjee9rmRyYWcsdG91Y2jkuK3kvJrnlKjliLDnrKzkuInmlrnnmoR0b3VjaOW6k++8jOavj+S4quW6k+eahOS6i+S7tuWQjeensOWPr+iDveS4jeS4gOagt++8jFxuICAgIC8v5bCx6KaB6L+Z6YeM6YWN572u77yM6buY6K6k5a6e546w55qE5pivaGFtbWVyanPnmoQs5omA5Lul6buY6K6k5Y+v5Lul5Zyo6aG555uu6YeM5byV5YWlaGFtbWVyanMgaHR0cDovL2hhbW1lcmpzLmdpdGh1Yi5pby9cbiAgICB0aGlzLmRyYWcgPSB7XG4gICAgICAgIHN0YXJ0IDogXCJwYW5zdGFydFwiLFxuICAgICAgICBtb3ZlIDogXCJwYW5tb3ZlXCIsXG4gICAgICAgIGVuZCA6IFwicGFuZW5kXCJcbiAgICB9O1xuXG4gICAgXy5leHRlbmQoIHRydWUgLCB0aGlzICwgb3B0ICk7XG5cbn07XG5cbi8v6L+Z5qC355qE5aW95aSE5pivZG9jdW1lbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb27lj6rkvJrlnKjlrprkuYnnmoTml7blgJnmiafooYzkuIDmrKHjgIJcbnZhciBjb250YWlucyA9IGRvY3VtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICBpZiggIWNoaWxkICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICEhKHBhcmVudC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihjaGlsZCkgJiAxNik7XG59IDogZnVuY3Rpb24gKHBhcmVudCwgY2hpbGQpIHtcbiAgICBpZiggIWNoaWxkICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkICE9PSBjaGlsZCAmJiAocGFyZW50LmNvbnRhaW5zID8gcGFyZW50LmNvbnRhaW5zKGNoaWxkKSA6IHRydWUpO1xufTtcblxuRXZlbnRIYW5kbGVyLnByb3RvdHlwZSA9IHtcbiAgICBpbml0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIC8v5L6d5qyh5re75Yqg5LiK5rWP6KeI5Zmo55qE6Ieq5bim5LqL5Lu25L6m5ZCsXG4gICAgICAgIHZhciBtZSAgID0gdGhpcztcbiAgICAgICAgaWYoIG1lLnRhcmdldC5ub2RlVHlwZSA9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIC8v5aaC5p6cdGFyZ2V0Lm5vZGVUeXBl5rKh5pyJ55qE6K+d77yMIOivtOaYjuivpXRhcmdldOS4uuS4gOS4qmpRdWVyeeWvueixoSBvciBraXNzeSDlr7nosaFvciBoYW1tZXLlr7nosaFcbiAgICAgICAgICAgIC8v5Y2z5Li656ys5LiJ5pa55bqT77yM6YKj5LmI5bCx6KaB5a+55o6l56ys5LiJ5pa55bqT55qE5LqL5Lu257O757uf44CC6buY6K6k5a6e546waGFtbWVy55qE5aSn6YOo5YiG5LqL5Lu257O757ufXG4gICAgICAgICAgICBpZiggIW1lLnR5cGVzIHx8IG1lLnR5cGVzLmxlbmd0aCA9PSAwICApe1xuICAgICAgICAgICAgICAgIG1lLnR5cGVzID0gX2hhbW1lckV2ZW50VHlwZXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYoIG1lLnRhcmdldC5ub2RlVHlwZSA9PSAxICl7XG4gICAgICAgICAgICBtZS50eXBlcyA9IF9tb3VzZUV2ZW50VHlwZXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgXy5lYWNoKCBtZS50eXBlcyAsIGZ1bmN0aW9uKCB0eXBlICl7XG4gICAgICAgICAgICAvL+S4jeWGjeWFs+W/g+a1j+iniOWZqOeOr+Wig+aYr+WQpiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgXG4gICAgICAgICAgICAvL+iAjOaYr+ebtOaOpeWPqueuoeS8oOe7meS6i+S7tuaooeWdl+eahOaYr+S4gOS4quWOn+eUn2Rvbei/mOaYryBqceWvueixoSBvciBoYW1tZXLlr7nosaHnrYlcbiAgICAgICAgICAgIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gMSApe1xuICAgICAgICAgICAgICAgICQuYWRkRXZlbnQoIG1lLnRhcmdldCAsIHR5cGUgLCBmdW5jdGlvbiggZSApe1xuICAgICAgICAgICAgICAgICAgICBtZS5fX21vdXNlSGFuZGxlciggZSApO1xuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWUudGFyZ2V0Lm9uKCB0eXBlICwgZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgbWUuX19saWJIYW5kbGVyKCBlICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9ICk7XG4gICAgfSxcbiAgICAvKlxuICAgICog5Y6f55Sf5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYmVnaW5cbiAgICAqIOm8oOagh+S6i+S7tuWkhOeQhuWHveaVsFxuICAgICoqL1xuICAgIF9fbW91c2VIYW5kbGVyIDogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcblxuICAgICAgICByb290LnVwZGF0ZVZpZXdPZmZzZXQoKTtcbiAgICBcbiAgICAgICAgbWUuY3VyUG9pbnRzID0gWyBuZXcgUG9pbnQoIFxuICAgICAgICAgICAgJC5wYWdlWCggZSApIC0gcm9vdC52aWV3T2Zmc2V0LmxlZnQgLCBcbiAgICAgICAgICAgICQucGFnZVkoIGUgKSAtIHJvb3Qudmlld09mZnNldC50b3BcbiAgICAgICAgKV07XG5cbiAgICAgICAgLy/nkIborrrkuIrmnaXor7TvvIzov5nph4zmi7/liLBwb2ludOS6huWQju+8jOWwseimgeiuoeeul+i/meS4qnBvaW505a+55bqU55qEdGFyZ2V05p2lcHVzaOWIsGN1clBvaW50c1RhcmdldOmHjO+8jFxuICAgICAgICAvL+S9huaYr+WboOS4uuWcqGRyYWfnmoTml7blgJnlhbblrp7mmK/lj6/ku6XkuI3nlKjorqHnrpflr7nlupR0YXJnZXTnmoTjgIJcbiAgICAgICAgLy/miYDku6XmlL7lnKjkuobkuIvpnaLnmoRtZS5fX2dldGN1clBvaW50c1RhcmdldCggZSAsIGN1ck1vdXNlUG9pbnQgKTvluLjop4Rtb3VzZW1vdmXkuK3miafooYxcblxuICAgICAgICB2YXIgY3VyTW91c2VQb2ludCAgPSBtZS5jdXJQb2ludHNbMF07IFxuICAgICAgICB2YXIgY3VyTW91c2VUYXJnZXQgPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG5cbiAgICAgICAgLy/mqKHmi59kcmFnLG1vdXNlb3Zlcixtb3VzZW91dCDpg6jliIbku6PnoIEgYmVnaW4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLy9tb3VzZWRvd27nmoTml7blgJkg5aaC5p6cIGN1ck1vdXNlVGFyZ2V0LmRyYWdFbmFibGVkIOS4unRydWXjgILlsLHopoHlvIDlp4vlh4blpIdkcmFn5LqGXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZWRvd25cIiApe1xuICAgICAgICAgICAvL+WmguaenGN1clRhcmdldCDnmoTmlbDnu4TkuLrnqbrmiJbogIXnrKzkuIDkuKrkuLpmYWxzZSDvvIzvvIzvvIxcbiAgICAgICAgICAgaWYoICFjdXJNb3VzZVRhcmdldCApe1xuICAgICAgICAgICAgIHZhciBvYmogPSByb290LmdldE9iamVjdHNVbmRlclBvaW50KCBjdXJNb3VzZVBvaW50ICwgMSlbMF07XG4gICAgICAgICAgICAgaWYob2JqKXtcbiAgICAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldCA9IFsgb2JqIF07XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICB9O1xuICAgICAgICAgICBjdXJNb3VzZVRhcmdldCA9IG1lLmN1clBvaW50c1RhcmdldFswXTtcbiAgICAgICAgICAgaWYgKCBjdXJNb3VzZVRhcmdldCAmJiBjdXJNb3VzZVRhcmdldC5kcmFnRW5hYmxlZCApe1xuICAgICAgICAgICAgICAgLy/pvKDmoIfkuovku7blt7Lnu4/mkbjliLDkuobkuIDkuKpcbiAgICAgICAgICAgICAgIG1lLl90b3VjaGluZyA9IHRydWU7XG4gICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNldXBcIiB8fCAoZS50eXBlID09IFwibW91c2VvdXRcIiAmJiAhY29udGFpbnMocm9vdC52aWV3ICwgKGUudG9FbGVtZW50IHx8IGUucmVsYXRlZFRhcmdldCkgKSkgKXtcbiAgICAgICAgICAgIGlmKG1lLl9kcmFnaW5nID09IHRydWUpe1xuICAgICAgICAgICAgICAgIC8v6K+05piO5Yia5Yia5Zyo5ouW5YqoXG4gICAgICAgICAgICAgICAgbWUuX2RyYWdFbmQoIGUgLCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5maXJlKFwiZHJhZ2VuZFwiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5fZHJhZ2luZyAgPSBmYWxzZTtcbiAgICAgICAgICAgIG1lLl90b3VjaGluZyA9IGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZW91dFwiICl7XG4gICAgICAgICAgICBpZiggIWNvbnRhaW5zKHJvb3QudmlldyAsIChlLnRvRWxlbWVudCB8fCBlLnJlbGF0ZWRUYXJnZXQpICkgKXtcbiAgICAgICAgICAgICAgICBtZS5fX2dldGN1clBvaW50c1RhcmdldChlICwgY3VyTW91c2VQb2ludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggZS50eXBlID09IFwibW91c2Vtb3ZlXCIgKXsgIC8vfHwgZS50eXBlID09IFwibW91c2Vkb3duXCIgKXtcbiAgICAgICAgICAgIC8v5ouW5Yqo6L+H56iL5Lit5bCx5LiN5Zyo5YGa5YW25LuW55qEbW91c2VvdmVy5qOA5rWL77yMZHJhZ+S8mOWFiFxuICAgICAgICAgICAgaWYobWUuX3RvdWNoaW5nICYmIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICYmIGN1ck1vdXNlVGFyZ2V0KXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuato+WcqOaLluWKqOWVilxuICAgICAgICAgICAgICAgIGlmKCFtZS5fZHJhZ2luZyl7XG4gICAgICAgICAgICAgICAgICAgIC8vYmVnaW4gZHJhZ1xuICAgICAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5maXJlKFwiZHJhZ3N0YXJ0XCIpO1xuICAgICAgICAgICAgICAgICAgICAvL+WFiOaKiuacrOWwiue7memakOiXj+S6hlxuICAgICAgICAgICAgICAgICAgICBjdXJNb3VzZVRhcmdldC5jb250ZXh0Lmdsb2JhbEFscGhhID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7lhYvpmobkuIDkuKrlia/mnKzliLBhY3RpdmVTdGFnZVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lT2JqZWN0ID0gbWUuX2Nsb25lMmhvdmVyU3RhZ2UoIGN1ck1vdXNlVGFyZ2V0ICwgMCApO1xuICAgICAgICAgICAgICAgICAgICBjbG9uZU9iamVjdC5jb250ZXh0Lmdsb2JhbEFscGhhID0gY3VyTW91c2VUYXJnZXQuX2dsb2JhbEFscGhhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZHJhZyBtb3ZlIGluZ1xuICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ01vdmVIYW5kZXIoIGUgLCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/luLjop4Rtb3VzZW1vdmXmo4DmtYtcbiAgICAgICAgICAgICAgICAvL21vdmXkuovku7bkuK3vvIzpnIDopoHkuI3lgZznmoTmkJzntKJ0YXJnZXTvvIzov5nkuKrlvIDplIDmjLrlpKfvvIxcbiAgICAgICAgICAgICAgICAvL+WQjue7reWPr+S7peS8mOWMlu+8jOWKoOS4iuWSjOW4p+eOh+ebuOW9k+eahOW7tui/n+WkhOeQhlxuICAgICAgICAgICAgICAgIG1lLl9fZ2V0Y3VyUG9pbnRzVGFyZ2V0KCBlICwgY3VyTW91c2VQb2ludCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WFtuS7lueahOS6i+S7tuWwseebtOaOpeWcqHRhcmdldOS4iumdoua0vuWPkeS6i+S7tlxuICAgICAgICAgICAgdmFyIGNoaWxkID0gY3VyTW91c2VUYXJnZXQ7XG4gICAgICAgICAgICBpZiggIWNoaWxkICl7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSByb290O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lLl9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzKCBlICwgWyBjaGlsZCBdICk7XG4gICAgICAgICAgICBtZS5fY3Vyc29ySGFuZGVyKCBjaGlsZCApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCByb290LnByZXZlbnREZWZhdWx0ICkge1xuICAgICAgICAgICAgLy/pmLvmraLpu5jorqTmtY/op4jlmajliqjkvZwoVzNDKSBcbiAgICAgICAgICAgIGlmICggZSAmJiBlLnByZXZlbnREZWZhdWx0ICkge1xuICAgICAgICAgICAgICAgwqBlLnByZXZlbnREZWZhdWx0KCk7IFxuICAgICAgICAgICAgfcKgZWxzZSB7XG4gICAgICAgICAgICDCoMKgwqDCoHdpbmRvdy5ldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9OyBcbiAgICB9LFxuICAgIF9fZ2V0Y3VyUG9pbnRzVGFyZ2V0IDogZnVuY3Rpb24oZSAsIHBvaW50ICkge1xuICAgICAgICB2YXIgbWUgICAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgICA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIG9sZE9iaiA9IG1lLmN1clBvaW50c1RhcmdldFswXTtcblxuICAgICAgICBpZiggb2xkT2JqICYmICFvbGRPYmouY29udGV4dCApe1xuICAgICAgICAgICAgb2xkT2JqID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZSA9IG5ldyBDYW52YXhFdmVudCggZSApO1xuXG4gICAgICAgIGlmKCBlLnR5cGU9PVwibW91c2Vtb3ZlXCJcbiAgICAgICAgICAgICYmIG9sZE9iaiAmJiBvbGRPYmouX2hvdmVyQ2xhc3MgJiYgb2xkT2JqLnBvaW50Q2hrUHJpb3JpdHlcbiAgICAgICAgICAgICYmIG9sZE9iai5nZXRDaGlsZEluUG9pbnQoIHBvaW50ICkgKXtcbiAgICAgICAgICAgIC8v5bCP5LyY5YyWLOm8oOagh21vdmXnmoTml7blgJnjgILorqHnrpfpopHnjoflpKrlpKfvvIzmiYDku6XjgILlgZrmraTkvJjljJZcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJdGFyZ2V05a2Y5Zyo77yM6ICM5LiU5b2T5YmN5YWD57Sg5q2j5ZyoaG92ZXJTdGFnZeS4re+8jOiAjOS4lOW9k+WJjem8oOagh+i/mOWcqHRhcmdldOWGhSzlsLHmsqHlv4XopoHlj5bmo4DmtYvmlbTkuKpkaXNwbGF5TGlzdOS6hlxuICAgICAgICAgICAgLy/lvIDlj5HmtL7lj5HluLjop4Rtb3VzZW1vdmXkuovku7ZcbiAgICAgICAgICAgIGUudGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgZS5wb2ludCAgPSBvbGRPYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgIG9sZE9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvYmogPSByb290LmdldE9iamVjdHNVbmRlclBvaW50KCBwb2ludCAsIDEpWzBdO1xuXG4gICAgICAgIGlmKG9sZE9iaiAmJiBvbGRPYmogIT0gb2JqIHx8IGUudHlwZT09XCJtb3VzZW91dFwiKSB7XG4gICAgICAgICAgICBpZiggb2xkT2JqICYmIG9sZE9iai5jb250ZXh0ICl7XG4gICAgICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0WzBdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBlLnR5cGUgICAgID0gXCJtb3VzZW91dFwiO1xuICAgICAgICAgICAgICAgIGUudG9UYXJnZXQgPSBvYmo7IFxuICAgICAgICAgICAgICAgIGUudGFyZ2V0ICAgPSBlLmN1cnJlbnRUYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICAgICAgZS5wb2ludCAgICA9IG9sZE9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgICAgIG9sZE9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIG9iaiAmJiBvbGRPYmogIT0gb2JqICl7IC8vJiYgb2JqLl9ob3ZlcmFibGUg5bey57uPIOW5suaOieS6hlxuICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0WzBdID0gb2JqO1xuICAgICAgICAgICAgZS50eXBlICAgICAgID0gXCJtb3VzZW92ZXJcIjtcbiAgICAgICAgICAgIGUuZnJvbVRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUudGFyZ2V0ICAgICA9IGUuY3VycmVudFRhcmdldCA9IG9iajtcbiAgICAgICAgICAgIGUucG9pbnQgICAgICA9IG9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgb2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2Vtb3ZlXCIgJiYgb2JqICl7XG4gICAgICAgICAgICBlLnRhcmdldCA9IGUuY3VycmVudFRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUucG9pbnQgID0gb2xkT2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICB9O1xuICAgICAgICBtZS5fY3Vyc29ySGFuZGVyKCBvYmogLCBvbGRPYmogKTtcbiAgICB9LFxuICAgIF9jdXJzb3JIYW5kZXIgICAgOiBmdW5jdGlvbiggb2JqICwgb2xkT2JqICl7XG4gICAgICAgIGlmKCFvYmogJiYgIW9sZE9iaiApe1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmogJiYgb2xkT2JqICE9IG9iaiAmJiBvYmouY29udGV4dCl7XG4gICAgICAgICAgICB0aGlzLl9zZXRDdXJzb3Iob2JqLmNvbnRleHQuY3Vyc29yKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX3NldEN1cnNvciA6IGZ1bmN0aW9uKGN1cnNvcikge1xuICAgICAgICBpZih0aGlzLl9jdXJzb3IgPT0gY3Vyc29yKXtcbiAgICAgICAgICAvL+WmguaenOS4pOasoeimgeiuvue9rueahOm8oOagh+eKtuaAgeaYr+S4gOagt+eahFxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW52YXgudmlldy5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgICAgIHRoaXMuX2N1cnNvciA9IGN1cnNvcjtcbiAgICB9LFxuICAgIC8qXG4gICAgKiDljp/nlJ/kuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1lbmRcbiAgICAqL1xuXG4gICAgLypcbiAgICAgKuesrOS4ieaWueW6k+eahOS6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWJlZ2luXG4gICAgICrop6blsY/kuovku7blpITnkIblh73mlbBcbiAgICAgKiAqL1xuICAgIF9fbGliSGFuZGxlciA6IGZ1bmN0aW9uKCBlICkge1xuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICByb290LnVwZGF0ZVZpZXdPZmZzZXQoKTtcbiAgICAgICAgLy8gdG91Y2gg5LiL55qEIGN1clBvaW50c1RhcmdldCDku450b3VjaGVz5Lit5p2lXG4gICAgICAgIC8v6I635Y+WY2FudmF45Z2Q5qCH57O757uf6YeM6Z2i55qE5Z2Q5qCHXG4gICAgICAgIG1lLmN1clBvaW50cyA9IG1lLl9fZ2V0Q2FudmF4UG9pbnRJblRvdWNocyggZSApO1xuICAgICAgICBpZiggIW1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAvL+WmguaenOWcqGRyYWdpbmfnmoTor53vvIx0YXJnZXTlt7Lnu4/mmK/pgInkuK3kuobnmoTvvIzlj6/ku6XkuI3nlKgg5qOA5rWL5LqGXG4gICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXQgPSBtZS5fX2dldENoaWxkSW5Ub3VjaHMoIG1lLmN1clBvaW50cyApO1xuICAgICAgICB9O1xuICAgICAgICBpZiggbWUuY3VyUG9pbnRzVGFyZ2V0Lmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICAgIC8vZHJhZ+W8gOWni1xuICAgICAgICAgICAgaWYoIGUudHlwZSA9PSBtZS5kcmFnLnN0YXJ0KXtcbiAgICAgICAgICAgICAgICAvL2RyYWdzdGFydOeahOaXtuWAmXRvdWNo5bey57uP5YeG5aSH5aW95LqGdGFyZ2V077yMIGN1clBvaW50c1RhcmdldCDph4zpnaLlj6ropoHmnInkuIDkuKrmmK/mnInmlYjnmoRcbiAgICAgICAgICAgICAgICAvL+WwseiupOS4umRyYWdz5byA5aeLXG4gICAgICAgICAgICAgICAgXy5lYWNoKCBtZS5jdXJQb2ludHNUYXJnZXQgLCBmdW5jdGlvbiggY2hpbGQgLCBpICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZCAmJiBjaGlsZC5kcmFnRW5hYmxlZCApe1xuICAgICAgICAgICAgICAgICAgICAgICAvL+WPquimgeacieS4gOS4quWFg+e0oOWwseiupOS4uuato+WcqOWHhuWkh2RyYWfkuoZcbiAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjuWFi+mahuS4gOS4quWJr+acrOWIsGFjdGl2ZVN0YWdlXG4gICAgICAgICAgICAgICAgICAgICAgIG1lLl9jbG9uZTJob3ZlclN0YWdlKCBjaGlsZCAsIGkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/lhYjmiormnKzlsIrnu5npmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZmlyZShcImRyYWdzdGFydFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICkgXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2RyYWdJbmdcbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5tb3ZlKXtcbiAgICAgICAgICAgICAgICBpZiggbWUuX2RyYWdpbmcgKXtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKCBtZS5jdXJQb2ludHNUYXJnZXQgLCBmdW5jdGlvbiggY2hpbGQgLCBpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQgJiYgY2hpbGQuZHJhZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnTW92ZUhhbmRlciggZSAsIGNoaWxkICwgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vZHJhZ+e7k+adn1xuICAgICAgICAgICAgaWYoIGUudHlwZSA9PSBtZS5kcmFnLmVuZCl7XG4gICAgICAgICAgICAgICAgaWYoIG1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkICYmIGNoaWxkLmRyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdFbmQoIGUgLCBjaGlsZCAsIDAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5maXJlKFwiZHJhZ2VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIG1lLmN1clBvaW50c1RhcmdldCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/lpoLmnpzlvZPliY3msqHmnInkuIDkuKp0YXJnZXTvvIzlsLHmiorkuovku7bmtL7lj5HliLBjYW52YXjkuIrpnaJcbiAgICAgICAgICAgIG1lLl9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzKCBlICwgWyByb290IF0gKTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8v5LuOdG91Y2hz5Lit6I635Y+W5Yiw5a+55bqUdG91Y2ggLCDlnKjkuIrpnaLmt7vliqDkuIpjYW52YXjlnZDmoIfns7vnu5/nmoR477yMeVxuICAgIF9fZ2V0Q2FudmF4UG9pbnRJblRvdWNocyA6IGZ1bmN0aW9uKCBlICl7XG4gICAgICAgIHZhciBtZSAgICAgICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCAgICAgID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgY3VyVG91Y2hzID0gW107XG4gICAgICAgIF8uZWFjaCggZS5wb2ludCAsIGZ1bmN0aW9uKCB0b3VjaCApe1xuICAgICAgICAgICBjdXJUb3VjaHMucHVzaCgge1xuICAgICAgICAgICAgICAgeCA6IENhbnZheEV2ZW50LnBhZ2VYKCB0b3VjaCApIC0gcm9vdC52aWV3T2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICAgICB5IDogQ2FudmF4RXZlbnQucGFnZVkoIHRvdWNoICkgLSByb290LnZpZXdPZmZzZXQudG9wXG4gICAgICAgICAgIH0gKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjdXJUb3VjaHM7XG4gICAgfSxcbiAgICBfX2dldENoaWxkSW5Ub3VjaHMgOiBmdW5jdGlvbiggdG91Y2hzICl7XG4gICAgICAgIHZhciBtZSAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciB0b3VjaGVzVGFyZ2V0ID0gW107XG4gICAgICAgIF8uZWFjaCggdG91Y2hzICwgZnVuY3Rpb24odG91Y2gpe1xuICAgICAgICAgICAgdG91Y2hlc1RhcmdldC5wdXNoKCByb290LmdldE9iamVjdHNVbmRlclBvaW50KCB0b3VjaCAsIDEpWzBdICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuIHRvdWNoZXNUYXJnZXQ7XG4gICAgfSxcbiAgICAvKlxuICAgICrnrKzkuInmlrnlupPnmoTkuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICovXG5cblxuICAgIC8qXG4gICAgICpAcGFyYW0ge2FycmF5fSBjaGlsZHMgXG4gICAgICogKi9cbiAgICBfX2Rpc3BhdGNoRXZlbnRJbkNoaWxkczogZnVuY3Rpb24oZSwgY2hpbGRzKSB7XG4gICAgICAgIGlmICghY2hpbGRzICYmICEoXCJsZW5ndGhcIiBpbiBjaGlsZHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIGhhc0NoaWxkID0gZmFsc2U7XG4gICAgICAgIF8uZWFjaChjaGlsZHMsIGZ1bmN0aW9uKGNoaWxkLCBpKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBoYXNDaGlsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGNlID0gbmV3IENhbnZheEV2ZW50KGUpO1xuICAgICAgICAgICAgICAgIGNlLnRhcmdldCA9IGNlLmN1cnJlbnRUYXJnZXQgPSBjaGlsZCB8fCB0aGlzO1xuICAgICAgICAgICAgICAgIGNlLnN0YWdlUG9pbnQgPSBtZS5jdXJQb2ludHNbaV07XG4gICAgICAgICAgICAgICAgY2UucG9pbnQgPSBjZS50YXJnZXQuZ2xvYmFsVG9Mb2NhbChjZS5zdGFnZVBvaW50KTtcbiAgICAgICAgICAgICAgICBjaGlsZC5kaXNwYXRjaEV2ZW50KGNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBoYXNDaGlsZDtcbiAgICB9LFxuICAgIC8v5YWL6ZqG5LiA5Liq5YWD57Sg5YiwaG92ZXIgc3RhZ2XkuK3ljrtcbiAgICBfY2xvbmUyaG92ZXJTdGFnZTogZnVuY3Rpb24odGFyZ2V0LCBpKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgX2RyYWdEdXBsaWNhdGUgPSByb290Ll9idWZmZXJTdGFnZS5nZXRDaGlsZEJ5SWQodGFyZ2V0LmlkKTtcbiAgICAgICAgaWYgKCFfZHJhZ0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgX2RyYWdEdXBsaWNhdGUgPSB0YXJnZXQuY2xvbmUodHJ1ZSk7XG4gICAgICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5fdHJhbnNmb3JtID0gdGFyZ2V0LmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqVE9ETzog5Zug5Li65ZCO57ut5Y+v6IO95Lya5pyJ5omL5Yqo5re75Yqg55qEIOWFg+e0oOWIsF9idWZmZXJTdGFnZSDph4zpnaLmnaVcbiAgICAgICAgICAgICAq5q+U5aaCdGlwc1xuICAgICAgICAgICAgICrov5nnsbvmiYvliqjmt7vliqDov5vmnaXnmoTogq/lrprmmK/lm6DkuLrpnIDopoHmmL7npLrlnKjmnIDlpJblsYLnmoTjgILlnKhob3ZlcuWFg+e0oOS5i+S4iuOAglxuICAgICAgICAgICAgICrmiYDmnInoh6rliqjmt7vliqDnmoRob3ZlcuWFg+e0oOmDvem7mOiupOa3u+WKoOWcqF9idWZmZXJTdGFnZeeahOacgOW6leWxglxuICAgICAgICAgICAgICoqL1xuICAgICAgICAgICAgcm9vdC5fYnVmZmVyU3RhZ2UuYWRkQ2hpbGRBdChfZHJhZ0R1cGxpY2F0ZSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRhcmdldC5fZ2xvYmFsQWxwaGE7XG4gICAgICAgIHRhcmdldC5fZHJhZ1BvaW50ID0gdGFyZ2V0Lmdsb2JhbFRvTG9jYWwobWUuY3VyUG9pbnRzW2ldKTtcbiAgICAgICAgcmV0dXJuIF9kcmFnRHVwbGljYXRlO1xuICAgIH0sXG4gICAgLy9kcmFnIOS4rSDnmoTlpITnkIblh73mlbBcbiAgICBfZHJhZ01vdmVIYW5kZXI6IGZ1bmN0aW9uKGUsIHRhcmdldCwgaSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIF9wb2ludCA9IHRhcmdldC5nbG9iYWxUb0xvY2FsKCBtZS5jdXJQb2ludHNbaV0gKTtcblxuICAgICAgICAvL+imgeWvueW6lOeahOS/ruaUueacrOWwiueahOS9jee9ru+8jOS9huaYr+imgeWRiuivieW8leaTjuS4jeimgXdhdGNo6L+Z5Liq5pe25YCZ55qE5Y+Y5YyWXG4gICAgICAgIHRhcmdldC5fbm90V2F0Y2ggPSB0cnVlO1xuICAgICAgICB2YXIgX21vdmVTdGFnZSA9IHRhcmdldC5tb3ZlaW5nO1xuICAgICAgICB0YXJnZXQubW92ZWluZyA9IHRydWU7XG4gICAgICAgIHRhcmdldC5jb250ZXh0LnggKz0gKF9wb2ludC54IC0gdGFyZ2V0Ll9kcmFnUG9pbnQueCk7XG4gICAgICAgIHRhcmdldC5jb250ZXh0LnkgKz0gKF9wb2ludC55IC0gdGFyZ2V0Ll9kcmFnUG9pbnQueSk7XG4gICAgICAgIHRhcmdldC5maXJlKFwiZHJhZ21vdmVcIik7XG4gICAgICAgIHRhcmdldC5tb3ZlaW5nID0gX21vdmVTdGFnZTtcbiAgICAgICAgdGFyZ2V0Ll9ub3RXYXRjaCA9IGZhbHNlO1xuICAgICAgICAvL+WQjOatpeWujOavleacrOWwiueahOS9jee9rlxuXG4gICAgICAgIC8v6L+Z6YeM5Y+q6IO955u05o6l5L+u5pS5X3RyYW5zZm9ybSDjgIIg5LiN6IO955So5LiL6Z2i55qE5L+u5pS5eO+8jHnnmoTmlrnlvI/jgIJcbiAgICAgICAgdmFyIF9kcmFnRHVwbGljYXRlID0gcm9vdC5fYnVmZmVyU3RhZ2UuZ2V0Q2hpbGRCeUlkKHRhcmdldC5pZCk7XG4gICAgICAgIF9kcmFnRHVwbGljYXRlLl90cmFuc2Zvcm0gPSB0YXJnZXQuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCk7XG4gICAgICAgIC8v5Lul5Li655u05o6l5L+u5pS555qEX3RyYW5zZm9ybeS4jeS8muWHuuWPkeW/g+i3s+S4iuaKpe+8jCDmuLLmn5PlvJXmk47kuI3liLbliqjov5nkuKpzdGFnZemcgOimgee7mOWItuOAglxuICAgICAgICAvL+aJgOS7peimgeaJi+WKqOWHuuWPkeW/g+i3s+WMhVxuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5oZWFydEJlYXQoKTtcbiAgICB9LFxuICAgIC8vZHJhZ+e7k+adn+eahOWkhOeQhuWHveaVsFxuICAgIF9kcmFnRW5kOiBmdW5jdGlvbihlLCB0YXJnZXQsIGkpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG5cbiAgICAgICAgLy9fZHJhZ0R1cGxpY2F0ZSDlpI3liLblnKhfYnVmZmVyU3RhZ2Ug5Lit55qE5Ymv5pysXG4gICAgICAgIHZhciBfZHJhZ0R1cGxpY2F0ZSA9IHJvb3QuX2J1ZmZlclN0YWdlLmdldENoaWxkQnlJZCh0YXJnZXQuaWQpO1xuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5kZXN0cm95KCk7XG5cbiAgICAgICAgdGFyZ2V0LmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0YXJnZXQuX2dsb2JhbEFscGhhO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXI7IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5LqL5Lu2566h55CG57G7XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICog5p6E6YCg5Ye95pWwLlxuICogQG5hbWUgRXZlbnREaXNwYXRjaGVyXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVy57G75piv5Y+v6LCD5bqm5LqL5Lu255qE57G755qE5Z+657G777yM5a6D5YWB6K645pi+56S65YiX6KGo5LiK55qE5Lu75L2V5a+56LGh6YO95piv5LiA5Liq5LqL5Lu255uu5qCH44CCXG4gKi9cbnZhciBFdmVudE1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgICAvL+S6i+S7tuaYoOWwhOihqO+8jOagvOW8j+S4uu+8mnt0eXBlMTpbbGlzdGVuZXIxLCBsaXN0ZW5lcjJdLCB0eXBlMjpbbGlzdGVuZXIzLCBsaXN0ZW5lcjRdfVxuICAgIHRoaXMuX2V2ZW50TWFwID0ge307XG59O1xuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlID0geyBcbiAgICAvKlxuICAgICAqIOazqOWGjOS6i+S7tuS+puWQrOWZqOWvueixoe+8jOS7peS9v+S+puWQrOWZqOiDveWkn+aOpeaUtuS6i+S7tumAmuefpeOAglxuICAgICAqL1xuICAgIF9hZGRFdmVudExpc3RlbmVyIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcblxuICAgICAgICBpZiggdHlwZW9mIGxpc3RlbmVyICE9IFwiZnVuY3Rpb25cIiApe1xuICAgICAgICAgIC8vbGlzdGVuZXLlv4XpobvmmK/kuKpmdW5jdGlvbuWRkOS6slxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYWRkUmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHNlbGYgICAgICA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggdHlwZS5zcGxpdChcIiBcIikgLCBmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgICAgIHZhciBtYXAgPSBzZWxmLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgICAgIGlmKCFtYXApe1xuICAgICAgICAgICAgICAgIG1hcCA9IHNlbGYuX2V2ZW50TWFwW3R5cGVdID0gW107XG4gICAgICAgICAgICAgICAgbWFwLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50RW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKF8uaW5kZXhPZihtYXAgLGxpc3RlbmVyKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIG1hcC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZGRSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhZGRSZXN1bHQ7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliKDpmaTkuovku7bkvqblkKzlmajjgIJcbiAgICAgKi9cbiAgICBfcmVtb3ZlRXZlbnRMaXN0ZW5lciA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkgcmV0dXJuIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSh0eXBlKTtcblxuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIGlmKCFtYXApe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpID0gbWFwW2ldO1xuICAgICAgICAgICAgaWYobGkgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbWFwLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpZihtYXAubGVuZ3RoICAgID09IDApIHsgXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrlpoLmnpzov5nkuKrml7blgJljaGlsZOayoeacieS7u+S9leS6i+S7tuS+puWQrFxuICAgICAgICAgICAgICAgICAgICBpZihfLmlzRW1wdHkodGhpcy5fZXZlbnRNYXApKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI6K+l5YWD57Sg5LiN5YaN5o6l5Y+X5LqL5Lu255qE5qOA5rWLXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5oyH5a6a57G75Z6L55qE5omA5pyJ5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUgOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgaWYoIW1hcCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuXG4gICAgICAgICAgICAvL+WmguaenOi/meS4quWmguaenOi/meS4quaXtuWAmWNoaWxk5rKh5pyJ5Lu75L2V5LqL5Lu25L6m5ZCsXG4gICAgICAgICAgICBpZihfLmlzRW1wdHkodGhpcy5fZXZlbnRNYXApKXtcbiAgICAgICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOS4jeWGjeaOpeWPl+S6i+S7tueahOajgOa1i1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliKDpmaTmiYDmnInkuovku7bkvqblkKzlmajjgIJcbiAgICAgKi9cbiAgICBfcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMgOiBmdW5jdGlvbigpIHtcdFxuICAgICAgICB0aGlzLl9ldmVudE1hcCA9IHt9O1xuICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICog5rS+5Y+R5LqL5Lu277yM6LCD55So5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgKi9cbiAgICBfZGlzcGF0Y2hFdmVudCA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW2UudHlwZV07XG4gICAgICAgIFxuICAgICAgICBpZiggbWFwICl7XG4gICAgICAgICAgICBpZighZS50YXJnZXQpIGUudGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIG1hcCA9IG1hcC5zbGljZSgpO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gbWFwW2ldO1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZihsaXN0ZW5lcikgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoICFlLl9zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgICAgICAgICAvL+WQkeS4iuWGkuazoVxuICAgICAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuX2Rpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvKipcbiAgICAgICAqIOajgOafpeaYr+WQpuS4uuaMh+WumuS6i+S7tuexu+Wei+azqOWGjOS6huS7u+S9leS+puWQrOWZqOOAglxuICAgICAgICovXG4gICAgX2hhc0V2ZW50TGlzdGVuZXIgOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgcmV0dXJuIG1hcCAhPSBudWxsICYmIG1hcC5sZW5ndGggPiAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRNYW5hZ2VyO1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5LqL5Lu25rS+5Y+R57G7XG4gKi9cbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vRXZlbnRNYW5hZ2VyXCI7XG5pbXBvcnQgQ2FudmF4RXZlbnQgZnJvbSBcIi4vQ2FudmF4RXZlbnRcIjtcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cblxudmFyIEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uKCl7XG4gICAgRXZlbnREaXNwYXRjaGVyLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBuYW1lKTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoRXZlbnREaXNwYXRjaGVyICwgRXZlbnRNYW5hZ2VyICwge1xuICAgIG9uIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYWRkRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB1biA6IGZ1bmN0aW9uKHR5cGUsbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGU6ZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUoIHR5cGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUFsbEV2ZW50TGlzdGVuZXJzOmZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3JlbW92ZUFsbEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvL3BhcmFtcyDopoHkvKDnu5lldnTnmoRldmVudGhhbmRsZXLlpITnkIblh73mlbDnmoTlj4LmlbDvvIzkvJrooqttZXJnZeWIsENhbnZheCBldmVudOS4rVxuICAgIGZpcmUgOiBmdW5jdGlvbihldmVudFR5cGUgLCBwYXJhbXMpe1xuICAgICAgICB2YXIgZSA9IG5ldyBDYW52YXhFdmVudCggZXZlbnRUeXBlICk7XG5cbiAgICAgICAgaWYoIHBhcmFtcyApe1xuICAgICAgICAgICAgZm9yKCB2YXIgcCBpbiBwYXJhbXMgKXtcbiAgICAgICAgICAgICAgICBpZiggcCBpbiBlICl7XG4gICAgICAgICAgICAgICAgICAgIC8vcGFyYW1z5Lit55qE5pWw5o2u5LiN6IO96KaG55uWZXZlbnTlsZ7mgKdcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHAgKyBcIuWxnuaAp+S4jeiDveimhueblkNhbnZheEV2ZW505bGe5oCnXCIgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVbcF0gPSBwYXJhbXNbcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggZXZlbnRUeXBlLnNwbGl0KFwiIFwiKSAsIGZ1bmN0aW9uKGVUeXBlKXtcbiAgICAgICAgICAgIGUuY3VycmVudFRhcmdldCA9IG1lO1xuICAgICAgICAgICAgbWUuZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZGlzcGF0Y2hFdmVudDpmdW5jdGlvbihldmVudCl7XG4gICAgICAgIC8vdGhpcyBpbnN0YW5jZW9mIERpc3BsYXlPYmplY3RDb250YWluZXIgPT0+IHRoaXMuY2hpbGRyZW5cbiAgICAgICAgLy9UT0RPOiDov5nph4xpbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciDnmoTor53vvIzlnKhkaXNwbGF5T2JqZWN06YeM6Z2i55qEaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi4vZXZlbnQvRXZlbnREaXNwYXRjaGVyXCI7XG4gICAgICAgIC8v5Lya5b6X5Yiw5LiA5LiqdW5kZWZpbmVk77yM5oSf6KeJ5piv5oiQ5LqG5LiA5Liq5b6q546v5L6d6LWW55qE6Zeu6aKY77yM5omA5Lul6L+Z6YeM5o2i55So566A5Y2V55qE5Yik5pat5p2l5Yik5pat6Ieq5bex5piv5LiA5Liq5a655piT77yM5oul5pyJY2hpbGRyZW5cbiAgICAgICAgaWYoIHRoaXMuY2hpbGRyZW4gICYmIGV2ZW50LnBvaW50ICl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXRPYmplY3RzVW5kZXJQb2ludCggZXZlbnQucG9pbnQgLCAxKVswXTtcbiAgICAgICAgICAgIGlmKCB0YXJnZXQgKXtcbiAgICAgICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuY29udGV4dCAmJiBldmVudC50eXBlID09IFwibW91c2VvdmVyXCIpe1xuICAgICAgICAgICAgLy/orrDlvZVkaXNwYXRjaEV2ZW505LmL5YmN55qE5b+D6LezXG4gICAgICAgICAgICB2YXIgcHJlSGVhcnRCZWF0ID0gdGhpcy5faGVhcnRCZWF0TnVtO1xuICAgICAgICAgICAgdmFyIHByZWdBbHBoYSAgICA9IHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICAgICAgICBpZiggcHJlSGVhcnRCZWF0ICE9IHRoaXMuX2hlYXJ0QmVhdE51bSApe1xuICAgICAgICAgICAgICAgIHRoaXMuX2hvdmVyQ2xhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmhvdmVyQ2xvbmUgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnZheCA9IHRoaXMuZ2V0U3RhZ2UoKS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIC8v54S25ZCOY2xvbmXkuIDku71vYmrvvIzmt7vliqDliLBfYnVmZmVyU3RhZ2Ug5LitXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdlNoYXBlID0gdGhpcy5jbG9uZSh0cnVlKTsgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZTaGFwZS5fdHJhbnNmb3JtID0gdGhpcy5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FudmF4Ll9idWZmZXJTdGFnZS5hZGRDaGlsZEF0KCBhY3RpdlNoYXBlICwgMCApOyBcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7mioroh6rlt7HpmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2xvYmFsQWxwaGEgPSBwcmVnQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG5cbiAgICAgICAgaWYoIHRoaXMuY29udGV4dCAmJiBldmVudC50eXBlID09IFwibW91c2VvdXRcIil7XG4gICAgICAgICAgICBpZih0aGlzLl9ob3ZlckNsYXNzKXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuWImuWImm92ZXLnmoTml7blgJnmnInmt7vliqDmoLflvI9cbiAgICAgICAgICAgICAgICB2YXIgY2FudmF4ID0gdGhpcy5nZXRTdGFnZSgpLnBhcmVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3ZlckNsYXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY2FudmF4Ll9idWZmZXJTdGFnZS5yZW1vdmVDaGlsZEJ5SWQodGhpcy5pZCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuX2dsb2JhbEFscGhhICl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRoaXMuX2dsb2JhbEFscGhhO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBoYXNFdmVudDpmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc0V2ZW50TGlzdGVuZXIodHlwZSk7XG4gICAgfSxcbiAgICBoYXNFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzRXZlbnRMaXN0ZW5lcih0eXBlKTtcbiAgICB9LFxuICAgIGhvdmVyIDogZnVuY3Rpb24oIG92ZXJGdW4gLCBvdXRGdW4gKXtcbiAgICAgICAgdGhpcy5vbihcIm1vdXNlb3ZlclwiICwgb3ZlckZ1bik7XG4gICAgICAgIHRoaXMub24oXCJtb3VzZW91dFwiICAsIG91dEZ1biApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIG9uY2UgOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcil7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciBvbmNlSGFuZGxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KG1lICwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHRoaXMudW4odHlwZSAsIG9uY2VIYW5kbGUpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9uKHR5cGUgLCBvbmNlSGFuZGxlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RGlzcGF0Y2hlcjtcbiIsIlxuLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICogTWF0cml4IOefqemYteW6kyDnlKjkuo7mlbTkuKrns7vnu5/nmoTlh6DkvZXlj5jmjaLorqHnrpdcbiAqIGNvZGUgZnJvbSBodHRwOi8vZXZhbncuZ2l0aHViLmlvL2xpZ2h0Z2wuanMvZG9jcy9tYXRyaXguaHRtbFxuICovXG5cbnZhciBNYXRyaXggPSBmdW5jdGlvbihhLCBiLCBjLCBkLCB0eCwgdHkpe1xuICAgIHRoaXMuYSA9IGEgIT0gdW5kZWZpbmVkID8gYSA6IDE7XG4gICAgdGhpcy5iID0gYiAhPSB1bmRlZmluZWQgPyBiIDogMDtcbiAgICB0aGlzLmMgPSBjICE9IHVuZGVmaW5lZCA/IGMgOiAwO1xuICAgIHRoaXMuZCA9IGQgIT0gdW5kZWZpbmVkID8gZCA6IDE7XG4gICAgdGhpcy50eCA9IHR4ICE9IHVuZGVmaW5lZCA/IHR4IDogMDtcbiAgICB0aGlzLnR5ID0gdHkgIT0gdW5kZWZpbmVkID8gdHkgOiAwO1xufTtcblxuTWF0cml4LnByb3RvdHlwZSA9IHtcbiAgICBjb25jYXQgOiBmdW5jdGlvbihtdHgpe1xuICAgICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG5cbiAgICAgICAgdGhpcy5hID0gYSAqIG10eC5hICsgdGhpcy5iICogbXR4LmM7XG4gICAgICAgIHRoaXMuYiA9IGEgKiBtdHguYiArIHRoaXMuYiAqIG10eC5kO1xuICAgICAgICB0aGlzLmMgPSBjICogbXR4LmEgKyB0aGlzLmQgKiBtdHguYztcbiAgICAgICAgdGhpcy5kID0gYyAqIG10eC5iICsgdGhpcy5kICogbXR4LmQ7XG4gICAgICAgIHRoaXMudHggPSB0eCAqIG10eC5hICsgdGhpcy50eSAqIG10eC5jICsgbXR4LnR4O1xuICAgICAgICB0aGlzLnR5ID0gdHggKiBtdHguYiArIHRoaXMudHkgKiBtdHguZCArIG10eC50eTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25jYXRUcmFuc2Zvcm0gOiBmdW5jdGlvbih4LCB5LCBzY2FsZVgsIHNjYWxlWSwgcm90YXRpb24pe1xuICAgICAgICB2YXIgY29zID0gMTtcbiAgICAgICAgdmFyIHNpbiA9IDA7XG4gICAgICAgIGlmKHJvdGF0aW9uJTM2MCl7XG4gICAgICAgICAgICB2YXIgciA9IHJvdGF0aW9uICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgIGNvcyA9IE1hdGguY29zKHIpO1xuICAgICAgICAgICAgc2luID0gTWF0aC5zaW4ocik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmNhdChuZXcgTWF0cml4KGNvcypzY2FsZVgsIHNpbipzY2FsZVgsIC1zaW4qc2NhbGVZLCBjb3Mqc2NhbGVZLCB4LCB5KSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcm90YXRlIDogZnVuY3Rpb24oYW5nbGUpe1xuICAgICAgICAvL+ebruWJjeW3sue7j+aPkOS+m+WvuemhuuaXtumSiOmAhuaXtumSiOS4pOS4quaWueWQkeaXi+i9rOeahOaUr+aMgVxuICAgICAgICB2YXIgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICB2YXIgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIHR4ID0gdGhpcy50eDtcblxuICAgICAgICBpZiAoYW5nbGU+MCl7XG4gICAgICAgICAgICB0aGlzLmEgPSBhICogY29zIC0gdGhpcy5iICogc2luO1xuICAgICAgICAgICAgdGhpcy5iID0gYSAqIHNpbiArIHRoaXMuYiAqIGNvcztcbiAgICAgICAgICAgIHRoaXMuYyA9IGMgKiBjb3MgLSB0aGlzLmQgKiBzaW47XG4gICAgICAgICAgICB0aGlzLmQgPSBjICogc2luICsgdGhpcy5kICogY29zO1xuICAgICAgICAgICAgdGhpcy50eCA9IHR4ICogY29zIC0gdGhpcy50eSAqIHNpbjtcbiAgICAgICAgICAgIHRoaXMudHkgPSB0eCAqIHNpbiArIHRoaXMudHkgKiBjb3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgc3QgPSBNYXRoLnNpbihNYXRoLmFicyhhbmdsZSkpO1xuICAgICAgICAgICAgdmFyIGN0ID0gTWF0aC5jb3MoTWF0aC5hYnMoYW5nbGUpKTtcblxuICAgICAgICAgICAgdGhpcy5hID0gYSpjdCArIHRoaXMuYipzdDtcbiAgICAgICAgICAgIHRoaXMuYiA9IC1hKnN0ICsgdGhpcy5iKmN0O1xuICAgICAgICAgICAgdGhpcy5jID0gYypjdCArIHRoaXMuZCpzdDtcbiAgICAgICAgICAgIHRoaXMuZCA9IC1jKnN0ICsgY3QqdGhpcy5kO1xuICAgICAgICAgICAgdGhpcy50eCA9IGN0KnR4ICsgc3QqdGhpcy50eTtcbiAgICAgICAgICAgIHRoaXMudHkgPSBjdCp0aGlzLnR5IC0gc3QqdHg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzY2FsZSA6IGZ1bmN0aW9uKHN4LCBzeSl7XG4gICAgICAgIHRoaXMuYSAqPSBzeDtcbiAgICAgICAgdGhpcy5kICo9IHN5O1xuICAgICAgICB0aGlzLnR4ICo9IHN4O1xuICAgICAgICB0aGlzLnR5ICo9IHN5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRyYW5zbGF0ZSA6IGZ1bmN0aW9uKGR4LCBkeSl7XG4gICAgICAgIHRoaXMudHggKz0gZHg7XG4gICAgICAgIHRoaXMudHkgKz0gZHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaWRlbnRpdHkgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL+WIneWni+WMllxuICAgICAgICB0aGlzLmEgPSB0aGlzLmQgPSAxO1xuICAgICAgICB0aGlzLmIgPSB0aGlzLmMgPSB0aGlzLnR4ID0gdGhpcy50eSA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW52ZXJ0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy/pgIblkJHnn6npmLVcbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIHZhciBiID0gdGhpcy5iO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIGQgPSB0aGlzLmQ7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG4gICAgICAgIHZhciBpID0gYSAqIGQgLSBiICogYztcblxuICAgICAgICB0aGlzLmEgPSBkIC8gaTtcbiAgICAgICAgdGhpcy5iID0gLWIgLyBpO1xuICAgICAgICB0aGlzLmMgPSAtYyAvIGk7XG4gICAgICAgIHRoaXMuZCA9IGEgLyBpO1xuICAgICAgICB0aGlzLnR4ID0gKGMgKiB0aGlzLnR5IC0gZCAqIHR4KSAvIGk7XG4gICAgICAgIHRoaXMudHkgPSAtKGEgKiB0aGlzLnR5IC0gYiAqIHR4KSAvIGk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xvbmUgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCh0aGlzLmEsIHRoaXMuYiwgdGhpcy5jLCB0aGlzLmQsIHRoaXMudHgsIHRoaXMudHkpO1xuICAgIH0sXG4gICAgdG9BcnJheSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBbIHRoaXMuYSAsIHRoaXMuYiAsIHRoaXMuYyAsIHRoaXMuZCAsIHRoaXMudHggLCB0aGlzLnR5IF07XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDnn6npmLXlt6bkuZjlkJHph49cbiAgICAgKi9cbiAgICBtdWxWZWN0b3IgOiBmdW5jdGlvbih2KSB7XG4gICAgICAgIHZhciBhYSA9IHRoaXMuYSwgYWMgPSB0aGlzLmMsIGF0eCA9IHRoaXMudHg7XG4gICAgICAgIHZhciBhYiA9IHRoaXMuYiwgYWQgPSB0aGlzLmQsIGF0eSA9IHRoaXMudHk7XG5cbiAgICAgICAgdmFyIG91dCA9IFswLDBdO1xuICAgICAgICBvdXRbMF0gPSB2WzBdICogYWEgKyB2WzFdICogYWMgKyBhdHg7XG4gICAgICAgIG91dFsxXSA9IHZbMF0gKiBhYiArIHZbMV0gKiBhZCArIGF0eTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0gICAgXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hdHJpeDtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaVsOWtpiDnsbtcbiAqXG4gKiovXG5cblxuXG52YXIgX2NhY2hlID0ge1xuICAgIHNpbiA6IHt9LCAgICAgLy9zaW7nvJPlrZhcbiAgICBjb3MgOiB7fSAgICAgIC8vY29z57yT5a2YXG59O1xudmFyIF9yYWRpYW5zID0gTWF0aC5QSSAvIDE4MDtcblxuLyoqXG4gKiBAcGFyYW0gYW5nbGUg5byn5bqm77yI6KeS5bqm77yJ5Y+C5pWwXG4gKiBAcGFyYW0gaXNEZWdyZWVzIGFuZ2xl5Y+C5pWw5piv5ZCm5Li66KeS5bqm6K6h566X77yM6buY6K6k5Li6ZmFsc2XvvIxhbmdsZeS4uuS7peW8p+W6puiuoemHj+eahOinkuW6plxuICovXG5mdW5jdGlvbiBzaW4oYW5nbGUsIGlzRGVncmVlcykge1xuICAgIGFuZ2xlID0gKGlzRGVncmVlcyA/IGFuZ2xlICogX3JhZGlhbnMgOiBhbmdsZSkudG9GaXhlZCg0KTtcbiAgICBpZih0eXBlb2YgX2NhY2hlLnNpblthbmdsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgX2NhY2hlLnNpblthbmdsZV0gPSBNYXRoLnNpbihhbmdsZSk7XG4gICAgfVxuICAgIHJldHVybiBfY2FjaGUuc2luW2FuZ2xlXTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gcmFkaWFucyDlvKfluqblj4LmlbBcbiAqL1xuZnVuY3Rpb24gY29zKGFuZ2xlLCBpc0RlZ3JlZXMpIHtcbiAgICBhbmdsZSA9IChpc0RlZ3JlZXMgPyBhbmdsZSAqIF9yYWRpYW5zIDogYW5nbGUpLnRvRml4ZWQoNCk7XG4gICAgaWYodHlwZW9mIF9jYWNoZS5jb3NbYW5nbGVdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9jYWNoZS5jb3NbYW5nbGVdID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gX2NhY2hlLmNvc1thbmdsZV07XG59XG5cbi8qKlxuICog6KeS5bqm6L2s5byn5bqmXG4gKiBAcGFyYW0ge09iamVjdH0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG9SYWRpYW4oYW5nbGUpIHtcbiAgICByZXR1cm4gYW5nbGUgKiBfcmFkaWFucztcbn1cblxuLyoqXG4gKiDlvKfluqbovazop5LluqZcbiAqIEBwYXJhbSB7T2JqZWN0fSBhbmdsZVxuICovXG5mdW5jdGlvbiByYWRpYW5Ub0RlZ3JlZShhbmdsZSkge1xuICAgIHJldHVybiBhbmdsZSAvIF9yYWRpYW5zO1xufVxuXG4vKlxuICog5qCh6aqM6KeS5bqm5YiwMzYw5bqm5YaFXG4gKiBAcGFyYW0ge2FuZ2xlfSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gZGVncmVlVG8zNjAoIGFuZ2xlICkge1xuICAgIHZhciByZUFuZyA9ICgzNjAgKyAgYW5nbGUgICUgMzYwKSAlIDM2MDsvL01hdGguYWJzKDM2MCArIE1hdGguY2VpbCggYW5nbGUgKSAlIDM2MCkgJSAzNjA7XG4gICAgaWYoIHJlQW5nID09IDAgJiYgYW5nbGUgIT09IDAgKXtcbiAgICAgICAgcmVBbmcgPSAzNjBcbiAgICB9XG4gICAgcmV0dXJuIHJlQW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgUEkgIDogTWF0aC5QSSAgLFxuICAgIHNpbiA6IHNpbiAgICAgICxcbiAgICBjb3MgOiBjb3MgICAgICAsXG4gICAgZGVncmVlVG9SYWRpYW4gOiBkZWdyZWVUb1JhZGlhbixcbiAgICByYWRpYW5Ub0RlZ3JlZSA6IHJhZGlhblRvRGVncmVlLFxuICAgIGRlZ3JlZVRvMzYwICAgIDogZGVncmVlVG8zNjAgICBcbn07XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKiDngrnlh7vmo4DmtYsg57G7XG4gKiAqL1xuaW1wb3J0IG15TWF0aCBmcm9tIFwiLi9NYXRoXCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOWMheWQq+WIpOaWrVxuICogc2hhcGUgOiDlm77lvaJcbiAqIHggOiDmqKrlnZDmoIdcbiAqIHkgOiDnurXlnZDmoIdcbiAqL1xuZnVuY3Rpb24gaXNJbnNpZGUoc2hhcGUsIHBvaW50KSB7XG4gICAgdmFyIHggPSBwb2ludC54O1xuICAgIHZhciB5ID0gcG9pbnQueTtcbiAgICBpZiAoIXNoYXBlIHx8ICFzaGFwZS50eXBlKSB7XG4gICAgICAgIC8vIOaXoOWPguaVsOaIluS4jeaUr+aMgeexu+Wei1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvL+aVsOWtpui/kOeul++8jOS4u+imgeaYr2xpbmXvvIxicm9rZW5MaW5lXG4gICAgcmV0dXJuIF9wb2ludEluU2hhcGUoc2hhcGUsIHgsIHkpO1xufTtcblxuZnVuY3Rpb24gX3BvaW50SW5TaGFwZShzaGFwZSwgeCwgeSkge1xuICAgIC8vIOWcqOefqeW9ouWGheWImemDqOWIhuWbvuW9oumcgOimgei/m+S4gOatpeWIpOaWrVxuICAgIHN3aXRjaCAoc2hhcGUudHlwZSkge1xuICAgICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVMaW5lKHNoYXBlLmNvbnRleHQsIHgsIHkpO1xuICAgICAgICBjYXNlICdicm9rZW5saW5lJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVCcm9rZW5MaW5lKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAncmVjdCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdlbGxpcHNlJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNQb2ludEluRWxpcHNlKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAnc2VjdG9yJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVTZWN0b3Ioc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdwYXRoJzpcbiAgICAgICAgY2FzZSAnZHJvcGxldCc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlUGF0aChzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICBjYXNlICdpc29nb24nOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcihzaGFwZSwgeCwgeSk7XG4gICAgICAgICAgICAvL3JldHVybiBfaXNJbnNpZGVQb2x5Z29uX0Nyb3NzaW5nTnVtYmVyKHNoYXBlLCB4LCB5KTtcbiAgICB9XG59O1xuLyoqXG4gKiAhaXNJbnNpZGVcbiAqL1xuZnVuY3Rpb24gaXNPdXRzaWRlKHNoYXBlLCB4LCB5KSB7XG4gICAgcmV0dXJuICFpc0luc2lkZShzaGFwZSwgeCwgeSk7XG59O1xuXG4vKipcbiAqIOe6v+auteWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVMaW5lKGNvbnRleHQsIHgsIHkpIHtcbiAgICB2YXIgeDAgPSBjb250ZXh0LnhTdGFydDtcbiAgICB2YXIgeTAgPSBjb250ZXh0LnlTdGFydDtcbiAgICB2YXIgeDEgPSBjb250ZXh0LnhFbmQ7XG4gICAgdmFyIHkxID0gY29udGV4dC55RW5kO1xuICAgIHZhciBfbCA9IE1hdGgubWF4KGNvbnRleHQubGluZVdpZHRoICwgMyk7XG4gICAgdmFyIF9hID0gMDtcbiAgICB2YXIgX2IgPSB4MDtcblxuICAgIGlmKFxuICAgICAgICAoeSA+IHkwICsgX2wgJiYgeSA+IHkxICsgX2wpIFxuICAgICAgICB8fCAoeSA8IHkwIC0gX2wgJiYgeSA8IHkxIC0gX2wpIFxuICAgICAgICB8fCAoeCA+IHgwICsgX2wgJiYgeCA+IHgxICsgX2wpIFxuICAgICAgICB8fCAoeCA8IHgwIC0gX2wgJiYgeCA8IHgxIC0gX2wpIFxuICAgICl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoeDAgIT09IHgxKSB7XG4gICAgICAgIF9hID0gKHkwIC0geTEpIC8gKHgwIC0geDEpO1xuICAgICAgICBfYiA9ICh4MCAqIHkxIC0geDEgKiB5MCkgLyAoeDAgLSB4MSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHggLSB4MCkgPD0gX2wgLyAyO1xuICAgIH1cblxuICAgIHZhciBfcyA9IChfYSAqIHggLSB5ICsgX2IpICogKF9hICogeCAtIHkgKyBfYikgLyAoX2EgKiBfYSArIDEpO1xuICAgIHJldHVybiBfcyA8PSBfbCAvIDIgKiBfbCAvIDI7XG59O1xuXG5mdW5jdGlvbiBfaXNJbnNpZGVCcm9rZW5MaW5lKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcbiAgICB2YXIgbGluZUFyZWE7XG4gICAgdmFyIGluc2lkZUNhdGNoID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwb2ludExpc3QubGVuZ3RoIC0gMTsgaSA8IGw7IGkrKykge1xuICAgICAgICBsaW5lQXJlYSA9IHtcbiAgICAgICAgICAgIHhTdGFydDogcG9pbnRMaXN0W2ldWzBdLFxuICAgICAgICAgICAgeVN0YXJ0OiBwb2ludExpc3RbaV1bMV0sXG4gICAgICAgICAgICB4RW5kOiBwb2ludExpc3RbaSArIDFdWzBdLFxuICAgICAgICAgICAgeUVuZDogcG9pbnRMaXN0W2kgKyAxXVsxXSxcbiAgICAgICAgICAgIGxpbmVXaWR0aDogY29udGV4dC5saW5lV2lkdGhcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFfaXNJbnNpZGVSZWN0YW5nbGUoe1xuICAgICAgICAgICAgICAgICAgICB4OiBNYXRoLm1pbihsaW5lQXJlYS54U3RhcnQsIGxpbmVBcmVhLnhFbmQpIC0gbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB5OiBNYXRoLm1pbihsaW5lQXJlYS55U3RhcnQsIGxpbmVBcmVhLnlFbmQpIC0gbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogTWF0aC5hYnMobGluZUFyZWEueFN0YXJ0IC0gbGluZUFyZWEueEVuZCkgKyBsaW5lQXJlYS5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMobGluZUFyZWEueVN0YXJ0IC0gbGluZUFyZWEueUVuZCkgKyBsaW5lQXJlYS5saW5lV2lkdGhcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHgsIHlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgIC8vIOS4jeWcqOefqeW9ouWMuuWGhei3s+i/h1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5zaWRlQ2F0Y2ggPSBfaXNJbnNpZGVMaW5lKGxpbmVBcmVhLCB4LCB5KTtcbiAgICAgICAgaWYgKGluc2lkZUNhdGNoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zaWRlQ2F0Y2g7XG59O1xuXG5cbi8qKlxuICog55+p5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZVJlY3RhbmdsZShzaGFwZSwgeCwgeSkge1xuICAgIGlmICh4ID49IHNoYXBlLnggJiYgeCA8PSAoc2hhcGUueCArIHNoYXBlLndpZHRoKSAmJiB5ID49IHNoYXBlLnkgJiYgeSA8PSAoc2hhcGUueSArIHNoYXBlLmhlaWdodCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICog5ZyG5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZUNpcmNsZShzaGFwZSwgeCwgeSwgcikge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICAhciAmJiAociA9IGNvbnRleHQucik7XG4gICAgcis9Y29udGV4dC5saW5lV2lkdGg7XG4gICAgcmV0dXJuICh4ICogeCArIHkgKiB5KSA8IHIgKiByO1xufTtcblxuLyoqXG4gKiDmiYflvaLljIXlkKvliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlU2VjdG9yKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0XG4gICAgaWYgKCFfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHkpIHx8IChjb250ZXh0LnIwID4gMCAmJiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHksIGNvbnRleHQucjApKSkge1xuICAgICAgICAvLyDlpKflnIblpJbmiJbogIXlsI/lnIblhoXnm7TmjqVmYWxzZVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8g5Yik5pat5aS56KeSXG4gICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7IC8vIOi1t+Wni+inkuW6plswLDM2MClcbiAgICAgICAgdmFyIGVuZEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuZW5kQW5nbGUpOyAvLyDnu5PmnZ/op5LluqYoMCwzNjBdXG5cbiAgICAgICAgLy/orqHnrpfor6XngrnmiYDlnKjnmoTop5LluqZcbiAgICAgICAgdmFyIGFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKChNYXRoLmF0YW4yKHksIHgpIC8gTWF0aC5QSSAqIDE4MCkgJSAzNjApO1xuXG4gICAgICAgIHZhciByZWdJbiA9IHRydWU7IC8v5aaC5p6c5Zyoc3RhcnTlkoxlbmTnmoTmlbDlgLzkuK3vvIxlbmTlpKfkuo5zdGFydOiAjOS4lOaYr+mhuuaXtumSiOWImXJlZ0lu5Li6dHJ1ZVxuICAgICAgICBpZiAoKHN0YXJ0QW5nbGUgPiBlbmRBbmdsZSAmJiAhY29udGV4dC5jbG9ja3dpc2UpIHx8IChzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgY29udGV4dC5jbG9ja3dpc2UpKSB7XG4gICAgICAgICAgICByZWdJbiA9IGZhbHNlOyAvL291dFxuICAgICAgICB9XG4gICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXG4gICAgICAgIHZhciByZWdBbmdsZSA9IFtcbiAgICAgICAgICAgIE1hdGgubWluKHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKSxcbiAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxuICAgICAgICBdO1xuXG4gICAgICAgIHZhciBpbkFuZ2xlUmVnID0gYW5nbGUgPiByZWdBbmdsZVswXSAmJiBhbmdsZSA8IHJlZ0FuZ2xlWzFdO1xuICAgICAgICByZXR1cm4gKGluQW5nbGVSZWcgJiYgcmVnSW4pIHx8ICghaW5BbmdsZVJlZyAmJiAhcmVnSW4pO1xuICAgIH1cbn07XG5cbi8qXG4gKuakreWchuWMheWQq+WIpOaWrVxuICogKi9cbmZ1bmN0aW9uIF9pc1BvaW50SW5FbGlwc2Uoc2hhcGUsIHgsIHkpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQ7XG4gICAgdmFyIGNlbnRlciA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgIH07XG4gICAgLy945Y2K5b6EXG4gICAgdmFyIFhSYWRpdXMgPSBjb250ZXh0LmhyO1xuICAgIHZhciBZUmFkaXVzID0gY29udGV4dC52cjtcblxuICAgIHZhciBwID0ge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgfTtcblxuICAgIHZhciBpUmVzO1xuXG4gICAgcC54IC09IGNlbnRlci54O1xuICAgIHAueSAtPSBjZW50ZXIueTtcblxuICAgIHAueCAqPSBwLng7XG4gICAgcC55ICo9IHAueTtcblxuICAgIFhSYWRpdXMgKj0gWFJhZGl1cztcbiAgICBZUmFkaXVzICo9IFlSYWRpdXM7XG5cbiAgICBpUmVzID0gWVJhZGl1cyAqIHAueCArIFhSYWRpdXMgKiBwLnkgLSBYUmFkaXVzICogWVJhZGl1cztcblxuICAgIHJldHVybiAoaVJlcyA8IDApO1xufTtcblxuLyoqXG4gKiDlpJrovrnlvaLljIXlkKvliKTmlq0gTm9uemVybyBXaW5kaW5nIE51bWJlciBSdWxlXG4gKi9cblxuZnVuY3Rpb24gX2lzSW5zaWRlUG9seWdvbl9XaW5kaW5nTnVtYmVyKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0ID8gc2hhcGUuY29udGV4dCA6IHNoYXBlO1xuICAgIHZhciBwb2x5ID0gXy5jbG9uZShjb250ZXh0LnBvaW50TGlzdCk7IC8vcG9seSDlpJrovrnlvaLpobbngrnvvIzmlbDnu4TmiJDlkZjnmoTmoLzlvI/lkIwgcFxuICAgIHBvbHkucHVzaChwb2x5WzBdKTsgLy/orrDlvpfopoHpl63lkIhcbiAgICB2YXIgd24gPSAwO1xuICAgIGZvciAodmFyIHNoaWZ0UCwgc2hpZnQgPSBwb2x5WzBdWzFdID4geSwgaSA9IDE7IGkgPCBwb2x5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8v5YWI5YGa57q/55qE5qOA5rWL77yM5aaC5p6c5piv5Zyo5Lik54K555qE57q/5LiK77yM5bCx6IKv5a6a5piv5Zyo6K6k5Li65Zyo5Zu+5b2i5LiKXG4gICAgICAgIHZhciBpbkxpbmUgPSBfaXNJbnNpZGVMaW5lKHtcbiAgICAgICAgICAgIHhTdGFydCA6IHBvbHlbaS0xXVswXSxcbiAgICAgICAgICAgIHlTdGFydCA6IHBvbHlbaS0xXVsxXSxcbiAgICAgICAgICAgIHhFbmQgICA6IHBvbHlbaV1bMF0sXG4gICAgICAgICAgICB5RW5kICAgOiBwb2x5W2ldWzFdLFxuICAgICAgICAgICAgbGluZVdpZHRoIDogKGNvbnRleHQubGluZVdpZHRoIHx8IDEpXG4gICAgICAgIH0gLCB4ICwgeSk7XG4gICAgICAgIGlmICggaW5MaW5lICl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/lpoLmnpzmnIlmaWxsU3R5bGUg77yMIOmCo+S5iOiCr+WumumcgOimgeWBmumdoueahOajgOa1i1xuICAgICAgICBpZiAoY29udGV4dC5maWxsU3R5bGUpIHtcbiAgICAgICAgICAgIHNoaWZ0UCA9IHNoaWZ0O1xuICAgICAgICAgICAgc2hpZnQgPSBwb2x5W2ldWzFdID4geTtcbiAgICAgICAgICAgIGlmIChzaGlmdFAgIT0gc2hpZnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbiA9IChzaGlmdFAgPyAxIDogMCkgLSAoc2hpZnQgPyAxIDogMCk7XG4gICAgICAgICAgICAgICAgaWYgKG4gKiAoKHBvbHlbaSAtIDFdWzBdIC0geCkgKiAocG9seVtpXVsxXSAtIHkpIC0gKHBvbHlbaSAtIDFdWzFdIC0geSkgKiAocG9seVtpXVswXSAtIHgpKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgd24gKz0gbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gd247XG59O1xuXG4vKipcbiAqIOi3r+W+hOWMheWQq+WIpOaWre+8jOS+nei1luWkmui+ueW9ouWIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVQYXRoKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcbiAgICB2YXIgaW5zaWRlQ2F0Y2ggPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaW5zaWRlQ2F0Y2ggPSBfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIoe1xuICAgICAgICAgICAgcG9pbnRMaXN0OiBwb2ludExpc3RbaV0sXG4gICAgICAgICAgICBsaW5lV2lkdGg6IGNvbnRleHQubGluZVdpZHRoLFxuICAgICAgICAgICAgZmlsbFN0eWxlOiBjb250ZXh0LmZpbGxTdHlsZVxuICAgICAgICB9LCB4LCB5KTtcbiAgICAgICAgaWYgKGluc2lkZUNhdGNoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zaWRlQ2F0Y2g7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaXNJbnNpZGU6IGlzSW5zaWRlLFxuICAgIGlzT3V0c2lkZTogaXNPdXRzaWRlXG59OyIsImltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICogVHdlZW4uanMgLSBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL2dyYXBocy9jb250cmlidXRvcnMgZm9yIHRoZSBmdWxsIGxpc3Qgb2YgY29udHJpYnV0b3JzLlxuICogVGhhbmsgeW91IGFsbCwgeW91J3JlIGF3ZXNvbWUhXG4gKi9cblxuIHZhciBUV0VFTiA9IFRXRUVOIHx8IChmdW5jdGlvbiAoKSB7XG5cbiBcdHZhciBfdHdlZW5zID0gW107XG5cbiBcdHJldHVybiB7XG5cbiBcdFx0Z2V0QWxsOiBmdW5jdGlvbiAoKSB7XG5cbiBcdFx0XHRyZXR1cm4gX3R3ZWVucztcblxuIFx0XHR9LFxuXG4gXHRcdHJlbW92ZUFsbDogZnVuY3Rpb24gKCkge1xuXG4gXHRcdFx0X3R3ZWVucyA9IFtdO1xuXG4gXHRcdH0sXG5cbiBcdFx0YWRkOiBmdW5jdGlvbiAodHdlZW4pIHtcblxuIFx0XHRcdF90d2VlbnMucHVzaCh0d2Vlbik7XG5cbiBcdFx0fSxcblxuIFx0XHRyZW1vdmU6IGZ1bmN0aW9uICh0d2Vlbikge1xuXG5cdFx0XHR2YXIgaSA9IF8uaW5kZXhPZiggX3R3ZWVucyAsIHR3ZWVuICk7Ly9fdHdlZW5zLmluZGV4T2YodHdlZW4pO1xuXG5cdFx0XHRpZiAoaSAhPT0gLTEpIHtcblx0XHRcdFx0X3R3ZWVucy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0dXBkYXRlOiBmdW5jdGlvbiAodGltZSwgcHJlc2VydmUpIHtcblxuXHRcdFx0aWYgKF90d2VlbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHR0aW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6IFRXRUVOLm5vdygpO1xuXG5cdFx0XHR3aGlsZSAoaSA8IF90d2VlbnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICAvKiBvbGQgXG5cdFx0XHRcdGlmIChfdHdlZW5zW2ldLnVwZGF0ZSh0aW1lKSB8fCBwcmVzZXJ2ZSkge1xuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQqL1xuXG4gICAgICAgICAgICAgICAgLy9uZXcgY29kZVxuICAgICAgICAgICAgICAgIC8vaW4gcmVhbCB3b3JsZCwgdHdlZW4udXBkYXRlIGhhcyBjaGFuY2UgdG8gcmVtb3ZlIGl0c2VsZiwgc28gd2UgaGF2ZSB0byBoYW5kbGUgdGhpcyBzaXR1YXRpb24uXG4gICAgICAgICAgICAgICAgLy9pbiBjZXJ0YWluIGNhc2VzLCBvblVwZGF0ZUNhbGxiYWNrIHdpbGwgcmVtb3ZlIGluc3RhbmNlcyBpbiBfdHdlZW5zLCB3aGljaCBtYWtlIF90d2VlbnMuc3BsaWNlKGksIDEpIGZhaWxcbiAgICAgICAgICAgICAgICAvL0BsaXRhby5sdEBhbGliYWJhLWluYy5jb21cbiAgICAgICAgICAgICAgICB2YXIgX3QgPSBfdHdlZW5zW2ldO1xuICAgICAgICAgICAgICAgIHZhciBfdXBkYXRlUmVzID0gX3QudXBkYXRlKHRpbWUpO1xuXG4gICAgICAgICAgICAgICAgaWYoICFfdHdlZW5zW2ldICl7XG4gICAgICAgICAgICAgICAgXHRicmVhaztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmICggX3QgPT09IF90d2VlbnNbaV0gKSB7XG4gICAgICAgICAgICAgICAgXHRpZiAoIF91cGRhdGVSZXMgfHwgcHJlc2VydmUgKSB7XG4gICAgICAgICAgICAgICAgXHRcdGkrKztcbiAgICAgICAgICAgICAgICBcdH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIFx0fVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfTtcblxufSkoKTtcblxuXG4vLyBJbmNsdWRlIGEgcGVyZm9ybWFuY2Uubm93IHBvbHlmaWxsLlxuLy8gSW4gbm9kZS5qcywgdXNlIHByb2Nlc3MuaHJ0aW1lLlxuaWYgKHR5cGVvZiAod2luZG93KSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIChwcm9jZXNzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0VFdFRU4ubm93ID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciB0aW1lID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuXHRcdC8vIENvbnZlcnQgW3NlY29uZHMsIG5hbm9zZWNvbmRzXSB0byBtaWxsaXNlY29uZHMuXG5cdFx0cmV0dXJuIHRpbWVbMF0gKiAxMDAwICsgdGltZVsxXSAvIDEwMDAwMDA7XG5cdH07XG59XG4vLyBJbiBhIGJyb3dzZXIsIHVzZSB3aW5kb3cucGVyZm9ybWFuY2Uubm93IGlmIGl0IGlzIGF2YWlsYWJsZS5cbmVsc2UgaWYgKHR5cGVvZiAod2luZG93KSAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0d2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiZcblx0d2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XG5cdC8vIFRoaXMgbXVzdCBiZSBib3VuZCwgYmVjYXVzZSBkaXJlY3RseSBhc3NpZ25pbmcgdGhpcyBmdW5jdGlvblxuXHQvLyBsZWFkcyB0byBhbiBpbnZvY2F0aW9uIGV4Y2VwdGlvbiBpbiBDaHJvbWUuXG5cdFRXRUVOLm5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cuYmluZCh3aW5kb3cucGVyZm9ybWFuY2UpO1xufVxuLy8gVXNlIERhdGUubm93IGlmIGl0IGlzIGF2YWlsYWJsZS5cbmVsc2UgaWYgKERhdGUubm93ICE9PSB1bmRlZmluZWQpIHtcblx0VFdFRU4ubm93ID0gRGF0ZS5ub3c7XG59XG4vLyBPdGhlcndpc2UsIHVzZSAnbmV3IERhdGUoKS5nZXRUaW1lKCknLlxuZWxzZSB7XG5cdFRXRUVOLm5vdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdH07XG59XG5cblxuVFdFRU4uVHdlZW4gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cblx0dmFyIF9vYmplY3QgPSBvYmplY3Q7XG5cdHZhciBfdmFsdWVzU3RhcnQgPSB7fTtcblx0dmFyIF92YWx1ZXNFbmQgPSB7fTtcblx0dmFyIF92YWx1ZXNTdGFydFJlcGVhdCA9IHt9O1xuXHR2YXIgX2R1cmF0aW9uID0gMTAwMDtcblx0dmFyIF9yZXBlYXQgPSAwO1xuXHR2YXIgX3JlcGVhdERlbGF5VGltZTtcblx0dmFyIF95b3lvID0gZmFsc2U7XG5cdHZhciBfaXNQbGF5aW5nID0gZmFsc2U7XG5cdHZhciBfcmV2ZXJzZWQgPSBmYWxzZTtcblx0dmFyIF9kZWxheVRpbWUgPSAwO1xuXHR2YXIgX3N0YXJ0VGltZSA9IG51bGw7XG5cdHZhciBfZWFzaW5nRnVuY3Rpb24gPSBUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmU7XG5cdHZhciBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5MaW5lYXI7XG5cdHZhciBfY2hhaW5lZFR3ZWVucyA9IFtdO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblx0dmFyIF9vblVwZGF0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RvcENhbGxiYWNrID0gbnVsbDtcblxuXHR0aGlzLnRvID0gZnVuY3Rpb24gKHByb3BlcnRpZXMsIGR1cmF0aW9uKSB7XG5cblx0XHRfdmFsdWVzRW5kID0gcHJvcGVydGllcztcblxuXHRcdGlmIChkdXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfZHVyYXRpb24gPSBkdXJhdGlvbjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0VFdFRU4uYWRkKHRoaXMpO1xuXG5cdFx0X2lzUGxheWluZyA9IHRydWU7XG5cblx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblxuXHRcdF9zdGFydFRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogVFdFRU4ubm93KCk7XG5cdFx0X3N0YXJ0VGltZSArPSBfZGVsYXlUaW1lO1xuXG5cdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCkge1xuXG5cdFx0XHQvLyBDaGVjayBpZiBhbiBBcnJheSB3YXMgcHJvdmlkZWQgYXMgcHJvcGVydHkgdmFsdWVcblx0XHRcdGlmIChfdmFsdWVzRW5kW3Byb3BlcnR5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0aWYgKF92YWx1ZXNFbmRbcHJvcGVydHldLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ3JlYXRlIGEgbG9jYWwgY29weSBvZiB0aGUgQXJyYXkgd2l0aCB0aGUgc3RhcnQgdmFsdWUgYXQgdGhlIGZyb250XG5cdFx0XHRcdF92YWx1ZXNFbmRbcHJvcGVydHldID0gW19vYmplY3RbcHJvcGVydHldXS5jb25jYXQoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGB0bygpYCBzcGVjaWZpZXMgYSBwcm9wZXJ0eSB0aGF0IGRvZXNuJ3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3QsXG5cdFx0XHQvLyB3ZSBzaG91bGQgbm90IHNldCB0aGF0IHByb3BlcnR5IGluIHRoZSBvYmplY3Rcblx0XHRcdGlmIChfb2JqZWN0W3Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTYXZlIHRoZSBzdGFydGluZyB2YWx1ZS5cblx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPSBfb2JqZWN0W3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKChfdmFsdWVzU3RhcnRbcHJvcGVydHldIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuXHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldICo9IDEuMDsgLy8gRW5zdXJlcyB3ZSdyZSB1c2luZyBudW1iZXJzLCBub3Qgc3RyaW5nc1xuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIV9pc1BsYXlpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFRXRUVOLnJlbW92ZSh0aGlzKTtcblx0XHRfaXNQbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiAoX29uU3RvcENhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25TdG9wQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHR9XG5cblx0XHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmVuZCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHRoaXMudXBkYXRlKF9zdGFydFRpbWUgKyBfZHVyYXRpb24pO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdG9wKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5kZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9kZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdCA9IGZ1bmN0aW9uICh0aW1lcykge1xuXG5cdFx0X3JlcGVhdCA9IHRpbWVzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXREZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9yZXBlYXREZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnlveW8gPSBmdW5jdGlvbiAoeW95bykge1xuXG5cdFx0X3lveW8gPSB5b3lvO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblxuXHR0aGlzLmVhc2luZyA9IGZ1bmN0aW9uIChlYXNpbmcpIHtcblxuXHRcdF9lYXNpbmdGdW5jdGlvbiA9IGVhc2luZztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuaW50ZXJwb2xhdGlvbiA9IGZ1bmN0aW9uIChpbnRlcnBvbGF0aW9uKSB7XG5cblx0XHRfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gaW50ZXJwb2xhdGlvbjtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfY2hhaW5lZFR3ZWVucyA9IGFyZ3VtZW50cztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdGFydCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uU3RhcnRDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25Db21wbGV0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0b3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblN0b3BDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0dmFyIHByb3BlcnR5O1xuXHRcdHZhciBlbGFwc2VkO1xuXHRcdHZhciB2YWx1ZTtcblxuXHRcdGlmICh0aW1lIDwgX3N0YXJ0VGltZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9PT0gZmFsc2UpIHtcblxuXHRcdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdFx0X29uU3RhcnRDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGVsYXBzZWQgPSAodGltZSAtIF9zdGFydFRpbWUpIC8gX2R1cmF0aW9uO1xuXHRcdGVsYXBzZWQgPSBlbGFwc2VkID4gMSA/IDEgOiBlbGFwc2VkO1xuXG5cdFx0dmFsdWUgPSBfZWFzaW5nRnVuY3Rpb24oZWxhcHNlZCk7XG5cblx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNFbmQpIHtcblxuXHRcdFx0Ly8gRG9uJ3QgdXBkYXRlIHByb3BlcnRpZXMgdGhhdCBkbyBub3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3Rcblx0XHRcdGlmIChfdmFsdWVzU3RhcnRbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzdGFydCA9IF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gfHwgMDtcblx0XHRcdHZhciBlbmQgPSBfdmFsdWVzRW5kW3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKGVuZCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0X29iamVjdFtwcm9wZXJ0eV0gPSBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uKGVuZCwgdmFsdWUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFBhcnNlcyByZWxhdGl2ZSBlbmQgdmFsdWVzIHdpdGggc3RhcnQgYXMgYmFzZSAoZS5nLjogKzEwLCAtMylcblx0XHRcdFx0aWYgKHR5cGVvZiAoZW5kKSA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdGlmIChlbmQuY2hhckF0KDApID09PSAnKycgfHwgZW5kLmNoYXJBdCgwKSA9PT0gJy0nKSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBzdGFydCArIHBhcnNlRmxvYXQoZW5kKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZW5kID0gcGFyc2VGbG9hdChlbmQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFByb3RlY3QgYWdhaW5zdCBub24gbnVtZXJpYyBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRpZiAodHlwZW9mIChlbmQpID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdF9vYmplY3RbcHJvcGVydHldID0gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYgKF9vblVwZGF0ZUNhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25VcGRhdGVDYWxsYmFjay5jYWxsKF9vYmplY3QsIHZhbHVlKTtcblx0XHR9XG5cblx0XHRpZiAoZWxhcHNlZCA9PT0gMSkge1xuXG5cdFx0XHRpZiAoX3JlcGVhdCA+IDApIHtcblxuXHRcdFx0XHRpZiAoaXNGaW5pdGUoX3JlcGVhdCkpIHtcblx0XHRcdFx0XHRfcmVwZWF0LS07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWFzc2lnbiBzdGFydGluZyB2YWx1ZXMsIHJlc3RhcnQgYnkgbWFraW5nIHN0YXJ0VGltZSA9IG5vd1xuXHRcdFx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNTdGFydFJlcGVhdCkge1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gKyBwYXJzZUZsb2F0KF92YWx1ZXNFbmRbcHJvcGVydHldKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldO1xuXG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc0VuZFtwcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHRfdmFsdWVzRW5kW3Byb3BlcnR5XSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0X3JldmVyc2VkID0gIV9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfcmVwZWF0RGVsYXlUaW1lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9yZXBlYXREZWxheVRpbWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfZGVsYXlUaW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKF9vbkNvbXBsZXRlQ2FsbGJhY2sgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRcdFx0Ly8gTWFrZSB0aGUgY2hhaW5lZCB0d2VlbnMgc3RhcnQgZXhhY3RseSBhdCB0aGUgdGltZSB0aGV5IHNob3VsZCxcblx0XHRcdFx0XHQvLyBldmVuIGlmIHRoZSBgdXBkYXRlKClgIG1ldGhvZCB3YXMgY2FsbGVkIHdheSBwYXN0IHRoZSBkdXJhdGlvbiBvZiB0aGUgdHdlZW5cblx0XHRcdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdGFydChfc3RhcnRUaW1lICsgX2R1cmF0aW9uKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fTtcblxufTtcblxuXG5UV0VFTi5FYXNpbmcgPSB7XG5cblx0TGluZWFyOiB7XG5cblx0XHROb25lOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gaztcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YWRyYXRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogKDIgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtIDAuNSAqICgtLWsgKiAoayAtIDIpIC0gMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDdWJpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogayArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhcnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSAoLS1rICogayAqIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrIC0gMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWludGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICogayAqIGsgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFNpbnVzb2lkYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguY29zKGsgKiBNYXRoLlBJIC8gMik7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zaW4oayAqIE1hdGguUEkgLyAyKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGspKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEV4cG9uZW50aWFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coMTAyNCwgayAtIDEpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KDIsIC0gMTAgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoLSBNYXRoLnBvdygyLCAtIDEwICogKGsgLSAxKSkgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdENpcmN1bGFyOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoMSAtIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtICgtLWsgKiBrKSk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0gMC41ICogKE1hdGguc3FydCgxIC0gayAqIGspIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAoayAtPSAyKSAqIGspICsgMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFbGFzdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLU1hdGgucG93KDIsIDEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBNYXRoLnBvdygyLCAtMTAgKiBrKSAqIE1hdGguc2luKChrIC0gMC4xKSAqIDUgKiBNYXRoLlBJKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0ayAqPSAyO1xuXG5cdFx0XHRpZiAoayA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiBNYXRoLnBvdygyLCAxMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogTWF0aC5wb3coMiwgLTEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSkgKyAxO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0QmFjazoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogKChzICsgMSkgKiBrIC0gcyk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTggKiAxLjUyNTtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogKGsgKiBrICogKChzICsgMSkgKiBrIC0gcykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqICgocyArIDEpICogayArIHMpICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCb3VuY2U6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KDEgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgKDEgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogayAqIGs7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMiAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMS41IC8gMi43NSkpICogayArIDAuNzU7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMi41IC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgyLjI1IC8gMi43NSkpICogayArIDAuOTM3NTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMi42MjUgLyAyLjc1KSkgKiBrICsgMC45ODQzNzU7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgMC41KSB7XG5cdFx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLkluKGsgKiAyKSAqIDAuNTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KGsgKiAyIC0gMSkgKiAwLjUgKyAwLjU7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5UV0VFTi5JbnRlcnBvbGF0aW9uID0ge1xuXG5cdExpbmVhcjogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuTGluZWFyO1xuXG5cdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRyZXR1cm4gZm4odlswXSwgdlsxXSwgZik7XG5cdFx0fVxuXG5cdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRyZXR1cm4gZm4odlttXSwgdlttIC0gMV0sIG0gLSBmKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZm4odltpXSwgdltpICsgMSA+IG0gPyBtIDogaSArIDFdLCBmIC0gaSk7XG5cblx0fSxcblxuXHRCZXppZXI6IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgYiA9IDA7XG5cdFx0dmFyIG4gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIHB3ID0gTWF0aC5wb3c7XG5cdFx0dmFyIGJuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5CZXJuc3RlaW47XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBuOyBpKyspIHtcblx0XHRcdGIgKz0gcHcoMSAtIGssIG4gLSBpKSAqIHB3KGssIGkpICogdltpXSAqIGJuKG4sIGkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBiO1xuXG5cdH0sXG5cblx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQ2F0bXVsbFJvbTtcblxuXHRcdGlmICh2WzBdID09PSB2W21dKSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRpID0gTWF0aC5mbG9vcihmID0gbSAqICgxICsgaykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm4odlsoaSAtIDEgKyBtKSAlIG1dLCB2W2ldLCB2WyhpICsgMSkgJSBtXSwgdlsoaSArIDIpICUgbV0sIGYgLSBpKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gdlswXSAtIChmbih2WzBdLCB2WzBdLCB2WzFdLCB2WzFdLCAtZikgLSB2WzBdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRcdHJldHVybiB2W21dIC0gKGZuKHZbbV0sIHZbbV0sIHZbbSAtIDFdLCB2W20gLSAxXSwgZiAtIG0pIC0gdlttXSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbih2W2kgPyBpIC0gMSA6IDBdLCB2W2ldLCB2W20gPCBpICsgMSA/IG0gOiBpICsgMV0sIHZbbSA8IGkgKyAyID8gbSA6IGkgKyAyXSwgZiAtIGkpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0VXRpbHM6IHtcblxuXHRcdExpbmVhcjogZnVuY3Rpb24gKHAwLCBwMSwgdCkge1xuXG5cdFx0XHRyZXR1cm4gKHAxIC0gcDApICogdCArIHAwO1xuXG5cdFx0fSxcblxuXHRcdEJlcm5zdGVpbjogZnVuY3Rpb24gKG4sIGkpIHtcblxuXHRcdFx0dmFyIGZjID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5GYWN0b3JpYWw7XG5cblx0XHRcdHJldHVybiBmYyhuKSAvIGZjKGkpIC8gZmMobiAtIGkpO1xuXG5cdFx0fSxcblxuXHRcdEZhY3RvcmlhbDogKGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0dmFyIGEgPSBbMV07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAobikge1xuXG5cdFx0XHRcdHZhciBzID0gMTtcblxuXHRcdFx0XHRpZiAoYVtuXSkge1xuXHRcdFx0XHRcdHJldHVybiBhW25dO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IG47IGkgPiAxOyBpLS0pIHtcblx0XHRcdFx0XHRzICo9IGk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhW25dID0gcztcblx0XHRcdFx0cmV0dXJuIHM7XG5cblx0XHRcdH07XG5cblx0XHR9KSgpLFxuXG5cdFx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHAwLCBwMSwgcDIsIHAzLCB0KSB7XG5cblx0XHRcdHZhciB2MCA9IChwMiAtIHAwKSAqIDAuNTtcblx0XHRcdHZhciB2MSA9IChwMyAtIHAxKSAqIDAuNTtcblx0XHRcdHZhciB0MiA9IHQgKiB0O1xuXHRcdFx0dmFyIHQzID0gdCAqIHQyO1xuXG5cdFx0XHRyZXR1cm4gKDIgKiBwMSAtIDIgKiBwMiArIHYwICsgdjEpICogdDMgKyAoLSAzICogcDEgKyAzICogcDIgLSAyICogdjAgLSB2MSkgKiB0MiArIHYwICogdCArIHAxO1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgVFdFRU47XG4iLCJpbXBvcnQgVHdlZW4gZnJvbSBcIi4vVHdlZW5cIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICog6K6+572uIEFuaW1hdGlvbkZyYW1lIGJlZ2luXG4gKi9cbnZhciBsYXN0VGltZSA9IDA7XG52YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG5mb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbn07XG5pZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG59O1xuaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG59O1xuXG4vL+euoeeQhuaJgOacieWbvuihqOeahOa4suafk+S7u+WKoVxudmFyIF90YXNrTGlzdCA9IFtdOyAvL1t7IGlkIDogdGFzazogfS4uLl1cbnZhciBfcmVxdWVzdEFpZCA9IG51bGw7XG5cbmZ1bmN0aW9uIGVuYWJsZWRBbmltYXRpb25GcmFtZSgpe1xuICAgIGlmICghX3JlcXVlc3RBaWQpIHtcbiAgICAgICAgX3JlcXVlc3RBaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZnJhbWVfX1wiICsgX3Rhc2tMaXN0Lmxlbmd0aCk7XG4gICAgICAgICAgICAvL2lmICggVHdlZW4uZ2V0QWxsKCkubGVuZ3RoICkge1xuICAgICAgICAgICAgVHdlZW4udXBkYXRlKCk7IC8vdHdlZW7oh6rlt7HkvJrlgZpsZW5ndGjliKTmlq1cbiAgICAgICAgICAgIC8vfTtcbiAgICAgICAgICAgIHZhciBjdXJyVGFza0xpc3QgPSBfdGFza0xpc3Q7XG4gICAgICAgICAgICBfdGFza0xpc3QgPSBbXTtcbiAgICAgICAgICAgIF9yZXF1ZXN0QWlkID0gbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChjdXJyVGFza0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGN1cnJUYXNrTGlzdC5zaGlmdCgpLnRhc2soKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIF9yZXF1ZXN0QWlkO1xufTsgXG5cbi8qXG4gKiBAcGFyYW0gdGFzayDopoHliqDlhaXliLDmuLLmn5PluKfpmJ/liJfkuK3nmoTku7vliqFcbiAqIEByZXN1bHQgZnJhbWVpZFxuICovXG5mdW5jdGlvbiByZWdpc3RGcmFtZSggJGZyYW1lICkge1xuICAgIGlmICghJGZyYW1lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9O1xuICAgIF90YXNrTGlzdC5wdXNoKCRmcmFtZSk7XG4gICAgcmV0dXJuIGVuYWJsZWRBbmltYXRpb25GcmFtZSgpO1xufTtcblxuLypcbiAqICBAcGFyYW0gdGFzayDopoHku47muLLmn5PluKfpmJ/liJfkuK3liKDpmaTnmoTku7vliqFcbiAqL1xuZnVuY3Rpb24gZGVzdHJveUZyYW1lKCAkZnJhbWUgKSB7XG4gICAgdmFyIGRfcmVzdWx0ID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBfdGFza0xpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChfdGFza0xpc3RbaV0uaWQgPT09ICRmcmFtZS5pZCkge1xuICAgICAgICAgICAgZF9yZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgX3Rhc2tMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGwtLTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGlmIChfdGFza0xpc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoX3JlcXVlc3RBaWQpO1xuICAgICAgICBfcmVxdWVzdEFpZCA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZF9yZXN1bHQ7XG59O1xuXG5cbi8qIFxuICogQHBhcmFtIG9wdCB7ZnJvbSAsIHRvICwgb25VcGRhdGUgLCBvbkNvbXBsZXRlICwgLi4uLi4ufVxuICogQHJlc3VsdCB0d2VlblxuICovXG5mdW5jdGlvbiByZWdpc3RUd2VlbihvcHRpb25zKSB7XG4gICAgdmFyIG9wdCA9IF8uZXh0ZW5kKHtcbiAgICAgICAgZnJvbTogbnVsbCxcbiAgICAgICAgdG86IG51bGwsXG4gICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgIG9uU3RvcDogZnVuY3Rpb24oKXt9LFxuICAgICAgICByZXBlYXQ6IDAsXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgICBlYXNpbmc6ICdMaW5lYXIuTm9uZScsXG4gICAgICAgIGRlc2M6ICcnIC8v5Yqo55S75o+P6L+w77yM5pa55L6/5p+l5om+YnVnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB2YXIgdHdlZW4gPSB7fTtcbiAgICB2YXIgdGlkID0gXCJ0d2Vlbl9cIiArIFV0aWxzLmdldFVJRCgpO1xuICAgIG9wdC5pZCAmJiAoIHRpZCA9IHRpZCtcIl9cIitvcHQuaWQgKTtcblxuICAgIGlmIChvcHQuZnJvbSAmJiBvcHQudG8pIHtcbiAgICAgICAgdHdlZW4gPSBuZXcgVHdlZW4uVHdlZW4oIG9wdC5mcm9tIClcbiAgICAgICAgLnRvKCBvcHQudG8sIG9wdC5kdXJhdGlvbiApXG4gICAgICAgIC5vblN0YXJ0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvcHQub25TdGFydC5hcHBseSggdGhpcyApXG4gICAgICAgIH0pXG4gICAgICAgIC5vblVwZGF0ZSggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG9wdC5vblVwZGF0ZS5hcHBseSggdGhpcyApO1xuICAgICAgICB9IClcbiAgICAgICAgLm9uQ29tcGxldGUoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVzdHJveUZyYW1lKHtcbiAgICAgICAgICAgICAgICBpZDogdGlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR3ZWVuLl9pc0NvbXBsZXRlZWQgPSB0cnVlO1xuICAgICAgICAgICAgb3B0Lm9uQ29tcGxldGUuYXBwbHkoIHRoaXMgLCBbdGhpc10gKTsgLy/miafooYznlKjmiLfnmoRjb25Db21wbGV0ZVxuICAgICAgICB9IClcbiAgICAgICAgLm9uU3RvcCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGRlc3Ryb3lGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0d2Vlbi5faXNTdG9wZWQgPSB0cnVlO1xuICAgICAgICAgICAgb3B0Lm9uU3RvcC5hcHBseSggdGhpcyAsIFt0aGlzXSApO1xuICAgICAgICB9IClcbiAgICAgICAgLnJlcGVhdCggb3B0LnJlcGVhdCApXG4gICAgICAgIC5kZWxheSggb3B0LmRlbGF5IClcbiAgICAgICAgLmVhc2luZyggVHdlZW4uRWFzaW5nW29wdC5lYXNpbmcuc3BsaXQoXCIuXCIpWzBdXVtvcHQuZWFzaW5nLnNwbGl0KFwiLlwiKVsxXV0gKVxuICAgICAgICBcbiAgICAgICAgdHdlZW4uaWQgPSB0aWQ7XG4gICAgICAgIHR3ZWVuLnN0YXJ0KCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcblxuICAgICAgICAgICAgaWYgKCB0d2Vlbi5faXNDb21wbGV0ZWVkIHx8IHR3ZWVuLl9pc1N0b3BlZCApIHtcbiAgICAgICAgICAgICAgICB0d2VlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlZ2lzdEZyYW1lKHtcbiAgICAgICAgICAgICAgICBpZDogdGlkLFxuICAgICAgICAgICAgICAgIHRhc2s6IGFuaW1hdGUsXG4gICAgICAgICAgICAgICAgZGVzYzogb3B0LmRlc2MsXG4gICAgICAgICAgICAgICAgdHdlZW46IHR3ZWVuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgYW5pbWF0ZSgpO1xuXG4gICAgfTtcbiAgICByZXR1cm4gdHdlZW47XG59O1xuLypcbiAqIEBwYXJhbSB0d2VlblxuICogQHJlc3VsdCB2b2lkKDApXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3lUd2Vlbih0d2VlbiAsIG1zZykge1xuICAgIHR3ZWVuLnN0b3AoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICByZWdpc3RGcmFtZTogcmVnaXN0RnJhbWUsXG4gICAgZGVzdHJveUZyYW1lOiBkZXN0cm95RnJhbWUsXG4gICAgcmVnaXN0VHdlZW46IHJlZ2lzdFR3ZWVuLFxuICAgIGRlc3Ryb3lUd2VlbjogZGVzdHJveVR3ZWVuXG59OyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOWxnuaAp+W3peWOgu+8jGll5LiL6Z2i55SoVkJT5o+Q5L6b5pSv5oyBXG4gKiDmnaXnu5nmlbTkuKrlvJXmk47mj5Dkvpvlv4Pot7PljIXnmoTop6blj5HmnLrliLZcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLy/lrprkuYnlsIHoo4Xlpb3nmoTlhbzlrrnlpKfpg6jliIbmtY/op4jlmajnmoRkZWZpbmVQcm9wZXJ0aWVzIOeahCDlsZ7mgKflt6XljoJcbnZhciB1bndhdGNoT25lID0ge1xuICAgIFwiJHNraXBBcnJheVwiIDogMCxcbiAgICBcIiR3YXRjaFwiICAgICA6IDEsXG4gICAgXCIkZmlyZVwiICAgICAgOiAyLC8v5Li76KaB5pivZ2V0IHNldCDmmL7mgKforr7nva7nmoQg6Kem5Y+RXG4gICAgXCIkbW9kZWxcIiAgICAgOiAzLFxuICAgIFwiJGFjY2Vzc29yXCIgIDogNCxcbiAgICBcIiRvd25lclwiICAgICA6IDUsXG4gICAgLy9cInBhdGhcIiAgICAgICA6IDYsIC8v6L+Z5Liq5bqU6K+l5piv5ZSv5LiA5LiA5Liq5LiN55Sod2F0Y2jnmoTkuI3luKYk55qE5oiQ5ZGY5LqG5ZCn77yM5Zug5Li65Zyw5Zu+562J55qEcGF0aOaYr+WcqOWkquWkp1xuICAgIFwiJHBhcmVudFwiICAgIDogNyAgLy/nlKjkuo7lu7rnq4vmlbDmja7nmoTlhbPns7vpk75cbn1cblxuZnVuY3Rpb24gT2JzZXJ2ZShzY29wZSwgbW9kZWwsIHdhdGNoTW9yZSkge1xuXG4gICAgdmFyIHN0b3BSZXBlYXRBc3NpZ249dHJ1ZTtcblxuICAgIHZhciBza2lwQXJyYXkgPSBzY29wZS4kc2tpcEFycmF5LCAvL+imgeW/veeVpeebkeaOp+eahOWxnuaAp+WQjeWIl+ihqFxuICAgICAgICBwbW9kZWwgPSB7fSwgLy/opoHov5Tlm57nmoTlr7nosaFcbiAgICAgICAgYWNjZXNzb3JlcyA9IHt9LCAvL+WGhemDqOeUqOS6jui9rOaNoueahOWvueixoVxuICAgICAgICBWQlB1YmxpY3MgPSBfLmtleXMoIHVud2F0Y2hPbmUgKTsgLy/nlKjkuo5JRTYtOFxuXG4gICAgICAgIG1vZGVsID0gbW9kZWwgfHwge307Ly/ov5nmmK9wbW9kZWzkuIrnmoQkbW9kZWzlsZ7mgKdcbiAgICAgICAgd2F0Y2hNb3JlID0gd2F0Y2hNb3JlIHx8IHt9Oy8v5LulJOW8gOWktOS9huimgeW8uuWItuebkeWQrOeahOWxnuaAp1xuICAgICAgICBza2lwQXJyYXkgPSBfLmlzQXJyYXkoc2tpcEFycmF5KSA/IHNraXBBcnJheS5jb25jYXQoVkJQdWJsaWNzKSA6IFZCUHVibGljcztcblxuICAgIGZ1bmN0aW9uIGxvb3AobmFtZSwgdmFsKSB7XG4gICAgICAgIGlmICggIXVud2F0Y2hPbmVbbmFtZV0gfHwgKHVud2F0Y2hPbmVbbmFtZV0gJiYgbmFtZS5jaGFyQXQoMCkgIT09IFwiJFwiKSApIHtcbiAgICAgICAgICAgIG1vZGVsW25hbWVdID0gdmFsXG4gICAgICAgIH07XG4gICAgICAgIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgdmFsO1xuICAgICAgICBpZiAodmFsdWVUeXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGlmKCF1bndhdGNoT25lW25hbWVdKXtcbiAgICAgICAgICAgICAgVkJQdWJsaWNzLnB1c2gobmFtZSkgLy/lh73mlbDml6DpnIDopoHovazmjaJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfLmluZGV4T2Yoc2tpcEFycmF5LG5hbWUpICE9PSAtMSB8fCAobmFtZS5jaGFyQXQoMCkgPT09IFwiJFwiICYmICF3YXRjaE1vcmVbbmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFZCUHVibGljcy5wdXNoKG5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWNjZXNzb3IgPSBmdW5jdGlvbihuZW8pIHsgLy/liJvlu7rnm5HmjqflsZ7mgKfmiJbmlbDnu4TvvIzoh6rlj5jph4/vvIznlLHnlKjmiLfop6blj5HlhbbmlLnlj5hcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhY2Nlc3Nvci52YWx1ZSwgcHJlVmFsdWUgPSB2YWx1ZSwgY29tcGxleFZhbHVlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8v5YaZ5pON5L2cXG4gICAgICAgICAgICAgICAgICAgIC8vc2V0IOeahCDlgLznmoQg57G75Z6LXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZW9UeXBlID0gdHlwZW9mIG5lbztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RvcFJlcGVhdEFzc2lnbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC8v6Zi75q2i6YeN5aSN6LWL5YC8XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBuZW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBuZW8gJiYgbmVvVHlwZSA9PT0gXCJvYmplY3RcIiAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKG5lbyBpbnN0YW5jZW9mIEFycmF5KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFuZW8uYWRkQ29sb3JTdG9wIC8vIG5lbyBpbnN0YW5jZW9mIENhbnZhc0dyYWRpZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5lby4kbW9kZWwgPyBuZW8gOiBPYnNlcnZlKG5lbyAsIG5lbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxleFZhbHVlID0gdmFsdWUuJG1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsvL+WmguaenOaYr+WFtuS7luaVsOaNruexu+Wei1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYoIG5lb1R5cGUgPT09IFwiYXJyYXlcIiApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHZhbHVlID0gXy5jbG9uZShuZW8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBuZW9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbFtuYW1lXSA9IGNvbXBsZXhWYWx1ZSA/IGNvbXBsZXhWYWx1ZSA6IHZhbHVlOy8v5pu05pawJG1vZGVs5Lit55qE5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBsZXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBtb2RlbC4kZmlyZSAmJiBwbW9kZWwuJGZpcmUobmFtZSwgdmFsdWUsIHByZVZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodmFsdWVUeXBlICE9IG5lb1R5cGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aaC5p6cc2V055qE5YC857G75Z6L5bey57uP5pS55Y+Y77yMXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgqPkuYjkuZ/opoHmiorlr7nlupTnmoR2YWx1ZVR5cGXkv67mlLnkuLrlr7nlupTnmoRuZW9UeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlID0gbmVvVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNXYXRjaE1vZGVsID0gcG1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miYDmnInnmoTotYvlgLzpg73opoHop6blj5F3YXRjaOeahOebkeWQrOS6i+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhcG1vZGVsLiR3YXRjaCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGhhc1dhdGNoTW9kZWwuJHBhcmVudCApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNXYXRjaE1vZGVsID0gaGFzV2F0Y2hNb2RlbC4kcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGhhc1dhdGNoTW9kZWwuJHdhdGNoICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNXYXRjaE1vZGVsLiR3YXRjaC5jYWxsKGhhc1dhdGNoTW9kZWwgLCBuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy/or7vmk43kvZxcbiAgICAgICAgICAgICAgICAgICAgLy/or7vnmoTml7blgJnvvIzlj5HnjrB2YWx1ZeaYr+S4qm9iau+8jOiAjOS4lOi/mOayoeaciWRlZmluZVByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI5bCx5Li05pe2ZGVmaW5lUHJvcGVydHnkuIDmrKFcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB2YWx1ZSAmJiAodmFsdWVUeXBlID09PSBcIm9iamVjdFwiKSBcbiAgICAgICAgICAgICAgICAgICAgICAgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSBcbiAgICAgICAgICAgICAgICAgICAgICAgJiYgIXZhbHVlLiRtb2RlbFxuICAgICAgICAgICAgICAgICAgICAgICAmJiAhdmFsdWUuYWRkQ29sb3JTdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W7uueri+WSjOeItuaVsOaNruiKgueCueeahOWFs+ezu1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuJHBhcmVudCA9IHBtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gT2JzZXJ2ZSh2YWx1ZSAsIHZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hY2Nlc3Nvci52YWx1ZSDph43mlrDlpI3liLbkuLpkZWZpbmVQcm9wZXJ0eei/h+WQjueahOWvueixoVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFjY2Vzc29yLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhY2Nlc3NvcmVzW25hbWVdID0ge1xuICAgICAgICAgICAgICAgIHNldDogYWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgZ2V0OiBhY2Nlc3NvcixcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGZvciAodmFyIGkgaW4gc2NvcGUpIHtcbiAgICAgICAgbG9vcChpLCBzY29wZVtpXSlcbiAgICB9O1xuXG4gICAgcG1vZGVsID0gZGVmaW5lUHJvcGVydGllcyhwbW9kZWwsIGFjY2Vzc29yZXMsIFZCUHVibGljcyk7Ly/nlJ/miJDkuIDkuKrnqbrnmoRWaWV3TW9kZWxcblxuICAgIF8uZm9yRWFjaChWQlB1YmxpY3MsZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBpZiAoc2NvcGVbbmFtZV0pIHsvL+WFiOS4uuWHveaVsOetieS4jeiiq+ebkeaOp+eahOWxnuaAp+i1i+WAvFxuICAgICAgICAgICAgaWYodHlwZW9mIHNjb3BlW25hbWVdID09IFwiZnVuY3Rpb25cIiApe1xuICAgICAgICAgICAgICAgcG1vZGVsW25hbWVdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgIHNjb3BlW25hbWVdLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIHBtb2RlbFtuYW1lXSA9IHNjb3BlW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBwbW9kZWwuJG1vZGVsID0gbW9kZWw7XG4gICAgcG1vZGVsLiRhY2Nlc3NvciA9IGFjY2Vzc29yZXM7XG5cbiAgICBwbW9kZWwuaGFzT3duUHJvcGVydHkgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIHBtb2RlbC4kbW9kZWxcbiAgICB9O1xuXG4gICAgc3RvcFJlcGVhdEFzc2lnbiA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHBtb2RlbFxufVxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG4gICAgLy/lpoLmnpzmtY/op4jlmajkuI3mlK/mjIFlY21hMjYydjXnmoRPYmplY3QuZGVmaW5lUHJvcGVydGllc+aIluiAheWtmOWcqEJVR++8jOavlOWmgklFOFxuICAgIC8v5qCH5YeG5rWP6KeI5Zmo5L2/55SoX19kZWZpbmVHZXR0ZXJfXywgX19kZWZpbmVTZXR0ZXJfX+WunueOsFxuICAgIHRyeSB7XG4gICAgICAgIGRlZmluZVByb3BlcnR5KHt9LCBcIl9cIiwge1xuICAgICAgICAgICAgdmFsdWU6IFwieFwiXG4gICAgICAgIH0pXG4gICAgICAgIHZhciBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChcIl9fZGVmaW5lR2V0dGVyX19cIiBpbiBPYmplY3QpIHtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wLCBkZXNjKSB7XG4gICAgICAgICAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBkZXNjLnZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgnZ2V0JyBpbiBkZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5fX2RlZmluZUdldHRlcl9fKHByb3AsIGRlc2MuZ2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJ3NldCcgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmouX19kZWZpbmVTZXR0ZXJfXyhwcm9wLCBkZXNjLnNldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihvYmosIGRlc2NzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkZXNjcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3MuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzY3NbcHJvcF0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbi8vSUU2LTjkvb/nlKhWQlNjcmlwdOexu+eahHNldCBnZXTor63lj6Xlrp7njrBcbmlmICghZGVmaW5lUHJvcGVydGllcyAmJiB3aW5kb3cuVkJBcnJheSkge1xuICAgIHdpbmRvdy5leGVjU2NyaXB0KFtcbiAgICAgICAgICAgIFwiRnVuY3Rpb24gcGFyc2VWQihjb2RlKVwiLFxuICAgICAgICAgICAgXCJcXHRFeGVjdXRlR2xvYmFsKGNvZGUpXCIsXG4gICAgICAgICAgICBcIkVuZCBGdW5jdGlvblwiXG4gICAgICAgICAgICBdLmpvaW4oXCJcXG5cIiksIFwiVkJTY3JpcHRcIik7XG5cbiAgICBmdW5jdGlvbiBWQk1lZGlhdG9yKGRlc2NyaXB0aW9uLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZm4gPSBkZXNjcmlwdGlvbltuYW1lXSAmJiBkZXNjcmlwdGlvbltuYW1lXS5zZXQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBmbih2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKHB1YmxpY3MsIGRlc2NyaXB0aW9uLCBhcnJheSkge1xuICAgICAgICBwdWJsaWNzID0gYXJyYXkuc2xpY2UoMCk7XG4gICAgICAgIHB1YmxpY3MucHVzaChcImhhc093blByb3BlcnR5XCIpO1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJWQkNsYXNzXCIgKyBzZXRUaW1lb3V0KFwiMVwiKSwgb3duZXIgPSB7fSwgYnVmZmVyID0gW107XG4gICAgICAgIGJ1ZmZlci5wdXNoKFxuICAgICAgICAgICAgICAgIFwiQ2xhc3MgXCIgKyBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgXCJcXHRQcml2YXRlIFtfX2RhdGFfX10sIFtfX3Byb3h5X19dXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgRGVmYXVsdCBGdW5jdGlvbiBbX19jb25zdF9fXShkLCBwKVwiLFxuICAgICAgICAgICAgICAgIFwiXFx0XFx0U2V0IFtfX2RhdGFfX10gPSBkOiBzZXQgW19fcHJveHlfX10gPSBwXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRcXHRTZXQgW19fY29uc3RfX10gPSBNZVwiLCAvL+mTvuW8j+iwg+eUqFxuICAgICAgICAgICAgICAgIFwiXFx0RW5kIEZ1bmN0aW9uXCIpO1xuICAgICAgICBfLmZvckVhY2gocHVibGljcyxmdW5jdGlvbihuYW1lKSB7IC8v5re75Yqg5YWs5YWx5bGe5oCnLOWmguaenOatpOaXtuS4jeWKoOS7peWQjuWwseayoeacuuS8muS6hlxuICAgICAgICAgICAgaWYgKG93bmVyW25hbWVdICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgb3duZXJbbmFtZV0gPSB0cnVlIC8v5Zug5Li6VkJTY3JpcHTlr7nosaHkuI3og73lg49KU+mCo+agt+maj+aEj+WinuWIoOWxnuaAp1xuICAgICAgICAgICAgYnVmZmVyLnB1c2goXCJcXHRQdWJsaWMgW1wiICsgbmFtZSArIFwiXVwiKSAvL+S9oOWPr+S7pemihOWFiOaUvuWIsHNraXBBcnJheeS4rVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgb3duZXJbbmFtZV0gPSB0cnVlXG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+eUseS6juS4jeefpeWvueaWueS8muS8oOWFpeS7gOS5iCzlm6DmraRzZXQsIGxldOmDveeUqOS4ilxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgUHJvcGVydHkgTGV0IFtcIiArIG5hbWUgKyBcIl0odmFsKVwiLCAvL3NldHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRDYWxsIFtfX3Byb3h5X19dKFtfX2RhdGFfX10sIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIsIHZhbClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIFByb3BlcnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBQcm9wZXJ0eSBTZXQgW1wiICsgbmFtZSArIFwiXSh2YWwpXCIsIC8vc2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdENhbGwgW19fcHJveHlfX10oW19fZGF0YV9fXSwgXFxcIlwiICsgbmFtZSArIFwiXFxcIiwgdmFsKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgUHJvcGVydHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIFByb3BlcnR5IEdldCBbXCIgKyBuYW1lICsgXCJdXCIsIC8vZ2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdE9uIEVycm9yIFJlc3VtZSBOZXh0XCIsIC8v5b+F6aG75LyY5YWI5L2/55Soc2V06K+t5Y+lLOWQpuWImeWug+S8muivr+WwhuaVsOe7hOW9k+Wtl+espuS4sui/lOWbnlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRTZXRbXCIgKyBuYW1lICsgXCJdID0gW19fcHJveHlfX10oW19fZGF0YV9fXSxcXFwiXCIgKyBuYW1lICsgXCJcXFwiKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRJZiBFcnIuTnVtYmVyIDw+IDAgVGhlblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRbXCIgKyBuYW1lICsgXCJdID0gW19fcHJveHlfX10oW19fZGF0YV9fXSxcXFwiXCIgKyBuYW1lICsgXCJcXFwiKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgSWZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0T24gRXJyb3IgR290byAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBQcm9wZXJ0eVwiKVxuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5wdXNoKFwiRW5kIENsYXNzXCIpOyAvL+exu+WumuS5ieWujOavlVxuICAgICAgICBidWZmZXIucHVzaChcbiAgICAgICAgICAgICAgICBcIkZ1bmN0aW9uIFwiICsgY2xhc3NOYW1lICsgXCJGYWN0b3J5KGEsIGIpXCIsIC8v5Yib5bu65a6e5L6L5bm25Lyg5YWl5Lik5Liq5YWz6ZSu55qE5Y+C5pWwXG4gICAgICAgICAgICAgICAgXCJcXHREaW0gb1wiLFxuICAgICAgICAgICAgICAgIFwiXFx0U2V0IG8gPSAoTmV3IFwiICsgY2xhc3NOYW1lICsgXCIpKGEsIGIpXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRTZXQgXCIgKyBjbGFzc05hbWUgKyBcIkZhY3RvcnkgPSBvXCIsXG4gICAgICAgICAgICAgICAgXCJFbmQgRnVuY3Rpb25cIik7XG4gICAgICAgIHdpbmRvdy5wYXJzZVZCKGJ1ZmZlci5qb2luKFwiXFxyXFxuXCIpKTsvL+WFiOWIm+W7uuS4gOS4qlZC57G75bel5Y6CXG4gICAgICAgIHJldHVybiAgd2luZG93W2NsYXNzTmFtZSArIFwiRmFjdG9yeVwiXShkZXNjcmlwdGlvbiwgVkJNZWRpYXRvcik7Ly/lvpfliLDlhbbkuqflk4FcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBPYnNlcnZlO1xuXG4iLCJcbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gX19WRVJTSU9OX187XG5cbmV4cG9ydCBjb25zdCBQSV8yID0gTWF0aC5QSSAqIDI7XG5cbmV4cG9ydCBjb25zdCBSQURfVE9fREVHID0gMTgwIC8gTWF0aC5QSTtcblxuZXhwb3J0IGNvbnN0IERFR19UT19SQUQgPSBNYXRoLlBJIC8gMTgwO1xuXG5leHBvcnQgY29uc3QgUkVOREVSRVJfVFlQRSA9IHtcbiAgICBVTktOT1dOOiAgICAwLFxuICAgIFdFQkdMOiAgICAgIDEsXG4gICAgQ0FOVkFTOiAgICAgMixcbn07XG5cbmV4cG9ydCBjb25zdCBEUkFXX01PREVTID0ge1xuICAgIFBPSU5UUzogICAgICAgICAwLFxuICAgIExJTkVTOiAgICAgICAgICAxLFxuICAgIExJTkVfTE9PUDogICAgICAyLFxuICAgIExJTkVfU1RSSVA6ICAgICAzLFxuICAgIFRSSUFOR0xFUzogICAgICA0LFxuICAgIFRSSUFOR0xFX1NUUklQOiA1LFxuICAgIFRSSUFOR0xFX0ZBTjogICA2LFxufTtcblxuZXhwb3J0IGNvbnN0IFNIQVBFUyA9IHtcbiAgICBQT0xZOiAwLFxuICAgIFJFQ1Q6IDEsXG4gICAgQ0lSQzogMixcbiAgICBFTElQOiAzLFxuICAgIFJSRUM6IDQsXG59O1xuXG5leHBvcnQgY29uc3QgQ09OVEVYVF9ERUZBVUxUID0ge1xuICAgIHdpZHRoICAgICAgICAgOiAwLFxuICAgIGhlaWdodCAgICAgICAgOiAwLFxuICAgIHggICAgICAgICAgICAgOiAwLFxuICAgIHkgICAgICAgICAgICAgOiAwLFxuICAgIHNjYWxlWCAgICAgICAgOiAxLFxuICAgIHNjYWxlWSAgICAgICAgOiAxLFxuICAgIHNjYWxlT3JpZ2luICAgOiB7XG4gICAgICAgIHggOiAwLFxuICAgICAgICB5IDogMFxuICAgIH0sXG4gICAgcm90YXRpb24gICAgICA6IDAsXG4gICAgcm90YXRlT3JpZ2luICA6ICB7XG4gICAgICAgIHggOiAwLFxuICAgICAgICB5IDogMFxuICAgIH0sXG4gICAgdmlzaWJsZSAgICAgICA6IHRydWUsXG4gICAgY3Vyc29yICAgICAgICA6IFwiZGVmYXVsdFwiLFxuICAgIC8vY2FudmFzIGNvbnRleHQgMmQg55qEIOezu+e7n+agt+W8j+OAguebruWJjeWwseefpemBk+i/meS5iOWkmlxuICAgIGZpbGxTdHlsZSAgICAgOiBudWxsLC8vXCIjMDAwMDAwXCIsXG4gICAgbGluZUNhcCAgICAgICA6IG51bGwsXG4gICAgbGluZUpvaW4gICAgICA6IG51bGwsXG4gICAgbGluZVdpZHRoICAgICA6IG51bGwsXG4gICAgbWl0ZXJMaW1pdCAgICA6IG51bGwsXG4gICAgc2hhZG93Qmx1ciAgICA6IG51bGwsXG4gICAgc2hhZG93Q29sb3IgICA6IG51bGwsXG4gICAgc2hhZG93T2Zmc2V0WCA6IG51bGwsXG4gICAgc2hhZG93T2Zmc2V0WSA6IG51bGwsXG4gICAgc3Ryb2tlU3R5bGUgICA6IG51bGwsXG4gICAgZ2xvYmFsQWxwaGEgICA6IDEsXG4gICAgZm9udCAgICAgICAgICA6IG51bGwsXG4gICAgdGV4dEFsaWduICAgICA6IFwibGVmdFwiLFxuICAgIHRleHRCYXNlbGluZSAgOiBcInRvcFwiLCBcbiAgICBhcmNTY2FsZVhfICAgIDogbnVsbCxcbiAgICBhcmNTY2FsZVlfICAgIDogbnVsbCxcbiAgICBsaW5lU2NhbGVfICAgIDogbnVsbCxcbiAgICBnbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gOiBudWxsXG59O1xuXG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyBEaXNwbGF5TGlzdCDnmoQg546w5a6e5a+56LGh5Z+657G7XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbmltcG9ydCBNYXRyaXggZnJvbSBcIi4uL2dlb20vTWF0cml4XCI7XG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vUG9pbnRcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBIaXRUZXN0UG9pbnQgZnJvbSBcIi4uL2dlb20vSGl0VGVzdFBvaW50XCI7XG5pbXBvcnQgQW5pbWF0aW9uRnJhbWUgZnJvbSBcIi4uL2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZVwiO1xuaW1wb3J0IE9ic2VydmUgZnJvbSBcIi4uL3V0aWxzL29ic2VydmVcIjtcbmltcG9ydCB7Q09OVEVYVF9ERUZBVUxUfSBmcm9tIFwiLi4vY29uc3RcIlxuXG52YXIgRGlzcGxheU9iamVjdCA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgRGlzcGxheU9iamVjdC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy/lpoLmnpznlKjmiLfmsqHmnInkvKDlhaVjb250ZXh06K6+572u77yM5bCx6buY6K6k5Li656m655qE5a+56LGhXG4gICAgb3B0ICAgICAgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XG5cbiAgICAvL+iuvue9rum7mOiupOWxnuaAp1xuICAgIHNlbGYuaWQgID0gb3B0LmlkIHx8IG51bGw7XG5cbiAgICAvL+ebuOWvueeItue6p+WFg+e0oOeahOefqemYtVxuICAgIHNlbGYuX3RyYW5zZm9ybSAgICAgID0gbnVsbDtcblxuICAgIC8v5b+D6Lez5qyh5pWwXG4gICAgc2VsZi5faGVhcnRCZWF0TnVtICAgPSAwO1xuXG4gICAgLy/lhYPntKDlr7nlupTnmoRzdGFnZeWFg+e0oFxuICAgIHNlbGYuc3RhZ2UgICAgICAgICAgID0gbnVsbDtcblxuICAgIC8v5YWD57Sg55qE54i25YWD57SgXG4gICAgc2VsZi5wYXJlbnQgICAgICAgICAgPSBudWxsO1xuXG4gICAgc2VsZi5fZXZlbnRFbmFibGVkICAgPSBmYWxzZTsgICAvL+aYr+WQpuWTjeW6lOS6i+S7tuS6pOS6kizlnKjmt7vliqDkuobkuovku7bkvqblkKzlkI7kvJroh6rliqjorr7nva7kuLp0cnVlXG5cbiAgICBzZWxmLmRyYWdFbmFibGVkICAgICA9IHRydWUgOy8vXCJkcmFnRW5hYmxlZFwiIGluIG9wdCA/IG9wdC5kcmFnRW5hYmxlZCA6IGZhbHNlOyAgIC8v5piv5ZCm5ZCv55So5YWD57Sg55qE5ouW5ou9XG5cbiAgICBzZWxmLnh5VG9JbnQgICAgICAgICA9IFwieHlUb0ludFwiIGluIG9wdCA/IG9wdC54eVRvSW50IDogdHJ1ZTsgICAgLy/mmK/lkKblr7l4eeWdkOagh+e7n+S4gGludOWkhOeQhu+8jOm7mOiupOS4unRydWXvvIzkvYbmmK/mnInnmoTml7blgJnlj6/ku6XnlLHlpJbnlYznlKjmiLfmiYvliqjmjIflrprmmK/lkKbpnIDopoHorqHnrpfkuLppbnTvvIzlm6DkuLrmnInnmoTml7blgJnkuI3orqHnrpfmr5TovoPlpb3vvIzmr5TlpoLvvIzov5vluqblm77ooajkuK3vvIzlho1zZWN0b3LnmoTkuKTnq6/mt7vliqDkuKTkuKrlnIbmnaXlgZrlnIbop5LnmoTov5vluqbmnaHnmoTml7blgJnvvIzlnIZjaXJjbGXkuI3lgZppbnTorqHnrpfvvIzmiY3og73lkoxzZWN0b3Lmm7Tlpb3nmoTooZTmjqVcblxuICAgIHNlbGYubW92ZWluZyAgICAgICAgID0gZmFsc2U7IC8v5aaC5p6c5YWD57Sg5Zyo5pyA6L2o6YGT6L+Q5Yqo5Lit55qE5pe25YCZ77yM5pyA5aW95oqK6L+Z5Liq6K6+572u5Li6dHJ1Ze+8jOi/meagt+iDveS/neivgei9qOi/ueeahOS4neaQrOmhuua7ke+8jOWQpuWImeWboOS4unh5VG9JbnTnmoTljp/lm6DvvIzkvJrmnInot7Pot4NcblxuICAgIC8v5Yib5bu65aW9Y29udGV4dFxuICAgIHNlbGYuX2NyZWF0ZUNvbnRleHQoIG9wdCApO1xuXG4gICAgdmFyIFVJRCA9IFV0aWxzLmNyZWF0ZUlkKHNlbGYudHlwZSk7XG5cbiAgICAvL+WmguaenOayoeaciWlkIOWImSDmsr/nlKh1aWRcbiAgICBpZihzZWxmLmlkID09IG51bGwpe1xuICAgICAgICBzZWxmLmlkID0gVUlEIDtcbiAgICB9O1xuXG4gICAgc2VsZi5pbml0LmFwcGx5KHNlbGYgLCBhcmd1bWVudHMpO1xuXG4gICAgLy/miYDmnInlsZ7mgKflh4blpIflpb3kuoblkI7vvIzlhYjopoHorqHnrpfkuIDmrKF0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKeW+l+WIsF90YW5zZm9ybVxuICAgIHRoaXMuX3VwZGF0ZVRyYW5zZm9ybSgpO1xufTtcblxuXG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3QgLCBFdmVudERpc3BhdGNoZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7fSxcbiAgICBfY3JlYXRlQ29udGV4dCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+aJgOacieaYvuekuuWvueixoe+8jOmDveacieS4gOS4quexu+S8vGNhbnZhcy5jb250ZXh057G75Ly855qEIGNvbnRleHTlsZ7mgKdcbiAgICAgICAgLy/nlKjmnaXlrZjlj5bmlLnmmL7npLrlr7nosaHmiYDmnInlkozmmL7npLrmnInlhbPnmoTlsZ7mgKfvvIzlnZDmoIfvvIzmoLflvI/nrYnjgIJcbiAgICAgICAgLy/or6Xlr7nosaHkuLpDb2VyLk9ic2VydmUoKeW3peWOguWHveaVsOeUn+aIkFxuICAgICAgICBzZWxmLmNvbnRleHQgPSBudWxsO1xuXG4gICAgICAgIC8v5o+Q5L6b57uZQ29lci5PYnNlcnZlKCkg5p2lIOe7mSBzZWxmLmNvbnRleHQg6K6+572uIHByb3BlcnR5c1xuICAgICAgICAvL+i/memHjOS4jeiDveeUqF8uZXh0ZW5k77yMIOWboOS4uuimgeS/neivgV9jb250ZXh0QVRUUlPnmoTnuq/nsrnvvIzlj6ropobnm5bkuIvpnaLlt7LmnInnmoTlsZ7mgKdcbiAgICAgICAgdmFyIF9jb250ZXh0QVRUUlMgPSBVdGlscy5jb3B5MmNvbnRleHQoIF8uY2xvbmUoQ09OVEVYVF9ERUZBVUxUKSwgb3B0LmNvbnRleHQgLCB0cnVlICk7ICAgICAgICAgICAgXG5cbiAgICAgICAgLy/nhLblkI7nnIvnu6fmib/ogIXmmK/lkKbmnInmj5DkvptfY29udGV4dCDlr7nosaEg6ZyA6KaBIOaIkSBtZXJnZeWIsF9jb250ZXh0MkRfY29udGV4dOS4reWOu+eahFxuICAgICAgICBpZiAoc2VsZi5fY29udGV4dCkge1xuICAgICAgICAgICAgX2NvbnRleHRBVFRSUyA9IF8uZXh0ZW5kKHRydWUsIF9jb250ZXh0QVRUUlMsIHNlbGYuX2NvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/mnInkupvlvJXmk47lhoXpg6jorr7nva5jb250ZXh05bGe5oCn55qE5pe25YCZ5piv5LiN55So5LiK5oql5b+D6Lez55qE77yM5q+U5aaC5YGaaGl0VGVzdFBvaW5054Ot54K55qOA5rWL55qE5pe25YCZXG4gICAgICAgIHNlbGYuX25vdFdhdGNoID0gZmFsc2U7XG5cbiAgICAgICAgX2NvbnRleHRBVFRSUy4kb3duZXIgPSBzZWxmO1xuICAgICAgICBfY29udGV4dEFUVFJTLiR3YXRjaCA9IGZ1bmN0aW9uKG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlKXtcblxuICAgICAgICAgICAgLy/kuIvpnaLnmoTov5nkupvlsZ7mgKflj5jljJbvvIzpg73kvJrpnIDopoHph43mlrDnu4Tnu4fnn6npmLXlsZ7mgKcgX3RyYW5zZm9ybSBcbiAgICAgICAgICAgIHZhciB0cmFuc0Zvcm1Qcm9wcyA9IFsgXCJ4XCIgLCBcInlcIiAsIFwic2NhbGVYXCIgLCBcInNjYWxlWVwiICwgXCJyb3RhdGlvblwiICwgXCJzY2FsZU9yaWdpblwiICwgXCJyb3RhdGVPcmlnaW4sIGxpbmVXaWR0aFwiIF07XG5cbiAgICAgICAgICAgIGlmKCBfLmluZGV4T2YoIHRyYW5zRm9ybVByb3BzICwgbmFtZSApID49IDAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kb3duZXIuX3VwZGF0ZVRyYW5zZm9ybSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMuJG93bmVyLl9ub3RXYXRjaCApe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKCB0aGlzLiRvd25lci4kd2F0Y2ggKXtcbiAgICAgICAgICAgICAgICB0aGlzLiRvd25lci4kd2F0Y2goIG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLiRvd25lci5oZWFydEJlYXQoIHtcbiAgICAgICAgICAgICAgICBjb252ZXJ0VHlwZTpcImNvbnRleHRcIixcbiAgICAgICAgICAgICAgICBzaGFwZSAgICAgIDogdGhpcy4kb3duZXIsXG4gICAgICAgICAgICAgICAgbmFtZSAgICAgICA6IG5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWUgICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgICAgIHByZVZhbHVlICAgOiBwcmVWYWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfTtcblxuICAgICAgICAvL+aJp+ihjGluaXTkuYvliY3vvIzlupTor6XlsLHmoLnmja7lj4LmlbDvvIzmiopjb250ZXh057uE57uH5aW957q/XG4gICAgICAgIHNlbGYuY29udGV4dCA9IE9ic2VydmUoIF9jb250ZXh0QVRUUlMgKTtcbiAgICB9LFxuICAgIC8qIEBteXNlbGYg5piv5ZCm55Sf5oiQ6Ieq5bex55qE6ZWc5YOPIFxuICAgICAqIOWFi+mahuWPiOS4pOenje+8jOS4gOenjeaYr+mVnOWDj++8jOWPpuWkluS4gOenjeaYr+e7neWvueaEj+S5ieS4iumdoueahOaWsOS4quS9k1xuICAgICAqIOm7mOiupOS4uue7neWvueaEj+S5ieS4iumdoueahOaWsOS4quS9k++8jOaWsOWvueixoWlk5LiN6IO955u45ZCMXG4gICAgICog6ZWc5YOP5Z+65pys5LiK5piv5qGG5p625YaF6YOo5Zyo5a6e546wICDplZzlg4/nmoRpZOebuOWQjCDkuLvopoHnlKjmnaXmioroh6rlt7HnlLvliLDlj6blpJbnmoRzdGFnZemHjOmdou+8jOavlOWmglxuICAgICAqIG1vdXNlb3ZlcuWSjG1vdXNlb3V055qE5pe25YCZ6LCD55SoKi9cbiAgICBjbG9uZSA6IGZ1bmN0aW9uKCBteXNlbGYgKXtcbiAgICAgICAgdmFyIGNvbmYgICA9IHtcbiAgICAgICAgICAgIGlkICAgICAgOiB0aGlzLmlkLFxuICAgICAgICAgICAgY29udGV4dCA6IF8uY2xvbmUodGhpcy5jb250ZXh0LiRtb2RlbClcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbmV3T2JqO1xuICAgICAgICBpZiggdGhpcy50eXBlID09ICd0ZXh0JyApe1xuICAgICAgICAgICAgbmV3T2JqID0gbmV3IHRoaXMuY29uc3RydWN0b3IoIHRoaXMudGV4dCAsIGNvbmYgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld09iaiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKCBjb25mICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5jaGlsZHJlbiApe1xuICAgICAgICAgICAgbmV3T2JqLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbXlzZWxmKXtcbiAgICAgICAgICAgIG5ld09iai5pZCAgICAgICA9IFV0aWxzLmNyZWF0ZUlkKG5ld09iai50eXBlKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9LFxuICAgIGhlYXJ0QmVhdCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIC8vc3RhZ2XlrZjlnKjvvIzmiY3or7RzZWxm5Luj6KGo55qEZGlzcGxheeW3sue7j+iiq+a3u+WKoOWIsOS6hmRpc3BsYXlMaXN05Lit77yM57uY5Zu+5byV5pOO6ZyA6KaB55+l6YGT5YW25pS55Y+Y5ZCOXG4gICAgICAgIC8v55qE5bGe5oCn77yM5omA5Lul77yM6YCa55+l5Yiwc3RhZ2UuZGlzcGxheUF0dHJIYXNDaGFuZ2VcbiAgICAgICAgdmFyIHN0YWdlID0gdGhpcy5nZXRTdGFnZSgpO1xuICAgICAgICBpZiggc3RhZ2UgKXtcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0QmVhdE51bSArKztcbiAgICAgICAgICAgIHN0YWdlLmhlYXJ0QmVhdCAmJiBzdGFnZS5oZWFydEJlYXQoIG9wdCApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRDdXJyZW50V2lkdGggOiBmdW5jdGlvbigpe1xuICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLmNvbnRleHQud2lkdGggKiB0aGlzLmNvbnRleHQuc2NhbGVYKTtcbiAgICB9LFxuICAgIGdldEN1cnJlbnRIZWlnaHQgOiBmdW5jdGlvbigpe1xuICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLmNvbnRleHQuaGVpZ2h0ICogdGhpcy5jb250ZXh0LnNjYWxlWSk7XG4gICAgfSxcbiAgICBnZXRTdGFnZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLnN0YWdlICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBwID0gdGhpcztcbiAgICAgICAgaWYgKHAudHlwZSAhPSBcInN0YWdlXCIpe1xuICAgICAgICAgIHdoaWxlKHAucGFyZW50KSB7XG4gICAgICAgICAgICBwID0gcC5wYXJlbnQ7XG4gICAgICAgICAgICBpZiAocC50eXBlID09IFwic3RhZ2VcIil7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHAudHlwZSAhPT0gXCJzdGFnZVwiKSB7XG4gICAgICAgICAgICAvL+WmguaenOW+l+WIsOeahOmhtueCuWRpc3BsYXkg55qEdHlwZeS4jeaYr1N0YWdlLOS5n+WwseaYr+ivtOS4jeaYr3N0YWdl5YWD57SgXG4gICAgICAgICAgICAvL+mCo+S5iOWPquiDveivtOaYjui/meS4qnDmiYDku6PooajnmoTpobbnq69kaXNwbGF5IOi/mOayoeaciea3u+WKoOWIsGRpc3BsYXlMaXN05Lit77yM5Lmf5bCx5piv5rKh5pyJ5rKh5re75Yqg5YiwXG4gICAgICAgICAgICAvL3N0YWdl6Iie5Y+w55qEY2hpbGRlbumYn+WIl+S4re+8jOS4jeWcqOW8leaTjua4suafk+iMg+WbtOWGhVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgLy/kuIDnm7Tlm57muq/liLDpobblsYJvYmplY3TvvIwg5Y2z5pivc3RhZ2XvvIwgc3RhZ2XnmoRwYXJlbnTkuLpudWxsXG4gICAgICAgIHRoaXMuc3RhZ2UgPSBwO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9LFxuICAgIGxvY2FsVG9HbG9iYWwgOiBmdW5jdGlvbiggcG9pbnQgLCBjb250YWluZXIgKXtcbiAgICAgICAgIXBvaW50ICYmICggcG9pbnQgPSBuZXcgUG9pbnQoIDAgLCAwICkgKTtcbiAgICAgICAgdmFyIGNtID0gdGhpcy5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoIGNvbnRhaW5lciApO1xuXG4gICAgICAgIGlmIChjbSA9PSBudWxsKSByZXR1cm4gUG9pbnQoIDAgLCAwICk7XG4gICAgICAgIHZhciBtID0gbmV3IE1hdHJpeCgxLCAwLCAwLCAxLCBwb2ludC54ICwgcG9pbnQueSk7XG4gICAgICAgIG0uY29uY2F0KGNtKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggbS50eCAsIG0udHkgKTsgLy97eDptLnR4LCB5Om0udHl9O1xuICAgIH0sXG4gICAgZ2xvYmFsVG9Mb2NhbCA6IGZ1bmN0aW9uKCBwb2ludCAsIGNvbnRhaW5lcikge1xuICAgICAgICAhcG9pbnQgJiYgKCBwb2ludCA9IG5ldyBQb2ludCggMCAsIDAgKSApO1xuXG4gICAgICAgIGlmKCB0aGlzLnR5cGUgPT0gXCJzdGFnZVwiICl7XG4gICAgICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNtID0gdGhpcy5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoIGNvbnRhaW5lciApO1xuXG4gICAgICAgIGlmIChjbSA9PSBudWxsKSByZXR1cm4gbmV3IFBvaW50KCAwICwgMCApOyAvL3t4OjAsIHk6MH07XG4gICAgICAgIGNtLmludmVydCgpO1xuICAgICAgICB2YXIgbSA9IG5ldyBNYXRyaXgoMSwgMCwgMCwgMSwgcG9pbnQueCAsIHBvaW50LnkpO1xuICAgICAgICBtLmNvbmNhdChjbSk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIG0udHggLCBtLnR5ICk7IC8ve3g6bS50eCwgeTptLnR5fTtcbiAgICB9LFxuICAgIGxvY2FsVG9UYXJnZXQgOiBmdW5jdGlvbiggcG9pbnQgLCB0YXJnZXQpe1xuICAgICAgICB2YXIgcCA9IGxvY2FsVG9HbG9iYWwoIHBvaW50ICk7XG4gICAgICAgIHJldHVybiB0YXJnZXQuZ2xvYmFsVG9Mb2NhbCggcCApO1xuICAgIH0sXG4gICAgZ2V0Q29uY2F0ZW5hdGVkTWF0cml4IDogZnVuY3Rpb24oIGNvbnRhaW5lciApe1xuICAgICAgICB2YXIgY20gPSBuZXcgTWF0cml4KCk7XG4gICAgICAgIGZvciAodmFyIG8gPSB0aGlzOyBvICE9IG51bGw7IG8gPSBvLnBhcmVudCkge1xuICAgICAgICAgICAgY20uY29uY2F0KCBvLl90cmFuc2Zvcm0gKTtcbiAgICAgICAgICAgIGlmKCAhby5wYXJlbnQgfHwgKCBjb250YWluZXIgJiYgby5wYXJlbnQgJiYgby5wYXJlbnQgPT0gY29udGFpbmVyICkgfHwgKCBvLnBhcmVudCAmJiBvLnBhcmVudC50eXBlPT1cInN0YWdlXCIgKSApIHtcbiAgICAgICAgICAgIC8vaWYoIG8udHlwZSA9PSBcInN0YWdlXCIgfHwgKG8ucGFyZW50ICYmIGNvbnRhaW5lciAmJiBvLnBhcmVudC50eXBlID09IGNvbnRhaW5lci50eXBlICkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNtOy8vYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNtO1xuICAgIH0sXG4gICAgLypcbiAgICAgKuiuvue9ruWFg+e0oOeahOaYr+WQpuWTjeW6lOS6i+S7tuajgOa1i1xuICAgICAqQGJvb2wgIEJvb2xlYW4g57G75Z6LXG4gICAgICovXG4gICAgc2V0RXZlbnRFbmFibGUgOiBmdW5jdGlvbiggYm9vbCApe1xuICAgICAgICBpZihfLmlzQm9vbGVhbihib29sKSl7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBib29sXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLypcbiAgICAgKuafpeivouiHquW3seWcqHBhcmVudOeahOmYn+WIl+S4reeahOS9jee9rlxuICAgICAqL1xuICAgIGdldEluZGV4ICAgOiBmdW5jdGlvbigpe1xuICAgICAgICBpZighdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfLmluZGV4T2YodGhpcy5wYXJlbnQuY2hpbGRyZW4gLCB0aGlzKVxuICAgIH0sXG4gICAgLypcbiAgICAgKuWFg+e0oOWcqHrovbTmlrnlkJHlkJHkuIvnp7vliqhcbiAgICAgKkBudW0g56e75Yqo55qE5bGC57qnXG4gICAgICovXG4gICAgdG9CYWNrIDogZnVuY3Rpb24oIG51bSApe1xuICAgICAgICBpZighdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21JbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcbiAgICAgICAgdmFyIHRvSW5kZXggPSAwO1xuICAgICAgICBcbiAgICAgICAgaWYoXy5pc051bWJlciggbnVtICkpe1xuICAgICAgICAgIGlmKCBudW0gPT0gMCApe1xuICAgICAgICAgICAgIC8v5Y6f5Zyw5LiN5YqoXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdG9JbmRleCA9IGZyb21JbmRleCAtIG51bTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWUgPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoIGZyb21JbmRleCAsIDEgKVswXTtcbiAgICAgICAgaWYoIHRvSW5kZXggPCAwICl7XG4gICAgICAgICAgICB0b0luZGV4ID0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGRBdCggbWUgLCB0b0luZGV4ICk7XG4gICAgfSxcbiAgICAvKlxuICAgICAq5YWD57Sg5Zyoeui9tOaWueWQkeWQkeS4iuenu+WKqFxuICAgICAqQG51bSDnp7vliqjnmoTlsYLmlbDph48g6buY6K6k5Yiw6aG256uvXG4gICAgICovXG4gICAgdG9Gcm9udCA6IGZ1bmN0aW9uKCBudW0gKXtcbiAgICAgICAgaWYoIXRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcm9tSW5kZXggPSB0aGlzLmdldEluZGV4KCk7XG4gICAgICAgIHZhciBwY2wgPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIHZhciB0b0luZGV4ID0gcGNsO1xuICAgICAgICBcbiAgICAgICAgaWYoXy5pc051bWJlciggbnVtICkpe1xuICAgICAgICAgIGlmKCBudW0gPT0gMCApe1xuICAgICAgICAgICAgIC8v5Y6f5Zyw5LiN5YqoXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b0luZGV4ID0gZnJvbUluZGV4ICsgbnVtICsgMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWUgPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoIGZyb21JbmRleCAsIDEgKVswXTtcbiAgICAgICAgaWYodG9JbmRleCA+IHBjbCl7XG4gICAgICAgICAgICB0b0luZGV4ID0gcGNsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkQXQoIG1lICwgdG9JbmRleC0xICk7XG4gICAgfSxcbiAgICBfdXBkYXRlVHJhbnNmb3JtIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xuICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICAvL+aYr+WQpumcgOimgVRyYW5zZm9ybVxuICAgICAgICBpZihjb250ZXh0LnNjYWxlWCAhPT0gMSB8fCBjb250ZXh0LnNjYWxlWSAhPT0xICl7XG4gICAgICAgICAgICAvL+WmguaenOaciee8qeaUvlxuICAgICAgICAgICAgLy/nvKnmlL7nmoTljp/ngrnlnZDmoIdcbiAgICAgICAgICAgIHZhciBvcmlnaW4gPSBuZXcgUG9pbnQoY29udGV4dC5zY2FsZU9yaWdpbik7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggLW9yaWdpbi54ICwgLW9yaWdpbi55ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdHJhbnNmb3JtLnNjYWxlKCBjb250ZXh0LnNjYWxlWCAsIGNvbnRleHQuc2NhbGVZICk7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggb3JpZ2luLnggLCBvcmlnaW4ueSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcm90YXRpb24gPSBjb250ZXh0LnJvdGF0aW9uO1xuICAgICAgICBpZiggcm90YXRpb24gKXtcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJ5peL6L2sXG4gICAgICAgICAgICAvL+aXi+i9rOeahOWOn+eCueWdkOagh1xuICAgICAgICAgICAgdmFyIG9yaWdpbiA9IG5ldyBQb2ludChjb250ZXh0LnJvdGF0ZU9yaWdpbik7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggLW9yaWdpbi54ICwgLW9yaWdpbi55ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdHJhbnNmb3JtLnJvdGF0ZSggcm90YXRpb24gJSAzNjAgKiBNYXRoLlBJLzE4MCApO1xuICAgICAgICAgICAgaWYoIG9yaWdpbi54IHx8IG9yaWdpbi55ICl7XG4gICAgICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIG9yaWdpbi54ICwgb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvL+WmguaenOacieS9jeenu1xuICAgICAgICB2YXIgeCx5O1xuICAgICAgICBpZiggdGhpcy54eVRvSW50ICYmICF0aGlzLm1vdmVpbmcgKXtcbiAgICAgICAgICAgIC8v5b2T6L+Z5Liq5YWD57Sg5Zyo5YGa6L2o6L+56L+Q5Yqo55qE5pe25YCZ77yM5q+U5aaCZHJhZ++8jGFuaW1hdGlvbuWmguaenOWunuaXtueahOiwg+aVtOi/meS4qngg77yMIHlcbiAgICAgICAgICAgIC8v6YKj5LmI6K+l5YWD57Sg55qE6L2o6L+55Lya5pyJ6Lez6LeD55qE5oOF5Ya15Y+R55Sf44CC5omA5Lul5Yqg5Liq5p2h5Lu26L+H5ruk77yMXG4gICAgICAgICAgICB2YXIgeCA9IHBhcnNlSW50KCBjb250ZXh0LnggKTtcbiAgICAgICAgICAgIHZhciB5ID0gcGFyc2VJbnQoIGNvbnRleHQueSApO1xuXG4gICAgICAgICAgICBpZiggcGFyc2VJbnQoY29udGV4dC5saW5lV2lkdGggLCAxMCkgJSAyID09IDEgJiYgY29udGV4dC5zdHJva2VTdHlsZSApe1xuICAgICAgICAgICAgICAgIHggKz0gMC41O1xuICAgICAgICAgICAgICAgIHkgKz0gMC41O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IGNvbnRleHQueDtcbiAgICAgICAgICAgIHkgPSBjb250ZXh0Lnk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIHggIT0gMCB8fCB5ICE9IDAgKXtcbiAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCB4ICwgeSApO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl90cmFuc2Zvcm0gPSBfdHJhbnNmb3JtO1xuICAgICAgICByZXR1cm4gX3RyYW5zZm9ybTtcbiAgICB9LFxuICAgIC8v5pi+56S65a+56LGh55qE6YCJ5Y+W5qOA5rWL5aSE55CG5Ye95pWwXG4gICAgZ2V0Q2hpbGRJblBvaW50IDogZnVuY3Rpb24oIHBvaW50ICl7XG4gICAgICAgIHZhciByZXN1bHQ7IC8v5qOA5rWL55qE57uT5p6cXG5cbiAgICAgICAgLy/nrKzkuIDmraXvvIzlkKdnbG9i55qEcG9pbnTovazmjaLliLDlr7nlupTnmoRvYmrnmoTlsYLnuqflhoXnmoTlnZDmoIfns7vnu59cbiAgICAgICAgaWYoIHRoaXMudHlwZSAhPSBcInN0YWdlXCIgJiYgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQudHlwZSAhPSBcInN0YWdlXCIgKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXMucGFyZW50Lmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHggPSBwb2ludC54O1xuICAgICAgICB2YXIgeSA9IHBvaW50Lnk7XG5cbiAgICAgICAgLy/ov5nkuKrml7blgJnlpoLmnpzmnInlr7ljb250ZXh055qEc2V077yM5ZGK6K+J5byV5pOO5LiN6ZyA6KaBd2F0Y2jvvIzlm6DkuLrov5nkuKrmmK/lvJXmk47op6blj5HnmoTvvIzkuI3mmK/nlKjmiLdcbiAgICAgICAgLy/nlKjmiLdzZXQgY29udGV4dCDmiY3pnIDopoHop6blj5F3YXRjaFxuICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7XG4gICAgXG4gICAgICAgIC8v5a+56byg5qCH55qE5Z2Q5qCH5Lmf5YGa55u45ZCM55qE5Y+Y5o2iXG4gICAgICAgIGlmKCB0aGlzLl90cmFuc2Zvcm0gKXtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlTWF0cml4ID0gdGhpcy5fdHJhbnNmb3JtLmNsb25lKCkuaW52ZXJ0KCk7XG4gICAgICAgICAgICB2YXIgb3JpZ2luUG9zID0gW3gsIHldO1xuICAgICAgICAgICAgb3JpZ2luUG9zID0gaW52ZXJzZU1hdHJpeC5tdWxWZWN0b3IoIG9yaWdpblBvcyApO1xuXG4gICAgICAgICAgICB4ID0gb3JpZ2luUG9zWzBdO1xuICAgICAgICAgICAgeSA9IG9yaWdpblBvc1sxXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3JlY3QgPSB0aGlzLl9yZWN0ID0gdGhpcy5nZXRSZWN0KHRoaXMuY29udGV4dCk7XG5cbiAgICAgICAgaWYoIV9yZWN0KXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQud2lkdGggJiYgISFfcmVjdC53aWR0aCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoID0gX3JlY3Qud2lkdGg7XG4gICAgICAgIH07XG4gICAgICAgIGlmKCAhdGhpcy5jb250ZXh0LmhlaWdodCAmJiAhIV9yZWN0LmhlaWdodCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IF9yZWN0LmhlaWdodDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIV9yZWN0LndpZHRoIHx8ICFfcmVjdC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/mraPlvI/lvIDlp4vnrKzkuIDmraXnmoTnn6nlvaLojIPlm7TliKTmlq1cbiAgICAgICAgaWYgKCB4ICAgID49IF9yZWN0LnhcbiAgICAgICAgICAgICYmICB4IDw9IChfcmVjdC54ICsgX3JlY3Qud2lkdGgpXG4gICAgICAgICAgICAmJiAgeSA+PSBfcmVjdC55XG4gICAgICAgICAgICAmJiAgeSA8PSAoX3JlY3QueSArIF9yZWN0LmhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgIC8v6YKj5LmI5bCx5Zyo6L+Z5Liq5YWD57Sg55qE55+p5b2i6IyD5Zu05YaFXG4gICAgICAgICAgIHJlc3VsdCA9IEhpdFRlc3RQb2ludC5pc0luc2lkZSggdGhpcyAsIHtcbiAgICAgICAgICAgICAgIHggOiB4LFxuICAgICAgICAgICAgICAgeSA6IHlcbiAgICAgICAgICAgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WmguaenOi/nuefqeW9ouWGhemDveS4jeaYr++8jOmCo+S5iOiCr+WumueahO+8jOi/meS4quS4jeaYr+aIkeS7rOimgeaJvueahHNoYXBcbiAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIC8qXG4gICAgKiBhbmltYXRlXG4gICAgKiBAcGFyYW0gdG9Db250ZW50IOimgeWKqOeUu+WPmOW9ouWIsOeahOWxnuaAp+mbhuWQiFxuICAgICogQHBhcmFtIG9wdGlvbnMgdHdlZW4g5Yqo55S75Y+C5pWwXG4gICAgKi9cbiAgICBhbmltYXRlIDogZnVuY3Rpb24oIHRvQ29udGVudCAsIG9wdGlvbnMgKXtcbiAgICAgICAgdmFyIHRvID0gdG9Db250ZW50O1xuICAgICAgICB2YXIgZnJvbSA9IHt9O1xuICAgICAgICBmb3IoIHZhciBwIGluIHRvICl7XG4gICAgICAgICAgICBmcm9tWyBwIF0gPSB0aGlzLmNvbnRleHRbcF07XG4gICAgICAgIH07XG4gICAgICAgICFvcHRpb25zICYmIChvcHRpb25zID0ge30pO1xuICAgICAgICBvcHRpb25zLmZyb20gPSBmcm9tO1xuICAgICAgICBvcHRpb25zLnRvID0gdG87XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdXBGdW4gPSBmdW5jdGlvbigpe307XG4gICAgICAgIGlmKCBvcHRpb25zLm9uVXBkYXRlICl7XG4gICAgICAgICAgICB1cEZ1biA9IG9wdGlvbnMub25VcGRhdGU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0d2VlbjtcbiAgICAgICAgb3B0aW9ucy5vblVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL+WmguaenGNvbnRleHTkuI3lrZjlnKjor7TmmI7or6VvYmrlt7Lnu4/ooqtkZXN0cm955LqG77yM6YKj5LmI6KaB5oqK5LuW55qEdHdlZW7nu5lkZXN0cm95XG4gICAgICAgICAgICBpZiAoIXNlbGYuY29udGV4dCAmJiB0d2Vlbikge1xuICAgICAgICAgICAgICAgIEFuaW1hdGlvbkZyYW1lLmRlc3Ryb3lUd2Vlbih0d2Vlbik7XG4gICAgICAgICAgICAgICAgdHdlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IoIHZhciBwIGluIHRoaXMgKXtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRleHRbcF0gPSB0aGlzW3BdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHVwRnVuLmFwcGx5KHNlbGYgLCBbdGhpc10pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgY29tcEZ1biA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgaWYoIG9wdGlvbnMub25Db21wbGV0ZSApe1xuICAgICAgICAgICAgY29tcEZ1biA9IG9wdGlvbnMub25Db21wbGV0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAgICAgY29tcEZ1bi5hcHBseShzZWxmICwgYXJndW1lbnRzKVxuICAgICAgICB9O1xuICAgICAgICB0d2VlbiA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdFR3ZWVuKCBvcHRpb25zICk7XG4gICAgICAgIHJldHVybiB0d2VlbjtcbiAgICB9LFxuXG5cbiAgICAvL+a4suafk+ebuOWFs+mDqOWIhu+8jOi/geenu+WIsHJlbmRlcmVyc+S4reWOu1xuICAgIF9yZW5kZXIgOiBmdW5jdGlvbiggY3R4ICl7XHRcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQudmlzaWJsZSB8fCB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPD0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIFxuXG4gICAgICAgIHZhciB0cmFuc0Zvcm0gPSB0aGlzLl90cmFuc2Zvcm07XG4gICAgICAgIGlmKCAhdHJhbnNGb3JtICkge1xuICAgICAgICAgICAgdHJhbnNGb3JtID0gdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgIH07XG4gICAgICAgIC8v6L+Q55So55+p6Zi15byA5aeL5Y+Y5b2iXG4gICAgICAgIGN0eC50cmFuc2Zvcm0uYXBwbHkoIGN0eCAsIHRyYW5zRm9ybS50b0FycmF5KCkgKTtcblxuICAgICAgICAvL+iuvue9ruagt+W8j++8jOaWh+acrOacieiHquW3seeahOiuvue9ruagt+W8j+aWueW8j1xuICAgICAgICBpZiggdGhpcy50eXBlICE9IFwidGV4dFwiICkge1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5jb250ZXh0LiRtb2RlbDtcbiAgICAgICAgICAgIGZvcih2YXIgcCBpbiBzdHlsZSl7XG4gICAgICAgICAgICAgICAgaWYoIHAgIT0gXCJ0ZXh0QmFzZWxpbmVcIiAmJiAoIHAgaW4gY3R4ICkgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzdHlsZVtwXSB8fCBfLmlzTnVtYmVyKCBzdHlsZVtwXSApICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHAgPT0gXCJnbG9iYWxBbHBoYVwiICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgI/mmI7luqbopoHku47niLboioLngrnnu6fmib9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHhbcF0gKj0gc3R5bGVbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eFtwXSA9IHN0eWxlW3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyKCBjdHggKTtcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9LFxuICAgIHJlbmRlciA6IGZ1bmN0aW9uKCBjdHggKSB7XG4gICAgICAgIC8v5Z+657G75LiN5o+Q5L6bcmVuZGVy55qE5YW35L2T5a6e546w77yM55Sx5ZCO57ut5YW35L2T55qE5rS+55Sf57G75ZCE6Ieq5a6e546wXG4gICAgfSxcbiAgICAvL+S7juagkeS4reWIoOmZpFxuICAgIHJlbW92ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLnBhcmVudCApe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5YWD57Sg55qE6Ieq5oiR6ZSA5q+BXG4gICAgZGVzdHJveSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuZmlyZShcImRlc3Ryb3lcIik7XG4gICAgICAgIC8v5oqK6Ieq5bex5LuO54i26IqC54K55Lit5Yig6Zmk5LqG5ZCO5YGa6Ieq5oiR5riF6Zmk77yM6YeK5pS+5YaF5a2YXG4gICAgICAgIHRoaXMuY29udGV4dCA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNvbnRleHQ7XG4gICAgfVxufSApO1xuXG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5T2JqZWN0O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczPnmoREaXNwbGF5TGlzdCDkuK3nmoTlrrnlmajnsbtcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xuXG52YXIgRGlzcGxheU9iamVjdENvbnRhaW5lciA9IGZ1bmN0aW9uKG9wdCl7XG4gICB2YXIgc2VsZiA9IHRoaXM7XG4gICBzZWxmLmNoaWxkcmVuID0gW107XG4gICBzZWxmLm1vdXNlQ2hpbGRyZW4gPSBbXTtcbiAgIERpc3BsYXlPYmplY3RDb250YWluZXIuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAvL+aJgOacieeahOWuueWZqOm7mOiupOaUr+aMgWV2ZW50IOajgOa1i++8jOWboOS4uiDlj6/og73mnInph4zpnaLnmoRzaGFwZeaYr2V2ZW50RW5hYmxl5pivdHJ1ZeeahFxuICAgLy/lpoLmnpznlKjmiLfmnInlvLrliLbnmoTpnIDmsYLorqnlrrnlmajkuIvnmoTmiYDmnInlhYPntKDpg70g5LiN5Y+v5qOA5rWL77yM5Y+v5Lul6LCD55SoXG4gICAvL0Rpc3BsYXlPYmplY3RDb250YWluZXLnmoQgc2V0RXZlbnRFbmFibGUoKSDmlrnms5VcbiAgIHNlbGYuX2V2ZW50RW5hYmxlZCA9IHRydWU7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwgRGlzcGxheU9iamVjdCAsIHtcbiAgICBhZGRDaGlsZCA6IGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgaWYoICFjaGlsZCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgaWYodGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMSkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgfTtcbiAgICAgICAgLy/lpoLmnpzku5blnKjliKvnmoTlrZDlhYPntKDkuK3vvIzpgqPkuYjlsLHku47liKvkurrpgqPph4zliKDpmaTkuoZcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goIGNoaWxkICk7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGlmKHRoaXMuaGVhcnRCZWF0KXtcbiAgICAgICAgICAgdGhpcy5oZWFydEJlYXQoe1xuICAgICAgICAgICAgIGNvbnZlcnRUeXBlIDogXCJjaGlsZHJlblwiLFxuICAgICAgICAgICAgIHRhcmdldCAgICAgIDogY2hpbGQsXG4gICAgICAgICAgICAgc3JjICAgICAgICAgOiB0aGlzXG4gICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKHRoaXMuX2FmdGVyQWRkQ2hpbGQpe1xuICAgICAgICAgICB0aGlzLl9hZnRlckFkZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSxcbiAgICBhZGRDaGlsZEF0IDogZnVuY3Rpb24oY2hpbGQsIGluZGV4KSB7XG4gICAgICAgIGlmKHRoaXMuZ2V0Q2hpbGRJbmRleChjaGlsZCkgIT0gLTEpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH07XG4gICAgICAgIGlmKGNoaWxkLnBhcmVudCkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKTtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIC8v5LiK5oqlY2hpbGRyZW7lv4Pot7NcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgIDogY2hpbGQsXG4gICAgICAgICAgICAgc3JjICAgICAgOiB0aGlzXG4gICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJBZGRDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyQWRkQ2hpbGQoY2hpbGQsaW5kZXgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkIDogZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2hpbGRBdChfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApKTtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkQXQgOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICBpZiAoY2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgIDogY2hpbGQsXG4gICAgICAgICAgICAgc3JjICAgICAgOiB0aGlzXG4gICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJEZWxDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyRGVsQ2hpbGQoY2hpbGQgLCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSxcbiAgICByZW1vdmVDaGlsZEJ5SWQgOiBmdW5jdGlvbiggaWQgKSB7XHRcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZUNoaWxkQXQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsQ2hpbGRyZW4gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hpbGUodGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkQXQoMCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v6ZuG5ZCI57G755qE6Ieq5oiR6ZSA5q+BXG4gICAgZGVzdHJveSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLnBhcmVudCApe1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZmlyZShcImRlc3Ryb3lcIik7XG4gICAgICAgIC8v5L6d5qyh6ZSA5q+B5omA5pyJ5a2Q5YWD57SgXG4gICAgICAgIGZvciAodmFyIGk9MCxsPXRoaXMuY2hpbGRyZW4ubGVuZ3RoIDsgaTxsIDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRBdChpKS5kZXN0cm95KCk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBsLS07XG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvKlxuICAgICAqQGlkIOWFg+e0oOeahGlkXG4gICAgICpAYm9vbGVuIOaYr+WQpua3seW6puafpeivou+8jOm7mOiupOWwseWcqOesrOS4gOWxguWtkOWFg+e0oOS4reafpeivolxuICAgICAqKi9cbiAgICBnZXRDaGlsZEJ5SWQgOiBmdW5jdGlvbihpZCAsIGJvb2xlbil7XG4gICAgICAgIGlmKCFib29sZW4pIHtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDAsIGxlbiA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hpbGRyZW5baV0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/mt7Hluqbmn6Xor6JcbiAgICAgICAgICAgIC8vVE9ETzrmmoLml7bmnKrlrp7njrBcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBnZXRDaGlsZEF0IDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMSkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2luZGV4XTtcbiAgICB9LFxuICAgIGdldENoaWxkSW5kZXggOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKCB0aGlzLmNoaWxkcmVuICwgY2hpbGQgKTtcbiAgICB9LFxuICAgIHNldENoaWxkSW5kZXggOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgpe1xuICAgICAgICBpZihjaGlsZC5wYXJlbnQgIT0gdGhpcykgcmV0dXJuO1xuICAgICAgICB2YXIgb2xkSW5kZXggPSBfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApO1xuICAgICAgICBpZihpbmRleCA9PSBvbGRJbmRleCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShvbGRJbmRleCwgMSk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAwLCBjaGlsZCk7XG4gICAgfSxcbiAgICBnZXROdW1DaGlsZHJlbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgfSxcbiAgICAvL+iOt+WPlngseeeCueS4iueahOaJgOaciW9iamVjdCAgbnVtIOmcgOimgei/lOWbnueahG9iauaVsOmHj1xuICAgIGdldE9iamVjdHNVbmRlclBvaW50IDogZnVuY3Rpb24oIHBvaW50ICwgbnVtKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGZvcih2YXIgaSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XG5cbiAgICAgICAgICAgIGlmKCBjaGlsZCA9PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgKCFjaGlsZC5fZXZlbnRFbmFibGVkICYmICFjaGlsZC5kcmFnRW5hYmxlZCkgfHwgXG4gICAgICAgICAgICAgICAgIWNoaWxkLmNvbnRleHQudmlzaWJsZSBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIGNoaWxkIGluc3RhbmNlb2YgRGlzcGxheU9iamVjdENvbnRhaW5lciApIHtcbiAgICAgICAgICAgICAgICAvL+aYr+mbhuWQiFxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5tb3VzZUNoaWxkcmVuICYmIGNoaWxkLmdldE51bUNoaWxkcmVuKCkgPiAwKXtcbiAgICAgICAgICAgICAgICAgICB2YXIgb2JqcyA9IGNoaWxkLmdldE9iamVjdHNVbmRlclBvaW50KCBwb2ludCApO1xuICAgICAgICAgICAgICAgICAgIGlmIChvYmpzLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoIG9ianMgKTtcbiAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVx0XHRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/pnZ7pm4blkIjvvIzlj6/ku6XlvIDlp4vlgZpnZXRDaGlsZEluUG9pbnTkuoZcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuZ2V0Q2hpbGRJblBvaW50KCBwb2ludCApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bSAhPSB1bmRlZmluZWQgJiYgIWlzTmFOKG51bSkpe1xuICAgICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQubGVuZ3RoID09IG51bSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvL+a4suafk+ebuOWFs++8jOetieS4i+S5n+S8muenu+WIsHJlbmRlcmVy5Lit5Y67XG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApIHtcbiAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltpXS5fcmVuZGVyKCBjdHggKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgRGlzcGxheU9iamVjdENvbnRhaW5lcjtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIHN0YWdlIOexu++8jCDlho1hczPkuK3vvIxzdGFnZeWImeS7o+ihqOaVtOS4quiInuWPsOOAguaYr+WUr+S4gOeahOagueiKgueCuVxuICog5L2G5piv5YaNY2FudmF45Lit77yM5Zug5Li65YiG5bGC6K6+6K6h55qE6ZyA6KaB44CCc3RhZ2Ug6Iie5Y+wIOWQjOagt+S7o+ihqOS4gOS4qmNhbnZhc+WFg+e0oO+8jOS9huaYr+S4jeaYr+WGjeaVtOS4quW8leaTjuiuvuiuoVxuICog6YeM6Z2i77yMIOS4jeaYr+WUr+S4gOeahOagueiKgueCueOAguiAjOaYr+S8muS6pOeUsWNhbnZheOexu+adpee7n+S4gOeuoeeQhuWFtuWxgue6p1xuICovXG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbnZhciBTdGFnZSA9IGZ1bmN0aW9uKCApe1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnR5cGUgPSBcInN0YWdlXCI7XG4gICAgc2VsZi5jb250ZXh0MkQgPSBudWxsO1xuICAgIC8vc3RhZ2XmraPlnKjmuLLmn5PkuK1cbiAgICBzZWxmLnN0YWdlUmVuZGluZyA9IGZhbHNlO1xuICAgIHNlbGYuX2lzUmVhZHkgPSBmYWxzZTtcbiAgICBTdGFnZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuVXRpbHMuY3JlYXRDbGFzcyggU3RhZ2UgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe30sXG4gICAgLy/nlLFjYW52YXjnmoRhZnRlckFkZENoaWxkIOWbnuiwg1xuICAgIGluaXRTdGFnZSA6IGZ1bmN0aW9uKCBjb250ZXh0MkQgLCB3aWR0aCAsIGhlaWdodCApe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBzZWxmLmNvbnRleHQyRCA9IGNvbnRleHQyRDtcbiAgICAgICBzZWxmLmNvbnRleHQud2lkdGggID0gd2lkdGg7XG4gICAgICAgc2VsZi5jb250ZXh0LmhlaWdodCA9IGhlaWdodDtcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVYID0gVXRpbHMuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgc2VsZi5jb250ZXh0LnNjYWxlWSA9IFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgIHNlbGYuX2lzUmVhZHkgPSB0cnVlO1xuICAgIH0sXG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGNvbnRleHQgKXtcbiAgICAgICAgdGhpcy5zdGFnZVJlbmRpbmcgPSB0cnVlO1xuICAgICAgICAvL1RPRE/vvJpcbiAgICAgICAgLy9jbGVhciDnnIvkvLwg5b6I5ZCI55CG77yM5L2G5piv5YW25a6e5Zyo5peg54q25oCB55qEY2F2bmFz57uY5Zu+5Lit77yM5YW25a6e5rKh5b+F6KaB5omn6KGM5LiA5q2l5aSa5L2Z55qEY2xlYXLmk43kvZxcbiAgICAgICAgLy/lj43ogIzlop7liqDml6DosJPnmoTlvIDplIDvvIzlpoLmnpzlkI7nu63opoHlgZrohI/nn6npmLXliKTmlq3nmoTor53jgILlnKjor7RcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICBTdGFnZS5zdXBlcmNsYXNzLnJlbmRlci5jYWxsKCB0aGlzLCBjb250ZXh0ICk7XG4gICAgICAgIHRoaXMuc3RhZ2VSZW5kaW5nID0gZmFsc2U7XG4gICAgfSxcbiAgICBoZWFydEJlYXQgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgIC8vc2hhcGUgLCBuYW1lICwgdmFsdWUgLCBwcmVWYWx1ZSBcbiAgICAgICAgLy9kaXNwbGF5TGlzdOS4reafkOS4quWxnuaAp+aUueWPmOS6hlxuICAgICAgICBpZiAoIXRoaXMuX2lzUmVhZHkpIHtcbiAgICAgICAgICAgLy/lnKhzdGFnZei/mOayoeWIneWni+WMluWujOavleeahOaDheWGteS4i++8jOaXoOmcgOWBmuS7u+S9leWkhOeQhlxuICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIG9wdCB8fCAoIG9wdCA9IHt9ICk7IC8v5aaC5p6cb3B05Li656m677yM6K+05piO5bCx5piv5peg5p2h5Lu25Yi35pawXG4gICAgICAgIG9wdC5zdGFnZSAgID0gdGhpcztcblxuICAgICAgICAvL1RPRE/kuLTml7blhYjov5nkuYjlpITnkIZcbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuaGVhcnRCZWF0KG9wdCk7XG4gICAgfSxcbiAgICBjbGVhciA6IGZ1bmN0aW9uKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQyRC5jbGVhclJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQyRC5jbGVhclJlY3QoIDAsIDAsIHRoaXMucGFyZW50LndpZHRoICwgdGhpcy5wYXJlbnQuaGVpZ2h0ICk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbmV4cG9ydCBkZWZhdWx0IFN0YWdlOyIsImltcG9ydCB7IFJFTkRFUkVSX1RZUEUgfSBmcm9tICcuLi9jb25zdCc7XG5pbXBvcnQgQW5pbWF0aW9uRnJhbWUgZnJvbSBcIi4uL2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZVwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeXN0ZW1SZW5kZXJlciBcbntcbiAgICBjb25zdHJ1Y3RvciggdHlwZT1SRU5ERVJFUl9UWVBFLlVOS05PV04gLCBhcHAgKVxuICAgIHtcbiAgICBcdHRoaXMudHlwZSA9IHR5cGU7IC8vMmNhbnZhcywxd2ViZ2xcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0QWlkID0gbnVsbDtcblxuICAgICAgICAvL+avj+W4p+eUseW/g+i3s+S4iuaKpeeahCDpnIDopoHph43nu5jnmoRzdGFnZXMg5YiX6KGoXG5cdFx0dGhpcy5jb252ZXJ0U3RhZ2VzID0ge307XG5cblx0XHR0aGlzLl9oZWFydEJlYXQgPSBmYWxzZTsvL+W/g+i3s++8jOm7mOiupOS4umZhbHNl77yM5Y2zZmFsc2XnmoTml7blgJnlvJXmk47lpITkuo7pnZnpu5jnirbmgIEgdHJ1ZeWImeWQr+WKqOa4suafk1xuXG5cdFx0dGhpcy5fcHJlUmVuZGVyVGltZSA9IDA7XG4gICAgfVxuXG4gICAgLy/lpoLmnpzlvJXmk47lpITkuo7pnZnpu5jnirbmgIHnmoTor53vvIzlsLHkvJrlkK/liqhcbiAgICBzdGFydEVudGVyKClcbiAgICB7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKCAhc2VsZi5yZXF1ZXN0QWlkICl7XG4gICAgICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdEZyYW1lKCB7XG4gICAgICAgICAgICAgICBpZCA6IFwiZW50ZXJGcmFtZVwiLCAvL+WQjOaXtuiCr+WumuWPquacieS4gOS4qmVudGVyRnJhbWXnmoR0YXNrXG4gICAgICAgICAgICAgICB0YXNrIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbnRlckZyYW1lLmFwcGx5KHNlbGYpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICB9ICk7XG4gICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyRnJhbWUoKVxuICAgIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+S4jeeuoeaAjuS5iOagt++8jGVudGVyRnJhbWXmiafooYzkuoblsLHopoHmiopcbiAgICAgICAgLy9yZXF1ZXN0QWlkIG51bGwg5o6JXG4gICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IG51bGw7XG4gICAgICAgIFV0aWxzLm5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiggc2VsZi5faGVhcnRCZWF0ICl7XG4gICAgICAgICAgICBfLmVhY2goXy52YWx1ZXMoIHNlbGYuY29udmVydFN0YWdlcyApICwgZnVuY3Rpb24oY29udmVydFN0YWdlKXtcbiAgICAgICAgICAgICAgIGNvbnZlcnRTdGFnZS5zdGFnZS5fcmVuZGVyKCBjb252ZXJ0U3RhZ2Uuc3RhZ2UuY29udGV4dDJEICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzID0ge307XG4gICAgICAgICAgICAvL+a4suafk+WujOS6hu+8jOaJk+S4iuacgOaWsOaXtumXtOaMq1xuICAgICAgICAgICAgc2VsZi5fcHJlUmVuZGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9jb252ZXJ0Q2FudmF4KG9wdClcbiAgICB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIF8uZWFjaCggbWUuYXBwLmNoaWxkcmVuICwgZnVuY3Rpb24oc3RhZ2Upe1xuICAgICAgICAgICAgc3RhZ2UuY29udGV4dFtvcHQubmFtZV0gPSBvcHQudmFsdWU7IFxuICAgICAgICB9ICk7ICBcbiAgICB9XG5cbiAgICBoZWFydEJlYXQoIG9wdCApXG4gICAge1xuICAgICAgICAvL2Rpc3BsYXlMaXN05Lit5p+Q5Liq5bGe5oCn5pS55Y+Y5LqGXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYoIG9wdCApe1xuICAgICAgICAgICAgLy/lv4Pot7PljIXmnInkuKTnp43vvIzkuIDnp43mmK/mn5DlhYPntKDnmoTlj6/op4blsZ7mgKfmlLnlj5jkuobjgILkuIDnp43mmK9jaGlsZHJlbuacieWPmOWKqFxuICAgICAgICAgICAgLy/liIbliKvlr7nlupRjb252ZXJ0VHlwZSAg5Li6IGNvbnRleHQgIGFuZCBjaGlsZHJlblxuICAgICAgICAgICAgaWYgKG9wdC5jb252ZXJ0VHlwZSA9PSBcImNvbnRleHRcIil7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlICAgPSBvcHQuc3RhZ2U7XG4gICAgICAgICAgICAgICAgdmFyIHNoYXBlICAgPSBvcHQuc2hhcGU7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgICAgPSBvcHQubmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgICA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlVmFsdWU9IG9wdC5wcmVWYWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmKCBzaGFwZS50eXBlID09IFwiY2FudmF4XCIgKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fY29udmVydENhbnZheChvcHQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYoc2hhcGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmNvbnZlcnRTdGFnZXNbIHN0YWdlLmlkIF0uY29udmVydFNoYXBlc1sgc2hhcGUuaWQgXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzWyBzdGFnZS5pZCBdLmNvbnZlcnRTaGFwZXNbIHNoYXBlLmlkIF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFwZSA6IHNoYXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IG9wdC5jb252ZXJ0VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzlt7Lnu4/kuIrmiqXkuobor6Ugc2hhcGUg55qE5b+D6Lez44CCXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChvcHQuY29udmVydFR5cGUgPT0gXCJjaGlsZHJlblwiKXtcbiAgICAgICAgICAgICAgICAvL+WFg+e0oOe7k+aehOWPmOWMlu+8jOavlOWmgmFkZGNoaWxkIHJlbW92ZUNoaWxk562JXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IG9wdC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gb3B0LnNyYy5nZXRTdGFnZSgpO1xuICAgICAgICAgICAgICAgIGlmKCBzdGFnZSB8fCAodGFyZ2V0LnR5cGU9PVwic3RhZ2VcIikgKXtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmk43kvZznmoTnm67moIflhYPntKDmmK9TdGFnZVxuICAgICAgICAgICAgICAgICAgICBzdGFnZSA9IHN0YWdlIHx8IHRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlIDogc3RhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFvcHQuY29udmVydFR5cGUpe1xuICAgICAgICAgICAgICAgIC8v5peg5p2h5Lu26KaB5rGC5Yi35pawXG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gb3B0LnN0YWdlO1xuICAgICAgICAgICAgICAgIGlmKCFzZWxmLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5peg5p2h5Lu26KaB5rGC5YWo6YOo5Yi35paw77yM5LiA6Iis55So5ZyocmVzaXpl562J44CCXG4gICAgICAgICAgICBfLmVhY2goIHNlbGYuYXBwLmNoaWxkcmVuICwgZnVuY3Rpb24oIHN0YWdlICwgaSApe1xuICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIXNlbGYuX2hlYXJ0QmVhdCl7XG4gICAgICAgICAgIC8v5aaC5p6c5Y+R546w5byV5pOO5Zyo6Z2Z6buY54q25oCB77yM6YKj5LmI5bCx5ZSk6YaS5byV5pOOXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgICAgIHNlbGYuc3RhcnRFbnRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WQpuWImeaZuuaFp+e7p+e7reehruiupOW/g+i3s1xuICAgICAgICAgICBzZWxmLl9oZWFydEJlYXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IFN5c3RlbVJlbmRlcmVyIGZyb20gJy4uL1N5c3RlbVJlbmRlcmVyJztcbmltcG9ydCB7IFJFTkRFUkVSX1RZUEUgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1JlbmRlcmVyIGV4dGVuZHMgU3lzdGVtUmVuZGVyZXJcbntcbiAgICBjb25zdHJ1Y3RvcihhcHApXG4gICAge1xuICAgICAgICBzdXBlcihSRU5ERVJFUl9UWVBFLkNBTlZBUywgYXBwKTtcbiAgICB9XG59XG5cbiIsIi8qKlxuICogQXBwbGljYXRpb24ge3tQS0dfVkVSU0lPTn19XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS4u+W8leaTjiDnsbtcbiAqXG4gKiDotJ/otKPmiYDmnIljYW52YXPnmoTlsYLnuqfnrqHnkIbvvIzlkozlv4Pot7PmnLrliLbnmoTlrp7njrAs5o2V6I635Yiw5b+D6Lez5YyF5ZCOIFxuICog5YiG5Y+R5Yiw5a+55bqU55qEc3RhZ2UoY2FudmFzKeadpee7mOWItuWvueW6lOeahOaUueWKqFxuICog54S25ZCOIOm7mOiupOacieWunueOsOS6hnNoYXBl55qEIG1vdXNlb3ZlciAgbW91c2VvdXQgIGRyYWcg5LqL5Lu2XG4gKlxuICoqL1xuXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBTdGFnZSBmcm9tIFwiLi9kaXNwbGF5L1N0YWdlXCI7XG5pbXBvcnQgUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlclwiXG5cblxuLy91dGlsc1xuaW1wb3J0IF8gZnJvbSBcIi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0ICQgZnJvbSBcIi4vdXRpbHMvZG9tXCI7XG5cblxudmFyIEFwcGxpY2F0aW9uID0gZnVuY3Rpb24oIG9wdCApe1xuICAgIHRoaXMudHlwZSA9IFwiY2FudmF4XCI7XG4gICAgdGhpcy5fY2lkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyBcIl9cIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDApOyBcbiAgICBcbiAgICB0aGlzLmVsID0gJC5xdWVyeShvcHQuZWwpO1xuXG4gICAgdGhpcy53aWR0aCA9IHBhcnNlSW50KFwid2lkdGhcIiAgaW4gb3B0IHx8IHRoaXMuZWwub2Zmc2V0V2lkdGggICwgMTApOyBcbiAgICB0aGlzLmhlaWdodCA9IHBhcnNlSW50KFwiaGVpZ2h0XCIgaW4gb3B0IHx8IHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICwgMTApOyBcblxuICAgIHZhciB2aWV3T2JqID0gJC5jcmVhdGVWaWV3KHRoaXMud2lkdGggLCB0aGlzLmhlaWdodCwgdGhpcy5fY2lkKTtcbiAgICB0aGlzLnZpZXcgPSB2aWV3T2JqLnZpZXc7XG4gICAgdGhpcy5zdGFnZV9jID0gdmlld09iai5zdGFnZV9jO1xuICAgIHRoaXMuZG9tX2MgPSB2aWV3T2JqLmRvbV9jO1xuICAgIFxuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKCB0aGlzLnZpZXcgKTtcblxuICAgIHRoaXMudmlld09mZnNldCA9ICQub2Zmc2V0KHRoaXMudmlldyk7XG4gICAgdGhpcy5sYXN0R2V0Uk8gPSAwOy8v5pyA5ZCO5LiA5qyh6I635Y+WIHZpZXdPZmZzZXQg55qE5pe26Ze0XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKCB0aGlzICk7XG5cbiAgICB0aGlzLmV2ZW50ID0gbnVsbDtcblxuICAgIHRoaXMuX2J1ZmZlclN0YWdlID0gbnVsbDtcblxuICAgIC8v5piv5ZCm6Zi75q2i5rWP6KeI5Zmo6buY6K6k5LqL5Lu255qE5omn6KGMXG4gICAgdGhpcy5wcmV2ZW50RGVmYXVsdCA9IHRydWU7XG4gICAgaWYoIG9wdC5wcmV2ZW50RGVmYXVsdCA9PT0gZmFsc2UgKXtcbiAgICAgICAgdGhpcy5wcmV2ZW50RGVmYXVsdCA9IGZhbHNlXG4gICAgfTtcblxuICAgIEFwcGxpY2F0aW9uLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoQXBwbGljYXRpb24gLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IHRoaXMuaGVpZ2h0OyBcblxuICAgICAgICAvL+eEtuWQjuWIm+W7uuS4gOS4queUqOS6jue7mOWItua/gOa0uyBzaGFwZSDnmoQgc3RhZ2Ug5YiwYWN0aXZhdGlvblxuICAgICAgICB0aGlzLl9jcmVhdEhvdmVyU3RhZ2UoKTtcblxuICAgICAgICAvL+WIm+W7uuS4gOS4quWmguaenOimgeeUqOWDj+e0oOajgOa1i+eahOaXtuWAmeeahOWuueWZqFxuICAgICAgICB0aGlzLl9jcmVhdGVQaXhlbENvbnRleHQoKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICByZWdpc3RFdmVudCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIC8v5Yid5aeL5YyW5LqL5Lu25aeU5omY5Yiwcm9vdOWFg+e0oOS4iumdolxuICAgICAgICB0aGlzLmV2ZW50ID0gbmV3IEV2ZW50SGFuZGxlciggdGhpcyAsIG9wdCk7O1xuICAgICAgICB0aGlzLmV2ZW50LmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQ7XG4gICAgfSxcbiAgICByZXNpemUgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgIC8v6YeN5paw6K6+572u5Z2Q5qCH57O757ufIOmrmOWuvSDnrYnjgIJcbiAgICAgICAgdGhpcy53aWR0aCAgICAgID0gcGFyc2VJbnQoKG9wdCAmJiBcIndpZHRoXCIgaW4gb3B0KSB8fCB0aGlzLmVsLm9mZnNldFdpZHRoICAsIDEwKTsgXG4gICAgICAgIHRoaXMuaGVpZ2h0ICAgICA9IHBhcnNlSW50KChvcHQgJiYgXCJoZWlnaHRcIiBpbiBvcHQpIHx8IHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICwgMTApOyBcblxuICAgICAgICB0aGlzLnZpZXcuc3R5bGUud2lkdGggID0gdGhpcy53aWR0aCArXCJweFwiO1xuICAgICAgICB0aGlzLnZpZXcuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQrXCJweFwiO1xuXG4gICAgICAgIHRoaXMudmlld09mZnNldCAgICAgPSAkLm9mZnNldCh0aGlzLnZpZXcpO1xuICAgICAgICB0aGlzLl9ub3RXYXRjaCAgICAgID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoICA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggICAgICA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByZVNpemVDYW52YXMgICAgPSBmdW5jdGlvbihjdHgpe1xuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGN0eC5jYW52YXM7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBtZS53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQ9IG1lLmhlaWdodCsgXCJweFwiO1xuICAgICAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIgICwgbWUud2lkdGggKiBVdGlscy5fZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIgLCBtZS5oZWlnaHQqIFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvKTtcblxuICAgICAgICAgICAgLy/lpoLmnpzmmK9zd2bnmoTor53lsLHov5jopoHosIPnlKjov5nkuKrmlrnms5XjgIJcbiAgICAgICAgICAgIGlmIChjdHgucmVzaXplKSB7XG4gICAgICAgICAgICAgICAgY3R4LnJlc2l6ZShtZS53aWR0aCAsIG1lLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07IFxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiAsIGZ1bmN0aW9uKHMgLCBpKXtcbiAgICAgICAgICAgIHMuX25vdFdhdGNoICAgICA9IHRydWU7XG4gICAgICAgICAgICBzLmNvbnRleHQud2lkdGggPSBtZS53aWR0aDtcbiAgICAgICAgICAgIHMuY29udGV4dC5oZWlnaHQ9IG1lLmhlaWdodDtcbiAgICAgICAgICAgIHJlU2l6ZUNhbnZhcyhzLmNvbnRleHQyRCk7XG4gICAgICAgICAgICBzLl9ub3RXYXRjaCAgICAgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kb21fYy5zdHlsZS53aWR0aCAgPSB0aGlzLndpZHRoICArIFwicHhcIjtcbiAgICAgICAgdGhpcy5kb21fYy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcblxuICAgICAgICB0aGlzLmhlYXJ0QmVhdCgpO1xuXG4gICAgfSxcbiAgICBnZXRIb3ZlclN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlclN0YWdlO1xuICAgIH0sXG4gICAgX2NyZWF0SG92ZXJTdGFnZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vVE9ETzrliJvlu7pzdGFnZeeahOaXtuWAmeS4gOWumuimgeS8oOWFpXdpZHRoIGhlaWdodCAg5Lik5Liq5Y+C5pWwXG4gICAgICAgIHRoaXMuX2J1ZmZlclN0YWdlID0gbmV3IFN0YWdlKCB7XG4gICAgICAgICAgICBpZCA6IFwiYWN0aXZDYW52YXNcIisobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgY29udGV4dCA6IHtcbiAgICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMuY29udGV4dC53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29udGV4dC5oZWlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuICAgICAgICAvL+ivpXN0YWdl5LiN5Y+C5LiO5LqL5Lu25qOA5rWLXG4gICAgICAgIHRoaXMuX2J1ZmZlclN0YWdlLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCggdGhpcy5fYnVmZmVyU3RhZ2UgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOeUqOadpeajgOa1i+aWh+acrHdpZHRoIGhlaWdodCBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOS4iuS4i+aWh1xuICAgICovXG4gICAgX2NyZWF0ZVBpeGVsQ29udGV4dCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3BpeGVsQ2FudmFzID0gJC5xdWVyeShcIl9waXhlbENhbnZhc1wiKTtcbiAgICAgICAgaWYoIV9waXhlbENhbnZhcyl7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMgPSAkLmNyZWF0ZUNhbnZhcygwLCAwLCBcIl9waXhlbENhbnZhc1wiKTsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WmguaenOWPiOeahOivnSDlsLHkuI3pnIDopoHlnKjliJvlu7rkuoZcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggX3BpeGVsQ2FudmFzICk7XG4gICAgICAgIFV0aWxzLmluaXRFbGVtZW50KCBfcGl4ZWxDYW52YXMgKTtcbiAgICAgICAgaWYoIFV0aWxzLmNhbnZhc1N1cHBvcnQoKSApe1xuICAgICAgICAgICAgLy9jYW52YXPnmoTor53vvIzlk6rmgJXmmK9kaXNwbGF5Om5vbmXnmoTpobXlj6/ku6XnlKjmnaXlt6blg4/ntKDmo4DmtYvlkoxtZWFzdXJlVGV4dOaWh+acrHdpZHRo5qOA5rWLXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuZGlzcGxheSAgICA9IFwibm9uZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9mbGFzaENhbnZhcyDnmoTor53vvIxzd2blpoLmnpxkaXNwbGF5Om5vbmXkuobjgILlsLHlgZrkuI3kuoZtZWFzdXJlVGV4dCDmlofmnKzlrr3luqYg5qOA5rWL5LqGXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuekluZGV4ICAgICA9IC0xO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnBvc2l0aW9uICAgPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUubGVmdCAgICAgICA9IC10aGlzLmNvbnRleHQud2lkdGggICsgXCJweFwiO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnRvcCAgICAgICAgPSAtdGhpcy5jb250ZXh0LmhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBVdGlscy5fcGl4ZWxDdHggPSBfcGl4ZWxDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlVmlld09mZnNldCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaWYoIG5vdyAtIHRoaXMubGFzdEdldFJPID4gMTAwMCApe1xuICAgICAgICAgICAgdGhpcy52aWV3T2Zmc2V0ICAgICAgPSAkLm9mZnNldCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgdGhpcy5sYXN0R2V0Uk8gICAgICAgPSBub3c7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIF9hZnRlckFkZENoaWxkIDogZnVuY3Rpb24oIHN0YWdlICwgaW5kZXggKXtcbiAgICAgICAgdmFyIGNhbnZhcztcblxuICAgICAgICBpZighc3RhZ2UuY29udGV4dDJEKXtcbiAgICAgICAgICAgIGNhbnZhcyA9ICQuY3JlYXRlQ2FudmFzKCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0LCBzdGFnZS5pZCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzID0gc3RhZ2UuY29udGV4dDJELmNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgdGhpcy5zdGFnZV9jLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoPjEpIHtcbiAgICAgICAgICAgIGlmKCBpbmRleCA9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmsqHmnInmjIflrprkvY3nva7vvIzpgqPkuYjlsLHmlL7liLBfYnVmZmVyU3RhZ2XnmoTkuIvpnaLjgIJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlX2MuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLl9idWZmZXJTdGFnZS5jb250ZXh0MkQuY2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmnInmjIflrprnmoTkvY3nva7vvIzpgqPkuYjlsLHmjIflrprnmoTkvY3nva7mnaVcbiAgICAgICAgICAgICAgICBpZiggaW5kZXggPj0gdGhpcy5jaGlsZHJlbi5sZW5ndGgtMSApe1xuICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5hcHBlbmRDaGlsZCggY2FudmFzICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWdlX2MuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLmNoaWxkcmVuWyBpbmRleCBdLmNvbnRleHQyRC5jYW52YXMgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgVXRpbHMuaW5pdEVsZW1lbnQoIGNhbnZhcyApO1xuICAgICAgICBzdGFnZS5pbml0U3RhZ2UoIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikgLCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0ICk7IFxuICAgIH0sXG4gICAgX2FmdGVyRGVsQ2hpbGQgOiBmdW5jdGlvbihzdGFnZSl7XG4gICAgICAgIHRoaXMuc3RhZ2VfYy5yZW1vdmVDaGlsZCggc3RhZ2UuY29udGV4dDJELmNhbnZhcyApO1xuICAgIH0sXG4gICAgXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5oZWFydEJlYXQob3B0KTtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyDkuK0g55qEc3ByaXRl57G777yM55uu5YmN6L+Y5Y+q5piv5Liq566A5Y2V55qE5a655piT44CCXG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFNwcml0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy50eXBlID0gXCJzcHJpdGVcIjtcbiAgICBTcHJpdGUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhTcHJpdGUgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgIFxuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTcHJpdGU7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljc0RhdGFcbntcbiAgICBjb25zdHJ1Y3RvcihsaW5lV2lkdGgsIGxpbmVDb2xvciwgbGluZUFscGhhLCBmaWxsQ29sb3IsIGZpbGxBbHBoYSwgZmlsbCwgc2hhcGUpXG4gICAge1xuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSBsaW5lQ29sb3I7XG4gICAgICAgIHRoaXMubGluZUFscGhhID0gbGluZUFscGhhO1xuICAgICAgICB0aGlzLl9saW5lVGludCA9IGxpbmVDb2xvcjtcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSBmaWxsQ29sb3I7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gZmlsbEFscGhhO1xuICAgICAgICB0aGlzLl9maWxsVGludCA9IGZpbGxDb2xvcjtcbiAgICAgICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICAgICAgdGhpcy5ob2xlcyA9IFtdO1xuICAgICAgICB0aGlzLnNoYXBlID0gc2hhcGU7XG4gICAgICAgIHRoaXMudHlwZSA9IHNoYXBlLnR5cGU7XG4gICAgfVxuXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBHcmFwaGljc0RhdGEoXG4gICAgICAgICAgICB0aGlzLmxpbmVXaWR0aCxcbiAgICAgICAgICAgIHRoaXMubGluZUNvbG9yLFxuICAgICAgICAgICAgdGhpcy5saW5lQWxwaGEsXG4gICAgICAgICAgICB0aGlzLmZpbGxDb2xvcixcbiAgICAgICAgICAgIHRoaXMuZmlsbEFscGhhLFxuICAgICAgICAgICAgdGhpcy5maWxsLFxuICAgICAgICAgICAgdGhpcy5zaGFwZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFkZEhvbGUoc2hhcGUpXG4gICAge1xuICAgICAgICB0aGlzLmhvbGVzLnB1c2goc2hhcGUpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgdGhpcy5zaGFwZSA9IG51bGw7XG4gICAgICAgIHRoaXMuaG9sZXMgPSBudWxsO1xuICAgIH1cbiAgICBcbn1cbiIsIi8qKlxuICogVGhlIFBvaW50IG9iamVjdCByZXByZXNlbnRzIGEgbG9jYXRpb24gaW4gYSB0d28tZGltZW5zaW9uYWwgY29vcmRpbmF0ZSBzeXN0ZW0sIHdoZXJlIHggcmVwcmVzZW50c1xuICogdGhlIGhvcml6b250YWwgYXhpcyBhbmQgeSByZXByZXNlbnRzIHRoZSB2ZXJ0aWNhbCBheGlzLlxuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnRcbntcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gLSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgeSBheGlzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIHBvaW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlBvaW50fSBhIGNvcHkgb2YgdGhlIHBvaW50XG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHggYW5kIHkgZnJvbSB0aGUgZ2l2ZW4gcG9pbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gcCAtIFRoZSBwb2ludCB0byBjb3B5LlxuICAgICAqL1xuICAgIGNvcHkocClcbiAgICB7XG4gICAgICAgIHRoaXMuc2V0KHAueCwgcC55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHBvaW50IGlzIGVxdWFsIHRvIHRoaXMgcG9pbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5Qb2ludH0gcCAtIFRoZSBwb2ludCB0byBjaGVja1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBnaXZlbiBwb2ludCBlcXVhbCB0byB0aGlzIHBvaW50XG4gICAgICovXG4gICAgZXF1YWxzKHApXG4gICAge1xuICAgICAgICByZXR1cm4gKHAueCA9PT0gdGhpcy54KSAmJiAocC55ID09PSB0aGlzLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHBvaW50IHRvIGEgbmV3IHggYW5kIHkgcG9zaXRpb24uXG4gICAgICogSWYgeSBpcyBvbWl0dGVkLCBib3RoIHggYW5kIHkgd2lsbCBiZSBzZXQgdG8geC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSAtIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgeCBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSB5IGF4aXNcbiAgICAgKi9cbiAgICBzZXQoeCwgeSlcbiAgICB7XG4gICAgICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICAgICAgdGhpcy55ID0geSB8fCAoKHkgIT09IDApID8gdGhpcy54IDogMCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgUG9pbnQgZnJvbSAnLi9Qb2ludCc7XG5cbi8qKlxuICogVGhlIHBpeGkgTWF0cml4IGNsYXNzIGFzIGFuIG9iamVjdCwgd2hpY2ggbWFrZXMgaXQgYSBsb3QgZmFzdGVyLFxuICogaGVyZSBpcyBhIHJlcHJlc2VudGF0aW9uIG9mIGl0IDpcbiAqIHwgYSB8IGIgfCB0eHxcbiAqIHwgYyB8IGQgfCB0eXxcbiAqIHwgMCB8IDAgfCAxIHxcbiAqXG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeFxue1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmIgPSAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYyA9IDA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR4ID0gMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5ID0gMDtcblxuICAgICAgICB0aGlzLmFycmF5ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgTWF0cml4IG9iamVjdCBiYXNlZCBvbiB0aGUgZ2l2ZW4gYXJyYXkuIFRoZSBFbGVtZW50IHRvIE1hdHJpeCBtYXBwaW5nIG9yZGVyIGlzIGFzIGZvbGxvd3M6XG4gICAgICpcbiAgICAgKiBhID0gYXJyYXlbMF1cbiAgICAgKiBiID0gYXJyYXlbMV1cbiAgICAgKiBjID0gYXJyYXlbM11cbiAgICAgKiBkID0gYXJyYXlbNF1cbiAgICAgKiB0eCA9IGFycmF5WzJdXG4gICAgICogdHkgPSBhcnJheVs1XVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gYXJyYXkgLSBUaGUgYXJyYXkgdGhhdCB0aGUgbWF0cml4IHdpbGwgYmUgcG9wdWxhdGVkIGZyb20uXG4gICAgICovXG4gICAgZnJvbUFycmF5KGFycmF5KVxuICAgIHtcbiAgICAgICAgdGhpcy5hID0gYXJyYXlbMF07XG4gICAgICAgIHRoaXMuYiA9IGFycmF5WzFdO1xuICAgICAgICB0aGlzLmMgPSBhcnJheVszXTtcbiAgICAgICAgdGhpcy5kID0gYXJyYXlbNF07XG4gICAgICAgIHRoaXMudHggPSBhcnJheVsyXTtcbiAgICAgICAgdGhpcy50eSA9IGFycmF5WzVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNldHMgdGhlIG1hdHJpeCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYSAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYiAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYyAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZCAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHggLSBNYXRyaXggY29tcG9uZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR5IC0gTWF0cml4IGNvbXBvbmVudFxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgc2V0KGEsIGIsIGMsIGQsIHR4LCB0eSlcbiAgICB7XG4gICAgICAgIHRoaXMuYSA9IGE7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgICAgIHRoaXMuYyA9IGM7XG4gICAgICAgIHRoaXMuZCA9IGQ7XG4gICAgICAgIHRoaXMudHggPSB0eDtcbiAgICAgICAgdGhpcy50eSA9IHR5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgZnJvbSB0aGUgY3VycmVudCBNYXRyaXggb2JqZWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0cmFuc3Bvc2UgLSBXaGV0aGVyIHdlIG5lZWQgdG8gdHJhbnNwb3NlIHRoZSBtYXRyaXggb3Igbm90XG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IFtvdXQ9bmV3IEZsb2F0MzJBcnJheSg5KV0gLSBJZiBwcm92aWRlZCB0aGUgYXJyYXkgd2lsbCBiZSBhc3NpZ25lZCB0byBvdXRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX0gdGhlIG5ld2x5IGNyZWF0ZWQgYXJyYXkgd2hpY2ggY29udGFpbnMgdGhlIG1hdHJpeFxuICAgICAqL1xuICAgIHRvQXJyYXkodHJhbnNwb3NlLCBvdXQpXG4gICAge1xuICAgICAgICBpZiAoIXRoaXMuYXJyYXkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJyYXkgPSBvdXQgfHwgdGhpcy5hcnJheTtcblxuICAgICAgICBpZiAodHJhbnNwb3NlKVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnJheVswXSA9IHRoaXMuYTtcbiAgICAgICAgICAgIGFycmF5WzFdID0gdGhpcy5iO1xuICAgICAgICAgICAgYXJyYXlbMl0gPSAwO1xuICAgICAgICAgICAgYXJyYXlbM10gPSB0aGlzLmM7XG4gICAgICAgICAgICBhcnJheVs0XSA9IHRoaXMuZDtcbiAgICAgICAgICAgIGFycmF5WzVdID0gMDtcbiAgICAgICAgICAgIGFycmF5WzZdID0gdGhpcy50eDtcbiAgICAgICAgICAgIGFycmF5WzddID0gdGhpcy50eTtcbiAgICAgICAgICAgIGFycmF5WzhdID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFycmF5WzBdID0gdGhpcy5hO1xuICAgICAgICAgICAgYXJyYXlbMV0gPSB0aGlzLmM7XG4gICAgICAgICAgICBhcnJheVsyXSA9IHRoaXMudHg7XG4gICAgICAgICAgICBhcnJheVszXSA9IHRoaXMuYjtcbiAgICAgICAgICAgIGFycmF5WzRdID0gdGhpcy5kO1xuICAgICAgICAgICAgYXJyYXlbNV0gPSB0aGlzLnR5O1xuICAgICAgICAgICAgYXJyYXlbNl0gPSAwO1xuICAgICAgICAgICAgYXJyYXlbN10gPSAwO1xuICAgICAgICAgICAgYXJyYXlbOF0gPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIG5ldyBwb3NpdGlvbiB3aXRoIHRoZSBjdXJyZW50IHRyYW5zZm9ybWF0aW9uIGFwcGxpZWQuXG4gICAgICogQ2FuIGJlIHVzZWQgdG8gZ28gZnJvbSBhIGNoaWxkJ3MgY29vcmRpbmF0ZSBzcGFjZSB0byB0aGUgd29ybGQgY29vcmRpbmF0ZSBzcGFjZS4gKGUuZy4gcmVuZGVyaW5nKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBwb3MgLSBUaGUgb3JpZ2luXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBbbmV3UG9zXSAtIFRoZSBwb2ludCB0aGF0IHRoZSBuZXcgcG9zaXRpb24gaXMgYXNzaWduZWQgdG8gKGFsbG93ZWQgdG8gYmUgc2FtZSBhcyBpbnB1dClcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlBvaW50fSBUaGUgbmV3IHBvaW50LCB0cmFuc2Zvcm1lZCB0aHJvdWdoIHRoaXMgbWF0cml4XG4gICAgICovXG4gICAgYXBwbHkocG9zLCBuZXdQb3MpXG4gICAge1xuICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XG5cbiAgICAgICAgY29uc3QgeCA9IHBvcy54O1xuICAgICAgICBjb25zdCB5ID0gcG9zLnk7XG5cbiAgICAgICAgbmV3UG9zLnggPSAodGhpcy5hICogeCkgKyAodGhpcy5jICogeSkgKyB0aGlzLnR4O1xuICAgICAgICBuZXdQb3MueSA9ICh0aGlzLmIgKiB4KSArICh0aGlzLmQgKiB5KSArIHRoaXMudHk7XG5cbiAgICAgICAgcmV0dXJuIG5ld1BvcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBuZXcgcG9zaXRpb24gd2l0aCB0aGUgaW52ZXJzZSBvZiB0aGUgY3VycmVudCB0cmFuc2Zvcm1hdGlvbiBhcHBsaWVkLlxuICAgICAqIENhbiBiZSB1c2VkIHRvIGdvIGZyb20gdGhlIHdvcmxkIGNvb3JkaW5hdGUgc3BhY2UgdG8gYSBjaGlsZCdzIGNvb3JkaW5hdGUgc3BhY2UuIChlLmcuIGlucHV0KVxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBwb3MgLSBUaGUgb3JpZ2luXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBbbmV3UG9zXSAtIFRoZSBwb2ludCB0aGF0IHRoZSBuZXcgcG9zaXRpb24gaXMgYXNzaWduZWQgdG8gKGFsbG93ZWQgdG8gYmUgc2FtZSBhcyBpbnB1dClcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlBvaW50fSBUaGUgbmV3IHBvaW50LCBpbnZlcnNlLXRyYW5zZm9ybWVkIHRocm91Z2ggdGhpcyBtYXRyaXhcbiAgICAgKi9cbiAgICBhcHBseUludmVyc2UocG9zLCBuZXdQb3MpXG4gICAge1xuICAgICAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XG5cbiAgICAgICAgY29uc3QgaWQgPSAxIC8gKCh0aGlzLmEgKiB0aGlzLmQpICsgKHRoaXMuYyAqIC10aGlzLmIpKTtcblxuICAgICAgICBjb25zdCB4ID0gcG9zLng7XG4gICAgICAgIGNvbnN0IHkgPSBwb3MueTtcblxuICAgICAgICBuZXdQb3MueCA9ICh0aGlzLmQgKiBpZCAqIHgpICsgKC10aGlzLmMgKiBpZCAqIHkpICsgKCgodGhpcy50eSAqIHRoaXMuYykgLSAodGhpcy50eCAqIHRoaXMuZCkpICogaWQpO1xuICAgICAgICBuZXdQb3MueSA9ICh0aGlzLmEgKiBpZCAqIHkpICsgKC10aGlzLmIgKiBpZCAqIHgpICsgKCgoLXRoaXMudHkgKiB0aGlzLmEpICsgKHRoaXMudHggKiB0aGlzLmIpKSAqIGlkKTtcblxuICAgICAgICByZXR1cm4gbmV3UG9zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZXMgdGhlIG1hdHJpeCBvbiB0aGUgeCBhbmQgeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IEhvdyBtdWNoIHRvIHRyYW5zbGF0ZSB4IGJ5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgSG93IG11Y2ggdG8gdHJhbnNsYXRlIHkgYnlcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICB0cmFuc2xhdGUoeCwgeSlcbiAgICB7XG4gICAgICAgIHRoaXMudHggKz0geDtcbiAgICAgICAgdGhpcy50eSArPSB5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgYSBzY2FsZSB0cmFuc2Zvcm1hdGlvbiB0byB0aGUgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIGFtb3VudCB0byBzY2FsZSBob3Jpem9udGFsbHlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSBUaGUgYW1vdW50IHRvIHNjYWxlIHZlcnRpY2FsbHlcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBzY2FsZSh4LCB5KVxuICAgIHtcbiAgICAgICAgdGhpcy5hICo9IHg7XG4gICAgICAgIHRoaXMuZCAqPSB5O1xuICAgICAgICB0aGlzLmMgKj0geDtcbiAgICAgICAgdGhpcy5iICo9IHk7XG4gICAgICAgIHRoaXMudHggKj0geDtcbiAgICAgICAgdGhpcy50eSAqPSB5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgYSByb3RhdGlvbiB0cmFuc2Zvcm1hdGlvbiB0byB0aGUgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIGluIHJhZGlhbnMuXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgcm90YXRlKGFuZ2xlKVxuICAgIHtcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgICAgY29uc3QgYTEgPSB0aGlzLmE7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jO1xuICAgICAgICBjb25zdCB0eDEgPSB0aGlzLnR4O1xuXG4gICAgICAgIHRoaXMuYSA9IChhMSAqIGNvcykgLSAodGhpcy5iICogc2luKTtcbiAgICAgICAgdGhpcy5iID0gKGExICogc2luKSArICh0aGlzLmIgKiBjb3MpO1xuICAgICAgICB0aGlzLmMgPSAoYzEgKiBjb3MpIC0gKHRoaXMuZCAqIHNpbik7XG4gICAgICAgIHRoaXMuZCA9IChjMSAqIHNpbikgKyAodGhpcy5kICogY29zKTtcbiAgICAgICAgdGhpcy50eCA9ICh0eDEgKiBjb3MpIC0gKHRoaXMudHkgKiBzaW4pO1xuICAgICAgICB0aGlzLnR5ID0gKHR4MSAqIHNpbikgKyAodGhpcy50eSAqIGNvcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kcyB0aGUgZ2l2ZW4gTWF0cml4IHRvIHRoaXMgTWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLk1hdHJpeH0gbWF0cml4IC0gVGhlIG1hdHJpeCB0byBhcHBlbmQuXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgYXBwZW5kKG1hdHJpeClcbiAgICB7XG4gICAgICAgIGNvbnN0IGExID0gdGhpcy5hO1xuICAgICAgICBjb25zdCBiMSA9IHRoaXMuYjtcbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmM7XG4gICAgICAgIGNvbnN0IGQxID0gdGhpcy5kO1xuXG4gICAgICAgIHRoaXMuYSA9IChtYXRyaXguYSAqIGExKSArIChtYXRyaXguYiAqIGMxKTtcbiAgICAgICAgdGhpcy5iID0gKG1hdHJpeC5hICogYjEpICsgKG1hdHJpeC5iICogZDEpO1xuICAgICAgICB0aGlzLmMgPSAobWF0cml4LmMgKiBhMSkgKyAobWF0cml4LmQgKiBjMSk7XG4gICAgICAgIHRoaXMuZCA9IChtYXRyaXguYyAqIGIxKSArIChtYXRyaXguZCAqIGQxKTtcblxuICAgICAgICB0aGlzLnR4ID0gKG1hdHJpeC50eCAqIGExKSArIChtYXRyaXgudHkgKiBjMSkgKyB0aGlzLnR4O1xuICAgICAgICB0aGlzLnR5ID0gKG1hdHJpeC50eCAqIGIxKSArIChtYXRyaXgudHkgKiBkMSkgKyB0aGlzLnR5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG1hdHJpeCBiYXNlZCBvbiBhbGwgdGhlIGF2YWlsYWJsZSBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFBvc2l0aW9uIG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFBvc2l0aW9uIG9uIHRoZSB5IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGl2b3RYIC0gUGl2b3Qgb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwaXZvdFkgLSBQaXZvdCBvbiB0aGUgeSBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNjYWxlWCAtIFNjYWxlIG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2NhbGVZIC0gU2NhbGUgb24gdGhlIHkgYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3RhdGlvbiAtIFJvdGF0aW9uIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2tld1ggLSBTa2V3IG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2tld1kgLSBTa2V3IG9uIHRoZSB5IGF4aXNcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBzZXRUcmFuc2Zvcm0oeCwgeSwgcGl2b3RYLCBwaXZvdFksIHNjYWxlWCwgc2NhbGVZLCByb3RhdGlvbiwgc2tld1gsIHNrZXdZKVxuICAgIHtcbiAgICAgICAgY29uc3Qgc3IgPSBNYXRoLnNpbihyb3RhdGlvbik7XG4gICAgICAgIGNvbnN0IGNyID0gTWF0aC5jb3Mocm90YXRpb24pO1xuICAgICAgICBjb25zdCBjeSA9IE1hdGguY29zKHNrZXdZKTtcbiAgICAgICAgY29uc3Qgc3kgPSBNYXRoLnNpbihza2V3WSk7XG4gICAgICAgIGNvbnN0IG5zeCA9IC1NYXRoLnNpbihza2V3WCk7XG4gICAgICAgIGNvbnN0IGN4ID0gTWF0aC5jb3Moc2tld1gpO1xuXG4gICAgICAgIGNvbnN0IGEgPSBjciAqIHNjYWxlWDtcbiAgICAgICAgY29uc3QgYiA9IHNyICogc2NhbGVYO1xuICAgICAgICBjb25zdCBjID0gLXNyICogc2NhbGVZO1xuICAgICAgICBjb25zdCBkID0gY3IgKiBzY2FsZVk7XG5cbiAgICAgICAgdGhpcy5hID0gKGN5ICogYSkgKyAoc3kgKiBjKTtcbiAgICAgICAgdGhpcy5iID0gKGN5ICogYikgKyAoc3kgKiBkKTtcbiAgICAgICAgdGhpcy5jID0gKG5zeCAqIGEpICsgKGN4ICogYyk7XG4gICAgICAgIHRoaXMuZCA9IChuc3ggKiBiKSArIChjeCAqIGQpO1xuXG4gICAgICAgIHRoaXMudHggPSB4ICsgKChwaXZvdFggKiBhKSArIChwaXZvdFkgKiBjKSk7XG4gICAgICAgIHRoaXMudHkgPSB5ICsgKChwaXZvdFggKiBiKSArIChwaXZvdFkgKiBkKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJlcGVuZHMgdGhlIGdpdmVuIE1hdHJpeCB0byB0aGlzIE1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5NYXRyaXh9IG1hdHJpeCAtIFRoZSBtYXRyaXggdG8gcHJlcGVuZFxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIHByZXBlbmQobWF0cml4KVxuICAgIHtcbiAgICAgICAgY29uc3QgdHgxID0gdGhpcy50eDtcblxuICAgICAgICBpZiAobWF0cml4LmEgIT09IDEgfHwgbWF0cml4LmIgIT09IDAgfHwgbWF0cml4LmMgIT09IDAgfHwgbWF0cml4LmQgIT09IDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGExID0gdGhpcy5hO1xuICAgICAgICAgICAgY29uc3QgYzEgPSB0aGlzLmM7XG5cbiAgICAgICAgICAgIHRoaXMuYSA9IChhMSAqIG1hdHJpeC5hKSArICh0aGlzLmIgKiBtYXRyaXguYyk7XG4gICAgICAgICAgICB0aGlzLmIgPSAoYTEgKiBtYXRyaXguYikgKyAodGhpcy5iICogbWF0cml4LmQpO1xuICAgICAgICAgICAgdGhpcy5jID0gKGMxICogbWF0cml4LmEpICsgKHRoaXMuZCAqIG1hdHJpeC5jKTtcbiAgICAgICAgICAgIHRoaXMuZCA9IChjMSAqIG1hdHJpeC5iKSArICh0aGlzLmQgKiBtYXRyaXguZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnR4ID0gKHR4MSAqIG1hdHJpeC5hKSArICh0aGlzLnR5ICogbWF0cml4LmMpICsgbWF0cml4LnR4O1xuICAgICAgICB0aGlzLnR5ID0gKHR4MSAqIG1hdHJpeC5iKSArICh0aGlzLnR5ICogbWF0cml4LmQpICsgbWF0cml4LnR5O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlY29tcG9zZXMgdGhlIG1hdHJpeCAoeCwgeSwgc2NhbGVYLCBzY2FsZVksIGFuZCByb3RhdGlvbikgYW5kIHNldHMgdGhlIHByb3BlcnRpZXMgb24gdG8gYSB0cmFuc2Zvcm0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuVHJhbnNmb3JtfFBJWEkuVHJhbnNmb3JtU3RhdGljfSB0cmFuc2Zvcm0gLSBUaGUgdHJhbnNmb3JtIHRvIGFwcGx5IHRoZSBwcm9wZXJ0aWVzIHRvLlxuICAgICAqIEByZXR1cm4ge1BJWEkuVHJhbnNmb3JtfFBJWEkuVHJhbnNmb3JtU3RhdGljfSBUaGUgdHJhbnNmb3JtIHdpdGggdGhlIG5ld2x5IGFwcGxpZWQgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGRlY29tcG9zZSh0cmFuc2Zvcm0pXG4gICAge1xuICAgICAgICAvLyBzb3J0IG91dCByb3RhdGlvbiAvIHNrZXcuLlxuICAgICAgICBjb25zdCBhID0gdGhpcy5hO1xuICAgICAgICBjb25zdCBiID0gdGhpcy5iO1xuICAgICAgICBjb25zdCBjID0gdGhpcy5jO1xuICAgICAgICBjb25zdCBkID0gdGhpcy5kO1xuXG4gICAgICAgIGNvbnN0IHNrZXdYID0gLU1hdGguYXRhbjIoLWMsIGQpO1xuICAgICAgICBjb25zdCBza2V3WSA9IE1hdGguYXRhbjIoYiwgYSk7XG5cbiAgICAgICAgY29uc3QgZGVsdGEgPSBNYXRoLmFicyhza2V3WCArIHNrZXdZKTtcblxuICAgICAgICBpZiAoZGVsdGEgPCAwLjAwMDAxKVxuICAgICAgICB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24gPSBza2V3WTtcblxuICAgICAgICAgICAgaWYgKGEgPCAwICYmIGQgPj0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24gKz0gKHRyYW5zZm9ybS5yb3RhdGlvbiA8PSAwKSA/IE1hdGguUEkgOiAtTWF0aC5QSTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJhbnNmb3JtLnNrZXcueCA9IHRyYW5zZm9ybS5za2V3LnkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdHJhbnNmb3JtLnNrZXcueCA9IHNrZXdYO1xuICAgICAgICAgICAgdHJhbnNmb3JtLnNrZXcueSA9IHNrZXdZO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbmV4dCBzZXQgc2NhbGVcbiAgICAgICAgdHJhbnNmb3JtLnNjYWxlLnggPSBNYXRoLnNxcnQoKGEgKiBhKSArIChiICogYikpO1xuICAgICAgICB0cmFuc2Zvcm0uc2NhbGUueSA9IE1hdGguc3FydCgoYyAqIGMpICsgKGQgKiBkKSk7XG5cbiAgICAgICAgLy8gbmV4dCBzZXQgcG9zaXRpb25cbiAgICAgICAgdHJhbnNmb3JtLnBvc2l0aW9uLnggPSB0aGlzLnR4O1xuICAgICAgICB0cmFuc2Zvcm0ucG9zaXRpb24ueSA9IHRoaXMudHk7XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZlcnRzIHRoaXMgbWF0cml4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBpbnZlcnQoKVxuICAgIHtcbiAgICAgICAgY29uc3QgYTEgPSB0aGlzLmE7XG4gICAgICAgIGNvbnN0IGIxID0gdGhpcy5iO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuYztcbiAgICAgICAgY29uc3QgZDEgPSB0aGlzLmQ7XG4gICAgICAgIGNvbnN0IHR4MSA9IHRoaXMudHg7XG4gICAgICAgIGNvbnN0IG4gPSAoYTEgKiBkMSkgLSAoYjEgKiBjMSk7XG5cbiAgICAgICAgdGhpcy5hID0gZDEgLyBuO1xuICAgICAgICB0aGlzLmIgPSAtYjEgLyBuO1xuICAgICAgICB0aGlzLmMgPSAtYzEgLyBuO1xuICAgICAgICB0aGlzLmQgPSBhMSAvIG47XG4gICAgICAgIHRoaXMudHggPSAoKGMxICogdGhpcy50eSkgLSAoZDEgKiB0eDEpKSAvIG47XG4gICAgICAgIHRoaXMudHkgPSAtKChhMSAqIHRoaXMudHkpIC0gKGIxICogdHgxKSkgLyBuO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGlzIE1hdGl4IHRvIGFuIGlkZW50aXR5IChkZWZhdWx0KSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBpZGVudGl0eSgpXG4gICAge1xuICAgICAgICB0aGlzLmEgPSAxO1xuICAgICAgICB0aGlzLmIgPSAwO1xuICAgICAgICB0aGlzLmMgPSAwO1xuICAgICAgICB0aGlzLmQgPSAxO1xuICAgICAgICB0aGlzLnR4ID0gMDtcbiAgICAgICAgdGhpcy50eSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBNYXRyaXggb2JqZWN0IHdpdGggdGhlIHNhbWUgdmFsdWVzIGFzIHRoaXMgb25lLlxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IEEgY29weSBvZiB0aGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoKTtcblxuICAgICAgICBtYXRyaXguYSA9IHRoaXMuYTtcbiAgICAgICAgbWF0cml4LmIgPSB0aGlzLmI7XG4gICAgICAgIG1hdHJpeC5jID0gdGhpcy5jO1xuICAgICAgICBtYXRyaXguZCA9IHRoaXMuZDtcbiAgICAgICAgbWF0cml4LnR4ID0gdGhpcy50eDtcbiAgICAgICAgbWF0cml4LnR5ID0gdGhpcy50eTtcblxuICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHZhbHVlcyBvZiB0aGUgZ2l2ZW4gbWF0cml4IHRvIGJlIHRoZSBzYW1lIGFzIHRoZSBvbmVzIGluIHRoaXMgbWF0cml4XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuTWF0cml4fSBtYXRyaXggLSBUaGUgbWF0cml4IHRvIGNvcHkgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhlIG1hdHJpeCBnaXZlbiBpbiBwYXJhbWV0ZXIgd2l0aCBpdHMgdmFsdWVzIHVwZGF0ZWQuXG4gICAgICovXG4gICAgY29weShtYXRyaXgpXG4gICAge1xuICAgICAgICBtYXRyaXguYSA9IHRoaXMuYTtcbiAgICAgICAgbWF0cml4LmIgPSB0aGlzLmI7XG4gICAgICAgIG1hdHJpeC5jID0gdGhpcy5jO1xuICAgICAgICBtYXRyaXguZCA9IHRoaXMuZDtcbiAgICAgICAgbWF0cml4LnR4ID0gdGhpcy50eDtcbiAgICAgICAgbWF0cml4LnR5ID0gdGhpcy50eTtcblxuICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZGVmYXVsdCAoaWRlbnRpdHkpIG1hdHJpeFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBjb25zdFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgSURFTlRJVFkoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIHRlbXAgbWF0cml4XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGNvbnN0XG4gICAgICovXG4gICAgc3RhdGljIGdldCBURU1QX01BVFJJWCgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCgpO1xuICAgIH1cbn1cbiIsIi8vIFlvdXIgZnJpZW5kbHkgbmVpZ2hib3VyIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0RpaGVkcmFsX2dyb3VwIG9mIG9yZGVyIDE2XG5pbXBvcnQgTWF0cml4IGZyb20gJy4vTWF0cml4JztcblxuY29uc3QgdXggPSBbMSwgMSwgMCwgLTEsIC0xLCAtMSwgMCwgMSwgMSwgMSwgMCwgLTEsIC0xLCAtMSwgMCwgMV07XG5jb25zdCB1eSA9IFswLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xXTtcbmNvbnN0IHZ4ID0gWzAsIC0xLCAtMSwgLTEsIDAsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDAsIC0xLCAtMSwgLTFdO1xuY29uc3QgdnkgPSBbMSwgMSwgMCwgLTEsIC0xLCAtMSwgMCwgMSwgLTEsIC0xLCAwLCAxLCAxLCAxLCAwLCAtMV07XG5jb25zdCB0ZW1wTWF0cmljZXMgPSBbXTtcblxuY29uc3QgbXVsID0gW107XG5cbmZ1bmN0aW9uIHNpZ251bSh4KVxue1xuICAgIGlmICh4IDwgMClcbiAgICB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgaWYgKHggPiAwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGluaXQoKVxue1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKylcbiAgICB7XG4gICAgICAgIGNvbnN0IHJvdyA9IFtdO1xuXG4gICAgICAgIG11bC5wdXNoKHJvdyk7XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxNjsgaisrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBfdXggPSBzaWdudW0oKHV4W2ldICogdXhbal0pICsgKHZ4W2ldICogdXlbal0pKTtcbiAgICAgICAgICAgIGNvbnN0IF91eSA9IHNpZ251bSgodXlbaV0gKiB1eFtqXSkgKyAodnlbaV0gKiB1eVtqXSkpO1xuICAgICAgICAgICAgY29uc3QgX3Z4ID0gc2lnbnVtKCh1eFtpXSAqIHZ4W2pdKSArICh2eFtpXSAqIHZ5W2pdKSk7XG4gICAgICAgICAgICBjb25zdCBfdnkgPSBzaWdudW0oKHV5W2ldICogdnhbal0pICsgKHZ5W2ldICogdnlbal0pKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCAxNjsgaysrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh1eFtrXSA9PT0gX3V4ICYmIHV5W2tdID09PSBfdXkgJiYgdnhba10gPT09IF92eCAmJiB2eVtrXSA9PT0gX3Z5KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goayk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKylcbiAgICB7XG4gICAgICAgIGNvbnN0IG1hdCA9IG5ldyBNYXRyaXgoKTtcblxuICAgICAgICBtYXQuc2V0KHV4W2ldLCB1eVtpXSwgdnhbaV0sIHZ5W2ldLCAwLCAwKTtcbiAgICAgICAgdGVtcE1hdHJpY2VzLnB1c2gobWF0KTtcbiAgICB9XG59XG5cbmluaXQoKTtcblxuLyoqXG4gKiBJbXBsZW1lbnRzIERpaGVkcmFsIEdyb3VwIERfOCwgc2VlIFtncm91cCBENF17QGxpbmsgaHR0cDovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9EaWhlZHJhbEdyb3VwRDQuaHRtbH0sXG4gKiBEOCBpcyB0aGUgc2FtZSBidXQgd2l0aCBkaWFnb25hbHMuIFVzZWQgZm9yIHRleHR1cmUgcm90YXRpb25zLlxuICpcbiAqIFZlY3RvciB4WChpKSwgeFkoaSkgaXMgVS1heGlzIG9mIHNwcml0ZSB3aXRoIHJvdGF0aW9uIGlcbiAqIFZlY3RvciB5WShpKSwgeVkoaSkgaXMgVi1heGlzIG9mIHNwcml0ZSB3aXRoIHJvdGF0aW9uIGlcbiAqIFJvdGF0aW9uczogMCBncmFkICgwKSwgOTAgZ3JhZCAoMiksIDE4MCBncmFkICg0KSwgMjcwIGdyYWQgKDYpXG4gKiBNaXJyb3JzOiB2ZXJ0aWNhbCAoOCksIG1haW4gZGlhZ29uYWwgKDEwKSwgaG9yaXpvbnRhbCAoMTIpLCByZXZlcnNlIGRpYWdvbmFsICgxNClcbiAqIFRoaXMgaXMgdGhlIHNtYWxsIHBhcnQgb2YgZ2FtZW9mYm9tYnMuY29tIHBvcnRhbCBzeXN0ZW0uIEl0IHdvcmtzLlxuICpcbiAqIEBhdXRob3IgSXZhbiBAaXZhbnBvcGVseXNoZXZcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuY29uc3QgR3JvdXBEOCA9IHtcbiAgICBFOiAwLFxuICAgIFNFOiAxLFxuICAgIFM6IDIsXG4gICAgU1c6IDMsXG4gICAgVzogNCxcbiAgICBOVzogNSxcbiAgICBOOiA2LFxuICAgIE5FOiA3LFxuICAgIE1JUlJPUl9WRVJUSUNBTDogOCxcbiAgICBNSVJST1JfSE9SSVpPTlRBTDogMTIsXG4gICAgdVg6IChpbmQpID0+IHV4W2luZF0sXG4gICAgdVk6IChpbmQpID0+IHV5W2luZF0sXG4gICAgdlg6IChpbmQpID0+IHZ4W2luZF0sXG4gICAgdlk6IChpbmQpID0+IHZ5W2luZF0sXG4gICAgaW52OiAocm90YXRpb24pID0+XG4gICAge1xuICAgICAgICBpZiAocm90YXRpb24gJiA4KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gcm90YXRpb24gJiAxNTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoLXJvdGF0aW9uKSAmIDc7XG4gICAgfSxcbiAgICBhZGQ6IChyb3RhdGlvblNlY29uZCwgcm90YXRpb25GaXJzdCkgPT4gbXVsW3JvdGF0aW9uU2Vjb25kXVtyb3RhdGlvbkZpcnN0XSxcbiAgICBzdWI6IChyb3RhdGlvblNlY29uZCwgcm90YXRpb25GaXJzdCkgPT4gbXVsW3JvdGF0aW9uU2Vjb25kXVtHcm91cEQ4Lmludihyb3RhdGlvbkZpcnN0KV0sXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIDE4MCBkZWdyZWVzIHRvIHJvdGF0aW9uLiBDb21tdXRhdGl2ZSBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgUElYSS5Hcm91cEQ4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdGF0aW9uIC0gVGhlIG51bWJlciB0byByb3RhdGUuXG4gICAgICogQHJldHVybnMge251bWJlcn0gcm90YXRlZCBudW1iZXJcbiAgICAgKi9cbiAgICByb3RhdGUxODA6IChyb3RhdGlvbikgPT4gcm90YXRpb24gXiA0LFxuXG4gICAgLyoqXG4gICAgICogSSBkb250IGtub3cgd2h5IHNvbWV0aW1lcyB3aWR0aCBhbmQgaGVpZ2h0cyBuZWVkcyB0byBiZSBzd2FwcGVkLiBXZSdsbCBmaXggaXQgbGF0ZXIuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgUElYSS5Hcm91cEQ4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdGF0aW9uIC0gVGhlIG51bWJlciB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHdpZHRoL2hlaWdodCBzaG91bGQgYmUgc3dhcHBlZC5cbiAgICAgKi9cbiAgICBpc1N3YXBXaWR0aEhlaWdodDogKHJvdGF0aW9uKSA9PiAocm90YXRpb24gJiAzKSA9PT0gMixcblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBQSVhJLkdyb3VwRDhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHggLSBUT0RPXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5IC0gVE9ET1xuICAgICAqXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUT0RPXG4gICAgICovXG4gICAgYnlEaXJlY3Rpb246IChkeCwgZHkpID0+XG4gICAge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZHgpICogMiA8PSBNYXRoLmFicyhkeSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChkeSA+PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBHcm91cEQ4LlM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBHcm91cEQ4Lk47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoTWF0aC5hYnMoZHkpICogMiA8PSBNYXRoLmFicyhkeCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChkeCA+IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguVztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeSA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChkeCA+IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguU0U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBHcm91cEQ4LlNXO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR4ID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguTkU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gR3JvdXBEOC5OVztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGVscHMgc3ByaXRlIHRvIGNvbXBlbnNhdGUgdGV4dHVyZSBwYWNrZXIgcm90YXRpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgUElYSS5Hcm91cEQ4XG4gICAgICogQHBhcmFtIHtQSVhJLk1hdHJpeH0gbWF0cml4IC0gc3ByaXRlIHdvcmxkIG1hdHJpeFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3RhdGlvbiAtIFRoZSByb3RhdGlvbiBmYWN0b3IgdG8gdXNlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eCAtIHNwcml0ZSBhbmNob3JpbmdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHkgLSBzcHJpdGUgYW5jaG9yaW5nXG4gICAgICovXG4gICAgbWF0cml4QXBwZW5kUm90YXRpb25JbnY6IChtYXRyaXgsIHJvdGF0aW9uLCB0eCA9IDAsIHR5ID0gMCkgPT5cbiAgICB7XG4gICAgICAgIC8vIFBhY2tlciB1c2VkIFwicm90YXRpb25cIiwgd2UgdXNlIFwiaW52KHJvdGF0aW9uKVwiXG4gICAgICAgIGNvbnN0IG1hdCA9IHRlbXBNYXRyaWNlc1tHcm91cEQ4Lmludihyb3RhdGlvbildO1xuXG4gICAgICAgIG1hdC50eCA9IHR4O1xuICAgICAgICBtYXQudHkgPSB0eTtcbiAgICAgICAgbWF0cml4LmFwcGVuZChtYXQpO1xuICAgIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBHcm91cEQ4O1xuIiwiaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vLi4vY29uc3QnO1xuXG4vKipcbiAqIFJlY3RhbmdsZSBvYmplY3QgaXMgYW4gYXJlYSBkZWZpbmVkIGJ5IGl0cyBwb3NpdGlvbiwgYXMgaW5kaWNhdGVkIGJ5IGl0cyB0b3AtbGVmdCBjb3JuZXJcbiAqIHBvaW50ICh4LCB5KSBhbmQgYnkgaXRzIHdpZHRoIGFuZCBpdHMgaGVpZ2h0LlxuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgdXBwZXItbGVmdCBjb3JuZXIgb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHVwcGVyLWxlZnQgY29ybmVyIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3dpZHRoPTBdIC0gVGhlIG92ZXJhbGwgd2lkdGggb2YgdGhpcyByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodD0wXSAtIFRoZSBvdmVyYWxsIGhlaWdodCBvZiB0aGlzIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5SRUNUXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5SRUNUO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGxlZnQgZWRnZSBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGxlZnQoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSByaWdodCBlZGdlIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgcmlnaHQoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgdG9wIGVkZ2Ugb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCB0b3AoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBib3R0b20gZWRnZSBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGJvdHRvbSgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBjb25zdGFudCBlbXB0eSByZWN0YW5nbGUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgc3RhdGljIGdldCBFTVBUWSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSgwLCAwLCAwLCAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBSZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuUmVjdGFuZ2xlfSBhIGNvcHkgb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIGFub3RoZXIgcmVjdGFuZ2xlIHRvIHRoaXMgb25lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlJlY3RhbmdsZX0gcmVjdGFuZ2xlIC0gVGhlIHJlY3RhbmdsZSB0byBjb3B5LlxuICAgICAqIEByZXR1cm4ge1BJWEkuUmVjdGFuZ2xlfSBSZXR1cm5zIGl0c2VsZi5cbiAgICAgKi9cbiAgICBjb3B5KHJlY3RhbmdsZSlcbiAgICB7XG4gICAgICAgIHRoaXMueCA9IHJlY3RhbmdsZS54O1xuICAgICAgICB0aGlzLnkgPSByZWN0YW5nbGUueTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHJlY3RhbmdsZS53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSByZWN0YW5nbGUuaGVpZ2h0O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgUmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSB4L3kgY29vcmRpbmF0ZXMgYXJlIHdpdGhpbiB0aGlzIFJlY3RhbmdsZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy53aWR0aCA8PSAwIHx8IHRoaXMuaGVpZ2h0IDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh4ID49IHRoaXMueCAmJiB4IDwgdGhpcy54ICsgdGhpcy53aWR0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHkgPj0gdGhpcy55ICYmIHkgPCB0aGlzLnkgKyB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYWRzIHRoZSByZWN0YW5nbGUgbWFraW5nIGl0IGdyb3cgaW4gYWxsIGRpcmVjdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZ1ggLSBUaGUgaG9yaXpvbnRhbCBwYWRkaW5nIGFtb3VudC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZ1kgLSBUaGUgdmVydGljYWwgcGFkZGluZyBhbW91bnQuXG4gICAgICovXG4gICAgcGFkKHBhZGRpbmdYLCBwYWRkaW5nWSlcbiAgICB7XG4gICAgICAgIHBhZGRpbmdYID0gcGFkZGluZ1ggfHwgMDtcbiAgICAgICAgcGFkZGluZ1kgPSBwYWRkaW5nWSB8fCAoKHBhZGRpbmdZICE9PSAwKSA/IHBhZGRpbmdYIDogMCk7XG5cbiAgICAgICAgdGhpcy54IC09IHBhZGRpbmdYO1xuICAgICAgICB0aGlzLnkgLT0gcGFkZGluZ1k7XG5cbiAgICAgICAgdGhpcy53aWR0aCArPSBwYWRkaW5nWCAqIDI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ICs9IHBhZGRpbmdZICogMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXRzIHRoaXMgcmVjdGFuZ2xlIGFyb3VuZCB0aGUgcGFzc2VkIG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5SZWN0YW5nbGV9IHJlY3RhbmdsZSAtIFRoZSByZWN0YW5nbGUgdG8gZml0LlxuICAgICAqL1xuICAgIGZpdChyZWN0YW5nbGUpXG4gICAge1xuICAgICAgICBpZiAodGhpcy54IDwgcmVjdGFuZ2xlLngpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMud2lkdGggKz0gdGhpcy54O1xuICAgICAgICAgICAgaWYgKHRoaXMud2lkdGggPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnggPSByZWN0YW5nbGUueDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnkgPCByZWN0YW5nbGUueSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgKz0gdGhpcy55O1xuICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0IDwgMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnkgPSByZWN0YW5nbGUueTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnggKyB0aGlzLndpZHRoID4gcmVjdGFuZ2xlLnggKyByZWN0YW5nbGUud2lkdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSByZWN0YW5nbGUud2lkdGggLSB0aGlzLng7XG4gICAgICAgICAgICBpZiAodGhpcy53aWR0aCA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy55ICsgdGhpcy5oZWlnaHQgPiByZWN0YW5nbGUueSArIHJlY3RhbmdsZS5oZWlnaHQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gcmVjdGFuZ2xlLmhlaWdodCAtIHRoaXMueTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhlaWdodCA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5sYXJnZXMgdGhpcyByZWN0YW5nbGUgdG8gaW5jbHVkZSB0aGUgcGFzc2VkIHJlY3RhbmdsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5SZWN0YW5nbGV9IHJlY3RhbmdsZSAtIFRoZSByZWN0YW5nbGUgdG8gaW5jbHVkZS5cbiAgICAgKi9cbiAgICBlbmxhcmdlKHJlY3RhbmdsZSlcbiAgICB7XG4gICAgICAgIGNvbnN0IHgxID0gTWF0aC5taW4odGhpcy54LCByZWN0YW5nbGUueCk7XG4gICAgICAgIGNvbnN0IHgyID0gTWF0aC5tYXgodGhpcy54ICsgdGhpcy53aWR0aCwgcmVjdGFuZ2xlLnggKyByZWN0YW5nbGUud2lkdGgpO1xuICAgICAgICBjb25zdCB5MSA9IE1hdGgubWluKHRoaXMueSwgcmVjdGFuZ2xlLnkpO1xuICAgICAgICBjb25zdCB5MiA9IE1hdGgubWF4KHRoaXMueSArIHRoaXMuaGVpZ2h0LCByZWN0YW5nbGUueSArIHJlY3RhbmdsZS5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMueCA9IHgxO1xuICAgICAgICB0aGlzLndpZHRoID0geDIgLSB4MTtcbiAgICAgICAgdGhpcy55ID0geTE7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0geTIgLSB5MTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4vUmVjdGFuZ2xlJztcbmltcG9ydCB7IFNIQVBFUyB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuLyoqXG4gKiBUaGUgQ2lyY2xlIG9iamVjdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGEgaGl0IGFyZWEgZm9yIGRpc3BsYXlPYmplY3RzXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXJjbGVcbntcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBjZW50ZXIgb2YgdGhpcyBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBjZW50ZXIgb2YgdGhpcyBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3JhZGl1cz0wXSAtIFRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgcmFkaXVzID0gMClcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueCA9IHg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy55ID0geTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5DSVJDXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5DSVJDO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIENpcmNsZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5DaXJjbGV9IGEgY29weSBvZiB0aGUgQ2lyY2xlXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgeCBhbmQgeSBjb29yZGluYXRlcyBnaXZlbiBhcmUgY29udGFpbmVkIHdpdGhpbiB0aGlzIGNpcmNsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkaW5hdGVzIGFyZSB3aXRoaW4gdGhpcyBDaXJjbGVcbiAgICAgKi9cbiAgICBjb250YWlucyh4LCB5KVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMucmFkaXVzIDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHIyID0gdGhpcy5yYWRpdXMgKiB0aGlzLnJhZGl1cztcbiAgICAgICAgbGV0IGR4ID0gKHRoaXMueCAtIHgpO1xuICAgICAgICBsZXQgZHkgPSAodGhpcy55IC0geSk7XG5cbiAgICAgICAgZHggKj0gZHg7XG4gICAgICAgIGR5ICo9IGR5O1xuXG4gICAgICAgIHJldHVybiAoZHggKyBkeSA8PSByMik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBSZXR1cm5zIHRoZSBmcmFtaW5nIHJlY3RhbmdsZSBvZiB0aGUgY2lyY2xlIGFzIGEgUmVjdGFuZ2xlIG9iamVjdFxuICAgICpcbiAgICAqIEByZXR1cm4ge1BJWEkuUmVjdGFuZ2xlfSB0aGUgZnJhbWluZyByZWN0YW5nbGVcbiAgICAqL1xuICAgIGdldEJvdW5kcygpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLnggLSB0aGlzLnJhZGl1cywgdGhpcy55IC0gdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzICogMiwgdGhpcy5yYWRpdXMgKiAyKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4vUmVjdGFuZ2xlJztcbmltcG9ydCB7IFNIQVBFUyB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuLyoqXG4gKiBUaGUgRWxsaXBzZSBvYmplY3QgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBhIGhpdCBhcmVhIGZvciBkaXNwbGF5T2JqZWN0c1xuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxsaXBzZVxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRlciBvZiB0aGlzIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRlciBvZiB0aGlzIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbd2lkdGg9MF0gLSBUaGUgaGFsZiB3aWR0aCBvZiB0aGlzIGVsbGlwc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodD0wXSAtIFRoZSBoYWxmIGhlaWdodCBvZiB0aGlzIGVsbGlwc2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMClcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueCA9IHg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy55ID0geTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QsIG1haW5seSB1c2VkIHRvIGF2b2lkIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgUElYSS5TSEFQRVMuRUxJUFxuICAgICAgICAgKiBAc2VlIFBJWEkuU0hBUEVTXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5cGUgPSBTSEFQRVMuRUxJUDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBFbGxpcHNlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkVsbGlwc2V9IGEgY29weSBvZiB0aGUgZWxsaXBzZVxuICAgICAqL1xuICAgIGNsb25lKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgRWxsaXBzZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgZWxsaXBzZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkcyBhcmUgd2l0aGluIHRoaXMgZWxsaXBzZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy53aWR0aCA8PSAwIHx8IHRoaXMuaGVpZ2h0IDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vcm1hbGl6ZSB0aGUgY29vcmRzIHRvIGFuIGVsbGlwc2Ugd2l0aCBjZW50ZXIgMCwwXG4gICAgICAgIGxldCBub3JteCA9ICgoeCAtIHRoaXMueCkgLyB0aGlzLndpZHRoKTtcbiAgICAgICAgbGV0IG5vcm15ID0gKCh5IC0gdGhpcy55KSAvIHRoaXMuaGVpZ2h0KTtcblxuICAgICAgICBub3JteCAqPSBub3JteDtcbiAgICAgICAgbm9ybXkgKj0gbm9ybXk7XG5cbiAgICAgICAgcmV0dXJuIChub3JteCArIG5vcm15IDw9IDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGZyYW1pbmcgcmVjdGFuZ2xlIG9mIHRoZSBlbGxpcHNlIGFzIGEgUmVjdGFuZ2xlIG9iamVjdFxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5SZWN0YW5nbGV9IHRoZSBmcmFtaW5nIHJlY3RhbmdsZVxuICAgICAqL1xuICAgIGdldEJvdW5kcygpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZSh0aGlzLnggLSB0aGlzLndpZHRoLCB0aGlzLnkgLSB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBQb2ludCBmcm9tICcuLi9Qb2ludCc7XG5pbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2x5Z29uXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50W118bnVtYmVyW119IHBvaW50cyAtIFRoaXMgY2FuIGJlIGFuIGFycmF5IG9mIFBvaW50c1xuICAgICAqICB0aGF0IGZvcm0gdGhlIHBvbHlnb24sIGEgZmxhdCBhcnJheSBvZiBudW1iZXJzIHRoYXQgd2lsbCBiZSBpbnRlcnByZXRlZCBhcyBbeCx5LCB4LHksIC4uLl0sIG9yXG4gICAgICogIHRoZSBhcmd1bWVudHMgcGFzc2VkIGNhbiBiZSBhbGwgdGhlIHBvaW50cyBvZiB0aGUgcG9seWdvbiBlLmcuXG4gICAgICogIGBuZXcgUElYSS5Qb2x5Z29uKG5ldyBQSVhJLlBvaW50KCksIG5ldyBQSVhJLlBvaW50KCksIC4uLilgLCBvciB0aGUgYXJndW1lbnRzIHBhc3NlZCBjYW4gYmUgZmxhdFxuICAgICAqICB4LHkgdmFsdWVzIGUuZy4gYG5ldyBQb2x5Z29uKHgseSwgeCx5LCB4LHksIC4uLilgIHdoZXJlIGB4YCBhbmQgYHlgIGFyZSBOdW1iZXJzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKC4uLnBvaW50cylcbiAgICB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBvaW50c1swXSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50c1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgb2YgcG9pbnRzLCBjb252ZXJ0IGl0IHRvIGEgZmxhdCBhcnJheSBvZiBudW1iZXJzXG4gICAgICAgIGlmIChwb2ludHNbMF0gaW5zdGFuY2VvZiBQb2ludClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBwb2ludHMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwLnB1c2gocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG9pbnRzID0gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gYXJyYXkgb2YgdGhlIHBvaW50cyBvZiB0aGlzIHBvbHlnb25cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyW119XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBvaW50cyA9IHBvaW50cztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5QT0xZXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5QT0xZO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIHBvbHlnb25cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuUG9seWdvbn0gYSBjb3B5IG9mIHRoZSBwb2x5Z29uXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2x5Z29uKHRoaXMucG9pbnRzLnNsaWNlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsb3NlcyB0aGUgcG9seWdvbiwgYWRkaW5nIHBvaW50cyBpZiBuZWNlc3NhcnkuXG4gICAgICpcbiAgICAgKi9cbiAgICBjbG9zZSgpXG4gICAge1xuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLnBvaW50cztcblxuICAgICAgICAvLyBjbG9zZSB0aGUgcG9seSBpZiB0aGUgdmFsdWUgaXMgdHJ1ZSFcbiAgICAgICAgaWYgKHBvaW50c1swXSAhPT0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXSB8fCBwb2ludHNbMV0gIT09IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSwgcG9pbnRzWzFdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgcG9seWdvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkaW5hdGVzIGFyZSB3aXRoaW4gdGhpcyBwb2x5Z29uXG4gICAgICovXG4gICAgY29udGFpbnMoeCwgeSlcbiAgICB7XG4gICAgICAgIGxldCBpbnNpZGUgPSBmYWxzZTtcblxuICAgICAgICAvLyB1c2Ugc29tZSByYXljYXN0aW5nIHRvIHRlc3QgaGl0c1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svcG9pbnQtaW4tcG9seWdvbi9ibG9iL21hc3Rlci9pbmRleC5qc1xuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnBvaW50cy5sZW5ndGggLyAyO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBqID0gbGVuZ3RoIC0gMTsgaSA8IGxlbmd0aDsgaiA9IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgeGkgPSB0aGlzLnBvaW50c1tpICogMl07XG4gICAgICAgICAgICBjb25zdCB5aSA9IHRoaXMucG9pbnRzWyhpICogMikgKyAxXTtcbiAgICAgICAgICAgIGNvbnN0IHhqID0gdGhpcy5wb2ludHNbaiAqIDJdO1xuICAgICAgICAgICAgY29uc3QgeWogPSB0aGlzLnBvaW50c1soaiAqIDIpICsgMV07XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3QgPSAoKHlpID4geSkgIT09ICh5aiA+IHkpKSAmJiAoeCA8ICgoeGogLSB4aSkgKiAoKHkgLSB5aSkgLyAoeWogLSB5aSkpKSArIHhpKTtcblxuICAgICAgICAgICAgaWYgKGludGVyc2VjdClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnNpZGUgPSAhaW5zaWRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc2lkZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbi8qKlxuICogVGhlIFJvdW5kZWQgUmVjdGFuZ2xlIG9iamVjdCBpcyBhbiBhcmVhIHRoYXQgaGFzIG5pY2Ugcm91bmRlZCBjb3JuZXJzLCBhcyBpbmRpY2F0ZWQgYnkgaXRzXG4gKiB0b3AtbGVmdCBjb3JuZXIgcG9pbnQgKHgsIHkpIGFuZCBieSBpdHMgd2lkdGggYW5kIGl0cyBoZWlnaHQgYW5kIGl0cyByYWRpdXMuXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3VuZGVkUmVjdGFuZ2xlXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgdXBwZXItbGVmdCBjb3JuZXIgb2YgdGhlIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgdXBwZXItbGVmdCBjb3JuZXIgb2YgdGhlIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aD0wXSAtIFRoZSBvdmVyYWxsIHdpZHRoIG9mIHRoaXMgcm91bmRlZCByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodD0wXSAtIFRoZSBvdmVyYWxsIGhlaWdodCBvZiB0aGlzIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtyYWRpdXM9MjBdIC0gQ29udHJvbHMgdGhlIHJhZGl1cyBvZiB0aGUgcm91bmRlZCBjb3JuZXJzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDAsIHJhZGl1cyA9IDIwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAyMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QsIG1haW5seSB1c2VkIHRvIGF2b2lkIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgUElYSS5TSEFQRVMuUlJFQ1xuICAgICAgICAgKiBAc2VlIFBJWEkuU0hBUEVTXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnR5cGUgPSBTSEFQRVMuUlJFQztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBSb3VuZGVkIFJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5Sb3VuZGVkUmVjdGFuZ2xlfSBhIGNvcHkgb2YgdGhlIHJvdW5kZWQgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3VuZGVkUmVjdGFuZ2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5yYWRpdXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgUm91bmRlZCBSZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdG8gdGVzdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIHgveSBjb29yZGluYXRlcyBhcmUgd2l0aGluIHRoaXMgUm91bmRlZCBSZWN0YW5nbGVcbiAgICAgKi9cbiAgICBjb250YWlucyh4LCB5KVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPD0gMCB8fCB0aGlzLmhlaWdodCA8PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPj0gdGhpcy54ICYmIHggPD0gdGhpcy54ICsgdGhpcy53aWR0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHkgPj0gdGhpcy55ICYmIHkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCh5ID49IHRoaXMueSArIHRoaXMucmFkaXVzICYmIHkgPD0gdGhpcy55ICsgdGhpcy5oZWlnaHQgLSB0aGlzLnJhZGl1cylcbiAgICAgICAgICAgICAgICB8fCAoeCA+PSB0aGlzLnggKyB0aGlzLnJhZGl1cyAmJiB4IDw9IHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLnJhZGl1cykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGR4ID0geCAtICh0aGlzLnggKyB0aGlzLnJhZGl1cyk7XG4gICAgICAgICAgICAgICAgbGV0IGR5ID0geSAtICh0aGlzLnkgKyB0aGlzLnJhZGl1cyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFkaXVzMiA9IHRoaXMucmFkaXVzICogdGhpcy5yYWRpdXM7XG5cbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHgpICsgKGR5ICogZHkpIDw9IHJhZGl1czIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHggPSB4IC0gKHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgICAgICAgICAgaWYgKChkeCAqIGR4KSArIChkeSAqIGR5KSA8PSByYWRpdXMyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGR5ID0geSAtICh0aGlzLnkgKyB0aGlzLmhlaWdodCAtIHRoaXMucmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHgpICsgKGR5ICogZHkpIDw9IHJhZGl1czIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHggPSB4IC0gKHRoaXMueCArIHRoaXMucmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHgpICsgKGR5ICogZHkpIDw9IHJhZGl1czIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBNYXRoIGNsYXNzZXMgYW5kIHV0aWxpdGllcyBtaXhlZCBpbnRvIFBJWEkgbmFtZXNwYWNlLlxuICpcbiAqIEBsZW5kcyBQSVhJXG4gKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgUG9pbnQgfSBmcm9tICcuL1BvaW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWF0cml4IH0gZnJvbSAnLi9NYXRyaXgnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHcm91cEQ4IH0gZnJvbSAnLi9Hcm91cEQ4JztcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaXJjbGUgfSBmcm9tICcuL3NoYXBlcy9DaXJjbGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFbGxpcHNlIH0gZnJvbSAnLi9zaGFwZXMvRWxsaXBzZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBvbHlnb24gfSBmcm9tICcuL3NoYXBlcy9Qb2x5Z29uJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmVjdGFuZ2xlIH0gZnJvbSAnLi9zaGFwZXMvUmVjdGFuZ2xlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUm91bmRlZFJlY3RhbmdsZSB9IGZyb20gJy4vc2hhcGVzL1JvdW5kZWRSZWN0YW5nbGUnO1xuIiwiLyoqXG4gKiBDYWxjdWxhdGUgdGhlIHBvaW50cyBmb3IgYSBiZXppZXIgY3VydmUgYW5kIHRoZW4gZHJhd3MgaXQuXG4gKlxuICogSWdub3JlZCBmcm9tIGRvY3Mgc2luY2UgaXQgaXMgbm90IGRpcmVjdGx5IGV4cG9zZWQuXG4gKlxuICogQGlnbm9yZVxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21YIC0gU3RhcnRpbmcgcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21ZIC0gU3RhcnRpbmcgcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IGNwWCAtIENvbnRyb2wgcG9pbnQgeFxuICogQHBhcmFtIHtudW1iZXJ9IGNwWSAtIENvbnRyb2wgcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IGNwWDIgLSBTZWNvbmQgQ29udHJvbCBwb2ludCB4XG4gKiBAcGFyYW0ge251bWJlcn0gY3BZMiAtIFNlY29uZCBDb250cm9sIHBvaW50IHlcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b1ggLSBEZXN0aW5hdGlvbiBwb2ludCB4XG4gKiBAcGFyYW0ge251bWJlcn0gdG9ZIC0gRGVzdGluYXRpb24gcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJbXX0gW3BhdGg9W11dIC0gUGF0aCBhcnJheSB0byBwdXNoIHBvaW50cyBpbnRvXG4gKiBAcmV0dXJuIHtudW1iZXJbXX0gQXJyYXkgb2YgcG9pbnRzIG9mIHRoZSBjdXJ2ZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiZXppZXJDdXJ2ZVRvKGZyb21YLCBmcm9tWSwgY3BYLCBjcFksIGNwWDIsIGNwWTIsIHRvWCwgdG9ZLCBwYXRoID0gW10pXG57XG4gICAgY29uc3QgbiA9IDIwO1xuICAgIGxldCBkdCA9IDA7XG4gICAgbGV0IGR0MiA9IDA7XG4gICAgbGV0IGR0MyA9IDA7XG4gICAgbGV0IHQyID0gMDtcbiAgICBsZXQgdDMgPSAwO1xuXG4gICAgcGF0aC5wdXNoKGZyb21YLCBmcm9tWSk7XG5cbiAgICBmb3IgKGxldCBpID0gMSwgaiA9IDA7IGkgPD0gbjsgKytpKVxuICAgIHtcbiAgICAgICAgaiA9IGkgLyBuO1xuXG4gICAgICAgIGR0ID0gKDEgLSBqKTtcbiAgICAgICAgZHQyID0gZHQgKiBkdDtcbiAgICAgICAgZHQzID0gZHQyICogZHQ7XG5cbiAgICAgICAgdDIgPSBqICogajtcbiAgICAgICAgdDMgPSB0MiAqIGo7XG5cbiAgICAgICAgcGF0aC5wdXNoKFxuICAgICAgICAgICAgKGR0MyAqIGZyb21YKSArICgzICogZHQyICogaiAqIGNwWCkgKyAoMyAqIGR0ICogdDIgKiBjcFgyKSArICh0MyAqIHRvWCksXG4gICAgICAgICAgICAoZHQzICogZnJvbVkpICsgKDMgKiBkdDIgKiBqICogY3BZKSArICgzICogZHQgKiB0MiAqIGNwWTIpICsgKHQzICogdG9ZKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoO1xufVxuIiwiaW1wb3J0IEdyYXBoaWNzRGF0YSBmcm9tICcuL0dyYXBoaWNzRGF0YSc7XG5pbXBvcnQgeyBNYXRyaXgsIFBvaW50LCBSZWN0YW5nbGUsIFJvdW5kZWRSZWN0YW5nbGUsIEVsbGlwc2UsIFBvbHlnb24sIENpcmNsZSB9IGZyb20gJy4uL21hdGgvaW5kZXgnO1xuaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vY29uc3QnO1xuaW1wb3J0IGJlemllckN1cnZlVG8gZnJvbSAnLi91dGlscy9iZXppZXJDdXJ2ZVRvJztcblxuY29uc3QgdGVtcE1hdHJpeCA9IG5ldyBNYXRyaXgoKTtcbmNvbnN0IHRlbXBQb2ludCA9IG5ldyBQb2ludCgpO1xuY29uc3QgdGVtcENvbG9yMSA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XG5jb25zdCB0ZW1wQ29sb3IyID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpY3NcbntcbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICB0aGlzLmZpbGxBbHBoYSA9IDE7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gMDtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSAwO1xuICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YSA9IFtdO1xuICAgICAgICB0aGlzLnRpbnQgPSAweEZGRkZGRjtcbiAgICAgICAgdGhpcy5fcHJldlRpbnQgPSAweEZGRkZGRjtcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fd2ViR0wgPSB7fTtcblxuICAgICAgICB0aGlzLmRpcnR5ID0gMDtcbiAgICAgICAgdGhpcy5mYXN0UmVjdERpcnR5ID0gLTE7XG4gICAgICAgIHRoaXMuY2xlYXJEaXJ0eSA9IDA7XG4gICAgICAgIHRoaXMuYm91bmRzRGlydHkgPSAtMTtcbiAgICAgICAgdGhpcy5jYWNoZWRTcHJpdGVEaXJ0eSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX3Nwcml0ZVJlY3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9mYXN0UmVjdCA9IGZhbHNlO1xuICAgIH1cblxuXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgR3JhcGhpY3MoKTtcblxuICAgICAgICBjbG9uZS5maWxsQWxwaGEgPSB0aGlzLmZpbGxBbHBoYTtcbiAgICAgICAgY2xvbmUubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG4gICAgICAgIGNsb25lLmxpbmVDb2xvciA9IHRoaXMubGluZUNvbG9yO1xuICAgICAgICBjbG9uZS50aW50ID0gdGhpcy50aW50O1xuICAgICAgICBjbG9uZS5ib3VuZHNQYWRkaW5nID0gdGhpcy5ib3VuZHNQYWRkaW5nO1xuICAgICAgICBjbG9uZS5kaXJ0eSA9IDA7XG4gICAgICAgIGNsb25lLmNhY2hlZFNwcml0ZURpcnR5ID0gdGhpcy5jYWNoZWRTcHJpdGVEaXJ0eTtcblxuICAgICAgICAvLyBjb3B5IGdyYXBoaWNzIGRhdGFcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGg7ICsraSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2xvbmUuZ3JhcGhpY3NEYXRhLnB1c2godGhpcy5ncmFwaGljc0RhdGFbaV0uY2xvbmUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbG9uZS5jdXJyZW50UGF0aCA9IGNsb25lLmdyYXBoaWNzRGF0YVtjbG9uZS5ncmFwaGljc0RhdGEubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgY2xvbmUudXBkYXRlTG9jYWxCb3VuZHMoKTtcblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuXG5cbiAgICBsaW5lU3R5bGUobGluZVdpZHRoID0gMCwgY29sb3IgPSAwLCBhbHBoYSA9IDEpXG4gICAge1xuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgdGhpcy5saW5lQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5saW5lQWxwaGEgPSBhbHBoYTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBoYWxmd2F5IHRocm91Z2ggYSBsaW5lPyBzdGFydCBhIG5ldyBvbmUhXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgUG9seWdvbih0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5zbGljZSgtMikpO1xuXG4gICAgICAgICAgICAgICAgc2hhcGUuY2xvc2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdTaGFwZShzaGFwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGl0cyBlbXB0eSBzbyBsZXRzIGp1c3Qgc2V0IHRoZSBsaW5lIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGgubGluZUNvbG9yID0gdGhpcy5saW5lQ29sb3I7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5saW5lQWxwaGEgPSB0aGlzLmxpbmVBbHBoYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG1vdmVUbyh4LCB5KVxuICAgIHtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgUG9seWdvbihbeCwgeV0pO1xuXG4gICAgICAgIHNoYXBlLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhd3MgYSBsaW5lIHVzaW5nIHRoZSBjdXJyZW50IGxpbmUgc3R5bGUgZnJvbSB0aGUgY3VycmVudCBkcmF3aW5nIHBvc2l0aW9uIHRvICh4LCB5KTtcbiAgICAgKiBUaGUgY3VycmVudCBkcmF3aW5nIHBvc2l0aW9uIGlzIHRoZW4gc2V0IHRvICh4LCB5KS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdGhlIFggY29vcmRpbmF0ZSB0byBkcmF3IHRvXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSB0aGUgWSBjb29yZGluYXRlIHRvIGRyYXcgdG9cbiAgICAgKiBAcmV0dXJuIHtQSVhJLkdyYXBoaWNzfSBUaGlzIEdyYXBoaWNzIG9iamVjdC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzXG4gICAgICovXG4gICAgbGluZVRvKHgsIHkpXG4gICAge1xuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5wdXNoKHgsIHkpO1xuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlIHRoZSBwb2ludHMgZm9yIGEgcXVhZHJhdGljIGJlemllciBjdXJ2ZSBhbmQgdGhlbiBkcmF3cyBpdC5cbiAgICAgKiBCYXNlZCBvbjogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzg1MDk3L2hvdy1kby1pLWltcGxlbWVudC1hLWJlemllci1jdXJ2ZS1pbi1jXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY3BYIC0gQ29udHJvbCBwb2ludCB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNwWSAtIENvbnRyb2wgcG9pbnQgeVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b1ggLSBEZXN0aW5hdGlvbiBwb2ludCB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvWSAtIERlc3RpbmF0aW9uIHBvaW50IHlcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkdyYXBoaWNzfSBUaGlzIEdyYXBoaWNzIG9iamVjdC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzXG4gICAgICovXG4gICAgcXVhZHJhdGljQ3VydmVUbyhjcFgsIGNwWSwgdG9YLCB0b1kpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cyA9IFswLCAwXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKDAsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbiA9IDIwO1xuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcbiAgICAgICAgbGV0IHhhID0gMDtcbiAgICAgICAgbGV0IHlhID0gMDtcblxuICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oMCwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmcm9tWCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGZyb21ZID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBuOyArK2kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBpIC8gbjtcblxuICAgICAgICAgICAgeGEgPSBmcm9tWCArICgoY3BYIC0gZnJvbVgpICogaik7XG4gICAgICAgICAgICB5YSA9IGZyb21ZICsgKChjcFkgLSBmcm9tWSkgKiBqKTtcblxuICAgICAgICAgICAgcG9pbnRzLnB1c2goeGEgKyAoKChjcFggKyAoKHRvWCAtIGNwWCkgKiBqKSkgLSB4YSkgKiBqKSxcbiAgICAgICAgICAgICAgICB5YSArICgoKGNwWSArICgodG9ZIC0gY3BZKSAqIGopKSAtIHlhKSAqIGopKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBiZXppZXJDdXJ2ZVRvKGNwWCwgY3BZLCBjcFgyLCBjcFkyLCB0b1gsIHRvWSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzID0gWzAsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oMCwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcblxuICAgICAgICBjb25zdCBmcm9tWCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGZyb21ZID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICBwb2ludHMubGVuZ3RoIC09IDI7XG5cbiAgICAgICAgYmV6aWVyQ3VydmVUbyhmcm9tWCwgZnJvbVksIGNwWCwgY3BZLCBjcFgyLCBjcFkyLCB0b1gsIHRvWSwgcG9pbnRzKTtcblxuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXJjVG8oeDEsIHkxLCB4MiwgeTIsIHJhZGl1cylcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLnB1c2goeDEsIHkxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKHgxLCB5MSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcbiAgICAgICAgY29uc3QgZnJvbVggPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDJdO1xuICAgICAgICBjb25zdCBmcm9tWSA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGExID0gZnJvbVkgLSB5MTtcbiAgICAgICAgY29uc3QgYjEgPSBmcm9tWCAtIHgxO1xuICAgICAgICBjb25zdCBhMiA9IHkyIC0geTE7XG4gICAgICAgIGNvbnN0IGIyID0geDIgLSB4MTtcbiAgICAgICAgY29uc3QgbW0gPSBNYXRoLmFicygoYTEgKiBiMikgLSAoYjEgKiBhMikpO1xuXG4gICAgICAgIGlmIChtbSA8IDEuMGUtOCB8fCByYWRpdXMgPT09IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDJdICE9PSB4MSB8fCBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdICE9PSB5MSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MSwgeTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgZGQgPSAoYTEgKiBhMSkgKyAoYjEgKiBiMSk7XG4gICAgICAgICAgICBjb25zdCBjYyA9IChhMiAqIGEyKSArIChiMiAqIGIyKTtcbiAgICAgICAgICAgIGNvbnN0IHR0ID0gKGExICogYTIpICsgKGIxICogYjIpO1xuICAgICAgICAgICAgY29uc3QgazEgPSByYWRpdXMgKiBNYXRoLnNxcnQoZGQpIC8gbW07XG4gICAgICAgICAgICBjb25zdCBrMiA9IHJhZGl1cyAqIE1hdGguc3FydChjYykgLyBtbTtcbiAgICAgICAgICAgIGNvbnN0IGoxID0gazEgKiB0dCAvIGRkO1xuICAgICAgICAgICAgY29uc3QgajIgPSBrMiAqIHR0IC8gY2M7XG4gICAgICAgICAgICBjb25zdCBjeCA9IChrMSAqIGIyKSArIChrMiAqIGIxKTtcbiAgICAgICAgICAgIGNvbnN0IGN5ID0gKGsxICogYTIpICsgKGsyICogYTEpO1xuICAgICAgICAgICAgY29uc3QgcHggPSBiMSAqIChrMiArIGoxKTtcbiAgICAgICAgICAgIGNvbnN0IHB5ID0gYTEgKiAoazIgKyBqMSk7XG4gICAgICAgICAgICBjb25zdCBxeCA9IGIyICogKGsxICsgajIpO1xuICAgICAgICAgICAgY29uc3QgcXkgPSBhMiAqIChrMSArIGoyKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSBNYXRoLmF0YW4yKHB5IC0gY3ksIHB4IC0gY3gpO1xuICAgICAgICAgICAgY29uc3QgZW5kQW5nbGUgPSBNYXRoLmF0YW4yKHF5IC0gY3ksIHF4IC0gY3gpO1xuXG4gICAgICAgICAgICB0aGlzLmFyYyhjeCArIHgxLCBjeSArIHkxLCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBiMSAqIGEyID4gYjIgKiBhMSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXJjKGN4LCBjeSwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgYW50aWNsb2Nrd2lzZSA9IGZhbHNlKVxuICAgIHtcbiAgICAgICAgaWYgKHN0YXJ0QW5nbGUgPT09IGVuZEFuZ2xlKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYW50aWNsb2Nrd2lzZSAmJiBlbmRBbmdsZSA8PSBzdGFydEFuZ2xlKVxuICAgICAgICB7XG4gICAgICAgICAgICBlbmRBbmdsZSArPSBNYXRoLlBJICogMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhbnRpY2xvY2t3aXNlICYmIHN0YXJ0QW5nbGUgPD0gZW5kQW5nbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgKz0gTWF0aC5QSSAqIDI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzd2VlcCA9IGVuZEFuZ2xlIC0gc3RhcnRBbmdsZTtcbiAgICAgICAgY29uc3Qgc2VncyA9IE1hdGguY2VpbChNYXRoLmFicyhzd2VlcCkgLyAoTWF0aC5QSSAqIDIpKSAqIDQwO1xuXG4gICAgICAgIGlmIChzd2VlcCA9PT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGFydFggPSBjeCArIChNYXRoLmNvcyhzdGFydEFuZ2xlKSAqIHJhZGl1cyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0WSA9IGN5ICsgKE1hdGguc2luKHN0YXJ0QW5nbGUpICogcmFkaXVzKTtcblxuICAgICAgICAvLyBJZiB0aGUgY3VycmVudFBhdGggZXhpc3RzLCB0YWtlIGl0cyBwb2ludHMuIE90aGVyd2lzZSBjYWxsIGBtb3ZlVG9gIHRvIHN0YXJ0IGEgcGF0aC5cbiAgICAgICAgbGV0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGggPyB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cyA6IG51bGw7XG5cbiAgICAgICAgaWYgKHBvaW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl0gIT09IHN0YXJ0WCB8fCBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdICE9PSBzdGFydFkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICAgcG9pbnRzID0gdGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aGV0YSA9IHN3ZWVwIC8gKHNlZ3MgKiAyKTtcbiAgICAgICAgY29uc3QgdGhldGEyID0gdGhldGEgKiAyO1xuXG4gICAgICAgIGNvbnN0IGNUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICAgICAgY29uc3Qgc1RoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuXG4gICAgICAgIGNvbnN0IHNlZ01pbnVzID0gc2VncyAtIDE7XG5cbiAgICAgICAgY29uc3QgcmVtYWluZGVyID0gKHNlZ01pbnVzICUgMSkgLyBzZWdNaW51cztcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzZWdNaW51czsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCByZWFsID0gaSArIChyZW1haW5kZXIgKiBpKTtcblxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSAoKHRoZXRhKSArIHN0YXJ0QW5nbGUgKyAodGhldGEyICogcmVhbCkpO1xuXG4gICAgICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICAgICAgY29uc3QgcyA9IC1NYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFxuICAgICAgICAgICAgICAgICgoKGNUaGV0YSAqIGMpICsgKHNUaGV0YSAqIHMpKSAqIHJhZGl1cykgKyBjeCxcbiAgICAgICAgICAgICAgICAoKChjVGhldGEgKiAtcykgKyAoc1RoZXRhICogYykpICogcmFkaXVzKSArIGN5XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXJ0eSsrO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJlZ2luRmlsbChjb2xvciA9IDAsIGFscGhhID0gMSlcbiAgICB7XG4gICAgICAgIHRoaXMuZmlsbGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZmlsbENvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gYWxwaGE7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5sZW5ndGggPD0gMilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmZpbGwgPSB0aGlzLmZpbGxpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5maWxsQ29sb3IgPSB0aGlzLmZpbGxDb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmZpbGxBbHBoYSA9IHRoaXMuZmlsbEFscGhhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW5kRmlsbCgpXG4gICAge1xuICAgICAgICB0aGlzLmZpbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSBudWxsO1xuICAgICAgICB0aGlzLmZpbGxBbHBoYSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd1JlY3QoeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKG5ldyBSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3Um91bmRlZFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzKVxuICAgIHtcbiAgICAgICAgdGhpcy5kcmF3U2hhcGUobmV3IFJvdW5kZWRSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgcmFkaXVzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd0NpcmNsZSh4LCB5LCByYWRpdXMpXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShuZXcgQ2lyY2xlKHgsIHksIHJhZGl1cykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRyYXdFbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQpXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShuZXcgRWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd1BvbHlnb24ocGF0aClcbiAgICB7XG4gICAgICAgIC8vIHByZXZlbnRzIGFuIGFyZ3VtZW50IGFzc2lnbm1lbnQgZGVvcHRcbiAgICAgICAgLy8gc2VlIHNlY3Rpb24gMy4xOiBodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL3dpa2kvT3B0aW1pemF0aW9uLWtpbGxlcnMjMy1tYW5hZ2luZy1hcmd1bWVudHNcbiAgICAgICAgbGV0IHBvaW50cyA9IHBhdGg7XG5cbiAgICAgICAgbGV0IGNsb3NlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHBvaW50cyBpbnN0YW5jZW9mIFBvbHlnb24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsb3NlZCA9IHBvaW50cy5jbG9zZWQ7XG4gICAgICAgICAgICBwb2ludHMgPSBwb2ludHMucG9pbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHBvaW50cykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIGFuIGFyZ3VtZW50IGxlYWsgZGVvcHRcbiAgICAgICAgICAgIC8vIHNlZSBzZWN0aW9uIDMuMjogaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC93aWtpL09wdGltaXphdGlvbi1raWxsZXJzIzMtbWFuYWdpbmctYXJndW1lbnRzXG4gICAgICAgICAgICBwb2ludHMgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBvaW50c1tpXSA9IGFyZ3VtZW50c1tpXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBwcmVmZXItcmVzdC1wYXJhbXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IFBvbHlnb24ocG9pbnRzKTtcblxuICAgICAgICBzaGFwZS5jbG9zZWQgPSBjbG9zZWQ7XG5cbiAgICAgICAgdGhpcy5kcmF3U2hhcGUoc2hhcGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNsZWFyKClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmxpbmVXaWR0aCB8fCB0aGlzLmZpbGxpbmcgfHwgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5saW5lV2lkdGggPSAwO1xuICAgICAgICAgICAgdGhpcy5maWxsaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuYm91bmRzRGlydHkgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuZGlydHkrKztcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEaXJ0eSsrO1xuICAgICAgICAgICAgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuICAgICAgICB0aGlzLl9zcHJpdGVSZWN0ID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhlIG9iamVjdCB1c2luZyB0aGUgV2ViR0wgcmVuZGVyZXJcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtQSVhJLldlYkdMUmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyXG4gICAgICovXG4gICAgX3JlbmRlcldlYkdMKHJlbmRlcmVyKVxuICAgIHtcblxuICAgICAgICByZW5kZXJlci5zZXRPYmplY3RSZW5kZXJlcihyZW5kZXJlci5wbHVnaW5zLmdyYXBoaWNzKTtcbiAgICAgICAgcmVuZGVyZXIucGx1Z2lucy5ncmFwaGljcy5yZW5kZXIodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyB0aGUgb2JqZWN0IHVzaW5nIHRoZSBDYW52YXMgcmVuZGVyZXJcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtQSVhJLkNhbnZhc1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlclxuICAgICAqL1xuICAgIF9yZW5kZXJDYW52YXMocmVuZGVyZXIpXG4gICAge1xuICAgICAgICByZW5kZXJlci5wbHVnaW5zLmdyYXBoaWNzLnJlbmRlcih0aGlzKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIERyYXdzIHRoZSBnaXZlbiBzaGFwZSB0byB0aGlzIEdyYXBoaWNzIG9iamVjdC4gQ2FuIGJlIGFueSBvZiBDaXJjbGUsIFJlY3RhbmdsZSwgRWxsaXBzZSwgTGluZSBvciBQb2x5Z29uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLkNpcmNsZXxQSVhJLkVsbGlwc2V8UElYSS5Qb2x5Z29ufFBJWEkuUmVjdGFuZ2xlfFBJWEkuUm91bmRlZFJlY3RhbmdsZX0gc2hhcGUgLSBUaGUgc2hhcGUgb2JqZWN0IHRvIGRyYXcuXG4gICAgICogQHJldHVybiB7UElYSS5HcmFwaGljc0RhdGF9IFRoZSBnZW5lcmF0ZWQgR3JhcGhpY3NEYXRhIG9iamVjdC5cbiAgICAgKi9cbiAgICBkcmF3U2hhcGUoc2hhcGUpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gY2hlY2sgY3VycmVudCBwYXRoIVxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aCA8PSAyKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBHcmFwaGljc0RhdGEoXG4gICAgICAgICAgICB0aGlzLmxpbmVXaWR0aCxcbiAgICAgICAgICAgIHRoaXMubGluZUNvbG9yLFxuICAgICAgICAgICAgdGhpcy5saW5lQWxwaGEsXG4gICAgICAgICAgICB0aGlzLmZpbGxDb2xvcixcbiAgICAgICAgICAgIHRoaXMuZmlsbEFscGhhLFxuICAgICAgICAgICAgdGhpcy5maWxsaW5nLFxuICAgICAgICAgICAgc2hhcGVcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YS5wdXNoKGRhdGEpO1xuXG4gICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFNIQVBFUy5QT0xZKVxuICAgICAgICB7XG4gICAgICAgICAgICBkYXRhLnNoYXBlLmNsb3NlZCA9IGRhdGEuc2hhcGUuY2xvc2VkIHx8IHRoaXMuZmlsbGluZztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXJ0eSsrO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBjdXJyZW50IHBhdGguXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkdyYXBoaWNzfSBSZXR1cm5zIGl0c2VsZi5cbiAgICAgKi9cbiAgICBjbG9zZVBhdGgoKVxuICAgIHtcbiAgICAgICAgLy8gb2sgc28gY2xvc2UgcGF0aCBhc3N1bWVzIG5leHQgb25lIGlzIGEgaG9sZSFcbiAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSB0aGlzLmN1cnJlbnRQYXRoO1xuXG4gICAgICAgIGlmIChjdXJyZW50UGF0aCAmJiBjdXJyZW50UGF0aC5zaGFwZSlcbiAgICAgICAge1xuICAgICAgICAgICAgY3VycmVudFBhdGguc2hhcGUuY2xvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlc3Ryb3kob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3kob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gZGVzdHJveSBlYWNoIG9mIHRoZSBHcmFwaGljc0RhdGEgb2JqZWN0c1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YVtpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgZWFjaCB3ZWJnbCBkYXRhIGVudHJ5LCBkZXN0cm95IHRoZSBXZWJHTEdyYXBoaWNzRGF0YVxuICAgICAgICBmb3IgKGNvbnN0IGlkIGluIHRoaXMuX3dlYmdsKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX3dlYmdsW2lkXS5kYXRhLmxlbmd0aDsgKytqKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlYmdsW2lkXS5kYXRhW2pdLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9zcHJpdGVSZWN0KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9zcHJpdGVSZWN0LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhID0gbnVsbDtcblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5fd2ViZ2wgPSBudWxsO1xuICAgICAgICB0aGlzLl9sb2NhbEJvdW5kcyA9IG51bGw7XG4gICAgfVxuXG59IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIERpc3BsYXlMaXN0IOS4reeahHNoYXBlIOexu1xuICovXG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0XCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgR3JhcGhpY3MgZnJvbSBcIi4uL2dyYXBoaWNzL0dyYXBoaWNzXCI7XG5cbnZhciBTaGFwZSA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5ncmFwaGljcyA9IG5ldyBHcmFwaGljcygpO1xuXG4gICAgLy/lhYPntKDmmK/lkKbmnIlob3ZlcuS6i+S7tiDlkowgY2hpY2vkuovku7bvvIznlLFhZGRFdmVuZXRMaXN0ZXLlkoxyZW1pdmVFdmVudExpc3RlcuadpeinpuWPkeS/ruaUuVxuICAgIHNlbGYuX2hvdmVyYWJsZSAgPSBmYWxzZTtcbiAgICBzZWxmLl9jbGlja2FibGUgID0gZmFsc2U7XG5cbiAgICAvL292ZXLnmoTml7blgJnlpoLmnpzmnInkv67mlLnmoLflvI/vvIzlsLHkuLp0cnVlXG4gICAgc2VsZi5faG92ZXJDbGFzcyA9IGZhbHNlO1xuICAgIHNlbGYuaG92ZXJDbG9uZSAgPSB0cnVlOyAgICAvL+aYr+WQpuW8gOWQr+WcqGhvdmVy55qE5pe25YCZY2xvbmXkuIDku73liLBhY3RpdmUgc3RhZ2Ug5LitIFxuICAgIHNlbGYucG9pbnRDaGtQcmlvcml0eSA9IHRydWU7IC8v5Zyo6byg5qCHbW91c2VvdmVy5Yiw6K+l6IqC54K577yM54S25ZCObW91c2Vtb3Zl55qE5pe25YCZ77yM5piv5ZCm5LyY5YWI5qOA5rWL6K+l6IqC54K5XG5cbiAgICAvL+aLluaLvWRyYWfnmoTml7blgJnmmL7npLrlnKhhY3RpdlNoYXBl55qE5Ymv5pysXG4gICAgc2VsZi5fZHJhZ0R1cGxpY2F0ZSA9IG51bGw7XG5cbiAgICAvL+WFg+e0oOaYr+WQpiDlvIDlkK8gZHJhZyDmi5bliqjvvIzov5nkuKrmnInnlKjmiLforr7nva7kvKDlhaVcbiAgICAvL3NlbGYuZHJhZ2dhYmxlID0gb3B0LmRyYWdnYWJsZSB8fCBmYWxzZTtcblxuICAgIHNlbGYudHlwZSA9IHNlbGYudHlwZSB8fCBcInNoYXBlXCIgO1xuICAgIG9wdC5kcmF3ICYmIChzZWxmLmRyYXc9b3B0LmRyYXcpO1xuICAgIFxuICAgIC8v5aSE55CG5omA5pyJ55qE5Zu+5b2i5LiA5Lqb5YWx5pyJ55qE5bGe5oCn6YWN572uXG4gICAgc2VsZi5pbml0Q29tcFByb3BlcnR5KG9wdCk7XG5cbiAgICBTaGFwZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuICAgIHNlbGYuX3JlY3QgPSBudWxsO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhTaGFwZSAsIERpc3BsYXlPYmplY3QgLCB7XG4gICBpbml0IDogZnVuY3Rpb24oKXtcbiAgIH0sXG4gICBpbml0Q29tcFByb3BlcnR5IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgIGZvciggdmFyIGkgaW4gb3B0ICl7XG4gICAgICAgICAgIGlmKCBpICE9IFwiaWRcIiAmJiBpICE9IFwiY29udGV4dFwiKXtcbiAgICAgICAgICAgICAgIHRoaXNbaV0gPSBvcHRbaV07XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICB9LFxuICAgLypcbiAgICAq5LiL6Z2i5Lik5Liq5pa55rOV5Li65o+Q5L6b57uZIOWFt+S9k+eahCDlm77lvaLnsbvopobnm5blrp7njrDvvIzmnKxzaGFwZeexu+S4jeaPkOS+m+WFt+S9k+WunueOsFxuICAgICpkcmF3KCkg57uY5Yi2ICAgYW5kICAgc2V0UmVjdCgp6I635Y+W6K+l57G755qE55+p5b2i6L6555WMXG4gICAqL1xuICAgZHJhdzpmdW5jdGlvbigpe1xuICAgXG4gICB9LFxuICAgZHJhd0VuZCA6IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgaWYodGhpcy5faGFzRmlsbEFuZFN0cm9rZSl7XG4gICAgICAgICAgIC8v5aaC5p6c5Zyo5a2Qc2hhcGXnsbvph4zpnaLlt7Lnu4/lrp7njrBzdHJva2UgZmlsbCDnrYnmk43kvZzvvIwg5bCx5LiN6ZyA6KaB57uf5LiA55qEZFxuICAgICAgICAgICByZXR1cm47XG4gICAgICAgfVxuXG4gICAgICAgLy9zdHlsZSDopoHku45kaWFwbGF5T2JqZWN055qEIGNvbnRleHTkuIrpnaLljrvlj5ZcbiAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmNvbnRleHQ7XG4gXG4gICAgICAgLy9maWxsIHN0cm9rZSDkuYvliY3vvIwg5bCx5bqU6K+l6KaBY2xvc2VwYXRoIOWQpuWImee6v+adoei9rOinkuWPo+S8muaciee8uuWPo+OAglxuICAgICAgIC8vZHJhd1R5cGVPbmx5IOeUsee7p+aJv3NoYXBl55qE5YW35L2T57uY5Yi257G75o+Q5L6bXG4gICAgICAgaWYgKCB0aGlzLl9kcmF3VHlwZU9ubHkgIT0gXCJzdHJva2VcIiAmJiB0aGlzLnR5cGUgIT0gXCJwYXRoXCIpe1xuICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgfVxuXG4gICAgICAgaWYgKCBzdHlsZS5zdHJva2VTdHlsZSAmJiBzdHlsZS5saW5lV2lkdGggKXtcbiAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgIH1cbiAgICAgICAvL+avlOWmgui0neWhnuWwlOabsue6v+eUu+eahOe6vyxkcmF3VHlwZU9ubHk9PXN0cm9rZe+8jOaYr+S4jeiDveS9v+eUqGZpbGznmoTvvIzlkI7mnpzlvojkuKXph41cbiAgICAgICBpZiAoc3R5bGUuZmlsbFN0eWxlICYmIHRoaXMuX2RyYXdUeXBlT25seSE9XCJzdHJva2VcIil7XG4gICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgfVxuICAgICAgIFxuICAgfSxcblxuXG4gICByZW5kZXIgOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGN0eCAgPSB0aGlzLmdldFN0YWdlKCkuY29udGV4dDJEO1xuICAgICAgXG4gICAgICBpZiAodGhpcy5jb250ZXh0LnR5cGUgPT0gXCJzaGFwZVwiKXtcbiAgICAgICAgICAvL3R5cGUgPT0gc2hhcGXnmoTml7blgJnvvIzoh6rlrprkuYnnu5jnlLtcbiAgICAgICAgICAvL+i/meS4quaXtuWAmeWwseWPr+S7peS9v+eUqHNlbGYuZ3JhcGhpY3Pnu5jlm77mjqXlj6PkuobvvIzor6XmjqXlj6PmqKHmi5/nmoTmmK9hczPnmoTmjqXlj6NcbiAgICAgICAgICB0aGlzLmRyYXcuYXBwbHkoIHRoaXMgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy/ov5nkuKrml7blgJnvvIzor7TmmI7or6VzaGFwZeaYr+iwg+eUqOW3sue7j+e7mOWItuWlveeahCBzaGFwZSDmqKHlnZfvvIzov5nkupvmqKHlnZflhajpg6jlnKguLi9zaGFwZeebruW9leS4i+mdolxuICAgICAgICAgIGlmKCB0aGlzLmRyYXcgKXtcbiAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICB0aGlzLmRyYXcoIGN0eCAsIHRoaXMuY29udGV4dCApO1xuICAgICAgICAgICAgICB0aGlzLmRyYXdFbmQoIGN0eCApO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cbiAgICxcbiAgIC8qXG4gICAgKiDnlLvomZrnur9cbiAgICAqL1xuICAgZGFzaGVkTGluZVRvOmZ1bmN0aW9uKGN0eCwgeDEsIHkxLCB4MiwgeTIsIGRhc2hMZW5ndGgpIHtcbiAgICAgICAgIGRhc2hMZW5ndGggPSB0eXBlb2YgZGFzaExlbmd0aCA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgID8gMyA6IGRhc2hMZW5ndGg7XG4gICAgICAgICBkYXNoTGVuZ3RoID0gTWF0aC5tYXgoIGRhc2hMZW5ndGggLCB0aGlzLmNvbnRleHQubGluZVdpZHRoICk7XG4gICAgICAgICB2YXIgZGVsdGFYID0geDIgLSB4MTtcbiAgICAgICAgIHZhciBkZWx0YVkgPSB5MiAtIHkxO1xuICAgICAgICAgdmFyIG51bURhc2hlcyA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgTWF0aC5zcXJ0KGRlbHRhWCAqIGRlbHRhWCArIGRlbHRhWSAqIGRlbHRhWSkgLyBkYXNoTGVuZ3RoXG4gICAgICAgICApO1xuICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1EYXNoZXM7ICsraSkge1xuICAgICAgICAgICAgIHZhciB4ID0gcGFyc2VJbnQoeDEgKyAoZGVsdGFYIC8gbnVtRGFzaGVzKSAqIGkpO1xuICAgICAgICAgICAgIHZhciB5ID0gcGFyc2VJbnQoeTEgKyAoZGVsdGFZIC8gbnVtRGFzaGVzKSAqIGkpO1xuICAgICAgICAgICAgIGN0eFtpICUgMiA9PT0gMCA/ICdtb3ZlVG8nIDogJ2xpbmVUbyddKCB4ICwgeSApO1xuICAgICAgICAgICAgIGlmKCBpID09IChudW1EYXNoZXMtMSkgJiYgaSUyID09PSAwKXtcbiAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyggeDIgLCB5MiApO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgIH0sXG4gICAvKlxuICAgICrku45jcGzoioLngrnkuK3ojrflj5bliLA05Liq5pa55ZCR55qE6L6555WM6IqC54K5XG4gICAgKkBwYXJhbSAgY29udGV4dCBcbiAgICAqXG4gICAgKiovXG4gICBnZXRSZWN0Rm9ybVBvaW50TGlzdCA6IGZ1bmN0aW9uKCBjb250ZXh0ICl7XG4gICAgICAgdmFyIG1pblggPSAgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICB2YXIgbWF4WCA9ICBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgIHZhciBtaW5ZID0gIE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgdmFyIG1heFkgPSAgTnVtYmVyLk1JTl9WQUxVRTtcblxuICAgICAgIHZhciBjcGwgPSBjb250ZXh0LnBvaW50TGlzdDsgLy90aGlzLmdldGNwbCgpO1xuICAgICAgIGZvcih2YXIgaSA9IDAsIGwgPSBjcGwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgIGlmIChjcGxbaV1bMF0gPCBtaW5YKSB7XG4gICAgICAgICAgICAgICBtaW5YID0gY3BsW2ldWzBdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMF0gPiBtYXhYKSB7XG4gICAgICAgICAgICAgICBtYXhYID0gY3BsW2ldWzBdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMV0gPCBtaW5ZKSB7XG4gICAgICAgICAgICAgICBtaW5ZID0gY3BsW2ldWzFdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMV0gPiBtYXhZKSB7XG4gICAgICAgICAgICAgICBtYXhZID0gY3BsW2ldWzFdO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuXG4gICAgICAgdmFyIGxpbmVXaWR0aDtcbiAgICAgICBpZiAoY29udGV4dC5zdHJva2VTdHlsZSB8fCBjb250ZXh0LmZpbGxTdHlsZSAgKSB7XG4gICAgICAgICAgIGxpbmVXaWR0aCA9IGNvbnRleHQubGluZVdpZHRoIHx8IDE7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgbGluZVdpZHRoID0gMDtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgeCAgICAgIDogTWF0aC5yb3VuZChtaW5YIC0gbGluZVdpZHRoIC8gMiksXG4gICAgICAgICAgIHkgICAgICA6IE1hdGgucm91bmQobWluWSAtIGxpbmVXaWR0aCAvIDIpLFxuICAgICAgICAgICB3aWR0aCAgOiBtYXhYIC0gbWluWCArIGxpbmVXaWR0aCxcbiAgICAgICAgICAgaGVpZ2h0IDogbWF4WSAtIG1pblkgKyBsaW5lV2lkdGhcbiAgICAgICB9O1xuICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXBlO1xuIiwiLyoqXHJcbiAqIENhbnZheC0tVGV4dFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaWh+acrCDnsbtcclxuICoqL1xyXG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0XCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBUZXh0ID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInRleHRcIjtcclxuICAgIHNlbGYuX3JlTmV3bGluZSA9IC9cXHI/XFxuLztcclxuICAgIHNlbGYuZm9udFByb3BlcnRzID0gW1wiZm9udFN0eWxlXCIsIFwiZm9udFZhcmlhbnRcIiwgXCJmb250V2VpZ2h0XCIsIFwiZm9udFNpemVcIiwgXCJmb250RmFtaWx5XCJdO1xyXG5cclxuICAgIC8v5YGa5LiA5qyh566A5Y2V55qEb3B05Y+C5pWw5qCh6aqM77yM5L+d6K+B5Zyo55So5oi35LiN5Lygb3B055qE5pe25YCZIOaIluiAheS8oOS6hm9wdOS9huaYr+mHjOmdouayoeaciWNvbnRleHTnmoTml7blgJnmiqXplJlcclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBmb250U2l6ZTogMTMsIC8v5a2X5L2T5aSn5bCP6buY6K6kMTNcclxuICAgICAgICBmb250V2VpZ2h0OiBcIm5vcm1hbFwiLFxyXG4gICAgICAgIGZvbnRGYW1pbHk6IFwi5b6u6L2v6ZuF6buRLHNhbnMtc2VyaWZcIixcclxuICAgICAgICB0ZXh0RGVjb3JhdGlvbjogbnVsbCxcclxuICAgICAgICBmaWxsU3R5bGU6ICdibGFuaycsXHJcbiAgICAgICAgc3Ryb2tlU3R5bGU6IG51bGwsXHJcbiAgICAgICAgbGluZVdpZHRoOiAwLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDEuMixcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG51bGwsXHJcbiAgICAgICAgdGV4dEJhY2tncm91bmRDb2xvcjogbnVsbFxyXG4gICAgfSwgb3B0LmNvbnRleHQpO1xyXG5cclxuICAgIHNlbGYuX2NvbnRleHQuZm9udCA9IHNlbGYuX2dldEZvbnREZWNsYXJhdGlvbigpO1xyXG5cclxuICAgIHNlbGYudGV4dCA9IHRleHQudG9TdHJpbmcoKTtcclxuXHJcbiAgICBUZXh0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgW29wdF0pO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhUZXh0LCBEaXNwbGF5T2JqZWN0LCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIC8vY29udGV4dOWxnuaAp+acieWPmOWMlueahOebkeWQrOWHveaVsFxyXG4gICAgICAgIGlmIChfLmluZGV4T2YodGhpcy5mb250UHJvcGVydHMsIG5hbWUpID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGV4dFtuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAvL+WmguaenOS/ruaUueeahOaYr2ZvbnTnmoTmn5DkuKrlhoXlrrnvvIzlsLHph43mlrDnu4Too4XkuIDpgY1mb25055qE5YC877yMXHJcbiAgICAgICAgICAgIC8v54S25ZCO6YCa55+l5byV5pOO6L+Z5qyh5a+5Y29udGV4dOeahOS/ruaUueS4jemcgOimgeS4iuaKpeW/g+i3s1xyXG4gICAgICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuX2dldEZvbnREZWNsYXJhdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggPSB0aGlzLmdldFRleHRXaWR0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5nZXRUZXh0SGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGluaXQ6IGZ1bmN0aW9uKHRleHQsIG9wdCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBjLndpZHRoID0gdGhpcy5nZXRUZXh0V2lkdGgoKTtcclxuICAgICAgICBjLmhlaWdodCA9IHRoaXMuZ2V0VGV4dEhlaWdodCgpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oY3R4KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiB0aGlzLmNvbnRleHQuJG1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChwIGluIGN0eCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAgIT0gXCJ0ZXh0QmFzZWxpbmVcIiAmJiB0aGlzLmNvbnRleHQuJG1vZGVsW3BdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gdGhpcy5jb250ZXh0LiRtb2RlbFtwXTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0KGN0eCwgdGhpcy5fZ2V0VGV4dExpbmVzKCkpO1xyXG4gICAgfSxcclxuICAgIHJlc2V0VGV4dDogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLmhlYXJ0QmVhdCgpO1xyXG4gICAgfSxcclxuICAgIGdldFRleHRXaWR0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gMDtcclxuICAgICAgICBVdGlscy5fcGl4ZWxDdHguc2F2ZSgpO1xyXG4gICAgICAgIFV0aWxzLl9waXhlbEN0eC5mb250ID0gdGhpcy5jb250ZXh0LmZvbnQ7XHJcbiAgICAgICAgd2lkdGggPSB0aGlzLl9nZXRUZXh0V2lkdGgoVXRpbHMuX3BpeGVsQ3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gd2lkdGg7XHJcbiAgICB9LFxyXG4gICAgZ2V0VGV4dEhlaWdodDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRleHRIZWlnaHQoVXRpbHMuX3BpeGVsQ3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRMaW5lczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5zcGxpdCh0aGlzLl9yZU5ld2xpbmUpO1xyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dFN0cm9rZShjdHgsIHRleHRMaW5lcyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dEZpbGwoY3R4LCB0ZXh0TGluZXMpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX2dldEZvbnREZWNsYXJhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBmb250QXJyID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaCh0aGlzLmZvbnRQcm9wZXJ0cywgZnVuY3Rpb24ocCkge1xyXG4gICAgICAgICAgICB2YXIgZm9udFAgPSBzZWxmLl9jb250ZXh0W3BdO1xyXG4gICAgICAgICAgICBpZiAocCA9PSBcImZvbnRTaXplXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvbnRQID0gcGFyc2VGbG9hdChmb250UCkgKyBcInB4XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb250UCAmJiBmb250QXJyLnB1c2goZm9udFApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9udEFyci5qb2luKCcgJyk7XHJcblxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0RmlsbDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5maWxsU3R5bGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcyA9IFtdO1xyXG4gICAgICAgIHZhciBsaW5lSGVpZ2h0cyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0T2ZMaW5lID0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKGN0eCwgaSwgdGV4dExpbmVzKTtcclxuICAgICAgICAgICAgbGluZUhlaWdodHMgKz0gaGVpZ2h0T2ZMaW5lO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyVGV4dExpbmUoXHJcbiAgICAgICAgICAgICAgICAnZmlsbFRleHQnLFxyXG4gICAgICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICAgICAgdGV4dExpbmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgMCwgLy90aGlzLl9nZXRMZWZ0T2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRUb3BPZmZzZXQoKSArIGxpbmVIZWlnaHRzLFxyXG4gICAgICAgICAgICAgICAgaVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dFN0cm9rZTogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5zdHJva2VTdHlsZSB8fCAhdGhpcy5jb250ZXh0LmxpbmVXaWR0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgbGluZUhlaWdodHMgPSAwO1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLnN0cm9rZURhc2hBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAoMSAmIHRoaXMuc3Ryb2tlRGFzaEFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHJva2VEYXNoQXJyYXkucHVzaC5hcHBseSh0aGlzLnN0cm9rZURhc2hBcnJheSwgdGhpcy5zdHJva2VEYXNoQXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cHBvcnRzTGluZURhc2ggJiYgY3R4LnNldExpbmVEYXNoKHRoaXMuc3Ryb2tlRGFzaEFycmF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHRPZkxpbmUgPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoY3R4LCBpLCB0ZXh0TGluZXMpO1xyXG4gICAgICAgICAgICBsaW5lSGVpZ2h0cyArPSBoZWlnaHRPZkxpbmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0TGluZShcclxuICAgICAgICAgICAgICAgICdzdHJva2VUZXh0JyxcclxuICAgICAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgICAgIHRleHRMaW5lc1tpXSxcclxuICAgICAgICAgICAgICAgIDAsIC8vdGhpcy5fZ2V0TGVmdE9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0VG9wT2Zmc2V0KCkgKyBsaW5lSGVpZ2h0cyxcclxuICAgICAgICAgICAgICAgIGlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHRMaW5lOiBmdW5jdGlvbihtZXRob2QsIGN0eCwgbGluZSwgbGVmdCwgdG9wLCBsaW5lSW5kZXgpIHtcclxuICAgICAgICB0b3AgLT0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKCkgLyA0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHQudGV4dEFsaWduICE9PSAnanVzdGlmeScpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIGxpbmUsIGxlZnQsIHRvcCwgbGluZUluZGV4KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lKS53aWR0aDtcclxuICAgICAgICB2YXIgdG90YWxXaWR0aCA9IHRoaXMuY29udGV4dC53aWR0aDtcclxuXHJcbiAgICAgICAgaWYgKHRvdGFsV2lkdGggPiBsaW5lV2lkdGgpIHtcclxuICAgICAgICAgICAgdmFyIHdvcmRzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICB2YXIgd29yZHNXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lLnJlcGxhY2UoL1xccysvZywgJycpKS53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHdpZHRoRGlmZiA9IHRvdGFsV2lkdGggLSB3b3Jkc1dpZHRoO1xyXG4gICAgICAgICAgICB2YXIgbnVtU3BhY2VzID0gd29yZHMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgdmFyIHNwYWNlV2lkdGggPSB3aWR0aERpZmYgLyBudW1TcGFjZXM7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVmdE9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB3b3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIHdvcmRzW2ldLCBsZWZ0ICsgbGVmdE9mZnNldCwgdG9wLCBsaW5lSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgbGVmdE9mZnNldCArPSBjdHgubWVhc3VyZVRleHQod29yZHNbaV0pLndpZHRoICsgc3BhY2VXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNoYXJzKG1ldGhvZCwgY3R4LCBsaW5lLCBsZWZ0LCB0b3AsIGxpbmVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJDaGFyczogZnVuY3Rpb24obWV0aG9kLCBjdHgsIGNoYXJzLCBsZWZ0LCB0b3ApIHtcclxuICAgICAgICBjdHhbbWV0aG9kXShjaGFycywgMCwgdG9wKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0SGVpZ2h0T2ZMaW5lOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmZvbnRTaXplICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRXaWR0aDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBjdHgubWVhc3VyZVRleHQodGV4dExpbmVzWzBdIHx8ICd8Jykud2lkdGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudExpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0TGluZXNbaV0pLndpZHRoO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudExpbmVXaWR0aCA+IG1heFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCA9IGN1cnJlbnRMaW5lV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfSxcclxuICAgIF9nZXRUZXh0SGVpZ2h0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZm9udFNpemUgKiB0ZXh0TGluZXMubGVuZ3RoICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVG9wIG9mZnNldFxyXG4gICAgICovXHJcbiAgICBfZ2V0VG9wT2Zmc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdCA9IDA7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtaWRkbGVcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAtdGhpcy5jb250ZXh0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IC10aGlzLmNvbnRleHQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHZhciB4ID0gMDtcclxuICAgICAgICB2YXIgeSA9IDA7XHJcbiAgICAgICAgLy/mm7Tlhbd0ZXh0QWxpZ24g5ZKMIHRleHRCYXNlbGluZSDph43mlrDnn6vmraMgeHlcclxuICAgICAgICBpZiAoYy50ZXh0QWxpZ24gPT0gXCJjZW50ZXJcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGggLyAyO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGMudGV4dEFsaWduID09IFwicmlnaHRcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYy50ZXh0QmFzZWxpbmUgPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICAgICAgICB5ID0gLWMuaGVpZ2h0IC8gMjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjLnRleHRCYXNlbGluZSA9PSBcImJvdHRvbVwiKSB7XHJcbiAgICAgICAgICAgIHkgPSAtYy5oZWlnaHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgd2lkdGg6IGMud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogYy5oZWlnaHRcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBUZXh0OyIsIlxuLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5ZCR6YeP5pON5L2c57G7XG4gKiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICB2YXIgdnggPSAwLHZ5ID0gMDtcbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBfLmlzT2JqZWN0KCB4ICkgKXtcbiAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgaWYoIF8uaXNBcnJheSggYXJnICkgKXtcbiAgICAgICAgICAgdnggPSBhcmdbMF07XG4gICAgICAgICAgIHZ5ID0gYXJnWzFdO1xuICAgICAgICB9IGVsc2UgaWYoIGFyZy5oYXNPd25Qcm9wZXJ0eShcInhcIikgJiYgYXJnLmhhc093blByb3BlcnR5KFwieVwiKSApIHtcbiAgICAgICAgICAgdnggPSBhcmcueDtcbiAgICAgICAgICAgdnkgPSBhcmcueTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9heGVzID0gW3Z4LCB2eV07XG59O1xuVmVjdG9yLnByb3RvdHlwZSA9IHtcbiAgICBkaXN0YW5jZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLl9heGVzWzBdIC0gdi5fYXhlc1swXTtcbiAgICAgICAgdmFyIHkgPSB0aGlzLl9heGVzWzFdIC0gdi5fYXhlc1sxXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgVmVjdG9yOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOWkhOeQhuS4uuW5s+a7kee6v+adoVxuICovXG5pbXBvcnQgVmVjdG9yIGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiBAaW5uZXJcbiAqL1xuZnVuY3Rpb24gaW50ZXJwb2xhdGUocDAsIHAxLCBwMiwgcDMsIHQsIHQyLCB0Mykge1xuICAgIHZhciB2MCA9IChwMiAtIHAwKSAqIDAuMjU7XG4gICAgdmFyIHYxID0gKHAzIC0gcDEpICogMC4yNTtcbiAgICByZXR1cm4gKDIgKiAocDEgLSBwMikgKyB2MCArIHYxKSAqIHQzIFxuICAgICAgICAgICArICgtIDMgKiAocDEgLSBwMikgLSAyICogdjAgLSB2MSkgKiB0MlxuICAgICAgICAgICArIHYwICogdCArIHAxO1xufVxuLyoqXG4gKiDlpJrnur/mrrXlubPmu5Hmm7Lnur8gXG4gKiBvcHQgPT0+IHBvaW50cyAsIGlzTG9vcFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoIG9wdCApIHtcbiAgICB2YXIgcG9pbnRzID0gb3B0LnBvaW50cztcbiAgICB2YXIgaXNMb29wID0gb3B0LmlzTG9vcDtcbiAgICB2YXIgc21vb3RoRmlsdGVyID0gb3B0LnNtb290aEZpbHRlcjtcblxuICAgIHZhciBsZW4gPSBwb2ludHMubGVuZ3RoO1xuICAgIGlmKCBsZW4gPT0gMSApe1xuICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gW107XG4gICAgdmFyIGRpc3RhbmNlICA9IDA7XG4gICAgdmFyIHByZVZlcnRvciA9IG5ldyBWZWN0b3IoIHBvaW50c1swXSApO1xuICAgIHZhciBpVnRvciAgICAgPSBudWxsXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpVnRvciA9IG5ldyBWZWN0b3IocG9pbnRzW2ldKTtcbiAgICAgICAgZGlzdGFuY2UgKz0gcHJlVmVydG9yLmRpc3RhbmNlKCBpVnRvciApO1xuICAgICAgICBwcmVWZXJ0b3IgPSBpVnRvcjtcbiAgICB9XG5cbiAgICBwcmVWZXJ0b3IgPSBudWxsO1xuICAgIGlWdG9yICAgICA9IG51bGw7XG5cblxuICAgIC8v5Z+65pys5LiK562J5LqO5puy546HXG4gICAgdmFyIHNlZ3MgPSBkaXN0YW5jZSAvIDY7XG5cbiAgICBzZWdzID0gc2VncyA8IGxlbiA/IGxlbiA6IHNlZ3M7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdzOyBpKyspIHtcbiAgICAgICAgdmFyIHBvcyA9IGkgLyAoc2Vncy0xKSAqIChpc0xvb3AgPyBsZW4gOiBsZW4gLSAxKTtcbiAgICAgICAgdmFyIGlkeCA9IE1hdGguZmxvb3IocG9zKTtcblxuICAgICAgICB2YXIgdyA9IHBvcyAtIGlkeDtcblxuICAgICAgICB2YXIgcDA7XG4gICAgICAgIHZhciBwMSA9IHBvaW50c1tpZHggJSBsZW5dO1xuICAgICAgICB2YXIgcDI7XG4gICAgICAgIHZhciBwMztcbiAgICAgICAgaWYgKCFpc0xvb3ApIHtcbiAgICAgICAgICAgIHAwID0gcG9pbnRzW2lkeCA9PT0gMCA/IGlkeCA6IGlkeCAtIDFdO1xuICAgICAgICAgICAgcDIgPSBwb2ludHNbaWR4ID4gbGVuIC0gMiA/IGxlbiAtIDEgOiBpZHggKyAxXTtcbiAgICAgICAgICAgIHAzID0gcG9pbnRzW2lkeCA+IGxlbiAtIDMgPyBsZW4gLSAxIDogaWR4ICsgMl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwMCA9IHBvaW50c1soaWR4IC0xICsgbGVuKSAlIGxlbl07XG4gICAgICAgICAgICBwMiA9IHBvaW50c1soaWR4ICsgMSkgJSBsZW5dO1xuICAgICAgICAgICAgcDMgPSBwb2ludHNbKGlkeCArIDIpICUgbGVuXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3MiA9IHcgKiB3O1xuICAgICAgICB2YXIgdzMgPSB3ICogdzI7XG5cbiAgICAgICAgdmFyIHJwID0gW1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlKHAwWzBdLCBwMVswXSwgcDJbMF0sIHAzWzBdLCB3LCB3MiwgdzMpLFxuICAgICAgICAgICAgICAgIGludGVycG9sYXRlKHAwWzFdLCBwMVsxXSwgcDJbMV0sIHAzWzFdLCB3LCB3MiwgdzMpXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICBfLmlzRnVuY3Rpb24oc21vb3RoRmlsdGVyKSAmJiBzbW9vdGhGaWx0ZXIoIHJwICk7XG5cbiAgICAgICAgcmV0LnB1c2goIHJwICk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59OyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmipjnur8g57G7XHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHBvaW50TGlzdCDlkITkuKrpobbop5LlnZDmoIdcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgU21vb3RoU3BsaW5lIGZyb20gXCIuLi9nZW9tL1Ntb290aFNwbGluZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIEJyb2tlbkxpbmUgPSBmdW5jdGlvbihvcHQgLCBhdHlwZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJicm9rZW5saW5lXCI7XHJcbiAgICBzZWxmLl9kcmF3VHlwZU9ubHkgPSBcInN0cm9rZVwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIGlmKCBhdHlwZSAhPT0gXCJjbG9uZVwiICl7XHJcbiAgICAgICAgc2VsZi5faW5pdFBvaW50TGlzdChvcHQuY29udGV4dCk7XHJcbiAgICB9O1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBsaW5lVHlwZTogbnVsbCxcclxuICAgICAgICBzbW9vdGg6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50TGlzdDogW10sIC8ve0FycmF5fSAgLy8g5b+F6aG777yM5ZCE5Liq6aG26KeS5Z2Q5qCHXHJcbiAgICAgICAgc21vb3RoRmlsdGVyOiBudWxsXHJcbiAgICB9LCBvcHQuY29udGV4dCApO1xyXG5cclxuICAgIEJyb2tlbkxpbmUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhCcm9rZW5MaW5lLCBTaGFwZSwge1xyXG4gICAgJHdhdGNoOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICBpZiAobmFtZSA9PSBcInBvaW50TGlzdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRQb2ludExpc3QodGhpcy5jb250ZXh0LCB2YWx1ZSwgcHJlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfaW5pdFBvaW50TGlzdDogZnVuY3Rpb24oY29udGV4dCwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG15QyA9IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKG15Qy5zbW9vdGgpIHtcclxuICAgICAgICAgICAgLy9zbW9vdGhGaWx0ZXIgLS0g5q+U5aaC5Zyo5oqY57q/5Zu+5Lit44CC5Lya5Lyg5LiA5Liqc21vb3RoRmlsdGVy6L+H5p2l5YGacG9pbnTnmoTnuqDmraPjgIJcclxuICAgICAgICAgICAgLy/orql55LiN6IO96LaF6L+H5bqV6YOo55qE5Y6f54K5XHJcbiAgICAgICAgICAgIHZhciBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHM6IG15Qy5wb2ludExpc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKG15Qy5zbW9vdGhGaWx0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc21vb3RoRmlsdGVyID0gbXlDLnNtb290aEZpbHRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7IC8v5pys5qyh6L2s5o2i5LiN5Ye65Y+R5b+D6LezXHJcbiAgICAgICAgICAgIHZhciBjdXJyTCA9IFNtb290aFNwbGluZShvYmopO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyTFtjdXJyTC5sZW5ndGggLSAxXVswXSA9IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdWzBdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBteUMucG9pbnRMaXN0ID0gY3Vyckw7XHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICAvL3BvbHlnb27pnIDopoHopobnm5ZkcmF35pa55rOV77yM5omA5Lul6KaB5oqK5YW35L2T55qE57uY5Yi25Luj56CB5L2c5Li6X2RyYXfmir3nprvlh7rmnaVcclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgIH0sXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xyXG4gICAgICAgIGlmIChwb2ludExpc3QubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAvLyDlsJHkuo4y5Liq54K55bCx5LiN55S75LqGflxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWNvbnRleHQubGluZVR5cGUgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnc29saWQnKSB7XHJcbiAgICAgICAgICAgIC8v6buY6K6k5Li65a6e57q/XHJcbiAgICAgICAgICAgIC8vVE9ETzrnm67liY3lpoLmnpwg5pyJ6K6+572uc21vb3RoIOeahOaDheWGteS4i+aYr+S4jeaUr+aMgeiZmue6v+eahFxyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHBvaW50TGlzdFswXVswXSwgcG9pbnRMaXN0WzBdWzFdKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5zbW9vdGgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNpID0gMCwgc2wgPSBwb2ludExpc3QubGVuZ3RoOyBzaSA8IHNsOyBzaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpID09IHNsLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCBwb2ludExpc3Rbc2ldWzBdICwgcG9pbnRMaXN0W3NpXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oIHBvaW50TGlzdFtzaSsxXVswXSAsIHBvaW50TGlzdFtzaSsxXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpKz0xO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v55S76Jma57q/55qE5pa55rOVICBcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21YID0gcG9pbnRMaXN0W2kgLSAxXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9YID0gcG9pbnRMaXN0W2ldWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tWSA9IHBvaW50TGlzdFtpIC0gMV1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvWSA9IHBvaW50TGlzdFtpXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhjdHgsIGZyb21YLCBmcm9tWSwgdG9YLCB0b1ksIDUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IGNvbnRleHQgPyBjb250ZXh0IDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFJlY3RGb3JtUG9pbnRMaXN0KGNvbnRleHQpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgQnJva2VuTGluZTsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAciDlnIbljYrlvoRcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxuXHJcbnZhciBDaXJjbGUgPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwiY2lyY2xlXCI7XHJcblxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG5cclxuICAgIC8v6buY6K6k5oOF5Ya15LiL6Z2i77yMY2lyY2xl5LiN6ZyA6KaB5oqKeHnov5vooYxwYXJlbnRJbnTovazmjaJcclxuICAgICggXCJ4eVRvSW50XCIgaW4gb3B0ICkgfHwgKCBvcHQueHlUb0ludCA9IGZhbHNlICk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICByIDogb3B0LmNvbnRleHQuciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOWchuWNiuW+hFxyXG4gICAgfVxyXG4gICAgQ2lyY2xlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhDaXJjbGUgLCBTaGFwZSAsIHtcclxuICAgLyoqXHJcbiAgICAgKiDliJvlu7rlnIblvaLot6/lvoRcclxuICAgICAqIEBwYXJhbSB7Q29udGV4dDJEfSBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgaWYgKCFzdHlsZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguYXJjKDAgLCAwLCBzdHlsZS5yLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue55+p5b2i5Yy65Z+f77yM55So5LqO5bGA6YOo5Yi35paw5ZKM5paH5a2X5a6a5L2NXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGVcclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdCA6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgfHwgc3R5bGUuc3Ryb2tlU3R5bGUgKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5yIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgIHkgOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5yIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgIHdpZHRoIDogc3R5bGUuciAqIDIgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCA6IHN0eWxlLnIgKiAyICsgbGluZVdpZHRoXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaXJjbGU7XHJcblxyXG5cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gLS0gdCB7MCwgMX1cbiAgICAgKiBAcmV0dXJuIHtQb2ludH0gIC0tIHJldHVybiBwb2ludCBhdCB0aGUgZ2l2ZW4gdGltZSBpbiB0aGUgYmV6aWVyIGFyY1xuICAgICAqL1xuICAgIGdldFBvaW50QnlUaW1lOiBmdW5jdGlvbih0ICwgcGxpc3QpIHtcbiAgICAgICAgdmFyIGl0ID0gMSAtIHQsXG4gICAgICAgIGl0MiA9IGl0ICogaXQsXG4gICAgICAgIGl0MyA9IGl0MiAqIGl0O1xuICAgICAgICB2YXIgdDIgPSB0ICogdCxcbiAgICAgICAgdDMgPSB0MiAqIHQ7XG4gICAgICAgIHZhciB4U3RhcnQ9cGxpc3RbMF0seVN0YXJ0PXBsaXN0WzFdLGNwWDE9cGxpc3RbMl0sY3BZMT1wbGlzdFszXSxjcFgyPTAsY3BZMj0wLHhFbmQ9MCx5RW5kPTA7XG4gICAgICAgIGlmKHBsaXN0Lmxlbmd0aD42KXtcbiAgICAgICAgICAgIGNwWDI9cGxpc3RbNF07XG4gICAgICAgICAgICBjcFkyPXBsaXN0WzVdO1xuICAgICAgICAgICAgeEVuZD1wbGlzdFs2XTtcbiAgICAgICAgICAgIHlFbmQ9cGxpc3RbN107XG4gICAgICAgICAgICAvL+S4ieasoei0neWhnuWwlFxuICAgICAgICAgICAgcmV0dXJuIHsgXG4gICAgICAgICAgICAgICAgeCA6IGl0MyAqIHhTdGFydCArIDMgKiBpdDIgKiB0ICogY3BYMSArIDMgKiBpdCAqIHQyICogY3BYMiArIHQzICogeEVuZCxcbiAgICAgICAgICAgICAgICB5IDogaXQzICogeVN0YXJ0ICsgMyAqIGl0MiAqIHQgKiBjcFkxICsgMyAqIGl0ICogdDIgKiBjcFkyICsgdDMgKiB5RW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+S6jOasoei0neWhnuWwlFxuICAgICAgICAgICAgeEVuZD1wbGlzdFs0XTtcbiAgICAgICAgICAgIHlFbmQ9cGxpc3RbNV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHggOiBpdDIgKiB4U3RhcnQgKyAyICogdCAqIGl0ICogY3BYMSArIHQyKnhFbmQsXG4gICAgICAgICAgICAgICAgeSA6IGl0MiAqIHlTdGFydCArIDIgKiB0ICogaXQgKiBjcFkxICsgdDIqeUVuZFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiBQYXRoIOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBwYXRoIHBhdGjkuLJcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgTWF0cml4IGZyb20gXCIuLi9nZW9tL01hdHJpeFwiO1xyXG5pbXBvcnQgQmV6aWVyIGZyb20gXCIuLi9nZW9tL2JlemllclwiO1xyXG5cclxudmFyIFBhdGggPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwicGF0aFwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIGlmIChcImRyYXdUeXBlT25seVwiIGluIG9wdCkge1xyXG4gICAgICAgIHNlbGYuZHJhd1R5cGVPbmx5ID0gb3B0LmRyYXdUeXBlT25seTtcclxuICAgIH07XHJcbiAgICBzZWxmLl9fcGFyc2VQYXRoRGF0YSA9IG51bGw7XHJcbiAgICB2YXIgX2NvbnRleHQgPSB7XHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy/ku47kuIvpnaLnmoRwYXRo5Lit6K6h566X5b6X5Yiw55qE6L6555WM54K555qE6ZuG5ZCIXHJcbiAgICAgICAgcGF0aDogb3B0LmNvbnRleHQucGF0aCB8fCBcIlwiIC8v5a2X56ym5LiyIOW/hemhu++8jOi3r+W+hOOAguS+i+WmgjpNIDAgMCBMIDAgMTAgTCAxMCAxMCBaICjkuIDkuKrkuInop5LlvaIpXHJcbiAgICAgICAgICAgIC8vTSA9IG1vdmV0b1xyXG4gICAgICAgICAgICAvL0wgPSBsaW5ldG9cclxuICAgICAgICAgICAgLy9IID0gaG9yaXpvbnRhbCBsaW5ldG9cclxuICAgICAgICAgICAgLy9WID0gdmVydGljYWwgbGluZXRvXHJcbiAgICAgICAgICAgIC8vQyA9IGN1cnZldG9cclxuICAgICAgICAgICAgLy9TID0gc21vb3RoIGN1cnZldG9cclxuICAgICAgICAgICAgLy9RID0gcXVhZHJhdGljIEJlbHppZXIgY3VydmVcclxuICAgICAgICAgICAgLy9UID0gc21vb3RoIHF1YWRyYXRpYyBCZWx6aWVyIGN1cnZldG9cclxuICAgICAgICAgICAgLy9aID0gY2xvc2VwYXRoXHJcbiAgICB9O1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKF9jb250ZXh0LCAoc2VsZi5fY29udGV4dCB8fCB7fSkpO1xyXG4gICAgUGF0aC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKFBhdGgsIFNoYXBlLCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicGF0aFwiKSB7IC8v5aaC5p6ccGF0aOacieWPmOWKqO+8jOmcgOimgeiHquWKqOiuoeeul+aWsOeahHBvaW50TGlzdFxyXG4gICAgICAgICAgICB0aGlzLl9fcGFyc2VQYXRoRGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5wb2ludExpc3QgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgX3BhcnNlUGF0aERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fX3BhcnNlUGF0aERhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJzZVBhdGhEYXRhO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8v5YiG5ouG5a2Q5YiG57uEXHJcbiAgICAgICAgdGhpcy5fX3BhcnNlUGF0aERhdGEgPSBbXTtcclxuICAgICAgICB2YXIgcGF0aHMgPSBfLmNvbXBhY3QoZGF0YS5yZXBsYWNlKC9bTW1dL2csIFwiXFxcXHIkJlwiKS5zcGxpdCgnXFxcXHInKSk7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICBfLmVhY2gocGF0aHMsIGZ1bmN0aW9uKHBhdGhTdHIpIHtcclxuICAgICAgICAgICAgbWUuX19wYXJzZVBhdGhEYXRhLnB1c2gobWUuX3BhcnNlQ2hpbGRQYXRoRGF0YShwYXRoU3RyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJzZVBhdGhEYXRhO1xyXG4gICAgfSxcclxuICAgIF9wYXJzZUNoaWxkUGF0aERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAvLyBjb21tYW5kIHN0cmluZ1xyXG4gICAgICAgIHZhciBjcyA9IGRhdGE7XHJcbiAgICAgICAgLy8gY29tbWFuZCBjaGFyc1xyXG4gICAgICAgIHZhciBjYyA9IFtcclxuICAgICAgICAgICAgJ20nLCAnTScsICdsJywgJ0wnLCAndicsICdWJywgJ2gnLCAnSCcsICd6JywgJ1onLFxyXG4gICAgICAgICAgICAnYycsICdDJywgJ3EnLCAnUScsICd0JywgJ1QnLCAncycsICdTJywgJ2EnLCAnQSdcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvICAvZywgJyAnKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLyAvZywgJywnKTtcclxuICAgICAgICAvL2NzID0gY3MucmVwbGFjZSgvKC4pLS9nLCBcIiQxLC1cIik7XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8oXFxkKS0vZywgJyQxLC0nKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLywsL2csICcsJyk7XHJcbiAgICAgICAgdmFyIG47XHJcbiAgICAgICAgLy8gY3JlYXRlIHBpcGVzIHNvIHRoYXQgd2UgY2FuIHNwbGl0IHRoZSBkYXRhXHJcbiAgICAgICAgZm9yIChuID0gMDsgbiA8IGNjLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgIGNzID0gY3MucmVwbGFjZShuZXcgUmVnRXhwKGNjW25dLCAnZycpLCAnfCcgKyBjY1tuXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBhcnJheVxyXG4gICAgICAgIHZhciBhcnIgPSBjcy5zcGxpdCgnfCcpO1xyXG4gICAgICAgIHZhciBjYSA9IFtdO1xyXG4gICAgICAgIC8vIGluaXQgY29udGV4dCBwb2ludFxyXG4gICAgICAgIHZhciBjcHggPSAwO1xyXG4gICAgICAgIHZhciBjcHkgPSAwO1xyXG4gICAgICAgIGZvciAobiA9IDE7IG4gPCBhcnIubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgdmFyIHN0ciA9IGFycltuXTtcclxuICAgICAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KDApO1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJ2UsLScsICdnJyksICdlLScpO1xyXG5cclxuICAgICAgICAgICAgLy/mnInnmoTml7blgJnvvIzmr5TlpoLigJwyMu+8jC0yMuKAnSDmlbDmja7lj6/og73kvJrnu4/luLjnmoTooqvlhpnmiJAyMi0yMu+8jOmCo+S5iOmcgOimgeaJi+WKqOS/ruaUuVxyXG4gICAgICAgICAgICAvL3N0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJy0nLCAnZycpLCAnLC0nKTtcclxuICAgICAgICAgICAgLy9zdHIgPSBzdHIucmVwbGFjZSgvKC4pLS9nLCBcIiQxLC1cIilcclxuICAgICAgICAgICAgdmFyIHAgPSBzdHIuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA+IDAgJiYgcFswXSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwW2ldID0gcGFyc2VGbG9hdChwW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAocC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFswXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdGxQdHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RsUHR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZDbWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJ4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHJ5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBzaTtcclxuICAgICAgICAgICAgICAgIHZhciBmYTtcclxuICAgICAgICAgICAgICAgIHZhciBmcztcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgeDEgPSBjcHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgeTEgPSBjcHk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCBsLCBILCBoLCBWLCBhbmQgdiB0byBMXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnbCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ00nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdoJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0gnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1YnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdDJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gocC5zaGlmdCgpLCBwLnNoaWZ0KCksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q21kID0gY2FbY2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2Q21kLmNvbW1hbmQgPT09ICdDJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4ICsgKGNweCAtIHByZXZDbWQucG9pbnRzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweSArIChjcHkgLSBwcmV2Q21kLnBvaW50c1szXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3RsUHR4LCBjdGxQdHksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdDJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ0MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCwgY3RsUHR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwLnNoaWZ0KCksIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdRJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdUJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ1EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjdGxQdHgsIGN0bFB0eSwgY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnUSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGN0bFB0eCwgY3RsUHR5LCBjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTsgLy945Y2K5b6EXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ5ID0gcC5zaGlmdCgpOyAvL3nljYrlvoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHNpID0gcC5zaGlmdCgpOyAvL+aXi+i9rOinkuW6plxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYSA9IHAuc2hpZnQoKTsgLy/op5LluqblpKflsI8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpOyAvL+aXtumSiOaWueWQkVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCksIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMgPSB0aGlzLl9jb252ZXJ0UG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSwgeTEsIGNweCwgY3B5LCBmYSwgZnMsIHJ4LCByeSwgcHNpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBzaSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmEgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IHRoaXMuX2NvbnZlcnRQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxLCB5MSwgY3B4LCBjcHksIGZhLCBmcywgcngsIHJ5LCBwc2lcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNtZCB8fCBjLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50czogcG9pbnRzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGMgPT09ICd6JyB8fCBjID09PSAnWicpIHtcclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICd6JyxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHM6IFtdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNhO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKlxyXG4gICAgICogQHBhcmFtIHgxIOWOn+eCuXhcclxuICAgICAqIEBwYXJhbSB5MSDljp/ngrl5XHJcbiAgICAgKiBAcGFyYW0geDIg57uI54K55Z2Q5qCHIHhcclxuICAgICAqIEBwYXJhbSB5MiDnu4jngrnlnZDmoIcgeVxyXG4gICAgICogQHBhcmFtIGZhIOinkuW6puWkp+Wwj1xyXG4gICAgICogQHBhcmFtIGZzIOaXtumSiOaWueWQkVxyXG4gICAgICogQHBhcmFtIHJ4IHjljYrlvoRcclxuICAgICAqIEBwYXJhbSByeSB55Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0gcHNpRGVnIOaXi+i9rOinkuW6plxyXG4gICAgICovXHJcbiAgICBfY29udmVydFBvaW50OiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZmEsIGZzLCByeCwgcnksIHBzaURlZykge1xyXG5cclxuICAgICAgICB2YXIgcHNpID0gcHNpRGVnICogKE1hdGguUEkgLyAxODAuMCk7XHJcbiAgICAgICAgdmFyIHhwID0gTWF0aC5jb3MocHNpKSAqICh4MSAtIHgyKSAvIDIuMCArIE1hdGguc2luKHBzaSkgKiAoeTEgLSB5MikgLyAyLjA7XHJcbiAgICAgICAgdmFyIHlwID0gLTEgKiBNYXRoLnNpbihwc2kpICogKHgxIC0geDIpIC8gMi4wICsgTWF0aC5jb3MocHNpKSAqICh5MSAtIHkyKSAvIDIuMDtcclxuXHJcbiAgICAgICAgdmFyIGxhbWJkYSA9ICh4cCAqIHhwKSAvIChyeCAqIHJ4KSArICh5cCAqIHlwKSAvIChyeSAqIHJ5KTtcclxuXHJcbiAgICAgICAgaWYgKGxhbWJkYSA+IDEpIHtcclxuICAgICAgICAgICAgcnggKj0gTWF0aC5zcXJ0KGxhbWJkYSk7XHJcbiAgICAgICAgICAgIHJ5ICo9IE1hdGguc3FydChsYW1iZGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGYgPSBNYXRoLnNxcnQoKCgocnggKiByeCkgKiAocnkgKiByeSkpIC0gKChyeCAqIHJ4KSAqICh5cCAqIHlwKSkgLSAoKHJ5ICogcnkpICogKHhwICogeHApKSkgLyAoKHJ4ICogcngpICogKHlwICogeXApICsgKHJ5ICogcnkpICogKHhwICogeHApKSk7XHJcblxyXG4gICAgICAgIGlmIChmYSA9PT0gZnMpIHtcclxuICAgICAgICAgICAgZiAqPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTmFOKGYpKSB7XHJcbiAgICAgICAgICAgIGYgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGN4cCA9IGYgKiByeCAqIHlwIC8gcnk7XHJcbiAgICAgICAgdmFyIGN5cCA9IGYgKiAtcnkgKiB4cCAvIHJ4O1xyXG5cclxuICAgICAgICB2YXIgY3ggPSAoeDEgKyB4MikgLyAyLjAgKyBNYXRoLmNvcyhwc2kpICogY3hwIC0gTWF0aC5zaW4ocHNpKSAqIGN5cDtcclxuICAgICAgICB2YXIgY3kgPSAoeTEgKyB5MikgLyAyLjAgKyBNYXRoLnNpbihwc2kpICogY3hwICsgTWF0aC5jb3MocHNpKSAqIGN5cDtcclxuXHJcbiAgICAgICAgdmFyIHZNYWcgPSBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdlJhdGlvID0gZnVuY3Rpb24odSwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gKHVbMF0gKiB2WzBdICsgdVsxXSAqIHZbMV0pIC8gKHZNYWcodSkgKiB2TWFnKHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB2QW5nbGUgPSBmdW5jdGlvbih1LCB2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodVswXSAqIHZbMV0gPCB1WzFdICogdlswXSA/IC0xIDogMSkgKiBNYXRoLmFjb3ModlJhdGlvKHUsIHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHZBbmdsZShbMSwgMF0sIFsoeHAgLSBjeHApIC8gcngsICh5cCAtIGN5cCkgLyByeV0pO1xyXG4gICAgICAgIHZhciB1ID0gWyh4cCAtIGN4cCkgLyByeCwgKHlwIC0gY3lwKSAvIHJ5XTtcclxuICAgICAgICB2YXIgdiA9IFsoLTEgKiB4cCAtIGN4cCkgLyByeCwgKC0xICogeXAgLSBjeXApIC8gcnldO1xyXG4gICAgICAgIHZhciBkVGhldGEgPSB2QW5nbGUodSwgdik7XHJcblxyXG4gICAgICAgIGlmICh2UmF0aW8odSwgdikgPD0gLTEpIHtcclxuICAgICAgICAgICAgZFRoZXRhID0gTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZSYXRpbyh1LCB2KSA+PSAxKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmcyA9PT0gMCAmJiBkVGhldGEgPiAwKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IGRUaGV0YSAtIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZnMgPT09IDEgJiYgZFRoZXRhIDwgMCkge1xyXG4gICAgICAgICAgICBkVGhldGEgPSBkVGhldGEgKyAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtjeCwgY3ksIHJ4LCByeSwgdGhldGEsIGRUaGV0YSwgcHNpLCBmc107XHJcbiAgICB9LFxyXG4gICAgLypcclxuICAgICAqIOiOt+WPlmJlemllcuS4iumdoueahOeCueWIl+ihqFxyXG4gICAgICogKi9cclxuICAgIF9nZXRCZXppZXJQb2ludHM6IGZ1bmN0aW9uKHApIHtcclxuICAgICAgICB2YXIgc3RlcHMgPSBNYXRoLmFicyhNYXRoLnNxcnQoTWF0aC5wb3cocC5zbGljZSgtMSlbMF0gLSBwWzFdLCAyKSArIE1hdGgucG93KHAuc2xpY2UoLTIsIC0xKVswXSAtIHBbMF0sIDIpKSk7XHJcbiAgICAgICAgc3RlcHMgPSBNYXRoLmNlaWwoc3RlcHMgLyA1KTtcclxuICAgICAgICB2YXIgcGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHN0ZXBzOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHQgPSBpIC8gc3RlcHM7XHJcbiAgICAgICAgICAgIHZhciB0cCA9IEJlemllci5nZXRQb2ludEJ5VGltZSh0LCBwKTtcclxuICAgICAgICAgICAgcGFyci5wdXNoKHRwLngpO1xyXG4gICAgICAgICAgICBwYXJyLnB1c2godHAueSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcGFycjtcclxuICAgIH0sXHJcbiAgICAvKlxyXG4gICAgICog5aaC5p6ccGF0aOS4reaciUEgYSDvvIzopoHlr7zlh7rlr7nlupTnmoRwb2ludHNcclxuICAgICAqL1xyXG4gICAgX2dldEFyY1BvaW50czogZnVuY3Rpb24ocCkge1xyXG5cclxuICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgIHZhciBjeSA9IHBbMV07XHJcbiAgICAgICAgdmFyIHJ4ID0gcFsyXTtcclxuICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHBbNF07XHJcbiAgICAgICAgdmFyIGRUaGV0YSA9IHBbNV07XHJcbiAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgdmFyIGZzID0gcFs3XTtcclxuICAgICAgICB2YXIgciA9IChyeCA+IHJ5KSA/IHJ4IDogcnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSAocnggPiByeSkgPyByeSAvIHJ4IDogMTtcclxuXHJcbiAgICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgTWF0cml4KCk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS5pZGVudGl0eSgpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKHBzaSk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoY3gsIGN5KTtcclxuXHJcbiAgICAgICAgdmFyIGNwcyA9IFtdO1xyXG4gICAgICAgIHZhciBzdGVwcyA9ICgzNjAgLSAoIWZzID8gMSA6IC0xKSAqIGRUaGV0YSAqIDE4MCAvIE1hdGguUEkpICUgMzYwO1xyXG5cclxuICAgICAgICBzdGVwcyA9IE1hdGguY2VpbChNYXRoLm1pbihNYXRoLmFicyhkVGhldGEpICogMTgwIC8gTWF0aC5QSSwgciAqIE1hdGguYWJzKGRUaGV0YSkgLyA4KSk7IC8v6Ze06ZqU5LiA5Liq5YOP57SgIOaJgOS7pSAvMlxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludCA9IFtNYXRoLmNvcyh0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByLCBNYXRoLnNpbih0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByXTtcclxuICAgICAgICAgICAgcG9pbnQgPSBfdHJhbnNmb3JtLm11bFZlY3Rvcihwb2ludCk7XHJcbiAgICAgICAgICAgIGNwcy5wdXNoKHBvaW50WzBdKTtcclxuICAgICAgICAgICAgY3BzLnB1c2gocG9pbnRbMV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNwcztcclxuICAgIH0sXHJcblxyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBzdHlsZSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAgY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHZhciBwYXRoID0gc3R5bGUucGF0aDtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gdGhpcy5fcGFyc2VQYXRoRGF0YShwYXRoKTtcclxuICAgICAgICB0aGlzLl9zZXRQb2ludExpc3QocGF0aEFycmF5LCBzdHlsZSk7XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IDAsIGdsID0gcGF0aEFycmF5Lmxlbmd0aDsgZyA8IGdsOyBnKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoQXJyYXlbZ10ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHBhdGhBcnJheVtnXVtpXS5jb21tYW5kLCBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBbMF0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwWzBdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHBbMF0sIHBbMV0sIHBbMl0sIHBbM10sIHBbNF0sIHBbNV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdRJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8ocFswXSwgcFsxXSwgcFsyXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3kgPSBwWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnggPSBwWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhldGEgPSBwWzRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZFRoZXRhID0gcFs1XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcyA9IHBbN107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gKHJ4ID4gcnkpID8gcnggOiByeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVZID0gKHJ4ID4gcnkpID8gcnkgLyByeCA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnJvdGF0ZShwc2kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZShjeCwgY3kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+i/kOeUqOefqemYteW8gOWni+WPmOW9olxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYXJjKDAsIDAsIHIsIHRoZXRhLCB0aGV0YSArIGRUaGV0YSwgMSAtIGZzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9fdHJhbnNmb3JtLmludmVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS5pbnZlcnQoKS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd6JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgX3NldFBvaW50TGlzdDogZnVuY3Rpb24ocGF0aEFycmF5LCBzdHlsZSkge1xyXG4gICAgICAgIGlmIChzdHlsZS5wb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g6K6w5b2V6L6555WM54K577yM55So5LqO5Yik5pataW5zaWRlXHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IHN0eWxlLnBvaW50TGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGcgPSAwLCBnbCA9IHBhdGhBcnJheS5sZW5ndGg7IGcgPCBnbDsgZysrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2luZ2xlUG9pbnRMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBwYXRoQXJyYXlbZ11baV0uY29tbWFuZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gJ0EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHRoaXMuX2dldEFyY1BvaW50cyhwKTtcclxuICAgICAgICAgICAgICAgICAgICAvL0Hlkb3ku6TnmoTor53vvIzlpJbmjqXnn6nlvaLnmoTmo4DmtYvlv4XpobvovazmjaLkuLpfcG9pbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aEFycmF5W2ddW2ldLl9wb2ludHMgPSBwO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJDXCIgfHwgY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJRXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY1N0YXJ0ID0gWzAsIDBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBzaW5nbGVQb2ludExpc3Quc2xpY2UoLTEpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZVBvaW50cyA9IChwYXRoQXJyYXlbZ11baSAtIDFdLl9wb2ludHMgfHwgcGF0aEFycmF5W2ddW2kgLSAxXS5wb2ludHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJlUG9pbnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBwcmVQb2ludHMuc2xpY2UoLTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBwID0gdGhpcy5fZ2V0QmV6aWVyUG9pbnRzKGNTdGFydC5jb25jYXQocCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhBcnJheVtnXVtpXS5fcG9pbnRzID0gcDtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwLmxlbmd0aDsgaiA8IGs7IGogKz0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBweCA9IHBbal07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHB5ID0gcFtqICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCghcHggJiYgcHghPTApIHx8ICghcHkgJiYgcHkhPTApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlUG9pbnRMaXN0LnB1c2goW3B4LCBweV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCAmJiBwb2ludExpc3QucHVzaChzaW5nbGVQb2ludExpc3QpO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBnZXRSZWN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsaW5lV2lkdGg7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICBpZiAoc3R5bGUuc3Ryb2tlU3R5bGUgfHwgc3R5bGUuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWluWCA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIG1heFggPSAtTnVtYmVyLk1BWF9WQUxVRTsvL051bWJlci5NSU5fVkFMVUU7XHJcblxyXG4gICAgICAgIHZhciBtaW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICB2YXIgbWF4WSA9IC1OdW1iZXIuTUFYX1ZBTFVFOy8vTnVtYmVyLk1JTl9WQUxVRTtcclxuXHJcbiAgICAgICAgLy8g5bmz56e75Z2Q5qCHXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuXHJcbiAgICAgICAgdmFyIHBhdGhBcnJheSA9IHRoaXMuX3BhcnNlUGF0aERhdGEoc3R5bGUucGF0aCk7XHJcbiAgICAgICAgdGhpcy5fc2V0UG9pbnRMaXN0KHBhdGhBcnJheSwgc3R5bGUpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBnID0gMCwgZ2wgPSBwYXRoQXJyYXkubGVuZ3RoOyBnIDwgZ2w7IGcrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwYXRoQXJyYXlbZ11baV0uX3BvaW50cyB8fCBwYXRoQXJyYXlbZ11baV0ucG9pbnRzO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqICUgMiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocFtqXSArIHggPCBtaW5YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5YID0gcFtqXSArIHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB4ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4WCA9IHBbal0gKyB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB5IDwgbWluWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluWSA9IHBbal0gKyB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwW2pdICsgeSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFkgPSBwW2pdICsgeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciByZWN0O1xyXG4gICAgICAgIGlmIChtaW5YID09PSBOdW1iZXIuTUFYX1ZBTFVFIHx8IG1heFggPT09IE51bWJlci5NSU5fVkFMVUUgfHwgbWluWSA9PT0gTnVtYmVyLk1BWF9WQUxVRSB8fCBtYXhZID09PSBOdW1iZXIuTUlOX1ZBTFVFKSB7XHJcbiAgICAgICAgICAgIHJlY3QgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICAgICAgeTogMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVjdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IE1hdGgucm91bmQobWluWCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgeTogTWF0aC5yb3VuZChtaW5ZIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogbWF4WCAtIG1pblggKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG1heFkgLSBtaW5ZICsgbGluZVdpZHRoXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZWN0O1xyXG4gICAgfVxyXG5cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBhdGg7IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOawtOa7tOW9oiDnsbtcclxuICog5rS+55Sf6IeqUGF0aOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBociDmsLTmu7TmqKrlrr3vvIjkuK3lv4PliLDmsLTlubPovrnnvJjmnIDlrr3lpITot53nprvvvIlcclxuICogQHZyIOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gKiovXHJcbmltcG9ydCBQYXRoIGZyb20gXCIuL1BhdGhcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIERyb3BsZXQgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICBociA6IG9wdC5jb250ZXh0LmhyIHx8IDAgLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5rC05ru05qiq5a6977yI5Lit5b+D5Yiw5rC05bmz6L6557yY5pyA5a695aSE6Led56a777yJXHJcbiAgICAgICAgdnIgOiBvcHQuY29udGV4dC52ciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gICAgfTtcclxuICAgIERyb3BsZXQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgc2VsZi50eXBlID0gXCJkcm9wbGV0XCI7XHJcbn07XHJcblV0aWxzLmNyZWF0Q2xhc3MoIERyb3BsZXQgLCBQYXRoICwge1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgIHZhciBwcyA9IFwiTSAwIFwiK3N0eWxlLmhyK1wiIEMgXCIrc3R5bGUuaHIrXCIgXCIrc3R5bGUuaHIrXCIgXCIrKCBzdHlsZS5ociozLzIgKSArXCIgXCIrKC1zdHlsZS5oci8zKStcIiAwIFwiKygtc3R5bGUudnIpO1xyXG4gICAgICAgcHMgKz0gXCIgQyBcIisoLXN0eWxlLmhyICogMy8gMikrXCIgXCIrKC1zdHlsZS5ociAvIDMpK1wiIFwiKygtc3R5bGUuaHIpK1wiIFwiK3N0eWxlLmhyK1wiIDAgXCIrIHN0eWxlLmhyO1xyXG4gICAgICAgdGhpcy5jb250ZXh0LnBhdGggPSBwcztcclxuICAgICAgIHRoaXMuX2RyYXcoY3R4ICwgc3R5bGUpO1xyXG4gICAgfVxyXG59ICk7XHJcbmV4cG9ydCBkZWZhdWx0IERyb3BsZXQ7XHJcbiIsIlxyXG4vKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5qSt5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJIFxyXG4gKlxyXG4gKiBAaHIg5qSt5ZyG5qiq6L205Y2K5b6EXHJcbiAqIEB2ciDmpK3lnIbnurXovbTljYrlvoRcclxuICovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbnZhciBFbGxpcHNlID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwiZWxsaXBzZVwiO1xyXG5cclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgLy94ICAgICAgICAgICAgIDogMCAsIC8ve251bWJlcn0sICAvLyDkuKLlvINcclxuICAgICAgICAvL3kgICAgICAgICAgICAgOiAwICwgLy97bnVtYmVyfSwgIC8vIOS4ouW8g++8jOWOn+WboOWQjGNpcmNsZVxyXG4gICAgICAgIGhyIDogb3B0LmNvbnRleHQuaHIgfHwgMCAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmpK3lnIbmqKrovbTljYrlvoRcclxuICAgICAgICB2ciA6IG9wdC5jb250ZXh0LnZyIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5qSt5ZyG57q16L205Y2K5b6EXHJcbiAgICB9XHJcblxyXG4gICAgRWxsaXBzZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKEVsbGlwc2UgLCBTaGFwZSAsIHtcclxuICAgIGRyYXcgOiAgZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHZhciByID0gKHN0eWxlLmhyID4gc3R5bGUudnIpID8gc3R5bGUuaHIgOiBzdHlsZS52cjtcclxuICAgICAgICB2YXIgcmF0aW9YID0gc3R5bGUuaHIgLyByOyAvL+aoqui9tOe8qeaUvuavlOeOh1xyXG4gICAgICAgIHZhciByYXRpb1kgPSBzdHlsZS52ciAvIHI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnNjYWxlKHJhdGlvWCwgcmF0aW9ZKTtcclxuICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICAwLCAwLCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGlmICggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCApe1xyXG4gICAgICAgICAgIC8vaWXkuIvpnaLopoHmg7Pnu5jliLbkuKrmpK3lnIblh7rmnaXvvIzlsLHkuI3og73miafooYzov5nmraXkuoZcclxuICAgICAgICAgICAvL+eul+aYr2V4Y2FudmFzIOWunueOsOS4iumdoueahOS4gOS4qmJ1Z+WQp1xyXG4gICAgICAgICAgIGN0eC5zY2FsZSgxL3JhdGlvWCwgMS9yYXRpb1kpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGdldFJlY3QgOiBmdW5jdGlvbihzdHlsZSl7XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgfHwgc3R5bGUuc3Ryb2tlU3R5bGUpIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5ociAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgIHkgOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS52ciAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgIHdpZHRoIDogc3R5bGUuaHIgKiAyICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICAgIGhlaWdodCA6IHN0eWxlLnZyICogMiArIGxpbmVXaWR0aFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVsbGlwc2U7XHJcbiIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDlpJrovrnlvaIg57G7ICDvvIjkuI3op4TliJnvvIlcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcG9pbnRMaXN0IOWkmui+ueW9ouWQhOS4qumhtuinkuWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBCcm9rZW5MaW5lIGZyb20gXCIuL0Jyb2tlbkxpbmVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFBvbHlnb24gPSBmdW5jdGlvbihvcHQgLCBhdHlwZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuXHJcbiAgICBpZihhdHlwZSAhPT0gXCJjbG9uZVwiKXtcclxuICAgICAgICB2YXIgc3RhcnQgPSBvcHQuY29udGV4dC5wb2ludExpc3RbMF07XHJcbiAgICAgICAgdmFyIGVuZCAgID0gb3B0LmNvbnRleHQucG9pbnRMaXN0WyBvcHQuY29udGV4dC5wb2ludExpc3QubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgIGlmKCBvcHQuY29udGV4dC5zbW9vdGggKXtcclxuICAgICAgICAgICAgb3B0LmNvbnRleHQucG9pbnRMaXN0LnVuc2hpZnQoIGVuZCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9wdC5jb250ZXh0LnBvaW50TGlzdC5wdXNoKCBzdGFydCApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIFBvbHlnb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIGlmKGF0eXBlICE9PSBcImNsb25lXCIgJiYgb3B0LmNvbnRleHQuc21vb3RoICYmIGVuZCl7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLl9kcmF3VHlwZU9ubHkgPSBudWxsO1xyXG4gICAgc2VsZi50eXBlID0gXCJwb2x5Z29uXCI7XHJcbn07XHJcblV0aWxzLmNyZWF0Q2xhc3MoUG9seWdvbiwgQnJva2VuTGluZSwge1xyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmxpbmVUeXBlID09ICdkYXNoZWQnIHx8IGNvbnRleHQubGluZVR5cGUgPT0gJ2RvdHRlZCcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcclxuICAgICAgICAgICAgICAgIC8v54m55q6K5aSE55CG77yM6Jma57q/5Zu05LiN5oiQcGF0aO+8jOWunue6v+WGjWJ1aWxk5LiA5qyhXHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwb2ludExpc3RbMF1bMF0sIHBvaW50TGlzdFswXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL+WmguaenOS4i+mdouS4jeWKoHNhdmUgcmVzdG9yZe+8jGNhbnZhc+S8muaKiuS4i+mdoueahHBhdGjlkozkuIrpnaLnmoRwYXRo5LiA6LW3566X5L2c5LiA5p2hcGF0aOOAguWwseS8mue7mOWItuS6huS4gOadoeWunueOsOi+ueahhuWSjOS4gOiZmue6v+i+ueahhuOAglxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBvbHlnb247IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOato27ovrnlvaLvvIhuPj0z77yJXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIkgXHJcbiAqXHJcbiAqIEByIOato27ovrnlvaLlpJbmjqXlnIbljYrlvoRcclxuICogQHIg5oyH5piO5q2j5Yeg6L655b2iXHJcbiAqXHJcbiAqIEBwb2ludExpc3Qg56eB5pyJ77yM5LuO5LiK6Z2i55qEcuWSjG7orqHnrpflvpfliLDnmoTovrnnlYzlgLznmoTpm4blkIhcclxuICovXHJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuL1BvbHlnb25cIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIElzb2dvbiA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy/ku47kuIvpnaLnmoRy5ZKMbuiuoeeul+W+l+WIsOeahOi+ueeVjOWAvOeahOmbhuWQiFxyXG4gICAgICAgIHI6IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmraNu6L655b2i5aSW5o6l5ZyG5Y2K5b6EXHJcbiAgICAgICAgbjogMCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5oyH5piO5q2j5Yeg6L655b2iXHJcbiAgICB9ICwgb3B0LmNvbnRleHQpO1xyXG4gICAgc2VsZi5zZXRQb2ludExpc3Qoc2VsZi5fY29udGV4dCk7XHJcbiAgICBvcHQuY29udGV4dCA9IHNlbGYuX2NvbnRleHQ7XHJcbiAgICBJc29nb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy50eXBlID0gXCJpc29nb25cIjtcclxufTtcclxuVXRpbHMuY3JlYXRDbGFzcyhJc29nb24sIFBvbHlnb24sIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJyXCIgfHwgbmFtZSA9PSBcIm5cIikgeyAvL+WmguaenHBhdGjmnInlj5jliqjvvIzpnIDopoHoh6rliqjorqHnrpfmlrDnmoRwb2ludExpc3RcclxuICAgICAgICAgICAgdGhpcy5zZXRQb2ludExpc3QoIHRoaXMuY29udGV4dCApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXRQb2ludExpc3Q6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgc3R5bGUucG9pbnRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIG4gPSBzdHlsZS5uLCByID0gc3R5bGUucjtcclxuICAgICAgICB2YXIgZFN0ZXAgPSAyICogTWF0aC5QSSAvIG47XHJcbiAgICAgICAgdmFyIGJlZ2luRGVnID0gLU1hdGguUEkgLyAyO1xyXG4gICAgICAgIHZhciBkZWcgPSBiZWdpbkRlZztcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgZW5kID0gbjsgaSA8IGVuZDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0eWxlLnBvaW50TGlzdC5wdXNoKFtyICogTWF0aC5jb3MoZGVnKSwgciAqIE1hdGguc2luKGRlZyldKTtcclxuICAgICAgICAgICAgZGVnICs9IGRTdGVwO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBJc29nb247IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOe6v+adoSDnsbtcclxuICpcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAbGluZVR5cGUgIOWPr+mAiSDomZrnur8g5a6e546wIOeahCDnsbvlnotcclxuICogQHhTdGFydCAgICDlv4XpobvvvIzotbfngrnmqKrlnZDmoIdcclxuICogQHlTdGFydCAgICDlv4XpobvvvIzotbfngrnnurXlnZDmoIdcclxuICogQHhFbmQgICAgICDlv4XpobvvvIznu4jngrnmqKrlnZDmoIdcclxuICogQHlFbmQgICAgICDlv4XpobvvvIznu4jngrnnurXlnZDmoIdcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIExpbmUgPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMudHlwZSA9IFwibGluZVwiO1xyXG4gICAgdGhpcy5kcmF3VHlwZU9ubHkgPSBcInN0cm9rZVwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgbGluZVR5cGU6IG9wdC5jb250ZXh0LmxpbmVUeXBlIHx8IG51bGwsIC8v5Y+v6YCJIOiZmue6vyDlrp7njrAg55qEIOexu+Wei1xyXG4gICAgICAgIHhTdGFydDogb3B0LmNvbnRleHQueFN0YXJ0IHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzotbfngrnmqKrlnZDmoIdcclxuICAgICAgICB5U3RhcnQ6IG9wdC5jb250ZXh0LnlTdGFydCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAgICAgICAgeEVuZDogb3B0LmNvbnRleHQueEVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAgICAgICAgeUVuZDogb3B0LmNvbnRleHQueUVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K557q15Z2Q5qCHXHJcbiAgICAgICAgZGFzaExlbmd0aDogb3B0LmNvbnRleHQuZGFzaExlbmd0aFxyXG4gICAgfVxyXG4gICAgTGluZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKExpbmUsIFNoYXBlLCB7XHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uue6v+adoei3r+W+hFxyXG4gICAgICogY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICBpZiAoIXN0eWxlLmxpbmVUeXBlIHx8IHN0eWxlLmxpbmVUeXBlID09ICdzb2xpZCcpIHtcclxuICAgICAgICAgICAgLy/pu5jorqTkuLrlrp7nur9cclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhwYXJzZUludChzdHlsZS54U3RhcnQpLCBwYXJzZUludChzdHlsZS55U3RhcnQpKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhwYXJzZUludChzdHlsZS54RW5kKSwgcGFyc2VJbnQoc3R5bGUueUVuZCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3R5bGUubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgc3R5bGUubGluZVR5cGUgPT0gJ2RvdHRlZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXNoZWRMaW5lVG8oXHJcbiAgICAgICAgICAgICAgICBjdHgsXHJcbiAgICAgICAgICAgICAgICBzdHlsZS54U3RhcnQsIHN0eWxlLnlTdGFydCxcclxuICAgICAgICAgICAgICAgIHN0eWxlLnhFbmQsIHN0eWxlLnlFbmQsXHJcbiAgICAgICAgICAgICAgICBzdHlsZS5kYXNoTGVuZ3RoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuefqeW9ouWMuuWfn++8jOeUqOS6juWxgOmDqOWIt+aWsOWSjOaWh+Wtl+WumuS9jVxyXG4gICAgICogc3R5bGVcclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICB2YXIgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBNYXRoLm1pbihzdHlsZS54U3RhcnQsIHN0eWxlLnhFbmQpIC0gbGluZVdpZHRoLFxyXG4gICAgICAgICAgICB5OiBNYXRoLm1pbihzdHlsZS55U3RhcnQsIHN0eWxlLnlFbmQpIC0gbGluZVdpZHRoLFxyXG4gICAgICAgICAgICB3aWR0aDogTWF0aC5hYnMoc3R5bGUueFN0YXJ0IC0gc3R5bGUueEVuZCkgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoc3R5bGUueVN0YXJ0IC0gc3R5bGUueUVuZCkgKyBsaW5lV2lkdGhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMaW5lOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDnn6nnjrAg57G7ICDvvIjkuI3op4TliJnvvIlcclxuICpcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAd2lkdGgg5a695bqmXHJcbiAqIEBoZWlnaHQg6auY5bqmXHJcbiAqIEByYWRpdXMg5aaC5p6c5piv5ZyG6KeS55qE77yM5YiZ5Li644CQ5LiK5Y+z5LiL5bem44CR6aG65bqP55qE5ZyG6KeS5Y2K5b6E5pWw57uEXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBSZWN0ID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwicmVjdFwiO1xyXG5cclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgIHdpZHRoICAgICAgICAgOiBvcHQuY29udGV4dC53aWR0aCB8fCAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzlrr3luqZcclxuICAgICAgICAgaGVpZ2h0ICAgICAgICA6IG9wdC5jb250ZXh0LmhlaWdodHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOmrmOW6plxyXG4gICAgICAgICByYWRpdXMgICAgICAgIDogb3B0LmNvbnRleHQucmFkaXVzfHwgW10gICAgIC8ve2FycmF5fSwgICAvLyDpu5jorqTkuLpbMF3vvIzlnIbop5IgXHJcbiAgICB9XHJcbiAgICBSZWN0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoIFJlY3QgLCBTaGFwZSAsIHtcclxuICAgIC8qKlxyXG4gICAgICog57uY5Yi25ZyG6KeS55+p5b2iXHJcbiAgICAgKiBAcGFyYW0ge0NvbnRleHQyRH0gY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfYnVpbGRSYWRpdXNQYXRoOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgLy/lt6bkuIrjgIHlj7PkuIrjgIHlj7PkuIvjgIHlt6bkuIvop5LnmoTljYrlvoTkvp3mrKHkuLpyMeOAgXIy44CBcjPjgIFyNFxyXG4gICAgICAgIC8vcue8qeWGmeS4ujEgICAgICAgICDnm7jlvZPkuo4gWzEsIDEsIDEsIDFdXHJcbiAgICAgICAgLy9y57yp5YaZ5Li6WzFdICAgICAgIOebuOW9k+S6jiBbMSwgMSwgMSwgMV1cclxuICAgICAgICAvL3LnvKnlhpnkuLpbMSwgMl0gICAg55u45b2T5LqOIFsxLCAyLCAxLCAyXVxyXG4gICAgICAgIC8vcue8qeWGmeS4ulsxLCAyLCAzXSDnm7jlvZPkuo4gWzEsIDIsIDMsIDJdXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmNvbnRleHQud2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuY29udGV4dC5oZWlnaHQ7XHJcbiAgICBcclxuICAgICAgICB2YXIgciA9IFV0aWxzLmdldENzc09yZGVyQXJyKHN0eWxlLnJhZGl1cyk7XHJcbiAgICAgXHJcbiAgICAgICAgY3R4Lm1vdmVUbyggcGFyc2VJbnQoeCArIHJbMF0pLCBwYXJzZUludCh5KSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCArIHdpZHRoIC0gclsxXSksIHBhcnNlSW50KHkpKTtcclxuICAgICAgICByWzFdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByWzFdXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHBhcnNlSW50KHggKyB3aWR0aCksIHBhcnNlSW50KHkgKyBoZWlnaHQgLSByWzJdKSk7XHJcbiAgICAgICAgclsyXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgICAgIHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gclsyXSwgeSArIGhlaWdodFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4ICsgclszXSksIHBhcnNlSW50KHkgKyBoZWlnaHQpKTtcclxuICAgICAgICByWzNdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJbM11cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCksIHBhcnNlSW50KHkgKyByWzBdKSk7XHJcbiAgICAgICAgclswXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgclswXSwgeSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rnn6nlvaLot6/lvoRcclxuICAgICAqIEBwYXJhbSB7Q29udGV4dDJEfSBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgaWYoIXN0eWxlLiRtb2RlbC5yYWRpdXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmKCEhc3R5bGUuZmlsbFN0eWxlKXtcclxuICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KCAwICwgMCAsdGhpcy5jb250ZXh0LndpZHRoLHRoaXMuY29udGV4dC5oZWlnaHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoISFzdHlsZS5saW5lV2lkdGgpe1xyXG4gICAgICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCggMCAsIDAgLCB0aGlzLmNvbnRleHQud2lkdGgsdGhpcy5jb250ZXh0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9idWlsZFJhZGl1c1BhdGgoY3R4LCBzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxyXG4gICAgICovXHJcbiAgICBnZXRSZWN0IDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZpbGxTdHlsZSB8fCBzdHlsZS5zdHJva2VTdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICAgICAgeSA6IE1hdGgucm91bmQoMCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMuY29udGV4dC53aWR0aCArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogdGhpcy5jb250ZXh0LmhlaWdodCArIGxpbmVXaWR0aFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbn0gKTtcclxuZXhwb3J0IGRlZmF1bHQgUmVjdDsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5omH5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcjAg6buY6K6k5Li6MO+8jOWGheWchuWNiuW+hOaMh+WumuWQjuWwhuWHuueOsOWGheW8p++8jOWQjOaXtuaJh+i+uemVv+W6piA9IHIgLSByMFxyXG4gKiBAciAg5b+F6aG777yM5aSW5ZyG5Y2K5b6EXHJcbiAqIEBzdGFydEFuZ2xlIOi1t+Wni+inkuW6pigwLCAzNjApXHJcbiAqIEBlbmRBbmdsZSAgIOe7k+adn+inkuW6pigwLCAzNjApXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuaW1wb3J0IG15TWF0aCBmcm9tIFwiLi4vZ2VvbS9NYXRoXCI7XHJcblxyXG52YXIgU2VjdG9yID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmICA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInNlY3RvclwiO1xyXG4gICAgc2VsZi5yZWdBbmdsZSAgPSBbXTtcclxuICAgIHNlbGYuaXNSaW5nICAgID0gZmFsc2U7Ly/mmK/lkKbkuLrkuIDkuKrlnIbnjq9cclxuXHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ICA9IHtcclxuICAgICAgICBwb2ludExpc3QgIDogW10sLy/ovrnnlYzngrnnmoTpm4blkIgs56eB5pyJ77yM5LuO5LiL6Z2i55qE5bGe5oCn6K6h566X55qE5p2lXHJcbiAgICAgICAgcjAgICAgICAgICA6IG9wdC5jb250ZXh0LnIwICAgICAgICAgfHwgMCwvLyDpu5jorqTkuLow77yM5YaF5ZyG5Y2K5b6E5oyH5a6a5ZCO5bCG5Ye6546w5YaF5byn77yM5ZCM5pe25omH6L656ZW/5bqmID0gciAtIHIwXHJcbiAgICAgICAgciAgICAgICAgICA6IG9wdC5jb250ZXh0LnIgICAgICAgICAgfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5aSW5ZyG5Y2K5b6EXHJcbiAgICAgICAgc3RhcnRBbmdsZSA6IG9wdC5jb250ZXh0LnN0YXJ0QW5nbGUgfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW35aeL6KeS5bqmWzAsIDM2MClcclxuICAgICAgICBlbmRBbmdsZSAgIDogb3B0LmNvbnRleHQuZW5kQW5nbGUgICB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uT5p2f6KeS5bqmKDAsIDM2MF1cclxuICAgICAgICBjbG9ja3dpc2UgIDogb3B0LmNvbnRleHQuY2xvY2t3aXNlICB8fCBmYWxzZSAvL+aYr+WQpumhuuaXtumSiO+8jOm7mOiupOS4umZhbHNlKOmhuuaXtumSiClcclxuICAgIH1cclxuICAgIFNlY3Rvci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhTZWN0b3IgLCBTaGFwZSAsIHtcclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIGNvbnRleHQpIHtcclxuICAgICAgICAvLyDlvaLlhoXljYrlvoRbMCxyKVxyXG4gICAgICAgIHZhciByMCA9IHR5cGVvZiBjb250ZXh0LnIwID09ICd1bmRlZmluZWQnID8gMCA6IGNvbnRleHQucjA7XHJcbiAgICAgICAgdmFyIHIgID0gY29udGV4dC5yOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmiYflvaLlpJbljYrlvoQoMCxyXVxyXG4gICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICB2YXIgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LmVuZEFuZ2xlKTsgICAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgLy92YXIgaXNSaW5nICAgICA9IGZhbHNlOyAgICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKbkuLrlnIbnjq9cclxuXHJcbiAgICAgICAgLy9pZiggc3RhcnRBbmdsZSAhPSBlbmRBbmdsZSAmJiBNYXRoLmFicyhzdGFydEFuZ2xlIC0gZW5kQW5nbGUpICUgMzYwID09IDAgKSB7XHJcbiAgICAgICAgaWYoIHN0YXJ0QW5nbGUgPT0gZW5kQW5nbGUgJiYgY29udGV4dC5zdGFydEFuZ2xlICE9IGNvbnRleHQuZW5kQW5nbGUgKSB7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5Lik5Liq6KeS5bqm55u4562J77yM6YKj5LmI5bCx6K6k5Li65piv5Liq5ZyG546v5LqGXHJcbiAgICAgICAgICAgIHRoaXMuaXNSaW5nICAgICA9IHRydWU7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgPSAwIDtcclxuICAgICAgICAgICAgZW5kQW5nbGUgICA9IDM2MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSk7XHJcbiAgICAgICAgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUb1JhZGlhbihlbmRBbmdsZSk7XHJcbiAgICAgXHJcbiAgICAgICAgLy/lpITnkIbkuIvmnoHlsI/lpLnop5LnmoTmg4XlhrVcclxuICAgICAgICBpZiggZW5kQW5nbGUgLSBzdGFydEFuZ2xlIDwgMC4wMjUgKXtcclxuICAgICAgICAgICAgc3RhcnRBbmdsZSAtPSAwLjAwM1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmFyYyggMCAsIDAgLCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgaWYgKHIwICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmlzUmluZyApe1xyXG4gICAgICAgICAgICAgICAgLy/liqDkuIrov5nkuKppc1JpbmfnmoTpgLvovpHmmK/kuLrkuoblhbzlrrlmbGFzaGNhbnZhc+S4i+e7mOWItuWchueOr+eahOeahOmXrumimFxyXG4gICAgICAgICAgICAgICAgLy/kuI3liqDov5nkuKrpgLvovpFmbGFzaGNhbnZhc+S8mue7mOWItuS4gOS4quWkp+WchiDvvIwg6ICM5LiN5piv5ZyG546vXHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCByMCAsIDAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmMoIDAgLCAwICwgcjAgLCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgLCAhdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKCAwICwgMCAsIHIwICwgZW5kQW5nbGUgLCBzdGFydEFuZ2xlICwgIXRoaXMuY29udGV4dC5jbG9ja3dpc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9UT0RPOuWcqHIw5Li6MOeahOaXtuWAme+8jOWmguaenOS4jeWKoGxpbmVUbygwLDAp5p2l5oqK6Lev5b6E6Zet5ZCI77yM5Lya5Ye6546w5pyJ5pCe56yR55qE5LiA5LiqYnVnXHJcbiAgICAgICAgICAgIC8v5pW05Liq5ZyG5Lya5Ye6546w5LiA5Liq5Lul5q+P5Liq5omH5b2i5Lik56uv5Li66IqC54K555qE6ZWC56m677yM5oiR5Y+v6IO95o+P6L+w5LiN5riF5qWa77yM5Y+N5q2j6L+Z5Liq5Yqg5LiK5bCx5aW95LqGXHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oMCwwKTtcclxuICAgICAgICB9XHJcbiAgICAgfSxcclxuICAgICBnZXRSZWdBbmdsZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgIHRoaXMucmVnSW4gICAgICA9IHRydWU7ICAvL+WmguaenOWcqHN0YXJ05ZKMZW5k55qE5pWw5YC85Lit77yMZW5k5aSn5LqOc3RhcnTogIzkuJTmmK/pobrml7bpkojliJlyZWdJbuS4unRydWVcclxuICAgICAgICAgdmFyIGMgICAgICAgICAgID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjLnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGMuZW5kQW5nbGUpOyAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgIGlmICggKCBzdGFydEFuZ2xlID4gZW5kQW5nbGUgJiYgIWMuY2xvY2t3aXNlICkgfHwgKCBzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgYy5jbG9ja3dpc2UgKSApIHtcclxuICAgICAgICAgICAgIHRoaXMucmVnSW4gID0gZmFsc2U7IC8vb3V0XHJcbiAgICAgICAgIH07XHJcbiAgICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXHJcbiAgICAgICAgIHRoaXMucmVnQW5nbGUgICA9IFsgXHJcbiAgICAgICAgICAgICBNYXRoLm1pbiggc3RhcnRBbmdsZSAsIGVuZEFuZ2xlICkgLCBcclxuICAgICAgICAgICAgIE1hdGgubWF4KCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgKSBcclxuICAgICAgICAgXTtcclxuICAgICB9LFxyXG4gICAgIGdldFJlY3QgOiBmdW5jdGlvbihjb250ZXh0KXtcclxuICAgICAgICAgdmFyIGNvbnRleHQgPSBjb250ZXh0ID8gY29udGV4dCA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgdmFyIHIwID0gdHlwZW9mIGNvbnRleHQucjAgPT0gJ3VuZGVmaW5lZCcgICAgIC8vIOW9ouWGheWNiuW+hFswLHIpXHJcbiAgICAgICAgICAgICA/IDAgOiBjb250ZXh0LnIwO1xyXG4gICAgICAgICB2YXIgciA9IGNvbnRleHQucjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5omH5b2i5aSW5Y2K5b6EKDAscl1cclxuICAgICAgICAgXHJcbiAgICAgICAgIHRoaXMuZ2V0UmVnQW5nbGUoKTtcclxuXHJcbiAgICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICAgdmFyIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5lbmRBbmdsZSk7ICAgICAgICAgICAgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxyXG5cclxuICAgICAgICAgLypcclxuICAgICAgICAgdmFyIGlzQ2lyY2xlID0gZmFsc2U7XHJcbiAgICAgICAgIGlmKCBNYXRoLmFicyggc3RhcnRBbmdsZSAtIGVuZEFuZ2xlICkgPT0gMzYwIFxyXG4gICAgICAgICAgICAgICAgIHx8ICggc3RhcnRBbmdsZSA9PSBlbmRBbmdsZSAmJiBzdGFydEFuZ2xlICogZW5kQW5nbGUgIT0gMCApICl7XHJcbiAgICAgICAgICAgICBpc0NpcmNsZSA9IHRydWU7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgIHZhciBwb2ludExpc3QgID0gW107XHJcblxyXG4gICAgICAgICB2YXIgcDREaXJlY3Rpb249IHtcclxuICAgICAgICAgICAgIFwiOTBcIiA6IFsgMCAsIHIgXSxcclxuICAgICAgICAgICAgIFwiMTgwXCI6IFsgLXIsIDAgXSxcclxuICAgICAgICAgICAgIFwiMjcwXCI6IFsgMCAsIC1yXSxcclxuICAgICAgICAgICAgIFwiMzYwXCI6IFsgciAsIDAgXSBcclxuICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgIGZvciAoIHZhciBkIGluIHA0RGlyZWN0aW9uICl7XHJcbiAgICAgICAgICAgICB2YXIgaW5BbmdsZVJlZyA9IHBhcnNlSW50KGQpID4gdGhpcy5yZWdBbmdsZVswXSAmJiBwYXJzZUludChkKSA8IHRoaXMucmVnQW5nbGVbMV07XHJcbiAgICAgICAgICAgICBpZiggdGhpcy5pc1JpbmcgfHwgKGluQW5nbGVSZWcgJiYgdGhpcy5yZWdJbikgfHwgKCFpbkFuZ2xlUmVnICYmICF0aGlzLnJlZ0luKSApe1xyXG4gICAgICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKCBwNERpcmVjdGlvblsgZCBdICk7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmKCAhdGhpcy5pc1JpbmcgKSB7XHJcbiAgICAgICAgICAgICBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBzdGFydEFuZ2xlICk7XHJcbiAgICAgICAgICAgICBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBlbmRBbmdsZSAgICk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogcjAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogcjBcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogciAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogclxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3MoZW5kQW5nbGUpICAgKiByICAsICBteU1hdGguc2luKGVuZEFuZ2xlKSAgKiByXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhlbmRBbmdsZSkgICAqIHIwICwgIG15TWF0aC5zaW4oZW5kQW5nbGUpICAqIHIwXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBjb250ZXh0LnBvaW50TGlzdCA9IHBvaW50TGlzdDtcclxuICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjdEZvcm1Qb2ludExpc3QoIGNvbnRleHQgKTtcclxuICAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlY3RvcjsiLCJcbmltcG9ydCBBcHBsaWNhdGlvbiBmcm9tIFwiLi9BcHBsaWNhdGlvblwiO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnRNYW5hZ2VyXCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFN0YWdlIGZyb20gXCIuL2Rpc3BsYXkvU3RhZ2VcIjtcbmltcG9ydCBTcHJpdGUgZnJvbSBcIi4vZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9kaXNwbGF5L1NoYXBlXCI7XG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vZGlzcGxheS9Qb2ludFwiO1xuaW1wb3J0IFRleHQgZnJvbSBcIi4vZGlzcGxheS9UZXh0XCI7XG5cbi8vc2hhcGVzXG5pbXBvcnQgQnJva2VuTGluZSBmcm9tIFwiLi9zaGFwZS9Ccm9rZW5MaW5lXCI7XG5pbXBvcnQgQ2lyY2xlIGZyb20gXCIuL3NoYXBlL0NpcmNsZVwiO1xuaW1wb3J0IERyb3BsZXQgZnJvbSBcIi4vc2hhcGUvRHJvcGxldFwiO1xuaW1wb3J0IEVsbGlwc2UgZnJvbSBcIi4vc2hhcGUvRWxsaXBzZVwiO1xuaW1wb3J0IElzb2dvbiBmcm9tIFwiLi9zaGFwZS9Jc29nb25cIjtcbmltcG9ydCBMaW5lIGZyb20gXCIuL3NoYXBlL0xpbmVcIjtcbmltcG9ydCBQYXRoIGZyb20gXCIuL3NoYXBlL1BhdGhcIjtcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuL3NoYXBlL1BvbHlnb25cIjtcbmltcG9ydCBSZWN0IGZyb20gXCIuL3NoYXBlL1JlY3RcIjtcbmltcG9ydCBTZWN0b3IgZnJvbSBcIi4vc2hhcGUvU2VjdG9yXCI7XG5cbnZhciBDYW52YXggPSB7XG4gICAgQXBwOiBBcHBsaWNhdGlvblxufTtcblxuQ2FudmF4LkRpc3BsYXkgPSB7XG4gICAgRGlzcGxheU9iamVjdCA6IERpc3BsYXlPYmplY3QsXG4gICAgRGlzcGxheU9iamVjdENvbnRhaW5lciA6IERpc3BsYXlPYmplY3RDb250YWluZXIsXG4gICAgU3RhZ2UgIDogU3RhZ2UsXG4gICAgU3ByaXRlIDogU3ByaXRlLFxuICAgIFNoYXBlICA6IFNoYXBlLFxuICAgIFBvaW50ICA6IFBvaW50LFxuICAgIFRleHQgICA6IFRleHRcbn1cblxuQ2FudmF4LlNoYXBlcyA9IHtcbiAgICBCcm9rZW5MaW5lIDogQnJva2VuTGluZSxcbiAgICBDaXJjbGUgOiBDaXJjbGUsXG4gICAgRHJvcGxldCA6IERyb3BsZXQsXG4gICAgRWxsaXBzZSA6IEVsbGlwc2UsXG4gICAgSXNvZ29uIDogSXNvZ29uLFxuICAgIExpbmUgOiBMaW5lLFxuICAgIFBhdGggOiBQYXRoLFxuICAgIFBvbHlnb24gOiBQb2x5Z29uLFxuICAgIFJlY3QgOiBSZWN0LFxuICAgIFNlY3RvciA6IFNlY3RvclxufVxuXG5DYW52YXguRXZlbnQgPSB7XG4gICAgRXZlbnREaXNwYXRjaGVyIDogRXZlbnREaXNwYXRjaGVyLFxuICAgIEV2ZW50TWFuYWdlciAgICA6IEV2ZW50TWFuYWdlclxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW52YXg7Il0sIm5hbWVzIjpbIl8iLCJicmVha2VyIiwiQXJyYXlQcm90byIsIkFycmF5IiwicHJvdG90eXBlIiwiT2JqUHJvdG8iLCJPYmplY3QiLCJ0b1N0cmluZyIsImhhc093blByb3BlcnR5IiwibmF0aXZlRm9yRWFjaCIsImZvckVhY2giLCJuYXRpdmVGaWx0ZXIiLCJmaWx0ZXIiLCJuYXRpdmVJbmRleE9mIiwiaW5kZXhPZiIsIm5hdGl2ZUlzQXJyYXkiLCJpc0FycmF5IiwibmF0aXZlS2V5cyIsImtleXMiLCJ2YWx1ZXMiLCJvYmoiLCJsZW5ndGgiLCJpIiwiVHlwZUVycm9yIiwia2V5IiwiaGFzIiwicHVzaCIsImNhbGwiLCJlYWNoIiwiaXRlcmF0b3IiLCJjb250ZXh0IiwiY29tcGFjdCIsImFycmF5IiwiaWRlbnRpdHkiLCJzZWxlY3QiLCJyZXN1bHRzIiwidmFsdWUiLCJpbmRleCIsImxpc3QiLCJuYW1lIiwiaXNGdW5jdGlvbiIsImlzRmluaXRlIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc051bGwiLCJpc0VtcHR5IiwiaXNTdHJpbmciLCJpc0VsZW1lbnQiLCJub2RlVHlwZSIsImlzT2JqZWN0IiwiaXRlbSIsImlzU29ydGVkIiwiTWF0aCIsIm1heCIsInNvcnRlZEluZGV4IiwiaXNXaW5kb3ciLCJ3aW5kb3ciLCJpc1BsYWluT2JqZWN0IiwiY29uc3RydWN0b3IiLCJoYXNPd24iLCJlIiwidW5kZWZpbmVkIiwiZXh0ZW5kIiwib3B0aW9ucyIsInNyYyIsImNvcHkiLCJjb3B5SXNBcnJheSIsImNsb25lIiwidGFyZ2V0IiwiYXJndW1lbnRzIiwiZGVlcCIsInNsaWNlIiwiVXRpbHMiLCJkZXZpY2VQaXhlbFJhdGlvIiwiX1VJRCIsImNoYXJDb2RlIiwiY2hhckNvZGVBdCIsImdldFVJRCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImdldENvbnRleHQiLCJwcm90byIsIm5ld1Byb3RvIiwiT2JqZWN0Q3JlYXRlIiwiY3JlYXRlIiwiX19lbXB0eUZ1bmMiLCJyIiwicyIsInB4Iiwic3AiLCJycCIsImNyZWF0ZU9iamVjdCIsInN1cGVyY2xhc3MiLCJjYW52YXMiLCJGbGFzaENhbnZhcyIsImluaXRFbGVtZW50Iiwib3B0Iiwic291cmNlIiwic3RyaWN0IiwicjEiLCJyMiIsInIzIiwicjQiLCJQb2ludCIsIngiLCJ5IiwiYXJnIiwicCIsIkNhbnZheEV2ZW50IiwiZXZ0IiwicGFyYW1zIiwiZXZlbnRUeXBlIiwidHlwZSIsImN1cnJlbnRUYXJnZXQiLCJwb2ludCIsIl9zdG9wUHJvcGFnYXRpb24iLCJhZGRPclJtb3ZlRXZlbnRIYW5kIiwiZG9tSGFuZCIsImllSGFuZCIsImV2ZW50RG9tRm4iLCJlbCIsImZuIiwiZXZlbnRGbiIsImV2ZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJib3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkb2MiLCJvd25lckRvY3VtZW50IiwiYm9keSIsImRvY0VsZW0iLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRUb3AiLCJjbGllbnRMZWZ0IiwiYm91bmQiLCJyaWdodCIsImxlZnQiLCJjbGllbnRXaWR0aCIsInpvb20iLCJ0b3AiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInBhZ2VYT2Zmc2V0Iiwic2Nyb2xsTGVmdCIsInBhZ2VYIiwiY2xpZW50WCIsInBhZ2VZIiwiY2xpZW50WSIsIl93aWR0aCIsIl9oZWlnaHQiLCJpZCIsInN0eWxlIiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInNldEF0dHJpYnV0ZSIsInNldHRpbmdzIiwiUkVTT0xVVElPTiIsInZpZXciLCJjbGFzc05hbWUiLCJjc3NUZXh0Iiwic3RhZ2VfYyIsImRvbV9jIiwiYXBwZW5kQ2hpbGQiLCJfbW91c2VFdmVudFR5cGVzIiwiX2hhbW1lckV2ZW50VHlwZXMiLCJFdmVudEhhbmRsZXIiLCJjYW52YXgiLCJjdXJQb2ludHMiLCJjdXJQb2ludHNUYXJnZXQiLCJfdG91Y2hpbmciLCJfZHJhZ2luZyIsIl9jdXJzb3IiLCJ0eXBlcyIsImRyYWciLCJjb250YWlucyIsImNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIiwicGFyZW50IiwiY2hpbGQiLCJtZSIsImFkZEV2ZW50IiwiX19tb3VzZUhhbmRsZXIiLCJvbiIsIl9fbGliSGFuZGxlciIsInJvb3QiLCJ1cGRhdGVWaWV3T2Zmc2V0IiwiJCIsInZpZXdPZmZzZXQiLCJjdXJNb3VzZVBvaW50IiwiY3VyTW91c2VUYXJnZXQiLCJnZXRPYmplY3RzVW5kZXJQb2ludCIsImRyYWdFbmFibGVkIiwidG9FbGVtZW50IiwicmVsYXRlZFRhcmdldCIsIl9kcmFnRW5kIiwiZmlyZSIsIl9fZ2V0Y3VyUG9pbnRzVGFyZ2V0IiwiZ2xvYmFsQWxwaGEiLCJjbG9uZU9iamVjdCIsIl9jbG9uZTJob3ZlclN0YWdlIiwiX2dsb2JhbEFscGhhIiwiX2RyYWdNb3ZlSGFuZGVyIiwiX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMiLCJfY3Vyc29ySGFuZGVyIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsIm9sZE9iaiIsIl9ob3ZlckNsYXNzIiwicG9pbnRDaGtQcmlvcml0eSIsImdldENoaWxkSW5Qb2ludCIsImdsb2JhbFRvTG9jYWwiLCJkaXNwYXRjaEV2ZW50IiwidG9UYXJnZXQiLCJmcm9tVGFyZ2V0IiwiX3NldEN1cnNvciIsImN1cnNvciIsIl9fZ2V0Q2FudmF4UG9pbnRJblRvdWNocyIsIl9fZ2V0Q2hpbGRJblRvdWNocyIsInN0YXJ0IiwibW92ZSIsImVuZCIsImN1clRvdWNocyIsInRvdWNoIiwidG91Y2hzIiwidG91Y2hlc1RhcmdldCIsImNoaWxkcyIsImhhc0NoaWxkIiwiY2UiLCJzdGFnZVBvaW50IiwiX2RyYWdEdXBsaWNhdGUiLCJfYnVmZmVyU3RhZ2UiLCJnZXRDaGlsZEJ5SWQiLCJfdHJhbnNmb3JtIiwiZ2V0Q29uY2F0ZW5hdGVkTWF0cml4IiwiYWRkQ2hpbGRBdCIsIl9kcmFnUG9pbnQiLCJfcG9pbnQiLCJfbm90V2F0Y2giLCJfbW92ZVN0YWdlIiwibW92ZWluZyIsImhlYXJ0QmVhdCIsImRlc3Ryb3kiLCJFdmVudE1hbmFnZXIiLCJfZXZlbnRNYXAiLCJsaXN0ZW5lciIsImFkZFJlc3VsdCIsInNlbGYiLCJzcGxpdCIsIm1hcCIsIl9ldmVudEVuYWJsZWQiLCJyZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlIiwibGkiLCJzcGxpY2UiLCJfZGlzcGF0Y2hFdmVudCIsIkV2ZW50RGlzcGF0Y2hlciIsImNyZWF0Q2xhc3MiLCJfYWRkRXZlbnRMaXN0ZW5lciIsIl9yZW1vdmVFdmVudExpc3RlbmVyIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUiLCJfcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMiLCJsb2ciLCJlVHlwZSIsImNoaWxkcmVuIiwicHJlSGVhcnRCZWF0IiwiX2hlYXJ0QmVhdE51bSIsInByZWdBbHBoYSIsImhvdmVyQ2xvbmUiLCJnZXRTdGFnZSIsImFjdGl2U2hhcGUiLCJyZW1vdmVDaGlsZEJ5SWQiLCJfaGFzRXZlbnRMaXN0ZW5lciIsIm92ZXJGdW4iLCJvdXRGdW4iLCJvbmNlSGFuZGxlIiwiYXBwbHkiLCJ1biIsIk1hdHJpeCIsImEiLCJiIiwiYyIsImQiLCJ0eCIsInR5IiwibXR4Iiwic2NhbGVYIiwic2NhbGVZIiwicm90YXRpb24iLCJjb3MiLCJzaW4iLCJQSSIsImNvbmNhdCIsImFuZ2xlIiwic3QiLCJhYnMiLCJjdCIsInN4Iiwic3kiLCJkeCIsImR5IiwidiIsImFhIiwiYWMiLCJhdHgiLCJhYiIsImFkIiwiYXR5Iiwib3V0IiwiX2NhY2hlIiwiX3JhZGlhbnMiLCJpc0RlZ3JlZXMiLCJ0b0ZpeGVkIiwiZGVncmVlVG9SYWRpYW4iLCJyYWRpYW5Ub0RlZ3JlZSIsImRlZ3JlZVRvMzYwIiwicmVBbmciLCJpc0luc2lkZSIsInNoYXBlIiwiX3BvaW50SW5TaGFwZSIsIl9pc0luc2lkZUxpbmUiLCJfaXNJbnNpZGVCcm9rZW5MaW5lIiwiX2lzSW5zaWRlQ2lyY2xlIiwiX2lzUG9pbnRJbkVsaXBzZSIsIl9pc0luc2lkZVNlY3RvciIsIl9pc0luc2lkZVBhdGgiLCJfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIiLCJpc091dHNpZGUiLCJ4MCIsInhTdGFydCIsInkwIiwieVN0YXJ0IiwieDEiLCJ4RW5kIiwieTEiLCJ5RW5kIiwiX2wiLCJsaW5lV2lkdGgiLCJfYSIsIl9iIiwiX3MiLCJwb2ludExpc3QiLCJsaW5lQXJlYSIsImluc2lkZUNhdGNoIiwibCIsIl9pc0luc2lkZVJlY3RhbmdsZSIsIm1pbiIsInIwIiwic3RhcnRBbmdsZSIsIm15TWF0aCIsImVuZEFuZ2xlIiwiYXRhbjIiLCJyZWdJbiIsImNsb2Nrd2lzZSIsInJlZ0FuZ2xlIiwiaW5BbmdsZVJlZyIsImNlbnRlciIsIlhSYWRpdXMiLCJociIsIllSYWRpdXMiLCJ2ciIsImlSZXMiLCJwb2x5Iiwid24iLCJzaGlmdFAiLCJzaGlmdCIsImluTGluZSIsImZpbGxTdHlsZSIsIm4iLCJUV0VFTiIsIl90d2VlbnMiLCJ0d2VlbiIsInRpbWUiLCJwcmVzZXJ2ZSIsIm5vdyIsIl90IiwiX3VwZGF0ZVJlcyIsInVwZGF0ZSIsInByb2Nlc3MiLCJocnRpbWUiLCJwZXJmb3JtYW5jZSIsImJpbmQiLCJEYXRlIiwiZ2V0VGltZSIsIlR3ZWVuIiwib2JqZWN0IiwiX29iamVjdCIsIl92YWx1ZXNTdGFydCIsIl92YWx1ZXNFbmQiLCJfdmFsdWVzU3RhcnRSZXBlYXQiLCJfZHVyYXRpb24iLCJfcmVwZWF0IiwiX3JlcGVhdERlbGF5VGltZSIsIl95b3lvIiwiX2lzUGxheWluZyIsIl9yZXZlcnNlZCIsIl9kZWxheVRpbWUiLCJfc3RhcnRUaW1lIiwiX2Vhc2luZ0Z1bmN0aW9uIiwiRWFzaW5nIiwiTGluZWFyIiwiTm9uZSIsIl9pbnRlcnBvbGF0aW9uRnVuY3Rpb24iLCJJbnRlcnBvbGF0aW9uIiwiX2NoYWluZWRUd2VlbnMiLCJfb25TdGFydENhbGxiYWNrIiwiX29uU3RhcnRDYWxsYmFja0ZpcmVkIiwiX29uVXBkYXRlQ2FsbGJhY2siLCJfb25Db21wbGV0ZUNhbGxiYWNrIiwiX29uU3RvcENhbGxiYWNrIiwidG8iLCJwcm9wZXJ0aWVzIiwiZHVyYXRpb24iLCJhZGQiLCJwcm9wZXJ0eSIsInN0b3AiLCJyZW1vdmUiLCJzdG9wQ2hhaW5lZFR3ZWVucyIsIm51bUNoYWluZWRUd2VlbnMiLCJkZWxheSIsImFtb3VudCIsInJlcGVhdCIsInRpbWVzIiwicmVwZWF0RGVsYXkiLCJ5b3lvIiwiZWFzaW5nIiwiaW50ZXJwb2xhdGlvbiIsImNoYWluIiwib25TdGFydCIsImNhbGxiYWNrIiwib25VcGRhdGUiLCJvbkNvbXBsZXRlIiwib25TdG9wIiwiZWxhcHNlZCIsImNoYXJBdCIsInRtcCIsImsiLCJwb3ciLCJzcXJ0IiwiQm91bmNlIiwiT3V0IiwiSW4iLCJtIiwiZiIsImZsb29yIiwicHciLCJibiIsIkJlcm5zdGVpbiIsIkNhdG11bGxSb20iLCJwMCIsInAxIiwidCIsImZjIiwiRmFjdG9yaWFsIiwicDIiLCJwMyIsInYwIiwidjEiLCJ0MiIsInQzIiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJlbGVtZW50IiwiY3VyclRpbWUiLCJ0aW1lVG9DYWxsIiwic2V0VGltZW91dCIsIl90YXNrTGlzdCIsIl9yZXF1ZXN0QWlkIiwiZW5hYmxlZEFuaW1hdGlvbkZyYW1lIiwiY3VyclRhc2tMaXN0IiwidGFzayIsInJlZ2lzdEZyYW1lIiwiJGZyYW1lIiwiZGVzdHJveUZyYW1lIiwiZF9yZXN1bHQiLCJyZWdpc3RUd2VlbiIsInRpZCIsImZyb20iLCJfaXNDb21wbGV0ZWVkIiwiX2lzU3RvcGVkIiwiYW5pbWF0ZSIsImRlc2MiLCJkZXN0cm95VHdlZW4iLCJtc2ciLCJ1bndhdGNoT25lIiwiT2JzZXJ2ZSIsInNjb3BlIiwibW9kZWwiLCJ3YXRjaE1vcmUiLCJzdG9wUmVwZWF0QXNzaWduIiwic2tpcEFycmF5IiwiJHNraXBBcnJheSIsIlZCUHVibGljcyIsImxvb3AiLCJ2YWwiLCJ2YWx1ZVR5cGUiLCJhY2Nlc3NvciIsIm5lbyIsInByZVZhbHVlIiwiY29tcGxleFZhbHVlIiwibmVvVHlwZSIsImFkZENvbG9yU3RvcCIsIiRtb2RlbCIsIiRmaXJlIiwicG1vZGVsIiwiaGFzV2F0Y2hNb2RlbCIsIiR3YXRjaCIsIiRwYXJlbnQiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiYWNjZXNzb3JlcyIsIiRhY2Nlc3NvciIsImRlZmluZVByb3BlcnR5IiwicHJvcCIsIl9fZGVmaW5lR2V0dGVyX18iLCJnZXQiLCJfX2RlZmluZVNldHRlcl9fIiwic2V0IiwiZGVzY3MiLCJWQkFycmF5IiwiZXhlY1NjcmlwdCIsImpvaW4iLCJWQk1lZGlhdG9yIiwiZGVzY3JpcHRpb24iLCJwdWJsaWNzIiwib3duZXIiLCJidWZmZXIiLCJwYXJzZVZCIiwiUkVOREVSRVJfVFlQRSIsIlNIQVBFUyIsIkNPTlRFWFRfREVGQVVMVCIsIkRpc3BsYXlPYmplY3QiLCJjaGVja09wdCIsInN0YWdlIiwieHlUb0ludCIsIl9jcmVhdGVDb250ZXh0IiwiVUlEIiwiY3JlYXRlSWQiLCJpbml0IiwiX3VwZGF0ZVRyYW5zZm9ybSIsIl9jb250ZXh0QVRUUlMiLCJjb3B5MmNvbnRleHQiLCJfY29udGV4dCIsIiRvd25lciIsInRyYW5zRm9ybVByb3BzIiwibXlzZWxmIiwiY29uZiIsIm5ld09iaiIsInRleHQiLCJjb250YWluZXIiLCJjbSIsImludmVydCIsImxvY2FsVG9HbG9iYWwiLCJvIiwiYm9vbCIsIm51bSIsImZyb21JbmRleCIsImdldEluZGV4IiwidG9JbmRleCIsInBjbCIsIm9yaWdpbiIsInNjYWxlT3JpZ2luIiwidHJhbnNsYXRlIiwic2NhbGUiLCJyb3RhdGVPcmlnaW4iLCJyb3RhdGUiLCJwYXJzZUludCIsInN0cm9rZVN0eWxlIiwicmVzdWx0IiwiaW52ZXJzZU1hdHJpeCIsIm9yaWdpblBvcyIsIm11bFZlY3RvciIsIl9yZWN0IiwiZ2V0UmVjdCIsIkhpdFRlc3RQb2ludCIsInRvQ29udGVudCIsInVwRnVuIiwiY29tcEZ1biIsIkFuaW1hdGlvbkZyYW1lIiwiY3R4IiwidmlzaWJsZSIsInNhdmUiLCJ0cmFuc0Zvcm0iLCJ0cmFuc2Zvcm0iLCJ0b0FycmF5IiwicmVuZGVyIiwicmVzdG9yZSIsInJlbW92ZUNoaWxkIiwiRGlzcGxheU9iamVjdENvbnRhaW5lciIsIm1vdXNlQ2hpbGRyZW4iLCJnZXRDaGlsZEluZGV4IiwiX2FmdGVyQWRkQ2hpbGQiLCJyZW1vdmVDaGlsZEF0IiwiX2FmdGVyRGVsQ2hpbGQiLCJsZW4iLCJnZXRDaGlsZEF0IiwiYm9vbGVuIiwib2xkSW5kZXgiLCJnZXROdW1DaGlsZHJlbiIsIm9ianMiLCJfcmVuZGVyIiwiU3RhZ2UiLCJjb250ZXh0MkQiLCJzdGFnZVJlbmRpbmciLCJfaXNSZWFkeSIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiY2xlYXIiLCJjbGVhclJlY3QiLCJTeXN0ZW1SZW5kZXJlciIsIlVOS05PV04iLCJhcHAiLCJyZXF1ZXN0QWlkIiwiY29udmVydFN0YWdlcyIsIl9oZWFydEJlYXQiLCJfcHJlUmVuZGVyVGltZSIsImVudGVyRnJhbWUiLCJjb252ZXJ0U3RhZ2UiLCJjb252ZXJ0VHlwZSIsIl9jb252ZXJ0Q2FudmF4IiwiY29udmVydFNoYXBlcyIsInN0YXJ0RW50ZXIiLCJDYW52YXNSZW5kZXJlciIsIkNBTlZBUyIsIkFwcGxpY2F0aW9uIiwiX2NpZCIsInJhbmRvbSIsInF1ZXJ5Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJ2aWV3T2JqIiwiY3JlYXRlVmlldyIsImlubmVySFRNTCIsIm9mZnNldCIsImxhc3RHZXRSTyIsInJlbmRlcmVyIiwiUmVuZGVyZXIiLCJfY3JlYXRIb3ZlclN0YWdlIiwiX2NyZWF0ZVBpeGVsQ29udGV4dCIsInJlU2l6ZUNhbnZhcyIsInJlc2l6ZSIsImFkZENoaWxkIiwiX3BpeGVsQ2FudmFzIiwiY3JlYXRlQ2FudmFzIiwiY2FudmFzU3VwcG9ydCIsImRpc3BsYXkiLCJ6SW5kZXgiLCJ2aXNpYmlsaXR5IiwiX3BpeGVsQ3R4IiwiaW5zZXJ0QmVmb3JlIiwiaW5pdFN0YWdlIiwiU3ByaXRlIiwiR3JhcGhpY3NEYXRhIiwibGluZUNvbG9yIiwibGluZUFscGhhIiwiZmlsbENvbG9yIiwiZmlsbEFscGhhIiwiZmlsbCIsIl9saW5lVGludCIsIl9maWxsVGludCIsImhvbGVzIiwidHJhbnNwb3NlIiwiRmxvYXQzMkFycmF5IiwicG9zIiwibmV3UG9zIiwiYTEiLCJjMSIsInR4MSIsIm1hdHJpeCIsImIxIiwiZDEiLCJwaXZvdFgiLCJwaXZvdFkiLCJza2V3WCIsInNrZXdZIiwic3IiLCJjciIsImN5IiwibnN4IiwiY3giLCJkZWx0YSIsInNrZXciLCJJREVOVElUWSIsIlRFTVBfTUFUUklYIiwidXgiLCJ1eSIsInZ4IiwidnkiLCJ0ZW1wTWF0cmljZXMiLCJtdWwiLCJzaWdudW0iLCJyb3ciLCJqIiwiX3V4IiwiX3V5IiwiX3Z4IiwiX3Z5IiwibWF0IiwiUmVjdGFuZ2xlIiwiUkVDVCIsImJvdHRvbSIsIkVNUFRZIiwicmVjdGFuZ2xlIiwicGFkZGluZ1giLCJwYWRkaW5nWSIsIngyIiwieTIiLCJDaXJjbGUiLCJyYWRpdXMiLCJDSVJDIiwiRWxsaXBzZSIsIkVMSVAiLCJub3JteCIsIm5vcm15IiwiUG9seWdvbiIsInBvaW50cyIsImlsIiwiY2xvc2VkIiwiUE9MWSIsImluc2lkZSIsInhpIiwieWkiLCJ4aiIsInlqIiwiaW50ZXJzZWN0IiwiUm91bmRlZFJlY3RhbmdsZSIsIlJSRUMiLCJyYWRpdXMyIiwiYmV6aWVyQ3VydmVUbyIsImZyb21YIiwiZnJvbVkiLCJjcFgiLCJjcFkiLCJjcFgyIiwiY3BZMiIsInRvWCIsInRvWSIsInBhdGgiLCJkdCIsImR0MiIsImR0MyIsInRlbXBNYXRyaXgiLCJ0ZW1wUG9pbnQiLCJHcmFwaGljcyIsImdyYXBoaWNzRGF0YSIsInRpbnQiLCJfcHJldlRpbnQiLCJjdXJyZW50UGF0aCIsIl93ZWJHTCIsImRpcnR5IiwiZmFzdFJlY3REaXJ0eSIsImNsZWFyRGlydHkiLCJib3VuZHNEaXJ0eSIsImNhY2hlZFNwcml0ZURpcnR5IiwiX3Nwcml0ZVJlY3QiLCJfZmFzdFJlY3QiLCJib3VuZHNQYWRkaW5nIiwidXBkYXRlTG9jYWxCb3VuZHMiLCJjb2xvciIsImFscGhhIiwiZHJhd1NoYXBlIiwibW92ZVRvIiwieGEiLCJ5YSIsImEyIiwiYjIiLCJtbSIsImRkIiwiY2MiLCJ0dCIsImsxIiwiazIiLCJqMSIsImoyIiwicHkiLCJxeCIsInF5IiwiYXJjIiwiYW50aWNsb2Nrd2lzZSIsInN3ZWVwIiwic2VncyIsImNlaWwiLCJzdGFydFgiLCJzdGFydFkiLCJ0aGV0YSIsInRoZXRhMiIsImNUaGV0YSIsInNUaGV0YSIsInNlZ01pbnVzIiwicmVtYWluZGVyIiwicmVhbCIsImZpbGxpbmciLCJzZXRPYmplY3RSZW5kZXJlciIsInBsdWdpbnMiLCJncmFwaGljcyIsInBvcCIsImRhdGEiLCJjbG9zZSIsIl93ZWJnbCIsIl9sb2NhbEJvdW5kcyIsIlNoYXBlIiwiX2hvdmVyYWJsZSIsIl9jbGlja2FibGUiLCJkcmF3IiwiaW5pdENvbXBQcm9wZXJ0eSIsIl9oYXNGaWxsQW5kU3Ryb2tlIiwiX2RyYXdUeXBlT25seSIsImNsb3NlUGF0aCIsInN0cm9rZSIsImJlZ2luUGF0aCIsImRyYXdFbmQiLCJkYXNoTGVuZ3RoIiwiZGVsdGFYIiwiZGVsdGFZIiwibnVtRGFzaGVzIiwibGluZVRvIiwibWluWCIsIk51bWJlciIsIk1BWF9WQUxVRSIsIm1heFgiLCJNSU5fVkFMVUUiLCJtaW5ZIiwibWF4WSIsImNwbCIsInJvdW5kIiwiVGV4dCIsIl9yZU5ld2xpbmUiLCJmb250UHJvcGVydHMiLCJmb250IiwiX2dldEZvbnREZWNsYXJhdGlvbiIsImdldFRleHRXaWR0aCIsImdldFRleHRIZWlnaHQiLCJfcmVuZGVyVGV4dCIsIl9nZXRUZXh0TGluZXMiLCJfZ2V0VGV4dFdpZHRoIiwiX2dldFRleHRIZWlnaHQiLCJ0ZXh0TGluZXMiLCJfcmVuZGVyVGV4dFN0cm9rZSIsIl9yZW5kZXJUZXh0RmlsbCIsImZvbnRBcnIiLCJmb250UCIsIl9ib3VuZGFyaWVzIiwibGluZUhlaWdodHMiLCJoZWlnaHRPZkxpbmUiLCJfZ2V0SGVpZ2h0T2ZMaW5lIiwiX3JlbmRlclRleHRMaW5lIiwiX2dldFRvcE9mZnNldCIsInN0cm9rZURhc2hBcnJheSIsInNldExpbmVEYXNoIiwibWV0aG9kIiwibGluZSIsImxpbmVJbmRleCIsInRleHRBbGlnbiIsIl9yZW5kZXJDaGFycyIsIm1lYXN1cmVUZXh0IiwidG90YWxXaWR0aCIsIndvcmRzIiwid29yZHNXaWR0aCIsInJlcGxhY2UiLCJ3aWR0aERpZmYiLCJudW1TcGFjZXMiLCJzcGFjZVdpZHRoIiwibGVmdE9mZnNldCIsImNoYXJzIiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwibWF4V2lkdGgiLCJjdXJyZW50TGluZVdpZHRoIiwidGV4dEJhc2VsaW5lIiwiVmVjdG9yIiwiX2F4ZXMiLCJpbnRlcnBvbGF0ZSIsImlzTG9vcCIsInNtb290aEZpbHRlciIsInJldCIsImRpc3RhbmNlIiwicHJlVmVydG9yIiwiaVZ0b3IiLCJpZHgiLCJ3IiwidzIiLCJ3MyIsIkJyb2tlbkxpbmUiLCJhdHlwZSIsIl9pbml0UG9pbnRMaXN0IiwibXlDIiwic21vb3RoIiwiY3VyckwiLCJTbW9vdGhTcGxpbmUiLCJfZHJhdyIsImxpbmVUeXBlIiwic2kiLCJzbCIsImRhc2hlZExpbmVUbyIsImdldFJlY3RGb3JtUG9pbnRMaXN0IiwicGxpc3QiLCJpdCIsIml0MiIsIml0MyIsImNwWDEiLCJjcFkxIiwiUGF0aCIsImRyYXdUeXBlT25seSIsIl9fcGFyc2VQYXRoRGF0YSIsInBhdGhzIiwicGF0aFN0ciIsIl9wYXJzZUNoaWxkUGF0aERhdGEiLCJjcyIsIlJlZ0V4cCIsImFyciIsImNhIiwiY3B4IiwiY3B5Iiwic3RyIiwiY21kIiwiY3RsUHR4IiwiY3RsUHR5IiwicHJldkNtZCIsInJ4IiwicnkiLCJwc2kiLCJmYSIsImZzIiwiY29tbWFuZCIsIl9jb252ZXJ0UG9pbnQiLCJwc2lEZWciLCJ4cCIsInlwIiwibGFtYmRhIiwiY3hwIiwiY3lwIiwidk1hZyIsInZSYXRpbyIsInUiLCJ2QW5nbGUiLCJhY29zIiwiZFRoZXRhIiwic3RlcHMiLCJwYXJyIiwidHAiLCJCZXppZXIiLCJnZXRQb2ludEJ5VGltZSIsImNwcyIsInBhdGhBcnJheSIsIl9wYXJzZVBhdGhEYXRhIiwiX3NldFBvaW50TGlzdCIsImciLCJnbCIsInF1YWRyYXRpY0N1cnZlVG8iLCJzaW5nbGVQb2ludExpc3QiLCJ0b1VwcGVyQ2FzZSIsIl9nZXRBcmNQb2ludHMiLCJfcG9pbnRzIiwiY1N0YXJ0IiwicHJlUG9pbnRzIiwiX2dldEJlemllclBvaW50cyIsInJlY3QiLCJEcm9wbGV0IiwicHMiLCJyYXRpb1giLCJyYXRpb1kiLCJ1bnNoaWZ0IiwiSXNvZ29uIiwic2V0UG9pbnRMaXN0IiwiZFN0ZXAiLCJiZWdpbkRlZyIsImRlZyIsIkxpbmUiLCJSZWN0IiwiZ2V0Q3NzT3JkZXJBcnIiLCJmaWxsUmVjdCIsInN0cm9rZVJlY3QiLCJfYnVpbGRSYWRpdXNQYXRoIiwiU2VjdG9yIiwiaXNSaW5nIiwiZ2V0UmVnQW5nbGUiLCJwNERpcmVjdGlvbiIsIkNhbnZheCIsIkRpc3BsYXkiLCJTaGFwZXMiLCJFdmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxNQUFJLEVBQVI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQSxJQUFJQyxhQUFhQyxNQUFNQyxTQUF2QjtJQUFrQ0MsV0FBV0MsT0FBT0YsU0FBcEQ7QUFDQSxJQUNBRyxXQUFtQkYsU0FBU0UsUUFENUI7SUFFQUMsaUJBQW1CSCxTQUFTRyxjQUY1Qjs7QUFJQSxJQUNBQyxnQkFBcUJQLFdBQVdRLE9BRGhDO0lBRUFDLGVBQXFCVCxXQUFXVSxNQUZoQztJQUdBQyxnQkFBcUJYLFdBQVdZLE9BSGhDO0lBSUFDLGdCQUFxQlosTUFBTWEsT0FKM0I7SUFLQUMsYUFBcUJYLE9B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
