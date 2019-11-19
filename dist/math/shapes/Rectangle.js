"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../const"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../const"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._const);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _const) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

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

  var Rectangle = function () {
    function Rectangle() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      _classCallCheck(this, Rectangle);

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.type = _const.SHAPES.RECT;
      this.closed = true;
    }

    _createClass(Rectangle, [{
      key: "clone",
      value: function clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
      }
    }, {
      key: "copy",
      value: function copy(rectangle) {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;
        return this;
      }
    }, {
      key: "contains",
      value: function contains(x, y) {
        /*
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }
        */
        if (this.height * y < 0 || this.width * x < 0) {
          return false;
        }

        ;

        if (x >= this.x && x <= this.x + this.width && (this.height >= 0 && y >= this.y && y <= this.y + this.height || this.height < 0 && y <= this.y && y >= this.y + this.height)) {
          return true;
        }

        return false; //当x和 width , y和height都 为正或者都未负数的情况下，才可能在范围内

        /*
        if (x >= this.x && x < this.x + this.width)
        {
            if (y >= this.y && y < this.y + this.height)
            {
                return true;
            }
        }
        */

        return false;
      }
    }]);

    return Rectangle;
  }();

  exports.default = Rectangle;
});