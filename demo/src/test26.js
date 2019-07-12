(function(){


const jsCode = `
const ctrl = $$.viewController(elt, {
	data: {
		value: 0
	},
	events: {
		onDownload: function() {
			console.log('onDownload')
			ctrl.setData({value: 0})										
			setTimeout( progress, 2000 )				
		}
	}
})

function progress() {

  var value = ctrl.model.value + 2;

	ctrl.setData({value})

  if ( value < 99 ) {
    setTimeout( progress, 80 );
  }
}
`.trim()

const htmlCode = `
<div id="main">
	<div  style="padding: 20px;">
		<div bn-control="brainjs.progressbar" bn-val="value" bn-data= "{showPercent: true, initText: 'Loading...', color: 'blue'}"></div>	

		<button bn-event="click: onDownload" style="margin-top: 10px">Download</button>

	</div>
</div>
`.trim()


$$.control.registerControl('test26', {
	template: {gulp_inject: './test26.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: {
				value: 0,
				jsCode,
				htmlCode
			},
			events: {
				onDownload: function() {
					console.log('onDownload')
					ctrl.setData({value: 0})										
					setTimeout( progress, 2000 )				
				}
			}
		})

		function progress() {

		  var value = ctrl.model.value + 2;
		
			ctrl.setData({value})
		
		  if ( value < 99 ) {
		    setTimeout( progress, 80 );
		  }
		}

		this.update = function(data) {
			ctrl.setData(data)
		}

	}
})



  


})();





