
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

		let value = elt.val()
		if (value == '') {
			value = texts.right
		}
		//console.log('value', value)
		const init = (value == texts.left ? 'right' : 'left')

		elt.flipswitch({
			texts,
			height, 
			width,
			init
		})
		.on('change', function(ev, settings, state) {
			//console.log('change', settings, state)
			state = (state == 'left') ? 'right' : 'left'
			value = settings.texts[state]
			elt.trigger('flipswitchchange', value)
		})

		this.getValue = function() {
			//console.log('getValue', value)
			return value
		}

		this.setValue = function(val) {
			console.log('setValue', val)
			value = val
		}
	},
	$events: 'flipswitchchange'

});