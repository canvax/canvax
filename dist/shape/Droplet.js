"use strict";!function(e,t){if("function"==typeof define&&define.amd)define(["exports","./Path","../utils/index","mmvis"],t);else if("undefined"!=typeof exports)t(exports,require("./Path"),require("../utils/index"),require("mmvis"));else{var r={};t(r,e.Path,e.index,e.mmvis),e.undefined=r}}(void 0,function(e,t,r,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=u(t),i=u(r);function u(e){return e&&e.__esModule?e:{default:e}}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function a(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function l(e){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var s,h,y,d=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}(b,o.default),s=b,(h=[{key:"watch",value:function(e){"hr"!=e&&"vr"!=e||(this.context.$model.path=this.createPath())}},{key:"createPath",value:function(){var e=this.context.$model,t="M 0 "+e.hr+" C "+e.hr+" "+e.hr+" "+3*e.hr/2+" "+-e.hr/3+" 0 "+-e.vr;return t+=" C "+3*-e.hr/2+" "+-e.hr/3+" "+-e.hr+" "+e.hr+" 0 "+e.hr+"z"}}])&&c(s.prototype,h),void(y&&c(s,y)),b);function b(e){var t;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,b),e=n._.extend(!0,{type:"droplet",context:{hr:0,vr:0}},i.default.checkOpt(e));t=a(this,l(b).call(this,e));return t.context.$model.path=t.createPath(),t}e.default=d});