"use strict";!function(e,r){if("function"==typeof define&&define.amd)define(["exports","../SystemRenderer","../../const","../../graphics/canvas/GraphicsRenderer","mmvis"],r);else if("undefined"!=typeof exports)r(exports,require("../SystemRenderer"),require("../../const"),require("../../graphics/canvas/GraphicsRenderer"),require("mmvis"));else{var t={};r(t,e.SystemRenderer,e._const,e.GraphicsRenderer,e.mmvis),e.undefined=t}}(void 0,function(e,r,n,t,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=s(r),i=s(t);function s(e){return e&&e.__esModule?e:{default:e}}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function l(e){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e,r){return(p=Object.setPrototypeOf||function(e,r){return e.__proto__=r,e})(e,r)}var d,h,y,m=(function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),r&&p(e,r)}(g,a.default),d=g,(h=[{key:"render",value:function(e){var r=this;r.app=e,o._.each(o._.values(e.convertStages),function(e){r.renderStage(e.stage)}),e.convertStages={}}},{key:"renderStage",value:function(e){e.ctx||(e.ctx=e.canvas.getContext("2d")),e.stageRending=!0,e.setWorldTransform(),this._clear(e),this._render(e,e,e.context.globalAlpha),e.stageRending=!1}},{key:"_render",value:function(e,r,t){var n=e.ctx;if(n){var o=r.context.$model;if(r.worldTransform||r.fire("render"),(!r.worldTransform||r._transformChange||r.parent&&r.parent._transformChange)&&(r.setWorldTransform(),r.fire("transform"),r._transformChange=!0),t*=o.globalAlpha,o.visible&&!r.isClip){var a=r.worldTransform.toArray();if(a){n.setTransform.apply(n,a);var i=!1;if(r.clip&&r.clip.graphics){var s=r.clip;n.save(),i=!0,s.worldTransform&&!s._transformChange&&!s.parent._transformChange||(s.setWorldTransform(),s._transformChange=!0),n.setTransform.apply(n,s.worldTransform.toArray()),s.graphics.graphicsData.length||s._draw(s.graphics),this.CGR.render(s,e,t,i),s._transformChange=!1,n.clip()}if(r.graphics&&(r.graphics.graphicsData.length||r._draw(r.graphics),t&&(n.setLineDash([]),o.lineType&&"solid"!=o.lineType&&n.setLineDash(o.lineDash),this.CGR.render(r,e,t))),"text"==r.type&&r.render(n,t),r.children)for(var f=0,c=r.children.length;f<c;f++)this._render(e,r.children[f],t);r._transformChange=!1,i&&n.restore()}}}}},{key:"_clear",value:function(e){var r=e.ctx;r.setTransform.apply(r,e.worldTransform.toArray()),r.clearRect(0,0,this.app.width,this.app.height)}}])&&c(d.prototype,h),void(y&&c(d,y)),g);function g(e){var r,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,g),(r=function(e,r){return!r||"object"!==f(r)&&"function"!=typeof r?u(e):r}(this,l(g).call(this,n.RENDERER_TYPE.CANVAS,e,t))).CGR=new i.default(u(r)),r}e.default=m});