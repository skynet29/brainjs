var gulp = require('gulp')

const task = require('./task')('./dist')


const brainjsJs = task('brainjs.js', 
	[
		'./externals/jquery.min.js',
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.js',
		'./externals/jquery-contextMenu/jquery.contextMenu.min.js',		
		'./externals/cleave.min.js',		
		'./externals/cleave-phone.fr.js',		
		//'./externals/jquery.ui.touch-punch.min.js',
		'./src/lib/index.js',
		'./src/lib/core/*.js',
		'./src/lib/controls/**/*.js',
		'./src/lib/services/*.js',
		'./src/ext/pdf.js',

	],
	{isCode: true, concat: 'brainjs.js'}

)

const brainjsCss = task('brainjs.css',
	[
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.css',
		'./externals/jquery-contextMenu/jquery.contextMenu.css',
		'./externals/fontawesome-free-5.13.0-web/css/all.css',
		'./externals/w3.css',
		'./src/lib/core/core.css',
		'./src/lib/controls/**/*.css'
	],
	{concat: 'brainjs.css', dest: 'css'}
)

const brainjsImages = task('brainjs.images', 
	[
		'./externals/jquery-ui-1.12.1.custom/images/*',
	], 
	{dest: 'css/images'}
)


const brainjsFonts = task('brainjs.fonts', 
	[
		'./externals/fontawesome-free-5.13.0-web/webfonts/*'
	], 
	{dest: 'webfonts'}
)

const demoJs = task('demo.js', 
	[
		'./demo/src/*.js',
	], 
	{concat: 'demo.js', isCode: true}
)

const demoHtml = task('demo.html', 
	[
		'./demo/index.html',
	]
)

const treeJs = task('tree.js', 
	[
		'./externals/fancytree/dist/jquery.fancytree-all.min.js',
		'./externals/fancytree/3rd-party/extensions/contextmenu/js/jquery.fancytree.contextMenu.js',		
		'./src/ext/tree.js',
	], 
	{concat: 'brainjs-tree.js', isCode: true}
)

const treeCss = task('tree.css',
	[
		'./externals/fancytree/dist/skin-lion/ui.fancytree.min.css'
	],
	{concat: 'brainjs-tree.css', dest: 'tree'}
)

const treeImages = task('tree.images',
	[
		'./externals/fancytree/dist/skin-lion/*.gif'
	],
	{dest: 'tree'}
)

const treeFonts = task('tree.fonts',
	[
		'./externals/jquery-contextMenu/font/*'
	],
	{dest: 'css/font'}
)

const mapJs = task('map.js',
	[
		'./externals/leaflet-1.0.3/leaflet.js',
		'./externals/leaflet-plugins/leaflet.rotatedMarker.js',
		'./externals/leaflet-plugins/Leaflet.Coordinates.min.js',
		'./externals/leaflet-plugins/leaflet.contextmenu.min.js',
		'./externals/leaflet-plugins/Semicircle.js',
		'./src/ext/map/markers/*.js',
		'./src/ext/map/shapes/*.js',
		'./src/ext/map/map.js',	
		'./src/ext/map/image/*.js',
		'./src/ext/map/lib/*.js'	
	],
	{concat: 'brainjs-map.js', isCode: true}
)

const mapCss = task('map.css',
	[
		'./externals/leaflet-1.0.3/leaflet.css',
		'./externals/leaflet-plugins/Leaflet.Coordinates.css',
		'./externals/leaflet-plugins/leaflet.contextmenu.min.css',	
		'./src/ext/map/image/*.css'
	],
	{concat: 'brainjs-map.css', dest: 'map'}
)

const mapImages = task('map.images',
	[
		'./externals/leaflet-1.0.3/images/*'

	],
	{dest: 'map/images'}
)

const mapEditorJs = task('map.editor.js',
	[
		'./externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.js',
		'./src/ext/map/plugins/editor.js',
	],
	{concat: 'brainjs-map-editor.js', isCode:true}
)

const mapEditorCss = task('map.editor.css',
	[
		'./externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.css'
	],
	{concat: 'brainjs-map-editor.css', dest: 'map'}
)

const mapEditorImages = task('map.editor.images',
	[
		'./externals/leaflet-plugins/leaflet-draw/dist/images/*'

	],
	{dest: 'map/images'}
)

const milSymbolJs = task('milsymbol.js',
	[
		'./externals/milsymbol.js',
		'./src/ext/milsymbol.js',
	],
	{concat: 'brainjs-milsymbol.js', isCode:true}
)

const circularMenuJs = task('circularmenu.js',
	[
		'./externals/TweenMax.min.js',
		'./src/ext/circularmenu/*.js',
	],
	{concat: 'brainjs-circularmenu.js', isCode:true}
)


const circularMenuCss = task('circularmenu.css',
	[
		'./src/ext/circularmenu/*.css',
	],
	{concat: 'brainjs-circularmenu.css', dest: 'css'}
)

const flightPanelJs = task('flightpanel.js',
	[
		'./src/ext/flightpanel.js',
	],
	{concat: 'brainjs-flightpanel.js', isCode:true}
)

const pdfJs = task('pdf.js', 
	[
		'./externals/pdf/pdf.min.js'
	], 
	{concat: 'brainjs-pdf.js'}
)

const pdfWorkerJs = task('pdf.worker.js', 
	[
		'./externals/pdf/pdf.worker.min.js',
	], 
	{concat: 'worker.js', dest: 'pdf'}
)

const tree = gulp.series(treeJs, treeCss, treeImages, treeFonts)
const map = gulp.series(mapJs, mapCss, mapImages)
const milsymbol = gulp.series(milSymbolJs)
const circularmenu = gulp.series(circularMenuJs, circularMenuCss)
const mapEditor = gulp.series(mapEditorJs, mapEditorCss, mapEditorImages)
const flightpanel = gulp.series(flightPanelJs)


const brainjs = gulp.series(brainjsJs, brainjsCss, brainjsFonts, brainjsImages)

const demo = gulp.series(demoJs, demoHtml)



const all = gulp.series(
	brainjs,
	demo,
	tree,
	map,
	mapEditor,
	milsymbol,
	circularmenu,
	flightpanel,
	pdfJs,
	pdfWorkerJs
)

exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/lib/**/*.js', './src/lib/**/*.html', './src/ext/pdf.js'], brainjsJs)
	gulp.watch(['./src/lib/core/core.css', './src/lib/controls/**/*.css'], brainjsCss)
	gulp.watch(['./src/ext/tree.js'], treeJs)
	gulp.watch(['./src/ext/map/**/*.js', './src/ext/map/**/*.html'], gulp.series(mapJs, mapEditorJs))
	gulp.watch(['./src/ext/map/**/*.css'], mapCss)
	gulp.watch(['./src/ext/milsymbol.js'], milSymbolJs)
	gulp.watch(['./src/ext/circularmenu/*.js', './src/ext/circularmenu/*.html'], circularMenuJs)
	gulp.watch(['./src/ext/circularmenu/*.css'], circularMenuCss)
	gulp.watch(['./src/ext/flightpanel.js'], flightPanelJs)

	gulp.watch(['./demo/src/*.html', './demo/src/*.js', './demo/index.html'], demo)

})