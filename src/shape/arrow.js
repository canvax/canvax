/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 线条 类
 *
* 
* @param {Object} fromX  起点x
* @param {Object} fromY  起点y
* @param {Object} toX    终点x
* @param {Object} toY    终点y

* @param {Object} theta  箭头夹角
* @param {Object} headlen 斜边长度
* @param {Object} width 箭头宽度
* @param {Object} color 颜色
*
 *
 * 对应context的属性有
 * @lineType  可选 虚线 实现 的 类型
 **/
import Shape from "../display/Shape";
import {_} from "mmvis";

export default class Line extends Shape
{
    constructor(opt)
    {
        var _context = _.extend({
            start: {
                x : 0,      // 必须，起点横坐标
                y : 0       // 必须，起点纵坐标
            },
            end: {
                x : 0,      // 必须，终点横坐标
                y : 0       // 必须，终点纵坐标
            },
            theta: 30,        // 箭头夹角
            headlen: 10,      // 斜边长度

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
        if (name == "x" || name == "y" || name == "theta" || name == "headlen"){
            this.graphics.clear();
        }
    }

    draw( graphics ) 
    {
        const model = this.context.$model;
  
        let fromX = model.start.x;
        let fromY = model.start.y;
        let toX   = model.end.x;
        let toY   = model.end.y;

        // 计算各角度和对应的P2,P3坐标 
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, 
            angle1 = (angle + model.theta) * Math.PI / 180, 
            angle2 = (angle - model.theta) * Math.PI / 180, 
            topX = model.headlen * Math.cos(angle1), 
            topY = model.headlen * Math.sin(angle1), 
            botX = model.headlen * Math.cos(angle2), 
            botY = model.headlen * Math.sin(angle2); 

        var arrowX = fromX - topX, arrowY = fromY - topY;

            graphics.moveTo(arrowX, arrowY); 
            graphics.moveTo(fromX, fromY); 
            graphics.lineTo(toX, toY); 
            arrowX = toX + topX; 
            arrowY = toY + topY; 

            graphics.moveTo(arrowX, arrowY); 
            graphics.lineTo(toX, toY); 
            arrowX = toX + botX; 
            arrowY = toY + botY; 

            graphics.lineTo(arrowX, arrowY); 
            graphics.strokeStyle = color; 
            graphics.lineWidth = width; 
       
        return this;
    }
};