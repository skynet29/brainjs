(function(){



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

function getObjectValue(data, expr) {
  //console.log('getValue', data, expr)
  const t = expr.split('.')
  const v = t.shift()
  if (t.length == 0) {
    return data[v]
  }
  return getObjectValue(data[v], t.join('.'))

}

function getValue(data, expr) {
  //console.log('getValue', data, expr)
  expr = expr.trim()
  const v = parseFloat(expr)
  if (!isNaN(v)) {
    return v
  }

  if (expr == 'true') {
    return true
  }

  if (expr == 'false') {
    return false
  }

  var ar = expr.match(/\'(.*?)\'/)
  if (ar != null) {
    return ar[1]
  }

  let not = false
  if (expr.startsWith('!')) {
    expr = expr.substr(1)
    not = true
  }
  let ret
  const f = data[expr]  
  if (typeof f == 'function') {
    ret = f.call(data)
  }
  else {
    ret = getObjectValue(data, expr)
  }
  return (not) ? !ret : ret

}

function evaluate(data, expr) {
  //console.log('evaluate', data, expr)
  expr = expr.replace(/\n/g, '').trim()
  var ar = expr.match(/\{(.*?)\}/)
  //console.log('ar', ar)
  if (ar == null) {
    return getValue(data, expr)
  }
  const args = ar[1].split(',')
  //console.log('args', args)
  const ret = {}
  args.forEach((i) => {
     const t = i.split(':')
     const name = t[0].trim()
     const value = (t.length == 1) ? name : t[1].trim() 
     ret[name] = getValue(data, value) 
  })
  return ret
}

function splitAttr(attrValue, cbk) {
  attrValue.split(',').forEach(function(i) {
    let [name, value] = i.split(':')
    cbk(name.trim(), value.trim())
  })
}


function processEvents(events, data) {
  events.forEach((info) => {
    const {attrValue, node} = info
    const elt = $(node)
    splitAttr(attrValue, function(evtName, value) {
      let fn  = data[value]
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
     { acceptNode: function(node) {
        if (node == root && node.classList.contains('CustomControl')) {
          return NodeFilter.REJECT;
        }

        for(let name of node.getAttributeNames()) {
          if (name.startsWith('bn-')) {
            return NodeFilter.FILTER_ACCEPT;
          }
        }
          
      }}
      )

  const ctx = []
  const scope = []
  const events = []
  const ctrls = []

  let node
  while(node = nodeIterator.nextNode()) {
    const attrs = node.getAttributeNames()
    attrs
    .filter((name) => name in map)
    .forEach((attrName) => {
      const attrValue =  node.getAttribute(attrName)
      node.removeAttribute(attrName)


      if (attrName == 'bn-bind' || attrName == 'bn-iface') {
        scope.push({node, attrValue, attrName})
      }


      else if (attrName == 'bn-event') {
        events.push({node, attrValue})
      }

      else if (attrName == 'bn-control') {
        ctrls.push({node, attrValue})
      }

      else if (attrName == 'bn-each' || attrName == 'bn-if') {
        const template = document.createElement('template')
        $(template.content).append($(node).children().remove())
        let iter = node.getAttribute('bn-iter')
        if (iter == null) {
          iter = '$i'
        }
        else {
          node.removeAttribute('bn-iter')
        }
        ctx.push({attrName, node, template, attrValue, iter})
      }

      else if (attrName == 'bn-val') {
        const updateEvt = node.getAttribute('bn-update')

        if (updateEvt != null) {
          node.removeAttribute('bn-update')
          const elt = $(node)
          elt.on(updateEvt, function(ev, data) {
            //console.log('[binding] updateEvt', updateEvt, data)
            let value = elt.getValue()
            if (elt.hasClass('brainjs-slider')) {
              value = data
            }
            updateCbk(attrValue, value, node)

          })
        }

        ctx.push({attrName, node, attrValue})
      }

      else  {
        ctx.push({attrName, node, attrValue})
      }

    })

 
  }

  return {ctx, scope, events, ctrls}
}

function processCtrls(ctrls) {
  ctrls.forEach((info) => {
    const {node, attrValue} = info
    $$.control.createControl(attrValue, $(node))
  })
}

function render(ctx, data) {
  //console.log('render', ctx, data)
  
  for(let info of ctx) {
    const {attrName, attrValue, node, template, iter, oldValue} = info

    const value = evaluate(data, attrValue)
    // console.log('evaluate', attrValue)
    // if (value == undefined) {
    //   console.warn('return', value)
    // }
    // else {
    //   console.log('return', value)
    // }
    const strValue = JSON.stringify(value)

    if (oldValue != undefined &&  oldValue == strValue && attrName != 'bn-if') {
      continue
    }

    info.oldValue = strValue


    if (attrName == 'bn-each') {
        node.innerHTML = ''
        value.forEach((item) => {
          const clone = document.importNode(template.content, true) 
          const {ctx, ctrls} = parse(clone)
          const itemData = $.extend({}, data)
          itemData[iter] = item
          render(ctx, itemData)
          processCtrls(ctrls)
          node.appendChild(clone)
        })
    }
    else if (attrName == 'bn-if') {
        node.innerHTML = ''
        node.style.height = '100%'
        if (value === true) {
          node.hidden = false
          const clone = document.importNode(template.content, true) 
          const {ctx, ctrls} = parse(clone)
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
    const {attrValue, attrName, node} = info
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
  processCtrls
}

})();
