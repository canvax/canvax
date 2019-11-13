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

  var BrokenLine = function (_Shape) {
    _inherits(BrokenLine, _Shape);

    function BrokenLine(opt) {
      var _this;

      _classCallCheck(this, BrokenLine);

      opt = _index2.default.checkOpt(opt);

      var _context = _mmvis._.extend(true, {
        lineType: null,
        smooth: false,
        pointList: [],
        //{Array}  // 必须，各个顶角坐标
        smoothFilter: _index2.default.__emptyFunc
      }, opt.context);

      if (!opt.isClone && _context.smooth) {
        _context.pointList = _Math3.default.getSmoothPointList(_context.pointList, _context.smoothFilter);
      }

      ;
      opt.context = _context;
      opt.type = "brokenline";
      _this = _possibleConstructorReturn(this, _getPrototypeOf(BrokenLine).call(this, opt)); //保存好原始值

      _this._pointList = _context.pointList;
      return _this;
    }

    _createClass(BrokenLine, [{
      key: "watch",
      value: function watch(name, value, preValue) {
        if (name == "pointList" || name == "smooth" || name == "lineType") {
          if (name == "pointList" && this.context.smooth) {
            this.context.pointList = _Math3.default.getSmoothPointList(value, this.context.smoothFilter);
            this._pointList = value;
          }

          ;

          if (name == "smooth") {
            //如果是smooth的切换
            if (value) {
              //从原始中拿数据重新生成
              this.context.pointList = _Math3.default.getSmoothPointList(this._pointList, this.context.smoothFilter);
            } else {
              this.context.pointList = this._pointList;
            }
          }

          ;
          this.graphics.clear();
        }
      }
    }, {
      key: "draw",
      value: function draw(graphics) {
        var context = this.context;
        var pointList = context.pointList;
        var beginPath = false;

        for (var i = 0, l = pointList.length; i < l; i++) {
          var point = pointList[i];

          if (_Math3.default.isValibPoint(point)) {
            if (!beginPath) {
              graphics.moveTo(point[0], point[1]);
            } else {
              graphics.lineTo(point[0], point[1]);
            }

            ;
            beginPath = true;
          } else {
            beginPath = false;
          }
        }

        return this;
      }
    }]);

    return BrokenLine;
  }(_Shape3.default);

  exports.default = BrokenLine;
});