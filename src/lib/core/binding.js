(function () {



  const map = {
    'bn-icon': true,
    'bn-form': 'setFormData',
    'bn-text': 'text',
    'bn-html': 'html',
    'bn-load': 'load',
    'bn-data': 'setData',
    'bn-val': 'setValue',
    'bn-show': 'setVisible',
    'bn-visible': 'setVisibility',
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

          else if (attrName == 'bn-icon') {
            const i = document.createElement('i')
            i.className = attrValue
            node.appendChild(i)
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
              let scrollNode = node.parentNode
              if (scrollNode.tagName == 'TABLE') {
                scrollNode = scrollNode.parentNode
              }
              //lazzy = parseInt(lazzy)
              const options = {
                root: scrollNode,
                rootMargin: '0px',
                threshold: 0.25
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

  async function processEach(startIdx, observer) {
    let { lazzy, iter, index, value, node, template, data } = observer.info
    const length = value.length
    //console.log('processEach', startIdx, value)

    if (startIdx == 0) {
      $(node).safeEmpty()
    }

    let nbChilds = 0


    function process() {
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
      nbChilds = node.childNodes.length
      //console.log('nbChilds', nbChilds)

    }

    function observe() {
      if (nbChilds > 0) {
        observer.observe(node.childNodes[nbChilds - 1])
        observer.info.observedIdx = nbChilds - 1
        //console.log('observedIdx', nbChilds - 1)
      }
      else {
        observer.info.observedIdx = -1
      }
    }

    if (lazzy != null) {
      const nb = parseInt(lazzy)
      if (isNaN(nb)) {
        const fn = data[lazzy]
        if (typeof fn == 'function' && fn.constructor.name == 'AsyncFunction') {
          if (startIdx != 0) {
            const newValue = await fn(startIdx)
            //console.log('value', value)
            if (newValue == null) {
              return
            }
            else {
              observer.info.value = value.concat(newValue)
              value = newValue
              process()
              observe()
            }
          }
          else {
            process()
            observe()
          }
        }
        else {
          console.warn('lazzy parameter must be a number or an async function')
          return
        }

      }
      else {
        value = value.slice(startIdx, startIdx + nb)
        process()
        if (nbChilds < length) {
          observe()
        }

      }
    }
    else {
      process()
    }

    //console.log('processEach', startIdx, value)

    if (startIdx == 0) {
      $(node.parentNode).scrollTop(0)
    }

  }

  function removeArrayItem(ctx, arrayNode, indexes) {

    //console.log('removeArrayItem', indexes)

    const info = ctx.find((i) => i.node == arrayNode)

    if (info != undefined && info.attrName == 'bn-each') {

      const { observer } = info
      const { observedIdx } = observer.info

      //console.log('observedIdx', observedIdx)

      indexes.forEach((idx) => {
        //console.log('removeArrayItem', idx)
        const node = arrayNode.childNodes[idx]
        if (node != undefined) {
          arrayNode.removeChild(node)
        }
        observer.info.value.splice(idx, 1)
      })

      //console.log('values', observer.info.value)
      const length = observer.info.value.length
      if (length > 0 && indexes.includes(observedIdx)) {
        observer.observe(arrayNode.childNodes[length - 1])
        observer.info.observedIdx = length - 1
      }

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
      info.observer.info.value[idx] = value

    }
  }

  function updateArrayValue(ctx, arrayNode, value) {
    const info = ctx.find((i) => i.node == arrayNode)
    if (info != undefined && info.attrName == 'bn-each') {
      info.observer.info.value = value
    }
  }

  function insertArrayItemAfter(ctx, arrayNode, idx, value) {
    const node = arrayNode.childNodes[Math.max(idx, 0)]

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

        arrayNode.insertBefore(clone, (idx < 0) ? node : node.nextSibling)
      }
      info.observer.info.value.splice(idx + 1, 0, value)
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
      const { attrName, attrValue, node, oldValue, enabled } = info

      const value = $$.eval.evaluate(data, attrValue)
      // console.log('evaluate', attrValue)
      // if (value == undefined) {
      //   console.warn('return', value)
      // }
      // else {
      //   console.log('return', value)
      // }
      const strValue = JSON.stringify(value)

      if (enabled === false || (oldValue != undefined && oldValue == strValue)) {
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
    insertArrayItemAfter,
    updateArrayValue
  }

})();
