/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 扇形 类
 *
 * 坐标原点再圆心
 *
 * 对应context的属性有
 * @r0 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
 * @r  必须，外圆半径
 * @startAngle 起始角度(0, 360)
 * @endAngle   结束角度(0, 360)
 **/
import Shape from "../display/Shape";
import Utils from "../utils/index";
import _ from "../utils/underscore";
import myMath from "../geom/Math";

export default class Sector extends Shape
{
    constructor(opt)
    {
        var _context = _.extend(true, {
            pointList  : [],//边界点的集合,私有，从下面的属性计算的来
            r0         : 0,// 默认为0，内圆半径指定后将出现内弧，同时扇边长度 = r - r0
            r          : 0,//{number},  // 必须，外圆半径
            startAngle : 0,//{number},  // 必须，起始角度[0, 360)
            endAngle   : 0, //{number},  // 必须，结束角度(0, 360]
            clockwise  : false //是否顺时针，默认为false(顺时针)
        } , opt.context);
        
        opt.context = _context;
        opt.regAngle = [];
        opt.isRing = false;//是否为一个圆环
        opt.type = "sector";

        super(opt);
    }

    watch(name, value, preValue) 
    {
        if ( name == "r0" || name == "r" || name == "startAngle" || name =="endAngle" || name =="clockwise" ) {
            //因为这里的graphs不一样。
            this.isRing = false;//是否为一个圆环，这里也要开始初始化一下
            this.graphics.clear();
            this.draw( this.graphics );
        };
    }
 
    draw( graphics )
    {
        var model = this.context.$model;
        // 形内半径[0,r)
        var r0 = typeof model.r0 == 'undefined' ? 0 : model.r0;
        var r  = model.r;                            // 扇形外半径(0,r]
        var startAngle = myMath.degreeTo360(model.startAngle);          // 起始角度[0,360)
        var endAngle   = myMath.degreeTo360(model.endAngle);              // 结束角度(0,360]

        if( model.startAngle != model.endAngle && Math.abs(model.startAngle - model.endAngle) % 360 == 0 ) {
        //if( startAngle == endAngle && model.startAngle != model.endAngle ) {
            //如果两个角度相等，那么就认为是个圆环了
            this.isRing = true;
            startAngle  = 0 ;
            endAngle    = 360;
        }

        startAngle = myMath.degreeToRadian(startAngle);
        endAngle   = myMath.degreeToRadian(endAngle);
     
        //处理下极小夹角的情况
        //if( endAngle - startAngle < 0.025 ){
        //    startAngle -= 0.003
        //}

        var G = graphics;
        //G.beginPath();
        if( this.isRing ){
            if( model.r0 == 0 ){
                //圆
                G.drawCircle(0, 0, model.r);
            } else {
                //圆环
                if( model.fillStyle && model.fillAlpha ){
                    G.beginPath();
                    G.arc( 0 , 0 , r, startAngle, endAngle, model.clockwise);
                    if( model.r0 == 0 ){
                        G.lineTo( 0 , 0 );
                    } else {
                        G.arc( 0 , 0 , r0 , endAngle , startAngle , !model.clockwise);
                    }
                    G.closePath();
                    G.currentPath.lineWidth = 0;
                    G.currentPath.strokeStyle = null;
                    G.currentPath.strokeAlpha = 0;
                    G.currentPath.line = false;
                }
                if( model.lineWidth && model.strokeStyle && model.strokeAlpha ){
                    G.beginPath()
                    G.arc( 0 , 0 , r, startAngle, endAngle, model.clockwise);
                    G.closePath();
                    G.currentPath.fillStyle = null;
                    G.currentPath.fill = false;

                    G.beginPath()
                    G.arc( 0 , 0 , r0 , endAngle , startAngle , !model.clockwise);
                    G.closePath();
                    G.currentPath.fillStyle = null;
                    G.currentPath.fill = false;
                }
            }
        } else {
            //正常的扇形状
            G.beginPath();
            G.arc( 0 , 0 , r, startAngle, endAngle, model.clockwise);
            if( model.r0 == 0 ){
                G.lineTo( 0 , 0 );
            } else {
                G.arc( 0 , 0 , r0 , endAngle , startAngle , !model.clockwise);
            }
            G.closePath();
        }
        //G.closePath();
     }

}
