
$$.control.registerControl('brainjs.pager', {

	props: {
		pages: []
	},
	template: {gulp_inject: './pager.html'},

	init: function(elt) {

		const pages = this.props.pages
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
					const pageCtrl = content.children('.CustomControl').last().iface()
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
			console.log('popPage', page)
			content.children('.CustomControl').last().remove()
			content.children('.CustomControl').last().show()
			ctrl.setData({showBack: stack.length > 1})
		}

		this.pushPage = function(pageName, title, data) {
			console.log('[pager] pushPage', pageName, data)

			const pageInfo = pages.find((info) => {return info.name == pageName})
			if (pageInfo == undefined) {
				console.log('[pager] unknown page', pageName)
				return
			}

			const {control, buttons} = pageInfo



			if (control != undefined) {
				content.children('.CustomControl').last().hide()


				content.addControl(control, $.extend({$pager: this}, data))

				stack.push(pageName)
				ctrl.setData({showBack: stack.length > 1, title, buttons: buttons || []})
			}
		}		

		const pageName = this.props.pages[0].name
		this.pushPage(pageName)

	}

});





