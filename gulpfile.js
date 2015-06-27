var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var sass = require('gulp-sass');

gulp.task('clean', function (cb) {
  del(['./build/**/*'], cb);
});

gulp.task('copy-lib', function () {
  return gulp.src([
      './node_modules/normalize.css/normalize.css',
      './lib/**'
    ]).pipe(gulp.dest('./build/lib'));
});

gulp.task('copy-assets', function () {
  return gulp.src('./src/assets/**/*')
      .pipe(gulp.dest('./build/assets'));
});

gulp.task('babel', function () {
  return gulp.src('./src/js/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./build/js'));
});

gulp.task('jade', function () {
  return gulp.src('./src/*.jade')
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest('./build'));
});

gulp.task('jshint', function () {
  gulp.src('./src/js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('sass', function () {
  gulp.src('./src/css/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./build/css'));
});

gulp.task('babel-test', function () {
  var stream = gulp.src('./src/test/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./build/test'));
  return stream;
});

gulp.task('test', ['babel', 'babel-test'], function () {
  return gulp.src('./build/test/*.js')
      .pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', ['copy-lib', 'copy-assets', 'babel', 'jade', 'sass'], function () {
  gulp.watch('./src/**/*.js', ['babel', 'test']);
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch(['./src/**/*.jade', './src/**/*.html'], ['jade']);
});
