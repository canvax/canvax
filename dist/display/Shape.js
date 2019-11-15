"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./DisplayObject", "../utils/index", "mmvis", "../const", "../graphics/Graphics"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./DisplayObject"), require("../utils/index"), require("mmvis"), require("../const"), require("../graphics/Graphics"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.DisplayObject, global.index, global.mmvis, global._const, global.Graphics);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _DisplayObject2, _index, _mmvis, _const, _Graphics) {
  "use strict";

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

      ;
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