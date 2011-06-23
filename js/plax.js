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

  var maxfps = 25;
  var delay = 1 / maxfps * 1000 // delay in ms
  var lastRender = new Date().getTime();
  var layers    = [],
      docWidth  = $(window).width(),
      docHeight = $(window).height()

  $(window).resize(function() {
      docWidth  = $(window).width()
      docHeight = $(window).height()
  })

  // Public Methods
  $.fn.plaxify = function (params){

    return this.each(function () {

      var layer = {"xRange":0,"yRange":0,"invert":false}
      for (var param in params) {
        if (layer[param] == 0) {
          layer[param] = params[param]
        }
      }

      // Add an object to the list of things to parallax
      layer.obj    = $(this)
      layer.startX = this.offsetLeft
      layer.startY = this.offsetTop

      if(layer.invert == false){
        layer.startX -= layer.xRange/2
        layer.startY -= layer.yRange/2
      } else {
        layer.startX += layer.xRange/2
        layer.startY += layer.yRange/2
      }
      layers.push(layer)
    })
  }

  function plaxifier(e) {
    if (new Date().getTime() < lastRender + delay) return;
      lastRender = new Date().getTime();

    var x      = e.pageX,
        y      = e.pageY,
        hRatio = x/docWidth,
        vRatio = y/docHeight,
        layer, i
    
    for (i = layers.length; i--;) {
      layer = layers[i]
      if (layer.invert != true) {
        layer.obj
          .css('left',layer.startX + (layer.xRange*hRatio))
          .css('top', layer.startY + (layer.yRange*vRatio))
      } else {
        layer.obj
          .css('left',layer.startX - (layer.xRange*hRatio))
          .css('top', layer.startY - (layer.yRange*vRatio))
      }
    }
  }

  $.plax = {
    enable: function(){
      $(document).bind('mousemove.plax', function (e) {
        plaxifier(e)
      })
    },
    disable: function(){
      $(document).unbind('mousemove.plax')
    }
  }

  if (typeof ender !== 'undefined') {
    $.ender($.fn, true)
  }

})(function () {
  return typeof jQuery !== 'undefined' ? jQuery : ender
}())
