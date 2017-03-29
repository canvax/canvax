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
        this._clear( stage );
        this._render( stage );
        stage.stageRending = false;
    }

    _render( stage , displayObject )
    {
        if( !displayObject ){
            displayObject = stage;
        };

        //因为已经采用了setTransform了， 非shape元素已经不需要执行transform 和 render
        if( displayObject.graphics ){
            if( !displayObject.context.$model.visible || displayObject.context.$model.globalAlpha <= 0 ){
                return;
            };

            var ctx = stage.ctx;
            
            ctx.setTransform.apply( ctx , displayObject.worldTransform.toArray() );
            
            if( !displayObject.graphics.graphicsData.length ){
                //当渲染器开始渲染app的时候，app下面的所有displayObject都已经准备好了对应的世界矩阵
                displayObject._draw( stage, displayObject.graphics );//_draw会完成绘制准备好 graphicsData
            };

            this.CGR.render( displayObject , stage, this );
        };

        if( displayObject.children ){
	        for(var i = 0, len = displayObject.children.length; i < len; i++) {
	        	this._render( stage , displayObject.children[i] );
	        }
	    };

    }

    _clear( stage )
    {
        var ctx = stage.ctx;
        ctx.setTransform.apply( ctx , stage.worldTransform.toArray() );
        ctx.clearRect( 0, 0, this.app.width , this.app.height );
    }
}

