
$$.control.registerControl('brainjs.map', {
	props: {
		tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		center: { lat: 51.505, lng: -0.09 }, // london city
		zoom: 13,
		layers: {},
		scale: false,
		coordinates: false,
		plugins: {},
		contextMenu: {},
		shapes: {}
	},
	init: function (elt) {

		const div = $('<div>').css('height', '100%').appendTo(elt).get(0)

		const { center, zoom, tileUrl, contextMenu } = this.props

		const mapOptions = {
			center,
			zoom,
			closePopupOnClick: false,
			contextmenu: true,
			//contextmenuWidth: 200,
			attributionControl: false
		}

		mapOptions.contextmenuItems = Object.keys(contextMenu).map(function (cmd) {
			const text = contextMenu[cmd].name
			if (text === '--') {
				return { separator: true }
			}
			return {
				text,
				callback: function (ev) {
					elt.trigger('mapcontextmenu', { cmd, latlng: ev.latlng })
				}
			}

		})

		const map = L.map(div, mapOptions)
		const shapes = {}
		const layers = {}

		const confLayer = {}

		for (let layerName in this.props.layers) {
			const { label, visible } = this.props.layers[layerName]
			const layer = new L.FeatureGroup()
			layers[layerName] = layer
			if (typeof label == 'string') {
				confLayer[label] = layer
			}

			if (visible === true) {
				map.addLayer(layer)
			}
		}

		if (Object.keys(confLayer).length != 0) {
			L.control.layers({}, confLayer).addTo(map)
		}

		if (this.props.scale) {
			L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map)
		}

		if (this.props.coordinates) {
			L.control.coordinates({
				position: 'bottomleft',
				useLatLngOrder: true,
				enableUserInput: false,
				decimals: 5
			}).addTo(map)
		}

		const data = { elt, map, layers, shapes }

		for (let pluginName in this.props.plugins) {
			const func = $$.module.getModule('brainjs.map.plugin.' + pluginName)
			const config = this.props.plugins[pluginName]
			if (typeof func == 'function') {
				console.log(`[brainjs.map] instance plugin '${pluginName}' with config`, config)
				func(data, config)
			}
		}

		L.tileLayer(tileUrl).addTo(map)

		setTimeout(function () {
			map.invalidateSize()
		}, 100)

		map.on('click', function (ev) {
			//console.log('[map] onclick', ev)
			elt.trigger('mapclick', { latlng: ev.latlng })
		})

		this.getShapes = function () {
			return Object.keys(shapes)
		}

		this.updateShape = function (id, options) {
			const shape = shapes[id]
			if (shape) {
				const shapeDesc = $$.module.getModule('brainjs.map.shape.' + shape.type)
				if (shapeDesc && typeof shapeDesc.update == 'function') {

					//console.log('[brainjs.map] updateShape with id', id)
					shapeDesc.update(shape, options)
					$.extend(shape.info, options)
				}
			}
			else {
				throw `[brainjs.map] updateShape id '${id}' doesn't exist`
			}
		}

		this.addShape = function (id, data) {
			if (shapes[id]) {
				throw `[brainjs.map] addShape id '${id}' already exist`
			}
			data = data || {}

			if (typeof data.type != 'string') {
				console.error('[brainjs.map] addShape, missing type field')
				return
			}

			const shapeDesc = $$.module.getModule('brainjs.map.shape.' + data.type)

			let layer = map
			if (typeof data.layer == 'string') {
				layer = layers[data.layer]
				if (layer == undefined) {
					throw `layer '${data.layer}' doesn't exist`
				}
			}

			if (shapeDesc && typeof shapeDesc.create == 'function') {

				console.log('[brainjs.map] addShape with id', id)
				if (data.contextMenu) {
					data.options = {
						contextmenu: true,
						contextmenuInheritItems: false,
						contextmenuItems: Object.entries(data.contextMenu).map((item) => {
							const [cmd, info] = item
							const text = info.name
							if (text === '--') {
								return { separator: true }
							}
							return {
								text,
								iconCls: info.iconCls,
								callback: function (ev) {
									elt.trigger('mapshapecontextmenu', { id, cmd, latlng: ev.latlng })
								}
							}
	
						})
	
					}
				}

				shape = shapeDesc.create(data)
				shape.type = data.type
				shape.ownlayer = layer
				shape.info = data
				shape.id = id
				shapes[id] = shape
				if (data.contextMenu == undefined) {
					shape.on('contextmenu', function (ev) {
						const data = { id, latlng: ev.latlng }
						if (typeof ev.target.getLatLng == 'function') {
							data.pos = map.latLngToContainerPoint(ev.target.getLatLng())
						}
						elt.trigger('mapshapecontextmenu', data)
					})

				}
				else {
					delete data.contextMenu
				}
				shape.addTo(layer)
				if (data.popup) {
					shape.openPopup()
				}
			}
		}

		this.removeShape = function (id) {

			const shape = shapes[id]
			if (shape) {
				console.log('[brainjs.map] removeShape with id', id)
				shape.removeFrom(shape.ownlayer)
				delete shapes[id]
			}
			else {
				console.warn(`[brainjs.map] removeShape id '${id}' doesn't exist`)
			}
		}


		this.getShapeInfo = function (id) {

			const shape = shapes[id]
			if (shape) {
				return shape.info
			}
			else {
				console.warn(`[brainjs.map] removeShape id '${id}' doesn't exist`)
			}
		}

		this.enableHandlers = function (enabled) {
			map._handlers.forEach(function (handler) {
				if (enabled)
					handler.enable()
				else
					handler.disable()
			})
		}

		this.getZoom = function () {
			return map.getZoom()
		}

		this.getCenter = function () {
			return map.getCenter()
		}

		this.panTo = function (latlng) {
			return map.panTo(latlng, { animate: true })
		}

		this.flyTo = function (latlng, zoom) {
			return map.flyTo(latlng, zoom, { animate: true })
		}

		for (let shapeId in this.props.shapes) {
			this.addShape(shapeId, this.props.shapes[shapeId])
		}

	},

	$iface: `
		getShapes():[shapeId];
		updateShape(shapeId, options);
		addShape(shapeId, options);
		removeShape(shapeId);
		getShapeInfo(shapeId): ShapeInfo;
		enableHandlers(enabled);
		getZoom():ZoomLevel;
		getCenter(): LatLng;
		panTo(latlng);
		flyTo(latlng, zoom)
		`,

	$events: `mapcontextmenu;mapclick;mapshapecontextmenu`

});
