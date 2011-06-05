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

(function($){

  var layers    = [],
      docWidth  = $(window).width(),
      docHeight = $(window).height()

  $(window).resize(function() {
      docWidth  = $(window).width()
      docHeight = $(window).height()
  })
    
  // Public Methods

  // Add an object to the list of things to parallax
  $.fn.plaxify = function (params){
    var layer    = {"xRange":0,"yRange":0,"invert":false},
        position = this.position()

    for(var param in params){
      if(layer[param]==0){
        layer[param] = params[param]
      }
    }
    layer.obj    = this
    layer.startX = position.left
    layer.startY = position.top

    if(layer.invert == false){
      layer.startX -= Math.floor(layer.xRange/2)
      layer.startY -= Math.floor(layer.yRange/2)
    } else {
      layer.startX += Math.floor(layer.xRange/2)
      layer.startY += Math.floor(layer.yRange/2)
    }
    layers.push(layer)
  }

  
  $.plax = {
    listLayers: function(){
      console.log(layers)
    },
    enable: function(){
      $(document).mousemove(function(e){
        var x      = e.pageX,
            y      = e.pageY,
            hRatio = Math.round((x/docWidth)*100)/100,
            vRatio = Math.round((y/docHeight)*100)/100
        $.each(layers, function(index,layer) {
          if(layer.invert != true){
            layer.obj.css('left',layer.startX + (layer.xRange*hRatio))
            layer.obj.css('top', layer.startY + (layer.yRange*vRatio))
          } else {
            layer.obj.css('left',layer.startX - (layer.xRange*hRatio))
            layer.obj.css('top', layer.startY - (layer.yRange*vRatio))
          }
        })
      })
    },
    disable: function(){
      clearTimeout(timer)
    }
  }

})(jQuery);