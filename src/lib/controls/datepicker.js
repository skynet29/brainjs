$$.control.registerControl('brainjs.datepicker', {
	props: {
		showButtonPanel: true
	},

	init: function(elt) {

		let options = $.extend({}, this.props)

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

	$iface: 'setValue(date);getValue():Date',
	$events: 'datepickerchange'

});

