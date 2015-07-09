/* Plax version 1.4.1 */

/*
  Copyright (c) 2011 Cameron McEfee

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function ($) {

  var maxfps             = 25,
      delay              = 1 / maxfps * 1000,
      lastRender         = new Date().getTime(),
      layers             = [],
      plaxActivityTarget = {},
      motionDegrees      = 30,
      motionMax          = 1,
      motionMin          = -1,
      motionStartX       = null,
      motionStartY       = null,
      ignoreMoveable     = false,
      options            = null;

  var defaults = {
    useTransform : true
  };

  // Public Methods
  $.fn.plaxify = function (params){
    options = $.extend({}, defaults, params);
    options.useTransform = (options.useTransform ? supports3dTransform() : false);

    return this.each(function () {

      var layerExistsAt = -1;
      var layer         = {
        "xRange": $(this).data('xrange') || 0,
        "yRange": $(this).data('yrange') || 0,
        "zRange": $(this).data('zrange') || 0,
        "invert": $(this).data('invert') || false,
        "background": $(this).data('background') || false
      };

      for (var i=0;i<layers.length;i++){
        if (this === layers[i].obj.get(0)){
          layerExistsAt = i;
        }
      }

      for (var param in params) {
        if (layer[param] == 0) {
          layer[param] = params[param];
        }
      }

      layer.inversionFactor = (layer.invert ? -1 : 1); // inversion factor for calculations

      // Add an object to the list of things to parallax
      layer.obj    = $(this);
      if(layer.background) {
        // animate using the element's background
        pos = (layer.obj.css('background-position') || "0px 0px").split(/ /);
        if(pos.length != 2) {
          return;
        }
        x = pos[0].match(/^((-?\d+)\s*px|0+\s*%|left)$/);
        y = pos[1].match(/^((-?\d+)\s*px|0+\s*%|top)$/);
        if(!x || !y) {
          // no can-doesville, babydoll, we need pixels or top/left as initial values (it mightbe possible to construct a temporary image from the background-image property and get the dimensions and run some numbers, but that'll almost definitely be slow)
          return;
        }
        layer.originX = layer.startX = x[2] || 0;
        layer.originY = layer.startY = y[2] || 0;
        layer.transformOriginX = layer.transformStartX = 0;
        layer.transformOriginY = layer.transformStartY = 0;
        layer.transformOriginZ = layer.transformStartZ = 0;

      } else {

        // Figure out where the element is positioned, then reposition it from the top/left, same for transform if using translate3d
        var position           = layer.obj.position(),
            transformTranslate = get3dTranslation(layer.obj);

        layer.obj.css({
          'transform' : transformTranslate.join() + 'px',
          'top'   : position.top,
          'left'  : position.left,
          'right' :'',
          'bottom':''
        });
        layer.originX = layer.startX = position.left;
        layer.originY = layer.startY = position.top;
        layer.transformOriginX = layer.transformStartX = transformTranslate[0];
        layer.transformOriginY = layer.transformStartY = transformTranslate[1];
        layer.transformOriginZ = layer.transformStartZ = transformTranslate[2];
      }

      layer.startX -= layer.inversionFactor * Math.floor(layer.xRange/2);
      layer.startY -= layer.inversionFactor * Math.floor(layer.yRange/2);

      layer.transformStartX -= layer.inversionFactor * Math.floor(layer.xRange/2);
      layer.transformStartY -= layer.inversionFactor * Math.floor(layer.yRange/2);
      layer.transformStartZ -= layer.inversionFactor * Math.floor(layer.zRange/2);

      if(layerExistsAt >= 0){
        layers.splice(layerExistsAt,1,layer);
      } else {
        layers.push(layer);
      }

    });
  };

  // Get the translate position of the element
  //
  // return 3 element array for translate3d
  function get3dTranslation(obj) {
    var translate = [0,0,0],
        matrix    = obj.css("-webkit-transform") ||
                    obj.css("-moz-transform")    ||
                    obj.css("-ms-transform")     ||
                    obj.css("-o-transform")      ||
                    obj.css("transform");

    if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var x = 0,
          y = 0,
          z = 0;
      if(values.length == 16){
        // 3d matrix
        x = (parseFloat(values[values.length - 4]));
        y = (parseFloat(values[values.length - 3]));
        z = (parseFloat(values[values.length - 2]));
      }else{
        // z is not transformed as is not a 3d matrix
        x = (parseFloat(values[values.length - 2]));
        y = (parseFloat(values[values.length - 1]));
        z = 0;
      }
      translate = [x,y,z];
    }
    return translate;
  }

  // Check if element is in viewport area
  //
  // Returns boolean
  function inViewport(element) {
    if (element.offsetWidth === 0 || element.offsetHeight === 0) return false;

	var height = document.documentElement.clientHeight,
      rects  = element.getClientRects();

	for (var i = 0, l = rects.length; i < l; i++) {

    var r           = rects[i],
        in_viewport = r.top > 0 ? r.top <= height : (r.bottom > 0 && r.bottom <= height);

    if (in_viewport) return true;
	}
	return false;
  }

  // Check support for 3dTransform
  //
  // Returns boolean
  function supports3dTransform() {
    var el = document.createElement('p'),
        has3d,
        transforms = {
          'webkitTransform':'-webkit-transform',
          'OTransform':'-o-transform',
          'msTransform':'-ms-transform',
          'MozTransform':'-moz-transform',
          'transform':'transform'
        };

    document.body.insertBefore(el, null);

    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = "translate3d(1px,1px,1px)";
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }

    document.body.removeChild(el);
    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

  // Determine if the device has an accelerometer
  //
  // returns true if the browser has window.DeviceMotionEvent (mobile)
  function moveable(){
    return (ignoreMoveable===true) ? false : window.DeviceOrientationEvent !== undefined;
  }

  // The values pulled from the gyroscope of a motion device.
  //
  // Returns an object literal with x and y as options.
  function valuesFromMotion(e) {
    x = e.gamma;
    y = e.beta;

    // Swap x and y in Landscape orientation
    if (Math.abs(window.orientation) === 90) {
      var a = x;
      x = y;
      y = a;
    }

    // Invert x and y in upsidedown orientations
    if (window.orientation < 0) {
      x = -x;
      y = -y;
    }

    motionStartX = (motionStartX === null) ? x : motionStartX;
    motionStartY = (motionStartY === null) ? y : motionStartY;

    return {
      x: x - motionStartX,
      y: y - motionStartY
    };
  }

  // Move the elements in the `layers` array within their ranges,
  // based on mouse or motion input
  //
  // Parameters
  //
  //  e - mousemove or devicemotion event
  //
  // returns nothing
  function plaxifier(e) {
    if (new Date().getTime() < lastRender + delay) return;
      lastRender = new Date().getTime();

    var leftOffset = (plaxActivityTarget.offset() != null) ? plaxActivityTarget.offset().left : 0,
        topOffset  = (plaxActivityTarget.offset() != null) ? plaxActivityTarget.offset().top : 0,
        x          = e.pageX-leftOffset,
        y          = e.pageY-topOffset;

    if (!inViewport(layers[0].obj[0].parentNode)) return;

    if(moveable()){
      if(e.gamma === undefined){
        ignoreMoveable = true;
        return;
      }
      values = valuesFromMotion(e);

      // Admittedly fuzzy measurements
      x = values.x / motionDegrees;
      y = values.y / motionDegrees;
      // Ensure not outside of expected range, -1 to 1
      x = x < motionMin ? motionMin : (x > motionMax ? motionMax : x);
      y = y < motionMin ? motionMin : (y > motionMax ? motionMax : y);
      // Normalize from -1 to 1 => 0 to 1
      x = (x + 1) / 2;
      y = (y + 1) / 2;
    }

    var hRatio = x/((moveable() === true) ? motionMax : plaxActivityTarget.width()),
        vRatio = y/((moveable() === true) ? motionMax : plaxActivityTarget.height()),
        layer, i;

    for (i = layers.length; i--;) {
      layer = layers[i];
      if(options.useTransform && !layer.background){
        newX = layer.transformStartX + layer.inversionFactor*(layer.xRange*hRatio);
        newY = layer.transformStartY + layer.inversionFactor*(layer.yRange*vRatio);
        newZ = layer.transformStartZ;
        layer.obj
            .css({'transform':'translate3d('+newX+'px,'+newY+'px,'+newZ+'px)'});
      }else{
        newX = layer.startX + layer.inversionFactor*(layer.xRange*hRatio);
        newY = layer.startY + layer.inversionFactor*(layer.yRange*vRatio);
        if(layer.background) {
          layer.obj
            .css('background-position', newX+'px '+newY+'px');
        } else {
          layer.obj
            .css('left', newX)
            .css('top', newY);
        }
      }
    }
  }

  $.plax = {
    // Begin parallaxing
    //
    // Parameters
    //
    //  opts - options for plax
    //    activityTarget - optional; plax will only work within the bounds of this element, if supplied.
    //
    //  Examples
    //
    //    $.plax.enable({ "activityTarget": $('#myPlaxDiv')})
    //    # plax only happens when the mouse is over #myPlaxDiv
    //
    // returns nothing
    enable: function(opts){
      if (opts) {
        if (opts.activityTarget) plaxActivityTarget = opts.activityTarget || $(document.body);
        if (typeof opts.gyroRange === 'number' && opts.gyroRange > 0) motionDegrees = opts.gyroRange;
      } else {
        plaxActivityTarget = $(document.body);
      }

      plaxActivityTarget.bind('mousemove.plax', function (e) {
        plaxifier(e);
      });

      if(moveable()){
        window.ondeviceorientation = function(e){plaxifier(e);};
      }

    },

    // Stop parallaxing
    //
    //  Examples
    //
    //    $.plax.disable()
    //    # plax no longer runs
    //
    //    $.plax.disable({ "clearLayers": true })
    //    # plax no longer runs and all layers are forgotten
    //
    // returns nothing
    disable: function(opts){
      $(document).unbind('mousemove.plax');
      window.ondeviceorientation = undefined;
      if (opts && typeof opts.restorePositions === 'boolean' && opts.restorePositions) {
        for(var i = layers.length; i--;) {
          layer = layers[i];
          if(options.useTransform && !layer.background){
            layer.obj
                .css('transform', 'translate3d('+layer.transformOriginX+'px,'+layer.transformOriginY+'px,'+layer.transformOriginZ+'px)')
                .css('top', layer.originY);
          }else{
            if(layers[i].background) {
              layer.obj.css('background-position', layer.originX+'px '+layer.originY+'px');
            } else {
              layer.obj
                .css('left', layer.originX)
                .css('top', layer.originY);
            }
          }
        }
      }
      if (opts && typeof opts.clearLayers === 'boolean' && opts.clearLayers) layers = [];
    }
  };

  if (typeof ender !== 'undefined') {
    $.ender($.fn, true);
  }

})(function () {
  return typeof jQuery !== 'undefined' ? jQuery : ender;
}());
