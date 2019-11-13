"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mmvis", "../geom/Matrix", "./Point", "../utils/index", "../animation/AnimationFrame", "../utils/observe", "../const", "../geom/InsideLine", "../settings"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mmvis"), require("../geom/Matrix"), require("./Point"), require("../utils/index"), require("../animation/AnimationFrame"), require("../utils/observe"), require("../const"), require("../geom/InsideLine"), require("../settings"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mmvis, global.Matrix, global.Point, global.index, global.AnimationFrame, global.observe, global._const, global.InsideLine, global.settings);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _mmvis, _Matrix, _Point, _index, _AnimationFrame, _observe, _const, _InsideLine, _settings) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _Matrix2 = _interopRequireDefault(_Matrix);

  var _Point2 = _interopRequireDefault(_Point);

  var _index2 = _interopRequireDefault(_index);

  var _AnimationFrame2 = _interopRequireDefault(_AnimationFrame);

  var _observe2 = _interopRequireDefault(_observe);

  var _InsideLine2 = _interopRequireDefault(_InsideLine);

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

  var DisplayObject = function (_event$Dispatcher) {
    _inherits(DisplayObject, _event$Dispatcher);

    function DisplayObject(opt) {
      var _this;

      _classCallCheck(this, DisplayObject);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayObject).call(this, opt)); //相对父级元素的矩阵

      _this._transform = null;
      _this.worldTransform = null; //_transform如果有修改，则_transformChange为true，renderer的时候worldTransform

      _this._transformChange = false; //心跳次数

      _this._heartBeatNum = 0; //元素对应的stage元素

      _this.stage = null; //元素的父元素

      _this.parent = null;
      _this.xyToInt = "xyToInt" in opt ? opt.xyToInt : true; //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

      _this.moveing = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

      _this.clip = null; //裁剪的图形对象
      //创建好context

      _this.context = _this._createContext(opt);
      _this.type = opt.type || "DisplayObject";
      _this.id = opt.id || _index2.default.createId(_this.type);
      _this._trackList = []; //一个元素可以追踪另外元素的变动

      _this.init.apply(_assertThisInitialized(_this), arguments); //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform


      _this._updateTransform();

      _this._tweens = [];

      var me = _assertThisInitialized(_this);

      _this.on("destroy", function () {
        me.cleanAnimates();
      });

      return _this;
    }

    _createClass(DisplayObject, [{
      key: "init",
      value: function init() {}
    }, {
      key: "clipTo",
      value: function clipTo(node) {
        this.clip = node;
        node.isClip = true;
      }
    }, {
      key: "_createContext",
      value: function _createContext(opt) {
        var self = this;
        var optCtx = opt.context || {};
        var _contextATTRS = {
          width: optCtx.width || 0,
          height: optCtx.height || 0,
          x: optCtx.x || 0,
          y: optCtx.y || 0,
          scaleX: optCtx.scaleX || 1,
          scaleY: optCtx.scaleY || 1,
          scaleOrigin: optCtx.scaleOrigin || {
            x: 0,
            y: 0
          },
          rotation: optCtx.rotation || 0,
          rotateOrigin: optCtx.rotateOrigin || {
            x: 0,
            y: 0
          },
          visible: optCtx.visible || true,
          globalAlpha: optCtx.globalAlpha || 1 //样式部分迁移到shape中

        }; //平凡的clone数据非常的耗时，还是走回原来的路
        //var _contextATTRS = _.extend( true , _.clone(CONTEXT_DEFAULT), opt.context );

        _mmvis._.extend(true, _contextATTRS, opt.context); //有些引擎内部设置context属性的时候是不用上报心跳的，比如做热点检测的时候


        self._notWatch = false; //不需要发心跳信息

        self._noHeart = false; //_contextATTRS.$owner = self;

        _contextATTRS.$watch = function (name, value, preValue) {
          //下面的这些属性变化，都会需要重新组织矩阵属性 _transform 
          var obj = self; //this.$owner;

          if (!obj.context) {
            //如果这个obj的context已经不存在了，那么就什么都不处理，
            //TODO:后续还要把自己给destroy 并且要把在 动画队列里面的动画也干掉
            return;
          }

          if (name == "globalGalpha") {
            obj._globalAlphaChange = true;
          }

          ;

          if (_mmvis._.indexOf(_const.TRANSFORM_PROPS, name) > -1) {
            obj._updateTransform();

            obj._transformChange = true;
          }

          ;

          if (obj._notWatch) {
            return;
          }

          ;

          if (obj.$watch) {
            //执行的内部$watch的时候必须把_notWatch 设置为true，否则会死循环调用
            obj._notWatch = true;
            obj.$watch(name, value, preValue);
            obj._notWatch = false;
          }

          ;

          if (obj._noHeart) {
            return;
          }

          ;
          obj.heartBeat({
            convertType: "context",
            shape: obj,
            name: name,
            value: value,
            preValue: preValue
          });
        }; //执行init之前，应该就根据参数，把context组织好线


        return (0, _observe2.default)(_contextATTRS);
      }
    }, {
      key: "track",
      value: function track(el) {
        if (_mmvis._.indexOf(this._trackList, el) == -1) {
          this._trackList.push(el);
        }
      }
    }, {
      key: "untrack",
      value: function untrack(el) {
        var ind = _mmvis._.indexOf(this._trackList, el);

        if (ind > -1) {
          this._trackList.splice(ind, 1);
        }

        ;
      }
    }, {
      key: "clone",
      value: function clone(myself) {
        var conf = {
          id: this.id,
          context: _mmvis._.clone(this.context.$model),
          isClone: true
        };
        var newObj;

        if (this.type == 'text') {
          newObj = new this.constructor(this.text, conf);
        } else {
          newObj = new this.constructor(conf);
        }

        newObj.id = conf.id;

        if (this.children) {
          newObj.children = this.children;
        }

        if (this.graphics) {
          newObj.graphics = this.graphics.clone();
        }

        if (!myself) {
          newObj.id = _index2.default.createId(newObj.type);
        }

        ;
        return newObj;
      }
    }, {
      key: "heartBeat",
      value: function heartBeat(opt) {
        //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
        //的属性，所以，通知到stage.displayAttrHasChange
        var stage = this.getStage();

        if (stage) {
          this._heartBeatNum++;
          stage.heartBeat && stage.heartBeat(opt);
        }
      }
    }, {
      key: "getCurrentWidth",
      value: function getCurrentWidth() {
        return Math.abs(this.context.$model.width * this.context.$model.scaleX);
      }
    }, {
      key: "getCurrentHeight",
      value: function getCurrentHeight() {
        return Math.abs(this.context.$model.height * this.context.$model.scaleY);
      }
    }, {
      key: "getStage",
      value: function getStage() {
        if (this.stage) {
          return this.stage;
        }

        ;
        var p = this;

        if (p.type != "stage") {
          while (p.parent) {
            p = p.parent;

            if (p.type == "stage") {
              break;
            }
          }

          ;

          if (p.type !== "stage") {
            //如果得到的顶点display 的type不是Stage,也就是说不是stage元素
            //那么只能说明这个p所代表的顶端display 还没有添加到displayList中，也就是没有没添加到
            //stage舞台的childen队列中，不在引擎渲染范围内
            return false;
          }
        } //一直回溯到顶层object， 即是stage， stage的parent为null


        this.stage = p;
        return p;
      }
    }, {
      key: "localToGlobal",
      value: function localToGlobal(point, container) {
        !point && (point = new _Point2.default(0, 0));
        var cm = this.getConcatenatedMatrix(container);
        if (cm == null) return (0, _Point2.default)(0, 0);
        var m = new _Matrix2.default(1, 0, 0, 1, point.x, point.y);
        m.concat(cm);
        return new _Point2.default(m.tx, m.ty); //{x:m.tx, y:m.ty};
      }
    }, {
      key: "globalToLocal",
      value: function globalToLocal(point, container) {
        !point && (point = new _Point2.default(0, 0));

        if (this.type == "stage") {
          return point;
        }

        var cm = this.getConcatenatedMatrix(container);
        if (cm == null) return new _Point2.default(0, 0); //{x:0, y:0};

        cm.invert();
        var m = new _Matrix2.default(1, 0, 0, 1, point.x, point.y);
        m.concat(cm);
        return new _Point2.default(m.tx, m.ty); //{x:m.tx, y:m.ty};
      }
    }, {
      key: "localToTarget",
      value: function localToTarget(point, target) {
        var p = localToGlobal(point);
        return target.globalToLocal(p);
      }
    }, {
      key: "getConcatenatedMatrix",
      value: function getConcatenatedMatrix(container) {
        var cm = new _Matrix2.default();

        for (var o = this; o != null; o = o.parent) {
          cm.concat(o._transform);

          if (!o.parent || container && o.parent && o.parent == container || o.parent && o.parent.type == "stage") {
            //if( o.type == "stage" || (o.parent && container && o.parent.type == container.type ) ) {
            return cm; //break;
          }
        }

        return cm;
      }
    }, {
      key: "setEventEnable",
      value: function setEventEnable(bool) {
        if (_mmvis._.isBoolean(bool)) {
          this._eventEnabled = bool;
          return true;
        }

        ;
        return false;
      }
    }, {
      key: "getIndex",
      value: function getIndex() {
        if (!this.parent) {
          return;
        }

        ;
        return _mmvis._.indexOf(this.parent.children, this);
      }
    }, {
      key: "toBack",
      value: function toBack(num) {
        if (!this.parent) {
          return;
        }

        var fromIndex = this.getIndex();
        var toIndex = 0;

        if (_mmvis._.isNumber(num)) {
          if (num == 0) {
            //原地不动
            return;
          }

          ;
          toIndex = fromIndex - num;
        }

        var me = this.parent.children.splice(fromIndex, 1)[0];

        if (toIndex < 0) {
          toIndex = 0;
        }

        ;
        this.parent.addChildAt(me, toIndex);
      }
    }, {
      key: "toFront",
      value: function toFront(num) {
        if (!this.parent) {
          return;
        }

        var fromIndex = this.getIndex();
        var pcl = this.parent.children.length;
        var toIndex = pcl;

        if (_mmvis._.isNumber(num)) {
          if (num == 0) {
            //原地不动
            return;
          }

          toIndex = fromIndex + num + 1;
        }

        var me = this.parent.children.splice(fromIndex, 1)[0];

        if (toIndex > pcl) {
          toIndex = pcl;
        }

        this.parent.addChildAt(me, toIndex - 1);
      }
    }, {
      key: "_updateTransform",
      value: function _updateTransform() {
        var _transform = new _Matrix2.default();

        _transform.identity();

        var context = this.context; //是否需要scale

        if (context.scaleX !== 1 || context.scaleY !== 1) {
          //如果有缩放
          //缩放的原点坐标
          var origin = new _Point2.default(context.scaleOrigin);

          _transform.translate(-origin.x, -origin.y);

          _transform.scale(context.scaleX, context.scaleY);

          _transform.translate(origin.x, origin.y);
        }

        ;
        var rotation = context.rotation;

        if (rotation) {
          //如果有旋转
          //旋转的原点坐标
          var origin = new _Point2.default(context.rotateOrigin);

          _transform.translate(-origin.x, -origin.y);

          _transform.rotate(rotation % 360 * Math.PI / 180);

          _transform.translate(origin.x, origin.y);
        }

        ; //如果有位移

        var x, y;

        if (this.xyToInt && !this.moveing) {
          //当这个元素在做轨迹运动的时候，比如drag，animation如果实时的调整这个x ， y
          //那么该元素的轨迹会有跳跃的情况发生。所以加个条件过滤，
          var x = parseInt(context.x);
          var y = parseInt(context.y);

          if (parseInt(context.lineWidth, 10) % 2 == 1 && context.strokeStyle) {
            x += 0.5;
            y += 0.5;
          }
        } else {
          x = context.x;
          y = context.y;
        }

        ;

        if (x != 0 || y != 0) {
          _transform.translate(x, y);
        }

        ;
        this._transform = _transform;
        return _transform;
      }
    }, {
      key: "setWorldTransform",
      value: function setWorldTransform() {
        var cm = new _Matrix2.default();
        cm.concat(this._transform);
        this.parent && cm.concat(this.parent.worldTransform);
        this.worldTransform = cm;
        return this.worldTransform;
      }
    }, {
      key: "getChildInPoint",
      value: function getChildInPoint(point) {
        var result = false; //检测的结果
        //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
        //if( this.type != "stage" && this.parent && this.parent.type != "stage" ) {
        //    point = this.parent.globalToLocal( point );
        //};
        //var m = new Matrix( Settings.RESOLUTION, 0, 0, Settings.RESOLUTION, point.x , point.y);
        //m.concat( this.worldTransform );

        var x = point.x;
        var y = point.y; //对鼠标的坐标也做相同的变换

        if (this.worldTransform) {
          var inverseMatrix = this.worldTransform.clone().invert();
          var originPos = [x * _settings2.default.RESOLUTION, y * _settings2.default.RESOLUTION];
          originPos = inverseMatrix.mulVector(originPos);
          x = originPos[0];
          y = originPos[1];
        }

        ;

        if (this.graphics) {
          result = this.containsPoint({
            x: x,
            y: y
          });
        }

        ;

        if (this.type == "text") {
          //文本框的先单独处理
          var _rect = this.getRect();

          if (!_rect.width || !_rect.height) {
            return false;
          }

          ; //正式开始第一步的矩形范围判断

          if (x >= _rect.x && x <= _rect.x + _rect.width && (_rect.height >= 0 && y >= _rect.y && y <= _rect.y + _rect.height || _rect.height < 0 && y <= _rect.y && y >= _rect.y + _rect.height)) {
            //那么就在这个元素的矩形范围内
            result = true;
          } else {
            //如果连矩形内都不是，那么肯定的，这个不是我们要找的shap
            result = false;
          }

          ;
          return result;
        }

        ;
        return result;
      }
    }, {
      key: "containsPoint",
      value: function containsPoint(point) {
        var inside = false;

        for (var i = 0; i < this.graphics.graphicsData.length; ++i) {
          var data = this.graphics.graphicsData[i];

          if (data.shape) {
            //先检测fill， fill的检测概率大些。
            //像circle,ellipse这样的shape 就直接把lineWidth算在fill里面计算就好了，所以他们是没有insideLine的
            if (data.hasFill() && data.shape.contains(point.x, point.y)) {
              inside = true;

              if (inside) {
                break;
              }
            } //circle,ellipse等就没有points


            if (data.hasLine() && data.shape.points) {
              //然后检测是否和描边碰撞
              inside = (0, _InsideLine2.default)(data, point.x, point.y);

              if (inside) {
                break;
              }
            }
          }
        }

        return inside;
      }
    }, {
      key: "animate",
      value: function animate(toContent, options, context) {
        if (!context) {
          context = this.context;
        }

        ;

        if (!context) {
          //这个时候如果还是找不到context说明这个 el 已经被destroy了
          return;
        }

        ;
        var to = toContent;
        var from = null;

        for (var p in to) {
          if (_mmvis._.isObject(to[p])) {
            //options必须传递一份copy出去，比如到下一个animate
            this.animate(to[p], _mmvis._.extend({}, options), context[p]); //如果是个object

            continue;
          }

          ; //if( isNaN(to[p]) && to[p] !== '' && to[p] !== null && to[p] !== undefined ){

          if (isNaN(to[p]) && to[p] !== '' && to[p] !== null) {
            //undefined已经被isNaN过滤了
            //只有number才能继续走下去执行tween，而非number则直接赋值完事，
            //TODO:不能用_.isNumber 因为 '1212' 这样的其实可以计算
            context[p] = to[p];
            delete to[p];
            continue;
          }

          ;

          if (!from) {
            from = {};
          }

          ;
          from[p] = context[p];
        }

        ;

        if (!from) {
          //这里很重要，不能删除。 
          //比如line.animate({start:{x:0,y:0}} , {duration:500});
          //那么递归到start的时候  from 的值依然为null
          //如果这个时候继续执行的话，会有很严重的bug
          //line.context.start 会 被赋值了 line对象上的所有属性，严重的bug
          return;
        }

        ;
        !options && (options = {});
        options.from = from;
        options.to = to;
        var self = this;

        var upFun = function upFun() {};

        if (options.onUpdate) {
          upFun = options.onUpdate;
        }

        ;
        var tween;

        options.onUpdate = function (status) {
          //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
          if (!context && tween) {
            _AnimationFrame2.default.destroyTween(tween);

            tween = null;
            return;
          }

          ;

          for (var p in status) {
            context[p] = status[p];
          }

          ;
          upFun.apply(self, [status]);
        };

        var compFun = function compFun() {};

        if (options.onComplete) {
          compFun = options.onComplete;
        }

        ;

        options.onComplete = function (status) {
          compFun.apply(self, arguments);

          self._removeTween(tween);
        };

        options.onStop = function () {
          self._removeTween(tween);
        };

        options.desc = "tweenType:DisplayObject.animate__id:" + this.id + "__objectType:" + this.type;
        tween = _AnimationFrame2.default.registTween(options);

        this._tweens.push(tween);

        return tween;
      }
    }, {
      key: "_removeTween",
      value: function _removeTween(tween) {
        for (var i = 0; i < this._tweens.length; i++) {
          if (tween == this._tweens[i]) {
            this._tweens.splice(i, 1);

            break;
          }
        }
      }
    }, {
      key: "removeAnimate",
      value: function removeAnimate(animate) {
        animate.stop();

        this._removeTween(animate);
      }
    }, {
      key: "cleanAnimates",
      value: function cleanAnimates() {
        this._cleanAnimates();
      }
    }, {
      key: "_cleanAnimates",
      value: function _cleanAnimates() {
        while (this._tweens.length) {
          this._tweens.shift().stop();
        }

        ;
      }
    }, {
      key: "remove",
      value: function remove() {
        if (this.parent) {
          this.parent.removeChild(this);
          this.parent = null;
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._destroy();
      }
    }, {
      key: "_destroy",
      value: function _destroy() {
        this.remove();
        this.fire("destroy"); //把自己从父节点中删除了后做自我清除，释放内存

        this.context = null;
        delete this.context;
      }
    }]);

    return DisplayObject;
  }(_mmvis.event.Dispatcher);

  exports.default = DisplayObject;
});