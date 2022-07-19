
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
        opt = _.extend(true,{
            type : "ellipse",
            context : {
                hr : 0,  //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
                vr : 0   //{number},  // 必须，水滴纵高（中心到尖端距离）
            }
        } , Utils.checkOpt( opt ));

        super( opt );
    }

    watch(name, value, preValue) 
    {
        if ( name == "hr" || name == "vr" ) {
            this.graphics.clear();
            this.draw( this.graphics );
        }
    }

    draw(graphics)
    {    
        graphics.drawEllipse(0,0, this.context.$model.hr*2 , this.context.$model.vr*2);
    }
};
