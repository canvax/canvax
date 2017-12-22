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
    constructor(opt){
        opt = Utils.checkOpt( opt );
        
        var _context = _.extend({
            lineType: null,
            smooth: false,
            pointList: [], //{Array}  // 必须，各个顶角坐标
            smoothFilter: Utils.__emptyFunc
        }, opt.context );

        if( !opt.isClone && _context.smooth ){
            _context.pointList = _Math.getSmoothPointList( _context.pointList, _context.smoothFilter );
        };

        opt.context = _context;
        opt.type = "brokenline";
        
        super(opt);

        //保存好原始值
        this._pointList = _context.pointList;
    }

    watch(name, value, preValue) 
    {
        if (name == "pointList" || name == "smooth" || name == "lineType") {
            if(name == "pointList" && this.context.smooth ){
                this.context.pointList = _Math.getSmoothPointList( value , this.context.smoothFilter);
                this._pointList = value;
            };
            if( name == "smooth" ){
                //如果是smooth的切换
                if( value ){
                    //从原始中拿数据重新生成
                    this.context.pointList = _Math.getSmoothPointList( this._pointList , this.context.smoothFilter);
                } else {
                    this.context.pointList = this._pointList;
                }
            };
            this.graphics.clear();
        }
    }


    draw( graphics ) 
    {
        let context = this.context;
        let pointList = context.pointList;
        let beginPath = false;

        for (var i = 0, l = pointList.length; i < l; i++) {
            var point = pointList[i];
            var nextPoint = pointList[i+1];
            if( _Math.isValibPoint( point ) ){
                if (!context.lineType || context.lineType == 'solid') {
                    //实线的绘制
                    if( !beginPath ){
                        graphics.moveTo( point[0], point[1] );
                    } else {
                        graphics.lineTo( point[0], point[1] );
                    }
                } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
                    //如果是虚线

                    //如果是曲线
                    if( context.smooth ){
                        //就直接做间隔好了
                        //TODO: 这个情况会有点稀疏，要优化
                        if( !beginPath ){
                            graphics.moveTo( point[0], point[1] );
                        } else {
                            graphics.lineTo( point[0], point[1] );
                            beginPath = false;
                            i++; //跳过下一个点
                            continue;
                        }
                    } else {
                        //point 有效，而且 next也有效的话
                        //直线的虚线
                        if( _Math.isValibPoint( nextPoint ) ){
                            this.dashedLineTo(graphics, point[0], point[1], nextPoint[0], nextPoint[1], 5);
                        }
                    }
                };
                
                beginPath = true;
            } else {
                beginPath = false;
            }
        }

        /*
        if (!context.lineType || context.lineType == 'solid') {
            //默认为实线
            //TODO:目前如果 有设置smooth 的情况下是不支持虚线的
            graphics.moveTo(pointList[0][0], pointList[0][1]);
            for (var i = 1, l = pointList.length; i < l; i++) {
                graphics.lineTo(pointList[i][0], pointList[i][1]);
            };

        } else if (context.lineType == 'dashed' || context.lineType == 'dotted') {
            if (context.smooth) {
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
                for (var i = 1, l = pointList.length; i < l; i++) {
                    var fromX = pointList[i - 1][0];
                    var toX = pointList[i][0];
                    var fromY = pointList[i - 1][1];
                    var toY = pointList[i][1];
                    this.dashedLineTo(graphics, fromX, fromY, toX, toY, 5);
                };
            }
            
        };
        */
        return this;
    }
}