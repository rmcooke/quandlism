(function(exports) { 
var quandlism = exports.quandlism = { version: '0.1.0' };
var quandlism_id = 0;




quandlism.context = function() {
  var context = new QuandlismContext(),
  frequency = 'daily',
  trans = 'none',
  width,
  height,
  width0 = null,
  height0 = null,
  el,
  event = d3.dispatch('respond'),
  timeout;    
  /**
   * Expose attributes with getter/setters
   */
  function update() {
    width = width0 = $(el).width();
    height = height0 = $(el).height();
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
  
  // Add and remove listeners

  context.respond = _.throttle(function() {
    event.respond.call(context, width, height);
  }, 500);
  
  context.on = function(type, listener) {
    if (arguments.length < 2) {
      return event.on(type);
    }
    
    event.on(type, listener);
    
    if (listener != null) {
      if (type == 'change') {
        listener.call(context, width, height);
      }
    }
    
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
  lines = [],
  buffer = document.createElement('canvas'),
  width = context.width(), height = context.height(),
  stageHeight = height * 0.8,
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  extent = null,
  format = d3.format('.2s'),
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"];
  
  
  function stage(selection) {
    
    var self = this;
    lines = selection.datum();
    selection.append('canvas').attr('width', width).attr('height', stageHeight).attr('class', 'stage');
    var canvas = selection.select('.stage');
    canvas = canvas.node().getContext('2d');
    
    exes = _.map(lines, function(line, j) {
      return line.extent();
    });  
    
    max = d3.max(exes, function(m) { return m[1]; });
    min = d3.min(exes, function(m) { return m[0]; });
    
    draw();
    
    function draw() {
      
      yScale.domain([min, max]); 
      yScale.range([stageHeight, 0 ]);
    
      xScale.domain([0, lines[0].length()]);
      xScale.range([0, width]);
      _.each(lines, function(line, j) {
        context.utility().drawPath(line, colors[j], canvas, xScale, yScale);
      });
    }
    
    context.on('respond', function(width_, height_) {
      
      canvas.clearRect(0, 0, width, height);
      width = width_, height = height_, stageHeight = height * 0.8;
      
      draw();


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
QuandlismContext_.brush = function() {
  
  var context = this,
  height = context.height(), width = context.width(), brushHeight = height * 0.2
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  dragging = false,
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"];
  
  function brush(selection) {

    var self = this;
    lines = selection.datum();
    
    selection.append('canvas').attr('width', width).attr('height', brushHeight).attr('class', 'brush');
    var canvas = selection.select('.brush');
    canvas = canvas.node().getContext('2d');
    exes = _.map(lines, function(line, j) {
      return line.extent();
    });  
    
    max = d3.max(exes, function(m) { return m[1]; });
    min = d3.min(exes, function(m) { return m[0]; });
    
    
    // Set domain and range for x scale and y scale for focus and brush
    yScale.domain([min, max]); 
    yScale.range([brushHeight, 0 ]);
    
    xScale.domain([0, lines[0].length()]);
    xScale.range([0, width]);
    

    // Draw lines
    _.each(lines, function(line, j) {
      context.utility().drawPath(line, colors[j], canvas, xScale, yScale);
    });
    
    // Draw viewer box
    rectX = Math.floor(width*0.75);
    rectY = 0;
    
    canvas.fillStyle = 'rgba(0, 0, 0, 0.25)';
    canvas.fillRect(rectX, 0, width - rectX, height);
    
      
  }
  
  
  return brush
  
  
  
}

QuandlismContext_.utility = function() {
  
  var context = this;
  
  function utility() {
    
  }
  
  /**
   * Parses the input date into a readable format for D3
   * String format is a function of the datasets frequency parameter
   *
   * Return a time formatter
   */
  utility.parseDate = function() {   
    dateString = '';
    switch(context.frequency()) {
      case 'daily':
        dateString = '%Y-%m-%d';
        break;
      default:
        throw('Error error');
    }
    return d3.time.format(dateString).parse;
  }
  
  /**
   * Write this
   */
  utility.dateColumn = function(d) {
    if (typeof(d.Year) != 'undefined') {
      return 'Year';
    }
    if (typeof(d.Date != 'undefined')) {
      return 'Date';
    }
    throw('Error - Unknown date column');
  }
  
  /**
   * Draws the canvas path on the focus or brush chart
   *
   * line   - The quanlism.line object
   * color  - The hex color code of the line
   * canvas - The HTML canavs element to draw on
   * xScale - The D3 scale for the xAxis
   * yScale - The D3 scale for the yAxis
   *
   * Return nil
   */
  utility.drawPath = function(line, color, canvas, xScale, yScale) {
    canvas.beginPath();
    canvas.moveTo(xScale(0), yScale(line.valueAt(0)));
    for (i = 0; i < line.length(); i++) {
      canvas.lineTo(xScale(i), yScale(line.valueAt(i)));
    }  
    canvas.strokeStyle = color;
    canvas.stroke();
    canvas.closePath();
  }
  
  
  return utility;
}

 })(this);