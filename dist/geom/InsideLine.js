"use strict";!function(e,n){if("function"==typeof define&&define.amd)define(["exports"],n);else if("undefined"!=typeof exports)n(exports);else{var t={};n(t),(void 0).undefined=t}}(0,function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,n,t,i){for(var f=e.shape.points,o=e.lineWidth,r=!1,d=0;d<f.length&&!(r=u(f.slice(d,d+4),n,t,o));++d)d+=1;return r};var u=function(e,n,t,i){var f=e[0],o=e[1],r=e[2],d=e[3],u=Math.max(i,3),a=0,s=f;return!(o+u<t&&d+u<t||t<o-u&&t<d-u||f+u<n&&r+u<n||n<f-u&&n<r-u)&&(f===r?Math.abs(n-f)<=u/2:((a=(o-d)/(f-r))*n-t+(s=(f*d-r*o)/(f-r)))*(a*n-t+s)/(a*a+1)<=u/2*u/2)}});