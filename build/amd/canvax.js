define(function () { 'use strict';

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

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmF4LmpzIiwic291cmNlcyI6WyIuLi8uLi9jYW52YXgvdXRpbHMvdW5kZXJzY29yZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9pbmRleC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1BvaW50LmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0NhbnZheEV2ZW50LmpzIiwiLi4vLi4vY2FudmF4L3NldHRpbmdzLmpzIiwiLi4vLi4vY2FudmF4L3V0aWxzL2RvbS5qcyIsIi4uLy4uL2NhbnZheC9ldmVudC9FdmVudEhhbmRsZXIuanMiLCIuLi8uLi9jYW52YXgvZXZlbnQvRXZlbnRNYW5hZ2VyLmpzIiwiLi4vLi4vY2FudmF4L2V2ZW50L0V2ZW50RGlzcGF0Y2hlci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdHJpeC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL01hdGguanMiLCIuLi8uLi9jYW52YXgvZ2VvbS9IaXRUZXN0UG9pbnQuanMiLCIuLi8uLi9jYW52YXgvYW5pbWF0aW9uL1R3ZWVuLmpzIiwiLi4vLi4vY2FudmF4L2FuaW1hdGlvbi9BbmltYXRpb25GcmFtZS5qcyIsIi4uLy4uL2NhbnZheC91dGlscy9vYnNlcnZlLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvRGlzcGxheU9iamVjdC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L0Rpc3BsYXlPYmplY3RDb250YWluZXIuanMiLCIuLi8uLi9jYW52YXgvZGlzcGxheS9TdGFnZS5qcyIsIi4uLy4uL2NhbnZheC9jb25zdC5qcyIsIi4uLy4uL2NhbnZheC9yZW5kZXJlcnMvU3lzdGVtUmVuZGVyZXIuanMiLCIuLi8uLi9jYW52YXgvcmVuZGVyZXJzL2NhbnZhcy9DYW52YXNSZW5kZXJlci5qcyIsIi4uLy4uL2NhbnZheC9BcHBsaWNhdGlvbi5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L1NoYXBlLmpzIiwiLi4vLi4vY2FudmF4L2Rpc3BsYXkvVGV4dC5qcyIsIi4uLy4uL2NhbnZheC9kaXNwbGF5L01vdmllY2xpcC5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL1ZlY3Rvci5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL1Ntb290aFNwbGluZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Ccm9rZW5MaW5lLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0NpcmNsZS5qcyIsIi4uLy4uL2NhbnZheC9nZW9tL2Jlemllci5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9QYXRoLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0Ryb3BsZXQuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvRWxsaXBzZS5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9Qb2x5Z29uLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL0lzb2dvbi5qcyIsIi4uLy4uL2NhbnZheC9zaGFwZS9MaW5lLmpzIiwiLi4vLi4vY2FudmF4L3NoYXBlL1JlY3QuanMiLCIuLi8uLi9jYW52YXgvc2hhcGUvU2VjdG9yLmpzIiwiLi4vLi4vY2FudmF4L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfID0ge31cbnZhciBicmVha2VyID0ge307XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXJcbnRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbmhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxudmFyXG5uYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG5uYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbm5hdGl2ZUluZGV4T2YgICAgICA9IEFycmF5UHJvdG8uaW5kZXhPZixcbm5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG5uYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cztcblxuXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbl8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmogIT09IE9iamVjdChvYmopKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9iamVjdCcpO1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbn07XG5cbl8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xufTtcblxudmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICB9XG4gIH1cbn07XG5cbl8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG59O1xuXG5fLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHRzO1xufTtcblxuZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICB9O1xufSk7XG5cbmlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gIH07XG59O1xuXG5fLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xufTtcblxuXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xufTtcblxuXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG59O1xuXG5fLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBudWxsO1xufTtcblxuXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5fLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG59O1xuXG5fLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5fLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufTtcblxuXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbl8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgaWYgKGlzU29ydGVkKSB7XG4gICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsZW5ndGggKyBpc1NvcnRlZCkgOiBpc1NvcnRlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgIHJldHVybiBhcnJheVtpXSA9PT0gaXRlbSA/IGkgOiAtMTtcbiAgICB9XG4gIH1cbiAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSwgaXNTb3J0ZWQpO1xuICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbn07XG5cbl8uaXNXaW5kb3cgPSBmdW5jdGlvbiggb2JqICkgeyBcbiAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmogPT0gb2JqLndpbmRvdztcbn07XG5fLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiggb2JqICkge1xuICAgIC8vIEJlY2F1c2Ugb2YgSUUsIHdlIGFsc28gaGF2ZSB0byBjaGVjayB0aGUgcHJlc2VuY2Ugb2YgdGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5LlxuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IERPTSBub2RlcyBhbmQgd2luZG93IG9iamVjdHMgZG9uJ3QgcGFzcyB0aHJvdWdoLCBhcyB3ZWxsXG4gICAgaWYgKCAhb2JqIHx8IHR5cGVvZiBvYmogIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8IF8uaXNXaW5kb3coIG9iaiApICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgICAgICAgaWYgKCBvYmouY29uc3RydWN0b3IgJiZcbiAgICAgICAgICAgICFoYXNPd24uY2FsbChvYmosIFwiY29uc3RydWN0b3JcIikgJiZcbiAgICAgICAgICAgICFoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCBcImlzUHJvdG90eXBlT2ZcIikgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgLy8gSUU4LDkgV2lsbCB0aHJvdyBleGNlcHRpb25zIG9uIGNlcnRhaW4gaG9zdCBvYmplY3RzICM5ODk3XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gT3duIHByb3BlcnRpZXMgYXJlIGVudW1lcmF0ZWQgZmlyc3RseSwgc28gdG8gc3BlZWQgdXAsXG4gICAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gICAgdmFyIGtleTtcbiAgICBmb3IgKCBrZXkgaW4gb2JqICkge31cblxuICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbCggb2JqLCBrZXkgKTtcbn07XG5fLmV4dGVuZCA9IGZ1bmN0aW9uKCkgeyAgXG4gIHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSwgIFxuICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LCAgXG4gICAgICBpID0gMSwgIFxuICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwgIFxuICAgICAgZGVlcCA9IGZhbHNlOyAgXG4gIGlmICggdHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIgKSB7ICBcbiAgICAgIGRlZXAgPSB0YXJnZXQ7ICBcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1sxXSB8fCB7fTsgIFxuICAgICAgaSA9IDI7ICBcbiAgfTsgIFxuICBpZiAoIHR5cGVvZiB0YXJnZXQgIT09IFwib2JqZWN0XCIgJiYgIV8uaXNGdW5jdGlvbih0YXJnZXQpICkgeyAgXG4gICAgICB0YXJnZXQgPSB7fTsgIFxuICB9OyAgXG4gIGlmICggbGVuZ3RoID09PSBpICkgeyAgXG4gICAgICB0YXJnZXQgPSB0aGlzOyAgXG4gICAgICAtLWk7ICBcbiAgfTsgIFxuICBmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHsgIFxuICAgICAgaWYgKCAob3B0aW9ucyA9IGFyZ3VtZW50c1sgaSBdKSAhPSBudWxsICkgeyAgXG4gICAgICAgICAgZm9yICggbmFtZSBpbiBvcHRpb25zICkgeyAgXG4gICAgICAgICAgICAgIHNyYyA9IHRhcmdldFsgbmFtZSBdOyAgXG4gICAgICAgICAgICAgIGNvcHkgPSBvcHRpb25zWyBuYW1lIF07ICBcbiAgICAgICAgICAgICAgaWYgKCB0YXJnZXQgPT09IGNvcHkgKSB7ICBcbiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAgXG4gICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICBpZiAoIGRlZXAgJiYgY29weSAmJiAoIF8uaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBfLmlzQXJyYXkoY29weSkpICkgKSB7ICBcbiAgICAgICAgICAgICAgICAgIGlmICggY29weUlzQXJyYXkgKSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICBjb3B5SXNBcnJheSA9IGZhbHNlOyAgXG4gICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgXy5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTsgIFxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgIFxuICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIF8uaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307ICBcbiAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgdGFyZ2V0WyBuYW1lIF0gPSBfLmV4dGVuZCggZGVlcCwgY2xvbmUsIGNvcHkgKTsgIFxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBjb3B5ICE9PSB1bmRlZmluZWQgKSB7ICBcbiAgICAgICAgICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gY29weTsgIFxuICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICB9ICBcbiAgICAgIH0gIFxuICB9ICBcbiAgcmV0dXJuIHRhcmdldDsgIFxufTsgXG5fLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xufTtcbmV4cG9ydCBkZWZhdWx0IF87IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20gXG4qL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxudmFyIFV0aWxzID0ge1xuICAgIG1haW5GcmFtZVJhdGUgICA6IDYwLC8v6buY6K6k5Li75bin546HXG4gICAgbm93IDogMCxcbiAgICAvKuWDj+e0oOajgOa1i+S4k+eUqCovXG4gICAgX3BpeGVsQ3R4ICAgOiBudWxsLFxuICAgIF9fZW1wdHlGdW5jIDogZnVuY3Rpb24oKXt9LFxuICAgIC8vcmV0aW5hIOWxj+W5leS8mOWMllxuICAgIF9kZXZpY2VQaXhlbFJhdGlvIDogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICBfVUlEICA6IDAsIC8v6K+l5YC85Li65ZCR5LiK55qE6Ieq5aKe6ZW/5pW05pWw5YC8XG4gICAgZ2V0VUlEOmZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9VSUQrKztcbiAgICB9LFxuICAgIGNyZWF0ZUlkIDogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAvL2lmIGVuZCB3aXRoIGEgZGlnaXQsIHRoZW4gYXBwZW5kIGFuIHVuZGVyc0Jhc2UgYmVmb3JlIGFwcGVuZGluZ1xuICAgICAgICB2YXIgY2hhckNvZGUgPSBuYW1lLmNoYXJDb2RlQXQobmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKGNoYXJDb2RlID49IDQ4ICYmIGNoYXJDb2RlIDw9IDU3KSBuYW1lICs9IFwiX1wiO1xuICAgICAgICByZXR1cm4gbmFtZSArIFV0aWxzLmdldFVJRCgpO1xuICAgIH0sXG4gICAgY2FudmFzU3VwcG9ydCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0O1xuICAgIH0sXG4gICAgY3JlYXRlT2JqZWN0IDogZnVuY3Rpb24oIHByb3RvICwgY29uc3RydWN0b3IgKSB7XG4gICAgICAgIHZhciBuZXdQcm90bztcbiAgICAgICAgdmFyIE9iamVjdENyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG4gICAgICAgIGlmIChPYmplY3RDcmVhdGUpIHtcbiAgICAgICAgICAgIG5ld1Byb3RvID0gT2JqZWN0Q3JlYXRlKHByb3RvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFV0aWxzLl9fZW1wdHlGdW5jLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgICAgICAgbmV3UHJvdG8gPSBuZXcgVXRpbHMuX19lbXB0eUZ1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdQcm90by5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3UHJvdG87XG4gICAgfSxcbiAgICBzZXRDb250ZXh0U3R5bGUgOiBmdW5jdGlvbiggY3R4ICwgc3R5bGUgKXtcbiAgICAgICAgLy8g566A5Y2V5Yik5pat5LiN5YGa5Lil5qC857G75Z6L5qOA5rWLXG4gICAgICAgIGZvcih2YXIgcCBpbiBzdHlsZSl7XG4gICAgICAgICAgICBpZiggcCAhPSBcInRleHRCYXNlbGluZVwiICYmICggcCBpbiBjdHggKSApe1xuICAgICAgICAgICAgICAgIGlmICggc3R5bGVbcF0gfHwgXy5pc051bWJlciggc3R5bGVbcF0gKSApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHAgPT0gXCJnbG9iYWxBbHBoYVwiICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mAj+aYjuW6puimgeS7jueItuiKgueCuee7p+aJv1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdICo9IHN0eWxlW3BdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gc3R5bGVbcF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybjtcbiAgICB9LFxuICAgIGNyZWF0Q2xhc3MgOiBmdW5jdGlvbihyLCBzLCBweCl7XG4gICAgICAgIGlmICghcyB8fCAhcikge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNwID0gcy5wcm90b3R5cGUsIHJwO1xuICAgICAgICAvLyBhZGQgcHJvdG90eXBlIGNoYWluXG4gICAgICAgIHJwID0gVXRpbHMuY3JlYXRlT2JqZWN0KHNwLCByKTtcbiAgICAgICAgci5wcm90b3R5cGUgPSBfLmV4dGVuZChycCwgci5wcm90b3R5cGUpO1xuICAgICAgICByLnN1cGVyY2xhc3MgPSBVdGlscy5jcmVhdGVPYmplY3Qoc3AsIHMpO1xuICAgICAgICAvLyBhZGQgcHJvdG90eXBlIG92ZXJyaWRlc1xuICAgICAgICBpZiAocHgpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHJwLCBweCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfSxcbiAgICBpbml0RWxlbWVudCA6IGZ1bmN0aW9uKCBjYW52YXMgKXtcbiAgICAgICAgaWYoIHdpbmRvdy5GbGFzaENhbnZhcyAmJiBGbGFzaENhbnZhcy5pbml0RWxlbWVudCl7XG4gICAgICAgICAgICBGbGFzaENhbnZhcy5pbml0RWxlbWVudCggY2FudmFzICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5YGa5LiA5qyh566A5Y2V55qEb3B05Y+C5pWw5qCh6aqM77yM5L+d6K+B5Zyo55So5oi35LiN5Lygb3B055qE5pe25YCZIOaIluiAheS8oOS6hm9wdOS9huaYr+mHjOmdouayoeaciWNvbnRleHTnmoTml7blgJnmiqXplJlcbiAgICBjaGVja09wdCAgICA6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgIGlmKCAhb3B0ICl7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRleHQgOiB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9ICAgXG4gICAgICAgIH0gZWxzZSBpZiggb3B0ICYmICFvcHQuY29udGV4dCApIHtcbiAgICAgICAgICBvcHQuY29udGV4dCA9IHt9XG4gICAgICAgICAgcmV0dXJuIG9wdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb3B0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFxuICAgIC8qKlxuICAgICAqIOaMieeFp2Nzc+eahOmhuuW6j++8jOi/lOWbnuS4gOS4qlvkuIos5Y+zLOS4iyzlt6ZdXG4gICAgICovXG4gICAgZ2V0Q3NzT3JkZXJBcnIgOiBmdW5jdGlvbiggciApe1xuICAgICAgICB2YXIgcjE7IFxuICAgICAgICB2YXIgcjI7IFxuICAgICAgICB2YXIgcjM7IFxuICAgICAgICB2YXIgcjQ7XG5cbiAgICAgICAgaWYodHlwZW9mIHIgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IHI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihyIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHIxID0gcjIgPSByMyA9IHI0ID0gclswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoci5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICByMSA9IHIzID0gclswXTtcbiAgICAgICAgICAgICAgICByMiA9IHI0ID0gclsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoci5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICByMSA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByNCA9IHJbMV07XG4gICAgICAgICAgICAgICAgcjMgPSByWzJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByMSA9IHJbMF07XG4gICAgICAgICAgICAgICAgcjIgPSByWzFdO1xuICAgICAgICAgICAgICAgIHIzID0gclsyXTtcbiAgICAgICAgICAgICAgICByNCA9IHJbM107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByMSA9IHIyID0gcjMgPSByNCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtyMSxyMixyMyxyNF07XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVXRpbHM7IiwiLyoqXG4gKiBQb2ludFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCx5KXtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoPT0xICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT0gJ29iamVjdCcgKXtcbiAgICAgICB2YXIgYXJnPWFyZ3VtZW50c1swXVxuICAgICAgIGlmKCBcInhcIiBpbiBhcmcgJiYgXCJ5XCIgaW4gYXJnICl7XG4gICAgICAgICAgdGhpcy54ID0gYXJnLngqMTtcbiAgICAgICAgICB0aGlzLnkgPSBhcmcueSoxO1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGk9MDtcbiAgICAgICAgICBmb3IgKHZhciBwIGluIGFyZyl7XG4gICAgICAgICAgICAgIGlmKGk9PTApe1xuICAgICAgICAgICAgICAgIHRoaXMueCA9IGFyZ1twXSoxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFyZ1twXSoxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgeCB8fCAoeD0wKTtcbiAgICB5IHx8ICh5PTApO1xuICAgIHRoaXMueCA9IHgqMTtcbiAgICB0aGlzLnkgPSB5KjE7XG59O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiBjYW52YXMg5LiK5aeU5omY55qE5LqL5Lu2566h55CGXG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbnZhciBDYW52YXhFdmVudCA9IGZ1bmN0aW9uKCBldnQgLCBwYXJhbXMgKSB7XG5cdFxuXHR2YXIgZXZlbnRUeXBlID0gXCJDYW52YXhFdmVudFwiOyBcbiAgICBpZiggXy5pc1N0cmluZyggZXZ0ICkgKXtcbiAgICBcdGV2ZW50VHlwZSA9IGV2dDtcbiAgICB9O1xuICAgIGlmKCBfLmlzT2JqZWN0KCBldnQgKSAmJiBldnQudHlwZSApe1xuICAgIFx0ZXZlbnRUeXBlID0gZXZ0LnR5cGU7XG4gICAgfTtcblxuICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1x0XG4gICAgdGhpcy50eXBlICAgPSBldmVudFR5cGU7XG4gICAgdGhpcy5wb2ludCAgPSBudWxsO1xuXG4gICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uID0gZmFsc2UgOyAvL+m7mOiupOS4jemYu+atouS6i+S7tuWGkuazoVxufVxuQ2FudmF4RXZlbnQucHJvdG90eXBlID0ge1xuICAgIHN0b3BQcm9wYWdhdGlvbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IENhbnZheEV2ZW50OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICAvL+iuvuWkh+WIhui+qOeOh1xuICAgIFJFU09MVVRJT046IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG5cbiAgICAvL+a4suafk0ZQU1xuICAgIEZQUzogNjBcbn07XG4iLCJpbXBvcnQgXyBmcm9tIFwiLi91bmRlcnNjb3JlXCI7XG5pbXBvcnQgc2V0dGluZ3MgZnJvbSBcIi4uL3NldHRpbmdzXCJcblxudmFyIGFkZE9yUm1vdmVFdmVudEhhbmQgPSBmdW5jdGlvbiggZG9tSGFuZCAsIGllSGFuZCApe1xuICAgIGlmKCBkb2N1bWVudFsgZG9tSGFuZCBdICl7XG4gICAgICAgIGZ1bmN0aW9uIGV2ZW50RG9tRm4oIGVsICwgdHlwZSAsIGZuICl7XG4gICAgICAgICAgICBpZiggZWwubGVuZ3RoICl7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTAgOyBpIDwgZWwubGVuZ3RoIDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnREb21GbiggZWxbaV0gLCB0eXBlICwgZm4gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsWyBkb21IYW5kIF0oIHR5cGUgLCBmbiAsIGZhbHNlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBldmVudERvbUZuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZnVuY3Rpb24gZXZlbnRGbiggZWwgLCB0eXBlICwgZm4gKXtcbiAgICAgICAgICAgIGlmKCBlbC5sZW5ndGggKXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MCA7IGkgPCBlbC5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBldmVudEZuKCBlbFtpXSx0eXBlLGZuICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbFsgaWVIYW5kIF0oIFwib25cIit0eXBlICwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwoIGVsICwgd2luZG93LmV2ZW50ICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBldmVudEZuXG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8vIGRvbeaTjeS9nOebuOWFs+S7o+eggVxuICAgIHF1ZXJ5IDogZnVuY3Rpb24oZWwpe1xuICAgICAgICBpZihfLmlzU3RyaW5nKGVsKSl7XG4gICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbClcbiAgICAgICAgfVxuICAgICAgICBpZihlbC5ub2RlVHlwZSA9PSAxKXtcbiAgICAgICAgICAgLy/liJnkuLrkuIDkuKplbGVtZW505pys6LqrXG4gICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9XG4gICAgICAgIGlmKGVsLmxlbmd0aCl7XG4gICAgICAgICAgIHJldHVybiBlbFswXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgb2Zmc2V0IDogZnVuY3Rpb24oZWwpe1xuICAgICAgICB2YXIgYm94ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIFxuICAgICAgICBkb2MgPSBlbC5vd25lckRvY3VtZW50LCBcbiAgICAgICAgYm9keSA9IGRvYy5ib2R5LCBcbiAgICAgICAgZG9jRWxlbSA9IGRvYy5kb2N1bWVudEVsZW1lbnQsIFxuXG4gICAgICAgIC8vIGZvciBpZSAgXG4gICAgICAgIGNsaWVudFRvcCA9IGRvY0VsZW0uY2xpZW50VG9wIHx8IGJvZHkuY2xpZW50VG9wIHx8IDAsIFxuICAgICAgICBjbGllbnRMZWZ0ID0gZG9jRWxlbS5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwLCBcblxuICAgICAgICAvLyBJbiBJbnRlcm5ldCBFeHBsb3JlciA3IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBwcm9wZXJ0eSBpcyB0cmVhdGVkIGFzIHBoeXNpY2FsLCBcbiAgICAgICAgLy8gd2hpbGUgb3RoZXJzIGFyZSBsb2dpY2FsLiBNYWtlIGFsbCBsb2dpY2FsLCBsaWtlIGluIElFOC4gXG4gICAgICAgIHpvb20gPSAxOyBcbiAgICAgICAgaWYgKGJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7IFxuICAgICAgICAgICAgdmFyIGJvdW5kID0gYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgXG4gICAgICAgICAgICB6b29tID0gKGJvdW5kLnJpZ2h0IC0gYm91bmQubGVmdCkvYm9keS5jbGllbnRXaWR0aDsgXG4gICAgICAgIH0gXG4gICAgICAgIGlmICh6b29tID4gMSl7IFxuICAgICAgICAgICAgY2xpZW50VG9wID0gMDsgXG4gICAgICAgICAgICBjbGllbnRMZWZ0ID0gMDsgXG4gICAgICAgIH0gXG4gICAgICAgIHZhciB0b3AgPSBib3gudG9wL3pvb20gKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5zY3JvbGxUb3Avem9vbSB8fCBib2R5LnNjcm9sbFRvcC96b29tKSAtIGNsaWVudFRvcCwgXG4gICAgICAgICAgICBsZWZ0ID0gYm94LmxlZnQvem9vbSArICh3aW5kb3cucGFnZVhPZmZzZXR8fCBkb2NFbGVtICYmIGRvY0VsZW0uc2Nyb2xsTGVmdC96b29tIHx8IGJvZHkuc2Nyb2xsTGVmdC96b29tKSAtIGNsaWVudExlZnQ7IFxuXG4gICAgICAgIHJldHVybiB7IFxuICAgICAgICAgICAgdG9wOiB0b3AsIFxuICAgICAgICAgICAgbGVmdDogbGVmdCBcbiAgICAgICAgfTsgXG4gICAgfSxcbiAgICBhZGRFdmVudCA6IGFkZE9yUm1vdmVFdmVudEhhbmQoIFwiYWRkRXZlbnRMaXN0ZW5lclwiICwgXCJhdHRhY2hFdmVudFwiICksXG4gICAgcmVtb3ZlRXZlbnQgOiBhZGRPclJtb3ZlRXZlbnRIYW5kKCBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiAsIFwiZGV0YWNoRXZlbnRcIiApLFxuICAgIHBhZ2VYOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnBhZ2VYKSByZXR1cm4gZS5wYWdlWDtcbiAgICAgICAgZWxzZSBpZiAoZS5jbGllbnRYKVxuICAgICAgICAgICAgcmV0dXJuIGUuY2xpZW50WCArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCA/XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IDogZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0KTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHBhZ2VZOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnBhZ2VZKSByZXR1cm4gZS5wYWdlWTtcbiAgICAgICAgZWxzZSBpZiAoZS5jbGllbnRZKVxuICAgICAgICAgICAgcmV0dXJuIGUuY2xpZW50WSArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA6IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIm+W7umRvbVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBkb20gaWQg5b6F55SoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgOiBkb20gdHlwZe+8jCBzdWNoIGFzIGNhbnZhcywgZGl2IGV0Yy5cbiAgICAgKi9cbiAgICBjcmVhdGVDYW52YXMgOiBmdW5jdGlvbiggX3dpZHRoICwgX2hlaWdodCAsIGlkKSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggID0gX3dpZHRoICsgJ3B4JztcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IF9oZWlnaHQgKyAncHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUubGVmdCAgID0gMDtcbiAgICAgICAgY2FudmFzLnN0eWxlLnRvcCAgICA9IDA7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgX3dpZHRoICogc2V0dGluZ3MuUkVTT0xVVElPTik7XG4gICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIF9oZWlnaHQgKiBzZXR0aW5ncy5SRVNPTFVUSU9OKTtcbiAgICAgICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfSxcbiAgICBjcmVhdGVWaWV3OiBmdW5jdGlvbihfd2lkdGggLCBfaGVpZ2h0LCBpZCl7XG4gICAgICAgIHZhciB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmlldy5jbGFzc05hbWUgPSBcImNhbnZheC12aWV3XCI7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgdmFyIHN0YWdlX2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2aWV3LnN0eWxlLmNzc1RleHQgKz0gXCJwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpcIiArIF93aWR0aCArIFwicHg7aGVpZ2h0OlwiICsgX2hlaWdodCArXCJweDtcIlxuXG4gICAgICAgIC8v55So5p2l5a2Y5pS+5LiA5LqbZG9t5YWD57SgXG4gICAgICAgIHZhciBkb21fYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZpZXcuc3R5bGUuY3NzVGV4dCArPSBcInBvc2l0aW9uOmFic29sdXRlO3dpZHRoOlwiICsgX3dpZHRoICsgXCJweDtoZWlnaHQ6XCIgKyBfaGVpZ2h0ICtcInB4O1wiXG5cbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZChzdGFnZV9jKTtcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZChkb21fYyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmlldyA6IHZpZXcsXG4gICAgICAgICAgICBzdGFnZV9jOiBzdGFnZV9jLFxuICAgICAgICAgICAgZG9tX2M6IGRvbV9jXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy9kb23nm7jlhbPku6PnoIHnu5PmnZ9cbn07IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICovXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL2Rpc3BsYXkvUG9pbnRcIjtcbmltcG9ydCBDYW52YXhFdmVudCBmcm9tIFwiLi9DYW52YXhFdmVudFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCAkIGZyb20gXCIuLi91dGlscy9kb21cIjtcblxudmFyIF9tb3VzZUV2ZW50VHlwZXMgPSBbXCJjbGlja1wiLFwiZGJsY2xpY2tcIixcIm1vdXNlZG93blwiLFwibW91c2Vtb3ZlXCIsXCJtb3VzZXVwXCIsXCJtb3VzZW91dFwiXTtcbnZhciBfaGFtbWVyRXZlbnRUeXBlcyA9IFsgXG4gICAgXCJwYW5cIixcInBhbnN0YXJ0XCIsXCJwYW5tb3ZlXCIsXCJwYW5lbmRcIixcInBhbmNhbmNlbFwiLFwicGFubGVmdFwiLFwicGFucmlnaHRcIixcInBhbnVwXCIsXCJwYW5kb3duXCIsXG4gICAgXCJwcmVzc1wiICwgXCJwcmVzc3VwXCIsXG4gICAgXCJzd2lwZVwiICwgXCJzd2lwZWxlZnRcIiAsIFwic3dpcGVyaWdodFwiICwgXCJzd2lwZXVwXCIgLCBcInN3aXBlZG93blwiLFxuICAgIFwidGFwXCJcbl07XG5cbnZhciBFdmVudEhhbmRsZXIgPSBmdW5jdGlvbihjYW52YXggLCBvcHQpIHtcbiAgICB0aGlzLmNhbnZheCA9IGNhbnZheDtcblxuICAgIHRoaXMuY3VyUG9pbnRzID0gW25ldyBQb2ludCgwLCAwKV0gLy9YLFkg55qEIHBvaW50IOmbhuWQiCwg5ZyodG91Y2jkuIvpnaLliJnkuLogdG91Y2jnmoTpm4blkIjvvIzlj6rmmK/ov5nkuKp0b3VjaOiiq+a3u+WKoOS6huWvueW6lOeahHjvvIx5XG4gICAgLy/lvZPliY3mv4DmtLvnmoTngrnlr7nlupTnmoRvYmrvvIzlnKh0b3VjaOS4i+WPr+S7peaYr+S4quaVsOe7hCzlkozkuIrpnaLnmoQgY3VyUG9pbnRzIOWvueW6lFxuICAgIHRoaXMuY3VyUG9pbnRzVGFyZ2V0ID0gW107XG5cbiAgICB0aGlzLl90b3VjaGluZyA9IGZhbHNlO1xuICAgIC8v5q2j5Zyo5ouW5Yqo77yM5YmN5o+Q5pivX3RvdWNoaW5nPXRydWVcbiAgICB0aGlzLl9kcmFnaW5nID0gZmFsc2U7XG5cbiAgICAvL+W9k+WJjeeahOm8oOagh+eKtuaAgVxuICAgIHRoaXMuX2N1cnNvciA9IFwiZGVmYXVsdFwiO1xuXG4gICAgdGhpcy50YXJnZXQgPSB0aGlzLmNhbnZheC52aWV3O1xuICAgIHRoaXMudHlwZXMgPSBbXTtcblxuICAgIC8vbW91c2XkvZPnu5/kuK3kuI3pnIDopoHphY3nva5kcmFnLHRvdWNo5Lit5Lya55So5Yiw56ys5LiJ5pa555qEdG91Y2jlupPvvIzmr4/kuKrlupPnmoTkuovku7blkI3np7Dlj6/og73kuI3kuIDmoLfvvIxcbiAgICAvL+Wwseimgei/memHjOmFjee9ru+8jOm7mOiupOWunueOsOeahOaYr2hhbW1lcmpz55qELOaJgOS7pem7mOiupOWPr+S7peWcqOmhueebrumHjOW8leWFpWhhbW1lcmpzIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gICAgdGhpcy5kcmFnID0ge1xuICAgICAgICBzdGFydCA6IFwicGFuc3RhcnRcIixcbiAgICAgICAgbW92ZSA6IFwicGFubW92ZVwiLFxuICAgICAgICBlbmQgOiBcInBhbmVuZFwiXG4gICAgfTtcblxuICAgIF8uZXh0ZW5kKCB0cnVlICwgdGhpcyAsIG9wdCApO1xuXG59O1xuXG4vL+i/meagt+eahOWlveWkhOaYr2RvY3VtZW50LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9u5Y+q5Lya5Zyo5a6a5LmJ55qE5pe25YCZ5omn6KGM5LiA5qyh44CCXG52YXIgY29udGFpbnMgPSBkb2N1bWVudC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiA/IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhIShwYXJlbnQuY29tcGFyZURvY3VtZW50UG9zaXRpb24oY2hpbGQpICYgMTYpO1xufSA6IGZ1bmN0aW9uIChwYXJlbnQsIGNoaWxkKSB7XG4gICAgaWYoICFjaGlsZCApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZCAhPT0gY2hpbGQgJiYgKHBhcmVudC5jb250YWlucyA/IHBhcmVudC5jb250YWlucyhjaGlsZCkgOiB0cnVlKTtcbn07XG5cbkV2ZW50SGFuZGxlci5wcm90b3R5cGUgPSB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICAvL+S+neasoea3u+WKoOS4iua1j+iniOWZqOeahOiHquW4puS6i+S7tuS+puWQrFxuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAvL+WmguaenHRhcmdldC5ub2RlVHlwZeayoeacieeahOivne+8jCDor7TmmI7or6V0YXJnZXTkuLrkuIDkuKpqUXVlcnnlr7nosaEgb3Iga2lzc3kg5a+56LGhb3IgaGFtbWVy5a+56LGhXG4gICAgICAgICAgICAvL+WNs+S4uuesrOS4ieaWueW6k++8jOmCo+S5iOWwseimgeWvueaOpeesrOS4ieaWueW6k+eahOS6i+S7tuezu+e7n+OAgum7mOiupOWunueOsGhhbW1lcueahOWkp+mDqOWIhuS6i+S7tuezu+e7n1xuICAgICAgICAgICAgaWYoICFtZS50eXBlcyB8fCBtZS50eXBlcy5sZW5ndGggPT0gMCAgKXtcbiAgICAgICAgICAgICAgICBtZS50eXBlcyA9IF9oYW1tZXJFdmVudFR5cGVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmKCBtZS50YXJnZXQubm9kZVR5cGUgPT0gMSApe1xuICAgICAgICAgICAgbWUudHlwZXMgPSBfbW91c2VFdmVudFR5cGVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIF8uZWFjaCggbWUudHlwZXMgLCBmdW5jdGlvbiggdHlwZSApe1xuICAgICAgICAgICAgLy/kuI3lho3lhbPlv4PmtY/op4jlmajnjq/looPmmK/lkKYgJ29udG91Y2hzdGFydCcgaW4gd2luZG93IFxuICAgICAgICAgICAgLy/ogIzmmK/nm7TmjqXlj6rnrqHkvKDnu5nkuovku7bmqKHlnZfnmoTmmK/kuIDkuKrljp/nlJ9kb23ov5jmmK8ganHlr7nosaEgb3IgaGFtbWVy5a+56LGh562JXG4gICAgICAgICAgICBpZiggbWUudGFyZ2V0Lm5vZGVUeXBlID09IDEgKXtcbiAgICAgICAgICAgICAgICAkLmFkZEV2ZW50KCBtZS50YXJnZXQgLCB0eXBlICwgZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgICAgICAgICAgICAgbWUuX19tb3VzZUhhbmRsZXIoIGUgKTtcbiAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lLnRhcmdldC5vbiggdHlwZSAsIGZ1bmN0aW9uKCBlICl7XG4gICAgICAgICAgICAgICAgICAgIG1lLl9fbGliSGFuZGxlciggZSApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSApO1xuICAgIH0sXG4gICAgLypcbiAgICAqIOWOn+eUn+S6i+S7tuezu+e7ny0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWJlZ2luXG4gICAgKiDpvKDmoIfkuovku7blpITnkIblh73mlbBcbiAgICAqKi9cbiAgICBfX21vdXNlSGFuZGxlciA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG5cbiAgICAgICAgcm9vdC51cGRhdGVWaWV3T2Zmc2V0KCk7XG4gICAgXG4gICAgICAgIG1lLmN1clBvaW50cyA9IFsgbmV3IFBvaW50KCBcbiAgICAgICAgICAgICQucGFnZVgoIGUgKSAtIHJvb3Qudmlld09mZnNldC5sZWZ0ICwgXG4gICAgICAgICAgICAkLnBhZ2VZKCBlICkgLSByb290LnZpZXdPZmZzZXQudG9wXG4gICAgICAgICldO1xuXG4gICAgICAgIC8v55CG6K665LiK5p2l6K+077yM6L+Z6YeM5ou/5YiwcG9pbnTkuoblkI7vvIzlsLHopoHorqHnrpfov5nkuKpwb2ludOWvueW6lOeahHRhcmdldOadpXB1c2jliLBjdXJQb2ludHNUYXJnZXTph4zvvIxcbiAgICAgICAgLy/kvYbmmK/lm6DkuLrlnKhkcmFn55qE5pe25YCZ5YW25a6e5piv5Y+v5Lul5LiN55So6K6h566X5a+55bqUdGFyZ2V055qE44CCXG4gICAgICAgIC8v5omA5Lul5pS+5Zyo5LqG5LiL6Z2i55qEbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoIGUgLCBjdXJNb3VzZVBvaW50ICk75bi46KeEbW91c2Vtb3Zl5Lit5omn6KGMXG5cbiAgICAgICAgdmFyIGN1ck1vdXNlUG9pbnQgID0gbWUuY3VyUG9pbnRzWzBdOyBcbiAgICAgICAgdmFyIGN1ck1vdXNlVGFyZ2V0ID0gbWUuY3VyUG9pbnRzVGFyZ2V0WzBdO1xuXG4gICAgICAgIC8v5qih5oufZHJhZyxtb3VzZW92ZXIsbW91c2VvdXQg6YOo5YiG5Luj56CBIGJlZ2luLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vbW91c2Vkb3du55qE5pe25YCZIOWmguaenCBjdXJNb3VzZVRhcmdldC5kcmFnRW5hYmxlZCDkuLp0cnVl44CC5bCx6KaB5byA5aeL5YeG5aSHZHJhZ+S6hlxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2Vkb3duXCIgKXtcbiAgICAgICAgICAgLy/lpoLmnpxjdXJUYXJnZXQg55qE5pWw57uE5Li656m65oiW6ICF56ys5LiA5Liq5Li6ZmFsc2Ug77yM77yM77yMXG4gICAgICAgICAgIGlmKCAhY3VyTW91c2VUYXJnZXQgKXtcbiAgICAgICAgICAgICB2YXIgb2JqID0gcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggY3VyTW91c2VQb2ludCAsIDEpWzBdO1xuICAgICAgICAgICAgIGlmKG9iail7XG4gICAgICAgICAgICAgICBtZS5jdXJQb2ludHNUYXJnZXQgPSBbIG9iaiBdO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfTtcbiAgICAgICAgICAgY3VyTW91c2VUYXJnZXQgPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG4gICAgICAgICAgIGlmICggY3VyTW91c2VUYXJnZXQgJiYgY3VyTW91c2VUYXJnZXQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgIC8v6byg5qCH5LqL5Lu25bey57uP5pG45Yiw5LqG5LiA5LiqXG4gICAgICAgICAgICAgICBtZS5fdG91Y2hpbmcgPSB0cnVlO1xuICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBlLnR5cGUgPT0gXCJtb3VzZXVwXCIgfHwgKGUudHlwZSA9PSBcIm1vdXNlb3V0XCIgJiYgIWNvbnRhaW5zKHJvb3QudmlldyAsIChlLnRvRWxlbWVudCB8fCBlLnJlbGF0ZWRUYXJnZXQpICkpICl7XG4gICAgICAgICAgICBpZihtZS5fZHJhZ2luZyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAvL+ivtOaYjuWImuWImuWcqOaLluWKqFxuICAgICAgICAgICAgICAgIG1lLl9kcmFnRW5kKCBlICwgY3VyTW91c2VUYXJnZXQgLCAwICk7XG4gICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuZmlyZShcImRyYWdlbmRcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX2RyYWdpbmcgID0gZmFsc2U7XG4gICAgICAgICAgICBtZS5fdG91Y2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggZS50eXBlID09IFwibW91c2VvdXRcIiApe1xuICAgICAgICAgICAgaWYoICFjb250YWlucyhyb290LnZpZXcgLCAoZS50b0VsZW1lbnQgfHwgZS5yZWxhdGVkVGFyZ2V0KSApICl7XG4gICAgICAgICAgICAgICAgbWUuX19nZXRjdXJQb2ludHNUYXJnZXQoZSAsIGN1ck1vdXNlUG9pbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICl7ICAvL3x8IGUudHlwZSA9PSBcIm1vdXNlZG93blwiICl7XG4gICAgICAgICAgICAvL+aLluWKqOi/h+eoi+S4reWwseS4jeWcqOWBmuWFtuS7lueahG1vdXNlb3ZlcuajgOa1i++8jGRyYWfkvJjlhYhcbiAgICAgICAgICAgIGlmKG1lLl90b3VjaGluZyAmJiBlLnR5cGUgPT0gXCJtb3VzZW1vdmVcIiAmJiBjdXJNb3VzZVRhcmdldCl7XG4gICAgICAgICAgICAgICAgLy/or7TmmI7mraPlnKjmi5bliqjllYpcbiAgICAgICAgICAgICAgICBpZighbWUuX2RyYWdpbmcpe1xuICAgICAgICAgICAgICAgICAgICAvL2JlZ2luIGRyYWdcbiAgICAgICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuZmlyZShcImRyYWdzdGFydFwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lhYjmiormnKzlsIrnu5npmpDol4/kuoZcbiAgICAgICAgICAgICAgICAgICAgY3VyTW91c2VUYXJnZXQuY29udGV4dC5nbG9iYWxBbHBoYSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIC8v54S25ZCO5YWL6ZqG5LiA5Liq5Ymv5pys5YiwYWN0aXZlU3RhZ2VcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9uZU9iamVjdCA9IG1lLl9jbG9uZTJob3ZlclN0YWdlKCBjdXJNb3VzZVRhcmdldCAsIDAgKTtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVPYmplY3QuY29udGV4dC5nbG9iYWxBbHBoYSA9IGN1ck1vdXNlVGFyZ2V0Ll9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2RyYWcgbW92ZSBpbmdcbiAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdNb3ZlSGFuZGVyKCBlICwgY3VyTW91c2VUYXJnZXQgLCAwICk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtZS5fZHJhZ2luZyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8v5bi46KeEbW91c2Vtb3Zl5qOA5rWLXG4gICAgICAgICAgICAgICAgLy9tb3Zl5LqL5Lu25Lit77yM6ZyA6KaB5LiN5YGc55qE5pCc57SidGFyZ2V077yM6L+Z5Liq5byA6ZSA5oy65aSn77yMXG4gICAgICAgICAgICAgICAgLy/lkI7nu63lj6/ku6XkvJjljJbvvIzliqDkuIrlkozluKfnjofnm7jlvZPnmoTlu7bov5/lpITnkIZcbiAgICAgICAgICAgICAgICBtZS5fX2dldGN1clBvaW50c1RhcmdldCggZSAsIGN1ck1vdXNlUG9pbnQgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/lhbbku5bnmoTkuovku7blsLHnm7TmjqXlnKh0YXJnZXTkuIrpnaLmtL7lj5Hkuovku7ZcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGN1ck1vdXNlVGFyZ2V0O1xuICAgICAgICAgICAgaWYoICFjaGlsZCApe1xuICAgICAgICAgICAgICAgIGNoaWxkID0gcm9vdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIFsgY2hpbGQgXSApO1xuICAgICAgICAgICAgbWUuX2N1cnNvckhhbmRlciggY2hpbGQgKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggcm9vdC5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgICAgIC8v6Zi75q2i6buY6K6k5rWP6KeI5Zmo5Yqo5L2cKFczQykgXG4gICAgICAgICAgICBpZiAoIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCApIHtcbiAgICAgICAgICAgICAgIMKgZS5wcmV2ZW50RGVmYXVsdCgpOyBcbiAgICAgICAgICAgIH3CoGVsc2Uge1xuICAgICAgICAgICAgwqDCoMKgwqB3aW5kb3cuZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTsgXG4gICAgfSxcbiAgICBfX2dldGN1clBvaW50c1RhcmdldCA6IGZ1bmN0aW9uKGUgLCBwb2ludCApIHtcbiAgICAgICAgdmFyIG1lICAgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ICAgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBvbGRPYmogPSBtZS5jdXJQb2ludHNUYXJnZXRbMF07XG5cbiAgICAgICAgaWYoIG9sZE9iaiAmJiAhb2xkT2JqLmNvbnRleHQgKXtcbiAgICAgICAgICAgIG9sZE9iaiA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGUgPSBuZXcgQ2FudmF4RXZlbnQoIGUgKTtcblxuICAgICAgICBpZiggZS50eXBlPT1cIm1vdXNlbW92ZVwiXG4gICAgICAgICAgICAmJiBvbGRPYmogJiYgb2xkT2JqLl9ob3ZlckNsYXNzICYmIG9sZE9iai5wb2ludENoa1ByaW9yaXR5XG4gICAgICAgICAgICAmJiBvbGRPYmouZ2V0Q2hpbGRJblBvaW50KCBwb2ludCApICl7XG4gICAgICAgICAgICAvL+Wwj+S8mOWMlizpvKDmoIdtb3Zl55qE5pe25YCZ44CC6K6h566X6aKR546H5aSq5aSn77yM5omA5Lul44CC5YGa5q2k5LyY5YyWXG4gICAgICAgICAgICAvL+WmguaenOaciXRhcmdldOWtmOWcqO+8jOiAjOS4lOW9k+WJjeWFg+e0oOato+WcqGhvdmVyU3RhZ2XkuK3vvIzogIzkuJTlvZPliY3pvKDmoIfov5jlnKh0YXJnZXTlhoUs5bCx5rKh5b+F6KaB5Y+W5qOA5rWL5pW05LiqZGlzcGxheUxpc3TkuoZcbiAgICAgICAgICAgIC8v5byA5Y+R5rS+5Y+R5bi46KeEbW91c2Vtb3Zl5LqL5Lu2XG4gICAgICAgICAgICBlLnRhcmdldCA9IGUuY3VycmVudFRhcmdldCA9IG9sZE9iajtcbiAgICAgICAgICAgIGUucG9pbnQgID0gb2xkT2JqLmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb2JqID0gcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggcG9pbnQgLCAxKVswXTtcblxuICAgICAgICBpZihvbGRPYmogJiYgb2xkT2JqICE9IG9iaiB8fCBlLnR5cGU9PVwibW91c2VvdXRcIikge1xuICAgICAgICAgICAgaWYoIG9sZE9iaiAmJiBvbGRPYmouY29udGV4dCApe1xuICAgICAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldFswXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZS50eXBlICAgICA9IFwibW91c2VvdXRcIjtcbiAgICAgICAgICAgICAgICBlLnRvVGFyZ2V0ID0gb2JqOyBcbiAgICAgICAgICAgICAgICBlLnRhcmdldCAgID0gZS5jdXJyZW50VGFyZ2V0ID0gb2xkT2JqO1xuICAgICAgICAgICAgICAgIGUucG9pbnQgICAgPSBvbGRPYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgICAgICBvbGRPYmouZGlzcGF0Y2hFdmVudCggZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmKCBvYmogJiYgb2xkT2JqICE9IG9iaiApeyAvLyYmIG9iai5faG92ZXJhYmxlIOW3sue7jyDlubLmjonkuoZcbiAgICAgICAgICAgIG1lLmN1clBvaW50c1RhcmdldFswXSA9IG9iajtcbiAgICAgICAgICAgIGUudHlwZSAgICAgICA9IFwibW91c2VvdmVyXCI7XG4gICAgICAgICAgICBlLmZyb21UYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICBlLnRhcmdldCAgICAgPSBlLmN1cnJlbnRUYXJnZXQgPSBvYmo7XG4gICAgICAgICAgICBlLnBvaW50ICAgICAgPSBvYmouZ2xvYmFsVG9Mb2NhbCggcG9pbnQgKTtcbiAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYoIGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiICYmIG9iaiApe1xuICAgICAgICAgICAgZS50YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgPSBvbGRPYmo7XG4gICAgICAgICAgICBlLnBvaW50ICA9IG9sZE9iai5nbG9iYWxUb0xvY2FsKCBwb2ludCApO1xuICAgICAgICAgICAgb2xkT2JqLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWUuX2N1cnNvckhhbmRlciggb2JqICwgb2xkT2JqICk7XG4gICAgfSxcbiAgICBfY3Vyc29ySGFuZGVyICAgIDogZnVuY3Rpb24oIG9iaiAsIG9sZE9iaiApe1xuICAgICAgICBpZighb2JqICYmICFvbGRPYmogKXtcbiAgICAgICAgICAgIHRoaXMuX3NldEN1cnNvcihcImRlZmF1bHRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYob2JqICYmIG9sZE9iaiAhPSBvYmogJiYgb2JqLmNvbnRleHQpe1xuICAgICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yKG9iai5jb250ZXh0LmN1cnNvcik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9zZXRDdXJzb3IgOiBmdW5jdGlvbihjdXJzb3IpIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yID09IGN1cnNvcil7XG4gICAgICAgICAgLy/lpoLmnpzkuKTmrKHopoHorr7nva7nmoTpvKDmoIfnirbmgIHmmK/kuIDmoLfnmoRcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmF4LnZpZXcuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xuICAgICAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgfSxcbiAgICAvKlxuICAgICog5Y6f55Sf5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZW5kXG4gICAgKi9cblxuICAgIC8qXG4gICAgICrnrKzkuInmlrnlupPnmoTkuovku7bns7vnu58tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1iZWdpblxuICAgICAq6Kem5bGP5LqL5Lu25aSE55CG5Ye95pWwXG4gICAgICogKi9cbiAgICBfX2xpYkhhbmRsZXIgOiBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgdmFyIG1lICAgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgcm9vdC51cGRhdGVWaWV3T2Zmc2V0KCk7XG4gICAgICAgIC8vIHRvdWNoIOS4i+eahCBjdXJQb2ludHNUYXJnZXQg5LuOdG91Y2hlc+S4readpVxuICAgICAgICAvL+iOt+WPlmNhbnZheOWdkOagh+ezu+e7n+mHjOmdoueahOWdkOagh1xuICAgICAgICBtZS5jdXJQb2ludHMgPSBtZS5fX2dldENhbnZheFBvaW50SW5Ub3VjaHMoIGUgKTtcbiAgICAgICAgaWYoICFtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgLy/lpoLmnpzlnKhkcmFnaW5n55qE6K+d77yMdGFyZ2V05bey57uP5piv6YCJ5Lit5LqG55qE77yM5Y+v5Lul5LiN55SoIOajgOa1i+S6hlxuICAgICAgICAgICAgbWUuY3VyUG9pbnRzVGFyZ2V0ID0gbWUuX19nZXRDaGlsZEluVG91Y2hzKCBtZS5jdXJQb2ludHMgKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIG1lLmN1clBvaW50c1RhcmdldC5sZW5ndGggPiAwICl7XG4gICAgICAgICAgICAvL2RyYWflvIDlp4tcbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5zdGFydCl7XG4gICAgICAgICAgICAgICAgLy9kcmFnc3RhcnTnmoTml7blgJl0b3VjaOW3sue7j+WHhuWkh+WlveS6hnRhcmdldO+8jCBjdXJQb2ludHNUYXJnZXQg6YeM6Z2i5Y+q6KaB5pyJ5LiA5Liq5piv5pyJ5pWI55qEXG4gICAgICAgICAgICAgICAgLy/lsLHorqTkuLpkcmFnc+W8gOWni1xuICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggY2hpbGQgJiYgY2hpbGQuZHJhZ0VuYWJsZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/lj6ropoHmnInkuIDkuKrlhYPntKDlsLHorqTkuLrmraPlnKjlh4blpIdkcmFn5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgLy/nhLblkI7lhYvpmobkuIDkuKrlia/mnKzliLBhY3RpdmVTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgICBtZS5fY2xvbmUyaG92ZXJTdGFnZSggY2hpbGQgLCBpICk7XG4gICAgICAgICAgICAgICAgICAgICAgIC8v5YWI5oqK5pys5bCK57uZ6ZqQ6JeP5LqGXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmZpcmUoXCJkcmFnc3RhcnRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApIFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy9kcmFnSW5nXG4gICAgICAgICAgICBpZiggZS50eXBlID09IG1lLmRyYWcubW92ZSl7XG4gICAgICAgICAgICAgICAgaWYoIG1lLl9kcmFnaW5nICl7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaCggbWUuY3VyUG9pbnRzVGFyZ2V0ICwgZnVuY3Rpb24oIGNoaWxkICwgaSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGNoaWxkICYmIGNoaWxkLmRyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5fZHJhZ01vdmVIYW5kZXIoIGUgLCBjaGlsZCAsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL2RyYWfnu5PmnZ9cbiAgICAgICAgICAgIGlmKCBlLnR5cGUgPT0gbWUuZHJhZy5lbmQpe1xuICAgICAgICAgICAgICAgIGlmKCBtZS5fZHJhZ2luZyApe1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goIG1lLmN1clBvaW50c1RhcmdldCAsIGZ1bmN0aW9uKCBjaGlsZCAsIGkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBjaGlsZCAmJiBjaGlsZC5kcmFnRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLl9kcmFnRW5kKCBlICwgY2hpbGQgLCAwICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZmlyZShcImRyYWdlbmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgICAgICAgICAgbWUuX2RyYWdpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbWUuX19kaXNwYXRjaEV2ZW50SW5DaGlsZHMoIGUgLCBtZS5jdXJQb2ludHNUYXJnZXQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5b2T5YmN5rKh5pyJ5LiA5LiqdGFyZ2V077yM5bCx5oqK5LqL5Lu25rS+5Y+R5YiwY2FudmF45LiK6Z2iXG4gICAgICAgICAgICBtZS5fX2Rpc3BhdGNoRXZlbnRJbkNoaWxkcyggZSAsIFsgcm9vdCBdICk7XG4gICAgICAgIH07XG4gICAgfSxcbiAgICAvL+S7jnRvdWNoc+S4reiOt+WPluWIsOWvueW6lHRvdWNoICwg5Zyo5LiK6Z2i5re75Yqg5LiKY2FudmF45Z2Q5qCH57O757uf55qEeO+8jHlcbiAgICBfX2dldENhbnZheFBvaW50SW5Ub3VjaHMgOiBmdW5jdGlvbiggZSApe1xuICAgICAgICB2YXIgbWUgICAgICAgID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgICAgICA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIGN1clRvdWNocyA9IFtdO1xuICAgICAgICBfLmVhY2goIGUucG9pbnQgLCBmdW5jdGlvbiggdG91Y2ggKXtcbiAgICAgICAgICAgY3VyVG91Y2hzLnB1c2goIHtcbiAgICAgICAgICAgICAgIHggOiBDYW52YXhFdmVudC5wYWdlWCggdG91Y2ggKSAtIHJvb3Qudmlld09mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgeSA6IENhbnZheEV2ZW50LnBhZ2VZKCB0b3VjaCApIC0gcm9vdC52aWV3T2Zmc2V0LnRvcFxuICAgICAgICAgICB9ICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY3VyVG91Y2hzO1xuICAgIH0sXG4gICAgX19nZXRDaGlsZEluVG91Y2hzIDogZnVuY3Rpb24oIHRvdWNocyApe1xuICAgICAgICB2YXIgbWUgICA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuICAgICAgICB2YXIgdG91Y2hlc1RhcmdldCA9IFtdO1xuICAgICAgICBfLmVhY2goIHRvdWNocyAsIGZ1bmN0aW9uKHRvdWNoKXtcbiAgICAgICAgICAgIHRvdWNoZXNUYXJnZXQucHVzaCggcm9vdC5nZXRPYmplY3RzVW5kZXJQb2ludCggdG91Y2ggLCAxKVswXSApO1xuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybiB0b3VjaGVzVGFyZ2V0O1xuICAgIH0sXG4gICAgLypcbiAgICAq56ys5LiJ5pa55bqT55qE5LqL5Lu257O757ufLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYmVnaW5cbiAgICAqL1xuXG5cbiAgICAvKlxuICAgICAqQHBhcmFtIHthcnJheX0gY2hpbGRzIFxuICAgICAqICovXG4gICAgX19kaXNwYXRjaEV2ZW50SW5DaGlsZHM6IGZ1bmN0aW9uKGUsIGNoaWxkcykge1xuICAgICAgICBpZiAoIWNoaWxkcyAmJiAhKFwibGVuZ3RoXCIgaW4gY2hpbGRzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciBoYXNDaGlsZCA9IGZhbHNlO1xuICAgICAgICBfLmVhY2goY2hpbGRzLCBmdW5jdGlvbihjaGlsZCwgaSkge1xuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgaGFzQ2hpbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBjZSA9IG5ldyBDYW52YXhFdmVudChlKTtcbiAgICAgICAgICAgICAgICBjZS50YXJnZXQgPSBjZS5jdXJyZW50VGFyZ2V0ID0gY2hpbGQgfHwgdGhpcztcbiAgICAgICAgICAgICAgICBjZS5zdGFnZVBvaW50ID0gbWUuY3VyUG9pbnRzW2ldO1xuICAgICAgICAgICAgICAgIGNlLnBvaW50ID0gY2UudGFyZ2V0Lmdsb2JhbFRvTG9jYWwoY2Uuc3RhZ2VQb2ludCk7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGlzcGF0Y2hFdmVudChjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaGFzQ2hpbGQ7XG4gICAgfSxcbiAgICAvL+WFi+mahuS4gOS4quWFg+e0oOWIsGhvdmVyIHN0YWdl5Lit5Y67XG4gICAgX2Nsb25lMmhvdmVyU3RhZ2U6IGZ1bmN0aW9uKHRhcmdldCwgaSkge1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgcm9vdCA9IG1lLmNhbnZheDtcbiAgICAgICAgdmFyIF9kcmFnRHVwbGljYXRlID0gcm9vdC5fYnVmZmVyU3RhZ2UuZ2V0Q2hpbGRCeUlkKHRhcmdldC5pZCk7XG4gICAgICAgIGlmICghX2RyYWdEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgIF9kcmFnRHVwbGljYXRlID0gdGFyZ2V0LmNsb25lKHRydWUpO1xuICAgICAgICAgICAgX2RyYWdEdXBsaWNhdGUuX3RyYW5zZm9ybSA9IHRhcmdldC5nZXRDb25jYXRlbmF0ZWRNYXRyaXgoKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlRPRE86IOWboOS4uuWQjue7reWPr+iDveS8muacieaJi+WKqOa3u+WKoOeahCDlhYPntKDliLBfYnVmZmVyU3RhZ2Ug6YeM6Z2i5p2lXG4gICAgICAgICAgICAgKuavlOWmgnRpcHNcbiAgICAgICAgICAgICAq6L+Z57G75omL5Yqo5re75Yqg6L+b5p2l55qE6IKv5a6a5piv5Zug5Li66ZyA6KaB5pi+56S65Zyo5pyA5aSW5bGC55qE44CC5ZyoaG92ZXLlhYPntKDkuYvkuIrjgIJcbiAgICAgICAgICAgICAq5omA5pyJ6Ieq5Yqo5re75Yqg55qEaG92ZXLlhYPntKDpg73pu5jorqTmt7vliqDlnKhfYnVmZmVyU3RhZ2XnmoTmnIDlupXlsYJcbiAgICAgICAgICAgICAqKi9cbiAgICAgICAgICAgIHJvb3QuX2J1ZmZlclN0YWdlLmFkZENoaWxkQXQoX2RyYWdEdXBsaWNhdGUsIDApO1xuICAgICAgICB9XG4gICAgICAgIF9kcmFnRHVwbGljYXRlLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0YXJnZXQuX2dsb2JhbEFscGhhO1xuICAgICAgICB0YXJnZXQuX2RyYWdQb2ludCA9IHRhcmdldC5nbG9iYWxUb0xvY2FsKG1lLmN1clBvaW50c1tpXSk7XG4gICAgICAgIHJldHVybiBfZHJhZ0R1cGxpY2F0ZTtcbiAgICB9LFxuICAgIC8vZHJhZyDkuK0g55qE5aSE55CG5Ye95pWwXG4gICAgX2RyYWdNb3ZlSGFuZGVyOiBmdW5jdGlvbihlLCB0YXJnZXQsIGkpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJvb3QgPSBtZS5jYW52YXg7XG4gICAgICAgIHZhciBfcG9pbnQgPSB0YXJnZXQuZ2xvYmFsVG9Mb2NhbCggbWUuY3VyUG9pbnRzW2ldICk7XG5cbiAgICAgICAgLy/opoHlr7nlupTnmoTkv67mlLnmnKzlsIrnmoTkvY3nva7vvIzkvYbmmK/opoHlkYror4nlvJXmk47kuI3opoF3YXRjaOi/meS4quaXtuWAmeeahOWPmOWMllxuICAgICAgICB0YXJnZXQuX25vdFdhdGNoID0gdHJ1ZTtcbiAgICAgICAgdmFyIF9tb3ZlU3RhZ2UgPSB0YXJnZXQubW92ZWluZztcbiAgICAgICAgdGFyZ2V0Lm1vdmVpbmcgPSB0cnVlO1xuICAgICAgICB0YXJnZXQuY29udGV4dC54ICs9IChfcG9pbnQueCAtIHRhcmdldC5fZHJhZ1BvaW50LngpO1xuICAgICAgICB0YXJnZXQuY29udGV4dC55ICs9IChfcG9pbnQueSAtIHRhcmdldC5fZHJhZ1BvaW50LnkpO1xuICAgICAgICB0YXJnZXQuZmlyZShcImRyYWdtb3ZlXCIpO1xuICAgICAgICB0YXJnZXQubW92ZWluZyA9IF9tb3ZlU3RhZ2U7XG4gICAgICAgIHRhcmdldC5fbm90V2F0Y2ggPSBmYWxzZTtcbiAgICAgICAgLy/lkIzmraXlrozmr5XmnKzlsIrnmoTkvY3nva5cblxuICAgICAgICAvL+i/memHjOWPquiDveebtOaOpeS/ruaUuV90cmFuc2Zvcm0g44CCIOS4jeiDveeUqOS4i+mdoueahOS/ruaUuXjvvIx555qE5pa55byP44CCXG4gICAgICAgIHZhciBfZHJhZ0R1cGxpY2F0ZSA9IHJvb3QuX2J1ZmZlclN0YWdlLmdldENoaWxkQnlJZCh0YXJnZXQuaWQpO1xuICAgICAgICBfZHJhZ0R1cGxpY2F0ZS5fdHJhbnNmb3JtID0gdGFyZ2V0LmdldENvbmNhdGVuYXRlZE1hdHJpeCgpO1xuICAgICAgICAvL+S7peS4uuebtOaOpeS/ruaUueeahF90cmFuc2Zvcm3kuI3kvJrlh7rlj5Hlv4Pot7PkuIrmiqXvvIwg5riy5p+T5byV5pOO5LiN5Yi25Yqo6L+Z5Liqc3RhZ2XpnIDopoHnu5jliLbjgIJcbiAgICAgICAgLy/miYDku6XopoHmiYvliqjlh7rlj5Hlv4Pot7PljIVcbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuaGVhcnRCZWF0KCk7XG4gICAgfSxcbiAgICAvL2RyYWfnu5PmnZ/nmoTlpITnkIblh73mlbBcbiAgICBfZHJhZ0VuZDogZnVuY3Rpb24oZSwgdGFyZ2V0LCBpKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHZhciByb290ID0gbWUuY2FudmF4O1xuXG4gICAgICAgIC8vX2RyYWdEdXBsaWNhdGUg5aSN5Yi25ZyoX2J1ZmZlclN0YWdlIOS4reeahOWJr+acrFxuICAgICAgICB2YXIgX2RyYWdEdXBsaWNhdGUgPSByb290Ll9idWZmZXJTdGFnZS5nZXRDaGlsZEJ5SWQodGFyZ2V0LmlkKTtcbiAgICAgICAgX2RyYWdEdXBsaWNhdGUuZGVzdHJveSgpO1xuXG4gICAgICAgIHRhcmdldC5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGFyZ2V0Ll9nbG9iYWxBbHBoYTtcbiAgICB9XG59O1xuZXhwb3J0IGRlZmF1bHQgRXZlbnRIYW5kbGVyOyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS6i+S7tueuoeeQhuexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOaehOmAoOWHveaVsC5cbiAqIEBuYW1lIEV2ZW50RGlzcGF0Y2hlclxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlcuexu+aYr+WPr+iwg+W6puS6i+S7tueahOexu+eahOWfuuexu++8jOWug+WFgeiuuOaYvuekuuWIl+ihqOS4iueahOS7u+S9leWvueixoemDveaYr+S4gOS4quS6i+S7tuebruagh+OAglxuICovXG52YXIgRXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgLy/kuovku7bmmKDlsITooajvvIzmoLzlvI/kuLrvvJp7dHlwZTE6W2xpc3RlbmVyMSwgbGlzdGVuZXIyXSwgdHlwZTI6W2xpc3RlbmVyMywgbGlzdGVuZXI0XX1cbiAgICB0aGlzLl9ldmVudE1hcCA9IHt9O1xufTtcblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZSA9IHsgXG4gICAgLypcbiAgICAgKiDms6jlhozkuovku7bkvqblkKzlmajlr7nosaHvvIzku6Xkvb/kvqblkKzlmajog73lpJ/mjqXmlLbkuovku7bpgJrnn6XjgIJcbiAgICAgKi9cbiAgICBfYWRkRXZlbnRMaXN0ZW5lciA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG5cbiAgICAgICAgaWYoIHR5cGVvZiBsaXN0ZW5lciAhPSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgICAgICAvL2xpc3RlbmVy5b+F6aG75piv5LiqZnVuY3Rpb27lkZDkurJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFkZFJlc3VsdCA9IHRydWU7XG4gICAgICAgIHZhciBzZWxmICAgICAgPSB0aGlzO1xuICAgICAgICBfLmVhY2goIHR5cGUuc3BsaXQoXCIgXCIpICwgZnVuY3Rpb24odHlwZSl7XG4gICAgICAgICAgICB2YXIgbWFwID0gc2VsZi5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgICAgICBpZighbWFwKXtcbiAgICAgICAgICAgICAgICBtYXAgPSBzZWxmLl9ldmVudE1hcFt0eXBlXSA9IFtdO1xuICAgICAgICAgICAgICAgIG1hcC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9ldmVudEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihfLmluZGV4T2YobWFwICxsaXN0ZW5lcikgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBtYXAucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWRkUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYWRkUmVzdWx0O1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUV2ZW50TGlzdGVuZXIgOiBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDEpIHJldHVybiB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJCeVR5cGUodHlwZSk7XG5cbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuX2V2ZW50TWFwW3R5cGVdO1xuICAgICAgICBpZighbWFwKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaSA9IG1hcFtpXTtcbiAgICAgICAgICAgIGlmKGxpID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIG1hcC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaWYobWFwLmxlbmd0aCAgICA9PSAwKSB7IFxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgICAgICAgICAgICAgIC8v5aaC5p6c6L+Z5Liq5aaC5p6c6L+Z5Liq5pe25YCZY2hpbGTmsqHmnInku7vkvZXkuovku7bkvqblkKxcbiAgICAgICAgICAgICAgICAgICAgaWYoXy5pc0VtcHR5KHRoaXMuX2V2ZW50TWFwKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOS4jeWGjeaOpeWPl+S6i+S7tueahOajgOa1i1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIOWIoOmZpOaMh+Wumuexu+Wei+eahOaJgOacieS6i+S7tuS+puWQrOWZqOOAglxuICAgICAqL1xuICAgIF9yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlIDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIGlmKCFtYXApIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudE1hcFt0eXBlXTtcblxuICAgICAgICAgICAgLy/lpoLmnpzov5nkuKrlpoLmnpzov5nkuKrml7blgJljaGlsZOayoeacieS7u+S9leS6i+S7tuS+puWQrFxuICAgICAgICAgICAgaWYoXy5pc0VtcHR5KHRoaXMuX2V2ZW50TWFwKSl7XG4gICAgICAgICAgICAgICAgLy/pgqPkuYjor6XlhYPntKDkuI3lho3mjqXlj5fkuovku7bnmoTmo4DmtYtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Yig6Zmk5omA5pyJ5LqL5Lu25L6m5ZCs5Zmo44CCXG4gICAgICovXG4gICAgX3JlbW92ZUFsbEV2ZW50TGlzdGVuZXJzIDogZnVuY3Rpb24oKSB7XHRcbiAgICAgICAgdGhpcy5fZXZlbnRNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgfSxcbiAgICAvKipcbiAgICAqIOa0vuWPkeS6i+S7tu+8jOiwg+eUqOS6i+S7tuS+puWQrOWZqOOAglxuICAgICovXG4gICAgX2Rpc3BhdGNoRXZlbnQgOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBtYXAgPSB0aGlzLl9ldmVudE1hcFtlLnR5cGVdO1xuICAgICAgICBcbiAgICAgICAgaWYoIG1hcCApe1xuICAgICAgICAgICAgaWYoIWUudGFyZ2V0KSBlLnRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBtYXAgPSBtYXAuc2xpY2UoKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IG1hcFtpXTtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YobGlzdGVuZXIpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCAhZS5fc3RvcFByb3BhZ2F0aW9uICkge1xuICAgICAgICAgICAgLy/lkJHkuIrlhpLms6FcbiAgICAgICAgICAgIGlmKCB0aGlzLnBhcmVudCApe1xuICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldCA9IHRoaXMucGFyZW50O1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Ll9kaXNwYXRjaEV2ZW50KCBlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICAgKiDmo4Dmn6XmmK/lkKbkuLrmjIflrprkuovku7bnsbvlnovms6jlhozkuobku7vkvZXkvqblkKzlmajjgIJcbiAgICAgICAqL1xuICAgIF9oYXNFdmVudExpc3RlbmVyIDogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5fZXZlbnRNYXBbdHlwZV07XG4gICAgICAgIHJldHVybiBtYXAgIT0gbnVsbCAmJiBtYXAubGVuZ3RoID4gMDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50TWFuYWdlcjtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOS6i+S7tua0vuWPkeexu1xuICovXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuL0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IENhbnZheEV2ZW50IGZyb20gXCIuL0NhbnZheEV2ZW50XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG5cbnZhciBFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbigpe1xuICAgIEV2ZW50RGlzcGF0Y2hlci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbmFtZSk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKEV2ZW50RGlzcGF0Y2hlciAsIEV2ZW50TWFuYWdlciAsIHtcbiAgICBvbiA6IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFkZEV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpe1xuICAgICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdW4gOiBmdW5jdGlvbih0eXBlLGxpc3RlbmVyKXtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXI6ZnVuY3Rpb24odHlwZSxsaXN0ZW5lcil7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlOmZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlKCB0eXBlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW1vdmVBbGxFdmVudExpc3RlbmVyczpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9yZW1vdmVBbGxFdmVudExpc3RlbmVycygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy9wYXJhbXMg6KaB5Lyg57uZZXZ055qEZXZlbnRoYW5kbGVy5aSE55CG5Ye95pWw55qE5Y+C5pWw77yM5Lya6KKrbWVyZ2XliLBDYW52YXggZXZlbnTkuK1cbiAgICBmaXJlIDogZnVuY3Rpb24oZXZlbnRUeXBlICwgcGFyYW1zKXtcbiAgICAgICAgdmFyIGUgPSBuZXcgQ2FudmF4RXZlbnQoIGV2ZW50VHlwZSApO1xuXG4gICAgICAgIGlmKCBwYXJhbXMgKXtcbiAgICAgICAgICAgIGZvciggdmFyIHAgaW4gcGFyYW1zICl7XG4gICAgICAgICAgICAgICAgaWYoIHAgaW4gZSApe1xuICAgICAgICAgICAgICAgICAgICAvL3BhcmFtc+S4reeahOaVsOaNruS4jeiDveimhueblmV2ZW505bGe5oCnXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBwICsgXCLlsZ7mgKfkuI3og73opobnm5ZDYW52YXhFdmVudOWxnuaAp1wiIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlW3BdID0gcGFyYW1zW3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICBfLmVhY2goIGV2ZW50VHlwZS5zcGxpdChcIiBcIikgLCBmdW5jdGlvbihlVHlwZSl7XG4gICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQgPSBtZTtcbiAgICAgICAgICAgIG1lLmRpc3BhdGNoRXZlbnQoIGUgKTtcbiAgICAgICAgfSApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGRpc3BhdGNoRXZlbnQ6ZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAvL3RoaXMgaW5zdGFuY2VvZiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID09PiB0aGlzLmNoaWxkcmVuXG4gICAgICAgIC8vVE9ETzog6L+Z6YeMaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIg55qE6K+d77yM5ZyoZGlzcGxheU9iamVjdOmHjOmdoueahGltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4uL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuICAgICAgICAvL+S8muW+l+WIsOS4gOS4qnVuZGVmaW5lZO+8jOaEn+inieaYr+aIkOS6huS4gOS4quW+queOr+S+nei1lueahOmXrumimO+8jOaJgOS7pei/memHjOaNoueUqOeugOWNleeahOWIpOaWreadpeWIpOaWreiHquW3seaYr+S4gOS4quWuueaYk++8jOaLpeaciWNoaWxkcmVuXG4gICAgICAgIGlmKCB0aGlzLmNoaWxkcmVuICAmJiBldmVudC5wb2ludCApe1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIGV2ZW50LnBvaW50ICwgMSlbMF07XG4gICAgICAgICAgICBpZiggdGFyZ2V0ICl7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmNvbnRleHQgJiYgZXZlbnQudHlwZSA9PSBcIm1vdXNlb3ZlclwiKXtcbiAgICAgICAgICAgIC8v6K6w5b2VZGlzcGF0Y2hFdmVudOS5i+WJjeeahOW/g+i3s1xuICAgICAgICAgICAgdmFyIHByZUhlYXJ0QmVhdCA9IHRoaXMuX2hlYXJ0QmVhdE51bTtcbiAgICAgICAgICAgIHZhciBwcmVnQWxwaGEgICAgPSB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuICAgICAgICAgICAgaWYoIHByZUhlYXJ0QmVhdCAhPSB0aGlzLl9oZWFydEJlYXROdW0gKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3ZlckNsYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5ob3ZlckNsb25lICl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW52YXggPSB0aGlzLmdldFN0YWdlKCkucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAvL+eEtuWQjmNsb25l5LiA5Lu9b2Jq77yM5re75Yqg5YiwX2J1ZmZlclN0YWdlIOS4rVxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZTaGFwZSA9IHRoaXMuY2xvbmUodHJ1ZSk7ICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2U2hhcGUuX3RyYW5zZm9ybSA9IHRoaXMuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZheC5fYnVmZmVyU3RhZ2UuYWRkQ2hpbGRBdCggYWN0aXZTaGFwZSAsIDAgKTsgXG4gICAgICAgICAgICAgICAgICAgIC8v54S25ZCO5oqK6Ieq5bex6ZqQ6JeP5LqGXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dsb2JhbEFscGhhID0gcHJlZ0FscGhhO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuXG4gICAgICAgIGlmKCB0aGlzLmNvbnRleHQgJiYgZXZlbnQudHlwZSA9PSBcIm1vdXNlb3V0XCIpe1xuICAgICAgICAgICAgaWYodGhpcy5faG92ZXJDbGFzcyl7XG4gICAgICAgICAgICAgICAgLy/or7TmmI7liJrliJpvdmVy55qE5pe25YCZ5pyJ5re75Yqg5qC35byPXG4gICAgICAgICAgICAgICAgdmFyIGNhbnZheCA9IHRoaXMuZ2V0U3RhZ2UoKS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5faG92ZXJDbGFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbnZheC5fYnVmZmVyU3RhZ2UucmVtb3ZlQ2hpbGRCeUlkKHRoaXMuaWQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCB0aGlzLl9nbG9iYWxBbHBoYSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLl9nbG9iYWxBbHBoYTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2dsb2JhbEFscGhhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGFzRXZlbnQ6ZnVuY3Rpb24odHlwZSl7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgIH0sXG4gICAgaGFzRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc0V2ZW50TGlzdGVuZXIodHlwZSk7XG4gICAgfSxcbiAgICBob3ZlciA6IGZ1bmN0aW9uKCBvdmVyRnVuICwgb3V0RnVuICl7XG4gICAgICAgIHRoaXMub24oXCJtb3VzZW92ZXJcIiAsIG92ZXJGdW4pO1xuICAgICAgICB0aGlzLm9uKFwibW91c2VvdXRcIiAgLCBvdXRGdW4gKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBvbmNlIDogZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpe1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICB2YXIgb25jZUhhbmRsZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseShtZSAsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLnVuKHR5cGUgLCBvbmNlSGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vbih0eXBlICwgb25jZUhhbmRsZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBFdmVudERpc3BhdGNoZXI7XG4iLCJcbi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIE1hdHJpeCDnn6npmLXlupMg55So5LqO5pW05Liq57O757uf55qE5Yeg5L2V5Y+Y5o2i6K6h566XXG4gKiBjb2RlIGZyb20gaHR0cDovL2V2YW53LmdpdGh1Yi5pby9saWdodGdsLmpzL2RvY3MvbWF0cml4Lmh0bWxcbiAqL1xuXG52YXIgTWF0cml4ID0gZnVuY3Rpb24oYSwgYiwgYywgZCwgdHgsIHR5KXtcbiAgICB0aGlzLmEgPSBhICE9IHVuZGVmaW5lZCA/IGEgOiAxO1xuICAgIHRoaXMuYiA9IGIgIT0gdW5kZWZpbmVkID8gYiA6IDA7XG4gICAgdGhpcy5jID0gYyAhPSB1bmRlZmluZWQgPyBjIDogMDtcbiAgICB0aGlzLmQgPSBkICE9IHVuZGVmaW5lZCA/IGQgOiAxO1xuICAgIHRoaXMudHggPSB0eCAhPSB1bmRlZmluZWQgPyB0eCA6IDA7XG4gICAgdGhpcy50eSA9IHR5ICE9IHVuZGVmaW5lZCA/IHR5IDogMDtcbn07XG5cbk1hdHJpeC5wcm90b3R5cGUgPSB7XG4gICAgY29uY2F0IDogZnVuY3Rpb24obXR4KXtcbiAgICAgICAgdmFyIGEgPSB0aGlzLmE7XG4gICAgICAgIHZhciBjID0gdGhpcy5jO1xuICAgICAgICB2YXIgdHggPSB0aGlzLnR4O1xuXG4gICAgICAgIHRoaXMuYSA9IGEgKiBtdHguYSArIHRoaXMuYiAqIG10eC5jO1xuICAgICAgICB0aGlzLmIgPSBhICogbXR4LmIgKyB0aGlzLmIgKiBtdHguZDtcbiAgICAgICAgdGhpcy5jID0gYyAqIG10eC5hICsgdGhpcy5kICogbXR4LmM7XG4gICAgICAgIHRoaXMuZCA9IGMgKiBtdHguYiArIHRoaXMuZCAqIG10eC5kO1xuICAgICAgICB0aGlzLnR4ID0gdHggKiBtdHguYSArIHRoaXMudHkgKiBtdHguYyArIG10eC50eDtcbiAgICAgICAgdGhpcy50eSA9IHR4ICogbXR4LmIgKyB0aGlzLnR5ICogbXR4LmQgKyBtdHgudHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29uY2F0VHJhbnNmb3JtIDogZnVuY3Rpb24oeCwgeSwgc2NhbGVYLCBzY2FsZVksIHJvdGF0aW9uKXtcbiAgICAgICAgdmFyIGNvcyA9IDE7XG4gICAgICAgIHZhciBzaW4gPSAwO1xuICAgICAgICBpZihyb3RhdGlvbiUzNjApe1xuICAgICAgICAgICAgdmFyIHIgPSByb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhyKTtcbiAgICAgICAgICAgIHNpbiA9IE1hdGguc2luKHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25jYXQobmV3IE1hdHJpeChjb3Mqc2NhbGVYLCBzaW4qc2NhbGVYLCAtc2luKnNjYWxlWSwgY29zKnNjYWxlWSwgeCwgeSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHJvdGF0ZSA6IGZ1bmN0aW9uKGFuZ2xlKXtcbiAgICAgICAgLy/nm67liY3lt7Lnu4/mj5Dkvpvlr7npobrml7bpkojpgIbml7bpkojkuKTkuKrmlrnlkJHml4vovaznmoTmlK/mjIFcbiAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgdmFyIHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICB2YXIgYSA9IHRoaXMuYTtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICAgIHZhciB0eCA9IHRoaXMudHg7XG5cbiAgICAgICAgaWYgKGFuZ2xlPjApe1xuICAgICAgICAgICAgdGhpcy5hID0gYSAqIGNvcyAtIHRoaXMuYiAqIHNpbjtcbiAgICAgICAgICAgIHRoaXMuYiA9IGEgKiBzaW4gKyB0aGlzLmIgKiBjb3M7XG4gICAgICAgICAgICB0aGlzLmMgPSBjICogY29zIC0gdGhpcy5kICogc2luO1xuICAgICAgICAgICAgdGhpcy5kID0gYyAqIHNpbiArIHRoaXMuZCAqIGNvcztcbiAgICAgICAgICAgIHRoaXMudHggPSB0eCAqIGNvcyAtIHRoaXMudHkgKiBzaW47XG4gICAgICAgICAgICB0aGlzLnR5ID0gdHggKiBzaW4gKyB0aGlzLnR5ICogY29zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN0ID0gTWF0aC5zaW4oTWF0aC5hYnMoYW5nbGUpKTtcbiAgICAgICAgICAgIHZhciBjdCA9IE1hdGguY29zKE1hdGguYWJzKGFuZ2xlKSk7XG5cbiAgICAgICAgICAgIHRoaXMuYSA9IGEqY3QgKyB0aGlzLmIqc3Q7XG4gICAgICAgICAgICB0aGlzLmIgPSAtYSpzdCArIHRoaXMuYipjdDtcbiAgICAgICAgICAgIHRoaXMuYyA9IGMqY3QgKyB0aGlzLmQqc3Q7XG4gICAgICAgICAgICB0aGlzLmQgPSAtYypzdCArIGN0KnRoaXMuZDtcbiAgICAgICAgICAgIHRoaXMudHggPSBjdCp0eCArIHN0KnRoaXMudHk7XG4gICAgICAgICAgICB0aGlzLnR5ID0gY3QqdGhpcy50eSAtIHN0KnR4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2NhbGUgOiBmdW5jdGlvbihzeCwgc3kpe1xuICAgICAgICB0aGlzLmEgKj0gc3g7XG4gICAgICAgIHRoaXMuZCAqPSBzeTtcbiAgICAgICAgdGhpcy50eCAqPSBzeDtcbiAgICAgICAgdGhpcy50eSAqPSBzeTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB0cmFuc2xhdGUgOiBmdW5jdGlvbihkeCwgZHkpe1xuICAgICAgICB0aGlzLnR4ICs9IGR4O1xuICAgICAgICB0aGlzLnR5ICs9IGR5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGlkZW50aXR5IDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy/liJ3lp4vljJZcbiAgICAgICAgdGhpcy5hID0gdGhpcy5kID0gMTtcbiAgICAgICAgdGhpcy5iID0gdGhpcy5jID0gdGhpcy50eCA9IHRoaXMudHkgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGludmVydCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8v6YCG5ZCR55+p6Zi1XG4gICAgICAgIHZhciBhID0gdGhpcy5hO1xuICAgICAgICB2YXIgYiA9IHRoaXMuYjtcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7XG4gICAgICAgIHZhciBkID0gdGhpcy5kO1xuICAgICAgICB2YXIgdHggPSB0aGlzLnR4O1xuICAgICAgICB2YXIgaSA9IGEgKiBkIC0gYiAqIGM7XG5cbiAgICAgICAgdGhpcy5hID0gZCAvIGk7XG4gICAgICAgIHRoaXMuYiA9IC1iIC8gaTtcbiAgICAgICAgdGhpcy5jID0gLWMgLyBpO1xuICAgICAgICB0aGlzLmQgPSBhIC8gaTtcbiAgICAgICAgdGhpcy50eCA9IChjICogdGhpcy50eSAtIGQgKiB0eCkgLyBpO1xuICAgICAgICB0aGlzLnR5ID0gLShhICogdGhpcy50eSAtIGIgKiB0eCkgLyBpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsb25lIDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgodGhpcy5hLCB0aGlzLmIsIHRoaXMuYywgdGhpcy5kLCB0aGlzLnR4LCB0aGlzLnR5KTtcbiAgICB9LFxuICAgIHRvQXJyYXkgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gWyB0aGlzLmEgLCB0aGlzLmIgLCB0aGlzLmMgLCB0aGlzLmQgLCB0aGlzLnR4ICwgdGhpcy50eSBdO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog55+p6Zi15bem5LmY5ZCR6YePXG4gICAgICovXG4gICAgbXVsVmVjdG9yIDogZnVuY3Rpb24odikge1xuICAgICAgICB2YXIgYWEgPSB0aGlzLmEsIGFjID0gdGhpcy5jLCBhdHggPSB0aGlzLnR4O1xuICAgICAgICB2YXIgYWIgPSB0aGlzLmIsIGFkID0gdGhpcy5kLCBhdHkgPSB0aGlzLnR5O1xuXG4gICAgICAgIHZhciBvdXQgPSBbMCwwXTtcbiAgICAgICAgb3V0WzBdID0gdlswXSAqIGFhICsgdlsxXSAqIGFjICsgYXR4O1xuICAgICAgICBvdXRbMV0gPSB2WzBdICogYWIgKyB2WzFdICogYWQgKyBhdHk7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9ICAgIFxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXRyaXg7XG4iLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDmlbDlraYg57G7XG4gKlxuICoqL1xuXG5cblxudmFyIF9jYWNoZSA9IHtcbiAgICBzaW4gOiB7fSwgICAgIC8vc2lu57yT5a2YXG4gICAgY29zIDoge30gICAgICAvL2Nvc+e8k+WtmFxufTtcbnZhciBfcmFkaWFucyA9IE1hdGguUEkgLyAxODA7XG5cbi8qKlxuICogQHBhcmFtIGFuZ2xlIOW8p+W6pu+8iOinkuW6pu+8ieWPguaVsFxuICogQHBhcmFtIGlzRGVncmVlcyBhbmdsZeWPguaVsOaYr+WQpuS4uuinkuW6puiuoeeul++8jOm7mOiupOS4umZhbHNl77yMYW5nbGXkuLrku6XlvKfluqborqHph4/nmoTop5LluqZcbiAqL1xuZnVuY3Rpb24gc2luKGFuZ2xlLCBpc0RlZ3JlZXMpIHtcbiAgICBhbmdsZSA9IChpc0RlZ3JlZXMgPyBhbmdsZSAqIF9yYWRpYW5zIDogYW5nbGUpLnRvRml4ZWQoNCk7XG4gICAgaWYodHlwZW9mIF9jYWNoZS5zaW5bYW5nbGVdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIF9jYWNoZS5zaW5bYW5nbGVdID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gX2NhY2hlLnNpblthbmdsZV07XG59XG5cbi8qKlxuICogQHBhcmFtIHJhZGlhbnMg5byn5bqm5Y+C5pWwXG4gKi9cbmZ1bmN0aW9uIGNvcyhhbmdsZSwgaXNEZWdyZWVzKSB7XG4gICAgYW5nbGUgPSAoaXNEZWdyZWVzID8gYW5nbGUgKiBfcmFkaWFucyA6IGFuZ2xlKS50b0ZpeGVkKDQpO1xuICAgIGlmKHR5cGVvZiBfY2FjaGUuY29zW2FuZ2xlXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBfY2FjaGUuY29zW2FuZ2xlXSA9IE1hdGguY29zKGFuZ2xlKTtcbiAgICB9XG4gICAgcmV0dXJuIF9jYWNoZS5jb3NbYW5nbGVdO1xufVxuXG4vKipcbiAqIOinkuW6pui9rOW8p+W6plxuICogQHBhcmFtIHtPYmplY3R9IGFuZ2xlXG4gKi9cbmZ1bmN0aW9uIGRlZ3JlZVRvUmFkaWFuKGFuZ2xlKSB7XG4gICAgcmV0dXJuIGFuZ2xlICogX3JhZGlhbnM7XG59XG5cbi8qKlxuICog5byn5bqm6L2s6KeS5bqmXG4gKiBAcGFyYW0ge09iamVjdH0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gcmFkaWFuVG9EZWdyZWUoYW5nbGUpIHtcbiAgICByZXR1cm4gYW5nbGUgLyBfcmFkaWFucztcbn1cblxuLypcbiAqIOagoemqjOinkuW6puWIsDM2MOW6puWGhVxuICogQHBhcmFtIHthbmdsZX0gbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGRlZ3JlZVRvMzYwKCBhbmdsZSApIHtcbiAgICB2YXIgcmVBbmcgPSAoMzYwICsgIGFuZ2xlICAlIDM2MCkgJSAzNjA7Ly9NYXRoLmFicygzNjAgKyBNYXRoLmNlaWwoIGFuZ2xlICkgJSAzNjApICUgMzYwO1xuICAgIGlmKCByZUFuZyA9PSAwICYmIGFuZ2xlICE9PSAwICl7XG4gICAgICAgIHJlQW5nID0gMzYwXG4gICAgfVxuICAgIHJldHVybiByZUFuZztcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIFBJICA6IE1hdGguUEkgICxcbiAgICBzaW4gOiBzaW4gICAgICAsXG4gICAgY29zIDogY29zICAgICAgLFxuICAgIGRlZ3JlZVRvUmFkaWFuIDogZGVncmVlVG9SYWRpYW4sXG4gICAgcmFkaWFuVG9EZWdyZWUgOiByYWRpYW5Ub0RlZ3JlZSxcbiAgICBkZWdyZWVUbzM2MCAgICA6IGRlZ3JlZVRvMzYwICAgXG59O1xuXG4iLCIvKipcbiAqIENhbnZheFxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICog54K55Ye75qOA5rWLIOexu1xuICogKi9cbmltcG9ydCBteU1hdGggZnJvbSBcIi4vTWF0aFwiO1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcblxuLyoqXG4gKiDljIXlkKvliKTmlq1cbiAqIHNoYXBlIDog5Zu+5b2iXG4gKiB4IDog5qiq5Z2Q5qCHXG4gKiB5IDog57q15Z2Q5qCHXG4gKi9cbmZ1bmN0aW9uIGlzSW5zaWRlKHNoYXBlLCBwb2ludCkge1xuICAgIHZhciB4ID0gcG9pbnQueDtcbiAgICB2YXIgeSA9IHBvaW50Lnk7XG4gICAgaWYgKCFzaGFwZSB8fCAhc2hhcGUudHlwZSkge1xuICAgICAgICAvLyDml6Dlj4LmlbDmiJbkuI3mlK/mjIHnsbvlnotcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLy/mlbDlrabov5DnrpfvvIzkuLvopoHmmK9saW5l77yMYnJva2VuTGluZVxuICAgIHJldHVybiBfcG9pbnRJblNoYXBlKHNoYXBlLCB4LCB5KTtcbn07XG5cbmZ1bmN0aW9uIF9wb2ludEluU2hhcGUoc2hhcGUsIHgsIHkpIHtcbiAgICAvLyDlnKjnn6nlvaLlhoXliJnpg6jliIblm77lvaLpnIDopoHov5vkuIDmraXliKTmlq1cbiAgICBzd2l0Y2ggKHNoYXBlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbGluZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlTGluZShzaGFwZS5jb250ZXh0LCB4LCB5KTtcbiAgICAgICAgY2FzZSAnYnJva2VubGluZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlQnJva2VuTGluZShzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlQ2lyY2xlKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAnZWxsaXBzZSc6XG4gICAgICAgICAgICByZXR1cm4gX2lzUG9pbnRJbkVsaXBzZShzaGFwZSwgeCwgeSk7XG4gICAgICAgIGNhc2UgJ3NlY3Rvcic6XG4gICAgICAgICAgICByZXR1cm4gX2lzSW5zaWRlU2VjdG9yKHNoYXBlLCB4LCB5KTtcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgIGNhc2UgJ2Ryb3BsZXQnOlxuICAgICAgICAgICAgcmV0dXJuIF9pc0luc2lkZVBhdGgoc2hhcGUsIHgsIHkpO1xuICAgICAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgICAgY2FzZSAnaXNvZ29uJzpcbiAgICAgICAgICAgIHJldHVybiBfaXNJbnNpZGVQb2x5Z29uX1dpbmRpbmdOdW1iZXIoc2hhcGUsIHgsIHkpO1xuICAgICAgICAgICAgLy9yZXR1cm4gX2lzSW5zaWRlUG9seWdvbl9Dcm9zc2luZ051bWJlcihzaGFwZSwgeCwgeSk7XG4gICAgfVxufTtcbi8qKlxuICogIWlzSW5zaWRlXG4gKi9cbmZ1bmN0aW9uIGlzT3V0c2lkZShzaGFwZSwgeCwgeSkge1xuICAgIHJldHVybiAhaXNJbnNpZGUoc2hhcGUsIHgsIHkpO1xufTtcblxuLyoqXG4gKiDnur/mrrXljIXlkKvliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlTGluZShjb250ZXh0LCB4LCB5KSB7XG4gICAgdmFyIHgwID0gY29udGV4dC54U3RhcnQ7XG4gICAgdmFyIHkwID0gY29udGV4dC55U3RhcnQ7XG4gICAgdmFyIHgxID0gY29udGV4dC54RW5kO1xuICAgIHZhciB5MSA9IGNvbnRleHQueUVuZDtcbiAgICB2YXIgX2wgPSBNYXRoLm1heChjb250ZXh0LmxpbmVXaWR0aCAsIDMpO1xuICAgIHZhciBfYSA9IDA7XG4gICAgdmFyIF9iID0geDA7XG5cbiAgICBpZihcbiAgICAgICAgKHkgPiB5MCArIF9sICYmIHkgPiB5MSArIF9sKSBcbiAgICAgICAgfHwgKHkgPCB5MCAtIF9sICYmIHkgPCB5MSAtIF9sKSBcbiAgICAgICAgfHwgKHggPiB4MCArIF9sICYmIHggPiB4MSArIF9sKSBcbiAgICAgICAgfHwgKHggPCB4MCAtIF9sICYmIHggPCB4MSAtIF9sKSBcbiAgICApe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHgwICE9PSB4MSkge1xuICAgICAgICBfYSA9ICh5MCAtIHkxKSAvICh4MCAtIHgxKTtcbiAgICAgICAgX2IgPSAoeDAgKiB5MSAtIHgxICogeTApIC8gKHgwIC0geDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyh4IC0geDApIDw9IF9sIC8gMjtcbiAgICB9XG5cbiAgICB2YXIgX3MgPSAoX2EgKiB4IC0geSArIF9iKSAqIChfYSAqIHggLSB5ICsgX2IpIC8gKF9hICogX2EgKyAxKTtcbiAgICByZXR1cm4gX3MgPD0gX2wgLyAyICogX2wgLyAyO1xufTtcblxuZnVuY3Rpb24gX2lzSW5zaWRlQnJva2VuTGluZShzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICB2YXIgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XG4gICAgdmFyIGxpbmVBcmVhO1xuICAgIHZhciBpbnNpZGVDYXRjaCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcG9pbnRMaXN0Lmxlbmd0aCAtIDE7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgbGluZUFyZWEgPSB7XG4gICAgICAgICAgICB4U3RhcnQ6IHBvaW50TGlzdFtpXVswXSxcbiAgICAgICAgICAgIHlTdGFydDogcG9pbnRMaXN0W2ldWzFdLFxuICAgICAgICAgICAgeEVuZDogcG9pbnRMaXN0W2kgKyAxXVswXSxcbiAgICAgICAgICAgIHlFbmQ6IHBvaW50TGlzdFtpICsgMV1bMV0sXG4gICAgICAgICAgICBsaW5lV2lkdGg6IGNvbnRleHQubGluZVdpZHRoXG4gICAgICAgIH07XG4gICAgICAgIGlmICghX2lzSW5zaWRlUmVjdGFuZ2xlKHtcbiAgICAgICAgICAgICAgICAgICAgeDogTWF0aC5taW4obGluZUFyZWEueFN0YXJ0LCBsaW5lQXJlYS54RW5kKSAtIGxpbmVBcmVhLmxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5taW4obGluZUFyZWEueVN0YXJ0LCBsaW5lQXJlYS55RW5kKSAtIGxpbmVBcmVhLmxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IE1hdGguYWJzKGxpbmVBcmVhLnhTdGFydCAtIGxpbmVBcmVhLnhFbmQpICsgbGluZUFyZWEubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGxpbmVBcmVhLnlTdGFydCAtIGxpbmVBcmVhLnlFbmQpICsgbGluZUFyZWEubGluZVdpZHRoXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB4LCB5XG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAvLyDkuI3lnKjnn6nlvaLljLrlhoXot7Pov4dcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGluc2lkZUNhdGNoID0gX2lzSW5zaWRlTGluZShsaW5lQXJlYSwgeCwgeSk7XG4gICAgICAgIGlmIChpbnNpZGVDYXRjaCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc2lkZUNhdGNoO1xufTtcblxuXG4vKipcbiAqIOefqeW9ouWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVSZWN0YW5nbGUoc2hhcGUsIHgsIHkpIHtcbiAgICBpZiAoeCA+PSBzaGFwZS54ICYmIHggPD0gKHNoYXBlLnggKyBzaGFwZS53aWR0aCkgJiYgeSA+PSBzaGFwZS55ICYmIHkgPD0gKHNoYXBlLnkgKyBzaGFwZS5oZWlnaHQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIOWchuW9ouWMheWQq+WIpOaWrVxuICovXG5mdW5jdGlvbiBfaXNJbnNpZGVDaXJjbGUoc2hhcGUsIHgsIHksIHIpIHtcbiAgICB2YXIgY29udGV4dCA9IHNoYXBlLmNvbnRleHQ7XG4gICAgIXIgJiYgKHIgPSBjb250ZXh0LnIpO1xuICAgIHIrPWNvbnRleHQubGluZVdpZHRoO1xuICAgIHJldHVybiAoeCAqIHggKyB5ICogeSkgPCByICogcjtcbn07XG5cbi8qKlxuICog5omH5b2i5YyF5ZCr5Yik5patXG4gKi9cbmZ1bmN0aW9uIF9pc0luc2lkZVNlY3RvcihzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dFxuICAgIGlmICghX2lzSW5zaWRlQ2lyY2xlKHNoYXBlLCB4LCB5KSB8fCAoY29udGV4dC5yMCA+IDAgJiYgX2lzSW5zaWRlQ2lyY2xlKHNoYXBlLCB4LCB5LCBjb250ZXh0LnIwKSkpIHtcbiAgICAgICAgLy8g5aSn5ZyG5aSW5oiW6ICF5bCP5ZyG5YaF55u05o6lZmFsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIOWIpOaWreWkueinklxuICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LnN0YXJ0QW5nbGUpOyAvLyDotbflp4vop5LluqZbMCwzNjApXG4gICAgICAgIHZhciBlbmRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LmVuZEFuZ2xlKTsgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxuXG4gICAgICAgIC8v6K6h566X6K+l54K55omA5Zyo55qE6KeS5bqmXG4gICAgICAgIHZhciBhbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MCgoTWF0aC5hdGFuMih5LCB4KSAvIE1hdGguUEkgKiAxODApICUgMzYwKTtcblxuICAgICAgICB2YXIgcmVnSW4gPSB0cnVlOyAvL+WmguaenOWcqHN0YXJ05ZKMZW5k55qE5pWw5YC85Lit77yMZW5k5aSn5LqOc3RhcnTogIzkuJTmmK/pobrml7bpkojliJlyZWdJbuS4unRydWVcbiAgICAgICAgaWYgKChzdGFydEFuZ2xlID4gZW5kQW5nbGUgJiYgIWNvbnRleHQuY2xvY2t3aXNlKSB8fCAoc3RhcnRBbmdsZSA8IGVuZEFuZ2xlICYmIGNvbnRleHQuY2xvY2t3aXNlKSkge1xuICAgICAgICAgICAgcmVnSW4gPSBmYWxzZTsgLy9vdXRcbiAgICAgICAgfVxuICAgICAgICAvL+W6pueahOiMg+WbtO+8jOS7juWwj+WIsOWkp1xuICAgICAgICB2YXIgcmVnQW5nbGUgPSBbXG4gICAgICAgICAgICBNYXRoLm1pbihzdGFydEFuZ2xlLCBlbmRBbmdsZSksXG4gICAgICAgICAgICBNYXRoLm1heChzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgICAgXTtcblxuICAgICAgICB2YXIgaW5BbmdsZVJlZyA9IGFuZ2xlID4gcmVnQW5nbGVbMF0gJiYgYW5nbGUgPCByZWdBbmdsZVsxXTtcbiAgICAgICAgcmV0dXJuIChpbkFuZ2xlUmVnICYmIHJlZ0luKSB8fCAoIWluQW5nbGVSZWcgJiYgIXJlZ0luKTtcbiAgICB9XG59O1xuXG4vKlxuICrmpK3lnIbljIXlkKvliKTmlq1cbiAqICovXG5mdW5jdGlvbiBfaXNQb2ludEluRWxpcHNlKHNoYXBlLCB4LCB5KSB7XG4gICAgdmFyIGNvbnRleHQgPSBzaGFwZS5jb250ZXh0O1xuICAgIHZhciBjZW50ZXIgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8veOWNiuW+hFxuICAgIHZhciBYUmFkaXVzID0gY29udGV4dC5ocjtcbiAgICB2YXIgWVJhZGl1cyA9IGNvbnRleHQudnI7XG5cbiAgICB2YXIgcCA9IHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgIH07XG5cbiAgICB2YXIgaVJlcztcblxuICAgIHAueCAtPSBjZW50ZXIueDtcbiAgICBwLnkgLT0gY2VudGVyLnk7XG5cbiAgICBwLnggKj0gcC54O1xuICAgIHAueSAqPSBwLnk7XG5cbiAgICBYUmFkaXVzICo9IFhSYWRpdXM7XG4gICAgWVJhZGl1cyAqPSBZUmFkaXVzO1xuXG4gICAgaVJlcyA9IFlSYWRpdXMgKiBwLnggKyBYUmFkaXVzICogcC55IC0gWFJhZGl1cyAqIFlSYWRpdXM7XG5cbiAgICByZXR1cm4gKGlSZXMgPCAwKTtcbn07XG5cbi8qKlxuICog5aSa6L655b2i5YyF5ZCr5Yik5patIE5vbnplcm8gV2luZGluZyBOdW1iZXIgUnVsZVxuICovXG5cbmZ1bmN0aW9uIF9pc0luc2lkZVBvbHlnb25fV2luZGluZ051bWJlcihzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dCA/IHNoYXBlLmNvbnRleHQgOiBzaGFwZTtcbiAgICB2YXIgcG9seSA9IF8uY2xvbmUoY29udGV4dC5wb2ludExpc3QpOyAvL3BvbHkg5aSa6L655b2i6aG254K577yM5pWw57uE5oiQ5ZGY55qE5qC85byP5ZCMIHBcbiAgICBwb2x5LnB1c2gocG9seVswXSk7IC8v6K6w5b6X6KaB6Zet5ZCIXG4gICAgdmFyIHduID0gMDtcbiAgICBmb3IgKHZhciBzaGlmdFAsIHNoaWZ0ID0gcG9seVswXVsxXSA+IHksIGkgPSAxOyBpIDwgcG9seS5sZW5ndGg7IGkrKykge1xuICAgICAgICAvL+WFiOWBmue6v+eahOajgOa1i++8jOWmguaenOaYr+WcqOS4pOeCueeahOe6v+S4iu+8jOWwseiCr+WumuaYr+WcqOiupOS4uuWcqOWbvuW9ouS4ilxuICAgICAgICB2YXIgaW5MaW5lID0gX2lzSW5zaWRlTGluZSh7XG4gICAgICAgICAgICB4U3RhcnQgOiBwb2x5W2ktMV1bMF0sXG4gICAgICAgICAgICB5U3RhcnQgOiBwb2x5W2ktMV1bMV0sXG4gICAgICAgICAgICB4RW5kICAgOiBwb2x5W2ldWzBdLFxuICAgICAgICAgICAgeUVuZCAgIDogcG9seVtpXVsxXSxcbiAgICAgICAgICAgIGxpbmVXaWR0aCA6IChjb250ZXh0LmxpbmVXaWR0aCB8fCAxKVxuICAgICAgICB9ICwgeCAsIHkpO1xuICAgICAgICBpZiAoIGluTGluZSApe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIC8v5aaC5p6c5pyJZmlsbFN0eWxlIO+8jCDpgqPkuYjogq/lrprpnIDopoHlgZrpnaLnmoTmo4DmtYtcbiAgICAgICAgaWYgKGNvbnRleHQuZmlsbFN0eWxlKSB7XG4gICAgICAgICAgICBzaGlmdFAgPSBzaGlmdDtcbiAgICAgICAgICAgIHNoaWZ0ID0gcG9seVtpXVsxXSA+IHk7XG4gICAgICAgICAgICBpZiAoc2hpZnRQICE9IHNoaWZ0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG4gPSAoc2hpZnRQID8gMSA6IDApIC0gKHNoaWZ0ID8gMSA6IDApO1xuICAgICAgICAgICAgICAgIGlmIChuICogKChwb2x5W2kgLSAxXVswXSAtIHgpICogKHBvbHlbaV1bMV0gLSB5KSAtIChwb2x5W2kgLSAxXVsxXSAtIHkpICogKHBvbHlbaV1bMF0gLSB4KSkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHduICs9IG47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHduO1xufTtcblxuLyoqXG4gKiDot6/lvoTljIXlkKvliKTmlq3vvIzkvp3otZblpJrovrnlvaLliKTmlq1cbiAqL1xuZnVuY3Rpb24gX2lzSW5zaWRlUGF0aChzaGFwZSwgeCwgeSkge1xuICAgIHZhciBjb250ZXh0ID0gc2hhcGUuY29udGV4dDtcbiAgICB2YXIgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XG4gICAgdmFyIGluc2lkZUNhdGNoID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwb2ludExpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGluc2lkZUNhdGNoID0gX2lzSW5zaWRlUG9seWdvbl9XaW5kaW5nTnVtYmVyKHtcbiAgICAgICAgICAgIHBvaW50TGlzdDogcG9pbnRMaXN0W2ldLFxuICAgICAgICAgICAgbGluZVdpZHRoOiBjb250ZXh0LmxpbmVXaWR0aCxcbiAgICAgICAgICAgIGZpbGxTdHlsZTogY29udGV4dC5maWxsU3R5bGVcbiAgICAgICAgfSwgeCwgeSk7XG4gICAgICAgIGlmIChpbnNpZGVDYXRjaCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluc2lkZUNhdGNoO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGlzSW5zaWRlOiBpc0luc2lkZSxcbiAgICBpc091dHNpZGU6IGlzT3V0c2lkZVxufTsiLCJpbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIFR3ZWVuLmpzIC0gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdlZW5qcy90d2Vlbi5qc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdlZW5qcy90d2Vlbi5qcy9ncmFwaHMvY29udHJpYnV0b3JzIGZvciB0aGUgZnVsbCBsaXN0IG9mIGNvbnRyaWJ1dG9ycy5cbiAqIFRoYW5rIHlvdSBhbGwsIHlvdSdyZSBhd2Vzb21lIVxuICovXG5cbiB2YXIgVFdFRU4gPSBUV0VFTiB8fCAoZnVuY3Rpb24gKCkge1xuXG4gXHR2YXIgX3R3ZWVucyA9IFtdO1xuXG4gXHRyZXR1cm4ge1xuXG4gXHRcdGdldEFsbDogZnVuY3Rpb24gKCkge1xuXG4gXHRcdFx0cmV0dXJuIF90d2VlbnM7XG5cbiBcdFx0fSxcblxuIFx0XHRyZW1vdmVBbGw6IGZ1bmN0aW9uICgpIHtcblxuIFx0XHRcdF90d2VlbnMgPSBbXTtcblxuIFx0XHR9LFxuXG4gXHRcdGFkZDogZnVuY3Rpb24gKHR3ZWVuKSB7XG5cbiBcdFx0XHRfdHdlZW5zLnB1c2godHdlZW4pO1xuXG4gXHRcdH0sXG5cbiBcdFx0cmVtb3ZlOiBmdW5jdGlvbiAodHdlZW4pIHtcblxuXHRcdFx0dmFyIGkgPSBfLmluZGV4T2YoIF90d2VlbnMgLCB0d2VlbiApOy8vX3R3ZWVucy5pbmRleE9mKHR3ZWVuKTtcblxuXHRcdFx0aWYgKGkgIT09IC0xKSB7XG5cdFx0XHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKHRpbWUsIHByZXNlcnZlKSB7XG5cblx0XHRcdGlmIChfdHdlZW5zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0dGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiBUV0VFTi5ub3coKTtcblxuXHRcdFx0d2hpbGUgKGkgPCBfdHdlZW5zLmxlbmd0aCkge1xuXG4gICAgICAgICAgICAgICAgLyogb2xkIFxuXHRcdFx0XHRpZiAoX3R3ZWVuc1tpXS51cGRhdGUodGltZSkgfHwgcHJlc2VydmUpIHtcblx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3R3ZWVucy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ki9cblxuICAgICAgICAgICAgICAgIC8vbmV3IGNvZGVcbiAgICAgICAgICAgICAgICAvL2luIHJlYWwgd29ybGQsIHR3ZWVuLnVwZGF0ZSBoYXMgY2hhbmNlIHRvIHJlbW92ZSBpdHNlbGYsIHNvIHdlIGhhdmUgdG8gaGFuZGxlIHRoaXMgc2l0dWF0aW9uLlxuICAgICAgICAgICAgICAgIC8vaW4gY2VydGFpbiBjYXNlcywgb25VcGRhdGVDYWxsYmFjayB3aWxsIHJlbW92ZSBpbnN0YW5jZXMgaW4gX3R3ZWVucywgd2hpY2ggbWFrZSBfdHdlZW5zLnNwbGljZShpLCAxKSBmYWlsXG4gICAgICAgICAgICAgICAgLy9AbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tXG4gICAgICAgICAgICAgICAgdmFyIF90ID0gX3R3ZWVuc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgX3VwZGF0ZVJlcyA9IF90LnVwZGF0ZSh0aW1lKTtcblxuICAgICAgICAgICAgICAgIGlmKCAhX3R3ZWVuc1tpXSApe1xuICAgICAgICAgICAgICAgIFx0YnJlYWs7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoIF90ID09PSBfdHdlZW5zW2ldICkge1xuICAgICAgICAgICAgICAgIFx0aWYgKCBfdXBkYXRlUmVzIHx8IHByZXNlcnZlICkge1xuICAgICAgICAgICAgICAgIFx0XHRpKys7XG4gICAgICAgICAgICAgICAgXHR9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBcdH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbn0pKCk7XG5cblxuLy8gSW5jbHVkZSBhIHBlcmZvcm1hbmNlLm5vdyBwb2x5ZmlsbC5cbi8vIEluIG5vZGUuanMsIHVzZSBwcm9jZXNzLmhydGltZS5cbmlmICh0eXBlb2YgKHdpbmRvdykgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiAocHJvY2VzcykgIT09ICd1bmRlZmluZWQnKSB7XG5cdFRXRUVOLm5vdyA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cblx0XHQvLyBDb252ZXJ0IFtzZWNvbmRzLCBuYW5vc2Vjb25kc10gdG8gbWlsbGlzZWNvbmRzLlxuXHRcdHJldHVybiB0aW1lWzBdICogMTAwMCArIHRpbWVbMV0gLyAxMDAwMDAwO1xuXHR9O1xufVxuLy8gSW4gYSBicm93c2VyLCB1c2Ugd2luZG93LnBlcmZvcm1hbmNlLm5vdyBpZiBpdCBpcyBhdmFpbGFibGUuXG5lbHNlIGlmICh0eXBlb2YgKHdpbmRvdykgIT09ICd1bmRlZmluZWQnICYmXG5cdHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gdW5kZWZpbmVkICYmXG5cdHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgIT09IHVuZGVmaW5lZCkge1xuXHQvLyBUaGlzIG11c3QgYmUgYm91bmQsIGJlY2F1c2UgZGlyZWN0bHkgYXNzaWduaW5nIHRoaXMgZnVuY3Rpb25cblx0Ly8gbGVhZHMgdG8gYW4gaW52b2NhdGlvbiBleGNlcHRpb24gaW4gQ2hyb21lLlxuXHRUV0VFTi5ub3cgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93LmJpbmQod2luZG93LnBlcmZvcm1hbmNlKTtcbn1cbi8vIFVzZSBEYXRlLm5vdyBpZiBpdCBpcyBhdmFpbGFibGUuXG5lbHNlIGlmIChEYXRlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XG5cdFRXRUVOLm5vdyA9IERhdGUubm93O1xufVxuLy8gT3RoZXJ3aXNlLCB1c2UgJ25ldyBEYXRlKCkuZ2V0VGltZSgpJy5cbmVsc2Uge1xuXHRUV0VFTi5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHR9O1xufVxuXG5cblRXRUVOLlR3ZWVuID0gZnVuY3Rpb24gKG9iamVjdCkge1xuXG5cdHZhciBfb2JqZWN0ID0gb2JqZWN0O1xuXHR2YXIgX3ZhbHVlc1N0YXJ0ID0ge307XG5cdHZhciBfdmFsdWVzRW5kID0ge307XG5cdHZhciBfdmFsdWVzU3RhcnRSZXBlYXQgPSB7fTtcblx0dmFyIF9kdXJhdGlvbiA9IDEwMDA7XG5cdHZhciBfcmVwZWF0ID0gMDtcblx0dmFyIF9yZXBlYXREZWxheVRpbWU7XG5cdHZhciBfeW95byA9IGZhbHNlO1xuXHR2YXIgX2lzUGxheWluZyA9IGZhbHNlO1xuXHR2YXIgX3JldmVyc2VkID0gZmFsc2U7XG5cdHZhciBfZGVsYXlUaW1lID0gMDtcblx0dmFyIF9zdGFydFRpbWUgPSBudWxsO1xuXHR2YXIgX2Vhc2luZ0Z1bmN0aW9uID0gVFdFRU4uRWFzaW5nLkxpbmVhci5Ob25lO1xuXHR2YXIgX2ludGVycG9sYXRpb25GdW5jdGlvbiA9IFRXRUVOLkludGVycG9sYXRpb24uTGluZWFyO1xuXHR2YXIgX2NoYWluZWRUd2VlbnMgPSBbXTtcblx0dmFyIF9vblN0YXJ0Q2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cdHZhciBfb25VcGRhdGVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25Db21wbGV0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vblN0b3BDYWxsYmFjayA9IG51bGw7XG5cblx0dGhpcy50byA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBkdXJhdGlvbikge1xuXG5cdFx0X3ZhbHVlc0VuZCA9IHByb3BlcnRpZXM7XG5cblx0XHRpZiAoZHVyYXRpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0X2R1cmF0aW9uID0gZHVyYXRpb247XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKHRpbWUpIHtcblxuXHRcdFRXRUVOLmFkZCh0aGlzKTtcblxuXHRcdF9pc1BsYXlpbmcgPSB0cnVlO1xuXG5cdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gZmFsc2U7XG5cblx0XHRfc3RhcnRUaW1lID0gdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6IFRXRUVOLm5vdygpO1xuXHRcdF9zdGFydFRpbWUgKz0gX2RlbGF5VGltZTtcblxuXHRcdGZvciAodmFyIHByb3BlcnR5IGluIF92YWx1ZXNFbmQpIHtcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgYW4gQXJyYXkgd2FzIHByb3ZpZGVkIGFzIHByb3BlcnR5IHZhbHVlXG5cdFx0XHRpZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBBcnJheSkge1xuXG5cdFx0XHRcdGlmIChfdmFsdWVzRW5kW3Byb3BlcnR5XS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENyZWF0ZSBhIGxvY2FsIGNvcHkgb2YgdGhlIEFycmF5IHdpdGggdGhlIHN0YXJ0IHZhbHVlIGF0IHRoZSBmcm9udFxuXHRcdFx0XHRfdmFsdWVzRW5kW3Byb3BlcnR5XSA9IFtfb2JqZWN0W3Byb3BlcnR5XV0uY29uY2F0KF92YWx1ZXNFbmRbcHJvcGVydHldKTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBgdG8oKWAgc3BlY2lmaWVzIGEgcHJvcGVydHkgdGhhdCBkb2Vzbid0IGV4aXN0IGluIHRoZSBzb3VyY2Ugb2JqZWN0LFxuXHRcdFx0Ly8gd2Ugc2hvdWxkIG5vdCBzZXQgdGhhdCBwcm9wZXJ0eSBpbiB0aGUgb2JqZWN0XG5cdFx0XHRpZiAoX29iamVjdFtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2F2ZSB0aGUgc3RhcnRpbmcgdmFsdWUuXG5cdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldID0gX29iamVjdFtwcm9wZXJ0eV07XG5cblx0XHRcdGlmICgoX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0X3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSAqPSAxLjA7IC8vIEVuc3VyZXMgd2UncmUgdXNpbmcgbnVtYmVycywgbm90IHN0cmluZ3Ncblx0XHRcdH1cblxuXHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gfHwgMDtcblxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0aWYgKCFfaXNQbGF5aW5nKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRUV0VFTi5yZW1vdmUodGhpcyk7XG5cdFx0X2lzUGxheWluZyA9IGZhbHNlO1xuXG5cdFx0aWYgKF9vblN0b3BDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0X29uU3RvcENhbGxiYWNrLmNhbGwoX29iamVjdCwgX29iamVjdCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucygpO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5lbmQgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHR0aGlzLnVwZGF0ZShfc3RhcnRUaW1lICsgX2R1cmF0aW9uKTtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RvcENoYWluZWRUd2VlbnMgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRmb3IgKHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKykge1xuXHRcdFx0X2NoYWluZWRUd2VlbnNbaV0uc3RvcCgpO1xuXHRcdH1cblxuXHR9O1xuXG5cdHRoaXMuZGVsYXkgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG5cblx0XHRfZGVsYXlUaW1lID0gYW1vdW50O1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXQgPSBmdW5jdGlvbiAodGltZXMpIHtcblxuXHRcdF9yZXBlYXQgPSB0aW1lcztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMucmVwZWF0RGVsYXkgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG5cblx0XHRfcmVwZWF0RGVsYXlUaW1lID0gYW1vdW50O1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy55b3lvID0gZnVuY3Rpb24gKHlveW8pIHtcblxuXHRcdF95b3lvID0geW95bztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cblx0dGhpcy5lYXNpbmcgPSBmdW5jdGlvbiAoZWFzaW5nKSB7XG5cblx0XHRfZWFzaW5nRnVuY3Rpb24gPSBlYXNpbmc7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmludGVycG9sYXRpb24gPSBmdW5jdGlvbiAoaW50ZXJwb2xhdGlvbikge1xuXG5cdFx0X2ludGVycG9sYXRpb25GdW5jdGlvbiA9IGludGVycG9sYXRpb247XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmNoYWluID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0X2NoYWluZWRUd2VlbnMgPSBhcmd1bWVudHM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uU3RhcnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblN0YXJ0Q2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25VcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblVwZGF0ZUNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLm9uQ29tcGxldGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdG9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cblx0XHRfb25TdG9wQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcblxuXHRcdHZhciBwcm9wZXJ0eTtcblx0XHR2YXIgZWxhcHNlZDtcblx0XHR2YXIgdmFsdWU7XG5cblx0XHRpZiAodGltZSA8IF9zdGFydFRpbWUpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChfb25TdGFydENhbGxiYWNrRmlyZWQgPT09IGZhbHNlKSB7XG5cblx0XHRcdGlmIChfb25TdGFydENhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRcdF9vblN0YXJ0Q2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0X29uU3RhcnRDYWxsYmFja0ZpcmVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRlbGFwc2VkID0gKHRpbWUgLSBfc3RhcnRUaW1lKSAvIF9kdXJhdGlvbjtcblx0XHRlbGFwc2VkID0gZWxhcHNlZCA+IDEgPyAxIDogZWxhcHNlZDtcblxuXHRcdHZhbHVlID0gX2Vhc2luZ0Z1bmN0aW9uKGVsYXBzZWQpO1xuXG5cdFx0Zm9yIChwcm9wZXJ0eSBpbiBfdmFsdWVzRW5kKSB7XG5cblx0XHRcdC8vIERvbid0IHVwZGF0ZSBwcm9wZXJ0aWVzIHRoYXQgZG8gbm90IGV4aXN0IGluIHRoZSBzb3VyY2Ugb2JqZWN0XG5cdFx0XHRpZiAoX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc3RhcnQgPSBfdmFsdWVzU3RhcnRbcHJvcGVydHldIHx8IDA7XG5cdFx0XHR2YXIgZW5kID0gX3ZhbHVlc0VuZFtwcm9wZXJ0eV07XG5cblx0XHRcdGlmIChlbmQgaW5zdGFuY2VvZiBBcnJheSkge1xuXG5cdFx0XHRcdF9vYmplY3RbcHJvcGVydHldID0gX2ludGVycG9sYXRpb25GdW5jdGlvbihlbmQsIHZhbHVlKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBQYXJzZXMgcmVsYXRpdmUgZW5kIHZhbHVlcyB3aXRoIHN0YXJ0IGFzIGJhc2UgKGUuZy46ICsxMCwgLTMpXG5cdFx0XHRcdGlmICh0eXBlb2YgKGVuZCkgPT09ICdzdHJpbmcnKSB7XG5cblx0XHRcdFx0XHRpZiAoZW5kLmNoYXJBdCgwKSA9PT0gJysnIHx8IGVuZC5jaGFyQXQoMCkgPT09ICctJykge1xuXHRcdFx0XHRcdFx0ZW5kID0gc3RhcnQgKyBwYXJzZUZsb2F0KGVuZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGVuZCA9IHBhcnNlRmxvYXQoZW5kKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBQcm90ZWN0IGFnYWluc3Qgbm9uIG51bWVyaWMgcHJvcGVydGllcy5cblx0XHRcdFx0aWYgKHR5cGVvZiAoZW5kKSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHRfb2JqZWN0W3Byb3BlcnR5XSA9IHN0YXJ0ICsgKGVuZCAtIHN0YXJ0KSAqIHZhbHVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmIChfb25VcGRhdGVDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0X29uVXBkYXRlQ2FsbGJhY2suY2FsbChfb2JqZWN0LCB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKGVsYXBzZWQgPT09IDEpIHtcblxuXHRcdFx0aWYgKF9yZXBlYXQgPiAwKSB7XG5cblx0XHRcdFx0aWYgKGlzRmluaXRlKF9yZXBlYXQpKSB7XG5cdFx0XHRcdFx0X3JlcGVhdC0tO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVhc3NpZ24gc3RhcnRpbmcgdmFsdWVzLCByZXN0YXJ0IGJ5IG1ha2luZyBzdGFydFRpbWUgPSBub3dcblx0XHRcdFx0Zm9yIChwcm9wZXJ0eSBpbiBfdmFsdWVzU3RhcnRSZXBlYXQpIHtcblxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKF92YWx1ZXNFbmRbcHJvcGVydHldKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldICsgcGFyc2VGbG9hdChfdmFsdWVzRW5kW3Byb3BlcnR5XSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0XHR2YXIgdG1wID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcblxuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNFbmRbcHJvcGVydHldO1xuXHRcdFx0XHRcdFx0X3ZhbHVlc0VuZFtwcm9wZXJ0eV0gPSB0bXA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV07XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfeW95bykge1xuXHRcdFx0XHRcdF9yZXZlcnNlZCA9ICFfcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoX3JlcGVhdERlbGF5VGltZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfcmVwZWF0RGVsYXlUaW1lO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF9zdGFydFRpbWUgPSB0aW1lICsgX2RlbGF5VGltZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmIChfb25Db21wbGV0ZUNhbGxiYWNrICE9PSBudWxsKSB7XG5cblx0XHRcdFx0XHRfb25Db21wbGV0ZUNhbGxiYWNrLmNhbGwoX29iamVjdCwgX29iamVjdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbnVtQ2hhaW5lZFR3ZWVucyA9IF9jaGFpbmVkVHdlZW5zLmxlbmd0aDsgaSA8IG51bUNoYWluZWRUd2VlbnM7IGkrKykge1xuXHRcdFx0XHRcdC8vIE1ha2UgdGhlIGNoYWluZWQgdHdlZW5zIHN0YXJ0IGV4YWN0bHkgYXQgdGhlIHRpbWUgdGhleSBzaG91bGQsXG5cdFx0XHRcdFx0Ly8gZXZlbiBpZiB0aGUgYHVwZGF0ZSgpYCBtZXRob2Qgd2FzIGNhbGxlZCB3YXkgcGFzdCB0aGUgZHVyYXRpb24gb2YgdGhlIHR3ZWVuXG5cdFx0XHRcdFx0X2NoYWluZWRUd2VlbnNbaV0uc3RhcnQoX3N0YXJ0VGltZSArIF9kdXJhdGlvbik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXG5cdH07XG5cbn07XG5cblxuVFdFRU4uRWFzaW5nID0ge1xuXG5cdExpbmVhcjoge1xuXG5cdFx0Tm9uZTogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGs7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWFkcmF0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqICgyIC0gayk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLSAwLjUgKiAoLS1rICogKGsgLSAyKSAtIDEpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Q3ViaWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqIGsgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YXJ0aWM6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gKC0tayAqIGsgKiBrICogayk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIGsgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICogayAtIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVpbnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogayAqIGsgKiBrICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogayAqIGsgKiBrICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRTaW51c29pZGFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLmNvcyhrICogTWF0aC5QSSAvIDIpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIE1hdGguc2luKGsgKiBNYXRoLlBJIC8gMik7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAwLjUgKiAoMSAtIE1hdGguY29zKE1hdGguUEkgKiBrKSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFeHBvbmVudGlhbDoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAwID8gMCA6IE1hdGgucG93KDEwMjQsIGsgLSAxKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdygyLCAtIDEwICogayk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogTWF0aC5wb3coMTAyNCwgayAtIDEpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKC0gTWF0aC5wb3coMiwgLSAxMCAqIChrIC0gMSkpICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDaXJjdWxhcjoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSBrICogayk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zcXJ0KDEgLSAoLS1rICogaykpO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAtIDAuNSAqIChNYXRoLnNxcnQoMSAtIGsgKiBrKSAtIDEpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKGsgLT0gMikgKiBrKSArIDEpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0RWxhc3RpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC1NYXRoLnBvdygyLCAxMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gTWF0aC5wb3coMiwgLTEwICogaykgKiBNYXRoLnNpbigoayAtIDAuMSkgKiA1ICogTWF0aC5QSSkgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdGsgKj0gMjtcblxuXHRcdFx0aWYgKGsgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAtMC41ICogTWF0aC5wb3coMiwgMTAgKiAoayAtIDEpKSAqIE1hdGguc2luKChrIC0gMS4xKSAqIDUgKiBNYXRoLlBJKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqIE1hdGgucG93KDIsIC0xMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpICsgMTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEJhY2s6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cblx0XHRcdHJldHVybiBrICogayAqICgocyArIDEpICogayAtIHMpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4O1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqICgocyArIDEpICogayArIHMpICsgMTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0dmFyIHMgPSAxLjcwMTU4ICogMS41MjU7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIDAuNSAqIChrICogayAqICgocyArIDEpICogayAtIHMpKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiAoKHMgKyAxKSAqIGsgKyBzKSArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0Qm91bmNlOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBUV0VFTi5FYXNpbmcuQm91bmNlLk91dCgxIC0gayk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA8ICgxIC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIGsgKiBrO1xuXHRcdFx0fSBlbHNlIGlmIChrIDwgKDIgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDEuNSAvIDIuNzUpKSAqIGsgKyAwLjc1O1xuXHRcdFx0fSBlbHNlIGlmIChrIDwgKDIuNSAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMi4yNSAvIDIuNzUpKSAqIGsgKyAwLjkzNzU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKGsgLT0gKDIuNjI1IC8gMi43NSkpICogayArIDAuOTg0Mzc1O1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA8IDAuNSkge1xuXHRcdFx0XHRyZXR1cm4gVFdFRU4uRWFzaW5nLkJvdW5jZS5JbihrICogMikgKiAwLjU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLk91dChrICogMiAtIDEpICogMC41ICsgMC41O1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuVFdFRU4uSW50ZXJwb2xhdGlvbiA9IHtcblxuXHRMaW5lYXI6IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgbSA9IHYubGVuZ3RoIC0gMTtcblx0XHR2YXIgZiA9IG0gKiBrO1xuXHRcdHZhciBpID0gTWF0aC5mbG9vcihmKTtcblx0XHR2YXIgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkxpbmVhcjtcblxuXHRcdGlmIChrIDwgMCkge1xuXHRcdFx0cmV0dXJuIGZuKHZbMF0sIHZbMV0sIGYpO1xuXHRcdH1cblxuXHRcdGlmIChrID4gMSkge1xuXHRcdFx0cmV0dXJuIGZuKHZbbV0sIHZbbSAtIDFdLCBtIC0gZik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZuKHZbaV0sIHZbaSArIDEgPiBtID8gbSA6IGkgKyAxXSwgZiAtIGkpO1xuXG5cdH0sXG5cblx0QmV6aWVyOiBmdW5jdGlvbiAodiwgaykge1xuXG5cdFx0dmFyIGIgPSAwO1xuXHRcdHZhciBuID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBwdyA9IE1hdGgucG93O1xuXHRcdHZhciBibiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQmVybnN0ZWluO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPD0gbjsgaSsrKSB7XG5cdFx0XHRiICs9IHB3KDEgLSBrLCBuIC0gaSkgKiBwdyhrLCBpKSAqIHZbaV0gKiBibihuLCBpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYjtcblxuXHR9LFxuXG5cdENhdG11bGxSb206IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgbSA9IHYubGVuZ3RoIC0gMTtcblx0XHR2YXIgZiA9IG0gKiBrO1xuXHRcdHZhciBpID0gTWF0aC5mbG9vcihmKTtcblx0XHR2YXIgZm4gPSBUV0VFTi5JbnRlcnBvbGF0aW9uLlV0aWxzLkNhdG11bGxSb207XG5cblx0XHRpZiAodlswXSA9PT0gdlttXSkge1xuXG5cdFx0XHRpZiAoayA8IDApIHtcblx0XHRcdFx0aSA9IE1hdGguZmxvb3IoZiA9IG0gKiAoMSArIGspKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuKHZbKGkgLSAxICsgbSkgJSBtXSwgdltpXSwgdlsoaSArIDEpICUgbV0sIHZbKGkgKyAyKSAlIG1dLCBmIC0gaSk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAoayA8IDApIHtcblx0XHRcdFx0cmV0dXJuIHZbMF0gLSAoZm4odlswXSwgdlswXSwgdlsxXSwgdlsxXSwgLWYpIC0gdlswXSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID4gMSkge1xuXHRcdFx0XHRyZXR1cm4gdlttXSAtIChmbih2W21dLCB2W21dLCB2W20gLSAxXSwgdlttIC0gMV0sIGYgLSBtKSAtIHZbbV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm4odltpID8gaSAtIDEgOiAwXSwgdltpXSwgdlttIDwgaSArIDEgPyBtIDogaSArIDFdLCB2W20gPCBpICsgMiA/IG0gOiBpICsgMl0sIGYgLSBpKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFV0aWxzOiB7XG5cblx0XHRMaW5lYXI6IGZ1bmN0aW9uIChwMCwgcDEsIHQpIHtcblxuXHRcdFx0cmV0dXJuIChwMSAtIHAwKSAqIHQgKyBwMDtcblxuXHRcdH0sXG5cblx0XHRCZXJuc3RlaW46IGZ1bmN0aW9uIChuLCBpKSB7XG5cblx0XHRcdHZhciBmYyA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuRmFjdG9yaWFsO1xuXG5cdFx0XHRyZXR1cm4gZmMobikgLyBmYyhpKSAvIGZjKG4gLSBpKTtcblxuXHRcdH0sXG5cblx0XHRGYWN0b3JpYWw6IChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHZhciBhID0gWzFdO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKG4pIHtcblxuXHRcdFx0XHR2YXIgcyA9IDE7XG5cblx0XHRcdFx0aWYgKGFbbl0pIHtcblx0XHRcdFx0XHRyZXR1cm4gYVtuXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAodmFyIGkgPSBuOyBpID4gMTsgaS0tKSB7XG5cdFx0XHRcdFx0cyAqPSBpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YVtuXSA9IHM7XG5cdFx0XHRcdHJldHVybiBzO1xuXG5cdFx0XHR9O1xuXG5cdFx0fSkoKSxcblxuXHRcdENhdG11bGxSb206IGZ1bmN0aW9uIChwMCwgcDEsIHAyLCBwMywgdCkge1xuXG5cdFx0XHR2YXIgdjAgPSAocDIgLSBwMCkgKiAwLjU7XG5cdFx0XHR2YXIgdjEgPSAocDMgLSBwMSkgKiAwLjU7XG5cdFx0XHR2YXIgdDIgPSB0ICogdDtcblx0XHRcdHZhciB0MyA9IHQgKiB0MjtcblxuXHRcdFx0cmV0dXJuICgyICogcDEgLSAyICogcDIgKyB2MCArIHYxKSAqIHQzICsgKC0gMyAqIHAxICsgMyAqIHAyIC0gMiAqIHYwIC0gdjEpICogdDIgKyB2MCAqIHQgKyBwMTtcblxuXHRcdH1cblxuXHR9XG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRXRUVOO1xuIiwiaW1wb3J0IFR3ZWVuIGZyb20gXCIuL1R3ZWVuXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIOiuvue9riBBbmltYXRpb25GcmFtZSBiZWdpblxuICovXG52YXIgbGFzdFRpbWUgPSAwO1xudmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG59O1xuaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xufTtcbmlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xufTtcblxuLy/nrqHnkIbmiYDmnInlm77ooajnmoTmuLLmn5Pku7vliqFcbnZhciBfdGFza0xpc3QgPSBbXTsgLy9beyBpZCA6IHRhc2s6IH0uLi5dXG52YXIgX3JlcXVlc3RBaWQgPSBudWxsO1xuXG5mdW5jdGlvbiBlbmFibGVkQW5pbWF0aW9uRnJhbWUoKXtcbiAgICBpZiAoIV9yZXF1ZXN0QWlkKSB7XG4gICAgICAgIF9yZXF1ZXN0QWlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImZyYW1lX19cIiArIF90YXNrTGlzdC5sZW5ndGgpO1xuICAgICAgICAgICAgLy9pZiAoIFR3ZWVuLmdldEFsbCgpLmxlbmd0aCApIHtcbiAgICAgICAgICAgIFR3ZWVuLnVwZGF0ZSgpOyAvL3R3ZWVu6Ieq5bex5Lya5YGabGVuZ3Ro5Yik5patXG4gICAgICAgICAgICAvL307XG4gICAgICAgICAgICB2YXIgY3VyclRhc2tMaXN0ID0gX3Rhc2tMaXN0O1xuICAgICAgICAgICAgX3Rhc2tMaXN0ID0gW107XG4gICAgICAgICAgICBfcmVxdWVzdEFpZCA9IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoY3VyclRhc2tMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjdXJyVGFza0xpc3Quc2hpZnQoKS50YXNrKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBfcmVxdWVzdEFpZDtcbn07IFxuXG4vKlxuICogQHBhcmFtIHRhc2sg6KaB5Yqg5YWl5Yiw5riy5p+T5bin6Zif5YiX5Lit55qE5Lu75YqhXG4gKiBAcmVzdWx0IGZyYW1laWRcbiAqL1xuZnVuY3Rpb24gcmVnaXN0RnJhbWUoICRmcmFtZSApIHtcbiAgICBpZiAoISRmcmFtZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfTtcbiAgICBfdGFza0xpc3QucHVzaCgkZnJhbWUpO1xuICAgIHJldHVybiBlbmFibGVkQW5pbWF0aW9uRnJhbWUoKTtcbn07XG5cbi8qXG4gKiAgQHBhcmFtIHRhc2sg6KaB5LuO5riy5p+T5bin6Zif5YiX5Lit5Yig6Zmk55qE5Lu75YqhXG4gKi9cbmZ1bmN0aW9uIGRlc3Ryb3lGcmFtZSggJGZyYW1lICkge1xuICAgIHZhciBkX3Jlc3VsdCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gX3Rhc2tMaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoX3Rhc2tMaXN0W2ldLmlkID09PSAkZnJhbWUuaWQpIHtcbiAgICAgICAgICAgIGRfcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIF90YXNrTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBsLS07XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBpZiAoX3Rhc2tMaXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKF9yZXF1ZXN0QWlkKTtcbiAgICAgICAgX3JlcXVlc3RBaWQgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGRfcmVzdWx0O1xufTtcblxuXG4vKiBcbiAqIEBwYXJhbSBvcHQge2Zyb20gLCB0byAsIG9uVXBkYXRlICwgb25Db21wbGV0ZSAsIC4uLi4uLn1cbiAqIEByZXN1bHQgdHdlZW5cbiAqL1xuZnVuY3Rpb24gcmVnaXN0VHdlZW4ob3B0aW9ucykge1xuICAgIHZhciBvcHQgPSBfLmV4dGVuZCh7XG4gICAgICAgIGZyb206IG51bGwsXG4gICAgICAgIHRvOiBudWxsLFxuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpe30sXG4gICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICBvblN0b3A6IGZ1bmN0aW9uKCl7fSxcbiAgICAgICAgcmVwZWF0OiAwLFxuICAgICAgICBkZWxheTogMCxcbiAgICAgICAgZWFzaW5nOiAnTGluZWFyLk5vbmUnLFxuICAgICAgICBkZXNjOiAnJyAvL+WKqOeUu+aPj+i/sO+8jOaWueS+v+afpeaJvmJ1Z1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdmFyIHR3ZWVuID0ge307XG4gICAgdmFyIHRpZCA9IFwidHdlZW5fXCIgKyBVdGlscy5nZXRVSUQoKTtcbiAgICBvcHQuaWQgJiYgKCB0aWQgPSB0aWQrXCJfXCIrb3B0LmlkICk7XG5cbiAgICBpZiAob3B0LmZyb20gJiYgb3B0LnRvKSB7XG4gICAgICAgIHR3ZWVuID0gbmV3IFR3ZWVuLlR3ZWVuKCBvcHQuZnJvbSApXG4gICAgICAgIC50byggb3B0LnRvLCBvcHQuZHVyYXRpb24gKVxuICAgICAgICAub25TdGFydChmdW5jdGlvbigpe1xuICAgICAgICAgICAgb3B0Lm9uU3RhcnQuYXBwbHkoIHRoaXMgKVxuICAgICAgICB9KVxuICAgICAgICAub25VcGRhdGUoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBvcHQub25VcGRhdGUuYXBwbHkoIHRoaXMgKTtcbiAgICAgICAgfSApXG4gICAgICAgIC5vbkNvbXBsZXRlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlc3Ryb3lGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0d2Vlbi5faXNDb21wbGV0ZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9wdC5vbkNvbXBsZXRlLmFwcGx5KCB0aGlzICwgW3RoaXNdICk7IC8v5omn6KGM55So5oi355qEY29uQ29tcGxldGVcbiAgICAgICAgfSApXG4gICAgICAgIC5vblN0b3AoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBkZXN0cm95RnJhbWUoe1xuICAgICAgICAgICAgICAgIGlkOiB0aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHdlZW4uX2lzU3RvcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9wdC5vblN0b3AuYXBwbHkoIHRoaXMgLCBbdGhpc10gKTtcbiAgICAgICAgfSApXG4gICAgICAgIC5yZXBlYXQoIG9wdC5yZXBlYXQgKVxuICAgICAgICAuZGVsYXkoIG9wdC5kZWxheSApXG4gICAgICAgIC5lYXNpbmcoIFR3ZWVuLkVhc2luZ1tvcHQuZWFzaW5nLnNwbGl0KFwiLlwiKVswXV1bb3B0LmVhc2luZy5zcGxpdChcIi5cIilbMV1dIClcbiAgICAgICAgXG4gICAgICAgIHR3ZWVuLmlkID0gdGlkO1xuICAgICAgICB0d2Vlbi5zdGFydCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG5cbiAgICAgICAgICAgIGlmICggdHdlZW4uX2lzQ29tcGxldGVlZCB8fCB0d2Vlbi5faXNTdG9wZWQgKSB7XG4gICAgICAgICAgICAgICAgdHdlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWdpc3RGcmFtZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHRpZCxcbiAgICAgICAgICAgICAgICB0YXNrOiBhbmltYXRlLFxuICAgICAgICAgICAgICAgIGRlc2M6IG9wdC5kZXNjLFxuICAgICAgICAgICAgICAgIHR3ZWVuOiB0d2VlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGFuaW1hdGUoKTtcblxuICAgIH07XG4gICAgcmV0dXJuIHR3ZWVuO1xufTtcbi8qXG4gKiBAcGFyYW0gdHdlZW5cbiAqIEByZXN1bHQgdm9pZCgwKVxuICovXG5mdW5jdGlvbiBkZXN0cm95VHdlZW4odHdlZW4gLCBtc2cpIHtcbiAgICB0d2Vlbi5zdG9wKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcmVnaXN0RnJhbWU6IHJlZ2lzdEZyYW1lLFxuICAgIGRlc3Ryb3lGcmFtZTogZGVzdHJveUZyYW1lLFxuICAgIHJlZ2lzdFR3ZWVuOiByZWdpc3RUd2VlbixcbiAgICBkZXN0cm95VHdlZW46IGRlc3Ryb3lUd2VlblxufTsiLCIvKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDlsZ7mgKflt6XljoLvvIxpZeS4i+mdoueUqFZCU+aPkOS+m+aUr+aMgVxuICog5p2l57uZ5pW05Liq5byV5pOO5o+Q5L6b5b+D6Lez5YyF55qE6Kem5Y+R5py65Yi2XG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5cbi8v5a6a5LmJ5bCB6KOF5aW955qE5YW85a655aSn6YOo5YiG5rWP6KeI5Zmo55qEZGVmaW5lUHJvcGVydGllcyDnmoQg5bGe5oCn5bel5Y6CXG52YXIgdW53YXRjaE9uZSA9IHtcbiAgICBcIiRza2lwQXJyYXlcIiA6IDAsXG4gICAgXCIkd2F0Y2hcIiAgICAgOiAxLFxuICAgIFwiJGZpcmVcIiAgICAgIDogMiwvL+S4u+imgeaYr2dldCBzZXQg5pi+5oCn6K6+572u55qEIOinpuWPkVxuICAgIFwiJG1vZGVsXCIgICAgIDogMyxcbiAgICBcIiRhY2Nlc3NvclwiICA6IDQsXG4gICAgXCIkb3duZXJcIiAgICAgOiA1LFxuICAgIC8vXCJwYXRoXCIgICAgICAgOiA2LCAvL+i/meS4quW6lOivpeaYr+WUr+S4gOS4gOS4quS4jeeUqHdhdGNo55qE5LiN5bimJOeahOaIkOWRmOS6huWQp++8jOWboOS4uuWcsOWbvuetieeahHBhdGjmmK/lnKjlpKrlpKdcbiAgICBcIiRwYXJlbnRcIiAgICA6IDcgIC8v55So5LqO5bu656uL5pWw5o2u55qE5YWz57O76ZO+XG59XG5cbmZ1bmN0aW9uIE9ic2VydmUoc2NvcGUsIG1vZGVsLCB3YXRjaE1vcmUpIHtcblxuICAgIHZhciBzdG9wUmVwZWF0QXNzaWduPXRydWU7XG5cbiAgICB2YXIgc2tpcEFycmF5ID0gc2NvcGUuJHNraXBBcnJheSwgLy/opoHlv73nlaXnm5HmjqfnmoTlsZ7mgKflkI3liJfooahcbiAgICAgICAgcG1vZGVsID0ge30sIC8v6KaB6L+U5Zue55qE5a+56LGhXG4gICAgICAgIGFjY2Vzc29yZXMgPSB7fSwgLy/lhoXpg6jnlKjkuo7ovazmjaLnmoTlr7nosaFcbiAgICAgICAgVkJQdWJsaWNzID0gXy5rZXlzKCB1bndhdGNoT25lICk7IC8v55So5LqOSUU2LThcblxuICAgICAgICBtb2RlbCA9IG1vZGVsIHx8IHt9Oy8v6L+Z5pivcG1vZGVs5LiK55qEJG1vZGVs5bGe5oCnXG4gICAgICAgIHdhdGNoTW9yZSA9IHdhdGNoTW9yZSB8fCB7fTsvL+S7pSTlvIDlpLTkvYbopoHlvLrliLbnm5HlkKznmoTlsZ7mgKdcbiAgICAgICAgc2tpcEFycmF5ID0gXy5pc0FycmF5KHNraXBBcnJheSkgPyBza2lwQXJyYXkuY29uY2F0KFZCUHVibGljcykgOiBWQlB1YmxpY3M7XG5cbiAgICBmdW5jdGlvbiBsb29wKG5hbWUsIHZhbCkge1xuICAgICAgICBpZiAoICF1bndhdGNoT25lW25hbWVdIHx8ICh1bndhdGNoT25lW25hbWVdICYmIG5hbWUuY2hhckF0KDApICE9PSBcIiRcIikgKSB7XG4gICAgICAgICAgICBtb2RlbFtuYW1lXSA9IHZhbFxuICAgICAgICB9O1xuICAgICAgICB2YXIgdmFsdWVUeXBlID0gdHlwZW9mIHZhbDtcbiAgICAgICAgaWYgKHZhbHVlVHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBpZighdW53YXRjaE9uZVtuYW1lXSl7XG4gICAgICAgICAgICAgIFZCUHVibGljcy5wdXNoKG5hbWUpIC8v5Ye95pWw5peg6ZyA6KaB6L2s5o2iXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoXy5pbmRleE9mKHNraXBBcnJheSxuYW1lKSAhPT0gLTEgfHwgKG5hbWUuY2hhckF0KDApID09PSBcIiRcIiAmJiAhd2F0Y2hNb3JlW25hbWVdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBWQlB1YmxpY3MucHVzaChuYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFjY2Vzc29yID0gZnVuY3Rpb24obmVvKSB7IC8v5Yib5bu655uR5o6n5bGe5oCn5oiW5pWw57uE77yM6Ieq5Y+Y6YeP77yM55Sx55So5oi36Kem5Y+R5YW25pS55Y+YXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYWNjZXNzb3IudmFsdWUsIHByZVZhbHVlID0gdmFsdWUsIGNvbXBsZXhWYWx1ZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvL+WGmeaTjeS9nFxuICAgICAgICAgICAgICAgICAgICAvL3NldCDnmoQg5YC855qEIOexu+Wei1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmVvVHlwZSA9IHR5cGVvZiBuZW87XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3BSZXBlYXRBc3NpZ24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAvL+mYu+atoumHjeWkjei1i+WAvFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbmVvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggbmVvICYmIG5lb1R5cGUgPT09IFwib2JqZWN0XCIgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIShuZW8gaW5zdGFuY2VvZiBBcnJheSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhbmVvLmFkZENvbG9yU3RvcCAvLyBuZW8gaW5zdGFuY2VvZiBDYW52YXNHcmFkaWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBuZW8uJG1vZGVsID8gbmVvIDogT2JzZXJ2ZShuZW8gLCBuZW8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhWYWx1ZSA9IHZhbHVlLiRtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7Ly/lpoLmnpzmmK/lhbbku5bmlbDmja7nsbvlnotcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmKCBuZW9UeXBlID09PSBcImFycmF5XCIgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB2YWx1ZSA9IF8uY2xvbmUobmVvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmVvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3Nvci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSBjb21wbGV4VmFsdWUgPyBjb21wbGV4VmFsdWUgOiB2YWx1ZTsvL+abtOaWsCRtb2RlbOS4reeahOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wbGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbW9kZWwuJGZpcmUgJiYgcG1vZGVsLiRmaXJlKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlVHlwZSAhPSBuZW9UeXBlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenHNldOeahOWAvOexu+Wei+W3sue7j+aUueWPmO+8jFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKj5LmI5Lmf6KaB5oqK5a+55bqU55qEdmFsdWVUeXBl5L+u5pS55Li65a+55bqU55qEbmVvVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZSA9IG5lb1R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzV2F0Y2hNb2RlbCA9IHBtb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5omA5pyJ55qE6LWL5YC86YO96KaB6Kem5Y+Rd2F0Y2jnmoTnm5HlkKzkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIXBtb2RlbC4kd2F0Y2ggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlKCBoYXNXYXRjaE1vZGVsLiRwYXJlbnQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2F0Y2hNb2RlbCA9IGhhc1dhdGNoTW9kZWwuJHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBoYXNXYXRjaE1vZGVsLiR3YXRjaCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2F0Y2hNb2RlbC4kd2F0Y2guY2FsbChoYXNXYXRjaE1vZGVsICwgbmFtZSwgdmFsdWUsIHByZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6K+75pON5L2cXG4gICAgICAgICAgICAgICAgICAgIC8v6K+755qE5pe25YCZ77yM5Y+R546wdmFsdWXmmK/kuKpvYmrvvIzogIzkuJTov5jmsqHmnIlkZWZpbmVQcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAvL+mCo+S5iOWwseS4tOaXtmRlZmluZVByb3BlcnR55LiA5qyhXG4gICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgJiYgKHZhbHVlVHlwZSA9PT0gXCJvYmplY3RcIikgXG4gICAgICAgICAgICAgICAgICAgICAgICYmICEodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkgXG4gICAgICAgICAgICAgICAgICAgICAgICYmICF2YWx1ZS4kbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgJiYgIXZhbHVlLmFkZENvbG9yU3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lu7rnq4vlkozniLbmlbDmja7oioLngrnnmoTlhbPns7tcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLiRwYXJlbnQgPSBwbW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IE9ic2VydmUodmFsdWUgLCB2YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYWNjZXNzb3IudmFsdWUg6YeN5paw5aSN5Yi25Li6ZGVmaW5lUHJvcGVydHnov4flkI7nmoTlr7nosaFcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc29yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhY2Nlc3Nvci52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWNjZXNzb3Jlc1tuYW1lXSA9IHtcbiAgICAgICAgICAgICAgICBzZXQ6IGFjY2Vzc29yLFxuICAgICAgICAgICAgICAgIGdldDogYWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBmb3IgKHZhciBpIGluIHNjb3BlKSB7XG4gICAgICAgIGxvb3AoaSwgc2NvcGVbaV0pXG4gICAgfTtcblxuICAgIHBtb2RlbCA9IGRlZmluZVByb3BlcnRpZXMocG1vZGVsLCBhY2Nlc3NvcmVzLCBWQlB1YmxpY3MpOy8v55Sf5oiQ5LiA5Liq56m655qEVmlld01vZGVsXG5cbiAgICBfLmZvckVhY2goVkJQdWJsaWNzLGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKHNjb3BlW25hbWVdKSB7Ly/lhYjkuLrlh73mlbDnrYnkuI3ooqvnm5HmjqfnmoTlsZ7mgKfotYvlgLxcbiAgICAgICAgICAgIGlmKHR5cGVvZiBzY29wZVtuYW1lXSA9PSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgICAgICAgICAgIHBtb2RlbFtuYW1lXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICBzY29wZVtuYW1lXS5hcHBseSh0aGlzICwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBwbW9kZWxbbmFtZV0gPSBzY29wZVtuYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcG1vZGVsLiRtb2RlbCA9IG1vZGVsO1xuICAgIHBtb2RlbC4kYWNjZXNzb3IgPSBhY2Nlc3NvcmVzO1xuXG4gICAgcG1vZGVsLmhhc093blByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiBwbW9kZWwuJG1vZGVsXG4gICAgfTtcblxuICAgIHN0b3BSZXBlYXRBc3NpZ24gPSBmYWxzZTtcblxuICAgIHJldHVybiBwbW9kZWxcbn1cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuICAgIC8v5aaC5p6c5rWP6KeI5Zmo5LiN5pSv5oyBZWNtYTI2MnY155qET2JqZWN0LmRlZmluZVByb3BlcnRpZXPmiJbogIXlrZjlnKhCVUfvvIzmr5TlpoJJRThcbiAgICAvL+agh+WHhua1j+iniOWZqOS9v+eUqF9fZGVmaW5lR2V0dGVyX18sIF9fZGVmaW5lU2V0dGVyX1/lrp7njrBcbiAgICB0cnkge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh7fSwgXCJfXCIsIHtcbiAgICAgICAgICAgIHZhbHVlOiBcInhcIlxuICAgICAgICB9KVxuICAgICAgICB2YXIgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoXCJfX2RlZmluZUdldHRlcl9fXCIgaW4gT2JqZWN0KSB7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9iaiwgcHJvcCwgZGVzYykge1xuICAgICAgICAgICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gZGVzYy52YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJ2dldCcgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgICAgICBvYmouX19kZWZpbmVHZXR0ZXJfXyhwcm9wLCBkZXNjLmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCdzZXQnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9fZGVmaW5lU2V0dGVyX18ocHJvcCwgZGVzYy5zZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24ob2JqLCBkZXNjcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gZGVzY3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NzW3Byb3BdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4vL0lFNi045L2/55SoVkJTY3JpcHTnsbvnmoRzZXQgZ2V06K+t5Y+l5a6e546wXG5pZiAoIWRlZmluZVByb3BlcnRpZXMgJiYgd2luZG93LlZCQXJyYXkpIHtcbiAgICB3aW5kb3cuZXhlY1NjcmlwdChbXG4gICAgICAgICAgICBcIkZ1bmN0aW9uIHBhcnNlVkIoY29kZSlcIixcbiAgICAgICAgICAgIFwiXFx0RXhlY3V0ZUdsb2JhbChjb2RlKVwiLFxuICAgICAgICAgICAgXCJFbmQgRnVuY3Rpb25cIlxuICAgICAgICAgICAgXS5qb2luKFwiXFxuXCIpLCBcIlZCU2NyaXB0XCIpO1xuXG4gICAgZnVuY3Rpb24gVkJNZWRpYXRvcihkZXNjcmlwdGlvbiwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGZuID0gZGVzY3JpcHRpb25bbmFtZV0gJiYgZGVzY3JpcHRpb25bbmFtZV0uc2V0O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgZm4odmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihwdWJsaWNzLCBkZXNjcmlwdGlvbiwgYXJyYXkpIHtcbiAgICAgICAgcHVibGljcyA9IGFycmF5LnNsaWNlKDApO1xuICAgICAgICBwdWJsaWNzLnB1c2goXCJoYXNPd25Qcm9wZXJ0eVwiKTtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiVkJDbGFzc1wiICsgc2V0VGltZW91dChcIjFcIiksIG93bmVyID0ge30sIGJ1ZmZlciA9IFtdO1xuICAgICAgICBidWZmZXIucHVzaChcbiAgICAgICAgICAgICAgICBcIkNsYXNzIFwiICsgY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgIFwiXFx0UHJpdmF0ZSBbX19kYXRhX19dLCBbX19wcm94eV9fXVwiLFxuICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIERlZmF1bHQgRnVuY3Rpb24gW19fY29uc3RfX10oZCwgcClcIixcbiAgICAgICAgICAgICAgICBcIlxcdFxcdFNldCBbX19kYXRhX19dID0gZDogc2V0IFtfX3Byb3h5X19dID0gcFwiLFxuICAgICAgICAgICAgICAgIFwiXFx0XFx0U2V0IFtfX2NvbnN0X19dID0gTWVcIiwgLy/pk77lvI/osIPnlKhcbiAgICAgICAgICAgICAgICBcIlxcdEVuZCBGdW5jdGlvblwiKTtcbiAgICAgICAgXy5mb3JFYWNoKHB1YmxpY3MsZnVuY3Rpb24obmFtZSkgeyAvL+a3u+WKoOWFrOWFseWxnuaApyzlpoLmnpzmraTml7bkuI3liqDku6XlkI7lsLHmsqHmnLrkvJrkuoZcbiAgICAgICAgICAgIGlmIChvd25lcltuYW1lXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIG93bmVyW25hbWVdID0gdHJ1ZSAvL+WboOS4ulZCU2NyaXB05a+56LGh5LiN6IO95YOPSlPpgqPmoLfpmo/mhI/lop7liKDlsZ7mgKdcbiAgICAgICAgICAgIGJ1ZmZlci5wdXNoKFwiXFx0UHVibGljIFtcIiArIG5hbWUgKyBcIl1cIikgLy/kvaDlj6/ku6XpooTlhYjmlL7liLBza2lwQXJyYXnkuK1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIG93bmVyW25hbWVdID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLHkuo7kuI3nn6Xlr7nmlrnkvJrkvKDlhaXku4DkuYgs5Zug5q2kc2V0LCBsZXTpg73nlKjkuIpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0UHVibGljIFByb3BlcnR5IExldCBbXCIgKyBuYW1lICsgXCJdKHZhbClcIiwgLy9zZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0Q2FsbCBbX19wcm94eV9fXShbX19kYXRhX19dLCBcXFwiXCIgKyBuYW1lICsgXCJcXFwiLCB2YWwpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdEVuZCBQcm9wZXJ0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRQdWJsaWMgUHJvcGVydHkgU2V0IFtcIiArIG5hbWUgKyBcIl0odmFsKVwiLCAvL3NldHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRcXHRDYWxsIFtfX3Byb3h5X19dKFtfX2RhdGFfX10sIFxcXCJcIiArIG5hbWUgKyBcIlxcXCIsIHZhbClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIFByb3BlcnR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdFB1YmxpYyBQcm9wZXJ0eSBHZXQgW1wiICsgbmFtZSArIFwiXVwiLCAvL2dldHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRPbiBFcnJvciBSZXN1bWUgTmV4dFwiLCAvL+W/hemhu+S8mOWFiOS9v+eUqHNldOivreWPpSzlkKbliJnlroPkvJror6/lsIbmlbDnu4TlvZPlrZfnrKbkuLLov5Tlm55cbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0U2V0W1wiICsgbmFtZSArIFwiXSA9IFtfX3Byb3h5X19dKFtfX2RhdGFfX10sXFxcIlwiICsgbmFtZSArIFwiXFxcIilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0SWYgRXJyLk51bWJlciA8PiAwIFRoZW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0XFx0W1wiICsgbmFtZSArIFwiXSA9IFtfX3Byb3h5X19dKFtfX2RhdGFfX10sXFxcIlwiICsgbmFtZSArIFwiXFxcIilcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0RW5kIElmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcdE9uIEVycm9yIEdvdG8gMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRFbmQgUHJvcGVydHlcIilcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIucHVzaChcIkVuZCBDbGFzc1wiKTsgLy/nsbvlrprkuYnlrozmr5VcbiAgICAgICAgYnVmZmVyLnB1c2goXG4gICAgICAgICAgICAgICAgXCJGdW5jdGlvbiBcIiArIGNsYXNzTmFtZSArIFwiRmFjdG9yeShhLCBiKVwiLCAvL+WIm+W7uuWunuS+i+W5tuS8oOWFpeS4pOS4quWFs+mUrueahOWPguaVsFxuICAgICAgICAgICAgICAgIFwiXFx0RGltIG9cIixcbiAgICAgICAgICAgICAgICBcIlxcdFNldCBvID0gKE5ldyBcIiArIGNsYXNzTmFtZSArIFwiKShhLCBiKVwiLFxuICAgICAgICAgICAgICAgIFwiXFx0U2V0IFwiICsgY2xhc3NOYW1lICsgXCJGYWN0b3J5ID0gb1wiLFxuICAgICAgICAgICAgICAgIFwiRW5kIEZ1bmN0aW9uXCIpO1xuICAgICAgICB3aW5kb3cucGFyc2VWQihidWZmZXIuam9pbihcIlxcclxcblwiKSk7Ly/lhYjliJvlu7rkuIDkuKpWQuexu+W3peWOglxuICAgICAgICByZXR1cm4gIHdpbmRvd1tjbGFzc05hbWUgKyBcIkZhY3RvcnlcIl0oZGVzY3JpcHRpb24sIFZCTWVkaWF0b3IpOy8v5b6X5Yiw5YW25Lqn5ZOBXG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgT2JzZXJ2ZTtcblxuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIERpc3BsYXlMaXN0IOeahCDnjrDlrp7lr7nosaHln7rnsbtcbiAqL1xuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcbmltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4uL2V2ZW50L0V2ZW50RGlzcGF0Y2hlclwiO1xuaW1wb3J0IE1hdHJpeCBmcm9tIFwiLi4vZ2VvbS9NYXRyaXhcIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IEhpdFRlc3RQb2ludCBmcm9tIFwiLi4vZ2VvbS9IaXRUZXN0UG9pbnRcIjtcbmltcG9ydCBBbmltYXRpb25GcmFtZSBmcm9tIFwiLi4vYW5pbWF0aW9uL0FuaW1hdGlvbkZyYW1lXCI7XG5pbXBvcnQgT2JzZXJ2ZSBmcm9tIFwiLi4vdXRpbHMvb2JzZXJ2ZVwiO1xuXG52YXIgRGlzcGxheU9iamVjdCA9IGZ1bmN0aW9uKG9wdCl7XG4gICAgRGlzcGxheU9iamVjdC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy/lpoLmnpznlKjmiLfmsqHmnInkvKDlhaVjb250ZXh06K6+572u77yM5bCx6buY6K6k5Li656m655qE5a+56LGhXG4gICAgb3B0ICAgICAgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XG5cbiAgICAvL+iuvue9rum7mOiupOWxnuaAp1xuICAgIHNlbGYuaWQgID0gb3B0LmlkIHx8IG51bGw7XG5cbiAgICAvL+ebuOWvueeItue6p+WFg+e0oOeahOefqemYtVxuICAgIHNlbGYuX3RyYW5zZm9ybSAgICAgID0gbnVsbDtcblxuICAgIC8v5b+D6Lez5qyh5pWwXG4gICAgc2VsZi5faGVhcnRCZWF0TnVtICAgPSAwO1xuXG4gICAgLy/lhYPntKDlr7nlupTnmoRzdGFnZeWFg+e0oFxuICAgIHNlbGYuc3RhZ2UgICAgICAgICAgID0gbnVsbDtcblxuICAgIC8v5YWD57Sg55qE54i25YWD57SgXG4gICAgc2VsZi5wYXJlbnQgICAgICAgICAgPSBudWxsO1xuXG4gICAgc2VsZi5fZXZlbnRFbmFibGVkICAgPSBmYWxzZTsgICAvL+aYr+WQpuWTjeW6lOS6i+S7tuS6pOS6kizlnKjmt7vliqDkuobkuovku7bkvqblkKzlkI7kvJroh6rliqjorr7nva7kuLp0cnVlXG5cbiAgICBzZWxmLmRyYWdFbmFibGVkICAgICA9IHRydWUgOy8vXCJkcmFnRW5hYmxlZFwiIGluIG9wdCA/IG9wdC5kcmFnRW5hYmxlZCA6IGZhbHNlOyAgIC8v5piv5ZCm5ZCv55So5YWD57Sg55qE5ouW5ou9XG5cbiAgICBzZWxmLnh5VG9JbnQgICAgICAgICA9IFwieHlUb0ludFwiIGluIG9wdCA/IG9wdC54eVRvSW50IDogdHJ1ZTsgICAgLy/mmK/lkKblr7l4eeWdkOagh+e7n+S4gGludOWkhOeQhu+8jOm7mOiupOS4unRydWXvvIzkvYbmmK/mnInnmoTml7blgJnlj6/ku6XnlLHlpJbnlYznlKjmiLfmiYvliqjmjIflrprmmK/lkKbpnIDopoHorqHnrpfkuLppbnTvvIzlm6DkuLrmnInnmoTml7blgJnkuI3orqHnrpfmr5TovoPlpb3vvIzmr5TlpoLvvIzov5vluqblm77ooajkuK3vvIzlho1zZWN0b3LnmoTkuKTnq6/mt7vliqDkuKTkuKrlnIbmnaXlgZrlnIbop5LnmoTov5vluqbmnaHnmoTml7blgJnvvIzlnIZjaXJjbGXkuI3lgZppbnTorqHnrpfvvIzmiY3og73lkoxzZWN0b3Lmm7Tlpb3nmoTooZTmjqVcblxuICAgIHNlbGYubW92ZWluZyA9IGZhbHNlOyAvL+WmguaenOWFg+e0oOWcqOacgOi9qOmBk+i/kOWKqOS4reeahOaXtuWAme+8jOacgOWlveaKiui/meS4quiuvue9ruS4unRydWXvvIzov5nmoLfog73kv53or4Hovajov7nnmoTkuJ3mkKzpobrmu5HvvIzlkKbliJnlm6DkuLp4eVRvSW5055qE5Y6f5Zug77yM5Lya5pyJ6Lez6LeDXG5cbiAgICAvL+WIm+W7uuWlvWNvbnRleHRcbiAgICBzZWxmLl9jcmVhdGVDb250ZXh0KCBvcHQgKTtcblxuICAgIHZhciBVSUQgPSBVdGlscy5jcmVhdGVJZChzZWxmLnR5cGUpO1xuXG4gICAgLy/lpoLmnpzmsqHmnIlpZCDliJkg5rK/55SodWlkXG4gICAgaWYoc2VsZi5pZCA9PSBudWxsKXtcbiAgICAgICAgc2VsZi5pZCA9IFVJRCA7XG4gICAgfTtcblxuICAgIHNlbGYuaW5pdC5hcHBseShzZWxmICwgYXJndW1lbnRzKTtcblxuICAgIC8v5omA5pyJ5bGe5oCn5YeG5aSH5aW95LqG5ZCO77yM5YWI6KaB6K6h566X5LiA5qyhdGhpcy5fdXBkYXRlVHJhbnNmb3JtKCnlvpfliLBfdGFuc2Zvcm1cbiAgICB0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKTtcbn07XG5cbi8qKlxuICog566A5Y2V55qE5rWF5aSN5Yi25a+56LGh44CCXG4gKiBAcGFyYW0gc3RyaWN0ICDlvZPkuLp0cnVl5pe25Y+q6KaG55uW5bey5pyJ5bGe5oCnXG4gKi9cbnZhciBjb3B5ID0gZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UsIHN0cmljdCl7IFxuICAgIGlmICggXy5pc0VtcHR5KHNvdXJjZSkgKXtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgZm9yKHZhciBrZXkgaW4gc291cmNlKXtcbiAgICAgICAgaWYoIXN0cmljdCB8fCB0YXJnZXQuaGFzT3duUHJvcGVydHkoa2V5KSB8fCB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3QgLCBFdmVudERpc3BhdGNoZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7fSxcbiAgICBfY3JlYXRlQ29udGV4dCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+aJgOacieaYvuekuuWvueixoe+8jOmDveacieS4gOS4quexu+S8vGNhbnZhcy5jb250ZXh057G75Ly855qEIGNvbnRleHTlsZ7mgKdcbiAgICAgICAgLy/nlKjmnaXlrZjlj5bmlLnmmL7npLrlr7nosaHmiYDmnInlkozmmL7npLrmnInlhbPnmoTlsZ7mgKfvvIzlnZDmoIfvvIzmoLflvI/nrYnjgIJcbiAgICAgICAgLy/or6Xlr7nosaHkuLpDb2VyLk9ic2VydmUoKeW3peWOguWHveaVsOeUn+aIkFxuICAgICAgICBzZWxmLmNvbnRleHQgPSBudWxsO1xuXG4gICAgICAgIC8v5o+Q5L6b57uZQ29lci5PYnNlcnZlKCkg5p2lIOe7mSBzZWxmLmNvbnRleHQg6K6+572uIHByb3BlcnR5c1xuICAgICAgICAvL+i/memHjOS4jeiDveeUqF8uZXh0ZW5k77yMIOWboOS4uuimgeS/neivgV9jb250ZXh0QVRUUlPnmoTnuq/nsrnvvIzlj6ropobnm5bkuIvpnaLlt7LmnInnmoTlsZ7mgKdcbiAgICAgICAgdmFyIF9jb250ZXh0QVRUUlMgPSBjb3B5KCB7XG4gICAgICAgICAgICB3aWR0aCAgICAgICAgIDogMCxcbiAgICAgICAgICAgIGhlaWdodCAgICAgICAgOiAwLFxuICAgICAgICAgICAgeCAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICB5ICAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgIHNjYWxlWCAgICAgICAgOiAxLFxuICAgICAgICAgICAgc2NhbGVZICAgICAgICA6IDEsXG4gICAgICAgICAgICBzY2FsZU9yaWdpbiAgIDoge1xuICAgICAgICAgICAgICAgIHggOiAwLFxuICAgICAgICAgICAgICAgIHkgOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm90YXRpb24gICAgICA6IDAsXG4gICAgICAgICAgICByb3RhdGVPcmlnaW4gIDogIHtcbiAgICAgICAgICAgICAgICB4IDogMCxcbiAgICAgICAgICAgICAgICB5IDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGUgICAgICAgOiB0cnVlLFxuICAgICAgICAgICAgY3Vyc29yICAgICAgICA6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgLy9jYW52YXMgY29udGV4dCAyZCDnmoQg57O757uf5qC35byP44CC55uu5YmN5bCx55+l6YGT6L+Z5LmI5aSaXG4gICAgICAgICAgICBmaWxsU3R5bGUgICAgIDogbnVsbCwvL1wiIzAwMDAwMFwiLFxuICAgICAgICAgICAgbGluZUNhcCAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBsaW5lSm9pbiAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIGxpbmVXaWR0aCAgICAgOiBudWxsLFxuICAgICAgICAgICAgbWl0ZXJMaW1pdCAgICA6IG51bGwsXG4gICAgICAgICAgICBzaGFkb3dCbHVyICAgIDogbnVsbCxcbiAgICAgICAgICAgIHNoYWRvd0NvbG9yICAgOiBudWxsLFxuICAgICAgICAgICAgc2hhZG93T2Zmc2V0WCA6IG51bGwsXG4gICAgICAgICAgICBzaGFkb3dPZmZzZXRZIDogbnVsbCxcbiAgICAgICAgICAgIHN0cm9rZVN0eWxlICAgOiBudWxsLFxuICAgICAgICAgICAgZ2xvYmFsQWxwaGEgICA6IDEsXG4gICAgICAgICAgICBmb250ICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIHRleHRBbGlnbiAgICAgOiBcImxlZnRcIixcbiAgICAgICAgICAgIHRleHRCYXNlbGluZSAgOiBcInRvcFwiLCBcbiAgICAgICAgICAgIGFyY1NjYWxlWF8gICAgOiBudWxsLFxuICAgICAgICAgICAgYXJjU2NhbGVZXyAgICA6IG51bGwsXG4gICAgICAgICAgICBsaW5lU2NhbGVfICAgIDogbnVsbCxcbiAgICAgICAgICAgIGdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA6IG51bGxcbiAgICAgICAgfSAsIG9wdC5jb250ZXh0ICwgdHJ1ZSApOyAgICAgICAgICAgIFxuXG4gICAgICAgIC8v54S25ZCO55yL57un5om/6ICF5piv5ZCm5pyJ5o+Q5L6bX2NvbnRleHQg5a+56LGhIOmcgOimgSDmiJEgbWVyZ2XliLBfY29udGV4dDJEX2NvbnRleHTkuK3ljrvnmoRcbiAgICAgICAgaWYgKHNlbGYuX2NvbnRleHQpIHtcbiAgICAgICAgICAgIF9jb250ZXh0QVRUUlMgPSBfLmV4dGVuZChfY29udGV4dEFUVFJTICwgc2VsZi5fY29udGV4dCApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/mnInkupvlvJXmk47lhoXpg6jorr7nva5jb250ZXh05bGe5oCn55qE5pe25YCZ5piv5LiN55So5LiK5oql5b+D6Lez55qE77yM5q+U5aaC5YGaaGl0VGVzdFBvaW5054Ot54K55qOA5rWL55qE5pe25YCZXG4gICAgICAgIHNlbGYuX25vdFdhdGNoID0gZmFsc2U7XG5cbiAgICAgICAgX2NvbnRleHRBVFRSUy4kb3duZXIgPSBzZWxmO1xuICAgICAgICBfY29udGV4dEFUVFJTLiR3YXRjaCA9IGZ1bmN0aW9uKG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlKXtcblxuICAgICAgICAgICAgLy/kuIvpnaLnmoTov5nkupvlsZ7mgKflj5jljJbvvIzpg73kvJrpnIDopoHph43mlrDnu4Tnu4fnn6npmLXlsZ7mgKdfdHJhbnNmb3JtIFxuICAgICAgICAgICAgdmFyIHRyYW5zRm9ybVByb3BzID0gWyBcInhcIiAsIFwieVwiICwgXCJzY2FsZVhcIiAsIFwic2NhbGVZXCIgLCBcInJvdGF0aW9uXCIgLCBcInNjYWxlT3JpZ2luXCIgLCBcInJvdGF0ZU9yaWdpbiwgbGluZVdpZHRoXCIgXTtcblxuICAgICAgICAgICAgaWYoIF8uaW5kZXhPZiggdHJhbnNGb3JtUHJvcHMgLCBuYW1lICkgPj0gMCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRvd25lci5fdXBkYXRlVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiggdGhpcy4kb3duZXIuX25vdFdhdGNoICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYoIHRoaXMuJG93bmVyLiR3YXRjaCApe1xuICAgICAgICAgICAgICAgIHRoaXMuJG93bmVyLiR3YXRjaCggbmFtZSAsIHZhbHVlICwgcHJlVmFsdWUgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJG93bmVyLmhlYXJ0QmVhdCgge1xuICAgICAgICAgICAgICAgIGNvbnZlcnRUeXBlOlwiY29udGV4dFwiLFxuICAgICAgICAgICAgICAgIHNoYXBlICAgICAgOiB0aGlzLiRvd25lcixcbiAgICAgICAgICAgICAgICBuYW1lICAgICAgIDogbmFtZSxcbiAgICAgICAgICAgICAgICB2YWx1ZSAgICAgIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgcHJlVmFsdWUgICA6IHByZVZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9O1xuXG4gICAgICAgIC8v5omn6KGMaW5pdOS5i+WJje+8jOW6lOivpeWwseagueaNruWPguaVsO+8jOaKimNvbnRleHTnu4Tnu4flpb3nur9cbiAgICAgICAgc2VsZi5jb250ZXh0ID0gT2JzZXJ2ZSggX2NvbnRleHRBVFRSUyApO1xuICAgIH0sXG4gICAgLyogQG15c2VsZiDmmK/lkKbnlJ/miJDoh6rlt7HnmoTplZzlg48gXG4gICAgICog5YWL6ZqG5Y+I5Lik56eN77yM5LiA56eN5piv6ZWc5YOP77yM5Y+m5aSW5LiA56eN5piv57ud5a+55oSP5LmJ5LiK6Z2i55qE5paw5Liq5L2TXG4gICAgICog6buY6K6k5Li657ud5a+55oSP5LmJ5LiK6Z2i55qE5paw5Liq5L2T77yM5paw5a+56LGhaWTkuI3og73nm7jlkIxcbiAgICAgKiDplZzlg4/ln7rmnKzkuIrmmK/moYbmnrblhoXpg6jlnKjlrp7njrAgIOmVnOWDj+eahGlk55u45ZCMIOS4u+imgeeUqOadpeaKiuiHquW3seeUu+WIsOWPpuWklueahHN0YWdl6YeM6Z2i77yM5q+U5aaCXG4gICAgICogbW91c2VvdmVy5ZKMbW91c2VvdXTnmoTml7blgJnosIPnlKgqL1xuICAgIGNsb25lIDogZnVuY3Rpb24oIG15c2VsZiApe1xuICAgICAgICB2YXIgY29uZiAgID0ge1xuICAgICAgICAgICAgaWQgICAgICA6IHRoaXMuaWQsXG4gICAgICAgICAgICBjb250ZXh0IDogXy5jbG9uZSh0aGlzLmNvbnRleHQuJG1vZGVsKVxuICAgICAgICB9O1xuICAgICAgICBpZiggdGhpcy5pbWcgKXtcbiAgICAgICAgICAgIGNvbmYuaW1nID0gdGhpcy5pbWc7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBuZXdPYmo7XG4gICAgICAgIGlmKCB0aGlzLnR5cGUgPT0gJ3RleHQnICl7XG4gICAgICAgICAgICBuZXdPYmogPSBuZXcgdGhpcy5jb25zdHJ1Y3RvciggdGhpcy50ZXh0ICwgY29uZiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3T2JqID0gbmV3IHRoaXMuY29uc3RydWN0b3IoIGNvbmYgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5jaGlsZHJlbiApe1xuICAgICAgICAgICAgbmV3T2JqLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW15c2VsZil7XG4gICAgICAgICAgICBuZXdPYmouaWQgICAgICAgPSBVdGlscy5jcmVhdGVJZChuZXdPYmoudHlwZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfSxcbiAgICBoZWFydEJlYXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICAvL3N0YWdl5a2Y5Zyo77yM5omN6K+0c2VsZuS7o+ihqOeahGRpc3BsYXnlt7Lnu4/ooqvmt7vliqDliLDkuoZkaXNwbGF5TGlzdOS4re+8jOe7mOWbvuW8leaTjumcgOimgeefpemBk+WFtuaUueWPmOWQjlxuICAgICAgICAvL+eahOWxnuaAp++8jOaJgOS7pe+8jOmAmuefpeWIsHN0YWdlLmRpc3BsYXlBdHRySGFzQ2hhbmdlXG4gICAgICAgIHZhciBzdGFnZSA9IHRoaXMuZ2V0U3RhZ2UoKTtcbiAgICAgICAgaWYoIHN0YWdlICl7XG4gICAgICAgICAgICB0aGlzLl9oZWFydEJlYXROdW0gKys7XG4gICAgICAgICAgICBzdGFnZS5oZWFydEJlYXQgJiYgc3RhZ2UuaGVhcnRCZWF0KCBvcHQgKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q3VycmVudFdpZHRoIDogZnVuY3Rpb24oKXtcbiAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy5jb250ZXh0LndpZHRoICogdGhpcy5jb250ZXh0LnNjYWxlWCk7XG4gICAgfSxcbiAgICBnZXRDdXJyZW50SGVpZ2h0IDogZnVuY3Rpb24oKXtcbiAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy5jb250ZXh0LmhlaWdodCAqIHRoaXMuY29udGV4dC5zY2FsZVkpO1xuICAgIH0sXG4gICAgZ2V0U3RhZ2UgOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiggdGhpcy5zdGFnZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YWdlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcCA9IHRoaXM7XG4gICAgICAgIGlmIChwLnR5cGUgIT0gXCJzdGFnZVwiKXtcbiAgICAgICAgICB3aGlsZShwLnBhcmVudCkge1xuICAgICAgICAgICAgcCA9IHAucGFyZW50O1xuICAgICAgICAgICAgaWYgKHAudHlwZSA9PSBcInN0YWdlXCIpe1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwLnR5cGUgIT09IFwic3RhZ2VcIikge1xuICAgICAgICAgICAgLy/lpoLmnpzlvpfliLDnmoTpobbngrlkaXNwbGF5IOeahHR5cGXkuI3mmK9TdGFnZSzkuZ/lsLHmmK/or7TkuI3mmK9zdGFnZeWFg+e0oFxuICAgICAgICAgICAgLy/pgqPkuYjlj6rog73or7TmmI7ov5nkuKpw5omA5Luj6KGo55qE6aG256uvZGlzcGxheSDov5jmsqHmnInmt7vliqDliLBkaXNwbGF5TGlzdOS4re+8jOS5n+WwseaYr+ayoeacieayoea3u+WKoOWIsFxuICAgICAgICAgICAgLy9zdGFnZeiInuWPsOeahGNoaWxkZW7pmJ/liJfkuK3vvIzkuI3lnKjlvJXmk47muLLmn5PojIPlm7TlhoVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIC8v5LiA55u05Zue5rqv5Yiw6aG25bGCb2JqZWN077yMIOWNs+aYr3N0YWdl77yMIHN0YWdl55qEcGFyZW505Li6bnVsbFxuICAgICAgICB0aGlzLnN0YWdlID0gcDtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfSxcbiAgICBsb2NhbFRvR2xvYmFsIDogZnVuY3Rpb24oIHBvaW50ICwgY29udGFpbmVyICl7XG4gICAgICAgICFwb2ludCAmJiAoIHBvaW50ID0gbmV3IFBvaW50KCAwICwgMCApICk7XG4gICAgICAgIHZhciBjbSA9IHRoaXMuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCBjb250YWluZXIgKTtcblxuICAgICAgICBpZiAoY20gPT0gbnVsbCkgcmV0dXJuIFBvaW50KCAwICwgMCApO1xuICAgICAgICB2YXIgbSA9IG5ldyBNYXRyaXgoMSwgMCwgMCwgMSwgcG9pbnQueCAsIHBvaW50LnkpO1xuICAgICAgICBtLmNvbmNhdChjbSk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoIG0udHggLCBtLnR5ICk7IC8ve3g6bS50eCwgeTptLnR5fTtcbiAgICB9LFxuICAgIGdsb2JhbFRvTG9jYWwgOiBmdW5jdGlvbiggcG9pbnQgLCBjb250YWluZXIpIHtcbiAgICAgICAgIXBvaW50ICYmICggcG9pbnQgPSBuZXcgUG9pbnQoIDAgLCAwICkgKTtcblxuICAgICAgICBpZiggdGhpcy50eXBlID09IFwic3RhZ2VcIiApe1xuICAgICAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgICAgICB9XG4gICAgICAgIHZhciBjbSA9IHRoaXMuZ2V0Q29uY2F0ZW5hdGVkTWF0cml4KCBjb250YWluZXIgKTtcblxuICAgICAgICBpZiAoY20gPT0gbnVsbCkgcmV0dXJuIG5ldyBQb2ludCggMCAsIDAgKTsgLy97eDowLCB5OjB9O1xuICAgICAgICBjbS5pbnZlcnQoKTtcbiAgICAgICAgdmFyIG0gPSBuZXcgTWF0cml4KDEsIDAsIDAsIDEsIHBvaW50LnggLCBwb2ludC55KTtcbiAgICAgICAgbS5jb25jYXQoY20pO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KCBtLnR4ICwgbS50eSApOyAvL3t4Om0udHgsIHk6bS50eX07XG4gICAgfSxcbiAgICBsb2NhbFRvVGFyZ2V0IDogZnVuY3Rpb24oIHBvaW50ICwgdGFyZ2V0KXtcbiAgICAgICAgdmFyIHAgPSBsb2NhbFRvR2xvYmFsKCBwb2ludCApO1xuICAgICAgICByZXR1cm4gdGFyZ2V0Lmdsb2JhbFRvTG9jYWwoIHAgKTtcbiAgICB9LFxuICAgIGdldENvbmNhdGVuYXRlZE1hdHJpeCA6IGZ1bmN0aW9uKCBjb250YWluZXIgKXtcbiAgICAgICAgdmFyIGNtID0gbmV3IE1hdHJpeCgpO1xuICAgICAgICBmb3IgKHZhciBvID0gdGhpczsgbyAhPSBudWxsOyBvID0gby5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNtLmNvbmNhdCggby5fdHJhbnNmb3JtICk7XG4gICAgICAgICAgICBpZiggIW8ucGFyZW50IHx8ICggY29udGFpbmVyICYmIG8ucGFyZW50ICYmIG8ucGFyZW50ID09IGNvbnRhaW5lciApIHx8ICggby5wYXJlbnQgJiYgby5wYXJlbnQudHlwZT09XCJzdGFnZVwiICkgKSB7XG4gICAgICAgICAgICAvL2lmKCBvLnR5cGUgPT0gXCJzdGFnZVwiIHx8IChvLnBhcmVudCAmJiBjb250YWluZXIgJiYgby5wYXJlbnQudHlwZSA9PSBjb250YWluZXIudHlwZSApICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbTsvL2JyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbTtcbiAgICB9LFxuICAgIC8qXG4gICAgICrorr7nva7lhYPntKDnmoTmmK/lkKblk43lupTkuovku7bmo4DmtYtcbiAgICAgKkBib29sICBCb29sZWFuIOexu+Wei1xuICAgICAqL1xuICAgIHNldEV2ZW50RW5hYmxlIDogZnVuY3Rpb24oIGJvb2wgKXtcbiAgICAgICAgaWYoXy5pc0Jvb2xlYW4oYm9vbCkpe1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRFbmFibGVkID0gYm9vbFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8qXG4gICAgICrmn6Xor6Loh6rlt7HlnKhwYXJlbnTnmoTpmJ/liJfkuK3nmoTkvY3nva5cbiAgICAgKi9cbiAgICBnZXRJbmRleCAgIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIXRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKHRoaXMucGFyZW50LmNoaWxkcmVuICwgdGhpcylcbiAgICB9LFxuICAgIC8qXG4gICAgICrlhYPntKDlnKh66L205pa55ZCR5ZCR5LiL56e75YqoXG4gICAgICpAbnVtIOenu+WKqOeahOWxgue6p1xuICAgICAqL1xuICAgIHRvQmFjayA6IGZ1bmN0aW9uKCBudW0gKXtcbiAgICAgICAgaWYoIXRoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcm9tSW5kZXggPSB0aGlzLmdldEluZGV4KCk7XG4gICAgICAgIHZhciB0b0luZGV4ID0gMDtcbiAgICAgICAgXG4gICAgICAgIGlmKF8uaXNOdW1iZXIoIG51bSApKXtcbiAgICAgICAgICBpZiggbnVtID09IDAgKXtcbiAgICAgICAgICAgICAvL+WOn+WcsOS4jeWKqFxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRvSW5kZXggPSBmcm9tSW5kZXggLSBudW07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKCBmcm9tSW5kZXggLCAxIClbMF07XG4gICAgICAgIGlmKCB0b0luZGV4IDwgMCApe1xuICAgICAgICAgICAgdG9JbmRleCA9IDA7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkQXQoIG1lICwgdG9JbmRleCApO1xuICAgIH0sXG4gICAgLypcbiAgICAgKuWFg+e0oOWcqHrovbTmlrnlkJHlkJHkuIrnp7vliqhcbiAgICAgKkBudW0g56e75Yqo55qE5bGC5pWw6YePIOm7mOiupOWIsOmhtuerr1xuICAgICAqL1xuICAgIHRvRnJvbnQgOiBmdW5jdGlvbiggbnVtICl7XG4gICAgICAgIGlmKCF0aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnJvbUluZGV4ID0gdGhpcy5nZXRJbmRleCgpO1xuICAgICAgICB2YXIgcGNsID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB2YXIgdG9JbmRleCA9IHBjbDtcbiAgICAgICAgXG4gICAgICAgIGlmKF8uaXNOdW1iZXIoIG51bSApKXtcbiAgICAgICAgICBpZiggbnVtID09IDAgKXtcbiAgICAgICAgICAgICAvL+WOn+WcsOS4jeWKqFxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9JbmRleCA9IGZyb21JbmRleCArIG51bSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKCBmcm9tSW5kZXggLCAxIClbMF07XG4gICAgICAgIGlmKHRvSW5kZXggPiBwY2wpe1xuICAgICAgICAgICAgdG9JbmRleCA9IHBjbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZEF0KCBtZSAsIHRvSW5kZXgtMSApO1xuICAgIH0sXG4gICAgX3RyYW5zZm9ybUhhbmRlciA6IGZ1bmN0aW9uKCBjdHggKXtcbiAgICAgICAgdmFyIHRyYW5zRm9ybSA9IHRoaXMuX3RyYW5zZm9ybTtcbiAgICAgICAgaWYoICF0cmFuc0Zvcm0gKSB7XG4gICAgICAgICAgICB0cmFuc0Zvcm0gPSB0aGlzLl91cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/ov5DnlKjnn6npmLXlvIDlp4vlj5jlvaJcbiAgICAgICAgY3R4LnRyYW5zZm9ybS5hcHBseSggY3R4ICwgdHJhbnNGb3JtLnRvQXJyYXkoKSApO1xuICAgICAgICAvL2N0eC5nbG9iYWxBbHBoYSAqPSB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGE7XG4gICAgfSxcbiAgICBfdXBkYXRlVHJhbnNmb3JtIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xuICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XG4gICAgICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIC8v5piv5ZCm6ZyA6KaBVHJhbnNmb3JtXG4gICAgICAgIGlmKGN0eC5zY2FsZVggIT09IDEgfHwgY3R4LnNjYWxlWSAhPT0xICl7XG4gICAgICAgICAgICAvL+WmguaenOaciee8qeaUvlxuICAgICAgICAgICAgLy/nvKnmlL7nmoTljp/ngrnlnZDmoIdcbiAgICAgICAgICAgIHZhciBvcmlnaW4gPSBuZXcgUG9pbnQoY3R4LnNjYWxlT3JpZ2luKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCAtb3JpZ2luLnggLCAtb3JpZ2luLnkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoIGN0eC5zY2FsZVggLCBjdHguc2NhbGVZICk7XG4gICAgICAgICAgICBpZiggb3JpZ2luLnggfHwgb3JpZ2luLnkgKXtcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZSggb3JpZ2luLnggLCBvcmlnaW4ueSApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcm90YXRpb24gPSBjdHgucm90YXRpb247XG4gICAgICAgIGlmKCByb3RhdGlvbiApe1xuICAgICAgICAgICAgLy/lpoLmnpzmnInml4vovaxcbiAgICAgICAgICAgIC8v5peL6L2s55qE5Y6f54K55Z2Q5qCHXG4gICAgICAgICAgICB2YXIgb3JpZ2luID0gbmV3IFBvaW50KGN0eC5yb3RhdGVPcmlnaW4pO1xuICAgICAgICAgICAgaWYoIG9yaWdpbi54IHx8IG9yaWdpbi55ICl7XG4gICAgICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIC1vcmlnaW4ueCAsIC1vcmlnaW4ueSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RyYW5zZm9ybS5yb3RhdGUoIHJvdGF0aW9uICUgMzYwICogTWF0aC5QSS8xODAgKTtcbiAgICAgICAgICAgIGlmKCBvcmlnaW4ueCB8fCBvcmlnaW4ueSApe1xuICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0udHJhbnNsYXRlKCBvcmlnaW4ueCAsIG9yaWdpbi55ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy/lpoLmnpzmnInkvY3np7tcbiAgICAgICAgdmFyIHgseTtcbiAgICAgICAgaWYoIHRoaXMueHlUb0ludCAmJiAhdGhpcy5tb3ZlaW5nICl7XG4gICAgICAgICAgICAvL+W9k+i/meS4quWFg+e0oOWcqOWBmui9qOi/uei/kOWKqOeahOaXtuWAme+8jOavlOWmgmRyYWfvvIxhbmltYXRpb27lpoLmnpzlrp7ml7bnmoTosIPmlbTov5nkuKp4IO+8jCB5XG4gICAgICAgICAgICAvL+mCo+S5iOivpeWFg+e0oOeahOi9qOi/ueS8muaciei3s+i3g+eahOaDheWGteWPkeeUn+OAguaJgOS7peWKoOS4quadoeS7tui/h+a7pO+8jFxuICAgICAgICAgICAgdmFyIHggPSBwYXJzZUludCggY3R4LnggKTsvL01hdGgucm91bmQoY3R4LngpO1xuICAgICAgICAgICAgdmFyIHkgPSBwYXJzZUludCggY3R4LnkgKTsvL01hdGgucm91bmQoY3R4LnkpO1xuXG4gICAgICAgICAgICBpZiggcGFyc2VJbnQoY3R4LmxpbmVXaWR0aCAsIDEwKSAlIDIgPT0gMSAmJiBjdHguc3Ryb2tlU3R5bGUgKXtcbiAgICAgICAgICAgICAgICB4ICs9IDAuNTtcbiAgICAgICAgICAgICAgICB5ICs9IDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHggPSBjdHgueDtcbiAgICAgICAgICAgIHkgPSBjdHgueTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiggeCAhPSAwIHx8IHkgIT0gMCApe1xuICAgICAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoIHggLCB5ICk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybSA9IF90cmFuc2Zvcm07XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5pZCtcIjp0eF9cIitfdHJhbnNmb3JtLnR4K1wiOmN4X1wiK3RoaXMuY29udGV4dC54KTtcblxuICAgICAgICByZXR1cm4gX3RyYW5zZm9ybTtcbiAgICB9LFxuICAgIC8v5pi+56S65a+56LGh55qE6YCJ5Y+W5qOA5rWL5aSE55CG5Ye95pWwXG4gICAgZ2V0Q2hpbGRJblBvaW50IDogZnVuY3Rpb24oIHBvaW50ICl7XG4gICAgICAgIHZhciByZXN1bHQ7IC8v5qOA5rWL55qE57uT5p6cXG5cbiAgICAgICAgLy/nrKzkuIDmraXvvIzlkKdnbG9i55qEcG9pbnTovazmjaLliLDlr7nlupTnmoRvYmrnmoTlsYLnuqflhoXnmoTlnZDmoIfns7vnu59cbiAgICAgICAgaWYoIHRoaXMudHlwZSAhPSBcInN0YWdlXCIgJiYgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQudHlwZSAhPSBcInN0YWdlXCIgKSB7XG4gICAgICAgICAgICBwb2ludCA9IHRoaXMucGFyZW50Lmdsb2JhbFRvTG9jYWwoIHBvaW50ICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHggPSBwb2ludC54O1xuICAgICAgICB2YXIgeSA9IHBvaW50Lnk7XG5cbiAgICAgICAgLy/ov5nkuKrml7blgJnlpoLmnpzmnInlr7ljb250ZXh055qEc2V077yM5ZGK6K+J5byV5pOO5LiN6ZyA6KaBd2F0Y2jvvIzlm6DkuLrov5nkuKrmmK/lvJXmk47op6blj5HnmoTvvIzkuI3mmK/nlKjmiLdcbiAgICAgICAgLy/nlKjmiLdzZXQgY29udGV4dCDmiY3pnIDopoHop6blj5F3YXRjaFxuICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IHRydWU7XG4gICAgXG4gICAgICAgIC8v5a+56byg5qCH55qE5Z2Q5qCH5Lmf5YGa55u45ZCM55qE5Y+Y5o2iXG4gICAgICAgIGlmKCB0aGlzLl90cmFuc2Zvcm0gKXtcbiAgICAgICAgICAgIHZhciBpbnZlcnNlTWF0cml4ID0gdGhpcy5fdHJhbnNmb3JtLmNsb25lKCkuaW52ZXJ0KCk7XG4gICAgICAgICAgICB2YXIgb3JpZ2luUG9zID0gW3gsIHldO1xuICAgICAgICAgICAgb3JpZ2luUG9zID0gaW52ZXJzZU1hdHJpeC5tdWxWZWN0b3IoIG9yaWdpblBvcyApO1xuXG4gICAgICAgICAgICB4ID0gb3JpZ2luUG9zWzBdO1xuICAgICAgICAgICAgeSA9IG9yaWdpblBvc1sxXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3JlY3QgPSB0aGlzLl9yZWN0ID0gdGhpcy5nZXRSZWN0KHRoaXMuY29udGV4dCk7XG5cbiAgICAgICAgaWYoIV9yZWN0KXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQud2lkdGggJiYgISFfcmVjdC53aWR0aCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LndpZHRoID0gX3JlY3Qud2lkdGg7XG4gICAgICAgIH07XG4gICAgICAgIGlmKCAhdGhpcy5jb250ZXh0LmhlaWdodCAmJiAhIV9yZWN0LmhlaWdodCApe1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IF9yZWN0LmhlaWdodDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoIV9yZWN0LndpZHRoIHx8ICFfcmVjdC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy/mraPlvI/lvIDlp4vnrKzkuIDmraXnmoTnn6nlvaLojIPlm7TliKTmlq1cbiAgICAgICAgaWYgKCB4ICAgID49IF9yZWN0LnhcbiAgICAgICAgICAgICYmICB4IDw9IChfcmVjdC54ICsgX3JlY3Qud2lkdGgpXG4gICAgICAgICAgICAmJiAgeSA+PSBfcmVjdC55XG4gICAgICAgICAgICAmJiAgeSA8PSAoX3JlY3QueSArIF9yZWN0LmhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgIC8v6YKj5LmI5bCx5Zyo6L+Z5Liq5YWD57Sg55qE55+p5b2i6IyD5Zu05YaFXG4gICAgICAgICAgIHJlc3VsdCA9IEhpdFRlc3RQb2ludC5pc0luc2lkZSggdGhpcyAsIHtcbiAgICAgICAgICAgICAgIHggOiB4LFxuICAgICAgICAgICAgICAgeSA6IHlcbiAgICAgICAgICAgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvL+WmguaenOi/nuefqeW9ouWGhemDveS4jeaYr++8jOmCo+S5iOiCr+WumueahO+8jOi/meS4quS4jeaYr+aIkeS7rOimgeaJvueahHNoYXBcbiAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIC8qXG4gICAgKiBhbmltYXRlXG4gICAgKiBAcGFyYW0gdG9Db250ZW50IOimgeWKqOeUu+WPmOW9ouWIsOeahOWxnuaAp+mbhuWQiFxuICAgICogQHBhcmFtIG9wdGlvbnMgdHdlZW4g5Yqo55S75Y+C5pWwXG4gICAgKi9cbiAgICBhbmltYXRlIDogZnVuY3Rpb24oIHRvQ29udGVudCAsIG9wdGlvbnMgKXtcbiAgICAgICAgdmFyIHRvID0gdG9Db250ZW50O1xuICAgICAgICB2YXIgZnJvbSA9IHt9O1xuICAgICAgICBmb3IoIHZhciBwIGluIHRvICl7XG4gICAgICAgICAgICBmcm9tWyBwIF0gPSB0aGlzLmNvbnRleHRbcF07XG4gICAgICAgIH07XG4gICAgICAgICFvcHRpb25zICYmIChvcHRpb25zID0ge30pO1xuICAgICAgICBvcHRpb25zLmZyb20gPSBmcm9tO1xuICAgICAgICBvcHRpb25zLnRvID0gdG87XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdXBGdW4gPSBmdW5jdGlvbigpe307XG4gICAgICAgIGlmKCBvcHRpb25zLm9uVXBkYXRlICl7XG4gICAgICAgICAgICB1cEZ1biA9IG9wdGlvbnMub25VcGRhdGU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0d2VlbjtcbiAgICAgICAgb3B0aW9ucy5vblVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL+WmguaenGNvbnRleHTkuI3lrZjlnKjor7TmmI7or6VvYmrlt7Lnu4/ooqtkZXN0cm955LqG77yM6YKj5LmI6KaB5oqK5LuW55qEdHdlZW7nu5lkZXN0cm95XG4gICAgICAgICAgICBpZiAoIXNlbGYuY29udGV4dCAmJiB0d2Vlbikge1xuICAgICAgICAgICAgICAgIEFuaW1hdGlvbkZyYW1lLmRlc3Ryb3lUd2Vlbih0d2Vlbik7XG4gICAgICAgICAgICAgICAgdHdlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IoIHZhciBwIGluIHRoaXMgKXtcbiAgICAgICAgICAgICAgICBzZWxmLmNvbnRleHRbcF0gPSB0aGlzW3BdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHVwRnVuLmFwcGx5KHNlbGYgLCBbdGhpc10pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgY29tcEZ1biA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgaWYoIG9wdGlvbnMub25Db21wbGV0ZSApe1xuICAgICAgICAgICAgY29tcEZ1biA9IG9wdGlvbnMub25Db21wbGV0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlID0gZnVuY3Rpb24oIG9wdCApe1xuICAgICAgICAgICAgY29tcEZ1bi5hcHBseShzZWxmICwgYXJndW1lbnRzKVxuICAgICAgICB9O1xuICAgICAgICB0d2VlbiA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdFR3ZWVuKCBvcHRpb25zICk7XG4gICAgICAgIHJldHVybiB0d2VlbjtcbiAgICB9LFxuICAgIF9yZW5kZXIgOiBmdW5jdGlvbiggY3R4ICl7XHRcbiAgICAgICAgaWYoICF0aGlzLmNvbnRleHQudmlzaWJsZSB8fCB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPD0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybUhhbmRlciggY3R4ICk7XG5cbiAgICAgICAgLy/mlofmnKzmnInoh6rlt7HnmoTorr7nva7moLflvI/mlrnlvI9cbiAgICAgICAgaWYoIHRoaXMudHlwZSAhPSBcInRleHRcIiApIHtcbiAgICAgICAgICAgIFV0aWxzLnNldENvbnRleHRTdHlsZSggY3R4ICwgdGhpcy5jb250ZXh0LiRtb2RlbCApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoIGN0eCApO1xuICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH0sXG4gICAgcmVuZGVyIDogZnVuY3Rpb24oIGN0eCApIHtcbiAgICAgICAgLy/ln7rnsbvkuI3mj5DkvptyZW5kZXLnmoTlhbfkvZPlrp7njrDvvIznlLHlkI7nu63lhbfkvZPnmoTmtL7nlJ/nsbvlkIToh6rlrp7njrBcbiAgICB9LFxuICAgIC8v5LuO5qCR5Lit5Yig6ZmkXG4gICAgcmVtb3ZlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lhYPntKDnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/mioroh6rlt7Hku47niLboioLngrnkuK3liKDpmaTkuoblkI7lgZroh6rmiJHmuIXpmaTvvIzph4rmlL7lhoXlrZhcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dDtcbiAgICB9XG59ICk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BsYXlPYmplY3Q7XG5cbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzM+eahERpc3BsYXlMaXN0IOS4reeahOWuueWZqOexu1xuICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XG5cbnZhciBEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gZnVuY3Rpb24ob3B0KXtcbiAgIHZhciBzZWxmID0gdGhpcztcbiAgIHNlbGYuY2hpbGRyZW4gPSBbXTtcbiAgIHNlbGYubW91c2VDaGlsZHJlbiA9IFtdO1xuICAgRGlzcGxheU9iamVjdENvbnRhaW5lci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgIC8v5omA5pyJ55qE5a655Zmo6buY6K6k5pSv5oyBZXZlbnQg5qOA5rWL77yM5Zug5Li6IOWPr+iDveaciemHjOmdoueahHNoYXBl5pivZXZlbnRFbmFibGXmmK90cnVl55qEXG4gICAvL+WmguaenOeUqOaIt+acieW8uuWItueahOmcgOaxguiuqeWuueWZqOS4i+eahOaJgOacieWFg+e0oOmDvSDkuI3lj6/mo4DmtYvvvIzlj6/ku6XosIPnlKhcbiAgIC8vRGlzcGxheU9iamVjdENvbnRhaW5lcueahCBzZXRFdmVudEVuYWJsZSgpIOaWueazlVxuICAgc2VsZi5fZXZlbnRFbmFibGVkID0gdHJ1ZTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoIERpc3BsYXlPYmplY3RDb250YWluZXIgLCBEaXNwbGF5T2JqZWN0ICwge1xuICAgIGFkZENoaWxkIDogZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICBpZiggIWNoaWxkICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBpZih0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpICE9IC0xKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9O1xuICAgICAgICAvL+WmguaenOS7luWcqOWIq+eahOWtkOWFg+e0oOS4re+8jOmCo+S5iOWwseS7juWIq+S6uumCo+mHjOWIoOmZpOS6hlxuICAgICAgICBpZihjaGlsZC5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaCggY2hpbGQgKTtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgaWYodGhpcy5oZWFydEJlYXQpe1xuICAgICAgICAgICB0aGlzLmhlYXJ0QmVhdCh7XG4gICAgICAgICAgICAgY29udmVydFR5cGUgOiBcImNoaWxkcmVuXCIsXG4gICAgICAgICAgICAgdGFyZ2V0ICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYodGhpcy5fYWZ0ZXJBZGRDaGlsZCl7XG4gICAgICAgICAgIHRoaXMuX2FmdGVyQWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIGFkZENoaWxkQXQgOiBmdW5jdGlvbihjaGlsZCwgaW5kZXgpIHtcbiAgICAgICAgaWYodGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMSkge1xuICAgICAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoY2hpbGQucGFyZW50KSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMCwgY2hpbGQpO1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy/kuIrmiqVjaGlsZHJlbuW/g+i3s1xuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckFkZENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJBZGRDaGlsZChjaGlsZCxpbmRleCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGQgOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVDaGlsZEF0KF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICkpO1xuICAgIH0sXG4gICAgcmVtb3ZlQ2hpbGRBdCA6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIGlmIChjaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmhlYXJ0QmVhdCl7XG4gICAgICAgICAgIHRoaXMuaGVhcnRCZWF0KHtcbiAgICAgICAgICAgICBjb252ZXJ0VHlwZSA6IFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgICB0YXJnZXQgICAgICAgOiBjaGlsZCxcbiAgICAgICAgICAgICBzcmMgICAgICA6IHRoaXNcbiAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9hZnRlckRlbENoaWxkKXtcbiAgICAgICAgICAgdGhpcy5fYWZ0ZXJEZWxDaGlsZChjaGlsZCAsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9LFxuICAgIHJlbW92ZUNoaWxkQnlJZCA6IGZ1bmN0aW9uKCBpZCApIHtcdFxuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZih0aGlzLmNoaWxkcmVuW2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQ2hpbGRBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICByZW1vdmVBbGxDaGlsZHJlbiA6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGlsZSh0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRBdCgwKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/pm4blkIjnsbvnmoToh6rmiJHplIDmr4FcbiAgICBkZXN0cm95IDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICl7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5maXJlKFwiZGVzdHJveVwiKTtcbiAgICAgICAgLy/kvp3mrKHplIDmr4HmiYDmnInlrZDlhYPntKBcbiAgICAgICAgZm9yICh2YXIgaT0wLGw9dGhpcy5jaGlsZHJlbi5sZW5ndGggOyBpPGwgOyBpKyspe1xuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZEF0KGkpLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGwtLTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8qXG4gICAgICpAaWQg5YWD57Sg55qEaWRcbiAgICAgKkBib29sZW4g5piv5ZCm5rex5bqm5p+l6K+i77yM6buY6K6k5bCx5Zyo56ys5LiA5bGC5a2Q5YWD57Sg5Lit5p+l6K+iXG4gICAgICoqL1xuICAgIGdldENoaWxkQnlJZCA6IGZ1bmN0aW9uKGlkICwgYm9vbGVuKXtcbiAgICAgICAgaWYoIWJvb2xlbikge1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jaGlsZHJlbltpXS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+a3seW6puafpeivolxuICAgICAgICAgICAgLy9UT0RPOuaaguaXtuacquWunueOsFxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGdldENoaWxkQXQgOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baW5kZXhdO1xuICAgIH0sXG4gICAgZ2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2YoIHRoaXMuY2hpbGRyZW4gLCBjaGlsZCApO1xuICAgIH0sXG4gICAgc2V0Q2hpbGRJbmRleCA6IGZ1bmN0aW9uKGNoaWxkLCBpbmRleCl7XG4gICAgICAgIGlmKGNoaWxkLnBhcmVudCAhPSB0aGlzKSByZXR1cm47XG4gICAgICAgIHZhciBvbGRJbmRleCA9IF8uaW5kZXhPZiggdGhpcy5jaGlsZHJlbiAsIGNoaWxkICk7XG4gICAgICAgIGlmKGluZGV4ID09IG9sZEluZGV4KSByZXR1cm47XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKG9sZEluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDAsIGNoaWxkKTtcbiAgICB9LFxuICAgIGdldE51bUNoaWxkcmVuIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB9LFxuICAgIC8v6I635Y+WeCx554K55LiK55qE5omA5pyJb2JqZWN0ICBudW0g6ZyA6KaB6L+U5Zue55qEb2Jq5pWw6YePXG4gICAgZ2V0T2JqZWN0c1VuZGVyUG9pbnQgOiBmdW5jdGlvbiggcG9pbnQgLCBudW0pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yKHZhciBpID0gdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcblxuICAgICAgICAgICAgaWYoIGNoaWxkID09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAoIWNoaWxkLl9ldmVudEVuYWJsZWQgJiYgIWNoaWxkLmRyYWdFbmFibGVkKSB8fCBcbiAgICAgICAgICAgICAgICAhY2hpbGQuY29udGV4dC52aXNpYmxlIFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggY2hpbGQgaW5zdGFuY2VvZiBEaXNwbGF5T2JqZWN0Q29udGFpbmVyICkge1xuICAgICAgICAgICAgICAgIC8v5piv6ZuG5ZCIXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm1vdXNlQ2hpbGRyZW4gJiYgY2hpbGQuZ2V0TnVtQ2hpbGRyZW4oKSA+IDApe1xuICAgICAgICAgICAgICAgICAgIHZhciBvYmpzID0gY2hpbGQuZ2V0T2JqZWN0c1VuZGVyUG9pbnQoIHBvaW50ICk7XG4gICAgICAgICAgICAgICAgICAgaWYgKG9ianMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdCggb2JqcyApO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XHRcdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+mdnumbhuWQiO+8jOWPr+S7peW8gOWni+WBmmdldENoaWxkSW5Qb2ludOS6hlxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5nZXRDaGlsZEluUG9pbnQoIHBvaW50ICkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobnVtICE9IHVuZGVmaW5lZCAmJiAhaXNOYU4obnVtKSl7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdC5sZW5ndGggPT0gbnVtKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICByZW5kZXIgOiBmdW5jdGlvbiggY3R4ICkge1xuICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2ldLl9yZW5kZXIoIGN0eCApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuIiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICogc3RhZ2Ug57G777yMIOWGjWFzM+S4re+8jHN0YWdl5YiZ5Luj6KGo5pW05Liq6Iie5Y+w44CC5piv5ZSv5LiA55qE5qC56IqC54K5XG4gKiDkvYbmmK/lho1jYW52YXjkuK3vvIzlm6DkuLrliIblsYLorr7orqHnmoTpnIDopoHjgIJzdGFnZSDoiJ7lj7Ag5ZCM5qC35Luj6KGo5LiA5LiqY2FudmFz5YWD57Sg77yM5L2G5piv5LiN5piv5YaN5pW05Liq5byV5pOO6K6+6K6hXG4gKiDph4zpnaLvvIwg5LiN5piv5ZSv5LiA55qE5qC56IqC54K544CC6ICM5piv5Lya5Lqk55SxY2FudmF457G75p2l57uf5LiA566h55CG5YW25bGC57qnXG4gKi9cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxudmFyIFN0YWdlID0gZnVuY3Rpb24oICl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYudHlwZSA9IFwic3RhZ2VcIjtcbiAgICBzZWxmLmNvbnRleHQyRCA9IG51bGw7XG4gICAgLy9zdGFnZeato+WcqOa4suafk+S4rVxuICAgIHNlbGYuc3RhZ2VSZW5kaW5nID0gZmFsc2U7XG4gICAgc2VsZi5faXNSZWFkeSA9IGZhbHNlO1xuICAgIFN0YWdlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5VdGlscy5jcmVhdENsYXNzKCBTdGFnZSAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7fSxcbiAgICAvL+eUsWNhbnZheOeahGFmdGVyQWRkQ2hpbGQg5Zue6LCDXG4gICAgaW5pdFN0YWdlIDogZnVuY3Rpb24oIGNvbnRleHQyRCAsIHdpZHRoICwgaGVpZ2h0ICl7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIHNlbGYuY29udGV4dDJEID0gY29udGV4dDJEO1xuICAgICAgIHNlbGYuY29udGV4dC53aWR0aCAgPSB3aWR0aDtcbiAgICAgICBzZWxmLmNvbnRleHQuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgIHNlbGYuY29udGV4dC5zY2FsZVggPSBVdGlscy5fZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICBzZWxmLmNvbnRleHQuc2NhbGVZID0gVXRpbHMuX2RldmljZVBpeGVsUmF0aW87XG4gICAgICAgc2VsZi5faXNSZWFkeSA9IHRydWU7XG4gICAgfSxcbiAgICByZW5kZXIgOiBmdW5jdGlvbiggY29udGV4dCApe1xuICAgICAgICB0aGlzLnN0YWdlUmVuZGluZyA9IHRydWU7XG4gICAgICAgIC8vVE9ET++8mlxuICAgICAgICAvL2NsZWFyIOeci+S8vCDlvojlkIjnkIbvvIzkvYbmmK/lhbblrp7lnKjml6DnirbmgIHnmoRjYXZuYXPnu5jlm77kuK3vvIzlhbblrp7msqHlv4XopoHmiafooYzkuIDmraXlpJrkvZnnmoRjbGVhcuaTjeS9nFxuICAgICAgICAvL+WPjeiAjOWinuWKoOaXoOiwk+eahOW8gOmUgO+8jOWmguaenOWQjue7reimgeWBmuiEj+efqemYteWIpOaWreeahOivneOAguWcqOivtFxuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIFN0YWdlLnN1cGVyY2xhc3MucmVuZGVyLmNhbGwoIHRoaXMsIGNvbnRleHQgKTtcbiAgICAgICAgdGhpcy5zdGFnZVJlbmRpbmcgPSBmYWxzZTtcbiAgICB9LFxuICAgIGhlYXJ0QmVhdCA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgLy9zaGFwZSAsIG5hbWUgLCB2YWx1ZSAsIHByZVZhbHVlIFxuICAgICAgICAvL2Rpc3BsYXlMaXN05Lit5p+Q5Liq5bGe5oCn5pS55Y+Y5LqGXG4gICAgICAgIGlmICghdGhpcy5faXNSZWFkeSkge1xuICAgICAgICAgICAvL+WcqHN0YWdl6L+Y5rKh5Yid5aeL5YyW5a6M5q+V55qE5oOF5Ya15LiL77yM5peg6ZyA5YGa5Lu75L2V5aSE55CGXG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0IHx8ICggb3B0ID0ge30gKTsgLy/lpoLmnpxvcHTkuLrnqbrvvIzor7TmmI7lsLHmmK/ml6DmnaHku7bliLfmlrBcbiAgICAgICAgb3B0LnN0YWdlICAgPSB0aGlzO1xuXG4gICAgICAgIC8vVE9ET+S4tOaXtuWFiOi/meS5iOWkhOeQhlxuICAgICAgICB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5oZWFydEJlYXQob3B0KTtcbiAgICB9LFxuICAgIGNsZWFyIDogZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID49IDQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dDJELmNsZWFyUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dDJELmNsZWFyUmVjdCggMCwgMCwgdGhpcy5wYXJlbnQud2lkdGggLCB0aGlzLnBhcmVudC5oZWlnaHQgKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuZXhwb3J0IGRlZmF1bHQgU3RhZ2U7IiwiXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IF9fVkVSU0lPTl9fO1xuXG5leHBvcnQgY29uc3QgUElfMiA9IE1hdGguUEkgKiAyO1xuXG5leHBvcnQgY29uc3QgUkFEX1RPX0RFRyA9IDE4MCAvIE1hdGguUEk7XG5cbmV4cG9ydCBjb25zdCBERUdfVE9fUkFEID0gTWF0aC5QSSAvIDE4MDtcblxuZXhwb3J0IGNvbnN0IFJFTkRFUkVSX1RZUEUgPSB7XG4gICAgVU5LTk9XTjogICAgMCxcbiAgICBXRUJHTDogICAgICAxLFxuICAgIENBTlZBUzogICAgIDIsXG59O1xuXG5leHBvcnQgY29uc3QgRFJBV19NT0RFUyA9IHtcbiAgICBQT0lOVFM6ICAgICAgICAgMCxcbiAgICBMSU5FUzogICAgICAgICAgMSxcbiAgICBMSU5FX0xPT1A6ICAgICAgMixcbiAgICBMSU5FX1NUUklQOiAgICAgMyxcbiAgICBUUklBTkdMRVM6ICAgICAgNCxcbiAgICBUUklBTkdMRV9TVFJJUDogNSxcbiAgICBUUklBTkdMRV9GQU46ICAgNixcbn07XG5cbmV4cG9ydCBjb25zdCBTSEFQRVMgPSB7XG4gICAgUE9MWTogMCxcbiAgICBSRUNUOiAxLFxuICAgIENJUkM6IDIsXG4gICAgRUxJUDogMyxcbiAgICBSUkVDOiA0LFxufTtcblxuXG4iLCJpbXBvcnQgeyBSRU5ERVJFUl9UWVBFIH0gZnJvbSAnLi4vY29uc3QnO1xuaW1wb3J0IEFuaW1hdGlvbkZyYW1lIGZyb20gXCIuLi9hbmltYXRpb24vQW5pbWF0aW9uRnJhbWVcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3lzdGVtUmVuZGVyZXIgXG57XG4gICAgY29uc3RydWN0b3IoIHR5cGU9UkVOREVSRVJfVFlQRS5VTktOT1dOICwgYXBwIClcbiAgICB7XG4gICAgXHR0aGlzLnR5cGUgPSB0eXBlOyAvLzJjYW52YXMsMXdlYmdsXG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdEFpZCA9IG51bGw7XG5cbiAgICAgICAgLy/mr4/luKfnlLHlv4Pot7PkuIrmiqXnmoQg6ZyA6KaB6YeN57uY55qEc3RhZ2VzIOWIl+ihqFxuXHRcdHRoaXMuY29udmVydFN0YWdlcyA9IHt9O1xuXG5cdFx0dGhpcy5faGVhcnRCZWF0ID0gZmFsc2U7Ly/lv4Pot7PvvIzpu5jorqTkuLpmYWxzZe+8jOWNs2ZhbHNl55qE5pe25YCZ5byV5pOO5aSE5LqO6Z2Z6buY54q25oCBIHRydWXliJnlkK/liqjmuLLmn5NcblxuXHRcdHRoaXMuX3ByZVJlbmRlclRpbWUgPSAwO1xuXG5cdFx0Ly/ku7vliqHliJfooagsIOWmguaenF90YXNrTGlzdCDkuI3kuLrnqbrvvIzpgqPkuYjkuLvlvJXmk47lsLHkuIDnm7Tot5Fcblx0XHQvL+S4uiDlkKvmnIllbnRlckZyYW1lIOaWueazlSBEaXNwbGF5T2JqZWN0IOeahOWvueixoeWIl+ihqFxuXHRcdC8v5q+U5aaCIE1vdmllY2xpcCDnmoRlbnRlckZyYW1l5pa55rOV44CCXG5cdFx0Ly/mlLnlsZ7mgKfnm67liY3kuLvopoHmmK8gbW92aWVjbGlwIOS9v+eUqFxuXHRcdHRoaXMuX3Rhc2tMaXN0ID0gW107XG4gICAgfVxuXG4gICAgLy/lpoLmnpzlvJXmk47lpITkuo7pnZnpu5jnirbmgIHnmoTor53vvIzlsLHkvJrlkK/liqhcbiAgICBzdGFydEVudGVyKClcbiAgICB7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKCAhc2VsZi5yZXF1ZXN0QWlkICl7XG4gICAgICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IEFuaW1hdGlvbkZyYW1lLnJlZ2lzdEZyYW1lKCB7XG4gICAgICAgICAgICAgICBpZCA6IFwiZW50ZXJGcmFtZVwiLCAvL+WQjOaXtuiCr+WumuWPquacieS4gOS4qmVudGVyRnJhbWXnmoR0YXNrXG4gICAgICAgICAgICAgICB0YXNrIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbnRlckZyYW1lLmFwcGx5KHNlbGYpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICB9ICk7XG4gICAgICAgfVxuICAgIH1cblxuICAgIGVudGVyRnJhbWUoKVxuICAgIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL+S4jeeuoeaAjuS5iOagt++8jGVudGVyRnJhbWXmiafooYzkuoblsLHopoHmiopcbiAgICAgICAgLy9yZXF1ZXN0QWlkIG51bGwg5o6JXG4gICAgICAgIHNlbGYucmVxdWVzdEFpZCA9IG51bGw7XG4gICAgICAgIFV0aWxzLm5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiggc2VsZi5faGVhcnRCZWF0ICl7XG4gICAgICAgICAgICBfLmVhY2goXy52YWx1ZXMoIHNlbGYuY29udmVydFN0YWdlcyApICwgZnVuY3Rpb24oY29udmVydFN0YWdlKXtcbiAgICAgICAgICAgICAgIGNvbnZlcnRTdGFnZS5zdGFnZS5fcmVuZGVyKCBjb252ZXJ0U3RhZ2Uuc3RhZ2UuY29udGV4dDJEICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzID0ge307XG4gICAgICAgICAgICAvL+a4suafk+WujOS6hu+8jOaJk+S4iuacgOaWsOaXtumXtOaMq1xuICAgICAgICAgICAgc2VsZi5fcHJlUmVuZGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8v5YWI6LeR5Lu75Yqh6Zif5YiXLOWboOS4uuacieWPr+iDveWGjeWFt+S9k+eahGhhbmRlcuS4reS8muaKiuiHquW3sea4hemZpOaOiVxuICAgICAgICAvL+aJgOS7pei3keS7u+WKoeWSjOS4i+mdoueahGxlbmd0aOajgOa1i+WIhuW8gOadpVxuICAgICAgICBpZihzZWxmLl90YXNrTGlzdC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgZm9yKHZhciBpPTAsbCA9IHNlbGYuX3Rhc2tMaXN0Lmxlbmd0aCA7IGkgPCBsIDsgaSsrICl7XG4gICAgICAgICAgICAgIHZhciBvYmogPSBzZWxmLl90YXNrTGlzdFtpXTtcbiAgICAgICAgICAgICAgaWYob2JqLmVudGVyRnJhbWUpe1xuICAgICAgICAgICAgICAgICBvYmouZW50ZXJGcmFtZSgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICBzZWxmLl9fdGFza0xpc3Quc3BsaWNlKGktLSAsIDEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH0gIFxuICAgICAgICB9O1xuICAgICAgICAvL+WmguaenOS+neeEtui/mOacieS7u+WKoeOAgiDlsLHnu6fnu61lbnRlckZyYW1lLlxuICAgICAgICBpZihzZWxmLl90YXNrTGlzdC5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgc2VsZi5zdGFydEVudGVyKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2NvbnZlcnRDYW52YXgob3B0KVxuICAgIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgXy5lYWNoKCBtZS5hcHAuY2hpbGRyZW4gLCBmdW5jdGlvbihzdGFnZSl7XG4gICAgICAgICAgICBzdGFnZS5jb250ZXh0W29wdC5uYW1lXSA9IG9wdC52YWx1ZTsgXG4gICAgICAgIH0gKTsgIFxuICAgIH1cblxuICAgIGhlYXJ0QmVhdCggb3B0IClcbiAgICB7XG4gICAgICAgIC8vZGlzcGxheUxpc3TkuK3mn5DkuKrlsZ7mgKfmlLnlj5jkuoZcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiggb3B0ICl7XG4gICAgICAgICAgICAvL+W/g+i3s+WMheacieS4pOenje+8jOS4gOenjeaYr+afkOWFg+e0oOeahOWPr+inhuWxnuaAp+aUueWPmOS6huOAguS4gOenjeaYr2NoaWxkcmVu5pyJ5Y+Y5YqoXG4gICAgICAgICAgICAvL+WIhuWIq+WvueW6lGNvbnZlcnRUeXBlICDkuLogY29udGV4dCAgYW5kIGNoaWxkcmVuXG4gICAgICAgICAgICBpZiAob3B0LmNvbnZlcnRUeXBlID09IFwiY29udGV4dFwiKXtcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgICA9IG9wdC5zdGFnZTtcbiAgICAgICAgICAgICAgICB2YXIgc2hhcGUgICA9IG9wdC5zaGFwZTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSAgICA9IG9wdC5uYW1lO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSAgID0gb3B0LnZhbHVlO1xuICAgICAgICAgICAgICAgIHZhciBwcmVWYWx1ZT0gb3B0LnByZVZhbHVlO1xuXG4gICAgICAgICAgICAgICAgaWYoIHNoYXBlLnR5cGUgPT0gXCJjYW52YXhcIiApe1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9jb252ZXJ0Q2FudmF4KG9wdClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZighc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnZlcnRTdGFnZXNbc3RhZ2UuaWRdPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZihzaGFwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuY29udmVydFN0YWdlc1sgc3RhZ2UuaWQgXS5jb252ZXJ0U2hhcGVzWyBzaGFwZS5pZCBdKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbnZlcnRTdGFnZXNbIHN0YWdlLmlkIF0uY29udmVydFNoYXBlc1sgc2hhcGUuaWQgXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlIDogc2hhcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRUeXBlIDogb3B0LmNvbnZlcnRUeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WmguaenOW3sue7j+S4iuaKpeS6huivpSBzaGFwZSDnmoTlv4Pot7PjgIJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKG9wdC5jb252ZXJ0VHlwZSA9PSBcImNoaWxkcmVuXCIpe1xuICAgICAgICAgICAgICAgIC8v5YWD57Sg57uT5p6E5Y+Y5YyW77yM5q+U5aaCYWRkY2hpbGQgcmVtb3ZlQ2hpbGTnrYlcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gb3B0LnRhcmdldDtcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgPSBvcHQuc3JjLmdldFN0YWdlKCk7XG4gICAgICAgICAgICAgICAgaWYoIHN0YWdlIHx8ICh0YXJnZXQudHlwZT09XCJzdGFnZVwiKSApe1xuICAgICAgICAgICAgICAgICAgICAvL+WmguaenOaTjeS9nOeahOebruagh+WFg+e0oOaYr1N0YWdlXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlID0gc3RhZ2UgfHwgdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICBpZighc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhZ2UgOiBzdGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIW9wdC5jb252ZXJ0VHlwZSl7XG4gICAgICAgICAgICAgICAgLy/ml6DmnaHku7bopoHmsYLliLfmlrBcbiAgICAgICAgICAgICAgICB2YXIgc3RhZ2UgPSBvcHQuc3RhZ2U7XG4gICAgICAgICAgICAgICAgaWYoIXNlbGYuY29udmVydFN0YWdlc1tzdGFnZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzW3N0YWdlLmlkXT17XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlICxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTaGFwZXMgOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy/ml6DmnaHku7bopoHmsYLlhajpg6jliLfmlrDvvIzkuIDoiKznlKjlnKhyZXNpemXnrYnjgIJcbiAgICAgICAgICAgIF8uZWFjaCggc2VsZi5hcHAuY2hpbGRyZW4gLCBmdW5jdGlvbiggc3RhZ2UgLCBpICl7XG4gICAgICAgICAgICAgICAgc2VsZi5jb252ZXJ0U3RhZ2VzWyBzdGFnZS5pZCBdID0ge1xuICAgICAgICAgICAgICAgICAgICBzdGFnZSA6IHN0YWdlLFxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U2hhcGVzIDoge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICghc2VsZi5faGVhcnRCZWF0KXtcbiAgICAgICAgICAgLy/lpoLmnpzlj5HnjrDlvJXmk47lnKjpnZnpu5jnirbmgIHvvIzpgqPkuYjlsLHllKTphpLlvJXmk45cbiAgICAgICAgICAgc2VsZi5faGVhcnRCZWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgc2VsZi5zdGFydEVudGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIC8v5ZCm5YiZ5pm65oWn57un57ut56Gu6K6k5b+D6LezXG4gICAgICAgICAgIHNlbGYuX2hlYXJ0QmVhdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgU3lzdGVtUmVuZGVyZXIgZnJvbSAnLi4vU3lzdGVtUmVuZGVyZXInO1xuaW1wb3J0IHsgUkVOREVSRVJfVFlQRSB9IGZyb20gJy4uLy4uL2NvbnN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzUmVuZGVyZXIgZXh0ZW5kcyBTeXN0ZW1SZW5kZXJlclxue1xuICAgIGNvbnN0cnVjdG9yKGFwcClcbiAgICB7XG4gICAgICAgIHN1cGVyKFJFTkRFUkVSX1RZUEUuQ0FOVkFTLCBhcHApO1xuICAgIH1cbn1cblxuIiwiLyoqXG4gKiBBcHBsaWNhdGlvbiB7e1BLR19WRVJTSU9OfX1cbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5Li75byV5pOOIOexu1xuICpcbiAqIOi0n+i0o+aJgOaciWNhbnZhc+eahOWxgue6p+euoeeQhu+8jOWSjOW/g+i3s+acuuWItueahOWunueOsCzmjZXojrfliLDlv4Pot7PljIXlkI4gXG4gKiDliIblj5HliLDlr7nlupTnmoRzdGFnZShjYW52YXMp5p2l57uY5Yi25a+55bqU55qE5pS55YqoXG4gKiDnhLblkI4g6buY6K6k5pyJ5a6e546w5LqGc2hhcGXnmoQgbW91c2VvdmVyICBtb3VzZW91dCAgZHJhZyDkuovku7ZcbiAqXG4gKiovXG5cbmltcG9ydCBVdGlscyBmcm9tIFwiLi91dGlscy9pbmRleFwiO1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiLi9ldmVudC9FdmVudEhhbmRsZXJcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFN0YWdlIGZyb20gXCIuL2Rpc3BsYXkvU3RhZ2VcIjtcbmltcG9ydCBSZW5kZXJlciBmcm9tIFwiLi9yZW5kZXJlcnMvY2FudmFzL0NhbnZhc1JlbmRlcmVyXCJcblxuXG4vL3V0aWxzXG5pbXBvcnQgXyBmcm9tIFwiLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgJCBmcm9tIFwiLi91dGlscy9kb21cIjtcblxuXG52YXIgQXBwbGljYXRpb24gPSBmdW5jdGlvbiggb3B0ICl7XG4gICAgdGhpcy50eXBlID0gXCJjYW52YXhcIjtcbiAgICB0aGlzLl9jaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMCk7IFxuICAgIFxuICAgIHRoaXMuZWwgPSAkLnF1ZXJ5KG9wdC5lbCk7XG5cbiAgICB0aGlzLndpZHRoID0gcGFyc2VJbnQoXCJ3aWR0aFwiICBpbiBvcHQgfHwgdGhpcy5lbC5vZmZzZXRXaWR0aCAgLCAxMCk7IFxuICAgIHRoaXMuaGVpZ2h0ID0gcGFyc2VJbnQoXCJoZWlnaHRcIiBpbiBvcHQgfHwgdGhpcy5lbC5vZmZzZXRIZWlnaHQgLCAxMCk7IFxuXG4gICAgdmFyIHZpZXdPYmogPSAkLmNyZWF0ZVZpZXcodGhpcy53aWR0aCAsIHRoaXMuaGVpZ2h0LCB0aGlzLl9jaWQpO1xuICAgIHRoaXMudmlldyA9IHZpZXdPYmoudmlldztcbiAgICB0aGlzLnN0YWdlX2MgPSB2aWV3T2JqLnN0YWdlX2M7XG4gICAgdGhpcy5kb21fYyA9IHZpZXdPYmouZG9tX2M7XG4gICAgXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoIHRoaXMudmlldyApO1xuXG4gICAgdGhpcy52aWV3T2Zmc2V0ID0gJC5vZmZzZXQodGhpcy52aWV3KTtcbiAgICB0aGlzLmxhc3RHZXRSTyA9IDA7Ly/mnIDlkI7kuIDmrKHojrflj5Ygdmlld09mZnNldCDnmoTml7bpl7RcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoIHRoaXMgKTtcblxuICAgIHRoaXMuZXZlbnQgPSBudWxsO1xuXG4gICAgdGhpcy5fYnVmZmVyU3RhZ2UgPSBudWxsO1xuXG4gICAgLy/mmK/lkKbpmLvmraLmtY/op4jlmajpu5jorqTkuovku7bnmoTmiafooYxcbiAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICBpZiggb3B0LnByZXZlbnREZWZhdWx0ID09PSBmYWxzZSApe1xuICAgICAgICB0aGlzLnByZXZlbnREZWZhdWx0ID0gZmFsc2VcbiAgICB9O1xuXG4gICAgQXBwbGljYXRpb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxuVXRpbHMuY3JlYXRDbGFzcyhBcHBsaWNhdGlvbiAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY29udGV4dC53aWR0aCAgPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7IFxuXG4gICAgICAgIC8v54S25ZCO5Yib5bu65LiA5Liq55So5LqO57uY5Yi25r+A5rS7IHNoYXBlIOeahCBzdGFnZSDliLBhY3RpdmF0aW9uXG4gICAgICAgIHRoaXMuX2NyZWF0SG92ZXJTdGFnZSgpO1xuXG4gICAgICAgIC8v5Yib5bu65LiA5Liq5aaC5p6c6KaB55So5YOP57Sg5qOA5rWL55qE5pe25YCZ55qE5a655ZmoXG4gICAgICAgIHRoaXMuX2NyZWF0ZVBpeGVsQ29udGV4dCgpO1xuICAgICAgICBcbiAgICB9LFxuICAgIHJlZ2lzdEV2ZW50IDogZnVuY3Rpb24ob3B0KXtcbiAgICAgICAgLy/liJ3lp4vljJbkuovku7blp5TmiZjliLByb2905YWD57Sg5LiK6Z2iXG4gICAgICAgIHRoaXMuZXZlbnQgPSBuZXcgRXZlbnRIYW5kbGVyKCB0aGlzICwgb3B0KTs7XG4gICAgICAgIHRoaXMuZXZlbnQuaW5pdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudDtcbiAgICB9LFxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uKCBvcHQgKXtcbiAgICAgICAgLy/ph43mlrDorr7nva7lnZDmoIfns7vnu58g6auY5a69IOetieOAglxuICAgICAgICB0aGlzLndpZHRoICAgICAgPSBwYXJzZUludCgob3B0ICYmIFwid2lkdGhcIiBpbiBvcHQpIHx8IHRoaXMuZWwub2Zmc2V0V2lkdGggICwgMTApOyBcbiAgICAgICAgdGhpcy5oZWlnaHQgICAgID0gcGFyc2VJbnQoKG9wdCAmJiBcImhlaWdodFwiIGluIG9wdCkgfHwgdGhpcy5lbC5vZmZzZXRIZWlnaHQgLCAxMCk7IFxuXG4gICAgICAgIHRoaXMudmlldy5zdHlsZS53aWR0aCAgPSB0aGlzLndpZHRoICtcInB4XCI7XG4gICAgICAgIHRoaXMudmlldy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCtcInB4XCI7XG5cbiAgICAgICAgdGhpcy52aWV3T2Zmc2V0ICAgICA9ICQub2Zmc2V0KHRoaXMudmlldyk7XG4gICAgICAgIHRoaXMuX25vdFdhdGNoICAgICAgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jb250ZXh0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLl9ub3RXYXRjaCAgICAgID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgdmFyIHJlU2l6ZUNhbnZhcyAgICA9IGZ1bmN0aW9uKGN0eCl7XG4gICAgICAgICAgICB2YXIgY2FudmFzID0gY3R4LmNhbnZhcztcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IG1lLndpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodD0gbWUuaGVpZ2h0KyBcInB4XCI7XG4gICAgICAgICAgICBjYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiAgLCBtZS53aWR0aCAqIFV0aWxzLl9kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiAsIG1lLmhlaWdodCogVXRpbHMuX2RldmljZVBpeGVsUmF0aW8pO1xuXG4gICAgICAgICAgICAvL+WmguaenOaYr3N3ZueahOivneWwsei/mOimgeiwg+eUqOi/meS4quaWueazleOAglxuICAgICAgICAgICAgaWYgKGN0eC5yZXNpemUpIHtcbiAgICAgICAgICAgICAgICBjdHgucmVzaXplKG1lLndpZHRoICwgbWUuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTsgXG4gICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuICwgZnVuY3Rpb24ocyAsIGkpe1xuICAgICAgICAgICAgcy5fbm90V2F0Y2ggICAgID0gdHJ1ZTtcbiAgICAgICAgICAgIHMuY29udGV4dC53aWR0aCA9IG1lLndpZHRoO1xuICAgICAgICAgICAgcy5jb250ZXh0LmhlaWdodD0gbWUuaGVpZ2h0O1xuICAgICAgICAgICAgcmVTaXplQ2FudmFzKHMuY29udGV4dDJEKTtcbiAgICAgICAgICAgIHMuX25vdFdhdGNoICAgICA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRvbV9jLnN0eWxlLndpZHRoICA9IHRoaXMud2lkdGggICsgXCJweFwiO1xuICAgICAgICB0aGlzLmRvbV9jLnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgIHRoaXMuaGVhcnRCZWF0KCk7XG5cbiAgICB9LFxuICAgIGdldEhvdmVyU3RhZ2UgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyU3RhZ2U7XG4gICAgfSxcbiAgICBfY3JlYXRIb3ZlclN0YWdlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9UT0RPOuWIm+W7unN0YWdl55qE5pe25YCZ5LiA5a6a6KaB5Lyg5YWld2lkdGggaGVpZ2h0ICDkuKTkuKrlj4LmlbBcbiAgICAgICAgdGhpcy5fYnVmZmVyU3RhZ2UgPSBuZXcgU3RhZ2UoIHtcbiAgICAgICAgICAgIGlkIDogXCJhY3RpdkNhbnZhc1wiKyhuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICBjb250ZXh0IDoge1xuICAgICAgICAgICAgICAgIHdpZHRoIDogdGhpcy5jb250ZXh0LndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5jb250ZXh0LmhlaWdodFxuICAgICAgICAgICAgfVxuICAgICAgICB9ICk7XG4gICAgICAgIC8v6K+lc3RhZ2XkuI3lj4LkuI7kuovku7bmo4DmtYtcbiAgICAgICAgdGhpcy5fYnVmZmVyU3RhZ2UuX2V2ZW50RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFkZENoaWxkKCB0aGlzLl9idWZmZXJTdGFnZSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICog55So5p2l5qOA5rWL5paH5pysd2lkdGggaGVpZ2h0IFxuICAgICAqIEByZXR1cm4ge09iamVjdH0g5LiK5LiL5paHXG4gICAgKi9cbiAgICBfY3JlYXRlUGl4ZWxDb250ZXh0IDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfcGl4ZWxDYW52YXMgPSAkLnF1ZXJ5KFwiX3BpeGVsQ2FudmFzXCIpO1xuICAgICAgICBpZighX3BpeGVsQ2FudmFzKXtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcyA9ICQuY3JlYXRlQ2FudmFzKDAsIDAsIFwiX3BpeGVsQ2FudmFzXCIpOyBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5aaC5p6c5Y+I55qE6K+dIOWwseS4jemcgOimgeWcqOWIm+W7uuS6hlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBfcGl4ZWxDYW52YXMgKTtcbiAgICAgICAgVXRpbHMuaW5pdEVsZW1lbnQoIF9waXhlbENhbnZhcyApO1xuICAgICAgICBpZiggVXRpbHMuY2FudmFzU3VwcG9ydCgpICl7XG4gICAgICAgICAgICAvL2NhbnZhc+eahOivne+8jOWTquaAleaYr2Rpc3BsYXk6bm9uZeeahOmhteWPr+S7peeUqOadpeW3puWDj+e0oOajgOa1i+WSjG1lYXN1cmVUZXh05paH5pysd2lkdGjmo4DmtYtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS5kaXNwbGF5ICAgID0gXCJub25lXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2ZsYXNoQ2FudmFzIOeahOivne+8jHN3ZuWmguaenGRpc3BsYXk6bm9uZeS6huOAguWwseWBmuS4jeS6hm1lYXN1cmVUZXh0IOaWh+acrOWuveW6piDmo4DmtYvkuoZcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS56SW5kZXggICAgID0gLTE7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUucG9zaXRpb24gICA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgIF9waXhlbENhbnZhcy5zdHlsZS5sZWZ0ICAgICAgID0gLSB0aGlzLmNvbnRleHQud2lkdGggICsgXCJweFwiO1xuICAgICAgICAgICAgX3BpeGVsQ2FudmFzLnN0eWxlLnRvcCAgICAgICAgPSAtIHRoaXMuY29udGV4dC5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICBfcGl4ZWxDYW52YXMuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4ID0gX3BpeGVsQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgfSxcbiAgICB1cGRhdGVWaWV3T2Zmc2V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiggbm93IC0gdGhpcy5sYXN0R2V0Uk8gPiAxMDAwICl7XG4gICAgICAgICAgICB0aGlzLnZpZXdPZmZzZXQgICAgICA9ICQub2Zmc2V0KHRoaXMudmlldyk7XG4gICAgICAgICAgICB0aGlzLmxhc3RHZXRSTyAgICAgICA9IG5vdztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgX2FmdGVyQWRkQ2hpbGQgOiBmdW5jdGlvbiggc3RhZ2UgLCBpbmRleCApe1xuICAgICAgICB2YXIgY2FudmFzO1xuXG4gICAgICAgIGlmKCFzdGFnZS5jb250ZXh0MkQpe1xuICAgICAgICAgICAgY2FudmFzID0gJC5jcmVhdGVDYW52YXMoIHRoaXMuY29udGV4dC53aWR0aCAsIHRoaXMuY29udGV4dC5oZWlnaHQsIHN0YWdlLmlkICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMgPSBzdGFnZS5jb250ZXh0MkQuY2FudmFzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICB0aGlzLnN0YWdlX2MuYXBwZW5kQ2hpbGQoIGNhbnZhcyApO1xuICAgICAgICB9IGVsc2UgaWYodGhpcy5jaGlsZHJlbi5sZW5ndGg+MSkge1xuICAgICAgICAgICAgaWYoIGluZGV4ID09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAvL+WmguaenOayoeacieaMh+WumuS9jee9ru+8jOmCo+S5iOWwseaUvuWIsF9idWZmZXJTdGFnZeeahOS4i+mdouOAglxuICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5pbnNlcnRCZWZvcmUoIGNhbnZhcyAsIHRoaXMuX2J1ZmZlclN0YWdlLmNvbnRleHQyRC5jYW52YXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL+WmguaenOacieaMh+WumueahOS9jee9ru+8jOmCo+S5iOWwseaMh+WumueahOS9jee9ruadpVxuICAgICAgICAgICAgICAgIGlmKCBpbmRleCA+PSB0aGlzLmNoaWxkcmVuLmxlbmd0aC0xICl7XG4gICAgICAgICAgICAgICAgICAgdGhpcy5zdGFnZV9jLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2VfYy5pbnNlcnRCZWZvcmUoIGNhbnZhcyAsIHRoaXMuY2hpbGRyZW5bIGluZGV4IF0uY29udGV4dDJELmNhbnZhcyApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBVdGlscy5pbml0RWxlbWVudCggY2FudmFzICk7XG4gICAgICAgIHN0YWdlLmluaXRTdGFnZSggY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSAsIHRoaXMuY29udGV4dC53aWR0aCAsIHRoaXMuY29udGV4dC5oZWlnaHQgKTsgXG4gICAgfSxcbiAgICBfYWZ0ZXJEZWxDaGlsZCA6IGZ1bmN0aW9uKHN0YWdlKXtcbiAgICAgICAgdGhpcy5zdGFnZV9jLnJlbW92ZUNoaWxkKCBzdGFnZS5jb250ZXh0MkQuY2FudmFzICk7XG4gICAgfSxcbiAgICBcbiAgICBoZWFydEJlYXQgOiBmdW5jdGlvbihvcHQpe1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmhlYXJ0QmVhdChvcHQpO1xuICAgIH1cbn0gKTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb247IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5qih5oufYXMzIOS4rSDnmoRzcHJpdGXnsbvvvIznm67liY3ov5jlj6rmmK/kuKrnroDljZXnmoTlrrnmmJPjgIJcbiAqL1xuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXIgZnJvbSBcIi4vRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG52YXIgU3ByaXRlID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLnR5cGUgPSBcInNwcml0ZVwiO1xuICAgIFNwcml0ZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKFNwcml0ZSAsIERpc3BsYXlPYmplY3RDb250YWluZXIgLCB7XG4gICAgaW5pdCA6IGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNwcml0ZTtcbiIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyBEaXNwbGF5TGlzdCDkuK3nmoRzaGFwZSDnsbtcbiAqL1xuaW1wb3J0IERpc3BsYXlPYmplY3QgZnJvbSBcIi4vRGlzcGxheU9iamVjdFwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xuXG52YXIgU2hhcGUgPSBmdW5jdGlvbihvcHQpe1xuICAgIFxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvL+WFg+e0oOaYr+WQpuaciWhvdmVy5LqL5Lu2IOWSjCBjaGlja+S6i+S7tu+8jOeUsWFkZEV2ZW5ldExpc3RlcuWSjHJlbWl2ZUV2ZW50TGlzdGVy5p2l6Kem5Y+R5L+u5pS5XG4gICAgc2VsZi5faG92ZXJhYmxlICA9IGZhbHNlO1xuICAgIHNlbGYuX2NsaWNrYWJsZSAgPSBmYWxzZTtcblxuICAgIC8vb3ZlcueahOaXtuWAmeWmguaenOacieS/ruaUueagt+W8j++8jOWwseS4unRydWVcbiAgICBzZWxmLl9ob3ZlckNsYXNzID0gZmFsc2U7XG4gICAgc2VsZi5ob3ZlckNsb25lICA9IHRydWU7ICAgIC8v5piv5ZCm5byA5ZCv5ZyoaG92ZXLnmoTml7blgJljbG9uZeS4gOS7veWIsGFjdGl2ZSBzdGFnZSDkuK0gXG4gICAgc2VsZi5wb2ludENoa1ByaW9yaXR5ID0gdHJ1ZTsgLy/lnKjpvKDmoIdtb3VzZW92ZXLliLDor6XoioLngrnvvIznhLblkI5tb3VzZW1vdmXnmoTml7blgJnvvIzmmK/lkKbkvJjlhYjmo4DmtYvor6XoioLngrlcblxuICAgIC8v5ouW5ou9ZHJhZ+eahOaXtuWAmeaYvuekuuWcqGFjdGl2U2hhcGXnmoTlia/mnKxcbiAgICBzZWxmLl9kcmFnRHVwbGljYXRlID0gbnVsbDtcblxuICAgIC8v5YWD57Sg5piv5ZCmIOW8gOWQryBkcmFnIOaLluWKqO+8jOi/meS4quacieeUqOaIt+iuvue9ruS8oOWFpVxuICAgIC8vc2VsZi5kcmFnZ2FibGUgPSBvcHQuZHJhZ2dhYmxlIHx8IGZhbHNlO1xuXG4gICAgc2VsZi50eXBlID0gc2VsZi50eXBlIHx8IFwic2hhcGVcIiA7XG4gICAgb3B0LmRyYXcgJiYgKHNlbGYuZHJhdz1vcHQuZHJhdyk7XG4gICAgXG4gICAgLy/lpITnkIbmiYDmnInnmoTlm77lvaLkuIDkupvlhbHmnInnmoTlsZ7mgKfphY3nva5cbiAgICBzZWxmLmluaXRDb21wUHJvcGVydHkob3B0KTtcblxuICAgIFNoYXBlLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcyAsIGFyZ3VtZW50cyk7XG4gICAgc2VsZi5fcmVjdCA9IG51bGw7XG59O1xuXG5VdGlscy5jcmVhdENsYXNzKFNoYXBlICwgRGlzcGxheU9iamVjdCAsIHtcbiAgIGluaXQgOiBmdW5jdGlvbigpe1xuICAgfSxcbiAgIGluaXRDb21wUHJvcGVydHkgOiBmdW5jdGlvbiggb3B0ICl7XG4gICAgICAgZm9yKCB2YXIgaSBpbiBvcHQgKXtcbiAgICAgICAgICAgaWYoIGkgIT0gXCJpZFwiICYmIGkgIT0gXCJjb250ZXh0XCIpe1xuICAgICAgICAgICAgICAgdGhpc1tpXSA9IG9wdFtpXTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgIH0sXG4gICAvKlxuICAgICrkuIvpnaLkuKTkuKrmlrnms5XkuLrmj5Dkvpvnu5kg5YW35L2T55qEIOWbvuW9ouexu+imhuebluWunueOsO+8jOacrHNoYXBl57G75LiN5o+Q5L6b5YW35L2T5a6e546wXG4gICAgKmRyYXcoKSDnu5jliLYgICBhbmQgICBzZXRSZWN0KCnojrflj5bor6XnsbvnmoTnn6nlvaLovrnnlYxcbiAgICovXG4gICBkcmF3OmZ1bmN0aW9uKCl7XG4gICBcbiAgIH0sXG4gICBkcmF3RW5kIDogZnVuY3Rpb24oY3R4KXtcbiAgICAgICBpZih0aGlzLl9oYXNGaWxsQW5kU3Ryb2tlKXtcbiAgICAgICAgICAgLy/lpoLmnpzlnKjlrZBzaGFwZeexu+mHjOmdouW3sue7j+WunueOsHN0cm9rZSBmaWxsIOetieaTjeS9nO+8jCDlsLHkuI3pnIDopoHnu5/kuIDnmoRkXG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG5cbiAgICAgICAvL3N0eWxlIOimgeS7jmRpYXBsYXlPYmplY3TnmoQgY29udGV4dOS4iumdouWOu+WPllxuICAgICAgIHZhciBzdHlsZSA9IHRoaXMuY29udGV4dDtcbiBcbiAgICAgICAvL2ZpbGwgc3Ryb2tlIOS5i+WJje+8jCDlsLHlupTor6XopoFjbG9zZXBhdGgg5ZCm5YiZ57q/5p2h6L2s6KeS5Y+j5Lya5pyJ57y65Y+j44CCXG4gICAgICAgLy9kcmF3VHlwZU9ubHkg55Sx57un5om/c2hhcGXnmoTlhbfkvZPnu5jliLbnsbvmj5DkvptcbiAgICAgICBpZiAoIHRoaXMuX2RyYXdUeXBlT25seSAhPSBcInN0cm9rZVwiICYmIHRoaXMudHlwZSAhPSBcInBhdGhcIil7XG4gICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICB9XG5cbiAgICAgICBpZiAoIHN0eWxlLnN0cm9rZVN0eWxlICYmIHN0eWxlLmxpbmVXaWR0aCApe1xuICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgfVxuICAgICAgIC8v5q+U5aaC6LSd5aGe5bCU5puy57q/55S755qE57q/LGRyYXdUeXBlT25seT09c3Ryb2tl77yM5piv5LiN6IO95L2/55SoZmlsbOeahO+8jOWQjuaenOW+iOS4pemHjVxuICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgJiYgdGhpcy5fZHJhd1R5cGVPbmx5IT1cInN0cm9rZVwiKXtcbiAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICB9XG4gICAgICAgXG4gICB9LFxuXG5cbiAgIHJlbmRlciA6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgY3R4ICA9IHRoaXMuZ2V0U3RhZ2UoKS5jb250ZXh0MkQ7XG4gICAgICBcbiAgICAgIGlmICh0aGlzLmNvbnRleHQudHlwZSA9PSBcInNoYXBlXCIpe1xuICAgICAgICAgIC8vdHlwZSA9PSBzaGFwZeeahOaXtuWAme+8jOiHquWumuS5iee7mOeUu1xuICAgICAgICAgIC8v6L+Z5Liq5pe25YCZ5bCx5Y+v5Lul5L2/55Soc2VsZi5ncmFwaGljc+e7mOWbvuaOpeWPo+S6hu+8jOivpeaOpeWPo+aooeaLn+eahOaYr2FzM+eahOaOpeWPo1xuICAgICAgICAgIHRoaXMuZHJhdy5hcHBseSggdGhpcyApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL+i/meS4quaXtuWAme+8jOivtOaYjuivpXNoYXBl5piv6LCD55So5bey57uP57uY5Yi25aW955qEIHNoYXBlIOaooeWdl++8jOi/meS6m+aooeWdl+WFqOmDqOWcqC4uL3NoYXBl55uu5b2V5LiL6Z2iXG4gICAgICAgICAgaWYoIHRoaXMuZHJhdyApe1xuICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgIHRoaXMuZHJhdyggY3R4ICwgdGhpcy5jb250ZXh0ICk7XG4gICAgICAgICAgICAgIHRoaXMuZHJhd0VuZCggY3R4ICk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgfVxuICAgLFxuICAgLypcbiAgICAqIOeUu+iZmue6v1xuICAgICovXG4gICBkYXNoZWRMaW5lVG86ZnVuY3Rpb24oY3R4LCB4MSwgeTEsIHgyLCB5MiwgZGFzaExlbmd0aCkge1xuICAgICAgICAgZGFzaExlbmd0aCA9IHR5cGVvZiBkYXNoTGVuZ3RoID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgICAgICAgPyAzIDogZGFzaExlbmd0aDtcbiAgICAgICAgIGRhc2hMZW5ndGggPSBNYXRoLm1heCggZGFzaExlbmd0aCAsIHRoaXMuY29udGV4dC5saW5lV2lkdGggKTtcbiAgICAgICAgIHZhciBkZWx0YVggPSB4MiAtIHgxO1xuICAgICAgICAgdmFyIGRlbHRhWSA9IHkyIC0geTE7XG4gICAgICAgICB2YXIgbnVtRGFzaGVzID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICBNYXRoLnNxcnQoZGVsdGFYICogZGVsdGFYICsgZGVsdGFZICogZGVsdGFZKSAvIGRhc2hMZW5ndGhcbiAgICAgICAgICk7XG4gICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bURhc2hlczsgKytpKSB7XG4gICAgICAgICAgICAgdmFyIHggPSBwYXJzZUludCh4MSArIChkZWx0YVggLyBudW1EYXNoZXMpICogaSk7XG4gICAgICAgICAgICAgdmFyIHkgPSBwYXJzZUludCh5MSArIChkZWx0YVkgLyBudW1EYXNoZXMpICogaSk7XG4gICAgICAgICAgICAgY3R4W2kgJSAyID09PSAwID8gJ21vdmVUbycgOiAnbGluZVRvJ10oIHggLCB5ICk7XG4gICAgICAgICAgICAgaWYoIGkgPT0gKG51bURhc2hlcy0xKSAmJiBpJTIgPT09IDApe1xuICAgICAgICAgICAgICAgICBjdHgubGluZVRvKCB4MiAsIHkyICk7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgfSxcbiAgIC8qXG4gICAgKuS7jmNwbOiKgueCueS4reiOt+WPluWIsDTkuKrmlrnlkJHnmoTovrnnlYzoioLngrlcbiAgICAqQHBhcmFtICBjb250ZXh0IFxuICAgICpcbiAgICAqKi9cbiAgIGdldFJlY3RGb3JtUG9pbnRMaXN0IDogZnVuY3Rpb24oIGNvbnRleHQgKXtcbiAgICAgICB2YXIgbWluWCA9ICBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgIHZhciBtYXhYID0gIE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgdmFyIG1pblkgPSAgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICB2YXIgbWF4WSA9ICBOdW1iZXIuTUlOX1ZBTFVFO1xuXG4gICAgICAgdmFyIGNwbCA9IGNvbnRleHQucG9pbnRMaXN0OyAvL3RoaXMuZ2V0Y3BsKCk7XG4gICAgICAgZm9yKHZhciBpID0gMCwgbCA9IGNwbC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgaWYgKGNwbFtpXVswXSA8IG1pblgpIHtcbiAgICAgICAgICAgICAgIG1pblggPSBjcGxbaV1bMF07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVswXSA+IG1heFgpIHtcbiAgICAgICAgICAgICAgIG1heFggPSBjcGxbaV1bMF07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVsxXSA8IG1pblkpIHtcbiAgICAgICAgICAgICAgIG1pblkgPSBjcGxbaV1bMV07XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYgKGNwbFtpXVsxXSA+IG1heFkpIHtcbiAgICAgICAgICAgICAgIG1heFkgPSBjcGxbaV1bMV07XG4gICAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICB2YXIgbGluZVdpZHRoO1xuICAgICAgIGlmIChjb250ZXh0LnN0cm9rZVN0eWxlIHx8IGNvbnRleHQuZmlsbFN0eWxlICApIHtcbiAgICAgICAgICAgbGluZVdpZHRoID0gY29udGV4dC5saW5lV2lkdGggfHwgMTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4ge1xuICAgICAgICAgICB4ICAgICAgOiBNYXRoLnJvdW5kKG1pblggLSBsaW5lV2lkdGggLyAyKSxcbiAgICAgICAgICAgeSAgICAgIDogTWF0aC5yb3VuZChtaW5ZIC0gbGluZVdpZHRoIC8gMiksXG4gICAgICAgICAgIHdpZHRoICA6IG1heFggLSBtaW5YICsgbGluZVdpZHRoLFxuICAgICAgICAgICBoZWlnaHQgOiBtYXhZIC0gbWluWSArIGxpbmVXaWR0aFxuICAgICAgIH07XG4gICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcGU7XG4iLCIvKipcclxuICogQ2FudmF4LS1UZXh0XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5paH5pysIOexu1xyXG4gKiovXHJcbmltcG9ydCBEaXNwbGF5T2JqZWN0IGZyb20gXCIuL0Rpc3BsYXlPYmplY3RcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFRleHQgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgc2VsZi5fcmVOZXdsaW5lID0gL1xccj9cXG4vO1xyXG4gICAgc2VsZi5mb250UHJvcGVydHMgPSBbXCJmb250U3R5bGVcIiwgXCJmb250VmFyaWFudFwiLCBcImZvbnRXZWlnaHRcIiwgXCJmb250U2l6ZVwiLCBcImZvbnRGYW1pbHlcIl07XHJcblxyXG4gICAgLy/lgZrkuIDmrKHnroDljZXnmoRvcHTlj4LmlbDmoKHpqozvvIzkv53or4HlnKjnlKjmiLfkuI3kvKBvcHTnmoTml7blgJkg5oiW6ICF5Lyg5LqGb3B05L2G5piv6YeM6Z2i5rKh5pyJY29udGV4dOeahOaXtuWAmeaKpemUmVxyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuXHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgIGZvbnRTaXplOiAxMywgLy/lrZfkvZPlpKflsI/pu5jorqQxM1xyXG4gICAgICAgIGZvbnRXZWlnaHQ6IFwibm9ybWFsXCIsXHJcbiAgICAgICAgZm9udEZhbWlseTogXCLlvq7ova/pm4Xpu5Esc2Fucy1zZXJpZlwiLFxyXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiBudWxsLFxyXG4gICAgICAgIGZpbGxTdHlsZTogJ2JsYW5rJyxcclxuICAgICAgICBzdHJva2VTdHlsZTogbnVsbCxcclxuICAgICAgICBsaW5lV2lkdGg6IDAsXHJcbiAgICAgICAgbGluZUhlaWdodDogMS4yLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogbnVsbCxcclxuICAgICAgICB0ZXh0QmFja2dyb3VuZENvbG9yOiBudWxsXHJcbiAgICB9LCBvcHQuY29udGV4dCk7XHJcblxyXG4gICAgc2VsZi5fY29udGV4dC5mb250ID0gc2VsZi5fZ2V0Rm9udERlY2xhcmF0aW9uKCk7XHJcblxyXG4gICAgc2VsZi50ZXh0ID0gdGV4dC50b1N0cmluZygpO1xyXG5cclxuICAgIFRleHQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBbb3B0XSk7XHJcblxyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhUZXh0LCBEaXNwbGF5T2JqZWN0LCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIC8vY29udGV4dOWxnuaAp+acieWPmOWMlueahOebkeWQrOWHveaVsFxyXG4gICAgICAgIGlmIChfLmluZGV4T2YodGhpcy5mb250UHJvcGVydHMsIG5hbWUpID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGV4dFtuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAvL+WmguaenOS/ruaUueeahOaYr2ZvbnTnmoTmn5DkuKrlhoXlrrnvvIzlsLHph43mlrDnu4Too4XkuIDpgY1mb25055qE5YC877yMXHJcbiAgICAgICAgICAgIC8v54S25ZCO6YCa55+l5byV5pOO6L+Z5qyh5a+5Y29udGV4dOeahOS/ruaUueS4jemcgOimgeS4iuaKpeW/g+i3s1xyXG4gICAgICAgICAgICB0aGlzLl9ub3RXYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuX2dldEZvbnREZWNsYXJhdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQud2lkdGggPSB0aGlzLmdldFRleHRXaWR0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuaGVpZ2h0ID0gdGhpcy5nZXRUZXh0SGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGluaXQ6IGZ1bmN0aW9uKHRleHQsIG9wdCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBjLndpZHRoID0gdGhpcy5nZXRUZXh0V2lkdGgoKTtcclxuICAgICAgICBjLmhlaWdodCA9IHRoaXMuZ2V0VGV4dEhlaWdodCgpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oY3R4KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiB0aGlzLmNvbnRleHQuJG1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChwIGluIGN0eCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAgIT0gXCJ0ZXh0QmFzZWxpbmVcIiAmJiB0aGlzLmNvbnRleHQuJG1vZGVsW3BdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4W3BdID0gdGhpcy5jb250ZXh0LiRtb2RlbFtwXTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJUZXh0KGN0eCwgdGhpcy5fZ2V0VGV4dExpbmVzKCkpO1xyXG4gICAgfSxcclxuICAgIHJlc2V0VGV4dDogZnVuY3Rpb24odGV4dCkge1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLmhlYXJ0QmVhdCgpO1xyXG4gICAgfSxcclxuICAgIGdldFRleHRXaWR0aDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gMDtcclxuICAgICAgICBVdGlscy5fcGl4ZWxDdHguc2F2ZSgpO1xyXG4gICAgICAgIFV0aWxzLl9waXhlbEN0eC5mb250ID0gdGhpcy5jb250ZXh0LmZvbnQ7XHJcbiAgICAgICAgd2lkdGggPSB0aGlzLl9nZXRUZXh0V2lkdGgoVXRpbHMuX3BpeGVsQ3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICAgICAgVXRpbHMuX3BpeGVsQ3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gd2lkdGg7XHJcbiAgICB9LFxyXG4gICAgZ2V0VGV4dEhlaWdodDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFRleHRIZWlnaHQoVXRpbHMuX3BpeGVsQ3R4LCB0aGlzLl9nZXRUZXh0TGluZXMoKSk7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRMaW5lczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5zcGxpdCh0aGlzLl9yZU5ld2xpbmUpO1xyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dFN0cm9rZShjdHgsIHRleHRMaW5lcyk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyVGV4dEZpbGwoY3R4LCB0ZXh0TGluZXMpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX2dldEZvbnREZWNsYXJhdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBmb250QXJyID0gW107XHJcblxyXG4gICAgICAgIF8uZWFjaCh0aGlzLmZvbnRQcm9wZXJ0cywgZnVuY3Rpb24ocCkge1xyXG4gICAgICAgICAgICB2YXIgZm9udFAgPSBzZWxmLl9jb250ZXh0W3BdO1xyXG4gICAgICAgICAgICBpZiAocCA9PSBcImZvbnRTaXplXCIpIHtcclxuICAgICAgICAgICAgICAgIGZvbnRQID0gcGFyc2VGbG9hdChmb250UCkgKyBcInB4XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb250UCAmJiBmb250QXJyLnB1c2goZm9udFApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZm9udEFyci5qb2luKCcgJyk7XHJcblxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJUZXh0RmlsbDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5maWxsU3R5bGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5fYm91bmRhcmllcyA9IFtdO1xyXG4gICAgICAgIHZhciBsaW5lSGVpZ2h0cyA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0T2ZMaW5lID0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKGN0eCwgaSwgdGV4dExpbmVzKTtcclxuICAgICAgICAgICAgbGluZUhlaWdodHMgKz0gaGVpZ2h0T2ZMaW5lO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyVGV4dExpbmUoXHJcbiAgICAgICAgICAgICAgICAnZmlsbFRleHQnLFxyXG4gICAgICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICAgICAgdGV4dExpbmVzW2ldLFxyXG4gICAgICAgICAgICAgICAgMCwgLy90aGlzLl9nZXRMZWZ0T2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRUb3BPZmZzZXQoKSArIGxpbmVIZWlnaHRzLFxyXG4gICAgICAgICAgICAgICAgaVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcmVuZGVyVGV4dFN0cm9rZTogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5zdHJva2VTdHlsZSB8fCAhdGhpcy5jb250ZXh0LmxpbmVXaWR0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgbGluZUhlaWdodHMgPSAwO1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLnN0cm9rZURhc2hBcnJheSkge1xyXG4gICAgICAgICAgICBpZiAoMSAmIHRoaXMuc3Ryb2tlRGFzaEFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHJva2VEYXNoQXJyYXkucHVzaC5hcHBseSh0aGlzLnN0cm9rZURhc2hBcnJheSwgdGhpcy5zdHJva2VEYXNoQXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cHBvcnRzTGluZURhc2ggJiYgY3R4LnNldExpbmVEYXNoKHRoaXMuc3Ryb2tlRGFzaEFycmF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGV4dExpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHRPZkxpbmUgPSB0aGlzLl9nZXRIZWlnaHRPZkxpbmUoY3R4LCBpLCB0ZXh0TGluZXMpO1xyXG4gICAgICAgICAgICBsaW5lSGVpZ2h0cyArPSBoZWlnaHRPZkxpbmU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJUZXh0TGluZShcclxuICAgICAgICAgICAgICAgICdzdHJva2VUZXh0JyxcclxuICAgICAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgICAgIHRleHRMaW5lc1tpXSxcclxuICAgICAgICAgICAgICAgIDAsIC8vdGhpcy5fZ2V0TGVmdE9mZnNldCgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0VG9wT2Zmc2V0KCkgKyBsaW5lSGVpZ2h0cyxcclxuICAgICAgICAgICAgICAgIGlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9LFxyXG4gICAgX3JlbmRlclRleHRMaW5lOiBmdW5jdGlvbihtZXRob2QsIGN0eCwgbGluZSwgbGVmdCwgdG9wLCBsaW5lSW5kZXgpIHtcclxuICAgICAgICB0b3AgLT0gdGhpcy5fZ2V0SGVpZ2h0T2ZMaW5lKCkgLyA0O1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHQudGV4dEFsaWduICE9PSAnanVzdGlmeScpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIGxpbmUsIGxlZnQsIHRvcCwgbGluZUluZGV4KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lKS53aWR0aDtcclxuICAgICAgICB2YXIgdG90YWxXaWR0aCA9IHRoaXMuY29udGV4dC53aWR0aDtcclxuXHJcbiAgICAgICAgaWYgKHRvdGFsV2lkdGggPiBsaW5lV2lkdGgpIHtcclxuICAgICAgICAgICAgdmFyIHdvcmRzID0gbGluZS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICB2YXIgd29yZHNXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsaW5lLnJlcGxhY2UoL1xccysvZywgJycpKS53aWR0aDtcclxuICAgICAgICAgICAgdmFyIHdpZHRoRGlmZiA9IHRvdGFsV2lkdGggLSB3b3Jkc1dpZHRoO1xyXG4gICAgICAgICAgICB2YXIgbnVtU3BhY2VzID0gd29yZHMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgdmFyIHNwYWNlV2lkdGggPSB3aWR0aERpZmYgLyBudW1TcGFjZXM7XHJcblxyXG4gICAgICAgICAgICB2YXIgbGVmdE9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB3b3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ2hhcnMobWV0aG9kLCBjdHgsIHdvcmRzW2ldLCBsZWZ0ICsgbGVmdE9mZnNldCwgdG9wLCBsaW5lSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgbGVmdE9mZnNldCArPSBjdHgubWVhc3VyZVRleHQod29yZHNbaV0pLndpZHRoICsgc3BhY2VXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNoYXJzKG1ldGhvZCwgY3R4LCBsaW5lLCBsZWZ0LCB0b3AsIGxpbmVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9yZW5kZXJDaGFyczogZnVuY3Rpb24obWV0aG9kLCBjdHgsIGNoYXJzLCBsZWZ0LCB0b3ApIHtcclxuICAgICAgICBjdHhbbWV0aG9kXShjaGFycywgMCwgdG9wKTtcclxuICAgIH0sXHJcbiAgICBfZ2V0SGVpZ2h0T2ZMaW5lOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmZvbnRTaXplICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG4gICAgX2dldFRleHRXaWR0aDogZnVuY3Rpb24oY3R4LCB0ZXh0TGluZXMpIHtcclxuICAgICAgICB2YXIgbWF4V2lkdGggPSBjdHgubWVhc3VyZVRleHQodGV4dExpbmVzWzBdIHx8ICd8Jykud2lkdGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IHRleHRMaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudExpbmVXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXh0TGluZXNbaV0pLndpZHRoO1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudExpbmVXaWR0aCA+IG1heFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCA9IGN1cnJlbnRMaW5lV2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1heFdpZHRoO1xyXG4gICAgfSxcclxuICAgIF9nZXRUZXh0SGVpZ2h0OiBmdW5jdGlvbihjdHgsIHRleHRMaW5lcykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZm9udFNpemUgKiB0ZXh0TGluZXMubGVuZ3RoICogdGhpcy5jb250ZXh0LmxpbmVIZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVG9wIG9mZnNldFxyXG4gICAgICovXHJcbiAgICBfZ2V0VG9wT2Zmc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdCA9IDA7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtaWRkbGVcIjpcclxuICAgICAgICAgICAgICAgIHQgPSAtdGhpcy5jb250ZXh0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxyXG4gICAgICAgICAgICAgICAgdCA9IC10aGlzLmNvbnRleHQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfSxcclxuICAgIGdldFJlY3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIHZhciB4ID0gMDtcclxuICAgICAgICB2YXIgeSA9IDA7XHJcbiAgICAgICAgLy/mm7Tlhbd0ZXh0QWxpZ24g5ZKMIHRleHRCYXNlbGluZSDph43mlrDnn6vmraMgeHlcclxuICAgICAgICBpZiAoYy50ZXh0QWxpZ24gPT0gXCJjZW50ZXJcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGggLyAyO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGMudGV4dEFsaWduID09IFwicmlnaHRcIikge1xyXG4gICAgICAgICAgICB4ID0gLWMud2lkdGg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYy50ZXh0QmFzZWxpbmUgPT0gXCJtaWRkbGVcIikge1xyXG4gICAgICAgICAgICB5ID0gLWMuaGVpZ2h0IC8gMjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChjLnRleHRCYXNlbGluZSA9PSBcImJvdHRvbVwiKSB7XHJcbiAgICAgICAgICAgIHkgPSAtYy5oZWlnaHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgd2lkdGg6IGMud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogYy5oZWlnaHRcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBUZXh0OyIsIi8qKlxuICogQ2FudmF4XG4gKlxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxuICpcbiAqIOaooeaLn2FzMyDkuK0g55qETW92aWVjbGlw57G777yM55uu5YmN6L+Y5Y+q5piv5Liq566A5Y2V55qE5a655piT44CCXG4gKi9cbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lciBmcm9tIFwiLi9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XG5cbnZhciBNb3ZpZWNsaXAgPSBmdW5jdGlvbiggb3B0ICl7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xuICAgIHNlbGYudHlwZSA9IFwibW92aWVjbGlwXCI7XG4gICAgc2VsZi5jdXJyZW50RnJhbWUgID0gMDtcbiAgICBzZWxmLmF1dG9QbGF5ICAgICAgPSBvcHQuYXV0b1BsYXkgICB8fCBmYWxzZTsvL+aYr+WQpuiHquWKqOaSreaUvlxuICAgIHNlbGYucmVwZWF0ICAgICAgICA9IG9wdC5yZXBlYXQgICAgIHx8IDA7Ly/mmK/lkKblvqrnjq/mkq3mlL4scmVwZWF05Li65pWw5a2X77yM5YiZ6KGo56S65b6q546v5aSa5bCR5qyh77yM5Li6dHJ1ZSBvciAh6L+Q566X57uT5p6c5Li6dHJ1ZSDnmoTor53ooajnpLrmsLjkuYXlvqrnjq9cblxuICAgIHNlbGYub3ZlclBsYXkgICAgICA9IG9wdC5vdmVyUGxheSAgIHx8IGZhbHNlOyAvL+aYr+WQpuimhuebluaSreaUvu+8jOS4umZhbHNl5Y+q5pKt5pS+Y3VycmVudEZyYW1lIOW9k+WJjeW4pyx0cnVl5YiZ5Lya5pKt5pS+5b2T5YmN5binIOWSjCDlvZPliY3luKfkuYvliY3nmoTmiYDmnInlj6DliqBcblxuICAgIHNlbGYuX2ZyYW1lUmF0ZSAgICA9IFV0aWxzLm1haW5GcmFtZVJhdGU7XG4gICAgc2VsZi5fc3BlZWRUaW1lICAgID0gcGFyc2VJbnQoMTAwMC9zZWxmLl9mcmFtZVJhdGUpO1xuICAgIHNlbGYuX3ByZVJlbmRlclRpbWU9IDA7XG5cbiAgICBzZWxmLl9jb250ZXh0ID0ge1xuICAgICAgICAvL3IgOiBvcHQuY29udGV4dC5yIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5ZyG5Y2K5b6EXG4gICAgfVxuICAgIE1vdmllY2xpcC5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIFsgb3B0IF0gKTtcbn07XG5cblV0aWxzLmNyZWF0Q2xhc3MoTW92aWVjbGlwICwgRGlzcGxheU9iamVjdENvbnRhaW5lciAsIHtcbiAgICBpbml0IDogZnVuY3Rpb24oKXtcbiAgICAgICBcbiAgICB9LFxuICAgIGdldFN0YXR1cyAgICA6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8v5p+l6K+iTW92aWVjbGlw55qEYXV0b1BsYXnnirbmgIFcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0b1BsYXk7XG4gICAgfSxcbiAgICBnZXRGcmFtZVJhdGUgOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJhbWVSYXRlO1xuICAgIH0sXG4gICAgc2V0RnJhbWVSYXRlIDogZnVuY3Rpb24oZnJhbWVSYXRlKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmKHNlbGYuX2ZyYW1lUmF0ZSAgPT0gZnJhbWVSYXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fZnJhbWVSYXRlICA9IGZyYW1lUmF0ZTtcblxuICAgICAgICAvL+agueaNruacgOaWsOeahOW4p+eOh++8jOadpeiuoeeul+acgOaWsOeahOmXtOmalOWIt+aWsOaXtumXtFxuICAgICAgICBzZWxmLl9zcGVlZFRpbWUgPSBwYXJzZUludCggMTAwMC9zZWxmLl9mcmFtZVJhdGUgKTtcbiAgICB9LCBcbiAgICBhZnRlckFkZENoaWxkOmZ1bmN0aW9uKGNoaWxkICwgaW5kZXgpe1xuICAgICAgIGlmKHRoaXMuY2hpbGRyZW4ubGVuZ3RoPT0xKXtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgfVxuXG4gICAgICAgaWYoIGluZGV4ICE9IHVuZGVmaW5lZCAmJiBpbmRleCA8PSB0aGlzLmN1cnJlbnRGcmFtZSApe1xuICAgICAgICAgIC8v5o+S5YWl5b2T5YmNZnJhbWXnmoTliY3pnaIgXG4gICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUrKztcbiAgICAgICB9XG4gICAgfSxcbiAgICBhZnRlckRlbENoaWxkOmZ1bmN0aW9uKGNoaWxkLGluZGV4KXtcbiAgICAgICAvL+iusOW9leS4i+W9k+WJjeW4p1xuICAgICAgIHZhciBwcmVGcmFtZSA9IHRoaXMuY3VycmVudEZyYW1lO1xuXG4gICAgICAgLy/lpoLmnpzlubLmjonnmoTmmK/lvZPliY3luKfliY3pnaLnmoTluKfvvIzlvZPliY3luKfnmoTntKLlvJXlsLHlvoDkuIrotbDkuIDkuKpcbiAgICAgICBpZihpbmRleCA8IHRoaXMuY3VycmVudEZyYW1lKXtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZS0tO1xuICAgICAgIH1cblxuICAgICAgIC8v5aaC5p6c5bmy5o6J5LqG5YWD57Sg5ZCO5b2T5YmN5bin5bey57uP6LaF6L+H5LqGbGVuZ3RoXG4gICAgICAgaWYoKHRoaXMuY3VycmVudEZyYW1lID49IHRoaXMuY2hpbGRyZW4ubGVuZ3RoKSAmJiB0aGlzLmNoaWxkcmVuLmxlbmd0aD4wKXtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoLTE7XG4gICAgICAgfTtcbiAgICB9LFxuICAgIF9nb3RvOmZ1bmN0aW9uKGkpe1xuICAgICAgIHZhciBsZW4gPSB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICBpZihpPj0gbGVuKXtcbiAgICAgICAgICBpID0gaSVsZW47XG4gICAgICAgfVxuICAgICAgIGlmKGk8MCl7XG4gICAgICAgICAgaSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoLTEtTWF0aC5hYnMoaSklbGVuO1xuICAgICAgIH1cbiAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IGk7XG4gICAgfSxcbiAgICBnb3RvQW5kU3RvcDpmdW5jdGlvbihpKXtcbiAgICAgICB0aGlzLl9nb3RvKGkpO1xuICAgICAgIGlmKCF0aGlzLmF1dG9QbGF5KXtcbiAgICAgICAgIC8v5YaNc3RvcOeahOeKtuaAgeS4i+mdoui3s+W4p++8jOWwseimgeWRiuiviXN0YWdl5Y675Y+R5b+D6LezXG4gICAgICAgICB0aGlzLl9wcmVSZW5kZXJUaW1lID0gMDtcbiAgICAgICAgIHRoaXMuZ2V0U3RhZ2UoKS5oZWFydEJlYXQoKTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG4gICAgICAgdGhpcy5hdXRvUGxheSA9IGZhbHNlO1xuICAgIH0sXG4gICAgc3RvcDpmdW5jdGlvbigpe1xuICAgICAgIGlmKCF0aGlzLmF1dG9QbGF5KXtcbiAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG4gICAgICAgdGhpcy5hdXRvUGxheSA9IGZhbHNlO1xuICAgIH0sXG4gICAgZ290b0FuZFBsYXk6ZnVuY3Rpb24oaSl7XG4gICAgICAgdGhpcy5fZ290byhpKTtcbiAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9LFxuICAgIHBsYXk6ZnVuY3Rpb24oKXtcbiAgICAgICBpZih0aGlzLmF1dG9QbGF5KXtcbiAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG4gICAgICAgdGhpcy5hdXRvUGxheSA9IHRydWU7XG4gICAgICAgdmFyIGNhbnZheCA9IHRoaXMuZ2V0U3RhZ2UoKS5wYXJlbnQ7XG4gICAgICAgaWYoIWNhbnZheC5faGVhcnRCZWF0ICYmIGNhbnZheC5fdGFza0xpc3QubGVuZ3RoPT0wKXtcbiAgICAgICAgICAgLy/miYvliqjlkK/liqjlvJXmk45cbiAgICAgICAgICAgY2FudmF4Ll9fc3RhcnRFbnRlcigpO1xuICAgICAgIH1cbiAgICAgICB0aGlzLl9wdXNoMlRhc2tMaXN0KCk7XG4gICAgICAgXG4gICAgICAgdGhpcy5fcHJlUmVuZGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0sXG4gICAgX3B1c2gyVGFza0xpc3QgOiBmdW5jdGlvbigpe1xuICAgICAgIC8v5oqKZW50ZXJGcmFtZSBwdXNoIOWIsCDlvJXmk47nmoTku7vliqHliJfooahcbiAgICAgICBpZighdGhpcy5fZW50ZXJJbkNhbnZheCl7XG4gICAgICAgICB0aGlzLmdldFN0YWdlKCkucGFyZW50Ll90YXNrTGlzdC5wdXNoKCB0aGlzICk7XG4gICAgICAgICB0aGlzLl9lbnRlckluQ2FudmF4PXRydWU7XG4gICAgICAgfVxuICAgIH0sXG4gICAgLy9hdXRvUGxheeS4unRydWUg6ICM5LiU5bey57uP5oqKX19lbnRlckZyYW1lIHB1c2gg5Yiw5LqG5byV5pOO55qE5Lu75Yqh6Zif5YiX77yMXG4gICAgLy/liJnkuLp0cnVlXG4gICAgX2VudGVySW5DYW52YXg6ZmFsc2UsIFxuICAgIF9fZW50ZXJGcmFtZTpmdW5jdGlvbigpe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBpZigoVXRpbHMubm93LXNlbGYuX3ByZVJlbmRlclRpbWUpID49IHNlbGYuX3NwZWVkVGltZSApe1xuICAgICAgICAgICAvL+Wkp+S6jl9zcGVlZFRpbWXvvIzmiY3nrpflrozmiJDkuobkuIDluKdcbiAgICAgICAgICAgLy/kuIrmiqXlv4Pot7Mg5peg5p2h5Lu25b+D6Lez5ZCn44CCXG4gICAgICAgICAgIC8v5ZCO57ut5Y+v5Lul5Yqg5LiK5a+55bqU55qEIE1vdmllY2xpcCDot7PluKcg5b+D6LezXG4gICAgICAgICAgIHNlbGYuZ2V0U3RhZ2UoKS5oZWFydEJlYXQoKTtcbiAgICAgICB9XG5cbiAgICB9LFxuICAgIG5leHQgIDpmdW5jdGlvbigpe1xuICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICBpZighc2VsZi5hdXRvUGxheSl7XG4gICAgICAgICAgIC8v5Y+q5pyJ5YaN6Z2e5pKt5pS+54q25oCB5LiL5omN5pyJ5pWIXG4gICAgICAgICAgIHNlbGYuZ290b0FuZFN0b3Aoc2VsZi5fbmV4dCgpKTtcbiAgICAgICB9XG4gICAgfSxcbiAgICBwcmUgICA6ZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYoIXNlbGYuYXV0b1BsYXkpe1xuICAgICAgICAgICAvL+WPquacieWGjemdnuaSreaUvueKtuaAgeS4i+aJjeacieaViFxuICAgICAgICAgICBzZWxmLmdvdG9BbmRTdG9wKHNlbGYuX3ByZSgpKTtcbiAgICAgICB9XG4gICAgfSxcbiAgICBfbmV4dCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgIGlmKHRoaXMuY3VycmVudEZyYW1lID49IHRoaXMuY2hpbGRyZW4ubGVuZ3RoLTEpe1xuICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XG4gICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWUrKztcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEZyYW1lO1xuICAgIH0sXG5cbiAgICBfcHJlIDogZnVuY3Rpb24oKXtcbiAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgaWYodGhpcy5jdXJyZW50RnJhbWUgPT0gMCl7XG4gICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gdGhpcy5jaGlsZHJlbi5sZW5ndGgtMTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZS0tO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50RnJhbWU7XG4gICAgfSxcbiAgICByZW5kZXI6ZnVuY3Rpb24oY3R4KXtcbiAgICAgICAgLy/ov5nph4zkuZ/ov5jopoHlgZrmrKHov4fmu6TvvIzlpoLmnpzkuI3liLBzcGVlZFRpbWXvvIzlsLHnlaXov4dcblxuICAgICAgICAvL1RPRE/vvJrlpoLmnpzmmK/mlLnlj5htb3ZpY2xpcOeahHggb3IgeSDnrYkg6Z2e5bin5Yqo55S7IOWxnuaAp+eahOaXtuWAmeWKoOS4iui/meS4quWwseS8miDmnInmvI/luKfnjrDosaHvvIzlhYjms6jph4rmjolcbiAgICAgICAgLyogXG4gICAgICAgIGlmKCAoVXRpbHMubm93LXRoaXMuX3ByZVJlbmRlclRpbWUpIDwgdGhpcy5fc3BlZWRUaW1lICl7XG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAqL1xuXG4gICAgICAgIC8v5Zug5Li65aaC5p6cY2hpbGRyZW7kuLrnqbrnmoTor53vvIxNb3ZpZWNsaXAg5Lya5oqK6Ieq5bex6K6+572u5Li6IHZpc2libGU6ZmFsc2XvvIzkuI3kvJrmiafooYzliLDov5nkuKpyZW5kZXJcbiAgICAgICAgLy/miYDku6Xov5nph4zlj6/ku6XkuI3nlKjlgZpjaGlsZHJlbi5sZW5ndGg9PTAg55qE5Yik5pat44CCIOWkp+iDhueahOaQnuWQp+OAglxuXG4gICAgICAgIGlmKCAhdGhpcy5vdmVyUGxheSApe1xuICAgICAgICAgICAgdGhpcy5nZXRDaGlsZEF0KHRoaXMuY3VycmVudEZyYW1lKS5fcmVuZGVyKGN0eCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IodmFyIGk9MCA7IGkgPD0gdGhpcy5jdXJyZW50RnJhbWUgOyBpKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRBdChpKS5fcmVuZGVyKGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PSAxKXtcbiAgICAgICAgICAgIHRoaXMuYXV0b1BsYXkgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v5aaC5p6c5LiN5b6q546vXG4gICAgICAgIGlmKCB0aGlzLmN1cnJlbnRGcmFtZSA9PSB0aGlzLmdldE51bUNoaWxkcmVuKCktMSApe1xuICAgICAgICAgICAgLy/pgqPkuYjvvIzliLDkuobmnIDlkI7kuIDluKflsLHlgZzmraJcbiAgICAgICAgICAgIGlmKCF0aGlzLnJlcGVhdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmhhc0V2ZW50KFwiZW5kXCIpICl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyZShcImVuZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+S9v+eUqOaOieS4gOasoeW+queOr1xuICAgICAgICAgICAgaWYoIF8uaXNOdW1iZXIoIHRoaXMucmVwZWF0ICkgJiYgdGhpcy5yZXBlYXQgPiAwICkge1xuICAgICAgICAgICAgICAgdGhpcy5yZXBlYXQgLS0gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5hdXRvUGxheSl7XG4gICAgICAgICAgICAvL+WmguaenOimgeaSreaUvlxuICAgICAgICAgICAgaWYoIChVdGlscy5ub3ctdGhpcy5fcHJlUmVuZGVyVGltZSkgPj0gdGhpcy5fc3BlZWRUaW1lICl7XG4gICAgICAgICAgICAgICAgLy/lhYjmiorlvZPliY3nu5jliLbnmoTml7bpl7TngrnorrDlvZVcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVSZW5kZXJUaW1lID0gVXRpbHMubm93O1xuICAgICAgICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3B1c2gyVGFza0xpc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5pqC5YGc5pKt5pS+XG4gICAgICAgICAgICBpZih0aGlzLl9lbnRlckluQ2FudmF4KXtcbiAgICAgICAgICAgICAgICAvL+WmguaenOi/meS4quaXtuWAmSDlt7Lnu48g5re75Yqg5Yiw5LqGY2FudmF455qE5Lu75Yqh5YiX6KGoXG4gICAgICAgICAgICAgICAgdGhpcy5fZW50ZXJJbkNhbnZheD1mYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgdExpc3QgPSB0aGlzLmdldFN0YWdlKCkucGFyZW50Ll90YXNrTGlzdDtcbiAgICAgICAgICAgICAgICB0TGlzdC5zcGxpY2UoIF8uaW5kZXhPZih0TGlzdCAsIHRoaXMpICwgMSApOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSBcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNb3ZpZWNsaXA7IiwiXG4vKipcbiAqIENhbnZheFxuICpcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcbiAqXG4gKiDlkJHph4/mk43kvZznsbtcbiAqICovXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG5mdW5jdGlvbiBWZWN0b3IoeCwgeSkge1xuICAgIHZhciB2eCA9IDAsdnkgPSAwO1xuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIF8uaXNPYmplY3QoIHggKSApe1xuICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiggXy5pc0FycmF5KCBhcmcgKSApe1xuICAgICAgICAgICB2eCA9IGFyZ1swXTtcbiAgICAgICAgICAgdnkgPSBhcmdbMV07XG4gICAgICAgIH0gZWxzZSBpZiggYXJnLmhhc093blByb3BlcnR5KFwieFwiKSAmJiBhcmcuaGFzT3duUHJvcGVydHkoXCJ5XCIpICkge1xuICAgICAgICAgICB2eCA9IGFyZy54O1xuICAgICAgICAgICB2eSA9IGFyZy55O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2F4ZXMgPSBbdngsIHZ5XTtcbn07XG5WZWN0b3IucHJvdG90eXBlID0ge1xuICAgIGRpc3RhbmNlOiBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgeCA9IHRoaXMuX2F4ZXNbMF0gLSB2Ll9heGVzWzBdO1xuICAgICAgICB2YXIgeSA9IHRoaXMuX2F4ZXNbMV0gLSB2Ll9heGVzWzFdO1xuXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHggKiB4KSArICh5ICogeSkpO1xuICAgIH1cbn07XG5leHBvcnQgZGVmYXVsdCBWZWN0b3I7IiwiLyoqXG4gKiBDYW52YXhcbiAqXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXG4gKlxuICog5aSE55CG5Li65bmz5ruR57q/5p2hXG4gKi9cbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIEBpbm5lclxuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZShwMCwgcDEsIHAyLCBwMywgdCwgdDIsIHQzKSB7XG4gICAgdmFyIHYwID0gKHAyIC0gcDApICogMC4yNTtcbiAgICB2YXIgdjEgPSAocDMgLSBwMSkgKiAwLjI1O1xuICAgIHJldHVybiAoMiAqIChwMSAtIHAyKSArIHYwICsgdjEpICogdDMgXG4gICAgICAgICAgICsgKC0gMyAqIChwMSAtIHAyKSAtIDIgKiB2MCAtIHYxKSAqIHQyXG4gICAgICAgICAgICsgdjAgKiB0ICsgcDE7XG59XG4vKipcbiAqIOWkmue6v+auteW5s+a7keabsue6vyBcbiAqIG9wdCA9PT4gcG9pbnRzICwgaXNMb29wXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICggb3B0ICkge1xuICAgIHZhciBwb2ludHMgPSBvcHQucG9pbnRzO1xuICAgIHZhciBpc0xvb3AgPSBvcHQuaXNMb29wO1xuICAgIHZhciBzbW9vdGhGaWx0ZXIgPSBvcHQuc21vb3RoRmlsdGVyO1xuXG4gICAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGg7XG4gICAgaWYoIGxlbiA9PSAxICl7XG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICAgIHZhciByZXQgPSBbXTtcbiAgICB2YXIgZGlzdGFuY2UgID0gMDtcbiAgICB2YXIgcHJlVmVydG9yID0gbmV3IFZlY3RvciggcG9pbnRzWzBdICk7XG4gICAgdmFyIGlWdG9yICAgICA9IG51bGxcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlWdG9yID0gbmV3IFZlY3Rvcihwb2ludHNbaV0pO1xuICAgICAgICBkaXN0YW5jZSArPSBwcmVWZXJ0b3IuZGlzdGFuY2UoIGlWdG9yICk7XG4gICAgICAgIHByZVZlcnRvciA9IGlWdG9yO1xuICAgIH1cblxuICAgIHByZVZlcnRvciA9IG51bGw7XG4gICAgaVZ0b3IgICAgID0gbnVsbDtcblxuXG4gICAgLy/ln7rmnKzkuIrnrYnkuo7mm7LnjodcbiAgICB2YXIgc2VncyA9IGRpc3RhbmNlIC8gNjtcblxuICAgIHNlZ3MgPSBzZWdzIDwgbGVuID8gbGVuIDogc2VncztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ3M7IGkrKykge1xuICAgICAgICB2YXIgcG9zID0gaSAvIChzZWdzLTEpICogKGlzTG9vcCA/IGxlbiA6IGxlbiAtIDEpO1xuICAgICAgICB2YXIgaWR4ID0gTWF0aC5mbG9vcihwb3MpO1xuXG4gICAgICAgIHZhciB3ID0gcG9zIC0gaWR4O1xuXG4gICAgICAgIHZhciBwMDtcbiAgICAgICAgdmFyIHAxID0gcG9pbnRzW2lkeCAlIGxlbl07XG4gICAgICAgIHZhciBwMjtcbiAgICAgICAgdmFyIHAzO1xuICAgICAgICBpZiAoIWlzTG9vcCkge1xuICAgICAgICAgICAgcDAgPSBwb2ludHNbaWR4ID09PSAwID8gaWR4IDogaWR4IC0gMV07XG4gICAgICAgICAgICBwMiA9IHBvaW50c1tpZHggPiBsZW4gLSAyID8gbGVuIC0gMSA6IGlkeCArIDFdO1xuICAgICAgICAgICAgcDMgPSBwb2ludHNbaWR4ID4gbGVuIC0gMyA/IGxlbiAtIDEgOiBpZHggKyAyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAwID0gcG9pbnRzWyhpZHggLTEgKyBsZW4pICUgbGVuXTtcbiAgICAgICAgICAgIHAyID0gcG9pbnRzWyhpZHggKyAxKSAlIGxlbl07XG4gICAgICAgICAgICBwMyA9IHBvaW50c1soaWR4ICsgMikgJSBsZW5dO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHcyID0gdyAqIHc7XG4gICAgICAgIHZhciB3MyA9IHcgKiB3MjtcblxuICAgICAgICB2YXIgcnAgPSBbXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMF0sIHAxWzBdLCBwMlswXSwgcDNbMF0sIHcsIHcyLCB3MyksXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGUocDBbMV0sIHAxWzFdLCBwMlsxXSwgcDNbMV0sIHcsIHcyLCB3MylcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgIF8uaXNGdW5jdGlvbihzbW9vdGhGaWx0ZXIpICYmIHNtb290aEZpbHRlciggcnAgKTtcblxuICAgICAgICByZXQucHVzaCggcnAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn07IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOaKmOe6vyDnsbtcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcG9pbnRMaXN0IOWQhOS4qumhtuinkuWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBTbW9vdGhTcGxpbmUgZnJvbSBcIi4uL2dlb20vU21vb3RoU3BsaW5lXCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG52YXIgQnJva2VuTGluZSA9IGZ1bmN0aW9uKG9wdCAsIGF0eXBlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcImJyb2tlbmxpbmVcIjtcclxuICAgIHNlbGYuX2RyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdChvcHQpO1xyXG4gICAgaWYoIGF0eXBlICE9PSBcImNsb25lXCIgKXtcclxuICAgICAgICBzZWxmLl9pbml0UG9pbnRMaXN0KG9wdC5jb250ZXh0KTtcclxuICAgIH07XHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoe1xyXG4gICAgICAgIGxpbmVUeXBlOiBudWxsLFxyXG4gICAgICAgIHNtb290aDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy97QXJyYXl9ICAvLyDlv4XpobvvvIzlkITkuKrpobbop5LlnZDmoIdcclxuICAgICAgICBzbW9vdGhGaWx0ZXI6IG51bGxcclxuICAgIH0sIG9wdC5jb250ZXh0ICk7XHJcblxyXG4gICAgQnJva2VuTGluZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKEJyb2tlbkxpbmUsIFNoYXBlLCB7XHJcbiAgICAkd2F0Y2g6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmVWYWx1ZSkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicG9pbnRMaXN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5pdFBvaW50TGlzdCh0aGlzLmNvbnRleHQsIHZhbHVlLCBwcmVWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9pbml0UG9pbnRMaXN0OiBmdW5jdGlvbihjb250ZXh0LCB2YWx1ZSwgcHJlVmFsdWUpIHtcclxuICAgICAgICB2YXIgbXlDID0gY29udGV4dDtcclxuICAgICAgICBpZiAobXlDLnNtb290aCkge1xyXG4gICAgICAgICAgICAvL3Ntb290aEZpbHRlciAtLSDmr5TlpoLlnKjmipjnur/lm77kuK3jgILkvJrkvKDkuIDkuKpzbW9vdGhGaWx0ZXLov4fmnaXlgZpwb2ludOeahOe6oOato+OAglxyXG4gICAgICAgICAgICAvL+iuqXnkuI3og73otoXov4flupXpg6jnmoTljp/ngrlcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgIHBvaW50czogbXlDLnBvaW50TGlzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24obXlDLnNtb290aEZpbHRlcikpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zbW9vdGhGaWx0ZXIgPSBteUMuc21vb3RoRmlsdGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX25vdFdhdGNoID0gdHJ1ZTsgLy/mnKzmrKHovazmjaLkuI3lh7rlj5Hlv4Pot7NcclxuICAgICAgICAgICAgdmFyIGN1cnJMID0gU21vb3RoU3BsaW5lKG9iaik7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoPjApIHtcclxuICAgICAgICAgICAgICAgIGN1cnJMW2N1cnJMLmxlbmd0aCAtIDFdWzBdID0gdmFsdWVbdmFsdWUubGVuZ3RoIC0gMV1bMF07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG15Qy5wb2ludExpc3QgPSBjdXJyTDtcclxuICAgICAgICAgICAgdGhpcy5fbm90V2F0Y2ggPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIC8vcG9seWdvbumcgOimgeimhueblmRyYXfmlrnms5XvvIzmiYDku6XopoHmiorlhbfkvZPnmoTnu5jliLbku6PnoIHkvZzkuLpfZHJhd+aKveemu+WHuuadpVxyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5fZHJhdyhjdHgsIGNvbnRleHQpO1xyXG4gICAgfSxcclxuICAgIF9kcmF3OiBmdW5jdGlvbihjdHgsIGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgcG9pbnRMaXN0ID0gY29udGV4dC5wb2ludExpc3Q7XHJcbiAgICAgICAgaWYgKHBvaW50TGlzdC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIC8vIOWwkeS6jjLkuKrngrnlsLHkuI3nlLvkuoZ+XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghY29udGV4dC5saW5lVHlwZSB8fCBjb250ZXh0LmxpbmVUeXBlID09ICdzb2xpZCcpIHtcclxuICAgICAgICAgICAgLy/pu5jorqTkuLrlrp7nur9cclxuICAgICAgICAgICAgLy9UT0RPOuebruWJjeWmguaenCDmnInorr7nva5zbW9vdGgg55qE5oOF5Ya15LiL5piv5LiN5pSv5oyB6Jma57q/55qEXHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8ocG9pbnRMaXN0WzBdWzBdLCBwb2ludExpc3RbMF1bMV0pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocG9pbnRMaXN0W2ldWzBdLCBwb2ludExpc3RbaV1bMV0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5saW5lVHlwZSA9PSAnZGFzaGVkJyB8fCBjb250ZXh0LmxpbmVUeXBlID09ICdkb3R0ZWQnKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LnNtb290aCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgc2kgPSAwLCBzbCA9IHBvaW50TGlzdC5sZW5ndGg7IHNpIDwgc2w7IHNpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2kgPT0gc2wtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oIHBvaW50TGlzdFtzaV1bMF0gLCBwb2ludExpc3Rbc2ldWzFdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyggcG9pbnRMaXN0W3NpKzFdWzBdICwgcG9pbnRMaXN0W3NpKzFdWzFdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2krPTE7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/nlLvomZrnur/nmoTmlrnms5UgIFxyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwb2ludExpc3RbMF1bMF0sIHBvaW50TGlzdFswXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVggPSBwb2ludExpc3RbaSAtIDFdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b1ggPSBwb2ludExpc3RbaV1bMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21ZID0gcG9pbnRMaXN0W2kgLSAxXVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9ZID0gcG9pbnRMaXN0W2ldWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGFzaGVkTGluZVRvKGN0eCwgZnJvbVgsIGZyb21ZLCB0b1gsIHRvWSwgNSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9LFxyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oY29udGV4dCkge1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0gY29udGV4dCA/IGNvbnRleHQgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjdEZvcm1Qb2ludExpc3QoY29udGV4dCk7XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBCcm9rZW5MaW5lOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDlnIblvaIg57G7XHJcbiAqXHJcbiAqIOWdkOagh+WOn+eCueWGjeWchuW/g1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEByIOWchuWNiuW+hFxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcblxyXG5cclxudmFyIENpcmNsZSA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJjaXJjbGVcIjtcclxuXHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcblxyXG4gICAgLy/pu5jorqTmg4XlhrXkuIvpnaLvvIxjaXJjbGXkuI3pnIDopoHmiop4eei/m+ihjHBhcmVudEludOi9rOaNolxyXG4gICAgKCBcInh5VG9JbnRcIiBpbiBvcHQgKSB8fCAoIG9wdC54eVRvSW50ID0gZmFsc2UgKTtcclxuXHJcbiAgICBzZWxmLl9jb250ZXh0ID0ge1xyXG4gICAgICAgIHIgOiBvcHQuY29udGV4dC5yIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5ZyG5Y2K5b6EXHJcbiAgICB9XHJcbiAgICBDaXJjbGUuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKENpcmNsZSAsIFNoYXBlICwge1xyXG4gICAvKipcclxuICAgICAqIOWIm+W7uuWchuW9oui3r+W+hFxyXG4gICAgICogQHBhcmFtIHtDb250ZXh0MkR9IGN0eCBDYW52YXMgMkTkuIrkuIvmlodcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZSDmoLflvI9cclxuICAgICAqL1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICBpZiAoIXN0eWxlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5hcmMoMCAsIDAsIHN0eWxlLnIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxyXG4gICAgICovXHJcbiAgICBnZXRSZWN0IDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICB2YXIgbGluZVdpZHRoO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHN0eWxlID8gc3R5bGUgOiB0aGlzLmNvbnRleHQ7XHJcbiAgICAgICAgaWYgKHN0eWxlLmZpbGxTdHlsZSB8fCBzdHlsZS5zdHJva2VTdHlsZSApIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeCA6IE1hdGgucm91bmQoMCAtIHN0eWxlLnIgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgeSA6IE1hdGgucm91bmQoMCAtIHN0eWxlLnIgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgd2lkdGggOiBzdHlsZS5yICogMiArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0IDogc3R5bGUuciAqIDIgKyBsaW5lV2lkdGhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENpcmNsZTtcclxuXHJcblxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSAtLSB0IHswLCAxfVxuICAgICAqIEByZXR1cm4ge1BvaW50fSAgLS0gcmV0dXJuIHBvaW50IGF0IHRoZSBnaXZlbiB0aW1lIGluIHRoZSBiZXppZXIgYXJjXG4gICAgICovXG4gICAgZ2V0UG9pbnRCeVRpbWU6IGZ1bmN0aW9uKHQgLCBwbGlzdCkge1xuICAgICAgICB2YXIgaXQgPSAxIC0gdCxcbiAgICAgICAgaXQyID0gaXQgKiBpdCxcbiAgICAgICAgaXQzID0gaXQyICogaXQ7XG4gICAgICAgIHZhciB0MiA9IHQgKiB0LFxuICAgICAgICB0MyA9IHQyICogdDtcbiAgICAgICAgdmFyIHhTdGFydD1wbGlzdFswXSx5U3RhcnQ9cGxpc3RbMV0sY3BYMT1wbGlzdFsyXSxjcFkxPXBsaXN0WzNdLGNwWDI9MCxjcFkyPTAseEVuZD0wLHlFbmQ9MDtcbiAgICAgICAgaWYocGxpc3QubGVuZ3RoPjYpe1xuICAgICAgICAgICAgY3BYMj1wbGlzdFs0XTtcbiAgICAgICAgICAgIGNwWTI9cGxpc3RbNV07XG4gICAgICAgICAgICB4RW5kPXBsaXN0WzZdO1xuICAgICAgICAgICAgeUVuZD1wbGlzdFs3XTtcbiAgICAgICAgICAgIC8v5LiJ5qyh6LSd5aGe5bCUXG4gICAgICAgICAgICByZXR1cm4geyBcbiAgICAgICAgICAgICAgICB4IDogaXQzICogeFN0YXJ0ICsgMyAqIGl0MiAqIHQgKiBjcFgxICsgMyAqIGl0ICogdDIgKiBjcFgyICsgdDMgKiB4RW5kLFxuICAgICAgICAgICAgICAgIHkgOiBpdDMgKiB5U3RhcnQgKyAzICogaXQyICogdCAqIGNwWTEgKyAzICogaXQgKiB0MiAqIGNwWTIgKyB0MyAqIHlFbmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8v5LqM5qyh6LSd5aGe5bCUXG4gICAgICAgICAgICB4RW5kPXBsaXN0WzRdO1xuICAgICAgICAgICAgeUVuZD1wbGlzdFs1XTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeCA6IGl0MiAqIHhTdGFydCArIDIgKiB0ICogaXQgKiBjcFgxICsgdDIqeEVuZCxcbiAgICAgICAgICAgICAgICB5IDogaXQyICogeVN0YXJ0ICsgMiAqIHQgKiBpdCAqIGNwWTEgKyB0Mip5RW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIFBhdGgg57G7XHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIlcclxuICogQHBhdGggcGF0aOS4slxyXG4gKiovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbmltcG9ydCBNYXRyaXggZnJvbSBcIi4uL2dlb20vTWF0cml4XCI7XHJcbmltcG9ydCBCZXppZXIgZnJvbSBcIi4uL2dlb20vYmV6aWVyXCI7XHJcblxyXG52YXIgUGF0aCA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi50eXBlID0gXCJwYXRoXCI7XHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdChvcHQpO1xyXG4gICAgaWYgKFwiZHJhd1R5cGVPbmx5XCIgaW4gb3B0KSB7XHJcbiAgICAgICAgc2VsZi5kcmF3VHlwZU9ubHkgPSBvcHQuZHJhd1R5cGVPbmx5O1xyXG4gICAgfTtcclxuICAgIHNlbGYuX19wYXJzZVBhdGhEYXRhID0gbnVsbDtcclxuICAgIHZhciBfY29udGV4dCA9IHtcclxuICAgICAgICBwb2ludExpc3Q6IFtdLCAvL+S7juS4i+mdoueahHBhdGjkuK3orqHnrpflvpfliLDnmoTovrnnlYzngrnnmoTpm4blkIhcclxuICAgICAgICBwYXRoOiBvcHQuY29udGV4dC5wYXRoIHx8IFwiXCIgLy/lrZfnrKbkuLIg5b+F6aG777yM6Lev5b6E44CC5L6L5aaCOk0gMCAwIEwgMCAxMCBMIDEwIDEwIFogKOS4gOS4quS4ieinkuW9oilcclxuICAgICAgICAgICAgLy9NID0gbW92ZXRvXHJcbiAgICAgICAgICAgIC8vTCA9IGxpbmV0b1xyXG4gICAgICAgICAgICAvL0ggPSBob3Jpem9udGFsIGxpbmV0b1xyXG4gICAgICAgICAgICAvL1YgPSB2ZXJ0aWNhbCBsaW5ldG9cclxuICAgICAgICAgICAgLy9DID0gY3VydmV0b1xyXG4gICAgICAgICAgICAvL1MgPSBzbW9vdGggY3VydmV0b1xyXG4gICAgICAgICAgICAvL1EgPSBxdWFkcmF0aWMgQmVsemllciBjdXJ2ZVxyXG4gICAgICAgICAgICAvL1QgPSBzbW9vdGggcXVhZHJhdGljIEJlbHppZXIgY3VydmV0b1xyXG4gICAgICAgICAgICAvL1ogPSBjbG9zZXBhdGhcclxuICAgIH07XHJcbiAgICBzZWxmLl9jb250ZXh0ID0gXy5leHRlbmQoX2NvbnRleHQsIChzZWxmLl9jb250ZXh0IHx8IHt9KSk7XHJcbiAgICBQYXRoLnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoUGF0aCwgU2hhcGUsIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJwYXRoXCIpIHsgLy/lpoLmnpxwYXRo5pyJ5Y+Y5Yqo77yM6ZyA6KaB6Ieq5Yqo6K6h566X5paw55qEcG9pbnRMaXN0XHJcbiAgICAgICAgICAgIHRoaXMuX19wYXJzZVBhdGhEYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnBvaW50TGlzdCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfcGFyc2VQYXRoRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9fcGFyc2VQYXRoRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fX3BhcnNlUGF0aERhdGE7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy/liIbmi4blrZDliIbnu4RcclxuICAgICAgICB0aGlzLl9fcGFyc2VQYXRoRGF0YSA9IFtdO1xyXG4gICAgICAgIHZhciBwYXRocyA9IF8uY29tcGFjdChkYXRhLnJlcGxhY2UoL1tNbV0vZywgXCJcXFxcciQmXCIpLnNwbGl0KCdcXFxccicpKTtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIF8uZWFjaChwYXRocywgZnVuY3Rpb24ocGF0aFN0cikge1xyXG4gICAgICAgICAgICBtZS5fX3BhcnNlUGF0aERhdGEucHVzaChtZS5fcGFyc2VDaGlsZFBhdGhEYXRhKHBhdGhTdHIpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fX3BhcnNlUGF0aERhdGE7XHJcbiAgICB9LFxyXG4gICAgX3BhcnNlQ2hpbGRQYXRoRGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIC8vIGNvbW1hbmQgc3RyaW5nXHJcbiAgICAgICAgdmFyIGNzID0gZGF0YTtcclxuICAgICAgICAvLyBjb21tYW5kIGNoYXJzXHJcbiAgICAgICAgdmFyIGNjID0gW1xyXG4gICAgICAgICAgICAnbScsICdNJywgJ2wnLCAnTCcsICd2JywgJ1YnLCAnaCcsICdIJywgJ3onLCAnWicsXHJcbiAgICAgICAgICAgICdjJywgJ0MnLCAncScsICdRJywgJ3QnLCAnVCcsICdzJywgJ1MnLCAnYScsICdBJ1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgY3MgPSBjcy5yZXBsYWNlKC8gIC9nLCAnICcpO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvIC9nLCAnLCcpO1xyXG4gICAgICAgIC8vY3MgPSBjcy5yZXBsYWNlKC8oLiktL2csIFwiJDEsLVwiKTtcclxuICAgICAgICBjcyA9IGNzLnJlcGxhY2UoLyhcXGQpLS9nLCAnJDEsLScpO1xyXG4gICAgICAgIGNzID0gY3MucmVwbGFjZSgvLCwvZywgJywnKTtcclxuICAgICAgICB2YXIgbjtcclxuICAgICAgICAvLyBjcmVhdGUgcGlwZXMgc28gdGhhdCB3ZSBjYW4gc3BsaXQgdGhlIGRhdGFcclxuICAgICAgICBmb3IgKG4gPSAwOyBuIDwgY2MubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgY3MgPSBjcy5yZXBsYWNlKG5ldyBSZWdFeHAoY2Nbbl0sICdnJyksICd8JyArIGNjW25dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIGFycmF5XHJcbiAgICAgICAgdmFyIGFyciA9IGNzLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgdmFyIGNhID0gW107XHJcbiAgICAgICAgLy8gaW5pdCBjb250ZXh0IHBvaW50XHJcbiAgICAgICAgdmFyIGNweCA9IDA7XHJcbiAgICAgICAgdmFyIGNweSA9IDA7XHJcbiAgICAgICAgZm9yIChuID0gMTsgbiA8IGFyci5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gYXJyW25dO1xyXG4gICAgICAgICAgICB2YXIgYyA9IHN0ci5jaGFyQXQoMCk7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zbGljZSgxKTtcclxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCgnZSwtJywgJ2cnKSwgJ2UtJyk7XHJcblxyXG4gICAgICAgICAgICAvL+acieeahOaXtuWAme+8jOavlOWmguKAnDIy77yMLTIy4oCdIOaVsOaNruWPr+iDveS8mue7j+W4uOeahOiiq+WGmeaIkDIyLTIy77yM6YKj5LmI6ZyA6KaB5omL5Yqo5L+u5pS5XHJcbiAgICAgICAgICAgIC8vc3RyID0gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cCgnLScsICdnJyksICcsLScpO1xyXG4gICAgICAgICAgICAvL3N0ciA9IHN0ci5yZXBsYWNlKC8oLiktL2csIFwiJDEsLVwiKVxyXG5cclxuICAgICAgICAgICAgdmFyIHAgPSBzdHIuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwLmxlbmd0aCA+IDAgJiYgcFswXSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwW2ldID0gcGFyc2VGbG9hdChwW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAocC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocFswXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjdGxQdHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3RsUHR5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZDbWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJ4O1xyXG4gICAgICAgICAgICAgICAgdmFyIHJ5O1xyXG4gICAgICAgICAgICAgICAgdmFyIHBzaTtcclxuICAgICAgICAgICAgICAgIHZhciBmYTtcclxuICAgICAgICAgICAgICAgIHZhciBmcztcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgeDEgPSBjcHg7XHJcbiAgICAgICAgICAgICAgICB2YXIgeTEgPSBjcHk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCBsLCBILCBoLCBWLCBhbmQgdiB0byBMXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnbCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ00nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ00nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAnTCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdoJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0gnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0wnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1YnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdDJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gocC5zaGlmdCgpLCBwLnNoaWZ0KCksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGNweCwgY3B5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCA9IGNweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2Q21kID0gY2FbY2EubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2Q21kLmNvbW1hbmQgPT09ICdDJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4ICsgKGNweCAtIHByZXZDbWQucG9pbnRzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eSA9IGNweSArIChjcHkgLSBwcmV2Q21kLnBvaW50c1szXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3RsUHR4LCBjdGxQdHksIHAuc2hpZnQoKSwgcC5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdDJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ0MnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0bFB0eCwgY3RsUHR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICsgcC5zaGlmdCgpLCBjcHkgKyBwLnNoaWZ0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B4ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ICs9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwLnNoaWZ0KCksIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3B5ID0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjcHggKyBwLnNoaWZ0KCksIGNweSArIHAuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweCArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSArPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZCA9ICdRJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdUJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ1EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChjdGxQdHgsIGN0bFB0eSwgY3B4LCBjcHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR4ID0gY3B4LCBjdGxQdHkgPSBjcHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZDbWQgPSBjYVtjYS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZDbWQuY29tbWFuZCA9PT0gJ1EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdGxQdHggPSBjcHggKyAoY3B4IC0gcHJldkNtZC5wb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RsUHR5ID0gY3B5ICsgKGNweSAtIHByZXZDbWQucG9pbnRzWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnUSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKGN0bFB0eCwgY3RsUHR5LCBjcHgsIGNweSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTsgLy945Y2K5b6EXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ5ID0gcC5zaGlmdCgpOyAvL3nljYrlvoRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHNpID0gcC5zaGlmdCgpOyAvL+aXi+i9rOinkuW6plxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmYSA9IHAuc2hpZnQoKTsgLy/op5LluqblpKflsI8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpOyAvL+aXtumSiOaWueWQkVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggPSBwLnNoaWZ0KCksIGNweSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kID0gJ0EnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMgPSB0aGlzLl9jb252ZXJ0UG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSwgeTEsIGNweCwgY3B5LCBmYSwgZnMsIHJ4LCByeSwgcHNpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByeCA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnkgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBzaSA9IHAuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmEgPSBwLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzID0gcC5zaGlmdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBjcHgsIHkxID0gY3B5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHggKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcHkgKz0gcC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWQgPSAnQSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IHRoaXMuX2NvbnZlcnRQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxLCB5MSwgY3B4LCBjcHksIGZhLCBmcywgcngsIHJ5LCBwc2lcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNtZCB8fCBjLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50czogcG9pbnRzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGMgPT09ICd6JyB8fCBjID09PSAnWicpIHtcclxuICAgICAgICAgICAgICAgIGNhLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICd6JyxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHM6IFtdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNhO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKlxyXG4gICAgICogQHBhcmFtIHgxIOWOn+eCuXhcclxuICAgICAqIEBwYXJhbSB5MSDljp/ngrl5XHJcbiAgICAgKiBAcGFyYW0geDIg57uI54K55Z2Q5qCHIHhcclxuICAgICAqIEBwYXJhbSB5MiDnu4jngrnlnZDmoIcgeVxyXG4gICAgICogQHBhcmFtIGZhIOinkuW6puWkp+Wwj1xyXG4gICAgICogQHBhcmFtIGZzIOaXtumSiOaWueWQkVxyXG4gICAgICogQHBhcmFtIHJ4IHjljYrlvoRcclxuICAgICAqIEBwYXJhbSByeSB55Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0gcHNpRGVnIOaXi+i9rOinkuW6plxyXG4gICAgICovXHJcbiAgICBfY29udmVydFBvaW50OiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5MiwgZmEsIGZzLCByeCwgcnksIHBzaURlZykge1xyXG5cclxuICAgICAgICB2YXIgcHNpID0gcHNpRGVnICogKE1hdGguUEkgLyAxODAuMCk7XHJcbiAgICAgICAgdmFyIHhwID0gTWF0aC5jb3MocHNpKSAqICh4MSAtIHgyKSAvIDIuMCArIE1hdGguc2luKHBzaSkgKiAoeTEgLSB5MikgLyAyLjA7XHJcbiAgICAgICAgdmFyIHlwID0gLTEgKiBNYXRoLnNpbihwc2kpICogKHgxIC0geDIpIC8gMi4wICsgTWF0aC5jb3MocHNpKSAqICh5MSAtIHkyKSAvIDIuMDtcclxuXHJcbiAgICAgICAgdmFyIGxhbWJkYSA9ICh4cCAqIHhwKSAvIChyeCAqIHJ4KSArICh5cCAqIHlwKSAvIChyeSAqIHJ5KTtcclxuXHJcbiAgICAgICAgaWYgKGxhbWJkYSA+IDEpIHtcclxuICAgICAgICAgICAgcnggKj0gTWF0aC5zcXJ0KGxhbWJkYSk7XHJcbiAgICAgICAgICAgIHJ5ICo9IE1hdGguc3FydChsYW1iZGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGYgPSBNYXRoLnNxcnQoKCgocnggKiByeCkgKiAocnkgKiByeSkpIC0gKChyeCAqIHJ4KSAqICh5cCAqIHlwKSkgLSAoKHJ5ICogcnkpICogKHhwICogeHApKSkgLyAoKHJ4ICogcngpICogKHlwICogeXApICsgKHJ5ICogcnkpICogKHhwICogeHApKSk7XHJcblxyXG4gICAgICAgIGlmIChmYSA9PT0gZnMpIHtcclxuICAgICAgICAgICAgZiAqPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTmFOKGYpKSB7XHJcbiAgICAgICAgICAgIGYgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGN4cCA9IGYgKiByeCAqIHlwIC8gcnk7XHJcbiAgICAgICAgdmFyIGN5cCA9IGYgKiAtcnkgKiB4cCAvIHJ4O1xyXG5cclxuICAgICAgICB2YXIgY3ggPSAoeDEgKyB4MikgLyAyLjAgKyBNYXRoLmNvcyhwc2kpICogY3hwIC0gTWF0aC5zaW4ocHNpKSAqIGN5cDtcclxuICAgICAgICB2YXIgY3kgPSAoeTEgKyB5MikgLyAyLjAgKyBNYXRoLnNpbihwc2kpICogY3hwICsgTWF0aC5jb3MocHNpKSAqIGN5cDtcclxuXHJcbiAgICAgICAgdmFyIHZNYWcgPSBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdlJhdGlvID0gZnVuY3Rpb24odSwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gKHVbMF0gKiB2WzBdICsgdVsxXSAqIHZbMV0pIC8gKHZNYWcodSkgKiB2TWFnKHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB2QW5nbGUgPSBmdW5jdGlvbih1LCB2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodVswXSAqIHZbMV0gPCB1WzFdICogdlswXSA/IC0xIDogMSkgKiBNYXRoLmFjb3ModlJhdGlvKHUsIHYpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHZBbmdsZShbMSwgMF0sIFsoeHAgLSBjeHApIC8gcngsICh5cCAtIGN5cCkgLyByeV0pO1xyXG4gICAgICAgIHZhciB1ID0gWyh4cCAtIGN4cCkgLyByeCwgKHlwIC0gY3lwKSAvIHJ5XTtcclxuICAgICAgICB2YXIgdiA9IFsoLTEgKiB4cCAtIGN4cCkgLyByeCwgKC0xICogeXAgLSBjeXApIC8gcnldO1xyXG4gICAgICAgIHZhciBkVGhldGEgPSB2QW5nbGUodSwgdik7XHJcblxyXG4gICAgICAgIGlmICh2UmF0aW8odSwgdikgPD0gLTEpIHtcclxuICAgICAgICAgICAgZFRoZXRhID0gTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZSYXRpbyh1LCB2KSA+PSAxKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmcyA9PT0gMCAmJiBkVGhldGEgPiAwKSB7XHJcbiAgICAgICAgICAgIGRUaGV0YSA9IGRUaGV0YSAtIDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZnMgPT09IDEgJiYgZFRoZXRhIDwgMCkge1xyXG4gICAgICAgICAgICBkVGhldGEgPSBkVGhldGEgKyAyICogTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtjeCwgY3ksIHJ4LCByeSwgdGhldGEsIGRUaGV0YSwgcHNpLCBmc107XHJcbiAgICB9LFxyXG4gICAgLypcclxuICAgICAqIOiOt+WPlmJlemllcuS4iumdoueahOeCueWIl+ihqFxyXG4gICAgICogKi9cclxuICAgIF9nZXRCZXppZXJQb2ludHM6IGZ1bmN0aW9uKHApIHtcclxuICAgICAgICB2YXIgc3RlcHMgPSBNYXRoLmFicyhNYXRoLnNxcnQoTWF0aC5wb3cocC5zbGljZSgtMSlbMF0gLSBwWzFdLCAyKSArIE1hdGgucG93KHAuc2xpY2UoLTIsIC0xKVswXSAtIHBbMF0sIDIpKSk7XHJcbiAgICAgICAgc3RlcHMgPSBNYXRoLmNlaWwoc3RlcHMgLyA1KTtcclxuICAgICAgICB2YXIgcGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHN0ZXBzOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHQgPSBpIC8gc3RlcHM7XHJcbiAgICAgICAgICAgIHZhciB0cCA9IEJlemllci5nZXRQb2ludEJ5VGltZSh0LCBwKTtcclxuICAgICAgICAgICAgcGFyci5wdXNoKHRwLngpO1xyXG4gICAgICAgICAgICBwYXJyLnB1c2godHAueSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcGFycjtcclxuICAgIH0sXHJcbiAgICAvKlxyXG4gICAgICog5aaC5p6ccGF0aOS4reaciUEgYSDvvIzopoHlr7zlh7rlr7nlupTnmoRwb2ludHNcclxuICAgICAqL1xyXG4gICAgX2dldEFyY1BvaW50czogZnVuY3Rpb24ocCkge1xyXG5cclxuICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgIHZhciBjeSA9IHBbMV07XHJcbiAgICAgICAgdmFyIHJ4ID0gcFsyXTtcclxuICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgIHZhciB0aGV0YSA9IHBbNF07XHJcbiAgICAgICAgdmFyIGRUaGV0YSA9IHBbNV07XHJcbiAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgdmFyIGZzID0gcFs3XTtcclxuICAgICAgICB2YXIgciA9IChyeCA+IHJ5KSA/IHJ4IDogcnk7XHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSAocnggPiByeSkgPyByeSAvIHJ4IDogMTtcclxuXHJcbiAgICAgICAgdmFyIF90cmFuc2Zvcm0gPSBuZXcgTWF0cml4KCk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS5pZGVudGl0eSgpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIF90cmFuc2Zvcm0ucm90YXRlKHBzaSk7XHJcbiAgICAgICAgX3RyYW5zZm9ybS50cmFuc2xhdGUoY3gsIGN5KTtcclxuXHJcbiAgICAgICAgdmFyIGNwcyA9IFtdO1xyXG4gICAgICAgIHZhciBzdGVwcyA9ICgzNjAgLSAoIWZzID8gMSA6IC0xKSAqIGRUaGV0YSAqIDE4MCAvIE1hdGguUEkpICUgMzYwO1xyXG5cclxuICAgICAgICBzdGVwcyA9IE1hdGguY2VpbChNYXRoLm1pbihNYXRoLmFicyhkVGhldGEpICogMTgwIC8gTWF0aC5QSSwgciAqIE1hdGguYWJzKGRUaGV0YSkgLyA4KSk7IC8v6Ze06ZqU5LiA5Liq5YOP57SgIOaJgOS7pSAvMlxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludCA9IFtNYXRoLmNvcyh0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByLCBNYXRoLnNpbih0aGV0YSArIGRUaGV0YSAvIHN0ZXBzICogaSkgKiByXTtcclxuICAgICAgICAgICAgcG9pbnQgPSBfdHJhbnNmb3JtLm11bFZlY3Rvcihwb2ludCk7XHJcbiAgICAgICAgICAgIGNwcy5wdXNoKHBvaW50WzBdKTtcclxuICAgICAgICAgICAgY3BzLnB1c2gocG9pbnRbMV0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGNwcztcclxuICAgIH0sXHJcblxyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBzdHlsZSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAgY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfZHJhdzogZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHZhciBwYXRoID0gc3R5bGUucGF0aDtcclxuICAgICAgICB2YXIgcGF0aEFycmF5ID0gdGhpcy5fcGFyc2VQYXRoRGF0YShwYXRoKTtcclxuICAgICAgICB0aGlzLl9zZXRQb2ludExpc3QocGF0aEFycmF5LCBzdHlsZSk7XHJcbiAgICAgICAgZm9yICh2YXIgZyA9IDAsIGdsID0gcGF0aEFycmF5Lmxlbmd0aDsgZyA8IGdsOyBnKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoQXJyYXlbZ10ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHBhdGhBcnJheVtnXVtpXS5jb21tYW5kLCBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoYykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBbMF0sIHBbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwWzBdLCBwWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZXppZXJDdXJ2ZVRvKHBbMF0sIHBbMV0sIHBbMl0sIHBbM10sIHBbNF0sIHBbNV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdRJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8ocFswXSwgcFsxXSwgcFsyXSwgcFszXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3ggPSBwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3kgPSBwWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnggPSBwWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnkgPSBwWzNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhldGEgPSBwWzRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZFRoZXRhID0gcFs1XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBzaSA9IHBbNl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcyA9IHBbN107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gKHJ4ID4gcnkpID8gcnggOiByeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlWCA9IChyeCA+IHJ5KSA/IDEgOiByeCAvIHJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGVZID0gKHJ4ID4gcnkpID8gcnkgLyByeCA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfdHJhbnNmb3JtID0gbmV3IE1hdHJpeCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLmlkZW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90cmFuc2Zvcm0uc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnJvdGF0ZShwc2kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdHJhbnNmb3JtLnRyYW5zbGF0ZShjeCwgY3kpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+i/kOeUqOefqemYteW8gOWni+WPmOW9olxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYXJjKDAsIDAsIHIsIHRoZXRhLCB0aGV0YSArIGRUaGV0YSwgMSAtIGZzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9fdHJhbnNmb3JtLmludmVydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgudHJhbnNmb3JtLmFwcGx5KGN0eCwgX3RyYW5zZm9ybS5pbnZlcnQoKS50b0FycmF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd6JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgX3NldFBvaW50TGlzdDogZnVuY3Rpb24ocGF0aEFycmF5LCBzdHlsZSkge1xyXG4gICAgICAgIGlmIChzdHlsZS5wb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g6K6w5b2V6L6555WM54K577yM55So5LqO5Yik5pataW5zaWRlXHJcbiAgICAgICAgdmFyIHBvaW50TGlzdCA9IHN0eWxlLnBvaW50TGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGcgPSAwLCBnbCA9IHBhdGhBcnJheS5sZW5ndGg7IGcgPCBnbDsgZysrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2luZ2xlUG9pbnRMaXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gcGF0aEFycmF5W2ddW2ldLnBvaW50cztcclxuICAgICAgICAgICAgICAgIHZhciBjbWQgPSBwYXRoQXJyYXlbZ11baV0uY29tbWFuZDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gJ0EnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHRoaXMuX2dldEFyY1BvaW50cyhwKTtcclxuICAgICAgICAgICAgICAgICAgICAvL0Hlkb3ku6TnmoTor53vvIzlpJbmjqXnn6nlvaLnmoTmo4DmtYvlv4XpobvovazmjaLkuLpfcG9pbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aEFycmF5W2ddW2ldLl9wb2ludHMgPSBwO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJDXCIgfHwgY21kLnRvVXBwZXJDYXNlKCkgPT0gXCJRXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY1N0YXJ0ID0gWzAsIDBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBzaW5nbGVQb2ludExpc3Quc2xpY2UoLTEpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZVBvaW50cyA9IChwYXRoQXJyYXlbZ11baSAtIDFdLl9wb2ludHMgfHwgcGF0aEFycmF5W2ddW2kgLSAxXS5wb2ludHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJlUG9pbnRzLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjU3RhcnQgPSBwcmVQb2ludHMuc2xpY2UoLTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBwID0gdGhpcy5fZ2V0QmV6aWVyUG9pbnRzKGNTdGFydC5jb25jYXQocCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGhBcnJheVtnXVtpXS5fcG9pbnRzID0gcDtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwLmxlbmd0aDsgaiA8IGs7IGogKz0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBweCA9IHBbal07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHB5ID0gcFtqICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCghcHggJiYgcHghPTApIHx8ICghcHkgJiYgcHkhPTApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlUG9pbnRMaXN0LnB1c2goW3B4LCBweV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzaW5nbGVQb2ludExpc3QubGVuZ3RoID4gMCAmJiBwb2ludExpc3QucHVzaChzaW5nbGVQb2ludExpc3QpO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBnZXRSZWN0OiBmdW5jdGlvbihzdHlsZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBsaW5lV2lkdGg7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICBpZiAoc3R5bGUuc3Ryb2tlU3R5bGUgfHwgc3R5bGUuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IHN0eWxlLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpbmVXaWR0aCA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbWluWCA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgdmFyIG1heFggPSAtTnVtYmVyLk1BWF9WQUxVRTsvL051bWJlci5NSU5fVkFMVUU7XHJcblxyXG4gICAgICAgIHZhciBtaW5ZID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICB2YXIgbWF4WSA9IC1OdW1iZXIuTUFYX1ZBTFVFOy8vTnVtYmVyLk1JTl9WQUxVRTtcclxuXHJcbiAgICAgICAgLy8g5bmz56e75Z2Q5qCHXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuXHJcbiAgICAgICAgdmFyIHBhdGhBcnJheSA9IHRoaXMuX3BhcnNlUGF0aERhdGEoc3R5bGUucGF0aCk7XHJcbiAgICAgICAgdGhpcy5fc2V0UG9pbnRMaXN0KHBhdGhBcnJheSwgc3R5bGUpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBnID0gMCwgZ2wgPSBwYXRoQXJyYXkubGVuZ3RoOyBnIDwgZ2w7IGcrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhBcnJheVtnXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwYXRoQXJyYXlbZ11baV0uX3BvaW50cyB8fCBwYXRoQXJyYXlbZ11baV0ucG9pbnRzO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqICUgMiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocFtqXSArIHggPCBtaW5YKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5YID0gcFtqXSArIHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB4ID4gbWF4WCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4WCA9IHBbal0gKyB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBbal0gKyB5IDwgbWluWSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluWSA9IHBbal0gKyB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwW2pdICsgeSA+IG1heFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFkgPSBwW2pdICsgeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciByZWN0O1xyXG4gICAgICAgIGlmIChtaW5YID09PSBOdW1iZXIuTUFYX1ZBTFVFIHx8IG1heFggPT09IE51bWJlci5NSU5fVkFMVUUgfHwgbWluWSA9PT0gTnVtYmVyLk1BWF9WQUxVRSB8fCBtYXhZID09PSBOdW1iZXIuTUlOX1ZBTFVFKSB7XHJcbiAgICAgICAgICAgIHJlY3QgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICAgICAgeTogMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVjdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IE1hdGgucm91bmQobWluWCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgeTogTWF0aC5yb3VuZChtaW5ZIC0gbGluZVdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogbWF4WCAtIG1pblggKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG1heFkgLSBtaW5ZICsgbGluZVdpZHRoXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZWN0O1xyXG4gICAgfVxyXG5cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBhdGg7IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOawtOa7tOW9oiDnsbtcclxuICog5rS+55Sf6IeqUGF0aOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJXHJcbiAqIEBociDmsLTmu7TmqKrlrr3vvIjkuK3lv4PliLDmsLTlubPovrnnvJjmnIDlrr3lpITot53nprvvvIlcclxuICogQHZyIOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gKiovXHJcbmltcG9ydCBQYXRoIGZyb20gXCIuL1BhdGhcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIERyb3BsZXQgPSBmdW5jdGlvbihvcHQpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQoIG9wdCApO1xyXG4gICAgc2VsZi5fY29udGV4dCA9IHtcclxuICAgICAgICBociA6IG9wdC5jb250ZXh0LmhyIHx8IDAgLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5rC05ru05qiq5a6977yI5Lit5b+D5Yiw5rC05bmz6L6557yY5pyA5a695aSE6Led56a777yJXHJcbiAgICAgICAgdnIgOiBvcHQuY29udGV4dC52ciB8fCAwICAgLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOawtOa7tOe6temrmO+8iOS4reW/g+WIsOWwluerr+i3neemu++8iVxyXG4gICAgfTtcclxuICAgIERyb3BsZXQuc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgc2VsZi50eXBlID0gXCJkcm9wbGV0XCI7XHJcbn07XHJcblV0aWxzLmNyZWF0Q2xhc3MoIERyb3BsZXQgLCBQYXRoICwge1xyXG4gICAgZHJhdyA6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgIHZhciBwcyA9IFwiTSAwIFwiK3N0eWxlLmhyK1wiIEMgXCIrc3R5bGUuaHIrXCIgXCIrc3R5bGUuaHIrXCIgXCIrKCBzdHlsZS5ociozLzIgKSArXCIgXCIrKC1zdHlsZS5oci8zKStcIiAwIFwiKygtc3R5bGUudnIpO1xyXG4gICAgICAgcHMgKz0gXCIgQyBcIisoLXN0eWxlLmhyICogMy8gMikrXCIgXCIrKC1zdHlsZS5ociAvIDMpK1wiIFwiKygtc3R5bGUuaHIpK1wiIFwiK3N0eWxlLmhyK1wiIDAgXCIrIHN0eWxlLmhyO1xyXG4gICAgICAgdGhpcy5jb250ZXh0LnBhdGggPSBwcztcclxuICAgICAgIHRoaXMuX2RyYXcoY3R4ICwgc3R5bGUpO1xyXG4gICAgfVxyXG59ICk7XHJcbmV4cG9ydCBkZWZhdWx0IERyb3BsZXQ7XHJcbiIsIlxyXG4vKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5qSt5ZyG5b2iIOexu1xyXG4gKlxyXG4gKiDlr7nlupRjb250ZXh055qE5bGe5oCn5pyJIFxyXG4gKlxyXG4gKiBAaHIg5qSt5ZyG5qiq6L205Y2K5b6EXHJcbiAqIEB2ciDmpK3lnIbnurXovbTljYrlvoRcclxuICovXHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi4vZGlzcGxheS9TaGFwZVwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCBfIGZyb20gXCIuLi91dGlscy91bmRlcnNjb3JlXCI7XHJcbnZhciBFbGxpcHNlID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwiZWxsaXBzZVwiO1xyXG5cclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgLy94ICAgICAgICAgICAgIDogMCAsIC8ve251bWJlcn0sICAvLyDkuKLlvINcclxuICAgICAgICAvL3kgICAgICAgICAgICAgOiAwICwgLy97bnVtYmVyfSwgIC8vIOS4ouW8g++8jOWOn+WboOWQjGNpcmNsZVxyXG4gICAgICAgIGhyIDogb3B0LmNvbnRleHQuaHIgfHwgMCAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmpK3lnIbmqKrovbTljYrlvoRcclxuICAgICAgICB2ciA6IG9wdC5jb250ZXh0LnZyIHx8IDAgICAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5qSt5ZyG57q16L205Y2K5b6EXHJcbiAgICB9XHJcblxyXG4gICAgRWxsaXBzZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKEVsbGlwc2UgLCBTaGFwZSAsIHtcclxuICAgIGRyYXcgOiAgZnVuY3Rpb24oY3R4LCBzdHlsZSkge1xyXG4gICAgICAgIHZhciByID0gKHN0eWxlLmhyID4gc3R5bGUudnIpID8gc3R5bGUuaHIgOiBzdHlsZS52cjtcclxuICAgICAgICB2YXIgcmF0aW9YID0gc3R5bGUuaHIgLyByOyAvL+aoqui9tOe8qeaUvuavlOeOh1xyXG4gICAgICAgIHZhciByYXRpb1kgPSBzdHlsZS52ciAvIHI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnNjYWxlKHJhdGlvWCwgcmF0aW9ZKTtcclxuICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgICAwLCAwLCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIGlmICggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCApe1xyXG4gICAgICAgICAgIC8vaWXkuIvpnaLopoHmg7Pnu5jliLbkuKrmpK3lnIblh7rmnaXvvIzlsLHkuI3og73miafooYzov5nmraXkuoZcclxuICAgICAgICAgICAvL+eul+aYr2V4Y2FudmFzIOWunueOsOS4iumdoueahOS4gOS4qmJ1Z+WQp1xyXG4gICAgICAgICAgIGN0eC5zY2FsZSgxL3JhdGlvWCwgMS9yYXRpb1kpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSxcclxuICAgIGdldFJlY3QgOiBmdW5jdGlvbihzdHlsZSl7XHJcbiAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICB2YXIgc3R5bGUgPSBzdHlsZSA/IHN0eWxlIDogdGhpcy5jb250ZXh0O1xyXG4gICAgICAgIGlmIChzdHlsZS5maWxsU3R5bGUgfHwgc3R5bGUuc3Ryb2tlU3R5bGUpIHtcclxuICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS5ociAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgIHkgOiBNYXRoLnJvdW5kKDAgLSBzdHlsZS52ciAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgIHdpZHRoIDogc3R5bGUuaHIgKiAyICsgbGluZVdpZHRoLFxyXG4gICAgICAgICAgICAgIGhlaWdodCA6IHN0eWxlLnZyICogMiArIGxpbmVXaWR0aFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVsbGlwc2U7XHJcbiIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDlpJrovrnlvaIg57G7ICDvvIjkuI3op4TliJnvvIlcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcG9pbnRMaXN0IOWkmui+ueW9ouWQhOS4qumhtuinkuWdkOagh1xyXG4gKiovXHJcbmltcG9ydCBCcm9rZW5MaW5lIGZyb20gXCIuL0Jyb2tlbkxpbmVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIFBvbHlnb24gPSBmdW5jdGlvbihvcHQgLCBhdHlwZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuXHJcbiAgICBpZihhdHlwZSAhPT0gXCJjbG9uZVwiKXtcclxuICAgICAgICB2YXIgc3RhcnQgPSBvcHQuY29udGV4dC5wb2ludExpc3RbMF07XHJcbiAgICAgICAgdmFyIGVuZCAgID0gb3B0LmNvbnRleHQucG9pbnRMaXN0WyBvcHQuY29udGV4dC5wb2ludExpc3QubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgIGlmKCBvcHQuY29udGV4dC5zbW9vdGggKXtcclxuICAgICAgICAgICAgb3B0LmNvbnRleHQucG9pbnRMaXN0LnVuc2hpZnQoIGVuZCApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9wdC5jb250ZXh0LnBvaW50TGlzdC5wdXNoKCBzdGFydCApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIFBvbHlnb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIGlmKGF0eXBlICE9PSBcImNsb25lXCIgJiYgb3B0LmNvbnRleHQuc21vb3RoICYmIGVuZCl7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLl9kcmF3VHlwZU9ubHkgPSBudWxsO1xyXG4gICAgc2VsZi50eXBlID0gXCJwb2x5Z29uXCI7XHJcbn07XHJcblV0aWxzLmNyZWF0Q2xhc3MoUG9seWdvbiwgQnJva2VuTGluZSwge1xyXG4gICAgZHJhdzogZnVuY3Rpb24oY3R4LCBjb250ZXh0KSB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuZmlsbFN0eWxlKSB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmxpbmVUeXBlID09ICdkYXNoZWQnIHx8IGNvbnRleHQubGluZVR5cGUgPT0gJ2RvdHRlZCcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwb2ludExpc3QgPSBjb250ZXh0LnBvaW50TGlzdDtcclxuICAgICAgICAgICAgICAgIC8v54m55q6K5aSE55CG77yM6Jma57q/5Zu05LiN5oiQcGF0aO+8jOWunue6v+WGjWJ1aWxk5LiA5qyhXHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwb2ludExpc3RbMF1bMF0sIHBvaW50TGlzdFswXVsxXSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMSwgbCA9IHBvaW50TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBvaW50TGlzdFtpXVswXSwgcG9pbnRMaXN0W2ldWzFdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdUeXBlT25seSA9IFwic3Ryb2tlXCI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL+WmguaenOS4i+mdouS4jeWKoHNhdmUgcmVzdG9yZe+8jGNhbnZhc+S8muaKiuS4i+mdoueahHBhdGjlkozkuIrpnaLnmoRwYXRo5LiA6LW3566X5L2c5LiA5p2hcGF0aOOAguWwseS8mue7mOWItuS6huS4gOadoeWunueOsOi+ueahhuWSjOS4gOiZmue6v+i+ueahhuOAglxyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIHRoaXMuX2RyYXcoY3R4LCBjb250ZXh0KTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IFBvbHlnb247IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOato27ovrnlvaLvvIhuPj0z77yJXHJcbiAqXHJcbiAqIOWvueW6lGNvbnRleHTnmoTlsZ7mgKfmnIkgXHJcbiAqXHJcbiAqIEByIOato27ovrnlvaLlpJbmjqXlnIbljYrlvoRcclxuICogQHIg5oyH5piO5q2j5Yeg6L655b2iXHJcbiAqXHJcbiAqIEBwb2ludExpc3Qg56eB5pyJ77yM5LuO5LiK6Z2i55qEcuWSjG7orqHnrpflvpfliLDnmoTovrnnlYzlgLznmoTpm4blkIhcclxuICovXHJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuL1BvbHlnb25cIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIElzb2dvbiA9IGZ1bmN0aW9uKG9wdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSBfLmV4dGVuZCh7XHJcbiAgICAgICAgcG9pbnRMaXN0OiBbXSwgLy/ku47kuIvpnaLnmoRy5ZKMbuiuoeeul+W+l+WIsOeahOi+ueeVjOWAvOeahOmbhuWQiFxyXG4gICAgICAgIHI6IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzmraNu6L655b2i5aSW5o6l5ZyG5Y2K5b6EXHJcbiAgICAgICAgbjogMCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5oyH5piO5q2j5Yeg6L655b2iXHJcbiAgICB9ICwgb3B0LmNvbnRleHQpO1xyXG4gICAgc2VsZi5zZXRQb2ludExpc3Qoc2VsZi5fY29udGV4dCk7XHJcbiAgICBvcHQuY29udGV4dCA9IHNlbGYuX2NvbnRleHQ7XHJcbiAgICBJc29nb24uc3VwZXJjbGFzcy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgdGhpcy50eXBlID0gXCJpc29nb25cIjtcclxufTtcclxuVXRpbHMuY3JlYXRDbGFzcyhJc29nb24sIFBvbHlnb24sIHtcclxuICAgICR3YXRjaDogZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByZVZhbHVlKSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJyXCIgfHwgbmFtZSA9PSBcIm5cIikgeyAvL+WmguaenHBhdGjmnInlj5jliqjvvIzpnIDopoHoh6rliqjorqHnrpfmlrDnmoRwb2ludExpc3RcclxuICAgICAgICAgICAgdGhpcy5zZXRQb2ludExpc3QoIHRoaXMuY29udGV4dCApO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXRQb2ludExpc3Q6IGZ1bmN0aW9uKHN0eWxlKSB7XHJcbiAgICAgICAgc3R5bGUucG9pbnRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdmFyIG4gPSBzdHlsZS5uLCByID0gc3R5bGUucjtcclxuICAgICAgICB2YXIgZFN0ZXAgPSAyICogTWF0aC5QSSAvIG47XHJcbiAgICAgICAgdmFyIGJlZ2luRGVnID0gLU1hdGguUEkgLyAyO1xyXG4gICAgICAgIHZhciBkZWcgPSBiZWdpbkRlZztcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgZW5kID0gbjsgaSA8IGVuZDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN0eWxlLnBvaW50TGlzdC5wdXNoKFtyICogTWF0aC5jb3MoZGVnKSwgciAqIE1hdGguc2luKGRlZyldKTtcclxuICAgICAgICAgICAgZGVnICs9IGRTdGVwO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBJc29nb247IiwiLyoqXHJcbiAqIENhbnZheFxyXG4gKlxyXG4gKiBAYXV0aG9yIOmHiuWJkSAo5p2O5rabLCBsaXRhby5sdEBhbGliYWJhLWluYy5jb20pXHJcbiAqXHJcbiAqIOe6v+adoSDnsbtcclxuICpcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAbGluZVR5cGUgIOWPr+mAiSDomZrnur8g5a6e546wIOeahCDnsbvlnotcclxuICogQHhTdGFydCAgICDlv4XpobvvvIzotbfngrnmqKrlnZDmoIdcclxuICogQHlTdGFydCAgICDlv4XpobvvvIzotbfngrnnurXlnZDmoIdcclxuICogQHhFbmQgICAgICDlv4XpobvvvIznu4jngrnmqKrlnZDmoIdcclxuICogQHlFbmQgICAgICDlv4XpobvvvIznu4jngrnnurXlnZDmoIdcclxuICoqL1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4uL2Rpc3BsYXkvU2hhcGVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgXyBmcm9tIFwiLi4vdXRpbHMvdW5kZXJzY29yZVwiO1xyXG5cclxudmFyIExpbmUgPSBmdW5jdGlvbihvcHQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMudHlwZSA9IFwibGluZVwiO1xyXG4gICAgdGhpcy5kcmF3VHlwZU9ubHkgPSBcInN0cm9rZVwiO1xyXG4gICAgb3B0ID0gVXRpbHMuY2hlY2tPcHQob3B0KTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgbGluZVR5cGU6IG9wdC5jb250ZXh0LmxpbmVUeXBlIHx8IG51bGwsIC8v5Y+v6YCJIOiZmue6vyDlrp7njrAg55qEIOexu+Wei1xyXG4gICAgICAgIHhTdGFydDogb3B0LmNvbnRleHQueFN0YXJ0IHx8IDAsIC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzotbfngrnmqKrlnZDmoIdcclxuICAgICAgICB5U3RhcnQ6IG9wdC5jb250ZXh0LnlTdGFydCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW354K557q15Z2Q5qCHXHJcbiAgICAgICAgeEVuZDogb3B0LmNvbnRleHQueEVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K55qiq5Z2Q5qCHXHJcbiAgICAgICAgeUVuZDogb3B0LmNvbnRleHQueUVuZCB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uI54K557q15Z2Q5qCHXHJcbiAgICAgICAgZGFzaExlbmd0aDogb3B0LmNvbnRleHQuZGFzaExlbmd0aFxyXG4gICAgfVxyXG4gICAgTGluZS5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5VdGlscy5jcmVhdENsYXNzKExpbmUsIFNoYXBlLCB7XHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uue6v+adoei3r+W+hFxyXG4gICAgICogY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXc6IGZ1bmN0aW9uKGN0eCwgc3R5bGUpIHtcclxuICAgICAgICBpZiAoIXN0eWxlLmxpbmVUeXBlIHx8IHN0eWxlLmxpbmVUeXBlID09ICdzb2xpZCcpIHtcclxuICAgICAgICAgICAgLy/pu5jorqTkuLrlrp7nur9cclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhwYXJzZUludChzdHlsZS54U3RhcnQpLCBwYXJzZUludChzdHlsZS55U3RhcnQpKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhwYXJzZUludChzdHlsZS54RW5kKSwgcGFyc2VJbnQoc3R5bGUueUVuZCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3R5bGUubGluZVR5cGUgPT0gJ2Rhc2hlZCcgfHwgc3R5bGUubGluZVR5cGUgPT0gJ2RvdHRlZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXNoZWRMaW5lVG8oXHJcbiAgICAgICAgICAgICAgICBjdHgsXHJcbiAgICAgICAgICAgICAgICBzdHlsZS54U3RhcnQsIHN0eWxlLnlTdGFydCxcclxuICAgICAgICAgICAgICAgIHN0eWxlLnhFbmQsIHN0eWxlLnlFbmQsXHJcbiAgICAgICAgICAgICAgICBzdHlsZS5kYXNoTGVuZ3RoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuefqeW9ouWMuuWfn++8jOeUqOS6juWxgOmDqOWIt+aWsOWSjOaWh+Wtl+WumuS9jVxyXG4gICAgICogc3R5bGVcclxuICAgICAqL1xyXG4gICAgZ2V0UmVjdDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICB2YXIgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBNYXRoLm1pbihzdHlsZS54U3RhcnQsIHN0eWxlLnhFbmQpIC0gbGluZVdpZHRoLFxyXG4gICAgICAgICAgICB5OiBNYXRoLm1pbihzdHlsZS55U3RhcnQsIHN0eWxlLnlFbmQpIC0gbGluZVdpZHRoLFxyXG4gICAgICAgICAgICB3aWR0aDogTWF0aC5hYnMoc3R5bGUueFN0YXJ0IC0gc3R5bGUueEVuZCkgKyBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoc3R5bGUueVN0YXJ0IC0gc3R5bGUueUVuZCkgKyBsaW5lV2lkdGhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMaW5lOyIsIi8qKlxyXG4gKiBDYW52YXhcclxuICpcclxuICogQGF1dGhvciDph4rliZEgKOadjua2mywgbGl0YW8ubHRAYWxpYmFiYS1pbmMuY29tKVxyXG4gKlxyXG4gKiDnn6nnjrAg57G7ICDvvIjkuI3op4TliJnvvIlcclxuICpcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAd2lkdGgg5a695bqmXHJcbiAqIEBoZWlnaHQg6auY5bqmXHJcbiAqIEByYWRpdXMg5aaC5p6c5piv5ZyG6KeS55qE77yM5YiZ5Li644CQ5LiK5Y+z5LiL5bem44CR6aG65bqP55qE5ZyG6KeS5Y2K5b6E5pWw57uEXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuXHJcbnZhciBSZWN0ID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHNlbGYudHlwZSA9IFwicmVjdFwiO1xyXG5cclxuICAgIG9wdCA9IFV0aWxzLmNoZWNrT3B0KCBvcHQgKTtcclxuICAgIHNlbGYuX2NvbnRleHQgPSB7XHJcbiAgICAgICAgIHdpZHRoICAgICAgICAgOiBvcHQuY29udGV4dC53aWR0aCB8fCAwLC8ve251bWJlcn0sICAvLyDlv4XpobvvvIzlrr3luqZcclxuICAgICAgICAgaGVpZ2h0ICAgICAgICA6IG9wdC5jb250ZXh0LmhlaWdodHx8IDAsLy97bnVtYmVyfSwgIC8vIOW/hemhu++8jOmrmOW6plxyXG4gICAgICAgICByYWRpdXMgICAgICAgIDogb3B0LmNvbnRleHQucmFkaXVzfHwgW10gICAgIC8ve2FycmF5fSwgICAvLyDpu5jorqTkuLpbMF3vvIzlnIbop5IgXHJcbiAgICB9XHJcbiAgICBSZWN0LnN1cGVyY2xhc3MuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcblV0aWxzLmNyZWF0Q2xhc3MoIFJlY3QgLCBTaGFwZSAsIHtcclxuICAgIC8qKlxyXG4gICAgICog57uY5Yi25ZyG6KeS55+p5b2iXHJcbiAgICAgKiBAcGFyYW0ge0NvbnRleHQyRH0gY3R4IENhbnZhcyAyROS4iuS4i+aWh1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIOagt+W8j1xyXG4gICAgICovXHJcbiAgICBfYnVpbGRSYWRpdXNQYXRoOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgLy/lt6bkuIrjgIHlj7PkuIrjgIHlj7PkuIvjgIHlt6bkuIvop5LnmoTljYrlvoTkvp3mrKHkuLpyMeOAgXIy44CBcjPjgIFyNFxyXG4gICAgICAgIC8vcue8qeWGmeS4ujEgICAgICAgICDnm7jlvZPkuo4gWzEsIDEsIDEsIDFdXHJcbiAgICAgICAgLy9y57yp5YaZ5Li6WzFdICAgICAgIOebuOW9k+S6jiBbMSwgMSwgMSwgMV1cclxuICAgICAgICAvL3LnvKnlhpnkuLpbMSwgMl0gICAg55u45b2T5LqOIFsxLCAyLCAxLCAyXVxyXG4gICAgICAgIC8vcue8qeWGmeS4ulsxLCAyLCAzXSDnm7jlvZPkuo4gWzEsIDIsIDMsIDJdXHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIHZhciB5ID0gMDtcclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLmNvbnRleHQud2lkdGg7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuY29udGV4dC5oZWlnaHQ7XHJcbiAgICBcclxuICAgICAgICB2YXIgciA9IFV0aWxzLmdldENzc09yZGVyQXJyKHN0eWxlLnJhZGl1cyk7XHJcbiAgICAgXHJcbiAgICAgICAgY3R4Lm1vdmVUbyggcGFyc2VJbnQoeCArIHJbMF0pLCBwYXJzZUludCh5KSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCArIHdpZHRoIC0gclsxXSksIHBhcnNlSW50KHkpKTtcclxuICAgICAgICByWzFdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByWzFdXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIHBhcnNlSW50KHggKyB3aWR0aCksIHBhcnNlSW50KHkgKyBoZWlnaHQgLSByWzJdKSk7XHJcbiAgICAgICAgclsyXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyhcclxuICAgICAgICAgICAgICAgIHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gclsyXSwgeSArIGhlaWdodFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICBjdHgubGluZVRvKCBwYXJzZUludCh4ICsgclszXSksIHBhcnNlSW50KHkgKyBoZWlnaHQpKTtcclxuICAgICAgICByWzNdICE9PSAwICYmIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJbM11cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyggcGFyc2VJbnQoeCksIHBhcnNlSW50KHkgKyByWzBdKSk7XHJcbiAgICAgICAgclswXSAhPT0gMCAmJiBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgclswXSwgeSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rnn6nlvaLot6/lvoRcclxuICAgICAqIEBwYXJhbSB7Q29udGV4dDJEfSBjdHggQ2FudmFzIDJE5LiK5LiL5paHXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3R5bGUg5qC35byPXHJcbiAgICAgKi9cclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIHN0eWxlKSB7XHJcbiAgICAgICAgaWYoIXN0eWxlLiRtb2RlbC5yYWRpdXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmKCEhc3R5bGUuZmlsbFN0eWxlKXtcclxuICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KCAwICwgMCAsdGhpcy5jb250ZXh0LndpZHRoLHRoaXMuY29udGV4dC5oZWlnaHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoISFzdHlsZS5saW5lV2lkdGgpe1xyXG4gICAgICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCggMCAsIDAgLCB0aGlzLmNvbnRleHQud2lkdGgsdGhpcy5jb250ZXh0LmhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9idWlsZFJhZGl1c1BhdGgoY3R4LCBzdHlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57nn6nlvaLljLrln5/vvIznlKjkuo7lsYDpg6jliLfmlrDlkozmloflrZflrprkvY1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVxyXG4gICAgICovXHJcbiAgICBnZXRSZWN0IDogZnVuY3Rpb24oc3R5bGUpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmVXaWR0aDtcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gc3R5bGUgPyBzdHlsZSA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgICAgaWYgKHN0eWxlLmZpbGxTdHlsZSB8fCBzdHlsZS5zdHJva2VTdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGluZVdpZHRoID0gc3R5bGUubGluZVdpZHRoIHx8IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgIHggOiBNYXRoLnJvdW5kKDAgLSBsaW5lV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICAgICAgeSA6IE1hdGgucm91bmQoMCAtIGxpbmVXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMuY29udGV4dC53aWR0aCArIGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogdGhpcy5jb250ZXh0LmhlaWdodCArIGxpbmVXaWR0aFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbn0gKTtcclxuZXhwb3J0IGRlZmF1bHQgUmVjdDsiLCIvKipcclxuICogQ2FudmF4XHJcbiAqXHJcbiAqIEBhdXRob3Ig6YeK5YmRICjmnY7mtpssIGxpdGFvLmx0QGFsaWJhYmEtaW5jLmNvbSlcclxuICpcclxuICog5omH5b2iIOexu1xyXG4gKlxyXG4gKiDlnZDmoIfljp/ngrnlho3lnIblv4NcclxuICpcclxuICog5a+55bqUY29udGV4dOeahOWxnuaAp+aciVxyXG4gKiBAcjAg6buY6K6k5Li6MO+8jOWGheWchuWNiuW+hOaMh+WumuWQjuWwhuWHuueOsOWGheW8p++8jOWQjOaXtuaJh+i+uemVv+W6piA9IHIgLSByMFxyXG4gKiBAciAg5b+F6aG777yM5aSW5ZyG5Y2K5b6EXHJcbiAqIEBzdGFydEFuZ2xlIOi1t+Wni+inkuW6pigwLCAzNjApXHJcbiAqIEBlbmRBbmdsZSAgIOe7k+adn+inkuW6pigwLCAzNjApXHJcbiAqKi9cclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLi9kaXNwbGF5L1NoYXBlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IF8gZnJvbSBcIi4uL3V0aWxzL3VuZGVyc2NvcmVcIjtcclxuaW1wb3J0IG15TWF0aCBmcm9tIFwiLi4vZ2VvbS9NYXRoXCI7XHJcblxyXG52YXIgU2VjdG9yID0gZnVuY3Rpb24ob3B0KXtcclxuICAgIHZhciBzZWxmICA9IHRoaXM7XHJcbiAgICBzZWxmLnR5cGUgPSBcInNlY3RvclwiO1xyXG4gICAgc2VsZi5yZWdBbmdsZSAgPSBbXTtcclxuICAgIHNlbGYuaXNSaW5nICAgID0gZmFsc2U7Ly/mmK/lkKbkuLrkuIDkuKrlnIbnjq9cclxuXHJcbiAgICBvcHQgPSBVdGlscy5jaGVja09wdCggb3B0ICk7XHJcbiAgICBzZWxmLl9jb250ZXh0ICA9IHtcclxuICAgICAgICBwb2ludExpc3QgIDogW10sLy/ovrnnlYzngrnnmoTpm4blkIgs56eB5pyJ77yM5LuO5LiL6Z2i55qE5bGe5oCn6K6h566X55qE5p2lXHJcbiAgICAgICAgcjAgICAgICAgICA6IG9wdC5jb250ZXh0LnIwICAgICAgICAgfHwgMCwvLyDpu5jorqTkuLow77yM5YaF5ZyG5Y2K5b6E5oyH5a6a5ZCO5bCG5Ye6546w5YaF5byn77yM5ZCM5pe25omH6L656ZW/5bqmID0gciAtIHIwXHJcbiAgICAgICAgciAgICAgICAgICA6IG9wdC5jb250ZXh0LnIgICAgICAgICAgfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM5aSW5ZyG5Y2K5b6EXHJcbiAgICAgICAgc3RhcnRBbmdsZSA6IG9wdC5jb250ZXh0LnN0YXJ0QW5nbGUgfHwgMCwvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM6LW35aeL6KeS5bqmWzAsIDM2MClcclxuICAgICAgICBlbmRBbmdsZSAgIDogb3B0LmNvbnRleHQuZW5kQW5nbGUgICB8fCAwLCAvL3tudW1iZXJ9LCAgLy8g5b+F6aG777yM57uT5p2f6KeS5bqmKDAsIDM2MF1cclxuICAgICAgICBjbG9ja3dpc2UgIDogb3B0LmNvbnRleHQuY2xvY2t3aXNlICB8fCBmYWxzZSAvL+aYr+WQpumhuuaXtumSiO+8jOm7mOiupOS4umZhbHNlKOmhuuaXtumSiClcclxuICAgIH1cclxuICAgIFNlY3Rvci5zdXBlcmNsYXNzLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMgLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuVXRpbHMuY3JlYXRDbGFzcyhTZWN0b3IgLCBTaGFwZSAsIHtcclxuICAgIGRyYXcgOiBmdW5jdGlvbihjdHgsIGNvbnRleHQpIHtcclxuICAgICAgICAvLyDlvaLlhoXljYrlvoRbMCxyKVxyXG4gICAgICAgIHZhciByMCA9IHR5cGVvZiBjb250ZXh0LnIwID09ICd1bmRlZmluZWQnID8gMCA6IGNvbnRleHQucjA7XHJcbiAgICAgICAgdmFyIHIgID0gY29udGV4dC5yOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmiYflvaLlpJbljYrlvoQoMCxyXVxyXG4gICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICB2YXIgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUbzM2MChjb250ZXh0LmVuZEFuZ2xlKTsgICAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgLy92YXIgaXNSaW5nICAgICA9IGZhbHNlOyAgICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKbkuLrlnIbnjq9cclxuXHJcbiAgICAgICAgLy9pZiggc3RhcnRBbmdsZSAhPSBlbmRBbmdsZSAmJiBNYXRoLmFicyhzdGFydEFuZ2xlIC0gZW5kQW5nbGUpICUgMzYwID09IDAgKSB7XHJcbiAgICAgICAgaWYoIHN0YXJ0QW5nbGUgPT0gZW5kQW5nbGUgJiYgY29udGV4dC5zdGFydEFuZ2xlICE9IGNvbnRleHQuZW5kQW5nbGUgKSB7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5Lik5Liq6KeS5bqm55u4562J77yM6YKj5LmI5bCx6K6k5Li65piv5Liq5ZyG546v5LqGXHJcbiAgICAgICAgICAgIHRoaXMuaXNSaW5nICAgICA9IHRydWU7XHJcbiAgICAgICAgICAgIHN0YXJ0QW5nbGUgPSAwIDtcclxuICAgICAgICAgICAgZW5kQW5nbGUgICA9IDM2MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXJ0QW5nbGUgPSBteU1hdGguZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSk7XHJcbiAgICAgICAgZW5kQW5nbGUgICA9IG15TWF0aC5kZWdyZWVUb1JhZGlhbihlbmRBbmdsZSk7XHJcbiAgICAgXHJcbiAgICAgICAgLy/lpITnkIbkuIvmnoHlsI/lpLnop5LnmoTmg4XlhrVcclxuICAgICAgICBpZiggZW5kQW5nbGUgLSBzdGFydEFuZ2xlIDwgMC4wMjUgKXtcclxuICAgICAgICAgICAgc3RhcnRBbmdsZSAtPSAwLjAwM1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3R4LmFyYyggMCAsIDAgLCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgaWYgKHIwICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmlzUmluZyApe1xyXG4gICAgICAgICAgICAgICAgLy/liqDkuIrov5nkuKppc1JpbmfnmoTpgLvovpHmmK/kuLrkuoblhbzlrrlmbGFzaGNhbnZhc+S4i+e7mOWItuWchueOr+eahOeahOmXrumimFxyXG4gICAgICAgICAgICAgICAgLy/kuI3liqDov5nkuKrpgLvovpFmbGFzaGNhbnZhc+S8mue7mOWItuS4gOS4quWkp+WchiDvvIwg6ICM5LiN5piv5ZyG546vXHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKCByMCAsIDAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmMoIDAgLCAwICwgcjAgLCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgLCAhdGhpcy5jb250ZXh0LmNsb2Nrd2lzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKCAwICwgMCAsIHIwICwgZW5kQW5nbGUgLCBzdGFydEFuZ2xlICwgIXRoaXMuY29udGV4dC5jbG9ja3dpc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9UT0RPOuWcqHIw5Li6MOeahOaXtuWAme+8jOWmguaenOS4jeWKoGxpbmVUbygwLDAp5p2l5oqK6Lev5b6E6Zet5ZCI77yM5Lya5Ye6546w5pyJ5pCe56yR55qE5LiA5LiqYnVnXHJcbiAgICAgICAgICAgIC8v5pW05Liq5ZyG5Lya5Ye6546w5LiA5Liq5Lul5q+P5Liq5omH5b2i5Lik56uv5Li66IqC54K555qE6ZWC56m677yM5oiR5Y+v6IO95o+P6L+w5LiN5riF5qWa77yM5Y+N5q2j6L+Z5Liq5Yqg5LiK5bCx5aW95LqGXHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oMCwwKTtcclxuICAgICAgICB9XHJcbiAgICAgfSxcclxuICAgICBnZXRSZWdBbmdsZSA6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgIHRoaXMucmVnSW4gICAgICA9IHRydWU7ICAvL+WmguaenOWcqHN0YXJ05ZKMZW5k55qE5pWw5YC85Lit77yMZW5k5aSn5LqOc3RhcnTogIzkuJTmmK/pobrml7bpkojliJlyZWdJbuS4unRydWVcclxuICAgICAgICAgdmFyIGMgICAgICAgICAgID0gdGhpcy5jb250ZXh0O1xyXG4gICAgICAgICB2YXIgc3RhcnRBbmdsZSA9IG15TWF0aC5kZWdyZWVUbzM2MChjLnN0YXJ0QW5nbGUpOyAgICAgICAgICAvLyDotbflp4vop5LluqZbMCwzNjApXHJcbiAgICAgICAgIHZhciBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGMuZW5kQW5nbGUpOyAgICAgICAgICAgIC8vIOe7k+adn+inkuW6pigwLDM2MF1cclxuXHJcbiAgICAgICAgIGlmICggKCBzdGFydEFuZ2xlID4gZW5kQW5nbGUgJiYgIWMuY2xvY2t3aXNlICkgfHwgKCBzdGFydEFuZ2xlIDwgZW5kQW5nbGUgJiYgYy5jbG9ja3dpc2UgKSApIHtcclxuICAgICAgICAgICAgIHRoaXMucmVnSW4gID0gZmFsc2U7IC8vb3V0XHJcbiAgICAgICAgIH07XHJcbiAgICAgICAgIC8v5bqm55qE6IyD5Zu077yM5LuO5bCP5Yiw5aSnXHJcbiAgICAgICAgIHRoaXMucmVnQW5nbGUgICA9IFsgXHJcbiAgICAgICAgICAgICBNYXRoLm1pbiggc3RhcnRBbmdsZSAsIGVuZEFuZ2xlICkgLCBcclxuICAgICAgICAgICAgIE1hdGgubWF4KCBzdGFydEFuZ2xlICwgZW5kQW5nbGUgKSBcclxuICAgICAgICAgXTtcclxuICAgICB9LFxyXG4gICAgIGdldFJlY3QgOiBmdW5jdGlvbihjb250ZXh0KXtcclxuICAgICAgICAgdmFyIGNvbnRleHQgPSBjb250ZXh0ID8gY29udGV4dCA6IHRoaXMuY29udGV4dDtcclxuICAgICAgICAgdmFyIHIwID0gdHlwZW9mIGNvbnRleHQucjAgPT0gJ3VuZGVmaW5lZCcgICAgIC8vIOW9ouWGheWNiuW+hFswLHIpXHJcbiAgICAgICAgICAgICA/IDAgOiBjb250ZXh0LnIwO1xyXG4gICAgICAgICB2YXIgciA9IGNvbnRleHQucjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5omH5b2i5aSW5Y2K5b6EKDAscl1cclxuICAgICAgICAgXHJcbiAgICAgICAgIHRoaXMuZ2V0UmVnQW5nbGUoKTtcclxuXHJcbiAgICAgICAgIHZhciBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvMzYwKGNvbnRleHQuc3RhcnRBbmdsZSk7ICAgICAgICAgIC8vIOi1t+Wni+inkuW6plswLDM2MClcclxuICAgICAgICAgdmFyIGVuZEFuZ2xlICAgPSBteU1hdGguZGVncmVlVG8zNjAoY29udGV4dC5lbmRBbmdsZSk7ICAgICAgICAgICAgLy8g57uT5p2f6KeS5bqmKDAsMzYwXVxyXG5cclxuICAgICAgICAgLypcclxuICAgICAgICAgdmFyIGlzQ2lyY2xlID0gZmFsc2U7XHJcbiAgICAgICAgIGlmKCBNYXRoLmFicyggc3RhcnRBbmdsZSAtIGVuZEFuZ2xlICkgPT0gMzYwIFxyXG4gICAgICAgICAgICAgICAgIHx8ICggc3RhcnRBbmdsZSA9PSBlbmRBbmdsZSAmJiBzdGFydEFuZ2xlICogZW5kQW5nbGUgIT0gMCApICl7XHJcbiAgICAgICAgICAgICBpc0NpcmNsZSA9IHRydWU7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgIHZhciBwb2ludExpc3QgID0gW107XHJcblxyXG4gICAgICAgICB2YXIgcDREaXJlY3Rpb249IHtcclxuICAgICAgICAgICAgIFwiOTBcIiA6IFsgMCAsIHIgXSxcclxuICAgICAgICAgICAgIFwiMTgwXCI6IFsgLXIsIDAgXSxcclxuICAgICAgICAgICAgIFwiMjcwXCI6IFsgMCAsIC1yXSxcclxuICAgICAgICAgICAgIFwiMzYwXCI6IFsgciAsIDAgXSBcclxuICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgIGZvciAoIHZhciBkIGluIHA0RGlyZWN0aW9uICl7XHJcbiAgICAgICAgICAgICB2YXIgaW5BbmdsZVJlZyA9IHBhcnNlSW50KGQpID4gdGhpcy5yZWdBbmdsZVswXSAmJiBwYXJzZUludChkKSA8IHRoaXMucmVnQW5nbGVbMV07XHJcbiAgICAgICAgICAgICBpZiggdGhpcy5pc1JpbmcgfHwgKGluQW5nbGVSZWcgJiYgdGhpcy5yZWdJbikgfHwgKCFpbkFuZ2xlUmVnICYmICF0aGlzLnJlZ0luKSApe1xyXG4gICAgICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKCBwNERpcmVjdGlvblsgZCBdICk7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmKCAhdGhpcy5pc1JpbmcgKSB7XHJcbiAgICAgICAgICAgICBzdGFydEFuZ2xlID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBzdGFydEFuZ2xlICk7XHJcbiAgICAgICAgICAgICBlbmRBbmdsZSAgID0gbXlNYXRoLmRlZ3JlZVRvUmFkaWFuKCBlbmRBbmdsZSAgICk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogcjAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogcjBcclxuICAgICAgICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAgcG9pbnRMaXN0LnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICBteU1hdGguY29zKHN0YXJ0QW5nbGUpICogciAgLCBteU1hdGguc2luKHN0YXJ0QW5nbGUpICogclxyXG4gICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICBwb2ludExpc3QucHVzaChbXHJcbiAgICAgICAgICAgICAgICAgICAgIG15TWF0aC5jb3MoZW5kQW5nbGUpICAgKiByICAsICBteU1hdGguc2luKGVuZEFuZ2xlKSAgKiByXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgIHBvaW50TGlzdC5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICAgbXlNYXRoLmNvcyhlbmRBbmdsZSkgICAqIHIwICwgIG15TWF0aC5zaW4oZW5kQW5nbGUpICAqIHIwXHJcbiAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBjb250ZXh0LnBvaW50TGlzdCA9IHBvaW50TGlzdDtcclxuICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVjdEZvcm1Qb2ludExpc3QoIGNvbnRleHQgKTtcclxuICAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlY3RvcjsiLCJcbmltcG9ydCBBcHBsaWNhdGlvbiBmcm9tIFwiLi9BcHBsaWNhdGlvblwiO1xuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi9ldmVudC9FdmVudERpc3BhdGNoZXJcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vZXZlbnQvRXZlbnRNYW5hZ2VyXCI7XG5pbXBvcnQgRGlzcGxheU9iamVjdCBmcm9tIFwiLi9kaXNwbGF5L0Rpc3BsYXlPYmplY3RcIjtcbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyIGZyb20gXCIuL2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IFN0YWdlIGZyb20gXCIuL2Rpc3BsYXkvU3RhZ2VcIjtcbmltcG9ydCBTcHJpdGUgZnJvbSBcIi4vZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9kaXNwbGF5L1NoYXBlXCI7XG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vZGlzcGxheS9Qb2ludFwiO1xuaW1wb3J0IFRleHQgZnJvbSBcIi4vZGlzcGxheS9UZXh0XCI7XG5pbXBvcnQgTW92aWVjbGlwIGZyb20gXCIuL2Rpc3BsYXkvTW92aWVjbGlwXCI7XG5cbi8vc2hhcGVzXG5pbXBvcnQgQnJva2VuTGluZSBmcm9tIFwiLi9zaGFwZS9Ccm9rZW5MaW5lXCI7XG5pbXBvcnQgQ2lyY2xlIGZyb20gXCIuL3NoYXBlL0NpcmNsZVwiO1xuaW1wb3J0IERyb3BsZXQgZnJvbSBcIi4vc2hhcGUvRHJvcGxldFwiO1xuaW1wb3J0IEVsbGlwc2UgZnJvbSBcIi4vc2hhcGUvRWxsaXBzZVwiO1xuaW1wb3J0IElzb2dvbiBmcm9tIFwiLi9zaGFwZS9Jc29nb25cIjtcbmltcG9ydCBMaW5lIGZyb20gXCIuL3NoYXBlL0xpbmVcIjtcbmltcG9ydCBQYXRoIGZyb20gXCIuL3NoYXBlL1BhdGhcIjtcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuL3NoYXBlL1BvbHlnb25cIjtcbmltcG9ydCBSZWN0IGZyb20gXCIuL3NoYXBlL1JlY3RcIjtcbmltcG9ydCBTZWN0b3IgZnJvbSBcIi4vc2hhcGUvU2VjdG9yXCI7XG5cbnZhciBDYW52YXggPSB7XG4gICAgQXBwOiBBcHBsaWNhdGlvblxufTtcblxuQ2FudmF4LkRpc3BsYXkgPSB7XG4gICAgRGlzcGxheU9iamVjdCA6IERpc3BsYXlPYmplY3QsXG4gICAgRGlzcGxheU9iamVjdENvbnRhaW5lciA6IERpc3BsYXlPYmplY3RDb250YWluZXIsXG4gICAgU3RhZ2UgIDogU3RhZ2UsXG4gICAgU3ByaXRlIDogU3ByaXRlLFxuICAgIFNoYXBlICA6IFNoYXBlLFxuICAgIFBvaW50ICA6IFBvaW50LFxuICAgIFRleHQgICA6IFRleHQsXG4gICAgTW92aWVjbGlwIDogTW92aWVjbGlwXG59XG5cbkNhbnZheC5TaGFwZXMgPSB7XG4gICAgQnJva2VuTGluZSA6IEJyb2tlbkxpbmUsXG4gICAgQ2lyY2xlIDogQ2lyY2xlLFxuICAgIERyb3BsZXQgOiBEcm9wbGV0LFxuICAgIEVsbGlwc2UgOiBFbGxpcHNlLFxuICAgIElzb2dvbiA6IElzb2dvbixcbiAgICBMaW5lIDogTGluZSxcbiAgICBQYXRoIDogUGF0aCxcbiAgICBQb2x5Z29uIDogUG9seWdvbixcbiAgICBSZWN0IDogUmVjdCxcbiAgICBTZWN0b3IgOiBTZWN0b3Jcbn1cblxuQ2FudmF4LkV2ZW50ID0ge1xuICAgIEV2ZW50RGlzcGF0Y2hlciA6IEV2ZW50RGlzcGF0Y2hlcixcbiAgICBFdmVudE1hbmFnZXIgICAgOiBFdmVudE1hbmFnZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FudmF4OyJdLCJuYW1lcyI6WyJfIiwiYnJlYWtlciIsIkFycmF5UHJvdG8iLCJBcnJheSIsInByb3RvdHlwZSIsIk9ialByb3RvIiwiT2JqZWN0IiwidG9TdHJpbmciLCJoYXNPd25Qcm9wZXJ0eSIsIm5hdGl2ZUZvckVhY2giLCJmb3JFYWNoIiwibmF0aXZlRmlsdGVyIiwiZmlsdGVyIiwibmF0aXZlSW5kZXhPZiIsImluZGV4T2YiLCJuYXRpdmVJc0FycmF5IiwiaXNBcnJheSIsIm5hdGl2ZUtleXMiLCJrZXlzIiwidmFsdWVzIiwib2JqIiwibGVuZ3RoIiwiaSIsIlR5cGVFcnJvciIsImtleSIsImhhcyIsInB1c2giLCJjYWxsIiwiZWFjaCIsIml0ZXJhdG9yIiwiY29udGV4dCIsImNvbXBhY3QiLCJhcnJheSIsImlkZW50aXR5Iiwic2VsZWN0IiwicmVzdWx0cyIsInZhbHVlIiwiaW5kZXgiLCJsaXN0IiwibmFtZSIsImlzRnVuY3Rpb24iLCJpc0Zpbml0ZSIsImlzTmFOIiwicGFyc2VGbG9hdCIsImlzTnVtYmVyIiwiaXNCb29sZWFuIiwiaXNOdWxsIiwiaXNFbXB0eSIsImlzU3RyaW5nIiwiaXNFbGVtZW50Iiwibm9kZVR5cGUiLCJpc09iamVjdCIsIml0ZW0iLCJpc1NvcnRlZCIsIk1hdGgiLCJtYXgiLCJzb3J0ZWRJbmRleCIsImlzV2luZG93Iiwid2luZG93IiwiaXNQbGFpbk9iamVjdCIsImNvbnN0cnVjdG9yIiwiaGFzT3duIiwiZSIsInVuZGVmaW5lZCIsImV4dGVuZCIsIm9wdGlvbnMiLCJzcmMiLCJjb3B5IiwiY29weUlzQXJyYXkiLCJjbG9uZSIsInRhcmdldCIsImFyZ3VtZW50cyIsImRlZXAiLCJzbGljZSIsIlV0aWxzIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIl9VSUQiLCJjaGFyQ29kZSIsImNoYXJDb2RlQXQiLCJnZXRVSUQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJnZXRDb250ZXh0IiwicHJvdG8iLCJuZXdQcm90byIsIk9iamVjdENyZWF0ZSIsImNyZWF0ZSIsIl9fZW1wdHlGdW5jIiwiY3R4Iiwic3R5bGUiLCJwIiwiciIsInMiLCJweCIsInNwIiwicnAiLCJjcmVhdGVPYmplY3QiLCJzdXBlcmNsYXNzIiwiY2FudmFzIiwiRmxhc2hDYW52YXMiLCJpbml0RWxlbWVudCIsIm9wdCIsInIxIiwicjIiLCJyMyIsInI0IiwieCIsInkiLCJhcmciLCJDYW52YXhFdmVudCIsImV2dCIsInBhcmFtcyIsImV2ZW50VHlwZSIsInR5cGUiLCJjdXJyZW50VGFyZ2V0IiwicG9pbnQiLCJfc3RvcFByb3BhZ2F0aW9uIiwiYWRkT3JSbW92ZUV2ZW50SGFuZCIsImRvbUhhbmQiLCJpZUhhbmQiLCJldmVudERvbUZuIiwiZWwiLCJmbiIsImV2ZW50Rm4iLCJldmVudCIsImdldEVsZW1lbnRCeUlkIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZG9jIiwib3duZXJEb2N1bWVudCIsImJvZHkiLCJkb2NFbGVtIiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50VG9wIiwiY2xpZW50TGVmdCIsImJvdW5kIiwicmlnaHQiLCJsZWZ0IiwiY2xpZW50V2lkdGgiLCJ6b29tIiwidG9wIiwicGFnZVlPZmZzZXQiLCJzY3JvbGxUb3AiLCJwYWdlWE9mZnNldCIsInNjcm9sbExlZnQiLCJwYWdlWCIsImNsaWVudFgiLCJwYWdlWSIsImNsaWVudFkiLCJfd2lkdGgiLCJfaGVpZ2h0IiwiaWQiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0Iiwic2V0QXR0cmlidXRlIiwic2V0dGluZ3MiLCJSRVNPTFVUSU9OIiwidmlldyIsImNsYXNzTmFtZSIsImNzc1RleHQiLCJzdGFnZV9jIiwiZG9tX2MiLCJhcHBlbmRDaGlsZCIsIl9tb3VzZUV2ZW50VHlwZXMiLCJfaGFtbWVyRXZlbnRUeXBlcyIsIkV2ZW50SGFuZGxlciIsImNhbnZheCIsImN1clBvaW50cyIsIlBvaW50IiwiY3VyUG9pbnRzVGFyZ2V0IiwiX3RvdWNoaW5nIiwiX2RyYWdpbmciLCJfY3Vyc29yIiwidHlwZXMiLCJkcmFnIiwiY29udGFpbnMiLCJjb21wYXJlRG9jdW1lbnRQb3NpdGlvbiIsInBhcmVudCIsImNoaWxkIiwibWUiLCJhZGRFdmVudCIsIl9fbW91c2VIYW5kbGVyIiwib24iLCJfX2xpYkhhbmRsZXIiLCJyb290IiwidXBkYXRlVmlld09mZnNldCIsIiQiLCJ2aWV3T2Zmc2V0IiwiY3VyTW91c2VQb2ludCIsImN1ck1vdXNlVGFyZ2V0IiwiZ2V0T2JqZWN0c1VuZGVyUG9pbnQiLCJkcmFnRW5hYmxlZCIsInRvRWxlbWVudCIsInJlbGF0ZWRUYXJnZXQiLCJfZHJhZ0VuZCIsImZpcmUiLCJfX2dldGN1clBvaW50c1RhcmdldCIsImdsb2JhbEFscGhhIiwiY2xvbmVPYmplY3QiLCJfY2xvbmUyaG92ZXJTdGFnZSIsIl9nbG9iYWxBbHBoYSIsIl9kcmFnTW92ZUhhbmRlciIsIl9fZGlzcGF0Y2hFdmVudEluQ2hpbGRzIiwiX2N1cnNvckhhbmRlciIsInByZXZlbnREZWZhdWx0IiwicmV0dXJuVmFsdWUiLCJvbGRPYmoiLCJfaG92ZXJDbGFzcyIsInBvaW50Q2hrUHJpb3JpdHkiLCJnZXRDaGlsZEluUG9pbnQiLCJnbG9iYWxUb0xvY2FsIiwiZGlzcGF0Y2hFdmVudCIsInRvVGFyZ2V0IiwiZnJvbVRhcmdldCIsIl9zZXRDdXJzb3IiLCJjdXJzb3IiLCJfX2dldENhbnZheFBvaW50SW5Ub3VjaHMiLCJfX2dldENoaWxkSW5Ub3VjaHMiLCJzdGFydCIsIm1vdmUiLCJlbmQiLCJjdXJUb3VjaHMiLCJ0b3VjaCIsInRvdWNocyIsInRvdWNoZXNUYXJnZXQiLCJjaGlsZHMiLCJoYXNDaGlsZCIsImNlIiwic3RhZ2VQb2ludCIsIl9kcmFnRHVwbGljYXRlIiwiX2J1ZmZlclN0YWdlIiwiZ2V0Q2hpbGRCeUlkIiwiX3RyYW5zZm9ybSIsImdldENvbmNhdGVuYXRlZE1hdHJpeCIsImFkZENoaWxkQXQiLCJfZHJhZ1BvaW50IiwiX3BvaW50IiwiX25vdFdhdGNoIiwiX21vdmVTdGFnZSIsIm1vdmVpbmciLCJoZWFydEJlYXQiLCJkZXN0cm95IiwiRXZlbnRNYW5hZ2VyIiwiX2V2ZW50TWFwIiwibGlzdGVuZXIiLCJhZGRSZXN1bHQiLCJzZWxmIiwic3BsaXQiLCJtYXAiLCJfZXZlbnRFbmFibGVkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lckJ5VHlwZSIsImxpIiwic3BsaWNlIiwiX2Rpc3BhdGNoRXZlbnQiLCJFdmVudERpc3BhdGNoZXIiLCJjcmVhdENsYXNzIiwiX2FkZEV2ZW50TGlzdGVuZXIiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl9yZW1vdmVFdmVudExpc3RlbmVyQnlUeXBlIiwiX3JlbW92ZUFsbEV2ZW50TGlzdGVuZXJzIiwibG9nIiwiZVR5cGUiLCJjaGlsZHJlbiIsInByZUhlYXJ0QmVhdCIsIl9oZWFydEJlYXROdW0iLCJwcmVnQWxwaGEiLCJob3ZlckNsb25lIiwiZ2V0U3RhZ2UiLCJhY3RpdlNoYXBlIiwicmVtb3ZlQ2hpbGRCeUlkIiwiX2hhc0V2ZW50TGlzdGVuZXIiLCJvdmVyRnVuIiwib3V0RnVuIiwib25jZUhhbmRsZSIsImFwcGx5IiwidW4iLCJNYXRyaXgiLCJhIiwiYiIsImMiLCJkIiwidHgiLCJ0eSIsIm10eCIsInNjYWxlWCIsInNjYWxlWSIsInJvdGF0aW9uIiwiY29zIiwic2luIiwiUEkiLCJjb25jYXQiLCJhbmdsZSIsInN0IiwiYWJzIiwiY3QiLCJzeCIsInN5IiwiZHgiLCJkeSIsInYiLCJhYSIsImFjIiwiYXR4IiwiYWIiLCJhZCIsImF0eSIsIm91dCIsIl9jYWNoZSIsIl9yYWRpYW5zIiwiaXNEZWdyZWVzIiwidG9GaXhlZCIsImRlZ3JlZVRvUmFkaWFuIiwicmFkaWFuVG9EZWdyZWUiLCJkZWdyZWVUbzM2MCIsInJlQW5nIiwiaXNJbnNpZGUiLCJzaGFwZSIsIl9wb2ludEluU2hhcGUiLCJfaXNJbnNpZGVMaW5lIiwiX2lzSW5zaWRlQnJva2VuTGluZSIsIl9pc0luc2lkZUNpcmNsZSIsIl9pc1BvaW50SW5FbGlwc2UiLCJfaXNJbnNpZGVTZWN0b3IiLCJfaXNJbnNpZGVQYXRoIiwiX2lzSW5zaWRlUG9seWdvbl9XaW5kaW5nTnVtYmVyIiwiaXNPdXRzaWRlIiwieDAiLCJ4U3RhcnQiLCJ5MCIsInlTdGFydCIsIngxIiwieEVuZCIsInkxIiwieUVuZCIsIl9sIiwibGluZVdpZHRoIiwiX2EiLCJfYiIsIl9zIiwicG9pbnRMaXN0IiwibGluZUFyZWEiLCJpbnNpZGVDYXRjaCIsImwiLCJfaXNJbnNpZGVSZWN0YW5nbGUiLCJtaW4iLCJyMCIsInN0YXJ0QW5nbGUiLCJteU1hdGgiLCJlbmRBbmdsZSIsImF0YW4yIiwicmVnSW4iLCJjbG9ja3dpc2UiLCJyZWdBbmdsZSIsImluQW5nbGVSZWciLCJjZW50ZXIiLCJYUmFkaXVzIiwiaHIiLCJZUmFkaXVzIiwidnIiLCJpUmVzIiwicG9seSIsInduIiwic2hpZnRQIiwic2hpZnQiLCJpbkxpbmUiLCJmaWxsU3R5bGUiLCJuIiwiVFdFRU4iLCJfdHdlZW5zIiwidHdlZW4iLCJ0aW1lIiwicHJlc2VydmUiLCJub3ciLCJfdCIsIl91cGRhdGVSZXMiLCJ1cGRhdGUiLCJwcm9jZXNzIiwiaHJ0aW1lIiwicGVyZm9ybWFuY2UiLCJiaW5kIiwiRGF0ZSIsImdldFRpbWUiLCJUd2VlbiIsIm9iamVjdCIsIl9vYmplY3QiLCJfdmFsdWVzU3RhcnQiLCJfdmFsdWVzRW5kIiwiX3ZhbHVlc1N0YXJ0UmVwZWF0IiwiX2R1cmF0aW9uIiwiX3JlcGVhdCIsIl9yZXBlYXREZWxheVRpbWUiLCJfeW95byIsIl9pc1BsYXlpbmciLCJfcmV2ZXJzZWQiLCJfZGVsYXlUaW1lIiwiX3N0YXJ0VGltZSIsIl9lYXNpbmdGdW5jdGlvbiIsIkVhc2luZyIsIkxpbmVhciIsIk5vbmUiLCJfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uIiwiSW50ZXJwb2xhdGlvbiIsIl9jaGFpbmVkVHdlZW5zIiwiX29uU3RhcnRDYWxsYmFjayIsIl9vblN0YXJ0Q2FsbGJhY2tGaXJlZCIsIl9vblVwZGF0ZUNhbGxiYWNrIiwiX29uQ29tcGxldGVDYWxsYmFjayIsIl9vblN0b3BDYWxsYmFjayIsInRvIiwicHJvcGVydGllcyIsImR1cmF0aW9uIiwiYWRkIiwicHJvcGVydHkiLCJzdG9wIiwicmVtb3ZlIiwic3RvcENoYWluZWRUd2VlbnMiLCJudW1DaGFpbmVkVHdlZW5zIiwiZGVsYXkiLCJhbW91bnQiLCJyZXBlYXQiLCJ0aW1lcyIsInJlcGVhdERlbGF5IiwieW95byIsImVhc2luZyIsImludGVycG9sYXRpb24iLCJjaGFpbiIsIm9uU3RhcnQiLCJjYWxsYmFjayIsIm9uVXBkYXRlIiwib25Db21wbGV0ZSIsIm9uU3RvcCIsImVsYXBzZWQiLCJjaGFyQXQiLCJ0bXAiLCJrIiwicG93Iiwic3FydCIsIkJvdW5jZSIsIk91dCIsIkluIiwibSIsImYiLCJmbG9vciIsInB3IiwiYm4iLCJCZXJuc3RlaW4iLCJDYXRtdWxsUm9tIiwicDAiLCJwMSIsInQiLCJmYyIsIkZhY3RvcmlhbCIsInAyIiwicDMiLCJ2MCIsInYxIiwidDIiLCJ0MyIsImxhc3RUaW1lIiwidmVuZG9ycyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZWxlbWVudCIsImN1cnJUaW1lIiwidGltZVRvQ2FsbCIsInNldFRpbWVvdXQiLCJfdGFza0xpc3QiLCJfcmVxdWVzdEFpZCIsImVuYWJsZWRBbmltYXRpb25GcmFtZSIsImN1cnJUYXNrTGlzdCIsInRhc2siLCJyZWdpc3RGcmFtZSIsIiRmcmFtZSIsImRlc3Ryb3lGcmFtZSIsImRfcmVzdWx0IiwicmVnaXN0VHdlZW4iLCJ0aWQiLCJmcm9tIiwiX2lzQ29tcGxldGVlZCIsIl9pc1N0b3BlZCIsImFuaW1hdGUiLCJkZXNjIiwiZGVzdHJveVR3ZWVuIiwibXNnIiwidW53YXRjaE9uZSIsIk9ic2VydmUiLCJzY29wZSIsIm1vZGVsIiwid2F0Y2hNb3JlIiwic3RvcFJlcGVhdEFzc2lnbiIsInNraXBBcnJheSIsIiRza2lwQXJyYXkiLCJWQlB1YmxpY3MiLCJsb29wIiwidmFsIiwidmFsdWVUeXBlIiwiYWNjZXNzb3IiLCJuZW8iLCJwcmVWYWx1ZSIsImNvbXBsZXhWYWx1ZSIsIm5lb1R5cGUiLCJhZGRDb2xvclN0b3AiLCIkbW9kZWwiLCIkZmlyZSIsInBtb2RlbCIsImhhc1dhdGNoTW9kZWwiLCIkd2F0Y2giLCIkcGFyZW50IiwiZGVmaW5lUHJvcGVydGllcyIsImFjY2Vzc29yZXMiLCIkYWNjZXNzb3IiLCJkZWZpbmVQcm9wZXJ0eSIsInByb3AiLCJfX2RlZmluZUdldHRlcl9fIiwiZ2V0IiwiX19kZWZpbmVTZXR0ZXJfXyIsInNldCIsImRlc2NzIiwiVkJBcnJheSIsImV4ZWNTY3JpcHQiLCJqb2luIiwiVkJNZWRpYXRvciIsImRlc2NyaXB0aW9uIiwicHVibGljcyIsIm93bmVyIiwiYnVmZmVyIiwicGFyc2VWQiIsIkRpc3BsYXlPYmplY3QiLCJjaGVja09wdCIsInN0YWdlIiwieHlUb0ludCIsIl9jcmVhdGVDb250ZXh0IiwiVUlEIiwiY3JlYXRlSWQiLCJpbml0IiwiX3VwZGF0ZVRyYW5zZm9ybSIsInNvdXJjZSIsInN0cmljdCIsIl9jb250ZXh0QVRUUlMiLCJfY29udGV4dCIsIiRvd25lciIsInRyYW5zRm9ybVByb3BzIiwibXlzZWxmIiwiY29uZiIsImltZyIsIm5ld09iaiIsInRleHQiLCJjb250YWluZXIiLCJjbSIsImludmVydCIsImxvY2FsVG9HbG9iYWwiLCJvIiwiYm9vbCIsIm51bSIsImZyb21JbmRleCIsImdldEluZGV4IiwidG9JbmRleCIsInBjbCIsInRyYW5zRm9ybSIsInRyYW5zZm9ybSIsInRvQXJyYXkiLCJvcmlnaW4iLCJzY2FsZU9yaWdpbiIsInRyYW5zbGF0ZSIsInNjYWxlIiwicm90YXRlT3JpZ2luIiwicm90YXRlIiwicGFyc2VJbnQiLCJzdHJva2VTdHlsZSIsInJlc3VsdCIsImludmVyc2VNYXRyaXgiLCJvcmlnaW5Qb3MiLCJtdWxWZWN0b3IiLCJfcmVjdCIsImdldFJlY3QiLCJIaXRUZXN0UG9pbnQiLCJ0b0NvbnRlbnQiLCJ1cEZ1biIsImNvbXBGdW4iLCJBbmltYXRpb25GcmFtZSIsInZpc2libGUiLCJzYXZlIiwiX3RyYW5zZm9ybUhhbmRlciIsInNldENvbnRleHRTdHlsZSIsInJlbmRlciIsInJlc3RvcmUiLCJyZW1vdmVDaGlsZCIsIkRpc3BsYXlPYmplY3RDb250YWluZXIiLCJtb3VzZUNoaWxkcmVuIiwiZ2V0Q2hpbGRJbmRleCIsIl9hZnRlckFkZENoaWxkIiwicmVtb3ZlQ2hpbGRBdCIsIl9hZnRlckRlbENoaWxkIiwibGVuIiwiZ2V0Q2hpbGRBdCIsImJvb2xlbiIsIm9sZEluZGV4IiwiZ2V0TnVtQ2hpbGRyZW4iLCJvYmpzIiwiX3JlbmRlciIsIlN0YWdlIiwiY29udGV4dDJEIiwic3RhZ2VSZW5kaW5nIiwiX2lzUmVhZHkiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsImNsZWFyIiwiY2xlYXJSZWN0IiwiUkVOREVSRVJfVFlQRSIsIlN5c3RlbVJlbmRlcmVyIiwiVU5LTk9XTiIsImFwcCIsInJlcXVlc3RBaWQiLCJjb252ZXJ0U3RhZ2VzIiwiX2hlYXJ0QmVhdCIsIl9wcmVSZW5kZXJUaW1lIiwiZW50ZXJGcmFtZSIsImNvbnZlcnRTdGFnZSIsIl9fdGFza0xpc3QiLCJzdGFydEVudGVyIiwiY29udmVydFR5cGUiLCJfY29udmVydENhbnZheCIsImNvbnZlcnRTaGFwZXMiLCJDYW52YXNSZW5kZXJlciIsIkNBTlZBUyIsIkFwcGxpY2F0aW9uIiwiX2NpZCIsInJhbmRvbSIsInF1ZXJ5Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJ2aWV3T2JqIiwiY3JlYXRlVmlldyIsImlubmVySFRNTCIsIm9mZnNldCIsImxhc3RHZXRSTyIsInJlbmRlcmVyIiwiUmVuZGVyZXIiLCJfY3JlYXRIb3ZlclN0YWdlIiwiX2NyZWF0ZVBpeGVsQ29udGV4dCIsInJlU2l6ZUNhbnZhcyIsInJlc2l6ZSIsImFkZENoaWxkIiwiX3BpeGVsQ2FudmFzIiwiY3JlYXRlQ2FudmFzIiwiY2FudmFzU3VwcG9ydCIsImRpc3BsYXkiLCJ6SW5kZXgiLCJ2aXNpYmlsaXR5IiwiX3BpeGVsQ3R4IiwiaW5zZXJ0QmVmb3JlIiwiaW5pdFN0YWdlIiwiU3ByaXRlIiwiU2hhcGUiLCJfaG92ZXJhYmxlIiwiX2NsaWNrYWJsZSIsImRyYXciLCJpbml0Q29tcFByb3BlcnR5IiwiX2hhc0ZpbGxBbmRTdHJva2UiLCJfZHJhd1R5cGVPbmx5IiwiY2xvc2VQYXRoIiwic3Ryb2tlIiwiZmlsbCIsImJlZ2luUGF0aCIsImRyYXdFbmQiLCJ4MiIsInkyIiwiZGFzaExlbmd0aCIsImRlbHRhWCIsImRlbHRhWSIsIm51bURhc2hlcyIsImxpbmVUbyIsIm1pblgiLCJOdW1iZXIiLCJNQVhfVkFMVUUiLCJtYXhYIiwiTUlOX1ZBTFVFIiwibWluWSIsIm1heFkiLCJjcGwiLCJyb3VuZCIsIlRleHQiLCJfcmVOZXdsaW5lIiwiZm9udFByb3BlcnRzIiwiZm9udCIsIl9nZXRGb250RGVjbGFyYXRpb24iLCJnZXRUZXh0V2lkdGgiLCJnZXRUZXh0SGVpZ2h0IiwiX3JlbmRlclRleHQiLCJfZ2V0VGV4dExpbmVzIiwiX2dldFRleHRXaWR0aCIsIl9nZXRUZXh0SGVpZ2h0IiwidGV4dExpbmVzIiwiX3JlbmRlclRleHRTdHJva2UiLCJfcmVuZGVyVGV4dEZpbGwiLCJmb250QXJyIiwiZm9udFAiLCJfYm91bmRhcmllcyIsImxpbmVIZWlnaHRzIiwiaGVpZ2h0T2ZMaW5lIiwiX2dldEhlaWdodE9mTGluZSIsIl9yZW5kZXJUZXh0TGluZSIsIl9nZXRUb3BPZmZzZXQiLCJzdHJva2VEYXNoQXJyYXkiLCJzZXRMaW5lRGFzaCIsIm1ldGhvZCIsImxpbmUiLCJsaW5lSW5kZXgiLCJ0ZXh0QWxpZ24iLCJfcmVuZGVyQ2hhcnMiLCJtZWFzdXJlVGV4dCIsInRvdGFsV2lkdGgiLCJ3b3JkcyIsIndvcmRzV2lkdGgiLCJyZXBsYWNlIiwid2lkdGhEaWZmIiwibnVtU3BhY2VzIiwic3BhY2VXaWR0aCIsImxlZnRPZmZzZXQiLCJjaGFycyIsImZvbnRTaXplIiwibGluZUhlaWdodCIsIm1heFdpZHRoIiwiY3VycmVudExpbmVXaWR0aCIsInRleHRCYXNlbGluZSIsIk1vdmllY2xpcCIsImN1cnJlbnRGcmFtZSIsImF1dG9QbGF5Iiwib3ZlclBsYXkiLCJfZnJhbWVSYXRlIiwibWFpbkZyYW1lUmF0ZSIsIl9zcGVlZFRpbWUiLCJmcmFtZVJhdGUiLCJwcmVGcmFtZSIsIl9nb3RvIiwicGxheSIsIl9fc3RhcnRFbnRlciIsIl9wdXNoMlRhc2tMaXN0IiwiX2VudGVySW5DYW52YXgiLCJnb3RvQW5kU3RvcCIsIl9uZXh0IiwiX3ByZSIsImhhc0V2ZW50IiwidExpc3QiLCJWZWN0b3IiLCJ2eCIsInZ5IiwiX2F4ZXMiLCJpbnRlcnBvbGF0ZSIsInBvaW50cyIsImlzTG9vcCIsInNtb290aEZpbHRlciIsInJldCIsImRpc3RhbmNlIiwicHJlVmVydG9yIiwiaVZ0b3IiLCJzZWdzIiwicG9zIiwiaWR4IiwidyIsIncyIiwidzMiLCJCcm9rZW5MaW5lIiwiYXR5cGUiLCJfaW5pdFBvaW50TGlzdCIsIm15QyIsInNtb290aCIsImN1cnJMIiwiU21vb3RoU3BsaW5lIiwiX2RyYXciLCJsaW5lVHlwZSIsIm1vdmVUbyIsInNpIiwic2wiLCJmcm9tWCIsInRvWCIsImZyb21ZIiwidG9ZIiwiZGFzaGVkTGluZVRvIiwiZ2V0UmVjdEZvcm1Qb2ludExpc3QiLCJDaXJjbGUiLCJhcmMiLCJwbGlzdCIsIml0IiwiaXQyIiwiaXQzIiwiY3BYMSIsImNwWTEiLCJjcFgyIiwiY3BZMiIsIlBhdGgiLCJkcmF3VHlwZU9ubHkiLCJfX3BhcnNlUGF0aERhdGEiLCJwYXRoIiwiZGF0YSIsInBhdGhzIiwicGF0aFN0ciIsIl9wYXJzZUNoaWxkUGF0aERhdGEiLCJjcyIsImNjIiwiUmVnRXhwIiwiYXJyIiwiY2EiLCJjcHgiLCJjcHkiLCJzdHIiLCJjbWQiLCJjdGxQdHgiLCJjdGxQdHkiLCJwcmV2Q21kIiwicngiLCJyeSIsInBzaSIsImZhIiwiZnMiLCJjb21tYW5kIiwiX2NvbnZlcnRQb2ludCIsInBzaURlZyIsInhwIiwieXAiLCJsYW1iZGEiLCJjeHAiLCJjeXAiLCJjeCIsImN5Iiwidk1hZyIsInZSYXRpbyIsInUiLCJ2QW5nbGUiLCJhY29zIiwidGhldGEiLCJkVGhldGEiLCJzdGVwcyIsImNlaWwiLCJwYXJyIiwidHAiLCJCZXppZXIiLCJnZXRQb2ludEJ5VGltZSIsImNwcyIsInBhdGhBcnJheSIsIl9wYXJzZVBhdGhEYXRhIiwiX3NldFBvaW50TGlzdCIsImciLCJnbCIsImJlemllckN1cnZlVG8iLCJxdWFkcmF0aWNDdXJ2ZVRvIiwic2luZ2xlUG9pbnRMaXN0IiwidG9VcHBlckNhc2UiLCJfZ2V0QXJjUG9pbnRzIiwiX3BvaW50cyIsImNTdGFydCIsInByZVBvaW50cyIsIl9nZXRCZXppZXJQb2ludHMiLCJqIiwicHkiLCJyZWN0IiwiRHJvcGxldCIsInBzIiwiRWxsaXBzZSIsInJhdGlvWCIsInJhdGlvWSIsIlBvbHlnb24iLCJ1bnNoaWZ0IiwiSXNvZ29uIiwic2V0UG9pbnRMaXN0IiwiZFN0ZXAiLCJiZWdpbkRlZyIsImRlZyIsIkxpbmUiLCJSZWN0IiwicmFkaXVzIiwiZ2V0Q3NzT3JkZXJBcnIiLCJmaWxsUmVjdCIsInN0cm9rZVJlY3QiLCJfYnVpbGRSYWRpdXNQYXRoIiwiU2VjdG9yIiwiaXNSaW5nIiwiZ2V0UmVnQW5nbGUiLCJwNERpcmVjdGlvbiIsIkNhbnZheCIsIkRpc3BsYXkiLCJTaGFwZXMiLCJFdmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxNQUFJLEVBQVI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQSxJQUFJQyxhQUFhQyxNQUFNQyxTQUF2QjtJQUFrQ0MsV0FBV0MsT0FBT0YsU0FBcEQ7QUFDQSxJQUNBRyxXQUFtQkYsU0FBU0UsUUFENUI7SUFFQUMsaUJBQW1CSCxTQUFTRyxjQUY1Qjs7QUFJQSxJQUNBQyxnQkFBcUJQLFdBQVdRLE9BRGhDO0lBRUFDLGVBQXFCVCxXQUFXVSxNQUZoQztJQUdBQyxnQkFBcUJYLFdBQVdZLE9BSGhDO0lBSUFDLGdCQUFxQlosTUFBTWEsT0FKM0I7SUFLQUMsYUFBcUJYLE9BQU9ZLElBTDVCOztBQU9BbEIsSUFBRW1CLE1BQUYsR0FBVyxVQUFTQyxHQUFULEVBQWM7TUFDbkJGLE9BQU9sQixJQUFFa0IsSUFBRixDQUFPRSxHQUFQLENBQVg7TUFDSUMsU0FBU0gsS0FBS0csTUFBbEI7TUFDSUYsU0FBUyxJQUFJaEIsS0FBSixDQUFVa0IsTUFBVixDQUFiO09BQ0ssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxNQUFwQixFQUE0QkMsR0FBNUIsRUFBaUM7V0FDeEJBLENBQVAsSUFBWUYsSUFBSUYsS0FBS0ksQ0FBTCxDQUFKLENBQVo7O1NBRUtILE1BQVA7Q0FQRjs7QUFVQW5CLElBQUVrQixJQUFGLEdBQVNELGNBQWMsVUFBU0csR0FBVCxFQUFjO01BQy9CQSxRQUFRZCxPQUFPYyxHQUFQLENBQVosRUFB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
