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
    constructor(opt, atype)
    {
        opt = Utils.checkOpt(opt);
        var _context = _.extend({
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context );

        if(atype !== "clone"){
            var start = _context.pointList[0];
            var end   = _context.pointList.slice( - 1 )[0];
            if( _context.smooth ){
                _context.pointList.unshift( end );
                _context.pointList = _Math.getSmoothPointList( _context.pointList );
            } 
            //else {
            //    _context.pointList.push( start );
            //}
        };

        opt.context = _context;
        
        super(opt, atype);

        this._drawTypeOnly = null;
        this.type = "polygon";
        this.id = Utils.createId(this.type);
    }

    watch(name, value, preValue) 
    {
        //调用parent的setGraphics
        if (name == "pointList" || name == "smooth" || name == "lineType") {
            this.clearGraphicsData();
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

        //如果为虚线
        if (context.lineType == 'dashed' || context.lineType == 'dotted') {
            //首先把前面的draphicsData设置为fill only
            //也就是把line强制设置为false，这点很重要，否则你虚线画不出来，会和这个实现重叠了
            graphics.currentPath.line = false;

            if (context.smooth) {
                //如果是smooth，本身已经被用曲率打散过了，不需要采用间隔法
                for (var si = 0, sl = pointList.length; si < sl; si++) {
                    if (si == sl-1) {
                        break;
                    };
                    graphics.moveTo( pointList[si][0] , pointList[si][1] );
                    graphics.lineTo( pointList[si+1][0] , pointList[si+1][1] );
                    si+=1;
                };
            } else {
                //画虚线的方法  
                graphics.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 1, l = pointList.length; i < l; i++) {
                    var fromX = pointList[i - 1][0];
                    var toX = pointList[i][0];
                    var fromY = pointList[i - 1][1];
                    var toY = pointList[i][1];
                    this.dashedLineTo(graphics, fromX, fromY, toX, toY, 5);
                };
            }
        };

        graphics.closePath();
        return;
    }
};