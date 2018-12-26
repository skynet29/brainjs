
$(function() {

	let routes = [
		{href: '/', redirect: '/test1'}
	]
	for(let i = 1; i <= 12; i++ ) {
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
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n\n	form input {\n		margin-bottom: 5px;\n	}\n</style>\n\n<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		  <h2>Custom control</h2>\n		  <div bn-control=\"MyTable\" bn-data=\"clients: myClients\"></div>\n		  <hr>\n		  <div bn-control=\"MyTable\" bn-data=\"clients: myClients2\"></div>\n		</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n\n	form input {\n		margin-bottom: 5px;\n	}\n</style>\n\n<div bn-control=\"brainjs.tabs\">\n\n	<div title=\"Result\">\n		<h2>Fruits</h2>\n		<div bn-control=\"brainjs.checkgroup\" bn-val=\"favoriteFruits\" bn-update=\"input\">\n		  <input type=\"checkbox\" value=\"orange\">Orange\n		  <input type=\"checkbox\" value=\"bananas\">Bananas\n		  <input type=\"checkbox\" value=\"apple\">Apple\n		  <input type=\"checkbox\" value=\"lemon\">Lemon\n		</div>\n		\n		  <p>Your favorit fruits: <span bn-text=\"favoriteFruits\"></span></p>\n\n		<h2>Gender</h2>\n		<div bn-control=\"brainjs.radiogroup\" bn-val=\"gender\" bn-update=\"input\">\n		  <input type=\"radio\" value=\"male\">Male\n		  <input type=\"radio\" value=\"female\">Female\n		</div>\n		<p>Gender: <span bn-text=\"gender\"></span></p>\n	</div>\n\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n22\n\n",
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
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n</style>\n\n<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"c of clients\">\n				<tr>\n					<td bn-text=\"c.name\"></td>\n					<td bn-text=\"c.age\"></td>\n				</tr>\n\n			</tbody>		 \n		</table>\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n",
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
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n\n	form input {\n		margin-bottom: 5px;\n	}\n</style>\n\n<div bn-control=\"brainjs.tabs\">\n	<div title=\"Result\">\n		<h2>Clients</h2>\n		<table>\n			<thead>\n			  <tr>\n			    <th>Name</th>\n			    <th>Age</th>\n			    <th>Action</th>\n			  </tr>\n			</thead>\n			<tbody bn-each=\"c of clients\" bn-event=\"click.delBtn: onRemoveClient\">\n				<tr bn-data=\"item: c\">\n					<td bn-text=\"c.name\"></td>\n					<td bn-text=\"c.age\"></td>\n					<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n				</tr>\n\n			</tbody>\n		 \n		</table>	\n\n		<h2>Add client</h2>\n		<form bn-event=\"submit: onAddClient\">\n			<input type=\"text\" placeholder=\"name\" name=\"name\" required><br>\n			<input type=\"number\" placeholder=\"age\" name=\"age\" required><br>\n			<input type=\"submit\" value=\"Add\">\n		</form>	\n	</div>\n	<div title=\"HTML\">\n		<pre bn-text=\"htmlCode\"></pre>\n	</div>\n	<div title=\"Javascript\">\n		<pre bn-text=\"jsCode\"></pre>\n	</div>	\n</div>\n\n	",
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


$$.control.registerControl('test7', {
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n\n	form input {\n		margin-bottom: 5px;\n	}\n</style>\n\n<h2>Clients</h2>\n<table>\n	<thead>\n	  <tr>\n	    <th>Name</th>\n	    <th>Age</th>\n	    <th>Action</th>\n	  </tr>\n	</thead>\n	<tbody bn-each=\"c of clients\" bn-event=\"click.delBtn: onRemoveClient\">\n		<tr bn-data=\"item: c\">\n			<td bn-text=\"c.name\"></td>\n			<td bn-text=\"c.age\"></td>\n			<td><button class=\"delBtn\" title=\"Delete\">Delete</button>\n		</tr>\n\n	</tbody>\n \n</table>	\n\n<button bn-event=\"click: onAddClient\">Add Client</button>",
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

		})

		this.dispose = function() {
			dlgAddClient.destroy()
		}
	}
});

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
	template: "<style type=\"text/css\">\n	table {\n		border-collapse: collapse;		\n	}\n\n	th, td {\n		border: 1px solid green;\n		padding: 5px;\n	}\n	input {\n		margin-bottom: 5px;\n	}\n</style>\n\n<div bn-control=\"brainjs.tabs\">\n  <div title=\"Result\">\n    <h2>Clients</h2>\n    <input type=\"text\" placeholder=\"filter by name\" bn-val=\"filter\" bn-update=\"input\">\n    <table>\n      <thead>\n        <tr>\n          <th>Name</th>\n          <th>Age</th>\n        </tr>\n      </thead>\n      <tbody bn-each=\"client of getFilteredClients\">\n        <tr>\n          <td bn-text=\"client.name\"></td>\n          <td bn-text=\"client.age\"></td>\n        </tr>\n      </tbody>\n       \n    </table>\n  </div>\n  <div title=\"HTML\">\n    <pre bn-text=\"htmlCode\"></pre>\n  </div>\n  <div title=\"Javascript\">\n    <pre bn-text=\"jsCode\"></pre>\n  </div>  \n</div>\n\n",
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





//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ0ZXN0MS5qcyIsInRlc3QxMC5qcyIsInRlc3QxMS5qcyIsInRlc3QxMi5qcyIsInRlc3QyLmpzIiwidGVzdDMuanMiLCJ0ZXN0NC5qcyIsInRlc3Q1LmpzIiwidGVzdDYuanMiLCJ0ZXN0Ny5qcyIsInRlc3Q4LmpzIiwidGVzdDkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuJChmdW5jdGlvbigpIHtcblxuXHRsZXQgcm91dGVzID0gW1xuXHRcdHtocmVmOiAnLycsIHJlZGlyZWN0OiAnL3Rlc3QxJ31cblx0XVxuXHRmb3IobGV0IGkgPSAxOyBpIDw9IDEyOyBpKysgKSB7XG5cdFx0cm91dGVzLnB1c2goe1xuXHRcdFx0aHJlZjogJy90ZXN0JyArIGksIGNvbnRyb2w6ICd0ZXN0JyArIGlcblx0XHR9KVxuXHR9XG5cblxuXG5cdCQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0XHRkYXRhOiB7XG5cdFx0XHRyb3V0ZXNcblx0XHR9XG5cdH0pXG59KTtcbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHA+TWVzc2FnZTogPHNwYW4gYm4tdGV4dD1cIm1lc3NhZ2VcIj48L3NwYW4+PC9wPlx0XG48L2Rpdj5cbmAudHJpbSgpXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MScsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PHAgYm4tdGV4dD1cXFwibWVzc2FnZVxcXCI+PC9wPlx0XHRcdFx0XHRcdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnLFxuXHRcdFx0XHRodG1sQ29kZSxcblx0XHRcdFx0anNDb2RlXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgcmFkaXVzOjEwXG5cdH1cbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PHN2ZyBoZWlnaHQ9XCIxMDBcIiB3aWR0aD1cIjEwMFwiPlxuXHQgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiBibi1hdHRyPVwicjogcmFkaXVzXCIgc3Ryb2tlPVwiYmxhY2tcIiBzdHJva2Utd2lkdGg9XCIzXCIgZmlsbD1cInJlZFwiIC8+XG5cdDwvc3ZnPlxuXHQgIFxuXHQ8aW5wdXQgdHlwZT1cInJhbmdlXCIgYm4tdmFsPVwicmFkaXVzXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj48L2Rpdj5cbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QxMCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PHN2ZyBoZWlnaHQ9XFxcIjEwMFxcXCIgd2lkdGg9XFxcIjEwMFxcXCI+XFxuXHRcdCAgPGNpcmNsZSBjeD1cXFwiNTBcXFwiIGN5PVxcXCI1MFxcXCIgYm4tYXR0cj1cXFwicjogcmFkaXVzXFxcIiBzdHJva2U9XFxcImJsYWNrXFxcIiBzdHJva2Utd2lkdGg9XFxcIjNcXFwiIGZpbGw9XFxcInJlZFxcXCIgLz5cXG5cdFx0PC9zdmc+XFxuXHRcdCAgXFxuXHRcdDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgYm4tdmFsPVxcXCJyYWRpdXNcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcbjIyXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICByYWRpdXM6MTAsXG5cdFx0XHQgIGh0bWxDb2RlLFxuXHRcdFx0ICBqc0NvZGVcblx0XHRcdH1cblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG59KSgpO1xuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdNeVRhYmxlJywgeyAgIFxuICAgIHByb3BzOiB7XG4gICAgXHRjbGllbnRzOiBbXVxuICAgIH0sXG4gICAgdGVtcGxhdGU6ICQoJyN0ZW1wbGF0ZScpLFxuICAgIGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuICAgIFx0Y29uc29sZS5sb2coJ2luaXQnLCB0aGlzLnByb3BzKVxuICAgICAgXG4gICAgICB0aGlzLmN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNsaWVudHM6IHRoaXMucHJvcHMuY2xpZW50c1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgfSBcbiAgfVxuKVxuXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHQgIG15Q2xpZW50czogW1xuXHQgICAge25hbWU6ICdRdWVudGluJywgY2l0eTogJ1Jlbm5lcyd9LFxuXHQgICAge25hbWU6ICdNYXJjJywgY2l0eTogJ0JldGh1bmUnfVxuXHQgIF0sXG5cdCAgbXlDbGllbnRzMjogW1xuXHQgICAge25hbWU6ICdCcmlnaXR0ZScsIGNpdHk6ICdMZSBNYW5zJ30sXG5cdCAgICB7bmFtZTogJ0dlb3JnZXMnLCBjaXR5OiAnVmVycXVpbid9XG5cdCAgXVxuXHR9XG59XG5gLnRyaW0oKVxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DdXN0b20gY29udHJvbDwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cIk15VGFibGVcIiBibi1kYXRhPVwiY2xpZW50czogbXlDbGllbnRzXCI+PC9kaXY+XG5cdDxocj5cblx0PGRpdiBibi1jb250cm9sPVwiTXlUYWJsZVwiIGJuLWRhdGE9XCJjbGllbnRzOiBteUNsaWVudHMyXCI+PC9kaXY+XG48L2Rpdj5cblxuPGRpdiBpZD1cInRlbXBsYXRlXCIgaGlkZGVuPVwiXCI+XG5cdDx0YWJsZT5cblx0XHQ8dGhlYWQ+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0aD5OYW1lPC90aD5cblx0XHRcdFx0PHRoPkNpdHk8L3RoPlxuXHRcdFx0PC90cj5cblx0XHQ8L3RoZWFkPlxuXG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIj5cblx0XHRcdDx0cj5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLm5hbWVcIj48L3RkPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMuY2l0eVwiPjwvdGQ+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGJvZHk+XG5cdDwvdGFibGU+XHRcbjwvZGl2PlxuYC50cmltKClcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ015VGFibGUnLCB7ICAgXG4gICAgcHJvcHM6IHtcbiAgICBcdGNsaWVudHM6IFtdXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogXCI8dGFibGU+XFxuXHQ8dGhlYWQ+XFxuXHRcdDx0cj5cXG5cdFx0XHQ8dGg+TmFtZTwvdGg+XFxuXHRcdFx0PHRoPkNpdHk8L3RoPlxcblx0XHQ8L3RyPlxcblx0PC90aGVhZD5cXG5cXG5cdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHQ8dHI+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcImMubmFtZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5jaXR5XFxcIj48L3RkPlxcblx0XHQ8L3RyPlxcblx0PC90Ym9keT5cXG48L3RhYmxlPlx0XCIsXG4gICAgaW5pdDogZnVuY3Rpb24oZWx0KSB7XG4gICAgXHRjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMucHJvcHMpXG4gICAgICBcbiAgICAgIHRoaXMuY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY2xpZW50czogdGhpcy5wcm9wcy5jbGllbnRzXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICB9IFxuICB9XG4pXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTEnLCB7XG5cdHRlbXBsYXRlOiBcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHR0YWJsZSB7XFxuXHRcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHRcdFxcblx0fVxcblxcblx0dGgsIHRkIHtcXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuXHRcdHBhZGRpbmc6IDVweDtcXG5cdH1cXG5cXG5cdGZvcm0gaW5wdXQge1xcblx0XHRtYXJnaW4tYm90dG9tOiA1cHg7XFxuXHR9XFxuPC9zdHlsZT5cXG5cXG48ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQgIDxoMj5DdXN0b20gY29udHJvbDwvaDI+XFxuXHRcdCAgPGRpdiBibi1jb250cm9sPVxcXCJNeVRhYmxlXFxcIiBibi1kYXRhPVxcXCJjbGllbnRzOiBteUNsaWVudHNcXFwiPjwvZGl2Plxcblx0XHQgIDxocj5cXG5cdFx0ICA8ZGl2IGJuLWNvbnRyb2w9XFxcIk15VGFibGVcXFwiIGJuLWRhdGE9XFxcImNsaWVudHM6IG15Q2xpZW50czJcXFwiPjwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0ICBteUNsaWVudHM6IFtcblx0XHRcdCAgICB7bmFtZTogJ1F1ZW50aW4nLCBjaXR5OiAnUmVubmVzJ30sXG5cdFx0XHQgICAge25hbWU6ICdNYXJjJywgY2l0eTogJ0JldGh1bmUnfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBteUNsaWVudHMyOiBbXG5cdFx0XHQgICAge25hbWU6ICdCcmlnaXR0ZScsIGNpdHk6ICdMZSBNYW5zJ30sXG5cdFx0XHQgICAge25hbWU6ICdHZW9yZ2VzJywgY2l0eTogJ1ZlcnF1aW4nfVxuXHRcdFx0ICBdLFxuXHRcdFx0ICBodG1sQ29kZSxcblx0XHRcdCAganNDb2RlXG5cdFx0XHR9IFxuXHRcdFx0IFxuXG5cdFx0fSlcblx0fVxufSk7XG5cbiAgXG5cblxufSkoKTtcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7IFxuXHRcdGZhdm9yaXRlRnJ1aXRzOlsnYXBwbGUnLCAnb3JhbmdlJ10sXG5cdFx0Z2VuZGVyOiAnbWFsZSdcblx0fSBcbn1cbmAudHJpbSgpXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxkaXYgYm4tY29udHJvbD1cImJyYWluanMuY2hlY2tncm91cFwiIGJuLXZhbD1cImZhdm9yaXRlRnJ1aXRzXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJvcmFuZ2VcIj5PcmFuZ2Vcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJiYW5hbmFzXCI+QmFuYW5hc1xuXHQgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cImFwcGxlXCI+QXBwbGVcblx0ICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCJsZW1vblwiPkxlbW9uXG5cdDwvZGl2PlxuXG5cdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRzXCI+PC9zcGFuPjwvcD5cblxuXHQ8aDI+R2VuZGVyPC9oMj5cblx0PGRpdiBibi1jb250cm9sPVwiYnJhaW5qcy5yYWRpb2dyb3VwXCIgYm4tdmFsPVwiZ2VuZGVyXCIgYm4tdXBkYXRlPVwiaW5wdXRcIj5cblx0ICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJtYWxlXCI+TWFsZVxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cImZlbWFsZVwiPkZlbWFsZVxuXHQ8L2Rpdj5cblx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVwiZ2VuZGVyXCI+PC9zcGFuPjwvcD5cbjwvZGl2PlxuXG5gLnRyaW0oKVxuXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0MTInLCB7XG5cdHRlbXBsYXRlOiBcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHR0YWJsZSB7XFxuXHRcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHRcdFxcblx0fVxcblxcblx0dGgsIHRkIHtcXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuXHRcdHBhZGRpbmc6IDVweDtcXG5cdH1cXG5cXG5cdGZvcm0gaW5wdXQge1xcblx0XHRtYXJnaW4tYm90dG9tOiA1cHg7XFxuXHR9XFxuPC9zdHlsZT5cXG5cXG48ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+RnJ1aXRzPC9oMj5cXG5cdFx0PGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLmNoZWNrZ3JvdXBcXFwiIGJuLXZhbD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcIm9yYW5nZVxcXCI+T3JhbmdlXFxuXHRcdCAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiB2YWx1ZT1cXFwiYmFuYW5hc1xcXCI+QmFuYW5hc1xcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImFwcGxlXFxcIj5BcHBsZVxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgdmFsdWU9XFxcImxlbW9uXFxcIj5MZW1vblxcblx0XHQ8L2Rpdj5cXG5cdFx0XFxuXHRcdCAgPHA+WW91ciBmYXZvcml0IGZydWl0czogPHNwYW4gYm4tdGV4dD1cXFwiZmF2b3JpdGVGcnVpdHNcXFwiPjwvc3Bhbj48L3A+XFxuXFxuXHRcdDxoMj5HZW5kZXI8L2gyPlxcblx0XHQ8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMucmFkaW9ncm91cFxcXCIgYm4tdmFsPVxcXCJnZW5kZXJcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgdmFsdWU9XFxcIm1hbGVcXFwiPk1hbGVcXG5cdFx0ICA8aW5wdXQgdHlwZT1cXFwicmFkaW9cXFwiIHZhbHVlPVxcXCJmZW1hbGVcXFwiPkZlbWFsZVxcblx0XHQ8L2Rpdj5cXG5cdFx0PHA+R2VuZGVyOiA8c3BhbiBibi10ZXh0PVxcXCJnZW5kZXJcXFwiPjwvc3Bhbj48L3A+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuMjJcXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7IFxuXHRcdFx0XHRmYXZvcml0ZUZydWl0czpbJ2FwcGxlJywgJ29yYW5nZSddLFxuXHRcdFx0XHRnZW5kZXI6ICdtYWxlJyxcblx0XHRcdFx0aHRtbENvZGUsXG5cdFx0XHRcdGpzQ29kZVxuXHRcdFx0fSBcblx0XHRcdCBcblxuXHRcdH0pXG5cdH1cbn0pO1xuXG4gIFxuXG5cbn0pKCk7XG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCdcblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiIGJuLXZhbD1cIm1lc3NhZ2VcIiBibi11cGRhdGU9XCJpbnB1dFwiPlxuXHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVwibWVzc2FnZVwiPjwvc3Bhbj48L3A+XHRcbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDInLCB7XG5cdHRlbXBsYXRlOiBcIjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBibi12YWw9XFxcIm1lc3NhZ2VcXFwiIGJuLXVwZGF0ZT1cXFwiaW5wdXRcXFwiPlxcblx0XHQ8cD5NZXNzYWdlOiA8c3BhbiBibi10ZXh0PVxcXCJtZXNzYWdlXFxcIj48L3NwYW4+PC9wPlx0XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtZXNzYWdlOiAnSGVsbG8gV29ybGQnLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0XHRjbGllbnRzOiBbJ01hcmMnLCAnQnJpZ2l0dGUnXVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dWwgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiY1wiPjwvbGk+XG5cdDwvdWw+XG48L2Rpdj5cbmBcblxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ3Rlc3QzJywge1xuXHR0ZW1wbGF0ZTogXCI8ZGl2IGJuLWNvbnRyb2w9XFxcImJyYWluanMudGFic1xcXCI+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJSZXN1bHRcXFwiPlxcblx0XHQ8aDI+Q2xpZW50czwvaDI+XFxuXHRcdDx1bCBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiPlxcblx0XHRcdDxsaSBibi10ZXh0PVxcXCJjXFxcIj48L2xpPlxcblx0XHQ8L3VsPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0Y2xpZW50czogWydNYXJjJywgJ0JyaWdpdHRlJ10sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pXG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddXHRcdFx0XG5cdH0sXG5cdGV2ZW50czoge1xuXHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKS5uYW1lKVxuXHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXG5cdFx0fVxuXHR9XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkNsaWVudHM8L2gyPlxuXHQ8dWwgYm4tZWFjaD1cImMgb2YgY2xpZW50c1wiPlxuXHRcdDxsaSBibi10ZXh0PVwiY1wiPjwvbGk+XG5cdDwvdWw+XG5cblx0PGgyPkFkZCBjbGllbnQ8L2gyPlxuXHQ8Zm9ybSBibi1ldmVudD1cInN1Ym1pdDogb25BZGRDbGllbnRcIj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuYW1lPVwibmFtZVwiIGF1dG9mb2N1cz1cIlwiIHJlcXVpcmVkPVwiXCI+XG5cdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+QWRkPC9idXR0b24+XG5cdDwvZm9ybT5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkNsaWVudHM8L2gyPlxcblx0XHQ8dWwgYm4tZWFjaD1cXFwiYyBvZiBjbGllbnRzXFxcIj5cXG5cdFx0XHQ8bGkgYm4tdGV4dD1cXFwiY1xcXCI+PC9saT5cXG5cdFx0PC91bD5cXG5cXG5cdFx0PGgyPkFkZCBjbGllbnQ8L2gyPlxcblx0XHQ8Zm9ybSBibi1ldmVudD1cXFwic3VibWl0OiBvbkFkZENsaWVudFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiBhdXRvZm9jdXM9XFxcIlxcXCIgcmVxdWlyZWQ9XFxcIlxcXCI+XFxuXHRcdFx0PGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiPkFkZDwvYnV0dG9uPlxcblx0XHQ8L2Zvcm0+XHRcXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcblx0PC9kaXY+XHRcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGNsaWVudHM6IFsnTWFyYycsICdCcmlnaXR0ZSddLFxuXHRcdFx0XHRodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcdFx0XHRcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpLm5hbWUpXG5cdFx0XHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcblxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFx0XG5cblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgIGNsaWVudHM6IFtcblx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHQgICAgXVxuXHR9XHRcbn1cbmBcblxuY29uc3QgaHRtbENvZGUgPSBgXG48ZGl2IGlkPVwibWFpblwiPlxuXHQ8dGFibGU+XG5cdFx0PHRoZWFkPlxuXHRcdCAgPHRyPlxuXHRcdCAgICA8dGg+TmFtZTwvdGg+XG5cdFx0ICAgIDx0aD5BZ2U8L3RoPlxuXHRcdCAgPC90cj5cblx0XHQ8L3RoZWFkPlxuXHRcdDx0Ym9keSBibi1lYWNoPVwiYyBvZiBjbGllbnRzXCI+XG5cdFx0XHQ8dHI+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5uYW1lXCI+PC90ZD5cblx0XHRcdFx0PHRkIGJuLXRleHQ9XCJjLmFnZVwiPjwvdGQ+XG5cdFx0XHQ8L3RyPlxuXHRcdDwvdGJvZHk+XG5cdCBcblx0PC90YWJsZT5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDUnLCB7XG5cdHRlbXBsYXRlOiBcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHR0YWJsZSB7XFxuXHRcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHRcdFxcblx0fVxcblxcblx0dGgsIHRkIHtcXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuXHRcdHBhZGRpbmc6IDVweDtcXG5cdH1cXG48L3N0eWxlPlxcblxcbjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDx0YWJsZT5cXG5cdFx0XHQ8dGhlYWQ+XFxuXHRcdFx0ICA8dHI+XFxuXHRcdFx0ICAgIDx0aD5OYW1lPC90aD5cXG5cdFx0XHQgICAgPHRoPkFnZTwvdGg+XFxuXHRcdFx0ICA8L3RyPlxcblx0XHRcdDwvdGhlYWQ+XFxuXHRcdFx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCI+XFxuXHRcdFx0XHQ8dHI+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLmFnZVxcXCI+PC90ZD5cXG5cdFx0XHRcdDwvdHI+XFxuXFxuXHRcdFx0PC90Ym9keT5cdFx0IFxcblx0XHQ8L3RhYmxlPlxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2PlxcblwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihlbHQsIHtcblx0XHRcdGRhdGE6IHtcblx0XHRcdCAgICBjbGllbnRzOiBbXG5cdFx0XHQgICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0XHRcdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHRcdFx0ICAgIF0sXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdFxuXHRcdFx0fVx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXG5cbmNvbnN0IGpzQ29kZSA9IGBcbmNvbnN0IGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcignI21haW4nLCB7XG5cdGRhdGE6IHtcblx0ICAgIGNsaWVudHM6IFtcblx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdCAgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fVxuXHQgICAgXVxuXHR9LFxuXHRldmVudHM6IHtcblx0XHRvbkFkZENsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxuXHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdH0sXG5cdFx0b25SZW1vdmVDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcblx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0Y3RybC51cGRhdGUoJ2NsaWVudHMnKVxuXHRcdH1cblx0fVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PHRhYmxlPlxuXHRcdDx0aGVhZD5cblx0XHQgIDx0cj5cblx0XHQgICAgPHRoPk5hbWU8L3RoPlxuXHRcdCAgICA8dGg+QWdlPC90aD5cblx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XG5cdFx0ICA8L3RyPlxuXHRcdDwvdGhlYWQ+XG5cdFx0PHRib2R5IGJuLWVhY2g9XCJjIG9mIGNsaWVudHNcIiBibi1ldmVudD1cImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcIj5cblx0XHRcdDx0ciBibi1kYXRhPVwiaXRlbTogY1wiPlxuXHRcdFx0XHQ8dGQgYm4tdGV4dD1cImMubmFtZVwiPjwvdGQ+XG5cdFx0XHRcdDx0ZCBibi10ZXh0PVwiYy5hZ2VcIj48L3RkPlxuXHRcdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cImRlbEJ0blwiIHRpdGxlPVwiRGVsZXRlXCI+RGVsZXRlPC9idXR0b24+XG5cdFx0XHQ8L3RyPlxuXG5cdFx0PC90Ym9keT5cblx0IFxuXHQ8L3RhYmxlPlx0XG5cblx0PGgyPkFkZCBjbGllbnQ8L2gyPlxuXHQ8Zm9ybSBibi1ldmVudD1cInN1Ym1pdDogb25BZGRDbGllbnRcIj5cblx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIm5hbWVcIiBuYW1lPVwibmFtZVwiIHJlcXVpcmVkPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cIm51bWJlclwiIHBsYWNlaG9sZGVyPVwiYWdlXCIgbmFtZT1cImFnZVwiIHJlcXVpcmVkPjxicj5cblx0XHQ8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQWRkXCI+XG5cdDwvZm9ybT5cdFxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0NicsIHtcblx0dGVtcGxhdGU6IFwiPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdHRhYmxlIHtcXG5cdFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcdFx0XFxuXHR9XFxuXFxuXHR0aCwgdGQge1xcblx0XHRib3JkZXI6IDFweCBzb2xpZCBncmVlbjtcXG5cdFx0cGFkZGluZzogNXB4O1xcblx0fVxcblxcblx0Zm9ybSBpbnB1dCB7XFxuXHRcdG1hcmdpbi1ib3R0b206IDVweDtcXG5cdH1cXG48L3N0eWxlPlxcblxcbjxkaXYgYm4tY29udHJvbD1cXFwiYnJhaW5qcy50YWJzXFxcIj5cXG5cdDxkaXYgdGl0bGU9XFxcIlJlc3VsdFxcXCI+XFxuXHRcdDxoMj5DbGllbnRzPC9oMj5cXG5cdFx0PHRhYmxlPlxcblx0XHRcdDx0aGVhZD5cXG5cdFx0XHQgIDx0cj5cXG5cdFx0XHQgICAgPHRoPk5hbWU8L3RoPlxcblx0XHRcdCAgICA8dGg+QWdlPC90aD5cXG5cdFx0XHQgICAgPHRoPkFjdGlvbjwvdGg+XFxuXHRcdFx0ICA8L3RyPlxcblx0XHRcdDwvdGhlYWQ+XFxuXHRcdFx0PHRib2R5IGJuLWVhY2g9XFxcImMgb2YgY2xpZW50c1xcXCIgYm4tZXZlbnQ9XFxcImNsaWNrLmRlbEJ0bjogb25SZW1vdmVDbGllbnRcXFwiPlxcblx0XHRcdFx0PHRyIGJuLWRhdGE9XFxcIml0ZW06IGNcXFwiPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5uYW1lXFxcIj48L3RkPlxcblx0XHRcdFx0XHQ8dGQgYm4tdGV4dD1cXFwiYy5hZ2VcXFwiPjwvdGQ+XFxuXHRcdFx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC90cj5cXG5cXG5cdFx0XHQ8L3Rib2R5Plxcblx0XHQgXFxuXHRcdDwvdGFibGU+XHRcXG5cXG5cdFx0PGgyPkFkZCBjbGllbnQ8L2gyPlxcblx0XHQ8Zm9ybSBibi1ldmVudD1cXFwic3VibWl0OiBvbkFkZENsaWVudFxcXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgcGxhY2Vob2xkZXI9XFxcImFnZVxcXCIgbmFtZT1cXFwiYWdlXFxcIiByZXF1aXJlZD48YnI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XFxcInN1Ym1pdFxcXCIgdmFsdWU9XFxcIkFkZFxcXCI+XFxuXHRcdDwvZm9ybT5cdFxcblx0PC9kaXY+XFxuXHQ8ZGl2IHRpdGxlPVxcXCJIVE1MXFxcIj5cXG5cdFx0PHByZSBibi10ZXh0PVxcXCJodG1sQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkphdmFzY3JpcHRcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImpzQ29kZVxcXCI+PC9wcmU+XFxuXHQ8L2Rpdj5cdFxcbjwvZGl2Plxcblxcblx0XCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0ICAgIGNsaWVudHM6IFtcblx0XHRcdCAgICAgIHtuYW1lOiAnTWFyYycsIGFnZTogMjB9LFxuXHRcdFx0ICAgICAge25hbWU6ICdCcmlnaXR0ZScsIGFnZTogMTh9XG5cdFx0XHQgICAgXSxcblx0XHRcdCAgICBodG1sQ29kZTogaHRtbENvZGUudHJpbSgpLFxuXHRcdFx0XHRqc0NvZGU6IGpzQ29kZS50cmltKClcblx0XHRcdH0sXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25BZGRDbGllbnQ6IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ29uQWRkQ2xpZW50Jylcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5wdXNoKCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblJlbW92ZUNsaWVudDogZnVuY3Rpb24oZXYpIHtcblx0XHRcdFx0XHR2YXIgZGF0YSA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpdGVtJylcbiAgICAgIFx0XHRcdFx0dmFyIGlkeCA9IGN0cmwubW9kZWwuY2xpZW50cy5pbmRleE9mKGRhdGEpXG4gICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKCdvblJlbW92ZUNsaWVudCcsIGlkeCwgZGF0YSlcblx0XHRcdFx0XHRjdHJsLm1vZGVsLmNsaWVudHMuc3BsaWNlKGlkeCwgMSlcblx0XHRcdFx0XHRjdHJsLnVwZGF0ZSgnY2xpZW50cycpXG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XHRcblx0XHRcblx0XHR9KVxuXHR9XG59KVxuXG59KSgpO1xuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDcnLCB7XG5cdHRlbXBsYXRlOiBcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHR0YWJsZSB7XFxuXHRcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHRcdFxcblx0fVxcblxcblx0dGgsIHRkIHtcXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuXHRcdHBhZGRpbmc6IDVweDtcXG5cdH1cXG5cXG5cdGZvcm0gaW5wdXQge1xcblx0XHRtYXJnaW4tYm90dG9tOiA1cHg7XFxuXHR9XFxuPC9zdHlsZT5cXG5cXG48aDI+Q2xpZW50czwvaDI+XFxuPHRhYmxlPlxcblx0PHRoZWFkPlxcblx0ICA8dHI+XFxuXHQgICAgPHRoPk5hbWU8L3RoPlxcblx0ICAgIDx0aD5BZ2U8L3RoPlxcblx0ICAgIDx0aD5BY3Rpb248L3RoPlxcblx0ICA8L3RyPlxcblx0PC90aGVhZD5cXG5cdDx0Ym9keSBibi1lYWNoPVxcXCJjIG9mIGNsaWVudHNcXFwiIGJuLWV2ZW50PVxcXCJjbGljay5kZWxCdG46IG9uUmVtb3ZlQ2xpZW50XFxcIj5cXG5cdFx0PHRyIGJuLWRhdGE9XFxcIml0ZW06IGNcXFwiPlxcblx0XHRcdDx0ZCBibi10ZXh0PVxcXCJjLm5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0PHRkIGJuLXRleHQ9XFxcImMuYWdlXFxcIj48L3RkPlxcblx0XHRcdDx0ZD48YnV0dG9uIGNsYXNzPVxcXCJkZWxCdG5cXFwiIHRpdGxlPVxcXCJEZWxldGVcXFwiPkRlbGV0ZTwvYnV0dG9uPlxcblx0XHQ8L3RyPlxcblxcblx0PC90Ym9keT5cXG4gXFxuPC90YWJsZT5cdFxcblxcbjxidXR0b24gYm4tZXZlbnQ9XFxcImNsaWNrOiBvbkFkZENsaWVudFxcXCI+QWRkIENsaWVudDwvYnV0dG9uPlwiLFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblx0XHRjb25zdCBkbGdBZGRDbGllbnQgPSAkJC5mb3JtRGlhbG9nQ29udHJvbGxlcih7XG5cdFx0XHR0aXRsZTogJ0FkZCBDbGllbnQnLFxuXHRcdFx0dGVtcGxhdGU6IFwiPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJuYW1lXFxcIiBuYW1lPVxcXCJuYW1lXFxcIiByZXF1aXJlZD48YnI+XFxuPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgcGxhY2Vob2xkZXI9XFxcImFnZVxcXCIgbmFtZT1cXFwiYWdlXFxcIiByZXF1aXJlZD48YnI+IFx0XHRcIlxuXHRcdH0pXG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgICAgY2xpZW50czogW1xuXHRcdFx0ICAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdFx0XHQgICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH1cblx0XHRcdCAgICBdXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdG9uQWRkQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdvbkFkZENsaWVudCcpXG5cdFx0XHRcdFx0ZGxnQWRkQ2xpZW50LnNob3coZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdFx0Y3RybC5tb2RlbC5jbGllbnRzLnB1c2goZGF0YSlcblx0XHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcdFxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uUmVtb3ZlQ2xpZW50OiBmdW5jdGlvbihldikge1xuXHRcdFx0XHRcdHZhciBkYXRhID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmRhdGEoJ2l0ZW0nKVxuICAgICAgXHRcdFx0XHR2YXIgaWR4ID0gY3RybC5tb2RlbC5jbGllbnRzLmluZGV4T2YoZGF0YSlcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coJ29uUmVtb3ZlQ2xpZW50JywgaWR4LCBkYXRhKVxuXHRcdFx0XHRcdGN0cmwubW9kZWwuY2xpZW50cy5zcGxpY2UoaWR4LCAxKVxuXHRcdFx0XHRcdGN0cmwudXBkYXRlKCdjbGllbnRzJylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHRcdHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGxnQWRkQ2xpZW50LmRlc3Ryb3koKVxuXHRcdH1cblx0fVxufSk7XG4iLCIoZnVuY3Rpb24oKXtcblxuXG5jb25zdCBqc0NvZGUgPSBgXG5jb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoJyNtYWluJywge1xuXHRkYXRhOiB7XG5cdCAgZnJ1aXRzOlsnb3JhbmdlJywgJ2FwcGxlJywgJ2JhbmFuYXMnLCAnbGVtb24nXSxcblx0ICBmYXZvcml0ZUZydWl0OidhcHBsZSdcblx0fVx0XG59XG5gXG5cbmNvbnN0IGh0bWxDb2RlID0gYFxuPGRpdiBpZD1cIm1haW5cIj5cblx0PGgyPkZydWl0czwvaDI+XG5cdDxzZWxlY3QgYm4tdmFsPVwiZmF2b3JpdGVGcnVpdFwiIGJuLXVwZGF0ZT1cImNoYW5nZVwiIGJuLWVhY2g9XCJmIG9mIGZydWl0c1wiPlxuXHRcdDxvcHRpb24gYm4tdGV4dD1cImZcIj48L29wdGlvbj5cblx0PC9zZWxlY3Q+XG5cdDxwPllvdXIgZmF2b3JpdCBmcnVpdDogPHNwYW4gYm4tdGV4dD1cImZhdm9yaXRlRnJ1aXRcIj48L3NwYW4+PC9wPlxuPC9kaXY+XG5gXG5cbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCd0ZXN0OCcsIHtcblx0dGVtcGxhdGU6IFwiPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcblx0PGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG5cdFx0PGgyPkZydWl0czwvaDI+XFxuXHRcdDxzZWxlY3QgYm4tdmFsPVxcXCJmYXZvcml0ZUZydWl0XFxcIiBibi11cGRhdGU9XFxcImNoYW5nZVxcXCIgYm4tZWFjaD1cXFwiZiBvZiBmcnVpdHNcXFwiPlxcblx0XHRcdDxvcHRpb24gYm4tdGV4dD1cXFwiZlxcXCI+PC9vcHRpb24+XFxuXHRcdDwvc2VsZWN0Plxcblx0XHQ8cD5Zb3VyIGZhdm9yaXQgZnJ1aXQ6IDxzcGFuIGJuLXRleHQ9XFxcImZhdm9yaXRlRnJ1aXRcXFwiPjwvc3Bhbj48L3A+XFxuXHQ8L2Rpdj5cXG5cdDxkaXYgdGl0bGU9XFxcIkhUTUxcXFwiPlxcblx0XHQ8cHJlIGJuLXRleHQ9XFxcImh0bWxDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plxcblx0PGRpdiB0aXRsZT1cXFwiSmF2YXNjcmlwdFxcXCI+XFxuXHRcdDxwcmUgYm4tdGV4dD1cXFwianNDb2RlXFxcIj48L3ByZT5cXG5cdDwvZGl2Plx0XFxuPC9kaXY+XFxuXFxuXCIsXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGVsdCwge1xuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRmcnVpdHM6WydvcmFuZ2UnLCAnYXBwbGUnLCAnYmFuYW5hcycsICdsZW1vbiddLFxuXHRcdFx0XHRmYXZvcml0ZUZydWl0OidhcHBsZScsXG5cdFx0XHRcdGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcdCAgXG5cdFx0XHR9XHRcdFx0XG5cdFx0XG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCl7XG5cblxuY29uc3QganNDb2RlID0gYFxuY29uc3QgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKCcjbWFpbicsIHtcblx0ZGF0YToge1xuXHQgICBjbGllbnRzOltcblx0ICAgICB7bmFtZTogJ01hcmMnLCBhZ2U6IDIwfSxcblx0ICAgICB7bmFtZTogJ0JyaWdpdHRlJywgYWdlOiAxOH0sXG5cdCAgICAge25hbWU6ICdMdWNhcycsIGFnZTogMjJ9LFxuXHQgICAgIHtuYW1lOiAnUXVlbnRpbicsIGFnZTogMTV9LFxuXHQgICAgIHtuYW1lOiAnTGF1cmVudCcsIGFnZTogMzJ9XG5cdCAgIF0sXG5cdCAgIGZpbHRlcjonJyxcblx0ICAgZ2V0RmlsdGVyZWRDbGllbnRzOiBmdW5jdGlvbigpIHtcblx0ICAgICB2YXIgZmlsdGVyID0gdGhpcy5maWx0ZXJcblx0ICAgICByZXR1cm4gdGhpcy5jbGllbnRzLmZpbHRlcihmdW5jdGlvbihjbGllbnQpIHtcblx0ICAgICAgIHJldHVybiBjbGllbnQubmFtZS5zdGFydHNXaXRoKGZpbHRlcik7XG5cdCAgICAgfSlcblx0ICAgfSAgICBcblxuXHQgfVxufVxuYFxuXG5jb25zdCBodG1sQ29kZSA9IGBcbjxkaXYgaWQ9XCJtYWluXCI+XG5cdDxoMj5DbGllbnRzPC9oMj5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgYnkgbmFtZVwiIGJuLXZhbD1cImZpbHRlclwiIGJuLXVwZGF0ZT1cImlucHV0XCI+XG5cdDx0YWJsZT5cblx0ICA8dGhlYWQ+XG5cdCAgICA8dHI+XG5cdCAgICAgIDx0aD5OYW1lPC90aD5cblx0ICAgICAgPHRoPkFnZTwvdGg+XG5cdCAgICA8L3RyPlxuXHQgIDwvdGhlYWQ+XG5cdCAgPHRib2R5IGJuLWVhY2g9XCJjbGllbnQgb2YgZ2V0RmlsdGVyZWRDbGllbnRzXCI+XG5cdCAgICA8dHI+XG5cdCAgICAgIDx0ZCBibi10ZXh0PVwiY2xpZW50Lm5hbWVcIj48L3RkPlxuXHQgICAgICA8dGQgYm4tdGV4dD1cImNsaWVudC5hZ2VcIj48L3RkPlxuXHQgICAgPC90cj5cblx0ICA8L3Rib2R5PlxuXHQgICBcblx0PC90YWJsZT5cbjwvZGl2PlxuYFxuXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgndGVzdDknLCB7XG5cdHRlbXBsYXRlOiBcIjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHR0YWJsZSB7XFxuXHRcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHRcdFxcblx0fVxcblxcblx0dGgsIHRkIHtcXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuXHRcdHBhZGRpbmc6IDVweDtcXG5cdH1cXG5cdGlucHV0IHtcXG5cdFx0bWFyZ2luLWJvdHRvbTogNXB4O1xcblx0fVxcbjwvc3R5bGU+XFxuXFxuPGRpdiBibi1jb250cm9sPVxcXCJicmFpbmpzLnRhYnNcXFwiPlxcbiAgPGRpdiB0aXRsZT1cXFwiUmVzdWx0XFxcIj5cXG4gICAgPGgyPkNsaWVudHM8L2gyPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcImZpbHRlciBieSBuYW1lXFxcIiBibi12YWw9XFxcImZpbHRlclxcXCIgYm4tdXBkYXRlPVxcXCJpbnB1dFxcXCI+XFxuICAgIDx0YWJsZT5cXG4gICAgICA8dGhlYWQ+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgIDx0aD5OYW1lPC90aD5cXG4gICAgICAgICAgPHRoPkFnZTwvdGg+XFxuICAgICAgICA8L3RyPlxcbiAgICAgIDwvdGhlYWQ+XFxuICAgICAgPHRib2R5IGJuLWVhY2g9XFxcImNsaWVudCBvZiBnZXRGaWx0ZXJlZENsaWVudHNcXFwiPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICA8dGQgYm4tdGV4dD1cXFwiY2xpZW50Lm5hbWVcXFwiPjwvdGQ+XFxuICAgICAgICAgIDx0ZCBibi10ZXh0PVxcXCJjbGllbnQuYWdlXFxcIj48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICA8L3Rib2R5PlxcbiAgICAgICBcXG4gICAgPC90YWJsZT5cXG4gIDwvZGl2PlxcbiAgPGRpdiB0aXRsZT1cXFwiSFRNTFxcXCI+XFxuICAgIDxwcmUgYm4tdGV4dD1cXFwiaHRtbENvZGVcXFwiPjwvcHJlPlxcbiAgPC9kaXY+XFxuICA8ZGl2IHRpdGxlPVxcXCJKYXZhc2NyaXB0XFxcIj5cXG4gICAgPHByZSBibi10ZXh0PVxcXCJqc0NvZGVcXFwiPjwvcHJlPlxcbiAgPC9kaXY+ICBcXG48L2Rpdj5cXG5cXG5cIixcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZWx0LCB7XG5cdFx0XHRkYXRhOiB7XG5cdFx0XHQgICBjbGllbnRzOltcblx0XHRcdCAgICAge25hbWU6ICdNYXJjJywgYWdlOiAyMH0sXG5cdFx0XHQgICAgIHtuYW1lOiAnQnJpZ2l0dGUnLCBhZ2U6IDE4fSxcblx0XHRcdCAgICAge25hbWU6ICdMdWNhcycsIGFnZTogMjJ9LFxuXHRcdFx0ICAgICB7bmFtZTogJ1F1ZW50aW4nLCBhZ2U6IDE1fSxcblx0XHRcdCAgICAge25hbWU6ICdMYXVyZW50JywgYWdlOiAzMn1cblx0XHRcdCAgIF0sXG5cdFx0XHQgICBmaWx0ZXI6JycsXG5cdFx0XHQgICBnZXRGaWx0ZXJlZENsaWVudHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0ICAgICB2YXIgZmlsdGVyID0gdGhpcy5maWx0ZXJcblx0XHRcdCAgICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoZnVuY3Rpb24oY2xpZW50KSB7XG5cdFx0XHQgICAgICAgcmV0dXJuIGNsaWVudC5uYW1lLnN0YXJ0c1dpdGgoZmlsdGVyKTtcblx0XHRcdCAgICAgfSlcblxuXHRcdFx0ICAgfSxcblx0XHRcdCAgIGh0bWxDb2RlOiBodG1sQ29kZS50cmltKCksXG5cdFx0XHRcdGpzQ29kZToganNDb2RlLnRyaW0oKVx0XHRcblxuXG5cdFx0XHQgfVxuXG5cdFx0fSlcblx0fVxufSlcblxufSkoKTtcblxuXG5cblxuIl19
