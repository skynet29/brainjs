$$.formDialogController = function(options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	var private = {}

	var form = $('<form>')
		.appendTo(div)
		.on('submit', function(ev) {
			ev.preventDefault()
			div.dialog('close')
			if (typeof private.onApply == 'function') {
				private.onApply($(this).getFormData())
				$(this).resetForm()
			}				
		})

	if (typeof options.template == 'string') {
		$(options.template).appendTo(form)
	}	

	if (options.template instanceof jQuery) {
		options.template.children().clone().appendTo(form)
	}

	$$.viewController(form, {
		data: options.data,
		events: options.events
	})

	var submitBtn = $('<input>', {type: 'submit', hidden: true}).appendTo(form)

	var dlgOptions = $.extend({
		autoOpen: false,
		modal: true,
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


	return {
		show: function(onApply) {
			private.onApply = onApply			
			div.dialog('open')	
		},
		setData: function(data, isReset) {
			if (isReset === true) {
				form.resetForm()
			}
			form.setFormData(data)
			return this
		},

		getData: function() {
			return form.getFormData()
		},

		destroy: function() {
			div.dialog('destroy')
		}
	}
};
