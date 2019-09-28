(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
	},
	events: {
		onMapClick: function(ev, data) {					
			console.log('onMapClick', data)
			const {latlng} = data
			try {
				ctrl.scope.map.updateShape('marker', {latlng})
			}
			catch(e) {
				ctrl.scope.map.addShape('marker', {
					type: 'marker',
					latlng
				})
			}
		},
		onMapContextMenu: function(ev, data) {
			console.log('onMapContextMenu', data)
		}		
	}	
})

ctrl.scope.map.addShape('shape1', {
	type: 'marker',
	latlng: {lat: 48.395, lng: -4.491},
	rotationAngle: 20,
	icon: {type: 'ais', color: 'blue'},
	popupContent: 'Hello World',
	layer: 'layer1'
})

ctrl.scope.map.addShape('shape2', {
	type: 'circle',
	latlng: {lat: 48.395, lng: -4.471},
	radius: 100,
	style: {color: 'red'},
	layer: 'layer2'
})
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.map" class="map" 
		bn-data="{
			center: {lat: 48.39, lng: -4.486},
			layers: {
				layer1: {label: 'Layer 1', visible: true},
				layer2: {label: 'Layer 2', visible: true}
			},
			contextMenu: {
				edit: {name: 'Edit'},
				sep: {name: '--'},
				copy: {name: 'Copy'}
			}			
		}" 
		bn-iface="map"
		bn-event="mapclick: onMapClick, mapcontextmenu: onMapContextMenu"
		data-scale="true"
		data-coordinates="true"></div>
</div>
`.trim()


$$.control.registerControl('test17', {
	template: {gulp_inject: './test17.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode
			},
			events: {
				onMapClick: function(ev, data) {					
					console.log('onMapClick', data)
					const {latlng} = data
					try {
						ctrl.scope.map.updateShape('marker', {latlng})
					}
					catch(e) {
						ctrl.scope.map.addShape('marker', {
							type: 'marker',
							latlng
						})
					}
				},
				onMapContextMenu: function(ev, data) {
					console.log('onMapContextMenu', data)
				}
			}
		})

		this.ctrl = ctrl

		ctrl.scope.map.addShape('shape1', {
			type: 'marker',
			latlng: {lat: 48.395, lng: -4.491},
			rotationAngle: 20,
			icon: {type: 'ais', color: 'blue'},
			popupContent: 'Hello World',
			layer: 'layer1'
		})

		ctrl.scope.map.addShape('shape2', {
			type: 'circle',
			latlng: {lat: 48.395, lng: -4.471},
			radius: 100,
			style: {color: 'red'},
			layer: 'layer2'
		})


	}
})


  


})();





