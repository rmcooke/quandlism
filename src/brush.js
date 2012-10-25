QuandlismContext_.brush = function() {
  
  var context = this,
  height = height0 = context.height() * 0.1, 
  width = width0 = context.width(), brushWidth = brushWidth0 = Math.ceil(width * 0.2), 
  start = start0 = Math.ceil(width*0.7),
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  dragging = false,
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"],
  canvas = null,
  canvasContext = null,
  lines = [],
  extent = [],
  dragging = false,
  stretching = false,
  stretchingHandle = '',
  dragX = 0;
  
  
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
         
      canvasContext.fillStyle = 'rgba(207, 207, 207, 0.55)';
      canvasContext.fillRect(start, 0, brushWidth, height);
      
      canvasContext.fillStyle = '#CFCFCF';
      canvasContext.fillRect(start, 0, 10, height);
      canvasContext.fillRect(start + brushWidth - 10, 0, 10, height);      
   
    }
      
    
    
    /**
     * Binding
     */
    context.on('respond.brush', function() {
      
      height0 = height, width0 = width;
      height = context.height() * 0.1, width = context.width();
      brushWidth = brushWidth/width0*width;
      start = start/width0*width;
      start0 = start0/width0*width;
      setScales();
      
    });
    
    /**
     * Check if mouse click occured on the brush
     */
    canvas.node().addEventListener('mousedown', function(e) {
      // Check if click was within handles
      // Left handl
      if (e.x <= start + 20 && e.x >= start) {
        stretching = true;
        stretchingHandle = 'left';
        this.className = 'resize';
        dragX = e.x;
      } else if (e.x >= (start + brushWidth - 20) && e.x <= (start + brushWidth)) {
        stretching = true;
        stretchingHandle = 'right';
        this.className = 'resize';
        dragX = e.x;
      } else if (e.x <= (brushWidth + start) && e.x >= start) {
        this.className = 'dragging';
        dragging = true;
        dragX = e.x;
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
      
      if (dragging || stretching) {
      
        if (dragging) {
          dragDiff = e.x - dragX;
          start = start0 + dragDiff;
        }

        else if (stretching) {
          
          dragDiff = e.x - dragX;
          
          if (stretchingHandle == 'left') {
            start = start0 + dragDiff;
            brushWidth = brushWidth0 - dragDiff;
          } else if (stretchingHandle == 'right') {
            brushWidth = brushWidth0 + dragDiff;
          } else {
            throw('Error');
          }
        }
        
        x1 = xScale.invert(start);
        x2 = xScale.invert(start + brushWidth);
        
        context.adjust(Math.ceil(x1), Math.ceil(x2));
      }
    });
    
    setInterval(update, 50);
      
  }
  

  

  
  
  return brush;

  
}