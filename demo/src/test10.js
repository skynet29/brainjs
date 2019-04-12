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
	template: {gulp_inject: './test10.html'},
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





