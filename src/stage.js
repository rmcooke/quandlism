QuandlismContext_.stage = function() {
  var context = this,
  lines = [],
  canvasId = 'canvas-stage',
  width = Math.floor(context.w()*quandlism_stage.w), 
  height = Math.floor(context.h()*quandlism_stage.h)
  xScale = d3.scale.linear(),
  yScale = d3.scale.linear(),
  extent = null,
  canvas = null,
  ctx = null,
  colorRange = [],
  start = 0, 
  end = 0;
  
  
  function stage(selection) {
    
    // Extract line data    
    lines = selection.datum();
        
    // Append div for y-axis and call yaxis from context
    selection.append('div').datum(lines).attr('class', 'y axis').attr('id', 'y-axis-stage').call(context.yaxis().active(true).orient('left'));
    
    // Append div for stage-holder (to hold x-axis, stage data and brush)
    div = selection.append('div').attr('class', 'stage-holder');
  
    // Append x-axis and stage
    div.append('canvas').attr('width', width).attr('height', height).attr('class', 'stage').attr('id', canvasId);
    div.append('div').datum(lines).attr('class', 'x axis').attr('id', 'x-axis-stage').call(context.axis().active(true));    
    
    // If Legend DOM is defined, create the legend. Style w/ CSS
    if (context.domlegend() != null) {
      d3.select(context.domlegend()).datum(lines).call(context.legend());
    }
    
    // Get references to canvas and canvas context for drawing
    canvas = selection.select('.stage');
    ctx = canvas.node().getContext('2d');
    
    // Calculate initial start / end points
    end = lines[0].length();
    start = Math.floor(lines[0].length()*.80);

    // Draw the stage
    draw();
    
    

    
    // After drawing the first time, save the computed color range for easy look up later!
    colorRange = context.colorScale().range();

    /**
     * Draws the stage
     * Calculates extents, given the start and end, adjusts the axis domain/ranges and draws the path
     */
    function draw() {

      exes = _.map(lines, function(line, j) {
        return line.extent(start, end);
      });  
      extent = [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]
    
      // For single points, edit extent so circle is not drawn at the corner
      xStart = 0;
      if (start == end) {
        extent = [0, extent[0]*1.25];
        xStart = Math.floor(width/2);
      }
          
      yScale.domain([extent[0], extent[1]]); 
      yScale.range([height, 0 ]);
    
      xScale.domain([start, end]);
      xScale.range([xStart, width]);
      
      ctx.clearRect(0, 0, width, height);
      
      _.each(lines, function(line, j) {        
        if (start == end) {
          line.drawPoint(context.utility().getColor(j), ctx, xScale, yScale, start);
        } else {
          line.drawPath(context.utility().getColor(j), ctx, xScale, yScale, start, end, 1);
        }
      });
      
    }
    
    
  
    
    /**
     * Callbacks
     */
    
    /**
     * Callback for context.respond event
     *
     * Clears the drawing context, recalculates width / height and re-draws
     */
    context.on('respond.stage', function() {
      ctx.clearRect(0, 0, width, height);
      width = Math.floor(context.w()*quandlism_stage.w), height = Math.floor(context.h()*quandlism_stage.h);
      canvas.attr('width', width).attr('height', height);
      draw();
    });
    
    /**
     * Callback for context.adjust event
     *
     * Recalculates start and end points and re-draws the stage
     */
    context.on('adjust.stage', function(x1, x2) {
      start = (x1 > 0) ? x1 : 0;
      end = (x2 < lines[0].length()) ? x2 : lines[0].length() -1;
      draw();
    });
    
    
    /**
     * Callback for context.toggle event
     *
     * Only redraw. Visiblity handled by line object
     */
    context.on('toggle.stage', function() {
      draw();
    });
        
  
    // Use d3 to get mouse co-ords
    d3.select('#' + canvasId).on('mousemove', function(e) {
      m = d3.mouse(this);
      px = ctx.getImageData(m[0], m[1], 1, 1).data;
      rgb = d3.rgb(px[0], px[1], px[2]);
      hex = rgb.toString();
      if (hex !== '#000000') {
        i = _.indexOf(colorRange, hex);
        if (i !== -1) {
          line = lines[i];
          x = Math.ceil(xScale.invert(m[0]));
          console.log(line.name() + ' - ' + line.valueAt(x));
        }
      }

    });

      
    // Draw the brush inside the stage-holder
    div.call(context.brush());
    
      
      
  }

  
  return stage;
}