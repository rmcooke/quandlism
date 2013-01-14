QuandlismContext_.stage = () ->
  context     = @
  canvasId    = null
  lines       = []
  width       = Math.floor (context.w()-quandlism_yaxis_width-2)
  height      = Math.floor context.h() * quandlism_stage.h
  xScale      = d3.scale.linear()
  yScale      = d3.scale.linear()
  xAxis       = d3.svg.axis().orient('bottom').scale xScale
  yAxis       = d3.svg.axis().orient('left').scale yScale
  yAxisDOM    = null
  xAxisDOM    = null
  extent      = []
  dateStart   = null
  dateEnd     = null
  threshold   = 10
  canvas      = null
  xEnd        = 0
  xStart      = 0
  ctx         = null
  
  
  stage = (selection) =>
    # Get lines and generate unique ID for the stage
    lines = selection.datum()
    canvasId = "canvas-stage-#{++quandlism_id_ref}" if not canvasId?
    
    selection.attr "style", "position: absolute; left: 0px; top: 0px;"
    
    # Build the yAxis
    if not yAxisDOM? 
      yAxisDOM = selection.insert 'svg'
      yAxisDOM.attr 'class', 'y axis'
      yAxisDOM.attr 'id', "y-axis-#{canvasId}"
      yAxisDOM.attr 'width', quandlism_yaxis_width
      yAxisDOM.attr 'height', Math.floor context.h()*quandlism_stage.h
      yAxisDOM.attr "style", "position: absolute; left: 0px; top: 0px;"

    # Create canvas element and get reference to drawing context
    canvas = selection.append 'canvas'
    canvas.attr 'width', width
    canvas.attr 'height', height
    canvas.attr 'class', 'stage'
    canvas.attr 'id', canvasId
    canvas.attr 'style', "position: absolute; left: #{quandlism_yaxis_width}px; top: 0px;"
  
    ctx = canvas.node().getContext '2d'
   
    # Build the xAxis
    if not xAxisDOM? 
      xAxisDOM = selection.append 'svg'
      xAxisDOM.attr 'class', 'x axis'
      xAxisDOM.attr 'id', "x-axis-#{canvasId}"
      xAxisDOM.attr 'width',  Math.floor context.w()-quandlism_yaxis_width
      xAxisDOM.attr 'height', Math.floor context.h()*quandlism_xaxis.h
      xAxisDOM.attr 'style', "position: absolute; left: #{quandlism_yaxis_width}px; top: #{context.h()*quandlism_stage.h}px"
      
    # Axis tick size
    yAxis.tickSize 5, 3, 0
    xAxis.tickSize 5, 3, 0

    # Calculate the range and domain of the x and y scales
    setScales = () =>
      # Calculate the extent for the area between xStart and xEnd
      extent = context.utility().getExtent lines, xStart, xEnd
      
      # If end points if extent are equal, then recalculate using the entire datasets. Fixes rendering issue of flat-line
      # on x-axis if all poitns are the same
      unless extent[0] isnt extent[1]
        extent = context.utility().getExtent lines, 0, lines[0].length()-1 
      
      # Update the linear x and y scales with calculated extent
      yScale.domain [extent[0], extent[1]]
      yScale.range [(height - context.padding()), context.padding()]

      xScale.domain [dateStart, dateEnd]
      xScale.range [context.padding(), (width-context.padding())]
   
      yAxis.tickSize 5, 3, 0
      yAxis.ticks Math.floor context.h()*quandlism_stage.h / 30
   
   
      # Build the yAxis tick formatting function
      unitsObj = context.utility().getUnitAndDivisor Math.round(extent[1])
  
      yAxis.tickFormat (d) =>
        n = (d/unitsObj['divisor']).toFixed 2
        n = n.replace(/0+$/, '')
        n = n.replace(/\.$/, '')
        "#{n} #{unitsObj['label']}"
        
        
      # Build the xAxis tick formatting function
      xAxis.ticks Math.floor (context.w()-quandlism_yaxis_width)/100
      xAxis.tickFormat (d) =>
        if date = lines[0].dateAt d
          date = new Date date
          "#{context.utility().getMonthName date.getUTCMonth()} #{date.getUTCDate()}, #{date.getUTCFullYear()}"
      
   
      return
    
    # Draw axis
    drawAxis = () =>
      # Remove old yAxis and redraw
      yAxisDOM.selectAll('*').remove()
      yg = yAxisDOM.append 'g'
      yg.attr 'transform', "translate(#{quandlism_yaxis_width-1}, 0)"
      yg.call yAxis
      
      xAxisDOM.selectAll('*').remove()
      xg = xAxisDOM.append 'g'
      xg.call xAxis
      return

    # Draw y and x grid lines
    drawGridLines = () =>
      for y in yScale.ticks Math.floor context.h()*quandlism_stage.h / 30
        ctx.beginPath()
        ctx.strokeStyle = '#EDEDED'
        ctx.lineWidth = 1
        ctx.moveTo 0, Math.floor yScale y
        ctx.lineTo width, Math.floor yScale y
        ctx.stroke()
        ctx.closePath()
        
      for x in xScale.ticks Math.floor (context.w()-quandlism_yaxis_width)/100
        ctx.beginPath()
        ctx.strokeStyle = '#EDEDED'
        ctx.lineWith = 1
        ctx.moveTo xScale(x), height
        ctx.lineTo xScale(x), 0
        ctx.stroke()
        ctx.closePath()
        
    # Draws the stage data
    draw = (lineId) =>
    
      drawAxis()
          
      # Clear canvas before drawing
      ctx.clearRect 0, 0, width, height
      
      drawGridLines()
      
      # if lineId to highlight is not defined, set to an invalid index
      lineId = if lineId? then lineId else -1
      
      for line, j in lines
        # calculate the line width to use (if we are on lineId)
        lineWidth = if j is lineId then 3 else 1.5
        
        # If we are within the minimum threshold show points with line
        # If we are on a single data point, show only a point
        # Othwerwise, render a path
        if (xEnd - xStart <= threshold)
          line.drawPath ctx, xScale, yScale, xStart, xEnd, lineWidth
          for i in [xStart..xEnd]
            line.drawPoint ctx, xScale, yScale, i, 3
        else if xEnd is xStart
          line.drawPoint ctx, xScale, yScale, xStart, 3
        else
          line.drawPath ctx, xScale, yScale, xStart, xEnd, lineWidth
        
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
      
      i = _.indexOf context.colorList(), hex
      return {x: m[0], color: hex, line: lines[i] } if i isnt -1

      # If no match, check the immediate area for fuzzy matching
      hitMatrix = []
      for j in [m[0]-3..m[0]+3]
        for k in [m[1]-3..m[1]+3]
          if j isnt m[0] or k isnt m[1]
            hitMatrix.push [j, k]
            
      for n in [0..(hitMatrix.length-1)]
        hex = context.utility().getPixelRGB hitMatrix[n], ctx
        i = _.indexOf context.colorList(), hex
        return {x: hitMatrix[n][0], color: hex, line: lines[i]} if i isnt -1
      false
      
    # Render the tooltip data, from a mouseover event on a line, and highlight the moused over point
    #
    # locq  - Mouse location
    # x     - The x index of the data point
    # line  - The line that was highlighted
    # hex   - The color
    # 
    # Returns null
    drawTooltip = (loc, x, line, hex) =>
      date = new Date line.dateAt x
      value = line.valueAt x
      # Draw the line with the point highlighted
      draw line.id()
      pointSize = if (xEnd - xStart <= threshold) then 5 else 3
      line.drawPoint ctx, xScale, yScale, x, pointSize
      
      # In toolip container?
      inTooltip = loc[1] <= 20 and loc[0] >= (width-250)
      w = if inTooltip then width-400 else width
      # Container
      ctx.beginPath()
      ctx.fillStyle = 'rgba(237, 237, 237, 0.80)'
      ctx.fillRect w-240, 0, 240, 15
      ctx.closePath()
      # Value
      ctx.fillStyle = '#000'
      ctx.textAlign = 'start'
      tooltipText = "#{context.utility().getMonthName date.getUTCMonth()}  #{date.getUTCDate()}, #{date.getFullYear()}: "
      tooltipText += "#{context.utility().formatNumberAsString value.toFixed 2}"
      ctx.fillText tooltipText, w-110, 10, 100
      # Line Name
      ctx.fillStyle = line.color()
      ctx.textAlign = 'end'
      ctx.fillText "#{context.utility().truncate line.name(), 20}", w-120, 10, 200

      return
      
      
    # Remove toolitp data and graph highlighting
    clearTooltip = () ->
      draw()
      return
      
    # 
    # Intial draw. If there is a brush in the context, it will dispatch the adjust event and force the 
    # stage to draw. If there isn't, force the stage to draw
    #
    unless context.dombrush()?
      dateStart = _.first lines[0].dates()
      dateEnd = _.last lines[0].dates()
      setScales()
      draw()

    # Callbacks / Event bindings
    # Listen for events dispatched from context, or listen for events in canvas
  
    # Respond to page resize
    # Resize, clear and re-draw
    context.on 'respond.stage', () ->
      ctx.clearRect 0, 0, width, height
      width = Math.floor context.w()-quandlism_yaxis_width-1
      height = Math.floor context.h() * quandlism_stage.h
      canvas.attr 'width', width
      canvas.attr 'height', height
      
      # Adjust y axis width
      yAxisDOM.attr 'width', quandlism_yaxis_width
      
      # Adjust x axis with and marign
      xAxisDOM.attr 'width', Math.floor context.w() - quandlism_yaxis_width
      
      setScales()
      draw()
      return
 
    # Respond to adjsut events from the brush
    context.on 'adjust.stage', (_dateStart, _dateEnd) ->
      console.log "ADJUSTING STAGE: #{_dateStart} #{_dateEnd}"
      dateStart = _dateStart
      dateEnd = _dateEnd
      setScales()
      # draw()
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
      
    d3.select("##{canvasId}").on 'mousemove', (e) ->
      loc = d3.mouse @
      hit = lineHit loc
      if hit isnt false then drawTooltip loc, Math.round(xScale.invert(hit.x)), hit.line, hit.color else clearTooltip()
      return
 
    return
    
    

    
  # Expose attributes via getters/setters
  stage.canvasId = (_) =>
    if not _? then return canvasId
    canvasId = _
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