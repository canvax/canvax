"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./DisplayObjectContainer", "../utils/index"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./DisplayObjectContainer"), require("../utils/index"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.DisplayObjectContainer, global.index);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _DisplayObjectContainer, _index) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _DisplayObjectContainer2 = _interopRequireDefault(_DisplayObjectContainer);

  var _index2 = _interopRequireDefault(_index);

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

  var Stage = function (_DisplayObjectContain) {
    _inherits(Stage, _DisplayObjectContain);

    function Stage(opt) {
      var _this;

      _classCallCheck(this, Stage);

      opt.type = "stage";
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Stage).call(this, opt));
      _this.canvas = null;
      _this.ctx = null; //渲染的时候由renderer决定,这里不做初始值
      //stage正在渲染中

      _this.stageRending = false;
      _this._isReady = false;
      return _this;
    } //由canvax的afterAddChild 回调


    _createClass(Stage, [{
      key: "initStage",
      value: function initStage(canvas, width, height) {
        var self = this;
        self.canvas = canvas;
        var model = self.context;
        model.width = width;
        model.height = height;
        model.scaleX = _index2["default"]._devicePixelRatio;
        model.scaleY = _index2["default"]._devicePixelRatio;
        self._isReady = true;
      }
    }, {
      key: "heartBeat",
      value: function heartBeat(opt) {
        //shape , name , value , preValue 
        //displayList中某个属性改变了
        if (!this._isReady) {
          //在stage还没初始化完毕的情况下，无需做任何处理
          return;
        }

        ;
        opt || (opt = {}); //如果opt为空，说明就是无条件刷新

        opt.stage = this; //TODO临时先这么处理

        this.parent && this.parent.heartBeat(opt);
      }
    }]);

    return Stage;
  }(_DisplayObjectContainer2["default"]);

  exports.default = Stage;
});