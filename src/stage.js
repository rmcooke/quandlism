QuandlismContext_.stage = function() {
  var context = this,
  lines = [],
  buffer = document.createElement('canvas'),
  width = context.width(), height = context.height(),
  stageHeight = height * 0.8,
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  extent = null,
  canvas = null,
  canvasContext = null,
  format = d3.format('.2s'),
  colors = ["#08519c","#3182bd","#6baed6","#bdd7e7","#bae4b3","#74c476","#31a354","#006d2c"];
  
  
  function stage(selection) {
    
    var self = this;
    lines = selection.datum();
    selection.append('canvas').attr('width', width).attr('height', stageHeight).attr('class', 'stage');
    canvas = selection.select('.stage');
    canvasContext = canvas.node().getContext('2d');
    
    exes = _.map(lines, function(line, j) {
      return line.extent();
    });  
    extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]
    
    draw();
    
    function draw() {
      
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([stageHeight, 0 ]);
    
      xScale.domain([0, lines[0].length()]);
      xScale.range([0, width]);
      _.each(lines, function(line, j) {
        context.utility().drawPath(line, colors[j], canvasContext, xScale, yScale);
      });
    }
    
    context.on('respond.stage', function(width_, height_) {
      
      canvas.attr('width', width_).attr('height', height_);
      canvasContext.clearRect(0, 0, width, height);
      width = width_, height = height_, stageHeight = height * 0.8;
      
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