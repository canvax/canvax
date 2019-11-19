"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./GraphicsData", "../math/index", "../const", "./utils/bezierCurveTo", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./GraphicsData"), require("../math/index"), require("../const"), require("./utils/bezierCurveTo"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.GraphicsData, global.index, global._const, global.bezierCurveTo, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _GraphicsData, _index, _const, _bezierCurveTo2, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _GraphicsData2 = _interopRequireDefault(_GraphicsData);

  var _bezierCurveTo3 = _interopRequireDefault(_bezierCurveTo2);

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

  var Graphics = function () {
    function Graphics(shape) {
      _classCallCheck(this, Graphics);

      this.lineWidth = 1;
      this.strokeStyle = null;
      this.strokeAlpha = 1;
      this.fillStyle = null;
      this.fillAlpha = 1; //比如path m 0 0 l 0 0 m 1 1 l 1 1
      //就会有两条graphicsData数据产生

      this.graphicsData = [];
      this.currentPath = null;
      this.dirty = 0; //用于检测图形对象是否已更改。 如果这是设置为true，那么图形对象将被重新计算。

      this.clearDirty = 0; //用于检测我们是否清除了图形webGL数据

      this._webGL = {};
      this.worldAlpha = 1;
      this.tint = 0xFFFFFF; //目标对象附加颜色

      this.Bound = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    _createClass(Graphics, [{
      key: "setStyle",
      value: function setStyle(context) {
        //从 shape 中把绘图需要的style属性同步过来
        var model = context.$model;
        this.lineWidth = model.lineWidth;
        this.strokeStyle = model.strokeStyle;
        this.strokeAlpha = model.strokeAlpha * model.globalAlpha;
        this.fillStyle = model.fillStyle;
        this.fillAlpha = model.fillAlpha * model.globalAlpha;
        var g = this; //一般都是先设置好style的，所以 ， 当后面再次设置新的style的时候
        //会把所有的data都修改
        //TODO: 后面需要修改, 能精准的确定是修改 graphicsData 中的哪个data

        if (this.graphicsData.length) {
          _mmvis._.each(this.graphicsData, function (gd, i) {
            gd.synsStyle(g);
          });
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        var clone = new Graphics();
        clone.dirty = 0; // copy graphics data

        for (var i = 0; i < this.graphicsData.length; ++i) {
          clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];
        return clone;
      }
    }, {
      key: "moveTo",
      value: function moveTo(x, y) {
        var shape = new _index.Polygon([x, y]);
        shape.closed = false;
        this.drawShape(shape);
        return this;
      }
    }, {
      key: "lineTo",
      value: function lineTo(x, y) {
        if (this.currentPath) {
          this.currentPath.shape.points.push(x, y);
          this.dirty++;
        } else {
          this.moveTo(0, 0);
        }

        return this;
      }
    }, {
      key: "quadraticCurveTo",
      value: function quadraticCurveTo(cpX, cpY, toX, toY) {
        if (this.currentPath) {
          if (this.currentPath.shape.points.length === 0) {
            this.currentPath.shape.points = [0, 0];
          }
        } else {
          this.moveTo(0, 0);
        }

        var n = 20;
        var points = this.currentPath.shape.points;
        var xa = 0;
        var ya = 0;

        if (points.length === 0) {
          this.moveTo(0, 0);
        }

        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];

        for (var i = 1; i <= n; ++i) {
          var j = i / n;
          xa = fromX + (cpX - fromX) * j;
          ya = fromY + (cpY - fromY) * j;
          points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
        }

        this.dirty++;
        return this;
      }
    }, {
      key: "bezierCurveTo",
      value: function bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
        if (this.currentPath) {
          if (this.currentPath.shape.points.length === 0) {
            this.currentPath.shape.points = [0, 0];
          }
        } else {
          this.moveTo(0, 0);
        }

        var points = this.currentPath.shape.points;
        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];
        points.length -= 2;
        (0, _bezierCurveTo3["default"])(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);
        this.dirty++;
        return this;
      }
    }, {
      key: "arcTo",
      value: function arcTo(x1, y1, x2, y2, radius) {
        if (this.currentPath) {
          if (this.currentPath.shape.points.length === 0) {
            this.currentPath.shape.points.push(x1, y1);
          }
        } else {
          this.moveTo(x1, y1);
        }

        var points = this.currentPath.shape.points;
        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];
        var a1 = fromY - y1;
        var b1 = fromX - x1;
        var a2 = y2 - y1;
        var b2 = x2 - x1;
        var mm = Math.abs(a1 * b2 - b1 * a2);

        if (mm < 1.0e-8 || radius === 0) {
          if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
            points.push(x1, y1);
          }
        } else {
          var dd = a1 * a1 + b1 * b1;
          var cc = a2 * a2 + b2 * b2;
          var tt = a1 * a2 + b1 * b2;
          var k1 = radius * Math.sqrt(dd) / mm;
          var k2 = radius * Math.sqrt(cc) / mm;
          var j1 = k1 * tt / dd;
          var j2 = k2 * tt / cc;
          var cx = k1 * b2 + k2 * b1;
          var cy = k1 * a2 + k2 * a1;
          var px = b1 * (k2 + j1);
          var py = a1 * (k2 + j1);
          var qx = b2 * (k1 + j2);
          var qy = a2 * (k1 + j2);
          var startAngle = Math.atan2(py - cy, px - cx);
          var endAngle = Math.atan2(qy - cy, qx - cx);
          this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
        }

        this.dirty++;
        return this;
      }
    }, {
      key: "arc",
      value: function arc(cx, cy, radius, startAngle, endAngle) {
        var anticlockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        if (startAngle === endAngle) {
          return this;
        }

        if (!anticlockwise && endAngle <= startAngle) {
          endAngle += Math.PI * 2;
        } else if (anticlockwise && startAngle <= endAngle) {
          startAngle += Math.PI * 2;
        }

        var sweep = endAngle - startAngle;
        var segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 48;

        if (sweep === 0) {
          return this;
        }

        var startX = cx + Math.cos(startAngle) * radius;
        var startY = cy + Math.sin(startAngle) * radius; // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.

        var points = this.currentPath ? this.currentPath.shape.points : null;

        if (points) {
          if (points[points.length - 2] !== startX || points[points.length - 1] !== startY) {
            points.push(startX, startY);
          }
        } else {
          this.moveTo(startX, startY);
          points = this.currentPath.shape.points;
        }

        var theta = sweep / (segs * 2);
        var theta2 = theta * 2;
        var cTheta = Math.cos(theta);
        var sTheta = Math.sin(theta);
        var segMinus = segs - 1;
        var remainder = segMinus % 1 / segMinus;

        for (var i = 0; i <= segMinus; ++i) {
          var real = i + remainder * i;
          var angle = theta + startAngle + theta2 * real;
          var c = Math.cos(angle);
          var s = -Math.sin(angle);
          points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
        }

        this.dirty++;
        return this;
      }
    }, {
      key: "drawRect",
      value: function drawRect(x, y, width, height) {
        this.drawShape(new _index.Rectangle(x, y, width, height));
        return this;
      }
    }, {
      key: "drawCircle",
      value: function drawCircle(x, y, radius) {
        this.drawShape(new _index.Circle(x, y, radius));
        return this;
      }
    }, {
      key: "drawEllipse",
      value: function drawEllipse(x, y, width, height) {
        this.drawShape(new _index.Ellipse(x, y, width, height));
        return this;
      }
    }, {
      key: "drawPolygon",
      value: function drawPolygon(path) {
        // prevents an argument assignment deopt
        // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        var points = path;
        var closed = true;

        if (points instanceof _index.Polygon) {
          closed = points.closed;
          points = points.points;
        }

        if (!Array.isArray(points)) {
          // prevents an argument leak deopt
          // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
          points = new Array(arguments.length);

          for (var i = 0; i < points.length; ++i) {
            points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
          }
        }

        var shape = new _index.Polygon(points);
        shape.closed = closed;
        this.drawShape(shape);
        return this;
      }
    }, {
      key: "clear",
      value: function clear() {
        if (this.graphicsData.length > 0) {
          this.dirty++;
          this.clearDirty++;
          this.graphicsData.length = 0;
        }

        this.currentPath = null;
        return this;
      }
    }, {
      key: "drawShape",
      value: function drawShape(shape) {
        if (this.currentPath) {
          if (this.currentPath.shape.points.length <= 2) {
            this.graphicsData.pop();
          }
        } //this.currentPath = null;


        this.beginPath();
        var data = new _GraphicsData2["default"](this.lineWidth, this.strokeStyle, this.strokeAlpha, this.fillStyle, this.fillAlpha, shape);
        this.graphicsData.push(data);

        if (data.type === _const.SHAPES.POLY) {
          data.shape.closed = data.shape.closed;
          this.currentPath = data;
        }

        this.dirty++;
        return data;
      }
    }, {
      key: "beginPath",
      value: function beginPath() {
        this.currentPath = null;
      }
    }, {
      key: "closePath",
      value: function closePath() {
        var currentPath = this.currentPath;

        if (currentPath && currentPath.shape) {
          currentPath.shape.close();
        }

        return this;
      }
    }, {
      key: "updateLocalBounds",
      value: function updateLocalBounds() {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;

        if (this.graphicsData.length) {
          var shape = 0;
          var x = 0;
          var y = 0;
          var w = 0;
          var h = 0;

          for (var i = 0; i < this.graphicsData.length; i++) {
            var data = this.graphicsData[i];
            var type = data.type;
            var lineWidth = data.lineWidth;
            shape = data.shape;

            if (type === _const.SHAPES.RECT || type === _const.SHAPES.RREC) {
              x = shape.x - lineWidth / 2;
              y = shape.y - lineWidth / 2;
              w = shape.width + lineWidth;
              h = shape.height + lineWidth;
              minX = x < minX ? x : minX;
              maxX = x + w > maxX ? x + w : maxX;
              minY = y < minY ? y : minY;
              maxY = y + h > maxY ? y + h : maxY;
            } else if (type === _const.SHAPES.CIRC) {
              x = shape.x;
              y = shape.y;
              w = shape.radius + lineWidth / 2;
              h = shape.radius + lineWidth / 2;
              minX = x - w < minX ? x - w : minX;
              maxX = x + w > maxX ? x + w : maxX;
              minY = y - h < minY ? y - h : minY;
              maxY = y + h > maxY ? y + h : maxY;
            } else if (type === _const.SHAPES.ELIP) {
              x = shape.x;
              y = shape.y;
              w = shape.width + lineWidth / 2;
              h = shape.height + lineWidth / 2;
              minX = x - w < minX ? x - w : minX;
              maxX = x + w > maxX ? x + w : maxX;
              minY = y - h < minY ? y - h : minY;
              maxY = y + h > maxY ? y + h : maxY;
            } else {
              // POLY
              var points = shape.points;
              var x2 = 0;
              var y2 = 0;
              var dx = 0;
              var dy = 0;
              var rw = 0;
              var rh = 0;
              var cx = 0;
              var cy = 0;

              for (var j = 0; j + 2 < points.length; j += 2) {
                x = points[j];
                y = points[j + 1];
                x2 = points[j + 2];
                y2 = points[j + 3];
                dx = Math.abs(x2 - x);
                dy = Math.abs(y2 - y);
                h = lineWidth;
                w = Math.sqrt(dx * dx + dy * dy);

                if (w < 1e-9) {
                  continue;
                }

                rw = (h / w * dy + dx) / 2;
                rh = (h / w * dx + dy) / 2;
                cx = (x2 + x) / 2;
                cy = (y2 + y) / 2;
                minX = cx - rw < minX ? cx - rw : minX;
                maxX = cx + rw > maxX ? cx + rw : maxX;
                minY = cy - rh < minY ? cy - rh : minY;
                maxY = cy + rh > maxY ? cy + rh : maxY;
              }
            }
          }
        } else {
          minX = 0;
          maxX = 0;
          minY = 0;
          maxY = 0;
        }

        this.Bound = {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
        return this;
      }
    }, {
      key: "getBound",
      value: function getBound() {
        return this.updateLocalBounds().Bound;
      }
    }, {
      key: "destroy",
      value: function destroy(options) {
        for (var i = 0; i < this.graphicsData.length; ++i) {
          this.graphicsData[i].destroy();
        }

        for (var id in this._webGL) {
          for (var j = 0; j < this._webGL[id].data.length; ++j) {
            this._webGL[id].data[j].destroy();
          }
        }

        this.graphicsData = null;
        this.currentPath = null;
        this._webGL = null;
      }
    }]);

    return Graphics;
  }();

  exports.default = Graphics;
});