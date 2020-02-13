/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * canvas 上委托的事件管理
 */
import _ from "../utils/underscore";

const _mouseEvents = 'mousedown mouseup mouseover mousemove mouseout click dblclick wheel keydown keypress keyup'

export default {
    _types : _mouseEvents.split(/,| /),
    register : function( evts ){
        if( !evts ) {
            return;
        };
        if( _.isString( evts ) ){
            evts = evts.split(/,| /);
        };
        this._types = _mouseEvents.split(/,| /).concat( evts );
    },
    get: function(){
        return this._types;
    }
};