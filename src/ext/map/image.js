$$.control.registerControl('brainjs.image', {

	props: {
		src: ''
	},

	init: function(elt) {

		const {src} = this.props

		const div = $('<div>').css('height', '100%').appendTo(elt).get(0)

		const map = L.map(div, {
			crs: L.CRS.Simple,
			attributionControl: false,
			zoomControl: false,
			minZoom: -4
		})

		map.on('zoom', () => {
			console.log('zoom', map.getZoom())
		})

		let bounds
		let imageOverlay = null



		function load(url) {
			const image = new Image()
			image.onload = function() {
				const width = image.width
				const height = image.height

				//console.log('width: ', width, ' height:', height)
				bounds = [[0, 0], [height, width]]
				if (imageOverlay == null) {
					imageOverlay = L.imageOverlay(url, bounds).addTo(map)					
				}
				else {
					imageOverlay.setBounds(bounds)
					imageOverlay.setUrl(url)
				}
				map.fitBounds(bounds)

			}
			image.src = url			
		}

		if (src != '') {
			load(src)
		}

		this.fitImage = function() {
			if (bounds != undefined) {
				map.fitBounds(bounds)
			}
		}

		this.setData = function(data) {
			console.log('[image] setData', data)
			if (data.src) {
				load(data.src)
			}
		}

	}

})