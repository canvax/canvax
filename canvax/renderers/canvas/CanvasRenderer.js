import SystemRenderer from '../SystemRenderer';
import { RENDERER_TYPE } from '../../const';

export default class CanvasRenderer extends SystemRenderer
{
    constructor(app)
    {
        super(RENDERER_TYPE.CANVAS, app);
    }
}

