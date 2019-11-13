"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Vector", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Vector"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Vector, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _Vector, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opt) {
    var points = opt.points;
    var isLoop = opt.isLoop;
    var smoothFilter = opt.smoothFilter;
    var len = points.length;

    if (len == 1) {
      return points;
    }

    var ret = [];
    var distance = 0;
    var preVertor = new _Vector2.default(points[0]);
    var iVtor = null;

    for (var i = 1; i < len; i++) {
      iVtor = new _Vector2.default(points[i]);
      distance += preVertor.distance(iVtor);
      preVertor = iVtor;
    }

    preVertor = null;
    iVtor = null; //基本上等于曲率

    var segs = distance / 6;
    segs = segs < len ? len : segs;

    for (var i = 0; i < segs; i++) {
      var pos = i / (segs - 1) * (isLoop ? len : len - 1);
      var idx = Math.floor(pos);
      var w = pos - idx;
      var p0;
      var p1 = points[idx % len];
      var p2;
      var p3;

      if (!isLoop) {
        p0 = points[idx === 0 ? idx : idx - 1];
        p2 = points[idx > len - 2 ? len - 1 : idx + 1];
        p3 = points[idx > len - 3 ? len - 1 : idx + 2];
      } else {
        p0 = points[(idx - 1 + len) % len];
        p2 = points[(idx + 1) % len];
        p3 = points[(idx + 2) % len];
      }

      var w2 = w * w;
      var w3 = w * w2;
      var rp = [interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3), interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)];
      _mmvis._.isFunction(smoothFilter) && smoothFilter(rp);
      ret.push(rp);
    }

    return ret;
  };

  var _Vector2 = _interopRequireDefault(_Vector);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 处理为平滑线条
   */

  /**
   * @inner
   */
  function interpolate(p0, p1, p2, p3, t, t2, t3) {
    var v0 = (p2 - p0) * 0.25;
    var v1 = (p3 - p1) * 0.25;
    return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
  }
  /**
   * 多线段平滑曲线 
   * opt ==> points , isLoop
   */


  ;
});