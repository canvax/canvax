import _ from "./underscore";

const RESOLUTION =  typeof (window) !== 'undefined' ? window.devicePixelRatio : 1;

var addOrRmoveEventHand = function( domHand , ieHand ){
    if( document[ domHand ] ){
        function eventDomFn( el , type , fn ){
            if( el.length ){
                for(var i=0 ; i < el.length ; i++){
                    eventDomFn( el[i] , type , fn );
                }
            } else {
                el[ domHand ]( type , fn , false );
            }
        };
        return eventDomFn
    } else {
        function eventFn( el , type , fn ){
            if( el.length ){
                for(var i=0 ; i < el.length ; i++){
                    eventFn( el[i],type,fn );
                }
            } else {
                el[ ieHand ]( "on"+type , function(){
                    return fn.call( el , window.event );
                });
            }
        };
        return eventFn
    }
};

export default {
    // dom操作相关代码
    query : function(el){
        if(_.isString(el)){
           return document.getElementById(el)
        }
        if(el.nodeType == 1){
           //则为一个element本身
           return el
        }
        if(el.length){
           return el[0]
        }
        return null;
    },
    offset : function(el){
        var box = el.getBoundingClientRect(), 
        doc = el.ownerDocument, 
        body = doc.body, 
        docElem = doc.documentElement, 

        // for ie  
        clientTop = docElem.clientTop || body.clientTop || 0, 
        clientLeft = docElem.clientLeft || body.clientLeft || 0, 

        // In Internet Explorer 7 getBoundingClientRect property is treated as physical, 
        // while others are logical. Make all logical, like in IE8. 
        zoom = 1; 
        if (body.getBoundingClientRect) { 
            var bound = body.getBoundingClientRect(); 
            zoom = (bound.right - bound.left)/body.clientWidth; 
        } 
        if (zoom > 1){ 
            clientTop = 0; 
            clientLeft = 0; 
        } 
        var top = box.top/zoom + (window.pageYOffset || docElem && docElem.scrollTop/zoom || body.scrollTop/zoom) - clientTop, 
            left = box.left/zoom + (window.pageXOffset|| docElem && docElem.scrollLeft/zoom || body.scrollLeft/zoom) - clientLeft; 

        return { 
            top: top, 
            left: left 
        }; 
    },
    addEvent : addOrRmoveEventHand( "addEventListener" , "attachEvent" ),
    removeEvent : addOrRmoveEventHand( "removeEventListener" , "detachEvent" ),
    pageX: function(e) {
        if (e.pageX) return e.pageX;
        else if (e.clientX)
            return e.clientX + (document.documentElement.scrollLeft ?
                    document.documentElement.scrollLeft : document.body.scrollLeft);
        else return null;
    },
    pageY: function(e) {
        if (e.pageY) return e.pageY;
        else if (e.clientY)
            return e.clientY + (document.documentElement.scrollTop ?
                    document.documentElement.scrollTop : document.body.scrollTop);
        else return null;
    },
    /**
     * 创建dom
     * @param {string} id dom id 待用
     * @param {string} type : dom type， such as canvas, div etc.
     */
    createCanvas : function( _width , _height , id) {
        var canvas = document.createElement("canvas");
        canvas.style.position = 'absolute';
        canvas.style.width  = _width + 'px';
        canvas.style.height = _height + 'px';
        canvas.style.left   = 0;
        canvas.style.top    = 0;
        canvas.setAttribute('width', _width * RESOLUTION);
        canvas.setAttribute('height', _height * RESOLUTION);
        canvas.setAttribute('id', id);
        return canvas;
    },
    createView: function(_width , _height, id){
        var view = document.createElement("div");
        view.className = "canvax-view";
        view.style.cssText += "position:relative;width:100%;height:100%;"

        var stageView = document.createElement("div");
        stageView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height +"px;"

        //用来存放一些dom元素
        var domView = document.createElement("div");
        domView.style.cssText += "position:absolute;width:" + _width + "px;height:" + _height +"px;"

        view.appendChild(stageView);
        view.appendChild(domView);
        
        return {
            view : view,
            stageView: stageView,
            domView: domView
        }
    }
    //dom相关代码结束
};