var gulp = require('gulp')

const task = require('../../../task')('../../../dist')


const milSymbolJs = task('milsymbol.js',
	[
		'../../../externals/milsymbol.js',
		'./src/*.js',
	],
	{concat: 'brainjs-milsymbol.js', isCode:true}
)


const all = gulp.series(
	milSymbolJs
)

exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/*.js'], milSymbolJs)

})