$$.control.registerControl('brainjs.tabs', {
	init: function(elt) {

		var ul = $('<ul>').prependTo(elt)

		elt.children('div').each(function() {
			var title = $(this).attr('title')
			$(this).removeAttr('title')
			var id = $(this).uniqueId().attr('id')
			var li = $('<li>')
				.attr('title', title)
				.append($('<a>', {href: '#' + id}).text(title))
				.appendTo(ul)
			if ($(this).attr('data-removable') != undefined) {
				li.append($('<span>', {class: 'ui-icon ui-icon-close'}))
			}
		})		

		elt.tabs()
		.on('click', 'span.ui-icon-close', function() {
			var panelId = $(this).closest('li').remove().attr('aria-controls')
			//console.log('panelId', panelId)
			$('#' + panelId).safeEmpty().remove()
			elt.tabs('refresh')
		})


		function getTabsCount() {
			return ul.children(`li`).length
		}

		this.getTabsCount = getTabsCount

		this.addTab = function(title, options) {
			//console.log('addTab', title)
			var idx = getTabsCount()
			options = options || {}
			var tab = $('<div>')
				.attr('title', title)
				.appendTo(elt)

			if (typeof options.control == 'string')	{
				tab.addControl(options.control)
			}	

			else if (typeof options.template == 'string') {
				tab.append(options.template)
			}

			var id = tab.uniqueId().attr('id')
			var li = $('<li>')
				.attr('title', title)
				.append($('<a>', {href: '#' + id}).text(title))
				.appendTo(ul)
			if (options.removable === true) {
				li.append($('<span>', {class: 'ui-icon ui-icon-close'}))
			}			

			elt.tabs('refresh')
			return idx
		}

		this.getSelectedTabIndex = function() {
			var index = ul.children('li.ui-state-active').index()
			return index
		}

		this.getTabInfo = function(index) {
			const title = ul.children('li').eq(index).attr('title')
			return {title}
		}

		this.removeTab = function(tabIndex) {
			var li = ul.children('li').eq(tabIndex)
			var panelId = li.remove().attr('aria-controls')
			$('#' + panelId).safeEmpty().remove()
			elt.tabs('refresh')
		}		
	}

});






