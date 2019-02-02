
$(function() {

	let routes = [
		{href: '/', redirect: '/test1'}
	]
	for(let i = 1; i <= 24; i++ ) {
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

		const ctrl = $$.viewController(elt, {
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

        items: [
            {"text": "\\uf015", "action": "toto", color: 'red'},
            {"text": "\\uf099", "color": "blue"}
            ],
        triggerPos: {
            "left": 100,
            "top": 200
        }
    },
    events: {
    	onMenuSelected: function(ev, data) {
    		console.log('onMenuSelected', data)
    	}
    }	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div style="width:300px; height: 300px; border: 1px solid black;">
	    <div bn-control="brainjs.circularmenu" 
	    	data-radius="120" 
	    	data-icon-pos="80" 
	    	data-inner-radius="40" 
	    	bn-event="menuSelected: onMenuSelected" 
	    	bn-data="items: items, triggerPos: triggerPos"></div>
	</div>
</div>
`.trim()


$$.control.registerControl('test22', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div style=\"width:300px; height: 300px; border: 1px solid black;\">\n		    <div bn-control=\"brainjs.circularmenu\" data-radius=\"120\" data-icon-pos=\"80\" data-inner-radius=\"40\" bn-event=\"menuSelected: onMenuSelected\" bn-data=\"items: items, triggerPos: triggerPos\"></div>\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {

		        items: [
		            {"text": "\uf015", "action": "toto", color: 'red'},
		            {"text": "\uf099", "color": "blue"}
		            ],
		        triggerPos: {
		            "left": 100,
		            "top": 200
		        },
		        jsCode,
		        htmlCode
		    },
		    events: {
		    	onMenuSelected: function(ev, data) {
		    		console.log('onMenuSelected', data)
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div class=\"map\" style=\"position: relative;\">\n			<div bn-control=\"brainjs.map\" style=\"height: 100%\" \n				bn-data=\"center: center, shapes: shapes\" \n				bn-iface=\"map\"\n				bn-event=\"mapshapecontextmenu: onMapShapeContextMenu\"\n				data-scale=\"true\"\n				data-coordinates=\"true\"></div>\n\n			<div bn-control=\"brainjs.circularmenu\"\n				style=\"position: relative;top: -100%\" \n				data-radius=\"80\" \n				data-icon-pos=\"50\" \n				data-inner-radius=\"20\"\n				data-has-trigger=\"false\" \n				bn-event=\"menuSelected: onMenuSelected, menuClosed: onMenuClosed\" \n				bn-data=\"items: items\"\n				bn-iface=\"menu\"></div>\n			\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		roll: 10,
		pitch: 10,
		altitude: 50,
		speed: 5
	}	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div>
		<div class="rangeinput">
			<label>Roll</label>			
			<input type="range" min="-50" max="50" bn-val="roll" bn-update="input"><br>
		</div>

		<div class="rangeinput">
			<label>Pitch</label>			
			<input type="range" min="-40" max="40" bn-val="pitch" bn-update="input"><br>
		</div>

		<div class="rangeinput">
			<label>Speed</label>			
			<input type="range" max="200" bn-val="speed" bn-update="input"><br>
		</div>

		<div class="rangeinput">
			<label>Altitude</label>			
			<input type="range" bn-val="altitude" bn-update="input"><br>
		</div>

	</div>

	<div bn-control="brainjs.flightpanel" 
		bn-data="roll: roll, pitch: pitch, speed: speed, altitude: altitude">
		
</div>
</div>
`.trim()


$$.control.registerControl('test24', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div>\n			<div class=\"rangeinput\">\n				<label>Roll</label>			\n				<input type=\"range\" min=\"-50\" max=\"50\" bn-val=\"roll\" bn-update=\"input\"><br>\n			</div>\n\n			<div class=\"rangeinput\">\n				<label>Pitch</label>			\n				<input type=\"range\" min=\"-40\" max=\"40\" bn-val=\"pitch\" bn-update=\"input\"><br>\n			</div>\n\n			<div class=\"rangeinput\">\n				<label>Speed</label>			\n				<input type=\"range\" max=\"200\" bn-val=\"speed\" bn-update=\"input\"><br>\n			</div>\n\n			<div class=\"rangeinput\">\n				<label>Altitude</label>			\n				<input type=\"range\" bn-val=\"altitude\" bn-update=\"input\"><br>\n			</div>\n\n		</div>\n\n		<div bn-control=\"brainjs.flightpanel\"\n			bn-data=\"roll: roll, pitch: pitch, speed: speed, altitude: altitude\">\n				\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				roll: 10,
				pitch: 10,
				altitude: 50,
				speed: 5,
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





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QxMy5qcyIsInRlc3QxNC5qcyIsInRlc3QxNS5qcyIsInRlc3QxNi5qcyIsInRlc3QxNy5qcyIsInRlc3QxOC5qcyIsInRlc3QxOS5qcyIsInRlc3QyLmpzIiwidGVzdDIwLmpzIiwidGVzdDIxLmpzIiwidGVzdDIyLmpzIiwidGVzdDIzLmpzIiwidGVzdDI0LmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuJChmdW5jdGlvbigpIHtcblxuXHRsZXQgcm91dGVzID0gW1xuXHRcdHtocmVmOiAnLycsIHJlZGlyZWN0OiAnL3Rlc3QxJ31cblx0XVxuXHRmb3IobGV0IGkgPSAxOyBpIDw9IDI0OyBpKysgKSB7XG5cdFx0cm91dGVzLnB1c2goe1xuXHRcdFx0aHJlZjogJy90ZXN0JyArIGksIGNvbnRyb2w6ICd0ZXN0JyArIGlcblx0XHR9KVxuXHR9XG5cblxuXG5cdCQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0XHRkYXRhOiB7XG5cdFx0XHRyb3V0ZXNcblx0XHR9XG5cdH0pXG59KTtcbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cIm1lc3NhZ2VcIj48L3NwYW4+PC9wPlx0XG48L2Rpdj5cbmAudHJpbSgpXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PHAgYm4tdGV4dD1cXFwibWVzc2FnZVxcXCI+PC9wPlx0XHRcdFx0XHRcdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnLFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgcmFkaXVzOjEwXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHN2ZyBoZWlnaHQ9XCIxMDBcIiB3aWR0aD1cIjEwMFwiPlxuXHQgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiBibi1hdHRyPVwicjogcmFkaXVzXCIgc3Ryb2tlPVwiYmxhY2tcIiBzdHJva2Utd2lkdGg9XCIzXCIgZmlsbD1cInJlZFwiIC8+XG5cdDwvc3ZnPlxuXHQgIFxuXHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgYm4tdmFsPVwicmFkaXVzXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PHN2ZyBoZWlnaHQ9XFxcIjEwMFxcXCIgd2lkdGg9XFxcIjEwMFxcXCI+XFxuXHRcdCAgPGNpcmNsZSBjeD1cXFwiNTBcXFwiIGN5PVxcXCI1MFxcXCIgYm4tYXR0cj1cXFwicjogcmFkaXVzXFxcIiBzdHJva2U9XFxcImJsYWNrXFxcIiBzdHJva2Utd2lkdGg9XFxcIjNcXFwiIGZpbGw9XFxcInJlZFxcXCIgLz5cXG5cdFx0PC9zdmc+XFxuXHRcdCAgXFxuXHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgYm4tdmFsPVxcXCJyYWRpdXNcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICByYWRpdXM6MTAsXG5cdFx0XHQgIGh0bWxDb2RlLFxuXHRcdFx0ICBqc0NvZGVcblx0XHRcdH1cblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdNeVRhYmxlJywgeyAgIFxuICAgIHByb3BzOiB7XG4gICAgXHRjbGllbnRzOiBbXVxuICAgIH0sXG4gICAgdGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuICAgIFx0Y29uc29sZS5sb2coJ2luaXQnLCB0aGlzLnByb3BzKVxuICAgICAgXG4gICAgICB0aGlzLmN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNsaWVudHM6IHRoaXMucHJvcHMuY2xpZW50c1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgfSBcbiAgfVxuKVxuXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHQgIG15Q2xpZW50czogW1xuXHQgICAge25hbWU6ICdRdWVudGluJywgY2l0eTogJ1Jlbm5lcyd9LFxuXHQgICAge25hbWU6ICdNYXJjJywgY2l0eTogJ0JldGh1bmUnfVxuXHQgIF0sXG5cdCAgbXlDbGllbnRzMjogW1xuXHQgICAge25hbWU6ICdCcmlnaXR0ZScsIGNpdHk6ICdMZSBNYW5zJ30sXG5cdCAgICB7bmFtZTogJ0dlb3JnZXMnLCBjaXR5OiAnVmVycXVpbid9XG5cdCAgXVxuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DdXN0b20gY29udHJvbDwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cIk15VGFibGVcIiBibi1kYXRhPVwiY2xpZW50czogbXlDbGllbnRzXCI+PC9kaXY+XG5cdDxocj5cblx0PGRpdiBibi1jb250cm9sPVwiTXlUYWJsZVwiIGJuLWRhdGE9XCJjbGllbnRzOiBteUNsaWVudHMyXCI+PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0aD5OYW1lPC90aD5cblx0XHRcdFx0PHRoPkNpdHk8L3RoPlxuXHRcdFx0PC90cj5cblx0XHQ8L3RoZWFkPlxuXG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMuY2l0eVwiPjwvdGQ+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGJvZHk+XG5cdDwvdGFibGU+XHRcbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFibGUnLCB7ICAgXG4gICAgcHJvcHM6IHtcbiAgICBcdGNsaWVudHM6IFtdXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXCI8dGFibGU+XFxuXHQ8dGhlYWQ+XFxuXHRcdDx0cj5cXG5cdFx0XHQ8dGg+TmFtZTwvdGg+XFxuXHRcdFx0PHRoPkNpdHk8L3RoPlxcblx0XHQ8L3RyPlxcblx0PC90aGVhZD5cXG5cXG5cdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHQ8dHI+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5jaXR5XFxcIj48L3RkPlxcblx0XHQ8L3RyPlxcblx0PC90Ym9keT5cXG48L3RhYmxlPlx0XCIsXG4gICAgaW5pdDogZnVuY3Rpb24oZWx0KSB7XG4gICAgXHRjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMucHJvcHMpXG4gICAgICBcbiAgICAgIHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY2xpZW50czogdGhpcy5wcm9wcy5jbGllbnRzXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9IFxuICB9XG4pXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdCAgPGgyPkN1c3RvbSBjb250cm9sPC9oMj5cXG5cdFx0ICA8ZGl2IGJuLWNvbnRyb2w9XFxcIk15VGFibGVcXFwiIGJuLWRhdGE9XFxcImNsaWVudHM6IG15Q2xpZW50c1xcXCI+PC9kaXY+XFxuXHRcdCAgPGhyPlxcblx0XHQgIDxkaXYgYm4tY29udHJvbD1cXFwiTXlUYWJsZVxcXCIgYm4tZGF0YT1cXFwiY2xpZW50czogbXlDbGllbnRzMlxcXCI+PC9kaXY+XFxuXHRcdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHQgIG15Q2xpZW50czogW1xuXHRcdFx0ICAgIHtuYW1lOiAnUXVlbnRpbicsIGNpdHk6ICdSZW5uZXMnfSxcblx0XHRcdCAgICB7bmFtZTogJ01hcmMnLCBjaXR5OiAnQmV0aHVuZSd9XG5cdFx0XHQgIF0sXG5cdFx0XHQgIG15Q2xpZW50czI6IFtcblx0XHRcdCAgICB7bmFtZTogJ0JyaWdpdHRlJywgY2l0eTogJ0xlIE1hbnMnfSxcblx0XHRcdCAgICB7bmFtZTogJ0dlb3JnZXMnLCBjaXR5OiAnVmVycXVpbid9XG5cdFx0XHQgIF0sXG5cdFx0XHQgIGh0bWxDb2RlLFxuXHRcdFx0ICBqc0NvZGVcblx0XHRcdH0gXG5cdFx0XHQgXG5cblx0XHR9KVxuXHR9XG59KTtcblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0ZmF2b3JpdGVGcnVpdHM6WydhcHBsZScsICdvcmFuZ2UnXSxcblx0XHRnZW5kZXI6ICdtYWxlJ1xuXHR9IFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+RnJ1aXRzPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jaGVja2dyb3VwXCIgYm4tdmFsPVwiZmF2b3JpdGVGcnVpdHNcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cIm9yYW5nZVwiPk9yYW5nZVxuXHQgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cImJhbmFuYXNcIj5CYW5hbmFzXG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwiYXBwbGVcIj5BcHBsZVxuXHQgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cImxlbW9uXCI+TGVtb25cblx0PC9kaXY+XG5cblx0ICA8cD5Zb3VyIGZhdm9yaXQgZnJ1aXRzOiA8c3BhbiBibi10ZXh0PVwiZmF2b3JpdGVGcnVpdHNcIj48L3NwYW4+PC9wPlxuXG5cdDxoMj5HZW5kZXI8L2gyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnJhZGlvZ3JvdXBcIiBibi12YWw9XCJnZW5kZXJcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cIm1hbGVcIj5NYWxlXG5cdCAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwiZmVtYWxlXCI+RmVtYWxlXG5cdDwvZGl2PlxuXHQ8cD5HZW5kZXI6IDxzcGFuIGJuLXRleHQ9XCJnZW5kZXJcIj48L3NwYW4+PC9wPlxuPC9kaXY+XG5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkZydWl0czwvaDI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5jaGVja2dyb3VwXFxcIiBibi12YWw9XFxcImZhdm9yaXRlRnJ1aXRzXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIHZhbHVlPVxcXCJvcmFuZ2VcXFwiPk9yYW5nZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImJhbmFuYXNcXFwiPkJhbmFuYXNcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIHZhbHVlPVxcXCJhcHBsZVxcXCI+QXBwbGVcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIHZhbHVlPVxcXCJsZW1vblxcXCI+TGVtb25cXG5cdFx0PC9kaXY+XFxuXHRcdFxcblx0XHQgIDxwPllvdXIgZmF2b3JpdCBmcnVpdHM6IDxzcGFuIGJuLXRleHQ9XFxcImZhdm9yaXRlRnJ1aXRzXFxcIj48L3NwYW4+PC9wPlxcblxcblx0XHQ8aDI+R2VuZGVyPC9oMj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnJhZGlvZ3JvdXBcXFwiIGJuLXZhbD1cXFwiZ2VuZGVyXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIHZhbHVlPVxcXCJtYWxlXFxcIj5NYWxlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiB2YWx1ZT1cXFwiZmVtYWxlXFxcIj5GZW1hbGVcXG5cdFx0PC9kaXY+XFxuXHRcdDxwPkdlbmRlcjogPHNwYW4gYm4tdGV4dD1cXFwiZ2VuZGVyXFxcIj48L3NwYW4+PC9wPlxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0ZmF2b3JpdGVGcnVpdHM6WydhcHBsZScsICdvcmFuZ2UnXSxcblx0XHRcdFx0Z2VuZGVyOiAnbWFsZScsXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGVcblx0XHRcdH0gXG5cdFx0XHQgXG5cblx0XHR9KVxuXHR9XG59KTtcblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdNeVRhYkN0cmwnLCB7XG5cdHRlbXBsYXRlOiAkKCcjdGVtcGxhdGUnKSxcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8nXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG59KVxuXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblRhYkFjdGl2YXRlOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVGFiQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpKVxuXHRcdH0sXG5cdFx0b25BZGRUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRUYWInKVxuXHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8cD5Hb29kIG1vcm5pbmc8cD4nXG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXG5cdFx0fSxcblx0XHRvbkFkZEN0cmxUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDdHJsVGFiJylcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGNvbnRyb2w6ICdNeVRhYkN0cmwnXG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXG5cdFx0fSxcblx0XHRvblNob3dUYWJJbmZvOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc3QgY291bnQgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFic0NvdW50KClcblx0XHRcdGNvbnN0IHNlbElkeCA9IGN0cmwuc2NvcGUudGFicy5nZXRTZWxlY3RlZFRhYkluZGV4KClcblx0XHRcdGNvbnN0IHRpdGxlID0gY3RybC5zY29wZS50YWJzLmdldFRhYkluZm8oc2VsSWR4KS50aXRsZVxuXHRcdFx0Y29uc3QgY29udGVudCA9IFxcYFxuXHRcdFx0XHQ8cD5UYWJzQ291bnQ6IFxcJHtjb3VudH08L3A+XG5cdFx0XHRcdDxwPlNlbEluZGV4OiBcXCR7c2VsSWR4fTwvcD5cblx0XHRcdFx0PHA+U2VsVGFiIFRpdGxlOiBcXCR7dGl0bGV9PHA+XG5cdFx0XHRcXGBcblx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudH0pXG5cdFx0fSxcblx0XHRvblJlbW92ZVNlbFRhYjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRjdHJsLnNjb3BlLnRhYnMucmVtb3ZlVGFiKHNlbElkeClcblx0XHR9XG5cdH1cdFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRhYnNcIiBibi1pZmFjZT1cInRhYnNcIiBibi1ldmVudD1cInRhYnNhY3RpdmF0ZTogb25UYWJBY3RpdmF0ZVwiPlxuXHRcdDxkaXYgdGl0bGU9XCJUYWIgMVwiPlxuXHRcdFx0PHA+SGVsbG8gV29ybGQ8L3A+XG5cdFx0PC9kaXY+XG5cdFx0PGRpdiB0aXRsZT1cIlRhYiAyXCI+XG5cdFx0XHQ8cD5Cb25qb3VyIGxlIG1vbmRlPC9wPlxuXHRcdDwvZGl2PlxuXHQ8L2Rpdj5cblx0PGJyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmNvbnRyb2xncm91cFwiPlx0XHRcdFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGRUYWJcIj5BZGQgVGFiPC9idXR0b24+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZEN0cmxUYWJcIj5BZGQgQ29udHJvbCBUYWI8L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uU2hvd1RhYkluZm9cIj5TaG93IFRhYiBJbmZvPC9idXR0b24+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvblJlbW92ZVNlbFRhYlwiPlJlbW92ZSBTZWwgVGFiPC9idXR0b24+XG5cdDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgaWQ9XCJ0ZW1wbGF0ZVwiIGhpZGRlbj1cIlwiPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBibi12YWw9XCJtZXNzYWdlXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cIm1lc3NhZ2VcIj48L3NwYW4+PC9wPlx0XG48L2Rpdj5cblxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMy10YWJjdHJsJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2Plxcblx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLXZhbD1cXFwibWVzc2FnZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3NwYW4+PC9wPlx0XHRcXG48L2Rpdj5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8nXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG59KVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEzJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCIgYm4taWZhY2U9XFxcInRhYnNcXFwiIGJuLWV2ZW50PVxcXCJ0YWJzYWN0aXZhdGU6IG9uVGFiQWN0aXZhdGVcXFwiPlxcblx0XHRcdDxkaXYgdGl0bGU9XFxcIlRhYiAxXFxcIj5cXG5cdFx0XHRcdDxwPkhlbGxvIFdvcmxkPC9wPlxcblx0XHRcdDwvZGl2Plxcblx0XHRcdDxkaXYgdGl0bGU9XFxcIlRhYiAyXFxcIj5cXG5cdFx0XHRcdDxwPkJvbmpvdXIgbGUgbW9uZGU8L3A+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0XHQ8YnI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5jb250cm9sZ3JvdXBcXFwiPlx0XHRcdFxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvbkFkZFRhYlxcXCI+QWRkIFRhYjwvYnV0dG9uPlxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvbkFkZEN0cmxUYWJcXFwiPkFkZCBDb250cm9sIFRhYjwvYnV0dG9uPlxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblNob3dUYWJJbmZvXFxcIj5TaG93IFRhYiBJbmZvPC9idXR0b24+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uUmVtb3ZlU2VsVGFiXFxcIj5SZW1vdmUgU2VsIFRhYjwvYnV0dG9uPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGVcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25UYWJBY3RpdmF0ZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UYWJBY3RpdmF0ZScsICQodGhpcykuaWZhY2UoKS5nZXRTZWxlY3RlZFRhYkluZGV4KCkpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQWRkVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZFRhYicpXG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0dGVtcGxhdGU6ICc8cD5Hb29kIG1vcm5pbmc8cD4nXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGRDdHJsVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZEN0cmxUYWInKVxuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2w6ICd0ZXN0MTMtdGFiY3RybCdcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblNob3dUYWJJbmZvOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnN0IGNvdW50ID0gY3RybC5zY29wZS50YWJzLmdldFRhYnNDb3VudCgpXG5cdFx0XHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0XHRcdGNvbnN0IHRpdGxlID0gY3RybC5zY29wZS50YWJzLmdldFRhYkluZm8oc2VsSWR4KS50aXRsZVxuXHRcdFx0XHRcdGNvbnN0IGNvbnRlbnQgPSBgXG5cdFx0XHRcdFx0XHQ8cD5UYWJzQ291bnQ6ICR7Y291bnR9PC9wPlxuXHRcdFx0XHRcdFx0PHA+U2VsSW5kZXg6ICR7c2VsSWR4fTwvcD5cblx0XHRcdFx0XHRcdDxwPlNlbFRhYiBUaXRsZTogJHt0aXRsZX08cD5cblx0XHRcdFx0XHRgXG5cdFx0XHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50fSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25SZW1vdmVTZWxUYWI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IHNlbElkeCA9IGN0cmwuc2NvcGUudGFicy5nZXRTZWxlY3RlZFRhYkluZGV4KClcblx0XHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMucmVtb3ZlVGFiKHNlbElkeClcblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdCBcblx0XHR9KVxuXG5cdFx0Y29uc29sZS5sb2coJ3Njb3BlJywgY3RybC5zY29wZSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0ZGF0ZTogbmV3IERhdGUoMTk3MiwgMCwgMyksXG5cdFx0Zm9ybWF0ZWREYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmRhdGUudG9EYXRlU3RyaW5nKClcblx0XHR9XHRcdFxuXHR9LFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBibi1jb250cm9sPVwiYnJhaW5qcy5kYXRlcGlja2VyXCIgYm4tdmFsPVwiZGF0ZVwiIGJuLXVwZGF0ZT1cImRhdGVwaWNrZXJjaGFuZ2VcIj5cblx0PHA+RGF0ZTogPHNwYW4gYm4tdGV4dD1cImZvcm1hdGVkRGF0ZVwiPjwvc3Bhbj48L3A+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdCBcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi1jb250cm9sPVxcXCJicmFpbmpzLmRhdGVwaWNrZXJcXFwiIGJuLXZhbD1cXFwiZGF0ZVxcXCIgYm4tdXBkYXRlPVxcXCJkYXRlcGlja2VyY2hhbmdlXFxcIj5cXG5cdCBcdDxwPkRhdGU6IDxzcGFuIGJuLXRleHQ9XFxcImZvcm1hdGVkRGF0ZVxcXCI+PC9zcGFuPjwvcD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0ZGF0ZTogbmV3IERhdGUoMTk3MiwgMCwgMyksXG5cdFx0XHRcdGZvcm1hdGVkRGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0fSxcblx0XHQgXG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGlzU3RhcnRlZDogZmFsc2Vcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25TdGFydDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjdHJsLnNldERhdGEoe2lzU3RhcnRlZDogdHJ1ZX0pXG5cdFx0XHRjdHJsLnNjb3BlLmNhbWVyYS5zdGFydCgpXG5cdFx0fSxcblx0XHRvblRha2VQaWN0dXJlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRha2VQaWN0dXJlJylcblx0XHRcdHZhciB1cmwgPSBjdHJsLnNjb3BlLmNhbWVyYS50YWtlUGljdHVyZSgpXG5cdFx0XHR2YXIgY29udGVudCA9IFxcYDxpbWcgc3JjPVwiXFwke3VybH1cIj5cXGBcblx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudCwgd2lkdGg6ICdhdXRvJ30pXG5cdFx0fVx0XHRcdFxuXHR9XHRcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvblN0YXJ0XCIgYm4tc2hvdz1cIiFpc1N0YXJ0ZWRcIj5TdGFydDwvYnV0dG9uPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uVGFrZVBpY3R1cmVcIiBibi1zaG93PVwiaXNTdGFydGVkXCI+VGFrZSBQaWN0dXJlPC9idXR0b24+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2FtZXJhXCIgYm4taWZhY2U9XCJjYW1lcmFcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE1Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25TdGFydFxcXCIgYm4tc2hvdz1cXFwiIWlzU3RhcnRlZFxcXCI+U3RhcnQ8L2J1dHRvbj5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uVGFrZVBpY3R1cmVcXFwiIGJuLXNob3c9XFxcImlzU3RhcnRlZFxcXCI+VGFrZSBQaWN0dXJlPC9idXR0b24+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5jYW1lcmFcXFwiIGJuLWlmYWNlPVxcXCJjYW1lcmFcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0aXNTdGFydGVkOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjdHJsLnNldERhdGEoe2lzU3RhcnRlZDogdHJ1ZX0pXG5cdFx0XHRcdFx0Y3RybC5zY29wZS5jYW1lcmEuc3RhcnQoKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblRha2VQaWN0dXJlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UYWtlUGljdHVyZScpXG5cdFx0XHRcdFx0dmFyIHVybCA9IGN0cmwuc2NvcGUuY2FtZXJhLnRha2VQaWN0dXJlKClcblx0XHRcdFx0XHR2YXIgY29udGVudCA9IGA8aW1nIHNyYz1cIiR7dXJsfVwiPmBcblx0XHRcdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnQsIHdpZHRoOiAnYXV0byd9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0IFxuXHRcdH0pXG5cblx0XHR0aGlzLmN0cmwgPSBjdHJsXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRzb3VyY2U6IFtcblx0XHRcdHt0aXRsZTogJ05vZGUgMScsIGZvbGRlcjogdHJ1ZSwgY2hpbGRyZW46IFtcblx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjEnfSxcblx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjInfVxuXHRcdFx0XX0sXG5cdFx0XHR7dGl0bGU6ICdOb2RlIDInfVxuXHRcdF0sXG5cdFx0Y29udGV4dE1lbnU6IHtcblx0XHRcdGVkaXQ6IHtuYW1lOiAnRWRpdCcsIGljb246ICdlZGl0J30sXG5cdFx0XHRjdXQ6IHtuYW1lOiAnQ3V0JywgaWNvbjogJ2N1dCd9XG5cdFx0fVx0XHRcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25UcmVlQWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVHJlZUFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldEFjdGl2ZU5vZGUoKS50aXRsZSlcblx0XHR9LFxuXHRcdG9uVHJlZUNvbnRleHRNZW51OiBmdW5jdGlvbihldiwgYWN0aW9uKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQ29udGV4dE1lbnUnLCBhY3Rpb24pXG5cdFx0fSxcblx0XHRvbkFkZE5vZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdGlmIChhY3RpdmVOb2RlID09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBOb2RlJywgbGFiZWw6ICdOb2RlIHRpdGxlJ30sIGZ1bmN0aW9uKHRpdGxlKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRhY3RpdmVOb2RlLmFkZE5vZGUoe3RpdGxlfSlcblx0XHRcdFx0YWN0aXZlTm9kZS5zZXRFeHBhbmRlZCh0cnVlKVxuXHRcdFx0fSlcblx0XHR9LFxuXHRcdG9uUmVtb3ZlU2VsTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdGFjdGl2ZU5vZGUucmVtb3ZlKClcblx0XHR9XG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy50cmVlXCIgXG5cdFx0Ym4tZGF0YT1cInNvdXJjZTogc291cmNlLCBjb250ZXh0TWVudTogY29udGV4dE1lbnVcIiBcblx0XHRibi1ldmVudD1cInRyZWVhY3RpdmF0ZTogb25UcmVlQWN0aXZhdGUsIHRyZWVjb250ZXh0bWVudTogb25UcmVlQ29udGV4dE1lbnVcIiBcblx0XHRibi1pZmFjZT1cInRyZWVcIj48L2Rpdj5cblx0PGJyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmNvbnRyb2xncm91cFwiPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGROb2RlXCI+QWRkIE5vZGU8L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uUmVtb3ZlU2VsTm9kZVwiPlJlbW92ZSBTZWxOb2RlPC9idXR0b24+XHRcdFx0XHRcblx0PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRyZWVcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcInNvdXJjZTogc291cmNlLCBjb250ZXh0TWVudTogY29udGV4dE1lbnVcXFwiIFxcblx0XHRcdGJuLWV2ZW50PVxcXCJ0cmVlYWN0aXZhdGU6IG9uVHJlZUFjdGl2YXRlLCB0cmVlY29udGV4dG1lbnU6IG9uVHJlZUNvbnRleHRNZW51XFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwidHJlZVxcXCI+PC9kaXY+XFxuXHRcdDxicj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNvbnRyb2xncm91cFxcXCI+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkTm9kZVxcXCI+QWRkIE5vZGU8L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25SZW1vdmVTZWxOb2RlXFxcIj5SZW1vdmUgU2VsTm9kZTwvYnV0dG9uPlx0XHRcdFx0XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0c291cmNlOiBbXG5cdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxJywgZm9sZGVyOiB0cnVlLCBjaGlsZHJlbjogW1xuXHRcdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjEnfSxcblx0XHRcdFx0XHRcdHt0aXRsZTogJ05vZGUgMS4yJ31cblx0XHRcdFx0XHRdfSxcblx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDInfVxuXHRcdFx0XHRdLFxuXG5cdFx0XHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0JywgaWNvbjogJ2VkaXQnfSxcblx0XHRcdFx0XHRjdXQ6IHtuYW1lOiAnQ3V0JywgaWNvbjogJ2N1dCd9XG5cdFx0XHRcdH1cblx0XHRcdFxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblRyZWVBY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uVHJlZUFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldEFjdGl2ZU5vZGUoKS50aXRsZSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25UcmVlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBhY3Rpb24pIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQ29udGV4dE1lbnUnLCBhY3Rpb24pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQWRkTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgTm9kZScsIGxhYmVsOiAnTm9kZSB0aXRsZSd9LCBmdW5jdGlvbih0aXRsZSkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRhY3RpdmVOb2RlLmFkZE5vZGUoe3RpdGxlfSlcblx0XHRcdFx0XHRcdGFjdGl2ZU5vZGUuc2V0RXhwYW5kZWQodHJ1ZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZVNlbE5vZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFjdGl2ZU5vZGUucmVtb3ZlKClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0IFxuXHRcdH0pXG5cblx0XHR0aGlzLmN0cmwgPSBjdHJsXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sIC8vIEJyZXN0IGNpdHlcblx0XHRsYXllcnM6IHtcblx0XHRcdCdsYXllcjEnOiB7bGFiZWw6ICdMYXllciAxJywgdmlzaWJsZTogdHJ1ZX0sXG5cdFx0XHQnbGF5ZXIyJzoge2xhYmVsOiAnTGF5ZXIgMicsIHZpc2libGU6IHRydWV9XG5cdFx0fSxcblx0XHRjb250ZXh0TWVudToge1xuXHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0J30sXG5cdFx0XHRzZXA6IHtuYW1lOiAnLS0nfSxcblx0XHRcdGNvcHk6IHtuYW1lOiAnQ29weSd9XG5cdFx0fVx0XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbk1hcENsaWNrOiBmdW5jdGlvbihldiwgZGF0YSkge1x0XHRcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgZGF0YSlcblx0XHRcdGNvbnN0IHtsYXRsbmd9ID0gZGF0YVxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoJ21hcmtlcicsIHtsYXRsbmd9KVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnbWFya2VyJywge1xuXHRcdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRcdGxhdGxuZ1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25NYXBDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENvbnRleHRNZW51JywgZGF0YSlcblx0XHR9XHRcdFxuXHR9XHRcbn0pXG5cbmN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTEnLCB7XG5cdHR5cGU6ICdtYXJrZXInLFxuXHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxuXHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ2JsdWUnfSxcblx0cG9wdXBDb250ZW50OiAnSGVsbG8gV29ybGQnLFxuXHRsYXllcjogJ2xheWVyMSdcbn0pXG5cbmN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTInLCB7XG5cdHR5cGU6ICdjaXJjbGUnLFxuXHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRyYWRpdXM6IDEwMCxcblx0c3R5bGU6IHtjb2xvcjogJ3JlZCd9LFxuXHRsYXllcjogJ2xheWVyMidcbn0pXG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgY2xhc3M9XCJtYXBcIiBcblx0XHRibi1kYXRhPVwiY2VudGVyOiBjZW50ZXIsIGxheWVyczogbGF5ZXJzLCBjb250ZXh0TWVudTogY29udGV4dE1lbnVcIiBcblx0XHRibi1pZmFjZT1cIm1hcFwiXG5cdFx0Ym4tZXZlbnQ9XCJtYXBjbGljazogb25NYXBDbGljaywgbWFwY29udGV4dG1lbnU6IG9uTWFwQ29udGV4dE1lbnVcIlxuXHRcdGRhdGEtc2NhbGU9XCJ0cnVlXCJcblx0XHRkYXRhLWNvb3JkaW5hdGVzPVwidHJ1ZVwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTcnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5tYXBcXFwiIGNsYXNzPVxcXCJtYXBcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcImNlbnRlcjogY2VudGVyLCBsYXllcnM6IGxheWVycywgY29udGV4dE1lbnU6IGNvbnRleHRNZW51XFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwibWFwXFxcIlxcblx0XHRcdGJuLWV2ZW50PVxcXCJtYXBjbGljazogb25NYXBDbGljaywgbWFwY29udGV4dG1lbnU6IG9uTWFwQ29udGV4dE1lbnVcXFwiXFxuXHRcdFx0ZGF0YS1zY2FsZT1cXFwidHJ1ZVxcXCJcXG5cdFx0XHRkYXRhLWNvb3JkaW5hdGVzPVxcXCJ0cnVlXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdFx0J2xheWVyMSc6IHtsYWJlbDogJ0xheWVyIDEnLCB2aXNpYmxlOiB0cnVlfSxcblx0XHRcdFx0XHQnbGF5ZXIyJzoge2xhYmVsOiAnTGF5ZXIgMicsIHZpc2libGU6IHRydWV9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0J30sXG5cdFx0XHRcdFx0c2VwOiB7bmFtZTogJy0tJ30sXG5cdFx0XHRcdFx0Y29weToge25hbWU6ICdDb3B5J31cblx0XHRcdFx0fVxuXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uTWFwQ2xpY2s6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgZGF0YSlcblx0XHRcdFx0XHRjb25zdCB7bGF0bG5nfSA9IGRhdGFcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoJ21hcmtlcicsIHtsYXRsbmd9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnbWFya2VyJywge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0XHRcdFx0bGF0bG5nXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0b25NYXBDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NYXBDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy5jdHJsID0gY3RybFxuXG5cdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMScsIHtcblx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDkxfSxcblx0XHRcdHJvdGF0aW9uQW5nbGU6IDIwLFxuXHRcdFx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ2JsdWUnfSxcblx0XHRcdHBvcHVwQ29udGVudDogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdGxheWVyOiAnbGF5ZXIxJ1xuXHRcdH0pXG5cblx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnc2hhcGUyJywge1xuXHRcdFx0dHlwZTogJ2NpcmNsZScsXG5cdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRcdFx0cmFkaXVzOiAxMDAsXG5cdFx0XHRzdHlsZToge2NvbG9yOiAncmVkJ30sXG5cdFx0XHRsYXllcjogJ2xheWVyMidcblx0XHR9KVxuXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sIC8vIEJyZXN0IGNpdHlcblx0XHRwbHVnaW5zOiB7XG5cdFx0XHQnZWRpdG9yJzoge2VkaXRMYXllcjogJ2xheWVyMSd9XG5cdFx0fSxcblx0XHRsYXllcnM6IHtcblx0XHRcdCdsYXllcjEnOiB7dmlzaWJsZTogdHJ1ZX1cblx0XHR9XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblNoYXBlQ3JlYXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFNoYXBlJywgbGFiZWw6ICdzaGFwZSBpZDonfSwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0ZGF0YS5sYXllciA9ICdsYXllcjEnXG5cdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKGlkLCBkYXRhKVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25TaGFwZUVkaXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRWRpdGVkJywgZGF0YSlcblx0XHR9LFxuXHRcdG9uU2hhcGVEZWxldGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVEZWxldGVkJywgZGF0YSlcblx0XHR9XHRcdFx0XHRcblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgY2xhc3M9XCJtYXBcIiBcblx0XHRibi1kYXRhPVwiY2VudGVyOiBjZW50ZXIsIHBsdWdpbnM6IHBsdWdpbnMsIGxheWVyczogbGF5ZXJzXCJcblx0XHRibi1ldmVudD1cIm1hcHNoYXBlY3JlYXRlZDogb25TaGFwZUNyZWF0ZWQsIG1hcHNoYXBlZWRpdGVkOiBvblNoYXBlRWRpdGVkLFxuXHRcdCBtYXBzaGFwZWRlbGV0ZWQ6IG9uU2hhcGVEZWxldGVkXCIgXG5cdFx0Ym4taWZhY2U9XCJtYXBcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE4Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMubWFwXFxcIiBjbGFzcz1cXFwibWFwXFxcIiBcXG5cdFx0XHRibi1kYXRhPVxcXCJjZW50ZXI6IGNlbnRlciwgcGx1Z2luczogcGx1Z2lucywgbGF5ZXJzOiBsYXllcnNcXFwiXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcIm1hcHNoYXBlY3JlYXRlZDogb25TaGFwZUNyZWF0ZWQsIG1hcHNoYXBlZWRpdGVkOiBvblNoYXBlRWRpdGVkLCBtYXBzaGFwZWRlbGV0ZWQ6IG9uU2hhcGVEZWxldGVkXFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwibWFwXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sXG5cdFx0XHRcdHBsdWdpbnM6IHtcblx0XHRcdFx0XHQnZWRpdG9yJzoge2VkaXRMYXllcjogJ2xheWVyMSd9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxheWVyczoge1xuXHRcdFx0XHRcdCdsYXllcjEnOiB7dmlzaWJsZTogdHJ1ZX1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblNoYXBlQ3JlYXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBTaGFwZScsIGxhYmVsOiAnc2hhcGUgaWQ6J30sIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdFx0XHRkYXRhLmxheWVyID0gJ2xheWVyMSdcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKGlkLCBkYXRhKVxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fSxcblx0XHRcdFx0b25TaGFwZUVkaXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25TaGFwZUVkaXRlZCcsIGRhdGEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uU2hhcGVEZWxldGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRGVsZXRlZCcsIGRhdGEpXG5cdFx0XHRcdH1cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicpXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5odG1sZWRpdG9yXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxOScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmh0bWxlZGl0b3JcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRodG1sQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCdcblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLXZhbD1cIm1lc3NhZ2VcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi12YWw9XFxcIm1lc3NhZ2VcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3NwYW4+PC9wPlx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRzaXplOiA1MCxcblx0XHRuYW1lOiAnJ1xuXHR9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdj5cblx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMjBcIiBtYXg9XCIxMDBcIiBibi12YWw9XCJzaXplXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48YnI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibmFtZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XHRcblx0PC9kaXY+XG5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5taWxzeW1ib2xcIiBkYXRhLXNpZGM9XCJTRkctVUNJLS0tLURcIiBcblx0XHRibi1kYXRhPVwic2l6ZTogc2l6ZSwgbmFtZTogbmFtZVwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjAnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXY+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBtaW49XFxcIjIwXFxcIiBtYXg9XFxcIjEwMFxcXCIgYm4tdmFsPVxcXCJzaXplXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLXZhbD1cXFwibmFtZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XHRcXG5cdFx0PC9kaXY+XFxuXFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5taWxzeW1ib2xcXFwiIGRhdGEtc2lkYz1cXFwiU0ZHLVVDSS0tLS1EXFxcIiBibi1kYXRhPVxcXCJzaXplOiBzaXplLCBuYW1lOiBuYW1lXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHNpemU6IDUwLFxuXHRcdFx0XHRuYW1lOiAnJyxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRodG1sQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Z3JpZENvbHVtbnM6IFsnbmFtZScsICdsb2NhdGlvbiddLFxuXHRcdGdyaWREYXRhOiBbXG5cdFx0ICAgeyBuYW1lOiAnQW1lcmljYW4gYWxsaWdhdG9yJywgbG9jYXRpb246ICdTb3V0aGVhc3QgVW5pdGVkIFN0YXRlcycgfSxcblx0XHQgICB7IG5hbWU6ICdDaGluZXNlIGFsbGlnYXRvcicsIGxvY2F0aW9uOiAnRWFzdGVybiBDaGluYScgfSxcblx0XHQgICB7IG5hbWU6ICdTcGVjdGFjbGVkIGNhaW1hbicsIGxvY2F0aW9uOiAnQ2VudHJhbCAmIFNvdXRoIEFtZXJpY2EnIH0sXG5cdFx0ICAgeyBuYW1lOiAnQnJvYWQtc25vdXRlZCBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH0sXG5cdFx0ICAgeyBuYW1lOiAnSmFjYXLDqSBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH0sXG5cdFx0ICAgeyBuYW1lOiAnQmxhY2sgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9XG5cdFx0IF0sXG5cdFx0IGZpbHRlcnM6IHtsb2NhdGlvbjogJ1MnLCBuYW1lOiAnJ31cblxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnN0IGYgPSAkKHRoaXMpLmRhdGEoJ2ZpbHRlcicpXG5cdFx0XHRjdHJsLm1vZGVsLmZpbHRlcnNbZl0gPSAkKHRoaXMpLnZhbCgpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnZmlsdGVycycpXG5cdFx0fVxuXHR9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1ldmVudD1cImlucHV0LmZpbHRlcjogb25GaWx0ZXJDaGFuZ2VcIj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWUgZmlsdGVyXCIgYm4tdmFsPVwiZmlsdGVycy5uYW1lXCIgXG5cdFx0XHRkYXRhLWZpbHRlcj1cIm5hbWVcIiBjbGFzcz1cImZpbHRlclwiPlxuXG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJsb2NhdGlvbiBmaWx0ZXJcIiBibi12YWw9XCJmaWx0ZXJzLmxvY2F0aW9uXCJcdFx0XHRcblx0XHRcdGRhdGEtZmlsdGVyPVwibG9jYXRpb25cIiBjbGFzcz1cImZpbHRlclwiPlxuXG5cdFx0XG5cdDwvZGl2PlxuXG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMudGFibGVcIiBcblx0XHRibi1kYXRhPVwiZGF0YTogZ3JpZERhdGEsIGNvbHVtbnM6IGdyaWRDb2x1bW5zLCBmaWx0ZXJzOiBmaWx0ZXJzXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyMScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1ldmVudD1cXFwiaW5wdXQuZmlsdGVyOiBvbkZpbHRlckNoYW5nZVxcXCIgY2xhc3M9XFxcImZpbHRlcnBhbmVsXFxcIj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWUgZmlsdGVyXFxcIiBibi12YWw9XFxcImZpbHRlcnMubmFtZVxcXCIgXFxuXHRcdFx0XHRkYXRhLWZpbHRlcj1cXFwibmFtZVxcXCIgY2xhc3M9XFxcImZpbHRlclxcXCI+XFxuXFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJsb2NhdGlvbiBmaWx0ZXJcXFwiICBibi12YWw9XFxcImZpbHRlcnMubG9jYXRpb25cXFwiXHRcdFx0ZGF0YS1maWx0ZXI9XFxcImxvY2F0aW9uXFxcIiBjbGFzcz1cXFwiZmlsdGVyXFxcIj5cXG5cXG5cdFx0XHRcXG5cdFx0PC9kaXY+XFxuXFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJsZVxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwiZGF0YTogZ3JpZERhdGEsIGNvbHVtbnM6IGdyaWRDb2x1bW5zLCBmaWx0ZXJzOiBmaWx0ZXJzXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGdyaWRDb2x1bW5zOiBbJ25hbWUnLCAnbG9jYXRpb24nXSxcblx0XHRcdFx0Z3JpZERhdGE6IFtcblx0XHRcdFx0ICAgeyBuYW1lOiAnQW1lcmljYW4gYWxsaWdhdG9yJywgbG9jYXRpb246ICdTb3V0aGVhc3QgVW5pdGVkIFN0YXRlcycgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnQ2hpbmVzZSBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ0Vhc3Rlcm4gQ2hpbmEnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ1NwZWN0YWNsZWQgY2FpbWFuJywgbG9jYXRpb246ICdDZW50cmFsICYgU291dGggQW1lcmljYScgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnQnJvYWQtc25vdXRlZCBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ0phY2Fyw6kgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdFx0XHQgICB7IG5hbWU6ICdCbGFjayBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH1cblx0XHRcdFx0IF0sXG5cdFx0XHRcdCBmaWx0ZXJzOiB7bG9jYXRpb246ICdTJywgbmFtZTogJyd9LFxuXHRcdFx0XHQganNDb2RlLFxuXHRcdFx0XHQgaHRtbENvZGVcblxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zdCBmID0gJCh0aGlzKS5kYXRhKCdmaWx0ZXInKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuZmlsdGVyc1tmXSA9ICQodGhpcykudmFsKClcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnZmlsdGVycycpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1widGV4dFwiOiBcIlxcXFx1ZjAxNVwiLCBcImFjdGlvblwiOiBcInRvdG9cIiwgY29sb3I6ICdyZWQnfSxcbiAgICAgICAgICAgIHtcInRleHRcIjogXCJcXFxcdWYwOTlcIiwgXCJjb2xvclwiOiBcImJsdWVcIn1cbiAgICAgICAgICAgIF0sXG4gICAgICAgIHRyaWdnZXJQb3M6IHtcbiAgICAgICAgICAgIFwibGVmdFwiOiAxMDAsXG4gICAgICAgICAgICBcInRvcFwiOiAyMDBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgXHRvbk1lbnVTZWxlY3RlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcbiAgICBcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcbiAgICBcdH1cbiAgICB9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4OyBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIj5cblx0ICAgIDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2lyY3VsYXJtZW51XCIgXG5cdCAgICBcdGRhdGEtcmFkaXVzPVwiMTIwXCIgXG5cdCAgICBcdGRhdGEtaWNvbi1wb3M9XCI4MFwiIFxuXHQgICAgXHRkYXRhLWlubmVyLXJhZGl1cz1cIjQwXCIgXG5cdCAgICBcdGJuLWV2ZW50PVwibWVudVNlbGVjdGVkOiBvbk1lbnVTZWxlY3RlZFwiIFxuXHQgICAgXHRibi1kYXRhPVwiaXRlbXM6IGl0ZW1zLCB0cmlnZ2VyUG9zOiB0cmlnZ2VyUG9zXCI+PC9kaXY+XG5cdDwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgc3R5bGU9XFxcIndpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4OyBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXFwiPlxcblx0XHQgICAgPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNpcmN1bGFybWVudVxcXCIgZGF0YS1yYWRpdXM9XFxcIjEyMFxcXCIgZGF0YS1pY29uLXBvcz1cXFwiODBcXFwiIGRhdGEtaW5uZXItcmFkaXVzPVxcXCI0MFxcXCIgYm4tZXZlbnQ9XFxcIm1lbnVTZWxlY3RlZDogb25NZW51U2VsZWN0ZWRcXFwiIGJuLWRhdGE9XFxcIml0ZW1zOiBpdGVtcywgdHJpZ2dlclBvczogdHJpZ2dlclBvc1xcXCI+PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblxuXHRcdCAgICAgICAgaXRlbXM6IFtcblx0XHQgICAgICAgICAgICB7XCJ0ZXh0XCI6IFwiXFx1ZjAxNVwiLCBcImFjdGlvblwiOiBcInRvdG9cIiwgY29sb3I6ICdyZWQnfSxcblx0XHQgICAgICAgICAgICB7XCJ0ZXh0XCI6IFwiXFx1ZjA5OVwiLCBcImNvbG9yXCI6IFwiYmx1ZVwifVxuXHRcdCAgICAgICAgICAgIF0sXG5cdFx0ICAgICAgICB0cmlnZ2VyUG9zOiB7XG5cdFx0ICAgICAgICAgICAgXCJsZWZ0XCI6IDEwMCxcblx0XHQgICAgICAgICAgICBcInRvcFwiOiAyMDBcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICBqc0NvZGUsXG5cdFx0ICAgICAgICBodG1sQ29kZVxuXHRcdCAgICB9LFxuXHRcdCAgICBldmVudHM6IHtcblx0XHQgICAgXHRvbk1lbnVTZWxlY3RlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHQgICAgXHRcdGNvbnNvbGUubG9nKCdvbk1lbnVTZWxlY3RlZCcsIGRhdGEpXG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcInRleHRcIjogXCJSZWRcIiwgY29sb3I6ICdyZWQnfSxcbiAgICAgICAgICAgIHtcInRleHRcIjogXCJCbHVlXCIsIFwiY29sb3JcIjogXCJibHVlXCJ9LFxuICAgICAgICAgICAge1widGV4dFwiOiBcIkdyZWVuXCIsIFwiY29sb3JcIjogXCJncmVlblwifSxcbiAgICAgICAgICAgIHtcInRleHRcIjogXCJCbGFja1wiLCBcImNvbG9yXCI6IFwiYmxhY2tcIn1cbiAgICAgICAgXSxcbiAgICAgICAgc2hhcGVzOiB7XG5cdFx0XHQnc2hhcGUxJzoge1xuXHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDkxfSxcblx0XHRcdFx0cm90YXRpb25BbmdsZTogMjAsXG5cdFx0XHRcdGljb246IHt0eXBlOiAnYWlzJywgY29sb3I6ICdibHVlJ31cblx0XHRcdH0sXHQgICAgICAgIFx0XG5cdFx0XHQnc2hhcGUyJzoge1xuXHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDcxfSxcblx0XHRcdFx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ3JlZCd9LFxuXHRcdFx0fVxuICAgICAgICB9ICAgICAgICBcdFxuXHR9LFxuXHRldmVudHM6IHtcblxuXHRcdG9uTWFwU2hhcGVDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcFNoYXBlQ29udGV4dE1lbnUnLCBkYXRhKVxuXHRcdFx0Y29uc3Qge2lkLCBwb3N9ID0gZGF0YVxuXHRcdFx0Y29uc3QgaW5mbyA9ICQodGhpcykuaWZhY2UoKS5nZXRTaGFwZUluZm8oaWQpXG5cdFx0XHRjb25zdCBpZHggPSBjdHJsLm1vZGVsLml0ZW1zLmZpbmRJbmRleCgoaXRlbSkgPT4gaXRlbS5jb2xvciA9PSBpbmZvLmljb24uY29sb3IpXG5cdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyhmYWxzZSlcblx0XHRcdGN0cmwuc2NvcGUubWVudS5jbG9zZU1lbnUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuc2VsZWN0KGlkeCkuc2hvd01lbnUocG9zLngsIHBvcy55KVxuXHRcdFx0XHRzZWxTaGFwZSA9IGlkXG5cdFx0XHR9KVxuXG5cdFx0fSxcblxuXHRcdG9uTWVudVNlbGVjdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcblx0XHRcdGN0cmwuc2NvcGUubWFwLnVwZGF0ZVNoYXBlKHNlbFNoYXBlLCB7aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogZGF0YS5jb2xvcn19KVxuXHRcdH0sXG5cblx0XHRvbk1lbnVDbG9zZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uTWVudUNsb3NlZCcpXG5cdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyh0cnVlKVxuXHRcdH1cblx0fVx0XG59KVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGNsYXNzPVwibWFwXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7XCI+XG5cdFx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5tYXBcIiBzdHlsZT1cImhlaWdodDogMTAwJVwiIFxuXHRcdFx0Ym4tZGF0YT1cImNlbnRlcjogY2VudGVyLCBzaGFwZXM6IHNoYXBlc1wiIFxuXHRcdFx0Ym4taWZhY2U9XCJtYXBcIlxuXHRcdFx0Ym4tZXZlbnQ9XCJtYXBzaGFwZWNvbnRleHRtZW51OiBvbk1hcFNoYXBlQ29udGV4dE1lbnVcIlxuXHRcdFx0ZGF0YS1zY2FsZT1cInRydWVcIlxuXHRcdFx0ZGF0YS1jb29yZGluYXRlcz1cInRydWVcIj48L2Rpdj5cblxuXHRcdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2lyY3VsYXJtZW51XCJcblx0XHRcdHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO3RvcDogLTEwMCVcIiBcblx0XHRcdGRhdGEtcmFkaXVzPVwiODBcIiBcblx0XHRcdGRhdGEtaWNvbi1wb3M9XCI1MFwiIFxuXHRcdFx0ZGF0YS1pbm5lci1yYWRpdXM9XCIyMFwiXG5cdFx0XHRkYXRhLWhhcy10cmlnZ2VyPVwiZmFsc2VcIiBcblx0XHRcdGJuLWV2ZW50PVwibWVudVNlbGVjdGVkOiBvbk1lbnVTZWxlY3RlZCwgbWVudUNsb3NlZDogb25NZW51Q2xvc2VkXCIgXG5cdFx0XHRibi1kYXRhPVwiaXRlbXM6IGl0ZW1zXCJcblx0XHRcdGJuLWlmYWNlPVwibWVudVwiPjwvZGl2PlxuXHRcdFxuXHQ8L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG5sZXQgc2VsU2hhcGUgPSBcIlwiXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgY2xhc3M9XFxcIm1hcFxcXCIgc3R5bGU9XFxcInBvc2l0aW9uOiByZWxhdGl2ZTtcXFwiPlxcblx0XHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5tYXBcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDEwMCVcXFwiIFxcblx0XHRcdFx0Ym4tZGF0YT1cXFwiY2VudGVyOiBjZW50ZXIsIHNoYXBlczogc2hhcGVzXFxcIiBcXG5cdFx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiXFxuXHRcdFx0XHRibi1ldmVudD1cXFwibWFwc2hhcGVjb250ZXh0bWVudTogb25NYXBTaGFwZUNvbnRleHRNZW51XFxcIlxcblx0XHRcdFx0ZGF0YS1zY2FsZT1cXFwidHJ1ZVxcXCJcXG5cdFx0XHRcdGRhdGEtY29vcmRpbmF0ZXM9XFxcInRydWVcXFwiPjwvZGl2Plxcblxcblx0XHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5jaXJjdWxhcm1lbnVcXFwiXFxuXHRcdFx0XHRzdHlsZT1cXFwicG9zaXRpb246IHJlbGF0aXZlO3RvcDogLTEwMCVcXFwiIFxcblx0XHRcdFx0ZGF0YS1yYWRpdXM9XFxcIjgwXFxcIiBcXG5cdFx0XHRcdGRhdGEtaWNvbi1wb3M9XFxcIjUwXFxcIiBcXG5cdFx0XHRcdGRhdGEtaW5uZXItcmFkaXVzPVxcXCIyMFxcXCJcXG5cdFx0XHRcdGRhdGEtaGFzLXRyaWdnZXI9XFxcImZhbHNlXFxcIiBcXG5cdFx0XHRcdGJuLWV2ZW50PVxcXCJtZW51U2VsZWN0ZWQ6IG9uTWVudVNlbGVjdGVkLCBtZW51Q2xvc2VkOiBvbk1lbnVDbG9zZWRcXFwiIFxcblx0XHRcdFx0Ym4tZGF0YT1cXFwiaXRlbXM6IGl0ZW1zXFxcIlxcblx0XHRcdFx0Ym4taWZhY2U9XFxcIm1lbnVcXFwiPjwvZGl2Plxcblx0XHRcdFxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHQgICAgICAgIGl0ZW1zOiBbXG5cdFx0ICAgICAgICAgICAge1widGV4dFwiOiBcIlJlZFwiLCBjb2xvcjogJ3JlZCd9LFxuXHRcdCAgICAgICAgICAgIHtcInRleHRcIjogXCJCbHVlXCIsIFwiY29sb3JcIjogXCJibHVlXCJ9LFxuXHRcdCAgICAgICAgICAgIHtcInRleHRcIjogXCJHcmVlblwiLCBcImNvbG9yXCI6IFwiZ3JlZW5cIn0sXG5cdFx0ICAgICAgICAgICAge1widGV4dFwiOiBcIkJsYWNrXCIsIFwiY29sb3JcIjogXCJibGFja1wifVxuXHRcdCAgICAgICAgXSxcblx0XHQgICAgICAgIHNoYXBlczoge1xuXHRcdFx0XHRcdCdzaGFwZTEnOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0XHRcdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ5MX0sXG5cdFx0XHRcdFx0XHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0XHRcdFx0XHRcdGljb246IHt0eXBlOiAnYWlzJywgY29sb3I6ICdibHVlJ31cblx0XHRcdFx0XHR9LFx0ICAgICAgICBcdFxuXHRcdFx0XHRcdCdzaGFwZTInOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0XHRcdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ3MX0sXG5cdFx0XHRcdFx0XHRpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiAncmVkJ30sXG5cdFx0XHRcdFx0fVxuXHRcdCAgICAgICAgfVxuXHRcdFx0XG5cblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblxuXHRcdFx0XHRvbk1hcFNoYXBlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uTWFwU2hhcGVDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0XHRcdFx0Y29uc3Qge2lkLCBwb3N9ID0gZGF0YVxuXHRcdFx0XHRcdGNvbnN0IGluZm8gPSAkKHRoaXMpLmlmYWNlKCkuZ2V0U2hhcGVJbmZvKGlkKVxuXHRcdFx0XHRcdGNvbnN0IGlkeCA9IGN0cmwubW9kZWwuaXRlbXMuZmluZEluZGV4KChpdGVtKSA9PiBpdGVtLmNvbG9yID09IGluZm8uaWNvbi5jb2xvcilcblx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyhmYWxzZSlcblx0XHRcdFx0XHRjdHJsLnNjb3BlLm1lbnUuY2xvc2VNZW51KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZWxlY3QoaWR4KS5zaG93TWVudShwb3MueCwgcG9zLnkpXG5cdFx0XHRcdFx0XHRzZWxTaGFwZSA9IGlkXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdG9uTWVudVNlbGVjdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1lbnVTZWxlY3RlZCcsIGRhdGEpXG5cdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoc2VsU2hhcGUsIHtpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiBkYXRhLmNvbG9yfX0pXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0b25NZW51Q2xvc2VkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NZW51Q2xvc2VkJylcblx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyh0cnVlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0cm9sbDogMTAsXG5cdFx0cGl0Y2g6IDEwLFxuXHRcdGFsdGl0dWRlOiA1MCxcblx0XHRzcGVlZDogNVxuXHR9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdj5cblx0XHQ8ZGl2IGNsYXNzPVwicmFuZ2VpbnB1dFwiPlxuXHRcdFx0PGxhYmVsPlJvbGw8L2xhYmVsPlx0XHRcdFxuXHRcdFx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi01MFwiIG1heD1cIjUwXCIgYm4tdmFsPVwicm9sbFwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PGJyPlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBjbGFzcz1cInJhbmdlaW5wdXRcIj5cblx0XHRcdDxsYWJlbD5QaXRjaDwvbGFiZWw+XHRcdFx0XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTQwXCIgbWF4PVwiNDBcIiBibi12YWw9XCJwaXRjaFwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PGJyPlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBjbGFzcz1cInJhbmdlaW5wdXRcIj5cblx0XHRcdDxsYWJlbD5TcGVlZDwvbGFiZWw+XHRcdFx0XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWF4PVwiMjAwXCIgYm4tdmFsPVwic3BlZWRcIiBibi11cGRhdGU9XCJpbnB1dFwiPjxicj5cblx0XHQ8L2Rpdj5cblxuXHRcdDxkaXYgY2xhc3M9XCJyYW5nZWlucHV0XCI+XG5cdFx0XHQ8bGFiZWw+QWx0aXR1ZGU8L2xhYmVsPlx0XHRcdFxuXHRcdFx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIGJuLXZhbD1cImFsdGl0dWRlXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48YnI+XG5cdFx0PC9kaXY+XG5cblx0PC9kaXY+XG5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5mbGlnaHRwYW5lbFwiIFxuXHRcdGJuLWRhdGE9XCJyb2xsOiByb2xsLCBwaXRjaDogcGl0Y2gsIHNwZWVkOiBzcGVlZCwgYWx0aXR1ZGU6IGFsdGl0dWRlXCI+XG5cdFx0XG48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDI0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2Plxcblx0XHRcdDxkaXYgY2xhc3M9XFxcInJhbmdlaW5wdXRcXFwiPlxcblx0XHRcdFx0PGxhYmVsPlJvbGw8L2xhYmVsPlx0XHRcdFxcblx0XHRcdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBtaW49XFxcIi01MFxcXCIgbWF4PVxcXCI1MFxcXCIgYm4tdmFsPVxcXCJyb2xsXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PC9kaXY+XFxuXFxuXHRcdFx0PGRpdiBjbGFzcz1cXFwicmFuZ2VpbnB1dFxcXCI+XFxuXHRcdFx0XHQ8bGFiZWw+UGl0Y2g8L2xhYmVsPlx0XHRcdFxcblx0XHRcdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBtaW49XFxcIi00MFxcXCIgbWF4PVxcXCI0MFxcXCIgYm4tdmFsPVxcXCJwaXRjaFxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PGJyPlxcblx0XHRcdDwvZGl2Plxcblxcblx0XHRcdDxkaXYgY2xhc3M9XFxcInJhbmdlaW5wdXRcXFwiPlxcblx0XHRcdFx0PGxhYmVsPlNwZWVkPC9sYWJlbD5cdFx0XHRcXG5cdFx0XHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgbWF4PVxcXCIyMDBcXFwiIGJuLXZhbD1cXFwic3BlZWRcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjxicj5cXG5cdFx0XHQ8L2Rpdj5cXG5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVxcXCJyYW5nZWlucHV0XFxcIj5cXG5cdFx0XHRcdDxsYWJlbD5BbHRpdHVkZTwvbGFiZWw+XHRcdFx0XFxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIGJuLXZhbD1cXFwiYWx0aXR1ZGVcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjxicj5cXG5cdFx0XHQ8L2Rpdj5cXG5cXG5cdFx0PC9kaXY+XFxuXFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5mbGlnaHRwYW5lbFxcXCJcXG5cdFx0XHRibi1kYXRhPVxcXCJyb2xsOiByb2xsLCBwaXRjaDogcGl0Y2gsIHNwZWVkOiBzcGVlZCwgYWx0aXR1ZGU6IGFsdGl0dWRlXFxcIj5cXG5cdFx0XHRcdFxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHJvbGw6IDEwLFxuXHRcdFx0XHRwaXRjaDogMTAsXG5cdFx0XHRcdGFsdGl0dWRlOiA1MCxcblx0XHRcdFx0c3BlZWQ6IDUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0aHRtbENvZGVcblx0XHRcdH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCI+XG5cdFx0PGxpIGJuLXRleHQ9XCJjXCI+PC9saT5cblx0PC91bD5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHVsIGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdFx0PGxpIGJuLXRleHQ9XFxcImNcXFwiPjwvbGk+XFxuXHRcdDwvdWw+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ11cdFx0XHRcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpLm5hbWUpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHR9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCI+XG5cdFx0PGxpIGJuLXRleHQ9XCJjXCI+PC9saT5cblx0PC91bD5cblxuXHQ8aDI+QWRkIGNsaWVudDwvaDI+XG5cdDxmb3JtIGJuLWV2ZW50PVwic3VibWl0OiBvbkFkZENsaWVudFwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgYXV0b2ZvY3VzPVwiXCIgcmVxdWlyZWQ9XCJcIj5cblx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5BZGQ8L2J1dHRvbj5cblx0PC9mb3JtPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx1bCBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHRcdDxsaSBibi10ZXh0PVxcXCJjXFxcIj48L2xpPlxcblx0XHQ8L3VsPlxcblxcblx0XHQ8aDI+QWRkIGNsaWVudDwvaDI+XFxuXHRcdDxmb3JtIGJuLWV2ZW50PVxcXCJzdWJtaXQ6IG9uQWRkQ2xpZW50XFxcIj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIGF1dG9mb2N1cz1cXFwiXFxcIiByZXF1aXJlZD1cXFwiXFxcIj5cXG5cdFx0XHQ8YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCI+QWRkPC9idXR0b24+XFxuXHRcdDwvZm9ybT5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ10sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdFxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkubmFtZSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH1cdFxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0ICA8dHI+XG5cdFx0ICAgIDx0aD5OYW1lPC90aD5cblx0XHQgICAgPHRoPkFnZTwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMuYWdlXCI+PC90ZD5cblx0XHRcdDwvdHI+XG5cdFx0PC90Ym9keT5cblx0IFxuXHQ8L3RhYmxlPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PHRhYmxlPlxcblx0XHRcdDx0aGVhZD5cXG5cdFx0XHQgIDx0cj5cXG5cdFx0XHQgICAgPHRoPk5hbWU8L3RoPlxcblx0XHRcdCAgICA8dGg+QWdlPC90aD5cXG5cdFx0XHQgIDwvdHI+XFxuXHRcdFx0PC90aGVhZD5cXG5cdFx0XHQ8dGJvZHkgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdFx0XHRcdDx0cj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plx0XHQgXFxuXHRcdDwvdGFibGU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgICAgY2xpZW50czogW1xuXHRcdFx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdFx0XHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0XHRcdCAgICBdLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XHRcblx0XHRcdH1cdFx0XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgICBjbGllbnRzOiBbXG5cdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0ICAgIF1cblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcblx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblx0XHR9LFxuXHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0dmFyIGRhdGEgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGF0YSgnaXRlbScpXG5cdFx0XHRcdHZhciBpZHggPSBjdHJsLm1vZGVsLmNsaWVudHMuaW5kZXhPZihkYXRhKVxuXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgsIGRhdGEpXG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHR9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0ICA8dHI+XG5cdFx0ICAgIDx0aD5OYW1lPC90aD5cblx0XHQgICAgPHRoPkFnZTwvdGg+XG5cdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxuXHRcdCAgPC90cj5cblx0XHQ8L3RoZWFkPlxuXHRcdDx0Ym9keSBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCIgYm4tZXZlbnQ9XCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XCI+XG5cdFx0XHQ8dHIgYm4tZGF0YT1cIml0ZW06IGNcIj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMuYWdlXCI+PC90ZD5cblx0XHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XCJkZWxCdG5cIiB0aXRsZT1cIkRlbGV0ZVwiPkRlbGV0ZTwvYnV0dG9uPlxuXHRcdFx0PC90cj5cblxuXHRcdDwvdGJvZHk+XG5cdCBcblx0PC90YWJsZT5cdFxuXG5cdDxoMj5BZGQgY2xpZW50PC9oMj5cblx0PGZvcm0gYm4tZXZlbnQ9XCJzdWJtaXQ6IG9uQWRkQ2xpZW50XCI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiByZXF1aXJlZD48YnI+XG5cdFx0PGlucHV0IHR5cGU9XCJudW1iZXJcIiBwbGFjZWhvbGRlcj1cImFnZVwiIG5hbWU9XCJhZ2VcIiByZXF1aXJlZD48YnI+XG5cdFx0PGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIkFkZFwiPlxuXHQ8L2Zvcm0+XHRcbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDYnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHRhYmxlPlxcblx0XHRcdDx0aGVhZD5cXG5cdFx0XHQgIDx0cj5cXG5cdFx0XHQgICAgPHRoPk5hbWU8L3RoPlxcblx0XHRcdCAgICA8dGg+QWdlPC90aD5cXG5cdFx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XFxuXHRcdFx0ICA8L3RyPlxcblx0XHRcdDwvdGhlYWQ+XFxuXHRcdFx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCIgYm4tZXZlbnQ9XFxcImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcXFwiPlxcblx0XHRcdFx0PHRyIGJuLWRhdGE9XFxcIml0ZW06IGNcXFwiPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plxcblx0XHQgXFxuXHRcdDwvdGFibGU+XHRcXG5cXG5cdFx0PGgyPkFkZCBjbGllbnQ8L2gyPlxcblx0XHQ8Zm9ybSBibi1ldmVudD1cXFwic3VibWl0OiBvbkFkZENsaWVudFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgcGxhY2Vob2xkZXI9XFxcImFnZVxcXCIgbmFtZT1cXFwiYWdlXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIkFkZFxcXCI+XFxuXHRcdDwvZm9ybT5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2Plxcblxcblx0XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdCAgICBodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcbiAgICAgIFx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG4gICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBkbGdBZGRDbGllbnQgPSAkJC5mb3JtRGlhbG9nQ29udHJvbGxlcih7XG5cdHRpdGxlOiAnQWRkIENsaWVudCcsXG5cdHRlbXBsYXRlOiAkKCcjdGVtcGxhdGUnKVxufSlcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGRsZ0FkZENsaWVudC5zaG93KGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goZGF0YSlcblx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVx0XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcblx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdH1cblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIiBibi1ldmVudD1cImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcIj5cblx0XHRcdDx0ciBibi1kYXRhPVwiaXRlbTogY1wiPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5hZ2VcIj48L3RkPlxuXHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cImRlbEJ0blwiIHRpdGxlPVwiRGVsZXRlXCI+RGVsZXRlPC9idXR0b24+XG5cdFx0XHQ8L3RyPlxuXG5cdFx0PC90Ym9keT5cblx0IFxuXHQ8L3RhYmxlPlx0XG5cblx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZENsaWVudFwiPkFkZCBDbGllbnQ8L2J1dHRvbj5cdFxuPC9kaXY+XG5cbjxkaXYgaWQ9XCJ0ZW1wbGF0ZVwiIGhpZGRlbj1cIlwiPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuYW1lPVwibmFtZVwiIHJlcXVpcmVkPjxicj5cblx0PGlucHV0IHR5cGU9XCJudW1iZXJcIiBwbGFjZWhvbGRlcj1cImFnZVwiIG5hbWU9XCJhZ2VcIiByZXF1aXJlZD48YnI+IFxuPC9kaXY+XG5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q3Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHRhYmxlPlxcblx0XHRcdDx0aGVhZD5cXG5cdFx0XHQgIDx0cj5cXG5cdFx0XHQgICAgPHRoPk5hbWU8L3RoPlxcblx0XHRcdCAgICA8dGg+QWdlPC90aD5cXG5cdFx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XFxuXHRcdFx0ICA8L3RyPlxcblx0XHRcdDwvdGhlYWQ+XFxuXHRcdFx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCIgYm4tZXZlbnQ9XFxcImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcXFwiPlxcblx0XHRcdFx0PHRyIGJuLWRhdGE9XFxcIml0ZW06IGNcXFwiPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plxcblx0XHQgXFxuXHRcdDwvdGFibGU+XHRcXG5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkQ2xpZW50XFxcIj5BZGQgQ2xpZW50PC9idXR0b24+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXHRcXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgZGxnQWRkQ2xpZW50ID0gJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIoe1xuXHRcdFx0dGl0bGU6ICdBZGQgQ2xpZW50Jyxcblx0XHRcdHRlbXBsYXRlOiBcIjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcbjxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHBsYWNlaG9sZGVyPVxcXCJhZ2VcXFwiIG5hbWU9XFxcImFnZVxcXCIgcmVxdWlyZWQ+PGJyPiBcdFx0XCJcblx0XHR9KVxuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdCAgICBodG1sQ29kZSxcblx0XHRcdCAgICBqc0NvZGVcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRkbGdBZGRDbGllbnQuc2hvdyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaChkYXRhKVxuXHRcdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVx0XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0dmFyIGRhdGEgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGF0YSgnaXRlbScpXG4gICAgICBcdFx0XHRcdHZhciBpZHggPSBjdHJsLm1vZGVsLmNsaWVudHMuaW5kZXhPZihkYXRhKVxuICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgsIGRhdGEpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9KVxuXG5cdFx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRkbGdBZGRDbGllbnQuZGVzdHJveSgpXG5cdFx0fVxuXHR9XG59KVxuXG59KSgpO1xuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgZnJ1aXRzOlsnb3JhbmdlJywgJ2FwcGxlJywgJ2JhbmFuYXMnLCAnbGVtb24nXSxcblx0ICBmYXZvcml0ZUZydWl0OidhcHBsZSdcblx0fVx0XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRcIj48L3NwYW4+PC9wPlxuXHQ8c2VsZWN0IGJuLWNvbnRyb2w9XCJicmFpbmpzLnNlbGVjdG1lbnVcIiBibi12YWw9XCJmYXZvcml0ZUZydWl0XCIgXG5cdFx0Ym4tdXBkYXRlPVwic2VsZWN0bWVudWNoYW5nZVwiIGJuLWVhY2g9XCJmIG9mIGZydWl0c1wiPlxuXHRcdDxvcHRpb24gYm4tdGV4dD1cImZcIj48L29wdGlvbj5cblx0PC9zZWxlY3Q+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q4Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdFx0PHA+WW91ciBmYXZvcml0IGZydWl0OiA8c3BhbiBibi10ZXh0PVxcXCJmYXZvcml0ZUZydWl0XFxcIj48L3NwYW4+PC9wPlxcblx0XHQ8c2VsZWN0IGJuLWNvbnRyb2w9XFxcImJyYWluanMuc2VsZWN0bWVudVxcXCIgYm4tdmFsPVxcXCJmYXZvcml0ZUZydWl0XFxcIiBibi11cGRhdGU9XFxcInNlbGVjdG1lbnVjaGFuZ2VcXFwiIGJuLWVhY2g9XFxcImYgb2YgZnJ1aXRzXFxcIj5cXG5cdFx0XHQ8b3B0aW9uIGJuLXRleHQ9XFxcImZcXFwiPjwvb3B0aW9uPlxcblx0XHQ8L3NlbGVjdD5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGZydWl0czpbJ29yYW5nZScsICdhcHBsZScsICdiYW5hbmFzJywgJ2xlbW9uJ10sXG5cdFx0XHRcdGZhdm9yaXRlRnJ1aXQ6J2FwcGxlJyxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0ICBcblx0XHRcdH1cdFx0XHRcblx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgIGNsaWVudHM6W1xuXHQgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fSxcblx0ICAgICB7bmFtZTogJ0x1Y2FzJywgYWdlOiAyMn0sXG5cdCAgICAge25hbWU6ICdRdWVudGluJywgYWdlOiAxNX0sXG5cdCAgICAge25hbWU6ICdMYXVyZW50JywgYWdlOiAzMn1cblx0ICAgXSxcblx0ICAgZmlsdGVyOicnLFxuXHQgICBnZXRGaWx0ZXJlZENsaWVudHM6IGZ1bmN0aW9uKCkge1xuXHQgICAgIHZhciBmaWx0ZXIgPSB0aGlzLmZpbHRlclxuXHQgICAgIHJldHVybiB0aGlzLmNsaWVudHMuZmlsdGVyKGZ1bmN0aW9uKGNsaWVudCkge1xuXHQgICAgICAgcmV0dXJuIGNsaWVudC5uYW1lLnN0YXJ0c1dpdGgoZmlsdGVyKTtcblx0ICAgICB9KVxuXHQgICB9ICAgIFxuXG5cdCB9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImZpbHRlciBieSBuYW1lXCIgYm4tdmFsPVwiZmlsdGVyXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0PHRhYmxlPlxuXHQgIDx0aGVhZD5cblx0ICAgIDx0cj5cblx0ICAgICAgPHRoPk5hbWU8L3RoPlxuXHQgICAgICA8dGg+QWdlPC90aD5cblx0ICAgIDwvdHI+XG5cdCAgPC90aGVhZD5cblx0ICA8dGJvZHkgYm4tZWFjaD1cImNsaWVudCBvZiBnZXRGaWx0ZXJlZENsaWVudHNcIj5cblx0ICAgIDx0cj5cblx0ICAgICAgPHRkIGJuLXRleHQ9XCJjbGllbnQubmFtZVwiPjwvdGQ+XG5cdCAgICAgIDx0ZCBibi10ZXh0PVwiY2xpZW50LmFnZVwiPjwvdGQ+XG5cdCAgICA8L3RyPlxuXHQgIDwvdGJvZHk+XG5cdCAgIFxuXHQ8L3RhYmxlPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0OScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcbiAgPGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG4gICAgPGgyPkNsaWVudHM8L2gyPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcImZpbHRlciBieSBuYW1lXFxcIiBibi12YWw9XFxcImZpbHRlclxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuICAgIDx0YWJsZT5cXG4gICAgICA8dGhlYWQ+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgIDx0aD5OYW1lPC90aD5cXG4gICAgICAgICAgPHRoPkFnZTwvdGg+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGhlYWQ+XFxuICAgICAgPHRib2R5IGJuLWVhY2g9XFxcImNsaWVudCBvZiBnZXRGaWx0ZXJlZENsaWVudHNcXFwiPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICA8dGQgYm4tdGV4dD1cXFwiY2xpZW50Lm5hbWVcXFwiPjwvdGQ+XFxuICAgICAgICAgIDx0ZCBibi10ZXh0PVxcXCJjbGllbnQuYWdlXFxcIj48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICA8L3Rib2R5PlxcbiAgICAgICBcXG4gICAgPC90YWJsZT5cXG4gIDwvZGl2PlxcbiAgPGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuICAgIDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG4gICAgPHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcbiAgPC9kaXY+ICBcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgICBjbGllbnRzOltcblx0XHRcdCAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdFx0XHQgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fSxcblx0XHRcdCAgICAge25hbWU6ICdMdWNhcycsIGFnZTogMjJ9LFxuXHRcdFx0ICAgICB7bmFtZTogJ1F1ZW50aW4nLCBhZ2U6IDE1fSxcblx0XHRcdCAgICAge25hbWU6ICdMYXVyZW50JywgYWdlOiAzMn1cblx0XHRcdCAgIF0sXG5cdFx0XHQgICBmaWx0ZXI6JycsXG5cdFx0XHQgICBnZXRGaWx0ZXJlZENsaWVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ICAgICB2YXIgZmlsdGVyID0gdGhpcy5maWx0ZXJcblx0XHRcdCAgICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoZnVuY3Rpb24oY2xpZW50KSB7XG5cdFx0XHQgICAgICAgcmV0dXJuIGNsaWVudC5uYW1lLnN0YXJ0c1dpdGgoZmlsdGVyKTtcblx0XHRcdCAgICAgfSlcblxuXHRcdFx0ICAgfSxcblx0XHRcdCAgIGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcblxuXG5cdFx0XHQgfVxuXG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG5cblxuIl19
