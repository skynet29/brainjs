$$.control.registerControl('brainjs.image', {

	props: {
		src: ''
	},

	init: function(elt) {

		const {src} = this.props

		elt.css('position', 'relative')
		$('<button>')
			.addClass('w3-button w3-blue')
			.attr('title', 'Fit image bounds')
			.css({position: 'absolute', left: '10px', top: '10px', zIndex: 1000})
			.append($('<i>').addClass('fa fa-expand'))
			.appendTo(elt)
			.on('click', fitImage)

		const div = $('<div>').css('height', '100%').appendTo(elt).get(0)

		const map = L.map(div, {
			crs: L.CRS.Simple,
			attributionControl: false,
			zoomControl: false,
			minZoom: -4,
			zoomSnap: 0.25
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

		function fitImage() {
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