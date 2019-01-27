
$(function() {

	let routes = [
		{href: '/', redirect: '/test1'}
	]
	for(let i = 1; i <= 21; i++ ) {
		routes.push({
			href: '/test' + i, control: 'test' + i
		})
	}



	$$.viewController('#main', {
		data: {
			routes
		}
	})
});
