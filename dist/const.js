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
  var VERSION = exports.VERSION = __VERSION__;
  var PI_2 = exports.PI_2 = Math.PI * 2;
  var RAD_TO_DEG = exports.RAD_TO_DEG = 180 / Math.PI;
  var DEG_TO_RAD = exports.DEG_TO_RAD = Math.PI / 180;
  var RENDERER_TYPE = exports.RENDERER_TYPE = {
    UNKNOWN: 0,
    WEBGL: 1,
    CANVAS: 2
  };
  var DRAW_MODES = exports.DRAW_MODES = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
  };
  var SHAPES = exports.SHAPES = {
    POLY: 0,
    RECT: 1,
    CIRC: 2,
    ELIP: 3
  };
  var SCALE_MODES = exports.SCALE_MODES = {
    LINEAR: 0,
    NEAREST: 1
  };
  var CONTEXT_DEFAULT = exports.CONTEXT_DEFAULT = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    scaleOrigin: {
      x: 0,
      y: 0
    },
    rotation: 0,
    rotateOrigin: {
      x: 0,
      y: 0
    },
    visible: true,
    globalAlpha: 1
  };
  var SHAPE_CONTEXT_DEFAULT = exports.SHAPE_CONTEXT_DEFAULT = {
    cursor: "default",
    fillAlpha: 1,
    //context2d里没有，自定义
    fillStyle: null,
    //"#000000",
    lineCap: null,
    //默认都是直角
    lineJoin: null,
    //这两个目前webgl里面没实现
    miterLimit: null,
    //miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。
    strokeAlpha: 1,
    //context2d里没有，自定义
    strokeStyle: null,
    lineType: "solid",
    //context2d里没有，自定义线条的type，默认为实线
    lineWidth: null
  }; //会影响到transform改变的context属性

  var TRANSFORM_PROPS = exports.TRANSFORM_PROPS = ["x", "y", "scaleX", "scaleY", "rotation", "scaleOrigin", "rotateOrigin"]; //所有和样式相关的属性
  //appha 有 自己的 处理方式

  var STYLE_PROPS = exports.STYLE_PROPS = ["lineWidth", "strokeAlpha", "strokeStyle", "fillStyle", "fillAlpha", "globalAlpha"];
});