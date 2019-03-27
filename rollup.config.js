
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');

// output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
// amd – 使用像requirejs一样的银木块定义
// cjs – CommonJS，适用于node和browserify / Webpack
// es6 (default) – 保持ES6的格式
// iife – 使用于<script> 标签引用的方式
// umd – 适用于CommonJs和AMD风格通用模式

export default {
    input : 'src/index.js',
    output: [{
        file : "dist/index.js",
        name : "canvax",
        format: "iife"
    }
    /*
    ,{
        file : "dist/cjs.js",
        name : "canvax",
        format: "cjs"
    },{
        file : "dist/amd.js",
        name : "canvax",
        format: "amd"
    },{
        file : "dist/es.js",
        name : "canvax",
        format: "es"
    },{
        file : "dist/umd.js",
        name : "canvax",
        format: "umd"
    }
    */
    
    ],
    plugins: [
        resolve({ jsnext: true, main: true, browser: true }), 
        commonjs(),
        babel({
            exclude: /node_modules\/(?!.*@*(mmvis)\/).*/,
            //exclude: 'node_modules/**',///node_modules/,
            externalHelpers: true,
            babelrc: false,
            presets: [
                [
                    "@babel/preset-env",
                    {
                    "modules": false
                    }
                ]
            ],
            plugins: [
                "@babel/plugin-external-helpers"
            ]
        })
    ]
    //external: ['mmvis']
}