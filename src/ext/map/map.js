$(function() {
	console.log('[brainjs.map] Leaflet version', L.version)
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
		const shapes = {}

		L.tileLayer(tileUrl, {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map)

		setTimeout(function(){
			map.invalidateSize()
		}, 100)

		map.on('click', function(ev) {
			console.log('[map] onclick', ev)
		})

		this.addShape = function(id, options) {
			options = options || {}
			if (typeof options.type != 'string') {
				console.error('[brainjs.map] addShape, missing type field')
				return
			}

			const shapeDesc = $$.module.getModule('brainjs.map.shape.' + options.type)
			if (shapeDesc && typeof shapeDesc.create == 'function') {
				console.log('[brainjs.map] addShape with id', id)
				const shape = shapeDesc.create(options)
				shape.addTo(map)
				shapes[id] = shape
			}
		}

		this.removeShape = function(id) {
	
			const shape = shapes[id]
			if (shape) {
				console.log('[brainjs.map] removeShape with id', id)
				shape.remove()
				delete shapes[id]
			}
			else {
				console.warn(`[brainjs.map] removeShape id '${id}' doesn't exist`)
			}
		}

	}
});
