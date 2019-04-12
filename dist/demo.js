
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

		this.update = function(data) {
			ctrl.setData(data)
		}
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
	  <circle cx="50" cy="50" bn-attr="{r: radius}" stroke="black" stroke-width="3" fill="red" />
	</svg>
	  
	<input type="range" bn-val="radius" bn-update="input"></div>
</div>
`.trim()

$$.control.registerControl('test10', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<svg height=\"100\" width=\"100\">\n		  <circle cx=\"50\" cy=\"50\" bn-attr=\"{r: radius}\" stroke=\"black\" stroke-width=\"3\" fill=\"red\" />\n		</svg>\n		  \n		<input type=\"range\" bn-val=\"radius\" bn-update=\"input\">	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
	<div bn-control="MyTable" bn-data="{clients: myClients}"></div>
	<hr>
	<div bn-control="MyTable" bn-data="{clients: myClients2}"></div>
</div>

<div id="template" hidden="">
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>City</th>
			</tr>
		</thead>

		<tbody bn-each="clients">
			<tr>
				<td bn-text="$i.name"></td>
				<td bn-text="$i.city"></td>
			</tr>
		</tbody>
	</table>	
</div>
`.trim()

$$.control.registerControl('MyTable', {   
    props: {
    	clients: []
    },
    template: "<table>\n	<thead>\n		<tr>\n			<th>Name</th>\n			<th>City</th>\n		</tr>\n	</thead>\n\n	<tbody bn-each=\"clients\">\n		<tr>\n			<td bn-text=\"$i.name\"></td>\n			<td bn-text=\"$i.city\"></td>\n		</tr>\n	</tbody>\n</table>	",
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		  <h2>Custom control</h2>\n		  <div bn-control=\"MyTable\" bn-data=\"{clients: myClients}\"></div>\n		  <hr>\n		  <div bn-control=\"MyTable\" bn-data=\"{clients: myClients2}\"></div>\n		</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
		date: new Date(1972, 0, 3)
	}
}
`.trim()

const htmlCode = `
<div id="main">
	<input type="text" bn-control="brainjs.datepicker" bn-val="date" bn-update="datepickerchange">
	<p>Date: <span bn-text="date.toDateString()"></span></p>
</div>
`.trim()


$$.control.registerControl('test14', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n	 	<input type=\"text\" bn-control=\"brainjs.datepicker\" bn-val=\"date\" bn-update=\"datepickerchange\">\n	 	<p>Date: <span bn-text=\"date.toDateString()\"></span></p>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		this.ctrl = $$.viewController(elt, {
			data: { 
				date: new Date(1972, 0, 3),
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
		bn-data="{source, contextMenu}" 
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.tree\" \n			bn-data=\"{source, contextMenu}\" \n			bn-event=\"treeactivate: onTreeActivate, treecontextmenu: onTreeContextMenu\" \n			bn-iface=\"tree\"></div>\n		<br>\n		<div bn-control=\"brainjs.controlgroup\">\n			<button bn-event=\"click: onAddNode\">Add Node</button>\n			<button bn-event=\"click: onRemoveSelNode\">Remove SelNode</button>				\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
		bn-data="{center, layers, contextMenu}" 
		bn-iface="map"
		bn-event="mapclick: onMapClick, mapcontextmenu: onMapContextMenu"
		data-scale="true"
		data-coordinates="true"></div>
</div>
`.trim()


$$.control.registerControl('test17', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.map\" class=\"map\" \n			bn-data=\"{center, layers, contextMenu}\" \n			bn-iface=\"map\"\n			bn-event=\"mapclick: onMapClick, mapcontextmenu: onMapContextMenu\"\n			data-scale=\"true\"\n			data-coordinates=\"true\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
		bn-data="{center, plugins, layers}"
		bn-event="mapshapecreated: onShapeCreated, mapshapeedited: onShapeEdited,
		 mapshapedeleted: onShapeDeleted" 
		bn-iface="map"></div>
</div>
`.trim()


$$.control.registerControl('test18', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.map\" class=\"map\" \n			bn-data=\"{center, plugins, layers}\"\n			bn-event=\"mapshapecreated: onShapeCreated, mapshapeedited: onShapeEdited, mapshapedeleted: onShapeDeleted\" \n			bn-iface=\"map\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
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
	<p>Message: <span bn-text="message.toUpperCase()"></span></p>	
</div>
`

$$.control.registerControl('test2', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<input type=\"text\" bn-val=\"message\" bn-update=\"input\">\n		<p>Message: <span bn-text=\"message.toUpperCase()\"></span></p>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				message: 'Hello World',
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()
			}
		})

		this.update = function(data) {
			ctrl.setData(data)
		}
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div>\n			<input type=\"range\" min=\"20\" max=\"100\" bn-val=\"size\" bn-update=\"input\"><br>\n			<input type=\"text\" bn-val=\"name\" bn-update=\"input\">	\n		</div>\n\n		<div bn-control=\"brainjs.milsymbol\" data-sidc=\"SFG-UCI----D\" bn-data=\"{size: size, name: name}\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				size: 50,
				name: '',
				jsCode,
				htmlCode
			}
		})

		this.update = function(data) {
			ctrl.setData(data)
		}

	}
})



  


})();






(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		gridColumns: [
			'name', 
			{name: 'location', label: 'Location'},
			{label: 'Action', buttons: [
					{cmd: 'delete', title: 'Delete', icon: 'fa fa-trash'},
					{cmd: 'edit', title: 'Edit', icon: 'fa fa-pencil'}
				]
			}
		],		
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
			ctrl.update(this)
		},
		onTableCmd: function(ev, data) {
			console.log('onTableCmd', data)
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
		bn-data="data: gridData, columns: gridColumns, filters: filters"
		bn-event="tablecmd: onTableCmd"
		></div>
</div>
`.trim()


$$.control.registerControl('test21', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-event=\"input.filter: onFilterChange\" class=\"filterpanel\">\n			<input type=\"text\" placeholder=\"name filter\" bn-val=\"filters.name\" \n				data-filter=\"name\" class=\"filter\">\n\n			<input type=\"text\" placeholder=\"location filter\"  bn-val=\"filters.location\"			data-filter=\"location\" class=\"filter\">\n\n			\n		</div>\n\n		<div bn-control=\"brainjs.table\" \n			bn-data=\"{data: gridData, columns: gridColumns, filters: filters}\"\n			bn-event=\"tablecmd: onTableCmd\"\n			></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				gridColumns: [
					'name', 
					{name: 'location', label: 'Location'},
					{label: 'Action', buttons: [
							{cmd: 'delete', title: 'Delete', icon: 'fa fa-trash'},
							{cmd: 'edit', title: 'Edit', icon: 'fa fa-pencil'}
						]
					}],
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
					console.log('onFilterChange', f)
					ctrl.model.filters[f] = $(this).val()
					ctrl.update(this)
				},
				onTableCmd: function(ev, data) {
					console.log('onTableCmd', data)
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div style=\"width:300px; height: 300px; border: 1px solid black;\">\n		    <div bn-control=\"brainjs.circularmenu\" data-radius=\"120\" data-icon-pos=\"80\" data-inner-radius=\"40\" bn-event=\"menuSelected: onMenuSelected\" bn-data=\"{items: items, triggerPos: triggerPos}\"></div>\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div class=\"map\" style=\"position: relative;\">\n			<div bn-control=\"brainjs.map\" style=\"height: 100%\" \n				bn-data=\"{center, shapes}\" \n				bn-iface=\"map\"\n				bn-event=\"mapshapecontextmenu: onMapShapeContextMenu\"\n				data-scale=\"true\"\n				data-coordinates=\"true\"></div>\n\n			<div bn-control=\"brainjs.circularmenu\"\n				style=\"position: relative;top: -100%\" \n				data-radius=\"80\" \n				data-icon-pos=\"50\" \n				data-inner-radius=\"20\"\n				data-has-trigger=\"false\" \n				bn-event=\"menuSelected: onMenuSelected, menuClosed: onMenuClosed\" \n				bn-data=\"{items}\"\n				bn-iface=\"menu\"></div>\n			\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div>\n			<div class=\"rangeinput\">\n				<label>Roll</label>			\n				<input type=\"range\" min=\"-50\" max=\"50\" bn-val=\"roll\" bn-update=\"input\"><br>\n			</div>\n\n			<div class=\"rangeinput\">\n				<label>Pitch</label>			\n				<input type=\"range\" min=\"-40\" max=\"40\" bn-val=\"pitch\" bn-update=\"input\"><br>\n			</div>\n\n			<div class=\"rangeinput\">\n				<label>Speed</label>			\n				<input type=\"range\" max=\"200\" bn-val=\"speed\" bn-update=\"input\"><br>\n			</div>\n\n			<div class=\"rangeinput\">\n				<label>Altitude</label>			\n				<input type=\"range\" bn-val=\"altitude\" bn-update=\"input\"><br>\n			</div>\n\n		</div>\n\n		<div bn-control=\"brainjs.flightpanel\"\n			bn-data=\"{roll, pitch, speed, altitude, showSpeed}\">\n				\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				roll: 10,
				pitch: 10,
				altitude: 50,
				speed: 5,
				showSpeed: true,
				jsCode,
				htmlCode
			}
		})

		this.update = function(data) {
			ctrl.setData(data)
		}

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
	<ul bn-each="clients">
		<li bn-text="$i"></li>
	</ul>
</div>
`

$$.control.registerControl('test3', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<ul bn-each=\"clients\">\n			<li bn-text=\"$i\"></li>\n		</ul>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
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
			ctrl.update()
			$(this).resetForm()

		}
	}
}
`

const htmlCode = `
<div id="main">
	<h2>Clients</h2>
	<ul bn-each="clients">
		<li bn-text="$i"></li>
	</ul>

	<h2>Add client</h2>
	<form bn-event="submit: onAddClient">
		<input type="text" placeholder="name" name="name" autofocus="" required="">
		<button type="submit">Add</button>
	</form>	
</div>
`

$$.control.registerControl('test4', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<ul bn-each=\"clients\">\n			<li bn-text=\"$i\"></li>\n		</ul>\n\n		<h2>Add client</h2>\n		<form bn-event=\"submit: onAddClient\">\n			<input type=\"text\" placeholder=\"name\" name=\"name\" autofocus=\"\" required=\"\">\n			<button type=\"submit\">Add</button>\n		</form>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
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
					ctrl.update()
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
		<tbody bn-each="clients">
			<tr>
				<td bn-text="$i.name"></td>
				<td bn-text="$i.age"></td>
			</tr>
		</tbody>
	 
	</table>
</div>
`

$$.control.registerControl('test5', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"clients\">\n				<tr>\n					<td bn-text=\"$i.name\"></td>\n					<td bn-text=\"$i.age\"></td>\n				</tr>\n\n			</tbody>		 \n		</table>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n",
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
			ctrl.update()
			$(this).resetForm()
		},
		onRemoveClient: function(ev) {
			var idx = $(this).closest('tr').index()
			console.log('onRemoveClient', idx)
			ctrl.model.clients.splice(idx, 1)
			ctrl.update()
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
		<tbody bn-each="clients" bn-event="click.delBtn: onRemoveClient">
			<tr>
				<td bn-text="$i.name"></td>
				<td bn-text="$i.age"></td>
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
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			    <th>Action</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"clients\" bn-event=\"click.delBtn: onRemoveClient\">\n				<tr>\n					<td bn-text=\"$i.name\"></td>\n					<td bn-text=\"$i.age\"></td>\n					<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n				</tr>\n\n			</tbody>\n		 \n		</table>	\n\n		<h2>Add client</h2>\n		<form bn-event=\"submit: onAddClient\">\n			<input type=\"text\" placeholder=\"name\" name=\"name\" required><br>\n			<input type=\"number\" placeholder=\"age\" name=\"age\" required><br>\n			<input type=\"submit\" value=\"Add\">\n		</form>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n	",
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
					ctrl.update()
					$(this).resetForm()
				},
				onRemoveClient: function(ev) {
      				var idx = $(this).closest('tr').index()
					console.log('onRemoveClient', idx)
					ctrl.model.clients.splice(idx, 1)
					ctrl.update()
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
			var idx = $(this).closest('tr').index()
			console.log('onRemoveClient', idx)
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
		<tbody bn-each="clients" bn-event="click.delBtn: onRemoveClient">
			<tr>
				<td bn-text="$i.name"></td>
				<td bn-text="$i.age"></td>
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
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n	\n		<h2>Clients</h2>\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			    <th>Action</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"clients\" bn-event=\"click.delBtn: onRemoveClient\">\n				<tr>\n					<td bn-text=\"$i.name\"></td>\n					<td bn-text=\"$i.age\"></td>\n					<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n				</tr>\n\n			</tbody>\n		 \n		</table>	\n\n		<button bn-event=\"click: onAddClient\">Add Client</button>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n	\n",
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
						ctrl.update()	
					})
				},
				onRemoveClient: function(ev) {
      				var idx = $(this).closest('tr').index()
      				console.log('onRemoveClient', idx)
					ctrl.model.clients.splice(idx, 1)
					ctrl.update()
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
	<select bn-control="brainjs.selectmenu" 
		bn-val="favoriteFruit" 
		bn-update="selectmenuchange" 
		bn-each="fruits">
			<option bn-text="$i"></option>
	</select>
</div>
`

$$.control.registerControl('test8', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Fruits</h2>\n		<p>Your favorit fruit: <span bn-text=\"favoriteFruit\"></span></p>\n		<select bn-control=\"brainjs.selectmenu\" bn-val=\"favoriteFruit\" bn-update=\"selectmenuchange\" bn-each=\"fruits\">\n			<option bn-text=\"$i\"></option>\n		</select>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
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
	     return clients.filter(function(client) {
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
	  <tbody bn-each="getFilteredClients()">
	    <tr>
	      <td bn-text="$i.name"></td>
	      <td bn-text="$i.age"></td>
	    </tr>
	  </tbody>
	   
	</table>
</div>
`

$$.control.registerControl('test9', {
	template: "<div bn-control=\"brainjs.tabs\">\n  <div title=\"Result\">\n    <h2>Clients</h2>\n    <input type=\"text\" placeholder=\"filter by name\" bn-val=\"filter\" bn-update=\"input\">\n    <table>\n      <thead>\n        <tr>\n          <th>Name</th>\n          <th>Age</th>\n        </tr>\n      </thead>\n      <tbody bn-each=\"getFilteredClients()\">\n        <tr>\n          <td bn-text=\"$i.name\"></td>\n          <td bn-text=\"$i.age\"></td>\n        </tr>\n      </tbody>\n       \n    </table>\n  </div>\n  <div title=\"HTML\">\n    <pre bn-text=\"htmlCode\"></pre>\n  </div>\n  <div title=\"Javascript\">\n    <pre bn-text=\"jsCode\"></pre>\n  </div>  \n</div>\n\n",
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
			     return clients.filter(function(client) {
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





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QxMy5qcyIsInRlc3QxNC5qcyIsInRlc3QxNS5qcyIsInRlc3QxNi5qcyIsInRlc3QxNy5qcyIsInRlc3QxOC5qcyIsInRlc3QxOS5qcyIsInRlc3QyLmpzIiwidGVzdDIwLmpzIiwidGVzdDIxLmpzIiwidGVzdDIyLmpzIiwidGVzdDIzLmpzIiwidGVzdDI0LmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkZW1vLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4kKGZ1bmN0aW9uKCkge1xuXG5cdGxldCByb3V0ZXMgPSBbXG5cdFx0e2hyZWY6ICcvJywgcmVkaXJlY3Q6ICcvdGVzdDEnfVxuXHRdXG5cdGZvcihsZXQgaSA9IDE7IGkgPD0gMjQ7IGkrKyApIHtcblx0XHRyb3V0ZXMucHVzaCh7XG5cdFx0XHRocmVmOiAnL3Rlc3QnICsgaSwgY29udHJvbDogJ3Rlc3QnICsgaVxuXHRcdH0pXG5cdH1cblxuXG5cblx0JCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRcdGRhdGE6IHtcblx0XHRcdHJvdXRlc1xuXHRcdH1cblx0fSlcbn0pO1xuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCdcblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8cCBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3A+XHRcdFx0XHRcdFx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGVcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRjdHJsLnNldERhdGEoZGF0YSlcblx0XHR9XG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgIHJhZGl1czoxMFxuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxzdmcgaGVpZ2h0PVwiMTAwXCIgd2lkdGg9XCIxMDBcIj5cblx0ICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgYm4tYXR0cj1cIntyOiByYWRpdXN9XCIgc3Ryb2tlPVwiYmxhY2tcIiBzdHJva2Utd2lkdGg9XCIzXCIgZmlsbD1cInJlZFwiIC8+XG5cdDwvc3ZnPlxuXHQgIFxuXHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgYm4tdmFsPVwicmFkaXVzXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PHN2ZyBoZWlnaHQ9XFxcIjEwMFxcXCIgd2lkdGg9XFxcIjEwMFxcXCI+XFxuXHRcdCAgPGNpcmNsZSBjeD1cXFwiNTBcXFwiIGN5PVxcXCI1MFxcXCIgYm4tYXR0cj1cXFwie3I6IHJhZGl1c31cXFwiIHN0cm9rZT1cXFwiYmxhY2tcXFwiIHN0cm9rZS13aWR0aD1cXFwiM1xcXCIgZmlsbD1cXFwicmVkXFxcIiAvPlxcblx0XHQ8L3N2Zz5cXG5cdFx0ICBcXG5cdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBibi12YWw9XFxcInJhZGl1c1xcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgIHJhZGl1czoxMCxcblx0XHRcdCAgaHRtbENvZGUsXG5cdFx0XHQgIGpzQ29kZVxuXHRcdFx0fVxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFibGUnLCB7ICAgXG4gICAgcHJvcHM6IHtcbiAgICBcdGNsaWVudHM6IFtdXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJyksXG4gICAgaW5pdDogZnVuY3Rpb24oZWx0KSB7XG4gICAgXHRjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMucHJvcHMpXG4gICAgICBcbiAgICAgIHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY2xpZW50czogdGhpcy5wcm9wcy5jbGllbnRzXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9IFxuICB9XG4pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdCAgbXlDbGllbnRzOiBbXG5cdCAgICB7bmFtZTogJ1F1ZW50aW4nLCBjaXR5OiAnUmVubmVzJ30sXG5cdCAgICB7bmFtZTogJ01hcmMnLCBjaXR5OiAnQmV0aHVuZSd9XG5cdCAgXSxcblx0ICBteUNsaWVudHMyOiBbXG5cdCAgICB7bmFtZTogJ0JyaWdpdHRlJywgY2l0eTogJ0xlIE1hbnMnfSxcblx0ICAgIHtuYW1lOiAnR2VvcmdlcycsIGNpdHk6ICdWZXJxdWluJ31cblx0ICBdXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkN1c3RvbSBjb250cm9sPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiTXlUYWJsZVwiIGJuLWRhdGE9XCJ7Y2xpZW50czogbXlDbGllbnRzfVwiPjwvZGl2PlxuXHQ8aHI+XG5cdDxkaXYgYm4tY29udHJvbD1cIk15VGFibGVcIiBibi1kYXRhPVwie2NsaWVudHM6IG15Q2xpZW50czJ9XCI+PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0aD5OYW1lPC90aD5cblx0XHRcdFx0PHRoPkNpdHk8L3RoPlxuXHRcdFx0PC90cj5cblx0XHQ8L3RoZWFkPlxuXG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjbGllbnRzXCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJGkubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJGkuY2l0eVwiPjwvdGQ+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGJvZHk+XG5cdDwvdGFibGU+XHRcbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFibGUnLCB7ICAgXG4gICAgcHJvcHM6IHtcbiAgICBcdGNsaWVudHM6IFtdXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXCI8dGFibGU+XFxuXHQ8dGhlYWQ+XFxuXHRcdDx0cj5cXG5cdFx0XHQ8dGg+TmFtZTwvdGg+XFxuXHRcdFx0PHRoPkNpdHk8L3RoPlxcblx0XHQ8L3RyPlxcblx0PC90aGVhZD5cXG5cXG5cdDx0Ym9keSBibi1lYWNoPVxcXCJjbGllbnRzXFxcIj5cXG5cdFx0PHRyPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkaS5uYW1lXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkaS5jaXR5XFxcIj48L3RkPlxcblx0XHQ8L3RyPlxcblx0PC90Ym9keT5cXG48L3RhYmxlPlx0XCIsXG4gICAgaW5pdDogZnVuY3Rpb24oZWx0KSB7XG4gICAgXHRjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMucHJvcHMpXG4gICAgICBcbiAgICAgIHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY2xpZW50czogdGhpcy5wcm9wcy5jbGllbnRzXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9IFxuICB9XG4pXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdCAgPGgyPkN1c3RvbSBjb250cm9sPC9oMj5cXG5cdFx0ICA8ZGl2IGJuLWNvbnRyb2w9XFxcIk15VGFibGVcXFwiIGJuLWRhdGE9XFxcIntjbGllbnRzOiBteUNsaWVudHN9XFxcIj48L2Rpdj5cXG5cdFx0ICA8aHI+XFxuXHRcdCAgPGRpdiBibi1jb250cm9sPVxcXCJNeVRhYmxlXFxcIiBibi1kYXRhPVxcXCJ7Y2xpZW50czogbXlDbGllbnRzMn1cXFwiPjwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0ICBteUNsaWVudHM6IFtcblx0XHRcdCAgICB7bmFtZTogJ1F1ZW50aW4nLCBjaXR5OiAnUmVubmVzJ30sXG5cdFx0XHQgICAge25hbWU6ICdNYXJjJywgY2l0eTogJ0JldGh1bmUnfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBteUNsaWVudHMyOiBbXG5cdFx0XHQgICAge25hbWU6ICdCcmlnaXR0ZScsIGNpdHk6ICdMZSBNYW5zJ30sXG5cdFx0XHQgICAge25hbWU6ICdHZW9yZ2VzJywgY2l0eTogJ1ZlcnF1aW4nfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBodG1sQ29kZSxcblx0XHRcdCAganNDb2RlXG5cdFx0XHR9IFxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGZhdm9yaXRlRnJ1aXRzOlsnYXBwbGUnLCAnb3JhbmdlJ10sXG5cdFx0Z2VuZGVyOiAnbWFsZSdcblx0fSBcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2hlY2tncm91cFwiIGJuLXZhbD1cImZhdm9yaXRlRnJ1aXRzXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJvcmFuZ2VcIj5PcmFuZ2Vcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJiYW5hbmFzXCI+QmFuYW5hc1xuXHQgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cImFwcGxlXCI+QXBwbGVcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJsZW1vblwiPkxlbW9uXG5cdDwvZGl2PlxuXG5cdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRzXCI+PC9zcGFuPjwvcD5cblxuXHQ8aDI+R2VuZGVyPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5yYWRpb2dyb3VwXCIgYm4tdmFsPVwiZ2VuZGVyXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJtYWxlXCI+TWFsZVxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cImZlbWFsZVwiPkZlbWFsZVxuXHQ8L2Rpdj5cblx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVwiZ2VuZGVyXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5GcnVpdHM8L2gyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY2hlY2tncm91cFxcXCIgYm4tdmFsPVxcXCJmYXZvcml0ZUZydWl0c1xcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwib3JhbmdlXFxcIj5PcmFuZ2VcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIHZhbHVlPVxcXCJiYW5hbmFzXFxcIj5CYW5hbmFzXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwiYXBwbGVcXFwiPkFwcGxlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwibGVtb25cXFwiPkxlbW9uXFxuXHRcdDwvZGl2Plxcblx0XHRcXG5cdFx0ICA8cD5Zb3VyIGZhdm9yaXQgZnJ1aXRzOiA8c3BhbiBibi10ZXh0PVxcXCJmYXZvcml0ZUZydWl0c1xcXCI+PC9zcGFuPjwvcD5cXG5cXG5cdFx0PGgyPkdlbmRlcjwvaDI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5yYWRpb2dyb3VwXFxcIiBibi12YWw9XFxcImdlbmRlclxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiB2YWx1ZT1cXFwibWFsZVxcXCI+TWFsZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgdmFsdWU9XFxcImZlbWFsZVxcXCI+RmVtYWxlXFxuXHRcdDwvZGl2Plxcblx0XHQ8cD5HZW5kZXI6IDxzcGFuIGJuLXRleHQ9XFxcImdlbmRlclxcXCI+PC9zcGFuPjwvcD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGZhdm9yaXRlRnJ1aXRzOlsnYXBwbGUnLCAnb3JhbmdlJ10sXG5cdFx0XHRcdGdlbmRlcjogJ21hbGUnLFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9IFxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJDdHJsJywge1xuXHR0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJyksXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvJ1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxufSlcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25UYWJBY3RpdmF0ZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRhYkFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldFNlbGVjdGVkVGFiSW5kZXgoKSlcblx0XHR9LFxuXHRcdG9uQWRkVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkVGFiJylcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnPHA+R29vZCBtb3JuaW5nPHA+J1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25BZGRDdHJsVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ3RybFRhYicpXG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRjb250cm9sOiAnTXlUYWJDdHJsJ1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25TaG93VGFiSW5mbzogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnN0IGNvdW50ID0gY3RybC5zY29wZS50YWJzLmdldFRhYnNDb3VudCgpXG5cdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRjb25zdCB0aXRsZSA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJJbmZvKHNlbElkeCkudGl0bGVcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBcXGBcblx0XHRcdFx0PHA+VGFic0NvdW50OiBcXCR7Y291bnR9PC9wPlxuXHRcdFx0XHQ8cD5TZWxJbmRleDogXFwke3NlbElkeH08L3A+XG5cdFx0XHRcdDxwPlNlbFRhYiBUaXRsZTogXFwke3RpdGxlfTxwPlxuXHRcdFx0XFxgXG5cdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVTZWxUYWI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0Y3RybC5zY29wZS50YWJzLnJlbW92ZVRhYihzZWxJZHgpXG5cdFx0fVxuXHR9XHRcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy50YWJzXCIgYm4taWZhY2U9XCJ0YWJzXCIgYm4tZXZlbnQ9XCJ0YWJzYWN0aXZhdGU6IG9uVGFiQWN0aXZhdGVcIj5cblx0XHQ8ZGl2IHRpdGxlPVwiVGFiIDFcIj5cblx0XHRcdDxwPkhlbGxvIFdvcmxkPC9wPlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgdGl0bGU9XCJUYWIgMlwiPlxuXHRcdFx0PHA+Qm9uam91ciBsZSBtb25kZTwvcD5cblx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5cdDxicj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jb250cm9sZ3JvdXBcIj5cdFx0XHRcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkVGFiXCI+QWRkIFRhYjwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGRDdHJsVGFiXCI+QWRkIENvbnRyb2wgVGFiPC9idXR0b24+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvblNob3dUYWJJbmZvXCI+U2hvdyBUYWIgSW5mbzwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25SZW1vdmVTZWxUYWJcIj5SZW1vdmUgU2VsIFRhYjwvYnV0dG9uPlxuXHQ8L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibWVzc2FnZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5cbmAudHJpbSgpXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTMtdGFiY3RybCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdj5cXG5cdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi12YWw9XFxcIm1lc3NhZ2VcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cXFwibWVzc2FnZVxcXCI+PC9zcGFuPjwvcD5cdFx0XFxuPC9kaXY+XFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvJ1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxufSlcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiIGJuLWlmYWNlPVxcXCJ0YWJzXFxcIiBibi1ldmVudD1cXFwidGFic2FjdGl2YXRlOiBvblRhYkFjdGl2YXRlXFxcIj5cXG5cdFx0XHQ8ZGl2IHRpdGxlPVxcXCJUYWIgMVxcXCI+XFxuXHRcdFx0XHQ8cD5IZWxsbyBXb3JsZDwvcD5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8ZGl2IHRpdGxlPVxcXCJUYWIgMlxcXCI+XFxuXHRcdFx0XHQ8cD5Cb25qb3VyIGxlIG1vbmRlPC9wPlxcblx0XHRcdDwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdFx0PGJyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY29udHJvbGdyb3VwXFxcIj5cdFx0XHRcXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGRUYWJcXFwiPkFkZCBUYWI8L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGRDdHJsVGFiXFxcIj5BZGQgQ29udHJvbCBUYWI8L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25TaG93VGFiSW5mb1xcXCI+U2hvdyBUYWIgSW5mbzwvYnV0dG9uPlxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblJlbW92ZVNlbFRhYlxcXCI+UmVtb3ZlIFNlbCBUYWI8L2J1dHRvbj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uVGFiQWN0aXZhdGU6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uVGFiQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbkFkZFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRUYWInKVxuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlOiAnPHA+R29vZCBtb3JuaW5nPHA+J1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQWRkQ3RybFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDdHJsVGFiJylcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRjb250cm9sOiAndGVzdDEzLXRhYmN0cmwnXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fSxcblx0XHRcdFx0b25TaG93VGFiSW5mbzogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zdCBjb3VudCA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJzQ291bnQoKVxuXHRcdFx0XHRcdGNvbnN0IHNlbElkeCA9IGN0cmwuc2NvcGUudGFicy5nZXRTZWxlY3RlZFRhYkluZGV4KClcblx0XHRcdFx0XHRjb25zdCB0aXRsZSA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJJbmZvKHNlbElkeCkudGl0bGVcblx0XHRcdFx0XHRjb25zdCBjb250ZW50ID0gYFxuXHRcdFx0XHRcdFx0PHA+VGFic0NvdW50OiAke2NvdW50fTwvcD5cblx0XHRcdFx0XHRcdDxwPlNlbEluZGV4OiAke3NlbElkeH08L3A+XG5cdFx0XHRcdFx0XHQ8cD5TZWxUYWIgVGl0bGU6ICR7dGl0bGV9PHA+XG5cdFx0XHRcdFx0YFxuXHRcdFx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlU2VsVGFiOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRcdFx0Y3RybC5zY29wZS50YWJzLnJlbW92ZVRhYihzZWxJZHgpXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHQgXG5cdFx0fSlcblxuXHRcdGNvbnNvbGUubG9nKCdzY29wZScsIGN0cmwuc2NvcGUpXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGRhdGU6IG5ldyBEYXRlKDE5NzIsIDAsIDMpXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tY29udHJvbD1cImJyYWluanMuZGF0ZXBpY2tlclwiIGJuLXZhbD1cImRhdGVcIiBibi11cGRhdGU9XCJkYXRlcGlja2VyY2hhbmdlXCI+XG5cdDxwPkRhdGU6IDxzcGFuIGJuLXRleHQ9XCJkYXRlLnRvRGF0ZVN0cmluZygpXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0IFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLWNvbnRyb2w9XFxcImJyYWluanMuZGF0ZXBpY2tlclxcXCIgYm4tdmFsPVxcXCJkYXRlXFxcIiBibi11cGRhdGU9XFxcImRhdGVwaWNrZXJjaGFuZ2VcXFwiPlxcblx0IFx0PHA+RGF0ZTogPHNwYW4gYm4tdGV4dD1cXFwiZGF0ZS50b0RhdGVTdHJpbmcoKVxcXCI+PC9zcGFuPjwvcD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0ZGF0ZTogbmV3IERhdGUoMTk3MiwgMCwgMyksXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHR9LFxuXHRcdCBcblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0aXNTdGFydGVkOiBmYWxzZVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdGN0cmwuc2NvcGUuY2FtZXJhLnN0YXJ0KClcblx0XHR9LFxuXHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVGFrZVBpY3R1cmUnKVxuXHRcdFx0dmFyIHVybCA9IGN0cmwuc2NvcGUuY2FtZXJhLnRha2VQaWN0dXJlKClcblx0XHRcdHZhciBjb250ZW50ID0gXFxgPGltZyBzcmM9XCJcXCR7dXJsfVwiPlxcYFxuXHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50LCB3aWR0aDogJ2F1dG8nfSlcblx0XHR9XHRcdFx0XG5cdH1cdFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uU3RhcnRcIiBibi1zaG93PVwiIWlzU3RhcnRlZFwiPlN0YXJ0PC9idXR0b24+XG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25UYWtlUGljdHVyZVwiIGJuLXNob3c9XCJpc1N0YXJ0ZWRcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jYW1lcmFcIiBibi1pZmFjZT1cImNhbWVyYVwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTUnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblN0YXJ0XFxcIiBibi1zaG93PVxcXCIhaXNTdGFydGVkXFxcIj5TdGFydDwvYnV0dG9uPlxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25UYWtlUGljdHVyZVxcXCIgYm4tc2hvdz1cXFwiaXNTdGFydGVkXFxcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNhbWVyYVxcXCIgYm4taWZhY2U9XFxcImNhbWVyYVxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRpc1N0YXJ0ZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdFx0XHRjdHJsLnNjb3BlLmNhbWVyYS5zdGFydCgpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRha2VQaWN0dXJlJylcblx0XHRcdFx0XHR2YXIgdXJsID0gY3RybC5zY29wZS5jYW1lcmEudGFrZVBpY3R1cmUoKVxuXHRcdFx0XHRcdHZhciBjb250ZW50ID0gYDxpbWcgc3JjPVwiJHt1cmx9XCI+YFxuXHRcdFx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudCwgd2lkdGg6ICdhdXRvJ30pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQgXG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdHNvdXJjZTogW1xuXHRcdFx0e3RpdGxlOiAnTm9kZSAxJywgZm9sZGVyOiB0cnVlLCBjaGlsZHJlbjogW1xuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMSd9LFxuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMid9XG5cdFx0XHRdfSxcblx0XHRcdHt0aXRsZTogJ05vZGUgMid9XG5cdFx0XSxcblx0XHRjb250ZXh0TWVudToge1xuXHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0JywgaWNvbjogJ2VkaXQnfSxcblx0XHRcdGN1dDoge25hbWU6ICdDdXQnLCBpY29uOiAnY3V0J31cblx0XHR9XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblRyZWVBY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0QWN0aXZlTm9kZSgpLnRpdGxlKVxuXHRcdH0sXG5cdFx0b25UcmVlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBhY3Rpb24pIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVDb250ZXh0TWVudScsIGFjdGlvbilcblx0XHR9LFxuXHRcdG9uQWRkTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIE5vZGUnLCBsYWJlbDogJ05vZGUgdGl0bGUnfSwgZnVuY3Rpb24odGl0bGUpIHtcblx0XHRcdFx0XG5cdFx0XHRcdGFjdGl2ZU5vZGUuYWRkTm9kZSh7dGl0bGV9KVxuXHRcdFx0XHRhY3RpdmVOb2RlLnNldEV4cGFuZGVkKHRydWUpXG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVTZWxOb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0YWN0aXZlTm9kZS5yZW1vdmUoKVxuXHRcdH1cblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRyZWVcIiBcblx0XHRibi1kYXRhPVwie3NvdXJjZSwgY29udGV4dE1lbnV9XCIgXG5cdFx0Ym4tZXZlbnQ9XCJ0cmVlYWN0aXZhdGU6IG9uVHJlZUFjdGl2YXRlLCB0cmVlY29udGV4dG1lbnU6IG9uVHJlZUNvbnRleHRNZW51XCIgXG5cdFx0Ym4taWZhY2U9XCJ0cmVlXCI+PC9kaXY+XG5cdDxicj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jb250cm9sZ3JvdXBcIj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkTm9kZVwiPkFkZCBOb2RlPC9idXR0b24+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvblJlbW92ZVNlbE5vZGVcIj5SZW1vdmUgU2VsTm9kZTwvYnV0dG9uPlx0XHRcdFx0XG5cdDwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTYnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50cmVlXFxcIiBcXG5cdFx0XHRibi1kYXRhPVxcXCJ7c291cmNlLCBjb250ZXh0TWVudX1cXFwiIFxcblx0XHRcdGJuLWV2ZW50PVxcXCJ0cmVlYWN0aXZhdGU6IG9uVHJlZUFjdGl2YXRlLCB0cmVlY29udGV4dG1lbnU6IG9uVHJlZUNvbnRleHRNZW51XFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwidHJlZVxcXCI+PC9kaXY+XFxuXHRcdDxicj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNvbnRyb2xncm91cFxcXCI+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkTm9kZVxcXCI+QWRkIE5vZGU8L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25SZW1vdmVTZWxOb2RlXFxcIj5SZW1vdmUgU2VsTm9kZTwvYnV0dG9uPlx0XHRcdFx0XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0c291cmNlOiBbXG5cdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxJywgZm9sZGVyOiB0cnVlLCBjaGlsZHJlbjogW1xuXHRcdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjEnfSxcblx0XHRcdFx0XHRcdHt0aXRsZTogJ05vZGUgMS4yJ31cblx0XHRcdFx0XHRdfSxcblx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDInfVxuXHRcdFx0XHRdLFxuXG5cdFx0XHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0JywgaWNvbjogJ2VkaXQnfSxcblx0XHRcdFx0XHRjdXQ6IHtuYW1lOiAnQ3V0JywgaWNvbjogJ2N1dCd9XG5cdFx0XHRcdH1cblx0XHRcdFxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblRyZWVBY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uVHJlZUFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldEFjdGl2ZU5vZGUoKS50aXRsZSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25UcmVlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBhY3Rpb24pIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQ29udGV4dE1lbnUnLCBhY3Rpb24pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQWRkTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgTm9kZScsIGxhYmVsOiAnTm9kZSB0aXRsZSd9LCBmdW5jdGlvbih0aXRsZSkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRhY3RpdmVOb2RlLmFkZE5vZGUoe3RpdGxlfSlcblx0XHRcdFx0XHRcdGFjdGl2ZU5vZGUuc2V0RXhwYW5kZWQodHJ1ZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZVNlbE5vZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFjdGl2ZU5vZGUucmVtb3ZlKClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0IFxuXHRcdH0pXG5cblx0XHR0aGlzLmN0cmwgPSBjdHJsXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sIC8vIEJyZXN0IGNpdHlcblx0XHRsYXllcnM6IHtcblx0XHRcdCdsYXllcjEnOiB7bGFiZWw6ICdMYXllciAxJywgdmlzaWJsZTogdHJ1ZX0sXG5cdFx0XHQnbGF5ZXIyJzoge2xhYmVsOiAnTGF5ZXIgMicsIHZpc2libGU6IHRydWV9XG5cdFx0fSxcblx0XHRjb250ZXh0TWVudToge1xuXHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0J30sXG5cdFx0XHRzZXA6IHtuYW1lOiAnLS0nfSxcblx0XHRcdGNvcHk6IHtuYW1lOiAnQ29weSd9XG5cdFx0fVx0XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbk1hcENsaWNrOiBmdW5jdGlvbihldiwgZGF0YSkge1x0XHRcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgZGF0YSlcblx0XHRcdGNvbnN0IHtsYXRsbmd9ID0gZGF0YVxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoJ21hcmtlcicsIHtsYXRsbmd9KVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnbWFya2VyJywge1xuXHRcdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRcdGxhdGxuZ1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25NYXBDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENvbnRleHRNZW51JywgZGF0YSlcblx0XHR9XHRcdFxuXHR9XHRcbn0pXG5cbmN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTEnLCB7XG5cdHR5cGU6ICdtYXJrZXInLFxuXHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxuXHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ2JsdWUnfSxcblx0cG9wdXBDb250ZW50OiAnSGVsbG8gV29ybGQnLFxuXHRsYXllcjogJ2xheWVyMSdcbn0pXG5cbmN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTInLCB7XG5cdHR5cGU6ICdjaXJjbGUnLFxuXHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRyYWRpdXM6IDEwMCxcblx0c3R5bGU6IHtjb2xvcjogJ3JlZCd9LFxuXHRsYXllcjogJ2xheWVyMidcbn0pXG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgY2xhc3M9XCJtYXBcIiBcblx0XHRibi1kYXRhPVwie2NlbnRlciwgbGF5ZXJzLCBjb250ZXh0TWVudX1cIiBcblx0XHRibi1pZmFjZT1cIm1hcFwiXG5cdFx0Ym4tZXZlbnQ9XCJtYXBjbGljazogb25NYXBDbGljaywgbWFwY29udGV4dG1lbnU6IG9uTWFwQ29udGV4dE1lbnVcIlxuXHRcdGRhdGEtc2NhbGU9XCJ0cnVlXCJcblx0XHRkYXRhLWNvb3JkaW5hdGVzPVwidHJ1ZVwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTcnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5tYXBcXFwiIGNsYXNzPVxcXCJtYXBcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcIntjZW50ZXIsIGxheWVycywgY29udGV4dE1lbnV9XFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwibWFwXFxcIlxcblx0XHRcdGJuLWV2ZW50PVxcXCJtYXBjbGljazogb25NYXBDbGljaywgbWFwY29udGV4dG1lbnU6IG9uTWFwQ29udGV4dE1lbnVcXFwiXFxuXHRcdFx0ZGF0YS1zY2FsZT1cXFwidHJ1ZVxcXCJcXG5cdFx0XHRkYXRhLWNvb3JkaW5hdGVzPVxcXCJ0cnVlXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdFx0J2xheWVyMSc6IHtsYWJlbDogJ0xheWVyIDEnLCB2aXNpYmxlOiB0cnVlfSxcblx0XHRcdFx0XHQnbGF5ZXIyJzoge2xhYmVsOiAnTGF5ZXIgMicsIHZpc2libGU6IHRydWV9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0J30sXG5cdFx0XHRcdFx0c2VwOiB7bmFtZTogJy0tJ30sXG5cdFx0XHRcdFx0Y29weToge25hbWU6ICdDb3B5J31cblx0XHRcdFx0fVxuXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uTWFwQ2xpY2s6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgZGF0YSlcblx0XHRcdFx0XHRjb25zdCB7bGF0bG5nfSA9IGRhdGFcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoJ21hcmtlcicsIHtsYXRsbmd9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnbWFya2VyJywge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0XHRcdFx0bGF0bG5nXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0b25NYXBDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NYXBDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy5jdHJsID0gY3RybFxuXG5cdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMScsIHtcblx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDkxfSxcblx0XHRcdHJvdGF0aW9uQW5nbGU6IDIwLFxuXHRcdFx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ2JsdWUnfSxcblx0XHRcdHBvcHVwQ29udGVudDogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdGxheWVyOiAnbGF5ZXIxJ1xuXHRcdH0pXG5cblx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnc2hhcGUyJywge1xuXHRcdFx0dHlwZTogJ2NpcmNsZScsXG5cdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRcdFx0cmFkaXVzOiAxMDAsXG5cdFx0XHRzdHlsZToge2NvbG9yOiAncmVkJ30sXG5cdFx0XHRsYXllcjogJ2xheWVyMidcblx0XHR9KVxuXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sIC8vIEJyZXN0IGNpdHlcblx0XHRwbHVnaW5zOiB7XG5cdFx0XHQnZWRpdG9yJzoge2VkaXRMYXllcjogJ2xheWVyMSd9XG5cdFx0fSxcblx0XHRsYXllcnM6IHtcblx0XHRcdCdsYXllcjEnOiB7dmlzaWJsZTogdHJ1ZX1cblx0XHR9XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblNoYXBlQ3JlYXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFNoYXBlJywgbGFiZWw6ICdzaGFwZSBpZDonfSwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0ZGF0YS5sYXllciA9ICdsYXllcjEnXG5cdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKGlkLCBkYXRhKVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25TaGFwZUVkaXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRWRpdGVkJywgZGF0YSlcblx0XHR9LFxuXHRcdG9uU2hhcGVEZWxldGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVEZWxldGVkJywgZGF0YSlcblx0XHR9XHRcdFx0XHRcblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgY2xhc3M9XCJtYXBcIiBcblx0XHRibi1kYXRhPVwie2NlbnRlciwgcGx1Z2lucywgbGF5ZXJzfVwiXG5cdFx0Ym4tZXZlbnQ9XCJtYXBzaGFwZWNyZWF0ZWQ6IG9uU2hhcGVDcmVhdGVkLCBtYXBzaGFwZWVkaXRlZDogb25TaGFwZUVkaXRlZCxcblx0XHQgbWFwc2hhcGVkZWxldGVkOiBvblNoYXBlRGVsZXRlZFwiIFxuXHRcdGJuLWlmYWNlPVwibWFwXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxOCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1hcFxcXCIgY2xhc3M9XFxcIm1hcFxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwie2NlbnRlciwgcGx1Z2lucywgbGF5ZXJzfVxcXCJcXG5cdFx0XHRibi1ldmVudD1cXFwibWFwc2hhcGVjcmVhdGVkOiBvblNoYXBlQ3JlYXRlZCwgbWFwc2hhcGVlZGl0ZWQ6IG9uU2hhcGVFZGl0ZWQsIG1hcHNoYXBlZGVsZXRlZDogb25TaGFwZURlbGV0ZWRcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHRcdFx0cGx1Z2luczoge1xuXHRcdFx0XHRcdCdlZGl0b3InOiB7ZWRpdExheWVyOiAnbGF5ZXIxJ31cblx0XHRcdFx0fSxcblx0XHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdFx0J2xheWVyMSc6IHt2aXNpYmxlOiB0cnVlfVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU2hhcGVDcmVhdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFNoYXBlJywgbGFiZWw6ICdzaGFwZSBpZDonfSwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0XHRcdGRhdGEubGF5ZXIgPSAnbGF5ZXIxJ1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoaWQsIGRhdGEpXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblNoYXBlRWRpdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRWRpdGVkJywgZGF0YSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25TaGFwZURlbGV0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVEZWxldGVkJywgZGF0YSlcblx0XHRcdFx0fVx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJylcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmh0bWxlZGl0b3JcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE5Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuaHRtbGVkaXRvclxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGh0bWxDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJ1xuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibWVzc2FnZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlLnRvVXBwZXJDYXNlKClcIj48L3NwYW4+PC9wPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJtZXNzYWdlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdFx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cXFwibWVzc2FnZS50b1VwcGVyQ2FzZSgpXFxcIj48L3NwYW4+PC9wPlx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRjdHJsLnNldERhdGEoZGF0YSlcblx0XHR9XG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdHNpemU6IDUwLFxuXHRcdG5hbWU6ICcnXG5cdH1cdFxufSlcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2PlxuXHRcdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD1cIjEwMFwiIGJuLXZhbD1cInNpemVcIiBibi11cGRhdGU9XCJpbnB1dFwiPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBibi12YWw9XCJuYW1lXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cdFxuXHQ8L2Rpdj5cblxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLm1pbHN5bWJvbFwiIGRhdGEtc2lkYz1cIlNGRy1VQ0ktLS0tRFwiIFxuXHRcdGJuLWRhdGE9XCJzaXplOiBzaXplLCBuYW1lOiBuYW1lXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyMCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIG1pbj1cXFwiMjBcXFwiIG1heD1cXFwiMTAwXFxcIiBibi12YWw9XFxcInNpemVcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjxicj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJuYW1lXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cdFxcblx0XHQ8L2Rpdj5cXG5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1pbHN5bWJvbFxcXCIgZGF0YS1zaWRjPVxcXCJTRkctVUNJLS0tLURcXFwiIGJuLWRhdGE9XFxcIntzaXplOiBzaXplLCBuYW1lOiBuYW1lfVxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRzaXplOiA1MCxcblx0XHRcdFx0bmFtZTogJycsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0aHRtbENvZGVcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRjdHJsLnNldERhdGEoZGF0YSlcblx0XHR9XG5cblx0fVxufSlcblxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Z3JpZENvbHVtbnM6IFtcblx0XHRcdCduYW1lJywgXG5cdFx0XHR7bmFtZTogJ2xvY2F0aW9uJywgbGFiZWw6ICdMb2NhdGlvbid9LFxuXHRcdFx0e2xhYmVsOiAnQWN0aW9uJywgYnV0dG9uczogW1xuXHRcdFx0XHRcdHtjbWQ6ICdkZWxldGUnLCB0aXRsZTogJ0RlbGV0ZScsIGljb246ICdmYSBmYS10cmFzaCd9LFxuXHRcdFx0XHRcdHtjbWQ6ICdlZGl0JywgdGl0bGU6ICdFZGl0JywgaWNvbjogJ2ZhIGZhLXBlbmNpbCd9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHRdLFx0XHRcblx0XHRncmlkRGF0YTogW1xuXHRcdCAgIHsgbmFtZTogJ0FtZXJpY2FuIGFsbGlnYXRvcicsIGxvY2F0aW9uOiAnU291dGhlYXN0IFVuaXRlZCBTdGF0ZXMnIH0sXG5cdFx0ICAgeyBuYW1lOiAnQ2hpbmVzZSBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ0Vhc3Rlcm4gQ2hpbmEnIH0sXG5cdFx0ICAgeyBuYW1lOiAnU3BlY3RhY2xlZCBjYWltYW4nLCBsb2NhdGlvbjogJ0NlbnRyYWwgJiBTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0Jyb2FkLXNub3V0ZWQgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0phY2Fyw6kgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0JsYWNrIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfVxuXHRcdCBdLFxuXHRcdCBmaWx0ZXJzOiB7bG9jYXRpb246ICdTJywgbmFtZTogJyd9XG5cblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25GaWx0ZXJDaGFuZ2U6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zdCBmID0gJCh0aGlzKS5kYXRhKCdmaWx0ZXInKVxuXHRcdFx0Y3RybC5tb2RlbC5maWx0ZXJzW2ZdID0gJCh0aGlzKS52YWwoKVxuXHRcdFx0Y3RybC51cGRhdGUodGhpcylcblx0XHR9LFxuXHRcdG9uVGFibGVDbWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UYWJsZUNtZCcsIGRhdGEpXG5cdFx0fVx0XHRcblx0fVx0XG59KVx0XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tZXZlbnQ9XCJpbnB1dC5maWx0ZXI6IG9uRmlsdGVyQ2hhbmdlXCI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lIGZpbHRlclwiIGJuLXZhbD1cImZpbHRlcnMubmFtZVwiIFxuXHRcdFx0ZGF0YS1maWx0ZXI9XCJuYW1lXCIgY2xhc3M9XCJmaWx0ZXJcIj5cblxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibG9jYXRpb24gZmlsdGVyXCIgYm4tdmFsPVwiZmlsdGVycy5sb2NhdGlvblwiXHRcdFx0XG5cdFx0XHRkYXRhLWZpbHRlcj1cImxvY2F0aW9uXCIgY2xhc3M9XCJmaWx0ZXJcIj5cblxuXHRcdFxuXHQ8L2Rpdj5cblxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRhYmxlXCIgXG5cdFx0Ym4tZGF0YT1cImRhdGE6IGdyaWREYXRhLCBjb2x1bW5zOiBncmlkQ29sdW1ucywgZmlsdGVyczogZmlsdGVyc1wiXG5cdFx0Ym4tZXZlbnQ9XCJ0YWJsZWNtZDogb25UYWJsZUNtZFwiXG5cdFx0PjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tZXZlbnQ9XFxcImlucHV0LmZpbHRlcjogb25GaWx0ZXJDaGFuZ2VcXFwiIGNsYXNzPVxcXCJmaWx0ZXJwYW5lbFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lIGZpbHRlclxcXCIgYm4tdmFsPVxcXCJmaWx0ZXJzLm5hbWVcXFwiIFxcblx0XHRcdFx0ZGF0YS1maWx0ZXI9XFxcIm5hbWVcXFwiIGNsYXNzPVxcXCJmaWx0ZXJcXFwiPlxcblxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibG9jYXRpb24gZmlsdGVyXFxcIiAgYm4tdmFsPVxcXCJmaWx0ZXJzLmxvY2F0aW9uXFxcIlx0XHRcdGRhdGEtZmlsdGVyPVxcXCJsb2NhdGlvblxcXCIgY2xhc3M9XFxcImZpbHRlclxcXCI+XFxuXFxuXHRcdFx0XFxuXHRcdDwvZGl2Plxcblxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFibGVcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcIntkYXRhOiBncmlkRGF0YSwgY29sdW1uczogZ3JpZENvbHVtbnMsIGZpbHRlcnM6IGZpbHRlcnN9XFxcIlxcblx0XHRcdGJuLWV2ZW50PVxcXCJ0YWJsZWNtZDogb25UYWJsZUNtZFxcXCJcXG5cdFx0XHQ+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRncmlkQ29sdW1uczogW1xuXHRcdFx0XHRcdCduYW1lJywgXG5cdFx0XHRcdFx0e25hbWU6ICdsb2NhdGlvbicsIGxhYmVsOiAnTG9jYXRpb24nfSxcblx0XHRcdFx0XHR7bGFiZWw6ICdBY3Rpb24nLCBidXR0b25zOiBbXG5cdFx0XHRcdFx0XHRcdHtjbWQ6ICdkZWxldGUnLCB0aXRsZTogJ0RlbGV0ZScsIGljb246ICdmYSBmYS10cmFzaCd9LFxuXHRcdFx0XHRcdFx0XHR7Y21kOiAnZWRpdCcsIHRpdGxlOiAnRWRpdCcsIGljb246ICdmYSBmYS1wZW5jaWwnfVxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH1dLFxuXHRcdFx0XHRncmlkRGF0YTogW1xuXHRcdFx0XHQgICB7IG5hbWU6ICdBbWVyaWNhbiBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ1NvdXRoZWFzdCBVbml0ZWQgU3RhdGVzJyB9LFxuXHRcdFx0XHQgICB7IG5hbWU6ICdDaGluZXNlIGFsbGlnYXRvcicsIGxvY2F0aW9uOiAnRWFzdGVybiBDaGluYScgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnU3BlY3RhY2xlZCBjYWltYW4nLCBsb2NhdGlvbjogJ0NlbnRyYWwgJiBTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdFx0XHQgICB7IG5hbWU6ICdCcm9hZC1zbm91dGVkIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnSmFjYXLDqSBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ0JsYWNrIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfVxuXHRcdFx0XHQgXSxcblx0XHRcdFx0IGZpbHRlcnM6IHtsb2NhdGlvbjogJ1MnLCBuYW1lOiAnJ30sXG5cdFx0XHRcdCBqc0NvZGUsXG5cdFx0XHRcdCBodG1sQ29kZVxuXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uRmlsdGVyQ2hhbmdlOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnN0IGYgPSAkKHRoaXMpLmRhdGEoJ2ZpbHRlcicpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uRmlsdGVyQ2hhbmdlJywgZilcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmZpbHRlcnNbZl0gPSAkKHRoaXMpLnZhbCgpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUodGhpcylcblx0XHRcdFx0fSxcblx0XHRcdFx0b25UYWJsZUNtZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UYWJsZUNtZCcsIGRhdGEpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1widGV4dFwiOiBcIlxcXFx1ZjAxNVwiLCBcImFjdGlvblwiOiBcInRvdG9cIiwgY29sb3I6ICdyZWQnfSxcbiAgICAgICAgICAgIHtcInRleHRcIjogXCJcXFxcdWYwOTlcIiwgXCJjb2xvclwiOiBcImJsdWVcIn1cbiAgICAgICAgICAgIF0sXG4gICAgICAgIHRyaWdnZXJQb3M6IHtcbiAgICAgICAgICAgIFwibGVmdFwiOiAxMDAsXG4gICAgICAgICAgICBcInRvcFwiOiAyMDBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgXHRvbk1lbnVTZWxlY3RlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcbiAgICBcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcbiAgICBcdH1cbiAgICB9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4OyBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIj5cblx0ICAgIDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2lyY3VsYXJtZW51XCIgXG5cdCAgICBcdGRhdGEtcmFkaXVzPVwiMTIwXCIgXG5cdCAgICBcdGRhdGEtaWNvbi1wb3M9XCI4MFwiIFxuXHQgICAgXHRkYXRhLWlubmVyLXJhZGl1cz1cIjQwXCIgXG5cdCAgICBcdGJuLWV2ZW50PVwibWVudVNlbGVjdGVkOiBvbk1lbnVTZWxlY3RlZFwiIFxuXHQgICAgXHRibi1kYXRhPVwiaXRlbXM6IGl0ZW1zLCB0cmlnZ2VyUG9zOiB0cmlnZ2VyUG9zXCI+PC9kaXY+XG5cdDwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgc3R5bGU9XFxcIndpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4OyBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXFwiPlxcblx0XHQgICAgPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNpcmN1bGFybWVudVxcXCIgZGF0YS1yYWRpdXM9XFxcIjEyMFxcXCIgZGF0YS1pY29uLXBvcz1cXFwiODBcXFwiIGRhdGEtaW5uZXItcmFkaXVzPVxcXCI0MFxcXCIgYm4tZXZlbnQ9XFxcIm1lbnVTZWxlY3RlZDogb25NZW51U2VsZWN0ZWRcXFwiIGJuLWRhdGE9XFxcIntpdGVtczogaXRlbXMsIHRyaWdnZXJQb3M6IHRyaWdnZXJQb3N9XFxcIj48L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXG5cdFx0ICAgICAgICBpdGVtczogW1xuXHRcdCAgICAgICAgICAgIHtcInRleHRcIjogXCJcXHVmMDE1XCIsIFwiYWN0aW9uXCI6IFwidG90b1wiLCBjb2xvcjogJ3JlZCd9LFxuXHRcdCAgICAgICAgICAgIHtcInRleHRcIjogXCJcXHVmMDk5XCIsIFwiY29sb3JcIjogXCJibHVlXCJ9XG5cdFx0ICAgICAgICAgICAgXSxcblx0XHQgICAgICAgIHRyaWdnZXJQb3M6IHtcblx0XHQgICAgICAgICAgICBcImxlZnRcIjogMTAwLFxuXHRcdCAgICAgICAgICAgIFwidG9wXCI6IDIwMFxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIGpzQ29kZSxcblx0XHQgICAgICAgIGh0bWxDb2RlXG5cdFx0ICAgIH0sXG5cdFx0ICAgIGV2ZW50czoge1xuXHRcdCAgICBcdG9uTWVudVNlbGVjdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdCAgICBcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcblx0XHQgICAgXHR9XG5cdFx0ICAgIH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1widGV4dFwiOiBcIlJlZFwiLCBjb2xvcjogJ3JlZCd9LFxuICAgICAgICAgICAge1widGV4dFwiOiBcIkJsdWVcIiwgXCJjb2xvclwiOiBcImJsdWVcIn0sXG4gICAgICAgICAgICB7XCJ0ZXh0XCI6IFwiR3JlZW5cIiwgXCJjb2xvclwiOiBcImdyZWVuXCJ9LFxuICAgICAgICAgICAge1widGV4dFwiOiBcIkJsYWNrXCIsIFwiY29sb3JcIjogXCJibGFja1wifVxuICAgICAgICBdLFxuICAgICAgICBzaGFwZXM6IHtcblx0XHRcdCdzaGFwZTEnOiB7XG5cdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxuXHRcdFx0XHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0XHRcdFx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ2JsdWUnfVxuXHRcdFx0fSxcdCAgICAgICAgXHRcblx0XHRcdCdzaGFwZTInOiB7XG5cdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRcdFx0XHRpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiAncmVkJ30sXG5cdFx0XHR9XG4gICAgICAgIH0gICAgICAgIFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXG5cdFx0b25NYXBTaGFwZUNvbnRleHRNZW51OiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uTWFwU2hhcGVDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0XHRjb25zdCB7aWQsIHBvc30gPSBkYXRhXG5cdFx0XHRjb25zdCBpbmZvID0gJCh0aGlzKS5pZmFjZSgpLmdldFNoYXBlSW5mbyhpZClcblx0XHRcdGNvbnN0IGlkeCA9IGN0cmwubW9kZWwuaXRlbXMuZmluZEluZGV4KChpdGVtKSA9PiBpdGVtLmNvbG9yID09IGluZm8uaWNvbi5jb2xvcilcblx0XHRcdGN0cmwuc2NvcGUubWFwLmVuYWJsZUhhbmRsZXJzKGZhbHNlKVxuXHRcdFx0Y3RybC5zY29wZS5tZW51LmNsb3NlTWVudShmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5zZWxlY3QoaWR4KS5zaG93TWVudShwb3MueCwgcG9zLnkpXG5cdFx0XHRcdHNlbFNoYXBlID0gaWRcblx0XHRcdH0pXG5cblx0XHR9LFxuXG5cdFx0b25NZW51U2VsZWN0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25NZW51U2VsZWN0ZWQnLCBkYXRhKVxuXHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoc2VsU2hhcGUsIHtpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiBkYXRhLmNvbG9yfX0pXG5cdFx0fSxcblxuXHRcdG9uTWVudUNsb3NlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25NZW51Q2xvc2VkJylcblx0XHRcdGN0cmwuc2NvcGUubWFwLmVuYWJsZUhhbmRsZXJzKHRydWUpXG5cdFx0fVxuXHR9XHRcbn0pXG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgY2xhc3M9XCJtYXBcIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtcIj5cblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLm1hcFwiIHN0eWxlPVwiaGVpZ2h0OiAxMDAlXCIgXG5cdFx0XHRibi1kYXRhPVwiY2VudGVyOiBjZW50ZXIsIHNoYXBlczogc2hhcGVzXCIgXG5cdFx0XHRibi1pZmFjZT1cIm1hcFwiXG5cdFx0XHRibi1ldmVudD1cIm1hcHNoYXBlY29udGV4dG1lbnU6IG9uTWFwU2hhcGVDb250ZXh0TWVudVwiXG5cdFx0XHRkYXRhLXNjYWxlPVwidHJ1ZVwiXG5cdFx0XHRkYXRhLWNvb3JkaW5hdGVzPVwidHJ1ZVwiPjwvZGl2PlxuXG5cdFx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jaXJjdWxhcm1lbnVcIlxuXHRcdFx0c3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7dG9wOiAtMTAwJVwiIFxuXHRcdFx0ZGF0YS1yYWRpdXM9XCI4MFwiIFxuXHRcdFx0ZGF0YS1pY29uLXBvcz1cIjUwXCIgXG5cdFx0XHRkYXRhLWlubmVyLXJhZGl1cz1cIjIwXCJcblx0XHRcdGRhdGEtaGFzLXRyaWdnZXI9XCJmYWxzZVwiIFxuXHRcdFx0Ym4tZXZlbnQ9XCJtZW51U2VsZWN0ZWQ6IG9uTWVudVNlbGVjdGVkLCBtZW51Q2xvc2VkOiBvbk1lbnVDbG9zZWRcIiBcblx0XHRcdGJuLWRhdGE9XCJpdGVtczogaXRlbXNcIlxuXHRcdFx0Ym4taWZhY2U9XCJtZW51XCI+PC9kaXY+XG5cdFx0XG5cdDwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbmxldCBzZWxTaGFwZSA9IFwiXCJcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyMycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBjbGFzcz1cXFwibWFwXFxcIiBzdHlsZT1cXFwicG9zaXRpb246IHJlbGF0aXZlO1xcXCI+XFxuXHRcdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1hcFxcXCIgc3R5bGU9XFxcImhlaWdodDogMTAwJVxcXCIgXFxuXHRcdFx0XHRibi1kYXRhPVxcXCJ7Y2VudGVyLCBzaGFwZXN9XFxcIiBcXG5cdFx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiXFxuXHRcdFx0XHRibi1ldmVudD1cXFwibWFwc2hhcGVjb250ZXh0bWVudTogb25NYXBTaGFwZUNvbnRleHRNZW51XFxcIlxcblx0XHRcdFx0ZGF0YS1zY2FsZT1cXFwidHJ1ZVxcXCJcXG5cdFx0XHRcdGRhdGEtY29vcmRpbmF0ZXM9XFxcInRydWVcXFwiPjwvZGl2Plxcblxcblx0XHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5jaXJjdWxhcm1lbnVcXFwiXFxuXHRcdFx0XHRzdHlsZT1cXFwicG9zaXRpb246IHJlbGF0aXZlO3RvcDogLTEwMCVcXFwiIFxcblx0XHRcdFx0ZGF0YS1yYWRpdXM9XFxcIjgwXFxcIiBcXG5cdFx0XHRcdGRhdGEtaWNvbi1wb3M9XFxcIjUwXFxcIiBcXG5cdFx0XHRcdGRhdGEtaW5uZXItcmFkaXVzPVxcXCIyMFxcXCJcXG5cdFx0XHRcdGRhdGEtaGFzLXRyaWdnZXI9XFxcImZhbHNlXFxcIiBcXG5cdFx0XHRcdGJuLWV2ZW50PVxcXCJtZW51U2VsZWN0ZWQ6IG9uTWVudVNlbGVjdGVkLCBtZW51Q2xvc2VkOiBvbk1lbnVDbG9zZWRcXFwiIFxcblx0XHRcdFx0Ym4tZGF0YT1cXFwie2l0ZW1zfVxcXCJcXG5cdFx0XHRcdGJuLWlmYWNlPVxcXCJtZW51XFxcIj48L2Rpdj5cXG5cdFx0XHRcXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sXG5cdFx0ICAgICAgICBpdGVtczogW1xuXHRcdCAgICAgICAgICAgIHtcInRleHRcIjogXCJSZWRcIiwgY29sb3I6ICdyZWQnfSxcblx0XHQgICAgICAgICAgICB7XCJ0ZXh0XCI6IFwiQmx1ZVwiLCBcImNvbG9yXCI6IFwiYmx1ZVwifSxcblx0XHQgICAgICAgICAgICB7XCJ0ZXh0XCI6IFwiR3JlZW5cIiwgXCJjb2xvclwiOiBcImdyZWVuXCJ9LFxuXHRcdCAgICAgICAgICAgIHtcInRleHRcIjogXCJCbGFja1wiLCBcImNvbG9yXCI6IFwiYmxhY2tcIn1cblx0XHQgICAgICAgIF0sXG5cdFx0ICAgICAgICBzaGFwZXM6IHtcblx0XHRcdFx0XHQnc2hhcGUxJzoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ21hcmtlcicsXG5cdFx0XHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxuXHRcdFx0XHRcdFx0cm90YXRpb25BbmdsZTogMjAsXG5cdFx0XHRcdFx0XHRpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiAnYmx1ZSd9XG5cdFx0XHRcdFx0fSxcdCAgICAgICAgXHRcblx0XHRcdFx0XHQnc2hhcGUyJzoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ21hcmtlcicsXG5cdFx0XHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRcdFx0XHRcdFx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ3JlZCd9LFxuXHRcdFx0XHRcdH1cblx0XHQgICAgICAgIH1cblx0XHRcdFxuXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cblx0XHRcdFx0b25NYXBTaGFwZUNvbnRleHRNZW51OiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcFNoYXBlQ29udGV4dE1lbnUnLCBkYXRhKVxuXHRcdFx0XHRcdGNvbnN0IHtpZCwgcG9zfSA9IGRhdGFcblx0XHRcdFx0XHRjb25zdCBpbmZvID0gJCh0aGlzKS5pZmFjZSgpLmdldFNoYXBlSW5mbyhpZClcblx0XHRcdFx0XHRjb25zdCBpZHggPSBjdHJsLm1vZGVsLml0ZW1zLmZpbmRJbmRleCgoaXRlbSkgPT4gaXRlbS5jb2xvciA9PSBpbmZvLmljb24uY29sb3IpXG5cdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAuZW5hYmxlSGFuZGxlcnMoZmFsc2UpXG5cdFx0XHRcdFx0Y3RybC5zY29wZS5tZW51LmNsb3NlTWVudShmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2VsZWN0KGlkeCkuc2hvd01lbnUocG9zLngsIHBvcy55KVxuXHRcdFx0XHRcdFx0c2VsU2hhcGUgPSBpZFxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fSxcblxuXHRcdFx0XHRvbk1lbnVTZWxlY3RlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NZW51U2VsZWN0ZWQnLCBkYXRhKVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLnVwZGF0ZVNoYXBlKHNlbFNoYXBlLCB7aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogZGF0YS5jb2xvcn19KVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdG9uTWVudUNsb3NlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uTWVudUNsb3NlZCcpXG5cdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAuZW5hYmxlSGFuZGxlcnModHJ1ZSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdHJvbGw6IDEwLFxuXHRcdHBpdGNoOiAxMCxcblx0XHRhbHRpdHVkZTogNTAsXG5cdFx0c3BlZWQ6IDVcblx0fVx0XG59KVx0XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXY+XG5cdFx0PGRpdiBjbGFzcz1cInJhbmdlaW5wdXRcIj5cblx0XHRcdDxsYWJlbD5Sb2xsPC9sYWJlbD5cdFx0XHRcblx0XHRcdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCItNTBcIiBtYXg9XCI1MFwiIGJuLXZhbD1cInJvbGxcIiBibi11cGRhdGU9XCJpbnB1dFwiPjxicj5cblx0XHQ8L2Rpdj5cblxuXHRcdDxkaXYgY2xhc3M9XCJyYW5nZWlucHV0XCI+XG5cdFx0XHQ8bGFiZWw+UGl0Y2g8L2xhYmVsPlx0XHRcdFxuXHRcdFx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD1cIjQwXCIgYm4tdmFsPVwicGl0Y2hcIiBibi11cGRhdGU9XCJpbnB1dFwiPjxicj5cblx0XHQ8L2Rpdj5cblxuXHRcdDxkaXYgY2xhc3M9XCJyYW5nZWlucHV0XCI+XG5cdFx0XHQ8bGFiZWw+U3BlZWQ8L2xhYmVsPlx0XHRcdFxuXHRcdFx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIG1heD1cIjIwMFwiIGJuLXZhbD1cInNwZWVkXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48YnI+XG5cdFx0PC9kaXY+XG5cblx0XHQ8ZGl2IGNsYXNzPVwicmFuZ2VpbnB1dFwiPlxuXHRcdFx0PGxhYmVsPkFsdGl0dWRlPC9sYWJlbD5cdFx0XHRcblx0XHRcdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBibi12YWw9XCJhbHRpdHVkZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PGJyPlxuXHRcdDwvZGl2PlxuXG5cdDwvZGl2PlxuXG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuZmxpZ2h0cGFuZWxcIiBcblx0XHRibi1kYXRhPVwicm9sbDogcm9sbCwgcGl0Y2g6IHBpdGNoLCBzcGVlZDogc3BlZWQsIGFsdGl0dWRlOiBhbHRpdHVkZVwiPlxuXHRcdFxuPC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyNCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVxcXCJyYW5nZWlucHV0XFxcIj5cXG5cdFx0XHRcdDxsYWJlbD5Sb2xsPC9sYWJlbD5cdFx0XHRcXG5cdFx0XHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgbWluPVxcXCItNTBcXFwiIG1heD1cXFwiNTBcXFwiIGJuLXZhbD1cXFwicm9sbFxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PGJyPlxcblx0XHRcdDwvZGl2Plxcblxcblx0XHRcdDxkaXYgY2xhc3M9XFxcInJhbmdlaW5wdXRcXFwiPlxcblx0XHRcdFx0PGxhYmVsPlBpdGNoPC9sYWJlbD5cdFx0XHRcXG5cdFx0XHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgbWluPVxcXCItNDBcXFwiIG1heD1cXFwiNDBcXFwiIGJuLXZhbD1cXFwicGl0Y2hcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjxicj5cXG5cdFx0XHQ8L2Rpdj5cXG5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVxcXCJyYW5nZWlucHV0XFxcIj5cXG5cdFx0XHRcdDxsYWJlbD5TcGVlZDwvbGFiZWw+XHRcdFx0XFxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIG1heD1cXFwiMjAwXFxcIiBibi12YWw9XFxcInNwZWVkXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PC9kaXY+XFxuXFxuXHRcdFx0PGRpdiBjbGFzcz1cXFwicmFuZ2VpbnB1dFxcXCI+XFxuXHRcdFx0XHQ8bGFiZWw+QWx0aXR1ZGU8L2xhYmVsPlx0XHRcdFxcblx0XHRcdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBibi12YWw9XFxcImFsdGl0dWRlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PC9kaXY+XFxuXFxuXHRcdDwvZGl2Plxcblxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuZmxpZ2h0cGFuZWxcXFwiXFxuXHRcdFx0Ym4tZGF0YT1cXFwie3JvbGwsIHBpdGNoLCBzcGVlZCwgYWx0aXR1ZGUsIHNob3dTcGVlZH1cXFwiPlxcblx0XHRcdFx0XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cm9sbDogMTAsXG5cdFx0XHRcdHBpdGNoOiAxMCxcblx0XHRcdFx0YWx0aXR1ZGU6IDUwLFxuXHRcdFx0XHRzcGVlZDogNSxcblx0XHRcdFx0c2hvd1NwZWVkOiB0cnVlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGh0bWxDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0Y3RybC5zZXREYXRhKGRhdGEpXG5cdFx0fVxuXG5cdH1cbn0pXG5cblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiJGlcIj48L2xpPlxuXHQ8L3VsPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dWwgYm4tZWFjaD1cXFwiY2xpZW50c1xcXCI+XFxuXHRcdFx0PGxpIGJuLXRleHQ9XFxcIiRpXFxcIj48L2xpPlxcblx0XHQ8L3VsPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ10sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXHRcdFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKS5uYW1lKVxuXHRcdFx0Y3RybC51cGRhdGUoKVxuXHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dWwgYm4tZWFjaD1cImNsaWVudHNcIj5cblx0XHQ8bGkgYm4tdGV4dD1cIiRpXCI+PC9saT5cblx0PC91bD5cblxuXHQ8aDI+QWRkIGNsaWVudDwvaDI+XG5cdDxmb3JtIGJuLWV2ZW50PVwic3VibWl0OiBvbkFkZENsaWVudFwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgYXV0b2ZvY3VzPVwiXCIgcmVxdWlyZWQ9XCJcIj5cblx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5BZGQ8L2J1dHRvbj5cblx0PC9mb3JtPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx1bCBibi1lYWNoPVxcXCJjbGllbnRzXFxcIj5cXG5cdFx0XHQ8bGkgYm4tdGV4dD1cXFwiJGlcXFwiPjwvbGk+XFxuXHRcdDwvdWw+XFxuXFxuXHRcdDxoMj5BZGQgY2xpZW50PC9oMj5cXG5cdFx0PGZvcm0gYm4tZXZlbnQ9XFxcInN1Ym1pdDogb25BZGRDbGllbnRcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgYXV0b2ZvY3VzPVxcXCJcXFwiIHJlcXVpcmVkPVxcXCJcXFwiPlxcblx0XHRcdDxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIj5BZGQ8L2J1dHRvbj5cXG5cdFx0PC9mb3JtPlx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKS5uYW1lKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKClcblx0XHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgICBjbGllbnRzOiBbXG5cdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0ICAgIF1cblx0fVx0XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5hZ2VcIj48L3RkPlxuXHRcdFx0PC90cj5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q1Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjbGllbnRzXFxcIj5cXG5cdFx0XHRcdDx0cj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRpLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkaS5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHQ8L3RyPlxcblxcblx0XHRcdDwvdGJvZHk+XHRcdCBcXG5cdFx0PC90YWJsZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR0aGlzLmN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdFxuXHRcdFx0fVx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgIGNsaWVudHM6IFtcblx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHQgICAgXVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxuXHRcdFx0Y3RybC51cGRhdGUoKVxuXHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdH0sXG5cdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHR2YXIgaWR4ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmluZGV4KClcblx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeClcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0Y3RybC51cGRhdGUoKVxuXHRcdH1cblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjbGllbnRzXCIgYm4tZXZlbnQ9XCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJGkubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJGkuYWdlXCI+PC90ZD5cblx0XHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XCJkZWxCdG5cIiB0aXRsZT1cIkRlbGV0ZVwiPkRlbGV0ZTwvYnV0dG9uPlxuXHRcdFx0PC90cj5cblxuXHRcdDwvdGJvZHk+XG5cdCBcblx0PC90YWJsZT5cdFxuXG5cdDxoMj5BZGQgY2xpZW50PC9oMj5cblx0PGZvcm0gYm4tZXZlbnQ9XCJzdWJtaXQ6IG9uQWRkQ2xpZW50XCI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiByZXF1aXJlZD48YnI+XG5cdFx0PGlucHV0IHR5cGU9XCJudW1iZXJcIiBwbGFjZWhvbGRlcj1cImFnZVwiIG5hbWU9XCJhZ2VcIiByZXF1aXJlZD48YnI+XG5cdFx0PGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIkFkZFwiPlxuXHQ8L2Zvcm0+XHRcbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDYnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHRhYmxlPlxcblx0XHRcdDx0aGVhZD5cXG5cdFx0XHQgIDx0cj5cXG5cdFx0XHQgICAgPHRoPk5hbWU8L3RoPlxcblx0XHRcdCAgICA8dGg+QWdlPC90aD5cXG5cdFx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XFxuXHRcdFx0ICA8L3RyPlxcblx0XHRcdDwvdGhlYWQ+XFxuXHRcdFx0PHRib2R5IGJuLWVhY2g9XFxcImNsaWVudHNcXFwiIGJuLWV2ZW50PVxcXCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XFxcIj5cXG5cdFx0XHRcdDx0cj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRpLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkaS5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plxcblx0XHQgXFxuXHRcdDwvdGFibGU+XHRcXG5cXG5cdFx0PGgyPkFkZCBjbGllbnQ8L2gyPlxcblx0XHQ8Zm9ybSBibi1ldmVudD1cXFwic3VibWl0OiBvbkFkZENsaWVudFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgcGxhY2Vob2xkZXI9XFxcImFnZVxcXCIgbmFtZT1cXFwiYWdlXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIkFkZFxcXCI+XFxuXHRcdDwvZm9ybT5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2Plxcblxcblx0XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdCAgICBodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcbiAgICAgIFx0XHRcdFx0dmFyIGlkeCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5pbmRleCgpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4KVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKClcblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGRsZ0FkZENsaWVudCA9ICQkLmZvcm1EaWFsb2dDb250cm9sbGVyKHtcblx0dGl0bGU6ICdBZGQgQ2xpZW50Jyxcblx0dGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpXG59KVxuXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgICBjbGllbnRzOiBbXG5cdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0ICAgIF1cblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaChkYXRhKVxuXHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXHRcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdHZhciBpZHggPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuaW5kZXgoKVxuXHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4KVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgICA8dGg+QWN0aW9uPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIiBibi1ldmVudD1cImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5hZ2VcIj48L3RkPlxuXHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cImRlbEJ0blwiIHRpdGxlPVwiRGVsZXRlXCI+RGVsZXRlPC9idXR0b24+XG5cdFx0XHQ8L3RyPlxuXG5cdFx0PC90Ym9keT5cblx0IFxuXHQ8L3RhYmxlPlx0XG5cblx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZENsaWVudFwiPkFkZCBDbGllbnQ8L2J1dHRvbj5cdFxuPC9kaXY+XG5cbjxkaXYgaWQ9XCJ0ZW1wbGF0ZVwiIGhpZGRlbj1cIlwiPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuYW1lPVwibmFtZVwiIHJlcXVpcmVkPjxicj5cblx0PGlucHV0IHR5cGU9XCJudW1iZXJcIiBwbGFjZWhvbGRlcj1cImFnZVwiIG5hbWU9XCJhZ2VcIiByZXF1aXJlZD48YnI+IFxuPC9kaXY+XG5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q3Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHRhYmxlPlxcblx0XHRcdDx0aGVhZD5cXG5cdFx0XHQgIDx0cj5cXG5cdFx0XHQgICAgPHRoPk5hbWU8L3RoPlxcblx0XHRcdCAgICA8dGg+QWdlPC90aD5cXG5cdFx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XFxuXHRcdFx0ICA8L3RyPlxcblx0XHRcdDwvdGhlYWQ+XFxuXHRcdFx0PHRib2R5IGJuLWVhY2g9XFxcImNsaWVudHNcXFwiIGJuLWV2ZW50PVxcXCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XFxcIj5cXG5cdFx0XHRcdDx0cj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRpLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkaS5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plxcblx0XHQgXFxuXHRcdDwvdGFibGU+XHRcXG5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkQ2xpZW50XFxcIj5BZGQgQ2xpZW50PC9idXR0b24+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXHRcXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgZGxnQWRkQ2xpZW50ID0gJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIoe1xuXHRcdFx0dGl0bGU6ICdBZGQgQ2xpZW50Jyxcblx0XHRcdHRlbXBsYXRlOiBcIjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcbjxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHBsYWNlaG9sZGVyPVxcXCJhZ2VcXFwiIG5hbWU9XFxcImFnZVxcXCIgcmVxdWlyZWQ+PGJyPiBcdFx0XCJcblx0XHR9KVxuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdCAgICBodG1sQ29kZSxcblx0XHRcdCAgICBqc0NvZGVcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRkbGdBZGRDbGllbnQuc2hvdyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaChkYXRhKVxuXHRcdFx0XHRcdFx0Y3RybC51cGRhdGUoKVx0XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG4gICAgICBcdFx0XHRcdHZhciBpZHggPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuaW5kZXgoKVxuICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9KVxuXG5cdFx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRkbGdBZGRDbGllbnQuZGVzdHJveSgpXG5cdFx0fVxuXHR9XG59KVxuXG59KSgpO1xuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgZnJ1aXRzOlsnb3JhbmdlJywgJ2FwcGxlJywgJ2JhbmFuYXMnLCAnbGVtb24nXSxcblx0ICBmYXZvcml0ZUZydWl0OidhcHBsZSdcblx0fVx0XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRcIj48L3NwYW4+PC9wPlxuXHQ8c2VsZWN0IGJuLWNvbnRyb2w9XCJicmFpbmpzLnNlbGVjdG1lbnVcIiBcblx0XHRibi12YWw9XCJmYXZvcml0ZUZydWl0XCIgXG5cdFx0Ym4tdXBkYXRlPVwic2VsZWN0bWVudWNoYW5nZVwiIFxuXHRcdGJuLWVhY2g9XCJmcnVpdHNcIj5cblx0XHRcdDxvcHRpb24gYm4tdGV4dD1cIiRpXCI+PC9vcHRpb24+XG5cdDwvc2VsZWN0PlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0OCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkZydWl0czwvaDI+XFxuXHRcdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cXFwiZmF2b3JpdGVGcnVpdFxcXCI+PC9zcGFuPjwvcD5cXG5cdFx0PHNlbGVjdCBibi1jb250cm9sPVxcXCJicmFpbmpzLnNlbGVjdG1lbnVcXFwiIGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdFxcXCIgYm4tdXBkYXRlPVxcXCJzZWxlY3RtZW51Y2hhbmdlXFxcIiBibi1lYWNoPVxcXCJmcnVpdHNcXFwiPlxcblx0XHRcdDxvcHRpb24gYm4tdGV4dD1cXFwiJGlcXFwiPjwvb3B0aW9uPlxcblx0XHQ8L3NlbGVjdD5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGZydWl0czpbJ29yYW5nZScsICdhcHBsZScsICdiYW5hbmFzJywgJ2xlbW9uJ10sXG5cdFx0XHRcdGZhdm9yaXRlRnJ1aXQ6J2FwcGxlJyxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0ICBcblx0XHRcdH1cdFx0XHRcblx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgIGNsaWVudHM6W1xuXHQgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fSxcblx0ICAgICB7bmFtZTogJ0x1Y2FzJywgYWdlOiAyMn0sXG5cdCAgICAge25hbWU6ICdRdWVudGluJywgYWdlOiAxNX0sXG5cdCAgICAge25hbWU6ICdMYXVyZW50JywgYWdlOiAzMn1cblx0ICAgXSxcblx0ICAgZmlsdGVyOicnLFxuXHQgICBnZXRGaWx0ZXJlZENsaWVudHM6IGZ1bmN0aW9uKCkge1xuXHQgICAgIHJldHVybiBjbGllbnRzLmZpbHRlcihmdW5jdGlvbihjbGllbnQpIHtcblx0ICAgICAgIHJldHVybiBjbGllbnQubmFtZS5zdGFydHNXaXRoKGZpbHRlcik7XG5cdCAgICAgfSlcblx0ICAgfSAgICBcblxuXHQgfVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgYnkgbmFtZVwiIGJuLXZhbD1cImZpbHRlclwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDx0YWJsZT5cblx0ICA8dGhlYWQ+XG5cdCAgICA8dHI+XG5cdCAgICAgIDx0aD5OYW1lPC90aD5cblx0ICAgICAgPHRoPkFnZTwvdGg+XG5cdCAgICA8L3RyPlxuXHQgIDwvdGhlYWQ+XG5cdCAgPHRib2R5IGJuLWVhY2g9XCJnZXRGaWx0ZXJlZENsaWVudHMoKVwiPlxuXHQgICAgPHRyPlxuXHQgICAgICA8dGQgYm4tdGV4dD1cIiRpLm5hbWVcIj48L3RkPlxuXHQgICAgICA8dGQgYm4tdGV4dD1cIiRpLmFnZVwiPjwvdGQ+XG5cdCAgICA8L3RyPlxuXHQgIDwvdGJvZHk+XG5cdCAgIFxuXHQ8L3RhYmxlPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0OScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcbiAgPGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG4gICAgPGgyPkNsaWVudHM8L2gyPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcImZpbHRlciBieSBuYW1lXFxcIiBibi12YWw9XFxcImZpbHRlclxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuICAgIDx0YWJsZT5cXG4gICAgICA8dGhlYWQ+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgIDx0aD5OYW1lPC90aD5cXG4gICAgICAgICAgPHRoPkFnZTwvdGg+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGhlYWQ+XFxuICAgICAgPHRib2R5IGJuLWVhY2g9XFxcImdldEZpbHRlcmVkQ2xpZW50cygpXFxcIj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgPHRkIGJuLXRleHQ9XFxcIiRpLm5hbWVcXFwiPjwvdGQ+XFxuICAgICAgICAgIDx0ZCBibi10ZXh0PVxcXCIkaS5hZ2VcXFwiPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGJvZHk+XFxuICAgICAgIFxcbiAgICA8L3RhYmxlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG4gICAgPHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcbiAgICA8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj4gIFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgIGNsaWVudHM6W1xuXHRcdFx0ICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0x1Y2FzJywgYWdlOiAyMn0sXG5cdFx0XHQgICAgIHtuYW1lOiAnUXVlbnRpbicsIGFnZTogMTV9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0xhdXJlbnQnLCBhZ2U6IDMyfVxuXHRcdFx0ICAgXSxcblx0XHRcdCAgIGZpbHRlcjonJyxcblx0XHRcdCAgIGdldEZpbHRlcmVkQ2xpZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgIHJldHVybiBjbGllbnRzLmZpbHRlcihmdW5jdGlvbihjbGllbnQpIHtcblx0XHRcdCAgICAgICByZXR1cm4gY2xpZW50Lm5hbWUuc3RhcnRzV2l0aChmaWx0ZXIpO1xuXHRcdFx0ICAgICB9KVxuXG5cdFx0XHQgICB9LFxuXHRcdFx0ICAgaHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFxuXG5cblx0XHRcdCB9XG5cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cblxuXG4iXX0=
