(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		date: new Date(1972, 0, 3)
	}
}
`.trim()

const htmlCode = `
<div id="main">
	<input type="text" bn-control="brainjs.datepicker" bn-val="date" bn-update="datepickerchange">
	<p>Date: <span bn-text="date.toDateString()"></span></p>
</div>
`.trim()


$$.control.registerControl('test14', {
	template: {gulp_inject: './test14.html'},
	init: function(elt) {

		this.ctrl = $$.viewController(elt, {
			data: { 
				date: new Date(1972, 0, 3),
				toDateString: function() {return this.date.toDateString()},
				htmlCode,
				jsCode,
			},
		 
		})

	}
})


  


})();





