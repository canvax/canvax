import GraphicsData from './GraphicsData';
import { Matrix, Point, Rectangle, RoundedRectangle, Ellipse, Polygon, Circle } from '../math/index';
import { SHAPES } from '../const';
import bezierCurveTo from './utils/bezierCurveTo';

const tempMatrix = new Matrix();
const tempPoint = new Point();
const tempColor1 = new Float32Array(4);
const tempColor2 = new Float32Array(4);

export default class Graphics
{
    constructor()
    {
        this.fillAlpha = 1;
        this.lineWidth = 0;
        this.lineColor = 0;
        this.graphicsData = [];
        this.tint = 0xFFFFFF;
        this._prevTint = 0xFFFFFF;
        this.currentPath = null;

        this._webGL = {};

        this.dirty = 0;
        this.fastRectDirty = -1;
        this.clearDirty = 0;
        this.boundsDirty = -1;
        this.cachedSpriteDirty = false;

        this._spriteRect = null;
        this._fastRect = false;
    }


    clone()
    {
        const clone = new Graphics();

        clone.fillAlpha = this.fillAlpha;
        clone.lineWidth = this.lineWidth;
        clone.lineColor = this.lineColor;
        clone.tint = this.tint;
        clone.boundsPadding = this.boundsPadding;
        clone.dirty = 0;
        clone.cachedSpriteDirty = this.cachedSpriteDirty;

        // copy graphics data
        for (let i = 0; i < this.graphicsData.length; ++i)
        {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];

        clone.updateLocalBounds();

        return clone;
    }


    lineStyle(lineWidth = 0, color = 0, alpha = 1)
    {
        this.lineWidth = lineWidth;
        this.lineColor = color;
        this.lineAlpha = alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length)
            {
                // halfway through a line? start a new one!
                const shape = new Polygon(this.currentPath.shape.points.slice(-2));

                shape.closed = false;

                this.drawShape(shape);
            }
            else
            {
                // otherwise its empty so lets just set the line properties
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
            }
        }

        return this;
    }

    moveTo(x, y)
    {
        const shape = new Polygon([x, y]);

        shape.closed = false;
        this.drawShape(shape);

        return this;
    }

    /**
     * Draws a line using the current line style from the current drawing position to (x, y);
     * The current drawing position is then set to (x, y).
     *
     * @param {number} x - the X coordinate to draw to
     * @param {number} y - the Y coordinate to draw to
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    lineTo(x, y)
    {
        this.currentPath.shape.points.push(x, y);
        this.dirty++;

        return this;
    }

    /**
     * Calculate the points for a quadratic bezier curve and then draws it.
     * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
     *
     * @param {number} cpX - Control point x
     * @param {number} cpY - Control point y
     * @param {number} toX - Destination point x
     * @param {number} toY - Destination point y
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */
    quadraticCurveTo(cpX, cpY, toX, toY)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points = [0, 0];
            }
        }
        else
        {
            this.moveTo(0, 0);
        }

        const n = 20;
        const points = this.currentPath.shape.points;
        let xa = 0;
        let ya = 0;

        if (points.length === 0)
        {
            this.moveTo(0, 0);
        }

        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];

        for (let i = 1; i <= n; ++i)
        {
            const j = i / n;

            xa = fromX + ((cpX - fromX) * j);
            ya = fromY + ((cpY - fromY) * j);

            points.push(xa + (((cpX + ((toX - cpX) * j)) - xa) * j),
                ya + (((cpY + ((toY - cpY) * j)) - ya) * j));
        }

        this.dirty++;

        return this;
    }

    bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points = [0, 0];
            }
        }
        else
        {
            this.moveTo(0, 0);
        }

        const points = this.currentPath.shape.points;

        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];

        points.length -= 2;

        bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);

        this.dirty++;

        return this;
    }

    arcTo(x1, y1, x2, y2, radius)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points.push(x1, y1);
            }
        }
        else
        {
            this.moveTo(x1, y1);
        }

        const points = this.currentPath.shape.points;
        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];
        const a1 = fromY - y1;
        const b1 = fromX - x1;
        const a2 = y2 - y1;
        const b2 = x2 - x1;
        const mm = Math.abs((a1 * b2) - (b1 * a2));

        if (mm < 1.0e-8 || radius === 0)
        {
            if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1)
            {
                points.push(x1, y1);
            }
        }
        else
        {
            const dd = (a1 * a1) + (b1 * b1);
            const cc = (a2 * a2) + (b2 * b2);
            const tt = (a1 * a2) + (b1 * b2);
            const k1 = radius * Math.sqrt(dd) / mm;
            const k2 = radius * Math.sqrt(cc) / mm;
            const j1 = k1 * tt / dd;
            const j2 = k2 * tt / cc;
            const cx = (k1 * b2) + (k2 * b1);
            const cy = (k1 * a2) + (k2 * a1);
            const px = b1 * (k2 + j1);
            const py = a1 * (k2 + j1);
            const qx = b2 * (k1 + j2);
            const qy = a2 * (k1 + j2);
            const startAngle = Math.atan2(py - cy, px - cx);
            const endAngle = Math.atan2(qy - cy, qx - cx);

            this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
        }

        this.dirty++;

        return this;
    }

    arc(cx, cy, radius, startAngle, endAngle, anticlockwise = false)
    {
        if (startAngle === endAngle)
        {
            return this;
        }

        if (!anticlockwise && endAngle <= startAngle)
        {
            endAngle += Math.PI * 2;
        }
        else if (anticlockwise && startAngle <= endAngle)
        {
            startAngle += Math.PI * 2;
        }

        const sweep = endAngle - startAngle;
        const segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 40;

        if (sweep === 0)
        {
            return this;
        }

        const startX = cx + (Math.cos(startAngle) * radius);
        const startY = cy + (Math.sin(startAngle) * radius);

        // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.
        let points = this.currentPath ? this.currentPath.shape.points : null;

        if (points)
        {
            if (points[points.length - 2] !== startX || points[points.length - 1] !== startY)
            {
                points.push(startX, startY);
            }
        }
        else
        {
            this.moveTo(startX, startY);
            points = this.currentPath.shape.points;
        }

        const theta = sweep / (segs * 2);
        const theta2 = theta * 2;

        const cTheta = Math.cos(theta);
        const sTheta = Math.sin(theta);

        const segMinus = segs - 1;

        const remainder = (segMinus % 1) / segMinus;

        for (let i = 0; i <= segMinus; ++i)
        {
            const real = i + (remainder * i);

            const angle = ((theta) + startAngle + (theta2 * real));

            const c = Math.cos(angle);
            const s = -Math.sin(angle);

            points.push(
                (((cTheta * c) + (sTheta * s)) * radius) + cx,
                (((cTheta * -s) + (sTheta * c)) * radius) + cy
            );
        }

        this.dirty++;

        return this;
    }

    beginFill(color = 0, alpha = 1)
    {
        this.filling = true;
        this.fillColor = color;
        this.fillAlpha = alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this.fillColor;
                this.currentPath.fillAlpha = this.fillAlpha;
            }
        }

        return this;
    }

    endFill()
    {
        this.filling = false;
        this.fillColor = null;
        this.fillAlpha = 1;

        return this;
    }

    drawRect(x, y, width, height)
    {
        this.drawShape(new Rectangle(x, y, width, height));
        return this;
    }

    drawRoundedRect(x, y, width, height, radius)
    {
        this.drawShape(new RoundedRectangle(x, y, width, height, radius));

        return this;
    }

    drawCircle(x, y, radius)
    {
        this.drawShape(new Circle(x, y, radius));

        return this;
    }

    drawEllipse(x, y, width, height)
    {
        this.drawShape(new Ellipse(x, y, width, height));

        return this;
    }

    drawPolygon(path)
    {
        // prevents an argument assignment deopt
        // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        let points = path;

        let closed = true;

        if (points instanceof Polygon)
        {
            closed = points.closed;
            points = points.points;
        }

        if (!Array.isArray(points))
        {
            // prevents an argument leak deopt
            // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            points = new Array(arguments.length);

            for (let i = 0; i < points.length; ++i)
            {
                points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
            }
        }

        const shape = new Polygon(points);

        shape.closed = closed;

        this.drawShape(shape);

        return this;
    }

    clear()
    {
        if (this.lineWidth || this.filling || this.graphicsData.length > 0)
        {
            this.lineWidth = 0;
            this.filling = false;

            this.boundsDirty = -1;
            this.dirty++;
            this.clearDirty++;
            this.graphicsData.length = 0;
        }

        this.currentPath = null;
        this._spriteRect = null;

        return this;
    }


    /**
     * Renders the object using the WebGL renderer
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */
    _renderWebGL(renderer)
    {

        renderer.setObjectRenderer(renderer.plugins.graphics);
        renderer.plugins.graphics.render(this);
    }

    /**
     * Renders the object using the Canvas renderer
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */
    _renderCanvas(renderer)
    {
        renderer.plugins.graphics.render(this);
    }


    /**
     * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
     *
     * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
     * @return {PIXI.GraphicsData} The generated GraphicsData object.
     */
    drawShape(shape)
    {
        if (this.currentPath)
        {
            // check current path!
            if (this.currentPath.shape.points.length <= 2)
            {
                this.graphicsData.pop();
            }
        }

        this.currentPath = null;

        const data = new GraphicsData(
            this.lineWidth,
            this.lineColor,
            this.lineAlpha,
            this.fillColor,
            this.fillAlpha,
            this.filling,
            shape
        );

        this.graphicsData.push(data);

        if (data.type === SHAPES.POLY)
        {
            data.shape.closed = data.shape.closed || this.filling;
            this.currentPath = data;
        }

        this.dirty++;

        return data;
    }


    /**
     * Closes the current path.
     *
     * @return {PIXI.Graphics} Returns itself.
     */
    closePath()
    {
        // ok so close path assumes next one is a hole!
        const currentPath = this.currentPath;

        if (currentPath && currentPath.shape)
        {
            currentPath.shape.close();
        }

        return this;
    }

    destroy(options)
    {
        super.destroy(options);

        // destroy each of the GraphicsData objects
        for (let i = 0; i < this.graphicsData.length; ++i)
        {
            this.graphicsData[i].destroy();
        }

        // for each webgl data entry, destroy the WebGLGraphicsData
        for (const id in this._webgl)
        {
            for (let j = 0; j < this._webgl[id].data.length; ++j)
            {
                this._webgl[id].data[j].destroy();
            }
        }

        if (this._spriteRect)
        {
            this._spriteRect.destroy();
        }

        this.graphicsData = null;

        this.currentPath = null;
        this._webgl = null;
        this._localBounds = null;
    }

}