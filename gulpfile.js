var gulp = require('gulp')
var path = require('path')

var concat = require('gulp-concat')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')

var src = 'src'
var dest = 'dist'

gulp.task('build-brain', function() {
	return gulp.src([
		path.join(src, 'brain.view.js'),
		path.join(src, 'brain.checkgroup.js'),
		path.join(src, 'brain.radiogroup.js'),
		path.join(src, 'brain.menu.js'),
		path.join(src, 'brain.pager.js')
		])
		.pipe(concat('brain.js'))
		.pipe(gulp.dest(dest))
		.pipe(rename('brain.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dest))
})




gulp.task('default', ['build-brain'])