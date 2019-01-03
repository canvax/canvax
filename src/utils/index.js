/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com 
*/
import {_,$} from "mmvis";

var Utils = {
    mainFrameRate   : 60,//默认主帧率
    now : 0,
    /*给文本检测高宽专用*/
    _pixelCtx   : null,
    __emptyFunc : function(){},
    //retina 屏幕优化
    _devicePixelRatio : typeof (window) !== 'undefined' ? window.devicePixelRatio : 1,
    _UID  : 0, //该值为向上的自增长整数值
    getUID:function(){
        return this._UID++;
    },
    createId : function( name ) {
        //if end with a digit, then append an undersBase before appending
        var charCode = name.charCodeAt(name.length - 1);
        if (charCode >= 48 && charCode <= 57) name += "_";
        return name + Utils.getUID();
    },
    canvasSupport : function() {
        return !!document.createElement('canvas').getContext;
    },

    initElement : function( canvas ){
        if( window.FlashCanvas && FlashCanvas.initElement){
            FlashCanvas.initElement( canvas );
        };
        return canvas;
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
    },

    isWebGLSupported : function (){
        var contextOptions = { stencil: true };
        try
        {
            if (!window.WebGLRenderingContext) //不存在直接return
            {
                return false;
            }
            var canvas = document.createElement('canvas'), 
                gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
            return !!(gl && gl.getContextAttributes().stencil); //还要确实检测是否支持webGL模式
        }
        catch (e)
        {
            return false;
        }
    },
    checkOpt: function( opt ){
        if( !opt ){
            opt = {
                context : {}
            }
        } else {
            if( !opt.context ){
                opt.context = {}
            }
        }
        return opt;
    }
};

Utils._pixelCtx = Utils.initElement($.createCanvas(1, 1, "_pixelCanvas")).getContext('2d');

export default Utils;