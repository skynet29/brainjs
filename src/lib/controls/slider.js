$$.control.registerControl('brainjs.slider', {

	props: {
		max: 100,
		min: 0, 
		step: 1,
		orientation: 'horizontal',
		range: 'min'			
	},

	init: function(elt) {


	//console.log('[SliderControl] value', elt.val())
		let options = $.extend({}, this.props)
		var value = elt.val()

		if (Array.isArray(value)) {
			options.values = value
			options.range = true
		}

		if (typeof value == 'string') {
			options.value = value
		}

		//console.log('[SliderControl] options', options)

		options.change = function(ev, ui) {
			elt.trigger('sliderchange', [ui.values || ui.value])
		}

		options.slide = function(ev, ui) {
			//console.log('[SliderControl] slide', ui.values || ui.value)
			elt.trigger('input', [ui.values || ui.value])
		}

		elt.slider(options)

		this.getValue = function() {
			//console.log('[SliderControl] getValue')
			return elt.slider((options.range === true) ? 'values' : 'value') 
		}

		this.setValue = function(value) {
			//console.log('[SliderControl] setValue')
			elt.slider((options.range === true) ? 'values' : 'value', value)
		}

		this.setData = function(data) {
			console.log('[slider] setData', data)
			if (data.max != undefined) {
				elt.slider('option', 'max', data.max)
			}
			if (data.min != undefined) {
				elt.slider('option', 'min', data.min)
			}
			if (data.step != undefined) {
				elt.slider('option', 'step', data.step)
			}
		}


	}

});
