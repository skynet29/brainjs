$$.module.registerModule('brainjs.map.shape.polyline', function() {

	return {
		
		create: function(data) {
			return L.polyline(data.latlngs, data.style)
		},
		update: function(layer, data) {
		
			if (data.latlngs) {
				layer.setLatLngs(data.latlngs)
			}
			if (data.options) {
				layer.setStyle(data.style)
			}
			
		}

	}
});
