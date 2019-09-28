(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {

        items: [
	            {"text": "\\uf015", "action": "toto", color: 'red'},
	            {"text": "\\uf099", "color": "blue"}
            ]
        }
    },
    events: {
    	onMenuSelected: function(ev, data) {
    		console.log('onMenuSelected', data)
    	}
    }	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div style="width:300px; height: 300px; border: 1px solid black;">
	    <div bn-control="brainjs.circularmenu" 
		    bn-data="{
		    	radius: 120,
		    	iconPos: 80,
		    	innerRadius: 40,
		    	items,
		    	triggerPos: {left: 100, top: 200}		    	
		    }"
	    	bn-event="menuSelected: onMenuSelected" 
	    	></div>
	</div>
</div>
`.trim()


$$.control.registerControl('test22', {
	template: {gulp_inject: './test22.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {

		        items: [
		           {text: '\uf015', className: 'fa', action: 'toto', color: 'red'},
		           {text: '\uf099', className: 'fab', color: 'blue'}
		        ],
		        jsCode,
		        htmlCode
		    },
		    events: {
		    	onMenuSelected: function(ev, data) {
		    		console.log('onMenuSelected', data)
		    	}
		    }
		})

	}
})


  


})();





