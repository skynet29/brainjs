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

$.fn.setProp = function(name, value) {
  //console.log('setProp', name, value)
  if (this.hasClass('ui-button') && name == 'disabled') {
    this.button('option', 'disabled', value )
  }
  else {
    this.prop(name, value)
  }
}

$.fn.setData = function(name, value) {
  //console.log('setData', name, value)
  const iface = this.iface()

  const funcName = 'set' + name.charAt(0).toUpperCase() + name.substr(1)

  if (iface && name in iface.props && typeof iface[funcName] == 'function') {
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

$.fn.addControl = function(ctrlName, data) {
  //console.log('$.addControl', ctrlName, data)
  var newCtrl = $('<div>')
  this.append(newCtrl) 
  if (data) {
    newCtrl.data(data)
  }
  $$.control.createControl(ctrlName, newCtrl)
  return this
}

})();
