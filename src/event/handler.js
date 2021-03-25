/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
import Event from "./event";
import types from "./types";
import _ from "../utils/underscore";
import $ from "../utils/dom";

var _hammerEventTypes = [ 
    "pan","panstart","panmove","panend","pancancel","panleft","panright","panup","pandown",
    "press" , "pressup",
    "swipe" , "swipeleft" , "swiperight" , "swipeup" , "swipedown",
    "tap"
];

var Handler = function(canvax , opt={}) {
    this.canvax = canvax;

    this.curPoints = [{
        x : 0, y: 0
    }];

    //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y
    //当前激活的点对应的obj，在touch下可以是个数组,和上面的 curPoints 对应
    this.curPointsTarget = [];

    this._touching = false;
    //正在拖动，前提是_touching=true
    this._draging = false;

    //当前的鼠标状态
    this._cursor = "default";

    this.target = this.canvax.view;

    //mouse体统中不需要配置drag,touch中会用到第三方的touch库，每个库的事件名称可能不一样，
    //就要这里配置，默认实现的是hammerjs的,所以默认可以在项目里引入hammerjs http://hammerjs.github.io/
    this.drag = {
        start : "panstart",
        move : "panmove",
        end : "panend"
    };

    this._opt = opt;

    _.extend( true , this , opt );

};

//这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。
var contains = (document && document.compareDocumentPosition) ? function (parent, child) {
    if( !child ){
        return false;
    };
    return !!(parent.compareDocumentPosition(child) & 16);
} : function (parent, child) {
    if( !child ){
        return false;
    }
    return child !== child && (parent.contains ? parent.contains(child) : true);
};

Handler.prototype = {
    init : function(){
        
        //依次添加上浏览器的自带事件侦听
        var me   = this;
        
        if( this._opt.events ){
            types.register( this._opt.events )
        };

        //canvax自己创建的dom的话， 需要动态绑定下事件，如果是外面一件装备好了的dom结构， 比如小程序的，需要外面自己绑定好事件，然后对接下事件处理函数
        if( me.target ){
            if( me.target.nodeType == undefined ){
                //如果target.nodeType没有的话， 说明该target为一个jQuery对象 or kissy 对象or hammer对象
                //即为第三方库，那么就要对接第三方库的事件系统。默认实现hammer的大部分事件系统
                types.register( _hammerEventTypes );
            };
            //阻止浏览器的默认事件，右键
            $.addEvent( me.target , "contextmenu" , function( e ){
                if ( e && e.preventDefault ) {
                    e.preventDefault(); 
                } else {
                    window.event.returnValue = false;
                };
            } );

            _.each( types.get() , function( type ){
                //不再关心浏览器环境是否 'ontouchstart' in window 
                //而是直接只管传给事件模块的是一个原生dom还是 jq对象 or hammer对象等
                if( me.target.nodeType == 1 ){
                    $.addEvent( me.target , type , function( e ){
                        me.__mouseHandler( e );
                    } );
                } else {
                    me.target.on( type , function( e ){
                        me.__libHandler( e );
                    });
                };
            } );
        };
        
    },

    bindEventHandle: function(e, type){
        if( type == 'mouse' ){
            this.__mouseHandler.apply( this, [e] );
        } else {
            this.__libHandler.apply( this, [e] );
        };
    },

    /*
    * 原生事件系统------------------------------------------------begin
    * 鼠标事件处理函数
    **/
    __mouseHandler : function(e) {
        var me = this;
        var root = me.canvax;

        root.updateViewOffset();
    
        me.curPoints = [ {
           x : $.pageX( e ) - root.viewOffset.left , 
           y : $.pageY( e ) - root.viewOffset.top
        }];

        //理论上来说，这里拿到point了后，就要计算这个point对应的target来push到curPointsTarget里，
        //但是因为在drag的时候其实是可以不用计算对应target的。
        //所以放在了下面的me.__getcurPointsTarget( e , curMousePoint );常规mousemove中执行

        var curMousePoint  = me.curPoints[0]; 
        var curMouseTarget = me.curPointsTarget[0];

        if( //这几个事件触发过来，是一定需要检测 curMouseTarget 的
            _.indexOf(['mousedown','mouseover','click'] , e.type)>-1  && 
            !curMouseTarget
        ){
            if( !curMouseTarget ){
                var obj = root.getObjectsUnderPoint( curMousePoint , 1)[0];
                if(obj){
                    me.curPointsTarget = [ obj ];
                }
            };
            curMouseTarget = me.curPointsTarget[0];
        };

        //模拟drag,mouseover,mouseout 部分代码 begin-------------------------------------------------

        //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了
        if( e.type == "mousedown" ){
           //如果curTarget 的数组为空或者第一个为false ，，，
           if ( curMouseTarget && curMouseTarget.dragEnabled ){
               //鼠标事件已经摸到了一个
               me._touching = true;
           };
        };

        if( e.type == "mouseup" || (e.type == "mouseout" && !contains(root.view , (e.toElement || e.relatedTarget) )) ){
            if(me._draging == true){
                //说明刚刚在拖动
                me._dragEnd( e , curMouseTarget , 0 );
                curMouseTarget.fire("dragend");
            };
            me._draging  = false;
            me._touching = false;
        };

        if( e.type == "mouseout" ){
            if( !contains(root.view , (e.toElement || e.relatedTarget) ) ){
                me.__getcurPointsTarget(e, curMousePoint, true);
            }
        } else if( e.type == "mousemove" ){  //|| e.type == "mousedown" ){
            //拖动过程中就不在做其他的mouseover检测，drag优先
            if(me._touching && e.type == "mousemove" && curMouseTarget){
                //说明正在拖动啊
                if(!me._draging){

                    //begin drag
                    curMouseTarget.fire("dragstart");
                    //有可能该child没有hover style
                    if( !curMouseTarget._globalAlpha ){
                        curMouseTarget._globalAlpha = curMouseTarget.context.$model.globalAlpha;
                    };

                    //先把本尊给隐藏了
                    curMouseTarget.context.globalAlpha = 0;
                    //然后克隆一个副本到activeStage
                    
                    var cloneObject = me._clone2hoverStage( curMouseTarget , 0 );
                    cloneObject.context.globalAlpha = curMouseTarget._globalAlpha;
                } else {
                    //drag move ing
                    me._dragIngHander( e , curMouseTarget , 0 );
                };
                me._draging = true;
            } else {
                //常规mousemove检测
                //move事件中，需要不停的搜索target，这个开销挺大，
                //后续可以优化，加上和帧率相当的延迟处理
                me.__getcurPointsTarget( e , curMousePoint );
            }

        } else {
            //其他的事件就直接在target上面派发事件
            var child = curMouseTarget;
            if( !child ){
                child = root;
            };
            me.__dispatchEventInChilds( e , [ child ] );
            me._cursorHander( child );
        };

        if( root.preventDefault || e._preventDefault ){
            //阻止默认浏览器动作(W3C) 
            if ( e && e.preventDefault ) {
                e.preventDefault(); 
            } else {
                window.event.returnValue = false;
            }
        }; 
    },

    //notInRootView 真正的mouseout,鼠标已经不在图表的节点内了
    __getcurPointsTarget : function(e, point, notInRootView ) {
        var me     = this;
        var root   = me.canvax;
        var oldObj = me.curPointsTarget[0];

        if( oldObj && !oldObj.context ){
            oldObj = null;
        };

        var e = new Event( e );

        if( e.type=="mousemove"
            && oldObj && (oldObj._hoverClass && oldObj.hoverClone) && oldObj.pointChkPriority
            && oldObj.getChildInPoint( point ) ){
            //小优化,鼠标move的时候。计算频率太大，所以。做此优化
            //如果有target存在，而且当前元素正在hoverStage中，而且当前鼠标还在target内,就没必要取检测整个displayList了
            //开发派发常规mousemove事件
            e.target = e.currentTarget = oldObj;
            e.point  = oldObj.globalToLocal( point );
            oldObj.dispatchEvent( e );
            return;
        };
        var obj = notInRootView ? null: root.getObjectsUnderPoint( point , 1)[0];

        if(oldObj && oldObj != obj || e.type=="mouseout") {
            if( oldObj && oldObj.context ){
                me.curPointsTarget[0] = null;
                e.type     = "mouseout";
                e.toTarget = obj; 
                e.target   = e.currentTarget = oldObj;
                e.point    = oldObj.globalToLocal( point );
                oldObj.dispatchEvent( e );
            }
        };

        if( obj && oldObj != obj ){
            me.curPointsTarget[0] = obj;
            e.type       = "mouseover";
            e.fromTarget = oldObj;
            e.target     = e.currentTarget = obj;
            e.point      = obj.globalToLocal( point );
            obj.dispatchEvent( e );
        };

        if( e.type == "mousemove" && obj ){
            e.target = e.currentTarget = oldObj;
            e.point  = oldObj.globalToLocal( point );
            oldObj.dispatchEvent( e );
        };
        me._cursorHander( obj , oldObj );
    },
    _cursorHander    : function( obj , oldObj ){
        if(!obj && !oldObj ){
            this._setCursor("default");
        }
        if(obj && oldObj != obj && obj.context){
            this._setCursor(obj.context.$model.cursor);
        }
    },
    _setCursor : function(cursor) {
        if(this._cursor == cursor){
          //如果两次要设置的鼠标状态是一样的
          return;
        };
        this.canvax.view.style.cursor = cursor;
        this._cursor = cursor;
    },
    /*
    * 原生事件系统------------------------------------------------end
    */

    /*
     *第三方库的事件系统------------------------------------------------begin
     *触屏事件处理函数
     * */
    __libHandler : function( e ) {
        
        var me   = this;
        var root = me.canvax;
        root.updateViewOffset();
        // touch 下的 curPointsTarget 从touches中来
        //获取canvax坐标系统里面的坐标
        me.curPoints = me.__getCanvaxPointInTouchs( e );
        if( !me._draging ){
            //如果在draging的话，target已经是选中了的，可以不用 检测了
            me.curPointsTarget = me.__getChildInTouchs( me.curPoints );
        };
        if( me.curPointsTarget.length > 0 ){
            //drag开始
            if( me.drag.start.indexOf(e.type) > -1 ){
                //dragstart的时候touch已经准备好了target， curPointsTarget 里面只要有一个是有效的
                //就认为drags开始
                _.each( me.curPointsTarget , function( child , i ){
                    if( child && child.dragEnabled ){
                       //只要有一个元素就认为正在准备drag了
                       me._draging = true;

                       //有可能该child没有hover style
                       if( !child._globalAlpha ){
                           child._globalAlpha = child.context.$model.globalAlpha;
                       };

                       //然后克隆一个副本到activeStage
                       me._clone2hoverStage( child , i );

                       //先把本尊给隐藏了
                       child.context.globalAlpha = 0;

                       child.fire("dragstart");

                       return false;
                    }
                } ) 
            };

            //dragIng
            if( me.drag.move.indexOf(e.type) > -1 ){
                if( me._draging ){
                    _.each( me.curPointsTarget , function( child , i ){
                        if( child && child.dragEnabled) {
                           me._dragIngHander( e , child , i);
                        }
                    } )
                }
            };

            //drag结束
            if( me.drag.end.indexOf(e.type) > -1 ){
                if( me._draging ){
                    _.each( me.curPointsTarget , function( child , i ){
                        if( child && child.dragEnabled) {
                            me._dragEnd( e , child , 0 );
                            child.fire("dragend");
                        }
                    } );
                    me._draging = false;
                }
            };
            me.__dispatchEventInChilds( e , me.curPointsTarget );
        } else {
            //如果当前没有一个target，就把事件派发到canvax上面
            me.__dispatchEventInChilds( e , [ root ] );
        };
    },
    //从touchs中获取到对应touch , 在上面添加上canvax坐标系统的x，y
    __getCanvaxPointInTouchs : function( e ){
        var me        = this;
        var root      = me.canvax;
        var curTouchs = [];
        _.each( e.point || e.touches , function( touch ){
           curTouchs.push( {
               x : 'x' in touch ? touch.x : ($.pageX( touch ) - root.viewOffset.left),
               y : 'y' in touch ? touch.y : ($.pageY( touch ) - root.viewOffset.top)
           } );
        });
        return curTouchs;
    },
    __getChildInTouchs : function( touchs ){
        var me   = this;
        var root = me.canvax;
        var touchesTarget = [];
        _.each( touchs , function(touch){
            touchesTarget.push( root.getObjectsUnderPoint( touch , 1)[0] );
        } );
        return touchesTarget;
    },
    /*
    *第三方库的事件系统------------------------------------------------end
    */


    /*
     *@param {array} childs 
     * */
    __dispatchEventInChilds: function(e, childs) {
        if (!childs && !("length" in childs)) {
            return false;
        }
        var me = this;
        _.each(childs, function(child, i) {
            if (child) {
                var ce = new Event(e);
                //ce.target = ce.currentTarget = child || this;
                ce.stagePoint = me.curPoints[i];
                ce.point = child.globalToLocal(ce.stagePoint);
                child.dispatchEvent(ce);
            }
        });
    },
    //克隆一个元素到hover stage中去
    _clone2hoverStage: function(target, i) {
        var me = this;
        var root = me.canvax;
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        if (!_dragDuplicate) {
            _dragDuplicate = target.clone(true);
            _dragDuplicate._transform = target.getConcatenatedMatrix();

            /**
             *TODO: 因为后续可能会有手动添加的 元素到_bufferStage 里面来
             *比如tips
             *这类手动添加进来的肯定是因为需要显示在最外层的。在hover元素之上。
             *所有自动添加的hover元素都默认添加在_bufferStage的最底层
             **/
            root._bufferStage.addChildAt(_dragDuplicate, 0);
        }
        _dragDuplicate.context.globalAlpha = target._globalAlpha;
        target._dragPoint = target.globalToLocal(me.curPoints[i]);
        return _dragDuplicate;
    },
    //drag 中 的处理函数
    _dragIngHander: function(e, target, i) {
        
        var me = this;
        var root = me.canvax;
        var _point = target.globalToLocal( me.curPoints[i] );

        //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化
        target._noHeart = true;
        var _moveStage = target.moveing;
        target.moveing = true;
        target.context.x += (_point.x - target._dragPoint.x);
        target.context.y += (_point.y - target._dragPoint.y);
        target.fire("draging");
        target.moveing = _moveStage;
        target._noHeart = false;
        //同步完毕本尊的位置

        //这里只能直接修改_transform 。 不能用下面的修改x，y的方式。
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        _dragDuplicate._transform = target.getConcatenatedMatrix();

        //worldTransform在renderer的时候计算
        _dragDuplicate.worldTransform = null;

        //setWorldTransform都统一在render中执行，这里注释掉
        //_dragDuplicate.setWorldTransform();

        //直接修改的_transform不会出发心跳上报， 渲染引擎不制动这个stage需要绘制。
        //所以要手动出发心跳包
        _dragDuplicate.heartBeat();
    },
    //drag结束的处理函数
    //TODO: dragend的还需要处理end的点是否还在元素上面，要恢复hover状态
    _dragEnd: function(e, target, i) {
        var me = this;
        var root = me.canvax;

        //_dragDuplicate 复制在_bufferStage 中的副本
        var _dragDuplicate = root._bufferStage.getChildById(target.id);
        _dragDuplicate && _dragDuplicate.destroy();

        target.context.globalAlpha = target._globalAlpha;
    }
};
export default Handler;