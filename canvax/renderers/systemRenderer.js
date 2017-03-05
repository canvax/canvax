import { RENDERER_TYPE } from '../const';
import AnimationFrame from "../animation/AnimationFrame";
import Utils from "../utils/index";

export default class SystemRenderer 
{
    constructor( type=RENDERER_TYPE.UNKNOWN , app )
    {
    	this.type = type; //2canvas,1webgl
        this.app = app;

        this.requestAid = null;

        //每帧由心跳上报的 需要重绘的stages 列表
		this.convertStages = {};

		this._heartBeat = false;//心跳，默认为false，即false的时候引擎处于静默状态 true则启动渲染

		this._preRenderTime = 0;

		//任务列表, 如果_taskList 不为空，那么主引擎就一直跑
		//为 含有enterFrame 方法 DisplayObject 的对象列表
		//比如 Movieclip 的enterFrame方法。
		//改属性目前主要是 movieclip 使用
		this._taskList = [];
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
            _.each(_.values( self.convertStages ) , function(convertStage){
               convertStage.stage._render( convertStage.stage.context2D );
            });
            self._heartBeat = false;
            self.convertStages = {};
            //渲染完了，打上最新时间挫
            self._preRenderTime = new Date().getTime();
        };

        //先跑任务队列,因为有可能再具体的hander中会把自己清除掉
        //所以跑任务和下面的length检测分开来
        if(self._taskList.length > 0){
           for(var i=0,l = self._taskList.length ; i < l ; i++ ){
              var obj = self._taskList[i];
              if(obj.enterFrame){
                 obj.enterFrame();
              } else {
                 self.__taskList.splice(i-- , 1);
              }
           }  
        };
        //如果依然还有任务。 就继续enterFrame.
        if(self._taskList.length > 0){
           self.startEnter();
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
                    if(!self.convertStages[stage.id]){
                        self.convertStages[stage.id]={
                            stage : stage,
                            convertShapes : {}
                        }
                    };
                    if(shape){
                        if (!self.convertStages[ stage.id ].convertShapes[ shape.id ]){
                            self.convertStages[ stage.id ].convertShapes[ shape.id ]={
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
                    if(!self.convertStages[stage.id]) {
                        self.convertStages[stage.id]={
                            stage : stage,
                            convertShapes : {}
                        }
                    }
                }
            }

            if(!opt.convertType){
                //无条件要求刷新
                var stage = opt.stage;
                if(!self.convertStages[stage.id]) {
                    self.convertStages[stage.id]={
                        stage : stage ,
                        convertShapes : {}
                    }
                }
            }
        } else {
            //无条件要求全部刷新，一般用在resize等。
            _.each( self.app.children , function( stage , i ){
                self.convertStages[ stage.id ] = {
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
