$$.control.registerControl('brainjs.htmleditor', {

	template: {gulp_inject: './editor.html'},

	init: function(elt) {

		const colorMap = {
			black: '#0',
			red: '#f44336',
			green: '#4CAF50',
			blue: '#2196F3',
			yellow: '#ffeb3b',
			cyan: '#00bcd4',
			pink: '#e91e63'

		}
		var cmdArgs = {
			'foreColor': function() {
				return ctrl.model.color
			}
		}


		var ctrl = $$.viewController(elt, {
			data: {
				color: '#0',
				colorItems: {
					black: {name: 'Black', icon: 'fas fa-square-full w3-text-black'},
					red: {name: 'Red', icon: 'fas fa-square-full w3-text-red'},
					green: {name: 'Green', icon: 'fas fa-square-full w3-text-green'},
					blue: {name: 'Blue', icon: 'fas fa-square-full w3-text-blue'},
					yellow: {name: 'Yellow', icon: 'fas fa-square-full w3-text-yellow'},
					cyan: {name: 'Cyan', icon: 'fas fa-square-full w3-text-cyan'},
					pink: {name: 'Magenta', icon: 'fas fa-square-full w3-text-pink'}
				},
				html: elt.val()
			},
			events: {
				onCommand: function() {

					var cmd = $(this).data('cmd')
					var cmdArg = $(this).data('cmdArg')
					//console.log('onCommand', cmd, cmdArg)

					var cmdArg = cmdArg || cmdArgs[cmd]
					if (typeof cmdArg == 'function') {
						cmdArg = cmdArg()
					}
					//console.log('onCommand', cmd, cmdArg)

					document.execCommand(cmd, false, cmdArg)
				
				},
				onColorMenuChange: function(ev, data) {
					//console.log('onColorMenuChange', data)
					ctrl.setData({color: colorMap[data.cmd]})
				}

			}

		})	

		this.html = function(htmlString) {
			if (htmlString == undefined) {
				return ctrl.scope.editor.html()
			}

			ctrl.scope.editor.html(htmlString)
		}

		this.load = function(url) {
			return ctrl.scope.editor.load(url)
		}

		this.insertImage = function(url) {
			document.execCommand('insertImage', false, url)
		}

		this.getValue = function() {
			return ctrl.scope.editor.html() 
		}

		this.setValue = function(value) {
			//console.log('brainjs.htmleditor:setValue', value)
			ctrl.scope.editor.html(value)
		}

		this.focus = function() {
			ctrl.scope.editor.get(0).focus()
		}


	},
	$iface: 'html(htmlString): string;load(url);insertImage(url)'

});
