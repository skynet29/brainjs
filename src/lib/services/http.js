
$$.service.registerService('brainjs.http', {

	init: function() {
		return {
			get(url) {
				return $.getJSON(url)
			},


			post(url, data) {
				console.log('[HTTP] post', url, data)
				return $.ajax({
					method: 'POST',
					url : url,
					contentType: 'application/json',
					data: JSON.stringify(data)
				})
			},

			put(url, data) {
				return $.ajax({
					method: 'PUT',
					url : url,
					contentType: 'application/json',
					data: JSON.stringify(data)
				})
			},			

			delete(url) {
				return $.ajax({
					method: 'DELETE',
					url : url,
				})				
			},

			postFormData(url, fd) {
				return $.ajax({
				  url: url,
				  type: "POST",
				  data: fd,
				  processData: false,  // indique à jQuery de ne pas traiter les données
				  contentType: false   // indique à jQuery de ne pas configurer le contentType
				})				
			}

			
		}
	},

	$iface: `get(url):Promise;
		post(url, data):Promise;
		put(url, data):Promise;
		delete(url):Promise;
		postFormData(url, formData):Promise`

});






