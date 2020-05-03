(function () {



  const map = {
    'bn-form': 'setFormData',
    'bn-text': 'text',
    'bn-html': 'html',
    'bn-data': 'setData',
    'bn-val': 'setValue',
    'bn-show': 'setVisible',
    'bn-style': 'css',
    'bn-attr': 'attr',
    'bn-prop': 'setProp',
    'bn-class': 'setClass',
    'bn-control': true,
    'bn-each': true,
    'bn-if': true,
    'bn-bind': true,
    'bn-iface': true,
    'bn-event': true
  }



  function splitAttr(attrValue, cbk) {
    attrValue.split(',').forEach(function (i) {
      let [name, value] = i.split(':')
      cbk(name.trim(), value.trim())
    })
  }


  function processEvents(events, data) {
    events.forEach((info) => {
      const { attrValue, node } = info
      const elt = $(node)
      splitAttr(attrValue, function (evtName, value) {
        let fn = data[value]
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

  function parse(root, updateCbk) {

    const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: function (node) {
          if (node == root && node.classList.contains('CustomControl')) {
            return NodeFilter.REJECT;
          }

          for (let name of node.getAttributeNames()) {
            if (name.startsWith('bn-')) {
              return NodeFilter.FILTER_ACCEPT;
            }
          }

        }
      }
    )

    const ctx = []
    const scope = []
    const events = []
    const ctrls = []

    let node
    while (node = nodeIterator.nextNode()) {
      const attrs = node.getAttributeNames()
      attrs
        .filter((name) => name in map)
        .forEach((attrName) => {
          const attrValue = node.getAttribute(attrName)
          node.removeAttribute(attrName)


          if (attrName == 'bn-bind' || attrName == 'bn-iface') {
            scope.push({ node, attrValue, attrName })
          }


          else if (attrName == 'bn-event') {
            events.push({ node, attrValue })
          }

          else if (attrName == 'bn-control') {
            ctrls.push({ node, attrValue })
          }
          else if (attrName == 'bn-if') {
            const template = document.createElement('template')
            $(template.content).append($(node).children().remove())
            ctx.push({ attrName, node, template, attrValue })
          }

          else if (attrName == 'bn-each') {
            const template = document.createElement('template')
            $(template.content).append($(node).children().remove())
            let iter = node.getAttribute('bn-iter')
            if (iter == null) {
              iter = '$i'
            }
            else {
              node.removeAttribute('bn-iter')
            }
            let index = node.getAttribute('bn-index')
            if (index != null) {
              node.removeAttribute('bn-index')
            }
            let lazzy = node.getAttribute('bn-lazzy')
            let observer = {}
            if (lazzy != null) {
              node.removeAttribute('bn-lazzy')
              lazzy = parseInt(lazzy)
              const options = {
                root: node.parentNode,
                rootMargin: '0px',
                threshold: 1.0
              }
              observer = new IntersectionObserver(intersectionObserverCallback, options)

            }

            observer.info = { node, template, iter, index, lazzy }
            ctx.push({ attrName, attrValue, observer, node })
          }

          else if (attrName == 'bn-val') {
            const updateEvt = node.getAttribute('bn-update')

            if (updateEvt != null) {
              node.removeAttribute('bn-update')
              const elt = $(node)
              elt.on(updateEvt, function (ev, data) {
                //console.log('[binding] updateEvt', updateEvt, data)
                let value = elt.getValue()
                if (elt.hasClass('brainjs-slider')) {
                  value = data
                }
                updateCbk(attrValue, value, node)

              })
            }

            ctx.push({ attrName, node, attrValue })
          }

          else {
            ctx.push({ attrName, node, attrValue })
          }

        })


    }

    return { ctx, scope, events, ctrls }
  }

  function intersectionObserverCallback(entries, observer) {
    //console.log('intersectionObserverCallback', entries)

    const target = entries[0].target
    const idx = $(target).index()

    //console.log('idx', idx)

    if (entries[0].isIntersecting) {
      observer.unobserve(target)
      processEach(idx + 1, observer)
    }
  }

  function processEach(startIdx, observer) {
    let { lazzy, iter, index, value, node, template, data } = observer.info
    //console.log('processEach', startIdx, data)

    if (startIdx == 0) {
      $(node).safeEmpty()
    }

    const length = value.length

    if (lazzy != null) {
      value = value.slice(startIdx, startIdx + lazzy)
    }

    value.forEach((item, idx) => {
      const clone = document.importNode(template.content, true)
      const { ctx, ctrls } = parse(clone)
      const itemData = $.extend({ $scope: {} }, data)
      itemData.$scope[iter] = item
      if (index != null) {
        itemData.$scope[index] = idx
      }
      render(ctx, itemData)
      processCtrls(ctrls)
      node.appendChild(clone)
    })

    const nbChilds = node.childNodes.length
    if (lazzy != null && length != 0 && nbChilds < length) {
      observer.observe(node.childNodes[nbChilds - 1])
    }

    if (startIdx == 0) {
      $(node.parentNode).scrollTop(0)
    }

  }

  function removeArrayItem(ctx, arrayNode, idx) {
    const node = arrayNode.childNodes[idx]

    const info = ctx.find((i) => i.node == arrayNode)
    if (node != undefined) {
      if (info != undefined && info.attrName == 'bn-each') {
        arrayNode.removeChild(node)
      }
    }
    else {
      info.observer.info.value.splice(idx, 1)
    }
  }

  function updateArrayItem(ctx, arrayNode, idx, value) {
    const node = arrayNode.childNodes[idx]

    const info = ctx.find((i) => i.node == arrayNode)

    if (info != undefined && info.attrName == 'bn-each') {
      if (node != undefined) {
        const { iter, index, template, data } = info.observer.info
        const clone = document.importNode(template.content, true)
        const { ctx, ctrls } = parse(clone)
        const itemData = $.extend({ $scope: {} }, data)
        itemData.$scope[iter] = value
        if (index != null) {
          itemData.$scope[index] = idx
        }
        render(ctx, itemData)
        processCtrls(ctrls)

        arrayNode.replaceChild(clone, node)

      }
      else {
        info.observer.info.value[idx] = value
      }

    }
  }

  function insertArrayItemAfter(ctx, arrayNode, idx, value) {
    const node = arrayNode.childNodes[idx]

    const info = ctx.find((i) => i.node == arrayNode)

    if (info != undefined && info.attrName == 'bn-each') {
      if (node != undefined) {
        const { iter, index, template, data } = info.observer.info
        const clone = document.importNode(template.content, true)
        const { ctx, ctrls } = parse(clone)
        const itemData = $.extend({ $scope: {} }, data)
        itemData.$scope[iter] = value
        if (index != null) {
          itemData.$scope[index] = idx
        }
        render(ctx, itemData)
        processCtrls(ctrls)

        arrayNode.insertBefore(clone, node.nextSibling)
      }
      else {
        info.observer.info.value.splice(idx + 1, 0, value)
      }
    }
  }

  function processCtrls(ctrls) {
    ctrls.forEach((info) => {
      const { node, attrValue } = info
      $$.control.createControl(attrValue, $(node))
    })
  }


  function render(ctx, data) {
    //console.log('render', ctx, data)

    for (let info of ctx) {
      const { attrName, attrValue, node, oldValue } = info

      const value = $$.eval.evaluate(data, attrValue)
      // console.log('evaluate', attrValue)
      // if (value == undefined) {
      //   console.warn('return', value)
      // }
      // else {
      //   console.log('return', value)
      // }
      const strValue = JSON.stringify(value)

      if (oldValue != undefined && oldValue == strValue && attrName != 'bn-if') {
        continue
      }

      info.oldValue = strValue


      if (attrName == 'bn-each') {
        const { observer } = info
        observer.info.value = value
        observer.info.data = data
        processEach(0, observer)
      }
      else if (attrName == 'bn-if') {
        $(node).safeEmpty()
        const { template } = info
        node.style.height = '100%'
        if (value === true) {
          node.hidden = false
          const clone = document.importNode(template.content, true)
          const { ctx, ctrls } = parse(clone)
          render(ctx, data)
          processCtrls(ctrls)
          node.appendChild(clone)
        }
        else {
          node.hidden = true
        }
      }
      else {
        const f = map[attrName]
        $(node)[f](value)
      }
    }


  }

  function processBindings(scope) {

    var data = {}

    scope.forEach((info) => {
      const { attrValue, attrName, node } = info
      if (attrName == 'bn-bind') {
        data[attrValue] = $(node)
      }
      else if (attrName == 'bn-iface') {
        data[attrValue] = $(node).iface()
      }
    })

    return data

  }


  $$.binding = {
    parse,
    render,
    processEvents,
    processBindings,
    processCtrls,
    updateArrayItem,
    removeArrayItem,
    insertArrayItemAfter
  }

})();
