QuandlismContext_.utility = () ->
  
  context = @
  
  utility = -> return

  # camelize a string
  utility.camelize = (str) =>
    str.replace /(\_[a-z])/g, (match) -> match.toUpperCase().replace('_','')

  # Truncate a word to a max 
  utility.truncate = (word, chars) =>
    if word.length > chars then "#{word.substring(0, chars)}..." else word
    
  # Build the line data
  utility.buildLines = (attributes) =>
    keys      = attributes.columns[1..]
    lineData  = _.map keys, (key, i) => utility.getLineData(attributes.data, i)
    lines     = _.map keys, (key, i) => context.line {name: key, values: lineData[i]}
    lines
  
  # Process lines
  # Add colors and toggle visibility of constructed lines
  utility.processLines = (attributes, lines) =>
    context.addColorsIfNecessary(lines)
    for line, i in lines
      line.color context.colorList()[i]
      if attributes.show? and attributes.show.length
        line.visible ( i in attributes.show )
    lines
    
  # Conveneince method for returning mapped data for a given index
  utility.getLineData = (data, index) =>
    formatter = d3.time.format("%Y-%m-%d")
    _.map data, (d) ->
      {
        date: formatter.parse(d[0])
        num:  d[(index+1)]
      }
  
  utility.mergeLines = (attributes, lines) =>
    lines = utility.addNewLinesAndRefresh lines, attributes
    lines = utility.removeStaleLines lines, attributes.columns
    line.setup() for line in lines
    lines
  

  # Create a new Quandlism line for every column in data that is not represented
  # in the lines array. Adds support for superset page reload
  #
  # lines - The existing line data
  # attributes  - The raw datasets data
  #
  # Returns a new array of lines, with the new columns attached
  utility.addNewLinesAndRefresh = (lines, attributes) =>
    for column, columnIndex in attributes.columns[1..]
      found = false
      lineData = utility.getLineData attributes.data, columnIndex
      for line, i in lines
        if line.name() is column
          found = true
          lines[i].values lineData.reverse()
          break
      unless found
        line = context.line { name: column, values: lineData}
        lines.push line

    lines
    
  # Removes any lines that do not have a name present in keys
  #
  # lines - An array of line objects
  # columns  - An array of strings
  # Returns a filtered array of line objects
  utility.removeStaleLines = (lines, columns) =>
    _.reject lines, (line) ->
       line.name() not in columns
       
    
  # Returns a two dimensional array representing the extent values for the y-axes
  # [ [y1min, y1max], [y2min, y2max] ]
  # start - The array index to start 
  # end   - The array index to end
  #
  # Returns an array with two values
  utility.getMultiExtent = (lines, start, end) =>
    # Don't calulate grouped extents unless second axes is visible  
    return [ utility.getExtent(lines, start, end) ] unless utility.shouldShowDualAxis(lines, start, end)
    
    groupedExtents = utility.getGroupMinMaxList(lines, min, max, start, end)
    exesMin = _.first groupedExtents
    exesMax = _.last  groupedExtents
    
    [ [ d3.min(exesMin, (m) -> m[0]), d3.max(exesMin, (m) -> m[1]) ], [ d3.min(exesMax, (m) -> m[0]), d3.max(exesMax, (m) -> m[1]) ] ]
  
  
  utility.getExtent = (lines, start, end) =>
    exes = (line.extent start, end for line in lines)
    [d3.min(exes, (m) -> m[0]), d3.max(exes, (m) -> m[1])]
  
  utility.getMultiExtent = (lines, start, end) =>
    min = Infinity
    max = -Infinity
    for line in lines
      val = line.extent(start, end)[1]
      continue  if val is Infinity or val is -Infinity
      min = val  if val < min
      max = val  if val > max
    exes_min = utility.getGroupMinMaxList(lines, min, max, start, end)[0]
    exes_max = utility.getGroupMinMaxList(lines, min, max, start, end)[1]
    [ [ d3.min(exes_min, (m) -> m[0]), d3.max(exes_min, (m) -> m[1]) ], [ d3.min(exes_max, (m) -> m[0]), d3.max(exes_max, (m) -> m[1]) ] ]
    
    
  utility.getGroupMinMaxList = (lines, min, max, start, end) =>
    _resultsMin = []
    _resultsMax = []
    for line in lines
      min_dis = Math.abs(min - _.last(line.extent(start, end)))
      max_dis = Math.abs(max - _.last(line.extent(start, end)))
      _resultsMin.push line.extent(start, end)  if min_dis < max_dis or min_dis is 0 
      _resultsMax.push line.extent(start, end)  if min_dis > max_dis or max_dis is 0
    [ _resultsMin, _resultsMax ]


    
  # Calculates the extend of the set of lines, using a date range, rather than indicies
  #
  # lines - An array of quandlism.line objects
  # startDate - the start of the date range
  # endDate - The end of the date range
  utility.getExtentFromDates = (lines, startDate, endDate) =>
    exes = (line.extentByDate startDate, endDate for line in lines)
    [d3.min(exes, (m) -> m[0]), d3.max(exes, (m) -> m[1])]
 
  # Returns the name of the month
  utility.getMonthName = (monthDigit) =>
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months[monthDigit]
    
  # Return a color
  #
  # i - The index of a line
  # 
  # Returns a string hex code
  utility.getColor = (i) =>
    context.colorList()[i]
    
  # Formats a number with commas
  #
  # num - The number to format
  #
  # Returns a string formatted numbers
  utility.formatNumberAsString = (num) =>
    num.toString().replace /\B(?=(\d{3})+(?!\d))/g, ","

  # Get the RGB value of the pixel at position m in canvas space
  #
  # m     - The mouse position relative to the canvas
  # ctx   - The canvas drawing context
  #
  # Returns a string represneting a hex color code
  utility.getPixelRGB = (m, ctx) =>
    px = ctx.getImageData(m[0], m[1], 1, 1).data
    rgb = d3.rgb px[0], px[1], px[2]
    rgb.toString()
  
      
  # Returns the label and divisor
  #
  # extent - The largest avlue of the graph, rounded, with zero decimal places
  #
  # Returns an object with label and divisor
  utility.getUnitAndDivisor = (extent) =>
    len = extent.toString().length
    if len <= 4
      {label: '', divisor: 1}
    else if len < 7
      {label: 'k', divisor: 1000}
    else if len <= 9
      {label: 'M', divisor: 1000000}
    else 
      {label: 'B', divisor: 1000000000}
      

  utility.getDateKey = (date) =>
    return null unless date?
    date.valueOf()
    
  utility.stageHeight = =>
    if context.dombrush()? then quandlism_stage.h*context.h() else context.h()*0.90
    
  utility.xAxisHeight = =>
    if context.dombrush()? then quandlism_xaxis.h*context.h() else context.h()*0.10
  
  # Return an array of indicies reffering to visible lines
  # Return empty array if no lines visible
  utility.visibleColumns = (lines) =>
    vis = []
    for line, i in lines
      vis.push i if line.visible() 
    vis

  # Determine if the lines with the indicies start and end should reveal two axes
  utility.shouldShowDualAxes = (start, end) =>
    lines = context.lines()
    return false unless lines? and lines instanceof Array 
    return false if lines.length is 1 or utility.visibleColumns(lines).length < 2
    utility.shouldShowDualAxesFromExtent utility.getExtent(lines, start, end)
    
  utility.shouldShowDualAxesFromExtent = (exe) =>
    return false if context.lines().length is 1 or utility.visibleColumns(context.lines()).length < 2
    min = parseFloat _.first(exe)
    max = parseFloat _.last(exe)
    if min is 0 or max is 0
      return Math.abs(max - min) > context.dualLimit()*100
    max / min > context.dualLimit()
    
    
    
    
  utility