"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./buildLine", "../../../const", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./buildLine"), require("../../../const"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.buildLine, global._const, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _buildLine, _const, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildCircle;

  var _buildLine2 = _interopRequireDefault(_buildLine);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function buildCircle(graphicsData, webGLData) {
    var circleData = graphicsData.shape;
    var x = circleData.x;
    var y = circleData.y;
    var width;
    var height;

    if (graphicsData.type === _const.SHAPES.CIRC) {
      width = circleData.radius;
      height = circleData.radius;
    } else {
      width = circleData.width;
      height = circleData.height;
    }

    var totalSegs = Math.floor(30 * Math.sqrt(circleData.radius)) || Math.floor(15 * Math.sqrt(circleData.width + circleData.height));
    var seg = Math.PI * 2 / totalSegs;

    if (graphicsData.hasFill() && graphicsData.fillAlpha) {
      var _color = _color.hexTorgb(graphicsData.fillStyle);

      var alpha = graphicsData.fillAlpha;
      var r = _color[0] * alpha;
      var g = _color[1] * alpha;
      var b = _color[2] * alpha;
      var verts = webGLData.points;
      var indices = webGLData.indices;
      var vecPos = verts.length / 6;
      indices.push(vecPos);

      for (var i = 0; i < totalSegs + 1; i++) {
        verts.push(x, y, r, g, b, alpha);
        verts.push(x + Math.sin(seg * i) * width, y + Math.cos(seg * i) * height, r, g, b, alpha);
        indices.push(vecPos++, vecPos++);
      }

      indices.push(vecPos - 1);
    }

    if (graphicsData.hasLine() && graphicsData.strokeAlpha) {
      var tempPoints = graphicsData.points;
      graphicsData.points = [];

      for (var _i = 0; _i < totalSegs + 1; _i++) {
        graphicsData.points.push(x + Math.sin(seg * _i) * width, y + Math.cos(seg * _i) * height);
      }

      (0, _buildLine2["default"])(graphicsData, webGLData);
      graphicsData.points = tempPoints;
    }
  }
});