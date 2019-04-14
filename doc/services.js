$$.control.registerControl('$services', {

	template: {gulp_inject: './services.html'},

	init: function(elt) {

		const services = $$.service.getServices().map((name) => {
			return {name, url: '#/services/' + name}
		})		

		const ctrl = $$.viewController(elt, {
			
			data: {
				services
			}
		})		
	}

});


