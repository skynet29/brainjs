var gulp = require('gulp')
var path = require('path')

var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var injectHTML = require('gulp-inject-stringified-html')
var uglify = require('gulp-uglify-es').default
var rename = require("gulp-rename")
const eslint = require('gulp-eslint')
const browserify = require('gulp-browserify')
const bro = require('gulp-bro')
const babelify = require('babelify')

const isDev = process.env.NODE_ENV != 'production'
console.log('isDev', isDev)

function source(dest, srcs, options) {
	options = options || {}

	let stream = gulp.src(srcs)

	if (options.browserify === true) {
		stream = stream.pipe(bro({
				  transform: [
					  babelify.configure({presets: ['@babel/env']})
					]
		        }))		
	}	

	if (options.isCode === true) {
		stream = stream.pipe(injectHTML())
		stream = stream.pipe(eslint({
			useEslintrc: false,		
			parserOptions: {
				ecmaVersion: 8				
			}

		}))
		stream = stream.pipe(eslint.format())

	}

	if (typeof options.concat == 'string') {
		if (isDev) {stream = stream.pipe(sourcemaps.init())}
		stream = stream.pipe(concat(options.concat))
		if (isDev) {stream = stream.pipe(sourcemaps.write())}
	}

	if (options.isCode === true && !isDev) {
		stream = stream.pipe(uglify())
	}


	if (options.dest != undefined) {
		stream = stream.pipe(gulp.dest(path.join(dest, options.dest)))
	}
	else {
		stream = stream.pipe(gulp.dest(dest))
	}

	return stream
}


module.exports = function(dest) {
	return function task(taskName, srcs, options) {
		return function() {
			console.log('task', taskName)
			return source(dest, srcs, options)
		}
	}
}