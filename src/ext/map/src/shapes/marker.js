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
			
			if (data.popup) {
				const content = data.popup.content
				if (typeof content == 'string') {
					//delete data.popup.content
					const options = $.extend({autoClose: false, closeButton: true, autoPan: false}, data.popup)
					let popup = L.popup(options)
					popup.setContent(content)
					marker.bindPopup(popup)
	
				}
			}




			if (typeof data.tooltip == 'string') {
				marker.bindTooltip(data.tooltip).openTooltip()
			}
																
			return marker
		},

		update: function(layer, data) {
		
			//console.log('updateMarker', data)
			if (data.latlng) {
				layer.setLatLng(data.latlng)
			}
			if (data.icon) {
				layer.setIcon(getIconMarker(data.icon))
			}
			if (data.rotationAngle) {
				layer.setRotationAngle(data.rotationAngle)
			}	

			if (data.popup && data.popup.content) {
				layer.setPopupContent(data.popup.content)
			}	

		},
		getData: function(layer, data) {
			data.latlng = layer.getLatLng()
		}
	}
})

})();