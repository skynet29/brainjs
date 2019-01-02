(function() {



function getIconMarker(data) {
	if (typeof data.type != 'string') {
		console.error('[brainjs.map] getIconMarker, missing type field')
		return
	}
	const func = $$.module.getModule('brainjs.map.icon.' + data.type)

	if (typeof func == 'function') {
		return func(data)
	}
}

$$.module.registerModule('brainjs.map.shape.marker', function() {

	return {
		
		create: function(data) {

			const options = data.options || {}
			if (data.icon) {
				options.icon = getIconMarker(data.icon)
			}
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
			if (data.icon) {
				layer.setIcon(getIconMarker(data.icon))
			}
			if (data.rotationAngle) {
				layer.setRotationAngle(data.rotationAngle)
			}	

			// if (data.popupContent) {
			// 	layer.setPopupContent(processContent(data))
			// }	

		}

	}
})

})();