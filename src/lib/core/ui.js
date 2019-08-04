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

	const attrs = $.extend({type: 'text'}, options.attrs)

	options.template = `
	<div style="margin-bottom: 5px">${label}</div>
	<input required="" name="value" autocomplete="off" bn-attr="attrs" style="width: 100%; padding: 5px">
	`



	options.close = function() {
		$(this).dialog('destroy')
	}

	const formDialog = $$.formDialogController(options, {attrs})
	if (options.value != undefined) {
		formDialog.setData({value: options.value})
	}
	formDialog.show(function(data) {
		if (typeof callback == 'function') {
			callback(data.value)
		}
	})
}

function showForm(formDesc, onApply) {
	//console.log('showForm', formDesc)

	var div = $('<div>', {title: formDesc.title})

	var form = $('<form>')
		.appendTo(div)
		.on('submit', function(ev) {
			ev.preventDefault()
			div.dialog('close')
			if (typeof onApply == 'function') {
				onApply(form.getFormData())
			}				
		})
	var submitBtn = $('<input>', {type: 'submit', hidden: true}).appendTo(form)

	const fieldsDesc = formDesc.fields
	for(let fieldName in fieldsDesc) {
		const fieldDesc = fieldsDesc[fieldName]

		const {label, input, value, attrs} = fieldDesc

		const divField = $('<div>', {class: 'bn-flex-row bn-space-between w3-margin-bottom'}).appendTo(form)
		var $label = $('<label>').text(label).appendTo(divField)

		if (input === 'input') {
			var $input = $('<input>')
				.width(100)
				.attr(attrs)
				.attr('name', fieldName)
				.val(value)
				.prop('required', true)
				.uniqueId()
				.appendTo(divField)

			$label.attr('for', $input.attr('id'))
		}
	}

	if (formDesc.data != undefined) {
		form.setFormData(formDesc.data)
	}

	div.dialog({
		modal: true,
		//width: 'auto',
		close: function() {
			$(this).dialog('destroy')
		},
		buttons: {
			'Cancel': function() {
				$(this).dialog('close')
			},
			'Apply': function() {					
				submitBtn.click()
			}
		}
	})

}


$$.ui = {
	showAlert,
	showConfirm,
	showPrompt,
	showForm
}

})();