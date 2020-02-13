import SystemRenderer from '../SystemRenderer';
import { RENDERER_TYPE } from '../../const';
import Settings from '../../settings';
import WebGLStageRenderer from "./WebGLStageRenderer";
import _ from "../../utils/underscore";

export default class WebGLRenderer extends SystemRenderer
{
    constructor(app , options = {})
    {
        super(RENDERER_TYPE.CANVAS, app, options);
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
        this._render( stage );
        stage.stageRending = false;
    }

    _render( stage , displayObject )
    {
        if( !displayObject ){
            displayObject = stage;
        };


        if( displayObject.graphics ){
            if( !displayObject.context.$model.visible || displayObject.context.$model.globalAlpha <= 0 ){
                return;
            };

            if( !displayObject.graphics.graphicsData.length ){
                displayObject._draw( displayObject.graphics );
            };

            stage.webGLStageRenderer.render( displayObject, stage );
        };

        if( displayObject.children ){
            for(var i = 0, len = displayObject.children.length; i < len; i++) {
                this._render( stage , displayObject.children[i] );
            }
        };

    }

    _clear( stage )
    {
        stage.webGLStageRenderer.clear();
    }
}

