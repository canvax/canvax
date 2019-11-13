"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./canvas/CanvasRenderer"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./canvas/CanvasRenderer"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.CanvasRenderer);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _CanvasRenderer) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = autoRenderer;

  var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  //import WebGLRenderer from './webgl/WebGLRenderer';
  function autoRenderer(app, options) {
    return new _CanvasRenderer2.default(app, options);
    /*
       if (app.webGL && utils.isWebGLSupported())
       {
           return new WebGLRenderer( app , options);
       };
       return new CanvasRenderer( app , options);
       */
  }
});