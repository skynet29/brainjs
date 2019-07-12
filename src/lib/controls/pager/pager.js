
$$.control.registerControl('brainjs.pager', {

	props: {
		rootPage: ''
	},
	template: {gulp_inject: './pager.html'},

	$iface: `popPage(data);pushPage(ctrlName, options)`,

	init: function(elt) {

		const {rootPage} = this.props

		const ctrl = $$.viewController(elt, {
			data: {
				showBack: false,
				title: '',
				buttons: []
			},
			events: {
				onBack: function(ev) {
					//console.log('onBack')
					restorePage(true)
				},
				onAction: function(ev) {
					const cmd = $(this).data('cmd')
					//console.log('onAction', cmd)
					const pageCtrl = curInfo.ctrl.iface()
					if (typeof pageCtrl.onAction == 'function') {
						pageCtrl.onAction(cmd)
					}
				}
			}
		})

		const content = ctrl.scope.content
		const stack = []
		let curInfo = null


		function restorePage(isBack, data) {
			
			const iface = curInfo.ctrl.iface()
			//console.log('popPage', pageCtrl)
			if (typeof iface.dispose == 'function') {
				iface.dispose()
			}
			curInfo.ctrl.safeEmpty().remove()
			if (isBack) {
				if (typeof curInfo.onBack == 'function') {
					curInfo.onBack()
				}
			}
			else if (typeof curInfo.onReturn == 'function') {
				curInfo.onReturn(data)
			}

			curInfo = stack.pop()			
			curInfo.ctrl.show()
			const {title, buttons} = curInfo
			ctrl.setData({showBack: stack.length > 0, title, buttons})

		}

		this.popPage = function(data) {
			return restorePage(false, data)
		}

		this.pushPage = function(ctrlName, options) {
			//console.log('[pager] pushPage', ctrlName, options)


			if (curInfo != null) {
				curInfo.ctrl.hide()
				stack.push(curInfo)
			}

			options = options || {}

			const desc = $$.control.getControlInfo(ctrlName)

			const buttons = desc.options.buttons || []

			let {title, props, onReturn, onBack} = options

			curInfo = {title, buttons, onReturn, onBack}

			curInfo.ctrl = content.addControl(ctrlName, $.extend({$pager: this}, props))

			ctrl.setData({showBack: stack.length > 0, title, buttons})
		}	


		this.pushPage(rootPage)

	}

});





