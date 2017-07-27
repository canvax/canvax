
const DEPTH_TEST = 1;
const FRONT_FACE = 2;
const CULL_FACE = 3;

export default class WebGLState
{
    constructor(gl)
    {

        this.activeState = new Uint8Array(16);

        this.defaultState = new Uint8Array(16);

        this.defaultState[0] = 1;

        this.stackIndex = 0;

        this.stack = [];

        this.gl = gl;

        this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

        this.attribState = {
            tempAttribState: new Array(this.maxAttribs),
            attribState: new Array(this.maxAttribs),
        };


        // check we have vao..
        this.nativeVaoExtension = (
            gl.getExtension('OES_vertex_array_object')
            || gl.getExtension('MOZ_OES_vertex_array_object')
            || gl.getExtension('WEBKIT_OES_vertex_array_object')
        );
    }

    push()
    {
        let state = this.stack[++this.stackIndex];

        if (!state)
        {
            state = this.stack[this.stackIndex] = new Uint8Array(16);
        }

        for (let i = 0; i < this.activeState.length; i++)
        {
            this.activeState[i] = state[i];
        }
    }

    pop()
    {
        const state = this.stack[--this.stackIndex];

        this.setState(state);
    }

    setState(state)
    {
        this.setDepthTest(state[DEPTH_TEST]);
        this.setFrontFace(state[FRONT_FACE]);
        this.setCullFace(state[CULL_FACE]);
    }

    setDepthTest(value)
    {
        value = value ? 1 : 0;

        if (this.activeState[DEPTH_TEST] === value)
        {
            return;
        }

        this.activeState[DEPTH_TEST] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
    }

    setCullFace(value)
    {
        value = value ? 1 : 0;

        if (this.activeState[CULL_FACE] === value)
        {
            return;
        }

        this.activeState[CULL_FACE] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.CULL_FACE);
    }

    setFrontFace(value)
    {
        value = value ? 1 : 0;

        if (this.activeState[FRONT_FACE] === value)
        {
            return;
        }

        this.activeState[FRONT_FACE] = value;
        this.gl.frontFace(this.gl[value ? 'CW' : 'CCW']);
    }

    resetAttributes()
    {
        for (let i = 0; i < this.attribState.tempAttribState.length; i++)
        {
            this.attribState.tempAttribState[i] = 0;
        }

        for (let i = 0; i < this.attribState.attribState.length; i++)
        {
            this.attribState.attribState[i] = 0;
        }

        for (let i = 1; i < this.maxAttribs; i++)
        {
            this.gl.disableVertexAttribArray(i);
        }
    }

    resetToDefault()
    {
        if (this.nativeVaoExtension)
        {
            this.nativeVaoExtension.bindVertexArrayOES(null);
        }

        this.resetAttributes();

        for (let i = 0; i < this.activeState.length; ++i)
        {
            this.activeState[i] = 32;
        }

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);

        this.setState(this.defaultState);
    }
}
