   
quandlism.context = () ->
  @context      = new QuandlismContext()
  @w            = null
  @h            = null
  @dom          = null
  @domstage     = null
  @dombrush     = null
  @domlegend    = null
  @domtooltip   = null
  @endPercent   = 0.8
  @event        = d3.dispatch('respond', 'adjust', 'toggle', 'refresh')
  @colorScale   = d3.scale.category20()
  
  
  # Attach Data
  # Conveneince method for attaching lines datum for each declared DOM element
  @context.attachData = (lines) =>
    d3.select(@domstage).datum lines if @domstage
    d3.select(@dombrush).datum lines if @dombrush

    @context
  
  # render
  # Conveneince method for calling method for each declared DOM element
  @context.render = () =>
    d3.select(@domstage).call @context.stage() if @domstage
    d3.select(@dombrush).call @context.brush() if @dombrush
    @context
  
  
  @context.build = () =>
    @w = $(@dom).width()
    @h = $(@dom).height()
    @context
  # Expose attributes via getters and settesr
  
  @context.colorScale = (_) =>
    if not _ then return @colorScale
    @colorScale = _
    @context
    
  @context.endPercent = (_) =>
    if not _ then return @endPercent
    @endPercent = _
    @context
  
  @context.w = (_) =>
    if not _ then return @w
    @w = _
    @context
    
  @context.h = (_) =>
    if not _ then return @h
    @h = _
    @context
    
  @context.dom = (_) =>
    if not _ then return @dom
    @dom = _
    @context
    
  @context.domstage = (_) =>
    if not _ then return @domstage
    @domstage = _
    @context
    
  @context.dombrush = (_) =>
    if not _ then return @dombrush
    @dombrush = _
    @context
    
  @context.domlegend = (_) =>
    if not _ then return @domlegend
    @domlegend = _
    @context
    
    
  # Event listner and dispatchers
  
 
  # Respond to page resize no more than once every 500ms
  @context.respond = _.throttle () => @event.respond.call @context, 500
  
  # Respond to adjust event
  @context.adjust = (x1, x2) =>
    @event.adjust.call @context, x1, x2
    
  @context.on = (type, listener) =>
    if arguments.length < 2 then return @event.on type
    @event.on type, listener
    @context

 
  # Listen for page resize
  d3.select(window).on 'resize', () =>
    d3.event.preventDefault()
    if @dom
      w0 = $(@dom).width()
      h0 = $(@dom).height()
      if @w isnt w0 or @h isnt h0
        @w = w0
        @h = h0
        @context.respond()
    return
  
  
  @context
  
  
class QuandlismContext

QuandlismContext_ = QuandlismContext.prototype = quandlism.context.prototype