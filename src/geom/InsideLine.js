

/**
 * 线段包含判断
 * @points [0,0,0,0]
 */
var _isInsideLine = function( points, x, y, lineWidth ) 
{
    var x0 = points[0];
    var y0 = points[1];
    var x1 = points[2];
    var y1 = points[3];
    var _l = Math.max(lineWidth , 3);
    var _a = 0;
    var _b = x0;

    if(
        (y > y0 + _l && y > y1 + _l) 
        || (y < y0 - _l && y < y1 - _l) 
        || (x > x0 + _l && x > x1 + _l) 
        || (x < x0 - _l && x < x1 - _l) 
    ){
        return false;
    }

    if (x0 !== x1) {
        _a = (y0 - y1) / (x0 - x1);
        _b = (x0 * y1 - x1 * y0) / (x0 - x1);
    } else {
        return Math.abs(x - x0) <= _l / 2;
    }

    var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);
    return _s <= _l / 2 * _l / 2;
} 

export default function insideLine(data, x, y, line) 
{   
    var points = data.shape.points;
    var lineWidth = data.lineWidth;
    var insideCatch = false;
    for(let i = 0; i < points.length; ++i){
        insideCatch = _isInsideLine( points.slice(i , i+4) , x , y , lineWidth );
        if( insideCatch ){
            break;
        };
        i += 1
    };
    return insideCatch;
}