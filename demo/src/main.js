
$(function() {

	$$.viewController('#main', {
		data: {
			routes: [
				{href: '/', redirect: '/test1'},
				{href: '/test1', control: 'test1'},
				{href: '/test2', control: 'test2'},
				{href: '/test3', control: 'test3'},
				{href: '/test4', control: 'test4'},
				{href: '/test5', control: 'test5'},
				{href: '/test6', control: 'test6'},
				{href: '/test7', control: 'test7'}
			]
		}
	})
});
