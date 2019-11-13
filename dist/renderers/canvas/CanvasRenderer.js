"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../SystemRenderer", "../../const", "../../graphics/canvas/GraphicsRenderer", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../SystemRenderer"), require("../../const"), require("../../graphics/canvas/GraphicsRenderer"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.SystemRenderer, global._const, global.GraphicsRenderer, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _SystemRenderer2, _const, _GraphicsRenderer, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _SystemRenderer3 = _interopRequireDefault(_SystemRenderer2);

  var _GraphicsRenderer2 = _interopRequireDefault(_GraphicsRenderer);

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

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
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

  var CanvasRenderer = function (_SystemRenderer) {
    _inherits(CanvasRenderer, _SystemRenderer);

    function CanvasRenderer(app) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, CanvasRenderer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasRenderer).call(this, _const.RENDERER_TYPE.CANVAS, app, options));
      _this.CGR = new _GraphicsRenderer2.default(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(CanvasRenderer, [{
      key: "render",
      value: function render(app) {
        var me = this;
        me.app = app;

        _mmvis._.each(_mmvis._.values(app.convertStages), function (convertStage) {
          me.renderStage(convertStage.stage);
        });

        app.convertStages = {};
      }
    }, {
      key: "renderStage",
      value: function renderStage(stage) {
        if (!stage.ctx) {
          stage.ctx = stage.canvas.getContext("2d");
        }

        stage.stageRending = true;
        stage.setWorldTransform();

        this._clear(stage);

        this._render(stage, stage, stage.context.globalAlpha);

        stage.stageRending = false;
      }
    }, {
      key: "_render",
      value: function _render(stage, displayObject, globalAlpha) {
        var ctx = stage.ctx;

        if (!ctx) {
          return;
        }

        ;
        var $MC = displayObject.context.$model;

        if (!displayObject.worldTransform) {
          //第一次在舞台中渲染
          displayObject.fire("render");
        }

        ;

        if (!displayObject.worldTransform || displayObject._transformChange || displayObject.parent && displayObject.parent._transformChange) {
          displayObject.setWorldTransform();
          displayObject.fire("transform");
          displayObject._transformChange = true;
        }

        ;
        globalAlpha *= $MC.globalAlpha;

        if (!$MC.visible || displayObject.isClip) {
          return;
        }

        ;
        var worldMatrixArr = displayObject.worldTransform.toArray();

        if (worldMatrixArr) {
          ctx.setTransform.apply(ctx, worldMatrixArr);
        } else {
          //如果这个displayObject的世界矩阵有问题，那么就不绘制了
          return;
        }

        ;
        var isClipSave = false;

        if (displayObject.clip && displayObject.clip.graphics) {
          //如果这个对象有一个裁剪路径对象，那么就绘制这个裁剪路径
          var _clip = displayObject.clip;
          ctx.save();
          isClipSave = true;

          if (!_clip.worldTransform || _clip._transformChange || _clip.parent._transformChange) {
            _clip.setWorldTransform();

            _clip._transformChange = true;
          }

          ;
          ctx.setTransform.apply(ctx, _clip.worldTransform.toArray()); //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据

          if (!_clip.graphics.graphicsData.length) {
            //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
            _clip._draw(_clip.graphics); //_draw会完成绘制准备好 graphicsData

          }

          ;
          this.CGR.render(_clip, stage, globalAlpha, isClipSave);
          _clip._transformChange = false;
          ctx.clip();
        }

        ; //因为已经采用了setTransform了， 非shape元素已经不需要执行transform 和 render

        if (displayObject.graphics) {
          //如果 graphicsData.length==0 的情况下才需要执行_draw来组织 graphics 数据
          if (!displayObject.graphics.graphicsData.length) {
            //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
            displayObject._draw(displayObject.graphics); //_draw会完成绘制准备好 graphicsData

          }

          ; //globalAlpha == 0 的话，只是不需要render，但是graphics的graphicsData还是要计算的
          //事件检测的时候需要用到graphics.graphicsData

          if (!!globalAlpha) {
            //默认要设置为实线
            ctx.setLineDash([]); //然后如果发现这个描边非实线的话，就设置为虚线

            if ($MC.lineType && $MC.lineType != 'solid') {
              ctx.setLineDash($MC.lineDash);
            }

            ;
            this.CGR.render(displayObject, stage, globalAlpha);
          }

          ;
        }

        ;

        if (displayObject.type == "text") {
          //如果是文本
          displayObject.render(ctx, globalAlpha);
        }

        ;

        if (displayObject.children) {
          for (var i = 0, len = displayObject.children.length; i < len; i++) {
            this._render(stage, displayObject.children[i], globalAlpha);
          }
        }

        ;
        displayObject._transformChange = false;

        if (isClipSave) {
          //如果这个对象有裁剪对象， 则要恢复，裁剪之前的环境
          ctx.restore();
        }

        ;
      }
    }, {
      key: "_clear",
      value: function _clear(stage) {
        var ctx = stage.ctx;
        ctx.setTransform.apply(ctx, stage.worldTransform.toArray());
        ctx.clearRect(0, 0, this.app.width, this.app.height);
      }
    }]);

    return CanvasRenderer;
  }(_SystemRenderer3.default);

  exports.default = CanvasRenderer;
});