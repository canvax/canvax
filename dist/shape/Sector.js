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
})(void 0, function (exports, _Shape2, _index, _mmvis, _Math) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Shape3 = _interopRequireDefault(_Shape2);

  var _index2 = _interopRequireDefault(_index);

  var _Math2 = _interopRequireDefault(_Math);

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

  var Sector = function (_Shape) {
    _inherits(Sector, _Shape);

    function Sector(opt) {
      _classCallCheck(this, Sector);

      var _context = _mmvis._.extend(true, {
        pointList: [],
        //边界点的集合,私有，从下面的属性计算的来
        r0: 0,
        // 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
        r: 0,
        //{number},  // 必须，外圆半径
        startAngle: 0,
        //{number},  // 必须，起始角度[0, 360)
        endAngle: 0,
        //{number},  // 必须，结束角度(0, 360]
        clockwise: false //是否顺时针，默认为false(顺时针)

      }, opt.context);

      opt.context = _context;
      opt.regAngle = [];
      opt.isRing = false; //是否为一个圆环

      opt.type = "sector";
      return _possibleConstructorReturn(this, _getPrototypeOf(Sector).call(this, opt));
    }

    _createClass(Sector, [{
      key: "watch",
      value: function watch(name, value, preValue) {
        if (name == "r0" || name == "r" || name == "startAngle" || name == "endAngle" || name == "clockwise") {
          //因为这里的graphs不一样。
          this.isRing = false; //是否为一个圆环，这里也要开始初始化一下

          this.graphics.clear();
        }

        ;
      }
    }, {
      key: "draw",
      value: function draw(graphics) {
        var model = this.context.$model; // 形内半径[0,r)

        var r0 = typeof model.r0 == 'undefined' ? 0 : model.r0;
        var r = model.r; // 扇形外半径(0,r]

        var startAngle = _Math2["default"].degreeTo360(model.startAngle); // 起始角度[0,360)


        var endAngle = _Math2["default"].degreeTo360(model.endAngle); // 结束角度(0,360]


        if (model.startAngle != model.endAngle && Math.abs(model.startAngle - model.endAngle) % 360 == 0) {
          //if( startAngle == endAngle && model.startAngle != model.endAngle ) {
          //如果两个角度相等，那么就认为是个圆环了
          this.isRing = true;
          startAngle = 0;
          endAngle = 360;
        }

        startAngle = _Math2["default"].degreeToRadian(startAngle);
        endAngle = _Math2["default"].degreeToRadian(endAngle); //处理下极小夹角的情况
        //if( endAngle - startAngle < 0.025 ){
        //    startAngle -= 0.003
        //}

        var G = graphics; //G.beginPath();

        if (this.isRing) {
          if (model.r0 == 0) {
            //圆
            G.drawCircle(0, 0, model.r);
          } else {
            //圆环
            if (model.fillStyle && model.fillAlpha) {
              G.beginPath();
              G.arc(0, 0, r, startAngle, endAngle, model.clockwise);

              if (model.r0 == 0) {
                G.lineTo(0, 0);
              } else {
                G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
              }

              G.closePath();
              G.currentPath.lineWidth = 0;
              G.currentPath.strokeStyle = null;
              G.currentPath.strokeAlpha = 0;
              G.currentPath.line = false;
            }

            if (model.lineWidth && model.strokeStyle && model.strokeAlpha) {
              G.beginPath();
              G.arc(0, 0, r, startAngle, endAngle, model.clockwise);
              G.closePath();
              G.currentPath.fillStyle = null;
              G.currentPath.fill = false;
              G.beginPath();
              G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
              G.closePath();
              G.currentPath.fillStyle = null;
              G.currentPath.fill = false;
            }
          }
        } else {
          //正常的扇形状
          G.beginPath();
          G.arc(0, 0, r, startAngle, endAngle, model.clockwise);

          if (model.r0 == 0) {
            G.lineTo(0, 0);
          } else {
            G.arc(0, 0, r0, endAngle, startAngle, !model.clockwise);
          }

          G.closePath();
        } //G.closePath();

      }
    }]);

    return Sector;
  }(_Shape3["default"]);

  exports.default = Sector;
});