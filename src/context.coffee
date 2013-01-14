   
quandlism.context = () ->
  context       = new QuandlismContext()
  w             = null
  h             = null
  dom           = null
  domstage      = null
  dombrush      = null
  domlegend     = null
  domtooltip    = null
  padding       = 0 
  startPoint    = 0.75
  event         = d3.dispatch('respond', 'adjust', 'toggle', 'refresh')
  colorList     = ['#e88033', '#4eb15d', '#c45199', '#6698cb', '#6c904c', '#e9563b', '#9b506f', '#d2c761', '#4166b0', '#44b1ae']
  lines         = []
  
  # Attach Data
  # Conveneince method for attaching lines datum for each declared DOM element
  context.attachData = (lines_) =>    
    # Set colors whenever data is attached, to support cases when a new line is added
    context.addColorsIfNecessary(lines_)
    line.color(colorList[i]) for line, i in lines_
            
    lines = lines_
        
    d3.select(domstage).datum lines if domstage
    d3.select(dombrush).datum lines if dombrush
    d3.select(domlegend).datum lines if domlegend 
    context


  # render
  # Conveneince method for calling method for each declared DOM element
  context.render = () =>
    d3.select(domstage).call context.stage() if domstage
    d3.select(dombrush).call context.brush() if dombrush
    d3.select(domlegend).call context.legend() if domlegend 
    context
  
  # Update the height and width 
  context.build = () =>
    w = $(dom).width()
    h = $(dom).height()
    context
    
  # Initializers
  context.chart = (container, brush_) =>
    false
    
  # Intiailze legend?
  context.legend = (container) =>
    false
    
  # Convenience method for building the quanlism chart with ONLY a container selector
  # Remove all children of container and creates brush and stage elements
  #
  # container - The jQuery selector 
  # brush     - Boolean indicating whether or not to include the brush
  #
  # Return self
  context.setupWithContainer = (container, brush_) =>
    throw 'Invalid container' if not container.length
    brush = brush_ ? true
    # Add ID to container if not present
    container.children().remove()
    container.attr('id', "quandlism-#{++quandlism_id_ref}") if not container.attr('id')?
    dom = "##{container.attr('id')}"
    stageId = "quandlism-stage-#{++quandlism_id_ref}"
    container.append "<div class='stage' id='#{stageId}'></div>"
    domstage = "##{stageId}"
    if brush
      brushId = "quandlism-brush-#{++quandlism_id_ref}"
      container.append "<div class='brush' id='#{brushId}'></div>"
      dombrush = "##{brushId}"
    context  
    
  # Setup the legend via selector
  context.legendWithSelector = (container) =>
    throw 'Invalid container' if not container.length
    container.attr('id', "quandlism-legend-#{++quandlism_id_ref}") if not container.attr('id')
    domlegend = "##{container.attr('id')}"
    context

      
  # If the number of lines exceeds the size of colorList, increase the number of stored hex codes
  # by applying functions to the existing codes until there are lines.length number of unique codes
  context.addColorsIfNecessary = (lines_) =>
    colorsNeeded = lines_.length-colorList.length
    return if colorsNeeded < 0
    brightness = 0.1
    i = 0
    while i < colorsNeeded
      rgb = d3.rgb(colorList[i]).brighter brightness
      colorList.push rgb.toString()
      i++
    return   
    
    
  # Expose attributes via getters and settesr
  context.lines = (_) =>
    if not _ then return lines
    lines = _
    context
    
  context.colorList = (_) =>
    if not _? then return colorList
    colorList = _
    context
  
  context.startPoint = (_) =>
    if not _? then return startPoint
    startPoint = _
    context
  
  context.w = (_) =>
    if not _? then return w
    w = _
    context
    
  context.h = (_) =>
    if not _? then return h
    h = _
    context
    
  context.dom = (_) =>
    if not _? then return dom
    dom = _
    context
    
  context.domstage = (_) =>
    if not _? then return domstage
    domstage = _
    context
    
  context.dombrush = (_) =>
    if not _? then return dombrush
    dombrush = _
    context
    
  context.domlegend = (_) =>
    if not _? then return domlegend
    domlegend = _
    context
    
  context.padding = (_) =>
    if not _? then return padding
    padding = _
    context
    
  # Event listner and dispatchers
  
 
  # Respond to page resize no more than once every 500ms
  context.respond = _.throttle () => event.respond.call context, 500
  
  # Respond to adjust event
  context.adjust = (x1, x2) =>
    event.adjust.call context, x1, x2  
    
  # Responds to toggle event
  context.toggle = () =>
    event.toggle.call context
    
  # Responds to refresh event.
  context.refresh =() =>
    event.refresh.call context
    
  context.on = (type, listener) =>
    if not listener? then return event.on type
    event.on type, listener
    context

 
  # Listen for page resize
  d3.select(window).on 'resize', () =>
    d3.event.preventDefault()
    if dom
      w0 = $(dom).width()
      h0 = $(dom).height()
      if w isnt w0 or h isnt h0
        w = w0
        h = h0
        context.respond()
    return
  
  
  context
  
  
class QuandlismContext

QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype