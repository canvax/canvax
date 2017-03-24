import { hex2rgb } from '../../../utils/color';

export default function buildComplexPoly(graphicsData, webGLData)
{
    const points = graphicsData.points.slice();

    if (points.length < 6)
    {
        return;
    }

    const indices = webGLData.indices;

    webGLData.points = points;
    webGLData.alpha = graphicsData.fillAlpha;
    webGLData.color = hex2rgb(graphicsData.fillStyle);

    let minX = Infinity;
    let maxX = -Infinity;

    let minY = Infinity;
    let maxY = -Infinity;

    let x = 0;
    let y = 0;

    for (let i = 0; i < points.length; i += 2)
    {
        x = points[i];
        y = points[i + 1];

        minX = x < minX ? x : minX;
        maxX = x > maxX ? x : maxX;

        minY = y < minY ? y : minY;
        maxY = y > maxY ? y : maxY;
    }

    points.push(minX, minY,
                maxX, minY,
                maxX, maxY,
                minX, maxY);

    const length = points.length / 2;

    for (let i = 0; i < length; i++)
    {
        indices.push(i);
    }
}
