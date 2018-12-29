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

		let _stream = null
		
		this.start = function() {

			navigator.getUserMedia({video: true}, function(stream) {
				console.log('stream')
				_stream = stream

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

		function stop() {
			if (_stream) {
				_stream.getTracks().forEach(function(track) {
		            track.stop();
		        })	
		        _stream = null			
			}

		}

		this.stop = stop

		this.dispose = function() {
			stop()
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
  root.bnFindAttr('bn-event', function(elt, attrValue) {
      
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
    

    root.bnFindAttr(dir, function(elt, attrValue) {

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

  root.bnFindAttr('bn-bind', function(elt, attrValue) {
    data[attrValue] = elt
  })

  root.bnFindAttr('bn-iface', function(elt, attrValue) {
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
			console.log(`[Core] instance control '${controlName}'`)
			init.apply(iface, args)
			
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

$.fn.bnFindAttr= function(attrName, cbk) {
    this.bnFind(`[${attrName}]`).each(function() {
      const elt = $(this)
      const value = elt.attr(attrName)
      elt.removeAttr(attrName)
      cbk(elt, value)
    })
    return this
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







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2FtZXJhLmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2RhdGVwaWNrZXIuanMiLCJjb250cm9scy9pbnB1dGdyb3VwLmpzIiwiY29udHJvbHMvbmF2YmFyLmpzIiwiY29udHJvbHMvcmFkaW9ncm91cC5qcyIsImNvbnRyb2xzL3JvdXRlci5qcyIsImNvbnRyb2xzL3RhYnMuanMiLCJsaWIvYmluZGluZy5qcyIsImxpYi9jb250cm9sLmpzIiwibGliL2RpYWxvZ0NvbnRyb2xsZXIgLmpzIiwibGliL2Zvcm1EaWFsb2dDb250cm9sbGVyLmpzIiwibGliL2pxdWVyeS1leHQuanMiLCJsaWIvc2VydmljZS5qcyIsImxpYi91aS5qcyIsImxpYi91dGlsLmpzIiwibGliL3ZpZXdDb250cm9sbGVyLmpzIiwic2VydmljZXMvaHR0cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnJhaW5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG5cclxuXHR3aW5kb3cuJCQgPSB7fVxyXG5cdFxyXG59KSgpOyIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmNhbWVyYScsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCB2aWRlbyA9ICQoJzx2aWRlbz4nKVxuXHRcdC5vbignY2FucGxheScsIGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnb25DYW5QbGF5Jylcblx0XHRcdGNhbnZhcy53aWR0aCA9IHRoaXMudmlkZW9XaWR0aFxuXHRcdFx0Y2FudmFzLmhlaWdodCA9IHRoaXMudmlkZW9IZWlnaHRcblx0XHR9KVxuXHRcdC5hcHBlbmRUbyhlbHQpXG5cdFx0LmdldCgwKVxuXG5cdFx0Y29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcblx0XHRjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG5cdFx0bGV0IF9zdHJlYW0gPSBudWxsXG5cdFx0XG5cdFx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHt2aWRlbzogdHJ1ZX0sIGZ1bmN0aW9uKHN0cmVhbSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc3RyZWFtJylcblx0XHRcdFx0X3N0cmVhbSA9IHN0cmVhbVxuXG5cdFx0XHRcdHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSlcblx0XHRcdFx0dmlkZW8uc3JjID0gdXJsXG5cdFx0XHRcdHZpZGVvLnBsYXkoKVxuXG5cdFx0XHR9LFxuXHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybignW0NhbWVyYV0gZXJyb3InLCBlcnIpXG5cdFx0XHR9KVx0XHRcdFxuXHRcdH1cdFx0XG5cblx0XHR0aGlzLnRha2VQaWN0dXJlID0gZnVuY3Rpb24oKSB7XG5cdFx0ICAgIGN0eC5kcmF3SW1hZ2UodmlkZW8sIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cdFx0ICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcblx0XHR9XHRcblxuXHRcdGZ1bmN0aW9uIHN0b3AoKSB7XG5cdFx0XHRpZiAoX3N0cmVhbSkge1xuXHRcdFx0XHRfc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcblx0XHQgICAgICAgICAgICB0cmFjay5zdG9wKCk7XG5cdFx0ICAgICAgICB9KVx0XG5cdFx0ICAgICAgICBfc3RyZWFtID0gbnVsbFx0XHRcdFxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0dGhpcy5zdG9wID0gc3RvcFxuXG5cdFx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRzdG9wKClcblx0XHR9XHRcblx0fSBcblxuXG5cbn0pO1xuXG5cblxuXG5cblxuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuY2hlY2tncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRlbHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9Y2hlY2tib3hdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbHQudHJpZ2dlcignaW5wdXQnKVxuXHRcdH0pXG5cblx0XHR0aGlzLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmV0ID0gW11cblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPWNoZWNrYm94XTpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0LnB1c2goJCh0aGlzKS52YWwoKSlcblx0XHRcdH0pXHRcblx0XHRcdHJldHVybiByZXRcdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdmFsdWUuaW5kZXhPZigkKHRoaXMpLnZhbCgpKSA+PSAwKVxuXHRcdFx0XHR9KVxuXHRcdFx0fVx0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlKGVsdC52YWwoKSlcblxuXHR9XG5cbn0pO1xuXG5cblxuXG5cblxuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuZGF0ZXBpY2tlcicsIHtcblx0cHJvcHM6IHtcblx0XHRzaG93QnV0dG9uUGFuZWw6IHRydWVcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGxldCBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMucHJvcHMpXG5cblx0XHRvcHRpb25zLm9uU2VsZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnW2RhdGVwaWNrZXJdIG9uU2VsZWN0Jylcblx0XHRcdGVsdC50cmlnZ2VyKCdkYXRlcGlja2VyY2hhbmdlJylcblx0XHR9XG5cblx0XHRlbHQuZGF0ZXBpY2tlcihvcHRpb25zKVxuXG5cdFx0dmFyIHZhbHVlID0gZWx0LnZhbCgpXG5cdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuXHRcdFx0dmFyIG1zID0gRGF0ZS5wYXJzZSh2YWx1ZSlcblx0XHRcdC8vY29uc29sZS5sb2coJ1tEYXRlUGlja2VyQ29udHJvbF0gbXMnLCBtcylcblx0XHRcdHZhciBkYXRlID0gbmV3IERhdGUobXMpXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdbRGF0ZVBpY2tlckNvbnRyb2xdIGRhdGUnLCBkYXRlKVxuXHRcdFx0ZWx0LmRhdGVwaWNrZXIoJ3NldERhdGUnLCBkYXRlKVxuXHRcdH1cblx0XHRcdFxuXHRcdHRoaXMuc2V0VmFsdWUgPSBmdW5jdGlvbihkYXRlKSB7XG5cdFx0XHRlbHQuZGF0ZXBpY2tlcignc2V0RGF0ZScsIGRhdGUpXG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vY29uc29sZS5sb2coJ2dldFZhbHVlJylcblx0XHRcdHJldHVybiBlbHQuZGF0ZXBpY2tlcignZ2V0RGF0ZScpXG5cdFx0fVxuXHR9XG5cbn0pO1xuXG4iLCJcbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmlucHV0Z3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dmFyIGlkID0gZWx0LmNoaWxkcmVuKCdpbnB1dCcpLnVuaXF1ZUlkKCkuYXR0cignaWQnKVxuXHRcdGVsdC5jaGlsZHJlbignbGFiZWwnKS5hdHRyKCdmb3InLCBpZClcblx0fVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5uYXZiYXInLCB7XG5cdHByb3BzOiB7XG5cdFx0YWN0aXZlQ29sb3I6ICd3My1ncmVlbicsXG5cdFx0dHlwZTogJ2hvcml6b250YWwnXG5cdH0sXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3Qge2FjdGl2ZUNvbG9yLCB0eXBlfSA9IHRoaXMucHJvcHNcblxuXHRcdGVsdC5hZGRDbGFzcygodHlwZSA9PSAndmVydGljYWwnKSA/ICd3My1iYXItYmxvY2snOiAndzMtYmFyJylcblx0XHRlbHQuY2hpbGRyZW4oJ2EnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygndzMtYmFyLWl0ZW0gdzMtYnV0dG9uJylcblx0XHR9KVxuXG5cdFx0Y29uc3QgbmV3Um91dGUgPSAkJC5nZXROZXdSb3V0ZSgpXG5cdFx0ZWx0LmNoaWxkcmVuKGBhW2hyZWY9XCIjJHtuZXdSb3V0ZX1cIl1gKS5hZGRDbGFzcyhhY3RpdmVDb2xvcilcblxuXHRcdCQod2luZG93KS5vbigncG9wc3RhdGUnLCBmdW5jdGlvbihldnQpIHtcblx0XHRcdC8vY29uc29sZS5sb2coJ1tOYXZiYXJDb250cm9sXSByb3V0ZUNoYW5nZScsIG5ld1JvdXRlKVxuXHRcdFx0Y29uc3QgbmV3Um91dGUgPSAkJC5nZXROZXdSb3V0ZSgpXG5cblx0XHRcdGVsdC5jaGlsZHJlbihgYS4ke2FjdGl2ZUNvbG9yfWApLnJlbW92ZUNsYXNzKGFjdGl2ZUNvbG9yKVx0XG5cdFx0XHRlbHQuY2hpbGRyZW4oYGFbaHJlZj1cIiMke25ld1JvdXRlfVwiXWApLmFkZENsYXNzKGFjdGl2ZUNvbG9yKVxuXG5cdFx0fSlcdFxuXG5cdH1cblxufSk7XG5cblxuXG5cblxuXG4iLCJcbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnJhZGlvZ3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0ZWx0Lm9uKCdjbGljaycsICdpbnB1dFt0eXBlPXJhZGlvXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygncmFkaW9ncm91cCBjbGljaycpXG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb106Y2hlY2tlZCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcblx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHRydWUpXG5cdFx0XHRlbHQudHJpZ2dlcignaW5wdXQnKVxuXHRcdH0pXG5cdFx0XG5cblx0XHR0aGlzLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZWx0LmZpbmQoJ2lucHV0W3R5cGU9cmFkaW9dOmNoZWNrZWQnKS52YWwoKVxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9cmFkaW9dJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdmFsdWUgPT09ICQodGhpcykudmFsKCkpXG5cdFx0XHR9KVx0XHRcdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUoZWx0LnZhbCgpKVxuXHR9XG59KTtcblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBtYXRjaFJvdXRlKHJvdXRlLCBwYXR0ZXJuKSB7XG5cdFx0Ly9jb25zb2xlLmxvZygnbWF0Y2hSb3V0ZScsIHJvdXRlLCBwYXR0ZXJuKVxuXHRcdHZhciByb3V0ZVNwbGl0ID0gcm91dGUuc3BsaXQoJy8nKVxuXHRcdHZhciBwYXR0ZXJuU3BsaXQgPSBwYXR0ZXJuLnNwbGl0KCcvJylcblx0XHQvL2NvbnNvbGUubG9nKHJvdXRlU3BsaXQsIHBhdHRlcm5TcGxpdClcblx0XHR2YXIgcmV0ID0ge31cblxuXHRcdGlmIChyb3V0ZVNwbGl0Lmxlbmd0aCAhPSBwYXR0ZXJuU3BsaXQubGVuZ3RoKVxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGZvcih2YXIgaWR4ID0gMDsgaWR4IDwgcGF0dGVyblNwbGl0Lmxlbmd0aDsgaWR4KyspIHtcblx0XHRcdHZhciBwYXRoID0gcGF0dGVyblNwbGl0W2lkeF1cblx0XHRcdC8vY29uc29sZS5sb2coJ3BhdGgnLCBwYXRoKVxuXHRcdFx0aWYgKHBhdGguc3Vic3RyKDAsIDEpID09PSAnOicpIHtcblx0XHRcdFx0aWYgKHJvdXRlU3BsaXRbaWR4XS5sZW5ndGggPT09IDApXG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0cmV0W3BhdGguc3Vic3RyKDEpXSA9IHJvdXRlU3BsaXRbaWR4XVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocGF0aCAhPT0gcm91dGVTcGxpdFtpZHhdKSB7XG5cdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldE5ld1JvdXRlKCkge1xuXHRcdGNvbnN0IGhyZWYgPSBsb2NhdGlvbi5ocmVmXG5cdFx0Y29uc3QgaWR4ID0gaHJlZi5pbmRleE9mKCcjJylcblx0XHRjb25zdCBuZXdSb3V0ZSA9IChpZHggIT09IC0xKSAgPyBocmVmLnN1YnN0cihpZHgrMSkgOiAnLydcblx0XHRcblx0XHRyZXR1cm4gbmV3Um91dGVcblx0fVxuXG5cdCQkLmdldE5ld1JvdXRlID0gZ2V0TmV3Um91dGVcblxuXHQkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5yb3V0ZXInLCB7XG5cblx0XHRwcm9wczoge1xuXHRcdFx0cm91dGVzOiBbXVxuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnW3JvdXRlcl0gcG9wc3RhdGUnKVxuXHRcdFx0XHRwcm9jZXNzUm91dGUoZ2V0TmV3Um91dGUoKSlcblx0XHRcdH0pXG5cblxuXHRcdFx0dmFyIHJvdXRlcyA9IHRoaXMucHJvcHMucm91dGVzXG5cblx0XHRcdGlmICghQXJyYXkuaXNBcnJheShyb3V0ZXMpKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybignW3JvdXRlcl0gYmFkIHJvdXRlcycpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXG5cdFx0XHRwcm9jZXNzUm91dGUoZ2V0TmV3Um91dGUoKSlcblxuXHRcdFx0ZnVuY3Rpb24gcHJvY2Vzc1JvdXRlKG5ld1JvdXRlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSBwcm9jZXNzUm91dGUnLCBuZXdSb3V0ZSwgcm91dGVzKVxuXG5cdFx0XHRcdGZvcih2YXIgcm91dGUgb2Ygcm91dGVzKSB7XG5cdFx0XHRcdFx0dmFyIHBhcmFtcyA9IG1hdGNoUm91dGUobmV3Um91dGUsIHJvdXRlLmhyZWYpXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgcm91dGU6ICR7cm91dGUuaHJlZn0sIHBhcmFtc2AsIHBhcmFtcylcblx0XHRcdFx0XHRpZiAocGFyYW1zICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1tSb3V0ZXJDb250cm9sXSBwYXJhbXMnLCBwYXJhbXMpXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHJvdXRlLnJlZGlyZWN0ID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSByZWRpcmVjdCB0byAnLCByb3V0ZS5yZWRpcmVjdClcblx0XHRcdFx0XHRcdFx0bG9jYXRpb24uaHJlZiA9ICcjJyArIHJvdXRlLnJlZGlyZWN0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiByb3V0ZS5jb250cm9sID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdGVsdC5zYWZlRW1wdHkoKS5hZGRDb250cm9sKHJvdXRlLmNvbnRyb2wpXHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdFx0fVx0XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS53YXJuKCdbcm91dGVyXSBObyByb3V0ZSBmb3VuZCAhJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcdH1cdFx0XG5cblxuXHRcdH1cblxuXHR9KVxuXG59KSgpO1xuXG5cbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnRhYnMnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dmFyIHVsID0gJCgnPHVsPicpLnByZXBlbmRUbyhlbHQpXG5cblx0XHRlbHQuY2hpbGRyZW4oJ2RpdicpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGl0bGUgPSAkKHRoaXMpLmF0dHIoJ3RpdGxlJylcblx0XHRcdHZhciBpZCA9ICQodGhpcykudW5pcXVlSWQoKS5hdHRyKCdpZCcpXG5cdFx0XHR2YXIgbGkgPSAkKCc8bGk+Jylcblx0XHRcdFx0LmF0dHIoJ3RpdGxlJywgdGl0bGUpXG5cdFx0XHRcdC5hcHBlbmQoJCgnPGE+Jywge2hyZWY6ICcjJyArIGlkfSkudGV4dCh0aXRsZSkpXG5cdFx0XHRcdC5hcHBlbmRUbyh1bClcblx0XHRcdGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtcmVtb3ZhYmxlJykgIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGxpLmFwcGVuZCgkKCc8c3Bhbj4nLCB7Y2xhc3M6ICd1aS1pY29uIHVpLWljb24tY2xvc2UnfSkpXG5cdFx0XHR9XG5cdFx0fSlcdFx0XG5cblx0XHRlbHQudGFicygpXG5cdFx0Lm9uKCdjbGljaycsICdzcGFuLnVpLWljb24tY2xvc2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwYW5lbElkID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpLnJlbW92ZSgpLmF0dHIoJ2FyaWEtY29udHJvbHMnKVxuXHRcdFx0Ly9jb25zb2xlLmxvZygncGFuZWxJZCcsIHBhbmVsSWQpXG5cdFx0XHQkKCcjJyArIHBhbmVsSWQpLnNhZmVFbXB0eSgpLnJlbW92ZSgpXG5cdFx0XHRlbHQudGFicygncmVmcmVzaCcpXG5cdFx0fSlcblxuXG5cdFx0ZnVuY3Rpb24gZ2V0VGFic0NvdW50KCkge1xuXHRcdFx0cmV0dXJuIHVsLmNoaWxkcmVuKGBsaWApLmxlbmd0aFxuXHRcdH1cblxuXHRcdHRoaXMuZ2V0VGFic0NvdW50ID0gZ2V0VGFic0NvdW50XG5cblx0XHR0aGlzLmFkZFRhYiA9IGZ1bmN0aW9uKHRpdGxlLCBvcHRpb25zKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdhZGRUYWInLCB0aXRsZSlcblx0XHRcdHZhciBpZHggPSBnZXRUYWJzQ291bnQoKVxuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblx0XHRcdHZhciB0YWIgPSAkKCc8ZGl2PicpXG5cdFx0XHRcdC5hdHRyKCd0aXRsZScsIHRpdGxlKVxuXHRcdFx0XHQuYXBwZW5kVG8oZWx0KVxuXG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuY29udHJvbCA9PSAnc3RyaW5nJylcdHtcblx0XHRcdFx0dGFiLmFkZENvbnRyb2wob3B0aW9ucy5jb250cm9sKVxuXHRcdFx0fVx0XG5cblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRhYi5hcHBlbmQob3B0aW9ucy50ZW1wbGF0ZSlcblx0XHRcdH1cblxuXHRcdFx0dmFyIGlkID0gdGFiLnVuaXF1ZUlkKCkuYXR0cignaWQnKVxuXHRcdFx0dmFyIGxpID0gJCgnPGxpPicpXG5cdFx0XHRcdC5hdHRyKCd0aXRsZScsIHRpdGxlKVxuXHRcdFx0XHQuYXBwZW5kKCQoJzxhPicsIHtocmVmOiAnIycgKyBpZH0pLnRleHQodGl0bGUpKVxuXHRcdFx0XHQuYXBwZW5kVG8odWwpXG5cdFx0XHRpZiAob3B0aW9ucy5yZW1vdmFibGUgPT09IHRydWUpIHtcblx0XHRcdFx0bGkuYXBwZW5kKCQoJzxzcGFuPicsIHtjbGFzczogJ3VpLWljb24gdWktaWNvbi1jbG9zZSd9KSlcblx0XHRcdH1cdFx0XHRcblxuXHRcdFx0ZWx0LnRhYnMoJ3JlZnJlc2gnKVxuXHRcdFx0cmV0dXJuIGlkeFxuXHRcdH1cblxuXHRcdHRoaXMuZ2V0U2VsZWN0ZWRUYWJJbmRleCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGluZGV4ID0gdWwuY2hpbGRyZW4oJ2xpLnVpLXN0YXRlLWFjdGl2ZScpLmluZGV4KClcblx0XHRcdHJldHVybiBpbmRleFxuXHRcdH1cblxuXHRcdHRoaXMuZ2V0VGFiSW5mbyA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRjb25zdCB0aXRsZSA9IHVsLmNoaWxkcmVuKCdsaScpLmVxKGluZGV4KS5hdHRyKCd0aXRsZScpXG5cdFx0XHRyZXR1cm4ge3RpdGxlfVxuXHRcdH1cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFZhclZhbHVlKGRhdGEsIHZhck5hbWUpIHtcclxuICAgIHZhciByZXQgPSBkYXRhXHJcbiAgICBmb3IobGV0IGYgb2YgdmFyTmFtZS5zcGxpdCgnLicpKSB7XHJcbiAgICAgIFxyXG4gICAgICBpZiAodHlwZW9mIHJldCA9PSAnb2JqZWN0JyAmJiBmIGluIHJldCkge1xyXG4gICAgICAgIHJldCA9IHJldFtmXVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH1cclxuICAgIHJldHVybiByZXRcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSkge1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ1tDb3JlXSBnZXRWYWx1ZScsIHZhck5hbWUsIGN0eClcclxuXHJcbiAgICAvLyB2YXIgbm90ID0gZmFsc2VcclxuICAgIC8vIGlmICh2YXJOYW1lLnN0YXJ0c1dpdGgoJyEnKSkge1xyXG4gICAgLy8gICB2YXJOYW1lID0gdmFyTmFtZS5zdWJzdHIoMSlcclxuICAgIC8vICAgbm90ID0gdHJ1ZVxyXG4gICAgLy8gfSAgICAgXHJcblxyXG4gICAgdmFyIGZ1bmMgPSBkYXRhW3Zhck5hbWVdXHJcbiAgICB2YXIgdmFsdWVcclxuXHJcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB2YWx1ZSA9IGZ1bmMuY2FsbChkYXRhKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhbHVlID0gZ2V0VmFyVmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gaWYgKHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicgJiYgbm90KSB7XHJcbiAgICAvLyAgIHZhbHVlID0gIXZhbHVlXHJcbiAgICAvLyB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzcGxpdEF0dHIoYXR0clZhbHVlLCBjYmspIHtcclxuICBhdHRyVmFsdWUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgIGxldCBbbmFtZSwgdmFsdWVdID0gaS5zcGxpdCgnOicpXHJcbiAgICBjYmsobmFtZS50cmltKCksIHZhbHVlLnRyaW0oKSlcclxuICB9KVxyXG59XHJcblxyXG5cclxuY29uc3QgbWFwID0ge1xyXG4gICdibi1lYWNoJzoge3R5cGU6IDN9LFxyXG4gICdibi10ZXh0Jzoge2Y6ICd0ZXh0JywgdHlwZTogMX0sXHJcbiAgJ2JuLWh0bWwnOiB7ZjogJ2h0bWwnLCB0eXBlOiAxfSxcclxuICAnYm4tdmFsJzoge2Y6ICdzZXRWYWx1ZScsIHR5cGU6IDF9LFxyXG4gICdibi1zaG93Jzoge2Y6ICdzZXRWaXNpYmxlJywgdHlwZTogMX0sXHJcbiAgJ2JuLXN0eWxlJzoge2Y6ICdjc3MnLCB0eXBlOiAyfSxcclxuICAnYm4tYXR0cic6IHtmOiAnYXR0cicsIHR5cGU6IDJ9LFxyXG4gICdibi1wcm9wJzoge2Y6ICdwcm9wJywgdHlwZTogMn0sXHJcbiAgJ2JuLWRhdGEnOiB7ZjogJ3NldERhdGEnLCB0eXBlOiAyfSxcclxuICAnYm4tY2xhc3MnOiB7ZjogJ3NldENsYXNzJywgdHlwZTogMn0sXHJcbiAgJ2JuLWNvbnRyb2wnOiB7dHlwZTogNH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZShjdHgsIGRhdGEsIHZhcnMsIGV4Y2x1ZGVFbHQpIHtcclxuXHJcbiAgLy9jb25zb2xlLmxvZygnW2JpbmRpbmddIHVwZGF0ZScsIHZhcnMsIGRhdGEsIGV4Y2x1ZGVFbHQpXHJcblxyXG4gIGlmICh0eXBlb2YgdmFycyA9PSAnc3RyaW5nJykge1xyXG4gICAgdmFycyA9IHZhcnMuc3BsaXQoJywnKVxyXG4gIH1cclxuXHJcbiAgdmFycy5mb3JFYWNoKGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJpYWJsZSlcclxuICAgIFxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgIXZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICB1cGRhdGUoY3R4LCBkYXRhLCBPYmplY3Qua2V5cyh2YWx1ZSkubWFwKGkgPT4gdmFyaWFibGUgKyAnLicgKyBpKSwgZXhjbHVkZUVsdClcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChjdHhbdmFyaWFibGVdKSB7XHJcbiAgICAgIGN0eFt2YXJpYWJsZV0uZm9yRWFjaChmdW5jdGlvbihhY3Rpb24pIHtcclxuICAgICAgICBsZXQge3R5cGUsIGYsIGVsdCwgbmFtZSwgdGVtcGxhdGUsIGl0ZXIsIG5vdH0gPSBhY3Rpb25cclxuICAgICAgICBpZiAoZWx0ID09IGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdmFsdWVcclxuXHJcbiAgICAgICAgaWYgKG5vdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSAhbmV3VmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRlJywgdmFyaWFibGUsIGYsIG5ld1ZhbHVlKVxyXG4gICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmV3VmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09IDIpIHtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZScsIHZhcmlhYmxlLCBmLCBuYW1lLCBuZXdWYWx1ZSlcclxuICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIG5hbWUsIG5ld1ZhbHVlKVxyXG4gICAgICAgIH0gICBcclxuICAgICAgICBpZiAodHlwZSA9PSAzICYmIEFycmF5LmlzQXJyYXkobmV3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGVsdC5lbXB0eSgpXHJcbiAgICAgICAgICAgIG5ld1ZhbHVlLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSlcclxuICAgICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzRXZlbnRzKHJvb3QsIGV2ZW50cykge1xyXG4gIHJvb3QuYm5GaW5kQXR0cignYm4tZXZlbnQnLCBmdW5jdGlvbihlbHQsIGF0dHJWYWx1ZSkge1xyXG4gICAgICBcclxuICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24oZXZ0TmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBsZXQgZm4gID0gZXZlbnRzW3ZhbHVlXVxyXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykgeyAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBbbmFtZSwgc2VsZWN0b3JdID0gZXZ0TmFtZS5zcGxpdCgnLicpXHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdG9yICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgJy4nICsgc2VsZWN0b3IsIGZuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsdC5vbihuYW1lLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgIFxyXG4gICAgfSlcclxuICAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzcyhyb290LCBkYXRhLCBjcmVhdGVDb250cm9sLCB1cGRhdGVDYmspIHtcclxuXHJcbiAgXHJcbiAgaWYgKHJvb3QubGVuZ3RoID4gMSkge1xyXG4gICAgY29uc29sZS5lcnJvcignW2JpbmRpbmddIHByb2Nlc3MnLCByb290Lmxlbmd0aCwgZGF0YSlcclxuICB9XHJcblxyXG4gIGxldCBjdHggPSB7fVxyXG4gIFxyXG4gIGZvcihsZXQgZGlyIGluIG1hcCkge1xyXG4gICAgXHJcblxyXG4gICAgcm9vdC5ibkZpbmRBdHRyKGRpciwgZnVuY3Rpb24oZWx0LCBhdHRyVmFsdWUpIHtcclxuXHJcbiAgICAgIGxldCB7dHlwZSwgZn0gPSBtYXBbZGlyXVxyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgIGxldCBub3QgPSBmYWxzZVxyXG4gICAgICAgIGlmIChhdHRyVmFsdWUuc3RhcnRzV2l0aCgnIScpKSB7XHJcbiAgICAgICAgICBhdHRyVmFsdWUgPSBhdHRyVmFsdWUuc3Vic3RyKDEpXHJcbiAgICAgICAgICBub3QgPSB0cnVlXHJcbiAgICAgICAgfSBcclxuXHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIGF0dHJWYWx1ZSlcclxuICAgICAgICAgIGlmIChub3QgJiYgdHlwZW9mIHZhbHVlID09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICF2YWx1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9lbHQudGV4dChkYXRhW2F0dHJWYWx1ZV0pXHJcbiAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYgKGRpciA9PSAnYm4tdmFsJykge1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZUV2dCA9IGVsdC5hdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgaWYgKHVwZGF0ZUV2dCkge1xyXG4gICAgICAgICAgICBlbHQucmVtb3ZlQXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgICAgZWx0Lm9uKHVwZGF0ZUV2dCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnW2JpbmRpbmddIHVwZGF0ZUV2dCcsIHVwZGF0ZUV2dCwgZWx0KVxyXG4gICAgICAgICAgICAgIHVwZGF0ZUNiayhhdHRyVmFsdWUsIGVsdC5nZXRWYWx1ZSgpLCBlbHQpXHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG5cclxuICAgICAgICBjdHhbYXR0clZhbHVlXSA9IGN0eFthdHRyVmFsdWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0ucHVzaCh7ZiwgZWx0LCB0eXBlLCBub3R9KSAgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDQgJiYgdHlwZW9mIGNyZWF0ZUNvbnRyb2wgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGNyZWF0ZUNvbnRyb2woYXR0clZhbHVlLCBlbHQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlID09IDIpIHtcclxuXHJcbiAgICAgICAgICBzcGxpdEF0dHIoYXR0clZhbHVlLCBmdW5jdGlvbihuYW1lLCB2YXJOYW1lKSB7XHJcbiAgICAgICAgICAgIGxldCBub3QgPSBmYWxzZVxyXG4gICAgICAgICAgICBpZiAoYXR0clZhbHVlLnN0YXJ0c1dpdGgoJyEnKSkge1xyXG4gICAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGF0dHJWYWx1ZS5zdWJzdHIoMSlcclxuICAgICAgICAgICAgICBub3QgPSB0cnVlXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICAgICAgICBpZiAobm90ICYmIHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gIXZhbHVlXHJcbiAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2YsIGVsdCwgdHlwZSwgbmFtZSwgbm90fSkgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDMpIHtcclxuICAgICAgICBsZXQgdGVtcGxhdGUgPSBlbHQuY2hpbGRyZW4oKS5yZW1vdmUoKS5jbG9uZSgpXHJcbiAgICAgICAgbGV0IFtpdGVyLCAsIHZhck5hbWVdID0gYXR0clZhbHVlLnNwbGl0KCcgJylcclxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eFt2YXJOYW1lXSA9IGN0eFt2YXJOYW1lXSB8fCBbXVxyXG4gICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtlbHQsIHR5cGUsIHRlbXBsYXRlLCBpdGVyfSkgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkYXRhICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSwgY3JlYXRlQ29udHJvbClcclxuICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgIFxyXG4gIFxyXG4gIH1cclxuICBcclxuXHJcbiAgcmV0dXJuIGN0eFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzQmluZGluZ3Mocm9vdCkge1xyXG5cclxuICB2YXIgZGF0YSA9IHt9XHJcblxyXG4gIHJvb3QuYm5GaW5kQXR0cignYm4tYmluZCcsIGZ1bmN0aW9uKGVsdCwgYXR0clZhbHVlKSB7XHJcbiAgICBkYXRhW2F0dHJWYWx1ZV0gPSBlbHRcclxuICB9KVxyXG5cclxuICByb290LmJuRmluZEF0dHIoJ2JuLWlmYWNlJywgZnVuY3Rpb24oZWx0LCBhdHRyVmFsdWUpIHtcclxuICAgIGRhdGFbYXR0clZhbHVlXSA9IGVsdC5pZmFjZSgpXHJcbiAgfSlcclxuXHJcbiAgcmV0dXJuIGRhdGFcclxuICBcclxufVxyXG5cclxuJCQuYmluZGluZyA9IHtcclxuICBwcm9jZXNzLFxyXG4gIHVwZGF0ZSxcclxuICBwcm9jZXNzRXZlbnRzLFxyXG4gIHByb2Nlc3NCaW5kaW5nc1xyXG59XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcbmxldCBjb250cm9scyA9IHt9XHJcblxyXG5mdW5jdGlvbiBpc0RlcHNPayhkZXBzKSB7XHJcblx0cmV0dXJuIGRlcHMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xyXG5cclxuXHRcdHJldHVybiBwcmV2ICYmIChjdXIgIT0gdW5kZWZpbmVkKVxyXG5cdH0sIHRydWUpXHRcdFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb250cm9sKG5hbWUsIG9wdGlvbnMpIHtcclxuXHRpZiAoISQkLnV0aWwuY2hlY2tUeXBlKG9wdGlvbnMsIHtcclxuXHRcdCRkZXBzOiBbJ3N0cmluZyddLFxyXG5cdFx0aW5pdDogJ2Z1bmN0aW9uJ1xyXG5cdH0pKSB7XHJcblx0XHRjb25zb2xlLmVycm9yKGBbQ29yZV0gcmVnaXN0ZXJDb250cm9sOiBiYWQgb3B0aW9uc2AsIG9wdGlvbnMpXHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblxyXG5cclxuXHR2YXIgZGVwcyA9IG9wdGlvbnMuZGVwcyB8fCBbXVxyXG5cclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIGNvbnRyb2wgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdGNvbnRyb2xzW25hbWVdID0ge2RlcHMsIG9wdGlvbnMsIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvbnRyb2wobmFtZSkge1xyXG5cdHZhciByZXQgPSBjb250cm9sc1tuYW1lXVxyXG5cdGlmIChyZXQgJiYgcmV0LnN0YXR1cyA9PSAnbm90bG9hZGVkJykge1xyXG5cdFx0cmV0LmRlcHMgPSAkJC5zZXJ2aWNlLmdldFNlcnZpY2VzKHJldC5kZXBzKVxyXG5cdFx0cmV0LnN0YXR1cyA9IGlzRGVwc09rKHJldC5kZXBzKSA/ICdvaycgOiAna28nXHJcblx0fVxyXG5cdHJldHVybiByZXRcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29udHJvbChjb250cm9sTmFtZSwgZWx0KSB7XHJcblx0ZWx0LmFkZENsYXNzKGNvbnRyb2xOYW1lLnJlcGxhY2UoJy4nLCAnLScpKVxyXG5cdGVsdC5hZGRDbGFzcygnQ3VzdG9tQ29udHJvbCcpLnVuaXF1ZUlkKClcdFxyXG5cdHZhciBjdHJsID0gZ2V0Q29udHJvbChjb250cm9sTmFtZSlcclxuXHRcdFxyXG5cdGlmIChjdHJsID09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhyb3coYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHRcdC8vY29uc29sZS5sb2coJ2NyZWF0ZUNvbnRyb2wnLCBjb250cm9sTmFtZSwgY3RybClcclxuXHRpZiAoY3RybC5zdGF0dXMgPT09ICAnb2snKSB7XHJcblx0XHRcclxuXHRcdHZhciBpZmFjZSA9IHtcclxuXHRcdFx0cHJvcHM6IHt9LFxyXG5cdFx0XHRuYW1lOiBjb250cm9sTmFtZVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB7aW5pdCwgcHJvcHMsIHRlbXBsYXRlfSA9IGN0cmwub3B0aW9uc1xyXG5cdFx0cHJvcHMgPSBwcm9wcyB8fCB7fVxyXG5cclxuXHRcdE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BOYW1lKSB7XHJcblx0XHRcdGlmYWNlLnByb3BzW3Byb3BOYW1lXSA9IGVsdC5kYXRhKHByb3BOYW1lKSB8fCBwcm9wc1twcm9wTmFtZV1cclxuXHRcdH0pXHJcblxyXG5cdFx0aWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHQkKHRlbXBsYXRlKS5hcHBlbmRUbyhlbHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcblx0XHRcdHRlbXBsYXRlLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhlbHQpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBpbml0ID09ICdmdW5jdGlvbicpIHtcclxuXHJcblx0XHRcdHZhciBhcmdzID0gW2VsdF0uY29uY2F0KGN0cmwuZGVwcylcclxuXHRcdFx0Y29uc29sZS5sb2coYFtDb3JlXSBpbnN0YW5jZSBjb250cm9sICcke2NvbnRyb2xOYW1lfSdgKVxyXG5cdFx0XHRpbml0LmFwcGx5KGlmYWNlLCBhcmdzKVxyXG5cdFx0XHRcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oYFtDb3JlXSBjb250cm9sICcke2NvbnRyb2xOYW1lfScgbWlzc2luZyBpbml0IGZ1bmN0aW9uYClcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZWx0LmdldCgwKS5jdHJsID0gaWZhY2VcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGlmYWNlXHRcdFx0XHRcclxuXHR9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiQkLmNvbnRyb2wgPSB7XHJcblx0cmVnaXN0ZXJDb250cm9sLFxyXG5cdGNyZWF0ZUNvbnRyb2xcclxufVxyXG5cclxufSkoKTtcclxuIiwiJCQuZGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgZGl2ID0gJCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGUgfHwgJ0RpYWxvZyd9KVxyXG5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdCQob3B0aW9ucy50ZW1wbGF0ZSkuYXBwZW5kVG8oZGl2KVxyXG5cdH1cdFxyXG5cclxuXHR2YXIgY3RybCA9ICQkLnZpZXdDb250cm9sbGVyKGRpdiwgb3B0aW9ucylcclxuXHJcblx0dmFyIGRsZ09wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRhdXRvT3BlbjogZmFsc2UsXHJcblx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdHdpZHRoOiAnYXV0bycsXHRcdFxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cdHZhciBwcml2YXRlID0ge31cclxuXHJcblx0Ly9jb25zb2xlLmxvZygnZGxnT3B0aW9ucycsIGRsZ09wdGlvbnMpXHJcblxyXG5cdGRpdi5kaWFsb2coZGxnT3B0aW9ucylcclxuXHJcblx0Y3RybC5zaG93ID0gZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0cHJpdmF0ZS5vbkFwcGx5ID0gb25BcHBseVxyXG5cdFx0ZGl2LmRpYWxvZygnb3BlbicpXHJcblx0fVxyXG5cclxuXHRjdHJsLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHR9XHJcblxyXG5cdGN0cmwuYXBwbHkgPSBmdW5jdGlvbihyZXRWYWx1ZSkge1xyXG5cdFx0Y3RybC5oaWRlKClcclxuXHRcdGlmICh0eXBlb2YgcHJpdmF0ZS5vbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0cHJpdmF0ZS5vbkFwcGx5KHJldFZhbHVlKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y3RybC5zZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb25OYW1lLCB2YWx1ZSkge1xyXG5cdFx0ZGl2LmRpYWxvZygnb3B0aW9uJywgb3B0aW9uTmFtZSwgdmFsdWUpXHJcblx0fVxyXG5cclxuXHRjdHJsLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcclxuXHRcdGRpdi5kaWFsb2coJ2Rlc3Ryb3knKVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIGN0cmxcclxufTtcclxuIiwiJCQuZm9ybURpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHR2YXIgZm9ybSA9ICQoJzxmb3JtPicpXHJcblx0XHQuYXBwZW5kVG8oZGl2KVxyXG5cdFx0Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldikge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdGRpdi5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdHByaXZhdGUub25BcHBseSgkKHRoaXMpLmdldEZvcm1EYXRhKCkpXHJcblx0XHRcdFx0JCh0aGlzKS5yZXNldEZvcm0oKVxyXG5cdFx0XHR9XHRcdFx0XHRcclxuXHRcdH0pXHJcblxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0JChvcHRpb25zLnRlbXBsYXRlKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cdFxyXG5cclxuXHRpZiAob3B0aW9ucy50ZW1wbGF0ZSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG5cdFx0b3B0aW9ucy50ZW1wbGF0ZS5jaGlsZHJlbigpLmNsb25lKCkuYXBwZW5kVG8oZm9ybSlcclxuXHR9XHJcblxyXG5cdHZhciBzdWJtaXRCdG4gPSAkKCc8aW5wdXQ+Jywge3R5cGU6ICdzdWJtaXQnLCBoaWRkZW46IHRydWV9KS5hcHBlbmRUbyhmb3JtKVxyXG5cclxuXHR2YXIgZGxnT3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuXHRcdGF1dG9PcGVuOiBmYWxzZSxcclxuXHRcdG1vZGFsOiB0cnVlLFxyXG5cdFx0d2lkdGg6ICdhdXRvJyxcdFxyXG5cdFx0YnV0dG9uczoge1xyXG5cdFx0XHQnQ2FuY2VsJzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5kaWFsb2coJ2Nsb3NlJylcclxuXHRcdFx0fSxcclxuXHRcdFx0J0FwcGx5JzogZnVuY3Rpb24oKSB7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdHN1Ym1pdEJ0bi5jbGljaygpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LCBvcHRpb25zKVxyXG5cclxuXHJcblx0ZGl2LmRpYWxvZyhkbGdPcHRpb25zKVxyXG5cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHNob3c6IGZ1bmN0aW9uKG9uQXBwbHkpIHtcclxuXHRcdFx0cHJpdmF0ZS5vbkFwcGx5ID0gb25BcHBseVx0XHRcdFxyXG5cdFx0XHRkaXYuZGlhbG9nKCdvcGVuJylcdFx0XHRcclxuXHRcdH0sXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGZvcm0uc2V0Rm9ybURhdGEoZGF0YSlcclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGRpdi5kaWFsb2coJ2Rlc3Ryb3knKVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuJC5mbi5ibkZpbmQ9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kKHNlbGVjdG9yKS5hZGQodGhpcy5maWx0ZXIoc2VsZWN0b3IpKVxyXG59XHJcblxyXG4kLmZuLmJuRmluZEF0dHI9IGZ1bmN0aW9uKGF0dHJOYW1lLCBjYmspIHtcclxuICAgIHRoaXMuYm5GaW5kKGBbJHthdHRyTmFtZX1dYCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3QgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBjb25zdCB2YWx1ZSA9IGVsdC5hdHRyKGF0dHJOYW1lKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cihhdHRyTmFtZSlcclxuICAgICAgY2JrKGVsdCwgdmFsdWUpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuJC5mbi5zZXRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaXNBY3RpdmUpIHtcclxuICAgIGlmIChpc0FjdGl2ZSkge1xyXG4gICAgICB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSlcclxuICAgIH1cclxufVxyXG5cclxuJC5mbi5zZXRWaXNpYmxlID0gZnVuY3Rpb24oaXNWaXNpYmxlKSB7XHJcbiAgICBpZiAoaXNWaXNpYmxlKSB7XHJcbiAgICAgIHRoaXMuc2hvdygpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlKClcclxuICAgIH1cclxufVxyXG5cclxuJC5mbi5pZmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmdldCgwKS5jdHJsXHJcbn1cclxuXHJcbiQuZm4uc2V0RGF0YSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuXHJcbiAgY29uc3QgZnVuY05hbWUgPSAnc2V0JyArIG5hbWUuc3Vic3RyKDAsMSkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpXHJcbiAgLy9jb25zb2xlLmxvZygnZnVuY05hbWUnLCBmdW5jTmFtZSlcclxuXHJcbiAgaWYgKGlmYWNlICYmIGlmYWNlLnByb3BzW25hbWVdICYmIHR5cGVvZiBpZmFjZVtmdW5jTmFtZV0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWZhY2VbZnVuY05hbWVdKHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIGlmIChpZmFjZSAmJiAkJC5pc1ZpZXdDb250cm9sbGVyKGlmYWNlLmN0cmwpICYmIGlmYWNlLmN0cmwubW9kZWxbbmFtZV0pIHtcclxuICAgIGlmYWNlLmN0cmwuc2V0RGF0YShuYW1lLCB2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmRhdGEobmFtZSwgdmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHRoaXMuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpIHtcclxuICAgIHRoaXMucHJvcCgnY2hlY2tlZCcsIHZhbHVlKVxyXG4gICAgcmV0dXJuXHJcbiAgfSAgXHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5zZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZS5zZXRWYWx1ZSh2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLnZhbCh2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICBjb25zdCB0eXBlID0gdGhpcy5hdHRyKCd0eXBlJylcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcCgnY2hlY2tlZCcpXHJcbiAgfSAgICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2UuZ2V0VmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIGlmYWNlLmdldFZhbHVlKClcclxuICB9XHJcbiAgdmFyIHJldCA9IHRoaXMudmFsKClcclxuXHJcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAncmFuZ2UnKSB7XHJcbiAgICByZXQgPSBwYXJzZUZsb2F0KHJldClcclxuICB9XHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLmdldEZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJldCA9IHt9XHJcbiAgdGhpcy5maW5kKCdbbmFtZV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGVsdCA9ICQodGhpcylcclxuICAgIHZhciBuYW1lID0gZWx0LmF0dHIoJ25hbWUnKVxyXG4gICAgcmV0W25hbWVdID0gZWx0LmdldFZhbHVlKClcclxuXHJcbiAgfSlcclxuXHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLnJlc2V0Rm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09IFwiRk9STVwiKSB7XHJcbiAgICB0aGlzLmdldCgwKS5yZXNldCgpXHJcbiAgfSAgIFxyXG59XHJcblxyXG4kLmZuLnNldEZvcm1EYXRhID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCdzZXRGb3JtRGF0YScsIGRhdGEpXHJcbiAgdGhpcy5yZXNldEZvcm0oKVxyXG5cclxuICBmb3IodmFyIG5hbWUgaW4gZGF0YSkge1xyXG4gICAgdmFyIHZhbHVlID0gZGF0YVtuYW1lXVxyXG4gICAgdmFyIGVsdCA9IHRoaXMuZmluZChgW25hbWU9JHtuYW1lfV1gKVxyXG4gICAgaWYgKGVsdC5sZW5ndGgpIHtcclxuICAgICAgZWx0LnNldFZhbHVlKHZhbHVlKSAgICAgICBcclxuICAgIH1cclxuXHJcbiAgXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG4kLmZuLnNhZmVFbXB0eSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuZmluZCgnLkN1c3RvbUNvbnRyb2wnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgaWZhY2UgPSAkKHRoaXMpLmlmYWNlKClcclxuXHJcbiAgICBpZiAodHlwZW9mIGlmYWNlLmRpc3Bvc2UgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBpZmFjZS5kaXNwb3NlKClcclxuICAgIH1cclxuICB9KVxyXG5cclxuICB0aGlzLmVtcHR5KClcclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuJC5mbi5hZGRDb250cm9sID0gZnVuY3Rpb24oY3RybE5hbWUpIHtcclxuICB2YXIgbmV3Q3RybCA9ICQoJzxkaXY+JylcclxuICAkJC5jb250cm9sLmNyZWF0ZUNvbnRyb2woY3RybE5hbWUsIG5ld0N0cmwpXHJcbiAgdGhpcy5hcHBlbmQobmV3Q3RybCkgXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiXHJcbihmdW5jdGlvbigpe1xyXG5cclxubGV0IHNlcnZpY2VzID0ge31cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNlcnZpY2VzKGRlcHMpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0U2VydmljZXMnLCBkZXBzKVxyXG5cdHJldHVybiBkZXBzLm1hcChmdW5jdGlvbihkZXBOYW1lKSB7XHJcblx0XHR2YXIgc3J2ID0gc2VydmljZXNbZGVwTmFtZV1cclxuXHRcdGlmIChzcnYpIHtcclxuXHRcdFx0aWYgKHNydi5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdFx0XHR2YXIgZGVwczIgPSBnZXRTZXJ2aWNlcyhzcnYuZGVwcylcclxuXHRcdFx0XHR2YXIgY29uZmlnID0gc3J2LmNvbmZpZyB8fCB7fVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2Ugc2VydmljZSAnJHtkZXBOYW1lfScgd2l0aCBjb25maWdgLCBjb25maWcpXHJcblx0XHRcdFx0dmFyIGFyZ3MgPSBbY29uZmlnXS5jb25jYXQoZGVwczIpXHJcblx0XHRcdFx0c3J2Lm9iaiA9IHNydi5mbi5hcHBseShudWxsLCBhcmdzKVxyXG5cdFx0XHRcdHNydi5zdGF0dXMgPSAncmVhZHknXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHNydi5vYmpcdFx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vc3J2LnN0YXR1cyA9ICdub3RyZWdpc3RlcmVkJ1xyXG5cdFx0XHR0aHJvdyhgW0NvcmVdIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHRcdH1cclxuXHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBjb25maWd1cmVTZXJ2aWNlKG5hbWUsIGNvbmZpZykge1xyXG5cdGNvbnNvbGUubG9nKCdbQ29yZV0gY29uZmlndXJlU2VydmljZScsIG5hbWUsIGNvbmZpZylcclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGNvbmZpZyAhPSAnb2JqZWN0Jykge1xyXG5cdFx0Y29uc29sZS53YXJuKCdbQ29yZV0gY29uZmlndXJlU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHRcdHJldHVyblxyXG5cdH0gXHRcclxuXHJcblx0dmFyIHNydiA9IHNlcnZpY2VzW25hbWVdXHJcblx0aWYgKHNydikge1xyXG5cdFx0c3J2LmNvbmZpZyA9IGNvbmZpZ1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRocm93KGBbY29uZmlndXJlU2VydmljZV0gc2VydmljZSAnJHtuYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZShuYW1lLCBhcmcxLCBhcmcyKSB7XHJcblx0dmFyIGRlcHMgPSBbXVxyXG5cdHZhciBmbiA9IGFyZzFcclxuXHRpZiAoQXJyYXkuaXNBcnJheShhcmcxKSkge1xyXG5cdFx0ZGVwcyA9IGFyZzFcclxuXHRcdGZuID0gYXJnMlxyXG5cdH1cclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGZuID09ICd1bmRlZmluZWQnIHx8ICFBcnJheS5pc0FycmF5KGRlcHMpKSB7XHJcblx0XHR0aHJvdygnW0NvcmVdIHJlZ2lzdGVyU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHR9IFxyXG5cdGNvbnNvbGUubG9nKGBbQ29yZV0gcmVnaXN0ZXIgc2VydmljZSAnJHtuYW1lfScgd2l0aCBkZXBzYCwgZGVwcylcclxuXHJcblx0c2VydmljZXNbbmFtZV0gPSB7ZGVwcywgZm4sIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbiQkLnNlcnZpY2UgPSB7XHJcblx0cmVnaXN0ZXJTZXJ2aWNlLFxyXG5cdGNvbmZpZ3VyZVNlcnZpY2UsXHJcblx0Z2V0U2VydmljZXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XG5cbmZ1bmN0aW9uIHNob3dBbGVydChvcHRpb25zLCBjYWxsYmFjaykge1xuXG5cdG9wdGlvbnMgPSAkLmV4dGVuZCh7XG5cdFx0dGl0bGU6ICdBbGVydCcsXG5cdFx0Y29udGVudDogJycsXG5cdFx0c2hvd0NhbmNlbDogZmFsc2Vcblx0fSwgb3B0aW9ucylcblxuXHRvcHRpb25zLm1vZGVsID0gdHJ1ZVxuXHRvcHRpb25zLmNsb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS5kaWFsb2coJ2Rlc3Ryb3knKVxuXHR9XG5cdG9wdGlvbnMuYnV0dG9ucyA9IHtcblx0XHQnT0snOiBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRpZiAob3B0aW9ucy5zaG93Q2FuY2VsKSB7XG5cdFx0b3B0aW9ucy5idXR0b25zWydDYW5jZWwnXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5kaWFsb2coJ2Nsb3NlJylcblx0XHR9XG5cdH1cblxuXHQkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZX0pXG5cdFx0LmFwcGVuZCgkKCc8cD4nKS5odG1sKG9wdGlvbnMuY29udGVudCkpXG5cdFx0LmRpYWxvZyhvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzaG93Q29uZmlybShvcHRpb25zLCBjYWxsYmFjaykge1xuXHRvcHRpb25zLnNob3dDYW5jZWwgPSB0cnVlXG5cdHNob3dBbGVydChvcHRpb25zLCBjYWxsYmFjaylcbn1cblxuZnVuY3Rpb24gc2hvd1Byb21wdChvcHRpb25zLCBjYWxsYmFjaykge1xuXG5cdGNvbnN0IGxhYmVsID0gb3B0aW9ucy5sYWJlbCB8fCAnJ1xuXG5cdG9wdGlvbnMudGVtcGxhdGUgPSBgXG5cdDxwPiR7bGFiZWx9PC9wPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZD1cIlwiIG5hbWU9XCJ2YWx1ZVwiPlxuXHRgXG5cblx0b3B0aW9ucy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuZGlhbG9nKCdkZXN0cm95Jylcblx0fVxuXG5cdCQkLmZvcm1EaWFsb2dDb250cm9sbGVyKG9wdGlvbnMpXG5cdC5zaG93KGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNhbGxiYWNrKGRhdGEudmFsdWUpXG5cdFx0fVxuXHR9KVxufVxuXG4kJC51aSA9IHtcblx0c2hvd0FsZXJ0LFxuXHRzaG93Q29uZmlybSxcblx0c2hvd1Byb21wdFxufVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcblxyXG5mdW5jdGlvbiByZWFkVGV4dEZpbGUoZmlsZU5hbWUsIG9uUmVhZCkge1xyXG5cdHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG5cclxuXHRmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBvblJlYWQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRvblJlYWQoZmlsZVJlYWRlci5yZXN1bHQpXHJcblx0XHR9XHJcblx0fVxyXG5cdGZpbGVSZWFkZXIucmVhZEFzVGV4dChmaWxlTmFtZSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlYWRGaWxlQXNEYXRhVVJMKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG52YXIgaW5wdXRGaWxlID0gJCgnPGlucHV0PicsIHt0eXBlOiAnZmlsZSd9KS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcblx0dmFyIG9uQXBwbHkgPSAkKHRoaXMpLmRhdGEoJ29uQXBwbHknKVxyXG5cdHZhciBmaWxlTmFtZSA9IHRoaXMuZmlsZXNbMF1cclxuXHRpZiAodHlwZW9mIG9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0b25BcHBseShmaWxlTmFtZSlcclxuXHR9XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBvcGVuRmlsZURpYWxvZyhvbkFwcGx5KSB7XHJcblx0aW5wdXRGaWxlLmRhdGEoJ29uQXBwbHknLCBvbkFwcGx5KVxyXG5cdGlucHV0RmlsZS5jbGljaygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSW1hZ2UoZmlsZU5hbWUpIHtcclxuXHRyZXR1cm4gKC9cXC4oZ2lmfGpwZ3xqcGVnfHBuZykkL2kpLnRlc3QoZmlsZU5hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGFVUkx0b0Jsb2IoZGF0YVVSTCkge1xyXG4gIC8vIERlY29kZSB0aGUgZGF0YVVSTFxyXG4gIGNvbnN0IFsgLCBtaW1lVHlwZSwgZW5jb2RhZ2UsIGRhdGFdID0gZGF0YVVSTC5zcGxpdCgvWzosO10vKVxyXG4gIGlmIChlbmNvZGFnZSAhPSAnYmFzZTY0Jykge1xyXG4gIFx0cmV0dXJuXHJcbiAgfVxyXG5cclxuICAvL2NvbnNvbGUubG9nKCdtaW1lVHlwZScsIG1pbWVUeXBlKVxyXG4gIC8vY29uc29sZS5sb2coJ2VuY29kYWdlJywgZW5jb2RhZ2UpXHJcbiAgLy9jb25zb2xlLmxvZygnZGF0YScsIGRhdGEpXHJcblxyXG4gIHZhciBiaW5hcnkgPSBhdG9iKGRhdGEpXHJcbiAvLyBDcmVhdGUgOC1iaXQgdW5zaWduZWQgYXJyYXlcclxuICB2YXIgYXJyYXkgPSBbXVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICBcdGFycmF5LnB1c2goYmluYXJ5LmNoYXJDb2RlQXQoaSkpXHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gb3VyIEJsb2Igb2JqZWN0XHJcblx0cmV0dXJuIG5ldyBCbG9iKFsgbmV3IFVpbnQ4QXJyYXkoYXJyYXkpIF0sIHttaW1lVHlwZX0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdHlsZShzdHlsZUZpbGVQYXRoLCBjYWxsYmFjaykge1x0XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGxvYWRTdHlsZScsIHN0eWxlRmlsZVBhdGgpXHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY3NzT2sgPSAkKCdoZWFkJykuZmluZChgbGlua1tocmVmPVwiJHtzdHlsZUZpbGVQYXRofVwiXWApLmxlbmd0aFxyXG5cdFx0aWYgKGNzc09rICE9IDEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYGxvYWRpbmcgJyR7c3R5bGVGaWxlUGF0aH0nIHN0eWxlYClcclxuXHRcdFx0JCgnPGxpbms+Jywge2hyZWY6IHN0eWxlRmlsZVBhdGgsIHJlbDogJ3N0eWxlc2hlZXQnfSlcclxuXHRcdFx0Lm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCcke3N0eWxlRmlsZVBhdGh9JyBsb2FkZWRgKVxyXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmFwcGVuZFRvKCQoJ2hlYWQnKSlcclxuXHRcdH1cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcblx0XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KGEpIHtcclxuXHRyZXR1cm4gKHR5cGVvZiBhID09ICdvYmplY3QnKSAmJiAhQXJyYXkuaXNBcnJheShhKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1R5cGUodmFsdWUsIHR5cGUsIGlzT3B0aW9uYWwpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdjaGVja1R5cGUnLHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKVxyXG5cdGlmICh0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgJiYgaXNPcHRpb25hbCA9PT0gdHJ1ZSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdHlwZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSB0eXBlXHJcblx0fVxyXG5cclxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdGlmICghQXJyYXkuaXNBcnJheSh0eXBlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZSAvLyBubyBpdGVtIHR5cGUgY2hlY2tpbmdcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiB2YWx1ZSkge1xyXG5cdFx0XHR2YXIgcmV0ID0gZmFsc2VcclxuXHRcdFx0Zm9yKGxldCB0IG9mIHR5cGUpIHtcclxuXHRcdFx0XHRyZXQgfD0gY2hlY2tUeXBlKGksIHQpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFyZXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoaXNPYmplY3QodHlwZSkpIHtcclxuXHRcdGlmICghaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBmIGluIHR5cGUpIHtcclxuXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2YnLCBmLCAndmFsdWUnLCB2YWx1ZSlcclxuXHRcdFx0dmFyIG5ld1R5cGUgPSB0eXBlW2ZdXHJcblxyXG5cdFx0XHR2YXIgaXNPcHRpb25hbCA9IGZhbHNlXHJcblx0XHRcdGlmIChmLnN0YXJ0c1dpdGgoJyQnKSkge1xyXG5cdFx0XHRcdGYgPSBmLnN1YnN0cigxKVxyXG5cdFx0XHRcdGlzT3B0aW9uYWwgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFjaGVja1R5cGUodmFsdWVbZl0sIG5ld1R5cGUsIGlzT3B0aW9uYWwpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlXHJcbn1cdFxyXG5cclxuXHJcblxyXG4kJC51dGlsID0ge1xyXG5cdHJlYWRUZXh0RmlsZSxcclxuXHRyZWFkRmlsZUFzRGF0YVVSTCxcclxuXHRvcGVuRmlsZURpYWxvZyxcclxuXHRpc0ltYWdlLFxyXG5cdGRhdGFVUkx0b0Jsb2IsXHJcblx0bG9hZFN0eWxlLFxyXG5cdGNoZWNrVHlwZVxyXG59XHJcblxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5jbGFzcyBWaWV3Q29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG9wdGlvbnMpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnVmlld0NvbnRyb2xsZXInLCBvcHRpb25zKVxyXG4gICAgXHRpZiAodHlwZW9mIGVsdCA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGVsdCA9ICQoZWx0KVxyXG4gICAgXHR9XHJcblxyXG4gICAgICAgIGlmIChlbHQuaGFzQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKSkge1xyXG4gICAgICAgICAgICBlbHQgPSBlbHQuY2hpbGRyZW4oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICBcdG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucylcclxuICAgICAgICB0aGlzLmVsdCA9IGVsdFxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMubW9kZWwgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5kYXRhKVxyXG4gICAgICAgIHRoaXMucnVsZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5ydWxlcylcclxuICAgICAgICB0aGlzLndhdGNoZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy53YXRjaGVzKVxyXG5cclxuICAgICAgICAvLyBnZW5lcmF0ZSBhdXRvbWF0aWMgcnVsZXMgZm9yIGNvbXB1dGVkIGRhdGEgKGFrYSBmdW5jdGlvbilcclxuICAgICAgICBmb3IodmFyIGsgaW4gdGhpcy5tb2RlbCkge1xyXG4gICAgICAgIFx0dmFyIGRhdGEgPSB0aGlzLm1vZGVsW2tdXHJcbiAgICAgICAgXHRpZiAodHlwZW9mIGRhdGEgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIFx0XHR2YXIgZnVuY1RleHQgPSBkYXRhLnRvU3RyaW5nKClcclxuICAgICAgICBcdFx0Ly9jb25zb2xlLmxvZygnZnVuY1RleHQnLCBmdW5jVGV4dClcclxuICAgICAgICBcdFx0dmFyIHJ1bGVzID0gW11cclxuICAgICAgICBcdFx0ZnVuY1RleHQucmVwbGFjZSgvdGhpcy4oW2EtekEtWjAtOV8tXXsxLH0pL2csIGZ1bmN0aW9uKG1hdGNoLCBjYXB0dXJlT25lKSB7XHJcbiAgICAgICAgXHRcdFx0Ly9jb25zb2xlLmxvZygnY2FwdHVyZU9uZScsIGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdFx0cnVsZXMucHVzaChjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHR9KVxyXG4gICAgICAgIFx0XHR0aGlzLnJ1bGVzW2tdID0gcnVsZXMudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVsZXMnLCB0aGlzLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gJCQuYmluZGluZy5wcm9jZXNzKGVsdCwgdGhpcy5tb2RlbCwgJCQuY29udHJvbC5jcmVhdGVDb250cm9sLCBcclxuICAgICAgICAgICAgKG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHVwZGF0ZUNiaycsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhKG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5ldmVudHMgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgJCQuYmluZGluZy5wcm9jZXNzRXZlbnRzKGVsdCwgb3B0aW9ucy5ldmVudHMpXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zY29wZSA9ICQkLmJpbmRpbmcucHJvY2Vzc0JpbmRpbmdzKGVsdClcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2NvcGUnLCB0aGlzLnNjb3BlKVxyXG4gICAgICAgXHJcblxyXG4gICAgfSBcclxuXHJcbiAgICBzZXREYXRhKGFyZzEsIGFyZzIsIGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBhcmcxLCBhcmcyLCBleGNsdWRlRWx0KVxyXG4gICAgICAgIHZhciBkYXRhID0gYXJnMVxyXG4gICAgICAgIGlmICh0eXBlb2YgYXJnMSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIFx0ZGF0YSA9IHt9XHJcbiAgICAgICAgXHRkYXRhW2FyZzFdID0gYXJnMlxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBkYXRhKVxyXG4gICAgICAgICQuZXh0ZW5kKHRoaXMubW9kZWwsIGRhdGEpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbW9kZWwnLCB0aGlzLm1vZGVsKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKE9iamVjdC5rZXlzKGRhdGEpLCBleGNsdWRlRWx0KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShmaWVsZHNOYW1lLCBleGNsdWRlRWx0KSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gdXBkYXRlJywgZmllbGRzTmFtZSwgZXhjbHVkZUVsdClcclxuICAgIFx0aWYgKHR5cGVvZiBmaWVsZHNOYW1lID09ICdzdHJpbmcnKSB7XHJcbiAgICBcdFx0ZmllbGRzTmFtZSA9IGZpZWxkc05hbWUuc3BsaXQoJywnKVxyXG4gICAgXHR9XHJcblxyXG5cclxuICAgIFx0aWYgKEFycmF5LmlzQXJyYXkoZmllbGRzTmFtZSkpIHtcclxuICAgIFx0XHR2YXIgZmllbGRzU2V0ID0ge31cclxuICAgIFx0XHRmaWVsZHNOYW1lLmZvckVhY2goKGZpZWxkKSA9PiB7XHJcblxyXG4gICAgXHRcdFx0dmFyIHdhdGNoID0gdGhpcy53YXRjaGVzW2ZpZWxkXVxyXG4gICAgXHRcdFx0aWYgKHR5cGVvZiB3YXRjaCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBcdFx0XHRcdHdhdGNoLmNhbGwobnVsbCwgdGhpcy5tb2RlbFtmaWVsZF0pXHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0XHRmaWVsZHNTZXRbZmllbGRdID0gMVxyXG5cclxuICAgIFx0XHRcdGZvcih2YXIgcnVsZSBpbiB0aGlzLnJ1bGVzKSB7XHJcbiAgICBcdFx0XHRcdGlmICh0aGlzLnJ1bGVzW3J1bGVdLnNwbGl0KCcsJykuaW5kZXhPZihmaWVsZCkgIT0gLTEpIHtcclxuICAgIFx0XHRcdFx0XHRmaWVsZHNTZXRbcnVsZV0gPSAxXHJcbiAgICBcdFx0XHRcdH1cclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHR9KVxyXG5cclxuXHJcbiAgICBcdFx0JCQuYmluZGluZy51cGRhdGUodGhpcy5jdHgsIHRoaXMubW9kZWwsIE9iamVjdC5rZXlzKGZpZWxkc1NldCksIGV4Y2x1ZGVFbHQpXHJcbiAgICBcdH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiQkLnZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24oZWx0LCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFZpZXdDb250cm9sbGVyKGVsdCwgb3B0aW9ucylcclxufVxyXG5cclxuJCQuaXNWaWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIHJldHVybiBvIGluc3RhbmNlb2YgVmlld0NvbnRyb2xsZXJcclxufVxyXG5cclxufSkoKTtcclxuIiwiXG4kJC5zZXJ2aWNlLnJlZ2lzdGVyU2VydmljZSgnYnJhaW5qcy5odHRwJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0Z2V0KHVybCkge1xuXHRcdFx0cmV0dXJuICQuZ2V0SlNPTih1cmwpXG5cdFx0fSxcblxuXG5cdFx0cG9zdCh1cmwsIGRhdGEpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuXHRcdFx0fSlcblx0XHR9LFxuXG5cdFx0cHV0KHVybCwgZGF0YSkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ1BVVCcsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0XHRcdH0pXG5cdFx0fSxcdFx0XHRcblxuXHRcdGRlbGV0ZSh1cmwpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fSxcblxuXHRcdHBvc3RGb3JtRGF0YSh1cmwsIGZkKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdCAgdXJsOiB1cmwsXG5cdFx0XHQgIHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0ICBkYXRhOiBmZCxcblx0XHRcdCAgcHJvY2Vzc0RhdGE6IGZhbHNlLCAgLy8gaW5kaXF1ZSDDoCBqUXVlcnkgZGUgbmUgcGFzIHRyYWl0ZXIgbGVzIGRvbm7DqWVzXG5cdFx0XHQgIGNvbnRlbnRUeXBlOiBmYWxzZSAgIC8vIGluZGlxdWUgw6AgalF1ZXJ5IGRlIG5lIHBhcyBjb25maWd1cmVyIGxlIGNvbnRlbnRUeXBlXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fVxuXG5cdFx0XG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIl19
