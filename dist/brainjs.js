(function(){

	window.$$ = {}
	
})();
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

    var not = false
    if (varName.startsWith('!')) {
      varName = varName.substr(1)
      not = true
    }     

    var func = data[varName]
    var value

    if (typeof func == 'function') {
      value = func.call(data)
    }
    else {
      value = getVarValue(data, varName)
    }


    if (typeof value == 'boolean' && not) {
      value = !value
    }

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
        let {type, f, elt, name, template, iter} = action
        if (elt == excludeElt) {
          return
        }
        if (type == 1) {
          //console.log('update', variable, f, value)
           elt[f].call(elt, value)
        }
        if (type == 2) {
          //console.log('update', variable, f, name, value)
           elt[f].call(elt, name, value)
        }   
        if (type == 3 && Array.isArray(value)) {
            elt.empty()
            value.forEach(function(item) {
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
        if (data) {
          let value = getValue(data, attrValue)
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
        ctx[attrValue].push({f, elt, type})        
      }

      if (type == 4 && typeof createControl == 'function') {
        createControl(attrValue, elt)
      }

      if (type == 2) {

          splitAttr(attrValue, function(name, varName) {
            if (data) {
              let value = getValue(data, varName)
              elt[f].call(elt, name, value)
            }
            ctx[varName] = ctx[varName] || []
            ctx[varName].push({f, elt, type, name})  
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







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2RhdGVwaWNrZXIuanMiLCJjb250cm9scy9pbnB1dGdyb3VwLmpzIiwiY29udHJvbHMvbmF2YmFyLmpzIiwiY29udHJvbHMvcmFkaW9ncm91cC5qcyIsImNvbnRyb2xzL3JvdXRlci5qcyIsImNvbnRyb2xzL3RhYnMuanMiLCJsaWIvYmluZGluZy5qcyIsImxpYi9jb250cm9sLmpzIiwibGliL2RpYWxvZ0NvbnRyb2xsZXIgLmpzIiwibGliL2Zvcm1EaWFsb2dDb250cm9sbGVyLmpzIiwibGliL2pxdWVyeS1leHQuanMiLCJsaWIvc2VydmljZS5qcyIsImxpYi91aS5qcyIsImxpYi91dGlsLmpzIiwibGliL3ZpZXdDb250cm9sbGVyLmpzIiwic2VydmljZXMvaHR0cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnJhaW5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG5cclxuXHR3aW5kb3cuJCQgPSB7fVxyXG5cdFxyXG59KSgpOyIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmNoZWNrZ3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0ZWx0Lm9uKCdjbGljaycsICdpbnB1dFt0eXBlPWNoZWNrYm94XScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZWx0LnRyaWdnZXIoJ2lucHV0Jylcblx0XHR9KVxuXG5cdFx0dGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJldCA9IFtdXG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF06Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldC5wdXNoKCQodGhpcykudmFsKCkpXG5cdFx0XHR9KVx0XG5cdFx0XHRyZXR1cm4gcmV0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHZhbHVlLmluZGV4T2YoJCh0aGlzKS52YWwoKSkgPj0gMClcblx0XHRcdFx0fSlcblx0XHRcdH1cdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmRhdGVwaWNrZXInLCB7XG5cdHByb3BzOiB7XG5cdFx0c2hvd0J1dHRvblBhbmVsOiB0cnVlXG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRsZXQgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLnByb3BzKVxuXG5cdFx0b3B0aW9ucy5vblNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ1tkYXRlcGlja2VyXSBvblNlbGVjdCcpXG5cdFx0XHRlbHQudHJpZ2dlcignZGF0ZXBpY2tlcmNoYW5nZScpXG5cdFx0fVxuXG5cdFx0ZWx0LmRhdGVwaWNrZXIob3B0aW9ucylcblxuXHRcdHZhciB2YWx1ZSA9IGVsdC52YWwoKVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcblx0XHRcdHZhciBtcyA9IERhdGUucGFyc2UodmFsdWUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdbRGF0ZVBpY2tlckNvbnRyb2xdIG1zJywgbXMpXG5cdFx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKG1zKVxuXHRcdFx0Ly9jb25zb2xlLmxvZygnW0RhdGVQaWNrZXJDb250cm9sXSBkYXRlJywgZGF0ZSlcblx0XHRcdGVsdC5kYXRlcGlja2VyKCdzZXREYXRlJywgZGF0ZSlcblx0XHR9XG5cdFx0XHRcblx0XHR0aGlzLnNldFZhbHVlID0gZnVuY3Rpb24oZGF0ZSkge1xuXHRcdFx0ZWx0LmRhdGVwaWNrZXIoJ3NldERhdGUnLCBkYXRlKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdnZXRWYWx1ZScpXG5cdFx0XHRyZXR1cm4gZWx0LmRhdGVwaWNrZXIoJ2dldERhdGUnKVxuXHRcdH1cblx0fVxuXG59KTtcblxuIiwiXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5pbnB1dGdyb3VwJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHZhciBpZCA9IGVsdC5jaGlsZHJlbignaW5wdXQnKS51bmlxdWVJZCgpLmF0dHIoJ2lkJylcblx0XHRlbHQuY2hpbGRyZW4oJ2xhYmVsJykuYXR0cignZm9yJywgaWQpXG5cdH1cbn0pO1xuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMubmF2YmFyJywge1xuXHRwcm9wczoge1xuXHRcdGFjdGl2ZUNvbG9yOiAndzMtZ3JlZW4nLFxuXHRcdHR5cGU6ICdob3Jpem9udGFsJ1xuXHR9LFxuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGNvbnN0IHthY3RpdmVDb2xvciwgdHlwZX0gPSB0aGlzLnByb3BzXG5cblx0XHRlbHQuYWRkQ2xhc3MoKHR5cGUgPT0gJ3ZlcnRpY2FsJykgPyAndzMtYmFyLWJsb2NrJzogJ3czLWJhcicpXG5cdFx0ZWx0LmNoaWxkcmVuKCdhJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3czLWJhci1pdGVtIHczLWJ1dHRvbicpXG5cdFx0fSlcblxuXHRcdGNvbnN0IG5ld1JvdXRlID0gJCQuZ2V0TmV3Um91dGUoKVxuXHRcdGVsdC5jaGlsZHJlbihgYVtocmVmPVwiIyR7bmV3Um91dGV9XCJdYCkuYWRkQ2xhc3MoYWN0aXZlQ29sb3IpXG5cblx0XHQkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdbTmF2YmFyQ29udHJvbF0gcm91dGVDaGFuZ2UnLCBuZXdSb3V0ZSlcblx0XHRcdGNvbnN0IG5ld1JvdXRlID0gJCQuZ2V0TmV3Um91dGUoKVxuXG5cdFx0XHRlbHQuY2hpbGRyZW4oYGEuJHthY3RpdmVDb2xvcn1gKS5yZW1vdmVDbGFzcyhhY3RpdmVDb2xvcilcdFxuXHRcdFx0ZWx0LmNoaWxkcmVuKGBhW2hyZWY9XCIjJHtuZXdSb3V0ZX1cIl1gKS5hZGRDbGFzcyhhY3RpdmVDb2xvcilcblxuXHRcdH0pXHRcblxuXHR9XG5cbn0pO1xuXG5cblxuXG5cblxuIiwiXG4kJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5yYWRpb2dyb3VwJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGVsdC5vbignY2xpY2snLCAnaW5wdXRbdHlwZT1yYWRpb10nLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vY29uc29sZS5sb2coJ3JhZGlvZ3JvdXAgY2xpY2snKVxuXHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9cmFkaW9dOmNoZWNrZWQnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpXG5cdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuXHRcdFx0ZWx0LnRyaWdnZXIoJ2lucHV0Jylcblx0XHR9KVxuXHRcdFxuXG5cdFx0dGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXTpjaGVja2VkJykudmFsKClcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHZhbHVlID09PSAkKHRoaXMpLnZhbCgpKVxuXHRcdFx0fSlcdFx0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlKGVsdC52YWwoKSlcblx0fVxufSk7XG5cblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gbWF0Y2hSb3V0ZShyb3V0ZSwgcGF0dGVybikge1xuXHRcdC8vY29uc29sZS5sb2coJ21hdGNoUm91dGUnLCByb3V0ZSwgcGF0dGVybilcblx0XHR2YXIgcm91dGVTcGxpdCA9IHJvdXRlLnNwbGl0KCcvJylcblx0XHR2YXIgcGF0dGVyblNwbGl0ID0gcGF0dGVybi5zcGxpdCgnLycpXG5cdFx0Ly9jb25zb2xlLmxvZyhyb3V0ZVNwbGl0LCBwYXR0ZXJuU3BsaXQpXG5cdFx0dmFyIHJldCA9IHt9XG5cblx0XHRpZiAocm91dGVTcGxpdC5sZW5ndGggIT0gcGF0dGVyblNwbGl0Lmxlbmd0aClcblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRmb3IodmFyIGlkeCA9IDA7IGlkeCA8IHBhdHRlcm5TcGxpdC5sZW5ndGg7IGlkeCsrKSB7XG5cdFx0XHR2YXIgcGF0aCA9IHBhdHRlcm5TcGxpdFtpZHhdXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdwYXRoJywgcGF0aClcblx0XHRcdGlmIChwYXRoLnN1YnN0cigwLCAxKSA9PT0gJzonKSB7XG5cdFx0XHRcdGlmIChyb3V0ZVNwbGl0W2lkeF0ubGVuZ3RoID09PSAwKVxuXHRcdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHRcdHJldFtwYXRoLnN1YnN0cigxKV0gPSByb3V0ZVNwbGl0W2lkeF1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHBhdGggIT09IHJvdXRlU3BsaXRbaWR4XSkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJldFxuXHR9XG5cblxuXHRmdW5jdGlvbiBnZXROZXdSb3V0ZSgpIHtcblx0XHRjb25zdCBocmVmID0gbG9jYXRpb24uaHJlZlxuXHRcdGNvbnN0IGlkeCA9IGhyZWYuaW5kZXhPZignIycpXG5cdFx0Y29uc3QgbmV3Um91dGUgPSAoaWR4ICE9PSAtMSkgID8gaHJlZi5zdWJzdHIoaWR4KzEpIDogJy8nXG5cdFx0XG5cdFx0cmV0dXJuIG5ld1JvdXRlXG5cdH1cblxuXHQkJC5nZXROZXdSb3V0ZSA9IGdldE5ld1JvdXRlXG5cblx0JCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMucm91dGVyJywge1xuXG5cdFx0cHJvcHM6IHtcblx0XHRcdHJvdXRlczogW11cblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cblx0XHRcdCQod2luZG93KS5vbigncG9wc3RhdGUnLCBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHBvcHN0YXRlJylcblx0XHRcdFx0cHJvY2Vzc1JvdXRlKGdldE5ld1JvdXRlKCkpXG5cdFx0XHR9KVxuXG5cblx0XHRcdHZhciByb3V0ZXMgPSB0aGlzLnByb3BzLnJvdXRlc1xuXG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkocm91dGVzKSkge1xuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1tyb3V0ZXJdIGJhZCByb3V0ZXMnKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblxuXHRcdFx0cHJvY2Vzc1JvdXRlKGdldE5ld1JvdXRlKCkpXG5cblx0XHRcdGZ1bmN0aW9uIHByb2Nlc3NSb3V0ZShuZXdSb3V0ZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnW3JvdXRlcl0gcHJvY2Vzc1JvdXRlJywgbmV3Um91dGUsIHJvdXRlcylcblxuXHRcdFx0XHRmb3IodmFyIHJvdXRlIG9mIHJvdXRlcykge1xuXHRcdFx0XHRcdHZhciBwYXJhbXMgPSBtYXRjaFJvdXRlKG5ld1JvdXRlLCByb3V0ZS5ocmVmKVxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coYHJvdXRlOiAke3JvdXRlLmhyZWZ9LCBwYXJhbXNgLCBwYXJhbXMpXG5cdFx0XHRcdFx0aWYgKHBhcmFtcyAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdbUm91dGVyQ29udHJvbF0gcGFyYW1zJywgcGFyYW1zKVxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByb3V0ZS5yZWRpcmVjdCA9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnW3JvdXRlcl0gcmVkaXJlY3QgdG8gJywgcm91dGUucmVkaXJlY3QpXG5cdFx0XHRcdFx0XHRcdGxvY2F0aW9uLmhyZWYgPSAnIycgKyByb3V0ZS5yZWRpcmVjdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICh0eXBlb2Ygcm91dGUuY29udHJvbCA9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0XHRlbHQuc2FmZUVtcHR5KCkuYWRkQ29udHJvbChyb3V0ZS5jb250cm9sKVx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0XHRcdH1cdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnNvbGUud2FybignW3JvdXRlcl0gTm8gcm91dGUgZm91bmQgIScpXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XHR9XHRcdFxuXG5cblx0XHR9XG5cblx0fSlcblxufSkoKTtcblxuXG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy50YWJzJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdHZhciB1bCA9ICQoJzx1bD4nKS5wcmVwZW5kVG8oZWx0KVxuXG5cdFx0ZWx0LmNoaWxkcmVuKCdkaXYnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRpdGxlID0gJCh0aGlzKS5hdHRyKCd0aXRsZScpXG5cdFx0XHR2YXIgaWQgPSAkKHRoaXMpLnVuaXF1ZUlkKCkuYXR0cignaWQnKVxuXHRcdFx0dmFyIGxpID0gJCgnPGxpPicpXG5cdFx0XHRcdC5hdHRyKCd0aXRsZScsIHRpdGxlKVxuXHRcdFx0XHQuYXBwZW5kKCQoJzxhPicsIHtocmVmOiAnIycgKyBpZH0pLnRleHQodGl0bGUpKVxuXHRcdFx0XHQuYXBwZW5kVG8odWwpXG5cdFx0XHRpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLXJlbW92YWJsZScpICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRsaS5hcHBlbmQoJCgnPHNwYW4+Jywge2NsYXNzOiAndWktaWNvbiB1aS1pY29uLWNsb3NlJ30pKVxuXHRcdFx0fVxuXHRcdH0pXHRcdFxuXG5cdFx0ZWx0LnRhYnMoKVxuXHRcdC5vbignY2xpY2snLCAnc3Bhbi51aS1pY29uLWNsb3NlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcGFuZWxJZCA9ICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmUoKS5hdHRyKCdhcmlhLWNvbnRyb2xzJylcblx0XHRcdC8vY29uc29sZS5sb2coJ3BhbmVsSWQnLCBwYW5lbElkKVxuXHRcdFx0JCgnIycgKyBwYW5lbElkKS5zYWZlRW1wdHkoKS5yZW1vdmUoKVxuXHRcdFx0ZWx0LnRhYnMoJ3JlZnJlc2gnKVxuXHRcdH0pXG5cblxuXHRcdGZ1bmN0aW9uIGdldFRhYnNDb3VudCgpIHtcblx0XHRcdHJldHVybiB1bC5jaGlsZHJlbihgbGlgKS5sZW5ndGhcblx0XHR9XG5cblx0XHR0aGlzLmdldFRhYnNDb3VudCA9IGdldFRhYnNDb3VudFxuXG5cdFx0dGhpcy5hZGRUYWIgPSBmdW5jdGlvbih0aXRsZSwgb3B0aW9ucykge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnYWRkVGFiJywgdGl0bGUpXG5cdFx0XHR2YXIgaWR4ID0gZ2V0VGFic0NvdW50KClcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cdFx0XHR2YXIgdGFiID0gJCgnPGRpdj4nKVxuXHRcdFx0XHQuYXR0cigndGl0bGUnLCB0aXRsZSlcblx0XHRcdFx0LmFwcGVuZFRvKGVsdClcblxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmNvbnRyb2wgPT0gJ3N0cmluZycpXHR7XG5cdFx0XHRcdHRhYi5hZGRDb250cm9sKG9wdGlvbnMuY29udHJvbClcblx0XHRcdH1cdFxuXG5cdFx0XHRlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xuXHRcdFx0XHR0YWIuYXBwZW5kKG9wdGlvbnMudGVtcGxhdGUpXG5cdFx0XHR9XG5cblx0XHRcdHZhciBpZCA9IHRhYi51bmlxdWVJZCgpLmF0dHIoJ2lkJylcblx0XHRcdHZhciBsaSA9ICQoJzxsaT4nKVxuXHRcdFx0XHQuYXR0cigndGl0bGUnLCB0aXRsZSlcblx0XHRcdFx0LmFwcGVuZCgkKCc8YT4nLCB7aHJlZjogJyMnICsgaWR9KS50ZXh0KHRpdGxlKSlcblx0XHRcdFx0LmFwcGVuZFRvKHVsKVxuXHRcdFx0aWYgKG9wdGlvbnMucmVtb3ZhYmxlID09PSB0cnVlKSB7XG5cdFx0XHRcdGxpLmFwcGVuZCgkKCc8c3Bhbj4nLCB7Y2xhc3M6ICd1aS1pY29uIHVpLWljb24tY2xvc2UnfSkpXG5cdFx0XHR9XHRcdFx0XG5cblx0XHRcdGVsdC50YWJzKCdyZWZyZXNoJylcblx0XHRcdHJldHVybiBpZHhcblx0XHR9XG5cblx0XHR0aGlzLmdldFNlbGVjdGVkVGFiSW5kZXggPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbmRleCA9IHVsLmNoaWxkcmVuKCdsaS51aS1zdGF0ZS1hY3RpdmUnKS5pbmRleCgpXG5cdFx0XHRyZXR1cm4gaW5kZXhcblx0XHR9XG5cblx0XHR0aGlzLmdldFRhYkluZm8gPSBmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0Y29uc3QgdGl0bGUgPSB1bC5jaGlsZHJlbignbGknKS5lcShpbmRleCkuYXR0cigndGl0bGUnKVxuXHRcdFx0cmV0dXJuIHt0aXRsZX1cblx0XHR9XG5cdH1cblxufSk7XG5cblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcbiAgICB2YXIgcmV0ID0gZGF0YVxyXG4gICAgZm9yKGxldCBmIG9mIHZhck5hbWUuc3BsaXQoJy4nKSkge1xyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGVvZiByZXQgPT0gJ29iamVjdCcgJiYgZiBpbiByZXQpIHtcclxuICAgICAgICByZXQgPSByZXRbZl1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZhbHVlKGRhdGEsIHZhck5hbWUpIHtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0VmFsdWUnLCB2YXJOYW1lLCBjdHgpXHJcblxyXG4gICAgdmFyIG5vdCA9IGZhbHNlXHJcbiAgICBpZiAodmFyTmFtZS5zdGFydHNXaXRoKCchJykpIHtcclxuICAgICAgdmFyTmFtZSA9IHZhck5hbWUuc3Vic3RyKDEpXHJcbiAgICAgIG5vdCA9IHRydWVcclxuICAgIH0gICAgIFxyXG5cclxuICAgIHZhciBmdW5jID0gZGF0YVt2YXJOYW1lXVxyXG4gICAgdmFyIHZhbHVlXHJcblxyXG4gICAgaWYgKHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdmFsdWUgPSBmdW5jLmNhbGwoZGF0YSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YWx1ZSA9IGdldFZhclZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Jvb2xlYW4nICYmIG5vdCkge1xyXG4gICAgICB2YWx1ZSA9ICF2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZVxyXG4gIH1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gc3BsaXRBdHRyKGF0dHJWYWx1ZSwgY2JrKSB7XHJcbiAgYXR0clZhbHVlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICBsZXQgW25hbWUsIHZhbHVlXSA9IGkuc3BsaXQoJzonKVxyXG4gICAgY2JrKG5hbWUudHJpbSgpLCB2YWx1ZS50cmltKCkpXHJcbiAgfSlcclxufVxyXG5cclxuXHJcbmNvbnN0IG1hcCA9IHtcclxuICAnYm4tZWFjaCc6IHt0eXBlOiAzfSxcclxuICAnYm4tdGV4dCc6IHtmOiAndGV4dCcsIHR5cGU6IDF9LFxyXG4gICdibi1odG1sJzoge2Y6ICdodG1sJywgdHlwZTogMX0sXHJcbiAgJ2JuLXZhbCc6IHtmOiAnc2V0VmFsdWUnLCB0eXBlOiAxfSxcclxuICAnYm4tc2hvdyc6IHtmOiAnc2V0VmlzaWJsZScsIHR5cGU6IDF9LFxyXG4gICdibi1zdHlsZSc6IHtmOiAnY3NzJywgdHlwZTogMn0sXHJcbiAgJ2JuLWF0dHInOiB7ZjogJ2F0dHInLCB0eXBlOiAyfSxcclxuICAnYm4tcHJvcCc6IHtmOiAncHJvcCcsIHR5cGU6IDJ9LFxyXG4gICdibi1kYXRhJzoge2Y6ICdzZXREYXRhJywgdHlwZTogMn0sXHJcbiAgJ2JuLWNsYXNzJzoge2Y6ICdzZXRDbGFzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1jb250cm9sJzoge3R5cGU6IDR9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoY3R4LCBkYXRhLCB2YXJzLCBleGNsdWRlRWx0KSB7XHJcblxyXG4gIC8vY29uc29sZS5sb2coJ1tiaW5kaW5nXSB1cGRhdGUnLCB2YXJzLCBkYXRhLCBleGNsdWRlRWx0KVxyXG5cclxuICBpZiAodHlwZW9mIHZhcnMgPT0gJ3N0cmluZycpIHtcclxuICAgIHZhcnMgPSB2YXJzLnNwbGl0KCcsJylcclxuICB9XHJcblxyXG4gIHZhcnMuZm9yRWFjaChmdW5jdGlvbih2YXJpYWJsZSkge1xyXG4gICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyaWFibGUpXHJcbiAgICBcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmICF2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgdXBkYXRlKGN0eCwgZGF0YSwgT2JqZWN0LmtleXModmFsdWUpLm1hcChpID0+IHZhcmlhYmxlICsgJy4nICsgaSksIGV4Y2x1ZGVFbHQpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoY3R4W3ZhcmlhYmxlXSkge1xyXG4gICAgICBjdHhbdmFyaWFibGVdLmZvckVhY2goZnVuY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHt0eXBlLCBmLCBlbHQsIG5hbWUsIHRlbXBsYXRlLCBpdGVyfSA9IGFjdGlvblxyXG4gICAgICAgIGlmIChlbHQgPT0gZXhjbHVkZUVsdCkge1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coJ3VwZGF0ZScsIHZhcmlhYmxlLCBmLCB2YWx1ZSlcclxuICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAyKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGUnLCB2YXJpYWJsZSwgZiwgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICB9ICAgXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMyAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICBlbHQuZW1wdHkoKVxyXG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICB2YXIgaXRlbURhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSlcclxuICAgICAgICAgICAgICBpdGVtRGF0YVtpdGVyXSA9IGl0ZW1cclxuICAgICAgICAgICAgICB2YXIgJGl0ZW0gPSB0ZW1wbGF0ZS5jbG9uZSgpXHJcbiAgICAgICAgICAgICAgcHJvY2VzcygkaXRlbSwgaXRlbURhdGEpXHJcbiAgICAgICAgICAgICAgZWx0LmFwcGVuZCgkaXRlbSkgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0V2ZW50cyhyb290LCBldmVudHMpIHtcclxuICByb290LmJuRmluZChgW2JuLWV2ZW50XWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICAgIGxldCBhdHRyVmFsdWUgPSBlbHQuYXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cignYm4tZXZlbnQnKVxyXG4gICAgICBcclxuICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24oZXZ0TmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBsZXQgZm4gID0gZXZlbnRzW3ZhbHVlXVxyXG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJykgeyAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBbbmFtZSwgc2VsZWN0b3JdID0gZXZ0TmFtZS5zcGxpdCgnLicpXHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdG9yICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgJy4nICsgc2VsZWN0b3IsIGZuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsdC5vbihuYW1lLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgIFxyXG4gICAgfSlcclxuICAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzcyhyb290LCBkYXRhLCBjcmVhdGVDb250cm9sLCB1cGRhdGVDYmspIHtcclxuXHJcbiAgXHJcbiAgaWYgKHJvb3QubGVuZ3RoID4gMSkge1xyXG4gICAgY29uc29sZS5lcnJvcignW2JpbmRpbmddIHByb2Nlc3MnLCByb290Lmxlbmd0aCwgZGF0YSlcclxuICB9XHJcblxyXG4gIGxldCBjdHggPSB7fVxyXG4gIFxyXG4gIGZvcihsZXQgZGlyIGluIG1hcCkge1xyXG4gICAgXHJcblxyXG4gICAgcm9vdC5ibkZpbmQoYFske2Rpcn1dYCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGVsdCA9ICQodGhpcylcclxuICAgICAgbGV0IGF0dHJWYWx1ZSA9IGVsdC5hdHRyKGRpcilcclxuICAgICAgZWx0LnJlbW92ZUF0dHIoZGlyKVxyXG5cclxuICAgICAgbGV0IHt0eXBlLCBmfSA9IG1hcFtkaXJdXHJcbiAgICAgIFxyXG4gICAgICBpZiAodHlwZSA9PSAxKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIGF0dHJWYWx1ZSlcclxuICAgICAgICAgIC8vZWx0LnRleHQoZGF0YVthdHRyVmFsdWVdKVxyXG4gICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCB2YWx1ZSlcclxuICAgICAgICB9IFxyXG4gICAgICAgIGlmIChkaXIgPT0gJ2JuLXZhbCcpIHtcclxuICAgICAgICAgIGxldCB1cGRhdGVFdnQgPSBlbHQuYXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgIGlmICh1cGRhdGVFdnQpIHtcclxuICAgICAgICAgICAgZWx0LnJlbW92ZUF0dHIoJ2JuLXVwZGF0ZScpXHJcbiAgICAgICAgICAgIGVsdC5vbih1cGRhdGVFdnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1tiaW5kaW5nXSB1cGRhdGVFdnQnLCB1cGRhdGVFdnQsIGVsdClcclxuICAgICAgICAgICAgICB1cGRhdGVDYmsoYXR0clZhbHVlLCBlbHQuZ2V0VmFsdWUoKSwgZWx0KVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0gPSBjdHhbYXR0clZhbHVlXSB8fCBbXVxyXG4gICAgICAgIGN0eFthdHRyVmFsdWVdLnB1c2goe2YsIGVsdCwgdHlwZX0pICAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGUgPT0gNCAmJiB0eXBlb2YgY3JlYXRlQ29udHJvbCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY3JlYXRlQ29udHJvbChhdHRyVmFsdWUsIGVsdClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGUgPT0gMikge1xyXG5cclxuICAgICAgICAgIHNwbGl0QXR0cihhdHRyVmFsdWUsIGZ1bmN0aW9uKG5hbWUsIHZhck5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdID0gY3R4W3Zhck5hbWVdIHx8IFtdXHJcbiAgICAgICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtmLCBlbHQsIHR5cGUsIG5hbWV9KSAgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMykge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGVsdC5jaGlsZHJlbigpLnJlbW92ZSgpLmNsb25lKClcclxuICAgICAgICBsZXQgW2l0ZXIsICwgdmFyTmFtZV0gPSBhdHRyVmFsdWUuc3BsaXQoJyAnKVxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4W3Zhck5hbWVdID0gY3R4W3Zhck5hbWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2VsdCwgdHlwZSwgdGVtcGxhdGUsIGl0ZXJ9KSAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGRhdGEgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgdmFyIGl0ZW1EYXRhID0gJC5leHRlbmQoe30sIGRhdGEpXHJcbiAgICAgICAgICAgaXRlbURhdGFbaXRlcl0gPSBpdGVtXHJcbiAgICAgICAgICAgdmFyICRpdGVtID0gdGVtcGxhdGUuY2xvbmUoKVxyXG4gICAgICAgICAgIHByb2Nlc3MoJGl0ZW0sIGl0ZW1EYXRhLCBjcmVhdGVDb250cm9sKVxyXG4gICAgICAgICAgIGVsdC5hcHBlbmQoJGl0ZW0pICAgICAgICAgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgXHJcbiAgXHJcbiAgfVxyXG4gIFxyXG5cclxuICByZXR1cm4gY3R4XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NCaW5kaW5ncyhyb290KSB7XHJcblxyXG4gIHZhciBkYXRhID0ge31cclxuXHJcbiAgcm9vdC5ibkZpbmQoYFtibi1iaW5kXWApLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgbGV0IGF0dHJWYWx1ZSA9IGVsdC5hdHRyKCdibi1iaW5kJylcclxuICAgIGVsdC5yZW1vdmVBdHRyKCdibi1iaW5kJylcclxuICAgIGRhdGFbYXR0clZhbHVlXSA9IGVsdFxyXG4gIH0pXHJcblxyXG4gIHJvb3QuYm5GaW5kKGBbYm4taWZhY2VdYCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIGxldCBlbHQgPSAkKHRoaXMpXHJcbiAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoJ2JuLWlmYWNlJylcclxuICAgIGVsdC5yZW1vdmVBdHRyKCdibi1pZmFjZScpXHJcbiAgICBkYXRhW2F0dHJWYWx1ZV0gPSBlbHQuaWZhY2UoKVxyXG4gIH0pXHJcblxyXG4gIHJldHVybiBkYXRhXHJcbiAgXHJcbn1cclxuXHJcbiQkLmJpbmRpbmcgPSB7XHJcbiAgcHJvY2VzcyxcclxuICB1cGRhdGUsXHJcbiAgcHJvY2Vzc0V2ZW50cyxcclxuICBwcm9jZXNzQmluZGluZ3NcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5sZXQgY29udHJvbHMgPSB7fVxyXG5cclxuZnVuY3Rpb24gaXNEZXBzT2soZGVwcykge1xyXG5cdHJldHVybiBkZXBzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcclxuXHJcblx0XHRyZXR1cm4gcHJldiAmJiAoY3VyICE9IHVuZGVmaW5lZClcclxuXHR9LCB0cnVlKVx0XHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbChuYW1lLCBvcHRpb25zKSB7XHJcblx0aWYgKCEkJC51dGlsLmNoZWNrVHlwZShvcHRpb25zLCB7XHJcblx0XHQkZGVwczogWydzdHJpbmcnXSxcclxuXHRcdGluaXQ6ICdmdW5jdGlvbidcclxuXHR9KSkge1xyXG5cdFx0Y29uc29sZS5lcnJvcihgW0NvcmVdIHJlZ2lzdGVyQ29udHJvbDogYmFkIG9wdGlvbnNgLCBvcHRpb25zKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHJcblx0dmFyIGRlcHMgPSBvcHRpb25zLmRlcHMgfHwgW11cclxuXHJcblx0Y29uc29sZS5sb2coYFtDb3JlXSByZWdpc3RlciBjb250cm9sICcke25hbWV9JyB3aXRoIGRlcHNgLCBkZXBzKVxyXG5cclxuXHRjb250cm9sc1tuYW1lXSA9IHtkZXBzLCBvcHRpb25zLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDb250cm9sKG5hbWUpIHtcclxuXHR2YXIgcmV0ID0gY29udHJvbHNbbmFtZV1cclxuXHRpZiAocmV0ICYmIHJldC5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdHJldC5kZXBzID0gJCQuc2VydmljZS5nZXRTZXJ2aWNlcyhyZXQuZGVwcylcclxuXHRcdHJldC5zdGF0dXMgPSBpc0RlcHNPayhyZXQuZGVwcykgPyAnb2snIDogJ2tvJ1xyXG5cdH1cclxuXHRyZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2woY29udHJvbE5hbWUsIGVsdCkge1xyXG5cdGVsdC5hZGRDbGFzcyhjb250cm9sTmFtZS5yZXBsYWNlKCcuJywgJy0nKSlcclxuXHRlbHQuYWRkQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKS51bmlxdWVJZCgpXHRcclxuXHR2YXIgY3RybCA9IGdldENvbnRyb2woY29udHJvbE5hbWUpXHJcblx0XHRcclxuXHRpZiAoY3RybCA9PSB1bmRlZmluZWQpIHtcclxuXHRcdHRocm93KGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKCdjcmVhdGVDb250cm9sJywgY29udHJvbE5hbWUsIGN0cmwpXHJcblx0aWYgKGN0cmwuc3RhdHVzID09PSAgJ29rJykge1xyXG5cdFx0XHJcblx0XHR2YXIgaWZhY2UgPSB7XHJcblx0XHRcdHByb3BzOiB7fSxcclxuXHRcdFx0bmFtZTogY29udHJvbE5hbWVcclxuXHRcdH1cclxuXHJcblx0XHRsZXQge2luaXQsIHByb3BzLCB0ZW1wbGF0ZX0gPSBjdHJsLm9wdGlvbnNcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge31cclxuXHJcblx0XHRPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wTmFtZSkge1xyXG5cdFx0XHRpZmFjZS5wcm9wc1twcm9wTmFtZV0gPSBlbHQuZGF0YShwcm9wTmFtZSkgfHwgcHJvcHNbcHJvcE5hbWVdXHJcblx0XHR9KVxyXG5cclxuXHRcdGlmICh0eXBlb2YgdGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0JCh0ZW1wbGF0ZSkuYXBwZW5kVG8oZWx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG5cdFx0XHR0ZW1wbGF0ZS5jaGlsZHJlbigpLmNsb25lKCkuYXBwZW5kVG8oZWx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0eXBlb2YgaW5pdCA9PSAnZnVuY3Rpb24nKSB7XHJcblxyXG5cdFx0XHR2YXIgYXJncyA9IFtlbHRdLmNvbmNhdChjdHJsLmRlcHMpXHJcblx0XHRcdGluaXQuYXBwbHkoaWZhY2UsIGFyZ3MpXHJcblx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2UgY29udHJvbCAnJHtjb250cm9sTmFtZX0nIHdpdGggcHJvcHNgLCBpZmFjZS5wcm9wcylcclxuXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIG1pc3NpbmcgaW5pdCBmdW5jdGlvbmApXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGVsdC5nZXQoMCkuY3RybCA9IGlmYWNlXHJcblx0XHRcclxuXHRcdHJldHVybiBpZmFjZVx0XHRcdFx0XHJcblx0fVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4kJC5jb250cm9sID0ge1xyXG5cdHJlZ2lzdGVyQ29udHJvbCxcclxuXHRjcmVhdGVDb250cm9sXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIiQkLmRpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGRpdilcclxuXHR9XHRcclxuXHJcblx0dmFyIGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihkaXYsIG9wdGlvbnMpXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHRcclxuXHR9LCBvcHRpb25zKVxyXG5cclxuXHR2YXIgcHJpdmF0ZSA9IHt9XHJcblxyXG5cdC8vY29uc29sZS5sb2coJ2RsZ09wdGlvbnMnLCBkbGdPcHRpb25zKVxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cdGN0cmwuc2hvdyA9IGZ1bmN0aW9uKG9uQXBwbHkpIHtcclxuXHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcclxuXHRcdGRpdi5kaWFsb2coJ29wZW4nKVxyXG5cdH1cclxuXHJcblx0Y3RybC5oaWRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdjbG9zZScpXHJcblx0fVxyXG5cclxuXHRjdHJsLmFwcGx5ID0gZnVuY3Rpb24ocmV0VmFsdWUpIHtcclxuXHRcdGN0cmwuaGlkZSgpXHJcblx0XHRpZiAodHlwZW9mIHByaXZhdGUub25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHByaXZhdGUub25BcHBseShyZXRWYWx1ZSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGN0cmwuc2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uTmFtZSwgdmFsdWUpIHtcclxuXHRcdGRpdi5kaWFsb2coJ29wdGlvbicsIG9wdGlvbk5hbWUsIHZhbHVlKVxyXG5cdH1cclxuXHJcblx0Y3RybC5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdkZXN0cm95JylcclxuXHR9XHJcblxyXG5cdHJldHVybiBjdHJsXHJcbn07XHJcbiIsIiQkLmZvcm1EaWFsb2dDb250cm9sbGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBkaXYgPSAkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZSB8fCAnRGlhbG9nJ30pXHJcblxyXG5cdHZhciBwcml2YXRlID0ge31cclxuXHJcblx0dmFyIGZvcm0gPSAkKCc8Zm9ybT4nKVxyXG5cdFx0LmFwcGVuZFRvKGRpdilcclxuXHRcdC5vbignc3VibWl0JywgZnVuY3Rpb24oZXYpIHtcclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRkaXYuZGlhbG9nKCdjbG9zZScpXHJcblx0XHRcdGlmICh0eXBlb2YgcHJpdmF0ZS5vbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRwcml2YXRlLm9uQXBwbHkoJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxyXG5cdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcclxuXHRcdFx0fVx0XHRcdFx0XHJcblx0XHR9KVxyXG5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdCQob3B0aW9ucy50ZW1wbGF0ZSkuYXBwZW5kVG8oZm9ybSlcclxuXHR9XHRcclxuXHJcblx0aWYgKG9wdGlvbnMudGVtcGxhdGUgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuXHRcdG9wdGlvbnMudGVtcGxhdGUuY2hpbGRyZW4oKS5jbG9uZSgpLmFwcGVuZFRvKGZvcm0pXHJcblx0fVxyXG5cclxuXHR2YXIgc3VibWl0QnRuID0gJCgnPGlucHV0PicsIHt0eXBlOiAnc3VibWl0JywgaGlkZGVuOiB0cnVlfSkuYXBwZW5kVG8oZm9ybSlcclxuXHJcblx0dmFyIGRsZ09wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRhdXRvT3BlbjogZmFsc2UsXHJcblx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdHdpZHRoOiAnYXV0bycsXHRcclxuXHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0J0NhbmNlbCc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXHJcblx0XHRcdH0sXHJcblx0XHRcdCdBcHBseSc6IGZ1bmN0aW9uKCkge1x0XHRcdFx0XHRcclxuXHRcdFx0XHRzdWJtaXRCdG4uY2xpY2soKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwgb3B0aW9ucylcclxuXHJcblxyXG5cdGRpdi5kaWFsb2coZGxnT3B0aW9ucylcclxuXHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRzaG93OiBmdW5jdGlvbihvbkFwcGx5KSB7XHJcblx0XHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcdFx0XHRcclxuXHRcdFx0ZGl2LmRpYWxvZygnb3BlbicpXHRcdFx0XHJcblx0XHR9LFxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRmb3JtLnNldEZvcm1EYXRhKGRhdGEpXHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9LFxyXG5cclxuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkaXYuZGlhbG9nKCdkZXN0cm95JylcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuXHJcbiQuZm4uYm5GaW5kPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgcmV0dXJuIHRoaXMuZmluZChzZWxlY3RvcikuYWRkKHRoaXMuZmlsdGVyKHNlbGVjdG9yKSlcclxufVxyXG5cclxuJC5mbi5zZXRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaXNBY3RpdmUpIHtcclxuICAgIGlmIChpc0FjdGl2ZSkge1xyXG4gICAgICB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSlcclxuICAgIH1cclxufVxyXG5cclxuJC5mbi5zZXRWaXNpYmxlID0gZnVuY3Rpb24oaXNWaXNpYmxlKSB7XHJcbiAgICBpZiAoaXNWaXNpYmxlKSB7XHJcbiAgICAgIHRoaXMuc2hvdygpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlKClcclxuICAgIH1cclxufVxyXG5cclxuJC5mbi5pZmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmdldCgwKS5jdHJsXHJcbn1cclxuXHJcbiQuZm4uc2V0RGF0YSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuXHJcbiAgY29uc3QgZnVuY05hbWUgPSAnc2V0JyArIG5hbWUuc3Vic3RyKDAsMSkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpXHJcbiAgLy9jb25zb2xlLmxvZygnZnVuY05hbWUnLCBmdW5jTmFtZSlcclxuXHJcbiAgaWYgKGlmYWNlICYmIGlmYWNlLnByb3BzW25hbWVdICYmIHR5cGVvZiBpZmFjZVtmdW5jTmFtZV0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWZhY2VbZnVuY05hbWVdKHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIGlmIChpZmFjZSAmJiAkJC5pc1ZpZXdDb250cm9sbGVyKGlmYWNlLmN0cmwpICYmIGlmYWNlLmN0cmwubW9kZWxbbmFtZV0pIHtcclxuICAgIGlmYWNlLmN0cmwuc2V0RGF0YShuYW1lLCB2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmRhdGEobmFtZSwgdmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHRoaXMuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpIHtcclxuICAgIHRoaXMucHJvcCgnY2hlY2tlZCcsIHZhbHVlKVxyXG4gICAgcmV0dXJuXHJcbiAgfSAgXHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5zZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZS5zZXRWYWx1ZSh2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLnZhbCh2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICBjb25zdCB0eXBlID0gdGhpcy5hdHRyKCd0eXBlJylcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcCgnY2hlY2tlZCcpXHJcbiAgfSAgICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2UuZ2V0VmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIGlmYWNlLmdldFZhbHVlKClcclxuICB9XHJcbiAgdmFyIHJldCA9IHRoaXMudmFsKClcclxuXHJcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAncmFuZ2UnKSB7XHJcbiAgICByZXQgPSBwYXJzZUZsb2F0KHJldClcclxuICB9XHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLmdldEZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJldCA9IHt9XHJcbiAgdGhpcy5maW5kKCdbbmFtZV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGVsdCA9ICQodGhpcylcclxuICAgIHZhciBuYW1lID0gZWx0LmF0dHIoJ25hbWUnKVxyXG4gICAgcmV0W25hbWVdID0gZWx0LmdldFZhbHVlKClcclxuXHJcbiAgfSlcclxuXHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLnJlc2V0Rm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09IFwiRk9STVwiKSB7XHJcbiAgICB0aGlzLmdldCgwKS5yZXNldCgpXHJcbiAgfSAgIFxyXG59XHJcblxyXG4kLmZuLnNldEZvcm1EYXRhID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCdzZXRGb3JtRGF0YScsIGRhdGEpXHJcbiAgdGhpcy5yZXNldEZvcm0oKVxyXG5cclxuICBmb3IodmFyIG5hbWUgaW4gZGF0YSkge1xyXG4gICAgdmFyIHZhbHVlID0gZGF0YVtuYW1lXVxyXG4gICAgdmFyIGVsdCA9IHRoaXMuZmluZChgW25hbWU9JHtuYW1lfV1gKVxyXG4gICAgaWYgKGVsdC5sZW5ndGgpIHtcclxuICAgICAgZWx0LnNldFZhbHVlKHZhbHVlKSAgICAgICBcclxuICAgIH1cclxuXHJcbiAgXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG4kLmZuLnNhZmVFbXB0eSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuZmluZCgnLkN1c3RvbUNvbnRyb2wnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgaWZhY2UgPSAkKHRoaXMpLmlmYWNlKClcclxuXHJcbiAgICBpZiAodHlwZW9mIGlmYWNlLmRpc3Bvc2UgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBpZmFjZS5kaXNwb3NlKClcclxuICAgIH1cclxuICB9KVxyXG5cclxuICB0aGlzLmVtcHR5KClcclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuJC5mbi5hZGRDb250cm9sID0gZnVuY3Rpb24oY3RybE5hbWUpIHtcclxuICB2YXIgbmV3Q3RybCA9ICQoJzxkaXY+JylcclxuICAkJC5jb250cm9sLmNyZWF0ZUNvbnRyb2woY3RybE5hbWUsIG5ld0N0cmwpXHJcbiAgdGhpcy5hcHBlbmQobmV3Q3RybCkgXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiXHJcbihmdW5jdGlvbigpe1xyXG5cclxubGV0IHNlcnZpY2VzID0ge31cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNlcnZpY2VzKGRlcHMpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0U2VydmljZXMnLCBkZXBzKVxyXG5cdHJldHVybiBkZXBzLm1hcChmdW5jdGlvbihkZXBOYW1lKSB7XHJcblx0XHR2YXIgc3J2ID0gc2VydmljZXNbZGVwTmFtZV1cclxuXHRcdGlmIChzcnYpIHtcclxuXHRcdFx0aWYgKHNydi5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdFx0XHR2YXIgZGVwczIgPSBnZXRTZXJ2aWNlcyhzcnYuZGVwcylcclxuXHRcdFx0XHR2YXIgY29uZmlnID0gc3J2LmNvbmZpZyB8fCB7fVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2Ugc2VydmljZSAnJHtkZXBOYW1lfScgd2l0aCBjb25maWdgLCBjb25maWcpXHJcblx0XHRcdFx0dmFyIGFyZ3MgPSBbY29uZmlnXS5jb25jYXQoZGVwczIpXHJcblx0XHRcdFx0c3J2Lm9iaiA9IHNydi5mbi5hcHBseShudWxsLCBhcmdzKVxyXG5cdFx0XHRcdHNydi5zdGF0dXMgPSAncmVhZHknXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHNydi5vYmpcdFx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vc3J2LnN0YXR1cyA9ICdub3RyZWdpc3RlcmVkJ1xyXG5cdFx0XHR0aHJvdyhgW0NvcmVdIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHRcdH1cclxuXHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBjb25maWd1cmVTZXJ2aWNlKG5hbWUsIGNvbmZpZykge1xyXG5cdGNvbnNvbGUubG9nKCdbQ29yZV0gY29uZmlndXJlU2VydmljZScsIG5hbWUsIGNvbmZpZylcclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGNvbmZpZyAhPSAnb2JqZWN0Jykge1xyXG5cdFx0Y29uc29sZS53YXJuKCdbQ29yZV0gY29uZmlndXJlU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHRcdHJldHVyblxyXG5cdH0gXHRcclxuXHJcblx0dmFyIHNydiA9IHNlcnZpY2VzW25hbWVdXHJcblx0aWYgKHNydikge1xyXG5cdFx0c3J2LmNvbmZpZyA9IGNvbmZpZ1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRocm93KGBbY29uZmlndXJlU2VydmljZV0gc2VydmljZSAnJHtuYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZShuYW1lLCBhcmcxLCBhcmcyKSB7XHJcblx0dmFyIGRlcHMgPSBbXVxyXG5cdHZhciBmbiA9IGFyZzFcclxuXHRpZiAoQXJyYXkuaXNBcnJheShhcmcxKSkge1xyXG5cdFx0ZGVwcyA9IGFyZzFcclxuXHRcdGZuID0gYXJnMlxyXG5cdH1cclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGZuID09ICd1bmRlZmluZWQnIHx8ICFBcnJheS5pc0FycmF5KGRlcHMpKSB7XHJcblx0XHR0aHJvdygnW0NvcmVdIHJlZ2lzdGVyU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHR9IFxyXG5cdGNvbnNvbGUubG9nKGBbQ29yZV0gcmVnaXN0ZXIgc2VydmljZSAnJHtuYW1lfScgd2l0aCBkZXBzYCwgZGVwcylcclxuXHJcblx0c2VydmljZXNbbmFtZV0gPSB7ZGVwcywgZm4sIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbiQkLnNlcnZpY2UgPSB7XHJcblx0cmVnaXN0ZXJTZXJ2aWNlLFxyXG5cdGNvbmZpZ3VyZVNlcnZpY2UsXHJcblx0Z2V0U2VydmljZXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XG5cbmZ1bmN0aW9uIHNob3dBbGVydChvcHRpb25zLCBjYWxsYmFjaykge1xuXG5cdG9wdGlvbnMgPSAkLmV4dGVuZCh7XG5cdFx0dGl0bGU6ICdBbGVydCcsXG5cdFx0Y29udGVudDogJycsXG5cdFx0c2hvd0NhbmNlbDogZmFsc2Vcblx0fSwgb3B0aW9ucylcblxuXHRvcHRpb25zLm1vZGVsID0gdHJ1ZVxuXHRvcHRpb25zLmNsb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS5kaWFsb2coJ2Rlc3Ryb3knKVxuXHR9XG5cdG9wdGlvbnMuYnV0dG9ucyA9IHtcblx0XHQnT0snOiBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRpZiAob3B0aW9ucy5zaG93Q2FuY2VsKSB7XG5cdFx0b3B0aW9ucy5idXR0b25zWydDYW5jZWwnXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5kaWFsb2coJ2Nsb3NlJylcblx0XHR9XG5cdH1cblxuXHQkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZX0pXG5cdFx0LmFwcGVuZCgkKCc8cD4nKS5odG1sKG9wdGlvbnMuY29udGVudCkpXG5cdFx0LmRpYWxvZyhvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzaG93Q29uZmlybShvcHRpb25zLCBjYWxsYmFjaykge1xuXHRvcHRpb25zLnNob3dDYW5jZWwgPSB0cnVlXG5cdHNob3dBbGVydChvcHRpb25zLCBjYWxsYmFjaylcbn1cblxuZnVuY3Rpb24gc2hvd1Byb21wdChvcHRpb25zLCBjYWxsYmFjaykge1xuXG5cdGNvbnN0IGxhYmVsID0gb3B0aW9ucy5sYWJlbCB8fCAnJ1xuXG5cdG9wdGlvbnMudGVtcGxhdGUgPSBgXG5cdDxwPiR7bGFiZWx9PC9wPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZD1cIlwiIG5hbWU9XCJ2YWx1ZVwiPlxuXHRgXG5cblx0b3B0aW9ucy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuZGlhbG9nKCdkZXN0cm95Jylcblx0fVxuXG5cdCQkLmZvcm1EaWFsb2dDb250cm9sbGVyKG9wdGlvbnMpXG5cdC5zaG93KGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNhbGxiYWNrKGRhdGEudmFsdWUpXG5cdFx0fVxuXHR9KVxufVxuXG4kJC51aSA9IHtcblx0c2hvd0FsZXJ0LFxuXHRzaG93Q29uZmlybSxcblx0c2hvd1Byb21wdFxufVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcblxyXG5mdW5jdGlvbiByZWFkVGV4dEZpbGUoZmlsZU5hbWUsIG9uUmVhZCkge1xyXG5cdHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG5cclxuXHRmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBvblJlYWQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRvblJlYWQoZmlsZVJlYWRlci5yZXN1bHQpXHJcblx0XHR9XHJcblx0fVxyXG5cdGZpbGVSZWFkZXIucmVhZEFzVGV4dChmaWxlTmFtZSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlYWRGaWxlQXNEYXRhVVJMKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG52YXIgaW5wdXRGaWxlID0gJCgnPGlucHV0PicsIHt0eXBlOiAnZmlsZSd9KS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcblx0dmFyIG9uQXBwbHkgPSAkKHRoaXMpLmRhdGEoJ29uQXBwbHknKVxyXG5cdHZhciBmaWxlTmFtZSA9IHRoaXMuZmlsZXNbMF1cclxuXHRpZiAodHlwZW9mIG9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0b25BcHBseShmaWxlTmFtZSlcclxuXHR9XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBvcGVuRmlsZURpYWxvZyhvbkFwcGx5KSB7XHJcblx0aW5wdXRGaWxlLmRhdGEoJ29uQXBwbHknLCBvbkFwcGx5KVxyXG5cdGlucHV0RmlsZS5jbGljaygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSW1hZ2UoZmlsZU5hbWUpIHtcclxuXHRyZXR1cm4gKC9cXC4oZ2lmfGpwZ3xqcGVnfHBuZykkL2kpLnRlc3QoZmlsZU5hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGFVUkx0b0Jsb2IoZGF0YVVSTCkge1xyXG4gIC8vIERlY29kZSB0aGUgZGF0YVVSTFxyXG4gIGNvbnN0IFsgLCBtaW1lVHlwZSwgZW5jb2RhZ2UsIGRhdGFdID0gZGF0YVVSTC5zcGxpdCgvWzosO10vKVxyXG4gIGlmIChlbmNvZGFnZSAhPSAnYmFzZTY0Jykge1xyXG4gIFx0cmV0dXJuXHJcbiAgfVxyXG5cclxuICAvL2NvbnNvbGUubG9nKCdtaW1lVHlwZScsIG1pbWVUeXBlKVxyXG4gIC8vY29uc29sZS5sb2coJ2VuY29kYWdlJywgZW5jb2RhZ2UpXHJcbiAgLy9jb25zb2xlLmxvZygnZGF0YScsIGRhdGEpXHJcblxyXG4gIHZhciBiaW5hcnkgPSBhdG9iKGRhdGEpXHJcbiAvLyBDcmVhdGUgOC1iaXQgdW5zaWduZWQgYXJyYXlcclxuICB2YXIgYXJyYXkgPSBbXVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICBcdGFycmF5LnB1c2goYmluYXJ5LmNoYXJDb2RlQXQoaSkpXHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gb3VyIEJsb2Igb2JqZWN0XHJcblx0cmV0dXJuIG5ldyBCbG9iKFsgbmV3IFVpbnQ4QXJyYXkoYXJyYXkpIF0sIHttaW1lVHlwZX0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdHlsZShzdHlsZUZpbGVQYXRoLCBjYWxsYmFjaykge1x0XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGxvYWRTdHlsZScsIHN0eWxlRmlsZVBhdGgpXHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY3NzT2sgPSAkKCdoZWFkJykuZmluZChgbGlua1tocmVmPVwiJHtzdHlsZUZpbGVQYXRofVwiXWApLmxlbmd0aFxyXG5cdFx0aWYgKGNzc09rICE9IDEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYGxvYWRpbmcgJyR7c3R5bGVGaWxlUGF0aH0nIHN0eWxlYClcclxuXHRcdFx0JCgnPGxpbms+Jywge2hyZWY6IHN0eWxlRmlsZVBhdGgsIHJlbDogJ3N0eWxlc2hlZXQnfSlcclxuXHRcdFx0Lm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCcke3N0eWxlRmlsZVBhdGh9JyBsb2FkZWRgKVxyXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmFwcGVuZFRvKCQoJ2hlYWQnKSlcclxuXHRcdH1cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcblx0XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KGEpIHtcclxuXHRyZXR1cm4gKHR5cGVvZiBhID09ICdvYmplY3QnKSAmJiAhQXJyYXkuaXNBcnJheShhKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1R5cGUodmFsdWUsIHR5cGUsIGlzT3B0aW9uYWwpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdjaGVja1R5cGUnLHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKVxyXG5cdGlmICh0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgJiYgaXNPcHRpb25hbCA9PT0gdHJ1ZSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdHlwZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSB0eXBlXHJcblx0fVxyXG5cclxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdGlmICghQXJyYXkuaXNBcnJheSh0eXBlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZSAvLyBubyBpdGVtIHR5cGUgY2hlY2tpbmdcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiB2YWx1ZSkge1xyXG5cdFx0XHR2YXIgcmV0ID0gZmFsc2VcclxuXHRcdFx0Zm9yKGxldCB0IG9mIHR5cGUpIHtcclxuXHRcdFx0XHRyZXQgfD0gY2hlY2tUeXBlKGksIHQpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFyZXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoaXNPYmplY3QodHlwZSkpIHtcclxuXHRcdGlmICghaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBmIGluIHR5cGUpIHtcclxuXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2YnLCBmLCAndmFsdWUnLCB2YWx1ZSlcclxuXHRcdFx0dmFyIG5ld1R5cGUgPSB0eXBlW2ZdXHJcblxyXG5cdFx0XHR2YXIgaXNPcHRpb25hbCA9IGZhbHNlXHJcblx0XHRcdGlmIChmLnN0YXJ0c1dpdGgoJyQnKSkge1xyXG5cdFx0XHRcdGYgPSBmLnN1YnN0cigxKVxyXG5cdFx0XHRcdGlzT3B0aW9uYWwgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFjaGVja1R5cGUodmFsdWVbZl0sIG5ld1R5cGUsIGlzT3B0aW9uYWwpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlXHJcbn1cdFxyXG5cclxuXHJcblxyXG4kJC51dGlsID0ge1xyXG5cdHJlYWRUZXh0RmlsZSxcclxuXHRyZWFkRmlsZUFzRGF0YVVSTCxcclxuXHRvcGVuRmlsZURpYWxvZyxcclxuXHRpc0ltYWdlLFxyXG5cdGRhdGFVUkx0b0Jsb2IsXHJcblx0bG9hZFN0eWxlLFxyXG5cdGNoZWNrVHlwZVxyXG59XHJcblxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5jbGFzcyBWaWV3Q29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG9wdGlvbnMpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnVmlld0NvbnRyb2xsZXInLCBvcHRpb25zKVxyXG4gICAgXHRpZiAodHlwZW9mIGVsdCA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGVsdCA9ICQoZWx0KVxyXG4gICAgXHR9XHJcblxyXG4gICAgICAgIGlmIChlbHQuaGFzQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKSkge1xyXG4gICAgICAgICAgICBlbHQgPSBlbHQuY2hpbGRyZW4oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICBcdG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucylcclxuICAgICAgICB0aGlzLmVsdCA9IGVsdFxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMubW9kZWwgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5kYXRhKVxyXG4gICAgICAgIHRoaXMucnVsZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5ydWxlcylcclxuICAgICAgICB0aGlzLndhdGNoZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy53YXRjaGVzKVxyXG5cclxuICAgICAgICAvLyBnZW5lcmF0ZSBhdXRvbWF0aWMgcnVsZXMgZm9yIGNvbXB1dGVkIGRhdGEgKGFrYSBmdW5jdGlvbilcclxuICAgICAgICBmb3IodmFyIGsgaW4gdGhpcy5tb2RlbCkge1xyXG4gICAgICAgIFx0dmFyIGRhdGEgPSB0aGlzLm1vZGVsW2tdXHJcbiAgICAgICAgXHRpZiAodHlwZW9mIGRhdGEgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIFx0XHR2YXIgZnVuY1RleHQgPSBkYXRhLnRvU3RyaW5nKClcclxuICAgICAgICBcdFx0Ly9jb25zb2xlLmxvZygnZnVuY1RleHQnLCBmdW5jVGV4dClcclxuICAgICAgICBcdFx0dmFyIHJ1bGVzID0gW11cclxuICAgICAgICBcdFx0ZnVuY1RleHQucmVwbGFjZSgvdGhpcy4oW2EtekEtWjAtOV8tXXsxLH0pL2csIGZ1bmN0aW9uKG1hdGNoLCBjYXB0dXJlT25lKSB7XHJcbiAgICAgICAgXHRcdFx0Ly9jb25zb2xlLmxvZygnY2FwdHVyZU9uZScsIGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdFx0cnVsZXMucHVzaChjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHR9KVxyXG4gICAgICAgIFx0XHR0aGlzLnJ1bGVzW2tdID0gcnVsZXMudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVsZXMnLCB0aGlzLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gJCQuYmluZGluZy5wcm9jZXNzKGVsdCwgdGhpcy5tb2RlbCwgJCQuY29udHJvbC5jcmVhdGVDb250cm9sLCBcclxuICAgICAgICAgICAgKG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHVwZGF0ZUNiaycsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhKG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5ldmVudHMgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgJCQuYmluZGluZy5wcm9jZXNzRXZlbnRzKGVsdCwgb3B0aW9ucy5ldmVudHMpXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zY29wZSA9ICQkLmJpbmRpbmcucHJvY2Vzc0JpbmRpbmdzKGVsdClcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2NvcGUnLCB0aGlzLnNjb3BlKVxyXG4gICAgICAgXHJcblxyXG4gICAgfSBcclxuXHJcbiAgICBzZXREYXRhKGFyZzEsIGFyZzIsIGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBhcmcxLCBhcmcyLCBleGNsdWRlRWx0KVxyXG4gICAgICAgIHZhciBkYXRhID0gYXJnMVxyXG4gICAgICAgIGlmICh0eXBlb2YgYXJnMSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIFx0ZGF0YSA9IHt9XHJcbiAgICAgICAgXHRkYXRhW2FyZzFdID0gYXJnMlxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBkYXRhKVxyXG4gICAgICAgICQuZXh0ZW5kKHRoaXMubW9kZWwsIGRhdGEpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbW9kZWwnLCB0aGlzLm1vZGVsKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKE9iamVjdC5rZXlzKGRhdGEpLCBleGNsdWRlRWx0KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShmaWVsZHNOYW1lLCBleGNsdWRlRWx0KSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gdXBkYXRlJywgZmllbGRzTmFtZSwgZXhjbHVkZUVsdClcclxuICAgIFx0aWYgKHR5cGVvZiBmaWVsZHNOYW1lID09ICdzdHJpbmcnKSB7XHJcbiAgICBcdFx0ZmllbGRzTmFtZSA9IGZpZWxkc05hbWUuc3BsaXQoJywnKVxyXG4gICAgXHR9XHJcblxyXG5cclxuICAgIFx0aWYgKEFycmF5LmlzQXJyYXkoZmllbGRzTmFtZSkpIHtcclxuICAgIFx0XHR2YXIgZmllbGRzU2V0ID0ge31cclxuICAgIFx0XHRmaWVsZHNOYW1lLmZvckVhY2goKGZpZWxkKSA9PiB7XHJcblxyXG4gICAgXHRcdFx0dmFyIHdhdGNoID0gdGhpcy53YXRjaGVzW2ZpZWxkXVxyXG4gICAgXHRcdFx0aWYgKHR5cGVvZiB3YXRjaCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBcdFx0XHRcdHdhdGNoLmNhbGwobnVsbCwgdGhpcy5tb2RlbFtmaWVsZF0pXHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0XHRmaWVsZHNTZXRbZmllbGRdID0gMVxyXG5cclxuICAgIFx0XHRcdGZvcih2YXIgcnVsZSBpbiB0aGlzLnJ1bGVzKSB7XHJcbiAgICBcdFx0XHRcdGlmICh0aGlzLnJ1bGVzW3J1bGVdLnNwbGl0KCcsJykuaW5kZXhPZihmaWVsZCkgIT0gLTEpIHtcclxuICAgIFx0XHRcdFx0XHRmaWVsZHNTZXRbcnVsZV0gPSAxXHJcbiAgICBcdFx0XHRcdH1cclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHR9KVxyXG5cclxuXHJcbiAgICBcdFx0JCQuYmluZGluZy51cGRhdGUodGhpcy5jdHgsIHRoaXMubW9kZWwsIE9iamVjdC5rZXlzKGZpZWxkc1NldCksIGV4Y2x1ZGVFbHQpXHJcbiAgICBcdH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiQkLnZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24oZWx0LCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFZpZXdDb250cm9sbGVyKGVsdCwgb3B0aW9ucylcclxufVxyXG5cclxuJCQuaXNWaWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIHJldHVybiBvIGluc3RhbmNlb2YgVmlld0NvbnRyb2xsZXJcclxufVxyXG5cclxufSkoKTtcclxuIiwiXG4kJC5zZXJ2aWNlLnJlZ2lzdGVyU2VydmljZSgnYnJhaW5qcy5odHRwJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0Z2V0KHVybCkge1xuXHRcdFx0cmV0dXJuICQuZ2V0SlNPTih1cmwpXG5cdFx0fSxcblxuXG5cdFx0cG9zdCh1cmwsIGRhdGEpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuXHRcdFx0fSlcblx0XHR9LFxuXG5cdFx0cHV0KHVybCwgZGF0YSkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ1BVVCcsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0XHRcdH0pXG5cdFx0fSxcdFx0XHRcblxuXHRcdGRlbGV0ZSh1cmwpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fSxcblxuXHRcdHBvc3RGb3JtRGF0YSh1cmwsIGZkKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdCAgdXJsOiB1cmwsXG5cdFx0XHQgIHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0ICBkYXRhOiBmZCxcblx0XHRcdCAgcHJvY2Vzc0RhdGE6IGZhbHNlLCAgLy8gaW5kaXF1ZSDDoCBqUXVlcnkgZGUgbmUgcGFzIHRyYWl0ZXIgbGVzIGRvbm7DqWVzXG5cdFx0XHQgIGNvbnRlbnRUeXBlOiBmYWxzZSAgIC8vIGluZGlxdWUgw6AgalF1ZXJ5IGRlIG5lIHBhcyBjb25maWd1cmVyIGxlIGNvbnRlbnRUeXBlXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fVxuXG5cdFx0XG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIl19
