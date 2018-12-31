$(function() {
	$$.util.loadStyle('map/brainjs-map.css')
})


$$.control.registerControl('brainjs.map', {
	props: {
		tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		center: {lat: 51.505, lng: -0.09}, // london city
		zoom: 13
	},
	init: function(elt) {

		const div = $('<div>').css('height', '100%').appendTo(elt).get(0)

		const {center, zoom, tileUrl} = this.props

		const map = L.map(div, {center, zoom})

		L.tileLayer(tileUrl, {}).addTo(map)

	}
});
