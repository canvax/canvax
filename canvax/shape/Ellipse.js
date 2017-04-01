
/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 椭圆形 类
 *
 * 对应context的属性有 
 *
 * @hr 椭圆横轴半径
 * @vr 椭圆纵轴半径
 */
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";

export default class Ellipse extends Shape
{
    constructor(opt)
    {
        opt = Utils.checkOpt( opt );
        var _context = _.extend({
            //x             : 0 , //{number},  // 丢弃
            //y             : 0 , //{number},  // 丢弃，原因同circle
            hr : 0,  //{number},  // 必须，椭圆横轴半径
            vr : 0   //{number},  // 必须，椭圆纵轴半径
        } , opt.context);

        opt.context = _context;
        opt.type = "ellipse";

        super( opt );
    }

    watch(name, value, preValue) 
    {
        if ( name == "hr" || name == "vr" ) {
            this.clearGraphicsData();
        }
    }

    draw(graphics)
    {    
        //graphics.beginPath();
        graphics.drawEllipse(0,0, this.context.$model.hr*2 , this.context.$model.vr*2);
    }
};
