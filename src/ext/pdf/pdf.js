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
		let pdfDoc = null


		this.renderPage = function(pageNo, scale) {
			console.log('renderPage', pageNo, scale)

			return pdfDoc.getPage(pageNo).then((page) => {
				const viewport = page.getViewport(scale)
				//console.log('viewport', viewport)
				canvas.width = viewport.width
				canvas.height = viewport.height

				return  page.render({
					canvasContext,
					viewport
				})

			})
		}



		this.openFile = function(url) {
			console.log('[pdf] openFile', url)
			return new Promise((resolve, reject) => {
				pdfjsLib.getDocument(url).then((pdfDoc_) => {
					pdfDoc = pdfDoc_
					resolve()
				})
			})

		}

		this.getNumPages = function() {
			return pdfDoc.numPages
		}


	},

	$iface: `
		openFile(url):Promise;
		getNumPages():Number;
		renderPage(pageNo, zoomLevel):Promise;
	`



});
