$$.control.registerControl('test1', {
	template: {gulp_inject: './test1.html'},
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
				message: 'Hello World'
			}
		})
	}
});
