
$$.control.registerControl('brainjs.flipswitch', {

	init: function(elt) {


		const $input = $('<input>', {type: 'checkbox'})
		.appendTo(elt)
		elt.on('click', function(ev) {
			const newState = !$input.getValue()
			$input.setValue(newState)
			ev.stopPropagation()
			elt.trigger('flipswitchchange', newState)
		})
		$('<span>').addClass('slider').appendTo(elt)



		this.getValue = function() {
			//console.log('getValue', value)
			return $input.getValue()
		}

		this.setValue = function(val) {
			console.log('setValue', val)
			$input.setValue(val)
		}
	},
	$events: 'flipswitchchange'

});