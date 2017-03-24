import buildLine from './buildLine';
import { SHAPES } from '../../../const';
import { hex2rgb } from '../../../utils/color';

export default function buildCircle(graphicsData, webGLData)
{
    
    const circleData = graphicsData.shape;
    const x = circleData.x;
    const y = circleData.y;
    let width;
    let height;

    if (graphicsData.type === SHAPES.CIRC)
    {
        width = circleData.radius;
        height = circleData.radius;
    }
    else
    {
        width = circleData.width;
        height = circleData.height;
    }

    const totalSegs = Math.floor(30 * Math.sqrt(circleData.radius))
        || Math.floor(15 * Math.sqrt(circleData.width + circleData.height));

    const seg = (Math.PI * 2) / totalSegs;

    if (graphicsData.hasFill() && graphicsData.fillAlpha)
    {
        const color = hex2rgb(graphicsData.fillStyle);
        const alpha = graphicsData.fillAlpha;

        const r = color[0] * alpha;
        const g = color[1] * alpha;
        const b = color[2] * alpha;

        const verts = webGLData.points;
        const indices = webGLData.indices;

        let vecPos = verts.length / 6;

        indices.push(vecPos);

        for (let i = 0; i < totalSegs + 1; i++)
        {
            verts.push(x, y, r, g, b, alpha);

            verts.push(
                x + (Math.sin(seg * i) * width),
                y + (Math.cos(seg * i) * height),
                r, g, b, alpha
            );

            indices.push(vecPos++, vecPos++);
        }

        indices.push(vecPos - 1);
    }

    if (graphicsData.hasLine() && graphicsData.lineAlpha)
    {
        const tempPoints = graphicsData.points;

        graphicsData.points = [];

        for (let i = 0; i < totalSegs + 1; i++)
        {
            graphicsData.points.push(
                x + (Math.sin(seg * i) * width),
                y + (Math.cos(seg * i) * height)
            );
        }

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}
