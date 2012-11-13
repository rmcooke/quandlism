   
quandlism.context = () ->
  context       = new QuandlismContext()
  w             = null
  h             = null
  dom           = null
  domstage      = null
  dombrush      = null
  domlegend     = null
  domtooltip    = null
  endPercent    = 0.80
  padding       = 0 
  startPoint    = 0.75
  event         = d3.dispatch('respond', 'adjust', 'toggle', 'refresh')
  colorScale    = d3.scale.category20()
  lines         = []
  
  # Attach Data
  # Conveneince method for attaching lines datum for each declared DOM element
  context.attachData = (lines_) =>
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
    
    
  # Expose attributes via getters and settesr
  
  
  context.lines = (_) =>

    if not _? then return lines
    lines = _
    context
    
  context.colorScale = (_) =>
    if not _? then return colorScale
    colorScale = _
    context
    
  context.endPercent = (_) =>
    if not _? then return endPercent
    endPercent = _
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
    
  context.domtooltip = (_) =>
    if not _? then return domtooltip
    domtooltip = _
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