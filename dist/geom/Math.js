"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../geom/SmoothSpline", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../geom/SmoothSpline"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.SmoothSpline, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _SmoothSpline, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _SmoothSpline2 = _interopRequireDefault(_SmoothSpline);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * Canvax
   *
   * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
   *
   * 数学 类
   *
   **/
  var _cache = {
    sin: {},
    //sin缓存
    cos: {} //cos缓存

  };

  var _radians = Math.PI / 180;
  /**
   * @param angle 弧度（角度）参数
   * @param isDegrees angle参数是否为角度计算，默认为false，angle为以弧度计量的角度
   */


  function sin(angle, isDegrees) {
    angle = (isDegrees ? angle * _radians : angle).toFixed(4);

    if (typeof _cache.sin[angle] == 'undefined') {
      _cache.sin[angle] = Math.sin(angle);
    }

    return _cache.sin[angle];
  }
  /**
   * @param radians 弧度参数
   */


  function cos(angle, isDegrees) {
    angle = (isDegrees ? angle * _radians : angle).toFixed(4);

    if (typeof _cache.cos[angle] == 'undefined') {
      _cache.cos[angle] = Math.cos(angle);
    }

    return _cache.cos[angle];
  }
  /**
   * 角度转弧度
   * @param {Object} angle
   */


  function degreeToRadian(angle) {
    return angle * _radians;
  }
  /**
   * 弧度转角度
   * @param {Object} angle
   */


  function radianToDegree(angle) {
    return angle / _radians;
  }
  /*
   * 校验角度到360度内
   * @param {angle} number
   */


  function degreeTo360(angle) {
    var reAng = (360 + angle % 360) % 360; //Math.abs(360 + Math.ceil( angle ) % 360) % 360;

    if (reAng == 0 && angle !== 0) {
      reAng = 360;
    }

    return reAng;
  }

  function getIsgonPointList(n, r) {
    var pointList = [];
    var dStep = 2 * Math.PI / n;
    var beginDeg = -Math.PI / 2;
    var deg = beginDeg;

    for (var i = 0, end = n; i < end; i++) {
      pointList.push([r * Math.cos(deg), r * Math.sin(deg)]);
      deg += dStep;
    }

    ;
    return pointList;
  }

  function getSmoothPointList(pList, smoothFilter) {
    //smoothFilter -- 比如在折线图中。会传一个smoothFilter过来做point的纠正。
    //让y不能超过底部的原点
    var List = [];
    var Len = pList.length;
    var _currList = [];

    _mmvis._.each(pList, function (point, i) {
      if (isNotValibPoint(point)) {
        //undefined , [ number, null] 等结构
        if (_currList.length) {
          List = List.concat(_getSmoothGroupPointList(_currList, smoothFilter));
          _currList = [];
        }

        List.push(point);
      } else {
        //有效的point 都push 进_currList 准备做曲线设置
        _currList.push(point);
      }

      ;

      if (i == Len - 1) {
        if (_currList.length) {
          List = List.concat(_getSmoothGroupPointList(_currList, smoothFilter));
          _currList = [];
        }
      }
    });

    return List;
  }

  function _getSmoothGroupPointList(pList, smoothFilter) {
    var obj = {
      points: pList
    };

    if (_mmvis._.isFunction(smoothFilter)) {
      obj.smoothFilter = smoothFilter;
    }

    var currL = (0, _SmoothSpline2["default"])(obj);

    if (pList && pList.length > 0) {
      currL.push(pList[pList.length - 1]);
    }

    ;
    return currL;
  }

  function isNotValibPoint(point) {
    var res = !point || _mmvis._.isArray(point) && point.length >= 2 && (!_mmvis._.isNumber(point[0]) || !_mmvis._.isNumber(point[1])) || "x" in point && !_mmvis._.isNumber(point.x) || "y" in point && !_mmvis._.isNumber(point.y);
    return res;
  }

  function isValibPoint(point) {
    return !isNotValibPoint(point);
  }

  exports["default"] = {
    PI: Math.PI,
    sin: sin,
    cos: cos,
    degreeToRadian: degreeToRadian,
    radianToDegree: radianToDegree,
    degreeTo360: degreeTo360,
    getIsgonPointList: getIsgonPointList,
    getSmoothPointList: getSmoothPointList,
    isNotValibPoint: isNotValibPoint,
    isValibPoint: isValibPoint
  };
});