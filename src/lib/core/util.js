(function () {


	function readTextFile(fileName, onRead) {
		var fileReader = new FileReader()

		fileReader.onload = function () {
			if (typeof onRead == 'function') {
				onRead(fileReader.result)
			}
		}
		fileReader.readAsText(fileName)
	}


	function readFileAsDataURL(fileName, onRead) {
		var fileReader = new FileReader()

		fileReader.onload = function () {
			if (typeof onRead == 'function') {
				onRead(fileReader.result)
			}
		}
		fileReader.readAsDataURL(fileName)
	}

	function readFile(fileName) {
		return new Promise((resolve, reject) => {
			var fileReader = new FileReader()

			fileReader.onload = function () {
				resolve(dataURLtoBlob(fileReader.result))
			}
			fileReader.readAsDataURL(fileName)
		})

	}

	function openFileDialog(callback, multiple = false) {
		const input = document.createElement('input')
		input.type = 'file'
		input.multiple = multiple
		input.onchange = function () {
			callback((multiple) ? input.files : input.files[0])
		}
		input.click()
	}

	function isImage(fileName) {
		return (/\.(gif|jpg|jpeg|png)$/i).test(fileName)
	}

	function getFileType(fileName) {
		if (isImage(fileName)) {
			return 'image'
		}

		if ((/\.(ogg|mp3)$/i).test(fileName)) {
			return 'audio'
		}

		if ((/\.(mp4|webm|3gp)$/i).test(fileName)) {
			return 'video'
		}

		if ((/\.(pdf)$/i).test(fileName)) {
			return 'pdf'
		}

	}

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


	function isObject(a) {
		return (typeof a == 'object') && !Array.isArray(a)
	}

	function checkType(value, type, isOptional) {
		//console.log('checkType',value, type, isOptional)
		if (typeof value == 'undefined' && isOptional === true) {
			return true
		}

		if (typeof type == 'string') {
			return typeof value == type
		}

		if (Array.isArray(value)) {
			if (!Array.isArray(type)) {
				return false
			}

			if (type.length == 0) {
				return true // no item type checking
			}
			for (let i of value) {
				var ret = false
				for (let t of type) {
					ret |= checkType(i, t)
				}
				if (!ret) {
					return false
				}
			}

			return true
		}

		if (isObject(type)) {
			if (!isObject(value)) {
				return false
			}
			for (let f in type) {

				//console.log('f', f, 'value', value)
				var newType = type[f]

				var isOptional = false
				if (f.startsWith('$')) {
					f = f.substr(1)
					isOptional = true
				}
				if (!checkType(value[f], newType, isOptional)) {
					return false
				}

			}

			return true
		}
		return false
	}

	function toSourceString(obj, recursion) {
		var strout = "";

		recursion = recursion || 0;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				strout += recursion ? "    " + prop + ": " : "var " + prop + " = ";
				switch (typeof obj[prop]) {
					case "string":
					case "number":
					case "boolean":
					case "undefined":
						strout += JSON.stringify(obj[prop]);
						break;

					case "function":
						// won't work in older browsers
						strout += obj[prop].toString();
						break;

					case "object":
						if (!obj[prop])
							strout += JSON.stringify(obj[prop]);
						else if (obj[prop] instanceof RegExp)
							strout += obj[prop].toString();
						else if (obj[prop] instanceof Date)
							strout += "new Date(" + JSON.stringify(obj[prop]) + ")";
						else if (obj[prop] instanceof Array)
							strout += "Array.prototype.slice.call({\n "
								+ toSourceString(obj[prop], recursion + 1)
								+ "    length: " + obj[prop].length
								+ "\n })";
						else
							strout += "{\n "
								+ toSourceString(obj[prop], recursion + 1).replace(/\,\s*$/, '')
								+ "\n }";
						break;
				}

				strout += recursion ? ",\n " : ";\n ";
			}
		}
		return strout;
	}

	function evaluate(strInput, str) {
		return (new Function(str + 'return ' + strInput))();
	}


	function safeEval(varName, data) {

		return evaluate(varName, toSourceString(data))

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

	function getVideoDevices() {
		return navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
			const ret = []
			let count = 1
			mediaDevices.forEach((mediaDevice) => {
				if (mediaDevice.kind == 'videoinput') {
					ret.push({
						id: mediaDevice.deviceId,
						label: mediaDevice.label || `Camera ${count++}`
					})
				}
			})
			return ret

		})
	}

	function decodeAudioData(blob) {

		return new Promise((resolve, reject) => {
			const audioCtx = new AudioContext()

			const reader = new FileReader()
			reader.onload = function () {
				audioCtx.decodeAudioData(reader.result).then((buffer) => {
					resolve(buffer)
				})
			}
			reader.readAsArrayBuffer(blob)
		})
	}

	function arrayBufferToString(buffer) {
		return String.fromCharCode.apply(null, new Uint16Array(buffer));
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

	function objToArray(obj, keyName) {
		const ret = []
		for (let key in obj) {
			const data = $.extend({}, obj[key])
			data[keyName] = key
			ret.push(data)
		}
		return ret
	}

	function objToArray2(obj) {
		const ret = []
		for (let key in obj) {
			ret.push({name: key, value: obj[key]})
		}
		return ret
	}

	function isMobileDevice() {
		return window.matchMedia("(max-width: 767px)").matches;
	}

	function isTouchDevice() {
		return 'ontouchstart' in window
	}

	function knuthShuffle(length) {
		//console.log('knuthShuffle', length)
		let arr = []
		for (let k = 0; k < length; k++) {
			arr.push(k)
		}

		var rand, temp, i;

		for (i = arr.length - 1; i > 0; i -= 1) {
			rand = Math.floor((i + 1) * Math.random());//get random between zero and i (inclusive)
			temp = arr[rand];//swap i and the zero-indexed number
			arr[rand] = arr[i];
			arr[i] = temp;
		}
		return arr;
	}

	function concatTypedArray(a, b) {
		if (a == null) {
			return b
		}
		const c = new a.constructor(a.length + b.length)
		c.set(a)
		c.set(b, a.length)
		return c
	}

	function wait(delayMs) {
		return new Promise((resolve) => {
			setTimeout(resolve, delayMs)
		})
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

	$$.util = {
		readTextFile,
		readFileAsDataURL,
		readFile,
		openFileDialog,
		isImage,
		dataURLtoBlob,
		checkType,
		safeEval,
		getFileType,
		getUrlParams,
		getVideoDevices,
		decodeAudioData,
		arrayBufferToString,
		parseUrlParams,
		downloadUrl,
		toSourceString,
		evaluate,
		objToArray,
		objToArray2,
		isMobileDevice,
		isTouchDevice,
		buildDataURL,
		knuthShuffle,
		concatTypedArray,
		wait,
		imageUrlToDataUrl
	}


})();
