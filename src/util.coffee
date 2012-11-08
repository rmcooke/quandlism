QuandlismContext_.utility = () ->
  
  @context = @
  
  @utility = () -> return

  # Create lines objects
  #
  # data - Raw data 
  #
  # Returns an array of quandlism lines
  @utility.createLines = (data) =>
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
      
  
  @utility