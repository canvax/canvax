var rollup = require('rollup');

rollup.rollup({
    entry: 'canvax/index.js'
}).then(function(bundle) {

	// output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
    // amd – 使用像requirejs一样的银木块定义
    // cjs – CommonJS，适用于node和browserify / Webpack
    // es6 (default) – 保持ES6的格式
    // iife – 使用于<script> 标签引用的方式
    // umd – 适用于CommonJs和AMD风格通用模式

    bundle.write({
        format: 'iife',
        moduleName: 'Canvax',
        dest: 'build/canvax.js',
        sourceMap: 'inline'
    });


    bundle.write({
        format: 'amd',
        moduleName: 'Canvax',
        dest: 'build/amd/canvax.js',
        sourceMap: 'inline'
    });

    bundle.write({
        format: 'umd',
        moduleName: 'Canvax',
        dest: 'build/umd/canvax.js',
        sourceMap: 'inline'
    });


    bundle.write({
        format: 'cjs',
        moduleName: 'Canvax',
        dest: 'build/cjs/canvax.js',
        sourceMap: 'inline'
    });

});