/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
import _ from "../utils/underscore";

var Event = function( evt ) {
	var eventType = "CanvaxEvent"; 
    if( _.isString( evt ) ){
    	eventType = evt;
    };
    if( _.isObject( evt ) && evt.type ){
        eventType = evt.type;
        _.extend( this,evt );
    };

    this.target = null;
    this.currentTarget = null;
    this.type   = eventType;
    this.point  = null;

    var me = this;
    this._stopPropagation   = false; //默认不阻止事件冒泡
    this.stopPropagation    = function() {
        me._stopPropagation = true;
        if( _.isObject( evt ) ){
            evt._stopPropagation = true;
        };
    };
    this._preventDefault    = false;  //是否组织事件冒泡
    this.preventDefault     = function(){
        me._preventDefault  = true;
        if( _.isObject( evt ) ){
            evt._preventDefault = true;
        };
    };
};

/*
Event.prototype = {
    stopPropagation : function() {
        this._stopPropagation = true;
    },
    preventDefault  : function(){
        this._preventDefault = true;
    }
};
*/

export default Event