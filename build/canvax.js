var Canvax = (function () {
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

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmF4LmpzIiwic291cmNlcyI6WyIuLi9jYW52YXgvdXRpbHMvdW5kZXJzY29yZS5qcyIsIi4uL2NhbnZheC91dGlscy9pbmRleC5qcyIsIi4uL2NhbnZheC9kaXNwbGF5L1BvaW50LmpzIiwiLi4vY2FudmF4L2V2ZW50L0NhbnZheEV2ZW50LmpzIiwiLi4vY2FudmF4L3NldHRpbmdzLmpzIiwiLi4vY2FudmF4L3V0aWxzL2RvbS5qcyIsIi4uL2NhbnZheC9ldmVudC9FdmVudEhhbmRsZXIuanMiLCIuLi9jYW52YXgvZXZlbnQvRXZlbnRNYW5hZ2VyLmpzIiwiLi4vY2FudmF4L2V2ZW50L0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uL2NhbnZheC9nZW9tL01hdHJpeC5qcyIsIi4uL2NhbnZheC9nZW9tL01hdGguanMiLCIuLi9jYW52YXgvZ2VvbS9IaXRUZXN0UG9pbnQuanMiLCIuLi9jYW52YXgvYW5pbWF0aW9uL1R3ZWVuLmpzIiwiLi4vY2FudmF4L2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZS5qcyIsIi4uL2NhbnZheC91dGlscy9vYnNlcnZlLmpzIiwiLi4vY2FudmF4L2NvbnN0LmpzIiwiLi4vY2FudmF4L2Rpc3BsYXkvRGlzcGxheU9iamVjdC5qcyIsIi4uL2NhbnZheC9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXIuanMiLCIuLi9jYW52YXgvZGlzcGxheS9TdGFnZS5qcyIsIi4uL2NhbnZheC9yZW5kZXJlcnMvU3lzdGVtUmVuZGVyZXIuanMiLCIuLi9jYW52YXgvcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlci5qcyIsIi4uL2NhbnZheC9BcHBsaWNhdGlvbi5qcyIsIi4uL2NhbnZheC9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uL2NhbnZheC9ncmFwaGljcy9HcmFwaGljc0RhdGEuanMiLCIuLi9jYW52YXgvbWF0aC9Qb2ludC5qcyIsIi4uL2NhbnZheC9tYXRoL01hdHJpeC5qcyIsIi4uL2NhbnZheC9tYXRoL0dyb3VwRDguanMiLCIuLi9jYW52YXgvbWF0aC9zaGFwZXMvUmVjdGFuZ2xlLmpzIiwiLi4vY2FudmF4L21hdGgvc2hhcGVzL0NpcmNsZS5qcyIsIi4uL2NhbnZheC9tYXRoL3NoYXBlcy9FbGxpcHNlLmpzIiwiLi4vY2FudmF4L21hdGgvc2hhcGVzL1BvbHlnb24uanMiLCIuLi9jYW52YXgvbWF0aC9zaGFwZXMvUm91bmRlZFJlY3RhbmdsZS5qcyIsIi4uL2NhbnZheC9tYXRoL2luZGV4LmpzIiwiLi4vY2FudmF4L2dyYXBoaWNzL3V0aWxzL2JlemllckN1cnZlVG8uanMiLCIuLi9jYW52YXgvZ3JhcGhpY3MvR3JhcGhpY3MuanMiLCIuLi9jYW52YXgvZGlzcGxheS9TaGFwZS5qcyIsIi4uL2NhbnZheC9kaXNwbGF5L1RleHQuanMiLCIuLi9jYW52YXgvZ2VvbS9WZWN0b3IuanMiLCIuLi9jYW52YXgvZ2VvbS9TbW9vdGhTcGxpbmUuanMiLCIuLi9jYW52YXgvc2hhcGUvQnJva2VuTGluZS5qcyIsIi4uL2NhbnZheC9zaGFwZS9DaXJjbGUuanMiLCIuLi9jYW52YXgvZ2VvbS9iZXppZXIuanMiLCIuLi9jYW52YXgvc2hhcGUvUGF0aC5qcyIsIi4uL2NhbnZheC9zaGFwZS9Ecm9wbGV0LmpzIiwiLi4vY2FudmF4L3NoYXBlL0VsbGlwc2UuanMiLCIuLi9jYW52YXgvc2hhcGUvUG9seWdvbi5qcyIsIi4uL2NhbnZheC9zaGFwZS9Jc29nb24uanMiLCIuLi9jYW52YXgvc2hhcGUvTGluZS5qcyIsIi4uL2NhbnZheC9zaGFwZS9SZWN0LmpzIiwiLi4vY2FudmF4L3NoYXBlL1NlY3Rvci5qcyIsIi4uL2NhbnZheC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgXyA9IHt9XG52YXIgYnJlYWtlciA9IHt9O1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xudmFyXG50b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG5oYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbnZhclxubmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxubmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG5uYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG5uYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxubmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXM7XG5cbl8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG5fLmtleXMgPSBuYXRpdmVLZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqICE9PSBPYmplY3Qob2JqKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBvYmplY3QnKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIGtleXM7XG59O1xuXG5fLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn07XG5cbnZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgfVxuICB9XG59O1xuXG5fLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xufTtcblxuXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0cztcbn07XG5cbmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgfTtcbn0pO1xuXG5pZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICB9O1xufTtcblxuXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbn07XG5cbl8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbn07XG5cbl8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufTtcblxuXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbn07XG5cbl8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xufTtcblxuXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xufTtcblxuXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbl8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5fLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIGlmIChpc1NvcnRlZCkge1xuICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgfVxuICB9XG4gIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG59O1xuXG5fLmlzV2luZG93ID0gZnVuY3Rpb24oIG9iaiApIHsgXG4gICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09IG9iai53aW5kb3c7XG59O1xuXy5pc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24oIG9iaiApIHtcbiAgICAvLyBCZWNhdXNlIG9mIElFLCB3ZSBhbHNvIGhhdmUgdG8gY2hlY2sgdGhlIHByZXNlbmNlIG9mIHRoZSBjb25zdHJ1Y3RvciBwcm9wZXJ0eS5cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBET00gbm9kZXMgYW5kIHdpbmRvdyBvYmplY3RzIGRvbid0IHBhc3MgdGhyb3VnaCwgYXMgd2VsbFxuICAgIGlmICggIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8IG9iai5ub2RlVHlwZSB8fCBfLmlzV2luZG93KCBvYmogKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG4gICAgICAgIGlmICggb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpICYmXG4gICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgXCJpc1Byb3RvdHlwZU9mXCIpICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIC8vIElFOCw5IFdpbGwgdGhyb3cgZXhjZXB0aW9ucyBvbiBjZXJ0YWluIGhvc3Qgb2JqZWN0cyAjOTg5N1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAgIC8vIGlmIGxhc3Qgb25lIGlzIG93biwgdGhlbiBhbGwgcHJvcGVydGllcyBhcmUgb3duLlxuICAgIHZhciBrZXk7XG4gICAgZm9yICgga2V5IGluIG9iaiApIHt9XG5cbiAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwoIG9iaiwga2V5ICk7XG59O1xuXG4vKipcbipcbirlpoLmnpzmmK/mt7HluqZleHRlbmTvvIznrKzkuIDkuKrlj4LmlbDlsLHorr7nva7kuLp0cnVlXG4qL1xuXy5leHRlbmQgPSBmdW5jdGlvbigpIHsgIFxuICB2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsICBcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSwgIFxuICAgICAgaSA9IDEsICBcbiAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsICBcbiAgICAgIGRlZXAgPSBmYWxzZTsgIFxuICBpZiAoIHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiICkgeyAgXG4gICAgICBkZWVwID0gdGFyZ2V0OyAgXG4gICAgICB0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307ICBcbiAgICAgIGkgPSAyOyAgXG4gIH07ICBcbiAgaWYgKCB0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICFfLmlzRnVuY3Rpb24odGFyZ2V0KSApIHsgIFxuICAgICAgdGFyZ2V0ID0ge307ICBcbiAgfTsgIFxuICBpZiAoIGxlbmd0aCA9PT0gaSApIHsgIFxuICAgICAgdGFyZ2V0ID0gdGhpczsgIFxuICAgICAgLS1pOyAgXG4gIH07ICBcbiAgZm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7ICBcbiAgICAgIGlmICggKG9wdGlvbnMgPSBhcmd1bWVudHNbIGkgXSkgIT0gbnVsbCApIHsgIFxuICAgICAgICAgIGZvciAoIG5hbWUgaW4gb3B0aW9ucyApIHsgIFxuICAgICAgICAgICAgICBzcmMgPSB0YXJnZXRbIG5hbWUgXTsgIFxuICAgICAgICAgICAgICBjb3B5ID0gb3B0aW9uc1sgbmFtZSBdOyAgXG4gICAgICAgICAgICAgIGlmICggdGFyZ2V0ID09PSBjb3B5ICkgeyAgXG4gICAgICAgICAgICAgICAgICBjb250aW51ZTsgIFxuICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgaWYgKCBkZWVwICYmIGNvcHkgJiYgKCBfLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gXy5pc0FycmF5KGNvcHkpKSApICkgeyAgXG4gICAgICAgICAgICAgICAgICBpZiAoIGNvcHlJc0FycmF5ICkgeyAgXG4gICAgICAgICAgICAgICAgICAgICAgY29weUlzQXJyYXkgPSBmYWxzZTsgIFxuICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIF8uaXNBcnJheShzcmMpID8gc3JjIDogW107ICBcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBfLmlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9OyAgXG4gICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gXy5leHRlbmQoIGRlZXAsIGNsb25lLCBjb3B5ICk7ICBcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkgeyAgXG4gICAgICAgICAgICAgICAgICB0YXJnZXRbIG5hbWUgXSA9IGNvcHk7ICBcbiAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgfSAgXG4gICAgICB9ICBcbiAgfSAgXG4gIHJldHVybiB0YXJnZXQ7ICBcbn07IFxuXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh0cnVlLCB7fSwgb2JqKTtcbn07XG5leHBvcnQgZGVmYXVsdCBfOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tIFxuKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbnZhciBVdGlscyA9IHtcbiAgICBtYWluRnJhbWVSYXRlICAgOiA2MCwvL+m7mOiupOS4u+W4p+eOh1xuICAgIG5vdyA6IDAsXG4gICAgLyrlg4/ntKDmo4DmtYvkuJPnlKgqL1xuICAgIF9waXhlbEN0eCAgIDogbnVsbCxcbiAgICBfX2VtcHR5RnVuYyA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL3JldGluYSDlsY/luZXkvJjljJZcbiAgICBfZGV2aWNlUGl4ZWxSYXRpbyA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG4gICAgX1VJRCAgOiAwLCAvL+ivpeWAvOS4uuWQkeS4iueahOiHquWinumVv+aVtOaVsOWAvFxuICAgIGdldFVJRDpmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fVUlEKys7XG4gICAgfSxcbiAgICBjcmVhdGVJZCA6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgLy9pZiBlbmQgd2l0aCBhIGRpZ2l0LCB0aGVuIGFwcGVuZCBhbiB1bmRlcnNCYXNlIGJlZm9yZSBhcHBlbmRpbmdcbiAgICAgICAgdmFyIGNoYXJDb2RlID0gbmFtZS5jaGFyQ29kZUF0KG5hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmIChjaGFyQ29kZSA+PSA0OCAmJiBjaGFyQ29kZSA8PSA1NykgbmFtZSArPSBcIl9cIjtcbiAgICAgICAgcmV0dXJuIG5hbWUgKyBVdGlscy5nZXRVSUQoKTtcbiAgICB9LFxuICAgIGNhbnZhc1N1cHBvcnQgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dDtcbiAgICB9LFxuICAgIGNyZWF0ZU9iamVjdCA6IGZ1bmN0aW9uKCBwcm90byAsIGNvbnN0cnVjdG9yICkge1xuICAgICAgICB2YXIgbmV3UHJvdG87XG4gICAgICAgIHZhciBPYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuICAgICAgICBpZiAoT2JqZWN0Q3JlYXRlKSB7XG4gICAgICAgICAgICBuZXdQcm90byA9IE9iamVjdENyZWF0ZShwcm90byk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBVdGlscy5fX2VtcHR5RnVuYy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgICAgICAgIG5ld1Byb3RvID0gbmV3IFV0aWxzLl9fZW1wdHlGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3UHJvdG8uY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ld1Byb3RvO1xuICAgIH0sXG4gICAgY3JlYXRDbGFzcyA6IGZ1bmN0aW9uKHIsIHMsIHB4KXtcbiAgICAgICAgaWYgKCFzIHx8ICFyKSB7XG4gICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3AgPSBzLnByb3RvdHlwZSwgcnA7XG4gICAgICAgIC8vIGFkZCBwcm90b3R5cGUgY2hhaW5cbiAgICAgICAgcnAgPSBVdGlscy5jcmVhdGVPYmplY3Qoc3AsIHIpO1xuICAgICAgICByLnByb3RvdHlwZSA9IF8uZXh0ZW5kKHJwLCByLnByb3RvdHlwZSk7XG4gICAgICAgIHIuc3VwZXJjbGFzcyA9IFV0aWxzLmNyZWF0ZU9iamVjdChzcCwgcyk7XG4gICAgICAgIC8vIGFkZCBwcm90b3R5cGUgb3ZlcnJpZGVzXG4gICAgICAgIGlmIChweCkge1xuICAgICAgICAgICAgXy5leHRlbmQocnAsIHB4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9LFxuICAgIGluaXRFbGVtZW50IDogZnVuY3Rpb24oIGNhbnZhcyApe1xuICAgICAgICBpZiggd2luZG93LkZsYXNoQ2FudmFzICYmIEZsYXNoQ2FudmFzLmluaXRFbGVtZW50KXtcbiAgICAgICAgICAgIEZsYXNoQ2FudmFzLmluaXRFbGVtZW50KCBjYW52YXMgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lgZrkuIDmrKHnroDljZXnmoRvcHTlj4LmlbDmoKHpqozvvIzkv53or4HlnKjnlKjmiLfkuI3kvKBvcHTnmoTml7blgJkg5oiW6ICF5Lyg5LqGb3B05L2G5piv6YeM6Z2i5rKh5pyJY29udGV4dOeahOaXtuWAmeaKpemUmVxuICAgIGNoZWNrT3B0ICAgIDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgaWYoICFvcHQgKXtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGV4dCA6IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gICBcbiAgICAgICAgfSBlbHNlIGlmKCBvcHQgJiYgIW9wdC5jb250ZXh0ICkge1xuICAgICAgICAgIG9wdC5jb250ZXh0ID0ge31cbiAgICAgICAgICByZXR1cm4gb3B0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvcHQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOeugOWNleeahOa1heWkjeWItuWvueixoeOAglxuICAgICAqIEBwYXJhbSBzdHJpY3QgIOW9k+S4unRydWXml7blj6ropobnm5blt7LmnInlsZ7mgKdcbiAgICAgKi9cbiAgICBjb3B5MmNvbnRleHQgOiBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSwgc3RyaWN0KXsgXG4gICAgICAgIGlmICggXy5pc0VtcHR5KHNvdXJjZSkgKXtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBrZXkgaW4gc291cmNlKXtcbiAgICAgICAgICAgIGlmKCFzdHJpY3QgfHwgdGFyZ2V0Lmhhc093blByb3BlcnR5KGtleSkgfHwgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0sXG5cbiAgICBcbiAgICAvKipcbiAgICAgKiDmjInnhadjc3PnmoTpobrluo/vvIzov5Tlm57kuIDkuKpb5LiKLOWPsyzkuIss5bemXVxuICAgICAqL1xuICAgIGdldENzc09yZGVyQXJyIDogZnVuY3Rpb24oIHIgKXtcbiAgICAgICAgdmFyIHIxOyBcbiAgICAgICAgdmFyIHIyOyBcbiAgICAgICAgdmFyIHIzOyBcbiAgICAgICAgdmFyIHI0O1xuXG4gICAgICAgIGlmKHR5cGVvZiByID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSByO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYociBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBpZiAoci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IHJbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByMyA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByNCA9IHJbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHIubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gcjQgPSByWzFdO1xuICAgICAgICAgICAgICAgIHIzID0gclsyXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcjEgPSByWzBdO1xuICAgICAgICAgICAgICAgIHIyID0gclsxXTtcbiAgICAgICAgICAgICAgICByMyA9IHJbMl07XG4gICAgICAgICAgICAgICAgcjQgPSByWzNdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcjEgPSByMiA9IHIzID0gcjQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcjEscjIscjMscjRdO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxzOyIsIi8qKlxuICogUG9pbnRcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgseSl7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aD09MSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09ICdvYmplY3QnICl7XG4gICAgICAgdmFyIGFyZz1hcmd1bWVudHNbMF1cbiAgICAgICBpZiggXCJ4XCIgaW4gYXJnICYmIFwieVwiIGluIGFyZyApe1xuICAgICAgICAgIHRoaXMueCA9IGFyZy54KjE7XG4gICAgICAgICAgdGhpcy55ID0gYXJnLnkqMTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBpPTA7XG4gICAgICAgICAgZm9yICh2YXIgcCBpbiBhcmcpe1xuICAgICAgICAgICAgICBpZihpPT0wKXtcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBhcmdbcF0qMTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBhcmdbcF0qMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHggfHwgKHg9MCk7XG4gICAgeSB8fCAoeT0wKTtcbiAgICB0aGlzLnggPSB4KjE7XG4gICAgdGhpcy55ID0geSoxO1xufTtcblxuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICogY2FudmFzIOS4iuWnlOaJmOeahOS6i+S7tueuoeeQhlxuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG52YXIgQ2FudmF4RXZlbnQgPSBmdW5jdGlvbiggZXZ0ICwgcGFyYW1zICkge1xuXHRcblx0dmFyIGV2ZW50VHlwZSA9IFwiQ2FudmF4RXZlbnRcIjsgXG4gICAgaWYoIF8uaXNTdHJpbmcoIGV2dCApICl7XG4gICAgXHRldmVudFR5cGUgPSBldnQ7XG4gICAgfTtcbiAgICBpZiggXy5pc09iamVjdCggZXZ0ICkgJiYgZXZ0LnR5cGUgKXtcbiAgICBcdGV2ZW50VHlwZSA9IGV2dC50eXBlO1xuICAgIH07XG5cbiAgICB0aGlzLnRhcmdldCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcdFxuICAgIHRoaXMudHlwZSAgID0gZXZlbnRUeXBlO1xuICAgIHRoaXMucG9pbnQgID0gbnVsbDtcblxuICAgIHRoaXMuX3N0b3BQcm9wYWdhdGlvbiA9IGZhbHNlIDsgLy/pu5jorqTkuI3pmLvmraLkuovku7blhpLms6Fcbn1cbkNhbnZheEV2ZW50LnByb3RvdHlwZSA9IHtcbiAgICBzdG9wUHJvcGFnYXRpb24gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBDYW52YXhFdmVudDsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgLy/orr7lpIfliIbovqjnjodcbiAgICBSRVNPTFVUSU9OOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuXG4gICAgLy/muLLmn5NGUFNcbiAgICBGUFM6IDYwXG59O1xuIiwiaW1wb3J0IF8gZnJvbSBcIi4vdW5kZXJzY29yZVwiO1xuaW1wb3J0IHNldHRpbmdzIGZyb20gXCIuLi9zZXR0aW5nc1wiXG5cbnZhciBhZGRPclJtb3ZlRXZlbnRIYW5kID0gZnVuY3Rpb24oIGRvbUhhbmQgLCBpZUhhbmQgKXtcbiAgICBpZiggZG9jdW1lbnRbIGRvbUhhbmQgXSApe1xuICAgICAgICBmdW5jdGlvbiBldmVudERvbUZuKCBlbCAsIHR5cGUgLCBmbiApe1xuICAgICAgICAgICAgaWYoIGVsLmxlbmd0aCApe1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wIDsgaSA8IGVsLmxlbmd0aCA7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50RG9tRm4oIGVsW2ldICwgdHlwZSAsIGZuICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbFsgZG9tSGFuZCBdKCB0eXBlICwgZm4gLCBmYWxzZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZXZlbnREb21GblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bmN0aW9uIGV2ZW50Rm4oIGVsICwgdHlwZSAsIGZuICl7XG4gICAgICAgICAgICBpZiggZWwubGVuZ3RoICl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTAgOyBpIDwgZWwubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRGbiggZWxbaV0sdHlwZSxmbiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxbIGllSGFuZCBdKCBcIm9uXCIrdHlwZSAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKCBlbCAsIHdpbmRvdy5ldmVudCApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZXZlbnRGblxuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBkb23mk43kvZznm7jlhbPku6PnoIFcbiAgICBxdWVyeSA6IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgaWYoXy5pc1N0cmluZyhlbCkpe1xuICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpXG4gICAgICAgIH1cbiAgICAgICAgaWYoZWwubm9kZVR5cGUgPT0gMSl7XG4gICAgICAgICAgIC8v5YiZ5Li65LiA5LiqZWxlbWVudOacrOi6q1xuICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgfVxuICAgICAgICBpZihlbC5sZW5ndGgpe1xuICAgICAgICAgICByZXR1cm4gZWxbMF1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIG9mZnNldCA6IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdmFyIGJveCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBcbiAgICAgICAgZG9jID0gZWwub3duZXJEb2N1bWVudCwgXG4gICAgICAgIGJvZHkgPSBkb2MuYm9keSwgXG4gICAgICAgIGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50LCBcblxuICAgICAgICAvLyBmb3IgaWUgIFxuICAgICAgICBjbGllbnRUb3AgPSBkb2NFbGVtLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwLCBcbiAgICAgICAgY2xpZW50TGVmdCA9IGRvY0VsZW0uY2xpZW50TGVmdCB8fCBib2R5LmNsaWVudExlZnQgfHwgMCwgXG5cbiAgICAgICAgLy8gSW4gSW50ZXJuZXQgRXhwbG9yZXIgNyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgcHJvcGVydHkgaXMgdHJlYXRlZCBhcyBwaHlzaWNhbCwgXG4gICAgICAgIC8vIHdoaWxlIG90aGVycyBhcmUgbG9naWNhbC4gTWFrZSBhbGwgbG9naWNhbCwgbGlrZSBpbiBJRTguIFxuICAgICAgICB6b29tID0gMTsgXG4gICAgICAgIGlmIChib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCkgeyBcbiAgICAgICAgICAgIHZhciBib3VuZCA9IGJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7IFxuICAgICAgICAgICAgem9vbSA9IChib3VuZC5yaWdodCAtIGJvdW5kLmxlZnQpL2JvZHkuY2xpZW50V2lkdGg7IFxuICAgICAgICB9IFxuICAgICAgICBpZiAoem9vbSA+IDEpeyBcbiAgICAgICAgICAgIGNsaWVudFRvcCA9IDA7IFxuICAgICAgICAgICAgY2xpZW50TGVmdCA9IDA7IFxuICAgICAgICB9IFxuICAgICAgICB2YXIgdG9wID0gYm94LnRvcC96b29tICsgKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2NFbGVtICYmIGRvY0VsZW0uc2Nyb2xsVG9wL3pvb20gfHwgYm9keS5zY3JvbGxUb3Avem9vbSkgLSBjbGllbnRUb3AsIFxuICAgICAgICAgICAgbGVmdCA9IGJveC5sZWZ0L3pvb20gKyAod2luZG93LnBhZ2VYT2Zmc2V0fHwgZG9jRWxlbSAmJiBkb2NFbGVtLnNjcm9sbExlZnQvem9vbSB8fCBib2R5LnNjcm9sbExlZnQvem9vbSkgLSBjbGllbnRMZWZ0OyBcblxuICAgICAgICByZXR1cm4geyBcbiAgICAgICAgICAgIHRvcDogdG9wLCBcbiAgICAgICAgICAgIGxlZnQ6IGxlZnQgXG4gICAgICAgIH07IFxuICAgIH0sXG4gICAgYWRkRXZlbnQgOiBhZGRPclJtb3ZlRXZlbnRIYW5kKCBcImFkZEV2ZW50TGlzdGVuZXJcIiAsIFwiYXR0YWNoRXZlbnRcIiApLFxuICAgIHJlbW92ZUV2ZW50IDogYWRkT3JSbW92ZUV2ZW50SGFuZCggXCJyZW1vdmVFdmVudExpc3RlbmVyXCIgLCBcImRldGFjaEV2ZW50XCIgKSxcbiAgICBwYWdlWDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5wYWdlWCkgcmV0dXJuIGUucGFnZVg7XG4gICAgICAgIGVsc2UgaWYgKGUuY2xpZW50WClcbiAgICAgICAgICAgIHJldHVybiBlLmNsaWVudFggKyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgP1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCA6IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCk7XG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBwYWdlWTogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5wYWdlWSkgcmV0dXJuIGUucGFnZVk7XG4gICAgICAgIGVsc2UgaWYgKGUuY2xpZW50WSlcbiAgICAgICAgICAgIHJldHVybiBlLmNsaWVudFkgKyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA/XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgOiBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCk7XG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliJvlu7pkb21cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgZG9tIGlkIOW+heeUqFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIDogZG9tIHR5cGXvvIwgc3VjaCBhcyBjYW52YXMsIGRpdiBldGMuXG4gICAgICovXG4gICAgY3JlYXRlQ2FudmFzIDogZnVuY3Rpb24oIF93aWR0aCAsIF9oZWlnaHQgLCBpZCkge1xuICAgICAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoICA9IF93aWR0aCArICdweCc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBfaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgY2FudmFzLnN0eWxlLmxlZnQgICA9IDA7XG4gICAgICAgIGNhbnZhcy5zdHlsZS50b3AgICAgPSAwO1xuICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIF93aWR0aCAqIHNldHRpbmdzLlJFU09MVVRJT04pO1xuICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBfaGVpZ2h0ICogc2V0dGluZ3MuUkVTT0xVVElPTik7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgICAgICByZXR1cm4gY2FudmFzO1xuICAgIH0sXG4gICAgY3JlYXRlVmlldzogZnVuY3Rpb24oX3dpZHRoICwgX2hlaWdodCwgaWQpe1xuICAgICAgICB2YXIgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuY2xhc3NOYW1lID0gXCJjYW52YXgtdmlld1wiO1xuICAgICAgICB2aWV3LnN0eWxlLmNzc1RleHQgKz0gXCJwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDpcIiArIF93aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgX2hlaWdodCArXCJweDtcIlxuXG4gICAgICAgIHZhciBzdGFnZV9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5zdHlsZS5jc3NUZXh0ICs9IFwicG9zaXRpb246YWJzb2x1dGU7d2lkdGg6XCIgKyBfd2lkdGggKyBcInB4O2hlaWdodDpcIiArIF9oZWlnaHQgK1wicHg7XCJcblxuICAgICAgICAvL+eUqOadpeWtmOaUvuS4gOS6m2RvbeWFg+e0oFxuICAgICAgICB2YXIgZG9tX2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2aWV3LnN0eWxlLmNzc1RleHQgKz0gXCJwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpcIiArIF93aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgX2hlaWdodCArXCJweDtcIlxuXG4gICAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoc3RhZ2VfYyk7XG4gICAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZG9tX2MpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZpZXcgOiB2aWV3LFxuICAgICAgICAgICAgc3RhZ2VfYzogc3RhZ2VfYyxcbiAgICAgICAgICAgIGRvbV9jOiBkb21fY1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vZG9t55u45YWz5Luj56CB57uT5p2fXG59OyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqL1xuaW1wb3J0IFBvaW50IGZyb20gXCIuLi9kaXNwbGF5L1BvaW50XCI7XG5pbXBvcnQgQ2FudmF4RXZlbnQgZnJvbSBcIi4vQ2FudmF4RXZlbnRcIjtcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgJCBmcm9tIFwiLi4vdXRpbHMvZG9tXCI7XG5cbnZhciBfbW91c2VFdmVudFR5cGVzID0gW1wiY2xpY2tcIixcImRibGNsaWNrXCIsXCJtb3VzZWRvd25cIixcIm1vdXNlbW92ZVwiLFwibW91c2V1cFwiLFwibW91c2VvdXRcIl07XG52YXIgX2hhbW1lckV2ZW50VHlwZXMgPSBbIFxuICAgIFwicGFuXCIsXCJwYW5zdGFydFwiLFwicGFubW92ZVwiLFwicGFuZW5kXCIsXCJwYW5jYW5jZWxcIixcInBhbmxlZnRcIixcInBhbnJpZ2h0XCIsXCJwYW51cFwiLFwicGFuZG93blwiLFxuICAgIFwicHJlc3NcIiAsIFwicHJlc3N1cFwiLFxuICAgIFwic3dpcGVcIiAsIFwic3dpcGVsZWZ0XCIgLCBcInN3aXBlcmlnaHRcIiAsIFwic3dpcGV1cFwiICwgXCJzd2lwZWRvd25cIixcbiAgICBcInRhcFwiXG5dO1xuXG52YXIgRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oY2FudmF4ICwgb3B0KSB7XG4gICAgdGhpcy5jYW52YXggPSBjYW52YXg7XG5cbiAgICB0aGlzLmN1clBvaW50cyA9IFtuZXcgUG9pbnQoMCwgMCldIC8vWCxZIOeahCBwb2ludCDpm4blkIgsIOWcqHRvdWNo5LiL6Z2i5YiZ5Li6IHRvdWNo55qE6ZuG5ZCI77yM5Y+q5piv6L+Z5LiqdG91Y2jooqvmt7vliqDkuoblr7nlupTnmoR477yMeVxuICAgIC8v5b2T5YmN5r+A5rS755qE54K55a+55bqU55qEb2Jq77yM5ZyodG91Y2jkuIvlj6/ku6XmmK/kuKrmlbDnu4Qs5ZKM5LiK6Z2i55qEIGN1clBvaW50cyDlr7nlupRcbiAgICB0aGlzLmN1clBvaW50c1RhcmdldCA9IFtdO1xuXG4gICAgdGhpcy5fdG91Y2hpbmcgPSBmYWxzZTtcbiAgICAvL+ato+WcqOaLluWKqO+8jOWJjeaPkOaYr190b3VjaGluZz10cnVlXG4gICAgdGhpcy5fZHJhZ2luZyA9IGZhbHNlO1xuXG4gICAgLy/lvZPliY3nmoTpvKDmoIfnirbmgIFcbiAgICB0aGlzLl9jdXJzb3IgPSBcImRlZmF1bHRcIjtcblxuICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5jYW52YXgudmlldztcbiAgICB0aGlzLnR5cGVzID0gW107XG5cbiAgICAvL21vdXNl5L2T57uf5Lit5LiN6ZyA6KaB6YWN572uZHJhZyx0b3VjaOS4reS8mueUqOWIsOesrOS4ieaWueeahHRvdWNo5bqT77yM5q+P5Liq5bqT55qE5LqL5Lu25ZCN56ew5Y+v6IO95LiN5LiA5qC377yMXG4gICAgLy/lsLHopoHov5nph4zphY3nva7vvIzpu5jorqTlrp7njrDnmoTmmK9oYW1tZXJqc+eahCzmiYDku6Xpu5jorqTlj6/ku6XlnKjpobnnm67ph4zlvJXlhaVoYW1tZXJqcyBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICAgIHRoaXMuZHJhZyA9IHtcbiAgICAgICAgc3RhcnQgOiBcInBhbnN0YXJ0XCIsXG4gICAgICAgIG1vdmUgOiBcInBhbm1vdmVcIixcbiAgICAgICAgZW5kIDogXCJwYW5lbmRcIlxuICAgIH07XG5cbiAgICBfLmV4dGVuZCggdHJ1ZSAsIHRoaXMgLCBvcHQgKTtcblxufTtcblxuLy/ov5nmoLfnmoTlpb3lpITmmK9kb2N1bWVudC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbuWPquS8muWcqOWumuS5ieeahOaXtuWAmeaJp+ihjOS4gOasoeOAglxudmFyIGNvbnRhaW5zID0gZG9jdW1lbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb24gPyBmdW5jdGlvbiAocGFyZW50LCBjaGlsZCkge1xuICAgIGlmKCAhY2hpbGQgKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gISEocGFyZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGNoaWxkKSAmIDE2KTtcbn0gOiBmdW5jdGlvbiAocGFyZW50LCBjaGlsZCkge1xuICAgIGlmKCAhY2hpbGQgKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gY2hpbGQgIT09IGNoaWxkICYmIChwYXJlbnQuY29udGFpbnMgPyBwYXJlbnQuY29udGFpbnMoY2hpbGQpIDogdHJ1ZSk7XG59O1xuXG5FdmVudEhhbmRsZXIucHJvdG90eXBlID0ge1xuICAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgLy/kvp3mrKHmt7vliqDkuIrmtY/op4jlmajnmoToh6rluKbkuovku7bkvqblkKxcbiAgICAgICAgdmFyIG1lICAgPSB0aGlzO1xuICAgICAgICBpZiggbWUudGFyZ2V0Lm5vZGVUeXBlID09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgLy/lpoLmnpx0YXJnZXQubm9kZVR5cGXmsqHmnInnmoTor53vvIwg6K+05piO6K+ldGFyZ2V05Li65LiA5LiqalF1ZXJ55a+56LGhIG9yIGtpc3N5IOWvueixoW9yIGhhbW1lcuWvueixoVxuICAgICAgICAgICAgLy/ljbPkuLrnrKzkuInmlrnlupPvvIzpgqPkuYjlsLHopoHlr7nmjqXnrKzkuInmlrnlupPnmoTkuovku7bns7vnu5/jgILpu5jorqTlrp7njrBoYW1tZXLnmoTlpKfpg6jliIbkuovku7bns7vnu59cbiAgICAgICAgICAgIGlmKCAhbWUudHlwZXMgfHwgbWUudHlwZXMubGVuZ3RoID09IDAgICl7XG4gICAgICAgICAgICAgICAgbWUudHlwZXMgPSBfaGFtbWVyRXZlbnRUeXBlcztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiggbWUudGFyZ2V0Lm5vZGVUeXBlID09IDEgKXtcbiAgICAgICAgICAgIG1lLnR5cGVzID0gX21vdXNlRXZlbnRUeXBlcztcbiAgICAgICAgfTtcblxuICAgICAgICBfLmVhY2goIG1lLnR5cGVzICwgZnVuY3Rpb24oIHR5cGUgKXtcbiAgICAgICAgICAgIC8v5LiN5YaN5YWz5b+D5rWP6KeI5Zmo546v5aKD5piv5ZCmICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyBcbiAgICAgICAgICAgIC8v6ICM5piv55u05o6l5Y+q566h5Lyg57uZ5LqL5Lu25qih5Z2X55qE5piv5LiA5Liq5Y6f55SfZG9t6L+Y5pivIGpx5a+56LGhIG9yIGhhbW1lcuWvueixoeetiVxuICAgICAgICAgICAgaWYoIG1lLnRhcmdldC5ub2RlVHlwZSA9PSAxICl7XG4gICAgICAgICAgICAgICAgJC5hZGRFdmVudCggbWUudGFyZ2V0ICwgdHlwZSAsIGZ1bmN0aW9uKCBlICl7XG4gICAgICAgICAgICAgICAgICAgIG1lLl9fbW91c2VIYW5kbGVyKCBlICk7XG4gICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZS50YXJnZXQub24oIHR5cGUgLCBmdW5jdGlvbiggZSApe1xuICAgICAgICAgICAgICAgICAgICBtZS5fX2xpYkhhbmRsZXIoIGUgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gKTtcbiAgICB9LFxuICAgIC8qXG4gICAgKiDljp/nlJ/kuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICog6byg5qCH5LqL5Lu25aSE55CG5Ye95pWwXG4gICAgKiovXG4gICAgX19tb3VzZUhhbmRsZXIgOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuXG4gICAgICAgIHJvb3QudXBkYXRlVmlld09mZnNldCgpO1xuICAgIFxuICAgICAgICBtZS5jdXJQb2ludHMgPSBbIG5ldyBQb2ludCggXG4gICAgICAgICAgICAkLnBhZ2VYKCBlICkgLSByb290LnZpZXdPZmZzZXQubGVmdCAsIFxuICAgICAgICAgICAgJC5wYWdlWSggZSApIC0gcm9vdC52aWV3T2Zmc2V0LnRvcFxuICAgICAgICApXTtcblxuICAgICAgICAvL+eQhuiuuuS4iuadpeivtO+8jOi/memHjOaLv+WIsHBvaW505LqG5ZCO77yM5bCx6KaB6K6h566X6L+Z5LiqcG9pbnTlr7nlupTnmoR0YXJnZXTmnaVwdXNo5YiwY3VyUG9pbnRzVGFyZ2V06YeM77yMXG4gICAgICAgIC8v5L2G5piv5Zug5Li65ZyoZHJhZ+eahOaXtuWAmeWFtuWunuaYr+WPr+S7peS4jeeUqOiuoeeul+WvueW6lHRhcmdldOeahOOAglxuICAgICAgICAvL+aJgOS7peaUvuWcqOS6huS4i+mdoueahG1lLl9fZ2V0Y3VyUG9pbnRzVGFyZ2V0KCBlICwgY3VyTW91c2VQb2ludCApO+W4uOinhG1vdXNlbW92ZeS4reaJp+ihjFxuXG4gICAgICAgIHZhciBjdXJNb3VzZVBvaW50ICA9IG1lLmN1clBvaW50c1swXTsgXG4gICAgICAgIHZhciBjdXJNb3VzZVRhcmdldCA9IG1lLmN1clBvaW50c1RhcmdldFswXTtcblxuICAgICAgICAvL+aooeaLn2RyYWcsbW91c2VvdmVyLG1vdXNlb3V0IOmDqOWIhuS7o+eggSBiZWdpbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvL21vdXNlZG93bueahOaXtuWAmSDlpoLmnpwgY3VyTW91c2VUYXJnZXQuZHJhZ0VuYWJsZWQg5Li6dHJ1ZeOAguWwseimgeW8gOWni+WHhuWkh2RyYWfkuoZcbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNlZG93blwiICl7XG4gICAgICAgICAgIC8v5aaC5p6cY3VyVGFyZ2V0IOeahOaVsOe7hOS4uuepuuaIluiAheesrOS4gOS4quS4umZhbHNlIO+8jO+8jO+8jFxuICAgICAgICAgICBpZiggIWN1ck1vdXNlVGFyZ2V0ICl7XG4gICAgICAgICAgICAgdmFyIG9iaiA9IHJvb3QuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIGN1ck1vdXNlUG9pbnQgLCAxKVswXTtcbiAgICAgICAgICAgICBpZihvYmope1xuICAgICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0ID0gWyBvYmogXTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIH07XG4gICAgICAgICAgIGN1ck1vdXNlVGFyZ2V0ID0gbWUuY3VyUG9pbnRzVGFyZ2V0WzBdO1xuICAgICAgICAgICBpZiAoIGN1ck1vdXNlVGFyZ2V0ICYmIGN1ck1vdXNlVGFyZ2V0LmRyYWdFbmFibGVkICl7XG4gICAgICAgICAgICAgICAvL+m8oOagh+S6i+S7tuW3sue7j+aRuOWIsOS6huS4gOS4qlxuICAgICAgICAgICAgICAgbWUuX3RvdWNoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2V1cFwiIHx8IChlLnR5cGUgPT0gXCJtb3VzZW91dFwiICYmICFjb250YWlucyhyb290LnZpZXcgLCAoZS50b0VsZW1lbnQgfHwgZS5yZWxhdGVkVGFyZ2V0KSApKSApe1xuICAgICAgICAgICAgaWYobWUuX2RyYWdpbmcgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgLy/or7TmmI7liJrliJrlnKjmi5bliqhcbiAgICAgICAgICAgICAgICBtZS5fZHJhZ0VuZCggZSAsIGN1ck1vdXNlVGFyZ2V0ICwgMCApO1xuICAgICAgICAgICAgICAgIGN1ck1vdXNlVGFyZ2V0LmZpcmUoXCJkcmFnZW5kXCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lLl9kcmFnaW5nICA9IGZhbHNlO1xuICAgICAgICAgICAgbWUuX3RvdWNoaW5nID0gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNlb3V0XCIgKXtcbiAgICAgICAgICAgIGlmKCAhY29udGFpbnMocm9vdC52aWV3ICwgKGUudG9FbGVtZW50IHx8IGUucmVsYXRlZFRhcmdldCkgKSApe1xuICAgICAgICAgICAgICAgIG1lLl9fZ2V0Y3VyUG9pbnRzVGFyZ2V0KGUgLCBjdXJNb3VzZVBvaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCBlLnR5cGUgPT0gXCJtb3VzZW1vdmVcIiApeyAgLy98fCBlLnR5cGUgPT0gXCJtb3VzZWRvd25cIiApe1xuICAgICAgICAgICAgLy/mi5bliqjov4fnqIvkuK3lsLHkuI3lnKjlgZrlhbbku5bnmoRtb3VzZW92ZXLmo4DmtYvvvIxkcmFn5LyY5YWIXG4gICAgICAgICAgICBpZihtZS5fdG91Y2hpbmcgJiYgZS50eXBlID09IFwibW91c2Vtb3ZlXCIgJiYgY3VyTW91c2VUYXJnZXQpe1xuICAgICAgICAgICAgICAgIC8v6K+05piO5q2j5Zyo5ouW5Yqo5ZWKXG4gICAgICAgICAgICAgICAgaWYoIW1lLl9kcmFnaW5nKXtcbiAgICAgICAgICAgICAgICAgICAgLy9iZWdpbiBkcmFnXG4gICAgICAgICAgICAgICAgICAgIGN1ck1vdXNlVGFyZ2V0LmZpcmUoXCJkcmFnc3RhcnRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8v5YWI5oqK5pys5bCK57uZ6ZqQ6JeP5LqGXG4gICAgICAgICAgICAgICAgICAgIGN1ck1vdXNlVGFyZ2V0LmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwO1xuICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjuWFi+mahuS4gOS4quWJr+acrOWIsGFjdGl2ZVN0YWdlXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmVPYmplY3QgPSBtZS5fY2xvbmUyaG92ZXJTdGFnZSggY3VyTW91c2VUYXJnZXQgLCAwICk7XG4gICAgICAgICAgICAgICAgICAgIGNsb25lT2JqZWN0LmNvbnRleHQuZ2xvYmFsQWxwaGEgPSBjdXJNb3VzZVRhcmdldC5fZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9kcmFnIG1vdmUgaW5nXG4gICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnTW92ZUhhbmRlciggZSAsIGN1ck1vdXNlVGFyZ2V0ICwgMCApO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbWUuX2RyYWdpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+W4uOinhG1vdXNlbW92ZeajgOa1i1xuICAgICAgICAgICAgICAgIC8vbW92ZeS6i+S7tuS4re+8jOmcgOimgeS4jeWBnOeahOaQnOe0onRhcmdldO+8jOi/meS4quW8gOmUgOaMuuWkp++8jFxuICAgICAgICAgICAgICAgIC8v5ZCO57ut5Y+v5Lul5LyY5YyW77yM5Yqg5LiK5ZKM5bin546H55u45b2T55qE5bu26L+f5aSE55CGXG4gICAgICAgICAgICAgICAgbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoIGUgLCBjdXJNb3VzZVBvaW50ICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5YW25LuW55qE5LqL5Lu25bCx55u05o6l5ZyodGFyZ2V05LiK6Z2i5rS+5Y+R5LqL5Lu2XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjdXJNb3VzZVRhcmdldDtcbiAgICAgICAgICAgIGlmKCAhY2hpbGQgKXtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IHJvb3Q7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMoIGUgLCBbIGNoaWxkIF0gKTtcbiAgICAgICAgICAgIG1lLl9jdXJzb3JIYW5kZXIoIGNoaWxkICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIHJvb3QucHJldmVudERlZmF1bHQgKSB7XG4gICAgICAgICAgICAvL+mYu+atoum7mOiupOa1j+iniOWZqOWKqOS9nChXM0MpIFxuICAgICAgICAgICAgaWYgKCBlICYmIGUucHJldmVudERlZmF1bHQgKSB7XG4gICAgICAgICAgICAgICDCoGUucHJldmVudERlZmF1bHQoKTsgXG4gICAgICAgICAgICB9wqBlbHNlIHtcbiAgICAgICAgICAgIMKgwqDCoMKgd2luZG93LmV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07IFxuICAgIH0sXG4gICAgX19nZXRjdXJQb2ludHNUYXJnZXQgOiBmdW5jdGlvbihlICwgcG9pbnQgKSB7XG4gICAgICAgIHZhciBtZSAgICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCAgID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgb2xkT2JqID0gbWUuY3VyUG9pbnRzVGFyZ2V0WzBdO1xuXG4gICAgICAgIGlmKCBvbGRPYmogJiYgIW9sZE9iai5jb250ZXh0ICl7XG4gICAgICAgICAgICBvbGRPYmogPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBlID0gbmV3IENhbnZheEV2ZW50KCBlICk7XG5cbiAgICAgICAgaWYoIGUudHlwZT09XCJtb3VzZW1vdmVcIlxuICAgICAgICAgICAgJiYgb2xkT2JqICYmIG9sZE9iai5faG92ZXJDbGFzcyAmJiBvbGRPYmoucG9pbnRDaGtQcmlvcml0eVxuICAgICAgICAgICAgJiYgb2xkT2JqLmdldENoaWxkSW5Qb2ludCggcG9pbnQgKSApe1xuICAgICAgICAgICAgLy/lsI/kvJjljJYs6byg5qCHbW92ZeeahOaXtuWAmeOAguiuoeeul+mikeeOh+WkquWkp++8jOaJgOS7peOAguWBmuatpOS8mOWMllxuICAgICAgICAgICAgLy/lpoLmnpzmnIl0YXJnZXTlrZjlnKjvvIzogIzkuJTlvZPliY3lhYPntKDmraPlnKhob3ZlclN0YWdl5Lit77yM6ICM5LiU5b2T5YmN6byg5qCH6L+Y5ZyodGFyZ2V05YaFLOWwseayoeW/heimgeWPluajgOa1i+aVtOS4qmRpc3BsYXlMaXN05LqGXG4gICAgICAgICAgICAvL+W8gOWPkea0vuWPkeW4uOinhG1vdXNlbW92ZeS6i+S7tlxuICAgICAgICAgICAgZS50YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICBlLnBvaW50ICA9IG9sZE9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgb2xkT2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9iaiA9IHJvb3QuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIHBvaW50ICwgMSlbMF07XG5cbiAgICAgICAgaWYob2xkT2JqICYmIG9sZE9iaiAhPSBvYmogfHwgZS50eXBlPT1cIm1vdXNlb3V0XCIpIHtcbiAgICAgICAgICAgIGlmKCBvbGRPYmogJiYgb2xkT2JqLmNvbnRleHQgKXtcbiAgICAgICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXRbMF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGUudHlwZSAgICAgPSBcIm1vdXNlb3V0XCI7XG4gICAgICAgICAgICAgICAgZS50b1RhcmdldCA9IG9iajsgXG4gICAgICAgICAgICAgICAgZS50YXJnZXQgICA9IGUuY3VycmVudFRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgICAgICBlLnBvaW50ICAgID0gb2xkT2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICAgICAgb2xkT2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiggb2JqICYmIG9sZE9iaiAhPSBvYmogKXsgLy8mJiBvYmouX2hvdmVyYWJsZSDlt7Lnu48g5bmy5o6J5LqGXG4gICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXRbMF0gPSBvYmo7XG4gICAgICAgICAgICBlLnR5cGUgICAgICAgPSBcIm1vdXNlb3ZlclwiO1xuICAgICAgICAgICAgZS5mcm9tVGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgZS50YXJnZXQgICAgID0gZS5jdXJyZW50VGFyZ2V0ID0gb2JqO1xuICAgICAgICAgICAgZS5wb2ludCAgICAgID0gb2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICBvYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZW1vdmVcIiAmJiBvYmogKXtcbiAgICAgICAgICAgIGUudGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgZS5wb2ludCAgPSBvbGRPYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgIG9sZE9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgIH07XG4gICAgICAgIG1lLl9jdXJzb3JIYW5kZXIoIG9iaiAsIG9sZE9iaiApO1xuICAgIH0sXG4gICAgX2N1cnNvckhhbmRlciAgICA6IGZ1bmN0aW9uKCBvYmogLCBvbGRPYmogKXtcbiAgICAgICAgaWYoIW9iaiAmJiAhb2xkT2JqICl7XG4gICAgICAgICAgICB0aGlzLl9zZXRDdXJzb3IoXCJkZWZhdWx0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9iaiAmJiBvbGRPYmogIT0gb2JqICYmIG9iai5jb250ZXh0KXtcbiAgICAgICAgICAgIHRoaXMuX3NldEN1cnNvcihvYmouY29udGV4dC5jdXJzb3IpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBfc2V0Q3Vyc29yIDogZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvciA9PSBjdXJzb3Ipe1xuICAgICAgICAgIC8v5aaC5p6c5Lik5qyh6KaB6K6+572u55qE6byg5qCH54q25oCB5piv5LiA5qC355qEXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNhbnZheC52aWV3LnN0eWxlLmN1cnNvciA9IGN1cnNvcjtcbiAgICAgICAgdGhpcy5fY3Vyc29yID0gY3Vyc29yO1xuICAgIH0sXG4gICAgLypcbiAgICAqIOWOn+eUn+S6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWVuZFxuICAgICovXG5cbiAgICAvKlxuICAgICAq56ys5LiJ5pa55bqT55qE5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYmVnaW5cbiAgICAgKuinpuWxj+S6i+S7tuWkhOeQhuWHveaVsFxuICAgICAqICovXG4gICAgX19saWJIYW5kbGVyIDogZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIHZhciBtZSAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHJvb3QudXBkYXRlVmlld09mZnNldCgpO1xuICAgICAgICAvLyB0b3VjaCDkuIvnmoQgY3VyUG9pbnRzVGFyZ2V0IOS7jnRvdWNoZXPkuK3mnaVcbiAgICAgICAgLy/ojrflj5ZjYW52YXjlnZDmoIfns7vnu5/ph4zpnaLnmoTlnZDmoIdcbiAgICAgICAgbWUuY3VyUG9pbnRzID0gbWUuX19nZXRDYW52YXhQb2ludEluVG91Y2hzKCBlICk7XG4gICAgICAgIGlmKCAhbWUuX2RyYWdpbmcgKXtcbiAgICAgICAgICAgIC8v5aaC5p6c5ZyoZHJhZ2luZ+eahOivne+8jHRhcmdldOW3sue7j+aYr+mAieS4reS6hueahO+8jOWPr+S7peS4jeeUqCDmo4DmtYvkuoZcbiAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldCA9IG1lLl9fZ2V0Q2hpbGRJblRvdWNocyggbWUuY3VyUG9pbnRzICk7XG4gICAgICAgIH07XG4gICAgICAgIGlmKCBtZS5jdXJQb2ludHNUYXJnZXQubGVuZ3RoID4gMCApe1xuICAgICAgICAgICAgLy9kcmFn5byA5aeLXG4gICAgICAgICAgICBpZiggZS50eXBlID09IG1lLmRyYWcuc3RhcnQpe1xuICAgICAgICAgICAgICAgIC8vZHJhZ3N0YXJ055qE5pe25YCZdG91Y2jlt7Lnu4/lh4blpIflpb3kuoZ0YXJnZXTvvIwgY3VyUG9pbnRzVGFyZ2V0IOmHjOmdouWPquimgeacieS4gOS4quaYr+acieaViOeahFxuICAgICAgICAgICAgICAgIC8v5bCx6K6k5Li6ZHJhZ3PlvIDlp4tcbiAgICAgICAgICAgICAgICBfLmVhY2goIG1lLmN1clBvaW50c1RhcmdldCAsIGZ1bmN0aW9uKCBjaGlsZCAsIGkgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkICYmIGNoaWxkLmRyYWdFbmFibGVkICl7XG4gICAgICAgICAgICAgICAgICAgICAgIC8v5Y+q6KaB5pyJ5LiA5Liq5YWD57Sg5bCx6K6k5Li65q2j5Zyo5YeG5aSHZHJhZ+S6hlxuICAgICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgIC8v54S25ZCO5YWL6ZqG5LiA5Liq5Ymv5pys5YiwYWN0aXZlU3RhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgbWUuX2Nsb25lMmhvdmVyU3RhZ2UoIGNoaWxkICwgaSApO1xuICAgICAgICAgICAgICAgICAgICAgICAvL+WFiOaKiuacrOWwiue7memakOiXj+S6hlxuICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5jb250ZXh0Lmdsb2JhbEFscGhhID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5maXJlKFwiZHJhZ3N0YXJ0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKSBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vZHJhZ0luZ1xuICAgICAgICAgICAgaWYoIGUudHlwZSA9PSBtZS5kcmFnLm1vdmUpe1xuICAgICAgICAgICAgICAgIGlmKCBtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goIG1lLmN1clBvaW50c1RhcmdldCAsIGZ1bmN0aW9uKCBjaGlsZCAsIGkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZCAmJiBjaGlsZC5kcmFnRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdNb3ZlSGFuZGVyKCBlICwgY2hpbGQgLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9kcmFn57uT5p2fXG4gICAgICAgICAgICBpZiggZS50eXBlID09IG1lLmRyYWcuZW5kKXtcbiAgICAgICAgICAgICAgICBpZiggbWUuX2RyYWdpbmcgKXtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKCBtZS5jdXJQb2ludHNUYXJnZXQgLCBmdW5jdGlvbiggY2hpbGQgLCBpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQgJiYgY2hpbGQuZHJhZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ0VuZCggZSAsIGNoaWxkICwgMCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmZpcmUoXCJkcmFnZW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG1lLl9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzKCBlICwgbWUuY3VyUG9pbnRzVGFyZ2V0ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WmguaenOW9k+WJjeayoeacieS4gOS4qnRhcmdldO+8jOWwseaKiuS6i+S7tua0vuWPkeWIsGNhbnZheOS4iumdolxuICAgICAgICAgICAgbWUuX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMoIGUgLCBbIHJvb3QgXSApO1xuICAgICAgICB9O1xuICAgIH0sXG4gICAgLy/ku450b3VjaHPkuK3ojrflj5bliLDlr7nlupR0b3VjaCAsIOWcqOS4iumdoua3u+WKoOS4imNhbnZheOWdkOagh+ezu+e7n+eahHjvvIx5XG4gICAgX19nZXRDYW52YXhQb2ludEluVG91Y2hzIDogZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgdmFyIG1lICAgICAgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ICAgICAgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBjdXJUb3VjaHMgPSBbXTtcbiAgICAgICAgXy5lYWNoKCBlLnBvaW50ICwgZnVuY3Rpb24oIHRvdWNoICl7XG4gICAgICAgICAgIGN1clRvdWNocy5wdXNoKCB7XG4gICAgICAgICAgICAgICB4IDogQ2FudmF4RXZlbnQucGFnZVgoIHRvdWNoICkgLSByb290LnZpZXdPZmZzZXQubGVmdCxcbiAgICAgICAgICAgICAgIHkgOiBDYW52YXhFdmVudC5wYWdlWSggdG91Y2ggKSAtIHJvb3Qudmlld09mZnNldC50b3BcbiAgICAgICAgICAgfSApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGN1clRvdWNocztcbiAgICB9LFxuICAgIF9fZ2V0Q2hpbGRJblRvdWNocyA6IGZ1bmN0aW9uKCB0b3VjaHMgKXtcbiAgICAgICAgdmFyIG1lICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIHRvdWNoZXNUYXJnZXQgPSBbXTtcbiAgICAgICAgXy5lYWNoKCB0b3VjaHMgLCBmdW5jdGlvbih0b3VjaCl7XG4gICAgICAgICAgICB0b3VjaGVzVGFyZ2V0LnB1c2goIHJvb3QuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIHRvdWNoICwgMSlbMF0gKTtcbiAgICAgICAgfSApO1xuICAgICAgICByZXR1cm4gdG91Y2hlc1RhcmdldDtcbiAgICB9LFxuICAgIC8qXG4gICAgKuesrOS4ieaWueW6k+eahOS6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWJlZ2luXG4gICAgKi9cblxuXG4gICAgLypcbiAgICAgKkBwYXJhbSB7YXJyYXl9IGNoaWxkcyBcbiAgICAgKiAqL1xuICAgIF9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzOiBmdW5jdGlvbihlLCBjaGlsZHMpIHtcbiAgICAgICAgaWYgKCFjaGlsZHMgJiYgIShcImxlbmd0aFwiIGluIGNoaWxkcykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgaGFzQ2hpbGQgPSBmYWxzZTtcbiAgICAgICAgXy5lYWNoKGNoaWxkcywgZnVuY3Rpb24oY2hpbGQsIGkpIHtcbiAgICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIGhhc0NoaWxkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgY2UgPSBuZXcgQ2FudmF4RXZlbnQoZSk7XG4gICAgICAgICAgICAgICAgY2UudGFyZ2V0ID0gY2UuY3VycmVudFRhcmdldCA9IGNoaWxkIHx8IHRoaXM7XG4gICAgICAgICAgICAgICAgY2Uuc3RhZ2VQb2ludCA9IG1lLmN1clBvaW50c1tpXTtcbiAgICAgICAgICAgICAgICBjZS5wb2ludCA9IGNlLnRhcmdldC5nbG9iYWxUb0xvY2FsKGNlLnN0YWdlUG9pbnQpO1xuICAgICAgICAgICAgICAgIGNoaWxkLmRpc3BhdGNoRXZlbnQoY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGhhc0NoaWxkO1xuICAgIH0sXG4gICAgLy/lhYvpmobkuIDkuKrlhYPntKDliLBob3ZlciBzdGFnZeS4reWOu1xuICAgIF9jbG9uZTJob3ZlclN0YWdlOiBmdW5jdGlvbih0YXJnZXQsIGkpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBfZHJhZ0R1cGxpY2F0ZSA9IHJvb3QuX2J1ZmZlclN0YWdlLmdldENoaWxkQnlJZCh0YXJnZXQuaWQpO1xuICAgICAgICBpZiAoIV9kcmFnRHVwbGljYXRlKSB7XG4gICAgICAgICAgICBfZHJhZ0R1cGxpY2F0ZSA9IHRhcmdldC5jbG9uZSh0cnVlKTtcbiAgICAgICAgICAgIF9kcmFnRHVwbGljYXRlLl90cmFuc2Zvcm0gPSB0YXJnZXQuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpUT0RPOiDlm6DkuLrlkI7nu63lj6/og73kvJrmnInmiYvliqjmt7vliqDnmoQg5YWD57Sg5YiwX2J1ZmZlclN0YWdlIOmHjOmdouadpVxuICAgICAgICAgICAgICrmr5TlpoJ0aXBzXG4gICAgICAgICAgICAgKui/meexu+aJi+WKqOa3u+WKoOi/m+adpeeahOiCr+WumuaYr+WboOS4uumcgOimgeaYvuekuuWcqOacgOWkluWxgueahOOAguWcqGhvdmVy5YWD57Sg5LmL5LiK44CCXG4gICAgICAgICAgICAgKuaJgOacieiHquWKqOa3u+WKoOeahGhvdmVy5YWD57Sg6YO96buY6K6k5re75Yqg5ZyoX2J1ZmZlclN0YWdl55qE5pyA5bqV5bGCXG4gICAgICAgICAgICAgKiovXG4gICAgICAgICAgICByb290Ll9idWZmZXJTdGFnZS5hZGRDaGlsZEF0KF9kcmFnRHVwbGljYXRlLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGFyZ2V0Ll9nbG9iYWxBbHBoYTtcbiAgICAgICAgdGFyZ2V0Ll9kcmFnUG9pbnQgPSB0YXJnZXQuZ2xvYmFsVG9Mb2NhbChtZS5jdXJQb2ludHNbaV0pO1xuICAgICAgICByZXR1cm4gX2RyYWdEdXBsaWNhdGU7XG4gICAgfSxcbiAgICAvL2RyYWcg5LitIOeahOWkhOeQhuWHveaVsFxuICAgIF9kcmFnTW92ZUhhbmRlcjogZnVuY3Rpb24oZSwgdGFyZ2V0LCBpKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgX3BvaW50ID0gdGFyZ2V0Lmdsb2JhbFRvTG9jYWwoIG1lLmN1clBvaW50c1tpXSApO1xuXG4gICAgICAgIC8v6KaB5a+55bqU55qE5L+u5pS55pys5bCK55qE5L2N572u77yM5L2G5piv6KaB5ZGK6K+J5byV5pOO5LiN6KaBd2F0Y2jov5nkuKrml7blgJnnmoTlj5jljJZcbiAgICAgICAgdGFyZ2V0Ll9ub3RXYXRjaCA9IHRydWU7XG4gICAgICAgIHZhciBfbW92ZVN0YWdlID0gdGFyZ2V0Lm1vdmVpbmc7XG4gICAgICAgIHRhcmdldC5tb3ZlaW5nID0gdHJ1ZTtcbiAgICAgICAgdGFyZ2V0LmNvbnRleHQueCArPSAoX3BvaW50LnggLSB0YXJnZXQuX2RyYWdQb2ludC54KTtcbiAgICAgICAgdGFyZ2V0LmNvbnRleHQueSArPSAoX3BvaW50LnkgLSB0YXJnZXQuX2RyYWdQb2ludC55KTtcbiAgICAgICAgdGFyZ2V0LmZpcmUoXCJkcmFnbW92ZVwiKTtcbiAgICAgICAgdGFyZ2V0Lm1vdmVpbmcgPSBfbW92ZVN0YWdlO1xuICAgICAgICB0YXJnZXQuX25vdFdhdGNoID0gZmFsc2U7XG4gICAgICAgIC8v5ZCM5q2l5a6M5q+V5pys5bCK55qE5L2N572uXG5cbiAgICAgICAgLy/ov5nph4zlj6rog73nm7TmjqXkv67mlLlfdHJhbnNmb3JtIOOAgiDkuI3og73nlKjkuIvpnaLnmoTkv67mlLl477yMeeeahOaWueW8j+OAglxuICAgICAgICB2YXIgX2RyYWdEdXBsaWNhdGUgPSByb290Ll9idWZmZXJTdGFnZS5nZXRDaGlsZEJ5SWQodGFyZ2V0LmlkKTtcbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuX3RyYW5zZm9ybSA9IHRhcmdldC5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoKTtcbiAgICAgICAgLy/ku6XkuLrnm7TmjqXkv67mlLnnmoRfdHJhbnNmb3Jt5LiN5Lya5Ye65Y+R5b+D6Lez5LiK5oql77yMIOa4suafk+W8leaTjuS4jeWItuWKqOi/meS4qnN0YWdl6ZyA6KaB57uY5Yi244CCXG4gICAgICAgIC8v5omA5Lul6KaB5omL5Yqo5Ye65Y+R5b+D6Lez5YyFXG4gICAgICAgIF9kcmFnRHVwbGljYXRlLmhlYXJ0QmVhdCgpO1xuICAgIH0sXG4gICAgLy9kcmFn57uT5p2f55qE5aSE55CG5Ye95pWwXG4gICAgX2RyYWdFbmQ6IGZ1bmN0aW9uKGUsIHRhcmdldCwgaSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcblxuICAgICAgICAvL19kcmFnRHVwbGljYXRlIOWkjeWItuWcqF9idWZmZXJTdGFnZSDkuK3nmoTlia/mnKxcbiAgICAgICAgdmFyIF9kcmFnRHVwbGljYXRlID0gcm9vdC5fYnVmZmVyU3RhZ2UuZ2V0Q2hpbGRCeUlkKHRhcmdldC5pZCk7XG4gICAgICAgIF9kcmFnRHVwbGljYXRlLmRlc3Ryb3koKTtcblxuICAgICAgICB0YXJnZXQuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRhcmdldC5fZ2xvYmFsQWxwaGE7XG4gICAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IEV2ZW50SGFuZGxlcjsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDkuovku7bnrqHnkIbnsbtcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiDmnoTpgKDlh73mlbAuXG4gKiBAbmFtZSBFdmVudERpc3BhdGNoZXJcbiAqIEBjbGFzcyBFdmVudERpc3BhdGNoZXLnsbvmmK/lj6/osIPluqbkuovku7bnmoTnsbvnmoTln7rnsbvvvIzlroPlhYHorrjmmL7npLrliJfooajkuIrnmoTku7vkvZXlr7nosaHpg73mmK/kuIDkuKrkuovku7bnm67moIfjgIJcbiAqL1xudmFyIEV2ZW50TWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICAgIC8v5LqL5Lu25pig5bCE6KGo77yM5qC85byP5Li677yae3R5cGUxOltsaXN0ZW5lcjEsIGxpc3RlbmVyMl0sIHR5cGUyOltsaXN0ZW5lcjMsIGxpc3RlbmVyNF19XG4gICAgdGhpcy5fZXZlbnRNYXAgPSB7fTtcbn07XG5cbkV2ZW50TWFuYWdlci5wcm90b3R5cGUgPSB7IFxuICAgIC8qXG4gICAgICog5rOo5YaM5LqL5Lu25L6m5ZCs5Zmo5a+56LGh77yM5Lul5L2/5L6m5ZCs5Zmo6IO95aSf5o6l5pS25LqL5Lu26YCa55+l44CCXG4gICAgICovXG4gICAgX2FkZEV2ZW50TGlzdGVuZXIgOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuXG4gICAgICAgIGlmKCB0eXBlb2YgbGlzdGVuZXIgIT0gXCJmdW5jdGlvblwiICl7XG4gICAgICAgICAgLy9saXN0ZW5lcuW/hemhu+aYr+S4qmZ1bmN0aW9u5ZGQ5LqyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhZGRSZXN1bHQgPSB0cnVlO1xuICAgICAgICB2YXIgc2VsZiAgICAgID0gdGhpcztcbiAgICAgICAgXy5lYWNoKCB0eXBlLnNwbGl0KFwiIFwiKSAsIGZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICAgICAgdmFyIG1hcCA9IHNlbGYuX2V2ZW50TWFwW3R5cGVdO1xuICAgICAgICAgICAgaWYoIW1hcCl7XG4gICAgICAgICAgICAgICAgbWFwID0gc2VsZi5fZXZlbnRNYXBbdHlwZV0gPSBbXTtcbiAgICAgICAgICAgICAgICBtYXAucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoXy5pbmRleE9mKG1hcCAsbGlzdGVuZXIpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgbWFwLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHNlbGYuX2V2ZW50RW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFkZFJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFkZFJlc3VsdDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIoOmZpOS6i+S7tuS+puWQrOWZqOOAglxuICAgICAqL1xuICAgIF9yZW1vdmVFdmVudExpc3RlbmVyIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSByZXR1cm4gdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlKHR5cGUpO1xuXG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcbiAgICAgICAgaWYoIW1hcCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGkgPSBtYXBbaV07XG4gICAgICAgICAgICBpZihsaSA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBtYXAuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmKG1hcC5sZW5ndGggICAgPT0gMCkgeyBcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOi/meS4quWmguaenOi/meS4quaXtuWAmWNoaWxk5rKh5pyJ5Lu75L2V5LqL5Lu25L6m5ZCsXG4gICAgICAgICAgICAgICAgICAgIGlmKF8uaXNFbXB0eSh0aGlzLl9ldmVudE1hcCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/pgqPkuYjor6XlhYPntKDkuI3lho3mjqXlj5fkuovku7bnmoTmo4DmtYtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDliKDpmaTmjIflrprnsbvlnovnmoTmiYDmnInkuovku7bkvqblkKzlmajjgIJcbiAgICAgKi9cbiAgICBfcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSA6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuICAgICAgICBpZighbWFwKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRNYXBbdHlwZV07XG5cbiAgICAgICAgICAgIC8v5aaC5p6c6L+Z5Liq5aaC5p6c6L+Z5Liq5pe25YCZY2hpbGTmsqHmnInku7vkvZXkuovku7bkvqblkKxcbiAgICAgICAgICAgIGlmKF8uaXNFbXB0eSh0aGlzLl9ldmVudE1hcCkpe1xuICAgICAgICAgICAgICAgIC8v6YKj5LmI6K+l5YWD57Sg5LiN5YaN5o6l5Y+X5LqL5Lu255qE5qOA5rWLXG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIoOmZpOaJgOacieS6i+S7tuS+puWQrOWZqOOAglxuICAgICAqL1xuICAgIF9yZW1vdmVBbGxFdmVudExpc3RlbmVycyA6IGZ1bmN0aW9uKCkge1x0XG4gICAgICAgIHRoaXMuX2V2ZW50TWFwID0ge307XG4gICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgKiDmtL7lj5Hkuovku7bvvIzosIPnlKjkuovku7bkvqblkKzlmajjgIJcbiAgICAqL1xuICAgIF9kaXNwYXRjaEV2ZW50IDogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbZS50eXBlXTtcbiAgICAgICAgXG4gICAgICAgIGlmKCBtYXAgKXtcbiAgICAgICAgICAgIGlmKCFlLnRhcmdldCkgZS50YXJnZXQgPSB0aGlzO1xuICAgICAgICAgICAgbWFwID0gbWFwLnNsaWNlKCk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBtYXBbaV07XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mKGxpc3RlbmVyKSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiggIWUuX3N0b3BQcm9wYWdhdGlvbiApIHtcbiAgICAgICAgICAgIC8v5ZCR5LiK5YaS5rOhXG4gICAgICAgICAgICBpZiggdGhpcy5wYXJlbnQgKXtcbiAgICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQgPSB0aGlzLnBhcmVudDtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5fZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAgICog5qOA5p+l5piv5ZCm5Li65oyH5a6a5LqL5Lu257G75Z6L5rOo5YaM5LqG5Lu75L2V5L6m5ZCs5Zmo44CCXG4gICAgICAgKi9cbiAgICBfaGFzRXZlbnRMaXN0ZW5lciA6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuICAgICAgICByZXR1cm4gbWFwICE9IG51bGwgJiYgbWFwLmxlbmd0aCA+IDA7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFdmVudE1hbmFnZXI7XG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDkuovku7bmtL7lj5HnsbtcbiAqL1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi9FdmVudE1hbmFnZXJcIjtcbmltcG9ydCBDYW52YXhFdmVudCBmcm9tIFwiLi9DYW52YXhFdmVudFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuXG52YXIgRXZlbnREaXNwYXRjaGVyID0gZnVuY3Rpb24oKXtcbiAgICBFdmVudERpc3BhdGNoZXIuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG5hbWUpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhFdmVudERpc3BhdGNoZXIgLCBFdmVudE1hbmFnZXIgLCB7XG4gICAgb24gOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhZGRFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHVuIDogZnVuY3Rpb24odHlwZSxsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOmZ1bmN0aW9uKHR5cGUsbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZTpmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSggdHlwZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnM6ZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vcGFyYW1zIOimgeS8oOe7mWV2dOeahGV2ZW50aGFuZGxlcuWkhOeQhuWHveaVsOeahOWPguaVsO+8jOS8muiiq21lcmdl5YiwQ2FudmF4IGV2ZW505LitXG4gICAgZmlyZSA6IGZ1bmN0aW9uKGV2ZW50VHlwZSAsIHBhcmFtcyl7XG4gICAgICAgIHZhciBlID0gbmV3IENhbnZheEV2ZW50KCBldmVudFR5cGUgKTtcblxuICAgICAgICBpZiggcGFyYW1zICl7XG4gICAgICAgICAgICBmb3IoIHZhciBwIGluIHBhcmFtcyApe1xuICAgICAgICAgICAgICAgIGlmKCBwIGluIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgLy9wYXJhbXPkuK3nmoTmlbDmja7kuI3og73opobnm5ZldmVudOWxnuaAp1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcCArIFwi5bGe5oCn5LiN6IO96KaG55uWQ2FudmF4RXZlbnTlsZ7mgKdcIiApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZVtwXSA9IHBhcmFtc1twXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgXy5lYWNoKCBldmVudFR5cGUuc3BsaXQoXCIgXCIpICwgZnVuY3Rpb24oZVR5cGUpe1xuICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0ID0gbWU7XG4gICAgICAgICAgICBtZS5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBkaXNwYXRjaEV2ZW50OmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgLy90aGlzIGluc3RhbmNlb2YgRGlzcGxheU9iamVjdENvbnRhaW5lciA9PT4gdGhpcy5jaGlsZHJlblxuICAgICAgICAvL1RPRE86IOi/memHjGltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIOeahOivne+8jOWcqGRpc3BsYXlPYmplY3Tph4zpnaLnmoRpbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbiAgICAgICAgLy/kvJrlvpfliLDkuIDkuKp1bmRlZmluZWTvvIzmhJ/op4nmmK/miJDkuobkuIDkuKrlvqrnjq/kvp3otZbnmoTpl67popjvvIzmiYDku6Xov5nph4zmjaLnlKjnroDljZXnmoTliKTmlq3mnaXliKTmlq3oh6rlt7HmmK/kuIDkuKrlrrnmmJPvvIzmi6XmnIljaGlsZHJlblxuICAgICAgICBpZiggdGhpcy5jaGlsZHJlbiAgJiYgZXZlbnQucG9pbnQgKXtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLmdldE9iamVjdHNVbmRlclBvaW50KCBldmVudC5wb2ludCAsIDEpWzBdO1xuICAgICAgICAgICAgaWYoIHRhcmdldCApe1xuICAgICAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5jb250ZXh0ICYmIGV2ZW50LnR5cGUgPT0gXCJtb3VzZW92ZXJcIil7XG4gICAgICAgICAgICAvL+iusOW9lWRpc3BhdGNoRXZlbnTkuYvliY3nmoTlv4Pot7NcbiAgICAgICAgICAgIHZhciBwcmVIZWFydEJlYXQgPSB0aGlzLl9oZWFydEJlYXROdW07XG4gICAgICAgICAgICB2YXIgcHJlZ0FscGhhICAgID0gdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcbiAgICAgICAgICAgIGlmKCBwcmVIZWFydEJlYXQgIT0gdGhpcy5faGVhcnRCZWF0TnVtICl7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJDbGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuaG92ZXJDbG9uZSApe1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudmF4ID0gdGhpcy5nZXRTdGFnZSgpLnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgLy/nhLblkI5jbG9uZeS4gOS7vW9iau+8jOa3u+WKoOWIsF9idWZmZXJTdGFnZSDkuK1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGl2U2hhcGUgPSB0aGlzLmNsb25lKHRydWUpOyAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBhY3RpdlNoYXBlLl90cmFuc2Zvcm0gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXguX2J1ZmZlclN0YWdlLmFkZENoaWxkQXQoIGFjdGl2U2hhcGUgLCAwICk7IFxuICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjuaKiuiHquW3semakOiXj+S6hlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nbG9iYWxBbHBoYSA9IHByZWdBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcblxuICAgICAgICBpZiggdGhpcy5jb250ZXh0ICYmIGV2ZW50LnR5cGUgPT0gXCJtb3VzZW91dFwiKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX2hvdmVyQ2xhc3Mpe1xuICAgICAgICAgICAgICAgIC8v6K+05piO5Yia5Yiab3ZlcueahOaXtuWAmeaciea3u+WKoOagt+W8j1xuICAgICAgICAgICAgICAgIHZhciBjYW52YXggPSB0aGlzLmdldFN0YWdlKCkucGFyZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2hvdmVyQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjYW52YXguX2J1ZmZlclN0YWdlLnJlbW92ZUNoaWxkQnlJZCh0aGlzLmlkKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5fZ2xvYmFsQWxwaGEgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5fZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhhc0V2ZW50OmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzRXZlbnRMaXN0ZW5lcih0eXBlKTtcbiAgICB9LFxuICAgIGhhc0V2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgIH0sXG4gICAgaG92ZXIgOiBmdW5jdGlvbiggb3ZlckZ1biAsIG91dEZ1biApe1xuICAgICAgICB0aGlzLm9uKFwibW91c2VvdmVyXCIgLCBvdmVyRnVuKTtcbiAgICAgICAgdGhpcy5vbihcIm1vdXNlb3V0XCIgICwgb3V0RnVuICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgb25jZSA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIG9uY2VIYW5kbGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkobWUgLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy51bih0eXBlICwgb25jZUhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub24odHlwZSAsIG9uY2VIYW5kbGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnREaXNwYXRjaGVyO1xuIiwiXG4vKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiBNYXRyaXgg55+p6Zi15bqTIOeUqOS6juaVtOS4quezu+e7n+eahOWHoOS9leWPmOaNouiuoeeul1xuICogY29kZSBmcm9tIGh0dHA6Ly9ldmFudy5naXRodWIuaW8vbGlnaHRnbC5qcy9kb2NzL21hdHJpeC5odG1sXG4gKi9cblxudmFyIE1hdHJpeCA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIHR4LCB0eSl7XG4gICAgdGhpcy5hID0gYSAhPSB1bmRlZmluZWQgPyBhIDogMTtcbiAgICB0aGlzLmIgPSBiICE9IHVuZGVmaW5lZCA/IGIgOiAwO1xuICAgIHRoaXMuYyA9IGMgIT0gdW5kZWZpbmVkID8gYyA6IDA7XG4gICAgdGhpcy5kID0gZCAhPSB1bmRlZmluZWQgPyBkIDogMTtcbiAgICB0aGlzLnR4ID0gdHggIT0gdW5kZWZpbmVkID8gdHggOiAwO1xuICAgIHRoaXMudHkgPSB0eSAhPSB1bmRlZmluZWQgPyB0eSA6IDA7XG59O1xuXG5NYXRyaXgucHJvdG90eXBlID0ge1xuICAgIGNvbmNhdCA6IGZ1bmN0aW9uKG10eCl7XG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICB2YXIgYyA9IHRoaXMuYztcbiAgICAgICAgdmFyIHR4ID0gdGhpcy50eDtcblxuICAgICAgICB0aGlzLmEgPSBhICogbXR4LmEgKyB0aGlzLmIgKiBtdHguYztcbiAgICAgICAgdGhpcy5iID0gYSAqIG10eC5iICsgdGhpcy5iICogbXR4LmQ7XG4gICAgICAgIHRoaXMuYyA9IGMgKiBtdHguYSArIHRoaXMuZCAqIG10eC5jO1xuICAgICAgICB0aGlzLmQgPSBjICogbXR4LmIgKyB0aGlzLmQgKiBtdHguZDtcbiAgICAgICAgdGhpcy50eCA9IHR4ICogbXR4LmEgKyB0aGlzLnR5ICogbXR4LmMgKyBtdHgudHg7XG4gICAgICAgIHRoaXMudHkgPSB0eCAqIG10eC5iICsgdGhpcy50eSAqIG10eC5kICsgbXR4LnR5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmNhdFRyYW5zZm9ybSA6IGZ1bmN0aW9uKHgsIHksIHNjYWxlWCwgc2NhbGVZLCByb3RhdGlvbil7XG4gICAgICAgIHZhciBjb3MgPSAxO1xuICAgICAgICB2YXIgc2luID0gMDtcbiAgICAgICAgaWYocm90YXRpb24lMzYwKXtcbiAgICAgICAgICAgIHZhciByID0gcm90YXRpb24gKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgICAgICAgY29zID0gTWF0aC5jb3Mocik7XG4gICAgICAgICAgICBzaW4gPSBNYXRoLnNpbihyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uY2F0KG5ldyBNYXRyaXgoY29zKnNjYWxlWCwgc2luKnNjYWxlWCwgLXNpbipzY2FsZVksIGNvcypzY2FsZVksIHgsIHkpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByb3RhdGUgOiBmdW5jdGlvbihhbmdsZSl7XG4gICAgICAgIC8v55uu5YmN5bey57uP5o+Q5L6b5a+56aG65pe26ZKI6YCG5pe26ZKI5Lik5Liq5pa55ZCR5peL6L2s55qE5pSv5oyBXG4gICAgICAgIHZhciBjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIHZhciBjID0gdGhpcy5jO1xuICAgICAgICB2YXIgdHggPSB0aGlzLnR4O1xuXG4gICAgICAgIGlmIChhbmdsZT4wKXtcbiAgICAgICAgICAgIHRoaXMuYSA9IGEgKiBjb3MgLSB0aGlzLmIgKiBzaW47XG4gICAgICAgICAgICB0aGlzLmIgPSBhICogc2luICsgdGhpcy5iICogY29zO1xuICAgICAgICAgICAgdGhpcy5jID0gYyAqIGNvcyAtIHRoaXMuZCAqIHNpbjtcbiAgICAgICAgICAgIHRoaXMuZCA9IGMgKiBzaW4gKyB0aGlzLmQgKiBjb3M7XG4gICAgICAgICAgICB0aGlzLnR4ID0gdHggKiBjb3MgLSB0aGlzLnR5ICogc2luO1xuICAgICAgICAgICAgdGhpcy50eSA9IHR4ICogc2luICsgdGhpcy50eSAqIGNvcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBzdCA9IE1hdGguc2luKE1hdGguYWJzKGFuZ2xlKSk7XG4gICAgICAgICAgICB2YXIgY3QgPSBNYXRoLmNvcyhNYXRoLmFicyhhbmdsZSkpO1xuXG4gICAgICAgICAgICB0aGlzLmEgPSBhKmN0ICsgdGhpcy5iKnN0O1xuICAgICAgICAgICAgdGhpcy5iID0gLWEqc3QgKyB0aGlzLmIqY3Q7XG4gICAgICAgICAgICB0aGlzLmMgPSBjKmN0ICsgdGhpcy5kKnN0O1xuICAgICAgICAgICAgdGhpcy5kID0gLWMqc3QgKyBjdCp0aGlzLmQ7XG4gICAgICAgICAgICB0aGlzLnR4ID0gY3QqdHggKyBzdCp0aGlzLnR5O1xuICAgICAgICAgICAgdGhpcy50eSA9IGN0KnRoaXMudHkgLSBzdCp0eDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNjYWxlIDogZnVuY3Rpb24oc3gsIHN5KXtcbiAgICAgICAgdGhpcy5hICo9IHN4O1xuICAgICAgICB0aGlzLmQgKj0gc3k7XG4gICAgICAgIHRoaXMudHggKj0gc3g7XG4gICAgICAgIHRoaXMudHkgKj0gc3k7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdHJhbnNsYXRlIDogZnVuY3Rpb24oZHgsIGR5KXtcbiAgICAgICAgdGhpcy50eCArPSBkeDtcbiAgICAgICAgdGhpcy50eSArPSBkeTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpZGVudGl0eSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8v5Yid5aeL5YyWXG4gICAgICAgIHRoaXMuYSA9IHRoaXMuZCA9IDE7XG4gICAgICAgIHRoaXMuYiA9IHRoaXMuYyA9IHRoaXMudHggPSB0aGlzLnR5ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbnZlcnQgOiBmdW5jdGlvbigpe1xuICAgICAgICAvL+mAhuWQkeefqemYtVxuICAgICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgICAgdmFyIGIgPSB0aGlzLmI7XG4gICAgICAgIHZhciBjID0gdGhpcy5jO1xuICAgICAgICB2YXIgZCA9IHRoaXMuZDtcbiAgICAgICAgdmFyIHR4ID0gdGhpcy50eDtcbiAgICAgICAgdmFyIGkgPSBhICogZCAtIGIgKiBjO1xuXG4gICAgICAgIHRoaXMuYSA9IGQgLyBpO1xuICAgICAgICB0aGlzLmIgPSAtYiAvIGk7XG4gICAgICAgIHRoaXMuYyA9IC1jIC8gaTtcbiAgICAgICAgdGhpcy5kID0gYSAvIGk7XG4gICAgICAgIHRoaXMudHggPSAoYyAqIHRoaXMudHkgLSBkICogdHgpIC8gaTtcbiAgICAgICAgdGhpcy50eSA9IC0oYSAqIHRoaXMudHkgLSBiICogdHgpIC8gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9uZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KHRoaXMuYSwgdGhpcy5iLCB0aGlzLmMsIHRoaXMuZCwgdGhpcy50eCwgdGhpcy50eSk7XG4gICAgfSxcbiAgICB0b0FycmF5IDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIFsgdGhpcy5hICwgdGhpcy5iICwgdGhpcy5jICwgdGhpcy5kICwgdGhpcy50eCAsIHRoaXMudHkgXTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOefqemYteW3puS5mOWQkemHj1xuICAgICAqL1xuICAgIG11bFZlY3RvciA6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgdmFyIGFhID0gdGhpcy5hLCBhYyA9IHRoaXMuYywgYXR4ID0gdGhpcy50eDtcbiAgICAgICAgdmFyIGFiID0gdGhpcy5iLCBhZCA9IHRoaXMuZCwgYXR5ID0gdGhpcy50eTtcblxuICAgICAgICB2YXIgb3V0ID0gWzAsMF07XG4gICAgICAgIG91dFswXSA9IHZbMF0gKiBhYSArIHZbMV0gKiBhYyArIGF0eDtcbiAgICAgICAgb3V0WzFdID0gdlswXSAqIGFiICsgdlsxXSAqIGFkICsgYXR5O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSAgICBcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWF0cml4O1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5pWw5a2mIOexu1xuICpcbiAqKi9cblxuXG5cbnZhciBfY2FjaGUgPSB7XG4gICAgc2luIDoge30sICAgICAvL3Npbue8k+WtmFxuICAgIGNvcyA6IHt9ICAgICAgLy9jb3PnvJPlrZhcbn07XG52YXIgX3JhZGlhbnMgPSBNYXRoLlBJIC8gMTgwO1xuXG4vKipcbiAqIEBwYXJhbSBhbmdsZSDlvKfluqbvvIjop5LluqbvvInlj4LmlbBcbiAqIEBwYXJhbSBpc0RlZ3JlZXMgYW5nbGXlj4LmlbDmmK/lkKbkuLrop5LluqborqHnrpfvvIzpu5jorqTkuLpmYWxzZe+8jGFuZ2xl5Li65Lul5byn5bqm6K6h6YeP55qE6KeS5bqmXG4gKi9cbmZ1bmN0aW9uIHNpbihhbmdsZSwgaXNEZWdyZWVzKSB7XG4gICAgYW5nbGUgPSAoaXNEZWdyZWVzID8gYW5nbGUgKiBfcmFkaWFucyA6IGFuZ2xlKS50b0ZpeGVkKDQpO1xuICAgIGlmKHR5cGVvZiBfY2FjaGUuc2luW2FuZ2xlXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBfY2FjaGUuc2luW2FuZ2xlXSA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICB9XG4gICAgcmV0dXJuIF9jYWNoZS5zaW5bYW5nbGVdO1xufVxuXG4vKipcbiAqIEBwYXJhbSByYWRpYW5zIOW8p+W6puWPguaVsFxuICovXG5mdW5jdGlvbiBjb3MoYW5nbGUsIGlzRGVncmVlcykge1xuICAgIGFuZ2xlID0gKGlzRGVncmVlcyA/IGFuZ2xlICogX3JhZGlhbnMgOiBhbmdsZSkudG9GaXhlZCg0KTtcbiAgICBpZih0eXBlb2YgX2NhY2hlLmNvc1thbmdsZV0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgX2NhY2hlLmNvc1thbmdsZV0gPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgfVxuICAgIHJldHVybiBfY2FjaGUuY29zW2FuZ2xlXTtcbn1cblxuLyoqXG4gKiDop5LluqbovazlvKfluqZcbiAqIEBwYXJhbSB7T2JqZWN0fSBhbmdsZVxuICovXG5mdW5jdGlvbiBkZWdyZWVUb1JhZGlhbihhbmdsZSkge1xuICAgIHJldHVybiBhbmdsZSAqIF9yYWRpYW5zO1xufVxuXG4vKipcbiAqIOW8p+W6pui9rOinkuW6plxuICogQHBhcmFtIHtPYmplY3R9IGFuZ2xlXG4gKi9cbmZ1bmN0aW9uIHJhZGlhblRvRGVncmVlKGFuZ2xlKSB7XG4gICAgcmV0dXJuIGFuZ2xlIC8gX3JhZGlhbnM7XG59XG5cbi8qXG4gKiDmoKHpqozop5LluqbliLAzNjDluqblhoVcbiAqIEBwYXJhbSB7YW5nbGV9IG51bWJlclxuICovXG5mdW5jdGlvbiBkZWdyZWVUbzM2MCggYW5nbGUgKSB7XG4gICAgdmFyIHJlQW5nID0gKDM2MCArICBhbmdsZSAgJSAzNjApICUgMzYwOy8vTWF0aC5hYnMoMzYwICsgTWF0aC5jZWlsKCBhbmdsZSApICUgMzYwKSAlIDM2MDtcbiAgICBpZiggcmVBbmcgPT0gMCAmJiBhbmdsZSAhPT0gMCApe1xuICAgICAgICByZUFuZyA9IDM2MFxuICAgIH1cbiAgICByZXR1cm4gcmVBbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBQSSAgOiBNYXRoLlBJICAsXG4gICAgc2luIDogc2luICAgICAgLFxuICAgIGNvcyA6IGNvcyAgICAgICxcbiAgICBkZWdyZWVUb1JhZGlhbiA6IGRlZ3JlZVRvUmFkaWFuLFxuICAgIHJhZGlhblRvRGVncmVlIDogcmFkaWFuVG9EZWdyZWUsXG4gICAgZGVncmVlVG8zNjAgICAgOiBkZWdyZWVUbzM2MCAgIFxufTtcblxuIiwiLyoqXG4gKiBDYW52YXhcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqIOeCueWHu+ajgOa1iyDnsbtcbiAqICovXG5pbXBvcnQgbXlNYXRoIGZyb20gXCIuL01hdGhcIjtcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8qKlxuICog5YyF5ZCr5Yik5patXG4gKiBzaGFwZSA6IOWbvuW9olxuICogeCA6IOaoquWdkOagh1xuICogeSA6IOe6teWdkOagh1xuICovXG5mdW5jdGlvbiBpc0luc2lkZShzaGFwZSwgcG9pbnQpIHtcbiAgICB2YXIgeCA9IHBvaW50Lng7XG4gICAgdmFyIHkgPSBwb2ludC55O1xuICAgIGlmICghc2hhcGUgfHwgIXNoYXBlLnR5cGUpIHtcbiAgICAgICAgLy8g5peg5Y+C5pWw5oiW5LiN5pSv5oyB57G75Z6LXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8v5pWw5a2m6L+Q566X77yM5Li76KaB5pivbGluZe+8jGJyb2tlbkxpbmVcbiAgICByZXR1cm4gX3BvaW50SW5TaGFwZShzaGFwZSwgeCwgeSk7XG59O1xuXG5mdW5jdGlvbiBfcG9pbnRJblNoYXBlKHNoYXBlLCB4LCB5KSB7XG4gICAgLy8g5Zyo55+p5b2i5YaF5YiZ6YOo5YiG5Zu+5b2i6ZyA6KaB6L+b5LiA5q2l5Yik5patXG4gICAgc3dpdGNoIChzaGFwZS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2xpbmUnOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZUxpbmUoc2hhcGUuY29udGV4dCwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ2Jyb2tlbmxpbmUnOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZUJyb2tlbkxpbmUoc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlICdyZWN0JzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlICdjaXJjbGUnOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZUNpcmNsZShzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ2VsbGlwc2UnOlxuICAgICAgICAgICAgcmV0dXJuIF9pc1BvaW50SW5FbGlwc2Uoc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdzZWN0b3InOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZVNlY3RvcihzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICBjYXNlICdkcm9wbGV0JzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVQYXRoKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAncG9seWdvbic6XG4gICAgICAgIGNhc2UgJ2lzb2dvbic6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlUG9seWdvbl9XaW5kaW5nTnVtYmVyKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgICAgIC8vcmV0dXJuIF9pc0luc2lkZVBvbHlnb25fQ3Jvc3NpbmdOdW1iZXIoc2hhcGUsIHgsIHkpO1xuICAgIH1cbn07XG4vKipcbiAqICFpc0luc2lkZVxuICovXG5mdW5jdGlvbiBpc091dHNpZGUoc2hhcGUsIHgsIHkpIHtcbiAgICByZXR1cm4gIWlzSW5zaWRlKHNoYXBlLCB4LCB5KTtcbn07XG5cbi8qKlxuICog57q/5q615YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZUxpbmUoY29udGV4dCwgeCwgeSkge1xuICAgIHZhciB4MCA9IGNvbnRleHQueFN0YXJ0O1xuICAgIHZhciB5MCA9IGNvbnRleHQueVN0YXJ0O1xuICAgIHZhciB4MSA9IGNvbnRleHQueEVuZDtcbiAgICB2YXIgeTEgPSBjb250ZXh0LnlFbmQ7XG4gICAgdmFyIF9sID0gTWF0aC5tYXgoY29udGV4dC5saW5lV2lkdGggLCAzKTtcbiAgICB2YXIgX2EgPSAwO1xuICAgIHZhciBfYiA9IHgwO1xuXG4gICAgaWYoXG4gICAgICAgICh5ID4geTAgKyBfbCAmJiB5ID4geTEgKyBfbCkgXG4gICAgICAgIHx8ICh5IDwgeTAgLSBfbCAmJiB5IDwgeTEgLSBfbCkgXG4gICAgICAgIHx8ICh4ID4geDAgKyBfbCAmJiB4ID4geDEgKyBfbCkgXG4gICAgICAgIHx8ICh4IDwgeDAgLSBfbCAmJiB4IDwgeDEgLSBfbCkgXG4gICAgKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh4MCAhPT0geDEpIHtcbiAgICAgICAgX2EgPSAoeTAgLSB5MSkgLyAoeDAgLSB4MSk7XG4gICAgICAgIF9iID0gKHgwICogeTEgLSB4MSAqIHkwKSAvICh4MCAtIHgxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMoeCAtIHgwKSA8PSBfbCAvIDI7XG4gICAgfVxuXG4gICAgdmFyIF9zID0gKF9hICogeCAtIHkgKyBfYikgKiAoX2EgKiB4IC0geSArIF9iKSAvIChfYSAqIF9hICsgMSk7XG4gICAgcmV0dXJuIF9zIDw9IF9sIC8gMiAqIF9sIC8gMjtcbn07XG5cbmZ1bmN0aW9uIF9pc0luc2lkZUJyb2tlbkxpbmUoc2hhcGUsIHgsIHkpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQ7XG4gICAgdmFyIHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xuICAgIHZhciBsaW5lQXJlYTtcbiAgICB2YXIgaW5zaWRlQ2F0Y2ggPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBvaW50TGlzdC5sZW5ndGggLSAxOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGxpbmVBcmVhID0ge1xuICAgICAgICAgICAgeFN0YXJ0OiBwb2ludExpc3RbaV1bMF0sXG4gICAgICAgICAgICB5U3RhcnQ6IHBvaW50TGlzdFtpXVsxXSxcbiAgICAgICAgICAgIHhFbmQ6IHBvaW50TGlzdFtpICsgMV1bMF0sXG4gICAgICAgICAgICB5RW5kOiBwb2ludExpc3RbaSArIDFdWzFdLFxuICAgICAgICAgICAgbGluZVdpZHRoOiBjb250ZXh0LmxpbmVXaWR0aFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIV9pc0luc2lkZVJlY3RhbmdsZSh7XG4gICAgICAgICAgICAgICAgICAgIHg6IE1hdGgubWluKGxpbmVBcmVhLnhTdGFydCwgbGluZUFyZWEueEVuZCkgLSBsaW5lQXJlYS5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHk6IE1hdGgubWluKGxpbmVBcmVhLnlTdGFydCwgbGluZUFyZWEueUVuZCkgLSBsaW5lQXJlYS5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBNYXRoLmFicyhsaW5lQXJlYS54U3RhcnQgLSBsaW5lQXJlYS54RW5kKSArIGxpbmVBcmVhLmxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhsaW5lQXJlYS55U3RhcnQgLSBsaW5lQXJlYS55RW5kKSArIGxpbmVBcmVhLmxpbmVXaWR0aFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeCwgeVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgLy8g5LiN5Zyo55+p5b2i5Yy65YaF6Lez6L+HXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpbnNpZGVDYXRjaCA9IF9pc0luc2lkZUxpbmUobGluZUFyZWEsIHgsIHkpO1xuICAgICAgICBpZiAoaW5zaWRlQ2F0Y2gpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnNpZGVDYXRjaDtcbn07XG5cblxuLyoqXG4gKiDnn6nlvaLljIXlkKvliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlUmVjdGFuZ2xlKHNoYXBlLCB4LCB5KSB7XG4gICAgaWYgKHggPj0gc2hhcGUueCAmJiB4IDw9IChzaGFwZS54ICsgc2hhcGUud2lkdGgpICYmIHkgPj0gc2hhcGUueSAmJiB5IDw9IChzaGFwZS55ICsgc2hhcGUuaGVpZ2h0KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiDlnIblvaLljIXlkKvliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlQ2lyY2xlKHNoYXBlLCB4LCB5LCByKSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgICFyICYmIChyID0gY29udGV4dC5yKTtcbiAgICByKz1jb250ZXh0LmxpbmVXaWR0aDtcbiAgICByZXR1cm4gKHggKiB4ICsgeSAqIHkpIDwgciAqIHI7XG59O1xuXG4vKipcbiAqIOaJh+W9ouWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVTZWN0b3Ioc2hhcGUsIHgsIHkpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHRcbiAgICBpZiAoIV9pc0luc2lkZUNpcmNsZShzaGFwZSwgeCwgeSkgfHwgKGNvbnRleHQucjAgPiAwICYmIF9pc0luc2lkZUNpcmNsZShzaGFwZSwgeCwgeSwgY29udGV4dC5yMCkpKSB7XG4gICAgICAgIC8vIOWkp+WchuWkluaIluiAheWwj+WchuWGheebtOaOpWZhbHNlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyDliKTmlq3lpLnop5JcbiAgICAgICAgdmFyIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5zdGFydEFuZ2xlKTsgLy8g6LW35aeL6KeS5bqmWzAsMzYwKVxuICAgICAgICB2YXIgZW5kQW5nbGUgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5lbmRBbmdsZSk7IC8vIOe7k+adn+inkuW6pigwLDM2MF1cblxuICAgICAgICAvL+iuoeeul+ivpeeCueaJgOWcqOeahOinkuW6plxuICAgICAgICB2YXIgYW5nbGUgPSBteU1hdGguZGVncmVlVG8zNjAoKE1hdGguYXRhbjIoeSwgeCkgLyBNYXRoLlBJICogMTgwKSAlIDM2MCk7XG5cbiAgICAgICAgdmFyIHJlZ0luID0gdHJ1ZTsgLy/lpoLmnpzlnKhzdGFydOWSjGVuZOeahOaVsOWAvOS4re+8jGVuZOWkp+S6jnN0YXJ06ICM5LiU5piv6aG65pe26ZKI5YiZcmVnSW7kuLp0cnVlXG4gICAgICAgIGlmICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlICYmICFjb250ZXh0LmNsb2Nrd2lzZSkgfHwgKHN0YXJ0QW5nbGUgPCBlbmRBbmdsZSAmJiBjb250ZXh0LmNsb2Nrd2lzZSkpIHtcbiAgICAgICAgICAgIHJlZ0luID0gZmFsc2U7IC8vb3V0XG4gICAgICAgIH1cbiAgICAgICAgLy/luqbnmoTojIPlm7TvvIzku47lsI/liLDlpKdcbiAgICAgICAgdmFyIHJlZ0FuZ2xlID0gW1xuICAgICAgICAgICAgTWF0aC5taW4oc3RhcnRBbmdsZSwgZW5kQW5nbGUpLFxuICAgICAgICAgICAgTWF0aC5tYXgoc3RhcnRBbmdsZSwgZW5kQW5nbGUpXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIGluQW5nbGVSZWcgPSBhbmdsZSA+IHJlZ0FuZ2xlWzBdICYmIGFuZ2xlIDwgcmVnQW5nbGVbMV07XG4gICAgICAgIHJldHVybiAoaW5BbmdsZVJlZyAmJiByZWdJbikgfHwgKCFpbkFuZ2xlUmVnICYmICFyZWdJbik7XG4gICAgfVxufTtcblxuLypcbiAq5qSt5ZyG5YyF5ZCr5Yik5patXG4gKiAqL1xuZnVuY3Rpb24gX2lzUG9pbnRJbkVsaXBzZShzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICB2YXIgY2VudGVyID0ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgfTtcbiAgICAvL3jljYrlvoRcbiAgICB2YXIgWFJhZGl1cyA9IGNvbnRleHQuaHI7XG4gICAgdmFyIFlSYWRpdXMgPSBjb250ZXh0LnZyO1xuXG4gICAgdmFyIHAgPSB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHlcbiAgICB9O1xuXG4gICAgdmFyIGlSZXM7XG5cbiAgICBwLnggLT0gY2VudGVyLng7XG4gICAgcC55IC09IGNlbnRlci55O1xuXG4gICAgcC54ICo9IHAueDtcbiAgICBwLnkgKj0gcC55O1xuXG4gICAgWFJhZGl1cyAqPSBYUmFkaXVzO1xuICAgIFlSYWRpdXMgKj0gWVJhZGl1cztcblxuICAgIGlSZXMgPSBZUmFkaXVzICogcC54ICsgWFJhZGl1cyAqIHAueSAtIFhSYWRpdXMgKiBZUmFkaXVzO1xuXG4gICAgcmV0dXJuIChpUmVzIDwgMCk7XG59O1xuXG4vKipcbiAqIOWkmui+ueW9ouWMheWQq+WIpOaWrSBOb256ZXJvIFdpbmRpbmcgTnVtYmVyIFJ1bGVcbiAqL1xuXG5mdW5jdGlvbiBfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIoc2hhcGUsIHgsIHkpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQgPyBzaGFwZS5jb250ZXh0IDogc2hhcGU7XG4gICAgdmFyIHBvbHkgPSBfLmNsb25lKGNvbnRleHQucG9pbnRMaXN0KTsgLy9wb2x5IOWkmui+ueW9oumhtueCue+8jOaVsOe7hOaIkOWRmOeahOagvOW8j+WQjCBwXG4gICAgcG9seS5wdXNoKHBvbHlbMF0pOyAvL+iusOW+l+imgemXreWQiFxuICAgIHZhciB3biA9IDA7XG4gICAgZm9yICh2YXIgc2hpZnRQLCBzaGlmdCA9IHBvbHlbMF1bMV0gPiB5LCBpID0gMTsgaSA8IHBvbHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy/lhYjlgZrnur/nmoTmo4DmtYvvvIzlpoLmnpzmmK/lnKjkuKTngrnnmoTnur/kuIrvvIzlsLHogq/lrprmmK/lnKjorqTkuLrlnKjlm77lvaLkuIpcbiAgICAgICAgdmFyIGluTGluZSA9IF9pc0luc2lkZUxpbmUoe1xuICAgICAgICAgICAgeFN0YXJ0IDogcG9seVtpLTFdWzBdLFxuICAgICAgICAgICAgeVN0YXJ0IDogcG9seVtpLTFdWzFdLFxuICAgICAgICAgICAgeEVuZCAgIDogcG9seVtpXVswXSxcbiAgICAgICAgICAgIHlFbmQgICA6IHBvbHlbaV1bMV0sXG4gICAgICAgICAgICBsaW5lV2lkdGggOiAoY29udGV4dC5saW5lV2lkdGggfHwgMSlcbiAgICAgICAgfSAsIHggLCB5KTtcbiAgICAgICAgaWYgKCBpbkxpbmUgKXtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICAvL+WmguaenOaciWZpbGxTdHlsZSDvvIwg6YKj5LmI6IKv5a6a6ZyA6KaB5YGa6Z2i55qE5qOA5rWLXG4gICAgICAgIGlmIChjb250ZXh0LmZpbGxTdHlsZSkge1xuICAgICAgICAgICAgc2hpZnRQID0gc2hpZnQ7XG4gICAgICAgICAgICBzaGlmdCA9IHBvbHlbaV1bMV0gPiB5O1xuICAgICAgICAgICAgaWYgKHNoaWZ0UCAhPSBzaGlmdCkge1xuICAgICAgICAgICAgICAgIHZhciBuID0gKHNoaWZ0UCA/IDEgOiAwKSAtIChzaGlmdCA/IDEgOiAwKTtcbiAgICAgICAgICAgICAgICBpZiAobiAqICgocG9seVtpIC0gMV1bMF0gLSB4KSAqIChwb2x5W2ldWzFdIC0geSkgLSAocG9seVtpIC0gMV1bMV0gLSB5KSAqIChwb2x5W2ldWzBdIC0geCkpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB3biArPSBuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB3bjtcbn07XG5cbi8qKlxuICog6Lev5b6E5YyF5ZCr5Yik5pat77yM5L6d6LWW5aSa6L655b2i5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZVBhdGgoc2hhcGUsIHgsIHkpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQ7XG4gICAgdmFyIHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xuICAgIHZhciBpbnNpZGVDYXRjaCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcG9pbnRMaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpbnNpZGVDYXRjaCA9IF9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcih7XG4gICAgICAgICAgICBwb2ludExpc3Q6IHBvaW50TGlzdFtpXSxcbiAgICAgICAgICAgIGxpbmVXaWR0aDogY29udGV4dC5saW5lV2lkdGgsXG4gICAgICAgICAgICBmaWxsU3R5bGU6IGNvbnRleHQuZmlsbFN0eWxlXG4gICAgICAgIH0sIHgsIHkpO1xuICAgICAgICBpZiAoaW5zaWRlQ2F0Y2gpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnNpZGVDYXRjaDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpc0luc2lkZTogaXNJbnNpZGUsXG4gICAgaXNPdXRzaWRlOiBpc091dHNpZGVcbn07IiwiaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiBUd2Vlbi5qcyAtIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanMvZ3JhcGhzL2NvbnRyaWJ1dG9ycyBmb3IgdGhlIGZ1bGwgbGlzdCBvZiBjb250cmlidXRvcnMuXG4gKiBUaGFuayB5b3UgYWxsLCB5b3UncmUgYXdlc29tZSFcbiAqL1xuXG4gdmFyIFRXRUVOID0gVFdFRU4gfHwgKGZ1bmN0aW9uICgpIHtcblxuIFx0dmFyIF90d2VlbnMgPSBbXTtcblxuIFx0cmV0dXJuIHtcblxuIFx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblxuIFx0XHRcdHJldHVybiBfdHdlZW5zO1xuXG4gXHRcdH0sXG5cbiBcdFx0cmVtb3ZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cbiBcdFx0XHRfdHdlZW5zID0gW107XG5cbiBcdFx0fSxcblxuIFx0XHRhZGQ6IGZ1bmN0aW9uICh0d2Vlbikge1xuXG4gXHRcdFx0X3R3ZWVucy5wdXNoKHR3ZWVuKTtcblxuIFx0XHR9LFxuXG4gXHRcdHJlbW92ZTogZnVuY3Rpb24gKHR3ZWVuKSB7XG5cblx0XHRcdHZhciBpID0gXy5pbmRleE9mKCBfdHdlZW5zICwgdHdlZW4gKTsvL190d2VlbnMuaW5kZXhPZih0d2Vlbik7XG5cblx0XHRcdGlmIChpICE9PSAtMSkge1xuXHRcdFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHR1cGRhdGU6IGZ1bmN0aW9uICh0aW1lLCBwcmVzZXJ2ZSkge1xuXG5cdFx0XHRpZiAoX3R3ZWVucy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdHRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogVFdFRU4ubm93KCk7XG5cblx0XHRcdHdoaWxlIChpIDwgX3R3ZWVucy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgIC8qIG9sZCBcblx0XHRcdFx0aWYgKF90d2VlbnNbaV0udXBkYXRlKHRpbWUpIHx8IHByZXNlcnZlKSB7XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCovXG5cbiAgICAgICAgICAgICAgICAvL25ldyBjb2RlXG4gICAgICAgICAgICAgICAgLy9pbiByZWFsIHdvcmxkLCB0d2Vlbi51cGRhdGUgaGFzIGNoYW5jZSB0byByZW1vdmUgaXRzZWxmLCBzbyB3ZSBoYXZlIHRvIGhhbmRsZSB0aGlzIHNpdHVhdGlvbi5cbiAgICAgICAgICAgICAgICAvL2luIGNlcnRhaW4gY2FzZXMsIG9uVXBkYXRlQ2FsbGJhY2sgd2lsbCByZW1vdmUgaW5zdGFuY2VzIGluIF90d2VlbnMsIHdoaWNoIG1ha2UgX3R3ZWVucy5zcGxpY2UoaSwgMSkgZmFpbFxuICAgICAgICAgICAgICAgIC8vQGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbVxuICAgICAgICAgICAgICAgIHZhciBfdCA9IF90d2VlbnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIF91cGRhdGVSZXMgPSBfdC51cGRhdGUodGltZSk7XG5cbiAgICAgICAgICAgICAgICBpZiggIV90d2VlbnNbaV0gKXtcbiAgICAgICAgICAgICAgICBcdGJyZWFrO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKCBfdCA9PT0gX3R3ZWVuc1tpXSApIHtcbiAgICAgICAgICAgICAgICBcdGlmICggX3VwZGF0ZVJlcyB8fCBwcmVzZXJ2ZSApIHtcbiAgICAgICAgICAgICAgICBcdFx0aSsrO1xuICAgICAgICAgICAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgICAgICAgICBcdFx0X3R3ZWVucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgXHR9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG59KSgpO1xuXG5cbi8vIEluY2x1ZGUgYSBwZXJmb3JtYW5jZS5ub3cgcG9seWZpbGwuXG4vLyBJbiBub2RlLmpzLCB1c2UgcHJvY2Vzcy5ocnRpbWUuXG5pZiAodHlwZW9mICh3aW5kb3cpID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHByb2Nlc3MpICE9PSAndW5kZWZpbmVkJykge1xuXHRUV0VFTi5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHRpbWUgPSBwcm9jZXNzLmhydGltZSgpO1xuXG5cdFx0Ly8gQ29udmVydCBbc2Vjb25kcywgbmFub3NlY29uZHNdIHRvIG1pbGxpc2Vjb25kcy5cblx0XHRyZXR1cm4gdGltZVswXSAqIDEwMDAgKyB0aW1lWzFdIC8gMTAwMDAwMDtcblx0fTtcbn1cbi8vIEluIGEgYnJvd3NlciwgdXNlIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAodHlwZW9mICh3aW5kb3cpICE9PSAndW5kZWZpbmVkJyAmJlxuXHR3aW5kb3cucGVyZm9ybWFuY2UgIT09IHVuZGVmaW5lZCAmJlxuXHR3aW5kb3cucGVyZm9ybWFuY2Uubm93ICE9PSB1bmRlZmluZWQpIHtcblx0Ly8gVGhpcyBtdXN0IGJlIGJvdW5kLCBiZWNhdXNlIGRpcmVjdGx5IGFzc2lnbmluZyB0aGlzIGZ1bmN0aW9uXG5cdC8vIGxlYWRzIHRvIGFuIGludm9jYXRpb24gZXhjZXB0aW9uIGluIENocm9tZS5cblx0VFdFRU4ubm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdy5iaW5kKHdpbmRvdy5wZXJmb3JtYW5jZSk7XG59XG4vLyBVc2UgRGF0ZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAoRGF0ZS5ub3cgIT09IHVuZGVmaW5lZCkge1xuXHRUV0VFTi5ub3cgPSBEYXRlLm5vdztcbn1cbi8vIE90aGVyd2lzZSwgdXNlICduZXcgRGF0ZSgpLmdldFRpbWUoKScuXG5lbHNlIHtcblx0VFdFRU4ubm93ID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fTtcbn1cblxuXG5UV0VFTi5Ud2VlbiA9IGZ1bmN0aW9uIChvYmplY3QpIHtcblxuXHR2YXIgX29iamVjdCA9IG9iamVjdDtcblx0dmFyIF92YWx1ZXNTdGFydCA9IHt9O1xuXHR2YXIgX3ZhbHVlc0VuZCA9IHt9O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0UmVwZWF0ID0ge307XG5cdHZhciBfZHVyYXRpb24gPSAxMDAwO1xuXHR2YXIgX3JlcGVhdCA9IDA7XG5cdHZhciBfcmVwZWF0RGVsYXlUaW1lO1xuXHR2YXIgX3lveW8gPSBmYWxzZTtcblx0dmFyIF9pc1BsYXlpbmcgPSBmYWxzZTtcblx0dmFyIF9yZXZlcnNlZCA9IGZhbHNlO1xuXHR2YXIgX2RlbGF5VGltZSA9IDA7XG5cdHZhciBfc3RhcnRUaW1lID0gbnVsbDtcblx0dmFyIF9lYXNpbmdGdW5jdGlvbiA9IFRXRUVOLkVhc2luZy5MaW5lYXIuTm9uZTtcblx0dmFyIF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLkxpbmVhcjtcblx0dmFyIF9jaGFpbmVkVHdlZW5zID0gW107XG5cdHZhciBfb25TdGFydENhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXHR2YXIgX29uVXBkYXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uQ29tcGxldGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdG9wQ2FsbGJhY2sgPSBudWxsO1xuXG5cdHRoaXMudG8gPSBmdW5jdGlvbiAocHJvcGVydGllcywgZHVyYXRpb24pIHtcblxuXHRcdF92YWx1ZXNFbmQgPSBwcm9wZXJ0aWVzO1xuXG5cdFx0aWYgKGR1cmF0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdF9kdXJhdGlvbiA9IGR1cmF0aW9uO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uICh0aW1lKSB7XG5cblx0XHRUV0VFTi5hZGQodGhpcyk7XG5cblx0XHRfaXNQbGF5aW5nID0gdHJ1ZTtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IGZhbHNlO1xuXG5cdFx0X3N0YXJ0VGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiBUV0VFTi5ub3coKTtcblx0XHRfc3RhcnRUaW1lICs9IF9kZWxheVRpbWU7XG5cblx0XHRmb3IgKHZhciBwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kKSB7XG5cblx0XHRcdC8vIENoZWNrIGlmIGFuIEFycmF5IHdhcyBwcm92aWRlZCBhcyBwcm9wZXJ0eSB2YWx1ZVxuXHRcdFx0aWYgKF92YWx1ZXNFbmRbcHJvcGVydHldIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuXHRcdFx0XHRpZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDcmVhdGUgYSBsb2NhbCBjb3B5IG9mIHRoZSBBcnJheSB3aXRoIHRoZSBzdGFydCB2YWx1ZSBhdCB0aGUgZnJvbnRcblx0XHRcdFx0X3ZhbHVlc0VuZFtwcm9wZXJ0eV0gPSBbX29iamVjdFtwcm9wZXJ0eV1dLmNvbmNhdChfdmFsdWVzRW5kW3Byb3BlcnR5XSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgYHRvKClgIHNwZWNpZmllcyBhIHByb3BlcnR5IHRoYXQgZG9lc24ndCBleGlzdCBpbiB0aGUgc291cmNlIG9iamVjdCxcblx0XHRcdC8vIHdlIHNob3VsZCBub3Qgc2V0IHRoYXQgcHJvcGVydHkgaW4gdGhlIG9iamVjdFxuXHRcdFx0aWYgKF9vYmplY3RbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNhdmUgdGhlIHN0YXJ0aW5nIHZhbHVlLlxuXHRcdFx0X3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9IF9vYmplY3RbcHJvcGVydHldO1xuXG5cdFx0XHRpZiAoKF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBBcnJheSkgPT09IGZhbHNlKSB7XG5cdFx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gKj0gMS4wOyAvLyBFbnN1cmVzIHdlJ3JlIHVzaW5nIG51bWJlcnMsIG5vdCBzdHJpbmdzXG5cdFx0XHR9XG5cblx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRbcHJvcGVydHldIHx8IDA7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGlmICghX2lzUGxheWluZykge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0VFdFRU4ucmVtb3ZlKHRoaXMpO1xuXHRcdF9pc1BsYXlpbmcgPSBmYWxzZTtcblxuXHRcdGlmIChfb25TdG9wQ2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdF9vblN0b3BDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdH1cblxuXHRcdHRoaXMuc3RvcENoYWluZWRUd2VlbnMoKTtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuZW5kID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0dGhpcy51cGRhdGUoX3N0YXJ0VGltZSArIF9kdXJhdGlvbik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKyspIHtcblx0XHRcdF9jaGFpbmVkVHdlZW5zW2ldLnN0b3AoKTtcblx0XHR9XG5cblx0fTtcblxuXHR0aGlzLmRlbGF5ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuXG5cdFx0X2RlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMucmVwZWF0ID0gZnVuY3Rpb24gKHRpbWVzKSB7XG5cblx0XHRfcmVwZWF0ID0gdGltZXM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdERlbGF5ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuXG5cdFx0X3JlcGVhdERlbGF5VGltZSA9IGFtb3VudDtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMueW95byA9IGZ1bmN0aW9uICh5b3lvKSB7XG5cblx0XHRfeW95byA9IHlveW87XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXG5cdHRoaXMuZWFzaW5nID0gZnVuY3Rpb24gKGVhc2luZykge1xuXG5cdFx0X2Vhc2luZ0Z1bmN0aW9uID0gZWFzaW5nO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5pbnRlcnBvbGF0aW9uID0gZnVuY3Rpb24gKGludGVycG9sYXRpb24pIHtcblxuXHRcdF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24gPSBpbnRlcnBvbGF0aW9uO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5jaGFpbiA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF9jaGFpbmVkVHdlZW5zID0gYXJndW1lbnRzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0YXJ0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25TdGFydENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25VcGRhdGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vbkNvbXBsZXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25Db21wbGV0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uU3RvcENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XG5cblx0XHR2YXIgcHJvcGVydHk7XG5cdFx0dmFyIGVsYXBzZWQ7XG5cdFx0dmFyIHZhbHVlO1xuXG5cdFx0aWYgKHRpbWUgPCBfc3RhcnRUaW1lKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoX29uU3RhcnRDYWxsYmFja0ZpcmVkID09PSBmYWxzZSkge1xuXG5cdFx0XHRpZiAoX29uU3RhcnRDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0XHRfb25TdGFydENhbGxiYWNrLmNhbGwoX29iamVjdCwgX29iamVjdCk7XG5cdFx0XHR9XG5cblx0XHRcdF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZWxhcHNlZCA9ICh0aW1lIC0gX3N0YXJ0VGltZSkgLyBfZHVyYXRpb247XG5cdFx0ZWxhcHNlZCA9IGVsYXBzZWQgPiAxID8gMSA6IGVsYXBzZWQ7XG5cblx0XHR2YWx1ZSA9IF9lYXNpbmdGdW5jdGlvbihlbGFwc2VkKTtcblxuXHRcdGZvciAocHJvcGVydHkgaW4gX3ZhbHVlc0VuZCkge1xuXG5cdFx0XHQvLyBEb24ndCB1cGRhdGUgcHJvcGVydGllcyB0aGF0IGRvIG5vdCBleGlzdCBpbiB0aGUgc291cmNlIG9iamVjdFxuXHRcdFx0aWYgKF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHN0YXJ0ID0gX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xuXHRcdFx0dmFyIGVuZCA9IF92YWx1ZXNFbmRbcHJvcGVydHldO1xuXG5cdFx0XHRpZiAoZW5kIGluc3RhbmNlb2YgQXJyYXkpIHtcblxuXHRcdFx0XHRfb2JqZWN0W3Byb3BlcnR5XSA9IF9pbnRlcnBvbGF0aW9uRnVuY3Rpb24oZW5kLCB2YWx1ZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gUGFyc2VzIHJlbGF0aXZlIGVuZCB2YWx1ZXMgd2l0aCBzdGFydCBhcyBiYXNlIChlLmcuOiArMTAsIC0zKVxuXHRcdFx0XHRpZiAodHlwZW9mIChlbmQpID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdFx0aWYgKGVuZC5jaGFyQXQoMCkgPT09ICcrJyB8fCBlbmQuY2hhckF0KDApID09PSAnLScpIHtcblx0XHRcdFx0XHRcdGVuZCA9IHN0YXJ0ICsgcGFyc2VGbG9hdChlbmQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBwYXJzZUZsb2F0KGVuZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUHJvdGVjdCBhZ2FpbnN0IG5vbiBudW1lcmljIHByb3BlcnRpZXMuXG5cdFx0XHRcdGlmICh0eXBlb2YgKGVuZCkgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0X29iamVjdFtwcm9wZXJ0eV0gPSBzdGFydCArIChlbmQgLSBzdGFydCkgKiB2YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAoX29uVXBkYXRlQ2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdF9vblVwZGF0ZUNhbGxiYWNrLmNhbGwoX29iamVjdCwgdmFsdWUpO1xuXHRcdH1cblxuXHRcdGlmIChlbGFwc2VkID09PSAxKSB7XG5cblx0XHRcdGlmIChfcmVwZWF0ID4gMCkge1xuXG5cdFx0XHRcdGlmIChpc0Zpbml0ZShfcmVwZWF0KSkge1xuXHRcdFx0XHRcdF9yZXBlYXQtLTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlYXNzaWduIHN0YXJ0aW5nIHZhbHVlcywgcmVzdGFydCBieSBtYWtpbmcgc3RhcnRUaW1lID0gbm93XG5cdFx0XHRcdGZvciAocHJvcGVydHkgaW4gX3ZhbHVlc1N0YXJ0UmVwZWF0KSB7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mIChfdmFsdWVzRW5kW3Byb3BlcnR5XSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSArIHBhcnNlRmxvYXQoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdFx0dmFyIHRtcCA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV07XG5cblx0XHRcdFx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzRW5kW3Byb3BlcnR5XTtcblx0XHRcdFx0XHRcdF92YWx1ZXNFbmRbcHJvcGVydHldID0gdG1wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRfcmV2ZXJzZWQgPSAhX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF9yZXBlYXREZWxheVRpbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdF9zdGFydFRpbWUgPSB0aW1lICsgX3JlcGVhdERlbGF5VGltZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9kZWxheVRpbWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAoX29uQ29tcGxldGVDYWxsYmFjayAhPT0gbnVsbCkge1xuXG5cdFx0XHRcdFx0X29uQ29tcGxldGVDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG51bUNoYWluZWRUd2VlbnMgPSBfY2hhaW5lZFR3ZWVucy5sZW5ndGg7IGkgPCBudW1DaGFpbmVkVHdlZW5zOyBpKyspIHtcblx0XHRcdFx0XHQvLyBNYWtlIHRoZSBjaGFpbmVkIHR3ZWVucyBzdGFydCBleGFjdGx5IGF0IHRoZSB0aW1lIHRoZXkgc2hvdWxkLFxuXHRcdFx0XHRcdC8vIGV2ZW4gaWYgdGhlIGB1cGRhdGUoKWAgbWV0aG9kIHdhcyBjYWxsZWQgd2F5IHBhc3QgdGhlIGR1cmF0aW9uIG9mIHRoZSB0d2VlblxuXHRcdFx0XHRcdF9jaGFpbmVkVHdlZW5zW2ldLnN0YXJ0KF9zdGFydFRpbWUgKyBfZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblxuXHR9O1xuXG59O1xuXG5cblRXRUVOLkVhc2luZyA9IHtcblxuXHRMaW5lYXI6IHtcblxuXHRcdE5vbmU6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhZHJhdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiAoMiAtIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0gMC41ICogKC0tayAqIChrIC0gMikgLSAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEN1YmljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFydGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtICgtLWsgKiBrICogayAqIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoKGsgLT0gMikgKiBrICogayAqIGsgLSAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1aW50aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKiBrICogayArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrICogayArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0U2ludXNvaWRhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5jb3MoayAqIE1hdGguUEkgLyAyKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNpbihrICogTWF0aC5QSSAvIDIpO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMC41ICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogaykpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RXhwb25lbnRpYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMCA/IDAgOiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLSAxMCAqIGspO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIE1hdGgucG93KDEwMjQsIGsgLSAxKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgtIE1hdGgucG93KDIsIC0gMTAgKiAoayAtIDEpKSArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q2lyY3VsYXI6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gayAqIGspO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gKC0tayAqIGspKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gLSAwLjUgKiAoTWF0aC5zcXJ0KDEgLSBrICogaykgLSAxKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtIChrIC09IDIpICogaykgKyAxKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEVsYXN0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtTWF0aC5wb3coMiwgMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIE1hdGgucG93KDIsIC0xMCAqIGspICogTWF0aC5zaW4oKGsgLSAwLjEpICogNSAqIE1hdGguUEkpICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRrICo9IDI7XG5cblx0XHRcdGlmIChrIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gLTAuNSAqIE1hdGgucG93KDIsIDEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiBNYXRoLnBvdygyLCAtMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKSArIDE7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCYWNrOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiAoKHMgKyAxKSAqIGsgLSBzKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiAoKHMgKyAxKSAqIGsgKyBzKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1OCAqIDEuNTI1O1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiAoayAqIGsgKiAoKHMgKyAxKSAqIGsgLSBzKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJvdW5jZToge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoMSAtIGspO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPCAoMSAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiBrICogaztcblx0XHRcdH0gZWxzZSBpZiAoayA8ICgyIC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgxLjUgLyAyLjc1KSkgKiBrICsgMC43NTtcblx0XHRcdH0gZWxzZSBpZiAoayA8ICgyLjUgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDIuMjUgLyAyLjc1KSkgKiBrICsgMC45Mzc1O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgyLjYyNSAvIDIuNzUpKSAqIGsgKyAwLjk4NDM3NTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPCAwLjUpIHtcblx0XHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuSW4oayAqIDIpICogMC41O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5PdXQoayAqIDIgLSAxKSAqIDAuNSArIDAuNTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cblRXRUVOLkludGVycG9sYXRpb24gPSB7XG5cblx0TGluZWFyOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIGYgPSBtICogaztcblx0XHR2YXIgaSA9IE1hdGguZmxvb3IoZik7XG5cdFx0dmFyIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5MaW5lYXI7XG5cblx0XHRpZiAoayA8IDApIHtcblx0XHRcdHJldHVybiBmbih2WzBdLCB2WzFdLCBmKTtcblx0XHR9XG5cblx0XHRpZiAoayA+IDEpIHtcblx0XHRcdHJldHVybiBmbih2W21dLCB2W20gLSAxXSwgbSAtIGYpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmbih2W2ldLCB2W2kgKyAxID4gbSA/IG0gOiBpICsgMV0sIGYgLSBpKTtcblxuXHR9LFxuXG5cdEJlemllcjogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBiID0gMDtcblx0XHR2YXIgbiA9IHYubGVuZ3RoIC0gMTtcblx0XHR2YXIgcHcgPSBNYXRoLnBvdztcblx0XHR2YXIgYm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkJlcm5zdGVpbjtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDw9IG47IGkrKykge1xuXHRcdFx0YiArPSBwdygxIC0gaywgbiAtIGkpICogcHcoaywgaSkgKiB2W2ldICogYm4obiwgaSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGI7XG5cblx0fSxcblxuXHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIG0gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIGYgPSBtICogaztcblx0XHR2YXIgaSA9IE1hdGguZmxvb3IoZik7XG5cdFx0dmFyIGZuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5DYXRtdWxsUm9tO1xuXG5cdFx0aWYgKHZbMF0gPT09IHZbbV0pIHtcblxuXHRcdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRcdGkgPSBNYXRoLmZsb29yKGYgPSBtICogKDEgKyBrKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbih2WyhpIC0gMSArIG0pICUgbV0sIHZbaV0sIHZbKGkgKyAxKSAlIG1dLCB2WyhpICsgMikgJSBtXSwgZiAtIGkpO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRcdHJldHVybiB2WzBdIC0gKGZuKHZbMF0sIHZbMF0sIHZbMV0sIHZbMV0sIC1mKSAtIHZbMF0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA+IDEpIHtcblx0XHRcdFx0cmV0dXJuIHZbbV0gLSAoZm4odlttXSwgdlttXSwgdlttIC0gMV0sIHZbbSAtIDFdLCBmIC0gbSkgLSB2W21dKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuKHZbaSA/IGkgLSAxIDogMF0sIHZbaV0sIHZbbSA8IGkgKyAxID8gbSA6IGkgKyAxXSwgdlttIDwgaSArIDIgPyBtIDogaSArIDJdLCBmIC0gaSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRVdGlsczoge1xuXG5cdFx0TGluZWFyOiBmdW5jdGlvbiAocDAsIHAxLCB0KSB7XG5cblx0XHRcdHJldHVybiAocDEgLSBwMCkgKiB0ICsgcDA7XG5cblx0XHR9LFxuXG5cdFx0QmVybnN0ZWluOiBmdW5jdGlvbiAobiwgaSkge1xuXG5cdFx0XHR2YXIgZmMgPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkZhY3RvcmlhbDtcblxuXHRcdFx0cmV0dXJuIGZjKG4pIC8gZmMoaSkgLyBmYyhuIC0gaSk7XG5cblx0XHR9LFxuXG5cdFx0RmFjdG9yaWFsOiAoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgYSA9IFsxXTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChuKSB7XG5cblx0XHRcdFx0dmFyIHMgPSAxO1xuXG5cdFx0XHRcdGlmIChhW25dKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFbbl07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKHZhciBpID0gbjsgaSA+IDE7IGktLSkge1xuXHRcdFx0XHRcdHMgKj0gaTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFbbl0gPSBzO1xuXHRcdFx0XHRyZXR1cm4gcztcblxuXHRcdFx0fTtcblxuXHRcdH0pKCksXG5cblx0XHRDYXRtdWxsUm9tOiBmdW5jdGlvbiAocDAsIHAxLCBwMiwgcDMsIHQpIHtcblxuXHRcdFx0dmFyIHYwID0gKHAyIC0gcDApICogMC41O1xuXHRcdFx0dmFyIHYxID0gKHAzIC0gcDEpICogMC41O1xuXHRcdFx0dmFyIHQyID0gdCAqIHQ7XG5cdFx0XHR2YXIgdDMgPSB0ICogdDI7XG5cblx0XHRcdHJldHVybiAoMiAqIHAxIC0gMiAqIHAyICsgdjAgKyB2MSkgKiB0MyArICgtIDMgKiBwMSArIDMgKiBwMiAtIDIgKiB2MCAtIHYxKSAqIHQyICsgdjAgKiB0ICsgcDE7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBUV0VFTjtcbiIsImltcG9ydCBUd2VlbiBmcm9tIFwiLi9Ud2VlblwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiDorr7nva4gQW5pbWF0aW9uRnJhbWUgYmVnaW5cbiAqL1xudmFyIGxhc3RUaW1lID0gMDtcbnZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbmZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xufTtcbmlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbn07XG5pZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgfTtcbn07XG5cbi8v566h55CG5omA5pyJ5Zu+6KGo55qE5riy5p+T5Lu75YqhXG52YXIgX3Rhc2tMaXN0ID0gW107IC8vW3sgaWQgOiB0YXNrOiB9Li4uXVxudmFyIF9yZXF1ZXN0QWlkID0gbnVsbDtcblxuZnVuY3Rpb24gZW5hYmxlZEFuaW1hdGlvbkZyYW1lKCl7XG4gICAgaWYgKCFfcmVxdWVzdEFpZCkge1xuICAgICAgICBfcmVxdWVzdEFpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJmcmFtZV9fXCIgKyBfdGFza0xpc3QubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vaWYgKCBUd2Vlbi5nZXRBbGwoKS5sZW5ndGggKSB7XG4gICAgICAgICAgICBUd2Vlbi51cGRhdGUoKTsgLy90d2VlbuiHquW3seS8muWBmmxlbmd0aOWIpOaWrVxuICAgICAgICAgICAgLy99O1xuICAgICAgICAgICAgdmFyIGN1cnJUYXNrTGlzdCA9IF90YXNrTGlzdDtcbiAgICAgICAgICAgIF90YXNrTGlzdCA9IFtdO1xuICAgICAgICAgICAgX3JlcXVlc3RBaWQgPSBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJUYXNrTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY3VyclRhc2tMaXN0LnNoaWZ0KCkudGFzaygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gX3JlcXVlc3RBaWQ7XG59OyBcblxuLypcbiAqIEBwYXJhbSB0YXNrIOimgeWKoOWFpeWIsOa4suafk+W4p+mYn+WIl+S4reeahOS7u+WKoVxuICogQHJlc3VsdCBmcmFtZWlkXG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdEZyYW1lKCAkZnJhbWUgKSB7XG4gICAgaWYgKCEkZnJhbWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG4gICAgX3Rhc2tMaXN0LnB1c2goJGZyYW1lKTtcbiAgICByZXR1cm4gZW5hYmxlZEFuaW1hdGlvbkZyYW1lKCk7XG59O1xuXG4vKlxuICogIEBwYXJhbSB0YXNrIOimgeS7jua4suafk+W4p+mYn+WIl+S4reWIoOmZpOeahOS7u+WKoVxuICovXG5mdW5jdGlvbiBkZXN0cm95RnJhbWUoICRmcmFtZSApIHtcbiAgICB2YXIgZF9yZXN1bHQgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IF90YXNrTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKF90YXNrTGlzdFtpXS5pZCA9PT0gJGZyYW1lLmlkKSB7XG4gICAgICAgICAgICBkX3Jlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICBfdGFza0xpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgbC0tO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgaWYgKF90YXNrTGlzdC5sZW5ndGggPT0gMCkge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShfcmVxdWVzdEFpZCk7XG4gICAgICAgIF9yZXF1ZXN0QWlkID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBkX3Jlc3VsdDtcbn07XG5cblxuLyogXG4gKiBAcGFyYW0gb3B0IHtmcm9tICwgdG8gLCBvblVwZGF0ZSAsIG9uQ29tcGxldGUgLCAuLi4uLi59XG4gKiBAcmVzdWx0IHR3ZWVuXG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdFR3ZWVuKG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0ID0gXy5leHRlbmQoe1xuICAgICAgICBmcm9tOiBudWxsLFxuICAgICAgICB0bzogbnVsbCxcbiAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKXt9LFxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgb25TdG9wOiBmdW5jdGlvbigpe30sXG4gICAgICAgIHJlcGVhdDogMCxcbiAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgIGVhc2luZzogJ0xpbmVhci5Ob25lJyxcbiAgICAgICAgZGVzYzogJycgLy/liqjnlLvmj4/ov7DvvIzmlrnkvr/mn6Xmib5idWdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciB0d2VlbiA9IHt9O1xuICAgIHZhciB0aWQgPSBcInR3ZWVuX1wiICsgVXRpbHMuZ2V0VUlEKCk7XG4gICAgb3B0LmlkICYmICggdGlkID0gdGlkK1wiX1wiK29wdC5pZCApO1xuXG4gICAgaWYgKG9wdC5mcm9tICYmIG9wdC50bykge1xuICAgICAgICB0d2VlbiA9IG5ldyBUd2Vlbi5Ud2Vlbiggb3B0LmZyb20gKVxuICAgICAgICAudG8oIG9wdC50bywgb3B0LmR1cmF0aW9uIClcbiAgICAgICAgLm9uU3RhcnQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG9wdC5vblN0YXJ0LmFwcGx5KCB0aGlzIClcbiAgICAgICAgfSlcbiAgICAgICAgLm9uVXBkYXRlKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgb3B0Lm9uVXBkYXRlLmFwcGx5KCB0aGlzICk7XG4gICAgICAgIH0gKVxuICAgICAgICAub25Db21wbGV0ZSggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZXN0cm95RnJhbWUoe1xuICAgICAgICAgICAgICAgIGlkOiB0aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHdlZW4uX2lzQ29tcGxldGVlZCA9IHRydWU7XG4gICAgICAgICAgICBvcHQub25Db21wbGV0ZS5hcHBseSggdGhpcyAsIFt0aGlzXSApOyAvL+aJp+ihjOeUqOaIt+eahGNvbkNvbXBsZXRlXG4gICAgICAgIH0gKVxuICAgICAgICAub25TdG9wKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZGVzdHJveUZyYW1lKHtcbiAgICAgICAgICAgICAgICBpZDogdGlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR3ZWVuLl9pc1N0b3BlZCA9IHRydWU7XG4gICAgICAgICAgICBvcHQub25TdG9wLmFwcGx5KCB0aGlzICwgW3RoaXNdICk7XG4gICAgICAgIH0gKVxuICAgICAgICAucmVwZWF0KCBvcHQucmVwZWF0IClcbiAgICAgICAgLmRlbGF5KCBvcHQuZGVsYXkgKVxuICAgICAgICAuZWFzaW5nKCBUd2Vlbi5FYXNpbmdbb3B0LmVhc2luZy5zcGxpdChcIi5cIilbMF1dW29wdC5lYXNpbmcuc3BsaXQoXCIuXCIpWzFdXSApXG4gICAgICAgIFxuICAgICAgICB0d2Vlbi5pZCA9IHRpZDtcbiAgICAgICAgdHdlZW4uc3RhcnQoKTtcblxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xuXG4gICAgICAgICAgICBpZiAoIHR3ZWVuLl9pc0NvbXBsZXRlZWQgfHwgdHdlZW4uX2lzU3RvcGVkICkge1xuICAgICAgICAgICAgICAgIHR3ZWVuID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVnaXN0RnJhbWUoe1xuICAgICAgICAgICAgICAgIGlkOiB0aWQsXG4gICAgICAgICAgICAgICAgdGFzazogYW5pbWF0ZSxcbiAgICAgICAgICAgICAgICBkZXNjOiBvcHQuZGVzYyxcbiAgICAgICAgICAgICAgICB0d2VlbjogdHdlZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBhbmltYXRlKCk7XG5cbiAgICB9O1xuICAgIHJldHVybiB0d2Vlbjtcbn07XG4vKlxuICogQHBhcmFtIHR3ZWVuXG4gKiBAcmVzdWx0IHZvaWQoMClcbiAqL1xuZnVuY3Rpb24gZGVzdHJveVR3ZWVuKHR3ZWVuICwgbXNnKSB7XG4gICAgdHdlZW4uc3RvcCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlZ2lzdEZyYW1lOiByZWdpc3RGcmFtZSxcbiAgICBkZXN0cm95RnJhbWU6IGRlc3Ryb3lGcmFtZSxcbiAgICByZWdpc3RUd2VlbjogcmVnaXN0VHdlZW4sXG4gICAgZGVzdHJveVR3ZWVuOiBkZXN0cm95VHdlZW5cbn07IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5bGe5oCn5bel5Y6C77yMaWXkuIvpnaLnlKhWQlPmj5DkvpvmlK/mjIFcbiAqIOadpee7meaVtOS4quW8leaTjuaPkOS+m+W/g+i3s+WMheeahOinpuWPkeacuuWItlxuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vL+WumuS5ieWwgeijheWlveeahOWFvOWuueWkp+mDqOWIhua1j+iniOWZqOeahGRlZmluZVByb3BlcnRpZXMg55qEIOWxnuaAp+W3peWOglxudmFyIHVud2F0Y2hPbmUgPSB7XG4gICAgXCIkc2tpcEFycmF5XCIgOiAwLFxuICAgIFwiJHdhdGNoXCIgICAgIDogMSxcbiAgICBcIiRmaXJlXCIgICAgICA6IDIsLy/kuLvopoHmmK9nZXQgc2V0IOaYvuaAp+iuvue9rueahCDop6blj5FcbiAgICBcIiRtb2RlbFwiICAgICA6IDMsXG4gICAgXCIkYWNjZXNzb3JcIiAgOiA0LFxuICAgIFwiJG93bmVyXCIgICAgIDogNSxcbiAgICAvL1wicGF0aFwiICAgICAgIDogNiwgLy/ov5nkuKrlupTor6XmmK/llK/kuIDkuIDkuKrkuI3nlKh3YXRjaOeahOS4jeW4piTnmoTmiJDlkZjkuoblkKfvvIzlm6DkuLrlnLDlm77nrYnnmoRwYXRo5piv5Zyo5aSq5aSnXG4gICAgXCIkcGFyZW50XCIgICAgOiA3ICAvL+eUqOS6juW7uueri+aVsOaNrueahOWFs+ezu+mTvlxufVxuXG5mdW5jdGlvbiBPYnNlcnZlKHNjb3BlLCBtb2RlbCwgd2F0Y2hNb3JlKSB7XG5cbiAgICB2YXIgc3RvcFJlcGVhdEFzc2lnbj10cnVlO1xuXG4gICAgdmFyIHNraXBBcnJheSA9IHNjb3BlLiRza2lwQXJyYXksIC8v6KaB5b+955Wl55uR5o6n55qE5bGe5oCn5ZCN5YiX6KGoXG4gICAgICAgIHBtb2RlbCA9IHt9LCAvL+imgei/lOWbnueahOWvueixoVxuICAgICAgICBhY2Nlc3NvcmVzID0ge30sIC8v5YaF6YOo55So5LqO6L2s5o2i55qE5a+56LGhXG4gICAgICAgIFZCUHVibGljcyA9IF8ua2V5cyggdW53YXRjaE9uZSApOyAvL+eUqOS6jklFNi04XG5cbiAgICAgICAgbW9kZWwgPSBtb2RlbCB8fCB7fTsvL+i/meaYr3Btb2RlbOS4iueahCRtb2RlbOWxnuaAp1xuICAgICAgICB3YXRjaE1vcmUgPSB3YXRjaE1vcmUgfHwge307Ly/ku6Uk5byA5aS05L2G6KaB5by65Yi255uR5ZCs55qE5bGe5oCnXG4gICAgICAgIHNraXBBcnJheSA9IF8uaXNBcnJheShza2lwQXJyYXkpID8gc2tpcEFycmF5LmNvbmNhdChWQlB1YmxpY3MpIDogVkJQdWJsaWNzO1xuXG4gICAgZnVuY3Rpb24gbG9vcChuYW1lLCB2YWwpIHtcbiAgICAgICAgaWYgKCAhdW53YXRjaE9uZVtuYW1lXSB8fCAodW53YXRjaE9uZVtuYW1lXSAmJiBuYW1lLmNoYXJBdCgwKSAhPT0gXCIkXCIpICkge1xuICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSB2YWxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgICAgIGlmICh2YWx1ZVR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgaWYoIXVud2F0Y2hPbmVbbmFtZV0pe1xuICAgICAgICAgICAgICBWQlB1YmxpY3MucHVzaChuYW1lKSAvL+WHveaVsOaXoOmcgOimgei9rOaNolxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF8uaW5kZXhPZihza2lwQXJyYXksbmFtZSkgIT09IC0xIHx8IChuYW1lLmNoYXJBdCgwKSA9PT0gXCIkXCIgJiYgIXdhdGNoTW9yZVtuYW1lXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVkJQdWJsaWNzLnB1c2gobmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhY2Nlc3NvciA9IGZ1bmN0aW9uKG5lbykgeyAvL+WIm+W7uuebkeaOp+WxnuaAp+aIluaVsOe7hO+8jOiHquWPmOmHj++8jOeUseeUqOaIt+inpuWPkeWFtuaUueWPmFxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFjY2Vzc29yLnZhbHVlLCBwcmVWYWx1ZSA9IHZhbHVlLCBjb21wbGV4VmFsdWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/lhpnmk43kvZxcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQg55qEIOWAvOeahCDnsbvlnotcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5lb1R5cGUgPSB0eXBlb2YgbmVvO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9wUmVwZWF0QXNzaWduKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLy/pmLvmraLph43lpI3otYvlgLxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG5lbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG5lbyAmJiBuZW9UeXBlID09PSBcIm9iamVjdFwiICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEobmVvIGluc3RhbmNlb2YgQXJyYXkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIW5lby5hZGRDb2xvclN0b3AgLy8gbmVvIGluc3RhbmNlb2YgQ2FudmFzR3JhZGllbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmVvLiRtb2RlbCA/IG5lbyA6IE9ic2VydmUobmVvICwgbmVvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV4VmFsdWUgPSB2YWx1ZS4kbW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugey8v5aaC5p6c5piv5YW25LuW5pWw5o2u57G75Z6LXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiggbmVvVHlwZSA9PT0gXCJhcnJheVwiICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgdmFsdWUgPSBfLmNsb25lKG5lbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5lb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsW25hbWVdID0gY29tcGxleFZhbHVlID8gY29tcGxleFZhbHVlIDogdmFsdWU7Ly/mm7TmlrAkbW9kZWzkuK3nmoTlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29tcGxleFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG1vZGVsLiRmaXJlICYmIHBtb2RlbC4kZmlyZShuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZVR5cGUgIT0gbmVvVHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpoLmnpxzZXTnmoTlgLznsbvlnovlt7Lnu4/mlLnlj5jvvIxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOS5n+imgeaKiuWvueW6lOeahHZhbHVlVHlwZeS/ruaUueS4uuWvueW6lOeahG5lb1R5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGUgPSBuZW9UeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1dhdGNoTW9kZWwgPSBwbW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aJgOacieeahOi1i+WAvOmDveimgeinpuWPkXdhdGNo55qE55uR5ZCs5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoICFwbW9kZWwuJHdhdGNoICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSggaGFzV2F0Y2hNb2RlbC4kcGFyZW50ICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhdGNoTW9kZWwgPSBoYXNXYXRjaE1vZGVsLiRwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggaGFzV2F0Y2hNb2RlbC4kd2F0Y2ggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhdGNoTW9kZWwuJHdhdGNoLmNhbGwoaGFzV2F0Y2hNb2RlbCAsIG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL+ivu+aTjeS9nFxuICAgICAgICAgICAgICAgICAgICAvL+ivu+eahOaXtuWAme+8jOWPkeeOsHZhbHVl5piv5Liqb2Jq77yM6ICM5LiU6L+Y5rKh5pyJZGVmaW5lUHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgLy/pgqPkuYjlsLHkuLTml7ZkZWZpbmVQcm9wZXJ0eeS4gOasoVxuICAgICAgICAgICAgICAgICAgICBpZiAoIHZhbHVlICYmICh2YWx1ZVR5cGUgPT09IFwib2JqZWN0XCIpIFxuICAgICAgICAgICAgICAgICAgICAgICAmJiAhKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIFxuICAgICAgICAgICAgICAgICAgICAgICAmJiAhdmFsdWUuJG1vZGVsXG4gICAgICAgICAgICAgICAgICAgICAgICYmICF2YWx1ZS5hZGRDb2xvclN0b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5bu656uL5ZKM54i25pWw5o2u6IqC54K555qE5YWz57O7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS4kcGFyZW50ID0gcG1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBPYnNlcnZlKHZhbHVlICwgdmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FjY2Vzc29yLnZhbHVlIOmHjeaWsOWkjeWItuS4umRlZmluZVByb3BlcnR56L+H5ZCO55qE5a+56LGhXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWNjZXNzb3IudmFsdWUgPSB2YWw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFjY2Vzc29yZXNbbmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgc2V0OiBhY2Nlc3NvcixcbiAgICAgICAgICAgICAgICBnZXQ6IGFjY2Vzc29yLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgZm9yICh2YXIgaSBpbiBzY29wZSkge1xuICAgICAgICBsb29wKGksIHNjb3BlW2ldKVxuICAgIH07XG5cbiAgICBwbW9kZWwgPSBkZWZpbmVQcm9wZXJ0aWVzKHBtb2RlbCwgYWNjZXNzb3JlcywgVkJQdWJsaWNzKTsvL+eUn+aIkOS4gOS4quepuueahFZpZXdNb2RlbFxuXG4gICAgXy5mb3JFYWNoKFZCUHVibGljcyxmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGlmIChzY29wZVtuYW1lXSkgey8v5YWI5Li65Ye95pWw562J5LiN6KKr55uR5o6n55qE5bGe5oCn6LWL5YC8XG4gICAgICAgICAgICBpZih0eXBlb2Ygc2NvcGVbbmFtZV0gPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICAgICAgICAgICBwbW9kZWxbbmFtZV0gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgc2NvcGVbbmFtZV0uYXBwbHkodGhpcyAsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgcG1vZGVsW25hbWVdID0gc2NvcGVbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHBtb2RlbC4kbW9kZWwgPSBtb2RlbDtcbiAgICBwbW9kZWwuJGFjY2Vzc29yID0gYWNjZXNzb3JlcztcblxuICAgIHBtb2RlbC5oYXNPd25Qcm9wZXJ0eSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gcG1vZGVsLiRtb2RlbFxuICAgIH07XG5cbiAgICBzdG9wUmVwZWF0QXNzaWduID0gZmFsc2U7XG5cbiAgICByZXR1cm4gcG1vZGVsXG59XG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcbiAgICAvL+WmguaenOa1j+iniOWZqOS4jeaUr+aMgWVjbWEyNjJ2NeeahE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVz5oiW6ICF5a2Y5ZyoQlVH77yM5q+U5aaCSUU4XG4gICAgLy/moIflh4bmtY/op4jlmajkvb/nlKhfX2RlZmluZUdldHRlcl9fLCBfX2RlZmluZVNldHRlcl9f5a6e546wXG4gICAgdHJ5IHtcbiAgICAgICAgZGVmaW5lUHJvcGVydHkoe30sIFwiX1wiLCB7XG4gICAgICAgICAgICB2YWx1ZTogXCJ4XCJcbiAgICAgICAgfSlcbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllc1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKFwiX19kZWZpbmVHZXR0ZXJfX1wiIGluIE9iamVjdCkge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbihvYmosIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IGRlc2MudmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCdnZXQnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9fZGVmaW5lR2V0dGVyX18ocHJvcCwgZGVzYy5nZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgnc2V0JyBpbiBkZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5fX2RlZmluZVNldHRlcl9fKHByb3AsIGRlc2Muc2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKG9iaiwgZGVzY3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGRlc2NzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjc1twcm9wXSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuLy9JRTYtOOS9v+eUqFZCU2NyaXB057G755qEc2V0IGdldOivreWPpeWunueOsFxuaWYgKCFkZWZpbmVQcm9wZXJ0aWVzICYmIHdpbmRvdy5WQkFycmF5KSB7XG4gICAgd2luZG93LmV4ZWNTY3JpcHQoW1xuICAgICAgICAgICAgXCJGdW5jdGlvbiBwYXJzZVZCKGNvZGUpXCIsXG4gICAgICAgICAgICBcIlxcdEV4ZWN1dGVHbG9iYWwoY29kZSlcIixcbiAgICAgICAgICAgIFwiRW5kIEZ1bmN0aW9uXCJcbiAgICAgICAgICAgIF0uam9pbihcIlxcblwiKSwgXCJWQlNjcmlwdFwiKTtcblxuICAgIGZ1bmN0aW9uIFZCTWVkaWF0b3IoZGVzY3JpcHRpb24sIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBmbiA9IGRlc2NyaXB0aW9uW25hbWVdICYmIGRlc2NyaXB0aW9uW25hbWVdLnNldDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIGZuKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmbigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24ocHVibGljcywgZGVzY3JpcHRpb24sIGFycmF5KSB7XG4gICAgICAgIHB1YmxpY3MgPSBhcnJheS5zbGljZSgwKTtcbiAgICAgICAgcHVibGljcy5wdXNoKFwiaGFzT3duUHJvcGVydHlcIik7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBcIlZCQ2xhc3NcIiArIHNldFRpbWVvdXQoXCIxXCIpLCBvd25lciA9IHt9LCBidWZmZXIgPSBbXTtcbiAgICAgICAgYnVmZmVyLnB1c2goXG4gICAgICAgICAgICAgICAgXCJDbGFzcyBcIiArIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICBcIlxcdFByaXZhdGUgW19fZGF0YV9fXSwgW19fcHJveHlfX11cIixcbiAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBEZWZhdWx0IEZ1bmN0aW9uIFtfX2NvbnN0X19dKGQsIHApXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRcXHRTZXQgW19fZGF0YV9fXSA9IGQ6IHNldCBbX19wcm94eV9fXSA9IHBcIixcbiAgICAgICAgICAgICAgICBcIlxcdFxcdFNldCBbX19jb25zdF9fXSA9IE1lXCIsIC8v6ZO+5byP6LCD55SoXG4gICAgICAgICAgICAgICAgXCJcXHRFbmQgRnVuY3Rpb25cIik7XG4gICAgICAgIF8uZm9yRWFjaChwdWJsaWNzLGZ1bmN0aW9uKG5hbWUpIHsgLy/mt7vliqDlhazlhbHlsZ7mgKcs5aaC5p6c5q2k5pe25LiN5Yqg5Lul5ZCO5bCx5rKh5py65Lya5LqGXG4gICAgICAgICAgICBpZiAob3duZXJbbmFtZV0gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBvd25lcltuYW1lXSA9IHRydWUgLy/lm6DkuLpWQlNjcmlwdOWvueixoeS4jeiDveWDj0pT6YKj5qC36ZqP5oSP5aKe5Yig5bGe5oCnXG4gICAgICAgICAgICBidWZmZXIucHVzaChcIlxcdFB1YmxpYyBbXCIgKyBuYW1lICsgXCJdXCIpIC8v5L2g5Y+v5Lul6aKE5YWI5pS+5Yiwc2tpcEFycmF55LitXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBvd25lcltuYW1lXSA9IHRydWVcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sx5LqO5LiN55+l5a+55pa55Lya5Lyg5YWl5LuA5LmILOWboOatpHNldCwgbGV06YO955So5LiKXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBQcm9wZXJ0eSBMZXQgW1wiICsgbmFtZSArIFwiXSh2YWwpXCIsIC8vc2V0dGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdENhbGwgW19fcHJveHlfX10oW19fZGF0YV9fXSwgXFxcIlwiICsgbmFtZSArIFwiXFxcIiwgdmFsKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgUHJvcGVydHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIFByb3BlcnR5IFNldCBbXCIgKyBuYW1lICsgXCJdKHZhbClcIiwgLy9zZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0Q2FsbCBbX19wcm94eV9fXShbX19kYXRhX19dLCBcXFwiXCIgKyBuYW1lICsgXCJcXFwiLCB2YWwpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBQcm9wZXJ0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgUHJvcGVydHkgR2V0IFtcIiArIG5hbWUgKyBcIl1cIiwgLy9nZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0T24gRXJyb3IgUmVzdW1lIE5leHRcIiwgLy/lv4XpobvkvJjlhYjkvb/nlKhzZXTor63lj6Us5ZCm5YiZ5a6D5Lya6K+v5bCG5pWw57uE5b2T5a2X56ym5Liy6L+U5ZueXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdFNldFtcIiArIG5hbWUgKyBcIl0gPSBbX19wcm94eV9fXShbX19kYXRhX19dLFxcXCJcIiArIG5hbWUgKyBcIlxcXCIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdElmIEVyci5OdW1iZXIgPD4gMCBUaGVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFxcdFtcIiArIG5hbWUgKyBcIl0gPSBbX19wcm94eV9fXShbX19kYXRhX19dLFxcXCJcIiArIG5hbWUgKyBcIlxcXCIpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBJZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRPbiBFcnJvciBHb3RvIDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIFByb3BlcnR5XCIpXG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyLnB1c2goXCJFbmQgQ2xhc3NcIik7IC8v57G75a6a5LmJ5a6M5q+VXG4gICAgICAgIGJ1ZmZlci5wdXNoKFxuICAgICAgICAgICAgICAgIFwiRnVuY3Rpb24gXCIgKyBjbGFzc05hbWUgKyBcIkZhY3RvcnkoYSwgYilcIiwgLy/liJvlu7rlrp7kvovlubbkvKDlhaXkuKTkuKrlhbPplK7nmoTlj4LmlbBcbiAgICAgICAgICAgICAgICBcIlxcdERpbSBvXCIsXG4gICAgICAgICAgICAgICAgXCJcXHRTZXQgbyA9IChOZXcgXCIgKyBjbGFzc05hbWUgKyBcIikoYSwgYilcIixcbiAgICAgICAgICAgICAgICBcIlxcdFNldCBcIiArIGNsYXNzTmFtZSArIFwiRmFjdG9yeSA9IG9cIixcbiAgICAgICAgICAgICAgICBcIkVuZCBGdW5jdGlvblwiKTtcbiAgICAgICAgd2luZG93LnBhcnNlVkIoYnVmZmVyLmpvaW4oXCJcXHJcXG5cIikpOy8v5YWI5Yib5bu65LiA5LiqVkLnsbvlt6XljoJcbiAgICAgICAgcmV0dXJuICB3aW5kb3dbY2xhc3NOYW1lICsgXCJGYWN0b3J5XCJdKGRlc2NyaXB0aW9uLCBWQk1lZGlhdG9yKTsvL+W+l+WIsOWFtuS6p+WTgVxuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IE9ic2VydmU7XG5cbiIsIlxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBfX1ZFUlNJT05fXztcblxuZXhwb3J0IGNvbnN0IFBJXzIgPSBNYXRoLlBJICogMjtcblxuZXhwb3J0IGNvbnN0IFJBRF9UT19ERUcgPSAxODAgLyBNYXRoLlBJO1xuXG5leHBvcnQgY29uc3QgREVHX1RPX1JBRCA9IE1hdGguUEkgLyAxODA7XG5cbmV4cG9ydCBjb25zdCBSRU5ERVJFUl9UWVBFID0ge1xuICAgIFVOS05PV046ICAgIDAsXG4gICAgV0VCR0w6ICAgICAgMSxcbiAgICBDQU5WQVM6ICAgICAyLFxufTtcblxuZXhwb3J0IGNvbnN0IERSQVdfTU9ERVMgPSB7XG4gICAgUE9JTlRTOiAgICAgICAgIDAsXG4gICAgTElORVM6ICAgICAgICAgIDEsXG4gICAgTElORV9MT09QOiAgICAgIDIsXG4gICAgTElORV9TVFJJUDogICAgIDMsXG4gICAgVFJJQU5HTEVTOiAgICAgIDQsXG4gICAgVFJJQU5HTEVfU1RSSVA6IDUsXG4gICAgVFJJQU5HTEVfRkFOOiAgIDYsXG59O1xuXG5leHBvcnQgY29uc3QgU0hBUEVTID0ge1xuICAgIFBPTFk6IDAsXG4gICAgUkVDVDogMSxcbiAgICBDSVJDOiAyLFxuICAgIEVMSVA6IDMsXG4gICAgUlJFQzogNCxcbn07XG5cbmV4cG9ydCBjb25zdCBDT05URVhUX0RFRkFVTFQgPSB7XG4gICAgd2lkdGggICAgICAgICA6IDAsXG4gICAgaGVpZ2h0ICAgICAgICA6IDAsXG4gICAgeCAgICAgICAgICAgICA6IDAsXG4gICAgeSAgICAgICAgICAgICA6IDAsXG4gICAgc2NhbGVYICAgICAgICA6IDEsXG4gICAgc2NhbGVZICAgICAgICA6IDEsXG4gICAgc2NhbGVPcmlnaW4gICA6IHtcbiAgICAgICAgeCA6IDAsXG4gICAgICAgIHkgOiAwXG4gICAgfSxcbiAgICByb3RhdGlvbiAgICAgIDogMCxcbiAgICByb3RhdGVPcmlnaW4gIDogIHtcbiAgICAgICAgeCA6IDAsXG4gICAgICAgIHkgOiAwXG4gICAgfSxcbiAgICB2aXNpYmxlICAgICAgIDogdHJ1ZSxcbiAgICBjdXJzb3IgICAgICAgIDogXCJkZWZhdWx0XCIsXG4gICAgLy9jYW52YXMgY29udGV4dCAyZCDnmoQg57O757uf5qC35byP44CC55uu5YmN5bCx55+l6YGT6L+Z5LmI5aSaXG4gICAgZmlsbFN0eWxlICAgICA6IG51bGwsLy9cIiMwMDAwMDBcIixcbiAgICBsaW5lQ2FwICAgICAgIDogbnVsbCxcbiAgICBsaW5lSm9pbiAgICAgIDogbnVsbCxcbiAgICBsaW5lV2lkdGggICAgIDogbnVsbCxcbiAgICBtaXRlckxpbWl0ICAgIDogbnVsbCxcbiAgICBzaGFkb3dCbHVyICAgIDogbnVsbCxcbiAgICBzaGFkb3dDb2xvciAgIDogbnVsbCxcbiAgICBzaGFkb3dPZmZzZXRYIDogbnVsbCxcbiAgICBzaGFkb3dPZmZzZXRZIDogbnVsbCxcbiAgICBzdHJva2VTdHlsZSAgIDogbnVsbCxcbiAgICBnbG9iYWxBbHBoYSAgIDogMSxcbiAgICBmb250ICAgICAgICAgIDogbnVsbCxcbiAgICB0ZXh0QWxpZ24gICAgIDogXCJsZWZ0XCIsXG4gICAgdGV4dEJhc2VsaW5lICA6IFwidG9wXCIsIFxuICAgIGFyY1NjYWxlWF8gICAgOiBudWxsLFxuICAgIGFyY1NjYWxlWV8gICAgOiBudWxsLFxuICAgIGxpbmVTY2FsZV8gICAgOiBudWxsLFxuICAgIGdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA6IG51bGxcbn07XG5cblxuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIERpc3BsYXlMaXN0IOeahCDnjrDlrp7lr7nosaHln7rnsbtcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4uL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuaW1wb3J0IE1hdHJpeCBmcm9tIFwiLi4vZ2VvbS9NYXRyaXhcIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IEhpdFRlc3RQb2ludCBmcm9tIFwiLi4vZ2VvbS9IaXRUZXN0UG9pbnRcIjtcbmltcG9ydCBBbmltYXRpb25GcmFtZSBmcm9tIFwiLi4vYW5pbWF0aW9uL0FuaW1hdGlvbkZyYW1lXCI7XG5pbXBvcnQgT2JzZXJ2ZSBmcm9tIFwiLi4vdXRpbHMvb2JzZXJ2ZVwiO1xuaW1wb3J0IHtDT05URVhUX0RFRkFVTFR9IGZyb20gXCIuLi9jb25zdFwiXG5cbnZhciBEaXNwbGF5T2JqZWN0ID0gZnVuY3Rpb24ob3B0KXtcbiAgICBEaXNwbGF5T2JqZWN0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvL+WmguaenOeUqOaIt+ayoeacieS8oOWFpWNvbnRleHTorr7nva7vvIzlsLHpu5jorqTkuLrnqbrnmoTlr7nosaFcbiAgICBvcHQgICAgICA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcblxuICAgIC8v6K6+572u6buY6K6k5bGe5oCnXG4gICAgc2VsZi5pZCAgPSBvcHQuaWQgfHwgbnVsbDtcblxuICAgIC8v55u45a+554i257qn5YWD57Sg55qE55+p6Zi1XG4gICAgc2VsZi5fdHJhbnNmb3JtICAgICAgPSBudWxsO1xuXG4gICAgLy/lv4Pot7PmrKHmlbBcbiAgICBzZWxmLl9oZWFydEJlYXROdW0gICA9IDA7XG5cbiAgICAvL+WFg+e0oOWvueW6lOeahHN0YWdl5YWD57SgXG4gICAgc2VsZi5zdGFnZSAgICAgICAgICAgPSBudWxsO1xuXG4gICAgLy/lhYPntKDnmoTniLblhYPntKBcbiAgICBzZWxmLnBhcmVudCAgICAgICAgICA9IG51bGw7XG5cbiAgICBzZWxmLl9ldmVudEVuYWJsZWQgICA9IGZhbHNlOyAgIC8v5piv5ZCm5ZON5bqU5LqL5Lu25Lqk5LqSLOWcqOa3u+WKoOS6huS6i+S7tuS+puWQrOWQjuS8muiHquWKqOiuvue9ruS4unRydWVcblxuICAgIHNlbGYuZHJhZ0VuYWJsZWQgICAgID0gdHJ1ZSA7Ly9cImRyYWdFbmFibGVkXCIgaW4gb3B0ID8gb3B0LmRyYWdFbmFibGVkIDogZmFsc2U7ICAgLy/mmK/lkKblkK/nlKjlhYPntKDnmoTmi5bmi71cblxuICAgIHNlbGYueHlUb0ludCAgICAgICAgID0gXCJ4eVRvSW50XCIgaW4gb3B0ID8gb3B0Lnh5VG9JbnQgOiB0cnVlOyAgICAvL+aYr+WQpuWvuXh55Z2Q5qCH57uf5LiAaW505aSE55CG77yM6buY6K6k5Li6dHJ1Ze+8jOS9huaYr+acieeahOaXtuWAmeWPr+S7peeUseWklueVjOeUqOaIt+aJi+WKqOaMh+WumuaYr+WQpumcgOimgeiuoeeul+S4umludO+8jOWboOS4uuacieeahOaXtuWAmeS4jeiuoeeul+avlOi+g+Wlve+8jOavlOWmgu+8jOi/m+W6puWbvuihqOS4re+8jOWGjXNlY3RvcueahOS4pOerr+a3u+WKoOS4pOS4quWchuadpeWBmuWchuinkueahOi/m+W6puadoeeahOaXtuWAme+8jOWchmNpcmNsZeS4jeWBmmludOiuoeeul++8jOaJjeiDveWSjHNlY3RvcuabtOWlveeahOihlOaOpVxuXG4gICAgc2VsZi5tb3ZlaW5nICAgICAgICAgPSBmYWxzZTsgLy/lpoLmnpzlhYPntKDlnKjmnIDovajpgZPov5DliqjkuK3nmoTml7blgJnvvIzmnIDlpb3miorov5nkuKrorr7nva7kuLp0cnVl77yM6L+Z5qC36IO95L+d6K+B6L2o6L+555qE5Lid5pCs6aG65ruR77yM5ZCm5YiZ5Zug5Li6eHlUb0ludOeahOWOn+WboO+8jOS8muaciei3s+i3g1xuXG4gICAgLy/liJvlu7rlpb1jb250ZXh0XG4gICAgc2VsZi5fY3JlYXRlQ29udGV4dCggb3B0ICk7XG5cbiAgICB2YXIgVUlEID0gVXRpbHMuY3JlYXRlSWQoc2VsZi50eXBlKTtcblxuICAgIC8v5aaC5p6c5rKh5pyJaWQg5YiZIOayv+eUqHVpZFxuICAgIGlmKHNlbGYuaWQgPT0gbnVsbCl7XG4gICAgICAgIHNlbGYuaWQgPSBVSUQgO1xuICAgIH07XG5cbiAgICBzZWxmLmluaXQuYXBwbHkoc2VsZiAsIGFyZ3VtZW50cyk7XG5cbiAgICAvL+aJgOacieWxnuaAp+WHhuWkh+WlveS6huWQju+8jOWFiOimgeiuoeeul+S4gOasoXRoaXMuX3VwZGF0ZVRyYW5zZm9ybSgp5b6X5YiwX3RhbnNmb3JtXG4gICAgdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCk7XG59O1xuXG5cblxuVXRpbHMuY3JlYXRDbGFzcyggRGlzcGxheU9iamVjdCAsIEV2ZW50RGlzcGF0Y2hlciAsIHtcbiAgICBpbml0IDogZnVuY3Rpb24oKXt9LFxuICAgIF9jcmVhdGVDb250ZXh0IDogZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8v5omA5pyJ5pi+56S65a+56LGh77yM6YO95pyJ5LiA5Liq57G75Ly8Y2FudmFzLmNvbnRleHTnsbvkvLznmoQgY29udGV4dOWxnuaAp1xuICAgICAgICAvL+eUqOadpeWtmOWPluaUueaYvuekuuWvueixoeaJgOacieWSjOaYvuekuuacieWFs+eahOWxnuaAp++8jOWdkOagh++8jOagt+W8j+etieOAglxuICAgICAgICAvL+ivpeWvueixoeS4ukNvZXIuT2JzZXJ2ZSgp5bel5Y6C5Ye95pWw55Sf5oiQXG4gICAgICAgIHNlbGYuY29udGV4dCA9IG51bGw7XG5cbiAgICAgICAgLy/mj5Dkvpvnu5lDb2VyLk9ic2VydmUoKSDmnaUg57uZIHNlbGYuY29udGV4dCDorr7nva4gcHJvcGVydHlzXG4gICAgICAgIC8v6L+Z6YeM5LiN6IO955SoXy5leHRlbmTvvIwg5Zug5Li66KaB5L+d6K+BX2NvbnRleHRBVFRSU+eahOe6r+eyue+8jOWPquimhuebluS4i+mdouW3suacieeahOWxnuaAp1xuICAgICAgICB2YXIgX2NvbnRleHRBVFRSUyA9IFV0aWxzLmNvcHkyY29udGV4dCggXy5jbG9uZShDT05URVhUX0RFRkFVTFQpLCBvcHQuY29udGV4dCAsIHRydWUgKTsgICAgICAgICAgICBcblxuICAgICAgICAvL+eEtuWQjueci+e7p+aJv+iAheaYr+WQpuacieaPkOS+m19jb250ZXh0IOWvueixoSDpnIDopoEg5oiRIG1lcmdl5YiwX2NvbnRleHQyRF9jb250ZXh05Lit5Y6755qEXG4gICAgICAgIGlmIChzZWxmLl9jb250ZXh0KSB7XG4gICAgICAgICAgICBfY29udGV4dEFUVFJTID0gXy5leHRlbmQodHJ1ZSwgX2NvbnRleHRBVFRSUywgc2VsZi5fY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+acieS6m+W8leaTjuWGhemDqOiuvue9rmNvbnRleHTlsZ7mgKfnmoTml7blgJnmmK/kuI3nlKjkuIrmiqXlv4Pot7PnmoTvvIzmr5TlpoLlgZpoaXRUZXN0UG9pbnTng63ngrnmo4DmtYvnmoTml7blgJlcbiAgICAgICAgc2VsZi5fbm90V2F0Y2ggPSBmYWxzZTtcblxuICAgICAgICBfY29udGV4dEFUVFJTLiRvd25lciA9IHNlbGY7XG4gICAgICAgIF9jb250ZXh0QVRUUlMuJHdhdGNoID0gZnVuY3Rpb24obmFtZSAsIHZhbHVlICwgcHJlVmFsdWUpe1xuXG4gICAgICAgICAgICAvL+S4i+mdoueahOi/meS6m+WxnuaAp+WPmOWMlu+8jOmDveS8mumcgOimgemHjeaWsOe7hOe7h+efqemYteWxnuaApyBfdHJhbnNmb3JtIFxuICAgICAgICAgICAgdmFyIHRyYW5zRm9ybVByb3BzID0gWyBcInhcIiAsIFwieVwiICwgXCJzY2FsZVhcIiAsIFwic2NhbGVZXCIgLCBcInJvdGF0aW9uXCIgLCBcInNjYWxlT3JpZ2luXCIgLCBcInJvdGF0ZU9yaWdpbiwgbGluZVdpZHRoXCIgXTtcblxuICAgICAgICAgICAgaWYoIF8uaW5kZXhPZiggdHJhbnNGb3JtUHJvcHMgLCBuYW1lICkgPj0gMCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRvd25lci5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiggdGhpcy4kb3duZXIuX25vdFdhdGNoICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMuJG93bmVyLiR3YXRjaCApe1xuICAgICAgICAgICAgICAgIHRoaXMuJG93bmVyLiR3YXRjaCggbmFtZSAsIHZhbHVlICwgcHJlVmFsdWUgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJG93bmVyLmhlYXJ0QmVhdCgge1xuICAgICAgICAgICAgICAgIGNvbnZlcnRUeXBlOlwiY29udGV4dFwiLFxuICAgICAgICAgICAgICAgIHNoYXBlICAgICAgOiB0aGlzLiRvd25lcixcbiAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogbmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZSAgICAgIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgcHJlVmFsdWUgICA6IHByZVZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5omn6KGMaW5pdOS5i+WJje+8jOW6lOivpeWwseagueaNruWPguaVsO+8jOaKimNvbnRleHTnu4Tnu4flpb3nur9cbiAgICAgICAgc2VsZi5jb250ZXh0ID0gT2JzZXJ2ZSggX2NvbnRleHRBVFRSUyApO1xuICAgIH0sXG4gICAgLyogQG15c2VsZiDmmK/lkKbnlJ/miJDoh6rlt7HnmoTplZzlg48gXG4gICAgICog5YWL6ZqG5Y+I5Lik56eN77yM5LiA56eN5piv6ZWc5YOP77yM5Y+m5aSW5LiA56eN5piv57ud5a+55oSP5LmJ5LiK6Z2i55qE5paw5Liq5L2TXG4gICAgICog6buY6K6k5Li657ud5a+55oSP5LmJ5LiK6Z2i55qE5paw5Liq5L2T77yM5paw5a+56LGhaWTkuI3og73nm7jlkIxcbiAgICAgKiDplZzlg4/ln7rmnKzkuIrmmK/moYbmnrblhoXpg6jlnKjlrp7njrAgIOmVnOWDj+eahGlk55u45ZCMIOS4u+imgeeUqOadpeaKiuiHquW3seeUu+WIsOWPpuWklueahHN0YWdl6YeM6Z2i77yM5q+U5aaCXG4gICAgICogbW91c2VvdmVy5ZKMbW91c2VvdXTnmoTml7blgJnosIPnlKgqL1xuICAgIGNsb25lIDogZnVuY3Rpb24oIG15c2VsZiApe1xuICAgICAgICB2YXIgY29uZiAgID0ge1xuICAgICAgICAgICAgaWQgICAgICA6IHRoaXMuaWQsXG4gICAgICAgICAgICBjb250ZXh0IDogXy5jbG9uZSh0aGlzLmNvbnRleHQuJG1vZGVsKVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBuZXdPYmo7XG4gICAgICAgIGlmKCB0aGlzLnR5cGUgPT0gJ3RleHQnICl7XG4gICAgICAgICAgICBuZXdPYmogPSBuZXcgdGhpcy5jb25zdHJ1Y3RvciggdGhpcy50ZXh0ICwgY29uZiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3T2JqID0gbmV3IHRoaXMuY29uc3RydWN0b3IoIGNvbmYgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0aGlzLmNoaWxkcmVuICl7XG4gICAgICAgICAgICBuZXdPYmouY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFteXNlbGYpe1xuICAgICAgICAgICAgbmV3T2JqLmlkICAgICAgID0gVXRpbHMuY3JlYXRlSWQobmV3T2JqLnR5cGUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbmV3T2JqO1xuICAgIH0sXG4gICAgaGVhcnRCZWF0IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgLy9zdGFnZeWtmOWcqO+8jOaJjeivtHNlbGbku6PooajnmoRkaXNwbGF55bey57uP6KKr5re75Yqg5Yiw5LqGZGlzcGxheUxpc3TkuK3vvIznu5jlm77lvJXmk47pnIDopoHnn6XpgZPlhbbmlLnlj5jlkI5cbiAgICAgICAgLy/nmoTlsZ7mgKfvvIzmiYDku6XvvIzpgJrnn6XliLBzdGFnZS5kaXNwbGF5QXR0ckhhc0NoYW5nZVxuICAgICAgICB2YXIgc3RhZ2UgPSB0aGlzLmdldFN0YWdlKCk7XG4gICAgICAgIGlmKCBzdGFnZSApe1xuICAgICAgICAgICAgdGhpcy5faGVhcnRCZWF0TnVtICsrO1xuICAgICAgICAgICAgc3RhZ2UuaGVhcnRCZWF0ICYmIHN0YWdlLmhlYXJ0QmVhdCggb3B0ICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldEN1cnJlbnRXaWR0aCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuY29udGV4dC53aWR0aCAqIHRoaXMuY29udGV4dC5zY2FsZVgpO1xuICAgIH0sXG4gICAgZ2V0Q3VycmVudEhlaWdodCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuY29udGV4dC5oZWlnaHQgKiB0aGlzLmNvbnRleHQuc2NhbGVZKTtcbiAgICB9LFxuICAgIGdldFN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMuc3RhZ2UgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFnZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHAgPSB0aGlzO1xuICAgICAgICBpZiAocC50eXBlICE9IFwic3RhZ2VcIil7XG4gICAgICAgICAgd2hpbGUocC5wYXJlbnQpIHtcbiAgICAgICAgICAgIHAgPSBwLnBhcmVudDtcbiAgICAgICAgICAgIGlmIChwLnR5cGUgPT0gXCJzdGFnZVwiKXtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAocC50eXBlICE9PSBcInN0YWdlXCIpIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5b6X5Yiw55qE6aG254K5ZGlzcGxheSDnmoR0eXBl5LiN5pivU3RhZ2Us5Lmf5bCx5piv6K+05LiN5pivc3RhZ2XlhYPntKBcbiAgICAgICAgICAgIC8v6YKj5LmI5Y+q6IO96K+05piO6L+Z5LiqcOaJgOS7o+ihqOeahOmhtuerr2Rpc3BsYXkg6L+Y5rKh5pyJ5re75Yqg5YiwZGlzcGxheUxpc3TkuK3vvIzkuZ/lsLHmmK/msqHmnInmsqHmt7vliqDliLBcbiAgICAgICAgICAgIC8vc3RhZ2XoiJ7lj7DnmoRjaGlsZGVu6Zif5YiX5Lit77yM5LiN5Zyo5byV5pOO5riy5p+T6IyD5Zu05YaFXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICAvL+S4gOebtOWbnua6r+WIsOmhtuWxgm9iamVjdO+8jCDljbPmmK9zdGFnZe+8jCBzdGFnZeeahHBhcmVudOS4um51bGxcbiAgICAgICAgdGhpcy5zdGFnZSA9IHA7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH0sXG4gICAgbG9jYWxUb0dsb2JhbCA6IGZ1bmN0aW9uKCBwb2ludCAsIGNvbnRhaW5lciApe1xuICAgICAgICAhcG9pbnQgJiYgKCBwb2ludCA9IG5ldyBQb2ludCggMCAsIDAgKSApO1xuICAgICAgICB2YXIgY20gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCggY29udGFpbmVyICk7XG5cbiAgICAgICAgaWYgKGNtID09IG51bGwpIHJldHVybiBQb2ludCggMCAsIDAgKTtcbiAgICAgICAgdmFyIG0gPSBuZXcgTWF0cml4KDEsIDAsIDAsIDEsIHBvaW50LnggLCBwb2ludC55KTtcbiAgICAgICAgbS5jb25jYXQoY20pO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCBtLnR4ICwgbS50eSApOyAvL3t4Om0udHgsIHk6bS50eX07XG4gICAgfSxcbiAgICBnbG9iYWxUb0xvY2FsIDogZnVuY3Rpb24oIHBvaW50ICwgY29udGFpbmVyKSB7XG4gICAgICAgICFwb2ludCAmJiAoIHBvaW50ID0gbmV3IFBvaW50KCAwICwgMCApICk7XG5cbiAgICAgICAgaWYoIHRoaXMudHlwZSA9PSBcInN0YWdlXCIgKXtcbiAgICAgICAgICAgIHJldHVybiBwb2ludDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY20gPSB0aGlzLmdldENvbmNhdGVuYXRlZE1hdHJpeCggY29udGFpbmVyICk7XG5cbiAgICAgICAgaWYgKGNtID09IG51bGwpIHJldHVybiBuZXcgUG9pbnQoIDAgLCAwICk7IC8ve3g6MCwgeTowfTtcbiAgICAgICAgY20uaW52ZXJ0KCk7XG4gICAgICAgIHZhciBtID0gbmV3IE1hdHJpeCgxLCAwLCAwLCAxLCBwb2ludC54ICwgcG9pbnQueSk7XG4gICAgICAgIG0uY29uY2F0KGNtKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCggbS50eCAsIG0udHkgKTsgLy97eDptLnR4LCB5Om0udHl9O1xuICAgIH0sXG4gICAgbG9jYWxUb1RhcmdldCA6IGZ1bmN0aW9uKCBwb2ludCAsIHRhcmdldCl7XG4gICAgICAgIHZhciBwID0gbG9jYWxUb0dsb2JhbCggcG9pbnQgKTtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5nbG9iYWxUb0xvY2FsKCBwICk7XG4gICAgfSxcbiAgICBnZXRDb25jYXRlbmF0ZWRNYXRyaXggOiBmdW5jdGlvbiggY29udGFpbmVyICl7XG4gICAgICAgIHZhciBjbSA9IG5ldyBNYXRyaXgoKTtcbiAgICAgICAgZm9yICh2YXIgbyA9IHRoaXM7IG8gIT0gbnVsbDsgbyA9IG8ucGFyZW50KSB7XG4gICAgICAgICAgICBjbS5jb25jYXQoIG8uX3RyYW5zZm9ybSApO1xuICAgICAgICAgICAgaWYoICFvLnBhcmVudCB8fCAoIGNvbnRhaW5lciAmJiBvLnBhcmVudCAmJiBvLnBhcmVudCA9PSBjb250YWluZXIgKSB8fCAoIG8ucGFyZW50ICYmIG8ucGFyZW50LnR5cGU9PVwic3RhZ2VcIiApICkge1xuICAgICAgICAgICAgLy9pZiggby50eXBlID09IFwic3RhZ2VcIiB8fCAoby5wYXJlbnQgJiYgY29udGFpbmVyICYmIG8ucGFyZW50LnR5cGUgPT0gY29udGFpbmVyLnR5cGUgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY207Ly9icmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY207XG4gICAgfSxcbiAgICAvKlxuICAgICAq6K6+572u5YWD57Sg55qE5piv5ZCm5ZON5bqU5LqL5Lu25qOA5rWLXG4gICAgICpAYm9vbCAgQm9vbGVhbiDnsbvlnotcbiAgICAgKi9cbiAgICBzZXRFdmVudEVuYWJsZSA6IGZ1bmN0aW9uKCBib29sICl7XG4gICAgICAgIGlmKF8uaXNCb29sZWFuKGJvb2wpKXtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50RW5hYmxlZCA9IGJvb2xcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvKlxuICAgICAq5p+l6K+i6Ieq5bex5ZyocGFyZW5055qE6Zif5YiX5Lit55qE5L2N572uXG4gICAgICovXG4gICAgZ2V0SW5kZXggICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF8uaW5kZXhPZih0aGlzLnBhcmVudC5jaGlsZHJlbiAsIHRoaXMpXG4gICAgfSxcbiAgICAvKlxuICAgICAq5YWD57Sg5Zyoeui9tOaWueWQkeWQkeS4i+enu+WKqFxuICAgICAqQG51bSDnp7vliqjnmoTlsYLnuqdcbiAgICAgKi9cbiAgICB0b0JhY2sgOiBmdW5jdGlvbiggbnVtICl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnJvbUluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xuICAgICAgICB2YXIgdG9JbmRleCA9IDA7XG4gICAgICAgIFxuICAgICAgICBpZihfLmlzTnVtYmVyKCBudW0gKSl7XG4gICAgICAgICAgaWYoIG51bSA9PSAwICl7XG4gICAgICAgICAgICAgLy/ljp/lnLDkuI3liqhcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0b0luZGV4ID0gZnJvbUluZGV4IC0gbnVtO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZSggZnJvbUluZGV4ICwgMSApWzBdO1xuICAgICAgICBpZiggdG9JbmRleCA8IDAgKXtcbiAgICAgICAgICAgIHRvSW5kZXggPSAwO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZEF0KCBtZSAsIHRvSW5kZXggKTtcbiAgICB9LFxuICAgIC8qXG4gICAgICrlhYPntKDlnKh66L205pa55ZCR5ZCR5LiK56e75YqoXG4gICAgICpAbnVtIOenu+WKqOeahOWxguaVsOmHjyDpu5jorqTliLDpobbnq69cbiAgICAgKi9cbiAgICB0b0Zyb250IDogZnVuY3Rpb24oIG51bSApe1xuICAgICAgICBpZighdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZyb21JbmRleCA9IHRoaXMuZ2V0SW5kZXgoKTtcbiAgICAgICAgdmFyIHBjbCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgdmFyIHRvSW5kZXggPSBwY2w7XG4gICAgICAgIFxuICAgICAgICBpZihfLmlzTnVtYmVyKCBudW0gKSl7XG4gICAgICAgICAgaWYoIG51bSA9PSAwICl7XG4gICAgICAgICAgICAgLy/ljp/lnLDkuI3liqhcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvSW5kZXggPSBmcm9tSW5kZXggKyBudW0gKyAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZSggZnJvbUluZGV4ICwgMSApWzBdO1xuICAgICAgICBpZih0b0luZGV4ID4gcGNsKXtcbiAgICAgICAgICAgIHRvSW5kZXggPSBwY2w7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGRBdCggbWUgLCB0b0luZGV4LTEgKTtcbiAgICB9LFxuICAgIF91cGRhdGVUcmFuc2Zvcm0gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgTWF0cml4KCk7XG4gICAgICAgIF90cmFuc2Zvcm0uaWRlbnRpdHkoKTtcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIC8v5piv5ZCm6ZyA6KaBVHJhbnNmb3JtXG4gICAgICAgIGlmKGNvbnRleHQuc2NhbGVYICE9PSAxIHx8IGNvbnRleHQuc2NhbGVZICE9PTEgKXtcbiAgICAgICAgICAgIC8v5aaC5p6c5pyJ57yp5pS+XG4gICAgICAgICAgICAvL+e8qeaUvueahOWOn+eCueWdkOagh1xuICAgICAgICAgICAgdmFyIG9yaWdpbiA9IG5ldyBQb2ludChjb250ZXh0LnNjYWxlT3JpZ2luKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCAtb3JpZ2luLnggLCAtb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoIGNvbnRleHQuc2NhbGVYICwgY29udGV4dC5zY2FsZVkgKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCBvcmlnaW4ueCAsIG9yaWdpbi55ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciByb3RhdGlvbiA9IGNvbnRleHQucm90YXRpb247XG4gICAgICAgIGlmKCByb3RhdGlvbiApe1xuICAgICAgICAgICAgLy/lpoLmnpzmnInml4vovaxcbiAgICAgICAgICAgIC8v5peL6L2s55qE5Y6f54K55Z2Q5qCHXG4gICAgICAgICAgICB2YXIgb3JpZ2luID0gbmV3IFBvaW50KGNvbnRleHQucm90YXRlT3JpZ2luKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCAtb3JpZ2luLnggLCAtb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKCByb3RhdGlvbiAlIDM2MCAqIE1hdGguUEkvMTgwICk7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggb3JpZ2luLnggLCBvcmlnaW4ueSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5aaC5p6c5pyJ5L2N56e7XG4gICAgICAgIHZhciB4LHk7XG4gICAgICAgIGlmKCB0aGlzLnh5VG9JbnQgJiYgIXRoaXMubW92ZWluZyApe1xuICAgICAgICAgICAgLy/lvZPov5nkuKrlhYPntKDlnKjlgZrovajov7nov5DliqjnmoTml7blgJnvvIzmr5TlpoJkcmFn77yMYW5pbWF0aW9u5aaC5p6c5a6e5pe255qE6LCD5pW06L+Z5LiqeCDvvIwgeVxuICAgICAgICAgICAgLy/pgqPkuYjor6XlhYPntKDnmoTovajov7nkvJrmnInot7Pot4PnmoTmg4XlhrXlj5HnlJ/jgILmiYDku6XliqDkuKrmnaHku7bov4fmu6TvvIxcbiAgICAgICAgICAgIHZhciB4ID0gcGFyc2VJbnQoIGNvbnRleHQueCApO1xuICAgICAgICAgICAgdmFyIHkgPSBwYXJzZUludCggY29udGV4dC55ICk7XG5cbiAgICAgICAgICAgIGlmKCBwYXJzZUludChjb250ZXh0LmxpbmVXaWR0aCAsIDEwKSAlIDIgPT0gMSAmJiBjb250ZXh0LnN0cm9rZVN0eWxlICl7XG4gICAgICAgICAgICAgICAgeCArPSAwLjU7XG4gICAgICAgICAgICAgICAgeSArPSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ID0gY29udGV4dC54O1xuICAgICAgICAgICAgeSA9IGNvbnRleHQueTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggeCAhPSAwIHx8IHkgIT0gMCApe1xuICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIHggLCB5ICk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybSA9IF90cmFuc2Zvcm07XG4gICAgICAgIHJldHVybiBfdHJhbnNmb3JtO1xuICAgIH0sXG4gICAgLy/mmL7npLrlr7nosaHnmoTpgInlj5bmo4DmtYvlpITnkIblh73mlbBcbiAgICBnZXRDaGlsZEluUG9pbnQgOiBmdW5jdGlvbiggcG9pbnQgKXtcbiAgICAgICAgdmFyIHJlc3VsdDsgLy/mo4DmtYvnmoTnu5PmnpxcblxuICAgICAgICAvL+esrOS4gOatpe+8jOWQp2dsb2LnmoRwb2ludOi9rOaNouWIsOWvueW6lOeahG9iaueahOWxgue6p+WGheeahOWdkOagh+ezu+e7n1xuICAgICAgICBpZiggdGhpcy50eXBlICE9IFwic3RhZ2VcIiAmJiB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC50eXBlICE9IFwic3RhZ2VcIiApIHtcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcy5wYXJlbnQuZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgeCA9IHBvaW50Lng7XG4gICAgICAgIHZhciB5ID0gcG9pbnQueTtcblxuICAgICAgICAvL+i/meS4quaXtuWAmeWmguaenOacieWvuWNvbnRleHTnmoRzZXTvvIzlkYror4nlvJXmk47kuI3pnIDopoF3YXRjaO+8jOWboOS4uui/meS4quaYr+W8leaTjuinpuWPkeeahO+8jOS4jeaYr+eUqOaIt1xuICAgICAgICAvL+eUqOaIt3NldCBjb250ZXh0IOaJjemcgOimgeinpuWPkXdhdGNoXG4gICAgICAgIHRoaXMuX25vdFdhdGNoID0gdHJ1ZTtcbiAgICBcbiAgICAgICAgLy/lr7npvKDmoIfnmoTlnZDmoIfkuZ/lgZrnm7jlkIznmoTlj5jmjaJcbiAgICAgICAgaWYoIHRoaXMuX3RyYW5zZm9ybSApe1xuICAgICAgICAgICAgdmFyIGludmVyc2VNYXRyaXggPSB0aGlzLl90cmFuc2Zvcm0uY2xvbmUoKS5pbnZlcnQoKTtcbiAgICAgICAgICAgIHZhciBvcmlnaW5Qb3MgPSBbeCwgeV07XG4gICAgICAgICAgICBvcmlnaW5Qb3MgPSBpbnZlcnNlTWF0cml4Lm11bFZlY3Rvciggb3JpZ2luUG9zICk7XG5cbiAgICAgICAgICAgIHggPSBvcmlnaW5Qb3NbMF07XG4gICAgICAgICAgICB5ID0gb3JpZ2luUG9zWzFdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfcmVjdCA9IHRoaXMuX3JlY3QgPSB0aGlzLmdldFJlY3QodGhpcy5jb250ZXh0KTtcblxuICAgICAgICBpZighX3JlY3Qpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBpZiggIXRoaXMuY29udGV4dC53aWR0aCAmJiAhIV9yZWN0LndpZHRoICl7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggPSBfcmVjdC53aWR0aDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQuaGVpZ2h0ICYmICEhX3JlY3QuaGVpZ2h0ICl7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gX3JlY3QuaGVpZ2h0O1xuICAgICAgICB9O1xuICAgICAgICBpZighX3JlY3Qud2lkdGggfHwgIV9yZWN0LmhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICAvL+ato+W8j+W8gOWni+esrOS4gOatpeeahOefqeW9ouiMg+WbtOWIpOaWrVxuICAgICAgICBpZiAoIHggICAgPj0gX3JlY3QueFxuICAgICAgICAgICAgJiYgIHggPD0gKF9yZWN0LnggKyBfcmVjdC53aWR0aClcbiAgICAgICAgICAgICYmICB5ID49IF9yZWN0LnlcbiAgICAgICAgICAgICYmICB5IDw9IChfcmVjdC55ICsgX3JlY3QuaGVpZ2h0KVxuICAgICAgICApIHtcbiAgICAgICAgICAgLy/pgqPkuYjlsLHlnKjov5nkuKrlhYPntKDnmoTnn6nlvaLojIPlm7TlhoVcbiAgICAgICAgICAgcmVzdWx0ID0gSGl0VGVzdFBvaW50LmlzSW5zaWRlKCB0aGlzICwge1xuICAgICAgICAgICAgICAgeCA6IHgsXG4gICAgICAgICAgICAgICB5IDogeVxuICAgICAgICAgICB9ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIC8v5aaC5p6c6L+e55+p5b2i5YaF6YO95LiN5piv77yM6YKj5LmI6IKv5a6a55qE77yM6L+Z5Liq5LiN5piv5oiR5Lus6KaB5om+55qEc2hhcFxuICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgLypcbiAgICAqIGFuaW1hdGVcbiAgICAqIEBwYXJhbSB0b0NvbnRlbnQg6KaB5Yqo55S75Y+Y5b2i5Yiw55qE5bGe5oCn6ZuG5ZCIXG4gICAgKiBAcGFyYW0gb3B0aW9ucyB0d2VlbiDliqjnlLvlj4LmlbBcbiAgICAqL1xuICAgIGFuaW1hdGUgOiBmdW5jdGlvbiggdG9Db250ZW50ICwgb3B0aW9ucyApe1xuICAgICAgICB2YXIgdG8gPSB0b0NvbnRlbnQ7XG4gICAgICAgIHZhciBmcm9tID0ge307XG4gICAgICAgIGZvciggdmFyIHAgaW4gdG8gKXtcbiAgICAgICAgICAgIGZyb21bIHAgXSA9IHRoaXMuY29udGV4dFtwXTtcbiAgICAgICAgfTtcbiAgICAgICAgIW9wdGlvbnMgJiYgKG9wdGlvbnMgPSB7fSk7XG4gICAgICAgIG9wdGlvbnMuZnJvbSA9IGZyb207XG4gICAgICAgIG9wdGlvbnMudG8gPSB0bztcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciB1cEZ1biA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgaWYoIG9wdGlvbnMub25VcGRhdGUgKXtcbiAgICAgICAgICAgIHVwRnVuID0gb3B0aW9ucy5vblVwZGF0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHR3ZWVuO1xuICAgICAgICBvcHRpb25zLm9uVXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8v5aaC5p6cY29udGV4dOS4jeWtmOWcqOivtOaYjuivpW9iauW3sue7j+iiq2Rlc3Ryb3nkuobvvIzpgqPkuYjopoHmiorku5bnmoR0d2Vlbue7mWRlc3Ryb3lcbiAgICAgICAgICAgIGlmICghc2VsZi5jb250ZXh0ICYmIHR3ZWVuKSB7XG4gICAgICAgICAgICAgICAgQW5pbWF0aW9uRnJhbWUuZGVzdHJveVR3ZWVuKHR3ZWVuKTtcbiAgICAgICAgICAgICAgICB0d2VlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvciggdmFyIHAgaW4gdGhpcyApe1xuICAgICAgICAgICAgICAgIHNlbGYuY29udGV4dFtwXSA9IHRoaXNbcF07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXBGdW4uYXBwbHkoc2VsZiAsIFt0aGlzXSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBjb21wRnVuID0gZnVuY3Rpb24oKXt9O1xuICAgICAgICBpZiggb3B0aW9ucy5vbkNvbXBsZXRlICl7XG4gICAgICAgICAgICBjb21wRnVuID0gb3B0aW9ucy5vbkNvbXBsZXRlO1xuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zLm9uQ29tcGxldGUgPSBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgICAgICBjb21wRnVuLmFwcGx5KHNlbGYgLCBhcmd1bWVudHMpXG4gICAgICAgIH07XG4gICAgICAgIHR3ZWVuID0gQW5pbWF0aW9uRnJhbWUucmVnaXN0VHdlZW4oIG9wdGlvbnMgKTtcbiAgICAgICAgcmV0dXJuIHR3ZWVuO1xuICAgIH0sXG5cblxuICAgIC8v5riy5p+T55u45YWz6YOo5YiG77yM6L+B56e75YiwcmVuZGVyZXJz5Lit5Y67XG4gICAgX3JlbmRlciA6IGZ1bmN0aW9uKCBjdHggKXtcdFxuICAgICAgICBpZiggIXRoaXMuY29udGV4dC52aXNpYmxlIHx8IHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA8PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgXG5cbiAgICAgICAgdmFyIHRyYW5zRm9ybSA9IHRoaXMuX3RyYW5zZm9ybTtcbiAgICAgICAgaWYoICF0cmFuc0Zvcm0gKSB7XG4gICAgICAgICAgICB0cmFuc0Zvcm0gPSB0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/ov5DnlKjnn6npmLXlvIDlp4vlj5jlvaJcbiAgICAgICAgY3R4LnRyYW5zZm9ybS5hcHBseSggY3R4ICwgdHJhbnNGb3JtLnRvQXJyYXkoKSApO1xuXG4gICAgICAgIC8v6K6+572u5qC35byP77yM5paH5pys5pyJ6Ieq5bex55qE6K6+572u5qC35byP5pa55byPXG4gICAgICAgIGlmKCB0aGlzLnR5cGUgIT0gXCJ0ZXh0XCIgKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmNvbnRleHQuJG1vZGVsO1xuICAgICAgICAgICAgZm9yKHZhciBwIGluIHN0eWxlKXtcbiAgICAgICAgICAgICAgICBpZiggcCAhPSBcInRleHRCYXNlbGluZVwiICYmICggcCBpbiBjdHggKSApe1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHN0eWxlW3BdIHx8IF8uaXNOdW1iZXIoIHN0eWxlW3BdICkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggcCA9PSBcImdsb2JhbEFscGhhXCIgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mAj+aYjuW6puimgeS7jueItuiKgueCuee7p+aJv1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eFtwXSAqPSBzdHlsZVtwXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gc3R5bGVbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoIGN0eCApO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0sXG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApIHtcbiAgICAgICAgLy/ln7rnsbvkuI3mj5DkvptyZW5kZXLnmoTlhbfkvZPlrp7njrDvvIznlLHlkI7nu63lhbfkvZPnmoTmtL7nlJ/nsbvlkIToh6rlrp7njrBcbiAgICB9LFxuICAgIC8v5LuO5qCR5Lit5Yig6ZmkXG4gICAgcmVtb3ZlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lhYPntKDnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/mioroh6rlt7Hku47niLboioLngrnkuK3liKDpmaTkuoblkI7lgZroh6rmiJHmuIXpmaTvvIzph4rmlL7lhoXlrZhcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dDtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BsYXlPYmplY3Q7XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzM+eahERpc3BsYXlMaXN0IOS4reeahOWuueWZqOexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XG5cbnZhciBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gZnVuY3Rpb24ob3B0KXtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuY2hpbGRyZW4gPSBbXTtcbiAgIHNlbGYubW91c2VDaGlsZHJlbiA9IFtdO1xuICAgRGlzcGxheU9iamVjdENvbnRhaW5lci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgIC8v5omA5pyJ55qE5a655Zmo6buY6K6k5pSv5oyBZXZlbnQg5qOA5rWL77yM5Zug5Li6IOWPr+iDveaciemHjOmdoueahHNoYXBl5pivZXZlbnRFbmFibGXmmK90cnVl55qEXG4gICAvL+WmguaenOeUqOaIt+acieW8uuWItueahOmcgOaxguiuqeWuueWZqOS4i+eahOaJgOacieWFg+e0oOmDvSDkuI3lj6/mo4DmtYvvvIzlj6/ku6XosIPnlKhcbiAgIC8vRGlzcGxheU9iamVjdENvbnRhaW5lcueahCBzZXRFdmVudEVuYWJsZSgpIOaWueazlVxuICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3RDb250YWluZXIgLCBEaXNwbGF5T2JqZWN0ICwge1xuICAgIGFkZENoaWxkIDogZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICBpZiggIWNoaWxkICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBpZih0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpICE9IC0xKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9O1xuICAgICAgICAvL+WmguaenOS7luWcqOWIq+eahOWtkOWFg+e0oOS4re+8jOmCo+S5iOWwseS7juWIq+S6uumCo+mHjOWIoOmZpOS6hlxuICAgICAgICBpZihjaGlsZC5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaCggY2hpbGQgKTtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJBZGRDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyQWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIGFkZENoaWxkQXQgOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgaWYodGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMSkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy/kuIrmiqVjaGlsZHJlbuW/g+i3s1xuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckFkZENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJBZGRDaGlsZChjaGlsZCxpbmRleCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGQgOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDaGlsZEF0KF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICkpO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGRBdCA6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckRlbENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJEZWxDaGlsZChjaGlsZCAsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkQnlJZCA6IGZ1bmN0aW9uKCBpZCApIHtcdFxuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2hpbGRBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICByZW1vdmVBbGxDaGlsZHJlbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGlsZSh0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRBdCgwKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/pm4blkIjnsbvnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/kvp3mrKHplIDmr4HmiYDmnInlrZDlhYPntKBcbiAgICAgICAgZm9yICh2YXIgaT0wLGw9dGhpcy5jaGlsZHJlbi5sZW5ndGggOyBpPGwgOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZEF0KGkpLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGwtLTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8qXG4gICAgICpAaWQg5YWD57Sg55qEaWRcbiAgICAgKkBib29sZW4g5piv5ZCm5rex5bqm5p+l6K+i77yM6buY6K6k5bCx5Zyo56ys5LiA5bGC5a2Q5YWD57Sg5Lit5p+l6K+iXG4gICAgICoqL1xuICAgIGdldENoaWxkQnlJZCA6IGZ1bmN0aW9uKGlkICwgYm9vbGVuKXtcbiAgICAgICAgaWYoIWJvb2xlbikge1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+a3seW6puafpeivolxuICAgICAgICAgICAgLy9UT0RPOuaaguaXtuacquWunueOsFxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldENoaWxkQXQgOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgIH0sXG4gICAgZ2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApO1xuICAgIH0sXG4gICAgc2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCl7XG4gICAgICAgIGlmKGNoaWxkLnBhcmVudCAhPSB0aGlzKSByZXR1cm47XG4gICAgICAgIHZhciBvbGRJbmRleCA9IF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICk7XG4gICAgICAgIGlmKGluZGV4ID09IG9sZEluZGV4KSByZXR1cm47XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKG9sZEluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKTtcbiAgICB9LFxuICAgIGdldE51bUNoaWxkcmVuIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB9LFxuICAgIC8v6I635Y+WeCx554K55LiK55qE5omA5pyJb2JqZWN0ICBudW0g6ZyA6KaB6L+U5Zue55qEb2Jq5pWw6YePXG4gICAgZ2V0T2JqZWN0c1VuZGVyUG9pbnQgOiBmdW5jdGlvbiggcG9pbnQgLCBudW0pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yKHZhciBpID0gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgaWYoIGNoaWxkID09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAoIWNoaWxkLl9ldmVudEVuYWJsZWQgJiYgIWNoaWxkLmRyYWdFbmFibGVkKSB8fCBcbiAgICAgICAgICAgICAgICAhY2hpbGQuY29udGV4dC52aXNpYmxlIFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggY2hpbGQgaW5zdGFuY2VvZiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICkge1xuICAgICAgICAgICAgICAgIC8v5piv6ZuG5ZCIXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm1vdXNlQ2hpbGRyZW4gJiYgY2hpbGQuZ2V0TnVtQ2hpbGRyZW4oKSA+IDApe1xuICAgICAgICAgICAgICAgICAgIHZhciBvYmpzID0gY2hpbGQuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIHBvaW50ICk7XG4gICAgICAgICAgICAgICAgICAgaWYgKG9ianMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCggb2JqcyApO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XHRcdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+mdnumbhuWQiO+8jOWPr+S7peW8gOWni+WBmmdldENoaWxkSW5Qb2ludOS6hlxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5nZXRDaGlsZEluUG9pbnQoIHBvaW50ICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobnVtICE9IHVuZGVmaW5lZCAmJiAhaXNOYU4obnVtKSl7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdC5sZW5ndGggPT0gbnVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIC8v5riy5p+T55u45YWz77yM562J5LiL5Lmf5Lya56e75YiwcmVuZGVyZXLkuK3ljrtcbiAgICByZW5kZXIgOiBmdW5jdGlvbiggY3R4ICkge1xuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9yZW5kZXIoIGN0eCApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICogc3RhZ2Ug57G777yMIOWGjWFzM+S4re+8jHN0YWdl5YiZ5Luj6KGo5pW05Liq6Iie5Y+w44CC5piv5ZSv5LiA55qE5qC56IqC54K5XG4gKiDkvYbmmK/lho1jYW52YXjkuK3vvIzlm6DkuLrliIblsYLorr7orqHnmoTpnIDopoHjgIJzdGFnZSDoiJ7lj7Ag5ZCM5qC35Luj6KGo5LiA5LiqY2FudmFz5YWD57Sg77yM5L2G5piv5LiN5piv5YaN5pW05Liq5byV5pOO6K6+6K6hXG4gKiDph4zpnaLvvIwg5LiN5piv5ZSv5LiA55qE5qC56IqC54K544CC6ICM5piv5Lya5Lqk55SxY2FudmF457G75p2l57uf5LiA566h55CG5YW25bGC57qnXG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFN0YWdlID0gZnVuY3Rpb24oICl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudHlwZSA9IFwic3RhZ2VcIjtcbiAgICBzZWxmLmNvbnRleHQyRCA9IG51bGw7XG4gICAgLy9zdGFnZeato+WcqOa4suafk+S4rVxuICAgIHNlbGYuc3RhZ2VSZW5kaW5nID0gZmFsc2U7XG4gICAgc2VsZi5faXNSZWFkeSA9IGZhbHNlO1xuICAgIFN0YWdlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5VdGlscy5jcmVhdENsYXNzKCBTdGFnZSAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL+eUsWNhbnZheOeahGFmdGVyQWRkQ2hpbGQg5Zue6LCDXG4gICAgaW5pdFN0YWdlIDogZnVuY3Rpb24oIGNvbnRleHQyRCAsIHdpZHRoICwgaGVpZ2h0ICl7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIHNlbGYuY29udGV4dDJEID0gY29udGV4dDJEO1xuICAgICAgIHNlbGYuY29udGV4dC53aWR0aCAgPSB3aWR0aDtcbiAgICAgICBzZWxmLmNvbnRleHQuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgIHNlbGYuY29udGV4dC5zY2FsZVggPSBVdGlscy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVZID0gVXRpbHMuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgc2VsZi5faXNSZWFkeSA9IHRydWU7XG4gICAgfSxcbiAgICByZW5kZXIgOiBmdW5jdGlvbiggY29udGV4dCApe1xuICAgICAgICB0aGlzLnN0YWdlUmVuZGluZyA9IHRydWU7XG4gICAgICAgIC8vVE9ET++8mlxuICAgICAgICAvL2NsZWFyIOeci+S8vCDlvojlkIjnkIbvvIzkvYbmmK/lhbblrp7lnKjml6DnirbmgIHnmoRjYXZuYXPnu5jlm77kuK3vvIzlhbblrp7msqHlv4XopoHmiafooYzkuIDmraXlpJrkvZnnmoRjbGVhcuaTjeS9nFxuICAgICAgICAvL+WPjeiAjOWinuWKoOaXoOiwk+eahOW8gOmUgO+8jOWmguaenOWQjue7reimgeWBmuiEj+efqemYteWIpOaWreeahOivneOAguWcqOivtFxuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIFN0YWdlLnN1cGVyY2xhc3MucmVuZGVyLmNhbGwoIHRoaXMsIGNvbnRleHQgKTtcbiAgICAgICAgdGhpcy5zdGFnZVJlbmRpbmcgPSBmYWxzZTtcbiAgICB9LFxuICAgIGhlYXJ0QmVhdCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgLy9zaGFwZSAsIG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlIFxuICAgICAgICAvL2Rpc3BsYXlMaXN05Lit5p+Q5Liq5bGe5oCn5pS55Y+Y5LqGXG4gICAgICAgIGlmICghdGhpcy5faXNSZWFkeSkge1xuICAgICAgICAgICAvL+WcqHN0YWdl6L+Y5rKh5Yid5aeL5YyW5a6M5q+V55qE5oOF5Ya15LiL77yM5peg6ZyA5YGa5Lu75L2V5aSE55CGXG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0IHx8ICggb3B0ID0ge30gKTsgLy/lpoLmnpxvcHTkuLrnqbrvvIzor7TmmI7lsLHmmK/ml6DmnaHku7bliLfmlrBcbiAgICAgICAgb3B0LnN0YWdlICAgPSB0aGlzO1xuXG4gICAgICAgIC8vVE9ET+S4tOaXtuWFiOi/meS5iOWkhOeQhlxuICAgICAgICB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5oZWFydEJlYXQob3B0KTtcbiAgICB9LFxuICAgIGNsZWFyIDogZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID49IDQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dDJELmNsZWFyUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dDJELmNsZWFyUmVjdCggMCwgMCwgdGhpcy5wYXJlbnQud2lkdGggLCB0aGlzLnBhcmVudC5oZWlnaHQgKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgU3RhZ2U7IiwiaW1wb3J0IHsgUkVOREVSRVJfVFlQRSB9IGZyb20gJy4uL2NvbnN0JztcbmltcG9ydCBBbmltYXRpb25GcmFtZSBmcm9tIFwiLi4vYW5pbWF0aW9uL0FuaW1hdGlvbkZyYW1lXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5c3RlbVJlbmRlcmVyIFxue1xuICAgIGNvbnN0cnVjdG9yKCB0eXBlPVJFTkRFUkVSX1RZUEUuVU5LTk9XTiAsIGFwcCApXG4gICAge1xuICAgIFx0dGhpcy50eXBlID0gdHlwZTsgLy8yY2FudmFzLDF3ZWJnbFxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcblxuICAgICAgICB0aGlzLnJlcXVlc3RBaWQgPSBudWxsO1xuXG4gICAgICAgIC8v5q+P5bin55Sx5b+D6Lez5LiK5oql55qEIOmcgOimgemHjee7mOeahHN0YWdlcyDliJfooahcblx0XHR0aGlzLmNvbnZlcnRTdGFnZXMgPSB7fTtcblxuXHRcdHRoaXMuX2hlYXJ0QmVhdCA9IGZhbHNlOy8v5b+D6Lez77yM6buY6K6k5Li6ZmFsc2XvvIzljbNmYWxzZeeahOaXtuWAmeW8leaTjuWkhOS6jumdmem7mOeKtuaAgSB0cnVl5YiZ5ZCv5Yqo5riy5p+TXG5cblx0XHR0aGlzLl9wcmVSZW5kZXJUaW1lID0gMDtcbiAgICB9XG5cbiAgICAvL+WmguaenOW8leaTjuWkhOS6jumdmem7mOeKtuaAgeeahOivne+8jOWwseS8muWQr+WKqFxuICAgIHN0YXJ0RW50ZXIoKVxuICAgIHtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYoICFzZWxmLnJlcXVlc3RBaWQgKXtcbiAgICAgICAgICAgc2VsZi5yZXF1ZXN0QWlkID0gQW5pbWF0aW9uRnJhbWUucmVnaXN0RnJhbWUoIHtcbiAgICAgICAgICAgICAgIGlkIDogXCJlbnRlckZyYW1lXCIsIC8v5ZCM5pe26IKv5a6a5Y+q5pyJ5LiA5LiqZW50ZXJGcmFtZeeahHRhc2tcbiAgICAgICAgICAgICAgIHRhc2sgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVudGVyRnJhbWUuYXBwbHkoc2VsZik7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH0gKTtcbiAgICAgICB9XG4gICAgfVxuXG4gICAgZW50ZXJGcmFtZSgpXG4gICAge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8v5LiN566h5oCO5LmI5qC377yMZW50ZXJGcmFtZeaJp+ihjOS6huWwseimgeaKilxuICAgICAgICAvL3JlcXVlc3RBaWQgbnVsbCDmjolcbiAgICAgICAgc2VsZi5yZXF1ZXN0QWlkID0gbnVsbDtcbiAgICAgICAgVXRpbHMubm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGlmKCBzZWxmLl9oZWFydEJlYXQgKXtcbiAgICAgICAgICAgIF8uZWFjaChfLnZhbHVlcyggc2VsZi5jb252ZXJ0U3RhZ2VzICkgLCBmdW5jdGlvbihjb252ZXJ0U3RhZ2Upe1xuICAgICAgICAgICAgICAgY29udmVydFN0YWdlLnN0YWdlLl9yZW5kZXIoIGNvbnZlcnRTdGFnZS5zdGFnZS5jb250ZXh0MkQgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2VsZi5faGVhcnRCZWF0ID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmNvbnZlcnRTdGFnZXMgPSB7fTtcbiAgICAgICAgICAgIC8v5riy5p+T5a6M5LqG77yM5omT5LiK5pyA5paw5pe26Ze05oyrXG4gICAgICAgICAgICBzZWxmLl9wcmVSZW5kZXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2NvbnZlcnRDYW52YXgob3B0KVxuICAgIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgXy5lYWNoKCBtZS5hcHAuY2hpbGRyZW4gLCBmdW5jdGlvbihzdGFnZSl7XG4gICAgICAgICAgICBzdGFnZS5jb250ZXh0W29wdC5uYW1lXSA9IG9wdC52YWx1ZTsgXG4gICAgICAgIH0gKTsgIFxuICAgIH1cblxuICAgIGhlYXJ0QmVhdCggb3B0IClcbiAgICB7XG4gICAgICAgIC8vZGlzcGxheUxpc3TkuK3mn5DkuKrlsZ7mgKfmlLnlj5jkuoZcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiggb3B0ICl7XG4gICAgICAgICAgICAvL+W/g+i3s+WMheacieS4pOenje+8jOS4gOenjeaYr+afkOWFg+e0oOeahOWPr+inhuWxnuaAp+aUueWPmOS6huOAguS4gOenjeaYr2NoaWxkcmVu5pyJ5Y+Y5YqoXG4gICAgICAgICAgICAvL+WIhuWIq+WvueW6lGNvbnZlcnRUeXBlICDkuLogY29udGV4dCAgYW5kIGNoaWxkcmVuXG4gICAgICAgICAgICBpZiAob3B0LmNvbnZlcnRUeXBlID09IFwiY29udGV4dFwiKXtcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgICA9IG9wdC5zdGFnZTtcbiAgICAgICAgICAgICAgICB2YXIgc2hhcGUgICA9IG9wdC5zaGFwZTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSAgICA9IG9wdC5uYW1lO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSAgID0gb3B0LnZhbHVlO1xuICAgICAgICAgICAgICAgIHZhciBwcmVWYWx1ZT0gb3B0LnByZVZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYoIHNoYXBlLnR5cGUgPT0gXCJjYW52YXhcIiApe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9jb252ZXJ0Q2FudmF4KG9wdClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZighc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZihzaGFwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXS5jb252ZXJ0U2hhcGVzWyBzaGFwZS5pZCBdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnZlcnRTdGFnZXNbIHN0YWdlLmlkIF0uY29udmVydFNoYXBlc1sgc2hhcGUuaWQgXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlIDogc2hhcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRUeXBlIDogb3B0LmNvbnZlcnRUeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOW3sue7j+S4iuaKpeS6huivpSBzaGFwZSDnmoTlv4Pot7PjgIJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKG9wdC5jb252ZXJ0VHlwZSA9PSBcImNoaWxkcmVuXCIpe1xuICAgICAgICAgICAgICAgIC8v5YWD57Sg57uT5p6E5Y+Y5YyW77yM5q+U5aaCYWRkY2hpbGQgcmVtb3ZlQ2hpbGTnrYlcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gb3B0LnRhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgPSBvcHQuc3JjLmdldFN0YWdlKCk7XG4gICAgICAgICAgICAgICAgaWYoIHN0YWdlIHx8ICh0YXJnZXQudHlwZT09XCJzdGFnZVwiKSApe1xuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaTjeS9nOeahOebruagh+WFg+e0oOaYr1N0YWdlXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlID0gc3RhZ2UgfHwgdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICBpZighc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIW9wdC5jb252ZXJ0VHlwZSl7XG4gICAgICAgICAgICAgICAgLy/ml6DmnaHku7bopoHmsYLliLfmlrBcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgPSBvcHQuc3RhZ2U7XG4gICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlICxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/ml6DmnaHku7bopoHmsYLlhajpg6jliLfmlrDvvIzkuIDoiKznlKjlnKhyZXNpemXnrYnjgIJcbiAgICAgICAgICAgIF8uZWFjaCggc2VsZi5hcHAuY2hpbGRyZW4gLCBmdW5jdGlvbiggc3RhZ2UgLCBpICl7XG4gICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzWyBzdGFnZS5pZCBdID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlLFxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghc2VsZi5faGVhcnRCZWF0KXtcbiAgICAgICAgICAgLy/lpoLmnpzlj5HnjrDlvJXmk47lnKjpnZnpu5jnirbmgIHvvIzpgqPkuYjlsLHllKTphpLlvJXmk45cbiAgICAgICAgICAgc2VsZi5faGVhcnRCZWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgc2VsZi5zdGFydEVudGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIC8v5ZCm5YiZ5pm65oWn57un57ut56Gu6K6k5b+D6LezXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgU3lzdGVtUmVuZGVyZXIgZnJvbSAnLi4vU3lzdGVtUmVuZGVyZXInO1xuaW1wb3J0IHsgUkVOREVSRVJfVFlQRSB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzUmVuZGVyZXIgZXh0ZW5kcyBTeXN0ZW1SZW5kZXJlclxue1xuICAgIGNvbnN0cnVjdG9yKGFwcClcbiAgICB7XG4gICAgICAgIHN1cGVyKFJFTkRFUkVSX1RZUEUuQ0FOVkFTLCBhcHApO1xuICAgIH1cbn1cblxuIiwiLyoqXG4gKiBBcHBsaWNhdGlvbiB7e1BLR19WRVJTSU9OfX1cbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5Li75byV5pOOIOexu1xuICpcbiAqIOi0n+i0o+aJgOaciWNhbnZhc+eahOWxgue6p+euoeeQhu+8jOWSjOW/g+i3s+acuuWItueahOWunueOsCzmjZXojrfliLDlv4Pot7PljIXlkI4gXG4gKiDliIblj5HliLDlr7nlupTnmoRzdGFnZShjYW52YXMp5p2l57uY5Yi25a+55bqU55qE5pS55YqoXG4gKiDnhLblkI4g6buY6K6k5pyJ5a6e546w5LqGc2hhcGXnmoQgbW91c2VvdmVyICBtb3VzZW91dCAgZHJhZyDkuovku7ZcbiAqXG4gKiovXG5cbmltcG9ydCBVdGlscyBmcm9tIFwiLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi9ldmVudC9FdmVudEhhbmRsZXJcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFN0YWdlIGZyb20gXCIuL2Rpc3BsYXkvU3RhZ2VcIjtcbmltcG9ydCBSZW5kZXJlciBmcm9tIFwiLi9yZW5kZXJlcnMvY2FudmFzL0NhbnZhc1JlbmRlcmVyXCJcblxuXG4vL3V0aWxzXG5pbXBvcnQgXyBmcm9tIFwiLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgJCBmcm9tIFwiLi91dGlscy9kb21cIjtcblxuXG52YXIgQXBwbGljYXRpb24gPSBmdW5jdGlvbiggb3B0ICl7XG4gICAgdGhpcy50eXBlID0gXCJjYW52YXhcIjtcbiAgICB0aGlzLl9jaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMCk7IFxuICAgIFxuICAgIHRoaXMuZWwgPSAkLnF1ZXJ5KG9wdC5lbCk7XG5cbiAgICB0aGlzLndpZHRoID0gcGFyc2VJbnQoXCJ3aWR0aFwiICBpbiBvcHQgfHwgdGhpcy5lbC5vZmZzZXRXaWR0aCAgLCAxMCk7IFxuICAgIHRoaXMuaGVpZ2h0ID0gcGFyc2VJbnQoXCJoZWlnaHRcIiBpbiBvcHQgfHwgdGhpcy5lbC5vZmZzZXRIZWlnaHQgLCAxMCk7IFxuXG4gICAgdmFyIHZpZXdPYmogPSAkLmNyZWF0ZVZpZXcodGhpcy53aWR0aCAsIHRoaXMuaGVpZ2h0LCB0aGlzLl9jaWQpO1xuICAgIHRoaXMudmlldyA9IHZpZXdPYmoudmlldztcbiAgICB0aGlzLnN0YWdlX2MgPSB2aWV3T2JqLnN0YWdlX2M7XG4gICAgdGhpcy5kb21fYyA9IHZpZXdPYmouZG9tX2M7XG4gICAgXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoIHRoaXMudmlldyApO1xuXG4gICAgdGhpcy52aWV3T2Zmc2V0ID0gJC5vZmZzZXQodGhpcy52aWV3KTtcbiAgICB0aGlzLmxhc3RHZXRSTyA9IDA7Ly/mnIDlkI7kuIDmrKHojrflj5Ygdmlld09mZnNldCDnmoTml7bpl7RcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoIHRoaXMgKTtcblxuICAgIHRoaXMuZXZlbnQgPSBudWxsO1xuXG4gICAgdGhpcy5fYnVmZmVyU3RhZ2UgPSBudWxsO1xuXG4gICAgLy/mmK/lkKbpmLvmraLmtY/op4jlmajpu5jorqTkuovku7bnmoTmiafooYxcbiAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICBpZiggb3B0LnByZXZlbnREZWZhdWx0ID09PSBmYWxzZSApe1xuICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gZmFsc2VcbiAgICB9O1xuXG4gICAgQXBwbGljYXRpb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhBcHBsaWNhdGlvbiAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY29udGV4dC53aWR0aCAgPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7IFxuXG4gICAgICAgIC8v54S25ZCO5Yib5bu65LiA5Liq55So5LqO57uY5Yi25r+A5rS7IHNoYXBlIOeahCBzdGFnZSDliLBhY3RpdmF0aW9uXG4gICAgICAgIHRoaXMuX2NyZWF0SG92ZXJTdGFnZSgpO1xuXG4gICAgICAgIC8v5Yib5bu65LiA5Liq5aaC5p6c6KaB55So5YOP57Sg5qOA5rWL55qE5pe25YCZ55qE5a655ZmoXG4gICAgICAgIHRoaXMuX2NyZWF0ZVBpeGVsQ29udGV4dCgpO1xuICAgICAgICBcbiAgICB9LFxuICAgIHJlZ2lzdEV2ZW50IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgLy/liJ3lp4vljJbkuovku7blp5TmiZjliLByb2905YWD57Sg5LiK6Z2iXG4gICAgICAgIHRoaXMuZXZlbnQgPSBuZXcgRXZlbnRIYW5kbGVyKCB0aGlzICwgb3B0KTs7XG4gICAgICAgIHRoaXMuZXZlbnQuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudDtcbiAgICB9LFxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgLy/ph43mlrDorr7nva7lnZDmoIfns7vnu58g6auY5a69IOetieOAglxuICAgICAgICB0aGlzLndpZHRoICAgICAgPSBwYXJzZUludCgob3B0ICYmIFwid2lkdGhcIiBpbiBvcHQpIHx8IHRoaXMuZWwub2Zmc2V0V2lkdGggICwgMTApOyBcbiAgICAgICAgdGhpcy5oZWlnaHQgICAgID0gcGFyc2VJbnQoKG9wdCAmJiBcImhlaWdodFwiIGluIG9wdCkgfHwgdGhpcy5lbC5vZmZzZXRIZWlnaHQgLCAxMCk7IFxuXG4gICAgICAgIHRoaXMudmlldy5zdHlsZS53aWR0aCAgPSB0aGlzLndpZHRoICtcInB4XCI7XG4gICAgICAgIHRoaXMudmlldy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCtcInB4XCI7XG5cbiAgICAgICAgdGhpcy52aWV3T2Zmc2V0ICAgICA9ICQub2Zmc2V0KHRoaXMudmlldyk7XG4gICAgICAgIHRoaXMuX25vdFdhdGNoICAgICAgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLl9ub3RXYXRjaCAgICAgID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJlU2l6ZUNhbnZhcyAgICA9IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gY3R4LmNhbnZhcztcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IG1lLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodD0gbWUuaGVpZ2h0KyBcInB4XCI7XG4gICAgICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiAgLCBtZS53aWR0aCAqIFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiAsIG1lLmhlaWdodCogVXRpbHMuX2RldmljZVBpeGVsUmF0aW8pO1xuXG4gICAgICAgICAgICAvL+WmguaenOaYr3N3ZueahOivneWwsei/mOimgeiwg+eUqOi/meS4quaWueazleOAglxuICAgICAgICAgICAgaWYgKGN0eC5yZXNpemUpIHtcbiAgICAgICAgICAgICAgICBjdHgucmVzaXplKG1lLndpZHRoICwgbWUuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTsgXG4gICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuICwgZnVuY3Rpb24ocyAsIGkpe1xuICAgICAgICAgICAgcy5fbm90V2F0Y2ggICAgID0gdHJ1ZTtcbiAgICAgICAgICAgIHMuY29udGV4dC53aWR0aCA9IG1lLndpZHRoO1xuICAgICAgICAgICAgcy5jb250ZXh0LmhlaWdodD0gbWUuaGVpZ2h0O1xuICAgICAgICAgICAgcmVTaXplQ2FudmFzKHMuY29udGV4dDJEKTtcbiAgICAgICAgICAgIHMuX25vdFdhdGNoICAgICA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRvbV9jLnN0eWxlLndpZHRoICA9IHRoaXMud2lkdGggICsgXCJweFwiO1xuICAgICAgICB0aGlzLmRvbV9jLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgIHRoaXMuaGVhcnRCZWF0KCk7XG5cbiAgICB9LFxuICAgIGdldEhvdmVyU3RhZ2UgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyU3RhZ2U7XG4gICAgfSxcbiAgICBfY3JlYXRIb3ZlclN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9UT0RPOuWIm+W7unN0YWdl55qE5pe25YCZ5LiA5a6a6KaB5Lyg5YWld2lkdGggaGVpZ2h0ICDkuKTkuKrlj4LmlbBcbiAgICAgICAgdGhpcy5fYnVmZmVyU3RhZ2UgPSBuZXcgU3RhZ2UoIHtcbiAgICAgICAgICAgIGlkIDogXCJhY3RpdkNhbnZhc1wiKyhuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICBjb250ZXh0IDoge1xuICAgICAgICAgICAgICAgIHdpZHRoIDogdGhpcy5jb250ZXh0LndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb250ZXh0LmhlaWdodFxuICAgICAgICAgICAgfVxuICAgICAgICB9ICk7XG4gICAgICAgIC8v6K+lc3RhZ2XkuI3lj4LkuI7kuovku7bmo4DmtYtcbiAgICAgICAgdGhpcy5fYnVmZmVyU3RhZ2UuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFkZENoaWxkKCB0aGlzLl9idWZmZXJTdGFnZSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog55So5p2l5qOA5rWL5paH5pysd2lkdGggaGVpZ2h0IFxuICAgICAqIEByZXR1cm4ge09iamVjdH0g5LiK5LiL5paHXG4gICAgKi9cbiAgICBfY3JlYXRlUGl4ZWxDb250ZXh0IDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfcGl4ZWxDYW52YXMgPSAkLnF1ZXJ5KFwiX3BpeGVsQ2FudmFzXCIpO1xuICAgICAgICBpZighX3BpeGVsQ2FudmFzKXtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcyA9ICQuY3JlYXRlQ2FudmFzKDAsIDAsIFwiX3BpeGVsQ2FudmFzXCIpOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5Y+I55qE6K+dIOWwseS4jemcgOimgeWcqOWIm+W7uuS6hlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBfcGl4ZWxDYW52YXMgKTtcbiAgICAgICAgVXRpbHMuaW5pdEVsZW1lbnQoIF9waXhlbENhbnZhcyApO1xuICAgICAgICBpZiggVXRpbHMuY2FudmFzU3VwcG9ydCgpICl7XG4gICAgICAgICAgICAvL2NhbnZhc+eahOivne+8jOWTquaAleaYr2Rpc3BsYXk6bm9uZeeahOmhteWPr+S7peeUqOadpeW3puWDj+e0oOajgOa1i+WSjG1lYXN1cmVUZXh05paH5pysd2lkdGjmo4DmtYtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS5kaXNwbGF5ICAgID0gXCJub25lXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2ZsYXNoQ2FudmFzIOeahOivne+8jHN3ZuWmguaenGRpc3BsYXk6bm9uZeS6huOAguWwseWBmuS4jeS6hm1lYXN1cmVUZXh0IOaWh+acrOWuveW6piDmo4DmtYvkuoZcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS56SW5kZXggICAgID0gLTE7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUucG9zaXRpb24gICA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS5sZWZ0ICAgICAgID0gLXRoaXMuY29udGV4dC53aWR0aCAgKyBcInB4XCI7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUudG9wICAgICAgICA9IC10aGlzLmNvbnRleHQuaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9XG4gICAgICAgIFV0aWxzLl9waXhlbEN0eCA9IF9waXhlbENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVWaWV3T2Zmc2V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiggbm93IC0gdGhpcy5sYXN0R2V0Uk8gPiAxMDAwICl7XG4gICAgICAgICAgICB0aGlzLnZpZXdPZmZzZXQgICAgICA9ICQub2Zmc2V0KHRoaXMudmlldyk7XG4gICAgICAgICAgICB0aGlzLmxhc3RHZXRSTyAgICAgICA9IG5vdztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgX2FmdGVyQWRkQ2hpbGQgOiBmdW5jdGlvbiggc3RhZ2UgLCBpbmRleCApe1xuICAgICAgICB2YXIgY2FudmFzO1xuXG4gICAgICAgIGlmKCFzdGFnZS5jb250ZXh0MkQpe1xuICAgICAgICAgICAgY2FudmFzID0gJC5jcmVhdGVDYW52YXMoIHRoaXMuY29udGV4dC53aWR0aCAsIHRoaXMuY29udGV4dC5oZWlnaHQsIHN0YWdlLmlkICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMgPSBzdGFnZS5jb250ZXh0MkQuY2FudmFzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICB0aGlzLnN0YWdlX2MuYXBwZW5kQ2hpbGQoIGNhbnZhcyApO1xuICAgICAgICB9IGVsc2UgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGg+MSkge1xuICAgICAgICAgICAgaWYoIGluZGV4ID09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAvL+WmguaenOayoeacieaMh+WumuS9jee9ru+8jOmCo+S5iOWwseaUvuWIsF9idWZmZXJTdGFnZeeahOS4i+mdouOAglxuICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5pbnNlcnRCZWZvcmUoIGNhbnZhcyAsIHRoaXMuX2J1ZmZlclN0YWdlLmNvbnRleHQyRC5jYW52YXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+WmguaenOacieaMh+WumueahOS9jee9ru+8jOmCo+S5iOWwseaMh+WumueahOS9jee9ruadpVxuICAgICAgICAgICAgICAgIGlmKCBpbmRleCA+PSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xICl7XG4gICAgICAgICAgICAgICAgICAgdGhpcy5zdGFnZV9jLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5pbnNlcnRCZWZvcmUoIGNhbnZhcyAsIHRoaXMuY2hpbGRyZW5bIGluZGV4IF0uY29udGV4dDJELmNhbnZhcyApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBVdGlscy5pbml0RWxlbWVudCggY2FudmFzICk7XG4gICAgICAgIHN0YWdlLmluaXRTdGFnZSggY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSAsIHRoaXMuY29udGV4dC53aWR0aCAsIHRoaXMuY29udGV4dC5oZWlnaHQgKTsgXG4gICAgfSxcbiAgICBfYWZ0ZXJEZWxDaGlsZCA6IGZ1bmN0aW9uKHN0YWdlKXtcbiAgICAgICAgdGhpcy5zdGFnZV9jLnJlbW92ZUNoaWxkKCBzdGFnZS5jb250ZXh0MkQuY2FudmFzICk7XG4gICAgfSxcbiAgICBcbiAgICBoZWFydEJlYXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmhlYXJ0QmVhdChvcHQpO1xuICAgIH1cbn0gKTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb247IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIOS4rSDnmoRzcHJpdGXnsbvvvIznm67liY3ov5jlj6rmmK/kuKrnroDljZXnmoTlrrnmmJPjgIJcbiAqL1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG52YXIgU3ByaXRlID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLnR5cGUgPSBcInNwcml0ZVwiO1xuICAgIFNwcml0ZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKFNwcml0ZSAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNwcml0ZTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWNzRGF0YVxue1xuICAgIGNvbnN0cnVjdG9yKGxpbmVXaWR0aCwgbGluZUNvbG9yLCBsaW5lQWxwaGEsIGZpbGxDb2xvciwgZmlsbEFscGhhLCBmaWxsLCBzaGFwZSlcbiAgICB7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICB0aGlzLmxpbmVDb2xvciA9IGxpbmVDb2xvcjtcbiAgICAgICAgdGhpcy5saW5lQWxwaGEgPSBsaW5lQWxwaGE7XG4gICAgICAgIHRoaXMuX2xpbmVUaW50ID0gbGluZUNvbG9yO1xuICAgICAgICB0aGlzLmZpbGxDb2xvciA9IGZpbGxDb2xvcjtcbiAgICAgICAgdGhpcy5maWxsQWxwaGEgPSBmaWxsQWxwaGE7XG4gICAgICAgIHRoaXMuX2ZpbGxUaW50ID0gZmlsbENvbG9yO1xuICAgICAgICB0aGlzLmZpbGwgPSBmaWxsO1xuICAgICAgICB0aGlzLmhvbGVzID0gW107XG4gICAgICAgIHRoaXMuc2hhcGUgPSBzaGFwZTtcbiAgICAgICAgdGhpcy50eXBlID0gc2hhcGUudHlwZTtcbiAgICB9XG5cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEdyYXBoaWNzRGF0YShcbiAgICAgICAgICAgIHRoaXMubGluZVdpZHRoLFxuICAgICAgICAgICAgdGhpcy5saW5lQ29sb3IsXG4gICAgICAgICAgICB0aGlzLmxpbmVBbHBoYSxcbiAgICAgICAgICAgIHRoaXMuZmlsbENvbG9yLFxuICAgICAgICAgICAgdGhpcy5maWxsQWxwaGEsXG4gICAgICAgICAgICB0aGlzLmZpbGwsXG4gICAgICAgICAgICB0aGlzLnNoYXBlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYWRkSG9sZShzaGFwZSlcbiAgICB7XG4gICAgICAgIHRoaXMuaG9sZXMucHVzaChzaGFwZSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpXG4gICAge1xuICAgICAgICB0aGlzLnNoYXBlID0gbnVsbDtcbiAgICAgICAgdGhpcy5ob2xlcyA9IG51bGw7XG4gICAgfVxuICAgIFxufVxuIiwiLyoqXG4gKiBUaGUgUG9pbnQgb2JqZWN0IHJlcHJlc2VudHMgYSBsb2NhdGlvbiBpbiBhIHR3by1kaW1lbnNpb25hbCBjb29yZGluYXRlIHN5c3RlbSwgd2hlcmUgeCByZXByZXNlbnRzXG4gKiB0aGUgaG9yaXpvbnRhbCBheGlzIGFuZCB5IHJlcHJlc2VudHMgdGhlIHZlcnRpY2FsIGF4aXMuXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2ludFxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSAtIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgeCBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSB5IGF4aXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDApXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnggPSB4O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoaXMgcG9pbnRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuUG9pbnR9IGEgY29weSBvZiB0aGUgcG9pbnRcbiAgICAgKi9cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgeCBhbmQgeSBmcm9tIHRoZSBnaXZlbiBwb2ludFxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBwIC0gVGhlIHBvaW50IHRvIGNvcHkuXG4gICAgICovXG4gICAgY29weShwKVxuICAgIHtcbiAgICAgICAgdGhpcy5zZXQocC54LCBwLnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gcG9pbnQgaXMgZXF1YWwgdG8gdGhpcyBwb2ludFxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlBvaW50fSBwIC0gVGhlIHBvaW50IHRvIGNoZWNrXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGdpdmVuIHBvaW50IGVxdWFsIHRvIHRoaXMgcG9pbnRcbiAgICAgKi9cbiAgICBlcXVhbHMocClcbiAgICB7XG4gICAgICAgIHJldHVybiAocC54ID09PSB0aGlzLngpICYmIChwLnkgPT09IHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgcG9pbnQgdG8gYSBuZXcgeCBhbmQgeSBwb3NpdGlvbi5cbiAgICAgKiBJZiB5IGlzIG9taXR0ZWQsIGJvdGggeCBhbmQgeSB3aWxsIGJlIHNldCB0byB4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSB4IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gLSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIHkgYXhpc1xuICAgICAqL1xuICAgIHNldCh4LCB5KVxuICAgIHtcbiAgICAgICAgdGhpcy54ID0geCB8fCAwO1xuICAgICAgICB0aGlzLnkgPSB5IHx8ICgoeSAhPT0gMCkgPyB0aGlzLnggOiAwKTtcbiAgICB9XG5cbn1cbiIsImltcG9ydCBQb2ludCBmcm9tICcuL1BvaW50JztcblxuLyoqXG4gKiBUaGUgcGl4aSBNYXRyaXggY2xhc3MgYXMgYW4gb2JqZWN0LCB3aGljaCBtYWtlcyBpdCBhIGxvdCBmYXN0ZXIsXG4gKiBoZXJlIGlzIGEgcmVwcmVzZW50YXRpb24gb2YgaXQgOlxuICogfCBhIHwgYiB8IHR4fFxuICogfCBjIHwgZCB8IHR5fFxuICogfCAwIHwgMCB8IDEgfFxuICpcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIFBJWElcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0cml4XG57XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmEgPSAxO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYiA9IDA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jID0gMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmQgPSAxO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHggPSAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHkgPSAwO1xuXG4gICAgICAgIHRoaXMuYXJyYXkgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBNYXRyaXggb2JqZWN0IGJhc2VkIG9uIHRoZSBnaXZlbiBhcnJheS4gVGhlIEVsZW1lbnQgdG8gTWF0cml4IG1hcHBpbmcgb3JkZXIgaXMgYXMgZm9sbG93czpcbiAgICAgKlxuICAgICAqIGEgPSBhcnJheVswXVxuICAgICAqIGIgPSBhcnJheVsxXVxuICAgICAqIGMgPSBhcnJheVszXVxuICAgICAqIGQgPSBhcnJheVs0XVxuICAgICAqIHR4ID0gYXJyYXlbMl1cbiAgICAgKiB0eSA9IGFycmF5WzVdXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSBhcnJheSAtIFRoZSBhcnJheSB0aGF0IHRoZSBtYXRyaXggd2lsbCBiZSBwb3B1bGF0ZWQgZnJvbS5cbiAgICAgKi9cbiAgICBmcm9tQXJyYXkoYXJyYXkpXG4gICAge1xuICAgICAgICB0aGlzLmEgPSBhcnJheVswXTtcbiAgICAgICAgdGhpcy5iID0gYXJyYXlbMV07XG4gICAgICAgIHRoaXMuYyA9IGFycmF5WzNdO1xuICAgICAgICB0aGlzLmQgPSBhcnJheVs0XTtcbiAgICAgICAgdGhpcy50eCA9IGFycmF5WzJdO1xuICAgICAgICB0aGlzLnR5ID0gYXJyYXlbNV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0cyB0aGUgbWF0cml4IHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhIC0gTWF0cml4IGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gTWF0cml4IGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjIC0gTWF0cml4IGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkIC0gTWF0cml4IGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eCAtIE1hdHJpeCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdHkgLSBNYXRyaXggY29tcG9uZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBzZXQoYSwgYiwgYywgZCwgdHgsIHR5KVxuICAgIHtcbiAgICAgICAgdGhpcy5hID0gYTtcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICAgICAgdGhpcy5jID0gYztcbiAgICAgICAgdGhpcy5kID0gZDtcbiAgICAgICAgdGhpcy50eCA9IHR4O1xuICAgICAgICB0aGlzLnR5ID0gdHk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBmcm9tIHRoZSBjdXJyZW50IE1hdHJpeCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRyYW5zcG9zZSAtIFdoZXRoZXIgd2UgbmVlZCB0byB0cmFuc3Bvc2UgdGhlIG1hdHJpeCBvciBub3RcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gW291dD1uZXcgRmxvYXQzMkFycmF5KDkpXSAtIElmIHByb3ZpZGVkIHRoZSBhcnJheSB3aWxsIGJlIGFzc2lnbmVkIHRvIG91dFxuICAgICAqIEByZXR1cm4ge251bWJlcltdfSB0aGUgbmV3bHkgY3JlYXRlZCBhcnJheSB3aGljaCBjb250YWlucyB0aGUgbWF0cml4XG4gICAgICovXG4gICAgdG9BcnJheSh0cmFuc3Bvc2UsIG91dClcbiAgICB7XG4gICAgICAgIGlmICghdGhpcy5hcnJheSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5hcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoOSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcnJheSA9IG91dCB8fCB0aGlzLmFycmF5O1xuXG4gICAgICAgIGlmICh0cmFuc3Bvc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFycmF5WzBdID0gdGhpcy5hO1xuICAgICAgICAgICAgYXJyYXlbMV0gPSB0aGlzLmI7XG4gICAgICAgICAgICBhcnJheVsyXSA9IDA7XG4gICAgICAgICAgICBhcnJheVszXSA9IHRoaXMuYztcbiAgICAgICAgICAgIGFycmF5WzRdID0gdGhpcy5kO1xuICAgICAgICAgICAgYXJyYXlbNV0gPSAwO1xuICAgICAgICAgICAgYXJyYXlbNl0gPSB0aGlzLnR4O1xuICAgICAgICAgICAgYXJyYXlbN10gPSB0aGlzLnR5O1xuICAgICAgICAgICAgYXJyYXlbOF0gPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgYXJyYXlbMF0gPSB0aGlzLmE7XG4gICAgICAgICAgICBhcnJheVsxXSA9IHRoaXMuYztcbiAgICAgICAgICAgIGFycmF5WzJdID0gdGhpcy50eDtcbiAgICAgICAgICAgIGFycmF5WzNdID0gdGhpcy5iO1xuICAgICAgICAgICAgYXJyYXlbNF0gPSB0aGlzLmQ7XG4gICAgICAgICAgICBhcnJheVs1XSA9IHRoaXMudHk7XG4gICAgICAgICAgICBhcnJheVs2XSA9IDA7XG4gICAgICAgICAgICBhcnJheVs3XSA9IDA7XG4gICAgICAgICAgICBhcnJheVs4XSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgbmV3IHBvc2l0aW9uIHdpdGggdGhlIGN1cnJlbnQgdHJhbnNmb3JtYXRpb24gYXBwbGllZC5cbiAgICAgKiBDYW4gYmUgdXNlZCB0byBnbyBmcm9tIGEgY2hpbGQncyBjb29yZGluYXRlIHNwYWNlIHRvIHRoZSB3b3JsZCBjb29yZGluYXRlIHNwYWNlLiAoZS5nLiByZW5kZXJpbmcpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IHBvcyAtIFRoZSBvcmlnaW5cbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IFtuZXdQb3NdIC0gVGhlIHBvaW50IHRoYXQgdGhlIG5ldyBwb3NpdGlvbiBpcyBhc3NpZ25lZCB0byAoYWxsb3dlZCB0byBiZSBzYW1lIGFzIGlucHV0KVxuICAgICAqIEByZXR1cm4ge1BJWEkuUG9pbnR9IFRoZSBuZXcgcG9pbnQsIHRyYW5zZm9ybWVkIHRocm91Z2ggdGhpcyBtYXRyaXhcbiAgICAgKi9cbiAgICBhcHBseShwb3MsIG5ld1BvcylcbiAgICB7XG4gICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUG9pbnQoKTtcblxuICAgICAgICBjb25zdCB4ID0gcG9zLng7XG4gICAgICAgIGNvbnN0IHkgPSBwb3MueTtcblxuICAgICAgICBuZXdQb3MueCA9ICh0aGlzLmEgKiB4KSArICh0aGlzLmMgKiB5KSArIHRoaXMudHg7XG4gICAgICAgIG5ld1Bvcy55ID0gKHRoaXMuYiAqIHgpICsgKHRoaXMuZCAqIHkpICsgdGhpcy50eTtcblxuICAgICAgICByZXR1cm4gbmV3UG9zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIG5ldyBwb3NpdGlvbiB3aXRoIHRoZSBpbnZlcnNlIG9mIHRoZSBjdXJyZW50IHRyYW5zZm9ybWF0aW9uIGFwcGxpZWQuXG4gICAgICogQ2FuIGJlIHVzZWQgdG8gZ28gZnJvbSB0aGUgd29ybGQgY29vcmRpbmF0ZSBzcGFjZSB0byBhIGNoaWxkJ3MgY29vcmRpbmF0ZSBzcGFjZS4gKGUuZy4gaW5wdXQpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IHBvcyAtIFRoZSBvcmlnaW5cbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnR9IFtuZXdQb3NdIC0gVGhlIHBvaW50IHRoYXQgdGhlIG5ldyBwb3NpdGlvbiBpcyBhc3NpZ25lZCB0byAoYWxsb3dlZCB0byBiZSBzYW1lIGFzIGlucHV0KVxuICAgICAqIEByZXR1cm4ge1BJWEkuUG9pbnR9IFRoZSBuZXcgcG9pbnQsIGludmVyc2UtdHJhbnNmb3JtZWQgdGhyb3VnaCB0aGlzIG1hdHJpeFxuICAgICAqL1xuICAgIGFwcGx5SW52ZXJzZShwb3MsIG5ld1BvcylcbiAgICB7XG4gICAgICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUG9pbnQoKTtcblxuICAgICAgICBjb25zdCBpZCA9IDEgLyAoKHRoaXMuYSAqIHRoaXMuZCkgKyAodGhpcy5jICogLXRoaXMuYikpO1xuXG4gICAgICAgIGNvbnN0IHggPSBwb3MueDtcbiAgICAgICAgY29uc3QgeSA9IHBvcy55O1xuXG4gICAgICAgIG5ld1Bvcy54ID0gKHRoaXMuZCAqIGlkICogeCkgKyAoLXRoaXMuYyAqIGlkICogeSkgKyAoKCh0aGlzLnR5ICogdGhpcy5jKSAtICh0aGlzLnR4ICogdGhpcy5kKSkgKiBpZCk7XG4gICAgICAgIG5ld1Bvcy55ID0gKHRoaXMuYSAqIGlkICogeSkgKyAoLXRoaXMuYiAqIGlkICogeCkgKyAoKCgtdGhpcy50eSAqIHRoaXMuYSkgKyAodGhpcy50eCAqIHRoaXMuYikpICogaWQpO1xuXG4gICAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhbnNsYXRlcyB0aGUgbWF0cml4IG9uIHRoZSB4IGFuZCB5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggSG93IG11Y2ggdG8gdHJhbnNsYXRlIHggYnlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSBIb3cgbXVjaCB0byB0cmFuc2xhdGUgeSBieVxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIHRyYW5zbGF0ZSh4LCB5KVxuICAgIHtcbiAgICAgICAgdGhpcy50eCArPSB4O1xuICAgICAgICB0aGlzLnR5ICs9IHk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbGllcyBhIHNjYWxlIHRyYW5zZm9ybWF0aW9uIHRvIHRoZSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgYW1vdW50IHRvIHNjYWxlIGhvcml6b250YWxseVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IFRoZSBhbW91bnQgdG8gc2NhbGUgdmVydGljYWxseVxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIHNjYWxlKHgsIHkpXG4gICAge1xuICAgICAgICB0aGlzLmEgKj0geDtcbiAgICAgICAgdGhpcy5kICo9IHk7XG4gICAgICAgIHRoaXMuYyAqPSB4O1xuICAgICAgICB0aGlzLmIgKj0geTtcbiAgICAgICAgdGhpcy50eCAqPSB4O1xuICAgICAgICB0aGlzLnR5ICo9IHk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbGllcyBhIHJvdGF0aW9uIHRyYW5zZm9ybWF0aW9uIHRvIHRoZSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgaW4gcmFkaWFucy5cbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICByb3RhdGUoYW5nbGUpXG4gICAge1xuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICBjb25zdCBhMSA9IHRoaXMuYTtcbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmM7XG4gICAgICAgIGNvbnN0IHR4MSA9IHRoaXMudHg7XG5cbiAgICAgICAgdGhpcy5hID0gKGExICogY29zKSAtICh0aGlzLmIgKiBzaW4pO1xuICAgICAgICB0aGlzLmIgPSAoYTEgKiBzaW4pICsgKHRoaXMuYiAqIGNvcyk7XG4gICAgICAgIHRoaXMuYyA9IChjMSAqIGNvcykgLSAodGhpcy5kICogc2luKTtcbiAgICAgICAgdGhpcy5kID0gKGMxICogc2luKSArICh0aGlzLmQgKiBjb3MpO1xuICAgICAgICB0aGlzLnR4ID0gKHR4MSAqIGNvcykgLSAodGhpcy50eSAqIHNpbik7XG4gICAgICAgIHRoaXMudHkgPSAodHgxICogc2luKSArICh0aGlzLnR5ICogY29zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIHRoZSBnaXZlbiBNYXRyaXggdG8gdGhpcyBNYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuTWF0cml4fSBtYXRyaXggLSBUaGUgbWF0cml4IHRvIGFwcGVuZC5cbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gVGhpcyBtYXRyaXguIEdvb2QgZm9yIGNoYWluaW5nIG1ldGhvZCBjYWxscy5cbiAgICAgKi9cbiAgICBhcHBlbmQobWF0cml4KVxuICAgIHtcbiAgICAgICAgY29uc3QgYTEgPSB0aGlzLmE7XG4gICAgICAgIGNvbnN0IGIxID0gdGhpcy5iO1xuICAgICAgICBjb25zdCBjMSA9IHRoaXMuYztcbiAgICAgICAgY29uc3QgZDEgPSB0aGlzLmQ7XG5cbiAgICAgICAgdGhpcy5hID0gKG1hdHJpeC5hICogYTEpICsgKG1hdHJpeC5iICogYzEpO1xuICAgICAgICB0aGlzLmIgPSAobWF0cml4LmEgKiBiMSkgKyAobWF0cml4LmIgKiBkMSk7XG4gICAgICAgIHRoaXMuYyA9IChtYXRyaXguYyAqIGExKSArIChtYXRyaXguZCAqIGMxKTtcbiAgICAgICAgdGhpcy5kID0gKG1hdHJpeC5jICogYjEpICsgKG1hdHJpeC5kICogZDEpO1xuXG4gICAgICAgIHRoaXMudHggPSAobWF0cml4LnR4ICogYTEpICsgKG1hdHJpeC50eSAqIGMxKSArIHRoaXMudHg7XG4gICAgICAgIHRoaXMudHkgPSAobWF0cml4LnR4ICogYjEpICsgKG1hdHJpeC50eSAqIGQxKSArIHRoaXMudHk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgbWF0cml4IGJhc2VkIG9uIGFsbCB0aGUgYXZhaWxhYmxlIHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gUG9zaXRpb24gb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gUG9zaXRpb24gb24gdGhlIHkgYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwaXZvdFggLSBQaXZvdCBvbiB0aGUgeCBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBpdm90WSAtIFBpdm90IG9uIHRoZSB5IGF4aXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2NhbGVYIC0gU2NhbGUgb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY2FsZVkgLSBTY2FsZSBvbiB0aGUgeSBheGlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdGF0aW9uIC0gUm90YXRpb24gaW4gcmFkaWFuc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBza2V3WCAtIFNrZXcgb24gdGhlIHggYXhpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBza2V3WSAtIFNrZXcgb24gdGhlIHkgYXhpc1xuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIHNldFRyYW5zZm9ybSh4LCB5LCBwaXZvdFgsIHBpdm90WSwgc2NhbGVYLCBzY2FsZVksIHJvdGF0aW9uLCBza2V3WCwgc2tld1kpXG4gICAge1xuICAgICAgICBjb25zdCBzciA9IE1hdGguc2luKHJvdGF0aW9uKTtcbiAgICAgICAgY29uc3QgY3IgPSBNYXRoLmNvcyhyb3RhdGlvbik7XG4gICAgICAgIGNvbnN0IGN5ID0gTWF0aC5jb3Moc2tld1kpO1xuICAgICAgICBjb25zdCBzeSA9IE1hdGguc2luKHNrZXdZKTtcbiAgICAgICAgY29uc3QgbnN4ID0gLU1hdGguc2luKHNrZXdYKTtcbiAgICAgICAgY29uc3QgY3ggPSBNYXRoLmNvcyhza2V3WCk7XG5cbiAgICAgICAgY29uc3QgYSA9IGNyICogc2NhbGVYO1xuICAgICAgICBjb25zdCBiID0gc3IgKiBzY2FsZVg7XG4gICAgICAgIGNvbnN0IGMgPSAtc3IgKiBzY2FsZVk7XG4gICAgICAgIGNvbnN0IGQgPSBjciAqIHNjYWxlWTtcblxuICAgICAgICB0aGlzLmEgPSAoY3kgKiBhKSArIChzeSAqIGMpO1xuICAgICAgICB0aGlzLmIgPSAoY3kgKiBiKSArIChzeSAqIGQpO1xuICAgICAgICB0aGlzLmMgPSAobnN4ICogYSkgKyAoY3ggKiBjKTtcbiAgICAgICAgdGhpcy5kID0gKG5zeCAqIGIpICsgKGN4ICogZCk7XG5cbiAgICAgICAgdGhpcy50eCA9IHggKyAoKHBpdm90WCAqIGEpICsgKHBpdm90WSAqIGMpKTtcbiAgICAgICAgdGhpcy50eSA9IHkgKyAoKHBpdm90WCAqIGIpICsgKHBpdm90WSAqIGQpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmVwZW5kcyB0aGUgZ2l2ZW4gTWF0cml4IHRvIHRoaXMgTWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLk1hdHJpeH0gbWF0cml4IC0gVGhlIG1hdHJpeCB0byBwcmVwZW5kXG4gICAgICogQHJldHVybiB7UElYSS5NYXRyaXh9IFRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgcHJlcGVuZChtYXRyaXgpXG4gICAge1xuICAgICAgICBjb25zdCB0eDEgPSB0aGlzLnR4O1xuXG4gICAgICAgIGlmIChtYXRyaXguYSAhPT0gMSB8fCBtYXRyaXguYiAhPT0gMCB8fCBtYXRyaXguYyAhPT0gMCB8fCBtYXRyaXguZCAhPT0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgYTEgPSB0aGlzLmE7XG4gICAgICAgICAgICBjb25zdCBjMSA9IHRoaXMuYztcblxuICAgICAgICAgICAgdGhpcy5hID0gKGExICogbWF0cml4LmEpICsgKHRoaXMuYiAqIG1hdHJpeC5jKTtcbiAgICAgICAgICAgIHRoaXMuYiA9IChhMSAqIG1hdHJpeC5iKSArICh0aGlzLmIgKiBtYXRyaXguZCk7XG4gICAgICAgICAgICB0aGlzLmMgPSAoYzEgKiBtYXRyaXguYSkgKyAodGhpcy5kICogbWF0cml4LmMpO1xuICAgICAgICAgICAgdGhpcy5kID0gKGMxICogbWF0cml4LmIpICsgKHRoaXMuZCAqIG1hdHJpeC5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHggPSAodHgxICogbWF0cml4LmEpICsgKHRoaXMudHkgKiBtYXRyaXguYykgKyBtYXRyaXgudHg7XG4gICAgICAgIHRoaXMudHkgPSAodHgxICogbWF0cml4LmIpICsgKHRoaXMudHkgKiBtYXRyaXguZCkgKyBtYXRyaXgudHk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVjb21wb3NlcyB0aGUgbWF0cml4ICh4LCB5LCBzY2FsZVgsIHNjYWxlWSwgYW5kIHJvdGF0aW9uKSBhbmQgc2V0cyB0aGUgcHJvcGVydGllcyBvbiB0byBhIHRyYW5zZm9ybS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5UcmFuc2Zvcm18UElYSS5UcmFuc2Zvcm1TdGF0aWN9IHRyYW5zZm9ybSAtIFRoZSB0cmFuc2Zvcm0gdG8gYXBwbHkgdGhlIHByb3BlcnRpZXMgdG8uXG4gICAgICogQHJldHVybiB7UElYSS5UcmFuc2Zvcm18UElYSS5UcmFuc2Zvcm1TdGF0aWN9IFRoZSB0cmFuc2Zvcm0gd2l0aCB0aGUgbmV3bHkgYXBwbGllZCBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgZGVjb21wb3NlKHRyYW5zZm9ybSlcbiAgICB7XG4gICAgICAgIC8vIHNvcnQgb3V0IHJvdGF0aW9uIC8gc2tldy4uXG4gICAgICAgIGNvbnN0IGEgPSB0aGlzLmE7XG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLmI7XG4gICAgICAgIGNvbnN0IGMgPSB0aGlzLmM7XG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLmQ7XG5cbiAgICAgICAgY29uc3Qgc2tld1ggPSAtTWF0aC5hdGFuMigtYywgZCk7XG4gICAgICAgIGNvbnN0IHNrZXdZID0gTWF0aC5hdGFuMihiLCBhKTtcblxuICAgICAgICBjb25zdCBkZWx0YSA9IE1hdGguYWJzKHNrZXdYICsgc2tld1kpO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IDAuMDAwMDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbiA9IHNrZXdZO1xuXG4gICAgICAgICAgICBpZiAoYSA8IDAgJiYgZCA+PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbiArPSAodHJhbnNmb3JtLnJvdGF0aW9uIDw9IDApID8gTWF0aC5QSSA6IC1NYXRoLlBJO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cmFuc2Zvcm0uc2tldy54ID0gdHJhbnNmb3JtLnNrZXcueSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0cmFuc2Zvcm0uc2tldy54ID0gc2tld1g7XG4gICAgICAgICAgICB0cmFuc2Zvcm0uc2tldy55ID0gc2tld1k7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBuZXh0IHNldCBzY2FsZVxuICAgICAgICB0cmFuc2Zvcm0uc2NhbGUueCA9IE1hdGguc3FydCgoYSAqIGEpICsgKGIgKiBiKSk7XG4gICAgICAgIHRyYW5zZm9ybS5zY2FsZS55ID0gTWF0aC5zcXJ0KChjICogYykgKyAoZCAqIGQpKTtcblxuICAgICAgICAvLyBuZXh0IHNldCBwb3NpdGlvblxuICAgICAgICB0cmFuc2Zvcm0ucG9zaXRpb24ueCA9IHRoaXMudHg7XG4gICAgICAgIHRyYW5zZm9ybS5wb3NpdGlvbi55ID0gdGhpcy50eTtcblxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmVydHMgdGhpcyBtYXRyaXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIGludmVydCgpXG4gICAge1xuICAgICAgICBjb25zdCBhMSA9IHRoaXMuYTtcbiAgICAgICAgY29uc3QgYjEgPSB0aGlzLmI7XG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jO1xuICAgICAgICBjb25zdCBkMSA9IHRoaXMuZDtcbiAgICAgICAgY29uc3QgdHgxID0gdGhpcy50eDtcbiAgICAgICAgY29uc3QgbiA9IChhMSAqIGQxKSAtIChiMSAqIGMxKTtcblxuICAgICAgICB0aGlzLmEgPSBkMSAvIG47XG4gICAgICAgIHRoaXMuYiA9IC1iMSAvIG47XG4gICAgICAgIHRoaXMuYyA9IC1jMSAvIG47XG4gICAgICAgIHRoaXMuZCA9IGExIC8gbjtcbiAgICAgICAgdGhpcy50eCA9ICgoYzEgKiB0aGlzLnR5KSAtIChkMSAqIHR4MSkpIC8gbjtcbiAgICAgICAgdGhpcy50eSA9IC0oKGExICogdGhpcy50eSkgLSAoYjEgKiB0eDEpKSAvIG47XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoaXMgTWF0aXggdG8gYW4gaWRlbnRpdHkgKGRlZmF1bHQpIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGlzIG1hdHJpeC4gR29vZCBmb3IgY2hhaW5pbmcgbWV0aG9kIGNhbGxzLlxuICAgICAqL1xuICAgIGlkZW50aXR5KClcbiAgICB7XG4gICAgICAgIHRoaXMuYSA9IDE7XG4gICAgICAgIHRoaXMuYiA9IDA7XG4gICAgICAgIHRoaXMuYyA9IDA7XG4gICAgICAgIHRoaXMuZCA9IDE7XG4gICAgICAgIHRoaXMudHggPSAwO1xuICAgICAgICB0aGlzLnR5ID0gMDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IE1hdHJpeCBvYmplY3Qgd2l0aCB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhpcyBvbmUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLk1hdHJpeH0gQSBjb3B5IG9mIHRoaXMgbWF0cml4LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHMuXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeCgpO1xuXG4gICAgICAgIG1hdHJpeC5hID0gdGhpcy5hO1xuICAgICAgICBtYXRyaXguYiA9IHRoaXMuYjtcbiAgICAgICAgbWF0cml4LmMgPSB0aGlzLmM7XG4gICAgICAgIG1hdHJpeC5kID0gdGhpcy5kO1xuICAgICAgICBtYXRyaXgudHggPSB0aGlzLnR4O1xuICAgICAgICBtYXRyaXgudHkgPSB0aGlzLnR5O1xuXG4gICAgICAgIHJldHVybiBtYXRyaXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlcyB0aGUgdmFsdWVzIG9mIHRoZSBnaXZlbiBtYXRyaXggdG8gYmUgdGhlIHNhbWUgYXMgdGhlIG9uZXMgaW4gdGhpcyBtYXRyaXhcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UElYSS5NYXRyaXh9IG1hdHJpeCAtIFRoZSBtYXRyaXggdG8gY29weSBmcm9tLlxuICAgICAqIEByZXR1cm4ge1BJWEkuTWF0cml4fSBUaGUgbWF0cml4IGdpdmVuIGluIHBhcmFtZXRlciB3aXRoIGl0cyB2YWx1ZXMgdXBkYXRlZC5cbiAgICAgKi9cbiAgICBjb3B5KG1hdHJpeClcbiAgICB7XG4gICAgICAgIG1hdHJpeC5hID0gdGhpcy5hO1xuICAgICAgICBtYXRyaXguYiA9IHRoaXMuYjtcbiAgICAgICAgbWF0cml4LmMgPSB0aGlzLmM7XG4gICAgICAgIG1hdHJpeC5kID0gdGhpcy5kO1xuICAgICAgICBtYXRyaXgudHggPSB0aGlzLnR4O1xuICAgICAgICBtYXRyaXgudHkgPSB0aGlzLnR5O1xuXG4gICAgICAgIHJldHVybiBtYXRyaXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBkZWZhdWx0IChpZGVudGl0eSkgbWF0cml4XG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGNvbnN0XG4gICAgICovXG4gICAgc3RhdGljIGdldCBJREVOVElUWSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgdGVtcCBtYXRyaXhcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAY29uc3RcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFRFTVBfTUFUUklYKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KCk7XG4gICAgfVxufVxuIiwiLy8gWW91ciBmcmllbmRseSBuZWlnaGJvdXIgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGloZWRyYWxfZ3JvdXAgb2Ygb3JkZXIgMTZcbmltcG9ydCBNYXRyaXggZnJvbSAnLi9NYXRyaXgnO1xuXG5jb25zdCB1eCA9IFsxLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxLCAxLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxXTtcbmNvbnN0IHV5ID0gWzAsIDEsIDEsIDEsIDAsIC0xLCAtMSwgLTEsIDAsIDEsIDEsIDEsIDAsIC0xLCAtMSwgLTFdO1xuY29uc3QgdnggPSBbMCwgLTEsIC0xLCAtMSwgMCwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMCwgLTEsIC0xLCAtMV07XG5jb25zdCB2eSA9IFsxLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxLCAtMSwgLTEsIDAsIDEsIDEsIDEsIDAsIC0xXTtcbmNvbnN0IHRlbXBNYXRyaWNlcyA9IFtdO1xuXG5jb25zdCBtdWwgPSBbXTtcblxuZnVuY3Rpb24gc2lnbnVtKHgpXG57XG4gICAgaWYgKHggPCAwKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBpZiAoeCA+IDApXG4gICAge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gaW5pdCgpXG57XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKVxuICAgIHtcbiAgICAgICAgY29uc3Qgcm93ID0gW107XG5cbiAgICAgICAgbXVsLnB1c2gocm93KTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDE2OyBqKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IF91eCA9IHNpZ251bSgodXhbaV0gKiB1eFtqXSkgKyAodnhbaV0gKiB1eVtqXSkpO1xuICAgICAgICAgICAgY29uc3QgX3V5ID0gc2lnbnVtKCh1eVtpXSAqIHV4W2pdKSArICh2eVtpXSAqIHV5W2pdKSk7XG4gICAgICAgICAgICBjb25zdCBfdnggPSBzaWdudW0oKHV4W2ldICogdnhbal0pICsgKHZ4W2ldICogdnlbal0pKTtcbiAgICAgICAgICAgIGNvbnN0IF92eSA9IHNpZ251bSgodXlbaV0gKiB2eFtqXSkgKyAodnlbaV0gKiB2eVtqXSkpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IDE2OyBrKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKHV4W2tdID09PSBfdXggJiYgdXlba10gPT09IF91eSAmJiB2eFtrXSA9PT0gX3Z4ICYmIHZ5W2tdID09PSBfdnkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChrKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKVxuICAgIHtcbiAgICAgICAgY29uc3QgbWF0ID0gbmV3IE1hdHJpeCgpO1xuXG4gICAgICAgIG1hdC5zZXQodXhbaV0sIHV5W2ldLCB2eFtpXSwgdnlbaV0sIDAsIDApO1xuICAgICAgICB0ZW1wTWF0cmljZXMucHVzaChtYXQpO1xuICAgIH1cbn1cblxuaW5pdCgpO1xuXG4vKipcbiAqIEltcGxlbWVudHMgRGloZWRyYWwgR3JvdXAgRF84LCBzZWUgW2dyb3VwIEQ0XXtAbGluayBodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL0RpaGVkcmFsR3JvdXBENC5odG1sfSxcbiAqIEQ4IGlzIHRoZSBzYW1lIGJ1dCB3aXRoIGRpYWdvbmFscy4gVXNlZCBmb3IgdGV4dHVyZSByb3RhdGlvbnMuXG4gKlxuICogVmVjdG9yIHhYKGkpLCB4WShpKSBpcyBVLWF4aXMgb2Ygc3ByaXRlIHdpdGggcm90YXRpb24gaVxuICogVmVjdG9yIHlZKGkpLCB5WShpKSBpcyBWLWF4aXMgb2Ygc3ByaXRlIHdpdGggcm90YXRpb24gaVxuICogUm90YXRpb25zOiAwIGdyYWQgKDApLCA5MCBncmFkICgyKSwgMTgwIGdyYWQgKDQpLCAyNzAgZ3JhZCAoNilcbiAqIE1pcnJvcnM6IHZlcnRpY2FsICg4KSwgbWFpbiBkaWFnb25hbCAoMTApLCBob3Jpem9udGFsICgxMiksIHJldmVyc2UgZGlhZ29uYWwgKDE0KVxuICogVGhpcyBpcyB0aGUgc21hbGwgcGFydCBvZiBnYW1lb2Zib21icy5jb20gcG9ydGFsIHN5c3RlbS4gSXQgd29ya3MuXG4gKlxuICogQGF1dGhvciBJdmFuIEBpdmFucG9wZWx5c2hldlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5jb25zdCBHcm91cEQ4ID0ge1xuICAgIEU6IDAsXG4gICAgU0U6IDEsXG4gICAgUzogMixcbiAgICBTVzogMyxcbiAgICBXOiA0LFxuICAgIE5XOiA1LFxuICAgIE46IDYsXG4gICAgTkU6IDcsXG4gICAgTUlSUk9SX1ZFUlRJQ0FMOiA4LFxuICAgIE1JUlJPUl9IT1JJWk9OVEFMOiAxMixcbiAgICB1WDogKGluZCkgPT4gdXhbaW5kXSxcbiAgICB1WTogKGluZCkgPT4gdXlbaW5kXSxcbiAgICB2WDogKGluZCkgPT4gdnhbaW5kXSxcbiAgICB2WTogKGluZCkgPT4gdnlbaW5kXSxcbiAgICBpbnY6IChyb3RhdGlvbikgPT5cbiAgICB7XG4gICAgICAgIGlmIChyb3RhdGlvbiAmIDgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiByb3RhdGlvbiAmIDE1O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICgtcm90YXRpb24pICYgNztcbiAgICB9LFxuICAgIGFkZDogKHJvdGF0aW9uU2Vjb25kLCByb3RhdGlvbkZpcnN0KSA9PiBtdWxbcm90YXRpb25TZWNvbmRdW3JvdGF0aW9uRmlyc3RdLFxuICAgIHN1YjogKHJvdGF0aW9uU2Vjb25kLCByb3RhdGlvbkZpcnN0KSA9PiBtdWxbcm90YXRpb25TZWNvbmRdW0dyb3VwRDguaW52KHJvdGF0aW9uRmlyc3QpXSxcblxuICAgIC8qKlxuICAgICAqIEFkZHMgMTgwIGRlZ3JlZXMgdG8gcm90YXRpb24uIENvbW11dGF0aXZlIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBQSVhJLkdyb3VwRDhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm90YXRpb24gLSBUaGUgbnVtYmVyIHRvIHJvdGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByb3RhdGVkIG51bWJlclxuICAgICAqL1xuICAgIHJvdGF0ZTE4MDogKHJvdGF0aW9uKSA9PiByb3RhdGlvbiBeIDQsXG5cbiAgICAvKipcbiAgICAgKiBJIGRvbnQga25vdyB3aHkgc29tZXRpbWVzIHdpZHRoIGFuZCBoZWlnaHRzIG5lZWRzIHRvIGJlIHN3YXBwZWQuIFdlJ2xsIGZpeCBpdCBsYXRlci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBQSVhJLkdyb3VwRDhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm90YXRpb24gLSBUaGUgbnVtYmVyIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgd2lkdGgvaGVpZ2h0IHNob3VsZCBiZSBzd2FwcGVkLlxuICAgICAqL1xuICAgIGlzU3dhcFdpZHRoSGVpZ2h0OiAocm90YXRpb24pID0+IChyb3RhdGlvbiAmIDMpID09PSAyLFxuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIFBJWEkuR3JvdXBEOFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeCAtIFRPRE9cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHkgLSBUT0RPXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRPRE9cbiAgICAgKi9cbiAgICBieURpcmVjdGlvbjogKGR4LCBkeSkgPT5cbiAgICB7XG4gICAgICAgIGlmIChNYXRoLmFicyhkeCkgKiAyIDw9IE1hdGguYWJzKGR5KSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGR5ID49IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguUztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguTjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkeSkgKiAyIDw9IE1hdGguYWJzKGR4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGR4ID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR3JvdXBEOC5FO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gR3JvdXBEOC5XO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5ID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGR4ID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gR3JvdXBEOC5TRTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEdyb3VwRDguU1c7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHggPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gR3JvdXBEOC5ORTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBHcm91cEQ4Lk5XO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIZWxwcyBzcHJpdGUgdG8gY29tcGVuc2F0ZSB0ZXh0dXJlIHBhY2tlciByb3RhdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBQSVhJLkdyb3VwRDhcbiAgICAgKiBAcGFyYW0ge1BJWEkuTWF0cml4fSBtYXRyaXggLSBzcHJpdGUgd29ybGQgbWF0cml4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdGF0aW9uIC0gVGhlIHJvdGF0aW9uIGZhY3RvciB0byB1c2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR4IC0gc3ByaXRlIGFuY2hvcmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eSAtIHNwcml0ZSBhbmNob3JpbmdcbiAgICAgKi9cbiAgICBtYXRyaXhBcHBlbmRSb3RhdGlvbkludjogKG1hdHJpeCwgcm90YXRpb24sIHR4ID0gMCwgdHkgPSAwKSA9PlxuICAgIHtcbiAgICAgICAgLy8gUGFja2VyIHVzZWQgXCJyb3RhdGlvblwiLCB3ZSB1c2UgXCJpbnYocm90YXRpb24pXCJcbiAgICAgICAgY29uc3QgbWF0ID0gdGVtcE1hdHJpY2VzW0dyb3VwRDguaW52KHJvdGF0aW9uKV07XG5cbiAgICAgICAgbWF0LnR4ID0gdHg7XG4gICAgICAgIG1hdC50eSA9IHR5O1xuICAgICAgICBtYXRyaXguYXBwZW5kKG1hdCk7XG4gICAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdyb3VwRDg7XG4iLCJpbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi8uLi9jb25zdCc7XG5cbi8qKlxuICogUmVjdGFuZ2xlIG9iamVjdCBpcyBhbiBhcmVhIGRlZmluZWQgYnkgaXRzIHBvc2l0aW9uLCBhcyBpbmRpY2F0ZWQgYnkgaXRzIHRvcC1sZWZ0IGNvcm5lclxuICogcG9pbnQgKHgsIHkpIGFuZCBieSBpdHMgd2lkdGggYW5kIGl0cyBoZWlnaHQuXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVcbntcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSB1cHBlci1sZWZ0IGNvcm5lciBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgdXBwZXItbGVmdCBjb3JuZXIgb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbd2lkdGg9MF0gLSBUaGUgb3ZlcmFsbCB3aWR0aCBvZiB0aGlzIHJlY3RhbmdsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbaGVpZ2h0PTBdIC0gVGhlIG92ZXJhbGwgaGVpZ2h0IG9mIHRoaXMgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnggPSB4O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdHlwZSBvZiB0aGUgb2JqZWN0LCBtYWlubHkgdXNlZCB0byBhdm9pZCBgaW5zdGFuY2VvZmAgY2hlY2tzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBkZWZhdWx0IFBJWEkuU0hBUEVTLlJFQ1RcbiAgICAgICAgICogQHNlZSBQSVhJLlNIQVBFU1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eXBlID0gU0hBUEVTLlJFQ1Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgbGVmdCBlZGdlIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgbGVmdCgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy54O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCByaWdodCgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSB0b3AgZWRnZSBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IHRvcCgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGJvdHRvbSBlZGdlIG9mIHRoZSByZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgYm90dG9tKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGNvbnN0YW50IGVtcHR5IHJlY3RhbmdsZS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEVNUFRZKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKDAsIDAsIDAsIDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIFJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5SZWN0YW5nbGV9IGEgY29weSBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGUodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYW5vdGhlciByZWN0YW5nbGUgdG8gdGhpcyBvbmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuUmVjdGFuZ2xlfSByZWN0YW5nbGUgLSBUaGUgcmVjdGFuZ2xlIHRvIGNvcHkuXG4gICAgICogQHJldHVybiB7UElYSS5SZWN0YW5nbGV9IFJldHVybnMgaXRzZWxmLlxuICAgICAqL1xuICAgIGNvcHkocmVjdGFuZ2xlKVxuICAgIHtcbiAgICAgICAgdGhpcy54ID0gcmVjdGFuZ2xlLng7XG4gICAgICAgIHRoaXMueSA9IHJlY3RhbmdsZS55O1xuICAgICAgICB0aGlzLndpZHRoID0gcmVjdGFuZ2xlLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHJlY3RhbmdsZS5oZWlnaHQ7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBSZWN0YW5nbGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdG8gdGVzdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIHgveSBjb29yZGluYXRlcyBhcmUgd2l0aGluIHRoaXMgUmVjdGFuZ2xlXG4gICAgICovXG4gICAgY29udGFpbnMoeCwgeSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLndpZHRoIDw9IDAgfHwgdGhpcy5oZWlnaHQgPD0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHggPj0gdGhpcy54ICYmIHggPCB0aGlzLnggKyB0aGlzLndpZHRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoeSA+PSB0aGlzLnkgJiYgeSA8IHRoaXMueSArIHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhZHMgdGhlIHJlY3RhbmdsZSBtYWtpbmcgaXQgZ3JvdyBpbiBhbGwgZGlyZWN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nWCAtIFRoZSBob3Jpem9udGFsIHBhZGRpbmcgYW1vdW50LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nWSAtIFRoZSB2ZXJ0aWNhbCBwYWRkaW5nIGFtb3VudC5cbiAgICAgKi9cbiAgICBwYWQocGFkZGluZ1gsIHBhZGRpbmdZKVxuICAgIHtcbiAgICAgICAgcGFkZGluZ1ggPSBwYWRkaW5nWCB8fCAwO1xuICAgICAgICBwYWRkaW5nWSA9IHBhZGRpbmdZIHx8ICgocGFkZGluZ1kgIT09IDApID8gcGFkZGluZ1ggOiAwKTtcblxuICAgICAgICB0aGlzLnggLT0gcGFkZGluZ1g7XG4gICAgICAgIHRoaXMueSAtPSBwYWRkaW5nWTtcblxuICAgICAgICB0aGlzLndpZHRoICs9IHBhZGRpbmdYICogMjtcbiAgICAgICAgdGhpcy5oZWlnaHQgKz0gcGFkZGluZ1kgKiAyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpdHMgdGhpcyByZWN0YW5nbGUgYXJvdW5kIHRoZSBwYXNzZWQgb25lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlJlY3RhbmdsZX0gcmVjdGFuZ2xlIC0gVGhlIHJlY3RhbmdsZSB0byBmaXQuXG4gICAgICovXG4gICAgZml0KHJlY3RhbmdsZSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLnggPCByZWN0YW5nbGUueClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy53aWR0aCArPSB0aGlzLng7XG4gICAgICAgICAgICBpZiAodGhpcy53aWR0aCA8IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMueCA9IHJlY3RhbmdsZS54O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMueSA8IHJlY3RhbmdsZS55KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCArPSB0aGlzLnk7XG4gICAgICAgICAgICBpZiAodGhpcy5oZWlnaHQgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMueSA9IHJlY3RhbmdsZS55O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMueCArIHRoaXMud2lkdGggPiByZWN0YW5nbGUueCArIHJlY3RhbmdsZS53aWR0aClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHJlY3RhbmdsZS53aWR0aCAtIHRoaXMueDtcbiAgICAgICAgICAgIGlmICh0aGlzLndpZHRoIDwgMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnkgKyB0aGlzLmhlaWdodCA+IHJlY3RhbmdsZS55ICsgcmVjdGFuZ2xlLmhlaWdodClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSByZWN0YW5nbGUuaGVpZ2h0IC0gdGhpcy55O1xuICAgICAgICAgICAgaWYgKHRoaXMuaGVpZ2h0IDwgMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbmxhcmdlcyB0aGlzIHJlY3RhbmdsZSB0byBpbmNsdWRlIHRoZSBwYXNzZWQgcmVjdGFuZ2xlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQSVhJLlJlY3RhbmdsZX0gcmVjdGFuZ2xlIC0gVGhlIHJlY3RhbmdsZSB0byBpbmNsdWRlLlxuICAgICAqL1xuICAgIGVubGFyZ2UocmVjdGFuZ2xlKVxuICAgIHtcbiAgICAgICAgY29uc3QgeDEgPSBNYXRoLm1pbih0aGlzLngsIHJlY3RhbmdsZS54KTtcbiAgICAgICAgY29uc3QgeDIgPSBNYXRoLm1heCh0aGlzLnggKyB0aGlzLndpZHRoLCByZWN0YW5nbGUueCArIHJlY3RhbmdsZS53aWR0aCk7XG4gICAgICAgIGNvbnN0IHkxID0gTWF0aC5taW4odGhpcy55LCByZWN0YW5nbGUueSk7XG4gICAgICAgIGNvbnN0IHkyID0gTWF0aC5tYXgodGhpcy55ICsgdGhpcy5oZWlnaHQsIHJlY3RhbmdsZS55ICsgcmVjdGFuZ2xlLmhlaWdodCk7XG5cbiAgICAgICAgdGhpcy54ID0geDE7XG4gICAgICAgIHRoaXMud2lkdGggPSB4MiAtIHgxO1xuICAgICAgICB0aGlzLnkgPSB5MTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB5MiAtIHkxO1xuICAgIH1cbn1cbiIsImltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi9SZWN0YW5nbGUnO1xuaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vLi4vY29uc3QnO1xuXG4vKipcbiAqIFRoZSBDaXJjbGUgb2JqZWN0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgYSBoaXQgYXJlYSBmb3IgZGlzcGxheU9iamVjdHNcbiAqXG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENpcmNsZVxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRlciBvZiB0aGlzIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRlciBvZiB0aGlzIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbcmFkaXVzPTBdIC0gVGhlIHJhZGl1cyBvZiB0aGUgY2lyY2xlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCByYWRpdXMgPSAwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdHlwZSBvZiB0aGUgb2JqZWN0LCBtYWlubHkgdXNlZCB0byBhdm9pZCBgaW5zdGFuY2VvZmAgY2hlY2tzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBkZWZhdWx0IFBJWEkuU0hBUEVTLkNJUkNcbiAgICAgICAgICogQHNlZSBQSVhJLlNIQVBFU1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eXBlID0gU0hBUEVTLkNJUkM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoaXMgQ2lyY2xlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkNpcmNsZX0gYSBjb3B5IG9mIHRoZSBDaXJjbGVcbiAgICAgKi9cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IENpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGdpdmVuIGFyZSBjb250YWluZWQgd2l0aGluIHRoaXMgY2lyY2xlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSB4L3kgY29vcmRpbmF0ZXMgYXJlIHdpdGhpbiB0aGlzIENpcmNsZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5yYWRpdXMgPD0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcjIgPSB0aGlzLnJhZGl1cyAqIHRoaXMucmFkaXVzO1xuICAgICAgICBsZXQgZHggPSAodGhpcy54IC0geCk7XG4gICAgICAgIGxldCBkeSA9ICh0aGlzLnkgLSB5KTtcblxuICAgICAgICBkeCAqPSBkeDtcbiAgICAgICAgZHkgKj0gZHk7XG5cbiAgICAgICAgcmV0dXJuIChkeCArIGR5IDw9IHIyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJldHVybnMgdGhlIGZyYW1pbmcgcmVjdGFuZ2xlIG9mIHRoZSBjaXJjbGUgYXMgYSBSZWN0YW5nbGUgb2JqZWN0XG4gICAgKlxuICAgICogQHJldHVybiB7UElYSS5SZWN0YW5nbGV9IHRoZSBmcmFtaW5nIHJlY3RhbmdsZVxuICAgICovXG4gICAgZ2V0Qm91bmRzKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMueCAtIHRoaXMucmFkaXVzLCB0aGlzLnkgLSB0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXMgKiAyLCB0aGlzLnJhZGl1cyAqIDIpO1xuICAgIH1cbn1cbiIsImltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi9SZWN0YW5nbGUnO1xuaW1wb3J0IHsgU0hBUEVTIH0gZnJvbSAnLi4vLi4vY29uc3QnO1xuXG4vKipcbiAqIFRoZSBFbGxpcHNlIG9iamVjdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGEgaGl0IGFyZWEgZm9yIGRpc3BsYXlPYmplY3RzXG4gKlxuICogQGNsYXNzXG4gKiBAbWVtYmVyb2YgUElYSVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGxpcHNlXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIC0gVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgY2VudGVyIG9mIHRoaXMgY2lyY2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIC0gVGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgY2VudGVyIG9mIHRoaXMgY2lyY2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt3aWR0aD0wXSAtIFRoZSBoYWxmIHdpZHRoIG9mIHRoaXMgZWxsaXBzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbaGVpZ2h0PTBdIC0gVGhlIGhhbGYgaGVpZ2h0IG9mIHRoaXMgZWxsaXBzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKVxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5FTElQXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5FTElQO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIEVsbGlwc2UgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuRWxsaXBzZX0gYSBjb3B5IG9mIHRoZSBlbGxpcHNlXG4gICAgICovXG4gICAgY2xvbmUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFbGxpcHNlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBlbGxpcHNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSB4L3kgY29vcmRzIGFyZSB3aXRoaW4gdGhpcyBlbGxpcHNlXG4gICAgICovXG4gICAgY29udGFpbnMoeCwgeSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLndpZHRoIDw9IDAgfHwgdGhpcy5oZWlnaHQgPD0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm9ybWFsaXplIHRoZSBjb29yZHMgdG8gYW4gZWxsaXBzZSB3aXRoIGNlbnRlciAwLDBcbiAgICAgICAgbGV0IG5vcm14ID0gKCh4IC0gdGhpcy54KSAvIHRoaXMud2lkdGgpO1xuICAgICAgICBsZXQgbm9ybXkgPSAoKHkgLSB0aGlzLnkpIC8gdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgIG5vcm14ICo9IG5vcm14O1xuICAgICAgICBub3JteSAqPSBub3JteTtcblxuICAgICAgICByZXR1cm4gKG5vcm14ICsgbm9ybXkgPD0gMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZnJhbWluZyByZWN0YW5nbGUgb2YgdGhlIGVsbGlwc2UgYXMgYSBSZWN0YW5nbGUgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlJlY3RhbmdsZX0gdGhlIGZyYW1pbmcgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgZ2V0Qm91bmRzKClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlKHRoaXMueCAtIHRoaXMud2lkdGgsIHRoaXMueSAtIHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFBvaW50IGZyb20gJy4uL1BvaW50JztcbmltcG9ydCB7IFNIQVBFUyB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvbHlnb25cbntcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1BJWEkuUG9pbnRbXXxudW1iZXJbXX0gcG9pbnRzIC0gVGhpcyBjYW4gYmUgYW4gYXJyYXkgb2YgUG9pbnRzXG4gICAgICogIHRoYXQgZm9ybSB0aGUgcG9seWdvbiwgYSBmbGF0IGFycmF5IG9mIG51bWJlcnMgdGhhdCB3aWxsIGJlIGludGVycHJldGVkIGFzIFt4LHksIHgseSwgLi4uXSwgb3JcbiAgICAgKiAgdGhlIGFyZ3VtZW50cyBwYXNzZWQgY2FuIGJlIGFsbCB0aGUgcG9pbnRzIG9mIHRoZSBwb2x5Z29uIGUuZy5cbiAgICAgKiAgYG5ldyBQSVhJLlBvbHlnb24obmV3IFBJWEkuUG9pbnQoKSwgbmV3IFBJWEkuUG9pbnQoKSwgLi4uKWAsIG9yIHRoZSBhcmd1bWVudHMgcGFzc2VkIGNhbiBiZSBmbGF0XG4gICAgICogIHgseSB2YWx1ZXMgZS5nLiBgbmV3IFBvbHlnb24oeCx5LCB4LHksIHgseSwgLi4uKWAgd2hlcmUgYHhgIGFuZCBgeWAgYXJlIE51bWJlcnMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoLi4ucG9pbnRzKVxuICAgIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocG9pbnRzWzBdKSlcbiAgICAgICAge1xuICAgICAgICAgICAgcG9pbnRzID0gcG9pbnRzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBhcnJheSBvZiBwb2ludHMsIGNvbnZlcnQgaXQgdG8gYSBmbGF0IGFycmF5IG9mIG51bWJlcnNcbiAgICAgICAgaWYgKHBvaW50c1swXSBpbnN0YW5jZW9mIFBvaW50KVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBwID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IHBvaW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHAucHVzaChwb2ludHNbaV0ueCwgcG9pbnRzW2ldLnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb2ludHMgPSBwO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBhcnJheSBvZiB0aGUgcG9pbnRzIG9mIHRoaXMgcG9seWdvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJbXX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdHlwZSBvZiB0aGUgb2JqZWN0LCBtYWlubHkgdXNlZCB0byBhdm9pZCBgaW5zdGFuY2VvZmAgY2hlY2tzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBkZWZhdWx0IFBJWEkuU0hBUEVTLlBPTFlcbiAgICAgICAgICogQHNlZSBQSVhJLlNIQVBFU1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eXBlID0gU0hBUEVTLlBPTFk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoaXMgcG9seWdvblxuICAgICAqXG4gICAgICogQHJldHVybiB7UElYSS5Qb2x5Z29ufSBhIGNvcHkgb2YgdGhlIHBvbHlnb25cbiAgICAgKi9cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFBvbHlnb24odGhpcy5wb2ludHMuc2xpY2UoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBwb2x5Z29uLCBhZGRpbmcgcG9pbnRzIGlmIG5lY2Vzc2FyeS5cbiAgICAgKlxuICAgICAqL1xuICAgIGNsb3NlKClcbiAgICB7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMucG9pbnRzO1xuXG4gICAgICAgIC8vIGNsb3NlIHRoZSBwb2x5IGlmIHRoZSB2YWx1ZSBpcyB0cnVlIVxuICAgICAgICBpZiAocG9pbnRzWzBdICE9PSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDJdIHx8IHBvaW50c1sxXSAhPT0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXSlcbiAgICAgICAge1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzWzBdLCBwb2ludHNbMV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgcGFzc2VkIHRvIHRoaXMgZnVuY3Rpb24gYXJlIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBwb2x5Z29uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSB4L3kgY29vcmRpbmF0ZXMgYXJlIHdpdGhpbiB0aGlzIHBvbHlnb25cbiAgICAgKi9cbiAgICBjb250YWlucyh4LCB5KVxuICAgIHtcbiAgICAgICAgbGV0IGluc2lkZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHVzZSBzb21lIHJheWNhc3RpbmcgdG8gdGVzdCBoaXRzXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9wb2ludC1pbi1wb2x5Z29uL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aCAvIDI7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGogPSBsZW5ndGggLSAxOyBpIDwgbGVuZ3RoOyBqID0gaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCB4aSA9IHRoaXMucG9pbnRzW2kgKiAyXTtcbiAgICAgICAgICAgIGNvbnN0IHlpID0gdGhpcy5wb2ludHNbKGkgKiAyKSArIDFdO1xuICAgICAgICAgICAgY29uc3QgeGogPSB0aGlzLnBvaW50c1tqICogMl07XG4gICAgICAgICAgICBjb25zdCB5aiA9IHRoaXMucG9pbnRzWyhqICogMikgKyAxXTtcbiAgICAgICAgICAgIGNvbnN0IGludGVyc2VjdCA9ICgoeWkgPiB5KSAhPT0gKHlqID4geSkpICYmICh4IDwgKCh4aiAtIHhpKSAqICgoeSAtIHlpKSAvICh5aiAtIHlpKSkpICsgeGkpO1xuXG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluc2lkZSA9ICFpbnNpZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5zaWRlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFNIQVBFUyB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuLyoqXG4gKiBUaGUgUm91bmRlZCBSZWN0YW5nbGUgb2JqZWN0IGlzIGFuIGFyZWEgdGhhdCBoYXMgbmljZSByb3VuZGVkIGNvcm5lcnMsIGFzIGluZGljYXRlZCBieSBpdHNcbiAqIHRvcC1sZWZ0IGNvcm5lciBwb2ludCAoeCwgeSkgYW5kIGJ5IGl0cyB3aWR0aCBhbmQgaXRzIGhlaWdodCBhbmQgaXRzIHJhZGl1cy5cbiAqXG4gKiBAY2xhc3NcbiAqIEBtZW1iZXJvZiBQSVhJXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdW5kZWRSZWN0YW5nbGVcbntcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSB1cHBlci1sZWZ0IGNvcm5lciBvZiB0aGUgcm91bmRlZCByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSB1cHBlci1sZWZ0IGNvcm5lciBvZiB0aGUgcm91bmRlZCByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3dpZHRoPTBdIC0gVGhlIG92ZXJhbGwgd2lkdGggb2YgdGhpcyByb3VuZGVkIHJlY3RhbmdsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbaGVpZ2h0PTBdIC0gVGhlIG92ZXJhbGwgaGVpZ2h0IG9mIHRoaXMgcm91bmRlZCByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3JhZGl1cz0yMF0gLSBDb250cm9scyB0aGUgcmFkaXVzIG9mIHRoZSByb3VuZGVkIGNvcm5lcnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCwgcmFkaXVzID0gMjApXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnggPSB4O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDIwXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHR5cGUgb2YgdGhlIG9iamVjdCwgbWFpbmx5IHVzZWQgdG8gYXZvaWQgYGluc3RhbmNlb2ZgIGNoZWNrc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9XG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKiBAZGVmYXVsdCBQSVhJLlNIQVBFUy5SUkVDXG4gICAgICAgICAqIEBzZWUgUElYSS5TSEFQRVNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudHlwZSA9IFNIQVBFUy5SUkVDO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIFJvdW5kZWQgUmVjdGFuZ2xlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQSVhJLlJvdW5kZWRSZWN0YW5nbGV9IGEgY29weSBvZiB0aGUgcm91bmRlZCByZWN0YW5nbGVcbiAgICAgKi9cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFJvdW5kZWRSZWN0YW5nbGUodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLnJhZGl1cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgZ2l2ZW4gYXJlIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBSb3VuZGVkIFJlY3RhbmdsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgeC95IGNvb3JkaW5hdGVzIGFyZSB3aXRoaW4gdGhpcyBSb3VuZGVkIFJlY3RhbmdsZVxuICAgICAqL1xuICAgIGNvbnRhaW5zKHgsIHkpXG4gICAge1xuICAgICAgICBpZiAodGhpcy53aWR0aCA8PSAwIHx8IHRoaXMuaGVpZ2h0IDw9IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeCA+PSB0aGlzLnggJiYgeCA8PSB0aGlzLnggKyB0aGlzLndpZHRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoeSA+PSB0aGlzLnkgJiYgeSA8PSB0aGlzLnkgKyB0aGlzLmhlaWdodClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoKHkgPj0gdGhpcy55ICsgdGhpcy5yYWRpdXMgJiYgeSA8PSB0aGlzLnkgKyB0aGlzLmhlaWdodCAtIHRoaXMucmFkaXVzKVxuICAgICAgICAgICAgICAgIHx8ICh4ID49IHRoaXMueCArIHRoaXMucmFkaXVzICYmIHggPD0gdGhpcy54ICsgdGhpcy53aWR0aCAtIHRoaXMucmFkaXVzKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgZHggPSB4IC0gKHRoaXMueCArIHRoaXMucmFkaXVzKTtcbiAgICAgICAgICAgICAgICBsZXQgZHkgPSB5IC0gKHRoaXMueSArIHRoaXMucmFkaXVzKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYWRpdXMyID0gdGhpcy5yYWRpdXMgKiB0aGlzLnJhZGl1cztcblxuICAgICAgICAgICAgICAgIGlmICgoZHggKiBkeCkgKyAoZHkgKiBkeSkgPD0gcmFkaXVzMilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkeCA9IHggLSAodGhpcy54ICsgdGhpcy53aWR0aCAtIHRoaXMucmFkaXVzKTtcbiAgICAgICAgICAgICAgICBpZiAoKGR4ICogZHgpICsgKGR5ICogZHkpIDw9IHJhZGl1czIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZHkgPSB5IC0gKHRoaXMueSArIHRoaXMuaGVpZ2h0IC0gdGhpcy5yYWRpdXMpO1xuICAgICAgICAgICAgICAgIGlmICgoZHggKiBkeCkgKyAoZHkgKiBkeSkgPD0gcmFkaXVzMilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkeCA9IHggLSAodGhpcy54ICsgdGhpcy5yYWRpdXMpO1xuICAgICAgICAgICAgICAgIGlmICgoZHggKiBkeCkgKyAoZHkgKiBkeSkgPD0gcmFkaXVzMilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4iLCIvKipcbiAqIE1hdGggY2xhc3NlcyBhbmQgdXRpbGl0aWVzIG1peGVkIGludG8gUElYSSBuYW1lc3BhY2UuXG4gKlxuICogQGxlbmRzIFBJWElcbiAqL1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQb2ludCB9IGZyb20gJy4vUG9pbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBNYXRyaXggfSBmcm9tICcuL01hdHJpeCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEdyb3VwRDggfSBmcm9tICcuL0dyb3VwRDgnO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIENpcmNsZSB9IGZyb20gJy4vc2hhcGVzL0NpcmNsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVsbGlwc2UgfSBmcm9tICcuL3NoYXBlcy9FbGxpcHNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUG9seWdvbiB9IGZyb20gJy4vc2hhcGVzL1BvbHlnb24nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSZWN0YW5nbGUgfSBmcm9tICcuL3NoYXBlcy9SZWN0YW5nbGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBSb3VuZGVkUmVjdGFuZ2xlIH0gZnJvbSAnLi9zaGFwZXMvUm91bmRlZFJlY3RhbmdsZSc7XG4iLCIvKipcbiAqIENhbGN1bGF0ZSB0aGUgcG9pbnRzIGZvciBhIGJlemllciBjdXJ2ZSBhbmQgdGhlbiBkcmF3cyBpdC5cbiAqXG4gKiBJZ25vcmVkIGZyb20gZG9jcyBzaW5jZSBpdCBpcyBub3QgZGlyZWN0bHkgZXhwb3NlZC5cbiAqXG4gKiBAaWdub3JlXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbVggLSBTdGFydGluZyBwb2ludCB4XG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbVkgLSBTdGFydGluZyBwb2ludCB5XG4gKiBAcGFyYW0ge251bWJlcn0gY3BYIC0gQ29udHJvbCBwb2ludCB4XG4gKiBAcGFyYW0ge251bWJlcn0gY3BZIC0gQ29udHJvbCBwb2ludCB5XG4gKiBAcGFyYW0ge251bWJlcn0gY3BYMiAtIFNlY29uZCBDb250cm9sIHBvaW50IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSBjcFkyIC0gU2Vjb25kIENvbnRyb2wgcG9pbnQgeVxuICogQHBhcmFtIHtudW1iZXJ9IHRvWCAtIERlc3RpbmF0aW9uIHBvaW50IHhcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b1kgLSBEZXN0aW5hdGlvbiBwb2ludCB5XG4gKiBAcGFyYW0ge251bWJlcltdfSBbcGF0aD1bXV0gLSBQYXRoIGFycmF5IHRvIHB1c2ggcG9pbnRzIGludG9cbiAqIEByZXR1cm4ge251bWJlcltdfSBBcnJheSBvZiBwb2ludHMgb2YgdGhlIGN1cnZlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJlemllckN1cnZlVG8oZnJvbVgsIGZyb21ZLCBjcFgsIGNwWSwgY3BYMiwgY3BZMiwgdG9YLCB0b1ksIHBhdGggPSBbXSlcbntcbiAgICBjb25zdCBuID0gMjA7XG4gICAgbGV0IGR0ID0gMDtcbiAgICBsZXQgZHQyID0gMDtcbiAgICBsZXQgZHQzID0gMDtcbiAgICBsZXQgdDIgPSAwO1xuICAgIGxldCB0MyA9IDA7XG5cbiAgICBwYXRoLnB1c2goZnJvbVgsIGZyb21ZKTtcblxuICAgIGZvciAobGV0IGkgPSAxLCBqID0gMDsgaSA8PSBuOyArK2kpXG4gICAge1xuICAgICAgICBqID0gaSAvIG47XG5cbiAgICAgICAgZHQgPSAoMSAtIGopO1xuICAgICAgICBkdDIgPSBkdCAqIGR0O1xuICAgICAgICBkdDMgPSBkdDIgKiBkdDtcblxuICAgICAgICB0MiA9IGogKiBqO1xuICAgICAgICB0MyA9IHQyICogajtcblxuICAgICAgICBwYXRoLnB1c2goXG4gICAgICAgICAgICAoZHQzICogZnJvbVgpICsgKDMgKiBkdDIgKiBqICogY3BYKSArICgzICogZHQgKiB0MiAqIGNwWDIpICsgKHQzICogdG9YKSxcbiAgICAgICAgICAgIChkdDMgKiBmcm9tWSkgKyAoMyAqIGR0MiAqIGogKiBjcFkpICsgKDMgKiBkdCAqIHQyICogY3BZMikgKyAodDMgKiB0b1kpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGg7XG59XG4iLCJpbXBvcnQgR3JhcGhpY3NEYXRhIGZyb20gJy4vR3JhcGhpY3NEYXRhJztcbmltcG9ydCB7IE1hdHJpeCwgUG9pbnQsIFJlY3RhbmdsZSwgUm91bmRlZFJlY3RhbmdsZSwgRWxsaXBzZSwgUG9seWdvbiwgQ2lyY2xlIH0gZnJvbSAnLi4vbWF0aC9pbmRleCc7XG5pbXBvcnQgeyBTSEFQRVMgfSBmcm9tICcuLi9jb25zdCc7XG5pbXBvcnQgYmV6aWVyQ3VydmVUbyBmcm9tICcuL3V0aWxzL2JlemllckN1cnZlVG8nO1xuXG5jb25zdCB0ZW1wTWF0cml4ID0gbmV3IE1hdHJpeCgpO1xuY29uc3QgdGVtcFBvaW50ID0gbmV3IFBvaW50KCk7XG5jb25zdCB0ZW1wQ29sb3IxID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcbmNvbnN0IHRlbXBDb2xvcjIgPSBuZXcgRmxvYXQzMkFycmF5KDQpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljc1xue1xuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gMTtcbiAgICAgICAgdGhpcy5saW5lV2lkdGggPSAwO1xuICAgICAgICB0aGlzLmxpbmVDb2xvciA9IDA7XG4gICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhID0gW107XG4gICAgICAgIHRoaXMudGludCA9IDB4RkZGRkZGO1xuICAgICAgICB0aGlzLl9wcmV2VGludCA9IDB4RkZGRkZGO1xuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcblxuICAgICAgICB0aGlzLl93ZWJHTCA9IHt9O1xuXG4gICAgICAgIHRoaXMuZGlydHkgPSAwO1xuICAgICAgICB0aGlzLmZhc3RSZWN0RGlydHkgPSAtMTtcbiAgICAgICAgdGhpcy5jbGVhckRpcnR5ID0gMDtcbiAgICAgICAgdGhpcy5ib3VuZHNEaXJ0eSA9IC0xO1xuICAgICAgICB0aGlzLmNhY2hlZFNwcml0ZURpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fc3ByaXRlUmVjdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2Zhc3RSZWN0ID0gZmFsc2U7XG4gICAgfVxuXG5cbiAgICBjbG9uZSgpXG4gICAge1xuICAgICAgICBjb25zdCBjbG9uZSA9IG5ldyBHcmFwaGljcygpO1xuXG4gICAgICAgIGNsb25lLmZpbGxBbHBoYSA9IHRoaXMuZmlsbEFscGhhO1xuICAgICAgICBjbG9uZS5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcbiAgICAgICAgY2xvbmUubGluZUNvbG9yID0gdGhpcy5saW5lQ29sb3I7XG4gICAgICAgIGNsb25lLnRpbnQgPSB0aGlzLnRpbnQ7XG4gICAgICAgIGNsb25lLmJvdW5kc1BhZGRpbmcgPSB0aGlzLmJvdW5kc1BhZGRpbmc7XG4gICAgICAgIGNsb25lLmRpcnR5ID0gMDtcbiAgICAgICAgY2xvbmUuY2FjaGVkU3ByaXRlRGlydHkgPSB0aGlzLmNhY2hlZFNwcml0ZURpcnR5O1xuXG4gICAgICAgIC8vIGNvcHkgZ3JhcGhpY3MgZGF0YVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ3JhcGhpY3NEYXRhLmxlbmd0aDsgKytpKVxuICAgICAgICB7XG4gICAgICAgICAgICBjbG9uZS5ncmFwaGljc0RhdGEucHVzaCh0aGlzLmdyYXBoaWNzRGF0YVtpXS5jbG9uZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsb25lLmN1cnJlbnRQYXRoID0gY2xvbmUuZ3JhcGhpY3NEYXRhW2Nsb25lLmdyYXBoaWNzRGF0YS5sZW5ndGggLSAxXTtcblxuICAgICAgICBjbG9uZS51cGRhdGVMb2NhbEJvdW5kcygpO1xuXG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9XG5cblxuICAgIGxpbmVTdHlsZShsaW5lV2lkdGggPSAwLCBjb2xvciA9IDAsIGFscGhhID0gMSlcbiAgICB7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICB0aGlzLmxpbmVDb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLmxpbmVBbHBoYSA9IGFscGhhO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIGhhbGZ3YXkgdGhyb3VnaCBhIGxpbmU/IHN0YXJ0IGEgbmV3IG9uZSFcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBQb2x5Z29uKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLnNsaWNlKC0yKSk7XG5cbiAgICAgICAgICAgICAgICBzaGFwZS5jbG9zZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd1NoYXBlKHNoYXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgaXRzIGVtcHR5IHNvIGxldHMganVzdCBzZXQgdGhlIGxpbmUgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5saW5lQ29sb3IgPSB0aGlzLmxpbmVDb2xvcjtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmxpbmVBbHBoYSA9IHRoaXMubGluZUFscGhhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbW92ZVRvKHgsIHkpXG4gICAge1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBQb2x5Z29uKFt4LCB5XSk7XG5cbiAgICAgICAgc2hhcGUuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKHNoYXBlKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3cyBhIGxpbmUgdXNpbmcgdGhlIGN1cnJlbnQgbGluZSBzdHlsZSBmcm9tIHRoZSBjdXJyZW50IGRyYXdpbmcgcG9zaXRpb24gdG8gKHgsIHkpO1xuICAgICAqIFRoZSBjdXJyZW50IGRyYXdpbmcgcG9zaXRpb24gaXMgdGhlbiBzZXQgdG8gKHgsIHkpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSB0aGUgWCBjb29yZGluYXRlIHRvIGRyYXcgdG9cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIHRoZSBZIGNvb3JkaW5hdGUgdG8gZHJhdyB0b1xuICAgICAqIEByZXR1cm4ge1BJWEkuR3JhcGhpY3N9IFRoaXMgR3JhcGhpY3Mgb2JqZWN0LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHNcbiAgICAgKi9cbiAgICBsaW5lVG8oeCwgeSlcbiAgICB7XG4gICAgICAgIHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLnB1c2goeCwgeSk7XG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGUgdGhlIHBvaW50cyBmb3IgYSBxdWFkcmF0aWMgYmV6aWVyIGN1cnZlIGFuZCB0aGVuIGRyYXdzIGl0LlxuICAgICAqIEJhc2VkIG9uOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83ODUwOTcvaG93LWRvLWktaW1wbGVtZW50LWEtYmV6aWVyLWN1cnZlLWluLWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjcFggLSBDb250cm9sIHBvaW50IHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY3BZIC0gQ29udHJvbCBwb2ludCB5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvWCAtIERlc3RpbmF0aW9uIHBvaW50IHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9ZIC0gRGVzdGluYXRpb24gcG9pbnQgeVxuICAgICAqIEByZXR1cm4ge1BJWEkuR3JhcGhpY3N9IFRoaXMgR3JhcGhpY3Mgb2JqZWN0LiBHb29kIGZvciBjaGFpbmluZyBtZXRob2QgY2FsbHNcbiAgICAgKi9cbiAgICBxdWFkcmF0aWNDdXJ2ZVRvKGNwWCwgY3BZLCB0b1gsIHRvWSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzID0gWzAsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oMCwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuID0gMjA7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzO1xuICAgICAgICBsZXQgeGEgPSAwO1xuICAgICAgICBsZXQgeWEgPSAwO1xuXG4gICAgICAgIGlmIChwb2ludHMubGVuZ3RoID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbygwLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZyb21YID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXTtcbiAgICAgICAgY29uc3QgZnJvbVkgPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG47ICsraSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgaiA9IGkgLyBuO1xuXG4gICAgICAgICAgICB4YSA9IGZyb21YICsgKChjcFggLSBmcm9tWCkgKiBqKTtcbiAgICAgICAgICAgIHlhID0gZnJvbVkgKyAoKGNwWSAtIGZyb21ZKSAqIGopO1xuXG4gICAgICAgICAgICBwb2ludHMucHVzaCh4YSArICgoKGNwWCArICgodG9YIC0gY3BYKSAqIGopKSAtIHhhKSAqIGopLFxuICAgICAgICAgICAgICAgIHlhICsgKCgoY3BZICsgKCh0b1kgLSBjcFkpICogaikpIC0geWEpICogaikpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXJ0eSsrO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJlemllckN1cnZlVG8oY3BYLCBjcFksIGNwWDIsIGNwWTIsIHRvWCwgdG9ZKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMgPSBbMCwgMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbygwLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzO1xuXG4gICAgICAgIGNvbnN0IGZyb21YID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXTtcbiAgICAgICAgY29uc3QgZnJvbVkgPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHBvaW50cy5sZW5ndGggLT0gMjtcblxuICAgICAgICBiZXppZXJDdXJ2ZVRvKGZyb21YLCBmcm9tWSwgY3BYLCBjcFksIGNwWDIsIGNwWTIsIHRvWCwgdG9ZLCBwb2ludHMpO1xuXG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcmNUbyh4MSwgeTEsIHgyLCB5MiwgcmFkaXVzKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMucHVzaCh4MSwgeTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oeDEsIHkxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzO1xuICAgICAgICBjb25zdCBmcm9tWCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGZyb21ZID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgYTEgPSBmcm9tWSAtIHkxO1xuICAgICAgICBjb25zdCBiMSA9IGZyb21YIC0geDE7XG4gICAgICAgIGNvbnN0IGEyID0geTIgLSB5MTtcbiAgICAgICAgY29uc3QgYjIgPSB4MiAtIHgxO1xuICAgICAgICBjb25zdCBtbSA9IE1hdGguYWJzKChhMSAqIGIyKSAtIChiMSAqIGEyKSk7XG5cbiAgICAgICAgaWYgKG1tIDwgMS4wZS04IHx8IHJhZGl1cyA9PT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHBvaW50c1twb2ludHMubGVuZ3RoIC0gMl0gIT09IHgxIHx8IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0gIT09IHkxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHgxLCB5MSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBkZCA9IChhMSAqIGExKSArIChiMSAqIGIxKTtcbiAgICAgICAgICAgIGNvbnN0IGNjID0gKGEyICogYTIpICsgKGIyICogYjIpO1xuICAgICAgICAgICAgY29uc3QgdHQgPSAoYTEgKiBhMikgKyAoYjEgKiBiMik7XG4gICAgICAgICAgICBjb25zdCBrMSA9IHJhZGl1cyAqIE1hdGguc3FydChkZCkgLyBtbTtcbiAgICAgICAgICAgIGNvbnN0IGsyID0gcmFkaXVzICogTWF0aC5zcXJ0KGNjKSAvIG1tO1xuICAgICAgICAgICAgY29uc3QgajEgPSBrMSAqIHR0IC8gZGQ7XG4gICAgICAgICAgICBjb25zdCBqMiA9IGsyICogdHQgLyBjYztcbiAgICAgICAgICAgIGNvbnN0IGN4ID0gKGsxICogYjIpICsgKGsyICogYjEpO1xuICAgICAgICAgICAgY29uc3QgY3kgPSAoazEgKiBhMikgKyAoazIgKiBhMSk7XG4gICAgICAgICAgICBjb25zdCBweCA9IGIxICogKGsyICsgajEpO1xuICAgICAgICAgICAgY29uc3QgcHkgPSBhMSAqIChrMiArIGoxKTtcbiAgICAgICAgICAgIGNvbnN0IHF4ID0gYjIgKiAoazEgKyBqMik7XG4gICAgICAgICAgICBjb25zdCBxeSA9IGEyICogKGsxICsgajIpO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRBbmdsZSA9IE1hdGguYXRhbjIocHkgLSBjeSwgcHggLSBjeCk7XG4gICAgICAgICAgICBjb25zdCBlbmRBbmdsZSA9IE1hdGguYXRhbjIocXkgLSBjeSwgcXggLSBjeCk7XG5cbiAgICAgICAgICAgIHRoaXMuYXJjKGN4ICsgeDEsIGN5ICsgeTEsIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGIxICogYTIgPiBiMiAqIGExKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlydHkrKztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcmMoY3gsIGN5LCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBhbnRpY2xvY2t3aXNlID0gZmFsc2UpXG4gICAge1xuICAgICAgICBpZiAoc3RhcnRBbmdsZSA9PT0gZW5kQW5nbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhbnRpY2xvY2t3aXNlICYmIGVuZEFuZ2xlIDw9IHN0YXJ0QW5nbGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVuZEFuZ2xlICs9IE1hdGguUEkgKiAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFudGljbG9ja3dpc2UgJiYgc3RhcnRBbmdsZSA8PSBlbmRBbmdsZSlcbiAgICAgICAge1xuICAgICAgICAgICAgc3RhcnRBbmdsZSArPSBNYXRoLlBJICogMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN3ZWVwID0gZW5kQW5nbGUgLSBzdGFydEFuZ2xlO1xuICAgICAgICBjb25zdCBzZWdzID0gTWF0aC5jZWlsKE1hdGguYWJzKHN3ZWVwKSAvIChNYXRoLlBJICogMikpICogNDA7XG5cbiAgICAgICAgaWYgKHN3ZWVwID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXJ0WCA9IGN4ICsgKE1hdGguY29zKHN0YXJ0QW5nbGUpICogcmFkaXVzKTtcbiAgICAgICAgY29uc3Qgc3RhcnRZID0gY3kgKyAoTWF0aC5zaW4oc3RhcnRBbmdsZSkgKiByYWRpdXMpO1xuXG4gICAgICAgIC8vIElmIHRoZSBjdXJyZW50UGF0aCBleGlzdHMsIHRha2UgaXRzIHBvaW50cy4gT3RoZXJ3aXNlIGNhbGwgYG1vdmVUb2AgdG8gc3RhcnQgYSBwYXRoLlxuICAgICAgICBsZXQgcG9pbnRzID0gdGhpcy5jdXJyZW50UGF0aCA/IHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzIDogbnVsbDtcblxuICAgICAgICBpZiAocG9pbnRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocG9pbnRzW3BvaW50cy5sZW5ndGggLSAyXSAhPT0gc3RhcnRYIHx8IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV0gIT09IHN0YXJ0WSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgICBwb2ludHMgPSB0aGlzLmN1cnJlbnRQYXRoLnNoYXBlLnBvaW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRoZXRhID0gc3dlZXAgLyAoc2VncyAqIDIpO1xuICAgICAgICBjb25zdCB0aGV0YTIgPSB0aGV0YSAqIDI7XG5cbiAgICAgICAgY29uc3QgY1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgICAgICBjb25zdCBzVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG5cbiAgICAgICAgY29uc3Qgc2VnTWludXMgPSBzZWdzIC0gMTtcblxuICAgICAgICBjb25zdCByZW1haW5kZXIgPSAoc2VnTWludXMgJSAxKSAvIHNlZ01pbnVzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHNlZ01pbnVzOyArK2kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHJlYWwgPSBpICsgKHJlbWFpbmRlciAqIGkpO1xuXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9ICgodGhldGEpICsgc3RhcnRBbmdsZSArICh0aGV0YTIgKiByZWFsKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgICAgICBjb25zdCBzID0gLU1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICAgICAgcG9pbnRzLnB1c2goXG4gICAgICAgICAgICAgICAgKCgoY1RoZXRhICogYykgKyAoc1RoZXRhICogcykpICogcmFkaXVzKSArIGN4LFxuICAgICAgICAgICAgICAgICgoKGNUaGV0YSAqIC1zKSArIChzVGhldGEgKiBjKSkgKiByYWRpdXMpICsgY3lcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYmVnaW5GaWxsKGNvbG9yID0gMCwgYWxwaGEgPSAxKVxuICAgIHtcbiAgICAgICAgdGhpcy5maWxsaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5maWxsQWxwaGEgPSBhbHBoYTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguc2hhcGUucG9pbnRzLmxlbmd0aCA8PSAyKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguZmlsbCA9IHRoaXMuZmlsbGluZztcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoLmZpbGxDb2xvciA9IHRoaXMuZmlsbENvbG9yO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhdGguZmlsbEFscGhhID0gdGhpcy5maWxsQWxwaGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBlbmRGaWxsKClcbiAgICB7XG4gICAgICAgIHRoaXMuZmlsbGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZpbGxDb2xvciA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlsbEFscGhhID0gMTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3UmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxuICAgIHtcbiAgICAgICAgdGhpcy5kcmF3U2hhcGUobmV3IFJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0KSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRyYXdSb3VuZGVkUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0LCByYWRpdXMpXG4gICAge1xuICAgICAgICB0aGlzLmRyYXdTaGFwZShuZXcgUm91bmRlZFJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCByYWRpdXMpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3Q2lyY2xlKHgsIHksIHJhZGl1cylcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKG5ldyBDaXJjbGUoeCwgeSwgcmFkaXVzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZHJhd0VsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodClcbiAgICB7XG4gICAgICAgIHRoaXMuZHJhd1NoYXBlKG5ldyBFbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkcmF3UG9seWdvbihwYXRoKVxuICAgIHtcbiAgICAgICAgLy8gcHJldmVudHMgYW4gYXJndW1lbnQgYXNzaWdubWVudCBkZW9wdFxuICAgICAgICAvLyBzZWUgc2VjdGlvbiAzLjE6IGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvd2lraS9PcHRpbWl6YXRpb24ta2lsbGVycyMzLW1hbmFnaW5nLWFyZ3VtZW50c1xuICAgICAgICBsZXQgcG9pbnRzID0gcGF0aDtcblxuICAgICAgICBsZXQgY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICBpZiAocG9pbnRzIGluc3RhbmNlb2YgUG9seWdvbilcbiAgICAgICAge1xuICAgICAgICAgICAgY2xvc2VkID0gcG9pbnRzLmNsb3NlZDtcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50cy5wb2ludHM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocG9pbnRzKSlcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gcHJldmVudHMgYW4gYXJndW1lbnQgbGVhayBkZW9wdFxuICAgICAgICAgICAgLy8gc2VlIHNlY3Rpb24gMy4yOiBodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL3dpa2kvT3B0aW1pemF0aW9uLWtpbGxlcnMjMy1tYW5hZ2luZy1hcmd1bWVudHNcbiAgICAgICAgICAgIHBvaW50cyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcG9pbnRzW2ldID0gYXJndW1lbnRzW2ldOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHByZWZlci1yZXN0LXBhcmFtc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgUG9seWdvbihwb2ludHMpO1xuXG4gICAgICAgIHNoYXBlLmNsb3NlZCA9IGNsb3NlZDtcblxuICAgICAgICB0aGlzLmRyYXdTaGFwZShzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2xlYXIoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMubGluZVdpZHRoIHx8IHRoaXMuZmlsbGluZyB8fCB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGggPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IDA7XG4gICAgICAgICAgICB0aGlzLmZpbGxpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy5ib3VuZHNEaXJ0eSA9IC0xO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSsrO1xuICAgICAgICAgICAgdGhpcy5jbGVhckRpcnR5Kys7XG4gICAgICAgICAgICB0aGlzLmdyYXBoaWNzRGF0YS5sZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Nwcml0ZVJlY3QgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyB0aGUgb2JqZWN0IHVzaW5nIHRoZSBXZWJHTCByZW5kZXJlclxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1BJWEkuV2ViR0xSZW5kZXJlcn0gcmVuZGVyZXIgLSBUaGUgcmVuZGVyZXJcbiAgICAgKi9cbiAgICBfcmVuZGVyV2ViR0wocmVuZGVyZXIpXG4gICAge1xuXG4gICAgICAgIHJlbmRlcmVyLnNldE9iamVjdFJlbmRlcmVyKHJlbmRlcmVyLnBsdWdpbnMuZ3JhcGhpY3MpO1xuICAgICAgICByZW5kZXJlci5wbHVnaW5zLmdyYXBoaWNzLnJlbmRlcih0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIHRoZSBvYmplY3QgdXNpbmcgdGhlIENhbnZhcyByZW5kZXJlclxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1BJWEkuQ2FudmFzUmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyXG4gICAgICovXG4gICAgX3JlbmRlckNhbnZhcyhyZW5kZXJlcilcbiAgICB7XG4gICAgICAgIHJlbmRlcmVyLnBsdWdpbnMuZ3JhcGhpY3MucmVuZGVyKHRoaXMpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogRHJhd3MgdGhlIGdpdmVuIHNoYXBlIHRvIHRoaXMgR3JhcGhpY3Mgb2JqZWN0LiBDYW4gYmUgYW55IG9mIENpcmNsZSwgUmVjdGFuZ2xlLCBFbGxpcHNlLCBMaW5lIG9yIFBvbHlnb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BJWEkuQ2lyY2xlfFBJWEkuRWxsaXBzZXxQSVhJLlBvbHlnb258UElYSS5SZWN0YW5nbGV8UElYSS5Sb3VuZGVkUmVjdGFuZ2xlfSBzaGFwZSAtIFRoZSBzaGFwZSBvYmplY3QgdG8gZHJhdy5cbiAgICAgKiBAcmV0dXJuIHtQSVhJLkdyYXBoaWNzRGF0YX0gVGhlIGdlbmVyYXRlZCBHcmFwaGljc0RhdGEgb2JqZWN0LlxuICAgICAqL1xuICAgIGRyYXdTaGFwZShzaGFwZSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBjaGVjayBjdXJyZW50IHBhdGghXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGF0aC5zaGFwZS5wb2ludHMubGVuZ3RoIDw9IDIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljc0RhdGEucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcblxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEdyYXBoaWNzRGF0YShcbiAgICAgICAgICAgIHRoaXMubGluZVdpZHRoLFxuICAgICAgICAgICAgdGhpcy5saW5lQ29sb3IsXG4gICAgICAgICAgICB0aGlzLmxpbmVBbHBoYSxcbiAgICAgICAgICAgIHRoaXMuZmlsbENvbG9yLFxuICAgICAgICAgICAgdGhpcy5maWxsQWxwaGEsXG4gICAgICAgICAgICB0aGlzLmZpbGxpbmcsXG4gICAgICAgICAgICBzaGFwZVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhLnB1c2goZGF0YSk7XG5cbiAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gU0hBUEVTLlBPTFkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRhdGEuc2hhcGUuY2xvc2VkID0gZGF0YS5zaGFwZS5jbG9zZWQgfHwgdGhpcy5maWxsaW5nO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IGRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpcnR5Kys7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIGN1cnJlbnQgcGF0aC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BJWEkuR3JhcGhpY3N9IFJldHVybnMgaXRzZWxmLlxuICAgICAqL1xuICAgIGNsb3NlUGF0aCgpXG4gICAge1xuICAgICAgICAvLyBvayBzbyBjbG9zZSBwYXRoIGFzc3VtZXMgbmV4dCBvbmUgaXMgYSBob2xlIVxuICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHRoaXMuY3VycmVudFBhdGg7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRQYXRoICYmIGN1cnJlbnRQYXRoLnNoYXBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBjdXJyZW50UGF0aC5zaGFwZS5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGVzdHJveShvcHRpb25zKVxuICAgIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveShvcHRpb25zKTtcblxuICAgICAgICAvLyBkZXN0cm95IGVhY2ggb2YgdGhlIEdyYXBoaWNzRGF0YSBvYmplY3RzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFwaGljc0RhdGEubGVuZ3RoOyArK2kpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NEYXRhW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvciBlYWNoIHdlYmdsIGRhdGEgZW50cnksIGRlc3Ryb3kgdGhlIFdlYkdMR3JhcGhpY3NEYXRhXG4gICAgICAgIGZvciAoY29uc3QgaWQgaW4gdGhpcy5fd2ViZ2wpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5fd2ViZ2xbaWRdLmRhdGEubGVuZ3RoOyArK2opXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2ViZ2xbaWRdLmRhdGFbal0uZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZVJlY3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3Nwcml0ZVJlY3QuZGVzdHJveSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ncmFwaGljc0RhdGEgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBudWxsO1xuICAgICAgICB0aGlzLl93ZWJnbCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2xvY2FsQm91bmRzID0gbnVsbDtcbiAgICB9XG5cbn0iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmqKHmi59hczMgRGlzcGxheUxpc3Qg5Lit55qEc2hhcGUg57G7XG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcbmltcG9ydCBHcmFwaGljcyBmcm9tIFwiLi4vZ3JhcGhpY3MvR3JhcGhpY3NcIjtcblxudmFyIFNoYXBlID0gZnVuY3Rpb24ob3B0KXtcbiAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmdyYXBoaWNzID0gbmV3IEdyYXBoaWNzKCk7XG5cbiAgICAvL+WFg+e0oOaYr+WQpuaciWhvdmVy5LqL5Lu2IOWSjCBjaGlja+S6i+S7tu+8jOeUsWFkZEV2ZW5ldExpc3RlcuWSjHJlbWl2ZUV2ZW50TGlzdGVy5p2l6Kem5Y+R5L+u5pS5XG4gICAgc2VsZi5faG92ZXJhYmxlICA9IGZhbHNlO1xuICAgIHNlbGYuX2NsaWNrYWJsZSAgPSBmYWxzZTtcblxuICAgIC8vb3ZlcueahOaXtuWAmeWmguaenOacieS/ruaUueagt+W8j++8jOWwseS4unRydWVcbiAgICBzZWxmLl9ob3ZlckNsYXNzID0gZmFsc2U7XG4gICAgc2VsZi5ob3ZlckNsb25lICA9IHRydWU7ICAgIC8v5piv5ZCm5byA5ZCv5ZyoaG92ZXLnmoTml7blgJljbG9uZeS4gOS7veWIsGFjdGl2ZSBzdGFnZSDkuK0gXG4gICAgc2VsZi5wb2ludENoa1ByaW9yaXR5ID0gdHJ1ZTsgLy/lnKjpvKDmoIdtb3VzZW92ZXLliLDor6XoioLngrnvvIznhLblkI5tb3VzZW1vdmXnmoTml7blgJnvvIzmmK/lkKbkvJjlhYjmo4DmtYvor6XoioLngrlcblxuICAgIC8v5ouW5ou9ZHJhZ+eahOaXtuWAmeaYvuekuuWcqGFjdGl2U2hhcGXnmoTlia/mnKxcbiAgICBzZWxmLl9kcmFnRHVwbGljYXRlID0gbnVsbDtcblxuICAgIC8v5YWD57Sg5piv5ZCmIOW8gOWQryBkcmFnIOaLluWKqO+8jOi/meS4quacieeUqOaIt+iuvue9ruS8oOWFpVxuICAgIC8vc2VsZi5kcmFnZ2FibGUgPSBvcHQuZHJhZ2dhYmxlIHx8IGZhbHNlO1xuXG4gICAgc2VsZi50eXBlID0gc2VsZi50eXBlIHx8IFwic2hhcGVcIiA7XG4gICAgb3B0LmRyYXcgJiYgKHNlbGYuZHJhdz1vcHQuZHJhdyk7XG4gICAgXG4gICAgLy/lpITnkIbmiYDmnInnmoTlm77lvaLkuIDkupvlhbHmnInnmoTlsZ7mgKfphY3nva5cbiAgICBzZWxmLmluaXRDb21wUHJvcGVydHkob3B0KTtcblxuICAgIFNoYXBlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcyAsIGFyZ3VtZW50cyk7XG4gICAgc2VsZi5fcmVjdCA9IG51bGw7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKFNoYXBlICwgRGlzcGxheU9iamVjdCAsIHtcbiAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgfSxcbiAgIGluaXRDb21wUHJvcGVydHkgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgZm9yKCB2YXIgaSBpbiBvcHQgKXtcbiAgICAgICAgICAgaWYoIGkgIT0gXCJpZFwiICYmIGkgIT0gXCJjb250ZXh0XCIpe1xuICAgICAgICAgICAgICAgdGhpc1tpXSA9IG9wdFtpXTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgIH0sXG4gICAvKlxuICAgICrkuIvpnaLkuKTkuKrmlrnms5XkuLrmj5Dkvpvnu5kg5YW35L2T55qEIOWbvuW9ouexu+imhuebluWunueOsO+8jOacrHNoYXBl57G75LiN5o+Q5L6b5YW35L2T5a6e546wXG4gICAgKmRyYXcoKSDnu5jliLYgICBhbmQgICBzZXRSZWN0KCnojrflj5bor6XnsbvnmoTnn6nlvaLovrnnlYxcbiAgICovXG4gICBkcmF3OmZ1bmN0aW9uKCl7XG4gICBcbiAgIH0sXG4gICBkcmF3RW5kIDogZnVuY3Rpb24oY3R4KXtcbiAgICAgICBpZih0aGlzLl9oYXNGaWxsQW5kU3Ryb2tlKXtcbiAgICAgICAgICAgLy/lpoLmnpzlnKjlrZBzaGFwZeexu+mHjOmdouW3sue7j+WunueOsHN0cm9rZSBmaWxsIOetieaTjeS9nO+8jCDlsLHkuI3pnIDopoHnu5/kuIDnmoRkXG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG5cbiAgICAgICAvL3N0eWxlIOimgeS7jmRpYXBsYXlPYmplY3TnmoQgY29udGV4dOS4iumdouWOu+WPllxuICAgICAgIHZhciBzdHlsZSA9IHRoaXMuY29udGV4dDtcbiBcbiAgICAgICAvL2ZpbGwgc3Ryb2tlIOS5i+WJje+8jCDlsLHlupTor6XopoFjbG9zZXBhdGgg5ZCm5YiZ57q/5p2h6L2s6KeS5Y+j5Lya5pyJ57y65Y+j44CCXG4gICAgICAgLy9kcmF3VHlwZU9ubHkg55Sx57un5om/c2hhcGXnmoTlhbfkvZPnu5jliLbnsbvmj5DkvptcbiAgICAgICBpZiAoIHRoaXMuX2RyYXdUeXBlT25seSAhPSBcInN0cm9rZVwiICYmIHRoaXMudHlwZSAhPSBcInBhdGhcIil7XG4gICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICB9XG5cbiAgICAgICBpZiAoIHN0eWxlLnN0cm9rZVN0eWxlICYmIHN0eWxlLmxpbmVXaWR0aCApe1xuICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgfVxuICAgICAgIC8v5q+U5aaC6LSd5aGe5bCU5puy57q/55S755qE57q/LGRyYXdUeXBlT25seT09c3Ryb2tl77yM5piv5LiN6IO95L2/55SoZmlsbOeahO+8jOWQjuaenOW+iOS4pemHjVxuICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgJiYgdGhpcy5fZHJhd1R5cGVPbmx5IT1cInN0cm9rZVwiKXtcbiAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICB9XG4gICAgICAgXG4gICB9LFxuXG5cbiAgIHJlbmRlciA6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgY3R4ICA9IHRoaXMuZ2V0U3RhZ2UoKS5jb250ZXh0MkQ7XG4gICAgICBcbiAgICAgIGlmICh0aGlzLmNvbnRleHQudHlwZSA9PSBcInNoYXBlXCIpe1xuICAgICAgICAgIC8vdHlwZSA9PSBzaGFwZeeahOaXtuWAme+8jOiHquWumuS5iee7mOeUu1xuICAgICAgICAgIC8v6L+Z5Liq5pe25YCZ5bCx5Y+v5Lul5L2/55Soc2VsZi5ncmFwaGljc+e7mOWbvuaOpeWPo+S6hu+8jOivpeaOpeWPo+aooeaLn+eahOaYr2FzM+eahOaOpeWPo1xuICAgICAgICAgIHRoaXMuZHJhdy5hcHBseSggdGhpcyApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL+i/meS4quaXtuWAme+8jOivtOaYjuivpXNoYXBl5piv6LCD55So5bey57uP57uY5Yi25aW955qEIHNoYXBlIOaooeWdl++8jOi/meS6m+aooeWdl+WFqOmDqOWcqC4uL3NoYXBl55uu5b2V5LiL6Z2iXG4gICAgICAgICAgaWYoIHRoaXMuZHJhdyApe1xuICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgIHRoaXMuZHJhdyggY3R4ICwgdGhpcy5jb250ZXh0ICk7XG4gICAgICAgICAgICAgIHRoaXMuZHJhd0VuZCggY3R4ICk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgfVxuICAgLFxuICAgLypcbiAgICAqIOeUu+iZmue6v1xuICAgICovXG4gICBkYXNoZWRMaW5lVG86ZnVuY3Rpb24oY3R4LCB4MSwgeTEsIHgyLCB5MiwgZGFzaExlbmd0aCkge1xuICAgICAgICAgZGFzaExlbmd0aCA9IHR5cGVvZiBkYXNoTGVuZ3RoID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgICAgICAgPyAzIDogZGFzaExlbmd0aDtcbiAgICAgICAgIGRhc2hMZW5ndGggPSBNYXRoLm1heCggZGFzaExlbmd0aCAsIHRoaXMuY29udGV4dC5saW5lV2lkdGggKTtcbiAgICAgICAgIHZhciBkZWx0YVggPSB4MiAtIHgxO1xuICAgICAgICAgdmFyIGRlbHRhWSA9IHkyIC0geTE7XG4gICAgICAgICB2YXIgbnVtRGFzaGVzID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICBNYXRoLnNxcnQoZGVsdGFYICogZGVsdGFYICsgZGVsdGFZICogZGVsdGFZKSAvIGRhc2hMZW5ndGhcbiAgICAgICAgICk7XG4gICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bURhc2hlczsgKytpKSB7XG4gICAgICAgICAgICAgdmFyIHggPSBwYXJzZUludCh4MSArIChkZWx0YVggLyBudW1EYXNoZXMpICogaSk7XG4gICAgICAgICAgICAgdmFyIHkgPSBwYXJzZUludCh5MSArIChkZWx0YVkgLyBudW1EYXNoZXMpICogaSk7XG4gICAgICAgICAgICAgY3R4W2kgJSAyID09PSAwID8gJ21vdmVUbycgOiAnbGluZVRvJ10oIHggLCB5ICk7XG4gICAgICAgICAgICAgaWYoIGkgPT0gKG51bURhc2hlcy0xKSAmJiBpJTIgPT09IDApe1xuICAgICAgICAgICAgICAgICBjdHgubGluZVRvKCB4MiAsIHkyICk7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgfSxcbiAgIC8qXG4gICAgKuS7jmNwbOiKgueCueS4reiOt+WPluWIsDTkuKrmlrnlkJHnmoTovrnnlYzoioLngrlcbiAgICAqQHBhcmFtICBjb250ZXh0IFxuICAgICpcbiAgICAqKi9cbiAgIGdldFJlY3RGb3JtUG9pbnRMaXN0IDogZnVuY3Rpb24oIGNvbnRleHQgKXtcbiAgICAgICB2YXIgbWluWCA9ICBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgIHZhciBtYXhYID0gIE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgdmFyIG1pblkgPSAgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICB2YXIgbWF4WSA9ICBOdW1iZXIuTUlOX1ZBTFVFO1xuXG4gICAgICAgdmFyIGNwbCA9IGNvbnRleHQucG9pbnRMaXN0OyAvL3RoaXMuZ2V0Y3BsKCk7XG4gICAgICAgZm9yKHZhciBpID0gMCwgbCA9IGNwbC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgaWYgKGNwbFtpXVswXSA8IG1pblgpIHtcbiAgICAgICAgICAgICAgIG1pblggPSBjcGxbaV1bMF07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVswXSA+IG1heFgpIHtcbiAgICAgICAgICAgICAgIG1heFggPSBjcGxbaV1bMF07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVsxXSA8IG1pblkpIHtcbiAgICAgICAgICAgICAgIG1pblkgPSBjcGxbaV1bMV07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVsxXSA+IG1heFkpIHtcbiAgICAgICAgICAgICAgIG1heFkgPSBjcGxbaV1bMV07XG4gICAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICB2YXIgbGluZVdpZHRoO1xuICAgICAgIGlmIChjb250ZXh0LnN0cm9rZVN0eWxlIHx8IGNvbnRleHQuZmlsbFN0eWxlICApIHtcbiAgICAgICAgICAgbGluZVdpZHRoID0gY29udGV4dC5saW5lV2lkdGggfHwgMTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4ge1xuICAgICAgICAgICB4ICAgICAgOiBNYXRoLnJvdW5kKG1pblggLSBsaW5lV2lkdGggLyAyKSxcbiAgICAgICAgICAgeSAgICAgIDogTWF0aC5yb3VuZChtaW5ZIC0gbGluZVdpZHRoIC8gMiksXG4gICAgICAgICAgIHdpZHRoICA6IG1heFggLSBtaW5YICsgbGluZVdpZHRoLFxuICAgICAgICAgICBoZWlnaHQgOiBtYXhZIC0gbWluWSArIGxpbmVXaWR0aFxuICAgICAgIH07XG4gICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcGU7XG4iLCIvKipcclxuICogQ2FudmF4LS1UZXh0XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5paH5pysIOexu1xyXG4gKiovXHJcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFRleHQgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgc2VsZi5fcmVOZXdsaW5lID0gL1xccj9cXG4vO1xyXG4gICAgc2VsZi5mb250UHJvcGVydHMgPSBbXCJmb250U3R5bGVcIiwgXCJmb250VmFyaWFudFwiLCBcImZvbnRXZWlnaHRcIiwgXCJmb250U2l6ZVwiLCBcImZvbnRGYW1pbHlcIl07XHJcblxyXG4gICAgLy/lgZrkuIDmrKHnroDljZXnmoRvcHTlj4LmlbDmoKHpqozvvIzkv53or4HlnKjnlKjmiLfkuI3kvKBvcHTnmoTml7blgJkg5oiW6ICF5Lyg5LqGb3B05L2G5piv6YeM6Z2i5rKh5pyJY29udGV4dOeahOaXtuWAmeaKpemUmVxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuXHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgIGZvbnRTaXplOiAxMywgLy/lrZfkvZPlpKflsI/pu5jorqQxM1xyXG4gICAgICAgIGZvbnRXZWlnaHQ6IFwibm9ybWFsXCIsXHJcbiAgICAgICAgZm9udEZhbWlseTogXCLlvq7ova/pm4Xpu5Esc2Fucy1zZXJpZlwiLFxyXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiBudWxsLFxyXG4gICAgICAgIGZpbGxTdHlsZTogJ2JsYW5rJyxcclxuICAgICAgICBzdHJva2VTdHlsZTogbnVsbCxcclxuICAgICAgICBsaW5lV2lkdGg6IDAsXHJcbiAgICAgICAgbGluZUhlaWdodDogMS4yLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogbnVsbCxcclxuICAgICAgICB0ZXh0QmFja2dyb3VuZENvbG9yOiBudWxsXHJcbiAgICB9LCBvcHQuY29udGV4dCk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dC5mb250ID0gc2VsZi5fZ2V0Rm9udERlY2xhcmF0aW9uKCk7XHJcblxyXG4gICAgc2VsZi50ZXh0ID0gdGV4dC50b1N0cmluZygpO1xyXG5cclxuICAgIFRleHQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBbb3B0XSk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKFRleHQsIERpc3BsYXlPYmplY3QsIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgLy9jb250ZXh05bGe5oCn5pyJ5Y+Y5YyW55qE55uR5ZCs5Ye95pWwXHJcbiAgICAgICAgaWYgKF8uaW5kZXhPZih0aGlzLmZvbnRQcm9wZXJ0cywgbmFtZSkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0W25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5L+u5pS555qE5pivZm9udOeahOafkOS4quWGheWuue+8jOWwsemHjeaWsOe7hOijheS4gOmBjWZvbnTnmoTlgLzvvIxcclxuICAgICAgICAgICAgLy/nhLblkI7pgJrnn6XlvJXmk47ov5nmrKHlr7ljb250ZXh055qE5L+u5pS55LiN6ZyA6KaB5LiK5oql5b+D6LezXHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5fZ2V0Rm9udERlY2xhcmF0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC53aWR0aCA9IHRoaXMuZ2V0VGV4dFdpZHRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5oZWlnaHQgPSB0aGlzLmdldFRleHRIZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgaW5pdDogZnVuY3Rpb24odGV4dCwgb3B0KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGMud2lkdGggPSB0aGlzLmdldFRleHRXaWR0aCgpO1xyXG4gICAgICAgIGMuaGVpZ2h0ID0gdGhpcy5nZXRUZXh0SGVpZ2h0KCk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbihjdHgpIHtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHRoaXMuY29udGV4dC4kbW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHAgaW4gY3R4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocCAhPSBcInRleHRCYXNlbGluZVwiICYmIHRoaXMuY29udGV4dC4kbW9kZWxbcF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHhbcF0gPSB0aGlzLmNvbnRleHQuJG1vZGVsW3BdO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclRleHQoY3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICB9LFxyXG4gICAgcmVzZXRUZXh0OiBmdW5jdGlvbih0ZXh0KSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dC50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuaGVhcnRCZWF0KCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VGV4dFdpZHRoOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSAwO1xyXG4gICAgICAgIFV0aWxzLl9waXhlbEN0eC5zYXZlKCk7XHJcbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4LmZvbnQgPSB0aGlzLmNvbnRleHQuZm9udDtcclxuICAgICAgICB3aWR0aCA9IHRoaXMuX2dldFRleHRXaWR0aChVdGlscy5fcGl4ZWxDdHgsIHRoaXMuX2dldFRleHRMaW5lcygpKTtcclxuICAgICAgICBVdGlscy5fcGl4ZWxDdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiB3aWR0aDtcclxuICAgIH0sXHJcbiAgICBnZXRUZXh0SGVpZ2h0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGV4dEhlaWdodChVdGlscy5fcGl4ZWxDdHgsIHRoaXMuX2dldFRleHRMaW5lcygpKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0VGV4dExpbmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0LnNwbGl0KHRoaXMuX3JlTmV3bGluZSk7XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHQ6IGZ1bmN0aW9uKGN0eCwgdGV4dExpbmVzKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0U3Ryb2tlKGN0eCwgdGV4dExpbmVzKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0RmlsbChjdHgsIHRleHRMaW5lcyk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0Rm9udERlY2xhcmF0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGZvbnRBcnIgPSBbXTtcclxuXHJcbiAgICAgICAgXy5lYWNoKHRoaXMuZm9udFByb3BlcnRzLCBmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgICAgIHZhciBmb250UCA9IHNlbGYuX2NvbnRleHRbcF07XHJcbiAgICAgICAgICAgIGlmIChwID09IFwiZm9udFNpemVcIikge1xyXG4gICAgICAgICAgICAgICAgZm9udFAgPSBwYXJzZUZsb2F0KGZvbnRQKSArIFwicHhcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvbnRQICYmIGZvbnRBcnIucHVzaChmb250UCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmb250QXJyLmpvaW4oJyAnKTtcclxuXHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHRGaWxsOiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250ZXh0LmZpbGxTdHlsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLl9ib3VuZGFyaWVzID0gW107XHJcbiAgICAgICAgdmFyIGxpbmVIZWlnaHRzID0gMDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHRPZkxpbmUgPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoY3R4LCBpLCB0ZXh0TGluZXMpO1xyXG4gICAgICAgICAgICBsaW5lSGVpZ2h0cyArPSBoZWlnaHRPZkxpbmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0TGluZShcclxuICAgICAgICAgICAgICAgICdmaWxsVGV4dCcsXHJcbiAgICAgICAgICAgICAgICBjdHgsXHJcbiAgICAgICAgICAgICAgICB0ZXh0TGluZXNbaV0sXHJcbiAgICAgICAgICAgICAgICAwLCAvL3RoaXMuX2dldExlZnRPZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dldFRvcE9mZnNldCgpICsgbGluZUhlaWdodHMsXHJcbiAgICAgICAgICAgICAgICBpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0U3Ryb2tlOiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlIHx8ICF0aGlzLmNvbnRleHQubGluZVdpZHRoKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBsaW5lSGVpZ2h0cyA9IDA7XHJcblxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3Ryb2tlRGFzaEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmICgxICYgdGhpcy5zdHJva2VEYXNoQXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0cm9rZURhc2hBcnJheS5wdXNoLmFwcGx5KHRoaXMuc3Ryb2tlRGFzaEFycmF5LCB0aGlzLnN0cm9rZURhc2hBcnJheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3VwcG9ydHNMaW5lRGFzaCAmJiBjdHguc2V0TGluZURhc2godGhpcy5zdHJva2VEYXNoQXJyYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0ZXh0TGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGhlaWdodE9mTGluZSA9IHRoaXMuX2dldEhlaWdodE9mTGluZShjdHgsIGksIHRleHRMaW5lcyk7XHJcbiAgICAgICAgICAgIGxpbmVIZWlnaHRzICs9IGhlaWdodE9mTGluZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclRleHRMaW5lKFxyXG4gICAgICAgICAgICAgICAgJ3N0cm9rZVRleHQnLFxyXG4gICAgICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICAgICAgdGV4dExpbmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgMCwgLy90aGlzLl9nZXRMZWZ0T2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRUb3BPZmZzZXQoKSArIGxpbmVIZWlnaHRzLFxyXG4gICAgICAgICAgICAgICAgaVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dExpbmU6IGZ1bmN0aW9uKG1ldGhvZCwgY3R4LCBsaW5lLCBsZWZ0LCB0b3AsIGxpbmVJbmRleCkge1xyXG4gICAgICAgIHRvcCAtPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoKSAvIDQ7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dC50ZXh0QWxpZ24gIT09ICdqdXN0aWZ5Jykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJDaGFycyhtZXRob2QsIGN0eCwgbGluZSwgbGVmdCwgdG9wLCBsaW5lSW5kZXgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgbGluZVdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KGxpbmUpLndpZHRoO1xyXG4gICAgICAgIHZhciB0b3RhbFdpZHRoID0gdGhpcy5jb250ZXh0LndpZHRoO1xyXG5cclxuICAgICAgICBpZiAodG90YWxXaWR0aCA+IGxpbmVXaWR0aCkge1xyXG4gICAgICAgICAgICB2YXIgd29yZHMgPSBsaW5lLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIHZhciB3b3Jkc1dpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KGxpbmUucmVwbGFjZSgvXFxzKy9nLCAnJykpLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgd2lkdGhEaWZmID0gdG90YWxXaWR0aCAtIHdvcmRzV2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBudW1TcGFjZXMgPSB3b3Jkcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB2YXIgc3BhY2VXaWR0aCA9IHdpZHRoRGlmZiAvIG51bVNwYWNlcztcclxuXHJcbiAgICAgICAgICAgIHZhciBsZWZ0T2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHdvcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJDaGFycyhtZXRob2QsIGN0eCwgd29yZHNbaV0sIGxlZnQgKyBsZWZ0T2Zmc2V0LCB0b3AsIGxpbmVJbmRleCk7XHJcbiAgICAgICAgICAgICAgICBsZWZ0T2Zmc2V0ICs9IGN0eC5tZWFzdXJlVGV4dCh3b3Jkc1tpXSkud2lkdGggKyBzcGFjZVdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIGxpbmUsIGxlZnQsIHRvcCwgbGluZUluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlckNoYXJzOiBmdW5jdGlvbihtZXRob2QsIGN0eCwgY2hhcnMsIGxlZnQsIHRvcCkge1xyXG4gICAgICAgIGN0eFttZXRob2RdKGNoYXJzLCAwLCB0b3ApO1xyXG4gICAgfSxcclxuICAgIF9nZXRIZWlnaHRPZkxpbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZm9udFNpemUgKiB0aGlzLmNvbnRleHQubGluZUhlaWdodDtcclxuICAgIH0sXHJcbiAgICBfZ2V0VGV4dFdpZHRoOiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIHZhciBtYXhXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0TGluZXNbMF0gfHwgJ3wnKS53aWR0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TGluZVdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHRleHRMaW5lc1tpXSkud2lkdGg7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50TGluZVdpZHRoID4gbWF4V2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoID0gY3VycmVudExpbmVXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWF4V2lkdGg7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRIZWlnaHQ6IGZ1bmN0aW9uKGN0eCwgdGV4dExpbmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5mb250U2l6ZSAqIHRleHRMaW5lcy5sZW5ndGggKiB0aGlzLmNvbnRleHQubGluZUhlaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUb3Agb2Zmc2V0XHJcbiAgICAgKi9cclxuICAgIF9nZXRUb3BPZmZzZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ID0gMDtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm1pZGRsZVwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IC10aGlzLmNvbnRleHQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XHJcbiAgICAgICAgICAgICAgICB0ID0gLXRoaXMuY29udGV4dC5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuICAgICAgICAvL+abtOWFt3RleHRBbGlnbiDlkowgdGV4dEJhc2VsaW5lIOmHjeaWsOefq+atoyB4eVxyXG4gICAgICAgIGlmIChjLnRleHRBbGlnbiA9PSBcImNlbnRlclwiKSB7XHJcbiAgICAgICAgICAgIHggPSAtYy53aWR0aCAvIDI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYy50ZXh0QWxpZ24gPT0gXCJyaWdodFwiKSB7XHJcbiAgICAgICAgICAgIHggPSAtYy53aWR0aDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjLnRleHRCYXNlbGluZSA9PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgICAgICAgIHkgPSAtYy5oZWlnaHQgLyAyO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGMudGV4dEJhc2VsaW5lID09IFwiYm90dG9tXCIpIHtcclxuICAgICAgICAgICAgeSA9IC1jLmhlaWdodDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICB3aWR0aDogYy53aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFRleHQ7IiwiXG4vKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDlkJHph4/mk43kvZznsbtcbiAqICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG5mdW5jdGlvbiBWZWN0b3IoeCwgeSkge1xuICAgIHZhciB2eCA9IDAsdnkgPSAwO1xuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIF8uaXNPYmplY3QoIHggKSApe1xuICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiggXy5pc0FycmF5KCBhcmcgKSApe1xuICAgICAgICAgICB2eCA9IGFyZ1swXTtcbiAgICAgICAgICAgdnkgPSBhcmdbMV07XG4gICAgICAgIH0gZWxzZSBpZiggYXJnLmhhc093blByb3BlcnR5KFwieFwiKSAmJiBhcmcuaGFzT3duUHJvcGVydHkoXCJ5XCIpICkge1xuICAgICAgICAgICB2eCA9IGFyZy54O1xuICAgICAgICAgICB2eSA9IGFyZy55O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2F4ZXMgPSBbdngsIHZ5XTtcbn07XG5WZWN0b3IucHJvdG90eXBlID0ge1xuICAgIGRpc3RhbmNlOiBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgeCA9IHRoaXMuX2F4ZXNbMF0gLSB2Ll9heGVzWzBdO1xuICAgICAgICB2YXIgeSA9IHRoaXMuX2F4ZXNbMV0gLSB2Ll9heGVzWzFdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHggKiB4KSArICh5ICogeSkpO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBWZWN0b3I7IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5aSE55CG5Li65bmz5ruR57q/5p2hXG4gKi9cbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIEBpbm5lclxuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZShwMCwgcDEsIHAyLCBwMywgdCwgdDIsIHQzKSB7XG4gICAgdmFyIHYwID0gKHAyIC0gcDApICogMC4yNTtcbiAgICB2YXIgdjEgPSAocDMgLSBwMSkgKiAwLjI1O1xuICAgIHJldHVybiAoMiAqIChwMSAtIHAyKSArIHYwICsgdjEpICogdDMgXG4gICAgICAgICAgICsgKC0gMyAqIChwMSAtIHAyKSAtIDIgKiB2MCAtIHYxKSAqIHQyXG4gICAgICAgICAgICsgdjAgKiB0ICsgcDE7XG59XG4vKipcbiAqIOWkmue6v+auteW5s+a7keabsue6vyBcbiAqIG9wdCA9PT4gcG9pbnRzICwgaXNMb29wXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICggb3B0ICkge1xuICAgIHZhciBwb2ludHMgPSBvcHQucG9pbnRzO1xuICAgIHZhciBpc0xvb3AgPSBvcHQuaXNMb29wO1xuICAgIHZhciBzbW9vdGhGaWx0ZXIgPSBvcHQuc21vb3RoRmlsdGVyO1xuXG4gICAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGg7XG4gICAgaWYoIGxlbiA9PSAxICl7XG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIHZhciByZXQgPSBbXTtcbiAgICB2YXIgZGlzdGFuY2UgID0gMDtcbiAgICB2YXIgcHJlVmVydG9yID0gbmV3IFZlY3RvciggcG9pbnRzWzBdICk7XG4gICAgdmFyIGlWdG9yICAgICA9IG51bGxcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlWdG9yID0gbmV3IFZlY3Rvcihwb2ludHNbaV0pO1xuICAgICAgICBkaXN0YW5jZSArPSBwcmVWZXJ0b3IuZGlzdGFuY2UoIGlWdG9yICk7XG4gICAgICAgIHByZVZlcnRvciA9IGlWdG9yO1xuICAgIH1cblxuICAgIHByZVZlcnRvciA9IG51bGw7XG4gICAgaVZ0b3IgICAgID0gbnVsbDtcblxuXG4gICAgLy/ln7rmnKzkuIrnrYnkuo7mm7LnjodcbiAgICB2YXIgc2VncyA9IGRpc3RhbmNlIC8gNjtcblxuICAgIHNlZ3MgPSBzZWdzIDwgbGVuID8gbGVuIDogc2VncztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ3M7IGkrKykge1xuICAgICAgICB2YXIgcG9zID0gaSAvIChzZWdzLTEpICogKGlzTG9vcCA/IGxlbiA6IGxlbiAtIDEpO1xuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcihwb3MpO1xuXG4gICAgICAgIHZhciB3ID0gcG9zIC0gaWR4O1xuXG4gICAgICAgIHZhciBwMDtcbiAgICAgICAgdmFyIHAxID0gcG9pbnRzW2lkeCAlIGxlbl07XG4gICAgICAgIHZhciBwMjtcbiAgICAgICAgdmFyIHAzO1xuICAgICAgICBpZiAoIWlzTG9vcCkge1xuICAgICAgICAgICAgcDAgPSBwb2ludHNbaWR4ID09PSAwID8gaWR4IDogaWR4IC0gMV07XG4gICAgICAgICAgICBwMiA9IHBvaW50c1tpZHggPiBsZW4gLSAyID8gbGVuIC0gMSA6IGlkeCArIDFdO1xuICAgICAgICAgICAgcDMgPSBwb2ludHNbaWR4ID4gbGVuIC0gMyA/IGxlbiAtIDEgOiBpZHggKyAyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAwID0gcG9pbnRzWyhpZHggLTEgKyBsZW4pICUgbGVuXTtcbiAgICAgICAgICAgIHAyID0gcG9pbnRzWyhpZHggKyAxKSAlIGxlbl07XG4gICAgICAgICAgICBwMyA9IHBvaW50c1soaWR4ICsgMikgJSBsZW5dO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHcyID0gdyAqIHc7XG4gICAgICAgIHZhciB3MyA9IHcgKiB3MjtcblxuICAgICAgICB2YXIgcnAgPSBbXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMF0sIHAxWzBdLCBwMlswXSwgcDNbMF0sIHcsIHcyLCB3MyksXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMV0sIHAxWzFdLCBwMlsxXSwgcDNbMV0sIHcsIHcyLCB3MylcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgIF8uaXNGdW5jdGlvbihzbW9vdGhGaWx0ZXIpICYmIHNtb290aEZpbHRlciggcnAgKTtcblxuICAgICAgICByZXQucHVzaCggcnAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn07IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaKmOe6vyDnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcG9pbnRMaXN0IOWQhOS4qumhtuinkuWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBTbW9vdGhTcGxpbmUgZnJvbSBcIi4uL2dlb20vU21vb3RoU3BsaW5lXCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgQnJva2VuTGluZSA9IGZ1bmN0aW9uKG9wdCAsIGF0eXBlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcImJyb2tlbmxpbmVcIjtcclxuICAgIHNlbGYuX2RyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdChvcHQpO1xyXG4gICAgaWYoIGF0eXBlICE9PSBcImNsb25lXCIgKXtcclxuICAgICAgICBzZWxmLl9pbml0UG9pbnRMaXN0KG9wdC5jb250ZXh0KTtcclxuICAgIH07XHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgIGxpbmVUeXBlOiBudWxsLFxyXG4gICAgICAgIHNtb290aDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy97QXJyYXl9ICAvLyDlv4XpobvvvIzlkITkuKrpobbop5LlnZDmoIdcclxuICAgICAgICBzbW9vdGhGaWx0ZXI6IG51bGxcclxuICAgIH0sIG9wdC5jb250ZXh0ICk7XHJcblxyXG4gICAgQnJva2VuTGluZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKEJyb2tlbkxpbmUsIFNoYXBlLCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicG9pbnRMaXN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5pdFBvaW50TGlzdCh0aGlzLmNvbnRleHQsIHZhbHVlLCBwcmVWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9pbml0UG9pbnRMaXN0OiBmdW5jdGlvbihjb250ZXh0LCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICB2YXIgbXlDID0gY29udGV4dDtcclxuICAgICAgICBpZiAobXlDLnNtb290aCkge1xyXG4gICAgICAgICAgICAvL3Ntb290aEZpbHRlciAtLSDmr5TlpoLlnKjmipjnur/lm77kuK3jgILkvJrkvKDkuIDkuKpzbW9vdGhGaWx0ZXLov4fmnaXlgZpwb2ludOeahOe6oOato+OAglxyXG4gICAgICAgICAgICAvL+iuqXnkuI3og73otoXov4flupXpg6jnmoTljp/ngrlcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgIHBvaW50czogbXlDLnBvaW50TGlzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24obXlDLnNtb290aEZpbHRlcikpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zbW9vdGhGaWx0ZXIgPSBteUMuc21vb3RoRmlsdGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gdHJ1ZTsgLy/mnKzmrKHovazmjaLkuI3lh7rlj5Hlv4Pot7NcclxuICAgICAgICAgICAgdmFyIGN1cnJMID0gU21vb3RoU3BsaW5lKG9iaik7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoPjApIHtcclxuICAgICAgICAgICAgICAgIGN1cnJMW2N1cnJMLmxlbmd0aCAtIDFdWzBdID0gdmFsdWVbdmFsdWUubGVuZ3RoIC0gMV1bMF07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG15Qy5wb2ludExpc3QgPSBjdXJyTDtcclxuICAgICAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIC8vcG9seWdvbumcgOimgeimhueblmRyYXfmlrnms5XvvIzmiYDku6XopoHmiorlhbfkvZPnmoTnu5jliLbku6PnoIHkvZzkuLpfZHJhd+aKveemu+WHuuadpVxyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5fZHJhdyhjdHgsIGNvbnRleHQpO1xyXG4gICAgfSxcclxuICAgIF9kcmF3OiBmdW5jdGlvbihjdHgsIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XHJcbiAgICAgICAgaWYgKHBvaW50TGlzdC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIC8vIOWwkeS6jjLkuKrngrnlsLHkuI3nlLvkuoZ+XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghY29udGV4dC5saW5lVHlwZSB8fCBjb250ZXh0LmxpbmVUeXBlID09ICdzb2xpZCcpIHtcclxuICAgICAgICAgICAgLy/pu5jorqTkuLrlrp7nur9cclxuICAgICAgICAgICAgLy9UT0RPOuebruWJjeWmguaenCDmnInorr7nva5zbW9vdGgg55qE5oOF5Ya15LiL5piv5LiN5pSv5oyB6Jma57q/55qEXHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocG9pbnRMaXN0W2ldWzBdLCBwb2ludExpc3RbaV1bMV0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5saW5lVHlwZSA9PSAnZGFzaGVkJyB8fCBjb250ZXh0LmxpbmVUeXBlID09ICdkb3R0ZWQnKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LnNtb290aCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgc2kgPSAwLCBzbCA9IHBvaW50TGlzdC5sZW5ndGg7IHNpIDwgc2w7IHNpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2kgPT0gc2wtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oIHBvaW50TGlzdFtzaV1bMF0gLCBwb2ludExpc3Rbc2ldWzFdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyggcG9pbnRMaXN0W3NpKzFdWzBdICwgcG9pbnRMaXN0W3NpKzFdWzFdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2krPTE7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/nlLvomZrnur/nmoTmlrnms5UgIFxyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwb2ludExpc3RbMF1bMF0sIHBvaW50TGlzdFswXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVggPSBwb2ludExpc3RbaSAtIDFdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b1ggPSBwb2ludExpc3RbaV1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21ZID0gcG9pbnRMaXN0W2kgLSAxXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9ZID0gcG9pbnRMaXN0W2ldWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGFzaGVkTGluZVRvKGN0eCwgZnJvbVgsIGZyb21ZLCB0b1gsIHRvWSwgNSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9LFxyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oY29udGV4dCkge1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0gY29udGV4dCA/IGNvbnRleHQgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjdEZvcm1Qb2ludExpc3QoY29udGV4dCk7XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBCcm9rZW5MaW5lOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDlnIblvaIg57G7XHJcbiAqXHJcbiAqIOWdkOagh+WOn+eCueWGjeWchuW/g1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEByIOWchuWNiuW+hFxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG5cclxudmFyIENpcmNsZSA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJjaXJjbGVcIjtcclxuXHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcblxyXG4gICAgLy/pu5jorqTmg4XlhrXkuIvpnaLvvIxjaXJjbGXkuI3pnIDopoHmiop4eei/m+ihjHBhcmVudEludOi9rOaNolxyXG4gICAgKCBcInh5VG9JbnRcIiBpbiBvcHQgKSB8fCAoIG9wdC54eVRvSW50ID0gZmFsc2UgKTtcclxuXHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgIHIgOiBvcHQuY29udGV4dC5yIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5ZyG5Y2K5b6EXHJcbiAgICB9XHJcbiAgICBDaXJjbGUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKENpcmNsZSAsIFNoYXBlICwge1xyXG4gICAvKipcclxuICAgICAqIOWIm+W7uuWchuW9oui3r+W+hFxyXG4gICAgICogQHBhcmFtIHtDb250ZXh0MkR9IGN0eCBDYW52YXMgMkTkuIrkuIvmlodcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICBpZiAoIXN0eWxlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5hcmMoMCAsIDAsIHN0eWxlLnIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxyXG4gICAgICovXHJcbiAgICBnZXRSZWN0IDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICB2YXIgbGluZVdpZHRoO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHN0eWxlID8gc3R5bGUgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZpbGxTdHlsZSB8fCBzdHlsZS5zdHJva2VTdHlsZSApIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeCA6IE1hdGgucm91bmQoMCAtIHN0eWxlLnIgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgeSA6IE1hdGgucm91bmQoMCAtIHN0eWxlLnIgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgd2lkdGggOiBzdHlsZS5yICogMiArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0IDogc3R5bGUuciAqIDIgKyBsaW5lV2lkdGhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENpcmNsZTtcclxuXHJcblxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSAtLSB0IHswLCAxfVxuICAgICAqIEByZXR1cm4ge1BvaW50fSAgLS0gcmV0dXJuIHBvaW50IGF0IHRoZSBnaXZlbiB0aW1lIGluIHRoZSBiZXppZXIgYXJjXG4gICAgICovXG4gICAgZ2V0UG9pbnRCeVRpbWU6IGZ1bmN0aW9uKHQgLCBwbGlzdCkge1xuICAgICAgICB2YXIgaXQgPSAxIC0gdCxcbiAgICAgICAgaXQyID0gaXQgKiBpdCxcbiAgICAgICAgaXQzID0gaXQyICogaXQ7XG4gICAgICAgIHZhciB0MiA9IHQgKiB0LFxuICAgICAgICB0MyA9IHQyICogdDtcbiAgICAgICAgdmFyIHhTdGFydD1wbGlzdFswXSx5U3RhcnQ9cGxpc3RbMV0sY3BYMT1wbGlzdFsyXSxjcFkxPXBsaXN0WzNdLGNwWDI9MCxjcFkyPTAseEVuZD0wLHlFbmQ9MDtcbiAgICAgICAgaWYocGxpc3QubGVuZ3RoPjYpe1xuICAgICAgICAgICAgY3BYMj1wbGlzdFs0XTtcbiAgICAgICAgICAgIGNwWTI9cGxpc3RbNV07XG4gICAgICAgICAgICB4RW5kPXBsaXN0WzZdO1xuICAgICAgICAgICAgeUVuZD1wbGlzdFs3XTtcbiAgICAgICAgICAgIC8v5LiJ5qyh6LSd5aGe5bCUXG4gICAgICAgICAgICByZXR1cm4geyBcbiAgICAgICAgICAgICAgICB4IDogaXQzICogeFN0YXJ0ICsgMyAqIGl0MiAqIHQgKiBjcFgxICsgMyAqIGl0ICogdDIgKiBjcFgyICsgdDMgKiB4RW5kLFxuICAgICAgICAgICAgICAgIHkgOiBpdDMgKiB5U3RhcnQgKyAzICogaXQyICogdCAqIGNwWTEgKyAzICogaXQgKiB0MiAqIGNwWTIgKyB0MyAqIHlFbmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5LqM5qyh6LSd5aGe5bCUXG4gICAgICAgICAgICB4RW5kPXBsaXN0WzRdO1xuICAgICAgICAgICAgeUVuZD1wbGlzdFs1XTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeCA6IGl0MiAqIHhTdGFydCArIDIgKiB0ICogaXQgKiBjcFgxICsgdDIqeEVuZCxcbiAgICAgICAgICAgICAgICB5IDogaXQyICogeVN0YXJ0ICsgMiAqIHQgKiBpdCAqIGNwWTEgKyB0Mip5RW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIFBhdGgg57G7XHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHBhdGggcGF0aOS4slxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbmltcG9ydCBNYXRyaXggZnJvbSBcIi4uL2dlb20vTWF0cml4XCI7XHJcbmltcG9ydCBCZXppZXIgZnJvbSBcIi4uL2dlb20vYmV6aWVyXCI7XHJcblxyXG52YXIgUGF0aCA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJwYXRoXCI7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdChvcHQpO1xyXG4gICAgaWYgKFwiZHJhd1R5cGVPbmx5XCIgaW4gb3B0KSB7XHJcbiAgICAgICAgc2VsZi5kcmF3VHlwZU9ubHkgPSBvcHQuZHJhd1R5cGVPbmx5O1xyXG4gICAgfTtcclxuICAgIHNlbGYuX19wYXJzZVBhdGhEYXRhID0gbnVsbDtcclxuICAgIHZhciBfY29udGV4dCA9IHtcclxuICAgICAgICBwb2ludExpc3Q6IFtdLCAvL+S7juS4i+mdoueahHBhdGjkuK3orqHnrpflvpfliLDnmoTovrnnlYzngrnnmoTpm4blkIhcclxuICAgICAgICBwYXRoOiBvcHQuY29udGV4dC5wYXRoIHx8IFwiXCIgLy/lrZfnrKbkuLIg5b+F6aG777yM6Lev5b6E44CC5L6L5aaCOk0gMCAwIEwgMCAxMCBMIDEwIDEwIFogKOS4gOS4quS4ieinkuW9oilcclxuICAgICAgICAgICAgLy9NID0gbW92ZXRvXHJcbiAgICAgICAgICAgIC8vTCA9IGxpbmV0b1xyXG4gICAgICAgICAgICAvL0ggPSBob3Jpem9udGFsIGxpbmV0b1xyXG4gICAgICAgICAgICAvL1YgPSB2ZXJ0aWNhbCBsaW5ldG9cclxuICAgICAgICAgICAgLy9DID0gY3VydmV0b1xyXG4gICAgICAgICAgICAvL1MgPSBzbW9vdGggY3VydmV0b1xyXG4gICAgICAgICAgICAvL1EgPSBxdWFkcmF0aWMgQmVsemllciBjdXJ2ZVxyXG4gICAgICAgICAgICAvL1QgPSBzbW9vdGggcXVhZHJhdGljIEJlbHppZXIgY3VydmV0b1xyXG4gICAgICAgICAgICAvL1ogPSBjbG9zZXBhdGhcclxuICAgIH07XHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoX2NvbnRleHQsIChzZWxmLl9jb250ZXh0IHx8IHt9KSk7XHJcbiAgICBQYXRoLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoUGF0aCwgU2hhcGUsIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJwYXRoXCIpIHsgLy/lpoLmnpxwYXRo5pyJ5Y+Y5Yqo77yM6ZyA6KaB6Ieq5Yqo6K6h566X5paw55qEcG9pbnRMaXN0XHJcbiAgICAgICAgICAgIHRoaXMuX19wYXJzZVBhdGhEYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnBvaW50TGlzdCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcGFyc2VQYXRoRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9fcGFyc2VQYXRoRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX3BhcnNlUGF0aERhdGE7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy/liIbmi4blrZDliIbnu4RcclxuICAgICAgICB0aGlzLl9fcGFyc2VQYXRoRGF0YSA9IFtdO1xyXG4gICAgICAgIHZhciBwYXRocyA9IF8uY29tcGFjdChkYXRhLnJlcGxhY2UoL1tNbV0vZywgXCJcXFxcciQmXCIpLnNwbGl0KCdcXFxccicpKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIF8uZWFjaChwYXRocywgZnVuY3Rpb24ocGF0aFN0cikge1xyXG4gICAgICAgICAgICBtZS5fX3BhcnNlUGF0aERhdGEucHVzaChtZS5fcGFyc2VDaGlsZFBhdGhEYXRhKHBhdGhTdHIpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fX3BhcnNlUGF0aERhdGE7XHJcbiAgICB9LFxyXG4gICAgX3BhcnNlQ2hpbGRQYXRoRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbW1hbmQgc3RyaW5nXHJcbiAgICAgICAgdmFyIGNzID0gZGF0YTtcclxuICAgICAgICAvLyBjb21tYW5kIGNoYXJzXHJcbiAgICAgICAgdmFyIGNjID0gW1xyXG4gICAgICAgICAgICAnbScsICdNJywgJ2wnLCAnTCcsICd2JywgJ1YnLCAnaCcsICdIJywgJ3onLCAnWicsXHJcbiAgICAgICAgICAgICdjJywgJ0MnLCAncScsICdRJywgJ3QnLCAnVCcsICdzJywgJ1MnLCAnYScsICdBJ1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8gIC9nLCAnICcpO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvIC9nLCAnLCcpO1xyXG4gICAgICAgIC8vY3MgPSBjcy5yZXBsYWNlKC8oLiktL2csIFwiJDEsLVwiKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLyhcXGQpLS9nLCAnJDEsLScpO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvLCwvZywgJywnKTtcclxuICAgICAgICB2YXIgbjtcclxuICAgICAgICAvLyBjcmVhdGUgcGlwZXMgc28gdGhhdCB3ZSBjYW4gc3BsaXQgdGhlIGRhdGFcclxuICAgICAgICBmb3IgKG4gPSAwOyBuIDwgY2MubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgY3MgPSBjcy5yZXBsYWNlKG5ldyBSZWdFeHAoY2Nbbl0sICdnJyksICd8JyArIGNjW25dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIGFycmF5XHJcbiAgICAgICAgdmFyIGFyciA9IGNzLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgdmFyIGNhID0gW107XHJcbiAgICAgICAgLy8gaW5pdCBjb250ZXh0IHBvaW50XHJcbiAgICAgICAgdmFyIGNweCA9IDA7XHJcbiAgICAgICAgdmFyIGNweSA9IDA7XHJcbiAgICAgICAgZm9yIChuID0gMTsgbiA8IGFyci5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gYXJyW25dO1xyXG4gICAgICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoMCk7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zbGljZSgxKTtcclxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCgnZSwtJywgJ2cnKSwgJ2UtJyk7XHJcblxyXG4gICAgICAgICAgICAvL+acieeahOaXtuWAme+8jOavlOWmguKAnDIy77yMLTIy4oCdIOaVsOaNruWPr+iDveS8mue7j+W4uOeahOiiq+WGmeaIkDIyLTIy77yM6YKj5LmI6ZyA6KaB5omL5Yqo5L+u5pS5XHJcbiAgICAgICAgICAgIC8vc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCgnLScsICdnJyksICcsLScpO1xyXG4gICAgICAgICAgICAvL3N0ciA9IHN0ci5yZXBsYWNlKC8oLiktL2csIFwiJDEsLVwiKVxyXG4gICAgICAgICAgICB2YXIgcCA9IHN0ci5zcGxpdCgnLCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHAubGVuZ3RoID4gMCAmJiBwWzBdID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBbaV0gPSBwYXJzZUZsb2F0KHBbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChwLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc05hTihwWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGNtZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGN0bFB0eDtcclxuICAgICAgICAgICAgICAgIHZhciBjdGxQdHk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldkNtZDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcng7XHJcbiAgICAgICAgICAgICAgICB2YXIgcnk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHNpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZhO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZzO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB4MSA9IGNweDtcclxuICAgICAgICAgICAgICAgIHZhciB5MSA9IGNweTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb252ZXJ0IGwsIEgsIGgsIFYsIGFuZCB2IHRvIExcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICdsJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2gnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnSCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwLnNoaWZ0KCksIHAuc2hpZnQoKSwgcC5zaGlmdCgpLCBwLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdjJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNweCArIHAuc2hpZnQoKSwgY3B5ICsgcC5zaGlmdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdDJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdTJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ0MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjdGxQdHgsIGN0bFB0eSwgcC5zaGlmdCgpLCBwLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHgsIGN0bFB0eSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNtZCA9IGNhW2NhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNtZC5jb21tYW5kID09PSAnQycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCArIChjcHggLSBwcmV2Q21kLnBvaW50c1syXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHkgKyAoY3B5IC0gcHJldkNtZC5wb2ludHNbM10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4LCBjdGxQdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCArIHAuc2hpZnQoKSwgY3B5ICsgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ1EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHgsIGN0bFB0eSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNtZCA9IGNhW2NhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNtZC5jb21tYW5kID09PSAnUScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCArIChjcHggLSBwcmV2Q21kLnBvaW50c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHkgKyAoY3B5IC0gcHJldkNtZC5wb2ludHNbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnUSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGN0bFB0eCwgY3RsUHR5LCBjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHgsIGN0bFB0eSA9IGNweTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkNtZCA9IGNhW2NhLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldkNtZC5jb21tYW5kID09PSAnUScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweCArIChjcHggLSBwcmV2Q21kLnBvaW50c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHkgPSBjcHkgKyAoY3B5IC0gcHJldkNtZC5wb2ludHNbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdRJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3RsUHR4LCBjdGxQdHksIGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ4ID0gcC5zaGlmdCgpOyAvL3jljYrlvoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnkgPSBwLnNoaWZ0KCk7IC8veeWNiuW+hFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwc2kgPSBwLnNoaWZ0KCk7IC8v5peL6L2s6KeS5bqmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhID0gcC5zaGlmdCgpOyAvL+inkuW6puWkp+WwjyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMgPSBwLnNoaWZ0KCk7IC8v5pe26ZKI5pa55ZCRXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGNweCwgeTEgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKSwgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IHRoaXMuX2NvbnZlcnRQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxLCB5MSwgY3B4LCBjcHksIGZhLCBmcywgcngsIHJ5LCBwc2lcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByeSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHNpID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnMgPSBwLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGNweCwgeTEgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdBJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzID0gdGhpcy5fY29udmVydFBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDEsIHkxLCBjcHgsIGNweSwgZmEsIGZzLCByeCwgcnksIHBzaVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2EucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogY21kIHx8IGMsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiBwb2ludHNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ3onIHx8IGMgPT09ICdaJykge1xyXG4gICAgICAgICAgICAgICAgY2EucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogJ3onLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50czogW11cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gY2E7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBAcGFyYW0geDEg5Y6f54K5eFxyXG4gICAgICogQHBhcmFtIHkxIOWOn+eCuXlcclxuICAgICAqIEBwYXJhbSB4MiDnu4jngrnlnZDmoIcgeFxyXG4gICAgICogQHBhcmFtIHkyIOe7iOeCueWdkOaghyB5XHJcbiAgICAgKiBAcGFyYW0gZmEg6KeS5bqm5aSn5bCPXHJcbiAgICAgKiBAcGFyYW0gZnMg5pe26ZKI5pa55ZCRXHJcbiAgICAgKiBAcGFyYW0gcnggeOWNiuW+hFxyXG4gICAgICogQHBhcmFtIHJ5IHnljYrlvoRcclxuICAgICAqIEBwYXJhbSBwc2lEZWcg5peL6L2s6KeS5bqmXHJcbiAgICAgKi9cclxuICAgIF9jb252ZXJ0UG9pbnQ6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyLCBmYSwgZnMsIHJ4LCByeSwgcHNpRGVnKSB7XHJcblxyXG4gICAgICAgIHZhciBwc2kgPSBwc2lEZWcgKiAoTWF0aC5QSSAvIDE4MC4wKTtcclxuICAgICAgICB2YXIgeHAgPSBNYXRoLmNvcyhwc2kpICogKHgxIC0geDIpIC8gMi4wICsgTWF0aC5zaW4ocHNpKSAqICh5MSAtIHkyKSAvIDIuMDtcclxuICAgICAgICB2YXIgeXAgPSAtMSAqIE1hdGguc2luKHBzaSkgKiAoeDEgLSB4MikgLyAyLjAgKyBNYXRoLmNvcyhwc2kpICogKHkxIC0geTIpIC8gMi4wO1xyXG5cclxuICAgICAgICB2YXIgbGFtYmRhID0gKHhwICogeHApIC8gKHJ4ICogcngpICsgKHlwICogeXApIC8gKHJ5ICogcnkpO1xyXG5cclxuICAgICAgICBpZiAobGFtYmRhID4gMSkge1xyXG4gICAgICAgICAgICByeCAqPSBNYXRoLnNxcnQobGFtYmRhKTtcclxuICAgICAgICAgICAgcnkgKj0gTWF0aC5zcXJ0KGxhbWJkYSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZiA9IE1hdGguc3FydCgoKChyeCAqIHJ4KSAqIChyeSAqIHJ5KSkgLSAoKHJ4ICogcngpICogKHlwICogeXApKSAtICgocnkgKiByeSkgKiAoeHAgKiB4cCkpKSAvICgocnggKiByeCkgKiAoeXAgKiB5cCkgKyAocnkgKiByeSkgKiAoeHAgKiB4cCkpKTtcclxuXHJcbiAgICAgICAgaWYgKGZhID09PSBmcykge1xyXG4gICAgICAgICAgICBmICo9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNOYU4oZikpIHtcclxuICAgICAgICAgICAgZiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY3hwID0gZiAqIHJ4ICogeXAgLyByeTtcclxuICAgICAgICB2YXIgY3lwID0gZiAqIC1yeSAqIHhwIC8gcng7XHJcblxyXG4gICAgICAgIHZhciBjeCA9ICh4MSArIHgyKSAvIDIuMCArIE1hdGguY29zKHBzaSkgKiBjeHAgLSBNYXRoLnNpbihwc2kpICogY3lwO1xyXG4gICAgICAgIHZhciBjeSA9ICh5MSArIHkyKSAvIDIuMCArIE1hdGguc2luKHBzaSkgKiBjeHAgKyBNYXRoLmNvcyhwc2kpICogY3lwO1xyXG5cclxuICAgICAgICB2YXIgdk1hZyA9IGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2WzBdICogdlswXSArIHZbMV0gKiB2WzFdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB2UmF0aW8gPSBmdW5jdGlvbih1LCB2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodVswXSAqIHZbMF0gKyB1WzFdICogdlsxXSkgLyAodk1hZyh1KSAqIHZNYWcodikpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHZBbmdsZSA9IGZ1bmN0aW9uKHUsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh1WzBdICogdlsxXSA8IHVbMV0gKiB2WzBdID8gLTEgOiAxKSAqIE1hdGguYWNvcyh2UmF0aW8odSwgdikpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHRoZXRhID0gdkFuZ2xlKFsxLCAwXSwgWyh4cCAtIGN4cCkgLyByeCwgKHlwIC0gY3lwKSAvIHJ5XSk7XHJcbiAgICAgICAgdmFyIHUgPSBbKHhwIC0gY3hwKSAvIHJ4LCAoeXAgLSBjeXApIC8gcnldO1xyXG4gICAgICAgIHZhciB2ID0gWygtMSAqIHhwIC0gY3hwKSAvIHJ4LCAoLTEgKiB5cCAtIGN5cCkgLyByeV07XHJcbiAgICAgICAgdmFyIGRUaGV0YSA9IHZBbmdsZSh1LCB2KTtcclxuXHJcbiAgICAgICAgaWYgKHZSYXRpbyh1LCB2KSA8PSAtMSkge1xyXG4gICAgICAgICAgICBkVGhldGEgPSBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodlJhdGlvKHUsIHYpID49IDEpIHtcclxuICAgICAgICAgICAgZFRoZXRhID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZzID09PSAwICYmIGRUaGV0YSA+IDApIHtcclxuICAgICAgICAgICAgZFRoZXRhID0gZFRoZXRhIC0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmcyA9PT0gMSAmJiBkVGhldGEgPCAwKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IGRUaGV0YSArIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2N4LCBjeSwgcngsIHJ5LCB0aGV0YSwgZFRoZXRhLCBwc2ksIGZzXTtcclxuICAgIH0sXHJcbiAgICAvKlxyXG4gICAgICog6I635Y+WYmV6aWVy5LiK6Z2i55qE54K55YiX6KGoXHJcbiAgICAgKiAqL1xyXG4gICAgX2dldEJlemllclBvaW50czogZnVuY3Rpb24ocCkge1xyXG4gICAgICAgIHZhciBzdGVwcyA9IE1hdGguYWJzKE1hdGguc3FydChNYXRoLnBvdyhwLnNsaWNlKC0xKVswXSAtIHBbMV0sIDIpICsgTWF0aC5wb3cocC5zbGljZSgtMiwgLTEpWzBdIC0gcFswXSwgMikpKTtcclxuICAgICAgICBzdGVwcyA9IE1hdGguY2VpbChzdGVwcyAvIDUpO1xyXG4gICAgICAgIHZhciBwYXJyID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gc3RlcHM7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdCA9IGkgLyBzdGVwcztcclxuICAgICAgICAgICAgdmFyIHRwID0gQmV6aWVyLmdldFBvaW50QnlUaW1lKHQsIHApO1xyXG4gICAgICAgICAgICBwYXJyLnB1c2godHAueCk7XHJcbiAgICAgICAgICAgIHBhcnIucHVzaCh0cC55KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBwYXJyO1xyXG4gICAgfSxcclxuICAgIC8qXHJcbiAgICAgKiDlpoLmnpxwYXRo5Lit5pyJQSBhIO+8jOimgeWvvOWHuuWvueW6lOeahHBvaW50c1xyXG4gICAgICovXHJcbiAgICBfZ2V0QXJjUG9pbnRzOiBmdW5jdGlvbihwKSB7XHJcblxyXG4gICAgICAgIHZhciBjeCA9IHBbMF07XHJcbiAgICAgICAgdmFyIGN5ID0gcFsxXTtcclxuICAgICAgICB2YXIgcnggPSBwWzJdO1xyXG4gICAgICAgIHZhciByeSA9IHBbM107XHJcbiAgICAgICAgdmFyIHRoZXRhID0gcFs0XTtcclxuICAgICAgICB2YXIgZFRoZXRhID0gcFs1XTtcclxuICAgICAgICB2YXIgcHNpID0gcFs2XTtcclxuICAgICAgICB2YXIgZnMgPSBwWzddO1xyXG4gICAgICAgIHZhciByID0gKHJ4ID4gcnkpID8gcnggOiByeTtcclxuICAgICAgICB2YXIgc2NhbGVYID0gKHJ4ID4gcnkpID8gMSA6IHJ4IC8gcnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IChyeCA+IHJ5KSA/IHJ5IC8gcnggOiAxO1xyXG5cclxuICAgICAgICB2YXIgX3RyYW5zZm9ybSA9IG5ldyBNYXRyaXgoKTtcclxuICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS5zY2FsZShzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS5yb3RhdGUocHNpKTtcclxuICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZShjeCwgY3kpO1xyXG5cclxuICAgICAgICB2YXIgY3BzID0gW107XHJcbiAgICAgICAgdmFyIHN0ZXBzID0gKDM2MCAtICghZnMgPyAxIDogLTEpICogZFRoZXRhICogMTgwIC8gTWF0aC5QSSkgJSAzNjA7XHJcblxyXG4gICAgICAgIHN0ZXBzID0gTWF0aC5jZWlsKE1hdGgubWluKE1hdGguYWJzKGRUaGV0YSkgKiAxODAgLyBNYXRoLlBJLCByICogTWF0aC5hYnMoZFRoZXRhKSAvIDgpKTsgLy/pl7TpmpTkuIDkuKrlg4/ntKAg5omA5LulIC8yXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHN0ZXBzOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBvaW50ID0gW01hdGguY29zKHRoZXRhICsgZFRoZXRhIC8gc3RlcHMgKiBpKSAqIHIsIE1hdGguc2luKHRoZXRhICsgZFRoZXRhIC8gc3RlcHMgKiBpKSAqIHJdO1xyXG4gICAgICAgICAgICBwb2ludCA9IF90cmFuc2Zvcm0ubXVsVmVjdG9yKHBvaW50KTtcclxuICAgICAgICAgICAgY3BzLnB1c2gocG9pbnRbMF0pO1xyXG4gICAgICAgICAgICBjcHMucHVzaChwb2ludFsxXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gY3BzO1xyXG4gICAgfSxcclxuXHJcbiAgICBkcmF3OiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgdGhpcy5fZHJhdyhjdHgsIHN0eWxlKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqICBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiAgc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIF9kcmF3OiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIHBhdGggPSBzdHlsZS5wYXRoO1xyXG4gICAgICAgIHZhciBwYXRoQXJyYXkgPSB0aGlzLl9wYXJzZVBhdGhEYXRhKHBhdGgpO1xyXG4gICAgICAgIHRoaXMuX3NldFBvaW50TGlzdChwYXRoQXJyYXksIHN0eWxlKTtcclxuICAgICAgICBmb3IgKHZhciBnID0gMCwgZ2wgPSBwYXRoQXJyYXkubGVuZ3RoOyBnIDwgZ2w7IGcrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gcGF0aEFycmF5W2ddW2ldLmNvbW1hbmQsIHAgPSBwYXRoQXJyYXlbZ11baV0ucG9pbnRzO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocFswXSwgcFsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ00nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHBbMF0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdDJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmJlemllckN1cnZlVG8ocFswXSwgcFsxXSwgcFsyXSwgcFszXSwgcFs0XSwgcFs1XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhwWzBdLCBwWzFdLCBwWzJdLCBwWzNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjeCA9IHBbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjeSA9IHBbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByeCA9IHBbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByeSA9IHBbM107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGV0YSA9IHBbNF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkVGhldGEgPSBwWzVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHNpID0gcFs2XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZzID0gcFs3XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSAocnggPiByeSkgPyByeCA6IHJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVYID0gKHJ4ID4gcnkpID8gMSA6IHJ4IC8gcnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY2FsZVkgPSAocnggPiByeSkgPyByeSAvIHJ4IDogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgTWF0cml4KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0uaWRlbnRpdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RyYW5zZm9ybS5zY2FsZShzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKHBzaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKGN4LCBjeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+Q55So55+p6Zi15byA5aeL5Y+Y5b2iXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC50cmFuc2Zvcm0uYXBwbHkoY3R4LCBfdHJhbnNmb3JtLnRvQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5hcmMoMCwgMCwgciwgdGhldGEsIHRoZXRhICsgZFRoZXRhLCAxIC0gZnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL190cmFuc2Zvcm0uaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC50cmFuc2Zvcm0uYXBwbHkoY3R4LCBfdHJhbnNmb3JtLmludmVydCgpLnRvQXJyYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3onOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBfc2V0UG9pbnRMaXN0OiBmdW5jdGlvbihwYXRoQXJyYXksIHN0eWxlKSB7XHJcbiAgICAgICAgaWYgKHN0eWxlLnBvaW50TGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDorrDlvZXovrnnlYzngrnvvIznlKjkuo7liKTmlq1pbnNpZGVcclxuICAgICAgICB2YXIgcG9pbnRMaXN0ID0gc3R5bGUucG9pbnRMaXN0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IDAsIGdsID0gcGF0aEFycmF5Lmxlbmd0aDsgZyA8IGdsOyBnKyspIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzaW5nbGVQb2ludExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcGF0aEFycmF5W2ddLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwYXRoQXJyYXlbZ11baV0ucG9pbnRzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNtZCA9IHBhdGhBcnJheVtnXVtpXS5jb21tYW5kO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbWQudG9VcHBlckNhc2UoKSA9PSAnQScpIHtcclxuICAgICAgICAgICAgICAgICAgICBwID0gdGhpcy5fZ2V0QXJjUG9pbnRzKHApO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQeWRveS7pOeahOivne+8jOWkluaOpeefqeW9oueahOajgOa1i+W/hemhu+i9rOaNouS4ul9wb2ludHNcclxuICAgICAgICAgICAgICAgICAgICBwYXRoQXJyYXlbZ11baV0uX3BvaW50cyA9IHA7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjbWQudG9VcHBlckNhc2UoKSA9PSBcIkNcIiB8fCBjbWQudG9VcHBlckNhc2UoKSA9PSBcIlFcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjU3RhcnQgPSBbMCwgMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVBvaW50TGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNTdGFydCA9IHNpbmdsZVBvaW50TGlzdC5zbGljZSgtMSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJlUG9pbnRzID0gKHBhdGhBcnJheVtnXVtpIC0gMV0uX3BvaW50cyB8fCBwYXRoQXJyYXlbZ11baSAtIDFdLnBvaW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmVQb2ludHMubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNTdGFydCA9IHByZVBvaW50cy5zbGljZSgtMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHAgPSB0aGlzLl9nZXRCZXppZXJQb2ludHMoY1N0YXJ0LmNvbmNhdChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aEFycmF5W2ddW2ldLl9wb2ludHMgPSBwO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHAubGVuZ3RoOyBqIDwgazsgaiArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHB4ID0gcFtqXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHkgPSBwW2ogKyAxXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKCFweCAmJiBweCE9MCkgfHwgKCFweSAmJiBweSE9MCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBzaW5nbGVQb2ludExpc3QucHVzaChbcHgsIHB5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNpbmdsZVBvaW50TGlzdC5sZW5ndGggPiAwICYmIHBvaW50TGlzdC5wdXNoKHNpbmdsZVBvaW50TGlzdCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuefqeW9ouWMuuWfn++8jOeUqOS6juWxgOmDqOWIt+aWsOWSjOaWh+Wtl+WumuS9jVxyXG4gICAgICogc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmIChzdHlsZS5zdHJva2VTdHlsZSB8fCBzdHlsZS5maWxsU3R5bGUpIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtaW5YID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICB2YXIgbWF4WCA9IC1OdW1iZXIuTUFYX1ZBTFVFOy8vTnVtYmVyLk1JTl9WQUxVRTtcclxuXHJcbiAgICAgICAgdmFyIG1pblkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHZhciBtYXhZID0gLU51bWJlci5NQVhfVkFMVUU7Ly9OdW1iZXIuTUlOX1ZBTFVFO1xyXG5cclxuICAgICAgICAvLyDlubPnp7vlnZDmoIdcclxuICAgICAgICB2YXIgeCA9IDA7XHJcbiAgICAgICAgdmFyIHkgPSAwO1xyXG5cclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gdGhpcy5fcGFyc2VQYXRoRGF0YShzdHlsZS5wYXRoKTtcclxuICAgICAgICB0aGlzLl9zZXRQb2ludExpc3QocGF0aEFycmF5LCBzdHlsZSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGcgPSAwLCBnbCA9IHBhdGhBcnJheS5sZW5ndGg7IGcgPCBnbDsgZysrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aEFycmF5W2ddLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHBhdGhBcnJheVtnXVtpXS5fcG9pbnRzIHx8IHBhdGhBcnJheVtnXVtpXS5wb2ludHM7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGogJSAyID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwW2pdICsgeCA8IG1pblgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pblggPSBwW2pdICsgeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocFtqXSArIHggPiBtYXhYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhYID0gcFtqXSArIHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocFtqXSArIHkgPCBtaW5ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5ZID0gcFtqXSArIHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB5ID4gbWF4WSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4WSA9IHBbal0gKyB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHJlY3Q7XHJcbiAgICAgICAgaWYgKG1pblggPT09IE51bWJlci5NQVhfVkFMVUUgfHwgbWF4WCA9PT0gTnVtYmVyLk1JTl9WQUxVRSB8fCBtaW5ZID09PSBOdW1iZXIuTUFYX1ZBTFVFIHx8IG1heFkgPT09IE51bWJlci5NSU5fVkFMVUUpIHtcclxuICAgICAgICAgICAgcmVjdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgICAgICB5OiAwLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWN0ID0ge1xyXG4gICAgICAgICAgICAgICAgeDogTWF0aC5yb3VuZChtaW5YIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICB5OiBNYXRoLnJvdW5kKG1pblkgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBtYXhYIC0gbWluWCArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogbWF4WSAtIG1pblkgKyBsaW5lV2lkdGhcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcblxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgUGF0aDsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5rC05ru05b2iIOexu1xyXG4gKiDmtL7nlJ/oh6pQYXRo57G7XHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQGhyIOawtOa7tOaoquWuve+8iOS4reW/g+WIsOawtOW5s+i+uee8mOacgOWuveWkhOi3neemu++8iVxyXG4gKiBAdnIg5rC05ru057q16auY77yI5Lit5b+D5Yiw5bCW56uv6Led56a777yJXHJcbiAqKi9cclxuaW1wb3J0IFBhdGggZnJvbSBcIi4vUGF0aFwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgRHJvcGxldCA9IGZ1bmN0aW9uKG9wdCl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgIGhyIDogb3B0LmNvbnRleHQuaHIgfHwgMCAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmsLTmu7TmqKrlrr3vvIjkuK3lv4PliLDmsLTlubPovrnnvJjmnIDlrr3lpITot53nprvvvIlcclxuICAgICAgICB2ciA6IG9wdC5jb250ZXh0LnZyIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5rC05ru057q16auY77yI5Lit5b+D5Yiw5bCW56uv6Led56a777yJXHJcbiAgICB9O1xyXG4gICAgRHJvcGxldC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICBzZWxmLnR5cGUgPSBcImRyb3BsZXRcIjtcclxufTtcclxuVXRpbHMuY3JlYXRDbGFzcyggRHJvcGxldCAsIFBhdGggLCB7XHJcbiAgICBkcmF3IDogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgdmFyIHBzID0gXCJNIDAgXCIrc3R5bGUuaHIrXCIgQyBcIitzdHlsZS5ocitcIiBcIitzdHlsZS5ocitcIiBcIisoIHN0eWxlLmhyKjMvMiApICtcIiBcIisoLXN0eWxlLmhyLzMpK1wiIDAgXCIrKC1zdHlsZS52cik7XHJcbiAgICAgICBwcyArPSBcIiBDIFwiKygtc3R5bGUuaHIgKiAzLyAyKStcIiBcIisoLXN0eWxlLmhyIC8gMykrXCIgXCIrKC1zdHlsZS5ocikrXCIgXCIrc3R5bGUuaHIrXCIgMCBcIisgc3R5bGUuaHI7XHJcbiAgICAgICB0aGlzLmNvbnRleHQucGF0aCA9IHBzO1xyXG4gICAgICAgdGhpcy5fZHJhdyhjdHggLCBzdHlsZSk7XHJcbiAgICB9XHJcbn0gKTtcclxuZXhwb3J0IGRlZmF1bHQgRHJvcGxldDtcclxuIiwiXHJcbi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmpK3lnIblvaIg57G7XHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIkgXHJcbiAqXHJcbiAqIEBociDmpK3lnIbmqKrovbTljYrlvoRcclxuICogQHZyIOakreWchue6tei9tOWNiuW+hFxyXG4gKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxudmFyIEVsbGlwc2UgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJlbGxpcHNlXCI7XHJcblxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICAvL3ggICAgICAgICAgICAgOiAwICwgLy97bnVtYmVyfSwgIC8vIOS4ouW8g1xyXG4gICAgICAgIC8veSAgICAgICAgICAgICA6IDAgLCAvL3tudW1iZXJ9LCAgLy8g5Lii5byD77yM5Y6f5Zug5ZCMY2lyY2xlXHJcbiAgICAgICAgaHIgOiBvcHQuY29udGV4dC5ociB8fCAwICwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOakreWchuaoqui9tOWNiuW+hFxyXG4gICAgICAgIHZyIDogb3B0LmNvbnRleHQudnIgfHwgMCAgIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmpK3lnIbnurXovbTljYrlvoRcclxuICAgIH1cclxuXHJcbiAgICBFbGxpcHNlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoRWxsaXBzZSAsIFNoYXBlICwge1xyXG4gICAgZHJhdyA6ICBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgdmFyIHIgPSAoc3R5bGUuaHIgPiBzdHlsZS52cikgPyBzdHlsZS5ociA6IHN0eWxlLnZyO1xyXG4gICAgICAgIHZhciByYXRpb1ggPSBzdHlsZS5ociAvIHI7IC8v5qiq6L2057yp5pS+5q+U546HXHJcbiAgICAgICAgdmFyIHJhdGlvWSA9IHN0eWxlLnZyIC8gcjtcclxuICAgICAgICBcclxuICAgICAgICBjdHguc2NhbGUocmF0aW9YLCByYXRpb1kpO1xyXG4gICAgICAgIGN0eC5hcmMoXHJcbiAgICAgICAgICAgIDAsIDAsIHIsIDAsIE1hdGguUEkgKiAyLCB0cnVlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgaWYgKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0ICl7XHJcbiAgICAgICAgICAgLy9pZeS4i+mdouimgeaDs+e7mOWItuS4quakreWchuWHuuadpe+8jOWwseS4jeiDveaJp+ihjOi/meatpeS6hlxyXG4gICAgICAgICAgIC8v566X5pivZXhjYW52YXMg5a6e546w5LiK6Z2i55qE5LiA5LiqYnVn5ZCnXHJcbiAgICAgICAgICAgY3R4LnNjYWxlKDEvcmF0aW9YLCAxL3JhdGlvWSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9LFxyXG4gICAgZ2V0UmVjdCA6IGZ1bmN0aW9uKHN0eWxlKXtcclxuICAgICAgICB2YXIgbGluZVdpZHRoO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHN0eWxlID8gc3R5bGUgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZpbGxTdHlsZSB8fCBzdHlsZS5zdHJva2VTdHlsZSkge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgeCA6IE1hdGgucm91bmQoMCAtIHN0eWxlLmhyIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgeSA6IE1hdGgucm91bmQoMCAtIHN0eWxlLnZyIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgd2lkdGggOiBzdHlsZS5ociAqIDIgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgaGVpZ2h0IDogc3R5bGUudnIgKiAyICsgbGluZVdpZHRoXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRWxsaXBzZTtcclxuIiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOWkmui+ueW9oiDnsbsgIO+8iOS4jeinhOWIme+8iVxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBwb2ludExpc3Qg5aSa6L655b2i5ZCE5Liq6aG26KeS5Z2Q5qCHXHJcbiAqKi9cclxuaW1wb3J0IEJyb2tlbkxpbmUgZnJvbSBcIi4vQnJva2VuTGluZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgUG9seWdvbiA9IGZ1bmN0aW9uKG9wdCAsIGF0eXBlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdChvcHQpO1xyXG5cclxuICAgIGlmKGF0eXBlICE9PSBcImNsb25lXCIpe1xyXG4gICAgICAgIHZhciBzdGFydCA9IG9wdC5jb250ZXh0LnBvaW50TGlzdFswXTtcclxuICAgICAgICB2YXIgZW5kICAgPSBvcHQuY29udGV4dC5wb2ludExpc3RbIG9wdC5jb250ZXh0LnBvaW50TGlzdC5sZW5ndGggLSAxIF07XHJcbiAgICAgICAgaWYoIG9wdC5jb250ZXh0LnNtb290aCApe1xyXG4gICAgICAgICAgICBvcHQuY29udGV4dC5wb2ludExpc3QudW5zaGlmdCggZW5kICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3B0LmNvbnRleHQucG9pbnRMaXN0LnB1c2goIHN0YXJ0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgUG9seWdvbi5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYoYXR5cGUgIT09IFwiY2xvbmVcIiAmJiBvcHQuY29udGV4dC5zbW9vdGggJiYgZW5kKXtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuX2RyYXdUeXBlT25seSA9IG51bGw7XHJcbiAgICBzZWxmLnR5cGUgPSBcInBvbHlnb25cIjtcclxufTtcclxuVXRpbHMuY3JlYXRDbGFzcyhQb2x5Z29uLCBCcm9rZW5MaW5lLCB7XHJcbiAgICBkcmF3OiBmdW5jdGlvbihjdHgsIGNvbnRleHQpIHtcclxuICAgICAgICBpZiAoY29udGV4dC5maWxsU3R5bGUpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRleHQubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgY29udGV4dC5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50TGlzdCA9IGNvbnRleHQucG9pbnRMaXN0O1xyXG4gICAgICAgICAgICAgICAgLy/nibnmrorlpITnkIbvvIzomZrnur/lm7TkuI3miJBwYXRo77yM5a6e57q/5YaNYnVpbGTkuIDmrKFcclxuICAgICAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHBvaW50TGlzdFswXVswXSwgcG9pbnRMaXN0WzBdWzFdKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxLCBsID0gcG9pbnRMaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocG9pbnRMaXN0W2ldWzBdLCBwb2ludExpc3RbaV1bMV0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZHJhd1R5cGVPbmx5ID0gXCJzdHJva2VcIjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8v5aaC5p6c5LiL6Z2i5LiN5Yqgc2F2ZSByZXN0b3Jl77yMY2FudmFz5Lya5oqK5LiL6Z2i55qEcGF0aOWSjOS4iumdoueahHBhdGjkuIDotbfnrpfkvZzkuIDmnaFwYXRo44CC5bCx5Lya57uY5Yi25LqG5LiA5p2h5a6e546w6L655qGG5ZKM5LiA6Jma57q/6L655qGG44CCXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5fZHJhdyhjdHgsIGNvbnRleHQpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgUG9seWdvbjsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5q2jbui+ueW9ou+8iG4+PTPvvIlcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciSBcclxuICpcclxuICogQHIg5q2jbui+ueW9ouWkluaOpeWchuWNiuW+hFxyXG4gKiBAciDmjIfmmI7mraPlh6DovrnlvaJcclxuICpcclxuICogQHBvaW50TGlzdCDnp4HmnInvvIzku47kuIrpnaLnmoRy5ZKMbuiuoeeul+W+l+WIsOeahOi+ueeVjOWAvOeahOmbhuWQiFxyXG4gKi9cclxuaW1wb3J0IFBvbHlnb24gZnJvbSBcIi4vUG9seWdvblwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgSXNvZ29uID0gZnVuY3Rpb24ob3B0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdChvcHQpO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IF8uZXh0ZW5kKHtcclxuICAgICAgICBwb2ludExpc3Q6IFtdLCAvL+S7juS4i+mdoueahHLlkoxu6K6h566X5b6X5Yiw55qE6L6555WM5YC855qE6ZuG5ZCIXHJcbiAgICAgICAgcjogMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOato27ovrnlvaLlpJbmjqXlnIbljYrlvoRcclxuICAgICAgICBuOiAwIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmjIfmmI7mraPlh6DovrnlvaJcclxuICAgIH0gLCBvcHQuY29udGV4dCk7XHJcbiAgICBzZWxmLnNldFBvaW50TGlzdChzZWxmLl9jb250ZXh0KTtcclxuICAgIG9wdC5jb250ZXh0ID0gc2VsZi5fY29udGV4dDtcclxuICAgIElzb2dvbi5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnR5cGUgPSBcImlzb2dvblwiO1xyXG59O1xyXG5VdGlscy5jcmVhdENsYXNzKElzb2dvbiwgUG9seWdvbiwge1xyXG4gICAgJHdhdGNoOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICBpZiAobmFtZSA9PSBcInJcIiB8fCBuYW1lID09IFwiblwiKSB7IC8v5aaC5p6ccGF0aOacieWPmOWKqO+8jOmcgOimgeiHquWKqOiuoeeul+aWsOeahHBvaW50TGlzdFxyXG4gICAgICAgICAgICB0aGlzLnNldFBvaW50TGlzdCggdGhpcy5jb250ZXh0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNldFBvaW50TGlzdDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICBzdHlsZS5wb2ludExpc3QubGVuZ3RoID0gMDtcclxuICAgICAgICB2YXIgbiA9IHN0eWxlLm4sIHIgPSBzdHlsZS5yO1xyXG4gICAgICAgIHZhciBkU3RlcCA9IDIgKiBNYXRoLlBJIC8gbjtcclxuICAgICAgICB2YXIgYmVnaW5EZWcgPSAtTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgdmFyIGRlZyA9IGJlZ2luRGVnO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBlbmQgPSBuOyBpIDwgZW5kOyBpKyspIHtcclxuICAgICAgICAgICAgc3R5bGUucG9pbnRMaXN0LnB1c2goW3IgKiBNYXRoLmNvcyhkZWcpLCByICogTWF0aC5zaW4oZGVnKV0pO1xyXG4gICAgICAgICAgICBkZWcgKz0gZFN0ZXA7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IElzb2dvbjsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog57q/5p2hIOexu1xyXG4gKlxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBsaW5lVHlwZSAg5Y+v6YCJIOiZmue6vyDlrp7njrAg55qEIOexu+Wei1xyXG4gKiBAeFN0YXJ0ICAgIOW/hemhu++8jOi1t+eCueaoquWdkOagh1xyXG4gKiBAeVN0YXJ0ICAgIOW/hemhu++8jOi1t+eCuee6teWdkOagh1xyXG4gKiBAeEVuZCAgICAgIOW/hemhu++8jOe7iOeCueaoquWdkOagh1xyXG4gKiBAeUVuZCAgICAgIOW/hemhu++8jOe7iOeCuee6teWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgTGluZSA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy50eXBlID0gXCJsaW5lXCI7XHJcbiAgICB0aGlzLmRyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdChvcHQpO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICBsaW5lVHlwZTogb3B0LmNvbnRleHQubGluZVR5cGUgfHwgbnVsbCwgLy/lj6/pgIkg6Jma57q/IOWunueOsCDnmoQg57G75Z6LXHJcbiAgICAgICAgeFN0YXJ0OiBvcHQuY29udGV4dC54U3RhcnQgfHwgMCwgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOi1t+eCueaoquWdkOagh1xyXG4gICAgICAgIHlTdGFydDogb3B0LmNvbnRleHQueVN0YXJ0IHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzotbfngrnnurXlnZDmoIdcclxuICAgICAgICB4RW5kOiBvcHQuY29udGV4dC54RW5kIHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIznu4jngrnmqKrlnZDmoIdcclxuICAgICAgICB5RW5kOiBvcHQuY29udGV4dC55RW5kIHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIznu4jngrnnurXlnZDmoIdcclxuICAgICAgICBkYXNoTGVuZ3RoOiBvcHQuY29udGV4dC5kYXNoTGVuZ3RoXHJcbiAgICB9XHJcbiAgICBMaW5lLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoTGluZSwgU2hhcGUsIHtcclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu657q/5p2h6Lev5b6EXHJcbiAgICAgKiBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIGlmICghc3R5bGUubGluZVR5cGUgfHwgc3R5bGUubGluZVR5cGUgPT0gJ3NvbGlkJykge1xyXG4gICAgICAgICAgICAvL+m7mOiupOS4uuWunue6v1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHBhcnNlSW50KHN0eWxlLnhTdGFydCksIHBhcnNlSW50KHN0eWxlLnlTdGFydCkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHBhcnNlSW50KHN0eWxlLnhFbmQpLCBwYXJzZUludChzdHlsZS55RW5kKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdHlsZS5saW5lVHlwZSA9PSAnZGFzaGVkJyB8fCBzdHlsZS5saW5lVHlwZSA9PSAnZG90dGVkJykge1xyXG4gICAgICAgICAgICB0aGlzLmRhc2hlZExpbmVUbyhcclxuICAgICAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgICAgIHN0eWxlLnhTdGFydCwgc3R5bGUueVN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgc3R5bGUueEVuZCwgc3R5bGUueUVuZCxcclxuICAgICAgICAgICAgICAgIHN0eWxlLmRhc2hMZW5ndGhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue55+p5b2i5Yy65Z+f77yM55So5LqO5bGA6YOo5Yi35paw5ZKM5paH5a2X5a6a5L2NXHJcbiAgICAgKiBzdHlsZVxyXG4gICAgICovXHJcbiAgICBnZXRSZWN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIHZhciBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6IE1hdGgubWluKHN0eWxlLnhTdGFydCwgc3R5bGUueEVuZCkgLSBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIHk6IE1hdGgubWluKHN0eWxlLnlTdGFydCwgc3R5bGUueUVuZCkgLSBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIHdpZHRoOiBNYXRoLmFicyhzdHlsZS54U3RhcnQgLSBzdHlsZS54RW5kKSArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLmFicyhzdHlsZS55U3RhcnQgLSBzdHlsZS55RW5kKSArIGxpbmVXaWR0aFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IExpbmU7IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOefqeeOsCDnsbsgIO+8iOS4jeinhOWIme+8iVxyXG4gKlxyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEB3aWR0aCDlrr3luqZcclxuICogQGhlaWdodCDpq5jluqZcclxuICogQHJhZGl1cyDlpoLmnpzmmK/lnIbop5LnmoTvvIzliJnkuLrjgJDkuIrlj7PkuIvlt6bjgJHpobrluo/nmoTlnIbop5LljYrlvoTmlbDnu4RcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFJlY3QgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJyZWN0XCI7XHJcblxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICAgd2lkdGggICAgICAgICA6IG9wdC5jb250ZXh0LndpZHRoIHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOWuveW6plxyXG4gICAgICAgICBoZWlnaHQgICAgICAgIDogb3B0LmNvbnRleHQuaGVpZ2h0fHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6auY5bqmXHJcbiAgICAgICAgIHJhZGl1cyAgICAgICAgOiBvcHQuY29udGV4dC5yYWRpdXN8fCBbXSAgICAgLy97YXJyYXl9LCAgIC8vIOm7mOiupOS4ulswXe+8jOWchuinkiBcclxuICAgIH1cclxuICAgIFJlY3Quc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyggUmVjdCAsIFNoYXBlICwge1xyXG4gICAgLyoqXHJcbiAgICAgKiDnu5jliLblnIbop5Lnn6nlvaJcclxuICAgICAqIEBwYXJhbSB7Q29udGV4dDJEfSBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIF9idWlsZFJhZGl1c1BhdGg6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICAvL+W3puS4iuOAgeWPs+S4iuOAgeWPs+S4i+OAgeW3puS4i+inkueahOWNiuW+hOS+neasoeS4unIx44CBcjLjgIFyM+OAgXI0XHJcbiAgICAgICAgLy9y57yp5YaZ5Li6MSAgICAgICAgIOebuOW9k+S6jiBbMSwgMSwgMSwgMV1cclxuICAgICAgICAvL3LnvKnlhpnkuLpbMV0gICAgICAg55u45b2T5LqOIFsxLCAxLCAxLCAxXVxyXG4gICAgICAgIC8vcue8qeWGmeS4ulsxLCAyXSAgICDnm7jlvZPkuo4gWzEsIDIsIDEsIDJdXHJcbiAgICAgICAgLy9y57yp5YaZ5Li6WzEsIDIsIDNdIOebuOW9k+S6jiBbMSwgMiwgMywgMl1cclxuICAgICAgICB2YXIgeCA9IDA7XHJcbiAgICAgICAgdmFyIHkgPSAwO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMuY29udGV4dC53aWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5jb250ZXh0LmhlaWdodDtcclxuICAgIFxyXG4gICAgICAgIHZhciByID0gVXRpbHMuZ2V0Q3NzT3JkZXJBcnIoc3R5bGUucmFkaXVzKTtcclxuICAgICBcclxuICAgICAgICBjdHgubW92ZVRvKCBwYXJzZUludCh4ICsgclswXSksIHBhcnNlSW50KHkpKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4ICsgd2lkdGggLSByWzFdKSwgcGFyc2VJbnQoeSkpO1xyXG4gICAgICAgIHJbMV0gIT09IDAgJiYgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICB4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIHJbMV1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCArIHdpZHRoKSwgcGFyc2VJbnQoeSArIGhlaWdodCAtIHJbMl0pKTtcclxuICAgICAgICByWzJdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByWzJdLCB5ICsgaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHBhcnNlSW50KHggKyByWzNdKSwgcGFyc2VJbnQoeSArIGhlaWdodCkpO1xyXG4gICAgICAgIHJbM10gIT09IDAgJiYgY3R4LnF1YWRyYXRpY0N1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICB4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gclszXVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4KSwgcGFyc2VJbnQoeSArIHJbMF0pKTtcclxuICAgICAgICByWzBdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHgsIHksIHggKyByWzBdLCB5KTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuefqeW9oui3r+W+hFxyXG4gICAgICogQHBhcmFtIHtDb250ZXh0MkR9IGN0eCBDYW52YXMgMkTkuIrkuIvmlodcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICBpZighc3R5bGUuJG1vZGVsLnJhZGl1cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYoISFzdHlsZS5maWxsU3R5bGUpe1xyXG4gICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoIDAgLCAwICx0aGlzLmNvbnRleHQud2lkdGgsdGhpcy5jb250ZXh0LmhlaWdodClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighIXN0eWxlLmxpbmVXaWR0aCl7XHJcbiAgICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KCAwICwgMCAsIHRoaXMuY29udGV4dC53aWR0aCx0aGlzLmNvbnRleHQuaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1aWxkUmFkaXVzUGF0aChjdHgsIHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuefqeW9ouWMuuWfn++8jOeUqOS6juWxgOmDqOWIt+aWsOWSjOaWh+Wtl+WumuS9jVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlXHJcbiAgICAgKi9cclxuICAgIGdldFJlY3QgOiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgICAgICB2YXIgbGluZVdpZHRoO1xyXG4gICAgICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICAgICBpZiAoc3R5bGUuZmlsbFN0eWxlIHx8IHN0eWxlLnN0cm9rZVN0eWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGggPSBzdHlsZS5saW5lV2lkdGggfHwgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgeCA6IE1hdGgucm91bmQoMCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICB5IDogTWF0aC5yb3VuZCgwIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoIDogdGhpcy5jb250ZXh0LndpZHRoICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICBoZWlnaHQgOiB0aGlzLmNvbnRleHQuaGVpZ2h0ICsgbGluZVdpZHRoXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxufSApO1xyXG5leHBvcnQgZGVmYXVsdCBSZWN0OyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDmiYflvaIg57G7XHJcbiAqXHJcbiAqIOWdkOagh+WOn+eCueWGjeWchuW/g1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEByMCDpu5jorqTkuLow77yM5YaF5ZyG5Y2K5b6E5oyH5a6a5ZCO5bCG5Ye6546w5YaF5byn77yM5ZCM5pe25omH6L656ZW/5bqmID0gciAtIHIwXHJcbiAqIEByICDlv4XpobvvvIzlpJblnIbljYrlvoRcclxuICogQHN0YXJ0QW5nbGUg6LW35aeL6KeS5bqmKDAsIDM2MClcclxuICogQGVuZEFuZ2xlICAg57uT5p2f6KeS5bqmKDAsIDM2MClcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5pbXBvcnQgbXlNYXRoIGZyb20gXCIuLi9nZW9tL01hdGhcIjtcclxuXHJcbnZhciBTZWN0b3IgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwic2VjdG9yXCI7XHJcbiAgICBzZWxmLnJlZ0FuZ2xlICA9IFtdO1xyXG4gICAgc2VsZi5pc1JpbmcgICAgPSBmYWxzZTsvL+aYr+WQpuS4uuS4gOS4quWchueOr1xyXG5cclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgID0ge1xyXG4gICAgICAgIHBvaW50TGlzdCAgOiBbXSwvL+i+ueeVjOeCueeahOmbhuWQiCznp4HmnInvvIzku47kuIvpnaLnmoTlsZ7mgKforqHnrpfnmoTmnaVcclxuICAgICAgICByMCAgICAgICAgIDogb3B0LmNvbnRleHQucjAgICAgICAgICB8fCAwLC8vIOm7mOiupOS4ujDvvIzlhoXlnIbljYrlvoTmjIflrprlkI7lsIblh7rnjrDlhoXlvKfvvIzlkIzml7bmiYfovrnplb/luqYgPSByIC0gcjBcclxuICAgICAgICByICAgICAgICAgIDogb3B0LmNvbnRleHQuciAgICAgICAgICB8fCAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzlpJblnIbljYrlvoRcclxuICAgICAgICBzdGFydEFuZ2xlIDogb3B0LmNvbnRleHQuc3RhcnRBbmdsZSB8fCAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzotbflp4vop5LluqZbMCwgMzYwKVxyXG4gICAgICAgIGVuZEFuZ2xlICAgOiBvcHQuY29udGV4dC5lbmRBbmdsZSAgIHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIznu5PmnZ/op5LluqYoMCwgMzYwXVxyXG4gICAgICAgIGNsb2Nrd2lzZSAgOiBvcHQuY29udGV4dC5jbG9ja3dpc2UgIHx8IGZhbHNlIC8v5piv5ZCm6aG65pe26ZKI77yM6buY6K6k5Li6ZmFsc2Uo6aG65pe26ZKIKVxyXG4gICAgfVxyXG4gICAgU2VjdG9yLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcyAsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKFNlY3RvciAsIFNoYXBlICwge1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgY29udGV4dCkge1xyXG4gICAgICAgIC8vIOW9ouWGheWNiuW+hFswLHIpXHJcbiAgICAgICAgdmFyIHIwID0gdHlwZW9mIGNvbnRleHQucjAgPT0gJ3VuZGVmaW5lZCcgPyAwIDogY29udGV4dC5yMDtcclxuICAgICAgICB2YXIgciAgPSBjb250ZXh0LnI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaJh+W9ouWkluWNiuW+hCgwLHJdXHJcbiAgICAgICAgdmFyIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5zdGFydEFuZ2xlKTsgICAgICAgICAgLy8g6LW35aeL6KeS5bqmWzAsMzYwKVxyXG4gICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuZW5kQW5nbGUpOyAgICAgICAgICAgICAgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxyXG5cclxuICAgICAgICAvL3ZhciBpc1JpbmcgICAgID0gZmFsc2U7ICAgICAgICAgICAgICAgICAgICAgICAvL+aYr+WQpuS4uuWchueOr1xyXG5cclxuICAgICAgICAvL2lmKCBzdGFydEFuZ2xlICE9IGVuZEFuZ2xlICYmIE1hdGguYWJzKHN0YXJ0QW5nbGUgLSBlbmRBbmdsZSkgJSAzNjAgPT0gMCApIHtcclxuICAgICAgICBpZiggc3RhcnRBbmdsZSA9PSBlbmRBbmdsZSAmJiBjb250ZXh0LnN0YXJ0QW5nbGUgIT0gY29udGV4dC5lbmRBbmdsZSApIHtcclxuICAgICAgICAgICAgLy/lpoLmnpzkuKTkuKrop5Lluqbnm7jnrYnvvIzpgqPkuYjlsLHorqTkuLrmmK/kuKrlnIbnjq/kuoZcclxuICAgICAgICAgICAgdGhpcy5pc1JpbmcgICAgID0gdHJ1ZTtcclxuICAgICAgICAgICAgc3RhcnRBbmdsZSA9IDAgO1xyXG4gICAgICAgICAgICBlbmRBbmdsZSAgID0gMzYwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKTtcclxuICAgICAgICBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKGVuZEFuZ2xlKTtcclxuICAgICBcclxuICAgICAgICAvL+WkhOeQhuS4i+aegeWwj+WkueinkueahOaDheWGtVxyXG4gICAgICAgIGlmKCBlbmRBbmdsZSAtIHN0YXJ0QW5nbGUgPCAwLjAyNSApe1xyXG4gICAgICAgICAgICBzdGFydEFuZ2xlIC09IDAuMDAzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdHguYXJjKCAwICwgMCAsIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCB0aGlzLmNvbnRleHQuY2xvY2t3aXNlKTtcclxuICAgICAgICBpZiAocjAgIT09IDApIHtcclxuICAgICAgICAgICAgaWYoIHRoaXMuaXNSaW5nICl7XHJcbiAgICAgICAgICAgICAgICAvL+WKoOS4iui/meS4qmlzUmluZ+eahOmAu+i+keaYr+S4uuS6huWFvOWuuWZsYXNoY2FudmFz5LiL57uY5Yi25ZyG546v55qE55qE6Zeu6aKYXHJcbiAgICAgICAgICAgICAgICAvL+S4jeWKoOi/meS4qumAu+i+kWZsYXNoY2FudmFz5Lya57uY5Yi25LiA5Liq5aSn5ZyGIO+8jCDogIzkuI3mmK/lnIbnjq9cclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oIHIwICwgMCApO1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyggMCAsIDAgLCByMCAsIHN0YXJ0QW5nbGUgLCBlbmRBbmdsZSAsICF0aGlzLmNvbnRleHQuY2xvY2t3aXNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmMoIDAgLCAwICwgcjAgLCBlbmRBbmdsZSAsIHN0YXJ0QW5nbGUgLCAhdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL1RPRE865ZyocjDkuLow55qE5pe25YCZ77yM5aaC5p6c5LiN5YqgbGluZVRvKDAsMCnmnaXmiorot6/lvoTpl63lkIjvvIzkvJrlh7rnjrDmnInmkJ7nrJHnmoTkuIDkuKpidWdcclxuICAgICAgICAgICAgLy/mlbTkuKrlnIbkvJrlh7rnjrDkuIDkuKrku6Xmr4/kuKrmiYflvaLkuKTnq6/kuLroioLngrnnmoTplYLnqbrvvIzmiJHlj6/og73mj4/ov7DkuI3muIXmpZrvvIzlj43mraPov5nkuKrliqDkuIrlsLHlpb3kuoZcclxuICAgICAgICAgICAgY3R4LmxpbmVUbygwLDApO1xyXG4gICAgICAgIH1cclxuICAgICB9LFxyXG4gICAgIGdldFJlZ0FuZ2xlIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgdGhpcy5yZWdJbiAgICAgID0gdHJ1ZTsgIC8v5aaC5p6c5Zyoc3RhcnTlkoxlbmTnmoTmlbDlgLzkuK3vvIxlbmTlpKfkuo5zdGFydOiAjOS4lOaYr+mhuuaXtumSiOWImXJlZ0lu5Li6dHJ1ZVxyXG4gICAgICAgICB2YXIgYyAgICAgICAgICAgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGMuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICAgdmFyIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG8zNjAoYy5lbmRBbmdsZSk7ICAgICAgICAgICAgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxyXG5cclxuICAgICAgICAgaWYgKCAoIHN0YXJ0QW5nbGUgPiBlbmRBbmdsZSAmJiAhYy5jbG9ja3dpc2UgKSB8fCAoIHN0YXJ0QW5nbGUgPCBlbmRBbmdsZSAmJiBjLmNsb2Nrd2lzZSApICkge1xyXG4gICAgICAgICAgICAgdGhpcy5yZWdJbiAgPSBmYWxzZTsgLy9vdXRcclxuICAgICAgICAgfTtcclxuICAgICAgICAgLy/luqbnmoTojIPlm7TvvIzku47lsI/liLDlpKdcclxuICAgICAgICAgdGhpcy5yZWdBbmdsZSAgID0gWyBcclxuICAgICAgICAgICAgIE1hdGgubWluKCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgKSAsIFxyXG4gICAgICAgICAgICAgTWF0aC5tYXgoIHN0YXJ0QW5nbGUgLCBlbmRBbmdsZSApIFxyXG4gICAgICAgICBdO1xyXG4gICAgIH0sXHJcbiAgICAgZ2V0UmVjdCA6IGZ1bmN0aW9uKGNvbnRleHQpe1xyXG4gICAgICAgICB2YXIgY29udGV4dCA9IGNvbnRleHQgPyBjb250ZXh0IDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICB2YXIgcjAgPSB0eXBlb2YgY29udGV4dC5yMCA9PSAndW5kZWZpbmVkJyAgICAgLy8g5b2i5YaF5Y2K5b6EWzAscilcclxuICAgICAgICAgICAgID8gMCA6IGNvbnRleHQucjA7XHJcbiAgICAgICAgIHZhciByID0gY29udGV4dC5yOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmiYflvaLlpJbljYrlvoQoMCxyXVxyXG4gICAgICAgICBcclxuICAgICAgICAgdGhpcy5nZXRSZWdBbmdsZSgpO1xyXG5cclxuICAgICAgICAgdmFyIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5zdGFydEFuZ2xlKTsgICAgICAgICAgLy8g6LW35aeL6KeS5bqmWzAsMzYwKVxyXG4gICAgICAgICB2YXIgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LmVuZEFuZ2xlKTsgICAgICAgICAgICAvLyDnu5PmnZ/op5LluqYoMCwzNjBdXHJcblxyXG4gICAgICAgICAvKlxyXG4gICAgICAgICB2YXIgaXNDaXJjbGUgPSBmYWxzZTtcclxuICAgICAgICAgaWYoIE1hdGguYWJzKCBzdGFydEFuZ2xlIC0gZW5kQW5nbGUgKSA9PSAzNjAgXHJcbiAgICAgICAgICAgICAgICAgfHwgKCBzdGFydEFuZ2xlID09IGVuZEFuZ2xlICYmIHN0YXJ0QW5nbGUgKiBlbmRBbmdsZSAhPSAwICkgKXtcclxuICAgICAgICAgICAgIGlzQ2lyY2xlID0gdHJ1ZTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICAgdmFyIHBvaW50TGlzdCAgPSBbXTtcclxuXHJcbiAgICAgICAgIHZhciBwNERpcmVjdGlvbj0ge1xyXG4gICAgICAgICAgICAgXCI5MFwiIDogWyAwICwgciBdLFxyXG4gICAgICAgICAgICAgXCIxODBcIjogWyAtciwgMCBdLFxyXG4gICAgICAgICAgICAgXCIyNzBcIjogWyAwICwgLXJdLFxyXG4gICAgICAgICAgICAgXCIzNjBcIjogWyByICwgMCBdIFxyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgZm9yICggdmFyIGQgaW4gcDREaXJlY3Rpb24gKXtcclxuICAgICAgICAgICAgIHZhciBpbkFuZ2xlUmVnID0gcGFyc2VJbnQoZCkgPiB0aGlzLnJlZ0FuZ2xlWzBdICYmIHBhcnNlSW50KGQpIDwgdGhpcy5yZWdBbmdsZVsxXTtcclxuICAgICAgICAgICAgIGlmKCB0aGlzLmlzUmluZyB8fCAoaW5BbmdsZVJlZyAmJiB0aGlzLnJlZ0luKSB8fCAoIWluQW5nbGVSZWcgJiYgIXRoaXMucmVnSW4pICl7XHJcbiAgICAgICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goIHA0RGlyZWN0aW9uWyBkIF0gKTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICAgaWYoICF0aGlzLmlzUmluZyApIHtcclxuICAgICAgICAgICAgIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oIHN0YXJ0QW5nbGUgKTtcclxuICAgICAgICAgICAgIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oIGVuZEFuZ2xlICAgKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3Moc3RhcnRBbmdsZSkgKiByMCAsIG15TWF0aC5zaW4oc3RhcnRBbmdsZSkgKiByMFxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3Moc3RhcnRBbmdsZSkgKiByICAsIG15TWF0aC5zaW4oc3RhcnRBbmdsZSkgKiByXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhlbmRBbmdsZSkgICAqIHIgICwgIG15TWF0aC5zaW4oZW5kQW5nbGUpICAqIHJcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKGVuZEFuZ2xlKSAgICogcjAgLCAgbXlNYXRoLnNpbihlbmRBbmdsZSkgICogcjBcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGNvbnRleHQucG9pbnRMaXN0ID0gcG9pbnRMaXN0O1xyXG4gICAgICAgICByZXR1cm4gdGhpcy5nZXRSZWN0Rm9ybVBvaW50TGlzdCggY29udGV4dCApO1xyXG4gICAgIH1cclxuXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2VjdG9yOyIsIlxuaW1wb3J0IEFwcGxpY2F0aW9uIGZyb20gXCIuL0FwcGxpY2F0aW9uXCI7XG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi9ldmVudC9FdmVudE1hbmFnZXJcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL2Rpc3BsYXkvRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vZGlzcGxheS9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCI7XG5pbXBvcnQgU3RhZ2UgZnJvbSBcIi4vZGlzcGxheS9TdGFnZVwiO1xuaW1wb3J0IFNwcml0ZSBmcm9tIFwiLi9kaXNwbGF5L1Nwcml0ZVwiO1xuaW1wb3J0IFNoYXBlIGZyb20gXCIuL2Rpc3BsYXkvU2hhcGVcIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9kaXNwbGF5L1BvaW50XCI7XG5pbXBvcnQgVGV4dCBmcm9tIFwiLi9kaXNwbGF5L1RleHRcIjtcblxuLy9zaGFwZXNcbmltcG9ydCBCcm9rZW5MaW5lIGZyb20gXCIuL3NoYXBlL0Jyb2tlbkxpbmVcIjtcbmltcG9ydCBDaXJjbGUgZnJvbSBcIi4vc2hhcGUvQ2lyY2xlXCI7XG5pbXBvcnQgRHJvcGxldCBmcm9tIFwiLi9zaGFwZS9Ecm9wbGV0XCI7XG5pbXBvcnQgRWxsaXBzZSBmcm9tIFwiLi9zaGFwZS9FbGxpcHNlXCI7XG5pbXBvcnQgSXNvZ29uIGZyb20gXCIuL3NoYXBlL0lzb2dvblwiO1xuaW1wb3J0IExpbmUgZnJvbSBcIi4vc2hhcGUvTGluZVwiO1xuaW1wb3J0IFBhdGggZnJvbSBcIi4vc2hhcGUvUGF0aFwiO1xuaW1wb3J0IFBvbHlnb24gZnJvbSBcIi4vc2hhcGUvUG9seWdvblwiO1xuaW1wb3J0IFJlY3QgZnJvbSBcIi4vc2hhcGUvUmVjdFwiO1xuaW1wb3J0IFNlY3RvciBmcm9tIFwiLi9zaGFwZS9TZWN0b3JcIjtcblxudmFyIENhbnZheCA9IHtcbiAgICBBcHA6IEFwcGxpY2F0aW9uXG59O1xuXG5DYW52YXguRGlzcGxheSA9IHtcbiAgICBEaXNwbGF5T2JqZWN0IDogRGlzcGxheU9iamVjdCxcbiAgICBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIDogRGlzcGxheU9iamVjdENvbnRhaW5lcixcbiAgICBTdGFnZSAgOiBTdGFnZSxcbiAgICBTcHJpdGUgOiBTcHJpdGUsXG4gICAgU2hhcGUgIDogU2hhcGUsXG4gICAgUG9pbnQgIDogUG9pbnQsXG4gICAgVGV4dCAgIDogVGV4dFxufVxuXG5DYW52YXguU2hhcGVzID0ge1xuICAgIEJyb2tlbkxpbmUgOiBCcm9rZW5MaW5lLFxuICAgIENpcmNsZSA6IENpcmNsZSxcbiAgICBEcm9wbGV0IDogRHJvcGxldCxcbiAgICBFbGxpcHNlIDogRWxsaXBzZSxcbiAgICBJc29nb24gOiBJc29nb24sXG4gICAgTGluZSA6IExpbmUsXG4gICAgUGF0aCA6IFBhdGgsXG4gICAgUG9seWdvbiA6IFBvbHlnb24sXG4gICAgUmVjdCA6IFJlY3QsXG4gICAgU2VjdG9yIDogU2VjdG9yXG59XG5cbkNhbnZheC5FdmVudCA9IHtcbiAgICBFdmVudERpc3BhdGNoZXIgOiBFdmVudERpc3BhdGNoZXIsXG4gICAgRXZlbnRNYW5hZ2VyICAgIDogRXZlbnRNYW5hZ2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbnZheDsiXSwibmFtZXMiOlsiXyIsImJyZWFrZXIiLCJBcnJheVByb3RvIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJPYmpQcm90byIsIk9iamVjdCIsInRvU3RyaW5nIiwiaGFzT3duUHJvcGVydHkiLCJuYXRpdmVGb3JFYWNoIiwiZm9yRWFjaCIsIm5hdGl2ZUZpbHRlciIsImZpbHRlciIsIm5hdGl2ZUluZGV4T2YiLCJpbmRleE9mIiwibmF0aXZlSXNBcnJheSIsImlzQXJyYXkiLCJuYXRpdmVLZXlzIiwia2V5cyIsInZhbHVlcyIsIm9iaiIsImxlbmd0aCIsImkiLCJUeXBlRXJyb3IiLCJrZXkiLCJoYXMiLCJwdXNoIiwiY2FsbCIsImVhY2giLCJpdGVyYXRvciIsImNvbnRleHQiLCJjb21wYWN0IiwiYXJyYXkiLCJpZGVudGl0eSIsInNlbGVjdCIsInJlc3VsdHMiLCJ2YWx1ZSIsImluZGV4IiwibGlzdCIsIm5hbWUiLCJpc0Z1bmN0aW9uIiwiaXNGaW5pdGUiLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc051bWJlciIsImlzQm9vbGVhbiIsImlzTnVsbCIsImlzRW1wdHkiLCJpc1N0cmluZyIsImlzRWxlbWVudCIsIm5vZGVUeXBlIiwiaXNPYmplY3QiLCJpdGVtIiwiaXNTb3J0ZWQiLCJNYXRoIiwibWF4Iiwic29ydGVkSW5kZXgiLCJpc1dpbmRvdyIsIndpbmRvdyIsImlzUGxhaW5PYmplY3QiLCJjb25zdHJ1Y3RvciIsImhhc093biIsImUiLCJ1bmRlZmluZWQiLCJleHRlbmQiLCJvcHRpb25zIiwic3JjIiwiY29weSIsImNvcHlJc0FycmF5IiwiY2xvbmUiLCJ0YXJnZXQiLCJhcmd1bWVudHMiLCJkZWVwIiwic2xpY2UiLCJVdGlscyIsImRldmljZVBpeGVsUmF0aW8iLCJfVUlEIiwiY2hhckNvZGUiLCJjaGFyQ29kZUF0IiwiZ2V0VUlEIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZ2V0Q29udGV4dCIsInByb3RvIiwibmV3UHJvdG8iLCJPYmplY3RDcmVhdGUiLCJjcmVhdGUiLCJfX2VtcHR5RnVuYyIsInIiLCJzIiwicHgiLCJzcCIsInJwIiwiY3JlYXRlT2JqZWN0Iiwic3VwZXJjbGFzcyIsImNhbnZhcyIsIkZsYXNoQ2FudmFzIiwiaW5pdEVsZW1lbnQiLCJvcHQiLCJzb3VyY2UiLCJzdHJpY3QiLCJyMSIsInIyIiwicjMiLCJyNCIsIngiLCJ5IiwiYXJnIiwicCIsIkNhbnZheEV2ZW50IiwiZXZ0IiwicGFyYW1zIiwiZXZlbnRUeXBlIiwidHlwZSIsImN1cnJlbnRUYXJnZXQiLCJwb2ludCIsIl9zdG9wUHJvcGFnYXRpb24iLCJhZGRPclJtb3ZlRXZlbnRIYW5kIiwiZG9tSGFuZCIsImllSGFuZCIsImV2ZW50RG9tRm4iLCJlbCIsImZuIiwiZXZlbnRGbiIsImV2ZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJib3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJkb2MiLCJvd25lckRvY3VtZW50IiwiYm9keSIsImRvY0VsZW0iLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRUb3AiLCJjbGllbnRMZWZ0IiwiYm91bmQiLCJyaWdodCIsImxlZnQiLCJjbGllbnRXaWR0aCIsInpvb20iLCJ0b3AiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInBhZ2VYT2Zmc2V0Iiwic2Nyb2xsTGVmdCIsInBhZ2VYIiwiY2xpZW50WCIsInBhZ2VZIiwiY2xpZW50WSIsIl93aWR0aCIsIl9oZWlnaHQiLCJpZCIsInN0eWxlIiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInNldEF0dHJpYnV0ZSIsInNldHRpbmdzIiwiUkVTT0xVVElPTiIsInZpZXciLCJjbGFzc05hbWUiLCJjc3NUZXh0Iiwic3RhZ2VfYyIsImRvbV9jIiwiYXBwZW5kQ2hpbGQiLCJfbW91c2VFdmVudFR5cGVzIiwiX2hhbW1lckV2ZW50VHlwZXMiLCJFdmVudEhhbmRsZXIiLCJjYW52YXgiLCJjdXJQb2ludHMiLCJQb2ludCIsImN1clBvaW50c1RhcmdldCIsIl90b3VjaGluZyIsIl9kcmFnaW5nIiwiX2N1cnNvciIsInR5cGVzIiwiZHJhZyIsImNvbnRhaW5zIiwiY29tcGFyZURvY3VtZW50UG9zaXRpb24iLCJwYXJlbnQiLCJjaGlsZCIsIm1lIiwiYWRkRXZlbnQiLCJfX21vdXNlSGFuZGxlciIsIm9uIiwiX19saWJIYW5kbGVyIiwicm9vdCIsInVwZGF0ZVZpZXdPZmZzZXQiLCIkIiwidmlld09mZnNldCIsImN1ck1vdXNlUG9pbnQiLCJjdXJNb3VzZVRhcmdldCIsImdldE9iamVjdHNVbmRlclBvaW50IiwiZHJhZ0VuYWJsZWQiLCJ0b0VsZW1lbnQiLCJyZWxhdGVkVGFyZ2V0IiwiX2RyYWdFbmQiLCJmaXJlIiwiX19nZXRjdXJQb2ludHNUYXJnZXQiLCJnbG9iYWxBbHBoYSIsImNsb25lT2JqZWN0IiwiX2Nsb25lMmhvdmVyU3RhZ2UiLCJfZ2xvYmFsQWxwaGEiLCJfZHJhZ01vdmVIYW5kZXIiLCJfX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyIsIl9jdXJzb3JIYW5kZXIiLCJwcmV2ZW50RGVmYXVsdCIsInJldHVyblZhbHVlIiwib2xkT2JqIiwiX2hvdmVyQ2xhc3MiLCJwb2ludENoa1ByaW9yaXR5IiwiZ2V0Q2hpbGRJblBvaW50IiwiZ2xvYmFsVG9Mb2NhbCIsImRpc3BhdGNoRXZlbnQiLCJ0b1RhcmdldCIsImZyb21UYXJnZXQiLCJfc2V0Q3Vyc29yIiwiY3Vyc29yIiwiX19nZXRDYW52YXhQb2ludEluVG91Y2hzIiwiX19nZXRDaGlsZEluVG91Y2hzIiwic3RhcnQiLCJtb3ZlIiwiZW5kIiwiY3VyVG91Y2hzIiwidG91Y2giLCJ0b3VjaHMiLCJ0b3VjaGVzVGFyZ2V0IiwiY2hpbGRzIiwiaGFzQ2hpbGQiLCJjZSIsInN0YWdlUG9pbnQiLCJfZHJhZ0R1cGxpY2F0ZSIsIl9idWZmZXJTdGFnZSIsImdldENoaWxkQnlJZCIsIl90cmFuc2Zvcm0iLCJnZXRDb25jYXRlbmF0ZWRNYXRyaXgiLCJhZGRDaGlsZEF0IiwiX2RyYWdQb2ludCIsIl9wb2ludCIsIl9ub3RXYXRjaCIsIl9tb3ZlU3RhZ2UiLCJtb3ZlaW5nIiwiaGVhcnRCZWF0IiwiZGVzdHJveSIsIkV2ZW50TWFuYWdlciIsIl9ldmVudE1hcCIsImxpc3RlbmVyIiwiYWRkUmVzdWx0Iiwic2VsZiIsInNwbGl0IiwibWFwIiwiX2V2ZW50RW5hYmxlZCIsInJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUiLCJsaSIsInNwbGljZSIsIl9kaXNwYXRjaEV2ZW50IiwiRXZlbnREaXNwYXRjaGVyIiwiY3JlYXRDbGFzcyIsIl9hZGRFdmVudExpc3RlbmVyIiwiX3JlbW92ZUV2ZW50TGlzdGVuZXIiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSIsIl9yZW1vdmVBbGxFdmVudExpc3RlbmVycyIsImxvZyIsImVUeXBlIiwiY2hpbGRyZW4iLCJwcmVIZWFydEJlYXQiLCJfaGVhcnRCZWF0TnVtIiwicHJlZ0FscGhhIiwiaG92ZXJDbG9uZSIsImdldFN0YWdlIiwiYWN0aXZTaGFwZSIsInJlbW92ZUNoaWxkQnlJZCIsIl9oYXNFdmVudExpc3RlbmVyIiwib3ZlckZ1biIsIm91dEZ1biIsIm9uY2VIYW5kbGUiLCJhcHBseSIsInVuIiwiTWF0cml4IiwiYSIsImIiLCJjIiwiZCIsInR4IiwidHkiLCJtdHgiLCJzY2FsZVgiLCJzY2FsZVkiLCJyb3RhdGlvbiIsImNvcyIsInNpbiIsIlBJIiwiY29uY2F0IiwiYW5nbGUiLCJzdCIsImFicyIsImN0Iiwic3giLCJzeSIsImR4IiwiZHkiLCJ2IiwiYWEiLCJhYyIsImF0eCIsImFiIiwiYWQiLCJhdHkiLCJvdXQiLCJfY2FjaGUiLCJfcmFkaWFucyIsImlzRGVncmVlcyIsInRvRml4ZWQiLCJkZWdyZWVUb1JhZGlhbiIsInJhZGlhblRvRGVncmVlIiwiZGVncmVlVG8zNjAiLCJyZUFuZyIsImlzSW5zaWRlIiwic2hhcGUiLCJfcG9pbnRJblNoYXBlIiwiX2lzSW5zaWRlTGluZSIsIl9pc0luc2lkZUJyb2tlbkxpbmUiLCJfaXNJbnNpZGVDaXJjbGUiLCJfaXNQb2ludEluRWxpcHNlIiwiX2lzSW5zaWRlU2VjdG9yIiwiX2lzSW5zaWRlUGF0aCIsIl9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlciIsImlzT3V0c2lkZSIsIngwIiwieFN0YXJ0IiwieTAiLCJ5U3RhcnQiLCJ4MSIsInhFbmQiLCJ5MSIsInlFbmQiLCJfbCIsImxpbmVXaWR0aCIsIl9hIiwiX2IiLCJfcyIsInBvaW50TGlzdCIsImxpbmVBcmVhIiwiaW5zaWRlQ2F0Y2giLCJsIiwiX2lzSW5zaWRlUmVjdGFuZ2xlIiwibWluIiwicjAiLCJzdGFydEFuZ2xlIiwibXlNYXRoIiwiZW5kQW5nbGUiLCJhdGFuMiIsInJlZ0luIiwiY2xvY2t3aXNlIiwicmVnQW5nbGUiLCJpbkFuZ2xlUmVnIiwiY2VudGVyIiwiWFJhZGl1cyIsImhyIiwiWVJhZGl1cyIsInZyIiwiaVJlcyIsInBvbHkiLCJ3biIsInNoaWZ0UCIsInNoaWZ0IiwiaW5MaW5lIiwiZmlsbFN0eWxlIiwibiIsIlRXRUVOIiwiX3R3ZWVucyIsInR3ZWVuIiwidGltZSIsInByZXNlcnZlIiwibm93IiwiX3QiLCJfdXBkYXRlUmVzIiwidXBkYXRlIiwicHJvY2VzcyIsImhydGltZSIsInBlcmZvcm1hbmNlIiwiYmluZCIsIkRhdGUiLCJnZXRUaW1lIiwiVHdlZW4iLCJvYmplY3QiLCJfb2JqZWN0IiwiX3ZhbHVlc1N0YXJ0IiwiX3ZhbHVlc0VuZCIsIl92YWx1ZXNTdGFydFJlcGVhdCIsIl9kdXJhdGlvbiIsIl9yZXBlYXQiLCJfcmVwZWF0RGVsYXlUaW1lIiwiX3lveW8iLCJfaXNQbGF5aW5nIiwiX3JldmVyc2VkIiwiX2RlbGF5VGltZSIsIl9zdGFydFRpbWUiLCJfZWFzaW5nRnVuY3Rpb24iLCJFYXNpbmciLCJMaW5lYXIiLCJOb25lIiwiX2ludGVycG9sYXRpb25GdW5jdGlvbiIsIkludGVycG9sYXRpb24iLCJfY2hhaW5lZFR3ZWVucyIsIl9vblN0YXJ0Q2FsbGJhY2siLCJfb25TdGFydENhbGxiYWNrRmlyZWQiLCJfb25VcGRhdGVDYWxsYmFjayIsIl9vbkNvbXBsZXRlQ2FsbGJhY2siLCJfb25TdG9wQ2FsbGJhY2siLCJ0byIsInByb3BlcnRpZXMiLCJkdXJhdGlvbiIsImFkZCIsInByb3BlcnR5Iiwic3RvcCIsInJlbW92ZSIsInN0b3BDaGFpbmVkVHdlZW5zIiwibnVtQ2hhaW5lZFR3ZWVucyIsImRlbGF5IiwiYW1vdW50IiwicmVwZWF0IiwidGltZXMiLCJyZXBlYXREZWxheSIsInlveW8iLCJlYXNpbmciLCJpbnRlcnBvbGF0aW9uIiwiY2hhaW4iLCJvblN0YXJ0IiwiY2FsbGJhY2siLCJvblVwZGF0ZSIsIm9uQ29tcGxldGUiLCJvblN0b3AiLCJlbGFwc2VkIiwiY2hhckF0IiwidG1wIiwiayIsInBvdyIsInNxcnQiLCJCb3VuY2UiLCJPdXQiLCJJbiIsIm0iLCJmIiwiZmxvb3IiLCJwdyIsImJuIiwiQmVybnN0ZWluIiwiQ2F0bXVsbFJvbSIsInAwIiwicDEiLCJ0IiwiZmMiLCJGYWN0b3JpYWwiLCJwMiIsInAzIiwidjAiLCJ2MSIsInQyIiwidDMiLCJsYXN0VGltZSIsInZlbmRvcnMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImVsZW1lbnQiLCJjdXJyVGltZSIsInRpbWVUb0NhbGwiLCJzZXRUaW1lb3V0IiwiX3Rhc2tMaXN0IiwiX3JlcXVlc3RBaWQiLCJlbmFibGVkQW5pbWF0aW9uRnJhbWUiLCJjdXJyVGFza0xpc3QiLCJ0YXNrIiwicmVnaXN0RnJhbWUiLCIkZnJhbWUiLCJkZXN0cm95RnJhbWUiLCJkX3Jlc3VsdCIsInJlZ2lzdFR3ZWVuIiwidGlkIiwiZnJvbSIsIl9pc0NvbXBsZXRlZWQiLCJfaXNTdG9wZWQiLCJhbmltYXRlIiwiZGVzYyIsImRlc3Ryb3lUd2VlbiIsIm1zZyIsInVud2F0Y2hPbmUiLCJPYnNlcnZlIiwic2NvcGUiLCJtb2RlbCIsIndhdGNoTW9yZSIsInN0b3BSZXBlYXRBc3NpZ24iLCJza2lwQXJyYXkiLCIkc2tpcEFycmF5IiwiVkJQdWJsaWNzIiwibG9vcCIsInZhbCIsInZhbHVlVHlwZSIsImFjY2Vzc29yIiwibmVvIiwicHJlVmFsdWUiLCJjb21wbGV4VmFsdWUiLCJuZW9UeXBlIiwiYWRkQ29sb3JTdG9wIiwiJG1vZGVsIiwiJGZpcmUiLCJwbW9kZWwiLCJoYXNXYXRjaE1vZGVsIiwiJHdhdGNoIiwiJHBhcmVudCIsImRlZmluZVByb3BlcnRpZXMiLCJhY2Nlc3NvcmVzIiwiJGFjY2Vzc29yIiwiZGVmaW5lUHJvcGVydHkiLCJwcm9wIiwiX19kZWZpbmVHZXR0ZXJfXyIsImdldCIsIl9fZGVmaW5lU2V0dGVyX18iLCJzZXQiLCJkZXNjcyIsIlZCQXJyYXkiLCJleGVjU2NyaXB0Iiwiam9pbiIsIlZCTWVkaWF0b3IiLCJkZXNjcmlwdGlvbiIsInB1YmxpY3MiLCJvd25lciIsImJ1ZmZlciIsInBhcnNlVkIiLCJSRU5ERVJFUl9UWVBFIiwiU0hBUEVTIiwiQ09OVEVYVF9ERUZBVUxUIiwiRGlzcGxheU9iamVjdCIsImNoZWNrT3B0Iiwic3RhZ2UiLCJ4eVRvSW50IiwiX2NyZWF0ZUNvbnRleHQiLCJVSUQiLCJjcmVhdGVJZCIsImluaXQiLCJfdXBkYXRlVHJhbnNmb3JtIiwiX2NvbnRleHRBVFRSUyIsImNvcHkyY29udGV4dCIsIl9jb250ZXh0IiwiJG93bmVyIiwidHJhbnNGb3JtUHJvcHMiLCJteXNlbGYiLCJjb25mIiwibmV3T2JqIiwidGV4dCIsImNvbnRhaW5lciIsImNtIiwiaW52ZXJ0IiwibG9jYWxUb0dsb2JhbCIsIm8iLCJib29sIiwibnVtIiwiZnJvbUluZGV4IiwiZ2V0SW5kZXgiLCJ0b0luZGV4IiwicGNsIiwib3JpZ2luIiwic2NhbGVPcmlnaW4iLCJ0cmFuc2xhdGUiLCJzY2FsZSIsInJvdGF0ZU9yaWdpbiIsInJvdGF0ZSIsInBhcnNlSW50Iiwic3Ryb2tlU3R5bGUiLCJyZXN1bHQiLCJpbnZlcnNlTWF0cml4Iiwib3JpZ2luUG9zIiwibXVsVmVjdG9yIiwiX3JlY3QiLCJnZXRSZWN0IiwiSGl0VGVzdFBvaW50IiwidG9Db250ZW50IiwidXBGdW4iLCJjb21wRnVuIiwiQW5pbWF0aW9uRnJhbWUiLCJjdHgiLCJ2aXNpYmxlIiwic2F2ZSIsInRyYW5zRm9ybSIsInRyYW5zZm9ybSIsInRvQXJyYXkiLCJyZW5kZXIiLCJyZXN0b3JlIiwicmVtb3ZlQ2hpbGQiLCJEaXNwbGF5T2JqZWN0Q29udGFpbmVyIiwibW91c2VDaGlsZHJlbiIsImdldENoaWxkSW5kZXgiLCJfYWZ0ZXJBZGRDaGlsZCIsInJlbW92ZUNoaWxkQXQiLCJfYWZ0ZXJEZWxDaGlsZCIsImxlbiIsImdldENoaWxkQXQiLCJib29sZW4iLCJvbGRJbmRleCIsImdldE51bUNoaWxkcmVuIiwib2JqcyIsIl9yZW5kZXIiLCJTdGFnZSIsImNvbnRleHQyRCIsInN0YWdlUmVuZGluZyIsIl9pc1JlYWR5IiwiX2RldmljZVBpeGVsUmF0aW8iLCJjbGVhciIsImNsZWFyUmVjdCIsIlN5c3RlbVJlbmRlcmVyIiwiVU5LTk9XTiIsImFwcCIsInJlcXVlc3RBaWQiLCJjb252ZXJ0U3RhZ2VzIiwiX2hlYXJ0QmVhdCIsIl9wcmVSZW5kZXJUaW1lIiwiZW50ZXJGcmFtZSIsImNvbnZlcnRTdGFnZSIsImNvbnZlcnRUeXBlIiwiX2NvbnZlcnRDYW52YXgiLCJjb252ZXJ0U2hhcGVzIiwic3RhcnRFbnRlciIsIkNhbnZhc1JlbmRlcmVyIiwiQ0FOVkFTIiwiQXBwbGljYXRpb24iLCJfY2lkIiwicmFuZG9tIiwicXVlcnkiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsInZpZXdPYmoiLCJjcmVhdGVWaWV3IiwiaW5uZXJIVE1MIiwib2Zmc2V0IiwibGFzdEdldFJPIiwicmVuZGVyZXIiLCJSZW5kZXJlciIsIl9jcmVhdEhvdmVyU3RhZ2UiLCJfY3JlYXRlUGl4ZWxDb250ZXh0IiwicmVTaXplQ2FudmFzIiwicmVzaXplIiwiYWRkQ2hpbGQiLCJfcGl4ZWxDYW52YXMiLCJjcmVhdGVDYW52YXMiLCJjYW52YXNTdXBwb3J0IiwiZGlzcGxheSIsInpJbmRleCIsInZpc2liaWxpdHkiLCJfcGl4ZWxDdHgiLCJpbnNlcnRCZWZvcmUiLCJpbml0U3RhZ2UiLCJTcHJpdGUiLCJHcmFwaGljc0RhdGEiLCJsaW5lQ29sb3IiLCJsaW5lQWxwaGEiLCJmaWxsQ29sb3IiLCJmaWxsQWxwaGEiLCJmaWxsIiwiX2xpbmVUaW50IiwiX2ZpbGxUaW50IiwiaG9sZXMiLCJ0cmFuc3Bvc2UiLCJGbG9hdDMyQXJyYXkiLCJwb3MiLCJuZXdQb3MiLCJhMSIsImMxIiwidHgxIiwibWF0cml4IiwiYjEiLCJkMSIsInBpdm90WCIsInBpdm90WSIsInNrZXdYIiwic2tld1kiLCJzciIsImNyIiwiY3kiLCJuc3giLCJjeCIsImRlbHRhIiwic2tldyIsIklERU5USVRZIiwiVEVNUF9NQVRSSVgiLCJ1eCIsInV5IiwidngiLCJ2eSIsInRlbXBNYXRyaWNlcyIsIm11bCIsInNpZ251bSIsInJvdyIsImoiLCJfdXgiLCJfdXkiLCJfdngiLCJfdnkiLCJtYXQiLCJSZWN0YW5nbGUiLCJSRUNUIiwiYm90dG9tIiwiRU1QVFkiLCJyZWN0YW5nbGUiLCJwYWRkaW5nWCIsInBhZGRpbmdZIiwieDIiLCJ5MiIsIkNpcmNsZSIsInJhZGl1cyIsIkNJUkMiLCJFbGxpcHNlIiwiRUxJUCIsIm5vcm14Iiwibm9ybXkiLCJQb2x5Z29uIiwicG9pbnRzIiwiaWwiLCJjbG9zZWQiLCJQT0xZIiwiaW5zaWRlIiwieGkiLCJ5aSIsInhqIiwieWoiLCJpbnRlcnNlY3QiLCJSb3VuZGVkUmVjdGFuZ2xlIiwiUlJFQyIsInJhZGl1czIiLCJiZXppZXJDdXJ2ZVRvIiwiZnJvbVgiLCJmcm9tWSIsImNwWCIsImNwWSIsImNwWDIiLCJjcFkyIiwidG9YIiwidG9ZIiwicGF0aCIsImR0IiwiZHQyIiwiZHQzIiwidGVtcE1hdHJpeCIsInRlbXBQb2ludCIsIkdyYXBoaWNzIiwiZ3JhcGhpY3NEYXRhIiwidGludCIsIl9wcmV2VGludCIsImN1cnJlbnRQYXRoIiwiX3dlYkdMIiwiZGlydHkiLCJmYXN0UmVjdERpcnR5IiwiY2xlYXJEaXJ0eSIsImJvdW5kc0RpcnR5IiwiY2FjaGVkU3ByaXRlRGlydHkiLCJfc3ByaXRlUmVjdCIsIl9mYXN0UmVjdCIsImJvdW5kc1BhZGRpbmciLCJ1cGRhdGVMb2NhbEJvdW5kcyIsImNvbG9yIiwiYWxwaGEiLCJkcmF3U2hhcGUiLCJtb3ZlVG8iLCJ4YSIsInlhIiwiYTIiLCJiMiIsIm1tIiwiZGQiLCJjYyIsInR0IiwiazEiLCJrMiIsImoxIiwiajIiLCJweSIsInF4IiwicXkiLCJhcmMiLCJhbnRpY2xvY2t3aXNlIiwic3dlZXAiLCJzZWdzIiwiY2VpbCIsInN0YXJ0WCIsInN0YXJ0WSIsInRoZXRhIiwidGhldGEyIiwiY1RoZXRhIiwic1RoZXRhIiwic2VnTWludXMiLCJyZW1haW5kZXIiLCJyZWFsIiwiZmlsbGluZyIsInNldE9iamVjdFJlbmRlcmVyIiwicGx1Z2lucyIsImdyYXBoaWNzIiwicG9wIiwiZGF0YSIsImNsb3NlIiwiX3dlYmdsIiwiX2xvY2FsQm91bmRzIiwiU2hhcGUiLCJfaG92ZXJhYmxlIiwiX2NsaWNrYWJsZSIsImRyYXciLCJpbml0Q29tcFByb3BlcnR5IiwiX2hhc0ZpbGxBbmRTdHJva2UiLCJfZHJhd1R5cGVPbmx5IiwiY2xvc2VQYXRoIiwic3Ryb2tlIiwiYmVnaW5QYXRoIiwiZHJhd0VuZCIsImRhc2hMZW5ndGgiLCJkZWx0YVgiLCJkZWx0YVkiLCJudW1EYXNoZXMiLCJsaW5lVG8iLCJtaW5YIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwibWF4WCIsIk1JTl9WQUxVRSIsIm1pblkiLCJtYXhZIiwiY3BsIiwicm91bmQiLCJUZXh0IiwiX3JlTmV3bGluZSIsImZvbnRQcm9wZXJ0cyIsImZvbnQiLCJfZ2V0Rm9udERlY2xhcmF0aW9uIiwiZ2V0VGV4dFdpZHRoIiwiZ2V0VGV4dEhlaWdodCIsIl9yZW5kZXJUZXh0IiwiX2dldFRleHRMaW5lcyIsIl9nZXRUZXh0V2lkdGgiLCJfZ2V0VGV4dEhlaWdodCIsInRleHRMaW5lcyIsIl9yZW5kZXJUZXh0U3Ryb2tlIiwiX3JlbmRlclRleHRGaWxsIiwiZm9udEFyciIsImZvbnRQIiwiX2JvdW5kYXJpZXMiLCJsaW5lSGVpZ2h0cyIsImhlaWdodE9mTGluZSIsIl9nZXRIZWlnaHRPZkxpbmUiLCJfcmVuZGVyVGV4dExpbmUiLCJfZ2V0VG9wT2Zmc2V0Iiwic3Ryb2tlRGFzaEFycmF5Iiwic2V0TGluZURhc2giLCJtZXRob2QiLCJsaW5lIiwibGluZUluZGV4IiwidGV4dEFsaWduIiwiX3JlbmRlckNoYXJzIiwibWVhc3VyZVRleHQiLCJ0b3RhbFdpZHRoIiwid29yZHMiLCJ3b3Jkc1dpZHRoIiwicmVwbGFjZSIsIndpZHRoRGlmZiIsIm51bVNwYWNlcyIsInNwYWNlV2lkdGgiLCJsZWZ0T2Zmc2V0IiwiY2hhcnMiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJtYXhXaWR0aCIsImN1cnJlbnRMaW5lV2lkdGgiLCJ0ZXh0QmFzZWxpbmUiLCJWZWN0b3IiLCJfYXhlcyIsImludGVycG9sYXRlIiwiaXNMb29wIiwic21vb3RoRmlsdGVyIiwicmV0IiwiZGlzdGFuY2UiLCJwcmVWZXJ0b3IiLCJpVnRvciIsImlkeCIsInciLCJ3MiIsInczIiwiQnJva2VuTGluZSIsImF0eXBlIiwiX2luaXRQb2ludExpc3QiLCJteUMiLCJzbW9vdGgiLCJjdXJyTCIsIlNtb290aFNwbGluZSIsIl9kcmF3IiwibGluZVR5cGUiLCJzaSIsInNsIiwiZGFzaGVkTGluZVRvIiwiZ2V0UmVjdEZvcm1Qb2ludExpc3QiLCJwbGlzdCIsIml0IiwiaXQyIiwiaXQzIiwiY3BYMSIsImNwWTEiLCJQYXRoIiwiZHJhd1R5cGVPbmx5IiwiX19wYXJzZVBhdGhEYXRhIiwicGF0aHMiLCJwYXRoU3RyIiwiX3BhcnNlQ2hpbGRQYXRoRGF0YSIsImNzIiwiUmVnRXhwIiwiYXJyIiwiY2EiLCJjcHgiLCJjcHkiLCJzdHIiLCJjbWQiLCJjdGxQdHgiLCJjdGxQdHkiLCJwcmV2Q21kIiwicngiLCJyeSIsInBzaSIsImZhIiwiZnMiLCJjb21tYW5kIiwiX2NvbnZlcnRQb2ludCIsInBzaURlZyIsInhwIiwieXAiLCJsYW1iZGEiLCJjeHAiLCJjeXAiLCJ2TWFnIiwidlJhdGlvIiwidSIsInZBbmdsZSIsImFjb3MiLCJkVGhldGEiLCJzdGVwcyIsInBhcnIiLCJ0cCIsIkJlemllciIsImdldFBvaW50QnlUaW1lIiwiY3BzIiwicGF0aEFycmF5IiwiX3BhcnNlUGF0aERhdGEiLCJfc2V0UG9pbnRMaXN0IiwiZyIsImdsIiwicXVhZHJhdGljQ3VydmVUbyIsInNpbmdsZVBvaW50TGlzdCIsInRvVXBwZXJDYXNlIiwiX2dldEFyY1BvaW50cyIsIl9wb2ludHMiLCJjU3RhcnQiLCJwcmVQb2ludHMiLCJfZ2V0QmV6aWVyUG9pbnRzIiwicmVjdCIsIkRyb3BsZXQiLCJwcyIsInJhdGlvWCIsInJhdGlvWSIsInVuc2hpZnQiLCJJc29nb24iLCJzZXRQb2ludExpc3QiLCJkU3RlcCIsImJlZ2luRGVnIiwiZGVnIiwiTGluZSIsIlJlY3QiLCJnZXRDc3NPcmRlckFyciIsImZpbGxSZWN0Iiwic3Ryb2tlUmVjdCIsIl9idWlsZFJhZGl1c1BhdGgiLCJTZWN0b3IiLCJpc1JpbmciLCJnZXRSZWdBbmdsZSIsInA0RGlyZWN0aW9uIiwiQ2FudmF4IiwiRGlzcGxheSIsIlNoYXBlcyIsIkV2ZW50Il0sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFJQSxNQUFJLEVBQVI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQSxJQUFJQyxhQUFhQyxNQUFNQyxTQUF2QjtJQUFrQ0MsV0FBV0MsT0FBT0YsU0FBcEQ7QUFDQSxJQUNBRyxXQUFtQkYsU0FBU0UsUUFENUI7SUFFQUMsaUJBQW1CSCxTQUFTRyxjQUY1Qjs7QUFJQSxJQUNBQyxnQkFBcUJQLFdBQVdRLE9BRGhDO0lBRUFDLGVBQXFCVCxXQUFXVSxNQUZoQztJQUdBQyxnQkFBcUJYLFdBQVdZLE9BSGhDO0lBSUFDLGdCQUFxQlosTUFBTWEsT0FKM0I7SUFLQUMsYUFBcUJYLE9BQU9ZLElBTDVCOztBQU9BbEIsSUFBRW1CLE1BQUYsR0FBVyxVQUFTQyxHQUFULEVBQWM7TUFDbkJGLE9BQU9sQixJQUFFa0IsSUFBRixDQUFPRSxHQUFQLENBQVg7TUFDSUMsU0FBU0gsS0FBS0csTUFBbEI7TUFDSUYsU0FBUyxJQUFJaEIsS0FBSixDQUFVa0IsTUFBVixDQUFiO09BQ0ssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxNQUFwQixFQUE0QkMsR0FBNUIsRUFBaUM7V0FDeEJBLENBQVAsSUFBWUYsSUFBSUYsS0FBS0ksQ0FBTCxDQUFKLENBQVo7O1NBRUtILE1BQVA7Q0FQRjs7QUFVQW5CLElBQUVrQixJQUFGLEdBQVNELGNBQWMsVUFBU0csR0FBVCxFQUFjO01BQy9CQSxRQUFRZCxPQUFPYyxHQUFQLENBQVos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
