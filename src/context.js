

quandlism.context = function() {
  var context = new QuandlismContext(),
  width = 500,
  height = 500,
  step = 100,
  frequency = 'daily',
  trans = 'none'
  event = d3.dispatch('prepare'),
  scale = context.scale = d3.time.scale().range([0, width]);
  
  /**
   * Expose attributes with getter/setters
   */
   
  /**
   * The width of the plot
   */ 
  context.width = function(_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return context;
  }
  
  /**
   * The height of the plot
   */  
  context.height = function(_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
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
    return context;
  }
  
  context.frequency = function(_) {
    if (!arguments.length) {
      return frequency;
    }
    frequency = _;
    return context;
  }  
  
  return context;
}

function QuandlismContext() {}
var QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype;
