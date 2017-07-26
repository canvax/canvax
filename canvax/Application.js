/**
 * Application {{PKG_VERSION}}
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 主引擎 类
 *
 * 负责所有canvas的层级管理，和心跳机制的实现,捕获到心跳包后 
 * 分发到对应的stage(canvas)来绘制对应的改动
 * 然后 默认有实现了shape的 mouseover  mouseout  drag 事件
 *
 **/

import Utils from "./utils/index";
import EventHandler from "./event/EventHandler";
import DisplayObjectContainer from "./display/DisplayObjectContainer";
import Stage from "./display/Stage";
import autoRenderer from "./renderers/autoRenderer";
import Matrix from "./geom/Matrix";


//utils
import _ from "./utils/underscore";
import $ from "./utils/dom";

export default class Application extends DisplayObjectContainer
{
    constructor( opt , options = {} )
    {
        opt.type = "canvax";

        super( opt );

        this._cid = new Date().getTime() + "_" + Math.floor(Math.random()*100); 
        
        this.el = $.query(opt.el);

        this.width = parseInt("width"  in opt || this.el.offsetWidth  , 10); 
        this.height = parseInt("height" in opt || this.el.offsetHeight , 10); 

        var viewObj = $.createView(this.width , this.height, this._cid);
        this.view = viewObj.view;
        this.stage_c = viewObj.stage_c;
        this.dom_c = viewObj.dom_c;
        
        this.el.innerHTML = "";
        this.el.appendChild( this.view );

        this.viewOffset = $.offset(this.view);
        this.lastGetRO = 0;//最后一次获取 viewOffset 的时间

        this.webGL  = opt.webGL;
        this.renderer = autoRenderer(this , options);

        this.event = null;

        

        //是否阻止浏览器默认事件的执行
        this.preventDefault = true;
        if( opt.preventDefault === false ){
            this.preventDefault = false
        };

        //该属性在systenRender里面操作，每帧由心跳上报的 需要重绘的stages 列表
        this.convertStages = {};

        this.context.$model.width  = this.width;
        this.context.$model.height = this.height; 


        //然后创建一个用于绘制激活 shape 的 stage 到activation
        this._bufferStage = null;
        this._creatHoverStage();


        //把所有的文字单独放在一个stage中，为了兼容后续的webgl渲染的时候，text依然采用canvas2d渲染
        this._textStage = null;
        this._creatTextStage();


        //创建一个如果要用像素检测的时候的容器
        this._createPixelContext();

        //设置一个默认的matrix做为app的世界根节点坐标
        this.worldTransform = new Matrix().identity();
    }

    registEvent(opt)
    {
        //初始化事件委托到root元素上面
        this.event = new EventHandler( this , opt);;
        this.event.init();
        return this.event;
    }

    resize( opt )
    {
        //重新设置坐标系统 高宽 等。
        this.width  = parseInt((opt && "width" in opt) || this.el.offsetWidth  , 10); 
        this.height = parseInt((opt && "height" in opt) || this.el.offsetHeight , 10); 

        this.view.style.width  = this.width +"px";
        this.view.style.height = this.height+"px";

        this.viewOffset = $.offset(this.view);
        this.context.$model.width  = this.width;
        this.context.$model.height = this.height;

        var me = this;
        var reSizeCanvas    = function(ctx){
            var canvas = ctx.canvas;
            canvas.style.width = me.width + "px";
            canvas.style.height= me.height+ "px";
            canvas.setAttribute("width"  , me.width * Utils._devicePixelRatio);
            canvas.setAttribute("height" , me.height* Utils._devicePixelRatio);

            //如果是swf的话就还要调用这个方法。
            if (ctx.resize) {
                ctx.resize(me.width , me.height);
            }
        }; 
        _.each(this.children , function(s , i){
            s.context.$model.width = me.width;
            s.context.$model.height= me.height;
            reSizeCanvas(s.canvas);
        });

        this.dom_c.style.width  = this.width  + "px";
        this.dom_c.style.height = this.height + "px";

        this.heartBeat();

    }

    getHoverStage()
    {
        return this._bufferStage;
    }

    _creatHoverStage()
    {
        //TODO:创建stage的时候一定要传入width height  两个参数
        this._bufferStage = new Stage( {
            id : "activCanvas"+(new Date()).getTime(),
            context : {
                width : this.context.$model.width,
                height: this.context.$model.height
            }
        } );
        //该stage不参与事件检测
        this._bufferStage._eventEnabled = false;
        this.addChild( this._bufferStage );
    }

    _creatTextStage()
    {
        this._textStage = new Stage( {
            id : "textCanvas"+(new Date()).getTime(),
            context : {
                width : this.context.$model.width,
                height: this.context.$model.height
            }
        } );

        this.addChild( this._textStage , 0 );
        this._textStage.ctx = this._textStage.canvas.getContext('2d');
    }

    /**
     * 用来检测文本width height 
     * @return {Object} 上下文
    */
    _createPixelContext() 
    {
        var _pixelCanvas = $.query("_pixelCanvas");
        if(!_pixelCanvas){
            _pixelCanvas = $.createCanvas(0, 0, "_pixelCanvas"); 
        } else {
            //如果又的话 就不需要在创建了
            return;
        };
        document.body.appendChild( _pixelCanvas );
        Utils.initElement( _pixelCanvas );
        if( Utils.canvasSupport() ){
            //canvas的话，哪怕是display:none的页可以用来左像素检测和measureText文本width检测
            _pixelCanvas.style.display    = "none";
        } else {
            //flashCanvas 的话，swf如果display:none了。就做不了measureText 文本宽度 检测了
            _pixelCanvas.style.zIndex     = -1;
            _pixelCanvas.style.position   = "absolute";
            _pixelCanvas.style.left       = -this.context.$model.width  + "px";
            _pixelCanvas.style.top        = -this.context.$model.height + "px";
            _pixelCanvas.style.visibility = "hidden";
        }
        Utils._pixelCtx = _pixelCanvas.getContext('2d');
    }

    updateViewOffset()
    {
        var now = new Date().getTime();
        if( now - this.lastGetRO > 1000 ){
            this.viewOffset      = $.offset(this.view);
            this.lastGetRO       = now;
        }
    }
    
    _afterAddChild( stage , index )
    {
        var canvas;

        if(!stage.canvas){
            canvas = $.createCanvas( this.context.$model.width , this.context.$model.height, stage.id );
        } else {
            canvas = stage.canvas;
        }

        if(this.children.length == 1){
            this.stage_c.appendChild( canvas );
        } else if(this.children.length>1) {
            if( index === undefined ) {
                //如果没有指定位置，那么就放到 _bufferStage 的下面。
                
                if( this._textStage.canvas ){
                    this.stage_c.insertBefore( canvas , this._textStage.canvas);
                } else if( this._bufferStage.canvas ){
                    this.stage_c.insertBefore( canvas , this._bufferStage.canvas);
                };
                
            } else {
                //如果有指定的位置，那么就指定的位置来
                if( index >= this.children.length-1 ){
                   this.stage_c.appendChild( canvas );
                } else {
                   this.stage_c.insertBefore( canvas , this.children[ index ].canvas );
                }
            }
        };

        Utils.initElement( canvas );
        stage.initStage( canvas , this.context.$model.width , this.context.$model.height ); 
    }

    _afterDelChild(stage)
    {
        this.stage_c.removeChild( stage.canvas );
    }
    
    heartBeat(opt)
    {
        if( this.children.length > 0 ){
            this.renderer.heartBeat(opt);
        }
    }

    toDataURL()
    {
        var canvas = Base._createCanvas( "curr_base64_canvas" , this.width , this.height );
        var ctx = canvas.getContext("2d");

        _.each( this.children , function( stage ){
            ctx.drawImage( stage.canvas , 0 , 0 );
        } );
        
        return canvas.toDataURL();
    }
}