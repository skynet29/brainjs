$$.control.registerControl('brainjs.milsymbol', {
	props: {
		size: 20,
		sidc: '',
		name: ''
	},

	init: function(elt) {


		var img = $('<img>').appendTo(elt)


		this.setData = function(data) {
			//console.log('[milsymbol] setData', data)
			$.extend(this.props, data)

			const symbol = new ms.Symbol(this.props.sidc, {
				size: this.props.size,
				uniqueDesignation: this.props.name
			})

			img.attr('src', symbol.toDataURL())
		}

		this.setData()

	},
	$iface: 'setData(data)'
});

$$.module.registerModule('brainjs.map.icon.milsymbol', function() {

	return function(data) {

		var symbol = new ms.Symbol(data.sidc, {
			size: data.size || 20,
			uniqueDesignation: data.name
		})

		var anchor = symbol.getAnchor()

		return L.icon({
			iconUrl: symbol.toDataURL(),
			iconAnchor: [anchor.x, anchor.y],
		})			
	}
});




