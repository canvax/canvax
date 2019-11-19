"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.undefined = mod.exports;
  }
})(void 0, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var DEPTH_TEST = 1;
  var FRONT_FACE = 2;
  var CULL_FACE = 3;

  var WebGLState = function () {
    function WebGLState(gl) {
      _classCallCheck(this, WebGLState);

      this.activeState = new Uint8Array(16);
      this.defaultState = new Uint8Array(16);
      this.defaultState[0] = 1;
      this.stackIndex = 0;
      this.stack = [];
      this.gl = gl;
      this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
      this.attribState = {
        tempAttribState: new Array(this.maxAttribs),
        attribState: new Array(this.maxAttribs)
      }; // check we have vao..

      this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') || gl.getExtension('MOZ_OES_vertex_array_object') || gl.getExtension('WEBKIT_OES_vertex_array_object');
    }

    _createClass(WebGLState, [{
      key: "push",
      value: function push() {
        var state = this.stack[++this.stackIndex];

        if (!state) {
          state = this.stack[this.stackIndex] = new Uint8Array(16);
        }

        for (var i = 0; i < this.activeState.length; i++) {
          this.activeState[i] = state[i];
        }
      }
    }, {
      key: "pop",
      value: function pop() {
        var state = this.stack[--this.stackIndex];
        this.setState(state);
      }
    }, {
      key: "setState",
      value: function setState(state) {
        this.setDepthTest(state[DEPTH_TEST]);
        this.setFrontFace(state[FRONT_FACE]);
        this.setCullFace(state[CULL_FACE]);
      }
    }, {
      key: "setDepthTest",
      value: function setDepthTest(value) {
        value = value ? 1 : 0;

        if (this.activeState[DEPTH_TEST] === value) {
          return;
        }

        this.activeState[DEPTH_TEST] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
      }
    }, {
      key: "setCullFace",
      value: function setCullFace(value) {
        value = value ? 1 : 0;

        if (this.activeState[CULL_FACE] === value) {
          return;
        }

        this.activeState[CULL_FACE] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.CULL_FACE);
      }
    }, {
      key: "setFrontFace",
      value: function setFrontFace(value) {
        value = value ? 1 : 0;

        if (this.activeState[FRONT_FACE] === value) {
          return;
        }

        this.activeState[FRONT_FACE] = value;
        this.gl.frontFace(this.gl[value ? 'CW' : 'CCW']);
      }
    }, {
      key: "resetAttributes",
      value: function resetAttributes() {
        for (var i = 0; i < this.attribState.tempAttribState.length; i++) {
          this.attribState.tempAttribState[i] = 0;
        }

        for (var _i = 0; _i < this.attribState.attribState.length; _i++) {
          this.attribState.attribState[_i] = 0;
        }

        for (var _i2 = 1; _i2 < this.maxAttribs; _i2++) {
          this.gl.disableVertexAttribArray(_i2);
        }
      }
    }, {
      key: "resetToDefault",
      value: function resetToDefault() {
        if (this.nativeVaoExtension) {
          this.nativeVaoExtension.bindVertexArrayOES(null);
        }

        this.resetAttributes();

        for (var i = 0; i < this.activeState.length; ++i) {
          this.activeState[i] = 32;
        }

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.setState(this.defaultState);
      }
    }]);

    return WebGLState;
  }();

  exports.default = WebGLState;
});