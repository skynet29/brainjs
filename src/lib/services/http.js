//@ts-check
$$.service.registerService('brainjs.http', {

	init: function() {
		return {
			get(url, params) {
				return $.getJSON($$.util.getUrlParams(url, params))
			},


			post(url, data) {
				//console.log('[HTTP] post', url, data)
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

			postFormData(url, fd, options) {
				const settings = $.extend({
				  url: url,
				  method: "POST",
				  data: fd,
				  processData: false,  // indique à jQuery de ne pas traiter les données
				  contentType: false   // indique à jQuery de ne pas configurer le contentType
				}, options)

				return $.ajax(settings)				
			}

			
		}
	},

	$iface: `get(url):Promise;
		post(url, data):Promise;
		put(url, data):Promise;
		delete(url):Promise;
		postFormData(url, formData):Promise`

});






