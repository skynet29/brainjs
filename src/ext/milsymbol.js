$$.control.registerControl('brainjs.milsymbol', {
	props: {
		size: 20,
		sidc: '',
		name: ''
	},

	init: function(elt) {

		let data = this.props

		function createSymbolCode() {
			//console.log('createSymbolCode', options)


			var symbol = new ms.Symbol(data.sidc, {
				size: data.size,
				uniqueDesignation: data.uniqueDesignation
			})
			return symbol
		}

		var symbol = createSymbolCode()
		var img = $('<img>')
			.attr('src', symbol.toDataURL())
			.appendTo(elt)


		this.setSize = function(size) {
			data.size = size
			symbol.setOptions({size})
			img.attr('src', symbol.toDataURL())
		}

		this.setName = function(name) {
			data.name = name
			symbol.setOptions({uniqueDesignation: name})
			img.attr('src', symbol.toDataURL())
		}

		this.setSidc = function(sidc) {
			data.sidc = sidc
			symbol = createSymbolCode()
			img.attr('src', symbol.toDataURL())
		}


	}
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




