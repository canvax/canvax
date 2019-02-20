/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
import DisplayObject from "./DisplayObject";
import Utils from "../utils/index";
import {_} from "mmvis";
import {SHAPE_CONTEXT_DEFAULT, STYLE_PROPS} from "../const";
import Graphics from "../graphics/Graphics";

export default class Shape extends DisplayObject
{
    constructor(opt){
        opt = Utils.checkOpt( opt );
        var styleContext = {
            cursor        : opt.context.cursor     || "default",

            fillAlpha     : opt.context.fillAlpha  || 1,//context2d里没有，自定义
            fillStyle     : opt.context.fillStyle  || null,//"#000000",

            lineCap       : opt.context.lineCap    || "round",//默认都是直角
            lineJoin      : opt.context.lineJoin   || "round",//这两个目前webgl里面没实现
            miterLimit    : opt.context.miterLimit || null,//miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

            lineAlpha     : opt.context.lineAlpha  || 1,//context2d里没有，自定义
            strokeStyle   : opt.context.strokeStyle|| null,
            lineType      : opt.context.lineType   || "solid", //context2d里没有，自定义线条的type，默认为实线
            lineDash      : opt.context.lineDash   || [6,3],
            lineWidth     : opt.context.lineWidth  || null
        };
         
        var _context = _.extend( true, styleContext , opt.context );
        opt.context = _context;

        if( opt.id === undefined && opt.type !== undefined ){
            opt.id = Utils.createId(opt.type);
        };

        super( opt );

        //over的时候如果有修改样式，就为true
        this._hoverClass = false;
        this.hoverClone  = true;    //是否开启在hover的时候clone一份到active stage 中 
        this.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

        this._eventEnabled   = false; //是否响应事件交互,在添加了事件侦听后会自动设置为true

        this.dragEnabled     = opt.dragEnabled || false ;//"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽

         //拖拽drag的时候显示在activShape的副本
        this._dragDuplicate = null;

        this.type = this.type || "shape" ;
        
        //处理所有的图形一些共有的属性配置,把除开id,context之外的所有属性，全部挂载到this上面
        this.initCompProperty(opt);

        //如果该元素是clone而来，则不需要绘制
        if( !this.isClone ){
            //如果是clone对象的话就直接
            this.graphics = new Graphics();
            this._draw( this.graphics );
        } else {
            this.graphics = null;
        }

    }

    _draw( graphics )
    {
        if(graphics.graphicsData.length == 0){
            //先设置好当前graphics的style
            graphics.setStyle( this.context );
            this.draw( graphics );
        }
    }

    draw()
    {

    }

    clearGraphicsData()
    {
        this.graphics.clear();
    }

    $watch(name, value, preValue)
    {
        if( _.indexOf( STYLE_PROPS , name ) > -1 ){
            this.graphics.setStyle( this.context );
        }
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

    getBound()
    {
        return this.graphics.updateLocalBounds().Bound
    }

}