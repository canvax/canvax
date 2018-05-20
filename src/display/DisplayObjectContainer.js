/** 
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3的DisplayList 中的容器类
 */
import _ from "../utils/underscore";
import DisplayObject from "./DisplayObject";
import Point from "./Point";

export default class DisplayObjectContainer extends DisplayObject
{
    constructor(opt){
        
        super( opt );

        this.children = [];
        this.mouseChildren = [];
        //所有的容器默认支持event 检测，因为 可能有里面的shape是eventEnable是true的
        //如果用户有强制的需求让容器下的所有元素都 不可检测，可以调用
        //DisplayObjectContainer的 setEventEnable() 方法
        this._eventEnabled = true;
    }

    addChild(child , index)
    {
        if( !child ) {
            return;
        };
        if(this.getChildIndex(child) != -1) {
            child.parent = this;
            return child;
        };
        //如果他在别的子元素中，那么就从别人那里删除了
        if(child.parent) {
            child.parent.removeChild(child);
        };
        
        if( index === undefined ){
            index = this.children.length
        };

        this.children.splice(index, 0, child);

        child.parent = this;

        if(this.heartBeat){
           this.heartBeat({
             convertType : "children",
             target      : child,
             src         : this
           });
        };

        if(this._afterAddChild){
           this._afterAddChild(child);
        };

        return child;
    }

    addChildAt(child, index) 
    {
        return this.addChild( child , index );
    }

    removeChild(child) 
    {
        return this.removeChildAt(_.indexOf( this.children , child ));
    }

    removeChildAt(index) 
    {
        if (index < 0 || index > this.children.length - 1) {
            return false;
        };
        var child = this.children[index];
        if (child != null) {
            child.parent = null;
        };
        this.children.splice(index, 1);
        
        if(this.heartBeat){
           this.heartBeat({
             convertType : "children",
             target       : child,
             src      : this
           });
        };
        
        if(this._afterDelChild){
           this._afterDelChild(child , index);
        }

        return child;
    }

    removeChildById( id ) 
    {  
        for(var i = 0, len = this.children.length; i < len; i++) {
            if(this.children[i].id == id) {
                return this.removeChildAt(i);
            }
        }
        return false;
    }

    removeAllChildren() 
    {
        while(this.children.length > 0) {
            this.removeChildAt(0);
        }
    }

    //集合类的自我销毁
    destroy()
    {
        /*
        if( this.parent ){
            this.parent.removeChild(this);
            this.parent = null;
        };
        this.fire("destroy");
        */
        
        //依次销毁所有子元素
        for (var i=0,l=this.children.length ; i<l ; i++){
            this.getChildAt(i).destroy();
            i--;
            l--;
        };
        this._destroy();
    }

    /*
     *@id 元素的id
     *@boolen 是否深度查询，默认就在第一层子元素中查询
     **/
    getChildById(id , boolen)
    {
        if(!boolen) {
            for(var i = 0, len = this.children.length; i < len; i++){
                if(this.children[i].id == id) {
                    return this.children[i];
                }
            }
        } else {
            //深度查询
            //TODO:暂时未实现
            return null
        }
        return null;
    }

    getChildAt(index) 
    {
        if (index < 0 || index > this.children.length - 1) return null;
        return this.children[index];
    }

    getChildIndex(child) 
    {
        return _.indexOf( this.children , child );
    }

    setChildIndex(child, index)
    {
        if(child.parent != this) return;
        var oldIndex = _.indexOf( this.children , child );
        if(index == oldIndex) return;
        this.children.splice(oldIndex, 1);
        this.children.splice(index, 0, child);
    }

    getNumChildren() 
    {
        return this.children.length;
    }

    //获取x,y点上的所有object  num 需要返回的obj数量
    getObjectsUnderPoint( point , num) 
    {
        var result = [];
        
        for(var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];

            if( child == null ||
                (!child._eventEnabled && !child.dragEnabled) || 
                !child.context.$model.visible 
            ) {
                continue;
            }
            if( child instanceof DisplayObjectContainer ) {
                //是集合
                if (child.mouseChildren && child.getNumChildren() > 0){
                   var objs = child.getObjectsUnderPoint( point );
                   if (objs.length > 0){
                      result = result.concat( objs );
                   }
                }       
            } else {
                //非集合，可以开始做getChildInPoint了
                if (child.getChildInPoint( point )) {
                    result.push(child);
                    if (num != undefined && !isNaN(num)){
                       if(result.length == num){
                          return result;
                       }
                    }
                }
            }
        }
        return result;
    }
}