$$.control.registerControl('brainjs.tabs', {
	init: function(elt) {

		elt.css({
			'display': 'flex',
			'flex-direction': 'column'
		})

		var ul = $('<ul>').prependTo(elt).css({
			'border-bottom-left-radius': 0,
			'border-bottom-right-radius': 0
		})

		elt.children('div').each(function() {
			var title = $(this).attr('title')
			$(this).removeAttr('title').css({
				'flex': '1',
				'overflow': 'hidden',
				'padding': 0,
				'border': '1px solid rgb(233,233,233)'
				
			})
			var id = $(this).uniqueId().attr('id')
			const removable = $(this).attr('data-removable') === true
			var li = $('<li>')
				.css({
					'display': 'flex',
					'flex-direction': 'row',
					'align-items': 'center'
				})
				.attr('data-name', title)
				.append($('<a>', {href: '#' + id}).text(title).css('padding-right', (removable) ? '0' : '15px'))
				.appendTo(ul)

			if (removable) {
				li.append(
					$('<button>')
						.addClass('w3-button removeTab')
						.append(
							$('<i>').addClass('fa fa-times')))			}
		})		

		elt.tabs()
		.on('click', '.removeTab', function() {
			const idx = $(this).closest('li').index()
			//console.log('[tabs] remove', idx)
			elt.trigger('tabsremove', idx)
			// $('#' + panelId).safeEmpty().remove()
			// elt.tabs('refresh')
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
				.appendTo(elt)
				.css({
					'flex': '1',
					'overflow': 'hidden',
					'padding': 0,
					'border': '1px solid rgb(233,233,233)'
					
				})				

			if (typeof options.control == 'string')	{
				tab.addControl(options.control, options.props)
			}	

			else if (typeof options.template == 'string') {
				tab.append(options.template)
			}

			var id = tab.uniqueId().attr('id')
			const removable = options.removable === true
			var li = $('<li>')
				.css({
					'display': 'flex',
					'flex-direction': 'row',
					'align-items': 'center'
				})
				.attr('data-name', title)
				.append($('<a>', {href: '#' + id}).text(title).css('padding-right', (removable) ? '0' : '15px'))
				.appendTo(ul)
			if (removable) {
				li.append(
					$('<button>')
						.addClass('w3-button removeTab')
						.append(
							$('<i>').addClass('fa fa-times')))											
			}			

			elt.tabs('refresh')
			return idx
		}

		this.getTabIndexFromTitle = function(title) {
			return ul.children(`li[data-name="${title}"]`).index()
		}

		this.getSelectedTabIndex = function() {
			var index = ul.children('li.ui-state-active').index()
			return index
		}

		this.getTabInfo = function(index) {
			const $li = ul.children('li').eq(index)
			const title = $li.data('name')
			const panelId = $li.attr('aria-controls')
			const panel = $('#' + panelId)
			const info = {title, panel}
			const ctrl = panel.children().eq(0)
			if (ctrl.hasClass('CustomControl')) {
				info.ctrlIface = ctrl.iface()
			}
			return info
		}

		this.removeTab = function(tabIndex) {
			var li = ul.children('li').eq(tabIndex)
			var panelId = li.remove().attr('aria-controls')
			$('#' + panelId).safeEmpty().remove()
			elt.tabs('refresh')
		}

		this.setSelectedTabIndex = function(idx)	{
			elt.tabs({active: idx})
		}	
	},

	$iface: `getTabsCount():Number;
		addTab(tite, options);
		removeTab(tabIndex);
		getSelectedTabIndex(): Number;
		getTabInfo(tabIndex): TabInfo;
		setSelectedTabIndex(tabIndex);
		getTabIndexFromTitle(title):Index
		`
	,$events: 'tabsremove, tabsactivate'

});






