$$.control.registerControl('brainjs.camera', {
	props: {
		format: 'hd'
	},

	init: function(elt) {

		const formatSize = {
			hd: {
				width: 1280,
				height: 720
			},
			vga: {
				width: 640,
				height: 360
			},
			qvga: {
				width: 320,
				height: 180
			}
		}		

		const size = formatSize[this.props.format]

		const constraints = {
			video: {
				mandatory: {
					maxWidth: size.width,
					maxHeight: size.height
				}
			}
		}
		console.log('[Camera] constraints', constraints)

		const video = $('<video>')
		.on('canplay', function(ev) {
			console.log('onCanPlay')
			
		})
		.appendTo(elt)
		.get(0)


		let _stream = null
		
		this.start = function() {

			navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				_stream = stream

				try {
					video.srcObject = stream
				}
				catch (error) {
					video.src = URL.createObjectURL(stream)
				}
				video.play()

			})
		}		

		this.takePicture = function() {
			console.log('width', video.videoWidth, "height", video.videoHeight)
			const canvas = document.createElement('canvas')
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			const ctx = canvas.getContext('2d')
		    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		    return canvas.toDataURL('image/png');
		}	

		function stop() {
			if (_stream) {
				_stream.getTracks().forEach(function(track) {
		            track.stop();
		        })	
		        _stream = null			
			}

		}

		this.stop = stop

		this.dispose = function() {
			stop()
		}	
	},
	$iface: 'start();stop();takePicture():DataURL;dispose()' 




});






