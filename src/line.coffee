class QuandlismLine

QuandlismContext_.line = (data) ->
  line         = new QuandlismLine(@context)
  @context      = this
  @name         = data.name
  @values       = data.values.reverse()
  @id           = quandlism_line_id++
  @visible      = true
  
  # Expose attributes via getters/stters
  line.id = (_) =>
    if not _ then return @id
    @id = _
    line
    
  line.name = (_) =>
    if not _ then return @name
    @name = _
    line
    
  line.values = (_) =>
    if not _ then return @values
    @values = _
    line
    
  line
   
  # Instance methods
  
    
  
    
    