import utils from '../utils/index';
import CanvasRenderer from './canvas/CanvasRenderer';
//import WebGLRenderer from './webgl/WebGLRenderer';

export default function autoRenderer( app , options)
{
	return new CanvasRenderer( app , options);
	/*
    if (app.webGL && utils.isWebGLSupported())
    {
        return new WebGLRenderer( app , options);
    };
    return new CanvasRenderer( app , options);
    */
}
