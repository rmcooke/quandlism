/**
 * Quandlism Line
 */
function QuandlismLine(context) {
  this.context = context;
}
var QuandlismLine_ = QuandlismLine.prototype;

quandlism.line = QuandlismLine;

QuandlismLine_.valueAt = function() {
  return NaN;
}

QuandlismLine_.extent = function(start, end) {
  var i = 0, 
  n = this.length(), 
  min = Infinity, 
  max = -Infinity,
  val;
  if (start != null) {
    i = start;
  }
  if (end != null) {
    n = end;
  }
  while (++i < n) {

    val = this.valueAt(i);
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
  }
  return [min, max];
}

QuandlismContext_.line = function(data) {
  var context = this,
  line = new QuandlismLine(context),
  name = data.name,
  values = data.values.reverse(),
  id = ++quandlism_id,
  step = 10,
  visible = true,
  canvas = null;
    
  
  function prepare() {
    
  }
  
  line.startDate = function() {
    return values[0].date;
  }
  
  line.endDate = function() {
    return values[this.length() - 1].date;
  }
  
  line.valueAt = function(i) {
    if (typeof(values[i]) === 'undefined') {
      return null;
    } else {
      return values[i].num;
    }
  }
  
  line.values = function() {
    return values;
  }
  
  
  line.length = function() {
    return values.length;
  }
  
  line.visible = function(_) {
    if (!arguments.length) {
      return visible;
    }
    visible = _;
    return line;
  }
  
  line.canvas = function(_) {
    if (!arguments.length) {
      return canvas;
    }
    canvas = _;
    return line;
  }
  
  return line;
}


