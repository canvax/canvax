"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Path", "../utils/index", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Path"), require("../utils/index"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Path, global.index, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Path2, _index, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Path3 = _interopRequireDefault(_Path2);

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

  var Droplet = function (_Path) {
    _inherits(Droplet, _Path);

    function Droplet(opt) {
      var _this;

      _classCallCheck(this, Droplet);

      opt = _mmvis._.extend(true, {
        type: "droplet",
        context: {
          hr: 0,
          //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
          vr: 0 //{number},  // 必须，水滴纵高（中心到尖端距离）

        }
      }, _index2.default.checkOpt(opt));

      var my = _this = _possibleConstructorReturn(this, _getPrototypeOf(Droplet).call(this, opt));

      _this.context.$model.path = _this.createPath();
      return _this;
    }

    _createClass(Droplet, [{
      key: "watch",
      value: function watch(name, value, preValue) {
        if (name == "hr" || name == "vr") {
          this.context.$model.path = this.createPath();
        }
      }
    }, {
      key: "createPath",
      value: function createPath() {
        var model = this.context.$model;
        var ps = "M 0 " + model.hr + " C " + model.hr + " " + model.hr + " " + model.hr * 3 / 2 + " " + -model.hr / 3 + " 0 " + -model.vr;
        ps += " C " + -model.hr * 3 / 2 + " " + -model.hr / 3 + " " + -model.hr + " " + model.hr + " 0 " + model.hr + "z";
        return ps;
      }
    }]);

    return Droplet;
  }(_Path3.default);

  exports.default = Droplet;
});