/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 */
define(
    "canvax/event/EventHandler", [
        "canvax/display/Point",
        "canvax/event/CanvaxEvent",
        "canvax/utils/underscore",
        "canvax/utils/dom"
    ],
    function(Point, CanvaxEvent , _ , $) {
        
        var EventHandler = function(canvax) {
            this.canvax = canvax;

            this.curPoints = [new Point(0, 0)] //X,Y 的 point 集合, 在touch下面则为 touch的集合，只是这个touch被添加了对应的x，y
            //当前激活的点对应的obj，在touch下可以是个数组,和上面的 curPoints 对应
            this.curPointsTarget = [];

            this._touching = false;
            //正在拖动，前提是_touching=true
            this._draging = false;

            //当前的鼠标状态
            this._cursor = "default";

            this.eventTarget = this.canvax.el;
            this.eventTypes = ["click","dblclick","mousedown","mousemove","mouseup","mouseout"];
            //mouse体统中不需要配置drag,touch中会用到第三方的touch库，每个库的事件名称可能不一样，
            //就要这里配置，默认实现的是hammerjs的,所以默认可以在项目里引入hammerjs http://hammerjs.github.io/
            this.drag = {
                start : "panstart",
                move : "panmove",
                end : "panend"
            }; 


        };

        //这样的好处是document.compareDocumentPosition只会在定义的时候执行一次。
        var contains = document.compareDocumentPosition ? function (parent, child) {
            if( !child ){
                return false;
            }
            return !!(parent.compareDocumentPosition(child) & 16);
        } : function (parent, child) {
            if( !child ){
                return false;
            }
            return child !== child && (parent.contains ? parent.contains(child) : true);
        };

        EventHandler.prototype = {
            init : function(){
                //依次添加上浏览器的自带事件侦听
                var me   = this;
                _.each( me.eventTypes , function( type ){
                    if( me.eventTarget.nodeType == 1 ){
                        $.addEvent( me.eventTarget , type , function( e ){
                            me.__handler( e );
                        } );
                    } else {
                        me.eventTarget.on( type , function( e ){
                            me.__handler( e );
                        });
                    };
                } );   
            },
            __handler : function( e ){
                if( 'ontouchstart' in window ){
                    this.__TouchHandler( e );
                } else {
                    this.__mouseHandler( e );
                };
            },

            /*
            * 原生事件系统------------------------------------------------begin
            * 鼠标事件处理函数
            **/
            __mouseHandler : function(e) {
                var me = this;
                var root = me.canvax;

                root.updateRootOffset();
            
                me.curPoints = [ new Point( 
                    CanvaxEvent.pageX( e ) - root.rootOffset.left , 
                    CanvaxEvent.pageY( e ) - root.rootOffset.top
                )];
                //理论上来说，这里拿到point了后，就要计算这个point对应的target来push到curPointsTarget里，
                //但是因为在drag的时候其实是可以不用计算对应target的。
                //所以放在了下面的me.__getcurPointsTarget( e , curMousePoint );常规mousemove中执行
 
                var curMousePoint  = me.curPoints[0]; 
                var curMouseTarget = me.curPointsTarget[0];

                //模拟drag,mouseover,mouseout 部分代码 begin-------------------------------------------------
 
                //mousedown的时候 如果 curMouseTarget.dragEnabled 为true。就要开始准备drag了
                if( e.type == "mousedown" ){
                   //如果curTarget 的数组为空或者第一个为false ，，，
                   if( !curMouseTarget ){
                     var obj = root.getObjectsUnderPoint( curMousePoint , 1)[0];
                     if(obj){
                       me.curPointsTarget = [ obj ];
                     }
                   };
                   curMouseTarget = me.curPointsTarget[0];
                   if ( curMouseTarget && curMouseTarget.dragEnabled ){
                       //鼠标事件已经摸到了一个
                       me._touching = true;
                   };
                };
 
                if( e.type == "mouseup" || (e.type == "mouseout" && !contains(root.el , (e.toElement || e.relatedTarget) )) ){
                    if(me._draging == true){
                        //说明刚刚在拖动
                        me._dragEnd( e , curMouseTarget , 0 );
                        curMouseTarget.fire("dragend" , e);
                    };
                    me._draging  = false;
                    me._touching = false;
                };
 
                if( e.type == "mouseout" ){
                    if( !contains(root.el , (e.toElement || e.relatedTarget) ) ){
                        me.__getcurPointsTarget(e , curMousePoint);
                    }
                } else if( e.type == "mousemove" ){  //|| e.type == "mousedown" ){
                    //拖动过程中就不在做其他的mouseover检测，drag优先
                    if(me._touching && e.type == "mousemove" && curMouseTarget){
                        //说明正在拖动啊
                        if(!me._draging){
                            //begin drag
                            //curMouseTarget.dragBegin && curMouseTarget.dragBegin(e);

                            curMouseTarget.fire("dragstart" , e);
                            
                            curMouseTarget._globalAlpha = curMouseTarget.context.globalAlpha;

                            //先把本尊给隐藏了
                            curMouseTarget.context.globalAlpha = 0;
                                                 
                            //然后克隆一个副本到activeStage
                            var cloneObject = me._clone2hoverStage( curMouseTarget , 0 );

                            cloneObject.context.globalAlpha = curMouseTarget._globalAlpha;
                            
                        } else {
                            //drag ing
                            me._dragHander( e , curMouseTarget , 0 );

                            curMouseTarget._notWatch = true;
                            curMouseTarget.fire("dragmove" , e);
                            curMouseTarget._notWatch = false;

                            //拖动中可能会限定其x,y轨迹。必须拖动的时候，x或者y轴恒定
                            //比如在kanga中的rect调整框的上下左右改变大小的时候x或者y有一个会是恒定的
                            var _dragDuplicate = root._hoverStage.getChildById( curMouseTarget.id );
                            var _dmt = curMouseTarget.getConcatenatedMatrix();
 
                            _dragDuplicate.context.x = _dmt.tx;//curMouseTarget.context.x;
                            _dragDuplicate.context.y = _dmt.ty;//curMouseTarget.context.y;
                        }
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

                if( root.preventDefault ) {
                    //阻止默认浏览器动作(W3C) 
                    if ( e && e.preventDefault ) {
                        e.preventDefault(); 
                    } else {
                        window.event.returnValue = false;
                    }
                }; 
            },
            __getcurPointsTarget : function(e , point ) {
                var me     = this;
                var root   = me.canvax;
                var oldObj = me.curPointsTarget[0];
 
                var e = new CanvaxEvent( e );
 
                if( e.type=="mousemove"
                    && oldObj && oldObj._hoverClass && oldObj.pointChkPriority
                    && oldObj.getChildInPoint( point ) ){
                    //小优化,鼠标move的时候。计算频率太大，所以。做此优化
                    //如果有target存在，而且当前元素正在hoverStage中，而且当前鼠标还在target内,就没必要取检测整个displayList了
                    //开发派发常规mousemove事件
                    e.target = e.currentTarget = oldObj;
                    e.point  = oldObj.globalToLocal( point );
                    oldObj.dispatchEvent( e );
                    return;
                };
                var obj = root.getObjectsUnderPoint( point , 1)[0];
 
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
 
                if( obj && oldObj != obj ){ //&& obj._hoverable 已经 干掉了
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
                    this._setCursor(obj.context.cursor);
                }
            },
            _setCursor : function(cursor) {
                if(this._cursor == cursor){
                  //如果两次要设置的鼠标状态是一样的
                  return;
                };
                this.canvax.el.style.cursor = cursor;
                this._cursor = cursor;
            },
            /*
            * 原生事件系统------------------------------------------------end
            */

            /*
             *touch事件系统------------------------------------------------begin
             *触屏事件处理函数
             * */
            __TouchHandler : function( e ) {
                var me   = this;
                var root = me.canvax;
                root.updateRootOffset();
 
                // touch 下的 curPointsTarget 从touches中来
                //获取canvax坐标系统里面的坐标
                me.curPoints = me.__getCanvaxPointInTouchs( e );

                //drag开始
                if( e.type == me.drag.start){
                    //dragstart的时候touch已经准备好了target， curPointsTarget 里面只要有一个是有效的
                    //就认为drags开始
                    _.each( me.curPointsTarget , function( child , i ){
                        if( child && child.dragEnabled ){
                           //只要有一个元素就认为正在准备drag了
                           me._draging = true;
                           //然后克隆一个副本到activeStage
                           me._clone2hoverStage( child , i );
                           //先把本尊给隐藏了
                           child.context.globalAlpha = 0;

                           child.fire("dragstart" ,e);
 
                           return false;
                        }
                    } ) 
                }
 
                //dragIng
                if( e.type == me.drag.move){
                    if( me._draging ){
                        _.each( me.curPointsTarget , function( child , i ){
                            if( child && child.dragEnabled) {
                               me._dragHander( e , child , i);
                               child.fire("dragmove" ,e);
                            }
                        } )
                    }
                };
 
                //drag结束
                if( e.type == me.drag.end){
                    if( me._draging ){
                        _.each( me.curPointsTarget , function( child , i ){
                            if( child && child.dragEnabled) {
                                me._dragEnd( e , child , 0 );
                                child.fire("dragend" ,e);
                            }
                        } );
                        me._draging = false;
                    }
                };
                var childs = me.__getChildInTouchs( me.curPoints );
                if( me.__dispatchEventInChilds( e , childs ) ){
                    me.curPointsTarget = childs;
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
                _.each( e.pointers , function( touch ){
                   touch.x = touch.pageX - root.rootOffset.left , 
                   touch.y = touch.pageY - root.rootOffset.top
                   curTouchs.push( touch );
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
            *touch事件系统------------------------------------------------begin
            */




            /*
             *@param {array} childs 
             * */
            __dispatchEventInChilds: function(e, childs) {
                if (!childs && !("length" in childs)) {
                    return false;
                }
                var me = this;
                var hasChild = false;
                _.each(childs, function(child, i) {
                    if (child) {
                        hasChild = true;
                        var ce = new CanvaxEvent(e);
                        ce.target = ce.currentTarget = child || this;
                        ce.stagePoint = me.curPoints[i];
                        ce.point = ce.target.globalToLocal(ce.stagePoint);
                        child.dispatchEvent(ce);
                    }
                });
                return hasChild;
            },
            //克隆一个元素到hover stage中去
            _clone2hoverStage: function(target, i) {
                var me = this;
                var root = me.canvax;
                var _dragDuplicate = root._hoverStage.getChildById(target.id);
                if (!_dragDuplicate) {
                    _dragDuplicate = target.clone(true);
                    _dragDuplicate._transform = target.getConcatenatedMatrix();

                    /**
                     *TODO: 因为后续可能会有手动添加的 元素到_hoverStage 里面来
                     *比如tips
                     *这类手动添加进来的肯定是因为需要显示在最外层的。在hover元素之上。
                     *所有自动添加的hover元素都默认添加在_hoverStage的最底层
                     **/
                    root._hoverStage.addChildAt(_dragDuplicate, 0);
                }
                _dragDuplicate.context.globalAlpha = target._globalAlpha;
                _dragDuplicate._dragPoint = target.globalToLocal(me.curPoints[i]);
                return _dragDuplicate;
            },
            //drag 中 的处理函数
            _dragHander: function(e, target, i) {
                var me = this;
                var root = me.canvax;
                var _dragDuplicate = root._hoverStage.getChildById(target.id);
                var gPoint = new Point(me.curPoints[i].x - _dragDuplicate._dragPoint.x, me.curPoints[i].y - _dragDuplicate._dragPoint.y);
                _dragDuplicate.context.x = gPoint.x;
                _dragDuplicate.context.y = gPoint.y;
                target.drag && target.drag(e);

                //要对应的修改本尊的位置，但是要告诉引擎不要watch这个时候的变化
                var tPoint = gPoint;
                if (target.type != "stage" && target.parent && target.parent.type != "stage") {
                    tPoint = target.parent.globalToLocal(gPoint);
                }
                target._notWatch = true;
                target.context.x = tPoint.x;
                target.context.y = tPoint.y;
                target._notWatch = false;
                //同步完毕本尊的位置
            },
            //drag结束的处理函数
            _dragEnd: function(e, target, i) {
                var me = this;
                var root = me.canvax;

                //_dragDuplicate 复制在_hoverStage 中的副本
                var _dragDuplicate = root._hoverStage.getChildById(target.id);
                _dragDuplicate.destroy();

                target.context.globalAlpha = target._globalAlpha;
            }
        };
        return EventHandler;
    }
);