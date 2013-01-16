class QuandlismLine

QuandlismContext_.line = (data) ->
  line          = new QuandlismLine()
  context      = @
  name         = data.name
  values       = data.values.reverse()
  dates        = []
  datesMap     = []
  id           = quandlism_line_id++
  visible      = true
  color        = '#000000'
  
  # Instance methods
  # setup!
  line.setup = () ->
    dates     = (v.date for v in values)
    datesMap  = _.map dates, (d) -> context.utility().getDateKey(d)
    window.dates = dates
    datesMap = datesMap
    return
    
  line.setup()
    
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
      continue if not val?
      min = val if val < min
      max = val if val > max
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
    if dates[i]? then dates[i] else null
    
  
  # Renders an individual point on the canvas
  #
  # ctx     - The HTML canvas context
  # xS      - The d3 scale for the x co-ordinate
  # yS      - The d3 scale for the y co-ordinate
  # index   - The array index of the point to render
  # radius  - The radius of the point
  #
  # Returns null
  line.drawPoint = (ctx, xS, yS, dataPoint, radius) ->
    return unless @visible()
    return
    ctx.beginPath()
    ctx.arc xS(dataPoint.date), yS(dataPoint.num), radius, 0, Math.PI*2, true
    ctx.fillStyle = @color()
    ctx.fill()
    ctx.closePath()
    
  line.drawPointAtIndex = (ctx, xS, yS, index, radius) ->
    return unless @visible()
    ctx.beginPath()
    ctx.arc xS(@dateAt(index)), yS(@valueAt(index)), radius, 0, Math.PI*2, true
    ctx.fillStyle = @color()
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
  line.drawPath = (ctx, xS, yS, dateStart, dateEnd, lineWidth) ->    
    return unless @visible()
    ctx.beginPath()

    for date, i in @dates()
      continue unless @valueAt(i)
      ctx.lineTo xS(date), yS(@valueAt(i))
        
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = @color()
    ctx.stroke()
    ctx.closePath()
    
    return
    
  line.drawPathFromIndicies = (ctx, xS, yS, start, end, lineWidth) ->
    return unless @visible()
    ctx.beginPath()
    for i in [start..end]
      continue unless @valueAt(i)
      ctx.lineTo xS(@dateAt(i)), yS(@valueAt(i))
      
    ctx.lineWidth   = lineWidth
    ctx.strokeStyle = @color()
    ctx.stroke()
    ctx.closePath() 
  
  line.getClosestDataPoint = (date) ->
    index = @getClosestIndex date
    values[index]
    
  line.getClosestIndex = (date) ->
    closest = Infinity
    cloestIndex = 0
    dateKey = context.utility().getDateKey(date)
    for d, i in datesMap
      key = context.utility().getDateKey(d)
      diff = Math.abs(key-dateKey)
      if diff < closest
        closest = diff
        closestIndex = i
    closestIndex
    
    
  # Given an array of objects {data, value}, draw the points  on the context
  line.drawPoints = (ctx, xS, yS, dateStart, dateEnd, radius) ->
    return unless @visible()
    for date, i in @dates()
      continue unless date >= dateStart and date <= dateEnd
      ctx.beginPath()
      ctx.arc xS(date), yS(@valueAt(i)), 3, 0, Math.PI*2, true
      ctx.fillStyle = @color()
      ctx.fill()
      ctx.closePath()
  
      
  # Toggle visibility of line
  line.toggle = () ->
    v = not @visible()
    @visible(v)
    v
    
  
  # Getters and setters - expose attributes of the line
  line.dates = (_) =>
    if not _? then return dates
    dates = _
    line
    
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
   
  
    
  
    
    