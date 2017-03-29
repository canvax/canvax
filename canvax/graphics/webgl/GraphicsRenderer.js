import { hex2rgb } from '../../utils/color';
import { SHAPES } from '../../const';
import WebGLRenderer from '../../renderers/webgl/WebGLRenderer';
import WebGLGraphicsData from './WebGLGraphicsData';
import PrimitiveShader from './shaders/PrimitiveShader';

import buildPoly from './utils/buildPoly';
import buildRectangle from './utils/buildRectangle';
import buildCircle from './utils/buildCircle';


export default class GraphicsRenderer
{
    constructor(renderer)
    {
        this.renderer = renderer;
        this.graphicsDataPool = [];
        this.primitiveShader = null;
        this.gl = renderer.gl;
        this.CONTEXT_UID = 0;
    }

    onContextChange()
    {
        this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID;
        this.primitiveShader = new PrimitiveShader(this.gl);
    }

    destroy()
    {
        this.renderer = null;

        for (let i = 0; i < this.graphicsDataPool.length; ++i)
        {
            this.graphicsDataPool[i].destroy();
        }

        this.graphicsDataPool = null;
    }

    render( displayObject, stage )
    {
        const renderer = this.renderer;
        const gl = renderer.gl;
        const graphics = displayObject.graphics;

        let webGLData;
        let webGL = graphics._webGL[this.CONTEXT_UID];

        if (!webGL || graphics.dirty !== webGL.dirty)
        {
            this.updateGraphics(graphics);

            webGL = graphics._webGL[this.CONTEXT_UID];
        }

        const shader = this.primitiveShader;

        renderer.bindShader(shader);

        for (let i = 0, n = webGL.data.length; i < n; i++)
        {
            webGLData = webGL.data[i];
            const shaderTemp = webGLData.shader;

            renderer.bindShader(shaderTemp);

            shaderTemp.uniforms.translationMatrix = displayObject.worldTransform.toArray(true);
            shaderTemp.uniforms.tint = hex2rgb(graphics.tint);
            shaderTemp.uniforms.alpha = graphics.worldAlpha;

            renderer.bindVao(webGLData.vao);
            webGLData.vao.draw(gl.TRIANGLE_STRIP, webGLData.indices.length);
        }
    }

    updateGraphics(graphics)
    {
        const gl = this.renderer.gl;

        let webGL = graphics._webGL[this.CONTEXT_UID];

        if (!webGL)
        {
            webGL = graphics._webGL[this.CONTEXT_UID] = { lastIndex: 0, data: [], gl, clearDirty: -1, dirty: -1 };
        }

        webGL.dirty = graphics.dirty;

        if (graphics.clearDirty !== webGL.clearDirty)
        {
            webGL.clearDirty = graphics.clearDirty;

            for (let i = 0; i < webGL.data.length; i++)
            {
                this.graphicsDataPool.push(webGL.data[i]);
            }

            webGL.data.length = 0;
            webGL.lastIndex = 0;
        }

        let webGLData;

        for (let i = webGL.lastIndex; i < graphics.graphicsData.length; i++)
        {
            const data = graphics.graphicsData[i];

            webGLData = this.getWebGLData(webGL, 0);

            if (data.type === SHAPES.POLY)
            {
                buildPoly(data, webGLData);
            }
            if (data.type === SHAPES.RECT)
            {
                buildRectangle(data, webGLData);
            } 
            else if (data.type === SHAPES.CIRC || data.type === SHAPES.ELIP)
            {
                buildCircle(data, webGLData);
            }

            //这个对象隶属于那个displayObject，可以方便的从这个displayObject上面去获取世界矩阵和style等
            webGL.displayObject = data.displayObject;

            webGL.lastIndex++;
        }

        this.renderer.bindVao(null);

        for (let i = 0; i < webGL.data.length; i++)
        {
            webGLData = webGL.data[i];

            if (webGLData.dirty)
            {
                webGLData.upload();
            }
        }
    }

    getWebGLData(gl, type)
    {
        let webGLData = gl.data[gl.data.length - 1];

        if (!webGLData || webGLData.points.length > 320000)
        {
            webGLData = this.graphicsDataPool.pop()
                || new WebGLGraphicsData(this.renderer.gl, this.primitiveShader, this.renderer.state.attribsState);

            webGLData.reset(type);
            gl.data.push(webGLData);
        }

        webGLData.dirty = true;

        return webGLData;
    }
}