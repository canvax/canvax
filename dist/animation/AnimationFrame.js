"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@tweenjs/tween.js", "../utils/index", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@tweenjs/tween.js"), require("../utils/index"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tween, global.index, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _tween, _index, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _tween2 = _interopRequireDefault(_tween);

  var _index2 = _interopRequireDefault(_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  //import Tween from "./Tween"

  /**
   * 设置 AnimationFrame begin
   */
  var lastTime = 0;
  var requestAnimationFrame, cancelAnimationFrame;

  if (typeof window !== 'undefined') {
    requestAnimationFrame = window.requestAnimationFrame;
    cancelAnimationFrame = window.cancelAnimationFrame;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      requestAnimationFrame = window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      cancelAnimationFrame = window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    ;
  }

  ;

  if (!requestAnimationFrame) {
    requestAnimationFrame = function requestAnimationFrame(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  ;

  if (!cancelAnimationFrame) {
    cancelAnimationFrame = function cancelAnimationFrame(id) {
      clearTimeout(id);
    };
  }

  ; //管理所有图表的渲染任务

  var _taskList = []; //[{ id : task: }...]

  var _requestAid = null;

  function enabledAnimationFrame() {
    if (!_requestAid) {
      _requestAid = requestAnimationFrame(function () {
        //console.log("frame__" + _taskList.length);
        //if ( Tween.getAll().length ) {
        _tween2.default.update(); //tween自己会做length判断
        //};


        var currTaskList = _taskList;
        _taskList = [];
        _requestAid = null;

        while (currTaskList.length > 0) {
          currTaskList.shift().task();
        }

        ;
      });
    }

    ;
    return _requestAid;
  }

  ;
  /*
   * @param task 要加入到渲染帧队列中的任务
   * @result frameid
   */

  function registFrame($frame) {
    if (!$frame) {
      return;
    }

    ;

    _taskList.push($frame);

    return enabledAnimationFrame();
  }

  ;
  /*
   *  @param task 要从渲染帧队列中删除的任务
   */

  function destroyFrame($frame) {
    var d_result = false;

    for (var i = 0, l = _taskList.length; i < l; i++) {
      if (_taskList[i].id === $frame.id) {
        d_result = true;

        _taskList.splice(i, 1);

        i--;
        l--;
      }

      ;
    }

    ;

    if (_taskList.length == 0) {
      cancelAnimationFrame(_requestAid);
      _requestAid = null;
    }

    ;
    return d_result;
  }

  ;
  /* 
   * @param opt {from , to , onUpdate , onComplete , ......}
   * @result tween
   */

  function registTween(options) {
    var opt = _mmvis._.extend({
      from: null,
      to: null,
      duration: 500,
      onStart: function onStart() {},
      onUpdate: function onUpdate() {},
      onComplete: function onComplete() {},
      onStop: function onStop() {},
      repeat: 0,
      delay: 0,
      easing: 'Linear.None',
      desc: '' //动画描述，方便查找bug

    }, options);

    if (!_mmvis.global.getAnimationEnabled()) {
      //如果全局动画被禁用，那么下面两项强制设置为0
      //TODO:其实应该直接执行回调函数的
      opt.duration = 0;
      opt.delay = 0;
    }

    ;
    var tween = {};

    var tid = "tween_" + _index2.default.getUID();

    opt.id && (tid = tid + "_" + opt.id);

    if (opt.from && opt.to) {
      var animate = function animate() {
        if (tween._isCompleteed || tween._isStoped) {
          tween = null;
          return;
        }

        ;
        registFrame({
          id: tid,
          task: animate,
          desc: opt.desc,
          tween: tween
        });
      };

      tween = new _tween2.default.Tween(opt.from).to(opt.to, opt.duration).onStart(function () {
        //opt.onStart.apply( this )
        opt.onStart(opt.from);
      }).onUpdate(function () {
        //opt.onUpdate.apply( this );
        opt.onUpdate(opt.from);
      }).onComplete(function () {
        destroyFrame({
          id: tid
        });
        tween._isCompleteed = true; //opt.onComplete.apply( this , [this] ); //执行用户的conComplete

        opt.onComplete(opt.from);
      }).onStop(function () {
        destroyFrame({
          id: tid
        });
        tween._isStoped = true; //opt.onStop.apply( this , [this] );

        opt.onStop(opt.from);
      }).repeat(opt.repeat).delay(opt.delay).easing(_tween2.default.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]]);
      tween.id = tid;
      tween.start();
      ;
      animate();
    }

    ;
    return tween;
  }

  ;
  /*
   * @param tween
   * @result void(0)
   */

  function destroyTween(tween, msg) {
    tween.stop();
  }

  ;
  exports.default = {
    registFrame: registFrame,
    destroyFrame: destroyFrame,
    registTween: registTween,
    destroyTween: destroyTween,
    Tween: _tween2.default,
    taskList: _taskList
  };
});