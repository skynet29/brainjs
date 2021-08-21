(function() {

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

    $$.media = {
        getVideoDevices,
        decodeAudioData
    }
})();
