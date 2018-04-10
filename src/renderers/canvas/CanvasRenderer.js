import SystemRenderer from '../SystemRenderer';
import { RENDERER_TYPE } from '../../const';
import Settings from '../../settings';
import CGR from "../../graphics/canvas/GraphicsRenderer";
import _ from "../../utils/underscore";

export default class CanvasRenderer extends SystemRenderer
{
    constructor(app, options={})
    {
        super(RENDERER_TYPE.CANVAS, app, options);
        this.CGR = new CGR(this);
    }

    render( app )
    {
    	var me = this;
        me.app = app;
    	_.each(_.values( app.convertStages ) , function(convertStage){
            me.renderStage( convertStage.stage );
        });
        app.convertStages = {};
    }

    renderStage( stage )
    {
        if(!stage.ctx){
            stage.ctx = stage.canvas.getContext("2d");
        }
        stage.stageRending = true;
        stage.setWorldTransform();
        this._clear( stage );
        this._render( stage , stage, stage.context.globalAlpha );
        stage.stageRending = false;
    }

    _render( stage , displayObject , globalAlpha )
    {
        var ctx = stage.ctx;

        if( !ctx ){
            return;
        };

        var $MC = displayObject.context.$model;

        if( !displayObject.worldTransform || displayObject._transformChange || displayObject.parent._transformChange ){
            displayObject.setWorldTransform();
            displayObject._transformChange = true;
        };

        globalAlpha *= $MC.globalAlpha;

        if( !$MC.visible || !globalAlpha || displayObject.isClip ){
            return;
        };

        
        ctx.setTransform.apply( ctx , displayObject.worldTransform.toArray() );

        var isClipSave = false;
        if( displayObject.clip && displayObject.clip.graphics ){
            //如果这个对象有一个裁剪路径对象，那么就绘制这个裁剪路径
            var _clip = displayObject.clip;
            ctx.save();
            isClipSave = true;

            if( !_clip.worldTransform || _clip._transformChange || _clip.parent._transformChange ){
                _clip.setWorldTransform();
                _clip._transformChange = true;
            };
            ctx.setTransform.apply( ctx , _clip.worldTransform.toArray() );

            //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据
            if( !_clip.graphics.graphicsData.length ){
                //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
                _clip._draw( _clip.graphics );//_draw会完成绘制准备好 graphicsData
            };
            this.CGR.render( _clip , stage, globalAlpha, isClipSave );
            
            _clip._transformChange = false;

            ctx.clip();
        };

        //因为已经采用了setTransform了， 非shape元素已经不需要执行transform 和 render
        if( displayObject.graphics ){
            //如果 graphicsData.length==0 的情况下才需要执行_draw来组织graphics数据
            if( !displayObject.graphics.graphicsData.length ){
                //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
                displayObject._draw( displayObject.graphics );//_draw会完成绘制准备好 graphicsData
            };
            this.CGR.render( displayObject , stage, globalAlpha );
        };

        if( displayObject.type == "text" ){
            //如果是文本
            displayObject.render( ctx , globalAlpha );
        };

        if( displayObject.children ){
	        for(var i = 0, len = displayObject.children.length; i < len; i++) {
	        	this._render( stage , displayObject.children[i] , globalAlpha );
	        }
	    };

        displayObject._transformChange = false;

        if( isClipSave ){
            //如果这个对象有裁剪对象， 则要恢复，裁剪之前的环境
            ctx.restore();
        };

    }

    _clear( stage )
    {
        var ctx = stage.ctx;
        ctx.setTransform.apply( ctx , stage.worldTransform.toArray() );
        ctx.clearRect( 0, 0, this.app.width , this.app.height );
    }
}

