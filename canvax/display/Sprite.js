/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 中 的sprite类，目前还只是个简单的容易。
 */
import DisplayObjectContainer from "./DisplayObjectContainer";
import Utils from "../utils/index";

var Sprite = function(){
    this.type = "sprite";
    Sprite.superclass.constructor.apply(this, arguments);
};

Utils.creatClass(Sprite , DisplayObjectContainer , {
    init : function(){
    
    }
});

export default Sprite;
