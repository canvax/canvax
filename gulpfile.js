const gulp = require('gulp');
const babel = require('gulp-babel');
const rollup = require('rollup');

let babelSrc = ()=>{
    return gulp.src('src/**/*.js')
    .pipe(babel({
        presets: ['@babel/env'],
        plugins: ["transform-es2015-modules-umd"]
    }))
    .pipe(gulp.dest('dist')); 
};

let rollupDist = ()=>{
    return rollup.rollup({
        entry : './dist/index.js'
    }).then( bundle => {
        bundle.write({
            format: "umd",
            moduleName: "canvax",
            dest: "./dist/index_umd.js"
        });
    } );
};

gulp.series( babelSrc, rollupDist );

