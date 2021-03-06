$$.module.registerModule('brainjs.map.shape.polygon', function() {

	return {
		
		create: function(data) {
			return L.polygon(data.latlngs, data.style)
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
			data.latlngs = layer.getLatLngs()[0]
		}		

	}
});

