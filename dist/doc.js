$$.control.registerControl('$control.details', {

	template: "<h1 bn-text=\"name\"></h1>\n\n<div bn-show=\"hasProperties\">\n	<h2>Properties</h2>\n	<pre bn-text=\"props\"></pre>	\n</div>\n\n<div bn-show=\"hasEvents\">\n	<h2>Events</h2>\n	<ul bn-each=\"e in events\">\n		<li bn-text=\"e\"></li>\n	</ul>	\n</div>\n\n<div bn-show=\"hasMethods\">\n	<h2>Methods</h2>\n	<ul bn-each=\"m in methods\">\n		<li bn-text=\"m\"></li>\n	</ul>	\n</div>\n",

	props: {
		name: ''
	},

	init: function(elt) {

		const info = $$.control.getControlInfo(this.props.name)
		console.log('info', info)


		let hasMethods = false
		let hasEvents = false

		let methods =  ''
		if (typeof info.options.$iface == 'string') {
			methods = info.options.$iface.split(';')
			hasMethods = true
		}

		let events =  ''
		if (typeof info.options.$events == 'string') {
			events = info.options.$events.split(';')
			hasEvents = true
		}

		const props = info.options.props || {}
		
		const hasProperties = Object.keys(props).length != 0

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

	template: "<ul bn-each=\"c in ctrls\">\n	<li><a bn-attr=\"href: c.url\" bn-text=\"c.name\"></a></li>\n</ul>",

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
		{href: '/controls/:name', control: '$control.details'}

	]

	$$.viewController('#main', {
		data: {
			routes
		}
	})
});

$$.control.registerControl('$services', {

	template: "",

	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			
			data: {
			}
		})		
	}

});



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2wuZGV0YWlscy5qcyIsImNvbnRyb2xzLmpzIiwibWFpbi5qcyIsInNlcnZpY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkb2MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnJGNvbnRyb2wuZGV0YWlscycsIHtcblxuXHR0ZW1wbGF0ZTogXCI8aDEgYm4tdGV4dD1cXFwibmFtZVxcXCI+PC9oMT5cXG5cXG48ZGl2IGJuLXNob3c9XFxcImhhc1Byb3BlcnRpZXNcXFwiPlxcblx0PGgyPlByb3BlcnRpZXM8L2gyPlxcblx0PHByZSBibi10ZXh0PVxcXCJwcm9wc1xcXCI+PC9wcmU+XHRcXG48L2Rpdj5cXG5cXG48ZGl2IGJuLXNob3c9XFxcImhhc0V2ZW50c1xcXCI+XFxuXHQ8aDI+RXZlbnRzPC9oMj5cXG5cdDx1bCBibi1lYWNoPVxcXCJlIGluIGV2ZW50c1xcXCI+XFxuXHRcdDxsaSBibi10ZXh0PVxcXCJlXFxcIj48L2xpPlxcblx0PC91bD5cdFxcbjwvZGl2PlxcblxcbjxkaXYgYm4tc2hvdz1cXFwiaGFzTWV0aG9kc1xcXCI+XFxuXHQ8aDI+TWV0aG9kczwvaDI+XFxuXHQ8dWwgYm4tZWFjaD1cXFwibSBpbiBtZXRob2RzXFxcIj5cXG5cdFx0PGxpIGJuLXRleHQ9XFxcIm1cXFwiPjwvbGk+XFxuXHQ8L3VsPlx0XFxuPC9kaXY+XFxuXCIsXG5cblx0cHJvcHM6IHtcblx0XHRuYW1lOiAnJ1xuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgaW5mbyA9ICQkLmNvbnRyb2wuZ2V0Q29udHJvbEluZm8odGhpcy5wcm9wcy5uYW1lKVxuXHRcdGNvbnNvbGUubG9nKCdpbmZvJywgaW5mbylcblxuXG5cdFx0bGV0IGhhc01ldGhvZHMgPSBmYWxzZVxuXHRcdGxldCBoYXNFdmVudHMgPSBmYWxzZVxuXG5cdFx0bGV0IG1ldGhvZHMgPSAgJydcblx0XHRpZiAodHlwZW9mIGluZm8ub3B0aW9ucy4kaWZhY2UgPT0gJ3N0cmluZycpIHtcblx0XHRcdG1ldGhvZHMgPSBpbmZvLm9wdGlvbnMuJGlmYWNlLnNwbGl0KCc7Jylcblx0XHRcdGhhc01ldGhvZHMgPSB0cnVlXG5cdFx0fVxuXG5cdFx0bGV0IGV2ZW50cyA9ICAnJ1xuXHRcdGlmICh0eXBlb2YgaW5mby5vcHRpb25zLiRldmVudHMgPT0gJ3N0cmluZycpIHtcblx0XHRcdGV2ZW50cyA9IGluZm8ub3B0aW9ucy4kZXZlbnRzLnNwbGl0KCc7Jylcblx0XHRcdGhhc0V2ZW50cyA9IHRydWVcblx0XHR9XG5cblx0XHRjb25zdCBwcm9wcyA9IGluZm8ub3B0aW9ucy5wcm9wcyB8fCB7fVxuXHRcdFxuXHRcdGNvbnN0IGhhc1Byb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhwcm9wcykubGVuZ3RoICE9IDBcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRoYXNFdmVudHMsXG5cdFx0XHRcdGhhc01ldGhvZHMsXG5cdFx0XHRcdGhhc1Byb3BlcnRpZXMsXG5cdFx0XHRcdG5hbWU6IHRoaXMucHJvcHMubmFtZSxcblx0XHRcdFx0bWV0aG9kcyxcblx0XHRcdFx0ZXZlbnRzLFxuXHRcdFx0XHRwcm9wczogSlNPTi5zdHJpbmdpZnkocHJvcHMsIG51bGwsIDQpLy8ucmVwbGFjZSgvXFxcIi9nLCAnJylcblx0XHRcdH1cblx0XHR9KVx0XHRcblx0fVxuXG59KTtcblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnJGNvbnRyb2xzJywge1xuXG5cdHRlbXBsYXRlOiBcIjx1bCBibi1lYWNoPVxcXCJjIGluIGN0cmxzXFxcIj5cXG5cdDxsaT48YSBibi1hdHRyPVxcXCJocmVmOiBjLnVybFxcXCIgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L2E+PC9saT5cXG48L3VsPlwiLFxuXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybHMgPSAkJC5jb250cm9sLmdldENvbnRyb2xzKCkuZmlsdGVyKChuYW1lKSA9PiBuYW1lLmNoYXJBdCgwKSAhPSAnJCcpLm1hcCgobmFtZSkgPT4ge1xuXHRcdFx0cmV0dXJuIHtuYW1lLCB1cmw6ICcjL2NvbnRyb2xzLycgKyBuYW1lfVxuXHRcdH0pXG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y3RybHNcblx0XHRcdH1cblx0XHR9KVx0XHRcblx0fVxuXG59KTtcblxuXG4iLCJcbiQoZnVuY3Rpb24oKSB7XG5cblx0bGV0IHJvdXRlcyA9IFtcblx0XHR7aHJlZjogJy8nLCByZWRpcmVjdDogJy9jb250cm9scyd9LFxuXHRcdHtocmVmOiAnL2NvbnRyb2xzJywgY29udHJvbDogJyRjb250cm9scyd9LFxuXHRcdHtocmVmOiAnL3NlcnZpY2VzJywgY29udHJvbDogJyRzZXJ2aWNlcyd9LFxuXHRcdHtocmVmOiAnL2NvbnRyb2xzLzpuYW1lJywgY29udHJvbDogJyRjb250cm9sLmRldGFpbHMnfVxuXG5cdF1cblxuXHQkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdFx0ZGF0YToge1xuXHRcdFx0cm91dGVzXG5cdFx0fVxuXHR9KVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnJHNlcnZpY2VzJywge1xuXG5cdHRlbXBsYXRlOiBcIlwiLFxuXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHR9XG5cdFx0fSlcdFx0XG5cdH1cblxufSk7XG5cblxuIl19
