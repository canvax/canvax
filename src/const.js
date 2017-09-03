
export const VERSION = __VERSION__;

export const PI_2 = Math.PI * 2;

export const RAD_TO_DEG = 180 / Math.PI;

export const DEG_TO_RAD = Math.PI / 180;

export const RENDERER_TYPE = {
    UNKNOWN:    0,
    WEBGL:      1,
    CANVAS:     2,
};

export const DRAW_MODES = {
    POINTS:         0,
    LINES:          1,
    LINE_LOOP:      2,
    LINE_STRIP:     3,
    TRIANGLES:      4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN:   6,
};

export const SHAPES = {
    POLY: 0,
    RECT: 1,
    CIRC: 2,
    ELIP: 3,
};

export const SCALE_MODES = {
    LINEAR:     0,
    NEAREST:    1,
};

export const CONTEXT_DEFAULT = {
    width         : 0,
    height        : 0,
    x             : 0,
    y             : 0,
    scaleX        : 1,
    scaleY        : 1,
    scaleOrigin   : {
        x : 0,
        y : 0
    },
    rotation      : 0,
    rotateOrigin  :  {
        x : 0,
        y : 0
    },
    visible       : true,
    globalAlpha   : 1,

    //shape 才需要用到， 已经迁移到shape中去了，这里先注释掉
    /*
    cursor        : "default",

    fillAlpha     : 1,//context2d里没有，自定义
    fillStyle     : null,//"#000000",

    lineCap       : null,//默认都是直角
    lineJoin      : null,//这两个目前webgl里面没实现
    miterLimit    : null,//miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

    lineAlpha     : 1,//context2d里没有，自定义
    strokeStyle   : null,
    lineType      : "solid", //context2d里没有，自定义线条的type，默认为实线
    lineWidth     : null,
    */
    
    
    //没用到的暂时不用
    //shadowBlur    : null,
    //shadowColor   : null,
    //shadowOffsetX : null,
    //shadowOffsetY : null,
    
    //font          : null,
    //textAlign     : "left",
    //textBaseline  : "top", 
    //arcScaleX_    : null,
    //arcScaleY_    : null,
    //lineScale_    : null,
    
    //globalCompositeOperation : null

};
export const SHAPE_CONTEXT_DEFAULT = {
    cursor        : "default",

    fillAlpha     : 1,//context2d里没有，自定义
    fillStyle     : null,//"#000000",

    lineCap       : null,//默认都是直角
    lineJoin      : null,//这两个目前webgl里面没实现
    miterLimit    : null,//miterLimit 属性设置或返回最大斜接长度,只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

    lineAlpha     : 1,//context2d里没有，自定义
    strokeStyle   : null,
    lineType      : "solid", //context2d里没有，自定义线条的type，默认为实线
    lineWidth     : null
}

//会影响到transform改变的context属性
export const TRANSFORM_PROPS = [ 
    "x", 
    "y", 
    "scaleX", 
    "scaleY", 
    "rotation", 
    "scaleOrigin", 
    "rotateOrigin" 
]

//所有和样式相关的属性
//appha 有 自己的 处理方式
export const STYLE_PROPS = [
    "lineWidth",
    "lineAlpha",
    "strokeStyle",
    "fillStyle",
    "fillAlpha",
    "globalAlpha"
]




