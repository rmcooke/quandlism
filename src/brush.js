QuandlismContext_.brush = function() {
  
  var context = this,
  height = context.height(), width = context.width(), brushHeight = height * 0.2
  xScale = d3.scale.linear(), 
  yScale = d3.scale.linear(),
  dragging = false,
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"],
  canvas = null,
  canvasContext = null,
  lines = [],
  extent = [];
  
  
  function brush(selection) {

    var self = this;
    lines = selection.datum();
    
    selection.append('canvas').attr('width', width).attr('height', brushHeight).attr('class', 'brush');
    
    canvas = selection.select('.brush');
    canvasContext = canvas.node().getContext('2d');
    
    exes = _.map(lines, function(line, j) {
      return line.extent();
    });  
    
    extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })];



    draw();
    
    function draw() {
      
      // Draw viewer box
      rectX = Math.floor(width*0.75);
      rectY = 0;
    
      canvasContext.fillStyle = 'rgba(0, 0, 0, 0.25)';
      canvasContext.fillRect(rectX, 0, width - rectX, height);
    
      
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([brushHeight, 0 ]);
    
      xScale.domain([0, lines[0].length()]);
      xScale.range([0, width]);
      
      // Draw lines
      _.each(lines, function(line, j) {
        context.utility().drawPath(line, colors[j], canvasContext, xScale, yScale);
      });
    
      
    }
    
    context.on('respond.brush', function(width_, height_) {
      canvas.attr('width', width_).attr('height', height_);
      canvasContext.clearRect(0, 0, width, height);
      width = width_, height = height_, brushHeight = height * 0.2;
      
      draw();
      
    });
      
  }
  
  
  return brush
  
  
  
}