"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../display/Shape", "../utils/index", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../display/Shape"), require("../utils/index"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Shape, global.index, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Shape2, _index, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Shape3 = _interopRequireDefault(_Shape2);

  var _index2 = _interopRequireDefault(_index);

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

  var Rect = function (_Shape) {
    _inherits(Rect, _Shape);

    function Rect(opt) {
      _classCallCheck(this, Rect);

      var _context = _mmvis._.extend(true, {
        width: 0,
        height: 0,
        radius: []
      }, opt.context);

      opt.context = _context;
      opt.type = "rect";
      return _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, opt));
    }

    _createClass(Rect, [{
      key: "watch",
      value: function watch(name, value, preValue) {
        if (name == "width" || name == "height" || name == "radius") {
          this.graphics.clear();
        }
      }
    }, {
      key: "_buildRadiusPath",
      value: function _buildRadiusPath(graphics) {
        var model = this.context.$model; //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
        //r缩写为1         相当于 [1, 1, 1, 1]
        //r缩写为[1]       相当于 [1, 1, 1, 1]
        //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
        //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]

        var x = 0;
        var y = 0;
        var width = model.width;
        var height = model.height;

        var r = _index2.default.getCssOrderArr(model.radius);

        var G = graphics;
        var sy = 1;

        if (height >= 0) {
          sy = -1;
        }

        G.moveTo(parseInt(x + r[0]), parseInt(height));
        G.lineTo(parseInt(x + width - r[1]), parseInt(height));
        r[1] !== 0 && G.quadraticCurveTo(x + width, height, parseInt(x + width), parseInt(height + r[1] * sy));
        G.lineTo(parseInt(x + width), parseInt(y - r[2] * sy));
        r[2] !== 0 && G.quadraticCurveTo(x + width, y, parseInt(x + width - r[2]), parseInt(y));
        G.lineTo(parseInt(x + r[3]), parseInt(y));
        r[3] !== 0 && G.quadraticCurveTo(x, y, parseInt(x), parseInt(y - r[3] * sy));
        G.lineTo(parseInt(x), parseInt(y + height + r[0] * sy));
        r[0] !== 0 && G.quadraticCurveTo(x, y + height, parseInt(x + r[0]), parseInt(y + height));
      }
    }, {
      key: "draw",
      value: function draw(graphics) {
        var model = this.context.$model;

        if (!model.radius.length) {
          graphics.drawRect(0, 0, model.width, model.height);
        } else {
          this._buildRadiusPath(graphics);
        }

        graphics.closePath();
        return;
      }
    }]);

    return Rect;
  }(_Shape3.default);

  exports.default = Rect;
});