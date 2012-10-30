QuandlismContext_.yaxis = function() {
  var context = this,
  scale = d3.scale.linear().range([context.width(), 0]),
  axis_ = d3.svg.axis().scale(scale),
  lines = null,
  extent = null,
  id;
  
  function axis(selection) {
  
    id = selection.attr('id');      
        
    end = lines[0].length() - 1;
    start = Math.floor(lines[0].length()*.80);
  
    axis_.ticks(5, 0, 0);
    scale.range([context.height(), 0]);
        
    function update() {   
      
      
      exes = _.map(lines, function(line, j) {
        return line.extent(start, end);
      });  
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]    
      scale.domain([extent[0], extent[1]]);
         
      axis.remove();
      var g = selection.append('svg')
        .append('g')
        .attr('transform', 'translate(20, 0)')
        .attr('class', 'y axis')
        .call(axis_)
        .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text(lines[0].name());
    }
    
    update();
    
    // Listen for resize
    context.on('respond.y-axis-'+id, function() {
    
      axis_.ticks(10, 0, 0);
      scale.range([context.height(), 0]);
      update();
      
    });
    
    context.on('adjust.y-axis-'+id, function(x1, x2) {
      start = (x1 > 0) ? x1 : 0;
      end = (x2 < lines[0].length()) ? x2 : lines[0].length() -1;
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