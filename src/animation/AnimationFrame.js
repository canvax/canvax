import Tween from "@tweenjs/tween.js";
//import Tween from "./Tween"
import Utils from "../utils/index";
import _ from "../utils/underscore";

/**
 * 设置 AnimationFrame begin
 */


let lastTime = 0;
let _globalAnimationEnabled=true;
let requestAnimationFrame,cancelAnimationFrame;

if( typeof (window) !== 'undefined' ){
    requestAnimationFrame = window.requestAnimationFrame;
    cancelAnimationFrame  = window.cancelAnimationFrame;
    let vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        requestAnimationFrame = window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        cancelAnimationFrame = window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    };
};

if (!requestAnimationFrame) {
    requestAnimationFrame = function(callback, element) {
        let currTime = new Date().getTime();
        let timeToCall = Math.max(0, 16 - (currTime - lastTime));
        let id = setTimeout(function() {
                callback(currTime + timeToCall);
            },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
};
if (!cancelAnimationFrame) {
    cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
};

//管理所有图表的渲染任务
let _taskList = []; //[{ id : task: }...]
let _requestAid = null;

function enabledAnimationFrame(){
    if (!_requestAid) {
        _requestAid = requestAnimationFrame(function() {
            //console.log("frame__" + _taskList.length);
            //if ( Tween.getAll().length ) {
            Tween.update(); //tween自己会做length判断
            //};
            let currTaskList = _taskList;
            _taskList = [];
            _requestAid = null;
            while (currTaskList.length > 0) {
                currTaskList.shift().task();
            };
        });
    };
    return _requestAid;
}; 

/*
 * @param task 要加入到渲染帧队列中的任务
 * @result frameid
 */
function registFrame( $frame ) {
    if (!$frame) {
        return;
    };
    _taskList.push($frame);
    return enabledAnimationFrame();
};

/*
 *  @param task 要从渲染帧队列中删除的任务
 */
function destroyFrame( $frame ) {
    let d_result = false;
    for (let i = 0, l = _taskList.length; i < l; i++) {
        if (_taskList[i].id === $frame.id) {
            d_result = true;
            _taskList.splice(i, 1);
            i--;
            l--;
        };
    };
    if (_taskList.length == 0) {
        cancelAnimationFrame(_requestAid);
        _requestAid = null;
    };
    return d_result;
};


/* 
 * @param opt {from , to , onUpdate , onComplete , ......}
 * @result tween
 */
function registTween(options) {
    
    let opt = _.extend({
        from: null,
        to: null,
        duration: 500,
        onStart: function(){},
        onUpdate: function() {},
        onComplete: function() {},
        onStop: function(){},
        repeat: 0,
        delay: 0,
        easing: 'Linear.None',
        desc: '' //动画描述，方便查找bug
    }, options);

    if( !getAnimationEnabled() ){
        //如果全局动画被禁用，那么下面两项强制设置为0
        //TODO:其实应该直接执行回调函数的
        opt.duration = 0;
        opt.delay = 0;
    };

    let tween = {};
    let tid = "tween_" + Utils.getUID();
    opt.id && ( tid = tid+"_"+opt.id );

    if (opt.from && opt.to) {
        tween = new Tween.Tween( opt.from )
        .to( opt.to, opt.duration )
        .onStart(function(){
            //opt.onStart.apply( this )
            opt.onStart( opt.from );
        })
        .onUpdate( function(){
            //opt.onUpdate.apply( this );
            opt.onUpdate( opt.from );
        } )
        .onComplete( function() {
            destroyFrame({
                id: tid
            });
            tween._isCompleteed = true;
            //opt.onComplete.apply( this , [this] ); //执行用户的conComplete
            opt.onComplete( opt.from );
        } )
        .onStop( function(){
            destroyFrame({
                id: tid
            });
            tween._isStoped = true;
            //opt.onStop.apply( this , [this] );
            opt.onStop( opt.from );
        } )
        .repeat( opt.repeat )
        .delay( opt.delay )
        .easing( Tween.Easing[opt.easing.split(".")[0]][opt.easing.split(".")[1]] )
        
        tween.id = tid;
        tween.start();

        function animate() {
            if ( tween._isCompleteed || tween._isStoped ) {
                tween = null;
                return;
            };
            registFrame({
                id: tid,
                task: animate,
                desc: opt.desc,
                tween: tween
            });
        };
        animate();
    };
    return tween;
};
/*
 * @param tween
 * @result void(0)
 */
function destroyTween(tween , msg) {
    tween.stop();
};

function setAnimationEnabled( bool ){
    _globalAnimationEnabled = bool
}

function getAnimationEnabled(){
    return _globalAnimationEnabled;
}

export default {
    setAnimationEnabled,getAnimationEnabled,
    registFrame,
    destroyFrame,
    registTween,
    destroyTween,
    Tween,
    taskList: _taskList
};