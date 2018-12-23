var gulp = require('gulp')
var path = require('path')

var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var injectHTML = require('gulp-inject-stringified-html')


var dest = './dist'

gulp.task('brainjs', function() {
	return gulp.src([
		'./src/**/*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brain.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('brainjs-bundle', function() {
	return gulp.src([
		'./externals/jquery.min.js',
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.js',
		'./src/index.js',
		'./src/lib/*.js',
		'./src/controls/*.js',
		'./src/services/*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs-bundle.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('brainjs-bundle.css', function() {
	return gulp.src([
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.css',
		])
		.pipe(concat('brainjs-bundle.css'))
		.pipe(gulp.dest(dest))
})

gulp.task('images', function() {
	return gulp.src([
		'./externals/jquery-ui-1.12.1.custom/images/*',
		])
		.pipe(gulp.dest(path.join(dest, 'images')))
})

gulp.task('demo-app', function() {
	return gulp.src([
		'./demo/src/*.js',
		])
		.pipe(injectHTML())
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./demo/public/app'))
})

gulp.task('default', ['brainjs', 'brainjs-bundle', 'brainjs-bundle.css', 'images', 'demo-app'])