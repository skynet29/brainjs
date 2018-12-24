$$.control.registerControl('brainjs.navbar', {
	props: {
		activeColor: 'w3-green',
		type: 'horizontal'
	},
	init: function(elt) {

		const {activeColor, type} = this.props

		elt.addClass((type == 'vertical') ? 'w3-bar-block': 'w3-bar')
		elt.children('a').each(function() {
			$(this).addClass('w3-bar-item w3-button')
		})

		const newRoute = $$.getNewRoute()
		elt.children(`a[href="#${newRoute}"]`).addClass(activeColor)

		$(window).on('popstate', function(evt) {
			//console.log('[NavbarControl] routeChange', newRoute)
			const newRoute = $$.getNewRoute()

			elt.children(`a.${activeColor}`).removeClass(activeColor)	
			elt.children(`a[href="#${newRoute}"]`).addClass(activeColor)

		})	

	}

});






