
$$.control.registerControl('brainjs.pager', {

	props: {
		rootPage: ''
	},
	template: {gulp_inject: './pager.html'},

	init: function(elt) {

		const {rootPage} = this.props
		const iface = this

		const ctrl = $$.viewController(elt, {
			data: {
				showBack: false,
				title: '',
				buttons: []
			},
			events: {
				onBack: function(ev) {
					console.log('onBack')
					iface.popPage()
				},
				onAction: function(ev) {
					const cmd = $(this).data('cmd')
					//console.log('onAction', cmd)
					const pageCtrl = getLastCtrl().iface()
					if (typeof pageCtrl.onAction == 'function') {
						pageCtrl.onAction(cmd)
					}
				}
			}
		})

		const content = ctrl.scope.content
		const stack = []

		this.popPage = function() {
			const page = stack.pop()
			console.log('popPage', page.attr('id'))
			const pageCtrl = page.iface()
			if (typeof pageCtrl.dispose == 'function') {
				pageCtrl.dispose()
			}
			page.remove()
			getLastCtrl().show()
			ctrl.setData({showBack: stack.length > 1})
		}

		this.pushPage = function(ctrlName, options) {
			console.log('[pager] pushPage', ctrlName, options)

			options = options || {}

			let {buttons, title, props} = options

			getLastCtrl().hide()

			content.addControl(ctrlName, $.extend({$pager: this}, props))

			stack.push(getLastCtrl())
			ctrl.setData({showBack: stack.length > 1, title, buttons: buttons || []})
		}	

		function getLastCtrl() {
			return content.children('.CustomControl').last()
		}	

		this.pushPage(rootPage)

	}

});





