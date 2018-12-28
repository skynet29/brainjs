(function(){

	window.$$ = {}
	
})();
$$.control.registerControl('brainjs.camera', {
	init: function(elt) {

		const video = $('<video>')
		.on('canplay', function(ev) {
			console.log('onCanPlay')
			canvas.width = this.videoWidth
			canvas.height = this.videoHeight
		})
		.appendTo(elt)
		.get(0)

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		
		this.start = function() {

			navigator.getUserMedia({video: true}, function(stream) {
				console.log('stream')

				var url = URL.createObjectURL(stream)
				video.src = url
				video.play()

			},
			function(err) {
				console.warn('[Camera] error', err)
			})			
		}		

		this.takePicture = function() {
		    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		    return canvas.toDataURL('image/png');
		}		
	}



});







$$.control.registerControl('brainjs.checkgroup', {
	init: function(elt) {

		elt.on('click', 'input[type=checkbox]', function() {
			elt.trigger('input')
		})

		this.getValue = function() {
			var ret = []
			elt.find('input[type=checkbox]:checked').each(function() {
				ret.push($(this).val())
			})	
			return ret	
		}

		this.setValue = function(value) {
			if (Array.isArray(value)) {
				elt.find('input[type=checkbox]').each(function() {
					$(this).prop('checked', value.indexOf($(this).val()) >= 0)
				})
			}		
		}

		this.setValue(elt.val())

	}

});







$$.control.registerControl('brainjs.datepicker', {
	props: {
		showButtonPanel: true
	},

	init: function(elt) {

		let options = $.extend({}, this.props)

		options.onSelect = function() {
			console.log('[datepicker] onSelect')
			elt.trigger('datepickerchange')
		}

		elt.datepicker(options)

		var value = elt.val()
		if (typeof value == 'string') {
			var ms = Date.parse(value)
			//console.log('[DatePickerControl] ms', ms)
			var date = new Date(ms)
			//console.log('[DatePickerControl] date', date)
			elt.datepicker('setDate', date)
		}
			
		this.setValue = function(date) {
			elt.datepicker('setDate', date)
		}
		
		this.getValue = function() {
			//console.log('getValue')
			return elt.datepicker('getDate')
		}
	}

});



$$.control.registerControl('brainjs.inputgroup', {
	init: function(elt) {

		var id = elt.children('input').uniqueId().attr('id')
		elt.children('label').attr('for', id)
	}
});

$$.control.registerControl('brainjs.navbar', {
	props: {
		activeColor: 'w3-green',
		type: 'horizontal'
	},
	init: function(elt) {

		const {activeColor, type} = this.props

		elt.addClass((type == 'vertical') ? 'w3-bar-block': 'w3-bar')
		elt.children('a').each(function() {
			$(this).addClass('w3-bar-item w3-button')
		})

		const newRoute = $$.getNewRoute()
		elt.children(`a[href="#${newRoute}"]`).addClass(activeColor)

		$(window).on('popstate', function(evt) {
			//console.log('[NavbarControl] routeChange', newRoute)
			const newRoute = $$.getNewRoute()

			elt.children(`a.${activeColor}`).removeClass(activeColor)	
			elt.children(`a[href="#${newRoute}"]`).addClass(activeColor)

		})	

	}

});








$$.control.registerControl('brainjs.radiogroup', {
	init: function(elt) {

		elt.on('click', 'input[type=radio]', function() {
			//console.log('radiogroup click')
			elt.find('input[type=radio]:checked').prop('checked', false)
			$(this).prop('checked', true)
			elt.trigger('input')
		})
		

		this.getValue = function() {
			return elt.find('input[type=radio]:checked').val()
		}

		this.setValue = function(value) {
			elt.find('input[type=radio]').each(function() {
				$(this).prop('checked', value === $(this).val())
			})			
		}

		this.setValue(elt.val())
	}
});







(function() {

	function matchRoute(route, pattern) {
		//console.log('matchRoute', route, pattern)
		var routeSplit = route.split('/')
		var patternSplit = pattern.split('/')
		//console.log(routeSplit, patternSplit)
		var ret = {}

		if (routeSplit.length != patternSplit.length)
			return null

		for(var idx = 0; idx < patternSplit.length; idx++) {
			var path = patternSplit[idx]
			//console.log('path', path)
			if (path.substr(0, 1) === ':') {
				if (routeSplit[idx].length === 0)
					return null
				ret[path.substr(1)] = routeSplit[idx]
			}
			else if (path !== routeSplit[idx]) {
				return null
			}

		}

		return ret
	}


	function getNewRoute() {
		const href = location.href
		const idx = href.indexOf('#')
		const newRoute = (idx !== -1)  ? href.substr(idx+1) : '/'
		
		return newRoute
	}

	$$.getNewRoute = getNewRoute

	$$.control.registerControl('brainjs.router', {

		props: {
			routes: []
		},
		init: function(elt) {


			$(window).on('popstate', function(evt) {
				console.log('[router] popstate')
				processRoute(getNewRoute())
			})


			var routes = this.props.routes

			if (!Array.isArray(routes)) {
				console.warn('[router] bad routes')
				return
			}

			processRoute(getNewRoute())

			function processRoute(newRoute) {
				console.log('[router] processRoute', newRoute, routes)

				for(var route of routes) {
					var params = matchRoute(newRoute, route.href)
					//console.log(`route: ${route.href}, params`, params)
					if (params != null) {
						//console.log('[RouterControl] params', params)
						if (typeof route.redirect == 'string') {
							console.log('[router] redirect to ', route.redirect)
							location.href = '#' + route.redirect							
						}
						else if (typeof route.control == 'string') {
							elt.safeEmpty().addControl(route.control)	
						}
						return true
					}	
				}
				console.warn('[router] No route found !')
				return false

			}		


		}

	})

})();



$$.control.registerControl('brainjs.tabs', {
	init: function(elt) {

		var ul = $('<ul>').prependTo(elt)

		elt.children('div').each(function() {
			var title = $(this).attr('title')
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
	}

});







(function(){


function getVarValue(data, varName) {
    var ret = data
    for(let f of varName.split('.')) {
      
      if (typeof ret == 'object' && f in ret) {
        ret = ret[f]
      }
      else {
        return undefined
      }
      
    }
    return ret
}

function getValue(data, varName) {

    //console.log('[Core] getValue', varName, ctx)

    // var not = false
    // if (varName.startsWith('!')) {
    //   varName = varName.substr(1)
    //   not = true
    // }     

    var func = data[varName]
    var value

    if (typeof func == 'function') {
      value = func.call(data)
    }
    else {
      value = getVarValue(data, varName)
    }


    // if (typeof value == 'boolean' && not) {
    //   value = !value
    // }

    return value
  }



function splitAttr(attrValue, cbk) {
  attrValue.split(',').forEach(function(i) {
    let [name, value] = i.split(':')
    cbk(name.trim(), value.trim())
  })
}


const map = {
  'bn-each': {type: 3},
  'bn-text': {f: 'text', type: 1},
  'bn-html': {f: 'html', type: 1},
  'bn-val': {f: 'setValue', type: 1},
  'bn-show': {f: 'setVisible', type: 1},
  'bn-style': {f: 'css', type: 2},
  'bn-attr': {f: 'attr', type: 2},
  'bn-prop': {f: 'prop', type: 2},
  'bn-data': {f: 'setData', type: 2},
  'bn-class': {f: 'setClass', type: 2},
  'bn-control': {type: 4}
}


function update(ctx, data, vars, excludeElt) {

  //console.log('[binding] update', vars, data, excludeElt)

  if (typeof vars == 'string') {
    vars = vars.split(',')
  }

  vars.forEach(function(variable) {
    let value = getValue(data, variable)
    
    if (typeof value == 'object' && !Array.isArray(value) && !value instanceof Date) {
      update(ctx, data, Object.keys(value).map(i => variable + '.' + i), excludeElt)
      return
    }
    
    if (ctx[variable]) {
      ctx[variable].forEach(function(action) {
        let {type, f, elt, name, template, iter, not} = action
        if (elt == excludeElt) {
          return
        }

        let newValue = value

        if (not === true) {
          newValue = !newValue
        }
        if (type == 1) {
          //console.log('update', variable, f, newValue)
           elt[f].call(elt, newValue)
        }
        if (type == 2) {
          //console.log('update', variable, f, name, newValue)
           elt[f].call(elt, name, newValue)
        }   
        if (type == 3 && Array.isArray(newValue)) {
            elt.empty()
            newValue.forEach(function(item) {
              var itemData = $.extend({}, data)
              itemData[iter] = item
              var $item = template.clone()
              process($item, itemData)
              elt.append($item)           
            })
         }
      })
    }
  })
}

function processEvents(root, events) {
  root.bnFind(`[bn-event]`).each(function() {
      let elt = $(this)
      let attrValue = elt.attr('bn-event')
      elt.removeAttr('bn-event')
      
      splitAttr(attrValue, function(evtName, value) {
        let fn  = events[value]
        if (typeof fn == 'function') {        
          const [name, selector] = evtName.split('.')

          if (selector != undefined) {
            elt.on(name, '.' + selector, fn)
          }
          else {
            elt.on(name, fn)
          }
          
          
        }
      })
     
    })
     
}

function process(root, data, createControl, updateCbk) {

  
  if (root.length > 1) {
    console.error('[binding] process', root.length, data)
  }

  let ctx = {}
  
  for(let dir in map) {
    

    root.bnFind(`[${dir}]`).each(function() {
      let elt = $(this)
      let attrValue = elt.attr(dir)
      elt.removeAttr(dir)

      let {type, f} = map[dir]
      
      if (type == 1) {
        let not = false
        if (attrValue.startsWith('!')) {
          attrValue = attrValue.substr(1)
          not = true
        } 

        if (data) {
          let value = getValue(data, attrValue)
          if (not && typeof value == 'boolean') {
            value = !value
          }
          //elt.text(data[attrValue])
          elt[f].call(elt, value)
        } 
        if (dir == 'bn-val') {
          let updateEvt = elt.attr('bn-update')
          if (updateEvt) {
            elt.removeAttr('bn-update')
            elt.on(updateEvt, function() {
              //console.log('[binding] updateEvt', updateEvt, elt)
              updateCbk(attrValue, elt.getValue(), elt)

            })
          }
        }
    

        ctx[attrValue] = ctx[attrValue] || []
        ctx[attrValue].push({f, elt, type, not})        
      }

      if (type == 4 && typeof createControl == 'function') {
        createControl(attrValue, elt)
      }

      if (type == 2) {

          splitAttr(attrValue, function(name, varName) {
            let not = false
            if (attrValue.startsWith('!')) {
              attrValue = attrValue.substr(1)
              not = true
            }             
            if (data) {
              let value = getValue(data, varName)
              if (not && typeof value == 'boolean') {
                value = !value
              }              
              elt[f].call(elt, name, value)
            }
            ctx[varName] = ctx[varName] || []
            ctx[varName].push({f, elt, type, name, not})  
          })
       }
       
       
      if (type == 3) {
        let template = elt.children().remove().clone()
        let [iter, , varName] = attrValue.split(' ')
        let value = getValue(data, varName)
        
        ctx[varName] = ctx[varName] || []
        ctx[varName].push({elt, type, template, iter})        
        
        if (data && Array.isArray(value)) {
          value.forEach(function(item) {
          var itemData = $.extend({}, data)
           itemData[iter] = item
           var $item = template.clone()
           process($item, itemData, createControl)
           elt.append($item)          
          })
        }
      }
    })
     
  
  }
  

  return ctx
}

function processBindings(root) {

  var data = {}

  root.bnFind(`[bn-bind]`).each(function() {
    let elt = $(this)
    let attrValue = elt.attr('bn-bind')
    elt.removeAttr('bn-bind')
    data[attrValue] = elt
  })

  root.bnFind(`[bn-iface]`).each(function() {
    let elt = $(this)
    let attrValue = elt.attr('bn-iface')
    elt.removeAttr('bn-iface')
    data[attrValue] = elt.iface()
  })

  return data
  
}

$$.binding = {
  process,
  update,
  processEvents,
  processBindings
}

})();

(function(){

let controls = {}

function isDepsOk(deps) {
	return deps.reduce(function(prev, cur) {

		return prev && (cur != undefined)
	}, true)		
}


function registerControl(name, options) {
	if (!$$.util.checkType(options, {
		$deps: ['string'],
		init: 'function'
	})) {
		console.error(`[Core] registerControl: bad options`, options)
		return
	}


	var deps = options.deps || []

	console.log(`[Core] register control '${name}' with deps`, deps)

	controls[name] = {deps, options, status: 'notloaded'}
}

function getControl(name) {
	var ret = controls[name]
	if (ret && ret.status == 'notloaded') {
		ret.deps = $$.service.getServices(ret.deps)
		ret.status = isDepsOk(ret.deps) ? 'ok' : 'ko'
	}
	return ret
}

function createControl(controlName, elt) {
	elt.addClass(controlName.replace('.', '-'))
	elt.addClass('CustomControl').uniqueId()	
	var ctrl = getControl(controlName)
		
	if (ctrl == undefined) {
		throw(`[Core] control '${controlName}' is not registered`)
	}
		//console.log('createControl', controlName, ctrl)
	if (ctrl.status ===  'ok') {
		
		var iface = {
			props: {},
			name: controlName
		}

		let {init, props, template} = ctrl.options
		props = props || {}

		Object.keys(props).forEach(function(propName) {
			iface.props[propName] = elt.data(propName) || props[propName]
		})

		if (typeof template == 'string') {
			$(template).appendTo(elt)
		}

		if (template instanceof jQuery) {
			template.children().clone().appendTo(elt)
		}

		if (typeof init == 'function') {

			var args = [elt].concat(ctrl.deps)
			init.apply(iface, args)
			console.log(`[Core] instance control '${controlName}' with props`, iface.props)

		}
		else {
			console.warn(`[Core] control '${controlName}' missing init function`)
		}


		elt.get(0).ctrl = iface
		
		return iface				
	}



}

$$.control = {
	registerControl,
	createControl
}

})();

$$.dialogController = function(options) {
	var div = $('<div>', {title: options.title || 'Dialog'})

	if (typeof options.template == 'string') {
		$(options.template).appendTo(div)
	}	

	var ctrl = $$.viewController(div, options)

	var dlgOptions = $.extend({
		autoOpen: false,
		modal: true,
		width: 'auto',		
	}, options)

	var private = {}

	//console.log('dlgOptions', dlgOptions)

	div.dialog(dlgOptions)

	ctrl.show = function(onApply) {
		private.onApply = onApply
		div.dialog('open')
	}

	ctrl.hide = function() {
		div.dialog('close')
	}

	ctrl.apply = function(retValue) {
		ctrl.hide()
		if (typeof private.onApply == 'function') {
			private.onApply(retValue)
		}
	}

	ctrl.setOption = function(optionName, value) {
		div.dialog('option', optionName, value)
	}

	ctrl.destroy = function() {
		div.dialog('destroy')
	}

	return ctrl
};

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

	var submitBtn = $('<input>', {type: 'submit', hidden: true}).appendTo(form)

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


	return {
		show: function(onApply) {
			private.onApply = onApply			
			div.dialog('open')			
		},
		setData: function(data) {
			form.setFormData(data)
			return this
		},

		destroy: function() {
			div.dialog('destroy')
		}
	}
};

(function(){


$.fn.bnFind= function(selector) {
    return this.find(selector).add(this.filter(selector))
}

$.fn.setClass = function(className, isActive) {
    if (isActive) {
      this.addClass(className)
    }
    else {
      this.removeClass(className)
    }
}

$.fn.setVisible = function(isVisible) {
    if (isVisible) {
      this.show()
    }
    else {
      this.hide()
    }
}

$.fn.iface = function() {
  return this.get(0).ctrl
}

$.fn.setData = function(name, value) {
  const iface = this.iface()

  const funcName = 'set' + name.substr(0,1).toUpperCase() + name.substr(1)
  //console.log('funcName', funcName)

  if (iface && iface.props[name] && typeof iface[funcName] == 'function') {
    iface[funcName](value)
  }
  else if (iface && $$.isViewController(iface.ctrl) && iface.ctrl.model[name]) {
    iface.ctrl.setData(name, value)
  }
  else {
    this.data(name, value)
  }
}

$.fn.setValue = function(value) {
  if (this.get(0).tagName == 'INPUT' && this.attr('type') == 'checkbox') {
    this.prop('checked', value)
    return
  }  
  const iface = this.iface()

  if (iface && typeof iface.setValue == 'function') {
    iface.setValue(value)
  }
  else {
    this.val(value)
  }
}

$.fn.getValue = function() {
  const type = this.attr('type')
  if (this.get(0).tagName == 'INPUT' && type == 'checkbox') {
    return this.prop('checked')
  }    
  const iface = this.iface()
  if (iface && typeof iface.getValue == 'function') {
    return iface.getValue()
  }
  var ret = this.val()

  if (type == 'number' || type == 'range') {
    ret = parseFloat(ret)
  }
  return ret
}

$.fn.getFormData = function() {
  var ret = {}
  this.find('[name]').each(function() {
    var elt = $(this)
    var name = elt.attr('name')
    ret[name] = elt.getValue()

  })

  return ret
}

$.fn.resetForm = function() {
  if (this.get(0).tagName == "FORM") {
    this.get(0).reset()
  }   
}

$.fn.setFormData = function(data) {

  //console.log('setFormData', data)
  this.resetForm()

  for(var name in data) {
    var value = data[name]
    var elt = this.find(`[name=${name}]`)
    if (elt.length) {
      elt.setValue(value)       
    }

  
  }

  return this
}

$.fn.safeEmpty = function() {
  this.find('.CustomControl').each(function() {
    const iface = $(this).iface()

    if (typeof iface.dispose == 'function') {
      iface.dispose()
    }
  })

  this.empty()

  return this
}

$.fn.addControl = function(ctrlName) {
  var newCtrl = $('<div>')
  $$.control.createControl(ctrlName, newCtrl)
  this.append(newCtrl) 
  return this
}

})();


(function(){

let services = {}




function getServices(deps) {
	//console.log('[Core] getServices', deps)
	return deps.map(function(depName) {
		var srv = services[depName]
		if (srv) {
			if (srv.status == 'notloaded') {
				var deps2 = getServices(srv.deps)
				var config = srv.config || {}
				console.log(`[Core] instance service '${depName}' with config`, config)
				var args = [config].concat(deps2)
				srv.obj = srv.fn.apply(null, args)
				srv.status = 'ready'
			}
			return srv.obj				
		}
		else {
			//srv.status = 'notregistered'
			throw(`[Core] service '${depName}' is not registered`)
		}

	})
}



function configureService(name, config) {
	console.log('[Core] configureService', name, config)
	if (typeof name != 'string' || typeof config != 'object') {
		console.warn('[Core] configureService called with bad arguments')
		return
	} 	

	var srv = services[name]
	if (srv) {
		srv.config = config
	}
	else {
		throw(`[configureService] service '${name}' is not registered`)
	}

}

function registerService(name, arg1, arg2) {
	var deps = []
	var fn = arg1
	if (Array.isArray(arg1)) {
		deps = arg1
		fn = arg2
	}
	if (typeof name != 'string' || typeof fn == 'undefined' || !Array.isArray(deps)) {
		throw('[Core] registerService called with bad arguments')
	} 
	console.log(`[Core] register service '${name}' with deps`, deps)

	services[name] = {deps, fn, status: 'notloaded'}
}

$$.service = {
	registerService,
	configureService,
	getServices
}

})();

(function(){

function showAlert(options, callback) {

	options = $.extend({
		title: 'Alert',
		content: '',
		showCancel: false
	}, options)

	options.model = true
	options.close = function() {
		$(this).dialog('destroy')
	}
	options.buttons = {
		'OK': function() {
			$(this).dialog('close')
			if (typeof callback == 'function') {
				callback()
			}
		}
	}
	if (options.showCancel) {
		options.buttons['Cancel'] = function() {
			$(this).dialog('close')
		}
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

	options.template = `
	<p>${label}</p>
	<input type="text" required="" name="value">
	`

	options.close = function() {
		$(this).dialog('destroy')
	}

	$$.formDialogController(options)
	.show(function(data) {
		if (typeof callback == 'function') {
			callback(data.value)
		}
	})
}

$$.ui = {
	showAlert,
	showConfirm,
	showPrompt
}

})();
(function() {


function readTextFile(fileName, onRead) {
	var fileReader = new FileReader()

	fileReader.onload = function() {
		if (typeof onRead == 'function') {
			onRead(fileReader.result)
		}
	}
	fileReader.readAsText(fileName)
}


function readFileAsDataURL(fileName, onRead) {
	var fileReader = new FileReader()

	fileReader.onload = function() {
		if (typeof onRead == 'function') {
			onRead(fileReader.result)
		}
	}
	fileReader.readAsDataURL(fileName)
}


var inputFile = $('<input>', {type: 'file'}).on('change', function() {
	var onApply = $(this).data('onApply')
	var fileName = this.files[0]
	if (typeof onApply == 'function') {
		onApply(fileName)
	}
})

function openFileDialog(onApply) {
	inputFile.data('onApply', onApply)
	inputFile.click()
}

function isImage(fileName) {
	return (/\.(gif|jpg|jpeg|png)$/i).test(fileName)
}

function dataURLtoBlob(dataURL) {
  // Decode the dataURL
  const [ , mimeType, encodage, data] = dataURL.split(/[:,;]/)
  if (encodage != 'base64') {
  	return
  }

  //console.log('mimeType', mimeType)
  //console.log('encodage', encodage)
  //console.log('data', data)

  var binary = atob(data)
 // Create 8-bit unsigned array
  var array = []
  for(var i = 0; i < binary.length; i++) {
  	array.push(binary.charCodeAt(i))
  }

  // Return our Blob object
	return new Blob([ new Uint8Array(array) ], {mimeType})
}

function loadStyle(styleFilePath, callback) {	
	//console.log('[Core] loadStyle', styleFilePath)

	$(function() {
		var cssOk = $('head').find(`link[href="${styleFilePath}"]`).length
		if (cssOk != 1) {
			console.log(`loading '${styleFilePath}' style`)
			$('<link>', {href: styleFilePath, rel: 'stylesheet'})
			.on('load', function() {
				console.log(`'${styleFilePath}' loaded`)
				if (typeof callback == 'function') {
					callback()
				}
			})
			.appendTo($('head'))
		}
	})
}



	
function isObject(a) {
	return (typeof a == 'object') && !Array.isArray(a)
}

function checkType(value, type, isOptional) {
	//console.log('checkType',value, type, isOptional)
	if (typeof value == 'undefined' && isOptional === true) {
		return true
	}

	if (typeof type == 'string') {
		return typeof value == type
	}

	if (Array.isArray(value)) {
		if (!Array.isArray(type)) {
			return false
		}

		if (type.length == 0) {
			return true // no item type checking
		}
		for(let i of value) {
			var ret = false
			for(let t of type) {
				ret |= checkType(i, t)
			}
			if (!ret) {
				return false
			}
		}

		return true
	}

	if (isObject(type)) {
		if (!isObject(value)) {
			return false
		}
		for(let f in type) {

			//console.log('f', f, 'value', value)
			var newType = type[f]

			var isOptional = false
			if (f.startsWith('$')) {
				f = f.substr(1)
				isOptional = true
			}
			if (!checkType(value[f], newType, isOptional)) {
				return false
			}

		}

		return true
	}
	return false
}	



$$.util = {
	readTextFile,
	readFileAsDataURL,
	openFileDialog,
	isImage,
	dataURLtoBlob,
	loadStyle,
	checkType
}


})();

(function(){

class ViewController {
    constructor(elt, options) {
    	//console.log('ViewController', options)
    	if (typeof elt == 'string') {
    		elt = $(elt)
    	}

        if (elt.hasClass('CustomControl')) {
            elt = elt.children()
        }

    	options = $.extend({}, options)
        this.elt = elt



        this.model = $.extend({}, options.data)
        this.rules = $.extend({}, options.rules)
        this.watches = $.extend({}, options.watches)

        // generate automatic rules for computed data (aka function)
        for(var k in this.model) {
        	var data = this.model[k]
        	if (typeof data == 'function') {
        		var funcText = data.toString()
        		//console.log('funcText', funcText)
        		var rules = []
        		funcText.replace(/this.([a-zA-Z0-9_-]{1,})/g, function(match, captureOne) {
        			//console.log('captureOne', captureOne)
        			rules.push(captureOne)
        		})
        		this.rules[k] = rules.toString()
        	}
        }

        //console.log('rules', this.rules)
        this.ctx = $$.binding.process(elt, this.model, $$.control.createControl, 
            (name, value, excludeElt) => {
                //console.log('[ViewController] updateCbk', name, value)
                this.setData(name, value, excludeElt)                
            })


        if (typeof options.events == 'object') {
            $$.binding.processEvents(elt, options.events)
        }


        this.scope = $$.binding.processBindings(elt)

        //console.log('scope', this.scope)
       

    } 

    setData(arg1, arg2, excludeElt) {
        //console.log('[ViewController] setData', arg1, arg2, excludeElt)
        var data = arg1
        if (typeof arg1 == 'string') {
        	data = {}
        	data[arg1] = arg2
        }
        //console.log('[ViewController] setData', data)
        $.extend(this.model, data)
        //console.log('model', this.model)
        this.update(Object.keys(data), excludeElt)
    }

    update(fieldsName, excludeElt) {
    	//console.log('[ViewController] update', fieldsName, excludeElt)
    	if (typeof fieldsName == 'string') {
    		fieldsName = fieldsName.split(',')
    	}


    	if (Array.isArray(fieldsName)) {
    		var fieldsSet = {}
    		fieldsName.forEach((field) => {

    			var watch = this.watches[field]
    			if (typeof watch == 'function') {
    				watch.call(null, this.model[field])
    			}
    			fieldsSet[field] = 1

    			for(var rule in this.rules) {
    				if (this.rules[rule].split(',').indexOf(field) != -1) {
    					fieldsSet[rule] = 1
    				}
    			}
    		})


    		$$.binding.update(this.ctx, this.model, Object.keys(fieldsSet), excludeElt)
    	}

    }
}

$$.viewController = function(elt, options) {
    return new ViewController(elt, options)
}

$$.isViewController = function(o) {
    return o instanceof ViewController
}

})();


$$.service.registerService('brainjs.http', function() {
	return {
		get(url) {
			return $.getJSON(url)
		},


		post(url, data) {
			return $.ajax({
				method: 'POST',
				url : url,
				contentType: 'application/json',
				data: JSON.stringify(data)
			})
		},

		put(url, data) {
			return $.ajax({
				method: 'PUT',
				url : url,
				contentType: 'application/json',
				data: JSON.stringify(data)
			})
		},			

		delete(url) {
			return $.ajax({
				method: 'DELETE',
				url : url,
			})				
		},

		postFormData(url, fd) {
			return $.ajax({
			  url: url,
			  type: "POST",
			  data: fd,
			  processData: false,  // indique à jQuery de ne pas traiter les données
			  contentType: false   // indique à jQuery de ne pas configurer le contentType
			})				
		}

		
	}
});







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2FtZXJhLmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2RhdGVwaWNrZXIuanMiLCJjb250cm9scy9pbnB1dGdyb3VwLmpzIiwiY29udHJvbHMvbmF2YmFyLmpzIiwiY29udHJvbHMvcmFkaW9ncm91cC5qcyIsImNvbnRyb2xzL3JvdXRlci5qcyIsImNvbnRyb2xzL3RhYnMuanMiLCJsaWIvYmluZGluZy5qcyIsImxpYi9jb250cm9sLmpzIiwibGliL2RpYWxvZ0NvbnRyb2xsZXIgLmpzIiwibGliL2Zvcm1EaWFsb2dDb250cm9sbGVyLmpzIiwibGliL2pxdWVyeS1leHQuanMiLCJsaWIvc2VydmljZS5qcyIsImxpYi91aS5qcyIsImxpYi91dGlsLmpzIiwibGliL3ZpZXdDb250cm9sbGVyLmpzIiwic2VydmljZXMvaHR0cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJicmFpbmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHdpbmRvdy4kJCA9IHt9XHJcblx0XHJcbn0pKCk7IiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuY2FtZXJhJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IHZpZGVvID0gJCgnPHZpZGVvPicpXG5cdFx0Lm9uKCdjYW5wbGF5JywgZnVuY3Rpb24oZXYpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdvbkNhblBsYXknKVxuXHRcdFx0Y2FudmFzLndpZHRoID0gdGhpcy52aWRlb1dpZHRoXG5cdFx0XHRjYW52YXMuaGVpZ2h0ID0gdGhpcy52aWRlb0hlaWdodFxuXHRcdH0pXG5cdFx0LmFwcGVuZFRvKGVsdClcblx0XHQuZ2V0KDApXG5cblx0XHRjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuXHRcdGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cdFx0XG5cdFx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHt2aWRlbzogdHJ1ZX0sIGZ1bmN0aW9uKHN0cmVhbSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc3RyZWFtJylcblxuXHRcdFx0XHR2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pXG5cdFx0XHRcdHZpZGVvLnNyYyA9IHVybFxuXHRcdFx0XHR2aWRlby5wbGF5KClcblxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1tDYW1lcmFdIGVycm9yJywgZXJyKVxuXHRcdFx0fSlcdFx0XHRcblx0XHR9XHRcdFxuXG5cdFx0dGhpcy50YWtlUGljdHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRcdCAgICBjdHguZHJhd0ltYWdlKHZpZGVvLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdCAgICByZXR1cm4gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJyk7XG5cdFx0fVx0XHRcblx0fVxuXG5cblxufSk7XG5cblxuXG5cblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5jaGVja2dyb3VwJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGVsdC5vbignY2xpY2snLCAnaW5wdXRbdHlwZT1jaGVja2JveF0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVsdC50cmlnZ2VyKCdpbnB1dCcpXG5cdFx0fSlcblxuXHRcdHRoaXMuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZXQgPSBbXVxuXHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXQucHVzaCgkKHRoaXMpLnZhbCgpKVxuXHRcdFx0fSlcdFxuXHRcdFx0cmV0dXJuIHJldFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZS5pbmRleE9mKCQodGhpcykudmFsKCkpID49IDApXG5cdFx0XHRcdH0pXG5cdFx0XHR9XHRcdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUoZWx0LnZhbCgpKVxuXG5cdH1cblxufSk7XG5cblxuXG5cblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5kYXRlcGlja2VyJywge1xuXHRwcm9wczoge1xuXHRcdHNob3dCdXR0b25QYW5lbDogdHJ1ZVxuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0bGV0IG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5wcm9wcylcblxuXHRcdG9wdGlvbnMub25TZWxlY3QgPSBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdbZGF0ZXBpY2tlcl0gb25TZWxlY3QnKVxuXHRcdFx0ZWx0LnRyaWdnZXIoJ2RhdGVwaWNrZXJjaGFuZ2UnKVxuXHRcdH1cblxuXHRcdGVsdC5kYXRlcGlja2VyKG9wdGlvbnMpXG5cblx0XHR2YXIgdmFsdWUgPSBlbHQudmFsKClcblx0XHRpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG5cdFx0XHR2YXIgbXMgPSBEYXRlLnBhcnNlKHZhbHVlKVxuXHRcdFx0Ly9jb25zb2xlLmxvZygnW0RhdGVQaWNrZXJDb250cm9sXSBtcycsIG1zKVxuXHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZShtcylcblx0XHRcdC8vY29uc29sZS5sb2coJ1tEYXRlUGlja2VyQ29udHJvbF0gZGF0ZScsIGRhdGUpXG5cdFx0XHRlbHQuZGF0ZXBpY2tlcignc2V0RGF0ZScsIGRhdGUpXG5cdFx0fVxuXHRcdFx0XG5cdFx0dGhpcy5zZXRWYWx1ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcblx0XHRcdGVsdC5kYXRlcGlja2VyKCdzZXREYXRlJywgZGF0ZSlcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnZ2V0VmFsdWUnKVxuXHRcdFx0cmV0dXJuIGVsdC5kYXRlcGlja2VyKCdnZXREYXRlJylcblx0XHR9XG5cdH1cblxufSk7XG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuaW5wdXRncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR2YXIgaWQgPSBlbHQuY2hpbGRyZW4oJ2lucHV0JykudW5pcXVlSWQoKS5hdHRyKCdpZCcpXG5cdFx0ZWx0LmNoaWxkcmVuKCdsYWJlbCcpLmF0dHIoJ2ZvcicsIGlkKVxuXHR9XG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLm5hdmJhcicsIHtcblx0cHJvcHM6IHtcblx0XHRhY3RpdmVDb2xvcjogJ3czLWdyZWVuJyxcblx0XHR0eXBlOiAnaG9yaXpvbnRhbCdcblx0fSxcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCB7YWN0aXZlQ29sb3IsIHR5cGV9ID0gdGhpcy5wcm9wc1xuXG5cdFx0ZWx0LmFkZENsYXNzKCh0eXBlID09ICd2ZXJ0aWNhbCcpID8gJ3czLWJhci1ibG9jayc6ICd3My1iYXInKVxuXHRcdGVsdC5jaGlsZHJlbignYScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCd3My1iYXItaXRlbSB3My1idXR0b24nKVxuXHRcdH0pXG5cblx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblx0XHRlbHQuY2hpbGRyZW4oYGFbaHJlZj1cIiMke25ld1JvdXRlfVwiXWApLmFkZENsYXNzKGFjdGl2ZUNvbG9yKVxuXG5cdFx0JCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnW05hdmJhckNvbnRyb2xdIHJvdXRlQ2hhbmdlJywgbmV3Um91dGUpXG5cdFx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblxuXHRcdFx0ZWx0LmNoaWxkcmVuKGBhLiR7YWN0aXZlQ29sb3J9YCkucmVtb3ZlQ2xhc3MoYWN0aXZlQ29sb3IpXHRcblx0XHRcdGVsdC5jaGlsZHJlbihgYVtocmVmPVwiIyR7bmV3Um91dGV9XCJdYCkuYWRkQ2xhc3MoYWN0aXZlQ29sb3IpXG5cblx0XHR9KVx0XG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMucmFkaW9ncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRlbHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9cmFkaW9dJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdyYWRpb2dyb3VwIGNsaWNrJylcblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXTpjaGVja2VkJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuXHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcblx0XHRcdGVsdC50cmlnZ2VyKCdpbnB1dCcpXG5cdFx0fSlcblx0XHRcblxuXHRcdHRoaXMuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb106Y2hlY2tlZCcpLnZhbCgpXG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb10nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSA9PT0gJCh0aGlzKS52YWwoKSlcblx0XHRcdH0pXHRcdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIG1hdGNoUm91dGUocm91dGUsIHBhdHRlcm4pIHtcblx0XHQvL2NvbnNvbGUubG9nKCdtYXRjaFJvdXRlJywgcm91dGUsIHBhdHRlcm4pXG5cdFx0dmFyIHJvdXRlU3BsaXQgPSByb3V0ZS5zcGxpdCgnLycpXG5cdFx0dmFyIHBhdHRlcm5TcGxpdCA9IHBhdHRlcm4uc3BsaXQoJy8nKVxuXHRcdC8vY29uc29sZS5sb2cocm91dGVTcGxpdCwgcGF0dGVyblNwbGl0KVxuXHRcdHZhciByZXQgPSB7fVxuXG5cdFx0aWYgKHJvdXRlU3BsaXQubGVuZ3RoICE9IHBhdHRlcm5TcGxpdC5sZW5ndGgpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0Zm9yKHZhciBpZHggPSAwOyBpZHggPCBwYXR0ZXJuU3BsaXQubGVuZ3RoOyBpZHgrKykge1xuXHRcdFx0dmFyIHBhdGggPSBwYXR0ZXJuU3BsaXRbaWR4XVxuXHRcdFx0Ly9jb25zb2xlLmxvZygncGF0aCcsIHBhdGgpXG5cdFx0XHRpZiAocGF0aC5zdWJzdHIoMCwgMSkgPT09ICc6Jykge1xuXHRcdFx0XHRpZiAocm91dGVTcGxpdFtpZHhdLmxlbmd0aCA9PT0gMClcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRyZXRbcGF0aC5zdWJzdHIoMSldID0gcm91dGVTcGxpdFtpZHhdXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwYXRoICE9PSByb3V0ZVNwbGl0W2lkeF0pIHtcblx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiByZXRcblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0TmV3Um91dGUoKSB7XG5cdFx0Y29uc3QgaHJlZiA9IGxvY2F0aW9uLmhyZWZcblx0XHRjb25zdCBpZHggPSBocmVmLmluZGV4T2YoJyMnKVxuXHRcdGNvbnN0IG5ld1JvdXRlID0gKGlkeCAhPT0gLTEpICA/IGhyZWYuc3Vic3RyKGlkeCsxKSA6ICcvJ1xuXHRcdFxuXHRcdHJldHVybiBuZXdSb3V0ZVxuXHR9XG5cblx0JCQuZ2V0TmV3Um91dGUgPSBnZXROZXdSb3V0ZVxuXG5cdCQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnJvdXRlcicsIHtcblxuXHRcdHByb3BzOiB7XG5cdFx0XHRyb3V0ZXM6IFtdXG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXG5cdFx0XHQkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSBwb3BzdGF0ZScpXG5cdFx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXHRcdFx0fSlcblxuXG5cdFx0XHR2YXIgcm91dGVzID0gdGhpcy5wcm9wcy5yb3V0ZXNcblxuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHJvdXRlcykpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdbcm91dGVyXSBiYWQgcm91dGVzJylcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXG5cdFx0XHRmdW5jdGlvbiBwcm9jZXNzUm91dGUobmV3Um91dGUpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHByb2Nlc3NSb3V0ZScsIG5ld1JvdXRlLCByb3V0ZXMpXG5cblx0XHRcdFx0Zm9yKHZhciByb3V0ZSBvZiByb3V0ZXMpIHtcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0gbWF0Y2hSb3V0ZShuZXdSb3V0ZSwgcm91dGUuaHJlZilcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGByb3V0ZTogJHtyb3V0ZS5ocmVmfSwgcGFyYW1zYCwgcGFyYW1zKVxuXHRcdFx0XHRcdGlmIChwYXJhbXMgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW1JvdXRlckNvbnRyb2xdIHBhcmFtcycsIHBhcmFtcylcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygcm91dGUucmVkaXJlY3QgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHJlZGlyZWN0IHRvICcsIHJvdXRlLnJlZGlyZWN0KVxuXHRcdFx0XHRcdFx0XHRsb2NhdGlvbi5ocmVmID0gJyMnICsgcm91dGUucmVkaXJlY3RcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIHJvdXRlLmNvbnRyb2wgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0ZWx0LnNhZmVFbXB0eSgpLmFkZENvbnRyb2wocm91dGUuY29udHJvbClcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1tyb3V0ZXJdIE5vIHJvdXRlIGZvdW5kICEnKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFx0fVx0XHRcblxuXG5cdFx0fVxuXG5cdH0pXG5cbn0pKCk7XG5cblxuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMudGFicycsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR2YXIgdWwgPSAkKCc8dWw+JykucHJlcGVuZFRvKGVsdClcblxuXHRcdGVsdC5jaGlsZHJlbignZGl2JykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0aXRsZSA9ICQodGhpcykuYXR0cigndGl0bGUnKVxuXHRcdFx0dmFyIGlkID0gJCh0aGlzKS51bmlxdWVJZCgpLmF0dHIoJ2lkJylcblx0XHRcdHZhciBsaSA9ICQoJzxsaT4nKVxuXHRcdFx0XHQuYXR0cigndGl0bGUnLCB0aXRsZSlcblx0XHRcdFx0LmFwcGVuZCgkKCc8YT4nLCB7aHJlZjogJyMnICsgaWR9KS50ZXh0KHRpdGxlKSlcblx0XHRcdFx0LmFwcGVuZFRvKHVsKVxuXHRcdFx0aWYgKCQodGhpcykuYXR0cignZGF0YS1yZW1vdmFibGUnKSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bGkuYXBwZW5kKCQoJzxzcGFuPicsIHtjbGFzczogJ3VpLWljb24gdWktaWNvbi1jbG9zZSd9KSlcblx0XHRcdH1cblx0XHR9KVx0XHRcblxuXHRcdGVsdC50YWJzKClcblx0XHQub24oJ2NsaWNrJywgJ3NwYW4udWktaWNvbi1jbG9zZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHBhbmVsSWQgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCkuYXR0cignYXJpYS1jb250cm9scycpXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdwYW5lbElkJywgcGFuZWxJZClcblx0XHRcdCQoJyMnICsgcGFuZWxJZCkuc2FmZUVtcHR5KCkucmVtb3ZlKClcblx0XHRcdGVsdC50YWJzKCdyZWZyZXNoJylcblx0XHR9KVxuXG5cblx0XHRmdW5jdGlvbiBnZXRUYWJzQ291bnQoKSB7XG5cdFx0XHRyZXR1cm4gdWwuY2hpbGRyZW4oYGxpYCkubGVuZ3RoXG5cdFx0fVxuXG5cdFx0dGhpcy5nZXRUYWJzQ291bnQgPSBnZXRUYWJzQ291bnRcblxuXHRcdHRoaXMuYWRkVGFiID0gZnVuY3Rpb24odGl0bGUsIG9wdGlvbnMpIHtcblx0XHRcdC8vY29uc29sZS5sb2coJ2FkZFRhYicsIHRpdGxlKVxuXHRcdFx0dmFyIGlkeCA9IGdldFRhYnNDb3VudCgpXG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXHRcdFx0dmFyIHRhYiA9ICQoJzxkaXY+Jylcblx0XHRcdFx0LmF0dHIoJ3RpdGxlJywgdGl0bGUpXG5cdFx0XHRcdC5hcHBlbmRUbyhlbHQpXG5cblx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy5jb250cm9sID09ICdzdHJpbmcnKVx0e1xuXHRcdFx0XHR0YWIuYWRkQ29udHJvbChvcHRpb25zLmNvbnRyb2wpXG5cdFx0XHR9XHRcblxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0dGFiLmFwcGVuZChvcHRpb25zLnRlbXBsYXRlKVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaWQgPSB0YWIudW5pcXVlSWQoKS5hdHRyKCdpZCcpXG5cdFx0XHR2YXIgbGkgPSAkKCc8bGk+Jylcblx0XHRcdFx0LmF0dHIoJ3RpdGxlJywgdGl0bGUpXG5cdFx0XHRcdC5hcHBlbmQoJCgnPGE+Jywge2hyZWY6ICcjJyArIGlkfSkudGV4dCh0aXRsZSkpXG5cdFx0XHRcdC5hcHBlbmRUbyh1bClcblx0XHRcdGlmIChvcHRpb25zLnJlbW92YWJsZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRsaS5hcHBlbmQoJCgnPHNwYW4+Jywge2NsYXNzOiAndWktaWNvbiB1aS1pY29uLWNsb3NlJ30pKVxuXHRcdFx0fVx0XHRcdFxuXG5cdFx0XHRlbHQudGFicygncmVmcmVzaCcpXG5cdFx0XHRyZXR1cm4gaWR4XG5cdFx0fVxuXG5cdFx0dGhpcy5nZXRTZWxlY3RlZFRhYkluZGV4ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaW5kZXggPSB1bC5jaGlsZHJlbignbGkudWktc3RhdGUtYWN0aXZlJykuaW5kZXgoKVxuXHRcdFx0cmV0dXJuIGluZGV4XG5cdFx0fVxuXG5cdFx0dGhpcy5nZXRUYWJJbmZvID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdGNvbnN0IHRpdGxlID0gdWwuY2hpbGRyZW4oJ2xpJykuZXEoaW5kZXgpLmF0dHIoJ3RpdGxlJylcblx0XHRcdHJldHVybiB7dGl0bGV9XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VmFyVmFsdWUoZGF0YSwgdmFyTmFtZSkge1xyXG4gICAgdmFyIHJldCA9IGRhdGFcclxuICAgIGZvcihsZXQgZiBvZiB2YXJOYW1lLnNwbGl0KCcuJykpIHtcclxuICAgICAgXHJcbiAgICAgIGlmICh0eXBlb2YgcmV0ID09ICdvYmplY3QnICYmIGYgaW4gcmV0KSB7XHJcbiAgICAgICAgcmV0ID0gcmV0W2ZdXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygnW0NvcmVdIGdldFZhbHVlJywgdmFyTmFtZSwgY3R4KVxyXG5cclxuICAgIC8vIHZhciBub3QgPSBmYWxzZVxyXG4gICAgLy8gaWYgKHZhck5hbWUuc3RhcnRzV2l0aCgnIScpKSB7XHJcbiAgICAvLyAgIHZhck5hbWUgPSB2YXJOYW1lLnN1YnN0cigxKVxyXG4gICAgLy8gICBub3QgPSB0cnVlXHJcbiAgICAvLyB9ICAgICBcclxuXHJcbiAgICB2YXIgZnVuYyA9IGRhdGFbdmFyTmFtZV1cclxuICAgIHZhciB2YWx1ZVxyXG5cclxuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHZhbHVlID0gZnVuYy5jYWxsKGRhdGEpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFsdWUgPSBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBpZiAodHlwZW9mIHZhbHVlID09ICdib29sZWFuJyAmJiBub3QpIHtcclxuICAgIC8vICAgdmFsdWUgPSAhdmFsdWVcclxuICAgIC8vIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVcclxuICB9XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNwbGl0QXR0cihhdHRyVmFsdWUsIGNiaykge1xyXG4gIGF0dHJWYWx1ZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgbGV0IFtuYW1lLCB2YWx1ZV0gPSBpLnNwbGl0KCc6JylcclxuICAgIGNiayhuYW1lLnRyaW0oKSwgdmFsdWUudHJpbSgpKVxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5jb25zdCBtYXAgPSB7XHJcbiAgJ2JuLWVhY2gnOiB7dHlwZTogM30sXHJcbiAgJ2JuLXRleHQnOiB7ZjogJ3RleHQnLCB0eXBlOiAxfSxcclxuICAnYm4taHRtbCc6IHtmOiAnaHRtbCcsIHR5cGU6IDF9LFxyXG4gICdibi12YWwnOiB7ZjogJ3NldFZhbHVlJywgdHlwZTogMX0sXHJcbiAgJ2JuLXNob3cnOiB7ZjogJ3NldFZpc2libGUnLCB0eXBlOiAxfSxcclxuICAnYm4tc3R5bGUnOiB7ZjogJ2NzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1hdHRyJzoge2Y6ICdhdHRyJywgdHlwZTogMn0sXHJcbiAgJ2JuLXByb3AnOiB7ZjogJ3Byb3AnLCB0eXBlOiAyfSxcclxuICAnYm4tZGF0YSc6IHtmOiAnc2V0RGF0YScsIHR5cGU6IDJ9LFxyXG4gICdibi1jbGFzcyc6IHtmOiAnc2V0Q2xhc3MnLCB0eXBlOiAyfSxcclxuICAnYm4tY29udHJvbCc6IHt0eXBlOiA0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGN0eCwgZGF0YSwgdmFycywgZXhjbHVkZUVsdCkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCdbYmluZGluZ10gdXBkYXRlJywgdmFycywgZGF0YSwgZXhjbHVkZUVsdClcclxuXHJcbiAgaWYgKHR5cGVvZiB2YXJzID09ICdzdHJpbmcnKSB7XHJcbiAgICB2YXJzID0gdmFycy5zcGxpdCgnLCcpXHJcbiAgfVxyXG5cclxuICB2YXJzLmZvckVhY2goZnVuY3Rpb24odmFyaWFibGUpIHtcclxuICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhcmlhYmxlKVxyXG4gICAgXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAhdmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgIHVwZGF0ZShjdHgsIGRhdGEsIE9iamVjdC5rZXlzKHZhbHVlKS5tYXAoaSA9PiB2YXJpYWJsZSArICcuJyArIGkpLCBleGNsdWRlRWx0KVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGN0eFt2YXJpYWJsZV0pIHtcclxuICAgICAgY3R4W3ZhcmlhYmxlXS5mb3JFYWNoKGZ1bmN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCB7dHlwZSwgZiwgZWx0LCBuYW1lLCB0ZW1wbGF0ZSwgaXRlciwgbm90fSA9IGFjdGlvblxyXG4gICAgICAgIGlmIChlbHQgPT0gZXhjbHVkZUVsdCkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB2YWx1ZVxyXG5cclxuICAgICAgICBpZiAobm90ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBuZXdWYWx1ZSA9ICFuZXdWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAxKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGUnLCB2YXJpYWJsZSwgZiwgbmV3VmFsdWUpXHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuZXdWYWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMikge1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRlJywgdmFyaWFibGUsIGYsIG5hbWUsIG5ld1ZhbHVlKVxyXG4gICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmFtZSwgbmV3VmFsdWUpXHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIGlmICh0eXBlID09IDMgJiYgQXJyYXkuaXNBcnJheShuZXdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgZWx0LmVtcHR5KClcclxuICAgICAgICAgICAgbmV3VmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGl0ZW1EYXRhID0gJC5leHRlbmQoe30sIGRhdGEpXHJcbiAgICAgICAgICAgICAgaXRlbURhdGFbaXRlcl0gPSBpdGVtXHJcbiAgICAgICAgICAgICAgdmFyICRpdGVtID0gdGVtcGxhdGUuY2xvbmUoKVxyXG4gICAgICAgICAgICAgIHByb2Nlc3MoJGl0ZW0sIGl0ZW1EYXRhKVxyXG4gICAgICAgICAgICAgIGVsdC5hcHBlbmQoJGl0ZW0pICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NFdmVudHMocm9vdCwgZXZlbnRzKSB7XHJcbiAgcm9vdC5ibkZpbmQoYFtibi1ldmVudF1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgZWx0LnJlbW92ZUF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgXHJcbiAgICAgIHNwbGl0QXR0cihhdHRyVmFsdWUsIGZ1bmN0aW9uKGV2dE5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgbGV0IGZuICA9IGV2ZW50c1t2YWx1ZV1cclxuICAgICAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHsgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgW25hbWUsIHNlbGVjdG9yXSA9IGV2dE5hbWUuc3BsaXQoJy4nKVxyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RvciAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZWx0Lm9uKG5hbWUsICcuJyArIHNlbGVjdG9yLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgZm4pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICBcclxuICAgIH0pXHJcbiAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3Mocm9vdCwgZGF0YSwgY3JlYXRlQ29udHJvbCwgdXBkYXRlQ2JrKSB7XHJcblxyXG4gIFxyXG4gIGlmIChyb290Lmxlbmd0aCA+IDEpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1tiaW5kaW5nXSBwcm9jZXNzJywgcm9vdC5sZW5ndGgsIGRhdGEpXHJcbiAgfVxyXG5cclxuICBsZXQgY3R4ID0ge31cclxuICBcclxuICBmb3IobGV0IGRpciBpbiBtYXApIHtcclxuICAgIFxyXG5cclxuICAgIHJvb3QuYm5GaW5kKGBbJHtkaXJ9XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cihkaXIpXHJcbiAgICAgIGVsdC5yZW1vdmVBdHRyKGRpcilcclxuXHJcbiAgICAgIGxldCB7dHlwZSwgZn0gPSBtYXBbZGlyXVxyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgIGxldCBub3QgPSBmYWxzZVxyXG4gICAgICAgIGlmIChhdHRyVmFsdWUuc3RhcnRzV2l0aCgnIScpKSB7XHJcbiAgICAgICAgICBhdHRyVmFsdWUgPSBhdHRyVmFsdWUuc3Vic3RyKDEpXHJcbiAgICAgICAgICBub3QgPSB0cnVlXHJcbiAgICAgICAgfSBcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIGF0dHJWYWx1ZSlcclxuICAgICAgICAgIGlmIChub3QgJiYgdHlwZW9mIHZhbHVlID09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICF2YWx1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9lbHQudGV4dChkYXRhW2F0dHJWYWx1ZV0pXHJcbiAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYgKGRpciA9PSAnYm4tdmFsJykge1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZUV2dCA9IGVsdC5hdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgaWYgKHVwZGF0ZUV2dCkge1xyXG4gICAgICAgICAgICBlbHQucmVtb3ZlQXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgICAgZWx0Lm9uKHVwZGF0ZUV2dCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnW2JpbmRpbmddIHVwZGF0ZUV2dCcsIHVwZGF0ZUV2dCwgZWx0KVxyXG4gICAgICAgICAgICAgIHVwZGF0ZUNiayhhdHRyVmFsdWUsIGVsdC5nZXRWYWx1ZSgpLCBlbHQpXHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG5cclxuICAgICAgICBjdHhbYXR0clZhbHVlXSA9IGN0eFthdHRyVmFsdWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0ucHVzaCh7ZiwgZWx0LCB0eXBlLCBub3R9KSAgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDQgJiYgdHlwZW9mIGNyZWF0ZUNvbnRyb2wgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2woYXR0clZhbHVlLCBlbHQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDIpIHtcclxuXHJcbiAgICAgICAgICBzcGxpdEF0dHIoYXR0clZhbHVlLCBmdW5jdGlvbihuYW1lLCB2YXJOYW1lKSB7XHJcbiAgICAgICAgICAgIGxldCBub3QgPSBmYWxzZVxyXG4gICAgICAgICAgICBpZiAoYXR0clZhbHVlLnN0YXJ0c1dpdGgoJyEnKSkge1xyXG4gICAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGF0dHJWYWx1ZS5zdWJzdHIoMSlcclxuICAgICAgICAgICAgICBub3QgPSB0cnVlXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICAgICAgICBpZiAobm90ICYmIHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gIXZhbHVlXHJcbiAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2YsIGVsdCwgdHlwZSwgbmFtZSwgbm90fSkgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDMpIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBlbHQuY2hpbGRyZW4oKS5yZW1vdmUoKS5jbG9uZSgpXHJcbiAgICAgICAgbGV0IFtpdGVyLCAsIHZhck5hbWVdID0gYXR0clZhbHVlLnNwbGl0KCcgJylcclxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtlbHQsIHR5cGUsIHRlbXBsYXRlLCBpdGVyfSkgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkYXRhICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSwgY3JlYXRlQ29udHJvbClcclxuICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgIFxyXG4gIFxyXG4gIH1cclxuICBcclxuXHJcbiAgcmV0dXJuIGN0eFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzQmluZGluZ3Mocm9vdCkge1xyXG5cclxuICB2YXIgZGF0YSA9IHt9XHJcblxyXG4gIHJvb3QuYm5GaW5kKGBbYm4tYmluZF1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGVsdCA9ICQodGhpcylcclxuICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cignYm4tYmluZCcpXHJcbiAgICBlbHQucmVtb3ZlQXR0cignYm4tYmluZCcpXHJcbiAgICBkYXRhW2F0dHJWYWx1ZV0gPSBlbHRcclxuICB9KVxyXG5cclxuICByb290LmJuRmluZChgW2JuLWlmYWNlXWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgbGV0IGF0dHJWYWx1ZSA9IGVsdC5hdHRyKCdibi1pZmFjZScpXHJcbiAgICBlbHQucmVtb3ZlQXR0cignYm4taWZhY2UnKVxyXG4gICAgZGF0YVthdHRyVmFsdWVdID0gZWx0LmlmYWNlKClcclxuICB9KVxyXG5cclxuICByZXR1cm4gZGF0YVxyXG4gIFxyXG59XHJcblxyXG4kJC5iaW5kaW5nID0ge1xyXG4gIHByb2Nlc3MsXHJcbiAgdXBkYXRlLFxyXG4gIHByb2Nlc3NFdmVudHMsXHJcbiAgcHJvY2Vzc0JpbmRpbmdzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxubGV0IGNvbnRyb2xzID0ge31cclxuXHJcbmZ1bmN0aW9uIGlzRGVwc09rKGRlcHMpIHtcclxuXHRyZXR1cm4gZGVwcy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XHJcblxyXG5cdFx0cmV0dXJuIHByZXYgJiYgKGN1ciAhPSB1bmRlZmluZWQpXHJcblx0fSwgdHJ1ZSlcdFx0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckNvbnRyb2wobmFtZSwgb3B0aW9ucykge1xyXG5cdGlmICghJCQudXRpbC5jaGVja1R5cGUob3B0aW9ucywge1xyXG5cdFx0JGRlcHM6IFsnc3RyaW5nJ10sXHJcblx0XHRpbml0OiAnZnVuY3Rpb24nXHJcblx0fSkpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoYFtDb3JlXSByZWdpc3RlckNvbnRyb2w6IGJhZCBvcHRpb25zYCwgb3B0aW9ucylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblxyXG5cdHZhciBkZXBzID0gb3B0aW9ucy5kZXBzIHx8IFtdXHJcblxyXG5cdGNvbnNvbGUubG9nKGBbQ29yZV0gcmVnaXN0ZXIgY29udHJvbCAnJHtuYW1lfScgd2l0aCBkZXBzYCwgZGVwcylcclxuXHJcblx0Y29udHJvbHNbbmFtZV0gPSB7ZGVwcywgb3B0aW9ucywgc3RhdHVzOiAnbm90bG9hZGVkJ31cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29udHJvbChuYW1lKSB7XHJcblx0dmFyIHJldCA9IGNvbnRyb2xzW25hbWVdXHJcblx0aWYgKHJldCAmJiByZXQuc3RhdHVzID09ICdub3Rsb2FkZWQnKSB7XHJcblx0XHRyZXQuZGVwcyA9ICQkLnNlcnZpY2UuZ2V0U2VydmljZXMocmV0LmRlcHMpXHJcblx0XHRyZXQuc3RhdHVzID0gaXNEZXBzT2socmV0LmRlcHMpID8gJ29rJyA6ICdrbydcclxuXHR9XHJcblx0cmV0dXJuIHJldFxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDb250cm9sKGNvbnRyb2xOYW1lLCBlbHQpIHtcclxuXHRlbHQuYWRkQ2xhc3MoY29udHJvbE5hbWUucmVwbGFjZSgnLicsICctJykpXHJcblx0ZWx0LmFkZENsYXNzKCdDdXN0b21Db250cm9sJykudW5pcXVlSWQoKVx0XHJcblx0dmFyIGN0cmwgPSBnZXRDb250cm9sKGNvbnRyb2xOYW1lKVxyXG5cdFx0XHJcblx0aWYgKGN0cmwgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHR0aHJvdyhgW0NvcmVdIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0fVxyXG5cdFx0Ly9jb25zb2xlLmxvZygnY3JlYXRlQ29udHJvbCcsIGNvbnRyb2xOYW1lLCBjdHJsKVxyXG5cdGlmIChjdHJsLnN0YXR1cyA9PT0gICdvaycpIHtcclxuXHRcdFxyXG5cdFx0dmFyIGlmYWNlID0ge1xyXG5cdFx0XHRwcm9wczoge30sXHJcblx0XHRcdG5hbWU6IGNvbnRyb2xOYW1lXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHtpbml0LCBwcm9wcywgdGVtcGxhdGV9ID0gY3RybC5vcHRpb25zXHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9XHJcblxyXG5cdFx0T2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goZnVuY3Rpb24ocHJvcE5hbWUpIHtcclxuXHRcdFx0aWZhY2UucHJvcHNbcHJvcE5hbWVdID0gZWx0LmRhdGEocHJvcE5hbWUpIHx8IHByb3BzW3Byb3BOYW1lXVxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAodHlwZW9mIHRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdCQodGVtcGxhdGUpLmFwcGVuZFRvKGVsdClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuXHRcdFx0dGVtcGxhdGUuY2hpbGRyZW4oKS5jbG9uZSgpLmFwcGVuZFRvKGVsdClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIGluaXQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuXHRcdFx0dmFyIGFyZ3MgPSBbZWx0XS5jb25jYXQoY3RybC5kZXBzKVxyXG5cdFx0XHRpbml0LmFwcGx5KGlmYWNlLCBhcmdzKVxyXG5cdFx0XHRjb25zb2xlLmxvZyhgW0NvcmVdIGluc3RhbmNlIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyB3aXRoIHByb3BzYCwgaWZhY2UucHJvcHMpXHJcblxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihgW0NvcmVdIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyBtaXNzaW5nIGluaXQgZnVuY3Rpb25gKVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRlbHQuZ2V0KDApLmN0cmwgPSBpZmFjZVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaWZhY2VcdFx0XHRcdFxyXG5cdH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuJCQuY29udHJvbCA9IHtcclxuXHRyZWdpc3RlckNvbnRyb2wsXHJcblx0Y3JlYXRlQ29udHJvbFxyXG59XHJcblxyXG59KSgpO1xyXG4iLCIkJC5kaWFsb2dDb250cm9sbGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBkaXYgPSAkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZSB8fCAnRGlhbG9nJ30pXHJcblxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0JChvcHRpb25zLnRlbXBsYXRlKS5hcHBlbmRUbyhkaXYpXHJcblx0fVx0XHJcblxyXG5cdHZhciBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZGl2LCBvcHRpb25zKVxyXG5cclxuXHR2YXIgZGxnT3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuXHRcdGF1dG9PcGVuOiBmYWxzZSxcclxuXHRcdG1vZGFsOiB0cnVlLFxyXG5cdFx0d2lkdGg6ICdhdXRvJyxcdFx0XHJcblx0fSwgb3B0aW9ucylcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHQvL2NvbnNvbGUubG9nKCdkbGdPcHRpb25zJywgZGxnT3B0aW9ucylcclxuXHJcblx0ZGl2LmRpYWxvZyhkbGdPcHRpb25zKVxyXG5cclxuXHRjdHJsLnNob3cgPSBmdW5jdGlvbihvbkFwcGx5KSB7XHJcblx0XHRwcml2YXRlLm9uQXBwbHkgPSBvbkFwcGx5XHJcblx0XHRkaXYuZGlhbG9nKCdvcGVuJylcclxuXHR9XHJcblxyXG5cdGN0cmwuaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZGl2LmRpYWxvZygnY2xvc2UnKVxyXG5cdH1cclxuXHJcblx0Y3RybC5hcHBseSA9IGZ1bmN0aW9uKHJldFZhbHVlKSB7XHJcblx0XHRjdHJsLmhpZGUoKVxyXG5cdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRwcml2YXRlLm9uQXBwbHkocmV0VmFsdWUpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjdHJsLnNldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbk5hbWUsIHZhbHVlKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdvcHRpb24nLCBvcHRpb25OYW1lLCB2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGN0cmwuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZGl2LmRpYWxvZygnZGVzdHJveScpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gY3RybFxyXG59O1xyXG4iLCIkJC5mb3JtRGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgZGl2ID0gJCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGUgfHwgJ0RpYWxvZyd9KVxyXG5cclxuXHR2YXIgcHJpdmF0ZSA9IHt9XHJcblxyXG5cdHZhciBmb3JtID0gJCgnPGZvcm0+JylcclxuXHRcdC5hcHBlbmRUbyhkaXYpXHJcblx0XHQub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0ZGl2LmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHRpZiAodHlwZW9mIHByaXZhdGUub25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0cHJpdmF0ZS5vbkFwcGx5KCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcclxuXHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXHJcblx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0fSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGZvcm0pXHJcblx0fVx0XHJcblxyXG5cdGlmIChvcHRpb25zLnRlbXBsYXRlIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcblx0XHRvcHRpb25zLnRlbXBsYXRlLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cclxuXHJcblx0dmFyIHN1Ym1pdEJ0biA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ3N1Ym1pdCcsIGhpZGRlbjogdHJ1ZX0pLmFwcGVuZFRvKGZvcm0pXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHJcblx0XHRidXR0b25zOiB7XHJcblx0XHRcdCdDYW5jZWwnOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnQXBwbHknOiBmdW5jdGlvbigpIHtcdFx0XHRcdFx0XHJcblx0XHRcdFx0c3VibWl0QnRuLmNsaWNrKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0c2hvdzogZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0XHRwcml2YXRlLm9uQXBwbHkgPSBvbkFwcGx5XHRcdFx0XHJcblx0XHRcdGRpdi5kaWFsb2coJ29wZW4nKVx0XHRcdFxyXG5cdFx0fSxcclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0Zm9ybS5zZXRGb3JtRGF0YShkYXRhKVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0ZGl2LmRpYWxvZygnZGVzdHJveScpXHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcblxyXG4kLmZuLmJuRmluZD0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgIHJldHVybiB0aGlzLmZpbmQoc2VsZWN0b3IpLmFkZCh0aGlzLmZpbHRlcihzZWxlY3RvcikpXHJcbn1cclxuXHJcbiQuZm4uc2V0Q2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlzQWN0aXZlKSB7XHJcbiAgICBpZiAoaXNBY3RpdmUpIHtcclxuICAgICAgdGhpcy5hZGRDbGFzcyhjbGFzc05hbWUpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5yZW1vdmVDbGFzcyhjbGFzc05hbWUpXHJcbiAgICB9XHJcbn1cclxuXHJcbiQuZm4uc2V0VmlzaWJsZSA9IGZ1bmN0aW9uKGlzVmlzaWJsZSkge1xyXG4gICAgaWYgKGlzVmlzaWJsZSkge1xyXG4gICAgICB0aGlzLnNob3coKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuaGlkZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbiQuZm4uaWZhY2UgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5nZXQoMCkuY3RybFxyXG59XHJcblxyXG4kLmZuLnNldERhdGEgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcblxyXG4gIGNvbnN0IGZ1bmNOYW1lID0gJ3NldCcgKyBuYW1lLnN1YnN0cigwLDEpLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKVxyXG4gIC8vY29uc29sZS5sb2coJ2Z1bmNOYW1lJywgZnVuY05hbWUpXHJcblxyXG4gIGlmIChpZmFjZSAmJiBpZmFjZS5wcm9wc1tuYW1lXSAmJiB0eXBlb2YgaWZhY2VbZnVuY05hbWVdID09ICdmdW5jdGlvbicpIHtcclxuICAgIGlmYWNlW2Z1bmNOYW1lXSh2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSBpZiAoaWZhY2UgJiYgJCQuaXNWaWV3Q29udHJvbGxlcihpZmFjZS5jdHJsKSAmJiBpZmFjZS5jdHJsLm1vZGVsW25hbWVdKSB7XHJcbiAgICBpZmFjZS5jdHJsLnNldERhdGEobmFtZSwgdmFsdWUpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5kYXRhKG5hbWUsIHZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuJC5mbi5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gJ0lOUFVUJyAmJiB0aGlzLmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICB0aGlzLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSlcclxuICAgIHJldHVyblxyXG4gIH0gIFxyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcblxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2Uuc2V0VmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWZhY2Uuc2V0VmFsdWUodmFsdWUpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy52YWwodmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG4kLmZuLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc3QgdHlwZSA9IHRoaXMuYXR0cigndHlwZScpXHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gJ0lOUFVUJyAmJiB0eXBlID09ICdjaGVja2JveCcpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3AoJ2NoZWNrZWQnKVxyXG4gIH0gICAgXHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLmdldFZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiBpZmFjZS5nZXRWYWx1ZSgpXHJcbiAgfVxyXG4gIHZhciByZXQgPSB0aGlzLnZhbCgpXHJcblxyXG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3JhbmdlJykge1xyXG4gICAgcmV0ID0gcGFyc2VGbG9hdChyZXQpXHJcbiAgfVxyXG4gIHJldHVybiByZXRcclxufVxyXG5cclxuJC5mbi5nZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciByZXQgPSB7fVxyXG4gIHRoaXMuZmluZCgnW25hbWVdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBlbHQgPSAkKHRoaXMpXHJcbiAgICB2YXIgbmFtZSA9IGVsdC5hdHRyKCduYW1lJylcclxuICAgIHJldFtuYW1lXSA9IGVsdC5nZXRWYWx1ZSgpXHJcblxyXG4gIH0pXHJcblxyXG4gIHJldHVybiByZXRcclxufVxyXG5cclxuJC5mbi5yZXNldEZvcm0gPSBmdW5jdGlvbigpIHtcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSBcIkZPUk1cIikge1xyXG4gICAgdGhpcy5nZXQoMCkucmVzZXQoKVxyXG4gIH0gICBcclxufVxyXG5cclxuJC5mbi5zZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHJcbiAgLy9jb25zb2xlLmxvZygnc2V0Rm9ybURhdGEnLCBkYXRhKVxyXG4gIHRoaXMucmVzZXRGb3JtKClcclxuXHJcbiAgZm9yKHZhciBuYW1lIGluIGRhdGEpIHtcclxuICAgIHZhciB2YWx1ZSA9IGRhdGFbbmFtZV1cclxuICAgIHZhciBlbHQgPSB0aGlzLmZpbmQoYFtuYW1lPSR7bmFtZX1dYClcclxuICAgIGlmIChlbHQubGVuZ3RoKSB7XHJcbiAgICAgIGVsdC5zZXRWYWx1ZSh2YWx1ZSkgICAgICAgXHJcbiAgICB9XHJcblxyXG4gIFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuJC5mbi5zYWZlRW1wdHkgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmZpbmQoJy5DdXN0b21Db250cm9sJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGlmYWNlID0gJCh0aGlzKS5pZmFjZSgpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBpZmFjZS5kaXNwb3NlID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgaWZhY2UuZGlzcG9zZSgpXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgdGhpcy5lbXB0eSgpXHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbiQuZm4uYWRkQ29udHJvbCA9IGZ1bmN0aW9uKGN0cmxOYW1lKSB7XHJcbiAgdmFyIG5ld0N0cmwgPSAkKCc8ZGl2PicpXHJcbiAgJCQuY29udHJvbC5jcmVhdGVDb250cm9sKGN0cmxOYW1lLCBuZXdDdHJsKVxyXG4gIHRoaXMuYXBwZW5kKG5ld0N0cmwpIFxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIlxyXG4oZnVuY3Rpb24oKXtcclxuXHJcbmxldCBzZXJ2aWNlcyA9IHt9XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZXJ2aWNlcyhkZXBzKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGdldFNlcnZpY2VzJywgZGVwcylcclxuXHRyZXR1cm4gZGVwcy5tYXAoZnVuY3Rpb24oZGVwTmFtZSkge1xyXG5cdFx0dmFyIHNydiA9IHNlcnZpY2VzW2RlcE5hbWVdXHJcblx0XHRpZiAoc3J2KSB7XHJcblx0XHRcdGlmIChzcnYuc3RhdHVzID09ICdub3Rsb2FkZWQnKSB7XHJcblx0XHRcdFx0dmFyIGRlcHMyID0gZ2V0U2VydmljZXMoc3J2LmRlcHMpXHJcblx0XHRcdFx0dmFyIGNvbmZpZyA9IHNydi5jb25maWcgfHwge31cclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgW0NvcmVdIGluc3RhbmNlIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIHdpdGggY29uZmlnYCwgY29uZmlnKVxyXG5cdFx0XHRcdHZhciBhcmdzID0gW2NvbmZpZ10uY29uY2F0KGRlcHMyKVxyXG5cdFx0XHRcdHNydi5vYmogPSBzcnYuZm4uYXBwbHkobnVsbCwgYXJncylcclxuXHRcdFx0XHRzcnYuc3RhdHVzID0gJ3JlYWR5J1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzcnYub2JqXHRcdFx0XHRcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvL3Nydi5zdGF0dXMgPSAnbm90cmVnaXN0ZXJlZCdcclxuXHRcdFx0dGhyb3coYFtDb3JlXSBzZXJ2aWNlICcke2RlcE5hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0XHR9XHJcblxyXG5cdH0pXHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlU2VydmljZShuYW1lLCBjb25maWcpIHtcclxuXHRjb25zb2xlLmxvZygnW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UnLCBuYW1lLCBjb25maWcpXHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBjb25maWcgIT0gJ29iamVjdCcpIHtcclxuXHRcdGNvbnNvbGUud2FybignW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0XHRyZXR1cm5cclxuXHR9IFx0XHJcblxyXG5cdHZhciBzcnYgPSBzZXJ2aWNlc1tuYW1lXVxyXG5cdGlmIChzcnYpIHtcclxuXHRcdHNydi5jb25maWcgPSBjb25maWdcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aHJvdyhgW2NvbmZpZ3VyZVNlcnZpY2VdIHNlcnZpY2UgJyR7bmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2UobmFtZSwgYXJnMSwgYXJnMikge1xyXG5cdHZhciBkZXBzID0gW11cclxuXHR2YXIgZm4gPSBhcmcxXHJcblx0aWYgKEFycmF5LmlzQXJyYXkoYXJnMSkpIHtcclxuXHRcdGRlcHMgPSBhcmcxXHJcblx0XHRmbiA9IGFyZzJcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBmbiA9PSAndW5kZWZpbmVkJyB8fCAhQXJyYXkuaXNBcnJheShkZXBzKSkge1xyXG5cdFx0dGhyb3coJ1tDb3JlXSByZWdpc3RlclNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0fSBcclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIHNlcnZpY2UgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdHNlcnZpY2VzW25hbWVdID0ge2RlcHMsIGZuLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG4kJC5zZXJ2aWNlID0ge1xyXG5cdHJlZ2lzdGVyU2VydmljZSxcclxuXHRjb25maWd1cmVTZXJ2aWNlLFxyXG5cdGdldFNlcnZpY2VzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xuXG5mdW5jdGlvbiBzaG93QWxlcnQob3B0aW9ucywgY2FsbGJhY2spIHtcblxuXHRvcHRpb25zID0gJC5leHRlbmQoe1xuXHRcdHRpdGxlOiAnQWxlcnQnLFxuXHRcdGNvbnRlbnQ6ICcnLFxuXHRcdHNob3dDYW5jZWw6IGZhbHNlXG5cdH0sIG9wdGlvbnMpXG5cblx0b3B0aW9ucy5tb2RlbCA9IHRydWVcblx0b3B0aW9ucy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuZGlhbG9nKCdkZXN0cm95Jylcblx0fVxuXHRvcHRpb25zLmJ1dHRvbnMgPSB7XG5cdFx0J09LJzogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmRpYWxvZygnY2xvc2UnKVxuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGNhbGxiYWNrKClcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0aWYgKG9wdGlvbnMuc2hvd0NhbmNlbCkge1xuXHRcdG9wdGlvbnMuYnV0dG9uc1snQ2FuY2VsJ10gPSBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXG5cdFx0fVxuXHR9XG5cblx0JCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGV9KVxuXHRcdC5hcHBlbmQoJCgnPHA+JykuaHRtbChvcHRpb25zLmNvbnRlbnQpKVxuXHRcdC5kaWFsb2cob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gc2hvd0NvbmZpcm0ob3B0aW9ucywgY2FsbGJhY2spIHtcblx0b3B0aW9ucy5zaG93Q2FuY2VsID0gdHJ1ZVxuXHRzaG93QWxlcnQob3B0aW9ucywgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIHNob3dQcm9tcHQob3B0aW9ucywgY2FsbGJhY2spIHtcblxuXHRjb25zdCBsYWJlbCA9IG9wdGlvbnMubGFiZWwgfHwgJydcblxuXHRvcHRpb25zLnRlbXBsYXRlID0gYFxuXHQ8cD4ke2xhYmVsfTwvcD5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ9XCJcIiBuYW1lPVwidmFsdWVcIj5cblx0YFxuXG5cdG9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLmRpYWxvZygnZGVzdHJveScpXG5cdH1cblxuXHQkJC5mb3JtRGlhbG9nQ29udHJvbGxlcihvcHRpb25zKVxuXHQuc2hvdyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRjYWxsYmFjayhkYXRhLnZhbHVlKVxuXHRcdH1cblx0fSlcbn1cblxuJCQudWkgPSB7XG5cdHNob3dBbGVydCxcblx0c2hvd0NvbmZpcm0sXG5cdHNob3dQcm9tcHRcbn1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuZnVuY3Rpb24gcmVhZFRleHRGaWxlKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc1RleHQoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWFkRmlsZUFzRGF0YVVSTChmaWxlTmFtZSwgb25SZWFkKSB7XHJcblx0dmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcblxyXG5cdGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodHlwZW9mIG9uUmVhZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdG9uUmVhZChmaWxlUmVhZGVyLnJlc3VsdClcclxuXHRcdH1cclxuXHR9XHJcblx0ZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVOYW1lKVxyXG59XHJcblxyXG5cclxudmFyIGlucHV0RmlsZSA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ2ZpbGUnfSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdHZhciBvbkFwcGx5ID0gJCh0aGlzKS5kYXRhKCdvbkFwcGx5JylcclxuXHR2YXIgZmlsZU5hbWUgPSB0aGlzLmZpbGVzWzBdXHJcblx0aWYgKHR5cGVvZiBvbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdG9uQXBwbHkoZmlsZU5hbWUpXHJcblx0fVxyXG59KVxyXG5cclxuZnVuY3Rpb24gb3BlbkZpbGVEaWFsb2cob25BcHBseSkge1xyXG5cdGlucHV0RmlsZS5kYXRhKCdvbkFwcGx5Jywgb25BcHBseSlcclxuXHRpbnB1dEZpbGUuY2xpY2soKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0ltYWdlKGZpbGVOYW1lKSB7XHJcblx0cmV0dXJuICgvXFwuKGdpZnxqcGd8anBlZ3xwbmcpJC9pKS50ZXN0KGZpbGVOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkYXRhVVJMdG9CbG9iKGRhdGFVUkwpIHtcclxuICAvLyBEZWNvZGUgdGhlIGRhdGFVUkxcclxuICBjb25zdCBbICwgbWltZVR5cGUsIGVuY29kYWdlLCBkYXRhXSA9IGRhdGFVUkwuc3BsaXQoL1s6LDtdLylcclxuICBpZiAoZW5jb2RhZ2UgIT0gJ2Jhc2U2NCcpIHtcclxuICBcdHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmxvZygnbWltZVR5cGUnLCBtaW1lVHlwZSlcclxuICAvL2NvbnNvbGUubG9nKCdlbmNvZGFnZScsIGVuY29kYWdlKVxyXG4gIC8vY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxyXG5cclxuICB2YXIgYmluYXJ5ID0gYXRvYihkYXRhKVxyXG4gLy8gQ3JlYXRlIDgtYml0IHVuc2lnbmVkIGFycmF5XHJcbiAgdmFyIGFycmF5ID0gW11cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIG91ciBCbG9iIG9iamVjdFxyXG5cdHJldHVybiBuZXcgQmxvYihbIG5ldyBVaW50OEFycmF5KGFycmF5KSBdLCB7bWltZVR5cGV9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3R5bGUoc3R5bGVGaWxlUGF0aCwgY2FsbGJhY2spIHtcdFxyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBsb2FkU3R5bGUnLCBzdHlsZUZpbGVQYXRoKVxyXG5cclxuXHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNzc09rID0gJCgnaGVhZCcpLmZpbmQoYGxpbmtbaHJlZj1cIiR7c3R5bGVGaWxlUGF0aH1cIl1gKS5sZW5ndGhcclxuXHRcdGlmIChjc3NPayAhPSAxKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBsb2FkaW5nICcke3N0eWxlRmlsZVBhdGh9JyBzdHlsZWApXHJcblx0XHRcdCQoJzxsaW5rPicsIHtocmVmOiBzdHlsZUZpbGVQYXRoLCByZWw6ICdzdHlsZXNoZWV0J30pXHJcblx0XHRcdC5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAnJHtzdHlsZUZpbGVQYXRofScgbG9hZGVkYClcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbygkKCdoZWFkJykpXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5cdFxyXG5mdW5jdGlvbiBpc09iamVjdChhKSB7XHJcblx0cmV0dXJuICh0eXBlb2YgYSA9PSAnb2JqZWN0JykgJiYgIUFycmF5LmlzQXJyYXkoYSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tUeXBlKHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnY2hlY2tUeXBlJyx2YWx1ZSwgdHlwZSwgaXNPcHRpb25hbClcclxuXHRpZiAodHlwZW9mIHZhbHVlID09ICd1bmRlZmluZWQnICYmIGlzT3B0aW9uYWwgPT09IHRydWUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHR5cGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT0gdHlwZVxyXG5cdH1cclxuXHJcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGUubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWUgLy8gbm8gaXRlbSB0eXBlIGNoZWNraW5nXHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgdmFsdWUpIHtcclxuXHRcdFx0dmFyIHJldCA9IGZhbHNlXHJcblx0XHRcdGZvcihsZXQgdCBvZiB0eXBlKSB7XHJcblx0XHRcdFx0cmV0IHw9IGNoZWNrVHlwZShpLCB0KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghcmV0KSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGlzT2JqZWN0KHR5cGUpKSB7XHJcblx0XHRpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgZiBpbiB0eXBlKSB7XHJcblxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdmJywgZiwgJ3ZhbHVlJywgdmFsdWUpXHJcblx0XHRcdHZhciBuZXdUeXBlID0gdHlwZVtmXVxyXG5cclxuXHRcdFx0dmFyIGlzT3B0aW9uYWwgPSBmYWxzZVxyXG5cdFx0XHRpZiAoZi5zdGFydHNXaXRoKCckJykpIHtcclxuXHRcdFx0XHRmID0gZi5zdWJzdHIoMSlcclxuXHRcdFx0XHRpc09wdGlvbmFsID0gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghY2hlY2tUeXBlKHZhbHVlW2ZdLCBuZXdUeXBlLCBpc09wdGlvbmFsKSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cdHJldHVybiBmYWxzZVxyXG59XHRcclxuXHJcblxyXG5cclxuJCQudXRpbCA9IHtcclxuXHRyZWFkVGV4dEZpbGUsXHJcblx0cmVhZEZpbGVBc0RhdGFVUkwsXHJcblx0b3BlbkZpbGVEaWFsb2csXHJcblx0aXNJbWFnZSxcclxuXHRkYXRhVVJMdG9CbG9iLFxyXG5cdGxvYWRTdHlsZSxcclxuXHRjaGVja1R5cGVcclxufVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuY2xhc3MgVmlld0NvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBvcHRpb25zKSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1ZpZXdDb250cm9sbGVyJywgb3B0aW9ucylcclxuICAgIFx0aWYgKHR5cGVvZiBlbHQgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRlbHQgPSAkKGVsdClcclxuICAgIFx0fVxyXG5cclxuICAgICAgICBpZiAoZWx0Lmhhc0NsYXNzKCdDdXN0b21Db250cm9sJykpIHtcclxuICAgICAgICAgICAgZWx0ID0gZWx0LmNoaWxkcmVuKClcclxuICAgICAgICB9XHJcblxyXG4gICAgXHRvcHRpb25zID0gJC5leHRlbmQoe30sIG9wdGlvbnMpXHJcbiAgICAgICAgdGhpcy5lbHQgPSBlbHRcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLm1vZGVsID0gJC5leHRlbmQoe30sIG9wdGlvbnMuZGF0YSlcclxuICAgICAgICB0aGlzLnJ1bGVzID0gJC5leHRlbmQoe30sIG9wdGlvbnMucnVsZXMpXHJcbiAgICAgICAgdGhpcy53YXRjaGVzID0gJC5leHRlbmQoe30sIG9wdGlvbnMud2F0Y2hlcylcclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgYXV0b21hdGljIHJ1bGVzIGZvciBjb21wdXRlZCBkYXRhIChha2EgZnVuY3Rpb24pXHJcbiAgICAgICAgZm9yKHZhciBrIGluIHRoaXMubW9kZWwpIHtcclxuICAgICAgICBcdHZhciBkYXRhID0gdGhpcy5tb2RlbFtrXVxyXG4gICAgICAgIFx0aWYgKHR5cGVvZiBkYXRhID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBcdFx0dmFyIGZ1bmNUZXh0ID0gZGF0YS50b1N0cmluZygpXHJcbiAgICAgICAgXHRcdC8vY29uc29sZS5sb2coJ2Z1bmNUZXh0JywgZnVuY1RleHQpXHJcbiAgICAgICAgXHRcdHZhciBydWxlcyA9IFtdXHJcbiAgICAgICAgXHRcdGZ1bmNUZXh0LnJlcGxhY2UoL3RoaXMuKFthLXpBLVowLTlfLV17MSx9KS9nLCBmdW5jdGlvbihtYXRjaCwgY2FwdHVyZU9uZSkge1xyXG4gICAgICAgIFx0XHRcdC8vY29uc29sZS5sb2coJ2NhcHR1cmVPbmUnLCBjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHRcdHJ1bGVzLnB1c2goY2FwdHVyZU9uZSlcclxuICAgICAgICBcdFx0fSlcclxuICAgICAgICBcdFx0dGhpcy5ydWxlc1trXSA9IHJ1bGVzLnRvU3RyaW5nKClcclxuICAgICAgICBcdH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3J1bGVzJywgdGhpcy5ydWxlcylcclxuICAgICAgICB0aGlzLmN0eCA9ICQkLmJpbmRpbmcucHJvY2VzcyhlbHQsIHRoaXMubW9kZWwsICQkLmNvbnRyb2wuY3JlYXRlQ29udHJvbCwgXHJcbiAgICAgICAgICAgIChuYW1lLCB2YWx1ZSwgZXhjbHVkZUVsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSB1cGRhdGVDYmsnLCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YShuYW1lLCB2YWx1ZSwgZXhjbHVkZUVsdCkgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZXZlbnRzID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICQkLmJpbmRpbmcucHJvY2Vzc0V2ZW50cyhlbHQsIG9wdGlvbnMuZXZlbnRzKVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2NvcGUgPSAkJC5iaW5kaW5nLnByb2Nlc3NCaW5kaW5ncyhlbHQpXHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3Njb3BlJywgdGhpcy5zY29wZSlcclxuICAgICAgIFxyXG5cclxuICAgIH0gXHJcblxyXG4gICAgc2V0RGF0YShhcmcxLCBhcmcyLCBleGNsdWRlRWx0KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBzZXREYXRhJywgYXJnMSwgYXJnMiwgZXhjbHVkZUVsdClcclxuICAgICAgICB2YXIgZGF0YSA9IGFyZzFcclxuICAgICAgICBpZiAodHlwZW9mIGFyZzEgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBcdGRhdGEgPSB7fVxyXG4gICAgICAgIFx0ZGF0YVthcmcxXSA9IGFyZzJcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBzZXREYXRhJywgZGF0YSlcclxuICAgICAgICAkLmV4dGVuZCh0aGlzLm1vZGVsLCBkYXRhKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ21vZGVsJywgdGhpcy5tb2RlbClcclxuICAgICAgICB0aGlzLnVwZGF0ZShPYmplY3Qua2V5cyhkYXRhKSwgZXhjbHVkZUVsdClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZmllbGRzTmFtZSwgZXhjbHVkZUVsdCkge1xyXG4gICAgXHQvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHVwZGF0ZScsIGZpZWxkc05hbWUsIGV4Y2x1ZGVFbHQpXHJcbiAgICBcdGlmICh0eXBlb2YgZmllbGRzTmFtZSA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGZpZWxkc05hbWUgPSBmaWVsZHNOYW1lLnNwbGl0KCcsJylcclxuICAgIFx0fVxyXG5cclxuXHJcbiAgICBcdGlmIChBcnJheS5pc0FycmF5KGZpZWxkc05hbWUpKSB7XHJcbiAgICBcdFx0dmFyIGZpZWxkc1NldCA9IHt9XHJcbiAgICBcdFx0ZmllbGRzTmFtZS5mb3JFYWNoKChmaWVsZCkgPT4ge1xyXG5cclxuICAgIFx0XHRcdHZhciB3YXRjaCA9IHRoaXMud2F0Y2hlc1tmaWVsZF1cclxuICAgIFx0XHRcdGlmICh0eXBlb2Ygd2F0Y2ggPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgXHRcdFx0XHR3YXRjaC5jYWxsKG51bGwsIHRoaXMubW9kZWxbZmllbGRdKVxyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdFx0ZmllbGRzU2V0W2ZpZWxkXSA9IDFcclxuXHJcbiAgICBcdFx0XHRmb3IodmFyIHJ1bGUgaW4gdGhpcy5ydWxlcykge1xyXG4gICAgXHRcdFx0XHRpZiAodGhpcy5ydWxlc1tydWxlXS5zcGxpdCgnLCcpLmluZGV4T2YoZmllbGQpICE9IC0xKSB7XHJcbiAgICBcdFx0XHRcdFx0ZmllbGRzU2V0W3J1bGVdID0gMVxyXG4gICAgXHRcdFx0XHR9XHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0fSlcclxuXHJcblxyXG4gICAgXHRcdCQkLmJpbmRpbmcudXBkYXRlKHRoaXMuY3R4LCB0aGlzLm1vZGVsLCBPYmplY3Qua2V5cyhmaWVsZHNTZXQpLCBleGNsdWRlRWx0KVxyXG4gICAgXHR9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4kJC52aWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKGVsdCwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBWaWV3Q29udHJvbGxlcihlbHQsIG9wdGlvbnMpXHJcbn1cclxuXHJcbiQkLmlzVmlld0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvKSB7XHJcbiAgICByZXR1cm4gbyBpbnN0YW5jZW9mIFZpZXdDb250cm9sbGVyXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIlxuJCQuc2VydmljZS5yZWdpc3RlclNlcnZpY2UoJ2JyYWluanMuaHR0cCcsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdGdldCh1cmwpIHtcblx0XHRcdHJldHVybiAkLmdldEpTT04odXJsKVxuXHRcdH0sXG5cblxuXHRcdHBvc3QodXJsLCBkYXRhKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0XHRcdH0pXG5cdFx0fSxcblxuXHRcdHB1dCh1cmwsIGRhdGEpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdQVVQnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpXG5cdFx0XHR9KVxuXHRcdH0sXHRcdFx0XG5cblx0XHRkZWxldGUodXJsKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0fSlcdFx0XHRcdFxuXHRcdH0sXG5cblx0XHRwb3N0Rm9ybURhdGEodXJsLCBmZCkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHQgIHVybDogdXJsLFxuXHRcdFx0ICB0eXBlOiBcIlBPU1RcIixcblx0XHRcdCAgZGF0YTogZmQsXG5cdFx0XHQgIHByb2Nlc3NEYXRhOiBmYWxzZSwgIC8vIGluZGlxdWUgw6AgalF1ZXJ5IGRlIG5lIHBhcyB0cmFpdGVyIGxlcyBkb25uw6llc1xuXHRcdFx0ICBjb250ZW50VHlwZTogZmFsc2UgICAvLyBpbmRpcXVlIMOgIGpRdWVyeSBkZSBuZSBwYXMgY29uZmlndXJlciBsZSBjb250ZW50VHlwZVxuXHRcdFx0fSlcdFx0XHRcdFxuXHRcdH1cblxuXHRcdFxuXHR9XG59KTtcblxuXG5cblxuXG5cbiJdfQ==
