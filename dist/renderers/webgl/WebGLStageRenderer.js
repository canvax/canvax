"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils/RenderTarget", "./WebGLState", "pixi-gl-core", "../../const", "../../settings", "../../graphics/webgl/GraphicsRenderer"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils/RenderTarget"), require("./WebGLState"), require("pixi-gl-core"), require("../../const"), require("../../settings"), require("../../graphics/webgl/GraphicsRenderer"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.RenderTarget, global.WebGLState, global.pixiGlCore, global._const, global.settings, global.GraphicsRenderer);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _RenderTarget, _WebGLState, _pixiGlCore, _const, _settings, _GraphicsRenderer) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _RenderTarget2 = _interopRequireDefault(_RenderTarget);

  var _WebGLState2 = _interopRequireDefault(_WebGLState);

  var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

  var _settings2 = _interopRequireDefault(_settings);

  var _GraphicsRenderer2 = _interopRequireDefault(_GraphicsRenderer);

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

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  var CONTEXT_UID = 0;

  var WebGLStageRenderer = function () {
    function WebGLStageRenderer(stage, app) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, WebGLStageRenderer);

      this.type = _const.RENDERER_TYPE.WEBGL;
      this.width = app.width;
      this.height = app.height;
      this.canvas = stage.canvas;
      /*
      * WebGL程序必须有一个用于处理上下文丢失（Lost Context）的机制
      * 导致上下文丢失的原因：
      * 移动设备电力不足
      * 其他外因导致GPU重置
      * 当浏览器标签页处于后台时，浏览器抛弃了上下文
      * 耗费资源过多，浏览器抛弃了上下文
      */

      this.handleContextLost = this.handleContextLost.bind(this);
      this.handleContextRestored = this.handleContextRestored.bind(this);
      this.canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
      this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);
      this._backgroundColorRgba = [0, 0, 0, 0];
      this._contextOptions = {
        alpha: options.transparent,
        antialias: options.antialias,
        premultipliedAlpha: options.transparent && options.transparent !== 'notMultiplied',
        stencil: true,
        preserveDrawingBuffer: options.preserveDrawingBuffer
      };
      this.gl = options.context || _pixiGlCore2["default"].createContext(this.canvas, this._contextOptions);
      this.CONTEXT_UID = CONTEXT_UID++;
      this.state = new _WebGLState2["default"](this.gl);
      this._activeShader = null;
      this._activeVao = null;
      this._activeRenderTarget = null;
      this.drawModes = this.mapWebGLDrawModes();
      this.webglGR = new _GraphicsRenderer2["default"](this);

      this._initContext();
    }

    _createClass(WebGLStageRenderer, [{
      key: "_initContext",
      value: function _initContext() {
        var gl = this.gl; // restore a context if it was previously lost

        if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context').restoreContext();
        }

        this.state.resetToDefault();
        this.rootRenderTarget = new _RenderTarget2["default"](gl, this.width, this.height, _settings2["default"].RESOLUTION, true);
        this.rootRenderTarget.clearColor = this._backgroundColorRgba;
        this.bindRenderTarget(this.rootRenderTarget);
        this.webglGR.onContextChange();
      }
    }, {
      key: "render",
      value: function render(displayObject, stage) {
        if (!this.gl || this.gl.isContextLost()) {
          return;
        }

        this.webglGR.render(displayObject, stage);
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        this.rootRenderTarget.resize(width, height);

        if (this._activeRenderTarget === this.rootRenderTarget) {
          this.rootRenderTarget.activate();

          if (this._activeShader) {
            this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(true);
          }
        }
      }
    }, {
      key: "clear",
      value: function clear(clearColor) {
        this._activeRenderTarget.clear(clearColor);
      }
    }, {
      key: "bindRenderTarget",
      value: function bindRenderTarget(renderTarget) {
        if (renderTarget !== this._activeRenderTarget) {
          this._activeRenderTarget = renderTarget;
          renderTarget.activate();

          if (this._activeShader) {
            this._activeShader.uniforms.projectionMatrix = renderTarget.projectionMatrix.toArray(true);
          }
        }

        return this;
      }
    }, {
      key: "bindShader",
      value: function bindShader(shader) {
        if (this._activeShader !== shader) {
          this._activeShader = shader;
          shader.bind();
          shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
        }

        return this;
      }
    }, {
      key: "createVao",
      value: function createVao() {
        return new _pixiGlCore2["default"].VertexArrayObject(this.gl, this.state.attribState);
      }
    }, {
      key: "bindVao",
      value: function bindVao(vao) {
        if (this._activeVao === vao) {
          return this;
        }

        if (vao) {
          vao.bind();
        } else if (this._activeVao) {
          this._activeVao.unbind();
        }

        this._activeVao = vao;
        return this;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._activeShader = null;
        this._activeRenderTarget = this.rootRenderTarget;
        this.rootRenderTarget.activate();
        this.state.resetToDefault();
        return this;
      }
    }, {
      key: "handleContextLost",
      value: function handleContextLost(event) {
        event.preventDefault();
      }
    }, {
      key: "handleContextRestored",
      value: function handleContextRestored() {
        this._initContext();

        this.textureManager.removeAll();
      }
    }, {
      key: "mapWebGLDrawModes",
      value: function mapWebGLDrawModes() {
        var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        object[_const.DRAW_MODES.POINTS] = this.gl.POINTS;
        object[_const.DRAW_MODES.LINES] = this.gl.LINES;
        object[_const.DRAW_MODES.LINE_LOOP] = this.gl.LINE_LOOP;
        object[_const.DRAW_MODES.LINE_STRIP] = this.gl.LINE_STRIP;
        object[_const.DRAW_MODES.TRIANGLES] = this.gl.TRIANGLES;
        object[_const.DRAW_MODES.TRIANGLE_STRIP] = this.gl.TRIANGLE_STRIP;
        object[_const.DRAW_MODES.TRIANGLE_FAN] = this.gl.TRIANGLE_FAN;
        return object;
      }
    }, {
      key: "destroy",
      value: function destroy(removeView) {
        this.destroyPlugins();
        this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);
        this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);

        _get(_getPrototypeOf(WebGLStageRenderer.prototype), "destroy", this).call(this, removeView);

        this.uid = 0;
        this.handleContextLost = null;
        this.handleContextRestored = null;
        this._contextOptions = null;
        this.gl.useProgram(null);

        if (this.gl.getExtension('WEBGL_lose_context')) {
          this.gl.getExtension('WEBGL_lose_context').loseContext();
        }

        this.gl = null;
      }
    }]);

    return WebGLStageRenderer;
  }();

  exports.default = WebGLStageRenderer;
});