
$$.control.registerControl('brainjs.pager', {

	props: {
		rootPage: ''
	},
	template: {gulp_inject: './pager.html'},

	$iface: `popPage(data);pushPage(ctrlName, options)`,

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
					//console.log('onBack')
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

		function restorePage(data) {

			let {$ctrl, buttons, title} = stack[stack.length-1]
			let iface = $ctrl.iface()

			if (typeof iface.onReturn == 'function') {
				iface.onReturn(data)
			}
			$ctrl.show()

			ctrl.setData({showBack: stack.length > 1, title, buttons: buttons || []})
		}

		this.popPage = function(data) {
			let {$ctrl} = stack.pop()
			
			let iface = $ctrl.iface()
			//console.log('popPage', pageCtrl)
			if (typeof iface.dispose == 'function') {
				iface.dispose()
			}
			$ctrl.safeEmpty().remove()

			restorePage(data)

		}

		this.pushPage = function(ctrlName, options) {
			//console.log('[pager] pushPage', ctrlName, options)

			options = options || {}

			const desc = $$.control.getControlInfo(ctrlName)

			const buttons = desc.options.buttons

			let {title, props} = options

			getLastCtrl().hide()

			content.addControl(ctrlName, $.extend({$pager: this}, props))

			stack.push({$ctrl:getLastCtrl(), buttons, title})
			ctrl.setData({showBack: stack.length > 1, title, buttons: buttons || []})
		}	

		function getLastCtrl() {
			return content.children('.CustomControl').last()
		}	

		this.pushPage(rootPage)

	}

});





