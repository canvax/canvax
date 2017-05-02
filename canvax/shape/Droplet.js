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
        var _context = _.extend({
            hr : 0, //{number},  // 必须，水滴横宽（中心到水平边缘最宽处距离）
            vr : 0   //{number},  // 必须，水滴纵高（中心到尖端距离）
        } , opt.context);

        opt.context = _context;
        opt.type = "droplet";

        var my = super(opt);

        this.context.$model.path = this.createPath();
    }

    watch(name, value, preValue) 
    {
        if ( name == "hr" || name == "vr" ) {
            this.context.$model.path = this.createPath();
        }
    }
    
    createPath() 
    {
        var model = this.context.$model;
        var ps = "M 0 "+model.hr+" C "+model.hr+" "+model.hr+" "+( model.hr*3/2 ) +" "+(-model.hr/3)+" 0 "+(-model.vr);
        ps += " C "+(-model.hr * 3/ 2)+" "+(-model.hr / 3)+" "+(-model.hr)+" "+model.hr+" 0 "+ model.hr+ "z";
        return ps;
    }
}