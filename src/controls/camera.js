$$.control.registerControl('brainjs.camera', {
	init: function(elt) {

		const video = $('<video>')
		.on('canplay', function(ev) {
			console.log('onCanPlay')
			canvas.width = this.videoWidth
			canvas.height = this.videoHeight
		})
		.appendTo(elt)
		.get(0)

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		
		this.start = function() {

			navigator.getUserMedia({video: true}, function(stream) {
				console.log('stream')

				var url = URL.createObjectURL(stream)
				video.src = url
				video.play()

			},
			function(err) {
				console.warn('[Camera] error', err)
			})			
		}		

		this.takePicture = function() {
		    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		    return canvas.toDataURL('image/png');
		}		
	}



});






