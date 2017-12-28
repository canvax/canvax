import { SHAPES } from '../../const';

export default class Rectangle
{
    constructor(x = 0, y = 0, width = 0, height = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = SHAPES.RECT;
        this.closed = true;
    }

    clone()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    copy(rectangle)
    {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;

        return this;
    }

    contains(x, y)
    {
        /*
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }
        */
        if( this.height*y < 0 || this.width*x<0 ){
            return false;
        };

        if ( 
            ( 
                ( x >= this.x && x <= (this.x + this.width) )
            )
            &&  (
                (this.height>= 0 && y >= this.y && y <= (this.y + this.height) ) ||
                (this.height < 0 && y <= this.y && y >= (this.y + this.height) )
            )
        ) {
            return true;
        }

        return false;

        //当x和 width , y和height都 为正或者都未负数的情况下，才可能在范围内

        /*
        if (x >= this.x && x < this.x + this.width)
        {
            if (y >= this.y && y < this.y + this.height)
            {
                return true;
            }
        }
        */

        return false;
    }
}
