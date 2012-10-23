QuandlismContext_.brush = function() {
  
  var context = this,
  height = height0 = context.height() * 0.2, width = width0 = context.width(), brushWidth = Math.ceil(width * 0.2), start = start0 = Math.ceil(width*0.7),
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  dragging = false,
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"],
  canvas = null,
  canvasContext = null,
  lines = [],
  event = d3.dispatch('doBrush'),
  extent = [],
  dragging = false,
  dragX = 0,
  x1 = x2 = 0;
  
  
  function brush(selection) {

    var self = this;
    lines = selection.datum();
    
    selection.append('canvas').attr('width', width).attr('height', height).attr('id', 'brush');
    
    canvas = selection.select('#brush');
    canvasContext = canvas.node().getContext('2d');
    
  
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
    
      xScale.domain([0, lines[0].length()]);
      xScale.range([0, width]);
    }
    
    /**
     * Timeout function. Responds to drags!
     */
    function update() {
      // Canvas clear
      clearCanvas();
      // Draw
      
      draw();
      drawBrush();
    }
    
    
    
    /**
     * Clear the context
     */ 
    function clearCanvas() {
      canvas.attr('width', width).attr('height', height);
      canvasContext.clearRect(0, 0, width0, height0);
    }
    
    /**
     * Draw the lines 
     */
    function draw() {   
      // Draw lines
      _.each(lines, function(line, j) {
        context.utility().drawPath(line, colors[j], canvasContext, xScale, yScale, 0, lines[0].length());
      });
    }
    
    /**
     * Draw the brush
     */
    function drawBrush() {
      canvasContext.fillStyle = 'rgba(0, 0, 0, 0.25)';
      canvasContext.fillRect(start, 0, brushWidth, height);
    }
      
    
    
    /**
     * Binding
     */
    context.on('respond.brush', function(width_, height_) {
      
      height0 = height, width0 = width;
      height = height_ * 0.2, width = width_;
      brushWidth = Math.ceil(width*.2);
      start = start/width0*width;
      start0 = start0/width0*width;
      setScales();
      
    });
    
    /**
     * Check if mouse click occured on the brush
     */
    canvas.node().addEventListener('mousedown', function(e) {
      if (e.x <= (brushWidth + start) && e.x >= start) {
        dragging = true;
        dragX = e.x;
      }
    });
    
    /**
     * Stop dragging
     */
    canvas.node().addEventListener('mouseup', function(e) {
      dragging = false;
      start0 = start;
    });
    
    /**
     * Calculate the movement
     */
    canvas.node().addEventListener('mousemove', function(e) {
      if (dragging) {
        dragDiff = e.x - dragX;
        start = start0 + dragDiff;
        
        x1 = xScale.invert(start);
        x2 = xScale.invert(start + brushWidth);
        
        context.adjust(Math.ceil(x1), Math.ceil(x2));
      }
    });
    
    
    

    setInterval(update, 50);
      
  }
  

  

  
  
  return brush;

  
}