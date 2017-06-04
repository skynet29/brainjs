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
