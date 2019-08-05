L.rotateImageLayer = function(url, bounds, options) {
    return new L.RotateImageLayer(url, bounds, options);
};
// A quick extension to allow image layer rotation.
L.RotateImageLayer = L.ImageOverlay.extend({
    options: {rotation: 0},

    _animateZoom: function(e){
        L.ImageOverlay.prototype._animateZoom.call(this, e);
        var img = this._image;
        img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
    },

    _reset: function(){
        L.ImageOverlay.prototype._reset.call(this);
        var img = this._image;
        img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
    },

    setRotation:function(rotation) {
        this.options.rotation = rotation
        if (this._map) {
            this._reset()
        }
        return this
    },

    setBounds:function(bounds) {
        //console.log('setBounds', bounds)
        const corner1 = L.latLng(bounds[0][0], bounds[0][1])
        const corner2 = L.latLng(bounds[1][0], bounds[1][1])
        bounds = L.latLngBounds(corner1, corner2);        
        L.ImageOverlay.prototype.setBounds.call(this, bounds);
        return this
    }    
});
