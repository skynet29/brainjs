(function() {

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

    $$.media = {
        getVideoDevices,
		getAudioInputDevices,
        decodeAudioData
    }
})();
