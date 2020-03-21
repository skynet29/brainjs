
$(function() {

	let routes = [
		{href: '/', redirect: '/test1'}
	]
	for(let i = 1; i <= 27; i++ ) {
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
    template: "<table>\n	<thead>\n		<tr>\n			<th>Name</th>\n			<th>City</th>\n		</tr>\n	</thead>\n\n	<tbody bn-each=\"clients\">\n		<tr>\n			<td bn-text=\"$scope.$i.name\"></td>\n			<td bn-text=\"$scope.$i.city\"></td>\n		</tr>\n	</tbody>\n</table>	",
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n	 	<input type=\"text\" bn-control=\"brainjs.datepicker\" bn-val=\"date\" bn-update=\"datepickerchange\">\n	 	<p>Date: <span bn-text=\"toDateString\"></span></p>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		this.ctrl = $$.viewController(elt, {
			data: { 
				date: new Date(1972, 0, 3),
				toDateString: function() {return this.date.toDateString()},
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
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.map\" class=\"map\" \n			bn-data=\"{\n				center: {lat: 48.39, lng: -4.486},\n				layers: {\n					layer1: {label: \'Layer 1\', visible: true},\n					layer2: {label: \'Layer 2\', visible: true}\n				},\n				contextMenu: {\n					edit: {name: \'Edit\'},\n					sep: {name: \'--\'},\n					copy: {name: \'Copy\'}\n				}			\n			}\" \n			bn-iface=\"map\"\n			bn-event=\"mapclick: onMapClick, mapcontextmenu: onMapContextMenu\"\n			data-scale=\"true\"\n			data-coordinates=\"true\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
		message: 'Hello World',
		toUpper: function() {return this.message.toUpperCase()}
	}
}
`

const htmlCode = `
<div id="main">
	<input type="text" bn-val="message" bn-update="input">
	<p>Message: <span bn-text="toUpper"></span></p>	
</div>
`

$$.control.registerControl('test2', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<input type=\"text\" bn-val=\"message\" bn-update=\"input\">\n		<p>Message: <span bn-text=\"toUpper\"></span></p>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				message: 'Hello World',
				toUpper: function() {return this.message.toUpperCase()},
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

	<div bn-control="brainjs.milsymbol"
		bn-data="{size, name, sidc: 'SFG-UCI----D'}></div>
</div>
`.trim()


$$.control.registerControl('test20', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div>\n			<input type=\"range\" min=\"20\" max=\"100\" bn-val=\"size\" bn-update=\"input\"><br>\n			<input type=\"text\" bn-val=\"name\" bn-update=\"input\">	\n		</div>\n\n		<div bn-control=\"brainjs.milsymbol\" bn-data=\"{size, name, sidc: \'SFG-UCI----D\'}\"></div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
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
					{cmd: 'edit', title: 'Edit', icon: 'fa fa-pencil-alt'}
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
							{cmd: 'edit', title: 'Edit', icon: 'fa fa-pencil-alt'}
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
		    bn-data="{
		    	radius: 120,
		    	iconPos: 80,
		    	innerRadius: 40,
	    		items: [
	    		   {text: '\\uf015', className: 'fa', action: 'toto', color: 'red'},
	    		   {text: '\\uf099', className: 'fab', color: 'blue'}
	    		],
		    	triggerPos: {left: 100, top: 200}		    	
		    }"
	    	bn-event="menuSelected: onMenuSelected" 
	    	></div>
	</div>
</div>
`.trim()


$$.control.registerControl('test22', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div style=\"width:300px; height: 300px; border: 1px solid black;\">\n		    <div bn-control=\"brainjs.circularmenu\" \n		    	bn-data=\"{\n		    		radius: 120,\n		    		iconPos: 80,\n		    		innerRadius: 40,\n		    		items: [\n		    		   {text: \'\\uf015\', className: \'fa\', action: \'toto\', color: \'red\'},\n		    		   {text: \'\\uf099\', className: \'fab\', color: \'blue\'}\n		    		],\n		    		triggerPos: {left: 100, top: 200}		    	\n		    	}\"\n		    	bn-event=\"menuSelected: onMenuSelected\" \n		    	></div>\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
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
	},
	events: {

		onMapShapeContextMenu: function(ev, data) {
			console.log('onMapShapeContextMenu', data)
			const {id, pos} = data
			const info = $(this).iface().getShapeInfo(id)
			const idx = ctrl.scope.menu.props.items.findIndex((item) => item.color == info.icon.color)
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
			bn-data="{
				center: {lat: 48.39, lng: -4.486},
		        shapes: {
					shape1: {
						type: 'marker',
						latlng: {lat: 48.395, lng: -4.491},
						rotationAngle: 20,
						icon: {type: 'ais', color: 'blue'}
					},	        	
					shape2: {
						type: 'marker',
						latlng: {lat: 48.395, lng: -4.471},
						icon: {type: 'ais', color: 'red'},
					},
					scale: true,
					coordinates: true					
		        }					
			}" 
			bn-iface="map"
			bn-event="mapshapecontextmenu: onMapShapeContextMenu"
			></div>

		<div bn-control="brainjs.circularmenu"
			style="position: relative;top: -100%" 
			bn-event="menuSelected: onMenuSelected, menuClosed: onMenuClosed" 
			bn-data="{
				items: [
				    {text: 'Red', color: 'red'},
				    {text: 'Blue', color: 'blue'},
				    {text: 'Green', color: 'green'},
				    {text: 'Black', color: 'black'}
				],
				radius: 80,
				innerRadius: 20,
				iconPos: 50,
				hasTrigger: false
			}"
			bn-iface="menu"></div>
		
	</div>
</div>
`.trim()


let selShape = ""

$$.control.registerControl('test23', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div class=\"map\" style=\"position: relative;\">\n			<div bn-control=\"brainjs.map\" style=\"height: 100%\" \n				bn-data=\"{\n					center: {lat: 48.39, lng: -4.486},\n			        shapes: {\n						shape1: {\n							type: \'marker\',\n							latlng: {lat: 48.395, lng: -4.491},\n							rotationAngle: 20,\n							icon: {type: \'ais\', color: \'blue\'}\n						},	        	\n						shape2: {\n							type: \'marker\',\n							latlng: {lat: 48.395, lng: -4.471},\n							icon: {type: \'ais\', color: \'red\'},\n						}\n			        },\n			        scale: true,\n			        coordinates: true					\n				}\" \n				bn-iface=\"map\"\n				bn-event=\"mapshapecontextmenu: onMapShapeContextMenu\"\n				></div>\n\n			<div bn-control=\"brainjs.circularmenu\"\n				style=\"position: relative;top: -100%\" \n				bn-event=\"menuSelected: onMenuSelected, menuClosed: onMenuClosed\" \n				bn-data=\"{\n					items: [\n					    {text: \'Red\', color: \'red\'},\n					    {text: \'Blue\', color: \'blue\'},\n					    {text: \'Green\', color: \'green\'},\n					    {text: \'Black\', color: \'black\'}\n					],\n					radius: 80,\n					innerRadius: 20,\n					iconPos: 50,\n					hasTrigger: false\n				}\"\n				bn-iface=\"menu\"></div>\n			\n		</div>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
			},
			events: {

				onMapShapeContextMenu: function(ev, data) {
					console.log('onMapShapeContextMenu', data)
					const {id, pos} = data
					const info = $(this).iface().getShapeInfo(id)
					const idx = ctrl.scope.menu.props.items.findIndex((item) => item.color == info.icon.color)
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
		bn-data="{roll, pitch, speed, altitude}">
		
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
		values: [ 75, 300 ],
		value: 50
	}	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div  style="padding: 20px;">
		<div bn-control="brainjs.slider" bn-val="value" bn-update="input"></div>	
		<div style="margin-bottom: 10px;">
			<label>Value</label>	
			<span bn-text="value"></span>			
		</div>

		<div bn-control="brainjs.slider" bn-val="values" bn-data="{min: 0, max: 500}" bn-update="input"></div>	
		<div>
			<label>Values</label>	
			<span bn-text="values"></span>			
		</div>

	</div>
</div>
`.trim()


$$.control.registerControl('test25', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n\n		<div  style=\"padding: 20px;\">\n			<div bn-control=\"brainjs.slider\" bn-val=\"value\" bn-update=\"input\"></div>	\n			<div style=\"margin-bottom: 10px;\">\n				<label>Value</label>	\n				<span bn-text=\"value\"></span>			\n			</div>\n\n			<div bn-control=\"brainjs.slider\" bn-val=\"values\" bn-data=\"{min: 0, max: 500}\" bn-update=\"input\"></div>	\n			<div>\n				<label>Values</label>	\n				<span bn-text=\"values\"></span>			\n			</div>\n\n		</div>\n\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				values: [ 75, 300 ],
				value: 50,
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
const ctrl = $$.viewController(elt, {
	data: {
		value: 0
	},
	events: {
		onDownload: function() {
			console.log('onDownload')
			ctrl.setData({value: 0})										
			setTimeout( progress, 2000 )				
		}
	}
})

function progress() {

  var value = ctrl.model.value + 2;

	ctrl.setData({value})

  if ( value < 99 ) {
    setTimeout( progress, 80 );
  }
}
`.trim()

const htmlCode = `
<div id="main">
	<div  style="padding: 20px;">
		<div bn-control="brainjs.progressbar" bn-val="value" bn-data= "{showPercent: true, initText: 'Loading...', color: 'blue'}"></div>	

		<button bn-event="click: onDownload" style="margin-top: 10px">Download</button>

	</div>
</div>
`.trim()


$$.control.registerControl('test26', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n\n		<div  style=\"padding: 20px;\">\n			<div bn-control=\"brainjs.progressbar\" bn-val=\"value\" bn-data= \"{showPercent: true, initText: \'Loading...\', color: \'blue\'}\"></div>	\n\n			<button bn-event=\"click: onDownload\" style=\"margin-top: 10px\">Download</button>\n\n		</div>\n\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				value: 0,
				jsCode,
				htmlCode
			},
			events: {
				onDownload: function() {
					console.log('onDownload')
					ctrl.setData({value: 0})										
					setTimeout( progress, 2000 )				
				}
			}
		})

		function progress() {

		  var value = ctrl.model.value + 2;
		
			ctrl.setData({value})
		
		  if ( value < 99 ) {
		    setTimeout( progress, 80 );
		  }
		}

		this.update = function(data) {
			ctrl.setData(data)
		}

	}
})



  


})();






(function(){


const jsCode = `
const dlg = $$.dialogController({
	title: 'My Window',
	width: 400,
	height: 350,
	resizable: false,
	modal: false,
	template: $('#template'),
	data: {
		favoriteFruit: 'apple',
		clients: ['Marc', 'Brigitte']
	},
	buttons: [
		{
			text: 'Clear', 
			click: function() {
				dlg.setData({clients: []})
			}
		},
		{
			text: 'Close', 
			click: function() {
				dlg.hide()
			}
		}
	]
})

dlg.addClient = function(name) {
	this.model.clients.push(name)
	this.update()
}
const ctrl = $$.viewController('#main', {
	events: {
		openWindow: function() {
			dlg.show()
		},
		addClient: function() {
			$$.ui.showPrompt({title: 'Add Client', label: 'name :'}, function(name) {
				dlg.addClient(name)
			})
		}
	}			
}
`

const htmlCode = `
<div id="main">
	<button bn-event="click: openWindow">Open Window</button>
	<button bn-event="click: addClient">Add Client</button>
</div>

<div id="template" hidden>
	<h2>Fruits</h2>
	<p>Your favorit fruit: <span bn-text="favoriteFruit"></span></p>
	<div 
		bn-control="brainjs.selectmenu" 
		bn-val="favoriteFruit" 
		bn-update="selectmenuchange" 
		bn-data="{
			items: ['orange', 'apple', 'bananas', 'lemon']
		}">
		
	</div>
	<h2>Clients</h2>
	<ul bn-each="clients">
		<li bn-text="$i"></li>
	</ul>
	
</div>

`

$$.control.registerControl('test27', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<button bn-event=\"click: openWindow\">Open Window</button>\n		<button bn-event=\"click: addClient\">Add Client</button>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n<div id=\"template\" hidden>\n	<h2>Fruits</h2>\n	<p>Your favorit fruit: <span bn-text=\"favoriteFruit\"></span></p>\n	<div \n		bn-control=\"brainjs.selectmenu\" \n		bn-val=\"favoriteFruit\" \n		bn-update=\"selectmenuchange\" \n		bn-data=\"{\n			items: [\'orange\', \'apple\', \'bananas\', \'lemon\']\n		}\">\n		\n	</div>\n	<h2>Clients</h2>\n	<ul bn-each=\"clients\">\n		<li bn-text=\"$i\"></li>\n	</ul>\n	\n</div>\n\n",
	init: function(elt) {

		const dlg = $$.dialogController({
			title: 'My Window',
			width: 400,
			height: 350,
			resizable: false,
			modal: false,
			template: elt.find('#template'),
			data: {
				favoriteFruit: 'apple',
				clients: ['Marc', 'Brigitte']
			},
			buttons: [
				{
					text: 'Clear', 
					click: function() {
						dlg.setData({clients: []})
					}
				},
				{
					text: 'Close', 
					click: function() {
						dlg.hide()
					}
				}
			]
		})

		dlg.addClient = function(name) {
			this.model.clients.push(name)
			this.update()
		}

		const ctrl = $$.viewController(elt, {
			data: {
				htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()			  
			},
			events: {
				openWindow: function() {
					dlg.show()
				},
				addClient: function() {
					$$.ui.showPrompt({title: 'Add Client', label: 'name :'}, function(name) {
						dlg.addClient(name)
					})
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
	<ul bn-each="clients">
		<li bn-text="$i"></li>
	</ul>
</div>
`

$$.control.registerControl('test3', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<ul bn-each=\"clients\">\n			<li bn-text=\"$scope.$i\"></li>\n		</ul>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
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
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<ul bn-each=\"clients\">\n			<li bn-text=\"$scope.$i\"></li>\n		</ul>\n\n		<h2>Add client</h2>\n		<form bn-event=\"submit: onAddClient\">\n			<input type=\"text\" placeholder=\"name\" name=\"name\" autofocus=\"\" required=\"\">\n			<button type=\"submit\">Add</button>\n		</form>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
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
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"clients\">\n				<tr>\n					<td bn-text=\"$scope.$i.name\"></td>\n					<td bn-text=\"$scope.$i.age\"></td>\n				</tr>\n\n			</tbody>		 \n		</table>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n",
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
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			    <th>Action</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"clients\" bn-event=\"click.delBtn: onRemoveClient\">\n				<tr>\n					<td bn-text=\"$scope.$i.name\"></td>\n					<td bn-text=\"$scope.$i.age\"></td>\n					<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n				</tr>\n\n			</tbody>\n		 \n		</table>	\n\n		<h2>Add client</h2>\n		<form bn-event=\"submit: onAddClient\">\n			<input type=\"text\" placeholder=\"name\" name=\"name\" required><br>\n			<input type=\"number\" placeholder=\"age\" name=\"age\" required><br>\n			<input type=\"submit\" value=\"Add\">\n		</form>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n	",
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
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n	\n		<h2>Clients</h2>\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			    <th>Action</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"clients\" bn-event=\"click.delBtn: onRemoveClient\">\n				<tr>\n					<td bn-text=\"$scope.$i.name\"></td>\n					<td bn-text=\"$scope.$i.age\"></td>\n					<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n				</tr>\n\n			</tbody>\n		 \n		</table>	\n\n		<button bn-event=\"click: onAddClient\">Add Client</button>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n	\n",
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
	<div bn-control="brainjs.selectmenu" 
		bn-val="favoriteFruit" 
		bn-update="selectmenuchange" 
		bn-data="{items: fruits}">
	</div>
</div>
`

$$.control.registerControl('test8', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Fruits</h2>\n		<p>Your favorit fruit: <span bn-text=\"favoriteFruit\"></span></p>\n		<div bn-control=\"brainjs.selectmenu\" bn-val=\"favoriteFruit\" bn-update=\"selectmenuchange\" bn-data=\"{items: [\'orange\', \'apple\', \'bananas\', \'lemon\']}\">\n			\n		</div>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
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
	     return this.clients.filter((client) => {
	       return client.name.startsWith(this.filter)
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
	  <tbody bn-each="getFilteredClients">
	    <tr>
	      <td bn-text="$i.name"></td>
	      <td bn-text="$i.age"></td>
	    </tr>
	  </tbody>
	   
	</table>
</div>
`

$$.control.registerControl('test9', {
	template: "<div bn-control=\"brainjs.tabs\">\n  <div title=\"Result\">\n    <h2>Clients</h2>\n    <input type=\"text\" placeholder=\"filter by name\" bn-val=\"filter\" bn-update=\"input\">\n    <table>\n      <thead>\n        <tr>\n          <th>Name</th>\n          <th>Age</th>\n        </tr>\n      </thead>\n      <tbody bn-each=\"getFilteredClients\">\n        <tr>\n          <td bn-text=\"$scope.$i.name\"></td>\n          <td bn-text=\"$scope.$i.age\"></td>\n        </tr>\n      </tbody>\n       \n    </table>\n  </div>\n  <div title=\"HTML\">\n    <pre bn-text=\"htmlCode\"></pre>\n  </div>\n  <div title=\"Javascript\">\n    <pre bn-text=\"jsCode\"></pre>\n  </div>  \n</div>\n\n",
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
			     return this.clients.filter((client) => {
			       return client.name.startsWith(this.filter);
			     })

			   },
			   htmlCode: htmlCode.trim(),
				jsCode: jsCode.trim()		


			 }

		})
	}
})

})();





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QxMy5qcyIsInRlc3QxNC5qcyIsInRlc3QxNS5qcyIsInRlc3QxNi5qcyIsInRlc3QxNy5qcyIsInRlc3QxOC5qcyIsInRlc3QxOS5qcyIsInRlc3QyLmpzIiwidGVzdDIwLmpzIiwidGVzdDIxLmpzIiwidGVzdDIyLmpzIiwidGVzdDIzLmpzIiwidGVzdDI0LmpzIiwidGVzdDI1LmpzIiwidGVzdDI2LmpzIiwidGVzdDI3LmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImRlbW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZnVuY3Rpb24oKSB7XG5cblx0bGV0IHJvdXRlcyA9IFtcblx0XHR7aHJlZjogJy8nLCByZWRpcmVjdDogJy90ZXN0MSd9XG5cdF1cblx0Zm9yKGxldCBpID0gMTsgaSA8PSAyNzsgaSsrICkge1xuXHRcdHJvdXRlcy5wdXNoKHtcblx0XHRcdGhyZWY6ICcvdGVzdCcgKyBpLCBjb250cm9sOiAndGVzdCcgKyBpXG5cdFx0fSlcblx0fVxuXG5cblxuXHQkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdFx0ZGF0YToge1xuXHRcdFx0cm91dGVzXG5cdFx0fVxuXHR9KVxufSk7XG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJ1xuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxwIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvcD5cdFx0XHRcdFx0XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGN0cmwuc2V0RGF0YShkYXRhKVxuXHRcdH1cblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgcmFkaXVzOjEwXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHN2ZyBoZWlnaHQ9XCIxMDBcIiB3aWR0aD1cIjEwMFwiPlxuXHQgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiBibi1hdHRyPVwie3I6IHJhZGl1c31cIiBzdHJva2U9XCJibGFja1wiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwicmVkXCIgLz5cblx0PC9zdmc+XG5cdCAgXG5cdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBibi12YWw9XCJyYWRpdXNcIiBibi11cGRhdGU9XCJpbnB1dFwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEwJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8c3ZnIGhlaWdodD1cXFwiMTAwXFxcIiB3aWR0aD1cXFwiMTAwXFxcIj5cXG5cdFx0ICA8Y2lyY2xlIGN4PVxcXCI1MFxcXCIgY3k9XFxcIjUwXFxcIiBibi1hdHRyPVxcXCJ7cjogcmFkaXVzfVxcXCIgc3Ryb2tlPVxcXCJibGFja1xcXCIgc3Ryb2tlLXdpZHRoPVxcXCIzXFxcIiBmaWxsPVxcXCJyZWRcXFwiIC8+XFxuXHRcdDwvc3ZnPlxcblx0XHQgIFxcblx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIGJuLXZhbD1cXFwicmFkaXVzXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgcmFkaXVzOjEwLFxuXHRcdFx0ICBodG1sQ29kZSxcblx0XHRcdCAganNDb2RlXG5cdFx0XHR9XG5cdFx0XHQgXG5cblx0XHR9KVxuXHR9XG59KTtcblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJsZScsIHsgICBcbiAgICBwcm9wczoge1xuICAgIFx0Y2xpZW50czogW11cbiAgICB9LFxuICAgIHRlbXBsYXRlOiAkKCcjdGVtcGxhdGUnKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbHQpIHtcbiAgICBcdGNvbnNvbGUubG9nKCdpbml0JywgdGhpcy5wcm9wcylcbiAgICAgIFxuICAgICAgdGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjbGllbnRzOiB0aGlzLnByb3BzLmNsaWVudHNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgIH0gXG4gIH1cbilcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0ICBteUNsaWVudHM6IFtcblx0ICAgIHtuYW1lOiAnUXVlbnRpbicsIGNpdHk6ICdSZW5uZXMnfSxcblx0ICAgIHtuYW1lOiAnTWFyYycsIGNpdHk6ICdCZXRodW5lJ31cblx0ICBdLFxuXHQgIG15Q2xpZW50czI6IFtcblx0ICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBjaXR5OiAnTGUgTWFucyd9LFxuXHQgICAge25hbWU6ICdHZW9yZ2VzJywgY2l0eTogJ1ZlcnF1aW4nfVxuXHQgIF1cblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q3VzdG9tIGNvbnRyb2w8L2gyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJNeVRhYmxlXCIgYm4tZGF0YT1cIntjbGllbnRzOiBteUNsaWVudHN9XCI+PC9kaXY+XG5cdDxocj5cblx0PGRpdiBibi1jb250cm9sPVwiTXlUYWJsZVwiIGJuLWRhdGE9XCJ7Y2xpZW50czogbXlDbGllbnRzMn1cIj48L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRoPk5hbWU8L3RoPlxuXHRcdFx0XHQ8dGg+Q2l0eTwvdGg+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5jaXR5XCI+PC90ZD5cblx0XHRcdDwvdHI+XG5cdFx0PC90Ym9keT5cblx0PC90YWJsZT5cdFxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJsZScsIHsgICBcbiAgICBwcm9wczoge1xuICAgIFx0Y2xpZW50czogW11cbiAgICB9LFxuICAgIHRlbXBsYXRlOiBcIjx0YWJsZT5cXG5cdDx0aGVhZD5cXG5cdFx0PHRyPlxcblx0XHRcdDx0aD5OYW1lPC90aD5cXG5cdFx0XHQ8dGg+Q2l0eTwvdGg+XFxuXHRcdDwvdHI+XFxuXHQ8L3RoZWFkPlxcblxcblx0PHRib2R5IGJuLWVhY2g9XFxcImNsaWVudHNcXFwiPlxcblx0XHQ8dHI+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5uYW1lXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkc2NvcGUuJGkuY2l0eVxcXCI+PC90ZD5cXG5cdFx0PC90cj5cXG5cdDwvdGJvZHk+XFxuPC90YWJsZT5cdFwiLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuICAgIFx0Y29uc29sZS5sb2coJ2luaXQnLCB0aGlzLnByb3BzKVxuICAgICAgXG4gICAgICB0aGlzLmN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNsaWVudHM6IHRoaXMucHJvcHMuY2xpZW50c1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgfSBcbiAgfVxuKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDExJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQgIDxoMj5DdXN0b20gY29udHJvbDwvaDI+XFxuXHRcdCAgPGRpdiBibi1jb250cm9sPVxcXCJNeVRhYmxlXFxcIiBibi1kYXRhPVxcXCJ7Y2xpZW50czogbXlDbGllbnRzfVxcXCI+PC9kaXY+XFxuXHRcdCAgPGhyPlxcblx0XHQgIDxkaXYgYm4tY29udHJvbD1cXFwiTXlUYWJsZVxcXCIgYm4tZGF0YT1cXFwie2NsaWVudHM6IG15Q2xpZW50czJ9XFxcIj48L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdCAgbXlDbGllbnRzOiBbXG5cdFx0XHQgICAge25hbWU6ICdRdWVudGluJywgY2l0eTogJ1Jlbm5lcyd9LFxuXHRcdFx0ICAgIHtuYW1lOiAnTWFyYycsIGNpdHk6ICdCZXRodW5lJ31cblx0XHRcdCAgXSxcblx0XHRcdCAgbXlDbGllbnRzMjogW1xuXHRcdFx0ICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBjaXR5OiAnTGUgTWFucyd9LFxuXHRcdFx0ICAgIHtuYW1lOiAnR2VvcmdlcycsIGNpdHk6ICdWZXJxdWluJ31cblx0XHRcdCAgXSxcblx0XHRcdCAgaHRtbENvZGUsXG5cdFx0XHQgIGpzQ29kZVxuXHRcdFx0fSBcblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRmYXZvcml0ZUZydWl0czpbJ2FwcGxlJywgJ29yYW5nZSddLFxuXHRcdGdlbmRlcjogJ21hbGUnXG5cdH0gXG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5GcnVpdHM8L2gyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmNoZWNrZ3JvdXBcIiBibi12YWw9XCJmYXZvcml0ZUZydWl0c1wiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwib3JhbmdlXCI+T3JhbmdlXG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwiYmFuYW5hc1wiPkJhbmFuYXNcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJhcHBsZVwiPkFwcGxlXG5cdCAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIHZhbHVlPVwibGVtb25cIj5MZW1vblxuXHQ8L2Rpdj5cblxuXHQgIDxwPllvdXIgZmF2b3JpdCBmcnVpdHM6IDxzcGFuIGJuLXRleHQ9XCJmYXZvcml0ZUZydWl0c1wiPjwvc3Bhbj48L3A+XG5cblx0PGgyPkdlbmRlcjwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMucmFkaW9ncm91cFwiIGJuLXZhbD1cImdlbmRlclwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdCAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwibWFsZVwiPk1hbGVcblx0ICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJmZW1hbGVcIj5GZW1hbGVcblx0PC9kaXY+XG5cdDxwPkdlbmRlcjogPHNwYW4gYm4tdGV4dD1cImdlbmRlclwiPjwvc3Bhbj48L3A+XG48L2Rpdj5cblxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEyJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNoZWNrZ3JvdXBcXFwiIGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcIm9yYW5nZVxcXCI+T3JhbmdlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwiYmFuYW5hc1xcXCI+QmFuYW5hc1xcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImFwcGxlXFxcIj5BcHBsZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImxlbW9uXFxcIj5MZW1vblxcblx0XHQ8L2Rpdj5cXG5cdFx0XFxuXHRcdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiPjwvc3Bhbj48L3A+XFxuXFxuXHRcdDxoMj5HZW5kZXI8L2gyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMucmFkaW9ncm91cFxcXCIgYm4tdmFsPVxcXCJnZW5kZXJcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgdmFsdWU9XFxcIm1hbGVcXFwiPk1hbGVcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIHZhbHVlPVxcXCJmZW1hbGVcXFwiPkZlbWFsZVxcblx0XHQ8L2Rpdj5cXG5cdFx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVxcXCJnZW5kZXJcXFwiPjwvc3Bhbj48L3A+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRmYXZvcml0ZUZydWl0czpbJ2FwcGxlJywgJ29yYW5nZSddLFxuXHRcdFx0XHRnZW5kZXI6ICdtYWxlJyxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSBcblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFiQ3RybCcsIHtcblx0dGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbydcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cbn0pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uVGFiQWN0aXZhdGU6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UYWJBY3RpdmF0ZScsICQodGhpcykuaWZhY2UoKS5nZXRTZWxlY3RlZFRhYkluZGV4KCkpXG5cdFx0fSxcblx0XHRvbkFkZFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZFRhYicpXG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzxwPkdvb2QgbW9ybmluZzxwPidcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uQWRkQ3RybFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZEN0cmxUYWInKVxuXHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0Y29udHJvbDogJ015VGFiQ3RybCdcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uU2hvd1RhYkluZm86IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zdCBjb3VudCA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJzQ291bnQoKVxuXHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0Y29uc3QgdGl0bGUgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFiSW5mbyhzZWxJZHgpLnRpdGxlXG5cdFx0XHRjb25zdCBjb250ZW50ID0gXFxgXG5cdFx0XHRcdDxwPlRhYnNDb3VudDogXFwke2NvdW50fTwvcD5cblx0XHRcdFx0PHA+U2VsSW5kZXg6IFxcJHtzZWxJZHh9PC9wPlxuXHRcdFx0XHQ8cD5TZWxUYWIgVGl0bGU6IFxcJHt0aXRsZX08cD5cblx0XHRcdFxcYFxuXHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50fSlcblx0XHR9LFxuXHRcdG9uUmVtb3ZlU2VsVGFiOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHNlbElkeCA9IGN0cmwuc2NvcGUudGFicy5nZXRTZWxlY3RlZFRhYkluZGV4KClcblx0XHRcdGN0cmwuc2NvcGUudGFicy5yZW1vdmVUYWIoc2VsSWR4KVxuXHRcdH1cblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMudGFic1wiIGJuLWlmYWNlPVwidGFic1wiIGJuLWV2ZW50PVwidGFic2FjdGl2YXRlOiBvblRhYkFjdGl2YXRlXCI+XG5cdFx0PGRpdiB0aXRsZT1cIlRhYiAxXCI+XG5cdFx0XHQ8cD5IZWxsbyBXb3JsZDwvcD5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IHRpdGxlPVwiVGFiIDJcIj5cblx0XHRcdDxwPkJvbmpvdXIgbGUgbW9uZGU8L3A+XG5cdFx0PC9kaXY+XG5cdDwvZGl2PlxuXHQ8YnI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY29udHJvbGdyb3VwXCI+XHRcdFx0XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkFkZFRhYlwiPkFkZCBUYWI8L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkQ3RybFRhYlwiPkFkZCBDb250cm9sIFRhYjwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25TaG93VGFiSW5mb1wiPlNob3cgVGFiIEluZm88L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uUmVtb3ZlU2VsVGFiXCI+UmVtb3ZlIFNlbCBUYWI8L2J1dHRvbj5cblx0PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLXZhbD1cIm1lc3NhZ2VcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEzLXRhYmN0cmwnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXY+XFxuXHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJtZXNzYWdlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvc3Bhbj48L3A+XHRcdFxcbjwvZGl2PlxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbydcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cbn0pXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIiBibi1pZmFjZT1cXFwidGFic1xcXCIgYm4tZXZlbnQ9XFxcInRhYnNhY3RpdmF0ZTogb25UYWJBY3RpdmF0ZVxcXCI+XFxuXHRcdFx0PGRpdiB0aXRsZT1cXFwiVGFiIDFcXFwiPlxcblx0XHRcdFx0PHA+SGVsbG8gV29ybGQ8L3A+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdFx0PGRpdiB0aXRsZT1cXFwiVGFiIDJcXFwiPlxcblx0XHRcdFx0PHA+Qm9uam91ciBsZSBtb25kZTwvcD5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHRcdDxicj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNvbnRyb2xncm91cFxcXCI+XHRcdFx0XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkVGFiXFxcIj5BZGQgVGFiPC9idXR0b24+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkQ3RybFRhYlxcXCI+QWRkIENvbnRyb2wgVGFiPC9idXR0b24+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uU2hvd1RhYkluZm9cXFwiPlNob3cgVGFiIEluZm88L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25SZW1vdmVTZWxUYWJcXFwiPlJlbW92ZSBTZWwgVGFiPC9idXR0b24+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblRhYkFjdGl2YXRlOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRhYkFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldFNlbGVjdGVkVGFiSW5kZXgoKSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGRUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkVGFiJylcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogJzxwPkdvb2QgbW9ybmluZzxwPidcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbkFkZEN0cmxUYWI6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ3RybFRhYicpXG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0Y29udHJvbDogJ3Rlc3QxMy10YWJjdHJsJ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uU2hvd1RhYkluZm86IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc3QgY291bnQgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFic0NvdW50KClcblx0XHRcdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRcdFx0Y29uc3QgdGl0bGUgPSBjdHJsLnNjb3BlLnRhYnMuZ2V0VGFiSW5mbyhzZWxJZHgpLnRpdGxlXG5cdFx0XHRcdFx0Y29uc3QgY29udGVudCA9IGBcblx0XHRcdFx0XHRcdDxwPlRhYnNDb3VudDogJHtjb3VudH08L3A+XG5cdFx0XHRcdFx0XHQ8cD5TZWxJbmRleDogJHtzZWxJZHh9PC9wPlxuXHRcdFx0XHRcdFx0PHA+U2VsVGFiIFRpdGxlOiAke3RpdGxlfTxwPlxuXHRcdFx0XHRcdGBcblx0XHRcdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZVNlbFRhYjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUudGFicy5yZW1vdmVUYWIoc2VsSWR4KVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0IFxuXHRcdH0pXG5cblx0XHRjb25zb2xlLmxvZygnc2NvcGUnLCBjdHJsLnNjb3BlKVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRkYXRlOiBuZXcgRGF0ZSgxOTcyLCAwLCAzKVxuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLWNvbnRyb2w9XCJicmFpbmpzLmRhdGVwaWNrZXJcIiBibi12YWw9XCJkYXRlXCIgYm4tdXBkYXRlPVwiZGF0ZXBpY2tlcmNoYW5nZVwiPlxuXHQ8cD5EYXRlOiA8c3BhbiBibi10ZXh0PVwiZGF0ZS50b0RhdGVTdHJpbmcoKVwiPjwvc3Bhbj48L3A+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdCBcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi1jb250cm9sPVxcXCJicmFpbmpzLmRhdGVwaWNrZXJcXFwiIGJuLXZhbD1cXFwiZGF0ZVxcXCIgYm4tdXBkYXRlPVxcXCJkYXRlcGlja2VyY2hhbmdlXFxcIj5cXG5cdCBcdDxwPkRhdGU6IDxzcGFuIGJuLXRleHQ9XFxcInRvRGF0ZVN0cmluZ1xcXCI+PC9zcGFuPjwvcD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0ZGF0ZTogbmV3IERhdGUoMTk3MiwgMCwgMyksXG5cdFx0XHRcdHRvRGF0ZVN0cmluZzogZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKX0sXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHR9LFxuXHRcdCBcblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0aXNTdGFydGVkOiBmYWxzZVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblN0YXJ0OiBmdW5jdGlvbigpIHtcblx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdGN0cmwuc2NvcGUuY2FtZXJhLnN0YXJ0KClcblx0XHR9LFxuXHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVGFrZVBpY3R1cmUnKVxuXHRcdFx0dmFyIHVybCA9IGN0cmwuc2NvcGUuY2FtZXJhLnRha2VQaWN0dXJlKClcblx0XHRcdHZhciBjb250ZW50ID0gXFxgPGltZyBzcmM9XCJcXCR7dXJsfVwiPlxcYFxuXHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50LCB3aWR0aDogJ2F1dG8nfSlcblx0XHR9XHRcdFx0XG5cdH1cdFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uU3RhcnRcIiBibi1zaG93PVwiIWlzU3RhcnRlZFwiPlN0YXJ0PC9idXR0b24+XG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25UYWtlUGljdHVyZVwiIGJuLXNob3c9XCJpc1N0YXJ0ZWRcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jYW1lcmFcIiBibi1pZmFjZT1cImNhbWVyYVwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTUnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblN0YXJ0XFxcIiBibi1zaG93PVxcXCIhaXNTdGFydGVkXFxcIj5TdGFydDwvYnV0dG9uPlxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25UYWtlUGljdHVyZVxcXCIgYm4tc2hvdz1cXFwiaXNTdGFydGVkXFxcIj5UYWtlIFBpY3R1cmU8L2J1dHRvbj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNhbWVyYVxcXCIgYm4taWZhY2U9XFxcImNhbWVyYVxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRpc1N0YXJ0ZWQ6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN0cmwuc2V0RGF0YSh7aXNTdGFydGVkOiB0cnVlfSlcblx0XHRcdFx0XHRjdHJsLnNjb3BlLmNhbWVyYS5zdGFydCgpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uVGFrZVBpY3R1cmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRha2VQaWN0dXJlJylcblx0XHRcdFx0XHR2YXIgdXJsID0gY3RybC5zY29wZS5jYW1lcmEudGFrZVBpY3R1cmUoKVxuXHRcdFx0XHRcdHZhciBjb250ZW50ID0gYDxpbWcgc3JjPVwiJHt1cmx9XCI+YFxuXHRcdFx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudCwgd2lkdGg6ICdhdXRvJ30pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQgXG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdHNvdXJjZTogW1xuXHRcdFx0e3RpdGxlOiAnTm9kZSAxJywgZm9sZGVyOiB0cnVlLCBjaGlsZHJlbjogW1xuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMSd9LFxuXHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMid9XG5cdFx0XHRdfSxcblx0XHRcdHt0aXRsZTogJ05vZGUgMid9XG5cdFx0XSxcblx0XHRjb250ZXh0TWVudToge1xuXHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0JywgaWNvbjogJ2VkaXQnfSxcblx0XHRcdGN1dDoge25hbWU6ICdDdXQnLCBpY29uOiAnY3V0J31cblx0XHR9XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblRyZWVBY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0QWN0aXZlTm9kZSgpLnRpdGxlKVxuXHRcdH0sXG5cdFx0b25UcmVlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBhY3Rpb24pIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVDb250ZXh0TWVudScsIGFjdGlvbilcblx0XHR9LFxuXHRcdG9uQWRkTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIE5vZGUnLCBsYWJlbDogJ05vZGUgdGl0bGUnfSwgZnVuY3Rpb24odGl0bGUpIHtcblx0XHRcdFx0XG5cdFx0XHRcdGFjdGl2ZU5vZGUuYWRkTm9kZSh7dGl0bGV9KVxuXHRcdFx0XHRhY3RpdmVOb2RlLnNldEV4cGFuZGVkKHRydWUpXG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVTZWxOb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0YWN0aXZlTm9kZS5yZW1vdmUoKVxuXHRcdH1cblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRyZWVcIiBcblx0XHRibi1kYXRhPVwie3NvdXJjZSwgY29udGV4dE1lbnV9XCIgXG5cdFx0Ym4tZXZlbnQ9XCJ0cmVlYWN0aXZhdGU6IG9uVHJlZUFjdGl2YXRlLCB0cmVlY29udGV4dG1lbnU6IG9uVHJlZUNvbnRleHRNZW51XCIgXG5cdFx0Ym4taWZhY2U9XCJ0cmVlXCI+PC9kaXY+XG5cdDxicj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jb250cm9sZ3JvdXBcIj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkTm9kZVwiPkFkZCBOb2RlPC9idXR0b24+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvblJlbW92ZVNlbE5vZGVcIj5SZW1vdmUgU2VsTm9kZTwvYnV0dG9uPlx0XHRcdFx0XG5cdDwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTYnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50cmVlXFxcIiBcXG5cdFx0XHRibi1kYXRhPVxcXCJ7c291cmNlLCBjb250ZXh0TWVudX1cXFwiIFxcblx0XHRcdGJuLWV2ZW50PVxcXCJ0cmVlYWN0aXZhdGU6IG9uVHJlZUFjdGl2YXRlLCB0cmVlY29udGV4dG1lbnU6IG9uVHJlZUNvbnRleHRNZW51XFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwidHJlZVxcXCI+PC9kaXY+XFxuXHRcdDxicj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNvbnRyb2xncm91cFxcXCI+XFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkTm9kZVxcXCI+QWRkIE5vZGU8L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25SZW1vdmVTZWxOb2RlXFxcIj5SZW1vdmUgU2VsTm9kZTwvYnV0dG9uPlx0XHRcdFx0XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0c291cmNlOiBbXG5cdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxJywgZm9sZGVyOiB0cnVlLCBjaGlsZHJlbjogW1xuXHRcdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjEnfSxcblx0XHRcdFx0XHRcdHt0aXRsZTogJ05vZGUgMS4yJ31cblx0XHRcdFx0XHRdfSxcblx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDInfVxuXHRcdFx0XHRdLFxuXG5cdFx0XHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRcdFx0ZWRpdDoge25hbWU6ICdFZGl0JywgaWNvbjogJ2VkaXQnfSxcblx0XHRcdFx0XHRjdXQ6IHtuYW1lOiAnQ3V0JywgaWNvbjogJ2N1dCd9XG5cdFx0XHRcdH1cblx0XHRcdFxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblRyZWVBY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uVHJlZUFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldEFjdGl2ZU5vZGUoKS50aXRsZSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25UcmVlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBhY3Rpb24pIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQ29udGV4dE1lbnUnLCBhY3Rpb24pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQWRkTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgTm9kZScsIGxhYmVsOiAnTm9kZSB0aXRsZSd9LCBmdW5jdGlvbih0aXRsZSkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRhY3RpdmVOb2RlLmFkZE5vZGUoe3RpdGxlfSlcblx0XHRcdFx0XHRcdGFjdGl2ZU5vZGUuc2V0RXhwYW5kZWQodHJ1ZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZVNlbE5vZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRcdFx0aWYgKGFjdGl2ZU5vZGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGFjdGl2ZU5vZGUucmVtb3ZlKClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0IFxuXHRcdH0pXG5cblx0XHR0aGlzLmN0cmwgPSBjdHJsXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25NYXBDbGljazogZnVuY3Rpb24oZXYsIGRhdGEpIHtcdFx0XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZygnb25NYXBDbGljaycsIGRhdGEpXG5cdFx0XHRjb25zdCB7bGF0bG5nfSA9IGRhdGFcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUubWFwLnVwZGF0ZVNoYXBlKCdtYXJrZXInLCB7bGF0bG5nfSlcblx0XHRcdH1cblx0XHRcdGNhdGNoKGUpIHtcblx0XHRcdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ21hcmtlcicsIHtcblx0XHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0XHRsYXRsbmdcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9uTWFwQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25NYXBDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0fVx0XHRcblx0fVx0XG59KVxuXG5jdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnc2hhcGUxJywge1xuXHR0eXBlOiAnbWFya2VyJyxcblx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDkxfSxcblx0cm90YXRpb25BbmdsZTogMjAsXG5cdGljb246IHt0eXBlOiAnYWlzJywgY29sb3I6ICdibHVlJ30sXG5cdHBvcHVwQ29udGVudDogJ0hlbGxvIFdvcmxkJyxcblx0bGF5ZXI6ICdsYXllcjEnXG59KVxuXG5jdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnc2hhcGUyJywge1xuXHR0eXBlOiAnY2lyY2xlJyxcblx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDcxfSxcblx0cmFkaXVzOiAxMDAsXG5cdHN0eWxlOiB7Y29sb3I6ICdyZWQnfSxcblx0bGF5ZXI6ICdsYXllcjInXG59KVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLm1hcFwiIGNsYXNzPVwibWFwXCIgXG5cdFx0Ym4tZGF0YT1cIntcblx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHRcdGxheWVyczoge1xuXHRcdFx0XHRsYXllcjE6IHtsYWJlbDogJ0xheWVyIDEnLCB2aXNpYmxlOiB0cnVlfSxcblx0XHRcdFx0bGF5ZXIyOiB7bGFiZWw6ICdMYXllciAyJywgdmlzaWJsZTogdHJ1ZX1cblx0XHRcdH0sXG5cdFx0XHRjb250ZXh0TWVudToge1xuXHRcdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnfSxcblx0XHRcdFx0c2VwOiB7bmFtZTogJy0tJ30sXG5cdFx0XHRcdGNvcHk6IHtuYW1lOiAnQ29weSd9XG5cdFx0XHR9XHRcdFx0XG5cdFx0fVwiIFxuXHRcdGJuLWlmYWNlPVwibWFwXCJcblx0XHRibi1ldmVudD1cIm1hcGNsaWNrOiBvbk1hcENsaWNrLCBtYXBjb250ZXh0bWVudTogb25NYXBDb250ZXh0TWVudVwiXG5cdFx0ZGF0YS1zY2FsZT1cInRydWVcIlxuXHRcdGRhdGEtY29vcmRpbmF0ZXM9XCJ0cnVlXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1hcFxcXCIgY2xhc3M9XFxcIm1hcFxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwie1xcblx0XHRcdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LFxcblx0XHRcdFx0bGF5ZXJzOiB7XFxuXHRcdFx0XHRcdGxheWVyMToge2xhYmVsOiBcXCdMYXllciAxXFwnLCB2aXNpYmxlOiB0cnVlfSxcXG5cdFx0XHRcdFx0bGF5ZXIyOiB7bGFiZWw6IFxcJ0xheWVyIDJcXCcsIHZpc2libGU6IHRydWV9XFxuXHRcdFx0XHR9LFxcblx0XHRcdFx0Y29udGV4dE1lbnU6IHtcXG5cdFx0XHRcdFx0ZWRpdDoge25hbWU6IFxcJ0VkaXRcXCd9LFxcblx0XHRcdFx0XHRzZXA6IHtuYW1lOiBcXCctLVxcJ30sXFxuXHRcdFx0XHRcdGNvcHk6IHtuYW1lOiBcXCdDb3B5XFwnfVxcblx0XHRcdFx0fVx0XHRcdFxcblx0XHRcdH1cXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcIm1hcGNsaWNrOiBvbk1hcENsaWNrLCBtYXBjb250ZXh0bWVudTogb25NYXBDb250ZXh0TWVudVxcXCJcXG5cdFx0XHRkYXRhLXNjYWxlPVxcXCJ0cnVlXFxcIlxcblx0XHRcdGRhdGEtY29vcmRpbmF0ZXM9XFxcInRydWVcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbk1hcENsaWNrOiBmdW5jdGlvbihldiwgZGF0YSkge1x0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NYXBDbGljaycsIGRhdGEpXG5cdFx0XHRcdFx0Y29uc3Qge2xhdGxuZ30gPSBkYXRhXG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLnVwZGF0ZVNoYXBlKCdtYXJrZXInLCB7bGF0bG5nfSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ21hcmtlcicsIHtcblx0XHRcdFx0XHRcdFx0dHlwZTogJ21hcmtlcicsXG5cdFx0XHRcdFx0XHRcdGxhdGxuZ1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uTWFwQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uTWFwQ29udGV4dE1lbnUnLCBkYXRhKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTEnLCB7XG5cdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ5MX0sXG5cdFx0XHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0XHRcdGljb246IHt0eXBlOiAnYWlzJywgY29sb3I6ICdibHVlJ30sXG5cdFx0XHRwb3B1cENvbnRlbnQ6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRsYXllcjogJ2xheWVyMSdcblx0XHR9KVxuXG5cdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMicsIHtcblx0XHRcdHR5cGU6ICdjaXJjbGUnLFxuXHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDcxfSxcblx0XHRcdHJhZGl1czogMTAwLFxuXHRcdFx0c3R5bGU6IHtjb2xvcjogJ3JlZCd9LFxuXHRcdFx0bGF5ZXI6ICdsYXllcjInXG5cdFx0fSlcblxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LCAvLyBCcmVzdCBjaXR5XG5cdFx0cGx1Z2luczoge1xuXHRcdFx0J2VkaXRvcic6IHtlZGl0TGF5ZXI6ICdsYXllcjEnfVxuXHRcdH0sXG5cdFx0bGF5ZXJzOiB7XG5cdFx0XHQnbGF5ZXIxJzoge3Zpc2libGU6IHRydWV9XG5cdFx0fVx0XHRcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25TaGFwZUNyZWF0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBTaGFwZScsIGxhYmVsOiAnc2hhcGUgaWQ6J30sIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdGRhdGEubGF5ZXIgPSAnbGF5ZXIxJ1xuXHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZShpZCwgZGF0YSlcblx0XHRcdH0pXG5cblx0XHR9LFxuXHRcdG9uU2hhcGVFZGl0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25TaGFwZUVkaXRlZCcsIGRhdGEpXG5cdFx0fSxcblx0XHRvblNoYXBlRGVsZXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRGVsZXRlZCcsIGRhdGEpXG5cdFx0fVx0XHRcdFx0XG5cdH1cdFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLm1hcFwiIGNsYXNzPVwibWFwXCIgXG5cdFx0Ym4tZGF0YT1cIntjZW50ZXIsIHBsdWdpbnMsIGxheWVyc31cIlxuXHRcdGJuLWV2ZW50PVwibWFwc2hhcGVjcmVhdGVkOiBvblNoYXBlQ3JlYXRlZCwgbWFwc2hhcGVlZGl0ZWQ6IG9uU2hhcGVFZGl0ZWQsXG5cdFx0IG1hcHNoYXBlZGVsZXRlZDogb25TaGFwZURlbGV0ZWRcIiBcblx0XHRibi1pZmFjZT1cIm1hcFwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTgnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5tYXBcXFwiIGNsYXNzPVxcXCJtYXBcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcIntjZW50ZXIsIHBsdWdpbnMsIGxheWVyc31cXFwiXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcIm1hcHNoYXBlY3JlYXRlZDogb25TaGFwZUNyZWF0ZWQsIG1hcHNoYXBlZWRpdGVkOiBvblNoYXBlRWRpdGVkLCBtYXBzaGFwZWRlbGV0ZWQ6IG9uU2hhcGVEZWxldGVkXFxcIiBcXG5cdFx0XHRibi1pZmFjZT1cXFwibWFwXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sXG5cdFx0XHRcdHBsdWdpbnM6IHtcblx0XHRcdFx0XHQnZWRpdG9yJzoge2VkaXRMYXllcjogJ2xheWVyMSd9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxheWVyczoge1xuXHRcdFx0XHRcdCdsYXllcjEnOiB7dmlzaWJsZTogdHJ1ZX1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvblNoYXBlQ3JlYXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBTaGFwZScsIGxhYmVsOiAnc2hhcGUgaWQ6J30sIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRcdFx0XHRkYXRhLmxheWVyID0gJ2xheWVyMSdcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKGlkLCBkYXRhKVxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fSxcblx0XHRcdFx0b25TaGFwZUVkaXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25TaGFwZUVkaXRlZCcsIGRhdGEpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uU2hhcGVEZWxldGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRGVsZXRlZCcsIGRhdGEpXG5cdFx0XHRcdH1cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicpXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5odG1sZWRpdG9yXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxOScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmh0bWxlZGl0b3JcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRodG1sQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcsXG5cdFx0dG9VcHBlcjogZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMubWVzc2FnZS50b1VwcGVyQ2FzZSgpfVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibWVzc2FnZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJ0b1VwcGVyXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLXZhbD1cXFwibWVzc2FnZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcInRvVXBwZXJcXFwiPjwvc3Bhbj48L3A+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRcdHRvVXBwZXI6IGZ1bmN0aW9uKCkge3JldHVybiB0aGlzLm1lc3NhZ2UudG9VcHBlckNhc2UoKX0sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGN0cmwuc2V0RGF0YShkYXRhKVxuXHRcdH1cblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0c2l6ZTogNTAsXG5cdFx0bmFtZTogJydcblx0fVx0XG59KVx0XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXY+XG5cdFx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjIwXCIgbWF4PVwiMTAwXCIgYm4tdmFsPVwic2l6ZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PGJyPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLXZhbD1cIm5hbWVcIiBibi11cGRhdGU9XCJpbnB1dFwiPlx0XG5cdDwvZGl2PlxuXG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWlsc3ltYm9sXCJcblx0XHRibi1kYXRhPVwie3NpemUsIG5hbWUsIHNpZGM6ICdTRkctVUNJLS0tLUQnfT48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDIwJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2Plxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgbWluPVxcXCIyMFxcXCIgbWF4PVxcXCIxMDBcXFwiIGJuLXZhbD1cXFwic2l6ZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PGJyPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi12YWw9XFxcIm5hbWVcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlx0XFxuXHRcdDwvZGl2Plxcblxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMubWlsc3ltYm9sXFxcIiBibi1kYXRhPVxcXCJ7c2l6ZSwgbmFtZSwgc2lkYzogXFwnU0ZHLVVDSS0tLS1EXFwnfVxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRzaXplOiA1MCxcblx0XHRcdFx0bmFtZTogJycsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0aHRtbENvZGVcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRjdHJsLnNldERhdGEoZGF0YSlcblx0XHR9XG5cblx0fVxufSlcblxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Z3JpZENvbHVtbnM6IFtcblx0XHRcdCduYW1lJywgXG5cdFx0XHR7bmFtZTogJ2xvY2F0aW9uJywgbGFiZWw6ICdMb2NhdGlvbid9LFxuXHRcdFx0e2xhYmVsOiAnQWN0aW9uJywgYnV0dG9uczogW1xuXHRcdFx0XHRcdHtjbWQ6ICdkZWxldGUnLCB0aXRsZTogJ0RlbGV0ZScsIGljb246ICdmYSBmYS10cmFzaCd9LFxuXHRcdFx0XHRcdHtjbWQ6ICdlZGl0JywgdGl0bGU6ICdFZGl0JywgaWNvbjogJ2ZhIGZhLXBlbmNpbC1hbHQnfVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0XSxcdFx0XG5cdFx0Z3JpZERhdGE6IFtcblx0XHQgICB7IG5hbWU6ICdBbWVyaWNhbiBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ1NvdXRoZWFzdCBVbml0ZWQgU3RhdGVzJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0NoaW5lc2UgYWxsaWdhdG9yJywgbG9jYXRpb246ICdFYXN0ZXJuIENoaW5hJyB9LFxuXHRcdCAgIHsgbmFtZTogJ1NwZWN0YWNsZWQgY2FpbWFuJywgbG9jYXRpb246ICdDZW50cmFsICYgU291dGggQW1lcmljYScgfSxcblx0XHQgICB7IG5hbWU6ICdCcm9hZC1zbm91dGVkIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfSxcblx0XHQgICB7IG5hbWU6ICdKYWNhcsOpIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfSxcblx0XHQgICB7IG5hbWU6ICdCbGFjayBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH1cblx0XHQgXSxcblx0XHQgZmlsdGVyczoge2xvY2F0aW9uOiAnUycsIG5hbWU6ICcnfVxuXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uRmlsdGVyQ2hhbmdlOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc3QgZiA9ICQodGhpcykuZGF0YSgnZmlsdGVyJylcblx0XHRcdGN0cmwubW9kZWwuZmlsdGVyc1tmXSA9ICQodGhpcykudmFsKClcblx0XHRcdGN0cmwudXBkYXRlKHRoaXMpXG5cdFx0fSxcblx0XHRvblRhYmxlQ21kOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVGFibGVDbWQnLCBkYXRhKVxuXHRcdH1cdFx0XG5cdH1cdFxufSlcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWV2ZW50PVwiaW5wdXQuZmlsdGVyOiBvbkZpbHRlckNoYW5nZVwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZSBmaWx0ZXJcIiBibi12YWw9XCJmaWx0ZXJzLm5hbWVcIiBcblx0XHRcdGRhdGEtZmlsdGVyPVwibmFtZVwiIGNsYXNzPVwiZmlsdGVyXCI+XG5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImxvY2F0aW9uIGZpbHRlclwiIGJuLXZhbD1cImZpbHRlcnMubG9jYXRpb25cIlx0XHRcdFxuXHRcdFx0ZGF0YS1maWx0ZXI9XCJsb2NhdGlvblwiIGNsYXNzPVwiZmlsdGVyXCI+XG5cblx0XHRcblx0PC9kaXY+XG5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy50YWJsZVwiIFxuXHRcdGJuLWRhdGE9XCJkYXRhOiBncmlkRGF0YSwgY29sdW1uczogZ3JpZENvbHVtbnMsIGZpbHRlcnM6IGZpbHRlcnNcIlxuXHRcdGJuLWV2ZW50PVwidGFibGVjbWQ6IG9uVGFibGVDbWRcIlxuXHRcdD48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDIxJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWV2ZW50PVxcXCJpbnB1dC5maWx0ZXI6IG9uRmlsdGVyQ2hhbmdlXFxcIiBjbGFzcz1cXFwiZmlsdGVycGFuZWxcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZSBmaWx0ZXJcXFwiIGJuLXZhbD1cXFwiZmlsdGVycy5uYW1lXFxcIiBcXG5cdFx0XHRcdGRhdGEtZmlsdGVyPVxcXCJuYW1lXFxcIiBjbGFzcz1cXFwiZmlsdGVyXFxcIj5cXG5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcImxvY2F0aW9uIGZpbHRlclxcXCIgIGJuLXZhbD1cXFwiZmlsdGVycy5sb2NhdGlvblxcXCJcdFx0XHRkYXRhLWZpbHRlcj1cXFwibG9jYXRpb25cXFwiIGNsYXNzPVxcXCJmaWx0ZXJcXFwiPlxcblxcblx0XHRcdFxcblx0XHQ8L2Rpdj5cXG5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYmxlXFxcIiBcXG5cdFx0XHRibi1kYXRhPVxcXCJ7ZGF0YTogZ3JpZERhdGEsIGNvbHVtbnM6IGdyaWRDb2x1bW5zLCBmaWx0ZXJzOiBmaWx0ZXJzfVxcXCJcXG5cdFx0XHRibi1ldmVudD1cXFwidGFibGVjbWQ6IG9uVGFibGVDbWRcXFwiXFxuXHRcdFx0PjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Z3JpZENvbHVtbnM6IFtcblx0XHRcdFx0XHQnbmFtZScsIFxuXHRcdFx0XHRcdHtuYW1lOiAnbG9jYXRpb24nLCBsYWJlbDogJ0xvY2F0aW9uJ30sXG5cdFx0XHRcdFx0e2xhYmVsOiAnQWN0aW9uJywgYnV0dG9uczogW1xuXHRcdFx0XHRcdFx0XHR7Y21kOiAnZGVsZXRlJywgdGl0bGU6ICdEZWxldGUnLCBpY29uOiAnZmEgZmEtdHJhc2gnfSxcblx0XHRcdFx0XHRcdFx0e2NtZDogJ2VkaXQnLCB0aXRsZTogJ0VkaXQnLCBpY29uOiAnZmEgZmEtcGVuY2lsLWFsdCd9XG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fV0sXG5cdFx0XHRcdGdyaWREYXRhOiBbXG5cdFx0XHRcdCAgIHsgbmFtZTogJ0FtZXJpY2FuIGFsbGlnYXRvcicsIGxvY2F0aW9uOiAnU291dGhlYXN0IFVuaXRlZCBTdGF0ZXMnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ0NoaW5lc2UgYWxsaWdhdG9yJywgbG9jYXRpb246ICdFYXN0ZXJuIENoaW5hJyB9LFxuXHRcdFx0XHQgICB7IG5hbWU6ICdTcGVjdGFjbGVkIGNhaW1hbicsIGxvY2F0aW9uOiAnQ2VudHJhbCAmIFNvdXRoIEFtZXJpY2EnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ0Jyb2FkLXNub3V0ZWQgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdFx0XHQgICB7IG5hbWU6ICdKYWNhcsOpIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnQmxhY2sgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9XG5cdFx0XHRcdCBdLFxuXHRcdFx0XHQgZmlsdGVyczoge2xvY2F0aW9uOiAnUycsIG5hbWU6ICcnfSxcblx0XHRcdFx0IGpzQ29kZSxcblx0XHRcdFx0IGh0bWxDb2RlXG5cblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25GaWx0ZXJDaGFuZ2U6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc3QgZiA9ICQodGhpcykuZGF0YSgnZmlsdGVyJylcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25GaWx0ZXJDaGFuZ2UnLCBmKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuZmlsdGVyc1tmXSA9ICQodGhpcykudmFsKClcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSh0aGlzKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblRhYmxlQ21kOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRhYmxlQ21kJywgZGF0YSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgXHRvbk1lbnVTZWxlY3RlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcbiAgICBcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcbiAgICBcdH1cbiAgICB9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBzdHlsZT1cIndpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4OyBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIj5cblx0ICAgIDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2lyY3VsYXJtZW51XCIgXG5cdFx0ICAgIGJuLWRhdGE9XCJ7XG5cdFx0ICAgIFx0cmFkaXVzOiAxMjAsXG5cdFx0ICAgIFx0aWNvblBvczogODAsXG5cdFx0ICAgIFx0aW5uZXJSYWRpdXM6IDQwLFxuXHQgICAgXHRcdGl0ZW1zOiBbXG5cdCAgICBcdFx0ICAge3RleHQ6ICdcXFxcdWYwMTUnLCBjbGFzc05hbWU6ICdmYScsIGFjdGlvbjogJ3RvdG8nLCBjb2xvcjogJ3JlZCd9LFxuXHQgICAgXHRcdCAgIHt0ZXh0OiAnXFxcXHVmMDk5JywgY2xhc3NOYW1lOiAnZmFiJywgY29sb3I6ICdibHVlJ31cblx0ICAgIFx0XHRdLFxuXHRcdCAgICBcdHRyaWdnZXJQb3M6IHtsZWZ0OiAxMDAsIHRvcDogMjAwfVx0XHQgICAgXHRcblx0XHQgICAgfVwiXG5cdCAgICBcdGJuLWV2ZW50PVwibWVudVNlbGVjdGVkOiBvbk1lbnVTZWxlY3RlZFwiIFxuXHQgICAgXHQ+PC9kaXY+XG5cdDwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgc3R5bGU9XFxcIndpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4OyBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXFwiPlxcblx0XHQgICAgPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNpcmN1bGFybWVudVxcXCIgXFxuXHRcdCAgICBcdGJuLWRhdGE9XFxcIntcXG5cdFx0ICAgIFx0XHRyYWRpdXM6IDEyMCxcXG5cdFx0ICAgIFx0XHRpY29uUG9zOiA4MCxcXG5cdFx0ICAgIFx0XHRpbm5lclJhZGl1czogNDAsXFxuXHRcdCAgICBcdFx0aXRlbXM6IFtcXG5cdFx0ICAgIFx0XHQgICB7dGV4dDogXFwnXFxcXHVmMDE1XFwnLCBjbGFzc05hbWU6IFxcJ2ZhXFwnLCBhY3Rpb246IFxcJ3RvdG9cXCcsIGNvbG9yOiBcXCdyZWRcXCd9LFxcblx0XHQgICAgXHRcdCAgIHt0ZXh0OiBcXCdcXFxcdWYwOTlcXCcsIGNsYXNzTmFtZTogXFwnZmFiXFwnLCBjb2xvcjogXFwnYmx1ZVxcJ31cXG5cdFx0ICAgIFx0XHRdLFxcblx0XHQgICAgXHRcdHRyaWdnZXJQb3M6IHtsZWZ0OiAxMDAsIHRvcDogMjAwfVx0XHQgICAgXHRcXG5cdFx0ICAgIFx0fVxcXCJcXG5cdFx0ICAgIFx0Ym4tZXZlbnQ9XFxcIm1lbnVTZWxlY3RlZDogb25NZW51U2VsZWN0ZWRcXFwiIFxcblx0XHQgICAgXHQ+PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHQgICAgICAgIGpzQ29kZSxcblx0XHQgICAgICAgIGh0bWxDb2RlXG5cdFx0ICAgIH0sXG5cdFx0ICAgIGV2ZW50czoge1xuXHRcdCAgICBcdG9uTWVudVNlbGVjdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdCAgICBcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcblx0XHQgICAgXHR9XG5cdFx0ICAgIH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdH0sXG5cdGV2ZW50czoge1xuXG5cdFx0b25NYXBTaGFwZUNvbnRleHRNZW51OiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uTWFwU2hhcGVDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0XHRjb25zdCB7aWQsIHBvc30gPSBkYXRhXG5cdFx0XHRjb25zdCBpbmZvID0gJCh0aGlzKS5pZmFjZSgpLmdldFNoYXBlSW5mbyhpZClcblx0XHRcdGNvbnN0IGlkeCA9IGN0cmwuc2NvcGUubWVudS5wcm9wcy5pdGVtcy5maW5kSW5kZXgoKGl0ZW0pID0+IGl0ZW0uY29sb3IgPT0gaW5mby5pY29uLmNvbG9yKVxuXHRcdFx0Y3RybC5zY29wZS5tYXAuZW5hYmxlSGFuZGxlcnMoZmFsc2UpXG5cdFx0XHRjdHJsLnNjb3BlLm1lbnUuY2xvc2VNZW51KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnNlbGVjdChpZHgpLnNob3dNZW51KHBvcy54LCBwb3MueSlcblx0XHRcdFx0c2VsU2hhcGUgPSBpZFxuXHRcdFx0fSlcblxuXHRcdH0sXG5cblx0XHRvbk1lbnVTZWxlY3RlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1lbnVTZWxlY3RlZCcsIGRhdGEpXG5cdFx0XHRjdHJsLnNjb3BlLm1hcC51cGRhdGVTaGFwZShzZWxTaGFwZSwge2ljb246IHt0eXBlOiAnYWlzJywgY29sb3I6IGRhdGEuY29sb3J9fSlcblx0XHR9LFxuXG5cdFx0b25NZW51Q2xvc2VkOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1lbnVDbG9zZWQnKVxuXHRcdFx0Y3RybC5zY29wZS5tYXAuZW5hYmxlSGFuZGxlcnModHJ1ZSlcblx0XHR9XG5cdH1cdFxufSlcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBjbGFzcz1cIm1hcFwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO1wiPlxuXHRcdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgc3R5bGU9XCJoZWlnaHQ6IDEwMCVcIiBcblx0XHRcdGJuLWRhdGE9XCJ7XG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHQgICAgICAgIHNoYXBlczoge1xuXHRcdFx0XHRcdHNoYXBlMToge1xuXHRcdFx0XHRcdFx0dHlwZTogJ21hcmtlcicsXG5cdFx0XHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxuXHRcdFx0XHRcdFx0cm90YXRpb25BbmdsZTogMjAsXG5cdFx0XHRcdFx0XHRpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiAnYmx1ZSd9XG5cdFx0XHRcdFx0fSxcdCAgICAgICAgXHRcblx0XHRcdFx0XHRzaGFwZTI6IHtcblx0XHRcdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDcxfSxcblx0XHRcdFx0XHRcdGljb246IHt0eXBlOiAnYWlzJywgY29sb3I6ICdyZWQnfSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNjYWxlOiB0cnVlLFxuXHRcdFx0XHRcdGNvb3JkaW5hdGVzOiB0cnVlXHRcdFx0XHRcdFxuXHRcdCAgICAgICAgfVx0XHRcdFx0XHRcblx0XHRcdH1cIiBcblx0XHRcdGJuLWlmYWNlPVwibWFwXCJcblx0XHRcdGJuLWV2ZW50PVwibWFwc2hhcGVjb250ZXh0bWVudTogb25NYXBTaGFwZUNvbnRleHRNZW51XCJcblx0XHRcdD48L2Rpdj5cblxuXHRcdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2lyY3VsYXJtZW51XCJcblx0XHRcdHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO3RvcDogLTEwMCVcIiBcblx0XHRcdGJuLWV2ZW50PVwibWVudVNlbGVjdGVkOiBvbk1lbnVTZWxlY3RlZCwgbWVudUNsb3NlZDogb25NZW51Q2xvc2VkXCIgXG5cdFx0XHRibi1kYXRhPVwie1xuXHRcdFx0XHRpdGVtczogW1xuXHRcdFx0XHQgICAge3RleHQ6ICdSZWQnLCBjb2xvcjogJ3JlZCd9LFxuXHRcdFx0XHQgICAge3RleHQ6ICdCbHVlJywgY29sb3I6ICdibHVlJ30sXG5cdFx0XHRcdCAgICB7dGV4dDogJ0dyZWVuJywgY29sb3I6ICdncmVlbid9LFxuXHRcdFx0XHQgICAge3RleHQ6ICdCbGFjaycsIGNvbG9yOiAnYmxhY2snfVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRyYWRpdXM6IDgwLFxuXHRcdFx0XHRpbm5lclJhZGl1czogMjAsXG5cdFx0XHRcdGljb25Qb3M6IDUwLFxuXHRcdFx0XHRoYXNUcmlnZ2VyOiBmYWxzZVxuXHRcdFx0fVwiXG5cdFx0XHRibi1pZmFjZT1cIm1lbnVcIj48L2Rpdj5cblx0XHRcblx0PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxubGV0IHNlbFNoYXBlID0gXCJcIlxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDIzJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGNsYXNzPVxcXCJtYXBcXFwiIHN0eWxlPVxcXCJwb3NpdGlvbjogcmVsYXRpdmU7XFxcIj5cXG5cdFx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMubWFwXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OiAxMDAlXFxcIiBcXG5cdFx0XHRcdGJuLWRhdGE9XFxcIntcXG5cdFx0XHRcdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LFxcblx0XHRcdCAgICAgICAgc2hhcGVzOiB7XFxuXHRcdFx0XHRcdFx0c2hhcGUxOiB7XFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcXCdtYXJrZXJcXCcsXFxuXHRcdFx0XHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxcblx0XHRcdFx0XHRcdFx0cm90YXRpb25BbmdsZTogMjAsXFxuXHRcdFx0XHRcdFx0XHRpY29uOiB7dHlwZTogXFwnYWlzXFwnLCBjb2xvcjogXFwnYmx1ZVxcJ31cXG5cdFx0XHRcdFx0XHR9LFx0ICAgICAgICBcdFxcblx0XHRcdFx0XHRcdHNoYXBlMjoge1xcblx0XHRcdFx0XHRcdFx0dHlwZTogXFwnbWFya2VyXFwnLFxcblx0XHRcdFx0XHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDcxfSxcXG5cdFx0XHRcdFx0XHRcdGljb246IHt0eXBlOiBcXCdhaXNcXCcsIGNvbG9yOiBcXCdyZWRcXCd9LFxcblx0XHRcdFx0XHRcdH1cXG5cdFx0XHQgICAgICAgIH0sXFxuXHRcdFx0ICAgICAgICBzY2FsZTogdHJ1ZSxcXG5cdFx0XHQgICAgICAgIGNvb3JkaW5hdGVzOiB0cnVlXHRcdFx0XHRcdFxcblx0XHRcdFx0fVxcXCIgXFxuXHRcdFx0XHRibi1pZmFjZT1cXFwibWFwXFxcIlxcblx0XHRcdFx0Ym4tZXZlbnQ9XFxcIm1hcHNoYXBlY29udGV4dG1lbnU6IG9uTWFwU2hhcGVDb250ZXh0TWVudVxcXCJcXG5cdFx0XHRcdD48L2Rpdj5cXG5cXG5cdFx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY2lyY3VsYXJtZW51XFxcIlxcblx0XHRcdFx0c3R5bGU9XFxcInBvc2l0aW9uOiByZWxhdGl2ZTt0b3A6IC0xMDAlXFxcIiBcXG5cdFx0XHRcdGJuLWV2ZW50PVxcXCJtZW51U2VsZWN0ZWQ6IG9uTWVudVNlbGVjdGVkLCBtZW51Q2xvc2VkOiBvbk1lbnVDbG9zZWRcXFwiIFxcblx0XHRcdFx0Ym4tZGF0YT1cXFwie1xcblx0XHRcdFx0XHRpdGVtczogW1xcblx0XHRcdFx0XHQgICAge3RleHQ6IFxcJ1JlZFxcJywgY29sb3I6IFxcJ3JlZFxcJ30sXFxuXHRcdFx0XHRcdCAgICB7dGV4dDogXFwnQmx1ZVxcJywgY29sb3I6IFxcJ2JsdWVcXCd9LFxcblx0XHRcdFx0XHQgICAge3RleHQ6IFxcJ0dyZWVuXFwnLCBjb2xvcjogXFwnZ3JlZW5cXCd9LFxcblx0XHRcdFx0XHQgICAge3RleHQ6IFxcJ0JsYWNrXFwnLCBjb2xvcjogXFwnYmxhY2tcXCd9XFxuXHRcdFx0XHRcdF0sXFxuXHRcdFx0XHRcdHJhZGl1czogODAsXFxuXHRcdFx0XHRcdGlubmVyUmFkaXVzOiAyMCxcXG5cdFx0XHRcdFx0aWNvblBvczogNTAsXFxuXHRcdFx0XHRcdGhhc1RyaWdnZXI6IGZhbHNlXFxuXHRcdFx0XHR9XFxcIlxcblx0XHRcdFx0Ym4taWZhY2U9XFxcIm1lbnVcXFwiPjwvZGl2Plxcblx0XHRcdFxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cblx0XHRcdFx0b25NYXBTaGFwZUNvbnRleHRNZW51OiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcFNoYXBlQ29udGV4dE1lbnUnLCBkYXRhKVxuXHRcdFx0XHRcdGNvbnN0IHtpZCwgcG9zfSA9IGRhdGFcblx0XHRcdFx0XHRjb25zdCBpbmZvID0gJCh0aGlzKS5pZmFjZSgpLmdldFNoYXBlSW5mbyhpZClcblx0XHRcdFx0XHRjb25zdCBpZHggPSBjdHJsLnNjb3BlLm1lbnUucHJvcHMuaXRlbXMuZmluZEluZGV4KChpdGVtKSA9PiBpdGVtLmNvbG9yID09IGluZm8uaWNvbi5jb2xvcilcblx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyhmYWxzZSlcblx0XHRcdFx0XHRjdHJsLnNjb3BlLm1lbnUuY2xvc2VNZW51KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dGhpcy5zZWxlY3QoaWR4KS5zaG93TWVudShwb3MueCwgcG9zLnkpXG5cdFx0XHRcdFx0XHRzZWxTaGFwZSA9IGlkXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdG9uTWVudVNlbGVjdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1lbnVTZWxlY3RlZCcsIGRhdGEpXG5cdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoc2VsU2hhcGUsIHtpY29uOiB7dHlwZTogJ2FpcycsIGNvbG9yOiBkYXRhLmNvbG9yfX0pXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0b25NZW51Q2xvc2VkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NZW51Q2xvc2VkJylcblx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyh0cnVlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0cm9sbDogMTAsXG5cdFx0cGl0Y2g6IDEwLFxuXHRcdGFsdGl0dWRlOiA1MCxcblx0XHRzcGVlZDogNVxuXHR9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdj5cblx0XHQ8ZGl2IGNsYXNzPVwicmFuZ2VpbnB1dFwiPlxuXHRcdFx0PGxhYmVsPlJvbGw8L2xhYmVsPlx0XHRcdFxuXHRcdFx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi01MFwiIG1heD1cIjUwXCIgYm4tdmFsPVwicm9sbFwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PGJyPlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBjbGFzcz1cInJhbmdlaW5wdXRcIj5cblx0XHRcdDxsYWJlbD5QaXRjaDwvbGFiZWw+XHRcdFx0XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTQwXCIgbWF4PVwiNDBcIiBibi12YWw9XCJwaXRjaFwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PGJyPlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBjbGFzcz1cInJhbmdlaW5wdXRcIj5cblx0XHRcdDxsYWJlbD5TcGVlZDwvbGFiZWw+XHRcdFx0XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWF4PVwiMjAwXCIgYm4tdmFsPVwic3BlZWRcIiBibi11cGRhdGU9XCJpbnB1dFwiPjxicj5cblx0XHQ8L2Rpdj5cblxuXHRcdDxkaXYgY2xhc3M9XCJyYW5nZWlucHV0XCI+XG5cdFx0XHQ8bGFiZWw+QWx0aXR1ZGU8L2xhYmVsPlx0XHRcdFxuXHRcdFx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIGJuLXZhbD1cImFsdGl0dWRlXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48YnI+XG5cdFx0PC9kaXY+XG5cblx0PC9kaXY+XG5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5mbGlnaHRwYW5lbFwiIFxuXHRcdGJuLWRhdGE9XCJ7cm9sbCwgcGl0Y2gsIHNwZWVkLCBhbHRpdHVkZX1cIj5cblx0XHRcbjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjQnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXY+XFxuXHRcdFx0PGRpdiBjbGFzcz1cXFwicmFuZ2VpbnB1dFxcXCI+XFxuXHRcdFx0XHQ8bGFiZWw+Um9sbDwvbGFiZWw+XHRcdFx0XFxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIG1pbj1cXFwiLTUwXFxcIiBtYXg9XFxcIjUwXFxcIiBibi12YWw9XFxcInJvbGxcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjxicj5cXG5cdFx0XHQ8L2Rpdj5cXG5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVxcXCJyYW5nZWlucHV0XFxcIj5cXG5cdFx0XHRcdDxsYWJlbD5QaXRjaDwvbGFiZWw+XHRcdFx0XFxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIG1pbj1cXFwiLTQwXFxcIiBtYXg9XFxcIjQwXFxcIiBibi12YWw9XFxcInBpdGNoXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PC9kaXY+XFxuXFxuXHRcdFx0PGRpdiBjbGFzcz1cXFwicmFuZ2VpbnB1dFxcXCI+XFxuXHRcdFx0XHQ8bGFiZWw+U3BlZWQ8L2xhYmVsPlx0XHRcdFxcblx0XHRcdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBtYXg9XFxcIjIwMFxcXCIgYm4tdmFsPVxcXCJzcGVlZFxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PGJyPlxcblx0XHRcdDwvZGl2Plxcblxcblx0XHRcdDxkaXYgY2xhc3M9XFxcInJhbmdlaW5wdXRcXFwiPlxcblx0XHRcdFx0PGxhYmVsPkFsdGl0dWRlPC9sYWJlbD5cdFx0XHRcXG5cdFx0XHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgYm4tdmFsPVxcXCJhbHRpdHVkZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PGJyPlxcblx0XHRcdDwvZGl2Plxcblxcblx0XHQ8L2Rpdj5cXG5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmZsaWdodHBhbmVsXFxcIlxcblx0XHRcdGJuLWRhdGE9XFxcIntyb2xsLCBwaXRjaCwgc3BlZWQsIGFsdGl0dWRlLCBzaG93U3BlZWR9XFxcIj5cXG5cdFx0XHRcdFxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHJvbGw6IDEwLFxuXHRcdFx0XHRwaXRjaDogMTAsXG5cdFx0XHRcdGFsdGl0dWRlOiA1MCxcblx0XHRcdFx0c3BlZWQ6IDUsXG5cdFx0XHRcdHNob3dTcGVlZDogdHJ1ZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRodG1sQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGN0cmwuc2V0RGF0YShkYXRhKVxuXHRcdH1cblxuXHR9XG59KVxuXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHR2YWx1ZXM6IFsgNzUsIDMwMCBdLFxuXHRcdHZhbHVlOiA1MFxuXHR9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiAgc3R5bGU9XCJwYWRkaW5nOiAyMHB4O1wiPlxuXHRcdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuc2xpZGVyXCIgYm4tdmFsPVwidmFsdWVcIiBibi11cGRhdGU9XCJpbnB1dFwiPjwvZGl2Plx0XG5cdFx0PGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDEwcHg7XCI+XG5cdFx0XHQ8bGFiZWw+VmFsdWU8L2xhYmVsPlx0XG5cdFx0XHQ8c3BhbiBibi10ZXh0PVwidmFsdWVcIj48L3NwYW4+XHRcdFx0XG5cdFx0PC9kaXY+XG5cblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnNsaWRlclwiIGJuLXZhbD1cInZhbHVlc1wiIGJuLWRhdGE9XCJ7bWluOiAwLCBtYXg6IDUwMH1cIiBibi11cGRhdGU9XCJpbnB1dFwiPjwvZGl2Plx0XG5cdFx0PGRpdj5cblx0XHRcdDxsYWJlbD5WYWx1ZXM8L2xhYmVsPlx0XG5cdFx0XHQ8c3BhbiBibi10ZXh0PVwidmFsdWVzXCI+PC9zcGFuPlx0XHRcdFxuXHRcdDwvZGl2PlxuXG5cdDwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjUnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXFxuXHRcdDxkaXYgIHN0eWxlPVxcXCJwYWRkaW5nOiAyMHB4O1xcXCI+XFxuXHRcdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnNsaWRlclxcXCIgYm4tdmFsPVxcXCJ2YWx1ZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PC9kaXY+XHRcXG5cdFx0XHQ8ZGl2IHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOiAxMHB4O1xcXCI+XFxuXHRcdFx0XHQ8bGFiZWw+VmFsdWU8L2xhYmVsPlx0XFxuXHRcdFx0XHQ8c3BhbiBibi10ZXh0PVxcXCJ2YWx1ZVxcXCI+PC9zcGFuPlx0XHRcdFxcblx0XHRcdDwvZGl2Plxcblxcblx0XHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5zbGlkZXJcXFwiIGJuLXZhbD1cXFwidmFsdWVzXFxcIiBibi1kYXRhPVxcXCJ7bWluOiAwLCBtYXg6IDUwMH1cXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjwvZGl2Plx0XFxuXHRcdFx0PGRpdj5cXG5cdFx0XHRcdDxsYWJlbD5WYWx1ZXM8L2xhYmVsPlx0XFxuXHRcdFx0XHQ8c3BhbiBibi10ZXh0PVxcXCJ2YWx1ZXNcXFwiPjwvc3Bhbj5cdFx0XHRcXG5cdFx0XHQ8L2Rpdj5cXG5cXG5cdFx0PC9kaXY+XFxuXFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHR2YWx1ZXM6IFsgNzUsIDMwMCBdLFxuXHRcdFx0XHR2YWx1ZTogNTAsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0aHRtbENvZGVcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRjdHJsLnNldERhdGEoZGF0YSlcblx0XHR9XG5cblx0fVxufSlcblxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdGRhdGE6IHtcblx0XHR2YWx1ZTogMFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkRvd25sb2FkOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkRvd25sb2FkJylcblx0XHRcdGN0cmwuc2V0RGF0YSh7dmFsdWU6IDB9KVx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRzZXRUaW1lb3V0KCBwcm9ncmVzcywgMjAwMCApXHRcdFx0XHRcblx0XHR9XG5cdH1cbn0pXG5cbmZ1bmN0aW9uIHByb2dyZXNzKCkge1xuXG4gIHZhciB2YWx1ZSA9IGN0cmwubW9kZWwudmFsdWUgKyAyO1xuXG5cdGN0cmwuc2V0RGF0YSh7dmFsdWV9KVxuXG4gIGlmICggdmFsdWUgPCA5OSApIHtcbiAgICBzZXRUaW1lb3V0KCBwcm9ncmVzcywgODAgKTtcbiAgfVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2ICBzdHlsZT1cInBhZGRpbmc6IDIwcHg7XCI+XG5cdFx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5wcm9ncmVzc2JhclwiIGJuLXZhbD1cInZhbHVlXCIgYm4tZGF0YT0gXCJ7c2hvd1BlcmNlbnQ6IHRydWUsIGluaXRUZXh0OiAnTG9hZGluZy4uLicsIGNvbG9yOiAnYmx1ZSd9XCI+PC9kaXY+XHRcblxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25Eb3dubG9hZFwiIHN0eWxlPVwibWFyZ2luLXRvcDogMTBweFwiPkRvd25sb2FkPC9idXR0b24+XG5cblx0PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyNicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cXG5cdFx0PGRpdiAgc3R5bGU9XFxcInBhZGRpbmc6IDIwcHg7XFxcIj5cXG5cdFx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMucHJvZ3Jlc3NiYXJcXFwiIGJuLXZhbD1cXFwidmFsdWVcXFwiIGJuLWRhdGE9IFxcXCJ7c2hvd1BlcmNlbnQ6IHRydWUsIGluaXRUZXh0OiBcXCdMb2FkaW5nLi4uXFwnLCBjb2xvcjogXFwnYmx1ZVxcJ31cXFwiPjwvZGl2Plx0XFxuXFxuXHRcdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uRG93bmxvYWRcXFwiIHN0eWxlPVxcXCJtYXJnaW4tdG9wOiAxMHB4XFxcIj5Eb3dubG9hZDwvYnV0dG9uPlxcblxcblx0XHQ8L2Rpdj5cXG5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHZhbHVlOiAwLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGh0bWxDb2RlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uRG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkRvd25sb2FkJylcblx0XHRcdFx0XHRjdHJsLnNldERhdGEoe3ZhbHVlOiAwfSlcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNldFRpbWVvdXQoIHByb2dyZXNzLCAyMDAwIClcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdGZ1bmN0aW9uIHByb2dyZXNzKCkge1xuXG5cdFx0ICB2YXIgdmFsdWUgPSBjdHJsLm1vZGVsLnZhbHVlICsgMjtcblx0XHRcblx0XHRcdGN0cmwuc2V0RGF0YSh7dmFsdWV9KVxuXHRcdFxuXHRcdCAgaWYgKCB2YWx1ZSA8IDk5ICkge1xuXHRcdCAgICBzZXRUaW1lb3V0KCBwcm9ncmVzcywgODAgKTtcblx0XHQgIH1cblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGN0cmwuc2V0RGF0YShkYXRhKVxuXHRcdH1cblxuXHR9XG59KVxuXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGRsZyA9ICQkLmRpYWxvZ0NvbnRyb2xsZXIoe1xuXHR0aXRsZTogJ015IFdpbmRvdycsXG5cdHdpZHRoOiA0MDAsXG5cdGhlaWdodDogMzUwLFxuXHRyZXNpemFibGU6IGZhbHNlLFxuXHRtb2RhbDogZmFsc2UsXG5cdHRlbXBsYXRlOiAkKCcjdGVtcGxhdGUnKSxcblx0ZGF0YToge1xuXHRcdGZhdm9yaXRlRnJ1aXQ6ICdhcHBsZScsXG5cdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ11cblx0fSxcblx0YnV0dG9uczogW1xuXHRcdHtcblx0XHRcdHRleHQ6ICdDbGVhcicsIFxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkbGcuc2V0RGF0YSh7Y2xpZW50czogW119KVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0dGV4dDogJ0Nsb3NlJywgXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRsZy5oaWRlKClcblx0XHRcdH1cblx0XHR9XG5cdF1cbn0pXG5cbmRsZy5hZGRDbGllbnQgPSBmdW5jdGlvbihuYW1lKSB7XG5cdHRoaXMubW9kZWwuY2xpZW50cy5wdXNoKG5hbWUpXG5cdHRoaXMudXBkYXRlKClcbn1cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGV2ZW50czoge1xuXHRcdG9wZW5XaW5kb3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGxnLnNob3coKVxuXHRcdH0sXG5cdFx0YWRkQ2xpZW50OiBmdW5jdGlvbigpIHtcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIENsaWVudCcsIGxhYmVsOiAnbmFtZSA6J30sIGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdFx0ZGxnLmFkZENsaWVudChuYW1lKVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cdFx0XHRcbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9wZW5XaW5kb3dcIj5PcGVuIFdpbmRvdzwvYnV0dG9uPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IGFkZENsaWVudFwiPkFkZCBDbGllbnQ8L2J1dHRvbj5cbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW4+XG5cdDxoMj5GcnVpdHM8L2gyPlxuXHQ8cD5Zb3VyIGZhdm9yaXQgZnJ1aXQ6IDxzcGFuIGJuLXRleHQ9XCJmYXZvcml0ZUZydWl0XCI+PC9zcGFuPjwvcD5cblx0PGRpdiBcblx0XHRibi1jb250cm9sPVwiYnJhaW5qcy5zZWxlY3RtZW51XCIgXG5cdFx0Ym4tdmFsPVwiZmF2b3JpdGVGcnVpdFwiIFxuXHRcdGJuLXVwZGF0ZT1cInNlbGVjdG1lbnVjaGFuZ2VcIiBcblx0XHRibi1kYXRhPVwie1xuXHRcdFx0aXRlbXM6IFsnb3JhbmdlJywgJ2FwcGxlJywgJ2JhbmFuYXMnLCAnbGVtb24nXVxuXHRcdH1cIj5cblx0XHRcblx0PC9kaXY+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHVsIGJuLWVhY2g9XCJjbGllbnRzXCI+XG5cdFx0PGxpIGJuLXRleHQ9XCIkaVwiPjwvbGk+XG5cdDwvdWw+XG5cdFxuPC9kaXY+XG5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyNycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9wZW5XaW5kb3dcXFwiPk9wZW4gV2luZG93PC9idXR0b24+XFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBhZGRDbGllbnRcXFwiPkFkZCBDbGllbnQ8L2J1dHRvbj5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG48ZGl2IGlkPVxcXCJ0ZW1wbGF0ZVxcXCIgaGlkZGVuPlxcblx0PGgyPkZydWl0czwvaDI+XFxuXHQ8cD5Zb3VyIGZhdm9yaXQgZnJ1aXQ6IDxzcGFuIGJuLXRleHQ9XFxcImZhdm9yaXRlRnJ1aXRcXFwiPjwvc3Bhbj48L3A+XFxuXHQ8ZGl2IFxcblx0XHRibi1jb250cm9sPVxcXCJicmFpbmpzLnNlbGVjdG1lbnVcXFwiIFxcblx0XHRibi12YWw9XFxcImZhdm9yaXRlRnJ1aXRcXFwiIFxcblx0XHRibi11cGRhdGU9XFxcInNlbGVjdG1lbnVjaGFuZ2VcXFwiIFxcblx0XHRibi1kYXRhPVxcXCJ7XFxuXHRcdFx0aXRlbXM6IFtcXCdvcmFuZ2VcXCcsIFxcJ2FwcGxlXFwnLCBcXCdiYW5hbmFzXFwnLCBcXCdsZW1vblxcJ11cXG5cdFx0fVxcXCI+XFxuXHRcdFxcblx0PC9kaXY+XFxuXHQ8aDI+Q2xpZW50czwvaDI+XFxuXHQ8dWwgYm4tZWFjaD1cXFwiY2xpZW50c1xcXCI+XFxuXHRcdDxsaSBibi10ZXh0PVxcXCIkaVxcXCI+PC9saT5cXG5cdDwvdWw+XFxuXHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBkbGcgPSAkJC5kaWFsb2dDb250cm9sbGVyKHtcblx0XHRcdHRpdGxlOiAnTXkgV2luZG93Jyxcblx0XHRcdHdpZHRoOiA0MDAsXG5cdFx0XHRoZWlnaHQ6IDM1MCxcblx0XHRcdHJlc2l6YWJsZTogZmFsc2UsXG5cdFx0XHRtb2RhbDogZmFsc2UsXG5cdFx0XHR0ZW1wbGF0ZTogZWx0LmZpbmQoJyN0ZW1wbGF0ZScpLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRmYXZvcml0ZUZydWl0OiAnYXBwbGUnLFxuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXVxuXHRcdFx0fSxcblx0XHRcdGJ1dHRvbnM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRleHQ6ICdDbGVhcicsIFxuXHRcdFx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGRsZy5zZXREYXRhKHtjbGllbnRzOiBbXX0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGV4dDogJ0Nsb3NlJywgXG5cdFx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZGxnLmhpZGUoKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH0pXG5cblx0XHRkbGcuYWRkQ2xpZW50ID0gZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0dGhpcy5tb2RlbC5jbGllbnRzLnB1c2gobmFtZSlcblx0XHRcdHRoaXMudXBkYXRlKClcblx0XHR9XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdCAgXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9wZW5XaW5kb3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRsZy5zaG93KClcblx0XHRcdFx0fSxcblx0XHRcdFx0YWRkQ2xpZW50OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBDbGllbnQnLCBsYWJlbDogJ25hbWUgOid9LCBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHRcdFx0XHRkbGcuYWRkQ2xpZW50KG5hbWUpXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dWwgYm4tZWFjaD1cImNsaWVudHNcIj5cblx0XHQ8bGkgYm4tdGV4dD1cIiRpXCI+PC9saT5cblx0PC91bD5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHVsIGJuLWVhY2g9XFxcImNsaWVudHNcXFwiPlxcblx0XHRcdDxsaSBibi10ZXh0PVxcXCIkc2NvcGUuJGlcXFwiPjwvbGk+XFxuXHRcdDwvdWw+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ11cdFx0XHRcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpLm5hbWUpXG5cdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHR9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiJGlcIj48L2xpPlxuXHQ8L3VsPlxuXG5cdDxoMj5BZGQgY2xpZW50PC9oMj5cblx0PGZvcm0gYm4tZXZlbnQ9XCJzdWJtaXQ6IG9uQWRkQ2xpZW50XCI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiBhdXRvZm9jdXM9XCJcIiByZXF1aXJlZD1cIlwiPlxuXHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkFkZDwvYnV0dG9uPlxuXHQ8L2Zvcm0+XHRcbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDQnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHVsIGJuLWVhY2g9XFxcImNsaWVudHNcXFwiPlxcblx0XHRcdDxsaSBibi10ZXh0PVxcXCIkc2NvcGUuJGlcXFwiPjwvbGk+XFxuXHRcdDwvdWw+XFxuXFxuXHRcdDxoMj5BZGQgY2xpZW50PC9oMj5cXG5cdFx0PGZvcm0gYm4tZXZlbnQ9XFxcInN1Ym1pdDogb25BZGRDbGllbnRcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgYXV0b2ZvY3VzPVxcXCJcXFwiIHJlcXVpcmVkPVxcXCJcXFwiPlxcblx0XHRcdDxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIj5BZGQ8L2J1dHRvbj5cXG5cdFx0PC9mb3JtPlx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKS5uYW1lKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKClcblx0XHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgICBjbGllbnRzOiBbXG5cdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0ICAgIF1cblx0fVx0XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5hZ2VcIj48L3RkPlxuXHRcdFx0PC90cj5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q1Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjbGllbnRzXFxcIj5cXG5cdFx0XHRcdDx0cj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5uYW1lXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiJHNjb3BlLiRpLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cdFx0IFxcblx0XHQ8L3RhYmxlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0XG5cdFx0XHR9XHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXG5cdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cdFx0fSxcblx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdHZhciBpZHggPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuaW5kZXgoKVxuXHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4KVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgICA8dGg+QWN0aW9uPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIiBibi1ldmVudD1cImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkaS5hZ2VcIj48L3RkPlxuXHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cImRlbEJ0blwiIHRpdGxlPVwiRGVsZXRlXCI+RGVsZXRlPC9idXR0b24+XG5cdFx0XHQ8L3RyPlxuXG5cdFx0PC90Ym9keT5cblx0IFxuXHQ8L3RhYmxlPlx0XG5cblx0PGgyPkFkZCBjbGllbnQ8L2gyPlxuXHQ8Zm9ybSBibi1ldmVudD1cInN1Ym1pdDogb25BZGRDbGllbnRcIj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuYW1lPVwibmFtZVwiIHJlcXVpcmVkPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cIm51bWJlclwiIHBsYWNlaG9sZGVyPVwiYWdlXCIgbmFtZT1cImFnZVwiIHJlcXVpcmVkPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQWRkXCI+XG5cdDwvZm9ybT5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgICA8dGg+QWN0aW9uPC90aD5cXG5cdFx0XHQgIDwvdHI+XFxuXHRcdFx0PC90aGVhZD5cXG5cdFx0XHQ8dGJvZHkgYm4tZWFjaD1cXFwiY2xpZW50c1xcXCIgYm4tZXZlbnQ9XFxcImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcXFwiPlxcblx0XHRcdFx0PHRyPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiJHNjb3BlLiRpLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkc2NvcGUuJGkuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cXG5cdFx0IFxcblx0XHQ8L3RhYmxlPlx0XFxuXFxuXHRcdDxoMj5BZGQgY2xpZW50PC9oMj5cXG5cdFx0PGZvcm0gYm4tZXZlbnQ9XFxcInN1Ym1pdDogb25BZGRDbGllbnRcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHBsYWNlaG9sZGVyPVxcXCJhZ2VcXFwiIG5hbWU9XFxcImFnZVxcXCIgcmVxdWlyZWQ+PGJyPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCJBZGRcXFwiPlxcblx0XHQ8L2Zvcm0+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cdFwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHQgICAgaHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoKVxuXHRcdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblx0XHRcdFx0fSxcblx0XHRcdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG4gICAgICBcdFx0XHRcdHZhciBpZHggPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuaW5kZXgoKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeClcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBkbGdBZGRDbGllbnQgPSAkJC5mb3JtRGlhbG9nQ29udHJvbGxlcih7XG5cdHRpdGxlOiAnQWRkIENsaWVudCcsXG5cdHRlbXBsYXRlOiAkKCcjdGVtcGxhdGUnKVxufSlcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGRsZ0FkZENsaWVudC5zaG93KGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goZGF0YSlcblx0XHRcdFx0Y3RybC51cGRhdGUoKVx0XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHR2YXIgaWR4ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmluZGV4KClcblx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeClcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0Y3RybC51cGRhdGUoKVxuXHRcdH1cblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjbGllbnRzXCIgYm4tZXZlbnQ9XCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJGkubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJGkuYWdlXCI+PC90ZD5cblx0XHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XCJkZWxCdG5cIiB0aXRsZT1cIkRlbGV0ZVwiPkRlbGV0ZTwvYnV0dG9uPlxuXHRcdFx0PC90cj5cblxuXHRcdDwvdGJvZHk+XG5cdCBcblx0PC90YWJsZT5cdFxuXG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGRDbGllbnRcIj5BZGQgQ2xpZW50PC9idXR0b24+XHRcbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiByZXF1aXJlZD48YnI+XG5cdDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJhZ2VcIiBuYW1lPVwiYWdlXCIgcmVxdWlyZWQ+PGJyPiBcbjwvZGl2PlxuXG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjbGllbnRzXFxcIiBibi1ldmVudD1cXFwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFxcXCI+XFxuXHRcdFx0XHQ8dHI+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkc2NvcGUuJGkubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plxcblx0XHQgXFxuXHRcdDwvdGFibGU+XHRcXG5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uQWRkQ2xpZW50XFxcIj5BZGQgQ2xpZW50PC9idXR0b24+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXHRcXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgZGxnQWRkQ2xpZW50ID0gJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIoe1xuXHRcdFx0dGl0bGU6ICdBZGQgQ2xpZW50Jyxcblx0XHRcdHRlbXBsYXRlOiBcIjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcbjxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHBsYWNlaG9sZGVyPVxcXCJhZ2VcXFwiIG5hbWU9XFxcImFnZVxcXCIgcmVxdWlyZWQ+PGJyPiBcdFx0XCJcblx0XHR9KVxuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdCAgICBodG1sQ29kZSxcblx0XHRcdCAgICBqc0NvZGVcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRkbGdBZGRDbGllbnQuc2hvdyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaChkYXRhKVxuXHRcdFx0XHRcdFx0Y3RybC51cGRhdGUoKVx0XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG4gICAgICBcdFx0XHRcdHZhciBpZHggPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuaW5kZXgoKVxuICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9KVxuXG5cdFx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRkbGdBZGRDbGllbnQuZGVzdHJveSgpXG5cdFx0fVxuXHR9XG59KVxuXG59KSgpO1xuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgZnJ1aXRzOlsnb3JhbmdlJywgJ2FwcGxlJywgJ2JhbmFuYXMnLCAnbGVtb24nXSxcblx0ICBmYXZvcml0ZUZydWl0OidhcHBsZSdcblx0fVx0XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRcIj48L3NwYW4+PC9wPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnNlbGVjdG1lbnVcIiBcblx0XHRibi12YWw9XCJmYXZvcml0ZUZydWl0XCIgXG5cdFx0Ym4tdXBkYXRlPVwic2VsZWN0bWVudWNoYW5nZVwiIFxuXHRcdGJuLWRhdGE9XCJ7aXRlbXM6IGZydWl0c31cIj5cblx0PC9kaXY+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q4Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdFx0PHA+WW91ciBmYXZvcml0IGZydWl0OiA8c3BhbiBibi10ZXh0PVxcXCJmYXZvcml0ZUZydWl0XFxcIj48L3NwYW4+PC9wPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuc2VsZWN0bWVudVxcXCIgYm4tdmFsPVxcXCJmYXZvcml0ZUZydWl0XFxcIiBibi11cGRhdGU9XFxcInNlbGVjdG1lbnVjaGFuZ2VcXFwiIGJuLWRhdGE9XFxcIntpdGVtczogW1xcJ29yYW5nZVxcJywgXFwnYXBwbGVcXCcsIFxcJ2JhbmFuYXNcXCcsIFxcJ2xlbW9uXFwnXX1cXFwiPlxcblx0XHRcdFxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGZhdm9yaXRlRnJ1aXQ6J2FwcGxlJyxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0ICBcblx0XHRcdH1cdFx0XHRcblx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgIGNsaWVudHM6W1xuXHQgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fSxcblx0ICAgICB7bmFtZTogJ0x1Y2FzJywgYWdlOiAyMn0sXG5cdCAgICAge25hbWU6ICdRdWVudGluJywgYWdlOiAxNX0sXG5cdCAgICAge25hbWU6ICdMYXVyZW50JywgYWdlOiAzMn1cblx0ICAgXSxcblx0ICAgZmlsdGVyOicnLFxuXHQgICBnZXRGaWx0ZXJlZENsaWVudHM6IGZ1bmN0aW9uKCkge1xuXHQgICAgIHJldHVybiB0aGlzLmNsaWVudHMuZmlsdGVyKChjbGllbnQpID0+IHtcblx0ICAgICAgIHJldHVybiBjbGllbnQubmFtZS5zdGFydHNXaXRoKHRoaXMuZmlsdGVyKVxuXHQgICAgIH0pXG5cdCAgIH0gICAgXG5cblx0IH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZmlsdGVyIGJ5IG5hbWVcIiBibi12YWw9XCJmaWx0ZXJcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8dGFibGU+XG5cdCAgPHRoZWFkPlxuXHQgICAgPHRyPlxuXHQgICAgICA8dGg+TmFtZTwvdGg+XG5cdCAgICAgIDx0aD5BZ2U8L3RoPlxuXHQgICAgPC90cj5cblx0ICA8L3RoZWFkPlxuXHQgIDx0Ym9keSBibi1lYWNoPVwiZ2V0RmlsdGVyZWRDbGllbnRzXCI+XG5cdCAgICA8dHI+XG5cdCAgICAgIDx0ZCBibi10ZXh0PVwiJGkubmFtZVwiPjwvdGQ+XG5cdCAgICAgIDx0ZCBibi10ZXh0PVwiJGkuYWdlXCI+PC90ZD5cblx0ICAgIDwvdHI+XG5cdCAgPC90Ym9keT5cblx0ICAgXG5cdDwvdGFibGU+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q5Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuICA8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcbiAgICA8aDI+Q2xpZW50czwvaDI+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiZmlsdGVyIGJ5IG5hbWVcXFwiIGJuLXZhbD1cXFwiZmlsdGVyXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG4gICAgPHRhYmxlPlxcbiAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxcbiAgICAgICAgICA8dGg+QWdlPC90aD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgPC90aGVhZD5cXG4gICAgICA8dGJvZHkgYm4tZWFjaD1cXFwiZ2V0RmlsdGVyZWRDbGllbnRzXFxcIj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgPHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5uYW1lXFxcIj48L3RkPlxcbiAgICAgICAgICA8dGQgYm4tdGV4dD1cXFwiJHNjb3BlLiRpLmFnZVxcXCI+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgPC90Ym9keT5cXG4gICAgICAgXFxuICAgIDwvdGFibGU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcbiAgICA8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG4gIDwvZGl2PlxcbiAgPGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuICAgIDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG4gIDwvZGl2PiAgXFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgY2xpZW50czpbXG5cdFx0XHQgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH0sXG5cdFx0XHQgICAgIHtuYW1lOiAnTHVjYXMnLCBhZ2U6IDIyfSxcblx0XHRcdCAgICAge25hbWU6ICdRdWVudGluJywgYWdlOiAxNX0sXG5cdFx0XHQgICAgIHtuYW1lOiAnTGF1cmVudCcsIGFnZTogMzJ9XG5cdFx0XHQgICBdLFxuXHRcdFx0ICAgZmlsdGVyOicnLFxuXHRcdFx0ICAgZ2V0RmlsdGVyZWRDbGllbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdCAgICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoKGNsaWVudCkgPT4ge1xuXHRcdFx0ICAgICAgIHJldHVybiBjbGllbnQubmFtZS5zdGFydHNXaXRoKHRoaXMuZmlsdGVyKTtcblx0XHRcdCAgICAgfSlcblxuXHRcdFx0ICAgfSxcblx0XHRcdCAgIGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcblxuXG5cdFx0XHQgfVxuXG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG5cblxuIl19
