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
      yAxis = selection.append('div').datum(lines)
      yAxis.attr('height', context.h()).attr('width', context.w()).attr('class', 'axis y').attr('id', "y-axis-#{canvasId}")
      yAxis.call context.yaxis().orient('left')
       
    selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'stage').attr('id', canvasId)
    
    # Get reference to canvas selection and drawing context
    canvas = selection.select("##{canvasId}")
    ctx = canvas.node().getContext '2d'
    
    # If there is not x-axis defined, create one for the stage
    if not xAxis?
      xAxis = selection.append('div').datum(lines)
      xAxis.attr('width', context.w() * quandlism_xaxis.w).attr('height', context.h() * quandlism_xaxis.h).attr('class', 'x axis').attr('id', "x-axis-#{canvasId}")
      xAxis.call context.xaxis().active true
      


    
    # Set start and end indexes, if they have not already been set
    xStart = if not xStart then Math.floor lines[0].length() * context.endPercent() else xStart
    xEnd =  if not xEnd then lines[0].length() else xEnd

    
    # Draws the stage data
    draw = (lineId) =>
      
      # Calculate the extent for the area between xStart and xEnd
      extent = context.utility().getExtent(lines, xStart, xEnd)
      
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

    draw()  
      
    # Callbacks / Event bindings
  
    # Resond to page resize
    # Resize, clear and re-draw
    context.on 'respond.stage', () =>
      console.log "respond stage"
      ctx.clearRect 0, 0, width, height
      width = Math.floor context.w() * quandlism_stage.w
      height = Math.floor context.h() * quandlism_stage.h
      canvas.attr('width', width).attr('height', height)
      draw()
      return
 

    
    return
    
    

    
  # Expose attributes via getters/setters
  stage.padding = (_) =>
    if not _ then return padding
    padding = _
    stage
    
  stage.canvasId = (_) =>
    if not _ then return canvasId
    canvasId = _
    stage
    
  stage.width = (_) =>
    if not _ then return width
    width = _
    stage
  
  stage.height = (_) =>
    if not _ then return height
    height = _
    stage
    
  stage.xScale = (_) =>
    if not _ then return xScale
    xScale = _
    stage
    
  stage.yScale = (_) =>
    if not _ then return yScale
    yScale = _
    stage

  stage.xEnd = (_) =>
    if not _ then return xEnd
    xEnd = _
    stage    

  stage.xStart = (_) =>
    if not _ then return xStart
    xStart = _
    stage        
    
  stage.threshold = (_) =>
    if not _ then return threshold
    threshold = _
    stage
    
  stage