$$.service.registerService('brainjs.resource', {

	deps: ['brainjs.http'],

	init: function(config, http) {

		return function(prefix) {
			return {
				get(url, params) {
					return http.get(`${prefix}${url}`, params)
				},

				fetch(url, params) {
					return http.fetch(`${prefix}${url}`, params)
				},

				post(url, data) {
					return http.post(`${prefix}${url}`, data)
				},

				put(url, data) {
					return http.put(`${prefix}${url}`, data)
				},			

				delete(url, data) {
					return http.delete(`${prefix}${url}`, data)		
				},

				postFormData(url, fd, onUploadProgress) {
					return http.postFormData(`${prefix}${url}`, fd, onUploadProgress)			
				}				
			}			

		}

	},

	$iface: `function(prefix):HttpInterface`

});






