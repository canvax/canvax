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
        
        var _context = _.extend(true,{
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
            
            if( _Math.isValibPoint( point ) ){

                if( !beginPath ){
                    graphics.moveTo( point[0], point[1] );
                } else {
                    graphics.lineTo( point[0], point[1] );
                };

                beginPath = true;
            } else {
                beginPath = false;
            }
        }
        return this;
    }
}