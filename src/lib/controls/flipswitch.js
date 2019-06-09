
$$.control.registerControl('brainjs.flipswitch', {

	props: {
		height: 50,
		width: 200,
		texts: {
			left: 'ON',
			right: 'OFF'
		}
	},

	init: function(elt) {

		const {height, width, texts} = this.props

		elt.flipswitch({
			texts,
			height, 
			width
		})
		.on('change', function(ev, settings, state) {
			//console.log('change', settings, state)
			state = (state == 'left') ? 'right' : 'left'
			elt.trigger('flipswitchchange', settings.texts[state])
		})
	},
	$events: 'flipswitchchange'

});