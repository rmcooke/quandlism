QuandlismContext_.brush = () ->
  context       = @
  height        = context.h() * quandlism_brush.h
  height0       = height
  width         = context.w() * quandlism_brush.w
  width0        = width
  brushWidth    = null
  brushWidth0   = null
  handleWidth   = 10
  xStart        = null
  xStart0       = null
  xScale        = d3.scale.linear()
  yScale        = d3.scale.linear()
  canvas        = null
  ctx           = null
  xAxis         = null
  canvasId      = null
  extent        = []
  lines         = []
  threshold     = 10
  dragging      = false
  dragEnabled   = true
  stretching    = false
  stretchLimit  = 6
  stretchMin    = 0
  activeHandle  = 0
  touchPoint    = null
  



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
      
      # Set the minimum brush size when scale is calculated
      stretchMin = Math.floor xScale stretchLimit
      return
    
    # Calculate initial values for xStart and brushWidth
    setBrushValues = () =>
      xStart = xScale context.startPoint()*lines[0].length()
      xStart0 = xStart
      brushWidth = width - xStart
      brushWidth0 = brushWidth
      if brushWidth < stretchMin
        brushWidth = stretchMin
        brushWidth0 = brushWidth
        xStart = width - brushWidth
        xStart0 = xStart
      return
      
    # Update
    update = () =>
      clearCanvas()
      draw()
      drawBrush()
      return
      
    # Clear the drawing canvas
    clearCanvas = () =>
      ctx.clearRect 0, 0, width0, height0
      canvas.attr('width', width).attr('height', height)
      return
      
    # Draw the paths and points
    draw = () =>
      showPoints = (lines[0].length() <= threshold)
      for line, j in lines
        line.drawPath context.utility().getColor(j), ctx, xScale, yScale, 0, lines[0].length(), 1
        line.drawPoint context.utility().getColor(j), ctx, xScale, yScale, j, 2 if showPoints
      return
      
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
      ctx.fillStyle = '#CFCFCF'
      ctx.fillRect xStart-handleWidth, 0, handleWidth, height
      ctx.closePath()
      
      ctx.beginPath()
      ctx.fillStyle = '#CFCFCF'
      ctx.fillRect xStart + brushWidth, 0, handleWidth, height
      ctx.closePath()
      return
      
    # If the number of points in the dataset is less than stretchLimit then do not allow
    # user to re-size the area
    checkDragState = () =>
      if (lines[0].length()-1) <= stretchLimit
        xStart = 0
        brushWidth0 = width
        brushWidth = width
        dragEnabled = false
      else
        dragEnabled = true
        
    # Send the adjust event to the context
    dispatchAdjust = () =>
      x1 = xScale.invert xStart
      x2 = xScale.invert xStart + brushWidth
      context.adjust Math.ceil(x1), Math.ceil(x2)
      return
      
    # Reset the state of the brush
    resetState = () =>
      dragging = false
      stretching = false
      activeHandle = 0
      xStart0 = xStart
      brushWidth0 = brushWidth
      return
      
    setScales()
    checkDragState()
    setBrushValues() if dragEnabled
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
      xStart = xStart/width0*width
      xStart0 = xStart0/width0*width
      brushWidth = brushWidth/width0*width
      brushWidth0 = brushWidth
      setScales()
      return
      
    # Respond to refresh event
    context.on 'refresh.brush', () ->
      lines = selection.datum()
      setScales()
      checkDragState()
      # If dragging is allowed, get the start and width of the brush, otherwise, the brush should fill the entire area
      setBrushValues() if dragEnabled
      dispatchAdjust()      
      return
      
      
    # Respond to toggle by re-setting extents to account for newly hidden or visible columns
    context.on "toggle.brush", () ->
      setScales()
      return
      
    # Listen for mousedown event to track mouse clicks before dragging or stretching control
    canvas.on 'mousedown', (e) ->
      d3.event.preventDefault()
      m = d3.mouse @
      touchPoint = m[0]
      
      if m[0] >= (xStart-handleWidth) and m[0] < (xStart)
        # If click on left handle
        stretching = true
        activeHandle = -1
      else if m[0] > (xStart + brushWidth) and m[0] <= (xStart + brushWidth + handleWidth)
        # If click on right handle
        stretching = true
        activeHandle = 1
      else if m[0] <= (brushWidth + xStart) and m[0] >= xStart
        # if dragging
        dragging = true
      return
        
    # On mouseup save the new state of the control
    canvas.on 'mouseup', (e) ->
      resetState()
      return
      
    # Detect movement off of the canvas. Reset state
    canvas.on 'mouseout', (e) ->
      resetState()  
      return
      
    # Calculate various points for animating dragging and stretching
    canvas.on 'mousemove', (e) ->
      m = d3.mouse @
      if dragging or stretching
        dragDiff = m[0]-touchPoint
        if dragging and dragEnabled
          xStart = xStart0 + dragDiff
        else if stretching
          # Calculate new brushWidth and xStart values, ensuring the the brush does not have a width less than stretchMin
          throw "Error: Unknown stretching direction" if activeHandle not in [0, -1, 1]
          brushWidth = if activeHandle is -1 then brushWidth0 - dragDiff else brushWidth0 + dragDiff
          xStart = xStart0 + dragDiff if activeHandle is -1
          if brushWidth <= stretchMin
            xStart = xStart + (brushWidth-stretchMin) if activeHandle is -1
            brushWidth = stretchMin
        
        dispatchAdjust()

      return

  # Geters and setters
  
  brush.xAxis = (_) =>
    if not _? then return xAxis
    xAxis = _
    brush
    
  brush.threshold = (_) =>
    if not _? then return threshold
    threshold = _
    brush
    
  brush.stretchLimit = (_) =>
    if not _? then return stretchLimit
    stretchLimit = _
    brush
    
  brush.handleWidth = (_) =>
    if not _? then return handleWidth
    handleWidth = _
    brush
  
  brush
      