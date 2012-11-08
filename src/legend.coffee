QuandlismContext_.legend = () ->
  context   = @
  legend_   = null
  lines     = []
  
  
  legend = (selection) ->
    
    # Extract lines and remove any child elements in the selection
    lines = selection.datum()
    selection.selectAll('li').remove()
    
    # d3 joins
    legend_ = selection.selectAll('li').data(lines)
      .enter()
      .append('li')
      .append('a').attr('href', 'javascript:;').attr('style', (line) -> "background-color: #{context.utility().getColor line.id()}").attr('data-line-id', (line) -> line.id())
      .text((line) -> line.name())
  

    # When the data is refreshed, get the new lines
    context.on "refresh.legend", () ->
      lines = selection.datum()

    # Event listenr for clicks on the legend. Dispatch toggle event
    
    selection.selectAll('a').on "click", (d, i) =>
      e = d3.event
      e.preventDefault()
      id = e.target.getAttribute 'data-line-id'
      lines[id].toggle() if lines[id]?
      context.toggle() if lines[id]?
      return


  legend