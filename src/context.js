quandlism.context = function() {
  var context = new QuandlismContext(),
  frequency = 'daily',
  trans = 'none',
  w = h = null,
  dom = null, domlegend = null, domtooltip = null, dombrush = null, domstage = null,
  event = d3.dispatch('respond', 'adjust', 'toggle', 'refresh', 'x_axis_refresh'),
  colorScale = d3.scale.category20(),
  endPercentage = 0.8,
  scale;


  function update() {
    w = $(dom).width();
    h = $(dom).height();
    return context;
  }
  
  /**
   * Functions
   */
  
  /**
   * Creates each quandlism chart that has a specified dom element.
   * Convenenice method. Each element can be created and updated separately.
   *
   * Returns self
   */
  context.render = function() {
    if (domstage) {
      d3.select(domstage).call(this.stage());
    }
    if (dombrush) {
      d3.select(dombrush).call(this.brush());
    }
    if (domlegend) {
      d3.select(domlegend).call(this.legend());
    }
    return update();
  } 
  
  /**
   * Traverse the defined dom elements (and their axis children) and attach data for future
   * operations.
   * 
   * lines - The array of lines
   *
   * Returns self
   */
  context.attachData = function(lines) {
    if (domstage) {
      stage = d3.select(domstage).datum(lines);
      if (stage.select('.x')) {
        stage.select('.x').datum(lines);
      }
      if (stage.select('.y')) {
        stage.select('.y').datum(lines);
      }
    }
    if (dombrush) {
      brush = d3.select(dombrush).datum(lines);
      if (brush.select('.x')) {
        brush.select('.x').datum(lines);
      }
    }
    if (domlegend) {
      d3.select(domlegend).datum(lines);
    }
    return update();
  }
  
  /**
   * Before refershing data, due to updated frequency or transformation, reset the line counter
   */
  context.prepare = function() {
    quandlism_line_id = 0;
    return update();
  }
  

  /**
   * Expose attributes with getters and setters
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
  
  context.domtooltip = function(_) {
    if (!arguments.length) {
      return domtooltip;
    }
    domtooltip = _;
    return update();
  }
  
  context.domstage = function(_) {
    if (!arguments.length) {
      return domstage;
    }
    domstage = _;
    return update();
  }
  
  context.dombrush = function(_) {
    if (!arguments.length) {
      return dombrush;
    }
    dombrush = _;
    return update();
  }
  
  context.colorScale = function(_) {
    if (!arguments.length) {
      return colorScale;
    }
    colorScale = _;
    return update();
  }
  
  context.endPercentage = function(_) {
    if (!arguments.length) {
      return endPercentage;
    }
    endPercentage = _;
    return update();
  }
  
  
  /**
   * Event Listeners / Dispatchers
   */
   
  context.refresh = function() {
    // Reset the quandlism_line_id to keep legend interaction
    event.refresh.call(context);
  }

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
  
  context.x_axis_refresh = function() {
    event.x_axis_refresh.call(context);
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
