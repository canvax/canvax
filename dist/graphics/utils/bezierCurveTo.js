"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.undefined = mod.exports;
  }
})(void 0, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = bezierCurveTo;

  function bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
    var path = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
    var n = 20;
    var dt = 0;
    var dt2 = 0;
    var dt3 = 0;
    var t2 = 0;
    var t3 = 0;
    path.push(fromX, fromY);

    for (var i = 1, j = 0; i <= n; ++i) {
      j = i / n;
      dt = 1 - j;
      dt2 = dt * dt;
      dt3 = dt2 * dt;
      t2 = j * j;
      t3 = t2 * j;
      path.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
    }

    return path;
  }
});