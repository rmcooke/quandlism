QuandlismContext_.yaxis = function() {
  var context = this,
  height = Math.floor(context.h()*quandlism_yaxis.h), width = Math.floor(context.w()*quandlism_yaxis.w),
  scale = d3.scale.linear().range([height, 0]),
  axis_ = d3.svg.axis().scale(scale),
  lines = null,
  extent = null,
  sel = null,
  startPoint = null,
  endPoint = null,
  id;

  
  function axis(selection) {
  
    id = selection.attr('id');         
    selection.attr('style', 'width: ' + width + 'px; height: ' + height + 'px;');
    
    lines = selection.datum();

    axis_.ticks(5, 0, 0);
        
    function update() {   
      
      extent = context.utility().getExtent(lines, startPoint, endPoint);
      
      scale.domain([extent[0], extent[1]]);
      
      axis.remove();
      
      var g = selection.append('svg')
        .append('g')
        .attr('transform', 'translate(' + width*.75 + ', 0)')
        .attr('height', height)
        .attr('width', width)
        .call(axis_)
        .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end");
    }
    
    /**
     * Sets the end points of the data that will be displayed on the stage
     */
    function setEndPoints() {
      axis.endPoint(lines[0].length()-1);
      axis.startPoint(Math.floor(lines[0].length()*context.endPercentage()));
    }
    
    // Draw the y-axis
    setEndPoints();
    update();
    
    /** 
     * Event listeners
     */
     
     /**
      * Respond to resize.
      * Adjust the range and dimensions of the axis and redraw
      */
    context.on('respond.y-axis-'+id, function() {
      width = context.w()*quandlism_yaxis.w, height = context.h()*quandlism_yaxis.h;
      selection.attr('style', 'width: ' + width + 'px; height: ' + height + 'px;');
      scale.range([height, 0]);
      update();
      
    });
    
    /**
     * Responds to adjust event.
     * Recalculates the end points of the visible dataset and redraws the axis
     */
    context.on('adjust.y-axis-'+id, function(x1, x2) {
      axis.startPoint((x1 > 0) ? x1 : 0);
      axis.endPoint((x2 < lines[0].length()) ? x2 : lines[0].length() -1);
      update();
    });
    
    /**
     * Responds to toggle event.
     * Just redraw the axis. The line.extent() function will include/ignore any toggled columns.
     */
    context.on('toggle.y-axis-'+id, function() {
      update();
    });
    
    
    /**
     * Resonds to refresh event.
     * Calculates the original end points for the visible dataset and redraws
     */
    context.on('refresh.y-axis-'+id, function() {
      lines = selection.datum();
      setEndPoints();
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
  
  axis.startPoint = function(_) {
    if (!arguments.length) {
      return startPoint;
    }
    startPoint = _;
    return axis;
  }
  
  axis.endPoint = function(_) {
    if (!arguments.length) {
      return endPoint;
    }
    endPoint = _;
    return axis;
  }
  
  
  
  return d3.rebind(axis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
}