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
			const {showAltitude, showSpeed} = this.props;
			//console.log('options', options)

			var canvas = $('<canvas>').attr('width', 640).attr('height', 360).appendTo(elt)


			var ctx = canvas.get(0).getContext('2d')
			var pixelsPerDeg = ctx.canvas.height / (options.frontCameraFovY / 2)	 

			var rollRad = toRad(this.props.roll)
			var pitchRad = toRad(this.props.pitch)

			//console.log(`width: ${ctx.canvas.width}, height: ${ctx.canvas.height}`)


			options.speed = this.props.speed
			options.altitude = this.props.altitude

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



			render()

			this.setRoll = function(value) {
				rollRad = toRad(value)
				render()				
			}


			this.setSpeed = function(value) {
				options.speed = value
				render()					
			},
			
			this.setPitch = function(value) {
				pitchRad = toRad(value)
				render()				
			},

			this.setAltitude = function(value) {
				options.altitude = value
				render()				
			}

			
		},

		$iface: 'setRoll(roll);setPitch(pitch);setSpeed(speed);setAltitude(altitude)'
	})


})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsaWdodHBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJyYWluanMtZmxpZ2h0cGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gdG9SYWQodmFsKSB7XG5cdFx0cmV0dXJuIHZhbCpNYXRoLlBJLzE4MFxuXHR9XHRcblxuXHRjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdHNreUNvbG9yOiAnIzMzZicsXG5cdFx0XHRlYXJ0aENvbG9yOiAnIzk5MicsXG5cdFx0XHRmcm9udENhbWVyYUZvdlk6IDIwMCxcblx0XHRcdG1ham9yV2lkdGg6IDEwMCxcblx0XHRcdG1pbm9yV2lkdGg6IDYwLFxuXHRcdFx0emVyb1dpZHRoOiAyMDAsXG5cdFx0XHR6ZXJvR2FwOiAyMCxcblx0XHRcdHJhZGlhbExpbWl0OiA2MCxcblx0XHRcdHRpY2tSYWRpdXM6IDEwLFxuXHRcdFx0cmFkaWFsUmFkaXVzOiAxNzgsXG5cdFx0XHRzcGVlZEluZGljYXRvckhlaWdodDogMjUwLFxuXHRcdFx0c3BlZWRJbmRpY2F0b3JXaWR0aDogNjAsXG5cdFx0XHR6ZXJvUGFkZGluZzogMTAwLFxuXHRcdFx0c3BlZWRBbHRPcGFjaXR5OiAwLjIsXG5cdFx0XHRwaXhlbHNQZXIxMEttcGg6IDUwLFxuXHRcdFx0bWlub3JUaWNrc1BlcjEwS21waDogNSxcblx0XHRcdHNwZWVkV2FybmluZ1dpZHRoOiAxMCxcblxuXHRcdFx0eWVsbG93Qm91bmRhcnlTcGVlZDogMTAwLFxuXHRcdFx0cmVkQm91bmRhcnlTcGVlZDogMTMwLFxuXG5cdFx0XHRhbHRJbmRpY2F0b3JIZWlnaHQ6IDI1MCxcblx0XHRcdGFsdEluZGljYXRvcldpZHRoOiA1MCxcblx0XHRcdG1ham9yVGlja1dpZHRoOiAxMCxcblx0XHRcdG1pbm9yVGlja1dpZHRoOiA1LFxuXHRcdFx0cGl4ZWxzUGVyMTAwRnQ6IDUwLFxuXHRcdFx0bWlub3JUaWNrc1BlcjEwMEZ0OiA1XHRcdFx0XHRcblx0XHR9XG5cblxuXHQkJC5jb250cm9sLnJlZ2lzdGVyQ29udHJvbCgnYnJhaW5qcy5mbGlnaHRwYW5lbCcsICB7XG5cblx0XHRwcm9wczoge1xuXHRcdFx0cm9sbDogMCxcblx0XHRcdHBpdGNoOiAwLFxuXHRcdFx0c3BlZWQ6IDAsXG5cdFx0XHRhbHRpdHVkZTogMCxcblx0XHRcdG9wdGlvbnM6IHt9LFxuXHRcdFx0c2hvd0FsdGl0dWRlOiB0cnVlLFxuXHRcdFx0c2hvd1NwZWVkOiB0cnVlXHRcdFxuXHRcdH0sXG5cblxuXG5cblx0XHRpbml0OiBmdW5jdGlvbihlbHQpIHtcblxuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgdGhpcy5wcm9wcy5vcHRpb25zKVxuXHRcdFx0Y29uc3Qge3Nob3dBbHRpdHVkZSwgc2hvd1NwZWVkfSA9IHRoaXMucHJvcHM7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdvcHRpb25zJywgb3B0aW9ucylcblxuXHRcdFx0dmFyIGNhbnZhcyA9ICQoJzxjYW52YXM+JykuYXR0cignd2lkdGgnLCA2NDApLmF0dHIoJ2hlaWdodCcsIDM2MCkuYXBwZW5kVG8oZWx0KVxuXG5cblx0XHRcdHZhciBjdHggPSBjYW52YXMuZ2V0KDApLmdldENvbnRleHQoJzJkJylcblx0XHRcdHZhciBwaXhlbHNQZXJEZWcgPSBjdHguY2FudmFzLmhlaWdodCAvIChvcHRpb25zLmZyb250Q2FtZXJhRm92WSAvIDIpXHQgXG5cblx0XHRcdHZhciByb2xsUmFkID0gdG9SYWQodGhpcy5wcm9wcy5yb2xsKVxuXHRcdFx0dmFyIHBpdGNoUmFkID0gdG9SYWQodGhpcy5wcm9wcy5waXRjaClcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhgd2lkdGg6ICR7Y3R4LmNhbnZhcy53aWR0aH0sIGhlaWdodDogJHtjdHguY2FudmFzLmhlaWdodH1gKVxuXG5cblx0XHRcdG9wdGlvbnMuc3BlZWQgPSB0aGlzLnByb3BzLnNwZWVkXG5cdFx0XHRvcHRpb25zLmFsdGl0dWRlID0gdGhpcy5wcm9wcy5hbHRpdHVkZVxuXG5cdFx0XHRmdW5jdGlvbiBkcmF3SG9yaXpvbigpIHtcblxuXHRcdFx0XHR2YXIge3JhZGlhbFJhZGl1cywgbWFqb3JXaWR0aCwgbWlub3JXaWR0aCwgc2t5Q29sb3IsIGVhcnRoQ29sb3J9ID0gb3B0aW9uc1xuXG5cdFx0XHQgIGN0eC5zYXZlKCk7XG5cdFx0XHQgIGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHQgIGN0eC5yb3RhdGUoLXJvbGxSYWQpO1xuXHRcdFx0ICB2YXIgcGl0Y2hQaXhlbHMgPSBwaXRjaFJhZCAvIChNYXRoLlBJICogMikgKiAzNjAgKiBwaXhlbHNQZXJEZWc7XG5cdFx0XHQgIGN0eC50cmFuc2xhdGUoMCwgcGl0Y2hQaXhlbHMpO1xuXHRcdFx0ICBcblx0XHRcdCAgIGN0eC5maWxsU3R5bGUgPSBza3lDb2xvcjtcblx0XHRcdCAgIGN0eC5maWxsUmVjdCgtMTAwMDAsIC0xMDAwMCwgMjAwMDAsIDEwMDAwKTtcblx0XHRcdCAgIGN0eC5maWxsU3R5bGUgPSBlYXJ0aENvbG9yO1xuXHRcdFx0ICAgY3R4LmZpbGxSZWN0KC0xMDAwMCwgMCwgMjAwMDAsIDEwMDAwKTtcblx0XHRcdCAgXG5cdFx0XHQgIC8vIGhvcml6b25cblx0XHRcdCAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuXHRcdFx0ICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdCAgY3R4LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHQgIGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdCAgY3R4Lm1vdmVUbygtMTAwMDAsIDApO1xuXHRcdFx0ICBjdHgubGluZVRvKDIwMDAwLCAwKTtcblx0XHRcdCAgY3R4LnN0cm9rZSgpO1xuXG5cdFx0XHQgIGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdCAgY3R4LmFyYygwLCAtcGl0Y2hQaXhlbHMsIHJhZGlhbFJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcblx0XHRcdCAgY3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0ICBjdHguY2xpcCgpO1xuXG5cdFx0XHQgIGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdCAgZm9yICh2YXIgaSA9IC0xODsgaSA8PSAxODsgKytpKSB7XG5cdFx0XHQgICAgdmFyIHBpdGNoQW5nbGUgPSBpIC8gMiAqIDEwO1xuXHRcdFx0ICAgIGlmIChpICE9PSAwKSB7XG5cdFx0XHQgICAgICBpZiAoaSAlIDIgPT09IDApIHtcblx0XHRcdCAgICAgICAgY3R4Lm1vdmVUbygtbWFqb3JXaWR0aCAvIDIsIC1waXhlbHNQZXJEZWcgKiBwaXRjaEFuZ2xlKTtcblx0XHRcdCAgICAgICAgY3R4LmxpbmVUbygrbWFqb3JXaWR0aCAvIDIsIC1waXhlbHNQZXJEZWcgKiBwaXRjaEFuZ2xlKTtcblx0XHRcdCAgICAgICAgY3R4LmZpbGxUZXh0KHBpdGNoQW5nbGUsIC1tYWpvcldpZHRoIC8gMiAtIDIwLCAtcGl4ZWxzUGVyRGVnICogMTAgLyAyICogaSk7XG5cdFx0XHQgICAgICAgIGN0eC5maWxsVGV4dChwaXRjaEFuZ2xlLCBtYWpvcldpZHRoIC8gMiArIDEwLCAtcGl4ZWxzUGVyRGVnICogMTAgLyAyICogaSk7XG5cdFx0XHQgICAgICB9IGVsc2Uge1xuXHRcdFx0ICAgICAgICBjdHgubW92ZVRvKC1taW5vcldpZHRoIC8gMiwgLXBpeGVsc1BlckRlZyAqIHBpdGNoQW5nbGUpO1xuXHRcdFx0ICAgICAgICBjdHgubGluZVRvKCttaW5vcldpZHRoIC8gMiwgLXBpeGVsc1BlckRlZyAqIHBpdGNoQW5nbGUpO1xuXHRcdFx0ICAgICAgfVxuXHRcdFx0ICAgIH1cblx0XHRcdCAgfVxuXHRcdFx0ICBjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHQgIGN0eC5zdHJva2UoKTtcblx0XHRcdCAgY3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZHJhd1plcm8oKSB7XG5cblx0XHRcdFx0dmFyIHt6ZXJvV2lkdGgsIHplcm9HYXAsIHJhZGlhbFJhZGl1cywgcmFkaWFsTGltaXQsIHRpY2tSYWRpdXN9ID0gb3B0aW9uc1xuXG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICd5ZWxsb3cnO1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gMjtcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjdHgubW92ZVRvKC16ZXJvV2lkdGggLyAyLCAwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbygtemVyb0dhcCAvIDIsIDApO1xuXHRcdFx0XHRjdHgubW92ZVRvKCt6ZXJvV2lkdGggLyAyLCAwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbygremVyb0dhcCAvIDIsIDApO1xuXHRcdFx0XHRjdHgubW92ZVRvKC16ZXJvR2FwIC8gMiwgemVyb0dhcCAvIDIpO1xuXHRcdFx0XHRjdHgubGluZVRvKDAsIDApO1xuXHRcdFx0XHRjdHgubGluZVRvKCt6ZXJvR2FwIC8gMiwgemVyb0dhcCAvIDIpO1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdC8vIFRoZSByYWRpYWwgcm9sbCBpbmRpY2F0b3Jcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjdHguYXJjKDAsIDAsIHJhZGlhbFJhZGl1cywgLU1hdGguUEkgLyAyIC0gTWF0aC5QSSAqIHJhZGlhbExpbWl0IC8gMTgwLCAtTWF0aC5QSSAvIDIgKyBNYXRoLlBJICogcmFkaWFsTGltaXQgLyAxODAsIGZhbHNlKTtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gLTQ7IGkgPD0gNDsgKytpKSB7XG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbygocmFkaWFsUmFkaXVzIC0gdGlja1JhZGl1cykgKiBNYXRoLmNvcygtTWF0aC5QSSAvIDIgKyBpICogMTUgLyAxODAgKiBNYXRoLlBJKSwgKHJhZGlhbFJhZGl1cyAtIHRpY2tSYWRpdXMpICogTWF0aC5zaW4oLU1hdGguUEkgLyAyICsgaSAqIDE1IC8gMTgwICogTWF0aC5QSSkpO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8ocmFkaWFsUmFkaXVzICogTWF0aC5jb3MoLU1hdGguUEkgLyAyICsgaSAqIDE1IC8gMTgwICogTWF0aC5QSSksIHJhZGlhbFJhZGl1cyAqIE1hdGguc2luKC1NYXRoLlBJIC8gMiArIGkgKiAxNSAvIDE4MCAqIE1hdGguUEkpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHR9XHRcblxuXHRcdFx0ZnVuY3Rpb24gZHJhd1JvbGwoKSB7XG5cblx0XHRcdFx0dmFyIHtyYWRpYWxSYWRpdXN9ID0gb3B0aW9uc1xuXG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdGN0eC5yb3RhdGUoLXJvbGxSYWQpO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0Y3R4Lm1vdmVUbygwLCAtcmFkaWFsUmFkaXVzKTtcblx0XHRcdFx0Y3R4LmxpbmVUbygtNSwgLXJhZGlhbFJhZGl1cyArIDEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbygrNSwgLXJhZGlhbFJhZGl1cyArIDEwKTtcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHR2YXIgcmVhZGFibGVSb2xsQW5nbGUgPSBNYXRoLnJvdW5kKHJvbGxSYWQgLyBNYXRoLlBJIC8gMiAqIDM2MCkgJSAzNjA7XG5cdFx0XHRcdGlmIChyZWFkYWJsZVJvbGxBbmdsZSA+IDE4MCkge1xuXHRcdFx0XHRcdHJlYWRhYmxlUm9sbEFuZ2xlID0gcmVhZGFibGVSb2xsQW5nbGUgLSAzNjA7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3R4LmZpbGxSZWN0KC0yMCwgLXJhZGlhbFJhZGl1cyArIDksIDQwLCAxNik7XG5cdFx0XHRcdGN0eC5mb250ID0gJzEycHggQXJpYWwnO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcblx0XHRcdFx0Y3R4LmZpbGxUZXh0KHJlYWRhYmxlUm9sbEFuZ2xlLCAtNywgLXJhZGlhbFJhZGl1cyArIDIyKTtcblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cdFx0XHRcblxuXHRcdFx0ZnVuY3Rpb24gZHJhd1NwZWVkKCkge1xuXG5cdFx0XHRcdHZhciB7XG5cdFx0XHRcdFx0c3BlZWRJbmRpY2F0b3JIZWlnaHQsXG5cdFx0XHRcdFx0c3BlZWRJbmRpY2F0b3JXaWR0aCxcblx0XHRcdFx0XHRzcGVlZFdhcm5pbmdXaWR0aCxcblx0XHRcdFx0XHR6ZXJvUGFkZGluZyxcblx0XHRcdFx0XHR6ZXJvV2lkdGgsXG5cdFx0XHRcdFx0c3BlZWRBbHRPcGFjaXR5LFxuXHRcdFx0XHRcdHllbGxvd0JvdW5kYXJ5U3BlZWQsXG5cdFx0XHRcdFx0cmVkQm91bmRhcnlTcGVlZCxcblx0XHRcdFx0XHRwaXhlbHNQZXIxMEttcGgsXG5cdFx0XHRcdFx0bWFqb3JUaWNrV2lkdGgsXG5cdFx0XHRcdFx0bWlub3JUaWNrV2lkdGgsXG5cdFx0XHRcdFx0bWlub3JUaWNrc1BlcjEwS21waCxcblx0XHRcdFx0XHRhbHRJbmRpY2F0b3JIZWlnaHQsXG5cdFx0XHRcdFx0c3BlZWRcblx0XHRcdFx0fSAgPSBvcHRpb25zXG5cblxuXHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRjdHgudHJhbnNsYXRlKGN0eC5jYW52YXMud2lkdGggLyAyLCBjdHguY2FudmFzLmhlaWdodCAvIDIpO1xuXHRcdFx0XHRjdHgudHJhbnNsYXRlKC16ZXJvV2lkdGggLyAyIC0gemVyb1BhZGRpbmcgLSBzcGVlZEluZGljYXRvcldpZHRoLCAwKTtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBzcGVlZEFsdE9wYWNpdHkgKyAnKSc7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjdHguc3Ryb2tlUmVjdCgwLCAtc3BlZWRJbmRpY2F0b3JIZWlnaHQgLyAyLCBzcGVlZEluZGljYXRvcldpZHRoLCBzcGVlZEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAtc3BlZWRJbmRpY2F0b3JIZWlnaHQgLyAyLCBzcGVlZEluZGljYXRvcldpZHRoLCBzcGVlZEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoLXplcm9XaWR0aCAvIDIgLSB6ZXJvUGFkZGluZyAtIHNwZWVkSW5kaWNhdG9yV2lkdGgsIDApO1xuXHRcdFx0XHRjdHgucmVjdCgwLCAtc3BlZWRJbmRpY2F0b3JIZWlnaHQgLyAyLCBzcGVlZEluZGljYXRvcldpZHRoLCBzcGVlZEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5jbGlwKCk7XG5cdFx0XHRcdHZhciB5ZWxsb3dCb3VuZGFyeVkgPSAtKC1zcGVlZCArIHllbGxvd0JvdW5kYXJ5U3BlZWQpIC8gMTAgKiBwaXhlbHNQZXIxMEttcGg7XG5cdFx0XHRcdHZhciByZWRCb3VuZGFyeVkgPSAtKC1zcGVlZCArIHJlZEJvdW5kYXJ5U3BlZWQpIC8gMTAgKiBwaXhlbHNQZXIxMEttcGg7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAneWVsbG93Jztcblx0XHRcdFx0Y3R4LmZpbGxSZWN0KHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCwgeWVsbG93Qm91bmRhcnlZLCBzcGVlZFdhcm5pbmdXaWR0aCwgcmVkQm91bmRhcnlZIC0geWVsbG93Qm91bmRhcnlZKTtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuXHRcdFx0XHRjdHguZmlsbFJlY3Qoc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoLCByZWRCb3VuZGFyeVksIHNwZWVkV2FybmluZ1dpZHRoLCAtc3BlZWRJbmRpY2F0b3JIZWlnaHQgLyAyIC0gcmVkQm91bmRhcnlZKTtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XG5cdFx0XHRcdGN0eC5maWxsUmVjdChzcGVlZEluZGljYXRvcldpZHRoIC0gc3BlZWRXYXJuaW5nV2lkdGgsIHllbGxvd0JvdW5kYXJ5WSwgc3BlZWRXYXJuaW5nV2lkdGgsICtzcGVlZEluZGljYXRvckhlaWdodCAvIDIgLSB5ZWxsb3dCb3VuZGFyeVkpO1xuXHRcdFx0XHR2YXIgeU9mZnNldCA9IHNwZWVkIC8gMTAgKiBwaXhlbHNQZXIxMEttcGg7XG5cdFx0XHRcdC8vIFRoZSB1bmNsaXBwZWQgdGlja3MgdG8gYmUgcmVuZGVyZWQuXG5cdFx0XHRcdC8vIFdlIHJlbmRlciAxMDBrbXBoIGVpdGhlciBzaWRlIG9mIHRoZSBjZW50ZXIgdG8gYmUgc2FmZVxuXHRcdFx0XHR2YXIgZnJvbSA9IC1NYXRoLmZsb29yKHNwZWVkIC8gMTApIC0gMTA7XG5cdFx0XHRcdHZhciB0byA9IE1hdGguY2VpbChzcGVlZCAvIDEwKSArIDEwO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gZnJvbTsgaSA8IHRvOyArK2kpIHtcblx0XHRcdFx0XHRjdHgubW92ZVRvKHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCwgLWkgKiBwaXhlbHNQZXIxMEttcGggKyB5T2Zmc2V0KTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCAtIG1ham9yVGlja1dpZHRoLCAtaSAqIHBpeGVsc1BlcjEwS21waCArIHlPZmZzZXQpO1xuXHRcdFx0XHRcdGZvciAoaiA9IDE7IGogPCBtaW5vclRpY2tzUGVyMTBLbXBoOyArK2opIHtcblx0XHRcdFx0XHQgIGN0eC5tb3ZlVG8oc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoLCAtaSAqIHBpeGVsc1BlcjEwS21waCAtIGogKiBwaXhlbHNQZXIxMEttcGggLyBtaW5vclRpY2tzUGVyMTBLbXBoICsgeU9mZnNldCk7XG5cdFx0XHRcdFx0ICBjdHgubGluZVRvKHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCAtIG1pbm9yVGlja1dpZHRoLCAtaSAqIHBpeGVsc1BlcjEwS21waCAtIGogKiBwaXhlbHNQZXIxMEttcGggLyBtaW5vclRpY2tzUGVyMTBLbXBoICsgeU9mZnNldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN0eC5mb250ID0gJzEycHggQXJpYWwnO1xuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0XHRcdGN0eC5maWxsVGV4dChpICogMTAsIDIwLCAtaSAqIHBpeGVsc1BlcjEwS21waCArIHlPZmZzZXQgKyA0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0XHRjdHgubGluZVdpZHRoID0gMjtcblx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGN0eC5tb3ZlVG8oc3BlZWRJbmRpY2F0b3JXaWR0aCAtIHNwZWVkV2FybmluZ1dpZHRoIC0gbWlub3JUaWNrV2lkdGgsIDApO1xuXHRcdFx0XHRjdHgubGluZVRvKHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCAtIG1pbm9yVGlja1dpZHRoICogMiwgLTUpO1xuXHRcdFx0XHRjdHgubGluZVRvKHNwZWVkSW5kaWNhdG9yV2lkdGggLSBzcGVlZFdhcm5pbmdXaWR0aCAtIG1pbm9yVGlja1dpZHRoICogMiwgLTEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbygwLCAtMTApO1xuXHRcdFx0XHRjdHgubGluZVRvKDAsIDEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhzcGVlZEluZGljYXRvcldpZHRoIC0gc3BlZWRXYXJuaW5nV2lkdGggLSBtaW5vclRpY2tXaWR0aCAqIDIsIDEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhzcGVlZEluZGljYXRvcldpZHRoIC0gc3BlZWRXYXJuaW5nV2lkdGggLSBtaW5vclRpY2tXaWR0aCAqIDIsIDUpO1xuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuXHRcdFx0XHRjdHguZmlsbFRleHQoTWF0aC5yb3VuZChzcGVlZCAqIDEwMCkgLyAxMDAsIDE1LCA0LjUsIGFsdEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHR9XHRcdFxuXG5cblx0XHRcdGZ1bmN0aW9uIGRyYXdBbHRpdHVkZSgpIHtcblxuXHRcdFx0XHR2YXIge1xuXHRcdFx0XHRcdHplcm9XaWR0aCxcblx0XHRcdFx0XHR6ZXJvUGFkZGluZyxcblx0XHRcdFx0XHRzcGVlZEFsdE9wYWNpdHksXG5cdFx0XHRcdFx0YWx0SW5kaWNhdG9ySGVpZ2h0LFxuXHRcdFx0XHRcdGFsdEluZGljYXRvcldpZHRoLFxuXHRcdFx0XHRcdHBpeGVsc1BlcjEwMEZ0LFxuXHRcdFx0XHRcdG1pbm9yVGlja1dpZHRoLFxuXHRcdFx0XHRcdG1ham9yVGlja1dpZHRoLFxuXHRcdFx0XHRcdG1pbm9yVGlja3NQZXIxMDBGdCxcblx0XHRcdFx0XHRhbHRpdHVkZVxuXHRcdFx0XHR9ID0gb3B0aW9uc1xuXG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoemVyb1dpZHRoIC8gMiArIHplcm9QYWRkaW5nLCAwKTtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCcgKyBzcGVlZEFsdE9wYWNpdHkgKyAnKSc7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgLWFsdEluZGljYXRvckhlaWdodCAvIDIsIGFsdEluZGljYXRvcldpZHRoLCBhbHRJbmRpY2F0b3JIZWlnaHQpO1xuXHRcdFx0XHRjdHguc3Ryb2tlUmVjdCgwLCAtYWx0SW5kaWNhdG9ySGVpZ2h0IC8gMiwgYWx0SW5kaWNhdG9yV2lkdGgsIGFsdEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoemVyb1dpZHRoIC8gMiArIHplcm9QYWRkaW5nLCAwKTtcblx0XHRcdFx0Y3R4LnJlY3QoMCwgLWFsdEluZGljYXRvckhlaWdodCAvIDIsIGFsdEluZGljYXRvcldpZHRoLCBhbHRJbmRpY2F0b3JIZWlnaHQpO1xuXHRcdFx0XHRjdHguY2xpcCgpO1xuXHRcdFx0XHR2YXIgeU9mZnNldCA9IGFsdGl0dWRlIC8gMSAqIHBpeGVsc1BlcjEwMEZ0O1xuXHRcdFx0XHQvLyBUaGUgdW5jbGlwcGVkIHRpY2tzIHRvIGJlIHJlbmRlcmVkLiBXZSByZW5kZXIgNTAwZnQgZWl0aGVyIHNpZGUgb2Zcblx0XHRcdFx0Ly8gdGhlIGNlbnRlciB0byBiZSBzYWZlXG5cdFx0XHRcdHZhciBmcm9tID0gTWF0aC5mbG9vcihhbHRpdHVkZSAvIDEpIC0gNTtcblx0XHRcdFx0dmFyIHRvID0gTWF0aC5jZWlsKGFsdGl0dWRlIC8gMSkgKyA1O1xuXHRcdFx0XHRmb3IgKHZhciBpID0gZnJvbTsgaSA8IHRvOyArK2kpIHtcblx0XHRcdFx0XHRjdHgubW92ZVRvKDAsIC1pICogcGl4ZWxzUGVyMTAwRnQgKyB5T2Zmc2V0KTtcblx0XHRcdFx0XHRjdHgubGluZVRvKG1ham9yVGlja1dpZHRoLCAtaSAqIHBpeGVsc1BlcjEwMEZ0ICsgeU9mZnNldCk7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDE7IGogPCBtaW5vclRpY2tzUGVyMTAwRnQ7ICsraikge1xuXHRcdFx0XHRcdFx0ICBjdHgubW92ZVRvKDAsIC1pICogcGl4ZWxzUGVyMTAwRnQgLSBqICogcGl4ZWxzUGVyMTAwRnQgLyBtaW5vclRpY2tzUGVyMTAwRnQgKyB5T2Zmc2V0KTtcblx0XHRcdFx0XHRcdCAgY3R4LmxpbmVUbyhtaW5vclRpY2tXaWR0aCwgLWkgKiBwaXhlbHNQZXIxMDBGdCAtIGogKiBwaXhlbHNQZXIxMDBGdCAvIG1pbm9yVGlja3NQZXIxMDBGdCArIHlPZmZzZXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjdHguZm9udCA9ICcxMnB4IEFyaWFsJztcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdFx0XHRjdHguZmlsbFRleHQoaSAqIDEsIDE1LCAtaSAqIHBpeGVsc1BlcjEwMEZ0ICsgeU9mZnNldCArIDQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRcdGN0eC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY3R4LmNhbnZhcy53aWR0aCAvIDIsIGN0eC5jYW52YXMuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoemVyb1dpZHRoIC8gMiArIHplcm9QYWRkaW5nLCAwKTtcblx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcblx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRcdGN0eC5mb250ID0gJzEycHggQXJpYWwnO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdFx0Y3R4LmZpbGxPcGFjaXR5ID0gMTtcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjdHgubW92ZVRvKG1pbm9yVGlja1dpZHRoLCAwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhtaW5vclRpY2tXaWR0aCAqIDIsIC01KTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhtaW5vclRpY2tXaWR0aCAqIDIsIC0xMCk7XG5cdFx0XHRcdGN0eC5saW5lVG8oYWx0SW5kaWNhdG9yV2lkdGgsIC0xMCk7XG5cdFx0XHRcdGN0eC5saW5lVG8oYWx0SW5kaWNhdG9yV2lkdGgsIDEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhtaW5vclRpY2tXaWR0aCAqIDIsIDEwKTtcblx0XHRcdFx0Y3R4LmxpbmVUbyhtaW5vclRpY2tXaWR0aCAqIDIsIDUpO1xuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuXHRcdFx0XHRjdHguZmlsbFRleHQoTWF0aC5yb3VuZChhbHRpdHVkZSAqIDEwMCkgLyAxMDAsIDE1LCA0LjUsIGFsdEluZGljYXRvckhlaWdodCk7XG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHR9XHRcdFx0XG5cblx0XHRcdGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHRcdFx0ZHJhd0hvcml6b24oKVxuXHRcdFx0XHRkcmF3WmVybygpXG5cdFx0XHRcdGRyYXdSb2xsKClcblx0XHRcdFx0aWYgKHNob3dTcGVlZCkge1xuXHRcdFx0XHRcdGRyYXdTcGVlZCgpXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNob3dBbHRpdHVkZSkge1xuXHRcdFx0XHRcdGRyYXdBbHRpdHVkZSgpXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cblx0XHRcdHJlbmRlcigpXG5cblx0XHRcdHRoaXMuc2V0Um9sbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHJvbGxSYWQgPSB0b1JhZCh2YWx1ZSlcblx0XHRcdFx0cmVuZGVyKClcdFx0XHRcdFxuXHRcdFx0fVxuXG5cblx0XHRcdHRoaXMuc2V0U3BlZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRvcHRpb25zLnNwZWVkID0gdmFsdWVcblx0XHRcdFx0cmVuZGVyKClcdFx0XHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0XG5cdFx0XHR0aGlzLnNldFBpdGNoID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cGl0Y2hSYWQgPSB0b1JhZCh2YWx1ZSlcblx0XHRcdFx0cmVuZGVyKClcdFx0XHRcdFxuXHRcdFx0fSxcblxuXHRcdFx0dGhpcy5zZXRBbHRpdHVkZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdG9wdGlvbnMuYWx0aXR1ZGUgPSB2YWx1ZVxuXHRcdFx0XHRyZW5kZXIoKVx0XHRcdFx0XG5cdFx0XHR9XG5cblx0XHRcdFxuXHRcdH0sXG5cblx0XHQkaWZhY2U6ICdzZXRSb2xsKHJvbGwpO3NldFBpdGNoKHBpdGNoKTtzZXRTcGVlZChzcGVlZCk7c2V0QWx0aXR1ZGUoYWx0aXR1ZGUpJ1xuXHR9KVxuXG5cbn0pKCk7Il19
