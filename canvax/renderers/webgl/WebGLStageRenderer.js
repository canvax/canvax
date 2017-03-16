import RenderTarget from './utils/RenderTarget';
import ObjectRenderer from './utils/ObjectRenderer';
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
        * 处理上下文丢失和恢复
        * 你的WebGL程序必须有一个用于处理上下文丢失（Lost Context）的机制
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

 
        this._backgroundColor = 0x000000;
        this._backgroundColorRgba = [0, 0, 0, 0];
        this._backgroundColorString = '#000000';
        this.backgroundColor = options.backgroundColor || this._backgroundColor;

        this._contextOptions = {
            alpha: options.transparent,
            antialias: options.antialias,
            premultipliedAlpha: options.transparent && options.transparent !== 'notMultiplied',
            stencil: true,
            preserveDrawingBuffer: options.preserveDrawingBuffer,
        };

        this.emptyRenderer = new ObjectRenderer(this);

        this.currentRenderer = this.emptyRenderer;

        this.gl = options.context || glCore.createContext( this.canvas , this._contextOptions);

        this.CONTEXT_UID = CONTEXT_UID++;

        this.state = new WebGLState(this.gl);

        this.renderingToScreen = true;

        /**
         * Holds the current shader
         *
         * @member {PIXI.Shader}
         */
        this._activeShader = null;

        this._activeVao = null;

        /**
         * Holds the current render target
         *
         * @member {PIXI.RenderTarget}
         */
        this._activeRenderTarget = null;

        

        // map some webGL blend and drawmodes..
        this.drawModes = this.mapWebGLDrawModes();

        this.webglGR = new GraphicsRenderer(this);

        this._initContext();
    }

   
    /**
     * Creates the WebGL context
     *
     * @private
     */
    _initContext()
    {
        const gl = this.gl;

        // restore a context if it was previously lost
        if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context'))
        {
            gl.getExtension('WEBGL_lose_context').restoreContext();
        }

        this.state.resetToDefault();

        this.rootRenderTarget = new RenderTarget(gl, this.width, this.height, null, settings.RESOLUTION, true);
        this.rootRenderTarget.clearColor = this._backgroundColorRgba;

        this.bindRenderTarget(this.rootRenderTarget);

        this.webglGR.onContextChange();
    }


    render(displayObject)
    {
        // can be handy to know!
        this.renderingToScreen = true;

        if (!this.gl || this.gl.isContextLost())
        {
            return;
        }

        this.currentRenderer.start();

        this._activeRenderTarget.clear();        

        this.webglGR.render( displayObject );
        //displayObject.renderWebGL(this);

        // apply transform..
        this.currentRenderer.flush();
    }

    /**
     * Changes the current renderer to the one given in parameter
     *
     * @param {PIXI.ObjectRenderer} objectRenderer - The object renderer to use.
     */
    setObjectRenderer(objectRenderer)
    {
        if (this.currentRenderer === objectRenderer)
        {
            return;
        }

        this.currentRenderer.stop();
        this.currentRenderer = objectRenderer;
        this.currentRenderer.start();
    }

    /**
     * This should be called if you wish to do some custom rendering
     * It will basically render anything that may be batched up such as sprites
     *
     */
    flush()
    {
        this.setObjectRenderer(this.emptyRenderer);
    }

    /**
     * Resizes the webGL view to the specified width and height.
     *
     * @param {number} width - the new width of the webGL view
     * @param {number} height - the new height of the webGL view
     */
    resize(width, height)
    {
      //  if(width * this.resolution === this.width && height * this.resolution === this.height)return;

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


    /**
     * Erases the active render target and fills the drawing area with a colour
     *
     * @param {number} [clearColor] - The colour
     */
    clear(clearColor)
    {
        this._activeRenderTarget.clear(clearColor);
    }

    /**
     * Changes the current render target to the one given in parameter
     *
     * @param {PIXI.RenderTarget} renderTarget - the new render target
     * @return {PIXI.WebGLRenderer} Returns itself.
     */
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

    /**
     * Changes the current shader to the one given in parameter
     *
     * @param {PIXI.Shader} shader - the new shader
     * @return {PIXI.WebGLRenderer} Returns itself.
     */
    bindShader(shader)
    {
        // TODO cache
        if (this._activeShader !== shader)
        {
            this._activeShader = shader;
            shader.bind();
            // automatically set the projection matrix
            shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
        }

        return this;
    }

    /**
     * Creates a new VAO from this renderer's context and state.
     *
     * @return {VertexArrayObject} The new VAO.
     */
    createVao()
    {
        return new glCore.VertexArrayObject(this.gl, this.state.attribState);
    }

    /**
     * Changes the current Vao to the one given in parameter
     *
     * @param {PIXI.VertexArrayObject} vao - the new Vao
     * @return {PIXI.WebGLRenderer} Returns itself.
     */
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
            // TODO this should always be true i think?
            this._activeVao.unbind();
        }

        this._activeVao = vao;

        return this;
    }

    /**
     * Resets the WebGL state so you can render things however you fancy!
     *
     * @return {PIXI.WebGLRenderer} Returns itself.
     */
    reset()
    {
        this.setObjectRenderer(this.emptyRenderer);

        this._activeShader = null;
        this._activeRenderTarget = this.rootRenderTarget;

        // bind the main frame buffer (the screen);
        this.rootRenderTarget.activate();

        this.state.resetToDefault();

        return this;
    }

    /**
     * Handles a lost webgl context
     *
     * @private
     * @param {WebGLContextEvent} event - The context lost event.
     */
    handleContextLost(event)
    {
        event.preventDefault();
    }

    /**
     * Handles a restored webgl context
     *
     * @private
     */
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


    /**
     * Removes everything from the renderer (event listeners, spritebatch, etc...)
     *
     * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
     *  See: https://github.com/pixijs/pixi.js/issues/2233
     */
    destroy(removeView)
    {
        this.destroyPlugins();

        // remove listeners
        this.view.removeEventListener('webglcontextlost', this.handleContextLost);
        this.view.removeEventListener('webglcontextrestored', this.handleContextRestored);

        // call base destroy
        super.destroy(removeView);

        this.uid = 0;

        this.currentRenderer = null;

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