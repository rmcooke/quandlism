QuandlismContext_.axis = function() {
  var context = this,
  scale = d3.time.scale().domain([0, length]).range([0, context.width()]),
  axis_ = d3.svg.axis().scale(scale),
  data;
  
  function axis(selection) {
    var tick;
    
    data = selection.datum();
    
    start = data[0].values[0].date;
    endin = data[0].values[data[0].values.length - 1].date;
    scale.domain([new Date(2010, 01, 01), new Date(2012, 10, 01)]);
    axis_.ticks(6)
    axis_.tickFormat(d3.time.format('%b %d, %Y'));
        
    var g = selection.append('svg')
        .attr('width', context.width())
        .attr('height', 100)
      .append('g')
        .attr('transform', 'translate(0,27)')
        .call(axis_);
  }
  
  return d3.rebind(axis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
}