/*! jquery.knob v0.0.3
 * 
 * Copyright (c) 2016 @literallylara
 * Under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(factory)
{
	if(typeof define == "function" && define.amd)
	{
		define(["jquery"],factory);
	}
	else if(typeof module !== "undefined" && module.exports)
	{
		module.exports = factory;
	}
	else
	{
		factory(window.jQuery || window.$);
	}
}(function($)
{
	"use strict";
	
	$.widget("custom.knob", {
	
		options: {
			bgColor: "#000",
			fgColor: "#fff",

			type: "vol",
			tooltip: true,
			turnWith: null,

			arc:    360,
			steps:  100,
			offset:   0,
			min: null,
			max: null,

			range: "auto",
			invertRange: false,
			round: true,
			fineTuneFactor: 10,

			value: 0,
			resetValue: 0,
			classPrefix: "knob"
		},

		_$svg:     null,
		_$stroke:  null,
		_$tooltip: null,

		_valueNormalized: null,
		_grabValue:  null,
		_grabOffset: null,

		_rangeFine:  null,
		_shiftKey:   null,
		_pageY:      null,

		_create: function() {
			
			var o = this.options

			// parse options
			Object.keys(o).forEach(k => {
				var d = this.element.attr("data-"+k);
				o[k] = d !== undefined ? d : o[k]
			})

			o.min = +o.min || (o.type == "vol" ?   0 : -100)
			o.max = +o.max || (o.type == "vol" ? 100 :  100)
			o.vol = o.type == "vol"

			// prepare svg
			this._$svg = $(`
			<svg class="${o.classPrefix}-svg" viewBox="0 0 2 2">
				<circle class="${o.classPrefix}-stroke" cx="1" cy="1" r="1" clip-path="url(#knob-clip${this.uuid})" />
				<clipPath id="knob-clip${this.uuid}"><circle cx="1" cy="1" r="1" /></clipPath>
			</svg>`).appendTo(this.element)

			// style knob
			this._$stroke = this._$svg.find("circle:eq(0)").css({

				fill: o.bgColor,
				stroke: o.fgColor,

				strokeWidth: "20%",
				transformOrigin: "50% 50%"

			})

			this._$knob = $(`<div class="${o.classPrefix}-knob"></div>`).css({

				position: "absolute",
				top: "50%",
				left: "50%",
				zIndex: 0,

				height: "70%",
				width: "70%",
				transform: "translate(-50%,-50%)",

				backgroundColor: o.fgColor,
				borderRadius: "100%",
				overflow: "hidden"

			}).appendTo(this.element)

			this._$pointerContainer = $(`<div class="${o.classPrefix}-pointer-container"></div>`).css({

				position: "absolute",
				top: "0px",
				left: "0px",

				width: "100%",
				height: "100%",

				transformOrigin: "50% 50%",
				zIndex: 1

			}).appendTo(this._$knob)

			// style pointer
			this._$pointer = $(`<span class="${o.classPrefix}-pointer"></span>`).css({

				position: "absolute",
				top: "7.5%",
				left: "50%",

				height: "15%",
				width: "7%",
				
				transform: "translate(-50%,0%)",
				backgroundColor: o.bgColor,
				borderRadius: "2em"

			}).appendTo(this._$pointerContainer)

			// style tooltip
			this._$tooltip = $(`<span class="${o.classPrefix}-tooltip"></span>`).css({

				position: "absolute",
				display: "none",
				zIndex: 999,

				color: "#fff",
				fontFamily: "monospace",

				padding: ".25em .5em",
				borderRadius: "3px",
				transform: "translate(-50%,-50%)",
				pointerEvents: "none",
				backgroundColor: "rgba(0,0,0,.5)"

			}).appendTo(this.element)

			// calculate range
			o.range = o.range == "auto" ? this.element.outerHeight()/2 : o.range
			this._rangeFine = o.range * o.fineTuneFactor


			// set initial value
			this._setValue(this._normalizeValue(o.value))

			this.element.css("position", "relative")
			this.element.on("mousedown.knob", this._grab.bind(this))
			this.element.on("dblclick.knob", this._reset.bind(this))
		},

		_clamp: function(v, min, max)
		{
			return Math.min(Math.max(v,min),max)
		},

		_setValue: function(v, triggerEvent = true)
		{
			var o = this.options


			var vol = o.type == "vol"
			var val = this._clamp(v,vol ? 0 : -1,1)
			var arc = o.arc/180*Math.PI/2
			var off = o.offset - (vol ? o.arc/2 : 0)
			var ang = (vol ? arc*val*2 : arc*val)

			this._$stroke.css({
				strokeDasharray: `${ Math.abs(ang) } ${ Math.PI*2 }`,
				transform: `rotate(${ 90 + off }deg) scale(-1,${ val > 0 || vol ? -1 : 1 })`
			})

			this._$pointerContainer.css({ transform: `rotate(${ ang/Math.PI*180 + off }deg)` })
			o.turnWith && $(o.turnWith).css({ transform: `rotate(${ ang/Math.PI*180 + off }deg)` })

			this._valueNormalized = val
			this._value = o.min + (o.max-o.min) * this._clamp(vol?v:(v+1)/2,0,1)

			o.round && (this._value = Math.round(this._value))

			if (triggerEvent) {
				this.element.trigger("turn", [this._value, this._valueNormalized])
			}
		},

		_grab: function(e)
		{
			this._grabValue = this._valueNormalized
			this._grabOffset = e.pageY
			this.element.trigger("grab", [this._value, this._valueNormalized])

			$(document).on("mouseup.knob", this._release.bind(this))
			$(document).on("mousemove.knob", this._turn.bind(this))
			$(document).on("keyup.knob", this._toggleFineTuning.bind(this))
			$(document).on("keydown.knob", this._toggleFineTuning.bind(this))

			this.element.addClass("grab")
			this.options.tooltip && this._updateTooltip(e)
		},

		_toggleFineTuning: function(e)
		{
			if (e.keyCode && 16 && this._shiftKey != e.shiftKey)
			{
				this._grabOffset = this._pageY
				this._grabValue = this._valueNormalized
			}

			this._shiftKey = e.shiftKey
		},

		_turn: function(e)
		{
			e.preventDefault()

			var range = e.shiftKey ? this._rangeFine : this.options.range
			var val = this._grabValue + (this._grabOffset-e.pageY)/range * (this.options.invertRange ? -1 : 1)
			
			this._setValue(Math.floor(val*this.options.steps)/this.options.steps)
			this._pageY = e.pageY

			this.options.tooltip && this._updateTooltip(e)
		},

		_release: function(e)
		{
			$(document).off("mouseup.knob mousemove.knob keyup.knob keydown.knob")

			this.element.trigger("release", [this._value, this._valueNormalized])
			this.element.removeClass("grab")
			
			this.options.tooltip && this._$tooltip.hide()
		},

		_updateTooltip: function(e)
		{
			var follow = this.options.tooltip == "follow"
			
			this._$tooltip.css({
				top:  follow ? e.pageY - this.element.offset().top : "50%",
				left: follow ? e.pageX - this.element.offset().left + 40 : "50%"
			}).text(this._value).show()
		},

		_reset: function(e)
		{
			this._setValue(this._normalizeValue(this.options.resetValue))
			this.element.trigger("reset", [this._value, this._valueNormalized])
		},

		_destroy: function(e)
		{
			this.element.off("mousedown.knob")
			this.element.removeClass(this.options.classPrefix+this.uuid)

			this.element.find("." + this.options.classPrefix + "-style").remove()
			this.element.find("." + this.options.classPrefix + "-svg").remove()
			this.element.find("." + this.options.classPrefix + "-knob").remove()
			this.element.find("." + this.options.classPrefix + "-tooltip").remove()
		},

		_normalizeValue: function(v)
		{
			var o = this.options


			v = this._clamp(v,o.min,o.max)
			v = (v-o.min)/(o.max-o.min)
			v = o.vol ? v : (v-.5)*2

			return v
		},

		value: function(v)
		{
			if (typeof +v == "number")
			{
				this._setValue(this._normalizeValue(v), false)
			}
			else
			{
				return this._value
			}
		}
	})
}));

