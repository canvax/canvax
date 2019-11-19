"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.undefined = mod.exports;
  }
})(void 0, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var GraphicsData = function () {
    function GraphicsData(lineWidth, strokeStyle, strokeAlpha, fillStyle, fillAlpha, shape) {
      _classCallCheck(this, GraphicsData);

      this.lineWidth = lineWidth;
      this.strokeStyle = strokeStyle;
      this.strokeAlpha = strokeAlpha;
      this.fillStyle = fillStyle;
      this.fillAlpha = fillAlpha;
      this.shape = shape;
      this.type = shape.type;
      this.holes = []; //这两个可以被后续修改， 具有一票否决权
      //比如polygon的 虚线描边。必须在fill的poly上面设置line为false

      this.fill = true;
      this.line = true;
    }

    _createClass(GraphicsData, [{
      key: "clone",
      value: function clone() {
        var cloneGraphicsData = new GraphicsData(this.lineWidth, this.strokeStyle, this.strokeAlpha, this.fillStyle, this.fillAlpha, this.shape);
        cloneGraphicsData.fill = this.fill;
        cloneGraphicsData.line = this.line;
        return cloneGraphicsData;
      }
    }, {
      key: "addHole",
      value: function addHole(shape) {
        this.holes.push(shape);
      }
    }, {
      key: "synsStyle",
      value: function synsStyle(style) {
        //console.log("line:"+this.line+"__fill:"+this.fill)
        //从shape中把绘图需要的style属性同步过来
        if (this.line) {
          this.lineWidth = style.lineWidth;
          this.strokeStyle = style.strokeStyle;
          this.strokeAlpha = style.strokeAlpha;
        }

        if (this.fill) {
          this.fillStyle = style.fillStyle;
          this.fillAlpha = style.fillAlpha;
        }
      }
    }, {
      key: "hasFill",
      value: function hasFill() {
        return this.fillStyle && this.fill && this.shape.closed !== undefined && this.shape.closed;
      }
    }, {
      key: "hasLine",
      value: function hasLine() {
        return this.strokeStyle && this.lineWidth && this.line;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.shape = null;
        this.holes = null;
      }
    }]);

    return GraphicsData;
  }();

  exports.default = GraphicsData;
});