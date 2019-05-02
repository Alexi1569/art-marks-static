var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  cache = require('gulp-cache'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  pug = require('gulp-pug'),
  htmlBeautify = require('gulp-html-beautify'),
  tinyPng = require('gulp-tinypng'),
  clean = require('gulp-clean'),
  plumber = require('gulp-plumber');

gulp.task('browser-sync', function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: './build'
    }
  });
});

gulp.task('sass', function() {
  return gulp
    .src(['app/sass/**/*.sass', '!app/sass/**/_*.sass'])
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('pug', function() {
  return gulp
    .src('app/pug/views/**/*.pug')
    .pipe(plumber())
    .pipe(pug({}))
    .pipe(
      htmlBeautify({
        indentSize: 2
      })
    )
    .pipe(gulp.dest('build/'));
});

gulp.task(
  'watch',
  [
    'sass',
    'pug',
    'js-optimize',
    'js-libs-optimize',
    'css-optimize',
    'tiny-png',
    'fonts',
    'browser-sync'
  ],
  function() {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch(['app/css/**/*.css', 'app/libs/**/*.css'], ['css-optimize']);
    gulp.watch(['build/**/*.html']).on('change', reload);
    gulp.watch('app/pug/**/*.pug', ['pug']);
    gulp.watch(['app/js/**/*.js', 'app/libs/**/*.js'], ['js-libs-optimize', 'js-optimize']);
    gulp.watch('app/img/*', ['tiny-png']);
    gulp.watch('app/fonts/*', ['fonts']);
  }
);

gulp.task('js-libs-optimize', function() {
  return gulp
    .src(['app/libs/**/*.js', 'app/js/**/*.js', '!app/libs/jquery-3.3.1.min.js', '!app/js/main.js'])
    .pipe(concat('build.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('js-optimize', function() {
  return gulp
    .src(['app/libs/jquery-3.3.1.min.js', 'app/js/main.js'])
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('css-optimize', function() {
  return gulp
    .src(['app/libs/**/*.css', 'app/fonts/**/*.css', 'app/css/**/*.css'])
    .pipe(
      autoprefixer({
        browsers: ['cover 99.5%'],
        cascade: false
      })
    )
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  return gulp
    .src(['app/fonts/*', '!app/fonts/*.css'])
    .pipe(clean({ forse: true }))
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('clear', function() {
  cache.clearAll();
});

gulp.task('tiny-png', function() {
  return gulp
    .src('app/img/*')
    .pipe(clean({ force: true }))
    .pipe(tinyPng('9CaEOyJuFSHPz0rXEDOlrloA8kYphfUp'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('default', ['watch']);
