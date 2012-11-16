QuandlismContext_.legend = () ->
  context   = @
  lines     = []
  
  legend = (selection) ->
    
    # Extract lines and remove any child elements in the selection
    lines = selection.datum()
    selection.selectAll('li').remove()
        
    # d3 joins
    selection.selectAll('li').data(lines)
      .enter()
      .append('li')
        .attr('style', (line) -> "color: #{line.color()}")
      .append('a', ':first-child')
        .attr('href', 'javascript:;')
        .attr('data-line-id', (line) -> line.id())
      .text((line) -> line.name())

    # Event listenr for clicks on the legend. Dispatch toggle event
    
    selection.selectAll('a').on "click", (d, i) =>
      e = d3.event
      el = e.target
      id = el.getAttribute 'data-line-id'
      e.preventDefault()
      if lines[id]?
        if lines[id].toggle() is false then $(el).parent().addClass 'off' else $(el).parent().removeClass 'off'
        context.toggle()
      return
      
    return
      
  legend