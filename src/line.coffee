class QuandlismLine

QuandlismContext_.line = (data) ->
  line          = new QuandlismLine(context)
  context      = @
  name         = data.name
  values       = data.values.reverse()
  id           = quandlism_line_id++
  visible      = true
  
  
  # Instance methods
  
  # Calculates the minimum and maximum values of the lines between the start and end points
  #
  # start - The first index to consider
  # end   - The last index to consider
  #
  # Returns an array of two values
  line.extent = (start, end) ->
    i = if start? then start else 0
    n = if end? then end else (@.length()-1)
    min = Infinity
    max = -Infinity
    return [min, max] if not @.visible()

    while i <= n
      val = @.valueAt i
      if not val?
        i++
        continue
      min = val if val < min
      max = val if val > max
      i++
      
    [min, max]
    
  # Return the number of datapoints in the line
  line.length = () =>
    values.length
    
  # Get the value for the line at a given array index
  #
  # i - The array index we want the value for
  #
  # Returns an number value
  line.valueAt = (i) =>
    if values[i]? then values[i].num else null
  
  # Get the date associated with an array index
  #
  # i - The array index we want the date for
  #
  # Returns a string representing a date
  line.dateAt = (i) =>
    if values[i]? then values[i].date else null
    
  
  # Renders an individual point on the canvas
  #
  # color   - The color of the point
  # ctx     - The HTML canvas context
  # xS      - The d3 scale for the x co-ordinate
  # yS      - The d3 scale for the y co-ordinate
  # index   - The array index of the point to render
  # radius  - The radius of the point
  #
  # Returns null
  line.drawPoint = (color, ctx, xS, yX, index, radius) ->
      # do something\
    if @.visible()
      ctx.beginPath()
      ctx.arc xS(index), yS(@.valueAt(index)), radius, 0, Math.PI*2, true
      ctx.fillStyle = color
      ctx.fill()
      ctx.closePath()

  # Draw a path on the drawing context
  #
  # color     - The color of the path
  # ctx       - The HTML canvas context
  # xS        - The d3 scale for the x co-ordinate
  # yS        - The d3 scale for the y co-ordinate
  # start     - The first array index for the line
  # end       - The final array index for the line
  # lineWidth - The width of the line
  #
  # Returns null
  line.drawPath = (color, ctx, xS, yS, start, end, lineWidth) ->
    if @.visible()
      ctx.beginPath()
      for i in [start..end]
        ctx.lineTo xS(i), yS(@.valueAt(i))
        
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = color
      ctx.stroke()
      ctx.closePath()
      
      
  # Toggle visibility of line
  line.toggle = () ->
    v = not @.visible()
    @.visible(v)
    v
  
  #
  line.id = (_) =>
    if not _? then return id
    id = _
    line
    
  line.name = (_) =>
    if not _? then return name
    name = _
    line
    
  line.values = (_) =>
    if not _? then return values
    values = _
    line
    
  line.visible = (_) =>
    if not _? then return visible
    visible = _
    line
    
  line
   
  # Instance methods
  
    
  
    
    