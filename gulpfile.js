const gulp = require('gulp')
const uglify = require('gulp-uglify-es').default
const cleanCSS = require('gulp-clean-css')

function js() {
  return gulp
    .src('build/js/*')
    .pipe(uglify().on('error', err => console.log(err)))
    .pipe(gulp.dest('public/js'))
}

function css() {
  return gulp
    .src('build/css/*')
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/css'))
}

function copyJs() {
  return gulp
    .src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('public/js'))
}

function copyCss() {
  return gulp
    .src('node_modules/spectre.css/dist/spectre.min.css')
    .pipe(gulp.dest('public/css'))
}

function copyFA() {
  return gulp
    .src('node_modules/font-awesome/css/*')
    .pipe(gulp.dest('public/css'))
}

function copyFAFonts() {
  return gulp
    .src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('public/fonts'))
}

function copyBowser() {
  return gulp
    .src('node_modules/bowser/bowser.min.js')
    .pipe(gulp.dest('public/js'))
}

const vendor = gulp.parallel(copyJs, copyCss, copyFA, copyFAFonts, copyBowser)
const build = gulp.parallel(js, css, vendor)
const minify = gulp.parallel(js, css)

gulp.task('default', build)
gulp.task('minify', minify)
