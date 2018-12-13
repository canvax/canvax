define("math/shapes/Rectangle",["../../const"],function(t,i,h){"use strict";i.__esModule=!0;var s=t("../../const"),e=function(){function t(t,i,h,e){void 0===t&&(t=0),void 0===i&&(i=0),void 0===h&&(h=0),void 0===e&&(e=0),this.x=t,this.y=i,this.width=h,this.height=e,this.type=s.SHAPES.RECT,this.closed=!0}return t.prototype.clone=function(){return new t(this.x,this.y,this.width,this.height)},t.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this},t.prototype.contains=function(t,i){return!(this.height*i<0||this.width*t<0)&&(t>=this.x&&t<=this.x+this.width&&(this.height>=0&&i>=this.y&&i<=this.y+this.height||this.height<0&&i<=this.y&&i>=this.y+this.height))},t}();i.default=e});