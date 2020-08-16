$$.control.registerControl('brainjs.datepicker', {
	props: {
		showButtonPanel: true,
		changeYear: false,
		changeMonth: false,
		yearRange: 'c-10:c+10'
	},

	init: function(elt) {

		let options = $.extend({}, this.props)
		//console.log('options', options)

		options.onSelect = function() {
			console.log('[datepicker] onSelect')
			elt.trigger('datepickerchange')
		}

		elt.datepicker(options)

		var value = elt.val()
		if (typeof value == 'string') {
			var ms = Date.parse(value)
			//console.log('[DatePickerControl] ms', ms)
			var date = new Date(ms)
			//console.log('[DatePickerControl] date', date)
			elt.datepicker('setDate', date)
		}
			
		this.setValue = function(date) {
			elt.datepicker('setDate', date)
		}
		
		this.getValue = function() {
			//console.log('getValue')
			return elt.datepicker('getDate')
		}
	},

	$iface: `
		setValue(date: Date)
		getValue():Date
	`,
	$events: 'datepickerchange'

});

