QuandlismContext_.yaxis = () ->
  context    = @
  width      = context.w() * quandlism_yaxis.w
  height     = context.h() * quandlism_yaxis.h
  scale      = d3.scale.linear().range [height, 0]
  axis_      = d3.svg.axis().scale scale
  lines      = []
  extent     = []
  xStart     = null
  xEnd       = null
  id         = null
  

  yaxis = (selection) =>
    id = selection.attr 'id'
    lines = selection.datum()
    
    # set ticks
    axis_.ticks Math.floor height / 50, 0, 0
    
    update = () =>
      extent = context.utility().getExtent lines, xStart, xEnd
      scale.domain [extent[0], extent[1]]
      yaxis.remove()
      
      g = selection.append 'svg'
      g.attr('width', width).attr('height', height)
      a = g.append 'g'
      a.attr('transform', "translate(#{width*0.75}, 0)")
      a.attr('width', width).attr('height', height)
      a.call(axis_)
      
    setEndPoints = () =>
      xEnd = lines[0].length()-1
      xStart = Math.floor lines[0].length() * context.endPercent()
  
    setEndPoints()
    update()
  
    # Event listeners and callbacks
  
    # Respond to resize of browser
    context.on "respond.y-axis-#{id}", () =>
      width = context.w() * quandlism_yaxis.w
      height = context.h() * quandlism_yaxis.h
      axis_.ticks Math.floor height / 50, 0, 0
      scale.range [height, 0]
      update()
      
    # Respond to adjust event from brush
    context.on "adjust.y-axis-#{id}}", (x1, x2) =>
      xStart = if x1 > 0 then x1 else 0
      xEnd = if x2 < lines[0].length() then x2 else lines[0].length()
      update()
      

    

    return
  yaxis.remove = (_) =>
    d3.select("##{id}").selectAll("svg").remove();
  
  return d3.rebind(yaxis, axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
