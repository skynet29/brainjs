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

							var newCtrl = $('<div>')
							$$.control.createControl(route.control, newCtrl)
							elt.safeEmpty().append(newCtrl)	
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

  //console.log('update', vars)

  if (typeof vars == 'string') {
    vars = vars.split(',')
  }

  vars.forEach(function(variable) {
    let value = getValue(data, variable)
    
    if (typeof value == 'object' && !Array.isArray(value)) {
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
           elt[f].call(elt, value)
        }
        if (type == 2) {
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

function process(root, data, createControl) {


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
              root.trigger('data:update', [attrValue, elt.getValue(), elt])
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

    root.bnFind('bn-bind', true, function(elt, varName) {
      //console.log('bn-text', varName)
      data[varName] = elt
    })
    root.bnFind('bn-iface', true, function(elt, varName) {
      //console.log('bn-text', varName)
      data[varName] = elt.iface()
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

        elt.on('data:update', (ev, name, value, excludeElt) => {
        	//console.log('[ViewController] data:change', name, value)
        	this.setData(name, value, excludeElt)
        })

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
        this.ctx = $$.binding.process(elt, this.model, $$.control.createControl)


        if (typeof options.events == 'object') {
            $$.binding.processEvents(elt, options.events)
        }

        this.scope = $$.binding.processBindings(elt)
        //console.log('scope', this.scope)
       

    } 

    setData(arg1, arg2, excludeElt) {
        //console.log('[ViewController] setData', arg1, arg2)
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
    	//console.log('[ViewController] update', fieldsName)
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







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2lucHV0Z3JvdXAuanMiLCJjb250cm9scy9uYXZiYXIuanMiLCJjb250cm9scy9yYWRpb2dyb3VwLmpzIiwiY29udHJvbHMvcm91dGVyLmpzIiwiY29udHJvbHMvdGFicy5qcyIsImxpYi9iaW5kaW5nLmpzIiwibGliL2NvbnRyb2wuanMiLCJsaWIvZGlhbG9nQ29udHJvbGxlciAuanMiLCJsaWIvZm9ybURpYWxvZ0NvbnRyb2xsZXIuanMiLCJsaWIvanF1ZXJ5LWV4dC5qcyIsImxpYi9zZXJ2aWNlLmpzIiwibGliL3VpLmpzIiwibGliL3V0aWwuanMiLCJsaWIvdmlld0NvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9odHRwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJyYWluanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuXHJcblx0d2luZG93LiQkID0ge31cclxuXHRcclxufSkoKTsiLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5jaGVja2dyb3VwJywge1xuXHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdGVsdC5vbignY2xpY2snLCAnaW5wdXRbdHlwZT1jaGVja2JveF0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVsdC50cmlnZ2VyKCdpbnB1dCcpXG5cdFx0fSlcblxuXHRcdHRoaXMuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZXQgPSBbXVxuXHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXQucHVzaCgkKHRoaXMpLnZhbCgpKVxuXHRcdFx0fSlcdFxuXHRcdFx0cmV0dXJuIHJldFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZS5pbmRleE9mKCQodGhpcykudmFsKCkpID49IDApXG5cdFx0XHRcdH0pXG5cdFx0XHR9XHRcdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUoZWx0LnZhbCgpKVxuXG5cdH1cblxufSk7XG5cblxuXG5cblxuXG4iLCJcbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmlucHV0Z3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dmFyIGlkID0gZWx0LmNoaWxkcmVuKCdpbnB1dCcpLnVuaXF1ZUlkKCkuYXR0cignaWQnKVxuXHRcdGVsdC5jaGlsZHJlbignbGFiZWwnKS5hdHRyKCdmb3InLCBpZClcblx0fVxufSk7XG4iLCIkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5uYXZiYXInLCB7XG5cdHByb3BzOiB7XG5cdFx0YWN0aXZlQ29sb3I6ICd3My1ncmVlbicsXG5cdFx0dHlwZTogJ2hvcml6b250YWwnXG5cdH0sXG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0Y29uc3Qge2FjdGl2ZUNvbG9yLCB0eXBlfSA9IHRoaXMucHJvcHNcblxuXHRcdGVsdC5hZGRDbGFzcygodHlwZSA9PSAndmVydGljYWwnKSA/ICd3My1iYXItYmxvY2snOiAndzMtYmFyJylcblx0XHRlbHQuY2hpbGRyZW4oJ2EnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygndzMtYmFyLWl0ZW0gdzMtYnV0dG9uJylcblx0XHR9KVxuXG5cdFx0Y29uc3QgbmV3Um91dGUgPSAkJC5nZXROZXdSb3V0ZSgpXG5cdFx0ZWx0LmNoaWxkcmVuKGBhW2hyZWY9XCIjJHtuZXdSb3V0ZX1cIl1gKS5hZGRDbGFzcyhhY3RpdmVDb2xvcilcblxuXHRcdCQod2luZG93KS5vbigncG9wc3RhdGUnLCBmdW5jdGlvbihldnQpIHtcblx0XHRcdC8vY29uc29sZS5sb2coJ1tOYXZiYXJDb250cm9sXSByb3V0ZUNoYW5nZScsIG5ld1JvdXRlKVxuXHRcdFx0Y29uc3QgbmV3Um91dGUgPSAkJC5nZXROZXdSb3V0ZSgpXG5cblx0XHRcdGVsdC5jaGlsZHJlbihgYS4ke2FjdGl2ZUNvbG9yfWApLnJlbW92ZUNsYXNzKGFjdGl2ZUNvbG9yKVx0XG5cdFx0XHRlbHQuY2hpbGRyZW4oYGFbaHJlZj1cIiMke25ld1JvdXRlfVwiXWApLmFkZENsYXNzKGFjdGl2ZUNvbG9yKVxuXG5cdFx0fSlcdFxuXG5cdH1cblxufSk7XG5cblxuXG5cblxuXG4iLCJcbiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnJhZGlvZ3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0ZWx0Lm9uKCdjbGljaycsICdpbnB1dFt0eXBlPXJhZGlvXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygncmFkaW9ncm91cCBjbGljaycpXG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb106Y2hlY2tlZCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcblx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHRydWUpXG5cdFx0XHRlbHQudHJpZ2dlcignaW5wdXQnKVxuXHRcdH0pXG5cdFx0XG5cblx0XHR0aGlzLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gZWx0LmZpbmQoJ2lucHV0W3R5cGU9cmFkaW9dOmNoZWNrZWQnKS52YWwoKVxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0ZWx0LmZpbmQoJ2lucHV0W3R5cGU9cmFkaW9dJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdmFsdWUgPT09ICQodGhpcykudmFsKCkpXG5cdFx0XHR9KVx0XHRcdFxuXHRcdH1cblxuXHRcdHRoaXMuc2V0VmFsdWUoZWx0LnZhbCgpKVxuXHR9XG59KTtcblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBtYXRjaFJvdXRlKHJvdXRlLCBwYXR0ZXJuKSB7XG5cdFx0Ly9jb25zb2xlLmxvZygnbWF0Y2hSb3V0ZScsIHJvdXRlLCBwYXR0ZXJuKVxuXHRcdHZhciByb3V0ZVNwbGl0ID0gcm91dGUuc3BsaXQoJy8nKVxuXHRcdHZhciBwYXR0ZXJuU3BsaXQgPSBwYXR0ZXJuLnNwbGl0KCcvJylcblx0XHQvL2NvbnNvbGUubG9nKHJvdXRlU3BsaXQsIHBhdHRlcm5TcGxpdClcblx0XHR2YXIgcmV0ID0ge31cblxuXHRcdGlmIChyb3V0ZVNwbGl0Lmxlbmd0aCAhPSBwYXR0ZXJuU3BsaXQubGVuZ3RoKVxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGZvcih2YXIgaWR4ID0gMDsgaWR4IDwgcGF0dGVyblNwbGl0Lmxlbmd0aDsgaWR4KyspIHtcblx0XHRcdHZhciBwYXRoID0gcGF0dGVyblNwbGl0W2lkeF1cblx0XHRcdC8vY29uc29sZS5sb2coJ3BhdGgnLCBwYXRoKVxuXHRcdFx0aWYgKHBhdGguc3Vic3RyKDAsIDEpID09PSAnOicpIHtcblx0XHRcdFx0aWYgKHJvdXRlU3BsaXRbaWR4XS5sZW5ndGggPT09IDApXG5cdFx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdFx0cmV0W3BhdGguc3Vic3RyKDEpXSA9IHJvdXRlU3BsaXRbaWR4XVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocGF0aCAhPT0gcm91dGVTcGxpdFtpZHhdKSB7XG5cdFx0XHRcdHJldHVybiBudWxsXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0XG5cdH1cblxuXG5cdGZ1bmN0aW9uIGdldE5ld1JvdXRlKCkge1xuXHRcdGNvbnN0IGhyZWYgPSBsb2NhdGlvbi5ocmVmXG5cdFx0Y29uc3QgaWR4ID0gaHJlZi5pbmRleE9mKCcjJylcblx0XHRjb25zdCBuZXdSb3V0ZSA9IChpZHggIT09IC0xKSAgPyBocmVmLnN1YnN0cihpZHgrMSkgOiAnLydcblx0XHRcblx0XHRyZXR1cm4gbmV3Um91dGVcblx0fVxuXG5cdCQkLmdldE5ld1JvdXRlID0gZ2V0TmV3Um91dGVcblxuXHQkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5yb3V0ZXInLCB7XG5cblx0XHRwcm9wczoge1xuXHRcdFx0cm91dGVzOiBbXVxuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnW3JvdXRlcl0gcG9wc3RhdGUnKVxuXHRcdFx0XHRwcm9jZXNzUm91dGUoZ2V0TmV3Um91dGUoKSlcblx0XHRcdH0pXG5cblxuXHRcdFx0dmFyIHJvdXRlcyA9IHRoaXMucHJvcHMucm91dGVzXG5cblx0XHRcdGlmICghQXJyYXkuaXNBcnJheShyb3V0ZXMpKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybignW3JvdXRlcl0gYmFkIHJvdXRlcycpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXG5cdFx0XHRwcm9jZXNzUm91dGUoZ2V0TmV3Um91dGUoKSlcblxuXHRcdFx0ZnVuY3Rpb24gcHJvY2Vzc1JvdXRlKG5ld1JvdXRlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSBwcm9jZXNzUm91dGUnLCBuZXdSb3V0ZSwgcm91dGVzKVxuXG5cdFx0XHRcdGZvcih2YXIgcm91dGUgb2Ygcm91dGVzKSB7XG5cdFx0XHRcdFx0dmFyIHBhcmFtcyA9IG1hdGNoUm91dGUobmV3Um91dGUsIHJvdXRlLmhyZWYpXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgcm91dGU6ICR7cm91dGUuaHJlZn0sIHBhcmFtc2AsIHBhcmFtcylcblx0XHRcdFx0XHRpZiAocGFyYW1zICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1tSb3V0ZXJDb250cm9sXSBwYXJhbXMnLCBwYXJhbXMpXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHJvdXRlLnJlZGlyZWN0ID09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSByZWRpcmVjdCB0byAnLCByb3V0ZS5yZWRpcmVjdClcblx0XHRcdFx0XHRcdFx0bG9jYXRpb24uaHJlZiA9ICcjJyArIHJvdXRlLnJlZGlyZWN0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiByb3V0ZS5jb250cm9sID09ICdzdHJpbmcnKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIG5ld0N0cmwgPSAkKCc8ZGl2PicpXG5cdFx0XHRcdFx0XHRcdCQkLmNvbnRyb2wuY3JlYXRlQ29udHJvbChyb3V0ZS5jb250cm9sLCBuZXdDdHJsKVxuXHRcdFx0XHRcdFx0XHRlbHQuc2FmZUVtcHR5KCkuYXBwZW5kKG5ld0N0cmwpXHRcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRcdFx0fVx0XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS53YXJuKCdbcm91dGVyXSBObyByb3V0ZSBmb3VuZCAhJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcdH1cdFx0XG5cblxuXHRcdH1cblxuXHR9KVxuXG59KSgpO1xuXG5cbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnRhYnMnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0dmFyIHVsID0gJCgnPHVsPicpLnByZXBlbmRUbyhlbHQpXG5cblx0XHRlbHQuY2hpbGRyZW4oJ2RpdicpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGl0bGUgPSAkKHRoaXMpLmF0dHIoJ3RpdGxlJylcblx0XHRcdHZhciBpZCA9ICQodGhpcykudW5pcXVlSWQoKS5hdHRyKCdpZCcpXG5cdFx0XHR2YXIgbGkgPSAkKCc8bGk+Jylcblx0XHRcdFx0LmF0dHIoJ3RpdGxlJywgdGl0bGUpXG5cdFx0XHRcdC5hcHBlbmQoJCgnPGE+Jywge2hyZWY6ICcjJyArIGlkfSkudGV4dCh0aXRsZSkpXG5cdFx0XHRcdC5hcHBlbmRUbyh1bClcblx0XHRcdGlmICgkKHRoaXMpLmF0dHIoJ2RhdGEtcmVtb3ZhYmxlJykgIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGxpLmFwcGVuZCgkKCc8c3Bhbj4nLCB7Y2xhc3M6ICd1aS1pY29uIHVpLWljb24tY2xvc2UnfSkpXG5cdFx0XHR9XG5cdFx0fSlcdFx0XG5cblx0XHRlbHQudGFicygpXG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFZhclZhbHVlKGRhdGEsIHZhck5hbWUpIHtcclxuICAgIHZhciByZXQgPSBkYXRhXHJcbiAgICBmb3IobGV0IGYgb2YgdmFyTmFtZS5zcGxpdCgnLicpKSB7XHJcbiAgICAgIFxyXG4gICAgICBpZiAodHlwZW9mIHJldCA9PSAnb2JqZWN0JyAmJiBmIGluIHJldCkge1xyXG4gICAgICAgIHJldCA9IHJldFtmXVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH1cclxuICAgIHJldHVybiByZXRcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSkge1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ1tDb3JlXSBnZXRWYWx1ZScsIHZhck5hbWUsIGN0eClcclxuXHJcbiAgICB2YXIgbm90ID0gZmFsc2VcclxuICAgIGlmICh2YXJOYW1lLnN0YXJ0c1dpdGgoJyEnKSkge1xyXG4gICAgICB2YXJOYW1lID0gdmFyTmFtZS5zdWJzdHIoMSlcclxuICAgICAgbm90ID0gdHJ1ZVxyXG4gICAgfSAgICAgXHJcblxyXG4gICAgdmFyIGZ1bmMgPSBkYXRhW3Zhck5hbWVdXHJcbiAgICB2YXIgdmFsdWVcclxuXHJcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB2YWx1ZSA9IGZ1bmMuY2FsbChkYXRhKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhbHVlID0gZ2V0VmFyVmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicgJiYgbm90KSB7XHJcbiAgICAgIHZhbHVlID0gIXZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBzcGxpdEF0dHIoYXR0clZhbHVlLCBjYmspIHtcclxuICBhdHRyVmFsdWUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgIGxldCBbbmFtZSwgdmFsdWVdID0gaS5zcGxpdCgnOicpXHJcbiAgICBjYmsobmFtZS50cmltKCksIHZhbHVlLnRyaW0oKSlcclxuICB9KVxyXG59XHJcblxyXG5cclxuY29uc3QgbWFwID0ge1xyXG4gICdibi1lYWNoJzoge3R5cGU6IDN9LFxyXG4gICdibi10ZXh0Jzoge2Y6ICd0ZXh0JywgdHlwZTogMX0sXHJcbiAgJ2JuLWh0bWwnOiB7ZjogJ2h0bWwnLCB0eXBlOiAxfSxcclxuICAnYm4tdmFsJzoge2Y6ICdzZXRWYWx1ZScsIHR5cGU6IDF9LFxyXG4gICdibi1zaG93Jzoge2Y6ICdzZXRWaXNpYmxlJywgdHlwZTogMX0sXHJcbiAgJ2JuLXN0eWxlJzoge2Y6ICdjc3MnLCB0eXBlOiAyfSxcclxuICAnYm4tYXR0cic6IHtmOiAnYXR0cicsIHR5cGU6IDJ9LFxyXG4gICdibi1wcm9wJzoge2Y6ICdwcm9wJywgdHlwZTogMn0sXHJcbiAgJ2JuLWRhdGEnOiB7ZjogJ3NldERhdGEnLCB0eXBlOiAyfSxcclxuICAnYm4tY2xhc3MnOiB7ZjogJ3NldENsYXNzJywgdHlwZTogMn0sXHJcbiAgJ2JuLWNvbnRyb2wnOiB7dHlwZTogNH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZShjdHgsIGRhdGEsIHZhcnMsIGV4Y2x1ZGVFbHQpIHtcclxuXHJcbiAgLy9jb25zb2xlLmxvZygndXBkYXRlJywgdmFycylcclxuXHJcbiAgaWYgKHR5cGVvZiB2YXJzID09ICdzdHJpbmcnKSB7XHJcbiAgICB2YXJzID0gdmFycy5zcGxpdCgnLCcpXHJcbiAgfVxyXG5cclxuICB2YXJzLmZvckVhY2goZnVuY3Rpb24odmFyaWFibGUpIHtcclxuICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhcmlhYmxlKVxyXG4gICAgXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICB1cGRhdGUoY3R4LCBkYXRhLCBPYmplY3Qua2V5cyh2YWx1ZSkubWFwKGkgPT4gdmFyaWFibGUgKyAnLicgKyBpKSwgZXhjbHVkZUVsdClcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChjdHhbdmFyaWFibGVdKSB7XHJcbiAgICAgIGN0eFt2YXJpYWJsZV0uZm9yRWFjaChmdW5jdGlvbihhY3Rpb24pIHtcclxuICAgICAgICBsZXQge3R5cGUsIGYsIGVsdCwgbmFtZSwgdGVtcGxhdGUsIGl0ZXJ9ID0gYWN0aW9uXHJcbiAgICAgICAgaWYgKGVsdCA9PSBleGNsdWRlRWx0KSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgdmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09IDIpIHtcclxuICAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgIH0gICBcclxuICAgICAgICBpZiAodHlwZSA9PSAzICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGVsdC5lbXB0eSgpXHJcbiAgICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgIHZhciBpdGVtRGF0YSA9ICQuZXh0ZW5kKHt9LCBkYXRhKVxyXG4gICAgICAgICAgICAgIGl0ZW1EYXRhW2l0ZXJdID0gaXRlbVxyXG4gICAgICAgICAgICAgIHZhciAkaXRlbSA9IHRlbXBsYXRlLmNsb25lKClcclxuICAgICAgICAgICAgICBwcm9jZXNzKCRpdGVtLCBpdGVtRGF0YSlcclxuICAgICAgICAgICAgICBlbHQuYXBwZW5kKCRpdGVtKSAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzRXZlbnRzKHJvb3QsIGV2ZW50cykge1xyXG4gIHJvb3QuYm5GaW5kKGBbYm4tZXZlbnRdYCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGVsdCA9ICQodGhpcylcclxuICAgICAgbGV0IGF0dHJWYWx1ZSA9IGVsdC5hdHRyKCdibi1ldmVudCcpXHJcbiAgICAgIGVsdC5yZW1vdmVBdHRyKCdibi1ldmVudCcpXHJcbiAgICAgIFxyXG4gICAgICBzcGxpdEF0dHIoYXR0clZhbHVlLCBmdW5jdGlvbihldnROYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIGxldCBmbiAgPSBldmVudHNbdmFsdWVdXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nKSB7ICAgICAgICBcclxuICAgICAgICAgIGNvbnN0IFtuYW1lLCBzZWxlY3Rvcl0gPSBldnROYW1lLnNwbGl0KCcuJylcclxuXHJcbiAgICAgICAgICBpZiAoc2VsZWN0b3IgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGVsdC5vbihuYW1lLCAnLicgKyBzZWxlY3RvciwgZm4pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWx0Lm9uKG5hbWUsIGZuKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgXHJcbiAgICB9KVxyXG4gICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzKHJvb3QsIGRhdGEsIGNyZWF0ZUNvbnRyb2wpIHtcclxuXHJcblxyXG4gIGxldCBjdHggPSB7fVxyXG4gIFxyXG4gIGZvcihsZXQgZGlyIGluIG1hcCkge1xyXG4gICAgXHJcblxyXG4gICAgcm9vdC5ibkZpbmQoYFske2Rpcn1dYCkuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGVsdCA9ICQodGhpcylcclxuICAgICAgbGV0IGF0dHJWYWx1ZSA9IGVsdC5hdHRyKGRpcilcclxuICAgICAgZWx0LnJlbW92ZUF0dHIoZGlyKVxyXG5cclxuICAgICAgbGV0IHt0eXBlLCBmfSA9IG1hcFtkaXJdXHJcbiAgICAgIFxyXG4gICAgICBpZiAodHlwZSA9PSAxKSB7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIGF0dHJWYWx1ZSlcclxuICAgICAgICAgIC8vZWx0LnRleHQoZGF0YVthdHRyVmFsdWVdKVxyXG4gICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCB2YWx1ZSlcclxuICAgICAgICB9IFxyXG4gICAgICAgIGlmIChkaXIgPT0gJ2JuLXZhbCcpIHtcclxuICAgICAgICAgIGxldCB1cGRhdGVFdnQgPSBlbHQuYXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgIGlmICh1cGRhdGVFdnQpIHtcclxuICAgICAgICAgICAgZWx0LnJlbW92ZUF0dHIoJ2JuLXVwZGF0ZScpXHJcbiAgICAgICAgICAgIGVsdC5vbih1cGRhdGVFdnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHJvb3QudHJpZ2dlcignZGF0YTp1cGRhdGUnLCBbYXR0clZhbHVlLCBlbHQuZ2V0VmFsdWUoKSwgZWx0XSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0gPSBjdHhbYXR0clZhbHVlXSB8fCBbXVxyXG4gICAgICAgIGN0eFthdHRyVmFsdWVdLnB1c2goe2YsIGVsdCwgdHlwZX0pICAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGUgPT0gNCAmJiB0eXBlb2YgY3JlYXRlQ29udHJvbCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY3JlYXRlQ29udHJvbChhdHRyVmFsdWUsIGVsdClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGUgPT0gMikge1xyXG5cclxuICAgICAgICAgIHNwbGl0QXR0cihhdHRyVmFsdWUsIGZ1bmN0aW9uKG5hbWUsIHZhck5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdID0gY3R4W3Zhck5hbWVdIHx8IFtdXHJcbiAgICAgICAgICAgIGN0eFt2YXJOYW1lXS5wdXNoKHtmLCBlbHQsIHR5cGUsIG5hbWV9KSAgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICBcclxuICAgICAgaWYgKHR5cGUgPT0gMykge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IGVsdC5jaGlsZHJlbigpLnJlbW92ZSgpLmNsb25lKClcclxuICAgICAgICBsZXQgW2l0ZXIsICwgdmFyTmFtZV0gPSBhdHRyVmFsdWUuc3BsaXQoJyAnKVxyXG4gICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4W3Zhck5hbWVdID0gY3R4W3Zhck5hbWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2VsdCwgdHlwZSwgdGVtcGxhdGUsIGl0ZXJ9KSAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGRhdGEgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgdmFyIGl0ZW1EYXRhID0gJC5leHRlbmQoe30sIGRhdGEpXHJcbiAgICAgICAgICAgaXRlbURhdGFbaXRlcl0gPSBpdGVtXHJcbiAgICAgICAgICAgdmFyICRpdGVtID0gdGVtcGxhdGUuY2xvbmUoKVxyXG4gICAgICAgICAgIHByb2Nlc3MoJGl0ZW0sIGl0ZW1EYXRhLCBjcmVhdGVDb250cm9sKVxyXG4gICAgICAgICAgIGVsdC5hcHBlbmQoJGl0ZW0pICAgICAgICAgIFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgXHJcbiAgXHJcbiAgfVxyXG4gIFxyXG5cclxuICByZXR1cm4gY3R4XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NCaW5kaW5ncyhyb290KSB7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7fVxyXG5cclxuICAgIHJvb3QuYm5GaW5kKCdibi1iaW5kJywgdHJ1ZSwgZnVuY3Rpb24oZWx0LCB2YXJOYW1lKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2JuLXRleHQnLCB2YXJOYW1lKVxyXG4gICAgICBkYXRhW3Zhck5hbWVdID0gZWx0XHJcbiAgICB9KVxyXG4gICAgcm9vdC5ibkZpbmQoJ2JuLWlmYWNlJywgdHJ1ZSwgZnVuY3Rpb24oZWx0LCB2YXJOYW1lKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2JuLXRleHQnLCB2YXJOYW1lKVxyXG4gICAgICBkYXRhW3Zhck5hbWVdID0gZWx0LmlmYWNlKClcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIFxyXG59XHJcblxyXG4kJC5iaW5kaW5nID0ge1xyXG4gIHByb2Nlc3MsXHJcbiAgdXBkYXRlLFxyXG4gIHByb2Nlc3NFdmVudHMsXHJcbiAgcHJvY2Vzc0JpbmRpbmdzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxubGV0IGNvbnRyb2xzID0ge31cclxuXHJcbmZ1bmN0aW9uIGlzRGVwc09rKGRlcHMpIHtcclxuXHRyZXR1cm4gZGVwcy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XHJcblxyXG5cdFx0cmV0dXJuIHByZXYgJiYgKGN1ciAhPSB1bmRlZmluZWQpXHJcblx0fSwgdHJ1ZSlcdFx0XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWdpc3RlckNvbnRyb2wobmFtZSwgb3B0aW9ucykge1xyXG5cdGlmICghJCQudXRpbC5jaGVja1R5cGUob3B0aW9ucywge1xyXG5cdFx0JGRlcHM6IFsnc3RyaW5nJ10sXHJcblx0XHRpbml0OiAnZnVuY3Rpb24nXHJcblx0fSkpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoYFtDb3JlXSByZWdpc3RlckNvbnRyb2w6IGJhZCBvcHRpb25zYCwgb3B0aW9ucylcclxuXHRcdHJldHVyblxyXG5cdH1cclxuXHJcblxyXG5cdHZhciBkZXBzID0gb3B0aW9ucy5kZXBzIHx8IFtdXHJcblxyXG5cdGNvbnNvbGUubG9nKGBbQ29yZV0gcmVnaXN0ZXIgY29udHJvbCAnJHtuYW1lfScgd2l0aCBkZXBzYCwgZGVwcylcclxuXHJcblx0Y29udHJvbHNbbmFtZV0gPSB7ZGVwcywgb3B0aW9ucywgc3RhdHVzOiAnbm90bG9hZGVkJ31cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29udHJvbChuYW1lKSB7XHJcblx0dmFyIHJldCA9IGNvbnRyb2xzW25hbWVdXHJcblx0aWYgKHJldCAmJiByZXQuc3RhdHVzID09ICdub3Rsb2FkZWQnKSB7XHJcblx0XHRyZXQuZGVwcyA9ICQkLnNlcnZpY2UuZ2V0U2VydmljZXMocmV0LmRlcHMpXHJcblx0XHRyZXQuc3RhdHVzID0gaXNEZXBzT2socmV0LmRlcHMpID8gJ29rJyA6ICdrbydcclxuXHR9XHJcblx0cmV0dXJuIHJldFxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDb250cm9sKGNvbnRyb2xOYW1lLCBlbHQpIHtcclxuXHRlbHQuYWRkQ2xhc3MoY29udHJvbE5hbWUucmVwbGFjZSgnLicsICctJykpXHJcblx0ZWx0LmFkZENsYXNzKCdDdXN0b21Db250cm9sJykudW5pcXVlSWQoKVx0XHJcblx0dmFyIGN0cmwgPSBnZXRDb250cm9sKGNvbnRyb2xOYW1lKVxyXG5cdFx0XHJcblx0aWYgKGN0cmwgPT0gdW5kZWZpbmVkKSB7XHJcblx0XHR0aHJvdyhgW0NvcmVdIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0fVxyXG5cdFx0Ly9jb25zb2xlLmxvZygnY3JlYXRlQ29udHJvbCcsIGNvbnRyb2xOYW1lLCBjdHJsKVxyXG5cdGlmIChjdHJsLnN0YXR1cyA9PT0gICdvaycpIHtcclxuXHRcdFxyXG5cdFx0dmFyIGlmYWNlID0ge1xyXG5cdFx0XHRwcm9wczoge30sXHJcblx0XHRcdG5hbWU6IGNvbnRyb2xOYW1lXHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHtpbml0LCBwcm9wcywgdGVtcGxhdGV9ID0gY3RybC5vcHRpb25zXHJcblx0XHRwcm9wcyA9IHByb3BzIHx8IHt9XHJcblxyXG5cdFx0T2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goZnVuY3Rpb24ocHJvcE5hbWUpIHtcclxuXHRcdFx0aWZhY2UucHJvcHNbcHJvcE5hbWVdID0gZWx0LmRhdGEocHJvcE5hbWUpIHx8IHByb3BzW3Byb3BOYW1lXVxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAodHlwZW9mIHRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdCQodGVtcGxhdGUpLmFwcGVuZFRvKGVsdClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuXHRcdFx0dGVtcGxhdGUuY2hpbGRyZW4oKS5jbG9uZSgpLmFwcGVuZFRvKGVsdClcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIGluaXQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuXHRcdFx0dmFyIGFyZ3MgPSBbZWx0XS5jb25jYXQoY3RybC5kZXBzKVxyXG5cdFx0XHRpbml0LmFwcGx5KGlmYWNlLCBhcmdzKVxyXG5cdFx0XHRjb25zb2xlLmxvZyhgW0NvcmVdIGluc3RhbmNlIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyB3aXRoIHByb3BzYCwgaWZhY2UucHJvcHMpXHJcblxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihgW0NvcmVdIGNvbnRyb2wgJyR7Y29udHJvbE5hbWV9JyBtaXNzaW5nIGluaXQgZnVuY3Rpb25gKVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRlbHQuZ2V0KDApLmN0cmwgPSBpZmFjZVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaWZhY2VcdFx0XHRcdFxyXG5cdH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuJCQuY29udHJvbCA9IHtcclxuXHRyZWdpc3RlckNvbnRyb2wsXHJcblx0Y3JlYXRlQ29udHJvbFxyXG59XHJcblxyXG59KSgpO1xyXG4iLCIkJC5kaWFsb2dDb250cm9sbGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBkaXYgPSAkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZSB8fCAnRGlhbG9nJ30pXHJcblxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy50ZW1wbGF0ZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0JChvcHRpb25zLnRlbXBsYXRlKS5hcHBlbmRUbyhkaXYpXHJcblx0fVx0XHJcblxyXG5cdHZhciBjdHJsID0gJCQudmlld0NvbnRyb2xsZXIoZGl2LCBvcHRpb25zKVxyXG5cclxuXHR2YXIgZGxnT3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuXHRcdGF1dG9PcGVuOiBmYWxzZSxcclxuXHRcdG1vZGFsOiB0cnVlLFxyXG5cdFx0d2lkdGg6ICdhdXRvJyxcdFx0XHJcblx0fSwgb3B0aW9ucylcclxuXHJcblx0dmFyIHByaXZhdGUgPSB7fVxyXG5cclxuXHQvL2NvbnNvbGUubG9nKCdkbGdPcHRpb25zJywgZGxnT3B0aW9ucylcclxuXHJcblx0ZGl2LmRpYWxvZyhkbGdPcHRpb25zKVxyXG5cclxuXHRjdHJsLnNob3cgPSBmdW5jdGlvbihvbkFwcGx5KSB7XHJcblx0XHRwcml2YXRlLm9uQXBwbHkgPSBvbkFwcGx5XHJcblx0XHRkaXYuZGlhbG9nKCdvcGVuJylcclxuXHR9XHJcblxyXG5cdGN0cmwuaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZGl2LmRpYWxvZygnY2xvc2UnKVxyXG5cdH1cclxuXHJcblx0Y3RybC5hcHBseSA9IGZ1bmN0aW9uKHJldFZhbHVlKSB7XHJcblx0XHRjdHJsLmhpZGUoKVxyXG5cdFx0aWYgKHR5cGVvZiBwcml2YXRlLm9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRwcml2YXRlLm9uQXBwbHkocmV0VmFsdWUpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjdHJsLnNldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbk5hbWUsIHZhbHVlKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdvcHRpb24nLCBvcHRpb25OYW1lLCB2YWx1ZSlcclxuXHR9XHJcblxyXG5cdGN0cmwuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ZGl2LmRpYWxvZygnZGVzdHJveScpXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gY3RybFxyXG59O1xyXG4iLCIkJC5mb3JtRGlhbG9nQ29udHJvbGxlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgZGl2ID0gJCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGUgfHwgJ0RpYWxvZyd9KVxyXG5cclxuXHR2YXIgcHJpdmF0ZSA9IHt9XHJcblxyXG5cdHZhciBmb3JtID0gJCgnPGZvcm0+JylcclxuXHRcdC5hcHBlbmRUbyhkaXYpXHJcblx0XHQub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0ZGl2LmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHRpZiAodHlwZW9mIHByaXZhdGUub25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0cHJpdmF0ZS5vbkFwcGx5KCQodGhpcykuZ2V0Rm9ybURhdGEoKSlcclxuXHRcdFx0XHQkKHRoaXMpLnJlc2V0Rm9ybSgpXHJcblx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0fSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGZvcm0pXHJcblx0fVx0XHJcblxyXG5cdGlmIChvcHRpb25zLnRlbXBsYXRlIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcblx0XHRvcHRpb25zLnRlbXBsYXRlLmNoaWxkcmVuKCkuY2xvbmUoKS5hcHBlbmRUbyhmb3JtKVxyXG5cdH1cclxuXHJcblx0dmFyIHN1Ym1pdEJ0biA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ3N1Ym1pdCcsIGhpZGRlbjogdHJ1ZX0pLmFwcGVuZFRvKGZvcm0pXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHJcblx0XHRidXR0b25zOiB7XHJcblx0XHRcdCdDYW5jZWwnOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmRpYWxvZygnY2xvc2UnKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQnQXBwbHknOiBmdW5jdGlvbigpIHtcdFx0XHRcdFx0XHJcblx0XHRcdFx0c3VibWl0QnRuLmNsaWNrKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIG9wdGlvbnMpXHJcblxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0c2hvdzogZnVuY3Rpb24ob25BcHBseSkge1xyXG5cdFx0XHRwcml2YXRlLm9uQXBwbHkgPSBvbkFwcGx5XHRcdFx0XHJcblx0XHRcdGRpdi5kaWFsb2coJ29wZW4nKVx0XHRcdFxyXG5cdFx0fSxcclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0Zm9ybS5zZXRGb3JtRGF0YShkYXRhKVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fSxcclxuXHJcblx0XHRkZXN0cm95OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0ZGl2LmRpYWxvZygnZGVzdHJveScpXHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCIoZnVuY3Rpb24oKXtcclxuXHJcblxyXG4kLmZuLmJuRmluZD0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgIHJldHVybiB0aGlzLmZpbmQoc2VsZWN0b3IpLmFkZCh0aGlzLmZpbHRlcihzZWxlY3RvcikpXHJcbn1cclxuXHJcbiQuZm4uc2V0Q2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUsIGlzQWN0aXZlKSB7XHJcbiAgICBpZiAoaXNBY3RpdmUpIHtcclxuICAgICAgdGhpcy5hZGRDbGFzcyhjbGFzc05hbWUpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5yZW1vdmVDbGFzcyhjbGFzc05hbWUpXHJcbiAgICB9XHJcbn1cclxuXHJcbiQuZm4uc2V0VmlzaWJsZSA9IGZ1bmN0aW9uKGlzVmlzaWJsZSkge1xyXG4gICAgaWYgKGlzVmlzaWJsZSkge1xyXG4gICAgICB0aGlzLnNob3coKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuaGlkZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbiQuZm4uaWZhY2UgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5nZXQoMCkuY3RybFxyXG59XHJcblxyXG4kLmZuLnNldERhdGEgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcblxyXG4gIGNvbnN0IGZ1bmNOYW1lID0gJ3NldCcgKyBuYW1lLnN1YnN0cigwLDEpLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKVxyXG4gIC8vY29uc29sZS5sb2coJ2Z1bmNOYW1lJywgZnVuY05hbWUpXHJcblxyXG4gIGlmIChpZmFjZSAmJiBpZmFjZS5wcm9wc1tuYW1lXSAmJiB0eXBlb2YgaWZhY2VbZnVuY05hbWVdID09ICdmdW5jdGlvbicpIHtcclxuICAgIGlmYWNlW2Z1bmNOYW1lXSh2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSBpZiAoaWZhY2UgJiYgJCQuaXNWaWV3Q29udHJvbGxlcihpZmFjZS5jdHJsKSAmJiBpZmFjZS5jdHJsLm1vZGVsW25hbWVdKSB7XHJcbiAgICBpZmFjZS5jdHJsLnNldERhdGEobmFtZSwgdmFsdWUpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5kYXRhKG5hbWUsIHZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuJC5mbi5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gJ0lOUFVUJyAmJiB0aGlzLmF0dHIoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICB0aGlzLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSlcclxuICAgIHJldHVyblxyXG4gIH0gIFxyXG4gIGNvbnN0IGlmYWNlID0gdGhpcy5pZmFjZSgpXHJcblxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2Uuc2V0VmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWZhY2Uuc2V0VmFsdWUodmFsdWUpXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy52YWwodmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG4kLmZuLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc3QgdHlwZSA9IHRoaXMuYXR0cigndHlwZScpXHJcbiAgaWYgKHRoaXMuZ2V0KDApLnRhZ05hbWUgPT0gJ0lOUFVUJyAmJiB0eXBlID09ICdjaGVja2JveCcpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3AoJ2NoZWNrZWQnKVxyXG4gIH0gICAgXHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuICBpZiAoaWZhY2UgJiYgdHlwZW9mIGlmYWNlLmdldFZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiBpZmFjZS5nZXRWYWx1ZSgpXHJcbiAgfVxyXG4gIHZhciByZXQgPSB0aGlzLnZhbCgpXHJcblxyXG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3JhbmdlJykge1xyXG4gICAgcmV0ID0gcGFyc2VGbG9hdChyZXQpXHJcbiAgfVxyXG4gIHJldHVybiByZXRcclxufVxyXG5cclxuJC5mbi5nZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciByZXQgPSB7fVxyXG4gIHRoaXMuZmluZCgnW25hbWVdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBlbHQgPSAkKHRoaXMpXHJcbiAgICB2YXIgbmFtZSA9IGVsdC5hdHRyKCduYW1lJylcclxuICAgIHJldFtuYW1lXSA9IGVsdC5nZXRWYWx1ZSgpXHJcblxyXG4gIH0pXHJcblxyXG4gIHJldHVybiByZXRcclxufVxyXG5cclxuJC5mbi5yZXNldEZvcm0gPSBmdW5jdGlvbigpIHtcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSBcIkZPUk1cIikge1xyXG4gICAgdGhpcy5nZXQoMCkucmVzZXQoKVxyXG4gIH0gICBcclxufVxyXG5cclxuJC5mbi5zZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHJcbiAgLy9jb25zb2xlLmxvZygnc2V0Rm9ybURhdGEnLCBkYXRhKVxyXG4gIHRoaXMucmVzZXRGb3JtKClcclxuXHJcbiAgZm9yKHZhciBuYW1lIGluIGRhdGEpIHtcclxuICAgIHZhciB2YWx1ZSA9IGRhdGFbbmFtZV1cclxuICAgIHZhciBlbHQgPSB0aGlzLmZpbmQoYFtuYW1lPSR7bmFtZX1dYClcclxuICAgIGlmIChlbHQubGVuZ3RoKSB7XHJcbiAgICAgIGVsdC5zZXRWYWx1ZSh2YWx1ZSkgICAgICAgXHJcbiAgICB9XHJcblxyXG4gIFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuJC5mbi5zYWZlRW1wdHkgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmZpbmQoJy5DdXN0b21Db250cm9sJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGlmYWNlID0gJCh0aGlzKS5pZmFjZSgpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBpZmFjZS5kaXNwb3NlID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgaWZhY2UuZGlzcG9zZSgpXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgdGhpcy5lbXB0eSgpXHJcblxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIlxyXG4oZnVuY3Rpb24oKXtcclxuXHJcbmxldCBzZXJ2aWNlcyA9IHt9XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZXJ2aWNlcyhkZXBzKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGdldFNlcnZpY2VzJywgZGVwcylcclxuXHRyZXR1cm4gZGVwcy5tYXAoZnVuY3Rpb24oZGVwTmFtZSkge1xyXG5cdFx0dmFyIHNydiA9IHNlcnZpY2VzW2RlcE5hbWVdXHJcblx0XHRpZiAoc3J2KSB7XHJcblx0XHRcdGlmIChzcnYuc3RhdHVzID09ICdub3Rsb2FkZWQnKSB7XHJcblx0XHRcdFx0dmFyIGRlcHMyID0gZ2V0U2VydmljZXMoc3J2LmRlcHMpXHJcblx0XHRcdFx0dmFyIGNvbmZpZyA9IHNydi5jb25maWcgfHwge31cclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgW0NvcmVdIGluc3RhbmNlIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIHdpdGggY29uZmlnYCwgY29uZmlnKVxyXG5cdFx0XHRcdHZhciBhcmdzID0gW2NvbmZpZ10uY29uY2F0KGRlcHMyKVxyXG5cdFx0XHRcdHNydi5vYmogPSBzcnYuZm4uYXBwbHkobnVsbCwgYXJncylcclxuXHRcdFx0XHRzcnYuc3RhdHVzID0gJ3JlYWR5J1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzcnYub2JqXHRcdFx0XHRcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQvL3Nydi5zdGF0dXMgPSAnbm90cmVnaXN0ZXJlZCdcclxuXHRcdFx0dGhyb3coYFtDb3JlXSBzZXJ2aWNlICcke2RlcE5hbWV9JyBpcyBub3QgcmVnaXN0ZXJlZGApXHJcblx0XHR9XHJcblxyXG5cdH0pXHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlU2VydmljZShuYW1lLCBjb25maWcpIHtcclxuXHRjb25zb2xlLmxvZygnW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UnLCBuYW1lLCBjb25maWcpXHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBjb25maWcgIT0gJ29iamVjdCcpIHtcclxuXHRcdGNvbnNvbGUud2FybignW0NvcmVdIGNvbmZpZ3VyZVNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0XHRyZXR1cm5cclxuXHR9IFx0XHJcblxyXG5cdHZhciBzcnYgPSBzZXJ2aWNlc1tuYW1lXVxyXG5cdGlmIChzcnYpIHtcclxuXHRcdHNydi5jb25maWcgPSBjb25maWdcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHR0aHJvdyhgW2NvbmZpZ3VyZVNlcnZpY2VdIHNlcnZpY2UgJyR7bmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2UobmFtZSwgYXJnMSwgYXJnMikge1xyXG5cdHZhciBkZXBzID0gW11cclxuXHR2YXIgZm4gPSBhcmcxXHJcblx0aWYgKEFycmF5LmlzQXJyYXkoYXJnMSkpIHtcclxuXHRcdGRlcHMgPSBhcmcxXHJcblx0XHRmbiA9IGFyZzJcclxuXHR9XHJcblx0aWYgKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnIHx8IHR5cGVvZiBmbiA9PSAndW5kZWZpbmVkJyB8fCAhQXJyYXkuaXNBcnJheShkZXBzKSkge1xyXG5cdFx0dGhyb3coJ1tDb3JlXSByZWdpc3RlclNlcnZpY2UgY2FsbGVkIHdpdGggYmFkIGFyZ3VtZW50cycpXHJcblx0fSBcclxuXHRjb25zb2xlLmxvZyhgW0NvcmVdIHJlZ2lzdGVyIHNlcnZpY2UgJyR7bmFtZX0nIHdpdGggZGVwc2AsIGRlcHMpXHJcblxyXG5cdHNlcnZpY2VzW25hbWVdID0ge2RlcHMsIGZuLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG4kJC5zZXJ2aWNlID0ge1xyXG5cdHJlZ2lzdGVyU2VydmljZSxcclxuXHRjb25maWd1cmVTZXJ2aWNlLFxyXG5cdGdldFNlcnZpY2VzXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xuXG5mdW5jdGlvbiBzaG93QWxlcnQob3B0aW9ucywgY2FsbGJhY2spIHtcblxuXHRvcHRpb25zID0gJC5leHRlbmQoe1xuXHRcdHRpdGxlOiAnQWxlcnQnLFxuXHRcdGNvbnRlbnQ6ICcnLFxuXHRcdHNob3dDYW5jZWw6IGZhbHNlXG5cdH0sIG9wdGlvbnMpXG5cblx0b3B0aW9ucy5tb2RlbCA9IHRydWVcblx0b3B0aW9ucy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuZGlhbG9nKCdkZXN0cm95Jylcblx0fVxuXHRvcHRpb25zLmJ1dHRvbnMgPSB7XG5cdFx0J09LJzogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmRpYWxvZygnY2xvc2UnKVxuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGNhbGxiYWNrKClcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0aWYgKG9wdGlvbnMuc2hvd0NhbmNlbCkge1xuXHRcdG9wdGlvbnMuYnV0dG9uc1snQ2FuY2VsJ10gPSBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXG5cdFx0fVxuXHR9XG5cblx0JCgnPGRpdj4nLCB7dGl0bGU6IG9wdGlvbnMudGl0bGV9KVxuXHRcdC5hcHBlbmQoJCgnPHA+JykuaHRtbChvcHRpb25zLmNvbnRlbnQpKVxuXHRcdC5kaWFsb2cob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gc2hvd0NvbmZpcm0ob3B0aW9ucywgY2FsbGJhY2spIHtcblx0b3B0aW9ucy5zaG93Q2FuY2VsID0gdHJ1ZVxuXHRzaG93QWxlcnQob3B0aW9ucywgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIHNob3dQcm9tcHQob3B0aW9ucywgY2FsbGJhY2spIHtcblxuXHRjb25zdCBsYWJlbCA9IG9wdGlvbnMubGFiZWwgfHwgJydcblxuXHRvcHRpb25zLnRlbXBsYXRlID0gYFxuXHQ8cD4ke2xhYmVsfTwvcD5cblx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQ9XCJcIiBuYW1lPVwidmFsdWVcIj5cblx0YFxuXG5cdG9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLmRpYWxvZygnZGVzdHJveScpXG5cdH1cblxuXHQkJC5mb3JtRGlhbG9nQ29udHJvbGxlcihvcHRpb25zKVxuXHQuc2hvdyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRjYWxsYmFjayhkYXRhLnZhbHVlKVxuXHRcdH1cblx0fSlcbn1cblxuJCQudWkgPSB7XG5cdHNob3dBbGVydCxcblx0c2hvd0NvbmZpcm0sXG5cdHNob3dQcm9tcHRcbn1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblxyXG5cclxuZnVuY3Rpb24gcmVhZFRleHRGaWxlKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc1RleHQoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWFkRmlsZUFzRGF0YVVSTChmaWxlTmFtZSwgb25SZWFkKSB7XHJcblx0dmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXHJcblxyXG5cdGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodHlwZW9mIG9uUmVhZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdG9uUmVhZChmaWxlUmVhZGVyLnJlc3VsdClcclxuXHRcdH1cclxuXHR9XHJcblx0ZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVOYW1lKVxyXG59XHJcblxyXG5cclxudmFyIGlucHV0RmlsZSA9ICQoJzxpbnB1dD4nLCB7dHlwZTogJ2ZpbGUnfSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG5cdHZhciBvbkFwcGx5ID0gJCh0aGlzKS5kYXRhKCdvbkFwcGx5JylcclxuXHR2YXIgZmlsZU5hbWUgPSB0aGlzLmZpbGVzWzBdXHJcblx0aWYgKHR5cGVvZiBvbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdG9uQXBwbHkoZmlsZU5hbWUpXHJcblx0fVxyXG59KVxyXG5cclxuZnVuY3Rpb24gb3BlbkZpbGVEaWFsb2cob25BcHBseSkge1xyXG5cdGlucHV0RmlsZS5kYXRhKCdvbkFwcGx5Jywgb25BcHBseSlcclxuXHRpbnB1dEZpbGUuY2xpY2soKVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0ltYWdlKGZpbGVOYW1lKSB7XHJcblx0cmV0dXJuICgvXFwuKGdpZnxqcGd8anBlZ3xwbmcpJC9pKS50ZXN0KGZpbGVOYW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkYXRhVVJMdG9CbG9iKGRhdGFVUkwpIHtcclxuICAvLyBEZWNvZGUgdGhlIGRhdGFVUkxcclxuICBjb25zdCBbICwgbWltZVR5cGUsIGVuY29kYWdlLCBkYXRhXSA9IGRhdGFVUkwuc3BsaXQoL1s6LDtdLylcclxuICBpZiAoZW5jb2RhZ2UgIT0gJ2Jhc2U2NCcpIHtcclxuICBcdHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy9jb25zb2xlLmxvZygnbWltZVR5cGUnLCBtaW1lVHlwZSlcclxuICAvL2NvbnNvbGUubG9nKCdlbmNvZGFnZScsIGVuY29kYWdlKVxyXG4gIC8vY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxyXG5cclxuICB2YXIgYmluYXJ5ID0gYXRvYihkYXRhKVxyXG4gLy8gQ3JlYXRlIDgtYml0IHVuc2lnbmVkIGFycmF5XHJcbiAgdmFyIGFycmF5ID0gW11cclxuICBmb3IodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgXHRhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIG91ciBCbG9iIG9iamVjdFxyXG5cdHJldHVybiBuZXcgQmxvYihbIG5ldyBVaW50OEFycmF5KGFycmF5KSBdLCB7bWltZVR5cGV9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3R5bGUoc3R5bGVGaWxlUGF0aCwgY2FsbGJhY2spIHtcdFxyXG5cdC8vY29uc29sZS5sb2coJ1tDb3JlXSBsb2FkU3R5bGUnLCBzdHlsZUZpbGVQYXRoKVxyXG5cclxuXHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNzc09rID0gJCgnaGVhZCcpLmZpbmQoYGxpbmtbaHJlZj1cIiR7c3R5bGVGaWxlUGF0aH1cIl1gKS5sZW5ndGhcclxuXHRcdGlmIChjc3NPayAhPSAxKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBsb2FkaW5nICcke3N0eWxlRmlsZVBhdGh9JyBzdHlsZWApXHJcblx0XHRcdCQoJzxsaW5rPicsIHtocmVmOiBzdHlsZUZpbGVQYXRoLCByZWw6ICdzdHlsZXNoZWV0J30pXHJcblx0XHRcdC5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAnJHtzdHlsZUZpbGVQYXRofScgbG9hZGVkYClcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hcHBlbmRUbygkKCdoZWFkJykpXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5cdFxyXG5mdW5jdGlvbiBpc09iamVjdChhKSB7XHJcblx0cmV0dXJuICh0eXBlb2YgYSA9PSAnb2JqZWN0JykgJiYgIUFycmF5LmlzQXJyYXkoYSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tUeXBlKHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKSB7XHJcblx0Ly9jb25zb2xlLmxvZygnY2hlY2tUeXBlJyx2YWx1ZSwgdHlwZSwgaXNPcHRpb25hbClcclxuXHRpZiAodHlwZW9mIHZhbHVlID09ICd1bmRlZmluZWQnICYmIGlzT3B0aW9uYWwgPT09IHRydWUpIHtcclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIHR5cGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT0gdHlwZVxyXG5cdH1cclxuXHJcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodHlwZSkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGUubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIHRydWUgLy8gbm8gaXRlbSB0eXBlIGNoZWNraW5nXHJcblx0XHR9XHJcblx0XHRmb3IobGV0IGkgb2YgdmFsdWUpIHtcclxuXHRcdFx0dmFyIHJldCA9IGZhbHNlXHJcblx0XHRcdGZvcihsZXQgdCBvZiB0eXBlKSB7XHJcblx0XHRcdFx0cmV0IHw9IGNoZWNrVHlwZShpLCB0KVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghcmV0KSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cdH1cclxuXHJcblx0aWYgKGlzT2JqZWN0KHR5cGUpKSB7XHJcblx0XHRpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgZiBpbiB0eXBlKSB7XHJcblxyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCdmJywgZiwgJ3ZhbHVlJywgdmFsdWUpXHJcblx0XHRcdHZhciBuZXdUeXBlID0gdHlwZVtmXVxyXG5cclxuXHRcdFx0dmFyIGlzT3B0aW9uYWwgPSBmYWxzZVxyXG5cdFx0XHRpZiAoZi5zdGFydHNXaXRoKCckJykpIHtcclxuXHRcdFx0XHRmID0gZi5zdWJzdHIoMSlcclxuXHRcdFx0XHRpc09wdGlvbmFsID0gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghY2hlY2tUeXBlKHZhbHVlW2ZdLCBuZXdUeXBlLCBpc09wdGlvbmFsKSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cdHJldHVybiBmYWxzZVxyXG59XHRcclxuXHJcblxyXG5cclxuJCQudXRpbCA9IHtcclxuXHRyZWFkVGV4dEZpbGUsXHJcblx0cmVhZEZpbGVBc0RhdGFVUkwsXHJcblx0b3BlbkZpbGVEaWFsb2csXHJcblx0aXNJbWFnZSxcclxuXHRkYXRhVVJMdG9CbG9iLFxyXG5cdGxvYWRTdHlsZSxcclxuXHRjaGVja1R5cGVcclxufVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuY2xhc3MgVmlld0NvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoZWx0LCBvcHRpb25zKSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1ZpZXdDb250cm9sbGVyJywgb3B0aW9ucylcclxuICAgIFx0aWYgKHR5cGVvZiBlbHQgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRlbHQgPSAkKGVsdClcclxuICAgIFx0fVxyXG4gICAgICAgIGlmIChlbHQuaGFzQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKSkge1xyXG4gICAgICAgICAgICBlbHQgPSBlbHQuY2hpbGRyZW4oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICBcdG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucylcclxuICAgICAgICB0aGlzLmVsdCA9IGVsdFxyXG5cclxuICAgICAgICBlbHQub24oJ2RhdGE6dXBkYXRlJywgKGV2LCBuYW1lLCB2YWx1ZSwgZXhjbHVkZUVsdCkgPT4ge1xyXG4gICAgICAgIFx0Ly9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSBkYXRhOmNoYW5nZScsIG5hbWUsIHZhbHVlKVxyXG4gICAgICAgIFx0dGhpcy5zZXREYXRhKG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMubW9kZWwgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5kYXRhKVxyXG4gICAgICAgIHRoaXMucnVsZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy5ydWxlcylcclxuICAgICAgICB0aGlzLndhdGNoZXMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucy53YXRjaGVzKVxyXG5cclxuICAgICAgICAvLyBnZW5lcmF0ZSBhdXRvbWF0aWMgcnVsZXMgZm9yIGNvbXB1dGVkIGRhdGEgKGFrYSBmdW5jdGlvbilcclxuICAgICAgICBmb3IodmFyIGsgaW4gdGhpcy5tb2RlbCkge1xyXG4gICAgICAgIFx0dmFyIGRhdGEgPSB0aGlzLm1vZGVsW2tdXHJcbiAgICAgICAgXHRpZiAodHlwZW9mIGRhdGEgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIFx0XHR2YXIgZnVuY1RleHQgPSBkYXRhLnRvU3RyaW5nKClcclxuICAgICAgICBcdFx0Ly9jb25zb2xlLmxvZygnZnVuY1RleHQnLCBmdW5jVGV4dClcclxuICAgICAgICBcdFx0dmFyIHJ1bGVzID0gW11cclxuICAgICAgICBcdFx0ZnVuY1RleHQucmVwbGFjZSgvdGhpcy4oW2EtekEtWjAtOV8tXXsxLH0pL2csIGZ1bmN0aW9uKG1hdGNoLCBjYXB0dXJlT25lKSB7XHJcbiAgICAgICAgXHRcdFx0Ly9jb25zb2xlLmxvZygnY2FwdHVyZU9uZScsIGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdFx0cnVsZXMucHVzaChjYXB0dXJlT25lKVxyXG4gICAgICAgIFx0XHR9KVxyXG4gICAgICAgIFx0XHR0aGlzLnJ1bGVzW2tdID0gcnVsZXMudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVsZXMnLCB0aGlzLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gJCQuYmluZGluZy5wcm9jZXNzKGVsdCwgdGhpcy5tb2RlbCwgJCQuY29udHJvbC5jcmVhdGVDb250cm9sKVxyXG5cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmV2ZW50cyA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAkJC5iaW5kaW5nLnByb2Nlc3NFdmVudHMoZWx0LCBvcHRpb25zLmV2ZW50cylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NvcGUgPSAkJC5iaW5kaW5nLnByb2Nlc3NCaW5kaW5ncyhlbHQpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2NvcGUnLCB0aGlzLnNjb3BlKVxyXG4gICAgICAgXHJcblxyXG4gICAgfSBcclxuXHJcbiAgICBzZXREYXRhKGFyZzEsIGFyZzIsIGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBhcmcxLCBhcmcyKVxyXG4gICAgICAgIHZhciBkYXRhID0gYXJnMVxyXG4gICAgICAgIGlmICh0eXBlb2YgYXJnMSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIFx0ZGF0YSA9IHt9XHJcbiAgICAgICAgXHRkYXRhW2FyZzFdID0gYXJnMlxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIHNldERhdGEnLCBkYXRhKVxyXG4gICAgICAgICQuZXh0ZW5kKHRoaXMubW9kZWwsIGRhdGEpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbW9kZWwnLCB0aGlzLm1vZGVsKVxyXG4gICAgICAgIHRoaXMudXBkYXRlKE9iamVjdC5rZXlzKGRhdGEpLCBleGNsdWRlRWx0KVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShmaWVsZHNOYW1lLCBleGNsdWRlRWx0KSB7XHJcbiAgICBcdC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gdXBkYXRlJywgZmllbGRzTmFtZSlcclxuICAgIFx0aWYgKHR5cGVvZiBmaWVsZHNOYW1lID09ICdzdHJpbmcnKSB7XHJcbiAgICBcdFx0ZmllbGRzTmFtZSA9IGZpZWxkc05hbWUuc3BsaXQoJywnKVxyXG4gICAgXHR9XHJcblxyXG5cclxuICAgIFx0aWYgKEFycmF5LmlzQXJyYXkoZmllbGRzTmFtZSkpIHtcclxuICAgIFx0XHR2YXIgZmllbGRzU2V0ID0ge31cclxuICAgIFx0XHRmaWVsZHNOYW1lLmZvckVhY2goKGZpZWxkKSA9PiB7XHJcblxyXG4gICAgXHRcdFx0dmFyIHdhdGNoID0gdGhpcy53YXRjaGVzW2ZpZWxkXVxyXG4gICAgXHRcdFx0aWYgKHR5cGVvZiB3YXRjaCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBcdFx0XHRcdHdhdGNoLmNhbGwobnVsbCwgdGhpcy5tb2RlbFtmaWVsZF0pXHJcbiAgICBcdFx0XHR9XHJcbiAgICBcdFx0XHRmaWVsZHNTZXRbZmllbGRdID0gMVxyXG5cclxuICAgIFx0XHRcdGZvcih2YXIgcnVsZSBpbiB0aGlzLnJ1bGVzKSB7XHJcbiAgICBcdFx0XHRcdGlmICh0aGlzLnJ1bGVzW3J1bGVdLnNwbGl0KCcsJykuaW5kZXhPZihmaWVsZCkgIT0gLTEpIHtcclxuICAgIFx0XHRcdFx0XHRmaWVsZHNTZXRbcnVsZV0gPSAxXHJcbiAgICBcdFx0XHRcdH1cclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHR9KVxyXG5cclxuXHJcbiAgICBcdFx0JCQuYmluZGluZy51cGRhdGUodGhpcy5jdHgsIHRoaXMubW9kZWwsIE9iamVjdC5rZXlzKGZpZWxkc1NldCksIGV4Y2x1ZGVFbHQpXHJcbiAgICBcdH1cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiQkLnZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24oZWx0LCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IFZpZXdDb250cm9sbGVyKGVsdCwgb3B0aW9ucylcclxufVxyXG5cclxuJCQuaXNWaWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIHJldHVybiBvIGluc3RhbmNlb2YgVmlld0NvbnRyb2xsZXJcclxufVxyXG5cclxufSkoKTtcclxuIiwiXG4kJC5zZXJ2aWNlLnJlZ2lzdGVyU2VydmljZSgnYnJhaW5qcy5odHRwJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0Z2V0KHVybCkge1xuXHRcdFx0cmV0dXJuICQuZ2V0SlNPTih1cmwpXG5cdFx0fSxcblxuXG5cdFx0cG9zdCh1cmwsIGRhdGEpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuXHRcdFx0fSlcblx0XHR9LFxuXG5cdFx0cHV0KHVybCwgZGF0YSkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ1BVVCcsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcblx0XHRcdH0pXG5cdFx0fSxcdFx0XHRcblxuXHRcdGRlbGV0ZSh1cmwpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fSxcblxuXHRcdHBvc3RGb3JtRGF0YSh1cmwsIGZkKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdCAgdXJsOiB1cmwsXG5cdFx0XHQgIHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0ICBkYXRhOiBmZCxcblx0XHRcdCAgcHJvY2Vzc0RhdGE6IGZhbHNlLCAgLy8gaW5kaXF1ZSDDoCBqUXVlcnkgZGUgbmUgcGFzIHRyYWl0ZXIgbGVzIGRvbm7DqWVzXG5cdFx0XHQgIGNvbnRlbnRUeXBlOiBmYWxzZSAgIC8vIGluZGlxdWUgw6AgalF1ZXJ5IGRlIG5lIHBhcyBjb25maWd1cmVyIGxlIGNvbnRlbnRUeXBlXG5cdFx0XHR9KVx0XHRcdFx0XG5cdFx0fVxuXG5cdFx0XG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIl19
