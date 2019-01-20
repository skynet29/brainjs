
$(function() {

	let routes = [
		{href: '/', redirect: '/test1'}
	]
	for(let i = 1; i <= 18; i++ ) {
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
		onMapClick: function(ev, latlng) {
			console.log('onMapClick', latlng)
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
		onMapContextMenu: function(ev, cmd, latlng) {
			console.log('onMapContextMenu', cmd, latlng)
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
				onMapClick: function(ev, latlng) {
					console.log('onMapClick', latlng)
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
				onMapContextMenu: function(ev, cmd, latlng) {
					console.log('onMapContextMenu', cmd, latlng)
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
		onShapeEdited: function(ev, shapes) {
			console.log('onShapeEdited', shapes)
		},
		onShapeDeleted: function(ev, shapes) {
			console.log('onShapeDeleted', shapes)
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.map\" class=\"map\" \n			bn-data=\"center: center, plugins: plugins, layers: layers\"\n			bn-event=\"mapshapecreated: onShapeCreated, mapshapeedited: onShapeEdited, mapshapedeleted: onShapeDeleted\" \n			bn-iface=\"map\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
				onShapeEdited: function(ev, shapes) {
					console.log('onShapeEdited', shapes)
				},
				onShapeDeleted: function(ev, shapes) {
					console.log('onShapeDeleted', shapes)
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





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QxMy5qcyIsInRlc3QxNC5qcyIsInRlc3QxNS5qcyIsInRlc3QxNi5qcyIsInRlc3QxNy5qcyIsInRlc3QxOC5qcyIsInRlc3QyLmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkZW1vLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4kKGZ1bmN0aW9uKCkge1xuXG5cdGxldCByb3V0ZXMgPSBbXG5cdFx0e2hyZWY6ICcvJywgcmVkaXJlY3Q6ICcvdGVzdDEnfVxuXHRdXG5cdGZvcihsZXQgaSA9IDE7IGkgPD0gMTg7IGkrKyApIHtcblx0XHRyb3V0ZXMucHVzaCh7XG5cdFx0XHRocmVmOiAnL3Rlc3QnICsgaSwgY29udHJvbDogJ3Rlc3QnICsgaVxuXHRcdH0pXG5cdH1cblxuXG5cblx0JCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRcdGRhdGE6IHtcblx0XHRcdHJvdXRlc1xuXHRcdH1cblx0fSlcbn0pO1xuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCdcblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8cCBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3A+XHRcdFx0XHRcdFx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGVcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICByYWRpdXM6MTBcblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8c3ZnIGhlaWdodD1cIjEwMFwiIHdpZHRoPVwiMTAwXCI+XG5cdCAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIGJuLWF0dHI9XCJyOiByYWRpdXNcIiBzdHJva2U9XCJibGFja1wiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwicmVkXCIgLz5cblx0PC9zdmc+XG5cdCAgXG5cdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBibi12YWw9XCJyYWRpdXNcIiBibi11cGRhdGU9XCJpbnB1dFwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEwJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8c3ZnIGhlaWdodD1cXFwiMTAwXFxcIiB3aWR0aD1cXFwiMTAwXFxcIj5cXG5cdFx0ICA8Y2lyY2xlIGN4PVxcXCI1MFxcXCIgY3k9XFxcIjUwXFxcIiBibi1hdHRyPVxcXCJyOiByYWRpdXNcXFwiIHN0cm9rZT1cXFwiYmxhY2tcXFwiIHN0cm9rZS13aWR0aD1cXFwiM1xcXCIgZmlsbD1cXFwicmVkXFxcIiAvPlxcblx0XHQ8L3N2Zz5cXG5cdFx0ICBcXG5cdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBibi12YWw9XFxcInJhZGl1c1xcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgIHJhZGl1czoxMCxcblx0XHRcdCAgaHRtbENvZGUsXG5cdFx0XHQgIGpzQ29kZVxuXHRcdFx0fVxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFibGUnLCB7ICAgXG4gICAgcHJvcHM6IHtcbiAgICBcdGNsaWVudHM6IFtdXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJyksXG4gICAgaW5pdDogZnVuY3Rpb24oZWx0KSB7XG4gICAgXHRjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMucHJvcHMpXG4gICAgICBcbiAgICAgIHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY2xpZW50czogdGhpcy5wcm9wcy5jbGllbnRzXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9IFxuICB9XG4pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdCAgbXlDbGllbnRzOiBbXG5cdCAgICB7bmFtZTogJ1F1ZW50aW4nLCBjaXR5OiAnUmVubmVzJ30sXG5cdCAgICB7bmFtZTogJ01hcmMnLCBjaXR5OiAnQmV0aHVuZSd9XG5cdCAgXSxcblx0ICBteUNsaWVudHMyOiBbXG5cdCAgICB7bmFtZTogJ0JyaWdpdHRlJywgY2l0eTogJ0xlIE1hbnMnfSxcblx0ICAgIHtuYW1lOiAnR2VvcmdlcycsIGNpdHk6ICdWZXJxdWluJ31cblx0ICBdXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkN1c3RvbSBjb250cm9sPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiTXlUYWJsZVwiIGJuLWRhdGE9XCJjbGllbnRzOiBteUNsaWVudHNcIj48L2Rpdj5cblx0PGhyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJNeVRhYmxlXCIgYm4tZGF0YT1cImNsaWVudHM6IG15Q2xpZW50czJcIj48L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRoPk5hbWU8L3RoPlxuXHRcdFx0XHQ8dGg+Q2l0eTwvdGg+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiPlxuXHRcdFx0PHRyPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5jaXR5XCI+PC90ZD5cblx0XHRcdDwvdHI+XG5cdFx0PC90Ym9keT5cblx0PC90YWJsZT5cdFxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJsZScsIHsgICBcbiAgICBwcm9wczoge1xuICAgIFx0Y2xpZW50czogW11cbiAgICB9LFxuICAgIHRlbXBsYXRlOiBcIjx0YWJsZT5cXG5cdDx0aGVhZD5cXG5cdFx0PHRyPlxcblx0XHRcdDx0aD5OYW1lPC90aD5cXG5cdFx0XHQ8dGg+Q2l0eTwvdGg+XFxuXHRcdDwvdHI+XFxuXHQ8L3RoZWFkPlxcblxcblx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdDx0cj5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmNpdHlcXFwiPjwvdGQ+XFxuXHRcdDwvdHI+XFxuXHQ8L3Rib2R5PlxcbjwvdGFibGU+XHRcIixcbiAgICBpbml0OiBmdW5jdGlvbihlbHQpIHtcbiAgICBcdGNvbnNvbGUubG9nKCdpbml0JywgdGhpcy5wcm9wcylcbiAgICAgIFxuICAgICAgdGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjbGllbnRzOiB0aGlzLnByb3BzLmNsaWVudHNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgIH0gXG4gIH1cbilcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0ICA8aDI+Q3VzdG9tIGNvbnRyb2w8L2gyPlxcblx0XHQgIDxkaXYgYm4tY29udHJvbD1cXFwiTXlUYWJsZVxcXCIgYm4tZGF0YT1cXFwiY2xpZW50czogbXlDbGllbnRzXFxcIj48L2Rpdj5cXG5cdFx0ICA8aHI+XFxuXHRcdCAgPGRpdiBibi1jb250cm9sPVxcXCJNeVRhYmxlXFxcIiBibi1kYXRhPVxcXCJjbGllbnRzOiBteUNsaWVudHMyXFxcIj48L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdCAgbXlDbGllbnRzOiBbXG5cdFx0XHQgICAge25hbWU6ICdRdWVudGluJywgY2l0eTogJ1Jlbm5lcyd9LFxuXHRcdFx0ICAgIHtuYW1lOiAnTWFyYycsIGNpdHk6ICdCZXRodW5lJ31cblx0XHRcdCAgXSxcblx0XHRcdCAgbXlDbGllbnRzMjogW1xuXHRcdFx0ICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBjaXR5OiAnTGUgTWFucyd9LFxuXHRcdFx0ICAgIHtuYW1lOiAnR2VvcmdlcycsIGNpdHk6ICdWZXJxdWluJ31cblx0XHRcdCAgXSxcblx0XHRcdCAgaHRtbENvZGUsXG5cdFx0XHQgIGpzQ29kZVxuXHRcdFx0fSBcblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRmYXZvcml0ZUZydWl0czpbJ2FwcGxlJywgJ29yYW5nZSddLFxuXHRcdGdlbmRlcjogJ21hbGUnXG5cdH0gXG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5GcnVpdHM8L2gyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmNoZWNrZ3JvdXBcIiBibi12YWw9XCJmYXZvcml0ZUZydWl0c1wiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwib3JhbmdlXCI+T3JhbmdlXG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwiYmFuYW5hc1wiPkJhbmFuYXNcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJhcHBsZVwiPkFwcGxlXG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwibGVtb25cIj5MZW1vblxuXHQ8L2Rpdj5cblxuXHQgIDxwPllvdXIgZmF2b3JpdCBmcnVpdHM6IDxzcGFuIGJuLXRleHQ9XCJmYXZvcml0ZUZydWl0c1wiPjwvc3Bhbj48L3A+XG5cblx0PGgyPkdlbmRlcjwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMucmFkaW9ncm91cFwiIGJuLXZhbD1cImdlbmRlclwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdCAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwibWFsZVwiPk1hbGVcblx0ICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJmZW1hbGVcIj5GZW1hbGVcblx0PC9kaXY+XG5cdDxwPkdlbmRlcjogPHNwYW4gYm4tdGV4dD1cImdlbmRlclwiPjwvc3Bhbj48L3A+XG48L2Rpdj5cblxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEyJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNoZWNrZ3JvdXBcXFwiIGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcIm9yYW5nZVxcXCI+T3JhbmdlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwiYmFuYW5hc1xcXCI+QmFuYW5hc1xcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImFwcGxlXFxcIj5BcHBsZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImxlbW9uXFxcIj5MZW1vblxcblx0XHQ8L2Rpdj5cXG5cdFx0XFxuXHRcdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiPjwvc3Bhbj48L3A+XFxuXFxuXHRcdDxoMj5HZW5kZXI8L2gyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMucmFkaW9ncm91cFxcXCIgYm4tdmFsPVxcXCJnZW5kZXJcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgdmFsdWU9XFxcIm1hbGVcXFwiPk1hbGVcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIHZhbHVlPVxcXCJmZW1hbGVcXFwiPkZlbWFsZVxcblx0XHQ8L2Rpdj5cXG5cdFx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVxcXCJnZW5kZXJcXFwiPjwvc3Bhbj48L3A+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRmYXZvcml0ZUZydWl0czpbJ2FwcGxlJywgJ29yYW5nZSddLFxuXHRcdFx0XHRnZW5kZXI6ICdtYWxlJyxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSBcblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFiQ3RybCcsIHtcblx0dGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbydcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cbn0pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uVGFiQWN0aXZhdGU6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UYWJBY3RpdmF0ZScsICQodGhpcykuaWZhY2UoKS5nZXRTZWxlY3RlZFRhYkluZGV4KCkpXG5cdFx0fSxcblx0XHRvbkFkZFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZFRhYicpXG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzxwPkdvb2QgbW9ybmluZzxwPidcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uQWRkQ3RybFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZEN0cmxUYWInKVxuXHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0Y29udHJvbDogJ015VGFiQ3RybCdcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uU2hvd1RhYkluZm86IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zdCBjb3VudCA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJzQ291bnQoKVxuXHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0Y29uc3QgdGl0bGUgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFiSW5mbyhzZWxJZHgpLnRpdGxlXG5cdFx0XHRjb25zdCBjb250ZW50ID0gXFxgXG5cdFx0XHRcdDxwPlRhYnNDb3VudDogXFwke2NvdW50fTwvcD5cblx0XHRcdFx0PHA+U2VsSW5kZXg6IFxcJHtzZWxJZHh9PC9wPlxuXHRcdFx0XHQ8cD5TZWxUYWIgVGl0bGU6IFxcJHt0aXRsZX08cD5cblx0XHRcdFxcYFxuXHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50fSlcblx0XHR9LFxuXHRcdG9uUmVtb3ZlU2VsVGFiOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHNlbElkeCA9IGN0cmwuc2NvcGUudGFicy5nZXRTZWxlY3RlZFRhYkluZGV4KClcblx0XHRcdGN0cmwuc2NvcGUudGFicy5yZW1vdmVUYWIoc2VsSWR4KVxuXHRcdH1cblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMudGFic1wiIGJuLWlmYWNlPVwidGFic1wiIGJuLWV2ZW50PVwidGFic2FjdGl2YXRlOiBvblRhYkFjdGl2YXRlXCI+XG5cdFx0PGRpdiB0aXRsZT1cIlRhYiAxXCI+XG5cdFx0XHQ8cD5IZWxsbyBXb3JsZDwvcD5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IHRpdGxlPVwiVGFiIDJcIj5cblx0XHRcdDxwPkJvbmpvdXIgbGUgbW9uZGU8L3A+XG5cdFx0PC9kaXY+XG5cdDwvZGl2PlxuXHQ8YnI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY29udHJvbGdyb3VwXCI+XHRcdFx0XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZFRhYlwiPkFkZCBUYWI8L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkQ3RybFRhYlwiPkFkZCBDb250cm9sIFRhYjwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25TaG93VGFiSW5mb1wiPlNob3cgVGFiIEluZm88L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uUmVtb3ZlU2VsVGFiXCI+UmVtb3ZlIFNlbCBUYWI8L2J1dHRvbj5cblx0PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLXZhbD1cIm1lc3NhZ2VcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEzLXRhYmN0cmwnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXY+XFxuXHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJtZXNzYWdlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvc3Bhbj48L3A+XHRcdFxcbjwvZGl2PlxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbydcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cbn0pXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIiBibi1pZmFjZT1cXFwidGFic1xcXCIgYm4tZXZlbnQ9XFxcInRhYnNhY3RpdmF0ZTogb25UYWJBY3RpdmF0ZVxcXCI+XFxuXHRcdFx0PGRpdiB0aXRsZT1cXFwiVGFiIDFcXFwiPlxcblx0XHRcdFx0PHA+SGVsbG8gV29ybGQ8L3A+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdFx0PGRpdiB0aXRsZT1cXFwiVGFiIDJcXFwiPlxcblx0XHRcdFx0PHA+Qm9uam91ciBsZSBtb25kZTwvcD5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHRcdDxicj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNvbnRyb2xncm91cFxcXCI+XHRcdFx0XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkVGFiXFxcIj5BZGQgVGFiPC9idXR0b24+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkQ3RybFRhYlxcXCI+QWRkIENvbnRyb2wgVGFiPC9idXR0b24+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uU2hvd1RhYkluZm9cXFwiPlNob3cgVGFiIEluZm88L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25SZW1vdmVTZWxUYWJcXFwiPlJlbW92ZSBTZWwgVGFiPC9idXR0b24+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblRhYkFjdGl2YXRlOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRhYkFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldFNlbGVjdGVkVGFiSW5kZXgoKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGRUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkVGFiJylcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogJzxwPkdvb2QgbW9ybmluZzxwPidcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbkFkZEN0cmxUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ3RybFRhYicpXG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0Y29udHJvbDogJ3Rlc3QxMy10YWJjdHJsJ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uU2hvd1RhYkluZm86IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc3QgY291bnQgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFic0NvdW50KClcblx0XHRcdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRcdFx0Y29uc3QgdGl0bGUgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFiSW5mbyhzZWxJZHgpLnRpdGxlXG5cdFx0XHRcdFx0Y29uc3QgY29udGVudCA9IGBcblx0XHRcdFx0XHRcdDxwPlRhYnNDb3VudDogJHtjb3VudH08L3A+XG5cdFx0XHRcdFx0XHQ8cD5TZWxJbmRleDogJHtzZWxJZHh9PC9wPlxuXHRcdFx0XHRcdFx0PHA+U2VsVGFiIFRpdGxlOiAke3RpdGxlfTxwPlxuXHRcdFx0XHRcdGBcblx0XHRcdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZVNlbFRhYjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUudGFicy5yZW1vdmVUYWIoc2VsSWR4KVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0IFxuXHRcdH0pXG5cblx0XHRjb25zb2xlLmxvZygnc2NvcGUnLCBjdHJsLnNjb3BlKVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRkYXRlOiBuZXcgRGF0ZSgxOTcyLCAwLCAzKSxcblx0XHRmb3JtYXRlZERhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKVxuXHRcdH1cdFx0XG5cdH0sXG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLWNvbnRyb2w9XCJicmFpbmpzLmRhdGVwaWNrZXJcIiBibi12YWw9XCJkYXRlXCIgYm4tdXBkYXRlPVwiZGF0ZXBpY2tlcmNoYW5nZVwiPlxuXHQ8cD5EYXRlOiA8c3BhbiBibi10ZXh0PVwiZm9ybWF0ZWREYXRlXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0IFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLWNvbnRyb2w9XFxcImJyYWluanMuZGF0ZXBpY2tlclxcXCIgYm4tdmFsPVxcXCJkYXRlXFxcIiBibi11cGRhdGU9XFxcImRhdGVwaWNrZXJjaGFuZ2VcXFwiPlxcblx0IFx0PHA+RGF0ZTogPHNwYW4gYm4tdGV4dD1cXFwiZm9ybWF0ZWREYXRlXFxcIj48L3NwYW4+PC9wPlxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRkYXRlOiBuZXcgRGF0ZSgxOTcyLCAwLCAzKSxcblx0XHRcdFx0Zm9ybWF0ZWREYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRlLnRvRGF0ZVN0cmluZygpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHR9LFxuXHRcdCBcblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0aXNTdGFydGVkOiBmYWxzZVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdGN0cmwuc2NvcGUuY2FtZXJhLnN0YXJ0KClcblx0XHR9LFxuXHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVGFrZVBpY3R1cmUnKVxuXHRcdFx0dmFyIHVybCA9IGN0cmwuc2NvcGUuY2FtZXJhLnRha2VQaWN0dXJlKClcblx0XHRcdHZhciBjb250ZW50ID0gXFxgPGltZyBzcmM9XCJcXCR7dXJsfVwiPlxcYFxuXHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50LCB3aWR0aDogJ2F1dG8nfSlcblx0XHR9XHRcdFx0XG5cdH1cdFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uU3RhcnRcIiBibi1zaG93PVwiIWlzU3RhcnRlZFwiPlN0YXJ0PC9idXR0b24+XG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25UYWtlUGljdHVyZVwiIGJuLXNob3c9XCJpc1N0YXJ0ZWRcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jYW1lcmFcIiBibi1pZmFjZT1cImNhbWVyYVwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTUnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblN0YXJ0XFxcIiBibi1zaG93PVxcXCIhaXNTdGFydGVkXFxcIj5TdGFydDwvYnV0dG9uPlxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25UYWtlUGljdHVyZVxcXCIgYm4tc2hvdz1cXFwiaXNTdGFydGVkXFxcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNhbWVyYVxcXCIgYm4taWZhY2U9XFxcImNhbWVyYVxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRpc1N0YXJ0ZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdFx0XHRjdHJsLnNjb3BlLmNhbWVyYS5zdGFydCgpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRha2VQaWN0dXJlJylcblx0XHRcdFx0XHR2YXIgdXJsID0gY3RybC5zY29wZS5jYW1lcmEudGFrZVBpY3R1cmUoKVxuXHRcdFx0XHRcdHZhciBjb250ZW50ID0gYDxpbWcgc3JjPVwiJHt1cmx9XCI+YFxuXHRcdFx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudCwgd2lkdGg6ICdhdXRvJ30pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQgXG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdHNvdXJjZTogW1xuXHRcdFx0e3RpdGxlOiAnTm9kZSAxJywgZm9sZGVyOiB0cnVlLCBjaGlsZHJlbjogW1xuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMSd9LFxuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMid9XG5cdFx0XHRdfSxcblx0XHRcdHt0aXRsZTogJ05vZGUgMid9XG5cdFx0XSxcblx0XHRjb250ZXh0TWVudToge1xuXHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0JywgaWNvbjogJ2VkaXQnfSxcblx0XHRcdGN1dDoge25hbWU6ICdDdXQnLCBpY29uOiAnY3V0J31cblx0XHR9XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblRyZWVBY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0QWN0aXZlTm9kZSgpLnRpdGxlKVxuXHRcdH0sXG5cdFx0b25UcmVlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBhY3Rpb24pIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVDb250ZXh0TWVudScsIGFjdGlvbilcblx0XHR9LFxuXHRcdG9uQWRkTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIE5vZGUnLCBsYWJlbDogJ05vZGUgdGl0bGUnfSwgZnVuY3Rpb24odGl0bGUpIHtcblx0XHRcdFx0XG5cdFx0XHRcdGFjdGl2ZU5vZGUuYWRkTm9kZSh7dGl0bGV9KVxuXHRcdFx0XHRhY3RpdmVOb2RlLnNldEV4cGFuZGVkKHRydWUpXG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVTZWxOb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0YWN0aXZlTm9kZS5yZW1vdmUoKVxuXHRcdH1cblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRyZWVcIiBcblx0XHRibi1kYXRhPVwic291cmNlOiBzb3VyY2UsIGNvbnRleHRNZW51OiBjb250ZXh0TWVudVwiIFxuXHRcdGJuLWV2ZW50PVwidHJlZWFjdGl2YXRlOiBvblRyZWVBY3RpdmF0ZSwgdHJlZWNvbnRleHRtZW51OiBvblRyZWVDb250ZXh0TWVudVwiIFxuXHRcdGJuLWlmYWNlPVwidHJlZVwiPjwvZGl2PlxuXHQ8YnI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY29udHJvbGdyb3VwXCI+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZE5vZGVcIj5BZGQgTm9kZTwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25SZW1vdmVTZWxOb2RlXCI+UmVtb3ZlIFNlbE5vZGU8L2J1dHRvbj5cdFx0XHRcdFxuXHQ8L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE2Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudHJlZVxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwic291cmNlOiBzb3VyY2UsIGNvbnRleHRNZW51OiBjb250ZXh0TWVudVxcXCIgXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcInRyZWVhY3RpdmF0ZTogb25UcmVlQWN0aXZhdGUsIHRyZWVjb250ZXh0bWVudTogb25UcmVlQ29udGV4dE1lbnVcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJ0cmVlXFxcIj48L2Rpdj5cXG5cdFx0PGJyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY29udHJvbGdyb3VwXFxcIj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGROb2RlXFxcIj5BZGQgTm9kZTwvYnV0dG9uPlxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblJlbW92ZVNlbE5vZGVcXFwiPlJlbW92ZSBTZWxOb2RlPC9idXR0b24+XHRcdFx0XHRcXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRzb3VyY2U6IFtcblx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEnLCBmb2xkZXI6IHRydWUsIGNoaWxkcmVuOiBbXG5cdFx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMSd9LFxuXHRcdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjInfVxuXHRcdFx0XHRcdF19LFxuXHRcdFx0XHRcdHt0aXRsZTogJ05vZGUgMid9XG5cdFx0XHRcdF0sXG5cblx0XHRcdFx0Y29udGV4dE1lbnU6IHtcblx0XHRcdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnLCBpY29uOiAnZWRpdCd9LFxuXHRcdFx0XHRcdGN1dDoge25hbWU6ICdDdXQnLCBpY29uOiAnY3V0J31cblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uVHJlZUFjdGl2YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0QWN0aXZlTm9kZSgpLnRpdGxlKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblRyZWVDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGFjdGlvbikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVDb250ZXh0TWVudScsIGFjdGlvbilcblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGROb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0XHRcdGlmIChhY3RpdmVOb2RlID09IG51bGwpIHtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBOb2RlJywgbGFiZWw6ICdOb2RlIHRpdGxlJ30sIGZ1bmN0aW9uKHRpdGxlKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGFjdGl2ZU5vZGUuYWRkTm9kZSh7dGl0bGV9KVxuXHRcdFx0XHRcdFx0YWN0aXZlTm9kZS5zZXRFeHBhbmRlZCh0cnVlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlU2VsTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YWN0aXZlTm9kZS5yZW1vdmUoKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQgXG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSwgLy8gQnJlc3QgY2l0eVxuXHRcdGxheWVyczoge1xuXHRcdFx0J2xheWVyMSc6IHtsYWJlbDogJ0xheWVyIDEnLCB2aXNpYmxlOiB0cnVlfSxcblx0XHRcdCdsYXllcjInOiB7bGFiZWw6ICdMYXllciAyJywgdmlzaWJsZTogdHJ1ZX1cblx0XHR9LFxuXHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnfSxcblx0XHRcdHNlcDoge25hbWU6ICctLSd9LFxuXHRcdFx0Y29weToge25hbWU6ICdDb3B5J31cblx0XHR9XHRcdFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uTWFwQ2xpY2s6IGZ1bmN0aW9uKGV2LCBsYXRsbmcpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgbGF0bG5nKVxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoJ21hcmtlcicsIHtsYXRsbmd9KVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnbWFya2VyJywge1xuXHRcdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRcdGxhdGxuZ1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25NYXBDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGNtZCwgbGF0bG5nKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25NYXBDb250ZXh0TWVudScsIGNtZCwgbGF0bG5nKVxuXHRcdH1cdFx0XG5cdH1cdFxufSlcblxuY3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMScsIHtcblx0dHlwZTogJ21hcmtlcicsXG5cdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ5MX0sXG5cdHJvdGF0aW9uQW5nbGU6IDIwLFxuXHRpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiAnYmx1ZSd9LFxuXHRwb3B1cENvbnRlbnQ6ICdIZWxsbyBXb3JsZCcsXG5cdGxheWVyOiAnbGF5ZXIxJ1xufSlcblxuY3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMicsIHtcblx0dHlwZTogJ2NpcmNsZScsXG5cdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ3MX0sXG5cdHJhZGl1czogMTAwLFxuXHRzdHlsZToge2NvbG9yOiAncmVkJ30sXG5cdGxheWVyOiAnbGF5ZXIyJ1xufSlcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5tYXBcIiBjbGFzcz1cIm1hcFwiIFxuXHRcdGJuLWRhdGE9XCJjZW50ZXI6IGNlbnRlciwgbGF5ZXJzOiBsYXllcnMsIGNvbnRleHRNZW51OiBjb250ZXh0TWVudVwiIFxuXHRcdGJuLWlmYWNlPVwibWFwXCJcblx0XHRibi1ldmVudD1cIm1hcGNsaWNrOiBvbk1hcENsaWNrLCBtYXBjb250ZXh0bWVudTogb25NYXBDb250ZXh0TWVudVwiXG5cdFx0ZGF0YS1zY2FsZT1cInRydWVcIlxuXHRcdGRhdGEtY29vcmRpbmF0ZXM9XCJ0cnVlXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1hcFxcXCIgY2xhc3M9XFxcIm1hcFxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwiY2VudGVyOiBjZW50ZXIsIGxheWVyczogbGF5ZXJzLCBjb250ZXh0TWVudTogY29udGV4dE1lbnVcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcIm1hcGNsaWNrOiBvbk1hcENsaWNrLCBtYXBjb250ZXh0bWVudTogb25NYXBDb250ZXh0TWVudVxcXCJcXG5cdFx0XHRkYXRhLXNjYWxlPVxcXCJ0cnVlXFxcIlxcblx0XHRcdGRhdGEtY29vcmRpbmF0ZXM9XFxcInRydWVcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LFxuXHRcdFx0XHRsYXllcnM6IHtcblx0XHRcdFx0XHQnbGF5ZXIxJzoge2xhYmVsOiAnTGF5ZXIgMScsIHZpc2libGU6IHRydWV9LFxuXHRcdFx0XHRcdCdsYXllcjInOiB7bGFiZWw6ICdMYXllciAyJywgdmlzaWJsZTogdHJ1ZX1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udGV4dE1lbnU6IHtcblx0XHRcdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnfSxcblx0XHRcdFx0XHRzZXA6IHtuYW1lOiAnLS0nfSxcblx0XHRcdFx0XHRjb3B5OiB7bmFtZTogJ0NvcHknfVxuXHRcdFx0XHR9XG5cblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25NYXBDbGljazogZnVuY3Rpb24oZXYsIGxhdGxuZykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgbGF0bG5nKVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC51cGRhdGVTaGFwZSgnbWFya2VyJywge2xhdGxuZ30pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoKGUpIHtcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdtYXJrZXInLCB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRcdFx0XHRsYXRsbmdcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbk1hcENvbnRleHRNZW51OiBmdW5jdGlvbihldiwgY21kLCBsYXRsbmcpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NYXBDb250ZXh0TWVudScsIGNtZCwgbGF0bG5nKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTEnLCB7XG5cdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ5MX0sXG5cdFx0XHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0XHRcdGljb246IHt0eXBlOiAnYWlzJywgY29sb3I6ICdibHVlJ30sXG5cdFx0XHRwb3B1cENvbnRlbnQ6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRsYXllcjogJ2xheWVyMSdcblx0XHR9KVxuXG5cdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMicsIHtcblx0XHRcdHR5cGU6ICdjaXJjbGUnLFxuXHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDcxfSxcblx0XHRcdHJhZGl1czogMTAwLFxuXHRcdFx0c3R5bGU6IHtjb2xvcjogJ3JlZCd9LFxuXHRcdFx0bGF5ZXI6ICdsYXllcjInXG5cdFx0fSlcblxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LCAvLyBCcmVzdCBjaXR5XG5cdFx0cGx1Z2luczoge1xuXHRcdFx0J2VkaXRvcic6IHtlZGl0TGF5ZXI6ICdsYXllcjEnfVxuXHRcdH0sXG5cdFx0bGF5ZXJzOiB7XG5cdFx0XHQnbGF5ZXIxJzoge3Zpc2libGU6IHRydWV9XG5cdFx0fVx0XHRcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25TaGFwZUNyZWF0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBTaGFwZScsIGxhYmVsOiAnc2hhcGUgaWQ6J30sIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdGRhdGEubGF5ZXIgPSAnbGF5ZXIxJ1xuXHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZShpZCwgZGF0YSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uU2hhcGVFZGl0ZWQ6IGZ1bmN0aW9uKGV2LCBzaGFwZXMpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRWRpdGVkJywgc2hhcGVzKVxuXHRcdH0sXG5cdFx0b25TaGFwZURlbGV0ZWQ6IGZ1bmN0aW9uKGV2LCBzaGFwZXMpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRGVsZXRlZCcsIHNoYXBlcylcblx0XHR9XHRcdFx0XHRcblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgY2xhc3M9XCJtYXBcIiBcblx0XHRibi1kYXRhPVwiY2VudGVyOiBjZW50ZXIsIHBsdWdpbnM6IHBsdWdpbnMsIGxheWVyczogbGF5ZXJzXCJcblx0XHRibi1ldmVudD1cIm1hcHNoYXBlY3JlYXRlZDogb25TaGFwZUNyZWF0ZWQsIG1hcHNoYXBlZWRpdGVkOiBvblNoYXBlRWRpdGVkLFxuXHRcdCBtYXBzaGFwZWRlbGV0ZWQ6IG9uU2hhcGVEZWxldGVkXCIgXG5cdFx0Ym4taWZhY2U9XCJtYXBcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE4Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMubWFwXFxcIiBjbGFzcz1cXFwibWFwXFxcIiBcXG5cdFx0XHRibi1kYXRhPVxcXCJjZW50ZXI6IGNlbnRlciwgcGx1Z2luczogcGx1Z2lucywgbGF5ZXJzOiBsYXllcnNcXFwiXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcIm1hcHNoYXBlY3JlYXRlZDogb25TaGFwZUNyZWF0ZWQsIG1hcHNoYXBlZWRpdGVkOiBvblNoYXBlRWRpdGVkLCBtYXBzaGFwZWRlbGV0ZWQ6IG9uU2hhcGVEZWxldGVkXFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwibWFwXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHRcdFx0cGx1Z2luczoge1xuXHRcdFx0XHRcdCdlZGl0b3InOiB7ZWRpdExheWVyOiAnbGF5ZXIxJ31cblx0XHRcdFx0fSxcblx0XHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdFx0J2xheWVyMSc6IHt2aXNpYmxlOiB0cnVlfVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU2hhcGVDcmVhdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFNoYXBlJywgbGFiZWw6ICdzaGFwZSBpZDonfSwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0XHRcdGRhdGEubGF5ZXIgPSAnbGF5ZXIxJ1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoaWQsIGRhdGEpXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblNoYXBlRWRpdGVkOiBmdW5jdGlvbihldiwgc2hhcGVzKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVFZGl0ZWQnLCBzaGFwZXMpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uU2hhcGVEZWxldGVkOiBmdW5jdGlvbihldiwgc2hhcGVzKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVEZWxldGVkJywgc2hhcGVzKVxuXHRcdFx0XHR9XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnXG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBibi12YWw9XCJtZXNzYWdlXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cIm1lc3NhZ2VcIj48L3NwYW4+PC9wPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJtZXNzYWdlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdFx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cXFwibWVzc2FnZVxcXCI+PC9zcGFuPjwvcD5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ11cblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHVsIGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIj5cblx0XHQ8bGkgYm4tdGV4dD1cImNcIj48L2xpPlxuXHQ8L3VsPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dWwgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdFx0XHQ8bGkgYm4tdGV4dD1cXFwiY1xcXCI+PC9saT5cXG5cdFx0PC91bD5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXVx0XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkubmFtZSlcblx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblxuXHRcdH1cblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHVsIGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIj5cblx0XHQ8bGkgYm4tdGV4dD1cImNcIj48L2xpPlxuXHQ8L3VsPlxuXG5cdDxoMj5BZGQgY2xpZW50PC9oMj5cblx0PGZvcm0gYm4tZXZlbnQ9XCJzdWJtaXQ6IG9uQWRkQ2xpZW50XCI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiBhdXRvZm9jdXM9XCJcIiByZXF1aXJlZD1cIlwiPlxuXHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkFkZDwvYnV0dG9uPlxuXHQ8L2Zvcm0+XHRcbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDQnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHVsIGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdFx0PGxpIGJuLXRleHQ9XFxcImNcXFwiPjwvbGk+XFxuXHRcdDwvdWw+XFxuXFxuXHRcdDxoMj5BZGQgY2xpZW50PC9oMj5cXG5cdFx0PGZvcm0gYm4tZXZlbnQ9XFxcInN1Ym1pdDogb25BZGRDbGllbnRcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgYXV0b2ZvY3VzPVxcXCJcXFwiIHJlcXVpcmVkPVxcXCJcXFwiPlxcblx0XHRcdDxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIj5BZGQ8L2J1dHRvbj5cXG5cdFx0PC9mb3JtPlx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKS5uYW1lKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgICBjbGllbnRzOiBbXG5cdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0ICAgIF1cblx0fVx0XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiPlxuXHRcdFx0PHRyPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5hZ2VcIj48L3RkPlxuXHRcdFx0PC90cj5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q1Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHRcdFx0PHRyPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHQ8L3RyPlxcblxcblx0XHRcdDwvdGJvZHk+XHRcdCBcXG5cdFx0PC90YWJsZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR0aGlzLmN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdFxuXHRcdFx0fVx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgIGNsaWVudHM6IFtcblx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHQgICAgXVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxuXHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdH0sXG5cdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcblx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdH1cblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIiBibi1ldmVudD1cImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcIj5cblx0XHRcdDx0ciBibi1kYXRhPVwiaXRlbTogY1wiPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5hZ2VcIj48L3RkPlxuXHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cImRlbEJ0blwiIHRpdGxlPVwiRGVsZXRlXCI+RGVsZXRlPC9idXR0b24+XG5cdFx0XHQ8L3RyPlxuXG5cdFx0PC90Ym9keT5cblx0IFxuXHQ8L3RhYmxlPlx0XG5cblx0PGgyPkFkZCBjbGllbnQ8L2gyPlxuXHQ8Zm9ybSBibi1ldmVudD1cInN1Ym1pdDogb25BZGRDbGllbnRcIj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuYW1lPVwibmFtZVwiIHJlcXVpcmVkPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cIm51bWJlclwiIHBsYWNlaG9sZGVyPVwiYWdlXCIgbmFtZT1cImFnZVwiIHJlcXVpcmVkPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQWRkXCI+XG5cdDwvZm9ybT5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgICA8dGg+QWN0aW9uPC90aD5cXG5cdFx0XHQgIDwvdHI+XFxuXHRcdFx0PC90aGVhZD5cXG5cdFx0XHQ8dGJvZHkgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIiBibi1ldmVudD1cXFwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFxcXCI+XFxuXHRcdFx0XHQ8dHIgYm4tZGF0YT1cXFwiaXRlbTogY1xcXCI+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XFxcImRlbEJ0blxcXCIgdGl0bGU9XFxcIkRlbGV0ZVxcXCI+RGVsZXRlPC9idXR0b24+XFxuXHRcdFx0XHQ8L3RyPlxcblxcblx0XHRcdDwvdGJvZHk+XFxuXHRcdCBcXG5cdFx0PC90YWJsZT5cdFxcblxcblx0XHQ8aDI+QWRkIGNsaWVudDwvaDI+XFxuXHRcdDxmb3JtIGJuLWV2ZW50PVxcXCJzdWJtaXQ6IG9uQWRkQ2xpZW50XFxcIj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIHJlcXVpcmVkPjxicj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBwbGFjZWhvbGRlcj1cXFwiYWdlXFxcIiBuYW1lPVxcXCJhZ2VcXFwiIHJlcXVpcmVkPjxicj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwic3VibWl0XFxcIiB2YWx1ZT1cXFwiQWRkXFxcIj5cXG5cdFx0PC9mb3JtPlx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXHRcIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgICAgY2xpZW50czogW1xuXHRcdFx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdFx0XHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0XHRcdCAgICBdLFxuXHRcdFx0ICAgIGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuICAgICAgXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGRsZ0FkZENsaWVudCA9ICQkLmZvcm1EaWFsb2dDb250cm9sbGVyKHtcblx0dGl0bGU6ICdBZGQgQ2xpZW50Jyxcblx0dGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpXG59KVxuXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgICBjbGllbnRzOiBbXG5cdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0ICAgIF1cblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaChkYXRhKVxuXHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXHRcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcblx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgICA8dGg+QWN0aW9uPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiIGJuLWV2ZW50PVwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFwiPlxuXHRcdFx0PHRyIGJuLWRhdGE9XCJpdGVtOiBjXCI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLmFnZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVwiZGVsQnRuXCIgdGl0bGU9XCJEZWxldGVcIj5EZWxldGU8L2J1dHRvbj5cblx0XHRcdDwvdHI+XG5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XHRcblxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkQ2xpZW50XCI+QWRkIENsaWVudDwvYnV0dG9uPlx0XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgcmVxdWlyZWQ+PGJyPlxuXHQ8aW5wdXQgdHlwZT1cIm51bWJlclwiIHBsYWNlaG9sZGVyPVwiYWdlXCIgbmFtZT1cImFnZVwiIHJlcXVpcmVkPjxicj4gXG48L2Rpdj5cblxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDcnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgICA8dGg+QWN0aW9uPC90aD5cXG5cdFx0XHQgIDwvdHI+XFxuXHRcdFx0PC90aGVhZD5cXG5cdFx0XHQ8dGJvZHkgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIiBibi1ldmVudD1cXFwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFxcXCI+XFxuXHRcdFx0XHQ8dHIgYm4tZGF0YT1cXFwiaXRlbTogY1xcXCI+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XFxcImRlbEJ0blxcXCIgdGl0bGU9XFxcIkRlbGV0ZVxcXCI+RGVsZXRlPC9idXR0b24+XFxuXHRcdFx0XHQ8L3RyPlxcblxcblx0XHRcdDwvdGJvZHk+XFxuXHRcdCBcXG5cdFx0PC90YWJsZT5cdFxcblxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGRDbGllbnRcXFwiPkFkZCBDbGllbnQ8L2J1dHRvbj5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cdFxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBkbGdBZGRDbGllbnQgPSAkJC5mb3JtRGlhbG9nQ29udHJvbGxlcih7XG5cdFx0XHR0aXRsZTogJ0FkZCBDbGllbnQnLFxuXHRcdFx0dGVtcGxhdGU6IFwiPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiByZXF1aXJlZD48YnI+XFxuPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgcGxhY2Vob2xkZXI9XFxcImFnZVxcXCIgbmFtZT1cXFwiYWdlXFxcIiByZXF1aXJlZD48YnI+IFx0XHRcIlxuXHRcdH0pXG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgICAgY2xpZW50czogW1xuXHRcdFx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdFx0XHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0XHRcdCAgICBdLFxuXHRcdFx0ICAgIGh0bWxDb2RlLFxuXHRcdFx0ICAgIGpzQ29kZVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0XHRcdGRsZ0FkZENsaWVudC5zaG93KGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKGRhdGEpXG5cdFx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXHRcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcbiAgICAgIFx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG4gICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0pXG5cblx0XHR0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdGRsZ0FkZENsaWVudC5kZXN0cm95KClcblx0XHR9XG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICBmcnVpdHM6WydvcmFuZ2UnLCAnYXBwbGUnLCAnYmFuYW5hcycsICdsZW1vbiddLFxuXHQgIGZhdm9yaXRlRnJ1aXQ6J2FwcGxlJ1xuXHR9XHRcbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+RnJ1aXRzPC9oMj5cblx0PHA+WW91ciBmYXZvcml0IGZydWl0OiA8c3BhbiBibi10ZXh0PVwiZmF2b3JpdGVGcnVpdFwiPjwvc3Bhbj48L3A+XG5cdDxzZWxlY3QgYm4tY29udHJvbD1cImJyYWluanMuc2VsZWN0bWVudVwiIGJuLXZhbD1cImZhdm9yaXRlRnJ1aXRcIiBcblx0XHRibi11cGRhdGU9XCJzZWxlY3RtZW51Y2hhbmdlXCIgYm4tZWFjaD1cImYgb2YgZnJ1aXRzXCI+XG5cdFx0PG9wdGlvbiBibi10ZXh0PVwiZlwiPjwvb3B0aW9uPlxuXHQ8L3NlbGVjdD5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDgnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5GcnVpdHM8L2gyPlxcblx0XHQ8cD5Zb3VyIGZhdm9yaXQgZnJ1aXQ6IDxzcGFuIGJuLXRleHQ9XFxcImZhdm9yaXRlRnJ1aXRcXFwiPjwvc3Bhbj48L3A+XFxuXHRcdDxzZWxlY3QgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5zZWxlY3RtZW51XFxcIiBibi12YWw9XFxcImZhdm9yaXRlRnJ1aXRcXFwiIGJuLXVwZGF0ZT1cXFwic2VsZWN0bWVudWNoYW5nZVxcXCIgYm4tZWFjaD1cXFwiZiBvZiBmcnVpdHNcXFwiPlxcblx0XHRcdDxvcHRpb24gYm4tdGV4dD1cXFwiZlxcXCI+PC9vcHRpb24+XFxuXHRcdDwvc2VsZWN0Plxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0ZnJ1aXRzOlsnb3JhbmdlJywgJ2FwcGxlJywgJ2JhbmFuYXMnLCAnbGVtb24nXSxcblx0XHRcdFx0ZmF2b3JpdGVGcnVpdDonYXBwbGUnLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XHQgIFxuXHRcdFx0fVx0XHRcdFxuXHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgY2xpZW50czpbXG5cdCAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9LFxuXHQgICAgIHtuYW1lOiAnTHVjYXMnLCBhZ2U6IDIyfSxcblx0ICAgICB7bmFtZTogJ1F1ZW50aW4nLCBhZ2U6IDE1fSxcblx0ICAgICB7bmFtZTogJ0xhdXJlbnQnLCBhZ2U6IDMyfVxuXHQgICBdLFxuXHQgICBmaWx0ZXI6JycsXG5cdCAgIGdldEZpbHRlcmVkQ2xpZW50czogZnVuY3Rpb24oKSB7XG5cdCAgICAgdmFyIGZpbHRlciA9IHRoaXMuZmlsdGVyXG5cdCAgICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoZnVuY3Rpb24oY2xpZW50KSB7XG5cdCAgICAgICByZXR1cm4gY2xpZW50Lm5hbWUuc3RhcnRzV2l0aChmaWx0ZXIpO1xuXHQgICAgIH0pXG5cdCAgIH0gICAgXG5cblx0IH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZmlsdGVyIGJ5IG5hbWVcIiBibi12YWw9XCJmaWx0ZXJcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8dGFibGU+XG5cdCAgPHRoZWFkPlxuXHQgICAgPHRyPlxuXHQgICAgICA8dGg+TmFtZTwvdGg+XG5cdCAgICAgIDx0aD5BZ2U8L3RoPlxuXHQgICAgPC90cj5cblx0ICA8L3RoZWFkPlxuXHQgIDx0Ym9keSBibi1lYWNoPVwiY2xpZW50IG9mIGdldEZpbHRlcmVkQ2xpZW50c1wiPlxuXHQgICAgPHRyPlxuXHQgICAgICA8dGQgYm4tdGV4dD1cImNsaWVudC5uYW1lXCI+PC90ZD5cblx0ICAgICAgPHRkIGJuLXRleHQ9XCJjbGllbnQuYWdlXCI+PC90ZD5cblx0ICAgIDwvdHI+XG5cdCAgPC90Ym9keT5cblx0ICAgXG5cdDwvdGFibGU+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q5Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuICA8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcbiAgICA8aDI+Q2xpZW50czwvaDI+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiZmlsdGVyIGJ5IG5hbWVcXFwiIGJuLXZhbD1cXFwiZmlsdGVyXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG4gICAgPHRhYmxlPlxcbiAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxcbiAgICAgICAgICA8dGg+QWdlPC90aD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgPC90aGVhZD5cXG4gICAgICA8dGJvZHkgYm4tZWFjaD1cXFwiY2xpZW50IG9mIGdldEZpbHRlcmVkQ2xpZW50c1xcXCI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgIDx0ZCBibi10ZXh0PVxcXCJjbGllbnQubmFtZVxcXCI+PC90ZD5cXG4gICAgICAgICAgPHRkIGJuLXRleHQ9XFxcImNsaWVudC5hZ2VcXFwiPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGJvZHk+XFxuICAgICAgIFxcbiAgICA8L3RhYmxlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG4gICAgPHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcbiAgICA8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj4gIFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgIGNsaWVudHM6W1xuXHRcdFx0ICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0x1Y2FzJywgYWdlOiAyMn0sXG5cdFx0XHQgICAgIHtuYW1lOiAnUXVlbnRpbicsIGFnZTogMTV9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0xhdXJlbnQnLCBhZ2U6IDMyfVxuXHRcdFx0ICAgXSxcblx0XHRcdCAgIGZpbHRlcjonJyxcblx0XHRcdCAgIGdldEZpbHRlcmVkQ2xpZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgIHZhciBmaWx0ZXIgPSB0aGlzLmZpbHRlclxuXHRcdFx0ICAgICByZXR1cm4gdGhpcy5jbGllbnRzLmZpbHRlcihmdW5jdGlvbihjbGllbnQpIHtcblx0XHRcdCAgICAgICByZXR1cm4gY2xpZW50Lm5hbWUuc3RhcnRzV2l0aChmaWx0ZXIpO1xuXHRcdFx0ICAgICB9KVxuXG5cdFx0XHQgICB9LFxuXHRcdFx0ICAgaHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFxuXG5cblx0XHRcdCB9XG5cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cblxuXG4iXX0=
