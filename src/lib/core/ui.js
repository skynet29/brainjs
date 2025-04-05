(function(){

function openFileDialog(callback, multiple = false) {
	const input = document.createElement('input')
	input.type = 'file'
	input.multiple = multiple
	input.onchange = function () {
		callback((multiple) ? input.files : input.files[0])
	}
	input.click()
}

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

	let content = options.content
	if (typeof content == 'object') {
		const items = []
		for(key in content) {
			items.push(`<p><strong>${key}:</strong> ${content[key]}</p>`)
		}
		content = items.join('')
	}

	$('<div>', {title: options.title})
		.append($('<p>').html(content))
		.dialog(options)
}

function showConfirm(options, callback) {
	options.showCancel = true
	showAlert(options, callback)
}

function showPrompt(options) {

	const label = options.label || ''

	const attrs = $.extend({type: 'text'}, options.attrs)

	options.template = `
	<div style="margin-bottom: 5px">${label}</div>
	<input required="" name="value" autocomplete="off" bn-attr="attrs" style="width: 100%; padding: 5px">
	`
	options.data = {attrs}


	options.destroyOnClose = true
	
	const formDialog = $$.formDialogController(options)
	if (options.value != undefined) {
		formDialog.setFormData({value: options.value})
	}

	return formDialog.show().then((data) => {
		return data && data.value
	})

}

function showForm(formDesc, onApply) {
	//console.log('showForm', formDesc)

	const div = $('<div>', {title: formDesc.title})

	const form = $('<form>')
		.appendTo(div)
		.on('submit', function(ev) {
			ev.preventDefault()
			div.dialog('close')
			if (typeof onApply == 'function') {
				onApply(form.getFormData())
			}				
		})
	const submitBtn = $('<input>', {type: 'submit', hidden: true}).appendTo(form)

	const table = $('<table>').appendTo(form)

	const fieldsDesc = formDesc.fields
	for(let fieldName in fieldsDesc) {
		const fieldDesc = fieldsDesc[fieldName]

		const {label, input, value, attrs} = fieldDesc

		const tr = $('<tr>').appendTo(table)

		$('<td>').text(label).appendTo(tr)
		const td = $('<td>').appendTo(tr)

		if (input === 'input') {
			$('<input>')
				.attr(attrs)
				.attr('name', fieldName)
				.val(value)
				.prop('required', true)
				.uniqueId()
				.css('padding', '5px')
				.width('200px')
				.appendTo(td)

		}
	}

	if (formDesc.data != undefined) {
		form.setFormData(formDesc.data)
	}

	div.dialog({
		modal: true,
		width: 'auto',
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

function progressDialog(title) {
	const ctrl = $$.dialogController({
		title: title || 'Saving...',
		canClose: false,
		template: `<progress bn-val="percentage" style="width: 100%;"></progress>`,
		width: 300,
		resizable: false,
		data: {
			value: 0
		}
	})

	ctrl.setPercentage = function(percentage) {
		ctrl.setData({percentage})
	}
	
	return ctrl;
}

const waitDialog = function(title) {
	title = title || 'Waiting...'

	return $$.dialogController({
		title,
		template: `<div class="w3-center w3-padding-16"><i class="fa fa-redo-alt fa-2x fa-pulse w3-text-blue"></i></div>`,
		width: 100,
		canClose: false
	})
	
}


$$.ui = {
	showAlert,
	showConfirm,
	showPrompt,
	showForm,
	progressDialog,
	waitDialog,
	openFileDialog
}

})();