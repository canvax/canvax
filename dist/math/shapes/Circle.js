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

  var Circle = function () {
    function Circle() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      _classCallCheck(this, Circle);

      this.x = x;
      this.y = y;
      this.radius = radius;
      this.type = _const.SHAPES.CIRC;
      this.closed = true;
    }

    _createClass(Circle, [{
      key: "clone",
      value: function clone() {
        return new Circle(this.x, this.y, this.radius);
      }
    }, {
      key: "contains",
      value: function contains(x, y) {
        if (this.radius <= 0) {
          return false;
        }

        var r2 = this.radius * this.radius;
        var dx = this.x - x;
        var dy = this.y - y;
        dx *= dx;
        dy *= dy;
        return dx + dy <= r2;
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        return new _Rectangle2["default"](this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      }
    }]);

    return Circle;
  }();

  exports.default = Circle;
});