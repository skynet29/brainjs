(function(){


function getValue(data, varName) {

    return $$.util.safeEval(varName, data)

}



const map = {
  // 'bn-each': {type: 3},
  'bn-if': {type: 5},
  'bn-form': {f: 'setFormData', type:1},
  'bn-text': {f: 'text', type: 1},
  'bn-html': {f: 'html', type: 1},
  'bn-val': {f: 'setValue', type: 1},
  'bn-show': {f: 'setVisible', type: 1},
  'bn-style': {f: 'css', type: 2},
  'bn-attr': {f: 'attr', type: 2},
  'bn-prop': {f: 'setProp', type: 2},
  'bn-data': {f: 'setData', type: 2},
  'bn-class': {f: 'setClass', type: 2},
  'bn-control': {type: 4}
}


function update(ctx, data, excludeElt, forceElt) {

  //console.log('[binding] update', data, excludeElt)
  //console.log('ctx', ctx)

  ctx.forEach(function(info) {

    let {type, f, elt, name, template, iter, attrValue, dir, oldValue} = info

    let value = getValue(data, attrValue)

    if (elt.get(0) != forceElt && JSON.stringify(value) == JSON.stringify(oldValue)) {
      return
    }

    info.oldValue = value

    if (elt.get(0) == excludeElt) {
      return
    }    

    //console.log(`[binding] update ${dir}="${attrValue}" value=`, value)
    

    if (type == 1 || type == 2) {
      //console.log('update', variable, f, newValue)
       elt[f].call(elt, value)
    }
    if (type == 3 && Array.isArray(value)) {
      elt.safeEmpty()
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

function splitAttr(attrValue, cbk) {
  attrValue.split(',').forEach(function(i) {
    let [name, value] = i.split(':')
    cbk(name.trim(), value.trim())
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

function process(root, data, updateCbk) {

  //console.log('### process ####', root.get(0).outerHTML, data)

  const ctx = []

  // first process bn-each directive


  const bnEach = []
  root.bnFind('[bn-each]').each(function() {
    const elt = $(this)
    let contained = false
    bnEach.forEach(function(i) {
      if ($.contains(i.get(0), elt.get(0))) {
        contained = true
      }
    })    
    if (!contained) {
      bnEach.push(elt)
    }
  })
  //console.log('bn-each=', bnEach)
  // process bn-each directive which are not contained in another one

  bnEach.forEach(function(elt) {
    const attrValue = elt.attr('bn-each')
    elt.removeAttr('bn-each')
    let template = elt.children().remove().clone()
    let iter = elt.attr('bn-iter')
    if (iter != undefined) {
      elt.removeAttr('bn-iter')
    }
    else {
      iter = '$i'
    }


    let value = getValue(data, attrValue)

    ctx.push({elt, type: 3, template, iter, attrValue, dir: 'bn-each', oldValue: value})   

    elt.empty()
    value.forEach(function(item) {
      var itemData = $.extend({}, data)
      itemData[iter] = item
      var $item = template.clone()
      process($item, itemData)
      elt.append($item)           
    })           
      
  })

  const removedElts = []

  // process other directive
  
  for(let dir in map) {
    
    //console.log('dir=', dir, removedElts)
    root.bnFindAttr(dir, function(elt, attrValue) {

      //console.log('dir=', dir, elt)

      //console.log('attrValue', attrValue)

      if (removedElts.indexOf(elt.get(0)) >= 0) {
        //console.log('skip elt', elt, removedElts)
        return
      }

      if (dir == 'bn-if') {
        let value = getValue(data, attrValue)
        //console.log('bn-if', attrValue, value)
        if (value === false) {
          //console.log('remove', elt)
          removedElts.push(elt.get(0))
          elt.remove()
         
          return
        }
      }

      let {type, f} = map[dir]
      
      if (type == 1 || type == 2) {
        if (dir == 'bn-val') {
          let updateEvt = elt.attr('bn-update')
          if (updateEvt) {
            elt.removeAttr('bn-update')
            elt.on(updateEvt, function() {
              //console.log('[binding] updateEvt', updateEvt, elt)
              updateCbk(attrValue, elt.getValue(), elt.get(0))

            })
          }
        }

        let value = getValue(data, attrValue)        

        ctx.push({f, elt, type, attrValue, dir, oldValue: value})


        elt[f].call(elt, value)
      }

      if (type == 4) {
        $$.control.createControl(attrValue, elt)
      }
            
    })
     
  
  }
  
  //console.log('#### end process ####', ctx)
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
