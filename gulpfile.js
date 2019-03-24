var gulp = require('gulp')
var path = require('path')

var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var injectHTML = require('gulp-inject-stringified-html')


var dest = './dist'


gulp.task('brainjs.js', function() {
	return gulp.src([
		'./externals/jquery.min.js',
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.js',
		'./externals/jquery-contextMenu/jquery.contextMenu.min.js',		
		'./src/lib/index.js',
		'./src/lib/core/*.js',
		'./src/lib/controls/**/*.js',
		'./src/lib/services/*.js'
		])
		.pipe(injectHTML())
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('brainjs.css', function() {
	return gulp.src([
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.css',
		'./externals/jquery-contextMenu/jquery.contextMenu.css',	
		'./externals/font-awesome-4.7.0/css/font-awesome.min.css',
		'./externals/w3.css',
		'./src/lib/core/core.css'
		])
		.pipe(concat('brainjs.css'))
		.pipe(gulp.dest(path.join(dest, 'css')))
})

gulp.task('brainjs.images', function() {
	return gulp.src([
		'./externals/jquery-ui-1.12.1.custom/images/*',
		])
		.pipe(gulp.dest(path.join(dest, 'css/images')))
})

gulp.task('brainjs.fonts', function() {
	return gulp.src([
		'./externals/font-awesome-4.7.0/fonts/*'
		])
		.pipe(gulp.dest(path.join(dest, 'fonts')))
})

gulp.task('demo.js', function() {
	return gulp.src([
		'./demo/src/*.js',
		])
		.pipe(injectHTML())
		.pipe(sourcemaps.init())
		.pipe(concat('demo.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('demo.html', function() {
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
		.pipe(gulp.dest(dest))
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
		.pipe(gulp.dest(path.join(dest, 'css/font')))
})

gulp.task('map.js', function() {
	return gulp.src([
		'./externals/leaflet-1.0.3/leaflet.js',
		'./externals/leaflet-plugins/leaflet.rotatedMarker.js',
		'./externals/leaflet-plugins/Leaflet.Coordinates.min.js',
		'./externals/leaflet-plugins/leaflet.contextmenu.min.js',
		'./externals/leaflet-plugins/Semicircle.js',
		'./src/ext/map/markers/*.js',
		'./src/ext/map/shapes/*.js',
		'./src/ext/map/map.js',
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs-map.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('map.css', function() {
	return gulp.src([
			'./externals/leaflet-1.0.3/leaflet.css',
			'./externals/leaflet-plugins/Leaflet.Coordinates.css',
			'./externals/leaflet-plugins/leaflet.contextmenu.min.css',
		])
		.pipe(concat('brainjs-map.css'))
		.pipe(gulp.dest(path.join(dest, 'map')))
})

gulp.task('map.images', function() {
	return gulp.src([
			'./externals/leaflet-1.0.3/images/*'
		])
		.pipe(gulp.dest(path.join(dest, 'map/images')))
})

gulp.task('map.editor.js', function() {
	return gulp.src([
		'./externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.js',
		'./src/ext/map/plugins/editor.js',
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs-map-editor.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('map.editor.css', function() {
	return gulp.src([
			'./externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.css'
		])
		.pipe(concat('brainjs-map-editor.css'))
		.pipe(gulp.dest(path.join(dest, 'map')))
})

gulp.task('map.editor.images', function() {
	return gulp.src([
			'./externals/leaflet-plugins/leaflet-draw/dist/images/*'
		])
		.pipe(gulp.dest(path.join(dest, 'map/images')))
})

gulp.task('milsymbol.js', function() {
	return gulp.src([
		'./externals/milsymbol.js',
		'./src/ext/milsymbol.js',
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs-milsymbol.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('circularmenu.js', function() {
	return gulp.src([
		'./externals/TweenMax.min.js',
		'./src/ext/circularmenu/*.js',
		])
		.pipe(injectHTML())
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs-circularmenu.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('circularmenu.css', function() {
	return gulp.src([
		'./src/ext/circularmenu/*.css',
		])
		.pipe(concat('brainjs-circularmenu.css'))
		.pipe(gulp.dest(path.join(dest, 'css')))
})

gulp.task('flightpanel.js', function() {
	return gulp.src([
		'./src/ext/flightpanel.js',
		])
		.pipe(sourcemaps.init())
		.pipe(concat('brainjs-flightpanel.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('doc.js', function() {
	return gulp.src([
		'./doc/*.js',
		])
		.pipe(injectHTML())
		.pipe(sourcemaps.init())
		.pipe(concat('doc.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest))
})

gulp.task('doc.html', function() {
	return gulp.src([
		'./doc/index.html',
		])
		.pipe(concat('doc.html'))
		.pipe(gulp.dest(dest))
})

gulp.task('tree', ['tree.js', 'tree.css', 'tree.images', 'tree.fonts'])
gulp.task('map', ['map.js', 'map.css', 'map.images'])
gulp.task('milsymbol', ['milsymbol.js'])
gulp.task('circularmenu', ['circularmenu.js', 'circularmenu.css'])
gulp.task('map.editor', ['map.editor.js', 'map.editor.css', 'map.editor.images'])
gulp.task('flightpanel', ['flightpanel.js'])


gulp.task('brainjs', ['brainjs.js', 'brainjs.css', 'brainjs.images', 'brainjs.fonts'])

gulp.task('demo', ['demo.js', 'demo.html'])
gulp.task('doc', ['doc.js', 'doc.html'])


gulp.task('all', [
	'brainjs',
	'demo',
	'tree',
	'map',
	'map.editor',
	'milsymbol',
	'circularmenu',
	'flightpanel',
	'doc'
])

gulp.task('watch', ['all'], function() {
	gulp.watch(['./src/lib/**/*.js', './src/lib/**/*.html'], ['brainjs'])
	gulp.watch(['./src/ext/tree.js'], ['tree.js'])
	gulp.watch(['./src/ext/map/**/*.js'], ['map.js', 'map.editor.js'])
	gulp.watch(['./src/ext/milsymbol.js'], ['milsymbol.js'])
	gulp.watch(['./src/ext/circularmenu/*.js', './src/ext/circularmenu/*.html'], ['circularmenu.js'])
	gulp.watch(['./src/ext/circularmenu/*.css'], ['circularmenu.css'])
	gulp.watch(['./src/ext/flightpanel.js'], ['flightpanel.js'])

	gulp.watch(['./demo/src/*.html', './demo/src/*.js', './demo/index.html'], ['demo'])
	gulp.watch(['./doc/*.html', './doc/*.js'], ['doc'])

})