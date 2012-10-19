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