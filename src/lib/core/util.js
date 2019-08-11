(function() {


function readTextFile(fileName, onRead) {
	var fileReader = new FileReader()

	fileReader.onload = function() {
		if (typeof onRead == 'function') {
			onRead(fileReader.result)
		}
	}
	fileReader.readAsText(fileName)
}


function readFileAsDataURL(fileName, onRead) {
	var fileReader = new FileReader()

	fileReader.onload = function() {
		if (typeof onRead == 'function') {
			onRead(fileReader.result)
		}
	}
	fileReader.readAsDataURL(fileName)
}

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader()

    fileReader.onload = function() {
      resolve(dataURLtoBlob(fileReader.result))
    }
    fileReader.readAsDataURL(fileName)    
  })

}



var inputFile = $('<input>', {type: 'file'}).on('change', function() {
	var onApply = $(this).data('onApply')
	var fileName = this.files[0]
	if (typeof onApply == 'function') {
		onApply(fileName)
	}
})

function openFileDialog(onApply) {
	inputFile.data('onApply', onApply)
	inputFile.click()
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

	if ((/\.(mp4)$/i).test(fileName)) {
		return 'video'
	}

	if ((/\.(pdf)$/i).test(fileName)) {
		return 'pdf'
	}	

}

function dataURLtoBlob(dataURL) {
  // Decode the dataURL
  const [ , mimeType, encodage, data] = dataURL.split(/[:,;]/)
  if (encodage != 'base64') {
  	return
  }

  //console.log('mimeType', mimeType)
  //console.log('encodage', encodage)
  //console.log('data', data)

  var binary = atob(data)
 // Create 8-bit unsigned array
  var array = []
  for(var i = 0; i < binary.length; i++) {
  	array.push(binary.charCodeAt(i))
  }

  // Return our Blob object
	return new Blob([ new Uint8Array(array) ], {mimeType})
}

function loadStyle(styleFilePath, callback) {	
	//console.log('[Core] loadStyle', styleFilePath)

	var cssOk = $('head').find(`link[href="${styleFilePath}"]`).length
	if (cssOk != 1) {
		console.log(`loading '${styleFilePath}' style`)
		$('<link>', {href: styleFilePath, rel: 'stylesheet'})
		.on('load', function() {
			console.log(`'${styleFilePath}' loaded`)
			if (typeof callback == 'function') {
				callback()
			}
		})
		.appendTo($('head'))
	}
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
		for(let i of value) {
			var ret = false
			for(let t of type) {
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
		for(let f in type) {

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
    for(var prop in obj) {
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
		for(let i in params) {
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
    reader.onload = function() {
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
  for(let p of params) {
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

$$.util = {
	readTextFile,
	readFileAsDataURL,
	readFile,
	openFileDialog,
	isImage,
	dataURLtoBlob,
	loadStyle,
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
	evaluate
}


})();
