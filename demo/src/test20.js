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
	template: {gulp_inject: './test20.html'},
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





