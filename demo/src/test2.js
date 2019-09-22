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
	template: {gulp_inject: './test2.html'},
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


