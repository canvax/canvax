"use strict";!function(e,i){if("function"==typeof define&&define.amd)define(["exports","./buildLine","mmvis"],i);else if("undefined"!=typeof exports)i(exports,require("./buildLine"),require("mmvis"));else{var s={};i(s,e.buildLine,e.mmvis),e.undefined=s}}(void 0,function(e,i,s){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,i){var s=e.shape,u=s.x,n=s.y,t=s.width,l=s.height;if(e.hasFill()&&e.fillAlpha){var p=p.hexTorgb(e.fillStyle),f=e.fillAlpha,d=p[0]*f,h=p[1]*f,o=p[2]*f,r=i.points,a=i.indices,v=r.length/6;r.push(u,n),r.push(d,h,o,f),r.push(u+t,n),r.push(d,h,o,f),r.push(u,n+l),r.push(d,h,o,f),r.push(u+t,n+l),r.push(d,h,o,f),a.push(v,v,1+v,2+v,3+v,3+v)}if(e.hasLine()&&e.strokeAlpha){var c=e.points;e.points=[u,n,u+t,n,u+t,n+l,u,n+l,u,n],(0,m.default)(e,i),e.points=c}};var u,m=(u=i)&&u.__esModule?u:{default:u}});