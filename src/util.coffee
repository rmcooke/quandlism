QuandlismContext_.utility = () ->
  
  @context = @
  
  utility = () -> return

  # Create lines objects
  #
  # data - Raw data 
  #
  # Returns an array of quandlism lines
  utility.createLines = (data) =>
    keys = data.columns[1..]
    _.map keys, (key, i) =>
      @context.line({
        name: key
        values: _.map data.data, (d) ->
          { 
            date: d[0]
            num:  +d[(i+1)]
          }
      })
      
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
 
 
  # Return a color
  #
  # i - The index of a line
  # 
  # Returns a string hex code
  utility.getColor = (i) =>
    s = @context.colorScale()
    s i
  
    
  utility