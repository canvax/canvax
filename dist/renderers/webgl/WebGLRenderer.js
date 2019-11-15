"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../SystemRenderer", "../../const", "../../settings", "./WebGLStageRenderer", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../SystemRenderer"), require("../../const"), require("../../settings"), require("./WebGLStageRenderer"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.SystemRenderer, global._const, global.settings, global.WebGLStageRenderer, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _SystemRenderer2, _const, _settings, _WebGLStageRenderer, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _SystemRenderer3 = _interopRequireDefault(_SystemRenderer2);

  var _settings2 = _interopRequireDefault(_settings);

  var _WebGLStageRenderer2 = _interopRequireDefault(_WebGLStageRenderer);

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

  var WebGLRenderer = function (_SystemRenderer) {
    _inherits(WebGLRenderer, _SystemRenderer);

    function WebGLRenderer(app) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, WebGLRenderer);

      return _possibleConstructorReturn(this, _getPrototypeOf(WebGLRenderer).call(this, _const.RENDERER_TYPE.CANVAS, app, options));
    }

    _createClass(WebGLRenderer, [{
      key: "render",
      value: function render(app) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var me = this;
        me.app = app;

        _mmvis._.extend(this.options, options);

        _mmvis._.each(_mmvis._.values(app.convertStages), function (convertStage) {
          me.renderStage(convertStage.stage);
        });

        app.convertStages = {};
      }
    }, {
      key: "renderStage",
      value: function renderStage(stage) {
        if (!stage.webGLStageRenderer) {
          stage.webGLStageRenderer = new _WebGLStageRenderer2["default"](stage, app, this.options);
        }

        ;
        stage.stageRending = true;

        this._clear(stage);

        this._render(stage);

        stage.stageRending = false;
      }
    }, {
      key: "_render",
      value: function _render(stage, displayObject) {
        if (!displayObject) {
          displayObject = stage;
        }

        ;

        if (displayObject.graphics) {
          if (!displayObject.context.$model.visible || displayObject.context.$model.globalAlpha <= 0) {
            return;
          }

          ;

          if (!displayObject.graphics.graphicsData.length) {
            displayObject._draw(displayObject.graphics);
          }

          ;
          stage.webGLStageRenderer.render(displayObject, stage);
        }

        ;

        if (displayObject.children) {
          for (var i = 0, len = displayObject.children.length; i < len; i++) {
            this._render(stage, displayObject.children[i]);
          }
        }

        ;
      }
    }, {
      key: "_clear",
      value: function _clear(stage) {
        stage.webGLStageRenderer.clear();
      }
    }]);

    return WebGLRenderer;
  }(_SystemRenderer3["default"]);

  exports.default = WebGLRenderer;
});