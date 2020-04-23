$$.control.registerControl('brainjs.input', {

	init: function(elt) {
		const clearBtn = $('<button>', {type: 'button'})
			.addClass('w3-button')
			.addClass('w3-text-grey')
			.hide()
			.on('click', function() {
				$(this).prev().val('').focus()
				$(this).hide()
			})
			.append('<i>').addClass('fa fa-times')

		elt.after(clearBtn)
		.on('input', function() {
			clearBtn.setVisible($(this).val() != '')			
		})
	}

});