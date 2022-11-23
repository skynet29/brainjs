var gulp = require('gulp')

const task = require('../../../task')('../../../dist')



const mapJs = task('map.js',
	[
		'../../../externals/leaflet-1.0.3/leaflet.js',
		'../../../externals/leaflet-plugins/leaflet.rotatedMarker.js',
		'../../../externals/leaflet-plugins/Leaflet.Coordinates.min.js',
		'../../../externals/leaflet-plugins/leaflet.contextmenu.min.js',
		'../../../externals/leaflet-plugins/Semicircle.js',
		'../../../externals/leaflet-plugins/leaflet.markercluster.js',
		'./src/markers/*.js',
		'./src/shapes/*.js',
		'./src/map.js',	
		'./src/image/*.js',
		'./src/lib/*.js'	
	],
	{concat: 'brainjs-map.js', isCode: true}
)

const mapCss = task('map.css',
	[
		'../../../externals/leaflet-1.0.3/leaflet.css',
		'../../../externals/leaflet-plugins/Leaflet.Coordinates.css',
		'../../../externals/leaflet-plugins/leaflet.contextmenu.min.css',	
		'../../../externals/leaflet-plugins/MarkerCluster.css',	
		'../../../externals/leaflet-plugins/MarkerCluster.Default.css',	
		'./src/image/*.css'
	],
	{concat: 'brainjs-map.css', dest: 'map'}
)

const mapImages = task('map.images',
	[
		'../../../externals/leaflet-1.0.3/images/*'

	],
	{dest: 'map/images'}
)

const mapEditorJs = task('map.editor.js',
	[
		'../../../externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.js',
		'./src/plugins/editor.js',
	],
	{concat: 'brainjs-map-editor.js', isCode:true}
)

const mapEditorCss = task('map.editor.css',
	[
		'../../../externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.css'
	],
	{concat: 'brainjs-map-editor.css', dest: 'map'}
)

const mapEditorImages = task('map.editor.images',
	[
		'../../../externals/leaflet-plugins/leaflet-draw/dist/images/*'

	],
	{dest: 'map/images'}
)

const mapEditor = gulp.series(mapEditorJs, mapEditorCss, mapEditorImages)


const all = gulp.series(mapJs, mapCss, mapImages, mapEditor)


exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/**/*.js', './src/**/*.html'], gulp.series(mapJs, mapEditorJs))
	gulp.watch(['./src/**/*.css'], mapCss)

})