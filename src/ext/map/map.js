$(function() {
	console.log('[brainjs.map] Leaflet version', L.version)
	$$.util.loadStyle('map/brainjs-map.css')
})



$$.control.registerControl('brainjs.map', {
	props: {
		tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		center: {lat: 51.505, lng: -0.09}, // london city
		zoom: 13,
		layers: {},
		scale: false,
		coordinates: false
	},
	init: function(elt) {

		const div = $('<div>').css('height', '100%').appendTo(elt).get(0)

		const {center, zoom, tileUrl} = this.props

		const map = L.map(div, {center, zoom, closePopupOnClick: false})
		const shapes = {}
		const layers = {}

		const confLayer = {}

		for(let layerName in this.props.layers) {
			const {label, visible} = this.props.layers[layerName]
			const layer = new L.FeatureGroup()
			layers[layerName] = layer
			confLayer[label] = layer
			if (visible === true) {
				map.addLayer(layer)
			}
		}

		if (Object.keys(confLayer).length != 0) {
			L.control.layers({}, confLayer).addTo(map)
		}	

		if (this.props.scale) {			
			L.control.scale({imperial: false, position: 'bottomright'}).addTo(map)
		}

		if (this.props.coordinates) {
			L.control.coordinates({
				position: 'bottomleft',
				useLatLngOrder: true,
				nableUserInput: false,
				decimals: 5					
			}).addTo(map)
		}


		L.tileLayer(tileUrl, {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map)

		setTimeout(function(){
			map.invalidateSize()
		}, 100)

		map.on('click', function(ev) {
			//console.log('[map] onclick', ev)
			elt.trigger('mapclick', ev.latlng)
		})

		this.updateShape = function(id, options) {
			const shape = shapes[id]
			if (shape) {
				const shapeDesc = $$.module.getModule('brainjs.map.shape.' + shape.type)
				if (shapeDesc && typeof shapeDesc.update == 'function') {

					console.log('[brainjs.map] updateShape with id', id)
					shapeDesc.update(shape, options)
				}										
			}
			else {
				throw `[brainjs.map] updateShape id '${id}' doesn't exist`
			}
		}

		this.addShape = function(id, options) {
			if (shapes[id]) {
				throw `[brainjs.map] addShape id '${id}' already exist`
			}
			options = options || {}

			if (typeof options.type != 'string') {
				console.error('[brainjs.map] addShape, missing type field')
				return
			}

			const shapeDesc = $$.module.getModule('brainjs.map.shape.' + options.type)

			let layer = map
			if (typeof options.layer == 'string') {
				layer = layers[options.layer]
				if (layer == undefined) {
					throw `layer '${options.layer}' doesn't exist`
				}
			}

			if (shapeDesc && typeof shapeDesc.create == 'function') {

				console.log('[brainjs.map] addShape with id', id)
				shape = shapeDesc.create(options)
				shape.type = options.type
				shape.addTo(layer)
				shape.layer = layer
				shapes[id] = shape
			}					
		}

		this.removeShape = function(id) {
	
			const shape = shapes[id]
			if (shape) {
				console.log('[brainjs.map] removeShape with id', id)
				shape.removeFrom(shape.layer)
				delete shapes[id]
			}
			else {
				console.warn(`[brainjs.map] removeShape id '${id}' doesn't exist`)
			}
		}

	}
});
