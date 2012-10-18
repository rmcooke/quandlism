(function(exports) { 
var quandlism = exports.quandlism = { version: '0.1.0' };
var quandlism_id = 0;




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

QuandlismLine_.extent = function() {
  var i = 0, 
  n = this.length(), 
  min = Infinity, 
  max = -Infinity,
  val;
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
  values = data.values,
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



QuandlismContext_.stage = function() {
  var context = this,
  buffer = document.createElement('canavs')
  lines = [],
  width = buffer.width = context.width(), height = buffer.height = context.height(),
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  extent = null,
  format = d3.format('.2s'),
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"];
  
  
  function stage(selection) {
    
    var self = this;
    lines = selection.datum();
    selection.append('canvas').attr('width', context.width()).attr('height', context.height());
       
    var canvas = selection.select('canvas');
    canvas = canvas.node().getContext('2d');

    _.each(lines, function(line, j) {

      var extent = line.extent();
      
      yScale.domain([0, extent[1]]); 
      yScale.range([height, 0 ]);
      xScale.domain([0, line.length()]);
      xScale.range([0, width]);
      
      canvas.beginPath();
      canvas.moveTo(xScale(0), yScale(line.valueAt(0)));
      for (i = 1; i < line.length(); i++) {
        canvas.lineTo(xScale(i), yScale(line.valueAt(i)));
      }
      canvas.strokeStyle = colors[j];
      canvas.stroke();
      canvas.closePath();
      
   });
   
  }
  
  stage.lines = function(_) {
    if (!arguments.length) {
      return lines;
    }
    lines = _;
    return stage;
  }
  
  return stage;
}
 })(this);