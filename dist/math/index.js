"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Arc", "./shapes/Circle", "./shapes/Ellipse", "./shapes/Polygon", "./shapes/Rectangle"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Arc"), require("./shapes/Circle"), require("./shapes/Ellipse"), require("./shapes/Polygon"), require("./shapes/Rectangle"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Arc, global.Circle, global.Ellipse, global.Polygon, global.Rectangle);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Arc, _Circle, _Ellipse, _Polygon, _Rectangle) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "Arc", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_Arc).default;
    }
  });
  Object.defineProperty(exports, "Circle", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_Circle).default;
    }
  });
  Object.defineProperty(exports, "Ellipse", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_Ellipse).default;
    }
  });
  Object.defineProperty(exports, "Polygon", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_Polygon).default;
    }
  });
  Object.defineProperty(exports, "Rectangle", {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_Rectangle).default;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});