$$.control.registerControl('brainjs.pdf', {

	props: {
		worker: ''

	},

	init: function(elt) {

		const {worker} = this.props

		const ctrl = $$.viewController(elt)

		const pdfjsLib = window['pdfjs-dist/build/pdf']

		pdfjsLib.GlobalWorkerOptions.workerSrc = worker

		elt.css({'text-align': 'center', width: '100%'})

		const canvas = $('<canvas>').appendTo(elt).get(0)
		const canvasContext = canvas.getContext('2d')
		let pdfDoc = null
		let scale = 1
		let currentPage = 1



		function renderPage(pageNo) {
			//console.log('renderPage', pageNo)

			return pdfDoc.getPage(pageNo).then((page) => {
				const viewport = page.getViewport(scale)
				console.log('viewport', viewport)
				canvas.width = viewport.width
				canvas.height = viewport.height

				return  page.render({
					canvasContext,
					viewport
				}).then(() => {
					return pageNo
				})

			})
		}

		this.setZoomLevel = function(zoomLevel) {
			scale = zoomLevel
			return renderPage(currentPage)
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
			console.log('[pdf] openFile', url)
			return pdfjsLib.getDocument(url).then((pdfDoc_) => {
				pdfDoc = pdfDoc_
				return renderPage(currentPage).then(() => {
					return pdfDoc.numPages
				})
			})
		}

	},

	$iface: `
		openFile(url):Promise(numPages);
		prevPage():Promise(currentPage);
		nextPage():Promise(currentPage);
		setZoomLevel(zoomLevel):Promise
	`



});
