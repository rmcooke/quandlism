QuandlismContext_.xaxis = () ->
  @context    = this
  @width      = @context.w() * quandlism_xaxis.w
  @height     = @context.h() * quandlism_xaxis.h
  @scale      = d3.time.scale().range [0, @width]
  @axis_      = d3.svg.axis().scale(@scale)
  @extent     = []
  @active     = false
  @lines      = []
  @id         = null
  
  
  xaxis = (selection) =>
    
    @id = selection.attr 'id';      
    @lines = selection.datum();
    
    @update = () ->
      xaxis.remove()
      g = selection.append 'svg'
      g.attr 'width', @width
      g.attr 'height', @height
      g.append 'g'
      g.attr 'transform', 'translate(0, 27)'
      g.call(@axis_)
      
    @changeScale = () =>
      @extent = [@lines[0].dateAt(0), @lines[0].dateAt(@lines[0].length()-1)]
      parseDate = @context.utility().parseDate(@lines[0].dateAt(0))
      @scale.domain [parseDate(@extent[0]), parseDate(@extent[1])]
      @axis_.tickFormat d3.time.format('%b %d, %Y')
      @axis_.ticks Math.floor @width / 150, 0, 0
      @scale.range [0, @width]
      
    @changeScale()
    @update()

  # Event listneres
  @context.on "respond.xaxis-#{@id}", () =>
    @width = @context.w() * quandlism_xaxis.w
    @axis_.ticks Math.floor @width/ 150, 0, 0
    @scale.range [0, @width]
    @update()

  # Expose attributes with getters/etters
  xaxis.remove = () =>
    d3.select("##{@id}").selectAll("svg").remove();
    
  xaxis.active = (_) =>
    if not _ then return @active
    @active = _
    xaxis
    
  d3.rebind(xaxis, @axis_, 'orient', 'ticks', 'ticksSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
 