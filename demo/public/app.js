(function() {

var ctrl = new brain.ViewControler('#main', {
  init: function() {
    console.log('init')
    this.filter = ''
    this.name = 'Marc',
    this.email = 'marc.delomez@free.fr',
    this.age = 14,
    this.color = 'red',
    this.radius = 20,
    this.clients = [
      {
        name: 'Quentin',
        city: 'Rennes'
      },
      {
        name: 'Marc',
        city: 'Bethune'
      }
    ]

    this.names = ['Brigitte', 'Marc', 'Quentin']
    this.isVisible = false
    this.fruits = ['apple', 'ananas']
    this.gender = 'male'
    this.curPage = 'page3'

  },

   rules: {
     '@getName': ['name'],
     '@getFilteredClients': ['filter', 'clients']
   },
  
  methods: {
    onUpdate: function(evt) {
      console.log('onUpdate')
      this.setData({name: 'Quentin', color: 'green', curPage: 'page1'})
      this.clients.push({name: 'Brigitte', city: 'LeMans'})
      this.names.push('Lucas')
      this.update('clients, names')
    },

    onDelete: function(evt) {
      console.log('onDelete', evt.info())
      var idx = this.clients.indexOf(evt.info().data)
      this.clients.splice(idx, 1)
      this.update('clients')
    },

    getName: function() {
      return 'Welcome ' + this.name
    },

    getCity: function(data) {
      return data.city
    },
    
    getFilteredClients: function() {
      var filter = this.filter
      return this.clients.filter(function(client) {
        return client.name.startsWith(filter)
      })
    }
  }
})

ctrl.render()

})()