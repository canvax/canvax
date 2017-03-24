/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
import DisplayObject from "./DisplayObject";
import Utils from "../utils/index";
import _ from "../utils/underscore";
import {SHAPE_CONTEXT_DEFAULT, STYLE_PROPS} from "../const"

export default class Shape extends DisplayObject
{
    constructor(opt){

        opt = Utils.checkOpt(opt);
        var _context = _.extend( _.clone(SHAPE_CONTEXT_DEFAULT) , opt.context );
        opt.context = _context;

        super( opt );

        this.graphicsData = [];

        //元素是否有hover事件 和 chick事件，由addEvenetLister和remiveEventLister来触发修改
        this._hoverable  = false;
        this._clickable  = false;

        //over的时候如果有修改样式，就为true
        this._hoverClass = false;
        this.hoverClone  = true;    //是否开启在hover的时候clone一份到active stage 中 
        this.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

        //拖拽drag的时候显示在activShape的副本
        this._dragDuplicate = null;

        //元素是否 开启 drag 拖动，这个有用户设置传入
        //self.draggable = opt.draggable || false;

        this.type = this.type || "shape" ;
        opt.draw && (this.draw = opt.draw);
        
        //处理所有的图形一些共有的属性配置,把除开id,context之外的所有属性，全部挂载到this上面
        this.initCompProperty(opt);

        this._rect = null;
    }

    _draw(stage , renderer)
    {
        if(this.graphicsData.length == 0){
            //先设置好当前graphics的style
            renderer.graphics.setStyle( this.context );
            
            var lastGDind = renderer.graphics.graphicsData.length;
            this.draw( renderer.graphics );
            this.graphicsData = renderer.graphics.graphicsData.slice( lastGDind );
            var me = this;
            _.each( this.graphicsData , function( gd ){
                gd.displayObject = me;
            } );
        }
    }

    clearGraphicsData()
    {
        _.each( this.graphicsData , function(d){
            d.destroy();
        } );
        this.graphicsData.length = 0;
    }

    $watch(name, value, preValue) 
    {
        this.watch( name, value, preValue );
    }

    initCompProperty(opt)
    {
        for( var i in opt ){
           if( i != "id" && i != "context"){
               this[i] = opt[i];
           }
        }
    }

   /*
    * 画虚线
    */
   dashedLineTo(graphics, x1, y1, x2, y2, dashLength ) 
   {
         dashLength = typeof dashLength == 'undefined'
                      ? 3 : dashLength;
         dashLength = Math.max( dashLength , this.context.lineWidth );
         var deltaX = x2 - x1;
         var deltaY = y2 - y1;
         var numDashes = Math.floor(
             Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength
         );
         for (var i = 0; i < numDashes; ++i) {
             var x = parseInt(x1 + (deltaX / numDashes) * i);
             var y = parseInt(y1 + (deltaY / numDashes) * i);
             graphics[i % 2 === 0 ? 'moveTo' : 'lineTo']( x , y );
             if( i == (numDashes-1) && i%2 === 0){
                 graphics.lineTo( x2 , y2 );
             }
         }
   }

   /*
    *从cpl节点中获取到4个方向的边界节点
    *@param  context 
    *
    **/
   getRectFormPointList( context )
   {
       var minX =  Number.MAX_VALUE;
       var maxX =  Number.MIN_VALUE;
       var minY =  Number.MAX_VALUE;
       var maxY =  Number.MIN_VALUE;

       var cpl = context.pointList; //this.getcpl();
       for(var i = 0, l = cpl.length; i < l; i++) {
           if (cpl[i][0] < minX) {
               minX = cpl[i][0];
           }
           if (cpl[i][0] > maxX) {
               maxX = cpl[i][0];
           }
           if (cpl[i][1] < minY) {
               minY = cpl[i][1];
           }
           if (cpl[i][1] > maxY) {
               maxY = cpl[i][1];
           }
       };

       var lineWidth;
       if (context.strokeStyle || context.fillStyle  ) {
           lineWidth = context.lineWidth || 1;
       } else {
           lineWidth = 0;
       }
       return {
           x      : Math.round(minX - lineWidth / 2),
           y      : Math.round(minY - lineWidth / 2),
           width  : maxX - minX + lineWidth,
           height : maxY - minY + lineWidth
       };
   }
}