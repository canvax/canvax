/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 多边形 类  （不规则）
 *
 * 对应context的属性有
 * @pointList 多边形各个顶角坐标
 **/
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";
import _Math from "../geom/Math"

export default class Polygon extends Shape 
{
    constructor(opt)
    {
        var _context = _.extend(true, {
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context );

        if(!opt.isClone){
            var start = _context.pointList[0];
            var end   = _context.pointList.slice( - 1 )[0];
            if( _context.smooth ){
                _context.pointList.unshift( end );
                _context.pointList = _Math.getSmoothPointList( _context.pointList );
            }
        };

        opt.context = _context;
        opt.type = "polygon";
        
        super(opt);
    }

    watch(name, value, preValue) 
    {
        //调用parent的setGraphics
        if (name == "pointList" || name == "smooth" || name == "lineType") {
            this.graphics.clear();
            this.draw( this.graphics );
        }
    }

    draw( graphics ) 
    {
        //graphics.beginPath();
        const context = this.context;
        const pointList = context.pointList;
        if (pointList.length < 2) {
            //少于2个点就不画了~
            return;
        };

        graphics.moveTo(pointList[0][0], pointList[0][1]);
        for (var i = 1, l = pointList.length; i < l; i++) {
            graphics.lineTo(pointList[i][0], pointList[i][1]);
        };
        graphics.closePath();

        return;
    }
};