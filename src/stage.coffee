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
  
  
  @stage = (selection) ->
    # Get lines and generate unique ID for the stage
    @lines = selection.datum()
    @id = "canvas-stage-#{++quandlism_id_ref}"
    
    # If yAxis not defined, create it
    # XXX Todo
    
    # If xAxis not defined, create it
    # XXX Todo
    
    return
    
    
  # Callbacks / Event bindings
  
  @context.on 'respond', () =>
    console.log 'something'
    
  # Expose attributes via getters/setters
  @stage.padding = (_) =>
    if not _ then return @padding
    @padding = _
    @stage
    
  @stage.id = (_) =>
    if not _ then return @id
    @id = _
    @stage
    
  @stage.width = (_) =>
    if not _ then return @width
    @width = _
    @stage
  
  @stage.height = (_) =>
    if not _ then return @height
    @height = _
    @stage
    
  @stage.xScale = (_) =>
    if not _ then return @xScale
    @xScale = _
    @stage
    
  @stage.yScale = (_) =>
    if not _ then return @yScale
    @yScale = _
    @stage

  @stage.xEnd = (_) =>
    if not _ then return @xEnd
    @xEnd = _
    @stage    

  @stage.xStart = (_) =>
    if not _ then return @xStart
    @xStart = _
    @stage        
    
  @stage.threshold = (_) =>
    if not _ then return @threshold
    @threshold = _
    @stage
    
  @stage