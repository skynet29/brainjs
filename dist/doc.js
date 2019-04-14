$$.control.registerControl('$control.details', {

	template: "<h1 class=\"w3-blue w3-center\">Control&nbsp;<span bn-text=\"name\"></span></h1>\n\n<div bn-show=\"hasProperties\">\n	<h2>Properties</h2>\n	<pre bn-text=\"props\"></pre>	\n</div>\n\n<div bn-show=\"hasEvents\">\n	<h2>Events</h2>\n	<ul bn-each=\"events\">\n		<li bn-text=\"$i\"></li>\n	</ul>	\n</div>\n\n<div bn-show=\"hasMethods\">\n	<h2>Methods</h2>\n	<ul bn-each=\"methods\">\n		<li bn-text=\"$i\"></li>\n	</ul>	\n</div>\n",

	props: {
		name: ''
	},

	init: function(elt) {

		const info = $$.control.getControlInfo(this.props.name)
		console.log('info', info)


		let hasMethods = false
		let hasEvents = false

		let methods =  []
		if (typeof info.options.$iface == 'string') {
			methods = info.options.$iface.split(';')
			hasMethods = true
		}

		let events =  []
		if (typeof info.options.$events == 'string') {
			events = info.options.$events.split(';')
			hasEvents = true
		}

		const props = info.options.props || {}
		
		const hasProperties = Object.keys(props).length != 0
		console.log('hasMethods', hasMethods, methods)
		console.log('hasEvents', hasEvents, events)

		const ctrl = $$.viewController(elt, {
			
			data: {
				hasEvents,
				hasMethods,
				hasProperties,
				name: this.props.name,
				methods,
				events,
				props: JSON.stringify(props, null, 4)//.replace(/\"/g, '')
			}
		})	

	}

});



$$.control.registerControl('$controls', {

	template: "<ul bn-each=\"ctrls\">\n	<li><a bn-attr=\"{href: $i.url}\" bn-text=\"$i.name\"></a></li>\n</ul>",

	init: function(elt) {

		const ctrls = $$.control.getControls().filter((name) => name.charAt(0) != '$').map((name) => {
			return {name, url: '#/controls/' + name}
		})

		const ctrl = $$.viewController(elt, {
			
			data: {
				ctrls
			}
		})		
	}

});




$(function() {

	let routes = [
		{href: '/', redirect: '/controls'},
		{href: '/controls', control: '$controls'},
		{href: '/services', control: '$services'},
		{href: '/controls/:name', control: '$control.details'},
		{href: '/services/:name', control: '$service.details'}

	]

	$$.viewController('#main', {
		data: {
			routes
		}
	})
});

$$.control.registerControl('$service.details', {

	template: "<h1 class=\"w3-blue w3-center\">Service&nbsp;<span bn-text=\"name\"></span></h1>\n\n\n<div bn-show=\"hasMethods\">\n	<h2>Methods</h2>\n	<ul bn-each=\"methods\">\n		<li bn-text=\"$i\"></li>\n	</ul>	\n</div>\n",

	props: {
		name: ''
	},

	init: function(elt) {

		const info = $$.service.getServiceInfo(this.props.name)
		console.log('info', info)


		let hasMethods = false

		let methods =  []
		if (typeof info.options.$iface == 'string') {
			methods = info.options.$iface.split(';')
			hasMethods = true
		}


		const ctrl = $$.viewController(elt, {
			
			data: {
				hasMethods,
				name: this.props.name,
				methods,
			}
		})	

	}

});



$$.control.registerControl('$services', {

	template: "<ul bn-each=\"services\">\n	<li><a bn-attr=\"{href: $i.url}\" bn-text=\"$i.name\"></a></li>\n</ul>",

	init: function(elt) {

		const services = $$.service.getServices().map((name) => {
			return {name, url: '#/services/' + name}
		})		

		const ctrl = $$.viewController(elt, {
			
			data: {
				services
			}
		})		
	}

});



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2wuZGV0YWlscy5qcyIsImNvbnRyb2xzLmpzIiwibWFpbi5qcyIsInNlcnZpY2UuZGV0YWlscy5qcyIsInNlcnZpY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImRvYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCckY29udHJvbC5kZXRhaWxzJywge1xuXG5cdHRlbXBsYXRlOiBcIjxoMSBjbGFzcz1cXFwidzMtYmx1ZSB3My1jZW50ZXJcXFwiPkNvbnRyb2wmbmJzcDs8c3BhbiBibi10ZXh0PVxcXCJuYW1lXFxcIj48L3NwYW4+PC9oMT5cXG5cXG48ZGl2IGJuLXNob3c9XFxcImhhc1Byb3BlcnRpZXNcXFwiPlxcblx0PGgyPlByb3BlcnRpZXM8L2gyPlxcblx0PHByZSBibi10ZXh0PVxcXCJwcm9wc1xcXCI+PC9wcmU+XHRcXG48L2Rpdj5cXG5cXG48ZGl2IGJuLXNob3c9XFxcImhhc0V2ZW50c1xcXCI+XFxuXHQ8aDI+RXZlbnRzPC9oMj5cXG5cdDx1bCBibi1lYWNoPVxcXCJldmVudHNcXFwiPlxcblx0XHQ8bGkgYm4tdGV4dD1cXFwiJGlcXFwiPjwvbGk+XFxuXHQ8L3VsPlx0XFxuPC9kaXY+XFxuXFxuPGRpdiBibi1zaG93PVxcXCJoYXNNZXRob2RzXFxcIj5cXG5cdDxoMj5NZXRob2RzPC9oMj5cXG5cdDx1bCBibi1lYWNoPVxcXCJtZXRob2RzXFxcIj5cXG5cdFx0PGxpIGJuLXRleHQ9XFxcIiRpXFxcIj48L2xpPlxcblx0PC91bD5cdFxcbjwvZGl2PlxcblwiLFxuXG5cdHByb3BzOiB7XG5cdFx0bmFtZTogJydcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGluZm8gPSAkJC5jb250cm9sLmdldENvbnRyb2xJbmZvKHRoaXMucHJvcHMubmFtZSlcblx0XHRjb25zb2xlLmxvZygnaW5mbycsIGluZm8pXG5cblxuXHRcdGxldCBoYXNNZXRob2RzID0gZmFsc2Vcblx0XHRsZXQgaGFzRXZlbnRzID0gZmFsc2VcblxuXHRcdGxldCBtZXRob2RzID0gIFtdXG5cdFx0aWYgKHR5cGVvZiBpbmZvLm9wdGlvbnMuJGlmYWNlID09ICdzdHJpbmcnKSB7XG5cdFx0XHRtZXRob2RzID0gaW5mby5vcHRpb25zLiRpZmFjZS5zcGxpdCgnOycpXG5cdFx0XHRoYXNNZXRob2RzID0gdHJ1ZVxuXHRcdH1cblxuXHRcdGxldCBldmVudHMgPSAgW11cblx0XHRpZiAodHlwZW9mIGluZm8ub3B0aW9ucy4kZXZlbnRzID09ICdzdHJpbmcnKSB7XG5cdFx0XHRldmVudHMgPSBpbmZvLm9wdGlvbnMuJGV2ZW50cy5zcGxpdCgnOycpXG5cdFx0XHRoYXNFdmVudHMgPSB0cnVlXG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvcHMgPSBpbmZvLm9wdGlvbnMucHJvcHMgfHwge31cblx0XHRcblx0XHRjb25zdCBoYXNQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMocHJvcHMpLmxlbmd0aCAhPSAwXG5cdFx0Y29uc29sZS5sb2coJ2hhc01ldGhvZHMnLCBoYXNNZXRob2RzLCBtZXRob2RzKVxuXHRcdGNvbnNvbGUubG9nKCdoYXNFdmVudHMnLCBoYXNFdmVudHMsIGV2ZW50cylcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRoYXNFdmVudHMsXG5cdFx0XHRcdGhhc01ldGhvZHMsXG5cdFx0XHRcdGhhc1Byb3BlcnRpZXMsXG5cdFx0XHRcdG5hbWU6IHRoaXMucHJvcHMubmFtZSxcblx0XHRcdFx0bWV0aG9kcyxcblx0XHRcdFx0ZXZlbnRzLFxuXHRcdFx0XHRwcm9wczogSlNPTi5zdHJpbmdpZnkocHJvcHMsIG51bGwsIDQpLy8ucmVwbGFjZSgvXFxcIi9nLCAnJylcblx0XHRcdH1cblx0XHR9KVx0XG5cblx0fVxuXG59KTtcblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnJGNvbnRyb2xzJywge1xuXG5cdHRlbXBsYXRlOiBcIjx1bCBibi1lYWNoPVxcXCJjdHJsc1xcXCI+XFxuXHQ8bGk+PGEgYm4tYXR0cj1cXFwie2hyZWY6ICRpLnVybH1cXFwiIGJuLXRleHQ9XFxcIiRpLm5hbWVcXFwiPjwvYT48L2xpPlxcbjwvdWw+XCIsXG5cblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJscyA9ICQkLmNvbnRyb2wuZ2V0Q29udHJvbHMoKS5maWx0ZXIoKG5hbWUpID0+IG5hbWUuY2hhckF0KDApICE9ICckJykubWFwKChuYW1lKSA9PiB7XG5cdFx0XHRyZXR1cm4ge25hbWUsIHVybDogJyMvY29udHJvbHMvJyArIG5hbWV9XG5cdFx0fSlcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjdHJsc1xuXHRcdFx0fVxuXHRcdH0pXHRcdFxuXHR9XG5cbn0pO1xuXG5cbiIsIlxuJChmdW5jdGlvbigpIHtcblxuXHRsZXQgcm91dGVzID0gW1xuXHRcdHtocmVmOiAnLycsIHJlZGlyZWN0OiAnL2NvbnRyb2xzJ30sXG5cdFx0e2hyZWY6ICcvY29udHJvbHMnLCBjb250cm9sOiAnJGNvbnRyb2xzJ30sXG5cdFx0e2hyZWY6ICcvc2VydmljZXMnLCBjb250cm9sOiAnJHNlcnZpY2VzJ30sXG5cdFx0e2hyZWY6ICcvY29udHJvbHMvOm5hbWUnLCBjb250cm9sOiAnJGNvbnRyb2wuZGV0YWlscyd9LFxuXHRcdHtocmVmOiAnL3NlcnZpY2VzLzpuYW1lJywgY29udHJvbDogJyRzZXJ2aWNlLmRldGFpbHMnfVxuXG5cdF1cblxuXHQkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdFx0ZGF0YToge1xuXHRcdFx0cm91dGVzXG5cdFx0fVxuXHR9KVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnJHNlcnZpY2UuZGV0YWlscycsIHtcblxuXHR0ZW1wbGF0ZTogXCI8aDEgY2xhc3M9XFxcInczLWJsdWUgdzMtY2VudGVyXFxcIj5TZXJ2aWNlJm5ic3A7PHNwYW4gYm4tdGV4dD1cXFwibmFtZVxcXCI+PC9zcGFuPjwvaDE+XFxuXFxuXFxuPGRpdiBibi1zaG93PVxcXCJoYXNNZXRob2RzXFxcIj5cXG5cdDxoMj5NZXRob2RzPC9oMj5cXG5cdDx1bCBibi1lYWNoPVxcXCJtZXRob2RzXFxcIj5cXG5cdFx0PGxpIGJuLXRleHQ9XFxcIiRpXFxcIj48L2xpPlxcblx0PC91bD5cdFxcbjwvZGl2PlxcblwiLFxuXG5cdHByb3BzOiB7XG5cdFx0bmFtZTogJydcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGluZm8gPSAkJC5zZXJ2aWNlLmdldFNlcnZpY2VJbmZvKHRoaXMucHJvcHMubmFtZSlcblx0XHRjb25zb2xlLmxvZygnaW5mbycsIGluZm8pXG5cblxuXHRcdGxldCBoYXNNZXRob2RzID0gZmFsc2VcblxuXHRcdGxldCBtZXRob2RzID0gIFtdXG5cdFx0aWYgKHR5cGVvZiBpbmZvLm9wdGlvbnMuJGlmYWNlID09ICdzdHJpbmcnKSB7XG5cdFx0XHRtZXRob2RzID0gaW5mby5vcHRpb25zLiRpZmFjZS5zcGxpdCgnOycpXG5cdFx0XHRoYXNNZXRob2RzID0gdHJ1ZVxuXHRcdH1cblxuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGhhc01ldGhvZHMsXG5cdFx0XHRcdG5hbWU6IHRoaXMucHJvcHMubmFtZSxcblx0XHRcdFx0bWV0aG9kcyxcblx0XHRcdH1cblx0XHR9KVx0XG5cblx0fVxuXG59KTtcblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnJHNlcnZpY2VzJywge1xuXG5cdHRlbXBsYXRlOiBcIjx1bCBibi1lYWNoPVxcXCJzZXJ2aWNlc1xcXCI+XFxuXHQ8bGk+PGEgYm4tYXR0cj1cXFwie2hyZWY6ICRpLnVybH1cXFwiIGJuLXRleHQ9XFxcIiRpLm5hbWVcXFwiPjwvYT48L2xpPlxcbjwvdWw+XCIsXG5cblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBzZXJ2aWNlcyA9ICQkLnNlcnZpY2UuZ2V0U2VydmljZXMoKS5tYXAoKG5hbWUpID0+IHtcblx0XHRcdHJldHVybiB7bmFtZSwgdXJsOiAnIy9zZXJ2aWNlcy8nICsgbmFtZX1cblx0XHR9KVx0XHRcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRzZXJ2aWNlc1xuXHRcdFx0fVxuXHRcdH0pXHRcdFxuXHR9XG5cbn0pO1xuXG5cbiJdfQ==
