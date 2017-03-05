canvax
======

```js
var app = new Canvax({
	el: el, 
	width: width,
	height: height,
	...
});
```

el 和 width,height 二选一，如果有传递el，则必须是要个能获取到尺寸的dom容器，而且new Canvax后会自动把app.view appendTo 对应的el。

如果传递的是width，height，则是在缓存中创建一个对应尺寸的app.view，然后你可以用dom操作把app.view appenTo任何目标dom容器。


======

npm run build