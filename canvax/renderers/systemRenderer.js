import { RENDERER_TYPE } from '../const';
import $ form '../utils/dom'

export default class SystemRenderer 
{
    constructor( width, height, options )
    {
        this.type   = RENDERER_TYPE.UNKNOWN;
        this.width  = width  || 600;
        this.height = height || 300;
        this.view   = $.createView( this.width , this.height );
    }

    resize(width, height)
    {
        this.width = width * this.resolution;
        this.height = height * this.resolution;
        this.view.width = this.width;
        this.view.height = this.height;
    }

    destroy(removeView)
    {

    }
}
