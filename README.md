
# BrainJS

BrainJS is a library to bind a data model (methods and attributs of an object) to HTML elements. 

I started writting this library after my experience with other popular binding libraries like angularjs, reactjs and vuejs. At the begining, it was just like a challenge for me.
I love working with Angularjs directive but writting your own directive to make component was a real pain.
React is really cool but there is no more separation between HTML, CSS and javascript code

Like angularjs (i.e angular 1), brainjs use proprietary HTML attributs starting with bn- prefix:
- bn-text
- bn-html
- bn-attr
- bn-style
- bn-class
- bn-val
- bn-event
- bn-show
- bn-each
- bn-control

To attach an HTML fragment to a view model, you must create a ViewController object by specifying a CSS selector to identify the fragment and a object with a data field to initialize your model attributs.

HTML code
````html
<div id="main">
  <p>Welcome  <span bn-text="name"/></p>
</div>
````

Javascript code
````javascript
var ctrl = $$.viewController('#main', {
  data: {
    name:'Marc'
  }
})
````

To update your data model, you can either modify your attributs and call the update method, or call directly the setData method with the new value.

HTML code
````html
<div id="main">
  <p bn-style="{color: color}">Welcome  <span bn-text="name"/></p><br/>
  <button bn-event="click: onClick">Update</button>
</div>
````

Javascript code
````javascript
var ctrl = $$.viewController('#main', {
  data: {
    name:'Marc',
    color:'black'
  },
  events: {
    onClick: function(ev) {
      ctrl.setData({name: 'Quentin', color: 'green'})
      /* another solution, useful when modifying array attributs
        ctrl.model.name = 'Quentin'
        ctrl.model.color = 'green'
        ctrl.update()
      */
    }
  }
})
````
As you can see, the event handler must be defined in the **events** attribut of your model.

## Getting started

To get started, see the examples on the <a href="https://skynet29.github.io/brainjs/dist/index.html" target="_blank">demo app</a>  or try yourself on my <a href="https://jsfiddle.net/user/skynet39/fiddles/" target="_blank">jsfiddles</a>.

ViewController is based on the jQuery and jQuery UI library which are bundled in the file brainjs.js in the dist folder.

## Documentation

The documentation is available <a href="https://skynet29.github.io/brainjs/dist/doc.html" target="_blank">here</a>



# Controls

## Using controls

To use a control in your HTML, add a **bn-control** parameter to an HTML tag depending of the control type (most of the time a **div** tag) with the name of the control to create.

``
A way to parameter your control is to use custom HTML parameters

Example with static custom parameter

HTML code
````html
<div id="main">
  <div bn-control="MyControl" data-title="Hello World"></div>  
</div>  
````
Note: custom parameter must use the **data-** prefix.

If you want tu use a binding to your view control, use the **bn-data** directive:

Example with dynamic custom parameter

HTML code
````html
<div id="main">
  <div bn-control="MyControl" bn-data="{title: myTitle}"></div>  
</div>  
````

Javascript code
````javascript
var ctrl = $$.viewController('#main', {
  data: {
    myTitle: 'Hello World'
  }
})
````

## Create a new control

To create a new control, use the framework **registerControl** function:

Javascript code

````javascript
$$.control.registerControl('MyControl', {
  props: {
    title: 'No title'
  }
  init: function(elt) {
    const title = this.props.title
  
    elt.append(`<h1>${title}</h1>`)
  }
})
````

**elt** is a jQuery object of the HTML tag with bn-control directive.

As you can see, you do not have to use viewController. Here we use ES6 template string.


## Create a control using services

Here you are creating a control which use the HTTP service to retrieve data from the server.

Javascript code
````javascript
$$.control.registerControl('MyControl', {
  deps: ['HttpService'],
  init: function(elt, http) {
    var ctrl = $$.viewControler(elt, {
      data: {
        users: []
      }
    })
      
     http.get('/api/users').then(function(users) {
        ctrl.setData({users})
      })			
    }

  }
  
})
````

The **deps** field is an string array of service name. Services are automatically injected by the framework in the control constructor (init function).

HTML file
 
````html
<div>
  <h2>Users<h2>
  <ul bn-each=“user of users">
    <li bn-text=“user”></li>
  </ul>
</div>
````

## control with an external interface

Javascript code
````javascript
$$.control.registerControl('MyControl3', {
  init: function(elt) {
		
    elt.append(`<label>Name</label><input type="text">`)

    this.getName = function() {
      return elt.find('input').val()
    }

    this.setName = function(value) {
      elt.find('input').val(value)
    }   
  }    
})
````

Exported function has to be added to the **this** object.

To access an interface control use the jQuery **iface** function or use the **bn-iface** directive to bind the interface to your controler scope object.

````html
<div id="main">
  <div bn-control="MyControl3" bn-iface="myCtrl"></div>
</div>
````

````javascript
$(function() {

  var ctrl = $$.viewControler('#main')
  
  ctrl.scope.myCtrl.setName('Hello')	
})
````

## control with custom parameters

Javascript code
````javascript
$$.control.registerControl('MyControl4', {

	props: {
		roll: 0,
		pitch: 0
	},
	init: function(elt, options) {
		
		const ctrl = $$.viewControler(elt, {
			data: {
				roll: this.props.roll,
				pitch: this.props.pitch
			}
			
		})
	
		this.update = function(data) {
			ctrl.setData(data)
		}		
	}
		     
})
````

To add custom parameter, add the name to the **props** object and export the setter function in the **this** object in the constructor function.

## control specific interface function

Certain interface name have a specific meaning.

The **dipose** function name is called when present by the framework when the HTML tag associated to the control is destroyed.
It is the opportunity for your control to clean up its data (stop running timers, unregister websocket topic, etc...)

Example of code:
````javascript
$$.control.registerControl(‘MyControl5’, {
	deps: ['WebSocketService'],
	init: function(elt, options, client) 	{

		function onLauncherStatus(msg) {
			...
		}
		client.register('launcherStatus', true, onLauncherStatus)

		this.dispose = function() {
			client.unregister('launcherStatus', onLauncherStatus)
		}
	}
})
````

If you want to create a control which has the same behavior as HTML input tag (input, select, etc..), your control has to export a **setValue** and **getValue** function.

# Services

## Create a new service

To create a new service, the framework porvides the **registerService** function.
````javascript
$$.service.registerService('UsersService', ['HttpService'], function(http) {
	return {
		getUsers: function() {
			return http.get('/api/users')
		}
	}
})
````

the first argument id the service name, the second a string array of service dependancies and the last is a function which must return an object which provides the service.

Like controls, services use dependancies injection mechanism.

## Configure a service

To configure a service, use the framework **configureService** function.

````javascript
$(function() {

	$$.service.configureService('WebSocketService', {id: 'ClientsMonitoring'})

	...
})
````
