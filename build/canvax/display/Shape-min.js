KISSY.add("canvax/display/Shape",function(a,b,c){var d=function(a){var b=this;b._hoverable=!1,b._clickable=!1,b._hoverClass=!1,b._dragDuplicate=null,b.type=b.type||"shape",a.draw&&(b.draw=a.draw),arguments.callee.superclass.constructor.apply(this,arguments),b._rect=null};return c.creatClass(d,b,{init:function(){},draw:function(){},drawEnd:function(a){if(!this._hasFillAndStroke){var b=this.context;"stroke"!=this.drawTypeOnly&&a.closePath(),b.strokeStyle&&b.lineWidth&&a.stroke(),b.fillStyle&&"stroke"!=this.drawTypeOnly&&a.fill()}},render:function(){var a=this,b=a.context,c=a.getStage().context2D;"shape"==a.context.type?a.draw.apply(a):a.draw&&(c.beginPath(),a.draw(c,b),a.drawEnd(c))},dashedLineTo:function(a,b,c,d,e,f){f="undefined"==typeof f?5:f,f=Math.max(f,this.context.lineWidth);for(var g=d-b,h=e-c,i=Math.floor(Math.sqrt(g*g+h*h)/f),j=0;i>j;++j)a[j%2===0?"moveTo":"lineTo"](b+g/i*j,c+h/i*j)},getRectFormPointList:function(a){for(var b=Number.MAX_VALUE,c=Number.MIN_VALUE,d=Number.MAX_VALUE,e=Number.MIN_VALUE,f=a.pointList,g=0,h=f.length;h>g;g++)f[g][0]<b&&(b=f[g][0]),f[g][0]>c&&(c=f[g][0]),f[g][1]<d&&(d=f[g][1]),f[g][1]>e&&(e=f[g][1]);var i;return i=a.strokeStyle||a.fillStyle?a.lineWidth||1:0,{x:Math.round(b-i/2),y:Math.round(d-i/2),width:c-b+i,height:e-d+i}}}),d},{requires:["canvax/display/DisplayObject","canvax/core/Base"]});