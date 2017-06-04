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
