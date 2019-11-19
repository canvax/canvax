"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./buildLine", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./buildLine"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.buildLine, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _buildLine, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = buildRectangle;

  var _buildLine2 = _interopRequireDefault(_buildLine);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function buildRectangle(graphicsData, webGLData) {
    var rectData = graphicsData.shape;
    var x = rectData.x;
    var y = rectData.y;
    var width = rectData.width;
    var height = rectData.height;

    if (graphicsData.hasFill() && graphicsData.fillAlpha) {
      var _color = _color.hexTorgb(graphicsData.fillStyle);

      var alpha = graphicsData.fillAlpha;
      var r = _color[0] * alpha;
      var g = _color[1] * alpha;
      var b = _color[2] * alpha;
      var verts = webGLData.points;
      var indices = webGLData.indices;
      var vertPos = verts.length / 6; // start

      verts.push(x, y);
      verts.push(r, g, b, alpha);
      verts.push(x + width, y);
      verts.push(r, g, b, alpha);
      verts.push(x, y + height);
      verts.push(r, g, b, alpha);
      verts.push(x + width, y + height);
      verts.push(r, g, b, alpha); // insert 2 dead triangles..

      indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
    }

    if (graphicsData.hasLine() && graphicsData.strokeAlpha) {
      var tempPoints = graphicsData.points;
      graphicsData.points = [x, y, x + width, y, x + width, y + height, x, y + height, x, y];
      (0, _buildLine2["default"])(graphicsData, webGLData);
      graphicsData.points = tempPoints;
    }
  }
});