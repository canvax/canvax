import CanvasRenderer from "../canvas/CanvasRenderer"

export default class AlipayMiniRenderer extends CanvasRenderer
{
    constructor(app, options={})
    {
        super(app, options);
        this.renderType = 'alipayMini'
    }
}

