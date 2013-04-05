QuandlismContext_.stage = () ->
  context     = @
  canvasId    = null
  canvasNode  = null
  lines       = []
  line        = null
  width       = Math.floor (context.w()-quandlism_yaxis_width-2)
  height      = Math.floor (context.h() * quandlism_stage.h)
  xScale      = d3.time.scale()
  xAxis       = d3.svg.axis().orient('bottom').scale xScale
  yScales     = [d3.scale.linear(), d3.scale.linear()]
  yAxes       = [ d3.svg.axis().orient('left').scale(yScales[0]), d3.svg.axis().orient('right').scale(yScales[1]) ]
  yAxesDOMs   = []
  extents     = [[], []]
  threshold   = 10
  dateStart   = null
  dateEnd     = null
  drawStart   = null
  drawEnd     = null
  indexStart  = null
  indexEnd    = null
  threshold   = 10
  canvas      = null
  ctx         = null
   
  stage = (selection) =>
  
    # Convenience method
    shouldShowDualAxes = =>
      context.utility().shouldShowDualAxes(lines, indexStart, indexEnd)
      
    stageCanvasStyle = =>
      style = "position: absolute; left: #{quandlism_yaxis_width}px; top: 0px; border-left: 1px solid black; border-bottom: 1px solid black;"
      style += "border-right: 1px solid black;" if shouldShowDualAxes()
      style
      
    # Insert the axis DOM elements
    insertAxisDOM = (axisIndex) ->	
      selection.insert("svg")
        .attr("class", "y axis")
        .attr("id", "y-axis-#{axisIndex}-#{canvasId}")
        .attr("width", quandlism_yaxis_width)
        .attr("height", Math.floor(context.h() * quandlism_stage.h))
        .attr("style", "position: absolute; left: " + context.w()*axisIndex + "px; top: 0px;")
        
    # Get reference to lines, the first line and generate unique ID for the stage
    canvasId = "canvas-stage-#{++quandlism_id_ref}" if not canvasId?
    lines = selection.datum()
    line  = _.first lines
    
    # Override css to position stage
    selection.attr "style", "position: absolute; left: 0px; top: 0px;"

    # Create dom elements for the y axes
    yAxesDOMs.push(insertAxisDOM(i)) for i in [0..1]

    # Create canvas element and get reference to drawing context
    canvas = selection.append 'canvas'
    canvas.attr 'width', width
    canvas.attr 'height', height
    canvas.attr 'class', 'canvas-stage'
    canvas.attr 'id', canvasId
    canvas.attr 'style', stageCanvasStyle()
 
    ctx = canvas.node().getContext '2d'
   
    # Build the xAxis
    xAxisDOM = selection.append 'svg'
    xAxisDOM.attr 'class', 'x axis'
    xAxisDOM.attr 'id', "x-axis-#{canvasId}"
    xAxisDOM.attr 'width',  Math.floor context.w()-quandlism_yaxis_width
    xAxisDOM.attr 'height', Math.floor context.h() * quandlism_xaxis.h
    xAxisDOM.attr 'style', "position: absolute; left: #{quandlism_yaxis_width}px; top: #{height}px"

 
    # Respond to browser resize by resetting style
    respondAxisDOM = (axisInd)=>
      yAxesDOMs[axisInd].attr('style', "position: absolute; left: #{Math.floor(context.w())*axisInd}px; top: 0px;")      
      
    resetExtents = =>
      extents = [ [], [] ]
      return
      
    setExtents = =>
      # Check for user overrides and set extent from those values
      resetExtents()
      setExtentsFromUser()
      return unless _.isEmpty extents[0]
      # If user overrides not set, calculate the global extent. Use for first exent value unless threshold indicates multi
      # axes is necessary
      # XXX ADD CHECKS
      #     #   extent = context.utility().getExtent lines, indexStart, indexEnd
      #   extent = context.utility().getExtent lines, 0, line.length()        unless _.first(extent) isnt _.last(extent)
      #   extent = [Math.floor(extent[0][0] / 2), Math.floor(extent[0][0]*2)] unless _.first(extent) isnt _.last(extent)
      #            
      # _yMin = context.yAxisMin()
      # _yMax = context.yAxisMax()
      # 
      # _yMin = null if _.isString(_yMin) and _.isEmpty(_yMin)
      # _yMax = null if _.isString(_yMax) and _.isEmpty(_yMax)
      # 
      # _yMin = _yMin ? extent[0][0] 
      # _yMax = _yMax ? extent[0][1]
      #
      exe = context.utility().getExtent lines, indexStart, indexEnd
      if !shouldShowDualAxes()
        extents = [exe, []]
      else
        extents = context.utility().getMultiExtent(lines, indexStart, indexEnd)
        context.yAxisDualMin extents[1][0]
        context.yAxisDualMax extents[1][1]
      
      # Update exposed values
      context.yAxisMin extents[0][0] 
      context.yAxisMax extents[0][1]
      
    # If the context has extent values for either yAxis from the user, use those before trying to calculate 
    # from line objects
    setExtentsFromUser = =>
      extents[0] = [context.yAxisMin(), context.yAxisMax()]         if context.yAxisMin() and context.yAxisMax() 
      extents[1] = [context.yAxisDualMin(), context.yAxisDualMax()] if context.yAxisDualMin() and context.yAxisDualMax()
    
      
    # Calculate the range and domain of the x and y scales
    setScales = =>
      # Update the x domain and range
      xScale.domain [dateStart, dateEnd]
      xScale.range  [0, width]
      
      # Set first axis domain
      yScales[0].domain extents[0]
      yScales[1].domain extents[1]
      
      # Set the range for the yScales
      scale.range([(height - context.padding()), context.padding()]) for scale in yScales
      
      return
    
    # Set the tick number, size and tick format strategy
    # for the axis
    # unitsObj  - The divisor/label to be used in formatting
    # axisIndex - The index of the y axis 
    #
    # Returns null
    setTicks = (unitsObj, axisIndex) =>
      yAxes[axisIndex].ticks Math.floor context.h()*quandlism_stage.h / 30
      yAxes[axisIndex].tickSize 5, 3, 0
      yAxes[axisIndex].tickFormat (d) =>
        n = (d / unitsObj['divisor']).toFixed 2
        n = n.replace(/0+$/, '')
        n = n.replace(/\.$/, '')
        "#{n}#{unitsObj['label']}"
      return
      
    prepareAxes = =>
      for i in [0..1]
        continue if i is 1 and !shouldShowDualAxes() 
        units = context.utility().getUnitAndDivisor Math.round(extents[i][1])
        setTicks units, i
      return
      
    prepareCanvas = =>
      canvas.attr "style", stageCanvasStyle()
      return
    
    prepareLines = =>
      line.resetState() for line in lines
      return    
      
    # Execute util functions and calculate values needed to draw the stage
    prepareToDraw = =>
      setExtents()
      setScales()
      prepareAxes()
      prepareCanvas()
      prepareLines()
      return
      
    # Draw axis
    drawAxis = =>
      # Remove old yAxis and redraw  
      # Refresh x axis
      xAxisDOM.selectAll('*').remove()
      xg = xAxisDOM.append 'g'
      xg.call xAxis
      xg.select('path').remove()
      
      for i in [0,1] 
        yAxesDOMs[i].selectAll('*').remove()
        continue if i is 1 and !shouldShowDualAxes()
        g = yAxesDOMs[i].append 'g'
        g.attr 'transform', "translate(#{quandlism_yaxis_width}, 0)" if i is 0
        g.call yAxes[i]
        g.select('path').remove()
      return

    # Draw y and x grid lines
    drawGridLines =  =>
      yScale = _.first(yScales)
      for y in yScale.ticks Math.floor context.h()*quandlism_stage.h / 30
        ctx.beginPath()
        ctx.strokeStyle = '#EDEDED'
        ctx.lineWidth = 1
        ctx.moveTo 0, Math.floor yScale y
        ctx.lineTo width, Math.floor yScale y
        ctx.stroke()
        ctx.closePath()
        
      for x in xScale.ticks Math.floor (context.w()-quandlism_yaxis_width) / 100
        ctx.beginPath()
        ctx.strokeStyle = '#EDEDED'
        ctx.lineWith = 1
        ctx.moveTo xScale(x), height
        ctx.lineTo xScale(x), 0
        ctx.stroke()
        ctx.closePath()
        
        
    # Draws the stage data
    #
    # lineId - The id of the line to be highlighted when drawing the lines (integer or null)
    draw = (lineId) =>
      lineId = lineId ? -1  
      # Refresh axis and gridlines
      drawAxis()
      ctx.clearRect 0, 0, width, height      
      drawGridLines()

      for line, j in lines   
        # calculate the line width to use (if we are on lineId)
        lineWidth = if j is lineId then 3 else 1.5
        
        # If there are two axes, determine which axes the line belongs to.
        if shouldShowDualAxes()
          ex = line.extent()
          # Determine which scale to use for each line
          axisIndex = if (Math.abs(extents[0][1]-ex[1]) <= Math.abs(extents[1][1]-ex[1])) then 0 else 1
          line.axisIndex axisIndex
          line.drawPathFromIndicies ctx, xScale, yScales[axisIndex], indexStart, indexEnd, lineWidth
          if ((indexEnd-indexStart) < threshold)
            line.drawPointAtIndex ctx, xScale, yScales[axisIndex], i, 2 for i in [indexStart..indexEnd]
        else
          line.drawPathFromIndicies ctx, xScale, yScales[0], indexStart, indexEnd, lineWidth
          if ((indexEnd-indexStart) < threshold)
            line.drawPointAtIndex ctx, xScale, yScales[0], i, 2 for i in [indexStart..indexEnd]
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
    drawTooltip = (loc, hit, dataIndex) =>
      # Draw the line with the point highlighted
      line_ = hit.line
      date  = line_.dateAt(dataIndex)
      value = line_.valueAt(dataIndex)
      draw line_.id()
      if extents[1][1] / extents[0][1] > 2 and Math.abs(line_.extent(indexStart, indexEnd)[1] - extents[1][1]) < Math.abs(line_.extent(indexStart, indexEnd)[1] - extents[0][1])
        line_.drawPointAtIndex ctx, xScale, yScales[1], dataIndex, 3
      else
        line_.drawPointAtIndex ctx, xScale, yScales[0], dataIndex, 3  

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
      ctx.fillStyle = line_.color()
      ctx.textAlign = 'end'
      ctx.fillText "#{context.utility().truncate line_.name(), 20}", w-120, 10, 200

      return
      
      
    # Remove toolitp data and graph highlighting
    clearTooltip = () ->
      draw()
      return
      

    # Intial draw. If there is a brush in the context, it will dispatch the adjust event and force the 
    # stage to draw. If there isn't, force the stage to draw
    #
    unless context.dombrush()?
      dateStart = _.first lines[0].dates()
      dateEnd = _.last lines[0].dates()
      indexStart = 0
      indexEnd   = line.length()
      prepareToDraw()
      draw()

    # Callbacks / Event bindings
    # Listen for events dispatched from context, or listen for events in canvas
  
    # Respond to page resize
    # Resize, clear and re-draw
    context.on 'respond.stage', () ->
      ctx.clearRect 0, 0, width, height
      width = Math.floor (context.w()-quandlism_yaxis_width-1)
      height = Math.floor (context.h() * quandlism_stage.h)
      canvas.attr 'width', width
      canvas.attr 'height', height
      
      # Update the y axes axis width
      respondAxisDOM(i) for i in [0..1]
  
      # Adjust x axis with and marign
      xAxisDOM.attr 'width',  Math.floor context.w() - quandlism_yaxis_width
      xAxisDOM.attr 'height', Math.floor context.utility().xAxisHeight()
      prepareToDraw()
      draw()
      return
 
    # Respond to adjsut events from the brush
    context.on 'adjust.stage', (_dateStart, _indexStart, _dateEnd, _indexEnd) ->
      indexStart  = _indexStart
      indexEnd    = _indexEnd
      dateStart   = _dateStart
      dateEnd     = _dateEnd
      prepareToDraw()
      draw()
      return
      
    # Respond to toggle event by re-drawing
    context.on 'toggle.stage', () ->
      context.resetState() unless context.dombrush()
      prepareToDraw()
      draw()
      return
      
    # Respond to refresh event. Update line data and re-draw
    context.on 'refresh.stage', () ->
      lines = selection.datum()
      line  = _.first lines
      # Only draw if there is no brush to dispatch the adjust event
      draw() if not context.dombrush()      
      return
      
    d3.select("##{canvasId}").on 'mousemove', (e) ->
      loc = d3.mouse @
      hit = lineHit loc
      dataIndex =  hit.line.getClosestIndex(xScale.invert(hit.x)) if hit      
      if hit isnt false then drawTooltip loc, hit, dataIndex else clearTooltip()
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
    
  stage.threshold = (_) =>
    if not _? then return threshold
    threshold = _
    stage
    
  stage
