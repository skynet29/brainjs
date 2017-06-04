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
