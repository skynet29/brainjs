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

var engine = {
    toSourceString: function(obj, recursion) {
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
                                + this.toSourceString(obj[prop], recursion + 1)
                                + "    length: " + obj[prop].length
                            + "\n })";
                        else
                            strout += "{\n "
                                + this.toSourceString(obj[prop], recursion + 1).replace(/\,\s*$/, '')
                            + "\n }";
                        break;
                }
                
                strout += recursion ? ",\n " : ";\n ";
            }
        }
        return strout;
    },
    evaluate: function(strInput, obj) {
        var str = this.toSourceString(obj);
        return (new Function(str + 'return ' + strInput))();
    }
}



function safeEval(varName, data) {

    return engine.evaluate(varName, data)

}

function getUrlParams(url, params) {
	if (typeof params == 'object') {
		const keys = []
		for(let i in params) {
			keys.push(i + '=' + encodeURIComponent(params[i]))
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

function writeFloat32 (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true)
  }
}

function floatTo16BitPCM (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
}

function writeString (view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

function encodeWAV (samples, format, sampleRate, numChannels, bitDepth) {
  var bytesPerSample = bitDepth / 8
  var blockAlign = numChannels * bytesPerSample

  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  var view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, 'RIFF')
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  /* RIFF type */
  writeString(view, 8, 'WAVE')
  /* format chunk identifier */
  writeString(view, 12, 'fmt ')
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, 'data')
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) { // Raw PCM
    floatTo16BitPCM(view, 44, samples)
  } else {
    writeFloat32(view, 44, samples)
  }

  return buffer
}


function interleave (inputL, inputR) {
  var length = inputL.length + inputR.length
  var result = new Float32Array(length)

  var index = 0
  var inputIndex = 0

  while (index < length) {
    result[index++] = inputL[inputIndex]
    result[index++] = inputR[inputIndex]
    inputIndex++
  }
  return result
}

/**
 * @credit http://stackoverflow.com/a/26245260
 */
function downSampleBuffer(buffer, inputSampleRate, outputSampleRate) {
  if (inputSampleRate === outputSampleRate) {
    return buffer;
  }

  if (inputSampleRate < outputSampleRate) {
    throw new Error('Output sample rate must be less than input sample rate.');
  }

  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  let result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;

    for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }

    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }

  return result;
}


$$.util = {
	readTextFile,
	readFileAsDataURL,
	openFileDialog,
	isImage,
	dataURLtoBlob,
	loadStyle,
	checkType,
	safeEval,
	getFileType,
	getUrlParams,
	getVideoDevices,
	audio: {
		interleave,
		encodeWAV,
		downSampleBuffer
	}
}


})();
