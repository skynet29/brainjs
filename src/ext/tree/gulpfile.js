var gulp = require('gulp')

const task = require('../../../task')('../../../dist')


const treeJs = task('tree.js', 
	[
		'../../../externals/fancytree/dist/jquery.fancytree-all.min.js',
		'../../../externals/fancytree/3rd-party/extensions/contextmenu/js/jquery.fancytree.contextMenu.js',		
		'./src/*.js',
	], 
	{concat: 'brainjs-tree.js', isCode: true}
)

const treeCss = task('tree.css',
	[
		'../../../externals/fancytree/dist/skin-lion/ui.fancytree.min.css'
	],
	{concat: 'brainjs-tree.css', dest: 'tree'}
)

const treeImages = task('tree.images',
	[
		'../../../externals/fancytree/dist/skin-lion/*.gif'
	],
	{dest: 'tree'}
)

const treeFonts = task('tree.fonts',
	[
		'../../../externals/jquery-contextMenu/font/*'
	],
	{dest: 'css/font'}
)

const all = gulp.series(treeJs, treeCss, treeImages, treeFonts)


exports.default = all

		
exports.watch = gulp.series(all, function() {
	gulp.watch(['./src/*.js'], treeJs)

})