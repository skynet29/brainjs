$$.control.registerControl('brainjs.pdf', {

	template: {gulp_inject: './pdf.html'},

	props: {
		worker: ''

	},

	init: function(elt) {

		const {worker} = this.props

		const ctrl = $$.viewController(elt)

		const pdfjsLib = window['pdfjs-dist/build/pdf']

		pdfjsLib.GlobalWorkerOptions.workerSrc = worker

		const canvas = ctrl.scope.canvas.get(0)
		const canvasContext = canvas.getContext('2d')
		let pageRendering = false
		let pageNumPending = null
		let pdfDoc = null
		let scale = 1
		let currentPage = 1


		function renderPage(num) {
			console.log('renderPage', num)
			console.log('width:', canvas.width, ' height:', canvas.height)
			pageRendering = true

			pdfDoc.getPage(num).then((page) => {
				const viewport = page.getViewport(scale)
				console.log('viewport', viewport)
				canvas.width = viewport.width
				canvas.height = viewport.height

				const renderTask = page.render({
					canvasContext,
					viewport
				})

				renderTask.then(() => {
					console.log('render finished')
					pageRendering = false
					if (pageNumPending != null) {
						renderPage(pageNumPending)
						pageNumPending = null
					}
				})

			})
		}

		function queueRenderPage(num) {
			if (pageRendering) {
				pageNumPending = num
			}
			else {
				renderPage(num)
			}
		}


		this.openFile = function(url) {
			console.log('[pdf] openFile', url)
			return new Promise((resolve, reject) => {
				pdfjsLib.getDocument(url).then((pdfDoc_) => {
					pdfDoc = pdfDoc_
					renderPage(currentPage)
					resolve()
				})
			})

		}

		this.getNumPages = function() {
			return pdfDoc.numPages
		}

		this.nextPage = function() {
			if (currentPage >= pdfDoc.numPages) {
				return
			}
			currentPage++
			queueRenderPage(currentPage)
		}

		this.prevPage = function() {
			if (currentPage <= 1) {
				return
			}
			currentPage--
			queueRenderPage(currentPage)
		}

		this.setZoom = function(zoom) {
			scale = zoom
			renderPage(currentPage)
		}

	},

	$iface: `
		openFile(url):Promise;
		getNumPages():Number;
		nextPage();
		prevPage();
		setZoom(zoomLevel)
	`



});
