$$.module.registerModule('brainjs.map.shape.polyline', function() {

	return {
		
		create: function(data) {
			return L.polyline(data.latlngs, data.style)
		},
		update: function(layer, data) {
		
			if (data.latlngs) {
				layer.setLatLngs(data.latlngs)
			}
			if (data.style) {
				layer.setStyle(data.style)
			}
			
		},
		getData: function(layer, data) {
			data.latlngs = layer.getLatLngs()
		}	
	}
});

