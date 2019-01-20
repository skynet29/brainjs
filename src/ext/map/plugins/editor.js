(function(){

$(function() {
	$$.util.loadStyle('map/brainjs-map-editor.css')
})

$$.module.registerModule('brainjs.map.plugin.editor', function() {

	return function(data, config) {

		const {map, elt, layers, shapes} = data

		const options = {}
		if (typeof config.editLayer == 'string') {
			const featureGroup = layers[config.editLayer]
			if (featureGroup) {
				options.edit = {featureGroup}
			}
			else {
				console.warn(`[brainjs.map] layer '${config.editLayer}' doesn't exist`)
			}
		}

		const drawControl = new L.Control.Draw(options)
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

		map.on('draw:edited', function(e) {
			//console.log('draw:edited', e)
			const editedShapes = []
			e.layers.eachLayer(function(shape) {
				editedShapes.push(shape.id)
				console.log(`[brainjs.map] shape with id '${shape.id}' is edited`)				
				const shapeDesc = $$.module.getModule('brainjs.map.shape.' + shape.type)
				if (shapeDesc && typeof shapeDesc.getData == 'function') {
					const data = {}
					shapeDesc.getData(shape, data)
					$.extend(shape.info, data)
				}
			})
			elt.trigger('mapshapeedited', {editedShapes})
		})

		map.on('draw:deleted', function(e) {
			//console.log('draw:edited', e)
			const deletedShapes = []
			e.layers.eachLayer(function(shape) {
				deletedShapes.push(shape.id)
				console.log(`[brainjs.map] shape with id '${shape.id}' is deleted`)				
				delete shapes[shape.id]
			})
			elt.trigger('mapshapedeleted', {deletedShapes})
		})

	}
});

})();


