var gulp = require('gulp')
var path = require('path')

var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var injectHTML = require('gulp-inject-stringified-html')


var dest = './dist'


gulp.task('brainjs', function() {
	return gulp.src([
		'./externals/jquery.min.js',
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.js',
		'./src/index.js',
		'./src/lib/*.js',
		'./src/controls/*.js',
		'./src/services/*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('brainjs.css', function() {
	return gulp.src([
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.css',
		'./externals/w3.css'
		])
		.pipe(concat('brainjs.css'))
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
		.pipe(concat('demo.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('demo-apphtml', function() {
	return gulp.src([
		'./demo/index.html',
		])
		.pipe(gulp.dest(dest))
})

gulp.task('brainjs-all', ['brainjs', 'brainjs.css', 'images'])

gulp.task('demo', ['demo-app', 'demo-apphtml'])

gulp.task('all', ['brainjs-all', 'demo'])

gulp.task('watch', ['all'], function() {
	gulp.watch(['./src/**/*.js'], ['brainjs'])
	gulp.watch(['./demo/src/*.html', './demo/src/*.js', './demo/index.html'], ['demo'])
})