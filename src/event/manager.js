/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 事件管理类
 */
import types from "./types";
import _ from "../utils/underscore";


/**
 * 构造函数.
 * @name EventDispatcher
 * @class EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
 */
var Manager = function() {
    //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
    this._eventMap = {};
};

Manager.prototype = { 
    /**
     * 判断events里面是否有用户交互事件
     */
    _setEventEnable : function(){
        if( this.children ) return; //容器的_eventEnabled不受注册的用户交互事件影响

        var hasInteractionEvent = false;
      
        for( var t in this._eventMap ){
            if( _.indexOf( types.get(), t ) > -1 ){
                hasInteractionEvent = true;
            };
        };
        this._eventEnabled = hasInteractionEvent;
    },
    /*
     * 注册事件侦听器对象，以使侦听器能够接收事件通知。
     */
    _addEventListener : function( _type, listener) {

        if( typeof listener != "function" ){
          //listener必须是个function呐亲
          return false;
        }
        var addResult = true;
        var self      = this;
        var types     = _type;
        if( _.isString( _type ) ){
            types = _type.split(/,| /);
        };
        _.each( types , function(type){
            var map = self._eventMap[type];
            if(!map){
                map = self._eventMap[type] = [];
                map.push(listener);
                //self._eventEnabled = true;
                self._setEventEnable();
                return true;
            }

            if(_.indexOf(map ,listener) == -1) {
                map.push(listener);
                //self._eventEnabled = true;
                self._setEventEnable();
                return true;
            }

            addResult = false;
        });
        return addResult;
    },
    /**
     * 删除事件侦听器。
     */
    _removeEventListener : function(type, listener) {
        if(arguments.length == 1) return this.removeEventListenerByType(type);

        var map = this._eventMap[type];
        if(!map){
            return false;
        }

        for(var i = 0; i < map.length; i++) {
            var li = map[i];
            if(li === listener) {
                map.splice(i, 1);
                if(map.length    == 0) { 
                    delete this._eventMap[type];
                    this._setEventEnable();
                    //如果这个如果这个时候child没有任何事件侦听
                    /*
                    if(_.isEmpty(this._eventMap)){
                        //那么该元素不再接受事件的检测
                        this._eventEnabled = false;
                    }
                    */
                }
                return true;
            }
        }
        
        return false;
    },
    /**
     * 删除指定类型的所有事件侦听器。
     */
    _removeEventListenerByType : function(type) {
        var map = this._eventMap[type];
        if(!map) {
            delete this._eventMap[type];
            this._setEventEnable();
            //如果这个如果这个时候child没有任何事件侦听
            /*
            if(_.isEmpty(this._eventMap)){
                //那么该元素不再接受事件的检测
                this._eventEnabled = false;
            }
            */
            return true;
        }
        return false;
    },
    /**
     * 删除所有事件侦听器。
     */
    _removeAllEventListeners : function() {	
        this._eventMap = {};
        this._eventEnabled = false;
    },
    /**
    * 派发事件，调用事件侦听器。
    */
    _dispatchEvent : function(e) {
        var map = this._eventMap[e.type];
        
        if( map ){
            if(!e.target) e.target = this;
            if(!e.currentTarget) e.currentTarget = this;
            map = map.slice();

            for(var i = 0; i < map.length; i++) {
                var listener = map[i];
                if(typeof(listener) == "function") {
                    listener.call(this, e);
                }
            }
        }

        if( !e._stopPropagation ) {
            //向上冒泡
            if( this.parent ){
                e.currentTarget = this.parent;
                this.parent._dispatchEvent( e );
            }
        } 
        return true;
    },
    /**
       * 检查是否为指定事件类型注册了任何侦听器。
       */
    _hasEventListener : function(type) {
        var map = this._eventMap[type];
        return map != null && map.length > 0;
    }
}

export default Manager;
