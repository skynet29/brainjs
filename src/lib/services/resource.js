$$.service.registerService('brainjs.resource', {

	deps: ['brainjs.http'],

	init: function(config, http) {

		return function(prefix) {
			return {
				get(url, params) {
					return http.get(`${prefix}${url}`, params)
				},


				post(url, data) {
					return http.post(`${prefix}${url}`, data)
				},

				put(url, data) {
					return http.put(`${prefix}${url}`, data)
				},			

				delete(url) {
					return http.delete(`${prefix}${url}`)		
				},

				postFormData(url, fd) {
					return http.postFormData(`${prefix}${url}`, fd)			
				}				
			}			

		}

	},

	$iface: `function(prefix):HttpInterface`

});






