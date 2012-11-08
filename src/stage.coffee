QuandlismContext_.stage = () ->
  @context    = @
  @id         = null
  @lines      = []
  @width      = Math.floor @context.w() * quandlism_stage.w
  @height     = Math.floor @context.h() * quandlism_stage.h
  @xScale     = d3.scale.linear()
  @yScale     = d3.scale.linear()
  @padding    = 10
  @extent     = []
  @xStart     = null
  @xEnd       = null
  @threshold  = 10
  @canvas     = null
  @ctx        = null
  
  
  stage = (selection) =>
    # Get lines and generate unique ID for the stage
    @lines = selection.datum()
    @id = "canvas-stage-#{++quandlism_id_ref}"
    
    # If yAxis not defined, create it
    # XXX Todo
    
    # If xAxis not defined, create it
    # XXX Todo
    selection.append('canvas').attr('width', @width).attr('height', @height).attr('class', 'stage').attr('id', @id)
    
    # Get reference to canvas selection and drawing context
    @canvas = selection.select("##{@id}")
    @ctx = @canvas.node().getContext '2d'
    
    # Set start and end indexes, if they have not already been set
    @xStart = if not @xStart then Math.floor @lines[0].length() * @context.endPercent() else @xStart
    @xEnd =  if not @xEnd then lines[0].length() else @xEnd

    
    # Draws the stage data
    @draw = (lineId) =>
      
      # Calculate the extent for the area between xStart and xEnd
      @extent = @context.utility().getExtent(@lines, @xStart, @xEnd)
      
      # Update the linear x and y scales with calculated extent
      @yScale.domain [@extent[0], @extent[1]]
      @yScale.range [(@height - @padding), @padding]

      @xScale.domain [@xStart, @xEnd]
      @xScale.range [@padding, (@width - @padding)]

      # Clear canvas before drawing
      @ctx.clearRect 0, 0, @width, @height
      
      # if lineId to highlight is not defined, set to an invalid index
      lineId = if lineId? then lineId else -1
      
      for line, j in @lines
        # calculate the line width to use (if we are on lineId)
        lineWidth = if j is lineId then 3 else 1.5
        
        # If we are within the minimum threshold show points with line
        # If we are on a single data point, show only a point
        # Othwerwise, render a path
        if (@xEnd - @xStart <= @threshold)
          line.drawPath @context.utility().getColor(j), @ctx, @xScale, @yScale, @xStart, @xEnd, lineWidth
          for i in [@xStart..@xEnd]
            line.drawPoint @context.utility().getColor(j), @ctx, @xScale, @yScale, i, 3
        else if @xEnd is @xStart
          line.drawPoint @context.utility().getColor(j), @ctx, @xScale, @yScale, @xStart, 3
        else
          line.drawPath @context.utility().getColor(j), @ctx, @xScale, @yScale, @xStart, @xEnd, lineWidth


    @draw()   

    
    return
    
    
  # Callbacks / Event bindings
  
  # Resond to page resize
  # Resize, clear and re-draw
  @context.on 'respond.stage', () =>
    @ctx.clearRect 0, 0, @width, @height
    @width = Math.floor @context.w() * quandlism_stage.w
    @height = Math.floor @context.h() * quandlism_stage.h
    @canvas.attr('width', @width).attr('height', @height)
    @draw()
    
  # Expose attributes via getters/setters
  stage.padding = (_) =>
    if not _ then return @padding
    @padding = _
    stage
    
  stage.id = (_) =>
    if not _ then return @id
    @id = _
    stage
    
  stage.width = (_) =>
    if not _ then return @width
    @width = _
    stage
  
  stage.height = (_) =>
    if not _ then return @height
    @height = _
    stage
    
  stage.xScale = (_) =>
    if not _ then return @xScale
    @xScale = _
    stage
    
  stage.yScale = (_) =>
    if not _ then return @yScale
    @yScale = _
    stage

  stage.xEnd = (_) =>
    if not _ then return @xEnd
    @xEnd = _
    stage    

  stage.xStart = (_) =>
    if not _ then return @xStart
    @xStart = _
    stage        
    
  stage.threshold = (_) =>
    if not _ then return @threshold
    @threshold = _
    stage
    
  stage