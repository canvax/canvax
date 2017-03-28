/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 矩现 类  （不规则）
 *
 *
 * 对应context的属性有
 * @width 宽度
 * @height 高度
 * @radius 如果是圆角的，则为【上右下左】顺序的圆角半径数组
 **/
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";

export default class Rect extends Shape
{
    constructor(opt)
    {
        opt = Utils.checkOpt( opt );
        var _context = _.extend({
            width : 0,
            height: 0,
            radius: [],
        } , opt.context);
        opt.context = _context;

        super( opt );

        this.type = "rect";
        this.id = Utils.createId(this.type);
    }

    watch(name, value, preValue) 
    {
        if ( name == "width" || name == "height" || name == "radius" ) {
            this.clearGraphicsData();
        }
    }

    /**
     * 绘制圆角矩形
     */
    _buildRadiusPath( graphics )
    {
        var context = this.context;
        //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
        //r缩写为1         相当于 [1, 1, 1, 1]
        //r缩写为[1]       相当于 [1, 1, 1, 1]
        //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
        //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
        var x = 0;
        var y = 0;
        var width = this.context.width;
        var height = this.context.height;
    
        var r = Utils.getCssOrderArr(context.radius);
        var G = graphics;
     
        G.moveTo( parseInt(x + r[0]), parseInt(y));
        G.lineTo( parseInt(x + width - r[1]), parseInt(y));
        r[1] !== 0 && G.quadraticCurveTo(
                x + width, y, x + width, y + r[1]
                );
        G.lineTo( parseInt(x + width), parseInt(y + height - r[2]));
        r[2] !== 0 && G.quadraticCurveTo(
                x + width, y + height, x + width - r[2], y + height
                );
        G.lineTo( parseInt(x + r[3]), parseInt(y + height));
        r[3] !== 0 && G.quadraticCurveTo(
                x, y + height, x, y + height - r[3]
                );
        G.lineTo( parseInt(x), parseInt(y + r[0]));
        r[0] !== 0 && G.quadraticCurveTo(x, y, x + r[0], y);
    }
    /**
     * 创建矩形路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} context 样式
     */
    draw( graphics ) 
    {
        //graphics.beginPath();
        if(!this.context.radius.length) {
            graphics.drawRect(0,0,this.context.width , this.context.height);
        } else {
            this._buildRadiusPath( graphics );
        }
        graphics.closePath();
        return;
    }
}