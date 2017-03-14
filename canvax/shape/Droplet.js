/**
 * Canvax
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 水滴形 类
 * 派生自Path类
 *
 * 对应context的属性有
 * @hr 水滴横宽（中心到水平边缘最宽处距离）
 * @vr 水滴纵高（中心到尖端距离）
 **/
import Path from "./Path";
import Utils from "../utils/index";
import _ from "../utils/underscore";

export default class Droplet extends Path
{
    constructor(opt)
    {
        opt = Utils.checkOpt( opt );
        var _context = _.extend({
            hr : 0, //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
            vr : 0   //{number},  // 必须，水滴纵高（中心到尖端距离）
        } , opt.context);

        opt.context = _context;

        var my = super(opt);

        this.type = "droplet";
        this.id = Utils.createId(this.type);

        this.context.path = this._createPath();
    }

    $watch(name, value, preValue) 
    {
        if ( name == "hr" || name == "vr" ) {
            this.context.path = this._createPath();
        }

        if (name == "path") {
            this.setGraphics();
        }
    }
    
    _createPath() 
    {
       var context = this.context;
       var ps = "M 0 "+context.hr+" C "+context.hr+" "+context.hr+" "+( context.hr*3/2 ) +" "+(-context.hr/3)+" 0 "+(-context.vr);
       ps += " C "+(-context.hr * 3/ 2)+" "+(-context.hr / 3)+" "+(-context.hr)+" "+context.hr+" 0 "+ context.hr+ "z";
       return ps;
    }
}