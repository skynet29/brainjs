$$.module.registerModule('brainjs.map.shape.circle', function() {

	return {
		
		create: function(data) {
			return L.circle(data.latlng, data.radius, data.style)
		},
		update: function(layer, data) {
		
			if (data.latlng) {
				layer.setLatLng(data.latlng)
			}	
			
			if (data.radius) {
				layer.setRadius(data.radius)
			}
			if (data.options) {
				layer.setStyle(data.style)
			}
			
		}

	}
});

