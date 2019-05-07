/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 **/

import Shape from "../display/Shape";
import {_} from "mmvis";

export default class Line extends Shape
{
    constructor(opt)
    {
        var _context = _.extend(true,{
            control : {
                x : 0,   // 必须，起点横坐标
                y : 0    // 必须，起点纵坐标
            },
            point : {
                x : 0,   // 必须，终点横坐标
                y : 0    // 必须，终点纵坐标
            },
            angle : null,// control的存在，也就是为了计算出来这个angle
            theta: 30,   // 箭头夹角
            headlen: 6, // 斜边长度

            lineWidth: 1,
            strokeStyle: '#666',
            fillStyle : null  

        } , opt.context);

        opt.context = _context;

        opt.type = "arrow";

        super( opt );
    }

    watch(name, value, preValue)
    {
        //并不清楚是start.x 还是end.x， 当然，这并不重要
        if (name == "x" || name == "y" || name == "theta" || name == "headlen" || name == "angle"){
            this.graphics.clear();
        }
    }

    draw( graphics ) 
    {
        const model = this.context.$model;
  
        let fromX  = model.control.x;
        let fromY  = model.control.y;
        let toX    = model.point.x;
        let toY    = model.point.y;

        // 计算各角度和对应的P2,P3坐标 
        var angle  = model.angle != null ? model.angle-180 : Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, 
            angle1 = (angle + model.theta) * Math.PI / 180, 
            angle2 = (angle - model.theta) * Math.PI / 180, 
            topX   = model.headlen * Math.cos(angle1), 
            topY   = model.headlen * Math.sin(angle1), 
            botX   = model.headlen * Math.cos(angle2), 
            botY   = model.headlen * Math.sin(angle2); 

            var arrowX = toX + topX;
            var arrowY = toY + topY;

            graphics.moveTo(arrowX, arrowY); 
            graphics.lineTo(toX, toY); 
            graphics.lineTo( toX + botX, toY + botY);

            if( model.fillStyle ){
                graphics.lineTo(arrowX, arrowY); 
                graphics.closePath();
            };
       
        return this;
    }
};