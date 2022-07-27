var gulp = require('gulp')

const task = require('../../../task')('../../../dist')


const pdfJs = task('pdf.js', 
	[
		'../../../externals/pdf/pdf.min.js',
		'./src/*.js'
	], 
	{concat: 'brainjs-pdf.js'}
)

const pdfWorkerJs = task('pdf.worker.js', 
	[
		'../../../externals/pdf/pdf.worker.min.js',
	], 
	{concat: 'worker.js', dest: 'pdf'}
)

const all = gulp.series(
	pdfJs,
	pdfWorkerJs
)

exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/*.js'], pdfJs)

})