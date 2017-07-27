/**
 * Canvax--Text
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 文本 类
 **/
import DisplayObject from "./DisplayObject";
import Utils from "../utils/index";
import _ from "../utils/underscore";

export default class Text extends DisplayObject
{
    constructor(text, opt)
    {
        opt.type = "text";

        opt.context = _.extend({
            font: "", 
            fontSize: 13, //字体大小默认13
            fontWeight: "normal",
            fontFamily: "微软雅黑,sans-serif",
            textDecoration: null,
            fillStyle: 'blank',
            strokeStyle: null,
            lineWidth: 0,
            lineHeight: 1.2,
            backgroundColor: null,
            textBackgroundColor: null
        }, opt.context);

        super( opt );
 
        this._reNewline = /\r?\n/;
        this.fontProperts = ["fontStyle", "fontVariant", "fontWeight", "fontSize", "fontFamily"];
        this.context.font = this._getFontDeclaration();

        this.text = text.toString();

        this.context.width = this.getTextWidth();
        this.context.height = this.getTextHeight();
    }

    $watch(name, value, preValue) 
    {

        //context属性有变化的监听函数
        if (_.indexOf(this.fontProperts, name) >= 0) {
            this.context[name] = value;
            //如果修改的是font的某个内容，就重新组装一遍font的值，
            //然后通知引擎这次对context的修改上报心跳
            this.context.font = this._getFontDeclaration();
            this.context.width = this.getTextWidth();
            this.context.height = this.getTextHeight();
        }
    }

    _setContextStyle( ctx , style ){
        // 简单判断不做严格类型检测
        for(var p in style){
            if( p != "textBaseline" && ( p in ctx ) ){
                if ( style[p] || _.isNumber( style[p] ) ) {
                    if( p == "globalAlpha" ){
                        //透明度要从父节点继承
                        ctx[p] *= style[p];
                    } else {
                        ctx[p] = style[p];
                    }
                }
            }
        };
        return;
    }
 
    render(ctx) 
    { 
        this._renderText(ctx, this._getTextLines());
    }

    resetText(text) 
    {
        this.text = text.toString();
        this.heartBeat();
    }

    getTextWidth() 
    {
        var width = 0;
        Utils._pixelCtx.save();
        Utils._pixelCtx.font = this.context.$model.font;
        width = this._getTextWidth(Utils._pixelCtx, this._getTextLines());
        Utils._pixelCtx.restore();
        return width;
    }

    getTextHeight() 
    {
        return this._getTextHeight(Utils._pixelCtx, this._getTextLines());
    }

    _getTextLines() 
    {
        return this.text.split(this._reNewline);
    }

    _renderText(ctx, textLines) 
    {
        ctx.save();
        this._setContextStyle( ctx , this.context.$model );
        this._renderTextStroke(ctx, textLines);
        this._renderTextFill(ctx, textLines);
        ctx.restore();
    }

    _getFontDeclaration() 
    {
        var self = this;
        var fontArr = [];

        _.each(this.fontProperts, function(p) {
            var fontP = self.context[p];
            if (p == "fontSize") {
                fontP = parseFloat(fontP) + "px"
            }
            fontP && fontArr.push(fontP);
        });

        return fontArr.join(' ');

    }

    _renderTextFill(ctx, textLines) 
    {
        if (!this.context.$model.fillStyle) return;

        this._boundaries = [];
        var lineHeights = 0;
        
        for (var i = 0, len = textLines.length; i < len; i++) {
            var heightOfLine = this._getHeightOfLine(ctx, i, textLines);
            lineHeights += heightOfLine;

            this._renderTextLine(
                'fillText',
                ctx,
                textLines[i],
                0, //this._getLeftOffset(),
                this._getTopOffset() + lineHeights,
                i
            );
        }
    }

    _renderTextStroke(ctx, textLines) 
    {
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

            this._renderTextLine(
                'strokeText',
                ctx,
                textLines[i],
                0, //this._getLeftOffset(),
                this._getTopOffset() + lineHeights,
                i
            );
        }
        ctx.closePath();
        ctx.restore();
    }

    _renderTextLine(method, ctx, line, left, top, lineIndex) 
    {
        top -= this._getHeightOfLine() / 4;
        if (this.context.$model.textAlign !== 'justify') {
            this._renderChars(method, ctx, line, left, top, lineIndex);
            return;
        };
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

    _renderChars(method, ctx, chars, left, top) 
    {
        ctx[method](chars, 0, top);
    }

    _getHeightOfLine() 
    {
        return this.context.$model.fontSize * this.context.$model.lineHeight;
    }

    _getTextWidth(ctx, textLines) 
    {
        var maxWidth = ctx.measureText(textLines[0] || '|').width;
        for (var i = 1, len = textLines.length; i < len; i++) {
            var currentLineWidth = ctx.measureText(textLines[i]).width;
            if (currentLineWidth > maxWidth) {
                maxWidth = currentLineWidth;
            }
        }
        return maxWidth;
    }

    _getTextHeight(ctx, textLines) 
    {
        return this.context.$model.fontSize * textLines.length * this.context.$model.lineHeight;
    }

    /**
     * @private
     * @return {Number} Top offset
     */
    _getTopOffset() 
    {
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

    getRect() 
    {
        var c = this.context;
        var x = 0;
        var y = 0;
        //更具textAlign 和 textBaseline 重新矫正 xy
        if (c.textAlign == "center") {
            x = -c.width / 2;
        };
        if (c.textAlign == "right") {
            x = -c.width;
        };
        if (c.textBaseline == "middle") {
            y = -c.height / 2;
        };
        if (c.textBaseline == "bottom") {
            y = -c.height;
        };

        return {
            x: x,
            y: y,
            width: c.width,
            height: c.height
        }
    }
}