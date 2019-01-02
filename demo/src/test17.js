(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		center: {lat: 48.39, lng: -4.486} // Brest city
	}
}

ctrl.scope.map.addShape('shape1', {
	type: 'marker',
	latlng: {lat: 48.395, lng: -4.491},
	rotationAngle: 20
})

ctrl.scope.map.addShape('shape2', {
	type: 'circle',
	latlng: {lat: 48.395, lng: -4.471},
	radius: 100,
	style: {color: 'red'}
})

setTimeout(function() {
	ctrl.scope.map.removeShape('shape2')
}, 10000)
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.map" bn-data="center: center"  bn-iface="map"></div>
</div>
`.trim()


$$.control.registerControl('test17', {
	template: {gulp_inject: './test17.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				center: {lat: 48.39, lng: -4.486}
			}
		})

		this.ctrl = ctrl

		ctrl.scope.map.addShape('shape1', {
			type: 'marker',
			latlng: {lat: 48.395, lng: -4.491},
			rotationAngle: 20
		})

		ctrl.scope.map.addShape('shape2', {
			type: 'circle',
			latlng: {lat: 48.395, lng: -4.471},
			radius: 100,
			style: {color: 'red'}
		})

		setTimeout(function() {
			ctrl.scope.map.removeShape('shape2')
		}, 10000)

	}
})


  


})();





