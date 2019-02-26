/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 * 事件 destroy addToStage transformChange 
 * 模拟as3 DisplayList 的 现实对象基类
 */
import {_,event} from "mmvis";
import Matrix from "../geom/Matrix";
import Point from "./Point";
import Utils from "../utils/index";
import AnimationFrame from "../animation/AnimationFrame";
import Observe from "../utils/observe";
import {TRANSFORM_PROPS} from "../const";
import InsideLine from '../geom/InsideLine';
import Settings from '../settings';

export default class DisplayObject extends event.Dispatcher
{
    constructor( opt )
    {
        super( opt );
        //相对父级元素的矩阵
        this._transform      = null;
        this.worldTransform  = null;
        //_transform如果有修改，则_transformChange为true，renderer的时候worldTransform
        this._transformChange= false;

        //心跳次数
        this._heartBeatNum   = 0;

        //元素对应的stage元素
        this.stage           = null;

        //元素的父元素
        this.parent          = null;

        this.xyToInt         = "xyToInt" in opt ? opt.xyToInt : true;    //是否对xy坐标统一int处理，默认为true，但是有的时候可以由外界用户手动指定是否需要计算为int，因为有的时候不计算比较好，比如，进度图表中，再sector的两端添加两个圆来做圆角的进度条的时候，圆circle不做int计算，才能和sector更好的衔接

        this.moveing         = false; //如果元素在最轨道运动中的时候，最好把这个设置为true，这样能保证轨迹的丝搬顺滑，否则因为xyToInt的原因，会有跳跃

        this.clip            = null; //裁剪的图形对象

        //创建好context
        this.context         = this._createContext( opt );

        this.type            = opt.type || "DisplayObject";

        this.id              = opt.id || Utils.createId( this.type );

        this._trackList      = []; //一个元素可以追踪另外元素的变动

        this.init.apply(this , arguments);


        //所有属性准备好了后，先要计算一次this._updateTransform()得到_tansform
        this._updateTransform();

        this._tweens = [];
        var me = this;
        this.on("destroy" , function(){
            me.cleanAnimates();
        });
    }

    init()
    {

    }

    clipTo( node )
    {
        this.clip = node;
        node.isClip = true;
    }

    _createContext( opt )
    {
        var self = this;

        var optCtx = opt.context || {};

        var _contextATTRS = {
            width         : optCtx.width  || 0,
            height        : optCtx.height || 0,
            x             : optCtx.x      || 0,
            y             : optCtx.y      || 0,
            scaleX        : optCtx.scaleX || 1,
            scaleY        : optCtx.scaleY || 1,
            scaleOrigin   : optCtx.scaleOrigin || {
                x : 0,
                y : 0
            },
            rotation      : optCtx.rotation || 0,
            rotateOrigin  : optCtx.rotateOrigin || {
                x : 0,
                y : 0
            },
            visible       : optCtx.visible || true,
            globalAlpha   : optCtx.globalAlpha || 1

            //样式部分迁移到shape中
        }
        

        //平凡的clone数据非常的耗时，还是走回原来的路
        //var _contextATTRS = _.extend( true , _.clone(CONTEXT_DEFAULT), opt.context );

        _.extend( true , _contextATTRS, opt.context );

        //有些引擎内部设置context属性的时候是不用上报心跳的，比如做热点检测的时候
        self._notWatch = false;

        //不需要发心跳信息
        self._noHeart = false;

        //_contextATTRS.$owner = self;
        _contextATTRS.$watch = function(name , value , preValue){
            //下面的这些属性变化，都会需要重新组织矩阵属性 _transform 
            var obj = self;//this.$owner;

            if( !obj.context ){
                //如果这个obj的context已经不存在了，那么就什么都不处理，
                //TODO:后续还要把自己给destroy 并且要把在 动画队列里面的动画也干掉
                return;
            }

            if( name == "globalGalpha" ){
                obj._globalAlphaChange = true;
            };

            if( _.indexOf( TRANSFORM_PROPS , name ) > -1 ) {
                obj._updateTransform();
                obj._transformChange = true;
            };

            if( obj._notWatch ){
                return;
            };

            if( obj.$watch ){
                //执行的内部$watch的时候必须把_notWatch 设置为true，否则会死循环调用
                obj._notWatch = true;
                obj.$watch( name , value , preValue );
                obj._notWatch = false;
            };

            if( obj._noHeart ){
                return;
            };

            obj.heartBeat( {
                convertType:"context",
                shape      : obj,
                name       : name,
                value      : value,
                preValue   : preValue
            });
            
        };

        //执行init之前，应该就根据参数，把context组织好线
        return Observe( _contextATTRS );
    }


    //TODO:track目前还没测试过,需要的时候再测试
    track( el )
    {
        if( _.indexOf( this._trackList, el ) == -1 ){
            this._trackList.push( el );
        }
    }

    untrack( el ){
        var ind = _.indexOf( this._trackList, el );
        if( ind > -1 ){
            this._trackList.splice( ind , 1 );
        };
    }

    /* @myself 是否生成自己的镜像 
     * 克隆又两种，一种是镜像，另外一种是绝对意义上面的新个体
     * 默认为绝对意义上面的新个体，新对象id不能相同
     * 镜像基本上是框架内部在实现  镜像的id相同 主要用来把自己画到另外的stage里面，比如
     * mouseover和mouseout的时候调用*/
    clone( myself )
    {
        var conf   = {
            id      : this.id,
            context : _.clone(this.context.$model),
            isClone : true
        };

        var newObj;
        if( this.type == 'text' ){
            newObj = new this.constructor( this.text , conf );
        } else {
            newObj = new this.constructor( conf );
        }

        newObj.id = conf.id;

        if( this.children ){
            newObj.children = this.children;
        }

        if( this.graphics ){
            newObj.graphics = this.graphics.clone();
        }

        if (!myself){
            newObj.id = Utils.createId(newObj.type);
        };
        return newObj;
    }

    heartBeat(opt)
    {
        //stage存在，才说self代表的display已经被添加到了displayList中，绘图引擎需要知道其改变后
        //的属性，所以，通知到stage.displayAttrHasChange
        var stage = this.getStage();
        if( stage ){
            this._heartBeatNum ++;
            stage.heartBeat && stage.heartBeat( opt );
        }
    }

    getCurrentWidth()
    {
       return Math.abs(this.context.$model.width * this.context.$model.scaleX);
    }

    getCurrentHeight()
    {
       return Math.abs(this.context.$model.height * this.context.$model.scaleY);
    }

    getStage()
    {
        if( this.stage ) {
            return this.stage;
        };
        var p = this;
        if (p.type != "stage"){
          while(p.parent) {
            p = p.parent;
            if (p.type == "stage"){
              break;
            }
          };
          if (p.type !== "stage") {
            //如果得到的顶点display 的type不是Stage,也就是说不是stage元素
            //那么只能说明这个p所代表的顶端display 还没有添加到displayList中，也就是没有没添加到
            //stage舞台的childen队列中，不在引擎渲染范围内
            return false;
          }
        } 
        //一直回溯到顶层object， 即是stage， stage的parent为null
        this.stage = p;
        return p;
    }

    localToGlobal( point , container )
    {
        !point && ( point = new Point( 0 , 0 ) );
        var cm = this.getConcatenatedMatrix( container );

        if (cm == null) return Point( 0 , 0 );
        var m = new Matrix(1, 0, 0, 1, point.x , point.y);
        m.concat(cm);
        return new Point( m.tx , m.ty ); //{x:m.tx, y:m.ty};
    }

    globalToLocal( point , container) 
    {
        !point && ( point = new Point( 0 , 0 ) );

        if( this.type == "stage" ){
            return point;
        }
        var cm = this.getConcatenatedMatrix( container );

        if (cm == null) return new Point( 0 , 0 ); //{x:0, y:0};
        cm.invert();
        var m = new Matrix(1, 0, 0, 1, point.x , point.y);
        m.concat(cm);
        return new Point( m.tx , m.ty ); //{x:m.tx, y:m.ty};
    }

    localToTarget( point , target)
    {
        var p = localToGlobal( point );
        return target.globalToLocal( p );
    }

    getConcatenatedMatrix( container )
    {
        var cm = new Matrix();
        for (var o = this; o != null; o = o.parent) {
            cm.concat( o._transform );
            if( !o.parent || ( container && o.parent && o.parent == container ) || ( o.parent && o.parent.type=="stage" ) ) {
            //if( o.type == "stage" || (o.parent && container && o.parent.type == container.type ) ) {
                return cm;//break;
            }
        }
        return cm;
    }

    /*
     *设置元素的是否响应事件检测
     *@bool  Boolean 类型
     */
    setEventEnable( bool )
    {
        if(_.isBoolean(bool)){
            this._eventEnabled = bool
            return true;
        };
        return false;
    }

    /*
     *查询自己在parent的队列中的位置
     */
    getIndex()
    {
        if(!this.parent) {
          return;
        };
        return _.indexOf(this.parent.children , this)
    }


    /*
     *元素在z轴方向向下移动
     *@num 移动的层级
     */
    toBack( num )
    {
        if(!this.parent) {
          return;
        }
        var fromIndex = this.getIndex();
        var toIndex = 0;
        
        if(_.isNumber( num )){
          if( num == 0 ){
             //原地不动
             return;
          };
          toIndex = fromIndex - num;
        }
        var me = this.parent.children.splice( fromIndex , 1 )[0];
        if( toIndex < 0 ){
            toIndex = 0;
        };
        this.parent.addChildAt( me , toIndex );
    }

    /*
     *元素在z轴方向向上移动
     *@num 移动的层数量 默认到顶端
     */
    toFront( num )
    {
        if(!this.parent) {
          return;
        }
        var fromIndex = this.getIndex();
        var pcl = this.parent.children.length;
        var toIndex = pcl;
        
        if(_.isNumber( num )){
          if( num == 0 ){
             //原地不动
             return;
          }
          toIndex = fromIndex + num + 1;
        }
        var me = this.parent.children.splice( fromIndex , 1 )[0];
        if(toIndex > pcl){
            toIndex = pcl;
        }
        this.parent.addChildAt( me , toIndex-1 );
    }

    _updateTransform() 
    {
        var _transform = new Matrix();
        _transform.identity();
        var context = this.context;

        //是否需要scale
        if(context.scaleX !== 1 || context.scaleY !==1 ){
            //如果有缩放
            //缩放的原点坐标
            
            var origin = new Point(context.scaleOrigin);

            _transform.translate( -origin.x , -origin.y );
            _transform.scale( context.scaleX , context.scaleY );
            _transform.translate( origin.x , origin.y );
            
        };

        var rotation = context.rotation;
        if( rotation ){
            //如果有旋转
            //旋转的原点坐标
            var origin = new Point(context.rotateOrigin);
            
            _transform.translate( -origin.x , -origin.y );
            _transform.rotate( rotation % 360 * Math.PI/180 );
            _transform.translate( origin.x , origin.y );
            
        };

        //如果有位移
        var x,y;
        if( this.xyToInt && !this.moveing ){
            //当这个元素在做轨迹运动的时候，比如drag，animation如果实时的调整这个x ， y
            //那么该元素的轨迹会有跳跃的情况发生。所以加个条件过滤，
            var x = parseInt( context.x );
            var y = parseInt( context.y );

            if( parseInt(context.lineWidth , 10) % 2 == 1 && context.strokeStyle ){
                x += 0.5;
                y += 0.5;
            }
        } else {
            x = context.x;
            y = context.y;
        };
        if( x != 0 || y != 0 ){
            _transform.translate( x , y );
        };

        
        this._transform = _transform;
        return _transform;
    }

    //获取全局的世界坐标系内的矩阵
    //世界坐标是从上而下的，所以只要和parent的直接坐标相乘就好了
    setWorldTransform()
    {
       
        var cm = new Matrix();
        cm.concat( this._transform );
        this.parent && cm.concat( this.parent.worldTransform );

        this.worldTransform = cm;
        
        return this.worldTransform;
    }

    //显示对象的选取检测处理函数
    getChildInPoint( point )
    {

        var result = false; //检测的结果

        //第一步，吧glob的point转换到对应的obj的层级内的坐标系统
        //if( this.type != "stage" && this.parent && this.parent.type != "stage" ) {
        //    point = this.parent.globalToLocal( point );
        //};
        //var m = new Matrix( Settings.RESOLUTION, 0, 0, Settings.RESOLUTION, point.x , point.y);
        //m.concat( this.worldTransform );

        var x = point.x;
        var y = point.y;
    
        //对鼠标的坐标也做相同的变换
        if( this.worldTransform ){
            
            var inverseMatrix = this.worldTransform.clone().invert();
            var originPos = [
                x * Settings.RESOLUTION,
                y * Settings.RESOLUTION
            ];

            originPos = inverseMatrix.mulVector( originPos );

            x = originPos[0];
            y = originPos[1];
        };

        if( this.graphics ){
            result = this.containsPoint( {x: x , y: y} );
        };

        if( this.type == "text" ){
            //文本框的先单独处理
            var _rect = this.getRect();
            if(!_rect.width || !_rect.height) {
                return false;
            };
            //正式开始第一步的矩形范围判断
            if ( x    >= _rect.x
                &&  x <= (_rect.x + _rect.width)
                &&  (
                    (_rect.height>= 0 && y >= _rect.y && y <= (_rect.y + _rect.height) ) ||
                    (_rect.height < 0 && y <= _rect.y && y >= (_rect.y + _rect.height) )
                    )
            ) {
                //那么就在这个元素的矩形范围内
                result = true;
            } else {
                //如果连矩形内都不是，那么肯定的，这个不是我们要找的shap
                result = false;
            };
            return result;
        };

        return result;
    }

    containsPoint(point)
    {
        let inside = false;
        for (let i = 0; i < this.graphics.graphicsData.length; ++i)
        {
            const data = this.graphics.graphicsData[i];
            if (data.shape)
            {
                //先检测fill， fill的检测概率大些。
                //像circle,ellipse这样的shape 就直接把lineWidth算在fill里面计算就好了，所以他们是没有insideLine的
                if ( data.hasFill() && data.shape.contains(point.x, point.y) )
                {
                    inside = true;
                    if( inside ){
                        break;
                    }
                }

                //circle,ellipse等就没有points
                if( data.hasLine() && data.shape.points )
                {
                    //然后检测是否和描边碰撞
                    inside = InsideLine( data , point.x , point.y );
                    if( inside ){
                        break;
                    }
                }
            }   
        }
        return inside;
    }

    /*
    * animate
    * @param toContent 要动画变形到的属性集合
    * @param options tween 动画参数
    */
    animate( toContent , options , context )
    {

        if( !context ){
            context = this.context;
        };
        if( !context ){
            //这个时候如果还是找不到context说明这个 el 已经被destroy了
            return;
        };

        var to = toContent;
        var from = null;
        for( var p in to ){
            if( _.isObject( to[p] ) ){

                //options必须传递一份copy出去，比如到下一个animate
                this.animate( to[p], _.extend({} , options), context[p] );
                //如果是个object
                continue;
            };
            //if( isNaN(to[p]) && to[p] !== '' && to[p] !== null && to[p] !== undefined ){
            if( isNaN(to[p]) && to[p] !== '' && to[p] !== null ){
                //undefined已经被isNaN过滤了
                //只有number才能继续走下去执行tween，而非number则直接赋值完事，
                //TODO:不能用_.isNumber 因为 '1212' 这样的其实可以计算
                context[ p ] = to[ p ];
                delete to[p];
                continue;
            };
            if( !from ){
                from = {};
            };
            from[ p ] = context[p];
        };

        if( !from ){
            //这里很重要，不能删除。 
            //比如line.animate({start:{x:0,y:0}} , {duration:500});
            //那么递归到start的时候  from 的值依然为null
            //如果这个时候继续执行的话，会有很严重的bug
            //line.context.start 会 被赋值了 line对象上的所有属性，严重的bug
            return;
        };

        !options && (options = {});
        options.from = from;
        options.to = to;

        var self = this;
        var upFun = function(){};
        if( options.onUpdate ){
            upFun = options.onUpdate;
        };
        var tween;
        options.onUpdate = function( status ){
            //如果context不存在说明该obj已经被destroy了，那么要把他的tween给destroy
            if (!context && tween) {
                AnimationFrame.destroyTween(tween);
                tween = null;
                return;
            };
            for( var p in status ){
                context[p] = status[p];
            };
            upFun.apply(self , [ status ]);
        };

        var compFun = function(){};
        if( options.onComplete ){
            compFun = options.onComplete;
        };
        options.onComplete = function( status ){
            compFun.apply(self , arguments);
            self._removeTween( tween );
        };
        options.onStop = function(){
            self._removeTween( tween );
        };
        options.desc = "tweenType:DisplayObject.animate__id:"+this.id+"__objectType:"+this.type;
        tween = AnimationFrame.registTween( options );
        this._tweens.push( tween );
        return tween;
    }

    _removeTween( tween ){
        for( var i=0; i<this._tweens.length; i++ ){
            if( tween == this._tweens[i] ){
                this._tweens.splice( i , 1 );
                break;
            }
        }
    }

    removeAnimate( animate ){
        animate.stop();
        this._removeTween( animate );
    }

    //清楚所有的动画
    cleanAnimates(){
        this._cleanAnimates();
    }

    //清楚所有的动画
    _cleanAnimates(){
        while( this._tweens.length ){
            this._tweens.shift().stop();
        };
    }

    //从树中删除
    remove()
    {
        if( this.parent ){
            this.parent.removeChild(this);
            this.parent = null;
        }
    }

    destroy()
    {
        this._destroy();
    }

    //元素的自我销毁
    _destroy()
    {
        this.remove();
        this.fire("destroy");
        //把自己从父节点中删除了后做自我清除，释放内存
        this.context = null;
        delete this.context;
    }
}