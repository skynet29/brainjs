$$.control.registerControl('test5', {
	template: {gulp_inject: './test5.html'},
	init: function(elt) {
		const ctrl = $$.viewController(elt.children(), {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ]
			}
		})
	}
});
