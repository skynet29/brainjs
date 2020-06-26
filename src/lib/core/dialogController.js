$$.dialogController = function(options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	if (typeof options.template == 'string') {
		$(options.template).appendTo(div)
	}	

	if (options.template instanceof jQuery) {
		options.template.children().remove().appendTo(div)
	}


	var ctrl = $$.viewController(div, options)

	var dlgOptions = $.extend({
		autoOpen: false,
		modal: true,
		width: 'auto',
		canClose: true		
	}, options)

	if (dlgOptions.canClose === false) {
		dlgOptions.dialogClass = 'no-close'
		dlgOptions.closeOnEscape = false
	}

	div.dialog(dlgOptions)

	ctrl.show = function(title) {
		if (title) {
			div.dialog('option', 'title', title)
		}
		div.dialog('open')
	}

	ctrl.hide = function() {
		div.dialog('close')
	}

	ctrl.setOption = function(optionName, value) {
		div.dialog('option', optionName, value)
	}

	ctrl.destroy = function() {
		div.dialog('destroy')
	}

	return ctrl
};
