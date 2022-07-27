var gulp = require('gulp')

const task = require('../../../task')('../../../dist')


const circularMenuJs = task('circularmenu.js',
	[
		'../../../externals/TweenMax.min.js',
		'./src/*.js',
	],
	{concat: 'brainjs-circularmenu.js', isCode:true}
)


const circularMenuCss = task('circularmenu.css',
	[
		'./src/*.css',
	],
	{concat: 'brainjs-circularmenu.css', dest: 'css'}
)

const circularmenu = gulp.series(circularMenuJs, circularMenuCss)


const all = gulp.series(
	circularmenu
)

exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/*.js', './src/*.html'], circularMenuJs)
	gulp.watch(['./src/*.css'], circularMenuCss)

})