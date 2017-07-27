import glCore from 'pixi-gl-core';

export default class WebGLGraphicsData
{
    constructor(gl, shader, attribsState)
    {
        this.gl = gl;

        this.color = [0, 0, 0]; // color split!


        this.points = [];

        /**
         * The indices of the vertices
         * @member {number[]}
         */
        this.indices = [];
        /**
         * The main buffer
         * @member {WebGLBuffer}
         */
        this.buffer = glCore.GLBuffer.createVertexBuffer(gl);

        /**
         * The index buffer
         * @member {WebGLBuffer}
         */
        this.indexBuffer = glCore.GLBuffer.createIndexBuffer(gl);

        /**
         * Whether this graphics is dirty or not
         * @member {boolean}
         */
        this.dirty = true;

        this.glPoints = null;
        this.glIndices = null;

        /**
         *
         * @member {PIXI.Shader}
         */
        this.shader = shader;

        this.vao = new glCore.VertexArrayObject(gl, attribsState)
        .addIndex(this.indexBuffer)
        .addAttribute(this.buffer, shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 6, 0)
        .addAttribute(this.buffer, shader.attributes.aColor, gl.FLOAT, false, 4 * 6, 2 * 4);
    }

    /**
     * Resets the vertices and the indices
     */
    reset()
    {
        this.points.length = 0;
        this.indices.length = 0;
    }

    /**
     * Binds the buffers and uploads the data
     */
    upload()
    {
        this.glPoints = new Float32Array(this.points);
        this.buffer.upload(this.glPoints);

        this.glIndices = new Uint16Array(this.indices);
        this.indexBuffer.upload(this.glIndices);

        this.dirty = false;
    }

    /**
     * Empties all the data
     */
    destroy()
    {
        this.color = null;
        this.points = null;
        this.indices = null;

        this.vao.destroy();
        this.buffer.destroy();
        this.indexBuffer.destroy();

        this.gl = null;

        this.buffer = null;
        this.indexBuffer = null;

        this.glPoints = null;
        this.glIndices = null;
    }
}
