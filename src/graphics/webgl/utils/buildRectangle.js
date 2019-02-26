import buildLine from './buildLine';
import { color } from 'mmvis';

export default function buildRectangle(graphicsData, webGLData)
{

    const rectData = graphicsData.shape;
    const x = rectData.x;
    const y = rectData.y;
    const width = rectData.width;
    const height = rectData.height;

    if (graphicsData.hasFill() && graphicsData.fillAlpha)
    {
        const color = color.hexTorgb(graphicsData.fillStyle);
        const alpha = graphicsData.fillAlpha;

        const r = color[0] * alpha;
        const g = color[1] * alpha;
        const b = color[2] * alpha;

        const verts = webGLData.points;
        const indices = webGLData.indices;

        const vertPos = verts.length / 6;

        // start
        verts.push(x, y);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y);
        verts.push(r, g, b, alpha);

        verts.push(x, y + height);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y + height);
        verts.push(r, g, b, alpha);

        // insert 2 dead triangles..
        indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
    }

    if (graphicsData.hasLine() && graphicsData.strokeAlpha)
    {
        const tempPoints = graphicsData.points;

        graphicsData.points = [x, y,
            x + width, y,
            x + width, y + height,
            x, y + height,
            x, y];

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}
