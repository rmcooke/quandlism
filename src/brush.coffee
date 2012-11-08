QuandlismContext_.brush = () ->
  context      = @
  height       = context.h() * quandlism_brush.h
  height0      = height
  width        = context.w() * quandlism_brush.w
  width0       = width
  brushWidth   = Math.ceil width * 0.2
  brushWidth0  = brushWidth
  handleWidth  = 10
  xStart       = width * context.endPercent()
  xStart0      = xStart
  xScale       = d3.scale.linear()
  yScale       = d3.scale.linear()
  canvas       = null
  ctx          = null
  xAxis        = null
  canvasId     = null
  extent       = []
  lines        = []
  threshold    = 10
  dragging     = false
  stretching   = false
  activeHandle = 0
  touchPoint   = 0 



  brush = (selection) =>
    lines = selection.datum()
    canvasId = "canvas-brush-#{++quandlism_id_ref}"

    # append canvas and get reference to element and drawing context
    canvas = selection.append('canvas').attr('width', width).attr('height', height).attr('class', 'brush').attr('id', canvasId)
    ctx = canvas.node().getContext '2d'
    
    # if xAxis not defined, create it
    if not xAxis?
      xAxis = selection.append 'div'
      xAxis.datum lines
      xAxis.attr 'class', 'x axis'
      xAxis.attr 'width', context.w()*quandlism_xaxis.w
      xAxis.attr 'height', context.h()*quandlism_xaxis.h
      xAxis.attr 'id', "x-axis-#{canvasId}"
      xAxis.call context.xaxis()

    
    # Set domain and range for x and y scales
    setScales = () =>
      extent = context.utility().getExtent lines, null, null
      yScale.domain [extent[0], extent[1]]
      yScale.range [height, 0]
      xScale.domain [0, lines[0].length()-1]
      xScale.range [0, width]
        
    # Update
    update = () =>
      clearCanvas()
      draw()
      drawBrush()
      
    # Clear the drawing canvas
    clearCanvas = () =>
      ctx.clearRect 0, 0, width0, height0
      canvas.attr('width', width).attr('height', height)
 
    # Draw the paths and points
    draw = () =>
      showPoints = (lines[0].length() <= threshold)
      for line, j in lines
        line.drawPath context.utility().getColor(j), ctx, xScale, yScale, 0, lines[0].length(), 1
        line.drawPoint context.utility().getColor(j), ctx, xScale, yScale, j, 2 if showPoints

    # Draw the brush control
    drawBrush = () =>
      ctx.strokeStyle = 'rgba(207, 207, 207, 0.55)'
      ctx.beginPath()
      ctx.fillStyle = 'rgba(207, 207, 207, 0.55)'
      ctx.fillRect xStart, 0, brushWidth, height
      ctx.lineWidth = 1
      ctx.lineTo xStart, height
      ctx.closePath()
      
      ctx.beginPath()
      ctx.lineWidth = handleWidth
      ctx.strokeStyle = "#CFCFCF"
      ctx.strokeRect xStart, 0, brushWidth, height
      ctx.closePath()
      
    # Send the adjust event to the context
    dispatchAdjust = () =>
      x1 = xScale.invert xStart
      x2 = xScale.invert xStart + brushWidth
      context.adjust Math.ceil(x1), Math.ceil(x2)

    setScales()
    dispatchAdjust()
    
    # Set drawing interval
    setInterval update, 50

    # Event listners
  
    # Respond to resized browser by recalculating key points and redrawing
    context.on "respond.brush", () ->
      height0 = height
      width0 = width
      height = context.h()*quandlism_brush.h
      width = context.w()*quandlism_brush.w
      xStart = Math.ceil xStart/width0*width
      xStart0 = Math.ceil xStart0/width0*width
      setScales()
      
    # Respond to refresh event
    context.on 'refresh.brush', () ->
      lines = selection.datum()
      xStart = Math.ceil width*context.endPercent()
      xStart0 = xStart
      brushWidth = Math.ceil width*0.2
      brushWidth0 = brushWidth
      setScales()
      
      
    # Respond to toggle by re-setting extents to account for newly hidden or visible columns
    context.on "toggle.brush", () ->
      setScales()
      
    # Listen for mousedown event to track mouse clicks before dragging or stretching control
    canvas.on 'mousedown', (e) ->
      m = d3.mouse @
      
      if m[0] >= xStart and m[0] <= (xStart + handleWidth)
        # If click on left handle
        stretching = true
        activeHandle = -1
        touchPoint = m[0]
      else if m[0] >= (xStart + brushWidth) and m[0] <= (xStart + brushWidth + handleWidth)
        # If click on right handle
        stretching = true
        activeHandle = 1
        touchPoint = m[0]
      else if m[0] <= (brushWidth + xStart) and m[0] >= xStart
        # if dragging
        dragging = true
        touchPoint = m[0]
        
    # On mouseup save the new state of the control
    canvas.on 'mouseup', (e) ->
      dragging = false
      stretching = false
      activeHandle = 0
      xStart0 = xStart
      brushWidth0 = brushWidth
      
    canvas.on 'mousemove', (e) ->
      m = d3.mouse @
      
      if dragging or stretching
        if dragging
          xStart = xStart0 + (m[0] - touchPoint)
        else if stretching
          dragDiff = m[0] - touchPoint
          if activeHandle is -1
            xStart = xStart0 + dragDiff
            brushWidth = brushWidth0 - dragDiff
          else if activeHandle is 1
            brushWidth = brushWidth0 + dragDiff
          else
            throw("Error: Unknown stretchign direction")
        
        dispatchAdjust()


  brush.xAxis = (_) =>
    if not _? then return xAxis
    xAxis = _
    brush
    
  brush.threshold = (_) =>
    if not _? then return threshold
    threshold = _
    brush
    

    
  # set timeout for drawing
  
  brush
      