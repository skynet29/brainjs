
$$.control.registerControl('brainjs.tree', {
	props: {
		source: [],
		contextMenu: null,
		options: {}
	},
	init: function(elt) {

		let options = $.extend({}, this.props.options)
		console.log('options', options)

		options.source = this.props.source
		options.extensions = []
		options.activate = function(ev, data) {
			//console.log('activate', data.node.title)
			elt.trigger('treeactivate')
		}

		if (this.props.contextMenu != null) {
			options.extensions.push('contextMenu')

			options.contextMenu = {
				actions: (node, action) => {
					//console.log('contextMenuAction', node, action)
					node = this.getActiveNode()
					elt.trigger('treecontextmenu', {action, node})
				},
				menu: this.props.contextMenu
			}
		}


		elt.fancytree(options)


		this.getActiveNode = function() {
			return elt.fancytree('getActiveNode')
		}

		this.getRootNode = function() {
			return elt.fancytree('getRootNode')
		}

	}
});
