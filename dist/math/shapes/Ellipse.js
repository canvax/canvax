"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Rectangle", "../../const"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Rectangle"), require("../../const"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Rectangle, global._const);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Rectangle, _const) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Rectangle2 = _interopRequireDefault(_Rectangle);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  var Ellipse = function () {
    function Ellipse() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      _classCallCheck(this, Ellipse);

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.type = _const.SHAPES.ELIP;
      this.closed = true;
    }

    _createClass(Ellipse, [{
      key: "clone",
      value: function clone() {
        return new Ellipse(this.x, this.y, this.width, this.height);
      }
    }, {
      key: "contains",
      value: function contains(x, y) {
        if (this.width <= 0 || this.height <= 0) {
          return false;
        }

        var normx = (x - this.x) / this.width;
        var normy = (y - this.y) / this.height;
        normx *= normx;
        normy *= normy;
        return normx + normy <= 1;
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        return new _Rectangle2["default"](this.x - this.width, this.y - this.height, this.width, this.height);
      }
    }]);

    return Ellipse;
  }();

  exports.default = Ellipse;
});