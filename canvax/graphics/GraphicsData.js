export default class GraphicsData
{
    constructor(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, shape)
    {
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this.lineAlpha = lineAlpha;
        this._lineTint = lineColor;
        this.fillColor = fillColor;
        this.fillAlpha = fillAlpha;
        this._fillTint = fillColor;
        this.fill = fill;
        this.holes = [];
        this.shape = shape;
        this.type = shape.type;
    }

    clone()
    {
        return new GraphicsData(
            this.lineWidth,
            this.lineColor,
            this.lineAlpha,
            this.fillColor,
            this.fillAlpha,
            this.fill,
            this.shape
        );
    }

    addHole(shape)
    {
        this.holes.push(shape);
    }

    destroy()
    {
        this.shape = null;
        this.holes = null;
    }
    
}
