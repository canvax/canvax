define(
    "canvax/utils/dom",
    [
        "canvax/utils/underscore"
    ],
    function( _ ){
        var addOrRmoveEventHand = function( domHand , ieHand ){
            if( document[ domHand ] ){
                return function( el , type , fn ){
                    if( el.length ){
                        for(var i=0 ; i < el.length ; i++){
                            arguments.callee( el[i] , type , fn );
                        }
                    } else {
                        el[ domHand ]( type , fn , false );
                    }
                };
            } else {
                return function( el , type , fn ){
                    if( el.length ){
                        for(var i=0 ; i < el.length ; i++){
                            arguments.callee( el[i],type,fn );
                        }
                    } else {
                        el[ ieHand ]( "on"+type , function(){
                            return fn.call( el , window.event );
                        });
                    }
                };
            }
        };

        return {
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
            //dom相关代码结束
        }
    }
);