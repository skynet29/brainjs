(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		values: [ 75, 300 ],
		value: 50
	}	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div  style="padding: 20px;">
		<div bn-control="brainjs.slider" bn-val="value" bn-update="input"></div>	
		<div style="margin-bottom: 10px;">
			<label>Value</label>	
			<span bn-text="value"></span>			
		</div>

		<div bn-control="brainjs.slider" bn-val="values" bn-data="{min: 0, max: 500}" bn-update="input"></div>	
		<div>
			<label>Values</label>	
			<span bn-text="values"></span>			
		</div>

	</div>
</div>
`.trim()


$$.control.registerControl('test25', {
	template: {gulp_inject: './test25.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				values: [ 75, 300 ],
				value: 50,
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





