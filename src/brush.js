QuandlismContext_.brush = function() {
  
  var context = this,
  height = height0 = Math.floor(context.h()*quandlism_brush.h),
  width = width0 = Math.floor(context.w()*quandlism_brush.w), 
  brushWidth = brushWidth0 = Math.ceil(width * 0.2), 
  handleWidth = 10,
  start = start0 = Math.ceil(width*0.8),
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  canvas = null,
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
    
    // Append canvas and axis elements
    canvas = selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'brush');   
    axis = selection.append('div').datum(lines).attr('id', 'x-axis-brush').attr('class', 'axis').call(context.axis());
        
    // Get drawing context
    ctx = canvas.node().getContext('2d');
    
    updateExtent();
      
    setScales();
    
    triggerAdjustEvent();
        
    update();
        
    
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
     * Stop dragging
     */
    canvas.on('mouseup', function(e) {
      dragging = stretching = false;
      stretchingDir = 0;
      start0 = start;
      brushWidth0 = brushWidth;
    });
    
    /**
     * Calculate the movement
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
  
  return brush;

  
}