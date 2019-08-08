$$.control.registerControl('brainjs.image', {

	props: {
		src: ''
	},

	template: {gulp_inject: './image.html'},

	init: function(elt) {

		const {src} = this.props

		let rotationAngle = 0

		const ctrl = $$.viewController(elt, {
			data: {
				ready: false
			},
			events: {
			}
		})

		const mapOptions = {
			crs: L.CRS.Simple,
			attributionControl: false,
			zoomControl: false,
			minZoom: -4,
			zoomSnap: 0.05,
			contextmenu: true,
			contextmenuWidth: 140,
			contextmenuItems: [
				{
					text: 'Fit Image Size',
					iconCls: 'fas fa-expand w3-text-blue',
					callback: function() {
						fitImage()
					}
				},
				{separator: true},
				{
					text: 'Rotate Right',
					iconCls: 'fas fa-redo-alt w3-text-blue',
					callback: function() {
						rotate(90)
					}
				},
				{
					text: 'Rotate Left', 
					iconCls: 'fas fa-undo-alt w3-text-blue',
					callback: function() {
						rotate(-90)
					}
				}
			]			
		}

		const map = L.map(ctrl.scope.map.get(0), mapOptions)

		let bounds
		let imageOverlay = null
		let image = null

		function load(url) {
			ctrl.setData({ready: false})

			image = new Image()
			image.onload = function() {
				ctrl.setData({ready: true})

				const width = image.width
				const height = image.height
				//console.log('width: ', width, ' height:', height)
				bounds = [[0, 0], [height, width]]

			if (imageOverlay == null) {
					imageOverlay = L.rotateImageLayer(url, bounds).addTo(map)					
				}
				else {
					imageOverlay.setBounds(bounds)
					rotationAngle = 0
					imageOverlay.setRotation(rotationAngle)
					imageOverlay.setUrl(url)
				}
				map.fitBounds(bounds)

			}
			image.src = url			
		}

		if (src != '') {
			load(src)
		}

		function fitImage() {
			if (bounds != undefined) {
				map.fitBounds(bounds)
			}
		}

		function rotate(angleDeg) {
			rotationAngle += angleDeg
			rotationAngle = (rotationAngle + 360) % 360

			const width = image.width
			const height = image.height

			if (rotationAngle == 0) {
				bounds = [[0, 0], [height, width]]
			}
			if (rotationAngle == 270) {
				bounds = [[height, 0], [width+height, width]]
			}
			if (rotationAngle == 90) {
				bounds = [[height, -height], [height-width, 0]]
			}
			if (rotationAngle == 180) {
				bounds = [[height, 0], [2*height, -width]]
			}
			//console.log('rotationAngle', rotationAngle)
			//console.log('bounds', bounds)
			imageOverlay.setRotation(rotationAngle)
			fitImage()
		}

		this.fitImage = fitImage
		this.rotate = rotate

		this.enableHandlers = function(isEnabled) {
			map._handlers.forEach((handler) => {
				if (isEnabled) {
					handler.enable()
				}
				else {
					handler.disable()
				}
			})
		}

		this.enableContextMenu = function(isEnabled) {

			if (isEnabled) {
				map.contextmenu.enable()
			}
			else {
				map.contextmenu.disable()
			}
		}

		this.invalidateSize = function() {
			map.invalidateSize()
			fitImage()
		}

		this.setData = function(data) {
			//console.log('[image] setData', data)
			if (data.src) {
				load(data.src)
			}
		}

	},
	$iface: `
		setData({src});
		invalidateSize();
		enableHandlers(isEnabled);
		enableContextMenu(isEnabled);
		fitImage();
		rotate(angleDeg)

	`

})