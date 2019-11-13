"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./buildLine", "mmvis", "earcut"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./buildLine"), require("mmvis"), require("earcut"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.buildLine, global.mmvis, global.earcut);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _buildLine, _mmvis, _earcut) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildPoly;

  var _buildLine2 = _interopRequireDefault(_buildLine);

  var _earcut2 = _interopRequireDefault(_earcut);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function buildPoly(graphicsData, webGLData) {
    graphicsData.points = graphicsData.shape.points.slice();
    var points = graphicsData.points;

    if (graphicsData.hasFill() && graphicsData.fillAlpha && points.length >= 6) {
      var holeArray = [];
      var holes = graphicsData.holes;

      for (var i = 0; i < holes.length; i++) {
        var hole = holes[i];
        holeArray.push(points.length / 2);
        points = points.concat(hole.points);
      }

      var verts = webGLData.points;
      var indices = webGLData.indices;
      var length = points.length / 2;

      var _color = _color.hexTorgb(graphicsData.fillStyle);

      var alpha = graphicsData.fillAlpha;
      var r = _color[0] * alpha;
      var g = _color[1] * alpha;
      var b = _color[2] * alpha;
      var triangles = (0, _earcut2.default)(points, holeArray, 2);

      if (!triangles) {
        return;
      }

      var vertPos = verts.length / 6;

      for (var _i = 0; _i < triangles.length; _i += 3) {
        indices.push(triangles[_i] + vertPos);
        indices.push(triangles[_i] + vertPos);
        indices.push(triangles[_i + 1] + vertPos);
        indices.push(triangles[_i + 2] + vertPos);
        indices.push(triangles[_i + 2] + vertPos);
      }

      for (var _i2 = 0; _i2 < length; _i2++) {
        verts.push(points[_i2 * 2], points[_i2 * 2 + 1], r, g, b, alpha);
      }
    }

    if (graphicsData.hasLine() && graphicsData.strokeAlpha) {
      (0, _buildLine2.default)(graphicsData, webGLData);
    }
  }
});