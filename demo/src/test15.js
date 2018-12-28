(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		data: { 
			isStarted: false
		},
		events: {
			onStart: function() {
				ctrl.setData({isStarted: true})
				ctrl.scope.camera.start()
			},
			onTakePicture: function() {
				console.log('onTakePicture')
				var url = ctrl.scope.camera.takePicture()
				var content = \`<img src="\${url}">\`
				$$.ui.showAlert({content, width: 'auto'})
			}			
		}	
	},
}
`.trim()

const htmlCode = `
<div id="main">
	<button bn-event="click: onStart" bn-show="!isStarted">Start</button>
	<button bn-event="click: onTakePicture" bn-show="isStarted">Take Picture</button>
	<div bn-control="brainjs.camera" bn-iface="camera"></div>
</div>
`.trim()


$$.control.registerControl('test15', {
	template: {gulp_inject: './test15.html'},
	init: function(elt) {

		const ctrl = $$.viewController(elt, {
			data: { 
				htmlCode,
				jsCode,
				isStarted: false
			},
			events: {
				onStart: function() {
					ctrl.setData({isStarted: true})
					ctrl.scope.camera.start()
				},
				onTakePicture: function() {
					console.log('onTakePicture')
					var url = ctrl.scope.camera.takePicture()
					var content = `<img src="${url}">`
					$$.ui.showAlert({content, width: 'auto'})
				}
			}
		 
		})

		this.ctrl = ctrl

	}
})


  


})();





