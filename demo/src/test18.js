(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		center: {lat: 48.39, lng: -4.486}, // Brest city
		plugins: {
			'editor': {}
		}	
	},
	events: {
		onShapeCreated: function(ev, data) {
			console.log('onShapeCreated', data)
			$$.ui.showPrompt({title: 'Add Shape', label: 'shape id:'}, function(id) {
				ctrl.scope.map.addShape(id, data)
			})

		}
	}	
}
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.map" class="map" 
		bn-data="center: center, plugins: plugins"
		bn-event="mapshapecreated: onShapeCreated" 
		bn-iface="map"></div>
</div>
`.trim()


$$.control.registerControl('test18', {
	template: {gulp_inject: './test18.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				center: {lat: 48.39, lng: -4.486},
				plugins: {
					'editor': {}
				}
			},
			events: {
				onShapeCreated: function(ev, data) {
					console.log('onShapeCreated', data)
					$$.ui.showPrompt({title: 'Add Shape', label: 'shape id:'}, function(id) {
						ctrl.scope.map.addShape(id, data)
					})

				}
			}
		})

	}
})


  


})();





