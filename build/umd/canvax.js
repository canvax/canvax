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
  return _$1.isArray(obj) ? obj.slice() : _$1.extend({}, obj);
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
    setContextStyle: function (ctx, style) {
        // 简单判断不做严格类型检测
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
        return;
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
var Point = function (x, y) {
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
      return;
   }
   x || (x = 0);
   y || (y = 0);
   this.x = x * 1;
   this.y = y * 1;
};

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

/**
 * 简单的浅复制对象。
 * @param strict  当为true时只覆盖已有属性
 */
var copy = function (target, source, strict) {
    if (_$1.isEmpty(source)) {
        return target;
    }
    for (var key in source) {
        if (!strict || target.hasOwnProperty(key) || target[key] !== undefined) {
            target[key] = source[key];
        }
    }
    return target;
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
        var _contextATTRS = copy({
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
        }, opt.context, true);

        //然后看继承者是否有提供_context 对象 需要 我 merge到_context2D_context中去的
        if (self._context) {
            _contextATTRS = _$1.extend(_contextATTRS, self._context);
        }

        //有些引擎内部设置context属性的时候是不用上报心跳的，比如做hitTestPoint热点检测的时候
        self._notWatch = false;

        _contextATTRS.$owner = self;
        _contextATTRS.$watch = function (name, value, preValue) {

            //下面的这些属性变化，都会需要重新组织矩阵属性_transform 
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
        if (this.img) {
            conf.img = this.img;
        }
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
    _transformHander: function (ctx) {
        var transForm = this._transform;
        if (!transForm) {
            transForm = this._updateTransform();
        }
        //运用矩阵开始变形
        ctx.transform.apply(ctx, transForm.toArray());
        //ctx.globalAlpha *= this.context.globalAlpha;
    },
    _updateTransform: function () {
        var _transform = new Matrix();
        _transform.identity();
        var ctx = this.context;
        //是否需要Transform
        if (ctx.scaleX !== 1 || ctx.scaleY !== 1) {
            //如果有缩放
            //缩放的原点坐标
            var origin = new Point(ctx.scaleOrigin);
            if (origin.x || origin.y) {
                _transform.translate(-origin.x, -origin.y);
            }
            _transform.scale(ctx.scaleX, ctx.scaleY);
            if (origin.x || origin.y) {
                _transform.translate(origin.x, origin.y);
            }
        }

        var rotation = ctx.rotation;
        if (rotation) {
            //如果有旋转
            //旋转的原点坐标
            var origin = new Point(ctx.rotateOrigin);
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
            var x = parseInt(ctx.x); //Math.round(ctx.x);
            var y = parseInt(ctx.y); //Math.round(ctx.y);

            if (parseInt(ctx.lineWidth, 10) % 2 == 1 && ctx.strokeStyle) {
                x += 0.5;
                y += 0.5;
            }
        } else {
            x = ctx.x;
            y = ctx.y;
        }

        if (x != 0 || y != 0) {
            _transform.translate(x, y);
        }
        this._transform = _transform;
        //console.log(this.id+":tx_"+_transform.tx+":cx_"+this.context.x);

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
    _render: function (ctx) {
        if (!this.context.visible || this.context.globalAlpha <= 0) {
            return;
        }
        ctx.save();
        this._transformHander(ctx);

        //文本有自己的设置样式方式
        if (this.type != "text") {
            Utils.setContextStyle(ctx, this.context.$model);
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

const RENDERER_TYPE = {
    UNKNOWN: 0,
    WEBGL: 1,
    CANVAS: 2
};

class SystemRenderer {
    constructor(type = RENDERER_TYPE.UNKNOWN, app) {
        this.type = type; //2canvas,1webgl
        this.app = app;

        this.requestAid = null;

        //每帧由心跳上报的 需要重绘的stages 列表
        this.convertStages = {};

        this._heartBeat = false; //心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

        this._preRenderTime = 0;

        //任务列表, 如果_taskList 不为空，那么主引擎就一直跑
        //为 含有enterFrame 方法 DisplayObject 的对象列表
        //比如 Movieclip 的enterFrame方法。
        //改属性目前主要是 movieclip 使用
        this._taskList = [];

        this._bufferStage = null;

        this._isReady = false;
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

        //先跑任务队列,因为有可能再具体的hander中会把自己清除掉
        //所以跑任务和下面的length检测分开来
        if (self._taskList.length > 0) {
            for (var i = 0, l = self._taskList.length; i < l; i++) {
                var obj = self._taskList[i];
                if (obj.enterFrame) {
                    obj.enterFrame();
                } else {
                    self.__taskList.splice(i--, 1);
                }
            }
        }
        //如果依然还有任务。 就继续enterFrame.
        if (self._taskList.length > 0) {
            self.startEnter();
        }
    }

    _convertCanvax(opt) {
        _.each(this.app.children, function (stage) {
            //TODO:这里用到了context
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

                if (!self._isReady) {
                    //在还没初始化完毕的情况下，无需做任何处理
                    return;
                }

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

    this.renderer = new CanvasRenderer();

    this.event = null;

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

        this._isReady = true;
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

/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
var Shape = function (opt) {

    var self = this;
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
 * 模拟as3 中 的Movieclip类，目前还只是个简单的容易。
 */
var Movieclip = function (opt) {

    var self = this;
    opt = Utils.checkOpt(opt);
    self.type = "movieclip";
    self.currentFrame = 0;
    self.autoPlay = opt.autoPlay || false; //是否自动播放
    self.repeat = opt.repeat || 0; //是否循环播放,repeat为数字，则表示循环多少次，为true or !运算结果为true 的话表示永久循环

    self.overPlay = opt.overPlay || false; //是否覆盖播放，为false只播放currentFrame 当前帧,true则会播放当前帧 和 当前帧之前的所有叠加

    self._frameRate = Utils.mainFrameRate;
    self._speedTime = parseInt(1000 / self._frameRate);
    self._preRenderTime = 0;

    self._context = {
        //r : opt.context.r || 0   //{number},  // 必须，圆半径
    };
    Movieclip.superclass.constructor.apply(this, [opt]);
};

Utils.creatClass(Movieclip, DisplayObjectContainer, {
    init: function () {},
    getStatus: function () {
        //查询Movieclip的autoPlay状态
        return this.autoPlay;
    },
    getFrameRate: function () {
        return this._frameRate;
    },
    setFrameRate: function (frameRate) {

        var self = this;
        if (self._frameRate == frameRate) {
            return;
        }
        self._frameRate = frameRate;

        //根据最新的帧率，来计算最新的间隔刷新时间
        self._speedTime = parseInt(1000 / self._frameRate);
    },
    afterAddChild: function (child, index) {
        if (this.children.length == 1) {
            return;
        }

        if (index != undefined && index <= this.currentFrame) {
            //插入当前frame的前面 
            this.currentFrame++;
        }
    },
    afterDelChild: function (child, index) {
        //记录下当前帧
        var preFrame = this.currentFrame;

        //如果干掉的是当前帧前面的帧，当前帧的索引就往上走一个
        if (index < this.currentFrame) {
            this.currentFrame--;
        }

        //如果干掉了元素后当前帧已经超过了length
        if (this.currentFrame >= this.children.length && this.children.length > 0) {
            this.currentFrame = this.children.length - 1;
        }
    },
    _goto: function (i) {
        var len = this.children.length;
        if (i >= len) {
            i = i % len;
        }
        if (i < 0) {
            i = this.children.length - 1 - Math.abs(i) % len;
        }
        this.currentFrame = i;
    },
    gotoAndStop: function (i) {
        this._goto(i);
        if (!this.autoPlay) {
            //再stop的状态下面跳帧，就要告诉stage去发心跳
            this._preRenderTime = 0;
            this.getStage().heartBeat();
            return;
        }
        this.autoPlay = false;
    },
    stop: function () {
        if (!this.autoPlay) {
            return;
        }
        this.autoPlay = false;
    },
    gotoAndPlay: function (i) {
        this._goto(i);
        this.play();
    },
    play: function () {
        if (this.autoPlay) {
            return;
        }
        this.autoPlay = true;
        var canvax = this.getStage().parent;
        if (!canvax._heartBeat && canvax._taskList.length == 0) {
            //手动启动引擎
            canvax.__startEnter();
        }
        this._push2TaskList();

        this._preRenderTime = new Date().getTime();
    },
    _push2TaskList: function () {
        //把enterFrame push 到 引擎的任务列表
        if (!this._enterInCanvax) {
            this.getStage().parent._taskList.push(this);
            this._enterInCanvax = true;
        }
    },
    //autoPlay为true 而且已经把__enterFrame push 到了引擎的任务队列，
    //则为true
    _enterInCanvax: false,
    __enterFrame: function () {
        var self = this;
        if (Utils.now - self._preRenderTime >= self._speedTime) {
            //大于_speedTime，才算完成了一帧
            //上报心跳 无条件心跳吧。
            //后续可以加上对应的 Movieclip 跳帧 心跳
            self.getStage().heartBeat();
        }
    },
    next: function () {
        var self = this;
        if (!self.autoPlay) {
            //只有再非播放状态下才有效
            self.gotoAndStop(self._next());
        }
    },
    pre: function () {
        var self = this;
        if (!self.autoPlay) {
            //只有再非播放状态下才有效
            self.gotoAndStop(self._pre());
        }
    },
    _next: function () {
        var self = this;
        if (this.currentFrame >= this.children.length - 1) {
            this.currentFrame = 0;
        } else {
            this.currentFrame++;
        }
        return this.currentFrame;
    },

    _pre: function () {
        var self = this;
        if (this.currentFrame == 0) {
            this.currentFrame = this.children.length - 1;
        } else {
            this.currentFrame--;
        }
        return this.currentFrame;
    },
    render: function (ctx) {
        //这里也还要做次过滤，如果不到speedTime，就略过

        //TODO：如果是改变moviclip的x or y 等 非帧动画 属性的时候加上这个就会 有漏帧现象，先注释掉
        /* 
        if( (Utils.now-this._preRenderTime) < this._speedTime ){
           return;
        }
        */

        //因为如果children为空的话，Movieclip 会把自己设置为 visible:false，不会执行到这个render
        //所以这里可以不用做children.length==0 的判断。 大胆的搞吧。

        if (!this.overPlay) {
            this.getChildAt(this.currentFrame)._render(ctx);
        } else {
            for (var i = 0; i <= this.currentFrame; i++) {
                this.getChildAt(i)._render(ctx);
            }
        }

        if (this.children.length == 1) {
            this.autoPlay = false;
        }

        //如果不循环
        if (this.currentFrame == this.getNumChildren() - 1) {
            //那么，到了最后一帧就停止
            if (!this.repeat) {
                this.stop();
                if (this.hasEvent("end")) {
                    this.fire("end");
                }
            }
            //使用掉一次循环
            if (_$1.isNumber(this.repeat) && this.repeat > 0) {
                this.repeat--;
            }
        }

        if (this.autoPlay) {
            //如果要播放
            if (Utils.now - this._preRenderTime >= this._speedTime) {
                //先把当前绘制的时间点记录
                this._preRenderTime = Utils.now;
                this._next();
            }
            this._push2TaskList();
        } else {
            //暂停播放
            if (this._enterInCanvax) {
                //如果这个时候 已经 添加到了canvax的任务列表
                this._enterInCanvax = false;
                var tList = this.getStage().parent._taskList;
                tList.splice(_$1.indexOf(tList, this), 1);
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
var Circle = function (opt) {
    var self = this;
    self.type = "circle";

    opt = Utils.checkOpt(opt);

    //默认情况下面，circle不需要把xy进行parentInt转换
    "xyToInt" in opt || (opt.xyToInt = false);

    self._context = {
        r: opt.context.r || 0 //{number},  // 必须，圆半径
    };
    Circle.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Circle, Shape, {
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
var Ellipse = function (opt) {
    var self = this;
    self.type = "ellipse";

    opt = Utils.checkOpt(opt);
    self._context = {
        //x             : 0 , //{number},  // 丢弃
        //y             : 0 , //{number},  // 丢弃，原因同circle
        hr: opt.context.hr || 0, //{number},  // 必须，椭圆横轴半径
        vr: opt.context.vr || 0 //{number},  // 必须，椭圆纵轴半径
    };

    Ellipse.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Ellipse, Shape, {
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
var Polygon = function (opt, atype) {
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

    Polygon.superclass.constructor.apply(this, arguments);

    if (atype !== "clone" && opt.context.smooth && end) {}

    self._drawTypeOnly = null;
    self.type = "polygon";
};
Utils.creatClass(Polygon, BrokenLine, {
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
Utils.creatClass(Isogon, Polygon, {
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
    Text: Text,
    Movieclip: Movieclip
};

Canvax.Shapes = {
    BrokenLine: BrokenLine,
    Circle: Circle,
    Droplet: Droplet,
    Ellipse: Ellipse,
    Isogon: Isogon,
    Line: Line,
    Path: Path,
    Polygon: Polygon,
    Rect: Rect,
    Sector: Sector
};

Canvax.Event = {
    EventDispatcher: EventDispatcher,
    EventManager: EventManager
};

return Canvax;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmF4LmpzIiwic291cmNlcyI6WyIuLi8uLi9jYW52YXgvdXRpbHMvdW5kZXJzY29yZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9pbmRleC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1BvaW50LmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0NhbnZheEV2ZW50LmpzIiwiLi4vLi4vY2FudmF4L3NldHRpbmdzLmpzIiwiLi4vLi4vY2FudmF4L3V0aWxzL2RvbS5qcyIsIi4uLy4uL2NhbnZheC9ldmVudC9FdmVudEhhbmRsZXIuanMiLCIuLi8uLi9jYW52YXgvZXZlbnQvRXZlbnRNYW5hZ2VyLmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdGguanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9IaXRUZXN0UG9pbnQuanMiLCIuLi8uLi9jYW52YXgvYW5pbWF0aW9uL1R3ZWVuLmpzIiwiLi4vLi4vY2FudmF4L2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9vYnNlcnZlLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvRGlzcGxheU9iamVjdC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXIuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9TdGFnZS5qcyIsIi4uLy4uL2NhbnZheC9jb25zdC5qcyIsIi4uLy4uL2NhbnZheC9yZW5kZXJlcnMvU3lzdGVtUmVuZGVyZXIuanMiLCIuLi8uLi9jYW52YXgvcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlci5qcyIsIi4uLy4uL2NhbnZheC9BcHBsaWNhdGlvbi5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1NoYXBlLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvVGV4dC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L01vdmllY2xpcC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL1ZlY3Rvci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL1Ntb290aFNwbGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Ccm9rZW5MaW5lLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0NpcmNsZS5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL2Jlemllci5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9QYXRoLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0Ryb3BsZXQuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvRWxsaXBzZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Qb2x5Z29uLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0lzb2dvbi5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9MaW5lLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL1JlY3QuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvU2VjdG9yLmpzIiwiLi4vLi4vY2FudmF4L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfID0ge31cbnZhciBicmVha2VyID0ge307XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXJcbnRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbmhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxudmFyXG5uYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG5uYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbm5hdGl2ZUluZGV4T2YgICAgICA9IEFycmF5UHJvdG8uaW5kZXhPZixcbm5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG5uYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cztcblxuXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbl8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmogIT09IE9iamVjdChvYmopKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9iamVjdCcpO1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbn07XG5cbl8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xufTtcblxudmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICB9XG4gIH1cbn07XG5cbl8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG59O1xuXG5fLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICB9O1xufSk7XG5cbmlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gIH07XG59O1xuXG5fLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xufTtcblxuXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xufTtcblxuXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG59O1xuXG5fLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBudWxsO1xufTtcblxuXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5fLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG59O1xuXG5fLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5fLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufTtcblxuXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbl8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgaWYgKGlzU29ydGVkKSB7XG4gICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsZW5ndGggKyBpc1NvcnRlZCkgOiBpc1NvcnRlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgIHJldHVybiBhcnJheVtpXSA9PT0gaXRlbSA/IGkgOiAtMTtcbiAgICB9XG4gIH1cbiAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSwgaXNTb3J0ZWQpO1xuICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbn07XG5cbl8uaXNXaW5kb3cgPSBmdW5jdGlvbiggb2JqICkgeyBcbiAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmogPT0gb2JqLndpbmRvdztcbn07XG5fLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiggb2JqICkge1xuICAgIC8vIEJlY2F1c2Ugb2YgSUUsIHdlIGFsc28gaGF2ZSB0byBjaGVjayB0aGUgcHJlc2VuY2Ugb2YgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5LlxuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IERPTSBub2RlcyBhbmQgd2luZG93IG9iamVjdHMgZG9uJ3QgcGFzcyB0aHJvdWdoLCBhcyB3ZWxsXG4gICAgaWYgKCAhb2JqIHx8IHR5cGVvZiBvYmogIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8IF8uaXNXaW5kb3coIG9iaiApICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgICAgICAgaWYgKCBvYmouY29uc3RydWN0b3IgJiZcbiAgICAgICAgICAgICFoYXNPd24uY2FsbChvYmosIFwiY29uc3RydWN0b3JcIikgJiZcbiAgICAgICAgICAgICFoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCBcImlzUHJvdG90eXBlT2ZcIikgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgLy8gSUU4LDkgV2lsbCB0aHJvdyBleGNlcHRpb25zIG9uIGNlcnRhaW4gaG9zdCBvYmplY3RzICM5ODk3XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gICAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gICAgdmFyIGtleTtcbiAgICBmb3IgKCBrZXkgaW4gb2JqICkge31cblxuICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbCggb2JqLCBrZXkgKTtcbn07XG5fLmV4dGVuZCA9IGZ1bmN0aW9uKCkgeyAgXG4gIHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSwgIFxuICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LCAgXG4gICAgICBpID0gMSwgIFxuICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwgIFxuICAgICAgZGVlcCA9IGZhbHNlOyAgXG4gIGlmICggdHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIgKSB7ICBcbiAgICAgIGRlZXAgPSB0YXJnZXQ7ICBcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTsgIFxuICAgICAgaSA9IDI7ICBcbiAgfTsgIFxuICBpZiAoIHR5cGVvZiB0YXJnZXQgIT09IFwib2JqZWN0XCIgJiYgIV8uaXNGdW5jdGlvbih0YXJnZXQpICkgeyAgXG4gICAgICB0YXJnZXQgPSB7fTsgIFxuICB9OyAgXG4gIGlmICggbGVuZ3RoID09PSBpICkgeyAgXG4gICAgICB0YXJnZXQgPSB0aGlzOyAgXG4gICAgICAtLWk7ICBcbiAgfTsgIFxuICBmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHsgIFxuICAgICAgaWYgKCAob3B0aW9ucyA9IGFyZ3VtZW50c1sgaSBdKSAhPSBudWxsICkgeyAgXG4gICAgICAgICAgZm9yICggbmFtZSBpbiBvcHRpb25zICkgeyAgXG4gICAgICAgICAgICAgIHNyYyA9IHRhcmdldFsgbmFtZSBdOyAgXG4gICAgICAgICAgICAgIGNvcHkgPSBvcHRpb25zWyBuYW1lIF07ICBcbiAgICAgICAgICAgICAgaWYgKCB0YXJnZXQgPT09IGNvcHkgKSB7ICBcbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAgXG4gICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICBpZiAoIGRlZXAgJiYgY29weSAmJiAoIF8uaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBfLmlzQXJyYXkoY29weSkpICkgKSB7ICBcbiAgICAgICAgICAgICAgICAgIGlmICggY29weUlzQXJyYXkgKSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICBjb3B5SXNBcnJheSA9IGZhbHNlOyAgXG4gICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgXy5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTsgIFxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgIFxuICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIF8uaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307ICBcbiAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgdGFyZ2V0WyBuYW1lIF0gPSBfLmV4dGVuZCggZGVlcCwgY2xvbmUsIGNvcHkgKTsgIFxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjb3B5ICE9PSB1bmRlZmluZWQgKSB7ICBcbiAgICAgICAgICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gY29weTsgIFxuICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICB9ICBcbiAgICAgIH0gIFxuICB9ICBcbiAgcmV0dXJuIHRhcmdldDsgIFxufTsgXG5fLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xufTtcbmV4cG9ydCBkZWZhdWx0IF87IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20gXG4qL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxudmFyIFV0aWxzID0ge1xuICAgIG1haW5GcmFtZVJhdGUgICA6IDYwLC8v6buY6K6k5Li75bin546HXG4gICAgbm93IDogMCxcbiAgICAvKuWDj+e0oOajgOa1i+S4k+eUqCovXG4gICAgX3BpeGVsQ3R4ICAgOiBudWxsLFxuICAgIF9fZW1wdHlGdW5jIDogZnVuY3Rpb24oKXt9LFxuICAgIC8vcmV0aW5hIOWxj+W5leS8mOWMllxuICAgIF9kZXZpY2VQaXhlbFJhdGlvIDogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICBfVUlEICA6IDAsIC8v6K+l5YC85Li65ZCR5LiK55qE6Ieq5aKe6ZW/5pW05pWw5YC8XG4gICAgZ2V0VUlEOmZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9VSUQrKztcbiAgICB9LFxuICAgIGNyZWF0ZUlkIDogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAvL2lmIGVuZCB3aXRoIGEgZGlnaXQsIHRoZW4gYXBwZW5kIGFuIHVuZGVyc0Jhc2UgYmVmb3JlIGFwcGVuZGluZ1xuICAgICAgICB2YXIgY2hhckNvZGUgPSBuYW1lLmNoYXJDb2RlQXQobmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKGNoYXJDb2RlID49IDQ4ICYmIGNoYXJDb2RlIDw9IDU3KSBuYW1lICs9IFwiX1wiO1xuICAgICAgICByZXR1cm4gbmFtZSArIFV0aWxzLmdldFVJRCgpO1xuICAgIH0sXG4gICAgY2FudmFzU3VwcG9ydCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0O1xuICAgIH0sXG4gICAgY3JlYXRlT2JqZWN0IDogZnVuY3Rpb24oIHByb3RvICwgY29uc3RydWN0b3IgKSB7XG4gICAgICAgIHZhciBuZXdQcm90bztcbiAgICAgICAgdmFyIE9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG4gICAgICAgIGlmIChPYmplY3RDcmVhdGUpIHtcbiAgICAgICAgICAgIG5ld1Byb3RvID0gT2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFV0aWxzLl9fZW1wdHlGdW5jLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgICAgICAgbmV3UHJvdG8gPSBuZXcgVXRpbHMuX19lbXB0eUZ1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdQcm90by5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3UHJvdG87XG4gICAgfSxcbiAgICBzZXRDb250ZXh0U3R5bGUgOiBmdW5jdGlvbiggY3R4ICwgc3R5bGUgKXtcbiAgICAgICAgLy8g566A5Y2V5Yik5pat5LiN5YGa5Lil5qC857G75Z6L5qOA5rWLXG4gICAgICAgIGZvcih2YXIgcCBpbiBzdHlsZSl7XG4gICAgICAgICAgICBpZiggcCAhPSBcInRleHRCYXNlbGluZVwiICYmICggcCBpbiBjdHggKSApe1xuICAgICAgICAgICAgICAgIGlmICggc3R5bGVbcF0gfHwgXy5pc051bWJlciggc3R5bGVbcF0gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHAgPT0gXCJnbG9iYWxBbHBoYVwiICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mAj+aYjuW6puimgeS7jueItuiKgueCuee7p+aJv1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdICo9IHN0eWxlW3BdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gc3R5bGVbcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybjtcbiAgICB9LFxuICAgIGNyZWF0Q2xhc3MgOiBmdW5jdGlvbihyLCBzLCBweCl7XG4gICAgICAgIGlmICghcyB8fCAhcikge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNwID0gcy5wcm90b3R5cGUsIHJwO1xuICAgICAgICAvLyBhZGQgcHJvdG90eXBlIGNoYWluXG4gICAgICAgIHJwID0gVXRpbHMuY3JlYXRlT2JqZWN0KHNwLCByKTtcbiAgICAgICAgci5wcm90b3R5cGUgPSBfLmV4dGVuZChycCwgci5wcm90b3R5cGUpO1xuICAgICAgICByLnN1cGVyY2xhc3MgPSBVdGlscy5jcmVhdGVPYmplY3Qoc3AsIHMpO1xuICAgICAgICAvLyBhZGQgcHJvdG90eXBlIG92ZXJyaWRlc1xuICAgICAgICBpZiAocHgpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHJwLCBweCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfSxcbiAgICBpbml0RWxlbWVudCA6IGZ1bmN0aW9uKCBjYW52YXMgKXtcbiAgICAgICAgaWYoIHdpbmRvdy5GbGFzaENhbnZhcyAmJiBGbGFzaENhbnZhcy5pbml0RWxlbWVudCl7XG4gICAgICAgICAgICBGbGFzaENhbnZhcy5pbml0RWxlbWVudCggY2FudmFzICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5YGa5LiA5qyh566A5Y2V55qEb3B05Y+C5pWw5qCh6aqM77yM5L+d6K+B5Zyo55So5oi35LiN5Lygb3B055qE5pe25YCZIOaIluiAheS8oOS6hm9wdOS9huaYr+mHjOmdouayoeaciWNvbnRleHTnmoTml7blgJnmiqXplJlcbiAgICBjaGVja09wdCAgICA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIGlmKCAhb3B0ICl7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRleHQgOiB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9ICAgXG4gICAgICAgIH0gZWxzZSBpZiggb3B0ICYmICFvcHQuY29udGV4dCApIHtcbiAgICAgICAgICBvcHQuY29udGV4dCA9IHt9XG4gICAgICAgICAgcmV0dXJuIG9wdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb3B0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFxuICAgIC8qKlxuICAgICAqIOaMieeFp2Nzc+eahOmhuuW6j++8jOi/lOWbnuS4gOS4qlvkuIos5Y+zLOS4iyzlt6ZdXG4gICAgICovXG4gICAgZ2V0Q3NzT3JkZXJBcnIgOiBmdW5jdGlvbiggciApe1xuICAgICAgICB2YXIgcjE7IFxuICAgICAgICB2YXIgcjI7IFxuICAgICAgICB2YXIgcjM7IFxuICAgICAgICB2YXIgcjQ7XG5cbiAgICAgICAgaWYodHlwZW9mIHIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IHI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihyIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHIxID0gcjIgPSByMyA9IHI0ID0gclswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoci5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICByMSA9IHIzID0gclswXTtcbiAgICAgICAgICAgICAgICByMiA9IHI0ID0gclsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoci5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICByMSA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByNCA9IHJbMV07XG4gICAgICAgICAgICAgICAgcjMgPSByWzJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByMSA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByWzFdO1xuICAgICAgICAgICAgICAgIHIzID0gclsyXTtcbiAgICAgICAgICAgICAgICByNCA9IHJbM107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtyMSxyMixyMyxyNF07XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVXRpbHM7IiwiLyoqXG4gKiBQb2ludFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCx5KXtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoPT0xICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT0gJ29iamVjdCcgKXtcbiAgICAgICB2YXIgYXJnPWFyZ3VtZW50c1swXVxuICAgICAgIGlmKCBcInhcIiBpbiBhcmcgJiYgXCJ5XCIgaW4gYXJnICl7XG4gICAgICAgICAgdGhpcy54ID0gYXJnLngqMTtcbiAgICAgICAgICB0aGlzLnkgPSBhcmcueSoxO1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGk9MDtcbiAgICAgICAgICBmb3IgKHZhciBwIGluIGFyZyl7XG4gICAgICAgICAgICAgIGlmKGk9PTApe1xuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ1twXSoxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ1twXSoxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgeCB8fCAoeD0wKTtcbiAgICB5IHx8ICh5PTApO1xuICAgIHRoaXMueCA9IHgqMTtcbiAgICB0aGlzLnkgPSB5KjE7XG59O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiBjYW52YXMg5LiK5aeU5omY55qE5LqL5Lu2566h55CGXG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbnZhciBDYW52YXhFdmVudCA9IGZ1bmN0aW9uKCBldnQgLCBwYXJhbXMgKSB7XG5cdFxuXHR2YXIgZXZlbnRUeXBlID0gXCJDYW52YXhFdmVudFwiOyBcbiAgICBpZiggXy5pc1N0cmluZyggZXZ0ICkgKXtcbiAgICBcdGV2ZW50VHlwZSA9IGV2dDtcbiAgICB9O1xuICAgIGlmKCBfLmlzT2JqZWN0KCBldnQgKSAmJiBldnQudHlwZSApe1xuICAgIFx0ZXZlbnRUeXBlID0gZXZ0LnR5cGU7XG4gICAgfTtcblxuICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1x0XG4gICAgdGhpcy50eXBlICAgPSBldmVudFR5cGU7XG4gICAgdGhpcy5wb2ludCAgPSBudWxsO1xuXG4gICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uID0gZmFsc2UgOyAvL+m7mOiupOS4jemYu+atouS6i+S7tuWGkuazoVxufVxuQ2FudmF4RXZlbnQucHJvdG90eXBlID0ge1xuICAgIHN0b3BQcm9wYWdhdGlvbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IENhbnZheEV2ZW50OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICAvL+iuvuWkh+WIhui+qOeOh1xuICAgIFJFU09MVVRJT046IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG5cbiAgICAvL+a4suafk0ZQU1xuICAgIEZQUzogNjBcbn07XG4iLCJpbXBvcnQgXyBmcm9tIFwiLi91bmRlcnNjb3JlXCI7XG5pbXBvcnQgc2V0dGluZ3MgZnJvbSBcIi4uL3NldHRpbmdzXCJcblxudmFyIGFkZE9yUm1vdmVFdmVudEhhbmQgPSBmdW5jdGlvbiggZG9tSGFuZCAsIGllSGFuZCApe1xuICAgIGlmKCBkb2N1bWVudFsgZG9tSGFuZCBdICl7XG4gICAgICAgIGZ1bmN0aW9uIGV2ZW50RG9tRm4oIGVsICwgdHlwZSAsIGZuICl7XG4gICAgICAgICAgICBpZiggZWwubGVuZ3RoICl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTAgOyBpIDwgZWwubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnREb21GbiggZWxbaV0gLCB0eXBlICwgZm4gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsWyBkb21IYW5kIF0oIHR5cGUgLCBmbiAsIGZhbHNlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBldmVudERvbUZuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnVuY3Rpb24gZXZlbnRGbiggZWwgLCB0eXBlICwgZm4gKXtcbiAgICAgICAgICAgIGlmKCBlbC5sZW5ndGggKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MCA7IGkgPCBlbC5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBldmVudEZuKCBlbFtpXSx0eXBlLGZuICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbFsgaWVIYW5kIF0oIFwib25cIit0eXBlICwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwoIGVsICwgd2luZG93LmV2ZW50ICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBldmVudEZuXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8vIGRvbeaTjeS9nOebuOWFs+S7o+eggVxuICAgIHF1ZXJ5IDogZnVuY3Rpb24oZWwpe1xuICAgICAgICBpZihfLmlzU3RyaW5nKGVsKSl7XG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbClcbiAgICAgICAgfVxuICAgICAgICBpZihlbC5ub2RlVHlwZSA9PSAxKXtcbiAgICAgICAgICAgLy/liJnkuLrkuIDkuKplbGVtZW505pys6LqrXG4gICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9XG4gICAgICAgIGlmKGVsLmxlbmd0aCl7XG4gICAgICAgICAgIHJldHVybiBlbFswXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgb2Zmc2V0IDogZnVuY3Rpb24oZWwpe1xuICAgICAgICB2YXIgYm94ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIFxuICAgICAgICBkb2MgPSBlbC5vd25lckRvY3VtZW50LCBcbiAgICAgICAgYm9keSA9IGRvYy5ib2R5LCBcbiAgICAgICAgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQsIFxuXG4gICAgICAgIC8vIGZvciBpZSAgXG4gICAgICAgIGNsaWVudFRvcCA9IGRvY0VsZW0uY2xpZW50VG9wIHx8IGJvZHkuY2xpZW50VG9wIHx8IDAsIFxuICAgICAgICBjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwLCBcblxuICAgICAgICAvLyBJbiBJbnRlcm5ldCBFeHBsb3JlciA3IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBwcm9wZXJ0eSBpcyB0cmVhdGVkIGFzIHBoeXNpY2FsLCBcbiAgICAgICAgLy8gd2hpbGUgb3RoZXJzIGFyZSBsb2dpY2FsLiBNYWtlIGFsbCBsb2dpY2FsLCBsaWtlIGluIElFOC4gXG4gICAgICAgIHpvb20gPSAxOyBcbiAgICAgICAgaWYgKGJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7IFxuICAgICAgICAgICAgdmFyIGJvdW5kID0gYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgXG4gICAgICAgICAgICB6b29tID0gKGJvdW5kLnJpZ2h0IC0gYm91bmQubGVmdCkvYm9keS5jbGllbnRXaWR0aDsgXG4gICAgICAgIH0gXG4gICAgICAgIGlmICh6b29tID4gMSl7IFxuICAgICAgICAgICAgY2xpZW50VG9wID0gMDsgXG4gICAgICAgICAgICBjbGllbnRMZWZ0ID0gMDsgXG4gICAgICAgIH0gXG4gICAgICAgIHZhciB0b3AgPSBib3gudG9wL3pvb20gKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5zY3JvbGxUb3Avem9vbSB8fCBib2R5LnNjcm9sbFRvcC96b29tKSAtIGNsaWVudFRvcCwgXG4gICAgICAgICAgICBsZWZ0ID0gYm94LmxlZnQvem9vbSArICh3aW5kb3cucGFnZVhPZmZzZXR8fCBkb2NFbGVtICYmIGRvY0VsZW0uc2Nyb2xsTGVmdC96b29tIHx8IGJvZHkuc2Nyb2xsTGVmdC96b29tKSAtIGNsaWVudExlZnQ7IFxuXG4gICAgICAgIHJldHVybiB7IFxuICAgICAgICAgICAgdG9wOiB0b3AsIFxuICAgICAgICAgICAgbGVmdDogbGVmdCBcbiAgICAgICAgfTsgXG4gICAgfSxcbiAgICBhZGRFdmVudCA6IGFkZE9yUm1vdmVFdmVudEhhbmQoIFwiYWRkRXZlbnRMaXN0ZW5lclwiICwgXCJhdHRhY2hFdmVudFwiICksXG4gICAgcmVtb3ZlRXZlbnQgOiBhZGRPclJtb3ZlRXZlbnRIYW5kKCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiAsIFwiZGV0YWNoRXZlbnRcIiApLFxuICAgIHBhZ2VYOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnBhZ2VYKSByZXR1cm4gZS5wYWdlWDtcbiAgICAgICAgZWxzZSBpZiAoZS5jbGllbnRYKVxuICAgICAgICAgICAgcmV0dXJuIGUuY2xpZW50WCArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCA/XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IDogZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0KTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHBhZ2VZOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnBhZ2VZKSByZXR1cm4gZS5wYWdlWTtcbiAgICAgICAgZWxzZSBpZiAoZS5jbGllbnRZKVxuICAgICAgICAgICAgcmV0dXJuIGUuY2xpZW50WSArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA6IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIm+W7umRvbVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBkb20gaWQg5b6F55SoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgOiBkb20gdHlwZe+8jCBzdWNoIGFzIGNhbnZhcywgZGl2IGV0Yy5cbiAgICAgKi9cbiAgICBjcmVhdGVDYW52YXMgOiBmdW5jdGlvbiggX3dpZHRoICwgX2hlaWdodCAsIGlkKSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggID0gX3dpZHRoICsgJ3B4JztcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IF9oZWlnaHQgKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUubGVmdCAgID0gMDtcbiAgICAgICAgY2FudmFzLnN0eWxlLnRvcCAgICA9IDA7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgX3dpZHRoICogc2V0dGluZ3MuUkVTT0xVVElPTik7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIF9oZWlnaHQgKiBzZXR0aW5ncy5SRVNPTFVUSU9OKTtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfSxcbiAgICBjcmVhdGVWaWV3OiBmdW5jdGlvbihfd2lkdGggLCBfaGVpZ2h0LCBpZCl7XG4gICAgICAgIHZhciB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5jbGFzc05hbWUgPSBcImNhbnZheC12aWV3XCI7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgdmFyIHN0YWdlX2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2aWV3LnN0eWxlLmNzc1RleHQgKz0gXCJwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpcIiArIF93aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgX2hlaWdodCArXCJweDtcIlxuXG4gICAgICAgIC8v55So5p2l5a2Y5pS+5LiA5LqbZG9t5YWD57SgXG4gICAgICAgIHZhciBkb21fYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOmFic29sdXRlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZChzdGFnZV9jKTtcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZChkb21fYyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmlldyA6IHZpZXcsXG4gICAgICAgICAgICBzdGFnZV9jOiBzdGFnZV9jLFxuICAgICAgICAgICAgZG9tX2M6IGRvbV9jXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy9kb23nm7jlhbPku6PnoIHnu5PmnZ9cbn07IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICovXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL2Rpc3BsYXkvUG9pbnRcIjtcbmltcG9ydCBDYW52YXhFdmVudCBmcm9tIFwiLi9DYW52YXhFdmVudFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCAkIGZyb20gXCIuLi91dGlscy9kb21cIjtcblxudmFyIF9tb3VzZUV2ZW50VHlwZXMgPSBbXCJjbGlja1wiLFwiZGJsY2xpY2tcIixcIm1vdXNlZG93blwiLFwibW91c2Vtb3ZlXCIsXCJtb3VzZXVwXCIsXCJtb3VzZW91dFwiXTtcbnZhciBfaGFtbWVyRXZlbnRUeXBlcyA9IFsgXG4gICAgXCJwYW5cIixcInBhbnN0YXJ0XCIsXCJwYW5tb3ZlXCIsXCJwYW5lbmRcIixcInBhbmNhbmNlbFwiLFwicGFubGVmdFwiLFwicGFucmlnaHRcIixcInBhbnVwXCIsXCJwYW5kb3duXCIsXG4gICAgXCJwcmVzc1wiICwgXCJwcmVzc3VwXCIsXG4gICAgXCJzd2lwZVwiICwgXCJzd2lwZWxlZnRcIiAsIFwic3dpcGVyaWdodFwiICwgXCJzd2lwZXVwXCIgLCBcInN3aXBlZG93blwiLFxuICAgIFwidGFwXCJcbl07XG5cbnZhciBFdmVudEhhbmRsZXIgPSBmdW5jdGlvbihjYW52YXggLCBvcHQpIHtcbiAgICB0aGlzLmNhbnZheCA9IGNhbnZheDtcblxuICAgIHRoaXMuY3VyUG9pbnRzID0gW25ldyBQb2ludCgwLCAwKV0gLy9YLFkg55qEIHBvaW50IOmbhuWQiCwg5ZyodG91Y2jkuIvpnaLliJnkuLogdG91Y2jnmoTpm4blkIjvvIzlj6rmmK/ov5nkuKp0b3VjaOiiq+a3u+WKoOS6huWvueW6lOeahHjvvIx5XG4gICAgLy/lvZPliY3mv4DmtLvnmoTngrnlr7nlupTnmoRvYmrvvIzlnKh0b3VjaOS4i+WPr+S7peaYr+S4quaVsOe7hCzlkozkuIrpnaLnmoQgY3VyUG9pbnRzIOWvueW6lFxuICAgIHRoaXMuY3VyUG9pbnRzVGFyZ2V0ID0gW107XG5cbiAgICB0aGlzLl90b3VjaGluZyA9IGZhbHNlO1xuICAgIC8v5q2j5Zyo5ouW5Yqo77yM5YmN5o+Q5pivX3RvdWNoaW5nPXRydWVcbiAgICB0aGlzLl9kcmFnaW5nID0gZmFsc2U7XG5cbiAgICAvL+W9k+WJjeeahOm8oOagh+eKtuaAgVxuICAgIHRoaXMuX2N1cnNvciA9IFwiZGVmYXVsdFwiO1xuXG4gICAgdGhpcy50YXJnZXQgPSB0aGlzLmNhbnZheC52aWV3O1xuICAgIHRoaXMudHlwZXMgPSBbXTtcblxuICAgIC8vbW91c2XkvZPnu5/kuK3kuI3pnIDopoHphY3nva5kcmFnLHRvdWNo5Lit5Lya55So5Yiw56ys5LiJ5pa555qEdG91Y2jlupPvvIzmr4/kuKrlupPnmoTkuovku7blkI3np7Dlj6/og73kuI3kuIDmoLfvvIxcbiAgICAvL+Wwseimgei/memHjOmFjee9ru+8jOm7mOiupOWunueOsOeahOaYr2hhbW1lcmpz55qELOaJgOS7pem7mOiupOWPr+S7peWcqOmhueebrumHjOW8leWFpWhhbW1lcmpzIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gICAgdGhpcy5kcmFnID0ge1xuICAgICAgICBzdGFydCA6IFwicGFuc3RhcnRcIixcbiAgICAgICAgbW92ZSA6IFwicGFubW92ZVwiLFxuICAgICAgICBlbmQgOiBcInBhbmVuZFwiXG4gICAgfTtcblxuICAgIF8uZXh0ZW5kKCB0cnVlICwgdGhpcyAsIG9wdCApO1xuXG59O1xuXG4vL+i/meagt+eahOWlveWkhOaYr2RvY3VtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9u5Y+q5Lya5Zyo5a6a5LmJ55qE5pe25YCZ5omn6KGM5LiA5qyh44CCXG52YXIgY29udGFpbnMgPSBkb2N1bWVudC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiA/IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhIShwYXJlbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb24oY2hpbGQpICYgMTYpO1xufSA6IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZCAhPT0gY2hpbGQgJiYgKHBhcmVudC5jb250YWlucyA/IHBhcmVudC5jb250YWlucyhjaGlsZCkgOiB0cnVlKTtcbn07XG5cbkV2ZW50SGFuZGxlci5wcm90b3R5cGUgPSB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICAvL+S+neasoea3u+WKoOS4iua1j+iniOWZqOeahOiHquW4puS6i+S7tuS+puWQrFxuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAvL+WmguaenHRhcmdldC5ub2RlVHlwZeayoeacieeahOivne+8jCDor7TmmI7or6V0YXJnZXTkuLrkuIDkuKpqUXVlcnnlr7nosaEgb3Iga2lzc3kg5a+56LGhb3IgaGFtbWVy5a+56LGhXG4gICAgICAgICAgICAvL+WNs+S4uuesrOS4ieaWueW6k++8jOmCo+S5iOWwseimgeWvueaOpeesrOS4ieaWueW6k+eahOS6i+S7tuezu+e7n+OAgum7mOiupOWunueOsGhhbW1lcueahOWkp+mDqOWIhuS6i+S7tuezu+e7n1xuICAgICAgICAgICAgaWYoICFtZS50eXBlcyB8fCBtZS50eXBlcy5sZW5ndGggPT0gMCAgKXtcbiAgICAgICAgICAgICAgICBtZS50eXBlcyA9IF9oYW1tZXJFdmVudFR5cGVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gMSApe1xuICAgICAgICAgICAgbWUudHlwZXMgPSBfbW91c2VFdmVudFR5cGVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIF8uZWFjaCggbWUudHlwZXMgLCBmdW5jdGlvbiggdHlwZSApe1xuICAgICAgICAgICAgLy/kuI3lho3lhbPlv4PmtY/op4jlmajnjq/looPmmK/lkKYgJ29udG91Y2hzdGFydCcgaW4gd2luZG93IFxuICAgICAgICAgICAgLy/ogIzmmK/nm7TmjqXlj6rnrqHkvKDnu5nkuovku7bmqKHlnZfnmoTmmK/kuIDkuKrljp/nlJ9kb23ov5jmmK8ganHlr7nosaEgb3IgaGFtbWVy5a+56LGh562JXG4gICAgICAgICAgICBpZiggbWUudGFyZ2V0Lm5vZGVUeXBlID09IDEgKXtcbiAgICAgICAgICAgICAgICAkLmFkZEV2ZW50KCBtZS50YXJnZXQgLCB0eXBlICwgZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgbWUuX19tb3VzZUhhbmRsZXIoIGUgKTtcbiAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLnRhcmdldC5vbiggdHlwZSAsIGZ1bmN0aW9uKCBlICl7XG4gICAgICAgICAgICAgICAgICAgIG1lLl9fbGliSGFuZGxlciggZSApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSApO1xuICAgIH0sXG4gICAgLypcbiAgICAqIOWOn+eUn+S6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWJlZ2luXG4gICAgKiDpvKDmoIfkuovku7blpITnkIblh73mlbBcbiAgICAqKi9cbiAgICBfX21vdXNlSGFuZGxlciA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG5cbiAgICAgICAgcm9vdC51cGRhdGVWaWV3T2Zmc2V0KCk7XG4gICAgXG4gICAgICAgIG1lLmN1clBvaW50cyA9IFsgbmV3IFBvaW50KCBcbiAgICAgICAgICAgICQucGFnZVgoIGUgKSAtIHJvb3Qudmlld09mZnNldC5sZWZ0ICwgXG4gICAgICAgICAgICAkLnBhZ2VZKCBlICkgLSByb290LnZpZXdPZmZzZXQudG9wXG4gICAgICAgICldO1xuXG4gICAgICAgIC8v55CG6K665LiK5p2l6K+077yM6L+Z6YeM5ou/5YiwcG9pbnTkuoblkI7vvIzlsLHopoHorqHnrpfov5nkuKpwb2ludOWvueW6lOeahHRhcmdldOadpXB1c2jliLBjdXJQb2ludHNUYXJnZXTph4zvvIxcbiAgICAgICAgLy/kvYbmmK/lm6DkuLrlnKhkcmFn55qE5pe25YCZ5YW25a6e5piv5Y+v5Lul5LiN55So6K6h566X5a+55bqUdGFyZ2V055qE44CCXG4gICAgICAgIC8v5omA5Lul5pS+5Zyo5LqG5LiL6Z2i55qEbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoIGUgLCBjdXJNb3VzZVBvaW50ICk75bi46KeEbW91c2Vtb3Zl5Lit5omn6KGMXG5cbiAgICAgICAgdmFyIGN1ck1vdXNlUG9pbnQgID0gbWUuY3VyUG9pbnRzWzBdOyBcbiAgICAgICAgdmFyIGN1ck1vdXNlVGFyZ2V0ID0gbWUuY3VyUG9pbnRzVGFyZ2V0WzBdO1xuXG4gICAgICAgIC8v5qih5oufZHJhZyxtb3VzZW92ZXIsbW91c2VvdXQg6YOo5YiG5Luj56CBIGJlZ2luLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vbW91c2Vkb3du55qE5pe25YCZIOWmguaenCBjdXJNb3VzZVRhcmdldC5kcmFnRW5hYmxlZCDkuLp0cnVl44CC5bCx6KaB5byA5aeL5YeG5aSHZHJhZ+S6hlxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2Vkb3duXCIgKXtcbiAgICAgICAgICAgLy/lpoLmnpxjdXJUYXJnZXQg55qE5pWw57uE5Li656m65oiW6ICF56ys5LiA5Liq5Li6ZmFsc2Ug77yM77yM77yMXG4gICAgICAgICAgIGlmKCAhY3VyTW91c2VUYXJnZXQgKXtcbiAgICAgICAgICAgICB2YXIgb2JqID0gcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggY3VyTW91c2VQb2ludCAsIDEpWzBdO1xuICAgICAgICAgICAgIGlmKG9iail7XG4gICAgICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXQgPSBbIG9iaiBdO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfTtcbiAgICAgICAgICAgY3VyTW91c2VUYXJnZXQgPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG4gICAgICAgICAgIGlmICggY3VyTW91c2VUYXJnZXQgJiYgY3VyTW91c2VUYXJnZXQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgIC8v6byg5qCH5LqL5Lu25bey57uP5pG45Yiw5LqG5LiA5LiqXG4gICAgICAgICAgICAgICBtZS5fdG91Y2hpbmcgPSB0cnVlO1xuICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZXVwXCIgfHwgKGUudHlwZSA9PSBcIm1vdXNlb3V0XCIgJiYgIWNvbnRhaW5zKHJvb3QudmlldyAsIChlLnRvRWxlbWVudCB8fCBlLnJlbGF0ZWRUYXJnZXQpICkpICl7XG4gICAgICAgICAgICBpZihtZS5fZHJhZ2luZyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuWImuWImuWcqOaLluWKqFxuICAgICAgICAgICAgICAgIG1lLl9kcmFnRW5kKCBlICwgY3VyTW91c2VUYXJnZXQgLCAwICk7XG4gICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuZmlyZShcImRyYWdlbmRcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX2RyYWdpbmcgID0gZmFsc2U7XG4gICAgICAgICAgICBtZS5fdG91Y2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2VvdXRcIiApe1xuICAgICAgICAgICAgaWYoICFjb250YWlucyhyb290LnZpZXcgLCAoZS50b0VsZW1lbnQgfHwgZS5yZWxhdGVkVGFyZ2V0KSApICl7XG4gICAgICAgICAgICAgICAgbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoZSAsIGN1ck1vdXNlUG9pbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICl7ICAvL3x8IGUudHlwZSA9PSBcIm1vdXNlZG93blwiICl7XG4gICAgICAgICAgICAvL+aLluWKqOi/h+eoi+S4reWwseS4jeWcqOWBmuWFtuS7lueahG1vdXNlb3ZlcuajgOa1i++8jGRyYWfkvJjlhYhcbiAgICAgICAgICAgIGlmKG1lLl90b3VjaGluZyAmJiBlLnR5cGUgPT0gXCJtb3VzZW1vdmVcIiAmJiBjdXJNb3VzZVRhcmdldCl7XG4gICAgICAgICAgICAgICAgLy/or7TmmI7mraPlnKjmi5bliqjllYpcbiAgICAgICAgICAgICAgICBpZighbWUuX2RyYWdpbmcpe1xuICAgICAgICAgICAgICAgICAgICAvL2JlZ2luIGRyYWdcbiAgICAgICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuZmlyZShcImRyYWdzdGFydFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lhYjmiormnKzlsIrnu5npmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIC8v54S25ZCO5YWL6ZqG5LiA5Liq5Ymv5pys5YiwYWN0aXZlU3RhZ2VcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9uZU9iamVjdCA9IG1lLl9jbG9uZTJob3ZlclN0YWdlKCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVPYmplY3QuY29udGV4dC5nbG9iYWxBbHBoYSA9IGN1ck1vdXNlVGFyZ2V0Ll9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2RyYWcgbW92ZSBpbmdcbiAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdNb3ZlSGFuZGVyKCBlICwgY3VyTW91c2VUYXJnZXQgLCAwICk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtZS5fZHJhZ2luZyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8v5bi46KeEbW91c2Vtb3Zl5qOA5rWLXG4gICAgICAgICAgICAgICAgLy9tb3Zl5LqL5Lu25Lit77yM6ZyA6KaB5LiN5YGc55qE5pCc57SidGFyZ2V077yM6L+Z5Liq5byA6ZSA5oy65aSn77yMXG4gICAgICAgICAgICAgICAgLy/lkI7nu63lj6/ku6XkvJjljJbvvIzliqDkuIrlkozluKfnjofnm7jlvZPnmoTlu7bov5/lpITnkIZcbiAgICAgICAgICAgICAgICBtZS5fX2dldGN1clBvaW50c1RhcmdldCggZSAsIGN1ck1vdXNlUG9pbnQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/lhbbku5bnmoTkuovku7blsLHnm7TmjqXlnKh0YXJnZXTkuIrpnaLmtL7lj5Hkuovku7ZcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGN1ck1vdXNlVGFyZ2V0O1xuICAgICAgICAgICAgaWYoICFjaGlsZCApe1xuICAgICAgICAgICAgICAgIGNoaWxkID0gcm9vdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIFsgY2hpbGQgXSApO1xuICAgICAgICAgICAgbWUuX2N1cnNvckhhbmRlciggY2hpbGQgKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggcm9vdC5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgICAgIC8v6Zi75q2i6buY6K6k5rWP6KeI5Zmo5Yqo5L2cKFczQykgXG4gICAgICAgICAgICBpZiAoIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgICAgICAgIMKgZS5wcmV2ZW50RGVmYXVsdCgpOyBcbiAgICAgICAgICAgIH3CoGVsc2Uge1xuICAgICAgICAgICAgwqDCoMKgwqB3aW5kb3cuZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTsgXG4gICAgfSxcbiAgICBfX2dldGN1clBvaW50c1RhcmdldCA6IGZ1bmN0aW9uKGUgLCBwb2ludCApIHtcbiAgICAgICAgdmFyIG1lICAgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ICAgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBvbGRPYmogPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG5cbiAgICAgICAgaWYoIG9sZE9iaiAmJiAhb2xkT2JqLmNvbnRleHQgKXtcbiAgICAgICAgICAgIG9sZE9iaiA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGUgPSBuZXcgQ2FudmF4RXZlbnQoIGUgKTtcblxuICAgICAgICBpZiggZS50eXBlPT1cIm1vdXNlbW92ZVwiXG4gICAgICAgICAgICAmJiBvbGRPYmogJiYgb2xkT2JqLl9ob3ZlckNsYXNzICYmIG9sZE9iai5wb2ludENoa1ByaW9yaXR5XG4gICAgICAgICAgICAmJiBvbGRPYmouZ2V0Q2hpbGRJblBvaW50KCBwb2ludCApICl7XG4gICAgICAgICAgICAvL+Wwj+S8mOWMlizpvKDmoIdtb3Zl55qE5pe25YCZ44CC6K6h566X6aKR546H5aSq5aSn77yM5omA5Lul44CC5YGa5q2k5LyY5YyWXG4gICAgICAgICAgICAvL+WmguaenOaciXRhcmdldOWtmOWcqO+8jOiAjOS4lOW9k+WJjeWFg+e0oOato+WcqGhvdmVyU3RhZ2XkuK3vvIzogIzkuJTlvZPliY3pvKDmoIfov5jlnKh0YXJnZXTlhoUs5bCx5rKh5b+F6KaB5Y+W5qOA5rWL5pW05LiqZGlzcGxheUxpc3TkuoZcbiAgICAgICAgICAgIC8v5byA5Y+R5rS+5Y+R5bi46KeEbW91c2Vtb3Zl5LqL5Lu2XG4gICAgICAgICAgICBlLnRhcmdldCA9IGUuY3VycmVudFRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUucG9pbnQgID0gb2xkT2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb2JqID0gcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggcG9pbnQgLCAxKVswXTtcblxuICAgICAgICBpZihvbGRPYmogJiYgb2xkT2JqICE9IG9iaiB8fCBlLnR5cGU9PVwibW91c2VvdXRcIikge1xuICAgICAgICAgICAgaWYoIG9sZE9iaiAmJiBvbGRPYmouY29udGV4dCApe1xuICAgICAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldFswXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZS50eXBlICAgICA9IFwibW91c2VvdXRcIjtcbiAgICAgICAgICAgICAgICBlLnRvVGFyZ2V0ID0gb2JqOyBcbiAgICAgICAgICAgICAgICBlLnRhcmdldCAgID0gZS5jdXJyZW50VGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgICAgIGUucG9pbnQgICAgPSBvbGRPYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBvYmogJiYgb2xkT2JqICE9IG9iaiApeyAvLyYmIG9iai5faG92ZXJhYmxlIOW3sue7jyDlubLmjonkuoZcbiAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldFswXSA9IG9iajtcbiAgICAgICAgICAgIGUudHlwZSAgICAgICA9IFwibW91c2VvdmVyXCI7XG4gICAgICAgICAgICBlLmZyb21UYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICBlLnRhcmdldCAgICAgPSBlLmN1cnJlbnRUYXJnZXQgPSBvYmo7XG4gICAgICAgICAgICBlLnBvaW50ICAgICAgPSBvYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICYmIG9iaiApe1xuICAgICAgICAgICAgZS50YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICBlLnBvaW50ICA9IG9sZE9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgb2xkT2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWUuX2N1cnNvckhhbmRlciggb2JqICwgb2xkT2JqICk7XG4gICAgfSxcbiAgICBfY3Vyc29ySGFuZGVyICAgIDogZnVuY3Rpb24oIG9iaiAsIG9sZE9iaiApe1xuICAgICAgICBpZighb2JqICYmICFvbGRPYmogKXtcbiAgICAgICAgICAgIHRoaXMuX3NldEN1cnNvcihcImRlZmF1bHRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYob2JqICYmIG9sZE9iaiAhPSBvYmogJiYgb2JqLmNvbnRleHQpe1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yKG9iai5jb250ZXh0LmN1cnNvcik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9zZXRDdXJzb3IgOiBmdW5jdGlvbihjdXJzb3IpIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yID09IGN1cnNvcil7XG4gICAgICAgICAgLy/lpoLmnpzkuKTmrKHopoHorr7nva7nmoTpvKDmoIfnirbmgIHmmK/kuIDmoLfnmoRcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmF4LnZpZXcuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xuICAgICAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgfSxcbiAgICAvKlxuICAgICog5Y6f55Sf5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZW5kXG4gICAgKi9cblxuICAgIC8qXG4gICAgICrnrKzkuInmlrnlupPnmoTkuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICAq6Kem5bGP5LqL5Lu25aSE55CG5Ye95pWwXG4gICAgICogKi9cbiAgICBfX2xpYkhhbmRsZXIgOiBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgdmFyIG1lICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgcm9vdC51cGRhdGVWaWV3T2Zmc2V0KCk7XG4gICAgICAgIC8vIHRvdWNoIOS4i+eahCBjdXJQb2ludHNUYXJnZXQg5LuOdG91Y2hlc+S4readpVxuICAgICAgICAvL+iOt+WPlmNhbnZheOWdkOagh+ezu+e7n+mHjOmdoueahOWdkOagh1xuICAgICAgICBtZS5jdXJQb2ludHMgPSBtZS5fX2dldENhbnZheFBvaW50SW5Ub3VjaHMoIGUgKTtcbiAgICAgICAgaWYoICFtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgLy/lpoLmnpzlnKhkcmFnaW5n55qE6K+d77yMdGFyZ2V05bey57uP5piv6YCJ5Lit5LqG55qE77yM5Y+v5Lul5LiN55SoIOajgOa1i+S6hlxuICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0ID0gbWUuX19nZXRDaGlsZEluVG91Y2hzKCBtZS5jdXJQb2ludHMgKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIG1lLmN1clBvaW50c1RhcmdldC5sZW5ndGggPiAwICl7XG4gICAgICAgICAgICAvL2RyYWflvIDlp4tcbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5zdGFydCl7XG4gICAgICAgICAgICAgICAgLy9kcmFnc3RhcnTnmoTml7blgJl0b3VjaOW3sue7j+WHhuWkh+WlveS6hnRhcmdldO+8jCBjdXJQb2ludHNUYXJnZXQg6YeM6Z2i5Y+q6KaB5pyJ5LiA5Liq5piv5pyJ5pWI55qEXG4gICAgICAgICAgICAgICAgLy/lsLHorqTkuLpkcmFnc+W8gOWni1xuICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQgJiYgY2hpbGQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/lj6ropoHmnInkuIDkuKrlhYPntKDlsLHorqTkuLrmraPlnKjlh4blpIdkcmFn5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7lhYvpmobkuIDkuKrlia/mnKzliLBhY3RpdmVTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgICBtZS5fY2xvbmUyaG92ZXJTdGFnZSggY2hpbGQgLCBpICk7XG4gICAgICAgICAgICAgICAgICAgICAgIC8v5YWI5oqK5pys5bCK57uZ6ZqQ6JeP5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmZpcmUoXCJkcmFnc3RhcnRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApIFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9kcmFnSW5nXG4gICAgICAgICAgICBpZiggZS50eXBlID09IG1lLmRyYWcubW92ZSl7XG4gICAgICAgICAgICAgICAgaWYoIG1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkICYmIGNoaWxkLmRyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ01vdmVIYW5kZXIoIGUgLCBjaGlsZCAsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2RyYWfnu5PmnZ9cbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5lbmQpe1xuICAgICAgICAgICAgICAgIGlmKCBtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goIG1lLmN1clBvaW50c1RhcmdldCAsIGZ1bmN0aW9uKCBjaGlsZCAsIGkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZCAmJiBjaGlsZC5kcmFnRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnRW5kKCBlICwgY2hpbGQgLCAwICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZmlyZShcImRyYWdlbmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMoIGUgLCBtZS5jdXJQb2ludHNUYXJnZXQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5b2T5YmN5rKh5pyJ5LiA5LiqdGFyZ2V077yM5bCx5oqK5LqL5Lu25rS+5Y+R5YiwY2FudmF45LiK6Z2iXG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIFsgcm9vdCBdICk7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvL+S7jnRvdWNoc+S4reiOt+WPluWIsOWvueW6lHRvdWNoICwg5Zyo5LiK6Z2i5re75Yqg5LiKY2FudmF45Z2Q5qCH57O757uf55qEeO+8jHlcbiAgICBfX2dldENhbnZheFBvaW50SW5Ub3VjaHMgOiBmdW5jdGlvbiggZSApe1xuICAgICAgICB2YXIgbWUgICAgICAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgICAgICA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIGN1clRvdWNocyA9IFtdO1xuICAgICAgICBfLmVhY2goIGUucG9pbnQgLCBmdW5jdGlvbiggdG91Y2ggKXtcbiAgICAgICAgICAgY3VyVG91Y2hzLnB1c2goIHtcbiAgICAgICAgICAgICAgIHggOiBDYW52YXhFdmVudC5wYWdlWCggdG91Y2ggKSAtIHJvb3Qudmlld09mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgeSA6IENhbnZheEV2ZW50LnBhZ2VZKCB0b3VjaCApIC0gcm9vdC52aWV3T2Zmc2V0LnRvcFxuICAgICAgICAgICB9ICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY3VyVG91Y2hzO1xuICAgIH0sXG4gICAgX19nZXRDaGlsZEluVG91Y2hzIDogZnVuY3Rpb24oIHRvdWNocyApe1xuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgdG91Y2hlc1RhcmdldCA9IFtdO1xuICAgICAgICBfLmVhY2goIHRvdWNocyAsIGZ1bmN0aW9uKHRvdWNoKXtcbiAgICAgICAgICAgIHRvdWNoZXNUYXJnZXQucHVzaCggcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggdG91Y2ggLCAxKVswXSApO1xuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybiB0b3VjaGVzVGFyZ2V0O1xuICAgIH0sXG4gICAgLypcbiAgICAq56ys5LiJ5pa55bqT55qE5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYmVnaW5cbiAgICAqL1xuXG5cbiAgICAvKlxuICAgICAqQHBhcmFtIHthcnJheX0gY2hpbGRzIFxuICAgICAqICovXG4gICAgX19kaXNwYXRjaEV2ZW50SW5DaGlsZHM6IGZ1bmN0aW9uKGUsIGNoaWxkcykge1xuICAgICAgICBpZiAoIWNoaWxkcyAmJiAhKFwibGVuZ3RoXCIgaW4gY2hpbGRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciBoYXNDaGlsZCA9IGZhbHNlO1xuICAgICAgICBfLmVhY2goY2hpbGRzLCBmdW5jdGlvbihjaGlsZCwgaSkge1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgaGFzQ2hpbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBjZSA9IG5ldyBDYW52YXhFdmVudChlKTtcbiAgICAgICAgICAgICAgICBjZS50YXJnZXQgPSBjZS5jdXJyZW50VGFyZ2V0ID0gY2hpbGQgfHwgdGhpcztcbiAgICAgICAgICAgICAgICBjZS5zdGFnZVBvaW50ID0gbWUuY3VyUG9pbnRzW2ldO1xuICAgICAgICAgICAgICAgIGNlLnBvaW50ID0gY2UudGFyZ2V0Lmdsb2JhbFRvTG9jYWwoY2Uuc3RhZ2VQb2ludCk7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGlzcGF0Y2hFdmVudChjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaGFzQ2hpbGQ7XG4gICAgfSxcbiAgICAvL+WFi+mahuS4gOS4quWFg+e0oOWIsGhvdmVyIHN0YWdl5Lit5Y67XG4gICAgX2Nsb25lMmhvdmVyU3RhZ2U6IGZ1bmN0aW9uKHRhcmdldCwgaSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIF9kcmFnRHVwbGljYXRlID0gcm9vdC5fYnVmZmVyU3RhZ2UuZ2V0Q2hpbGRCeUlkKHRhcmdldC5pZCk7XG4gICAgICAgIGlmICghX2RyYWdEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgIF9kcmFnRHVwbGljYXRlID0gdGFyZ2V0LmNsb25lKHRydWUpO1xuICAgICAgICAgICAgX2RyYWdEdXBsaWNhdGUuX3RyYW5zZm9ybSA9IHRhcmdldC5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlRPRE86IOWboOS4uuWQjue7reWPr+iDveS8muacieaJi+WKqOa3u+WKoOeahCDlhYPntKDliLBfYnVmZmVyU3RhZ2Ug6YeM6Z2i5p2lXG4gICAgICAgICAgICAgKuavlOWmgnRpcHNcbiAgICAgICAgICAgICAq6L+Z57G75omL5Yqo5re75Yqg6L+b5p2l55qE6IKv5a6a5piv5Zug5Li66ZyA6KaB5pi+56S65Zyo5pyA5aSW5bGC55qE44CC5ZyoaG92ZXLlhYPntKDkuYvkuIrjgIJcbiAgICAgICAgICAgICAq5omA5pyJ6Ieq5Yqo5re75Yqg55qEaG92ZXLlhYPntKDpg73pu5jorqTmt7vliqDlnKhfYnVmZmVyU3RhZ2XnmoTmnIDlupXlsYJcbiAgICAgICAgICAgICAqKi9cbiAgICAgICAgICAgIHJvb3QuX2J1ZmZlclN0YWdlLmFkZENoaWxkQXQoX2RyYWdEdXBsaWNhdGUsIDApO1xuICAgICAgICB9XG4gICAgICAgIF9kcmFnRHVwbGljYXRlLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0YXJnZXQuX2dsb2JhbEFscGhhO1xuICAgICAgICB0YXJnZXQuX2RyYWdQb2ludCA9IHRhcmdldC5nbG9iYWxUb0xvY2FsKG1lLmN1clBvaW50c1tpXSk7XG4gICAgICAgIHJldHVybiBfZHJhZ0R1cGxpY2F0ZTtcbiAgICB9LFxuICAgIC8vZHJhZyDkuK0g55qE5aSE55CG5Ye95pWwXG4gICAgX2RyYWdNb3ZlSGFuZGVyOiBmdW5jdGlvbihlLCB0YXJnZXQsIGkpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBfcG9pbnQgPSB0YXJnZXQuZ2xvYmFsVG9Mb2NhbCggbWUuY3VyUG9pbnRzW2ldICk7XG5cbiAgICAgICAgLy/opoHlr7nlupTnmoTkv67mlLnmnKzlsIrnmoTkvY3nva7vvIzkvYbmmK/opoHlkYror4nlvJXmk47kuI3opoF3YXRjaOi/meS4quaXtuWAmeeahOWPmOWMllxuICAgICAgICB0YXJnZXQuX25vdFdhdGNoID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9tb3ZlU3RhZ2UgPSB0YXJnZXQubW92ZWluZztcbiAgICAgICAgdGFyZ2V0Lm1vdmVpbmcgPSB0cnVlO1xuICAgICAgICB0YXJnZXQuY29udGV4dC54ICs9IChfcG9pbnQueCAtIHRhcmdldC5fZHJhZ1BvaW50LngpO1xuICAgICAgICB0YXJnZXQuY29udGV4dC55ICs9IChfcG9pbnQueSAtIHRhcmdldC5fZHJhZ1BvaW50LnkpO1xuICAgICAgICB0YXJnZXQuZmlyZShcImRyYWdtb3ZlXCIpO1xuICAgICAgICB0YXJnZXQubW92ZWluZyA9IF9tb3ZlU3RhZ2U7XG4gICAgICAgIHRhcmdldC5fbm90V2F0Y2ggPSBmYWxzZTtcbiAgICAgICAgLy/lkIzmraXlrozmr5XmnKzlsIrnmoTkvY3nva5cblxuICAgICAgICAvL+i/memHjOWPquiDveebtOaOpeS/ruaUuV90cmFuc2Zvcm0g44CCIOS4jeiDveeUqOS4i+mdoueahOS/ruaUuXjvvIx555qE5pa55byP44CCXG4gICAgICAgIHZhciBfZHJhZ0R1cGxpY2F0ZSA9IHJvb3QuX2J1ZmZlclN0YWdlLmdldENoaWxkQnlJZCh0YXJnZXQuaWQpO1xuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5fdHJhbnNmb3JtID0gdGFyZ2V0LmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuICAgICAgICAvL+S7peS4uuebtOaOpeS/ruaUueeahF90cmFuc2Zvcm3kuI3kvJrlh7rlj5Hlv4Pot7PkuIrmiqXvvIwg5riy5p+T5byV5pOO5LiN5Yi25Yqo6L+Z5Liqc3RhZ2XpnIDopoHnu5jliLbjgIJcbiAgICAgICAgLy/miYDku6XopoHmiYvliqjlh7rlj5Hlv4Pot7PljIVcbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuaGVhcnRCZWF0KCk7XG4gICAgfSxcbiAgICAvL2RyYWfnu5PmnZ/nmoTlpITnkIblh73mlbBcbiAgICBfZHJhZ0VuZDogZnVuY3Rpb24oZSwgdGFyZ2V0LCBpKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuXG4gICAgICAgIC8vX2RyYWdEdXBsaWNhdGUg5aSN5Yi25ZyoX2J1ZmZlclN0YWdlIOS4reeahOWJr+acrFxuICAgICAgICB2YXIgX2RyYWdEdXBsaWNhdGUgPSByb290Ll9idWZmZXJTdGFnZS5nZXRDaGlsZEJ5SWQodGFyZ2V0LmlkKTtcbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuZGVzdHJveSgpO1xuXG4gICAgICAgIHRhcmdldC5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGFyZ2V0Ll9nbG9iYWxBbHBoYTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS6i+S7tueuoeeQhuexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOaehOmAoOWHveaVsC5cbiAqIEBuYW1lIEV2ZW50RGlzcGF0Y2hlclxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlcuexu+aYr+WPr+iwg+W6puS6i+S7tueahOexu+eahOWfuuexu++8jOWug+WFgeiuuOaYvuekuuWIl+ihqOS4iueahOS7u+S9leWvueixoemDveaYr+S4gOS4quS6i+S7tuebruagh+OAglxuICovXG52YXIgRXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgLy/kuovku7bmmKDlsITooajvvIzmoLzlvI/kuLrvvJp7dHlwZTE6W2xpc3RlbmVyMSwgbGlzdGVuZXIyXSwgdHlwZTI6W2xpc3RlbmVyMywgbGlzdGVuZXI0XX1cbiAgICB0aGlzLl9ldmVudE1hcCA9IHt9O1xufTtcblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZSA9IHsgXG4gICAgLypcbiAgICAgKiDms6jlhozkuovku7bkvqblkKzlmajlr7nosaHvvIzku6Xkvb/kvqblkKzlmajog73lpJ/mjqXmlLbkuovku7bpgJrnn6XjgIJcbiAgICAgKi9cbiAgICBfYWRkRXZlbnRMaXN0ZW5lciA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG5cbiAgICAgICAgaWYoIHR5cGVvZiBsaXN0ZW5lciAhPSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgICAgICAvL2xpc3RlbmVy5b+F6aG75piv5LiqZnVuY3Rpb27lkZDkurJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFkZFJlc3VsdCA9IHRydWU7XG4gICAgICAgIHZhciBzZWxmICAgICAgPSB0aGlzO1xuICAgICAgICBfLmVhY2goIHR5cGUuc3BsaXQoXCIgXCIpICwgZnVuY3Rpb24odHlwZSl7XG4gICAgICAgICAgICB2YXIgbWFwID0gc2VsZi5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgICAgICBpZighbWFwKXtcbiAgICAgICAgICAgICAgICBtYXAgPSBzZWxmLl9ldmVudE1hcFt0eXBlXSA9IFtdO1xuICAgICAgICAgICAgICAgIG1hcC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfLmluZGV4T2YobWFwICxsaXN0ZW5lcikgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBtYXAucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWRkUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYWRkUmVzdWx0O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXIgOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpIHJldHVybiB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUodHlwZSk7XG5cbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuICAgICAgICBpZighbWFwKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaSA9IG1hcFtpXTtcbiAgICAgICAgICAgIGlmKGxpID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIG1hcC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYobWFwLmxlbmd0aCAgICA9PSAwKSB7IFxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c6L+Z5Liq5aaC5p6c6L+Z5Liq5pe25YCZY2hpbGTmsqHmnInku7vkvZXkuovku7bkvqblkKxcbiAgICAgICAgICAgICAgICAgICAgaWYoXy5pc0VtcHR5KHRoaXMuX2V2ZW50TWFwKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOS4jeWGjeaOpeWPl+S6i+S7tueahOajgOa1i1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIoOmZpOaMh+Wumuexu+Wei+eahOaJgOacieS6i+S7tuS+puWQrOWZqOOAglxuICAgICAqL1xuICAgIF9yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlIDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIGlmKCFtYXApIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcblxuICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrlpoLmnpzov5nkuKrml7blgJljaGlsZOayoeacieS7u+S9leS6i+S7tuS+puWQrFxuICAgICAgICAgICAgaWYoXy5pc0VtcHR5KHRoaXMuX2V2ZW50TWFwKSl7XG4gICAgICAgICAgICAgICAgLy/pgqPkuYjor6XlhYPntKDkuI3lho3mjqXlj5fkuovku7bnmoTmo4DmtYtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5omA5pyJ5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUFsbEV2ZW50TGlzdGVuZXJzIDogZnVuY3Rpb24oKSB7XHRcbiAgICAgICAgdGhpcy5fZXZlbnRNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAqIOa0vuWPkeS6i+S7tu+8jOiwg+eUqOS6i+S7tuS+puWQrOWZqOOAglxuICAgICovXG4gICAgX2Rpc3BhdGNoRXZlbnQgOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFtlLnR5cGVdO1xuICAgICAgICBcbiAgICAgICAgaWYoIG1hcCApe1xuICAgICAgICAgICAgaWYoIWUudGFyZ2V0KSBlLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBtYXAgPSBtYXAuc2xpY2UoKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IG1hcFtpXTtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YobGlzdGVuZXIpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCAhZS5fc3RvcFByb3BhZ2F0aW9uICkge1xuICAgICAgICAgICAgLy/lkJHkuIrlhpLms6FcbiAgICAgICAgICAgIGlmKCB0aGlzLnBhcmVudCApe1xuICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldCA9IHRoaXMucGFyZW50O1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Ll9kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICAgKiDmo4Dmn6XmmK/lkKbkuLrmjIflrprkuovku7bnsbvlnovms6jlhozkuobku7vkvZXkvqblkKzlmajjgIJcbiAgICAgICAqL1xuICAgIF9oYXNFdmVudExpc3RlbmVyIDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIHJldHVybiBtYXAgIT0gbnVsbCAmJiBtYXAubGVuZ3RoID4gMDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50TWFuYWdlcjtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS6i+S7tua0vuWPkeexu1xuICovXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuL0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IENhbnZheEV2ZW50IGZyb20gXCIuL0NhbnZheEV2ZW50XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG5cbnZhciBFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbigpe1xuICAgIEV2ZW50RGlzcGF0Y2hlci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbmFtZSk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKEV2ZW50RGlzcGF0Y2hlciAsIEV2ZW50TWFuYWdlciAsIHtcbiAgICBvbiA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFkZEV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdW4gOiBmdW5jdGlvbih0eXBlLGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlOmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlKCB0eXBlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVBbGxFdmVudExpc3RlbmVyczpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9yZW1vdmVBbGxFdmVudExpc3RlbmVycygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy9wYXJhbXMg6KaB5Lyg57uZZXZ055qEZXZlbnRoYW5kbGVy5aSE55CG5Ye95pWw55qE5Y+C5pWw77yM5Lya6KKrbWVyZ2XliLBDYW52YXggZXZlbnTkuK1cbiAgICBmaXJlIDogZnVuY3Rpb24oZXZlbnRUeXBlICwgcGFyYW1zKXtcbiAgICAgICAgdmFyIGUgPSBuZXcgQ2FudmF4RXZlbnQoIGV2ZW50VHlwZSApO1xuXG4gICAgICAgIGlmKCBwYXJhbXMgKXtcbiAgICAgICAgICAgIGZvciggdmFyIHAgaW4gcGFyYW1zICl7XG4gICAgICAgICAgICAgICAgaWYoIHAgaW4gZSApe1xuICAgICAgICAgICAgICAgICAgICAvL3BhcmFtc+S4reeahOaVsOaNruS4jeiDveimhueblmV2ZW505bGe5oCnXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBwICsgXCLlsZ7mgKfkuI3og73opobnm5ZDYW52YXhFdmVudOWxnuaAp1wiIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlW3BdID0gcGFyYW1zW3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICBfLmVhY2goIGV2ZW50VHlwZS5zcGxpdChcIiBcIikgLCBmdW5jdGlvbihlVHlwZSl7XG4gICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQgPSBtZTtcbiAgICAgICAgICAgIG1lLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfSApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGRpc3BhdGNoRXZlbnQ6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAvL3RoaXMgaW5zdGFuY2VvZiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID09PiB0aGlzLmNoaWxkcmVuXG4gICAgICAgIC8vVE9ETzog6L+Z6YeMaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIg55qE6K+d77yM5ZyoZGlzcGxheU9iamVjdOmHjOmdoueahGltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4uL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuICAgICAgICAvL+S8muW+l+WIsOS4gOS4qnVuZGVmaW5lZO+8jOaEn+inieaYr+aIkOS6huS4gOS4quW+queOr+S+nei1lueahOmXrumimO+8jOaJgOS7pei/memHjOaNoueUqOeugOWNleeahOWIpOaWreadpeWIpOaWreiHquW3seaYr+S4gOS4quWuueaYk++8jOaLpeaciWNoaWxkcmVuXG4gICAgICAgIGlmKCB0aGlzLmNoaWxkcmVuICAmJiBldmVudC5wb2ludCApe1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIGV2ZW50LnBvaW50ICwgMSlbMF07XG4gICAgICAgICAgICBpZiggdGFyZ2V0ICl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmNvbnRleHQgJiYgZXZlbnQudHlwZSA9PSBcIm1vdXNlb3ZlclwiKXtcbiAgICAgICAgICAgIC8v6K6w5b2VZGlzcGF0Y2hFdmVudOS5i+WJjeeahOW/g+i3s1xuICAgICAgICAgICAgdmFyIHByZUhlYXJ0QmVhdCA9IHRoaXMuX2hlYXJ0QmVhdE51bTtcbiAgICAgICAgICAgIHZhciBwcmVnQWxwaGEgICAgPSB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgICAgICAgICAgaWYoIHByZUhlYXJ0QmVhdCAhPSB0aGlzLl9oZWFydEJlYXROdW0gKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3ZlckNsYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5ob3ZlckNsb25lICl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW52YXggPSB0aGlzLmdldFN0YWdlKCkucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjmNsb25l5LiA5Lu9b2Jq77yM5re75Yqg5YiwX2J1ZmZlclN0YWdlIOS4rVxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZTaGFwZSA9IHRoaXMuY2xvbmUodHJ1ZSk7ICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2U2hhcGUuX3RyYW5zZm9ybSA9IHRoaXMuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZheC5fYnVmZmVyU3RhZ2UuYWRkQ2hpbGRBdCggYWN0aXZTaGFwZSAsIDAgKTsgXG4gICAgICAgICAgICAgICAgICAgIC8v54S25ZCO5oqK6Ieq5bex6ZqQ6JeP5LqGXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dsb2JhbEFscGhhID0gcHJlZ0FscGhhO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuXG4gICAgICAgIGlmKCB0aGlzLmNvbnRleHQgJiYgZXZlbnQudHlwZSA9PSBcIm1vdXNlb3V0XCIpe1xuICAgICAgICAgICAgaWYodGhpcy5faG92ZXJDbGFzcyl7XG4gICAgICAgICAgICAgICAgLy/or7TmmI7liJrliJpvdmVy55qE5pe25YCZ5pyJ5re75Yqg5qC35byPXG4gICAgICAgICAgICAgICAgdmFyIGNhbnZheCA9IHRoaXMuZ2V0U3RhZ2UoKS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJDbGFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbnZheC5fYnVmZmVyU3RhZ2UucmVtb3ZlQ2hpbGRCeUlkKHRoaXMuaWQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCB0aGlzLl9nbG9iYWxBbHBoYSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLl9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2dsb2JhbEFscGhhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGFzRXZlbnQ6ZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgIH0sXG4gICAgaGFzRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc0V2ZW50TGlzdGVuZXIodHlwZSk7XG4gICAgfSxcbiAgICBob3ZlciA6IGZ1bmN0aW9uKCBvdmVyRnVuICwgb3V0RnVuICl7XG4gICAgICAgIHRoaXMub24oXCJtb3VzZW92ZXJcIiAsIG92ZXJGdW4pO1xuICAgICAgICB0aGlzLm9uKFwibW91c2VvdXRcIiAgLCBvdXRGdW4gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBvbmNlIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpe1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgb25jZUhhbmRsZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseShtZSAsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLnVuKHR5cGUgLCBvbmNlSGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vbih0eXBlICwgb25jZUhhbmRsZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBFdmVudERpc3BhdGNoZXI7XG4iLCJcbi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIE1hdHJpeCDnn6npmLXlupMg55So5LqO5pW05Liq57O757uf55qE5Yeg5L2V5Y+Y5o2i6K6h566XXG4gKiBjb2RlIGZyb20gaHR0cDovL2V2YW53LmdpdGh1Yi5pby9saWdodGdsLmpzL2RvY3MvbWF0cml4Lmh0bWxcbiAqL1xuXG52YXIgTWF0cml4ID0gZnVuY3Rpb24oYSwgYiwgYywgZCwgdHgsIHR5KXtcbiAgICB0aGlzLmEgPSBhICE9IHVuZGVmaW5lZCA/IGEgOiAxO1xuICAgIHRoaXMuYiA9IGIgIT0gdW5kZWZpbmVkID8gYiA6IDA7XG4gICAgdGhpcy5jID0gYyAhPSB1bmRlZmluZWQgPyBjIDogMDtcbiAgICB0aGlzLmQgPSBkICE9IHVuZGVmaW5lZCA/IGQgOiAxO1xuICAgIHRoaXMudHggPSB0eCAhPSB1bmRlZmluZWQgPyB0eCA6IDA7XG4gICAgdGhpcy50eSA9IHR5ICE9IHVuZGVmaW5lZCA/IHR5IDogMDtcbn07XG5cbk1hdHJpeC5wcm90b3R5cGUgPSB7XG4gICAgY29uY2F0IDogZnVuY3Rpb24obXR4KXtcbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIHZhciBjID0gdGhpcy5jO1xuICAgICAgICB2YXIgdHggPSB0aGlzLnR4O1xuXG4gICAgICAgIHRoaXMuYSA9IGEgKiBtdHguYSArIHRoaXMuYiAqIG10eC5jO1xuICAgICAgICB0aGlzLmIgPSBhICogbXR4LmIgKyB0aGlzLmIgKiBtdHguZDtcbiAgICAgICAgdGhpcy5jID0gYyAqIG10eC5hICsgdGhpcy5kICogbXR4LmM7XG4gICAgICAgIHRoaXMuZCA9IGMgKiBtdHguYiArIHRoaXMuZCAqIG10eC5kO1xuICAgICAgICB0aGlzLnR4ID0gdHggKiBtdHguYSArIHRoaXMudHkgKiBtdHguYyArIG10eC50eDtcbiAgICAgICAgdGhpcy50eSA9IHR4ICogbXR4LmIgKyB0aGlzLnR5ICogbXR4LmQgKyBtdHgudHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29uY2F0VHJhbnNmb3JtIDogZnVuY3Rpb24oeCwgeSwgc2NhbGVYLCBzY2FsZVksIHJvdGF0aW9uKXtcbiAgICAgICAgdmFyIGNvcyA9IDE7XG4gICAgICAgIHZhciBzaW4gPSAwO1xuICAgICAgICBpZihyb3RhdGlvbiUzNjApe1xuICAgICAgICAgICAgdmFyIHIgPSByb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhyKTtcbiAgICAgICAgICAgIHNpbiA9IE1hdGguc2luKHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25jYXQobmV3IE1hdHJpeChjb3Mqc2NhbGVYLCBzaW4qc2NhbGVYLCAtc2luKnNjYWxlWSwgY29zKnNjYWxlWSwgeCwgeSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJvdGF0ZSA6IGZ1bmN0aW9uKGFuZ2xlKXtcbiAgICAgICAgLy/nm67liY3lt7Lnu4/mj5Dkvpvlr7npobrml7bpkojpgIbml7bpkojkuKTkuKrmlrnlkJHml4vovaznmoTmlK/mjIFcbiAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG5cbiAgICAgICAgaWYgKGFuZ2xlPjApe1xuICAgICAgICAgICAgdGhpcy5hID0gYSAqIGNvcyAtIHRoaXMuYiAqIHNpbjtcbiAgICAgICAgICAgIHRoaXMuYiA9IGEgKiBzaW4gKyB0aGlzLmIgKiBjb3M7XG4gICAgICAgICAgICB0aGlzLmMgPSBjICogY29zIC0gdGhpcy5kICogc2luO1xuICAgICAgICAgICAgdGhpcy5kID0gYyAqIHNpbiArIHRoaXMuZCAqIGNvcztcbiAgICAgICAgICAgIHRoaXMudHggPSB0eCAqIGNvcyAtIHRoaXMudHkgKiBzaW47XG4gICAgICAgICAgICB0aGlzLnR5ID0gdHggKiBzaW4gKyB0aGlzLnR5ICogY29zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN0ID0gTWF0aC5zaW4oTWF0aC5hYnMoYW5nbGUpKTtcbiAgICAgICAgICAgIHZhciBjdCA9IE1hdGguY29zKE1hdGguYWJzKGFuZ2xlKSk7XG5cbiAgICAgICAgICAgIHRoaXMuYSA9IGEqY3QgKyB0aGlzLmIqc3Q7XG4gICAgICAgICAgICB0aGlzLmIgPSAtYSpzdCArIHRoaXMuYipjdDtcbiAgICAgICAgICAgIHRoaXMuYyA9IGMqY3QgKyB0aGlzLmQqc3Q7XG4gICAgICAgICAgICB0aGlzLmQgPSAtYypzdCArIGN0KnRoaXMuZDtcbiAgICAgICAgICAgIHRoaXMudHggPSBjdCp0eCArIHN0KnRoaXMudHk7XG4gICAgICAgICAgICB0aGlzLnR5ID0gY3QqdGhpcy50eSAtIHN0KnR4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2NhbGUgOiBmdW5jdGlvbihzeCwgc3kpe1xuICAgICAgICB0aGlzLmEgKj0gc3g7XG4gICAgICAgIHRoaXMuZCAqPSBzeTtcbiAgICAgICAgdGhpcy50eCAqPSBzeDtcbiAgICAgICAgdGhpcy50eSAqPSBzeTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB0cmFuc2xhdGUgOiBmdW5jdGlvbihkeCwgZHkpe1xuICAgICAgICB0aGlzLnR4ICs9IGR4O1xuICAgICAgICB0aGlzLnR5ICs9IGR5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGlkZW50aXR5IDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy/liJ3lp4vljJZcbiAgICAgICAgdGhpcy5hID0gdGhpcy5kID0gMTtcbiAgICAgICAgdGhpcy5iID0gdGhpcy5jID0gdGhpcy50eCA9IHRoaXMudHkgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGludmVydCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8v6YCG5ZCR55+p6Zi1XG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICB2YXIgYiA9IHRoaXMuYjtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICAgIHZhciBkID0gdGhpcy5kO1xuICAgICAgICB2YXIgdHggPSB0aGlzLnR4O1xuICAgICAgICB2YXIgaSA9IGEgKiBkIC0gYiAqIGM7XG5cbiAgICAgICAgdGhpcy5hID0gZCAvIGk7XG4gICAgICAgIHRoaXMuYiA9IC1iIC8gaTtcbiAgICAgICAgdGhpcy5jID0gLWMgLyBpO1xuICAgICAgICB0aGlzLmQgPSBhIC8gaTtcbiAgICAgICAgdGhpcy50eCA9IChjICogdGhpcy50eSAtIGQgKiB0eCkgLyBpO1xuICAgICAgICB0aGlzLnR5ID0gLShhICogdGhpcy50eSAtIGIgKiB0eCkgLyBpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsb25lIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgodGhpcy5hLCB0aGlzLmIsIHRoaXMuYywgdGhpcy5kLCB0aGlzLnR4LCB0aGlzLnR5KTtcbiAgICB9LFxuICAgIHRvQXJyYXkgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gWyB0aGlzLmEgLCB0aGlzLmIgLCB0aGlzLmMgLCB0aGlzLmQgLCB0aGlzLnR4ICwgdGhpcy50eSBdO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog55+p6Zi15bem5LmY5ZCR6YePXG4gICAgICovXG4gICAgbXVsVmVjdG9yIDogZnVuY3Rpb24odikge1xuICAgICAgICB2YXIgYWEgPSB0aGlzLmEsIGFjID0gdGhpcy5jLCBhdHggPSB0aGlzLnR4O1xuICAgICAgICB2YXIgYWIgPSB0aGlzLmIsIGFkID0gdGhpcy5kLCBhdHkgPSB0aGlzLnR5O1xuXG4gICAgICAgIHZhciBvdXQgPSBbMCwwXTtcbiAgICAgICAgb3V0WzBdID0gdlswXSAqIGFhICsgdlsxXSAqIGFjICsgYXR4O1xuICAgICAgICBvdXRbMV0gPSB2WzBdICogYWIgKyB2WzFdICogYWQgKyBhdHk7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9ICAgIFxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXRyaXg7XG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmlbDlraYg57G7XG4gKlxuICoqL1xuXG5cblxudmFyIF9jYWNoZSA9IHtcbiAgICBzaW4gOiB7fSwgICAgIC8vc2lu57yT5a2YXG4gICAgY29zIDoge30gICAgICAvL2Nvc+e8k+WtmFxufTtcbnZhciBfcmFkaWFucyA9IE1hdGguUEkgLyAxODA7XG5cbi8qKlxuICogQHBhcmFtIGFuZ2xlIOW8p+W6pu+8iOinkuW6pu+8ieWPguaVsFxuICogQHBhcmFtIGlzRGVncmVlcyBhbmdsZeWPguaVsOaYr+WQpuS4uuinkuW6puiuoeeul++8jOm7mOiupOS4umZhbHNl77yMYW5nbGXkuLrku6XlvKfluqborqHph4/nmoTop5LluqZcbiAqL1xuZnVuY3Rpb24gc2luKGFuZ2xlLCBpc0RlZ3JlZXMpIHtcbiAgICBhbmdsZSA9IChpc0RlZ3JlZXMgPyBhbmdsZSAqIF9yYWRpYW5zIDogYW5nbGUpLnRvRml4ZWQoNCk7XG4gICAgaWYodHlwZW9mIF9jYWNoZS5zaW5bYW5nbGVdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9jYWNoZS5zaW5bYW5nbGVdID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gX2NhY2hlLnNpblthbmdsZV07XG59XG5cbi8qKlxuICogQHBhcmFtIHJhZGlhbnMg5byn5bqm5Y+C5pWwXG4gKi9cbmZ1bmN0aW9uIGNvcyhhbmdsZSwgaXNEZWdyZWVzKSB7XG4gICAgYW5nbGUgPSAoaXNEZWdyZWVzID8gYW5nbGUgKiBfcmFkaWFucyA6IGFuZ2xlKS50b0ZpeGVkKDQpO1xuICAgIGlmKHR5cGVvZiBfY2FjaGUuY29zW2FuZ2xlXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBfY2FjaGUuY29zW2FuZ2xlXSA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICB9XG4gICAgcmV0dXJuIF9jYWNoZS5jb3NbYW5nbGVdO1xufVxuXG4vKipcbiAqIOinkuW6pui9rOW8p+W6plxuICogQHBhcmFtIHtPYmplY3R9IGFuZ2xlXG4gKi9cbmZ1bmN0aW9uIGRlZ3JlZVRvUmFkaWFuKGFuZ2xlKSB7XG4gICAgcmV0dXJuIGFuZ2xlICogX3JhZGlhbnM7XG59XG5cbi8qKlxuICog5byn5bqm6L2s6KeS5bqmXG4gKiBAcGFyYW0ge09iamVjdH0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gcmFkaWFuVG9EZWdyZWUoYW5nbGUpIHtcbiAgICByZXR1cm4gYW5nbGUgLyBfcmFkaWFucztcbn1cblxuLypcbiAqIOagoemqjOinkuW6puWIsDM2MOW6puWGhVxuICogQHBhcmFtIHthbmdsZX0gbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGRlZ3JlZVRvMzYwKCBhbmdsZSApIHtcbiAgICB2YXIgcmVBbmcgPSAoMzYwICsgIGFuZ2xlICAlIDM2MCkgJSAzNjA7Ly9NYXRoLmFicygzNjAgKyBNYXRoLmNlaWwoIGFuZ2xlICkgJSAzNjApICUgMzYwO1xuICAgIGlmKCByZUFuZyA9PSAwICYmIGFuZ2xlICE9PSAwICl7XG4gICAgICAgIHJlQW5nID0gMzYwXG4gICAgfVxuICAgIHJldHVybiByZUFuZztcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIFBJICA6IE1hdGguUEkgICxcbiAgICBzaW4gOiBzaW4gICAgICAsXG4gICAgY29zIDogY29zICAgICAgLFxuICAgIGRlZ3JlZVRvUmFkaWFuIDogZGVncmVlVG9SYWRpYW4sXG4gICAgcmFkaWFuVG9EZWdyZWUgOiByYWRpYW5Ub0RlZ3JlZSxcbiAgICBkZWdyZWVUbzM2MCAgICA6IGRlZ3JlZVRvMzYwICAgXG59O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICog54K55Ye75qOA5rWLIOexu1xuICogKi9cbmltcG9ydCBteU1hdGggZnJvbSBcIi4vTWF0aFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiDljIXlkKvliKTmlq1cbiAqIHNoYXBlIDog5Zu+5b2iXG4gKiB4IDog5qiq5Z2Q5qCHXG4gKiB5IDog57q15Z2Q5qCHXG4gKi9cbmZ1bmN0aW9uIGlzSW5zaWRlKHNoYXBlLCBwb2ludCkge1xuICAgIHZhciB4ID0gcG9pbnQueDtcbiAgICB2YXIgeSA9IHBvaW50Lnk7XG4gICAgaWYgKCFzaGFwZSB8fCAhc2hhcGUudHlwZSkge1xuICAgICAgICAvLyDml6Dlj4LmlbDmiJbkuI3mlK/mjIHnsbvlnotcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLy/mlbDlrabov5DnrpfvvIzkuLvopoHmmK9saW5l77yMYnJva2VuTGluZVxuICAgIHJldHVybiBfcG9pbnRJblNoYXBlKHNoYXBlLCB4LCB5KTtcbn07XG5cbmZ1bmN0aW9uIF9wb2ludEluU2hhcGUoc2hhcGUsIHgsIHkpIHtcbiAgICAvLyDlnKjnn6nlvaLlhoXliJnpg6jliIblm77lvaLpnIDopoHov5vkuIDmraXliKTmlq1cbiAgICBzd2l0Y2ggKHNoYXBlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbGluZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlTGluZShzaGFwZS5jb250ZXh0LCB4LCB5KTtcbiAgICAgICAgY2FzZSAnYnJva2VubGluZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlQnJva2VuTGluZShzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlQ2lyY2xlKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAnZWxsaXBzZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzUG9pbnRJbkVsaXBzZShzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3NlY3Rvcic6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlU2VjdG9yKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgIGNhc2UgJ2Ryb3BsZXQnOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZVBhdGgoc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgICAgY2FzZSAnaXNvZ29uJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIoc2hhcGUsIHgsIHkpO1xuICAgICAgICAgICAgLy9yZXR1cm4gX2lzSW5zaWRlUG9seWdvbl9Dcm9zc2luZ051bWJlcihzaGFwZSwgeCwgeSk7XG4gICAgfVxufTtcbi8qKlxuICogIWlzSW5zaWRlXG4gKi9cbmZ1bmN0aW9uIGlzT3V0c2lkZShzaGFwZSwgeCwgeSkge1xuICAgIHJldHVybiAhaXNJbnNpZGUoc2hhcGUsIHgsIHkpO1xufTtcblxuLyoqXG4gKiDnur/mrrXljIXlkKvliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlTGluZShjb250ZXh0LCB4LCB5KSB7XG4gICAgdmFyIHgwID0gY29udGV4dC54U3RhcnQ7XG4gICAgdmFyIHkwID0gY29udGV4dC55U3RhcnQ7XG4gICAgdmFyIHgxID0gY29udGV4dC54RW5kO1xuICAgIHZhciB5MSA9IGNvbnRleHQueUVuZDtcbiAgICB2YXIgX2wgPSBNYXRoLm1heChjb250ZXh0LmxpbmVXaWR0aCAsIDMpO1xuICAgIHZhciBfYSA9IDA7XG4gICAgdmFyIF9iID0geDA7XG5cbiAgICBpZihcbiAgICAgICAgKHkgPiB5MCArIF9sICYmIHkgPiB5MSArIF9sKSBcbiAgICAgICAgfHwgKHkgPCB5MCAtIF9sICYmIHkgPCB5MSAtIF9sKSBcbiAgICAgICAgfHwgKHggPiB4MCArIF9sICYmIHggPiB4MSArIF9sKSBcbiAgICAgICAgfHwgKHggPCB4MCAtIF9sICYmIHggPCB4MSAtIF9sKSBcbiAgICApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHgwICE9PSB4MSkge1xuICAgICAgICBfYSA9ICh5MCAtIHkxKSAvICh4MCAtIHgxKTtcbiAgICAgICAgX2IgPSAoeDAgKiB5MSAtIHgxICogeTApIC8gKHgwIC0geDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyh4IC0geDApIDw9IF9sIC8gMjtcbiAgICB9XG5cbiAgICB2YXIgX3MgPSAoX2EgKiB4IC0geSArIF9iKSAqIChfYSAqIHggLSB5ICsgX2IpIC8gKF9hICogX2EgKyAxKTtcbiAgICByZXR1cm4gX3MgPD0gX2wgLyAyICogX2wgLyAyO1xufTtcblxuZnVuY3Rpb24gX2lzSW5zaWRlQnJva2VuTGluZShzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICB2YXIgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XG4gICAgdmFyIGxpbmVBcmVhO1xuICAgIHZhciBpbnNpZGVDYXRjaCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcG9pbnRMaXN0Lmxlbmd0aCAtIDE7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgbGluZUFyZWEgPSB7XG4gICAgICAgICAgICB4U3RhcnQ6IHBvaW50TGlzdFtpXVswXSxcbiAgICAgICAgICAgIHlTdGFydDogcG9pbnRMaXN0W2ldWzFdLFxuICAgICAgICAgICAgeEVuZDogcG9pbnRMaXN0W2kgKyAxXVswXSxcbiAgICAgICAgICAgIHlFbmQ6IHBvaW50TGlzdFtpICsgMV1bMV0sXG4gICAgICAgICAgICBsaW5lV2lkdGg6IGNvbnRleHQubGluZVdpZHRoXG4gICAgICAgIH07XG4gICAgICAgIGlmICghX2lzSW5zaWRlUmVjdGFuZ2xlKHtcbiAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5taW4obGluZUFyZWEueFN0YXJ0LCBsaW5lQXJlYS54RW5kKSAtIGxpbmVBcmVhLmxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5taW4obGluZUFyZWEueVN0YXJ0LCBsaW5lQXJlYS55RW5kKSAtIGxpbmVBcmVhLmxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IE1hdGguYWJzKGxpbmVBcmVhLnhTdGFydCAtIGxpbmVBcmVhLnhFbmQpICsgbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGxpbmVBcmVhLnlTdGFydCAtIGxpbmVBcmVhLnlFbmQpICsgbGluZUFyZWEubGluZVdpZHRoXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB4LCB5XG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAvLyDkuI3lnKjnn6nlvaLljLrlhoXot7Pov4dcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGluc2lkZUNhdGNoID0gX2lzSW5zaWRlTGluZShsaW5lQXJlYSwgeCwgeSk7XG4gICAgICAgIGlmIChpbnNpZGVDYXRjaCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc2lkZUNhdGNoO1xufTtcblxuXG4vKipcbiAqIOefqeW9ouWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVSZWN0YW5nbGUoc2hhcGUsIHgsIHkpIHtcbiAgICBpZiAoeCA+PSBzaGFwZS54ICYmIHggPD0gKHNoYXBlLnggKyBzaGFwZS53aWR0aCkgJiYgeSA+PSBzaGFwZS55ICYmIHkgPD0gKHNoYXBlLnkgKyBzaGFwZS5oZWlnaHQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIOWchuW9ouWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHksIHIpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQ7XG4gICAgIXIgJiYgKHIgPSBjb250ZXh0LnIpO1xuICAgIHIrPWNvbnRleHQubGluZVdpZHRoO1xuICAgIHJldHVybiAoeCAqIHggKyB5ICogeSkgPCByICogcjtcbn07XG5cbi8qKlxuICog5omH5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZVNlY3RvcihzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dFxuICAgIGlmICghX2lzSW5zaWRlQ2lyY2xlKHNoYXBlLCB4LCB5KSB8fCAoY29udGV4dC5yMCA+IDAgJiYgX2lzSW5zaWRlQ2lyY2xlKHNoYXBlLCB4LCB5LCBjb250ZXh0LnIwKSkpIHtcbiAgICAgICAgLy8g5aSn5ZyG5aSW5oiW6ICF5bCP5ZyG5YaF55u05o6lZmFsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIOWIpOaWreWkueinklxuICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LnN0YXJ0QW5nbGUpOyAvLyDotbflp4vop5LluqZbMCwzNjApXG4gICAgICAgIHZhciBlbmRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LmVuZEFuZ2xlKTsgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxuXG4gICAgICAgIC8v6K6h566X6K+l54K55omA5Zyo55qE6KeS5bqmXG4gICAgICAgIHZhciBhbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MCgoTWF0aC5hdGFuMih5LCB4KSAvIE1hdGguUEkgKiAxODApICUgMzYwKTtcblxuICAgICAgICB2YXIgcmVnSW4gPSB0cnVlOyAvL+WmguaenOWcqHN0YXJ05ZKMZW5k55qE5pWw5YC85Lit77yMZW5k5aSn5LqOc3RhcnTogIzkuJTmmK/pobrml7bpkojliJlyZWdJbuS4unRydWVcbiAgICAgICAgaWYgKChzdGFydEFuZ2xlID4gZW5kQW5nbGUgJiYgIWNvbnRleHQuY2xvY2t3aXNlKSB8fCAoc3RhcnRBbmdsZSA8IGVuZEFuZ2xlICYmIGNvbnRleHQuY2xvY2t3aXNlKSkge1xuICAgICAgICAgICAgcmVnSW4gPSBmYWxzZTsgLy9vdXRcbiAgICAgICAgfVxuICAgICAgICAvL+W6pueahOiMg+WbtO+8jOS7juWwj+WIsOWkp1xuICAgICAgICB2YXIgcmVnQW5nbGUgPSBbXG4gICAgICAgICAgICBNYXRoLm1pbihzdGFydEFuZ2xlLCBlbmRBbmdsZSksXG4gICAgICAgICAgICBNYXRoLm1heChzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgaW5BbmdsZVJlZyA9IGFuZ2xlID4gcmVnQW5nbGVbMF0gJiYgYW5nbGUgPCByZWdBbmdsZVsxXTtcbiAgICAgICAgcmV0dXJuIChpbkFuZ2xlUmVnICYmIHJlZ0luKSB8fCAoIWluQW5nbGVSZWcgJiYgIXJlZ0luKTtcbiAgICB9XG59O1xuXG4vKlxuICrmpK3lnIbljIXlkKvliKTmlq1cbiAqICovXG5mdW5jdGlvbiBfaXNQb2ludEluRWxpcHNlKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBjZW50ZXIgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8veOWNiuW+hFxuICAgIHZhciBYUmFkaXVzID0gY29udGV4dC5ocjtcbiAgICB2YXIgWVJhZGl1cyA9IGNvbnRleHQudnI7XG5cbiAgICB2YXIgcCA9IHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgIH07XG5cbiAgICB2YXIgaVJlcztcblxuICAgIHAueCAtPSBjZW50ZXIueDtcbiAgICBwLnkgLT0gY2VudGVyLnk7XG5cbiAgICBwLnggKj0gcC54O1xuICAgIHAueSAqPSBwLnk7XG5cbiAgICBYUmFkaXVzICo9IFhSYWRpdXM7XG4gICAgWVJhZGl1cyAqPSBZUmFkaXVzO1xuXG4gICAgaVJlcyA9IFlSYWRpdXMgKiBwLnggKyBYUmFkaXVzICogcC55IC0gWFJhZGl1cyAqIFlSYWRpdXM7XG5cbiAgICByZXR1cm4gKGlSZXMgPCAwKTtcbn07XG5cbi8qKlxuICog5aSa6L655b2i5YyF5ZCr5Yik5patIE5vbnplcm8gV2luZGluZyBOdW1iZXIgUnVsZVxuICovXG5cbmZ1bmN0aW9uIF9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcihzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dCA/IHNoYXBlLmNvbnRleHQgOiBzaGFwZTtcbiAgICB2YXIgcG9seSA9IF8uY2xvbmUoY29udGV4dC5wb2ludExpc3QpOyAvL3BvbHkg5aSa6L655b2i6aG254K577yM5pWw57uE5oiQ5ZGY55qE5qC85byP5ZCMIHBcbiAgICBwb2x5LnB1c2gocG9seVswXSk7IC8v6K6w5b6X6KaB6Zet5ZCIXG4gICAgdmFyIHduID0gMDtcbiAgICBmb3IgKHZhciBzaGlmdFAsIHNoaWZ0ID0gcG9seVswXVsxXSA+IHksIGkgPSAxOyBpIDwgcG9seS5sZW5ndGg7IGkrKykge1xuICAgICAgICAvL+WFiOWBmue6v+eahOajgOa1i++8jOWmguaenOaYr+WcqOS4pOeCueeahOe6v+S4iu+8jOWwseiCr+WumuaYr+WcqOiupOS4uuWcqOWbvuW9ouS4ilxuICAgICAgICB2YXIgaW5MaW5lID0gX2lzSW5zaWRlTGluZSh7XG4gICAgICAgICAgICB4U3RhcnQgOiBwb2x5W2ktMV1bMF0sXG4gICAgICAgICAgICB5U3RhcnQgOiBwb2x5W2ktMV1bMV0sXG4gICAgICAgICAgICB4RW5kICAgOiBwb2x5W2ldWzBdLFxuICAgICAgICAgICAgeUVuZCAgIDogcG9seVtpXVsxXSxcbiAgICAgICAgICAgIGxpbmVXaWR0aCA6IChjb250ZXh0LmxpbmVXaWR0aCB8fCAxKVxuICAgICAgICB9ICwgeCAsIHkpO1xuICAgICAgICBpZiAoIGluTGluZSApe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIC8v5aaC5p6c5pyJZmlsbFN0eWxlIO+8jCDpgqPkuYjogq/lrprpnIDopoHlgZrpnaLnmoTmo4DmtYtcbiAgICAgICAgaWYgKGNvbnRleHQuZmlsbFN0eWxlKSB7XG4gICAgICAgICAgICBzaGlmdFAgPSBzaGlmdDtcbiAgICAgICAgICAgIHNoaWZ0ID0gcG9seVtpXVsxXSA+IHk7XG4gICAgICAgICAgICBpZiAoc2hpZnRQICE9IHNoaWZ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSAoc2hpZnRQID8gMSA6IDApIC0gKHNoaWZ0ID8gMSA6IDApO1xuICAgICAgICAgICAgICAgIGlmIChuICogKChwb2x5W2kgLSAxXVswXSAtIHgpICogKHBvbHlbaV1bMV0gLSB5KSAtIChwb2x5W2kgLSAxXVsxXSAtIHkpICogKHBvbHlbaV1bMF0gLSB4KSkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHduICs9IG47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHduO1xufTtcblxuLyoqXG4gKiDot6/lvoTljIXlkKvliKTmlq3vvIzkvp3otZblpJrovrnlvaLliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlUGF0aChzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICB2YXIgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XG4gICAgdmFyIGluc2lkZUNhdGNoID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGluc2lkZUNhdGNoID0gX2lzSW5zaWRlUG9seWdvbl9XaW5kaW5nTnVtYmVyKHtcbiAgICAgICAgICAgIHBvaW50TGlzdDogcG9pbnRMaXN0W2ldLFxuICAgICAgICAgICAgbGluZVdpZHRoOiBjb250ZXh0LmxpbmVXaWR0aCxcbiAgICAgICAgICAgIGZpbGxTdHlsZTogY29udGV4dC5maWxsU3R5bGVcbiAgICAgICAgfSwgeCwgeSk7XG4gICAgICAgIGlmIChpbnNpZGVDYXRjaCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc2lkZUNhdGNoO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGlzSW5zaWRlOiBpc0luc2lkZSxcbiAgICBpc091dHNpZGU6IGlzT3V0c2lkZVxufTsiLCJpbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIFR3ZWVuLmpzIC0gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdlZW5qcy90d2Vlbi5qc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdlZW5qcy90d2Vlbi5qcy9ncmFwaHMvY29udHJpYnV0b3JzIGZvciB0aGUgZnVsbCBsaXN0IG9mIGNvbnRyaWJ1dG9ycy5cbiAqIFRoYW5rIHlvdSBhbGwsIHlvdSdyZSBhd2Vzb21lIVxuICovXG5cbiB2YXIgVFdFRU4gPSBUV0VFTiB8fCAoZnVuY3Rpb24gKCkge1xuXG4gXHR2YXIgX3R3ZWVucyA9IFtdO1xuXG4gXHRyZXR1cm4ge1xuXG4gXHRcdGdldEFsbDogZnVuY3Rpb24gKCkge1xuXG4gXHRcdFx0cmV0dXJuIF90d2VlbnM7XG5cbiBcdFx0fSxcblxuIFx0XHRyZW1vdmVBbGw6IGZ1bmN0aW9uICgpIHtcblxuIFx0XHRcdF90d2VlbnMgPSBbXTtcblxuIFx0XHR9LFxuXG4gXHRcdGFkZDogZnVuY3Rpb24gKHR3ZWVuKSB7XG5cbiBcdFx0XHRfdHdlZW5zLnB1c2godHdlZW4pO1xuXG4gXHRcdH0sXG5cbiBcdFx0cmVtb3ZlOiBmdW5jdGlvbiAodHdlZW4pIHtcblxuXHRcdFx0dmFyIGkgPSBfLmluZGV4T2YoIF90d2VlbnMgLCB0d2VlbiApOy8vX3R3ZWVucy5pbmRleE9mKHR3ZWVuKTtcblxuXHRcdFx0aWYgKGkgIT09IC0xKSB7XG5cdFx0XHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKHRpbWUsIHByZXNlcnZlKSB7XG5cblx0XHRcdGlmIChfdHdlZW5zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0dGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiBUV0VFTi5ub3coKTtcblxuXHRcdFx0d2hpbGUgKGkgPCBfdHdlZW5zLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgLyogb2xkIFxuXHRcdFx0XHRpZiAoX3R3ZWVuc1tpXS51cGRhdGUodGltZSkgfHwgcHJlc2VydmUpIHtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3R3ZWVucy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ki9cblxuICAgICAgICAgICAgICAgIC8vbmV3IGNvZGVcbiAgICAgICAgICAgICAgICAvL2luIHJlYWwgd29ybGQsIHR3ZWVuLnVwZGF0ZSBoYXMgY2hhbmNlIHRvIHJlbW92ZSBpdHNlbGYsIHNvIHdlIGhhdmUgdG8gaGFuZGxlIHRoaXMgc2l0dWF0aW9uLlxuICAgICAgICAgICAgICAgIC8vaW4gY2VydGFpbiBjYXNlcywgb25VcGRhdGVDYWxsYmFjayB3aWxsIHJlbW92ZSBpbnN0YW5jZXMgaW4gX3R3ZWVucywgd2hpY2ggbWFrZSBfdHdlZW5zLnNwbGljZShpLCAxKSBmYWlsXG4gICAgICAgICAgICAgICAgLy9AbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tXG4gICAgICAgICAgICAgICAgdmFyIF90ID0gX3R3ZWVuc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgX3VwZGF0ZVJlcyA9IF90LnVwZGF0ZSh0aW1lKTtcblxuICAgICAgICAgICAgICAgIGlmKCAhX3R3ZWVuc1tpXSApe1xuICAgICAgICAgICAgICAgIFx0YnJlYWs7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoIF90ID09PSBfdHdlZW5zW2ldICkge1xuICAgICAgICAgICAgICAgIFx0aWYgKCBfdXBkYXRlUmVzIHx8IHByZXNlcnZlICkge1xuICAgICAgICAgICAgICAgIFx0XHRpKys7XG4gICAgICAgICAgICAgICAgXHR9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBcdH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbn0pKCk7XG5cblxuLy8gSW5jbHVkZSBhIHBlcmZvcm1hbmNlLm5vdyBwb2x5ZmlsbC5cbi8vIEluIG5vZGUuanMsIHVzZSBwcm9jZXNzLmhydGltZS5cbmlmICh0eXBlb2YgKHdpbmRvdykgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiAocHJvY2VzcykgIT09ICd1bmRlZmluZWQnKSB7XG5cdFRXRUVOLm5vdyA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cblx0XHQvLyBDb252ZXJ0IFtzZWNvbmRzLCBuYW5vc2Vjb25kc10gdG8gbWlsbGlzZWNvbmRzLlxuXHRcdHJldHVybiB0aW1lWzBdICogMTAwMCArIHRpbWVbMV0gLyAxMDAwMDAwO1xuXHR9O1xufVxuLy8gSW4gYSBicm93c2VyLCB1c2Ugd2luZG93LnBlcmZvcm1hbmNlLm5vdyBpZiBpdCBpcyBhdmFpbGFibGUuXG5lbHNlIGlmICh0eXBlb2YgKHdpbmRvdykgIT09ICd1bmRlZmluZWQnICYmXG5cdHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gdW5kZWZpbmVkICYmXG5cdHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCkge1xuXHQvLyBUaGlzIG11c3QgYmUgYm91bmQsIGJlY2F1c2UgZGlyZWN0bHkgYXNzaWduaW5nIHRoaXMgZnVuY3Rpb25cblx0Ly8gbGVhZHMgdG8gYW4gaW52b2NhdGlvbiBleGNlcHRpb24gaW4gQ2hyb21lLlxuXHRUV0VFTi5ub3cgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93LmJpbmQod2luZG93LnBlcmZvcm1hbmNlKTtcbn1cbi8vIFVzZSBEYXRlLm5vdyBpZiBpdCBpcyBhdmFpbGFibGUuXG5lbHNlIGlmIChEYXRlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XG5cdFRXRUVOLm5vdyA9IERhdGUubm93O1xufVxuLy8gT3RoZXJ3aXNlLCB1c2UgJ25ldyBEYXRlKCkuZ2V0VGltZSgpJy5cbmVsc2Uge1xuXHRUV0VFTi5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHR9O1xufVxuXG5cblRXRUVOLlR3ZWVuID0gZnVuY3Rpb24gKG9iamVjdCkge1xuXG5cdHZhciBfb2JqZWN0ID0gb2JqZWN0O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0ID0ge307XG5cdHZhciBfdmFsdWVzRW5kID0ge307XG5cdHZhciBfdmFsdWVzU3RhcnRSZXBlYXQgPSB7fTtcblx0dmFyIF9kdXJhdGlvbiA9IDEwMDA7XG5cdHZhciBfcmVwZWF0ID0gMDtcblx0dmFyIF9yZXBlYXREZWxheVRpbWU7XG5cdHZhciBfeW95byA9IGZhbHNlO1xuXHR2YXIgX2lzUGxheWluZyA9IGZhbHNlO1xuXHR2YXIgX3JldmVyc2VkID0gZmFsc2U7XG5cdHZhciBfZGVsYXlUaW1lID0gMDtcblx0dmFyIF9zdGFydFRpbWUgPSBudWxsO1xuXHR2YXIgX2Vhc2luZ0Z1bmN0aW9uID0gVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lO1xuXHR2YXIgX2ludGVycG9sYXRpb25GdW5jdGlvbiA9IFRXRUVOLkludGVycG9sYXRpb24uTGluZWFyO1xuXHR2YXIgX2NoYWluZWRUd2VlbnMgPSBbXTtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cdHZhciBfb25VcGRhdGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25Db21wbGV0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0b3BDYWxsYmFjayA9IG51bGw7XG5cblx0dGhpcy50byA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBkdXJhdGlvbikge1xuXG5cdFx0X3ZhbHVlc0VuZCA9IHByb3BlcnRpZXM7XG5cblx0XHRpZiAoZHVyYXRpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0X2R1cmF0aW9uID0gZHVyYXRpb247XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKHRpbWUpIHtcblxuXHRcdFRXRUVOLmFkZCh0aGlzKTtcblxuXHRcdF9pc1BsYXlpbmcgPSB0cnVlO1xuXG5cdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cblx0XHRfc3RhcnRUaW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6IFRXRUVOLm5vdygpO1xuXHRcdF9zdGFydFRpbWUgKz0gX2RlbGF5VGltZTtcblxuXHRcdGZvciAodmFyIHByb3BlcnR5IGluIF92YWx1ZXNFbmQpIHtcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgYW4gQXJyYXkgd2FzIHByb3ZpZGVkIGFzIHByb3BlcnR5IHZhbHVlXG5cdFx0XHRpZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBBcnJheSkge1xuXG5cdFx0XHRcdGlmIChfdmFsdWVzRW5kW3Byb3BlcnR5XS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENyZWF0ZSBhIGxvY2FsIGNvcHkgb2YgdGhlIEFycmF5IHdpdGggdGhlIHN0YXJ0IHZhbHVlIGF0IHRoZSBmcm9udFxuXHRcdFx0XHRfdmFsdWVzRW5kW3Byb3BlcnR5XSA9IFtfb2JqZWN0W3Byb3BlcnR5XV0uY29uY2F0KF92YWx1ZXNFbmRbcHJvcGVydHldKTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBgdG8oKWAgc3BlY2lmaWVzIGEgcHJvcGVydHkgdGhhdCBkb2Vzbid0IGV4aXN0IGluIHRoZSBzb3VyY2Ugb2JqZWN0LFxuXHRcdFx0Ly8gd2Ugc2hvdWxkIG5vdCBzZXQgdGhhdCBwcm9wZXJ0eSBpbiB0aGUgb2JqZWN0XG5cdFx0XHRpZiAoX29iamVjdFtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2F2ZSB0aGUgc3RhcnRpbmcgdmFsdWUuXG5cdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldID0gX29iamVjdFtwcm9wZXJ0eV07XG5cblx0XHRcdGlmICgoX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0X3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSAqPSAxLjA7IC8vIEVuc3VyZXMgd2UncmUgdXNpbmcgbnVtYmVycywgbm90IHN0cmluZ3Ncblx0XHRcdH1cblxuXHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gfHwgMDtcblxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCFfaXNQbGF5aW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRUV0VFTi5yZW1vdmUodGhpcyk7XG5cdFx0X2lzUGxheWluZyA9IGZhbHNlO1xuXG5cdFx0aWYgKF9vblN0b3BDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0X29uU3RvcENhbGxiYWNrLmNhbGwoX29iamVjdCwgX29iamVjdCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucygpO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5lbmQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR0aGlzLnVwZGF0ZShfc3RhcnRUaW1lICsgX2R1cmF0aW9uKTtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcENoYWluZWRUd2VlbnMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRmb3IgKHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKykge1xuXHRcdFx0X2NoYWluZWRUd2VlbnNbaV0uc3RvcCgpO1xuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuZGVsYXkgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG5cblx0XHRfZGVsYXlUaW1lID0gYW1vdW50O1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXQgPSBmdW5jdGlvbiAodGltZXMpIHtcblxuXHRcdF9yZXBlYXQgPSB0aW1lcztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMucmVwZWF0RGVsYXkgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG5cblx0XHRfcmVwZWF0RGVsYXlUaW1lID0gYW1vdW50O1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy55b3lvID0gZnVuY3Rpb24gKHlveW8pIHtcblxuXHRcdF95b3lvID0geW95bztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cblx0dGhpcy5lYXNpbmcgPSBmdW5jdGlvbiAoZWFzaW5nKSB7XG5cblx0XHRfZWFzaW5nRnVuY3Rpb24gPSBlYXNpbmc7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmludGVycG9sYXRpb24gPSBmdW5jdGlvbiAoaW50ZXJwb2xhdGlvbikge1xuXG5cdFx0X2ludGVycG9sYXRpb25GdW5jdGlvbiA9IGludGVycG9sYXRpb247XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmNoYWluID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2NoYWluZWRUd2VlbnMgPSBhcmd1bWVudHM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RhcnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25VcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uQ29tcGxldGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdG9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25TdG9wQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcblxuXHRcdHZhciBwcm9wZXJ0eTtcblx0XHR2YXIgZWxhcHNlZDtcblx0XHR2YXIgdmFsdWU7XG5cblx0XHRpZiAodGltZSA8IF9zdGFydFRpbWUpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChfb25TdGFydENhbGxiYWNrRmlyZWQgPT09IGZhbHNlKSB7XG5cblx0XHRcdGlmIChfb25TdGFydENhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRcdF9vblN0YXJ0Q2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRlbGFwc2VkID0gKHRpbWUgLSBfc3RhcnRUaW1lKSAvIF9kdXJhdGlvbjtcblx0XHRlbGFwc2VkID0gZWxhcHNlZCA+IDEgPyAxIDogZWxhcHNlZDtcblxuXHRcdHZhbHVlID0gX2Vhc2luZ0Z1bmN0aW9uKGVsYXBzZWQpO1xuXG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kKSB7XG5cblx0XHRcdC8vIERvbid0IHVwZGF0ZSBwcm9wZXJ0aWVzIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBzb3VyY2Ugb2JqZWN0XG5cdFx0XHRpZiAoX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc3RhcnQgPSBfdmFsdWVzU3RhcnRbcHJvcGVydHldIHx8IDA7XG5cdFx0XHR2YXIgZW5kID0gX3ZhbHVlc0VuZFtwcm9wZXJ0eV07XG5cblx0XHRcdGlmIChlbmQgaW5zdGFuY2VvZiBBcnJheSkge1xuXG5cdFx0XHRcdF9vYmplY3RbcHJvcGVydHldID0gX2ludGVycG9sYXRpb25GdW5jdGlvbihlbmQsIHZhbHVlKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBQYXJzZXMgcmVsYXRpdmUgZW5kIHZhbHVlcyB3aXRoIHN0YXJ0IGFzIGJhc2UgKGUuZy46ICsxMCwgLTMpXG5cdFx0XHRcdGlmICh0eXBlb2YgKGVuZCkgPT09ICdzdHJpbmcnKSB7XG5cblx0XHRcdFx0XHRpZiAoZW5kLmNoYXJBdCgwKSA9PT0gJysnIHx8IGVuZC5jaGFyQXQoMCkgPT09ICctJykge1xuXHRcdFx0XHRcdFx0ZW5kID0gc3RhcnQgKyBwYXJzZUZsb2F0KGVuZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGVuZCA9IHBhcnNlRmxvYXQoZW5kKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBQcm90ZWN0IGFnYWluc3Qgbm9uIG51bWVyaWMgcHJvcGVydGllcy5cblx0XHRcdFx0aWYgKHR5cGVvZiAoZW5kKSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHRfb2JqZWN0W3Byb3BlcnR5XSA9IHN0YXJ0ICsgKGVuZCAtIHN0YXJ0KSAqIHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmIChfb25VcGRhdGVDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0X29uVXBkYXRlQ2FsbGJhY2suY2FsbChfb2JqZWN0LCB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKGVsYXBzZWQgPT09IDEpIHtcblxuXHRcdFx0aWYgKF9yZXBlYXQgPiAwKSB7XG5cblx0XHRcdFx0aWYgKGlzRmluaXRlKF9yZXBlYXQpKSB7XG5cdFx0XHRcdFx0X3JlcGVhdC0tO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVhc3NpZ24gc3RhcnRpbmcgdmFsdWVzLCByZXN0YXJ0IGJ5IG1ha2luZyBzdGFydFRpbWUgPSBub3dcblx0XHRcdFx0Zm9yIChwcm9wZXJ0eSBpbiBfdmFsdWVzU3RhcnRSZXBlYXQpIHtcblxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKF92YWx1ZXNFbmRbcHJvcGVydHldKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldICsgcGFyc2VGbG9hdChfdmFsdWVzRW5kW3Byb3BlcnR5XSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcblxuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNFbmRbcHJvcGVydHldO1xuXHRcdFx0XHRcdFx0X3ZhbHVlc0VuZFtwcm9wZXJ0eV0gPSB0bXA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV07XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdF9yZXZlcnNlZCA9ICFfcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX3JlcGVhdERlbGF5VGltZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfcmVwZWF0RGVsYXlUaW1lO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF9zdGFydFRpbWUgPSB0aW1lICsgX2RlbGF5VGltZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmIChfb25Db21wbGV0ZUNhbGxiYWNrICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRfb25Db21wbGV0ZUNhbGxiYWNrLmNhbGwoX29iamVjdCwgX29iamVjdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKykge1xuXHRcdFx0XHRcdC8vIE1ha2UgdGhlIGNoYWluZWQgdHdlZW5zIHN0YXJ0IGV4YWN0bHkgYXQgdGhlIHRpbWUgdGhleSBzaG91bGQsXG5cdFx0XHRcdFx0Ly8gZXZlbiBpZiB0aGUgYHVwZGF0ZSgpYCBtZXRob2Qgd2FzIGNhbGxlZCB3YXkgcGFzdCB0aGUgZHVyYXRpb24gb2YgdGhlIHR3ZWVuXG5cdFx0XHRcdFx0X2NoYWluZWRUd2VlbnNbaV0uc3RhcnQoX3N0YXJ0VGltZSArIF9kdXJhdGlvbik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXG5cdH07XG5cbn07XG5cblxuVFdFRU4uRWFzaW5nID0ge1xuXG5cdExpbmVhcjoge1xuXG5cdFx0Tm9uZTogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGs7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFkcmF0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqICgyIC0gayk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoLS1rICogKGsgLSAyKSAtIDEpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q3ViaWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqIGsgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YXJ0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gKC0tayAqIGsgKiBrICogayk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICogayAtIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVpbnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayAqIGsgKiBrICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogayAqIGsgKiBrICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRTaW51c29pZGFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLmNvcyhrICogTWF0aC5QSSAvIDIpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIE1hdGguc2luKGsgKiBNYXRoLlBJIC8gMik7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKE1hdGguUEkgKiBrKSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFeHBvbmVudGlhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAwID8gMCA6IE1hdGgucG93KDEwMjQsIGsgLSAxKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdygyLCAtIDEwICogayk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogTWF0aC5wb3coMTAyNCwgayAtIDEpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKC0gTWF0aC5wb3coMiwgLSAxMCAqIChrIC0gMSkpICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDaXJjdWxhcjoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSBrICogayk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zcXJ0KDEgLSAoLS1rICogaykpO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAtIDAuNSAqIChNYXRoLnNxcnQoMSAtIGsgKiBrKSAtIDEpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKGsgLT0gMikgKiBrKSArIDEpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RWxhc3RpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC1NYXRoLnBvdygyLCAxMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gTWF0aC5wb3coMiwgLTEwICogaykgKiBNYXRoLnNpbigoayAtIDAuMSkgKiA1ICogTWF0aC5QSSkgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdGsgKj0gMjtcblxuXHRcdFx0aWYgKGsgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAtMC41ICogTWF0aC5wb3coMiwgMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqIE1hdGgucG93KDIsIC0xMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpICsgMTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJhY2s6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cblx0XHRcdHJldHVybiBrICogayAqICgocyArIDEpICogayAtIHMpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqICgocyArIDEpICogayArIHMpICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4ICogMS41MjU7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIChrICogayAqICgocyArIDEpICogayAtIHMpKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiAoKHMgKyAxKSAqIGsgKyBzKSArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Qm91bmNlOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBUV0VFTi5FYXNpbmcuQm91bmNlLk91dCgxIC0gayk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA8ICgxIC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xuXHRcdFx0fSBlbHNlIGlmIChrIDwgKDIgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDEuNSAvIDIuNzUpKSAqIGsgKyAwLjc1O1xuXHRcdFx0fSBlbHNlIGlmIChrIDwgKDIuNSAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMi4yNSAvIDIuNzUpKSAqIGsgKyAwLjkzNzU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDIuNjI1IC8gMi43NSkpICogayArIDAuOTg0Mzc1O1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA8IDAuNSkge1xuXHRcdFx0XHRyZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5JbihrICogMikgKiAwLjU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLk91dChrICogMiAtIDEpICogMC41ICsgMC41O1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuVFdFRU4uSW50ZXJwb2xhdGlvbiA9IHtcblxuXHRMaW5lYXI6IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgbSA9IHYubGVuZ3RoIC0gMTtcblx0XHR2YXIgZiA9IG0gKiBrO1xuXHRcdHZhciBpID0gTWF0aC5mbG9vcihmKTtcblx0XHR2YXIgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkxpbmVhcjtcblxuXHRcdGlmIChrIDwgMCkge1xuXHRcdFx0cmV0dXJuIGZuKHZbMF0sIHZbMV0sIGYpO1xuXHRcdH1cblxuXHRcdGlmIChrID4gMSkge1xuXHRcdFx0cmV0dXJuIGZuKHZbbV0sIHZbbSAtIDFdLCBtIC0gZik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZuKHZbaV0sIHZbaSArIDEgPiBtID8gbSA6IGkgKyAxXSwgZiAtIGkpO1xuXG5cdH0sXG5cblx0QmV6aWVyOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIGIgPSAwO1xuXHRcdHZhciBuID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBwdyA9IE1hdGgucG93O1xuXHRcdHZhciBibiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQmVybnN0ZWluO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gbjsgaSsrKSB7XG5cdFx0XHRiICs9IHB3KDEgLSBrLCBuIC0gaSkgKiBwdyhrLCBpKSAqIHZbaV0gKiBibihuLCBpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYjtcblxuXHR9LFxuXG5cdENhdG11bGxSb206IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgbSA9IHYubGVuZ3RoIC0gMTtcblx0XHR2YXIgZiA9IG0gKiBrO1xuXHRcdHZhciBpID0gTWF0aC5mbG9vcihmKTtcblx0XHR2YXIgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkNhdG11bGxSb207XG5cblx0XHRpZiAodlswXSA9PT0gdlttXSkge1xuXG5cdFx0XHRpZiAoayA8IDApIHtcblx0XHRcdFx0aSA9IE1hdGguZmxvb3IoZiA9IG0gKiAoMSArIGspKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuKHZbKGkgLSAxICsgbSkgJSBtXSwgdltpXSwgdlsoaSArIDEpICUgbV0sIHZbKGkgKyAyKSAlIG1dLCBmIC0gaSk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAoayA8IDApIHtcblx0XHRcdFx0cmV0dXJuIHZbMF0gLSAoZm4odlswXSwgdlswXSwgdlsxXSwgdlsxXSwgLWYpIC0gdlswXSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID4gMSkge1xuXHRcdFx0XHRyZXR1cm4gdlttXSAtIChmbih2W21dLCB2W21dLCB2W20gLSAxXSwgdlttIC0gMV0sIGYgLSBtKSAtIHZbbV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm4odltpID8gaSAtIDEgOiAwXSwgdltpXSwgdlttIDwgaSArIDEgPyBtIDogaSArIDFdLCB2W20gPCBpICsgMiA/IG0gOiBpICsgMl0sIGYgLSBpKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFV0aWxzOiB7XG5cblx0XHRMaW5lYXI6IGZ1bmN0aW9uIChwMCwgcDEsIHQpIHtcblxuXHRcdFx0cmV0dXJuIChwMSAtIHAwKSAqIHQgKyBwMDtcblxuXHRcdH0sXG5cblx0XHRCZXJuc3RlaW46IGZ1bmN0aW9uIChuLCBpKSB7XG5cblx0XHRcdHZhciBmYyA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuRmFjdG9yaWFsO1xuXG5cdFx0XHRyZXR1cm4gZmMobikgLyBmYyhpKSAvIGZjKG4gLSBpKTtcblxuXHRcdH0sXG5cblx0XHRGYWN0b3JpYWw6IChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHZhciBhID0gWzFdO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKG4pIHtcblxuXHRcdFx0XHR2YXIgcyA9IDE7XG5cblx0XHRcdFx0aWYgKGFbbl0pIHtcblx0XHRcdFx0XHRyZXR1cm4gYVtuXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAodmFyIGkgPSBuOyBpID4gMTsgaS0tKSB7XG5cdFx0XHRcdFx0cyAqPSBpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YVtuXSA9IHM7XG5cdFx0XHRcdHJldHVybiBzO1xuXG5cdFx0XHR9O1xuXG5cdFx0fSkoKSxcblxuXHRcdENhdG11bGxSb206IGZ1bmN0aW9uIChwMCwgcDEsIHAyLCBwMywgdCkge1xuXG5cdFx0XHR2YXIgdjAgPSAocDIgLSBwMCkgKiAwLjU7XG5cdFx0XHR2YXIgdjEgPSAocDMgLSBwMSkgKiAwLjU7XG5cdFx0XHR2YXIgdDIgPSB0ICogdDtcblx0XHRcdHZhciB0MyA9IHQgKiB0MjtcblxuXHRcdFx0cmV0dXJuICgyICogcDEgLSAyICogcDIgKyB2MCArIHYxKSAqIHQzICsgKC0gMyAqIHAxICsgMyAqIHAyIC0gMiAqIHYwIC0gdjEpICogdDIgKyB2MCAqIHQgKyBwMTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRXRUVOO1xuIiwiaW1wb3J0IFR3ZWVuIGZyb20gXCIuL1R3ZWVuXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOiuvue9riBBbmltYXRpb25GcmFtZSBiZWdpblxuICovXG52YXIgbGFzdFRpbWUgPSAwO1xudmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG59O1xuaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xufTtcbmlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xufTtcblxuLy/nrqHnkIbmiYDmnInlm77ooajnmoTmuLLmn5Pku7vliqFcbnZhciBfdGFza0xpc3QgPSBbXTsgLy9beyBpZCA6IHRhc2s6IH0uLi5dXG52YXIgX3JlcXVlc3RBaWQgPSBudWxsO1xuXG5mdW5jdGlvbiBlbmFibGVkQW5pbWF0aW9uRnJhbWUoKXtcbiAgICBpZiAoIV9yZXF1ZXN0QWlkKSB7XG4gICAgICAgIF9yZXF1ZXN0QWlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImZyYW1lX19cIiArIF90YXNrTGlzdC5sZW5ndGgpO1xuICAgICAgICAgICAgLy9pZiAoIFR3ZWVuLmdldEFsbCgpLmxlbmd0aCApIHtcbiAgICAgICAgICAgIFR3ZWVuLnVwZGF0ZSgpOyAvL3R3ZWVu6Ieq5bex5Lya5YGabGVuZ3Ro5Yik5patXG4gICAgICAgICAgICAvL307XG4gICAgICAgICAgICB2YXIgY3VyclRhc2tMaXN0ID0gX3Rhc2tMaXN0O1xuICAgICAgICAgICAgX3Rhc2tMaXN0ID0gW107XG4gICAgICAgICAgICBfcmVxdWVzdEFpZCA9IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoY3VyclRhc2tMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjdXJyVGFza0xpc3Quc2hpZnQoKS50YXNrKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBfcmVxdWVzdEFpZDtcbn07IFxuXG4vKlxuICogQHBhcmFtIHRhc2sg6KaB5Yqg5YWl5Yiw5riy5p+T5bin6Zif5YiX5Lit55qE5Lu75YqhXG4gKiBAcmVzdWx0IGZyYW1laWRcbiAqL1xuZnVuY3Rpb24gcmVnaXN0RnJhbWUoICRmcmFtZSApIHtcbiAgICBpZiAoISRmcmFtZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfTtcbiAgICBfdGFza0xpc3QucHVzaCgkZnJhbWUpO1xuICAgIHJldHVybiBlbmFibGVkQW5pbWF0aW9uRnJhbWUoKTtcbn07XG5cbi8qXG4gKiAgQHBhcmFtIHRhc2sg6KaB5LuO5riy5p+T5bin6Zif5YiX5Lit5Yig6Zmk55qE5Lu75YqhXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3lGcmFtZSggJGZyYW1lICkge1xuICAgIHZhciBkX3Jlc3VsdCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gX3Rhc2tMaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoX3Rhc2tMaXN0W2ldLmlkID09PSAkZnJhbWUuaWQpIHtcbiAgICAgICAgICAgIGRfcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIF90YXNrTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBsLS07XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBpZiAoX3Rhc2tMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKF9yZXF1ZXN0QWlkKTtcbiAgICAgICAgX3JlcXVlc3RBaWQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGRfcmVzdWx0O1xufTtcblxuXG4vKiBcbiAqIEBwYXJhbSBvcHQge2Zyb20gLCB0byAsIG9uVXBkYXRlICwgb25Db21wbGV0ZSAsIC4uLi4uLn1cbiAqIEByZXN1bHQgdHdlZW5cbiAqL1xuZnVuY3Rpb24gcmVnaXN0VHdlZW4ob3B0aW9ucykge1xuICAgIHZhciBvcHQgPSBfLmV4dGVuZCh7XG4gICAgICAgIGZyb206IG51bGwsXG4gICAgICAgIHRvOiBudWxsLFxuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpe30sXG4gICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICBvblN0b3A6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgcmVwZWF0OiAwLFxuICAgICAgICBkZWxheTogMCxcbiAgICAgICAgZWFzaW5nOiAnTGluZWFyLk5vbmUnLFxuICAgICAgICBkZXNjOiAnJyAvL+WKqOeUu+aPj+i/sO+8jOaWueS+v+afpeaJvmJ1Z1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdmFyIHR3ZWVuID0ge307XG4gICAgdmFyIHRpZCA9IFwidHdlZW5fXCIgKyBVdGlscy5nZXRVSUQoKTtcbiAgICBvcHQuaWQgJiYgKCB0aWQgPSB0aWQrXCJfXCIrb3B0LmlkICk7XG5cbiAgICBpZiAob3B0LmZyb20gJiYgb3B0LnRvKSB7XG4gICAgICAgIHR3ZWVuID0gbmV3IFR3ZWVuLlR3ZWVuKCBvcHQuZnJvbSApXG4gICAgICAgIC50byggb3B0LnRvLCBvcHQuZHVyYXRpb24gKVxuICAgICAgICAub25TdGFydChmdW5jdGlvbigpe1xuICAgICAgICAgICAgb3B0Lm9uU3RhcnQuYXBwbHkoIHRoaXMgKVxuICAgICAgICB9KVxuICAgICAgICAub25VcGRhdGUoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvcHQub25VcGRhdGUuYXBwbHkoIHRoaXMgKTtcbiAgICAgICAgfSApXG4gICAgICAgIC5vbkNvbXBsZXRlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlc3Ryb3lGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0d2Vlbi5faXNDb21wbGV0ZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9wdC5vbkNvbXBsZXRlLmFwcGx5KCB0aGlzICwgW3RoaXNdICk7IC8v5omn6KGM55So5oi355qEY29uQ29tcGxldGVcbiAgICAgICAgfSApXG4gICAgICAgIC5vblN0b3AoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBkZXN0cm95RnJhbWUoe1xuICAgICAgICAgICAgICAgIGlkOiB0aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHdlZW4uX2lzU3RvcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9wdC5vblN0b3AuYXBwbHkoIHRoaXMgLCBbdGhpc10gKTtcbiAgICAgICAgfSApXG4gICAgICAgIC5yZXBlYXQoIG9wdC5yZXBlYXQgKVxuICAgICAgICAuZGVsYXkoIG9wdC5kZWxheSApXG4gICAgICAgIC5lYXNpbmcoIFR3ZWVuLkVhc2luZ1tvcHQuZWFzaW5nLnNwbGl0KFwiLlwiKVswXV1bb3B0LmVhc2luZy5zcGxpdChcIi5cIilbMV1dIClcbiAgICAgICAgXG4gICAgICAgIHR3ZWVuLmlkID0gdGlkO1xuICAgICAgICB0d2Vlbi5zdGFydCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG5cbiAgICAgICAgICAgIGlmICggdHdlZW4uX2lzQ29tcGxldGVlZCB8fCB0d2Vlbi5faXNTdG9wZWQgKSB7XG4gICAgICAgICAgICAgICAgdHdlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWdpc3RGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZCxcbiAgICAgICAgICAgICAgICB0YXNrOiBhbmltYXRlLFxuICAgICAgICAgICAgICAgIGRlc2M6IG9wdC5kZXNjLFxuICAgICAgICAgICAgICAgIHR3ZWVuOiB0d2VlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGFuaW1hdGUoKTtcblxuICAgIH07XG4gICAgcmV0dXJuIHR3ZWVuO1xufTtcbi8qXG4gKiBAcGFyYW0gdHdlZW5cbiAqIEByZXN1bHQgdm9pZCgwKVxuICovXG5mdW5jdGlvbiBkZXN0cm95VHdlZW4odHdlZW4gLCBtc2cpIHtcbiAgICB0d2Vlbi5zdG9wKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVnaXN0RnJhbWU6IHJlZ2lzdEZyYW1lLFxuICAgIGRlc3Ryb3lGcmFtZTogZGVzdHJveUZyYW1lLFxuICAgIHJlZ2lzdFR3ZWVuOiByZWdpc3RUd2VlbixcbiAgICBkZXN0cm95VHdlZW46IGRlc3Ryb3lUd2VlblxufTsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDlsZ7mgKflt6XljoLvvIxpZeS4i+mdoueUqFZCU+aPkOS+m+aUr+aMgVxuICog5p2l57uZ5pW05Liq5byV5pOO5o+Q5L6b5b+D6Lez5YyF55qE6Kem5Y+R5py65Yi2XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8v5a6a5LmJ5bCB6KOF5aW955qE5YW85a655aSn6YOo5YiG5rWP6KeI5Zmo55qEZGVmaW5lUHJvcGVydGllcyDnmoQg5bGe5oCn5bel5Y6CXG52YXIgdW53YXRjaE9uZSA9IHtcbiAgICBcIiRza2lwQXJyYXlcIiA6IDAsXG4gICAgXCIkd2F0Y2hcIiAgICAgOiAxLFxuICAgIFwiJGZpcmVcIiAgICAgIDogMiwvL+S4u+imgeaYr2dldCBzZXQg5pi+5oCn6K6+572u55qEIOinpuWPkVxuICAgIFwiJG1vZGVsXCIgICAgIDogMyxcbiAgICBcIiRhY2Nlc3NvclwiICA6IDQsXG4gICAgXCIkb3duZXJcIiAgICAgOiA1LFxuICAgIC8vXCJwYXRoXCIgICAgICAgOiA2LCAvL+i/meS4quW6lOivpeaYr+WUr+S4gOS4gOS4quS4jeeUqHdhdGNo55qE5LiN5bimJOeahOaIkOWRmOS6huWQp++8jOWboOS4uuWcsOWbvuetieeahHBhdGjmmK/lnKjlpKrlpKdcbiAgICBcIiRwYXJlbnRcIiAgICA6IDcgIC8v55So5LqO5bu656uL5pWw5o2u55qE5YWz57O76ZO+XG59XG5cbmZ1bmN0aW9uIE9ic2VydmUoc2NvcGUsIG1vZGVsLCB3YXRjaE1vcmUpIHtcblxuICAgIHZhciBzdG9wUmVwZWF0QXNzaWduPXRydWU7XG5cbiAgICB2YXIgc2tpcEFycmF5ID0gc2NvcGUuJHNraXBBcnJheSwgLy/opoHlv73nlaXnm5HmjqfnmoTlsZ7mgKflkI3liJfooahcbiAgICAgICAgcG1vZGVsID0ge30sIC8v6KaB6L+U5Zue55qE5a+56LGhXG4gICAgICAgIGFjY2Vzc29yZXMgPSB7fSwgLy/lhoXpg6jnlKjkuo7ovazmjaLnmoTlr7nosaFcbiAgICAgICAgVkJQdWJsaWNzID0gXy5rZXlzKCB1bndhdGNoT25lICk7IC8v55So5LqOSUU2LThcblxuICAgICAgICBtb2RlbCA9IG1vZGVsIHx8IHt9Oy8v6L+Z5pivcG1vZGVs5LiK55qEJG1vZGVs5bGe5oCnXG4gICAgICAgIHdhdGNoTW9yZSA9IHdhdGNoTW9yZSB8fCB7fTsvL+S7pSTlvIDlpLTkvYbopoHlvLrliLbnm5HlkKznmoTlsZ7mgKdcbiAgICAgICAgc2tpcEFycmF5ID0gXy5pc0FycmF5KHNraXBBcnJheSkgPyBza2lwQXJyYXkuY29uY2F0KFZCUHVibGljcykgOiBWQlB1YmxpY3M7XG5cbiAgICBmdW5jdGlvbiBsb29wKG5hbWUsIHZhbCkge1xuICAgICAgICBpZiAoICF1bndhdGNoT25lW25hbWVdIHx8ICh1bndhdGNoT25lW25hbWVdICYmIG5hbWUuY2hhckF0KDApICE9PSBcIiRcIikgKSB7XG4gICAgICAgICAgICBtb2RlbFtuYW1lXSA9IHZhbFxuICAgICAgICB9O1xuICAgICAgICB2YXIgdmFsdWVUeXBlID0gdHlwZW9mIHZhbDtcbiAgICAgICAgaWYgKHZhbHVlVHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBpZighdW53YXRjaE9uZVtuYW1lXSl7XG4gICAgICAgICAgICAgIFZCUHVibGljcy5wdXNoKG5hbWUpIC8v5Ye95pWw5peg6ZyA6KaB6L2s5o2iXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pbmRleE9mKHNraXBBcnJheSxuYW1lKSAhPT0gLTEgfHwgKG5hbWUuY2hhckF0KDApID09PSBcIiRcIiAmJiAhd2F0Y2hNb3JlW25hbWVdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBWQlB1YmxpY3MucHVzaChuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFjY2Vzc29yID0gZnVuY3Rpb24obmVvKSB7IC8v5Yib5bu655uR5o6n5bGe5oCn5oiW5pWw57uE77yM6Ieq5Y+Y6YeP77yM55Sx55So5oi36Kem5Y+R5YW25pS55Y+YXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYWNjZXNzb3IudmFsdWUsIHByZVZhbHVlID0gdmFsdWUsIGNvbXBsZXhWYWx1ZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvL+WGmeaTjeS9nFxuICAgICAgICAgICAgICAgICAgICAvL3NldCDnmoQg5YC855qEIOexu+Wei1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmVvVHlwZSA9IHR5cGVvZiBuZW87XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3BSZXBlYXRBc3NpZ24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAvL+mYu+atoumHjeWkjei1i+WAvFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbmVvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggbmVvICYmIG5lb1R5cGUgPT09IFwib2JqZWN0XCIgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIShuZW8gaW5zdGFuY2VvZiBBcnJheSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhbmVvLmFkZENvbG9yU3RvcCAvLyBuZW8gaW5zdGFuY2VvZiBDYW52YXNHcmFkaWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBuZW8uJG1vZGVsID8gbmVvIDogT2JzZXJ2ZShuZW8gLCBuZW8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhWYWx1ZSA9IHZhbHVlLiRtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7Ly/lpoLmnpzmmK/lhbbku5bmlbDmja7nsbvlnotcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmKCBuZW9UeXBlID09PSBcImFycmF5XCIgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB2YWx1ZSA9IF8uY2xvbmUobmVvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmVvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSBjb21wbGV4VmFsdWUgPyBjb21wbGV4VmFsdWUgOiB2YWx1ZTsvL+abtOaWsCRtb2RlbOS4reeahOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wbGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbW9kZWwuJGZpcmUgJiYgcG1vZGVsLiRmaXJlKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlVHlwZSAhPSBuZW9UeXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenHNldOeahOWAvOexu+Wei+W3sue7j+aUueWPmO+8jFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI5Lmf6KaB5oqK5a+55bqU55qEdmFsdWVUeXBl5L+u5pS55Li65a+55bqU55qEbmVvVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZSA9IG5lb1R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzV2F0Y2hNb2RlbCA9IHBtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5omA5pyJ55qE6LWL5YC86YO96KaB6Kem5Y+Rd2F0Y2jnmoTnm5HlkKzkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXBtb2RlbC4kd2F0Y2ggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlKCBoYXNXYXRjaE1vZGVsLiRwYXJlbnQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2F0Y2hNb2RlbCA9IGhhc1dhdGNoTW9kZWwuJHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBoYXNXYXRjaE1vZGVsLiR3YXRjaCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2F0Y2hNb2RlbC4kd2F0Y2guY2FsbChoYXNXYXRjaE1vZGVsICwgbmFtZSwgdmFsdWUsIHByZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6K+75pON5L2cXG4gICAgICAgICAgICAgICAgICAgIC8v6K+755qE5pe25YCZ77yM5Y+R546wdmFsdWXmmK/kuKpvYmrvvIzogIzkuJTov5jmsqHmnIlkZWZpbmVQcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOWwseS4tOaXtmRlZmluZVByb3BlcnR55LiA5qyhXG4gICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgJiYgKHZhbHVlVHlwZSA9PT0gXCJvYmplY3RcIikgXG4gICAgICAgICAgICAgICAgICAgICAgICYmICEodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkgXG4gICAgICAgICAgICAgICAgICAgICAgICYmICF2YWx1ZS4kbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgJiYgIXZhbHVlLmFkZENvbG9yU3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lu7rnq4vlkozniLbmlbDmja7oioLngrnnmoTlhbPns7tcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLiRwYXJlbnQgPSBwbW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IE9ic2VydmUodmFsdWUgLCB2YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWNjZXNzb3IudmFsdWUg6YeN5paw5aSN5Yi25Li6ZGVmaW5lUHJvcGVydHnov4flkI7nmoTlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhY2Nlc3Nvci52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWNjZXNzb3Jlc1tuYW1lXSA9IHtcbiAgICAgICAgICAgICAgICBzZXQ6IGFjY2Vzc29yLFxuICAgICAgICAgICAgICAgIGdldDogYWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBmb3IgKHZhciBpIGluIHNjb3BlKSB7XG4gICAgICAgIGxvb3AoaSwgc2NvcGVbaV0pXG4gICAgfTtcblxuICAgIHBtb2RlbCA9IGRlZmluZVByb3BlcnRpZXMocG1vZGVsLCBhY2Nlc3NvcmVzLCBWQlB1YmxpY3MpOy8v55Sf5oiQ5LiA5Liq56m655qEVmlld01vZGVsXG5cbiAgICBfLmZvckVhY2goVkJQdWJsaWNzLGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKHNjb3BlW25hbWVdKSB7Ly/lhYjkuLrlh73mlbDnrYnkuI3ooqvnm5HmjqfnmoTlsZ7mgKfotYvlgLxcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzY29wZVtuYW1lXSA9PSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgICAgICAgICAgIHBtb2RlbFtuYW1lXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICBzY29wZVtuYW1lXS5hcHBseSh0aGlzICwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBwbW9kZWxbbmFtZV0gPSBzY29wZVtuYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcG1vZGVsLiRtb2RlbCA9IG1vZGVsO1xuICAgIHBtb2RlbC4kYWNjZXNzb3IgPSBhY2Nlc3NvcmVzO1xuXG4gICAgcG1vZGVsLmhhc093blByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiBwbW9kZWwuJG1vZGVsXG4gICAgfTtcblxuICAgIHN0b3BSZXBlYXRBc3NpZ24gPSBmYWxzZTtcblxuICAgIHJldHVybiBwbW9kZWxcbn1cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuICAgIC8v5aaC5p6c5rWP6KeI5Zmo5LiN5pSv5oyBZWNtYTI2MnY155qET2JqZWN0LmRlZmluZVByb3BlcnRpZXPmiJbogIXlrZjlnKhCVUfvvIzmr5TlpoJJRThcbiAgICAvL+agh+WHhua1j+iniOWZqOS9v+eUqF9fZGVmaW5lR2V0dGVyX18sIF9fZGVmaW5lU2V0dGVyX1/lrp7njrBcbiAgICB0cnkge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh7fSwgXCJfXCIsIHtcbiAgICAgICAgICAgIHZhbHVlOiBcInhcIlxuICAgICAgICB9KVxuICAgICAgICB2YXIgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoXCJfX2RlZmluZUdldHRlcl9fXCIgaW4gT2JqZWN0KSB7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9iaiwgcHJvcCwgZGVzYykge1xuICAgICAgICAgICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gZGVzYy52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJ2dldCcgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmouX19kZWZpbmVHZXR0ZXJfXyhwcm9wLCBkZXNjLmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCdzZXQnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9fZGVmaW5lU2V0dGVyX18ocHJvcCwgZGVzYy5zZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24ob2JqLCBkZXNjcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gZGVzY3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NzW3Byb3BdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4vL0lFNi045L2/55SoVkJTY3JpcHTnsbvnmoRzZXQgZ2V06K+t5Y+l5a6e546wXG5pZiAoIWRlZmluZVByb3BlcnRpZXMgJiYgd2luZG93LlZCQXJyYXkpIHtcbiAgICB3aW5kb3cuZXhlY1NjcmlwdChbXG4gICAgICAgICAgICBcIkZ1bmN0aW9uIHBhcnNlVkIoY29kZSlcIixcbiAgICAgICAgICAgIFwiXFx0RXhlY3V0ZUdsb2JhbChjb2RlKVwiLFxuICAgICAgICAgICAgXCJFbmQgRnVuY3Rpb25cIlxuICAgICAgICAgICAgXS5qb2luKFwiXFxuXCIpLCBcIlZCU2NyaXB0XCIpO1xuXG4gICAgZnVuY3Rpb24gVkJNZWRpYXRvcihkZXNjcmlwdGlvbiwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGZuID0gZGVzY3JpcHRpb25bbmFtZV0gJiYgZGVzY3JpcHRpb25bbmFtZV0uc2V0O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgZm4odmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihwdWJsaWNzLCBkZXNjcmlwdGlvbiwgYXJyYXkpIHtcbiAgICAgICAgcHVibGljcyA9IGFycmF5LnNsaWNlKDApO1xuICAgICAgICBwdWJsaWNzLnB1c2goXCJoYXNPd25Qcm9wZXJ0eVwiKTtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiVkJDbGFzc1wiICsgc2V0VGltZW91dChcIjFcIiksIG93bmVyID0ge30sIGJ1ZmZlciA9IFtdO1xuICAgICAgICBidWZmZXIucHVzaChcbiAgICAgICAgICAgICAgICBcIkNsYXNzIFwiICsgY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgIFwiXFx0UHJpdmF0ZSBbX19kYXRhX19dLCBbX19wcm94eV9fXVwiLFxuICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIERlZmF1bHQgRnVuY3Rpb24gW19fY29uc3RfX10oZCwgcClcIixcbiAgICAgICAgICAgICAgICBcIlxcdFxcdFNldCBbX19kYXRhX19dID0gZDogc2V0IFtfX3Byb3h5X19dID0gcFwiLFxuICAgICAgICAgICAgICAgIFwiXFx0XFx0U2V0IFtfX2NvbnN0X19dID0gTWVcIiwgLy/pk77lvI/osIPnlKhcbiAgICAgICAgICAgICAgICBcIlxcdEVuZCBGdW5jdGlvblwiKTtcbiAgICAgICAgXy5mb3JFYWNoKHB1YmxpY3MsZnVuY3Rpb24obmFtZSkgeyAvL+a3u+WKoOWFrOWFseWxnuaApyzlpoLmnpzmraTml7bkuI3liqDku6XlkI7lsLHmsqHmnLrkvJrkuoZcbiAgICAgICAgICAgIGlmIChvd25lcltuYW1lXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIG93bmVyW25hbWVdID0gdHJ1ZSAvL+WboOS4ulZCU2NyaXB05a+56LGh5LiN6IO95YOPSlPpgqPmoLfpmo/mhI/lop7liKDlsZ7mgKdcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoKFwiXFx0UHVibGljIFtcIiArIG5hbWUgKyBcIl1cIikgLy/kvaDlj6/ku6XpooTlhYjmlL7liLBza2lwQXJyYXnkuK1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIG93bmVyW25hbWVdID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLHkuo7kuI3nn6Xlr7nmlrnkvJrkvKDlhaXku4DkuYgs5Zug5q2kc2V0LCBsZXTpg73nlKjkuIpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIFByb3BlcnR5IExldCBbXCIgKyBuYW1lICsgXCJdKHZhbClcIiwgLy9zZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0Q2FsbCBbX19wcm94eV9fXShbX19kYXRhX19dLCBcXFwiXCIgKyBuYW1lICsgXCJcXFwiLCB2YWwpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBQcm9wZXJ0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgUHJvcGVydHkgU2V0IFtcIiArIG5hbWUgKyBcIl0odmFsKVwiLCAvL3NldHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRDYWxsIFtfX3Byb3h5X19dKFtfX2RhdGFfX10sIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIsIHZhbClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIFByb3BlcnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBQcm9wZXJ0eSBHZXQgW1wiICsgbmFtZSArIFwiXVwiLCAvL2dldHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRPbiBFcnJvciBSZXN1bWUgTmV4dFwiLCAvL+W/hemhu+S8mOWFiOS9v+eUqHNldOivreWPpSzlkKbliJnlroPkvJror6/lsIbmlbDnu4TlvZPlrZfnrKbkuLLov5Tlm55cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0U2V0W1wiICsgbmFtZSArIFwiXSA9IFtfX3Byb3h5X19dKFtfX2RhdGFfX10sXFxcIlwiICsgbmFtZSArIFwiXFxcIilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0SWYgRXJyLk51bWJlciA8PiAwIFRoZW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0W1wiICsgbmFtZSArIFwiXSA9IFtfX3Byb3h5X19dKFtfX2RhdGFfX10sXFxcIlwiICsgbmFtZSArIFwiXFxcIilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIElmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdE9uIEVycm9yIEdvdG8gMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgUHJvcGVydHlcIilcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIucHVzaChcIkVuZCBDbGFzc1wiKTsgLy/nsbvlrprkuYnlrozmr5VcbiAgICAgICAgYnVmZmVyLnB1c2goXG4gICAgICAgICAgICAgICAgXCJGdW5jdGlvbiBcIiArIGNsYXNzTmFtZSArIFwiRmFjdG9yeShhLCBiKVwiLCAvL+WIm+W7uuWunuS+i+W5tuS8oOWFpeS4pOS4quWFs+mUrueahOWPguaVsFxuICAgICAgICAgICAgICAgIFwiXFx0RGltIG9cIixcbiAgICAgICAgICAgICAgICBcIlxcdFNldCBvID0gKE5ldyBcIiArIGNsYXNzTmFtZSArIFwiKShhLCBiKVwiLFxuICAgICAgICAgICAgICAgIFwiXFx0U2V0IFwiICsgY2xhc3NOYW1lICsgXCJGYWN0b3J5ID0gb1wiLFxuICAgICAgICAgICAgICAgIFwiRW5kIEZ1bmN0aW9uXCIpO1xuICAgICAgICB3aW5kb3cucGFyc2VWQihidWZmZXIuam9pbihcIlxcclxcblwiKSk7Ly/lhYjliJvlu7rkuIDkuKpWQuexu+W3peWOglxuICAgICAgICByZXR1cm4gIHdpbmRvd1tjbGFzc05hbWUgKyBcIkZhY3RvcnlcIl0oZGVzY3JpcHRpb24sIFZCTWVkaWF0b3IpOy8v5b6X5Yiw5YW25Lqn5ZOBXG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgT2JzZXJ2ZTtcblxuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIERpc3BsYXlMaXN0IOeahCDnjrDlrp7lr7nosaHln7rnsbtcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4uL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuaW1wb3J0IE1hdHJpeCBmcm9tIFwiLi4vZ2VvbS9NYXRyaXhcIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IEhpdFRlc3RQb2ludCBmcm9tIFwiLi4vZ2VvbS9IaXRUZXN0UG9pbnRcIjtcbmltcG9ydCBBbmltYXRpb25GcmFtZSBmcm9tIFwiLi4vYW5pbWF0aW9uL0FuaW1hdGlvbkZyYW1lXCI7XG5pbXBvcnQgT2JzZXJ2ZSBmcm9tIFwiLi4vdXRpbHMvb2JzZXJ2ZVwiO1xuXG52YXIgRGlzcGxheU9iamVjdCA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgRGlzcGxheU9iamVjdC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy/lpoLmnpznlKjmiLfmsqHmnInkvKDlhaVjb250ZXh06K6+572u77yM5bCx6buY6K6k5Li656m655qE5a+56LGhXG4gICAgb3B0ICAgICAgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XG5cbiAgICAvL+iuvue9rum7mOiupOWxnuaAp1xuICAgIHNlbGYuaWQgID0gb3B0LmlkIHx8IG51bGw7XG5cbiAgICAvL+ebuOWvueeItue6p+WFg+e0oOeahOefqemYtVxuICAgIHNlbGYuX3RyYW5zZm9ybSAgICAgID0gbnVsbDtcblxuICAgIC8v5b+D6Lez5qyh5pWwXG4gICAgc2VsZi5faGVhcnRCZWF0TnVtICAgPSAwO1xuXG4gICAgLy/lhYPntKDlr7nlupTnmoRzdGFnZeWFg+e0oFxuICAgIHNlbGYuc3RhZ2UgICAgICAgICAgID0gbnVsbDtcblxuICAgIC8v5YWD57Sg55qE54i25YWD57SgXG4gICAgc2VsZi5wYXJlbnQgICAgICAgICAgPSBudWxsO1xuXG4gICAgc2VsZi5fZXZlbnRFbmFibGVkICAgPSBmYWxzZTsgICAvL+aYr+WQpuWTjeW6lOS6i+S7tuS6pOS6kizlnKjmt7vliqDkuobkuovku7bkvqblkKzlkI7kvJroh6rliqjorr7nva7kuLp0cnVlXG5cbiAgICBzZWxmLmRyYWdFbmFibGVkICAgICA9IHRydWUgOy8vXCJkcmFnRW5hYmxlZFwiIGluIG9wdCA/IG9wdC5kcmFnRW5hYmxlZCA6IGZhbHNlOyAgIC8v5piv5ZCm5ZCv55So5YWD57Sg55qE5ouW5ou9XG5cbiAgICBzZWxmLnh5VG9JbnQgICAgICAgICA9IFwieHlUb0ludFwiIGluIG9wdCA/IG9wdC54eVRvSW50IDogdHJ1ZTsgICAgLy/mmK/lkKblr7l4eeWdkOagh+e7n+S4gGludOWkhOeQhu+8jOm7mOiupOS4unRydWXvvIzkvYbmmK/mnInnmoTml7blgJnlj6/ku6XnlLHlpJbnlYznlKjmiLfmiYvliqjmjIflrprmmK/lkKbpnIDopoHorqHnrpfkuLppbnTvvIzlm6DkuLrmnInnmoTml7blgJnkuI3orqHnrpfmr5TovoPlpb3vvIzmr5TlpoLvvIzov5vluqblm77ooajkuK3vvIzlho1zZWN0b3LnmoTkuKTnq6/mt7vliqDkuKTkuKrlnIbmnaXlgZrlnIbop5LnmoTov5vluqbmnaHnmoTml7blgJnvvIzlnIZjaXJjbGXkuI3lgZppbnTorqHnrpfvvIzmiY3og73lkoxzZWN0b3Lmm7Tlpb3nmoTooZTmjqVcblxuICAgIHNlbGYubW92ZWluZyA9IGZhbHNlOyAvL+WmguaenOWFg+e0oOWcqOacgOi9qOmBk+i/kOWKqOS4reeahOaXtuWAme+8jOacgOWlveaKiui/meS4quiuvue9ruS4unRydWXvvIzov5nmoLfog73kv53or4Hovajov7nnmoTkuJ3mkKzpobrmu5HvvIzlkKbliJnlm6DkuLp4eVRvSW5055qE5Y6f5Zug77yM5Lya5pyJ6Lez6LeDXG5cbiAgICAvL+WIm+W7uuWlvWNvbnRleHRcbiAgICBzZWxmLl9jcmVhdGVDb250ZXh0KCBvcHQgKTtcblxuICAgIHZhciBVSUQgPSBVdGlscy5jcmVhdGVJZChzZWxmLnR5cGUpO1xuXG4gICAgLy/lpoLmnpzmsqHmnIlpZCDliJkg5rK/55SodWlkXG4gICAgaWYoc2VsZi5pZCA9PSBudWxsKXtcbiAgICAgICAgc2VsZi5pZCA9IFVJRCA7XG4gICAgfTtcblxuICAgIHNlbGYuaW5pdC5hcHBseShzZWxmICwgYXJndW1lbnRzKTtcblxuICAgIC8v5omA5pyJ5bGe5oCn5YeG5aSH5aW95LqG5ZCO77yM5YWI6KaB6K6h566X5LiA5qyhdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCnlvpfliLBfdGFuc2Zvcm1cbiAgICB0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKTtcbn07XG5cbi8qKlxuICog566A5Y2V55qE5rWF5aSN5Yi25a+56LGh44CCXG4gKiBAcGFyYW0gc3RyaWN0ICDlvZPkuLp0cnVl5pe25Y+q6KaG55uW5bey5pyJ5bGe5oCnXG4gKi9cbnZhciBjb3B5ID0gZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UsIHN0cmljdCl7IFxuICAgIGlmICggXy5pc0VtcHR5KHNvdXJjZSkgKXtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgZm9yKHZhciBrZXkgaW4gc291cmNlKXtcbiAgICAgICAgaWYoIXN0cmljdCB8fCB0YXJnZXQuaGFzT3duUHJvcGVydHkoa2V5KSB8fCB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3QgLCBFdmVudERpc3BhdGNoZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7fSxcbiAgICBfY3JlYXRlQ29udGV4dCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+aJgOacieaYvuekuuWvueixoe+8jOmDveacieS4gOS4quexu+S8vGNhbnZhcy5jb250ZXh057G75Ly855qEIGNvbnRleHTlsZ7mgKdcbiAgICAgICAgLy/nlKjmnaXlrZjlj5bmlLnmmL7npLrlr7nosaHmiYDmnInlkozmmL7npLrmnInlhbPnmoTlsZ7mgKfvvIzlnZDmoIfvvIzmoLflvI/nrYnjgIJcbiAgICAgICAgLy/or6Xlr7nosaHkuLpDb2VyLk9ic2VydmUoKeW3peWOguWHveaVsOeUn+aIkFxuICAgICAgICBzZWxmLmNvbnRleHQgPSBudWxsO1xuXG4gICAgICAgIC8v5o+Q5L6b57uZQ29lci5PYnNlcnZlKCkg5p2lIOe7mSBzZWxmLmNvbnRleHQg6K6+572uIHByb3BlcnR5c1xuICAgICAgICAvL+i/memHjOS4jeiDveeUqF8uZXh0ZW5k77yMIOWboOS4uuimgeS/neivgV9jb250ZXh0QVRUUlPnmoTnuq/nsrnvvIzlj6ropobnm5bkuIvpnaLlt7LmnInnmoTlsZ7mgKdcbiAgICAgICAgdmFyIF9jb250ZXh0QVRUUlMgPSBjb3B5KCB7XG4gICAgICAgICAgICB3aWR0aCAgICAgICAgIDogMCxcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgOiAwLFxuICAgICAgICAgICAgeCAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICB5ICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgIHNjYWxlWCAgICAgICAgOiAxLFxuICAgICAgICAgICAgc2NhbGVZICAgICAgICA6IDEsXG4gICAgICAgICAgICBzY2FsZU9yaWdpbiAgIDoge1xuICAgICAgICAgICAgICAgIHggOiAwLFxuICAgICAgICAgICAgICAgIHkgOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm90YXRpb24gICAgICA6IDAsXG4gICAgICAgICAgICByb3RhdGVPcmlnaW4gIDogIHtcbiAgICAgICAgICAgICAgICB4IDogMCxcbiAgICAgICAgICAgICAgICB5IDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGUgICAgICAgOiB0cnVlLFxuICAgICAgICAgICAgY3Vyc29yICAgICAgICA6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgLy9jYW52YXMgY29udGV4dCAyZCDnmoQg57O757uf5qC35byP44CC55uu5YmN5bCx55+l6YGT6L+Z5LmI5aSaXG4gICAgICAgICAgICBmaWxsU3R5bGUgICAgIDogbnVsbCwvL1wiIzAwMDAwMFwiLFxuICAgICAgICAgICAgbGluZUNhcCAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBsaW5lSm9pbiAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIGxpbmVXaWR0aCAgICAgOiBudWxsLFxuICAgICAgICAgICAgbWl0ZXJMaW1pdCAgICA6IG51bGwsXG4gICAgICAgICAgICBzaGFkb3dCbHVyICAgIDogbnVsbCxcbiAgICAgICAgICAgIHNoYWRvd0NvbG9yICAgOiBudWxsLFxuICAgICAgICAgICAgc2hhZG93T2Zmc2V0WCA6IG51bGwsXG4gICAgICAgICAgICBzaGFkb3dPZmZzZXRZIDogbnVsbCxcbiAgICAgICAgICAgIHN0cm9rZVN0eWxlICAgOiBudWxsLFxuICAgICAgICAgICAgZ2xvYmFsQWxwaGEgICA6IDEsXG4gICAgICAgICAgICBmb250ICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIHRleHRBbGlnbiAgICAgOiBcImxlZnRcIixcbiAgICAgICAgICAgIHRleHRCYXNlbGluZSAgOiBcInRvcFwiLCBcbiAgICAgICAgICAgIGFyY1NjYWxlWF8gICAgOiBudWxsLFxuICAgICAgICAgICAgYXJjU2NhbGVZXyAgICA6IG51bGwsXG4gICAgICAgICAgICBsaW5lU2NhbGVfICAgIDogbnVsbCxcbiAgICAgICAgICAgIGdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA6IG51bGxcbiAgICAgICAgfSAsIG9wdC5jb250ZXh0ICwgdHJ1ZSApOyAgICAgICAgICAgIFxuXG4gICAgICAgIC8v54S25ZCO55yL57un5om/6ICF5piv5ZCm5pyJ5o+Q5L6bX2NvbnRleHQg5a+56LGhIOmcgOimgSDmiJEgbWVyZ2XliLBfY29udGV4dDJEX2NvbnRleHTkuK3ljrvnmoRcbiAgICAgICAgaWYgKHNlbGYuX2NvbnRleHQpIHtcbiAgICAgICAgICAgIF9jb250ZXh0QVRUUlMgPSBfLmV4dGVuZChfY29udGV4dEFUVFJTICwgc2VsZi5fY29udGV4dCApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/mnInkupvlvJXmk47lhoXpg6jorr7nva5jb250ZXh05bGe5oCn55qE5pe25YCZ5piv5LiN55So5LiK5oql5b+D6Lez55qE77yM5q+U5aaC5YGaaGl0VGVzdFBvaW5054Ot54K55qOA5rWL55qE5pe25YCZXG4gICAgICAgIHNlbGYuX25vdFdhdGNoID0gZmFsc2U7XG5cbiAgICAgICAgX2NvbnRleHRBVFRSUy4kb3duZXIgPSBzZWxmO1xuICAgICAgICBfY29udGV4dEFUVFJTLiR3YXRjaCA9IGZ1bmN0aW9uKG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlKXtcblxuICAgICAgICAgICAgLy/kuIvpnaLnmoTov5nkupvlsZ7mgKflj5jljJbvvIzpg73kvJrpnIDopoHph43mlrDnu4Tnu4fnn6npmLXlsZ7mgKdfdHJhbnNmb3JtIFxuICAgICAgICAgICAgdmFyIHRyYW5zRm9ybVByb3BzID0gWyBcInhcIiAsIFwieVwiICwgXCJzY2FsZVhcIiAsIFwic2NhbGVZXCIgLCBcInJvdGF0aW9uXCIgLCBcInNjYWxlT3JpZ2luXCIgLCBcInJvdGF0ZU9yaWdpbiwgbGluZVdpZHRoXCIgXTtcblxuICAgICAgICAgICAgaWYoIF8uaW5kZXhPZiggdHJhbnNGb3JtUHJvcHMgLCBuYW1lICkgPj0gMCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRvd25lci5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiggdGhpcy4kb3duZXIuX25vdFdhdGNoICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMuJG93bmVyLiR3YXRjaCApe1xuICAgICAgICAgICAgICAgIHRoaXMuJG93bmVyLiR3YXRjaCggbmFtZSAsIHZhbHVlICwgcHJlVmFsdWUgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJG93bmVyLmhlYXJ0QmVhdCgge1xuICAgICAgICAgICAgICAgIGNvbnZlcnRUeXBlOlwiY29udGV4dFwiLFxuICAgICAgICAgICAgICAgIHNoYXBlICAgICAgOiB0aGlzLiRvd25lcixcbiAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogbmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZSAgICAgIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgcHJlVmFsdWUgICA6IHByZVZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5omn6KGMaW5pdOS5i+WJje+8jOW6lOivpeWwseagueaNruWPguaVsO+8jOaKimNvbnRleHTnu4Tnu4flpb3nur9cbiAgICAgICAgc2VsZi5jb250ZXh0ID0gT2JzZXJ2ZSggX2NvbnRleHRBVFRSUyApO1xuICAgIH0sXG4gICAgLyogQG15c2VsZiDmmK/lkKbnlJ/miJDoh6rlt7HnmoTplZzlg48gXG4gICAgICog5YWL6ZqG5Y+I5Lik56eN77yM5LiA56eN5piv6ZWc5YOP77yM5Y+m5aSW5LiA56eN5piv57ud5a+55oSP5LmJ5LiK6Z2i55qE5paw5Liq5L2TXG4gICAgICog6buY6K6k5Li657ud5a+55oSP5LmJ5LiK6Z2i55qE5paw5Liq5L2T77yM5paw5a+56LGhaWTkuI3og73nm7jlkIxcbiAgICAgKiDplZzlg4/ln7rmnKzkuIrmmK/moYbmnrblhoXpg6jlnKjlrp7njrAgIOmVnOWDj+eahGlk55u45ZCMIOS4u+imgeeUqOadpeaKiuiHquW3seeUu+WIsOWPpuWklueahHN0YWdl6YeM6Z2i77yM5q+U5aaCXG4gICAgICogbW91c2VvdmVy5ZKMbW91c2VvdXTnmoTml7blgJnosIPnlKgqL1xuICAgIGNsb25lIDogZnVuY3Rpb24oIG15c2VsZiApe1xuICAgICAgICB2YXIgY29uZiAgID0ge1xuICAgICAgICAgICAgaWQgICAgICA6IHRoaXMuaWQsXG4gICAgICAgICAgICBjb250ZXh0IDogXy5jbG9uZSh0aGlzLmNvbnRleHQuJG1vZGVsKVxuICAgICAgICB9O1xuICAgICAgICBpZiggdGhpcy5pbWcgKXtcbiAgICAgICAgICAgIGNvbmYuaW1nID0gdGhpcy5pbWc7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBuZXdPYmo7XG4gICAgICAgIGlmKCB0aGlzLnR5cGUgPT0gJ3RleHQnICl7XG4gICAgICAgICAgICBuZXdPYmogPSBuZXcgdGhpcy5jb25zdHJ1Y3RvciggdGhpcy50ZXh0ICwgY29uZiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3T2JqID0gbmV3IHRoaXMuY29uc3RydWN0b3IoIGNvbmYgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5jaGlsZHJlbiApe1xuICAgICAgICAgICAgbmV3T2JqLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW15c2VsZil7XG4gICAgICAgICAgICBuZXdPYmouaWQgICAgICAgPSBVdGlscy5jcmVhdGVJZChuZXdPYmoudHlwZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfSxcbiAgICBoZWFydEJlYXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICAvL3N0YWdl5a2Y5Zyo77yM5omN6K+0c2VsZuS7o+ihqOeahGRpc3BsYXnlt7Lnu4/ooqvmt7vliqDliLDkuoZkaXNwbGF5TGlzdOS4re+8jOe7mOWbvuW8leaTjumcgOimgeefpemBk+WFtuaUueWPmOWQjlxuICAgICAgICAvL+eahOWxnuaAp++8jOaJgOS7pe+8jOmAmuefpeWIsHN0YWdlLmRpc3BsYXlBdHRySGFzQ2hhbmdlXG4gICAgICAgIHZhciBzdGFnZSA9IHRoaXMuZ2V0U3RhZ2UoKTtcbiAgICAgICAgaWYoIHN0YWdlICl7XG4gICAgICAgICAgICB0aGlzLl9oZWFydEJlYXROdW0gKys7XG4gICAgICAgICAgICBzdGFnZS5oZWFydEJlYXQgJiYgc3RhZ2UuaGVhcnRCZWF0KCBvcHQgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q3VycmVudFdpZHRoIDogZnVuY3Rpb24oKXtcbiAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy5jb250ZXh0LndpZHRoICogdGhpcy5jb250ZXh0LnNjYWxlWCk7XG4gICAgfSxcbiAgICBnZXRDdXJyZW50SGVpZ2h0IDogZnVuY3Rpb24oKXtcbiAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy5jb250ZXh0LmhlaWdodCAqIHRoaXMuY29udGV4dC5zY2FsZVkpO1xuICAgIH0sXG4gICAgZ2V0U3RhZ2UgOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiggdGhpcy5zdGFnZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YWdlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcCA9IHRoaXM7XG4gICAgICAgIGlmIChwLnR5cGUgIT0gXCJzdGFnZVwiKXtcbiAgICAgICAgICB3aGlsZShwLnBhcmVudCkge1xuICAgICAgICAgICAgcCA9IHAucGFyZW50O1xuICAgICAgICAgICAgaWYgKHAudHlwZSA9PSBcInN0YWdlXCIpe1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwLnR5cGUgIT09IFwic3RhZ2VcIikge1xuICAgICAgICAgICAgLy/lpoLmnpzlvpfliLDnmoTpobbngrlkaXNwbGF5IOeahHR5cGXkuI3mmK9TdGFnZSzkuZ/lsLHmmK/or7TkuI3mmK9zdGFnZeWFg+e0oFxuICAgICAgICAgICAgLy/pgqPkuYjlj6rog73or7TmmI7ov5nkuKpw5omA5Luj6KGo55qE6aG256uvZGlzcGxheSDov5jmsqHmnInmt7vliqDliLBkaXNwbGF5TGlzdOS4re+8jOS5n+WwseaYr+ayoeacieayoea3u+WKoOWIsFxuICAgICAgICAgICAgLy9zdGFnZeiInuWPsOeahGNoaWxkZW7pmJ/liJfkuK3vvIzkuI3lnKjlvJXmk47muLLmn5PojIPlm7TlhoVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIC8v5LiA55u05Zue5rqv5Yiw6aG25bGCb2JqZWN077yMIOWNs+aYr3N0YWdl77yMIHN0YWdl55qEcGFyZW505Li6bnVsbFxuICAgICAgICB0aGlzLnN0YWdlID0gcDtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfSxcbiAgICBsb2NhbFRvR2xvYmFsIDogZnVuY3Rpb24oIHBvaW50ICwgY29udGFpbmVyICl7XG4gICAgICAgICFwb2ludCAmJiAoIHBvaW50ID0gbmV3IFBvaW50KCAwICwgMCApICk7XG4gICAgICAgIHZhciBjbSA9IHRoaXMuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCBjb250YWluZXIgKTtcblxuICAgICAgICBpZiAoY20gPT0gbnVsbCkgcmV0dXJuIFBvaW50KCAwICwgMCApO1xuICAgICAgICB2YXIgbSA9IG5ldyBNYXRyaXgoMSwgMCwgMCwgMSwgcG9pbnQueCAsIHBvaW50LnkpO1xuICAgICAgICBtLmNvbmNhdChjbSk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIG0udHggLCBtLnR5ICk7IC8ve3g6bS50eCwgeTptLnR5fTtcbiAgICB9LFxuICAgIGdsb2JhbFRvTG9jYWwgOiBmdW5jdGlvbiggcG9pbnQgLCBjb250YWluZXIpIHtcbiAgICAgICAgIXBvaW50ICYmICggcG9pbnQgPSBuZXcgUG9pbnQoIDAgLCAwICkgKTtcblxuICAgICAgICBpZiggdGhpcy50eXBlID09IFwic3RhZ2VcIiApe1xuICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgICAgICB9XG4gICAgICAgIHZhciBjbSA9IHRoaXMuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCBjb250YWluZXIgKTtcblxuICAgICAgICBpZiAoY20gPT0gbnVsbCkgcmV0dXJuIG5ldyBQb2ludCggMCAsIDAgKTsgLy97eDowLCB5OjB9O1xuICAgICAgICBjbS5pbnZlcnQoKTtcbiAgICAgICAgdmFyIG0gPSBuZXcgTWF0cml4KDEsIDAsIDAsIDEsIHBvaW50LnggLCBwb2ludC55KTtcbiAgICAgICAgbS5jb25jYXQoY20pO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCBtLnR4ICwgbS50eSApOyAvL3t4Om0udHgsIHk6bS50eX07XG4gICAgfSxcbiAgICBsb2NhbFRvVGFyZ2V0IDogZnVuY3Rpb24oIHBvaW50ICwgdGFyZ2V0KXtcbiAgICAgICAgdmFyIHAgPSBsb2NhbFRvR2xvYmFsKCBwb2ludCApO1xuICAgICAgICByZXR1cm4gdGFyZ2V0Lmdsb2JhbFRvTG9jYWwoIHAgKTtcbiAgICB9LFxuICAgIGdldENvbmNhdGVuYXRlZE1hdHJpeCA6IGZ1bmN0aW9uKCBjb250YWluZXIgKXtcbiAgICAgICAgdmFyIGNtID0gbmV3IE1hdHJpeCgpO1xuICAgICAgICBmb3IgKHZhciBvID0gdGhpczsgbyAhPSBudWxsOyBvID0gby5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNtLmNvbmNhdCggby5fdHJhbnNmb3JtICk7XG4gICAgICAgICAgICBpZiggIW8ucGFyZW50IHx8ICggY29udGFpbmVyICYmIG8ucGFyZW50ICYmIG8ucGFyZW50ID09IGNvbnRhaW5lciApIHx8ICggby5wYXJlbnQgJiYgby5wYXJlbnQudHlwZT09XCJzdGFnZVwiICkgKSB7XG4gICAgICAgICAgICAvL2lmKCBvLnR5cGUgPT0gXCJzdGFnZVwiIHx8IChvLnBhcmVudCAmJiBjb250YWluZXIgJiYgby5wYXJlbnQudHlwZSA9PSBjb250YWluZXIudHlwZSApICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbTsvL2JyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbTtcbiAgICB9LFxuICAgIC8qXG4gICAgICrorr7nva7lhYPntKDnmoTmmK/lkKblk43lupTkuovku7bmo4DmtYtcbiAgICAgKkBib29sICBCb29sZWFuIOexu+Wei1xuICAgICAqL1xuICAgIHNldEV2ZW50RW5hYmxlIDogZnVuY3Rpb24oIGJvb2wgKXtcbiAgICAgICAgaWYoXy5pc0Jvb2xlYW4oYm9vbCkpe1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gYm9vbFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qXG4gICAgICrmn6Xor6Loh6rlt7HlnKhwYXJlbnTnmoTpmJ/liJfkuK3nmoTkvY3nva5cbiAgICAgKi9cbiAgICBnZXRJbmRleCAgIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIXRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKHRoaXMucGFyZW50LmNoaWxkcmVuICwgdGhpcylcbiAgICB9LFxuICAgIC8qXG4gICAgICrlhYPntKDlnKh66L205pa55ZCR5ZCR5LiL56e75YqoXG4gICAgICpAbnVtIOenu+WKqOeahOWxgue6p1xuICAgICAqL1xuICAgIHRvQmFjayA6IGZ1bmN0aW9uKCBudW0gKXtcbiAgICAgICAgaWYoIXRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcm9tSW5kZXggPSB0aGlzLmdldEluZGV4KCk7XG4gICAgICAgIHZhciB0b0luZGV4ID0gMDtcbiAgICAgICAgXG4gICAgICAgIGlmKF8uaXNOdW1iZXIoIG51bSApKXtcbiAgICAgICAgICBpZiggbnVtID09IDAgKXtcbiAgICAgICAgICAgICAvL+WOn+WcsOS4jeWKqFxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRvSW5kZXggPSBmcm9tSW5kZXggLSBudW07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKCBmcm9tSW5kZXggLCAxIClbMF07XG4gICAgICAgIGlmKCB0b0luZGV4IDwgMCApe1xuICAgICAgICAgICAgdG9JbmRleCA9IDA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkQXQoIG1lICwgdG9JbmRleCApO1xuICAgIH0sXG4gICAgLypcbiAgICAgKuWFg+e0oOWcqHrovbTmlrnlkJHlkJHkuIrnp7vliqhcbiAgICAgKkBudW0g56e75Yqo55qE5bGC5pWw6YePIOm7mOiupOWIsOmhtuerr1xuICAgICAqL1xuICAgIHRvRnJvbnQgOiBmdW5jdGlvbiggbnVtICl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnJvbUluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xuICAgICAgICB2YXIgcGNsID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB2YXIgdG9JbmRleCA9IHBjbDtcbiAgICAgICAgXG4gICAgICAgIGlmKF8uaXNOdW1iZXIoIG51bSApKXtcbiAgICAgICAgICBpZiggbnVtID09IDAgKXtcbiAgICAgICAgICAgICAvL+WOn+WcsOS4jeWKqFxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9JbmRleCA9IGZyb21JbmRleCArIG51bSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKCBmcm9tSW5kZXggLCAxIClbMF07XG4gICAgICAgIGlmKHRvSW5kZXggPiBwY2wpe1xuICAgICAgICAgICAgdG9JbmRleCA9IHBjbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZEF0KCBtZSAsIHRvSW5kZXgtMSApO1xuICAgIH0sXG4gICAgX3RyYW5zZm9ybUhhbmRlciA6IGZ1bmN0aW9uKCBjdHggKXtcbiAgICAgICAgdmFyIHRyYW5zRm9ybSA9IHRoaXMuX3RyYW5zZm9ybTtcbiAgICAgICAgaWYoICF0cmFuc0Zvcm0gKSB7XG4gICAgICAgICAgICB0cmFuc0Zvcm0gPSB0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/ov5DnlKjnn6npmLXlvIDlp4vlj5jlvaJcbiAgICAgICAgY3R4LnRyYW5zZm9ybS5hcHBseSggY3R4ICwgdHJhbnNGb3JtLnRvQXJyYXkoKSApO1xuICAgICAgICAvL2N0eC5nbG9iYWxBbHBoYSAqPSB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgfSxcbiAgICBfdXBkYXRlVHJhbnNmb3JtIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xuICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XG4gICAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIC8v5piv5ZCm6ZyA6KaBVHJhbnNmb3JtXG4gICAgICAgIGlmKGN0eC5zY2FsZVggIT09IDEgfHwgY3R4LnNjYWxlWSAhPT0xICl7XG4gICAgICAgICAgICAvL+WmguaenOaciee8qeaUvlxuICAgICAgICAgICAgLy/nvKnmlL7nmoTljp/ngrnlnZDmoIdcbiAgICAgICAgICAgIHZhciBvcmlnaW4gPSBuZXcgUG9pbnQoY3R4LnNjYWxlT3JpZ2luKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCAtb3JpZ2luLnggLCAtb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoIGN0eC5zY2FsZVggLCBjdHguc2NhbGVZICk7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggb3JpZ2luLnggLCBvcmlnaW4ueSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcm90YXRpb24gPSBjdHgucm90YXRpb247XG4gICAgICAgIGlmKCByb3RhdGlvbiApe1xuICAgICAgICAgICAgLy/lpoLmnpzmnInml4vovaxcbiAgICAgICAgICAgIC8v5peL6L2s55qE5Y6f54K55Z2Q5qCHXG4gICAgICAgICAgICB2YXIgb3JpZ2luID0gbmV3IFBvaW50KGN0eC5yb3RhdGVPcmlnaW4pO1xuICAgICAgICAgICAgaWYoIG9yaWdpbi54IHx8IG9yaWdpbi55ICl7XG4gICAgICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIC1vcmlnaW4ueCAsIC1vcmlnaW4ueSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RyYW5zZm9ybS5yb3RhdGUoIHJvdGF0aW9uICUgMzYwICogTWF0aC5QSS8xODAgKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCBvcmlnaW4ueCAsIG9yaWdpbi55ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy/lpoLmnpzmnInkvY3np7tcbiAgICAgICAgdmFyIHgseTtcbiAgICAgICAgaWYoIHRoaXMueHlUb0ludCAmJiAhdGhpcy5tb3ZlaW5nICl7XG4gICAgICAgICAgICAvL+W9k+i/meS4quWFg+e0oOWcqOWBmui9qOi/uei/kOWKqOeahOaXtuWAme+8jOavlOWmgmRyYWfvvIxhbmltYXRpb27lpoLmnpzlrp7ml7bnmoTosIPmlbTov5nkuKp4IO+8jCB5XG4gICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOeahOi9qOi/ueS8muaciei3s+i3g+eahOaDheWGteWPkeeUn+OAguaJgOS7peWKoOS4quadoeS7tui/h+a7pO+8jFxuICAgICAgICAgICAgdmFyIHggPSBwYXJzZUludCggY3R4LnggKTsvL01hdGgucm91bmQoY3R4LngpO1xuICAgICAgICAgICAgdmFyIHkgPSBwYXJzZUludCggY3R4LnkgKTsvL01hdGgucm91bmQoY3R4LnkpO1xuXG4gICAgICAgICAgICBpZiggcGFyc2VJbnQoY3R4LmxpbmVXaWR0aCAsIDEwKSAlIDIgPT0gMSAmJiBjdHguc3Ryb2tlU3R5bGUgKXtcbiAgICAgICAgICAgICAgICB4ICs9IDAuNTtcbiAgICAgICAgICAgICAgICB5ICs9IDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHggPSBjdHgueDtcbiAgICAgICAgICAgIHkgPSBjdHgueTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggeCAhPSAwIHx8IHkgIT0gMCApe1xuICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIHggLCB5ICk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybSA9IF90cmFuc2Zvcm07XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pZCtcIjp0eF9cIitfdHJhbnNmb3JtLnR4K1wiOmN4X1wiK3RoaXMuY29udGV4dC54KTtcblxuICAgICAgICByZXR1cm4gX3RyYW5zZm9ybTtcbiAgICB9LFxuICAgIC8v5pi+56S65a+56LGh55qE6YCJ5Y+W5qOA5rWL5aSE55CG5Ye95pWwXG4gICAgZ2V0Q2hpbGRJblBvaW50IDogZnVuY3Rpb24oIHBvaW50ICl7XG4gICAgICAgIHZhciByZXN1bHQ7IC8v5qOA5rWL55qE57uT5p6cXG5cbiAgICAgICAgLy/nrKzkuIDmraXvvIzlkKdnbG9i55qEcG9pbnTovazmjaLliLDlr7nlupTnmoRvYmrnmoTlsYLnuqflhoXnmoTlnZDmoIfns7vnu59cbiAgICAgICAgaWYoIHRoaXMudHlwZSAhPSBcInN0YWdlXCIgJiYgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQudHlwZSAhPSBcInN0YWdlXCIgKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXMucGFyZW50Lmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHggPSBwb2ludC54O1xuICAgICAgICB2YXIgeSA9IHBvaW50Lnk7XG5cbiAgICAgICAgLy/ov5nkuKrml7blgJnlpoLmnpzmnInlr7ljb250ZXh055qEc2V077yM5ZGK6K+J5byV5pOO5LiN6ZyA6KaBd2F0Y2jvvIzlm6DkuLrov5nkuKrmmK/lvJXmk47op6blj5HnmoTvvIzkuI3mmK/nlKjmiLdcbiAgICAgICAgLy/nlKjmiLdzZXQgY29udGV4dCDmiY3pnIDopoHop6blj5F3YXRjaFxuICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7XG4gICAgXG4gICAgICAgIC8v5a+56byg5qCH55qE5Z2Q5qCH5Lmf5YGa55u45ZCM55qE5Y+Y5o2iXG4gICAgICAgIGlmKCB0aGlzLl90cmFuc2Zvcm0gKXtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlTWF0cml4ID0gdGhpcy5fdHJhbnNmb3JtLmNsb25lKCkuaW52ZXJ0KCk7XG4gICAgICAgICAgICB2YXIgb3JpZ2luUG9zID0gW3gsIHldO1xuICAgICAgICAgICAgb3JpZ2luUG9zID0gaW52ZXJzZU1hdHJpeC5tdWxWZWN0b3IoIG9yaWdpblBvcyApO1xuXG4gICAgICAgICAgICB4ID0gb3JpZ2luUG9zWzBdO1xuICAgICAgICAgICAgeSA9IG9yaWdpblBvc1sxXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3JlY3QgPSB0aGlzLl9yZWN0ID0gdGhpcy5nZXRSZWN0KHRoaXMuY29udGV4dCk7XG5cbiAgICAgICAgaWYoIV9yZWN0KXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQud2lkdGggJiYgISFfcmVjdC53aWR0aCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoID0gX3JlY3Qud2lkdGg7XG4gICAgICAgIH07XG4gICAgICAgIGlmKCAhdGhpcy5jb250ZXh0LmhlaWdodCAmJiAhIV9yZWN0LmhlaWdodCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IF9yZWN0LmhlaWdodDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIV9yZWN0LndpZHRoIHx8ICFfcmVjdC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/mraPlvI/lvIDlp4vnrKzkuIDmraXnmoTnn6nlvaLojIPlm7TliKTmlq1cbiAgICAgICAgaWYgKCB4ICAgID49IF9yZWN0LnhcbiAgICAgICAgICAgICYmICB4IDw9IChfcmVjdC54ICsgX3JlY3Qud2lkdGgpXG4gICAgICAgICAgICAmJiAgeSA+PSBfcmVjdC55XG4gICAgICAgICAgICAmJiAgeSA8PSAoX3JlY3QueSArIF9yZWN0LmhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgIC8v6YKj5LmI5bCx5Zyo6L+Z5Liq5YWD57Sg55qE55+p5b2i6IyD5Zu05YaFXG4gICAgICAgICAgIHJlc3VsdCA9IEhpdFRlc3RQb2ludC5pc0luc2lkZSggdGhpcyAsIHtcbiAgICAgICAgICAgICAgIHggOiB4LFxuICAgICAgICAgICAgICAgeSA6IHlcbiAgICAgICAgICAgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WmguaenOi/nuefqeW9ouWGhemDveS4jeaYr++8jOmCo+S5iOiCr+WumueahO+8jOi/meS4quS4jeaYr+aIkeS7rOimgeaJvueahHNoYXBcbiAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIC8qXG4gICAgKiBhbmltYXRlXG4gICAgKiBAcGFyYW0gdG9Db250ZW50IOimgeWKqOeUu+WPmOW9ouWIsOeahOWxnuaAp+mbhuWQiFxuICAgICogQHBhcmFtIG9wdGlvbnMgdHdlZW4g5Yqo55S75Y+C5pWwXG4gICAgKi9cbiAgICBhbmltYXRlIDogZnVuY3Rpb24oIHRvQ29udGVudCAsIG9wdGlvbnMgKXtcbiAgICAgICAgdmFyIHRvID0gdG9Db250ZW50O1xuICAgICAgICB2YXIgZnJvbSA9IHt9O1xuICAgICAgICBmb3IoIHZhciBwIGluIHRvICl7XG4gICAgICAgICAgICBmcm9tWyBwIF0gPSB0aGlzLmNvbnRleHRbcF07XG4gICAgICAgIH07XG4gICAgICAgICFvcHRpb25zICYmIChvcHRpb25zID0ge30pO1xuICAgICAgICBvcHRpb25zLmZyb20gPSBmcm9tO1xuICAgICAgICBvcHRpb25zLnRvID0gdG87XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdXBGdW4gPSBmdW5jdGlvbigpe307XG4gICAgICAgIGlmKCBvcHRpb25zLm9uVXBkYXRlICl7XG4gICAgICAgICAgICB1cEZ1biA9IG9wdGlvbnMub25VcGRhdGU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0d2VlbjtcbiAgICAgICAgb3B0aW9ucy5vblVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL+WmguaenGNvbnRleHTkuI3lrZjlnKjor7TmmI7or6VvYmrlt7Lnu4/ooqtkZXN0cm955LqG77yM6YKj5LmI6KaB5oqK5LuW55qEdHdlZW7nu5lkZXN0cm95XG4gICAgICAgICAgICBpZiAoIXNlbGYuY29udGV4dCAmJiB0d2Vlbikge1xuICAgICAgICAgICAgICAgIEFuaW1hdGlvbkZyYW1lLmRlc3Ryb3lUd2Vlbih0d2Vlbik7XG4gICAgICAgICAgICAgICAgdHdlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IoIHZhciBwIGluIHRoaXMgKXtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRleHRbcF0gPSB0aGlzW3BdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHVwRnVuLmFwcGx5KHNlbGYgLCBbdGhpc10pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgY29tcEZ1biA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgaWYoIG9wdGlvbnMub25Db21wbGV0ZSApe1xuICAgICAgICAgICAgY29tcEZ1biA9IG9wdGlvbnMub25Db21wbGV0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAgICAgY29tcEZ1bi5hcHBseShzZWxmICwgYXJndW1lbnRzKVxuICAgICAgICB9O1xuICAgICAgICB0d2VlbiA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdFR3ZWVuKCBvcHRpb25zICk7XG4gICAgICAgIHJldHVybiB0d2VlbjtcbiAgICB9LFxuICAgIF9yZW5kZXIgOiBmdW5jdGlvbiggY3R4ICl7XHRcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQudmlzaWJsZSB8fCB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPD0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUhhbmRlciggY3R4ICk7XG5cbiAgICAgICAgLy/mlofmnKzmnInoh6rlt7HnmoTorr7nva7moLflvI/mlrnlvI9cbiAgICAgICAgaWYoIHRoaXMudHlwZSAhPSBcInRleHRcIiApIHtcbiAgICAgICAgICAgIFV0aWxzLnNldENvbnRleHRTdHlsZSggY3R4ICwgdGhpcy5jb250ZXh0LiRtb2RlbCApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoIGN0eCApO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0sXG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApIHtcbiAgICAgICAgLy/ln7rnsbvkuI3mj5DkvptyZW5kZXLnmoTlhbfkvZPlrp7njrDvvIznlLHlkI7nu63lhbfkvZPnmoTmtL7nlJ/nsbvlkIToh6rlrp7njrBcbiAgICB9LFxuICAgIC8v5LuO5qCR5Lit5Yig6ZmkXG4gICAgcmVtb3ZlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lhYPntKDnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/mioroh6rlt7Hku47niLboioLngrnkuK3liKDpmaTkuoblkI7lgZroh6rmiJHmuIXpmaTvvIzph4rmlL7lhoXlrZhcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dDtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BsYXlPYmplY3Q7XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzM+eahERpc3BsYXlMaXN0IOS4reeahOWuueWZqOexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XG5cbnZhciBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gZnVuY3Rpb24ob3B0KXtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuY2hpbGRyZW4gPSBbXTtcbiAgIHNlbGYubW91c2VDaGlsZHJlbiA9IFtdO1xuICAgRGlzcGxheU9iamVjdENvbnRhaW5lci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgIC8v5omA5pyJ55qE5a655Zmo6buY6K6k5pSv5oyBZXZlbnQg5qOA5rWL77yM5Zug5Li6IOWPr+iDveaciemHjOmdoueahHNoYXBl5pivZXZlbnRFbmFibGXmmK90cnVl55qEXG4gICAvL+WmguaenOeUqOaIt+acieW8uuWItueahOmcgOaxguiuqeWuueWZqOS4i+eahOaJgOacieWFg+e0oOmDvSDkuI3lj6/mo4DmtYvvvIzlj6/ku6XosIPnlKhcbiAgIC8vRGlzcGxheU9iamVjdENvbnRhaW5lcueahCBzZXRFdmVudEVuYWJsZSgpIOaWueazlVxuICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3RDb250YWluZXIgLCBEaXNwbGF5T2JqZWN0ICwge1xuICAgIGFkZENoaWxkIDogZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICBpZiggIWNoaWxkICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBpZih0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpICE9IC0xKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9O1xuICAgICAgICAvL+WmguaenOS7luWcqOWIq+eahOWtkOWFg+e0oOS4re+8jOmCo+S5iOWwseS7juWIq+S6uumCo+mHjOWIoOmZpOS6hlxuICAgICAgICBpZihjaGlsZC5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaCggY2hpbGQgKTtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJBZGRDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyQWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIGFkZENoaWxkQXQgOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgaWYodGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMSkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy/kuIrmiqVjaGlsZHJlbuW/g+i3s1xuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckFkZENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJBZGRDaGlsZChjaGlsZCxpbmRleCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGQgOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDaGlsZEF0KF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICkpO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGRBdCA6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckRlbENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJEZWxDaGlsZChjaGlsZCAsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkQnlJZCA6IGZ1bmN0aW9uKCBpZCApIHtcdFxuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2hpbGRBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICByZW1vdmVBbGxDaGlsZHJlbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGlsZSh0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRBdCgwKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/pm4blkIjnsbvnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/kvp3mrKHplIDmr4HmiYDmnInlrZDlhYPntKBcbiAgICAgICAgZm9yICh2YXIgaT0wLGw9dGhpcy5jaGlsZHJlbi5sZW5ndGggOyBpPGwgOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZEF0KGkpLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGwtLTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8qXG4gICAgICpAaWQg5YWD57Sg55qEaWRcbiAgICAgKkBib29sZW4g5piv5ZCm5rex5bqm5p+l6K+i77yM6buY6K6k5bCx5Zyo56ys5LiA5bGC5a2Q5YWD57Sg5Lit5p+l6K+iXG4gICAgICoqL1xuICAgIGdldENoaWxkQnlJZCA6IGZ1bmN0aW9uKGlkICwgYm9vbGVuKXtcbiAgICAgICAgaWYoIWJvb2xlbikge1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+a3seW6puafpeivolxuICAgICAgICAgICAgLy9UT0RPOuaaguaXtuacquWunueOsFxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldENoaWxkQXQgOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgIH0sXG4gICAgZ2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApO1xuICAgIH0sXG4gICAgc2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCl7XG4gICAgICAgIGlmKGNoaWxkLnBhcmVudCAhPSB0aGlzKSByZXR1cm47XG4gICAgICAgIHZhciBvbGRJbmRleCA9IF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICk7XG4gICAgICAgIGlmKGluZGV4ID09IG9sZEluZGV4KSByZXR1cm47XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKG9sZEluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKTtcbiAgICB9LFxuICAgIGdldE51bUNoaWxkcmVuIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB9LFxuICAgIC8v6I635Y+WeCx554K55LiK55qE5omA5pyJb2JqZWN0ICBudW0g6ZyA6KaB6L+U5Zue55qEb2Jq5pWw6YePXG4gICAgZ2V0T2JqZWN0c1VuZGVyUG9pbnQgOiBmdW5jdGlvbiggcG9pbnQgLCBudW0pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yKHZhciBpID0gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgaWYoIGNoaWxkID09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAoIWNoaWxkLl9ldmVudEVuYWJsZWQgJiYgIWNoaWxkLmRyYWdFbmFibGVkKSB8fCBcbiAgICAgICAgICAgICAgICAhY2hpbGQuY29udGV4dC52aXNpYmxlIFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggY2hpbGQgaW5zdGFuY2VvZiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICkge1xuICAgICAgICAgICAgICAgIC8v5piv6ZuG5ZCIXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm1vdXNlQ2hpbGRyZW4gJiYgY2hpbGQuZ2V0TnVtQ2hpbGRyZW4oKSA+IDApe1xuICAgICAgICAgICAgICAgICAgIHZhciBvYmpzID0gY2hpbGQuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIHBvaW50ICk7XG4gICAgICAgICAgICAgICAgICAgaWYgKG9ianMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCggb2JqcyApO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XHRcdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+mdnumbhuWQiO+8jOWPr+S7peW8gOWni+WBmmdldENoaWxkSW5Qb2ludOS6hlxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5nZXRDaGlsZEluUG9pbnQoIHBvaW50ICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobnVtICE9IHVuZGVmaW5lZCAmJiAhaXNOYU4obnVtKSl7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdC5sZW5ndGggPT0gbnVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICByZW5kZXIgOiBmdW5jdGlvbiggY3R4ICkge1xuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9yZW5kZXIoIGN0eCApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICogc3RhZ2Ug57G777yMIOWGjWFzM+S4re+8jHN0YWdl5YiZ5Luj6KGo5pW05Liq6Iie5Y+w44CC5piv5ZSv5LiA55qE5qC56IqC54K5XG4gKiDkvYbmmK/lho1jYW52YXjkuK3vvIzlm6DkuLrliIblsYLorr7orqHnmoTpnIDopoHjgIJzdGFnZSDoiJ7lj7Ag5ZCM5qC35Luj6KGo5LiA5LiqY2FudmFz5YWD57Sg77yM5L2G5piv5LiN5piv5YaN5pW05Liq5byV5pOO6K6+6K6hXG4gKiDph4zpnaLvvIwg5LiN5piv5ZSv5LiA55qE5qC56IqC54K544CC6ICM5piv5Lya5Lqk55SxY2FudmF457G75p2l57uf5LiA566h55CG5YW25bGC57qnXG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFN0YWdlID0gZnVuY3Rpb24oICl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudHlwZSA9IFwic3RhZ2VcIjtcbiAgICBzZWxmLmNvbnRleHQyRCA9IG51bGw7XG4gICAgLy9zdGFnZeato+WcqOa4suafk+S4rVxuICAgIHNlbGYuc3RhZ2VSZW5kaW5nID0gZmFsc2U7XG4gICAgc2VsZi5faXNSZWFkeSA9IGZhbHNlO1xuICAgIFN0YWdlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5VdGlscy5jcmVhdENsYXNzKCBTdGFnZSAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL+eUsWNhbnZheOeahGFmdGVyQWRkQ2hpbGQg5Zue6LCDXG4gICAgaW5pdFN0YWdlIDogZnVuY3Rpb24oIGNvbnRleHQyRCAsIHdpZHRoICwgaGVpZ2h0ICl7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIHNlbGYuY29udGV4dDJEID0gY29udGV4dDJEO1xuICAgICAgIHNlbGYuY29udGV4dC53aWR0aCAgPSB3aWR0aDtcbiAgICAgICBzZWxmLmNvbnRleHQuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgIHNlbGYuY29udGV4dC5zY2FsZVggPSBVdGlscy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVZID0gVXRpbHMuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgc2VsZi5faXNSZWFkeSA9IHRydWU7XG4gICAgfSxcbiAgICByZW5kZXIgOiBmdW5jdGlvbiggY29udGV4dCApe1xuICAgICAgICB0aGlzLnN0YWdlUmVuZGluZyA9IHRydWU7XG4gICAgICAgIC8vVE9ET++8mlxuICAgICAgICAvL2NsZWFyIOeci+S8vCDlvojlkIjnkIbvvIzkvYbmmK/lhbblrp7lnKjml6DnirbmgIHnmoRjYXZuYXPnu5jlm77kuK3vvIzlhbblrp7msqHlv4XopoHmiafooYzkuIDmraXlpJrkvZnnmoRjbGVhcuaTjeS9nFxuICAgICAgICAvL+WPjeiAjOWinuWKoOaXoOiwk+eahOW8gOmUgO+8jOWmguaenOWQjue7reimgeWBmuiEj+efqemYteWIpOaWreeahOivneOAguWcqOivtFxuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIFN0YWdlLnN1cGVyY2xhc3MucmVuZGVyLmNhbGwoIHRoaXMsIGNvbnRleHQgKTtcbiAgICAgICAgdGhpcy5zdGFnZVJlbmRpbmcgPSBmYWxzZTtcbiAgICB9LFxuICAgIGhlYXJ0QmVhdCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgLy9zaGFwZSAsIG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlIFxuICAgICAgICAvL2Rpc3BsYXlMaXN05Lit5p+Q5Liq5bGe5oCn5pS55Y+Y5LqGXG4gICAgICAgIGlmICghdGhpcy5faXNSZWFkeSkge1xuICAgICAgICAgICAvL+WcqHN0YWdl6L+Y5rKh5Yid5aeL5YyW5a6M5q+V55qE5oOF5Ya15LiL77yM5peg6ZyA5YGa5Lu75L2V5aSE55CGXG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0IHx8ICggb3B0ID0ge30gKTsgLy/lpoLmnpxvcHTkuLrnqbrvvIzor7TmmI7lsLHmmK/ml6DmnaHku7bliLfmlrBcbiAgICAgICAgb3B0LnN0YWdlICAgPSB0aGlzO1xuXG4gICAgICAgIC8vVE9ET+S4tOaXtuWFiOi/meS5iOWkhOeQhlxuICAgICAgICB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5oZWFydEJlYXQob3B0KTtcbiAgICB9LFxuICAgIGNsZWFyIDogZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID49IDQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dDJELmNsZWFyUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dDJELmNsZWFyUmVjdCggMCwgMCwgdGhpcy5wYXJlbnQud2lkdGggLCB0aGlzLnBhcmVudC5oZWlnaHQgKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgU3RhZ2U7IiwiXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IF9fVkVSU0lPTl9fO1xuXG5leHBvcnQgY29uc3QgUElfMiA9IE1hdGguUEkgKiAyO1xuXG5leHBvcnQgY29uc3QgUkFEX1RPX0RFRyA9IDE4MCAvIE1hdGguUEk7XG5cbmV4cG9ydCBjb25zdCBERUdfVE9fUkFEID0gTWF0aC5QSSAvIDE4MDtcblxuZXhwb3J0IGNvbnN0IFJFTkRFUkVSX1RZUEUgPSB7XG4gICAgVU5LTk9XTjogICAgMCxcbiAgICBXRUJHTDogICAgICAxLFxuICAgIENBTlZBUzogICAgIDIsXG59O1xuXG5leHBvcnQgY29uc3QgRFJBV19NT0RFUyA9IHtcbiAgICBQT0lOVFM6ICAgICAgICAgMCxcbiAgICBMSU5FUzogICAgICAgICAgMSxcbiAgICBMSU5FX0xPT1A6ICAgICAgMixcbiAgICBMSU5FX1NUUklQOiAgICAgMyxcbiAgICBUUklBTkdMRVM6ICAgICAgNCxcbiAgICBUUklBTkdMRV9TVFJJUDogNSxcbiAgICBUUklBTkdMRV9GQU46ICAgNixcbn07XG5cbmV4cG9ydCBjb25zdCBTSEFQRVMgPSB7XG4gICAgUE9MWTogMCxcbiAgICBSRUNUOiAxLFxuICAgIENJUkM6IDIsXG4gICAgRUxJUDogMyxcbiAgICBSUkVDOiA0LFxufTtcblxuXG4iLCJpbXBvcnQgeyBSRU5ERVJFUl9UWVBFIH0gZnJvbSAnLi4vY29uc3QnO1xuaW1wb3J0IEFuaW1hdGlvbkZyYW1lIGZyb20gXCIuLi9hbmltYXRpb24vQW5pbWF0aW9uRnJhbWVcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3lzdGVtUmVuZGVyZXIgXG57XG4gICAgY29uc3RydWN0b3IoIHR5cGU9UkVOREVSRVJfVFlQRS5VTktOT1dOICwgYXBwIClcbiAgICB7XG4gICAgXHR0aGlzLnR5cGUgPSB0eXBlOyAvLzJjYW52YXMsMXdlYmdsXG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdEFpZCA9IG51bGw7XG5cbiAgICAgICAgLy/mr4/luKfnlLHlv4Pot7PkuIrmiqXnmoQg6ZyA6KaB6YeN57uY55qEc3RhZ2VzIOWIl+ihqFxuXHRcdHRoaXMuY29udmVydFN0YWdlcyA9IHt9O1xuXG5cdFx0dGhpcy5faGVhcnRCZWF0ID0gZmFsc2U7Ly/lv4Pot7PvvIzpu5jorqTkuLpmYWxzZe+8jOWNs2ZhbHNl55qE5pe25YCZ5byV5pOO5aSE5LqO6Z2Z6buY54q25oCBIHRydWXliJnlkK/liqjmuLLmn5NcblxuXHRcdHRoaXMuX3ByZVJlbmRlclRpbWUgPSAwO1xuXG5cdFx0Ly/ku7vliqHliJfooagsIOWmguaenF90YXNrTGlzdCDkuI3kuLrnqbrvvIzpgqPkuYjkuLvlvJXmk47lsLHkuIDnm7Tot5Fcblx0XHQvL+S4uiDlkKvmnIllbnRlckZyYW1lIOaWueazlSBEaXNwbGF5T2JqZWN0IOeahOWvueixoeWIl+ihqFxuXHRcdC8v5q+U5aaCIE1vdmllY2xpcCDnmoRlbnRlckZyYW1l5pa55rOV44CCXG5cdFx0Ly/mlLnlsZ7mgKfnm67liY3kuLvopoHmmK8gbW92aWVjbGlwIOS9v+eUqFxuXHRcdHRoaXMuX3Rhc2tMaXN0ID0gW107XG5cblx0XHR0aGlzLl9idWZmZXJTdGFnZSA9IG51bGw7XG5cblx0XHR0aGlzLl9pc1JlYWR5ICAgID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy/lpoLmnpzlvJXmk47lpITkuo7pnZnpu5jnirbmgIHnmoTor53vvIzlsLHkvJrlkK/liqhcbiAgICBzdGFydEVudGVyKClcbiAgICB7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKCAhc2VsZi5yZXF1ZXN0QWlkICl7XG4gICAgICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdEZyYW1lKCB7XG4gICAgICAgICAgICAgICBpZCA6IFwiZW50ZXJGcmFtZVwiLCAvL+WQjOaXtuiCr+WumuWPquacieS4gOS4qmVudGVyRnJhbWXnmoR0YXNrXG4gICAgICAgICAgICAgICB0YXNrIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbnRlckZyYW1lLmFwcGx5KHNlbGYpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICB9ICk7XG4gICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyRnJhbWUoKVxuICAgIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+S4jeeuoeaAjuS5iOagt++8jGVudGVyRnJhbWXmiafooYzkuoblsLHopoHmiopcbiAgICAgICAgLy9yZXF1ZXN0QWlkIG51bGwg5o6JXG4gICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IG51bGw7XG4gICAgICAgIFV0aWxzLm5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiggc2VsZi5faGVhcnRCZWF0ICl7XG4gICAgICAgICAgICBfLmVhY2goXy52YWx1ZXMoIHNlbGYuY29udmVydFN0YWdlcyApICwgZnVuY3Rpb24oY29udmVydFN0YWdlKXtcbiAgICAgICAgICAgICAgIGNvbnZlcnRTdGFnZS5zdGFnZS5fcmVuZGVyKCBjb252ZXJ0U3RhZ2Uuc3RhZ2UuY29udGV4dDJEICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzID0ge307XG4gICAgICAgICAgICAvL+a4suafk+WujOS6hu+8jOaJk+S4iuacgOaWsOaXtumXtOaMq1xuICAgICAgICAgICAgc2VsZi5fcHJlUmVuZGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8v5YWI6LeR5Lu75Yqh6Zif5YiXLOWboOS4uuacieWPr+iDveWGjeWFt+S9k+eahGhhbmRlcuS4reS8muaKiuiHquW3sea4hemZpOaOiVxuICAgICAgICAvL+aJgOS7pei3keS7u+WKoeWSjOS4i+mdoueahGxlbmd0aOajgOa1i+WIhuW8gOadpVxuICAgICAgICBpZihzZWxmLl90YXNrTGlzdC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgZm9yKHZhciBpPTAsbCA9IHNlbGYuX3Rhc2tMaXN0Lmxlbmd0aCA7IGkgPCBsIDsgaSsrICl7XG4gICAgICAgICAgICAgIHZhciBvYmogPSBzZWxmLl90YXNrTGlzdFtpXTtcbiAgICAgICAgICAgICAgaWYob2JqLmVudGVyRnJhbWUpe1xuICAgICAgICAgICAgICAgICBvYmouZW50ZXJGcmFtZSgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICBzZWxmLl9fdGFza0xpc3Quc3BsaWNlKGktLSAsIDEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH0gIFxuICAgICAgICB9O1xuICAgICAgICAvL+WmguaenOS+neeEtui/mOacieS7u+WKoeOAgiDlsLHnu6fnu61lbnRlckZyYW1lLlxuICAgICAgICBpZihzZWxmLl90YXNrTGlzdC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgc2VsZi5zdGFydEVudGVyKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2NvbnZlcnRDYW52YXgob3B0KVxuICAgIHtcbiAgICAgICAgXy5lYWNoKCB0aGlzLmFwcC5jaGlsZHJlbiAsIGZ1bmN0aW9uKHN0YWdlKXtcbiAgICAgICAgXHQvL1RPRE866L+Z6YeM55So5Yiw5LqGY29udGV4dFxuICAgICAgICAgICAgc3RhZ2UuY29udGV4dFtvcHQubmFtZV0gPSBvcHQudmFsdWU7IFxuICAgICAgICB9ICk7ICBcbiAgICB9XG5cbiAgICBoZWFydEJlYXQoIG9wdCApXG4gICAge1xuICAgICAgICAvL2Rpc3BsYXlMaXN05Lit5p+Q5Liq5bGe5oCn5pS55Y+Y5LqGXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYoIG9wdCApe1xuICAgICAgICAgICAgLy/lv4Pot7PljIXmnInkuKTnp43vvIzkuIDnp43mmK/mn5DlhYPntKDnmoTlj6/op4blsZ7mgKfmlLnlj5jkuobjgILkuIDnp43mmK9jaGlsZHJlbuacieWPmOWKqFxuICAgICAgICAgICAgLy/liIbliKvlr7nlupRjb252ZXJ0VHlwZSAg5Li6IGNvbnRleHQgIGFuZCBjaGlsZHJlblxuICAgICAgICAgICAgaWYgKG9wdC5jb252ZXJ0VHlwZSA9PSBcImNvbnRleHRcIil7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlICAgPSBvcHQuc3RhZ2U7XG4gICAgICAgICAgICAgICAgdmFyIHNoYXBlICAgPSBvcHQuc2hhcGU7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgICAgPSBvcHQubmFtZTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgICA9IG9wdC52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlVmFsdWU9IG9wdC5wcmVWYWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmICghc2VsZi5faXNSZWFkeSkge1xuICAgICAgICAgICAgICAgICAgICAvL+WcqOi/mOayoeWIneWni+WMluWujOavleeahOaDheWGteS4i++8jOaXoOmcgOWBmuS7u+S9leWkhOeQhlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmKCBzaGFwZS50eXBlID09IFwiY2FudmF4XCIgKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fY29udmVydENhbnZheChvcHQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYoc2hhcGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmNvbnZlcnRTdGFnZXNbIHN0YWdlLmlkIF0uY29udmVydFNoYXBlc1sgc2hhcGUuaWQgXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzWyBzdGFnZS5pZCBdLmNvbnZlcnRTaGFwZXNbIHNoYXBlLmlkIF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFwZSA6IHNoYXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IG9wdC5jb252ZXJ0VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzlt7Lnu4/kuIrmiqXkuobor6Ugc2hhcGUg55qE5b+D6Lez44CCXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChvcHQuY29udmVydFR5cGUgPT0gXCJjaGlsZHJlblwiKXtcbiAgICAgICAgICAgICAgICAvL+WFg+e0oOe7k+aehOWPmOWMlu+8jOavlOWmgmFkZGNoaWxkIHJlbW92ZUNoaWxk562JXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IG9wdC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gb3B0LnNyYy5nZXRTdGFnZSgpO1xuICAgICAgICAgICAgICAgIGlmKCBzdGFnZSB8fCAodGFyZ2V0LnR5cGU9PVwic3RhZ2VcIikgKXtcbiAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpzmk43kvZznmoTnm67moIflhYPntKDmmK9TdGFnZVxuICAgICAgICAgICAgICAgICAgICBzdGFnZSA9IHN0YWdlIHx8IHRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlIDogc3RhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFvcHQuY29udmVydFR5cGUpe1xuICAgICAgICAgICAgICAgIC8v5peg5p2h5Lu26KaB5rGC5Yi35pawXG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlID0gb3B0LnN0YWdlO1xuICAgICAgICAgICAgICAgIGlmKCFzZWxmLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF09e1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5peg5p2h5Lu26KaB5rGC5YWo6YOo5Yi35paw77yM5LiA6Iis55So5ZyocmVzaXpl562J44CCXG4gICAgICAgICAgICBfLmVhY2goIHNlbGYuYXBwLmNoaWxkcmVuICwgZnVuY3Rpb24oIHN0YWdlICwgaSApe1xuICAgICAgICAgICAgICAgIHNlbGYuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgY29udmVydFNoYXBlcyA6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoIXNlbGYuX2hlYXJ0QmVhdCl7XG4gICAgICAgICAgIC8v5aaC5p6c5Y+R546w5byV5pOO5Zyo6Z2Z6buY54q25oCB77yM6YKj5LmI5bCx5ZSk6YaS5byV5pOOXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgICAgIHNlbGYuc3RhcnRFbnRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WQpuWImeaZuuaFp+e7p+e7reehruiupOW/g+i3s1xuICAgICAgICAgICBzZWxmLl9oZWFydEJlYXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IFN5c3RlbVJlbmRlcmVyIGZyb20gJy4uL1N5c3RlbVJlbmRlcmVyJztcbmltcG9ydCB7IFJFTkRFUkVSX1RZUEUgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1JlbmRlcmVyIGV4dGVuZHMgU3lzdGVtUmVuZGVyZXJcbntcbiAgICBjb25zdHJ1Y3RvcihhcHApXG4gICAge1xuICAgICAgICBzdXBlcihSRU5ERVJFUl9UWVBFLkNBTlZBUywgYXBwKTtcbiAgICB9XG59XG5cbiIsIi8qKlxuICogQXBwbGljYXRpb24ge3tQS0dfVkVSU0lPTn19XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS4u+W8leaTjiDnsbtcbiAqXG4gKiDotJ/otKPmiYDmnIljYW52YXPnmoTlsYLnuqfnrqHnkIbvvIzlkozlv4Pot7PmnLrliLbnmoTlrp7njrAs5o2V6I635Yiw5b+D6Lez5YyF5ZCOIFxuICog5YiG5Y+R5Yiw5a+55bqU55qEc3RhZ2UoY2FudmFzKeadpee7mOWItuWvueW6lOeahOaUueWKqFxuICog54S25ZCOIOm7mOiupOacieWunueOsOS6hnNoYXBl55qEIG1vdXNlb3ZlciAgbW91c2VvdXQgIGRyYWcg5LqL5Lu2XG4gKlxuICoqL1xuXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBTdGFnZSBmcm9tIFwiLi9kaXNwbGF5L1N0YWdlXCI7XG5pbXBvcnQgUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlclwiXG5cblxuLy91dGlsc1xuaW1wb3J0IF8gZnJvbSBcIi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0ICQgZnJvbSBcIi4vdXRpbHMvZG9tXCI7XG5cblxudmFyIEFwcGxpY2F0aW9uID0gZnVuY3Rpb24oIG9wdCApe1xuICAgIHRoaXMudHlwZSA9IFwiY2FudmF4XCI7XG4gICAgdGhpcy5fY2lkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyBcIl9cIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDApOyBcbiAgICBcbiAgICB0aGlzLmVsID0gJC5xdWVyeShvcHQuZWwpO1xuXG4gICAgdGhpcy53aWR0aCA9IHBhcnNlSW50KFwid2lkdGhcIiAgaW4gb3B0IHx8IHRoaXMuZWwub2Zmc2V0V2lkdGggICwgMTApOyBcbiAgICB0aGlzLmhlaWdodCA9IHBhcnNlSW50KFwiaGVpZ2h0XCIgaW4gb3B0IHx8IHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICwgMTApOyBcblxuICAgIHZhciB2aWV3T2JqID0gJC5jcmVhdGVWaWV3KHRoaXMud2lkdGggLCB0aGlzLmhlaWdodCwgdGhpcy5fY2lkKTtcbiAgICB0aGlzLnZpZXcgPSB2aWV3T2JqLnZpZXc7XG4gICAgdGhpcy5zdGFnZV9jID0gdmlld09iai5zdGFnZV9jO1xuICAgIHRoaXMuZG9tX2MgPSB2aWV3T2JqLmRvbV9jO1xuXG4gICAgXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoIHRoaXMudmlldyApO1xuXG4gICAgdGhpcy52aWV3T2Zmc2V0ID0gJC5vZmZzZXQodGhpcy52aWV3KTtcbiAgICB0aGlzLmxhc3RHZXRSTyA9IDA7Ly/mnIDlkI7kuIDmrKHojrflj5Ygdmlld09mZnNldCDnmoTml7bpl7RcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoKTtcblxuICAgIHRoaXMuZXZlbnQgPSBudWxsO1xuXG4gICAgLy/mmK/lkKbpmLvmraLmtY/op4jlmajpu5jorqTkuovku7bnmoTmiafooYxcbiAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICBpZiggb3B0LnByZXZlbnREZWZhdWx0ID09PSBmYWxzZSApe1xuICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gZmFsc2VcbiAgICB9O1xuXG4gICAgQXBwbGljYXRpb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhBcHBsaWNhdGlvbiAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY29udGV4dC53aWR0aCAgPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7IFxuXG4gICAgICAgIC8v54S25ZCO5Yib5bu65LiA5Liq55So5LqO57uY5Yi25r+A5rS7IHNoYXBlIOeahCBzdGFnZSDliLBhY3RpdmF0aW9uXG4gICAgICAgIHRoaXMuX2NyZWF0SG92ZXJTdGFnZSgpO1xuXG4gICAgICAgIC8v5Yib5bu65LiA5Liq5aaC5p6c6KaB55So5YOP57Sg5qOA5rWL55qE5pe25YCZ55qE5a655ZmoXG4gICAgICAgIHRoaXMuX2NyZWF0ZVBpeGVsQ29udGV4dCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5faXNSZWFkeSA9IHRydWU7XG4gICAgfSxcbiAgICByZWdpc3RFdmVudCA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIC8v5Yid5aeL5YyW5LqL5Lu25aeU5omY5Yiwcm9vdOWFg+e0oOS4iumdolxuICAgICAgICB0aGlzLmV2ZW50ID0gbmV3IEV2ZW50SGFuZGxlciggdGhpcyAsIG9wdCk7O1xuICAgICAgICB0aGlzLmV2ZW50LmluaXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnQ7XG4gICAgfSxcbiAgICByZXNpemUgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgIC8v6YeN5paw6K6+572u5Z2Q5qCH57O757ufIOmrmOWuvSDnrYnjgIJcbiAgICAgICAgdGhpcy53aWR0aCAgICAgID0gcGFyc2VJbnQoKG9wdCAmJiBcIndpZHRoXCIgaW4gb3B0KSB8fCB0aGlzLmVsLm9mZnNldFdpZHRoICAsIDEwKTsgXG4gICAgICAgIHRoaXMuaGVpZ2h0ICAgICA9IHBhcnNlSW50KChvcHQgJiYgXCJoZWlnaHRcIiBpbiBvcHQpIHx8IHRoaXMuZWwub2Zmc2V0SGVpZ2h0ICwgMTApOyBcblxuICAgICAgICB0aGlzLnZpZXcuc3R5bGUud2lkdGggID0gdGhpcy53aWR0aCArXCJweFwiO1xuICAgICAgICB0aGlzLnZpZXcuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQrXCJweFwiO1xuXG4gICAgICAgIHRoaXMudmlld09mZnNldCAgICAgPSAkLm9mZnNldCh0aGlzLnZpZXcpO1xuICAgICAgICB0aGlzLl9ub3RXYXRjaCAgICAgID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoICA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggICAgICA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByZVNpemVDYW52YXMgICAgPSBmdW5jdGlvbihjdHgpe1xuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGN0eC5jYW52YXM7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBtZS53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQ9IG1lLmhlaWdodCsgXCJweFwiO1xuICAgICAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIgICwgbWUud2lkdGggKiBVdGlscy5fZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIgLCBtZS5oZWlnaHQqIFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvKTtcblxuICAgICAgICAgICAgLy/lpoLmnpzmmK9zd2bnmoTor53lsLHov5jopoHosIPnlKjov5nkuKrmlrnms5XjgIJcbiAgICAgICAgICAgIGlmIChjdHgucmVzaXplKSB7XG4gICAgICAgICAgICAgICAgY3R4LnJlc2l6ZShtZS53aWR0aCAsIG1lLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07IFxuICAgICAgICBfLmVhY2godGhpcy5jaGlsZHJlbiAsIGZ1bmN0aW9uKHMgLCBpKXtcbiAgICAgICAgICAgIHMuX25vdFdhdGNoICAgICA9IHRydWU7XG4gICAgICAgICAgICBzLmNvbnRleHQud2lkdGggPSBtZS53aWR0aDtcbiAgICAgICAgICAgIHMuY29udGV4dC5oZWlnaHQ9IG1lLmhlaWdodDtcbiAgICAgICAgICAgIHJlU2l6ZUNhbnZhcyhzLmNvbnRleHQyRCk7XG4gICAgICAgICAgICBzLl9ub3RXYXRjaCAgICAgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kb21fYy5zdHlsZS53aWR0aCAgPSB0aGlzLndpZHRoICArIFwicHhcIjtcbiAgICAgICAgdGhpcy5kb21fYy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArIFwicHhcIjtcblxuICAgICAgICB0aGlzLmhlYXJ0QmVhdCgpO1xuXG4gICAgfSxcbiAgICBnZXRIb3ZlclN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlclN0YWdlO1xuICAgIH0sXG4gICAgX2NyZWF0SG92ZXJTdGFnZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vVE9ETzrliJvlu7pzdGFnZeeahOaXtuWAmeS4gOWumuimgeS8oOWFpXdpZHRoIGhlaWdodCAg5Lik5Liq5Y+C5pWwXG4gICAgICAgIHRoaXMuX2J1ZmZlclN0YWdlID0gbmV3IFN0YWdlKCB7XG4gICAgICAgICAgICBpZCA6IFwiYWN0aXZDYW52YXNcIisobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgY29udGV4dCA6IHtcbiAgICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMuY29udGV4dC53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29udGV4dC5oZWlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuICAgICAgICAvL+ivpXN0YWdl5LiN5Y+C5LiO5LqL5Lu25qOA5rWLXG4gICAgICAgIHRoaXMuX2J1ZmZlclN0YWdlLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCggdGhpcy5fYnVmZmVyU3RhZ2UgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOeUqOadpeajgOa1i+aWh+acrHdpZHRoIGhlaWdodCBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOS4iuS4i+aWh1xuICAgICovXG4gICAgX2NyZWF0ZVBpeGVsQ29udGV4dCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX3BpeGVsQ2FudmFzID0gJC5xdWVyeShcIl9waXhlbENhbnZhc1wiKTtcbiAgICAgICAgaWYoIV9waXhlbENhbnZhcyl7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMgPSAkLmNyZWF0ZUNhbnZhcygwLCAwLCBcIl9waXhlbENhbnZhc1wiKTsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WmguaenOWPiOeahOivnSDlsLHkuI3pnIDopoHlnKjliJvlu7rkuoZcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggX3BpeGVsQ2FudmFzICk7XG4gICAgICAgIFV0aWxzLmluaXRFbGVtZW50KCBfcGl4ZWxDYW52YXMgKTtcbiAgICAgICAgaWYoIFV0aWxzLmNhbnZhc1N1cHBvcnQoKSApe1xuICAgICAgICAgICAgLy9jYW52YXPnmoTor53vvIzlk6rmgJXmmK9kaXNwbGF5Om5vbmXnmoTpobXlj6/ku6XnlKjmnaXlt6blg4/ntKDmo4DmtYvlkoxtZWFzdXJlVGV4dOaWh+acrHdpZHRo5qOA5rWLXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuZGlzcGxheSAgICA9IFwibm9uZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9mbGFzaENhbnZhcyDnmoTor53vvIxzd2blpoLmnpxkaXNwbGF5Om5vbmXkuobjgILlsLHlgZrkuI3kuoZtZWFzdXJlVGV4dCDmlofmnKzlrr3luqYg5qOA5rWL5LqGXG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUuekluZGV4ICAgICA9IC0xO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnBvc2l0aW9uICAgPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUubGVmdCAgICAgICA9IC0gdGhpcy5jb250ZXh0LndpZHRoICArIFwicHhcIjtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS50b3AgICAgICAgID0gLSB0aGlzLmNvbnRleHQuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG4gICAgICAgIFV0aWxzLl9waXhlbEN0eCA9IF9waXhlbENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH0sXG4gICAgdXBkYXRlVmlld09mZnNldCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaWYoIG5vdyAtIHRoaXMubGFzdEdldFJPID4gMTAwMCApe1xuICAgICAgICAgICAgdGhpcy52aWV3T2Zmc2V0ICAgICAgPSAkLm9mZnNldCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgdGhpcy5sYXN0R2V0Uk8gICAgICAgPSBub3c7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIF9hZnRlckFkZENoaWxkIDogZnVuY3Rpb24oIHN0YWdlICwgaW5kZXggKXtcbiAgICAgICAgdmFyIGNhbnZhcztcblxuICAgICAgICBpZighc3RhZ2UuY29udGV4dDJEKXtcbiAgICAgICAgICAgIGNhbnZhcyA9ICQuY3JlYXRlQ2FudmFzKCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0LCBzdGFnZS5pZCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzID0gc3RhZ2UuY29udGV4dDJELmNhbnZhcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgdGhpcy5zdGFnZV9jLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoPjEpIHtcbiAgICAgICAgICAgIGlmKCBpbmRleCA9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmsqHmnInmjIflrprkvY3nva7vvIzpgqPkuYjlsLHmlL7liLBfYnVmZmVyU3RhZ2XnmoTkuIvpnaLjgIJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlX2MuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLl9idWZmZXJTdGFnZS5jb250ZXh0MkQuY2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzmnInmjIflrprnmoTkvY3nva7vvIzpgqPkuYjlsLHmjIflrprnmoTkvY3nva7mnaVcbiAgICAgICAgICAgICAgICBpZiggaW5kZXggPj0gdGhpcy5jaGlsZHJlbi5sZW5ndGgtMSApe1xuICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5hcHBlbmRDaGlsZCggY2FudmFzICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWdlX2MuaW5zZXJ0QmVmb3JlKCBjYW52YXMgLCB0aGlzLmNoaWxkcmVuWyBpbmRleCBdLmNvbnRleHQyRC5jYW52YXMgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgVXRpbHMuaW5pdEVsZW1lbnQoIGNhbnZhcyApO1xuICAgICAgICBzdGFnZS5pbml0U3RhZ2UoIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikgLCB0aGlzLmNvbnRleHQud2lkdGggLCB0aGlzLmNvbnRleHQuaGVpZ2h0ICk7IFxuICAgIH0sXG4gICAgX2FmdGVyRGVsQ2hpbGQgOiBmdW5jdGlvbihzdGFnZSl7XG4gICAgICAgIHRoaXMuc3RhZ2VfYy5yZW1vdmVDaGlsZCggc3RhZ2UuY29udGV4dDJELmNhbnZhcyApO1xuICAgIH0sXG4gICAgXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5oZWFydEJlYXQob3B0KTtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyDkuK0g55qEc3ByaXRl57G777yM55uu5YmN6L+Y5Y+q5piv5Liq566A5Y2V55qE5a655piT44CCXG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFNwcml0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy50eXBlID0gXCJzcHJpdGVcIjtcbiAgICBTcHJpdGUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhTcHJpdGUgLCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICwge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgIFxuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBTcHJpdGU7XG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczMgRGlzcGxheUxpc3Qg5Lit55qEc2hhcGUg57G7XG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFNoYXBlID0gZnVuY3Rpb24ob3B0KXtcbiAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy/lhYPntKDmmK/lkKbmnIlob3ZlcuS6i+S7tiDlkowgY2hpY2vkuovku7bvvIznlLFhZGRFdmVuZXRMaXN0ZXLlkoxyZW1pdmVFdmVudExpc3RlcuadpeinpuWPkeS/ruaUuVxuICAgIHNlbGYuX2hvdmVyYWJsZSAgPSBmYWxzZTtcbiAgICBzZWxmLl9jbGlja2FibGUgID0gZmFsc2U7XG5cbiAgICAvL292ZXLnmoTml7blgJnlpoLmnpzmnInkv67mlLnmoLflvI/vvIzlsLHkuLp0cnVlXG4gICAgc2VsZi5faG92ZXJDbGFzcyA9IGZhbHNlO1xuICAgIHNlbGYuaG92ZXJDbG9uZSAgPSB0cnVlOyAgICAvL+aYr+WQpuW8gOWQr+WcqGhvdmVy55qE5pe25YCZY2xvbmXkuIDku73liLBhY3RpdmUgc3RhZ2Ug5LitIFxuICAgIHNlbGYucG9pbnRDaGtQcmlvcml0eSA9IHRydWU7IC8v5Zyo6byg5qCHbW91c2VvdmVy5Yiw6K+l6IqC54K577yM54S25ZCObW91c2Vtb3Zl55qE5pe25YCZ77yM5piv5ZCm5LyY5YWI5qOA5rWL6K+l6IqC54K5XG5cbiAgICAvL+aLluaLvWRyYWfnmoTml7blgJnmmL7npLrlnKhhY3RpdlNoYXBl55qE5Ymv5pysXG4gICAgc2VsZi5fZHJhZ0R1cGxpY2F0ZSA9IG51bGw7XG5cbiAgICAvL+WFg+e0oOaYr+WQpiDlvIDlkK8gZHJhZyDmi5bliqjvvIzov5nkuKrmnInnlKjmiLforr7nva7kvKDlhaVcbiAgICAvL3NlbGYuZHJhZ2dhYmxlID0gb3B0LmRyYWdnYWJsZSB8fCBmYWxzZTtcblxuICAgIHNlbGYudHlwZSA9IHNlbGYudHlwZSB8fCBcInNoYXBlXCIgO1xuICAgIG9wdC5kcmF3ICYmIChzZWxmLmRyYXc9b3B0LmRyYXcpO1xuICAgIFxuICAgIC8v5aSE55CG5omA5pyJ55qE5Zu+5b2i5LiA5Lqb5YWx5pyJ55qE5bGe5oCn6YWN572uXG4gICAgc2VsZi5pbml0Q29tcFByb3BlcnR5KG9wdCk7XG5cbiAgICBTaGFwZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xuICAgIHNlbGYuX3JlY3QgPSBudWxsO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhTaGFwZSAsIERpc3BsYXlPYmplY3QgLCB7XG4gICBpbml0IDogZnVuY3Rpb24oKXtcbiAgIH0sXG4gICBpbml0Q29tcFByb3BlcnR5IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgIGZvciggdmFyIGkgaW4gb3B0ICl7XG4gICAgICAgICAgIGlmKCBpICE9IFwiaWRcIiAmJiBpICE9IFwiY29udGV4dFwiKXtcbiAgICAgICAgICAgICAgIHRoaXNbaV0gPSBvcHRbaV07XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICB9LFxuICAgLypcbiAgICAq5LiL6Z2i5Lik5Liq5pa55rOV5Li65o+Q5L6b57uZIOWFt+S9k+eahCDlm77lvaLnsbvopobnm5blrp7njrDvvIzmnKxzaGFwZeexu+S4jeaPkOS+m+WFt+S9k+WunueOsFxuICAgICpkcmF3KCkg57uY5Yi2ICAgYW5kICAgc2V0UmVjdCgp6I635Y+W6K+l57G755qE55+p5b2i6L6555WMXG4gICAqL1xuICAgZHJhdzpmdW5jdGlvbigpe1xuICAgXG4gICB9LFxuICAgZHJhd0VuZCA6IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgaWYodGhpcy5faGFzRmlsbEFuZFN0cm9rZSl7XG4gICAgICAgICAgIC8v5aaC5p6c5Zyo5a2Qc2hhcGXnsbvph4zpnaLlt7Lnu4/lrp7njrBzdHJva2UgZmlsbCDnrYnmk43kvZzvvIwg5bCx5LiN6ZyA6KaB57uf5LiA55qEZFxuICAgICAgICAgICByZXR1cm47XG4gICAgICAgfVxuXG4gICAgICAgLy9zdHlsZSDopoHku45kaWFwbGF5T2JqZWN055qEIGNvbnRleHTkuIrpnaLljrvlj5ZcbiAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmNvbnRleHQ7XG4gXG4gICAgICAgLy9maWxsIHN0cm9rZSDkuYvliY3vvIwg5bCx5bqU6K+l6KaBY2xvc2VwYXRoIOWQpuWImee6v+adoei9rOinkuWPo+S8muaciee8uuWPo+OAglxuICAgICAgIC8vZHJhd1R5cGVPbmx5IOeUsee7p+aJv3NoYXBl55qE5YW35L2T57uY5Yi257G75o+Q5L6bXG4gICAgICAgaWYgKCB0aGlzLl9kcmF3VHlwZU9ubHkgIT0gXCJzdHJva2VcIiAmJiB0aGlzLnR5cGUgIT0gXCJwYXRoXCIpe1xuICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgfVxuXG4gICAgICAgaWYgKCBzdHlsZS5zdHJva2VTdHlsZSAmJiBzdHlsZS5saW5lV2lkdGggKXtcbiAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgIH1cbiAgICAgICAvL+avlOWmgui0neWhnuWwlOabsue6v+eUu+eahOe6vyxkcmF3VHlwZU9ubHk9PXN0cm9rZe+8jOaYr+S4jeiDveS9v+eUqGZpbGznmoTvvIzlkI7mnpzlvojkuKXph41cbiAgICAgICBpZiAoc3R5bGUuZmlsbFN0eWxlICYmIHRoaXMuX2RyYXdUeXBlT25seSE9XCJzdHJva2VcIil7XG4gICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgfVxuICAgICAgIFxuICAgfSxcblxuXG4gICByZW5kZXIgOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGN0eCAgPSB0aGlzLmdldFN0YWdlKCkuY29udGV4dDJEO1xuICAgICAgXG4gICAgICBpZiAodGhpcy5jb250ZXh0LnR5cGUgPT0gXCJzaGFwZVwiKXtcbiAgICAgICAgICAvL3R5cGUgPT0gc2hhcGXnmoTml7blgJnvvIzoh6rlrprkuYnnu5jnlLtcbiAgICAgICAgICAvL+i/meS4quaXtuWAmeWwseWPr+S7peS9v+eUqHNlbGYuZ3JhcGhpY3Pnu5jlm77mjqXlj6PkuobvvIzor6XmjqXlj6PmqKHmi5/nmoTmmK9hczPnmoTmjqXlj6NcbiAgICAgICAgICB0aGlzLmRyYXcuYXBwbHkoIHRoaXMgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy/ov5nkuKrml7blgJnvvIzor7TmmI7or6VzaGFwZeaYr+iwg+eUqOW3sue7j+e7mOWItuWlveeahCBzaGFwZSDmqKHlnZfvvIzov5nkupvmqKHlnZflhajpg6jlnKguLi9zaGFwZeebruW9leS4i+mdolxuICAgICAgICAgIGlmKCB0aGlzLmRyYXcgKXtcbiAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICB0aGlzLmRyYXcoIGN0eCAsIHRoaXMuY29udGV4dCApO1xuICAgICAgICAgICAgICB0aGlzLmRyYXdFbmQoIGN0eCApO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cbiAgICxcbiAgIC8qXG4gICAgKiDnlLvomZrnur9cbiAgICAqL1xuICAgZGFzaGVkTGluZVRvOmZ1bmN0aW9uKGN0eCwgeDEsIHkxLCB4MiwgeTIsIGRhc2hMZW5ndGgpIHtcbiAgICAgICAgIGRhc2hMZW5ndGggPSB0eXBlb2YgZGFzaExlbmd0aCA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgID8gMyA6IGRhc2hMZW5ndGg7XG4gICAgICAgICBkYXNoTGVuZ3RoID0gTWF0aC5tYXgoIGRhc2hMZW5ndGggLCB0aGlzLmNvbnRleHQubGluZVdpZHRoICk7XG4gICAgICAgICB2YXIgZGVsdGFYID0geDIgLSB4MTtcbiAgICAgICAgIHZhciBkZWx0YVkgPSB5MiAtIHkxO1xuICAgICAgICAgdmFyIG51bURhc2hlcyA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgTWF0aC5zcXJ0KGRlbHRhWCAqIGRlbHRhWCArIGRlbHRhWSAqIGRlbHRhWSkgLyBkYXNoTGVuZ3RoXG4gICAgICAgICApO1xuICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1EYXNoZXM7ICsraSkge1xuICAgICAgICAgICAgIHZhciB4ID0gcGFyc2VJbnQoeDEgKyAoZGVsdGFYIC8gbnVtRGFzaGVzKSAqIGkpO1xuICAgICAgICAgICAgIHZhciB5ID0gcGFyc2VJbnQoeTEgKyAoZGVsdGFZIC8gbnVtRGFzaGVzKSAqIGkpO1xuICAgICAgICAgICAgIGN0eFtpICUgMiA9PT0gMCA/ICdtb3ZlVG8nIDogJ2xpbmVUbyddKCB4ICwgeSApO1xuICAgICAgICAgICAgIGlmKCBpID09IChudW1EYXNoZXMtMSkgJiYgaSUyID09PSAwKXtcbiAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyggeDIgLCB5MiApO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgIH0sXG4gICAvKlxuICAgICrku45jcGzoioLngrnkuK3ojrflj5bliLA05Liq5pa55ZCR55qE6L6555WM6IqC54K5XG4gICAgKkBwYXJhbSAgY29udGV4dCBcbiAgICAqXG4gICAgKiovXG4gICBnZXRSZWN0Rm9ybVBvaW50TGlzdCA6IGZ1bmN0aW9uKCBjb250ZXh0ICl7XG4gICAgICAgdmFyIG1pblggPSAgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICB2YXIgbWF4WCA9ICBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgIHZhciBtaW5ZID0gIE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgdmFyIG1heFkgPSAgTnVtYmVyLk1JTl9WQUxVRTtcblxuICAgICAgIHZhciBjcGwgPSBjb250ZXh0LnBvaW50TGlzdDsgLy90aGlzLmdldGNwbCgpO1xuICAgICAgIGZvcih2YXIgaSA9IDAsIGwgPSBjcGwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgIGlmIChjcGxbaV1bMF0gPCBtaW5YKSB7XG4gICAgICAgICAgICAgICBtaW5YID0gY3BsW2ldWzBdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMF0gPiBtYXhYKSB7XG4gICAgICAgICAgICAgICBtYXhYID0gY3BsW2ldWzBdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMV0gPCBtaW5ZKSB7XG4gICAgICAgICAgICAgICBtaW5ZID0gY3BsW2ldWzFdO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmIChjcGxbaV1bMV0gPiBtYXhZKSB7XG4gICAgICAgICAgICAgICBtYXhZID0gY3BsW2ldWzFdO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuXG4gICAgICAgdmFyIGxpbmVXaWR0aDtcbiAgICAgICBpZiAoY29udGV4dC5zdHJva2VTdHlsZSB8fCBjb250ZXh0LmZpbGxTdHlsZSAgKSB7XG4gICAgICAgICAgIGxpbmVXaWR0aCA9IGNvbnRleHQubGluZVdpZHRoIHx8IDE7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgbGluZVdpZHRoID0gMDtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgeCAgICAgIDogTWF0aC5yb3VuZChtaW5YIC0gbGluZVdpZHRoIC8gMiksXG4gICAgICAgICAgIHkgICAgICA6IE1hdGgucm91bmQobWluWSAtIGxpbmVXaWR0aCAvIDIpLFxuICAgICAgICAgICB3aWR0aCAgOiBtYXhYIC0gbWluWCArIGxpbmVXaWR0aCxcbiAgICAgICAgICAgaGVpZ2h0IDogbWF4WSAtIG1pblkgKyBsaW5lV2lkdGhcbiAgICAgICB9O1xuICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXBlO1xuIiwiLyoqXHJcbiAqIENhbnZheC0tVGV4dFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaWh+acrCDnsbtcclxuICoqL1xyXG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0XCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBUZXh0ID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInRleHRcIjtcclxuICAgIHNlbGYuX3JlTmV3bGluZSA9IC9cXHI/XFxuLztcclxuICAgIHNlbGYuZm9udFByb3BlcnRzID0gW1wiZm9udFN0eWxlXCIsIFwiZm9udFZhcmlhbnRcIiwgXCJmb250V2VpZ2h0XCIsIFwiZm9udFNpemVcIiwgXCJmb250RmFtaWx5XCJdO1xyXG5cclxuICAgIC8v5YGa5LiA5qyh566A5Y2V55qEb3B05Y+C5pWw5qCh6aqM77yM5L+d6K+B5Zyo55So5oi35LiN5Lygb3B055qE5pe25YCZIOaIluiAheS8oOS6hm9wdOS9huaYr+mHjOmdouayoeaciWNvbnRleHTnmoTml7blgJnmiqXplJlcclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBmb250U2l6ZTogMTMsIC8v5a2X5L2T5aSn5bCP6buY6K6kMTNcclxuICAgICAgICBmb250V2VpZ2h0OiBcIm5vcm1hbFwiLFxyXG4gICAgICAgIGZvbnRGYW1pbHk6IFwi5b6u6L2v6ZuF6buRLHNhbnMtc2VyaWZcIixcclxuICAgICAgICB0ZXh0RGVjb3JhdGlvbjogbnVsbCxcclxuICAgICAgICBmaWxsU3R5bGU6ICdibGFuaycsXHJcbiAgICAgICAgc3Ryb2tlU3R5bGU6IG51bGwsXHJcbiAgICAgICAgbGluZVdpZHRoOiAwLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDEuMixcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG51bGwsXHJcbiAgICAgICAgdGV4dEJhY2tncm91bmRDb2xvcjogbnVsbFxyXG4gICAgfSwgb3B0LmNvbnRleHQpO1xyXG5cclxuICAgIHNlbGYuX2NvbnRleHQuZm9udCA9IHNlbGYuX2dldEZvbnREZWNsYXJhdGlvbigpO1xyXG5cclxuICAgIHNlbGYudGV4dCA9IHRleHQudG9TdHJpbmcoKTtcclxuXHJcbiAgICBUZXh0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgW29wdF0pO1xyXG5cclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoVGV4dCwgRGlzcGxheU9iamVjdCwge1xyXG4gICAgJHdhdGNoOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICAvL2NvbnRleHTlsZ7mgKfmnInlj5jljJbnmoTnm5HlkKzlh73mlbBcclxuICAgICAgICBpZiAoXy5pbmRleE9mKHRoaXMuZm9udFByb3BlcnRzLCBuYW1lKSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHRbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgLy/lpoLmnpzkv67mlLnnmoTmmK9mb25055qE5p+Q5Liq5YaF5a6577yM5bCx6YeN5paw57uE6KOF5LiA6YGNZm9udOeahOWAvO+8jFxyXG4gICAgICAgICAgICAvL+eEtuWQjumAmuefpeW8leaTjui/measoeWvuWNvbnRleHTnmoTkv67mlLnkuI3pnIDopoHkuIrmiqXlv4Pot7NcclxuICAgICAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSB0aGlzLl9nZXRGb250RGVjbGFyYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoID0gdGhpcy5nZXRUZXh0V2lkdGgoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IHRoaXMuZ2V0VGV4dEhlaWdodCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpbml0OiBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgYy53aWR0aCA9IHRoaXMuZ2V0VGV4dFdpZHRoKCk7XHJcbiAgICAgICAgYy5oZWlnaHQgPSB0aGlzLmdldFRleHRIZWlnaHQoKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKGN0eCkge1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gdGhpcy5jb250ZXh0LiRtb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAocCBpbiBjdHgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwICE9IFwidGV4dEJhc2VsaW5lXCIgJiYgdGhpcy5jb250ZXh0LiRtb2RlbFtwXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eFtwXSA9IHRoaXMuY29udGV4dC4kbW9kZWxbcF07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dChjdHgsIHRoaXMuX2dldFRleHRMaW5lcygpKTtcclxuICAgIH0sXHJcbiAgICByZXNldFRleHQ6IGZ1bmN0aW9uKHRleHQpIHtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5oZWFydEJlYXQoKTtcclxuICAgIH0sXHJcbiAgICBnZXRUZXh0V2lkdGg6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IDA7XHJcbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4LnNhdmUoKTtcclxuICAgICAgICBVdGlscy5fcGl4ZWxDdHguZm9udCA9IHRoaXMuY29udGV4dC5mb250O1xyXG4gICAgICAgIHdpZHRoID0gdGhpcy5fZ2V0VGV4dFdpZHRoKFV0aWxzLl9waXhlbEN0eCwgdGhpcy5fZ2V0VGV4dExpbmVzKCkpO1xyXG4gICAgICAgIFV0aWxzLl9waXhlbEN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIHdpZHRoO1xyXG4gICAgfSxcclxuICAgIGdldFRleHRIZWlnaHQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRUZXh0SGVpZ2h0KFV0aWxzLl9waXhlbEN0eCwgdGhpcy5fZ2V0VGV4dExpbmVzKCkpO1xyXG4gICAgfSxcclxuICAgIF9nZXRUZXh0TGluZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRleHQuc3BsaXQodGhpcy5fcmVOZXdsaW5lKTtcclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclRleHRTdHJva2UoY3R4LCB0ZXh0TGluZXMpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclRleHRGaWxsKGN0eCwgdGV4dExpbmVzKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfSxcclxuICAgIF9nZXRGb250RGVjbGFyYXRpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgZm9udEFyciA9IFtdO1xyXG5cclxuICAgICAgICBfLmVhY2godGhpcy5mb250UHJvcGVydHMsIGZ1bmN0aW9uKHApIHtcclxuICAgICAgICAgICAgdmFyIGZvbnRQID0gc2VsZi5fY29udGV4dFtwXTtcclxuICAgICAgICAgICAgaWYgKHAgPT0gXCJmb250U2l6ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBmb250UCA9IHBhcnNlRmxvYXQoZm9udFApICsgXCJweFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9udFAgJiYgZm9udEFyci5wdXNoKGZvbnRQKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZvbnRBcnIuam9pbignICcpO1xyXG5cclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dEZpbGw6IGZ1bmN0aW9uKGN0eCwgdGV4dExpbmVzKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuZmlsbFN0eWxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX2JvdW5kYXJpZXMgPSBbXTtcclxuICAgICAgICB2YXIgbGluZUhlaWdodHMgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0ZXh0TGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGhlaWdodE9mTGluZSA9IHRoaXMuX2dldEhlaWdodE9mTGluZShjdHgsIGksIHRleHRMaW5lcyk7XHJcbiAgICAgICAgICAgIGxpbmVIZWlnaHRzICs9IGhlaWdodE9mTGluZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclRleHRMaW5lKFxyXG4gICAgICAgICAgICAgICAgJ2ZpbGxUZXh0JyxcclxuICAgICAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgICAgIHRleHRMaW5lc1tpXSxcclxuICAgICAgICAgICAgICAgIDAsIC8vdGhpcy5fZ2V0TGVmdE9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0VG9wT2Zmc2V0KCkgKyBsaW5lSGVpZ2h0cyxcclxuICAgICAgICAgICAgICAgIGlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHRTdHJva2U6IGZ1bmN0aW9uKGN0eCwgdGV4dExpbmVzKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgfHwgIXRoaXMuY29udGV4dC5saW5lV2lkdGgpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIGxpbmVIZWlnaHRzID0gMDtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBpZiAodGhpcy5zdHJva2VEYXNoQXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKDEgJiB0aGlzLnN0cm9rZURhc2hBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Ryb2tlRGFzaEFycmF5LnB1c2guYXBwbHkodGhpcy5zdHJva2VEYXNoQXJyYXksIHRoaXMuc3Ryb2tlRGFzaEFycmF5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBwb3J0c0xpbmVEYXNoICYmIGN0eC5zZXRMaW5lRGFzaCh0aGlzLnN0cm9rZURhc2hBcnJheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0T2ZMaW5lID0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKGN0eCwgaSwgdGV4dExpbmVzKTtcclxuICAgICAgICAgICAgbGluZUhlaWdodHMgKz0gaGVpZ2h0T2ZMaW5lO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyVGV4dExpbmUoXHJcbiAgICAgICAgICAgICAgICAnc3Ryb2tlVGV4dCcsXHJcbiAgICAgICAgICAgICAgICBjdHgsXHJcbiAgICAgICAgICAgICAgICB0ZXh0TGluZXNbaV0sXHJcbiAgICAgICAgICAgICAgICAwLCAvL3RoaXMuX2dldExlZnRPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dldFRvcE9mZnNldCgpICsgbGluZUhlaWdodHMsXHJcbiAgICAgICAgICAgICAgICBpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0TGluZTogZnVuY3Rpb24obWV0aG9kLCBjdHgsIGxpbmUsIGxlZnQsIHRvcCwgbGluZUluZGV4KSB7XHJcbiAgICAgICAgdG9wIC09IHRoaXMuX2dldEhlaWdodE9mTGluZSgpIC8gNDtcclxuICAgICAgICBpZiAodGhpcy5jb250ZXh0LnRleHRBbGlnbiAhPT0gJ2p1c3RpZnknKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNoYXJzKG1ldGhvZCwgY3R4LCBsaW5lLCBsZWZ0LCB0b3AsIGxpbmVJbmRleCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBsaW5lV2lkdGggPSBjdHgubWVhc3VyZVRleHQobGluZSkud2lkdGg7XHJcbiAgICAgICAgdmFyIHRvdGFsV2lkdGggPSB0aGlzLmNvbnRleHQud2lkdGg7XHJcblxyXG4gICAgICAgIGlmICh0b3RhbFdpZHRoID4gbGluZVdpZHRoKSB7XHJcbiAgICAgICAgICAgIHZhciB3b3JkcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcclxuICAgICAgICAgICAgdmFyIHdvcmRzV2lkdGggPSBjdHgubWVhc3VyZVRleHQobGluZS5yZXBsYWNlKC9cXHMrL2csICcnKSkud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciB3aWR0aERpZmYgPSB0b3RhbFdpZHRoIC0gd29yZHNXaWR0aDtcclxuICAgICAgICAgICAgdmFyIG51bVNwYWNlcyA9IHdvcmRzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIHZhciBzcGFjZVdpZHRoID0gd2lkdGhEaWZmIC8gbnVtU3BhY2VzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlZnRPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gd29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckNoYXJzKG1ldGhvZCwgY3R4LCB3b3Jkc1tpXSwgbGVmdCArIGxlZnRPZmZzZXQsIHRvcCwgbGluZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIGxlZnRPZmZzZXQgKz0gY3R4Lm1lYXN1cmVUZXh0KHdvcmRzW2ldKS53aWR0aCArIHNwYWNlV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJDaGFycyhtZXRob2QsIGN0eCwgbGluZSwgbGVmdCwgdG9wLCBsaW5lSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcmVuZGVyQ2hhcnM6IGZ1bmN0aW9uKG1ldGhvZCwgY3R4LCBjaGFycywgbGVmdCwgdG9wKSB7XHJcbiAgICAgICAgY3R4W21ldGhvZF0oY2hhcnMsIDAsIHRvcCk7XHJcbiAgICB9LFxyXG4gICAgX2dldEhlaWdodE9mTGluZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5mb250U2l6ZSAqIHRoaXMuY29udGV4dC5saW5lSGVpZ2h0O1xyXG4gICAgfSxcclxuICAgIF9nZXRUZXh0V2lkdGg6IGZ1bmN0aW9uKGN0eCwgdGV4dExpbmVzKSB7XHJcbiAgICAgICAgdmFyIG1heFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRleHRMaW5lc1swXSB8fCAnfCcpLndpZHRoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSB0ZXh0TGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRMaW5lV2lkdGggPSBjdHgubWVhc3VyZVRleHQodGV4dExpbmVzW2ldKS53aWR0aDtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRMaW5lV2lkdGggPiBtYXhXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGggPSBjdXJyZW50TGluZVdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXhXaWR0aDtcclxuICAgIH0sXHJcbiAgICBfZ2V0VGV4dEhlaWdodDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmZvbnRTaXplICogdGV4dExpbmVzLmxlbmd0aCAqIHRoaXMuY29udGV4dC5saW5lSGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRvcCBvZmZzZXRcclxuICAgICAqL1xyXG4gICAgX2dldFRvcE9mZnNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHQgPSAwO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwidG9wXCI6XHJcbiAgICAgICAgICAgICAgICB0ID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWlkZGxlXCI6XHJcbiAgICAgICAgICAgICAgICB0ID0gLXRoaXMuY29udGV4dC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJib3R0b21cIjpcclxuICAgICAgICAgICAgICAgIHQgPSAtdGhpcy5jb250ZXh0LmhlaWdodDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH0sXHJcbiAgICBnZXRSZWN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICB2YXIgeCA9IDA7XHJcbiAgICAgICAgdmFyIHkgPSAwO1xyXG4gICAgICAgIC8v5pu05YW3dGV4dEFsaWduIOWSjCB0ZXh0QmFzZWxpbmUg6YeN5paw55+r5q2jIHh5XHJcbiAgICAgICAgaWYgKGMudGV4dEFsaWduID09IFwiY2VudGVyXCIpIHtcclxuICAgICAgICAgICAgeCA9IC1jLndpZHRoIC8gMjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjLnRleHRBbGlnbiA9PSBcInJpZ2h0XCIpIHtcclxuICAgICAgICAgICAgeCA9IC1jLndpZHRoO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGMudGV4dEJhc2VsaW5lID09IFwibWlkZGxlXCIpIHtcclxuICAgICAgICAgICAgeSA9IC1jLmhlaWdodCAvIDI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYy50ZXh0QmFzZWxpbmUgPT0gXCJib3R0b21cIikge1xyXG4gICAgICAgICAgICB5ID0gLWMuaGVpZ2h0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICAgIHk6IHksXHJcbiAgICAgICAgICAgIHdpZHRoOiBjLndpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGMuaGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgVGV4dDsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczMg5LitIOeahE1vdmllY2xpcOexu++8jOebruWJjei/mOWPquaYr+S4queugOWNleeahOWuueaYk+OAglxuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG52YXIgTW92aWVjbGlwID0gZnVuY3Rpb24oIG9wdCApe1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcbiAgICBzZWxmLnR5cGUgPSBcIm1vdmllY2xpcFwiO1xuICAgIHNlbGYuY3VycmVudEZyYW1lICA9IDA7XG4gICAgc2VsZi5hdXRvUGxheSAgICAgID0gb3B0LmF1dG9QbGF5ICAgfHwgZmFsc2U7Ly/mmK/lkKboh6rliqjmkq3mlL5cbiAgICBzZWxmLnJlcGVhdCAgICAgICAgPSBvcHQucmVwZWF0ICAgICB8fCAwOy8v5piv5ZCm5b6q546v5pKt5pS+LHJlcGVhdOS4uuaVsOWtl++8jOWImeihqOekuuW+queOr+WkmuWwkeasoe+8jOS4unRydWUgb3IgIei/kOeul+e7k+aenOS4unRydWUg55qE6K+d6KGo56S65rC45LmF5b6q546vXG5cbiAgICBzZWxmLm92ZXJQbGF5ICAgICAgPSBvcHQub3ZlclBsYXkgICB8fCBmYWxzZTsgLy/mmK/lkKbopobnm5bmkq3mlL7vvIzkuLpmYWxzZeWPquaSreaUvmN1cnJlbnRGcmFtZSDlvZPliY3luKcsdHJ1ZeWImeS8muaSreaUvuW9k+WJjeW4pyDlkowg5b2T5YmN5bin5LmL5YmN55qE5omA5pyJ5Y+g5YqgXG5cbiAgICBzZWxmLl9mcmFtZVJhdGUgICAgPSBVdGlscy5tYWluRnJhbWVSYXRlO1xuICAgIHNlbGYuX3NwZWVkVGltZSAgICA9IHBhcnNlSW50KDEwMDAvc2VsZi5fZnJhbWVSYXRlKTtcbiAgICBzZWxmLl9wcmVSZW5kZXJUaW1lPSAwO1xuXG4gICAgc2VsZi5fY29udGV4dCA9IHtcbiAgICAgICAgLy9yIDogb3B0LmNvbnRleHQuciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOWchuWNiuW+hFxuICAgIH1cbiAgICBNb3ZpZWNsaXAuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBbIG9wdCBdICk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKE1vdmllY2xpcCAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgXG4gICAgfSxcbiAgICBnZXRTdGF0dXMgICAgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL+afpeivok1vdmllY2xpcOeahGF1dG9QbGF554q25oCBXG4gICAgICAgIHJldHVybiB0aGlzLmF1dG9QbGF5O1xuICAgIH0sXG4gICAgZ2V0RnJhbWVSYXRlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZyYW1lUmF0ZTtcbiAgICB9LFxuICAgIHNldEZyYW1lUmF0ZSA6IGZ1bmN0aW9uKGZyYW1lUmF0ZSkge1xuICAgICAgICBcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZihzZWxmLl9mcmFtZVJhdGUgID09IGZyYW1lUmF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX2ZyYW1lUmF0ZSAgPSBmcmFtZVJhdGU7XG5cbiAgICAgICAgLy/moLnmja7mnIDmlrDnmoTluKfnjofvvIzmnaXorqHnrpfmnIDmlrDnmoTpl7TpmpTliLfmlrDml7bpl7RcbiAgICAgICAgc2VsZi5fc3BlZWRUaW1lID0gcGFyc2VJbnQoIDEwMDAvc2VsZi5fZnJhbWVSYXRlICk7XG4gICAgfSwgXG4gICAgYWZ0ZXJBZGRDaGlsZDpmdW5jdGlvbihjaGlsZCAsIGluZGV4KXtcbiAgICAgICBpZih0aGlzLmNoaWxkcmVuLmxlbmd0aD09MSl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgIH1cblxuICAgICAgIGlmKCBpbmRleCAhPSB1bmRlZmluZWQgJiYgaW5kZXggPD0gdGhpcy5jdXJyZW50RnJhbWUgKXtcbiAgICAgICAgICAvL+aPkuWFpeW9k+WJjWZyYW1l55qE5YmN6Z2iIFxuICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lKys7XG4gICAgICAgfVxuICAgIH0sXG4gICAgYWZ0ZXJEZWxDaGlsZDpmdW5jdGlvbihjaGlsZCxpbmRleCl7XG4gICAgICAgLy/orrDlvZXkuIvlvZPliY3luKdcbiAgICAgICB2YXIgcHJlRnJhbWUgPSB0aGlzLmN1cnJlbnRGcmFtZTtcblxuICAgICAgIC8v5aaC5p6c5bmy5o6J55qE5piv5b2T5YmN5bin5YmN6Z2i55qE5bin77yM5b2T5YmN5bin55qE57Si5byV5bCx5b6A5LiK6LWw5LiA5LiqXG4gICAgICAgaWYoaW5kZXggPCB0aGlzLmN1cnJlbnRGcmFtZSl7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUtLTtcbiAgICAgICB9XG5cbiAgICAgICAvL+WmguaenOW5suaOieS6huWFg+e0oOWQjuW9k+WJjeW4p+W3sue7j+i2hei/h+S6hmxlbmd0aFxuICAgICAgIGlmKCh0aGlzLmN1cnJlbnRGcmFtZSA+PSB0aGlzLmNoaWxkcmVuLmxlbmd0aCkgJiYgdGhpcy5jaGlsZHJlbi5sZW5ndGg+MCl7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xO1xuICAgICAgIH07XG4gICAgfSxcbiAgICBfZ290bzpmdW5jdGlvbihpKXtcbiAgICAgICB2YXIgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgaWYoaT49IGxlbil7XG4gICAgICAgICAgaSA9IGklbGVuO1xuICAgICAgIH1cbiAgICAgICBpZihpPDApe1xuICAgICAgICAgIGkgPSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xLU1hdGguYWJzKGkpJWxlbjtcbiAgICAgICB9XG4gICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSBpO1xuICAgIH0sXG4gICAgZ290b0FuZFN0b3A6ZnVuY3Rpb24oaSl7XG4gICAgICAgdGhpcy5fZ290byhpKTtcbiAgICAgICBpZighdGhpcy5hdXRvUGxheSl7XG4gICAgICAgICAvL+WGjXN0b3DnmoTnirbmgIHkuIvpnaLot7PluKfvvIzlsLHopoHlkYror4lzdGFnZeWOu+WPkeW/g+i3s1xuICAgICAgICAgdGhpcy5fcHJlUmVuZGVyVGltZSA9IDA7XG4gICAgICAgICB0aGlzLmdldFN0YWdlKCkuaGVhcnRCZWF0KCk7XG4gICAgICAgICByZXR1cm47XG4gICAgICAgfVxuICAgICAgIHRoaXMuYXV0b1BsYXkgPSBmYWxzZTtcbiAgICB9LFxuICAgIHN0b3A6ZnVuY3Rpb24oKXtcbiAgICAgICBpZighdGhpcy5hdXRvUGxheSl7XG4gICAgICAgICByZXR1cm47XG4gICAgICAgfVxuICAgICAgIHRoaXMuYXV0b1BsYXkgPSBmYWxzZTtcbiAgICB9LFxuICAgIGdvdG9BbmRQbGF5OmZ1bmN0aW9uKGkpe1xuICAgICAgIHRoaXMuX2dvdG8oaSk7XG4gICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfSxcbiAgICBwbGF5OmZ1bmN0aW9uKCl7XG4gICAgICAgaWYodGhpcy5hdXRvUGxheSl7XG4gICAgICAgICByZXR1cm47XG4gICAgICAgfVxuICAgICAgIHRoaXMuYXV0b1BsYXkgPSB0cnVlO1xuICAgICAgIHZhciBjYW52YXggPSB0aGlzLmdldFN0YWdlKCkucGFyZW50O1xuICAgICAgIGlmKCFjYW52YXguX2hlYXJ0QmVhdCAmJiBjYW52YXguX3Rhc2tMaXN0Lmxlbmd0aD09MCl7XG4gICAgICAgICAgIC8v5omL5Yqo5ZCv5Yqo5byV5pOOXG4gICAgICAgICAgIGNhbnZheC5fX3N0YXJ0RW50ZXIoKTtcbiAgICAgICB9XG4gICAgICAgdGhpcy5fcHVzaDJUYXNrTGlzdCgpO1xuICAgICAgIFxuICAgICAgIHRoaXMuX3ByZVJlbmRlclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9LFxuICAgIF9wdXNoMlRhc2tMaXN0IDogZnVuY3Rpb24oKXtcbiAgICAgICAvL+aKimVudGVyRnJhbWUgcHVzaCDliLAg5byV5pOO55qE5Lu75Yqh5YiX6KGoXG4gICAgICAgaWYoIXRoaXMuX2VudGVySW5DYW52YXgpe1xuICAgICAgICAgdGhpcy5nZXRTdGFnZSgpLnBhcmVudC5fdGFza0xpc3QucHVzaCggdGhpcyApO1xuICAgICAgICAgdGhpcy5fZW50ZXJJbkNhbnZheD10cnVlO1xuICAgICAgIH1cbiAgICB9LFxuICAgIC8vYXV0b1BsYXnkuLp0cnVlIOiAjOS4lOW3sue7j+aKil9fZW50ZXJGcmFtZSBwdXNoIOWIsOS6huW8leaTjueahOS7u+WKoemYn+WIl++8jFxuICAgIC8v5YiZ5Li6dHJ1ZVxuICAgIF9lbnRlckluQ2FudmF4OmZhbHNlLCBcbiAgICBfX2VudGVyRnJhbWU6ZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYoKFV0aWxzLm5vdy1zZWxmLl9wcmVSZW5kZXJUaW1lKSA+PSBzZWxmLl9zcGVlZFRpbWUgKXtcbiAgICAgICAgICAgLy/lpKfkuo5fc3BlZWRUaW1l77yM5omN566X5a6M5oiQ5LqG5LiA5binXG4gICAgICAgICAgIC8v5LiK5oql5b+D6LezIOaXoOadoeS7tuW/g+i3s+WQp+OAglxuICAgICAgICAgICAvL+WQjue7reWPr+S7peWKoOS4iuWvueW6lOeahCBNb3ZpZWNsaXAg6Lez5binIOW/g+i3s1xuICAgICAgICAgICBzZWxmLmdldFN0YWdlKCkuaGVhcnRCZWF0KCk7XG4gICAgICAgfVxuXG4gICAgfSxcbiAgICBuZXh0ICA6ZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYoIXNlbGYuYXV0b1BsYXkpe1xuICAgICAgICAgICAvL+WPquacieWGjemdnuaSreaUvueKtuaAgeS4i+aJjeacieaViFxuICAgICAgICAgICBzZWxmLmdvdG9BbmRTdG9wKHNlbGYuX25leHQoKSk7XG4gICAgICAgfVxuICAgIH0sXG4gICAgcHJlICAgOmZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKCFzZWxmLmF1dG9QbGF5KXtcbiAgICAgICAgICAgLy/lj6rmnInlho3pnZ7mkq3mlL7nirbmgIHkuIvmiY3mnInmlYhcbiAgICAgICAgICAgc2VsZi5nb3RvQW5kU3RvcChzZWxmLl9wcmUoKSk7XG4gICAgICAgfVxuICAgIH0sXG4gICAgX25leHQgOiBmdW5jdGlvbigpe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBpZih0aGlzLmN1cnJlbnRGcmFtZSA+PSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xKXtcbiAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lKys7XG4gICAgICAgfVxuICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRGcmFtZTtcbiAgICB9LFxuXG4gICAgX3ByZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKHRoaXMuY3VycmVudEZyYW1lID09IDApe1xuICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoLTE7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUtLTtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEZyYW1lO1xuICAgIH0sXG4gICAgcmVuZGVyOmZ1bmN0aW9uKGN0eCl7XG4gICAgICAgIC8v6L+Z6YeM5Lmf6L+Y6KaB5YGa5qyh6L+H5ruk77yM5aaC5p6c5LiN5Yiwc3BlZWRUaW1l77yM5bCx55Wl6L+HXG5cbiAgICAgICAgLy9UT0RP77ya5aaC5p6c5piv5pS55Y+YbW92aWNsaXDnmoR4IG9yIHkg562JIOmdnuW4p+WKqOeUuyDlsZ7mgKfnmoTml7blgJnliqDkuIrov5nkuKrlsLHkvJog5pyJ5ryP5bin546w6LGh77yM5YWI5rOo6YeK5o6JXG4gICAgICAgIC8qIFxuICAgICAgICBpZiggKFV0aWxzLm5vdy10aGlzLl9wcmVSZW5kZXJUaW1lKSA8IHRoaXMuX3NwZWVkVGltZSApe1xuICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgKi9cblxuICAgICAgICAvL+WboOS4uuWmguaenGNoaWxkcmVu5Li656m655qE6K+d77yMTW92aWVjbGlwIOS8muaKiuiHquW3seiuvue9ruS4uiB2aXNpYmxlOmZhbHNl77yM5LiN5Lya5omn6KGM5Yiw6L+Z5LiqcmVuZGVyXG4gICAgICAgIC8v5omA5Lul6L+Z6YeM5Y+v5Lul5LiN55So5YGaY2hpbGRyZW4ubGVuZ3RoPT0wIOeahOWIpOaWreOAgiDlpKfog4bnmoTmkJ7lkKfjgIJcblxuICAgICAgICBpZiggIXRoaXMub3ZlclBsYXkgKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRBdCh0aGlzLmN1cnJlbnRGcmFtZSkuX3JlbmRlcihjdHgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yKHZhciBpPTAgOyBpIDw9IHRoaXMuY3VycmVudEZyYW1lIDsgaSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmdldENoaWxkQXQoaSkuX3JlbmRlcihjdHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICB0aGlzLmF1dG9QbGF5ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvL+WmguaenOS4jeW+queOr1xuICAgICAgICBpZiggdGhpcy5jdXJyZW50RnJhbWUgPT0gdGhpcy5nZXROdW1DaGlsZHJlbigpLTEgKXtcbiAgICAgICAgICAgIC8v6YKj5LmI77yM5Yiw5LqG5pyA5ZCO5LiA5bin5bCx5YGc5q2iXG4gICAgICAgICAgICBpZighdGhpcy5yZXBlYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5oYXNFdmVudChcImVuZFwiKSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcmUoXCJlbmRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/kvb/nlKjmjonkuIDmrKHlvqrnjq9cbiAgICAgICAgICAgIGlmKCBfLmlzTnVtYmVyKCB0aGlzLnJlcGVhdCApICYmIHRoaXMucmVwZWF0ID4gMCApIHtcbiAgICAgICAgICAgICAgIHRoaXMucmVwZWF0IC0tIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuYXV0b1BsYXkpe1xuICAgICAgICAgICAgLy/lpoLmnpzopoHmkq3mlL5cbiAgICAgICAgICAgIGlmKCAoVXRpbHMubm93LXRoaXMuX3ByZVJlbmRlclRpbWUpID49IHRoaXMuX3NwZWVkVGltZSApe1xuICAgICAgICAgICAgICAgIC8v5YWI5oqK5b2T5YmN57uY5Yi255qE5pe26Ze054K56K6w5b2VXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlUmVuZGVyVGltZSA9IFV0aWxzLm5vdztcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wdXNoMlRhc2tMaXN0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+aaguWBnOaSreaUvlxuICAgICAgICAgICAgaWYodGhpcy5fZW50ZXJJbkNhbnZheCl7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrml7blgJkg5bey57uPIOa3u+WKoOWIsOS6hmNhbnZheOeahOS7u+WKoeWIl+ihqFxuICAgICAgICAgICAgICAgIHRoaXMuX2VudGVySW5DYW52YXg9ZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHRMaXN0ID0gdGhpcy5nZXRTdGFnZSgpLnBhcmVudC5fdGFza0xpc3Q7XG4gICAgICAgICAgICAgICAgdExpc3Quc3BsaWNlKCBfLmluZGV4T2YodExpc3QgLCB0aGlzKSAsIDEgKTsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0gXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTW92aWVjbGlwOyIsIlxuLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5ZCR6YeP5pON5L2c57G7XG4gKiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICB2YXIgdnggPSAwLHZ5ID0gMDtcbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSAmJiBfLmlzT2JqZWN0KCB4ICkgKXtcbiAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgaWYoIF8uaXNBcnJheSggYXJnICkgKXtcbiAgICAgICAgICAgdnggPSBhcmdbMF07XG4gICAgICAgICAgIHZ5ID0gYXJnWzFdO1xuICAgICAgICB9IGVsc2UgaWYoIGFyZy5oYXNPd25Qcm9wZXJ0eShcInhcIikgJiYgYXJnLmhhc093blByb3BlcnR5KFwieVwiKSApIHtcbiAgICAgICAgICAgdnggPSBhcmcueDtcbiAgICAgICAgICAgdnkgPSBhcmcueTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9heGVzID0gW3Z4LCB2eV07XG59O1xuVmVjdG9yLnByb3RvdHlwZSA9IHtcbiAgICBkaXN0YW5jZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLl9heGVzWzBdIC0gdi5fYXhlc1swXTtcbiAgICAgICAgdmFyIHkgPSB0aGlzLl9heGVzWzFdIC0gdi5fYXhlc1sxXTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgVmVjdG9yOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOWkhOeQhuS4uuW5s+a7kee6v+adoVxuICovXG5pbXBvcnQgVmVjdG9yIGZyb20gXCIuL1ZlY3RvclwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiBAaW5uZXJcbiAqL1xuZnVuY3Rpb24gaW50ZXJwb2xhdGUocDAsIHAxLCBwMiwgcDMsIHQsIHQyLCB0Mykge1xuICAgIHZhciB2MCA9IChwMiAtIHAwKSAqIDAuMjU7XG4gICAgdmFyIHYxID0gKHAzIC0gcDEpICogMC4yNTtcbiAgICByZXR1cm4gKDIgKiAocDEgLSBwMikgKyB2MCArIHYxKSAqIHQzIFxuICAgICAgICAgICArICgtIDMgKiAocDEgLSBwMikgLSAyICogdjAgLSB2MSkgKiB0MlxuICAgICAgICAgICArIHYwICogdCArIHAxO1xufVxuLyoqXG4gKiDlpJrnur/mrrXlubPmu5Hmm7Lnur8gXG4gKiBvcHQgPT0+IHBvaW50cyAsIGlzTG9vcFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoIG9wdCApIHtcbiAgICB2YXIgcG9pbnRzID0gb3B0LnBvaW50cztcbiAgICB2YXIgaXNMb29wID0gb3B0LmlzTG9vcDtcbiAgICB2YXIgc21vb3RoRmlsdGVyID0gb3B0LnNtb290aEZpbHRlcjtcblxuICAgIHZhciBsZW4gPSBwb2ludHMubGVuZ3RoO1xuICAgIGlmKCBsZW4gPT0gMSApe1xuICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gW107XG4gICAgdmFyIGRpc3RhbmNlICA9IDA7XG4gICAgdmFyIHByZVZlcnRvciA9IG5ldyBWZWN0b3IoIHBvaW50c1swXSApO1xuICAgIHZhciBpVnRvciAgICAgPSBudWxsXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpVnRvciA9IG5ldyBWZWN0b3IocG9pbnRzW2ldKTtcbiAgICAgICAgZGlzdGFuY2UgKz0gcHJlVmVydG9yLmRpc3RhbmNlKCBpVnRvciApO1xuICAgICAgICBwcmVWZXJ0b3IgPSBpVnRvcjtcbiAgICB9XG5cbiAgICBwcmVWZXJ0b3IgPSBudWxsO1xuICAgIGlWdG9yICAgICA9IG51bGw7XG5cblxuICAgIC8v5Z+65pys5LiK562J5LqO5puy546HXG4gICAgdmFyIHNlZ3MgPSBkaXN0YW5jZSAvIDY7XG5cbiAgICBzZWdzID0gc2VncyA8IGxlbiA/IGxlbiA6IHNlZ3M7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdzOyBpKyspIHtcbiAgICAgICAgdmFyIHBvcyA9IGkgLyAoc2Vncy0xKSAqIChpc0xvb3AgPyBsZW4gOiBsZW4gLSAxKTtcbiAgICAgICAgdmFyIGlkeCA9IE1hdGguZmxvb3IocG9zKTtcblxuICAgICAgICB2YXIgdyA9IHBvcyAtIGlkeDtcblxuICAgICAgICB2YXIgcDA7XG4gICAgICAgIHZhciBwMSA9IHBvaW50c1tpZHggJSBsZW5dO1xuICAgICAgICB2YXIgcDI7XG4gICAgICAgIHZhciBwMztcbiAgICAgICAgaWYgKCFpc0xvb3ApIHtcbiAgICAgICAgICAgIHAwID0gcG9pbnRzW2lkeCA9PT0gMCA/IGlkeCA6IGlkeCAtIDFdO1xuICAgICAgICAgICAgcDIgPSBwb2ludHNbaWR4ID4gbGVuIC0gMiA/IGxlbiAtIDEgOiBpZHggKyAxXTtcbiAgICAgICAgICAgIHAzID0gcG9pbnRzW2lkeCA+IGxlbiAtIDMgPyBsZW4gLSAxIDogaWR4ICsgMl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwMCA9IHBvaW50c1soaWR4IC0xICsgbGVuKSAlIGxlbl07XG4gICAgICAgICAgICBwMiA9IHBvaW50c1soaWR4ICsgMSkgJSBsZW5dO1xuICAgICAgICAgICAgcDMgPSBwb2ludHNbKGlkeCArIDIpICUgbGVuXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3MiA9IHcgKiB3O1xuICAgICAgICB2YXIgdzMgPSB3ICogdzI7XG5cbiAgICAgICAgdmFyIHJwID0gW1xuICAgICAgICAgICAgICAgIGludGVycG9sYXRlKHAwWzBdLCBwMVswXSwgcDJbMF0sIHAzWzBdLCB3LCB3MiwgdzMpLFxuICAgICAgICAgICAgICAgIGludGVycG9sYXRlKHAwWzFdLCBwMVsxXSwgcDJbMV0sIHAzWzFdLCB3LCB3MiwgdzMpXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICBfLmlzRnVuY3Rpb24oc21vb3RoRmlsdGVyKSAmJiBzbW9vdGhGaWx0ZXIoIHJwICk7XG5cbiAgICAgICAgcmV0LnB1c2goIHJwICk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59OyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmipjnur8g57G7XHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHBvaW50TGlzdCDlkITkuKrpobbop5LlnZDmoIdcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgU21vb3RoU3BsaW5lIGZyb20gXCIuLi9nZW9tL1Ntb290aFNwbGluZVwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIEJyb2tlbkxpbmUgPSBmdW5jdGlvbihvcHQgLCBhdHlwZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJicm9rZW5saW5lXCI7XHJcbiAgICBzZWxmLl9kcmF3VHlwZU9ubHkgPSBcInN0cm9rZVwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIGlmKCBhdHlwZSAhPT0gXCJjbG9uZVwiICl7XHJcbiAgICAgICAgc2VsZi5faW5pdFBvaW50TGlzdChvcHQuY29udGV4dCk7XHJcbiAgICB9O1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBsaW5lVHlwZTogbnVsbCxcclxuICAgICAgICBzbW9vdGg6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50TGlzdDogW10sIC8ve0FycmF5fSAgLy8g5b+F6aG777yM5ZCE5Liq6aG26KeS5Z2Q5qCHXHJcbiAgICAgICAgc21vb3RoRmlsdGVyOiBudWxsXHJcbiAgICB9LCBvcHQuY29udGV4dCApO1xyXG5cclxuICAgIEJyb2tlbkxpbmUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhCcm9rZW5MaW5lLCBTaGFwZSwge1xyXG4gICAgJHdhdGNoOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICBpZiAobmFtZSA9PSBcInBvaW50TGlzdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRQb2ludExpc3QodGhpcy5jb250ZXh0LCB2YWx1ZSwgcHJlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfaW5pdFBvaW50TGlzdDogZnVuY3Rpb24oY29udGV4dCwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG15QyA9IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKG15Qy5zbW9vdGgpIHtcclxuICAgICAgICAgICAgLy9zbW9vdGhGaWx0ZXIgLS0g5q+U5aaC5Zyo5oqY57q/5Zu+5Lit44CC5Lya5Lyg5LiA5Liqc21vb3RoRmlsdGVy6L+H5p2l5YGacG9pbnTnmoTnuqDmraPjgIJcclxuICAgICAgICAgICAgLy/orql55LiN6IO96LaF6L+H5bqV6YOo55qE5Y6f54K5XHJcbiAgICAgICAgICAgIHZhciBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHM6IG15Qy5wb2ludExpc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKG15Qy5zbW9vdGhGaWx0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc21vb3RoRmlsdGVyID0gbXlDLnNtb290aEZpbHRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7IC8v5pys5qyh6L2s5o2i5LiN5Ye65Y+R5b+D6LezXHJcbiAgICAgICAgICAgIHZhciBjdXJyTCA9IFNtb290aFNwbGluZShvYmopO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyTFtjdXJyTC5sZW5ndGggLSAxXVswXSA9IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdWzBdO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBteUMucG9pbnRMaXN0ID0gY3Vyckw7XHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICAvL3BvbHlnb27pnIDopoHopobnm5ZkcmF35pa55rOV77yM5omA5Lul6KaB5oqK5YW35L2T55qE57uY5Yi25Luj56CB5L2c5Li6X2RyYXfmir3nprvlh7rmnaVcclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgIH0sXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xyXG4gICAgICAgIGlmIChwb2ludExpc3QubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAvLyDlsJHkuo4y5Liq54K55bCx5LiN55S75LqGflxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWNvbnRleHQubGluZVR5cGUgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnc29saWQnKSB7XHJcbiAgICAgICAgICAgIC8v6buY6K6k5Li65a6e57q/XHJcbiAgICAgICAgICAgIC8vVE9ETzrnm67liY3lpoLmnpwg5pyJ6K6+572uc21vb3RoIOeahOaDheWGteS4i+aYr+S4jeaUr+aMgeiZmue6v+eahFxyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHBvaW50TGlzdFswXVswXSwgcG9pbnRMaXN0WzBdWzFdKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5zbW9vdGgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNpID0gMCwgc2wgPSBwb2ludExpc3QubGVuZ3RoOyBzaSA8IHNsOyBzaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpID09IHNsLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCBwb2ludExpc3Rbc2ldWzBdICwgcG9pbnRMaXN0W3NpXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oIHBvaW50TGlzdFtzaSsxXVswXSAsIHBvaW50TGlzdFtzaSsxXVsxXSApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpKz0xO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8v55S76Jma57q/55qE5pa55rOVICBcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21YID0gcG9pbnRMaXN0W2kgLSAxXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9YID0gcG9pbnRMaXN0W2ldWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tWSA9IHBvaW50TGlzdFtpIC0gMV1bMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvWSA9IHBvaW50TGlzdFtpXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhjdHgsIGZyb21YLCBmcm9tWSwgdG9YLCB0b1ksIDUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IGNvbnRleHQgPyBjb250ZXh0IDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFJlY3RGb3JtUG9pbnRMaXN0KGNvbnRleHQpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgQnJva2VuTGluZTsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAciDlnIbljYrlvoRcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxuXHJcbnZhciBDaXJjbGUgPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwiY2lyY2xlXCI7XHJcblxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG5cclxuICAgIC8v6buY6K6k5oOF5Ya15LiL6Z2i77yMY2lyY2xl5LiN6ZyA6KaB5oqKeHnov5vooYxwYXJlbnRJbnTovazmjaJcclxuICAgICggXCJ4eVRvSW50XCIgaW4gb3B0ICkgfHwgKCBvcHQueHlUb0ludCA9IGZhbHNlICk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICByIDogb3B0LmNvbnRleHQuciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOWchuWNiuW+hFxyXG4gICAgfVxyXG4gICAgQ2lyY2xlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhDaXJjbGUgLCBTaGFwZSAsIHtcclxuICAgLyoqXHJcbiAgICAgKiDliJvlu7rlnIblvaLot6/lvoRcclxuICAgICAqIEBwYXJhbSB7Q29udGV4dDJEfSBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgaWYgKCFzdHlsZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguYXJjKDAgLCAwLCBzdHlsZS5yLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue55+p5b2i5Yy65Z+f77yM55So5LqO5bGA6YOo5Yi35paw5ZKM5paH5a2X5a6a5L2NXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGVcclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdCA6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgfHwgc3R5bGUuc3Ryb2tlU3R5bGUgKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5yIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgIHkgOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5yIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgIHdpZHRoIDogc3R5bGUuciAqIDIgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCA6IHN0eWxlLnIgKiAyICsgbGluZVdpZHRoXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaXJjbGU7XHJcblxyXG5cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gLS0gdCB7MCwgMX1cbiAgICAgKiBAcmV0dXJuIHtQb2ludH0gIC0tIHJldHVybiBwb2ludCBhdCB0aGUgZ2l2ZW4gdGltZSBpbiB0aGUgYmV6aWVyIGFyY1xuICAgICAqL1xuICAgIGdldFBvaW50QnlUaW1lOiBmdW5jdGlvbih0ICwgcGxpc3QpIHtcbiAgICAgICAgdmFyIGl0ID0gMSAtIHQsXG4gICAgICAgIGl0MiA9IGl0ICogaXQsXG4gICAgICAgIGl0MyA9IGl0MiAqIGl0O1xuICAgICAgICB2YXIgdDIgPSB0ICogdCxcbiAgICAgICAgdDMgPSB0MiAqIHQ7XG4gICAgICAgIHZhciB4U3RhcnQ9cGxpc3RbMF0seVN0YXJ0PXBsaXN0WzFdLGNwWDE9cGxpc3RbMl0sY3BZMT1wbGlzdFszXSxjcFgyPTAsY3BZMj0wLHhFbmQ9MCx5RW5kPTA7XG4gICAgICAgIGlmKHBsaXN0Lmxlbmd0aD42KXtcbiAgICAgICAgICAgIGNwWDI9cGxpc3RbNF07XG4gICAgICAgICAgICBjcFkyPXBsaXN0WzVdO1xuICAgICAgICAgICAgeEVuZD1wbGlzdFs2XTtcbiAgICAgICAgICAgIHlFbmQ9cGxpc3RbN107XG4gICAgICAgICAgICAvL+S4ieasoei0neWhnuWwlFxuICAgICAgICAgICAgcmV0dXJuIHsgXG4gICAgICAgICAgICAgICAgeCA6IGl0MyAqIHhTdGFydCArIDMgKiBpdDIgKiB0ICogY3BYMSArIDMgKiBpdCAqIHQyICogY3BYMiArIHQzICogeEVuZCxcbiAgICAgICAgICAgICAgICB5IDogaXQzICogeVN0YXJ0ICsgMyAqIGl0MiAqIHQgKiBjcFkxICsgMyAqIGl0ICogdDIgKiBjcFkyICsgdDMgKiB5RW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+S6jOasoei0neWhnuWwlFxuICAgICAgICAgICAgeEVuZD1wbGlzdFs0XTtcbiAgICAgICAgICAgIHlFbmQ9cGxpc3RbNV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHggOiBpdDIgKiB4U3RhcnQgKyAyICogdCAqIGl0ICogY3BYMSArIHQyKnhFbmQsXG4gICAgICAgICAgICAgICAgeSA6IGl0MiAqIHlTdGFydCArIDIgKiB0ICogaXQgKiBjcFkxICsgdDIqeUVuZFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiBQYXRoIOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBwYXRoIHBhdGjkuLJcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgTWF0cml4IGZyb20gXCIuLi9nZW9tL01hdHJpeFwiO1xyXG5pbXBvcnQgQmV6aWVyIGZyb20gXCIuLi9nZW9tL2JlemllclwiO1xyXG5cclxudmFyIFBhdGggPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwicGF0aFwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIGlmIChcImRyYXdUeXBlT25seVwiIGluIG9wdCkge1xyXG4gICAgICAgIHNlbGYuZHJhd1R5cGVPbmx5ID0gb3B0LmRyYXdUeXBlT25seTtcclxuICAgIH07XHJcbiAgICBzZWxmLl9fcGFyc2VQYXRoRGF0YSA9IG51bGw7XHJcbiAgICB2YXIgX2NvbnRleHQgPSB7XHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy/ku47kuIvpnaLnmoRwYXRo5Lit6K6h566X5b6X5Yiw55qE6L6555WM54K555qE6ZuG5ZCIXHJcbiAgICAgICAgcGF0aDogb3B0LmNvbnRleHQucGF0aCB8fCBcIlwiIC8v5a2X56ym5LiyIOW/hemhu++8jOi3r+W+hOOAguS+i+WmgjpNIDAgMCBMIDAgMTAgTCAxMCAxMCBaICjkuIDkuKrkuInop5LlvaIpXHJcbiAgICAgICAgICAgIC8vTSA9IG1vdmV0b1xyXG4gICAgICAgICAgICAvL0wgPSBsaW5ldG9cclxuICAgICAgICAgICAgLy9IID0gaG9yaXpvbnRhbCBsaW5ldG9cclxuICAgICAgICAgICAgLy9WID0gdmVydGljYWwgbGluZXRvXHJcbiAgICAgICAgICAgIC8vQyA9IGN1cnZldG9cclxuICAgICAgICAgICAgLy9TID0gc21vb3RoIGN1cnZldG9cclxuICAgICAgICAgICAgLy9RID0gcXVhZHJhdGljIEJlbHppZXIgY3VydmVcclxuICAgICAgICAgICAgLy9UID0gc21vb3RoIHF1YWRyYXRpYyBCZWx6aWVyIGN1cnZldG9cclxuICAgICAgICAgICAgLy9aID0gY2xvc2VwYXRoXHJcbiAgICB9O1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKF9jb250ZXh0LCAoc2VsZi5fY29udGV4dCB8fCB7fSkpO1xyXG4gICAgUGF0aC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKFBhdGgsIFNoYXBlLCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicGF0aFwiKSB7IC8v5aaC5p6ccGF0aOacieWPmOWKqO+8jOmcgOimgeiHquWKqOiuoeeul+aWsOeahHBvaW50TGlzdFxyXG4gICAgICAgICAgICB0aGlzLl9fcGFyc2VQYXRoRGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5wb2ludExpc3QgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgX3BhcnNlUGF0aERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fX3BhcnNlUGF0aERhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJzZVBhdGhEYXRhO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8v5YiG5ouG5a2Q5YiG57uEXHJcbiAgICAgICAgdGhpcy5fX3BhcnNlUGF0aERhdGEgPSBbXTtcclxuICAgICAgICB2YXIgcGF0aHMgPSBfLmNvbXBhY3QoZGF0YS5yZXBsYWNlKC9bTW1dL2csIFwiXFxcXHIkJlwiKS5zcGxpdCgnXFxcXHInKSk7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICBfLmVhY2gocGF0aHMsIGZ1bmN0aW9uKHBhdGhTdHIpIHtcclxuICAgICAgICAgICAgbWUuX19wYXJzZVBhdGhEYXRhLnB1c2gobWUuX3BhcnNlQ2hpbGRQYXRoRGF0YShwYXRoU3RyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJzZVBhdGhEYXRhO1xyXG4gICAgfSxcclxuICAgIF9wYXJzZUNoaWxkUGF0aERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAvLyBjb21tYW5kIHN0cmluZ1xyXG4gICAgICAgIHZhciBjcyA9IGRhdGE7XHJcbiAgICAgICAgLy8gY29tbWFuZCBjaGFyc1xyXG4gICAgICAgIHZhciBjYyA9IFtcclxuICAgICAgICAgICAgJ20nLCAnTScsICdsJywgJ0wnLCAndicsICdWJywgJ2gnLCAnSCcsICd6JywgJ1onLFxyXG4gICAgICAgICAgICAnYycsICdDJywgJ3EnLCAnUScsICd0JywgJ1QnLCAncycsICdTJywgJ2EnLCAnQSdcclxuICAgICAgICBdO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvICAvZywgJyAnKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLyAvZywgJywnKTtcclxuICAgICAgICAvL2NzID0gY3MucmVwbGFjZSgvKC4pLS9nLCBcIiQxLC1cIik7XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8oXFxkKS0vZywgJyQxLC0nKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLywsL2csICcsJyk7XHJcbiAgICAgICAgdmFyIG47XHJcbiAgICAgICAgLy8gY3JlYXRlIHBpcGVzIHNvIHRoYXQgd2UgY2FuIHNwbGl0IHRoZSBkYXRhXHJcbiAgICAgICAgZm9yIChuID0gMDsgbiA8IGNjLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgIGNzID0gY3MucmVwbGFjZShuZXcgUmVnRXhwKGNjW25dLCAnZycpLCAnfCcgKyBjY1tuXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBhcnJheVxyXG4gICAgICAgIHZhciBhcnIgPSBjcy5zcGxpdCgnfCcpO1xyXG4gICAgICAgIHZhciBjYSA9IFtdO1xyXG4gICAgICAgIC8vIGluaXQgY29udGV4dCBwb2ludFxyXG4gICAgICAgIHZhciBjcHggPSAwO1xyXG4gICAgICAgIHZhciBjcHkgPSAwO1xyXG4gICAgICAgIGZvciAobiA9IDE7IG4gPCBhcnIubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgdmFyIHN0ciA9IGFycltuXTtcclxuICAgICAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KDApO1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJ2UsLScsICdnJyksICdlLScpO1xyXG5cclxuICAgICAgICAgICAgLy/mnInnmoTml7blgJnvvIzmr5TlpoLigJwyMu+8jC0yMuKAnSDmlbDmja7lj6/og73kvJrnu4/luLjnmoTooqvlhpnmiJAyMi0yMu+8jOmCo+S5iOmcgOimgeaJi+WKqOS/ruaUuVxyXG4gICAgICAgICAgICAvL3N0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJy0nLCAnZycpLCAnLC0nKTtcclxuICAgICAgICAgICAgLy9zdHIgPSBzdHIucmVwbGFjZSgvKC4pLS9nLCBcIiQxLC1cIilcclxuXHJcbiAgICAgICAgICAgIHZhciBwID0gc3RyLnNwbGl0KCcsJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocC5sZW5ndGggPiAwICYmIHBbMF0gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcFtpXSA9IHBhcnNlRmxvYXQocFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKHAubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHBbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgY21kID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBwb2ludHMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3RsUHR4O1xyXG4gICAgICAgICAgICAgICAgdmFyIGN0bFB0eTtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2Q21kO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciByeDtcclxuICAgICAgICAgICAgICAgIHZhciByeTtcclxuICAgICAgICAgICAgICAgIHZhciBwc2k7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmE7XHJcbiAgICAgICAgICAgICAgICB2YXIgZnM7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHgxID0gY3B4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHkxID0gY3B5O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgbCwgSCwgaCwgViwgYW5kIHYgdG8gTFxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdMJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdNJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gJ2wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdNJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdIJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdWJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHAuc2hpZnQoKSwgcC5zaGlmdCgpLCBwLnNoaWZ0KCksIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNweCArIHAuc2hpZnQoKSwgY3B5ICsgcC5zaGlmdCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNtZCA9IGNhW2NhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNtZC5jb21tYW5kID09PSAnQycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCArIChjcHggLSBwcmV2Q21kLnBvaW50c1syXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHkgKyAoY3B5IC0gcHJldkNtZC5wb2ludHNbM10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGN0bFB0eCwgY3RsUHR5LCBwLnNoaWZ0KCksIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCwgY3RsUHR5ID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q21kID0gY2FbY2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2Q21kLmNvbW1hbmQgPT09ICdDJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4ICsgKGNweCAtIHByZXZDbWQucG9pbnRzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweSArIChjcHkgLSBwcmV2Q21kLnBvaW50c1szXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHgsIGN0bFB0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNweCArIHAuc2hpZnQoKSwgY3B5ICsgcC5zaGlmdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdDJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdRJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gocC5zaGlmdCgpLCBwLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdxJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnUSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCwgY3RsUHR5ID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q21kID0gY2FbY2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2Q21kLmNvbW1hbmQgPT09ICdRJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4ICsgKGNweCAtIHByZXZDbWQucG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweSArIChjcHkgLSBwcmV2Q21kLnBvaW50c1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdRJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3RsUHR4LCBjdGxQdHksIGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCwgY3RsUHR5ID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q21kID0gY2FbY2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2Q21kLmNvbW1hbmQgPT09ICdRJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4ICsgKGNweCAtIHByZXZDbWQucG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweSArIChjcHkgLSBwcmV2Q21kLnBvaW50c1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ1EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjdGxQdHgsIGN0bFB0eSwgY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnggPSBwLnNoaWZ0KCk7IC8veOWNiuW+hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeSA9IHAuc2hpZnQoKTsgLy955Y2K5b6EXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBzaSA9IHAuc2hpZnQoKTsgLy/ml4vovazop5LluqZcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmEgPSBwLnNoaWZ0KCk7IC8v6KeS5bqm5aSn5bCPIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcyA9IHAuc2hpZnQoKTsgLy/ml7bpkojmlrnlkJFcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gY3B4LCB5MSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpLCBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdBJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzID0gdGhpcy5fY29udmVydFBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDEsIHkxLCBjcHgsIGNweSwgZmEsIGZzLCByeCwgcnksIHBzaVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdhJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwc2kgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcyA9IHAuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gY3B4LCB5MSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMgPSB0aGlzLl9jb252ZXJ0UG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSwgeTEsIGNweCwgY3B5LCBmYSwgZnMsIHJ4LCByeSwgcHNpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjYS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBjbWQgfHwgYyxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHBvaW50c1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjID09PSAneicgfHwgYyA9PT0gJ1onKSB7XHJcbiAgICAgICAgICAgICAgICBjYS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiAneicsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiBbXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBjYTtcclxuICAgIH0sXHJcblxyXG4gICAgLypcclxuICAgICAqIEBwYXJhbSB4MSDljp/ngrl4XHJcbiAgICAgKiBAcGFyYW0geTEg5Y6f54K5eVxyXG4gICAgICogQHBhcmFtIHgyIOe7iOeCueWdkOaghyB4XHJcbiAgICAgKiBAcGFyYW0geTIg57uI54K55Z2Q5qCHIHlcclxuICAgICAqIEBwYXJhbSBmYSDop5LluqblpKflsI9cclxuICAgICAqIEBwYXJhbSBmcyDml7bpkojmlrnlkJFcclxuICAgICAqIEBwYXJhbSByeCB45Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0gcnkgeeWNiuW+hFxyXG4gICAgICogQHBhcmFtIHBzaURlZyDml4vovazop5LluqZcclxuICAgICAqL1xyXG4gICAgX2NvbnZlcnRQb2ludDogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIsIGZhLCBmcywgcngsIHJ5LCBwc2lEZWcpIHtcclxuXHJcbiAgICAgICAgdmFyIHBzaSA9IHBzaURlZyAqIChNYXRoLlBJIC8gMTgwLjApO1xyXG4gICAgICAgIHZhciB4cCA9IE1hdGguY29zKHBzaSkgKiAoeDEgLSB4MikgLyAyLjAgKyBNYXRoLnNpbihwc2kpICogKHkxIC0geTIpIC8gMi4wO1xyXG4gICAgICAgIHZhciB5cCA9IC0xICogTWF0aC5zaW4ocHNpKSAqICh4MSAtIHgyKSAvIDIuMCArIE1hdGguY29zKHBzaSkgKiAoeTEgLSB5MikgLyAyLjA7XHJcblxyXG4gICAgICAgIHZhciBsYW1iZGEgPSAoeHAgKiB4cCkgLyAocnggKiByeCkgKyAoeXAgKiB5cCkgLyAocnkgKiByeSk7XHJcblxyXG4gICAgICAgIGlmIChsYW1iZGEgPiAxKSB7XHJcbiAgICAgICAgICAgIHJ4ICo9IE1hdGguc3FydChsYW1iZGEpO1xyXG4gICAgICAgICAgICByeSAqPSBNYXRoLnNxcnQobGFtYmRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmID0gTWF0aC5zcXJ0KCgoKHJ4ICogcngpICogKHJ5ICogcnkpKSAtICgocnggKiByeCkgKiAoeXAgKiB5cCkpIC0gKChyeSAqIHJ5KSAqICh4cCAqIHhwKSkpIC8gKChyeCAqIHJ4KSAqICh5cCAqIHlwKSArIChyeSAqIHJ5KSAqICh4cCAqIHhwKSkpO1xyXG5cclxuICAgICAgICBpZiAoZmEgPT09IGZzKSB7XHJcbiAgICAgICAgICAgIGYgKj0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc05hTihmKSkge1xyXG4gICAgICAgICAgICBmID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjeHAgPSBmICogcnggKiB5cCAvIHJ5O1xyXG4gICAgICAgIHZhciBjeXAgPSBmICogLXJ5ICogeHAgLyByeDtcclxuXHJcbiAgICAgICAgdmFyIGN4ID0gKHgxICsgeDIpIC8gMi4wICsgTWF0aC5jb3MocHNpKSAqIGN4cCAtIE1hdGguc2luKHBzaSkgKiBjeXA7XHJcbiAgICAgICAgdmFyIGN5ID0gKHkxICsgeTIpIC8gMi4wICsgTWF0aC5zaW4ocHNpKSAqIGN4cCArIE1hdGguY29zKHBzaSkgKiBjeXA7XHJcblxyXG4gICAgICAgIHZhciB2TWFnID0gZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHZSYXRpbyA9IGZ1bmN0aW9uKHUsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh1WzBdICogdlswXSArIHVbMV0gKiB2WzFdKSAvICh2TWFnKHUpICogdk1hZyh2KSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdkFuZ2xlID0gZnVuY3Rpb24odSwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gKHVbMF0gKiB2WzFdIDwgdVsxXSAqIHZbMF0gPyAtMSA6IDEpICogTWF0aC5hY29zKHZSYXRpbyh1LCB2KSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdGhldGEgPSB2QW5nbGUoWzEsIDBdLCBbKHhwIC0gY3hwKSAvIHJ4LCAoeXAgLSBjeXApIC8gcnldKTtcclxuICAgICAgICB2YXIgdSA9IFsoeHAgLSBjeHApIC8gcngsICh5cCAtIGN5cCkgLyByeV07XHJcbiAgICAgICAgdmFyIHYgPSBbKC0xICogeHAgLSBjeHApIC8gcngsICgtMSAqIHlwIC0gY3lwKSAvIHJ5XTtcclxuICAgICAgICB2YXIgZFRoZXRhID0gdkFuZ2xlKHUsIHYpO1xyXG5cclxuICAgICAgICBpZiAodlJhdGlvKHUsIHYpIDw9IC0xKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IE1hdGguUEk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2UmF0aW8odSwgdikgPj0gMSkge1xyXG4gICAgICAgICAgICBkVGhldGEgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZnMgPT09IDAgJiYgZFRoZXRhID4gMCkge1xyXG4gICAgICAgICAgICBkVGhldGEgPSBkVGhldGEgLSAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZzID09PSAxICYmIGRUaGV0YSA8IDApIHtcclxuICAgICAgICAgICAgZFRoZXRhID0gZFRoZXRhICsgMiAqIE1hdGguUEk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbY3gsIGN5LCByeCwgcnksIHRoZXRhLCBkVGhldGEsIHBzaSwgZnNdO1xyXG4gICAgfSxcclxuICAgIC8qXHJcbiAgICAgKiDojrflj5ZiZXppZXLkuIrpnaLnmoTngrnliJfooahcclxuICAgICAqICovXHJcbiAgICBfZ2V0QmV6aWVyUG9pbnRzOiBmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgdmFyIHN0ZXBzID0gTWF0aC5hYnMoTWF0aC5zcXJ0KE1hdGgucG93KHAuc2xpY2UoLTEpWzBdIC0gcFsxXSwgMikgKyBNYXRoLnBvdyhwLnNsaWNlKC0yLCAtMSlbMF0gLSBwWzBdLCAyKSkpO1xyXG4gICAgICAgIHN0ZXBzID0gTWF0aC5jZWlsKHN0ZXBzIC8gNSk7XHJcbiAgICAgICAgdmFyIHBhcnIgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0ID0gaSAvIHN0ZXBzO1xyXG4gICAgICAgICAgICB2YXIgdHAgPSBCZXppZXIuZ2V0UG9pbnRCeVRpbWUodCwgcCk7XHJcbiAgICAgICAgICAgIHBhcnIucHVzaCh0cC54KTtcclxuICAgICAgICAgICAgcGFyci5wdXNoKHRwLnkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHBhcnI7XHJcbiAgICB9LFxyXG4gICAgLypcclxuICAgICAqIOWmguaenHBhdGjkuK3mnIlBIGEg77yM6KaB5a+85Ye65a+55bqU55qEcG9pbnRzXHJcbiAgICAgKi9cclxuICAgIF9nZXRBcmNQb2ludHM6IGZ1bmN0aW9uKHApIHtcclxuXHJcbiAgICAgICAgdmFyIGN4ID0gcFswXTtcclxuICAgICAgICB2YXIgY3kgPSBwWzFdO1xyXG4gICAgICAgIHZhciByeCA9IHBbMl07XHJcbiAgICAgICAgdmFyIHJ5ID0gcFszXTtcclxuICAgICAgICB2YXIgdGhldGEgPSBwWzRdO1xyXG4gICAgICAgIHZhciBkVGhldGEgPSBwWzVdO1xyXG4gICAgICAgIHZhciBwc2kgPSBwWzZdO1xyXG4gICAgICAgIHZhciBmcyA9IHBbN107XHJcbiAgICAgICAgdmFyIHIgPSAocnggPiByeSkgPyByeCA6IHJ5O1xyXG4gICAgICAgIHZhciBzY2FsZVggPSAocnggPiByeSkgPyAxIDogcnggLyByeTtcclxuICAgICAgICB2YXIgc2NhbGVZID0gKHJ4ID4gcnkpID8gcnkgLyByeCA6IDE7XHJcblxyXG4gICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0uaWRlbnRpdHkoKTtcclxuICAgICAgICBfdHJhbnNmb3JtLnNjYWxlKHNjYWxlWCwgc2NhbGVZKTtcclxuICAgICAgICBfdHJhbnNmb3JtLnJvdGF0ZShwc2kpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKGN4LCBjeSk7XHJcblxyXG4gICAgICAgIHZhciBjcHMgPSBbXTtcclxuICAgICAgICB2YXIgc3RlcHMgPSAoMzYwIC0gKCFmcyA/IDEgOiAtMSkgKiBkVGhldGEgKiAxODAgLyBNYXRoLlBJKSAlIDM2MDtcclxuXHJcbiAgICAgICAgc3RlcHMgPSBNYXRoLmNlaWwoTWF0aC5taW4oTWF0aC5hYnMoZFRoZXRhKSAqIDE4MCAvIE1hdGguUEksIHIgKiBNYXRoLmFicyhkVGhldGEpIC8gOCkpOyAvL+mXtOmalOS4gOS4quWDj+e0oCDmiYDku6UgLzJcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gc3RlcHM7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBbTWF0aC5jb3ModGhldGEgKyBkVGhldGEgLyBzdGVwcyAqIGkpICogciwgTWF0aC5zaW4odGhldGEgKyBkVGhldGEgLyBzdGVwcyAqIGkpICogcl07XHJcbiAgICAgICAgICAgIHBvaW50ID0gX3RyYW5zZm9ybS5tdWxWZWN0b3IocG9pbnQpO1xyXG4gICAgICAgICAgICBjcHMucHVzaChwb2ludFswXSk7XHJcbiAgICAgICAgICAgIGNwcy5wdXNoKHBvaW50WzFdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBjcHM7XHJcbiAgICB9LFxyXG5cclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICB0aGlzLl9kcmF3KGN0eCwgc3R5bGUpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogIGN0eCBDYW52YXMgMkTkuIrkuIvmlodcclxuICAgICAqICBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgX2RyYXc6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICB2YXIgcGF0aCA9IHN0eWxlLnBhdGg7XHJcbiAgICAgICAgdmFyIHBhdGhBcnJheSA9IHRoaXMuX3BhcnNlUGF0aERhdGEocGF0aCk7XHJcbiAgICAgICAgdGhpcy5fc2V0UG9pbnRMaXN0KHBhdGhBcnJheSwgc3R5bGUpO1xyXG4gICAgICAgIGZvciAodmFyIGcgPSAwLCBnbCA9IHBhdGhBcnJheS5sZW5ndGg7IGcgPCBnbDsgZysrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcGF0aEFycmF5W2ddLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBwYXRoQXJyYXlbZ11baV0uY29tbWFuZCwgcCA9IHBhdGhBcnJheVtnXVtpXS5wb2ludHM7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdMJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhwWzBdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocFswXSwgcFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhwWzBdLCBwWzFdLCBwWzJdLCBwWzNdLCBwWzRdLCBwWzVdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHBbMF0sIHBbMV0sIHBbMl0sIHBbM10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN4ID0gcFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN5ID0gcFsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJ4ID0gcFsyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJ5ID0gcFszXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZXRhID0gcFs0XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRUaGV0YSA9IHBbNV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwc2kgPSBwWzZdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnMgPSBwWzddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IChyeCA+IHJ5KSA/IHJ4IDogcnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZVggPSAocnggPiByeSkgPyAxIDogcnggLyByeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlWSA9IChyeCA+IHJ5KSA/IHJ5IC8gcnggOiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgX3RyYW5zZm9ybSA9IG5ldyBNYXRyaXgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RyYW5zZm9ybS5pZGVudGl0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnNjYWxlKHNjYWxlWCwgc2NhbGVZKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RyYW5zZm9ybS5yb3RhdGUocHNpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoY3gsIGN5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5DnlKjnn6npmLXlvIDlp4vlj5jlvaJcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnRyYW5zZm9ybS5hcHBseShjdHgsIF90cmFuc2Zvcm0udG9BcnJheSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmFyYygwLCAwLCByLCB0aGV0YSwgdGhldGEgKyBkVGhldGEsIDEgLSBmcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vX3RyYW5zZm9ybS5pbnZlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnRyYW5zZm9ybS5hcHBseShjdHgsIF90cmFuc2Zvcm0uaW52ZXJ0KCkudG9BcnJheSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIF9zZXRQb2ludExpc3Q6IGZ1bmN0aW9uKHBhdGhBcnJheSwgc3R5bGUpIHtcclxuICAgICAgICBpZiAoc3R5bGUucG9pbnRMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIOiusOW9lei+ueeVjOeCue+8jOeUqOS6juWIpOaWrWluc2lkZVxyXG4gICAgICAgIHZhciBwb2ludExpc3QgPSBzdHlsZS5wb2ludExpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBnID0gMCwgZ2wgPSBwYXRoQXJyYXkubGVuZ3RoOyBnIDwgZ2w7IGcrKykge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNpbmdsZVBvaW50TGlzdCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoQXJyYXlbZ10ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHBhdGhBcnJheVtnXVtpXS5wb2ludHM7XHJcbiAgICAgICAgICAgICAgICB2YXIgY21kID0gcGF0aEFycmF5W2ddW2ldLmNvbW1hbmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNtZC50b1VwcGVyQ2FzZSgpID09ICdBJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHAgPSB0aGlzLl9nZXRBcmNQb2ludHMocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9B5ZG95Luk55qE6K+d77yM5aSW5o6l55+p5b2i55qE5qOA5rWL5b+F6aG76L2s5o2i5Li6X3BvaW50c1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhBcnJheVtnXVtpXS5fcG9pbnRzID0gcDtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNtZC50b1VwcGVyQ2FzZSgpID09IFwiQ1wiIHx8IGNtZC50b1VwcGVyQ2FzZSgpID09IFwiUVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNTdGFydCA9IFswLCAwXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2luZ2xlUG9pbnRMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY1N0YXJ0ID0gc2luZ2xlUG9pbnRMaXN0LnNsaWNlKC0xKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmVQb2ludHMgPSAocGF0aEFycmF5W2ddW2kgLSAxXS5fcG9pbnRzIHx8IHBhdGhBcnJheVtnXVtpIC0gMV0ucG9pbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZVBvaW50cy5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY1N0YXJ0ID0gcHJlUG9pbnRzLnNsaWNlKC0yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHRoaXMuX2dldEJlemllclBvaW50cyhjU3RhcnQuY29uY2F0KHApKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoQXJyYXlbZ11baV0uX3BvaW50cyA9IHA7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBrID0gcC5sZW5ndGg7IGogPCBrOyBqICs9IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHggPSBwW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBweSA9IHBbaiArIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoIXB4ICYmIHB4IT0wKSB8fCAoIXB5ICYmIHB5IT0wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbmdsZVBvaW50TGlzdC5wdXNoKFtweCwgcHldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2luZ2xlUG9pbnRMaXN0Lmxlbmd0aCA+IDAgJiYgcG9pbnRMaXN0LnB1c2goc2luZ2xlUG9pbnRMaXN0KTtcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue55+p5b2i5Yy65Z+f77yM55So5LqO5bGA6YOo5Yi35paw5ZKM5paH5a2X5a6a5L2NXHJcbiAgICAgKiBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgbGluZVdpZHRoO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHN0eWxlID8gc3R5bGUgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgaWYgKHN0eWxlLnN0cm9rZVN0eWxlIHx8IHN0eWxlLmZpbGxTdHlsZSkge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1pblggPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHZhciBtYXhYID0gLU51bWJlci5NQVhfVkFMVUU7Ly9OdW1iZXIuTUlOX1ZBTFVFO1xyXG5cclxuICAgICAgICB2YXIgbWluWSA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIG1heFkgPSAtTnVtYmVyLk1BWF9WQUxVRTsvL051bWJlci5NSU5fVkFMVUU7XHJcblxyXG4gICAgICAgIC8vIOW5s+enu+WdkOagh1xyXG4gICAgICAgIHZhciB4ID0gMDtcclxuICAgICAgICB2YXIgeSA9IDA7XHJcblxyXG4gICAgICAgIHZhciBwYXRoQXJyYXkgPSB0aGlzLl9wYXJzZVBhdGhEYXRhKHN0eWxlLnBhdGgpO1xyXG4gICAgICAgIHRoaXMuX3NldFBvaW50TGlzdChwYXRoQXJyYXksIHN0eWxlKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgZyA9IDAsIGdsID0gcGF0aEFycmF5Lmxlbmd0aDsgZyA8IGdsOyBnKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoQXJyYXlbZ10ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gcGF0aEFycmF5W2ddW2ldLl9wb2ludHMgfHwgcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHAubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaiAlIDIgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB4IDwgbWluWCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluWCA9IHBbal0gKyB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwW2pdICsgeCA+IG1heFgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFggPSBwW2pdICsgeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwW2pdICsgeSA8IG1pblkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pblkgPSBwW2pdICsgeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocFtqXSArIHkgPiBtYXhZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhZID0gcFtqXSArIHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcmVjdDtcclxuICAgICAgICBpZiAobWluWCA9PT0gTnVtYmVyLk1BWF9WQUxVRSB8fCBtYXhYID09PSBOdW1iZXIuTUlOX1ZBTFVFIHx8IG1pblkgPT09IE51bWJlci5NQVhfVkFMVUUgfHwgbWF4WSA9PT0gTnVtYmVyLk1JTl9WQUxVRSkge1xyXG4gICAgICAgICAgICByZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgICAgIHk6IDAsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlY3QgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBNYXRoLnJvdW5kKG1pblggLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICAgIHk6IE1hdGgucm91bmQobWluWSAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IG1heFggLSBtaW5YICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBtYXhZIC0gbWluWSArIGxpbmVXaWR0aFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBQYXRoOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmsLTmu7TlvaIg57G7XHJcbiAqIOa0vueUn+iHqlBhdGjnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAaHIg5rC05ru05qiq5a6977yI5Lit5b+D5Yiw5rC05bmz6L6557yY5pyA5a695aSE6Led56a777yJXHJcbiAqIEB2ciDmsLTmu7TnurXpq5jvvIjkuK3lv4PliLDlsJbnq6/ot53nprvvvIlcclxuICoqL1xyXG5pbXBvcnQgUGF0aCBmcm9tIFwiLi9QYXRoXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBEcm9wbGV0ID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgaHIgOiBvcHQuY29udGV4dC5ociB8fCAwICwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOawtOa7tOaoquWuve+8iOS4reW/g+WIsOawtOW5s+i+uee8mOacgOWuveWkhOi3neemu++8iVxyXG4gICAgICAgIHZyIDogb3B0LmNvbnRleHQudnIgfHwgMCAgIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmsLTmu7TnurXpq5jvvIjkuK3lv4PliLDlsJbnq6/ot53nprvvvIlcclxuICAgIH07XHJcbiAgICBEcm9wbGV0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHNlbGYudHlwZSA9IFwiZHJvcGxldFwiO1xyXG59O1xyXG5VdGlscy5jcmVhdENsYXNzKCBEcm9wbGV0ICwgUGF0aCAsIHtcclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICB2YXIgcHMgPSBcIk0gMCBcIitzdHlsZS5ocitcIiBDIFwiK3N0eWxlLmhyK1wiIFwiK3N0eWxlLmhyK1wiIFwiKyggc3R5bGUuaHIqMy8yICkgK1wiIFwiKygtc3R5bGUuaHIvMykrXCIgMCBcIisoLXN0eWxlLnZyKTtcclxuICAgICAgIHBzICs9IFwiIEMgXCIrKC1zdHlsZS5ociAqIDMvIDIpK1wiIFwiKygtc3R5bGUuaHIgLyAzKStcIiBcIisoLXN0eWxlLmhyKStcIiBcIitzdHlsZS5ocitcIiAwIFwiKyBzdHlsZS5ocjtcclxuICAgICAgIHRoaXMuY29udGV4dC5wYXRoID0gcHM7XHJcbiAgICAgICB0aGlzLl9kcmF3KGN0eCAsIHN0eWxlKTtcclxuICAgIH1cclxufSApO1xyXG5leHBvcnQgZGVmYXVsdCBEcm9wbGV0O1xyXG4iLCJcclxuLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOakreWchuW9oiDnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciSBcclxuICpcclxuICogQGhyIOakreWchuaoqui9tOWNiuW+hFxyXG4gKiBAdnIg5qSt5ZyG57q16L205Y2K5b6EXHJcbiAqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG52YXIgRWxsaXBzZSA9IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcImVsbGlwc2VcIjtcclxuXHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgIC8veCAgICAgICAgICAgICA6IDAgLCAvL3tudW1iZXJ9LCAgLy8g5Lii5byDXHJcbiAgICAgICAgLy95ICAgICAgICAgICAgIDogMCAsIC8ve251bWJlcn0sICAvLyDkuKLlvIPvvIzljp/lm6DlkIxjaXJjbGVcclxuICAgICAgICBociA6IG9wdC5jb250ZXh0LmhyIHx8IDAgLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5qSt5ZyG5qiq6L205Y2K5b6EXHJcbiAgICAgICAgdnIgOiBvcHQuY29udGV4dC52ciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOakreWchue6tei9tOWNiuW+hFxyXG4gICAgfVxyXG5cclxuICAgIEVsbGlwc2Uuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhFbGxpcHNlICwgU2hhcGUgLCB7XHJcbiAgICBkcmF3IDogIGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICB2YXIgciA9IChzdHlsZS5ociA+IHN0eWxlLnZyKSA/IHN0eWxlLmhyIDogc3R5bGUudnI7XHJcbiAgICAgICAgdmFyIHJhdGlvWCA9IHN0eWxlLmhyIC8gcjsgLy/mqKrovbTnvKnmlL7mr5TnjodcclxuICAgICAgICB2YXIgcmF0aW9ZID0gc3R5bGUudnIgLyByO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5zY2FsZShyYXRpb1gsIHJhdGlvWSk7XHJcbiAgICAgICAgY3R4LmFyYyhcclxuICAgICAgICAgICAgMCwgMCwgciwgMCwgTWF0aC5QSSAqIDIsIHRydWVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICBpZiAoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQgKXtcclxuICAgICAgICAgICAvL2ll5LiL6Z2i6KaB5oOz57uY5Yi25Liq5qSt5ZyG5Ye65p2l77yM5bCx5LiN6IO95omn6KGM6L+Z5q2l5LqGXHJcbiAgICAgICAgICAgLy/nrpfmmK9leGNhbnZhcyDlrp7njrDkuIrpnaLnmoTkuIDkuKpidWflkKdcclxuICAgICAgICAgICBjdHguc2NhbGUoMS9yYXRpb1gsIDEvcmF0aW9ZKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0sXHJcbiAgICBnZXRSZWN0IDogZnVuY3Rpb24oc3R5bGUpe1xyXG4gICAgICAgIHZhciBsaW5lV2lkdGg7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICBpZiAoc3R5bGUuZmlsbFN0eWxlIHx8IHN0eWxlLnN0cm9rZVN0eWxlKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICB4IDogTWF0aC5yb3VuZCgwIC0gc3R5bGUuaHIgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICB5IDogTWF0aC5yb3VuZCgwIC0gc3R5bGUudnIgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICB3aWR0aCA6IHN0eWxlLmhyICogMiArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgICBoZWlnaHQgOiBzdHlsZS52ciAqIDIgKyBsaW5lV2lkdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbGxpcHNlO1xyXG4iLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5aSa6L655b2iIOexuyAg77yI5LiN6KeE5YiZ77yJXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHBvaW50TGlzdCDlpJrovrnlvaLlkITkuKrpobbop5LlnZDmoIdcclxuICoqL1xyXG5pbXBvcnQgQnJva2VuTGluZSBmcm9tIFwiLi9Ccm9rZW5MaW5lXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBQb2x5Z29uID0gZnVuY3Rpb24ob3B0ICwgYXR5cGUpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XHJcblxyXG4gICAgaWYoYXR5cGUgIT09IFwiY2xvbmVcIil7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gb3B0LmNvbnRleHQucG9pbnRMaXN0WzBdO1xyXG4gICAgICAgIHZhciBlbmQgICA9IG9wdC5jb250ZXh0LnBvaW50TGlzdFsgb3B0LmNvbnRleHQucG9pbnRMaXN0Lmxlbmd0aCAtIDEgXTtcclxuICAgICAgICBpZiggb3B0LmNvbnRleHQuc21vb3RoICl7XHJcbiAgICAgICAgICAgIG9wdC5jb250ZXh0LnBvaW50TGlzdC51bnNoaWZ0KCBlbmQgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvcHQuY29udGV4dC5wb2ludExpc3QucHVzaCggc3RhcnQgKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBQb2x5Z29uLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZihhdHlwZSAhPT0gXCJjbG9uZVwiICYmIG9wdC5jb250ZXh0LnNtb290aCAmJiBlbmQpe1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5fZHJhd1R5cGVPbmx5ID0gbnVsbDtcclxuICAgIHNlbGYudHlwZSA9IFwicG9seWdvblwiO1xyXG59O1xyXG5VdGlscy5jcmVhdENsYXNzKFBvbHlnb24sIEJyb2tlbkxpbmUsIHtcclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgY29udGV4dCkge1xyXG4gICAgICAgIGlmIChjb250ZXh0LmZpbGxTdHlsZSkge1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5saW5lVHlwZSA9PSAnZGFzaGVkJyB8fCBjb250ZXh0LmxpbmVUeXBlID09ICdkb3R0ZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XHJcbiAgICAgICAgICAgICAgICAvL+eJueauiuWkhOeQhu+8jOiZmue6v+WbtOS4jeaIkHBhdGjvvIzlrp7nur/lho1idWlsZOS4gOasoVxyXG4gICAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhwb2ludExpc3RbaV1bMF0sIHBvaW50TGlzdFtpXVsxXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kcmF3VHlwZU9ubHkgPSBcInN0cm9rZVwiO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy/lpoLmnpzkuIvpnaLkuI3liqBzYXZlIHJlc3RvcmXvvIxjYW52YXPkvJrmiorkuIvpnaLnmoRwYXRo5ZKM5LiK6Z2i55qEcGF0aOS4gOi1t+eul+S9nOS4gOadoXBhdGjjgILlsLHkvJrnu5jliLbkuobkuIDmnaHlrp7njrDovrnmoYblkozkuIDomZrnur/ovrnmoYbjgIJcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLl9kcmF3KGN0eCwgY29udGV4dCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBQb2x5Z29uOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmraNu6L655b2i77yIbj49M++8iVxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJIFxyXG4gKlxyXG4gKiBAciDmraNu6L655b2i5aSW5o6l5ZyG5Y2K5b6EXHJcbiAqIEByIOaMh+aYjuato+WHoOi+ueW9olxyXG4gKlxyXG4gKiBAcG9pbnRMaXN0IOengeacie+8jOS7juS4iumdoueahHLlkoxu6K6h566X5b6X5Yiw55qE6L6555WM5YC855qE6ZuG5ZCIXHJcbiAqL1xyXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi9Qb2x5Z29uXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBJc29nb24gPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgIHBvaW50TGlzdDogW10sIC8v5LuO5LiL6Z2i55qEcuWSjG7orqHnrpflvpfliLDnmoTovrnnlYzlgLznmoTpm4blkIhcclxuICAgICAgICByOiAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5q2jbui+ueW9ouWkluaOpeWchuWNiuW+hFxyXG4gICAgICAgIG46IDAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOaMh+aYjuato+WHoOi+ueW9olxyXG4gICAgfSAsIG9wdC5jb250ZXh0KTtcclxuICAgIHNlbGYuc2V0UG9pbnRMaXN0KHNlbGYuX2NvbnRleHQpO1xyXG4gICAgb3B0LmNvbnRleHQgPSBzZWxmLl9jb250ZXh0O1xyXG4gICAgSXNvZ29uLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMudHlwZSA9IFwiaXNvZ29uXCI7XHJcbn07XHJcblV0aWxzLmNyZWF0Q2xhc3MoSXNvZ29uLCBQb2x5Z29uLCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwiclwiIHx8IG5hbWUgPT0gXCJuXCIpIHsgLy/lpoLmnpxwYXRo5pyJ5Y+Y5Yqo77yM6ZyA6KaB6Ieq5Yqo6K6h566X5paw55qEcG9pbnRMaXN0XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UG9pbnRMaXN0KCB0aGlzLmNvbnRleHQgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0UG9pbnRMaXN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIHN0eWxlLnBvaW50TGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHZhciBuID0gc3R5bGUubiwgciA9IHN0eWxlLnI7XHJcbiAgICAgICAgdmFyIGRTdGVwID0gMiAqIE1hdGguUEkgLyBuO1xyXG4gICAgICAgIHZhciBiZWdpbkRlZyA9IC1NYXRoLlBJIC8gMjtcclxuICAgICAgICB2YXIgZGVnID0gYmVnaW5EZWc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGVuZCA9IG47IGkgPCBlbmQ7IGkrKykge1xyXG4gICAgICAgICAgICBzdHlsZS5wb2ludExpc3QucHVzaChbciAqIE1hdGguY29zKGRlZyksIHIgKiBNYXRoLnNpbihkZWcpXSk7XHJcbiAgICAgICAgICAgIGRlZyArPSBkU3RlcDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgSXNvZ29uOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDnur/mnaEg57G7XHJcbiAqXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQGxpbmVUeXBlICDlj6/pgIkg6Jma57q/IOWunueOsCDnmoQg57G75Z6LXHJcbiAqIEB4U3RhcnQgICAg5b+F6aG777yM6LW354K55qiq5Z2Q5qCHXHJcbiAqIEB5U3RhcnQgICAg5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAqIEB4RW5kICAgICAg5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAqIEB5RW5kICAgICAg5b+F6aG777yM57uI54K557q15Z2Q5qCHXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBMaW5lID0gZnVuY3Rpb24ob3B0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLnR5cGUgPSBcImxpbmVcIjtcclxuICAgIHRoaXMuZHJhd1R5cGVPbmx5ID0gXCJzdHJva2VcIjtcclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KG9wdCk7XHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgIGxpbmVUeXBlOiBvcHQuY29udGV4dC5saW5lVHlwZSB8fCBudWxsLCAvL+WPr+mAiSDomZrnur8g5a6e546wIOeahCDnsbvlnotcclxuICAgICAgICB4U3RhcnQ6IG9wdC5jb250ZXh0LnhTdGFydCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW354K55qiq5Z2Q5qCHXHJcbiAgICAgICAgeVN0YXJ0OiBvcHQuY29udGV4dC55U3RhcnQgfHwgMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOi1t+eCuee6teWdkOagh1xyXG4gICAgICAgIHhFbmQ6IG9wdC5jb250ZXh0LnhFbmQgfHwgMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOe7iOeCueaoquWdkOagh1xyXG4gICAgICAgIHlFbmQ6IG9wdC5jb250ZXh0LnlFbmQgfHwgMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOe7iOeCuee6teWdkOagh1xyXG4gICAgICAgIGRhc2hMZW5ndGg6IG9wdC5jb250ZXh0LmRhc2hMZW5ndGhcclxuICAgIH1cclxuICAgIExpbmUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhMaW5lLCBTaGFwZSwge1xyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rnur/mnaHot6/lvoRcclxuICAgICAqIGN0eCBDYW52YXMgMkTkuIrkuIvmlodcclxuICAgICAqIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBkcmF3OiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgaWYgKCFzdHlsZS5saW5lVHlwZSB8fCBzdHlsZS5saW5lVHlwZSA9PSAnc29saWQnKSB7XHJcbiAgICAgICAgICAgIC8v6buY6K6k5Li65a6e57q/XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8ocGFyc2VJbnQoc3R5bGUueFN0YXJ0KSwgcGFyc2VJbnQoc3R5bGUueVN0YXJ0KSk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8ocGFyc2VJbnQoc3R5bGUueEVuZCksIHBhcnNlSW50KHN0eWxlLnlFbmQpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlLmxpbmVUeXBlID09ICdkYXNoZWQnIHx8IHN0eWxlLmxpbmVUeXBlID09ICdkb3R0ZWQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGFzaGVkTGluZVRvKFxyXG4gICAgICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICAgICAgc3R5bGUueFN0YXJ0LCBzdHlsZS55U3RhcnQsXHJcbiAgICAgICAgICAgICAgICBzdHlsZS54RW5kLCBzdHlsZS55RW5kLFxyXG4gICAgICAgICAgICAgICAgc3R5bGUuZGFzaExlbmd0aFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIHN0eWxlXHJcbiAgICAgKi9cclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHN0eWxlID8gc3R5bGUgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogTWF0aC5taW4oc3R5bGUueFN0YXJ0LCBzdHlsZS54RW5kKSAtIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgeTogTWF0aC5taW4oc3R5bGUueVN0YXJ0LCBzdHlsZS55RW5kKSAtIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgd2lkdGg6IE1hdGguYWJzKHN0eWxlLnhTdGFydCAtIHN0eWxlLnhFbmQpICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKHN0eWxlLnlTdGFydCAtIHN0eWxlLnlFbmQpICsgbGluZVdpZHRoXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGluZTsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog55+p546wIOexuyAg77yI5LiN6KeE5YiZ77yJXHJcbiAqXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHdpZHRoIOWuveW6plxyXG4gKiBAaGVpZ2h0IOmrmOW6plxyXG4gKiBAcmFkaXVzIOWmguaenOaYr+WchuinkueahO+8jOWImeS4uuOAkOS4iuWPs+S4i+W3puOAkemhuuW6j+eahOWchuinkuWNiuW+hOaVsOe7hFxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgUmVjdCA9IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInJlY3RcIjtcclxuXHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgICB3aWR0aCAgICAgICAgIDogb3B0LmNvbnRleHQud2lkdGggfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5a695bqmXHJcbiAgICAgICAgIGhlaWdodCAgICAgICAgOiBvcHQuY29udGV4dC5oZWlnaHR8fCAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzpq5jluqZcclxuICAgICAgICAgcmFkaXVzICAgICAgICA6IG9wdC5jb250ZXh0LnJhZGl1c3x8IFtdICAgICAvL3thcnJheX0sICAgLy8g6buY6K6k5Li6WzBd77yM5ZyG6KeSIFxyXG4gICAgfVxyXG4gICAgUmVjdC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKCBSZWN0ICwgU2hhcGUgLCB7XHJcbiAgICAvKipcclxuICAgICAqIOe7mOWItuWchuinkuefqeW9olxyXG4gICAgICogQHBhcmFtIHtDb250ZXh0MkR9IGN0eCBDYW52YXMgMkTkuIrkuIvmlodcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgX2J1aWxkUmFkaXVzUGF0aDogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIC8v5bem5LiK44CB5Y+z5LiK44CB5Y+z5LiL44CB5bem5LiL6KeS55qE5Y2K5b6E5L6d5qyh5Li6cjHjgIFyMuOAgXIz44CBcjRcclxuICAgICAgICAvL3LnvKnlhpnkuLoxICAgICAgICAg55u45b2T5LqOIFsxLCAxLCAxLCAxXVxyXG4gICAgICAgIC8vcue8qeWGmeS4ulsxXSAgICAgICDnm7jlvZPkuo4gWzEsIDEsIDEsIDFdXHJcbiAgICAgICAgLy9y57yp5YaZ5Li6WzEsIDJdICAgIOebuOW9k+S6jiBbMSwgMiwgMSwgMl1cclxuICAgICAgICAvL3LnvKnlhpnkuLpbMSwgMiwgM10g55u45b2T5LqOIFsxLCAyLCAzLCAyXVxyXG4gICAgICAgIHZhciB4ID0gMDtcclxuICAgICAgICB2YXIgeSA9IDA7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5jb250ZXh0LndpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmNvbnRleHQuaGVpZ2h0O1xyXG4gICAgXHJcbiAgICAgICAgdmFyIHIgPSBVdGlscy5nZXRDc3NPcmRlckFycihzdHlsZS5yYWRpdXMpO1xyXG4gICAgIFxyXG4gICAgICAgIGN0eC5tb3ZlVG8oIHBhcnNlSW50KHggKyByWzBdKSwgcGFyc2VJbnQoeSkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHBhcnNlSW50KHggKyB3aWR0aCAtIHJbMV0pLCBwYXJzZUludCh5KSk7XHJcbiAgICAgICAgclsxXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgICAgIHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgclsxXVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4ICsgd2lkdGgpLCBwYXJzZUludCh5ICsgaGVpZ2h0IC0gclsyXSkpO1xyXG4gICAgICAgIHJbMl0gIT09IDAgJiYgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICB4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJbMl0sIHkgKyBoZWlnaHRcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCArIHJbM10pLCBwYXJzZUludCh5ICsgaGVpZ2h0KSk7XHJcbiAgICAgICAgclszXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgICAgIHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByWzNdXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHBhcnNlSW50KHgpLCBwYXJzZUludCh5ICsgclswXSkpO1xyXG4gICAgICAgIHJbMF0gIT09IDAgJiYgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSwgeCArIHJbMF0sIHkpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu655+p5b2i6Lev5b6EXHJcbiAgICAgKiBAcGFyYW0ge0NvbnRleHQyRH0gY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBkcmF3IDogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIGlmKCFzdHlsZS4kbW9kZWwucmFkaXVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZighIXN0eWxlLmZpbGxTdHlsZSl7XHJcbiAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCggMCAsIDAgLHRoaXMuY29udGV4dC53aWR0aCx0aGlzLmNvbnRleHQuaGVpZ2h0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCEhc3R5bGUubGluZVdpZHRoKXtcclxuICAgICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoIDAgLCAwICwgdGhpcy5jb250ZXh0LndpZHRoLHRoaXMuY29udGV4dC5oZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYnVpbGRSYWRpdXNQYXRoKGN0eCwgc3R5bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue55+p5b2i5Yy65Z+f77yM55So5LqO5bGA6YOo5Yi35paw5ZKM5paH5a2X5a6a5L2NXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGVcclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdCA6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgICAgIHZhciBsaW5lV2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHN0eWxlID8gc3R5bGUgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgfHwgc3R5bGUuc3Ryb2tlU3R5bGUpIHtcclxuICAgICAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGluZVdpZHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICB4IDogTWF0aC5yb3VuZCgwIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICAgIHkgOiBNYXRoLnJvdW5kKDAgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICAgICAgd2lkdGggOiB0aGlzLmNvbnRleHQud2lkdGggKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodCA6IHRoaXMuY29udGV4dC5oZWlnaHQgKyBsaW5lV2lkdGhcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG59ICk7XHJcbmV4cG9ydCBkZWZhdWx0IFJlY3Q7IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaJh+W9oiDnsbtcclxuICpcclxuICog5Z2Q5qCH5Y6f54K55YaN5ZyG5b+DXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHIwIOm7mOiupOS4ujDvvIzlhoXlnIbljYrlvoTmjIflrprlkI7lsIblh7rnjrDlhoXlvKfvvIzlkIzml7bmiYfovrnplb/luqYgPSByIC0gcjBcclxuICogQHIgIOW/hemhu++8jOWkluWchuWNiuW+hFxyXG4gKiBAc3RhcnRBbmdsZSDotbflp4vop5LluqYoMCwgMzYwKVxyXG4gKiBAZW5kQW5nbGUgICDnu5PmnZ/op5LluqYoMCwgMzYwKVxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbmltcG9ydCBteU1hdGggZnJvbSBcIi4uL2dlb20vTWF0aFwiO1xyXG5cclxudmFyIFNlY3RvciA9IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICB2YXIgc2VsZiAgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJzZWN0b3JcIjtcclxuICAgIHNlbGYucmVnQW5nbGUgID0gW107XHJcbiAgICBzZWxmLmlzUmluZyAgICA9IGZhbHNlOy8v5piv5ZCm5Li65LiA5Liq5ZyG546vXHJcblxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgc2VsZi5fY29udGV4dCAgPSB7XHJcbiAgICAgICAgcG9pbnRMaXN0ICA6IFtdLC8v6L6555WM54K555qE6ZuG5ZCILOengeacie+8jOS7juS4i+mdoueahOWxnuaAp+iuoeeul+eahOadpVxyXG4gICAgICAgIHIwICAgICAgICAgOiBvcHQuY29udGV4dC5yMCAgICAgICAgIHx8IDAsLy8g6buY6K6k5Li6MO+8jOWGheWchuWNiuW+hOaMh+WumuWQjuWwhuWHuueOsOWGheW8p++8jOWQjOaXtuaJh+i+uemVv+W6piA9IHIgLSByMFxyXG4gICAgICAgIHIgICAgICAgICAgOiBvcHQuY29udGV4dC5yICAgICAgICAgIHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOWkluWchuWNiuW+hFxyXG4gICAgICAgIHN0YXJ0QW5nbGUgOiBvcHQuY29udGV4dC5zdGFydEFuZ2xlIHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOi1t+Wni+inkuW6plswLCAzNjApXHJcbiAgICAgICAgZW5kQW5nbGUgICA6IG9wdC5jb250ZXh0LmVuZEFuZ2xlICAgfHwgMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOe7k+adn+inkuW6pigwLCAzNjBdXHJcbiAgICAgICAgY2xvY2t3aXNlICA6IG9wdC5jb250ZXh0LmNsb2Nrd2lzZSAgfHwgZmFsc2UgLy/mmK/lkKbpobrml7bpkojvvIzpu5jorqTkuLpmYWxzZSjpobrml7bpkogpXHJcbiAgICB9XHJcbiAgICBTZWN0b3Iuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzICwgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoU2VjdG9yICwgU2hhcGUgLCB7XHJcbiAgICBkcmF3IDogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgLy8g5b2i5YaF5Y2K5b6EWzAscilcclxuICAgICAgICB2YXIgcjAgPSB0eXBlb2YgY29udGV4dC5yMCA9PSAndW5kZWZpbmVkJyA/IDAgOiBjb250ZXh0LnIwO1xyXG4gICAgICAgIHZhciByICA9IGNvbnRleHQucjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5omH5b2i5aSW5Y2K5b6EKDAscl1cclxuICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgdmFyIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5lbmRBbmdsZSk7ICAgICAgICAgICAgICAvLyDnu5PmnZ/op5LluqYoMCwzNjBdXHJcblxyXG4gICAgICAgIC8vdmFyIGlzUmluZyAgICAgPSBmYWxzZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5piv5ZCm5Li65ZyG546vXHJcblxyXG4gICAgICAgIC8vaWYoIHN0YXJ0QW5nbGUgIT0gZW5kQW5nbGUgJiYgTWF0aC5hYnMoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSAlIDM2MCA9PSAwICkge1xyXG4gICAgICAgIGlmKCBzdGFydEFuZ2xlID09IGVuZEFuZ2xlICYmIGNvbnRleHQuc3RhcnRBbmdsZSAhPSBjb250ZXh0LmVuZEFuZ2xlICkge1xyXG4gICAgICAgICAgICAvL+WmguaenOS4pOS4quinkuW6puebuOetie+8jOmCo+S5iOWwseiupOS4uuaYr+S4quWchueOr+S6hlxyXG4gICAgICAgICAgICB0aGlzLmlzUmluZyAgICAgPSB0cnVlO1xyXG4gICAgICAgICAgICBzdGFydEFuZ2xlID0gMCA7XHJcbiAgICAgICAgICAgIGVuZEFuZ2xlICAgPSAzNjA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpO1xyXG4gICAgICAgIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oZW5kQW5nbGUpO1xyXG4gICAgIFxyXG4gICAgICAgIC8v5aSE55CG5LiL5p6B5bCP5aS56KeS55qE5oOF5Ya1XHJcbiAgICAgICAgaWYoIGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSA8IDAuMDI1ICl7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgLT0gMC4wMDNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN0eC5hcmMoIDAgLCAwICwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIHRoaXMuY29udGV4dC5jbG9ja3dpc2UpO1xyXG4gICAgICAgIGlmIChyMCAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZiggdGhpcy5pc1JpbmcgKXtcclxuICAgICAgICAgICAgICAgIC8v5Yqg5LiK6L+Z5LiqaXNSaW5n55qE6YC76L6R5piv5Li65LqG5YW85a65Zmxhc2hjYW52YXPkuIvnu5jliLblnIbnjq/nmoTnmoTpl67pophcclxuICAgICAgICAgICAgICAgIC8v5LiN5Yqg6L+Z5Liq6YC76L6RZmxhc2hjYW52YXPkvJrnu5jliLbkuIDkuKrlpKflnIYg77yMIOiAjOS4jeaYr+WchueOr1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyggcjAgLCAwICk7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKCAwICwgMCAsIHIwICwgc3RhcnRBbmdsZSAsIGVuZEFuZ2xlICwgIXRoaXMuY29udGV4dC5jbG9ja3dpc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyggMCAsIDAgLCByMCAsIGVuZEFuZ2xlICwgc3RhcnRBbmdsZSAsICF0aGlzLmNvbnRleHQuY2xvY2t3aXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vVE9ETzrlnKhyMOS4ujDnmoTml7blgJnvvIzlpoLmnpzkuI3liqBsaW5lVG8oMCwwKeadpeaKiui3r+W+hOmXreWQiO+8jOS8muWHuueOsOacieaQnueskeeahOS4gOS4qmJ1Z1xyXG4gICAgICAgICAgICAvL+aVtOS4quWchuS8muWHuueOsOS4gOS4quS7peavj+S4quaJh+W9ouS4pOerr+S4uuiKgueCueeahOmVguepuu+8jOaIkeWPr+iDveaPj+i/sOS4jea4healmu+8jOWPjeato+i/meS4quWKoOS4iuWwseWlveS6hlxyXG4gICAgICAgICAgICBjdHgubGluZVRvKDAsMCk7XHJcbiAgICAgICAgfVxyXG4gICAgIH0sXHJcbiAgICAgZ2V0UmVnQW5nbGUgOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICB0aGlzLnJlZ0luICAgICAgPSB0cnVlOyAgLy/lpoLmnpzlnKhzdGFydOWSjGVuZOeahOaVsOWAvOS4re+8jGVuZOWkp+S6jnN0YXJ06ICM5LiU5piv6aG65pe26ZKI5YiZcmVnSW7kuLp0cnVlXHJcbiAgICAgICAgIHZhciBjICAgICAgICAgICA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgdmFyIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG8zNjAoYy5zdGFydEFuZ2xlKTsgICAgICAgICAgLy8g6LW35aeL6KeS5bqmWzAsMzYwKVxyXG4gICAgICAgICB2YXIgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUbzM2MChjLmVuZEFuZ2xlKTsgICAgICAgICAgICAvLyDnu5PmnZ/op5LluqYoMCwzNjBdXHJcblxyXG4gICAgICAgICBpZiAoICggc3RhcnRBbmdsZSA+IGVuZEFuZ2xlICYmICFjLmNsb2Nrd2lzZSApIHx8ICggc3RhcnRBbmdsZSA8IGVuZEFuZ2xlICYmIGMuY2xvY2t3aXNlICkgKSB7XHJcbiAgICAgICAgICAgICB0aGlzLnJlZ0luICA9IGZhbHNlOyAvL291dFxyXG4gICAgICAgICB9O1xyXG4gICAgICAgICAvL+W6pueahOiMg+WbtO+8jOS7juWwj+WIsOWkp1xyXG4gICAgICAgICB0aGlzLnJlZ0FuZ2xlICAgPSBbIFxyXG4gICAgICAgICAgICAgTWF0aC5taW4oIHN0YXJ0QW5nbGUgLCBlbmRBbmdsZSApICwgXHJcbiAgICAgICAgICAgICBNYXRoLm1heCggc3RhcnRBbmdsZSAsIGVuZEFuZ2xlICkgXHJcbiAgICAgICAgIF07XHJcbiAgICAgfSxcclxuICAgICBnZXRSZWN0IDogZnVuY3Rpb24oY29udGV4dCl7XHJcbiAgICAgICAgIHZhciBjb250ZXh0ID0gY29udGV4dCA/IGNvbnRleHQgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgIHZhciByMCA9IHR5cGVvZiBjb250ZXh0LnIwID09ICd1bmRlZmluZWQnICAgICAvLyDlvaLlhoXljYrlvoRbMCxyKVxyXG4gICAgICAgICAgICAgPyAwIDogY29udGV4dC5yMDtcclxuICAgICAgICAgdmFyIHIgPSBjb250ZXh0LnI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaJh+W9ouWkluWNiuW+hCgwLHJdXHJcbiAgICAgICAgIFxyXG4gICAgICAgICB0aGlzLmdldFJlZ0FuZ2xlKCk7XHJcblxyXG4gICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuZW5kQW5nbGUpOyAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgIC8qXHJcbiAgICAgICAgIHZhciBpc0NpcmNsZSA9IGZhbHNlO1xyXG4gICAgICAgICBpZiggTWF0aC5hYnMoIHN0YXJ0QW5nbGUgLSBlbmRBbmdsZSApID09IDM2MCBcclxuICAgICAgICAgICAgICAgICB8fCAoIHN0YXJ0QW5nbGUgPT0gZW5kQW5nbGUgJiYgc3RhcnRBbmdsZSAqIGVuZEFuZ2xlICE9IDAgKSApe1xyXG4gICAgICAgICAgICAgaXNDaXJjbGUgPSB0cnVlO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgICB2YXIgcG9pbnRMaXN0ICA9IFtdO1xyXG5cclxuICAgICAgICAgdmFyIHA0RGlyZWN0aW9uPSB7XHJcbiAgICAgICAgICAgICBcIjkwXCIgOiBbIDAgLCByIF0sXHJcbiAgICAgICAgICAgICBcIjE4MFwiOiBbIC1yLCAwIF0sXHJcbiAgICAgICAgICAgICBcIjI3MFwiOiBbIDAgLCAtcl0sXHJcbiAgICAgICAgICAgICBcIjM2MFwiOiBbIHIgLCAwIF0gXHJcbiAgICAgICAgIH07XHJcblxyXG4gICAgICAgICBmb3IgKCB2YXIgZCBpbiBwNERpcmVjdGlvbiApe1xyXG4gICAgICAgICAgICAgdmFyIGluQW5nbGVSZWcgPSBwYXJzZUludChkKSA+IHRoaXMucmVnQW5nbGVbMF0gJiYgcGFyc2VJbnQoZCkgPCB0aGlzLnJlZ0FuZ2xlWzFdO1xyXG4gICAgICAgICAgICAgaWYoIHRoaXMuaXNSaW5nIHx8IChpbkFuZ2xlUmVnICYmIHRoaXMucmVnSW4pIHx8ICghaW5BbmdsZVJlZyAmJiAhdGhpcy5yZWdJbikgKXtcclxuICAgICAgICAgICAgICAgICBwb2ludExpc3QucHVzaCggcDREaXJlY3Rpb25bIGQgXSApO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBpZiggIXRoaXMuaXNSaW5nICkge1xyXG4gICAgICAgICAgICAgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUb1JhZGlhbiggc3RhcnRBbmdsZSApO1xyXG4gICAgICAgICAgICAgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUb1JhZGlhbiggZW5kQW5nbGUgICApO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhzdGFydEFuZ2xlKSAqIHIwICwgbXlNYXRoLnNpbihzdGFydEFuZ2xlKSAqIHIwXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhzdGFydEFuZ2xlKSAqIHIgICwgbXlNYXRoLnNpbihzdGFydEFuZ2xlKSAqIHJcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKGVuZEFuZ2xlKSAgICogciAgLCAgbXlNYXRoLnNpbihlbmRBbmdsZSkgICogclxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3MoZW5kQW5nbGUpICAgKiByMCAsICBteU1hdGguc2luKGVuZEFuZ2xlKSAgKiByMFxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICAgY29udGV4dC5wb2ludExpc3QgPSBwb2ludExpc3Q7XHJcbiAgICAgICAgIHJldHVybiB0aGlzLmdldFJlY3RGb3JtUG9pbnRMaXN0KCBjb250ZXh0ICk7XHJcbiAgICAgfVxyXG5cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZWN0b3I7IiwiXG5pbXBvcnQgQXBwbGljYXRpb24gZnJvbSBcIi4vQXBwbGljYXRpb25cIjtcbmltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnREaXNwYXRjaGVyXCI7XG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuL2V2ZW50L0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vZGlzcGxheS9EaXNwbGF5T2JqZWN0XCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBTdGFnZSBmcm9tIFwiLi9kaXNwbGF5L1N0YWdlXCI7XG5pbXBvcnQgU3ByaXRlIGZyb20gXCIuL2Rpc3BsYXkvU3ByaXRlXCI7XG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4vZGlzcGxheS9TaGFwZVwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL2Rpc3BsYXkvUG9pbnRcIjtcbmltcG9ydCBUZXh0IGZyb20gXCIuL2Rpc3BsYXkvVGV4dFwiO1xuaW1wb3J0IE1vdmllY2xpcCBmcm9tIFwiLi9kaXNwbGF5L01vdmllY2xpcFwiO1xuXG4vL3NoYXBlc1xuaW1wb3J0IEJyb2tlbkxpbmUgZnJvbSBcIi4vc2hhcGUvQnJva2VuTGluZVwiO1xuaW1wb3J0IENpcmNsZSBmcm9tIFwiLi9zaGFwZS9DaXJjbGVcIjtcbmltcG9ydCBEcm9wbGV0IGZyb20gXCIuL3NoYXBlL0Ryb3BsZXRcIjtcbmltcG9ydCBFbGxpcHNlIGZyb20gXCIuL3NoYXBlL0VsbGlwc2VcIjtcbmltcG9ydCBJc29nb24gZnJvbSBcIi4vc2hhcGUvSXNvZ29uXCI7XG5pbXBvcnQgTGluZSBmcm9tIFwiLi9zaGFwZS9MaW5lXCI7XG5pbXBvcnQgUGF0aCBmcm9tIFwiLi9zaGFwZS9QYXRoXCI7XG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi9zaGFwZS9Qb2x5Z29uXCI7XG5pbXBvcnQgUmVjdCBmcm9tIFwiLi9zaGFwZS9SZWN0XCI7XG5pbXBvcnQgU2VjdG9yIGZyb20gXCIuL3NoYXBlL1NlY3RvclwiO1xuXG52YXIgQ2FudmF4ID0ge1xuICAgIEFwcDogQXBwbGljYXRpb25cbn07XG5cbkNhbnZheC5EaXNwbGF5ID0ge1xuICAgIERpc3BsYXlPYmplY3QgOiBEaXNwbGF5T2JqZWN0LFxuICAgIERpc3BsYXlPYmplY3RDb250YWluZXIgOiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyLFxuICAgIFN0YWdlICA6IFN0YWdlLFxuICAgIFNwcml0ZSA6IFNwcml0ZSxcbiAgICBTaGFwZSAgOiBTaGFwZSxcbiAgICBQb2ludCAgOiBQb2ludCxcbiAgICBUZXh0ICAgOiBUZXh0LFxuICAgIE1vdmllY2xpcCA6IE1vdmllY2xpcFxufVxuXG5DYW52YXguU2hhcGVzID0ge1xuICAgIEJyb2tlbkxpbmUgOiBCcm9rZW5MaW5lLFxuICAgIENpcmNsZSA6IENpcmNsZSxcbiAgICBEcm9wbGV0IDogRHJvcGxldCxcbiAgICBFbGxpcHNlIDogRWxsaXBzZSxcbiAgICBJc29nb24gOiBJc29nb24sXG4gICAgTGluZSA6IExpbmUsXG4gICAgUGF0aCA6IFBhdGgsXG4gICAgUG9seWdvbiA6IFBvbHlnb24sXG4gICAgUmVjdCA6IFJlY3QsXG4gICAgU2VjdG9yIDogU2VjdG9yXG59XG5cbkNhbnZheC5FdmVudCA9IHtcbiAgICBFdmVudERpc3BhdGNoZXIgOiBFdmVudERpc3BhdGNoZXIsXG4gICAgRXZlbnRNYW5hZ2VyICAgIDogRXZlbnRNYW5hZ2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbnZheDsiXSwibmFtZXMiOlsiXyIsImJyZWFrZXIiLCJBcnJheVByb3RvIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJPYmpQcm90byIsIk9iamVjdCIsInRvU3RyaW5nIiwiaGFzT3duUHJvcGVydHkiLCJuYXRpdmVGb3JFYWNoIiwiZm9yRWFjaCIsIm5hdGl2ZUZpbHRlciIsImZpbHRlciIsIm5hdGl2ZUluZGV4T2YiLCJpbmRleE9mIiwibmF0aXZlSXNBcnJheSIsImlzQXJyYXkiLCJuYXRpdmVLZXlzIiwia2V5cyIsInZhbHVlcyIsIm9iaiIsImxlbmd0aCIsImkiLCJUeXBlRXJyb3IiLCJrZXkiLCJoYXMiLCJwdXNoIiwiY2FsbCIsImVhY2giLCJpdGVyYXRvciIsImNvbnRleHQiLCJjb21wYWN0IiwiYXJyYXkiLCJpZGVudGl0eSIsInNlbGVjdCIsInJlc3VsdHMiLCJ2YWx1ZSIsImluZGV4IiwibGlzdCIsIm5hbWUiLCJpc0Z1bmN0aW9uIiwiaXNGaW5pdGUiLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc051bWJlciIsImlzQm9vbGVhbiIsImlzTnVsbCIsImlzRW1wdHkiLCJpc1N0cmluZyIsImlzRWxlbWVudCIsIm5vZGVUeXBlIiwiaXNPYmplY3QiLCJpdGVtIiwiaXNTb3J0ZWQiLCJNYXRoIiwibWF4Iiwic29ydGVkSW5kZXgiLCJpc1dpbmRvdyIsIndpbmRvdyIsImlzUGxhaW5PYmplY3QiLCJjb25zdHJ1Y3RvciIsImhhc093biIsImUiLCJ1bmRlZmluZWQiLCJleHRlbmQiLCJvcHRpb25zIiwic3JjIiwiY29weSIsImNvcHlJc0FycmF5IiwiY2xvbmUiLCJ0YXJnZXQiLCJhcmd1bWVudHMiLCJkZWVwIiwic2xpY2UiLCJVdGlscyIsImRldmljZVBpeGVsUmF0aW8iLCJfVUlEIiwiY2hhckNvZGUiLCJjaGFyQ29kZUF0IiwiZ2V0VUlEIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZ2V0Q29udGV4dCIsInByb3RvIiwibmV3UHJvdG8iLCJPYmplY3RDcmVhdGUiLCJjcmVhdGUiLCJfX2VtcHR5RnVuYyIsImN0eCIsInN0eWxlIiwicCIsInIiLCJzIiwicHgiLCJzcCIsInJwIiwiY3JlYXRlT2JqZWN0Iiwic3VwZXJjbGFzcyIsImNhbnZhcyIsIkZsYXNoQ2FudmFzIiwiaW5pdEVsZW1lbnQiLCJvcHQiLCJyMSIsInIyIiwicjMiLCJyNCIsIngiLCJ5IiwiYXJnIiwiQ2FudmF4RXZlbnQiLCJldnQiLCJwYXJhbXMiLCJldmVudFR5cGUiLCJ0eXBlIiwiY3VycmVudFRhcmdldCIsInBvaW50IiwiX3N0b3BQcm9wYWdhdGlvbiIsImFkZE9yUm1vdmVFdmVudEhhbmQiLCJkb21IYW5kIiwiaWVIYW5kIiwiZXZlbnREb21GbiIsImVsIiwiZm4iLCJldmVudEZuIiwiZXZlbnQiLCJnZXRFbGVtZW50QnlJZCIsImJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImRvYyIsIm93bmVyRG9jdW1lbnQiLCJib2R5IiwiZG9jRWxlbSIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudFRvcCIsImNsaWVudExlZnQiLCJib3VuZCIsInJpZ2h0IiwibGVmdCIsImNsaWVudFdpZHRoIiwiem9vbSIsInRvcCIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsVG9wIiwicGFnZVhPZmZzZXQiLCJzY3JvbGxMZWZ0IiwicGFnZVgiLCJjbGllbnRYIiwicGFnZVkiLCJjbGllbnRZIiwiX3dpZHRoIiwiX2hlaWdodCIsImlkIiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInNldEF0dHJpYnV0ZSIsInNldHRpbmdzIiwiUkVTT0xVVElPTiIsInZpZXciLCJjbGFzc05hbWUiLCJjc3NUZXh0Iiwic3RhZ2VfYyIsImRvbV9jIiwiYXBwZW5kQ2hpbGQiLCJfbW91c2VFdmVudFR5cGVzIiwiX2hhbW1lckV2ZW50VHlwZXMiLCJFdmVudEhhbmRsZXIiLCJjYW52YXgiLCJjdXJQb2ludHMiLCJQb2ludCIsImN1clBvaW50c1RhcmdldCIsIl90b3VjaGluZyIsIl9kcmFnaW5nIiwiX2N1cnNvciIsInR5cGVzIiwiZHJhZyIsImNvbnRhaW5zIiwiY29tcGFyZURvY3VtZW50UG9zaXRpb24iLCJwYXJlbnQiLCJjaGlsZCIsIm1lIiwiYWRkRXZlbnQiLCJfX21vdXNlSGFuZGxlciIsIm9uIiwiX19saWJIYW5kbGVyIiwicm9vdCIsInVwZGF0ZVZpZXdPZmZzZXQiLCIkIiwidmlld09mZnNldCIsImN1ck1vdXNlUG9pbnQiLCJjdXJNb3VzZVRhcmdldCIsImdldE9iamVjdHNVbmRlclBvaW50IiwiZHJhZ0VuYWJsZWQiLCJ0b0VsZW1lbnQiLCJyZWxhdGVkVGFyZ2V0IiwiX2RyYWdFbmQiLCJmaXJlIiwiX19nZXRjdXJQb2ludHNUYXJnZXQiLCJnbG9iYWxBbHBoYSIsImNsb25lT2JqZWN0IiwiX2Nsb25lMmhvdmVyU3RhZ2UiLCJfZ2xvYmFsQWxwaGEiLCJfZHJhZ01vdmVIYW5kZXIiLCJfX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyIsIl9jdXJzb3JIYW5kZXIiLCJwcmV2ZW50RGVmYXVsdCIsInJldHVyblZhbHVlIiwib2xkT2JqIiwiX2hvdmVyQ2xhc3MiLCJwb2ludENoa1ByaW9yaXR5IiwiZ2V0Q2hpbGRJblBvaW50IiwiZ2xvYmFsVG9Mb2NhbCIsImRpc3BhdGNoRXZlbnQiLCJ0b1RhcmdldCIsImZyb21UYXJnZXQiLCJfc2V0Q3Vyc29yIiwiY3Vyc29yIiwiX19nZXRDYW52YXhQb2ludEluVG91Y2hzIiwiX19nZXRDaGlsZEluVG91Y2hzIiwic3RhcnQiLCJtb3ZlIiwiZW5kIiwiY3VyVG91Y2hzIiwidG91Y2giLCJ0b3VjaHMiLCJ0b3VjaGVzVGFyZ2V0IiwiY2hpbGRzIiwiaGFzQ2hpbGQiLCJjZSIsInN0YWdlUG9pbnQiLCJfZHJhZ0R1cGxpY2F0ZSIsIl9idWZmZXJTdGFnZSIsImdldENoaWxkQnlJZCIsIl90cmFuc2Zvcm0iLCJnZXRDb25jYXRlbmF0ZWRNYXRyaXgiLCJhZGRDaGlsZEF0IiwiX2RyYWdQb2ludCIsIl9wb2ludCIsIl9ub3RXYXRjaCIsIl9tb3ZlU3RhZ2UiLCJtb3ZlaW5nIiwiaGVhcnRCZWF0IiwiZGVzdHJveSIsIkV2ZW50TWFuYWdlciIsIl9ldmVudE1hcCIsImxpc3RlbmVyIiwiYWRkUmVzdWx0Iiwic2VsZiIsInNwbGl0IiwibWFwIiwiX2V2ZW50RW5hYmxlZCIsInJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUiLCJsaSIsInNwbGljZSIsIl9kaXNwYXRjaEV2ZW50IiwiRXZlbnREaXNwYXRjaGVyIiwiY3JlYXRDbGFzcyIsIl9hZGRFdmVudExpc3RlbmVyIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXIiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSIsIl9yZW1vdmVBbGxFdmVudExpc3RlbmVycyIsImxvZyIsImVUeXBlIiwiY2hpbGRyZW4iLCJwcmVIZWFydEJlYXQiLCJfaGVhcnRCZWF0TnVtIiwicHJlZ0FscGhhIiwiaG92ZXJDbG9uZSIsImdldFN0YWdlIiwiYWN0aXZTaGFwZSIsInJlbW92ZUNoaWxkQnlJZCIsIl9oYXNFdmVudExpc3RlbmVyIiwib3ZlckZ1biIsIm91dEZ1biIsIm9uY2VIYW5kbGUiLCJhcHBseSIsInVuIiwiTWF0cml4IiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJtdHgiLCJzY2FsZVgiLCJzY2FsZVkiLCJyb3RhdGlvbiIsImNvcyIsInNpbiIsIlBJIiwiY29uY2F0IiwiYW5nbGUiLCJzdCIsImFicyIsImN0Iiwic3giLCJzeSIsImR4IiwiZHkiLCJ2IiwiYWEiLCJhYyIsImF0eCIsImFiIiwiYWQiLCJhdHkiLCJvdXQiLCJfY2FjaGUiLCJfcmFkaWFucyIsImlzRGVncmVlcyIsInRvRml4ZWQiLCJkZWdyZWVUb1JhZGlhbiIsInJhZGlhblRvRGVncmVlIiwiZGVncmVlVG8zNjAiLCJyZUFuZyIsImlzSW5zaWRlIiwic2hhcGUiLCJfcG9pbnRJblNoYXBlIiwiX2lzSW5zaWRlTGluZSIsIl9pc0luc2lkZUJyb2tlbkxpbmUiLCJfaXNJbnNpZGVDaXJjbGUiLCJfaXNQb2ludEluRWxpcHNlIiwiX2lzSW5zaWRlU2VjdG9yIiwiX2lzSW5zaWRlUGF0aCIsIl9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlciIsImlzT3V0c2lkZSIsIngwIiwieFN0YXJ0IiwieTAiLCJ5U3RhcnQiLCJ4MSIsInhFbmQiLCJ5MSIsInlFbmQiLCJfbCIsImxpbmVXaWR0aCIsIl9hIiwiX2IiLCJfcyIsInBvaW50TGlzdCIsImxpbmVBcmVhIiwiaW5zaWRlQ2F0Y2giLCJsIiwiX2lzSW5zaWRlUmVjdGFuZ2xlIiwibWluIiwicjAiLCJzdGFydEFuZ2xlIiwibXlNYXRoIiwiZW5kQW5nbGUiLCJhdGFuMiIsInJlZ0luIiwiY2xvY2t3aXNlIiwicmVnQW5nbGUiLCJpbkFuZ2xlUmVnIiwiY2VudGVyIiwiWFJhZGl1cyIsImhyIiwiWVJhZGl1cyIsInZyIiwiaVJlcyIsInBvbHkiLCJ3biIsInNoaWZ0UCIsInNoaWZ0IiwiaW5MaW5lIiwiZmlsbFN0eWxlIiwibiIsIlRXRUVOIiwiX3R3ZWVucyIsInR3ZWVuIiwidGltZSIsInByZXNlcnZlIiwibm93IiwiX3QiLCJfdXBkYXRlUmVzIiwidXBkYXRlIiwicHJvY2VzcyIsImhydGltZSIsInBlcmZvcm1hbmNlIiwiYmluZCIsIkRhdGUiLCJnZXRUaW1lIiwiVHdlZW4iLCJvYmplY3QiLCJfb2JqZWN0IiwiX3ZhbHVlc1N0YXJ0IiwiX3ZhbHVlc0VuZCIsIl92YWx1ZXNTdGFydFJlcGVhdCIsIl9kdXJhdGlvbiIsIl9yZXBlYXQiLCJfcmVwZWF0RGVsYXlUaW1lIiwiX3lveW8iLCJfaXNQbGF5aW5nIiwiX3JldmVyc2VkIiwiX2RlbGF5VGltZSIsIl9zdGFydFRpbWUiLCJfZWFzaW5nRnVuY3Rpb24iLCJFYXNpbmciLCJMaW5lYXIiLCJOb25lIiwiX2ludGVycG9sYXRpb25GdW5jdGlvbiIsIkludGVycG9sYXRpb24iLCJfY2hhaW5lZFR3ZWVucyIsIl9vblN0YXJ0Q2FsbGJhY2siLCJfb25TdGFydENhbGxiYWNrRmlyZWQiLCJfb25VcGRhdGVDYWxsYmFjayIsIl9vbkNvbXBsZXRlQ2FsbGJhY2siLCJfb25TdG9wQ2FsbGJhY2siLCJ0byIsInByb3BlcnRpZXMiLCJkdXJhdGlvbiIsImFkZCIsInByb3BlcnR5Iiwic3RvcCIsInJlbW92ZSIsInN0b3BDaGFpbmVkVHdlZW5zIiwibnVtQ2hhaW5lZFR3ZWVucyIsImRlbGF5IiwiYW1vdW50IiwicmVwZWF0IiwidGltZXMiLCJyZXBlYXREZWxheSIsInlveW8iLCJlYXNpbmciLCJpbnRlcnBvbGF0aW9uIiwiY2hhaW4iLCJvblN0YXJ0IiwiY2FsbGJhY2siLCJvblVwZGF0ZSIsIm9uQ29tcGxldGUiLCJvblN0b3AiLCJlbGFwc2VkIiwiY2hhckF0IiwidG1wIiwiayIsInBvdyIsInNxcnQiLCJCb3VuY2UiLCJPdXQiLCJJbiIsIm0iLCJmIiwiZmxvb3IiLCJwdyIsImJuIiwiQmVybnN0ZWluIiwiQ2F0bXVsbFJvbSIsInAwIiwicDEiLCJ0IiwiZmMiLCJGYWN0b3JpYWwiLCJwMiIsInAzIiwidjAiLCJ2MSIsInQyIiwidDMiLCJsYXN0VGltZSIsInZlbmRvcnMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImVsZW1lbnQiLCJjdXJyVGltZSIsInRpbWVUb0NhbGwiLCJzZXRUaW1lb3V0IiwiX3Rhc2tMaXN0IiwiX3JlcXVlc3RBaWQiLCJlbmFibGVkQW5pbWF0aW9uRnJhbWUiLCJjdXJyVGFza0xpc3QiLCJ0YXNrIiwicmVnaXN0RnJhbWUiLCIkZnJhbWUiLCJkZXN0cm95RnJhbWUiLCJkX3Jlc3VsdCIsInJlZ2lzdFR3ZWVuIiwidGlkIiwiZnJvbSIsIl9pc0NvbXBsZXRlZWQiLCJfaXNTdG9wZWQiLCJhbmltYXRlIiwiZGVzYyIsImRlc3Ryb3lUd2VlbiIsIm1zZyIsInVud2F0Y2hPbmUiLCJPYnNlcnZlIiwic2NvcGUiLCJtb2RlbCIsIndhdGNoTW9yZSIsInN0b3BSZXBlYXRBc3NpZ24iLCJza2lwQXJyYXkiLCIkc2tpcEFycmF5IiwiVkJQdWJsaWNzIiwibG9vcCIsInZhbCIsInZhbHVlVHlwZSIsImFjY2Vzc29yIiwibmVvIiwicHJlVmFsdWUiLCJjb21wbGV4VmFsdWUiLCJuZW9UeXBlIiwiYWRkQ29sb3JTdG9wIiwiJG1vZGVsIiwiJGZpcmUiLCJwbW9kZWwiLCJoYXNXYXRjaE1vZGVsIiwiJHdhdGNoIiwiJHBhcmVudCIsImRlZmluZVByb3BlcnRpZXMiLCJhY2Nlc3NvcmVzIiwiJGFjY2Vzc29yIiwiZGVmaW5lUHJvcGVydHkiLCJwcm9wIiwiX19kZWZpbmVHZXR0ZXJfXyIsImdldCIsIl9fZGVmaW5lU2V0dGVyX18iLCJzZXQiLCJkZXNjcyIsIlZCQXJyYXkiLCJleGVjU2NyaXB0Iiwiam9pbiIsIlZCTWVkaWF0b3IiLCJkZXNjcmlwdGlvbiIsInB1YmxpY3MiLCJvd25lciIsImJ1ZmZlciIsInBhcnNlVkIiLCJEaXNwbGF5T2JqZWN0IiwiY2hlY2tPcHQiLCJzdGFnZSIsInh5VG9JbnQiLCJfY3JlYXRlQ29udGV4dCIsIlVJRCIsImNyZWF0ZUlkIiwiaW5pdCIsIl91cGRhdGVUcmFuc2Zvcm0iLCJzb3VyY2UiLCJzdHJpY3QiLCJfY29udGV4dEFUVFJTIiwiX2NvbnRleHQiLCIkb3duZXIiLCJ0cmFuc0Zvcm1Qcm9wcyIsIm15c2VsZiIsImNvbmYiLCJpbWciLCJuZXdPYmoiLCJ0ZXh0IiwiY29udGFpbmVyIiwiY20iLCJpbnZlcnQiLCJsb2NhbFRvR2xvYmFsIiwibyIsImJvb2wiLCJudW0iLCJmcm9tSW5kZXgiLCJnZXRJbmRleCIsInRvSW5kZXgiLCJwY2wiLCJ0cmFuc0Zvcm0iLCJ0cmFuc2Zvcm0iLCJ0b0FycmF5Iiwib3JpZ2luIiwic2NhbGVPcmlnaW4iLCJ0cmFuc2xhdGUiLCJzY2FsZSIsInJvdGF0ZU9yaWdpbiIsInJvdGF0ZSIsInBhcnNlSW50Iiwic3Ryb2tlU3R5bGUiLCJyZXN1bHQiLCJpbnZlcnNlTWF0cml4Iiwib3JpZ2luUG9zIiwibXVsVmVjdG9yIiwiX3JlY3QiLCJnZXRSZWN0IiwiSGl0VGVzdFBvaW50IiwidG9Db250ZW50IiwidXBGdW4iLCJjb21wRnVuIiwiQW5pbWF0aW9uRnJhbWUiLCJ2aXNpYmxlIiwic2F2ZSIsIl90cmFuc2Zvcm1IYW5kZXIiLCJzZXRDb250ZXh0U3R5bGUiLCJyZW5kZXIiLCJyZXN0b3JlIiwicmVtb3ZlQ2hpbGQiLCJEaXNwbGF5T2JqZWN0Q29udGFpbmVyIiwibW91c2VDaGlsZHJlbiIsImdldENoaWxkSW5kZXgiLCJfYWZ0ZXJBZGRDaGlsZCIsInJlbW92ZUNoaWxkQXQiLCJfYWZ0ZXJEZWxDaGlsZCIsImxlbiIsImdldENoaWxkQXQiLCJib29sZW4iLCJvbGRJbmRleCIsImdldE51bUNoaWxkcmVuIiwib2JqcyIsIl9yZW5kZXIiLCJTdGFnZSIsImNvbnRleHQyRCIsInN0YWdlUmVuZGluZyIsIl9pc1JlYWR5IiwiX2RldmljZVBpeGVsUmF0aW8iLCJjbGVhciIsImNsZWFyUmVjdCIsIlJFTkRFUkVSX1RZUEUiLCJTeXN0ZW1SZW5kZXJlciIsIlVOS05PV04iLCJhcHAiLCJyZXF1ZXN0QWlkIiwiY29udmVydFN0YWdlcyIsIl9oZWFydEJlYXQiLCJfcHJlUmVuZGVyVGltZSIsImVudGVyRnJhbWUiLCJjb252ZXJ0U3RhZ2UiLCJfX3Rhc2tMaXN0Iiwic3RhcnRFbnRlciIsImNvbnZlcnRUeXBlIiwiX2NvbnZlcnRDYW52YXgiLCJjb252ZXJ0U2hhcGVzIiwiQ2FudmFzUmVuZGVyZXIiLCJDQU5WQVMiLCJBcHBsaWNhdGlvbiIsIl9jaWQiLCJyYW5kb20iLCJxdWVyeSIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0Iiwidmlld09iaiIsImNyZWF0ZVZpZXciLCJpbm5lckhUTUwiLCJvZmZzZXQiLCJsYXN0R2V0Uk8iLCJyZW5kZXJlciIsIlJlbmRlcmVyIiwiX2NyZWF0SG92ZXJTdGFnZSIsIl9jcmVhdGVQaXhlbENvbnRleHQiLCJyZVNpemVDYW52YXMiLCJyZXNpemUiLCJhZGRDaGlsZCIsIl9waXhlbENhbnZhcyIsImNyZWF0ZUNhbnZhcyIsImNhbnZhc1N1cHBvcnQiLCJkaXNwbGF5IiwiekluZGV4IiwidmlzaWJpbGl0eSIsIl9waXhlbEN0eCIsImluc2VydEJlZm9yZSIsImluaXRTdGFnZSIsIlNwcml0ZSIsIlNoYXBlIiwiX2hvdmVyYWJsZSIsIl9jbGlja2FibGUiLCJkcmF3IiwiaW5pdENvbXBQcm9wZXJ0eSIsIl9oYXNGaWxsQW5kU3Ryb2tlIiwiX2RyYXdUeXBlT25seSIsImNsb3NlUGF0aCIsInN0cm9rZSIsImZpbGwiLCJiZWdpblBhdGgiLCJkcmF3RW5kIiwieDIiLCJ5MiIsImRhc2hMZW5ndGgiLCJkZWx0YVgiLCJkZWx0YVkiLCJudW1EYXNoZXMiLCJsaW5lVG8iLCJtaW5YIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwibWF4WCIsIk1JTl9WQUxVRSIsIm1pblkiLCJtYXhZIiwiY3BsIiwicm91bmQiLCJUZXh0IiwiX3JlTmV3bGluZSIsImZvbnRQcm9wZXJ0cyIsImZvbnQiLCJfZ2V0Rm9udERlY2xhcmF0aW9uIiwiZ2V0VGV4dFdpZHRoIiwiZ2V0VGV4dEhlaWdodCIsIl9yZW5kZXJUZXh0IiwiX2dldFRleHRMaW5lcyIsIl9nZXRUZXh0V2lkdGgiLCJfZ2V0VGV4dEhlaWdodCIsInRleHRMaW5lcyIsIl9yZW5kZXJUZXh0U3Ryb2tlIiwiX3JlbmRlclRleHRGaWxsIiwiZm9udEFyciIsImZvbnRQIiwiX2JvdW5kYXJpZXMiLCJsaW5lSGVpZ2h0cyIsImhlaWdodE9mTGluZSIsIl9nZXRIZWlnaHRPZkxpbmUiLCJfcmVuZGVyVGV4dExpbmUiLCJfZ2V0VG9wT2Zmc2V0Iiwic3Ryb2tlRGFzaEFycmF5Iiwic2V0TGluZURhc2giLCJtZXRob2QiLCJsaW5lIiwibGluZUluZGV4IiwidGV4dEFsaWduIiwiX3JlbmRlckNoYXJzIiwibWVhc3VyZVRleHQiLCJ0b3RhbFdpZHRoIiwid29yZHMiLCJ3b3Jkc1dpZHRoIiwicmVwbGFjZSIsIndpZHRoRGlmZiIsIm51bVNwYWNlcyIsInNwYWNlV2lkdGgiLCJsZWZ0T2Zmc2V0IiwiY2hhcnMiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJtYXhXaWR0aCIsImN1cnJlbnRMaW5lV2lkdGgiLCJ0ZXh0QmFzZWxpbmUiLCJNb3ZpZWNsaXAiLCJjdXJyZW50RnJhbWUiLCJhdXRvUGxheSIsIm92ZXJQbGF5IiwiX2ZyYW1lUmF0ZSIsIm1haW5GcmFtZVJhdGUiLCJfc3BlZWRUaW1lIiwiZnJhbWVSYXRlIiwicHJlRnJhbWUiLCJfZ290byIsInBsYXkiLCJfX3N0YXJ0RW50ZXIiLCJfcHVzaDJUYXNrTGlzdCIsIl9lbnRlckluQ2FudmF4IiwiZ290b0FuZFN0b3AiLCJfbmV4dCIsIl9wcmUiLCJoYXNFdmVudCIsInRMaXN0IiwiVmVjdG9yIiwidngiLCJ2eSIsIl9heGVzIiwiaW50ZXJwb2xhdGUiLCJwb2ludHMiLCJpc0xvb3AiLCJzbW9vdGhGaWx0ZXIiLCJyZXQiLCJkaXN0YW5jZSIsInByZVZlcnRvciIsImlWdG9yIiwic2VncyIsInBvcyIsImlkeCIsInciLCJ3MiIsInczIiwiQnJva2VuTGluZSIsImF0eXBlIiwiX2luaXRQb2ludExpc3QiLCJteUMiLCJzbW9vdGgiLCJjdXJyTCIsIlNtb290aFNwbGluZSIsIl9kcmF3IiwibGluZVR5cGUiLCJtb3ZlVG8iLCJzaSIsInNsIiwiZnJvbVgiLCJ0b1giLCJmcm9tWSIsInRvWSIsImRhc2hlZExpbmVUbyIsImdldFJlY3RGb3JtUG9pbnRMaXN0IiwiQ2lyY2xlIiwiYXJjIiwicGxpc3QiLCJpdCIsIml0MiIsIml0MyIsImNwWDEiLCJjcFkxIiwiY3BYMiIsImNwWTIiLCJQYXRoIiwiZHJhd1R5cGVPbmx5IiwiX19wYXJzZVBhdGhEYXRhIiwicGF0aCIsImRhdGEiLCJwYXRocyIsInBhdGhTdHIiLCJfcGFyc2VDaGlsZFBhdGhEYXRhIiwiY3MiLCJjYyIsIlJlZ0V4cCIsImFyciIsImNhIiwiY3B4IiwiY3B5Iiwic3RyIiwiY21kIiwiY3RsUHR4IiwiY3RsUHR5IiwicHJldkNtZCIsInJ4IiwicnkiLCJwc2kiLCJmYSIsImZzIiwiY29tbWFuZCIsIl9jb252ZXJ0UG9pbnQiLCJwc2lEZWciLCJ4cCIsInlwIiwibGFtYmRhIiwiY3hwIiwiY3lwIiwiY3giLCJjeSIsInZNYWciLCJ2UmF0aW8iLCJ1IiwidkFuZ2xlIiwiYWNvcyIsInRoZXRhIiwiZFRoZXRhIiwic3RlcHMiLCJjZWlsIiwicGFyciIsInRwIiwiQmV6aWVyIiwiZ2V0UG9pbnRCeVRpbWUiLCJjcHMiLCJwYXRoQXJyYXkiLCJfcGFyc2VQYXRoRGF0YSIsIl9zZXRQb2ludExpc3QiLCJnIiwiZ2wiLCJiZXppZXJDdXJ2ZVRvIiwicXVhZHJhdGljQ3VydmVUbyIsInNpbmdsZVBvaW50TGlzdCIsInRvVXBwZXJDYXNlIiwiX2dldEFyY1BvaW50cyIsIl9wb2ludHMiLCJjU3RhcnQiLCJwcmVQb2ludHMiLCJfZ2V0QmV6aWVyUG9pbnRzIiwiaiIsInB5IiwicmVjdCIsIkRyb3BsZXQiLCJwcyIsIkVsbGlwc2UiLCJyYXRpb1giLCJyYXRpb1kiLCJQb2x5Z29uIiwidW5zaGlmdCIsIklzb2dvbiIsInNldFBvaW50TGlzdCIsImRTdGVwIiwiYmVnaW5EZWciLCJkZWciLCJMaW5lIiwiUmVjdCIsInJhZGl1cyIsImdldENzc09yZGVyQXJyIiwiZmlsbFJlY3QiLCJzdHJva2VSZWN0IiwiX2J1aWxkUmFkaXVzUGF0aCIsIlNlY3RvciIsImlzUmluZyIsImdldFJlZ0FuZ2xlIiwicDREaXJlY3Rpb24iLCJDYW52YXgiLCJEaXNwbGF5IiwiU2hhcGVzIiwiRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUlBLE1BQUksRUFBUjtBQUNBLElBQUlDLFVBQVUsRUFBZDtBQUNBLElBQUlDLGFBQWFDLE1BQU1DLFNBQXZCO0lBQWtDQyxXQUFXQyxPQUFPRixTQUFwRDtBQUNBLElBQ0FHLFdBQW1CRixTQUFTRSxRQUQ1QjtJQUVBQyxpQkFBbUJILFNBQVNHLGNBRjVCOztBQUlBLElBQ0FDLGdCQUFxQlAsV0FBV1EsT0FEaEM7SUFFQUMsZUFBcUJULFdBQVdVLE1BRmhDO0lBR0FDLGdCQUFxQlgsV0FBV1ksT0FIaEM7SUFJQUMsZ0JBQXFCWixNQUFNYSxPQUozQjtJQUtBQyxhQUFxQlgsT0FBT1ksSUFMNUI7O0FBT0FsQixJQUFFbUIsTUFBRixHQUFXLFVBQVNDLEdBQVQsRUFBYztNQUNuQkYsT0FBT2xCLElBQUVrQixJQUFGLENBQU9FLEdBQVAsQ0FBWDtNQUNJQyxT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
