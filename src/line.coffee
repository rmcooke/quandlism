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
    
  # Get the extent of the line between the start and end dates
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
    
    
  # Draws a the point on the canvas at the dataPoint corresponding to 'index', for this line
  line.drawPointAtIndex = (ctx, xS, yS, index, radius) ->
    return unless @visible()
    ctx.beginPath()
    ctx.arc xS(@dateAt(index)), yS(@valueAt(index)), radius, 0, Math.PI*2, true
    ctx.fillStyle = @color()
    ctx.fill()
    ctx.closePath()
    

  # Draws the entire path of the line
  line.drawPath = (ctx, xS, yS,lineWidth) ->    
    return unless @visible()
    ctx.beginPath()

    for date, i in @dates()
      continue unless @valueAt(i)?
      ctx.lineTo xS(date), yS(@valueAt(i))
        
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = @color()
    ctx.stroke()
    ctx.closePath()
    
    return
    
  # Draws the path between the start and end indicies
  line.drawPathFromIndicies = (ctx, xS, yS, start, end, lineWidth) ->
    return unless @visible()
    ctx.beginPath()
    for i in [start..end]
      continue unless @valueAt(i)?
      ctx.lineTo xS(@dateAt(i)), yS(@valueAt(i))
      
    ctx.lineWidth   = lineWidth
    ctx.strokeStyle = @color()
    ctx.stroke()
    ctx.closePath() 
  
  # Get the closes date in the data to the given date
  line.getClosestDataPoint = (date) ->
    index = @getClosestIndex date
    values[index]
    
  # The the data index that has a date closest to the given date
  line.getClosestIndex = (date) ->
    closest = Infinity
    cloestIndex = 0
    prevClosest = Infinity
    dateKey = context.utility().getDateKey(date)
    for d, i in datesMap
      key = context.utility().getDateKey(d)
      diff = Math.abs(key-dateKey)
      if diff < closest
        prevClosest = closest
        closest = diff
        closestIndex = i
      else if prevClosest < diff
        # Dates are sequential. If we are are nearest calculation is gettin further from diff, then we've passed 
        # nearest date
        break
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
   
  
    
  
    
    