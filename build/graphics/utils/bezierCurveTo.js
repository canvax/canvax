define("graphics/utils/bezierCurveTo",[],function(e,u,r){"use strict";u.__esModule=!0,u.default=function(e,u,r,i,s,t,n,o,f){void 0===f&&(f=[]);var a=0,c=0,d=0,v=0,h=0;f.push(e,u);for(var l=1,p=0;l<=20;++l)d=(c=(a=1-(p=l/20))*a)*a,h=(v=p*p)*p,f.push(d*e+3*c*p*r+3*a*v*s+h*n,d*u+3*c*p*i+3*a*v*t+h*o);return f}});