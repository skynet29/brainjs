//@ts-check
$$.service.registerService('brainjs.http', {

	init: function () {
		return {
			get(url, params) {
				return $.getJSON($$.util.getUrlParams(url, params))
			},

			fetch(url, params) {
				return fetch($$.util.getUrlParams(url, params))
			},


			post(url, data) {
				//console.log('[HTTP] post', url, data)
				return $.ajax({
					method: 'POST',
					url,
					contentType: 'application/json',
					data: JSON.stringify(data)
				})
			},

			put(url, data) {
				return $.ajax({
					method: 'PUT',
					url,
					contentType: 'application/json',
					data: JSON.stringify(data)
				})
			},

			delete(url, data) {
				return $.ajax({
					method: 'DELETE',
					url,
					contentType: 'application/json',
					data: JSON.stringify(data)
				})
			},

			postFormData(url, fd, onUploadProgress) {
				return $.ajax({
					xhr: function () {
						var xhr = new window.XMLHttpRequest();
						//Upload progress
						if (typeof onUploadProgress == 'function') {
							xhr.upload.addEventListener("progress", (evt) => {
								if (evt.lengthComputable) {
									const percentComplete = evt.loaded / evt.total
									onUploadProgress(percentComplete)
								  }

							}, false)

						}
						return xhr;
					},
					url,
					method: "POST",
					data: fd,
					processData: false,  // indique à jQuery de ne pas traiter les données
					contentType: false   // indique à jQuery de ne pas configurer le contentType
				})

			}


		}
	},

	$iface: `get(url, params):Promise;
		post(url, data):Promise;
		put(url, data):Promise;
		delete(url):Promise;
		postFormData(url, formData, onUploadProgress):Promise`

});






