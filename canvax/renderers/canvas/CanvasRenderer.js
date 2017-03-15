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

        if( !displayObject.context.visible || displayObject.context.globalAlpha <= 0 ){
            return;
        };

        var ctx = stage.ctx;

        ctx.save();
        
        var transForm = displayObject._transform;
        if( !transForm ) {
            transForm = displayObject._updateTransform();
        };
        //运用矩阵开始变形
        ctx.transform.apply( ctx , transForm.toArray() );


        if( displayObject.graphics ){
            this.CGR.render( displayObject , stage );
        };

        if( displayObject.children ){
	        for(var i = 0, len = displayObject.children.length; i < len; i++) {
	        	this._render( stage , displayObject.children[i] );
	        }
	    };

        ctx.restore();
    }

    _clear( stage )
    {
        //TODO:这里有点 奇怪， 之前的版本clearRect的时候，不需要 *RESOLUTION（分辨率）
        stage.ctx.clearRect( 0, 0, this.app.width*Settings.RESOLUTION , this.app.height*Settings.RESOLUTION );
    }
}

