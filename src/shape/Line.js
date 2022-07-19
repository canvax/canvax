/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 线条 类
 **/
import Shape from "../display/Shape";
import _ from "../utils/underscore";

export default class Line extends Shape
{
    constructor(opt)
    {
        var _context = _.extend(true,{
            start: {
                x : 0,      // 必须，起点横坐标
                y : 0       // 必须，起点纵坐标
            },
            end: {
                x : 0,      // 必须，终点横坐标
                y : 0       // 必须，终点纵坐标
            }
        } , opt.context);
        opt.context = _context;

        opt.type = "line";

        super( opt );
    }

    watch(name, value, preValue)
    {
        //并不清楚是start.x 还是end.x， 当然，这并不重要
        if (name == "x" || name == "y"){
            this.graphics.clear();
            this.draw( this.graphics );
        }
    }

    draw( graphics ) 
    {
        const model = this.context.$model;
        graphics.moveTo( model.start.x , model.start.y ); 
        graphics.lineTo( model.end.x   , model.end.y );
        return this;
    }

 
};