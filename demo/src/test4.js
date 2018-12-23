$$.control.registerControl('test4', {
	template: {gulp_inject: './test4.html'},
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				clients: ['Marc', 'Brigitte']
			},
			events: {
				onAddClient: function(ev) {
					console.log('onAddClient')
					ev.preventDefault()
					ctrl.model.clients.push($(this).getFormData().name)
					ctrl.update('clients')
					$(this).resetForm()

				}
			}
		})
	}
});
