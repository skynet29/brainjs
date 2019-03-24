$$.module.registerModule('brainjs.map.shape.circleMarker', function() {

	return {

		create: function(data) {
			
			return L.circleMarker(data.latlng, data.options)
		},
		update: function(layer, data) {
		
			if (data.latlng) {
				layer.setLatLng(data.latlng)
			}	
			
			if (data.options) {
				layer.setStyle(data.options)
			}
			
		}				
	}
});
