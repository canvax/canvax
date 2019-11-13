"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../const", "../settings", "../animation/AnimationFrame", "../utils/index", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../const"), require("../settings"), require("../animation/AnimationFrame"), require("../utils/index"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._const, global.settings, global.AnimationFrame, global.index, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _const, _settings, _AnimationFrame, _index, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _settings2 = _interopRequireDefault(_settings);

  var _AnimationFrame2 = _interopRequireDefault(_AnimationFrame);

  var _index2 = _interopRequireDefault(_index);

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

  var SystemRenderer = function () {
    function SystemRenderer() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _const.RENDERER_TYPE.UNKNOWN;
      var app = arguments.length > 1 ? arguments[1] : undefined;
      var options = arguments.length > 2 ? arguments[2] : undefined;

      _classCallCheck(this, SystemRenderer);

      this.type = type; //2canvas,1webgl

      this.app = app;

      if (options) {
        for (var i in _settings2.default.RENDER_OPTIONS) {
          if (typeof options[i] === 'undefined') {
            options[i] = _settings2.default.RENDER_OPTIONS[i];
          }
        }
      } else {
        options = _settings2.default.RENDER_OPTIONS;
      }

      this.options = options;
      this.requestAid = null;
      this._heartBeat = false; //心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

      this._preRenderTime = 0;
    } //如果引擎处于静默状态的话，就会启动


    _createClass(SystemRenderer, [{
      key: "startEnter",
      value: function startEnter() {
        var self = this;

        if (!self.requestAid) {
          self.requestAid = _AnimationFrame2.default.registFrame({
            id: "enterFrame",
            //同时肯定只有一个enterFrame的task
            task: function task() {
              self.enterFrame.apply(self);
            }
          });
        }
      }
    }, {
      key: "enterFrame",
      value: function enterFrame() {
        var self = this; //不管怎么样，enterFrame执行了就要把
        //requestAid null 掉

        self.requestAid = null;
        _index2.default.now = new Date().getTime();

        if (self._heartBeat) {
          //var _begin = new Date().getTime();
          this.app.children.length && self.render(this.app); //var _end = new Date().getTime();
          //$(document.body).append( "<br />render："+ (_end - _begin) );

          self._heartBeat = false; //渲染完了，打上最新时间挫

          self._preRenderTime = new Date().getTime();
        }

        ;
      }
    }, {
      key: "_convertCanvax",
      value: function _convertCanvax(opt) {
        var me = this;

        _mmvis._.each(me.app.children, function (stage) {
          stage.context[opt.name] = opt.value;
        });
      }
    }, {
      key: "heartBeat",
      value: function heartBeat(opt) {
        //displayList中某个属性改变了
        var self = this;

        if (opt) {
          //心跳包有两种，一种是某元素的可视属性改变了。一种是children有变动
          //分别对应convertType  为 context  and children
          if (opt.convertType == "context") {
            var stage = opt.stage;
            var shape = opt.shape;
            var name = opt.name;
            var value = opt.value;
            var preValue = opt.preValue;

            if (shape.type == "canvax") {
              self._convertCanvax(opt);
            } else {
              if (!self.app.convertStages[stage.id]) {
                self.app.convertStages[stage.id] = {
                  stage: stage,
                  convertShapes: {}
                };
              }

              ;

              if (shape) {
                if (!self.app.convertStages[stage.id].convertShapes[shape.id]) {
                  self.app.convertStages[stage.id].convertShapes[shape.id] = {
                    shape: shape,
                    convertType: opt.convertType
                  };
                } else {
                  //如果已经上报了该 shape 的心跳。
                  return;
                }
              }
            }

            ;
          }

          ;

          if (opt.convertType == "children") {
            //元素结构变化，比如addchild removeChild等
            var target = opt.target;
            var stage = opt.src.getStage();

            if (stage || target.type == "stage") {
              //如果操作的目标元素是Stage
              stage = stage || target;

              if (!self.app.convertStages[stage.id]) {
                self.app.convertStages[stage.id] = {
                  stage: stage,
                  convertShapes: {}
                };
              }
            }
          }

          if (!opt.convertType) {
            //无条件要求刷新
            var stage = opt.stage;

            if (!self.app.convertStages[stage.id]) {
              self.app.convertStages[stage.id] = {
                stage: stage,
                convertShapes: {}
              };
            }
          }
        } else {
          //无条件要求全部刷新，一般用在resize等。
          _mmvis._.each(self.app.children, function (stage, i) {
            self.app.convertStages[stage.id] = {
              stage: stage,
              convertShapes: {}
            };
          });
        }

        ;

        if (!self._heartBeat) {
          //如果发现引擎在静默状态，那么就唤醒引擎
          self._heartBeat = true;
          self.startEnter();
        } else {
          //否则智慧继续确认心跳
          self._heartBeat = true;
        }
      }
    }]);

    return SystemRenderer;
  }();

  exports.default = SystemRenderer;
});