(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: { 
		center: {lat: 48.39, lng: -4.486} // Brest city
	},

}
`.trim()

const htmlCode = `
<div id="main">
	<div bn-control="brainjs.map" bn-data="center: center"></div>
</div>
`.trim()


$$.control.registerControl('test17', {
	template: {gulp_inject: './test17.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				center: {lat: 48.39, lng: -4.486}
			}
		})

		this.ctrl = ctrl

	}
})


  


})();





