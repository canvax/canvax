"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Polygon", "../utils/index", "mmvis", "../geom/Math"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Polygon"), require("../utils/index"), require("mmvis"), require("../geom/Math"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Polygon, global.index, global.mmvis, global.Math);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Polygon2, _index, _mmvis, _Math2) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Polygon3 = _interopRequireDefault(_Polygon2);

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

  var Isogon = function (_Polygon) {
    _inherits(Isogon, _Polygon);

    function Isogon(opt) {
      _classCallCheck(this, Isogon);

      var _context = _mmvis._.extend(true, {
        pointList: [],
        //从下面的r和n计算得到的边界值的集合
        r: 0,
        //{number},  // 必须，正n边形外接圆半径
        n: 0 //{number},  // 必须，指明正几边形

      }, opt.context);

      _context.pointList = _Math3.default.getIsgonPointList(_context.n, _context.r);
      opt.context = _context;
      opt.type = "isogon";
      return _possibleConstructorReturn(this, _getPrototypeOf(Isogon).call(this, opt));
    }

    _createClass(Isogon, [{
      key: "watch",
      value: function watch(name, value, preValue) {
        if (name == "r" || name == "n") {
          //如果path有变动，需要自动计算新的pointList
          this.context.$model.pointList = _Math3.default.getIsgonPointList(this.context.$model.n, this.context.$model.r);
        }

        if (name == "pointList" || name == "smooth" || name == "lineType") {
          this.graphics.clear();
        }
      }
    }]);

    return Isogon;
  }(_Polygon3.default);

  exports.default = Isogon;
  ;
});