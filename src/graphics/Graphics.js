/*
* Graphics绘图法则
* 单个grahics实例里的fill line 样式属性，都从对应shape.context 中获取
* 
*/

import GraphicsData from './GraphicsData';
import { Rectangle, Ellipse, Polygon, Circle } from '../math/index';
import { SHAPES } from '../const';
import bezierCurveTo from './utils/bezierCurveTo';
import _ from "../utils/underscore";

export default class Graphics 
{
    constructor( shape )
    {

        this.lineWidth = 1;
        this.strokeStyle = null;
        this.strokeAlpha = 1;
        this.fillStyle = null;
        this.fillAlpha = 1;

        this.shadowOffsetX = 0;     //阴影向右偏移量
        this.shadowOffsetY = 0;     //阴影向下偏移量
        this.shadowBlur    = 0;     //阴影模糊效果
        this.shadowColor   ='black';//阴影颜色

        this.lineCap       = 'round';//默认都是直角
        this.lineJoin      = 'round';//这两个目前webgl里面没实现
        this.miterLimit    = null;//miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。


        //比如path m 0 0 l 0 0 m 1 1 l 1 1
        //就会有两条graphicsData数据产生
        this.graphicsData = [];
        this.currentPath = null;

        this.dirty = 0; //用于检测图形对象是否已更改。 如果这是设置为true，那么图形对象将被重新计算。
        this.clearDirty = 0; //用于检测我们是否清除了图形webGL数据

        this._webGL = {};
        this.worldAlpha = 1;
        this.tint = 0xFFFFFF; //目标对象附加颜色

        this.Bound = {
            x:0,y:0,width:0,height:0
        }
    }

    setStyle( context )
    {
        //从 shape 中把绘图需要的style属性同步过来
        const model = context.$model;

        this.lineWidth     = model.lineWidth;
        this.strokeStyle   = model.strokeStyle;
        this.strokeAlpha   = model.strokeAlpha * model.globalAlpha;

        this.fillStyle     = model.fillStyle;
        this.fillAlpha     = model.fillAlpha * model.globalAlpha;

        this.shadowOffsetX = model.shadowOffsetX; //阴影向右偏移量
        this.shadowOffsetY = model.shadowOffsetY; //阴影向下偏移量
        this.shadowBlur    = model.shadowBlur;    //阴影模糊效果
        this.shadowColor   = model.shadowColor;   //阴影颜色

        this.lineCap       = model.lineCap;
        this.lineJoin      = model.lineJoin;
        this.miterLimit    = model.miterLimit;

        var g = this;

        //一般都是先设置好style的，所以 ， 当后面再次设置新的style的时候
        //会把所有的data都修改
        //TODO: 后面需要修改, 能精准的确定是修改 graphicsData 中的哪个data
        if( this.graphicsData.length ){
            _.each( this.graphicsData , function(gd , i){
                gd.synsStyle( g );
            } );
        }
    }

    clone()
    {
        
        const clone = new Graphics();

        clone.dirty = 0;

        // copy graphics data
        for (let i = 0; i < this.graphicsData.length; ++i)
        {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];
        return clone;
    }

    moveTo(x, y)
    {
        const shape = new Polygon([x, y]);

        shape.closed = false;
        this.drawShape(shape);

        return this;
    }
    
    lineTo(x, y)
    {
        if( this.currentPath ){
            this.currentPath.shape.points.push(x, y);
            this.dirty++;
        } else {
            this.moveTo(0,0);
        }
        return this;
    }

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
        const segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 48;

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

    drawRect(x, y, width, height)
    {
        this.drawShape(new Rectangle(x, y, width, height));
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
        if (this.graphicsData.length > 0)
        {
            this.dirty++;
            this.clearDirty++;
            this.graphicsData.length = 0;
        }

        this.currentPath = null;

        return this;
    }

    drawShape(shape)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.graphicsData.pop();
            }
        }

        //this.currentPath = null;
        this.beginPath();

        const data = new GraphicsData(
            this.lineWidth,
            this.strokeStyle,
            this.strokeAlpha,
            this.fillStyle,
            this.fillAlpha,
            this.shadowOffsetX, //阴影向右偏移量
            this.shadowOffsetY, //阴影向下偏移量
            this.shadowBlur   , //阴影模糊效果
            this.shadowColor  , //阴影颜色
            shape
        );

        this.graphicsData.push(data);

        if (data.type === SHAPES.POLY)
        {
            data.shape.closed = data.shape.closed;
            this.currentPath = data;
        }

        this.dirty++;

        return data;
    }

    beginPath()
    {
        this.currentPath = null;
    }

    closePath()
    {
        const currentPath = this.currentPath;

        if (currentPath && currentPath.shape)
        {
            currentPath.shape.close();
        }

        return this;
    }

     /**
     * Update the bounds of the object
     *
     */
    updateLocalBounds()
    {
        let minX = Infinity;
        let maxX = -Infinity;

        let minY = Infinity;
        let maxY = -Infinity;

        if (this.graphicsData.length)
        {
            let shape = 0;
            let x = 0;
            let y = 0;
            let w = 0;
            let h = 0;

            for (let i = 0; i < this.graphicsData.length; i++)
            {
                const data = this.graphicsData[i];
                const type = data.type;
                const lineWidth = data.lineWidth;

                shape = data.shape;

                if (type === SHAPES.RECT || type === SHAPES.RREC)
                {
                    x = shape.x - (lineWidth / 2);
                    y = shape.y - (lineWidth / 2);
                    w = shape.width + lineWidth;
                    h = shape.height + lineWidth;

                    minX = x < minX ? x : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y < minY ? y : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === SHAPES.CIRC)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.radius + (lineWidth / 2);
                    h = shape.radius + (lineWidth / 2);

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === SHAPES.ELIP)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.width + (lineWidth / 2);
                    h = shape.height + (lineWidth / 2);

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else
                {
                    // POLY
                    const points = shape.points;
                    let x2 = 0;
                    let y2 = 0;
                    let dx = 0;
                    let dy = 0;
                    let rw = 0;
                    let rh = 0;
                    let cx = 0;
                    let cy = 0;

                    for (let j = 0; j + 2 < points.length; j += 2)
                    {
                        x = points[j];
                        y = points[j + 1];
                        x2 = points[j + 2];
                        y2 = points[j + 3];
                        dx = Math.abs(x2 - x);
                        dy = Math.abs(y2 - y);
                        h = lineWidth;
                        w = Math.sqrt((dx * dx) + (dy * dy));

                        if (w < 1e-9)
                        {
                            continue;
                        }

                        rw = ((h / w * dy) + dx) / 2;
                        rh = ((h / w * dx) + dy) / 2;
                        cx = (x2 + x) / 2;
                        cy = (y2 + y) / 2;

                        minX = cx - rw < minX ? cx - rw : minX;
                        maxX = cx + rw > maxX ? cx + rw : maxX;

                        minY = cy - rh < minY ? cy - rh : minY;
                        maxY = cy + rh > maxY ? cy + rh : maxY;
                    }
                }
            }
        }
        else
        {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }

        this.Bound = {
            x : minX,
            y : minY,
            width : maxX-minX,
            height : maxY - minY
        }
        return this;
    }

    getBound()
    {
        return this.updateLocalBounds().Bound;
    }

    destroy(options)
    {

        for (let i = 0; i < this.graphicsData.length; ++i)
        {
            this.graphicsData[i].destroy();
        }
        for (const id in this._webGL)
        {
            for (let j = 0; j < this._webGL[id].data.length; ++j)
            {
                this._webGL[id].data[j].destroy();
            }
        }

        this.graphicsData = null;
        this.currentPath = null;
        this._webGL = null;
    }

}