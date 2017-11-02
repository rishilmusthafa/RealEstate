var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var minify = require('gulp-minifier');
var concat = require('gulp-concat');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var htmlmin = require('gulp-html-minifier');

//Compile sass into CSS & auto-inject into browserSync
gulp.task('sass', function() {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','node_modules/ekko-lightbox/dist/ekko-lightbox.css', 'src/uncompiled/scss/*.scss'])
      .pipe(sass())
      .pipe(gulp.dest("src/css"))
      .pipe(browserSync.stream());
});

//Move the javascript files into our /src/js folder
gulp.task('js', function() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js','node_modules/tether/dist/js/tether.min.js','node_modules/ekko-lightbox/dist/ekko-lightbox.min.js','node_modules/popper.js/dist/umd/popper.min.js','src/uncompiled/js/custom.js'])
      .pipe(gulp.dest("src/js"))
      .pipe(browserSync.stream());
});

// Static Server + watching Scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server:"./src"
  });

  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/uncompiled/scss/*.scss', 'src/uncompiled/js/*.js'], ['compile']);
  gulp.watch("src/uncompiled/*.html").on('change', browserSync.reload);
});

// Minify all the file in src
 gulp.task('minify', function() {
  return gulp.src('src/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('src/dest'));
});

// Combine all the js files
gulp.task('scripts', function() {
  return gulp.src(['src/dest/js/jquery.min.js','src/dest/js/popper.min.js','src/dest/js/bootstrap.min.js','src/dest/js/ekko-lightbox.min.js','src/dest/js/custom.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('src/dist'))
    .on('end',function(){
        console.log('Concat ended.');
    });
});

// Combine all the js files
gulp.task('style', function() {
  return gulp.src('src/dest/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('src/dist'));
});

//Minify all html files

gulp.task('minifyHtml', function() {
  gulp.src('src/uncompiled/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('src/'))
});
// Concatiating all the js files
gulp.task('clean', function () {
  return del(['src/dest/','src/css/','src/js/']);
});

// Concatiating all the js files
gulp.task('default', ['serve']);

//Build a working copy
gulp.task('compile', gulpSequence(['js', 'sass'], 'minify', ['scripts', 'style'], 'clean','minifyHtml'));
