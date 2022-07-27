$$.module.registerModule('brainjs.map.shape.rectangle', function() {

	return {
		
		create: function(data) {
		
			const bounds = L.latLngBounds(data.northWest, data.southEast)
			return L.rectangle(bounds, data.style)
		},

		update: function(layer, data) {
			
			if (data.northWest && data.southEast) {
				const bounds = L.latLngBounds(data.northWest, data.southEast)
				layer.setBounds(bounds)
			}
			if (data.style) {
				layer.setStyle(data.style)
			}
		},
		getData: function(layer, data) {
			const bounds = layer.getBounds()
			data.northWest =  bounds.getNorthWest()
			data.southEast =  bounds.getSouthEast()
		}
	}
});

