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