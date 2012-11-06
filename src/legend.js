QuandlismContext_.legend = function() {
  var context = this,
  legend_ = null,
  lines = null;
  
  
  function legend(selection) {
    
    lines = selection.datum();
    
    legend_ = selection.selectAll('li').data(lines);
    
    legend_.enter()
      .append('li').attr('style', function(line) { return 'background-color: ' + context.utility().getColor(line.id()); })
      .append('a').attr('href', 'javascript:;').attr('data-line-id', function(line) { return line.id(); })
      .text(function(l) { return l.name() });
      
    legend_.exit().remove();
    
    /**
     * Callback for refresh event
     * Set the lines variable for the new data
     */
    context.on('refresh.legend', function() {
      lines = selection.datum();
    });
    
    selection.on('click', function(d, i) {
      evt = d3.event;
      evt.preventDefault();
      line_id = evt.target.getAttribute('data-line-id');
      vis = lines[line_id].toggle();
      context.toggle();
    });
    
  }
  
  
  
  return legend;
}