import { Rectangle } from '../../../math/index';
import Matrix from '../../../geom/Matrix'
import { SCALE_MODES } from '../../../const';
import settings from '../../../settings';
import glCore from 'pixi-gl-core';

const GLFramebuffer = glCore.GLFramebuffer;

export default class RenderTarget
{
    constructor(gl, width, height, resolution, root)
    {
        this.gl = gl;

        // framebuffer 是WebGL渲染的终点。当你看屏幕时，其他就是在看 framebuffer 中的内容。
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

        this.root = root;

        this.frameBuffer = new GLFramebuffer(gl, 100, 100);
        this.frameBuffer.framebuffer = null;
     
        this.setFrame();

        this.resize(width, height);
    }

    clear(clearColor)
    {
        const cc = clearColor || this.clearColor;

        this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]);// r,g,b,a);
    }

    setFrame(destinationFrame, sourceFrame)
    {
        this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
        this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
    }

    //在WebGLRenderer中被调用
    activate()
    {
        const gl = this.gl;

        this.frameBuffer.bind();

        this.calculateProjection(this.destinationFrame, this.sourceFrame);

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

        gl.viewport(
            this.destinationFrame.x | 0,
            this.destinationFrame.y | 0,
            (this.destinationFrame.width * this.resolution) | 0,
            (this.destinationFrame.height * this.resolution) | 0
        );
    }

    //计算投影矩阵，把所有的顶点数据投射到 webgl 的 [-1,1] 坐标系内来
    calculateProjection(destinationFrame, sourceFrame)
    {
        const pm = this.projectionMatrix;

        sourceFrame = sourceFrame || destinationFrame;

        pm.identity();

        pm.a = 1 / destinationFrame.width * 2;
        pm.d = -1 / destinationFrame.height * 2;

        pm.tx = -1 - (sourceFrame.x * pm.a);
        pm.ty = 1 - (sourceFrame.y * pm.d);
    }

    //stage 的 size发生变化，需要重新初始化这些对象的size，尤其是 projectionMatrix 投影举证
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

    destroy()
    {
        this.frameBuffer.destroy();
        this.frameBuffer = null;
    }
}
