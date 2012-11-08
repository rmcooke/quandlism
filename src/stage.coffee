QuandlismContext_.stage = () ->
  context    = @
  canvasId   = null
  lines      = []
  width      = Math.floor context.w() * quandlism_stage.w
  height     = Math.floor context.h() * quandlism_stage.h
  xScale     = d3.scale.linear()
  yScale     = d3.scale.linear()
  xAxis      = null
  yAxis      = null
  padding    = 10
  extent     = []
  xStart     = null
  xEnd       = null
  threshold  = 10
  canvas     = null
  ctx        = null
  
  
  stage = (selection) =>
    # Get lines and generate unique ID for the stage
    lines = selection.datum()
    canvasId = "canvas-stage-#{++quandlism_id_ref}"
    
    # If no y axis is defined, create it
    if not yAxis?
      yAxis = selection.append 'div'
      yAxis.datum lines
      yAxis.attr 'height', context.h()*quandlism_yaxis.h
      yAxis.attr 'width', context.w()*quandlism_yaxis.w
      yAxis.attr 'class', 'axis y'
      yAxis.attr 'id', "y-axis-#{canvasId}"
      yAxis.call context.yaxis().orient('left')
       
    # Create canvas element and get reference to drawing context
    canvas = selection.append 'canvas'
    canvas.attr 'width', width
    canvas.attr 'height', height
    canvas.attr 'class', 'stage'
    canvas.attr 'id', canvasId
    
    ctx = canvas.node().getContext '2d'
    
    # If there is not x-axis defined, create one for the stage
    if not xAxis?
      xAxis = selection.append('div')
      xAxis.datum lines
      xAxis.attr 'width', context.w()*quandlism_xaxis.w
      xAxis.attr 'height', context.h()*quandlism_xaxis.h
      xAxis.attr 'class', 'x axis'
      xAxis.attr 'id', "x-axis-#{canvasId}"
      xAxis.call context.xaxis().active true
      

    # Set start and end indexes, if they have not already been set
    xStart = if not xStart then Math.floor lines[0].length() * context.endPercent() else xStart
    xEnd =  if not xEnd then lines[0].length() else xEnd

    
    # Draws the stage data
    draw = (lineId) =>
      
      # Calculate the extent for the area between xStart and xEnd
      extent = context.utility().getExtent lines, xStart, xEnd
      
      # Update the linear x and y scales with calculated extent
      yScale.domain [extent[0], extent[1]]
      yScale.range [(height - padding), padding]

      xScale.domain [xStart, xEnd]
      xScale.range [padding, (width - padding)]

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
      $(context.domtooltip()).html "<span style='color: #{hex};'>#{line.name()}</span>: #{line.valueAt(x)}"
      draw line.id()
      pointSize = if (xEnd - xStart <= threshold) then 5 else 3
      line.drawPoint hex, ctx, xScale, yScale, x, pointSize
      return
      
      
    # Remove toolitp data and graph highlighting
    clearTooltip = () ->
      $(context.domtooltip()).text ''
      draw()
      return

    draw()  
      
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
      draw()
      return
 
    # Respond to adjsut events from the brush
    context.on 'adjust.stage', (x1, x2) ->
      xStart = if x1 > 0 then x1 else 0
      xEnd = if lines[0].length() > 2 then x2 else lines[0].length()-1
      draw()
      return
      
    # Respond to toggle event by re-drawing
    context.on 'toggle.stage', () ->
      draw()
      return
      
    # Respond to refresh event. Update line data and re-draw
    context.on 'refresh.stage', () ->
      lines = selection.datum()
      xEnd = lines[0].length()
      xStart = Math.floor lines[0].length()*context.endPercent()
      draw()
      return
      
    # If the tooltip dom is defined, track mousemovement on stage for tooltip
    if context.domtooltip()?
      d3.select("##{canvasId}").on 'mousemove', (e) ->
        hit = lineHit d3.mouse @ 
        if hit isnt false then drawTooltip Math.round(xScale.invert(hit.x)), hit.line, hit.color else clearTooltip()
 
    return
    
    

    
  # Expose attributes via getters/setters
  stage.padding = (_) =>
    if not _? then return padding
    padding = _
    stage
    
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