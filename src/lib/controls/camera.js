$$.control.registerControl('brainjs.camera', {
	props: {
		constraints: { video: true },
		mimeType: 'video/webm;codecs=vp9'
	},

	init: function (elt) {

		let { constraints, mimeType } = this.props
		const iface = this

		let slider = null

		const video = document.createElement('video')
		video.autoplay = true
		video.muted = true
		$(video)

			.css('object-fit', 'scale-down')
			.css('width', '100%')
			.css('height', '100%')
			.on('play', function (ev) {
				//console.log('onCanPlay')
				elt.trigger('cameraready', stream)
			})
			.appendTo(elt)

		let stream = null
		let barcodeDetector = null
		let imageCapture = null
		let mediaRecorder = null
		let chunks = []

		async function detectBarcode() {
			const bitmap = await imageCapture.grabFrame()

			try {
				const barcodes = await barcodeDetector.detect(bitmap)
				if (barcodes.length == 0) {
					setTimeout(detectBarcode, 1000)
				}
				else {
					elt.trigger('barcode', barcodes[0])				
				}
			}			
			catch(e) {
				console.error('BarcodeDetection failed: ', e)
				$$.ui.showAlert({title: 'Error', content: e.message})				
			}

		}

		this.startRecord = function() {

			if (mediaRecorder == null) {
				mediaRecorder = new MediaRecorder(stream, {mimeType})
				mediaRecorder.ondataavailable = function (e) {
					chunks.push(e.data)
				}	

				mediaRecorder.onstop = function(e) {
					const blob = new Blob(chunks, { type: mimeType })
					chunks = []
					elt.trigger('videorecord', blob)
				}
			}

			mediaRecorder.start()


		}

		this.stopRecord = function() {
			if (mediaRecorder != null) {
				mediaRecorder.stop()
			}
		}

		this.startBarcodeDetection = function() {
			if (barcodeDetector == null) {
				barcodeDetector = new BarcodeDetector()
			}
			if (imageCapture == null) {
				const track = stream.getVideoTracks()[0];
				imageCapture = new ImageCapture(track)
			}
			detectBarcode()
		}


		this.getCapabilities = function () {
			const track = stream.getVideoTracks()[0]
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(track.getCapabilities())					
				}, 500)
			})
		}

		this.getSettings = function () {
			const track = stream.getVideoTracks()[0]
			return track.getSettings()
		}

		this.setZoom = function (zoom) {
			console.log('setZoom', zoom)
			const track = stream.getVideoTracks()[0]
			track.applyConstraints({ advanced: [{ zoom }] }).catch((e) => {
				console.log('setZoom error', e)
			})
		}

		this.start = function () {

			//console.log('[camera] start', constraints)

			navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
				stream = mediaStream


				try {
					video.srcObject = stream
				}
				catch (error) {
					video.src = URL.createObjectURL(stream)
				}
				video.load()

			})
		}

		this.takePicture = function () {
			if (typeof ImageCapture == 'function') {
				const track = stream.getVideoTracks()[0];
				const imageCapture = new ImageCapture(track)

				return imageCapture.takePhoto()
			}
			else {
				const canvas = document.createElement('canvas')
				canvas.width = video.videoWidth
				canvas.height = video.videoHeight
				const ctx = canvas.getContext('2d')
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
				return new Promise((resolve) => {
					canvas.toBlob(function (blob) {
						resolve(blob)
					})
				})
			}
		}

		function stop() {
			if (stream) {
				stream.getTracks().forEach(function (track) {
					track.stop();
				})
				stream = null
			}

		}

		this.stop = stop

		this.dispose = function () {
			stop()
		}

		this.setData = function (data) {
			console.log('[camera] update', data)
			if (data.constraints != undefined) {
				mediaRecorder = null
				iface.stop()
				constraints = data.constraints
				iface.start()
			}

		}
	},

	$iface: `
		getCapabilities(): Promise<MediaTrackCapabilities>;
		getSettings(): MediaTrackSettings;
		startBarcodeDetection();
		setZoom(value: number);
		takePicture(): Promise<Blob>;
		start();
		stop();
		startRecord();
		stopRecord()
	`,

	$events: 'cameraready;barcode;videorecord'




});






