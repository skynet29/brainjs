$$.module.registerModule('brainjs.map.shape.marker', function() {

	return {
		
		create: function(data) {

			const options = data.options || {}
			// if (data.icon) {
			// 	options.icon = mapView.getIconMarker(data.icon.type, data.icon)
			// }
			if (data.rotationAngle) {
				options.rotationAngle = data.rotationAngle
			}

			const marker = L.marker(data.latlng, options)							
			
			// if (data.popupContent) {
			// 	let popup = L.popup({autoClose: false, closeButton: true, className: 'toto', autoPan: false})
			// 	popup.setContent(processContent(data))
			// 	marker.bindPopup(popup)
			// }
																
			return marker
		},

		update: function(layer, data) {
		

			if (data.latlng) {
				layer.setLatLng(data.latlng)
			}
			// if (data.icon) {
			// 	layer.setIcon(mapView.getIconMarker(data.icon.type, data.icon))
			// }
			if (data.rotationAngle) {
				layer.setRotationAngle(data.rotationAngle)
			}	

			// if (data.popupContent) {
			// 	layer.setPopupContent(processContent(data))
			// }	

		}

	}
});

