(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		center: {lat: 48.39, lng: -4.486},
        items: [
            {"text": "Red", color: 'red'},
            {"text": "Blue", "color": "blue"},
            {"text": "Green", "color": "green"},
            {"text": "Black", "color": "black"}
        ],
        shapes: {
			'shape1': {
				type: 'marker',
				latlng: {lat: 48.395, lng: -4.491},
				rotationAngle: 20,
				icon: {type: 'ais', color: 'blue'}
			},	        	
			'shape2': {
				type: 'marker',
				latlng: {lat: 48.395, lng: -4.471},
				icon: {type: 'ais', color: 'red'},
			}
        }        	
	},
	events: {

		onMapShapeContextMenu: function(ev, data) {
			console.log('onMapShapeContextMenu', data)
			const {id, pos} = data
			const info = $(this).iface().getShapeInfo(id)
			const idx = ctrl.model.items.findIndex((item) => item.color == info.icon.color)
			ctrl.scope.map.enableHandlers(false)
			ctrl.scope.menu.closeMenu(function() {
				this.select(idx).showMenu(pos.x, pos.y)
				selShape = id
			})

		},

		onMenuSelected: function(ev, data) {
			console.log('onMenuSelected', data)
			ctrl.scope.map.updateShape(selShape, {icon: {type: 'ais', color: data.color}})
		},

		onMenuClosed: function() {
			console.log('onMenuClosed')
			ctrl.scope.map.enableHandlers(true)
		}
	}	
})
`.trim()

const htmlCode = `
<div id="main">
	<div class="map" style="position: relative;">
		<div bn-control="brainjs.map" style="height: 100%" 
			bn-data="center: center, shapes: shapes" 
			bn-iface="map"
			bn-event="mapshapecontextmenu: onMapShapeContextMenu"
			data-scale="true"
			data-coordinates="true"></div>

		<div bn-control="brainjs.circularmenu"
			style="position: relative;top: -100%" 
			data-radius="80" 
			data-icon-pos="50" 
			data-inner-radius="20"
			data-has-trigger="false" 
			bn-event="menuSelected: onMenuSelected, menuClosed: onMenuClosed" 
			bn-data="items: items"
			bn-iface="menu"></div>
		
	</div>
</div>
`.trim()


let selShape = ""

$$.control.registerControl('test23', {
	template: {gulp_inject: './test23.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				center: {lat: 48.39, lng: -4.486},
		        items: [
		            {"text": "Red", color: 'red'},
		            {"text": "Blue", "color": "blue"},
		            {"text": "Green", "color": "green"},
		            {"text": "Black", "color": "black"}
		        ],
		        shapes: {
					'shape1': {
						type: 'marker',
						latlng: {lat: 48.395, lng: -4.491},
						rotationAngle: 20,
						icon: {type: 'ais', color: 'blue'}
					},	        	
					'shape2': {
						type: 'marker',
						latlng: {lat: 48.395, lng: -4.471},
						icon: {type: 'ais', color: 'red'},
					}
		        }
			

			},
			events: {

				onMapShapeContextMenu: function(ev, data) {
					console.log('onMapShapeContextMenu', data)
					const {id, pos} = data
					const info = $(this).iface().getShapeInfo(id)
					const idx = ctrl.model.items.findIndex((item) => item.color == info.icon.color)
					ctrl.scope.map.enableHandlers(false)
					ctrl.scope.menu.closeMenu(function() {
						this.select(idx).showMenu(pos.x, pos.y)
						selShape = id
					})

				},

				onMenuSelected: function(ev, data) {
					console.log('onMenuSelected', data)
					ctrl.scope.map.updateShape(selShape, {icon: {type: 'ais', color: data.color}})
				},

				onMenuClosed: function() {
					console.log('onMenuClosed')
					ctrl.scope.map.enableHandlers(true)
				}
			}
		})

	}
})


  


})();




