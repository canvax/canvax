/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 折线 类
 *
 * 对应context的属性有
 * @pointList 各个顶角坐标
 **/
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";
import _Math from "../geom/Math"

export default class BrokenLine extends Shape
{
    constructor(opt , atype){
        opt = Utils.checkOpt(opt);
        var _context = _.extend({
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context );

        if( atype !== "clone" && _context.smooth ){
            _context.pointList = _Math.getSmoothPointList( _context.pointList );
        };

        opt.context = _context;
        
        super(opt);

        this.type = "brokenline";
        this.id = Utils.createId(this.type);

        this.setGraphics();
    }

    $watch(name, value, preValue) 
    {
        if (name == "pointList" || name == "smooth" || name == "lineType") {
            this.setGraphics();
        }
    }


    setGraphics() 
    {
        this.graphics.clear();

        const context = this.context;
        const pointList = context.pointList;
        if (pointList.length < 2) {
            //少于2个点就不画了~
            return this;
        };
        if (!context.lineType || context.lineType == 'solid') {
            //默认为实线
            //TODO:目前如果 有设置smooth 的情况下是不支持虚线的
            this.graphics.moveTo(pointList[0][0], pointList[0][1]);
            for (var i = 1, l = pointList.length; i < l; i++) {
                this.graphics.lineTo(pointList[i][0], pointList[i][1]);
            };
        } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
            if (context.smooth) {
                for (var si = 0, sl = pointList.length; si < sl; si++) {
                    if (si == sl-1) {
                        break;
                    };
                    this.graphics.moveTo( pointList[si][0] , pointList[si][1] );
                    this.graphics.lineTo( pointList[si+1][0] , pointList[si+1][1] );
                    si+=1;
                };
            } else {
                //画虚线的方法  
                this.graphics.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 1, l = pointList.length; i < l; i++) {
                    var fromX = pointList[i - 1][0];
                    var toX = pointList[i][0];
                    var fromY = pointList[i - 1][1];
                    var toY = pointList[i][1];
                    this.dashedLineTo(fromX, fromY, toX, toY, 5);
                };
            }
        };
        return this;
    }

}