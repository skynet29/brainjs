$$.control.registerControl('brainjs.camera', {
	init: function(elt) {

		const video = $('<video>')
		.on('canplay', function(ev) {
			console.log('onCanPlay', this)
			canvas.width = this.videoWidth
			canvas.height = this.videoHeight
			console.log('width', canvas.width, "height", canvas.height)
		})
		.appendTo(elt)
		.get(0)

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		let _stream = null
		
		this.start = function() {

			navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
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
	} 



});






