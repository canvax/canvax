"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "pixi-gl-core"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("pixi-gl-core"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pixiGlCore);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _pixiGlCore) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

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

  var WebGLGraphicsData = function () {
    function WebGLGraphicsData(gl, shader, attribsState) {
      _classCallCheck(this, WebGLGraphicsData);

      this.gl = gl;
      this.color = [0, 0, 0]; // color split!

      this.points = [];
      this.indices = [];
      this.buffer = _pixiGlCore2["default"].GLBuffer.createVertexBuffer(gl);
      this.indexBuffer = _pixiGlCore2["default"].GLBuffer.createIndexBuffer(gl);
      this.dirty = true;
      this.glPoints = null;
      this.glIndices = null;
      this.shader = shader;
      this.vao = new _pixiGlCore2["default"].VertexArrayObject(gl, attribsState).addIndex(this.indexBuffer).addAttribute(this.buffer, shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 6, 0).addAttribute(this.buffer, shader.attributes.aColor, gl.FLOAT, false, 4 * 6, 2 * 4);
    }

    _createClass(WebGLGraphicsData, [{
      key: "reset",
      value: function reset() {
        this.points.length = 0;
        this.indices.length = 0;
      }
    }, {
      key: "upload",
      value: function upload() {
        this.glPoints = new Float32Array(this.points);
        this.buffer.upload(this.glPoints);
        this.glIndices = new Uint16Array(this.indices);
        this.indexBuffer.upload(this.glIndices);
        this.dirty = false;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.color = null;
        this.points = null;
        this.indices = null;
        this.vao.destroy();
        this.buffer.destroy();
        this.indexBuffer.destroy();
        this.gl = null;
        this.buffer = null;
        this.indexBuffer = null;
        this.glPoints = null;
        this.glIndices = null;
      }
    }]);

    return WebGLGraphicsData;
  }();

  exports.default = WebGLGraphicsData;
});