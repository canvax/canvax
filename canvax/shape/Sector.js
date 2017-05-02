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
        var _context = _.extend({
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
            this.clearGraphicsData();
        };
    }

    draw( graphics )
    {
        //graphics.beginPath();
        var model = this.context.$model;
        // 形内半径[0,r)
        var r0 = typeof model.r0 == 'undefined' ? 0 : model.r0;
        var r  = model.r;                            // 扇形外半径(0,r]
        var startAngle = myMath.degreeTo360(model.startAngle);          // 起始角度[0,360)
        var endAngle   = myMath.degreeTo360(model.endAngle);              // 结束角度(0,360]

        //var isRing     = false;                       //是否为圆环

        if( startAngle != endAngle && Math.abs(startAngle - endAngle) % 360 == 0 ) {
        //if( startAngle == endAngle && model.startAngle != model.endAngle ) {
            //如果两个角度相等，那么就认为是个圆环了
            this.isRing = true;
            startAngle  = 0 ;
            endAngle    = 360;
        }

        startAngle = myMath.degreeToRadian(startAngle);
        endAngle   = myMath.degreeToRadian(endAngle);
     
        //处理下极小夹角的情况
        if( endAngle - startAngle < 0.025 ){
            startAngle -= 0.003
        }

        var G = graphics;
        G.beginPath();
        if( this.isRing && model.r0 == 0 ){
            G.drawCircle(0, 0, model.r);
        } else {
            
            G.arc( 0 , 0 , r, startAngle, endAngle, model.clockwise);
            if( model.r0 == 0 ){
                G.lineTo( 0 , 0 );
            } else {
                G.arc( 0 , 0 , r0 , endAngle , startAngle , !model.clockwise);
            }
        }

        G.closePath();
     }

     getRect(context)
     {
         var context = context ? context : this.context;
         var model = context.$model;

         var r0 = typeof model.r0 == 'undefined'     // 形内半径[0,r)
             ? 0 : model.r0;
         var r = model.r;                            // 扇形外半径(0,r]
         
         this.getRegAngle();

         var startAngle = myMath.degreeTo360(model.startAngle);          // 起始角度[0,360)
         var endAngle   = myMath.degreeTo360(model.endAngle);            // 结束角度(0,360]

         var pointList  = [];

         var p4Direction= {
             "90" : [ 0 , r ],
             "180": [ -r, 0 ],
             "270": [ 0 , -r],
             "360": [ r , 0 ] 
         };

         for ( var d in p4Direction ){
             var inAngleReg = parseInt(d) > this.regAngle[0] && parseInt(d) < this.regAngle[1];
             if( this.isRing || (inAngleReg && this.regIn) || (!inAngleReg && !this.regIn) ){
                 pointList.push( p4Direction[ d ] );
             }
         }

         if( !this.isRing ) {
             startAngle = myMath.degreeToRadian( startAngle );
             endAngle   = myMath.degreeToRadian( endAngle   );

             pointList.push([
                 myMath.cos(startAngle) * r0 , myMath.sin(startAngle) * r0
                 ]);

             pointList.push([
                 myMath.cos(startAngle) * r  , myMath.sin(startAngle) * r
                 ]);

             pointList.push([
                 myMath.cos(endAngle)   * r  ,  myMath.sin(endAngle)  * r
                 ]);

             pointList.push([
                 myMath.cos(endAngle)   * r0 ,  myMath.sin(endAngle)  * r0
                 ]);
         }

         model.pointList = pointList;
         return this.getRectFormPointList( context );
     }

     getRegAngle()
     {
         this.regIn      = true;  //如果在start和end的数值中，end大于start而且是顺时针则regIn为true
         var model           = this.context.$model;
         var startAngle = myMath.degreeTo360(model.startAngle);          // 起始角度[0,360)
         var endAngle   = myMath.degreeTo360(model.endAngle);            // 结束角度(0,360]

         if ( ( startAngle > endAngle && !model.clockwise ) || ( startAngle < endAngle && model.clockwise ) ) {
             this.regIn  = false; //out
         };
         //度的范围，从小到大
         this.regAngle   = [ 
             Math.min( startAngle , endAngle ) , 
             Math.max( startAngle , endAngle ) 
         ];
     }
}
