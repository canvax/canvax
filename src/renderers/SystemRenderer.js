import { RENDERER_TYPE } from '../const';
import settings from '../settings';
import AnimationFrame from "../animation/AnimationFrame";
import Utils from "../utils/index";
import {_} from "mmvis";

export default class SystemRenderer
{
    constructor( type=RENDERER_TYPE.UNKNOWN , app , options )
    {
    	this.type = type; //2canvas,1webgl
        this.app = app;

        if ( options )
        {
            for (const i in settings.RENDER_OPTIONS)
            {
                if (typeof options[i] === 'undefined')
                {
                    options[i] = settings.RENDER_OPTIONS[i];
                }
            }
        }
        else
        {
            options = settings.RENDER_OPTIONS;
        }

        this.options = options;


        this.requestAid = null;

		this._heartBeat = false;//心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

		this._preRenderTime = 0;
    }

    //如果引擎处于静默状态的话，就会启动
    startEnter()
    {
       var self = this;
       if( !self.requestAid ){
           self.requestAid = AnimationFrame.registFrame( {
               id : "enterFrame", //同时肯定只有一个enterFrame的task
               task : function(){
                    self.enterFrame.apply(self);
               }
           } );
       }
    }

    enterFrame()
    {
        var self = this;
        //不管怎么样，enterFrame执行了就要把
        //requestAid null 掉
        self.requestAid = null;
        Utils.now = new Date().getTime();
        if( self._heartBeat ){

            //var _begin = new Date().getTime();
            this.app.children.length && self.render( this.app );
            //var _end = new Date().getTime();
            //$(document.body).append( "<br />render："+ (_end - _begin) );
            
            self._heartBeat = false;
            //渲染完了，打上最新时间挫
            self._preRenderTime = new Date().getTime();
        };
    }

    _convertCanvax(opt)
    {
        var me = this;
        _.each( me.app.children , function(stage){
            stage.context[opt.name] = opt.value; 
        } );  
    }

    heartBeat( opt )
    {
        //displayList中某个属性改变了
        var self = this;
        if( opt ){
            //心跳包有两种，一种是某元素的可视属性改变了。一种是children有变动
            //分别对应convertType  为 context  and children
            if (opt.convertType == "context"){
                var stage   = opt.stage;
                var shape   = opt.shape;
                var name    = opt.name;
                var value   = opt.value;
                var preValue= opt.preValue;

                if( shape.type == "canvax" ){
                    self._convertCanvax(opt)
                } else {
                    if(!self.app.convertStages[stage.id]){
                        self.app.convertStages[stage.id]={
                            stage : stage,
                            convertShapes : {}
                        }
                    };
                    if(shape){
                        if (!self.app.convertStages[ stage.id ].convertShapes[ shape.id ]){
                            self.app.convertStages[ stage.id ].convertShapes[ shape.id ]={
                                shape : shape,
                                convertType : opt.convertType
                            }
                        } else {
                            //如果已经上报了该 shape 的心跳。
                            return;
                        }
                    }
                };
            };

            if (opt.convertType == "children"){
                //元素结构变化，比如addchild removeChild等
                var target = opt.target;
                var stage = opt.src.getStage();
                if( stage || (target.type=="stage") ){
                    //如果操作的目标元素是Stage
                    stage = stage || target;
                    if(!self.app.convertStages[stage.id]) {
                        self.app.convertStages[stage.id]={
                            stage : stage,
                            convertShapes : {}
                        }
                    }
                }
            }

            if(!opt.convertType){
                //无条件要求刷新
                var stage = opt.stage;
                if(!self.app.convertStages[stage.id]) {
                    self.app.convertStages[stage.id]={
                        stage : stage ,
                        convertShapes : {}
                    }
                }
            }
        } else {
            //无条件要求全部刷新，一般用在resize等。
            _.each( self.app.children , function( stage , i ){
                self.app.convertStages[ stage.id ] = {
                    stage : stage,
                    convertShapes : {}
                }
            } );
        };
        if (!self._heartBeat){
           //如果发现引擎在静默状态，那么就唤醒引擎
           self._heartBeat = true;
           self.startEnter();
        } else {
           //否则智慧继续确认心跳
           self._heartBeat = true;
        }
    }
}
