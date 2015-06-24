var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');

gulp.task('clean', function (cb) {
  del(['./build/**/*'], cb);
});

gulp.task('copy-lib', function () {
  gulp.src('./node_modules/normalize.css/normalize.css').pipe(gulp.dest('./build/lib'));
  gulp.src('./lib/*').pipe(gulp.dest('./build/lib'));
});

gulp.task('babel', function () {
  gulp.src('./src/js/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./build/js'));
});

gulp.task('jade', function () {
  gulp.src('./src/*.jade')
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

gulp.task('default', ['copy-lib', 'babel', 'jade', 'sass'], function () {
  gulp.watch('./src/**/*.js', ['babel']);
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.jade', ['jade']);
});
