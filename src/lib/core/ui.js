(function(){

function showAlert(options, callback) {

	options = $.extend({
		title: 'Alert',
		content: '',
		showCancel: false,
		okText: 'OK',
		cancelText: 'Cancel'
	}, options)

	options.model = true
	options.close = function() {
		$(this).dialog('destroy')
	}
	options.buttons = [
		{
			text: options.okText,
			click: function() {
				$(this).dialog('close')
				if (typeof callback == 'function') {
					callback()
				}
			}
		}
	]

	if (options.showCancel) {
		options.buttons.push({
			text: options.cancelText,
			click: function() {
				$(this).dialog('close')
			}	
		})
	}

	$('<div>', {title: options.title})
		.append($('<p>').html(options.content))
		.dialog(options)
}

function showConfirm(options, callback) {
	options.showCancel = true
	showAlert(options, callback)
}

function showPrompt(options, callback) {

	const label = options.label || ''

	options.template = `
	<p>${label}</p>
	<input type="text" required="" name="value">
	`

	options.close = function() {
		$(this).dialog('destroy')
	}

	$$.formDialogController(options)
	.show(function(data) {
		if (typeof callback == 'function') {
			callback(data.value)
		}
	})
}

$$.ui = {
	showAlert,
	showConfirm,
	showPrompt
}

})();