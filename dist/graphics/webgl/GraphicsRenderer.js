"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mmvis", "../../const", "../../renderers/webgl/WebGLRenderer", "./WebGLGraphicsData", "./shaders/PrimitiveShader", "./utils/buildPoly", "./utils/buildRectangle", "./utils/buildCircle"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mmvis"), require("../../const"), require("../../renderers/webgl/WebGLRenderer"), require("./WebGLGraphicsData"), require("./shaders/PrimitiveShader"), require("./utils/buildPoly"), require("./utils/buildRectangle"), require("./utils/buildCircle"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mmvis, global._const, global.WebGLRenderer, global.WebGLGraphicsData, global.PrimitiveShader, global.buildPoly, global.buildRectangle, global.buildCircle);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _mmvis, _const, _WebGLRenderer, _WebGLGraphicsData, _PrimitiveShader, _buildPoly, _buildRectangle, _buildCircle) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);

  var _WebGLGraphicsData2 = _interopRequireDefault(_WebGLGraphicsData);

  var _PrimitiveShader2 = _interopRequireDefault(_PrimitiveShader);

  var _buildPoly2 = _interopRequireDefault(_buildPoly);

  var _buildRectangle2 = _interopRequireDefault(_buildRectangle);

  var _buildCircle2 = _interopRequireDefault(_buildCircle);

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

  var GraphicsRenderer = function () {
    function GraphicsRenderer(renderer) {
      _classCallCheck(this, GraphicsRenderer);

      this.renderer = renderer;
      this.graphicsDataPool = [];
      this.primitiveShader = null;
      this.gl = renderer.gl;
      this.CONTEXT_UID = 0;
    }

    _createClass(GraphicsRenderer, [{
      key: "onContextChange",
      value: function onContextChange() {
        this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID;
        this.primitiveShader = new _PrimitiveShader2["default"](this.gl);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.renderer = null;

        for (var i = 0; i < this.graphicsDataPool.length; ++i) {
          this.graphicsDataPool[i].destroy();
        }

        this.graphicsDataPool = null;
      }
    }, {
      key: "render",
      value: function render(displayObject, stage) {
        var renderer = this.renderer;
        var gl = renderer.gl;
        var graphics = displayObject.graphics;
        var webGLData;
        var webGL = graphics._webGL[this.CONTEXT_UID];

        if (!webGL || graphics.dirty !== webGL.dirty) {
          this.updateGraphics(graphics);
          webGL = graphics._webGL[this.CONTEXT_UID];
        }

        var shader = this.primitiveShader;
        renderer.bindShader(shader);

        for (var i = 0, n = webGL.data.length; i < n; i++) {
          webGLData = webGL.data[i];
          var shaderTemp = webGLData.shader;
          renderer.bindShader(shaderTemp);
          shaderTemp.uniforms.translationMatrix = displayObject.worldTransform.toArray(true);
          shaderTemp.uniforms.tint = _mmvis.color.hexTorgb(graphics.tint);
          shaderTemp.uniforms.alpha = graphics.worldAlpha;
          renderer.bindVao(webGLData.vao);
          webGLData.vao.draw(gl.TRIANGLE_STRIP, webGLData.indices.length);
        }
      }
    }, {
      key: "updateGraphics",
      value: function updateGraphics(graphics) {
        var gl = this.renderer.gl;
        var webGL = graphics._webGL[this.CONTEXT_UID];

        if (!webGL) {
          webGL = graphics._webGL[this.CONTEXT_UID] = {
            lastIndex: 0,
            data: [],
            gl: gl,
            clearDirty: -1,
            dirty: -1
          };
        }

        webGL.dirty = graphics.dirty;

        if (graphics.clearDirty !== webGL.clearDirty) {
          webGL.clearDirty = graphics.clearDirty;

          for (var i = 0; i < webGL.data.length; i++) {
            this.graphicsDataPool.push(webGL.data[i]);
          }

          webGL.data.length = 0;
          webGL.lastIndex = 0;
        }

        var webGLData;

        for (var _i = webGL.lastIndex; _i < graphics.graphicsData.length; _i++) {
          var data = graphics.graphicsData[_i];
          webGLData = this.getWebGLData(webGL, 0);

          if (data.type === _const.SHAPES.POLY) {
            (0, _buildPoly2["default"])(data, webGLData);
          }

          if (data.type === _const.SHAPES.RECT) {
            (0, _buildRectangle2["default"])(data, webGLData);
          } else if (data.type === _const.SHAPES.CIRC || data.type === _const.SHAPES.ELIP) {
            (0, _buildCircle2["default"])(data, webGLData);
          }

          webGL.lastIndex++;
        }

        this.renderer.bindVao(null);

        for (var _i2 = 0; _i2 < webGL.data.length; _i2++) {
          webGLData = webGL.data[_i2];

          if (webGLData.dirty) {
            webGLData.upload();
          }
        }
      }
    }, {
      key: "getWebGLData",
      value: function getWebGLData(gl, type) {
        var webGLData = gl.data[gl.data.length - 1];

        if (!webGLData || webGLData.points.length > 320000) {
          webGLData = this.graphicsDataPool.pop() || new _WebGLGraphicsData2["default"](this.renderer.gl, this.primitiveShader, this.renderer.state.attribsState);
          webGLData.reset(type);
          gl.data.push(webGLData);
        }

        webGLData.dirty = true;
        return webGLData;
      }
    }]);

    return GraphicsRenderer;
  }();

  exports.default = GraphicsRenderer;
});