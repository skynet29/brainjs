var gulp = require('gulp')

const task = require('../../../task')('../../../dist')


const flightPanelJs = task('flightpanel.js',
	[
		'./src/*.js',
	],
	{concat: 'brainjs-flightpanel.js', isCode:true}
)

const all = gulp.series(
	flightPanelJs
)

exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/*.js'], flightPanelJs)

})