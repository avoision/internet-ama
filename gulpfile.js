var gulp =        require('gulp');
var webpack =     require('webpack-stream');
var less =        require('gulp-less');
var concat =      require('gulp-concat');
var minify =      require('gulp-minify-css');
var livereload =  require('gulp-livereload');
var uglify =      require('gulp-uglify');
var cleanCSS =     require('gulp-clean-css');

var paths = {
  js: './src/js/**/*.js',
  server: './server/**/*.js',
  css: './src/css/**/*.css',
  less: './src/css/**/*.less'
}

gulp.task('css-build', function () {
  return gulp.src([paths.css, paths.less])
    .pipe(concat('styles.less'))
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/css'))
});

gulp.task('webpack-build', function() {
return gulp.src(paths.js)
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest('build/js/'))
  .pipe(livereload());
})

gulp.task('watch', function() {
  gulp.watch(paths.server, ['webpack-build'])
  gulp.watch(paths.js, ['webpack-build'])
  gulp.watch(paths.css, ['css-build'])
  gulp.watch(paths.less, ['css-build'])  
})

gulp.task('dev', ['webpack-build', 'css-build', 'watch'])

gulp.task('build', ['webpack-build', 'css-build'])

gulp.task('default', function() {
  console.log('gulp default')
});









