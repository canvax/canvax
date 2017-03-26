import SystemRenderer from '../SystemRenderer';
import { RENDERER_TYPE } from '../../const';
import Settings from '../../settings';
import WebGLStageRenderer from "./WebGLStageRenderer";
import Graphics from "../../graphics/Graphics";
import _ from "../../utils/underscore";

export default class WebGLRenderer extends SystemRenderer
{
    constructor(app , options = {})
    {
        super(RENDERER_TYPE.CANVAS, app, options);
        this.graphics = new Graphics();
    }

    render( app , options = {} )
    {
        var me = this;
        
        me.app = app;
        _.extend( this.options , options );

        _.each(_.values( app.convertStages ) , function(convertStage){
            me.renderStage( convertStage.stage );
        });

        app.convertStages = {};
    }

    renderStage( stage )
    {
        if(!stage.webGLStageRenderer){
            stage.webGLStageRenderer = new WebGLStageRenderer( stage , app , this.options);
        };
        stage.stageRending = true;
        this._clear( stage );
        this._setGraphicsData( stage );
        if( this.graphics.graphicsData.length > 0 ){
            stage.webGLStageRenderer.render( stage , this.graphics);
        }
        stage.stageRending = false;
    }

    _setGraphicsData( stage , displayObject )
    {
        if( !displayObject ){
            displayObject = stage;
        };

        if( !displayObject.context.visible || displayObject.context.globalAlpha <= 0 ){
            return;
        };

        if( displayObject.graphicsData ){
            displayObject._draw( stage, this.graphics );//_draw会完成绘制准备好 graphicsData
            //stage.webGLStageRenderer.render( displayObject, stage , this.graphics);
        };

        if( displayObject.children ){
            for(var i = 0, len = displayObject.children.length; i < len; i++) {
                this._setGraphicsData( stage , displayObject.children[i] );
            }
        };
    }

    _clear( stage )
    {
        stage.webGLStageRenderer.clear();
    }
}

