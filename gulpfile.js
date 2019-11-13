const gulp = require('gulp');
const babel = require('gulp-babel');
 
gulp.task('default', () =>
    gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['@babel/env'],
            plugins: ["transform-es2015-modules-umd"]
        }))
        .pipe(gulp.dest('dist'))
);