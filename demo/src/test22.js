(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {

        items: [
            {"text": "\\uf015", "action": "toto", color: 'red'},
            {"text": "\\uf099", "color": "blue"}
            ],
        triggerPos: {
            "left": 100,
            "top": 200
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
	    	data-radius="120" 
	    	data-icon-pos="80" 
	    	data-inner-radius="40" 
	    	bn-event="menuSelected: onMenuSelected" 
	    	bn-data="items: items, triggerPos: triggerPos"></div>
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
		        triggerPos: {
		            "left": 100,
		            "top": 200
		        },
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





