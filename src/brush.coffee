QuandlismContext_.brush = () ->
  context       = @
  height        = Math.floor context.h() * quandlism_brush.h
  height0       = height
  width         = Math.floor context.w()-quandlism_yaxis_width
  width0        = width
  brushWidth    = null
  brushWidth0   = null
  handleWidth   = 10
  xStart        = null
  xStart0       = null
  xScale        = d3.time.scale()
  yScale        = d3.scale.linear()
  canvas        = null
  ctx           = null
  xAxis         = d3.svg.axis().orient('bottom').scale xScale
  xAxisDOM      = null
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
  cursorClasses = {move: 'move', resize: 'resize'}
  buffer        = document.createElement('canvas')
  useCache      = false


  brush = (selection) =>
    lines = selection.datum()
    canvasId = "canvas-brush-#{++quandlism_id_ref}" if not canvasId?

    selection.attr "style", "position: absolute; top: #{context.h()*(quandlism_stage.h+quandlism_xaxis.h)}px; left: #{quandlism_yaxis_width}px"
    # append canvas and get reference to element and drawing context
    canvas = selection.append('canvas')
    canvas.attr 'id', canvasId
    canvas.attr "style", "position: absolute; left: 0px; top: 0px"
    ctx = canvas.node().getContext '2d'
    
    # if xAxis not defined, create it

    if not xAxisDOM?
      xAxisDOM = selection.append 'svg'
      xAxisDOM.attr 'class', 'x axis'
      xAxisDOM.attr 'id', "x-axis-#{canvasId}"
      xAxisDOM.attr 'height', Math.floor context.h()*quandlism_xaxis.h
      xAxisDOM.attr 'width', Math.floor context.w()-quandlism_yaxis_width
      xAxisDOM.attr "style", "position: absolute; top: #{context.h()*quandlism_brush.h}px; left: 0px"
    
    # Setup xAxis
    xAxis.tickSize 5, 3, 0
    
    
    # Calculate the y and x scales. Sets the domain and ranges of the
    # scales and creates the x axis labelling functions
    # 
    # Returns null
    setScales = () =>
      extent = context.utility().getExtent lines, null, null    
      yScale.domain [extent[0], extent[1]]
      yScale.range [height-context.padding(), context.padding()]
      
      
      xScale.range [context.padding(), width-context.padding()]
      dates = lines[0].dates().reverse()
      xScale.domain [_.first(dates), _.last(dates)]

      # Set the minimum brush size when scale is calculated
      # stretchMin = Math.floor xScale stretchLimit
      strechMin = 20
      # Determine x Axis formatting
      xAxis.ticks 20
      # xAxis.tickFormat (d) =>
      #     date = new Date (lines[0].dateAt(d))
      #     "#{context.utility().getMonthName date.getUTCMonth()} #{date.getUTCDate()}, #{date.getUTCFullYear()}"
      #   
      return
    
    # Calculates variables needed for drawing the brush (start, width)
    # and re-calculates if the values are below the minimum allowed 
    #
    # Returns null
    setBrushValues = () =>
      xStart = xScale lines[0].dateAt(Math.floor context.startPoint()*lines[0].length())
      xStart0 = xStart
      brushWidth = width - xStart
      brushWidth0 = brushWidth
      if brushWidth < stretchMin
        brushWidth = stretchMin
        brushWidth0 = brushWidth
        xStart = width - brushWidth
        xStart0 = xStart
      return
      
    # Update function drives the brush element. This is called on invertal
    # Clears the canvas and draws the lines and control
    #
    # Returns null
    update = () =>
      clearCanvas()
      if useCache then drawFromCache() else draw()
      drawBrush()
      return
      
    # Wipes the drawing context of the canvas
    # Clears the width and height of the preivously drawn area and sets
    # the height and width of the DOM element to the new height and width
    #
    # Returns null
    clearCanvas = () =>
      ctx.clearRect 0, 0, width0, height0
      canvas.attr('width', width).attr('height', height)
      return
      
    # Removes the current xaxis, if it exists, and draws the xaxis by calling
    # the xAxis function on the SVG selction
    #
    # Returns null
    drawAxis = () =>
      xAxisDOM.selectAll('*').remove()
      xg = xAxisDOM.append 'g'
      xg.call xAxis
      return
       
    # Draws the path of each line of the dataset, and the points, if the dataset has few rows
    #
    # Returns null
    draw = () =>
      showPoints = (lines[0].length() <= threshold)
      for line, j in lines
        line.drawPath ctx, xScale, yScale, 0, lines[0].length(), 1, true
        line.drawPoint ctx, xScale, yScale, j, 2 if showPoints
      saveCanvasData()
      return
      
    # Don't redraw the brush. Just use the saved image
    drawFromCache = () =>
      ctx.drawImage buffer.canvas, 0, 0
      return
      
    # Save the canvas state as an image for easy re-drawing
    saveCanvasData = () =>
      useCache = true      
      buffer.setAttribute 'width', width
      buffer.setAttribute 'height', height
      buffer = buffer.getContext('2d')
      buffer.drawImage document.getElementById(canvasId), 0, 0
      return
    
    # Uses the xStart, handleWidth and brushWidth variables to draw the 
    # the brush control on the canvas context 
    #
    # Returns null
    drawBrush = () =>
      ctx.strokeStyle = 'rgba(237, 237, 237, 0.80)'
      ctx.beginPath()
      ctx.fillStyle = 'rgba(237, 237, 237, 0.80)'
      ctx.fillRect xStart, 0, brushWidth, height
      ctx.lineWidth = 1
      ctx.lineTo xStart, height
      ctx.closePath()
    
      ctx.beginPath()
      ctx.fillStyle = '#D9D9D9'
      ctx.fillRect xStart-handleWidth, 0, handleWidth, height
      ctx.closePath()
      
      ctx.beginPath()
      ctx.fillStyle = '#D9D9D9'
      ctx.fillRect xStart + brushWidth, 0, handleWidth, height
      ctx.closePath()
      return
      
    # Determines if the there are enough points that in the dataset
    # to allow dragging. If not, set the start and width of the brush
    # to fill the entire canvas context
    #
    # Returns null
    checkDragState = () =>
      if (lines[0].length()-1) <= stretchLimit
        xStart = 0
        brushWidth0 = width
        brushWidth = width
        dragEnabled = false
      else
        dragEnabled = true
        
    # Resets the buffer element and sets useCache to be false
    #
    removeCache = () =>
      buffer = document.createElement('canvas')
      useCache = false
      return
        
    # Calculates the start and end points of the brushWidth and
    # triggers the context.adjust event with those parameters
    #
    # Returns null
    dispatchAdjust = () =>
      x1 = xScale.invert xStart
      x2 = xScale.invert xStart + brushWidth
      context.adjust Math.ceil(x1), Math.ceil(x2)
      return
      
    # Resets the state of the brush control
    # Sets dragging and stretching to to false and saves the xStart and brushWidth values
    #
    # Returns null
    resetState = () =>
      dragging = false
      stretching = false
      activeHandle = 0
      xStart0 = xStart
      brushWidth0 = brushWidth
      return
      
      
    # Determines if the mouse cursor location corresponds to the draggable portion of the brush control
    #
    # x - The x coordinate of the mouse cursor
    # 
    # Returns boolean
    isDraggingLocation = (x) =>
      # console.log ["x: #{x}", "brushWidth: #{brushWidth}", "xStart: #{xStart}"]
      x <= (brushWidth + xStart) and x >= xStart

    # Determines if the mouse cursor location corresponds to the left handle of the brush control
    #
    # x - The x coordinate of the mouse cursor
    # 
    # Returns boolean      
    isLeftHandle = (x) =>
      x >= (xStart-handleWidth) and x < (xStart)

    # Determines if the mouse cursor location corresponds to the right handle of the brush control
    #
    # x - The x coordinate of the mouse cursor
    # 
    # Returns boolean      
    isRightHandle = (x) =>
      x > (xStart + brushWidth) and x <= (xStart + brushWidth + handleWidth)
    
      
    # Add classes to the brush
    # Removes any of the clases, defined in 'classes' variable before appending className
    addBrushClass = (className) =>
      classNames = (key for key of cursorClasses).reduce (a, b) -> "#{a} #{b}"
      $(context.dombrush()).removeClass(classNames).addClass className
      return
  
    
     
    #  
    # Intial drawing of brush
    #
    setScales()
    checkDragState()
    setBrushValues() if dragEnabled
    drawAxis()
    # dispatchAdjust()
    
    # Set drawing interval
    setInterval update, 70
 

    # Event listners
  
    # Respond to resized browser by recalculating key points and redrawing
    context.on "respond.brush", () ->
      height0 = height
      width0 = width
      height = Math.floor context.h()*quandlism_brush.h
      width = Math.floor context.w()-quandlism_yaxis_width
      xStart = Math.floor xStart/width0*width
      xStart0 = Math.floor xStart0/width0*width
      brushWidth = Math.floor brushWidth/width0*width
      brushWidth0 = brushWidth
      xAxisDOM.attr 'width', width
      removeCache()
      setScales()
      drawAxis()
      return
      
    # Respond to refresh event
    context.on 'refresh.brush', () ->
      lines = selection.datum()
      removeCache()
      setScales()
      checkDragState()
      setBrushValues() if dragEnabled
      drawAxis()
      # dispatchAdjust()      
      return
      
      
    # Respond to toggle by re-setting extents to account for newly hidden or visible columns
    # And redrawing the brush backgorund
    context.on "toggle.brush", () ->
      removeCache()
      setScales()
      return
      
    # Listen for mousedown event to track mouse clicks before dragging or stretching control
    canvas.on 'mousedown', (e) ->
      d3.event.preventDefault()
      m = d3.mouse @
      touchPoint = m[0]
      
      if isLeftHandle m[0]
        # If click on left handle
        stretching = true
        activeHandle = -1
      else if isRightHandle m[0]
        # If click on right handle
        stretching = true
        activeHandle = 1
      else if isDraggingLocation m[0]
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
        
        # dispatchAdjust()
        
      else if dragEnabled
        if isDraggingLocation m[0]
          addBrushClass cursorClasses['move']
        else if isLeftHandle(m[0]) or isRightHandle(m[0])
          addBrushClass cursorClasses['resize']
        else
          addBrushClass ''
      return

  # 
  # Getters and setters
  #  
  brush.canvasId = (_) =>
    if not _? then return canvasId
    canvasId = _
    brush
  
  brush.xScale = (_) =>
    if not _? then return xScale
    xScale = _
    brush
    
  brush.yScale = (_) =>
    if not _? then return yScale
    yScale = _
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
    
  brush.cursorClasses = (_) =>
    if not _? then return cursorClasses
    cursorClasses = _
    brush
  
  brush
      