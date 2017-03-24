/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 正n边形（n>=3）
 *
 * 对应context的属性有 
 *
 * @r 正n边形外接圆半径
 * @r 指明正几边形
 *
 * @pointList 私有，从上面的r和n计算得到的边界值的集合
 */
import Polygon from "./Polygon";
import Utils from "../utils/index";
import _ from "../utils/underscore";
import _Math from "../geom/Math"

export default class Isogon extends Polygon
{
    constructor(opt)
    {
        opt = Utils.checkOpt(opt);
        var _context = _.extend({
            pointList: [], //从下面的r和n计算得到的边界值的集合
            r: 0, //{number},  // 必须，正n边形外接圆半径
            n: 0 //{number},  // 必须，指明正几边形
        } , opt.context);
        _context.pointList = _Math.getIsgonPointList( _context.n , _context.r );

        opt.context = _context;

        super( opt );

        this.type = "isogon";
        this.id = Utils.createId(this.type);
    }

    watch(name, value, preValue)
    {
        if (name == "r" || name == "n"){ //如果path有变动，需要自动计算新的pointList
            this.context.pointList = _Math.getIsgonPointList( style.n , style.r );
        }

        if (name == "pointList" || name == "smooth" || name == "lineType") {
            this.clearGraphicsData();
        }

    }
};