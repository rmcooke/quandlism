class QuandlismLine

QuandlismContext_.line = (data) ->
  line          = new QuandlismLine()
  context      = @
  name         = data.name
  values       = data.values.reverse()
  id           = quandlism_line_id++
  visible      = true
  color        = '#000000'
  
  
  # Instance methods
  
  # Calculates the minimum and maximum values of the lines between the start and end points
  #
  # start - The first index to consider
  # end   - The last index to consider
  #
  # Returns an array of two values
  line.extent = (start, end) ->
    i = if start? then start else 0
    n = if end? then end else (@length()-1)
    min = Infinity
    max = -Infinity
    return [min, max] unless @visible()

    while i <= n
      val = @valueAt i
      if not val?
        i++
        continue
      min = val if val < min
      max = val if val > max
      i++
      
    [min, max]
    
  line.extentByDate = (startDate, endDate) ->
    min = Infinity
    max = -Infinity
    return [min, max] unless @visible()
    for date, i in @dates()
      continue unless date <= endDate and date >= startDate
      val = @valueAt i
      min = val if val < min
      max = val if val > max
    [min, max]
    
  line.dates = (start, end) =>
    (v.date for v in values[start..end])
    
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
  # ctx     - The HTML canvas context
  # xS      - The d3 scale for the x co-ordinate
  # yS      - The d3 scale for the y co-ordinate
  # index   - The array index of the point to render
  # radius  - The radius of the point
  #
  # Returns null
  line.drawPoint = (ctx, xS, yS, index, radius) ->
      # do something\
    if @visible()
      return unless @valueAt(index)?
      ctx.beginPath()
      ctx.arc xS(index), yS(@valueAt(index)), radius, 0, Math.PI*2, true
      ctx.fillStyle = @.color()
      ctx.fill()
      ctx.closePath()

  # Draw a path on the drawing context
  # Skips any values with null value
  # ctx       - The HTML canvas context
  # xS        - The d3 scale for the x co-ordinate
  # yS        - The d3 scale for the y co-ordinate
  # dateStart  - The first date that should be included on the plot
  # dateEnd    - The final date that should be included on the plot
  # lineWidth - The width of the line
  # drawPoints  - should the individual data points be highlighted?
  # stage       - Is this coming from the stage?
  #
  # Returns null
  line.drawPath = (ctx, xS, yS, dateStart, dateEnd, lineWidth, drawPoints, stage) ->
    return unless @visible()
    data = [] if drawPoints
    stage = stage ? false
    ctx.beginPath()
    for date, i in @dates()
      unless stage
        continue unless (date <= dateEnd and date >= dateStart)
      data.push {date: date, value: @valueAt(i)} if drawPoints
      ctx.lineTo xS(date), yS(@valueAt(i))
        
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = @color()
    ctx.stroke()
    ctx.closePath()
    
    # Use captured data points to draw points, if necessary
    @drawPoints ctx, xS, yS, data if drawPoints
    
    return
  
  # Given an array of objects {data, value}, draw the points  on the context
  line.drawPoints = (ctx, xS, yS, data) ->
    return unless @visible()
    for obj in data
      ctx.beginPath()
      ctx.arc xS(obj.date), yS(obj.value), 3, 0, Math.PI*2, true
      ctx.fillStyle = @color()
      ctx.fill()
      ctx.closePath()
      
      
  # Toggle visibility of line
  line.toggle = () ->
    v = not @visible()
    @visible(v)
    v
  
  # Getters and setters - expose attributes of the line
  
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
    
  line.color = (_) =>
    if not _? then return color
    color = _
    line
    
  line
   
  
    
  
    
    