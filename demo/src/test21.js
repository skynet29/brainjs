(function(){


const jsCode = `
const ctrl = $$.viewController('#main', {
	data: {
		gridColumns: ['name', 'location'],
		gridData: [
		   { name: 'American alligator', location: 'Southeast United States' },
		   { name: 'Chinese alligator', location: 'Eastern China' },
		   { name: 'Spectacled caiman', location: 'Central & South America' },
		   { name: 'Broad-snouted caiman', location: 'South America' },
		   { name: 'Jacaré caiman', location: 'South America' },
		   { name: 'Black caiman', location: 'South America' }
		 ],
		 filters: {location: 'S', name: ''}

	},
	events: {
		onFilterChange: function(ev) {
			const f = $(this).data('filter')
			ctrl.model.filters[f] = $(this).val()
			ctrl.update('filters')
		}
	}	
})	
`.trim()

const htmlCode = `
<div id="main">
	<div bn-event="input.filter: onFilterChange">
		<input type="text" placeholder="name filter" bn-val="filters.name" 
			data-filter="name" class="filter">

		<input type="text" placeholder="location filter" bn-val="filters.location"			
			data-filter="location" class="filter">

		
	</div>

	<div bn-control="brainjs.table" 
		bn-data="data: gridData, columns: gridColumns, filters: filters"></div>
</div>
`.trim()


$$.control.registerControl('test21', {
	template: {gulp_inject: './test21.html'},
	init: function(elt) {

		const ctrl = $$.viewController('#main', {
			data: {
				gridColumns: ['name', 'location'],
				gridData: [
				   { name: 'American alligator', location: 'Southeast United States' },
				   { name: 'Chinese alligator', location: 'Eastern China' },
				   { name: 'Spectacled caiman', location: 'Central & South America' },
				   { name: 'Broad-snouted caiman', location: 'South America' },
				   { name: 'Jacaré caiman', location: 'South America' },
				   { name: 'Black caiman', location: 'South America' }
				 ],
				 filters: {location: 'S', name: ''},
				 jsCode,
				 htmlCode

			},
			events: {
				onFilterChange: function(ev) {
					const f = $(this).data('filter')
					ctrl.model.filters[f] = $(this).val()
					ctrl.update('filters')
				}
			}
		})

	}
})


  


})();





