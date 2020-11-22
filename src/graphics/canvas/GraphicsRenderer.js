import { SHAPES } from '../../const';

export default class CanvasGraphicsRenderer
{
   
    constructor(renderer)
    {
        this.renderer = renderer;
    }
    
     /**
     * @param displayObject
     * @stage 也可以displayObject.getStage()获取。
     */
    render(displayObject , stage, globalAlpha, isClip)
    {
        const renderer = this.renderer;
        const graphicsData = displayObject.graphics.graphicsData;
        const ctx = stage.ctx;

        for (let i = 0; i < graphicsData.length; i++)
        {
            const data = graphicsData[i];
            const shape = data.shape;

            const fillStyle = data.fillStyle;
            const strokeStyle = data.strokeStyle;

            const fill = data.hasFill() && data.fillAlpha && !isClip;
            const line = data.hasLine() && data.strokeAlpha && !isClip;

            ctx.lineWidth     = data.lineWidth;
            ctx.shadowColor   = data.shadowColor;
            ctx.shadowBlur    = data.shadowBlur;
            ctx.shadowOffsetX = data.shadowOffsetX;
            ctx.shadowOffsetY = data.shadowOffsetY;

            if (data.type === SHAPES.POLY)
            {
                //只第一次需要beginPath()
                ctx.beginPath();

                this.renderPolygon(shape.points, shape.closed, ctx, isClip);

                if ( fill )
                {
                    ctx.globalAlpha = data.fillAlpha * globalAlpha;
                    ctx.fillStyle = fillStyle;
                    ctx.fill();
                }
                if ( line )
                {
                    ctx.globalAlpha = data.strokeAlpha * globalAlpha;
                    ctx.strokeStyle = strokeStyle;
                    if( fill &&  data.shadowBlur){
                        //如果有fill的时候也有shadow， 那么在描边的时候不需要阴影
                        //因为fill的时候已经画过了
                        ctx.shadowBlur = 0;
                    };
                    ctx.stroke();
                }
            }
            else if (data.type === SHAPES.RECT)
            {
                if( isClip ){
                    //ctx.beginPath();
                    //rect本身已经是个close的path
                    ctx.rect( shape.x, shape.y, shape.width, shape.height );
                    //ctx.closePath();
                };
                
                if ( fill )
                {
                    ctx.globalAlpha = data.fillAlpha * globalAlpha;
                    ctx.fillStyle = fillStyle;
                    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                }
                if ( line ) 
                {
                    ctx.globalAlpha = data.strokeAlpha * globalAlpha;
                    ctx.strokeStyle = strokeStyle;
                    if( fill &&  data.shadowBlur){
                        //如果有fill的时候也有shadow， 那么在描边的时候不需要阴影
                        //因为fill的时候已经画过了
                        ctx.shadowBlur = 0;
                    };
                    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                }
            }
            else if (data.type === SHAPES.CIRC)
            {

                // TODO - 这里应该可以不需要走graphics，而直接设置好radius
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                ctx.closePath();

                if ( fill )
                {
                    ctx.globalAlpha = data.fillAlpha * globalAlpha;
                    ctx.fillStyle = fillStyle;
                    ctx.fill();
                }
                if ( line )
                {
                    ctx.globalAlpha = data.strokeAlpha * globalAlpha;
                    ctx.strokeStyle = strokeStyle;
                    if( fill &&  data.shadowBlur){
                        //如果有fill的时候也有shadow， 那么在描边的时候不需要阴影
                        //因为fill的时候已经画过了
                        ctx.shadowBlur = 0;
                    };
                    ctx.stroke();
                }
            }
            else if (data.type === SHAPES.ELIP)
            {
                const w = shape.width * 2;
                const h = shape.height * 2;

                const x = shape.x - (w / 2);
                const y = shape.y - (h / 2);

                ctx.beginPath();

                const kappa = 0.5522848;
                const ox = (w / 2) * kappa; // control point offset horizontal
                const oy = (h / 2) * kappa; // control point offset vertical
                const xe = x + w;           // x-end
                const ye = y + h;           // y-end
                const xm = x + (w / 2);       // x-middle
                const ym = y + (h / 2);       // y-middle

                ctx.moveTo(x, ym);
                ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

                ctx.closePath();

                if ( fill )
                {
                    ctx.globalAlpha = data.fillAlpha * globalAlpha;
                    ctx.fillStyle = fillStyle;
                    ctx.fill();
                }
                if ( line )
                {
                    ctx.globalAlpha = data.strokeAlpha * globalAlpha;
                    ctx.strokeStyle = strokeStyle;
                    if( fill &&  data.shadowBlur){
                        //如果有fill的时候也有shadow， 那么在描边的时候不需要阴影
                        //因为fill的时候已经画过了
                        ctx.shadowBlur = 0;
                    };
                    ctx.stroke();
                }
            }

        }
    }

    renderPolygon(points, close, ctx, isClip)
    {
        ctx.moveTo(points[0], points[1]);

        for (let j = 1; j < points.length / 2; ++j)
        {
            ctx.lineTo(points[j * 2], points[(j * 2) + 1]);
        }

        if (close || isClip)
        {
            ctx.closePath();
        }
    }

}