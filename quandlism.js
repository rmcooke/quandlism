(function(exports) { 
var quandlism = exports.quandlism = { version: '0.1.0' };
var quandlism_id = 0;




quandlism.context = function() {
  var context = new QuandlismContext(),
  frequency = 'daily',
  trans = 'none',
  w = h = null,
  dom = null, domlegend = null, domtooltip = null, dombrush = null, domstage = null,
  event = d3.dispatch('respond', 'adjust', 'toggle', 'refresh'),
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
   * 
   * lines - The line objects
   *
   * Returns self
   */
  context.quandlism = function(lines) {
    if (domstage) {
      d3.select(domstage).datum(lines).call(this.stage());
    }
    if (dombrush) {
      d3.select(dombrush).datum(lines).call(this.brush());
    }
    if (domlegend) {
      d3.select(domlegend).datum(lines).call(this.legend());
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
var quandlism_id_ref = 0;
var quandlism_stage = {w: 0.85, h: 0.70};
var quandlism_brush = {w: 0.85, h: 0.05};
var quandlism_xaxis = {w: 0.85, h: 0.15};
var quandlism_yaxis = {w: 0.10, h: 0.70};
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
  * radius - The radius of the circle
  */
  line.drawPoint = function(color, ctx, xS, yS, index, radius) {
   if (this.visible()) {
     ctx.beginPath();
     ctx.arc(xS(index), yS(this.valueAt(index)), radius, 0, Math.PI*2, true);
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
      if (_.isUndefined(val) || _.isNull(val)) {
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
  canvasId,
  width = Math.floor(context.w()*quandlism_stage.w), 
  height = Math.floor(context.h()*quandlism_stage.h),
  canvasPadding = 10,
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  selection = null,
  threshold = 10,
  extent = null,
  canvas = null,
  ctx = null,
  colorRange = [],
  start = null, 
  end = null,
  xAxis = null,
  yAxis = null;
  
  
  
  function stage(selection) {
    
    // Extract line data    
    lines = selection.datum();
    canvasId = 'canvas-stage-' + (++quandlism_id_ref);
    
    // Append y-axis and render
    if (!yAxis) {
      yAxis = selection
      .append('div').datum(lines)
        .attr('width', context.w()*quandlism_yaxis.w)
        .attr('height', context.h()*quandlism_yaxis.h)
        .attr('class', 'y axis')
        .attr('id', 'y-axis-' + canvasId)
        .call(context.yaxis().active(true).orient('left'));
    }
    // Generate canvas ID and append the canvas element for drawing the stage
    selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'stage').attr('id', canvasId);
    
    // Append x-axis and render
    if (!xAxis) {
      xAxis = selection.append('div')
        .datum(lines)
        .attr('width', context.w()*quandlism_xaxis.w)
        .attr('height', context.h()*quandlism_xaxis.h)
        .attr('class', 'x axis')
        .attr('id', 'x-axis-' + canvasId)
        .call(context.axis().active(true));
    }
    
    // Get references to canvas and canvas context for drawing
    canvas = selection.select('#' + canvasId);
    ctx = canvas.node().getContext('2d');
    
    // Calculate initial start / end points, if they aren't set already
    if (!end) {
      end = lines[0].length();
    }
    if (!start) {
      start = Math.floor(lines[0].length()*context.endPercentage());
    }

    // Draw the stage
    draw();
     
    // After drawing the first time, save the computed color range for easy look up later!
    colorRange = context.colorScale().range();

    /**
     * Refresh the stage. Called when frequency or transformation is changed.
     * Update lines and start and end date
     */
    function refresh() {
      lines = selection.datum();
      end = lines[0].length();
      start = Math.floor(lines[0].length()*context.endPercentage());
      draw();
    }

    /**
     * Draws the stage
     * Calculates extents, given the start and end, adjusts the axis domain/ranges and draws the path
     *
     * lineId - The id of the line that should be highlighted when the stage is drawn
     */
    function draw(lineId) {

      exes = _.map(lines, function(line, j) {
        return line.extent(start, end);
      });  
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]
      // For single points, edit extent so circle is not drawn at the corner
   
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([(height - canvasPadding), canvasPadding]);
    
      xScale.domain([start, end]);
      xScale.range([canvasPadding, (width - canvasPadding)]);
      
      ctx.clearRect(0, 0, width, height);

      
      // If lineId is not specified, set it as an invalid index
      lineId = (_.isUndefined(lineId)) ? -1 : lineId;
      
      _.each(lines, function(line, j) {   
        // If we are drawing the line corresponding to a line that should be highlighted, increase the width
        lineWidth = (j == lineId) ? 3 : 1.5
        if ((end - start) <= threshold) {
          // If number of points under the threshold are being drawn, render the invidual points
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, start, end, lineWidth);
          _.each(_.range(start, end + 1), function(p) {
            line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, p, 3);
          });
        }     
        else if (start == end) {
          // If drawing a single point, just render the point
          line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, start, 3);
        } else {
          // Otherwise, draw the path
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, start, end, lineWidth);
        }
      });
      
    }
    
    /**
     * Shows tooltip data for the mouseover event.
     *
     * line - The active line object that was moused over.
     * x - The data index that will be highlighted
     * hex - The color of the line
     */
    function showTooltip(line, x, hex) {
      $(context.domtooltip()).html('<span style="color: ' + hex + ';">' + line.name() + '</span> : ' + line.valueAt(x) + '');    
      draw(line.id());
      line.drawPoint(hex, ctx, xScale, yScale, x, ((end - start) <= threshold) ? 5: 3);
    }
    
    /**
     * Removes content from the tooltip element
     */
    function clearTooltip() {
      $(context.domtooltip()).text('');
    }
    
    /**
     * Given the mouse location, check the coordinates, and the immediate area around the coordinates
     * for a line
     *
     * m - An array with 2 elements, representing the x and y coordinates (in canvas space), of the mouse location
     *
     * Returns false if there was no line hit, or the index of the line
     */
    function lineHit(m) {

      hex = context.utility().getPixelRGB(m, ctx);
      
      i = _.indexOf(context.colorScale().range(), hex);
      if (i !== -1) {
        return {x: m[0], color: hex, line: lines[i]};
      }
      
      // Genreate matrix of points to analyze      
      hitMatrix = [];
      for (j = (m[0]-3); j <= (m[0]+3); j++) {
        for (k = (m[1]-3); k <= (m[1]+3); k++) {
          if (j != m[0] || k != m[1]) {
            hitMatrix.push([j, k]);
          }
        }
      }
      
      for (n = 0; n < hitMatrix.length; n++) {
        hex = context.utility().getPixelRGB(hitMatrix[n], ctx);
        i = _.indexOf(context.colorScale().range(), hex);
        if (i !== -1) {
          return {x: hitMatrix[n][0], color: hex, line: lines[i]};
        }
      }
      
      return false;
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
        
    /**
     * Callback for context.refresh event
     *
     * Update line data and re-draw
     */
     context.on('refresh.stage', function() {
       refresh();
     });
  
    /**
     * If tooltip dom is defined, track mousemovement on stage to render tooltip 
     */
    if (!_.isUndefined(context.domtooltip())) {
      d3.select('#' + canvasId).on('mousemove', function(e) {
        
        hit = lineHit(d3.mouse(this));

        if (hit !== false) {
          showTooltip(hit.line, Math.round(xScale.invert(hit.x)), hit.color);
        } else {
          clearTooltip();
          draw();
        }

      });
    }
    
      
    /**
     * Getter/setters
     */
    stage.threshold = function(_) {
      if (!arguments.length) {
        return threshold;
      }
      threshold = _;
      return stage;
    }
    
    stage.canvasPadding = function(_) {
      if (!arguments.length) {
        return canvasPadding;
      }
      canvasPadding = _;
      return stage;
    }
    
    stage.end = function(_) {
      if (!arguments.length) {
        return end;
      }
      end = _;
      return stage;
    }
    
    stage.start = function(_) {
      if (!arguments.length) {
        return start;
      }
      start = _;
      return stage;
    }
    
    stage.xAxis = function(_) {
      if (!arguments.length) {
        return xAxis;
      }
      xAxis = _;
      return stage;
    }
    
    stage.yAxis = function(_) {
      if (!arguments.length) {
        return yAxis;
      }
      yAxis = _;
      return stage;
    }
      
  }

  
  return stage;
}
QuandlismContext_.brush = function() {
  
  var context = this,
  height = height0 = Math.floor(context.h()*quandlism_brush.h),
  width = width0 = Math.floor(context.w()*quandlism_brush.w), 
  brushWidth = brushWidth0 = Math.ceil(width * 0.2), 
  handleWidth = 10,
  start = start0 = Math.ceil(width*context.endPercentage()),
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  canvas = null,
  canvasId,
  xAxis = null,
  ctx = null,
  lines = [],
  extent = [],
  dragging = false,
  stretching = false,
  activeHandle = 0,
  threshold = 10,
  dragX = 0;
  
  
  function brush(selection) {

    // Extract line data from selection
    lines = selection.datum();
  
    // Generate canvas id
    canvasId = 'canvas-brush-' + (++quandlism_id_ref);
  
    // Append canvas and axis elements
    selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'brush').attr('id', canvasId);

    // If x Axis is not defined, append it
    if (!xAxis) {
      xAxis = selection.append('div')
        .datum(lines)
        .attr('class', 'x axis')
        .attr('width', context.w()*quandlism_xaxis.w)
        .attr('height', context.h()*quandlism_xaxis.h)
        .attr('id', 'x-axis-' + canvasId)
        .call(context.axis()); 
    } 
        
    // Get drawing context
    canvas = selection.select('#' + canvasId);
    ctx = canvas.node().getContext('2d');
    
    updateExtent();
      
    setScales();
    
    triggerAdjustEvent();
        
    update();
        
    /**
     * Calculates and saves the total extent values for the visible lines in the brush
     *
     */
    function updateExtent() {
      exes = _.map(lines, function(line, j) {
        return line.extent();
      });    
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })];
    }
    
    /**
     * Set the domain and range for the x and y axes of the brush
     */
    function setScales() {
      // Scales should only be set on construction and resize   
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([height, 0 ]);
    
      xScale.domain([0, (lines[0].length() -1)]);
      xScale.range([0, width]);
    }
    
    /**
     * Drawing functions
     * This is called via the interval.
     */
    function update() {
      clearCanvas();      
      draw();
      drawBrush();
    }
    
    function refresh() {      
      lines = selection.datum();
      updateExtent();
      setScales();
      update();
      
    }
    
    
    /**
     * Clears the context and adjust the size of the HTML element, if browser has been resized
     */ 
    function clearCanvas() {
      ctx.clearRect(0, 0, width0, height0);
      canvas.attr('width', width).attr('height', height);
    }
    
    /**
     * Draws the lines and points on the brush canvas.
     */
    function draw() {   
      // Draw lines
      st = 0;
      en = lines[0].length();
      showPoints = ((en - st) <= threshold);
      
      _.each(lines, function(line, j) {
        line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, st, en, 1);
        if (showPoints) {
          _.each(_.range(st, en), function(p) {
            line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, p, 2);
          });  
        }
      });
    }
    
    
    /**
     * Draws the brush control on the brush canvas.
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
    
    /**
     * Calculates the x1 and x2 values (the start and end of the brush control) and sends those
     * values to the stage via the context.adjust() event
     */
    function triggerAdjustEvent() {
      x1 = xScale.invert(start);
      x2 = xScale.invert(start + brushWidth);
      context.adjust(Math.ceil(x1), Math.ceil(x2));
    }
   
    
    /**
     * Callbacks
     */
  
    /**
     * Resonds to respond event from context.  
     * Re-calculate width, height, brushHeight and start values. Calls method to update y and x scales.
     */
    context.on('respond.brush', function() {  
      height0 = height, width0 = width;
      height = context.h()*quandlism_brush.h, width = context.w()*quandlism_brush.w;
      brushWidth = Math.ceil(brushWidth/width0*width);
      start = Math.ceil(start/width0*width);
      start0 = Math.ceil(start0/width0*width);
      setScales();    
    });
    
    /**
     * Responds to toggle event from context
     * Update extent (to ignore invisible lines) and updates x and y scales
     */
    context.on('toggle.brush', function() {
      updateExtent();
      setScales();
    });
    
    
    /**
     * Responds to refresh event. Updates lines and start/end points and redraws
     */
    context.on('refresh.brush', function() {
      refresh();
    });
    
    /**
     * Event Bindings
     */
     
    /**
     * On mousedown
     * Determines if click was in dragging area, or on stretching handle
     * Save click location for stretch and drag actions
     */
    canvas.on('mousedown', function(e) {
      m = d3.mouse(this);
      if (m[0] >= start && m[0] <= start + handleWidth) {
        stretching = true;
        stretchingHandle = -1;
        dragX = m[0];
      } else if (m[0] >= (start + brushWidth) && m[0] <= (start + brushWidth + handleWidth)) {
        stretching = true;
        stretchingHandle = 1;
        dragX = m[0];
      }
      else if (m[0] <= (brushWidth + start) && m[0] >= start) {
        dragging = true;
        dragX = m[0];
      }
    });
    
    /**
     * On mouseup
     * Sets brush in non-dragging, non-stretching state and erases any stored value for the stretching direction.
     * Sets new start and brush width values.
     */
    canvas.on('mouseup', function(e) {
      dragging = stretching = false;
      stretchingDir = 0;
      start0 = start;
      brushWidth0 = brushWidth;
    });
    
    /**
     * On mousemove
     * Given mouse location and state (dragging or stretching), calculates the new x-coordinates 
     * for the start and end of the brush control.
     */
    canvas.on('mousemove', function(e) {
      
      m = d3.mouse(this);
        
      if (dragging || stretching) {
        if (dragging) {
          dragDiff = m[0] - dragX;
          start = start0 + dragDiff;
        }
        else if (stretching) { 
          dragDiff = m[0] - dragX;
          if (stretchingHandle == -1) {
            start = start0 + dragDiff;
            brushWidth = brushWidth0 - dragDiff;
          } else if (stretchingHandle == 1) {
            brushWidth = brushWidth0 + dragDiff;
          } else {
            throw('Error: Which direction?');
          }
        }
        
        triggerAdjustEvent();
      }
      
    });
    
    setInterval(update, 50);
      
  }
  
  /**
   * Getters and setters
   */
  brush.xAxis = function(_) {
    if (!arguments.length) {
      return xAxis;
    }
    xAxis = _;
    return brush;
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
        
    parseDate = context.utility().parseDate(lines[0].dateAt(0));
        
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
    
    /**
     * Callback for refresh event
     * Set the lines variable for the new data. No need to re-render elements.
     */
    context.on('refresh.legend', function() {
      lines = selection.datum();
    });
    
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
  
  /**
   * Returns a string that can be parsed in the same format as the dates in the active graph.
   * The number of - present indicate one of two date formats available.
   * date - An example date
   *
   * Returns a string representing the date format
   */
  utility.dateFormat = function(date) {
    dateString = '';
    hyphenCount = date.split('-').length - 1;
    
    switch(hyphenCount) {
      case -1:
        dateString = '%Y';
        break;
      case 2:
        dateString = '%Y-%m-%d'
        break;
      default:
        throw("Unknown date format: " + hyphenCount + date);
    }
    return dateString;

  }
  
  /**
   * Create an array of line objects
   *
   * data - The raw data returned from the Quandl API
   *
   * Returns an array of objects 
   */
  utility.createLines = function(data) {
    keys = _.without(data.columns, _.first(data.columns));
    lines =  _.map(keys, function(key, i) {
      return context.line({
        name: key,
        values: _.map(data.data, function(d) {
          return { date: d[0], num: +d[(i+1)] }
        })
      });
    }); 
    return lines;
  }
  
  /**
   * Parses the input date into a readable format for D3
   * String format is a function of the datasets frequency parameter
   *
   * date - A date to be parsed
   *
   * Return a time formatter
   */
  utility.parseDate = function(date) {
    dateString = this.dateFormat(date);
    return d3.time.format(dateString).parse;
  }
  
  /**
   * Given the coordinates of a point on a canvas element, return the pixel data
   *
   * m - An array with two elements, representing the x and y coordinates
   * ctx - The canvas element drawing context
   *
   * Return an RGB color hex
   */
  utility.getPixelRGB = function(m, ctx) {
    px = ctx.getImageData(m[0], m[1], 1, 1).data;
    rgb = d3.rgb(px[0], px[1], px[2]);
    return rgb.toString();
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