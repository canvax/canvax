import buildLine from './buildLine';
import { hexTorgb } from '../../../utils/color';
import earcut from 'earcut';

export default function buildPoly(graphicsData, webGLData)
{
    graphicsData.points = graphicsData.shape.points.slice();

    let points = graphicsData.points;

    if (graphicsData.hasFill() && graphicsData.fillAlpha && points.length >= 6)
    {
        const holeArray = [];
        const holes = graphicsData.holes;

        for (let i = 0; i < holes.length; i++)
        {
            const hole = holes[i];

            holeArray.push(points.length / 2);

            points = points.concat(hole.points);
        }

        const verts = webGLData.points;
        const indices = webGLData.indices;

        const length = points.length / 2;

        const color = hexTorgb(graphicsData.fillStyle);
        const alpha = graphicsData.fillAlpha;
        const r = color[0] * alpha;
        const g = color[1] * alpha;
        const b = color[2] * alpha;

        const triangles = earcut(points, holeArray, 2);

        if (!triangles)
        {
            return;
        }

        const vertPos = verts.length / 6;

        for (let i = 0; i < triangles.length; i += 3)
        {
            indices.push(triangles[i] + vertPos);
            indices.push(triangles[i] + vertPos);
            indices.push(triangles[i + 1] + vertPos);
            indices.push(triangles[i + 2] + vertPos);
            indices.push(triangles[i + 2] + vertPos);
        }

        for (let i = 0; i < length; i++)
        {
            verts.push(points[i * 2], points[(i * 2) + 1],
                r, g, b, alpha);
        }
    }

    if (graphicsData.hasLine() && graphicsData.strokeAlpha )
    {
        buildLine(graphicsData, webGLData);
    }
}
