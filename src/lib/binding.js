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

    // var not = false
    // if (varName.startsWith('!')) {
    //   varName = varName.substr(1)
    //   not = true
    // }     

    var func = data[varName]
    var value

    if (typeof func == 'function') {
      value = func.call(data)
    }
    else {
      value = getVarValue(data, varName)
    }


    // if (typeof value == 'boolean' && not) {
    //   value = !value
    // }

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
        let {type, f, elt, name, template, iter, not} = action
        if (elt == excludeElt) {
          return
        }

        let newValue = value

        if (not === true) {
          newValue = !newValue
        }
        if (type == 1) {
          //console.log('update', variable, f, newValue)
           elt[f].call(elt, newValue)
        }
        if (type == 2) {
          //console.log('update', variable, f, name, newValue)
           elt[f].call(elt, name, newValue)
        }   
        if (type == 3 && Array.isArray(newValue)) {
            elt.empty()
            newValue.forEach(function(item) {
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

function process(root, data, createControl, updateCbk) {

  
  if (root.length > 1) {
    console.error('[binding] process', root.length, data)
  }

  let ctx = {}
  
  for(let dir in map) {
    

    root.bnFindAttr(dir, function(elt, attrValue) {

      let {type, f} = map[dir]
      
      if (type == 1) {
        let not = false
        if (attrValue.startsWith('!')) {
          attrValue = attrValue.substr(1)
          not = true
        } 

        if (data) {
          let value = getValue(data, attrValue)
          if (not && typeof value == 'boolean') {
            value = !value
          }
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
        ctx[attrValue].push({f, elt, type, not})        
      }

      if (type == 4 && typeof createControl == 'function') {
        createControl(attrValue, elt)
      }

      if (type == 2) {

          splitAttr(attrValue, function(name, varName) {
            let not = false
            if (attrValue.startsWith('!')) {
              attrValue = attrValue.substr(1)
              not = true
            }             
            if (data) {
              let value = getValue(data, varName)
              if (not && typeof value == 'boolean') {
                value = !value
              }              
              elt[f].call(elt, name, value)
            }
            ctx[varName] = ctx[varName] || []
            ctx[varName].push({f, elt, type, name, not})  
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
