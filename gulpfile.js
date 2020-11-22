const gulp = require('gulp');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const colors = require('colors-console');
const clean = require('gulp-clean');
const replace = require('@rollup/plugin-replace');
const rename = require("gulp-rename");

const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;

const fs = require('fs-extra')

let time = new Date().getTime();

let cleanHandle = ()=>{
    return gulp.src('dist/**/*.js', {read: false})
        .pipe(clean());
}

let stuffZero = ( num = 0 ) => {
    if( num < 10 ){
        return "0"+num
    } else {
        return num;
    }
}

let timeStr = ( time = new Date().getTime() ) => {
    let _t = new Date( time );
    return stuffZero(_t.getHours())+":"+stuffZero(_t.getMinutes())+":"+stuffZero(_t.getSeconds());
}

let timeWait = ( mt = 0 ) => {
    var str;
    if( mt < 1000 ) str = mt+" ms";
    if( mt > 1000 ) str = (mt/1000).toFixed(3)+" s";
    return colors(mt<6000?'green':'red', str);
}

//dev模式下，只需要 dist/index.js 的iife，非过滤mmvis非压缩版本 本地测试
//然后发布npm publish的时候 prepublish 构建 dist/index_cjs.js 非压缩版，过滤mmvis， 给chartx本地测试
let getRollupOptions = ( $module = 'dev' )=>{
    
    const packageObj = fs.readJsonSync('./package.json')
    let version = packageObj.version;

    let inputOptions = {
        input: './src/index.js',
        plugins: [
            resolve({ 
                mainFields:['module', 'main'],
                browser: true
            }), 
            commonjs({
                include: 'node_modules/**'
            }),
            replace({
                __VERSION__: version
            }),
            babel({
                exclude: 'node_modules/**',///node_modules/,
                babelrc: false,
                presets: [
                    [
                        "@babel/preset-env",
                        {
                        "modules": false
                        }
                    ]
                ],
                //externalHelpers: true,
                runtimeHelpers: true,
                plugins: [
                    //[ "@babel/plugin-external-helpers" ],
                    [ "@babel/plugin-transform-runtime"]
                ]
            })
        ]
    };
    
    let outputOptions = [];
    let outputTypes = [ 'es','cjs','iife' ];


    outputTypes.forEach(type => {

        outputOptions.push( {
            file: './dist/index_'+type+'.js',
            format: type,
            name: 'canvax'
        } );

    });

    if( outputOptions.length == 1 ){
        outputOptions = outputOptions[0];
    };

    return { inputOptions, outputOptions }
}

//task rollup
let rollupNum = 0;
let rollupWatcher = null;
let rollupDist = ()=>{

    if( rollupWatcher ){
        rollupWatcher.close();
        rollupWatcher = null;
    }

    let opt = getRollupOptions();

    return new Promise( resolve => {
        rollupWatcher = rollup.watch({
            ...opt.inputOptions,
            output: opt.outputOptions,
            watch: {
              include : ['./src/**/*.js']
            }
        });

        rollupWatcher.on('event', event => {
            
            //event.code 会是下面其中一个：
            //START        — 监听器正在启动（重启）
            //BUNDLE_START — 构建单个文件束
            //BUNDLE_END   — 完成文件束构建
            //END          — 完成所有文件束构建
            //ERROR        — 构建时遇到错误
            //FATAL        — 遇到无可修复的错误
            if( event.code == "ERROR" ){
                console.log( event )
            }
            if( event.code == "START" ){
                console.log(`[${colors('grey',timeStr(time))}] rollup start ...`)
                time = new Date().getTime();
            };
            if( event.code == 'END' ){
                // pipeline(
                //     //gulp.src(['./dist/index_*.js', '!./dist/index_es.js']),
                //     //gulp.src('./dist/index_(?!es.js)'), //好像不生效
                //     gulp.src(['./dist/index_iife.js']), //只有iife需要压缩，因为是给到chartpark拼文件用的
                //     uglify(),
                //     rename({ suffix: '.min' }),
                //     gulp.dest('./dist/')
                // ).on("end",()=>{

                    if( rollupNum ){
                        console.log(`[${colors('grey',timeStr(time))}] rollup after ${timeWait(new Date().getTime() - time)}`)
                        console.log('watching...');
                    };
                    rollupNum++;
                    resolve();

                //});
                
            };
        });
    } )
};

//用来监听package改动，获取最新的version
let watchPackageVersion = () => {
    console.log('watching...');
    const watcher = gulp.watch([ 'package.json' ]); //单独监听package.json变化
    watcher.on('change', async function(path) {
        let newTime = new Date().getTime();

        if( newTime - time < 300 ){
            //console.log( '间隔太小的改动去掉了' )
            return;
        };

        time = newTime;

        console.log(`[${colors('grey',timeStr(time))}] File ${path} was changed`);

        await rollupDist()
        
    });
    return watcher;
};

let minFile = ()=> {
    return new Promise( resolve => {
        return pipeline(
            //gulp.src(['./dist/index_*.js', '!./dist/index_es.js']),
            //gulp.src('./dist/index_(?!es.js)'), //好像不生效
            gulp.src(['./dist/index_iife.js']), //只有iife需要压缩，因为是给到chartpark拼文件用的
            uglify(),
            rename({ suffix: '.min' }),
            gulp.dest('./dist/')
        ).on("end",()=>{
            resolve();
        });
    } )
}

//把mmvis从node_models里面copy到本地
exports.default = gulp.series(cleanHandle, rollupDist, watchPackageVersion );
exports.prePublishToNpm = gulp.series( minFile );