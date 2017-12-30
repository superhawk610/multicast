const gulp = require('gulp')
const uglify = require('gulp-uglify-es').default
const cleanCSS = require('gulp-clean-css')

gulp.task('js', () => {
  return gulp
    .src('build/js/*')
    .pipe(uglify().on('error', err => console.log(err)))
    .pipe(gulp.dest('public/js'))
})

gulp.task('css', () => {
  return gulp
    .src('build/css/*')
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/css'))
})

gulp.task('vendor', () => {
  gulp
    .src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('public/js'))
  gulp
    .src('node_modules/spectre.css/dist/spectre.min.css')
    .pipe(gulp.dest('public/css'))
  gulp.src('node_modules/font-awesome/css/*').pipe(gulp.dest('public/css'))
  gulp.src('node_modules/font-awesome/fonts/*').pipe(gulp.dest('public/fonts'))
  gulp.src('node_modules/bowser/bowser.min.js').pipe(gulp.dest('public/js'))
})

gulp.task('default', ['js', 'css', 'vendor'])
gulp.task('minify', ['js', 'css'])
