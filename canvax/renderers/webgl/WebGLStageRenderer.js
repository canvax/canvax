import RenderTarget from './utils/RenderTarget';
import WebGLState from './WebGLState';
import glCore from 'pixi-gl-core';
import { RENDERER_TYPE , DRAW_MODES} from '../../const';
import settings from '../../settings';
import GraphicsRenderer from '../../graphics/webgl/GraphicsRenderer';

let CONTEXT_UID = 0;

export default class WebGLStageRenderer
{
    constructor( stage , app , options = {} )
    {
        this.type = RENDERER_TYPE.WEBGL;
        this.width = app.width;
        this.height = app.height;
        this.canvas = stage.canvas;
        
        /*
        * WebGL程序必须有一个用于处理上下文丢失（Lost Context）的机制
        * 导致上下文丢失的原因：
        * 移动设备电力不足
        * 其他外因导致GPU重置
        * 当浏览器标签页处于后台时，浏览器抛弃了上下文
        * 耗费资源过多，浏览器抛弃了上下文
        */
        this.handleContextLost = this.handleContextLost.bind(this);
        this.handleContextRestored = this.handleContextRestored.bind(this);
        this.canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
        this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);

        this._backgroundColorRgba = [0, 0, 0, 0];

        this._contextOptions = {
            alpha: options.transparent,
            antialias: options.antialias,
            premultipliedAlpha: options.transparent && options.transparent !== 'notMultiplied',
            stencil: true,
            preserveDrawingBuffer: options.preserveDrawingBuffer,
        };

        this.gl = options.context || glCore.createContext( this.canvas , this._contextOptions);

        this.CONTEXT_UID = CONTEXT_UID++;

        this.state = new WebGLState(this.gl);

        this._activeShader = null;

        this._activeVao = null;


        this._activeRenderTarget = null;

        this.drawModes = this.mapWebGLDrawModes();

        this.webglGR = new GraphicsRenderer(this);

        this._initContext();
    }

    _initContext()
    {
        const gl = this.gl;

        // restore a context if it was previously lost
        if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context'))
        {
            gl.getExtension('WEBGL_lose_context').restoreContext();
        }

        this.state.resetToDefault();

        this.rootRenderTarget = new RenderTarget(gl, this.width, this.height, settings.RESOLUTION, true);
        this.rootRenderTarget.clearColor = this._backgroundColorRgba;

        this.bindRenderTarget(this.rootRenderTarget);

        this.webglGR.onContextChange();
    }

    render( stage , graphics )
    {
        if (!this.gl || this.gl.isContextLost())
        {
            return;
        }
        this.webglGR.render( stage , graphics );
    }

    resize(width, height)
    {
        this.rootRenderTarget.resize(width, height);
        if (this._activeRenderTarget === this.rootRenderTarget)
        {
            this.rootRenderTarget.activate();

            if (this._activeShader)
            {
                this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(true);
            }
        }
    }

    clear(clearColor)
    {
        this._activeRenderTarget.clear(clearColor);
    }

    bindRenderTarget(renderTarget)
    {
        if (renderTarget !== this._activeRenderTarget)
        {
            this._activeRenderTarget = renderTarget;
            renderTarget.activate();

            if (this._activeShader)
            {
                this._activeShader.uniforms.projectionMatrix = renderTarget.projectionMatrix.toArray(true);
            }
        }
        return this;
    }


    bindShader(shader)
    {
        if (this._activeShader !== shader)
        {
            this._activeShader = shader;
            shader.bind();
            shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
        }

        return this;
    }

    createVao()
    {
        return new glCore.VertexArrayObject(this.gl, this.state.attribState);
    }

    bindVao(vao)
    {
        if (this._activeVao === vao)
        {
            return this;
        }

        if (vao)
        {
            vao.bind();
        }
        else if (this._activeVao)
        {
            this._activeVao.unbind();
        }

        this._activeVao = vao;

        return this;
    }

    reset()
    {
        this._activeShader = null;
        this._activeRenderTarget = this.rootRenderTarget;

        this.rootRenderTarget.activate();

        this.state.resetToDefault();

        return this;
    }

    handleContextLost(event)
    {
        event.preventDefault();
    }

    handleContextRestored()
    {
        this._initContext();
        this.textureManager.removeAll();
    }

    mapWebGLDrawModes( object={} )
    {
        object[DRAW_MODES.POINTS] = this.gl.POINTS;
        object[DRAW_MODES.LINES] = this.gl.LINES;
        object[DRAW_MODES.LINE_LOOP] = this.gl.LINE_LOOP;
        object[DRAW_MODES.LINE_STRIP] = this.gl.LINE_STRIP;
        object[DRAW_MODES.TRIANGLES] = this.gl.TRIANGLES;
        object[DRAW_MODES.TRIANGLE_STRIP] = this.gl.TRIANGLE_STRIP;
        object[DRAW_MODES.TRIANGLE_FAN] = this.gl.TRIANGLE_FAN;

        return object;
    }

    destroy(removeView)
    {
        this.destroyPlugins();

        this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);
        this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);

        super.destroy(removeView);

        this.uid = 0;

        this.handleContextLost = null;
        this.handleContextRestored = null;

        this._contextOptions = null;
        this.gl.useProgram(null);

        if (this.gl.getExtension('WEBGL_lose_context'))
        {
            this.gl.getExtension('WEBGL_lose_context').loseContext();
        }

        this.gl = null;
    }
}