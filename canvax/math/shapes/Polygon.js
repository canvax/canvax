import Point from '../Point';
import { SHAPES } from '../../const';

/**
 * @class
 * @memberof PIXI
 */
export default class Polygon
{
    /**
     * @param {PIXI.Point[]|number[]} points - This can be an array of Points
     *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
     *  the arguments passed can be all the points of the polygon e.g.
     *  `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the arguments passed can be flat
     *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
     */
    constructor(...points)
    {
        if (Array.isArray(points[0]))
        {
            points = points[0];
        }

        // if this is an array of points, convert it to a flat array of numbers
        if (points[0] instanceof Point)
        {
            const p = [];

            for (let i = 0, il = points.length; i < il; i++)
            {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        this.closed = true;

        /**
         * An array of the points of this polygon
         *
         * @member {number[]}
         */
        this.points = points;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.POLY
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.POLY;
    }

    /**
     * Creates a clone of this polygon
     *
     * @return {PIXI.Polygon} a copy of the polygon
     */
    clone()
    {
        return new Polygon(this.points.slice());
    }

    /**
     * Closes the polygon, adding points if necessary.
     *
     */
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
