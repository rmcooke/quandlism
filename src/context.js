

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
  function update() {
    return context;
  }

   
  /**
   * The width of the plot
   */ 
  context.width = function(_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return update();
  }
  
  /**
   * The height of the plot
   */  
  context.height = function(_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return update();
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
  
  
  return context;
}

function QuandlismContext() {}
var QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype;
