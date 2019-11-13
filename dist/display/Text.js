"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./DisplayObject", "../utils/index", "mmvis"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./DisplayObject"), require("../utils/index"), require("mmvis"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.DisplayObject, global.index, global.mmvis);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _DisplayObject2, _index, _mmvis) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

  var _index2 = _interopRequireDefault(_index);

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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
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

  var Text = function (_DisplayObject) {
    _inherits(Text, _DisplayObject);

    function Text(text, opt) {
      var _this;

      _classCallCheck(this, Text);

      opt.type = "text";

      if (text === null || text === undefined) {
        text = "";
      }

      ;
      opt.context = _mmvis._.extend({
        font: "",
        fontSize: 13,
        //字体大小默认13
        fontWeight: "normal",
        fontFamily: "微软雅黑,sans-serif",
        textBaseline: "top",
        textAlign: "left",
        textDecoration: null,
        fillStyle: 'blank',
        strokeStyle: null,
        lineWidth: 0,
        lineHeight: 1.2,
        backgroundColor: null,
        textBackgroundColor: null
      }, opt.context);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, opt));
      _this._reNewline = /\r?\n/;
      _this.fontProperts = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"];
      _this.context.font = _this._getFontDeclaration();
      _this.text = text.toString();
      _this.context.width = _this.getTextWidth();
      _this.context.height = _this.getTextHeight();
      return _this;
    }

    _createClass(Text, [{
      key: "$watch",
      value: function $watch(name, value, preValue) {
        //context属性有变化的监听函数
        if (_mmvis._.indexOf(this.fontProperts, name) >= 0) {
          this.context[name] = value; //如果修改的是font的某个内容，就重新组装一遍font的值，
          //然后通知引擎这次对context的修改上报心跳

          this.context.font = this._getFontDeclaration();
          this.context.width = this.getTextWidth();
          this.context.height = this.getTextHeight();
        }
      }
    }, {
      key: "_setContextStyle",
      value: function _setContextStyle(ctx, style, globalAlpha) {
        // 简单判断不做严格类型检测
        for (var p in style) {
          if (p != "textBaseline" && p in ctx) {
            if (style[p] || _mmvis._.isNumber(style[p])) {
              if (p == "globalAlpha") {
                //透明度要从父节点继承
                //ctx[p] = style[p] * globalAlpha; //render里面已经做过相乘了，不需要重新*
                ctx.globalAlpha = globalAlpha;
              } else {
                ctx[p] = style[p];
              }
            }
          }
        }

        ;
        return;
      }
    }, {
      key: "render",
      value: function render(ctx, globalAlpha) {
        this._renderText(ctx, this._getTextLines(), globalAlpha);
      }
    }, {
      key: "resetText",
      value: function resetText(text) {
        this.text = text.toString();
        this.heartBeat();
      }
    }, {
      key: "getTextWidth",
      value: function getTextWidth() {
        var width = 0;

        if (_index2.default._pixelCtx) {
          _index2.default._pixelCtx.save();

          _index2.default._pixelCtx.font = this.context.$model.font;
          width = this._getTextWidth(_index2.default._pixelCtx, this._getTextLines());

          _index2.default._pixelCtx.restore();
        }

        ;
        return width;
      }
    }, {
      key: "getTextHeight",
      value: function getTextHeight() {
        return this._getTextHeight(_index2.default._pixelCtx, this._getTextLines());
      }
    }, {
      key: "_getTextLines",
      value: function _getTextLines() {
        return this.text.split(this._reNewline);
      }
    }, {
      key: "_renderText",
      value: function _renderText(ctx, textLines, globalAlpha) {
        if (!ctx) return;
        ctx.save();

        this._setContextStyle(ctx, this.context.$model, globalAlpha);

        this._renderTextStroke(ctx, textLines);

        this._renderTextFill(ctx, textLines);

        ctx.restore();
      }
    }, {
      key: "_getFontDeclaration",
      value: function _getFontDeclaration() {
        var self = this;
        var fontArr = [];

        _mmvis._.each(this.fontProperts, function (p) {
          var fontP = self.context[p];

          if (p == "fontSize") {
            fontP = parseFloat(fontP) + "px";
          }

          fontP && fontArr.push(fontP);
        });

        return fontArr.join(' ');
      }
    }, {
      key: "_renderTextFill",
      value: function _renderTextFill(ctx, textLines) {
        if (!this.context.$model.fillStyle) return;
        this._boundaries = [];
        var lineHeights = 0;

        for (var i = 0, len = textLines.length; i < len; i++) {
          var heightOfLine = this._getHeightOfLine(ctx, i, textLines);

          lineHeights += heightOfLine;

          this._renderTextLine('fillText', ctx, textLines[i], 0, //this._getLeftOffset(),
          this._getTopOffset() + lineHeights, i);
        }
      }
    }, {
      key: "_renderTextStroke",
      value: function _renderTextStroke(ctx, textLines) {
        if (!ctx) return;
        if (!this.context.$model.strokeStyle || !this.context.$model.lineWidth) return;
        var lineHeights = 0;
        ctx.save();

        if (this.strokeDashArray) {
          if (1 & this.strokeDashArray.length) {
            this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
          }

          supportsLineDash && ctx.setLineDash(this.strokeDashArray);
        }

        ctx.beginPath();

        for (var i = 0, len = textLines.length; i < len; i++) {
          var heightOfLine = this._getHeightOfLine(ctx, i, textLines);

          lineHeights += heightOfLine;

          this._renderTextLine('strokeText', ctx, textLines[i], 0, //this._getLeftOffset(),
          this._getTopOffset() + lineHeights, i);
        }

        ctx.closePath();
        ctx.restore();
      }
    }, {
      key: "_renderTextLine",
      value: function _renderTextLine(method, ctx, line, left, top, lineIndex) {
        top -= this._getHeightOfLine() / 4;

        if (this.context.$model.textAlign !== 'justify') {
          this._renderChars(method, ctx, line, left, top, lineIndex);

          return;
        }

        ;
        var lineWidth = ctx.measureText(line).width;
        var totalWidth = this.context.$model.width;

        if (totalWidth > lineWidth) {
          var words = line.split(/\s+/);
          var wordsWidth = ctx.measureText(line.replace(/\s+/g, '')).width;
          var widthDiff = totalWidth - wordsWidth;
          var numSpaces = words.length - 1;
          var spaceWidth = widthDiff / numSpaces;
          var leftOffset = 0;

          for (var i = 0, len = words.length; i < len; i++) {
            this._renderChars(method, ctx, words[i], left + leftOffset, top, lineIndex);

            leftOffset += ctx.measureText(words[i]).width + spaceWidth;
          }
        } else {
          this._renderChars(method, ctx, line, left, top, lineIndex);
        }
      }
    }, {
      key: "_renderChars",
      value: function _renderChars(method, ctx, chars, left, top) {
        ctx[method](chars, 0, top);
      }
    }, {
      key: "_getHeightOfLine",
      value: function _getHeightOfLine() {
        return this.context.$model.fontSize * this.context.$model.lineHeight;
      }
    }, {
      key: "_getTextWidth",
      value: function _getTextWidth(ctx, textLines) {
        var maxWidth = ctx.measureText(textLines[0] || '|').width;

        for (var i = 1, len = textLines.length; i < len; i++) {
          var currentLineWidth = ctx.measureText(textLines[i]).width;

          if (currentLineWidth > maxWidth) {
            maxWidth = currentLineWidth;
          }
        }

        return maxWidth;
      }
    }, {
      key: "_getTextHeight",
      value: function _getTextHeight(ctx, textLines) {
        return this.context.$model.fontSize * textLines.length * this.context.$model.lineHeight;
      }
    }, {
      key: "_getTopOffset",
      value: function _getTopOffset() {
        var t = 0;

        switch (this.context.$model.textBaseline) {
          case "top":
            t = 0;
            break;

          case "middle":
            t = -this.context.$model.height / 2;
            break;

          case "bottom":
            t = -this.context.$model.height;
            break;
        }

        return t;
      }
    }, {
      key: "getRect",
      value: function getRect() {
        var c = this.context;
        var x = 0;
        var y = 0; //更具textAlign 和 textBaseline 重新矫正 xy

        if (c.textAlign == "center") {
          x = -c.width / 2;
        }

        ;

        if (c.textAlign == "right") {
          x = -c.width;
        }

        ;

        if (c.textBaseline == "middle") {
          y = -c.height / 2;
        }

        ;

        if (c.textBaseline == "bottom") {
          y = -c.height;
        }

        ;
        return {
          x: x,
          y: y,
          width: c.width,
          height: c.height
        };
      }
    }]);

    return Text;
  }(_DisplayObject3.default);

  exports.default = Text;
});