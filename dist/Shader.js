"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "pixi-gl-core", "./settings"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("pixi-gl-core"), require("./settings"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pixiGlCore, global.settings);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _pixiGlCore, _settings) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

  var _settings2 = _interopRequireDefault(_settings);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var PRECISION = _settings2["default"].PRECISION;
  var GLShader = _pixiGlCore2["default"].GLShader;

  function checkPrecision(src) {
    if (src instanceof Array) {
      if (src[0].substring(0, 9) !== 'precision') {
        var copy = src.slice(0);
        copy.unshift("precision ".concat(PRECISION, " float;"));
        return copy;
      }
    } else if (src.substring(0, 9) !== 'precision') {
      return "precision ".concat(PRECISION, " float;\n").concat(src);
    }

    return src;
  }
  /**
   * Wrapper class, webGL Shader for Pixi.
   * Adds precision string if vertexSrc or fragmentSrc have no mention of it.
   *
   * @class
   * @extends GLShader
   * @memberof PIXI
   */


  var Shader = function (_GLShader) {
    _inherits(Shader, _GLShader);

    /**
     *
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {string|string[]} vertexSrc - The vertex shader source as an array of strings.
     * @param {string|string[]} fragmentSrc - The fragment shader source as an array of strings.
     */
    function Shader(gl, vertexSrc, fragmentSrc) {
      _classCallCheck(this, Shader);

      return _possibleConstructorReturn(this, _getPrototypeOf(Shader).call(this, gl, checkPrecision(vertexSrc), checkPrecision(fragmentSrc)));
    }

    return Shader;
  }(GLShader);

  exports.default = Shader;
});