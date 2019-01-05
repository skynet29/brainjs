(function(){

$(function() {
	$$.util.loadStyle('map/brainjs-map-editor.css')
})

$$.module.registerModule('brainjs.map.plugin.editor', function() {

	return function(data, config) {

		const {map, elt}	= data

		const drawControl = new L.Control.Draw(config)
		map.addControl(drawControl)	

		map.on('draw:created', function(e) {
			const layer = e.layer
			const type = e.layerType
			console.log('draw:created', type)
			const shapeDesc = $$.module.getModule('brainjs.map.shape.' + type)
			if (shapeDesc && typeof shapeDesc.getData == 'function') {
				const data = {type}
				shapeDesc.getData(layer, data)
				elt.trigger('mapshapecreated', data)
			}
		})		
	}
});

})();


