import Rectangle from './Rectangle';
import { SHAPES } from '../../const';

export default class Circle
{
    constructor(x = 0, y = 0, radius = 0)
    {
        this.x = x;

        this.y = y;

        this.radius = radius;

        this.type = SHAPES.CIRC;

        this.closed = true;
    }

    clone()
    {
        return new Circle(this.x, this.y, this.radius);
    }

    contains(x, y)
    {
        if (this.radius <= 0)
        {
            return false;
        }

        const r2 = this.radius * this.radius;
        let dx = (this.x - x);
        let dy = (this.y - y);

        dx *= dx;
        dy *= dy;

        return (dx + dy <= r2);
    }

    getBounds()
    {
        return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}
