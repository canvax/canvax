"use strict";!function(e,t){if("function"==typeof define&&define.amd)define(["exports","pixi-gl-core"],t);else if("undefined"!=typeof exports)t(exports,require("pixi-gl-core"));else{var i={};t(i,e.pixiGlCore),e.undefined=i}}(void 0,function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i,n=(i=t)&&i.__esModule?i:{default:i};function s(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var r,l,u,f=(r=o,(l=[{key:"reset",value:function(){this.points.length=0,this.indices.length=0}},{key:"upload",value:function(){this.glPoints=new Float32Array(this.points),this.buffer.upload(this.glPoints),this.glIndices=new Uint16Array(this.indices),this.indexBuffer.upload(this.glIndices),this.dirty=!1}},{key:"destroy",value:function(){this.color=null,this.points=null,this.indices=null,this.vao.destroy(),this.buffer.destroy(),this.indexBuffer.destroy(),this.gl=null,this.buffer=null,this.indexBuffer=null,this.glPoints=null,this.glIndices=null}}])&&s(r.prototype,l),void(u&&s(r,u)),o);function o(e,t,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),this.gl=e,this.color=[0,0,0],this.points=[],this.indices=[],this.buffer=n.default.GLBuffer.createVertexBuffer(e),this.indexBuffer=n.default.GLBuffer.createIndexBuffer(e),this.dirty=!0,this.glPoints=null,this.glIndices=null,this.shader=t,this.vao=new n.default.VertexArrayObject(e,i).addIndex(this.indexBuffer).addAttribute(this.buffer,t.attributes.aVertexPosition,e.FLOAT,!1,24,0).addAttribute(this.buffer,t.attributes.aColor,e.FLOAT,!1,24,8)}e.default=f});