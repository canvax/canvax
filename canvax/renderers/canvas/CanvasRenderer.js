import SystemRenderer from '../SystemRenderer';
import { pluginTarget } from '../../utils';
import { RENDERER_TYPE } from '../../const';

export default class CanvasRenderer extends SystemRenderer
{
    constructor(width, height, options = {})
    {
        super('Canvas', width, height, options);

        this.type = RENDERER_TYPE.CANVAS;

        this.rootContext = this.view.getContext('2d');

        this.initPlugins();

    }

    render(displayObject, transform)
    {
        if (!this.view){
            return;
        }


        displayObject.renderCanvas(this);

        this.resolution = rootResolution;

    }

    /**
     * Clear the canvas of renderer.
     *
     * @param {string} [clearColor] - Clear the canvas with this color, except the canvas is transparent.
     */
    clear(clearColor)
    {

    }

    destroy(removeView)
    {
        this.destroyPlugins();
        super.destroy(removeView);
        this.context = null;
    }

    resize(width, height)
    {

    }
}

pluginTarget.mixin(CanvasRenderer);
