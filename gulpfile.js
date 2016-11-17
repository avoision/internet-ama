var gulp = require('gulp');
var webpack = require('webpack-stream');
var less = require('gulp-less');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var merge = require('merge-stream');
var livereload = require('gulp-livereload');

var paths = {
  js: './src/js/**/*.js',
  css: './src/css/**/*.css',
  less: './src/css/**/*.less'
}

gulp.task('css-build', function () {
  var lessStream = gulp.src(paths.less)
    .pipe(less())
    .pipe(concat('less-files.less'))

  var cssStream = gulp.src(paths.css)
    .pipe(concat('css-files.css'))

  var mergedStream = merge(lessStream, cssStream)
    .pipe(concat('styles.css'))
    .pipe(minify())
    .pipe(gulp.dest('build/css'))
    .pipe(livereload());

  return mergedStream
});

gulp.task('webpack-build', function() {
return gulp.src(paths.js)
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest('build/js/'))
  .pipe(livereload());
})

gulp.task('watch', function() {
  gulp.watch(paths.js, ['webpack-build'])
  gulp.watch(paths.css, ['css-build'])
  gulp.watch(paths.less, ['css-build'])  
})

gulp.task('dev', ['webpack-build', 'css-build', 'watch'])

// gulp.task('build', ['webpack-build', 'css-build'])

gulp.task('default', function() {
  console.log('gulp default')
});








