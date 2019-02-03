$$.control.registerControl('$controls', {

	template: {gulp_inject: './controls.html'},

	init: function(elt) {

		const ctrls = $$.control.getControls().filter((name) => name.charAt(0) != '$').map((name) => {
			return {name, url: '#/controls/' + name}
		})

		const ctrl = $$.viewController(elt, {
			
			data: {
				ctrls
			}
		})		
	}

});


