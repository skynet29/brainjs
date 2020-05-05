$$.control.registerControl('brainjs.pdf', {

	props: {
		worker: ''

	},

	init: function(elt) {

		const {worker} = this.props

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

		const pdfjsLib = window['pdfjs-dist/build/pdf']

		pdfjsLib.GlobalWorkerOptions.workerSrc = worker

		elt.css({'text-align': 'center', width: '100%'})

		const canvas = $('<canvas>').get(0)
		const canvasContext = canvas.getContext('2d')
		let pdfDoc = null
		let scale = 1.5
		let currentPage = 1



		function renderPage(pageNo) {
			//console.log('renderPage', pageNo)

			return pdfDoc.getPage(pageNo)
				.then((page) => {
					const viewport = page.getViewport(scale)
					//console.log('viewport', viewport)
					canvas.width = viewport.width
					canvas.height = viewport.height

					return page.render({
						canvasContext,
						viewport
					})
				})

				.then(() => {
					const dataUrl = canvas.toDataURL('image/png')

					//console.log('width: ', width, ' height:', height)
					bounds = [[0, 0], [canvas.height, canvas.width]]
					if (imageOverlay == null) {
						imageOverlay = L.imageOverlay(dataUrl, bounds).addTo(map)					
					}
					else {
						imageOverlay.setBounds(L.latLngBounds(bounds))
						imageOverlay.setUrl(dataUrl)
					}
					map.fitBounds(bounds)					
					return pageNo
				})
		}


		this.nextPage = function() {
			if (currentPage < pdfDoc.numPages) {
				currentPage++
				return renderPage(currentPage)
			}
			return Promise.resolve(currentPage)
		}

		this.prevPage = function() {
			if (currentPage > 1) {
				currentPage--
				return renderPage(currentPage)
			}
			return Promise.resolve(currentPage)
		}

		this.openFile = function(url) {
			//console.log('[pdf] openFile', url)
			return pdfjsLib.getDocument(url).then((pdfDoc_) => {
				pdfDoc = pdfDoc_
				return renderPage(currentPage).then(() => {
					return pdfDoc.numPages
				})
			})
		}

		this.fit = function() {
			if (bounds != undefined) {
				map.fitBounds(bounds)
			}
		}

	},

	$iface: `
		openFile(url):Promise<numPages>;
		prevPage():Promise<currentPage>;
		nextPage():Promise<currentPage>;
		fit()
	`



});
