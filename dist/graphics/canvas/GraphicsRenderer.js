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

  var CanvasGraphicsRenderer = function () {
    function CanvasGraphicsRenderer(renderer) {
      _classCallCheck(this, CanvasGraphicsRenderer);

      this.renderer = renderer;
    }
    /**
    * @param displayObject
    * @stage 也可以displayObject.getStage()获取。
    */


    _createClass(CanvasGraphicsRenderer, [{
      key: "render",
      value: function render(displayObject, stage, globalAlpha, isClip) {
        var renderer = this.renderer;
        var graphicsData = displayObject.graphics.graphicsData;
        var ctx = stage.ctx;

        for (var i = 0; i < graphicsData.length; i++) {
          var data = graphicsData[i];
          var shape = data.shape;
          var fillStyle = data.fillStyle;
          var strokeStyle = data.strokeStyle;
          var fill = data.hasFill() && data.fillAlpha && !isClip;
          var line = data.hasLine() && data.strokeAlpha && !isClip;
          ctx.lineWidth = data.lineWidth;

          if (data.type === _const.SHAPES.POLY) {
            //只第一次需要beginPath()
            ctx.beginPath();
            this.renderPolygon(shape.points, shape.closed, ctx, isClip);

            if (fill) {
              ctx.globalAlpha = data.fillAlpha * globalAlpha;
              ctx.fillStyle = fillStyle;
              ctx.fill();
            }

            if (line) {
              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
              ctx.strokeStyle = strokeStyle;
              ctx.stroke();
            }
          } else if (data.type === _const.SHAPES.RECT) {
            if (isClip) {
              //ctx.beginPath();
              //rect本身已经是个close的path
              ctx.rect(shape.x, shape.y, shape.width, shape.height); //ctx.closePath();
            }

            ;

            if (fill) {
              ctx.globalAlpha = data.fillAlpha * globalAlpha;
              ctx.fillStyle = fillStyle;
              ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
            }

            if (line) {
              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
              ctx.strokeStyle = strokeStyle;
              ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
          } else if (data.type === _const.SHAPES.CIRC) {
            // TODO - 这里应该可以不需要走graphics，而直接设置好radius
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.closePath();

            if (fill) {
              ctx.globalAlpha = data.fillAlpha * globalAlpha;
              ctx.fillStyle = fillStyle;
              ctx.fill();
            }

            if (line) {
              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
              ctx.strokeStyle = strokeStyle;
              ctx.stroke();
            }
          } else if (data.type === _const.SHAPES.ELIP) {
            var w = shape.width * 2;
            var h = shape.height * 2;
            var x = shape.x - w / 2;
            var y = shape.y - h / 2;
            ctx.beginPath();
            var kappa = 0.5522848;
            var ox = w / 2 * kappa; // control point offset horizontal

            var oy = h / 2 * kappa; // control point offset vertical

            var xe = x + w; // x-end

            var ye = y + h; // y-end

            var xm = x + w / 2; // x-middle

            var ym = y + h / 2; // y-middle

            ctx.moveTo(x, ym);
            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            ctx.closePath();

            if (fill) {
              ctx.globalAlpha = data.fillAlpha * globalAlpha;
              ctx.fillStyle = fillStyle;
              ctx.fill();
            }

            if (line) {
              ctx.globalAlpha = data.strokeAlpha * globalAlpha;
              ctx.strokeStyle = strokeStyle;
              ctx.stroke();
            }
          }
        }
      }
    }, {
      key: "renderPolygon",
      value: function renderPolygon(points, close, ctx, isClip) {
        ctx.moveTo(points[0], points[1]);

        for (var j = 1; j < points.length / 2; ++j) {
          ctx.lineTo(points[j * 2], points[j * 2 + 1]);
        }

        if (close || isClip) {
          ctx.closePath();
        }
      }
    }]);

    return CanvasGraphicsRenderer;
  }();

  exports.default = CanvasGraphicsRenderer;
});