(function() {

function polar2Cart(radius, angleDeg) {
	var angleRad = (angleDeg -90) * Math.PI/180
	return {
		x: radius * Math.cos(angleRad),
		y: radius * Math.sin(angleRad)
	}
}



function getArcPath(innerRadius, radius, startAngle, endAngle) {
	var p1 = polar2Cart(innerRadius, endAngle)
	var p2 = polar2Cart(innerRadius, startAngle)
	var p3 = polar2Cart(radius, startAngle)
	var p4 = polar2Cart(radius, endAngle)

	var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

	var d = [
		'M', p1.x, p1.y,
		'A', innerRadius, innerRadius, 0, largeArcFlag, 0, p2.x, p2.y,
		'L', p3.x, p3.y,
		'A', radius, radius, 0, largeArcFlag, 1, p4.x, p4.y,
		'z'


	].join(' ')


	return d

}


$$.control.registerControl('brainjs.circularmenu', {
	template: {gulp_inject: './circularmenu.html'},

	props: {
		triggerRadius: 20,
		hasTrigger: true,
		triggerPos: {left: 100, top: 100},
		innerRadius: 0,
		radius: 90,
		iconPos: 60,
		iconSize: 40,
		gap: 0,
		items: [],
		minSectors: 3
	},

	init: function(elt) {


		var that = this
		var open = false

		var triggerLabel = $.extend({open: '\uf068', close:'\uf067'}, this.props.triggerLabel)

		var {hasTrigger, minSectors, triggerPos, triggerRadius, innerRadius, radius, iconPos, iconSize, gap} = this.props

		var menus = this.props.items
		if (menus.length < minSectors) {
			menus = menus.concat(new Array(minSectors - menus.length).fill({}))
		}
		//console.log('menus', menus)		

		var sectorAngle = 360 / menus.length - gap
		//console.log('sectorAngle', sectorAngle)
		var p = polar2Cart(iconPos, 0)
		var arcPath = getArcPath(innerRadius, radius, -sectorAngle/2, sectorAngle/2)
		//console.log('arcPath', arcPath)


		var width = triggerRadius * 2
		var height = triggerRadius * 2
		var x = triggerRadius
		var y = triggerRadius		


		elt.css('position', 'relative')


		var sectors = menus.map(function(info, idx) {
			//console.log('config', info, idx)
			var angle = (sectorAngle + gap)  * idx
			var info = $.extend({fill: 'white', color: 'black', text: ''}, info)
			return {
				transform1: `rotate(${angle})`,
				info: info,
				transform2: `translate(${p.x}, ${p.y}) rotate(${-angle})` 
			}
		})

		const ctrl = $$.viewController(elt, {
			
			data : {
				hasTrigger,
				width,
				height,
				triggerRadius,
				transform1: `translate(${x}, ${y})`,
				triggerLabel: triggerLabel.close,
				arcPath: arcPath,
				sectors: sectors
			},
			events: {
				onTriggerClick: function(ev) {
					console.log('onTriggerClick')
				    ev.stopPropagation()
				    if (!open) {
				    	openMenu()
				    } 
				    else {
				    	closeMenu()
				    }				
				},
				onItemClicked: function(ev) {
					//console.log('onItemClicked', this)
					var idx = item.index(this)
					elt.trigger('menuSelected', menus[idx])				
				}

			}
		})

		const svg = ctrl.scope.svg

		const item = svg.find('.item')
		const items = svg.find('.items')
		TweenLite.set(item, {scale:0, visibility:"visible"})


		$(document).on('click', closeMenu)

		if (hasTrigger) {
			show(triggerPos.left, triggerPos.top)
		}



		function show(x, y) {
			//console.log('show', x, y)
			var left = x - (width/2)
			var top = y - (height/2)

			svg.css({left: left + 'px', top: top+'px'}).show()
		}


		function showMenu(x, y) {
			console.log('showMenu', x, y)
			show(x, y)
			openMenu()
		}


		function openMenu() {
			//console.log('openMenu', open)
			if (!open) {
		        TweenMax.staggerTo(item, 0.7, {scale:1, ease:Elastic.easeOut}, 0.05)
			        ctrl.setData({triggerLabel: triggerLabel.open})
			      	open = true		        	
		        

	      	}
		}

		function closeMenu(callback) {
			//console.log('closeMenu', open)
			if (open) {
			    TweenMax.staggerTo(item, .3, {scale:0, ease:Back.easeIn}, 0.05, function() {
			    	//console.log('finished !!')
			    	if (!hasTrigger) {
			    		svg.hide()
			    		elt.trigger('menuClosed')
			    	}

				    ctrl.setData({triggerLabel: triggerLabel.close})
				    open = false
				    if (typeof callback == 'function') callback.call(that)
			    });
			}
			else {
			    if (typeof callback == 'function') callback.call(that)
			}
		}

		this.select = function(idx) {
			items.find('.item.active').removeClass('active')
			if (idx >= 0) {
				item.eq(idx).addClass('active')
			}
			return this
		}

		this.showMenu = showMenu
		this.closeMenu = closeMenu


	},
	$iface: `
		select(idx);
		closeMenu(callback);
		showMenu(x, y)
	`,
	$events: 'menuClosed;menuSelected'

})


})();