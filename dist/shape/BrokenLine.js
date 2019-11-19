"use strict";!function(t,e){if("function"==typeof define&&define.amd)define(["exports","../display/Shape","../utils/index","mmvis","../geom/Math"],e);else if("undefined"!=typeof exports)e(exports,require("../display/Shape"),require("../utils/index"),require("mmvis"),require("../geom/Math"));else{var o={};e(o,t.Shape,t.index,t.mmvis,t.Math),t.undefined=o}}(void 0,function(t,e,o,n,i){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=f(e),s=f(o),u=f(i);function f(t){return t&&t.__esModule?t:{default:t}}function l(t){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function c(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y,d,m,b=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(v,r.default),y=v,(d=[{key:"watch",value:function(t,e){"pointList"!=t&&"smooth"!=t&&"lineType"!=t||("pointList"==t&&this.context.smooth&&(this.context.pointList=u.default.getSmoothPointList(e,this.context.smoothFilter),this._pointList=e),"smooth"==t&&(this.context.pointList=e?u.default.getSmoothPointList(this._pointList,this.context.smoothFilter):this._pointList),this.graphics.clear())}},{key:"draw",value:function(t){for(var e=this.context.pointList,o=!1,n=0,i=e.length;n<i;n++){var r=e[n];o=!!u.default.isValibPoint(r)&&(o?t.lineTo(r[0],r[1]):t.moveTo(r[0],r[1]),!0)}return this}}])&&c(y.prototype,d),void(m&&c(y,m)),v);function v(t){var e;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,v),t=s.default.checkOpt(t);var o=n._.extend(!0,{lineType:null,smooth:!1,pointList:[],smoothFilter:s.default.__emptyFunc},t.context);return!t.isClone&&o.smooth&&(o.pointList=u.default.getSmoothPointList(o.pointList,o.smoothFilter)),t.context=o,t.type="brokenline",(e=a(this,p(v).call(this,t)))._pointList=o.pointList,e}t.default=b});