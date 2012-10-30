QuandlismContext_.axis = function() {
  var context = this,
  scale = d3.time.scale().domain([0, length]).range([0, context.sW() * quandlism_content_width]),
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
       
    axis_.ticks(Math.floor(context.sW() / 150), 0, 0);
    scale.range([0, context.sW() * quandlism_content_width]);
        
    function update() {      
      axis.remove();
      var g = selection.append('svg')
          .attr('width', context.sW() * quandlism_content_width)
          .attr('height', 100)
        .append('g')
          .attr('transform', 'translate(0,27)')
          .call(axis_);
    }
    
    update();
    
    // Listen for resize
    context.on('respond.axis-'+id, function() {
      axis_.ticks(Math.floor(context.sW() / 150), 0, 0);
      scale.range([0, context.sW() * quandlism_content_width]);
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