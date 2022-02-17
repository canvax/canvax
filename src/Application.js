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
import DisplayObjectContainer from "./display/DisplayObjectContainer";
import Stage from "./display/Stage";
import autoRenderer from "./renderers/autoRenderer";
import Matrix from "./geom/Matrix";

import _ from "./utils/underscore";
import $ from "./utils/dom";
import event from "./event/index";

import Settings from './settings';

export default class Application extends DisplayObjectContainer
{
    constructor( opt )
    {
        opt.type = "canvax";

        super( opt );

        this.uid = opt.uid || new Date().getTime() + "_" + Math.floor(Math.random()*100); 
        Settings.RESOLUTION = opt.devicePixelRatio || (typeof (window) !== 'undefined' ? window.devicePixelRatio : 1);

        this.el = $.query(opt.el);

        //优先使用外部传入的width
        this.width  = opt.width  || parseInt("width"  in opt || this.el.offsetWidth  , 10); 
        this.height = opt.height || parseInt("height" in opt || this.el.offsetHeight , 10); 

        //小程序的话 没有el， 也就么有domview了
        if( this.el ){
            var viewObj = $.createView(this.width , this.height, this.uid);
            this.view = viewObj.view;
            this.stageView = viewObj.stageView;
            this.domView = viewObj.domView;
            
            this.el.innerHTML = "";
            this.el.appendChild( this.view );
        };

        this.viewOffset = opt.viewOffset || $.offset(this.view);
        this.lastGetRO = 0;//最后一次获取 viewOffset 的时间

        this.renderer = autoRenderer(this , opt);

        this.event = null; 

        //该属性在systenRender里面操作，每帧由心跳上报的 需要重绘的stages 列表
        this.convertStages = {};

        this.context.$model.width  = this.width;
        this.context.$model.height = this.height; 

        //然后创建一个用于绘制激活 shape 的 stage 到activation
        this._bufferStage = this._creatHoverStage( opt );

        //设置一个默认的matrix做为app的世界根节点坐标
        this.worldTransform = new Matrix().identity();
    }

    registEvent(opt)
    {
        //初始化事件委托到root元素上面
        this.event = new event.Handler( this , opt);;
        this.event.init();
        return this.event;
    }

    destroy()
    {
        for( var i=0,l=this.children.length; i<l; i++ ){
            var stage = this.children[i];
            stage.destroy();
            stage.canvas = null;
            stage.ctx = null;
            stage = null;
            i--,l--;
        };
        try {
            this.view.removeChild( this.stageView );
            this.view.removeChild( this.domView );
            this.el.removeChild( this.view );
        } catch(e){};

        this.el && (this.el.innerHTML = "");

        this.event = null;
        this._bufferStage = null;
    }

    resize( opt )
    {
        //重新设置坐标系统 高宽 等。
        this.width  = parseInt((opt && "width" in opt) || this.el.offsetWidth  , 10); 
        this.height = parseInt((opt && "height" in opt) || this.el.offsetHeight , 10); 

        //this.view  width height都一直设置为100%
        //this.view.style.width  = this.width +"px";
        //this.view.style.height = this.height+"px";

        if(this.view){
            this.viewOffset = $.offset(this.view);
        };
    
        this.context.$model.width  = this.width;
        this.context.$model.height = this.height;

        var me = this;
        var reSizeCanvas = function(canvas){
            canvas.style.width = me.width + "px";
            canvas.style.height= me.height+ "px";
            canvas.setAttribute("width"  , me.width * Settings.RESOLUTION);
            canvas.setAttribute("height" , me.height* Settings.RESOLUTION);
        }; 
        _.each(this.children , function(s , i){
            s.context.$model.width = me.width;
            s.context.$model.height= me.height;
            reSizeCanvas(s.canvas);
        });

        this.stageView.style.width  = this.width  + "px";
        this.stageView.style.height = this.height + "px";
        this.domView.style.width  = this.width  + "px";
        this.domView.style.height = this.height + "px";

        this.heartBeat();
    }

    getHoverStage()
    {
        return this._bufferStage;
    }

    _creatHoverStage( opt )
    {
        //TODO:创建stage的时候一定要传入width height  两个参数
        this._bufferStage = new Stage( {
            id : "activCanvas"+(new Date()).getTime(),    
            ctx : opt.activCanvas || null
        } );
        //该stage不参与事件检测
        this._bufferStage._eventEnabled = false;
        this.addChild( this._bufferStage );
        return this._bufferStage
    }

    //小程序等不支持dom获取的地址需要手动调用下updateViewOffset()
    updateViewOffset( viewOffset )
    {
        var now = new Date().getTime();
        if( now - this.lastGetRO > 1000 ){
            this.viewOffset = viewOffset || $.offset(this.view);
            this.lastGetRO  = now;
        }
    }
    
    _afterAddChild( stage , index )
    {
        var canvas;

        if(!stage.canvas){
            canvas = $.createCanvas( this.context.$model.width , this.context.$model.height, stage.id );
        } else {
            canvas = stage.canvas;
        };

        if( this.stageView ){
            if( this.children.length == 1 ){
                this.stageView.appendChild( canvas );
            } else if(this.children.length>1) {
                if( index === undefined ) {
                    //如果没有指定位置，那么就放到 _bufferStage 的下面。
                    this.stageView.insertBefore( canvas , this._bufferStage.canvas);
                } else {
                    //如果有指定的位置，那么就指定的位置来
                    if( index >= this.children.length-1 ){
                        this.stageView.appendChild( canvas );
                    } else {
                        this.stageView.insertBefore( canvas , this.children[ index ].canvas );
                    }
                }
            };
        };

        Utils.initElement( canvas );

        stage.initStage( canvas , this.context.$model.width , this.context.$model.height ); 
    }

    _afterDelChild(stage)
    {
        try {
            this.stageView && stage.canvas && this.stageView.removeChild( stage.canvas );
        } catch (error) {}
    }
    
    heartBeat(opt)
    {
        if( this.children.length > 0 ){
            this.renderer.heartBeat(opt);
        }
    }

    toDataURL()
    {
        var canvas = $.createCanvas( this.width , this.height, "curr_base64_canvas" );
        var ctx = canvas.getContext("2d");
        _.each( this.children , function( stage ){
            ctx.drawImage( stage.canvas , 0 , 0 );
        } );
        return canvas.toDataURL();
    }

    //一些不能动态创建_pixelCtx用来做文本检测的环境，要支持可以从外面传一个ctx进来
    setPixelCtx( ctx ){
        Utils._pixelCtx = ctx;
    }
}