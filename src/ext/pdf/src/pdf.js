
$$.control.registerControl('brainjs.pdf', {

	props: {
		worker: ''

	},

	init: function (elt) {

		const { worker } = this.props

		const zoomStep = 0.125


		const div = $('<div>').css({ height: '100%', width: '100%', overflow: 'scroll', 'text-align': 'center' }).appendTo(elt).get(0)


		const pdfjsLib = window['pdfjs-dist/build/pdf']
		console.log('pdfVersion', pdfjsLib.version)

		pdfjsLib.GlobalWorkerOptions.workerSrc = worker

		elt.css({ flex: '1', overflow: 'hidden' })

		const canvas = document.createElement('canvas')
		div.appendChild(canvas)
		const canvasContext = canvas.getContext('2d')
		let pdfDoc = null
		let scale = 1
		let currentPage = 1
		let rotation = 0

		let pageWidth
		let pageHeight

		async function renderPage(pageNo) {
			//console.log('renderPage', pageNo)

			const page = await pdfDoc.getPage(pageNo)
			const { width, height } = page.getViewport({ scale: 1, rotation })
			pageWidth = width
			pageHeight = height
			const viewport = page.getViewport({ scale, rotation })
			canvas.width = viewport.width
			canvas.height = viewport.height


			await page.render({
				canvasContext,
				viewport
			}).promise

			return pageNo
		}

		function refresh() {
			return renderPage(currentPage)
		}

		this.refresh = refresh

		this.rotateLeft = function () {
			rotation = (rotation - 90) % 360
			//console.log('rotateLeft', rotation)
			return refresh()
		}

		this.rotateRight = function () {
			rotation = (rotation + 90) % 360
			//console.log('rotateRight', rotation)
			return refresh()
		}


		this.zoomOut = function () {
			scale = Math.max(zoomStep, scale - zoomStep)
			return refresh()
		}

		this.zoomIn = function () {
			scale += zoomStep
			return refresh()
		}

		this.nextPage = function () {
			return this.setPage(currentPage + 1)
		}

		this.setPage = function (pageNo) {
			if (pageNo > 0 && pageNo <= pdfDoc.numPages) {
				currentPage = pageNo
				return refresh()
			}
			return Promise.resolve(currentPage)
		}

		this.prevPage = function () {
			return this.setPage(currentPage - 1)
		}

		this.openFile = async function (url) {
			//console.log('[pdf] openFile', url, pwd)
			const loadingTask = pdfjsLib.getDocument(url)
			loadingTask.onPassword = async function (retFct, reason) {
				//console.log({ retFct, reason })
				const title = (reason == 1) ? 'Password needed' : 'Bad password'
				const pwd = await $$.ui.showPrompt({label: 'Password', title})
				if (pwd == null) {
					retFct(new Error('Cancel'))
				}
				else {
					retFct(pwd)
				}				
			}

			pdfDoc = await loadingTask.promise
			await refresh()
			return pdfDoc.numPages
		}

		this.fit = function () {
			const scaleX = div.clientWidth / pageWidth
			const scaleY = div.clientHeight / pageHeight
			scale = Math.min(scaleX, scaleY)
			return refresh()
		}

		this.print = async function (options) {

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

			for (let i = 1; i <= pdfDoc.numPages; i++) {
				const page = await pdfDoc.getPage(i)
				const viewport = page.getViewport({ scale: 1 })
				//console.log('viewport', viewport)
				canvas.width = viewport.width
				canvas.height = viewport.height


				await page.render({
					canvasContext,
					viewport
				}).promise

				if (typeof options.onProgress == 'function') {
					options.onProgress({ page: i })
				}

				html.push(`<img src=${canvas.toDataURL('image/png')}>`)
			}

			html.push('</body>')
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

	}

});
