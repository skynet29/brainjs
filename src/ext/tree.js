
$$.control.registerControl('brainjs.tree', {
	props: {
		source: [],
		contextMenu: null,
		options: {}
	},
	init: function (elt) {

		let options = $.extend({}, this.props.options)
		//console.log('options', options)

		options.source = this.props.source
		options.extensions = ['glyph']

		if (options.dnd) {
			options.extensions.push('dnd')
		}

		options.activate = function (ev, data) {
			//console.log('activate', data.node.title)
			elt.trigger('treeactivate', data.node)
		}

		options.click = function (ev, data) {
			//console.log('activate', data.node.title)
			elt.trigger('treeclick', data.node)
		}

		if (this.props.contextMenu != null) {
			options.extensions.push('contextMenu')

			options.contextMenu = {
				actions: (node, action) => {
					//console.log('contextMenuAction', node, action)
					node = this.getActiveNode()
					elt.trigger('treecontextmenu', { action, node })
				},
				menu: this.props.contextMenu
			}
		}


		elt.fancytree(options)

		const tree = $.ui.fancytree.getTree(elt)

		function getActiveNode() {
			return tree.getActiveNode()
		}

		function clear() {
			return elt.fancytree('clear')
		}

		function getRootNode() {
			return tree.getRootNode()
		}

		function expandAll() {
			tree.visit((node) => node.setExpanded(true))
		}

		function getNodePath(node, callback) {
			const path = node.getParentList(false, true).map((node) => {
				if (node.key == 'root') { return '/' }

				let title = node.title

				if (typeof callback == 'function') {
					title = callback(node)
				}
				return title
			})
			return path.join('/')
		}

		this.getActiveNode = getActiveNode
		this.getNodePath = getNodePath
		this.getRootNode = getRootNode
		this.expandAll = expandAll

		this.setData = function (data) {
			//console.log('[TreeCtrl] setData', data)
			if (Array.isArray(data.source)) {
				getRootNode().removeChildren()
				getRootNode().addChildren(data.source)

			}
		}

	},

	$events: 'treeactivate;treecontextmenu'
});
