$$.control.registerControl('brainjs.camera', {
	props: {
		constraints: true
	},

	init: function(elt) {

		let {constraints} = this.props
		const iface = this

		const video = $('<video>', {autoplay: true})
		.on('canplay', function(ev) {
			console.log('onCanPlay')
			
		})
		.appendTo(elt)
		.get(0)


		let _stream = null
		
		this.start = function() {

			//console.log('[camera] start', constraints)

			navigator.mediaDevices.getUserMedia({video: constraints}).then(function(stream) {
				_stream = stream

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

		this.update = function(data) {
			console.log('[camera] update', data)
			if (data.constraints != undefined) {
				iface.stop()
				constraints = data.constraints
				iface.start()				
			}

		}
	},
	$iface: 'start();stop();takePicture():DataURL;dispose()' 




});






