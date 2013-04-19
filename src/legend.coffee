QuandlismContext_.legend = () ->
  context   = @
  lines     = []
  
  legend = (selection) ->
    
    buildLegend = () ->
      lines = selection.datum()
    
      # Extract lines and remove any child elements in the selection
      selection.selectAll('li').remove()
        
      # d3 joins
      selection.selectAll('li').data(lines)
        .enter()
        .append('li')
          .attr('style', (line) -> "color: #{line.color()}")
          .attr('class', (line) -> "off" if not line.visible())
        .append('a', ':first-child')
          .attr('href', 'javascript:;')
          .attr('data-line-id', (line) -> line.id())
        .text((line) -> line.legendName())
        
      selection.selectAll('a').on "click", (d, i) =>
        e = d3.event
        el = e.target
        id = parseInt el.getAttribute 'data-line-id'
        e.preventDefault()
        line = _.find lines, (l) => l.id() is id
        if line?
          if line.toggle() is false then $(el).parent().addClass 'off' else $(el).parent().removeClass 'off'
          context.toggle()
        return
      return

    # call setup funciton when legend is intialized
    buildLegend()
    
    
    # On refersh, rebuild the legend
    context.on 'refresh.legend', ->
      buildLegend()
      return 
      
    # On toggle, rebuild the legend
    context.on 'toggle.legend', ->
      buildLegend()
      return
      
    return
      
  legend