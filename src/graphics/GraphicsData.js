export default class GraphicsData
{
    constructor(lineWidth, strokeStyle, strokeAlpha, fillStyle, fillAlpha, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, lineCap, lineJoin, miterLimit, shape)
    {
        this.lineWidth     = lineWidth;
        this.strokeStyle   = strokeStyle;
        this.strokeAlpha   = strokeAlpha;

        this.fillStyle     = fillStyle;
        this.fillAlpha     = fillAlpha;

        this.shadowOffsetX = shadowOffsetX;
        this.shadowOffsetY = shadowOffsetY;
        this.shadowBlur    = shadowBlur;
        this.shadowColor   = shadowColor;

        this.lineCap       = lineCap;
        this.lineJoin      = lineJoin;
        this.miterLimit    = miterLimit;
        
        this.shape = shape;
        this.type = shape.type;

        this.holes = [];

        //这两个可以被后续修改， 具有一票否决权
        //比如polygon的 虚线描边。必须在fill的poly上面设置line为false
        this.fill = true;
        this.line = true;

    }

    clone()
    {
        var cloneGraphicsData = new GraphicsData(
            this.lineWidth,
            this.strokeStyle,
            this.strokeAlpha,
            this.fillStyle,
            this.fillAlpha,
            this.shadowOffsetX ,
            this.shadowOffsetY ,
            this.shadowBlur    ,
            this.shadowColor   ,

            this.lineCap       ,
            this.lineJoin      , 
            this.miterLimit    ,

            this.shape
        );
        cloneGraphicsData.fill = this.fill;
        cloneGraphicsData.line = this.line;
        return cloneGraphicsData;
    }

    addHole(shape)
    {
        this.holes.push(shape);
    }

    //从宿主graphics中同步最新的style属性
    synsStyle( style )
    {
        //console.log("line:"+this.line+"__fill:"+this.fill)
        //从shape中把绘图需要的style属性同步过来
        if( this.line ){
            this.lineWidth   = style.lineWidth;
            this.strokeStyle = style.strokeStyle;
            this.strokeAlpha = style.strokeAlpha;
        }

        if( this.fill ){
            this.fillStyle = style.fillStyle;
            this.fillAlpha = style.fillAlpha;
        }

        this.shadowOffsetX = style.shadowOffsetX; //阴影向右偏移量
        this.shadowOffsetY = style.shadowOffsetY; //阴影向下偏移量
        this.shadowBlur    = style.shadowBlur;    //阴影模糊效果
        this.shadowColor   = style.shadowColor;   //阴影颜色

        this.lineCap       = style.lineCap;
        this.lineJoin      = style.lineJoin;
        this.miterLimit    = style.miterLimit;
        
    }

    hasFill()
    {
        return this.fillStyle &&
               this.fill && 
               ( this.shape.closed !== undefined && this.shape.closed )
    }

    hasLine()
    {
        return this.strokeStyle && this.lineWidth && this.line
    }

    destroy()
    {
        this.shape = null;
        this.holes = null;
    }
    
}
