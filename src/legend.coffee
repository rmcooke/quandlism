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
      .append('a').attr('href', 'javascript:;').attr('data-line-id', (line) -> line.id()).attr('style', (line) -> "background-color: #{context.utility().getColor line.id()}")
      .text((line) -> line.name())
  

    # When the data is refreshed, get the new lines
    context.on "refresh.legend", () ->
      lines = selection.datum()

    # Event listenr for clicks on the legend. Dispatch toggle event
    
    selection.selectAll('a').on "click", (d, i) =>
      e = d3.event
      el = e.target
      id = el.getAttribute 'data-line-id'
      e.preventDefault()
      if lines[id]?
        if lines[id].toggle() then $(el).addClass('off').attr("style", 'background-color: none;') else $(el).removeClass('off').attr("style", "background-color: #{context.utility().getColor id}")
        context.toggle()
      return


  legend