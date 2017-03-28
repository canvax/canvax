import Rectangle from './Rectangle';
import { SHAPES } from '../../const';

export default class Ellipse
{
    constructor(x = 0, y = 0, width = 0, height = 0)
    {
        this.x = x;

        this.y = y;

        this.width = width;

        this.height = height;

        this.type = SHAPES.ELIP;

        this.closed = true;
    }

    clone()
    {
        return new Ellipse(this.x, this.y, this.width, this.height);
    }

    contains(x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }

        let normx = ((x - this.x) / this.width);
        let normy = ((y - this.y) / this.height);

        normx *= normx;
        normy *= normy;

        return (normx + normy <= 1);
    }

    getBounds()
    {
        return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    }
}
