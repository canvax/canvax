"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 向量操作类
   * */
  function Vector(x, y) {
    var vx = 0,
        vy = 0;

    if (arguments.length == 1 && _mmvis._.isObject(x)) {
      var arg = arguments[0];

      if (_mmvis._.isArray(arg)) {
        vx = arg[0];
        vy = arg[1];
      } else if (arg.hasOwnProperty("x") && arg.hasOwnProperty("y")) {
        vx = arg.x;
        vy = arg.y;
      }
    }

    this._axes = [vx, vy];
  }

  ;
  Vector.prototype = {
    distance: function distance(v) {
      var x = this._axes[0] - v._axes[0];
      var y = this._axes[1] - v._axes[1];
      return Math.sqrt(x * x + y * y);
    }
  };
  exports["default"] = Vector;
});