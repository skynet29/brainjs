$$.control.registerControl('test2', {
	template: {gulp_inject: './test2.html'},
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				message: 'Hello World'
			}
		})
	}
});
