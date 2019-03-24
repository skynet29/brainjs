$$.module.registerModule('brainjs.map.shape.sector', function() {

	return {

		create: function(data) {
			var options = $.extend({radius: data.radius}, data.options)
			var sector = L.semiCircle(data.latlng, options)
			sector.setDirection(data.direction, data.size)
			return sector
		},
		update: function(layer, data) {
			if (data.latlng) {
				layer.setLatLng(data.latlng)
			}
			if (data.radius) {
				layer.setRadius(data.radius)
			}
			if (data.direction && data.size) {
				layer.setDirection(data.direction, data.size)
			}
			if (data.options) {
				layer.setStyle(data.options)
			}
		}		
	}
});

