$$.module.registerModule('brainjs.map.icon.font', function() {

	return function(data) {
		data = $.extend({
			className: 'fa fa-home',
			fontSize: 10,
			color: 'green'
		}, data)

		const fontSize = data.fontSize

		var template = `
			<i class="${data.className}" style="color: ${data.color}; font-size: ${fontSize}px"></i>
		`
		return L.divIcon({
			className: 'fontMarker',
			iconSize: [fontSize, fontSize],
			iconAnchor: [fontSize/2, fontSize/2],
			html: template
		})	
	}	
})