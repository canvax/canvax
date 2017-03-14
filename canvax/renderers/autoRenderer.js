import * as utils from './utils';
import CanvasRenderer from './canvas/CanvasRenderer';
import WebGLRenderer from './webgl/WebGLRenderer';

export function autoRenderer( app )
{
    if (!app.noWebGL && utils.isWebGLSupported())
    {
        return new WebGLRenderer( app );
    }

    return new CanvasRenderer( app );
}
