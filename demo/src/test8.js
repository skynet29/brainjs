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
	template: {gulp_inject: './test8.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt.children(), {
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

