QuandlismContext_.brush = () ->
  context       = @
  height        = context.h() * quandlism_brush.h
  height0       = height
  width         = context.w() * quandlism_brush.w
  width0        = width
  brushWidth    = Math.ceil width * 0.2
  brushWidth0   = brushWidth
  handleWidth   = 10
  xStart        = width * context.endPercent()
  xStart0       = xStart
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
  strechLimit   = 6
  stretching    = false
  stretchLocked = false
  stretchLimit  = 6
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
      return
      
    # Update
    update = () =>
      clearCanvas()
      draw()
      drawBrush()
      return
      
    # Checks the number of dataset points that are going to be displayed. If below the stretching threshold
    # then lock contiued stretching
    checkStretchState = () =>
      x1 = Math.ceil xScale.invert xStart
      x2 = Math.ceil xScale.invert (xStart+brushWidth)
      stretchLocked = Math.abs (x2-x1) <= stretchLimit
      
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
      ctx.lineWidth = handleWidth
      ctx.strokeStyle = "#CFCFCF"
      ctx.moveTo xStart, 0
      ctx.lineTo xStart, height
      ctx.stroke()
      ctx.closePath()
      
      ctx.beginPath()
      ctx.lineWidth = handleWidth
      ctx.strokeStyle = "#CFCFCF"
      ctx.moveTo (xStart + brushWidth), 0
      ctx.lineTo (xStart + brushWidth), height
      ctx.stroke()
      ctx.closePath()
      return
      
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
      return
      
    # Respond to refresh event
    context.on 'refresh.brush', () ->
      lines = selection.datum()
      xStart = Math.ceil width*context.endPercent()
      xStart0 = xStart
      brushWidth = Math.ceil width*0.2
      brushWidth0 = brushWidth
      setScales()
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
      
      if m[0] >= xStart and m[0] <= (xStart + handleWidth)
        # If click on left handle
        stretching = true
        activeHandle = -1
      else if m[0] >= (xStart + brushWidth) and m[0] <= (xStart + brushWidth + handleWidth)
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
        if dragging
          xStart = xStart0 + (m[0]-touchPoint)
        else if stretching
          # Check stretchLocked value. Only allow stretching if it is to make the brushWidth larger
          dragDiff = m[0] - touchPoint
          if activeHandle is -1
            xStart = xStart0 + dragDiff
            brushWidth = brushWidth0 - dragDiff
            if dragDiff > 0
              # Get the data index of the current x value and the x value of the right handle before dragging started
              # The current index should always be <= strechLimit 
              # Reset values if necessary
              xCurr = Math.ceil xScale.invert m[0]
              xRightHandle = Math.ceil xScale.invert xStart0+brushWidth0
              if Math.abs (xRightHandle-xCurr) <= stretchLimit
                xStart = Math.floor xScale xRightHandle-stretchLimit
                brushWidth = Math.floor xScale stretchLimit
          else if activeHandle is 1
            brushWidth = brushWidth0 + dragDiff
            if dragDiff < 0
              xCurr = Math.ceil xScale.invert m[0]
              xLeftHandle = Math.ceil xScale.invert xStart0
              if Math.abs (xCurr-xLeftHandle) <= stretchLimit
                brushWidth = Math.floor xScale stretchLimit
          else
            throw("Error: Unknown stretching direction")
        
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
    
  
  brush
      