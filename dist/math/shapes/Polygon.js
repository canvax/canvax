"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../const"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../const"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._const);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _const) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

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

  var Polygon = function () {
    function Polygon() {
      for (var _len = arguments.length, points = new Array(_len), _key = 0; _key < _len; _key++) {
        points[_key] = arguments[_key];
      }

      _classCallCheck(this, Polygon);

      var point_0 = points[0];

      if (Array.isArray(point_0)) {
        points = point_0;
      }

      if (point_0 && "x" in point_0 && "y" in point_0) {
        var p = [];

        for (var i = 0, il = points.length; i < il; i++) {
          p.push(points[i].x, points[i].y);
        }

        points = p;
      }

      this.closed = true;
      this.points = points;
      this.type = _const.SHAPES.POLY;
    }

    _createClass(Polygon, [{
      key: "clone",
      value: function clone() {
        return new Polygon(this.points.slice());
      }
    }, {
      key: "close",
      value: function close() {
        var points = this.points;

        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
          points.push(points[0], points[1]);
        }

        this.closed = true;
      }
    }, {
      key: "contains",
      value: function contains(x, y) {
        return this._isInsidePolygon_WindingNumber(x, y);
      }
    }, {
      key: "_isInsidePolygon_WindingNumber",
      value: function _isInsidePolygon_WindingNumber(x, y) {
        var points = this.points;
        var wn = 0;

        for (var shiftP, shift = points[1] > y, i = 3; i < points.length; i += 2) {
          shiftP = shift;
          shift = points[i] > y;

          if (shiftP != shift) {
            var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);

            if (n * ((points[i - 3] - x) * (points[i - 0] - y) - (points[i - 2] - y) * (points[i - 1] - x)) > 0) {
              wn += n;
            }
          }

          ;
        }

        ;
        return wn;
      }
    }]);

    return Polygon;
  }();

  exports.default = Polygon;
});