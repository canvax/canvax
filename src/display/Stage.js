/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * stage 类， 再as3中，stage则代表整个舞台。是唯一的根节点
 * 但是再canvax中，因为分层设计的需要。stage 舞台 同样代表一个canvas元素，但是不是再整个引擎设计
 * 里面， 不是唯一的根节点。而是会交由canvax类来统一管理其层级
 */
import DisplayObjectContainer from "./DisplayObjectContainer";
import Settings from '../settings';

export default class Stage extends DisplayObjectContainer
{
    constructor( opt )
    {
        
        opt.type = "stage";

        super( opt );

        this.canvas = null;

        //渲染的时候由renderer决定,这里不做初始值, 也接受外界手动设置好的ctx
        this.ctx = opt.ctx || null;
        
        //stage正在渲染中
        this.stageRending = false;
        this._isReady = false;
    }


    //由canvax的afterAddChild 回调
    //width、height都是app的width， 如果后续有每个stage设置不同的width和height，在判断opt里面的width和height
    initStage( canvas , width , height )
    {
        var self = this;
        self.canvas = canvas;
        var model = self.context;
        model.width  = width;
        model.height = height;
        model.scaleX = Settings.RESOLUTION;
        model.scaleY = Settings.RESOLUTION;
        
        self._isReady = true;
    }

    heartBeat( opt )
    {
        //shape , name , value , preValue 
        //displayList中某个属性改变了
        if (!this._isReady) {
           //在stage还没初始化完毕的情况下，无需做任何处理
           return;
        };
        opt || ( opt = {} ); //如果opt为空，说明就是无条件刷新
        opt.stage   = this;

        //TODO临时先这么处理
        this.parent && this.parent.heartBeat(opt);
    }
}