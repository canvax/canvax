"use strict";!function(e,l){if("function"==typeof define&&define.amd)define(["exports"],l);else if("undefined"!=typeof exports)l(exports);else{var i={};l(i),(void 0).undefined=i}}(0,function(e){Object.defineProperty(e,"__esModule",{value:!0});e.VERSION=__VERSION__,e.PI_2=2*Math.PI,e.RAD_TO_DEG=180/Math.PI,e.DEG_TO_RAD=Math.PI/180,e.RENDERER_TYPE={UNKNOWN:0,WEBGL:1,CANVAS:2},e.DRAW_MODES={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},e.SHAPES={POLY:0,RECT:1,CIRC:2,ELIP:3},e.SCALE_MODES={LINEAR:0,NEAREST:1},e.CONTEXT_DEFAULT={width:0,height:0,x:0,y:0,scaleX:1,scaleY:1,scaleOrigin:{x:0,y:0},rotation:0,rotateOrigin:{x:0,y:0},visible:!0,globalAlpha:1},e.SHAPE_CONTEXT_DEFAULT={cursor:"default",fillAlpha:1,fillStyle:null,lineCap:null,lineJoin:null,miterLimit:null,strokeAlpha:1,strokeStyle:null,lineType:"solid",lineWidth:null},e.TRANSFORM_PROPS=["x","y","scaleX","scaleY","rotation","scaleOrigin","rotateOrigin"],e.STYLE_PROPS=["lineWidth","strokeAlpha","strokeStyle","fillStyle","fillAlpha","globalAlpha"]});