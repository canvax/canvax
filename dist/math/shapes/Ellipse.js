"use strict";!function(e,t){if("function"==typeof define&&define.amd)define(["exports","./Rectangle","../../const"],t);else if("undefined"!=typeof exports)t(exports,require("./Rectangle"),require("../../const"));else{var i={};t(i,e.Rectangle,e._const),e.undefined=i}}(void 0,function(e,t,h){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i,n=(i=t)&&i.__esModule?i:{default:i};function s(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var o,r,u,a=(o=d,(r=[{key:"clone",value:function(){return new d(this.x,this.y,this.width,this.height)}},{key:"contains",value:function(e,t){if(this.width<=0||this.height<=0)return!1;var i=(e-this.x)/this.width,n=(t-this.y)/this.height;return(i*=i)+(n*=n)<=1}},{key:"getBounds",value:function(){return new n.default(this.x-this.width,this.y-this.height,this.width,this.height)}}])&&s(o.prototype,r),void(u&&s(o,u)),d);function d(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,d),this.x=e,this.y=t,this.width=i,this.height=n,this.type=h.SHAPES.ELIP,this.closed=!0}e.default=a});