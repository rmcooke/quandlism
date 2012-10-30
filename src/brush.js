QuandlismContext_.brush = function() {
  
  var context = this,
  height = height0 = context.bH() * 0.2, 
  width = width0 = context.bW() * quandlism_content_width, brushWidth = brushWidth0 = Math.ceil(width * 0.2), handleWidth = 10,
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
      
    
    selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'brush');
    
    selection.append('div').datum(lines).attr('id', 'x-axis-brush').attr('class', 'axis').call(context.axis());
    
    canvas = selection.select('.brush');
    
    ctx = canvas.node().getContext('2d');
    
  
    exes = _.map(lines, function(line, j) {
      return line.extent();
    });  
        
    extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })];
      
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
        line.drawPath(colors[j], ctx, xScale, yScale, 0, lines[0].length());
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
      height = context.bH() * 0.2, width = context.bW() * quandlism_content_width;
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