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
		'./externals/jquery-contextMenu/jquery.contextMenu.min.js',		
		'./src/lib/index.js',
		'./src/lib/core/*.js',
		'./src/lib/controls/*.js',
		'./src/lib/services/*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('brainjs.css', function() {
	return gulp.src([
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.css',
		'./externals/jquery-contextMenu/jquery.contextMenu.css',				
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

gulp.task('tree.js', function() {
	return gulp.src([
		'./externals/fancytree/dist/jquery.fancytree-all.min.js',
		'./externals/fancytree/3rd-party/extensions/contextmenu/js/jquery.fancytree.contextMenu.js',		
		'./src/ext/tree.js',
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs-tree.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.join(dest, 'tree')))
})

gulp.task('tree.css', function() {
	return gulp.src([
			'./externals/fancytree/dist/skin-lion/ui.fancytree.min.css'
		])
		.pipe(concat('brainjs-tree.css'))
		.pipe(gulp.dest(path.join(dest, 'tree')))
})

gulp.task('tree.images', function() {
	return gulp.src([
			'./externals/fancytree/dist/skin-lion/*.gif'
		])
		.pipe(gulp.dest(path.join(dest, 'tree')))
})

gulp.task('tree.fonts', function() {
	return gulp.src([
			'./externals/jquery-contextMenu/font/*'
		])
		.pipe(gulp.dest(path.join(dest, 'font')))
})



gulp.task('tree', ['tree.js', 'tree.css', 'tree.images', 'tree.fonts'])


gulp.task('brainjs-all', ['brainjs', 'brainjs.css', 'images'])

gulp.task('demo', ['demo-app', 'demo-apphtml'])


gulp.task('all', ['brainjs-all', 'demo', 'tree'])

gulp.task('watch', ['all'], function() {
	gulp.watch(['./src/lib/**/*.js'], ['brainjs'])
	gulp.watch(['./src/ext/tree.js'], ['tree.js'])

	gulp.watch(['./demo/src/*.html', './demo/src/*.js', './demo/index.html'], ['demo'])
})