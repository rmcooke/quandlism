

quandlism.context = function() {
  var context = new QuandlismContext(),
  frequency = 'daily',
  trans = 'none',
  bW, bH, sW, sH,
  stageDOM = brushDOM = null,
  event = d3.dispatch('respond', 'adjust'),
  scale,
  timeout;
  
  /**
   * Expose attributes with getter/setters
   */
  function update() {
    if (stageDOM != null) {
      sW = $(stageDOM).width();
      sH = $(stageDOM).height();
    }
    if (brushDOM != null) {
      bW = $(brushDOM).width();
      bH = $(brushDOM).height();
    }
    return context;
  }
    
  /**
   * The transformation of the dataset
   */
  context.trans = function(_) {
    if (!arguments.length) {
      return trans;
    }
    trans = _;
    return update();
  }
  
  context.frequency = function(_) {
    if (!arguments.length) {
      return frequency;
    }
    frequency = _;
    return update();
  }  
  
  context.el = function(_) {
    if (!arguments.length) {
      return el;
    }
    el = _;
    return update();
  }
  
  context.bW = function(_) {
    if (!arguments.length) {
      return bW;
    }
    bW = _;
    return update();
  }
  
  context.bH = function(_) {
    if (!arguments.length) {
      return bH;
    }
    bH = _;
    return update();
  }
  
  context.sW = function(_) {
    if (!arguments.length) {
      return sW;
    }
    sW = _;
    return update();
  }
  
  context.sH = function(_) {
    if (!arguments.length) {
      return sH;
    }
    sH = _;
    return update();
  }
  
  context.stageDOM = function(_) {
    if (!arguments.length) {
      return stageDOM;
    }
    stageDOM = _;
    return update();
  }
  
  context.brushDOM = function(_) {
    if (!arguments.length) {
      return brushDOM;
    }
    brushDOM = _;
    return update();
  }
  

  
  // Event listeners

  context.respond = _.throttle(function() {
    event.respond.call(context);
  }, 500);
  
  context.adjust = function(x1, x2) {
    event.adjust.call(context, x1, x2);
  }
  
  
  context.on = function(type, listener) {
    if (arguments.length < 2) {
      return event.on(type);
    }
    
    event.on(type, listener);
    
    return context;
  }
  
  d3.select(window).on('resize', function() {
    d3.event.preventDefault();
    if (stageDOM != null || brushDOM != null) {
      respond = false;
      if (stageDOM != null) {
        sW0 = $(stageDOM).width();
        sH0 = $(stageDOM).height();
        if (sW0 != sW || sH0 != sH) {
          respond = true;
          sW = sW0;
          sH = sH0;
        } 
      }
      if (brushDOM != null) {
       bW0 = $(brushDOM).width();
       bH0 = $(brushDOM).height();
       if (bH0 != bH || bW0 != bW) {
         respond = true;
         bW = bW0;
         bH = bH0;
       } 
      }
      if (respond) {
        context.respond();
      }
    }

  });

  
  return update();
}

function QuandlismContext() {}
var QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype;
