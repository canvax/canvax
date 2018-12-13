define("graphics/webgl/WebGLGraphicsData",["pixi-gl-core"],function(t,i,e){"use strict";i.__esModule=!0;var s=t("pixi-gl-core"),n=function(){function t(t,i,e){this.gl=t,this.color=[0,0,0],this.points=[],this.indices=[],this.buffer=s.default.GLBuffer.createVertexBuffer(t),this.indexBuffer=s.default.GLBuffer.createIndexBuffer(t),this.dirty=!0,this.glPoints=null,this.glIndices=null,this.shader=i,this.vao=new s.default.VertexArrayObject(t,e).addIndex(this.indexBuffer).addAttribute(this.buffer,i.attributes.aVertexPosition,t.FLOAT,!1,24,0).addAttribute(this.buffer,i.attributes.aColor,t.FLOAT,!1,24,8)}return t.prototype.reset=function(){this.points.length=0,this.indices.length=0},t.prototype.upload=function(){this.glPoints=new Float32Array(this.points),this.buffer.upload(this.glPoints),this.glIndices=new Uint16Array(this.indices),this.indexBuffer.upload(this.glIndices),this.dirty=!1},t.prototype.destroy=function(){this.color=null,this.points=null,this.indices=null,this.vao.destroy(),this.buffer.destroy(),this.indexBuffer.destroy(),this.gl=null,this.buffer=null,this.indexBuffer=null,this.glPoints=null,this.glIndices=null},t}();i.default=n});