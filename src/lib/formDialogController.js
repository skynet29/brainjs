$$.formDialogController = function(title, options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	var private = {}

	var form = $('<form>')
		.appendTo(div)
		.on('submit', function(ev) {
			ev.preventDefault()
			div.dialog('close')
			if (typeof private.onApply == 'function') {
				private.onApply($(this).getFormData())
			}				
		})

	if (typeof options.template == 'string') {
		$(options.template).appendTo(form)
	}	

	var submitBtn = $('<input>', {type: 'submit', hidden: true}).appendTo(form)

	var ctrl = $$.viewController(form, options)

	var dlgOptions = $.extend({
		autoOpen: false,
		modal: true,
		width: 'auto',	
		buttons: {
			'Cancel': function() {
				$(this).dialog('close')
			},
			'Apply': function() {					
				submitBtn.click()
			}
		}
	}, options)


	div.dialog(dlgOptions)

	ctrl.show = function(data, onApply) {
		private.onApply = onApply
		form.setFormData(data)
		div.dialog('open')
	}

	return ctrl
};
