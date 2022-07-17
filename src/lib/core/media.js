(function () {

	async function getVideoDevices() {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices()
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
	}

	async function getAudioInputDevices() {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices()
		const ret = []
		let count = 1
		mediaDevices.forEach((mediaDevice) => {
			if (mediaDevice.kind == 'audioinput') {
				ret.push({
					id: mediaDevice.deviceId,
					label: mediaDevice.label || `Audio ${count++}`
				})
			}
		})
		return ret
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

	function getAudioBuffer(url) {
		return new Promise((resolve, reject) => {
			const audioCtx = new AudioContext()

			const requete = new XMLHttpRequest();

			requete.open('GET', url, true);

			requete.responseType = 'arraybuffer';

			requete.onload = function () {
				audioCtx.decodeAudioData(requete.response).then((buffer) => {
					resolve(buffer)
				})
			}

			requete.send()
		})

	}

	/**
	 * 
	 * @param {number} width 
	 * @param {number} height 
	 * @param {CanvasRenderingContext2D} context 
	 * @param {AudioBuffer} buffer 
	 * @param {string} color 
	 */
	function drawAudioBuffer( width, height, context, buffer, color ) {
		var data = buffer.getChannelData( 0 );
		var step = Math.floor( data.length / width );
		var amp = height / 2;
	
		context.clearRect(0,0,width,height);
		if (color)
			context.fillStyle = color;
		for(var i=0; i < width; i++){
			var min = 1.0;
			var max = -1.0;
			for (j=0; j<step; j++) {
				var datum = data[(i*step)+j]; 
				if (datum < min)
					min = datum;
				if (datum > max)
					max = datum;
			}
			context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
		}
	}	

	function format2(val) {
		return val.toString().padStart(2, '0')
	}

	function getFormatedTime(duration, showMilliseconds = false) {
		const d = new Date(duration * 1000)
		let sec = format2(d.getSeconds())
		const ret = []

		if (showMilliseconds) {
			sec += '.' + format2(Math.trunc(d.getMilliseconds() / 10))
		}

		if (d.getUTCHours() > 0)  {
			ret.push(d.getUTCHours())
			ret.push(format2(d.getMinutes()))
		}
		else {
			ret.push(d.getMinutes())
		}
		ret.push(sec)
		return ret.join(':')
	}	

	$$.media = {
		getVideoDevices,
		getAudioInputDevices,
		decodeAudioData,
		getAudioBuffer,
		drawAudioBuffer,
		getFormatedTime
	}
})();
