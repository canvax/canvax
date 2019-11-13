"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../math/index", "../../../geom/Matrix", "../../../const", "../../../settings", "pixi-gl-core"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../math/index"), require("../../../geom/Matrix"), require("../../../const"), require("../../../settings"), require("pixi-gl-core"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.Matrix, global._const, global.settings, global.pixiGlCore);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _index, _Matrix, _const, _settings, _pixiGlCore) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Matrix2 = _interopRequireDefault(_Matrix);

  var _settings2 = _interopRequireDefault(_settings);

  var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

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

  var GLFramebuffer = _pixiGlCore2.default.GLFramebuffer;

  var RenderTarget = function () {
    function RenderTarget(gl, width, height, resolution, root) {
      _classCallCheck(this, RenderTarget);

      this.gl = gl; // framebuffer 是WebGL渲染的终点。当你看屏幕时，其他就是在看 framebuffer 中的内容。

      this.frameBuffer = null;
      this.clearColor = [0, 0, 0, 0];
      this.size = new _index.Rectangle(0, 0, 1, 1);
      /**
       * 设备分辨率
       */

      this.resolution = resolution || _settings2.default.RESOLUTION; //投影矩阵，把所有的顶点投射到webgl的[-1,1]的坐标系内

      this.projectionMatrix = new _Matrix2.default();
      this.frame = null;
      this.defaultFrame = new _index.Rectangle();
      this.destinationFrame = null;
      this.sourceFrame = null;
      this.root = root;
      this.frameBuffer = new GLFramebuffer(gl, 100, 100);
      this.frameBuffer.framebuffer = null;
      this.setFrame();
      this.resize(width, height);
    }

    _createClass(RenderTarget, [{
      key: "clear",
      value: function clear(clearColor) {
        var cc = clearColor || this.clearColor;
        this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]); // r,g,b,a);
      }
    }, {
      key: "setFrame",
      value: function setFrame(destinationFrame, sourceFrame) {
        this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
        this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
      }
    }, {
      key: "activate",
      value: function activate() {
        var gl = this.gl;
        this.frameBuffer.bind();
        this.calculateProjection(this.destinationFrame, this.sourceFrame);

        if (this.destinationFrame !== this.sourceFrame) {
          gl.enable(gl.SCISSOR_TEST);
          gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
        } else {
          gl.disable(gl.SCISSOR_TEST);
        }

        gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
      }
    }, {
      key: "calculateProjection",
      value: function calculateProjection(destinationFrame, sourceFrame) {
        var pm = this.projectionMatrix;
        sourceFrame = sourceFrame || destinationFrame;
        pm.identity();
        pm.a = 1 / destinationFrame.width;
        pm.d = -1 / destinationFrame.height;
        pm.tx = -1 - sourceFrame.x * pm.a;
        pm.ty = 1 - sourceFrame.y * pm.d;
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        width = width | 0;
        height = height | 0;

        if (this.size.width === width && this.size.height === height) {
          return;
        }

        this.size.width = width;
        this.size.height = height;
        this.defaultFrame.width = width;
        this.defaultFrame.height = height;
        this.frameBuffer.resize(width * this.resolution, height * this.resolution);
        var projectionFrame = this.frame || this.size;
        this.calculateProjection(projectionFrame);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.frameBuffer.destroy();
        this.frameBuffer = null;
      }
    }]);

    return RenderTarget;
  }();

  exports.default = RenderTarget;
});