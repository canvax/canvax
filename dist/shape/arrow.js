"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../display/Shape", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../display/Shape"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Shape, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Shape2, _mmvis) {
  "use strict";

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

        ;
        return this;
      }
    }]);

    return Line;
  }(_Shape3.default);

  exports.default = Line;
  ;
});