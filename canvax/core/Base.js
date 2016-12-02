/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 */
/* 
window.FlashCanvasOptions = {
    swfPath: "http://g.tbcdn.cn/thx/canvax/1.0.0/canvax/library/flashCanvas/"
};
*/
define(
    "canvax/core/Base",
    [
        "canvax/utils/underscore"
    ],
    function( _ ){
        var Base = {
            mainFrameRate   : 60,//默认主帧率
            now : 0,
            /*像素检测专用*/
            _pixelCtx   : null,
            __emptyFunc : function(){},
            //retina 屏幕优化
            _devicePixelRatio : window.devicePixelRatio || 1,
            _UID  : 0, //该值为向上的自增长整数值
            getUID:function(){
                return this._UID++;
            },
            createId : function(name) {
                //if end with a digit, then append an undersBase before appending
                var charCode = name.charCodeAt(name.length - 1);
                if (charCode >= 48 && charCode <= 57) name += "_";
                return name + Base.getUID();
            },
            /**
             * 创建dom
             * @param {string} id dom id 待用
             * @param {string} type : dom type， such as canvas, div etc.
             */
            _createCanvas : function(id, _width , _height) {
                var newDom = document.createElement("canvas");
    
                newDom.style.position = 'absolute';
                newDom.style.width  = _width + 'px';
                newDom.style.height = _height + 'px';
                newDom.style.left   = 0;
                newDom.style.top    = 0;
                //newDom.setAttribute('width', _width );
                //newDom.setAttribute('height', _height );
                newDom.setAttribute('width', _width * this._devicePixelRatio);
                newDom.setAttribute('height', _height * this._devicePixelRatio);
                newDom.setAttribute('id', id);
                return newDom;
            },
            canvasSupport : function() {
                return !!document.createElement('canvas').getContext;
            },
            createObject : function( proto , constructor ) {
                var newProto;
                var ObjectCreate = Object.create;
                if (ObjectCreate) {
                    newProto = ObjectCreate(proto);
                } else {
                    Base.__emptyFunc.prototype = proto;
                    newProto = new Base.__emptyFunc();
                }
                newProto.constructor = constructor;
                return newProto;
            },
            setContextStyle : function( ctx , style ){
                // 简单判断不做严格类型检测
                for(p in style){
                    if( p != "textBaseline" && ( p in ctx ) ){
                        if ( style[p] || _.isNumber( style[p] ) ) {
                            if( p == "globalAlpha" ){
                                //透明度要从父节点继承
                                ctx[p] *= style[p];
                            } else {
                                ctx[p] = style[p];
                            }
                        }
                    }
                };
                return;
            },
            creatClass : function(r, s, px){
                if (!s || !r) {
                    return r;
                }
                var sp = s.prototype, rp;
                // add prototype chain
                rp = Base.createObject(sp, r);
                r.prototype = _.extend(rp, r.prototype);
                r.superclass = Base.createObject(sp, s);
                // add prototype overrides
                if (px) {
                    _.extend(rp, px);
                }
                return r;
            },
            initElement : function( canvas ){
                if( window.FlashCanvas && FlashCanvas.initElement){
                    FlashCanvas.initElement( canvas );
                }
            },
            //做一次简单的opt参数校验，保证在用户不传opt的时候 或者传了opt但是里面没有context的时候报错
            checkOpt    : function(opt){
                if( !opt ){
                  return {
                    context : {
                    
                    }
                  }   
                } else if( opt && !opt.context ) {
                  opt.context = {}
                  return opt;
                } else {
                  return opt;
                }
            },

            
            /**
             * 按照css的顺序，返回一个[上,右,下,左]
             */
            getCssOrderArr : function( r ){
                var r1; 
                var r2; 
                var r3; 
                var r4;
    
                if(typeof r === 'number') {
                    r1 = r2 = r3 = r4 = r;
                }
                else if(r instanceof Array) {
                    if (r.length === 1) {
                        r1 = r2 = r3 = r4 = r[0];
                    }
                    else if(r.length === 2) {
                        r1 = r3 = r[0];
                        r2 = r4 = r[1];
                    }
                    else if(r.length === 3) {
                        r1 = r[0];
                        r2 = r4 = r[1];
                        r3 = r[2];
                    } else {
                        r1 = r[0];
                        r2 = r[1];
                        r3 = r[2];
                        r4 = r[3];
                    }
                } else {
                    r1 = r2 = r3 = r4 = 0;
                }
                return [r1,r2,r3,r4];
            }
        };
        return Base
    }
);