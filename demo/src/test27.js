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
	template: {gulp_inject: './test27.html'},
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

