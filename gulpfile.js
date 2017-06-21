'use strict';

var gulp           = require('gulp');
var browserSync    = require('browser-sync').create();
var nunjucksRender = require('gulp-nunjucks-render');
var data           = require('gulp-data');
var postcss        = require('gulp-postcss');
var rename         = require('gulp-rename');
var autoprefixer   = require('autoprefixer');
// var syntax         = require('postcss-scss');
var simpleVars         = require('postcss-simple-vars');
var nested         = require('postcss-nested');
var cssnano        = require('cssnano');
var sass           = require('gulp-sass');
// var sugarss        = require('sugarss');

gulp.task('css', function () {
  var processors = [
    nested,
    simpleVars({ silent: true }), // Left unknown variables in CSS and do not throw an error. Default is false.
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
  ];
  return gulp.src('./src/css/*.css')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// gulp.task('sass', function () {
//   return gulp.src('./src/css/*.+(scss|sass|css)')
//     .pipe(sass.sync().on('error', sass.logError))
//     .pipe(gulp.dest('./build/css'))
//     .pipe(browserSync.reload({
//       stream: true
//     }))
// });

gulp.task('nunjucks', function() {
  return gulp.src('./src/pages/**/*.+(html|nunjucks)')
  .pipe(data(function() {
    return require('./src/data.json')   // Adding data to Nunjucks
  }))
  .pipe(nunjucksRender({
    path: ['./src/templates']
  }))
  .pipe(gulp.dest('./build'))
  .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'css', 'nunjucks'], function () {
  gulp.watch('./src/css/*.css', ['css']);
  gulp.watch('./src/pages/*.+(html|nunjucks)', ['nunjucks']);
  gulp.watch('./src/templates/**/*.+(html|nunjucks)', ['nunjucks']); 
  gulp.watch('./src/js/**/*.js', browserSync.reload); 
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
  })
})