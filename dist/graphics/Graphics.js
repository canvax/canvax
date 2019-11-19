"use strict";!function(t,e){if("function"==typeof define&&define.amd)define(["exports","./GraphicsData","../math/index","../const","./utils/bezierCurveTo","mmvis"],e);else if("undefined"!=typeof exports)e(exports,require("./GraphicsData"),require("../math/index"),require("../const"),require("./utils/bezierCurveTo"),require("mmvis"));else{var h={};e(h,t.GraphicsData,t.index,t._const,t.bezierCurveTo,t.mmvis),t.undefined=h}}(void 0,function(t,e,r,D,h,i){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=s(e),u=s(h);function s(t){return t&&t.__esModule?t:{default:t}}function n(t,e){for(var h=0;h<e.length;h++){var i=e[h];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var l,o,c,p=(l=d,(o=[{key:"setStyle",value:function(t){var e=t.$model;this.lineWidth=e.lineWidth,this.strokeStyle=e.strokeStyle,this.strokeAlpha=e.strokeAlpha*e.globalAlpha,this.fillStyle=e.fillStyle,this.fillAlpha=e.fillAlpha*e.globalAlpha;var h=this;this.graphicsData.length&&i._.each(this.graphicsData,function(t,e){t.synsStyle(h)})}},{key:"clone",value:function(){for(var t=new d,e=t.dirty=0;e<this.graphicsData.length;++e)t.graphicsData.push(this.graphicsData[e].clone());return t.currentPath=t.graphicsData[t.graphicsData.length-1],t}},{key:"moveTo",value:function(t,e){var h=new r.Polygon([t,e]);return h.closed=!1,this.drawShape(h),this}},{key:"lineTo",value:function(t,e){return this.currentPath?(this.currentPath.shape.points.push(t,e),this.dirty++):this.moveTo(0,0),this}},{key:"quadraticCurveTo",value:function(t,e,h,i){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var a=this.currentPath.shape.points,r=0,s=0;0===a.length&&this.moveTo(0,0);for(var n=a[a.length-2],l=a[a.length-1],u=1;u<=20;++u){var o=u/20;r=n+(t-n)*o,s=l+(e-l)*o,a.push(r+(t+(h-t)*o-r)*o,s+(e+(i-e)*o-s)*o)}return this.dirty++,this}},{key:"bezierCurveTo",value:function(t,e,h,i,a,r){this.currentPath?0===this.currentPath.shape.points.length&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var s=this.currentPath.shape.points,n=s[s.length-2],l=s[s.length-1];return s.length-=2,(0,u.default)(n,l,t,e,h,i,a,r,s),this.dirty++,this}},{key:"arcTo",value:function(t,e,h,i,a){this.currentPath?0===this.currentPath.shape.points.length&&this.currentPath.shape.points.push(t,e):this.moveTo(t,e);var r=this.currentPath.shape.points,s=r[r.length-2],n=r[r.length-1]-e,l=s-t,u=i-e,o=h-t,c=Math.abs(n*o-l*u);if(c<1e-8||0===a)r[r.length-2]===t&&r[r.length-1]===e||r.push(t,e);else{var p=n*n+l*l,d=u*u+o*o,f=n*u+l*o,v=a*Math.sqrt(p)/c,y=a*Math.sqrt(d)/c,g=v*f/p,P=y*f/d,w=v*o+y*l,k=v*u+y*n,S=l*(y+g),b=n*(y+g),D=o*(v+P),M=u*(v+P),m=Math.atan2(b-k,S-w),A=Math.atan2(M-k,D-w);this.arc(w+t,k+e,a,m,A,o*n<l*u)}return this.dirty++,this}},{key:"arc",value:function(t,e,h,i,a,r){var s=5<arguments.length&&void 0!==r&&r;if(i===a)return this;!s&&a<=i?a+=2*Math.PI:s&&i<=a&&(i+=2*Math.PI);var n=a-i,l=48*Math.ceil(Math.abs(n)/(2*Math.PI));if(0==n)return this;var u=t+Math.cos(i)*h,o=e+Math.sin(i)*h,c=this.currentPath?this.currentPath.shape.points:null;c?c[c.length-2]===u&&c[c.length-1]===o||c.push(u,o):(this.moveTo(u,o),c=this.currentPath.shape.points);for(var p=n/(2*l),d=2*p,f=Math.cos(p),v=Math.sin(p),y=l-1,g=y%1/y,P=0;P<=y;++P){var w=p+i+d*(P+g*P),k=Math.cos(w),S=-Math.sin(w);c.push((f*k+v*S)*h+t,(f*-S+v*k)*h+e)}return this.dirty++,this}},{key:"drawRect",value:function(t,e,h,i){return this.drawShape(new r.Rectangle(t,e,h,i)),this}},{key:"drawCircle",value:function(t,e,h){return this.drawShape(new r.Circle(t,e,h)),this}},{key:"drawEllipse",value:function(t,e,h,i){return this.drawShape(new r.Ellipse(t,e,h,i)),this}},{key:"drawPolygon",value:function(t){var e=t,h=!0;if(e instanceof r.Polygon&&(h=e.closed,e=e.points),!Array.isArray(e)){e=new Array(arguments.length);for(var i=0;i<e.length;++i)e[i]=arguments[i]}var a=new r.Polygon(e);return a.closed=h,this.drawShape(a),this}},{key:"clear",value:function(){return 0<this.graphicsData.length&&(this.dirty++,this.clearDirty++,this.graphicsData.length=0),this.currentPath=null,this}},{key:"drawShape",value:function(t){this.currentPath&&this.currentPath.shape.points.length<=2&&this.graphicsData.pop(),this.beginPath();var e=new a.default(this.lineWidth,this.strokeStyle,this.strokeAlpha,this.fillStyle,this.fillAlpha,t);return this.graphicsData.push(e),e.type===D.SHAPES.POLY&&(e.shape.closed=e.shape.closed,this.currentPath=e),this.dirty++,e}},{key:"beginPath",value:function(){this.currentPath=null}},{key:"closePath",value:function(){var t=this.currentPath;return t&&t.shape&&t.shape.close(),this}},{key:"updateLocalBounds",value:function(){var t=1/0,e=-1/0,h=1/0,i=-1/0;if(this.graphicsData.length)for(var a=0,r=0,s=0,n=0,l=0,u=0;u<this.graphicsData.length;u++){var o=this.graphicsData[u],c=o.type,p=o.lineWidth;if(a=o.shape,c===D.SHAPES.RECT||c===D.SHAPES.RREC)r=a.x-p/2,s=a.y-p/2,t=r<t?r:t,e=e<r+(n=a.width+p)?r+n:e,h=s<h?s:h,i=i<s+(l=a.height+p)?s+l:i;else if(c===D.SHAPES.CIRC)r=a.x,s=a.y,t=r-(n=a.radius+p/2)<t?r-n:t,e=e<r+n?r+n:e,h=s-(l=a.radius+p/2)<h?s-l:h,i=i<s+l?s+l:i;else if(c===D.SHAPES.ELIP)r=a.x,s=a.y,t=r-(n=a.width+p/2)<t?r-n:t,e=e<r+n?r+n:e,h=s-(l=a.height+p/2)<h?s-l:h,i=i<s+l?s+l:i;else for(var d=a.points,f=0,v=0,y=0,g=0,P=0,w=0,k=0,S=0,b=0;b+2<d.length;b+=2)r=d[b],s=d[b+1],f=d[b+2],v=d[b+3],y=Math.abs(f-r),g=Math.abs(v-s),l=p,(n=Math.sqrt(y*y+g*g))<1e-9||(t=(k=(f+r)/2)-(P=(l/n*g+y)/2)<t?k-P:t,e=e<k+P?k+P:e,h=(S=(v+s)/2)-(w=(l/n*y+g)/2)<h?S-w:h,i=i<S+w?S+w:i)}else i=h=e=t=0;return this.Bound={x:t,y:h,width:e-t,height:i-h},this}},{key:"getBound",value:function(){return this.updateLocalBounds().Bound}},{key:"destroy",value:function(){for(var t=0;t<this.graphicsData.length;++t)this.graphicsData[t].destroy();for(var e in this._webGL)for(var h=0;h<this._webGL[e].data.length;++h)this._webGL[e].data[h].destroy();this.graphicsData=null,this.currentPath=null,this._webGL=null}}])&&n(l.prototype,o),void(c&&n(l,c)),d);function d(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,d),this.lineWidth=1,this.strokeStyle=null,this.strokeAlpha=1,this.fillStyle=null,this.fillAlpha=1,this.graphicsData=[],this.currentPath=null,this.dirty=0,this.clearDirty=0,this._webGL={},this.worldAlpha=1,this.tint=16777215,this.Bound={x:0,y:0,width:0,height:0}}t.default=p});