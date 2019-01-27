
$(function() {

	let routes = [
		{href: '/', redirect: '/test1'}
	]
	for(let i = 1; i <= 21; i++ ) {
		routes.push({
			href: '/test' + i, control: 'test' + i
		})
	}



	$$.viewController('#main', {
		data: {
			routes
		}
	})
});

(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		message: 'Hello World'
	}
}
`.trim()

const htmlCode = `
<div id="main">
	<p>Message: <span bn-text="message"></span></p>	
</div>
`.trim()

$$.control.registerControl('test1', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<p bn-text=\"message\"></p>						\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				message: 'Hello World',
				htmlCode,
				jsCode
			}
		})
	}
})

})();



(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
	  radius:10
	}
}
`.trim()

const htmlCode = `
<div id="main">
	<svg height="100" width="100">
	  <circle cx="50" cy="50" bn-attr="r: radius" stroke="black" stroke-width="3" fill="red" />
	</svg>
	  
	<input type="range" bn-val="radius" bn-update="input"></div>
</div>
`.trim()

$$.control.registerControl('test10', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<svg height=\"100\" width=\"100\">\n		  <circle cx=\"50\" cy=\"50\" bn-attr=\"r: radius\" stroke=\"black\" stroke-width=\"3\" fill=\"red\" />\n		</svg>\n		  \n		<input type=\"range\" bn-val=\"radius\" bn-update=\"input\">	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
			  radius:10,
			  htmlCode,
			  jsCode
			}
			 

		})
	}
});

})();






(function(){


const jsCode = `
$$.control.registerControl('MyTable', {   
    props: {
    	clients: []
    },
    template: $('#template'),
    init: function(elt) {
    	console.log('init', this.props)
      
      this.ctrl = $$.viewController(elt, {
        data: {
          clients: this.props.clients
        }
      })

    } 
  }
)

const ctrl = $$.viewController('#main', {
	data: { 
	  myClients: [
	    {name: 'Quentin', city: 'Rennes'},
	    {name: 'Marc', city: 'Bethune'}
	  ],
	  myClients2: [
	    {name: 'Brigitte', city: 'Le Mans'},
	    {name: 'Georges', city: 'Verquin'}
	  ]
	}
}
`.trim()

const htmlCode = `
<div id="main">
	<h2>Custom control</h2>
	<div bn-control="MyTable" bn-data="clients: myClients"></div>
	<hr>
	<div bn-control="MyTable" bn-data="clients: myClients2"></div>
</div>

<div id="template" hidden="">
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>City</th>
			</tr>
		</thead>

		<tbody bn-each="c of clients">
			<tr>
				<td bn-text="c.name"></td>
				<td bn-text="c.city"></td>
			</tr>
		</tbody>
	</table>	
</div>
`.trim()

$$.control.registerControl('MyTable', {   
    props: {
    	clients: []
    },
    template: "<table>\n	<thead>\n		<tr>\n			<th>Name</th>\n			<th>City</th>\n		</tr>\n	</thead>\n\n	<tbody bn-each=\"c of clients\">\n		<tr>\n			<td bn-text=\"c.name\"></td>\n			<td bn-text=\"c.city\"></td>\n		</tr>\n	</tbody>\n</table>	",
    init: function(elt) {
    	console.log('init', this.props)
      
      this.ctrl = $$.viewController(elt, {
        data: {
          clients: this.props.clients
        }
      })

    } 
  }
)

$$.control.registerControl('test11', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		  <h2>Custom control</h2>\n		  <div bn-control=\"MyTable\" bn-data=\"clients: myClients\"></div>\n		  <hr>\n		  <div bn-control=\"MyTable\" bn-data=\"clients: myClients2\"></div>\n		</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
			  myClients: [
			    {name: 'Quentin', city: 'Rennes'},
			    {name: 'Marc', city: 'Bethune'}
			  ],
			  myClients2: [
			    {name: 'Brigitte', city: 'Le Mans'},
			    {name: 'Georges', city: 'Verquin'}
			  ],
			  htmlCode,
			  jsCode
			} 
			 

		})
	}
});

  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		favoriteFruits:['apple', 'orange'],
		gender: 'male'
	} 
}
`.trim()

const htmlCode = `
<div id="main">
	<h2>Fruits</h2>
	<div bn-control="brainjs.checkgroup" bn-val="favoriteFruits" bn-update="input">
	  <input type="checkbox" value="orange">Orange
	  <input type="checkbox" value="bananas">Bananas
	  <input type="checkbox" value="apple">Apple
	  <input type="checkbox" value="lemon">Lemon
	</div>

	  <p>Your favorit fruits: <span bn-text="favoriteFruits"></span></p>

	<h2>Gender</h2>
	<div bn-control="brainjs.radiogroup" bn-val="gender" bn-update="input">
	  <input type="radio" value="male">Male
	  <input type="radio" value="female">Female
	</div>
	<p>Gender: <span bn-text="gender"></span></p>
</div>

`.trim()


$$.control.registerControl('test12', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<h2>Fruits</h2>\n		<div bn-control=\"brainjs.checkgroup\" bn-val=\"favoriteFruits\" bn-update=\"input\">\n		  <input type=\"checkbox\" value=\"orange\">Orange\n		  <input type=\"checkbox\" value=\"bananas\">Bananas\n		  <input type=\"checkbox\" value=\"apple\">Apple\n		  <input type=\"checkbox\" value=\"lemon\">Lemon\n		</div>\n		\n		  <p>Your favorit fruits: <span bn-text=\"favoriteFruits\"></span></p>\n\n		<h2>Gender</h2>\n		<div bn-control=\"brainjs.radiogroup\" bn-val=\"gender\" bn-update=\"input\">\n		  <input type=\"radio\" value=\"male\">Male\n		  <input type=\"radio\" value=\"female\">Female\n		</div>\n		<p>Gender: <span bn-text=\"gender\"></span></p>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				favoriteFruits:['apple', 'orange'],
				gender: 'male',
				htmlCode,
				jsCode
			} 
			 

		})
	}
});

  


})();






(function(){


const jsCode = `
$$.control.registerControl('MyTabCtrl', {
	template: $('#template'),
	init: function(elt) {
		const ctrl = $$.viewController(elt, {
			data: {
				message: 'Hello'
			}
		})
	}

})

const ctrl = $$.viewController('#main', {
	data: { 
	},
	events: {
		onTabActivate: function(ev) {
			console.log('onTabActivate', $(this).iface().getSelectedTabIndex())
		},
		onAddTab: function(ev) {
			console.log('onAddTab')
			$$.ui.showPrompt({title: 'Add Tab', label: 'Tab name:'}, function(tabName) {
				ctrl.scope.tabs.addTab(tabName, {
					removable: true,
					template: '<p>Good morning<p>'
				})
			})

		},
		onAddCtrlTab: function(ev) {
			console.log('onAddCtrlTab')
			$$.ui.showPrompt({title: 'Add Tab', label: 'Tab name:'}, function(tabName) {
				ctrl.scope.tabs.addTab(tabName, {
					removable: true,
					control: 'MyTabCtrl'
				})
			})

		},
		onShowTabInfo: function(ev) {
			const count = ctrl.scope.tabs.getTabsCount()
			const selIdx = ctrl.scope.tabs.getSelectedTabIndex()
			const title = ctrl.scope.tabs.getTabInfo(selIdx).title
			const content = \`
				<p>TabsCount: \${count}</p>
				<p>SelIndex: \${selIdx}</p>
				<p>SelTab Title: \${title}<p>
			\`
			$$.ui.showAlert({content})
		},
		onRemoveSelTab: function() {
			const selIdx = ctrl.scope.tabs.getSelectedTabIndex()
			ctrl.scope.tabs.removeTab(selIdx)
		}
	}	
}
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.tabs" bn-iface="tabs" bn-event="tabsactivate: onTabActivate">
		<div title="Tab 1">
			<p>Hello World</p>
		</div>
		<div title="Tab 2">
			<p>Bonjour le monde</p>
		</div>
	</div>
	<br>
	<div bn-control="brainjs.controlgroup">			
		<button bn-event="click: onAddTab">Add Tab</button>
		<button bn-event="click: onAddCtrlTab">Add Control Tab</button>
		<button bn-event="click: onShowTabInfo">Show Tab Info</button>
		<button bn-event="click: onRemoveSelTab">Remove Sel Tab</button>
	</div>
</div>

<div id="template" hidden="">
	<input type="text" bn-val="message" bn-update="input">
	<p>Message: <span bn-text="message"></span></p>	
</div>

`.trim()

$$.control.registerControl('test13-tabctrl', {
	template: "<div>\n	<input type=\"text\" bn-val=\"message\" bn-update=\"input\">\n	<p>Message: <span bn-text=\"message\"></span></p>		\n</div>\n",
	init: function(elt) {
		const ctrl = $$.viewController(elt, {
			data: {
				message: 'Hello'
			}
		})
	}

})

$$.control.registerControl('test13', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.tabs\" bn-iface=\"tabs\" bn-event=\"tabsactivate: onTabActivate\">\n			<div title=\"Tab 1\">\n				<p>Hello World</p>\n			</div>\n			<div title=\"Tab 2\">\n				<p>Bonjour le monde</p>\n			</div>\n		</div>\n		<br>\n		<div bn-control=\"brainjs.controlgroup\">			\n			<button bn-event=\"click: onAddTab\">Add Tab</button>\n			<button bn-event=\"click: onAddCtrlTab\">Add Control Tab</button>\n			<button bn-event=\"click: onShowTabInfo\">Show Tab Info</button>\n			<button bn-event=\"click: onRemoveSelTab\">Remove Sel Tab</button>\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode
			},
			events: {
				onTabActivate: function(ev) {
					console.log('onTabActivate', $(this).iface().getSelectedTabIndex())
				},
				onAddTab: function(ev) {
					console.log('onAddTab')
					$$.ui.showPrompt({title: 'Add Tab', label: 'Tab name:'}, function(tabName) {
						ctrl.scope.tabs.addTab(tabName, {
							removable: true,
							template: '<p>Good morning<p>'
						})
					})

				},
				onAddCtrlTab: function(ev) {
					console.log('onAddCtrlTab')
					$$.ui.showPrompt({title: 'Add Tab', label: 'Tab name:'}, function(tabName) {
						ctrl.scope.tabs.addTab(tabName, {
							removable: true,
							control: 'test13-tabctrl'
						})
					})

				},
				onShowTabInfo: function(ev) {
					const count = ctrl.scope.tabs.getTabsCount()
					const selIdx = ctrl.scope.tabs.getSelectedTabIndex()
					const title = ctrl.scope.tabs.getTabInfo(selIdx).title
					const content = `
						<p>TabsCount: ${count}</p>
						<p>SelIndex: ${selIdx}</p>
						<p>SelTab Title: ${title}<p>
					`
					$$.ui.showAlert({content})
				},
				onRemoveSelTab: function() {
					const selIdx = ctrl.scope.tabs.getSelectedTabIndex()
					ctrl.scope.tabs.removeTab(selIdx)
				}
			}			 
		})

		console.log('scope', ctrl.scope)

	}
})


  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		date: new Date(1972, 0, 3),
		formatedDate: function() {
			return this.date.toDateString()
		}		
	},
}
`.trim()

const htmlCode = `
<div id="main">
	<input type="text" bn-control="brainjs.datepicker" bn-val="date" bn-update="datepickerchange">
	<p>Date: <span bn-text="formatedDate"></span></p>
</div>
`.trim()


$$.control.registerControl('test14', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n	 	<input type=\"text\" bn-control=\"brainjs.datepicker\" bn-val=\"date\" bn-update=\"datepickerchange\">\n	 	<p>Date: <span bn-text=\"formatedDate\"></span></p>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		this.ctrl = $$.viewController(elt, {
			data: { 
				date: new Date(1972, 0, 3),
				formatedDate: function() {
					return this.date.toDateString()
				},
				htmlCode,
				jsCode,
			},
		 
		})

	}
})


  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		isStarted: false
	},
	events: {
		onStart: function() {
			ctrl.setData({isStarted: true})
			ctrl.scope.camera.start()
		},
		onTakePicture: function() {
			console.log('onTakePicture')
			var url = ctrl.scope.camera.takePicture()
			var content = \`<img src="\${url}">\`
			$$.ui.showAlert({content, width: 'auto'})
		}			
	}	
}
`.trim()

const htmlCode = `
<div id="main">
	<button bn-event="click: onStart" bn-show="!isStarted">Start</button>
	<button bn-event="click: onTakePicture" bn-show="isStarted">Take Picture</button>
	<div bn-control="brainjs.camera" bn-iface="camera"></div>
</div>
`.trim()


$$.control.registerControl('test15', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<button bn-event=\"click: onStart\" bn-show=\"!isStarted\">Start</button>\n		<button bn-event=\"click: onTakePicture\" bn-show=\"isStarted\">Take Picture</button>\n		<div bn-control=\"brainjs.camera\" bn-iface=\"camera\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				isStarted: false
			},
			events: {
				onStart: function() {
					ctrl.setData({isStarted: true})
					ctrl.scope.camera.start()
				},
				onTakePicture: function() {
					console.log('onTakePicture')
					var url = ctrl.scope.camera.takePicture()
					var content = `<img src="${url}">`
					$$.ui.showAlert({content, width: 'auto'})
				}
			}
		 
		})

		this.ctrl = ctrl

	}
})


  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		source: [
			{title: 'Node 1', folder: true, children: [
				{title: 'Node 1.1'},
				{title: 'Node 1.2'}
			]},
			{title: 'Node 2'}
		],
		contextMenu: {
			edit: {name: 'Edit', icon: 'edit'},
			cut: {name: 'Cut', icon: 'cut'}
		}		
	},
	events: {
		onTreeActivate: function() {
			console.log('onTreeActivate', $(this).iface().getActiveNode().title)
		},
		onTreeContextMenu: function(ev, action) {
			console.log('onTreeContextMenu', action)
		},
		onAddNode: function() {
			const activeNode = ctrl.scope.tree.getActiveNode()
			if (activeNode == null) {
				return
			}
			$$.ui.showPrompt({title: 'Add Node', label: 'Node title'}, function(title) {
				
				activeNode.addNode({title})
				activeNode.setExpanded(true)
			})
		},
		onRemoveSelNode: function() {
			const activeNode = ctrl.scope.tree.getActiveNode()
			if (activeNode == null) {
				return
			}
			activeNode.remove()
		}
	}
}
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.tree" 
		bn-data="source: source, contextMenu: contextMenu" 
		bn-event="treeactivate: onTreeActivate, treecontextmenu: onTreeContextMenu" 
		bn-iface="tree"></div>
	<br>
	<div bn-control="brainjs.controlgroup">
		<button bn-event="click: onAddNode">Add Node</button>
		<button bn-event="click: onRemoveSelNode">Remove SelNode</button>				
	</div>
</div>
`.trim()


$$.control.registerControl('test16', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.tree\" \n			bn-data=\"source: source, contextMenu: contextMenu\" \n			bn-event=\"treeactivate: onTreeActivate, treecontextmenu: onTreeContextMenu\" \n			bn-iface=\"tree\"></div>\n		<br>\n		<div bn-control=\"brainjs.controlgroup\">\n			<button bn-event=\"click: onAddNode\">Add Node</button>\n			<button bn-event=\"click: onRemoveSelNode\">Remove SelNode</button>				\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				source: [
					{title: 'Node 1', folder: true, children: [
						{title: 'Node 1.1'},
						{title: 'Node 1.2'}
					]},
					{title: 'Node 2'}
				],

				contextMenu: {
					edit: {name: 'Edit', icon: 'edit'},
					cut: {name: 'Cut', icon: 'cut'}
				}
			
			},
			events: {
				onTreeActivate: function() {
					console.log('onTreeActivate', $(this).iface().getActiveNode().title)
				},
				onTreeContextMenu: function(ev, action) {
					console.log('onTreeContextMenu', action)
				},
				onAddNode: function() {
					const activeNode = ctrl.scope.tree.getActiveNode()
					if (activeNode == null) {
						return
					}
					$$.ui.showPrompt({title: 'Add Node', label: 'Node title'}, function(title) {
						
						activeNode.addNode({title})
						activeNode.setExpanded(true)
					})
				},
				onRemoveSelNode: function() {
					const activeNode = ctrl.scope.tree.getActiveNode()
					if (activeNode == null) {
						return
					}
					activeNode.remove()
				}
			}

		 
		})

		this.ctrl = ctrl

	}
})


  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		center: {lat: 48.39, lng: -4.486}, // Brest city
		layers: {
			'layer1': {label: 'Layer 1', visible: true},
			'layer2': {label: 'Layer 2', visible: true}
		},
		contextMenu: {
			edit: {name: 'Edit'},
			sep: {name: '--'},
			copy: {name: 'Copy'}
		}			
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
		bn-data="center: center, layers: layers, contextMenu: contextMenu" 
		bn-iface="map"
		bn-event="mapclick: onMapClick, mapcontextmenu: onMapContextMenu"
		data-scale="true"
		data-coordinates="true"></div>
</div>
`.trim()


$$.control.registerControl('test17', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.map\" class=\"map\" \n			bn-data=\"center: center, layers: layers, contextMenu: contextMenu\" \n			bn-iface=\"map\"\n			bn-event=\"mapclick: onMapClick, mapcontextmenu: onMapContextMenu\"\n			data-scale=\"true\"\n			data-coordinates=\"true\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				center: {lat: 48.39, lng: -4.486},
				layers: {
					'layer1': {label: 'Layer 1', visible: true},
					'layer2': {label: 'Layer 2', visible: true}
				},
				contextMenu: {
					edit: {name: 'Edit'},
					sep: {name: '--'},
					copy: {name: 'Copy'}
				}

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






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		center: {lat: 48.39, lng: -4.486}, // Brest city
		plugins: {
			'editor': {editLayer: 'layer1'}
		},
		layers: {
			'layer1': {visible: true}
		}		
	},
	events: {
		onShapeCreated: function(ev, data) {
			$$.ui.showPrompt({title: 'Add Shape', label: 'shape id:'}, function(id) {
				data.layer = 'layer1'
				ctrl.scope.map.addShape(id, data)
			})

		},
		onShapeEdited: function(ev, data) {
			console.log('onShapeEdited', data)
		},
		onShapeDeleted: function(ev, data) {
			console.log('onShapeDeleted', data)
		}				
	}	
}
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.map" class="map" 
		bn-data="center: center, plugins: plugins, layers: layers"
		bn-event="mapshapecreated: onShapeCreated, mapshapeedited: onShapeEdited,
		 mapshapedeleted: onShapeDeleted" 
		bn-iface="map"></div>
</div>
`.trim()


$$.control.registerControl('test18', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.map\" class=\"map\" \n			bn-data=\"center: center, plugins: plugins, layers: layers\"\n			bn-event=\"mapshapecreated: onShapeCreated, mapshapeedited: onShapeEdited, mapshapedeleted: onShapeDeleted\" \n			bn-iface=\"map\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				center: {lat: 48.39, lng: -4.486},
				plugins: {
					'editor': {editLayer: 'layer1'}
				},
				layers: {
					'layer1': {visible: true}
				}
			},
			events: {
				onShapeCreated: function(ev, data) {
					$$.ui.showPrompt({title: 'Add Shape', label: 'shape id:'}, function(id) {
						data.layer = 'layer1'
						ctrl.scope.map.addShape(id, data)
					})

				},
				onShapeEdited: function(ev, data) {
					console.log('onShapeEdited', data)
				},
				onShapeDeleted: function(ev, data) {
					console.log('onShapeDeleted', data)
				}				
			}
		})

	}
})


  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main')	
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.htmleditor"></div>
</div>
`.trim()


$$.control.registerControl('test19', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.htmleditor\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				jsCode,
				htmlCode
			}
		})

	}
})


  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		message: 'Hello World'
	}
}
`

const htmlCode = `
<div id="main">
	<input type="text" bn-val="message" bn-update="input">
	<p>Message: <span bn-text="message"></span></p>	
</div>
`

$$.control.registerControl('test2', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<input type=\"text\" bn-val=\"message\" bn-update=\"input\">\n		<p>Message: <span bn-text=\"message\"></span></p>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				message: 'Hello World',
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()
			}
		})
	}
})

})();



(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		size: 50,
		name: ''
	}	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div>
		<input type="range" min="20" max="100" bn-val="size" bn-update="input"><br>
		<input type="text" bn-val="name" bn-update="input">	
	</div>

	<div bn-control="brainjs.milsymbol" data-sidc="SFG-UCI----D" 
		bn-data="size: size, name: name"></div>
</div>
`.trim()


$$.control.registerControl('test20', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div>\n			<input type=\"range\" min=\"20\" max=\"100\" bn-val=\"size\" bn-update=\"input\"><br>\n			<input type=\"text\" bn-val=\"name\" bn-update=\"input\">	\n		</div>\n\n		<div bn-control=\"brainjs.milsymbol\" data-sidc=\"SFG-UCI----D\" bn-data=\"size: size, name: name\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				size: 50,
				name: '',
				jsCode,
				htmlCode
			}
		})

	}
})



  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		gridColumns: ['name', 'location'],
		gridData: [
		   { name: 'American alligator', location: 'Southeast United States' },
		   { name: 'Chinese alligator', location: 'Eastern China' },
		   { name: 'Spectacled caiman', location: 'Central & South America' },
		   { name: 'Broad-snouted caiman', location: 'South America' },
		   { name: 'Jacaré caiman', location: 'South America' },
		   { name: 'Black caiman', location: 'South America' }
		 ],
		 filters: {location: 'S', name: ''}

	},
	events: {
		onFilterChange: function(ev) {
			const f = $(this).data('filter')
			ctrl.model.filters[f] = $(this).val()
			ctrl.update('filters')
		}
	}	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div bn-event="input.filter: onFilterChange">
		<input type="text" placeholder="name filter" bn-val="filters.name" 
			data-filter="name" class="filter">

		<input type="text" placeholder="location filter" bn-val="filters.location"			
			data-filter="location" class="filter">

		
	</div>

	<div bn-control="brainjs.table" 
		bn-data="data: gridData, columns: gridColumns, filters: filters"></div>
</div>
`.trim()


$$.control.registerControl('test21', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-event=\"input.filter: onFilterChange\" class=\"filterpanel\">\n			<input type=\"text\" placeholder=\"name filter\" bn-val=\"filters.name\" \n				data-filter=\"name\" class=\"filter\">\n\n			<input type=\"text\" placeholder=\"location filter\"  bn-val=\"filters.location\"			data-filter=\"location\" class=\"filter\">\n\n			\n		</div>\n\n		<div bn-control=\"brainjs.table\" \n			bn-data=\"data: gridData, columns: gridColumns, filters: filters\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController('#main', {
			data: {
				gridColumns: ['name', 'location'],
				gridData: [
				   { name: 'American alligator', location: 'Southeast United States' },
				   { name: 'Chinese alligator', location: 'Eastern China' },
				   { name: 'Spectacled caiman', location: 'Central & South America' },
				   { name: 'Broad-snouted caiman', location: 'South America' },
				   { name: 'Jacaré caiman', location: 'South America' },
				   { name: 'Black caiman', location: 'South America' }
				 ],
				 filters: {location: 'S', name: ''},
				 jsCode,
				 htmlCode

			},
			events: {
				onFilterChange: function(ev) {
					const f = $(this).data('filter')
					ctrl.model.filters[f] = $(this).val()
					ctrl.update('filters')
				}
			}
		})

	}
})


  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		clients: ['Marc', 'Brigitte']
	}
}
`

const htmlCode = `
<div id="main">
	<h2>Clients</h2>
	<ul bn-each="c of clients">
		<li bn-text="c"></li>
	</ul>
</div>
`

$$.control.registerControl('test3', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<ul bn-each=\"c of clients\">\n			<li bn-text=\"c\"></li>\n		</ul>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				clients: ['Marc', 'Brigitte'],
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()
			}
		})
	}
})

})();



(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		clients: ['Marc', 'Brigitte']			
	},
	events: {
		onAddClient: function(ev) {
			console.log('onAddClient')
			ev.preventDefault()
			ctrl.model.clients.push($(this).getFormData().name)
			ctrl.update('clients')
			$(this).resetForm()

		}
	}
}
`

const htmlCode = `
<div id="main">
	<h2>Clients</h2>
	<ul bn-each="c of clients">
		<li bn-text="c"></li>
	</ul>

	<h2>Add client</h2>
	<form bn-event="submit: onAddClient">
		<input type="text" placeholder="name" name="name" autofocus="" required="">
		<button type="submit">Add</button>
	</form>	
</div>
`

$$.control.registerControl('test4', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<ul bn-each=\"c of clients\">\n			<li bn-text=\"c\"></li>\n		</ul>\n\n		<h2>Add client</h2>\n		<form bn-event=\"submit: onAddClient\">\n			<input type=\"text\" placeholder=\"name\" name=\"name\" autofocus=\"\" required=\"\">\n			<button type=\"submit\">Add</button>\n		</form>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				clients: ['Marc', 'Brigitte'],
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()			
			},
			events: {
				onAddClient: function(ev) {
					console.log('onAddClient')
					ev.preventDefault()
					ctrl.model.clients.push($(this).getFormData().name)
					ctrl.update('clients')
					$(this).resetForm()

				}
			}			

		})
	}
})

})();



(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
	    clients: [
	      {name: 'Marc', age: 20},
	      {name: 'Brigitte', age: 18}
	    ]
	}	
}
`

const htmlCode = `
<div id="main">
	<table>
		<thead>
		  <tr>
		    <th>Name</th>
		    <th>Age</th>
		  </tr>
		</thead>
		<tbody bn-each="c of clients">
			<tr>
				<td bn-text="c.name"></td>
				<td bn-text="c.age"></td>
			</tr>
		</tbody>
	 
	</table>
</div>
`

$$.control.registerControl('test5', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"c of clients\">\n				<tr>\n					<td bn-text=\"c.name\"></td>\n					<td bn-text=\"c.age\"></td>\n				</tr>\n\n			</tbody>		 \n		</table>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n",
	init: function(elt) {

		this.ctrl = $$.viewController(elt, {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ],
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()			
			}		
		})
	}
})

})();



(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
	    clients: [
	      {name: 'Marc', age: 20},
	      {name: 'Brigitte', age: 18}
	    ]
	},
	events: {
		onAddClient: function(ev) {
			console.log('onAddClient')
			ev.preventDefault();
			ctrl.model.clients.push($(this).getFormData())
			ctrl.update('clients')
			$(this).resetForm()
		},
		onRemoveClient: function(ev) {
			var data = $(this).closest('tr').data('item')
				var idx = ctrl.model.clients.indexOf(data)
				console.log('onRemoveClient', idx, data)
			ctrl.model.clients.splice(idx, 1)
			ctrl.update('clients')
		}
	}
}
`

const htmlCode = `
<div id="main">
	<h2>Clients</h2>
	<table>
		<thead>
		  <tr>
		    <th>Name</th>
		    <th>Age</th>
		    <th>Action</th>
		  </tr>
		</thead>
		<tbody bn-each="c of clients" bn-event="click.delBtn: onRemoveClient">
			<tr bn-data="item: c">
				<td bn-text="c.name"></td>
				<td bn-text="c.age"></td>
				<td><button class="delBtn" title="Delete">Delete</button>
			</tr>

		</tbody>
	 
	</table>	

	<h2>Add client</h2>
	<form bn-event="submit: onAddClient">
		<input type="text" placeholder="name" name="name" required><br>
		<input type="number" placeholder="age" name="age" required><br>
		<input type="submit" value="Add">
	</form>	
</div>
`

$$.control.registerControl('test6', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			    <th>Action</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"c of clients\" bn-event=\"click.delBtn: onRemoveClient\">\n				<tr bn-data=\"item: c\">\n					<td bn-text=\"c.name\"></td>\n					<td bn-text=\"c.age\"></td>\n					<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n				</tr>\n\n			</tbody>\n		 \n		</table>	\n\n		<h2>Add client</h2>\n		<form bn-event=\"submit: onAddClient\">\n			<input type=\"text\" placeholder=\"name\" name=\"name\" required><br>\n			<input type=\"number\" placeholder=\"age\" name=\"age\" required><br>\n			<input type=\"submit\" value=\"Add\">\n		</form>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n	",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ],
			    htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()
			},
			events: {
				onAddClient: function(ev) {
					console.log('onAddClient')
					ev.preventDefault();
					ctrl.model.clients.push($(this).getFormData())
					ctrl.update('clients')
					$(this).resetForm()
				},
				onRemoveClient: function(ev) {
					var data = $(this).closest('tr').data('item')
      				var idx = ctrl.model.clients.indexOf(data)
      				console.log('onRemoveClient', idx, data)
					ctrl.model.clients.splice(idx, 1)
					ctrl.update('clients')
				}
			}			
		
		})
	}
})

})();


(function(){


const jsCode = `
const dlgAddClient = $$.formDialogController({
	title: 'Add Client',
	template: $('#template')
})

const ctrl = $$.viewController('#main', {
	data: {
	    clients: [
	      {name: 'Marc', age: 20},
	      {name: 'Brigitte', age: 18}
	    ]
	},
	events: {
		onAddClient: function(ev) {
			console.log('onAddClient')
			dlgAddClient.show(function(data) {
				ctrl.model.clients.push(data)
				ctrl.update('clients')	
			})
		},
		onRemoveClient: function(ev) {
			var data = $(this).closest('tr').data('item')
				var idx = ctrl.model.clients.indexOf(data)
				console.log('onRemoveClient', idx, data)
			ctrl.model.clients.splice(idx, 1)
			ctrl.update('clients')
		}
	}
}
`

const htmlCode = `
<div id="main">
	<h2>Clients</h2>
	<table>
		<thead>
		  <tr>
		    <th>Name</th>
		    <th>Age</th>
		    <th>Action</th>
		  </tr>
		</thead>
		<tbody bn-each="c of clients" bn-event="click.delBtn: onRemoveClient">
			<tr bn-data="item: c">
				<td bn-text="c.name"></td>
				<td bn-text="c.age"></td>
				<td><button class="delBtn" title="Delete">Delete</button>
			</tr>

		</tbody>
	 
	</table>	

	<button bn-event="click: onAddClient">Add Client</button>	
</div>

<div id="template" hidden="">
	<input type="text" placeholder="name" name="name" required><br>
	<input type="number" placeholder="age" name="age" required><br> 
</div>

`

$$.control.registerControl('test7', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n	\n		<h2>Clients</h2>\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			    <th>Action</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"c of clients\" bn-event=\"click.delBtn: onRemoveClient\">\n				<tr bn-data=\"item: c\">\n					<td bn-text=\"c.name\"></td>\n					<td bn-text=\"c.age\"></td>\n					<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n				</tr>\n\n			</tbody>\n		 \n		</table>	\n\n		<button bn-event=\"click: onAddClient\">Add Client</button>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n	\n",
	init: function(elt) {
		const dlgAddClient = $$.formDialogController({
			title: 'Add Client',
			template: "<input type=\"text\" placeholder=\"name\" name=\"name\" required><br>\n<input type=\"number\" placeholder=\"age\" name=\"age\" required><br> 		"
		})

		const ctrl = $$.viewController(elt, {
			data: {
			    clients: [
			      {name: 'Marc', age: 20},
			      {name: 'Brigitte', age: 18}
			    ],
			    htmlCode,
			    jsCode
			},
			events: {
				onAddClient: function(ev) {
					console.log('onAddClient')
					dlgAddClient.show(function(data) {
						ctrl.model.clients.push(data)
						ctrl.update('clients')	
					})
				},
				onRemoveClient: function(ev) {
					var data = $(this).closest('tr').data('item')
      				var idx = ctrl.model.clients.indexOf(data)
      				console.log('onRemoveClient', idx, data)
					ctrl.model.clients.splice(idx, 1)
					ctrl.update('clients')
				}
			}

		})

		this.dispose = function() {
			dlgAddClient.destroy()
		}
	}
})

})();





(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
	  fruits:['orange', 'apple', 'bananas', 'lemon'],
	  favoriteFruit:'apple'
	}	
}
`

const htmlCode = `
<div id="main">
	<h2>Fruits</h2>
	<p>Your favorit fruit: <span bn-text="favoriteFruit"></span></p>
	<select bn-control="brainjs.selectmenu" bn-val="favoriteFruit" 
		bn-update="selectmenuchange" bn-each="f of fruits">
		<option bn-text="f"></option>
	</select>
</div>
`

$$.control.registerControl('test8', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Fruits</h2>\n		<p>Your favorit fruit: <span bn-text=\"favoriteFruit\"></span></p>\n		<select bn-control=\"brainjs.selectmenu\" bn-val=\"favoriteFruit\" bn-update=\"selectmenuchange\" bn-each=\"f of fruits\">\n			<option bn-text=\"f\"></option>\n		</select>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				fruits:['orange', 'apple', 'bananas', 'lemon'],
				favoriteFruit:'apple',
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()			  
			}			
		
		})
	}
})

})();


(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
	   clients:[
	     {name: 'Marc', age: 20},
	     {name: 'Brigitte', age: 18},
	     {name: 'Lucas', age: 22},
	     {name: 'Quentin', age: 15},
	     {name: 'Laurent', age: 32}
	   ],
	   filter:'',
	   getFilteredClients: function() {
	     var filter = this.filter
	     return this.clients.filter(function(client) {
	       return client.name.startsWith(filter);
	     })
	   }    

	 }
}
`

const htmlCode = `
<div id="main">
	<h2>Clients</h2>
	<input type="text" placeholder="filter by name" bn-val="filter" bn-update="input">
	<table>
	  <thead>
	    <tr>
	      <th>Name</th>
	      <th>Age</th>
	    </tr>
	  </thead>
	  <tbody bn-each="client of getFilteredClients">
	    <tr>
	      <td bn-text="client.name"></td>
	      <td bn-text="client.age"></td>
	    </tr>
	  </tbody>
	   
	</table>
</div>
`

$$.control.registerControl('test9', {
	template: "<div bn-control=\"brainjs.tabs\">\n  <div title=\"Result\">\n    <h2>Clients</h2>\n    <input type=\"text\" placeholder=\"filter by name\" bn-val=\"filter\" bn-update=\"input\">\n    <table>\n      <thead>\n        <tr>\n          <th>Name</th>\n          <th>Age</th>\n        </tr>\n      </thead>\n      <tbody bn-each=\"client of getFilteredClients\">\n        <tr>\n          <td bn-text=\"client.name\"></td>\n          <td bn-text=\"client.age\"></td>\n        </tr>\n      </tbody>\n       \n    </table>\n  </div>\n  <div title=\"HTML\">\n    <pre bn-text=\"htmlCode\"></pre>\n  </div>\n  <div title=\"Javascript\">\n    <pre bn-text=\"jsCode\"></pre>\n  </div>  \n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
			   clients:[
			     {name: 'Marc', age: 20},
			     {name: 'Brigitte', age: 18},
			     {name: 'Lucas', age: 22},
			     {name: 'Quentin', age: 15},
			     {name: 'Laurent', age: 32}
			   ],
			   filter:'',
			   getFilteredClients: function() {
			     var filter = this.filter
			     return this.clients.filter(function(client) {
			       return client.name.startsWith(filter);
			     })

			   },
			   htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()		


			 }

		})
	}
})

})();





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QxMy5qcyIsInRlc3QxNC5qcyIsInRlc3QxNS5qcyIsInRlc3QxNi5qcyIsInRlc3QxNy5qcyIsInRlc3QxOC5qcyIsInRlc3QxOS5qcyIsInRlc3QyLmpzIiwidGVzdDIwLmpzIiwidGVzdDIxLmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkZW1vLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4kKGZ1bmN0aW9uKCkge1xuXG5cdGxldCByb3V0ZXMgPSBbXG5cdFx0e2hyZWY6ICcvJywgcmVkaXJlY3Q6ICcvdGVzdDEnfVxuXHRdXG5cdGZvcihsZXQgaSA9IDE7IGkgPD0gMjE7IGkrKyApIHtcblx0XHRyb3V0ZXMucHVzaCh7XG5cdFx0XHRocmVmOiAnL3Rlc3QnICsgaSwgY29udHJvbDogJ3Rlc3QnICsgaVxuXHRcdH0pXG5cdH1cblxuXG5cblx0JCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRcdGRhdGE6IHtcblx0XHRcdHJvdXRlc1xuXHRcdH1cblx0fSlcbn0pO1xuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCdcblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8cCBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3A+XHRcdFx0XHRcdFx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGVcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICByYWRpdXM6MTBcblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8c3ZnIGhlaWdodD1cIjEwMFwiIHdpZHRoPVwiMTAwXCI+XG5cdCAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIGJuLWF0dHI9XCJyOiByYWRpdXNcIiBzdHJva2U9XCJibGFja1wiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwicmVkXCIgLz5cblx0PC9zdmc+XG5cdCAgXG5cdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBibi12YWw9XCJyYWRpdXNcIiBibi11cGRhdGU9XCJpbnB1dFwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEwJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8c3ZnIGhlaWdodD1cXFwiMTAwXFxcIiB3aWR0aD1cXFwiMTAwXFxcIj5cXG5cdFx0ICA8Y2lyY2xlIGN4PVxcXCI1MFxcXCIgY3k9XFxcIjUwXFxcIiBibi1hdHRyPVxcXCJyOiByYWRpdXNcXFwiIHN0cm9rZT1cXFwiYmxhY2tcXFwiIHN0cm9rZS13aWR0aD1cXFwiM1xcXCIgZmlsbD1cXFwicmVkXFxcIiAvPlxcblx0XHQ8L3N2Zz5cXG5cdFx0ICBcXG5cdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBibi12YWw9XFxcInJhZGl1c1xcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgIHJhZGl1czoxMCxcblx0XHRcdCAgaHRtbENvZGUsXG5cdFx0XHQgIGpzQ29kZVxuXHRcdFx0fVxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFibGUnLCB7ICAgXG4gICAgcHJvcHM6IHtcbiAgICBcdGNsaWVudHM6IFtdXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJyksXG4gICAgaW5pdDogZnVuY3Rpb24oZWx0KSB7XG4gICAgXHRjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMucHJvcHMpXG4gICAgICBcbiAgICAgIHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY2xpZW50czogdGhpcy5wcm9wcy5jbGllbnRzXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9IFxuICB9XG4pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdCAgbXlDbGllbnRzOiBbXG5cdCAgICB7bmFtZTogJ1F1ZW50aW4nLCBjaXR5OiAnUmVubmVzJ30sXG5cdCAgICB7bmFtZTogJ01hcmMnLCBjaXR5OiAnQmV0aHVuZSd9XG5cdCAgXSxcblx0ICBteUNsaWVudHMyOiBbXG5cdCAgICB7bmFtZTogJ0JyaWdpdHRlJywgY2l0eTogJ0xlIE1hbnMnfSxcblx0ICAgIHtuYW1lOiAnR2VvcmdlcycsIGNpdHk6ICdWZXJxdWluJ31cblx0ICBdXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkN1c3RvbSBjb250cm9sPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiTXlUYWJsZVwiIGJuLWRhdGE9XCJjbGllbnRzOiBteUNsaWVudHNcIj48L2Rpdj5cblx0PGhyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJNeVRhYmxlXCIgYm4tZGF0YT1cImNsaWVudHM6IG15Q2xpZW50czJcIj48L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRoPk5hbWU8L3RoPlxuXHRcdFx0XHQ8dGg+Q2l0eTwvdGg+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiPlxuXHRcdFx0PHRyPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5jaXR5XCI+PC90ZD5cblx0XHRcdDwvdHI+XG5cdFx0PC90Ym9keT5cblx0PC90YWJsZT5cdFxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJsZScsIHsgICBcbiAgICBwcm9wczoge1xuICAgIFx0Y2xpZW50czogW11cbiAgICB9LFxuICAgIHRlbXBsYXRlOiBcIjx0YWJsZT5cXG5cdDx0aGVhZD5cXG5cdFx0PHRyPlxcblx0XHRcdDx0aD5OYW1lPC90aD5cXG5cdFx0XHQ8dGg+Q2l0eTwvdGg+XFxuXHRcdDwvdHI+XFxuXHQ8L3RoZWFkPlxcblxcblx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdDx0cj5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmNpdHlcXFwiPjwvdGQ+XFxuXHRcdDwvdHI+XFxuXHQ8L3Rib2R5PlxcbjwvdGFibGU+XHRcIixcbiAgICBpbml0OiBmdW5jdGlvbihlbHQpIHtcbiAgICBcdGNvbnNvbGUubG9nKCdpbml0JywgdGhpcy5wcm9wcylcbiAgICAgIFxuICAgICAgdGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjbGllbnRzOiB0aGlzLnByb3BzLmNsaWVudHNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgIH0gXG4gIH1cbilcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0ICA8aDI+Q3VzdG9tIGNvbnRyb2w8L2gyPlxcblx0XHQgIDxkaXYgYm4tY29udHJvbD1cXFwiTXlUYWJsZVxcXCIgYm4tZGF0YT1cXFwiY2xpZW50czogbXlDbGllbnRzXFxcIj48L2Rpdj5cXG5cdFx0ICA8aHI+XFxuXHRcdCAgPGRpdiBibi1jb250cm9sPVxcXCJNeVRhYmxlXFxcIiBibi1kYXRhPVxcXCJjbGllbnRzOiBteUNsaWVudHMyXFxcIj48L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdCAgbXlDbGllbnRzOiBbXG5cdFx0XHQgICAge25hbWU6ICdRdWVudGluJywgY2l0eTogJ1Jlbm5lcyd9LFxuXHRcdFx0ICAgIHtuYW1lOiAnTWFyYycsIGNpdHk6ICdCZXRodW5lJ31cblx0XHRcdCAgXSxcblx0XHRcdCAgbXlDbGllbnRzMjogW1xuXHRcdFx0ICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBjaXR5OiAnTGUgTWFucyd9LFxuXHRcdFx0ICAgIHtuYW1lOiAnR2VvcmdlcycsIGNpdHk6ICdWZXJxdWluJ31cblx0XHRcdCAgXSxcblx0XHRcdCAgaHRtbENvZGUsXG5cdFx0XHQgIGpzQ29kZVxuXHRcdFx0fSBcblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRmYXZvcml0ZUZydWl0czpbJ2FwcGxlJywgJ29yYW5nZSddLFxuXHRcdGdlbmRlcjogJ21hbGUnXG5cdH0gXG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5GcnVpdHM8L2gyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmNoZWNrZ3JvdXBcIiBibi12YWw9XCJmYXZvcml0ZUZydWl0c1wiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwib3JhbmdlXCI+T3JhbmdlXG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwiYmFuYW5hc1wiPkJhbmFuYXNcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJhcHBsZVwiPkFwcGxlXG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwibGVtb25cIj5MZW1vblxuXHQ8L2Rpdj5cblxuXHQgIDxwPllvdXIgZmF2b3JpdCBmcnVpdHM6IDxzcGFuIGJuLXRleHQ9XCJmYXZvcml0ZUZydWl0c1wiPjwvc3Bhbj48L3A+XG5cblx0PGgyPkdlbmRlcjwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMucmFkaW9ncm91cFwiIGJuLXZhbD1cImdlbmRlclwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdCAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwibWFsZVwiPk1hbGVcblx0ICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJmZW1hbGVcIj5GZW1hbGVcblx0PC9kaXY+XG5cdDxwPkdlbmRlcjogPHNwYW4gYm4tdGV4dD1cImdlbmRlclwiPjwvc3Bhbj48L3A+XG48L2Rpdj5cblxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEyJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNoZWNrZ3JvdXBcXFwiIGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcIm9yYW5nZVxcXCI+T3JhbmdlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwiYmFuYW5hc1xcXCI+QmFuYW5hc1xcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImFwcGxlXFxcIj5BcHBsZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImxlbW9uXFxcIj5MZW1vblxcblx0XHQ8L2Rpdj5cXG5cdFx0XFxuXHRcdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiPjwvc3Bhbj48L3A+XFxuXFxuXHRcdDxoMj5HZW5kZXI8L2gyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMucmFkaW9ncm91cFxcXCIgYm4tdmFsPVxcXCJnZW5kZXJcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgdmFsdWU9XFxcIm1hbGVcXFwiPk1hbGVcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIHZhbHVlPVxcXCJmZW1hbGVcXFwiPkZlbWFsZVxcblx0XHQ8L2Rpdj5cXG5cdFx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVxcXCJnZW5kZXJcXFwiPjwvc3Bhbj48L3A+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRmYXZvcml0ZUZydWl0czpbJ2FwcGxlJywgJ29yYW5nZSddLFxuXHRcdFx0XHRnZW5kZXI6ICdtYWxlJyxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSBcblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFiQ3RybCcsIHtcblx0dGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbydcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cbn0pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uVGFiQWN0aXZhdGU6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UYWJBY3RpdmF0ZScsICQodGhpcykuaWZhY2UoKS5nZXRTZWxlY3RlZFRhYkluZGV4KCkpXG5cdFx0fSxcblx0XHRvbkFkZFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZFRhYicpXG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzxwPkdvb2QgbW9ybmluZzxwPidcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uQWRkQ3RybFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZEN0cmxUYWInKVxuXHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0Y29udHJvbDogJ015VGFiQ3RybCdcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uU2hvd1RhYkluZm86IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zdCBjb3VudCA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJzQ291bnQoKVxuXHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0Y29uc3QgdGl0bGUgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFiSW5mbyhzZWxJZHgpLnRpdGxlXG5cdFx0XHRjb25zdCBjb250ZW50ID0gXFxgXG5cdFx0XHRcdDxwPlRhYnNDb3VudDogXFwke2NvdW50fTwvcD5cblx0XHRcdFx0PHA+U2VsSW5kZXg6IFxcJHtzZWxJZHh9PC9wPlxuXHRcdFx0XHQ8cD5TZWxUYWIgVGl0bGU6IFxcJHt0aXRsZX08cD5cblx0XHRcdFxcYFxuXHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50fSlcblx0XHR9LFxuXHRcdG9uUmVtb3ZlU2VsVGFiOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHNlbElkeCA9IGN0cmwuc2NvcGUudGFicy5nZXRTZWxlY3RlZFRhYkluZGV4KClcblx0XHRcdGN0cmwuc2NvcGUudGFicy5yZW1vdmVUYWIoc2VsSWR4KVxuXHRcdH1cblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMudGFic1wiIGJuLWlmYWNlPVwidGFic1wiIGJuLWV2ZW50PVwidGFic2FjdGl2YXRlOiBvblRhYkFjdGl2YXRlXCI+XG5cdFx0PGRpdiB0aXRsZT1cIlRhYiAxXCI+XG5cdFx0XHQ8cD5IZWxsbyBXb3JsZDwvcD5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IHRpdGxlPVwiVGFiIDJcIj5cblx0XHRcdDxwPkJvbmpvdXIgbGUgbW9uZGU8L3A+XG5cdFx0PC9kaXY+XG5cdDwvZGl2PlxuXHQ8YnI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY29udHJvbGdyb3VwXCI+XHRcdFx0XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZFRhYlwiPkFkZCBUYWI8L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkQ3RybFRhYlwiPkFkZCBDb250cm9sIFRhYjwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25TaG93VGFiSW5mb1wiPlNob3cgVGFiIEluZm88L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uUmVtb3ZlU2VsVGFiXCI+UmVtb3ZlIFNlbCBUYWI8L2J1dHRvbj5cblx0PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLXZhbD1cIm1lc3NhZ2VcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEzLXRhYmN0cmwnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXY+XFxuXHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJtZXNzYWdlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvc3Bhbj48L3A+XHRcdFxcbjwvZGl2PlxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbydcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cbn0pXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIiBibi1pZmFjZT1cXFwidGFic1xcXCIgYm4tZXZlbnQ9XFxcInRhYnNhY3RpdmF0ZTogb25UYWJBY3RpdmF0ZVxcXCI+XFxuXHRcdFx0PGRpdiB0aXRsZT1cXFwiVGFiIDFcXFwiPlxcblx0XHRcdFx0PHA+SGVsbG8gV29ybGQ8L3A+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdFx0PGRpdiB0aXRsZT1cXFwiVGFiIDJcXFwiPlxcblx0XHRcdFx0PHA+Qm9uam91ciBsZSBtb25kZTwvcD5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHRcdDxicj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNvbnRyb2xncm91cFxcXCI+XHRcdFx0XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkVGFiXFxcIj5BZGQgVGFiPC9idXR0b24+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkQ3RybFRhYlxcXCI+QWRkIENvbnRyb2wgVGFiPC9idXR0b24+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uU2hvd1RhYkluZm9cXFwiPlNob3cgVGFiIEluZm88L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25SZW1vdmVTZWxUYWJcXFwiPlJlbW92ZSBTZWwgVGFiPC9idXR0b24+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblRhYkFjdGl2YXRlOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRhYkFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldFNlbGVjdGVkVGFiSW5kZXgoKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGRUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkVGFiJylcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogJzxwPkdvb2QgbW9ybmluZzxwPidcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbkFkZEN0cmxUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ3RybFRhYicpXG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0Y29udHJvbDogJ3Rlc3QxMy10YWJjdHJsJ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uU2hvd1RhYkluZm86IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc3QgY291bnQgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFic0NvdW50KClcblx0XHRcdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRcdFx0Y29uc3QgdGl0bGUgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFiSW5mbyhzZWxJZHgpLnRpdGxlXG5cdFx0XHRcdFx0Y29uc3QgY29udGVudCA9IGBcblx0XHRcdFx0XHRcdDxwPlRhYnNDb3VudDogJHtjb3VudH08L3A+XG5cdFx0XHRcdFx0XHQ8cD5TZWxJbmRleDogJHtzZWxJZHh9PC9wPlxuXHRcdFx0XHRcdFx0PHA+U2VsVGFiIFRpdGxlOiAke3RpdGxlfTxwPlxuXHRcdFx0XHRcdGBcblx0XHRcdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZVNlbFRhYjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUudGFicy5yZW1vdmVUYWIoc2VsSWR4KVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0IFxuXHRcdH0pXG5cblx0XHRjb25zb2xlLmxvZygnc2NvcGUnLCBjdHJsLnNjb3BlKVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRkYXRlOiBuZXcgRGF0ZSgxOTcyLCAwLCAzKSxcblx0XHRmb3JtYXRlZERhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKVxuXHRcdH1cdFx0XG5cdH0sXG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLWNvbnRyb2w9XCJicmFpbmpzLmRhdGVwaWNrZXJcIiBibi12YWw9XCJkYXRlXCIgYm4tdXBkYXRlPVwiZGF0ZXBpY2tlcmNoYW5nZVwiPlxuXHQ8cD5EYXRlOiA8c3BhbiBibi10ZXh0PVwiZm9ybWF0ZWREYXRlXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0IFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLWNvbnRyb2w9XFxcImJyYWluanMuZGF0ZXBpY2tlclxcXCIgYm4tdmFsPVxcXCJkYXRlXFxcIiBibi11cGRhdGU9XFxcImRhdGVwaWNrZXJjaGFuZ2VcXFwiPlxcblx0IFx0PHA+RGF0ZTogPHNwYW4gYm4tdGV4dD1cXFwiZm9ybWF0ZWREYXRlXFxcIj48L3NwYW4+PC9wPlxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRkYXRlOiBuZXcgRGF0ZSgxOTcyLCAwLCAzKSxcblx0XHRcdFx0Zm9ybWF0ZWREYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRlLnRvRGF0ZVN0cmluZygpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHR9LFxuXHRcdCBcblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0aXNTdGFydGVkOiBmYWxzZVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdGN0cmwuc2NvcGUuY2FtZXJhLnN0YXJ0KClcblx0XHR9LFxuXHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVGFrZVBpY3R1cmUnKVxuXHRcdFx0dmFyIHVybCA9IGN0cmwuc2NvcGUuY2FtZXJhLnRha2VQaWN0dXJlKClcblx0XHRcdHZhciBjb250ZW50ID0gXFxgPGltZyBzcmM9XCJcXCR7dXJsfVwiPlxcYFxuXHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50LCB3aWR0aDogJ2F1dG8nfSlcblx0XHR9XHRcdFx0XG5cdH1cdFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uU3RhcnRcIiBibi1zaG93PVwiIWlzU3RhcnRlZFwiPlN0YXJ0PC9idXR0b24+XG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25UYWtlUGljdHVyZVwiIGJuLXNob3c9XCJpc1N0YXJ0ZWRcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jYW1lcmFcIiBibi1pZmFjZT1cImNhbWVyYVwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTUnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblN0YXJ0XFxcIiBibi1zaG93PVxcXCIhaXNTdGFydGVkXFxcIj5TdGFydDwvYnV0dG9uPlxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25UYWtlUGljdHVyZVxcXCIgYm4tc2hvdz1cXFwiaXNTdGFydGVkXFxcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNhbWVyYVxcXCIgYm4taWZhY2U9XFxcImNhbWVyYVxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRpc1N0YXJ0ZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdFx0XHRjdHJsLnNjb3BlLmNhbWVyYS5zdGFydCgpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRha2VQaWN0dXJlJylcblx0XHRcdFx0XHR2YXIgdXJsID0gY3RybC5zY29wZS5jYW1lcmEudGFrZVBpY3R1cmUoKVxuXHRcdFx0XHRcdHZhciBjb250ZW50ID0gYDxpbWcgc3JjPVwiJHt1cmx9XCI+YFxuXHRcdFx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudCwgd2lkdGg6ICdhdXRvJ30pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQgXG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdHNvdXJjZTogW1xuXHRcdFx0e3RpdGxlOiAnTm9kZSAxJywgZm9sZGVyOiB0cnVlLCBjaGlsZHJlbjogW1xuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMSd9LFxuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMid9XG5cdFx0XHRdfSxcblx0XHRcdHt0aXRsZTogJ05vZGUgMid9XG5cdFx0XSxcblx0XHRjb250ZXh0TWVudToge1xuXHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0JywgaWNvbjogJ2VkaXQnfSxcblx0XHRcdGN1dDoge25hbWU6ICdDdXQnLCBpY29uOiAnY3V0J31cblx0XHR9XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblRyZWVBY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0QWN0aXZlTm9kZSgpLnRpdGxlKVxuXHRcdH0sXG5cdFx0b25UcmVlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBhY3Rpb24pIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVDb250ZXh0TWVudScsIGFjdGlvbilcblx0XHR9LFxuXHRcdG9uQWRkTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIE5vZGUnLCBsYWJlbDogJ05vZGUgdGl0bGUnfSwgZnVuY3Rpb24odGl0bGUpIHtcblx0XHRcdFx0XG5cdFx0XHRcdGFjdGl2ZU5vZGUuYWRkTm9kZSh7dGl0bGV9KVxuXHRcdFx0XHRhY3RpdmVOb2RlLnNldEV4cGFuZGVkKHRydWUpXG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVTZWxOb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0YWN0aXZlTm9kZS5yZW1vdmUoKVxuXHRcdH1cblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRyZWVcIiBcblx0XHRibi1kYXRhPVwic291cmNlOiBzb3VyY2UsIGNvbnRleHRNZW51OiBjb250ZXh0TWVudVwiIFxuXHRcdGJuLWV2ZW50PVwidHJlZWFjdGl2YXRlOiBvblRyZWVBY3RpdmF0ZSwgdHJlZWNvbnRleHRtZW51OiBvblRyZWVDb250ZXh0TWVudVwiIFxuXHRcdGJuLWlmYWNlPVwidHJlZVwiPjwvZGl2PlxuXHQ8YnI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY29udHJvbGdyb3VwXCI+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZE5vZGVcIj5BZGQgTm9kZTwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25SZW1vdmVTZWxOb2RlXCI+UmVtb3ZlIFNlbE5vZGU8L2J1dHRvbj5cdFx0XHRcdFxuXHQ8L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE2Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudHJlZVxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwic291cmNlOiBzb3VyY2UsIGNvbnRleHRNZW51OiBjb250ZXh0TWVudVxcXCIgXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcInRyZWVhY3RpdmF0ZTogb25UcmVlQWN0aXZhdGUsIHRyZWVjb250ZXh0bWVudTogb25UcmVlQ29udGV4dE1lbnVcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJ0cmVlXFxcIj48L2Rpdj5cXG5cdFx0PGJyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY29udHJvbGdyb3VwXFxcIj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGROb2RlXFxcIj5BZGQgTm9kZTwvYnV0dG9uPlxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblJlbW92ZVNlbE5vZGVcXFwiPlJlbW92ZSBTZWxOb2RlPC9idXR0b24+XHRcdFx0XHRcXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRzb3VyY2U6IFtcblx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEnLCBmb2xkZXI6IHRydWUsIGNoaWxkcmVuOiBbXG5cdFx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMSd9LFxuXHRcdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjInfVxuXHRcdFx0XHRcdF19LFxuXHRcdFx0XHRcdHt0aXRsZTogJ05vZGUgMid9XG5cdFx0XHRcdF0sXG5cblx0XHRcdFx0Y29udGV4dE1lbnU6IHtcblx0XHRcdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnLCBpY29uOiAnZWRpdCd9LFxuXHRcdFx0XHRcdGN1dDoge25hbWU6ICdDdXQnLCBpY29uOiAnY3V0J31cblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uVHJlZUFjdGl2YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0QWN0aXZlTm9kZSgpLnRpdGxlKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblRyZWVDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGFjdGlvbikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVDb250ZXh0TWVudScsIGFjdGlvbilcblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGROb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0XHRcdGlmIChhY3RpdmVOb2RlID09IG51bGwpIHtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBOb2RlJywgbGFiZWw6ICdOb2RlIHRpdGxlJ30sIGZ1bmN0aW9uKHRpdGxlKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGFjdGl2ZU5vZGUuYWRkTm9kZSh7dGl0bGV9KVxuXHRcdFx0XHRcdFx0YWN0aXZlTm9kZS5zZXRFeHBhbmRlZCh0cnVlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlU2VsTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YWN0aXZlTm9kZS5yZW1vdmUoKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQgXG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSwgLy8gQnJlc3QgY2l0eVxuXHRcdGxheWVyczoge1xuXHRcdFx0J2xheWVyMSc6IHtsYWJlbDogJ0xheWVyIDEnLCB2aXNpYmxlOiB0cnVlfSxcblx0XHRcdCdsYXllcjInOiB7bGFiZWw6ICdMYXllciAyJywgdmlzaWJsZTogdHJ1ZX1cblx0XHR9LFxuXHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnfSxcblx0XHRcdHNlcDoge25hbWU6ICctLSd9LFxuXHRcdFx0Y29weToge25hbWU6ICdDb3B5J31cblx0XHR9XHRcdFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uTWFwQ2xpY2s6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XHRcdFx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coJ29uTWFwQ2xpY2snLCBkYXRhKVxuXHRcdFx0Y29uc3Qge2xhdGxuZ30gPSBkYXRhXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLm1hcC51cGRhdGVTaGFwZSgnbWFya2VyJywge2xhdGxuZ30pXG5cdFx0XHR9XG5cdFx0XHRjYXRjaChlKSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdtYXJrZXInLCB7XG5cdFx0XHRcdFx0dHlwZTogJ21hcmtlcicsXG5cdFx0XHRcdFx0bGF0bG5nXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRvbk1hcENvbnRleHRNZW51OiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uTWFwQ29udGV4dE1lbnUnLCBkYXRhKVxuXHRcdH1cdFx0XG5cdH1cdFxufSlcblxuY3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMScsIHtcblx0dHlwZTogJ21hcmtlcicsXG5cdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ5MX0sXG5cdHJvdGF0aW9uQW5nbGU6IDIwLFxuXHRpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiAnYmx1ZSd9LFxuXHRwb3B1cENvbnRlbnQ6ICdIZWxsbyBXb3JsZCcsXG5cdGxheWVyOiAnbGF5ZXIxJ1xufSlcblxuY3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMicsIHtcblx0dHlwZTogJ2NpcmNsZScsXG5cdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ3MX0sXG5cdHJhZGl1czogMTAwLFxuXHRzdHlsZToge2NvbG9yOiAncmVkJ30sXG5cdGxheWVyOiAnbGF5ZXIyJ1xufSlcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5tYXBcIiBjbGFzcz1cIm1hcFwiIFxuXHRcdGJuLWRhdGE9XCJjZW50ZXI6IGNlbnRlciwgbGF5ZXJzOiBsYXllcnMsIGNvbnRleHRNZW51OiBjb250ZXh0TWVudVwiIFxuXHRcdGJuLWlmYWNlPVwibWFwXCJcblx0XHRibi1ldmVudD1cIm1hcGNsaWNrOiBvbk1hcENsaWNrLCBtYXBjb250ZXh0bWVudTogb25NYXBDb250ZXh0TWVudVwiXG5cdFx0ZGF0YS1zY2FsZT1cInRydWVcIlxuXHRcdGRhdGEtY29vcmRpbmF0ZXM9XCJ0cnVlXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1hcFxcXCIgY2xhc3M9XFxcIm1hcFxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwiY2VudGVyOiBjZW50ZXIsIGxheWVyczogbGF5ZXJzLCBjb250ZXh0TWVudTogY29udGV4dE1lbnVcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcIm1hcGNsaWNrOiBvbk1hcENsaWNrLCBtYXBjb250ZXh0bWVudTogb25NYXBDb250ZXh0TWVudVxcXCJcXG5cdFx0XHRkYXRhLXNjYWxlPVxcXCJ0cnVlXFxcIlxcblx0XHRcdGRhdGEtY29vcmRpbmF0ZXM9XFxcInRydWVcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LFxuXHRcdFx0XHRsYXllcnM6IHtcblx0XHRcdFx0XHQnbGF5ZXIxJzoge2xhYmVsOiAnTGF5ZXIgMScsIHZpc2libGU6IHRydWV9LFxuXHRcdFx0XHRcdCdsYXllcjInOiB7bGFiZWw6ICdMYXllciAyJywgdmlzaWJsZTogdHJ1ZX1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udGV4dE1lbnU6IHtcblx0XHRcdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnfSxcblx0XHRcdFx0XHRzZXA6IHtuYW1lOiAnLS0nfSxcblx0XHRcdFx0XHRjb3B5OiB7bmFtZTogJ0NvcHknfVxuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25NYXBDbGljazogZnVuY3Rpb24oZXYsIGRhdGEpIHtcdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uTWFwQ2xpY2snLCBkYXRhKVxuXHRcdFx0XHRcdGNvbnN0IHtsYXRsbmd9ID0gZGF0YVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC51cGRhdGVTaGFwZSgnbWFya2VyJywge2xhdGxuZ30pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoKGUpIHtcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdtYXJrZXInLCB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRcdFx0XHRsYXRsbmdcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbk1hcENvbnRleHRNZW51OiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENvbnRleHRNZW51JywgZGF0YSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLmN0cmwgPSBjdHJsXG5cblx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnc2hhcGUxJywge1xuXHRcdFx0dHlwZTogJ21hcmtlcicsXG5cdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxuXHRcdFx0cm90YXRpb25BbmdsZTogMjAsXG5cdFx0XHRpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiAnYmx1ZSd9LFxuXHRcdFx0cG9wdXBDb250ZW50OiAnSGVsbG8gV29ybGQnLFxuXHRcdFx0bGF5ZXI6ICdsYXllcjEnXG5cdFx0fSlcblxuXHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTInLCB7XG5cdFx0XHR0eXBlOiAnY2lyY2xlJyxcblx0XHRcdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ3MX0sXG5cdFx0XHRyYWRpdXM6IDEwMCxcblx0XHRcdHN0eWxlOiB7Y29sb3I6ICdyZWQnfSxcblx0XHRcdGxheWVyOiAnbGF5ZXIyJ1xuXHRcdH0pXG5cblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSwgLy8gQnJlc3QgY2l0eVxuXHRcdHBsdWdpbnM6IHtcblx0XHRcdCdlZGl0b3InOiB7ZWRpdExheWVyOiAnbGF5ZXIxJ31cblx0XHR9LFxuXHRcdGxheWVyczoge1xuXHRcdFx0J2xheWVyMSc6IHt2aXNpYmxlOiB0cnVlfVxuXHRcdH1cdFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uU2hhcGVDcmVhdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgU2hhcGUnLCBsYWJlbDogJ3NoYXBlIGlkOid9LCBmdW5jdGlvbihpZCkge1xuXHRcdFx0XHRkYXRhLmxheWVyID0gJ2xheWVyMSdcblx0XHRcdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoaWQsIGRhdGEpXG5cdFx0XHR9KVxuXG5cdFx0fSxcblx0XHRvblNoYXBlRWRpdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVFZGl0ZWQnLCBkYXRhKVxuXHRcdH0sXG5cdFx0b25TaGFwZURlbGV0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25TaGFwZURlbGV0ZWQnLCBkYXRhKVxuXHRcdH1cdFx0XHRcdFxuXHR9XHRcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5tYXBcIiBjbGFzcz1cIm1hcFwiIFxuXHRcdGJuLWRhdGE9XCJjZW50ZXI6IGNlbnRlciwgcGx1Z2luczogcGx1Z2lucywgbGF5ZXJzOiBsYXllcnNcIlxuXHRcdGJuLWV2ZW50PVwibWFwc2hhcGVjcmVhdGVkOiBvblNoYXBlQ3JlYXRlZCwgbWFwc2hhcGVlZGl0ZWQ6IG9uU2hhcGVFZGl0ZWQsXG5cdFx0IG1hcHNoYXBlZGVsZXRlZDogb25TaGFwZURlbGV0ZWRcIiBcblx0XHRibi1pZmFjZT1cIm1hcFwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTgnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5tYXBcXFwiIGNsYXNzPVxcXCJtYXBcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcImNlbnRlcjogY2VudGVyLCBwbHVnaW5zOiBwbHVnaW5zLCBsYXllcnM6IGxheWVyc1xcXCJcXG5cdFx0XHRibi1ldmVudD1cXFwibWFwc2hhcGVjcmVhdGVkOiBvblNoYXBlQ3JlYXRlZCwgbWFwc2hhcGVlZGl0ZWQ6IG9uU2hhcGVFZGl0ZWQsIG1hcHNoYXBlZGVsZXRlZDogb25TaGFwZURlbGV0ZWRcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHRcdFx0cGx1Z2luczoge1xuXHRcdFx0XHRcdCdlZGl0b3InOiB7ZWRpdExheWVyOiAnbGF5ZXIxJ31cblx0XHRcdFx0fSxcblx0XHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdFx0J2xheWVyMSc6IHt2aXNpYmxlOiB0cnVlfVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU2hhcGVDcmVhdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFNoYXBlJywgbGFiZWw6ICdzaGFwZSBpZDonfSwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0XHRcdGRhdGEubGF5ZXIgPSAnbGF5ZXIxJ1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoaWQsIGRhdGEpXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblNoYXBlRWRpdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRWRpdGVkJywgZGF0YSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25TaGFwZURlbGV0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVEZWxldGVkJywgZGF0YSlcblx0XHRcdFx0fVx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJylcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmh0bWxlZGl0b3JcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE5Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuaHRtbGVkaXRvclxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGh0bWxDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJ1xuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibWVzc2FnZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLXZhbD1cXFwibWVzc2FnZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvc3Bhbj48L3A+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdHNpemU6IDUwLFxuXHRcdG5hbWU6ICcnXG5cdH1cdFxufSlcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2PlxuXHRcdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD1cIjEwMFwiIGJuLXZhbD1cInNpemVcIiBibi11cGRhdGU9XCJpbnB1dFwiPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBibi12YWw9XCJuYW1lXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cdFxuXHQ8L2Rpdj5cblxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLm1pbHN5bWJvbFwiIGRhdGEtc2lkYz1cIlNGRy1VQ0ktLS0tRFwiIFxuXHRcdGJuLWRhdGE9XCJzaXplOiBzaXplLCBuYW1lOiBuYW1lXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyMCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIG1pbj1cXFwiMjBcXFwiIG1heD1cXFwiMTAwXFxcIiBibi12YWw9XFxcInNpemVcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjxicj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJuYW1lXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cdFxcblx0XHQ8L2Rpdj5cXG5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1pbHN5bWJvbFxcXCIgZGF0YS1zaWRjPVxcXCJTRkctVUNJLS0tLURcXFwiIGJuLWRhdGE9XFxcInNpemU6IHNpemUsIG5hbWU6IG5hbWVcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0c2l6ZTogNTAsXG5cdFx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGh0bWxDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRncmlkQ29sdW1uczogWyduYW1lJywgJ2xvY2F0aW9uJ10sXG5cdFx0Z3JpZERhdGE6IFtcblx0XHQgICB7IG5hbWU6ICdBbWVyaWNhbiBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ1NvdXRoZWFzdCBVbml0ZWQgU3RhdGVzJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0NoaW5lc2UgYWxsaWdhdG9yJywgbG9jYXRpb246ICdFYXN0ZXJuIENoaW5hJyB9LFxuXHRcdCAgIHsgbmFtZTogJ1NwZWN0YWNsZWQgY2FpbWFuJywgbG9jYXRpb246ICdDZW50cmFsICYgU291dGggQW1lcmljYScgfSxcblx0XHQgICB7IG5hbWU6ICdCcm9hZC1zbm91dGVkIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfSxcblx0XHQgICB7IG5hbWU6ICdKYWNhcsOpIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfSxcblx0XHQgICB7IG5hbWU6ICdCbGFjayBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH1cblx0XHQgXSxcblx0XHQgZmlsdGVyczoge2xvY2F0aW9uOiAnUycsIG5hbWU6ICcnfVxuXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uRmlsdGVyQ2hhbmdlOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc3QgZiA9ICQodGhpcykuZGF0YSgnZmlsdGVyJylcblx0XHRcdGN0cmwubW9kZWwuZmlsdGVyc1tmXSA9ICQodGhpcykudmFsKClcblx0XHRcdGN0cmwudXBkYXRlKCdmaWx0ZXJzJylcblx0XHR9XG5cdH1cdFxufSlcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWV2ZW50PVwiaW5wdXQuZmlsdGVyOiBvbkZpbHRlckNoYW5nZVwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZSBmaWx0ZXJcIiBibi12YWw9XCJmaWx0ZXJzLm5hbWVcIiBcblx0XHRcdGRhdGEtZmlsdGVyPVwibmFtZVwiIGNsYXNzPVwiZmlsdGVyXCI+XG5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImxvY2F0aW9uIGZpbHRlclwiIGJuLXZhbD1cImZpbHRlcnMubG9jYXRpb25cIlx0XHRcdFxuXHRcdFx0ZGF0YS1maWx0ZXI9XCJsb2NhdGlvblwiIGNsYXNzPVwiZmlsdGVyXCI+XG5cblx0XHRcblx0PC9kaXY+XG5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy50YWJsZVwiIFxuXHRcdGJuLWRhdGE9XCJkYXRhOiBncmlkRGF0YSwgY29sdW1uczogZ3JpZENvbHVtbnMsIGZpbHRlcnM6IGZpbHRlcnNcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDIxJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWV2ZW50PVxcXCJpbnB1dC5maWx0ZXI6IG9uRmlsdGVyQ2hhbmdlXFxcIiBjbGFzcz1cXFwiZmlsdGVycGFuZWxcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZSBmaWx0ZXJcXFwiIGJuLXZhbD1cXFwiZmlsdGVycy5uYW1lXFxcIiBcXG5cdFx0XHRcdGRhdGEtZmlsdGVyPVxcXCJuYW1lXFxcIiBjbGFzcz1cXFwiZmlsdGVyXFxcIj5cXG5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcImxvY2F0aW9uIGZpbHRlclxcXCIgIGJuLXZhbD1cXFwiZmlsdGVycy5sb2NhdGlvblxcXCJcdFx0XHRkYXRhLWZpbHRlcj1cXFwibG9jYXRpb25cXFwiIGNsYXNzPVxcXCJmaWx0ZXJcXFwiPlxcblxcblx0XHRcdFxcblx0XHQ8L2Rpdj5cXG5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYmxlXFxcIiBcXG5cdFx0XHRibi1kYXRhPVxcXCJkYXRhOiBncmlkRGF0YSwgY29sdW1uczogZ3JpZENvbHVtbnMsIGZpbHRlcnM6IGZpbHRlcnNcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGdyaWRDb2x1bW5zOiBbJ25hbWUnLCAnbG9jYXRpb24nXSxcblx0XHRcdFx0Z3JpZERhdGE6IFtcblx0XHRcdFx0ICAgeyBuYW1lOiAnQW1lcmljYW4gYWxsaWdhdG9yJywgbG9jYXRpb246ICdTb3V0aGVhc3QgVW5pdGVkIFN0YXRlcycgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnQ2hpbmVzZSBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ0Vhc3Rlcm4gQ2hpbmEnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ1NwZWN0YWNsZWQgY2FpbWFuJywgbG9jYXRpb246ICdDZW50cmFsICYgU291dGggQW1lcmljYScgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnQnJvYWQtc25vdXRlZCBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ0phY2Fyw6kgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdFx0XHQgICB7IG5hbWU6ICdCbGFjayBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH1cblx0XHRcdFx0IF0sXG5cdFx0XHRcdCBmaWx0ZXJzOiB7bG9jYXRpb246ICdTJywgbmFtZTogJyd9LFxuXHRcdFx0XHQganNDb2RlLFxuXHRcdFx0XHQgaHRtbENvZGVcblxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zdCBmID0gJCh0aGlzKS5kYXRhKCdmaWx0ZXInKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuZmlsdGVyc1tmXSA9ICQodGhpcykudmFsKClcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnZmlsdGVycycpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dWwgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiY1wiPjwvbGk+XG5cdDwvdWw+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QzJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx1bCBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHRcdDxsaSBibi10ZXh0PVxcXCJjXFxcIj48L2xpPlxcblx0XHQ8L3VsPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ10sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXHRcdFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKS5uYW1lKVxuXHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dWwgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiY1wiPjwvbGk+XG5cdDwvdWw+XG5cblx0PGgyPkFkZCBjbGllbnQ8L2gyPlxuXHQ8Zm9ybSBibi1ldmVudD1cInN1Ym1pdDogb25BZGRDbGllbnRcIj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuYW1lPVwibmFtZVwiIGF1dG9mb2N1cz1cIlwiIHJlcXVpcmVkPVwiXCI+XG5cdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+QWRkPC9idXR0b24+XG5cdDwvZm9ybT5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dWwgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdFx0XHQ8bGkgYm4tdGV4dD1cXFwiY1xcXCI+PC9saT5cXG5cdFx0PC91bD5cXG5cXG5cdFx0PGgyPkFkZCBjbGllbnQ8L2gyPlxcblx0XHQ8Zm9ybSBibi1ldmVudD1cXFwic3VibWl0OiBvbkFkZENsaWVudFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiBhdXRvZm9jdXM9XFxcIlxcXCIgcmVxdWlyZWQ9XFxcIlxcXCI+XFxuXHRcdFx0PGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiPkFkZDwvYnV0dG9uPlxcblx0XHQ8L2Zvcm0+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XHRcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpLm5hbWUpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0XG5cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgIGNsaWVudHM6IFtcblx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHQgICAgXVxuXHR9XHRcbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgPC90cj5cblx0XHQ8L3RoZWFkPlxuXHRcdDx0Ym9keSBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLmFnZVwiPjwvdGQ+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGJvZHk+XG5cdCBcblx0PC90YWJsZT5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDUnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICA8L3RyPlxcblx0XHRcdDwvdGhlYWQ+XFxuXHRcdFx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdFx0XHQ8dHI+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cdFx0IFxcblx0XHQ8L3RhYmxlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0XG5cdFx0XHR9XHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cdFx0fSxcblx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcblx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgICA8dGg+QWN0aW9uPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiIGJuLWV2ZW50PVwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFwiPlxuXHRcdFx0PHRyIGJuLWRhdGE9XCJpdGVtOiBjXCI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLmFnZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVwiZGVsQnRuXCIgdGl0bGU9XCJEZWxldGVcIj5EZWxldGU8L2J1dHRvbj5cblx0XHRcdDwvdHI+XG5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XHRcblxuXHQ8aDI+QWRkIGNsaWVudDwvaDI+XG5cdDxmb3JtIGJuLWV2ZW50PVwic3VibWl0OiBvbkFkZENsaWVudFwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgcmVxdWlyZWQ+PGJyPlxuXHRcdDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJhZ2VcIiBuYW1lPVwiYWdlXCIgcmVxdWlyZWQ+PGJyPlxuXHRcdDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJBZGRcIj5cblx0PC9mb3JtPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q2Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiIGJuLWV2ZW50PVxcXCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XFxcIj5cXG5cdFx0XHRcdDx0ciBibi1kYXRhPVxcXCJpdGVtOiBjXFxcIj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cXG5cdFx0IFxcblx0XHQ8L3RhYmxlPlx0XFxuXFxuXHRcdDxoMj5BZGQgY2xpZW50PC9oMj5cXG5cdFx0PGZvcm0gYm4tZXZlbnQ9XFxcInN1Ym1pdDogb25BZGRDbGllbnRcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHBsYWNlaG9sZGVyPVxcXCJhZ2VcXFwiIG5hbWU9XFxcImFnZVxcXCIgcmVxdWlyZWQ+PGJyPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCJBZGRcXFwiPlxcblx0XHQ8L2Zvcm0+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cdFwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHQgICAgaHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblx0XHRcdFx0fSxcblx0XHRcdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0dmFyIGRhdGEgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGF0YSgnaXRlbScpXG4gICAgICBcdFx0XHRcdHZhciBpZHggPSBjdHJsLm1vZGVsLmNsaWVudHMuaW5kZXhPZihkYXRhKVxuICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgsIGRhdGEpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0XG5cdFx0XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgZGxnQWRkQ2xpZW50ID0gJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIoe1xuXHR0aXRsZTogJ0FkZCBDbGllbnQnLFxuXHR0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJylcbn0pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgIGNsaWVudHM6IFtcblx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHQgICAgXVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRkbGdBZGRDbGllbnQuc2hvdyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKGRhdGEpXG5cdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcdFxuXHRcdFx0fSlcblx0XHR9LFxuXHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0dmFyIGRhdGEgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGF0YSgnaXRlbScpXG5cdFx0XHRcdHZhciBpZHggPSBjdHJsLm1vZGVsLmNsaWVudHMuaW5kZXhPZihkYXRhKVxuXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgsIGRhdGEpXG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHR9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0ICA8dHI+XG5cdFx0ICAgIDx0aD5OYW1lPC90aD5cblx0XHQgICAgPHRoPkFnZTwvdGg+XG5cdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxuXHRcdCAgPC90cj5cblx0XHQ8L3RoZWFkPlxuXHRcdDx0Ym9keSBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCIgYm4tZXZlbnQ9XCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XCI+XG5cdFx0XHQ8dHIgYm4tZGF0YT1cIml0ZW06IGNcIj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMuYWdlXCI+PC90ZD5cblx0XHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XCJkZWxCdG5cIiB0aXRsZT1cIkRlbGV0ZVwiPkRlbGV0ZTwvYnV0dG9uPlxuXHRcdFx0PC90cj5cblxuXHRcdDwvdGJvZHk+XG5cdCBcblx0PC90YWJsZT5cdFxuXG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGRDbGllbnRcIj5BZGQgQ2xpZW50PC9idXR0b24+XHRcbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiByZXF1aXJlZD48YnI+XG5cdDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJhZ2VcIiBuYW1lPVwiYWdlXCIgcmVxdWlyZWQ+PGJyPiBcbjwvZGl2PlxuXG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiIGJuLWV2ZW50PVxcXCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XFxcIj5cXG5cdFx0XHRcdDx0ciBibi1kYXRhPVxcXCJpdGVtOiBjXFxcIj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cXG5cdFx0IFxcblx0XHQ8L3RhYmxlPlx0XFxuXFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvbkFkZENsaWVudFxcXCI+QWRkIENsaWVudDwvYnV0dG9uPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2Plxcblxcblx0XFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGRsZ0FkZENsaWVudCA9ICQkLmZvcm1EaWFsb2dDb250cm9sbGVyKHtcblx0XHRcdHRpdGxlOiAnQWRkIENsaWVudCcsXG5cdFx0XHR0ZW1wbGF0ZTogXCI8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIHJlcXVpcmVkPjxicj5cXG48aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBwbGFjZWhvbGRlcj1cXFwiYWdlXFxcIiBuYW1lPVxcXCJhZ2VcXFwiIHJlcXVpcmVkPjxicj4gXHRcdFwiXG5cdFx0fSlcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHQgICAgaHRtbENvZGUsXG5cdFx0XHQgICAganNDb2RlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goZGF0YSlcblx0XHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcdFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuICAgICAgXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHRcdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGxnQWRkQ2xpZW50LmRlc3Ryb3koKVxuXHRcdH1cblx0fVxufSlcblxufSkoKTtcblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgIGZydWl0czpbJ29yYW5nZScsICdhcHBsZScsICdiYW5hbmFzJywgJ2xlbW9uJ10sXG5cdCAgZmF2b3JpdGVGcnVpdDonYXBwbGUnXG5cdH1cdFxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5GcnVpdHM8L2gyPlxuXHQ8cD5Zb3VyIGZhdm9yaXQgZnJ1aXQ6IDxzcGFuIGJuLXRleHQ9XCJmYXZvcml0ZUZydWl0XCI+PC9zcGFuPjwvcD5cblx0PHNlbGVjdCBibi1jb250cm9sPVwiYnJhaW5qcy5zZWxlY3RtZW51XCIgYm4tdmFsPVwiZmF2b3JpdGVGcnVpdFwiIFxuXHRcdGJuLXVwZGF0ZT1cInNlbGVjdG1lbnVjaGFuZ2VcIiBibi1lYWNoPVwiZiBvZiBmcnVpdHNcIj5cblx0XHQ8b3B0aW9uIGJuLXRleHQ9XCJmXCI+PC9vcHRpb24+XG5cdDwvc2VsZWN0PlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0OCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkZydWl0czwvaDI+XFxuXHRcdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cXFwiZmF2b3JpdGVGcnVpdFxcXCI+PC9zcGFuPjwvcD5cXG5cdFx0PHNlbGVjdCBibi1jb250cm9sPVxcXCJicmFpbmpzLnNlbGVjdG1lbnVcXFwiIGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdFxcXCIgYm4tdXBkYXRlPVxcXCJzZWxlY3RtZW51Y2hhbmdlXFxcIiBibi1lYWNoPVxcXCJmIG9mIGZydWl0c1xcXCI+XFxuXHRcdFx0PG9wdGlvbiBibi10ZXh0PVxcXCJmXFxcIj48L29wdGlvbj5cXG5cdFx0PC9zZWxlY3Q+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRmcnVpdHM6WydvcmFuZ2UnLCAnYXBwbGUnLCAnYmFuYW5hcycsICdsZW1vbiddLFxuXHRcdFx0XHRmYXZvcml0ZUZydWl0OidhcHBsZScsXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdCAgXG5cdFx0XHR9XHRcdFx0XG5cdFx0XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICBjbGllbnRzOltcblx0ICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH0sXG5cdCAgICAge25hbWU6ICdMdWNhcycsIGFnZTogMjJ9LFxuXHQgICAgIHtuYW1lOiAnUXVlbnRpbicsIGFnZTogMTV9LFxuXHQgICAgIHtuYW1lOiAnTGF1cmVudCcsIGFnZTogMzJ9XG5cdCAgIF0sXG5cdCAgIGZpbHRlcjonJyxcblx0ICAgZ2V0RmlsdGVyZWRDbGllbnRzOiBmdW5jdGlvbigpIHtcblx0ICAgICB2YXIgZmlsdGVyID0gdGhpcy5maWx0ZXJcblx0ICAgICByZXR1cm4gdGhpcy5jbGllbnRzLmZpbHRlcihmdW5jdGlvbihjbGllbnQpIHtcblx0ICAgICAgIHJldHVybiBjbGllbnQubmFtZS5zdGFydHNXaXRoKGZpbHRlcik7XG5cdCAgICAgfSlcblx0ICAgfSAgICBcblxuXHQgfVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgYnkgbmFtZVwiIGJuLXZhbD1cImZpbHRlclwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDx0YWJsZT5cblx0ICA8dGhlYWQ+XG5cdCAgICA8dHI+XG5cdCAgICAgIDx0aD5OYW1lPC90aD5cblx0ICAgICAgPHRoPkFnZTwvdGg+XG5cdCAgICA8L3RyPlxuXHQgIDwvdGhlYWQ+XG5cdCAgPHRib2R5IGJuLWVhY2g9XCJjbGllbnQgb2YgZ2V0RmlsdGVyZWRDbGllbnRzXCI+XG5cdCAgICA8dHI+XG5cdCAgICAgIDx0ZCBibi10ZXh0PVwiY2xpZW50Lm5hbWVcIj48L3RkPlxuXHQgICAgICA8dGQgYm4tdGV4dD1cImNsaWVudC5hZ2VcIj48L3RkPlxuXHQgICAgPC90cj5cblx0ICA8L3Rib2R5PlxuXHQgICBcblx0PC90YWJsZT5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDknLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG4gIDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuICAgIDxoMj5DbGllbnRzPC9oMj5cXG4gICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJmaWx0ZXIgYnkgbmFtZVxcXCIgYm4tdmFsPVxcXCJmaWx0ZXJcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcbiAgICA8dGFibGU+XFxuICAgICAgPHRoZWFkPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICA8dGg+TmFtZTwvdGg+XFxuICAgICAgICAgIDx0aD5BZ2U8L3RoPlxcbiAgICAgICAgPC90cj5cXG4gICAgICA8L3RoZWFkPlxcbiAgICAgIDx0Ym9keSBibi1lYWNoPVxcXCJjbGllbnQgb2YgZ2V0RmlsdGVyZWRDbGllbnRzXFxcIj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgPHRkIGJuLXRleHQ9XFxcImNsaWVudC5uYW1lXFxcIj48L3RkPlxcbiAgICAgICAgICA8dGQgYm4tdGV4dD1cXFwiY2xpZW50LmFnZVxcXCI+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgPC90Ym9keT5cXG4gICAgICAgXFxuICAgIDwvdGFibGU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcbiAgICA8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG4gIDwvZGl2PlxcbiAgPGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuICAgIDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG4gIDwvZGl2PiAgXFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgY2xpZW50czpbXG5cdFx0XHQgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH0sXG5cdFx0XHQgICAgIHtuYW1lOiAnTHVjYXMnLCBhZ2U6IDIyfSxcblx0XHRcdCAgICAge25hbWU6ICdRdWVudGluJywgYWdlOiAxNX0sXG5cdFx0XHQgICAgIHtuYW1lOiAnTGF1cmVudCcsIGFnZTogMzJ9XG5cdFx0XHQgICBdLFxuXHRcdFx0ICAgZmlsdGVyOicnLFxuXHRcdFx0ICAgZ2V0RmlsdGVyZWRDbGllbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdCAgICAgdmFyIGZpbHRlciA9IHRoaXMuZmlsdGVyXG5cdFx0XHQgICAgIHJldHVybiB0aGlzLmNsaWVudHMuZmlsdGVyKGZ1bmN0aW9uKGNsaWVudCkge1xuXHRcdFx0ICAgICAgIHJldHVybiBjbGllbnQubmFtZS5zdGFydHNXaXRoKGZpbHRlcik7XG5cdFx0XHQgICAgIH0pXG5cblx0XHRcdCAgIH0sXG5cdFx0XHQgICBodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XG5cblxuXHRcdFx0IH1cblxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuXG5cbiJdfQ==
