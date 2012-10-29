(function(exports) { 
var quandlism = exports.quandlism = { version: '0.1.0' };
var quandlism_id = 0;




quandlism.context = function() {
  var context = new QuandlismContext(),
  frequency = 'daily',
  trans = 'none',
  width,
  height,
  el,
  event = d3.dispatch('respond', 'adjust'),
  scale,
  timeout;
  
  /**
   * Expose attributes with getter/setters
   */
  function update() {
    width =  $(el).width();
    height =  $(el).height();
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

var quandlism_axis = 0;
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
  n = this.length() -1, 
  min = Infinity, 
  max = -Infinity,
  val;
  if (start != null) {
    i = start;
  }
  if (end != null) {
    n = end;
  }
  while (i <= n) {
    val = this.valueAt(i);
    if (typeof(val) == 'undefined') {
      i++;
      continue;
    }
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
    i++;
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



QuandlismContext_.stage = function() {
  var context = this,
  lines = [],
  width = context.width(), height = context.height(),
  stageHeight = height * 0.9,
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  extent = null,
  canvas = null,
  ctx = null,
  start = 0, end = 0,
  format = d3.format('.2s'),
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"];
  
  
  function stage(selection) {
    
    var self = this;
    lines = selection.datum();
    selection.append('canvas').attr('width', width).attr('height', stageHeight).attr('class', 'stage');
    canvas = selection.select('.stage');
    ctx = canvas.node().getContext('2d');
    
    
    end = lines[0].length();
    start = Math.floor(lines[0].length()*.80);
    

    draw();
    
    function draw() {
      
      exes = _.map(lines, function(line, j) {
        return line.extent(start, end);
      });  
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]
    
      
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([stageHeight, 0 ]);
    
      xScale.domain([start, end]);
      xScale.range([0, width]);
      
      ctx.clearRect(0, 0, width, height);
      
      _.each(lines, function(line, j) {
        context.utility().drawPath(line, colors[j], ctx, xScale, yScale, start, end);
      });
      
    }
    
    
    context.on('respond.stage', function() {
      
      ctx.clearRect(0, 0, width, stageHeight);
      
      width = context.width(), height = context.height(), stageHeight = height * 0.9;
      
      canvas.attr('width', width).attr('height', stageHeight);
            
      draw();

    });
    
    context.on('adjust.stage', function(x1, x2) {
      start = (x1 > 0) ? x1 : 0;
      end = (x2 < lines[0].length()) ? x2 : lines[0].length() -1;
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
  height = height0 = context.height() * 0.2, 
  width = width0 = context.width(), brushWidth = brushWidth0 = Math.ceil(width * 0.2), handleWidth = 10,
  start = start0 = Math.ceil(width*0.8),
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"],
  canvas = null,
  ctx = null,
  lines = [],
  extent = [],
  dragging = false,
  stretching = false,
  stretchingHandle = 0,
  dragX = 0;
  
  
  function brush(selection) {

    var self = this;
    lines = selection.datum();
    
    selection.append('canvas').attr('width', width).attr('height', height).attr('id', 'brush');
    
    canvas = selection.select('#brush');
    ctx = canvas.node().getContext('2d');
    
  
    exes = _.map(lines, function(line, j) {
      return line.extent();
    });  
        
    extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })];
      
    console.log(exes);
    console.log(extent);
      
    setScales();
        
    update();
    
    
    /**
     * Set scale functions for brush
     */
    function setScales() {
      // Scales should only be set on construction and resize   
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([height, 0 ]);
    
      xScale.domain([0, (lines[0].length() -1)]);
      xScale.range([0, width]);
    }
    
    /**
     * Timeout function. Responds to drags!
     */
    function update() {
      // Canvas clear
      clearCanvas();      
      draw();
      drawBrush();
    }
    
    
    
    /**
     * Clear the context
     */ 
    function clearCanvas() {
      ctx.clearRect(0, 0, width0, height0);
      
      canvas.attr('width', width).attr('height', height);
    }
    
    /**
     * Draw the lines 
     */
    function draw() {   
      // Draw lines
      _.each(lines, function(line, j) {
        context.utility().drawPath(line, colors[j], ctx, xScale, yScale, 0, lines[0].length());
      });
    }
    
    /**
     * Draw the brush
     */
    function drawBrush() {
         
      //ctx.strokeStyle = 'rgba(207, 207, 207, 0.55)';
      ctx.beginPath();
      ctx.fillStyle = 'rgba(207, 207, 207, 0.55)'

      ctx.fillRect(start, 0, brushWidth, height)
      ctx.lineWidth = 1;
      ctx.lineTo(start, height);
      ctx.closePath();
      
      ctx.beginPath();
      ctx.lineWidth = handleWidth;
      ctx.strokeStyle = '#CFCFCF';
      ctx.strokeRect(start, 0, brushWidth, height);
      ctx.closePath();
      
      // ctx.fillRect(start, 0, 10, height);
      //      ctx.fillRect(start + brushWidth - 10, 0, 10, height);      
   
    }
    
    function invertAdjust() {
      x1 = xScale.invert(start);
      x2 = xScale.invert(start + brushWidth);
      context.adjust(Math.ceil(x1), Math.ceil(x2));
    }
  
    invertAdjust();
      
    
    
    /**
     * Binding
     */
    context.on('respond.brush', function() {
      
      height0 = height, width0 = width;
      height = context.height() * 0.2, width = context.width();
      brushWidth = Math.ceil(brushWidth/width0*width);
      start = Math.ceil(start/width0*width);
      start0 = Math.ceil(start0/width0*width);
      setScales();
      
    });
    
    /**
     * Check if mouse click occured on the brush
     */
    canvas.node().addEventListener('mousedown', function(e) {
      click = context.utility().getClickLocation(e, canvas.node());
      xPoint = click.x;
      if (xPoint >= start && xPoint <= start + handleWidth) {
        stretching = true;
        stretchingHandle = -1;
        this.className = 'resize';
        dragX = xPoint;
      } else if (xPoint >= (start + brushWidth) && xPoint <= (start + brushWidth + handleWidth)) {
        stretching = true;
        stretchingHandle = 1;
        this.className = 'resize';
        dragX = xPoint;
      }
      else if (xPoint <= (brushWidth + start) && xPoint >= start) {
        dragging = true;
        dragX = xPoint;
      }
    });
    
    /**
     * Stop dragging
     */
    canvas.node().addEventListener('mouseup', function(e) {
      this.className = '';
      dragging = false;
      stretching = false;
      stretchingDir = 0;
      start0 = start;
      brushWidth0 = brushWidth;
    });
    
    /**
     * Calculate the movement
     */
    canvas.node().addEventListener('mousemove', function(e) {
      
      click = context.utility().getClickLocation(e, canvas.node())
      xPoint = click.x;
      
      if (dragging || stretching) {
      
        if (dragging) {
          dragDiff = xPoint - dragX;
          start = start0 + dragDiff;
        }

        else if (stretching) {
          
          dragDiff = xPoint - dragX;
          
          if (stretchingHandle == -1) {
            start = start0 + dragDiff;
            brushWidth = brushWidth0 - dragDiff;
          } else if (stretchingHandle == 1) {
            brushWidth = brushWidth0 + dragDiff;
          } else {
            throw('Error: Which direction?');
          }
        }
        
        invertAdjust();

      }
    });
    
    setInterval(update, 50);
      
  }
  
  return brush;

  
}
QuandlismContext_.axis = function() {
  var context = this,
  scale = d3.time.scale().domain([0, length]).range([0, context.width()]),
  axis_ = d3.svg.axis().scale(scale),
  active = false,
  data,
  id;
  
  function axis(selection) {
    id = selection.attr('id');      
    data = selection.datum();
    
    extent = [data[0], data[(data.length-1)]];
        
    parseDate = context.utility().parseDate();
        
    scale.domain([parseDate(extent[0]), parseDate(extent[1])]);
   
    axis_.tickFormat(d3.time.format('%b %d, %Y'));
   
    axis_.ticks(Math.floor(context.width() / 150), 0, 0);
    scale.range([0, context.width()]);
        
    function update() {      
      axis.remove();
      var g = selection.append('svg')
          .attr('width', context.width())
          .attr('height', 100)
        .append('g')
          .attr('transform', 'translate(0,27)')
          .call(axis_);
    }
    
    update();
    
    // Listen for resize
    context.on('respond.axis-'+id, function() {
    
      axis_.ticks(Math.floor(context.width() / 150), 0, 0);
      scale.range([0, context.width()]);
      update();
      
    });
    
    // If the axis is active, it should respond to the brush event to update its access
    if (active) {
      context.on('adjust.axis-'+id, function(x1, x2) {
        x2 = (x2 > (data.length-1)) ? (data.length-1) : x2;
        x1 = (x1 < 0) ? 0 : x1;
        extent = [data[x1], data[x2]];
        scale.domain([parseDate(extent[0]), parseDate(extent[1])])
        update();
      });
    }
           
  }
  
  axis.remove = function() {
    d3.select('#' + id).selectAll("svg").remove();
  }
  
  axis.active = function(_) {
    if (!arguments.length) {
      return active;
    }
    active = _;
    return axis;
  }
  
  return d3.rebind(axis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
}
QuandlismContext_.utility = function() {
  
  var context = this;
  
  function utility() {
    
  }
  
  utility.dateFormat = function() {
    dateString = '';
    switch(context.frequency()) {
      case 'daily':
        dateString = '%Y-%m-%d';
        break;
      case 'annual':
        dateString = '%Y';
        break;
      default:
        throw('Error error');
    }
    return dateString;

  }
  
  /**
   * Parses the input date into a readable format for D3
   * String format is a function of the datasets frequency parameter
   *
   * Return a time formatter
   */
  utility.parseDate = function() {   
    dateString = this.dateFormat();
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
   * start - The first x-index to draw
   * end - The last x-index to draw
   *
   * Return nil
   */
  utility.drawPath = function(line, color, canvas, xScale, yScale, start, end) {
    canvas.beginPath();
    
    // If only one point, draw circle, otherwise, draw path
    if (start != end) {
      for (i = start; i <= end; i++) {
        canvas.lineTo(xScale(i), yScale(line.valueAt(i)));
      }  
      canvas.strokeStyle = color;
      canvas.stroke();
    } else {
      canvas.arc(xScale(start), yScale(line.valueAt(start)), 10, 0, Math.PI*2, true);
      canvas.fillStyle = color;
      canvas.fill();
    }

    canvas.closePath();
  }
  
  
  utility.getClickLocation = function(e, c) {
    var x, y;
    if (e.pageX || e.pageY) {
      x = e.pageX, y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= c.offsetLeft;
    y -= c.offsetTop;
    return {x: x, y: y};
    
  }
  
  
  return utility;
}

 })(this);