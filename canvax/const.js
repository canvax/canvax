
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
    RREC: 4,
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
    cursor        : "default",
    //canvas context 2d 的 系统样式。目前就知道这么多
    fillStyle     : null,//"#000000",
    lineCap       : null,
    lineJoin      : null,
    lineWidth     : null,
    miterLimit    : null,
    shadowBlur    : null,
    shadowColor   : null,
    shadowOffsetX : null,
    shadowOffsetY : null,
    strokeStyle   : null,
    globalAlpha   : 1,
    font          : null,
    textAlign     : "left",
    textBaseline  : "top", 
    arcScaleX_    : null,
    arcScaleY_    : null,
    lineScale_    : null,
    globalCompositeOperation : null
};


