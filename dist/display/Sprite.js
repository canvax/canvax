"use strict";!function(e,t){if("function"==typeof define&&define.amd)define(["exports","./DisplayObjectContainer","../utils/index"],t);else if("undefined"!=typeof exports)t(exports,require("./DisplayObjectContainer"),require("../utils/index"));else{var n={};t(n,e.DisplayObjectContainer,e.index),e.undefined=n}}(void 0,function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(t),r=i(n);function i(e){return e&&e.__esModule?e:{default:e}}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){return!t||"object"!==u(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var p=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(s,o.default),s);function s(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),(e=r.default.checkOpt(e)).type="sprite",f(this,c(s).call(this,e))}e.default=p});