import { Rectangle } from '../../../math/index';
import Matrix from '../../../geom/Matrix'
import { SCALE_MODES } from '../../../const';
import settings from '../../../settings';
import glCore from 'pixi-gl-core';

const GLFramebuffer = glCore.GLFramebuffer;

export default class RenderTarget
{

    constructor(gl, width, height, scaleMode, resolution, root)
    {

        this.gl = gl;

        //framebuffer是WebGL渲染的终点。当你看屏幕时，其他就是在看framebuffer中的内容。
        this.frameBuffer = null;

        this.clearColor = [0, 0, 0, 0];

        this.size = new Rectangle(0, 0, 1, 1);

        /**
         * 设备分辨率
         */
        this.resolution = resolution || settings.RESOLUTION;

        //投影矩阵，把所有的顶点投射到webgl的[-1,1]的坐标系内
        this.projectionMatrix = new Matrix();

        this.frame = null;

        this.defaultFrame = new Rectangle();
        this.destinationFrame = null;
        this.sourceFrame = null;

debugger
        /**
         * The scale mode.
         *
         * @member {number}
         * @default PIXI.settings.SCALE_MODE
         * @see PIXI.SCALE_MODES
         */
        this.scaleMode = scaleMode || settings.SCALE_MODE;

        /**
         * Whether this object is the root element or not
         *
         * @member {boolean}
         */
        this.root = root;

        if (!this.root)
        {
            this.frameBuffer = GLFramebuffer.createRGBA(gl, 100, 100);

            if (this.scaleMode === SCALE_MODES.NEAREST)
            {
                this.frameBuffer.texture.enableNearestScaling();
            }
            else
            {
                this.frameBuffer.texture.enableLinearScaling();
            }

        }
        else
        {
            // make it a null framebuffer..
            this.frameBuffer = new GLFramebuffer(gl, 100, 100);
            this.frameBuffer.framebuffer = null;
        }

        this.setFrame();

        this.resize(width, height);
    }

    /**
     * Clears the filter texture.
     *
     * @param {number[]} [clearColor=this.clearColor] - Array of [r,g,b,a] to clear the framebuffer
     */
    clear(clearColor)
    {
        const cc = clearColor || this.clearColor;

        this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]);// r,g,b,a);
    }

    /**
     * Binds the stencil buffer.
     *
     */
    attachStencilBuffer()
    {
        // TODO check if stencil is done?
        /**
         * The stencil buffer is used for masking in pixi
         * lets create one and then add attach it to the framebuffer..
         */
        if (!this.root)
        {
            this.frameBuffer.enableStencil();
        }
    }

    /**
     * Sets the frame of the render target.
     *
     * @param {Rectangle} destinationFrame - The destination frame.
     * @param {Rectangle} sourceFrame - The source frame.
     */
    setFrame(destinationFrame, sourceFrame)
    {
        this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
        this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
    }

    /**
     * Binds the buffers and initialises the viewport.
     *
     */
    activate()
    {
        // TOOD refactor usage of frame..
        const gl = this.gl;

        // make sure the texture is unbound!
        this.frameBuffer.bind();

        this.calculateProjection(this.destinationFrame, this.sourceFrame);

        // TODO add a check as them may be the same!
        if (this.destinationFrame !== this.sourceFrame)
        {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(
                this.destinationFrame.x | 0,
                this.destinationFrame.y | 0,
                (this.destinationFrame.width * this.resolution) | 0,
                (this.destinationFrame.height * this.resolution) | 0
            );
        }
        else
        {
            gl.disable(gl.SCISSOR_TEST);
        }

        // TODO - does not need to be updated all the time??
        gl.viewport(
            this.destinationFrame.x | 0,
            this.destinationFrame.y | 0,
            (this.destinationFrame.width * this.resolution) | 0,
            (this.destinationFrame.height * this.resolution) | 0
        );
    }

    /**
     * Updates the projection matrix based on a projection frame (which is a rectangle)
     *
     * @param {Rectangle} destinationFrame - The destination frame.
     * @param {Rectangle} sourceFrame - The source frame.
     */
    calculateProjection(destinationFrame, sourceFrame)
    {
        const pm = this.projectionMatrix;

        sourceFrame = sourceFrame || destinationFrame;

        pm.identity();

        // TODO: make dest scale source
        if (!this.root)
        {
            pm.a = 1 / destinationFrame.width * 2;
            pm.d = 1 / destinationFrame.height * 2;

            pm.tx = -1 - (sourceFrame.x * pm.a);
            pm.ty = -1 - (sourceFrame.y * pm.d);
        }
        else
        {
            pm.a = 1 / destinationFrame.width * 2;
            pm.d = -1 / destinationFrame.height * 2;

            pm.tx = -1 - (sourceFrame.x * pm.a);
            pm.ty = 1 - (sourceFrame.y * pm.d);
        }
    }

    /**
     * Resizes the texture to the specified width and height
     *
     * @param {number} width - the new width of the texture
     * @param {number} height - the new height of the texture
     */
    resize(width, height)
    {
        width = width | 0;
        height = height | 0;

        if (this.size.width === width && this.size.height === height)
        {
            return;
        }

        this.size.width = width;
        this.size.height = height;

        this.defaultFrame.width = width;
        this.defaultFrame.height = height;

        this.frameBuffer.resize(width * this.resolution, height * this.resolution);

        const projectionFrame = this.frame || this.size;

        this.calculateProjection(projectionFrame);
    }

    /**
     * Destroys the render target.
     *
     */
    destroy()
    {
        this.frameBuffer.destroy();
        this.frameBuffer = null;
    }
}
