$$.control.registerControl('brainjs.pdf', {

	props: {
		worker: ''

	},

	init: function (elt) {

		const { worker } = this.props

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

		elt.css({ 'text-align': 'center', width: '100%' })

		const canvas = document.createElement('canvas')
		const canvasContext = canvas.getContext('2d')
		let pdfDoc = null
		let scale = 1.5
		let currentPage = 1



		async function renderPage(pageNo) {
			//console.log('renderPage', pageNo)

			const page = await pdfDoc.getPage(pageNo)
			const viewport = page.getViewport(scale)
			//console.log('viewport', viewport)
			canvas.width = viewport.width
			canvas.height = viewport.height


			await page.render({
				canvasContext,
				viewport
			})

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
		}


		this.nextPage = function () {
			if (currentPage < pdfDoc.numPages) {
				currentPage++
				return renderPage(currentPage)
			}
			return Promise.resolve(currentPage)
		}

		this.prevPage = function () {
			if (currentPage > 1) {
				currentPage--
				return renderPage(currentPage)
			}
			return Promise.resolve(currentPage)
		}

		this.openFile = async function (url) {
			//console.log('[pdf] openFile', url)
			pdfDoc = await pdfjsLib.getDocument(url)
			await renderPage(currentPage)
			return pdfDoc.numPages
		}

		this.fit = function () {
			if (bounds != undefined) {
				map.fitBounds(bounds)
			}
		}

		this.print = async function(options) {

			options = options || {}
			const title = options.title || ''
			const canvas = document.createElement('canvas')
			const canvasContext = canvas.getContext('2d')

			
			const ifr = document.createElement('iframe')
			ifr.src = 'about:blank'
			ifr.style = 'height: 0px; width: 0px; position: absolute'
			document.body.appendChild(ifr)

			const html = []
			html.push(`<html><head><title>${title}</title></head>`)
			html.push('<body>')
			html.push(`
				<style>
					@media print {
						@page {
							margin: 1cm;
						}
					}
				</style>
			`)
		
			for(let i = 1; i <= pdfDoc.numPages; i++) {
				const page = await pdfDoc.getPage(i)
				const viewport = page.getViewport(scale)
				//console.log('viewport', viewport)
				canvas.width = viewport.width
				canvas.height = viewport.height
	
	
				await page.render({
					canvasContext,
					viewport
				})
	
				html.push(`<img src=${canvas.toDataURL('image/png')}>`)
			}
			
			html.push('<body>')
			const documentToWriteTo = ifr.contentWindow.document
			documentToWriteTo.open()
			documentToWriteTo.write(html.join(''))
			documentToWriteTo.close()
	
		
			ifr.focus()
			setTimeout(() => {
			  ifr.contentWindow.print()
			  ifr.parentElement.removeChild(ifr)
			}, 200)
			
		
		}

	},

	$iface: `
		openFile(url):Promise<numPages>;
		prevPage():Promise<currentPage>;
		nextPage():Promise<currentPage>;
		fit()
	`



});
