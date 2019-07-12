$$.control.registerControl('brainjs.progressbar', {

	props: {
		showPercent: false,
		initText: '',
		color: false	
	},

	init: function(elt) {

		const {showPercent, initText, color} = this.props

		const label = $('<div>')
			.addClass('progress-label')
			.text(initText)
			.setVisible(showPercent)
			.appendTo(elt)

		elt.progressbar({
		  value: false,
		  change: function() {
		    label.text( elt.progressbar( "value" ) + "%" );
		  },
		  complete: function() {
		    label.text( "Complete!" );
		  }
		})

		if (color !== false) {
			elt.find( ".ui-progressbar-value" ).css('background-color', color)			
		}

		this.setValue = function(value) {
			elt.progressbar('value', value)
		}

		this.getValue = function() {
			return elt.progressbar('value') || 0
		}		

	}

});
