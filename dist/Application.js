"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils/index", "./display/DisplayObjectContainer", "./display/Stage", "./renderers/autoRenderer", "./geom/Matrix", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils/index"), require("./display/DisplayObjectContainer"), require("./display/Stage"), require("./renderers/autoRenderer"), require("./geom/Matrix"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.DisplayObjectContainer, global.Stage, global.autoRenderer, global.Matrix, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _index, _DisplayObjectContainer, _Stage, _autoRenderer, _Matrix, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _index2 = _interopRequireDefault(_index);

  var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

  var _Stage2 = _interopRequireDefault(_Stage);

  var _autoRenderer2 = _interopRequireDefault(_autoRenderer);

  var _Matrix2 = _interopRequireDefault(_Matrix);

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

  var Application = function (_DisplayObjectContain) {
    _inherits(Application, _DisplayObjectContain);

    function Application(opt) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Application);

      opt.type = "canvax";
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Application).call(this, opt));
      _this._cid = new Date().getTime() + "_" + Math.floor(Math.random() * 100);
      _this.el = _mmvis.$.query(opt.el);
      _this.width = parseInt("width" in opt || _this.el.offsetWidth, 10);
      _this.height = parseInt("height" in opt || _this.el.offsetHeight, 10);

      var viewObj = _mmvis.$.createView(_this.width, _this.height, _this._cid);

      _this.view = viewObj.view;
      _this.stageView = viewObj.stageView;
      _this.domView = viewObj.domView;
      _this.el.innerHTML = "";

      _this.el.appendChild(_this.view);

      _this.viewOffset = _mmvis.$.offset(_this.view);
      _this.lastGetRO = 0; //最后一次获取 viewOffset 的时间

      _this.webGL = opt.webGL;
      _this.renderer = (0, _autoRenderer2.default)(_assertThisInitialized(_this), options);
      _this.event = null; //该属性在systenRender里面操作，每帧由心跳上报的 需要重绘的stages 列表

      _this.convertStages = {};
      _this.context.$model.width = _this.width;
      _this.context.$model.height = _this.height; //然后创建一个用于绘制激活 shape 的 stage 到activation

      _this._bufferStage = null;

      _this._creatHoverStage(); //设置一个默认的matrix做为app的世界根节点坐标


      _this.worldTransform = new _Matrix2.default().identity();
      return _this;
    }

    _createClass(Application, [{
      key: "registEvent",
      value: function registEvent(opt) {
        //初始化事件委托到root元素上面
        this.event = new _mmvis.event.Handler(this, opt);
        ;
        this.event.init();
        return this.event;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        for (var i = 0, l = this.children.length; i < l; i++) {
          var stage = this.children[i];
          stage.destroy();
          stage.canvas = null;
          stage.ctx = null;
          stage = null;
          i--, l--;
        }

        ;

        try {
          this.view.removeChild(this.stageView);
          this.view.removeChild(this.domView);
          this.el.removeChild(this.view);
        } catch (e) {}

        ;
        this.el.innerHTML = "";
        this.event = null;
        this._bufferStage = null;
      }
    }, {
      key: "resize",
      value: function resize(opt) {
        //重新设置坐标系统 高宽 等。
        this.width = parseInt(opt && "width" in opt || this.el.offsetWidth, 10);
        this.height = parseInt(opt && "height" in opt || this.el.offsetHeight, 10); //this.view  width height都一直设置为100%
        //this.view.style.width  = this.width +"px";
        //this.view.style.height = this.height+"px";

        this.viewOffset = _mmvis.$.offset(this.view);
        this.context.$model.width = this.width;
        this.context.$model.height = this.height;
        var me = this;

        var reSizeCanvas = function reSizeCanvas(canvas) {
          canvas.style.width = me.width + "px";
          canvas.style.height = me.height + "px";
          canvas.setAttribute("width", me.width * _index2.default._devicePixelRatio);
          canvas.setAttribute("height", me.height * _index2.default._devicePixelRatio);
        };

        _mmvis._.each(this.children, function (s, i) {
          s.context.$model.width = me.width;
          s.context.$model.height = me.height;
          reSizeCanvas(s.canvas);
        });

        this.stageView.style.width = this.width + "px";
        this.stageView.style.height = this.height + "px";
        this.domView.style.width = this.width + "px";
        this.domView.style.height = this.height + "px";
        this.heartBeat();
      }
    }, {
      key: "getHoverStage",
      value: function getHoverStage() {
        return this._bufferStage;
      }
    }, {
      key: "_creatHoverStage",
      value: function _creatHoverStage() {
        //TODO:创建stage的时候一定要传入width height  两个参数
        this._bufferStage = new _Stage2.default({
          id: "activCanvas" + new Date().getTime(),
          context: {
            width: this.context.$model.width,
            height: this.context.$model.height
          }
        }); //该stage不参与事件检测

        this._bufferStage._eventEnabled = false;
        this.addChild(this._bufferStage);
      }
    }, {
      key: "updateViewOffset",
      value: function updateViewOffset() {
        var now = new Date().getTime();

        if (now - this.lastGetRO > 1000) {
          this.viewOffset = _mmvis.$.offset(this.view);
          this.lastGetRO = now;
        }
      }
    }, {
      key: "_afterAddChild",
      value: function _afterAddChild(stage, index) {
        var canvas;

        if (!stage.canvas) {
          canvas = _mmvis.$.createCanvas(this.context.$model.width, this.context.$model.height, stage.id);
        } else {
          canvas = stage.canvas;
        }

        if (this.children.length == 1) {
          this.stageView.appendChild(canvas);
        } else if (this.children.length > 1) {
          if (index === undefined) {
            //如果没有指定位置，那么就放到 _bufferStage 的下面。
            this.stageView.insertBefore(canvas, this._bufferStage.canvas);
          } else {
            //如果有指定的位置，那么就指定的位置来
            if (index >= this.children.length - 1) {
              this.stageView.appendChild(canvas);
            } else {
              this.stageView.insertBefore(canvas, this.children[index].canvas);
            }
          }
        }

        ;

        _index2.default.initElement(canvas);

        stage.initStage(canvas, this.context.$model.width, this.context.$model.height);
      }
    }, {
      key: "_afterDelChild",
      value: function _afterDelChild(stage) {
        try {
          this.stageView.removeChild(stage.canvas);
        } catch (error) {}
      }
    }, {
      key: "heartBeat",
      value: function heartBeat(opt) {
        if (this.children.length > 0) {
          this.renderer.heartBeat(opt);
        }
      }
    }, {
      key: "toDataURL",
      value: function toDataURL() {
        var canvas = _mmvis.$.createCanvas(this.width, this.height, "curr_base64_canvas");

        var ctx = canvas.getContext("2d");

        _mmvis._.each(this.children, function (stage) {
          ctx.drawImage(stage.canvas, 0, 0);
        });

        return canvas.toDataURL();
      }
    }]);

    return Application;
  }(_DisplayObjectContainer2.default);

  exports.default = Application;
});