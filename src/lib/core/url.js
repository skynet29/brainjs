(function() {

    function buildDataURL(type, subtype, data) {
		return `data:${type}/${subtype};base64,` + data
	}

	function dataURLtoBlob(dataURL) {
		// Decode the dataURL
		const [, mimeType, encodage, data] = dataURL.split(/[:,;]/)
		if (encodage != 'base64') {
			return
		}

		//console.log('mimeType', mimeType)
		//console.log('encodage', encodage)
		//console.log('data', data)

		var binary = atob(data)
		// Create 8-bit unsigned array
		var array = []
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i))
		}

		// Return our Blob object
		return new Blob([new Uint8Array(array)], { mimeType })
	}

	function getUrlParams(url, params) {
		if (typeof params == 'object') {
			const keys = []
			for (let i in params) {
				if (params[i] != undefined) {
					keys.push(i + '=' + encodeURIComponent(params[i]))
				}
			}

			url += `?` + keys.join('&')
		}
		return url

	}    


	function imageUrlToDataUrl(url) {
		return new Promise((resolve, reject) => {
			const img = new Image
			const canvas = document.createElement("canvas")
			const ctx = canvas.getContext("2d")

			img.onload = function () {
				canvas.width = this.naturalWidth
				canvas.height = this.naturalHeight
				ctx.drawImage(this, 0, 0)
				const dataUrl = canvas.toDataURL()
				resolve(dataUrl)
			}

			img.onerror = function () {
				reject('Acces failed')
			}
			img.src = url

		})
	}    

    function parseUrlParams(url) {
		const params = new URLSearchParams(url)
		//console.log('params', params)
		const ret = {}
		for (let p of params) {
			//console.log('p', p)
			ret[p[0]] = p[1]
		}
		return ret
	}

	function downloadUrl(url, fileName) {
		const link = document.createElement('a')
		link.href = url
		link.download = fileName
		link.click()
	}


    $$.url = {
        buildDataURL,
        dataURLtoBlob,
        getUrlParams,
        imageUrlToDataUrl,
        parseUrlParams,
        downloadUrl
    }
})();

