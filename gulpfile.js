var gulp = require('gulp')

const task = require('./task')('./dist')


const brainjsJs = task('brainjs.js', 
	[
		'./externals/jquery.min.js',
		'./externals/jquery-ui-1.12.1.custom/jquery-ui.min.js',
		'./externals/jquery-contextMenu/jquery.contextMenu.min.js',		
		'./externals/cleave.min.js',		
		'./externals/cleave-phone.fr.js',
		'./externals/jquery.knob.js',
		//'./externals/jquery.ui.touch-punch.min.js',
		'./src/lib/index.js',
		'./src/lib/core/*.js',
		'./src/lib/controls/**/*.js',
		'./src/lib/services/*.js',

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


const brainjs = gulp.series(brainjsJs, brainjsCss, brainjsFonts, brainjsImages)

const demo = gulp.series(demoJs, demoHtml)


const all = gulp.series(
	brainjs,
	demo,
)

exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/lib/**/*.js', './src/lib/**/*.html'], brainjsJs)
	gulp.watch(['./src/lib/core/core.css', './src/lib/controls/**/*.css'], brainjsCss)
	gulp.watch(['./demo/src/*.html', './demo/src/*.js', './demo/index.html'], demo)

})