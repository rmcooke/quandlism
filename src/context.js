

quandlism.context = function() {
  var context = new QuandlismContext(),
  frequency = 'daily',
  trans = 'none',
  w, h,
  dom = null, domlegend = null,
  event = d3.dispatch('respond', 'adjust', 'toggle'),
  colorScale = d3.scale.category20(),
  scale,
  timeout;
  
  /**
   * Expose attributes with getter/setters
   */
  function update() {
    if (dom !== null) {
      w = $(dom).width();
      h = $(dom).height();
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
  
  context.w = function(_) {
    if (!arguments.length) {
      return w;
    }
    w = _;
    return update();
  }
  
  context.h = function(_) {
    if (!arguments.length) {
      return h;
    }
    h = _;
    return update();
  }
  
  context.dom = function(_) {
    if (!arguments.length) {
      return dom;
    }
    dom = _;
    return update();
  }
  
  context.domlegend = function(_) {
    if (!arguments.length) {
      return domlegend;
    }
    domlegend = _;
    return update();
  }
  
  context.colorScale = function(_) {
    if (!arguments.length) {
      return colorScale;
    }
    colorScale = _;
    return update();
  }
  
  
  // Event listeners

  context.respond = _.throttle(function() {
    event.respond.call(context);
  }, 500);
  
  context.adjust = function(x1, x2) {
    event.adjust.call(context, x1, x2);
  }
  
  // Handles toggling of visiblity
  context.toggle = function() {
    event.toggle.call(context);
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
    if (dom != null) {
        w0 = $(dom).width();
        h0 = $(dom).height();
        if (w != w0 || h != h0) {
          w = w0;
          h = h0;
          context.respond();
        }
      }
  });

  
  return update();
}

function QuandlismContext() {}
var QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype;
