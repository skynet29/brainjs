
$(function() {

	let routes = [
		{href: '/', redirect: '/test1'}
	]
	for(let i = 1; i <= 14; i++ ) {
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
	<button bn-event="click: onAddTab">Add Tab</button>
	<button bn-event="click: onAddCtrlTab">Add Control Tab</button>
	<button bn-event="click: onShowTabInfo">Show Tab Info</button>
</div>

<div id="template" hidden="">
	<input type="text" bn-val="message" bn-update="input">
	<p>Message: <span bn-text="message"></span></p>	
</div>

`.trim()

$$.control.registerControl('test13-tabctrl', {
	template: "<input type=\"text\" bn-val=\"message\" bn-update=\"input\">\n<p>Message: <span bn-text=\"message\"></span></p>	",
	init: function(elt) {
		const ctrl = $$.viewController(elt, {
			data: {
				message: 'Hello'
			}
		})
	}

})

$$.control.registerControl('test13', {
	template: "<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<div bn-control=\"brainjs.tabs\" bn-iface=\"tabs\" bn-event=\"tabsactivate: onTabActivate\">\n			<div title=\"Tab 1\">\n				<p>Hello World</p>\n			</div>\n			<div title=\"Tab 2\">\n				<p>Bonjour le monde</p>\n			</div>\n		</div>\n		<br>\n		<button bn-event=\"click: onAddTab\">Add Tab</button>\n		<button bn-event=\"click: onAddCtrlTab\">Add Control Tab</button>\n		<button bn-event=\"click: onShowTabInfo\">Show Tab Info</button>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
	template: "<!-- <style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n\n	form input {\n		margin-bottom: 5px;\n	}\n</style> -->\n\n<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n	 	<input type=\"text\" bn-control=\"brainjs.datepicker\" bn-val=\"date\" bn-update=\"datepickerchange\">\n	 	<p>Date: <span bn-text=\"formatedDate\"></span></p>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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

		const ctrl = $$.viewController(elt, {
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
	<select bn-val="favoriteFruit" bn-update="change" bn-each="f of fruits">
		<option bn-text="f"></option>
	</select>
	<p>Your favorit fruit: <span bn-text="favoriteFruit"></span></p>
</div>
`

$$.control.registerControl('test8', {
	template: "<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Fruits</h2>\n		<select bn-val=\"favoriteFruit\" bn-update=\"change\" bn-each=\"f of fruits\">\n			<option bn-text=\"f\"></option>\n		</select>\n		<p>Your favorit fruit: <span bn-text=\"favoriteFruit\"></span></p>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n",
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





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QxMy5qcyIsInRlc3QxNC5qcyIsInRlc3QyLmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImRlbW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZnVuY3Rpb24oKSB7XG5cblx0bGV0IHJvdXRlcyA9IFtcblx0XHR7aHJlZjogJy8nLCByZWRpcmVjdDogJy90ZXN0MSd9XG5cdF1cblx0Zm9yKGxldCBpID0gMTsgaSA8PSAxNDsgaSsrICkge1xuXHRcdHJvdXRlcy5wdXNoKHtcblx0XHRcdGhyZWY6ICcvdGVzdCcgKyBpLCBjb250cm9sOiAndGVzdCcgKyBpXG5cdFx0fSlcblx0fVxuXG5cblxuXHQkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdFx0ZGF0YToge1xuXHRcdFx0cm91dGVzXG5cdFx0fVxuXHR9KVxufSk7XG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJ1xuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxwIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvcD5cdFx0XHRcdFx0XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJyxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgIHJhZGl1czoxMFxuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxzdmcgaGVpZ2h0PVwiMTAwXCIgd2lkdGg9XCIxMDBcIj5cblx0ICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgYm4tYXR0cj1cInI6IHJhZGl1c1wiIHN0cm9rZT1cImJsYWNrXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIGZpbGw9XCJyZWRcIiAvPlxuXHQ8L3N2Zz5cblx0ICBcblx0PGlucHV0IHR5cGU9XCJyYW5nZVwiIGJuLXZhbD1cInJhZGl1c1wiIGJuLXVwZGF0ZT1cImlucHV0XCI+PC9kaXY+XG48L2Rpdj5cbmAudHJpbSgpXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTAnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxzdmcgaGVpZ2h0PVxcXCIxMDBcXFwiIHdpZHRoPVxcXCIxMDBcXFwiPlxcblx0XHQgIDxjaXJjbGUgY3g9XFxcIjUwXFxcIiBjeT1cXFwiNTBcXFwiIGJuLWF0dHI9XFxcInI6IHJhZGl1c1xcXCIgc3Ryb2tlPVxcXCJibGFja1xcXCIgc3Ryb2tlLXdpZHRoPVxcXCIzXFxcIiBmaWxsPVxcXCJyZWRcXFwiIC8+XFxuXHRcdDwvc3ZnPlxcblx0XHQgIFxcblx0XHQ8aW5wdXQgdHlwZT1cXFwicmFuZ2VcXFwiIGJuLXZhbD1cXFwicmFkaXVzXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgcmFkaXVzOjEwLFxuXHRcdFx0ICBodG1sQ29kZSxcblx0XHRcdCAganNDb2RlXG5cdFx0XHR9XG5cdFx0XHQgXG5cblx0XHR9KVxuXHR9XG59KTtcblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJsZScsIHsgICBcbiAgICBwcm9wczoge1xuICAgIFx0Y2xpZW50czogW11cbiAgICB9LFxuICAgIHRlbXBsYXRlOiAkKCcjdGVtcGxhdGUnKSxcbiAgICBpbml0OiBmdW5jdGlvbihlbHQpIHtcbiAgICBcdGNvbnNvbGUubG9nKCdpbml0JywgdGhpcy5wcm9wcylcbiAgICAgIFxuICAgICAgdGhpcy5jdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjbGllbnRzOiB0aGlzLnByb3BzLmNsaWVudHNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgIH0gXG4gIH1cbilcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0ICBteUNsaWVudHM6IFtcblx0ICAgIHtuYW1lOiAnUXVlbnRpbicsIGNpdHk6ICdSZW5uZXMnfSxcblx0ICAgIHtuYW1lOiAnTWFyYycsIGNpdHk6ICdCZXRodW5lJ31cblx0ICBdLFxuXHQgIG15Q2xpZW50czI6IFtcblx0ICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBjaXR5OiAnTGUgTWFucyd9LFxuXHQgICAge25hbWU6ICdHZW9yZ2VzJywgY2l0eTogJ1ZlcnF1aW4nfVxuXHQgIF1cblx0fVxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q3VzdG9tIGNvbnRyb2w8L2gyPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJNeVRhYmxlXCIgYm4tZGF0YT1cImNsaWVudHM6IG15Q2xpZW50c1wiPjwvZGl2PlxuXHQ8aHI+XG5cdDxkaXYgYm4tY29udHJvbD1cIk15VGFibGVcIiBibi1kYXRhPVwiY2xpZW50czogbXlDbGllbnRzMlwiPjwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgaWQ9XCJ0ZW1wbGF0ZVwiIGhpZGRlbj1cIlwiPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdFx0PHRyPlxuXHRcdFx0XHQ8dGg+TmFtZTwvdGg+XG5cdFx0XHRcdDx0aD5DaXR5PC90aD5cblx0XHRcdDwvdHI+XG5cdFx0PC90aGVhZD5cblxuXHRcdDx0Ym9keSBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLmNpdHlcIj48L3RkPlxuXHRcdFx0PC90cj5cblx0XHQ8L3Rib2R5PlxuXHQ8L3RhYmxlPlx0XG48L2Rpdj5cbmAudHJpbSgpXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdNeVRhYmxlJywgeyAgIFxuICAgIHByb3BzOiB7XG4gICAgXHRjbGllbnRzOiBbXVxuICAgIH0sXG4gICAgdGVtcGxhdGU6IFwiPHRhYmxlPlxcblx0PHRoZWFkPlxcblx0XHQ8dHI+XFxuXHRcdFx0PHRoPk5hbWU8L3RoPlxcblx0XHRcdDx0aD5DaXR5PC90aD5cXG5cdFx0PC90cj5cXG5cdDwvdGhlYWQ+XFxuXFxuXHQ8dGJvZHkgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdFx0PHRyPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuY2l0eVxcXCI+PC90ZD5cXG5cdFx0PC90cj5cXG5cdDwvdGJvZHk+XFxuPC90YWJsZT5cdFwiLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuICAgIFx0Y29uc29sZS5sb2coJ2luaXQnLCB0aGlzLnByb3BzKVxuICAgICAgXG4gICAgICB0aGlzLmN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNsaWVudHM6IHRoaXMucHJvcHMuY2xpZW50c1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgfSBcbiAgfVxuKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDExJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQgIDxoMj5DdXN0b20gY29udHJvbDwvaDI+XFxuXHRcdCAgPGRpdiBibi1jb250cm9sPVxcXCJNeVRhYmxlXFxcIiBibi1kYXRhPVxcXCJjbGllbnRzOiBteUNsaWVudHNcXFwiPjwvZGl2Plxcblx0XHQgIDxocj5cXG5cdFx0ICA8ZGl2IGJuLWNvbnRyb2w9XFxcIk15VGFibGVcXFwiIGJuLWRhdGE9XFxcImNsaWVudHM6IG15Q2xpZW50czJcXFwiPjwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0ICBteUNsaWVudHM6IFtcblx0XHRcdCAgICB7bmFtZTogJ1F1ZW50aW4nLCBjaXR5OiAnUmVubmVzJ30sXG5cdFx0XHQgICAge25hbWU6ICdNYXJjJywgY2l0eTogJ0JldGh1bmUnfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBteUNsaWVudHMyOiBbXG5cdFx0XHQgICAge25hbWU6ICdCcmlnaXR0ZScsIGNpdHk6ICdMZSBNYW5zJ30sXG5cdFx0XHQgICAge25hbWU6ICdHZW9yZ2VzJywgY2l0eTogJ1ZlcnF1aW4nfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBodG1sQ29kZSxcblx0XHRcdCAganNDb2RlXG5cdFx0XHR9IFxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGZhdm9yaXRlRnJ1aXRzOlsnYXBwbGUnLCAnb3JhbmdlJ10sXG5cdFx0Z2VuZGVyOiAnbWFsZSdcblx0fSBcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2hlY2tncm91cFwiIGJuLXZhbD1cImZhdm9yaXRlRnJ1aXRzXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJvcmFuZ2VcIj5PcmFuZ2Vcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJiYW5hbmFzXCI+QmFuYW5hc1xuXHQgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cImFwcGxlXCI+QXBwbGVcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJsZW1vblwiPkxlbW9uXG5cdDwvZGl2PlxuXG5cdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRzXCI+PC9zcGFuPjwvcD5cblxuXHQ8aDI+R2VuZGVyPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5yYWRpb2dyb3VwXCIgYm4tdmFsPVwiZ2VuZGVyXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJtYWxlXCI+TWFsZVxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cImZlbWFsZVwiPkZlbWFsZVxuXHQ8L2Rpdj5cblx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVwiZ2VuZGVyXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5GcnVpdHM8L2gyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMuY2hlY2tncm91cFxcXCIgYm4tdmFsPVxcXCJmYXZvcml0ZUZydWl0c1xcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwib3JhbmdlXFxcIj5PcmFuZ2VcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIHZhbHVlPVxcXCJiYW5hbmFzXFxcIj5CYW5hbmFzXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwiYXBwbGVcXFwiPkFwcGxlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwibGVtb25cXFwiPkxlbW9uXFxuXHRcdDwvZGl2Plxcblx0XHRcXG5cdFx0ICA8cD5Zb3VyIGZhdm9yaXQgZnJ1aXRzOiA8c3BhbiBibi10ZXh0PVxcXCJmYXZvcml0ZUZydWl0c1xcXCI+PC9zcGFuPjwvcD5cXG5cXG5cdFx0PGgyPkdlbmRlcjwvaDI+XFxuXHRcdDxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy5yYWRpb2dyb3VwXFxcIiBibi12YWw9XFxcImdlbmRlclxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiB2YWx1ZT1cXFwibWFsZVxcXCI+TWFsZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgdmFsdWU9XFxcImZlbWFsZVxcXCI+RmVtYWxlXFxuXHRcdDwvZGl2Plxcblx0XHQ8cD5HZW5kZXI6IDxzcGFuIGJuLXRleHQ9XFxcImdlbmRlclxcXCI+PC9zcGFuPjwvcD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGZhdm9yaXRlRnJ1aXRzOlsnYXBwbGUnLCAnb3JhbmdlJ10sXG5cdFx0XHRcdGdlbmRlcjogJ21hbGUnLFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9IFxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnTXlUYWJDdHJsJywge1xuXHR0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJyksXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWVzc2FnZTogJ0hlbGxvJ1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxufSlcblxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YTogeyBcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25UYWJBY3RpdmF0ZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvblRhYkFjdGl2YXRlJywgJCh0aGlzKS5pZmFjZSgpLmdldFNlbGVjdGVkVGFiSW5kZXgoKSlcblx0XHR9LFxuXHRcdG9uQWRkVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkVGFiJylcblx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0cmVtb3ZhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnPHA+R29vZCBtb3JuaW5nPHA+J1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25BZGRDdHJsVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ3RybFRhYicpXG5cdFx0XHQkJC51aS5zaG93UHJvbXB0KHt0aXRsZTogJ0FkZCBUYWInLCBsYWJlbDogJ1RhYiBuYW1lOid9LCBmdW5jdGlvbih0YWJOYW1lKSB7XG5cdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRjb250cm9sOiAnTXlUYWJDdHJsJ1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0sXG5cdFx0b25TaG93VGFiSW5mbzogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnN0IGNvdW50ID0gY3RybC5zY29wZS50YWJzLmdldFRhYnNDb3VudCgpXG5cdFx0XHRjb25zdCBzZWxJZHggPSBjdHJsLnNjb3BlLnRhYnMuZ2V0U2VsZWN0ZWRUYWJJbmRleCgpXG5cdFx0XHRjb25zdCB0aXRsZSA9IGN0cmwuc2NvcGUudGFicy5nZXRUYWJJbmZvKHNlbElkeCkudGl0bGVcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSBcXGBcblx0XHRcdFx0PHA+VGFic0NvdW50OiBcXCR7Y291bnR9PC9wPlxuXHRcdFx0XHQ8cD5TZWxJbmRleDogXFwke3NlbElkeH08L3A+XG5cdFx0XHRcdDxwPlNlbFRhYiBUaXRsZTogXFwke3RpdGxlfTxwPlxuXHRcdFx0XFxgXG5cdFx0XHQkJC51aS5zaG93QWxlcnQoe2NvbnRlbnR9KVxuXHRcdH1cdFx0XHRcdFx0XG5cdH1cdFxufVxuYC50cmltKClcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8ZGl2IGJuLWNvbnRyb2w9XCJicmFpbmpzLnRhYnNcIiBibi1pZmFjZT1cInRhYnNcIiBibi1ldmVudD1cInRhYnNhY3RpdmF0ZTogb25UYWJBY3RpdmF0ZVwiPlxuXHRcdDxkaXYgdGl0bGU9XCJUYWIgMVwiPlxuXHRcdFx0PHA+SGVsbG8gV29ybGQ8L3A+XG5cdFx0PC9kaXY+XG5cdFx0PGRpdiB0aXRsZT1cIlRhYiAyXCI+XG5cdFx0XHQ8cD5Cb25qb3VyIGxlIG1vbmRlPC9wPlxuXHRcdDwvZGl2PlxuXHQ8L2Rpdj5cblx0PGJyPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkVGFiXCI+QWRkIFRhYjwvYnV0dG9uPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uQWRkQ3RybFRhYlwiPkFkZCBDb250cm9sIFRhYjwvYnV0dG9uPlxuXHQ8YnV0dG9uIGJuLWV2ZW50PVwiY2xpY2s6IG9uU2hvd1RhYkluZm9cIj5TaG93IFRhYiBJbmZvPC9idXR0b24+XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLXZhbD1cIm1lc3NhZ2VcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEzLXRhYmN0cmwnLCB7XG5cdHRlbXBsYXRlOiBcIjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi12YWw9XFxcIm1lc3NhZ2VcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcbjxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvc3Bhbj48L3A+XHRcIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8nXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG59KVxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDEzJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCIgYm4taWZhY2U9XFxcInRhYnNcXFwiIGJuLWV2ZW50PVxcXCJ0YWJzYWN0aXZhdGU6IG9uVGFiQWN0aXZhdGVcXFwiPlxcblx0XHRcdDxkaXYgdGl0bGU9XFxcIlRhYiAxXFxcIj5cXG5cdFx0XHRcdDxwPkhlbGxvIFdvcmxkPC9wPlxcblx0XHRcdDwvZGl2Plxcblx0XHRcdDxkaXYgdGl0bGU9XFxcIlRhYiAyXFxcIj5cXG5cdFx0XHRcdDxwPkJvbmpvdXIgbGUgbW9uZGU8L3A+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0XHQ8YnI+XFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvbkFkZFRhYlxcXCI+QWRkIFRhYjwvYnV0dG9uPlxcblx0XHQ8YnV0dG9uIGJuLWV2ZW50PVxcXCJjbGljazogb25BZGRDdHJsVGFiXFxcIj5BZGQgQ29udHJvbCBUYWI8L2J1dHRvbj5cXG5cdFx0PGJ1dHRvbiBibi1ldmVudD1cXFwiY2xpY2s6IG9uU2hvd1RhYkluZm9cXFwiPlNob3cgVGFiIEluZm88L2J1dHRvbj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHsgXG5cdFx0XHRcdGh0bWxDb2RlLFxuXHRcdFx0XHRqc0NvZGVcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25UYWJBY3RpdmF0ZTogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25UYWJBY3RpdmF0ZScsICQodGhpcykuaWZhY2UoKS5nZXRTZWxlY3RlZFRhYkluZGV4KCkpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQWRkVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZFRhYicpXG5cdFx0XHRcdFx0JCQudWkuc2hvd1Byb21wdCh7dGl0bGU6ICdBZGQgVGFiJywgbGFiZWw6ICdUYWIgbmFtZTonfSwgZnVuY3Rpb24odGFiTmFtZSkge1xuXHRcdFx0XHRcdFx0Y3RybC5zY29wZS50YWJzLmFkZFRhYih0YWJOYW1lLCB7XG5cdFx0XHRcdFx0XHRcdHJlbW92YWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0dGVtcGxhdGU6ICc8cD5Hb29kIG1vcm5pbmc8cD4nXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pXG5cblx0XHRcdFx0fSxcblx0XHRcdFx0b25BZGRDdHJsVGFiOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZEN0cmxUYWInKVxuXHRcdFx0XHRcdCQkLnVpLnNob3dQcm9tcHQoe3RpdGxlOiAnQWRkIFRhYicsIGxhYmVsOiAnVGFiIG5hbWU6J30sIGZ1bmN0aW9uKHRhYk5hbWUpIHtcblx0XHRcdFx0XHRcdGN0cmwuc2NvcGUudGFicy5hZGRUYWIodGFiTmFtZSwge1xuXHRcdFx0XHRcdFx0XHRyZW1vdmFibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2w6ICd0ZXN0MTMtdGFiY3RybCdcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSlcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblNob3dUYWJJbmZvOiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnN0IGNvdW50ID0gY3RybC5zY29wZS50YWJzLmdldFRhYnNDb3VudCgpXG5cdFx0XHRcdFx0Y29uc3Qgc2VsSWR4ID0gY3RybC5zY29wZS50YWJzLmdldFNlbGVjdGVkVGFiSW5kZXgoKVxuXHRcdFx0XHRcdGNvbnN0IHRpdGxlID0gY3RybC5zY29wZS50YWJzLmdldFRhYkluZm8oc2VsSWR4KS50aXRsZVxuXHRcdFx0XHRcdGNvbnN0IGNvbnRlbnQgPSBgXG5cdFx0XHRcdFx0XHQ8cD5UYWJzQ291bnQ6ICR7Y291bnR9PC9wPlxuXHRcdFx0XHRcdFx0PHA+U2VsSW5kZXg6ICR7c2VsSWR4fTwvcD5cblx0XHRcdFx0XHRcdDxwPlNlbFRhYiBUaXRsZTogJHt0aXRsZX08cD5cblx0XHRcdFx0XHRgXG5cdFx0XHRcdFx0JCQudWkuc2hvd0FsZXJ0KHtjb250ZW50fSlcblx0XHRcdFx0fVx0XHRcdFx0XG5cdFx0XHR9XHRcdFx0IFxuXHRcdH0pXG5cblx0XHRjb25zb2xlLmxvZygnc2NvcGUnLCBjdHJsLnNjb3BlKVxuXG5cdH1cbn0pXG5cblxuICBcblxuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRkYXRlOiBuZXcgRGF0ZSgxOTcyLCAwLCAzKSxcblx0XHRmb3JtYXRlZERhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKVxuXHRcdH1cdFx0XG5cdH0sXG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLWNvbnRyb2w9XCJicmFpbmpzLmRhdGVwaWNrZXJcIiBibi12YWw9XCJkYXRlXCIgYm4tdXBkYXRlPVwiZGF0ZXBpY2tlcmNoYW5nZVwiPlxuXHQ8cD5EYXRlOiA8c3BhbiBibi10ZXh0PVwiZm9ybWF0ZWREYXRlXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuYC50cmltKClcblxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDE0Jywge1xuXHR0ZW1wbGF0ZTogXCI8IS0tIDxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHR0YWJsZSB7XFxuXHRcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHRcdFxcblx0fVxcblxcblx0dGgsIHRkIHtcXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuXHRcdHBhZGRpbmc6IDVweDtcXG5cdH1cXG5cXG5cdGZvcm0gaW5wdXQge1xcblx0XHRtYXJnaW4tYm90dG9tOiA1cHg7XFxuXHR9XFxuPC9zdHlsZT4gLS0+XFxuXFxuPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdCBcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi1jb250cm9sPVxcXCJicmFpbmpzLmRhdGVwaWNrZXJcXFwiIGJuLXZhbD1cXFwiZGF0ZVxcXCIgYm4tdXBkYXRlPVxcXCJkYXRlcGlja2VyY2hhbmdlXFxcIj5cXG5cdCBcdDxwPkRhdGU6IDxzcGFuIGJuLXRleHQ9XFxcImZvcm1hdGVkRGF0ZVxcXCI+PC9zcGFuPjwvcD5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG4yMlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YTogeyBcblx0XHRcdFx0ZGF0ZTogbmV3IERhdGUoMTk3MiwgMCwgMyksXG5cdFx0XHRcdGZvcm1hdGVkRGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlLFxuXHRcdFx0fSxcblx0XHQgXG5cdFx0fSlcblxuXHR9XG59KVxuXG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0bWVzc2FnZTogJ0hlbGxvIFdvcmxkJ1xuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgYm4tdmFsPVwibWVzc2FnZVwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XCJtZXNzYWdlXCI+PC9zcGFuPjwvcD5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MicsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGJuLXZhbD1cXFwibWVzc2FnZVxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuXHRcdDxwPk1lc3NhZ2U6IDxzcGFuIGJuLXRleHQ9XFxcIm1lc3NhZ2VcXFwiPjwvc3Bhbj48L3A+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCcsXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCI+XG5cdFx0PGxpIGJuLXRleHQ9XCJjXCI+PC9saT5cblx0PC91bD5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDMnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHVsIGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdFx0PGxpIGJuLXRleHQ9XFxcImNcXFwiPjwvbGk+XFxuXHRcdDwvdWw+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ11cdFx0XHRcblx0fSxcblx0ZXZlbnRzOiB7XG5cdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpLm5hbWUpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cblx0XHR9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx1bCBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCI+XG5cdFx0PGxpIGJuLXRleHQ9XCJjXCI+PC9saT5cblx0PC91bD5cblxuXHQ8aDI+QWRkIGNsaWVudDwvaDI+XG5cdDxmb3JtIGJuLWV2ZW50PVwic3VibWl0OiBvbkFkZENsaWVudFwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgYXV0b2ZvY3VzPVwiXCIgcmVxdWlyZWQ9XCJcIj5cblx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5BZGQ8L2J1dHRvbj5cblx0PC9mb3JtPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q0Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx1bCBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHRcdDxsaSBibi10ZXh0PVxcXCJjXFxcIj48L2xpPlxcblx0XHQ8L3VsPlxcblxcblx0XHQ8aDI+QWRkIGNsaWVudDwvaDI+XFxuXHRcdDxmb3JtIGJuLWV2ZW50PVxcXCJzdWJtaXQ6IG9uQWRkQ2xpZW50XFxcIj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIGF1dG9mb2N1cz1cXFwiXFxcIiByZXF1aXJlZD1cXFwiXFxcIj5cXG5cdFx0XHQ8YnV0dG9uIHR5cGU9XFxcInN1Ym1pdFxcXCI+QWRkPC9idXR0b24+XFxuXHRcdDwvZm9ybT5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ10sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdFxuXHRcdFx0fSxcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnb25BZGRDbGllbnQnKVxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkubmFtZSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH1cdFxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0ICA8dHI+XG5cdFx0ICAgIDx0aD5OYW1lPC90aD5cblx0XHQgICAgPHRoPkFnZTwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMuYWdlXCI+PC90ZD5cblx0XHRcdDwvdHI+XG5cdFx0PC90Ym9keT5cblx0IFxuXHQ8L3RhYmxlPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PHRhYmxlPlxcblx0XHRcdDx0aGVhZD5cXG5cdFx0XHQgIDx0cj5cXG5cdFx0XHQgICAgPHRoPk5hbWU8L3RoPlxcblx0XHRcdCAgICA8dGg+QWdlPC90aD5cXG5cdFx0XHQgIDwvdHI+XFxuXHRcdFx0PC90aGVhZD5cXG5cdFx0XHQ8dGJvZHkgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdFx0XHRcdDx0cj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plx0XHQgXFxuXHRcdDwvdGFibGU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdFx0aHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFx0XG5cdFx0XHR9XHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICAgY2xpZW50czogW1xuXHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdCAgICBdXG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXG5cdFx0fSxcblx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcblx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgICA8dGg+QWN0aW9uPC90aD5cblx0XHQgIDwvdHI+XG5cdFx0PC90aGVhZD5cblx0XHQ8dGJvZHkgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiIGJuLWV2ZW50PVwiY2xpY2suZGVsQnRuOiBvblJlbW92ZUNsaWVudFwiPlxuXHRcdFx0PHRyIGJuLWRhdGE9XCJpdGVtOiBjXCI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLmFnZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVwiZGVsQnRuXCIgdGl0bGU9XCJEZWxldGVcIj5EZWxldGU8L2J1dHRvbj5cblx0XHRcdDwvdHI+XG5cblx0XHQ8L3Rib2R5PlxuXHQgXG5cdDwvdGFibGU+XHRcblxuXHQ8aDI+QWRkIGNsaWVudDwvaDI+XG5cdDxmb3JtIGJuLWV2ZW50PVwic3VibWl0OiBvbkFkZENsaWVudFwiPlxuXHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwibmFtZVwiIG5hbWU9XCJuYW1lXCIgcmVxdWlyZWQ+PGJyPlxuXHRcdDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJhZ2VcIiBuYW1lPVwiYWdlXCIgcmVxdWlyZWQ+PGJyPlxuXHRcdDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJBZGRcIj5cblx0PC9mb3JtPlx0XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q2Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiIGJuLWV2ZW50PVxcXCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XFxcIj5cXG5cdFx0XHRcdDx0ciBibi1kYXRhPVxcXCJpdGVtOiBjXFxcIj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cXG5cdFx0IFxcblx0XHQ8L3RhYmxlPlx0XFxuXFxuXHRcdDxoMj5BZGQgY2xpZW50PC9oMj5cXG5cdFx0PGZvcm0gYm4tZXZlbnQ9XFxcInN1Ym1pdDogb25BZGRDbGllbnRcXFwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcmVxdWlyZWQ+PGJyPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJudW1iZXJcXFwiIHBsYWNlaG9sZGVyPVxcXCJhZ2VcXFwiIG5hbWU9XFxcImFnZVxcXCIgcmVxdWlyZWQ+PGJyPlxcblx0XHRcdDxpbnB1dCB0eXBlPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCJBZGRcXFwiPlxcblx0XHQ8L2Zvcm0+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cdFwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHQgICAgaHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMucHVzaCgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblx0XHRcdFx0fSxcblx0XHRcdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0dmFyIGRhdGEgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGF0YSgnaXRlbScpXG4gICAgICBcdFx0XHRcdHZhciBpZHggPSBjdHJsLm1vZGVsLmNsaWVudHMuaW5kZXhPZihkYXRhKVxuICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgsIGRhdGEpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnNwbGljZShpZHgsIDEpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0XG5cdFx0XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgZGxnQWRkQ2xpZW50ID0gJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIoe1xuXHR0aXRsZTogJ0FkZCBDbGllbnQnLFxuXHR0ZW1wbGF0ZTogJCgnI3RlbXBsYXRlJylcbn0pXG5cbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgIGNsaWVudHM6IFtcblx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHQgICAgXVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRkbGdBZGRDbGllbnQuc2hvdyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKGRhdGEpXG5cdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcdFxuXHRcdFx0fSlcblx0XHR9LFxuXHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0dmFyIGRhdGEgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGF0YSgnaXRlbScpXG5cdFx0XHRcdHZhciBpZHggPSBjdHJsLm1vZGVsLmNsaWVudHMuaW5kZXhPZihkYXRhKVxuXHRcdFx0XHRjb25zb2xlLmxvZygnb25SZW1vdmVDbGllbnQnLCBpZHgsIGRhdGEpXG5cdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHR9XG5cdH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0ICA8dHI+XG5cdFx0ICAgIDx0aD5OYW1lPC90aD5cblx0XHQgICAgPHRoPkFnZTwvdGg+XG5cdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxuXHRcdCAgPC90cj5cblx0XHQ8L3RoZWFkPlxuXHRcdDx0Ym9keSBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCIgYm4tZXZlbnQ9XCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XCI+XG5cdFx0XHQ8dHIgYm4tZGF0YT1cIml0ZW06IGNcIj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMuYWdlXCI+PC90ZD5cblx0XHRcdFx0PHRkPjxidXR0b24gY2xhc3M9XCJkZWxCdG5cIiB0aXRsZT1cIkRlbGV0ZVwiPkRlbGV0ZTwvYnV0dG9uPlxuXHRcdFx0PC90cj5cblxuXHRcdDwvdGJvZHk+XG5cdCBcblx0PC90YWJsZT5cdFxuXG5cdDxidXR0b24gYm4tZXZlbnQ9XCJjbGljazogb25BZGRDbGllbnRcIj5BZGQgQ2xpZW50PC9idXR0b24+XHRcbjwvZGl2PlxuXG48ZGl2IGlkPVwidGVtcGxhdGVcIiBoaWRkZW49XCJcIj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJuYW1lXCIgbmFtZT1cIm5hbWVcIiByZXF1aXJlZD48YnI+XG5cdDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJhZ2VcIiBuYW1lPVwiYWdlXCIgcmVxdWlyZWQ+PGJyPiBcbjwvZGl2PlxuXG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NycsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICAgIDx0aD5BY3Rpb248L3RoPlxcblx0XHRcdCAgPC90cj5cXG5cdFx0XHQ8L3RoZWFkPlxcblx0XHRcdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiIGJuLWV2ZW50PVxcXCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XFxcIj5cXG5cdFx0XHRcdDx0ciBibi1kYXRhPVxcXCJpdGVtOiBjXFxcIj5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuYWdlXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiZGVsQnRuXFxcIiB0aXRsZT1cXFwiRGVsZXRlXFxcIj5EZWxldGU8L2J1dHRvbj5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cXG5cdFx0IFxcblx0XHQ8L3RhYmxlPlx0XFxuXFxuXHRcdDxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvbkFkZENsaWVudFxcXCI+QWRkIENsaWVudDwvYnV0dG9uPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2Plxcblxcblx0XFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXHRcdGNvbnN0IGRsZ0FkZENsaWVudCA9ICQkLmZvcm1EaWFsb2dDb250cm9sbGVyKHtcblx0XHRcdHRpdGxlOiAnQWRkIENsaWVudCcsXG5cdFx0XHR0ZW1wbGF0ZTogXCI8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIm5hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIHJlcXVpcmVkPjxicj5cXG48aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBwbGFjZWhvbGRlcj1cXFwiYWdlXFxcIiBuYW1lPVxcXCJhZ2VcXFwiIHJlcXVpcmVkPjxicj4gXHRcdFwiXG5cdFx0fSlcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHQgICAgaHRtbENvZGUsXG5cdFx0XHQgICAganNDb2RlXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goZGF0YSlcblx0XHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcdFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuICAgICAgXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHRcdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGxnQWRkQ2xpZW50LmRlc3Ryb3koKVxuXHRcdH1cblx0fVxufSlcblxufSkoKTtcblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgIGZydWl0czpbJ29yYW5nZScsICdhcHBsZScsICdiYW5hbmFzJywgJ2xlbW9uJ10sXG5cdCAgZmF2b3JpdGVGcnVpdDonYXBwbGUnXG5cdH1cdFxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5GcnVpdHM8L2gyPlxuXHQ8c2VsZWN0IGJuLXZhbD1cImZhdm9yaXRlRnJ1aXRcIiBibi11cGRhdGU9XCJjaGFuZ2VcIiBibi1lYWNoPVwiZiBvZiBmcnVpdHNcIj5cblx0XHQ8b3B0aW9uIGJuLXRleHQ9XCJmXCI+PC9vcHRpb24+XG5cdDwvc2VsZWN0PlxuXHQ8cD5Zb3VyIGZhdm9yaXQgZnJ1aXQ6IDxzcGFuIGJuLXRleHQ9XCJmYXZvcml0ZUZydWl0XCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDgnLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5GcnVpdHM8L2gyPlxcblx0XHQ8c2VsZWN0IGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdFxcXCIgYm4tdXBkYXRlPVxcXCJjaGFuZ2VcXFwiIGJuLWVhY2g9XFxcImYgb2YgZnJ1aXRzXFxcIj5cXG5cdFx0XHQ8b3B0aW9uIGJuLXRleHQ9XFxcImZcXFwiPjwvb3B0aW9uPlxcblx0XHQ8L3NlbGVjdD5cXG5cdFx0PHA+WW91ciBmYXZvcml0IGZydWl0OiA8c3BhbiBibi10ZXh0PVxcXCJmYXZvcml0ZUZydWl0XFxcIj48L3NwYW4+PC9wPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0ZnJ1aXRzOlsnb3JhbmdlJywgJ2FwcGxlJywgJ2JhbmFuYXMnLCAnbGVtb24nXSxcblx0XHRcdFx0ZmF2b3JpdGVGcnVpdDonYXBwbGUnLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XHQgIFxuXHRcdFx0fVx0XHRcdFxuXHRcdFxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgY2xpZW50czpbXG5cdCAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9LFxuXHQgICAgIHtuYW1lOiAnTHVjYXMnLCBhZ2U6IDIyfSxcblx0ICAgICB7bmFtZTogJ1F1ZW50aW4nLCBhZ2U6IDE1fSxcblx0ICAgICB7bmFtZTogJ0xhdXJlbnQnLCBhZ2U6IDMyfVxuXHQgICBdLFxuXHQgICBmaWx0ZXI6JycsXG5cdCAgIGdldEZpbHRlcmVkQ2xpZW50czogZnVuY3Rpb24oKSB7XG5cdCAgICAgdmFyIGZpbHRlciA9IHRoaXMuZmlsdGVyXG5cdCAgICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoZnVuY3Rpb24oY2xpZW50KSB7XG5cdCAgICAgICByZXR1cm4gY2xpZW50Lm5hbWUuc3RhcnRzV2l0aChmaWx0ZXIpO1xuXHQgICAgIH0pXG5cdCAgIH0gICAgXG5cblx0IH1cbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8aDI+Q2xpZW50czwvaDI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZmlsdGVyIGJ5IG5hbWVcIiBibi12YWw9XCJmaWx0ZXJcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8dGFibGU+XG5cdCAgPHRoZWFkPlxuXHQgICAgPHRyPlxuXHQgICAgICA8dGg+TmFtZTwvdGg+XG5cdCAgICAgIDx0aD5BZ2U8L3RoPlxuXHQgICAgPC90cj5cblx0ICA8L3RoZWFkPlxuXHQgIDx0Ym9keSBibi1lYWNoPVwiY2xpZW50IG9mIGdldEZpbHRlcmVkQ2xpZW50c1wiPlxuXHQgICAgPHRyPlxuXHQgICAgICA8dGQgYm4tdGV4dD1cImNsaWVudC5uYW1lXCI+PC90ZD5cblx0ICAgICAgPHRkIGJuLXRleHQ9XCJjbGllbnQuYWdlXCI+PC90ZD5cblx0ICAgIDwvdHI+XG5cdCAgPC90Ym9keT5cblx0ICAgXG5cdDwvdGFibGU+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3Q5Jywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuICA8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcbiAgICA8aDI+Q2xpZW50czwvaDI+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiZmlsdGVyIGJ5IG5hbWVcXFwiIGJuLXZhbD1cXFwiZmlsdGVyXFxcIiBibi11cGRhdGU9XFxcImlucHV0XFxcIj5cXG4gICAgPHRhYmxlPlxcbiAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxcbiAgICAgICAgICA8dGg+QWdlPC90aD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgPC90aGVhZD5cXG4gICAgICA8dGJvZHkgYm4tZWFjaD1cXFwiY2xpZW50IG9mIGdldEZpbHRlcmVkQ2xpZW50c1xcXCI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgIDx0ZCBibi10ZXh0PVxcXCJjbGllbnQubmFtZVxcXCI+PC90ZD5cXG4gICAgICAgICAgPHRkIGJuLXRleHQ9XFxcImNsaWVudC5hZ2VcXFwiPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGJvZHk+XFxuICAgICAgIFxcbiAgICA8L3RhYmxlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG4gICAgPHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj5cXG4gIDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcbiAgICA8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuICA8L2Rpdj4gIFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgIGNsaWVudHM6W1xuXHRcdFx0ICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0x1Y2FzJywgYWdlOiAyMn0sXG5cdFx0XHQgICAgIHtuYW1lOiAnUXVlbnRpbicsIGFnZTogMTV9LFxuXHRcdFx0ICAgICB7bmFtZTogJ0xhdXJlbnQnLCBhZ2U6IDMyfVxuXHRcdFx0ICAgXSxcblx0XHRcdCAgIGZpbHRlcjonJyxcblx0XHRcdCAgIGdldEZpbHRlcmVkQ2xpZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgIHZhciBmaWx0ZXIgPSB0aGlzLmZpbHRlclxuXHRcdFx0ICAgICByZXR1cm4gdGhpcy5jbGllbnRzLmZpbHRlcihmdW5jdGlvbihjbGllbnQpIHtcblx0XHRcdCAgICAgICByZXR1cm4gY2xpZW50Lm5hbWUuc3RhcnRzV2l0aChmaWx0ZXIpO1xuXHRcdFx0ICAgICB9KVxuXG5cdFx0XHQgICB9LFxuXHRcdFx0ICAgaHRtbENvZGU6IGh0bWxDb2RlLnRyaW0oKSxcblx0XHRcdFx0anNDb2RlOiBqc0NvZGUudHJpbSgpXHRcdFxuXG5cblx0XHRcdCB9XG5cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cblxuXG4iXX0=
