QuandlismContext_.legend = () ->
  context   = @
  legend_   = null
  lines     = []
  
  
  legend = (selection) =>
    
    # Extract lines and remove any child elements in the selection
    
    lines = selection.datum()
    selection.selectAll('li').remove()
    
    # Use d3 joines to create the legend
    legend_ = selection.selectAll('li').data(lines)
    
    legend_.enter().append('li').append('a').attr('href', "javascript:;").attr('data-line-id', (line) -> line.id()).text((line) -> line.name())
    legend_.exit().remove()


    # When the data is refreshed, get the new lines
    context.on "refresh.legend", () ->
      lines = selection.datum()

    # Event listenr for clicks on the legend. Dispatch toggle event
    
    selection.on "click", (d, i) =>
      e = d3.event
      e.preventDefault()
      lineId = e.target.getAttribute 'data-line-id'
      vis = lines[lineId].toggle()
      context.toggle()
      return


  legend