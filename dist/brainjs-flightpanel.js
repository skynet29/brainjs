(function() {

	function toRad(val) {
		return val*Math.PI/180
	}	

	const defaultOptions = {
			skyColor: '#33f',
			earthColor: '#992',
			frontCameraFovY: 200,
			majorWidth: 100,
			minorWidth: 60,
			zeroWidth: 200,
			zeroGap: 20,
			radialLimit: 60,
			tickRadius: 10,
			radialRadius: 178,
			speedIndicatorHeight: 250,
			speedIndicatorWidth: 60,
			zeroPadding: 100,
			speedAltOpacity: 0.2,
			pixelsPer10Kmph: 50,
			minorTicksPer10Kmph: 5,
			speedWarningWidth: 10,

			yellowBoundarySpeed: 100,
			redBoundarySpeed: 130,

			altIndicatorHeight: 250,
			altIndicatorWidth: 50,
			majorTickWidth: 10,
			minorTickWidth: 5,
			pixelsPer100Ft: 50,
			minorTicksPer100Ft: 5				
		}


	$$.control.registerControl('brainjs.flightpanel',  {

		props: {
			roll: 0,
			pitch: 0,
			speed: 0,
			altitude: 0,
			options: {},
			showAltitude: true,
			showSpeed: true		
		},




		init: function(elt) {

			const options = $.extend({}, defaultOptions, this.props.options)
			let showAltitude
			let showSpeed
			let rollRad
			let pitchRad
			//console.log('options', options)

			var canvas = $('<canvas>').attr('width', 640).attr('height', 360).appendTo(elt)


			var ctx = canvas.get(0).getContext('2d')
			var pixelsPerDeg = ctx.canvas.height / (options.frontCameraFovY / 2)	 

			//console.log(`width: ${ctx.canvas.width}, height: ${ctx.canvas.height}`)





			function drawHorizon() {

				var {radialRadius, majorWidth, minorWidth, skyColor, earthColor} = options

			  ctx.save();
			  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
			  ctx.rotate(-rollRad);
			  var pitchPixels = pitchRad / (Math.PI * 2) * 360 * pixelsPerDeg;
			  ctx.translate(0, pitchPixels);
			  
			   ctx.fillStyle = skyColor;
			   ctx.fillRect(-10000, -10000, 20000, 10000);
			   ctx.fillStyle = earthColor;
			   ctx.fillRect(-10000, 0, 20000, 10000);
			  
			  // horizon
			  ctx.strokeStyle = '#fff';
			  ctx.fillStyle = 'white';
			  ctx.lineWidth = 2;
			  ctx.beginPath();
			  ctx.moveTo(-10000, 0);
			  ctx.lineTo(20000, 0);
			  ctx.stroke();

			  ctx.beginPath();
			  ctx.arc(0, -pitchPixels, radialRadius, 0, Math.PI * 2, false);
			  ctx.closePath();
			  ctx.clip();

			  ctx.beginPath();
			  for (var i = -18; i <= 18; ++i) {
			    var pitchAngle = i / 2 * 10;
			    if (i !== 0) {
			      if (i % 2 === 0) {
			        ctx.moveTo(-majorWidth / 2, -pixelsPerDeg * pitchAngle);
			        ctx.lineTo(+majorWidth / 2, -pixelsPerDeg * pitchAngle);
			        ctx.fillText(pitchAngle, -majorWidth / 2 - 20, -pixelsPerDeg * 10 / 2 * i);
			        ctx.fillText(pitchAngle, majorWidth / 2 + 10, -pixelsPerDeg * 10 / 2 * i);
			      } else {
			        ctx.moveTo(-minorWidth / 2, -pixelsPerDeg * pitchAngle);
			        ctx.lineTo(+minorWidth / 2, -pixelsPerDeg * pitchAngle);
			      }
			    }
			  }
			  ctx.closePath();
			  ctx.stroke();
			  ctx.restore();
			}

			function drawZero() {

				var {zeroWidth, zeroGap, radialRadius, radialLimit, tickRadius} = options

				ctx.save();
				ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
				ctx.strokeStyle = 'yellow';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(-zeroWidth / 2, 0);
				ctx.lineTo(-zeroGap / 2, 0);
				ctx.moveTo(+zeroWidth / 2, 0);
				ctx.lineTo(+zeroGap / 2, 0);
				ctx.moveTo(-zeroGap / 2, zeroGap / 2);
				ctx.lineTo(0, 0);
				ctx.lineTo(+zeroGap / 2, zeroGap / 2);
				ctx.stroke();
				// The radial roll indicator
				ctx.beginPath();
				ctx.arc(0, 0, radialRadius, -Math.PI / 2 - Math.PI * radialLimit / 180, -Math.PI / 2 + Math.PI * radialLimit / 180, false);
				ctx.stroke();
				for (var i = -4; i <= 4; ++i) {
					ctx.moveTo((radialRadius - tickRadius) * Math.cos(-Math.PI / 2 + i * 15 / 180 * Math.PI), (radialRadius - tickRadius) * Math.sin(-Math.PI / 2 + i * 15 / 180 * Math.PI));
					ctx.lineTo(radialRadius * Math.cos(-Math.PI / 2 + i * 15 / 180 * Math.PI), radialRadius * Math.sin(-Math.PI / 2 + i * 15 / 180 * Math.PI));
				}
				ctx.stroke();
				ctx.restore();
			}	

			function drawRoll() {

				var {radialRadius} = options

				ctx.save();
				ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
				ctx.rotate(-rollRad);
				ctx.fillStyle = 'white';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(0, -radialRadius);
				ctx.lineTo(-5, -radialRadius + 10);
				ctx.lineTo(+5, -radialRadius + 10);
				ctx.closePath();
				ctx.fill();
				var readableRollAngle = Math.round(rollRad / Math.PI / 2 * 360) % 360;
				if (readableRollAngle > 180) {
					readableRollAngle = readableRollAngle - 360;
				}
				ctx.fillRect(-20, -radialRadius + 9, 40, 16);
				ctx.font = '12px Arial';
				ctx.fillStyle = 'black';
				ctx.fillText(readableRollAngle, -7, -radialRadius + 22);
				ctx.restore();
			}			

			function drawSpeed() {

				var {
					speedIndicatorHeight,
					speedIndicatorWidth,
					speedWarningWidth,
					zeroPadding,
					zeroWidth,
					speedAltOpacity,
					yellowBoundarySpeed,
					redBoundarySpeed,
					pixelsPer10Kmph,
					majorTickWidth,
					minorTickWidth,
					minorTicksPer10Kmph,
					altIndicatorHeight,
					speed
				}  = options


				ctx.save();
				ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
				ctx.translate(-zeroWidth / 2 - zeroPadding - speedIndicatorWidth, 0);
				ctx.fillStyle = 'rgba(0,0,0,' + speedAltOpacity + ')';
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 2;
				ctx.strokeRect(0, -speedIndicatorHeight / 2, speedIndicatorWidth, speedIndicatorHeight);
				ctx.fillRect(0, -speedIndicatorHeight / 2, speedIndicatorWidth, speedIndicatorHeight);
				ctx.restore();
				ctx.save();
				ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
				ctx.translate(-zeroWidth / 2 - zeroPadding - speedIndicatorWidth, 0);
				ctx.rect(0, -speedIndicatorHeight / 2, speedIndicatorWidth, speedIndicatorHeight);
				ctx.clip();
				var yellowBoundaryY = -(-speed + yellowBoundarySpeed) / 10 * pixelsPer10Kmph;
				var redBoundaryY = -(-speed + redBoundarySpeed) / 10 * pixelsPer10Kmph;
				ctx.fillStyle = 'yellow';
				ctx.fillRect(speedIndicatorWidth - speedWarningWidth, yellowBoundaryY, speedWarningWidth, redBoundaryY - yellowBoundaryY);
				ctx.fillStyle = 'red';
				ctx.fillRect(speedIndicatorWidth - speedWarningWidth, redBoundaryY, speedWarningWidth, -speedIndicatorHeight / 2 - redBoundaryY);
				ctx.fillStyle = 'green';
				ctx.fillRect(speedIndicatorWidth - speedWarningWidth, yellowBoundaryY, speedWarningWidth, +speedIndicatorHeight / 2 - yellowBoundaryY);
				var yOffset = speed / 10 * pixelsPer10Kmph;
				// The unclipped ticks to be rendered.
				// We render 100kmph either side of the center to be safe
				var from = -Math.floor(speed / 10) - 10;
				var to = Math.ceil(speed / 10) + 10;
				for (var i = from; i < to; ++i) {
					ctx.moveTo(speedIndicatorWidth - speedWarningWidth, -i * pixelsPer10Kmph + yOffset);
					ctx.lineTo(speedIndicatorWidth - speedWarningWidth - majorTickWidth, -i * pixelsPer10Kmph + yOffset);
					for (j = 1; j < minorTicksPer10Kmph; ++j) {
					  ctx.moveTo(speedIndicatorWidth - speedWarningWidth, -i * pixelsPer10Kmph - j * pixelsPer10Kmph / minorTicksPer10Kmph + yOffset);
					  ctx.lineTo(speedIndicatorWidth - speedWarningWidth - minorTickWidth, -i * pixelsPer10Kmph - j * pixelsPer10Kmph / minorTicksPer10Kmph + yOffset);
					}
					ctx.font = '12px Arial';
					ctx.fillStyle = 'white';
					ctx.fillText(i * 10, 20, -i * pixelsPer10Kmph + yOffset + 4);
				}
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(speedIndicatorWidth - speedWarningWidth - minorTickWidth, 0);
				ctx.lineTo(speedIndicatorWidth - speedWarningWidth - minorTickWidth * 2, -5);
				ctx.lineTo(speedIndicatorWidth - speedWarningWidth - minorTickWidth * 2, -10);
				ctx.lineTo(0, -10);
				ctx.lineTo(0, 10);
				ctx.lineTo(speedIndicatorWidth - speedWarningWidth - minorTickWidth * 2, 10);
				ctx.lineTo(speedIndicatorWidth - speedWarningWidth - minorTickWidth * 2, 5);
				ctx.closePath();
				ctx.fill();
				ctx.strokeStyle = 'black';
				ctx.fillStyle = 'black';
				ctx.fillText(Math.round(speed * 100) / 100, 15, 4.5, altIndicatorHeight);
				ctx.restore();
			}		


			function drawAltitude() {

				var {
					zeroWidth,
					zeroPadding,
					speedAltOpacity,
					altIndicatorHeight,
					altIndicatorWidth,
					pixelsPer100Ft,
					minorTickWidth,
					majorTickWidth,
					minorTicksPer100Ft,
					altitude
				} = options

				ctx.save();
				ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
				ctx.translate(zeroWidth / 2 + zeroPadding, 0);
				ctx.fillStyle = 'rgba(0,0,0,' + speedAltOpacity + ')';
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 2;
				ctx.fillRect(0, -altIndicatorHeight / 2, altIndicatorWidth, altIndicatorHeight);
				ctx.strokeRect(0, -altIndicatorHeight / 2, altIndicatorWidth, altIndicatorHeight);
				ctx.restore();
				ctx.save();
				ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
				ctx.translate(zeroWidth / 2 + zeroPadding, 0);
				ctx.rect(0, -altIndicatorHeight / 2, altIndicatorWidth, altIndicatorHeight);
				ctx.clip();
				var yOffset = altitude / 1 * pixelsPer100Ft;
				// The unclipped ticks to be rendered. We render 500ft either side of
				// the center to be safe
				var from = Math.floor(altitude / 1) - 5;
				var to = Math.ceil(altitude / 1) + 5;
				for (var i = from; i < to; ++i) {
					ctx.moveTo(0, -i * pixelsPer100Ft + yOffset);
					ctx.lineTo(majorTickWidth, -i * pixelsPer100Ft + yOffset);
					for (var j = 1; j < minorTicksPer100Ft; ++j) {
						  ctx.moveTo(0, -i * pixelsPer100Ft - j * pixelsPer100Ft / minorTicksPer100Ft + yOffset);
						  ctx.lineTo(minorTickWidth, -i * pixelsPer100Ft - j * pixelsPer100Ft / minorTicksPer100Ft + yOffset);
					}
					ctx.font = '12px Arial';
					ctx.fillStyle = 'white';
					ctx.fillText(i * 1, 15, -i * pixelsPer100Ft + yOffset + 4);
				}
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.restore();
				ctx.save();
				ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
				ctx.translate(zeroWidth / 2 + zeroPadding, 0);
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 2;
				ctx.font = '12px Arial';
				ctx.fillStyle = 'white';
				ctx.fillOpacity = 1;
				ctx.beginPath();
				ctx.moveTo(minorTickWidth, 0);
				ctx.lineTo(minorTickWidth * 2, -5);
				ctx.lineTo(minorTickWidth * 2, -10);
				ctx.lineTo(altIndicatorWidth, -10);
				ctx.lineTo(altIndicatorWidth, 10);
				ctx.lineTo(minorTickWidth * 2, 10);
				ctx.lineTo(minorTickWidth * 2, 5);
				ctx.closePath();
				ctx.fill();
				ctx.strokeStyle = 'black';
				ctx.fillStyle = 'black';
				ctx.fillText(Math.round(altitude * 100) / 100, 15, 4.5, altIndicatorHeight);
				ctx.restore();
			}			

			function render() {
				drawHorizon()
				drawZero()
				drawRoll()
				if (showSpeed) {
					drawSpeed()
				}
				if (showAltitude) {
					drawAltitude()
				}
			}


			this.update = function(data) {
				//console.log('[flightpanel] update', data)
				$.extend(this.props, data)
				showAltitude = this.props.showAltitude				
				showSpeed = this.props.showSpeed
				rollRad = toRad(this.props.roll)
				pitchRad = toRad(this.props.pitch)				
				options.speed = this.props.speed
				options.altitude = this.props.altitude

				render()
			}

			this.update()
			
		},

		$iface: 'setRoll(roll);setPitch(pitch);setSpeed(speed);setAltitude(altitude)'
	})


})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsaWdodHBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJicmFpbmpzLWZsaWdodHBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIHRvUmFkKHZhbCkge1xuXHRcdHJldHVybiB2YWwqTWF0aC5QSS8xODBcblx0fVx0XG5cblx0Y29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRza3lDb2xvcjogJyMzM2YnLFxuXHRcdFx0ZWFydGhDb2xvcjogJyM5OTInLFxuXHRcdFx0ZnJvbnRDYW1lcmFGb3ZZOiAyMDAsXG5cdFx0XHRtYWpvcldpZHRoOiAxMDAsXG5cdFx0XHRtaW5vcldpZHRoOiA2MCxcblx0XHRcdHplcm9XaWR0aDogMjAwLFxuXHRcdFx0emVyb0dhcDogMjAsXG5cdFx0XHRyYWRpYWxMaW1pdDogNjAsXG5cdFx0XHR0aWNrUmFkaXVzOiAxMCxcblx0XHRcdHJhZGlhbFJhZGl1czogMTc4LFxuXHRcdFx0c3BlZWRJbmRpY2F0b3JIZWlnaHQ6IDI1MCxcblx0XHRcdHNwZWVkSW5kaWNhdG9yV2lkdGg6IDYwLFxuXHRcdFx0emVyb1BhZGRpbmc6IDEwMCxcblx0XHRcdHNwZWVkQWx0T3BhY2l0eTogMC4yLFxuXHRcdFx0cGl4ZWxzUGVyMTBLbXBoOiA1MCxcblx0XHRcdG1pbm9yVGlja3NQZXIxMEttcGg6IDUsXG5cdFx0XHRzcGVlZFdhcm5pbmdXaWR0aDogMTAsXG5cblx0XHRcdHllbGxvd0JvdW5kYXJ5U3BlZWQ6IDEwMCxcblx0XHRcdHJlZEJvdW5kYXJ5U3BlZWQ6IDEzMCxcblxuXHRcdFx0YWx0SW5kaWNhdG9ySGVpZ2h0OiAyNTAsXG5cdFx0XHRhbHRJbmRpY2F0b3JXaWR0aDogNTAsXG5cdFx0XHRtYWpvclRpY2tXaWR0aDogMTAsXG5cdFx0XHRtaW5vclRpY2tXaWR0aDogNSxcblx0XHRcdHBpeGVsc1BlcjEwMEZ0OiA1MCxcblx0XHRcdG1pbm9yVGlja3NQZXIxMDBGdDogNVx0XHRcdFx0XG5cdFx0fVxuXG5cblx0JCQuY29udHJvbC5yZWdpc3RlckNvbnRyb2woJ2JyYWluanMuZmxpZ2h0cGFuZWwnLCAge1xuXG5cdFx0cHJvcHM6IHtcblx0XHRcdHJvbGw6IDAsXG5cdFx0XHRwaXRjaDogMCxcblx0XHRcdHNwZWVkOiAwLFxuXHRcdFx0YWx0aXR1ZGU6IDAsXG5cdFx0XHRvcHRpb25zOiB7fSxcblx0XHRcdHNob3dBbHRpdHVkZTogdHJ1ZSxcblx0XHRcdHNob3dTcGVlZDogdHJ1ZVx0XHRcblx0XHR9LFxuXG5cblxuXG5cdFx0aW5pdDogZnVuY3Rpb24oZWx0KSB7XG5cblx0XHRcdGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHRoaXMucHJvcHMub3B0aW9ucylcblx0XHRcdGxldCBzaG93QWx0aXR1ZGVcblx0XHRcdGxldCBzaG93U3BlZWRcblx0XHRcdGxldCByb2xsUmFkXG5cdFx0XHRsZXQgcGl0Y2hSYWRcblx0XHRcdC8vY29uc29sZS5sb2coJ29wdGlvbnMnLCBvcHRpb25zKVxuXG5cdFx0XHR2YXIgY2FudmFzID0gJCgnPGNhbnZhcz4nKS5hdHRyKCd3aWR0aCcsIDY0MCkuYXR0cignaGVpZ2h0JywgMzYwKS5hcHBlbmRUbyhlbHQpXG5cblxuXHRcdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXQoMCkuZ2V0Q29udGV4dCgnMmQnKVxuXHRcdFx0dmFyIHBpeGVsc1BlckRlZyA9IGN0eC5jYW52YXMuaGVpZ2h0IC8gKG9wdGlvbnMuZnJvbnRDYW1lcmFGb3ZZIC8gMilcdCBcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhgd2lkdGg6ICR7Y3R4LmNhbnZhcy53aWR0aH0sIGhlaWdodDogJHtjdHguY2FudmFzLmhlaWdodH1gKVxuXG5cblxuXG5cblx0XHRcdGZ1bmN0aW9uIGRyYXdIb3Jpem9uKCkge1xuXG5cdFx0XHRcdHZhciB7cmFkaWFsUmFkaXVzLCBtYWpvcldpZHRoLCBtaW5vcldpZHRoLCBza3lDb2xvciwgZWFydGhDb2xvcn0gPSBvcHRpb25zXG5cblx0XHRcdCAgY3R4LnNhdmUoKTtcblx0XHRcdCAgY3R4LnRyYW5zbGF0ZShjdHguY2FudmFzLndpZHRoIC8gMiwgY3R4LmNhbnZhcy5oZWlnaHQgLyAyKTtcblx0XHRcdCAgY3R4LnJvdGF0ZSgtcm9sbFJhZCk7XG5cdFx0XHQgIHZhciBwaXRjaFBpeGVscyA9IHBpdGNoUmFkIC8gKE1hdGguUEkgKiAyKSAqIDM2MCAqIHBpeGVsc1BlckRlZztcblx0XHRcdCAgY3R4LnRyYW5zbGF0ZSgwLCBwaXRjaFBpeGVscyk7XG5cdFx0XHQgIFxuXHRcdFx0ICAgY3R4LmZpbGxTdHlsZSA9IHNreUNvbG9yO1xuXHRcdFx0ICAgY3R4LmZpbGxSZWN0KC0xMDAwMCwgLTEwMDAwLCAyMDAwMCwgMTAwMDApO1xuXHRcdFx0ICAgY3R4LmZpbGxTdHlsZSA9IGVhcnRoQ29sb3I7XG5cdFx0XHQgICBjdHguZmlsbFJlY3QoLTEwMDAwLCAwLCAyMDAwMCwgMTAwMDApO1xuXHRcdFx0ICBcblx0XHRcdCAgLy8gaG9yaXpvblxuXHRcdFx0ICBjdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG5cdFx0XHQgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0ICBjdHgubGluZVdpZHRoID0gMjtcblx0XHRcdCAgY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0ICBjdHgubW92ZVRvKC0xMDAwMCwgMCk7XG5cdFx0XHQgIGN0eC5saW5lVG8oMjAwMDAsIDApO1xuXHRcdFx0ICBjdHguc3Ryb2tlKCk7XG5cblx0XHRcdCAgY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0ICBjdHguYXJjKDAsIC1waXRjaFBpeGVscywgcmFkaWFsUmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuXHRcdFx0ICBjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHQgIGN0eC5jbGlwKCk7XG5cblx0XHRcdCAgY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0ICBmb3IgKHZhciBpID0gLTE4OyBpIDw9IDE4OyArK2kpIHtcblx0XHRcdCAgICB2YXIgcGl0Y2hBbmdsZSA9IGkgLyAyICogMTA7XG5cdFx0XHQgICAgaWYgKGkgIT09IDApIHtcblx0XHRcdCAgICAgIGlmIChpICUgMiA9PT0gMCkge1xuXHRcdFx0ICAgICAgICBjdHgubW92ZVRvKC1tYWpvcldpZHRoIC8gMiwgLXBpeGVsc1BlckRlZyAqIHBpdGNoQW5nbGUpO1xuXHRcdFx0ICAgICAgICBjdHgubGluZVRvKCttYWpvcldpZHRoIC8gMiwgLXBpeGVsc1BlckRlZyAqIHBpdGNoQW5nbGUpO1xuXHRcdFx0ICAgICAgICBjdHguZmlsbFRleHQocGl0Y2hBbmdsZSwgLW1ham9yV2lkdGggLyAyIC0gMjAsIC1waXhlbHNQZXJEZWcgKiAxMCAvIDIgKiBpKTtcblx0XHRcdCAgICAgICAgY3R4LmZpbGxUZXh0KHBpdGNoQW5nbGUsIG1ham9yV2lkdGggLyAyICsgMTAsIC1waXhlbHNQZXJEZWcgKiAxMCAvIDIgKiBpKTtcblx0XHRcdCAgICAgIH0gZWxzZSB7XG5cdFx0XHQgICAgICAgIGN0eC5tb3ZlVG8oLW1pbm9yV2lkdGggLyAyLCAtcGl4ZWxzUGVyRGVnICogcGl0Y2hBbmdsZSk7XG5cdFx0XHQgICAgICAgIGN0eC5saW5lVG8oK21pbm9yV2lkdGggLyAyLCAtcGl4ZWxzUGVyRGVnICogcGl0Y2hBbmdsZSk7XG5cdFx0XHQgICAgICB9XG5cdFx0XHQgICAgfVxuXHRcdFx0ICB9XG5cdFx0XHQgIGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdCAgY3R4LnN0cm9rZSgpO1xuXHRcdFx0ICBjdHgucmVzdG9yZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBkcmF3WmVybygpIHtcblxuXHRcdFx0XHR2YXIge3plcm9XaWR0aCwgemVyb0dhcCwgcmFkaWFsUmFkaXVzLCByYWRpYWxMaW1pdCwgdGlja1JhZGl1c30gPSBvcHRpb25zXG5cblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjdHguY2FudmFzLndpZHRoIC8gMiwgY3R4LmNhbnZhcy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3llbGxvdyc7XG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGN0eC5tb3ZlVG8oLXplcm9XaWR0aCAvIDIsIDApO1xuXHRcdFx0XHRjdHgubGluZVRvKC16ZXJvR2FwIC8gMiwgMCk7XG5cdFx0XHRcdGN0eC5tb3ZlVG8oK3plcm9XaWR0aCAvIDIsIDApO1xuXHRcdFx0XHRjdHgubGluZVRvKCt6ZXJvR2FwIC8gMiwgMCk7XG5cdFx0XHRcdGN0eC5tb3ZlVG8oLXplcm9HYXAgLyAyLCB6ZXJvR2FwIC8gMik7XG5cdFx0XHRcdGN0eC5saW5lVG8oMCwgMCk7XG5cdFx0XHRcdGN0eC5saW5lVG8oK3plcm9HYXAgLyAyLCB6ZXJvR2FwIC8gMik7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0Ly8gVGhlIHJhZGlhbCByb2xsIGluZGljYXRvclxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGN0eC5hcmMoMCwgMCwgcmFkaWFsUmFkaXVzLCAtTWF0aC5QSSAvIDIgLSBNYXRoLlBJICogcmFkaWFsTGltaXQgLyAxODAsIC1NYXRoLlBJIC8gMiArIE1hdGguUEkgKiByYWRpYWxMaW1pdCAvIDE4MCwgZmFsc2UpO1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAtNDsgaSA8PSA0OyArK2kpIHtcblx0XHRcdFx0XHRjdHgubW92ZVRvKChyYWRpYWxSYWRpdXMgLSB0aWNrUmFkaXVzKSAqIE1hdGguY29zKC1NYXRoLlBJIC8gMiArIGkgKiAxNSAvIDE4MCAqIE1hdGguUEkpLCAocmFkaWFsUmFkaXVzIC0gdGlja1JhZGl1cykgKiBNYXRoLnNpbigtTWF0aC5QSSAvIDIgKyBpICogMTUgLyAxODAgKiBNYXRoLlBJKSk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVUbyhyYWRpYWxSYWRpdXMgKiBNYXRoLmNvcygtTWF0aC5QSSAvIDIgKyBpICogMTUgLyAxODAgKiBNYXRoLlBJKSwgcmFkaWFsUmFkaXVzICogTWF0aC5zaW4oLU1hdGguUEkgLyAyICsgaSAqIDE1IC8gMTgwICogTWF0aC5QSSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cdFxuXG5cdFx0XHRmdW5jdGlvbiBkcmF3Um9sbCgpIHtcblxuXHRcdFx0XHR2YXIge3JhZGlhbFJhZGl1c30gPSBvcHRpb25zXG5cblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjdHguY2FudmFzLndpZHRoIC8gMiwgY3R4LmNhbnZhcy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0Y3R4LnJvdGF0ZSgtcm9sbFJhZCk7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gMjtcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjdHgubW92ZVRvKDAsIC1yYWRpYWxSYWRpdXMpO1xuXHRcdFx0XHRjdHgubGluZVRvKC01LCAtcmFkaWFsUmFkaXVzICsgMTApO1xuXHRcdFx0XHRjdHgubGluZVRvKCs1LCAtcmFkaWFsUmFkaXVzICsgMTApO1xuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdHZhciByZWFkYWJsZVJvbGxBbmdsZSA9IE1hdGgucm91bmQocm9sbFJhZCAvIE1hdGguUEkgLyAyICogMzYwKSAlIDM2MDtcblx0XHRcdFx0aWYgKHJlYWRhYmxlUm9sbEFuZ2xlID4gMTgwKSB7XG5cdFx0XHRcdFx0cmVhZGFibGVSb2xsQW5nbGUgPSByZWFkYWJsZVJvbGxBbmdsZSAtIDM2MDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjdHguZmlsbFJlY3QoLTIwLCAtcmFkaWFsUmFkaXVzICsgOSwgNDAsIDE2KTtcblx0XHRcdFx0Y3R4LmZvbnQgPSAnMTJweCBBcmlhbCc7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuXHRcdFx0XHRjdHguZmlsbFRleHQocmVhZGFibGVSb2xsQW5nbGUsIC03LCAtcmFkaWFsUmFkaXVzICsgMjIpO1xuXHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdFx0fVx0XHRcdFxuXG5cdFx0XHRmdW5jdGlvbiBkcmF3U3BlZWQoKSB7XG5cblx0XHRcdFx0dmFyIHtcblx0XHRcdFx0XHRzcGVlZEluZGljYXRvckhlaWdodCxcblx0XHRcdFx0XHRzcGVlZEluZGljYXRvcldpZHRoLFxuXHRcdFx0XHRcdHNwZWVkV2FybmluZ1dpZHRoLFxuXHRcdFx0XHRcdHplcm9QYWRkaW5nLFxuXHRcdFx0XHRcdHplcm9XaWR0aCxcblx0XHRcdFx0XHRzcGVlZEFsdE9wYWNpdHksXG5cdFx0XHRcdFx0eWVsbG93Qm91bmRhcnlTcGVlZCxcblx0XHRcdFx0XHRyZWRCb3VuZGFyeVNwZWVkLFxuXHRcdFx0XHRcdHBpeGVsc1BlcjEwS21waCxcblx0XHRcdFx0XHRtYWpvclRpY2tXaWR0aCxcblx0XHRcdFx0XHRtaW5vclRpY2tXaWR0aCxcblx0XHRcdFx0XHRtaW5vclRpY2tzUGVyMTBLbXBoLFxuXHRcdFx0XHRcdGFsdEluZGljYXRvckhlaWdodCxcblx0XHRcdFx0XHRzcGVlZFxuXHRcdFx0XHR9ICA9IG9wdGlvbnNcblxuXG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoLXplcm9XaWR0aCAvIDIgLSB6ZXJvUGFkZGluZyAtIHNwZWVkSW5kaWNhdG9yV2lkdGgsIDApO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIHNwZWVkQWx0T3BhY2l0eSArICcpJztcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRcdGN0eC5zdHJva2VSZWN0KDAsIC1zcGVlZEluZGljYXRvckhlaWdodCAvIDIsIHNwZWVkSW5kaWNhdG9yV2lkdGgsIHNwZWVkSW5kaWNhdG9ySGVpZ2h0KTtcblx0XHRcdFx0Y3R4LmZpbGxSZWN0KDAsIC1zcGVlZEluZGljYXRvckhlaWdodCAvIDIsIHNwZWVkSW5kaWNhdG9yV2lkdGgsIHNwZWVkSW5kaWNhdG9ySGVpZ2h0KTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjdHguY2FudmFzLndpZHRoIC8gMiwgY3R4LmNhbnZhcy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZSgtemVyb1dpZHRoIC8gMiAtIHplcm9QYWRkaW5nIC0gc3BlZWRJbmRpY2F0b3JXaWR0aCwgMCk7XG5cdFx0XHRcdGN0eC5yZWN0KDAsIC1zcGVlZEluZGljYXRvckhlaWdodCAvIDIsIHNwZWVkSW5kaWNhdG9yV2lkdGgsIHNwZWVkSW5kaWNhdG9ySGVpZ2h0KTtcblx0XHRcdFx0Y3R4LmNsaXAoKTtcblx0XHRcdFx0dmFyIHllbGxvd0JvdW5kYXJ5WSA9IC0oLXNwZWVkICsgeWVsbG93Qm91bmRhcnlTcGVlZCkgLyAxMCAqIHBpeGVsc1BlcjEwS21waDtcblx0XHRcdFx0dmFyIHJlZEJvdW5kYXJ5WSA9IC0oLXNwZWVkICsgcmVkQm91bmRhcnlTcGVlZCkgLyAxMCAqIHBpeGVsc1BlcjEwS21waDtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICd5ZWxsb3cnO1xuXHRcdFx0XHRjdHguZmlsbFJlY3Qoc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoLCB5ZWxsb3dCb3VuZGFyeVksIHNwZWVkV2FybmluZ1dpZHRoLCByZWRCb3VuZGFyeVkgLSB5ZWxsb3dCb3VuZGFyeVkpO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG5cdFx0XHRcdGN0eC5maWxsUmVjdChzcGVlZEluZGljYXRvcldpZHRoIC0gc3BlZWRXYXJuaW5nV2lkdGgsIHJlZEJvdW5kYXJ5WSwgc3BlZWRXYXJuaW5nV2lkdGgsIC1zcGVlZEluZGljYXRvckhlaWdodCAvIDIgLSByZWRCb3VuZGFyeVkpO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ2dyZWVuJztcblx0XHRcdFx0Y3R4LmZpbGxSZWN0KHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCwgeWVsbG93Qm91bmRhcnlZLCBzcGVlZFdhcm5pbmdXaWR0aCwgK3NwZWVkSW5kaWNhdG9ySGVpZ2h0IC8gMiAtIHllbGxvd0JvdW5kYXJ5WSk7XG5cdFx0XHRcdHZhciB5T2Zmc2V0ID0gc3BlZWQgLyAxMCAqIHBpeGVsc1BlcjEwS21waDtcblx0XHRcdFx0Ly8gVGhlIHVuY2xpcHBlZCB0aWNrcyB0byBiZSByZW5kZXJlZC5cblx0XHRcdFx0Ly8gV2UgcmVuZGVyIDEwMGttcGggZWl0aGVyIHNpZGUgb2YgdGhlIGNlbnRlciB0byBiZSBzYWZlXG5cdFx0XHRcdHZhciBmcm9tID0gLU1hdGguZmxvb3Ioc3BlZWQgLyAxMCkgLSAxMDtcblx0XHRcdFx0dmFyIHRvID0gTWF0aC5jZWlsKHNwZWVkIC8gMTApICsgMTA7XG5cdFx0XHRcdGZvciAodmFyIGkgPSBmcm9tOyBpIDwgdG87ICsraSkge1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8oc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoLCAtaSAqIHBpeGVsc1BlcjEwS21waCArIHlPZmZzZXQpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8oc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoIC0gbWFqb3JUaWNrV2lkdGgsIC1pICogcGl4ZWxzUGVyMTBLbXBoICsgeU9mZnNldCk7XG5cdFx0XHRcdFx0Zm9yIChqID0gMTsgaiA8IG1pbm9yVGlja3NQZXIxMEttcGg7ICsraikge1xuXHRcdFx0XHRcdCAgY3R4Lm1vdmVUbyhzcGVlZEluZGljYXRvcldpZHRoIC0gc3BlZWRXYXJuaW5nV2lkdGgsIC1pICogcGl4ZWxzUGVyMTBLbXBoIC0gaiAqIHBpeGVsc1BlcjEwS21waCAvIG1pbm9yVGlja3NQZXIxMEttcGggKyB5T2Zmc2V0KTtcblx0XHRcdFx0XHQgIGN0eC5saW5lVG8oc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoIC0gbWlub3JUaWNrV2lkdGgsIC1pICogcGl4ZWxzUGVyMTBLbXBoIC0gaiAqIHBpeGVsc1BlcjEwS21waCAvIG1pbm9yVGlja3NQZXIxMEttcGggKyB5T2Zmc2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3R4LmZvbnQgPSAnMTJweCBBcmlhbCc7XG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KGkgKiAxMCwgMjAsIC1pICogcGl4ZWxzUGVyMTBLbXBoICsgeU9mZnNldCArIDQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0Y3R4Lm1vdmVUbyhzcGVlZEluZGljYXRvcldpZHRoIC0gc3BlZWRXYXJuaW5nV2lkdGggLSBtaW5vclRpY2tXaWR0aCwgMCk7XG5cdFx0XHRcdGN0eC5saW5lVG8oc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoIC0gbWlub3JUaWNrV2lkdGggKiAyLCAtNSk7XG5cdFx0XHRcdGN0eC5saW5lVG8oc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoIC0gbWlub3JUaWNrV2lkdGggKiAyLCAtMTApO1xuXHRcdFx0XHRjdHgubGluZVRvKDAsIC0xMCk7XG5cdFx0XHRcdGN0eC5saW5lVG8oMCwgMTApO1xuXHRcdFx0XHRjdHgubGluZVRvKHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCAtIG1pbm9yVGlja1dpZHRoICogMiwgMTApO1xuXHRcdFx0XHRjdHgubGluZVRvKHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCAtIG1pbm9yVGlja1dpZHRoICogMiwgNSk7XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChNYXRoLnJvdW5kKHNwZWVkICogMTAwKSAvIDEwMCwgMTUsIDQuNSwgYWx0SW5kaWNhdG9ySGVpZ2h0KTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cdFx0XG5cblxuXHRcdFx0ZnVuY3Rpb24gZHJhd0FsdGl0dWRlKCkge1xuXG5cdFx0XHRcdHZhciB7XG5cdFx0XHRcdFx0emVyb1dpZHRoLFxuXHRcdFx0XHRcdHplcm9QYWRkaW5nLFxuXHRcdFx0XHRcdHNwZWVkQWx0T3BhY2l0eSxcblx0XHRcdFx0XHRhbHRJbmRpY2F0b3JIZWlnaHQsXG5cdFx0XHRcdFx0YWx0SW5kaWNhdG9yV2lkdGgsXG5cdFx0XHRcdFx0cGl4ZWxzUGVyMTAwRnQsXG5cdFx0XHRcdFx0bWlub3JUaWNrV2lkdGgsXG5cdFx0XHRcdFx0bWFqb3JUaWNrV2lkdGgsXG5cdFx0XHRcdFx0bWlub3JUaWNrc1BlcjEwMEZ0LFxuXHRcdFx0XHRcdGFsdGl0dWRlXG5cdFx0XHRcdH0gPSBvcHRpb25zXG5cblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjdHguY2FudmFzLndpZHRoIC8gMiwgY3R4LmNhbnZhcy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZSh6ZXJvV2lkdGggLyAyICsgemVyb1BhZGRpbmcsIDApO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsJyArIHNwZWVkQWx0T3BhY2l0eSArICcpJztcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAtYWx0SW5kaWNhdG9ySGVpZ2h0IC8gMiwgYWx0SW5kaWNhdG9yV2lkdGgsIGFsdEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5zdHJva2VSZWN0KDAsIC1hbHRJbmRpY2F0b3JIZWlnaHQgLyAyLCBhbHRJbmRpY2F0b3JXaWR0aCwgYWx0SW5kaWNhdG9ySGVpZ2h0KTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjdHguY2FudmFzLndpZHRoIC8gMiwgY3R4LmNhbnZhcy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZSh6ZXJvV2lkdGggLyAyICsgemVyb1BhZGRpbmcsIDApO1xuXHRcdFx0XHRjdHgucmVjdCgwLCAtYWx0SW5kaWNhdG9ySGVpZ2h0IC8gMiwgYWx0SW5kaWNhdG9yV2lkdGgsIGFsdEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5jbGlwKCk7XG5cdFx0XHRcdHZhciB5T2Zmc2V0ID0gYWx0aXR1ZGUgLyAxICogcGl4ZWxzUGVyMTAwRnQ7XG5cdFx0XHRcdC8vIFRoZSB1bmNsaXBwZWQgdGlja3MgdG8gYmUgcmVuZGVyZWQuIFdlIHJlbmRlciA1MDBmdCBlaXRoZXIgc2lkZSBvZlxuXHRcdFx0XHQvLyB0aGUgY2VudGVyIHRvIGJlIHNhZmVcblx0XHRcdFx0dmFyIGZyb20gPSBNYXRoLmZsb29yKGFsdGl0dWRlIC8gMSkgLSA1O1xuXHRcdFx0XHR2YXIgdG8gPSBNYXRoLmNlaWwoYWx0aXR1ZGUgLyAxKSArIDU7XG5cdFx0XHRcdGZvciAodmFyIGkgPSBmcm9tOyBpIDwgdG87ICsraSkge1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8oMCwgLWkgKiBwaXhlbHNQZXIxMDBGdCArIHlPZmZzZXQpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8obWFqb3JUaWNrV2lkdGgsIC1pICogcGl4ZWxzUGVyMTAwRnQgKyB5T2Zmc2V0KTtcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMTsgaiA8IG1pbm9yVGlja3NQZXIxMDBGdDsgKytqKSB7XG5cdFx0XHRcdFx0XHQgIGN0eC5tb3ZlVG8oMCwgLWkgKiBwaXhlbHNQZXIxMDBGdCAtIGogKiBwaXhlbHNQZXIxMDBGdCAvIG1pbm9yVGlja3NQZXIxMDBGdCArIHlPZmZzZXQpO1xuXHRcdFx0XHRcdFx0ICBjdHgubGluZVRvKG1pbm9yVGlja1dpZHRoLCAtaSAqIHBpeGVsc1BlcjEwMEZ0IC0gaiAqIHBpeGVsc1BlcjEwMEZ0IC8gbWlub3JUaWNrc1BlcjEwMEZ0ICsgeU9mZnNldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN0eC5mb250ID0gJzEycHggQXJpYWwnO1xuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0XHRcdGN0eC5maWxsVGV4dChpICogMSwgMTUsIC1pICogcGl4ZWxzUGVyMTAwRnQgKyB5T2Zmc2V0ICsgNCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjdHguY2FudmFzLndpZHRoIC8gMiwgY3R4LmNhbnZhcy5oZWlnaHQgLyAyKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZSh6ZXJvV2lkdGggLyAyICsgemVyb1BhZGRpbmcsIDApO1xuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gMjtcblx0XHRcdFx0Y3R4LmZvbnQgPSAnMTJweCBBcmlhbCc7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0XHRjdHguZmlsbE9wYWNpdHkgPSAxO1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGN0eC5tb3ZlVG8obWlub3JUaWNrV2lkdGgsIDApO1xuXHRcdFx0XHRjdHgubGluZVRvKG1pbm9yVGlja1dpZHRoICogMiwgLTUpO1xuXHRcdFx0XHRjdHgubGluZVRvKG1pbm9yVGlja1dpZHRoICogMiwgLTEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhhbHRJbmRpY2F0b3JXaWR0aCwgLTEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhhbHRJbmRpY2F0b3JXaWR0aCwgMTApO1xuXHRcdFx0XHRjdHgubGluZVRvKG1pbm9yVGlja1dpZHRoICogMiwgMTApO1xuXHRcdFx0XHRjdHgubGluZVRvKG1pbm9yVGlja1dpZHRoICogMiwgNSk7XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG5cdFx0XHRcdGN0eC5maWxsVGV4dChNYXRoLnJvdW5kKGFsdGl0dWRlICogMTAwKSAvIDEwMCwgMTUsIDQuNSwgYWx0SW5kaWNhdG9ySGVpZ2h0KTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cdFx0XHRcblxuXHRcdFx0ZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdFx0XHRkcmF3SG9yaXpvbigpXG5cdFx0XHRcdGRyYXdaZXJvKClcblx0XHRcdFx0ZHJhd1JvbGwoKVxuXHRcdFx0XHRpZiAoc2hvd1NwZWVkKSB7XG5cdFx0XHRcdFx0ZHJhd1NwZWVkKClcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc2hvd0FsdGl0dWRlKSB7XG5cdFx0XHRcdFx0ZHJhd0FsdGl0dWRlKClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHRcdHRoaXMudXBkYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdbZmxpZ2h0cGFuZWxdIHVwZGF0ZScsIGRhdGEpXG5cdFx0XHRcdCQuZXh0ZW5kKHRoaXMucHJvcHMsIGRhdGEpXG5cdFx0XHRcdHNob3dBbHRpdHVkZSA9IHRoaXMucHJvcHMuc2hvd0FsdGl0dWRlXHRcdFx0XHRcblx0XHRcdFx0c2hvd1NwZWVkID0gdGhpcy5wcm9wcy5zaG93U3BlZWRcblx0XHRcdFx0cm9sbFJhZCA9IHRvUmFkKHRoaXMucHJvcHMucm9sbClcblx0XHRcdFx0cGl0Y2hSYWQgPSB0b1JhZCh0aGlzLnByb3BzLnBpdGNoKVx0XHRcdFx0XG5cdFx0XHRcdG9wdGlvbnMuc3BlZWQgPSB0aGlzLnByb3BzLnNwZWVkXG5cdFx0XHRcdG9wdGlvbnMuYWx0aXR1ZGUgPSB0aGlzLnByb3BzLmFsdGl0dWRlXG5cblx0XHRcdFx0cmVuZGVyKClcblx0XHRcdH1cblxuXHRcdFx0dGhpcy51cGRhdGUoKVxuXHRcdFx0XG5cdFx0fSxcblxuXHRcdCRpZmFjZTogJ3NldFJvbGwocm9sbCk7c2V0UGl0Y2gocGl0Y2gpO3NldFNwZWVkKHNwZWVkKTtzZXRBbHRpdHVkZShhbHRpdHVkZSknXG5cdH0pXG5cblxufSkoKTsiXX0=
