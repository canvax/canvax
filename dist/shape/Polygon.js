"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../display/Shape", "../utils/index", "mmvis", "../geom/Math"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../display/Shape"), require("../utils/index"), require("mmvis"), require("../geom/Math"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Shape, global.index, global.mmvis, global.Math);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Shape2, _index, _mmvis, _Math2) {
  "use strict";

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

      ;
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

        ;
        graphics.moveTo(pointList[0][0], pointList[0][1]);

        for (var i = 1, l = pointList.length; i < l; i++) {
          graphics.lineTo(pointList[i][0], pointList[i][1]);
        }

        ;
        graphics.closePath();
        return;
      }
    }]);

    return Polygon;
  }(_Shape3["default"]);

  exports.default = Polygon;
  ;
});