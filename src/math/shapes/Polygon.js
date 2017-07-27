import { SHAPES } from '../../const';

export default class Polygon
{
    constructor(...points)
    {
        const point_0 = points[0];
        if (Array.isArray( point_0 ))
        {
            points = point_0;
        }

        if ( point_0 && ("x" in point_0) && ("y" in point_0) )
        {
            const p = [];

            for (let i = 0, il = points.length; i < il; i++)
            {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        this.closed = true;

        this.points = points;

        this.type = SHAPES.POLY;
    }

    clone()
    {
        return new Polygon(this.points.slice());
    }

    close()
    {
        const points = this.points;
        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1])
        {
            points.push(points[0], points[1]);
        }
        this.closed = true;
    }

    contains(x, y)
    {
        return this._isInsidePolygon_WindingNumber(x,y);
    }


    /**
     * 多边形包含判断 Nonzero Winding Number Rule
     */
    _isInsidePolygon_WindingNumber(x, y) 
    {
        var points = this.points;
        var wn = 0;
        for (var shiftP, shift = points[1] > y, i = 3; i < points.length; i += 2) {
            shiftP = shift;
            shift = points[i] > y;
            if (shiftP != shift) {
                var n = (shiftP ? 1 : 0) - (shift ? 1 : 0);
                if (n * ((points[i - 3] - x) * (points[i - 0] - y) - (points[i - 2] - y) * (points[i - 1] - x)) > 0) {
                    wn += n;
                }
            };
        };
        return wn
    }
}
