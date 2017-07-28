/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 圆形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r 圆半径
 **/
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";

export default class Circle extends Shape
{
    constructor( opt )
    {
        //opt = Utils.checkOpt( opt );
        //默认情况下面，circle不需要把xy进行parentInt转换
        /*
        var opt = {
            type : "circle",
            xyToInt : false,
            context : {
                r : 0
            }
        };
        */

        opt = _.extend( true, {
            type : "circle",
            xyToInt : false,
            context : {
                r : 0
            }
        }, Utils.checkOpt( opt ) );

        super( opt );
    }
    
    watch(name, value, preValue)
    {
        if ( name == "r" ) {
            this.graphics.clear();
        }
    }

    draw( graphics ) 
    {
        graphics.drawCircle(0, 0, this.context.$model.r);
    }

}

