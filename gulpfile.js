var gulp = require('gulp')

const task = require('./task')('./dist')


task('brainjs.js', 
	[
		'./externals/jquery.min.js',
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.js',
		'./externals/jquery-contextMenu/jquery.contextMenu.min.js',		
		'./src/lib/index.js',
		'./src/lib/core/*.js',
		'./src/lib/controls/**/*.js',
		'./src/lib/services/*.js'
	],
	{isCode: true, concat: 'brainjs.js'}

)

task('brainjs.css',
	[
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.css',
		'./externals/jquery-contextMenu/jquery.contextMenu.css',	
		'./externals/fontawesome-free-5.8.1-web/css/all.css',
		'./externals/w3.css',
		'./src/lib/core/core.css',
		'./src/lib/controls/**/*.css'
	],
	{concat: 'brainjs.css', dest: 'css'}
)

task('brainjs.images', 
	[
		'./externals/jquery-ui-1.12.1.custom/images/*',
	], 
	{dest: 'css/images'}
)


task('brainjs.fonts', 
	[
		'./externals/fontawesome-free-5.8.1-web/webfonts/*'
	], 
	{dest: 'webfonts'}
)

task('demo.js', 
	[
		'./demo/src/*.js',
	], 
	{concat: 'demo.js', isCode: true}
)

task('demo.html', 
	[
		'./demo/index.html',
	]
)

task('tree.js', 
	[
		'./externals/fancytree/dist/jquery.fancytree-all.min.js',
		'./externals/fancytree/3rd-party/extensions/contextmenu/js/jquery.fancytree.contextMenu.js',		
		'./src/ext/tree.js',
	], 
	{concat: 'brainjs-tree.js', isCode: true}
)

task('tree.css',
	[
		'./externals/fancytree/dist/skin-lion/ui.fancytree.min.css'
	],
	{concat: 'brainjs-tree.css', dest: 'tree'}
)

task('tree.images',
	[
		'./externals/fancytree/dist/skin-lion/*.gif'
	],
	{dest: 'tree'}
)

task('tree.fonts',
	[
		'./externals/jquery-contextMenu/font/*'
	],
	{dest: 'css/font'}
)

task('map.js',
	[
		'./externals/leaflet-1.0.3/leaflet.js',
		'./externals/leaflet-plugins/leaflet.rotatedMarker.js',
		'./externals/leaflet-plugins/Leaflet.Coordinates.min.js',
		'./externals/leaflet-plugins/leaflet.contextmenu.min.js',
		'./externals/leaflet-plugins/Semicircle.js',
		'./src/ext/map/markers/*.js',
		'./src/ext/map/shapes/*.js',
		'./src/ext/map/map.js',	
		'./src/ext/map/image.js'	
	],
	{concat: 'brainjs-map.js', isCode: true}
)

task('map.css',
	[
		'./externals/leaflet-1.0.3/leaflet.css',
		'./externals/leaflet-plugins/Leaflet.Coordinates.css',
		'./externals/leaflet-plugins/leaflet.contextmenu.min.css',	
	],
	{concat: 'brainjs-map.css', dest: 'map'}
)

task('map.images',
	[
		'./externals/leaflet-1.0.3/images/*'

	],
	{dest: 'map/images'}
)

task('map.editor.js',
	[
		'./externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.js',
		'./src/ext/map/plugins/editor.js',
	],
	{concat: 'brainjs-map-editor.js', isCode:true}
)

task('map.editor.css',
	[
		'./externals/leaflet-plugins/leaflet-draw/dist/leaflet.draw.css'
	],
	{concat: 'brainjs-map-editor.css', dest: 'map'}
)

task('map.editor.images',
	[
		'./externals/leaflet-plugins/leaflet-draw/dist/images/*'

	],
	{dest: 'map/images'}
)

task('milsymbol.js',
	[
		'./externals/milsymbol.js',
		'./src/ext/milsymbol.js',
	],
	{concat: 'brainjs-milsymbol.js', isCode:true}
)

task('circularmenu.js',
	[
		'./externals/TweenMax.min.js',
		'./src/ext/circularmenu/*.js',
	],
	{concat: 'brainjs-circularmenu.js', isCode:true}
)


task('circularmenu.css',
	[
		'./src/ext/circularmenu/*.css',
	],
	{concat: 'brainjs-circularmenu.css', dest: 'css'}
)

task('flightpanel.js',
	[
		'./src/ext/flightpanel.js',
	],
	{concat: 'brainjs-flightpanel.js', isCode:true}
)

task('doc.js',
	[
		'./doc/*.js',
	],
	{concat: 'doc.js', isCode:true}
)

task('doc.html',
	[
		'./doc/index.html',
	],
	{concat: 'doc.html'}
)



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
	gulp.watch(['./src/lib/**/*.js', './src/lib/**/*.html'], ['brainjs.js'])
	gulp.watch(['./src/lib/core/core.css', './src/lib/controls/**/*.css'], ['brainjs.css'])
	gulp.watch(['./src/ext/tree.js'], ['tree.js'])
	gulp.watch(['./src/ext/map/**/*.js'], ['map.js', 'map.editor.js'])
	gulp.watch(['./src/ext/milsymbol.js'], ['milsymbol.js'])
	gulp.watch(['./src/ext/circularmenu/*.js', './src/ext/circularmenu/*.html'], ['circularmenu.js'])
	gulp.watch(['./src/ext/circularmenu/*.css'], ['circularmenu.css'])
	gulp.watch(['./src/ext/flightpanel.js'], ['flightpanel.js'])

	gulp.watch(['./demo/src/*.html', './demo/src/*.js', './demo/index.html'], ['demo'])
	gulp.watch(['./doc/*.html', './doc/*.js'], ['doc'])

})