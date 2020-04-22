$$.formDialogController = function(options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	var private = {}
	let retValue = null

	var form = $('<form>')
		.appendTo(div)
		.on('submit', function(ev) {
			ev.preventDefault()
			retValue = $(this).getFormData()
			div.dialog('close')
			$(this).resetForm()
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
		close: function() {
			private.resolve(retValue)
			if (options.destroyOnClose === true) {
				$(this).dialog('destroy')
			}
		},
		buttons: {
			'Cancel': function() {
				$(this).dialog('close')
				private.resolve(null)
			},
			'Apply': function() {					
				submitBtn.click()
			}
		}
	}, options)


	div.dialog(dlgOptions)


	return {
		show: function() {
			retValue = null			
			return new Promise((resolve) => {
				private.resolve = resolve			
				div.dialog('open')					
			})
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
