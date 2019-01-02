$$.module.registerModule('brainjs.map.shape.rectangle', function() {

	return {
		
		create: function(data) {
		
			const bounds = L.latLngBounds(data.northWest, data.southEast)
			return L.rectangle(bounds, data.style)
		},

		update: function(layer, data) {
			
			const bounds = L.latLngBounds(data.northWest, data.southEast)
			layer.setBounds(bounds)
			layer.setStyle(data.style)
		}

	}
});

