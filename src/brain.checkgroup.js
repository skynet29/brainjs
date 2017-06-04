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
