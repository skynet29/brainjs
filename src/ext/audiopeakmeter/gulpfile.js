var gulp = require('gulp')

const task = require('../../../task')('../../../dist')


const libJs = task('audioPeakMeter.js',
	[
		'./src/audiopeakmeter.js',
	],
	{concat: 'brainjs-audiopeakmeter.js', browserify:true}
)


const all = gulp.series(
	libJs
)

exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/audiopeakmeter.js'], libJs)

})