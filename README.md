# brainjs
BrainJS is a javascript binding library

A binding library is a library to bind a data model (methods and attributs of an object) to HTML elements. 

I started writting this library after my experience with other popular binding libraries like angularjs, reactjs and vuejs.
I love working with angularjs directive but writting your own directive to make component was a real pain.
React is really cool but there is no more separation between HTML, CSS and javascript code

Like angularjs (i.e angular 1), brainjs use proprietary HTML attributs starting with bn- prefix:
- bn-text
- bn-attr
- bn-model
- bn-event
- bn-visible
- bn-each
- bn-control

To attach an HTML fragment to a view model, you must create a ViewControler object by specifying a CSS selector to identify the fragment and a object with an init method to initialize your model attributs. Once created, call the render method to activate the binding

HTML code
````
<div id="main">
  <p>Welcome  <span bn-text="name"/></p>
</div>
````

Javascript code
````
var ctrl = new brain.ViewControler('#main', {
  init: function() {
    this.name = 'Marc'
  }
})
ctrl.render()
````


To get started, see the examples on my codepen page https://codepen.io/collection/AKgVOW

BrainJS is based on the excellent jQuery library so you must reference this library before using brainjs
