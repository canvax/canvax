/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 * 菱形
 **/

import Shape from "../display/Shape";
import _ from "../utils/underscore";

export default class Diamond extends Shape
{
    constructor(opt)
    {
        var _context = _.extend(true,{
            innerRect: { //菱形的内接矩形
                width: 0,
                height: 0
            },
            includedAngle: 60 //菱形x方向的夹角
        } , opt.context);

        opt.context = _context;

        opt.type = "diamond";

        super( opt );
    }

    watch(name, value, preValue)
    {
        //并不清楚是start.x 还是end.x， 当然，这并不重要
        if(['includedAngle'].indexOf(name) > -1){
            this.graphics.clear();
        };
    }

    draw( graphics ) 
    {
        const model = this.context.$model;
        let innerRect = model.innerRect;
        let includedAngle = model.includedAngle/2;
        let includeRad    = includedAngle * Math.PI / 180

        let newWidthDiff  = innerRect.height / Math.tan( includeRad );
        let newHeightDiff = innerRect.width  * Math.tan( includeRad );

        //在内接矩形基础上扩展出来的外界矩形
        let newWidth      = innerRect.width  + newWidthDiff;
        let newHeight     = innerRect.height + newHeightDiff;

        graphics.moveTo( 0, newHeight/2);
        graphics.lineTo( newWidth/2, 0);
        graphics.lineTo( 0, -newHeight/2);
        graphics.lineTo( -newWidth/2, 0);
        graphics.lineTo( 0, newHeight/2);
        graphics.closePath();

        return this;
    }
};