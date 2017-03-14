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
        opt = Utils.checkOpt(opt);
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

        super( opt );

        this.setGraphics();

        this.type = "line";
        this.id = Utils.createId(this.type);
    }

    $watch(name, value, preValue)
    {
        //并不清楚是start.x 还是end.x， 当然，这并不重要
        if (name == "x" || name == "y"){
            this.setGraphics();
        }
    }

    setGraphics() 
    {
        this.graphics.clear();
        const context = this.context;
        if (!context.lineType || context.lineType == 'solid') {
            this.graphics.moveTo( context.start.x , context.start.y ); 
            this.graphics.lineTo( context.end.x   , context.end.y );
        } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
            this.dashedLineTo(
                context.start.x, context.start.y,
                context.end.x  , context.end.y, 
                this.context.dashLength
            );
        };
        return this;
    }

 
};