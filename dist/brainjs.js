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
            console.error('don\'t use viewController on control tag')
            return
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







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiY29udHJvbHMvY2hlY2tncm91cC5qcyIsImNvbnRyb2xzL2lucHV0Z3JvdXAuanMiLCJjb250cm9scy9uYXZiYXIuanMiLCJjb250cm9scy9yYWRpb2dyb3VwLmpzIiwiY29udHJvbHMvcm91dGVyLmpzIiwiY29udHJvbHMvdGFicy5qcyIsImxpYi9iaW5kaW5nLmpzIiwibGliL2NvbnRyb2wuanMiLCJsaWIvZGlhbG9nQ29udHJvbGxlciAuanMiLCJsaWIvZm9ybURpYWxvZ0NvbnRyb2xsZXIuanMiLCJsaWIvanF1ZXJ5LWV4dC5qcyIsImxpYi9zZXJ2aWNlLmpzIiwibGliL3VpLmpzIiwibGliL3V0aWwuanMiLCJsaWIvdmlld0NvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9odHRwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnJhaW5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG5cclxuXHR3aW5kb3cuJCQgPSB7fVxyXG5cdFxyXG59KSgpOyIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLmNoZWNrZ3JvdXAnLCB7XG5cdGluaXQ6IGZ1bmN0aW9uKGVsdCkge1xuXG5cdFx0ZWx0Lm9uKCdjbGljaycsICdpbnB1dFt0eXBlPWNoZWNrYm94XScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZWx0LnRyaWdnZXIoJ2lucHV0Jylcblx0XHR9KVxuXG5cdFx0dGhpcy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJldCA9IFtdXG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF06Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldC5wdXNoKCQodGhpcykudmFsKCkpXG5cdFx0XHR9KVx0XG5cdFx0XHRyZXR1cm4gcmV0XHRcblx0XHR9XG5cblx0XHR0aGlzLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcykucHJvcCgnY2hlY2tlZCcsIHZhbHVlLmluZGV4T2YoJCh0aGlzKS52YWwoKSkgPj0gMClcblx0XHRcdFx0fSlcblx0XHRcdH1cdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuaW5wdXRncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR2YXIgaWQgPSBlbHQuY2hpbGRyZW4oJ2lucHV0JykudW5pcXVlSWQoKS5hdHRyKCdpZCcpXG5cdFx0ZWx0LmNoaWxkcmVuKCdsYWJlbCcpLmF0dHIoJ2ZvcicsIGlkKVxuXHR9XG59KTtcbiIsIiQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLm5hdmJhcicsIHtcblx0cHJvcHM6IHtcblx0XHRhY3RpdmVDb2xvcjogJ3czLWdyZWVuJyxcblx0XHR0eXBlOiAnaG9yaXpvbnRhbCdcblx0fSxcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRjb25zdCB7YWN0aXZlQ29sb3IsIHR5cGV9ID0gdGhpcy5wcm9wc1xuXG5cdFx0ZWx0LmFkZENsYXNzKCh0eXBlID09ICd2ZXJ0aWNhbCcpID8gJ3czLWJhci1ibG9jayc6ICd3My1iYXInKVxuXHRcdGVsdC5jaGlsZHJlbignYScpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCd3My1iYXItaXRlbSB3My1idXR0b24nKVxuXHRcdH0pXG5cblx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblx0XHRlbHQuY2hpbGRyZW4oYGFbaHJlZj1cIiMke25ld1JvdXRlfVwiXWApLmFkZENsYXNzKGFjdGl2ZUNvbG9yKVxuXG5cdFx0JCh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZygnW05hdmJhckNvbnRyb2xdIHJvdXRlQ2hhbmdlJywgbmV3Um91dGUpXG5cdFx0XHRjb25zdCBuZXdSb3V0ZSA9ICQkLmdldE5ld1JvdXRlKClcblxuXHRcdFx0ZWx0LmNoaWxkcmVuKGBhLiR7YWN0aXZlQ29sb3J9YCkucmVtb3ZlQ2xhc3MoYWN0aXZlQ29sb3IpXHRcblx0XHRcdGVsdC5jaGlsZHJlbihgYVtocmVmPVwiIyR7bmV3Um91dGV9XCJdYCkuYWRkQ2xhc3MoYWN0aXZlQ29sb3IpXG5cblx0XHR9KVx0XG5cblx0fVxuXG59KTtcblxuXG5cblxuXG5cbiIsIlxuJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMucmFkaW9ncm91cCcsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRlbHQub24oJ2NsaWNrJywgJ2lucHV0W3R5cGU9cmFkaW9dJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdyYWRpb2dyb3VwIGNsaWNrJylcblx0XHRcdGVsdC5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXTpjaGVja2VkJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuXHRcdFx0JCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSlcblx0XHRcdGVsdC50cmlnZ2VyKCdpbnB1dCcpXG5cdFx0fSlcblx0XHRcblxuXHRcdHRoaXMuZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb106Y2hlY2tlZCcpLnZhbCgpXG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRlbHQuZmluZCgnaW5wdXRbdHlwZT1yYWRpb10nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCB2YWx1ZSA9PT0gJCh0aGlzKS52YWwoKSlcblx0XHRcdH0pXHRcdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRWYWx1ZShlbHQudmFsKCkpXG5cdH1cbn0pO1xuXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIG1hdGNoUm91dGUocm91dGUsIHBhdHRlcm4pIHtcblx0XHQvL2NvbnNvbGUubG9nKCdtYXRjaFJvdXRlJywgcm91dGUsIHBhdHRlcm4pXG5cdFx0dmFyIHJvdXRlU3BsaXQgPSByb3V0ZS5zcGxpdCgnLycpXG5cdFx0dmFyIHBhdHRlcm5TcGxpdCA9IHBhdHRlcm4uc3BsaXQoJy8nKVxuXHRcdC8vY29uc29sZS5sb2cocm91dGVTcGxpdCwgcGF0dGVyblNwbGl0KVxuXHRcdHZhciByZXQgPSB7fVxuXG5cdFx0aWYgKHJvdXRlU3BsaXQubGVuZ3RoICE9IHBhdHRlcm5TcGxpdC5sZW5ndGgpXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0Zm9yKHZhciBpZHggPSAwOyBpZHggPCBwYXR0ZXJuU3BsaXQubGVuZ3RoOyBpZHgrKykge1xuXHRcdFx0dmFyIHBhdGggPSBwYXR0ZXJuU3BsaXRbaWR4XVxuXHRcdFx0Ly9jb25zb2xlLmxvZygncGF0aCcsIHBhdGgpXG5cdFx0XHRpZiAocGF0aC5zdWJzdHIoMCwgMSkgPT09ICc6Jykge1xuXHRcdFx0XHRpZiAocm91dGVTcGxpdFtpZHhdLmxlbmd0aCA9PT0gMClcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxuXHRcdFx0XHRyZXRbcGF0aC5zdWJzdHIoMSldID0gcm91dGVTcGxpdFtpZHhdXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwYXRoICE9PSByb3V0ZVNwbGl0W2lkeF0pIHtcblx0XHRcdFx0cmV0dXJuIG51bGxcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiByZXRcblx0fVxuXG5cblx0ZnVuY3Rpb24gZ2V0TmV3Um91dGUoKSB7XG5cdFx0Y29uc3QgaHJlZiA9IGxvY2F0aW9uLmhyZWZcblx0XHRjb25zdCBpZHggPSBocmVmLmluZGV4T2YoJyMnKVxuXHRcdGNvbnN0IG5ld1JvdXRlID0gKGlkeCAhPT0gLTEpICA/IGhyZWYuc3Vic3RyKGlkeCsxKSA6ICcvJ1xuXHRcdFxuXHRcdHJldHVybiBuZXdSb3V0ZVxuXHR9XG5cblx0JCQuZ2V0TmV3Um91dGUgPSBnZXROZXdSb3V0ZVxuXG5cdCQkLmNvbnRyb2wucmVnaXN0ZXJDb250cm9sKCdicmFpbmpzLnJvdXRlcicsIHtcblxuXHRcdHByb3BzOiB7XG5cdFx0XHRyb3V0ZXM6IFtdXG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXG5cdFx0XHQkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdbcm91dGVyXSBwb3BzdGF0ZScpXG5cdFx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXHRcdFx0fSlcblxuXG5cdFx0XHR2YXIgcm91dGVzID0gdGhpcy5wcm9wcy5yb3V0ZXNcblxuXHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHJvdXRlcykpIHtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdbcm91dGVyXSBiYWQgcm91dGVzJylcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdHByb2Nlc3NSb3V0ZShnZXROZXdSb3V0ZSgpKVxuXG5cdFx0XHRmdW5jdGlvbiBwcm9jZXNzUm91dGUobmV3Um91dGUpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHByb2Nlc3NSb3V0ZScsIG5ld1JvdXRlLCByb3V0ZXMpXG5cblx0XHRcdFx0Zm9yKHZhciByb3V0ZSBvZiByb3V0ZXMpIHtcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0gbWF0Y2hSb3V0ZShuZXdSb3V0ZSwgcm91dGUuaHJlZilcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGByb3V0ZTogJHtyb3V0ZS5ocmVmfSwgcGFyYW1zYCwgcGFyYW1zKVxuXHRcdFx0XHRcdGlmIChwYXJhbXMgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnW1JvdXRlckNvbnRyb2xdIHBhcmFtcycsIHBhcmFtcylcblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygcm91dGUucmVkaXJlY3QgPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1tyb3V0ZXJdIHJlZGlyZWN0IHRvICcsIHJvdXRlLnJlZGlyZWN0KVxuXHRcdFx0XHRcdFx0XHRsb2NhdGlvbi5ocmVmID0gJyMnICsgcm91dGUucmVkaXJlY3RcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIHJvdXRlLmNvbnRyb2wgPT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdFx0XHR2YXIgbmV3Q3RybCA9ICQoJzxkaXY+Jylcblx0XHRcdFx0XHRcdFx0JCQuY29udHJvbC5jcmVhdGVDb250cm9sKHJvdXRlLmNvbnRyb2wsIG5ld0N0cmwpXG5cdFx0XHRcdFx0XHRcdGVsdC5zYWZlRW1wdHkoKS5hcHBlbmQobmV3Q3RybClcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1tyb3V0ZXJdIE5vIHJvdXRlIGZvdW5kICEnKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFx0fVx0XHRcblxuXG5cdFx0fVxuXG5cdH0pXG5cbn0pKCk7XG5cblxuIiwiJCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMudGFicycsIHtcblx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHR2YXIgdWwgPSAkKCc8dWw+JykucHJlcGVuZFRvKGVsdClcblxuXHRcdGVsdC5jaGlsZHJlbignZGl2JykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0aXRsZSA9ICQodGhpcykuYXR0cigndGl0bGUnKVxuXHRcdFx0dmFyIGlkID0gJCh0aGlzKS51bmlxdWVJZCgpLmF0dHIoJ2lkJylcblx0XHRcdHZhciBsaSA9ICQoJzxsaT4nKVxuXHRcdFx0XHQuYXR0cigndGl0bGUnLCB0aXRsZSlcblx0XHRcdFx0LmFwcGVuZCgkKCc8YT4nLCB7aHJlZjogJyMnICsgaWR9KS50ZXh0KHRpdGxlKSlcblx0XHRcdFx0LmFwcGVuZFRvKHVsKVxuXHRcdFx0aWYgKCQodGhpcykuYXR0cignZGF0YS1yZW1vdmFibGUnKSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bGkuYXBwZW5kKCQoJzxzcGFuPicsIHtjbGFzczogJ3VpLWljb24gdWktaWNvbi1jbG9zZSd9KSlcblx0XHRcdH1cblx0XHR9KVx0XHRcblxuXHRcdGVsdC50YWJzKClcblxuXHR9XG5cbn0pO1xuXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VmFyVmFsdWUoZGF0YSwgdmFyTmFtZSkge1xyXG4gICAgdmFyIHJldCA9IGRhdGFcclxuICAgIGZvcihsZXQgZiBvZiB2YXJOYW1lLnNwbGl0KCcuJykpIHtcclxuICAgICAgXHJcbiAgICAgIGlmICh0eXBlb2YgcmV0ID09ICdvYmplY3QnICYmIGYgaW4gcmV0KSB7XHJcbiAgICAgICAgcmV0ID0gcmV0W2ZdXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZShkYXRhLCB2YXJOYW1lKSB7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygnW0NvcmVdIGdldFZhbHVlJywgdmFyTmFtZSwgY3R4KVxyXG5cclxuICAgIHZhciBub3QgPSBmYWxzZVxyXG4gICAgaWYgKHZhck5hbWUuc3RhcnRzV2l0aCgnIScpKSB7XHJcbiAgICAgIHZhck5hbWUgPSB2YXJOYW1lLnN1YnN0cigxKVxyXG4gICAgICBub3QgPSB0cnVlXHJcbiAgICB9ICAgICBcclxuXHJcbiAgICB2YXIgZnVuYyA9IGRhdGFbdmFyTmFtZV1cclxuICAgIHZhciB2YWx1ZVxyXG5cclxuICAgIGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHZhbHVlID0gZnVuYy5jYWxsKGRhdGEpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFsdWUgPSBnZXRWYXJWYWx1ZShkYXRhLCB2YXJOYW1lKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdib29sZWFuJyAmJiBub3QpIHtcclxuICAgICAgdmFsdWUgPSAhdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVcclxuICB9XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIHNwbGl0QXR0cihhdHRyVmFsdWUsIGNiaykge1xyXG4gIGF0dHJWYWx1ZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgbGV0IFtuYW1lLCB2YWx1ZV0gPSBpLnNwbGl0KCc6JylcclxuICAgIGNiayhuYW1lLnRyaW0oKSwgdmFsdWUudHJpbSgpKVxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5jb25zdCBtYXAgPSB7XHJcbiAgJ2JuLWVhY2gnOiB7dHlwZTogM30sXHJcbiAgJ2JuLXRleHQnOiB7ZjogJ3RleHQnLCB0eXBlOiAxfSxcclxuICAnYm4taHRtbCc6IHtmOiAnaHRtbCcsIHR5cGU6IDF9LFxyXG4gICdibi12YWwnOiB7ZjogJ3NldFZhbHVlJywgdHlwZTogMX0sXHJcbiAgJ2JuLXNob3cnOiB7ZjogJ3NldFZpc2libGUnLCB0eXBlOiAxfSxcclxuICAnYm4tc3R5bGUnOiB7ZjogJ2NzcycsIHR5cGU6IDJ9LFxyXG4gICdibi1hdHRyJzoge2Y6ICdhdHRyJywgdHlwZTogMn0sXHJcbiAgJ2JuLXByb3AnOiB7ZjogJ3Byb3AnLCB0eXBlOiAyfSxcclxuICAnYm4tZGF0YSc6IHtmOiAnc2V0RGF0YScsIHR5cGU6IDJ9LFxyXG4gICdibi1jbGFzcyc6IHtmOiAnc2V0Q2xhc3MnLCB0eXBlOiAyfSxcclxuICAnYm4tY29udHJvbCc6IHt0eXBlOiA0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlKGN0eCwgZGF0YSwgdmFycywgZXhjbHVkZUVsdCkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCd1cGRhdGUnLCB2YXJzKVxyXG5cclxuICBpZiAodHlwZW9mIHZhcnMgPT0gJ3N0cmluZycpIHtcclxuICAgIHZhcnMgPSB2YXJzLnNwbGl0KCcsJylcclxuICB9XHJcblxyXG4gIHZhcnMuZm9yRWFjaChmdW5jdGlvbih2YXJpYWJsZSkge1xyXG4gICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyaWFibGUpXHJcbiAgICBcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgIHVwZGF0ZShjdHgsIGRhdGEsIE9iamVjdC5rZXlzKHZhbHVlKS5tYXAoaSA9PiB2YXJpYWJsZSArICcuJyArIGkpLCBleGNsdWRlRWx0KVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKGN0eFt2YXJpYWJsZV0pIHtcclxuICAgICAgY3R4W3ZhcmlhYmxlXS5mb3JFYWNoKGZ1bmN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgIGxldCB7dHlwZSwgZiwgZWx0LCBuYW1lLCB0ZW1wbGF0ZSwgaXRlcn0gPSBhY3Rpb25cclxuICAgICAgICBpZiAoZWx0ID09IGV4Y2x1ZGVFbHQpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PSAxKSB7XHJcbiAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMikge1xyXG4gICAgICAgICAgIGVsdFtmXS5jYWxsKGVsdCwgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIGlmICh0eXBlID09IDMgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgZWx0LmVtcHR5KClcclxuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGl0ZW1EYXRhID0gJC5leHRlbmQoe30sIGRhdGEpXHJcbiAgICAgICAgICAgICAgaXRlbURhdGFbaXRlcl0gPSBpdGVtXHJcbiAgICAgICAgICAgICAgdmFyICRpdGVtID0gdGVtcGxhdGUuY2xvbmUoKVxyXG4gICAgICAgICAgICAgIHByb2Nlc3MoJGl0ZW0sIGl0ZW1EYXRhKVxyXG4gICAgICAgICAgICAgIGVsdC5hcHBlbmQoJGl0ZW0pICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3NFdmVudHMocm9vdCwgZXZlbnRzKSB7XHJcbiAgcm9vdC5ibkZpbmQoYFtibi1ldmVudF1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgZWx0LnJlbW92ZUF0dHIoJ2JuLWV2ZW50JylcclxuICAgICAgXHJcbiAgICAgIHNwbGl0QXR0cihhdHRyVmFsdWUsIGZ1bmN0aW9uKGV2dE5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgbGV0IGZuICA9IGV2ZW50c1t2YWx1ZV1cclxuICAgICAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHsgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgW25hbWUsIHNlbGVjdG9yXSA9IGV2dE5hbWUuc3BsaXQoJy4nKVxyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RvciAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZWx0Lm9uKG5hbWUsICcuJyArIHNlbGVjdG9yLCBmbilcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlbHQub24obmFtZSwgZm4pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICBcclxuICAgIH0pXHJcbiAgICAgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2Nlc3Mocm9vdCwgZGF0YSwgY3JlYXRlQ29udHJvbCkge1xyXG5cclxuXHJcbiAgbGV0IGN0eCA9IHt9XHJcbiAgXHJcbiAgZm9yKGxldCBkaXIgaW4gbWFwKSB7XHJcbiAgICBcclxuXHJcbiAgICByb290LmJuRmluZChgWyR7ZGlyfV1gKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZWx0ID0gJCh0aGlzKVxyXG4gICAgICBsZXQgYXR0clZhbHVlID0gZWx0LmF0dHIoZGlyKVxyXG4gICAgICBlbHQucmVtb3ZlQXR0cihkaXIpXHJcblxyXG4gICAgICBsZXQge3R5cGUsIGZ9ID0gbWFwW2Rpcl1cclxuICAgICAgXHJcbiAgICAgIGlmICh0eXBlID09IDEpIHtcclxuICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgYXR0clZhbHVlKVxyXG4gICAgICAgICAgLy9lbHQudGV4dChkYXRhW2F0dHJWYWx1ZV0pXHJcbiAgICAgICAgICBlbHRbZl0uY2FsbChlbHQsIHZhbHVlKVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYgKGRpciA9PSAnYm4tdmFsJykge1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZUV2dCA9IGVsdC5hdHRyKCdibi11cGRhdGUnKVxyXG4gICAgICAgICAgaWYgKHVwZGF0ZUV2dCkge1xyXG4gICAgICAgICAgICBlbHQucmVtb3ZlQXR0cignYm4tdXBkYXRlJylcclxuICAgICAgICAgICAgZWx0Lm9uKHVwZGF0ZUV2dCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgcm9vdC50cmlnZ2VyKCdkYXRhOnVwZGF0ZScsIFthdHRyVmFsdWUsIGVsdC5nZXRWYWx1ZSgpLCBlbHRdKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHhbYXR0clZhbHVlXSA9IGN0eFthdHRyVmFsdWVdIHx8IFtdXHJcbiAgICAgICAgY3R4W2F0dHJWYWx1ZV0ucHVzaCh7ZiwgZWx0LCB0eXBlfSkgICAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZSA9PSA0ICYmIHR5cGVvZiBjcmVhdGVDb250cm9sID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBjcmVhdGVDb250cm9sKGF0dHJWYWx1ZSwgZWx0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZSA9PSAyKSB7XHJcblxyXG4gICAgICAgICAgc3BsaXRBdHRyKGF0dHJWYWx1ZSwgZnVuY3Rpb24obmFtZSwgdmFyTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKGRhdGEsIHZhck5hbWUpXHJcbiAgICAgICAgICAgICAgZWx0W2ZdLmNhbGwoZWx0LCBuYW1lLCB2YWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICAgICAgY3R4W3Zhck5hbWVdLnB1c2goe2YsIGVsdCwgdHlwZSwgbmFtZX0pICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgIFxyXG4gICAgICBpZiAodHlwZSA9PSAzKSB7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gZWx0LmNoaWxkcmVuKCkucmVtb3ZlKCkuY2xvbmUoKVxyXG4gICAgICAgIGxldCBbaXRlciwgLCB2YXJOYW1lXSA9IGF0dHJWYWx1ZS5zcGxpdCgnICcpXHJcbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0VmFsdWUoZGF0YSwgdmFyTmFtZSlcclxuICAgICAgICBcclxuICAgICAgICBjdHhbdmFyTmFtZV0gPSBjdHhbdmFyTmFtZV0gfHwgW11cclxuICAgICAgICBjdHhbdmFyTmFtZV0ucHVzaCh7ZWx0LCB0eXBlLCB0ZW1wbGF0ZSwgaXRlcn0pICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZGF0YSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICB2YXIgaXRlbURhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSlcclxuICAgICAgICAgICBpdGVtRGF0YVtpdGVyXSA9IGl0ZW1cclxuICAgICAgICAgICB2YXIgJGl0ZW0gPSB0ZW1wbGF0ZS5jbG9uZSgpXHJcbiAgICAgICAgICAgcHJvY2VzcygkaXRlbSwgaXRlbURhdGEsIGNyZWF0ZUNvbnRyb2wpXHJcbiAgICAgICAgICAgZWx0LmFwcGVuZCgkaXRlbSkgICAgICAgICAgXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgICBcclxuICBcclxuICB9XHJcbiAgXHJcblxyXG4gIHJldHVybiBjdHhcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvY2Vzc0JpbmRpbmdzKHJvb3QpIHtcclxuXHJcbiAgICB2YXIgZGF0YSA9IHt9XHJcblxyXG4gICAgcm9vdC5ibkZpbmQoJ2JuLWJpbmQnLCB0cnVlLCBmdW5jdGlvbihlbHQsIHZhck5hbWUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnYm4tdGV4dCcsIHZhck5hbWUpXHJcbiAgICAgIGRhdGFbdmFyTmFtZV0gPSBlbHRcclxuICAgIH0pXHJcbiAgICByb290LmJuRmluZCgnYm4taWZhY2UnLCB0cnVlLCBmdW5jdGlvbihlbHQsIHZhck5hbWUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnYm4tdGV4dCcsIHZhck5hbWUpXHJcbiAgICAgIGRhdGFbdmFyTmFtZV0gPSBlbHQuaWZhY2UoKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBkYXRhXHJcbiAgXHJcbn1cclxuXHJcbiQkLmJpbmRpbmcgPSB7XHJcbiAgcHJvY2VzcyxcclxuICB1cGRhdGUsXHJcbiAgcHJvY2Vzc0V2ZW50cyxcclxuICBwcm9jZXNzQmluZGluZ3NcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5sZXQgY29udHJvbHMgPSB7fVxyXG5cclxuZnVuY3Rpb24gaXNEZXBzT2soZGVwcykge1xyXG5cdHJldHVybiBkZXBzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcclxuXHJcblx0XHRyZXR1cm4gcHJldiAmJiAoY3VyICE9IHVuZGVmaW5lZClcclxuXHR9LCB0cnVlKVx0XHRcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQ29udHJvbChuYW1lLCBvcHRpb25zKSB7XHJcblx0aWYgKCEkJC51dGlsLmNoZWNrVHlwZShvcHRpb25zLCB7XHJcblx0XHQkZGVwczogWydzdHJpbmcnXSxcclxuXHRcdGluaXQ6ICdmdW5jdGlvbidcclxuXHR9KSkge1xyXG5cdFx0Y29uc29sZS5lcnJvcihgW0NvcmVdIHJlZ2lzdGVyQ29udHJvbDogYmFkIG9wdGlvbnNgLCBvcHRpb25zKVxyXG5cdFx0cmV0dXJuXHJcblx0fVxyXG5cclxuXHJcblx0dmFyIGRlcHMgPSBvcHRpb25zLmRlcHMgfHwgW11cclxuXHJcblx0Y29uc29sZS5sb2coYFtDb3JlXSByZWdpc3RlciBjb250cm9sICcke25hbWV9JyB3aXRoIGRlcHNgLCBkZXBzKVxyXG5cclxuXHRjb250cm9sc1tuYW1lXSA9IHtkZXBzLCBvcHRpb25zLCBzdGF0dXM6ICdub3Rsb2FkZWQnfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDb250cm9sKG5hbWUpIHtcclxuXHR2YXIgcmV0ID0gY29udHJvbHNbbmFtZV1cclxuXHRpZiAocmV0ICYmIHJldC5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdHJldC5kZXBzID0gJCQuc2VydmljZS5nZXRTZXJ2aWNlcyhyZXQuZGVwcylcclxuXHRcdHJldC5zdGF0dXMgPSBpc0RlcHNPayhyZXQuZGVwcykgPyAnb2snIDogJ2tvJ1xyXG5cdH1cclxuXHRyZXR1cm4gcmV0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2woY29udHJvbE5hbWUsIGVsdCkge1xyXG5cdGVsdC5hZGRDbGFzcyhjb250cm9sTmFtZS5yZXBsYWNlKCcuJywgJy0nKSlcclxuXHRlbHQuYWRkQ2xhc3MoJ0N1c3RvbUNvbnRyb2wnKS51bmlxdWVJZCgpXHRcclxuXHR2YXIgY3RybCA9IGdldENvbnRyb2woY29udHJvbE5hbWUpXHJcblx0XHRcclxuXHRpZiAoY3RybCA9PSB1bmRlZmluZWQpIHtcclxuXHRcdHRocm93KGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKCdjcmVhdGVDb250cm9sJywgY29udHJvbE5hbWUsIGN0cmwpXHJcblx0aWYgKGN0cmwuc3RhdHVzID09PSAgJ29rJykge1xyXG5cdFx0XHJcblx0XHR2YXIgaWZhY2UgPSB7XHJcblx0XHRcdHByb3BzOiB7fSxcclxuXHRcdFx0bmFtZTogY29udHJvbE5hbWVcclxuXHRcdH1cclxuXHJcblx0XHRsZXQge2luaXQsIHByb3BzLCB0ZW1wbGF0ZX0gPSBjdHJsLm9wdGlvbnNcclxuXHRcdHByb3BzID0gcHJvcHMgfHwge31cclxuXHJcblx0XHRPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wTmFtZSkge1xyXG5cdFx0XHRpZmFjZS5wcm9wc1twcm9wTmFtZV0gPSBlbHQuZGF0YShwcm9wTmFtZSkgfHwgcHJvcHNbcHJvcE5hbWVdXHJcblx0XHR9KVxyXG5cclxuXHRcdGlmICh0eXBlb2YgdGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0JCh0ZW1wbGF0ZSkuYXBwZW5kVG8oZWx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG5cdFx0XHR0ZW1wbGF0ZS5jaGlsZHJlbigpLmNsb25lKCkuYXBwZW5kVG8oZWx0KVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0eXBlb2YgaW5pdCA9PSAnZnVuY3Rpb24nKSB7XHJcblxyXG5cdFx0XHR2YXIgYXJncyA9IFtlbHRdLmNvbmNhdChjdHJsLmRlcHMpXHJcblx0XHRcdGluaXQuYXBwbHkoaWZhY2UsIGFyZ3MpXHJcblx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2UgY29udHJvbCAnJHtjb250cm9sTmFtZX0nIHdpdGggcHJvcHNgLCBpZmFjZS5wcm9wcylcclxuXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKGBbQ29yZV0gY29udHJvbCAnJHtjb250cm9sTmFtZX0nIG1pc3NpbmcgaW5pdCBmdW5jdGlvbmApXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGVsdC5nZXQoMCkuY3RybCA9IGlmYWNlXHJcblx0XHRcclxuXHRcdHJldHVybiBpZmFjZVx0XHRcdFx0XHJcblx0fVxyXG5cclxuXHJcblxyXG59XHJcblxyXG4kJC5jb250cm9sID0ge1xyXG5cdHJlZ2lzdGVyQ29udHJvbCxcclxuXHRjcmVhdGVDb250cm9sXHJcbn1cclxuXHJcbn0pKCk7XHJcbiIsIiQkLmRpYWxvZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGRpdiA9ICQoJzxkaXY+Jywge3RpdGxlOiBvcHRpb25zLnRpdGxlIHx8ICdEaWFsb2cnfSlcclxuXHJcblx0aWYgKHR5cGVvZiBvcHRpb25zLnRlbXBsYXRlID09ICdzdHJpbmcnKSB7XHJcblx0XHQkKG9wdGlvbnMudGVtcGxhdGUpLmFwcGVuZFRvKGRpdilcclxuXHR9XHRcclxuXHJcblx0dmFyIGN0cmwgPSAkJC52aWV3Q29udHJvbGxlcihkaXYsIG9wdGlvbnMpXHJcblxyXG5cdHZhciBkbGdPcHRpb25zID0gJC5leHRlbmQoe1xyXG5cdFx0YXV0b09wZW46IGZhbHNlLFxyXG5cdFx0bW9kYWw6IHRydWUsXHJcblx0XHR3aWR0aDogJ2F1dG8nLFx0XHRcclxuXHR9LCBvcHRpb25zKVxyXG5cclxuXHR2YXIgcHJpdmF0ZSA9IHt9XHJcblxyXG5cdC8vY29uc29sZS5sb2coJ2RsZ09wdGlvbnMnLCBkbGdPcHRpb25zKVxyXG5cclxuXHRkaXYuZGlhbG9nKGRsZ09wdGlvbnMpXHJcblxyXG5cdGN0cmwuc2hvdyA9IGZ1bmN0aW9uKG9uQXBwbHkpIHtcclxuXHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcclxuXHRcdGRpdi5kaWFsb2coJ29wZW4nKVxyXG5cdH1cclxuXHJcblx0Y3RybC5oaWRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdjbG9zZScpXHJcblx0fVxyXG5cclxuXHRjdHJsLmFwcGx5ID0gZnVuY3Rpb24ocmV0VmFsdWUpIHtcclxuXHRcdGN0cmwuaGlkZSgpXHJcblx0XHRpZiAodHlwZW9mIHByaXZhdGUub25BcHBseSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHByaXZhdGUub25BcHBseShyZXRWYWx1ZSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGN0cmwuc2V0T3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uTmFtZSwgdmFsdWUpIHtcclxuXHRcdGRpdi5kaWFsb2coJ29wdGlvbicsIG9wdGlvbk5hbWUsIHZhbHVlKVxyXG5cdH1cclxuXHJcblx0Y3RybC5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRkaXYuZGlhbG9nKCdkZXN0cm95JylcclxuXHR9XHJcblxyXG5cdHJldHVybiBjdHJsXHJcbn07XHJcbiIsIiQkLmZvcm1EaWFsb2dDb250cm9sbGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBkaXYgPSAkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZSB8fCAnRGlhbG9nJ30pXHJcblxyXG5cdHZhciBwcml2YXRlID0ge31cclxuXHJcblx0dmFyIGZvcm0gPSAkKCc8Zm9ybT4nKVxyXG5cdFx0LmFwcGVuZFRvKGRpdilcclxuXHRcdC5vbignc3VibWl0JywgZnVuY3Rpb24oZXYpIHtcclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRkaXYuZGlhbG9nKCdjbG9zZScpXHJcblx0XHRcdGlmICh0eXBlb2YgcHJpdmF0ZS5vbkFwcGx5ID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRwcml2YXRlLm9uQXBwbHkoJCh0aGlzKS5nZXRGb3JtRGF0YSgpKVxyXG5cdFx0XHRcdCQodGhpcykucmVzZXRGb3JtKClcclxuXHRcdFx0fVx0XHRcdFx0XHJcblx0XHR9KVxyXG5cclxuXHRpZiAodHlwZW9mIG9wdGlvbnMudGVtcGxhdGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdCQob3B0aW9ucy50ZW1wbGF0ZSkuYXBwZW5kVG8oZm9ybSlcclxuXHR9XHRcclxuXHJcblx0aWYgKG9wdGlvbnMudGVtcGxhdGUgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuXHRcdG9wdGlvbnMudGVtcGxhdGUuY2hpbGRyZW4oKS5jbG9uZSgpLmFwcGVuZFRvKGZvcm0pXHJcblx0fVxyXG5cclxuXHR2YXIgc3VibWl0QnRuID0gJCgnPGlucHV0PicsIHt0eXBlOiAnc3VibWl0JywgaGlkZGVuOiB0cnVlfSkuYXBwZW5kVG8oZm9ybSlcclxuXHJcblx0dmFyIGRsZ09wdGlvbnMgPSAkLmV4dGVuZCh7XHJcblx0XHRhdXRvT3BlbjogZmFsc2UsXHJcblx0XHRtb2RhbDogdHJ1ZSxcclxuXHRcdHdpZHRoOiAnYXV0bycsXHRcclxuXHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0J0NhbmNlbCc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXHJcblx0XHRcdH0sXHJcblx0XHRcdCdBcHBseSc6IGZ1bmN0aW9uKCkge1x0XHRcdFx0XHRcclxuXHRcdFx0XHRzdWJtaXRCdG4uY2xpY2soKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwgb3B0aW9ucylcclxuXHJcblxyXG5cdGRpdi5kaWFsb2coZGxnT3B0aW9ucylcclxuXHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRzaG93OiBmdW5jdGlvbihvbkFwcGx5KSB7XHJcblx0XHRcdHByaXZhdGUub25BcHBseSA9IG9uQXBwbHlcdFx0XHRcclxuXHRcdFx0ZGl2LmRpYWxvZygnb3BlbicpXHRcdFx0XHJcblx0XHR9LFxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRmb3JtLnNldEZvcm1EYXRhKGRhdGEpXHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9LFxyXG5cclxuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRkaXYuZGlhbG9nKCdkZXN0cm95JylcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsIihmdW5jdGlvbigpe1xyXG5cclxuXHJcbiQuZm4uYm5GaW5kPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgcmV0dXJuIHRoaXMuZmluZChzZWxlY3RvcikuYWRkKHRoaXMuZmlsdGVyKHNlbGVjdG9yKSlcclxufVxyXG5cclxuJC5mbi5zZXRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgaXNBY3RpdmUpIHtcclxuICAgIGlmIChpc0FjdGl2ZSkge1xyXG4gICAgICB0aGlzLmFkZENsYXNzKGNsYXNzTmFtZSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSlcclxuICAgIH1cclxufVxyXG5cclxuJC5mbi5zZXRWaXNpYmxlID0gZnVuY3Rpb24oaXNWaXNpYmxlKSB7XHJcbiAgICBpZiAoaXNWaXNpYmxlKSB7XHJcbiAgICAgIHRoaXMuc2hvdygpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlKClcclxuICAgIH1cclxufVxyXG5cclxuJC5mbi5pZmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmdldCgwKS5jdHJsXHJcbn1cclxuXHJcbiQuZm4uc2V0RGF0YSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuXHJcbiAgY29uc3QgZnVuY05hbWUgPSAnc2V0JyArIG5hbWUuc3Vic3RyKDAsMSkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpXHJcbiAgLy9jb25zb2xlLmxvZygnZnVuY05hbWUnLCBmdW5jTmFtZSlcclxuXHJcbiAgaWYgKGlmYWNlICYmIGlmYWNlLnByb3BzW25hbWVdICYmIHR5cGVvZiBpZmFjZVtmdW5jTmFtZV0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgaWZhY2VbZnVuY05hbWVdKHZhbHVlKVxyXG4gIH1cclxuICBlbHNlIGlmIChpZmFjZSAmJiAkJC5pc1ZpZXdDb250cm9sbGVyKGlmYWNlLmN0cmwpICYmIGlmYWNlLmN0cmwubW9kZWxbbmFtZV0pIHtcclxuICAgIGlmYWNlLmN0cmwuc2V0RGF0YShuYW1lLCB2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLmRhdGEobmFtZSwgdmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG4kLmZuLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHRoaXMuYXR0cigndHlwZScpID09ICdjaGVja2JveCcpIHtcclxuICAgIHRoaXMucHJvcCgnY2hlY2tlZCcsIHZhbHVlKVxyXG4gICAgcmV0dXJuXHJcbiAgfSAgXHJcbiAgY29uc3QgaWZhY2UgPSB0aGlzLmlmYWNlKClcclxuXHJcbiAgaWYgKGlmYWNlICYmIHR5cGVvZiBpZmFjZS5zZXRWYWx1ZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBpZmFjZS5zZXRWYWx1ZSh2YWx1ZSlcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLnZhbCh2YWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbiQuZm4uZ2V0VmFsdWUgPSBmdW5jdGlvbigpIHtcclxuICBjb25zdCB0eXBlID0gdGhpcy5hdHRyKCd0eXBlJylcclxuICBpZiAodGhpcy5nZXQoMCkudGFnTmFtZSA9PSAnSU5QVVQnICYmIHR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcCgnY2hlY2tlZCcpXHJcbiAgfSAgICBcclxuICBjb25zdCBpZmFjZSA9IHRoaXMuaWZhY2UoKVxyXG4gIGlmIChpZmFjZSAmJiB0eXBlb2YgaWZhY2UuZ2V0VmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgcmV0dXJuIGlmYWNlLmdldFZhbHVlKClcclxuICB9XHJcbiAgdmFyIHJldCA9IHRoaXMudmFsKClcclxuXHJcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAncmFuZ2UnKSB7XHJcbiAgICByZXQgPSBwYXJzZUZsb2F0KHJldClcclxuICB9XHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLmdldEZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHJldCA9IHt9XHJcbiAgdGhpcy5maW5kKCdbbmFtZV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGVsdCA9ICQodGhpcylcclxuICAgIHZhciBuYW1lID0gZWx0LmF0dHIoJ25hbWUnKVxyXG4gICAgcmV0W25hbWVdID0gZWx0LmdldFZhbHVlKClcclxuXHJcbiAgfSlcclxuXHJcbiAgcmV0dXJuIHJldFxyXG59XHJcblxyXG4kLmZuLnJlc2V0Rm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLmdldCgwKS50YWdOYW1lID09IFwiRk9STVwiKSB7XHJcbiAgICB0aGlzLmdldCgwKS5yZXNldCgpXHJcbiAgfSAgIFxyXG59XHJcblxyXG4kLmZuLnNldEZvcm1EYXRhID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAvL2NvbnNvbGUubG9nKCdzZXRGb3JtRGF0YScsIGRhdGEpXHJcbiAgdGhpcy5yZXNldEZvcm0oKVxyXG5cclxuICBmb3IodmFyIG5hbWUgaW4gZGF0YSkge1xyXG4gICAgdmFyIHZhbHVlID0gZGF0YVtuYW1lXVxyXG4gICAgdmFyIGVsdCA9IHRoaXMuZmluZChgW25hbWU9JHtuYW1lfV1gKVxyXG4gICAgaWYgKGVsdC5sZW5ndGgpIHtcclxuICAgICAgZWx0LnNldFZhbHVlKHZhbHVlKSAgICAgICBcclxuICAgIH1cclxuXHJcbiAgXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG4kLmZuLnNhZmVFbXB0eSA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuZmluZCgnLkN1c3RvbUNvbnRyb2wnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgaWZhY2UgPSAkKHRoaXMpLmlmYWNlKClcclxuXHJcbiAgICBpZiAodHlwZW9mIGlmYWNlLmRpc3Bvc2UgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBpZmFjZS5kaXNwb3NlKClcclxuICAgIH1cclxuICB9KVxyXG5cclxuICB0aGlzLmVtcHR5KClcclxuXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiXHJcbihmdW5jdGlvbigpe1xyXG5cclxubGV0IHNlcnZpY2VzID0ge31cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNlcnZpY2VzKGRlcHMpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdbQ29yZV0gZ2V0U2VydmljZXMnLCBkZXBzKVxyXG5cdHJldHVybiBkZXBzLm1hcChmdW5jdGlvbihkZXBOYW1lKSB7XHJcblx0XHR2YXIgc3J2ID0gc2VydmljZXNbZGVwTmFtZV1cclxuXHRcdGlmIChzcnYpIHtcclxuXHRcdFx0aWYgKHNydi5zdGF0dXMgPT0gJ25vdGxvYWRlZCcpIHtcclxuXHRcdFx0XHR2YXIgZGVwczIgPSBnZXRTZXJ2aWNlcyhzcnYuZGVwcylcclxuXHRcdFx0XHR2YXIgY29uZmlnID0gc3J2LmNvbmZpZyB8fCB7fVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBbQ29yZV0gaW5zdGFuY2Ugc2VydmljZSAnJHtkZXBOYW1lfScgd2l0aCBjb25maWdgLCBjb25maWcpXHJcblx0XHRcdFx0dmFyIGFyZ3MgPSBbY29uZmlnXS5jb25jYXQoZGVwczIpXHJcblx0XHRcdFx0c3J2Lm9iaiA9IHNydi5mbi5hcHBseShudWxsLCBhcmdzKVxyXG5cdFx0XHRcdHNydi5zdGF0dXMgPSAncmVhZHknXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHNydi5vYmpcdFx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vc3J2LnN0YXR1cyA9ICdub3RyZWdpc3RlcmVkJ1xyXG5cdFx0XHR0aHJvdyhgW0NvcmVdIHNlcnZpY2UgJyR7ZGVwTmFtZX0nIGlzIG5vdCByZWdpc3RlcmVkYClcclxuXHRcdH1cclxuXHJcblx0fSlcclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBjb25maWd1cmVTZXJ2aWNlKG5hbWUsIGNvbmZpZykge1xyXG5cdGNvbnNvbGUubG9nKCdbQ29yZV0gY29uZmlndXJlU2VydmljZScsIG5hbWUsIGNvbmZpZylcclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGNvbmZpZyAhPSAnb2JqZWN0Jykge1xyXG5cdFx0Y29uc29sZS53YXJuKCdbQ29yZV0gY29uZmlndXJlU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHRcdHJldHVyblxyXG5cdH0gXHRcclxuXHJcblx0dmFyIHNydiA9IHNlcnZpY2VzW25hbWVdXHJcblx0aWYgKHNydikge1xyXG5cdFx0c3J2LmNvbmZpZyA9IGNvbmZpZ1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdHRocm93KGBbY29uZmlndXJlU2VydmljZV0gc2VydmljZSAnJHtuYW1lfScgaXMgbm90IHJlZ2lzdGVyZWRgKVxyXG5cdH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZShuYW1lLCBhcmcxLCBhcmcyKSB7XHJcblx0dmFyIGRlcHMgPSBbXVxyXG5cdHZhciBmbiA9IGFyZzFcclxuXHRpZiAoQXJyYXkuaXNBcnJheShhcmcxKSkge1xyXG5cdFx0ZGVwcyA9IGFyZzFcclxuXHRcdGZuID0gYXJnMlxyXG5cdH1cclxuXHRpZiAodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGZuID09ICd1bmRlZmluZWQnIHx8ICFBcnJheS5pc0FycmF5KGRlcHMpKSB7XHJcblx0XHR0aHJvdygnW0NvcmVdIHJlZ2lzdGVyU2VydmljZSBjYWxsZWQgd2l0aCBiYWQgYXJndW1lbnRzJylcclxuXHR9IFxyXG5cdGNvbnNvbGUubG9nKGBbQ29yZV0gcmVnaXN0ZXIgc2VydmljZSAnJHtuYW1lfScgd2l0aCBkZXBzYCwgZGVwcylcclxuXHJcblx0c2VydmljZXNbbmFtZV0gPSB7ZGVwcywgZm4sIHN0YXR1czogJ25vdGxvYWRlZCd9XHJcbn1cclxuXHJcbiQkLnNlcnZpY2UgPSB7XHJcblx0cmVnaXN0ZXJTZXJ2aWNlLFxyXG5cdGNvbmZpZ3VyZVNlcnZpY2UsXHJcblx0Z2V0U2VydmljZXNcclxufVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XG5cbmZ1bmN0aW9uIHNob3dBbGVydChvcHRpb25zLCBjYWxsYmFjaykge1xuXG5cdG9wdGlvbnMgPSAkLmV4dGVuZCh7XG5cdFx0dGl0bGU6ICdBbGVydCcsXG5cdFx0Y29udGVudDogJycsXG5cdFx0c2hvd0NhbmNlbDogZmFsc2Vcblx0fSwgb3B0aW9ucylcblxuXHRvcHRpb25zLm1vZGVsID0gdHJ1ZVxuXHRvcHRpb25zLmNsb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS5kaWFsb2coJ2Rlc3Ryb3knKVxuXHR9XG5cdG9wdGlvbnMuYnV0dG9ucyA9IHtcblx0XHQnT0snOiBmdW5jdGlvbigpIHtcblx0XHRcdCQodGhpcykuZGlhbG9nKCdjbG9zZScpXG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRpZiAob3B0aW9ucy5zaG93Q2FuY2VsKSB7XG5cdFx0b3B0aW9ucy5idXR0b25zWydDYW5jZWwnXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCh0aGlzKS5kaWFsb2coJ2Nsb3NlJylcblx0XHR9XG5cdH1cblxuXHQkKCc8ZGl2PicsIHt0aXRsZTogb3B0aW9ucy50aXRsZX0pXG5cdFx0LmFwcGVuZCgkKCc8cD4nKS5odG1sKG9wdGlvbnMuY29udGVudCkpXG5cdFx0LmRpYWxvZyhvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzaG93Q29uZmlybShvcHRpb25zLCBjYWxsYmFjaykge1xuXHRvcHRpb25zLnNob3dDYW5jZWwgPSB0cnVlXG5cdHNob3dBbGVydChvcHRpb25zLCBjYWxsYmFjaylcbn1cblxuZnVuY3Rpb24gc2hvd1Byb21wdChvcHRpb25zLCBjYWxsYmFjaykge1xuXG5cdGNvbnN0IGxhYmVsID0gb3B0aW9ucy5sYWJlbCB8fCAnJ1xuXG5cdG9wdGlvbnMudGVtcGxhdGUgPSBgXG5cdDxwPiR7bGFiZWx9PC9wPlxuXHQ8aW5wdXQgdHlwZT1cInRleHRcIiByZXF1aXJlZD1cIlwiIG5hbWU9XCJ2YWx1ZVwiPlxuXHRgXG5cblx0b3B0aW9ucy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykuZGlhbG9nKCdkZXN0cm95Jylcblx0fVxuXG5cdCQkLmZvcm1EaWFsb2dDb250cm9sbGVyKG9wdGlvbnMpXG5cdC5zaG93KGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNhbGxiYWNrKGRhdGEudmFsdWUpXG5cdFx0fVxuXHR9KVxufVxuXG4kJC51aSA9IHtcblx0c2hvd0FsZXJ0LFxuXHRzaG93Q29uZmlybSxcblx0c2hvd1Byb21wdFxufVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHJcblxyXG5mdW5jdGlvbiByZWFkVGV4dEZpbGUoZmlsZU5hbWUsIG9uUmVhZCkge1xyXG5cdHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG5cclxuXHRmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBvblJlYWQgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRvblJlYWQoZmlsZVJlYWRlci5yZXN1bHQpXHJcblx0XHR9XHJcblx0fVxyXG5cdGZpbGVSZWFkZXIucmVhZEFzVGV4dChmaWxlTmFtZSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlYWRGaWxlQXNEYXRhVVJMKGZpbGVOYW1lLCBvblJlYWQpIHtcclxuXHR2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcclxuXHJcblx0ZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0eXBlb2Ygb25SZWFkID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0b25SZWFkKGZpbGVSZWFkZXIucmVzdWx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZU5hbWUpXHJcbn1cclxuXHJcblxyXG52YXIgaW5wdXRGaWxlID0gJCgnPGlucHV0PicsIHt0eXBlOiAnZmlsZSd9KS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcblx0dmFyIG9uQXBwbHkgPSAkKHRoaXMpLmRhdGEoJ29uQXBwbHknKVxyXG5cdHZhciBmaWxlTmFtZSA9IHRoaXMuZmlsZXNbMF1cclxuXHRpZiAodHlwZW9mIG9uQXBwbHkgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0b25BcHBseShmaWxlTmFtZSlcclxuXHR9XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBvcGVuRmlsZURpYWxvZyhvbkFwcGx5KSB7XHJcblx0aW5wdXRGaWxlLmRhdGEoJ29uQXBwbHknLCBvbkFwcGx5KVxyXG5cdGlucHV0RmlsZS5jbGljaygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSW1hZ2UoZmlsZU5hbWUpIHtcclxuXHRyZXR1cm4gKC9cXC4oZ2lmfGpwZ3xqcGVnfHBuZykkL2kpLnRlc3QoZmlsZU5hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRhdGFVUkx0b0Jsb2IoZGF0YVVSTCkge1xyXG4gIC8vIERlY29kZSB0aGUgZGF0YVVSTFxyXG4gIGNvbnN0IFsgLCBtaW1lVHlwZSwgZW5jb2RhZ2UsIGRhdGFdID0gZGF0YVVSTC5zcGxpdCgvWzosO10vKVxyXG4gIGlmIChlbmNvZGFnZSAhPSAnYmFzZTY0Jykge1xyXG4gIFx0cmV0dXJuXHJcbiAgfVxyXG5cclxuICAvL2NvbnNvbGUubG9nKCdtaW1lVHlwZScsIG1pbWVUeXBlKVxyXG4gIC8vY29uc29sZS5sb2coJ2VuY29kYWdlJywgZW5jb2RhZ2UpXHJcbiAgLy9jb25zb2xlLmxvZygnZGF0YScsIGRhdGEpXHJcblxyXG4gIHZhciBiaW5hcnkgPSBhdG9iKGRhdGEpXHJcbiAvLyBDcmVhdGUgOC1iaXQgdW5zaWduZWQgYXJyYXlcclxuICB2YXIgYXJyYXkgPSBbXVxyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBiaW5hcnkubGVuZ3RoOyBpKyspIHtcclxuICBcdGFycmF5LnB1c2goYmluYXJ5LmNoYXJDb2RlQXQoaSkpXHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gb3VyIEJsb2Igb2JqZWN0XHJcblx0cmV0dXJuIG5ldyBCbG9iKFsgbmV3IFVpbnQ4QXJyYXkoYXJyYXkpIF0sIHttaW1lVHlwZX0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTdHlsZShzdHlsZUZpbGVQYXRoLCBjYWxsYmFjaykge1x0XHJcblx0Ly9jb25zb2xlLmxvZygnW0NvcmVdIGxvYWRTdHlsZScsIHN0eWxlRmlsZVBhdGgpXHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgY3NzT2sgPSAkKCdoZWFkJykuZmluZChgbGlua1tocmVmPVwiJHtzdHlsZUZpbGVQYXRofVwiXWApLmxlbmd0aFxyXG5cdFx0aWYgKGNzc09rICE9IDEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYGxvYWRpbmcgJyR7c3R5bGVGaWxlUGF0aH0nIHN0eWxlYClcclxuXHRcdFx0JCgnPGxpbms+Jywge2hyZWY6IHN0eWxlRmlsZVBhdGgsIHJlbDogJ3N0eWxlc2hlZXQnfSlcclxuXHRcdFx0Lm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCcke3N0eWxlRmlsZVBhdGh9JyBsb2FkZWRgKVxyXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LmFwcGVuZFRvKCQoJ2hlYWQnKSlcclxuXHRcdH1cclxuXHR9KVxyXG59XHJcblxyXG5cclxuXHJcblx0XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KGEpIHtcclxuXHRyZXR1cm4gKHR5cGVvZiBhID09ICdvYmplY3QnKSAmJiAhQXJyYXkuaXNBcnJheShhKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1R5cGUodmFsdWUsIHR5cGUsIGlzT3B0aW9uYWwpIHtcclxuXHQvL2NvbnNvbGUubG9nKCdjaGVja1R5cGUnLHZhbHVlLCB0eXBlLCBpc09wdGlvbmFsKVxyXG5cdGlmICh0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgJiYgaXNPcHRpb25hbCA9PT0gdHJ1ZSkge1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblxyXG5cdGlmICh0eXBlb2YgdHlwZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSB0eXBlXHJcblx0fVxyXG5cclxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdGlmICghQXJyYXkuaXNBcnJheSh0eXBlKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZS5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZSAvLyBubyBpdGVtIHR5cGUgY2hlY2tpbmdcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSBvZiB2YWx1ZSkge1xyXG5cdFx0XHR2YXIgcmV0ID0gZmFsc2VcclxuXHRcdFx0Zm9yKGxldCB0IG9mIHR5cGUpIHtcclxuXHRcdFx0XHRyZXQgfD0gY2hlY2tUeXBlKGksIHQpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFyZXQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHJcblx0fVxyXG5cclxuXHRpZiAoaXNPYmplY3QodHlwZSkpIHtcclxuXHRcdGlmICghaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBmIGluIHR5cGUpIHtcclxuXHJcblx0XHRcdC8vY29uc29sZS5sb2coJ2YnLCBmLCAndmFsdWUnLCB2YWx1ZSlcclxuXHRcdFx0dmFyIG5ld1R5cGUgPSB0eXBlW2ZdXHJcblxyXG5cdFx0XHR2YXIgaXNPcHRpb25hbCA9IGZhbHNlXHJcblx0XHRcdGlmIChmLnN0YXJ0c1dpdGgoJyQnKSkge1xyXG5cdFx0XHRcdGYgPSBmLnN1YnN0cigxKVxyXG5cdFx0XHRcdGlzT3B0aW9uYWwgPSB0cnVlXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFjaGVja1R5cGUodmFsdWVbZl0sIG5ld1R5cGUsIGlzT3B0aW9uYWwpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlXHJcbn1cdFxyXG5cclxuXHJcblxyXG4kJC51dGlsID0ge1xyXG5cdHJlYWRUZXh0RmlsZSxcclxuXHRyZWFkRmlsZUFzRGF0YVVSTCxcclxuXHRvcGVuRmlsZURpYWxvZyxcclxuXHRpc0ltYWdlLFxyXG5cdGRhdGFVUkx0b0Jsb2IsXHJcblx0bG9hZFN0eWxlLFxyXG5cdGNoZWNrVHlwZVxyXG59XHJcblxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCl7XHJcblxyXG5jbGFzcyBWaWV3Q29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbHQsIG9wdGlvbnMpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnVmlld0NvbnRyb2xsZXInLCBvcHRpb25zKVxyXG4gICAgXHRpZiAodHlwZW9mIGVsdCA9PSAnc3RyaW5nJykge1xyXG4gICAgXHRcdGVsdCA9ICQoZWx0KVxyXG4gICAgXHR9XHJcbiAgICAgICAgaWYgKGVsdC5oYXNDbGFzcygnQ3VzdG9tQ29udHJvbCcpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2RvblxcJ3QgdXNlIHZpZXdDb250cm9sbGVyIG9uIGNvbnRyb2wgdGFnJylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKVxyXG4gICAgICAgIHRoaXMuZWx0ID0gZWx0XHJcblxyXG4gICAgICAgIGVsdC5vbignZGF0YTp1cGRhdGUnLCAoZXYsIG5hbWUsIHZhbHVlLCBleGNsdWRlRWx0KSA9PiB7XHJcbiAgICAgICAgXHQvL2NvbnNvbGUubG9nKCdbVmlld0NvbnRyb2xsZXJdIGRhdGE6Y2hhbmdlJywgbmFtZSwgdmFsdWUpXHJcbiAgICAgICAgXHR0aGlzLnNldERhdGEobmFtZSwgdmFsdWUsIGV4Y2x1ZGVFbHQpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5tb2RlbCA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLmRhdGEpXHJcbiAgICAgICAgdGhpcy5ydWxlcyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLnJ1bGVzKVxyXG4gICAgICAgIHRoaXMud2F0Y2hlcyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLndhdGNoZXMpXHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGF1dG9tYXRpYyBydWxlcyBmb3IgY29tcHV0ZWQgZGF0YSAoYWthIGZ1bmN0aW9uKVxyXG4gICAgICAgIGZvcih2YXIgayBpbiB0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgXHR2YXIgZGF0YSA9IHRoaXMubW9kZWxba11cclxuICAgICAgICBcdGlmICh0eXBlb2YgZGF0YSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgXHRcdHZhciBmdW5jVGV4dCA9IGRhdGEudG9TdHJpbmcoKVxyXG4gICAgICAgIFx0XHQvL2NvbnNvbGUubG9nKCdmdW5jVGV4dCcsIGZ1bmNUZXh0KVxyXG4gICAgICAgIFx0XHR2YXIgcnVsZXMgPSBbXVxyXG4gICAgICAgIFx0XHRmdW5jVGV4dC5yZXBsYWNlKC90aGlzLihbYS16QS1aMC05Xy1dezEsfSkvZywgZnVuY3Rpb24obWF0Y2gsIGNhcHR1cmVPbmUpIHtcclxuICAgICAgICBcdFx0XHQvL2NvbnNvbGUubG9nKCdjYXB0dXJlT25lJywgY2FwdHVyZU9uZSlcclxuICAgICAgICBcdFx0XHRydWxlcy5wdXNoKGNhcHR1cmVPbmUpXHJcbiAgICAgICAgXHRcdH0pXHJcbiAgICAgICAgXHRcdHRoaXMucnVsZXNba10gPSBydWxlcy50b1N0cmluZygpXHJcbiAgICAgICAgXHR9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdydWxlcycsIHRoaXMucnVsZXMpXHJcbiAgICAgICAgdGhpcy5jdHggPSAkJC5iaW5kaW5nLnByb2Nlc3MoZWx0LCB0aGlzLm1vZGVsLCAkJC5jb250cm9sLmNyZWF0ZUNvbnRyb2wpXHJcblxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuZXZlbnRzID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICQkLmJpbmRpbmcucHJvY2Vzc0V2ZW50cyhlbHQsIG9wdGlvbnMuZXZlbnRzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY29wZSA9ICQkLmJpbmRpbmcucHJvY2Vzc0JpbmRpbmdzKGVsdClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdzY29wZScsIHRoaXMuc2NvcGUpXHJcbiAgICAgICBcclxuXHJcbiAgICB9IFxyXG5cclxuICAgIHNldERhdGEoYXJnMSwgYXJnMiwgZXhjbHVkZUVsdCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gc2V0RGF0YScsIGFyZzEsIGFyZzIpXHJcbiAgICAgICAgdmFyIGRhdGEgPSBhcmcxXHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcxID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgXHRkYXRhID0ge31cclxuICAgICAgICBcdGRhdGFbYXJnMV0gPSBhcmcyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ1tWaWV3Q29udHJvbGxlcl0gc2V0RGF0YScsIGRhdGEpXHJcbiAgICAgICAgJC5leHRlbmQodGhpcy5tb2RlbCwgZGF0YSlcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdtb2RlbCcsIHRoaXMubW9kZWwpXHJcbiAgICAgICAgdGhpcy51cGRhdGUoT2JqZWN0LmtleXMoZGF0YSksIGV4Y2x1ZGVFbHQpXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGZpZWxkc05hbWUsIGV4Y2x1ZGVFbHQpIHtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnW1ZpZXdDb250cm9sbGVyXSB1cGRhdGUnLCBmaWVsZHNOYW1lKVxyXG4gICAgXHRpZiAodHlwZW9mIGZpZWxkc05hbWUgPT0gJ3N0cmluZycpIHtcclxuICAgIFx0XHRmaWVsZHNOYW1lID0gZmllbGRzTmFtZS5zcGxpdCgnLCcpXHJcbiAgICBcdH1cclxuXHJcblxyXG4gICAgXHRpZiAoQXJyYXkuaXNBcnJheShmaWVsZHNOYW1lKSkge1xyXG4gICAgXHRcdHZhciBmaWVsZHNTZXQgPSB7fVxyXG4gICAgXHRcdGZpZWxkc05hbWUuZm9yRWFjaCgoZmllbGQpID0+IHtcclxuXHJcbiAgICBcdFx0XHR2YXIgd2F0Y2ggPSB0aGlzLndhdGNoZXNbZmllbGRdXHJcbiAgICBcdFx0XHRpZiAodHlwZW9mIHdhdGNoID09ICdmdW5jdGlvbicpIHtcclxuICAgIFx0XHRcdFx0d2F0Y2guY2FsbChudWxsLCB0aGlzLm1vZGVsW2ZpZWxkXSlcclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHRcdGZpZWxkc1NldFtmaWVsZF0gPSAxXHJcblxyXG4gICAgXHRcdFx0Zm9yKHZhciBydWxlIGluIHRoaXMucnVsZXMpIHtcclxuICAgIFx0XHRcdFx0aWYgKHRoaXMucnVsZXNbcnVsZV0uc3BsaXQoJywnKS5pbmRleE9mKGZpZWxkKSAhPSAtMSkge1xyXG4gICAgXHRcdFx0XHRcdGZpZWxkc1NldFtydWxlXSA9IDFcclxuICAgIFx0XHRcdFx0fVxyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdH0pXHJcblxyXG5cclxuICAgIFx0XHQkJC5iaW5kaW5nLnVwZGF0ZSh0aGlzLmN0eCwgdGhpcy5tb2RlbCwgT2JqZWN0LmtleXMoZmllbGRzU2V0KSwgZXhjbHVkZUVsdClcclxuICAgIFx0fVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuJCQudmlld0NvbnRyb2xsZXIgPSBmdW5jdGlvbihlbHQsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgVmlld0NvbnRyb2xsZXIoZWx0LCBvcHRpb25zKVxyXG59XHJcblxyXG4kJC5pc1ZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24obykge1xyXG4gICAgcmV0dXJuIG8gaW5zdGFuY2VvZiBWaWV3Q29udHJvbGxlclxyXG59XHJcblxyXG59KSgpO1xyXG4iLCJcbiQkLnNlcnZpY2UucmVnaXN0ZXJTZXJ2aWNlKCdicmFpbmpzLmh0dHAnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRnZXQodXJsKSB7XG5cdFx0XHRyZXR1cm4gJC5nZXRKU09OKHVybClcblx0XHR9LFxuXG5cblx0XHRwb3N0KHVybCwgZGF0YSkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHR1cmwgOiB1cmwsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpXG5cdFx0XHR9KVxuXHRcdH0sXG5cblx0XHRwdXQodXJsLCBkYXRhKSB7XG5cdFx0XHRyZXR1cm4gJC5hamF4KHtcblx0XHRcdFx0bWV0aG9kOiAnUFVUJyxcblx0XHRcdFx0dXJsIDogdXJsLFxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHRkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKVxuXHRcdFx0fSlcblx0XHR9LFx0XHRcdFxuXG5cdFx0ZGVsZXRlKHVybCkge1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdG1ldGhvZDogJ0RFTEVURScsXG5cdFx0XHRcdHVybCA6IHVybCxcblx0XHRcdH0pXHRcdFx0XHRcblx0XHR9LFxuXG5cdFx0cG9zdEZvcm1EYXRhKHVybCwgZmQpIHtcblx0XHRcdHJldHVybiAkLmFqYXgoe1xuXHRcdFx0ICB1cmw6IHVybCxcblx0XHRcdCAgdHlwZTogXCJQT1NUXCIsXG5cdFx0XHQgIGRhdGE6IGZkLFxuXHRcdFx0ICBwcm9jZXNzRGF0YTogZmFsc2UsICAvLyBpbmRpcXVlIMOgIGpRdWVyeSBkZSBuZSBwYXMgdHJhaXRlciBsZXMgZG9ubsOpZXNcblx0XHRcdCAgY29udGVudFR5cGU6IGZhbHNlICAgLy8gaW5kaXF1ZSDDoCBqUXVlcnkgZGUgbmUgcGFzIGNvbmZpZ3VyZXIgbGUgY29udGVudFR5cGVcblx0XHRcdH0pXHRcdFx0XHRcblx0XHR9XG5cblx0XHRcblx0fVxufSk7XG5cblxuXG5cblxuXG4iXX0=
