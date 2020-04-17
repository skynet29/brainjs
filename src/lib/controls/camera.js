$$.control.registerControl('brainjs.camera', {
	props: {
		constraints: {video: true}
	},

	init: function(elt) {

		let {constraints} = this.props
		const iface = this

		let slider = null

		const video = document.createElement('video')
		video.autoplay = true
		$(video)
		.css('object-fit', 'scale-down')
		.css('width', '100%')
		.css('height', '100%')
		.on('play', function(ev) {
			//console.log('onCanPlay')
			elt.trigger('cameraready', stream)
		})
		.appendTo(elt)



		let stream = null

		this.getImageCapture = function() {
			const track = stream.getVideoTracks()[0];
			return new ImageCapture(track)			
		}

		this.getCapabilities = function() {
			const track = stream.getVideoTracks()[0]
			return track.getCapabilities()
		}
		
		this.getSettings = function() {
			const track = stream.getVideoTracks()[0]
			return track.getSettings()
		}

		this.setZoom = function(zoom) {
			console.log('setZoom', zoom)
			const track = stream.getVideoTracks()[0]
			track.applyConstraints({ advanced: [{ zoom }]}).catch((e) => {
				console.log('setZoom error', e)
			})
		}

		this.start = function() {

			//console.log('[camera] start', constraints)

			navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
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

		this.takePicture = function() {
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
			    	canvas.toBlob(function(blob) {
			    		resolve(blob)
			    	})
			    })			
			}
		}	

		function stop() {
			if (stream) {
				stream.getTracks().forEach(function(track) {
		            track.stop();
		        })	
		        stream = null			
			}

		}

		this.stop = stop

		this.dispose = function() {
			stop()
		}	

		this.setData = function(data) {
			console.log('[camera] update', data)
			if (data.constraints != undefined) {
				iface.stop()
				constraints = data.constraints
				iface.start()				
			}

		}
	}




});






