import CanvasRenderer from './canvas/CanvasRenderer';
import AlipayMiniRenderer from './alipayMini/AlipayMiniRenderer';
//import WebGLRenderer from './webgl/WebGLRenderer';

export default function autoRenderer( app , opt)
{
    let _renderer;
    //opt.renderer 支持cavnas alipayMini webGl(暂时弃用)
    if( opt.renderer == 'alipayMini' ){
        _renderer = new AlipayMiniRenderer( app, opt );
    } else {
        _renderer = new CanvasRenderer( app , opt);
    }
	return _renderer;

	/*
    if (app.webGL && utils.isWebGLSupported())
    {
        return new WebGLRenderer( app , options);
    };
    return new CanvasRenderer( app , options);
    */
}
