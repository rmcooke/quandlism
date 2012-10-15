quandlism.context = function() {
  var context = new quandlism_context,
  step = 1e4,
  size = 1440,
  event = d3.dispatch('prepare', 'beforechange', 'change', 'focus');  
}

function quandlism_context() {}

var quandlism_contextPrototype = quandlism.context.prototype = quandlism_context.prototype;