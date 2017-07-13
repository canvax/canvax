/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 线条 类
 *
 *
 * 对应context的属性有
 * @lineType  可选 虚线 实现 的 类型
 * @xStart    必须，起点横坐标
 * @yStart    必须，起点纵坐标
 * @xEnd      必须，终点横坐标
 * @yEnd      必须，终点纵坐标
 **/
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";

export default class Line extends Shape
{
    constructor(opt)
    {
        var _context = _.extend({
            lineType: null, //可选 虚线 实现 的 类型
            start: {
                x : 0,      // 必须，起点横坐标
                y : 0       // 必须，起点纵坐标
            },
            end: {
                x : 0,      // 必须，终点横坐标
                y : 0       // 必须，终点纵坐标
            },
            dashLength: 3    // 虚线间隔
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
        }
    }

    draw( graphics ) 
    {
        const model = this.context.$model;
        if (!model.lineType || model.lineType == 'solid') {
            graphics.moveTo( model.start.x , model.start.y ); 
            graphics.lineTo( model.end.x   , model.end.y );
        } else if (model.lineType == 'dashed' || model.lineType == 'dotted') {
            this.dashedLineTo(
                graphics,
                model.start.x, model.start.y,
                model.end.x  , model.end.y, 
                model.dashLength
            );
        };
        return this;
    }

 
};