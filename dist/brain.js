console.log('jQuery version', $.fn.jquery)

var brain = {
  controls: [],

  registerControl: function(controlName, func) {
    this.controls[controlName] = func
  },

  createCustomControl: function(elt, model, html) {
    return {
      viewCtrl: new brain.ViewControler(elt, model),

      render: function() {
        console.log('CustomControl.render')
        elt.append(html)
        this.viewCtrl.render()
      },

      attr: function(attrName, value) {
        console.log('CustomControl.attr', attrName, value)
        this.viewCtrl.setProp(attrName, value)
      }
    }     
  }

}

$.Event.prototype.info = function() {
  return $(this.target).closest('.bn-item').get(0).info
}

$.fn.bnFilter = function(selector) {
  return this.find(selector).add(this.filter(selector))
}

$.fn.bnFindAttr = function(attrName, attrValue) {
  var filter = '[' + attrName + '="' + attrValue + '"]'
  //console.log('bnFindAttr', filter)
  return this.bnFilter(filter)
}

$.fn.bnVisible = function(isVisible) {
  //console.log('bnVisible', isVisible)
  if (isVisible == true) {
    this.show()
  }
  else {
    this.hide()
  }
  return this
}

$.fn.bnFind = function(attrName, callback, removeAttr) {
  //console.log('bnFind', attrName, removeAttr)
  removeAttr = (removeAttr == undefined) ? true : removeAttr
  //console.log('removeAttr', removeAttr)
  this.bnFilter('[' + attrName + ']').each(function() {
    var elt = $(this)
    var attrValue = elt.attr(attrName)
    if (removeAttr == true) {
      elt.removeAttr(attrName)
    }
    callback(elt, attrValue)
  })
}

$.fn.bnFindEx = function(attrName, callback) {
  this.bnFind(attrName, function(elt, attrValue) {
    attrValue.split(',').forEach(function(item) {
      var list = item.split(':')
      var attrName = list[0].trim()
      var varName = list[1].trim()
      callback(elt, attrName, varName)
    })
  })
}

$.fn.bnEach = function(options, value) {
  //console.log('bnEach', options, value)
  if (!Array.isArray(value)) {
    return this
  }
  //console.log('template', options.template.get(0))

  this.empty()
    .append(value.map(function(item, index) {
      options.controler.renderView(options.ref, item)
//      options.template.bnRender(item, options)
        //console.log('clone', options.template.get(0))
      var clone = options.template.clone(true)
      clone.get(0).info = {
        idx: index,
        data: item
      }
      return clone
    }))
}

$.fn.bnVal = function(value) {
  //console.log('bnVal', value)
  var ctrl = this.get(0).ctrl
  if (ctrl != undefined) {
    return ctrl.val(value)
  }

  var type = this.attr('type')
 
  if (value == undefined) {
    if (type == 'checkbox') {
      return this.prop('checked')
    }

    return this.val()
  }

  if (type == 'checkbox') {
    this.prop('checked', value)
  }
  else {
    this.val(value)
  }
}

$.fn.bnAttr = function(attrName, value) {
  //console.log('bnVal', value)
  var ctrl = this.get(0).ctrl
  if (ctrl != undefined) {
    return ctrl.attr(attrName, value)
  }
 
  if (value == undefined) {

    return this.attr(attrName)
  }

  this.attr(attrName, value)
}

brain.ViewControler = (function() {

function ViewControler(elt, model) {
  var that = this

  if (typeof elt == 'string') {
    elt = $(elt)
  }

  this.rendered = false
  this.elt = elt
  this.data = {
    update: function(varName, value) {
      that.update(varName, value)
    },
    setData: function(data) {
      that.setData(data)
    }
  }
  var init = model.init
  if (typeof init == 'function') {
    init.call(this.data)
  }

  this.methods = {}
  this.rules = model.rules || {}

  for(var k in model.methods) {
    this.methods[k] = model.methods[k].bind(this.data)
  }


}

ViewControler.prototype.renderControl = function() {
  this.elt.bnFind('bn-control', function(elt, controlName) {
    console.log('bn-control 2nd', controlName)
    var ctrl = elt.get(0).ctrl
    if (ctrl == undefined) {
      return
    }
    if (typeof ctrl.render == 'function') {
      ctrl.render()
    }

  })   
}

ViewControler.prototype.render = function() {
  console.log('ViewControler.render')
  this.ref = this.computeRef(this.elt)
  this.renderView(this.ref, this.data)  
  this.renderControl()   
  this.rendered = true
}

ViewControler.prototype.getValue = function(data, varName) {
  //console.log('getValue', varName, data)
  if (varName == '$item') {
    return data
  }

  var value = data[varName]
  if (varName.startsWith('@')) {
    var funcName = varName.substr(1)
      //console.log('funcName', funcName)
    var func = this.methods[funcName]
    if (typeof func == 'function') {
      value = func(data)
    }
  }  
  //console.log('value', value)
  return value
}

ViewControler.prototype.renderView = function(ref, data) {
  //console.log('render', ref, data)
  for(var varName in ref) {
    var value = this.getValue(data, varName)
    var entry = ref[varName]
    this.updateView(entry, value)
  }
}

ViewControler.prototype.updateView = function(entry, value) {
  entry.forEach(function(item) {
    var elt = $(item.elt)
    var func = $.fn[item.func]

    if (item.arg != undefined) {
      func.call(elt, item.arg, value)
    } else {
      func.call(elt, value)
    }

  }) 
}

ViewControler.prototype.updateVariable = function(varName, excludeElt) {
  //console.log('updateVariable', varName)

  var entry = this.ref[varName]
  if (entry != undefined) {
    var value = this.getValue(this.data, varName)
    this.updateView(entry, value)       
  }

  for(var rule in this.rules) {
    var deps = this.rules[rule]
    if (deps.indexOf(varName) != -1) {
      this.updateVariable(rule)
    }
  }
  
}

ViewControler.prototype.update = function(varNames) {
  //console.log('update', varNames)
  var that = this

  varNames.split(',').forEach(function(varName) {
    that.updateVariable(varName.trim())
  })

}

ViewControler.prototype.setData = function(data) {
  $.extend(this.data, data)
  this.update(Object.keys(data).toString())
}

ViewControler.prototype.setProp = function(varName, value) {
  //console.log('ViewControler.setProp', varName, value)
  this.data[varName] = value
  if (this.rendered) {
    this.updateVariable(varName)
  }
}

ViewControler.prototype.computeRef = function(root) {
  var ret = {}
  var that = this

  function addRef(elt, varName, func, arg) {
    //console.log('addRef', varName, func, arg)
    if (ret[varName] == undefined) {
      ret[varName] = []
    }
    ret[varName].push({
      elt: elt.get(0),
      func: func,
      arg: arg
    })
  }

  root.bnFind('bn-each', function(elt, attrValue) {
    //console.log('bn-each', attrValue)
    var template = elt.children().detach()
    template.addClass('bn-item')
      //console.log('template', template.get(0))
    var ref = that.computeRef(template)
    addRef(elt, attrValue, 'bnEach', {
      ref: ref,
      template: template,
      controler: that
    })
  })

  root.bnFind('bn-control', function(elt, controlName) {
    console.log('bn-control', controlName)
    var func = brain.controls[controlName]
    if (typeof func == 'function') {
      elt.get(0).ctrl = func(elt)
    }
    else {
      console.warn('control', controlName, 'is not correctly registered')
    }

  }, false)

  root.bnFind('bn-text', function(elt, attrValue) {
    //console.log('bn-text', attrValue)
    addRef(elt, attrValue, 'text')
  })
  root.bnFind('bn-model', function(elt, varName) {
    //console.log('bn-model', varName)
    addRef(elt, varName, 'bnVal')
    var events = elt.attr('bn-update')
    //console.log('events', events)
    if (events != undefined) {
      elt.removeAttr('bn-update')
      elt.on(events, function() {
        var value = elt.bnVal()
        //console.log('varChange', varName, value)
        if (typeof that.data[varName] == 'number') {
          value = parseFloat(value)
        }
        that.setProp(varName, value)
      })
    }
  })
  root.bnFindEx('bn-style', function(elt, attrName, varName) {
    addRef(elt, varName, 'css', attrName)
  })
  root.bnFindEx('bn-attr', function(elt, attrName, varName) {
    //console.log('bn-attr', attrName, varName)
    addRef(elt, varName, 'bnAttr', attrName)
  })
  root.bnFind('bn-visible', function(elt, varName) {
    //console.log('bn-visible', varName)
    addRef(elt, varName, 'bnVisible')
  })
  root.bnFindEx('bn-event', function(elt, eventName, methodName) {
    //console.log('bn-event', eventName, methodName)
    var func = that.methods[methodName]
    if (typeof func == 'function') {
      elt.on(eventName, func)
    }
  })



  return ret
}

  return ViewControler

})()


brain.registerControl('checkgroup', function(elt) {
  //console.log('init checkgroup')

  elt.bnFindAttr('type', 'checkbox').click(function() {
    elt.trigger('checkgroupChange')
  })

  return {
    val: function(value) {
      //console.log('ckeckgroup.val', value)
      if (value != undefined) {
        value.forEach(function(item) {
          elt.bnFindAttr('value', item).prop('checked', true)
        })
      }
      else {
        var ret = []
        elt.bnFilter('input:checked').each(function() {
          ret.push($(this).attr('value'))
        })
        return ret
      }
    }
  }
})

brain.registerControl('radiogroup', function(elt) {
  //console.log('init radiogroup')

  elt.bnFindAttr('type', 'radio').click(function() {
    elt.bnFilter('input:checked').prop('checked', false)
    $(this).prop('checked', true)
    elt.trigger('radiogroupChange')
  })

  return {
    val: function(value) {
      //console.log('radiogroup.val', value)
      if (value != undefined) {
        elt.bnFilter('input:checked').prop('checked', false)
        elt.bnFindAttr('value', value).prop('checked', true)
      }
      else {
        return elt.bnFilter('input:checked').attr('value')
      }
    }
  }
})

brain.registerControl('menu', function(elt) {
  //console.log('init pager')
  elt.addClass('bn-menu')
  elt.find('> li').click(function() {
      elt.children('li.selected').removeClass('selected')
      $(this).addClass('selected')
      elt.trigger('menuChange')    
  })

  return {
    val: function(value) {
      //console.log('menu.val', value)
      if (value != undefined) {
        elt.children('li.selected').removeClass('selected')
        elt.children('li').bnFindAttr('value', value).addClass('selected')

      }
      else {
        return elt.children('li.selected').attr('value')
      }


    }
  }
})

brain.registerControl('pager', function(elt) {
  //console.log('init pager')


  return {
    attr: function(attrName, value) {
      //console.log('pager.attr', attrName, value)
      if (attrName == 'page') {
        if (value != undefined) {
          elt.children(':visible').hide()
          elt.bnFindAttr('name', value).show()
        }
        else {
          return elt.children(':visible').attr('name')
        }       
      }

    }
  }
})
