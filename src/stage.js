QuandlismContext_.stage = function() {
  var context = this,
  buffer = document.createElement('canavs')
  lines = [],
  width = buffer.width = context.width(), height = buffer.height = context.height(),
  focusHeight = height*0.8, brushHeight = height*0.2,
  xScale = d3.scale.linear(),
  yScaleFocus = d3.scale.linear(),
  yScaleBrush = d3.scale.linear(),
  extent = null,
  format = d3.format('.2s'),
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"];
  
  
  function stage(selection) {
    
    var self = this;
    lines = selection.datum();
    selection.append('canvas').attr('width', width).attr('height', focusHeight).attr('class', 'focus');
    selection.append('canvas').attr('width', width).attr('height', brushHeight).attr('class', 'brush');
    var canvasFocus = selection.select('.focus');
    var canvasBrush = selection.select('.brush');
    canvasFocus = canvasFocus.node().getContext('2d');
    canvasBrush = canvasBrush.node().getContext('2d');
    
    exes = _.map(lines, function(line, j) {
      return line.extent();
    });  
    
    max = d3.max(exes, function(m) { return m[1]; });
    min = d3.min(exes, function(m) { return m[0]; });
    
    // Set domain and range for x scale and y scale for focus and brush
    yScaleFocus.domain([min, max]); 
    yScaleFocus.range([focusHeight, 0 ]);
    yScaleBrush.domain([min, max]);
    yScaleBrush.range([brushHeight, 0]);
    
    xScale.domain([0, lines[0].length()]);
    xScale.range([0, width]);
    
    _.each(lines, function(line, j) {
      drawPath(xScale, yScaleFocus, line, canvasFocus, j);
      drawPath(xScale, yScaleBrush, line, canvasBrush, j);
    });
       
   /**
    * Draw path
    */
   function drawPath(xScale, yScale, line, c, colorInd) {
      c.beginPath();
      c.moveTo(xScale(0), yScale(line.valueAt(0)));
      for (i = 0; i < line.length(); i++) {
        c.lineTo(xScale(i), yScale(line.valueAt(i)));
      }  
      c.strokeStyle = colors[colorInd];
      c.stroke();
      c.closePath();
   }
   
   
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