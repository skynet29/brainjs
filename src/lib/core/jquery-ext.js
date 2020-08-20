(function () {


  $.fn.bnFind = function (selector) {
    return this.find(selector).add(this.filter(selector))
  }

  $.fn.bnFindAttr = function (attrName, cbk) {
    this.bnFind(`[${attrName}]`).each(function () {
      const elt = $(this)
      const value = elt.attr(attrName)
      elt.removeAttr(attrName)
      cbk(elt, value)
    })
    return this
  }

  $.fn.setClass = function (data) {
    for (let className in data) {

      const isActive = data[className]

      if (isActive) {
        this.addClass(className)
      }
      else {
        this.removeClass(className)
      }
    }
    return this

  }

  $.fn.setVisible = function (isVisible) {
    if (isVisible) {
      this.show()
    }
    else {
      this.hide()
    }

    return this
  }

  $.fn.setVisibility = function(isVisible) {
    return this.css('visibility', (isVisible) ? 'visible' : 'hidden')
  }

  $.fn.iface = function () {
    return this.get(0) && this.get(0).ctrl
  }

  $.fn.setProp = function (data) {

    const iface = this.iface()

    if (iface && typeof iface.setProp == 'function') {
      iface.setProp.call(iface, data)
      return
    }


    for (let propName in data) {

      const value = data[propName]

      if (this.hasClass('ui-button') && propName == 'disabled') {
        this.button('option', 'disabled', value)
      }
      else {
        this.prop(propName, value)
      }

    }

  }

  $.fn.setData = function (data) {
    //console.log('setData', data)
    const iface = this.iface()

    if (iface && typeof iface.setData == 'function') {
      iface.setData.call(iface, data)
    }
    else {
      this.data(data)
    }
  }

  $.fn.setValue = function (value) {
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

  $.fn.getValue = function () {
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

  $.fn.getFormData = function () {
    var ret = {}
    this.find('[name]').each(function () {
      var elt = $(this)
      var name = elt.attr('name')
      ret[name] = elt.getValue()

    })

    return ret
  }

  $.fn.resetForm = function () {
    if (this.get(0).tagName == "FORM") {
      this.get(0).reset()
    }
  }

  $.fn.setFormData = function (data) {

    //console.log('setFormData', data)
    //this.resetForm()

    for (var name in data) {
      var value = data[name]
      var elt = this.find(`[name="${name}"]`)
      if (elt.length) {
        elt.setValue(value)
      }


    }

    return this
  }

  $.fn.safeEmpty = function () {
    this.bnFind('.CustomControl').each(function () {
      const iface = $(this).iface()
      //console.log('remove ctrl', iface)

      if (typeof iface.dispose == 'function') {
        iface.dispose()
      }
    })

    this.empty()

    return this
  }

  $.fn.addControl = function (ctrlName, data, events) {
    //console.log('$.addControl', ctrlName, data)
    var newCtrl = $('<div>', { style: 'height: 100%;overflow: hidden;' })
    this.append(newCtrl)
    if (data) {
      newCtrl.data(data)
    }
    if (typeof events == 'object') {
      for (let evName in events) {
        let fn = events[evName]
        if (typeof fn == 'function') {
          const [name, selector] = evName.split('.')

          if (selector != undefined) {
            newCtrl.on(name, '.' + selector, fn)
          }
          else {
            newCtrl.on(name, fn)
          }
        }

      }
    }
    $$.control.createControl(ctrlName, newCtrl)
    return newCtrl
  }

  $.fn.setItems = function (items) {
    return this.empty().append(items.map((item) => {
      const option = $('<option>')

      if (typeof item == 'string') {
        option.val(item).text(item)
      }
      else {
        option.val(item.value).text(item.label)
        if (item.style) {
          option.attr('data-style', item.style)
        }
      }
      return option
    }))
  }


  $.fn.isEqual = function ($otherSet) {
    if (this === $otherSet) return true
    if (this.length != $otherSet.length) return false
    var ret = true
    this.each(function (idx) {
      if (this !== $otherSet[idx]) {
        ret = false; return false;
      }

    })
    return ret;
  }

  $.fn.scrollToBottom = function () {
    return this.scrollTop(this.get(0).scrollHeight)
  }


})();
