

quandlism.context = function() {
  var context = new QuandlismContext(),
  frequency = 'daily',
  trans = 'none',
  width,
  height,
  width0 = null,
  height0 = null,
  el,
  event = d3.dispatch('respond', 'adjust'),
  scale,
  timeout;
  
  /**
   * Expose attributes with getter/setters
   */
  function update() {
    width = width0 = $(el).width();
    height = height0 = $(el).height();
    scale = context.scale = d3.time.scale([0, width])
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
  
  context.height = function(_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return update();
  }
  
  context.width = function(_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return update();
  }  
  
  context.el = function(_) {
    if (!arguments.length) {
      return el;
    }
    el = _;
    return update();
  }
  

  
  // Event listeners

  context.respond = _.throttle(function() {
    event.respond.call(context, width, height);
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
    h = $(el).height(), w = $(el).width();
    if (h != height || w != width) {
      width = w, height = h;
      context.respond();
    }
  });

  
  return update();
}

function QuandlismContext() {}
var QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype;
