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
        var _context = _.extend({
            width : 0,
            height: 0,
            radius: [],
        } , opt.context);
        opt.context = _context;
        opt.type = "rect";

        super( opt );
    }

    watch(name, value, preValue) 
    {
        if ( name == "width" || name == "height" || name == "radius" ) {
            this.graphics.clear();
        }
    }

    /**
     * 绘制圆角矩形
     */
    _buildRadiusPath( graphics )
    {
        var model = this.context.$model;
        //左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
        //r缩写为1         相当于 [1, 1, 1, 1]
        //r缩写为[1]       相当于 [1, 1, 1, 1]
        //r缩写为[1, 2]    相当于 [1, 2, 1, 2]
        //r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
        var x = 0;
        var y = 0;
        var width = model.width;
        var height = model.height;
    
        var r = Utils.getCssOrderArr(model.radius);
        var G = graphics;

        var sy = 1;
        if( height >= 0 ){
            sy = -1;
        }

        G.moveTo( parseInt(x + r[0]), parseInt( height ));

        G.lineTo( parseInt(x + width - r[1]), parseInt( height ));

        r[1] !== 0 && G.quadraticCurveTo(
            x + width, height, parseInt(x + width), parseInt(height + r[1]*sy)
            );
        G.lineTo( parseInt(x + width), parseInt(y - r[2]*sy));

        r[2] !== 0 && G.quadraticCurveTo(
            x + width, y, parseInt(x + width - r[2]), parseInt(y)
            );
        G.lineTo( parseInt(x + r[3]), parseInt(y));
        r[3] !== 0 && G.quadraticCurveTo(
            x, y, parseInt(x), parseInt(y - r[3]*sy)
            );
        G.lineTo( parseInt(x), parseInt(y + height + r[0]*sy));
        r[0] !== 0 && G.quadraticCurveTo(
            x, y+height, parseInt(x + r[0]), parseInt(y+height)
            );
    }

    draw( graphics ) 
    {
        var model = this.context.$model;
        if(!model.radius.length) {
            graphics.drawRect(0,0,model.width , model.height);
        } else {
            this._buildRadiusPath( graphics );
        }
        graphics.closePath();
        return;
    }
}