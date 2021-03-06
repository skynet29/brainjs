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
	template: {gulp_inject: './test8.html'},
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

