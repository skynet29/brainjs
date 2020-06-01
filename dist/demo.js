
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
				<td bn-text="$scope.$i.name"></td>
				<td bn-text="$scope.$i.city"></td>
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
		<li bn-text="$scope.$i"></li>
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
		<li bn-text="$scope.$i"></li>
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
				<td bn-text="$scope.$i.name"></td>
				<td bn-text="$scope.$i.age"></td>
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
				<td bn-text="$scope.$i.name"></td>
				<td bn-text="$scope.$i.age"></td>
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
				<td bn-text="$scope.$i.name"></td>
				<td bn-text="$scope.$i.age"></td>
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
	<div bn-control="brainjs.combobox" 
		bn-val="favoriteFruit" 
		bn-update="comboboxchange" 
		bn-data="{items: fruits}">
	</div>
</div>
`

$$.control.registerControl('test8', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Fruits</h2>\n		<p>Your favorit fruit: <span bn-text=\"favoriteFruit\"></span></p>\n		<div bn-control=\"brainjs.combobox\" bn-val=\"favoriteFruit\" bn-update=\"comboboxchange\" bn-data=\"{items: [\'orange\', \'apple\', \'bananas\', \'lemon\']}\">\n			\n		</div>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
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
	      <td bn-text="$scope.$i.name"></td>
	      <td bn-text="$scope.$i.age"></td>
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





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QxMy5qcyIsInRlc3QxNC5qcyIsInRlc3QxNS5qcyIsInRlc3QxNi5qcyIsInRlc3QxNy5qcyIsInRlc3QxOC5qcyIsInRlc3QxOS5qcyIsInRlc3QyLmpzIiwidGVzdDIwLmpzIiwidGVzdDIxLmpzIiwidGVzdDIyLmpzIiwidGVzdDIzLmpzIiwidGVzdDI0LmpzIiwidGVzdDI1LmpzIiwidGVzdDI2LmpzIiwidGVzdDI3LmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImRlbW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZnVuY3Rpb24oKSB7XG5cblx0bGV0IHJvdXRlcyA9IFtcblx0XHR7aHJlZjogJy8nLCByZWRpcmVjdDogJy90ZXN0MSd9XG5cdF1cblx0Zm9yKGxldCBpID0gMTsgaSA8PSAyNzsgaSsrICkge1xuXHRcdHJvdXRlcy5wdXNoKHtcblx0XHRcdGhyZWY6ICcvdGVzdCcgKyBpLCBjb250cm9sOiAndGVzdCcgKyBpXG5cdFx0fSlcblx0fVxuXG5cblxuXHQkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdFx0ZGF0YToge1xuXHRcdFx0cm91dGVzXG5cdFx0fVxuXHR9KVxufSk7XG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJ1xuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxwIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvcD5cdFx0XHRcdFx0XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGN0cmwuc2V0RGF0YShkYXRhKVxuXHRcdH1cblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgcmFkaXVzOjEwXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHN2ZyBoZWlnaHQ9XCIxMDBcIiB3aWR0aD1cIjEwMFwiPlxuXHQgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiBibi1hdHRyPVwie3I6IHJhZGl1c31cIiBzdHJva2U9XCJibGFja1wiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwicmVkXCIgLz5cblx0PC9zdmc+XG5cdCAgXG5cdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBibi12YWw9XCJyYWRpdXNcIiBibi11cGRhdGU9XCJpbnB1dFwiPjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEwJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8c3ZnIGhlaWdodD1cXFwiMTAwXFxcIiB3aWR0aD1cXFwiMTAwXFxcIj5cXG5cdFx0ICA8Y2lyY2xlIGN4PVxcXCI1MFxcXCIgY3k9XFxcIjUwXFxcIiBibi1hdHRyPVxcXCJ7cjogcmFkaXVzfVxcXCIgc3Ryb2tlPVxcXCJibGFja1xcXCIgc3Ryb2tlLXdpZHRoPVxcXCIzXFxcIiBmaWxsPVxcXCJyZWRcXFwiIC8+XFxuXHRcdDwvc3ZnPlxcblx0XHQgIFxcblx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIGJuLXZhbD1cXFwicmFkaXVzXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgcmFkaXVzOjEwLFxuXHRcdFx0ICBodG1sQ29kZSxcblx0XHRcdCAganNDb2RlXG5cdFx0XHR9XG5cdFx0XHQgXG5cblx0XHR9KVxuXHR9XG59KTtcblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJsZScsIHsgICBcbiAgICBwcm9wczoge1xuICAgIFx0Y2xpZW50czogW11cbiAgICB9LFxuICAgIHRlbXBsYXRlOiAkKCcjdGVtcGxhdGUnKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbHQpIHtcbiAgICBcdGNvbnNvbGUubG9nKCdpbml0JywgdGhpcy5wcm9wcylcbiAgICAgIFxuICAgICAgdGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjbGllbnRzOiB0aGlzLnByb3BzLmNsaWVudHNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgIH0gXG4gIH1cbilcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0ICBteUNsaWVudHM6IFtcblx0ICAgIHtuYW1lOiAnUXVlbnRpbicsIGNpdHk6ICdSZW5uZXMnfSxcblx0ICAgIHtuYW1lOiAnTWFyYycsIGNpdHk6ICdCZXRodW5lJ31cblx0ICBdLFxuXHQgIG15Q2xpZW50czI6IFtcblx0ICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBjaXR5OiAnTGUgTWFucyd9LFxuXHQgICAge25hbWU6ICdHZW9yZ2VzJywgY2l0eTogJ1ZlcnF1aW4nfVxuXHQgIF1cblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q3VzdG9tIGNvbnRyb2w8L2gyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJNeVRhYmxlXCIgYm4tZGF0YT1cIntjbGllbnRzOiBteUNsaWVudHN9XCI+PC9kaXY+XG5cdDxocj5cblx0PGRpdiBibi1jb250cm9sPVwiTXlUYWJsZVwiIGJuLWRhdGE9XCJ7Y2xpZW50czogbXlDbGllbnRzMn1cIj48L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRoPk5hbWU8L3RoPlxuXHRcdFx0XHQ8dGg+Q2l0eTwvdGg+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkc2NvcGUuJGkubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJHNjb3BlLiRpLmNpdHlcIj48L3RkPlxuXHRcdFx0PC90cj5cblx0XHQ8L3Rib2R5PlxuXHQ8L3RhYmxlPlx0XG48L2Rpdj5cbmAudHJpbSgpXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdNeVRhYmxlJywgeyAgIFxuICAgIHByb3BzOiB7XG4gICAgXHRjbGllbnRzOiBbXVxuICAgIH0sXG4gICAgdGVtcGxhdGU6IFwiPHRhYmxlPlxcblx0PHRoZWFkPlxcblx0XHQ8dHI+XFxuXHRcdFx0PHRoPk5hbWU8L3RoPlxcblx0XHRcdDx0aD5DaXR5PC90aD5cXG5cdFx0PC90cj5cXG5cdDwvdGhlYWQ+XFxuXFxuXHQ8dGJvZHkgYm4tZWFjaD1cXFwiY2xpZW50c1xcXCI+XFxuXHRcdDx0cj5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiJHNjb3BlLiRpLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5jaXR5XFxcIj48L3RkPlxcblx0XHQ8L3RyPlxcblx0PC90Ym9keT5cXG48L3RhYmxlPlx0XCIsXG4gICAgaW5pdDogZnVuY3Rpb24oZWx0KSB7XG4gICAgXHRjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMucHJvcHMpXG4gICAgICBcbiAgICAgIHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY2xpZW50czogdGhpcy5wcm9wcy5jbGllbnRzXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9IFxuICB9XG4pXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdCAgPGgyPkN1c3RvbSBjb250cm9sPC9oMj5cXG5cdFx0ICA8ZGl2IGJuLWNvbnRyb2w9XFxcIk15VGFibGVcXFwiIGJuLWRhdGE9XFxcIntjbGllbnRzOiBteUNsaWVudHN9XFxcIj48L2Rpdj5cXG5cdFx0ICA8aHI+XFxuXHRcdCAgPGRpdiBibi1jb250cm9sPVxcXCJNeVRhYmxlXFxcIiBibi1kYXRhPVxcXCJ7Y2xpZW50czogbXlDbGllbnRzMn1cXFwiPjwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0ICBteUNsaWVudHM6IFtcblx0XHRcdCAgICB7bmFtZTogJ1F1ZW50aW4nLCBjaXR5OiAnUmVubmVzJ30sXG5cdFx0XHQgICAge25hbWU6ICdNYXJjJywgY2l0eTogJ0JldGh1bmUnfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBteUNsaWVudHMyOiBbXG5cdFx0XHQgICAge25hbWU6ICdCcmlnaXR0ZScsIGNpdHk6ICdMZSBNYW5zJ30sXG5cdFx0XHQgICAge25hbWU6ICdHZW9yZ2VzJywgY2l0eTogJ1ZlcnF1aW4nfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBodG1sQ29kZSxcblx0XHRcdCAganNDb2RlXG5cdFx0XHR9IFxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGZhdm9yaXRlRnJ1aXRzOlsnYXBwbGUnLCAnb3JhbmdlJ10sXG5cdFx0Z2VuZGVyOiAnbWFsZSdcblx0fSBcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2hlY2tncm91cFwiIGJuLXZhbD1cImZhdm9yaXRlRnJ1aXRzXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJvcmFuZ2VcIj5PcmFuZ2Vcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJiYW5hbmFzXCI+QmFuYW5hc1xuXHQgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cImFwcGxlXCI+QXBwbGVcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJsZW1vblwiPkxlbW9uXG5cdDwvZGl2PlxuXG5cdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRzXCI+PC9zcGFuPjwvcD5cblxuXHQ8aDI+R2VuZGVyPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5yYWRpb2dyb3VwXCIgYm4tdmFsPVwiZ2VuZGVyXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJtYWxlXCI+TWFsZVxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cImZlbWFsZVwiPkZlbWFsZVxuXHQ8L2Rpdj5cblx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVwiZ2VuZGVyXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5GcnVpdHM8L2gyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY2hlY2tncm91cFxcXCIgYm4tdmFsPVxcXCJmYXZvcml0ZUZydWl0c1xcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwib3JhbmdlXFxcIj5PcmFuZ2VcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIHZhbHVlPVxcXCJiYW5hbmFzXFxcIj5CYW5hbmFzXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwiYXBwbGVcXFwiPkFwcGxlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwibGVtb25cXFwiPkxlbW9uXFxuXHRcdDwvZGl2Plxcblx0XHRcXG5cdFx0ICA8cD5Zb3VyIGZhdm9yaXQgZnJ1aXRzOiA8c3BhbiBibi10ZXh0PVxcXCJmYXZvcml0ZUZydWl0c1xcXCI+PC9zcGFuPjwvcD5cXG5cXG5cdFx0PGgyPkdlbmRlcjwvaDI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5yYWRpb2dyb3VwXFxcIiBibi12YWw9XFxcImdlbmRlclxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiB2YWx1ZT1cXFwibWFsZVxcXCI+TWFsZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgdmFsdWU9XFxcImZlbWFsZVxcXCI+RmVtYWxlXFxuXHRcdDwvZGl2Plxcblx0XHQ8cD5HZW5kZXI6IDxzcGFuIGJuLXRleHQ9XFxcImdlbmRlclxcXCI+PC9zcGFuPjwvcD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGZhdm9yaXRlRnJ1aXRzOlsnYXBwbGUnLCAnb3JhbmdlJ10sXG5cdFx0XHRcdGdlbmRlcjogJ21hbGUnLFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9IFxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJDdHJsJywge1xuXHR0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJyksXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvJ1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxufSlcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25UYWJBY3RpdmF0ZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRhYkFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldFNlbGVjdGVkVGFiSW5kZXgoKSlcblx0XHR9LFxuXHRcdG9uQWRkVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkVGFiJylcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnPHA+R29vZCBtb3JuaW5nPHA+J1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25BZGRDdHJsVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ3RybFRhYicpXG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRjb250cm9sOiAnTXlUYWJDdHJsJ1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25TaG93VGFiSW5mbzogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnN0IGNvdW50ID0gY3RybC5zY29wZS50YWJzLmdldFRhYnNDb3VudCgpXG5cdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRjb25zdCB0aXRsZSA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJJbmZvKHNlbElkeCkudGl0bGVcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBcXGBcblx0XHRcdFx0PHA+VGFic0NvdW50OiBcXCR7Y291bnR9PC9wPlxuXHRcdFx0XHQ8cD5TZWxJbmRleDogXFwke3NlbElkeH08L3A+XG5cdFx0XHRcdDxwPlNlbFRhYiBUaXRsZTogXFwke3RpdGxlfTxwPlxuXHRcdFx0XFxgXG5cdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnR9KVxuXHRcdH0sXG5cdFx0b25SZW1vdmVTZWxUYWI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0Y3RybC5zY29wZS50YWJzLnJlbW92ZVRhYihzZWxJZHgpXG5cdFx0fVxuXHR9XHRcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy50YWJzXCIgYm4taWZhY2U9XCJ0YWJzXCIgYm4tZXZlbnQ9XCJ0YWJzYWN0aXZhdGU6IG9uVGFiQWN0aXZhdGVcIj5cblx0XHQ8ZGl2IHRpdGxlPVwiVGFiIDFcIj5cblx0XHRcdDxwPkhlbGxvIFdvcmxkPC9wPlxuXHRcdDwvZGl2PlxuXHRcdDxkaXYgdGl0bGU9XCJUYWIgMlwiPlxuXHRcdFx0PHA+Qm9uam91ciBsZSBtb25kZTwvcD5cblx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5cdDxicj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jb250cm9sZ3JvdXBcIj5cdFx0XHRcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkVGFiXCI+QWRkIFRhYjwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGRDdHJsVGFiXCI+QWRkIENvbnRyb2wgVGFiPC9idXR0b24+XG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvblNob3dUYWJJbmZvXCI+U2hvdyBUYWIgSW5mbzwvYnV0dG9uPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25SZW1vdmVTZWxUYWJcIj5SZW1vdmUgU2VsIFRhYjwvYnV0dG9uPlxuXHQ8L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibWVzc2FnZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5cbmAudHJpbSgpXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTMtdGFiY3RybCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdj5cXG5cdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi12YWw9XFxcIm1lc3NhZ2VcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cXFwibWVzc2FnZVxcXCI+PC9zcGFuPjwvcD5cdFx0XFxuPC9kaXY+XFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvJ1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxufSlcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiIGJuLWlmYWNlPVxcXCJ0YWJzXFxcIiBibi1ldmVudD1cXFwidGFic2FjdGl2YXRlOiBvblRhYkFjdGl2YXRlXFxcIj5cXG5cdFx0XHQ8ZGl2IHRpdGxlPVxcXCJUYWIgMVxcXCI+XFxuXHRcdFx0XHQ8cD5IZWxsbyBXb3JsZDwvcD5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8ZGl2IHRpdGxlPVxcXCJUYWIgMlxcXCI+XFxuXHRcdFx0XHQ8cD5Cb25qb3VyIGxlIG1vbmRlPC9wPlxcblx0XHRcdDwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdFx0PGJyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY29udHJvbGdyb3VwXFxcIj5cdFx0XHRcXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGRUYWJcXFwiPkFkZCBUYWI8L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGRDdHJsVGFiXFxcIj5BZGQgQ29udHJvbCBUYWI8L2J1dHRvbj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25TaG93VGFiSW5mb1xcXCI+U2hvdyBUYWIgSW5mbzwvYnV0dG9uPlxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblJlbW92ZVNlbFRhYlxcXCI+UmVtb3ZlIFNlbCBUYWI8L2J1dHRvbj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uVGFiQWN0aXZhdGU6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uVGFiQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbkFkZFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRUYWInKVxuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlOiAnPHA+R29vZCBtb3JuaW5nPHA+J1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQWRkQ3RybFRhYjogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDdHJsVGFiJylcblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLnRhYnMuYWRkVGFiKHRhYk5hbWUsIHtcblx0XHRcdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRjb250cm9sOiAndGVzdDEzLXRhYmN0cmwnXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fSxcblx0XHRcdFx0b25TaG93VGFiSW5mbzogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zdCBjb3VudCA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJzQ291bnQoKVxuXHRcdFx0XHRcdGNvbnN0IHNlbElkeCA9IGN0cmwuc2NvcGUudGFicy5nZXRTZWxlY3RlZFRhYkluZGV4KClcblx0XHRcdFx0XHRjb25zdCB0aXRsZSA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJJbmZvKHNlbElkeCkudGl0bGVcblx0XHRcdFx0XHRjb25zdCBjb250ZW50ID0gYFxuXHRcdFx0XHRcdFx0PHA+VGFic0NvdW50OiAke2NvdW50fTwvcD5cblx0XHRcdFx0XHRcdDxwPlNlbEluZGV4OiAke3NlbElkeH08L3A+XG5cdFx0XHRcdFx0XHQ8cD5TZWxUYWIgVGl0bGU6ICR7dGl0bGV9PHA+XG5cdFx0XHRcdFx0YFxuXHRcdFx0XHRcdCQkLnVpLnNob3dBbGVydCh7Y29udGVudH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlU2VsVGFiOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRcdFx0Y3RybC5zY29wZS50YWJzLnJlbW92ZVRhYihzZWxJZHgpXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHQgXG5cdFx0fSlcblxuXHRcdGNvbnNvbGUubG9nKCdzY29wZScsIGN0cmwuc2NvcGUpXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGRhdGU6IG5ldyBEYXRlKDE5NzIsIDAsIDMpXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tY29udHJvbD1cImJyYWluanMuZGF0ZXBpY2tlclwiIGJuLXZhbD1cImRhdGVcIiBibi11cGRhdGU9XCJkYXRlcGlja2VyY2hhbmdlXCI+XG5cdDxwPkRhdGU6IDxzcGFuIGJuLXRleHQ9XCJkYXRlLnRvRGF0ZVN0cmluZygpXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0IFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLWNvbnRyb2w9XFxcImJyYWluanMuZGF0ZXBpY2tlclxcXCIgYm4tdmFsPVxcXCJkYXRlXFxcIiBibi11cGRhdGU9XFxcImRhdGVwaWNrZXJjaGFuZ2VcXFwiPlxcblx0IFx0PHA+RGF0ZTogPHNwYW4gYm4tdGV4dD1cXFwidG9EYXRlU3RyaW5nXFxcIj48L3NwYW4+PC9wPlxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRkYXRlOiBuZXcgRGF0ZSgxOTcyLCAwLCAzKSxcblx0XHRcdFx0dG9EYXRlU3RyaW5nOiBmdW5jdGlvbigpIHtyZXR1cm4gdGhpcy5kYXRlLnRvRGF0ZVN0cmluZygpfSxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdH0sXG5cdFx0IFxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRpc1N0YXJ0ZWQ6IGZhbHNlXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y3RybC5zZXREYXRhKHtpc1N0YXJ0ZWQ6IHRydWV9KVxuXHRcdFx0Y3RybC5zY29wZS5jYW1lcmEuc3RhcnQoKVxuXHRcdH0sXG5cdFx0b25UYWtlUGljdHVyZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UYWtlUGljdHVyZScpXG5cdFx0XHR2YXIgdXJsID0gY3RybC5zY29wZS5jYW1lcmEudGFrZVBpY3R1cmUoKVxuXHRcdFx0dmFyIGNvbnRlbnQgPSBcXGA8aW1nIHNyYz1cIlxcJHt1cmx9XCI+XFxgXG5cdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnQsIHdpZHRoOiAnYXV0byd9KVxuXHRcdH1cdFx0XHRcblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25TdGFydFwiIGJuLXNob3c9XCIhaXNTdGFydGVkXCI+U3RhcnQ8L2J1dHRvbj5cblx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvblRha2VQaWN0dXJlXCIgYm4tc2hvdz1cImlzU3RhcnRlZFwiPlRha2UgUGljdHVyZTwvYnV0dG9uPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmNhbWVyYVwiIGJuLWlmYWNlPVwiY2FtZXJhXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uU3RhcnRcXFwiIGJuLXNob3c9XFxcIiFpc1N0YXJ0ZWRcXFwiPlN0YXJ0PC9idXR0b24+XFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblRha2VQaWN0dXJlXFxcIiBibi1zaG93PVxcXCJpc1N0YXJ0ZWRcXFwiPlRha2UgUGljdHVyZTwvYnV0dG9uPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY2FtZXJhXFxcIiBibi1pZmFjZT1cXFwiY2FtZXJhXFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGlzU3RhcnRlZDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25TdGFydDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y3RybC5zZXREYXRhKHtpc1N0YXJ0ZWQ6IHRydWV9KVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUuY2FtZXJhLnN0YXJ0KClcblx0XHRcdFx0fSxcblx0XHRcdFx0b25UYWtlUGljdHVyZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uVGFrZVBpY3R1cmUnKVxuXHRcdFx0XHRcdHZhciB1cmwgPSBjdHJsLnNjb3BlLmNhbWVyYS50YWtlUGljdHVyZSgpXG5cdFx0XHRcdFx0dmFyIGNvbnRlbnQgPSBgPGltZyBzcmM9XCIke3VybH1cIj5gXG5cdFx0XHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50LCB3aWR0aDogJ2F1dG8nfSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCBcblx0XHR9KVxuXG5cdFx0dGhpcy5jdHJsID0gY3RybFxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHsgXG5cdFx0c291cmNlOiBbXG5cdFx0XHR7dGl0bGU6ICdOb2RlIDEnLCBmb2xkZXI6IHRydWUsIGNoaWxkcmVuOiBbXG5cdFx0XHRcdHt0aXRsZTogJ05vZGUgMS4xJ30sXG5cdFx0XHRcdHt0aXRsZTogJ05vZGUgMS4yJ31cblx0XHRcdF19LFxuXHRcdFx0e3RpdGxlOiAnTm9kZSAyJ31cblx0XHRdLFxuXHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnLCBpY29uOiAnZWRpdCd9LFxuXHRcdFx0Y3V0OiB7bmFtZTogJ0N1dCcsIGljb246ICdjdXQnfVxuXHRcdH1cdFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uVHJlZUFjdGl2YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVBY3RpdmF0ZScsICQodGhpcykuaWZhY2UoKS5nZXRBY3RpdmVOb2RlKCkudGl0bGUpXG5cdFx0fSxcblx0XHRvblRyZWVDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGFjdGlvbikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uVHJlZUNvbnRleHRNZW51JywgYWN0aW9uKVxuXHRcdH0sXG5cdFx0b25BZGROb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IGFjdGl2ZU5vZGUgPSBjdHJsLnNjb3BlLnRyZWUuZ2V0QWN0aXZlTm9kZSgpXG5cdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgTm9kZScsIGxhYmVsOiAnTm9kZSB0aXRsZSd9LCBmdW5jdGlvbih0aXRsZSkge1xuXHRcdFx0XHRcblx0XHRcdFx0YWN0aXZlTm9kZS5hZGROb2RlKHt0aXRsZX0pXG5cdFx0XHRcdGFjdGl2ZU5vZGUuc2V0RXhwYW5kZWQodHJ1ZSlcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRvblJlbW92ZVNlbE5vZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdGlmIChhY3RpdmVOb2RlID09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRhY3RpdmVOb2RlLnJlbW92ZSgpXG5cdFx0fVxuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMudHJlZVwiIFxuXHRcdGJuLWRhdGE9XCJ7c291cmNlLCBjb250ZXh0TWVudX1cIiBcblx0XHRibi1ldmVudD1cInRyZWVhY3RpdmF0ZTogb25UcmVlQWN0aXZhdGUsIHRyZWVjb250ZXh0bWVudTogb25UcmVlQ29udGV4dE1lbnVcIiBcblx0XHRibi1pZmFjZT1cInRyZWVcIj48L2Rpdj5cblx0PGJyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmNvbnRyb2xncm91cFwiPlxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGROb2RlXCI+QWRkIE5vZGU8L2J1dHRvbj5cblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uUmVtb3ZlU2VsTm9kZVwiPlJlbW92ZSBTZWxOb2RlPC9idXR0b24+XHRcdFx0XHRcblx0PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxNicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRyZWVcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcIntzb3VyY2UsIGNvbnRleHRNZW51fVxcXCIgXFxuXHRcdFx0Ym4tZXZlbnQ9XFxcInRyZWVhY3RpdmF0ZTogb25UcmVlQWN0aXZhdGUsIHRyZWVjb250ZXh0bWVudTogb25UcmVlQ29udGV4dE1lbnVcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJ0cmVlXFxcIj48L2Rpdj5cXG5cdFx0PGJyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY29udHJvbGdyb3VwXFxcIj5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGROb2RlXFxcIj5BZGQgTm9kZTwvYnV0dG9uPlxcblx0XHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvblJlbW92ZVNlbE5vZGVcXFwiPlJlbW92ZSBTZWxOb2RlPC9idXR0b24+XHRcdFx0XHRcXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRzb3VyY2U6IFtcblx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEnLCBmb2xkZXI6IHRydWUsIGNoaWxkcmVuOiBbXG5cdFx0XHRcdFx0XHR7dGl0bGU6ICdOb2RlIDEuMSd9LFxuXHRcdFx0XHRcdFx0e3RpdGxlOiAnTm9kZSAxLjInfVxuXHRcdFx0XHRcdF19LFxuXHRcdFx0XHRcdHt0aXRsZTogJ05vZGUgMid9XG5cdFx0XHRcdF0sXG5cblx0XHRcdFx0Y29udGV4dE1lbnU6IHtcblx0XHRcdFx0XHRlZGl0OiB7bmFtZTogJ0VkaXQnLCBpY29uOiAnZWRpdCd9LFxuXHRcdFx0XHRcdGN1dDoge25hbWU6ICdDdXQnLCBpY29uOiAnY3V0J31cblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uVHJlZUFjdGl2YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UcmVlQWN0aXZhdGUnLCAkKHRoaXMpLmlmYWNlKCkuZ2V0QWN0aXZlTm9kZSgpLnRpdGxlKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblRyZWVDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGFjdGlvbikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblRyZWVDb250ZXh0TWVudScsIGFjdGlvbilcblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGROb2RlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBhY3RpdmVOb2RlID0gY3RybC5zY29wZS50cmVlLmdldEFjdGl2ZU5vZGUoKVxuXHRcdFx0XHRcdGlmIChhY3RpdmVOb2RlID09IG51bGwpIHtcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBOb2RlJywgbGFiZWw6ICdOb2RlIHRpdGxlJ30sIGZ1bmN0aW9uKHRpdGxlKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGFjdGl2ZU5vZGUuYWRkTm9kZSh7dGl0bGV9KVxuXHRcdFx0XHRcdFx0YWN0aXZlTm9kZS5zZXRFeHBhbmRlZCh0cnVlKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlU2VsTm9kZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgYWN0aXZlTm9kZSA9IGN0cmwuc2NvcGUudHJlZS5nZXRBY3RpdmVOb2RlKClcblx0XHRcdFx0XHRpZiAoYWN0aXZlTm9kZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YWN0aXZlTm9kZS5yZW1vdmUoKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQgXG5cdFx0fSlcblxuXHRcdHRoaXMuY3RybCA9IGN0cmxcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbk1hcENsaWNrOiBmdW5jdGlvbihldiwgZGF0YSkge1x0XHRcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgZGF0YSlcblx0XHRcdGNvbnN0IHtsYXRsbmd9ID0gZGF0YVxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoJ21hcmtlcicsIHtsYXRsbmd9KVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2goZSkge1xuXHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnbWFya2VyJywge1xuXHRcdFx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0XHRcdGxhdGxuZ1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25NYXBDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENvbnRleHRNZW51JywgZGF0YSlcblx0XHR9XHRcdFxuXHR9XHRcbn0pXG5cbmN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTEnLCB7XG5cdHR5cGU6ICdtYXJrZXInLFxuXHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40OTF9LFxuXHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ2JsdWUnfSxcblx0cG9wdXBDb250ZW50OiAnSGVsbG8gV29ybGQnLFxuXHRsYXllcjogJ2xheWVyMSdcbn0pXG5cbmN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKCdzaGFwZTInLCB7XG5cdHR5cGU6ICdjaXJjbGUnLFxuXHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRyYWRpdXM6IDEwMCxcblx0c3R5bGU6IHtjb2xvcjogJ3JlZCd9LFxuXHRsYXllcjogJ2xheWVyMidcbn0pXG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgY2xhc3M9XCJtYXBcIiBcblx0XHRibi1kYXRhPVwie1xuXHRcdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LFxuXHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdGxheWVyMToge2xhYmVsOiAnTGF5ZXIgMScsIHZpc2libGU6IHRydWV9LFxuXHRcdFx0XHRsYXllcjI6IHtsYWJlbDogJ0xheWVyIDInLCB2aXNpYmxlOiB0cnVlfVxuXHRcdFx0fSxcblx0XHRcdGNvbnRleHRNZW51OiB7XG5cdFx0XHRcdGVkaXQ6IHtuYW1lOiAnRWRpdCd9LFxuXHRcdFx0XHRzZXA6IHtuYW1lOiAnLS0nfSxcblx0XHRcdFx0Y29weToge25hbWU6ICdDb3B5J31cblx0XHRcdH1cdFx0XHRcblx0XHR9XCIgXG5cdFx0Ym4taWZhY2U9XCJtYXBcIlxuXHRcdGJuLWV2ZW50PVwibWFwY2xpY2s6IG9uTWFwQ2xpY2ssIG1hcGNvbnRleHRtZW51OiBvbk1hcENvbnRleHRNZW51XCJcblx0XHRkYXRhLXNjYWxlPVwidHJ1ZVwiXG5cdFx0ZGF0YS1jb29yZGluYXRlcz1cInRydWVcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE3Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMubWFwXFxcIiBjbGFzcz1cXFwibWFwXFxcIiBcXG5cdFx0XHRibi1kYXRhPVxcXCJ7XFxuXHRcdFx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sXFxuXHRcdFx0XHRsYXllcnM6IHtcXG5cdFx0XHRcdFx0bGF5ZXIxOiB7bGFiZWw6IFxcJ0xheWVyIDFcXCcsIHZpc2libGU6IHRydWV9LFxcblx0XHRcdFx0XHRsYXllcjI6IHtsYWJlbDogXFwnTGF5ZXIgMlxcJywgdmlzaWJsZTogdHJ1ZX1cXG5cdFx0XHRcdH0sXFxuXHRcdFx0XHRjb250ZXh0TWVudToge1xcblx0XHRcdFx0XHRlZGl0OiB7bmFtZTogXFwnRWRpdFxcJ30sXFxuXHRcdFx0XHRcdHNlcDoge25hbWU6IFxcJy0tXFwnfSxcXG5cdFx0XHRcdFx0Y29weToge25hbWU6IFxcJ0NvcHlcXCd9XFxuXHRcdFx0XHR9XHRcdFx0XFxuXHRcdFx0fVxcXCIgXFxuXHRcdFx0Ym4taWZhY2U9XFxcIm1hcFxcXCJcXG5cdFx0XHRibi1ldmVudD1cXFwibWFwY2xpY2s6IG9uTWFwQ2xpY2ssIG1hcGNvbnRleHRtZW51OiBvbk1hcENvbnRleHRNZW51XFxcIlxcblx0XHRcdGRhdGEtc2NhbGU9XFxcInRydWVcXFwiXFxuXHRcdFx0ZGF0YS1jb29yZGluYXRlcz1cXFwidHJ1ZVxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uTWFwQ2xpY2s6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1hcENsaWNrJywgZGF0YSlcblx0XHRcdFx0XHRjb25zdCB7bGF0bG5nfSA9IGRhdGFcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAudXBkYXRlU2hhcGUoJ21hcmtlcicsIHtsYXRsbmd9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnbWFya2VyJywge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0XHRcdFx0bGF0bG5nXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0b25NYXBDb250ZXh0TWVudTogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25NYXBDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0dGhpcy5jdHJsID0gY3RybFxuXG5cdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoJ3NoYXBlMScsIHtcblx0XHRcdHR5cGU6ICdtYXJrZXInLFxuXHRcdFx0bGF0bG5nOiB7bGF0OiA0OC4zOTUsIGxuZzogLTQuNDkxfSxcblx0XHRcdHJvdGF0aW9uQW5nbGU6IDIwLFxuXHRcdFx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ2JsdWUnfSxcblx0XHRcdHBvcHVwQ29udGVudDogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdGxheWVyOiAnbGF5ZXIxJ1xuXHRcdH0pXG5cblx0XHRjdHJsLnNjb3BlLm1hcC5hZGRTaGFwZSgnc2hhcGUyJywge1xuXHRcdFx0dHlwZTogJ2NpcmNsZScsXG5cdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRcdFx0cmFkaXVzOiAxMDAsXG5cdFx0XHRzdHlsZToge2NvbG9yOiAncmVkJ30sXG5cdFx0XHRsYXllcjogJ2xheWVyMidcblx0XHR9KVxuXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sIC8vIEJyZXN0IGNpdHlcblx0XHRwbHVnaW5zOiB7XG5cdFx0XHQnZWRpdG9yJzoge2VkaXRMYXllcjogJ2xheWVyMSd9XG5cdFx0fSxcblx0XHRsYXllcnM6IHtcblx0XHRcdCdsYXllcjEnOiB7dmlzaWJsZTogdHJ1ZX1cblx0XHR9XHRcdFxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvblNoYXBlQ3JlYXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFNoYXBlJywgbGFiZWw6ICdzaGFwZSBpZDonfSwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0ZGF0YS5sYXllciA9ICdsYXllcjEnXG5cdFx0XHRcdGN0cmwuc2NvcGUubWFwLmFkZFNoYXBlKGlkLCBkYXRhKVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25TaGFwZUVkaXRlZDogZnVuY3Rpb24oZXYsIGRhdGEpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRWRpdGVkJywgZGF0YSlcblx0XHR9LFxuXHRcdG9uU2hhcGVEZWxldGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVEZWxldGVkJywgZGF0YSlcblx0XHR9XHRcdFx0XHRcblx0fVx0XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMubWFwXCIgY2xhc3M9XCJtYXBcIiBcblx0XHRibi1kYXRhPVwie2NlbnRlciwgcGx1Z2lucywgbGF5ZXJzfVwiXG5cdFx0Ym4tZXZlbnQ9XCJtYXBzaGFwZWNyZWF0ZWQ6IG9uU2hhcGVDcmVhdGVkLCBtYXBzaGFwZWVkaXRlZDogb25TaGFwZUVkaXRlZCxcblx0XHQgbWFwc2hhcGVkZWxldGVkOiBvblNoYXBlRGVsZXRlZFwiIFxuXHRcdGJuLWlmYWNlPVwibWFwXCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxOCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLm1hcFxcXCIgY2xhc3M9XFxcIm1hcFxcXCIgXFxuXHRcdFx0Ym4tZGF0YT1cXFwie2NlbnRlciwgcGx1Z2lucywgbGF5ZXJzfVxcXCJcXG5cdFx0XHRibi1ldmVudD1cXFwibWFwc2hhcGVjcmVhdGVkOiBvblNoYXBlQ3JlYXRlZCwgbWFwc2hhcGVlZGl0ZWQ6IG9uU2hhcGVFZGl0ZWQsIG1hcHNoYXBlZGVsZXRlZDogb25TaGFwZURlbGV0ZWRcXFwiIFxcblx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiPjwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGNlbnRlcjoge2xhdDogNDguMzksIGxuZzogLTQuNDg2fSxcblx0XHRcdFx0cGx1Z2luczoge1xuXHRcdFx0XHRcdCdlZGl0b3InOiB7ZWRpdExheWVyOiAnbGF5ZXIxJ31cblx0XHRcdFx0fSxcblx0XHRcdFx0bGF5ZXJzOiB7XG5cdFx0XHRcdFx0J2xheWVyMSc6IHt2aXNpYmxlOiB0cnVlfVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uU2hhcGVDcmVhdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFNoYXBlJywgbGFiZWw6ICdzaGFwZSBpZDonfSwgZnVuY3Rpb24oaWQpIHtcblx0XHRcdFx0XHRcdGRhdGEubGF5ZXIgPSAnbGF5ZXIxJ1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS5tYXAuYWRkU2hhcGUoaWQsIGRhdGEpXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblNoYXBlRWRpdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvblNoYXBlRWRpdGVkJywgZGF0YSlcblx0XHRcdFx0fSxcblx0XHRcdFx0b25TaGFwZURlbGV0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uU2hhcGVEZWxldGVkJywgZGF0YSlcblx0XHRcdFx0fVx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJylcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmh0bWxlZGl0b3JcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE5Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuaHRtbGVkaXRvclxcXCI+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGh0bWxDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJyxcblx0XHR0b1VwcGVyOiBmdW5jdGlvbigpIHtyZXR1cm4gdGhpcy5tZXNzYWdlLnRvVXBwZXJDYXNlKCl9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiBibi12YWw9XCJtZXNzYWdlXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cInRvVXBwZXJcIj48L3NwYW4+PC9wPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgYm4tdmFsPVxcXCJtZXNzYWdlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG5cdFx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cXFwidG9VcHBlclxcXCI+PC9zcGFuPjwvcD5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdFx0dG9VcHBlcjogZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMubWVzc2FnZS50b1VwcGVyQ2FzZSgpfSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0Y3RybC5zZXREYXRhKGRhdGEpXG5cdFx0fVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRzaXplOiA1MCxcblx0XHRuYW1lOiAnJ1xuXHR9XHRcbn0pXHRcbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGRpdj5cblx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMjBcIiBtYXg9XCIxMDBcIiBibi12YWw9XCJzaXplXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48YnI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibmFtZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XHRcblx0PC9kaXY+XG5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5taWxzeW1ib2xcIlxuXHRcdGJuLWRhdGE9XCJ7c2l6ZSwgbmFtZSwgc2lkYzogJ1NGRy1VQ0ktLS0tRCd9PjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjAnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXY+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBtaW49XFxcIjIwXFxcIiBtYXg9XFxcIjEwMFxcXCIgYm4tdmFsPVxcXCJzaXplXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLXZhbD1cXFwibmFtZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XHRcXG5cdFx0PC9kaXY+XFxuXFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5taWxzeW1ib2xcXFwiIGJuLWRhdGE9XFxcIntzaXplLCBuYW1lLCBzaWRjOiBcXCdTRkctVUNJLS0tLURcXCd9XFxcIj48L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHNpemU6IDUwLFxuXHRcdFx0XHRuYW1lOiAnJyxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRodG1sQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGN0cmwuc2V0RGF0YShkYXRhKVxuXHRcdH1cblxuXHR9XG59KVxuXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRncmlkQ29sdW1uczogW1xuXHRcdFx0J25hbWUnLCBcblx0XHRcdHtuYW1lOiAnbG9jYXRpb24nLCBsYWJlbDogJ0xvY2F0aW9uJ30sXG5cdFx0XHR7bGFiZWw6ICdBY3Rpb24nLCBidXR0b25zOiBbXG5cdFx0XHRcdFx0e2NtZDogJ2RlbGV0ZScsIHRpdGxlOiAnRGVsZXRlJywgaWNvbjogJ2ZhIGZhLXRyYXNoJ30sXG5cdFx0XHRcdFx0e2NtZDogJ2VkaXQnLCB0aXRsZTogJ0VkaXQnLCBpY29uOiAnZmEgZmEtcGVuY2lsLWFsdCd9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHRdLFx0XHRcblx0XHRncmlkRGF0YTogW1xuXHRcdCAgIHsgbmFtZTogJ0FtZXJpY2FuIGFsbGlnYXRvcicsIGxvY2F0aW9uOiAnU291dGhlYXN0IFVuaXRlZCBTdGF0ZXMnIH0sXG5cdFx0ICAgeyBuYW1lOiAnQ2hpbmVzZSBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ0Vhc3Rlcm4gQ2hpbmEnIH0sXG5cdFx0ICAgeyBuYW1lOiAnU3BlY3RhY2xlZCBjYWltYW4nLCBsb2NhdGlvbjogJ0NlbnRyYWwgJiBTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0Jyb2FkLXNub3V0ZWQgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0phY2Fyw6kgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdCAgIHsgbmFtZTogJ0JsYWNrIGNhaW1hbicsIGxvY2F0aW9uOiAnU291dGggQW1lcmljYScgfVxuXHRcdCBdLFxuXHRcdCBmaWx0ZXJzOiB7bG9jYXRpb246ICdTJywgbmFtZTogJyd9XG5cblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25GaWx0ZXJDaGFuZ2U6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zdCBmID0gJCh0aGlzKS5kYXRhKCdmaWx0ZXInKVxuXHRcdFx0Y3RybC5tb2RlbC5maWx0ZXJzW2ZdID0gJCh0aGlzKS52YWwoKVxuXHRcdFx0Y3RybC51cGRhdGUodGhpcylcblx0XHR9LFxuXHRcdG9uVGFibGVDbWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25UYWJsZUNtZCcsIGRhdGEpXG5cdFx0fVx0XHRcblx0fVx0XG59KVx0XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgYm4tZXZlbnQ9XCJpbnB1dC5maWx0ZXI6IG9uRmlsdGVyQ2hhbmdlXCI+XG5cdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lIGZpbHRlclwiIGJuLXZhbD1cImZpbHRlcnMubmFtZVwiIFxuXHRcdFx0ZGF0YS1maWx0ZXI9XCJuYW1lXCIgY2xhc3M9XCJmaWx0ZXJcIj5cblxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibG9jYXRpb24gZmlsdGVyXCIgYm4tdmFsPVwiZmlsdGVycy5sb2NhdGlvblwiXHRcdFx0XG5cdFx0XHRkYXRhLWZpbHRlcj1cImxvY2F0aW9uXCIgY2xhc3M9XCJmaWx0ZXJcIj5cblxuXHRcdFxuXHQ8L2Rpdj5cblxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRhYmxlXCIgXG5cdFx0Ym4tZGF0YT1cImRhdGE6IGdyaWREYXRhLCBjb2x1bW5zOiBncmlkQ29sdW1ucywgZmlsdGVyczogZmlsdGVyc1wiXG5cdFx0Ym4tZXZlbnQ9XCJ0YWJsZWNtZDogb25UYWJsZUNtZFwiXG5cdFx0PjwvZGl2PlxuPC9kaXY+XG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgYm4tZXZlbnQ9XFxcImlucHV0LmZpbHRlcjogb25GaWx0ZXJDaGFuZ2VcXFwiIGNsYXNzPVxcXCJmaWx0ZXJwYW5lbFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lIGZpbHRlclxcXCIgYm4tdmFsPVxcXCJmaWx0ZXJzLm5hbWVcXFwiIFxcblx0XHRcdFx0ZGF0YS1maWx0ZXI9XFxcIm5hbWVcXFwiIGNsYXNzPVxcXCJmaWx0ZXJcXFwiPlxcblxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibG9jYXRpb24gZmlsdGVyXFxcIiAgYm4tdmFsPVxcXCJmaWx0ZXJzLmxvY2F0aW9uXFxcIlx0XHRcdGRhdGEtZmlsdGVyPVxcXCJsb2NhdGlvblxcXCIgY2xhc3M9XFxcImZpbHRlclxcXCI+XFxuXFxuXHRcdFx0XFxuXHRcdDwvZGl2Plxcblxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFibGVcXFwiIFxcblx0XHRcdGJuLWRhdGE9XFxcIntkYXRhOiBncmlkRGF0YSwgY29sdW1uczogZ3JpZENvbHVtbnMsIGZpbHRlcnM6IGZpbHRlcnN9XFxcIlxcblx0XHRcdGJuLWV2ZW50PVxcXCJ0YWJsZWNtZDogb25UYWJsZUNtZFxcXCJcXG5cdFx0XHQ+PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRncmlkQ29sdW1uczogW1xuXHRcdFx0XHRcdCduYW1lJywgXG5cdFx0XHRcdFx0e25hbWU6ICdsb2NhdGlvbicsIGxhYmVsOiAnTG9jYXRpb24nfSxcblx0XHRcdFx0XHR7bGFiZWw6ICdBY3Rpb24nLCBidXR0b25zOiBbXG5cdFx0XHRcdFx0XHRcdHtjbWQ6ICdkZWxldGUnLCB0aXRsZTogJ0RlbGV0ZScsIGljb246ICdmYSBmYS10cmFzaCd9LFxuXHRcdFx0XHRcdFx0XHR7Y21kOiAnZWRpdCcsIHRpdGxlOiAnRWRpdCcsIGljb246ICdmYSBmYS1wZW5jaWwtYWx0J31cblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9XSxcblx0XHRcdFx0Z3JpZERhdGE6IFtcblx0XHRcdFx0ICAgeyBuYW1lOiAnQW1lcmljYW4gYWxsaWdhdG9yJywgbG9jYXRpb246ICdTb3V0aGVhc3QgVW5pdGVkIFN0YXRlcycgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnQ2hpbmVzZSBhbGxpZ2F0b3InLCBsb2NhdGlvbjogJ0Vhc3Rlcm4gQ2hpbmEnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ1NwZWN0YWNsZWQgY2FpbWFuJywgbG9jYXRpb246ICdDZW50cmFsICYgU291dGggQW1lcmljYScgfSxcblx0XHRcdFx0ICAgeyBuYW1lOiAnQnJvYWQtc25vdXRlZCBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH0sXG5cdFx0XHRcdCAgIHsgbmFtZTogJ0phY2Fyw6kgY2FpbWFuJywgbG9jYXRpb246ICdTb3V0aCBBbWVyaWNhJyB9LFxuXHRcdFx0XHQgICB7IG5hbWU6ICdCbGFjayBjYWltYW4nLCBsb2NhdGlvbjogJ1NvdXRoIEFtZXJpY2EnIH1cblx0XHRcdFx0IF0sXG5cdFx0XHRcdCBmaWx0ZXJzOiB7bG9jYXRpb246ICdTJywgbmFtZTogJyd9LFxuXHRcdFx0XHQganNDb2RlLFxuXHRcdFx0XHQgaHRtbENvZGVcblxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zdCBmID0gJCh0aGlzKS5kYXRhKCdmaWx0ZXInKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkZpbHRlckNoYW5nZScsIGYpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5maWx0ZXJzW2ZdID0gJCh0aGlzKS52YWwoKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKHRoaXMpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uVGFibGVDbWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uVGFibGVDbWQnLCBkYXRhKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG4gICAgfSxcbiAgICBldmVudHM6IHtcbiAgICBcdG9uTWVudVNlbGVjdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuICAgIFx0XHRjb25zb2xlLmxvZygnb25NZW51U2VsZWN0ZWQnLCBkYXRhKVxuICAgIFx0fVxuICAgIH1cdFxufSlcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IHN0eWxlPVwid2lkdGg6MzAwcHg7IGhlaWdodDogMzAwcHg7IGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1wiPlxuXHQgICAgPGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jaXJjdWxhcm1lbnVcIiBcblx0XHQgICAgYm4tZGF0YT1cIntcblx0XHQgICAgXHRyYWRpdXM6IDEyMCxcblx0XHQgICAgXHRpY29uUG9zOiA4MCxcblx0XHQgICAgXHRpbm5lclJhZGl1czogNDAsXG5cdCAgICBcdFx0aXRlbXM6IFtcblx0ICAgIFx0XHQgICB7dGV4dDogJ1xcXFx1ZjAxNScsIGNsYXNzTmFtZTogJ2ZhJywgYWN0aW9uOiAndG90bycsIGNvbG9yOiAncmVkJ30sXG5cdCAgICBcdFx0ICAge3RleHQ6ICdcXFxcdWYwOTknLCBjbGFzc05hbWU6ICdmYWInLCBjb2xvcjogJ2JsdWUnfVxuXHQgICAgXHRcdF0sXG5cdFx0ICAgIFx0dHJpZ2dlclBvczoge2xlZnQ6IDEwMCwgdG9wOiAyMDB9XHRcdCAgICBcdFxuXHRcdCAgICB9XCJcblx0ICAgIFx0Ym4tZXZlbnQ9XCJtZW51U2VsZWN0ZWQ6IG9uTWVudVNlbGVjdGVkXCIgXG5cdCAgICBcdD48L2Rpdj5cblx0PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyMicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdiBzdHlsZT1cXFwid2lkdGg6MzAwcHg7IGhlaWdodDogMzAwcHg7IGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcXCI+XFxuXHRcdCAgICA8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY2lyY3VsYXJtZW51XFxcIiBcXG5cdFx0ICAgIFx0Ym4tZGF0YT1cXFwie1xcblx0XHQgICAgXHRcdHJhZGl1czogMTIwLFxcblx0XHQgICAgXHRcdGljb25Qb3M6IDgwLFxcblx0XHQgICAgXHRcdGlubmVyUmFkaXVzOiA0MCxcXG5cdFx0ICAgIFx0XHRpdGVtczogW1xcblx0XHQgICAgXHRcdCAgIHt0ZXh0OiBcXCdcXFxcdWYwMTVcXCcsIGNsYXNzTmFtZTogXFwnZmFcXCcsIGFjdGlvbjogXFwndG90b1xcJywgY29sb3I6IFxcJ3JlZFxcJ30sXFxuXHRcdCAgICBcdFx0ICAge3RleHQ6IFxcJ1xcXFx1ZjA5OVxcJywgY2xhc3NOYW1lOiBcXCdmYWJcXCcsIGNvbG9yOiBcXCdibHVlXFwnfVxcblx0XHQgICAgXHRcdF0sXFxuXHRcdCAgICBcdFx0dHJpZ2dlclBvczoge2xlZnQ6IDEwMCwgdG9wOiAyMDB9XHRcdCAgICBcdFxcblx0XHQgICAgXHR9XFxcIlxcblx0XHQgICAgXHRibi1ldmVudD1cXFwibWVudVNlbGVjdGVkOiBvbk1lbnVTZWxlY3RlZFxcXCIgXFxuXHRcdCAgICBcdD48L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdCAgICAgICAganNDb2RlLFxuXHRcdCAgICAgICAgaHRtbENvZGVcblx0XHQgICAgfSxcblx0XHQgICAgZXZlbnRzOiB7XG5cdFx0ICAgIFx0b25NZW51U2VsZWN0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0ICAgIFx0XHRjb25zb2xlLmxvZygnb25NZW51U2VsZWN0ZWQnLCBkYXRhKVxuXHRcdCAgICBcdH1cblx0XHQgICAgfVxuXHRcdH0pXG5cblx0fVxufSlcblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0fSxcblx0ZXZlbnRzOiB7XG5cblx0XHRvbk1hcFNoYXBlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25NYXBTaGFwZUNvbnRleHRNZW51JywgZGF0YSlcblx0XHRcdGNvbnN0IHtpZCwgcG9zfSA9IGRhdGFcblx0XHRcdGNvbnN0IGluZm8gPSAkKHRoaXMpLmlmYWNlKCkuZ2V0U2hhcGVJbmZvKGlkKVxuXHRcdFx0Y29uc3QgaWR4ID0gY3RybC5zY29wZS5tZW51LnByb3BzLml0ZW1zLmZpbmRJbmRleCgoaXRlbSkgPT4gaXRlbS5jb2xvciA9PSBpbmZvLmljb24uY29sb3IpXG5cdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyhmYWxzZSlcblx0XHRcdGN0cmwuc2NvcGUubWVudS5jbG9zZU1lbnUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuc2VsZWN0KGlkeCkuc2hvd01lbnUocG9zLngsIHBvcy55KVxuXHRcdFx0XHRzZWxTaGFwZSA9IGlkXG5cdFx0XHR9KVxuXG5cdFx0fSxcblxuXHRcdG9uTWVudVNlbGVjdGVkOiBmdW5jdGlvbihldiwgZGF0YSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcblx0XHRcdGN0cmwuc2NvcGUubWFwLnVwZGF0ZVNoYXBlKHNlbFNoYXBlLCB7aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogZGF0YS5jb2xvcn19KVxuXHRcdH0sXG5cblx0XHRvbk1lbnVDbG9zZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uTWVudUNsb3NlZCcpXG5cdFx0XHRjdHJsLnNjb3BlLm1hcC5lbmFibGVIYW5kbGVycyh0cnVlKVxuXHRcdH1cblx0fVx0XG59KVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGNsYXNzPVwibWFwXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7XCI+XG5cdFx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5tYXBcIiBzdHlsZT1cImhlaWdodDogMTAwJVwiIFxuXHRcdFx0Ym4tZGF0YT1cIntcblx0XHRcdFx0Y2VudGVyOiB7bGF0OiA0OC4zOSwgbG5nOiAtNC40ODZ9LFxuXHRcdCAgICAgICAgc2hhcGVzOiB7XG5cdFx0XHRcdFx0c2hhcGUxOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiAnbWFya2VyJyxcblx0XHRcdFx0XHRcdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ5MX0sXG5cdFx0XHRcdFx0XHRyb3RhdGlvbkFuZ2xlOiAyMCxcblx0XHRcdFx0XHRcdGljb246IHt0eXBlOiAnYWlzJywgY29sb3I6ICdibHVlJ31cblx0XHRcdFx0XHR9LFx0ICAgICAgICBcdFxuXHRcdFx0XHRcdHNoYXBlMjoge1xuXHRcdFx0XHRcdFx0dHlwZTogJ21hcmtlcicsXG5cdFx0XHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxuXHRcdFx0XHRcdFx0aWNvbjoge3R5cGU6ICdhaXMnLCBjb2xvcjogJ3JlZCd9LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0c2NhbGU6IHRydWUsXG5cdFx0XHRcdFx0Y29vcmRpbmF0ZXM6IHRydWVcdFx0XHRcdFx0XG5cdFx0ICAgICAgICB9XHRcdFx0XHRcdFxuXHRcdFx0fVwiIFxuXHRcdFx0Ym4taWZhY2U9XCJtYXBcIlxuXHRcdFx0Ym4tZXZlbnQ9XCJtYXBzaGFwZWNvbnRleHRtZW51OiBvbk1hcFNoYXBlQ29udGV4dE1lbnVcIlxuXHRcdFx0PjwvZGl2PlxuXG5cdFx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jaXJjdWxhcm1lbnVcIlxuXHRcdFx0c3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7dG9wOiAtMTAwJVwiIFxuXHRcdFx0Ym4tZXZlbnQ9XCJtZW51U2VsZWN0ZWQ6IG9uTWVudVNlbGVjdGVkLCBtZW51Q2xvc2VkOiBvbk1lbnVDbG9zZWRcIiBcblx0XHRcdGJuLWRhdGE9XCJ7XG5cdFx0XHRcdGl0ZW1zOiBbXG5cdFx0XHRcdCAgICB7dGV4dDogJ1JlZCcsIGNvbG9yOiAncmVkJ30sXG5cdFx0XHRcdCAgICB7dGV4dDogJ0JsdWUnLCBjb2xvcjogJ2JsdWUnfSxcblx0XHRcdFx0ICAgIHt0ZXh0OiAnR3JlZW4nLCBjb2xvcjogJ2dyZWVuJ30sXG5cdFx0XHRcdCAgICB7dGV4dDogJ0JsYWNrJywgY29sb3I6ICdibGFjayd9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdHJhZGl1czogODAsXG5cdFx0XHRcdGlubmVyUmFkaXVzOiAyMCxcblx0XHRcdFx0aWNvblBvczogNTAsXG5cdFx0XHRcdGhhc1RyaWdnZXI6IGZhbHNlXG5cdFx0XHR9XCJcblx0XHRcdGJuLWlmYWNlPVwibWVudVwiPjwvZGl2PlxuXHRcdFxuXHQ8L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG5sZXQgc2VsU2hhcGUgPSBcIlwiXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MjMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxkaXYgY2xhc3M9XFxcIm1hcFxcXCIgc3R5bGU9XFxcInBvc2l0aW9uOiByZWxhdGl2ZTtcXFwiPlxcblx0XHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5tYXBcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6IDEwMCVcXFwiIFxcblx0XHRcdFx0Ym4tZGF0YT1cXFwie1xcblx0XHRcdFx0XHRjZW50ZXI6IHtsYXQ6IDQ4LjM5LCBsbmc6IC00LjQ4Nn0sXFxuXHRcdFx0ICAgICAgICBzaGFwZXM6IHtcXG5cdFx0XHRcdFx0XHRzaGFwZTE6IHtcXG5cdFx0XHRcdFx0XHRcdHR5cGU6IFxcJ21hcmtlclxcJyxcXG5cdFx0XHRcdFx0XHRcdGxhdGxuZzoge2xhdDogNDguMzk1LCBsbmc6IC00LjQ5MX0sXFxuXHRcdFx0XHRcdFx0XHRyb3RhdGlvbkFuZ2xlOiAyMCxcXG5cdFx0XHRcdFx0XHRcdGljb246IHt0eXBlOiBcXCdhaXNcXCcsIGNvbG9yOiBcXCdibHVlXFwnfVxcblx0XHRcdFx0XHRcdH0sXHQgICAgICAgIFx0XFxuXHRcdFx0XHRcdFx0c2hhcGUyOiB7XFxuXHRcdFx0XHRcdFx0XHR0eXBlOiBcXCdtYXJrZXJcXCcsXFxuXHRcdFx0XHRcdFx0XHRsYXRsbmc6IHtsYXQ6IDQ4LjM5NSwgbG5nOiAtNC40NzF9LFxcblx0XHRcdFx0XHRcdFx0aWNvbjoge3R5cGU6IFxcJ2Fpc1xcJywgY29sb3I6IFxcJ3JlZFxcJ30sXFxuXHRcdFx0XHRcdFx0fVxcblx0XHRcdCAgICAgICAgfSxcXG5cdFx0XHQgICAgICAgIHNjYWxlOiB0cnVlLFxcblx0XHRcdCAgICAgICAgY29vcmRpbmF0ZXM6IHRydWVcdFx0XHRcdFx0XFxuXHRcdFx0XHR9XFxcIiBcXG5cdFx0XHRcdGJuLWlmYWNlPVxcXCJtYXBcXFwiXFxuXHRcdFx0XHRibi1ldmVudD1cXFwibWFwc2hhcGVjb250ZXh0bWVudTogb25NYXBTaGFwZUNvbnRleHRNZW51XFxcIlxcblx0XHRcdFx0PjwvZGl2Plxcblxcblx0XHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5jaXJjdWxhcm1lbnVcXFwiXFxuXHRcdFx0XHRzdHlsZT1cXFwicG9zaXRpb246IHJlbGF0aXZlO3RvcDogLTEwMCVcXFwiIFxcblx0XHRcdFx0Ym4tZXZlbnQ9XFxcIm1lbnVTZWxlY3RlZDogb25NZW51U2VsZWN0ZWQsIG1lbnVDbG9zZWQ6IG9uTWVudUNsb3NlZFxcXCIgXFxuXHRcdFx0XHRibi1kYXRhPVxcXCJ7XFxuXHRcdFx0XHRcdGl0ZW1zOiBbXFxuXHRcdFx0XHRcdCAgICB7dGV4dDogXFwnUmVkXFwnLCBjb2xvcjogXFwncmVkXFwnfSxcXG5cdFx0XHRcdFx0ICAgIHt0ZXh0OiBcXCdCbHVlXFwnLCBjb2xvcjogXFwnYmx1ZVxcJ30sXFxuXHRcdFx0XHRcdCAgICB7dGV4dDogXFwnR3JlZW5cXCcsIGNvbG9yOiBcXCdncmVlblxcJ30sXFxuXHRcdFx0XHRcdCAgICB7dGV4dDogXFwnQmxhY2tcXCcsIGNvbG9yOiBcXCdibGFja1xcJ31cXG5cdFx0XHRcdFx0XSxcXG5cdFx0XHRcdFx0cmFkaXVzOiA4MCxcXG5cdFx0XHRcdFx0aW5uZXJSYWRpdXM6IDIwLFxcblx0XHRcdFx0XHRpY29uUG9zOiA1MCxcXG5cdFx0XHRcdFx0aGFzVHJpZ2dlcjogZmFsc2VcXG5cdFx0XHRcdH1cXFwiXFxuXHRcdFx0XHRibi1pZmFjZT1cXFwibWVudVxcXCI+PC9kaXY+XFxuXHRcdFx0XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblxuXHRcdFx0XHRvbk1hcFNoYXBlQ29udGV4dE1lbnU6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uTWFwU2hhcGVDb250ZXh0TWVudScsIGRhdGEpXG5cdFx0XHRcdFx0Y29uc3Qge2lkLCBwb3N9ID0gZGF0YVxuXHRcdFx0XHRcdGNvbnN0IGluZm8gPSAkKHRoaXMpLmlmYWNlKCkuZ2V0U2hhcGVJbmZvKGlkKVxuXHRcdFx0XHRcdGNvbnN0IGlkeCA9IGN0cmwuc2NvcGUubWVudS5wcm9wcy5pdGVtcy5maW5kSW5kZXgoKGl0ZW0pID0+IGl0ZW0uY29sb3IgPT0gaW5mby5pY29uLmNvbG9yKVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLmVuYWJsZUhhbmRsZXJzKGZhbHNlKVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUubWVudS5jbG9zZU1lbnUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNlbGVjdChpZHgpLnNob3dNZW51KHBvcy54LCBwb3MueSlcblx0XHRcdFx0XHRcdHNlbFNoYXBlID0gaWRcblx0XHRcdFx0XHR9KVxuXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0b25NZW51U2VsZWN0ZWQ6IGZ1bmN0aW9uKGV2LCBkYXRhKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uTWVudVNlbGVjdGVkJywgZGF0YSlcblx0XHRcdFx0XHRjdHJsLnNjb3BlLm1hcC51cGRhdGVTaGFwZShzZWxTaGFwZSwge2ljb246IHt0eXBlOiAnYWlzJywgY29sb3I6IGRhdGEuY29sb3J9fSlcblx0XHRcdFx0fSxcblxuXHRcdFx0XHRvbk1lbnVDbG9zZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbk1lbnVDbG9zZWQnKVxuXHRcdFx0XHRcdGN0cmwuc2NvcGUubWFwLmVuYWJsZUhhbmRsZXJzKHRydWUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRyb2xsOiAxMCxcblx0XHRwaXRjaDogMTAsXG5cdFx0YWx0aXR1ZGU6IDUwLFxuXHRcdHNwZWVkOiA1XG5cdH1cdFxufSlcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2PlxuXHRcdDxkaXYgY2xhc3M9XCJyYW5nZWlucHV0XCI+XG5cdFx0XHQ8bGFiZWw+Um9sbDwvbGFiZWw+XHRcdFx0XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTUwXCIgbWF4PVwiNTBcIiBibi12YWw9XCJyb2xsXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48YnI+XG5cdFx0PC9kaXY+XG5cblx0XHQ8ZGl2IGNsYXNzPVwicmFuZ2VpbnB1dFwiPlxuXHRcdFx0PGxhYmVsPlBpdGNoPC9sYWJlbD5cdFx0XHRcblx0XHRcdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCItNDBcIiBtYXg9XCI0MFwiIGJuLXZhbD1cInBpdGNoXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48YnI+XG5cdFx0PC9kaXY+XG5cblx0XHQ8ZGl2IGNsYXNzPVwicmFuZ2VpbnB1dFwiPlxuXHRcdFx0PGxhYmVsPlNwZWVkPC9sYWJlbD5cdFx0XHRcblx0XHRcdDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtYXg9XCIyMDBcIiBibi12YWw9XCJzcGVlZFwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PGJyPlxuXHRcdDwvZGl2PlxuXG5cdFx0PGRpdiBjbGFzcz1cInJhbmdlaW5wdXRcIj5cblx0XHRcdDxsYWJlbD5BbHRpdHVkZTwvbGFiZWw+XHRcdFx0XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgYm4tdmFsPVwiYWx0aXR1ZGVcIiBibi11cGRhdGU9XCJpbnB1dFwiPjxicj5cblx0XHQ8L2Rpdj5cblxuXHQ8L2Rpdj5cblxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLmZsaWdodHBhbmVsXCIgXG5cdFx0Ym4tZGF0YT1cIntyb2xsLCBwaXRjaCwgc3BlZWQsIGFsdGl0dWRlfVwiPlxuXHRcdFxuPC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyNCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGRpdj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVxcXCJyYW5nZWlucHV0XFxcIj5cXG5cdFx0XHRcdDxsYWJlbD5Sb2xsPC9sYWJlbD5cdFx0XHRcXG5cdFx0XHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgbWluPVxcXCItNTBcXFwiIG1heD1cXFwiNTBcXFwiIGJuLXZhbD1cXFwicm9sbFxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PGJyPlxcblx0XHRcdDwvZGl2Plxcblxcblx0XHRcdDxkaXYgY2xhc3M9XFxcInJhbmdlaW5wdXRcXFwiPlxcblx0XHRcdFx0PGxhYmVsPlBpdGNoPC9sYWJlbD5cdFx0XHRcXG5cdFx0XHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgbWluPVxcXCItNDBcXFwiIG1heD1cXFwiNDBcXFwiIGJuLXZhbD1cXFwicGl0Y2hcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPjxicj5cXG5cdFx0XHQ8L2Rpdj5cXG5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVxcXCJyYW5nZWlucHV0XFxcIj5cXG5cdFx0XHRcdDxsYWJlbD5TcGVlZDwvbGFiZWw+XHRcdFx0XFxuXHRcdFx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIG1heD1cXFwiMjAwXFxcIiBibi12YWw9XFxcInNwZWVkXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PC9kaXY+XFxuXFxuXHRcdFx0PGRpdiBjbGFzcz1cXFwicmFuZ2VpbnB1dFxcXCI+XFxuXHRcdFx0XHQ8bGFiZWw+QWx0aXR1ZGU8L2xhYmVsPlx0XHRcdFxcblx0XHRcdFx0PGlucHV0IHR5cGU9XFxcInJhbmdlXFxcIiBibi12YWw9XFxcImFsdGl0dWRlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48YnI+XFxuXHRcdFx0PC9kaXY+XFxuXFxuXHRcdDwvZGl2Plxcblxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuZmxpZ2h0cGFuZWxcXFwiXFxuXHRcdFx0Ym4tZGF0YT1cXFwie3JvbGwsIHBpdGNoLCBzcGVlZCwgYWx0aXR1ZGUsIHNob3dTcGVlZH1cXFwiPlxcblx0XHRcdFx0XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cm9sbDogMTAsXG5cdFx0XHRcdHBpdGNoOiAxMCxcblx0XHRcdFx0YWx0aXR1ZGU6IDUwLFxuXHRcdFx0XHRzcGVlZDogNSxcblx0XHRcdFx0c2hvd1NwZWVkOiB0cnVlLFxuXHRcdFx0XHRqc0NvZGUsXG5cdFx0XHRcdGh0bWxDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0Y3RybC5zZXREYXRhKGRhdGEpXG5cdFx0fVxuXG5cdH1cbn0pXG5cblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdHZhbHVlczogWyA3NSwgMzAwIF0sXG5cdFx0dmFsdWU6IDUwXG5cdH1cdFxufSlcdFxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2ICBzdHlsZT1cInBhZGRpbmc6IDIwcHg7XCI+XG5cdFx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5zbGlkZXJcIiBibi12YWw9XCJ2YWx1ZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PC9kaXY+XHRcblx0XHQ8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTBweDtcIj5cblx0XHRcdDxsYWJlbD5WYWx1ZTwvbGFiZWw+XHRcblx0XHRcdDxzcGFuIGJuLXRleHQ9XCJ2YWx1ZVwiPjwvc3Bhbj5cdFx0XHRcblx0XHQ8L2Rpdj5cblxuXHRcdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuc2xpZGVyXCIgYm4tdmFsPVwidmFsdWVzXCIgYm4tZGF0YT1cInttaW46IDAsIG1heDogNTAwfVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+PC9kaXY+XHRcblx0XHQ8ZGl2PlxuXHRcdFx0PGxhYmVsPlZhbHVlczwvbGFiZWw+XHRcblx0XHRcdDxzcGFuIGJuLXRleHQ9XCJ2YWx1ZXNcIj48L3NwYW4+XHRcdFx0XG5cdFx0PC9kaXY+XG5cblx0PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QyNScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cXG5cdFx0PGRpdiAgc3R5bGU9XFxcInBhZGRpbmc6IDIwcHg7XFxcIj5cXG5cdFx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuc2xpZGVyXFxcIiBibi12YWw9XFxcInZhbHVlXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj48L2Rpdj5cdFxcblx0XHRcdDxkaXYgc3R5bGU9XFxcIm1hcmdpbi1ib3R0b206IDEwcHg7XFxcIj5cXG5cdFx0XHRcdDxsYWJlbD5WYWx1ZTwvbGFiZWw+XHRcXG5cdFx0XHRcdDxzcGFuIGJuLXRleHQ9XFxcInZhbHVlXFxcIj48L3NwYW4+XHRcdFx0XFxuXHRcdFx0PC9kaXY+XFxuXFxuXHRcdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnNsaWRlclxcXCIgYm4tdmFsPVxcXCJ2YWx1ZXNcXFwiIGJuLWRhdGE9XFxcInttaW46IDAsIG1heDogNTAwfVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+PC9kaXY+XHRcXG5cdFx0XHQ8ZGl2Plxcblx0XHRcdFx0PGxhYmVsPlZhbHVlczwvbGFiZWw+XHRcXG5cdFx0XHRcdDxzcGFuIGJuLXRleHQ9XFxcInZhbHVlc1xcXCI+PC9zcGFuPlx0XHRcdFxcblx0XHRcdDwvZGl2Plxcblxcblx0XHQ8L2Rpdj5cXG5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHZhbHVlczogWyA3NSwgMzAwIF0sXG5cdFx0XHRcdHZhbHVlOiA1MCxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0XHRodG1sQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGN0cmwuc2V0RGF0YShkYXRhKVxuXHRcdH1cblxuXHR9XG59KVxuXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0ZGF0YToge1xuXHRcdHZhbHVlOiAwXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uRG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uRG93bmxvYWQnKVxuXHRcdFx0Y3RybC5zZXREYXRhKHt2YWx1ZTogMH0pXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdHNldFRpbWVvdXQoIHByb2dyZXNzLCAyMDAwIClcdFx0XHRcdFxuXHRcdH1cblx0fVxufSlcblxuZnVuY3Rpb24gcHJvZ3Jlc3MoKSB7XG5cbiAgdmFyIHZhbHVlID0gY3RybC5tb2RlbC52YWx1ZSArIDI7XG5cblx0Y3RybC5zZXREYXRhKHt2YWx1ZX0pXG5cbiAgaWYgKCB2YWx1ZSA8IDk5ICkge1xuICAgIHNldFRpbWVvdXQoIHByb2dyZXNzLCA4MCApO1xuICB9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxkaXYgIHN0eWxlPVwicGFkZGluZzogMjBweDtcIj5cblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnByb2dyZXNzYmFyXCIgYm4tdmFsPVwidmFsdWVcIiBibi1kYXRhPSBcIntzaG93UGVyY2VudDogdHJ1ZSwgaW5pdFRleHQ6ICdMb2FkaW5nLi4uJywgY29sb3I6ICdibHVlJ31cIj48L2Rpdj5cdFxuXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cImNsaWNrOiBvbkRvd25sb2FkXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAxMHB4XCI+RG93bmxvYWQ8L2J1dHRvbj5cblxuXHQ8L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDI2Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblxcblx0XHQ8ZGl2ICBzdHlsZT1cXFwicGFkZGluZzogMjBweDtcXFwiPlxcblx0XHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5wcm9ncmVzc2JhclxcXCIgYm4tdmFsPVxcXCJ2YWx1ZVxcXCIgYm4tZGF0YT0gXFxcIntzaG93UGVyY2VudDogdHJ1ZSwgaW5pdFRleHQ6IFxcJ0xvYWRpbmcuLi5cXCcsIGNvbG9yOiBcXCdibHVlXFwnfVxcXCI+PC9kaXY+XHRcXG5cXG5cdFx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25Eb3dubG9hZFxcXCIgc3R5bGU9XFxcIm1hcmdpbi10b3A6IDEwcHhcXFwiPkRvd25sb2FkPC9idXR0b24+XFxuXFxuXHRcdDwvZGl2Plxcblxcblx0PC9kaXY+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0dmFsdWU6IDAsXG5cdFx0XHRcdGpzQ29kZSxcblx0XHRcdFx0aHRtbENvZGVcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25Eb3dubG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uRG93bmxvYWQnKVxuXHRcdFx0XHRcdGN0cmwuc2V0RGF0YSh7dmFsdWU6IDB9KVx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0c2V0VGltZW91dCggcHJvZ3Jlc3MsIDIwMDAgKVx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0ZnVuY3Rpb24gcHJvZ3Jlc3MoKSB7XG5cblx0XHQgIHZhciB2YWx1ZSA9IGN0cmwubW9kZWwudmFsdWUgKyAyO1xuXHRcdFxuXHRcdFx0Y3RybC5zZXREYXRhKHt2YWx1ZX0pXG5cdFx0XG5cdFx0ICBpZiAoIHZhbHVlIDwgOTkgKSB7XG5cdFx0ICAgIHNldFRpbWVvdXQoIHByb2dyZXNzLCA4MCApO1xuXHRcdCAgfVxuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0Y3RybC5zZXREYXRhKGRhdGEpXG5cdFx0fVxuXG5cdH1cbn0pXG5cblxuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgZGxnID0gJCQuZGlhbG9nQ29udHJvbGxlcih7XG5cdHRpdGxlOiAnTXkgV2luZG93Jyxcblx0d2lkdGg6IDQwMCxcblx0aGVpZ2h0OiAzNTAsXG5cdHJlc2l6YWJsZTogZmFsc2UsXG5cdG1vZGFsOiBmYWxzZSxcblx0dGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpLFxuXHRkYXRhOiB7XG5cdFx0ZmF2b3JpdGVGcnVpdDogJ2FwcGxlJyxcblx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXVxuXHR9LFxuXHRidXR0b25zOiBbXG5cdFx0e1xuXHRcdFx0dGV4dDogJ0NsZWFyJywgXG5cdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRsZy5zZXREYXRhKHtjbGllbnRzOiBbXX0pXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHR0ZXh0OiAnQ2xvc2UnLCBcblx0XHRcdGNsaWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGxnLmhpZGUoKVxuXHRcdFx0fVxuXHRcdH1cblx0XVxufSlcblxuZGxnLmFkZENsaWVudCA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0dGhpcy5tb2RlbC5jbGllbnRzLnB1c2gobmFtZSlcblx0dGhpcy51cGRhdGUoKVxufVxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZXZlbnRzOiB7XG5cdFx0b3BlbldpbmRvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRkbGcuc2hvdygpXG5cdFx0fSxcblx0XHRhZGRDbGllbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgQ2xpZW50JywgbGFiZWw6ICduYW1lIDonfSwgZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0XHRkbGcuYWRkQ2xpZW50KG5hbWUpXG5cdFx0XHR9KVxuXHRcdH1cblx0fVx0XHRcdFxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb3BlbldpbmRvd1wiPk9wZW4gV2luZG93PC9idXR0b24+XG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogYWRkQ2xpZW50XCI+QWRkIENsaWVudDwvYnV0dG9uPlxuPC9kaXY+XG5cbjxkaXYgaWQ9XCJ0ZW1wbGF0ZVwiIGhpZGRlbj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRcIj48L3NwYW4+PC9wPlxuXHQ8ZGl2IFxuXHRcdGJuLWNvbnRyb2w9XCJicmFpbmpzLnNlbGVjdG1lbnVcIiBcblx0XHRibi12YWw9XCJmYXZvcml0ZUZydWl0XCIgXG5cdFx0Ym4tdXBkYXRlPVwic2VsZWN0bWVudWNoYW5nZVwiIFxuXHRcdGJuLWRhdGE9XCJ7XG5cdFx0XHRpdGVtczogWydvcmFuZ2UnLCAnYXBwbGUnLCAnYmFuYW5hcycsICdsZW1vbiddXG5cdFx0fVwiPlxuXHRcdFxuXHQ8L2Rpdj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dWwgYm4tZWFjaD1cImNsaWVudHNcIj5cblx0XHQ8bGkgYm4tdGV4dD1cIiRpXCI+PC9saT5cblx0PC91bD5cblx0XG48L2Rpdj5cblxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDI3Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb3BlbldpbmRvd1xcXCI+T3BlbiBXaW5kb3c8L2J1dHRvbj5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IGFkZENsaWVudFxcXCI+QWRkIENsaWVudDwvYnV0dG9uPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcbjxkaXYgaWQ9XFxcInRlbXBsYXRlXFxcIiBoaWRkZW4+XFxuXHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cXFwiZmF2b3JpdGVGcnVpdFxcXCI+PC9zcGFuPjwvcD5cXG5cdDxkaXYgXFxuXHRcdGJuLWNvbnRyb2w9XFxcImJyYWluanMuc2VsZWN0bWVudVxcXCIgXFxuXHRcdGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdFxcXCIgXFxuXHRcdGJuLXVwZGF0ZT1cXFwic2VsZWN0bWVudWNoYW5nZVxcXCIgXFxuXHRcdGJuLWRhdGE9XFxcIntcXG5cdFx0XHRpdGVtczogW1xcJ29yYW5nZVxcJywgXFwnYXBwbGVcXCcsIFxcJ2JhbmFuYXNcXCcsIFxcJ2xlbW9uXFwnXVxcblx0XHR9XFxcIj5cXG5cdFx0XFxuXHQ8L2Rpdj5cXG5cdDxoMj5DbGllbnRzPC9oMj5cXG5cdDx1bCBibi1lYWNoPVxcXCJjbGllbnRzXFxcIj5cXG5cdFx0PGxpIGJuLXRleHQ9XFxcIiRpXFxcIj48L2xpPlxcblx0PC91bD5cXG5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGRsZyA9ICQkLmRpYWxvZ0NvbnRyb2xsZXIoe1xuXHRcdFx0dGl0bGU6ICdNeSBXaW5kb3cnLFxuXHRcdFx0d2lkdGg6IDQwMCxcblx0XHRcdGhlaWdodDogMzUwLFxuXHRcdFx0cmVzaXphYmxlOiBmYWxzZSxcblx0XHRcdG1vZGFsOiBmYWxzZSxcblx0XHRcdHRlbXBsYXRlOiBlbHQuZmluZCgnI3RlbXBsYXRlJyksXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGZhdm9yaXRlRnJ1aXQ6ICdhcHBsZScsXG5cdFx0XHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXG5cdFx0XHR9LFxuXHRcdFx0YnV0dG9uczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGV4dDogJ0NsZWFyJywgXG5cdFx0XHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZGxnLnNldERhdGEoe2NsaWVudHM6IFtdfSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0ZXh0OiAnQ2xvc2UnLCBcblx0XHRcdFx0XHRjbGljazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRkbGcuaGlkZSgpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fSlcblxuXHRcdGRsZy5hZGRDbGllbnQgPSBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHR0aGlzLm1vZGVsLmNsaWVudHMucHVzaChuYW1lKVxuXHRcdFx0dGhpcy51cGRhdGUoKVxuXHRcdH1cblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0ICBcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b3BlbldpbmRvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZGxnLnNob3coKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRhZGRDbGllbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIENsaWVudCcsIGxhYmVsOiAnbmFtZSA6J30sIGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdFx0XHRcdGRsZy5hZGRDbGllbnQobmFtZSlcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0XG5cdFx0XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiJHNjb3BlLiRpXCI+PC9saT5cblx0PC91bD5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHVsIGJuLWVhY2g9XFxcImNsaWVudHNcXFwiPlxcblx0XHRcdDxsaSBibi10ZXh0PVxcXCIkc2NvcGUuJGlcXFwiPjwvbGk+XFxuXHRcdDwvdWw+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ11cdFx0XHRcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpLm5hbWUpXG5cdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHR9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiJHNjb3BlLiRpXCI+PC9saT5cblx0PC91bD5cblxuXHQ8aDI+QWRkIGNsaWVudDwvaDI+XG5cdDxmb3JtIGJuLWV2ZW50PVwic3VibWl0OiBvbkFkZENsaWVudFwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgYXV0b2ZvY3VzPVwiXCIgcmVxdWlyZWQ9XCJcIj5cblx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5BZGQ8L2J1dHRvbj5cblx0PC9mb3JtPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx1bCBibi1lYWNoPVxcXCJjbGllbnRzXFxcIj5cXG5cdFx0XHQ8bGkgYm4tdGV4dD1cXFwiJHNjb3BlLiRpXFxcIj48L2xpPlxcblx0XHQ8L3VsPlxcblxcblx0XHQ8aDI+QWRkIGNsaWVudDwvaDI+XFxuXHRcdDxmb3JtIGJuLWV2ZW50PVxcXCJzdWJtaXQ6IG9uQWRkQ2xpZW50XFxcIj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIGF1dG9mb2N1cz1cXFwiXFxcIiByZXF1aXJlZD1cXFwiXFxcIj5cXG5cdFx0XHQ8YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCI+QWRkPC9idXR0b24+XFxuXHRcdDwvZm9ybT5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ10sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdFxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkubmFtZSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH1cdFxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0ICA8dHI+XG5cdFx0ICAgIDx0aD5OYW1lPC90aD5cblx0XHQgICAgPHRoPkFnZTwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjbGllbnRzXCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJHNjb3BlLiRpLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cIiRzY29wZS4kaS5hZ2VcIj48L3RkPlxuXHRcdFx0PC90cj5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q1Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjbGllbnRzXFxcIj5cXG5cdFx0XHRcdDx0cj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5uYW1lXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiJHNjb3BlLiRpLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cdFx0IFxcblx0XHQ8L3RhYmxlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0XG5cdFx0XHR9XHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXG5cdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cdFx0fSxcblx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdHZhciBpZHggPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuaW5kZXgoKVxuXHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4KVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgICA8dGg+QWN0aW9uPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIiBibi1ldmVudD1cImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkc2NvcGUuJGkubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJHNjb3BlLiRpLmFnZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVwiZGVsQnRuXCIgdGl0bGU9XCJEZWxldGVcIj5EZWxldGU8L2J1dHRvbj5cblx0XHRcdDwvdHI+XG5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XHRcblxuXHQ8aDI+QWRkIGNsaWVudDwvaDI+XG5cdDxmb3JtIGJuLWV2ZW50PVwic3VibWl0OiBvbkFkZENsaWVudFwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgcmVxdWlyZWQ+PGJyPlxuXHRcdDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJhZ2VcIiBuYW1lPVwiYWdlXCIgcmVxdWlyZWQ+PGJyPlxuXHRcdDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJBZGRcIj5cblx0PC9mb3JtPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q2Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjbGllbnRzXFxcIiBibi1ldmVudD1cXFwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFxcXCI+XFxuXHRcdFx0XHQ8dHI+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkc2NvcGUuJGkubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plxcblx0XHQgXFxuXHRcdDwvdGFibGU+XHRcXG5cXG5cdFx0PGgyPkFkZCBjbGllbnQ8L2gyPlxcblx0XHQ8Zm9ybSBibi1ldmVudD1cXFwic3VibWl0OiBvbkFkZENsaWVudFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgcGxhY2Vob2xkZXI9XFxcImFnZVxcXCIgbmFtZT1cXFwiYWdlXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIkFkZFxcXCI+XFxuXHRcdDwvZm9ybT5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2Plxcblxcblx0XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdCAgICBodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcbiAgICAgIFx0XHRcdFx0dmFyIGlkeCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5pbmRleCgpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4KVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKClcblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcdFxuXHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGRsZ0FkZENsaWVudCA9ICQkLmZvcm1EaWFsb2dDb250cm9sbGVyKHtcblx0dGl0bGU6ICdBZGQgQ2xpZW50Jyxcblx0dGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpXG59KVxuXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgICBjbGllbnRzOiBbXG5cdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0ICAgIF1cblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaChkYXRhKVxuXHRcdFx0XHRjdHJsLnVwZGF0ZSgpXHRcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdHZhciBpZHggPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuaW5kZXgoKVxuXHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4KVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRjdHJsLnVwZGF0ZSgpXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgICA8dGg+QWN0aW9uPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImNsaWVudHNcIiBibi1ldmVudD1cImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCIkc2NvcGUuJGkubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiJHNjb3BlLiRpLmFnZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVwiZGVsQnRuXCIgdGl0bGU9XCJEZWxldGVcIj5EZWxldGU8L2J1dHRvbj5cblx0XHRcdDwvdHI+XG5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XHRcblxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkQ2xpZW50XCI+QWRkIENsaWVudDwvYnV0dG9uPlx0XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgcmVxdWlyZWQ+PGJyPlxuXHQ8aW5wdXQgdHlwZT1cIm51bWJlclwiIHBsYWNlaG9sZGVyPVwiYWdlXCIgbmFtZT1cImFnZVwiIHJlcXVpcmVkPjxicj4gXG48L2Rpdj5cblxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDcnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dGFibGU+XFxuXHRcdFx0PHRoZWFkPlxcblx0XHRcdCAgPHRyPlxcblx0XHRcdCAgICA8dGg+TmFtZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0XHRcdCAgICA8dGg+QWN0aW9uPC90aD5cXG5cdFx0XHQgIDwvdHI+XFxuXHRcdFx0PC90aGVhZD5cXG5cdFx0XHQ8dGJvZHkgYm4tZWFjaD1cXFwiY2xpZW50c1xcXCIgYm4tZXZlbnQ9XFxcImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcXFwiPlxcblx0XHRcdFx0PHRyPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiJHNjb3BlLiRpLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCIkc2NvcGUuJGkuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cXG5cdFx0IFxcblx0XHQ8L3RhYmxlPlx0XFxuXFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvbkFkZENsaWVudFxcXCI+QWRkIENsaWVudDwvYnV0dG9uPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2Plxcblxcblx0XFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGRsZ0FkZENsaWVudCA9ICQkLmZvcm1EaWFsb2dDb250cm9sbGVyKHtcblx0XHRcdHRpdGxlOiAnQWRkIENsaWVudCcsXG5cdFx0XHR0ZW1wbGF0ZTogXCI8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIHJlcXVpcmVkPjxicj5cXG48aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBwbGFjZWhvbGRlcj1cXFwiYWdlXFxcIiBuYW1lPVxcXCJhZ2VcXFwiIHJlcXVpcmVkPjxicj4gXHRcdFwiXG5cdFx0fSlcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHQgICAgaHRtbENvZGUsXG5cdFx0XHQgICAganNDb2RlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goZGF0YSlcblx0XHRcdFx0XHRcdGN0cmwudXBkYXRlKClcdFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuICAgICAgXHRcdFx0XHR2YXIgaWR4ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmluZGV4KClcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4KVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHRcdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGxnQWRkQ2xpZW50LmRlc3Ryb3koKVxuXHRcdH1cblx0fVxufSlcblxufSkoKTtcblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgIGZydWl0czpbJ29yYW5nZScsICdhcHBsZScsICdiYW5hbmFzJywgJ2xlbW9uJ10sXG5cdCAgZmF2b3JpdGVGcnVpdDonYXBwbGUnXG5cdH1cdFxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5GcnVpdHM8L2gyPlxuXHQ8cD5Zb3VyIGZhdm9yaXQgZnJ1aXQ6IDxzcGFuIGJuLXRleHQ9XCJmYXZvcml0ZUZydWl0XCI+PC9zcGFuPjwvcD5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5jb21ib2JveFwiIFxuXHRcdGJuLXZhbD1cImZhdm9yaXRlRnJ1aXRcIiBcblx0XHRibi11cGRhdGU9XCJjb21ib2JveGNoYW5nZVwiIFxuXHRcdGJuLWRhdGE9XCJ7aXRlbXM6IGZydWl0c31cIj5cblx0PC9kaXY+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q4Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdFx0PHA+WW91ciBmYXZvcml0IGZydWl0OiA8c3BhbiBibi10ZXh0PVxcXCJmYXZvcml0ZUZydWl0XFxcIj48L3NwYW4+PC9wPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY29tYm9ib3hcXFwiIGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdFxcXCIgYm4tdXBkYXRlPVxcXCJjb21ib2JveGNoYW5nZVxcXCIgYm4tZGF0YT1cXFwie2l0ZW1zOiBbXFwnb3JhbmdlXFwnLCBcXCdhcHBsZVxcJywgXFwnYmFuYW5hc1xcJywgXFwnbGVtb25cXCddfVxcXCI+XFxuXHRcdFx0XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0ZmF2b3JpdGVGcnVpdDonYXBwbGUnLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XHQgIFxuXHRcdFx0fVx0XHRcdFxuXHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgY2xpZW50czpbXG5cdCAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9LFxuXHQgICAgIHtuYW1lOiAnTHVjYXMnLCBhZ2U6IDIyfSxcblx0ICAgICB7bmFtZTogJ1F1ZW50aW4nLCBhZ2U6IDE1fSxcblx0ICAgICB7bmFtZTogJ0xhdXJlbnQnLCBhZ2U6IDMyfVxuXHQgICBdLFxuXHQgICBmaWx0ZXI6JycsXG5cdCAgIGdldEZpbHRlcmVkQ2xpZW50czogZnVuY3Rpb24oKSB7XG5cdCAgICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoKGNsaWVudCkgPT4ge1xuXHQgICAgICAgcmV0dXJuIGNsaWVudC5uYW1lLnN0YXJ0c1dpdGgodGhpcy5maWx0ZXIpXG5cdCAgICAgfSlcblx0ICAgfSAgICBcblxuXHQgfVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgYnkgbmFtZVwiIGJuLXZhbD1cImZpbHRlclwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDx0YWJsZT5cblx0ICA8dGhlYWQ+XG5cdCAgICA8dHI+XG5cdCAgICAgIDx0aD5OYW1lPC90aD5cblx0ICAgICAgPHRoPkFnZTwvdGg+XG5cdCAgICA8L3RyPlxuXHQgIDwvdGhlYWQ+XG5cdCAgPHRib2R5IGJuLWVhY2g9XCJnZXRGaWx0ZXJlZENsaWVudHNcIj5cblx0ICAgIDx0cj5cblx0ICAgICAgPHRkIGJuLXRleHQ9XCIkc2NvcGUuJGkubmFtZVwiPjwvdGQ+XG5cdCAgICAgIDx0ZCBibi10ZXh0PVwiJHNjb3BlLiRpLmFnZVwiPjwvdGQ+XG5cdCAgICA8L3RyPlxuXHQgIDwvdGJvZHk+XG5cdCAgIFxuXHQ8L3RhYmxlPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0OScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcbiAgPGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG4gICAgPGgyPkNsaWVudHM8L2gyPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcImZpbHRlciBieSBuYW1lXFxcIiBibi12YWw9XFxcImZpbHRlclxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuICAgIDx0YWJsZT5cXG4gICAgICA8dGhlYWQ+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgIDx0aD5OYW1lPC90aD5cXG4gICAgICAgICAgPHRoPkFnZTwvdGg+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGhlYWQ+XFxuICAgICAgPHRib2R5IGJuLWVhY2g9XFxcImdldEZpbHRlcmVkQ2xpZW50c1xcXCI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgIDx0ZCBibi10ZXh0PVxcXCIkc2NvcGUuJGkubmFtZVxcXCI+PC90ZD5cXG4gICAgICAgICAgPHRkIGJuLXRleHQ9XFxcIiRzY29wZS4kaS5hZ2VcXFwiPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGJvZHk+XFxuICAgICAgIFxcbiAgICA8L3RhYmxlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG4gICAgPHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcbiAgICA8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj4gIFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgIGNsaWVudHM6W1xuXHRcdFx0ICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0x1Y2FzJywgYWdlOiAyMn0sXG5cdFx0XHQgICAgIHtuYW1lOiAnUXVlbnRpbicsIGFnZTogMTV9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0xhdXJlbnQnLCBhZ2U6IDMyfVxuXHRcdFx0ICAgXSxcblx0XHRcdCAgIGZpbHRlcjonJyxcblx0XHRcdCAgIGdldEZpbHRlcmVkQ2xpZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgIHJldHVybiB0aGlzLmNsaWVudHMuZmlsdGVyKChjbGllbnQpID0+IHtcblx0XHRcdCAgICAgICByZXR1cm4gY2xpZW50Lm5hbWUuc3RhcnRzV2l0aCh0aGlzLmZpbHRlcik7XG5cdFx0XHQgICAgIH0pXG5cblx0XHRcdCAgIH0sXG5cdFx0XHQgICBodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XG5cblxuXHRcdFx0IH1cblxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuXG5cbiJdfQ==
