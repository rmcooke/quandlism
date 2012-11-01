(function(exports) { 
var quandlism = exports.quandlism = { version: '0.1.0' };
var quandlism_id = 0;




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

var quandlism_axis  = 0;
var quandlism_line_id = 0;
var quandlism_stage = {w: 0.90, h: 0.65};
var quandlism_brush = {w: 0.90, h: 0.15};
var quandlism_xaxis = {w: 0.90, h: 0.2};
var quandlism_yaxis = {w: 0.10, h: 0.7};
/**
 * Quandlism Line
 */
function QuandlismLine(context) {
  this.context = context;  
}

var QuandlismLine_ = QuandlismLine.prototype;
quandlism.line = QuandlismLine;


QuandlismContext_.line = function(data) {
  var context = this,
  line = new QuandlismLine(context),
  name = data.name,
  values = data.values.reverse(),
  id = quandlism_line_id++,
  visible = true;    

  
  /**
   * Getter / Setter methods
   *
   */
   
  line.id = function(_) {
   if (!arguments.length) {
     return id;
   }
   id = _;
   return line;
  }
  
  line.visible = function(_) {
    if (!arguments.length) {
      return visible;
    }
    visible = _;
    return line;
  }
  
  line.name = function(_) {
    if (!arguments.length) {
      return name;
    }
    name = _;
    return line;
  }
  
  /**
   * Instance methods for a line object
   *
   */
   
  /**
  * Draws a single point on the focus stage.
  *
  * color - The fill color of the circle
  * ctx - The HTML canvas elmenet to draw on
  * xS - Scale function for x axis
  * yS - Scale function for y axis
  * index - The data index for the point
  */
  line.drawPoint = function(color, ctx, xS, yS, index) {
   if (this.visible()) {
     ctx.beginPath();
     ctx.arc(xS(index), yS(this.valueAt(index)), 5, 0, Math.PI*2, true);
     ctx.fillStyle = color;
     ctx.fill();
     ctx.closePath();   
   }
  }
  
  /**
  * Draws the canvas path on the focus or brush chart
  *
  * color  - The hex color code of the line
  * ctx - The HTML canavs element to draw on
  * xS - The D3 scale for the xAxis
  * yS - The D3 scale for the yAxis
  * start - The first x-index to draw
  * end - The last x-index to draw
  * lineWidth - The width of the line to draw
  *
  * Return nil
  */
  line.drawPath = function(color, ctx, xS, yS, start, end, lineWidth) {  
   if (this.visible()) {
     ctx.beginPath();
     for (i = start; i <= end; i++) {
       ctx.lineTo(xS(i), yS(this.valueAt(i)));
     }  
     ctx.lineWidth = lineWidth;
     ctx.strokeStyle = color;
     ctx.stroke();
     ctx.closePath();
    } 
  }   
     
  /**
   * Caclulate the extent of the line, between start and end, if they are defined, or of the entire line, if they are not.
   *
   * start - An integer index representing the starting point of the extent we want
   * end - An integer index representing the end poitn of th extent we want
   *
   * Returns an array with two elements
   */
  line.extent = function(start, end) {
    var i = 0, 
    n = this.length() -1, 
    min = Infinity, 
    max = -Infinity,
    val;
  
    // If this line is not visible, then return extreme values so its ignored from calculation of total extent
    if (!this.visible()) {
      return [min, max];
    }
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
   
  /**
   * Toggle the visible state of the line. 
   *
   * Returns boolean, the stage that the line was togged to
   */
  line.toggle = function() {
    visibility = !this.visible();
    this.visible(visibility);
    return visibility;
  }
  

  /**
   * Returns the startDate of the line, the date of the first data point
   *
   * Returns a string representing a date
   */
  line.startDate = function() {
    return values[0].date;
  }
  
  /**
   * Returns the endDate of the line, the date of the last data point
   *
   * Returns a string representing a date
   */
  line.endDate = function() {
    return values[this.length() - 1].date;
  }
  
  
  /**
   * Returns the number value of the dataset corresponding to an array index
   *
   * i - The integer index 
   *
   * Returns an integer value
   */
  line.valueAt = function(i) {
    if (typeof(values[i]) === 'undefined') {
      return null;
    } else {
      return values[i].num;
    }
  }
  
  /**
   * Returns the date value of the dataset corresponding to an array index
   *
   * i - The integer index
   *
   * Returns a string reprenting a date
   */
  line.dateAt = function(i) {
    if (typeof(values[i]) === 'undefined') {
      return null;
    } else {
      return values[i].date;
    }
  }
  
  line.values = function() {
    return values;
  }
  
  line.length = function() {
    return values.length;
  }
  

  

  
  return line;
}



QuandlismContext_.stage = function() {
  var context = this,
  lines = [],
  canvasId = 'canvas-stage',
  width = Math.floor(context.w()*quandlism_stage.w), 
  height = Math.floor(context.h()*quandlism_stage.h)
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  extent = null,
  canvas = null,
  ctx = null,
  colorRange = [],
  start = 0, 
  end = 0;
  
  
  function stage(selection) {
    
    // Extract line data    
    lines = selection.datum();
        
    // Append div for y-axis and call yaxis from context
    selection.append('div').datum(lines).attr('class', 'y axis').attr('id', 'y-axis-stage').call(context.yaxis().active(true).orient('left'));
    
    // Append div for stage-holder (to hold x-axis, stage data and brush)
    div = selection.append('div').attr('class', 'stage-holder');
  
    // Append x-axis and stage
    div.append('canvas').attr('width', width).attr('height', height).attr('class', 'stage').attr('id', canvasId);
    div.append('div').datum(lines).attr('class', 'x axis').attr('id', 'x-axis-stage').call(context.axis().active(true));    
    
    // If Legend DOM is defined, create the legend. Style w/ CSS
    if (context.domlegend() != null) {
      d3.select(context.domlegend()).datum(lines).call(context.legend());
    }
    
    // Get references to canvas and canvas context for drawing
    canvas = selection.select('.stage');
    ctx = canvas.node().getContext('2d');
    
    // Calculate initial start / end points
    end = lines[0].length();
    start = Math.floor(lines[0].length()*.80);

    // Draw the stage
    draw();
    
    // After drawing the first time, save the computed color range for easy look up later!
    colorRange = context.colorScale().range();
    
    // Draw the brush inside the stage-holder
    div.call(context.brush());
    
    
    /**
     * Draws the stage
     * Calculates extents, given the start and end, adjusts the axis domain/ranges and draws the path
     */
    function draw() {
      exes = _.map(lines, function(line, j) {
        return line.extent(start, end);
      });  
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]
    
      // For single points, edit extent so circle is not drawn at the corner
      xStart = 0;
      if (start == end) {
        extent = [0, extent[0]*1.25];
        xStart = Math.floor(width/2);
      }
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([height, 0 ]);
    
      xScale.domain([start, end]);
      xScale.range([xStart, width]);
      
      ctx.clearRect(0, 0, width, height);
      
      _.each(lines, function(line, j) {        
        if (start == end) {
          line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, start);
        } else {
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, start, end, 3);
        }
      });
      
    }
    
  
    
    /**
     * Callbacks
     */
    
    /**
     * Callback for context.respond event
     *
     * Clears the drawing context, recalculates width / height and re-draws
     */
    context.on('respond.stage', function() {
      ctx.clearRect(0, 0, width, height);
      width = Math.floor(context.w()*quandlism_stage.w), height = Math.floor(context.h()*quandlism_stage.h);
      canvas.attr('width', width).attr('height', height);
      draw();
    });
    
    /**
     * Callback for context.adjust event
     *
     * Recalculates start and end points and re-draws the stage
     */
    context.on('adjust.stage', function(x1, x2) {
      start = (x1 > 0) ? x1 : 0;
      end = (x2 < lines[0].length()) ? x2 : lines[0].length() -1;
      draw();
    });
    
    
    /**
     * Callback for context.toggle event
     *
     * Only redraw. Visiblity handled by line object
     */
    context.on('toggle.stage', function() {
      draw();
    });
        
  
    // Use d3 to get mouse co-ords
    d3.select('#' + canvasId).on('mousemove', function(e) {
      m = d3.mouse(this);
      px = ctx.getImageData(m[0], m[1], 1, 1).data;
      rgb = d3.rgb(px[0], px[1], px[2]);
      hex = rgb.toString();
      if (hex !== '#000000') {
        i = _.indexOf(colorRange, hex);
        if (i !== -1) {
          line = lines[i];
          x = Math.ceil(xScale.invert(m[0]));
          console.log(line.name() + ' - ' + line.valueAt(x));
        }
      }

    });
      
  }

  
  return stage;
}
QuandlismContext_.brush = function() {
  
  var context = this,
  height = height0 = Math.floor(context.h()*quandlism_brush.h),
  width = width0 = Math.floor(context.w()*quandlism_brush.w), 
  brushWidth = brushWidth0 = Math.ceil(width * 0.2), handleWidth = 10,
  start = start0 = Math.ceil(width*0.8),
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  canvas = null,
  ctx = null,
  lines = [],
  extent = [],
  dragging = false,
  stretching = false,
  stretchingHandle = 0,
  dragX = 0;
  
  
  function brush(selection) {

    lines = selection.datum();
    
    selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'brush');    
    selection.append('div').datum(lines).attr('id', 'x-axis-brush').attr('class', 'axis').call(context.axis());
    
    canvas = selection.select('.brush');
    
    ctx = canvas.node().getContext('2d');
    
    updateExtent();
      
    setScales();
        
    update();
        
    invertAdjust();
    
    function updateExtent() {
      exes = _.map(lines, function(line, j) {
        return line.extent();
      });    
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })];
    }
    
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
        line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, 0, lines[0].length(), 1);
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

    }
    
    function invertAdjust() {
      x1 = xScale.invert(start);
      x2 = xScale.invert(start + brushWidth);
      context.adjust(Math.ceil(x1), Math.ceil(x2));
    }
  
      
    
    
    /**
     * Binding
     */
    context.on('respond.brush', function() {
      
      height0 = height, width0 = width;
      height = context.h()*quandlism_brush.h, width = context.w()*quandlism_brush.w;
      brushWidth = Math.ceil(brushWidth/width0*width);
      start = Math.ceil(start/width0*width);
      start0 = Math.ceil(start0/width0*width);
      setScales();
      
    });
    
    context.on('toggle.brush', function() {
      updateExtent();
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
  width = context.w()*quandlism_xaxis.w, height = context.h()*quandlism_xaxis.h,
  scale = d3.time.scale().domain([0, length]).range([0, width]),
  axis_ = d3.svg.axis().scale(scale),
  active = false,
  lines = null,
  data,
  id;
  
  function axis(selection) {
    
    id = selection.attr('id');      
    lines = selection.datum();
    extent = [lines[0].dateAt(0), lines[0].dateAt((lines[0].length() -1))];
        
    parseDate = context.utility().parseDate();
        
    scale.domain([parseDate(extent[0]), parseDate(extent[1])]);
       
    axis_.tickFormat(d3.time.format('%b %d, %Y'));
       
    axis_.ticks(Math.floor(width / 150), 0, 0);
    scale.range([0, width]);
        
    function update() {      
      axis.remove();
      var g = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('transform', 'translate(0,27)')
          .call(axis_);
    }
    
    update();
    
    // Listen for resize
    context.on('respond.axis-'+id, function() {
      width = context.w()*quandlism_xaxis.w;
      axis_.ticks(Math.floor(width / 150), 0, 0);
      scale.range([0, width]);
      update();
      
    });
    
    // If the axis is active, it should respond to the brush event to update its access
    if (active) {
      context.on('adjust.axis-'+id, function(x1, x2) {        
        x2 = (x2 > (lines[0].length() -1)) ? lines[0].length()-1 : x2;
        x1 = (x1 < 0) ? 0 : x1;
        extent = [lines[0].dateAt(x1), lines[0].dateAt(x2)];
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
  
  axis.data = function(_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return axis;
  }
  
  axis.lines = function(_) {
    if (!arguments.length) {
      return lines;
    }
    lines = _;
    return axis;
  }
  
  return d3.rebind(axis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
}
QuandlismContext_.yaxis = function() {
  var context = this,
  height = Math.floor(context.h()*quandlism_yaxis.h), width = Math.floor(context.w()*quandlism_yaxis.w),
  scale = d3.scale.linear().range([height, 0]),
  axis_ = d3.svg.axis().scale(scale),
  lines = null,
  extent = null,
  sel = null,
  id;
  
  function axis(selection) {
  
    id = selection.attr('id');     
    sel = selection;
    
    sel.attr('style', 'width: ' + width + 'px; height: ' + height + 'px;');
    
    lines = selection.datum();
      
    end = lines[0].length() - 1;
    start = Math.floor(lines[0].length()*.80);

    axis_.ticks(5, 0, 0);
        
    function update() {   
          
      exes = _.map(lines, function(line, j) {
        return line.extent(start, end);
      });  
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]    
      scale.domain([extent[0], extent[1]]);
         
      axis.remove();
      
      var g = selection.append('svg')
        .append('g')
        .attr('transform', 'translate(' + width*.75 + ', 0)')
        .attr('height', height)
        .attr('width', width)
        .call(axis_)
        .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end");
    }
    
    update();
    
    // Listen for resize
    context.on('respond.y-axis-'+id, function() {
      width = context.w()*quandlism_yaxis.w, height = context.h()*quandlism_yaxis.h;
      sel.attr('style', 'width: ' + width + 'px; height: ' + height + 'px;');
      axis_.ticks(10, 0, 0);
      scale.range([height, 0]);
      update();
      
    });
    
    context.on('adjust.y-axis-'+id, function(x1, x2) {
      start = (x1 > 0) ? x1 : 0;
      end = (x2 < lines[0].length()) ? x2 : lines[0].length() -1;
      update();
    });
    
    context.on('toggle.y-axis-'+id, function() {
      update();
    });
      
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
  
  axis.lines = function(_) {
    if (!arguments.length) {
      return lines;
    }
    lines = _;
    return axis;
  }
  
  
  
  return d3.rebind(axis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
}
QuandlismContext_.legend = function() {
  var context = this,
  legend_ = null,
  lines = null;
  
  
  function legend(selection) {
    
    lines = selection.datum();
    
    legend_ = selection.selectAll('li').data(lines);
    
    legend_.enter()
      .append('li').attr('style', function(line) { return 'background-color: ' + context.utility().getColor(line.id()); })
      .append('a').attr('href', 'javascript:;').attr('data-line-id', function(line) { return line.id(); })
      .text(function(l) { return l.name() });
      
    legend_.exit().remove();
    
    selection.on('click', function(d, i) {
      evt = d3.event;
      evt.preventDefault();
      line_id = evt.target.getAttribute('data-line-id');
      vis = lines[line_id].toggle();
      context.toggle();
    });
    
  }
  
  
  
  return legend;
}
QuandlismContext_.utility = function() {
  
  var context = this;
  
  function utility() {}
  
  utility.dateFormat = function() {
    dateString = '';
    switch(context.frequency()) {
      case 'daily':
        dateString = '%Y-%m-%d';
        break;
      case 'weekly':
        dateString = '%Y-%m-%d';
        break;    
      case 'monthly':
        dateString = '%Y-%m-%d';
        break;
      case 'quarterly':
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
   * Get co-ordinates in the context of the canvas element, of the user click.
   * 
   * e - Browser mouse click event
   * c - The canvas element
   *
   * Returns an object with keys, x and y.
   */
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
  
  /**
   * Returns a hex colour code corresponding to the given index
   *
   * i - An integer index
   *
   * Returns a string representing a hex code
   */
  utility.getColor = function(i) {
     s = context.colorScale()
     return s(i);
  }
  
  
  return utility;
}

 })(this);