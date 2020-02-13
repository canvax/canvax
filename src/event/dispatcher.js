/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 事件派发类
 */
import Manager from "./manager";
import Event from "./event";
import _ from "../utils/underscore";


export default class Dispatcher extends Manager
{
    constructor()
    {
        super();
    }

    on(type, listener)
    {
        this._addEventListener( type, listener);
        return this;
    }

    addEventListener(type, listener)
    {
        this._addEventListener( type, listener);
        return this;
    }

    un(type,listener)
    {
        this._removeEventListener( type, listener);
        return this;
    }

    removeEventListener(type,listener)
    {
        this._removeEventListener( type, listener);
        return this;
    }

    removeEventListenerByType(type)
    {
        this._removeEventListenerByType( type);
        return this;
    }

    removeAllEventListeners()
    {
        this._removeAllEventListeners();
        return this;
    }

    //params 要传给evt的eventhandler处理函数的参数，会被merge到Canvax event中
    fire(eventType , params)
    {
        //{currentTarget,point,target,type,_stopPropagation}
        var e = new Event( eventType );

        if( params ){
            for( var p in params ){
                if( p != "type" ){
                    e[p] = params[p];
                }
            }
        };

        var me = this;
        _.each( eventType.split(" ") , function(eType){
            //然后，currentTarget要修正为自己
            e.currentTarget = me;
            me.dispatchEvent( e );
        } );
        return this;
    }

    dispatchEvent(evt)
    {
        //this instanceof DisplayObjectContainer ==> this.children
        //TODO: 这里import DisplayObjectContainer 的话，在displayObject里面的import EventDispatcher from "../event/EventDispatcher";
        //会得到一个undefined，感觉是成了一个循环依赖的问题，所以这里换用简单的判断来判断自己是一个容易，拥有children
        if( this.children  && evt.point ){
            var target = this.getObjectsUnderPoint( evt.point , 1)[0];
            if( target ){
                target.dispatchEvent( evt );
            }
            return;
        };
        
        if(this.context && evt.type == "mouseover"){
            //记录dispatchEvent之前的心跳
            var preHeartBeat = this._heartBeatNum;
            var pregAlpha    = this.context.$model.globalAlpha;
            this._dispatchEvent( evt );
            if( preHeartBeat != this._heartBeatNum ){
                this._hoverClass = true;
                if( this.hoverClone ){
                    var canvax = this.getStage().parent;
                    //然后clone一份obj，添加到_bufferStage 中
                    var activShape = this.clone(true);  
                    activShape._transform = this.getConcatenatedMatrix();
                    canvax._bufferStage.addChildAt( activShape , 0 ); 
                    //然后把自己隐藏了

                    //用一个临时变量_globalAlpha 来存储自己之前的alpha
                    this._globalAlpha = pregAlpha;
                    this.context.globalAlpha = 0;
                }
            }
            return;
        };

        this._dispatchEvent( evt );

        if( this.context && evt.type == "mouseout"){
            if(this._hoverClass && this.hoverClone){
                //说明刚刚over的时候有添加样式
                var canvax = this.getStage().parent;
                this._hoverClass = false;

                canvax._bufferStage.removeChildById(this.id);
                
                if( this._globalAlpha ){
                    this.context.globalAlpha = this._globalAlpha;
                    delete this._globalAlpha;
                }
            }
        }

        return this;
    }

    hasEvent(type)
    {
        return this._hasEventListener(type);
    }

    hasEventListener(type)
    {
        return this._hasEventListener(type);
    }

    hover( overFun , outFun )
    {
        this.on("mouseover" , overFun);
        this.on("mouseout"  , outFun );
        return this;
    }

    once(type, listener)
    {
        var me = this;
        var onceHandle = function(){
            listener.apply(me , arguments);
            this.un(type , onceHandle);
        };
        this.on(type , onceHandle);
        return this;
    }
}