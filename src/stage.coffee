QuandlismContext_.stage = () ->
  context     = @
  canvasId    = null
  lines       = []
  width       = Math.floor context.w() * quandlism_stage.w
  height      = Math.floor context.h() * quandlism_stage.h
  xScale      = d3.scale.linear()
  xDateScale  = d3.time.scale()
  yScale      = d3.scale.linear()
  xAxis       = d3.svg.axis().orient('bottom').scale xDateScale
  yAxis       = d3.svg.axis().orient('left').scale yScale
  yAxisDOM    = null
  xAxisDOM    = null
  extent      = []
  xStart      = 0
  xEnd        = width
  threshold   = 10
  canvas      = null
  ctx         = null
  
  
  stage = (selection) =>
    # Get lines and generate unique ID for the stage
    lines = selection.datum()
    canvasId = "canvas-stage-#{++quandlism_id_ref}"
    

    
    # If no y axis is defined, create it
    if not yAxisDOM?
      yAxisDOM = selection.insert 'svg'
      yAxisDOM.attr 'class', 'y axis'
      yAxisDOM.attr 'id', "y-axis-#{canvasId}"
      yAxisDOM.attr 'width', context.w()*quandlism_yaxis.w
      yAxisDOM.attr 'height', context.h()*quandlism_yaxis.h

    # Create canvas element and get reference to drawing context
    canvas = selection.append 'canvas'
    canvas.attr 'width', width
    canvas.attr 'height', height
    canvas.attr 'class', 'stage'
    canvas.attr 'id', canvasId
    
    ctx = canvas.node().getContext '2d'
   

    if not xAxisDOM?
      xAxisDOM = selection.append 'svg'
      xAxisDOM.attr 'class', 'x axis'
      xAxisDOM.attr 'id', "x-axis-#{canvasId}"
      xAxisDOM.attr 'width', context.w()*quandlism_xaxis.w
      xAxisDOM.attr 'height', context.h()*quandlism_xaxis.h
      xAxisDOM.attr 'style', "margin-left: #{context.w()*quandlism_yaxis.w}"
      
    # Axis setups
    yAxis.tickSize 5, 3, 0
    yAxis.ticks Math.floor context.h()*quandlism_yaxis.h / 40
    xAxis.tickSize 5, 3, 0
    
    xAxis.ticks 5
    xAxis.tickFormat d3.time.format "%b %d, %Y"
    
    # Calculate the range and domain of the x and y scales
    setScales = () =>
      # Calculate the extent for the area between xStart and xEnd
      extent = context.utility().getExtent lines, xStart, xEnd
      parseDate = context.utility().parseDate lines[0].dateAt 0
      
      # Update the linear x and y scales with calculated extent
      yScale.domain [extent[0], extent[1]]
      yScale.range [(height - context.padding()), context.padding()]

      xScale.domain [xStart, xEnd]
      xScale.range [context.padding(), (width-context.padding())]
      xDateScale.domain [parseDate(lines[0].dateAt(xStart)), parseDate(lines[0].dateAt(xEnd))]
      xDateScale.range [context.padding(), (width-context.padding())]
   
      return
    
    # Draw axis
    drawAxis = () =>
      # Remove old yAxis and redraw
      yAxisDOM.selectAll('*').remove()
      yg = yAxisDOM.append 'g'
      yg.attr 'transform', "translate(#{context.w()*quandlism_yaxis.w-1}, 10)"
      yg.call yAxis
      
      xAxisDOM.selectAll('*').remove()
      xg = xAxisDOM.append 'g'
      xg.call xAxis
      
    # Draws the stage data
    draw = (lineId) =>
    
      drawAxis()
      
      # Clear canvas before drawing
      ctx.clearRect 0, 0, width, height
      
      # if lineId to highlight is not defined, set to an invalid index
      lineId = if lineId? then lineId else -1
      
      for line, j in lines
        # calculate the line width to use (if we are on lineId)
        lineWidth = if j is lineId then 3 else 1.5
        
        # If we are within the minimum threshold show points with line
        # If we are on a single data point, show only a point
        # Othwerwise, render a path
        if (xEnd - xStart <= threshold)
          line.drawPath context.utility().getColor(j), ctx, xScale, yScale, xStart, xEnd, lineWidth
          for i in [xStart..xEnd]
            line.drawPoint context.utility().getColor(j), ctx, xScale, yScale, i, 3
        else if xEnd is xStart
          line.drawPoint context.utility().getColor(j), ctx, xScale, yScale, xStart, 3
        else
          line.drawPath context.utility().getColor(j), ctx, xScale, yScale, xStart, xEnd, lineWidth
        
      return
      
    # Detects line hit
    # Analyzed color under the mouse cursor and try to match to a line
    #
    # m - The mouse position, in canvas space
    #
    # Returns false, or an object with keys x, color and line, if a match was found
    lineHit = (m) ->
      
      # Check for a direct match under cursor
      hex = context.utility().getPixelRGB m, ctx
      i = _.indexOf context.colorScale().range(), hex
      return {x: m[0], color: hex, line: lines[i] } if i isnt -1

      # If no match, check the immediate area for fuzzy matching
      hitMatrix = []
      for j in [m[0]-3..m[0]+3]
        for k in [m[1]-3..m[1]+3]
          if j isnt m[0] or k isnt m[1]
            hitMatrix.push [j, k]
            
      for n in [0..(hitMatrix.length-1)]
        hex = context.utility().getPixelRGB hitMatrix[n], ctx
        i = _.indexOf context.colorScale().range(), hex
        return {x: hitMatrix[n][0], color: hex, line: lines[i]} if i isnt -1
        
      false
      
    # Render the tooltip data, from a mouseover event on a line, and highlight the moused over point
    #
    # x     - The x index of the data point
    # line  - The line that was highlighted
    # hex   - The color
    # 
    # Returns null
    drawTooltip = (x, line, hex) ->
      $(context.domtooltip()).html "<span style='color: #{hex};'>#{line.name()}</span>: #{context.utility().formatNumberAsString line.valueAt x}  on #{line.dateAt x}"
      draw line.id()
      pointSize = if (xEnd - xStart <= threshold) then 5 else 3
      line.drawPoint hex, ctx, xScale, yScale, x, pointSize
      return
      
      
    # Remove toolitp data and graph highlighting
    clearTooltip = () ->
      $(context.domtooltip()).text ''
      draw()
      return
      
    # 
    # Intial draw. If there is a brush in the context, it will dispatch the adjust event and force the 
    # stage to draw. If there isn't, force the stage to draw
    #
    setScales() and draw() if not context.dombrush()
      
    # Callbacks / Event bindings
    # Listen for events dispatched from context, or listen for events in canvas
  
    # Respond to page resize
    # Resize, clear and re-draw
    context.on 'respond.stage', () ->
      ctx.clearRect 0, 0, width, height
      width = Math.floor context.w() * quandlism_stage.w
      height = Math.floor context.h() * quandlism_stage.h
      canvas.attr 'width', width
      canvas.attr 'height', height
      
      # Adjust y axis width
      yAxisDOM.attr 'width', Math.floor context.w()*quandlism_yaxis.w
      
      # Adjust x axis with and marign
      xAxisDOM.attr 'width', Math.floor context.w()*quandlism_xaxis.w
      xAxisDOM.attr 'style', "margin-left: #{context.w()*quandlism_yaxis.w}"
      
      setScales()
      draw()
      return
 
    # Respond to adjsut events from the brush
    context.on 'adjust.stage', (x1, x2) ->
      xStart = if x1 > 0 then x1 else 0
      xEnd = if lines[0].length() > x2 then x2 else lines[0].length()-1
      setScales()
      draw()
      return
      
    # Respond to toggle event by re-drawing
    context.on 'toggle.stage', () ->
      setScales()
      draw()
      return
      
    # Respond to refresh event. Update line data and re-draw
    context.on 'refresh.stage', () ->
      lines = selection.datum()
      # Only draw if there is no brush to dispatch the adjust event
      draw() if not context.dombrush()
      return
      
    # If the tooltip dom is defined, track mousemovement on stage for tooltip
    if context.domtooltip()?
      d3.select("##{canvasId}").on 'mousemove', (e) ->
        hit = lineHit d3.mouse @ 
        if hit isnt false then drawTooltip Math.round(xScale.invert(hit.x)), hit.line, hit.color else clearTooltip()
        return
 
    return
    
    

    
  # Expose attributes via getters/setters
  stage.canvasId = (_) =>
    if not _? then return canvasId
    canvasId = _
    stage
    
  stage.width = (_) =>
    if not _? then return width
    width = _
    stage
  
  stage.height = (_) =>
    if not _? then return height
    height = _
    stage
    
  stage.xScale = (_) =>
    if not _? then return xScale
    xScale = _
    stage
    
  stage.yScale = (_) =>
    if not _? then return yScale
    yScale = _
    stage

  stage.xEnd = (_) =>
    if not _? then return xEnd
    xEnd = _
    stage    

  stage.xStart = (_) =>
    if not _? then return xStart
    xStart = _
    stage        
    
  stage.threshold = (_) =>
    if not _? then return threshold
    threshold = _
    stage
    
  stage