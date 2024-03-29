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

	const ctrl = $$.viewController(form, {
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
		show: function(data, isReset) {
			if (isReset === true) {
				form.resetForm()
			}
			if (data) {
				form.setFormData(data)
			}
			retValue = null			
			return new Promise((resolve) => {
				private.resolve = resolve			
				div.dialog('open')					
			})
		},
		setFormData: function(data) {
			form.setFormData(data)
		},
		getFormData() {
			return form.getFormData()
		},
		setData: function(data) {
			return ctrl.setData(data)
		},

		destroy: function() {
			div.dialog('destroy')
		}
	}
};
