/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
import _ from "../utils/underscore";
import Utils from "../utils/index";

var CanvaxEvent = function( evt , params ) {
	
	var eventType = "CanvaxEvent"; 
    if( _.isString( evt ) ){
    	eventType = evt;
    };
    if( _.isObject( evt ) && evt.type ){
    	eventType = evt.type;
    };

    this.target = null;
    this.currentTarget = null;	
    this.type   = eventType;
    this.point  = null;

    this._stopPropagation = false ; //默认不阻止事件冒泡
}
CanvaxEvent.prototype = {
    stopPropagation : function() {
        this._stopPropagation = true;
    }
}
export default CanvaxEvent;