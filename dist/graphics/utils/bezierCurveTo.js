"use strict";!function(e,n){if("function"==typeof define&&define.amd)define(["exports"],n);else if("undefined"!=typeof exports)n(exports);else{var f={};n(f),(void 0).undefined=f}}(0,function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,n,f,t,i,o,d,u){var r=8<arguments.length&&void 0!==arguments[8]?arguments[8]:[],s=0,p=0,a=0,c=0,l=0;r.push(e,n);for(var v=1,h=0;v<=20;++v)a=(p=(s=1-(h=v/20))*s)*s,l=(c=h*h)*h,r.push(a*e+3*p*h*f+3*s*c*i+l*d,a*n+3*p*h*t+3*s*c*o+l*u);return r}});