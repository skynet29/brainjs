$$.control.registerControl('test3', {
	template: {gulp_inject: './test3.html'},
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				clients: ['Marc', 'Brigitte']
			}
		})
	}
});
