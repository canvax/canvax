export default class GraphicsData
{
    constructor(lineWidth, strokeStyle, lineAlpha, fillStyle, fillAlpha, shape)
    {
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        this.lineAlpha = lineAlpha;

        this.fillStyle = fillStyle;
        this.fillAlpha = fillAlpha;
        
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
        return new GraphicsData(
            this.lineWidth,
            this.strokeStyle,
            this.lineAlpha,
            this.fillStyle,
            this.fillAlpha,
            this.shape
        );
    }

    addHole(shape)
    {
        this.holes.push(shape);
    }

    //从宿主graphics中同步最新的style属性
    synsStyle( graphics )
    {
        //从shape中把绘图需要的style属性同步过来
        this.lineWidth = graphics.lineWidth;
        this.strokeStyle = graphics.strokeStyle;
        this.lineAlpha = graphics.lineAlpha;

        this.fillStyle = graphics.fillStyle;
        this.fillAlpha = graphics.fillAlpha;
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
