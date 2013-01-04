QuandlismContext_.utility = () ->
  
  context = @
  
  utility = () -> return


  # Truncate a word to a max 
  utility.truncate = (word, chars) =>
    if word.length > chars then "#{word.substring(0, chars)}..." else word
    
  # Create lines objects
  #
  # data - Raw data 
  #
  # Returns an array of quandlism lines
  utility.createLines = (data) =>
    # Get line data
    keys = data.columns[1..]        
    lineData = _.map keys, (key, i) => utility.getLineData data.data, i
    
    # If first time called
    if not context.lines().length 
      defaultColumn = utility.defaultColumn data.code
      # Build lines
      lines = _.map keys, (key, i) =>
        context.line {name: key, values: lineData[i]}
      # Only draw the first line
      for line, i in lines
        line.visible false if i isnt defaultColumn
    else            
      lines = context.lines()
      if lines.length is keys.length
        # If this is just a refresh, and columns have not been added/removed, refresh the data
        line.values lineData[i].reverse() for line, i in lines
      else
        # Otherwise, superset operation, so add remove columns as necessary
        lines = utility.mergeLines lines, data, keys
    lines
    
  # Conveneince method for returning mapped data for a given index
  utility.getLineData = (data, index) =>
    _.map data, (d) ->
      {
        date: d[0]
        num: +d[(index+1)]
      }
  

  # Convenience method for refreshing line data
  # Removes any lines present in lines that is NOT present in newLineData
  # Adds any lines from newLineData that are NOT in lines, to lines
  # lines - Array of existing line data
  # newLineData - Raw data for new lines
  #
  # Returns an array of lines 
  utility.mergeLines = (lines, data, keys) =>
    lines = utility.addNewLines lines, data
    lines = utility.removeLines lines, keys
    lines
    

  # Create a new Quandlism line for every column in data that is not represented
  # in the lines array. Adds support for superset page reload
  #
  # lines - The existing line data
  # data  - The raw datasets data
  #
  # Returns a new array of lines, with the new columns attached
  utility.addNewLines = (lines, data) =>
    for column, columnIndex in data.columns[1..]
      unless _.find(lines, (line) -> line.name() is column)
        lineData = utility.getLineData data.data, columnIndex
        line = context.line { name: column, values: lineData }
        line.visible false
        lines.push line
    lines
    
  # Removes any lines that do not have a name present in keys
  #
  # lines - An array of line objects
  # keys  - An array of strings
  # Returns a filtered array of line objects
  utility.removeLines = (lines, keys) =>
    _.reject lines, (line) ->
       line.name() not in keys
       
  # Get the default column to show when the dataset is drawn
  # 
  # code - The dataset code
  #
  # Returns 0 if code is not present, or if dataset is not a futures dataset. Returns 4 otherwis
  utility.defaultColumn = (code) ->
    return 0 unless code?
    if code.match /^FUTURE_/ then return 3 else return 0
    
  # Calculates the minimum and maxium values for all of the lines in the lines array
  # between the index values start, and end
  #
  # lines - An array of quandlism.line objects
  # start - The array index to start 
  # end   - The array index to end
  #
  # Returns an array with two values
  utility.getExtent = (lines, start, end) =>
    exes = (line.extent start, end for line in lines)
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
    if len <= 3
      {label: '', divisor: 1}
    else if len <= 6
      {label: 'K', divisor: 1000}
    else if len <= 9
      {label: 'M', divisor: 1000000}
    else 
      {label: 'B', divisor: 1000000000}
      
  # Returns a string that can be parsed in the same format as the dates in the active graph.
  # The number of - present indicate one of two date formats available.
  # date - An example date
  #  
  # Returns a string representing the date format
  utility.dateFormat = (date) ->
    hyphenCount = date.split('-').length - 1
    switch hyphenCount
      when -1 then dateString = '%Y'
      when 2  then dateString = '%Y-%m-%d'
      else throw("Unknown date format: #{hyphenCount} #{date}")
    dateString

  # Parses the input date into a readable format for D3
  # String format is a function of the datasets frequency parameter
  #   
  # date - A date to be parsed
  #   
  # Return a time formatter
  utility.parseDate = (date) ->
    dateString = @.dateFormat date
    d3.time.format(dateString).parse;
    
  utility